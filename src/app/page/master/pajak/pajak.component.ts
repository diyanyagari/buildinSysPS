import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { pajak } from './pajak.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
    selector: 'app-pajak',
    templateUrl: './pajak.component.html',
    styleUrls: ['./pajak.component.scss'],
    providers: [ConfirmationService]
})

export class PajakComponent implements OnInit {
    formPajak: FormGroup;
    formJenisPajak: FormGroup;
    listJenispajak: any[];
    listDepartemen: any[];
    item: any;
    formJenisPajakAktif: boolean;
    formPajakAktif: boolean;
    pencarianJenisPajak: string;
    pencarianPajak: string;
    listDataJenisPajak: any[];
    listDataPajak: any[];
    listJenisPajakHead: any[];
    selected: any;
    loadingpajak: boolean;
    totalRecordsJenisPajak: number;
    totalRecordsPajak: number;
    page: number;
    rows: number;
    configMaster: any = Configuration.get().dataMasterNew;
    versi: any;
    codes: any;
    isCari: any;

    reportPajak: any;
    toReportPajak: any;
    reportJenisPajak: any;
    toReportJenisPajak: any;
    kdprof: any;
    kddept: any;
    items: any;
    items2: any;
    laporan: boolean = false;
    tab: any;
    smbrFile:any;

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

        this.items2 = [
            {
                label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                    this.downloadPdfPajak();
                }
            },
            {
                label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                    this.downloadExcelPajak();
                }
            },
        ];
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formPajakAktif = true;
        this.loadingpajak = false;
        this.isCari = null;
        this.getPajak(this.page, this.rows, '');
        this.formPajak = this.fb.group({
            'namaPajak': new FormControl('', Validators.required),
            'kdJenisPajak': new FormControl(''),
            'deskripsi': new FormControl('', Validators.required),

            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
            'kode': new FormControl(''),


        });

        this.formJenisPajakAktif = true;
        this.getJenisPajak(this.page, this.rows, '');
        this.formJenisPajak = this.fb.group({
            'namaJenisPajak': new FormControl('', Validators.required),
            'kdJenisPajakHead': new FormControl(''),
            'deskripsi': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
            'kode': new FormControl(''),

        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPajak&select=namaJenisPajak,id').subscribe(res => {
            this.listJenispajak = [];
            this.listJenispajak.push({ label: '--Pilih Jenis Pajak--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listJenispajak.push({ label: res.data.data[i].namaJenisPajak, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisPajak&select=namaJenisPajak,id').subscribe(res => {
            this.listJenisPajakHead = [];
            this.listJenisPajakHead.push({ label: '--Pilih Data Parent Jenis Pajak--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listJenisPajakHead.push({ label: res.data.data[i].namaJenisPajak, value: res.data.data[i].id.kode })
            };

        });

        this.getSmbrFile();
    }
    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    valuechangePajak(newValue) {
        this.toReportPajak = newValue;
        this.reportPajak = newValue;
    }

    valuechangeJenisPajak(newValue) {
        this.toReportJenisPajak = newValue;
        this.reportJenisPajak = newValue;
    }
    getPajak(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pajak/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listDataPajak = table.Pajak;
            this.totalRecordsPajak = table.totalRow;

        });
    }
    getJenisPajak(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenispajak/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listDataJenisPajak = table.JenisPajak;
            this.totalRecordsJenisPajak = table.totalRow;
        });
    }


    cariPajak() {
        this.httpService.get(Configuration.get().dataMasterNew + '/pajak/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPajak&sort=desc&namaPajak=' + this.pencarianPajak).subscribe(table => {
            this.listDataPajak = table.Pajak;
            this.totalRecordsPajak = table.totalRow;
        });



    }
    cariJenisPajak() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenispajak/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisPajak&sort=desc&namaJenisPajak=' + this.pencarianJenisPajak).subscribe(table => {
            this.listDataJenisPajak = table.JenisPajak;
            this.totalRecordsJenisPajak = table.totalRow;
        });
    }

    loadPagePajak(event: LazyLoadEvent) {
        this.getPajak((event.rows + event.first) / event.rows, event.rows, this.pencarianJenisPajak);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }


    loadPageJenisPajak(event: LazyLoadEvent) {
        this.getJenisPajak((event.rows + event.first) / event.rows, event.rows, this.pencarianJenisPajak);
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

    confirmDeletePajak() {
        let kode = this.formPajak.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pajak');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusPajak();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }

    confirmDeleteJenisPajak() {
        let kode = this.formJenisPajak.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Pajak');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusJenisPajak();
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

    onSubmitPajak() {
        if (this.formPajak.invalid) {
            this.validateAllFormFields(this.formPajak);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanPajak();
        }
    }
    onSubmitJenisPajak() {
        if (this.formJenisPajak.invalid) {
            this.validateAllFormFields(this.formJenisPajak);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanJenisPajak();
        }
    }

    confirmUpdatePajak() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updatePajak();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    confirmUpdateJenisPajak() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateJenisPajak();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }

    updatePajak() {
        this.httpService.update(Configuration.get().dataMasterNew + '/pajak/update/' + this.versi, this.formPajak.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPajak(this.page, this.rows, this.pencarianPajak);
            this.resetPajak();
        });
    }
    updateJenisPajak() {
        this.httpService.update(Configuration.get().dataMasterNew + '/jenispajak/update/' + this.versi, this.formJenisPajak.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getJenisPajak(this.page, this.rows, this.pencarianJenisPajak);
            this.resetJenisPajak();
        });
    }

    simpanPajak() {
        if (this.formPajakAktif == false) {
            this.confirmUpdatePajak()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/pajak/save?', this.formPajak.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getPajak(this.page, this.rows, this.pencarianPajak);
                this.resetPajak();
            });
        }

    }
    simpanJenisPajak() {
        if (this.formJenisPajakAktif == false) {
            this.confirmUpdateJenisPajak()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/jenispajak/save?', this.formJenisPajak.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getJenisPajak(this.page, this.rows, this.pencarianJenisPajak);
                this.resetJenisPajak();
            });
        }

    }

    resetJenisPajak() {
        this.formJenisPajakAktif = true;
        this.ngOnInit();
    }

    resetPajak() {
        this.formPajakAktif = true;
        this.ngOnInit();
    }
    onRowSelectJenisPajak(event) {
        let cloned = this.cloneJenisPajak(event.data);
        this.formJenisPajakAktif = false;
        this.formJenisPajak.setValue(cloned);
    }

    cloneJenisPajak(cloned: any) {

        let fixHub = {
            'kode': cloned.kode.kode,
            'namaJenisPajak': cloned.namaJenisPajak,
            'kdJenisPajakHead': cloned.kdJenisPajakHead,
            'deskripsi': cloned.deskripsi,

            'reportDisplay': cloned.reportDisplay,
            'namaExternal': cloned.namaExternal,
            'kodeExternal': cloned.kodeExternal,
            'statusEnabled': cloned.statusEnabled


        }
        this.versi = cloned.version;
        return fixHub;
    }

    onRowSelectPajak(event) {
        let cloned = this.clonePajak(event.data);
        this.formPajakAktif = false;
        this.formPajak.setValue(cloned);

    }
    clonePajak(cloned: pajak): pajak {
        let hub = new Inisialpajak();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new Inisialpajak();
        fixHub = {
            "kode": hub.kode.kode,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaPajak": hub.namaPajak,
            "kdJenisPajak": hub.kdJenisPajak,
            "deskripsi": hub.deskripsi,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapusPajak() {
        let item = [...this.listDataPajak];
        let deleteItem = item[this.findSelectedIndexPajak()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/pajak/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPajak(this.page, this.rows, this.pencarianPajak);
        });
        this.resetPajak();
    }
    hapusJenisPajak() {
        let item = [...this.listDataJenisPajak];
        let deleteItem = item[this.findSelectedIndexJenisPajak()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/jenispajak/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getJenisPajak(this.page, this.rows, this.pencarianJenisPajak);

        });
        this.resetPajak();
    }

    findSelectedIndexPajak(): number {
        return this.listDataPajak.indexOf(this.selected);
    }
    findSelectedIndexJenisPajak(): number {
        return this.listDataJenisPajak.indexOf(this.selected);
    }

    onDestroy() {

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/jenisPajak/laporanJenisPajak.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(cetak);
    }

    downloadExcel() {

    }

    downloadPdfPajak() {
        let cetak = Configuration.get().report + '/pajak/laporanPajak.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(cetak);
    }

    downloadExcelPajak() {

    }

    cetakJenisPajak() {
        this.tab = 'jenis';
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisPajak/laporanJenisPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisPajak_laporanCetak');
    }

    cetakPajak() {
        this.tab = 'pajak';
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pajak/laporanPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPajak_laporanCetak');
    }

    tutupLaporan() {
        this.laporan = false;
    }
}

class Inisialpajak implements pajak {

    constructor(
        public kdProduk?,
        public kode?,
        public namaPajak?,
        public deskripsi?,
        public kdJenisPajak?,
        public namaObjekpajak?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?
    ) { }

}











