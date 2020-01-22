import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Dokumen } from './master-new-dokumen.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { every } from 'rxjs/operators';
import { listenToElementOutputs } from '@angular/core/src/view/element';
@Component({
    selector: 'app-master-new-dokumen',
    templateUrl: './master-new-dokumen.component.html',
    styleUrls: ['./master-new-dokumen.component.scss'],
    providers: [ConfirmationService]
})
export class MasterNewDokumenComponent implements OnInit {
    selected: Dokumen;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    jenisDokumen: Dokumen[];
    lokasiDokumen: Dokumen[];
    kategoriDokumen: Dokumen[];
    dokumenHead: Dokumen[];
    ruangan: Dokumen[];
    pegawaiPembuat: Dokumen[];
    status: Dokumen[];
    departemen: Dokumen[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    resFile: string;
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    laporan: boolean = false;
    codes: any[];
    kdprof: any;
    kddept: any;
    listPegawaiPemilikDokumen: any[];
    listPemilikDokumenBaru: any[];
    listPegawaiAktif: any[];
    namaFile: string;
    namaImage: string;
    smbrImage: string;
    uploadData: any = "textEditor";
    smbrFile: string;
    dokumen1: any;
    dokumen2: any;
    dokumen3: any;
    isiDokumen: any;
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
        this.getPilihIsi(this.uploadData);
        this.listPegawaiPemilikDokumen = [];
        this.listPemilikDokumenBaru = [];
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
        this.listData = [];
        this.isiDokumen = '';
        this.get(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
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
        this.getJenisDokumen();
        this.getKategoriDokumen();
        this.getLokasiDokumen();
        this.getDokumenHead();
        this.getPegawaiPembuat();
        this.getListPegawaiAktif();

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

    getPegawaiPembuat() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pegawai&select=namaLengkap,id').subscribe(res => {
            this.pegawaiPembuat = [];
            this.pegawaiPembuat.push({ label: '--Pilih Pegawai--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.pegawaiPembuat.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id.kode })
            };
        });
    }

    getDokumenHead() {
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAllHead').subscribe(res => {
            this.dokumenHead = [];
            this.dokumenHead.push({ label: '--Pilih--', value: null })
            for (var i = 0; i < res.data.length; i++) {
                this.dokumenHead.push({ label: res.data[i].namaJudulDokumen, value: res.data[i].kode.kode })
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

    getKategoriDokumen() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kategorydokumen/findAllData').subscribe(res => {
            this.kategoriDokumen = [];
            this.kategoriDokumen.push({ label: '--Pilih Kategori Dokumen--', value: '' })
            for (var i = 0; i < res.KategoryDokumen.length; i++) {
                this.kategoriDokumen.push({ label: res.KategoryDokumen[i].namaKategoryDokumen, value: res.KategoryDokumen[i].kode.kode })
            };
        });
    }

    getJenisDokumen() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAllData').subscribe(res => {
            this.jenisDokumen = [];
            this.jenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: '' })
            for (var i = 0; i < res.JenisDokumen.length; i++) {
                this.jenisDokumen.push({ label: res.JenisDokumen[i].namaJenisDokumen, value: res.JenisDokumen[i].kdJenisDokumen })
            };
        });
    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    timeStampToDate(timestamp) {
        let d = new Date(timestamp * 1000);
        // let f = new SimpleDateFormat("dd/MM/yyyy");
        // let formatteddate = f.format(d);
        let monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        // let formatteddate = d.getDay() + ' ' + monthname[d.getMonth()] + ' ' + d.getFullYear();
        let formatteddate = d;
        return formatteddate;
    }

    getDate(date) {
        let dd = new Date(date * 1000);

        let d = dd.getDate();
        let m = dd.getMonth();
        let y = dd.getFullYear();

        return ((d < 10) ? ('0' + d) : d) + ' ' + this.month[m] + ' ' + y;
    }

    downloadExcel() {
        // this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=1&rows=10&dir=namaDokumen&sort=desc').subscribe(table => {
        //     this.listData = table.Dokumen;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         // if (this.listData[i].statusEnabled == true){
        //         this.codes.push({

        //             kode: this.listData[i].kode.kode,
        //             namaDokumenHead: this.listData[i].namaDokumenHead,
        //             noDokumen: this.listData[i].noDokumen,
        //             // namaDokumen: this.listData[i].namaDokumen,
        //             deskripsiDokumen: this.listData[i].deskripsiDokumen,
        //             tglDokumen: this.getDate(this.listData[i].tglDokumen),
        //             namaJenisDokumen: this.listData[i].namaJenisDokumen,
        //             namaKategoryDokumen: this.listData[i].namaKategoryDokumen,
        //             namaLokasi: this.listData[i].namaLokasi,
        //             pathFile: this.listData[i].pathFile,
        //             qtyLampiran: this.listData[i].qtyLampiran,
        //             namaRuangan: this.listData[i].namaRuangan,
        //             isDokumenInOutInt: this.listData[i].isDokumenInOutInt,
        //             retensiDokumenTahun: this.listData[i].retensiDokumenTahun,
        //             namaStatus: this.listData[i].namaStatus,
        //             reportDisplay: this.listData[i].reportDisplay,
        //             kodeExternal: this.listData[i].kodeExternal,
        //             namaExternal: this.listData[i].namaExternal,
        //             statusEnabled: this.listData[i].statusEnabled

        //         })
        //         // }
        //     }
        //     this.fileService.exportAsExcelFile(this.codes, 'Dokumen');
        // });
    }

    downloadPdf() {
        // let cetak = Configuration.get().report + '/dokumen/laporanDokumen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
        // window.open(cetak);
        // var col = ["Kode", "Parent", "Nomor", "Nama ", "Deskripsi ", " Tanggal", "Jenis", "Kategori",
        // "Lokasi", "Path File", "Quantity Lampiran", "Unit Kerja", "Dokumen Keluar Masuk", "Retensi Dokumen", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=1&rows=10&dir=namaDokumen&sort=desc').subscribe(table => {
        //     this.listData = table.Dokumen;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         if (this.listData[i].statusEnabled == true){
        //             // let tglDokumen = 
        //             this.codes.push({

        //                 kode: this.listData[i].kode.kode,
        //                 namaDokumenHead: this.listData[i].namaDokumenHead,
        //                 noDokumen: this.listData[i].noDokumen,
        //                 namaDokumen: this.listData[i].namaDokumen,
        //                 deskripsiDokumen: this.listData[i].deskripsiDokumen,
        //                 tglDokumen:  this.getDate(this.listData[i].tglDokumen),
        //                 namaJenisDokumen: this.listData[i].namaJenisDokumen,
        //                 namaKategoryDokumen: this.listData[i].namaKategoryDokumen,
        //                 namaLokasi: this.listData[i].namaLokasi,
        //                 pathFile: this.listData[i].pathFile,
        //                 qtyLampiran: this.listData[i].qtyLampiran,
        //                 namaRuangan: this.listData[i].namaRuangan,
        //                 isDokumenInOutInt: this.listData[i].isDokumenInOutInt,
        //                 retensiDokumenTahun: this.listData[i].retensiDokumenTahun,
        //                 namaStatus: this.listData[i].namaStatus,
        //                 reportDisplay: this.listData[i].reportDisplay,
        //                 kodeExternal: this.listData[i].kodeExternal,
        //                 namaExternal: this.listData[i].namaExternal,
        //                 statusEnabled: this.listData[i].statusEnabled


        //             })
        //         }
        //     }
        //     this.fileService.exportAsPdfFile("Master Dokumen", col, this.codes, "Dokumen");
        // });

    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.Dokumen;
            this.totalRecords = table.totalRow;
        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJudulDokumen&sort=desc&namaJudulDokumen=' + this.pencarian).subscribe(table => {
            this.listData = table.Dokumen;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Dokumen');
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
        // console.log(this.listPemilikDokumenBaru);
        if (this.form.invalid) {
            this.validateAllFormFields(this.form);
            // console.log(this.form);
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
        // let tglDokumen = this.setTimeStamp(this.form.get('tglDokumen').value)
        let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglAwalBerlaku').value))
        let tglAkhir = Math.round(this.setTimeStamp(this.form.get('tglAkhirBerlaku').value))

        // let formSubmit = this.form.value;
        // formSubmit.tglDokumen = tglDokumen;
        let dokumenCreatorDto = [];
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findByKode/' + this.form.get('kode').value).subscribe(res => {
            for (let i = 0; i < res.DokumenCreator.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.form.get('kode').value,
                    "namaLengkap": res.DokumenCreator[i].namaLengkap,
                    "kdPegawai": res.DokumenCreator[i].kdPegawai,
                    "statusEnabled": false
                }
                dokumenCreatorDto.push(dataTemp);
            }
            for (let i = 0; i < res.DokumenCreatorPegawai.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.form.get('kode').value,
                    "namaLengkap": res.DokumenCreatorPegawai[i].namaLengkap,
                    "kdPegawai": res.DokumenCreatorPegawai[i].kdPegawai,
                    "statusEnabled": false
                }
                dokumenCreatorDto.push(dataTemp);
            }
            for (let i = 0; i < this.listPegawaiPemilikDokumen.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.form.get('kode').value,
                    "namaLengkap": this.listPegawaiPemilikDokumen[i].kdPegawaiPemilik.namaLengkap,
                    "kdPegawai": this.listPegawaiPemilikDokumen[i].kdPegawaiPemilik.id_kode,
                    "statusEnabled": true
                }
                dokumenCreatorDto.push(dataTemp);
            }

            for (let i = 0; i < this.listPemilikDokumenBaru.length; i++) {
                let dataTemp = {
                    "kdDokumen": this.form.get('kode').value,
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
                "kode": this.form.get('kode').value,
                "kdDokumenHead": this.form.get('kdDokumenHead').value,
                "kdKategoryDokumen": this.form.get('kdKategoryDokumen').value,
                "kdLokasi": this.form.get('kdLokasi').value,
                "deskripsiDokumen": this.form.get('deskripsiDokumen').value,
                "kdJenisDokumen": this.form.get('kdJenisDokumen').value,
                "namaJudulDokumen": this.form.get('namaJudulDokumen').value,
                "qtyPages": this.form.get('qtyPages').value,
                "isbn": this.form.get('isbn').value,
                "tglAwalBerlaku": tglAwal,
                "tglAkhirBerlaku": tglAkhir,
                "reportDisplay": this.form.get('reportDisplay').value,
                "kodeExternal": this.form.get('kodeExternal').value,
                "namaExternal": this.form.get('namaExternal').value,
                "isiDokumen": this.isiDokumen,
                "pathFile": this.form.get('pathFile').value,
                "statusEnabled": this.form.get('statusEnabled').value,
                "imageFile": this.form.get('imageFile').value,
            }
            let dokumenLokasiDto
            // let dokumenLokasiDto2
            if ((this.form.get('kdLokasi').value) == null) {
                // dokumenLokasiDto1 = null;
                dokumenLokasiDto = null;
            } else {
                dokumenLokasiDto = {
                    "kdDokumen": res.Dokumen.kode.kode,
                    "kdLokasi": this.form.get('kdLokasi').value,
                    "qtyDokumen": this.form.get('qtyDokumen').value,
                    "statusEnabled": true,
                }
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
                // this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        })
    }

    simpan() {
        let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglAwalBerlaku').value))
        let tglAkhir = Math.round(this.setTimeStamp(this.form.get('tglAkhirBerlaku').value))
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
            "kode": this.form.get('kode').value,
            "kdDokumenHead": this.form.get('kdDokumenHead').value,
            "kdKategoryDokumen": this.form.get('kdKategoryDokumen').value,
            "kdLokasi": this.form.get('kdLokasi').value,
            "deskripsiDokumen": this.form.get('deskripsiDokumen').value,
            "kdJenisDokumen": this.form.get('kdJenisDokumen').value,
            "namaJudulDokumen": this.form.get('namaJudulDokumen').value,
            "qtyPages": this.form.get('qtyPages').value,
            "isbn": this.form.get('isbn').value,
            "tglAwalBerlaku": tglAwal,
            "tglAkhirBerlaku": tglAkhir,
            "reportDisplay": this.form.get('reportDisplay').value,
            "kodeExternal": this.form.get('kodeExternal').value,
            "namaExternal": this.form.get('namaExternal').value,
            "isiDokumen": this.isiDokumen,
            "pathFile": this.form.get('pathFile').value,
            "imageFile": this.form.get('imageFile').value,
            "statusEnable": this.form.get('statusEnabled').value,
        }
        let dokumenLokasiDto
        if ((this.form.get('kdLokasi').value) == null) {
            dokumenLokasiDto = null;
        } else {
            dokumenLokasiDto = {
                "kdDokumen": this.form.get('kdDokumen').value,
                "kdLokasi": this.form.get('kdLokasi').value,
                "qtyDokumen": this.form.get('qtyDokumen').value,
                "statusEnabled": true,
            }
        }
        let dataSimpan = {
            dokumenCreatorDto,
            dokumenDto,
            dokumenLokasiDto
        }
        console.log(JSON.stringify(dataSimpan))
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/dokumen/save?', dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }

    reset() {
        this.formAktif = true;
        this.ngOnInit();
    }
    onRowSelect(event) {
        this.listPegawaiPemilikDokumen = [];
        this.listPemilikDokumenBaru = [];
        console.log(event)
        let cloned = this.clone(event.data);
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
            this.form.get('qtyDokumen').setValue(res.DokumenLokasi[0].qtyDokumen)
            this.form.get('kdLokasi').setValue(res.DokumenLokasi[0].kode.kdLokasi)
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

        this.formAktif = false;
        this.form.setValue(cloned);
        // console.log(JSON.stringify(this.listPegawaiPemilikDokumen))

    }
    clone(cloned: Dokumen): Dokumen {
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
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/dokumen/del/' + deleteItem.kode.kode).subscribe(response => {
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

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/dokumen/laporanDokumen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmDokumen_laporanCetak');
    }

    tutupLaporan() {
        this.laporan = false;
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

    setReportDisplay() {
        this.form.get('reportDisplay').setValue(this.form.get('namaJudulDokumen').value)
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