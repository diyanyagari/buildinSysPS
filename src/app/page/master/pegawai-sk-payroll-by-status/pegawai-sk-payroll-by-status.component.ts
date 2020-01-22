import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkPayrollByStatus } from './pegawai-sk-payroll-by-status.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { Router} from "@angular/router";

@Component({
    selector: 'app-pegawai-sk-payroll-by-status',
    templateUrl: './pegawai-sk-payroll-by-status.component.html',
    styleUrls: ['./pegawai-sk-payroll-by-status.component.scss'],
    providers: [ConfirmationService]
})
export class PegawaiSkPayrollByStatusComponent implements OnInit {
    form: FormGroup;
    tanggalAwal: any;
    tanggalAkhir: any;
    listRange: any[];
    listHarga: any[];
    listGolonganPegawai: any[];
    listKategoryPegawai: any[];
    listKomponen: any[];
    listPangkat: any[];
    listOperatorFactorRate: any[];
    listMetodePembayaran: any[];
    listKomponenTake: any[];
    listStatus: any[];
    listData: any[];
    selectedGolongan: any[];
    selectedKategori: any[];
    selectedRange: any[];
    selectedStatus: any[];
    selectedPangkat: any[];
    formAktif: boolean;
    selected: any;
    versi: any;
    namaSK: any[];
    totalRecords: number;
    page: number;
    rows: number;
    pencarian: string = '';
    selectedKomponen: any[];
    items: any;
    dataSK: any[];
    CekByDay: any;
    isByDay: boolean;
    cekKomponenHargaTake: boolean;
    btnKomponenHargaTake: boolean;
    byDay: number;
    ByDay: boolean;
    btKomponen: any;
    dataEditHarga: boolean;
    dataEditPersen: boolean;
    ceklistKomponen: boolean;
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
        private fileService: FileService,
        private route: Router,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

    ngOnInit() {
        
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;

        this.items = [
            {
                label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                    // this.downloadPdf();
                }
            },
            {
                label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                    // this.downloadExcel();
                }
            },

        ];

        this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian);
        this.get();
        this.formAktif = true;
        // this.ceklistKomponen = false;
        this.listHarga = [];
        this.dataEditHarga = true;
        this.dataEditPersen = true;
        // this.cekKomponenHargaTake = true;
        // this.btnKomponenHargaTake = true;
        this.form = this.fb.group({
            'noSk': new FormControl('', Validators.required),
            'namaSk': new FormControl('', Validators.required),
            'tanggalAwal': new FormControl({ value: '', disabled: true }),
            'tanggalAkhir': new FormControl({ value: '', disabled: true }),
            'kdGolonganPegawai': new FormControl('', Validators.required),
            'kdKategoryPegawai': new FormControl('', Validators.required),
            'kdKomponenHarga': new FormControl('', Validators.required),
            // 'kdKomponenHargaTake': new FormControl('', Validators.required),
            'kdStatusPegawai': new FormControl('', Validators.required),
            'kdRangeMasaStatus': new FormControl('', Validators.required),
            'kdPangkat': new FormControl('', Validators.required),
            // 'hargaSatuanPersen': new FormControl(''),
            // 'hargaSatuan': new FormControl(''),
            'factorRate': new FormControl(''),
            // 'factorRateDivide': new FormControl(''),
            'isByDay': new FormControl(''),
            'dataRate': new FormControl(''),
            // 'btKomponen': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });


        this.getSmbrFile();

    }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    cari() {

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=status.namaStatus&sort=desc&namaStatusPegawai=' + this.pencarian).subscribe(table => {
            this.listData = table.PegawaiSKPayrollByStatus;
            this.totalRecords = table.totalRow;
        });
    }

    get() {
        // this.getPage(Configuration.get().page, Configuration.get().rows);
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Range&select=namaRange,id.kode').subscribe(res => {
            this.listRange = [];
            // this.listRange.push({ label: '--Pilih Range Masa Status--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listRange.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id_kode })
            };
            this.selectedRange = this.listRange;
        },
            error => {
                this.listRange = [];
                this.listRange.push({ label: '-- ' + error + ' --', value: '' })
            });
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getStatusPegawai').subscribe(res => {
            this.listStatus = [];
            this.listStatus.push({ label: '--Pilih Status Pegawai--', value: '' });
            for (var i = 0; i < res.status.length; i++) {
                this.listStatus.push({ label: res.status[i].namaStatus, value: res.status[i].kdStatus })
            };
            this.selectedStatus = this.listStatus;
        },
            error => {
                this.listStatus = [];
                this.listStatus.push({ label: '-- ' + error + ' --', value: '' })
            });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=id.kode,%20namaKategoryPegawai').subscribe(res => {
            this.listKategoryPegawai = [];
            this.listKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode })
            };
            this.selectedKategori = this.listKategoryPegawai;
        },
            error => {
                this.listKategoryPegawai = [];
                this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
            });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=id.kode,%20namaGolonganPegawai').subscribe(res => {
            this.listGolonganPegawai = [];
            // this.listGolonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id_kode })
            };
            this.selectedGolongan = this.listGolonganPegawai;
        },
            error => {
                this.listGolonganPegawai = [];
                this.listGolonganPegawai.push({ label: '-- ' + error + ' --', value: '' })
            });

        // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKomponen').subscribe(res => {
        //     this.listKomponen = [];
        //     this.listKomponen.push({ label: '--Pilih Komponen Harga--', value: '' });
        //     for (var i = 0; i < res.data.length; i++) {
        //         this.listKomponen.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
        //     };
        // },
        //     error => {
        //         this.listKomponen = [];
        //         this.listKomponen.push({ label: '-- ' + error + ' --', value: '' })
        //     });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=id.kode,namaPangkat').subscribe(res => {
            this.listPangkat = [];
            // this.listPangkat.push({ label: '--Pilih Pangkat--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listPangkat.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i].id_kode })
            };
            this.selectedPangkat = this.listPangkat;
        },
            error => {
                this.listPangkat = [];
                this.listPangkat.push({ label: '-- ' + error + ' --', value: '' })
            });
        // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKomponen').subscribe(res => {
        //     this.listKomponenTake = [];
        //     this.listKomponenTake.push({ label: '--Pilih Komponen Take--', value: '' });
        //     for (var i = 0; i < res.data.length; i++) {
        //         this.listKomponenTake.push({ label: res.data[i].namaKomponen, value: res.data[i] })
        //     };
        // },
        //     error => {
        //         this.listKomponenTake = [];
        //         this.listKomponenTake.push({ label: '-- ' + error + ' --', value: '' })
        //     });

        this.listOperatorFactorRate = [];
        this.listOperatorFactorRate.push({ label: '--Pilih Operator--', value: '' })
        this.listOperatorFactorRate.push({ label: "+", value: { "kode": "+" } })
        this.listOperatorFactorRate.push({ label: "-", value: { "kode": "-" } })
        this.listOperatorFactorRate.push({ label: "x", value: { "kode": "x" } })
        this.listOperatorFactorRate.push({ label: "/", value: { "kode": "/" } })

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getSK').subscribe(res => {
            this.namaSK = [];
            this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
            for (var i = 0; i < res.SK.length; i++) {
                this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
            };
        });

    }
    valuechangeGetKomponen(kdKategoriPegawai) {
        console.log(kdKategoriPegawai)
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKomponen/' + kdKategoriPegawai).subscribe(res => {
            this.listKomponen = [];
            this.listKomponenTake = [];
            this.listKomponen.push({ label: '--Pilih Komponen--', value: '' })
            this.listKomponenTake.push({ label: '--Pilih Komponen Take--', value: '' })
            for (var i = 0; i < res.data.length; i++) {
                this.listKomponen.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
                this.listKomponenTake.push({ label: res.data[i].namaKomponen, value: res.data[i] })
            };
        },
            error => {
                this.listKomponenTake = [];
                this.listKomponenTake.push({ label: '-- ' + error + ' --', value: '' })
                this.listKomponen = [];
                this.listKomponen.push({ label: '-- ' + error + ' --', value: '' })
            });

    }
    // valuechangeGetKomponenTake(kdKategoriPegawai) {
    //     console.log(kdKategoriPegawai)
    //     this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKomponen/' + kdKategoriPegawai).subscribe(res => {
    //         this.listKomponenTake = [];
    //         this.listKomponenTake.push({ label: '--Pilih Komponen Take--', value: '' })
    //         for (var i = 0; i < res.data.length; i++) {
    //             this.listKomponenTake.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
    //         };
    //     },
    //         error => {
    //             this.listKomponenTake = [];
    //             this.listKomponenTake.push({ label: '-- ' + error + ' --', value: '' })
    //         });

    // }


    tambahKomponen() {
        let dataTemp = {
            "dataHarga": {
                "namaKomponen": "--Pilih--",
                // "kdKomponen": '',
            },
            //   "kdGolongan": {
            //     "namaGolonganPegawai": "--Pilih--",
            //     "id_kode": '',
            //   },
            //   "kdPangkat": {
            //     "namaPangkat": "--Pilih--",
            //     "kdPangkat": '',
            //   },
            "hargaSatuan": null,
            "persenHargaSatuan": null,
            "factorRate": 1,
            "dataRate": {
                "operatorFactorRate": "x",
                "kode": "x"
            },
            "factorRateDivide": "",
            "statusAktif": true,
            "noSK": null,

        }
        let listHarga = [...this.listHarga];
        listHarga.push(dataTemp);
        this.listHarga = listHarga;

    }
    hapusRow(row) {
        let listHarga = [...this.listHarga];
        listHarga.splice(row, 1);
        this.listHarga = listHarga;
    }
    // getKomponenHargaTake(event) {
    //     if (event) {
    //         this.cekKomponenHargaTake = false;
    //         this.btnKomponenHargaTake = false;
    //     } else {
    //         this.cekKomponenHargaTake = true;
    //         this.btnKomponenHargaTake = true;
    //         if (this.listHarga.length > 0) {
    //             return this.listHarga = [];
    //         }
    //     }
    // }
    getKomponen(dataPeg) {
        console.log(dataPeg);
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/findByKode/' + dataPeg.data.kode.noSK + '/' + dataPeg.data.kode.kdKategoryPegawai + '/' + dataPeg.data.kode.kdGolonganPegawai + '/' + dataPeg.data.kode.kdPangkat + '/' + dataPeg.data.kode.kdStatusPegawai + '/' + dataPeg.data.kode.kdRangeMasaStatus + '/' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
            let komponen = table.PegawaiSKPayrollByStatus;
            this.listHarga = [];
            console.log(komponen);
            let dataFix
            for (let i = 0; i < komponen.length; i++) {
                dataFix = {
                    dataHarga: {
                        id: {
                            id_kode: komponen[i].kode.kdKomponenHargaTake,
                            namaKomponen: komponen[i].namaKomponenHargaTake,
                        },
                        namaKomponen: komponen[i].namaKomponenHargaTake,
                        kdKomponen: komponen[i].kode.kdKomponenHargaTake,
                        noSK: komponen[i].kode.noSK,
                    },
    
                    hargaSatuan: komponen[i].hargaSatuan,
                    persenHargaSatuan: komponen[i].persenHargaSatuan,
                    factorRate: komponen[i].factorRate,
                    dataRate: {
                        operatorFactorRate: komponen[i].operatorFactorRate,
                        kdOperatorFactorRate: komponen[i].operatorFactorRate,
                        kode: komponen[i].operatorFactorRate,
                    },
                    factorRateDivide: komponen[i].factorRateDivide,
                    statusAktif: komponen[i].statusEnabled,
                    noSK: komponen[i].kode.noSK,

                }
                this.listHarga.push(dataFix);
            }
            if (komponen.length) {
                this.cekKomponenHargaTake = false;
                this.btnKomponenHargaTake = false;
                this.ceklistKomponen = false;

            } else {
                this.cekKomponenHargaTake = true;
                this.btnKomponenHargaTake = true;
                this.ceklistKomponen = true;

            }
            console.log(this.listHarga);
        });
    }
    //end

    getKelompokTransaksi(){
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKelompokTransaksi').subscribe(table => {
			let dataKelompokTransaksi = table.KelompokTransaksi;
			 localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));	
			 this.route.navigate(['/master-sk/surat-keputusan']);
        });
	}
    getDataGrid(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.PegawaiSKPayrollByStatus;
            this.totalRecords = table.totalRow;
        });
    }

    ambilSK(sk) {
        if (this.form.get('namaSk').value == '' || this.form.get('namaSk').value == null || this.form.get('namaSk').value == undefined) {
            this.form.get('noSk').setValue(null);
            this.form.get('tanggalAwal').setValue(null);
            this.form.get('tanggalAkhir').setValue(null);
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getSK?noSK=' + sk.value).subscribe(table => {
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
    changeByDay(event) {
        if (event == true) {
            this.CekByDay = 1;
        } else {
            this.CekByDay = 0;
        }
    }
    loadPage(event: LazyLoadEvent) {
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian)
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        let noSk = this.form.get('noSk').value;
        if (noSk == null || noSk == undefined || noSk == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Payroll By Status');
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

    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }

    getPersen(row) {
        let data = [... this.listHarga];
        if (data[row].persenHargaSatuan != null) {
            this.dataEditHarga = false;
        }
    }
    getHarga(row) {
        let akunBank = [... this.listHarga];
        if (akunBank[row].hargaSatuan != null) {
            this.dataEditPersen = false;
        }

    }
    setHarga(value) {
        if (value != null) {
            return parseInt(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
    }

    update() {
        let dataKomponen = [];
        for (let i = 0; i < this.listHarga.length; i++) {
            dataKomponen.push({
                "factorRate": this.listHarga[i].factorRate,
                "factorRateDivide": this.listHarga[i].factorRateDivide,
                 "kdKomponenHargaTake": this.listHarga[i].dataHarga.kdKomponen,
                "operatorFactorRate": this.listHarga[i].dataRate.kode,
                "hargaSatuan": this.listHarga[i].hargaSatuan,
                "persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
                "statusEnabled": this.listHarga[i].statusAktif,
            })
        }
        let golongan = [];
        // let kategoriPegawai = [];
        let range = [];
        let pangkat = [];
        let status = [];
        // for (let i = 0; i < this.selectedKategori.length; i++) {
        //     kategoriPegawai.push({
        //         "kode": this.selectedKategori[i].value,
        //     })
        // }
        for (let i = 0; i < this.selectedRange.length; i++) {
            range.push({
                "kode": this.selectedRange[i].value,
            })
        }
        for (let i = 0; i < this.selectedGolongan.length; i++) {
            golongan.push({
                "kode": this.selectedGolongan[i].value,
            })
        }
        for (let i = 0; i < this.selectedPangkat.length; i++) {
            pangkat.push({
                "kode": this.selectedPangkat[i].value,
            })
        }

        if (this.form.get('isByDay').value == null || this.form.get('isByDay').value == undefined || this.form.get('isByDay').value == false) {
            this.byDay = 0;
        } else {
            this.byDay = 1;
        }
        let dataTemp = [{
            "kode": parseInt(this.form.get('kdKategoryPegawai').value)
        }]

        let dataSimpan = {
            "komponen": dataKomponen,
            "noSK": this.form.get('noSk').value,
            "isByDay": this.byDay,
            "kdRangeMasaStatus": range,
            "kdKategoryPegawai": dataTemp,
            "kdGolonganPegawai": golongan,
            "kdPangkat": pangkat,
            "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
            "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
            "statusEnabled": this.form.get('statusEnabled').value
        }

        this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/save?', dataSimpan).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.getDataGrid(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }



    // update() {
    //     let dataKomponen = [];
    //     console.log(this.listHarga);
    //     for (let i = 0; i < this.listHarga.length; i++) {
    //       dataKomponen.push({
    //         "factorRate": this.listHarga[i].factorRate,
    //         "factorRateDivide": this.listHarga[i].factorRateDivide,
    //         "kdKomponenHargaTake": this.listHarga[i].dataHarga.id_kode,
    //         // "kdGolonganPegawai": this.listHarga[i].kdGolongan.id_kode,
    //         // "kdPangkat": this.listHarga[i].kdPangkat.kdPangkat,
    //         "operatorFactorRate": this.listHarga[i].dataRate.kode,
    //         "hargaSatuan": this.listHarga[i].hargaSatuan,
    //         "persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
    //         "statusEnabled": this.listHarga[i].statusAktif,  
    //       })
    //     }
    //     if (this.form.get('isByDay').value == null || this.form.get('isByDay').value == undefined || this.form.get('isByDay').value == false) {
    //       this.byDay = 0;
    //     } else {
    //       this.byDay = 1;
    //     }



    //     let dataSimpan = {
    //         "komponen" : dataKomponen,
    //         "isByDay": this.byDay,
    //         "noSK": this.form.get('noSk').value,
    //         "kdRangeMasaStatus": this.selectedRange[0].value,
    //         "kdKategoryPegawai": this.selectedKategori[0].value,
    //         "kdGolonganPegawai": this.selectedGolongan[0].value,
    //         "kdPangkat": this.selectedPangkat[0].value,
    //         "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
    //         "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
    //         "statusEnabled": this.form.get('statusEnabled').value
    //     }
    //     this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/save?', dataSimpan).subscribe(response => {
    //         this.alertService.success('Berhasil', 'Data Diperbarui');
    //         this.getDataGrid(this.page, this.rows, this.pencarian);
    //         this.reset();
    //     });
    // }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else if (this.listHarga.length == 0 || this.listHarga.length == null) {
            this.alertService.warn('Peringatan', 'Data Komponen Take Tidak Boleh Kosong')
        } else {

            let dataKomponen = [];
            for (let i = 0; i < this.listHarga.length; i++) {
                dataKomponen.push({
                    "factorRate": this.listHarga[i].factorRate,
                    "factorRateDivide": this.listHarga[i].factorRateDivide,
                    // "kdGolonganPegawai": this.listHarga[i].kdGolongan.id_kode,
                    // "kdPangkat": this.listHarga[i].kdPangkat.kdPangkat,
                    "kdKomponenHargaTake": this.listHarga[i].dataHarga.kdKomponen,
                    "operatorFactorRate": this.listHarga[i].dataRate.kode,
                    "hargaSatuan": this.listHarga[i].hargaSatuan,
                    "persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
                    "statusEnabled": true,
                })
            }
            let golongan = [];
            // let kategoriPegawai = [];
            let range = [];
            let pangkat = [];
            let status = [];
            // for (let i = 0; i < this.selectedKategori.length; i++) {
            //     kategoriPegawai.push({
            //         "kode": this.selectedKategori[i].value,
            //     })
            // }
            for (let i = 0; i < this.selectedRange.length; i++) {
                range.push({
                    "kode": this.selectedRange[i].value,
                })
            }
            for (let i = 0; i < this.selectedGolongan.length; i++) {
                golongan.push({
                    "kode": this.selectedGolongan[i].value,
                })
            }
            for (let i = 0; i < this.selectedPangkat.length; i++) {
                pangkat.push({
                    "kode": this.selectedPangkat[i].value,
                })
            }

            if (this.form.get('isByDay').value == null || this.form.get('isByDay').value == undefined || this.form.get('isByDay').value == false) {
                this.byDay = 0;
            } else {
                this.byDay = 1;
            }
            let dataTemp = [{
                "kode": this.form.get('kdKategoryPegawai').value
            }]

            let dataSimpan = {
                "komponen": dataKomponen,
                "noSK": this.form.get('noSk').value,
                "isByDay": this.byDay,
                "kdRangeMasaStatus": range,
                "kdKategoryPegawai": dataTemp,
                "kdGolonganPegawai": golongan,
                "kdPangkat": pangkat,
                "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
                "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
                "statusEnabled": this.form.get('statusEnabled').value
            }

            this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/save?', dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getDataGrid(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

    }

    reset() {
        this.form.get('kdKategoryPegawai').enable();
        this.form.get('kdRangeMasaStatus').enable();
        this.form.get('kdGolonganPegawai').enable();
        this.form.get('kdPangkat').enable();
        this.form.get('kdKomponenHarga').enable();
        this.form.get('kdStatusPegawai').enable();
        this.ceklistKomponen = false;
        this.formAktif = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        this.dataSK = [];
        this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
        // let cloned = this.clone(event.data);
        this.formAktif = false;
        // this.form.setValue(cloned);
        this.form.get('kdKategoryPegawai').disable();
        this.form.get('kdRangeMasaStatus').disable();
        this.form.get('kdGolonganPegawai').disable();
        this.form.get('kdPangkat').disable();
        this.form.get('kdKomponenHarga').disable();
        this.form.get('kdStatusPegawai').disable();
        this.getKomponen(event);
        // this.selectedKategori = [{
        //     label: event.data.namaKategoryPegawai,
        //     value: event.data.kode.kdKategoryPegawai
        // }];
        this.selectedRange = [{
            label: event.data.namaRange,
            value: event.data.kode.kdRangeMasaStatus
        }];
        this.selectedGolongan = [{
            label: event.data.namaGolonganPegawai,
            value: event.data.kode.kdGolonganPegawai
        }];
        this.selectedPangkat = [{
            label: event.data.namaPangkat,
            value: event.data.kode.kdPangkat
        }];
        this.selectedStatus = [{
            label: event.data.namaStatusPegawai,
            value: event.data.kode.kdStatusPegawai
        }];
        if (event.data.isByDay == 1) {
            this.ByDay = true;
            this.CekByDay = 1;
        } else {
            this.ByDay = false;
            this.CekByDay = 0;
        }
        //   if (this.listHarga.length == 0) {
        //     this.btKomponen = false
        //   } else {
        //     this.form.get('btKomponen').setValue(true);
        //     this.btKomponen = true;
        //     this.form.get('btKomponen').disable();
        //   }

        this.form.get('kdKomponenHarga').setValue(event.data.kode.kdKomponenHarga);
        this.form.get('kdKategoryPegawai').setValue(event.data.kode.kdKategoryPegawai);
        this.form.get('namaSk').setValue(event.data.kode.noSK);
        this.form.get('noSk').setValue(event.data.kode.noSK);
        this.form.get('isByDay').setValue(this.ByDay);
        //   this.form.get('btKomponen').setValue(this.btKomponen);
        this.form.get('kdStatusPegawai').setValue(event.data.kode.kdStatusPegawai);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        if (event.data.tglBerlakuAkhir == null) {

        } else {
            this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

        }
        this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
    }

    // clone(cloned: any) {

    //     cloned = {
    //         "noSK": cloned.noSK,
    //         "namaSK": this.dataSK[0],
    //         "tglBerlakuAwal": new Date(cloned.tglBerlakuAwal * 1000),
    //         "tglBerlakuAkhir": new Date(cloned.tglBerlakuAkhir * 1000),
    //         "nilaiScorePassed": cloned.nilaiScorePassed,
    //         "kdJabatan": cloned.kdJabatan,
    //         "kdRangeMasaStatusNilaiScorePassed": cloned.kdRangeMasaStatusNilaiScorePassed,
    //         "kdProdukRS": cloned.kdProdukRS,
    //         "kdLevelTingkat": cloned.kdLevelTingkat,
    //         "kdJenisPegawai": cloned.kdJenisPegawai,
    //         "keteranganLainnya": cloned.keteranganLainnya,
    //         // "reportDisplay": hub.reportDisplay,
    //         // "kodeExternal": clonedExternal,
    //         // "namaExternal": hub.namaExternal,
    //         "statusEnabled": cloned.statusEnabled
    //     }
    //     this.versi = cloned.version;
    //     return cloned;
    // }

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdGolonganPegawai + '/' + deleteItem.kode.kdPangkat + '/' + deleteItem.kode.kdStatusPegawai + '/' + deleteItem.kode.kdRangeMasaStatus + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getDataGrid(this.page, this.rows, this.pencarian);
        });
        this.reset();
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    downloadExcel() {

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/pegawaiSKPayrollByStatus/laporanPegawaiSKPayrollByStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKPayrollByStatus/laporanPegawaiSKPayrollByStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPegawaiSkPayrollByStatus_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialPegawaiSkPayrollByStatus implements PegawaiSkPayrollByStatus {

    constructor(
        public namaSuratKeputusan?,
        public namaSK?,
        public kdRangeMasaStatusNilaiScorePassed?,
        public tglBerlakuAwal?,
        public kode?,
        public tglBerlakuAkhir?,
        public nilaiScoredPassed?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public kdJabatan?,
        public kdRangeMasaStatus?,
        public kdProdukRS?,
        public kdLevelTingkat?,
        public keteranganLainnya?,
        public kdJenisPegawai?,
        public noSK?,
        public nilaiScorePassed?,

    ) { }

}