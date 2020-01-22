import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MultiSelectModule, SelectItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";
import { BlockUIModule } from 'primeng/primeng';

@Component({
  selector: 'app-pegawai-sk-status-dinas',
  templateUrl: './pegawai-sk-status-dinas.component.html',
  styleUrls: ['./pegawai-sk-status-dinas.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkStatusDinasComponent implements OnInit {
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
  smbrFile: any;
  resetKuota: any;
  uResetKuota: any;

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
  listDataDetail: any[]

  detailKdRangeMasaKerja: any
  detailKdKategoryPegawai: any
  detailNoSK: any
  detailIndex: any
  expandedItems: any

  tombolBuatSK: boolean

  listStatusPerkawinan: any[];
  selectedStatusPerkawinan: any;
  detailKdStatusPerkawinan: any;
  detailKdStatus: any;
  kdStatusPegawai: any;
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
    this.versi = null;
    this.form = this.fb.group({
      'noSk': new FormControl(''),
      'noSKIntern': new FormControl({ value: '', disabled: true }),
      'namaSk': new FormControl('', Validators.required),
      'tanggalAwal': new FormControl({ value: '', disabled: true }),
      'tanggalAkhir': new FormControl({ value: '', disabled: true }),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'masaKerja': new FormControl('', Validators.required),
      'statusAbsensi': new FormControl(''),
      'isPaid': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.form.get('namaSk').enable();
    this.tombolBuatSK = false
    this.getDataGrid(Configuration.get().page, Configuration.get().rows);
    this.getSmbrFile();
  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getDropDown() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&criteria=id.kdProfile&values=' + this.kdProfile).subscribe(res => {
      this.listKategoryPegawai = [];
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
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getRangeMasaKerjaDinas').subscribe(res => {
      this.listMasaKerja = [];
      for (var i = 0; i < res.data.length; i++) {
        this.listMasaKerja.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
      };
      this.selectedMasaKerja = this.listMasaKerja;
    },
      error => {
        this.listMasaKerja = [];
        this.listMasaKerja.push({ label: '-- ' + error + ' --', value: '' })
      });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusMasukTidakMasuk').subscribe(res => {
      this.listStatusAbsensi = [];
      this.listStatusAbsensi.push({ label: '--Pilih Status Absensi--', value: null });
      for (var i = 0; i < res.status.length; i++) {
        this.listStatusAbsensi.push({ label: res.status[i].namaStatus, value: res.status[i].kdStatus })
      };
    },
      error => {
        this.listStatusAbsensi = [];
        this.listStatusAbsensi.push({ label: '-- ' + error + ' --', value: '' })
      });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getStatusPerjalananDinas').subscribe(res => {
      this.kdStatusPegawai = res.status[0].kdStatus
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
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
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAllPegawaiStatusPerjalananDinas?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.data.data;
      this.totalRecords = table.data.totalRow;
    });
  }



  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAllPegawaiStatusPerjalananDinas?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&namaSK=' + this.pencarian).subscribe(table => {
      this.listData = table.data.data;
      this.totalRecords = table.data.totalRow;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getDataGrid((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  // getDataGridDetail(page: any, rows: any, kdStatus: any, kdKategoryPegawai: any, noSK: any, index: any) {
  //   this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskstatus/findAllPegawaiStatusPerjalananDinas?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc&kdStatus=' + kdStatus + '&kdKategoryPegawai=' + kdKategoryPegawai + '&noSK=' + noSK).subscribe(table => {
  //     this.listDataDetail = table.data.data;
  //     this.totalRecordsDetail = table.totalRow;
  //   });
  // }




  // onRowSelectBaru(event) {
  //   this.expandedItems = []

  //   this.listDataDetail = []
  //   this.pageDetail = Configuration.get().page
  //   this.rowsDetail = Configuration.get().rows
  //   let kdRangeMasaKerja = event.data.kdRangeMasaKerja
  //   let kdKategoryPegawai = event.data.kdKategoryPegawai
  //   let kdStatusPegawai = event.data.kdStatusPegawai
  //   let noSK = event.data.noSK
  //   this.detailKdRangeMasaKerja = kdRangeMasaKerja
  //   this.detailKdKategoryPegawai = kdKategoryPegawai
  //   this.detailKdStatus = kdStatusPegawai
  //   this.detailNoSK = noSK
  //   let index = this.findSelectedIndex()
  //   this.detailIndex = index

  //   this.form.get('namaSk').disable();
  //   this.tombolBuatSK = true

  //   this.expandedItems.push(this.listData[index])
  //   this.getDataGridDetail(this.pageDetail, this.rowsDetail, kdStatusPegawai, kdKategoryPegawai, noSK, index)
  // }



  onRowSelect(event) {
    this.selectedKategori = [{
      label: event.data.namaKategoryPegawai,
      value: event.data.kdKategoryPegawai
    }]
    this.selectedMasaKerja = [{
      label: event.data.namaRange,
      value: event.data.kdRangeMasaKerja
    }]
    this.formAktif = false;

    if (event.data.isPaid == 1) {
      this.form.get('isPaid').setValue(true);
    }
    else if (event.data.isPaid == 0) {
      this.form.get('isPaid').setValue(false);
    }

    this.form.get('namaSk').setValue(event.data.noSK);
    this.form.get('noSk').setValue(event.data.noSK)
    this.form.get('noSKIntern').setValue(event.data.noSKIntern)
    if (event.data.tglBerlakuAkhir == null) {
      this.form.get('tanggalAkhir').setValue(null)
    } else {
      this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

    }
    this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
    this.form.get('statusAbsensi').setValue(event.data.kdStatusAbsensi);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('masaKerja').disable();
    this.form.get('kdKategoryPegawai').disable();
    this.form.get('namaSk').disable();
    this.tombolBuatSK = true
    this.versi = event.data.version;
  }



  changeIsResetKuota(event) {
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
        "kode": this.kdStatusPegawai,
      })
      let isPaid = 0;
      if (this.form.get('isPaid').value) {
        isPaid = 1;
      }
      let fixHub = {
        "isPaid": isPaid,
        "kategoriPegawai": kategoriPegawai,
        "kdStatusAbsensi": this.form.get('statusAbsensi').value,
        "masaKerja": masaKerja,
        "noSK": this.form.get('noSk').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "statusPegawai": statusPegawai,

        "isAllowAccumulated": 0,
        "isAllowToMinusKuota": 0,
        "isByMonth": 0,
        "isByYear": 0,
        "isPaidPinalty": 0,
        "isProRate": 0,
        "isReHireAllow": 0,
        "isReHireAllowNewNIK": 0,
        "isReHireAllowResetMasaKerja": 0,
        "kdDurasi": 0,
        "kdMetodeHitung": 0,
        "keteranganLainnya": "",
        "noRecTriggerAccumulated": "",
        "noRecTriggerToMinusKuota": "",
        "qtyHariActiveAfterSK": 0,
        "qtyHariExpired": 0,
        "qtyHariExpiredExtend": 0,
        "qtyHariMaxPostingExpired": 0,
        "qtyHariMaxTake": 0,
        "qtyHariMinNewPosting": 0,
        "qtyHariMinPostingBefore": 0,
        "qtyHariMinTake": 0,
        "qtyHariOverAllow": 0,
        "qtyJamMaxPostingBefore": 0,
        "qtyJamMaxPostingExpired": 0,
        "totalQtyHariKuota": 0,
        "isIncludeHariLibur": 0,
        "isPresensiByMaps": 0,
        "isResetKuota": 0,
        "qtyHariExpiredAccumulated": 0,
        "qtyHariExpiredAccumulatedExtend": 0
      }

      console.log(fixHub);

      this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskstatus/saveRev', fixHub).subscribe(response => {
      },
        error => {
          // this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
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
      "kode": this.kdStatusPegawai,
    })
    let isPaid = 0;
    if (this.form.get('isPaid').value) {
      isPaid = 1;
    }
    let fixHub = {
      "isPaid": isPaid,
      "kdKategoryPegawai": kategoriPegawai[0].kode,
      "kdStatusAbsensi": this.form.get('statusAbsensi').value,
      "kdRangeMasaKerja": masaKerja[0].kode,
      "noSK": this.form.get('noSk').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "kdStatusPegawai": statusPegawai[0].kode,

      "isAllowAccumulated": 0,
      "isAllowToMinusKuota": 0,
      "isByMonth": 0,
      "isByYear": 0,
      "isPaidPinalty": 0,
      "isProRate": 0,
      "isReHireAllow": 0,
      "isReHireAllowNewNIK": 0,
      "isReHireAllowResetMasaKerja": 0,
      "kdDurasi": 0,
      "kdMetodeHitung": 0,
      "keteranganLainnya": "",
      "noRecTriggerAccumulated": "",
      "noRecTriggerToMinusKuota": "",
      "qtyHariActiveAfterSK": 0,
      "qtyHariExpired": 0,
      "qtyHariExpiredExtend": 0,
      "qtyHariMaxPostingExpired": 0,
      "qtyHariMaxTake": 0,
      "qtyHariMinNewPosting": 0,
      "qtyHariMinPostingBefore": 0,
      "qtyHariMinTake": 0,
      "qtyHariOverAllow": 0,
      "qtyJamMaxPostingBefore": 0,
      "qtyJamMaxPostingExpired": 0,
      "totalQtyHariKuota": 0,
      "isIncludeHariLibur": 0,
      "isPresensiByMaps": 0,
      "isResetKuota": 0,
      "qtyHariExpiredAccumulated": 0,
      "qtyHariExpiredAccumulatedExtend": 0

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
    this.form.get('namaSk').enable();
    this.tombolBuatSK = false
    this.ngOnInit();
  }
  onDestroy() {
  }
  downloadExcel() {
  }
  downloadPdf() {
    let cetak = Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKStatus/laporanPegawaiSKStatus.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmPegawaiSkStatus_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }
}
