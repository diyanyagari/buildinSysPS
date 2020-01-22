import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { LevelTingkat } from './level-tingkat.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-level-tingkat',
    templateUrl: './level-tingkat.component.html',
    styleUrls: ['./level-tingkat.component.scss'],
    providers: [ConfirmationService]
})
export class LevelTingkatComponent implements OnInit {
    selected: LevelTingkat;
    listData: LevelTingkat[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    departemen: LevelTingkat[];
    kodeLevel: LevelTingkat[];
    versi: any;
    form: FormGroup;

    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;

    codes: any[];
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    kdprof:any;
    kddept:any;
    laporan: boolean = false;
    itemsChild: any;
    kdLevelHead:any;
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

        this.itemsChild = [
        {
            label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                this.downloadPdfChild();
            }
        },
        {
            label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                this.downloadExcelChild();
            }
        },
        ];
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.versi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaLevelTingkat': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdDepartemen': new FormControl(''),
            'kdLevelTingkatHead': new FormControl(null),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        // this.form.get('noUrut').disable();

        if (this.index == 0){
            this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?page=1&rows=300&dir=namaLevelTingkat&sort=asc').subscribe(table => {
                this.listTab = table.LevelTingkat;
                let i = this.listTab.length
                while (i--) {
                    if (this.listTab[i].statusEnabled == false) { 
                        this.listTab.splice(i, 1);
                    } 
                }
            });
        };
        let dataIndex = {
            "index": this.index
        }
        this.onTabChange(dataIndex);
        this.getSmbrFile();
    }

    getSmbrFile(){
      this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
       this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }

  onTabChange(event) {
    let data;
    this.index = event.index;
    if (event.index > 0){
        let index = event.index-1;
        data = this.listTab[index].kode.kode;
        this.kdLevelHead = data;
        this.form.get('kdLevelTingkatHead').setValue(data);
    } else {
        data = '';
        this.form.get('kdLevelTingkatHead').setValue(null);
    }
    this.pencarian = '';
    this.get(this.page,this.rows,this.pencarian, data);
    this.valuechange('');
    this.formAktif = true;
    // this.form.get('noUrut').disable();
}
valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
}

downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?').subscribe(table => {
        this.listData = table.LevelTingkat;
        this.codes = [];

        for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
            this.codes.push({

                kode: this.listData[i].kode.kode,
                namaLevelTingkatHead: this.listData[i].namaLevelTingkatHead,
                namaLevelTingkat: this.listData[i].namaLevelTingkat,
                noUrut: this.listData[i].noUrut,
                reportDisplay: this.listData[i].reportDisplay,
                kodeExternal: this.listData[i].kodeExternal,
                namaExternal: this.listData[i].namaExternal,
                statusEnabled: this.listData[i].statusEnabled

            })
        // }
    }

    this.fileService.exportAsExcelFile(this.codes, 'LevelTingkat');
});

}

downloadPdf() {
    let cetak = Configuration.get().report + '/levelTingkat/laporanLevelTingkat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
//         var col = ["Kode", "Parent", "Nama", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
//         this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?').subscribe(table => {
//             this.listData = table.LevelTingkat;
//             this.codes = [];

//             for (let i = 0; i < this.listData.length; i++) {
//         // if (this.listData[i].statusEnabled == true){
//             this.codes.push({

//                 kode: this.listData[i].kode.kode,
//                 namaLevelTingkatHead: this.listData[i].namaLevelTingkatHead,
//                 namaLevelTingkat: this.listData[i].namaLevelTingkat,
//                 noUrut: this.listData[i].noUrut,
//                 reportDisplay: this.listData[i].reportDisplay,
//                 kodeExternal: this.listData[i].kodeExternal,
//                 namaExternal: this.listData[i].namaExternal,
//                 statusEnabled: this.listData[i].statusEnabled

//             })
//         // }
//     }

//     this.fileService.exportAsPdfFile("Master LevelTingkat", col, this.codes, "LevelTingkat");

// });

}

setNoUrut(totalRecords: number,head:any){
            let totalData = [];
            if (totalRecords <1){
                this.form.get('noUrut').setValue(1)
            }
            else{
                this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc&kdLevelTingkatHead='+head).subscribe(table => {
                    totalData = table.LevelTingkat;
                    let ind = totalData.length - 1;     
                    if (ind == -1){
                        this.form.get('noUrut').setValue(1)
                    }
                    else {
                        let noLast = totalData[ind].noUrut + 1;
                        this.form.get('noUrut').setValue(noLast);
                    }
                });
            }
        }

get(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaLevelTingkat='+search+'&kdLevelTingkatHead='+head).subscribe(table => {
        this.listData = table.LevelTingkat;
        this.totalRecords = table.totalRow;
        this.setNoUrut(this.totalRecords,head)   
        // this.form.get('noUrut').setValue(this.totalRecords+1);
    });
}

cari() {
    let data = this.form.get('kdLevelTingkatHead').value;
    if (data == null) {
        this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaLevelTingkat&sort=desc&namaLevelTingkat='+this.pencarian+'&kdLevelTingkatHead='+'').subscribe(table => {
            this.listData = table.LevelTingkat;
        });
    } else {
        this.httpService.get(Configuration.get().dataMasterNew + '/leveltingkat/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaLevelTingkat&sort=desc&namaLevelTingkat='+this.pencarian+'&kdLevelTingkatHead='+data).subscribe(table => {
            this.listData = table.LevelTingkat;
        });
    }

}

loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdLevelTingkatHead').value;
    if (data == null) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Level Tingkat');
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







    update() {

        let statusEnabled = this.form.get('statusEnabled').value;
        let noUrut = this.form.get('noUrut').value;

        if (noUrut == 0 && statusEnabled == true){
            this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
        }
        else if (noUrut != 0 && statusEnabled == false){
            this.form.get('noUrut').setValue(0)
            this.httpService.update(Configuration.get().dataMasterNew + '/leveltingkat/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.reset();
            });
        }
        else {
            this.httpService.update(Configuration.get().dataMasterNew + '/leveltingkat/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.reset();
            });
        }
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.form.get('noUrut').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/leveltingkat/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.reset();
            });
        }

    }

    reset() {
        // this.form.get('noUrut').disable();
        this.formAktif = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        this.form.get('noUrut').enable();

    }

    clone(cloned: LevelTingkat): LevelTingkat {
        let hub = new InisialLevelTingkat();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialLevelTingkat();
        fixHub = {
            "kode": hub.kode.kode,
            "kdDepartemen": hub.kdDepartemen,
            "kdLevelTingkatHead": hub.kdLevelTingkatHead,
            "kodeExternal": hub.kodeExternal,
            "namaLevelTingkat": hub.namaLevelTingkat,
            "namaExternal": hub.namaExternal,
            "reportDisplay": hub.reportDisplay,
            "noUrut": hub.noUrut,
            "statusEnabled": hub.statusEnabled,
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/leveltingkat/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }

    onDestroy() {

    }
    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/levelTingkat/laporanLevelTingkat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmLevelTingkat_laporanCetak');

        // let cetak = Configuration.get().report + '/levelTingkat/laporanLevelTingkat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
    }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/levelTingkatChild/laporanLevelTingkatChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdLevelTingkatHead='+ this.kdLevelHead +'&download=false', 'frmLevelTingkat_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/levelTingkatChild/laporanLevelTingkatChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdLevelTingkatHead='+ this.kdLevelHead +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){

    }








}

class InisialLevelTingkat implements LevelTingkat {

    constructor(
        public levelTingkat?,
        public id?,
        public kode?,
        public kdLevelTingkat?,
        public namaLevelTingkat?,
        public reportDisplay?,
        public kdLevelTingkatHead?,
        public noUrut?,
        public kdDepartemen?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public noRec?,
        public version?,
        public namaLevelTingkatHead?
        ) { }

}