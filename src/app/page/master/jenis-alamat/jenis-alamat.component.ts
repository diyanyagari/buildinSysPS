import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisAlamat } from './jenis-alamat.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-jenis-alamat',
    templateUrl: './jenis-alamat.component.html',
    styleUrls: ['./jenis-alamat.component.scss'],
    providers: [ConfirmationService]
})
export class JenisAlamatComponent implements OnInit {
    selected: JenisAlamat;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string = '';
    kodeGolonganPegawai: JenisAlamat[];
    ruangan: JenisAlamat[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    report: any;
    toReport: any;
    totalRecords: number;

    codes: any[];

    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    }


    ngOnInit() {
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;

        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
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
        this.formAktif = true;
        this.getPage(this.page, this.rows, this.pencarian);
        this.versi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaJenisAlamat': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });

        this.getSmbrFile();
    }
    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}
    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisalamat/findAll?').subscribe(table => {
            this.listData = table.JenisAlamat;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
            this.codes.push({

                kode: this.listData[i].kode.kode,
                namaJenisAlamat: this.listData[i].namaJenisAlamat,
                reportDisplay: this.listData[i].reportDisplay,
                kodeExternal: this.listData[i].kodeExternal,
                namaExternal: this.listData[i].namaExternal,
                statusEnabled: this.listData[i].statusEnabled

            })
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'JenisAlamat');
});

    }

    valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }

//     downloadPdf() {
//         var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
//         this.httpService.get(Configuration.get().dataMasterNew + '/jenisalamat/findAll?').subscribe(table => {
//             this.listData = table.JenisAlamat;
//             this.codes = [];

//             for (let i = 0; i < this.listData.length; i++) {
//         // if (this.listData[i].statusEnabled == true){
//             this.codes.push({

//                 kode: this.listData[i].kode.kode,
//                 namaJenisAlamat: this.listData[i].namaJenisAlamat,
//                 reportDisplay: this.listData[i].reportDisplay,
//                 kodeExternal: this.listData[i].kodeExternal,
//                 namaExternal: this.listData[i].namaExternal,
//                 statusEnabled: this.listData[i].statusEnabled

//             })
//         // }
//     }
//     this.fileService.exportAsPdfFile("Master JenisAlamat", col, this.codes, "JenisAlamat");

// });

//     }

downloadPdf(){
    let b = Configuration.get().report + '/jenisAlamat/laporanJenisAlamat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
}

cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/jenisAlamat/laporanJenisAlamat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisAlamat_laporanCetak');

        // let b = Configuration.get().report + '/jenisAlamat/laporanJenisAlamat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }
    tutupLaporan() {
        this.laporan = false;
    }

    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisalamat/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.JenisAlamat;
            this.totalRecords = table.totalRow;
        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisalamat/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisAlamat&sort=desc&namaJenisAlamat=' + this.pencarian).subscribe(table => {
            this.listData = table.JenisAlamat;
        });
    }

    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    //  setPageRow(page, rows) {
    //     if(page == undefined || rows == undefined) {
    //         this.page = Configuration.get().page;
    //         this.rows = Configuration.get().rows;
    //     } else {
    //         this.page = page;
    //         this.rows = rows;
    //     }
    // }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Alamat');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapus();
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
            }
        });
    }
    update() {
        this.httpService.update(Configuration.get().dataMasterNew + '/jenisalamat/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/jenisalamat/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getPage(this.page, this.rows, this.pencarian);
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
    clone(cloned: JenisAlamat): JenisAlamat {
        let hub = new InisialJenisAlamat();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialJenisAlamat();
        fixHub = {
            "kode": hub.kode.kode,
            "namaJenisAlamat": hub.namaJenisAlamat,
            "reportDisplay": hub.reportDisplay,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/jenisalamat/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });


    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialJenisAlamat implements JenisAlamat {

    constructor(
        public jenisAlamat?,
        public id?,
        public kdProfile?,
        public kode?,
        public kdJenisAlamat?,
        public kodeJenisAlamat?,
        public namaJenisAlamat?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?
        ) { }

}
