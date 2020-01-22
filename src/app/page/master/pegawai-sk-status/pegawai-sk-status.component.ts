import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkStatusInterface } from './pegawai-sk-status.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MultiSelectModule, SelectItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService  } from '../../../global';
import { Router } from "@angular/router";

@Component({
    selector: 'app-pegawai-sk-status',
    templateUrl: './pegawai-sk-status.component.html',
    styleUrls: ['./pegawai-sk-status.component.scss'],
    providers: [ConfirmationService]
})
export class PegawaiSkStatusComponent implements OnInit {
    selected: PegawaiSkStatusInterface;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    Negara: PegawaiSkStatusInterface[];
    Propinsi: PegawaiSkStatusInterface[];
    Kabupaten: PegawaiSkStatusInterface[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    kecamatan: any[];
    kecamatan1: PegawaiSkStatusInterface[];
    listKategoryPegawai: any[];
    listMasaKerja: any[];
    listStatusPegawai: any[];
    listStatusAbsensi: any[];
    listStatusSaldoKuotaMin: any[];
    listStatusSaldoKuotaPlus: any[];
    listDurasi: any[];
    kdProfile: any;
    CekAllowAccumulated: any;
    CekAllowToMinusKuota: any;
    CekProRate: any;
    CekPaid: any;
    AllowAccumulated: boolean;
    AllowToMinusKuota: boolean;
    Paid: boolean;
    ProRate: boolean;
    selectedKategori: any[];
    selectedMasaKerja: any[];
    isPaidPinalty: boolean;
    // selectedStatusPegawai: any[];
    namaSK: any[];
    CekisPaidPinalty: any;
    laporan: boolean = false;
	kdprof: any;
    kddept: any;
    codes:any[];
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        private route: Router,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;
    }



    ngOnInit() {
        this.kdProfile = this.authGuard.getUserDto().idProfile;
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

        this.CekAllowAccumulated = 0;
        this.CekAllowToMinusKuota = 0;
        this.CekProRate = 0;
        this.formAktif = true;
        // this.get(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({

            'noSk': new FormControl(''),
            'namaSk': new FormControl('', Validators.required),
            'tanggalAwal': new FormControl({ value: '', disabled: true }),
            'tanggalAkhir': new FormControl({ value: '', disabled: true }),
            'kdKategoryPegawai': new FormControl('', Validators.required),
            'masaKerja': new FormControl('', Validators.required),
            'kdStatusPegawai': new FormControl('', Validators.required),
            'allowAccumulated': new FormControl(''),
            'allowToMinusKuota': new FormControl(''),
            'qtyHariOverAllow': new FormControl('', Validators.required),
            'durasi': new FormControl('', Validators.required),
            'proRate': new FormControl(''),
            'totalQtyHariKuota': new FormControl(''),
            'qtyHariMinTake': new FormControl(''),
            'qtyHariMaxTake': new FormControl(''),
            'tglBlnResetTotalKuota': new FormControl('', Validators.required),
            'AktifTanggal': new FormControl(''),
            'qtyHariMinPostingBefore': new FormControl('', Validators.required),
            'qtyJamMaxPostingBefore': new FormControl('', Validators.required),
            'statusAbsensi': new FormControl(''),
            'isPaid': new FormControl(''),
            'isPaidPinalty': new FormControl(''),
            'statusSaldoKuotaMin': new FormControl(null),
            'statusSaldoKuotaPlus': new FormControl(null),
            'qtyHariMaxPostingExpired': new FormControl(''),
            'qtyJamMaxPostingExpired': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),

        });



        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&criteria=id.kdProfile&values=' + this.kdProfile).subscribe(res => {
            this.listKategoryPegawai = [];
            // this.listKategoryPegawai.push({ label: '--Pilih Kategory Pegawai--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
            };
            this.selectedKategori = this.listKategoryPegawai;

        },
            error => {
                this.listKategoryPegawai = [];
                this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
            });

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getRangeMasaKerja').subscribe(res => {
            this.listMasaKerja = [];
            // this.listMasaKerja.push({ label: '--Pilih Masa Kerja--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listMasaKerja.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
            };
            this.selectedMasaKerja = this.listMasaKerja;

        },
            error => {
                this.listMasaKerja = [];
                this.listMasaKerja.push({ label: '-- ' + error + ' --', value: '' })
            });

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatus').subscribe(res => {
            this.listStatusPegawai = [];
            this.listStatusPegawai.push({ label: '--Pilih Status Pegawai--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listStatusPegawai.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
            };
        },
            error => {
                this.listStatusPegawai = [];
                this.listStatusPegawai.push({ label: '-- ' + error + ' --', value: '' })
            });

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatus').subscribe(res => {
            this.listStatusAbsensi = [];
            this.listStatusAbsensi.push({ label: '--Pilih Status Absensi--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listStatusAbsensi.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
            };

        },
            error => {
                this.listStatusAbsensi = [];
                this.listStatusAbsensi.push({ label: '-- ' + error + ' --', value: '' })
            });
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusMin').subscribe(res => {
            this.listStatusSaldoKuotaMin = [];
            this.listStatusSaldoKuotaMin.push({ label: '--Pilih Status Saldo Kuota Min--' });
            for (var i = 0; i < res.data.length; i++) {
                this.listStatusSaldoKuotaMin.push({ label: res.data[i].nama, value: res.data[i].kode })
            };

        },
            error => {
                this.listStatusSaldoKuotaMin = [];
                this.listStatusSaldoKuotaMin.push({ label: '-- ' + error + ' --', value: '' })
            });

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusPlus').subscribe(res => {
            this.listStatusSaldoKuotaPlus = [];
            this.listStatusSaldoKuotaPlus.push({ label: '--Pilih Status Saldo Kuota Plus--', value: null });
            for (var i = 0; i < res.data.length; i++) {
                this.listStatusSaldoKuotaPlus.push({ label: res.data[i].nama, value: res.data[i].kode })
            };

        },
            error => {
                this.listStatusSaldoKuotaPlus = [];
                this.listStatusSaldoKuotaPlus.push({ label: '-- ' + error + ' --', value: '' })
            });


        this.listDurasi = [];
        this.listDurasi.push(
            { label: '--Pilih Durasi--', value: '' },
            { label: 'Tahunan', value: '1' },
            { label: 'Bulanan', value: '0' },
        );

        // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/generateNoPengajuan').subscribe(table => {
        //     console.log(table.data);
        //     this.form.get('noSK').setValue(table.data);
        // });
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getSK').subscribe(res => {
            this.namaSK = [];
            this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
            for (var i = 0; i < res.SK.length; i++) {
                this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
            };
        });



        // this.form.get('allowAccumulated').setValue(1),
        // this.form.get('allowToMinusKuota').setValue(1),
        // this.form.get('proRate').setValue(1),
        // this.form.get('durasi').setValue(1),
        // this.form.get('masaKerja').setValue(1),
        // this.form.get('kdStatusPegawai').setValue(1),
        // this.form.get('kdKategoryPegawai').setValue(1),
        // this.form.get('qtyHariMaxTake').setValue(1),
        // this.form.get('qtyHariMinTake').setValue(1),
        // this.form.get('namaSK').setValue(1),
        // this.form.get('noSK').setValue(1),
        // this.form.get('qtyHariOverAllow').setValue(1),
        // this.form.get('tglAkhirBerlakuSk').setValue(1),
        // this.form.get('tglAwalBerlakuSk').setValue(1),
        // this.form.get('tglBlnResetTotalKuota').setValue(1),
        // this.form.get('totalQtyHariKuota').setValue(1);
        this.getDataGrid(Configuration.get().page, Configuration.get().rows);
        this.getSmbrFile();
    }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    getKelompokTransaksi() {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getKelompokTransaksi').subscribe(table => {
            let dataKelompokTransaksi = table.KelompokTransaksi;
            localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
            this.route.navigate(['/master-sk/surat-keputusan']);
        });
    }
    ambilSK(sk) {
        if (this.form.get('namaSk').value == '' || this.form.get('namaSk').value == null || this.form.get('namaSk').value == undefined) {
            this.form.get('noSk').setValue(null);
            this.form.get('tanggalAwal').setValue(null);
            this.form.get('tanggalAkhir').setValue(null);

        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getSK?noSK=' + sk.value).subscribe(table => {
                let detailSK = table.SK;
                console.log(detailSK);
                this.form.get('noSk').setValue(detailSK[0].noSK);
                this.form.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
                if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
                    this.form.get('tanggalAkhir').setValue(null);
                } else {
                    this.form.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

                }
            });
        }
    }
    getDataGrid(page: number, rows: number) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
            this.listData = table.data.data;
            this.totalRecords = table.data.totalRow;
        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&noSK=' + this.pencarian).subscribe(table => {
            this.listData = table.data.data;
            this.totalRecords = table.totalRow;
        });
    }

    // loadPage(event: LazyLoadEvent) {
    //     this.get((event.rows + event.first) / event.rows, event.rows)
    //     this.page = (event.rows + event.first) / event.rows;
    //     this.rows = event.rows;
    //   }
    loadPage(event: LazyLoadEvent) {
        // let awal = this.setTimeStamp(this.tanggalAwal);
        // let akhir = this.setTimeStamp(this.tanggalAkhir);
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows)
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }
    onRowSelect(event) {
        // let cloned = this.clone(event.data);
        this.selectedKategori = [{
            label: event.data.namaKategoryPegawai,
            value: event.data.kdKategoryPegawai
        }]
        this.selectedMasaKerja = [{
            label: event.data.namaRange,
            value: event.data.kdRangeMasaKerja
        }]
        this.formAktif = false;
        // this.form.setValue(cloned);
        let tgl = event.data.tglBerlakuAkhir * 1000;

        if (event.data.isProRate == 1) {
            this.ProRate = true;
            this.CekProRate = 1;
        } else {
            this.ProRate = false;
            this.CekProRate = 0;
        }

        if (event.data.isAllowAccumulated == 1) {
            this.AllowAccumulated = true;
            this.CekAllowAccumulated = 1;
        } else {
            this.AllowAccumulated = false;
            this.CekAllowAccumulated = 0;
        }

        if (event.data.isAllowToMinusKuota == 1) {
            this.AllowToMinusKuota = true;
            this.CekAllowToMinusKuota = 1;
        } else {
            this.AllowToMinusKuota = false;
            this.CekAllowToMinusKuota = 0;
        }


        if (event.data.isPaid == 1) {
            this.Paid = true;
            this.CekPaid = 1;
        } else {
            this.Paid = false;
            this.CekPaid = 0;
        }

        if (event.data.isPaidPinalty == 1) {
            this.isPaidPinalty = true;
            this.CekisPaidPinalty = 1;
        } else {
            this.isPaidPinalty = false;
            this.CekisPaidPinalty = 0;
        }

        this.form.get('allowAccumulated').setValue(this.AllowAccumulated);
        this.form.get('allowToMinusKuota').setValue(this.AllowToMinusKuota);
        this.form.get('proRate').setValue(this.ProRate);
        this.form.get('isPaid').setValue(this.Paid);
        this.form.get('isPaidPinalty').setValue(this.isPaidPinalty);
        this.form.get('statusSaldoKuotaMin').setValue(event.data.statusSaldoKuotaMin);
        this.form.get('statusSaldoKuotaPlus').setValue(event.data.statusSaldoKuotaPlus);
        this.form.get('durasi').setValue(event.data.kdDurasi);
        // this.form.get('masaKerja').setValue(event.data.kdRangeMasaKerja);
        this.form.get('kdStatusPegawai').setValue(event.data.kdStatusPegawai);
        // this.form.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
        this.form.get('qtyHariMaxTake').setValue(event.data.qtyHariMaxTake);
        this.form.get('qtyHariMinTake').setValue(event.data.qtyHariMinTake);
        this.form.get('namaSk').setValue(event.data.noSK);
        this.form.get('noSk').setValue(event.data.noSK)
        this.form.get('qtyHariOverAllow').setValue(event.data.qtyHariOverAllow);
        if (event.data.tglBerlakuAkhir == null) {

        } else {
            this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

        }
        this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
        this.form.get('tglBlnResetTotalKuota').setValue(new Date(event.data.tglBlnResetTotalKuota * 1000));
        this.form.get('totalQtyHariKuota').setValue(event.data.totalQtyHariKuota);
        this.form.get('qtyJamMaxPostingBefore').setValue(event.data.qtyJamMaxPostingBefore);
        this.form.get('qtyHariMinPostingBefore').setValue(event.data.qtyHariMinPostingBefore);
        this.form.get('qtyJamMaxPostingExpired').setValue(event.data.qtyJamMaxPostingExpired);
        this.form.get('qtyHariMaxPostingExpired').setValue(event.data.qtyHariMaxPostingExpired);
        this.form.get('statusAbsensi').setValue(event.data.kdStatusAbsensi);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        this.form.get('masaKerja').disable();
        this.form.get('kdKategoryPegawai').disable();
        this.form.get('kdStatusPegawai').disable();
        this.versi = event.data.version;
    }


    changeAccumulated(event) {
        if (event == true) {
            this.CekAllowAccumulated = 1;
        } else {
            this.CekAllowAccumulated = 0;
        }
    }
    changeMinusKuota(event) {
        if (event == true) {
            this.CekAllowToMinusKuota = 1;
        } else {
            this.CekAllowToMinusKuota = 0;
        }
    }
    changeProRate(event) {
        if (event == true) {
            this.CekProRate = 1;
        } else {
            this.CekProRate = 0;
        }
    }
    changePaid(event) {
        if (event == true) {
            this.CekPaid = 1;
        } else {
            this.CekPaid = 0;
        }
    }

    changeisPaidPinalty(event) {
        if (event == true) {
            this.CekisPaidPinalty = 1;
        }
        else {
            this.CekisPaidPinalty = 0;
        }
    }
    valuechange(newValue) {

        this.toReport = newValue;
        this.report = newValue;
    }
    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }
    get() {

    }
    setDataPegawai(event) {
        this.form.get('nik').setValue(event.value.nik);
        this.form.get('jabatan').setValue(event.value.namaJabatan);
        this.form.get('jenisKelamin').setValue(event.value.jenisKelamin);
        this.form.get('jenisPegawai').setValue(event.value.jenisPegawai);
        this.form.get('unitKerja').setValue(event.value.namaRuangan);
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
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate();
        } else {
            let masaKerja = [];
            let kategoriPegawai = [];
            for (let i = 0; i < this.selectedMasaKerja.length; i++) {
                masaKerja.push({
                    "kode": this.selectedMasaKerja[i].value,
                })
            }
            for (let i = 0; i < this.selectedKategori.length; i++) {
                kategoriPegawai.push({
                    "kode": this.selectedKategori[i].value,
                })
            }
            let statusPegawai = [];
            statusPegawai.push({
                "kode": this.form.get('kdStatusPegawai').value,
            })
            let fixHub = {

                "isAllowAccumulated": this.CekAllowAccumulated,
                "isAllowToMinusKuota": this.CekAllowToMinusKuota,
                "isProRate": this.CekProRate,
                "isPaid": this.CekPaid,
                "isPaidPinalty": this.CekisPaidPinalty,
                "statusSaldoKuotaMin": this.form.get('statusSaldoKuotaMin').value,
                "statusSaldoKuotaPlus": this.form.get('statusSaldoKuotaPlus').value,
                "kdDurasi": this.form.get('durasi').value,
                "masaKerja": masaKerja,
                "statusPegawai": statusPegawai,
                "qtyHariMaxPostingExpired": this.form.get('qtyHariMaxPostingExpired').value,
                "qtyJamMaxPostingExpired": this.form.get('qtyJamMaxPostingExpired').value,
                "kategoriPegawai": kategoriPegawai,
                "qtyHariMaxTake": this.form.get('qtyHariMaxTake').value,
                "qtyHariMinTake": this.form.get('qtyHariMinTake').value,
                "noSK": this.form.get('noSk').value,
                "qtyHariOverAllow": this.form.get('qtyHariOverAllow').value,
                "tglBlnResetTotalKuota": this.setTimeStamp(this.form.get('tglBlnResetTotalKuota').value),
                "tglBerlakuAwal": this.setTimeStamp(this.form.get('tanggalAwal').value),
                "tglBerlakuAkhir": this.setTimeStamp(this.form.get('tanggalAkhir').value),
                "totalQtyHariKuota": this.form.get('totalQtyHariKuota').value,
                "qtyHariMinPostingBefore": this.form.get('qtyHariMinPostingBefore').value,
                "qtyJamMaxPostingBefore": this.form.get('qtyJamMaxPostingBefore').value,
                "kdStatusAbsensi": this.form.get('statusAbsensi').value,
                "statusEnabled": this.form.get('statusEnabled').value,

            }

            this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskstatus/saveRev', fixHub).subscribe(response => {
            },
                error => {
                    this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
                },
                () => {
                    this.alertService.success('Berhasil', 'Data Disimpan');

                    this.reset();
                });

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
        let fixHub = {

            "isAllowAccumulated": this.CekAllowAccumulated,
            "isAllowToMinusKuota": this.CekAllowToMinusKuota,
            "isProRate": this.CekProRate,
            "isPaid": this.CekPaid,
            "isPaidPinalty": this.CekisPaidPinalty,
            "statusSaldoKuotaMin": this.form.get('statusSaldoKuotaMin').value,
            "statusSaldoKuotaPlus": this.form.get('statusSaldoKuotaPlus').value,
            "kdDurasi": this.form.get('durasi').value,
            "kdRangeMasaKerja": this.selectedMasaKerja[0].value,
            "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
            "kdKategoryPegawai": this.selectedKategori[0].value,
            "qtyHariMaxTake": this.form.get('qtyHariMaxTake').value,
            "qtyHariMinTake": this.form.get('qtyHariMinTake').value,
            "noSK": this.form.get('noSk').value,
            "qtyHariOverAllow": this.form.get('qtyHariOverAllow').value,
            "tglBlnResetTotalKuota": this.setTimeStamp(this.form.get('tglBlnResetTotalKuota').value),
            "tglBerlakuAwal": this.setTimeStamp(this.form.get('tanggalAwal').value),
            "tglBerlakuAkhir": this.setTimeStamp(this.form.get('tanggalAkhir').value),
            "totalQtyHariKuota": this.form.get('totalQtyHariKuota').value,
            "qtyHariMinPostingBefore": this.form.get('qtyHariMinPostingBefore').value,
            "qtyJamMaxPostingBefore": this.form.get('qtyJamMaxPostingBefore').value,
            "kdStatusAbsensi": this.form.get('statusAbsensi').value,
            "qtyJamMaxPostingExpired": this.form.get('qtyJamMaxPostingExpired').value,
            "qtyHariMaxPostingExpired": this.form.get('qtyHariMaxPostingExpired').value,
            "statusEnabled": this.form.get('statusEnabled').value,

        }
        console.log(fixHub);


        this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiskstatus/update/' + this.versi, fixHub).subscribe(response => {
        },
            error => {
                this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
            },
            () => {
                this.alertService.success('Berhasil', 'Data Diperbarui');

                this.reset();
            });
    }
    confirmDelete() {
        let noSk = this.form.get('noSk').value;
        if (noSk == null || noSk == undefined || noSk == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Status');
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskstatus/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdStatusPegawai + '/' + deleteItem.kdRangeMasaKerja).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });


    }
    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    reset() {
        this.form.get('masaKerja').enable();
        this.form.get('kdKategoryPegawai').enable();
        this.form.get('kdStatusPegawai').enable();
        this.ngOnInit();
    }
    onDestroy() {

    }
    downloadExcel() {

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPegawaiSkStatus_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialPegawaiSkStatusInterface implements PegawaiSkStatusInterface {

    constructor(
        public kdKotaKabupaten?,
        public kecamatan?,
        public id?,
        public kode?,
        public kdPropinsi?,
        public kdkotaKabupaten?,
        public namaKecamatan?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public propinsi?,
        public kotaKabupaten?
    ) { }

}