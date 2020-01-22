import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MultiSelectModule, SelectItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pegawai-sk-status-pensiun-new',
  templateUrl: './pegawai-sk-status-pensiun-new.component.html',
  styleUrls: ['./pegawai-sk-status-pensiun-new.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkStatusPensiunNewComponent implements OnInit {
  selected: any;
  selectedPensiun: any;
  listData: any[];
  dataDummy: {};
  formAktif: boolean;
  pencarian: string;
  Negara: any[];
  Propinsi: any[];
  Kabupaten: any[];
  versi: any;
  form: FormGroup;
  items: any;
  itemsPensiun: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  kecamatan: any[];
  kecamatan1: any[];
  listKategoryPegawai: any[];
  listMasaKerja: any[];
  listStatusPegawai: any[];
  listStatusAbsensi: any[];
  listStatusAbsensiPotongAbsen: any[];
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
  selectedKategoriPensiun: any[];
  selectedMasaKerjaPensiun: any[];
  isPaidPinalty: boolean;
  namaSK: any[];
  CekisPaidPinalty: any;
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];

  formAktifPensiun: boolean;
  formPensiun: FormGroup;

  listDataPensiun: any[];
  totalRecordsPensiun: number;
  listStatusPegawaiPensiun: any[];
  listJenisKelamin: any[];
  CekPresensi: any;
  CekHariLibur: any;
  isPresensi: any;
  isHariLibur: any;
  listMasaKerjaPensiun: any[];
  smbrFile:any;
  resetKuota:any;
  uResetKuota:any;

  formAktifAbsen: boolean;
  formAbsen: FormGroup;

  itemsAbsen: any;
  listDataAbsen: any[];
  totalRecordsAbsen: number;
  selectedAbsen: any;
  selectedKategoriAbsen: any[];
  selectedMasaKerjaAbsen: any[];
  listMasaKerjaAbsen: any[];
  listStatusPegawaiAbsen: any[];

  isPaidRB: any;
  isPaid: any;

  isTanggalReset: any;

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


    this.itemsPensiun = [
    {
      label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        this.downloadPdfPensiun();
      }
    },
    {
      label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
        this.downloadExcelPensiun();
      }
    },

    ];



    this.getDropDown();

    this.CekHariLibur = 0;
    this.CekPresensi = 0;
    this.CekAllowAccumulated = 0;
    this.CekAllowToMinusKuota = 0;
    this.CekProRate = 0;
    this.versi = null;
   
    this.formAktifPensiun = true;
    this.formPensiun = this.fb.group({
      'noSk': new FormControl(''),
      'noSKIntern': new FormControl(''),
      'namaSk': new FormControl('', Validators.required),
      'tanggalAwal': new FormControl({ value: '', disabled: true }),
      'tanggalAkhir': new FormControl({ value: '', disabled: true }),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'masaKerja': new FormControl('', Validators.required),
      'kdStatusPegawai': new FormControl('', Validators.required),
      'allowAccumulated': new FormControl(0),
      'allowToMinusKuota': new FormControl(0),
      'qtyHariOverAllow': new FormControl(0),
      // 'durasi': new FormControl('', Validators.required),
      'durasi': new FormControl(''),
      'proRate': new FormControl(0),
      'totalQtyHariKuota': new FormControl(''),
      'qtyHariMinTake': new FormControl(''),
      'qtyHariMaxTake': new FormControl(''),
      'tglBlnResetTotalKuota': new FormControl(null),
      'AktifTanggal': new FormControl(''),
      'qtyHariMinPostingBefore': new FormControl('', Validators.required),
      'qtyJamMaxPostingBefore': new FormControl('', Validators.required),
      'statusAbsensi': new FormControl(''),
      'isPaid': new FormControl(0),
      'isPaidPinalty': new FormControl(0),
      'statusSaldoKuotaMin': new FormControl(null),
      'statusSaldoKuotaPlus': new FormControl(null),
      'qtyHariMaxPostingExpired': new FormControl(0),
      'qtyJamMaxPostingExpired': new FormControl(0),
      'statusEnabled': new FormControl('', Validators.required),
      //'isResetKuota':new FormControl(''),
    });

    this.getDataGridPensiun(Configuration.get().page, Configuration.get().rows);

    this.getSmbrFile();
  }

  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
     this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }

  getDropDown() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&criteria=id.kdProfile&values=' + this.kdProfile).subscribe(res => {
      this.listKategoryPegawai = [];
      // this.listKategoryPegawai.push({ label: '--Pilih Kategory Pegawai--', value: '' });
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
      this.selectedKategori = this.listKategoryPegawai;
      this.selectedKategoriPensiun = this.listKategoryPegawai;
      this.selectedKategoriAbsen = this.listKategoryPegawai;

    },
    error => {
      this.listKategoryPegawai = [];
      this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=JenisKelamin&select=id.kode,namaJenisKelamin').subscribe(res => {
      this.listJenisKelamin = [];
      this.listJenisKelamin.push({ label: '--Pilih Jenis Kelamin--', value: '' });
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i].id_kode })
      };
    },
    error => {
      this.listJenisKelamin = [];
      this.listJenisKelamin.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getRangeMasaKerja').subscribe(res => {
      this.listMasaKerja = [];
      // this.listMasaKerja.push({ label: '--Pilih Masa Kerja--', value: '' });
      for (var i = 0; i < res.data.length; i++) {
        this.listMasaKerja.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
      };
      this.selectedMasaKerja = this.listMasaKerja;
      // this.selectedMasaKerjaPensiun = this.listMasaKerja;

    },
    error => {
      this.listMasaKerja = [];
      this.listMasaKerja.push({ label: '-- ' + error + ' --', value: '' })
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getRangeMasaKerjaPotongAbsen').subscribe(res => {
      this.listMasaKerjaAbsen = [];
      // this.listMasaKerja.push({ label: '--Pilih Masa Kerja--', value: '' });
      for (var i = 0; i < res.data.length; i++) {
        this.listMasaKerjaAbsen.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
      };
      this.selectedMasaKerjaAbsen = this.listMasaKerjaAbsen;
      // this.selectedMasaKerjaPensiun = this.listMasaKerja;

    },
    error => {
      this.listMasaKerjaAbsen = [];
      this.listMasaKerjaAbsen.push({ label: '-- ' + error + ' --', value: '' })
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getRangeMasaKerjaPensiun').subscribe(res => {
      this.listMasaKerjaPensiun = [];
      // this.listMasaKerja.push({ label: '--Pilih Masa Kerja--', value: '' });
      for (var i = 0; i < res.data.length; i++) {
        this.listMasaKerjaPensiun.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
      };
      // this.selectedMasaKerja = this.listMasaKerjaPensiun;
      this.selectedMasaKerjaPensiun = this.listMasaKerjaPensiun;

    },
    error => {
      this.listMasaKerja = [];
      this.listMasaKerja.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusCuti').subscribe(res => {
      this.listStatusPegawai = [];
      this.listStatusPegawai.push({ label: '--Pilih Status Pegawai--', value: null });
      for (var i = 0; i < res.data.length; i++) {
        this.listStatusPegawai.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
      };
    },
    error => {
      this.listStatusPegawai = [];
      this.listStatusPegawai.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusAbsensiTidakMasuk').subscribe(res => {
      this.listStatusPegawaiAbsen = [];
      this.listStatusPegawaiAbsen.push({ label: '--Pilih Status Pegawai--', value: null });
      for (var i = 0; i < res.data.length; i++) {
        this.listStatusPegawaiAbsen.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
      };
    },
    error => {
      this.listStatusPegawaiAbsen = [];
      this.listStatusPegawaiAbsen.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusPensiun').subscribe(res => {
      this.listStatusPegawaiPensiun = [];
      this.listStatusPegawaiPensiun.push({ label: '--Pilih Status Pegawai--', value: null });
      for (var i = 0; i < res.data.length; i++) {
        this.listStatusPegawaiPensiun.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
      };
    },
    error => {
      this.listStatusPegawai = [];
      this.listStatusPegawai.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusCuti').subscribe(res => {
      this.listStatusAbsensi = [];
      this.listStatusAbsensi.push({ label: '--Pilih Status Absensi--', value: null });
      for (var i = 0; i < res.data.length; i++) {
        this.listStatusAbsensi.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
      };

    },
    error => {
      this.listStatusAbsensi = [];
      this.listStatusAbsensi.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusAbsensiTidakMasuk').subscribe(res => {
      this.listStatusAbsensiPotongAbsen = [];
      this.listStatusAbsensiPotongAbsen.push({ label: '--Pilih Status Absensi--', value: null });
      for (var i = 0; i < res.data.length; i++) {
        this.listStatusAbsensiPotongAbsen.push({ label: res.data[i].namaStatus, value: res.data[i].kdStatus })
      };

    },
    error => {
      this.listStatusAbsensiPotongAbsen = [];
      this.listStatusAbsensiPotongAbsen.push({ label: '-- ' + error + ' --', value: '' })
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
  }


  getKelompokTransaksiPensiun() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }

 

  ambilSKPensiun(sk) {
    if (this.formPensiun.get('namaSk').value == '' || this.formPensiun.get('namaSk').value == null || this.formPensiun.get('namaSk').value == undefined) {
      this.formPensiun.get('noSk').setValue(null);
      this.formPensiun.get('noSKIntern').setValue(null);
      this.formPensiun.get('tanggalAwal').setValue(null);
      this.formPensiun.get('tanggalAkhir').setValue(null);

    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.formPensiun.get('noSk').setValue(detailSK[0].noSK);
        this.formPensiun.get('noSKIntern').setValue(detailSK[0].noSKIntern);
        this.formPensiun.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.formPensiun.get('tanggalAkhir').setValue(null);
        } else {
          this.formPensiun.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

        }
      });
    }
  }

  

  getDataGridPensiun(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAllPensiun?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listDataPensiun = table.data.data;
      this.totalRecordsPensiun = table.data.totalRow;
    });
  }

 

  cariPensiun() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAllPensiun?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&noSK=' + this.pencarian).subscribe(table => {
      this.listDataPensiun = table.data.data;
      this.totalRecordsPensiun = table.totalRow;
    });
  }

  // loadPage(event: LazyLoadEvent) {
  //     this.get((event.rows + event.first) / event.rows, event.rows)
  //     this.page = (event.rows + event.first) / event.rows;
  //     this.rows = event.rows;
  //   }
 

  loadPagePensiun(event: LazyLoadEvent) {
    // let awal = this.setTimeStamp(this.tanggalAwal);
    // let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.getDataGridPensiun((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  onRowSelectPensiun(event) {
    // let cloned = this.clone(event.data);
    this.selectedKategoriPensiun = [{
      label: event.data.namaKategoryPegawai,
      value: event.data.kdKategoryPegawai
    }]
    this.selectedMasaKerjaPensiun = [{
      label: event.data.namaRange,
      value: event.data.kdRangeMasaKerja
    }]
    this.formAktifPensiun = false;
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

    this.formPensiun.get('allowAccumulated').setValue(this.AllowAccumulated);
    this.formPensiun.get('allowToMinusKuota').setValue(this.AllowToMinusKuota);
    this.formPensiun.get('proRate').setValue(this.ProRate);
    this.formPensiun.get('isPaid').setValue(this.Paid);
    this.formPensiun.get('isPaidPinalty').setValue(this.isPaidPinalty);
    this.formPensiun.get('statusSaldoKuotaMin').setValue(event.data.statusSaldoKuotaMin);
    this.formPensiun.get('statusSaldoKuotaPlus').setValue(event.data.statusSaldoKuotaPlus);
    this.formPensiun.get('durasi').setValue(event.data.kdDurasi);
    // this.formPensiun.get('masaKerja').setValue(event.data.kdRangeMasaKerja);
    this.formPensiun.get('kdStatusPegawai').setValue(event.data.kdStatusPegawai);
    // this.formPensiun.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
    this.formPensiun.get('qtyHariMaxTake').setValue(event.data.qtyHariMaxTake);
    this.formPensiun.get('qtyHariMinTake').setValue(event.data.qtyHariMinTake);
    this.formPensiun.get('namaSk').setValue(event.data.noSK);
    this.formPensiun.get('noSk').setValue(event.data.noSK)
    this.formPensiun.get('noSKIntern').setValue(event.data.noSKIntern)
    this.formPensiun.get('qtyHariOverAllow').setValue(event.data.qtyHariOverAllow);
    if (event.data.tglBerlakuAkhir == null) {
      this.formPensiun.get('tanggalAkhir').setValue(null)
    } else {
      this.formPensiun.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

    }
    this.formPensiun.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
    // this.formPensiun.get('tglBlnResetTotalKuota').setValue(new Date(event.data.tglBlnResetTotalKuota * 1000));
    this.formPensiun.get('tglBlnResetTotalKuota').setValue(null);
    this.formPensiun.get('totalQtyHariKuota').setValue(event.data.totalQtyHariKuota);
    this.formPensiun.get('qtyJamMaxPostingBefore').setValue(event.data.qtyJamMaxPostingBefore);
    this.formPensiun.get('qtyHariMinPostingBefore').setValue(event.data.qtyHariMinPostingBefore);
    this.formPensiun.get('qtyJamMaxPostingExpired').setValue(event.data.qtyJamMaxPostingExpired);
    this.formPensiun.get('qtyHariMaxPostingExpired').setValue(event.data.qtyHariMaxPostingExpired);
    this.formPensiun.get('statusAbsensi').setValue(event.data.kdStatusAbsensi);
    this.formPensiun.get('statusEnabled').setValue(event.data.statusEnabled);
    this.formPensiun.get('masaKerja').disable();
    this.formPensiun.get('kdKategoryPegawai').disable();
    this.formPensiun.get('kdStatusPegawai').disable();
    this.versi = event.data.version;
  }

  changeIsResetKuota(event){
    if (event == true) {
      this.uResetKuota = 1;
    } else {
      this.uResetKuota = 0;
    }
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
  changeHariLibur(event) {
    if (event == true) {
      this.CekHariLibur = 1;
    } else {
      this.CekHariLibur = 0;
    }
  }
  changePresensi(event) {
    if (event == true) {
      this.CekPresensi = 1;
    } else {
      this.CekPresensi = 0;
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


  onSubmitPensiun() {
    if (this.formPensiun.invalid) {
      this.validateAllFormFields(this.formPensiun);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanPensiun();
    }
  }

  simpanPensiun() {
    if (this.formAktifPensiun == false) {
      this.confirmUpdatePensiun();
    } else {
      let masaKerja = [];
      let kategoriPegawai = [];
      for (let i = 0; i < this.selectedMasaKerjaPensiun.length; i++) {
        masaKerja.push({
          "kode": this.selectedMasaKerjaPensiun[i].value,
        })
      }
      for (let i = 0; i < this.selectedKategoriPensiun.length; i++) {
        kategoriPegawai.push({
          "kode": this.selectedKategoriPensiun[i].value,
        })
      }
      let statusPegawai = [];
      statusPegawai.push({
        "kode": this.formPensiun.get('kdStatusPegawai').value,
      })
      let fixHub = {

        "isAllowAccumulated": 0,
        "isAllowToMinusKuota": 0,
        "isByMonth": 0,
        "isByYear": 0,
        "isPaid": 0,
        "isPaidPinalty": 0,
        "isProRate": 0,
        "isReHireAllow": 0,
        "isReHireAllowNewNIK": 0,
        "isReHireAllowResetMasaKerja": 0,
        "kategoriPegawai": kategoriPegawai,
        // "kdDurasi": this.formPensiun.get('durasi').value,
        "kdDurasi": 1,
        "kdMetodeHitung": 0,
        "kdStatusAbsensi": null,
        "keteranganLainnya": "",
        "masaKerja": masaKerja,
        "noRecTriggerAccumulated": "",
        "noRecTriggerToMinusKuota": "",
        "noSK": this.formPensiun.get('noSk').value,
        "qtyHariActiveAfterSK": 0,
        "qtyHariExpired": 0,
        "qtyHariExpiredExtend": 0,
        "qtyHariMaxPostingExpired": 0,
        "qtyHariMaxTake": this.formPensiun.get('qtyHariMaxTake').value,
        "qtyHariMinNewPosting": 0,
        "qtyHariMinPostingBefore": this.formPensiun.get('qtyHariMinPostingBefore').value,
        "qtyHariMinTake": this.formPensiun.get('qtyHariMinTake').value,
        "qtyHariOverAllow": 0,
        "qtyJamMaxPostingBefore": this.formPensiun.get('qtyJamMaxPostingBefore').value,
        "qtyJamMaxPostingExpired": 0,
        "statusEnabled": this.formPensiun.get('statusEnabled').value,
        "statusPegawai": statusPegawai,
        "statusSaldoKuotaMin": null,
        "statusSaldoKuotaPlus": null,
        "tglBlnResetTotalKuota": null,
        // "tglBerlakuAwal": this.setTimeStamp(this.formPensiun.get('tanggalAwal').value),
        // "tglBerlakuAkhir": this.setTimeStamp(this.formPensiun.get('tanggalAkhir').value),
        "totalQtyHariKuota": this.formPensiun.get('totalQtyHariKuota').value,


      }

      this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskstatus/saveRev', fixHub).subscribe(response => {
      },
      error => {
        this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Data Disimpan');

        this.resetPensiun();
      });

    }
  }

  confirmUpdatePensiun() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      accept: () => {
        this.updatePensiun();
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }

  updatePensiun() {
    let fixHub = {

      "isAllowAccumulated": 0,
      "isAllowToMinusKuota": 0,
      "isProRate": 0,
      "isPaid": 0,
      "isPaidPinalty": 0,
      "statusSaldoKuotaMin": null,
      "statusSaldoKuotaPlus": null,
      // "kdDurasi": this.formPensiun.get('durasi').value,
      "kdDurasi": 1,
      "kdRangeMasaKerja": this.selectedMasaKerjaPensiun[0].value,
      "kdStatusPegawai": this.formPensiun.get('kdStatusPegawai').value,
      "kdKategoryPegawai": this.selectedKategoriPensiun[0].value,
      "qtyHariMaxTake": this.formPensiun.get('qtyHariMaxTake').value,
      "qtyHariMinTake": this.formPensiun.get('qtyHariMinTake').value,
      "noSK": this.formPensiun.get('noSk').value,
      "qtyHariOverAllow": 0,
      "tglBlnResetTotalKuota": null,
      "tglBerlakuAwal": this.setTimeStamp(this.formPensiun.get('tanggalAwal').value),
      "tglBerlakuAkhir": this.setTimeStamp(this.formPensiun.get('tanggalAkhir').value),
      "totalQtyHariKuota": this.formPensiun.get('totalQtyHariKuota').value,
      "qtyHariMinPostingBefore": this.formPensiun.get('qtyHariMinPostingBefore').value,
      "qtyJamMaxPostingBefore": this.formPensiun.get('qtyJamMaxPostingBefore').value,
      "kdStatusAbsensi": null,
      "qtyJamMaxPostingExpired": 0,
      "qtyHariMaxPostingExpired": 0,
      "statusEnabled": this.formPensiun.get('statusEnabled').value,

    }
    console.log(fixHub);

    this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiskstatus/update/' + this.versi, fixHub).subscribe(response => {
    },
    error => {
      this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
    },
    () => {
      this.alertService.success('Berhasil', 'Data Diperbarui');

      this.resetPensiun();
    });
  }

 

  confirmDeletePensiun() {
    let noSk = this.formPensiun.get('noSk').value;
    if (noSk == null || noSk == undefined || noSk == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Status');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapusPensiun();
        },
        reject: () => {
          this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
        }
      });
    }
  }

  
  hapusPensiun() {

    let item = [...this.listDataPensiun];
    let deleteItem = item[this.findSelectedIndexPensiun()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskstatus/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdStatusPegawai + '/' + deleteItem.kdRangeMasaKerja).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.resetPensiun();
    });
  }  

  findSelectedIndexPensiun(): number {
    return this.listDataPensiun.indexOf(this.selectedPensiun);
  }

 

  resetPensiun() {
    this.formPensiun.get('masaKerja').enable();
    this.formPensiun.get('kdKategoryPegawai').enable();
    this.formPensiun.get('kdStatusPegawai').enable();
    this.ngOnInit();
  }
  onDestroy() {

  }
 

  downloadExcelPensiun() {

  }


  downloadPdfPensiun() {
    // let cetak = Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
    // window.open(cetak);
  }


  cetakPensiun() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmPegawaiSkStatus_laporanCetak');

  }
  
  tutupLaporan() {
    this.laporan = false;
  }

  getTanggalReset(value) {
    if (value == "tanggalkuota"){
      this.form.get('tglBlnResetTotalKuota').enable();
    }
    else if (value == "tanggaljoin"){
      this.form.get('tglBlnResetTotalKuota').setValue(null)
      this.form.get('tglBlnResetTotalKuota').disable();
    }
  }

  getIsPaid(value) {
    if (value == "potongcuti") {
      this.isPaid = 2
    } else if (value == "potonggaji") {
      this.isPaid = 0
    } else if (value == "dibayar") {
      this.isPaid = 1
    } else if (value == "tidakdibayartidakpotonggaji"){
      this.isPaid = 3
    }
    else {
      this.isPaid = null
    }
  }
}
