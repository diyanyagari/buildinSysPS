import { Inject, forwardRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Router } from "@angular/router";

@Component({
    selector: 'app-master-diskon',
    templateUrl: './master-diskon.component.html',
    styleUrls: ['./master-diskon.component.scss'],
    providers: [ConfirmationService]
})
export class MasterDiskonComponent implements OnInit {

    @ViewChild('filterSK') filterSK;
    @ViewChild('filterBank') filterBank;
    @ViewChild('filterRekanan') filterRekanan;

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

    namaSK;
    noSKIn;
    tglSKAwal;
    tglSKAkhir;
    namaFile = '';
    blocked1 = false;
    listDiskonBank: any[];
    listBank;
    listRekanan;
    paramPencarian: boolean;
    persenDiskon = true;
    hargaDiskon = true;
    hargaSatuanMin;

    constructor(private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private httpService: HttpClient,
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private fileService: FileService,
        private authGuard: AuthGuard,
        private route: Router,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

    ngAfterViewInit() {
        let x = document.getElementsByClassName('ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < x.length; i++) {
            x[i].style.height = '25px';
            x[i].style.paddingTop = '0px';
        }
    }


    ngOnInit() {
        this.paramPencarian = false;
        this.listDiskonBank = [];
        this.listBank = [];
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
        this.formAktif = true;
        this.form = this.fb.group({
            'kdDiscount': new FormControl(null),
            'nomorKode': new FormControl(null, Validators.required),
            'persenDiscount': new FormControl(null),
            'hargaDiscount': new FormControl(null),
            'noKontak': new FormControl(null),
            'hargaSatuanMin': new FormControl(null),
            'hargaTotalMin': new FormControl(null),
            'fileImagePathFile': new FormControl(null),
            'qtyUseMax': new FormControl(null),
            'noSK': new FormControl(null),
            'statusEnabled': new FormControl(true),
            'discountBankAccounts': new FormControl(null)
        });
        // this.getKdVisiHead();
        // this.getSmbrFile();
        this.getDataGrid(this.page, this.rows, this.pencarian)
        this.getSK();
        this.getListBank();
        this.getRekanan();
    }

    getListBank() {
        this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount/GetBankAccountNonUser').subscribe(res => {
            this.listBank = [];
            this.listBank.push({ label: '--Pilih List Bank--', value: '' })
            for (var i = 0; i < res.length; i++) {
                this.listBank.push({ label: res[i].namaBank + ' - ' + res[i].noAkunBank, value: res[i] })
            };
        });
    }

    getRekanan() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kontak-alamat-rekanan/findAll?page=1&rows=100&dir=kontak.namaLengkap&sort=desc').subscribe(res => {
            this.listRekanan = [];
            this.listRekanan.push({ label: '--Pilih Rekanan--', value: '' })
            for (var i = 0; i < res.data.length; i++) {
                this.listRekanan.push({ label: res.data[i].namaKontak, value: res.data[i].kode.noKontak })
            };
        });
    }

    getKelompokTransaksi() {
        this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/getKelompokTransaksi').subscribe(table => {
            let dataKelompokTransaksi = table.KelompokTransaksi;
            localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
            this.route.navigate(['/master-sk/surat-keputusan']);
        });
    }

    getSK() {
        this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/findSK').subscribe(res => {
            this.namaSK = [];
            this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
            for (var i = 0; i < res.SK.length; i++) {
                this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
            };
        });
    }

    ambilSK(sk) {
        console.log(sk)
        if (this.form.get('noSK').value == '' || this.form.get('noSK').value == null || this.form.get('noSK').value == undefined) {
            this.form.get('noSK').setValue(null);
            this.noSKIn = null;
            this.tglSKAwal = null;
            this.tglSKAkhir = null;
        } else {
            console.log('OK')
            this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getSK?noSK=' + sk.value).subscribe(table => {
                let detailSK = table.SK;
                this.noSKIn = detailSK[0].noSK;
                this.tglSKAwal = detailSK[0].tglBerlakuAwal * 1000;
                this.tglSKAkhir = detailSK[0].tglBerlakuAkhir * 1000;
                if (detailSK[0].tglBerlakuAwal == "" || detailSK[0].tglBerlakuAwal == null || detailSK[0].tglBerlakuAwal == undefined) {
                    this.tglSKAwal = null;
                } else {
                    this.tglSKAwal = new Date(detailSK[0].tglBerlakuAwal * 1000);
                }
                if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
                    this.tglSKAkhir = null;
                } else {
                    this.tglSKAkhir = new Date(detailSK[0].tglBerlakuAkhir * 1000);
                }
            });
        }
    }

    getDataGrid(page: number, rows: number, cari: string) {
        page = page - 1;
        this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/GetAllDiscount?PageIndex=' + page + '&PageSize=' + rows).subscribe(table => {
            this.listData = table.items;
            this.totalRecords = table.totalCount;
        });
    }

    async cari(page: number, rows: number, pencarian: string) {
        pencarian = this.pencarian;
        this.paramPencarian = true;
        page = page - 1;
        rows = this.rows;
        if (pencarian != '') {
            await this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/GetAllDiscount?keyword=' + pencarian + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
                this.listData = res.items;
                this.totalRecords = res.totalCount;
            });
        } else {
            await this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/GetAllDiscount?PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
                this.listData = res.items;
                this.totalRecords = res.totalCount;
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

    loadPage(event: LazyLoadEvent) {
        if (this.paramPencarian) {
            this.cari((event.rows + event.first) / event.rows, event.rows, this.pencarian);
            this.page = (event.rows + event.first) / event.rows;
            this.rows = event.rows;
        } else {
            this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
            this.page = (event.rows + event.first) / event.rows;
            this.rows = event.rows;
        }
    }

    clone(cloned: any) {
        let fixHub = {
            "kdDiscount": cloned.kdDiscount,
            "nomorKode": cloned.nomorKode,
            "persenDiscount": cloned.persenDiscount,
            "hargaDiscount": cloned.hargaDiscount,
            "noKontak": cloned.noKontak,
            "hargaSatuanMin": cloned.hargaSatuanMin,
            "hargaTotalMin": cloned.hargaTotalMin,
            "fileImagePathFile": cloned.fileImagePathFile,
            "qtyUseMax": cloned.qtyUseMax,
            "noSK": cloned.noSK,
            "statusEnabled": cloned.statusEnabled,
            "discountBankAccounts": cloned.discountBankAccounts
        }
        this.smbrFile = Configuration.get().resourceFile + '/image/show/' + cloned.fileImagePathFile;
        // this.versi = cloned.version;
        if (cloned.persenDiscount != null) {
            this.persenDiskon = true;
            this.hargaDiskon = false;
        } else if (cloned.hargaDiscount != null) {
            this.persenDiskon = false;
            this.hargaDiskon = true;
        }
        this.versi = 1;
        return fixHub;
    }

    onRowSelect(event) {
        this.listDiskonBank = [];
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        let d = {
            'value': event.data.noSK
        }

        for (let i = 0; i < event.data.discountBankAccounts.length; i++) {
            let dataTemp = {
                "kdDiskonBank": {
                    "namaBank": event.data.discountBankAccounts[i].namaBank,
                    "kdBank": event.data.discountBankAccounts[i].kdBankAccount,
                    "noAkunBank": event.data.discountBankAccounts[i].noAkunBank
                },
                "nmrAkunBank": event.data.discountBankAccounts[i].noAkunBank,
                "sttsAktif": event.data.discountBankAccounts[i].statusEnabled
            }
            let listDiskonBank = [...this.listDiskonBank];
            listDiskonBank.push(dataTemp);
            this.listDiskonBank = listDiskonBank;
        }
        if (event.data.discountBankAccounts.length > 0) {
            this.blocked1 = true;
        } else {
            this.blocked1 = false;
        }

        this.ambilSK(d)
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
        let diskonBank = []
        for (let i = 0; i < this.listDiskonBank.length; i++) {
            let en = 1;
            if (this.listDiskonBank[i].sttsAktif) {
                en = 1;
            } else {
                en = 0;
            }
            let dataT = {
                "kdBank": this.listDiskonBank[i].kdDiskonBank.kdBank,
                "noSK": this.form.get('noSK').value,
                "statusEnabled": en
            }
            diskonBank.push(dataT)
        }
        if (this.form.get('statusEnabled').value) {
            this.form.get('statusEnabled').setValue(1)
        } else {
            this.form.get('statusEnabled').setValue(0)
        }
        if (this.blocked1) {
            this.form.get('discountBankAccounts').setValue(diskonBank);
        }
        this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/SimpanDiscount', this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let diskonBank = []
            for (let i = 0; i < this.listDiskonBank.length; i++) {
                let en = 1;
                if (this.listDiskonBank[i].sttsAktif) {
                    en = 1;
                } else {
                    en = 0;
                }
                let dataT = {
                    "kdBank": this.listDiskonBank[i].kdDiskonBank.kdBank,
                    "noSK": this.form.get('noSK').value,
                    "statusEnabled": en
                }
                diskonBank.push(dataT)
            }
            if (this.form.get('statusEnabled').value) {
                this.form.get('statusEnabled').setValue(1)
            } else {
                this.form.get('statusEnabled').setValue(0)
            }
            if (this.blocked1) {
                this.form.get('discountBankAccounts').setValue(diskonBank);
            }
            this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/SimpanDiscount', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.reset();
            }, error => {
                this.alertService.warn('Kode  Discount Sudah Ada', 'Ganti Dengan Penamaan  Kode Lain.');
            });
        }
    }

    reset() {
        this.noSKIn = "";
        this.tglSKAwal = "";
        this.tglSKAkhir = "";
        this.pencarian = "";
        this.filterSK.filterValue = '';
        this.blocked1 = false;
        this.smbrFile = '';
        this.persenDiskon = true;
        this.hargaDiskon = true;
        // this.filterBank.filterValue = '';
        this.filterRekanan.filterValue = '';
        // this.page = 1;
        // this.rows = 10;
        this.ngOnInit();
    }

    hapus() {
        this.httpService.delete(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/HapusDiscount?kdDiscount=' + this.form.get('kdDiscount').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }


    confirmDelete() {
        if (this.form.get('kdDiscount').value == null) {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Diskon');
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

    downloadExcel() {
        let page = this.page - 1;
        this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/GetAllDiscount?PageIndex=' + page + '&PageSize=' + this.rows).subscribe(table => {
            this.listData2 = table.items;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                var dtAwal = new Date(this.listData2[i].tglBerlakuAwalSk);
                var dtAkhir = new Date(this.listData2[i].tglBerlakuAkhirSk);
                var sttsEn;
                if (this.listData2[i].statusEnabled == 1) {
                    sttsEn = 'Aktif';
                } else {
                    sttsEn = 'Tidak Aktif';
                }
                this.codes.push({
                    'Nomor Kode Diskon': this.listData2[i].nomorKode,
                    '% Diskon': this.listData2[i].persenDiscount,
                    'Harga Diskon': this.currency(this.currency(this.listData2[i].hargaDiscount)),
                    'Qty Use Max': this.listData2[i].qtyUseMax,
                    'Rekanan': this.listData2[i].namaKontak,
                    'Harga Satuan Minimal': this.currency(this.currency(this.listData2[i].hargaSatuanMin)),
                    'Harga Total Minimal': this.currency(this.currency(this.listData2[i].hargaTotalMin)),
                    'Nama SK': this.listData2[i].namaSK,
                    'Tanggal Berlaku Awal': dtAwal.getDate() + "/" + (dtAwal.getMonth() + 1) + "/" + dtAwal.getFullYear(),
                    'Tanggal Berlaku Akhir': dtAkhir.getDate() + "/" + (dtAkhir.getMonth() + 1) + "/" + dtAkhir.getFullYear(),
                    'Status': sttsEn,
                })
            }
            this.fileService.exportAsExcelFile(this.codes, 'Visi');
        });

    }

    currency(numb) {
        console.log(numb)
        if ((numb != '-') && (numb != null) && (numb != 0)) {
            var angka = numb;
            var reverse = angka.toString().split('').reverse().join('')
            let ribuan = reverse.match(/\d{1,3}/g);
            if (ribuan != null) {
                console.log(ribuan)
                let result = ribuan.join('.').split('').reverse().join('');
                return result;
            } else {
                return '-';
            }
        } else {
            return '-';
        }
    }

    downloadPdf() {
        let page = this.page - 1;
        var col = [
            "Nomor Kode Diskon",
            "Persen Diskon",
            "Harga Diskon",
            "Qty Use Max",
            "Rekanan",
            "Harga Satuan Minimal",
            "Harga Total Minimal",
            // "Tgl Berlaku Awal",
            // "Tgl Berlaku Akhir",
            "Status"
        ];
        this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Discount/GetAllDiscount?PageIndex=' + page + '&PageSize=' + this.rows).subscribe(table => {
            this.listData2 = table.items;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                var dtAwal = new Date(this.listData2[i].tglBerlakuAwalSk);
                var dtAkhir = new Date(this.listData2[i].tglBerlakuAkhirSk);
                var sttsEn;
                if (this.listData2[i].statusEnabled == 1) {
                    sttsEn = 'Aktif';
                } else {
                    sttsEn = 'Tidak Aktif';
                }
                this.codes.push({
                    noKodeDiskon: this.listData2[i].nomorKode,
                    pDiskon: (this.listData2[i].persenDiscount != null) ? this.listData2[i].persenDiscount : '-',
                    hDiskon: this.currency((this.listData2[i].hargaDiscount != null) ? this.listData2[i].hargaDiscount : '-'),
                    qtyUseMax: (this.listData2[i].qtyUseMax != null) ? this.listData2[i].qtyUseMax : '-',
                    rekanan: (this.listData2[i].namaKontak != null) ? this.listData2[i].namaKontak : '-',
                    hSatuanMinimal: this.currency((this.listData2[i].hargaSatuanMin != null) ? this.listData2[i].hargaSatuanMin : '-'),
                    hTotalMinimal: this.currency((this.listData2[i].hargaTotalMin != null) ? this.listData2[i].hargaTotalMin : '-'),
                    // tglAwal: dtAwal.getDate() + "/" + (dtAwal.getMonth() + 1) + "/" + dtAwal.getFullYear(),
                    // tglAkhir: dtAkhir.getDate() + "/" + (dtAkhir.getMonth() + 1) + "/" + dtAkhir.getFullYear(),
                    stts: sttsEn,
                })

            }
            this.fileService.exportAsPdfFile("Master Diskon", col, this.codes, "Diskon");
        });
    }

    cetak() {
        // this.laporan = true;
        // this.print.showEmbedPDFReport(Configuration.get().report + '/visi/laporanvisi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmVisi_laporanCetak');
        // this.laporan = true;
        // let b = Configuration.get().report + '/visi/laporanvisi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    urlUpload() {
        return Configuration.get().resourceFile + '/file/upload?noProfile=False';
    }

    fileUpload(event) {
        this.namaFile = event.xhr.response;
        this.smbrFile = Configuration.get().resourceFile + '/image/show/' + this.namaFile;
    }

    addHeader(event) {
        this.httpService.beforeUploadFile(event);
    }

    tambahDiskonBank() {
        let dataTemp = {
            "kdDiskonBank": {
                "namaBank": "--Pilih List Bank--",
                "kdBank": null,
                "noAkunBank": null
            },
            "nmrAkunBank": null,
            "sttsAktif": true
        }
        let listDiskonBank = [...this.listDiskonBank];
        listDiskonBank.push(dataTemp);
        this.listDiskonBank = listDiskonBank;
    }

    hapusListBank(row) {
        let listDiskonBank = [...this.listDiskonBank];
        listDiskonBank.splice(row, 1);
        this.listDiskonBank = listDiskonBank;
    }

    changeNoAkunBank(index, data) {
        this.listDiskonBank[index].nmrAkunBank = data
    }

    checkDiskonBank(ev) {
        this.blocked1 = ev;
    }

    persenDis() {
        if (this.form.get('persenDiscount').value != null) {
            this.hargaDiskon = false;
            this.form.get('hargaDiscount').setValue(null)
        } else if (this.form.get('persenDiscount').value == null) {
            this.hargaDiskon = true;
        }
    }

    hargaDis() {
        if (this.form.get('hargaDiscount').value != null) {
            this.persenDiskon = false;
            this.form.get('persenDiscount').setValue(null)
        } else if (this.form.get('hargaDiscount').value == null) {
            this.persenDiskon = true;
        }
    }

    maxHargaDis() {
        this.hargaSatuanMin = this.form.get('hargaSatuanMin').value
    }
}


