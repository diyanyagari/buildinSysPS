import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'app-master-visi',
    templateUrl: './master-visi.component.html',
    styleUrls: ['./master-visi.component.scss'],
    providers: [ConfirmationService]
})
export class MasterVisiComponent implements OnInit {
    Visi: any;
    formAktif: boolean;
    form: FormGroup;

    kdVisiHead: any = [];
    noUrut: any;
    kodeExternal: any;
    namaExternal: any;
    statusEnabled: any;
    noRec: any;
    namaVisi: any;
    reportDisplay: any;

    kode: any;

    kdProfile: any;
    kdVisi: any;
    kdDepartemen: any;

    listData: any = [];

    pencarian: string = '';
    dataSimpan: any;

    page: number;
    totalRecords: number;
    rows: number;
    versi: number;

    items: any;
    listData2: any[];
    codes: any[];
    laporan: boolean = false;
    kdprof: any;
    kddept: any;
    smbrFile: any;
    noUrutStts: boolean = true;

    constructor(private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private httpService: HttpClient,
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

    ngOnInit() {
        this.noUrutStts = true;
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
        let data = {
            "kdVisiHead": 0,
            "noUrut": 0,
            "kodeExternal": "string",
            "namaExternal": "string",
            "statusEnabled": true,
            "noRec": "string",
            "namaVisi": "string",
            "reportDisplay": "string",
            "kode": 0
        }
        this.formAktif = true;
        this.form = this.fb.group({
            'kdVisiHead': new FormControl(null),
            'noUrut': new FormControl(null),
            // 'kdDepartemen': new FormControl(''),
            'kodeExternal': new FormControl(null),
            'namaExternal': new FormControl(null),
            'statusEnabled': new FormControl(null, Validators.required),
            'noRec': new FormControl(null),
            'namaVisi': new FormControl(null, Validators.required),
            'reportDisplay': new FormControl(null, Validators.required),
            'kode': new FormControl(null)
        });
        this.getDataGrid(this.page, this.rows, this.pencarian)
        this.getKdVisiHead();
        this.form.get('noUrut').disable();
        this.getSmbrFile();
    }
    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    // onSubmit() {
    // 	this.simpan();
    // }
    getDataGrid(page: number, rows: number, cari: string) {
        this.httpService.get(Configuration.get().dataMasterNew + '/visi/findAll?page=' + page + '&rows=' + rows + '&dir=noUrut&sort=asc&namaVisi=' + cari).subscribe(table => {
            this.listData = table.Visi;
            this.totalRecords = table.totalRow;
        });
    }

    cari() {
        this.getDataGrid(this.page, this.rows, this.pencarian)
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
    loadPage(event: LazyLoadEvent) {
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    clone(cloned: any) {
        let fixHub = {
            "kdVisiHead": cloned.kdVisiHead,
            "noUrut": cloned.noUrut,
            "kodeExternal": cloned.kodeExternal,
            "namaExternal": cloned.namaExternal,
            "statusEnabled": cloned.statusEnabled,
            "noRec": cloned.noRec,
            "namaVisi": cloned.namaVisi,
            "reportDisplay": cloned.reportDisplay,
            "kode": cloned.kode.kode
        }
        // this.versi = cloned.version;
        this.versi = 1;
        return fixHub;
    }
    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        this.form.get('noUrut').enable();
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
        if (this.form.get('noUrut').value == 0) {
            this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
            this.noUrutStts = false;
        } else {
            this.noUrutStts = true;
            this.httpService.update(Configuration.get().dataMasterNew + '/visi/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.ngOnInit();
            });
        }
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            // let noUrut = this.totalRecords + 1;
            // this.form.get('noUrut').enable();
            // this.form.get('noUrut').setValue(noUrut);
            let formSubmit = this.form.value;
            formSubmit.noUrut = null;
            this.httpService.post(Configuration.get().dataMasterNew + '/visi/save', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.ngOnInit();
            });
        }

    }

    getKdVisiHead() {
        this.httpService.get(Configuration.get().dataMasterNew + '/visi/findAll').subscribe(res => {
            this.kdVisiHead = [];
            this.kdVisiHead.push({ label: '--Pilih Data Parent Visi--', value: '' })
            for (var i = 0; i < res.Visi.length; i++) {
                this.kdVisiHead.push({ label: res.Visi[i].namaVisi, value: res.Visi[i].kode.kode })
            };
        },
            error => {
                this.kdVisiHead = [];
                this.kdVisiHead.push({ label: '-- ' + error + ' --', value: '' })
            });

    }

    onDestroy() {

    }

    reset() {
        this.form.get('noUrut').disable();
        this.ngOnInit();
    }
    hapus() {
        this.httpService.delete(Configuration.get().dataMasterNew + '/visi/del/' + this.form.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.form.get('noUrut').disable();
            this.ngOnInit();
        });
    }


    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Visi');
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
    setReportDisplay() {
        this.form.get('reportDisplay').setValue(this.form.get('namaVisi').value)
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/visi/findAll?').subscribe(table => {
            this.listData2 = table.Visi;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    'Kode': this.listData2[i].kode.kode,
                    'Nama Visi Head': this.listData2[i].namaVisiHead,
                    'Nama Visi': this.listData2[i].namaVisi,
                    'No Urut': this.listData2[i].noUrut,
                    'Report Display': this.listData2[i].reportDisplay,
                    'Kode External': this.listData2[i].kodeExternal,
                    'Nama External': this.listData2[i].namaExternal,
                    'Status Enabled': this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'Visi');
        });

    }

    downloadPdf() {
        var col = ["Kode", "Nama Visi Head", "Nama Visi", "No Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
        this.httpService.get(Configuration.get().dataMasterNew + '/visi/findAll?').subscribe(table => {
            this.listData2 = table.Visi;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaVisiHead: this.listData2[i].namaVisiHead,
                    namaVisi: this.listData2[i].namaVisi,
                    noUrut: this.listData2[i].noUrut,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsPdfFile("Master Visi", col, this.codes, "Visi");

        });
    }

    // downloadPdf() {
    //     let b = Configuration.get().report + '/visi/laporanvisi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

    //     window.open(b);
    // }

    cetak() {
        // this.laporan = true;
        // this.print.showEmbedPDFReport(Configuration.get().report + '/visi/laporanvisi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmVisi_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/visi/laporanvisi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }



}


