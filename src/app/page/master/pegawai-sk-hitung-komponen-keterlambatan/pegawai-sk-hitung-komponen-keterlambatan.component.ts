import { Inject, forwardRef,Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
// import { PegawaiSkPayrollByStatus } from './pegawai-sk-payroll-by-status.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { Router} from "@angular/router";
@Component({
  selector: 'app-pegawai-sk-hitung-komponen-keterlambatan',
  templateUrl: './pegawai-sk-hitung-komponen-keterlambatan.component.html',
  styleUrls: ['./pegawai-sk-hitung-komponen-keterlambatan.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkHitungKomponenKeterlambatanComponent implements OnInit {
  form: FormGroup;
  namaSK: any[];
  tanggalAwal: any;
  tanggalAkhir: any;
  formAktif: boolean;
  listKeterlambatan:any[];
  selectedKeterlambatan:any[];
  listKategoryPegawai:any[];
  kdKategoriPegawai:any;
  listKomponen:any[];
  listGolonganPegawai:any[];
  selectedGolongan:any[];
  listPangkat:any[];
  selectedPangkat:any[];
  listStatus:any[];
  listHarga:any[];
  listData:any[];
  selected:any;
  pencarian:any;
  selectedKategoriPegawai:any[];
  listKomponenTake: any[];
  CekByDay: any;
  selectedStatus:any[];
  dataEditHarga: boolean;
  dataEditPersen: boolean;
  listOperatorFactorRate: any[];
  ceklistKomponen: boolean;
  ByDay: boolean;
  byDay: number;
  dataSK: any[];
  selectedRange: any[];
  cekKomponenHargaTake: boolean;
  btnKomponenHargaTake: boolean;
  totalRecords: number;
  page: number;
  rows: number;
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes:any[];
  smbrFile:any;
  items:any[];
  kdStatusKeterlambatan:any;

  constructor(
    private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private route: Router,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService
  ) { }

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
    this.listHarga = [];
    this.dataEditHarga = true;
    this.dataEditPersen = true;
    this.getData();
    this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian);
    
    this.formAktif = true;
    this.form = this.fb.group({
      'noSk': new FormControl('', Validators.required),
      'namaSk': new FormControl('', Validators.required),
      'tanggalAwal': new FormControl({ value: '', disabled: true }),
      'tanggalAkhir': new FormControl({ value: '', disabled: true }),
      'kdGolonganPegawai': new FormControl('', Validators.required),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'kdKomponenHarga': new FormControl('', Validators.required),
      'kdStatusPegawai': new FormControl('', Validators.required),
      'kdKeterlambatan': new FormControl('', Validators.required),
      'kdPangkat': new FormControl('', Validators.required),
      'factorRate': new FormControl(''),
      'isByDay': new FormControl(''),
      'dataRate': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
  });

  this.getSmbrFile();

  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  getDataGrid(page: number, rows: number, search: any) {
    
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/findAllv2?page=' + page + '&rows=' + rows +'&dir=status.namaStatus&sort=desc').subscribe(table => {
        this.listData = table.PegawaiSKPayrollByStatus;
        this.totalRecords = table.totalRow;
    });
  }

  getData(){

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
          this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    },
    error => {
      this.namaSK = [];
      this.namaSK.push({ label: '-- ' + error + ' --', value: '' })

    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatusketerlambatan/getRangeKeterlambatan').subscribe(res => {
      this.listKeterlambatan = [];
      for (var i = 0; i < res.data.length; i++) {
          this.listKeterlambatan.push({ label: res.data[i].namaRange, value: res.data[i].kode.kode })
      };
      this.selectedKeterlambatan = this.listKeterlambatan;
      //this.kdStatusKeterlambatan = res.data[0].kode.kode;
      },
      error => {
          this.listKeterlambatan = [];
          this.listKeterlambatan.push({ label: '-- ' + error + ' --', value: '' })
      });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=id.kode,%20namaKategoryPegawai').subscribe(res => {
      this.listKategoryPegawai = [];
      this.listKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' });
      for (var i = 0; i < res.data.data.length; i++) {
          this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode })
      };
      this.selectedKategoriPegawai = this.listKategoryPegawai;
      },
      error => {
          this.listKategoryPegawai = [];
          this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
      });


      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=id.kode,%20namaGolonganPegawai').subscribe(res => {
        this.listGolonganPegawai = [];
        for (var i = 0; i < res.data.data.length; i++) {
            this.listGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id_kode })
        };
        this.selectedGolongan = this.listGolonganPegawai;
      },
        error => {
            this.listGolonganPegawai = [];
            this.listGolonganPegawai.push({ label: '-- ' + error + ' --', value: '' })
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=id.kode,namaPangkat').subscribe(res => {
          this.listPangkat = [];
          for (var i = 0; i < res.data.data.length; i++) {
              this.listPangkat.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i].id_kode })
          };
          this.selectedPangkat = this.listPangkat;
         },
          error => {
              this.listPangkat = [];
              this.listPangkat.push({ label: '-- ' + error + ' --', value: '' })
          });

          this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatusketerlambatan/getStatusKeterlambatan').subscribe(res => {
            this.listStatus = [];
            this.listStatus.push({ label: '--Pilih Status Pegawai--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listStatus.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
            };
            this.selectedStatus = this.listStatus;
        },
            error => {
                this.listStatus = [];
                this.listStatus.push({ label: '-- ' + error + ' --', value: '' })
            });

            this.listOperatorFactorRate = [];
            this.listOperatorFactorRate.push({ label: '--Pilih Operator--', value: '' })
            this.listOperatorFactorRate.push({ label: "+", value: { "kode": "+" } })
            this.listOperatorFactorRate.push({ label: "-", value: { "kode": "-" } })
            this.listOperatorFactorRate.push({ label: "x", value: { "kode": "x" } })
            this.listOperatorFactorRate.push({ label: "/", value: { "kode": "/" } })
    
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


  getKelompokTransaksi(){
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKelompokTransaksi').subscribe(table => {
			let dataKelompokTransaksi = table.KelompokTransaksi;
			 localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));	
			 this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }

  valuechangeGetKomponen(kdKategoriPegawai){
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
  changeByDay(event) {
    if (event == true) {
      this.CekByDay = 1;
    } else {
      this.CekByDay = 0;
    }
  }

  tambahKomponen(){
    let dataTemp = {
      "dataHarga": {
          "namaKomponen": "--Pilih--",
      },
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


  reset(){
        this.form.get('kdKategoryPegawai').enable();
        this.form.get('kdKeterlambatan').enable();
        this.form.get('kdGolonganPegawai').enable();
        this.form.get('kdPangkat').enable();
        this.form.get('kdKomponenHarga').enable();
        this.form.get('kdStatusPegawai').enable();
        this.ceklistKomponen = false;
        this.formAktif = true;
        this.ngOnInit();
  }

  confirmDelete(){
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


  onRowSelect(event){

    this.dataSK = [];
    this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
    this.formAktif = false;
    this.form.get('kdKategoryPegawai').disable();
    this.form.get('kdKeterlambatan').disable();
    this.form.get('kdGolonganPegawai').disable();
    this.form.get('kdPangkat').disable();
    this.form.get('kdKomponenHarga').disable();
    this.form.get('kdStatusPegawai').disable();
    this.getKomponen(event);
    this.selectedKeterlambatan = [{
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
        label: event.data.namaStatus,
        value: event.data.kdStatus
    }];
    if (event.data.isByDay == 1) {
        this.ByDay = true;
        this.CekByDay = 1;
    } else {
        this.ByDay = false;
        this.CekByDay = 0;
    }

    this.form.get('kdKomponenHarga').setValue(event.data.kode.kdKomponenHarga);
    this.form.get('kdKategoryPegawai').setValue(event.data.kode.kdKategoryPegawai);
    this.form.get('namaSk').setValue(event.data.kode.noSK);
    this.form.get('noSk').setValue(event.data.kode.noSK);
    this.form.get('isByDay').setValue(this.ByDay);
    this.form.get('kdStatusPegawai').setValue(event.data.kode.kdStatusPegawai);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    if (event.data.tglBerlakuAkhir == null) {
    } else {
        this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));
    }
    this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));

  }

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
        this.confirmUpdate()
    } else if (this.listHarga.length == 0 || this.listHarga.length == null) {
        this.alertService.warn('Peringatan', 'Data Komponen Take Tidak Boleh Kosong')
    } else {

        let dataKomponen = [];
        for (let i = 0; i < this.listHarga.length; i++) {
            dataKomponen.push({
                "factorRate": this.listHarga[i].factorRate,
                "factorRateDivide": this.listHarga[i].factorRateDivide,
                "kdKomponenHargaTake": this.listHarga[i].dataHarga.kdKomponen,
                "operatorFactorRate": this.listHarga[i].dataRate.kode,
                "hargaSatuan": this.listHarga[i].hargaSatuan,
                "persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
                "statusEnabled": true,
            })
        }
        let golongan = [];
        let range = [];
        let pangkat = [];

        for (let i = 0; i < this.selectedKeterlambatan.length; i++) {
            range.push({
                "kode": this.selectedKeterlambatan[i].value,
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
  let range = [];
  let pangkat = [];
  for (let i = 0; i < this.selectedKeterlambatan.length; i++) {
      range.push({
          "kode": this.selectedKeterlambatan[i].value,
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

  loadPage(event: LazyLoadEvent) {
    this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  cari(){
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/findAllv2?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=status.namaStatus&sort=desc&namaStatusPegawai=' + this.pencarian).subscribe(table => {
      this.listData = table.PegawaiSKPayrollByStatus;
      this.totalRecords = table.totalRow;
  });
  }

  cetak(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKPayrollByStatus/laporanPegawaiSKPayrollByStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPegawaiSkHitungKomponenKeterlambatan_laporanCetak');
  }

  tutupLaporan() {
    this.laporan = false;
  }




}
