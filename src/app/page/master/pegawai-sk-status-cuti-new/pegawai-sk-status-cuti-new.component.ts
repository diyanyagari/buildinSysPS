import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MultiSelectModule, SelectItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";
import {BlockUIModule} from 'primeng/primeng';

@Component({
  selector: 'app-pegawai-sk-status-cuti-new',
  templateUrl: './pegawai-sk-status-cuti-new.component.html',
  styleUrls: ['./pegawai-sk-status-cuti-new.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkStatusCutiNewComponent implements OnInit {
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

  pageDetail: number
  rowsDetail: number
  totalRecordsDetail: any
  listDataDetail : any[]

  detailKdRangeMasaKerja: any
  detailKdKategoryPegawai: any
  detailNoSK: any
  detailIndex: any
  expandedItems: any

  tombolBuatSK: boolean

  listStatusPerkawinan:any[];
  selectedStatusPerkawinan:any;
  detailKdStatusPerkawinan:any;
  detailKdStatus: any;

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
    this.getDropDown();
    this.CekHariLibur = 0;
    this.CekPresensi = 0;
    this.CekAllowAccumulated = 0;
    this.CekAllowToMinusKuota = 0;
    this.CekProRate = 0;
    this.formAktif = true;
    // this.get(this.page, this.rows, '');
    this.versi = null;
    this.form = this.fb.group({
      'noSk': new FormControl(''),
      'noSKIntern': new FormControl({ value: '', disabled: true }),
      'namaSk': new FormControl('', Validators.required),
      'tanggalAwal': new FormControl({ value: '', disabled: true }),
      'tanggalAkhir': new FormControl({ value: '', disabled: true }),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'masaKerja': new FormControl('', Validators.required),
      'kdStatusPegawai': new FormControl('', Validators.required),
      'allowAccumulated': new FormControl(''),
      'allowToMinusKuota': new FormControl(''),
      // 'qtyHariOverAllow': new FormControl('', Validators.required),
      'qtyHariOverAllow': new FormControl(''),
      'durasi': new FormControl('', Validators.required),
      'proRate': new FormControl(''),
      'totalQtyHariKuota': new FormControl(''),
      'qtyHariMinTake': new FormControl(''),
      'qtyHariMaxTake': new FormControl(''),
      'tglBlnResetTotalKuota': new FormControl(''),
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
      'isPresensiByMaps': new FormControl(''),
      'isIncludeHariLibur': new FormControl(''),
      'kdJenisKelamin': new FormControl(''),
      'isResetKuota':new FormControl(''),
      'qtyHariExpiredAccumulated': new FormControl(''),
      'qtyHariExpiredAccumulatedExtend': new FormControl(''),
      'isPaidPotongCuti' : new FormControl('', Validators.required),
      // 'isPaidPotongGaji' : new FormControl('', Validators.required),
      // 'isPaidDibayar' : new FormControl('', Validators.required),
      // 'isPaidTidakTidak' : new FormControl('', Validators.required),
      'isTanggalReset': new FormControl(''),
      'kdStatusPerkawinan': new FormControl(null),
      // 'isTanggalJoin': new FormControl(''),
    });

    this.form.get('tglBlnResetTotalKuota').disable();
    this.form.get('namaSk').enable();
    this.tombolBuatSK = false
    this.getDataGrid(Configuration.get().page, Configuration.get().rows);
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

    //status perkawinan
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokstatus/findAll').subscribe(res => {
      this.listStatusPerkawinan = [];
      this.listStatusPerkawinan.push({ label: '--Pilih Status Perkawinan--', value: null });
      for (var i = 0; i < res.kelompokStatus.length; i++) {
        this.listStatusPerkawinan.push({ label: res.kelompokStatus[i].namaKelompokStatus, value: res.kelompokStatus[i].id.kode })
      };
      //this.selectedStatusPerkawinan = this.listStatusPerkawinan;

    },
    error => {
      this.listStatusPerkawinan = [];
      this.listStatusPerkawinan.push({ label: '-- ' + error + ' --', value: '' })
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
      this.form.get('noSKIntern').setValue(null);
      this.form.get('tanggalAwal').setValue(null);
      this.form.get('tanggalAkhir').setValue(null);

    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSk').setValue(detailSK[0].noSK);
        this.form.get('noSKIntern').setValue(detailSK[0].noSKIntern);
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
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findGroupCutiAndIzinSakit?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.data.data;
      this.totalRecords = table.data.totalRow;
    });
  }



  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findGroupCutiAndIzinSakit?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&noSK=' + this.pencarian).subscribe(table => {
      this.listData = table.data.data;
      this.totalRecords = table.data.totalRow;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getDataGrid((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  getDataGridDetail(page: any, rows: any, kdStatus: any, kdKategoryPegawai: any, noSK: any, index: any){
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAllCutiAndIzinSakitV2?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc&kdStatus='+kdStatus+'&kdKategoryPegawai='+kdKategoryPegawai+'&noSK='+noSK).subscribe(table => {
      this.listDataDetail = table.data.data;
      this.totalRecordsDetail = table.totalRow;
    });
  }

  loadPageDetail(event: LazyLoadEvent) {

    this.getDataGridDetail((event.rows + event.first) / event.rows, event.rows, this.detailKdStatus, this.detailKdKategoryPegawai, this.detailNoSK, this.detailIndex)
    this.pageDetail = (event.rows + event.first) / event.rows;
    this.rowsDetail = event.rows;
  }


  onRowSelectBaru(event){
    this.expandedItems = []

    this.listDataDetail = []
    this.pageDetail = Configuration.get().page
    this.rowsDetail = Configuration.get().rows
    let kdRangeMasaKerja = event.data.kdRangeMasaKerja
    let kdKategoryPegawai = event.data.kdKategoryPegawai
    let kdStatusPegawai = event.data.kdStatusPegawai
    // let kdStatusPerkawinan = event.data.kdStatusPerkawinan
    let noSK = event.data.noSK
    this.detailKdRangeMasaKerja = kdRangeMasaKerja
    this.detailKdKategoryPegawai = kdKategoryPegawai
    this.detailKdStatus = kdStatusPegawai
    // this.detailKdStatusPerkawinan = kdStatusPerkawinan
    this.detailNoSK = noSK
    let index = this.findSelectedIndex()
    this.detailIndex = index

    this.form.get('namaSk').disable();
    this.tombolBuatSK = true

    this.expandedItems.push(this.listData[index])
    this.getDataGridDetail(this.pageDetail, this.rowsDetail, kdStatusPegawai, kdKategoryPegawai, noSK, index)
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
    // this.selectedStatusPerkawinan = [{
    //   label: event.data.namaStatus,
    //   value: event.data.kode
    // }]


    // const kdKategoryPegawai = this.form.get('kdKategoryPegawai');
    //       kdKategoryPegawai.clearValidators();
    //       kdKategoryPegawai.updateValueAndValidity();
    //       kdKategoryPegawai.markAsUntouched();


    // if (this.selectedKategori.length !== 0){
    //   this.form.get('kdKategoryPegawai').clearValidators();
    //   const kategoriPegawai = this.form.get('kdKategoryPegawai')
    //   kategoriPegawai.setValidators(null)
    //   kategoriPegawai.markAsUntouched();
    //   kategoriPegawai.updateValueAndValidity();
    // }
    // else {
    //   this.form.get('kdKategoryPegawai').setValidators([Validators.required]);
    //   this.form.get('kdKategoryPegawai').updateValueAndValidity();
    // }

   //  if (this.selectedMasaKerja.length !== 0){
   //    this.form.get('masaKerja').clearValidators();
   //   const masaKerja = this.form.get('masaKerja')
   //   masaKerja.setValidators(null)
   //   masaKerja.markAsUntouched();
   //   masaKerja.updateValueAndValidity();
   // }
    // else {
    //   this.form.get('masaKerja').setValidators([Validators.required]);
    //   this.form.get('masaKerja').updateValueAndValidity();
    // }


    this.formAktif = false;
    // this.form.setValue(cloned);
    let tgl = event.data.tglBerlakuAkhir * 1000;
    let tglResetTampung = event.data.tglBlnResetTotalKuota * 1000;
    let tglReset;
    
    if(event.data.tglBlnResetTotalKuota == 0 || event.data.tglBlnResetTotalKuota == null || event.data.tglBlnResetTotalKuota == ''){
      tglReset = null;
      this.isTanggalReset = "tanggaljoin"
      // this.isTanggalReset = null
      this.form.get('tglBlnResetTotalKuota').setValue(tglReset);
      this.form.get('tglBlnResetTotalKuota').disable();
    }else{
      tglReset = new Date(tglResetTampung);
      this.isTanggalReset = "tanggalkuota"
      this.form.get('tglBlnResetTotalKuota').setValue(tglReset);
      this.form.get('tglBlnResetTotalKuota').enable();
    }

    if (event.data.isResetKuota == 1) {
      this.resetKuota = true;
      this.uResetKuota = 1;
    } else {
      this.resetKuota = false;
      this.uResetKuota = 0;
    }

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


    // if (event.data.isPaid == 1) {
    //   this.Paid = true;
    //   this.CekPaid = 1;
    // } else {
    //   this.Paid = false;
    //   this.CekPaid = 0;
    // }

    if (event.data.isPaid == 2){
      this.isPaidRB = "potongcuti"
    }
    else if (event.data.isPaid == 0){
      this.isPaidRB = "potonggaji"
    }
    else if (event.data.isPaid == 1){
      this.isPaidRB = "dibayar"
    }
    else if (event.data.isPaid == 3){
      this.isPaidRB = "tidakdibayartidakpotonggaji"
    }
    else {
      // this.isPaidRB = null
    }

    if (event.data.isPaidPinalty == 1) {
      this.isPaidPinalty = true;
      this.CekisPaidPinalty = 1;
    } else {
      this.isPaidPinalty = false;
      this.CekisPaidPinalty = 0;
    }

    if (event.data.isPresensiByMaps == 1) {
      this.isPresensi = true;
      this.CekPresensi = 1;
    } else {
      this.isPresensi = false;
      this.CekPresensi = 0;
    }

    if (event.data.isIncludeHariLibur == 1) {
      this.isHariLibur = true;
      this.CekHariLibur = 1;
    } else {
      this.isHariLibur = false;
      this.CekHariLibur = 0;
    }
    this.form.get('isIncludeHariLibur').setValue(this.isHariLibur);
    this.form.get('isPresensiByMaps').setValue(this.isPresensi);
    this.form.get('kdJenisKelamin').setValue(event.data.kdJenisKelamin);

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
    this.form.get('kdStatusPerkawinan').setValue(event.data.kdKelompokStatus);
    // this.form.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
    this.form.get('qtyHariMaxTake').setValue(event.data.qtyHariMaxTake);
    this.form.get('qtyHariMinTake').setValue(event.data.qtyHariMinTake);
    this.form.get('namaSk').setValue(event.data.noSK);
    this.form.get('noSk').setValue(event.data.noSK)
    this.form.get('noSKIntern').setValue(event.data.noSKIntern)
    this.form.get('qtyHariOverAllow').setValue(event.data.qtyHariOverAllow);
    if (event.data.tglBerlakuAkhir == null) {
      this.form.get('tanggalAkhir').setValue(null)
    } else {
      this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

    }
    this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
    
    //this.form.get('tglBlnResetTotalKuota').setValue(new Date(event.data.tglBlnResetTotalKuota * 1000));
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
    this.form.get('namaSk').disable();
    this.tombolBuatSK = true
    this.form.get('isResetKuota').setValue(this.resetKuota);
    // this.form.get('isPaidDibayar').setValue(this.isPaidRB)
    this.form.get('isPaidPotongCuti').setValue(this.isPaidRB)
    // this.form.get('isPaidPotongGaji').setValue(this.isPaidRB)
    // this.form.get('isPaidTidakTidak').setValue(this.isPaidRB)
    this.form.get('isTanggalReset').setValue(this.isTanggalReset)
    this.form.get('qtyHariExpiredAccumulatedExtend').setValue(event.data.qtyHariExpiredAccumulatedExtend)
    this.form.get('qtyHariExpiredAccumulated').setValue(event.data.qtyHariExpiredAccumulated)
    this.versi = event.data.version;

    let a = this.form.get('tglBlnResetTotalKuota').value

    let tessss = this.form.value
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
      let statusPerkawinan = [];

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
      let tglBulanReset;
      if(this.form.get('totalQtyHariKuota').value == null || this.form.get('totalQtyHariKuota').value == 0 || this.form.get('totalQtyHariKuota').value == '' ){
        tglBulanReset = null;
      }else{
        tglBulanReset = this.setTimeStamp(this.form.get('tglBlnResetTotalKuota').value);
      }

      // for (let i = 0; i < this.selectedStatusPerkawinan.length; i++) {
      //   statusPerkawinan.push({
      //     "kode": this.selectedStatusPerkawinan[i].value,
      //   })
      // }

      let fixHub = {

        "isAllowAccumulated": this.CekAllowAccumulated,
        "isAllowToMinusKuota": this.CekAllowToMinusKuota,
        "isByMonth": 0,
        "isByYear": 0,
        // "isPaid": this.CekPaid,
        "isPaid": this.isPaid,
        "isPaidPinalty": this.CekisPaidPinalty,
        "isProRate": this.CekProRate,
        "isReHireAllow": 0,
        "isReHireAllowNewNIK": 0,
        "isReHireAllowResetMasaKerja": 0,
        "kategoriPegawai": kategoriPegawai,
        "kdDurasi": this.form.get('durasi').value,
        "kdKelompokStatus": this.form.get('kdStatusPerkawinan').value,
        "kdMetodeHitung": 0,
        "kdStatusAbsensi": this.form.get('statusAbsensi').value,
        //"kdStatusPerkawinan": statusPerkawinan,
        "keteranganLainnya": "",
        "masaKerja": masaKerja,
        "noRecTriggerAccumulated": "",
        "noRecTriggerToMinusKuota": "",
        "noSK": this.form.get('noSk').value,
        "qtyHariActiveAfterSK": 0,
        "qtyHariExpired": 0,
        "qtyHariExpiredExtend": 0,
        "qtyHariMaxPostingExpired": this.form.get('qtyHariMaxPostingExpired').value,
        "qtyHariMaxTake": this.form.get('qtyHariMaxTake').value,
        "qtyHariMinNewPosting": 0,
        "qtyHariMinPostingBefore": this.form.get('qtyHariMinPostingBefore').value,
        "qtyHariMinTake": this.form.get('qtyHariMinTake').value,
        "qtyHariOverAllow": 0,
        // "qtyHariOverAllow": this.form.get('qtyHariOverAllow').value,
        "qtyJamMaxPostingBefore": this.form.get('qtyJamMaxPostingBefore').value,
        "qtyJamMaxPostingExpired": this.form.get('qtyJamMaxPostingExpired').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "statusPegawai": statusPegawai,
        "statusSaldoKuotaMin": this.form.get('statusSaldoKuotaMin').value,
        "statusSaldoKuotaPlus": this.form.get('statusSaldoKuotaPlus').value,
        "tglBlnResetTotalKuota": tglBulanReset,
        //"tglBlnResetTotalKuota": this.setTimeStamp(this.form.get('tglBlnResetTotalKuota').value),
        // "tglBerlakuAwal": this.setTimeStamp(this.form.get('tanggalAwal').value),
        // "tglBerlakuAkhir": this.setTimeStamp(this.form.get('tanggalAkhir').value),
        "totalQtyHariKuota": this.form.get('totalQtyHariKuota').value,
        "isIncludeHariLibur": this.CekHariLibur,
        // "isPresensiByMaps": this.CekPresensi,
        "isPresensiByMaps": 0,
        "kdJenisKelamin": this.form.get('kdJenisKelamin').value,
        "isResetKuota":this.uResetKuota,
        "qtyHariExpiredAccumulated": this.form.get('qtyHariExpiredAccumulated').value,
        "qtyHariExpiredAccumulatedExtend": this.form.get('qtyHariExpiredAccumulatedExtend').value
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
    let masaKerja = [];
    let kategoriPegawai = [];
    let statusPerkawinan = [];

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

    // for (let i = 0; i < this.selectedStatusPerkawinan.length; i++) {
    //   statusPerkawinan.push({
    //     "kode": this.selectedStatusPerkawinan[i].value,
    //   })
    // }


    let tglBulanReset;
    if(this.form.get('totalQtyHariKuota').value == null || this.form.get('totalQtyHariKuota').value == 0 || this.form.get('totalQtyHariKuota').value == '' ){
      tglBulanReset = 0;
    }else{
      tglBulanReset = this.setTimeStamp(this.form.get('tglBlnResetTotalKuota').value);
    }
    let fixHub = {

      "isAllowAccumulated": this.CekAllowAccumulated,
      "isAllowToMinusKuota": this.CekAllowToMinusKuota,
      "isProRate": this.CekProRate,
      // "isPaid": this.CekPaid,
      "isPaid": this.isPaid,
      "isPaidPinalty": this.CekisPaidPinalty,
      "statusSaldoKuotaMin": this.form.get('statusSaldoKuotaMin').value,
      "statusSaldoKuotaPlus": this.form.get('statusSaldoKuotaPlus').value,
      "kdDurasi": this.form.get('durasi').value,
      "kdRangeMasaKerja": this.selectedMasaKerja[0].value,
      // "kdRangeMasaKerja": masaKerja,
      "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
      //"kdStatusPerkawinan": this.selectedStatusPerkawinan[0].value,
      "kdKategoryPegawai": this.selectedKategori[0].value,
      "kdKelompokStatus": this.form.get('kdStatusPerkawinan').value,
      // "kdKategoryPegawai": kategoriPegawai,
      "qtyHariMaxTake": this.form.get('qtyHariMaxTake').value,
      "qtyHariMinTake": this.form.get('qtyHariMinTake').value,
      "noSK": this.form.get('noSk').value,
      // "qtyHariOverAllow": this.form.get('qtyHariOverAllow').value,
      "qtyHariOverAllow": 0,
      "tglBlnResetTotalKuota": tglBulanReset,
      //"tglBlnResetTotalKuota": this.setTimeStamp(this.form.get('tglBlnResetTotalKuota').value),
      "tglBerlakuAwal": this.setTimeStamp(this.form.get('tanggalAwal').value),
      "tglBerlakuAkhir": this.setTimeStamp(this.form.get('tanggalAkhir').value),
      "totalQtyHariKuota": this.form.get('totalQtyHariKuota').value,
      "qtyHariMinPostingBefore": this.form.get('qtyHariMinPostingBefore').value,
      "qtyJamMaxPostingBefore": this.form.get('qtyJamMaxPostingBefore').value,
      "kdStatusAbsensi": this.form.get('statusAbsensi').value,
      "qtyJamMaxPostingExpired": this.form.get('qtyJamMaxPostingExpired').value,
      "qtyHariMaxPostingExpired": this.form.get('qtyHariMaxPostingExpired').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "isIncludeHariLibur": this.CekHariLibur,
      // "isPresensiByMaps": this.CekPresensi,
      "isPresensiByMaps": 0,
      "kdJenisKelamin": this.form.get('kdJenisKelamin').value,
      "isResetKuota":this.uResetKuota,
      "qtyHariExpiredAccumulatedExtend": this.form.get('qtyHariExpiredAccumulatedExtend').value,
      "qtyHariExpiredAccumulated": this.form.get('qtyHariExpiredAccumulated').value

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
    this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskstatus/delete/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdStatusPegawai + '/' + deleteItem.kdRangeMasaKerja).subscribe(response => {
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
    this.form.get('namaSk').enable();
    this.tombolBuatSK = false
    this.ngOnInit();
  }


  onDestroy() {

  }
  downloadExcel() {

  }


  downloadPdf() {
    let cetak = Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }



  cetak() {
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
