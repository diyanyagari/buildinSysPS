import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MasterPegawaiSkAsuransi } from './master-pegawai-sk-asuransi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, ReportService, AuthGuard } from '../../../global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-master-pegawai-sk-asuransi',
  templateUrl: './master-pegawai-sk-asuransi.component.html',
  styleUrls: ['./master-pegawai-sk-asuransi.component.scss'],
  providers: [ConfirmationService]
})
export class MasterPegawaiSkAsuransiComponent implements OnInit {
  selected: MasterPegawaiSkAsuransi;
  listData: any[];
  listKomponenGaji: any[];
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  page: number;
  rows: number;
  totalRecords: any;
  namaSk: SelectItem[];
  rekananPenjamin: SelectItem[];
  komponenHarga: SelectItem[];
  kdKomponenGaji: SelectItem[];
  operatorFactorRate: SelectItem[];
  dataSK: any[];
  laporan: boolean = false;
  kdprof: any;
  smbrFile: any;

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private route: Router,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  setpersenHargaSatuan() {
    let data = this.form.get('persenHarga').value
    if (data == 'harga') {
      this.form.get('hargaSatuanPremi').enable()
      this.form.get('hargaSatuanPremi').setValue(0)
      this.form.get('persenHargaSatuanPremi').disable()

    } else {
      this.form.get('hargaSatuanPremi').disable()
      this.form.get('persenHargaSatuanPremi').enable()
      this.form.get('hargaSatuanPremi').setValue(0)
    }
  }
  premiMax(value) {
    if (value != true) {
      this.form.get('totalHargaSatuanPremiMax').disable()
    } else {
      this.form.get('totalHargaSatuanPremiMax').enable()
    }
  }
  ngOnInit() {
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.saveToStorage("/master-sk/surat-keputusan");
    this.listKomponenGaji = [];
    this.formAktif = true;
    this.get(this.page, this.rows);
    this.form = this.fb.group({
      // 'reportDisplay': new FormControl('', Validators.required),
      'namaSK': new FormControl(''),
      'noSK': new FormControl('', Validators.required),
      'tglBerlakuSkDari': new FormControl({ value: '', disabled: true }),
      'tglBerlakuSkSampai': new FormControl({ value: '', disabled: true }),
      'kdRekananPenjamin': new FormControl('', Validators.required),
      'kdKomponenHarga': new FormControl('', Validators.required),
      'hargaSatuanPremi': new FormControl({ value: 0, disabled: false }),
      'persenHargaSatuanPremi': new FormControl({ value: 0, disabled: true }),
      'factorRate': new FormControl(1, Validators.required),
      'operatorFactorRate': new FormControl('x', Validators.required),
      'totalFactorRatePremi': new FormControl(1),
      'totalHargaSatuanPremiMax': new FormControl({ value: 0, disabled: true }),
      'tglMasukKerjaMin': new FormControl({ value: '', disabled: true }),
      'keteranganLainnya': new FormControl(''),
      // 'kodeExternal': new FormControl(''),
      // 'namaExternal': new FormControl(''),
      // 'kdDepartemen': new FormControl(''),
      'isByMonth': new FormControl(''),
      'isByYear': new FormControl(''),
      'statusEnabled': new FormControl(''),
      'persenHarga': new FormControl('harga'),
      'totalPremiMax': new FormControl(false)

    });
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Exel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExel();
        }
      }];

    this.getSmbrFile();

  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getKelompokTransaksi() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }
  // getKelompokTransaksi() {
  //   this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getKelompokTransaksi').subscribe(table => {
  //     let dataKelompokTransaksi = table.KelompokTransaksi;
  //     localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
  //     this.route.navigate(['surat-keputusan']);
  //   });
  // }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  ambilSK(sk) {
    if (this.form.get('namaSK').value == '' || this.form.get('namaSK').value == null || this.form.get('namaSK').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('tglBerlakuSkDari').setValue(null);
      this.form.get('tglBerlakuSkSampai').setValue(null);

    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('tglBerlakuSkDari').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.form.get('tglBerlakuSkSampai').setValue(null);
        } else {
          this.form.get('tglBerlakuSkSampai').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

        }
      });
    }
  }
  changeTgl(event) {
    if (event == true) {
      this.form.get('tglMasukKerjaMin').enable();
    } else {
      this.form.get('tglMasukKerjaMin').disable();
      this.form.get('tglMasukKerjaMin').setValue('');
    }
  }
  saveToStorage(path: string) {
    localStorage.setItem(path + ":masterSK", JSON.stringify([{ "id": 2, "nama": "nama" }]));
  }
  // filterSk(event) {
  //   this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getSK?noSK=' + event.query).subscribe(res => {
  //     this.dataSK = res.SK;
  //   });
  // }
  // pilihSK(event) {
  //   //this.form.get('namaSK').setValue(event.namaSK);
  //   this.form.get('noSK').setValue(event.noSK);
  //   this.form.get('tglBerlakuSkDari').setValue(new Date(event.tglBerlakuAwal * 1000));
  //   if (event.tglBerlakuAkhir == 0 || event.tglBerlakuAkhir == null) {
  //     this.form.get(null);
  //   } else {
  //     this.form.get('tglBerlakuSkSampai').setValue(new Date(event.tglBerlakuAkhir * 1000));
  //   }
  // }
  get(page: number, rows: number) {
    // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getSK').subscribe(res => {
    //   this.dataSK = res.SK;
    // });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.PegawaiSKAsuransi;
      this.totalRecords = table.totalRow;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getSK').subscribe(res => {
      this.namaSk = [];
      this.namaSk.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSk.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    },
      error => {
        this.namaSk = [];
        this.namaSk.push({ label: '-- ' + error + ' --', value: '' })

      });

    this.httpService.get(Configuration.get().dataHr2Mod1 + '/asuransiPegawaiService/findNamaAsuransi').subscribe(res => {
      this.rekananPenjamin = [];
      this.rekananPenjamin.push({ label: '-- Pilih Rekanan Penjamin --', value: '' })
      for (var i = 0; i < res.data.rekanan.length; i++) {
        this.rekananPenjamin.push({ label: res.data.rekanan[i].namaRekanan, value: res.data.rekanan[i].kdRekanan })
      };
    },
      error => {
        this.rekananPenjamin = [];
        this.rekananPenjamin.push({ label: '-- ' + error + ' --', value: '' })
      });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/getKomponen').subscribe(res => {
      this.komponenHarga = [];
      this.komponenHarga.push({ label: '--Pilih Komponen Harga--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.komponenHarga.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
      };
    },
      error => {
        this.komponenHarga = [];
        this.komponenHarga.push({ label: '-- ' + error + ' --', value: '' })

      });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Komponen&select=*&page=1&rows=300&criteria=kdJenisKomponen&values=6&condition=and&profile=y').subscribe(res => {
      this.kdKomponenGaji = [];
      this.kdKomponenGaji.push({ label: '--Pilih Komponen Gaji--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdKomponenGaji.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i] })
      };
    },
      error => {
        this.kdKomponenGaji = [];
        this.kdKomponenGaji.push({ label: '-- ' + error + ' --', value: '' })
      });
    this.operatorFactorRate = [];
    this.operatorFactorRate.push({ label: '--Pilih Operator--', value: '' })
    this.operatorFactorRate.push({ label: "+", value: "+" })
    this.operatorFactorRate.push({ label: "-", value: "-" })
    this.operatorFactorRate.push({ label: "x", value: "x" })
    this.operatorFactorRate.push({ label: "/", value: "/" })

  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&namaRekanan=' + this.pencarian).subscribe(table => {
      this.listData = table.PegawaiSKAsuransi;
      this.totalRecords = table.totalRow;
    });
  }
  downloadExel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkAsuransi&select=id.kode,namaMasterPegawaiSkAsuransi').subscribe(table => {
    //   this.fileService.exportAsExcelFile(table.data.data, 'MasterPegawaiSkAsuransi');
    // });

  }
  downloadPdf() {
    let cetak = Configuration.get().report + '/pegawaiSKAsuransi/laporanPegawaiSKAsuransi.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama MasterPegawaiSkAsuransi"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkAsuransi&select=id.kode,namaMasterPegawaiSkAsuransi').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master MasterPegawaiSkAsuransi", col, table.data.data, "MasterPegawaiSkAsuransi");

    // });

  }
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKAsuransi/laporanPegawaiSKAsuransi.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmMasterPegawaiSkAsuransi_laporanCetak');

  }
  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Asuransi');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskasuransi/delPegawaiSK/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdRekananPenjamin + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
    },
      error => {
        this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.reset();
      });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.form.get("kdRekananPenjamin").enable();
    this.form.get("kdKomponenHarga").enable();
    this.ngOnInit();
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
    console.log(this.listKomponenGaji);

    let dataSimpan;
    let dataKomponen = [];
    for (let i = 0; i < this.listKomponenGaji.length; i++) {
      dataKomponen.push({
        "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
        "kdKomponenHargaGaji": this.listKomponenGaji[i].komponen.id.kode,
        "kdRekananPenjamin": this.form.get('kdRekananPenjamin').value,
        "noRec": "",
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listKomponenGaji[i].statusEnabled,
        "version": 0
      })
    }
    let month
    let year
    if (this.form.get('isByMonth').value == 1) { month = 1 } else { month = 0 }
    if (this.form.get('isByYear').value == 1) { year = 1 } else { year = 0 }
    let totalHargaSatuanPremiMax = this.form.get('totalHargaSatuanPremiMax').value;
    if (totalHargaSatuanPremiMax == 0) {
      this.form.get('totalHargaSatuanPremiMax').setValue(2000000000000);
    }
    dataSimpan = {
      "factorRate": this.form.get('factorRate').value,
      "hargaSatuanPremi": this.form.get('hargaSatuanPremi').value,
      "isByMonth": month,
      "isByYear": year,
      "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
      "kdRekananPenjamin": this.form.get('kdRekananPenjamin').value,
      "keteranganLainnya": this.form.get('keteranganLainnya').value,
      "noRec": "",
      "noSK": this.form.get('noSK').value,
      "operatorFactorRate": this.form.get('operatorFactorRate').value,
      "persenHargaSatuanPremi": this.form.get('persenHargaSatuanPremi').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "tglMasukKerjaMin": this.setTimeStamp(this.form.get('tglMasukKerjaMin').value),
      "totalFactorRatePremi": this.form.get('totalFactorRatePremi').value,
      "totalHargaSatuanPremiMax": this.form.get('totalHargaSatuanPremiMax').value,
      "version": 0,
      "pegawaiSKAsuransiK": dataKomponen
    }
    console.log(dataSimpan);

    this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiskasuransi/update/' + this.versi, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let dataSimpan;
      let dataKomponen = [];
      for (let i = 0; i < this.listKomponenGaji.length; i++) {
        dataKomponen.push({
          "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
          "kdKomponenHargaGaji": this.listKomponenGaji[i].komponen.id.kode,
          "kdRekananPenjamin": this.form.get('kdRekananPenjamin').value,
          "noRec": "",
          "noSK": this.form.get('noSK').value,
          "statusEnabled": this.listKomponenGaji[i].statusEnabled,
          "version": 0
        })
      }
      let month
      let year
      if (this.form.get('isByMonth').value == 1) { month = 1 } else { month = 0 }
      if (this.form.get('isByYear').value == 1) { year = 1 } else { year = 0 }
      let totalHargaSatuanPremiMax = this.form.get('totalHargaSatuanPremiMax').value;
      if (totalHargaSatuanPremiMax == 0) {
        this.form.get('totalHargaSatuanPremiMax').setValue(2000000000000);
      }
      dataSimpan = {
        "factorRate": this.form.get('factorRate').value,
        "hargaSatuanPremi": this.form.get('hargaSatuanPremi').value,
        "isByMonth": month,
        "isByYear": year,
        "kdKomponenHarga": this.form.get('kdKomponenHarga').value,
        "kdRekananPenjamin": this.form.get('kdRekananPenjamin').value,
        "keteranganLainnya": this.form.get('keteranganLainnya').value,
        "noRec": "",
        "noSK": this.form.get('noSK').value,
        "operatorFactorRate": this.form.get('operatorFactorRate').value,
        "persenHargaSatuanPremi": this.form.get('persenHargaSatuanPremi').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "tglMasukKerjaMin": this.setTimeStamp(this.form.get('tglMasukKerjaMin').value),
        "totalFactorRatePremi": this.form.get('totalFactorRatePremi').value,
        "totalHargaSatuanPremiMax": this.form.get('totalHargaSatuanPremiMax').value,
        "version": 0,
        "pegawaiSKAsuransiK": dataKomponen
      }
      console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskasuransi/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.reset();
      });
    }

  }
  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }
  tambahKomponen() {
    let dataTemp = {
      "komponen": {
        "kdKomponenHarga": "",
        "namaKomponen": "--Pilih Komponen Gaji--",
      },
      "statusEnabled": true,
      "noSK": null,

    }
    let listKomponenGaji = [...this.listKomponenGaji];
    listKomponenGaji.push(dataTemp);
    this.listKomponenGaji = listKomponenGaji;
  }
  hapusRow(row) {
    let listKomponenGaji = [...this.listKomponenGaji];
    listKomponenGaji.splice(row, 1);
    this.listKomponenGaji = listKomponenGaji;
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
  valuechange(newvalue) {
    this.report = newvalue;
  }
  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }
  getKomponen(dataPeg) {
    console.log(dataPeg);
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskasuransi/findByKomponen/' + dataPeg.data.noSK + '/' + dataPeg.data.kdRekananPenjamin + '/' + dataPeg.data.kdKomponenHarga + '').subscribe(table => {
      let komponen = table.komponen;

      // this.listKomponenGaji = komponen;
      this.listKomponenGaji = [];
      console.log(komponen);
      let dataFix
      for (let i = 0; i < komponen.length; i++) {
        dataFix = {
          "komponen": {
            "id": { "kode": table.komponen[i].kdKomponenHargaGaji },
            "namaKomponen": table.komponen[i].namaKomponen,
            "noSK": komponen[i].kode.noSK,
          },
          "statusEnabled": table.komponen[i].statusEnabled,
          "noSK": komponen[i].kode.noSK,
        }
        this.listKomponenGaji.push(dataFix);
      }
      console.log(this.listKomponenGaji);
    });
  }
  onRowSelect(event) {
    this.formAktif = false;
    this.versi = event.data.version;
    let data = event.data;
    if (data.hargaSatuanPremi == 0) {
      data.persenHarga = 'persen'
    } else {
      data.persenHarga = 'harga'
    }
    if (data.totalHargaSatuanPremiMax == 2000000000000) {
      data.totalHargaSatuanPremiMax = 0;
      data.totalPremiMax = false;
      this.premiMax(false);
    } else {
      data.totalPremiMax = true;
      this.premiMax(true);
    }
    // let cloned = this.clone(data);
    // this.form.setValue(cloned);

    this.getKomponen(event);
    this.setpersenHargaSatuan();
    // console.log(event);
    this.form.get("kdRekananPenjamin").disable();
    this.form.get("kdKomponenHarga").disable();

    this.form.get("noSK").setValue(event.data.noSK);
    this.form.get("namaSK").setValue(event.data.noSK);
    this.form.get("kdRekananPenjamin").setValue(event.data.kdRekananPenjamin);
    this.form.get("kdKomponenHarga").setValue(event.data.kdKomponenHarga);
    this.form.get("hargaSatuanPremi").setValue(event.data.hargaSatuanPremi);
    this.form.get("persenHargaSatuanPremi").setValue(event.data.persenHargaSatuanPremi);
    this.form.get("factorRate").setValue(event.data.factorRate);
    this.form.get("operatorFactorRate").setValue(event.data.operatorFactorRate);
    this.form.get("totalFactorRatePremi").setValue(event.data.totalFactorRatePremi);
    this.form.get("totalHargaSatuanPremiMax").setValue(event.data.totalHargaSatuanPremiMax);
    this.form.get("keteranganLainnya").setValue(event.data.keteranganLainnya);
    this.form.get("isByMonth").setValue(event.data.isByMonth);
    this.form.get("isByYear").setValue(event.data.isByYear);
    this.form.get("statusEnabled").setValue(event.data.statusEnabled);
    this.form.get("persenHarga").setValue(event.data.persenHarga);
    this.form.get("totalPremiMax").setValue(event.data.totalPremiMax);
    this.form.get("tglBerlakuSkDari").setValue(new Date(event.data.tglBerlakuAwal * 1000));

    if (event.data.tglBerlakuAkhir == null || event.data.tglBerlakuAkhir == undefined) {
      this.form.get('tglBerlakuSkSampai').setValue(null);
    } else {
      this.form.get('tglBerlakuSkSampai').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

    }
    if (event.data.tglMasukKerjaMin == null || event.data.tglMasukKerjaMin == undefined) {
      this.form.get('tglMasukKerjaMin').setValue(null);
    } else {
      this.form.get('tglMasukKerjaMin').setValue(new Date(event.data.tglMasukKerjaMin * 1000));

    }

  }


}
class InisialMasterPegawaiSkAsuransi implements MasterPegawaiSkAsuransi {
  constructor(
    public noSK?,
    public namaSK?,
    public tglBerlakuSkDari?,
    public tglBerlakuSkSampai?,
    public kdRekananPenjamin?,
    public kdKomponenHarga?,
    public persenHargaSatuanPremi?,
    public factorRate?,
    public hargaSatuanPremi?,
    public operatorFactorRate?,
    public totalFactorRatePremi?,
    public totalHargaSatuanPremiMax?,
    public tglMasukKerjaMin?,
    public keteranganLainnya?,
    public isByMonth?,
    public isByYear?,
    public statusEnabled?,
    public tglBerlakuAwal?,
    public tglBerlakuAkhir?,
    public version?,
    public persenHarga?,
    public totalPremiMax?
  ) { }
}

