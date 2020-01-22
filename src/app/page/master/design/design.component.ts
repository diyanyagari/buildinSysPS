    import { Inject, forwardRef, Component, OnInit } from '@angular/core';
    import { HttpClient } from '../../../global/service/HttpClient';
    import { Observable } from 'rxjs/Rx';
    import { Design } from './design.interface';
    import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
    import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
    import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
 @Component({
    selector: 'app-design',
    templateUrl: 'design.component.html',
    styleUrls: ['design.component.scss'],
    providers: [ConfirmationService]
})
export class DesignComponent implements OnInit {

    item: Design = new InisialDesign();
    selected: Design;
    listData: any[];
    dataDummy: {};
    versi: any;
    form: FormGroup;
    formAktif: boolean
    items: MenuItem[];
    pencarian: string;
    report: any;
    toReport: any;
    totalRecords: number;
    page: number;
    rows: number;
    codes: any[];
    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    smbrFile: any;
    dropdownbahasa: any;
    dropdowndesignHead: any;
    namaFoto: any;
    foto: any;
    smbrFoto: string;
    minDate: Date = new Date();

    constructor(
        private alertService: AlertService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {}
    ngOnInit() {
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.pencarian = '';
        this.formAktif = true;        
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        this.minDate = new Date();
        this.minDate.setMonth(month);
        this.minDate.setFullYear(year); 
        today.setHours(0, 0, 0, 0);
        this.get(this.page, this.rows, this.pencarian);
        this.form = this.fb.group({
            'kode': new FormControl(null),
            'namaDesign': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'deskripsiDesign': new FormControl(null),
            'tglDesign': new FormControl(today, Validators.required),
            'kdBahasa': new FormControl(null),
            'pathFile': new FormControl(null),
            'kdDesignHead': new FormControl(null),
            'imageCover': new FormControl(null),
            'imageCoverPathFile': new FormControl(null),
            'keteranganLainnya': new FormControl(null),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.items = [{
                label: 'Pdf',
                icon: 'fa-file-pdf-o',
                command: () => {
                    this.downloadPdf();
                }
            },
            {
                label: 'Exel',
                icon: 'fa-file-excel-o',
                command: () => {
                    this.downloadExel();
                }
            }
        ];
        this.getSmbrFile();
        this.getDrop();
    }

    addHeader(event) {
        this.httpService.beforeUploadFile(event);
    }
    urlUpload() {
        return Configuration.get().resourceFile + '/file/upload';
    }

    fileUpload(event) {
        this.namaFoto = event.xhr.response;
        this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.namaFoto;
    }

    getDrop() {
        this.httpService.get(Configuration.get().dataMaster + '/bahasa/findAllDataBahasa').subscribe(res => {
            this.dropdownbahasa = [];
            for (var i = 0; i < res.bahasa.length; i++) {
                this.dropdownbahasa.push({
                    label: res.bahasa[i].namaBahasa,
                    value: res.bahasa[i].kode
                })
            };
        });

        this.httpService.get(Configuration.get().dataMaster + '/design/findAllHead').subscribe(res => {
            this.dropdowndesignHead = [];
            for (var i = 0; i < res.data.length; i++) {
                this.dropdowndesignHead.push({
                    label: res.data[i].namaDesign,
                    value: res.data[i].kode
                })
            };
        });
    }

    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }


    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/design/findAll?page=' + page + '&rows=' + rows + '&dir=namaDesign&sort=desc&namaDesign=' + search).subscribe(table => {
            this.listData = table.Design;
            this.totalRecords = table.totalRow;

        });
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }


    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/design/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDesign&sort=desc&namaDesign=' + this.pencarian).subscribe(table => {
            this.listData = table.Design;
        });
    }
    valuechange(newValue) {
        this.report = newValue;
    }
    downloadExel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/design/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaDesign&sort=desc').subscribe(table => {
            this.listData = table.Design;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                this.codes.push({

                    kode: this.listData[i].kode.kode,

                })
            }

            this.fileService.exportAsExcelFile(this.codes, 'design');
        });

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/design/laporanDesign.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(cetak);
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Design');
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

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/design/del/' + deleteItem.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });

    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }

    reset() {
        this.ngOnInit();
        this.smbrFoto = "";
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
        let jsonSubmit = {
            "kode": this.form.get('kode').value,
            "namaDesign": this.form.get('namaDesign').value,
            "reportDisplay": this.form.get('reportDisplay').value,
            "deskripsiDesign": this.form.get('deskripsiDesign').value,
            "tglDesign": this.setTimeStamp(this.form.get('tglDesign').value),
            "kdBahasa": this.form.get('kdBahasa').value,
            "pathFile": this.form.get('pathFile').value,
            "kdDesignHead": this.form.get('kdDesignHead').value,
            "imageCover": this.form.get('imageCover').value,
            "imageCoverPathFile": this.form.get('imageCoverPathFile').value,
            "keteranganLainnya": this.form.get('keteranganLainnya').value,
            "statusEnabled": this.form.get('statusEnabled').value,
        }
        this.httpService.update(Configuration.get().dataMasterNew + '/design/update', jsonSubmit).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
            this.reset();
        });
    }

    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let jsonSubmit = {
                "kode": this.form.get('kode').value,
                "namaDesign": this.form.get('namaDesign').value,
                "reportDisplay": this.form.get('reportDisplay').value,
                "deskripsiDesign": this.form.get('deskripsiDesign').value,
                "tglDesign": this.setTimeStamp(this.form.get('tglDesign').value),
                "kdBahasa": this.form.get('kdBahasa').value,
                "pathFile": this.form.get('pathFile').value,
                "kdDesignHead": this.form.get('kdDesignHead').value,
                "imageCover": this.form.get('imageCover').value,
                "imageCoverPathFile": this.form.get('imageCoverPathFile').value,
                "keteranganLainnya": this.form.get('keteranganLainnya').value,
                "statusEnabled": this.form.get('statusEnabled').value,
            }

            this.httpService.post(Configuration.get().dataMasterNew + '/design/save', jsonSubmit).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                          
                this.reset();
            });
        }

    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({
                    onlySelf: true
                });
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
    onRowSelect(event) {
        this.formAktif = false;
        let cloned = this.clone(event.data);
        this.form.setValue(cloned);
    }
    clone(cloned: Design): Design {
        let hub = new InisialDesign();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialDesign();
        this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + hub.imageCover
        fixHub = {
            "kode": hub.kode,
            "namaDesign": hub.namaDesign,
            "reportDisplay": hub.reportDisplay,
            "deskripsiDesign": hub.deskripsiDesign,
            "tglDesign": new Date(hub.tglDesign * 1000),
            "kdBahasa": hub.kdBahasa,
            "pathFile": hub.pathFile,
            "kdDesignHead": hub.kdDesignHead,
            "imageCover": hub.imageCover,
            "imageCoverPathFile": hub.imageCoverPathFile,
            "keteranganLainnya": hub.keteranganLainnya,
            "statusEnabled": hub.statusEnabled,
        }
        return fixHub;
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/design/laporanDesign.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmDesign(_laporanCetak');
    }
    tutupLaporan() {
        this.laporan = false;
    }


}
class InisialDesign implements Design {
    constructor(
        public kode ? ,
        public namaDesign ? ,
        public reportDisplay ? ,
        public deskripsiDesign ? ,
        public tglDesign ? ,
        public kdBahasa ? ,
        public pathFile ? ,
        public kdDesignHead ? ,
        public imageCover ? ,
        public imageCoverPathFile ? ,
        public keteranganLainnya ? ,
        public statusEnabled ? ,
    ) {}
}