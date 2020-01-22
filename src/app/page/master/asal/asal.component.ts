import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Asal } from './asal.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, HttpClient, AuthGuard, ReportService } from '../../../global';

@Component({
    selector: 'app-asal',
    templateUrl: './asal.component.html',
    providers: [ConfirmationService]
})
export class AsalComponent implements OnInit {
    selected: Asal;
    listData: Asal[];
    formAktif: boolean;
    pencarian: string;
    departemen: Asal[];
    asalHead: Asal[];
    versi: any;
    form: FormGroup;

    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    inputPencarian: any;
    codes: any[];
    report: any;
    toReport: any;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;

    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    itemsChild: any;
    kdAsalHead: any;
    smbrFile: any;
    constructor(
        private alertService: AlertService,
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
        this.formAktif = true;
        this.inputPencarian = null;
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
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaAsal': new FormControl('', Validators.required),
            'kdAsalHead': new FormControl(null),
            'reportsDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        if (this.index == 0) {
            this.httpService.get(Configuration.get().dataMasterNew + '/asal/findAll?page=1&rows=300&dir=namaAsal&sort=desc').subscribe(table => {
                this.listTab = table.Asal;
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
    onTabChange(event) {
        let data;
        this.index = event.index;
        if (event.index > 0) {
            let index = event.index - 1;
            data = this.listTab[index].kode.kode;
            this.form.get('kdAsalHead').setValue(data);
        } else {
            data = '';
            this.form.get('kdAsalHead').setValue(null);
        }
        this.kdAsalHead = data;
        this.pencarian = '';
        this.getPage(this.page, this.rows, this.pencarian, data);
        this.valuechange('');
        this.formAktif = true;
    }
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcel() {
        // this.httpService.get(Configuration.get().dataMasterNew + '/asal/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaAsal&sort=desc').subscribe(table => {
        //     this.listData = table.Asal;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         this.codes.push({

        //             kode: this.listData[i].kode.kode,
        //             namaAsal: this.listData[i].namaAsal,
        //             kodeExternal: this.listData[i].kodeExternal,
        //             namaExternal: this.listData[i].namaExternal,
        //             statusEnabled: this.listData[i].statusEnabled,
        //             reportDisplay: this.listData[i].reportDisplay

        //         })

        //             // debugger;
        //         }
        //         this.fileService.exportAsExcelFile(this.codes, 'Asal');
        //     });
    }
    getSmbrFile(){
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
        });
    }

    downloadPdf() {
     
        let b = Configuration.get().report + '/asal/laporanAsal.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    cetak() {

        // this.laporan = true;
        this.laporan = true;
        let pathFile;
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
            this.print.showEmbedPDFReport(Configuration.get().report + '/asal/laporanAsal.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmAsal_laporanCetak');
        });
        // let b = Configuration.get().report + '/asal/laporanAsal.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    cetakChild() {
        this.laporan = true;
        let pathFile;
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
            this.print.showEmbedPDFReport(Configuration.get().report + '/asalChild/laporanAsalChild.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&kdAsalHead=' + this.kdAsalHead + '&download=false', 'laporanAsal');
        });
    }

    downloadPdfChild() {
        
        let b = Configuration.get().report + '/asalChild/laporanAsalChild.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&kdAsalHead=' + this.kdAsalHead + '&download=true';
        window.open(b);
    }

    downloadExcelChild() {

    }

    getPage(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/asal/findAll?page=' + page + '&rows=' + rows + '&dir=namaAsal&sort=desc&namaAsal=' + search + '&kdAsalHead=' + head).subscribe(table => {
            this.listData = table.Asal;
            this.totalRecords = table.totalRow;
        });
    }

    cari() {
        let data = this.form.get('kdAsalHead').value;
        if (data == null) {
            this.getPage(this.page, this.rows, this.pencarian, '');
        } else {
            this.getPage(this.page, this.rows, this.pencarian, data);
        }

    }

    loadPage(event: LazyLoadEvent) {
        let data = this.form.get('kdAsalHead').value;
        if (data == null) {
            this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
        } else {
            this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
        }
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Asal');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/asal/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/asal/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
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

    clone(cloned: Asal): Asal {
        let hub = new InisialAsal();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialAsal();
        fixHub = {

            "kdAsalHead": hub.kdAsalHead,
            "kode": hub.kode.kode,
            "namaAsal": hub.namaAsal,
            "reportsDisplay": hub.reportsDisplay,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/asal/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialAsal implements Asal {

    constructor(
        public asal?,
        public kdAsalHead?,
        public kdDepartemen?,
        public kode?,
        public kodeExternal?,
        public namaAsal?,
        public namaExternal?,
        public reportsDisplay?,
        public statusEnabled?,
        public version?,
        public id?

    ) { }


}