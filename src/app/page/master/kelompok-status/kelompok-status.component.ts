import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokStatus } from './kelompok-status.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, ReportService, AuthGuard } from '../../../global';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-kelompok-status',
    templateUrl: './kelompok-status.component.html',
    styleUrls: ['./kelompok-status.component.scss'],
    providers: [ConfirmationService]
})
export class KelompokStatusComponent implements OnInit {
    item: KelompokStatus = new InisialKelompokStatus();
    selected: KelompokStatus;
    listData: any[];
    codes: KelompokStatus[];
    dataDummy: {};
    formAktif: boolean;
    kodeGolonganPegawai: KelompokStatus[];
    ruangan: KelompokStatus[];
    versi: any;
    form: FormGroup;
    items: any;
    kode: any;
    id: any;
    page: number;
    id_kode: any;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    pencarian: string;
    dropdownNegara: any[];
    FilterNegara: string;
    dataValidForm: boolean;
    laporan: boolean = false;

    kdprof: any;
    kddept: any;
    headerLaporan: string;
    smbrFile: any;
    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        private translate: TranslateService,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    }


    ngOnInit() {
        this.pencarian = '';
        this.FilterNegara = '';
        this.selected = null;
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
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.getPage(this.page, this.rows, this.pencarian);
        this.versi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            // 'kdNegara': new FormControl('', Validators.required),
            'namaKelompokStatus': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.dataValidForm = true;
        if (this.form.get('namaKelompokStatus').value == "") {
            this.dataValidForm = true;
        }
        console.log(this.form.get('namaKelompokStatus').value);
        this.translate.get('laporanAgama').subscribe((res: string) => {
            this.headerLaporan = res;
        });

        this.getSmbrFile();
       
    }

    valuechange(newValue) {

        if (newValue == "") {
            this.dataValidForm = false;
        } else {
            this.dataValidForm = true;
        }
        this.report = newValue;
    }
    getInput() {

    }

    downloadExcel() {
        // this.httpService.get(Configuration.get().dataMasterNew + '/agama/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaAgama&sort=desc').subscribe(table => {
        //     this.listData = table.Agama;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         this.codes.push({

        //             kode: this.listData[i].kode.kode,
        //             namaAgama: this.listData[i].namaAgama,
        //             kodeExternal: this.listData[i].kodeExternal,
        //             namaExternal: this.listData[i].namaExternal,
        //             statusEnabled: this.listData[i].statusEnabled,
        //             reportDisplay: this.listData[i].reportDisplay

        //         })

        //             // debugger;
        //         }
        //         this.fileService.exportAsExcelFile(this.codes, 'Agama');
        //     });
        this.httpService.genericReport(Configuration.get().report + '/generic/report/agama-report-master-new.xlsx', { download: true }).subscribe();
        //this.print.showEmbedXLSXReport(Configuration.get().report + '/generic/report/agama-report-master-new.xlsx', this.headerLaporan, {});


    }

    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    downloadPdf() {
        this.httpService.genericReport(Configuration.get().report + '/generic/report/agama-report-master-new.pdf', { download: true }).subscribe();


        // let cetak;
        // cetak = Configuration.get().report + '/agama/laporanAgama.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';        
        // window.open(cetak);   
    }

    // downloadPdf() {
    //     var col = ["Kode", "Nama Agama", "Kode External", "Nama External"];
    //     this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
    //         this.listData = table.data.data;


    //         this.codes = [];

    //         for (let i = 0; i < this.listData.length; i++) {
    //             this.codes.push({

    //                 code: this.listData[i].id_kode,
    //                 nama: this.listData[i].namaAgama,
    //                 kodeEx: this.listData[i].kodeExternal,
    //                 namaEx: this.listData[i].namaExternal,

    //             })

    //                 // debugger;
    //             }
    //             this.fileService.exportAsPdfFile("Master Agama", col, this.codes, "Agama");

    //         });

    // }
    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokstatus/findAll?page=' + page + '&rows=' + rows + '&dir=namaKelompokStatus&sort=desc&namaKelompokStatus=' + search ).subscribe(table => {
            this.listData = table.kelompokStatus;
            this.totalRecords = table.totalRow;

        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokstatus/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokStatus&sort=desc&namaKelompokStatus=' + this.pencarian ).subscribe(table => {
            this.listData = table.kelompokStatus;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Agama');
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
            this.alertService.warn("Peringatan", "Data Tidak Sesuai");
            this.dataValidForm = false;
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
        console.log(this.form.value);
        this.httpService.update(Configuration.get().dataMasterNew + '/kelompokstatus/update/',this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/kelompokstatus/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.getPage(this.page, this.rows, this.pencarian);
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
    clone(cloned: KelompokStatus): KelompokStatus {
        let hub = new InisialKelompokStatus();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKelompokStatus();
        fixHub = {
            "kode": hub.id.kode,
            "namaKelompokStatus": hub.namaKelompokStatus,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokstatus/del/' + deleteItem.id.kode ).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
            // this.getPage(this.page, this.rows, this.pencarian);
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        // this.laporan = true;
        // this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/agama-report-master-new.pdf', this.headerLaporan, {});
    }
}

class InisialKelompokStatus implements KelompokStatus {

    constructor(
        public KelompokStatus?,
        public id?,
        public kdProfile?,
        public kode?,
        public kdKelompokStatus?,
        public namaKelompokStatus?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id_kode?,
        public code?,
        public nama?,
        public kodeEx?,
        public namaEx?,
        public kdNegara?
    ) { }

}