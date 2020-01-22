import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { GolonganDarah } from './golonganDarah-form.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-golonganDarah-form',
    templateUrl: './golonganDarah-form.component.html',
    styleUrls: ['./golonganDarah-form.component.scss'],
    providers: [ConfirmationService]
})
export class GolonganDarahFormComponent implements OnInit {
    item: GolonganDarah = new InisialGolonganDarah();
    selected: GolonganDarah;
    listData: any[];
    dataDummy: {};
    versi: any;
    formGolonganDarah: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    form: FormGroup;
    formAktif: boolean;
    pencarian: string;
    FilterNegara: string;
    dropdownNegara: any[];
    report: any;
    toReport: any;
    codes: any[];
    kdprof: any;
    kddept: any;
    laporan: boolean = false;
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
        this.selected = null;
        this.pencarian = '';
        this.FilterNegara = '';
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
        this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
        this.versi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaGolonganDarah': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
            'kdNegara': new FormControl('', Validators.required)

        });
        this.getSmbrFile();
        this.getNegara();
    }

    getNegara() {
        this.dropdownNegara = [];
        this.dropdownNegara.push({ label: '--Pilih Negara--', value: '' })
        this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
            for (var i = 0; i < res.Negara.length; i++) {
                this.dropdownNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
            };
        });
    }

    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    get(page: number, rows: number, search: any, filter: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/golongandarah/findAll?page=' + page + '&rows=' + rows + '&dir=namaGolonganDarah&sort=desc&namaGolonganDarah=' + search + '&kdNegara=' + filter).subscribe(table => {
            this.listData = table.GolonganDarah;
            this.totalRecords = table.totalRow;
        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/golongandarah/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaGolonganDarah&sort=desc&namaGolonganDarah=' + this.pencarian + '&kdNegara=' + this.FilterNegara).subscribe(table => {
            this.listData = table.GolonganDarah;
        });
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/golongandarah/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaGolonganDarah&sort=desc').subscribe(table => {
            this.listData = table.GolonganDarah;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                // if (this.listData[i].statusEnabled == true){
                this.codes.push({

                    kode: this.listData[i].kode.kode,
                    namaGolonganDarah: this.listData[i].namaGolonganDarah,
                    reportDisplay: this.listData[i].reportDisplay,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,
                    statusEnabled: this.listData[i].statusEnabled

                })
                // }
            }

            this.fileService.exportAsExcelFile(this.codes, 'GolonganDarah');
        });

    }

    //     downloadPdf() {
    //         var col = ["Kode ", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    //         this.httpService.get(Configuration.get().dataMasterNew + '/golongandarah/findAll?').subscribe(table => {
    //            this.listData = table.GolonganDarah;
    //            this.codes = [];

    //            for (let i = 0; i < this.listData.length; i++) {
    //         // if (this.listData[i].statusEnabled == true){
    //             this.codes.push({

    //                 kode: this.listData[i].kode.kode,
    //                 namaGolonganDarah: this.listData[i].namaGolonganDarah,
    //                 reportDisplay: this.listData[i].reportDisplay,
    //                 kodeExternal: this.listData[i].kodeExternal,
    //                 namaExternal: this.listData[i].namaExternal,
    //                 statusEnabled: this.listData[i].statusEnabled

    //             })
    //         // }
    //     }

    //     this.fileService.exportAsPdfFile("Master Golongan Darah", col, this.codes, "GolonganDarah");

    // });

    //     }

    downloadPdf() {
        let b = Configuration.get().report + '/golonganDarah/laporanGolonganDarah.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

        window.open(b);
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/golonganDarah/laporanGolonganDarah.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmGolonganDarah_laporanCetak');
        // let b = Configuration.get().report + '/golonganDarah/laporanGolonganDarah.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Golongan Darah');
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

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/golongandarah/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
            // this.get(this.page, this.rows, this.pencarian);
        });

    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }

    reset() {
        this.formAktif = true;
        this.ngOnInit();
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
        this.httpService.update(Configuration.get().dataMasterNew + '/golongandarah/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/golongandarah/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.get(this.page, this.rows, this.pencarian);
                this.reset();

            });
        }

    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);

    }
    clone(cloned: GolonganDarah): GolonganDarah {
        let hub = new InisialGolonganDarah();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialGolonganDarah();
        fixHub = {
            "kode": hub.kode.kode,
            "namaGolonganDarah": hub.namaGolonganDarah,
            "reportDisplay": hub.reportDisplay,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "statusEnabled": hub.statusEnabled,
            "kdNegara": hub.kode.kdNegara
        }
        this.versi = hub.version;
        return fixHub;
    }


}

class InisialGolonganDarah implements GolonganDarah {
    constructor(
        public id?,
        public kdProfile?,
        public kode?,
        public KdGolonganDarah?,
        public GolonganDarah?,
        public namaGolonganDarah?,
        public ReportDisplay?,
        public reportDisplay?,
        public KodeExternal?,
        public NamaExternal?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public noRec?,
        public label?,
        public version?,
        public kdNegara?
    ) { }
}