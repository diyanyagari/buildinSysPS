import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MapKalenderToHariLibur } from './map-kalender-to-hari-libur.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-map-kalender-to-hari-libur',
    templateUrl: './map-kalender-to-hari-libur.component.html',
    styleUrls: ['./map-kalender-to-hari-libur.component.scss'],
    providers: [ConfirmationService]
})
export class MapKalenderToHariLiburComponent implements OnInit {
    selected: MapKalenderToHariLibur;
    listData: MapKalenderToHariLibur[];
    kodeTanggal: MapKalenderToHariLibur[];
    kodeHariLibur: MapKalenderToHariLibur[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    page: number;
    rows: number;
    form: FormGroup;
    totalRecords: number;
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des' ];
    kdprof:any;
     kddept:any;
    codes: any[];
    listData2: any[];
    items: any;
    laporan: boolean = false;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


    ngOnInit() {
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;
    
       this.items = [
       {
          label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
            this.downloadPdf();
        }
    },
    {
      label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
        this.downloadExcel();
    }
},

];

if (this.page === undefined || this.page === null || this.rows === undefined || this.rows === null) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
}
this.formAktif = true;
this.get(this.page, this.rows, '');
this.form = this.fb.group({
    'kdTanggal': new FormControl('', Validators.required),
    'kdHariLibur': new FormControl('', Validators.required),
    'statusEnabled': new FormControl('', Validators.required)
});
this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kalender&select=tanggal,id&rows=5000').subscribe(res => {
    this.kodeTanggal = [];
    this.kodeTanggal.push({ label: '--Pilih Tanggal--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
//                if (this.allowYear(res.data.data[i].tanggal)){
    this.kodeTanggal.push({ label: this.getDate(res.data.data[i].tanggal), value: res.data.data[i].id.kdTanggal })
 //               }
};
});
this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=HariLibur&select=namaHariLibur,id&rows=5000').subscribe(res => {
    this.kodeHariLibur = [];
    this.kodeHariLibur.push({ label: '--Pilih Hari Libur--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
        this.kodeHariLibur.push({ label: res.data.data[i].namaHariLibur, value: res.data.data[i].id.kode })
    };
});
}
get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
        this.listData = table.MapKalenderToHariLibur;
        this.totalRecords = table.totalRow;
    });
}

//    allowYear(date){
//        return (new Date(date * 1000).getFullYear() == new Date().getFullYear());
//    }


getDate(date){
    let dd = new Date(date * 1000);

    let d =  dd.getDate();
    let m = dd.getMonth();
    let y = dd.getFullYear();

    return ((d < 10) ? ('0'+d) : d) + ' ' + this.month[m]  + ' ' + y;  
}

cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaMapKalenderToHariLibur&sort=desc&namaMapKalenderToHariLibur=' + this.pencarian).subscribe(table => {
        this.listData = table.data.MapKalenderToHariLibur;
    });
}
confirmDelete() {
    let kdTanggal = this.form.get('kdTanggal').value;
    if (kdTanggal == null || kdTanggal == undefined || kdTanggal == "") {
        this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Map Kalender To Hari libur');
    } else {
        this.confirmationService.confirm({
            message: 'Apakah data akan di hapus?',
            header: 'Konfirmasi Hapus',
            icon: 'fa fa-trash',
            accept: () => {
                this.hapus();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
            }
        });
    }
}
validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
        }
    });
}
onSubmit() {
    if (this.form.invalid) {
        this.validateAllFormFields(this.form);
        this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
        this.simpan();
    }
}
confirmUpdate() {
    this.confirmationService.confirm({
        message: 'Apakah data akan diperbaharui?',
        header: 'Konfirmasi Pembaharuan',
        accept: () => {
            this.update();
        },
        reject: () => {
            this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
        }
    });
}
setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
}
update() {
        // let kdTanggal = this.setTimeStamp(this.form.get('kdTanggal').value)

        // let formSubmit = this.form.value;
        // formSubmit.kdTanggal = kdTanggal;
        this.httpService.update(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            // let kdTanggal = this.setTimeStamp(this.form.get('kdTanggal').value)

            // let formSubmit = this.form.value;
            // formSubmit.kdTanggal = kdTanggal;
            this.httpService.post(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

    }

    reset() {
        this.formAktif = true;
        this.ngOnInit();
    }
    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);

    }
    clone(cloned: MapKalenderToHariLibur): MapKalenderToHariLibur {
        let hub = new InisialMapKalenderToHariLibur();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialMapKalenderToHariLibur();
        fixHub = {
            'kdTanggal': hub.kdTanggal,
            'kdHariLibur': hub.kdHariLibur,
            'statusEnabled': hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/del/' + deleteItem.kdTanggal + '/' + deleteItem.kdHariLibur).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.get(this.page, this.rows, this.pencarian);
        });
        this.reset();
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }

    timeStampToDate(timestamp){
        let d = new Date(timestamp*1000);
        // let f = new SimpleDateFormat("dd/MM/yyyy");
        // let formatteddate = f.format(d);
        let monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        // let formatteddate = d.getDay() + ' ' + monthname[d.getMonth()] + ' ' + d.getFullYear();
        let formatteddate = d;
        return formatteddate;
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findAll?page='+this.page+'&rows='+this.rows+'&dir=hariLibur.namaHariLibur&sort=desc').subscribe(table => {
          this.listData = table.MapKalenderToHariLibur;
          this.codes = [];

          for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kdHariLibur,
            tanggal: this.timeStampToDate(this.listData[i].tanggal),
            namaHariLibur: this.listData[i].namaHariLibur,
            statusEnabled: this.listData[i].statusEnabled

        })
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, "Map Kalender To Hari Libur");
});

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/mapKalenderToHariLibur/laporanMapKalenderToHariLibur.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
        window.open(cetak);
//         var col = ["Tanggal", "Hari Libur","Status Aktif"];
//         this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findAll?').subscribe(table => {
//           this.listData2 = table.MapKalenderToHariLibur;
//           this.codes = [];

//           for (let i = 0; i < this.listData2.length; i++) {
//         // if (this.listData[i].statusEnabled == true){
//           this.codes.push({

//             // kode: this.listData2[i].kdMapping.kdMapping,
//             tanggal: this.getDate(this.listData2[i].tanggal),
//             namaHariLibur: this.listData2[i].namaHariLibur,
//             statusEnabled: this.listData2[i].statusEnabled

//         })
//         // }
//     }
//     this.fileService.exportAsPdfFile("Master Map Kalender To Hari Libur", col, this.codes, "Map Kalender To Hari Libur");

// });
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/mapKalenderToHariLibur/laporanMapKalenderToHariLibur.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmMapKalenderToHariLibur_laporanCetak');

        // let cetak = Configuration.get().report + '/mapKalenderToHariLibur/laporanMapKalenderToHariLibur.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
      }
      tutupLaporan() {
        this.laporan = false;
    }
}

class InisialMapKalenderToHariLibur implements MapKalenderToHariLibur {

    constructor(
        public kdTanggal?,
        public kdHariLibur?,

        public kode?,
        public id?,
        public kdProfile?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        ) { }

}