import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/primeng';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkLoan } from './pegawaiskloan.interface';
import { Validators, FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, TooltipModule } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pegawai-sk-loan',
  templateUrl: './pegawaiskloan.component.html',
  styleUrls: ['./pegawaiskloan.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSKLoanComponent implements OnInit {

  item: PegawaiSkLoan = new InisialPegawaiSkLoan();;
  selected: PegawaiSkLoan;
  listData: PegawaiSkLoan[];
  listKomponenGaji: any[];
  komponenGajiData: any;
  komponenGaji: any;
  kodeKategoryPegawai: PegawaiSkLoan[];
  kodeRangeMasaKerja: PegawaiSkLoan[];
  kodeProdukLoan: PegawaiSkLoan[];
  kodeCaraBayar: PegawaiSkLoan[];
  kodeJenisBunga: PegawaiSkLoan[];
  kodeJenisSukuBunga: PegawaiSkLoan[];
  kodeRange: PegawaiSkLoan[];
  kodeRangeWaktu: PegawaiSkLoan[];
  kodeKomponenGaji: PegawaiSkLoan[];
  kodeMetodePembayaran: PegawaiSkLoan[];
  kodeMetodeHitungBunga: PegawaiSkLoan[];
  kodeOperatorFactorRate: PegawaiSkLoan[];
  datakomponenBiaya: PegawaiSkLoan[];
  jenisDokumen: PegawaiSkLoan[];
  kategoryDokumen: PegawaiSkLoan[];


  pencarian: string = '';
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  form2: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  resFile: string;
  namaFile: string;
  maxQtyCicilan: number;
  komponenBiaya: any;
  cekKomponenBiaya: boolean;
  btnKomponenBiaya: boolean;
  listDataKomponenBiaya: any[];
  biayaLainnya: any;
  cekBiayaLainnya: any;
  btnBiayaLainnya: any;
  listDataBiayaLainnya: any[];
  dokumen: any;
  cekDokumen: any;
  btnDokumen: any;
  listDataDokumen: any[];
  tipePinjaman: PegawaiSkLoan[];
  dataSK: any[];
  statusAdded: PegawaiSkLoan[];
  tipeBiayaLainnya: any[];
  statusKomponen: any;
  statusBiaya: any;
  statusDokumen: any;
  type: any;
  dataEditHarga: boolean;
  dataEditPersen: boolean
  selectedRange: any[];
  selectedKategori: any[];
  namaSK: any[];
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  smbrFile:any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
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

  ngOnInit() {
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
    this.type = 'Nominal';
    this.dataEditHarga = true;
    this.dataEditPersen = true;
    // this.versi = null;
    this.listKomponenGaji = [];
    this.formAktif = true;
    this.cekKomponenBiaya = true;
    this.cekBiayaLainnya = true;
    this.cekDokumen = true;
    this.btnKomponenBiaya = true;
    this.btnBiayaLainnya = true;
    this.btnDokumen = true;
    this.get(this.page, this.rows);
    this.form = this.fb.group({
      'noSK': new FormControl(''),
      'noSkIntern': new FormControl(''),
      'namaSuratKeputusan': new FormControl('', Validators.required),
      'tglBerlakuAwal': new FormControl(''),
      'tglBerlakuAkhir': new FormControl(''),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'kdRangeMasaKerja': new FormControl('', Validators.required),
      'kdProdukLoan': new FormControl('', Validators.required),
      'maxTotalLoan': new FormControl(''),
      'factorRateMaxTotalLoan': new FormControl(''),
      'maxTotalCicilan': new FormControl(''),
      'kdCaraBayar': new FormControl('', Validators.required),
      'kdJenisBunga': new FormControl(''),
      'kdJenisSukuBunga': new FormControl(''),
      'kdMetodeHitungBunga': new FormControl(''),
      'kdMetodePembayaran': new FormControl(''),
      'maxQtyCicilan': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
      'factorRateMaxTotalCicilanKomponenGaji': new FormControl(),
      'pegawaiSKLoan': new FormControl(),
      'pegawaiSKLoanDetail': new FormControl(),
      'pegawaiSKLoanProduk': new FormControl(),
      'pegawaiSKLoanGaransi': new FormControl(),
      'statusKomponenBiaya': new FormControl(),
      'statusBiaya': new FormControl(),
      'statusDokumen': new FormControl()
    });
    this.form2 = this.fb.group({
      'kdKomponenGaji': new FormControl({ value: '', disabled: true }),
      'komponenGaji': new FormControl(false, Validators.required),
      'factorRateMaxTotalLoanKomponenGaji': new FormControl({ value: '', disabled: true }),
      'factorRateMaxTotalCicilanKomponenGaji': new FormControl({ value: '', disabled: true }),
    });
    this.form.get('tglBerlakuAwal').disable();
    this.form.get('tglBerlakuAkhir').disable();
    this.listDataKomponenBiaya = [];
    this.listDataBiayaLainnya = [];
    this.listDataDokumen = [];
    this.statusAdded = [];
    this.statusAdded.push(
      { label: 'Dipotong', value: { id: null, nama: 'Dipotong' } },
      { label: 'Ditambahkan', value: { id: 1, nama: 'Ditambahkan' } },
      { label: 'Dibayar', value: { id: 0, nama: 'Dibayar' } }
      )

    this.getSmbrFile();

  }

  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
     this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }

  dis() {
    this.form2 = this.fb.group({
      'kdKomponenGaji': new FormControl({ value: '', disabled: true }),
      'komponenGaji': new FormControl(false, Validators.required),
      'factorRateMaxTotalLoanKomponenGaji': new FormControl({ value: '', disabled: true }),
      'factorRateMaxTotalCicilanKomponenGaji': new FormControl({ value: '', disabled: true }),
    });
  }
  getKomponenBiaya(event) {
    if (event) {
      this.cekKomponenBiaya = false;
      this.btnKomponenBiaya = false;
    } else {
      this.cekKomponenBiaya = true;
      this.btnKomponenBiaya = true;
      if (this.listDataKomponenBiaya.length > 0) {
        return this.listDataKomponenBiaya = [];
      }
    }
  }
  getBiayaLainnya(event) {
    if (event) {
      this.cekBiayaLainnya = false;
      this.btnBiayaLainnya = false;
    } else {
      this.cekBiayaLainnya = true;
      this.btnBiayaLainnya = true;
      if (this.listDataBiayaLainnya.length > 0) {
        return this.listDataBiayaLainnya = [];
      }
    }
  }

  getDokumen(event) {
    if (event) {
      this.cekDokumen = false;
      this.btnDokumen = false;
    } else {
      this.cekDokumen = true;
      this.btnDokumen = true;
      if (this.listDataDokumen.length > 0) {
        return this.listDataDokumen = [];
      }
    }
  }
  valueRadio(value) {
    this.type = value;
    if (value == "Perkalian") {
      this.cekKomponenBiaya = false;
      this.btnKomponenBiaya = false;
      this.form.get('maxTotalLoan').setValue(0);
      this.form.get('maxTotalCicilan').setValue(0);
    } else {
      this.cekKomponenBiaya = true;
      this.btnKomponenBiaya = true;
      this.form.get('factorRateMaxTotalCicilanKomponenGaji').setValue(0);
      this.form.get('factorRateMaxTotalLoan').setValue(0);
      if (this.listDataKomponenBiaya.length > 0) {
        return this.listDataKomponenBiaya = [];
      }
    }
  }
  valueKategoriPegawai(value) {
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findKomponenGaji?kdKategoryPegawai=' + value).subscribe(res => {
      this.datakomponenBiaya = [];
      this.datakomponenBiaya.push({ label: '--Pilih Komponen Biaya--', value: null })
      for (var i = 0; i < res.result.length; i++) {
        this.datakomponenBiaya.push({ label: res.result[i].namaKomponen, value: res.result[i] })
      };

    });
  }
  getKelompokTransaksi() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskloan/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }


  get(page: number, rows: number) {
    // this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findSKLoan?namaSK=').subscribe(res => {
    //   this.dataSK = res.result;
    // });
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.pegawaiSKLoan;
      this.totalRecords = table.pegawaiSKLoan.totalRow;
    });

    //dropdown
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KategoryPegawai&select=id.kode,%20namaKategoryPegawai&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      console.log(res.data.data);
      this.kodeKategoryPegawai = [];
      this.kodeKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode })
      };
      // this.selectedKategori = this.kodeKategoryPegawai;
    });

    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/getRangeMasaKerjaLoan').subscribe(res => {
      this.kodeRangeMasaKerja = [];
      // this.kodeRangeMasaKerja.push({ label: '--Pilih Range Masa Kerja--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.kodeRangeMasaKerja.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
      };
      this.selectedRange = this.kodeRangeMasaKerja;

    });

    /*this.httpService.get(Configuration.get().dataMaster + '/pegawaiSKLoan/findProdukLoan' + '?kode=4').subscribe(res => {
      this.kodeProdukLoan = [];
      this.kodeProdukLoan.push({ label: '--Pilih Produk Loan--', value: '' })
      for (var i = 0; i < res.data.result.length; i++) {
        this.kodeProdukLoan.push({ label: res.data.result[i].namaProduk, value: res.data.result[i].kode })
      };
    });
    */
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=CaraBayar&select=id.kode,%20namaCaraBayar&page=1&rows=300&criteria=id.kode&values=7&condition=and&profile=y').subscribe(res => {
      this.kodeCaraBayar = [];
      //this.kodeCaraBayar.push({ label: '--Pilih Cara Bayar--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeCaraBayar.push({ label: res.data.data[i].namaCaraBayar, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisBunga&select=id.kode,%20namaJenisBunga&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeJenisBunga = [];
      this.kodeJenisBunga.push({ label: '--Pilih Jenis Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisBunga.push({ label: res.data.data[i].namaJenisBunga, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisSukuBunga&select=id.kode,%20namaJenisSukuBunga&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeJenisSukuBunga = [];
      this.kodeJenisSukuBunga.push({ label: '--Pilih Jenis Suku Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisSukuBunga.push({ label: res.data.data[i].namaJenisSukuBunga, value: res.data.data[i].id_kode })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/getMetodePembayaran').subscribe(res => {
      this.kodeMetodePembayaran = [];
      this.kodeMetodePembayaran.push({ label: '--Pilih Metode Pembayaran--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.kodeMetodePembayaran.push({ label: res.data[i].namaMetodePembayaran, value: res.data[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=MetodePerhitungan&select=id.kode,%20namaMetodeHitung&page=1&rows=300&criteria=kdMetodeHitungHead&values=1&condition=and&profile=y').subscribe(res => {
      this.kodeMetodeHitungBunga = [];
      this.kodeMetodeHitungBunga.push({ label: '--Pilih Metode Hitung Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeMetodeHitungBunga.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id_kode })
      };

    });
    /*this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Type&select=id.kode,%20namaType&page=1&rows=300&profile=1').subscribe(res => {
      this.tipePinjaman = [];
      this.tipePinjaman.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.tipePinjaman.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id_kode })
      };

    });*/
    /*this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Komponen&select=id.kode,%20namaKomponen&page=1&rows=300&criteria=kdJenisKomponen&values=6&condition=and&profile=y').subscribe(res => {
      this.datakomponenBiaya = [];
      this.datakomponenBiaya.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.datakomponenBiaya.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i] })
      };

    });*/

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KategoryDokumen&select=id.kode,%20namaKategoryDokumen&page=1&rows=300&criteria=id.kode&values=2&condition=and&profile=y').subscribe(res => {
      this.kategoryDokumen = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.kategoryDokumen.push({ label: res.data.data[i].namaKategoryDokumen, value: res.data.data[i] })
      };
      console.log(this.kategoryDokumen);

    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisDokumen&select=id.kode,%20namaJenisDokumen&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jenisDokumen = [];
      this.jenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jenisDokumen.push({ label: res.data.data[i].namaJenisDokumen, value: res.data.data[i] })
      };

    });

    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findProduk?kdJenisProduk=04').subscribe(res => {
      this.tipePinjaman = [];
      this.tipePinjaman.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.result.length; i++) {
        this.tipePinjaman.push({ label: res.result[i].namaProduk, value: res.result[i].kode })
      };
      //console.log(this.tipePinjaman);

    });
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findProduk?kdJenisProduk=11').subscribe(res => {
      this.tipeBiayaLainnya = [];
      this.tipeBiayaLainnya.push({ label: '--Pilih Biaya Lainnya--', value: '' })
      for (var i = 0; i < res.result.length; i++) {
        this.tipeBiayaLainnya.push({ label: res.result[i].namaProduk, value: res.result[i] })
      };
      //console.log(this.tipePinjaman);

    });

    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskloan/findSKLoan').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.result.length; i++) {
        this.namaSK.push({ label: res.result[i].namaSK, value: res.result[i].namaSK })
      };
    });

    this.kodeOperatorFactorRate = [];
    this.kodeOperatorFactorRate.push({ label: '--Pilih Operator Factor Rate--', value: '' });
    this.kodeOperatorFactorRate.push({ label: "+", value: '+' });
    this.kodeOperatorFactorRate.push({ label: "-", value: '-' });
    this.kodeOperatorFactorRate.push({ label: "X", value: 'X' });
    this.kodeOperatorFactorRate.push({ label: "/", value: '/' });

  }
  ambilSK(sk) {
    if (this.form.get('namaSuratKeputusan').value == '' || this.form.get('namaSuratKeputusan').value == null || this.form.get('namaSuratKeputusan').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('noSkIntern').setValue(null);
      this.form.get('tglBerlakuAwal').setValue(null);
      this.form.get('tglBerlakuAkhir').setValue(null);
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskloan/findSKLoan?namaSK=' + sk.value).subscribe(table => {
        let detailSK = table.result;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('noSkIntern').setValue(detailSK[0].noSKIntern);
        this.form.get('tglBerlakuAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.form.get('tglBerlakuAkhir').setValue(null);

        } else {

          this.form.get('tglBerlakuAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
        }
      });
    }
  }
  // pilihSK(event) {
  //   this.form.get('namaSK').setValue(event.namaSK);
  //   this.form.get('noSK').setValue(event.noSK);
  //   this.form.get('tglBerlakuAwal').setValue(new Date(event.tglBerlakuAwal * 1000));
  //   if (event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
  //     this.form.get('tglBerlakuAkhir').setValue(new Date(event.tglBerlakuAkhir * 1000));
  //   }
  // }
  // filterSk(event) {
  //   this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findSKLoan?namaSK=' + event.query).subscribe(res => {
  //     this.dataSK = res.result;
  //   });
  // }
  getMaxTotalCicilan(value) {
    let totalPinjaman = this.form.get('maxTotalLoan').value;
    let maxQtyCicilan = parseInt(totalPinjaman) / parseInt(value);
    this.maxQtyCicilan = maxQtyCicilan;
    if (isNaN(this.maxQtyCicilan)) {
      this.maxQtyCicilan = 0;
      this.form.get('maxQtyCicilan').setValue(this.maxQtyCicilan);
    } else {
      this.form.get('maxQtyCicilan').setValue(this.maxQtyCicilan);
    }

  }
  getQtyCicilan(value) {
    if (this.form.get('maxTotalLoan').value == null || this.form.get('maxTotalCicilan').value == null) {
      this.alertService.warn("Peringatan", "Isi Total Pinjaman dan Total Cicilan");
      this.form.get('maxQtyCicilan').setValue(0);
    }
  }
  getPersen(row) {
    let data = [... this.listDataBiayaLainnya];
    if (data[row].persenHargaSatuan != null) {
      this.dataEditHarga = false;
    }
  }
  getHarga(row) {
    let akunBank = [... this.listDataBiayaLainnya];
    if (akunBank[row].hargaSatuan != null) {
      this.dataEditPersen = false;
    }

  }
  setHarga(value) {
    if (value != null) {
      return parseInt(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskloan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&namaProduk=' + this.pencarian).subscribe(table => {
      this.listData = table.pegawaiSKLoan;
      this.totalRecords = table.data.totalRow;
    });
  }
  tambahDataKomponenBiaya() {
    let dataKomponenBiaya = {
      "noSK": null,
      "komponenBiaya": { id: '-', namaKomponen: "--Pilih Komponen Biaya--" },
      "factorRateMaxTotalLoan": null,
      "factorRateMaxTotalCicilan": null
    }
    let komponenBiaya = [... this.listDataKomponenBiaya];
    komponenBiaya.push(dataKomponenBiaya);
    this.listDataKomponenBiaya = komponenBiaya;
    // for (var i = 0; i < this.listDataKomponenBiaya.length; ++i) {
    //   this.listDataKomponenBiaya[i].factorRateMaxTotalLoan = this.form.get('factorRateMaxTotalLoan').value;
    //   this.listDataKomponenBiaya[i].factorRateMaxTotalCicilan = this.form.get('factorRateMaxTotalCicilanKomponenGaji').value;
    // }
  }
  hapusRowDataKomponenBiaya(row) {
    this.listDataKomponenBiaya = this.listDataKomponenBiaya.filter((val, i) => i != row);
  }
  tambahDataBiayaLainnya() {
    let dataBiayaLainnya = {
      "noSK": null,
      "biayaLainnya": { id: '-', namaProduk: "--Pilih Biaya Lainnya--" },
      "hargaSatuan": null,
      "persenHargaSatuan": null,
      "persenDiscount": null,
      "qtyProduk": null,
      "factorRate": "1",
      "operatorFactorRate": "X",
      "status": { nama: '--Pilih Status--' }
    }
    let biayaLainnya = [... this.listDataBiayaLainnya];
    biayaLainnya.push(dataBiayaLainnya);
    this.listDataBiayaLainnya = biayaLainnya;
  }
  hapusRowDataBiayaLainnya(row) {
    this.listDataBiayaLainnya = this.listDataBiayaLainnya.filter((val, i) => i != row);
  }
  getTotalLoan(data) {
    let rateTotalLoan = this.form.get('factorRateMaxTotalLoan').value;
    if (data.factorRateMaxTotalLoan !== rateTotalLoan) {
      this.form.get('factorRateMaxTotalLoan').setValue(null);
      this.form.get('factorRateMaxTotalLoan').disable();
    }
  }
  getTotalCicilan(data) {
    let rateTotalCicilan = this.form.get('factorRateMaxTotalCicilanKomponenGaji').value;
    if (data.factorRateMaxTotalCicilan !== rateTotalCicilan) {
      this.form.get('factorRateMaxTotalCicilanKomponenGaji').setValue(null);
      this.form.get('factorRateMaxTotalCicilanKomponenGaji').disable();
    }
  }
  tambahDataDokumen() {
    let dataDokumen = {
      "noSK": null,
      "kategoryDokumen": this.kategoryDokumen[0].value,
      "jenisDokumen": { id: '-', namaJenisDokumen: '--Pilih Jenis Dokumen--' },
      "judulDokumen": "",
      "status": null
    }
    let dokumen = [... this.listDataDokumen];
    dokumen.push(dataDokumen);
    this.listDataDokumen = dokumen;
  }
  hapusRowDataDokumen(row) {
    this.listDataDokumen = this.listDataDokumen.filter((val, i) => i != row);
  }
  kdKomponen(kode) {
    console.log(kode);
  }
  ConvertToInt(val) {
    return parseInt(val);
  }
  changeKomponenGaji(event) {
    if (event == true) {
      this.form2.get('kdKomponenGaji').enable();
      this.form2.get('factorRateMaxTotalCicilanKomponenGaji').enable();
      this.form2.get('factorRateMaxTotalLoanKomponenGaji').enable();

    } else {

      this.form2.get('kdKomponenGaji').disable();
      this.form2.get('factorRateMaxTotalCicilanKomponenGaji').disable();
      this.form2.get('factorRateMaxTotalLoanKomponenGaji').disable();
      this.form2.get('kdKomponenGaji').setValue('');
      this.form2.get('factorRateMaxTotalCicilanKomponenGaji').setValue('');
      this.form2.get('factorRateMaxTotalLoanKomponenGaji').setValue('');


    }
  }

  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Loan');
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

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
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

  onSubmitKomponen() {
    if (this.form2.invalid) {
      this.validateAllFormFields(this.form2);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.addSementara();
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
    let datapegawaiSKLoan = {
      "factorRateMaxTotalCicilan": this.form.get('factorRateMaxTotalCicilanKomponenGaji').value,
      "factorRateMaxTotalLoan": this.form.get('factorRateMaxTotalLoan').value,
      "kdCaraBayar": this.form.get('kdCaraBayar').value,
      "kdJenisBunga": this.form.get('kdJenisBunga').value,
      "kdJenisSukuBunga": this.form.get('kdJenisSukuBunga').value,
      "kdKategoryPegawai": this.selectedKategori[0],
      "kdMetodeHitungBunga": this.form.get('kdMetodeHitungBunga').value,
      "kdMetodePembayaran": this.form.get('kdMetodePembayaran').value,
      "kdProdukLoan": this.form.get('kdProdukLoan').value,
      "kdRangeMasaKerja": this.selectedRange[0].value,
      "keteranganLainnya": "string",
      "maxQtyCicilan": this.form.get('maxQtyCicilan').value,
      "maxTotalCicilan": this.form.get('maxTotalCicilan').value,
      "maxTotalLoan": this.form.get('maxTotalLoan').value,
      "noSK": this.form.get('noSK').value,
      "statusEnabled": this.form.get('statusEnabled').value
    }
    this.form.get('pegawaiSKLoan').setValue(datapegawaiSKLoan);
    let dataKomponenBiaya = [];
    for (var i = 0; i < this.listDataKomponenBiaya.length; ++i) {
      let data = {
        "factorRateMaxTotalCicilan": this.listDataKomponenBiaya[i].factorRateMaxTotalCicilan,
        "factorRateMaxTotalLoan": this.listDataKomponenBiaya[i].factorRateMaxTotalLoan,
        "kdCaraBayar": this.form.get('kdCaraBayar').value,
        "kdJenisBunga": this.form.get('kdJenisBunga').value,
        "kdJenisSukuBunga": this.form.get('kdJenisSukuBunga').value,
        "kdKategoryPegawai": this.selectedKategori[0],
        "kdKomponenHarga": this.listDataKomponenBiaya[i].komponenBiaya.id_kode,
        "kdMetodeHitungBunga": this.form.get('kdMetodeHitungBunga').value,
        "kdMetodePembayaran": this.form.get('kdMetodePembayaran').value,
        "kdProdukLoan": this.form.get('kdProdukLoan').value,
        "kdRangeMasaKerja": this.selectedRange[0].value,
        "keteranganLainnya": "string",
        "maxQtyCicilan": this.form.get('maxQtyCicilan').value,
        "maxTotalCicilan": this.form.get('maxTotalCicilan').value,
        "maxTotalLoan": this.form.get('maxTotalLoan').value,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listDataKomponenBiaya[i].statusEnabled
      }
      dataKomponenBiaya.push(data);
    }
    this.form.get('pegawaiSKLoanDetail').setValue(dataKomponenBiaya);
    let dataBiayaLainnya = [];
    for (var i = 0; i < this.listDataBiayaLainnya.length; ++i) {
      let data = {
        "factorRate": this.listDataBiayaLainnya[i].factorRate,
        "hargaSatuan": this.listDataBiayaLainnya[i].hargaSatuan,
        "isCanAddedToTotalLoan": this.listDataBiayaLainnya[i].status.id,
        "kdKategoryPegawai": this.selectedKategori[0],
        "kdProduk": this.listDataBiayaLainnya[i].biayaLainnya.kode,
        "kdProdukLoan": this.form.get('kdProdukLoan').value,
        "kdRangeMasaKerja": this.selectedRange[0].value,
        "keteranganLainnya": "string",
        "noSK": this.form.get('noSK').value,
        "operatorFactorRate": this.listDataBiayaLainnya[i].operatorFactorRate,
        "persenDiscount": this.listDataBiayaLainnya[i].persenDiscount,
        "persenHargaSatuan": this.listDataBiayaLainnya[i].persenHargaSatuan,
        "qtyProduk": this.listDataBiayaLainnya[i].qtyProduk,
        "statusEnabled": this.listDataBiayaLainnya[i].statusEnabled
      }
      dataBiayaLainnya.push(data);
    }
    this.form.get('pegawaiSKLoanProduk').setValue(dataBiayaLainnya);
    let dataGaransi = [];
    for (var i = 0; i < this.listDataDokumen.length; ++i) {
      let data = {
        "kdDokumen": this.listDataDokumen[i].kdDokumen,
        "kdJenisDokumen": this.listDataDokumen[i].jenisDokumen.id_kode,
        "kdKategoryDokumen": this.listDataDokumen[i].kategoryDokumen.id_kode,
        "kdKategoryPegawai": this.selectedKategori[0],
        "kdProdukLoan": this.form.get('kdProdukLoan').value,
        "kdRangeMasaKerja": this.selectedRange[0].value,
        "namaDokumen": this.listDataDokumen[i].judulDokumen,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listDataDokumen[i].statusEnabled
      }
      dataGaransi.push(data);
    }
    console.log(dataGaransi);
    this.form.get('pegawaiSKLoanGaransi').setValue(dataGaransi);

    let update = {
      "pegawaiSKLoan": this.form.get('pegawaiSKLoan').value,
      "pegawaiSKLoanDetail": this.form.get('pegawaiSKLoanDetail').value,
      "pegawaiSKLoanGaransi": this.form.get('pegawaiSKLoanGaransi').value,
      "pegawaiSKLoanProduk": this.form.get('pegawaiSKLoanProduk').value,
    }
    this.httpService.update(Configuration.get().dataMaster + '/pegawaiskloan/update', update).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      //this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  addSementara() {
    let listKomponenGaji = [...this.listKomponenGaji];
    this.komponenGaji = {
      "kdKomponenGaji": this.form2.get('kdKomponenGaji').value.kode,
      "namaKomponenGaji": this.form2.get('kdKomponenGaji').value.namaKomponen,
      "factorRateMaxTotalLoanKomponenGaji": this.form2.get('factorRateMaxTotalLoanKomponenGaji').value,
      "factorRateMaxTotalCicilanKomponenGaji": this.form2.get('factorRateMaxTotalCicilanKomponenGaji').value,
    }
    listKomponenGaji.push(this.komponenGaji);
    this.listKomponenGaji = listKomponenGaji;
    console.log(this.listKomponenGaji);
  }
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let range = [];
      let kategoriPegawai = [];
      for (let i = 0; i < this.selectedRange.length; i++) {
        range.push({
          "kode": this.selectedRange[i].value,
        })
      }
      for (let i = 0; i < this.selectedKategori.length; i++) {
        kategoriPegawai.push({
          "kode": this.selectedKategori[i],
        })
      }
      let datapegawaiSKLoan = {
        "factorRateMaxTotalCicilan": this.form.get('factorRateMaxTotalCicilanKomponenGaji').value,
        "factorRateMaxTotalLoan": this.form.get('factorRateMaxTotalLoan').value,
        "kdCaraBayar": this.form.get('kdCaraBayar').value,
        "kdJenisBunga": this.form.get('kdJenisBunga').value,
        "kdJenisSukuBunga": this.form.get('kdJenisSukuBunga').value,
        "kategoryPegawai": kategoriPegawai,
        "kdMetodeHitungBunga": this.form.get('kdMetodeHitungBunga').value,
        "kdMetodePembayaran": this.form.get('kdMetodePembayaran').value,
        "kdProdukLoan": this.form.get('kdProdukLoan').value,
        "rangeMasaKerja": range,
        "keteranganLainnya": "string",
        "maxQtyCicilan": this.form.get('maxQtyCicilan').value,
        "maxTotalCicilan": this.form.get('maxTotalCicilan').value,
        "maxTotalLoan": this.form.get('maxTotalLoan').value,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.form.get('statusEnabled').value
      }
      this.form.get('pegawaiSKLoan').setValue(datapegawaiSKLoan);
      let dataKomponenBiaya = [];
      for (var i = 0; i < this.listDataKomponenBiaya.length; ++i) {
        let data = {
          "factorRateMaxTotalCicilan": this.listDataKomponenBiaya[i].factorRateMaxTotalCicilan,
          "factorRateMaxTotalLoan": this.listDataKomponenBiaya[i].factorRateMaxTotalLoan,
          "kdCaraBayar": this.form.get('kdCaraBayar').value,
          "kdJenisBunga": this.form.get('kdJenisBunga').value,
          "kdJenisSukuBunga": this.form.get('kdJenisSukuBunga').value,
          "kategoryPegawai": kategoriPegawai,
          "kdKomponenHarga": this.listDataKomponenBiaya[i].komponenBiaya.kode,
          "kdMetodeHitungBunga": this.form.get('kdMetodeHitungBunga').value,
          "kdMetodePembayaran": this.form.get('kdMetodePembayaran').value,
          "kdProdukLoan": this.form.get('kdProdukLoan').value,
          "rangeMasaKerja": range,
          "keteranganLainnya": "string",
          "maxQtyCicilan": this.form.get('maxQtyCicilan').value,
          "maxTotalCicilan": this.form.get('maxTotalCicilan').value,
          "maxTotalLoan": this.form.get('maxTotalLoan').value,
          "noSK": this.form.get('noSK').value,
          "statusEnabled": this.listDataKomponenBiaya[i].statusEnabled
        }
        dataKomponenBiaya.push(data);
      }
      this.form.get('pegawaiSKLoanDetail').setValue(dataKomponenBiaya);
      let dataBiayaLainnya = [];
      for (var i = 0; i < this.listDataBiayaLainnya.length; ++i) {
        let data = {
          "factorRate": this.listDataBiayaLainnya[i].factorRate,
          "hargaSatuan": this.listDataBiayaLainnya[i].hargaSatuan,
          "isCanAddedToTotalLoan": this.listDataBiayaLainnya[i].status.id,
          "kategoryPegawai": kategoriPegawai,
          "kdProduk": this.listDataBiayaLainnya[i].biayaLainnya.kode,
          "kdProdukLoan": this.form.get('kdProdukLoan').value,
          "rangeMasaKerja": range,
          "keteranganLainnya": "string",
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listDataBiayaLainnya[i].operatorFactorRate,
          "persenDiscount": this.listDataBiayaLainnya[i].persenDiscount,
          "persenHargaSatuan": this.listDataBiayaLainnya[i].persenHargaSatuan,
          "qtyProduk": this.listDataBiayaLainnya[i].qtyProduk,
          "statusEnabled": this.listDataBiayaLainnya[i].statusEnabled
        }
        dataBiayaLainnya.push(data);
      }
      this.form.get('pegawaiSKLoanProduk').setValue(dataBiayaLainnya);
      let dataGaransi = [];
      for (var i = 0; i < this.listDataDokumen.length; ++i) {
        let data = {
          "kdJenisDokumen": this.listDataDokumen[i].jenisDokumen.id_kode,
          "kdKategoryDokumen": this.listDataDokumen[i].kategoryDokumen.id_kode,
          "kategoryPegawai": kategoriPegawai,
          "kdProdukLoan": this.form.get('kdProdukLoan').value,
          "rangeMasaKerja": range,
          "namaDokumen": this.listDataDokumen[i].judulDokumen,
          "noSK": this.form.get('noSK').value,
          "statusEnabled": this.listDataDokumen[i].statusEnabled
        }
        dataGaransi.push(data);
      }
      this.form.get('pegawaiSKLoanGaransi').setValue(dataGaransi);
      let dataSimpan = {
        "pegawaiSKLoan": datapegawaiSKLoan,
        "pegawaiSKLoanDetail": dataKomponenBiaya,
        "pegawaiSKLoanGaransi": dataGaransi,
        "pegawaiSKLoanProduk": dataBiayaLainnya,
      };
      this.httpService.post(Configuration.get().dataMaster + '/pegawaiskloan/saveRev', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
        //this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }

  reset() {
    this.form.get('kdRangeMasaKerja').enable();
    this.form.get('kdKategoryPegawai').enable();
    this.form.get('statusBiaya').enable();
    this.form.get('statusDokumen').enable();
    this.formAktif = true;
    this.listData = [];
    this.selected = null;
    this.ngOnInit();
  }
  getKomponenGaji() {

  }
  onRowSelect(event) {
    // this.selectedKategori = [{
    //   label: event.data.namaKategoryPegawai,
    //   value: event.data.kdKategoryPegawai
    // }]
    this.selectedRange = [{
      label: event.data.namaRangeMasaKerja,
      value: event.data.kdRangeMasaKerja
    }]
    console.log(this.selectedKategori);
    console.log(this.selectedRange);
    if (event.data.maxTotalLoan == 0) {
      this.type = 'Perkalian';
    } else {
      this.type = 'Nominal';
    }
    //console.log(event.data.kdKategoryPegawai);
    this.getDataKomponenBiaya(event.data.noSK, event.data.kdProdukLoan, event.data.kdRangeMasaKerja, event.data.kdKategoryPegawai);

    this.dataSK = [];
    this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: new Date(event.data.tglBerlakuAwal * 1000), tglBerlakuAkhir: new Date(event.data.tglBerlakuAkhir * 1000) });
    if (this.listDataKomponenBiaya.length == 0) {
      this.statusKomponen = false;
    } else {
      this.form.get('statusKomponenBiaya').setValue(true);
      this.statusKomponen = true;
      this.form.get('statusKomponenBiaya').disable();
    }
    if (this.listDataBiayaLainnya.length == 0) {
      this.statusBiaya = false
    } else {
      this.form.get('statusBiaya').setValue(true);
      this.statusBiaya = true;
      this.form.get('statusBiaya').disable();
    }
    if (this.listDataDokumen.length == 0) {
      this.statusDokumen = false;
    } else {
      this.form.get('statusDokumen').setValue(true);
      this.statusDokumen = true;
      this.form.get('statusDokumen').disable();
    }
    // let cloned = this.clone(event.data);
    // let clonednoSK = cloned.noSK;
    this.formAktif = false;
    // this.form.setValue(cloned);

    this.form.get("noSK").setValue(event.data.noSK);
    this.form.get('noSkIntern').setValue(event.data.noSKIntern);
    this.form.get("kdKategoryPegawai").setValue(event.data.kdKategoryPegawai);
    this.form.get("namaSuratKeputusan").setValue(event.data.namaSK);
    // this.form.get("namaSK").setValue(this.dataSK[0]);
    this.form.get("tglBerlakuAwal").setValue(new Date(event.data.tglBerlakuAwal * 1000));
    if (event.data.tglBerlakuAkhir == null) {
      this.form.get('tglBerlakuAkhir').setValue(null)
    } else {
      this.form.get("tglBerlakuAkhir").setValue(new Date(event.data.tglBerlakuAkhir * 1000));
    }
    this.form.get("kdProdukLoan").setValue(event.data.kdProdukLoan);
    this.form.get("maxTotalLoan").setValue(event.data.maxTotalLoan);
    this.form.get("factorRateMaxTotalLoan").setValue(event.data.factorRateMaxTotalLoan);
    this.form.get("maxTotalCicilan").setValue(event.data.maxTotalCicilan);
    this.form.get("factorRateMaxTotalCicilanKomponenGaji").setValue(event.data.factorRateMaxTotalCicilan);
    this.form.get("statusEnabled").setValue(event.data.statusEnabled);
    this.form.get("kdCaraBayar").setValue(event.data.kdCaraBayar);
    this.form.get("kdJenisBunga").setValue(event.data.kdJenisBunga);
    this.form.get("kdJenisSukuBunga").setValue(event.data.kdJenisSukuBunga);
    this.form.get("kdMetodeHitungBunga").setValue(event.data.kdMetodeHitungBunga);
    this.form.get("kdMetodePembayaran").setValue(event.data.kdMetodePembayaran);
    this.form.get("maxQtyCicilan").setValue(event.data.maxQtyCicilan);
    this.form.get("pegawaiSKLoan").setValue(null);
    this.form.get("statusKomponenBiaya").setValue(this.statusKomponen);
    this.form.get("statusBiaya").setValue(this.statusBiaya);
    this.form.get("statusDokumen").setValue(this.statusDokumen);
    this.form.get("pegawaiSKLoanDetail").setValue(null);
    this.form.get("pegawaiSKLoanProduk").setValue(null);
    this.form.get("pegawaiSKLoanGaransi").setValue(null);
    this.form.get('kdRangeMasaKerja').disable();
    this.form.get('kdKategoryPegawai').disable();

  }
  getDataKomponenBiaya(noSK, kdProdukLoan, kdRangeMasaKerja, kdKategoryPegawai) {
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findKomponenBiaya?noSK=' + noSK + '&kdKategoryPegawai=' + kdKategoryPegawai + '&kdRangeMasaKerja=' + kdRangeMasaKerja + '&kdProdukLoan=' + kdProdukLoan).subscribe(
      table => {
        this.listDataKomponenBiaya = [];
        for (var i = 0; i < table.pegawaiSKLoanDetail.length; ++i) {
          let data = {
            "noSK": table.pegawaiSKLoanDetail[i].noSK,
            "komponenBiaya": { id_kode: table.pegawaiSKLoanDetail[i].kdKomponenGaji, namaKomponen: table.pegawaiSKLoanDetail[i].namaKomponenGaji },
            "factorRateMaxTotalLoan": table.pegawaiSKLoanDetail[i].factorRateMaxTotalLoanKomponenGaji,
            "factorRateMaxTotalCicilan": table.pegawaiSKLoanDetail[i].factorRateMaxTotalCicilanKomponenGaji,
            "statusEnabled": table.pegawaiSKLoanDetail[i].statusEnabled
          }
          this.listDataKomponenBiaya.push(data);
        }
        this.cekKomponenBiaya = false;
        this.btnKomponenBiaya = false;

      }
      )
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findBiayaLainnya?noSK=' + noSK + '&kdKategoryPegawai=' + kdKategoryPegawai + '&kdRangeMasaKerja=' + kdRangeMasaKerja + '&kdProdukLoan=' + kdProdukLoan).subscribe(
      table => {
        this.listDataBiayaLainnya = [];
        for (var i = 0; i < table.pegawaiSKLoanProduk.length; ++i) {
          let data = {
            "noSK": table.pegawaiSKLoanProduk[i].noSK,
            "biayaLainnya": { kode: table.pegawaiSKLoanProduk[i].kdProduk, namaProduk: table.pegawaiSKLoanProduk[i].namaProduk },
            "hargaSatuan": table.pegawaiSKLoanProduk[i].hargaSatuan,
            "persenHargaSatuan": table.pegawaiSKLoanProduk[i].persenHargaSatuan,
            "persenDiscount": table.pegawaiSKLoanProduk[i].persenDiscount,
            "qtyProduk": table.pegawaiSKLoanProduk[i].qtyProduk,
            "factorRate": table.pegawaiSKLoanProduk[i].factorRate,
            "operatorFactorRate": table.pegawaiSKLoanProduk[i].operatorFactorRate,
            "status": { nama: "", id: table.pegawaiSKLoanProduk[i].isCanAddedToTotalLoan },
            "statusEnabled": table.pegawaiSKLoanProduk[i].statusEnabled
          }
          this.listDataBiayaLainnya.push(data);
        }
        for (var i = 0; i < this.listDataBiayaLainnya.length; ++i) {
          if (this.listDataBiayaLainnya[i].status.id == null) {
            this.listDataBiayaLainnya[i].status.nama = "Dipotong"
          }
          if (this.listDataBiayaLainnya[i].status.id == 1) {
            this.listDataBiayaLainnya[i].status.nama = 'Ditambahkan'
          }
          if (this.listDataBiayaLainnya[i].status.id == 0) {
            this.listDataBiayaLainnya[i].status.nama = 'Dibayar'
          }
        }
        this.cekBiayaLainnya = false;
        this.btnBiayaLainnya = false;
      }
      )
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskloan/findDokumen?noSK=' + noSK + '&kdKategoryPegawai=' + kdKategoryPegawai + '&kdRangeMasaKerja=' + kdRangeMasaKerja + '&kdProdukLoan=' + kdProdukLoan).subscribe(
      table => {
        this.listDataDokumen = [];
        for (var i = 0; i < table.pegawaiSKLoanGaransi.length; ++i) {
          let data = {
            "kdDokumen": table.pegawaiSKLoanGaransi[i].kdDokumen,
            "noSK": table.pegawaiSKLoanGaransi[i].noSK,
            "kategoryDokumen": { id_kode: table.pegawaiSKLoanGaransi[i].kdKategoryDokumen, namaKategoryDokumen: table.pegawaiSKLoanGaransi[i].namaKategoryDokumen },
            "judulDokumen": table.pegawaiSKLoanGaransi[i].namaDokumen,
            "statusEnabled": table.pegawaiSKLoanGaransi[i].statusEnabled,
            "jenisDokumen": { id_kode: table.pegawaiSKLoanGaransi[i].kdJenisDokumen, namaJenisDokumen: table.pegawaiSKLoanGaransi[i].namaJenisDokumen },
          }
          this.listDataDokumen.push(data);
        }
        console.log(this.listDataDokumen);
        this.cekDokumen = false;
        this.btnDokumen = false;
      }
      )
    if (this.listDataKomponenBiaya.length == 0) {
      this.statusKomponen = false;
    } else {
      this.form.get('statusKomponenBiaya').setValue(true);
      this.statusKomponen = true;
      this.form.get('statusKomponenBiaya').disable();
    }
    if (this.listDataBiayaLainnya.length == 0) {
      this.statusBiaya = false
    } else {
      this.form.get('statusBiaya').setValue(true);
      this.statusBiaya = true;
      this.form.get('statusBiaya').disable();
    }
    if (this.listDataDokumen.length == 0) {
      this.statusDokumen = false;
    } else {
      this.form.get('statusDokumen').setValue(true);
      this.statusDokumen = true;
      this.form.get('statusDokumen').disable();
    }
  }

  // clone(cloned: PegawaiSkLoan): PegawaiSkLoan {
  //   let hub = new InisialPegawaiSkLoan();
  //   for (let prop in cloned) {
  //     hub[prop] = cloned[prop];
  //   }
  //   let fixHub = new InisialPegawaiSkLoan();
  //   fixHub = {
  //     "noSK": hub.noSK,
  //     // "namaSK": hub.namaSK,
  //     "namaSK": this.dataSK[0],
  //     "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
  //     "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
  //     // "kdKategoryPegawai": hub.kdKategoryPegawai,
  //     // "kdRangeMasaKerja": hub.kdRangeMasaKerja,
  //     "kdProdukLoan": hub.kdProdukLoan,
  //     "maxTotalLoan": hub.maxTotalLoan,
  //     "factorRateMaxTotalLoan": hub.factorRateMaxTotalLoan,
  //     "maxTotalCicilan": hub.maxTotalCicilan,
  //     "factorRateMaxTotalCicilanKomponenGaji": hub.factorRateMaxTotalCicilan,
  //     "statusEnabled": hub.statusEnabled,
  //     "kdCaraBayar": hub.kdCaraBayar,
  //     "kdJenisBunga": hub.kdJenisBunga,
  //     "kdJenisSukuBunga": hub.kdJenisSukuBunga,
  //     "kdMetodeHitungBunga": hub.kdMetodeHitungBunga,
  //     "kdMetodePembayaran": hub.kdMetodePembayaran,
  //     "maxQtyCicilan": hub.maxQtyCicilan,
  //     "pegawaiSKLoan": null,
  //     "statusKomponenBiaya": this.statusKomponen,
  //     "statusBiaya": this.statusBiaya,
  //     "statusDokumen": this.statusDokumen,
  //     "pegawaiSKLoanDetail": null,
  //     "pegawaiSKLoanProduk": null,
  //     "pegawaiSKLoanGaransi": null



  //   }
  //   //this.versi = hub.version;
  //   return fixHub;
  // }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMaster + '/pegawaiskloan/del/' + this.form.get('noSK').value + '/' + this.selectedKategori[0] + '/' + this.selectedRange[0].value + '/' + this.form.get('kdProdukLoan').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  downloadExcel() {

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/pegawaiSKLoan/laporanPegawaiSKLoan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKLoan/laporanPegawaiSKLoan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmPegawaiSkLoan_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }

}
class InisialPegawaiSkLoan implements PegawaiSkLoan {

  constructor(
    public noSK?,
    public namaSK?,
    public tglBerlakuAwal?,
    public tglBerlakuAkhir?,
    public kdRangeMasaKerja?,
    public kdProdukLoan?,
    public maxTotalLoan?,

    public factorRateMaxTotalLoan?,
    public maxTotalCicilan?,
    public factorRateMaxTotalCicilan?,
    public kdJenisBunga?,
    public kdCaraBayar?,
    public kdJenisSukuBunga?,
    public kdMetodeHitungBunga?,
    public kdMetodePembayaran?,
    public maxQtyCicilan?,
    public kdRange?,
    public kdRangeWaktu?,
    public persenSukuBunga?,
    public factorRate?,
    public operatorFactorRate?,
    public rumusPerhitungan?,

    public kdKomponenGaji?,
    public factorRateMaxTotalCicilanKomponenGaji?,
    public factorRateMaxTotalLoanKomponenGaji?,
    public komponenGaji?,
    public statusEnabled?,
    public kdKategoryPegawai?,
    public kdMetodeBayar?,
    public kdMetodeHitung?,
    public version?,
    public pegawaiSKLoan?,
    public pegawaiSKLoanDetail?,
    public pegawaiSKLoanProduk?,
    public pegawaiSKLoanGaransi?,
    public statusKomponenBiaya?,
    public statusBiaya?,
    public statusDokumen?

    ) { }

}