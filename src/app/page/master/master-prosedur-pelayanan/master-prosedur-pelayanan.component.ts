import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Asal } from './master-prosedur-pelayanan.interface';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, HttpClient, AuthGuard, ReportService } from '../../../global';
import { JenisDokumen } from './jenisdokumen.interface';
import { Dokumen } from './master-new-dokumen.interface';

@Component({
    selector: 'app-master-prosedur-pelayanan',
    templateUrl: './master-prosedur-pelayanan.component.html',
    providers: [ConfirmationService]
})
export class MasterProsedurPelayananComponent implements OnInit {
    selected: Dokumen;
    listData: any[];
    jenisDokumen: Dokumen[];
    kategoriDokumen: Dokumen[];
    dokumenHead: Dokumen[];
    formAktif: boolean;
    formAktifJenisDokumen: boolean;
    formAktifMasterDokumen: boolean;
    pencarian: string;
    departemen: Asal[];
    asalHead: Asal[];
    versi: any;
    form: FormGroup;
    formJenisDokumen: FormGroup;
    formMasterDokumen: FormGroup;
    parentDokumen: any[];
    listPegawaiPemilikDokumen: any[];
    listPemilikDokumenBaru: any[];
    listPegawaiAktif: any[];
    lokasiDokumen: Dokumen[];

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
    uploadData: any = "textEditor";

    dokumen1: any;
    dokumen2: any;
    dokumen3: any;
    isiDokumen: any;

    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    itemsChild: any;
    kdAsalHead: any;
    smbrFile: any;

    namaFile: string;
    namaImage: string;
    smbrImage: string;


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
        this.listPegawaiPemilikDokumen = [];
        this.listPemilikDokumenBaru = [];
        this.formAktifJenisDokumen = true;
        this.formAktifMasterDokumen = true;
        this.inputPencarian = null;
        if (this.index == 0) {
            this.items = [
                {
                    label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                        this.downloadPdfJenisDok();
                    }
                },
                {
                    label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                        this.downloadExcelJenisDok();
                    }
                },
            ];
        } else {
            this.items = [
                {
                    label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                        this.downloadPdfMasterDokumen();
                    }
                },
                {
                    label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                        this.downloadExcelMasterDokumen();
                    }
                },

            ];
        }

        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.formAktifJenisDokumen = true;
        this.formAktifMasterDokumen = true;
        this.formJenisDokumen = this.fb.group({

            'kode': new FormControl(''),
            'kdJenisDokumenHead': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaJenisDokumen': new FormControl('', Validators.required),
            'kdDepartemen': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formMasterDokumen = this.fb.group({
            'kode': new FormControl(''),
            'kdDokumenHead': new FormControl(null),
            'namaJudulDokumenHead': new FormControl(null),
            'kdKategoryDokumen': new FormControl('', Validators.required),
            'deskripsiDokumen': new FormControl(''),
            'kdJenisDokumen': new FormControl('', Validators.required),
            // 'namaDokumen': new FormControl(''),
            'namaJudulDokumen': new FormControl(null, Validators.required),
            'qtyPages': new FormControl(null),
            'isbn': new FormControl(null),
            'tglAwalBerlaku': new FormControl(new Date()),
            'tglAkhirBerlaku': new FormControl(new Date()),
            'reportDisplay': new FormControl('', Validators.required),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
            // 'isiDokumen': new FormControl(null),
            'pathFile': new FormControl(''),
            'imageFile': new FormControl(''),
            'kdDokumen': new FormControl(null),
            'kdLokasi': new FormControl(null),
            'qtyDokumen': new FormControl(null),
            'kdRuangan': new FormControl('')
        });
        // this.form = this.fb.group({
        //     'kode': new FormControl(''),
        //     'kdJenisDokumenHead': new FormControl(''),
        //     'namaJenisDokumen': new FormControl('', Validators.required),
        //     'kdDepartemen': new FormControl(''),

        //     'kdDokumenHead': new FormControl(null),
        //     'namaJudulDokumenHead': new FormControl(null),
        //     'kdKategoryDokumen': new FormControl('', Validators.required),
        //     'deskripsiDokumen': new FormControl(''),
        //     'kdJenisDokumen': new FormControl('', Validators.required),
        //     'namaJudulDokumen': new FormControl(null, Validators.required),
        //     'qtyPages': new FormControl(null),
        //     'isbn': new FormControl(null),
        //     'tglAwalBerlaku': new FormControl(new Date()),
        //     'tglAkhirBerlaku': new FormControl(new Date()),
        //     // 'isiDokumen': new FormControl(null),
        //     'pathFile': new FormControl(''),
        //     'imageFile': new FormControl(''),
        //     'kdDokumen': new FormControl(null),
        //     'kdLokasi': new FormControl(null),
        //     'qtyDokumen': new FormControl(null),
        //     'kdRuangan': new FormControl(''),

        //     'namaExternal': new FormControl(''),
        //     'kodeExternal': new FormControl(''),
        //     'reportDisplay': new FormControl('', Validators.required),
        //     'statusEnabled': new FormControl(true, Validators.required),
        // });
        // if (this.index == 0) {
        //     this.httpService.get(Configuration.get().dataMasterNew + '/asal/findAll?page=1&rows=300&dir=namaAsal&sort=desc').subscribe(table => {
        //         this.listTab = table.Asal;
        //         let i = this.listTab.length
        //         while (i--) {
        //             if (this.listTab[i].statusEnabled == false) {
        //                 this.listTab.splice(i, 1);
        //             }
        //         }
        //     });
        // };
        // let dataIndex = {
        //     "index": this.index
        // }
        // this.onTabChange(dataIndex);
        this.loadJenisDokumen();
        this.loadMasterDokumen();
        this.getSmbrFile();
        this.getListPegawaiAktif();
        this.getLokasiDokumen();
        this.getPage(this.page, this.rows, this.pencarian);

    }
    onTabChange(event) {
        let data;
        this.index = event.index;
        if (this.index == 0) {
            this.pencarian = '';
            this.loadJenisDokumen();
            this.formJenisDokumen.get('namaJenisDokumen').setValue('')
            this.formJenisDokumen.get('reportDisplay').setValue('')
        } else {
            this.pencarian = '';
            this.getPilihIsi(this.uploadData);
            this.formMasterDokumen.get('namaJudulDokumen').setValue('')
            this.formMasterDokumen.get('reportDisplay').setValue('')
            this.loadMasterDokumen();
        }
        // if (event.index > 0) {
        //     let index = event.index - 1;
        //     data = this.listTab[index].kode.kode;
        //     this.form.get('kdJenisDokumenHead').setValue(data);
        // } else {
        //     data = '';
        //     this.form.get('kdJenisDokumenHead').setValue(null);
        // }
        // this.kdAsalHead = data;
        // this.pencarian = '';
        // this.getPage(this.page, this.rows, this.pencarian);

        // this.valuechange('');
        // this.formAktif = true;
    }

    loadJenisDokumen() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisDokumen&select=namaJenisDokumen,id').subscribe(res => {
            this.parentDokumen = [];
            this.parentDokumen.push({ label: '--Pilih Data Parent Jenis Dokumen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.parentDokumen.push({ label: res.data.data[i].namaJenisDokumen, value: res.data.data[i].id.kode })
            };
        });
    }

    loadMasterDokumen() {

        //dokumen head
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAllHead').subscribe(res => {
            this.dokumenHead = [];
            this.dokumenHead.push({ label: '--Pilih--', value: null })
            for (var i = 0; i < res.data.length; i++) {
                this.dokumenHead.push({ label: res.data[i].namaJudulDokumen, value: res.data[i].kode.kode })
            };
        });

        //jenis dokumen
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAllData').subscribe(res => {
            this.jenisDokumen = [];
            this.jenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: '' })
            for (var i = 0; i < res.JenisDokumen.length; i++) {
                this.jenisDokumen.push({ label: res.JenisDokumen[i].namaJenisDokumen, value: res.JenisDokumen[i].kdJenisDokumen })
            };
        });

        //kategori dokumen
        this.httpService.get(Configuration.get().dataMasterNew + '/kategorydokumen/findAllData').subscribe(res => {
            this.kategoriDokumen = [];
            this.kategoriDokumen.push({ label: '--Pilih Kategori Dokumen--', value: '' })
            for (var i = 0; i < res.KategoryDokumen.length; i++) {
                this.kategoriDokumen.push({ label: res.KategoryDokumen[i].namaKategoryDokumen, value: res.KategoryDokumen[i].kode.kode })
            };
        });
    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcelJenisDok() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?').subscribe(table => {
            this.listData = table.JenisDokumen;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                // if (this.listData[i].statusEnabled == true){
                this.codes.push({

                    kode: this.listData[i].kode.kode,
                    namaJenisDokumen: this.listData[i].namaJenisDokumen,
                    reportDisplay: this.listData[i].reportDisplay,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,
                    statusEnabled: this.listData[i].statusEnabled

                })
                // }
            }
            this.fileService.exportAsExcelFile(this.codes, 'JenisDokumen');
        });
    }
    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    downloadExcelMasterDokumen() {

    }

    downloadPdfMasterDokumen() {

    }

    downloadPdfJenisDok() {
        let b = Configuration.get().report + '/jenisDokumen/laporanJenisDokumen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=true';

        window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    cetak() {
        if (this.index == 0) {
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/jenisDokumen/laporanJenisDokumen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=false', 'frmJenisDokumen_laporanCetak');
        } else {
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/dokumen/laporanDokumen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmDokumen_laporanCetak');
        }
    }

    getPage(page: number, rows: number, search: any) {
        if (this.index == 0) {
            this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
                this.listData = table.JenisDokumen;
                this.totalRecords = table.totalRow;
            });
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
                this.listData = table.Dokumen;
                this.totalRecords = table.totalRow;
            });
        }
    }

    cari() {
        if (this.index == 0) {
            this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisDokumen&sort=desc&namaJenisDokumen=' + this.pencarian).subscribe(table => {
                this.listData = table.JenisDokumen;
                this.totalRecords = table.totalRow;
            });
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJudulDokumen&sort=desc&namaJudulDokumen=' + this.pencarian).subscribe(table => {
                this.listData = table.Dokumen;
                this.totalRecords = table.totalRow;
            });
        }
    }

    loadPage(event: LazyLoadEvent) {
        let data = this.formJenisDokumen.get('kdJenisDokumenHead').value;
        if (data == null) {
            this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        } else {
            this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        }
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        if (this.index == 0) {
            let kode = this.formJenisDokumen.get('kode').value;
            if (kode == null || kode == undefined || kode == "") {
                this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Dokumen');
            } else {
                this.confirmationService.confirm({
                    message: 'Apakah data akan di hapus?',
                    header: 'Konfirmasi Hapus',
                    icon: 'fa fa-trash',
                    accept: () => {
                        this.hapusJenisDokumen();
                    },
                    reject: () => {
                        this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                    }
                });
            }
        } else {
            let kode = this.formMasterDokumen.get('kode').value;
            if (kode == null || kode == undefined || kode == "") {
                this.alertService.warn('Peringatan', 'Pilih Daftar Master Dokumen');
            } else {
                this.confirmationService.confirm({
                    message: 'Apakah data akan di hapus?',
                    header: 'Konfirmasi Hapus',
                    icon: 'fa fa-trash',
                    accept: () => {
                        this.hapusMasterDokumen();
                    },
                    reject: () => {
                        this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                    }
                });
            }
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
        if (this.index == 0) {
            if (this.formJenisDokumen.invalid) {
                this.validateAllFormFields(this.formJenisDokumen);
                this.alertService.warn("Peringatan", "Data Tidak Sesuai")
            } else {
                this.simpanJenisDokumen();
            }
        } else {
            if (this.formMasterDokumen.invalid) {
                this.validateAllFormFields(this.formMasterDokumen);
                // console.log(this.form);
                this.alertService.warn("Peringatan", "Data Tidak Sesuai")
            } else {
                this.simpanMasterDokumen();
            }
            console.log('Master Dokumen')
        }
    }

    confirmUpdateMasterDokumen() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateMasterDokumen();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }

    updateMasterDokumen() {
        // let tglDokumen = this.setTimeStamp(this.form.get('tglDokumen').value)
        let tglAwal = Math.round(this.setTimeStamp(this.formMasterDokumen.get('tglAwalBerlaku').value))
        let tglAkhir = Math.round(this.setTimeStamp(this.formMasterDokumen.get('tglAkhirBerlaku').value))

        // let formSubmit = this.form.value;
        // formSubmit.tglDokumen = tglDokumen;
        let dokumenCreatorDto = [];
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findByKode/' + this.formMasterDokumen.get('kode').value).subscribe(res => {
            for (let i = 0; i < res.DokumenCreator.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.formMasterDokumen.get('kode').value,
                    "namaLengkap": res.DokumenCreator[i].namaLengkap,
                    "kdPegawai": res.DokumenCreator[i].kdPegawai,
                    "statusEnabled": false
                }
                dokumenCreatorDto.push(dataTemp);
            }
            for (let i = 0; i < res.DokumenCreatorPegawai.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.formMasterDokumen.get('kode').value,
                    "namaLengkap": res.DokumenCreatorPegawai[i].namaLengkap,
                    "kdPegawai": res.DokumenCreatorPegawai[i].kdPegawai,
                    "statusEnabled": false
                }
                dokumenCreatorDto.push(dataTemp);
            }
            for (let i = 0; i < this.listPegawaiPemilikDokumen.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.formMasterDokumen.get('kode').value,
                    "namaLengkap": this.listPegawaiPemilikDokumen[i].kdPegawaiPemilik.namaLengkap,
                    "kdPegawai": this.listPegawaiPemilikDokumen[i].kdPegawaiPemilik.id_kode,
                    "statusEnabled": true
                }
                dokumenCreatorDto.push(dataTemp);
            }

            for (let i = 0; i < this.listPemilikDokumenBaru.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.formMasterDokumen.get('kode').value,
                    "namaLengkap": this.listPemilikDokumenBaru[i].namaPemilikDokumenBaru,
                    "kdPegawai": null,
                    "statusEnabled": true
                }
                dokumenCreatorDto.push(dataTemp);
            }
            if (dokumenCreatorDto == null) {
                let dataTemp = {
                    "namaLengkap": null,
                    "kdPegawai": null,
                    "statusEnabled": true
                }
                dokumenCreatorDto.push(dataTemp);
            }
            let dokumenDto = {
                "kode": this.formMasterDokumen.get('kode').value,
                "kdDokumenHead": this.formMasterDokumen.get('kdDokumenHead').value,
                "kdKategoryDokumen": this.formMasterDokumen.get('kdKategoryDokumen').value,
                "kdLokasi": this.formMasterDokumen.get('kdLokasi').value,
                "deskripsiDokumen": this.formMasterDokumen.get('deskripsiDokumen').value,
                "kdJenisDokumen": this.formMasterDokumen.get('kdJenisDokumen').value,
                "namaJudulDokumen": this.formMasterDokumen.get('namaJudulDokumen').value,
                "qtyPages": this.formMasterDokumen.get('qtyPages').value,
                "isbn": this.formMasterDokumen.get('isbn').value,
                "tglAwalBerlaku": tglAwal,
                "tglAkhirBerlaku": tglAkhir,
                "reportDisplay": this.formMasterDokumen.get('reportDisplay').value,
                "kodeExternal": this.formMasterDokumen.get('kodeExternal').value,
                "namaExternal": this.formMasterDokumen.get('namaExternal').value,
                "isiDokumen": this.isiDokumen,
                "pathFile": this.formMasterDokumen.get('pathFile').value,
                "statusEnabled": this.formMasterDokumen.get('statusEnabled').value,
                "imageFile": this.formMasterDokumen.get('imageFile').value,
            }
            let dokumenLokasiDto;
            // let dokumenLokasiDto2
            if (this.formMasterDokumen.get('kdLokasi').value == null) {
                // dokumenLokasiDto1 = null;
                dokumenLokasiDto.kdLokasi = 1;
            } else {
                dokumenLokasiDto = {
                    "kdDokumen": res.Dokumen.kode.kode,
                    "kdLokasi": this.formMasterDokumen.get('kdLokasi').value,
                    "qtyDokumen": this.formMasterDokumen.get('qtyDokumen').value,
                    "statusEnabled": true,
                }
            }
            dokumenLokasiDto = {
                "kdDokumen": res.Dokumen.kode.kode,
                "kdLokasi": this.formMasterDokumen.get('kdLokasi').value,
                "qtyDokumen": this.formMasterDokumen.get('qtyDokumen').value,
                "statusEnabled": true,
            }
            if ((dokumenLokasiDto.qtyDokumen == null) || (dokumenLokasiDto.qtyDokumen == "")) {
                dokumenLokasiDto.qtyDokumen = 1;
            }
            let dataSimpan = {
                dokumenCreatorDto,
                dokumenDto,
                // dokumenLokasiDto1,
                dokumenLokasiDto
            }

            console.log(JSON.stringify(dataSimpan))
            this.httpService.update(Configuration.get().dataMasterNew + '/dokumen/update', dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.getPage(this.page, this.rows, this.pencarian);
                this.reset();
            });
        })
    }

    simpanJenisDokumen() {
        if (this.formAktifJenisDokumen == false) {
            this.confirmUpdateJenisDokumen()
        } else {

            this.httpService.post(Configuration.get().dataMasterNew + '/jenisdokumen/save?', this.formJenisDokumen.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }

    simpanMasterDokumen() {
        let tglAwal = Math.round(this.setTimeStamp(this.formMasterDokumen.get('tglAwalBerlaku').value))
        let tglAkhir = Math.round(this.setTimeStamp(this.formMasterDokumen.get('tglAkhirBerlaku').value))
        let dokumenCreatorDto = [];
        for (let i = 0; i < this.listPegawaiPemilikDokumen.length; i++) {
            let dataTemp = {
                "namaLengkap": this.listPegawaiPemilikDokumen[i].kdPegawaiPemilik.namaLengkap,
                "kdPegawai": this.listPegawaiPemilikDokumen[i].kdPegawaiPemilik.id_kode,
                "statusEnabled": true
            }
            dokumenCreatorDto.push(dataTemp);
        }

        for (let i = 0; i < this.listPemilikDokumenBaru.length; i++) {
            let dataTemp = {
                "namaLengkap": this.listPemilikDokumenBaru[i].namaPemilikDokumenBaru,
                "kdPegawai": null,
                "statusEnabled": true
            }
            dokumenCreatorDto.push(dataTemp);
        }
        if (dokumenCreatorDto == null) {
            let dataTemp = {
                "namaLengkap": null,
                "kdPegawai": null,
                "statusEnabled": true
            }
            dokumenCreatorDto.push(dataTemp);
        }
        let dokumenDto = {
            "kode": this.formMasterDokumen.get('kode').value,
            "kdDokumenHead": this.formMasterDokumen.get('kdDokumenHead').value,
            "kdKategoryDokumen": this.formMasterDokumen.get('kdKategoryDokumen').value,
            "kdLokasi": this.formMasterDokumen.get('kdLokasi').value,
            "deskripsiDokumen": this.formMasterDokumen.get('deskripsiDokumen').value,
            "kdJenisDokumen": this.formMasterDokumen.get('kdJenisDokumen').value,
            "namaJudulDokumen": this.formMasterDokumen.get('namaJudulDokumen').value,
            "qtyPages": this.formMasterDokumen.get('qtyPages').value,
            "isbn": this.formMasterDokumen.get('isbn').value,
            "tglAwalBerlaku": tglAwal,
            "tglAkhirBerlaku": tglAkhir,
            "reportDisplay": this.formMasterDokumen.get('reportDisplay').value,
            "kodeExternal": this.formMasterDokumen.get('kodeExternal').value,
            "namaExternal": this.formMasterDokumen.get('namaExternal').value,
            "isiDokumen": this.isiDokumen,
            "pathFile": this.formMasterDokumen.get('pathFile').value,
            "imageFile": this.formMasterDokumen.get('imageFile').value,
            "statusEnable": this.formMasterDokumen.get('statusEnabled').value,
        }
        let dokumenLokasiDto
        if ((this.formMasterDokumen.get('kdLokasi').value) == null) {
            dokumenLokasiDto = null;
        } else {
            dokumenLokasiDto = {
                "kdDokumen": this.formMasterDokumen.get('kdDokumen').value,
                "kdLokasi": this.formMasterDokumen.get('kdLokasi').value,
                "qtyDokumen": this.formMasterDokumen.get('qtyDokumen').value,
                "statusEnabled": true,
            }
        }
        let dataSimpan = {
            dokumenCreatorDto,
            dokumenDto,
            dokumenLokasiDto
        }
        console.log(JSON.stringify(dataSimpan))
        if (this.formAktifMasterDokumen == false) {
            this.confirmUpdateMasterDokumen()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/dokumen/save?', dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getPage(this.page, this.rows, this.pencarian);
                this.reset();
                this.dokumen1 = true;
                this.dokumen2 = true;
                this.dokumen3 = true;
                this.isiDokumen = '';
            });
        }
    }

    confirmUpdateJenisDokumen() {

        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateJenisDokumen();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }

    updateJenisDokumen() {
        this.httpService.update(Configuration.get().dataMasterNew + '/jenisdokumen/update/' + this.versi, this.formJenisDokumen.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    hapusJenisDokumen() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/jenisdokumen/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPage(this.page, this.rows, this.pencarian);
        });
        this.reset();
    }

    reset() {
        this.formAktif = true;
        this.formAktifJenisDokumen = true;
        this.formAktifMasterDokumen = true;
        this.pencarian = '';
        this.isiDokumen = '';
        this.ngOnInit();
    }

    cloneMasterDokumen(cloned: Dokumen): Dokumen {
        let hub = new InisialDokumen();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialDokumen();
        if ((hub.tglAwalBerlaku == null || hub.tglAwalBerlaku == 0) && (hub.tglAkhirBerlaku == null || hub.tglAkhirBerlaku == 0)) {
            fixHub = {
                "kode": hub.kode.kode,
                "deskripsiDokumen": hub.deskripsiDokumen,
                "reportDisplay": hub.reportDisplay,
                "namaJudulDokumenHead": hub.namaJudulDokumenHead,
                // "isDokumenInOutInt": hub.isDokumenInOutInt,
                "kdDokumenHead": hub.kdDokumenHead,
                "kdDokumen": null,
                "kdJenisDokumen": hub.kdJenisDokumen,
                "kdKategoryDokumen": hub.kdKategoryDokumen,
                "kdLokasi": + hub.kdLokasi,
                // "kdPegawaiPembuat": hub.kdPegawaiPembuat,
                "kdRuangan": hub.kdRuangan,
                // "kdStatus": hub.kdStatus,
                "kodeExternal": hub.kodeExternal,
                "namaExternal": hub.namaExternal,
                // "namaDokumen": hub.namaDokumen,
                "namaJudulDokumen": hub.namaJudulDokumen,
                // "noDokumen": hub.noDokumen,
                // "pathFile": hub.pathFile,
                "qtyPages": hub.qtyPages,
                "isbn": hub.isbn,
                "qtyDokumen": null,
                // "retensiDokumenTahun": hub.retensiDokumenTahun,
                "statusEnabled": hub.statusEnabled,
                // "tglDokumen": null,
                "tglAwalBerlaku": null,
                "tglAkhirBerlaku": null,
                "isiDokumen": hub.isiDokumen,
                "pathFile": hub.pathFile,
                "imageFile": hub.imageFile,
                // "namaLengkap": hub.namaLengkap,

            }
            this.isiDokumen = hub.isiDokumen;
            this.versi = hub.version;
            return fixHub;
        } else {
            fixHub = {
                "kode": hub.kode.kode,
                "deskripsiDokumen": hub.deskripsiDokumen,
                "reportDisplay": hub.reportDisplay,
                "namaJudulDokumenHead": hub.namaJudulDokumenHead,
                // "isDokumenInOutInt": hub.isDokumenInOutInt,
                "kdDokumenHead": hub.kdDokumenHead,
                "kdDokumen": null,
                "kdJenisDokumen": hub.kdJenisDokumen,
                "kdKategoryDokumen": hub.kdKategoryDokumen,
                "kdLokasi": + hub.kdLokasi,
                // "kdPegawaiPembuat": hub.kdPegawaiPembuat,
                "kdRuangan": hub.kdRuangan,
                // "kdStatus": hub.kdStatus,
                "kodeExternal": hub.kodeExternal,
                "namaExternal": hub.namaExternal,
                // "namaDokumen": hub.namaDokumen,
                "namaJudulDokumen": hub.namaJudulDokumen,
                // "noDokumen": hub.noDokumen,
                // "pathFile": hub.pathFile,
                "qtyPages": hub.qtyPages,
                "isbn": hub.isbn,
                "qtyDokumen": null,
                // "retensiDokumenTahun": hub.retensiDokumenTahun,
                "statusEnabled": hub.statusEnabled,
                "tglAwalBerlaku": new Date(hub.tglAwalBerlaku * 1000),
                "tglAkhirBerlaku": new Date(hub.tglAkhirBerlaku * 1000),
                // "tglDokumen": new Date(hub.tglDokumen * 1000),
                // "isiDokumen": hub.isiDokumen,
                "pathFile": hub.pathFile,
                "imageFile": hub.imageFile,
                // "namaLengkap": hub.namaLengkap,

            }
            this.isiDokumen = hub.isiDokumen;
            this.versi = hub.version;
            return fixHub;
        }
    }

    onRowSelect(event) {
        if (this.index == 0) {
            let cloned = this.cloneJenisDokumen(event.data);
            this.formAktifJenisDokumen = false;
            this.formJenisDokumen.setValue(cloned);
        } else {
            this.listPegawaiPemilikDokumen = [];
            this.listPemilikDokumenBaru = [];
            console.log(event)
            let cloned = this.cloneMasterDokumen(event.data);
            let dataTemp1;
            let dataTemp2;
            this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findByKode/' + event.data.kode.kode).subscribe(res => {
                let listPegawaiPemilikDokumen = [];
                for (let i = 0; i < res.DokumenCreatorPegawai.length; i++) {
                    dataTemp1 = {
                        "kdPegawaiPemilik": {
                            "namaLengkap": res.DokumenCreatorPegawai[i].namaLengkap,
                            "id_kode": res.DokumenCreatorPegawai[i].kdPegawai
                        }
                    }
                    // let listPegawaiPemilikDokumen = [...this.listPegawaiPemilikDokumen];

                    listPegawaiPemilikDokumen.push(dataTemp1);
                }
                this.listPegawaiPemilikDokumen = listPegawaiPemilikDokumen;
                let listPemilikDokumenBaru = [];
                for (let j = 0; j < res.DokumenCreator.length; j++) {
                    let dataTemp2 = {
                        // "namaPemilikDokumenBaru": null
                        "namaPemilikDokumenBaru": res.DokumenCreator[j].namaLengkap,
                        "kdPegawai": res.DokumenCreator[j].kdPegawai
                    }
                    // let listPemilikDokumenBaru = [...this.listPemilikDokumenBaru];
                    listPemilikDokumenBaru.push(dataTemp2);

                }
                this.listPemilikDokumenBaru = listPemilikDokumenBaru;
                this.formMasterDokumen.get('qtyDokumen').setValue(res.DokumenLokasi[0].qtyDokumen)
                this.formMasterDokumen.get('kdLokasi').setValue(res.DokumenLokasi[0].kode.kdLokasi)
            })
            if (event.data.pathFile != null) {
                this.uploadData = 'file';
                this.dokumen1 = true;
                this.dokumen2 = false;
                this.dokumen3 = true;
            } else if (event.data.imageFile != null) {
                this.uploadData = 'gambar';
                this.dokumen1 = true;
                this.dokumen2 = true;
                this.dokumen3 = false;
            } else if (event.data.isiDokumen != null) {
                this.uploadData = 'textEditor';
                this.dokumen1 = false;
                this.dokumen2 = true;
                this.dokumen3 = true;
            } else {
                this.uploadData = '';
                this.dokumen1 = true;
                this.dokumen2 = true;
                this.dokumen3 = true;
            }

            this.formAktifMasterDokumen = false;
            this.formMasterDokumen.setValue(cloned);
        }
        // let cloned = this.clone(event.data);
        // this.formAktif = false;
        // this.form.setValue(cloned);
    }

    cloneJenisDokumen(cloned: JenisDokumen): JenisDokumen {
        let hub = new InisialJenisDokumen();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialJenisDokumen();
        fixHub = {
            "kode": hub.kode.kode,
            "kdJenisDokumenHead": hub.kdJenisDokumenHead,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaJenisDokumen": hub.namaJenisDokumen,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled,
            "kdDepartemen": hub.kdDepartemen
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapusMasterDokumen() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/dokumen/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPage(this.page, this.rows, this.pencarian);
        });
        this.reset();
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }

    urlUpload() {
        return Configuration.get().resourceFile + '/file/upload?noProfile=False';
    }

    fileUpload(event) {
        this.namaFile = event.xhr.response;
        // this.form.controls["pathFile"].setValue(this.namaFile);
        this.smbrFile = Configuration.get().resourceFile + '/file/download/' + this.namaFile;
    }

    addHeader(event) {
        this.httpService.beforeUploadFile(event);
    }

    imageUpload(event) {
        this.namaImage = event.xhr.response;
        this.smbrImage = Configuration.get().resourceFile + '/image/show/' + this.namaImage;
    }

    getPilihIsi(value) {
        let dataValue = value;
        // console.log(dataValue);
        if (dataValue == 'textEditor') {
            this.dokumen1 = false;
            this.dokumen2 = true;
            this.dokumen3 = true;
            this.namaImage = null;
            this.namaFile = null;
        } else if (dataValue == 'file') {
            this.dokumen1 = true;
            this.dokumen2 = false;
            this.dokumen3 = true;
            this.isiDokumen = '';
            this.namaImage = null;
        } else if (dataValue == 'gambar') {
            this.dokumen1 = true;
            this.dokumen2 = true;
            this.dokumen3 = false;
            this.isiDokumen = '';
            this.namaFile = null;
        }
    }

    tambahPegawaiPemilikDokumen() {
        let dataTemp = {
            "kdPegawaiPemilik": {
                "namaLengkap": "--Pilih Pegawai Pemilik--",
                "id_kode": null
            }
        }
        let listPegawaiPemilikDokumen = [...this.listPegawaiPemilikDokumen];
        listPegawaiPemilikDokumen.push(dataTemp);
        this.listPegawaiPemilikDokumen = listPegawaiPemilikDokumen;
    }

    tambahPemilikDokumenBaru() {
        let dataTemp = {
            "namaPemilikDokumenBaru": null
        }
        let listPemilikDokumenBaru = [...this.listPemilikDokumenBaru];
        listPemilikDokumenBaru.push(dataTemp);
        this.listPemilikDokumenBaru = listPemilikDokumenBaru;
    }

    hapusPegawaiPemilikDokumen(row) {
        let listPegawaiPemilikDokumen = [...this.listPegawaiPemilikDokumen];
        listPegawaiPemilikDokumen.splice(row, 1);
        this.listPegawaiPemilikDokumen = listPegawaiPemilikDokumen;
    }

    hapusPemilikDokumenBaru(row) {
        let listPemilikDokumenBaru = [...this.listPemilikDokumenBaru];
        listPemilikDokumenBaru.splice(row, 1);
        this.listPemilikDokumenBaru = listPemilikDokumenBaru;
    }

    getListPegawaiAktif() {
        this.httpService.get(Configuration.get().dataMasterNew + '/registrasiPegawai/findMasterPegawaiAktif').subscribe(res => {
            this.listPegawaiAktif = [];
            this.listPegawaiAktif.push({ label: '--Pilih Pegawai Pemilik--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listPegawaiAktif.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i] })
            };
        });
    }

    getLokasiDokumen() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Lokasi&select=namaLokasi,id').subscribe(res => {
            this.lokasiDokumen = [];
            this.lokasiDokumen.push({ label: '--Pilih Lokasi Dokumen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.lokasiDokumen.push({ label: res.data.data[i].namaLokasi, value: res.data.data[i].id.kode })
            };
        });
    }

    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }

    setReportDisplay() {
        this.formMasterDokumen.get('reportDisplay').setValue(this.formMasterDokumen.get('namaJudulDokumen').value)
    }

    setReportDisplay1() {
        this.formJenisDokumen.get('reportDisplay').setValue(this.formJenisDokumen.get('namaJenisDokumen').value)
    }

    qty() {
        var str = this.formMasterDokumen.get('qtyPages').value;
        var regx = /[^0-9]/g;
        str = str.toString();
        var result = str.replace(regx, '');
        this.formMasterDokumen.get('qtyPages').setValue(result);
    }

    qtyLokasiDok() {
        var str = this.formMasterDokumen.get('qtyDokumen').value;
        var regx = /[^0-9]/g;
        str = str.toString();
        var result = str.replace(regx, '');
        this.formMasterDokumen.get('qtyDokumen').setValue(result);
    }

    clearFilterJenisDok(dropdown: any) {
        dropdown.filterValue = '';
    }

    clearFilterMasterDok(dropdown1: any, dropdown2: any, dropdown3: any) {
        dropdown1.filterValue = '';
        dropdown2.filterValue = '';
        dropdown3.filterValue = '';
    }
}

class InisialJenisDokumen implements JenisDokumen {

    constructor(
        public kode?,
        public jenisDokumen?,
        public kdJenisDokumenHead?,
        public kdDepartemen?,
        public kodeJenisDokumen?,
        public namaJenisDokumen?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?
    ) { }

}

class InisialDokumen implements Dokumen {

    constructor(
        public kdProfile?,
        public kdDokumen?,
        public namaDokumen?,
        public reportDisplay?,
        public deskripsiDokumen?,
        public tglDokumen?,
        public tglAkhirBerlaku?,
        public tglAwalBerlaku?,
        public kdJenisDokumen?,
        public kdKategoryDokumen?,
        public kdLokasi?,
        public namaJudulDokumen?,
        public isiDokumen?,
        // public pathFile?,
        // public qtyLampiran?,
        public kdDokumenHead?,
        // public dokumenHead?,
        public kdRuangan?,
        public isbn?,
        public kdPegawaiPembuat?,
        public pegawaiPembuat?,
        public kdPegawai?,
        // public isDokumenInOutInt?,
        // public retensiDokumenTahun?,
        // public kdStatus?,
        public kodeExternal?,
        public namaExternal?,
        public kdDepartemen?,
        public statusEnabled?,
        // public noRec?,
        public label?,
        public value?,
        public kode?,
        public version?,
        public imageFile?,
        public pathFile?,
        public qtyPages?,
        public qtyDokumen?,
        public namaLengkap?,
        public namaJudulDokumenHead?,
        // public dokumenInOut?,
    ) { }

}