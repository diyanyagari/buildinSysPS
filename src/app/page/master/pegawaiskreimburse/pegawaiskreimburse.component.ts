import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/primeng';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSKReimburse } from './pegawaiskreimburse.interface';
import { Validators, FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pegawai-sk-loan',
  templateUrl: './pegawaiskreimburse.component.html',
  styleUrls: ['./pegawaiskreimburse.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSKReimburseComponent implements OnInit {

  form: FormGroup;
  komponenHarga: any;
  cekKomponenHarga: boolean;
  btnKomponenHarga: boolean;
  listDataKomponenHarga: any[];
  listDataPaket: any[];
  listDataMapPaket: any[];
  cekDataPaket: boolean;
  btnDataPaket: boolean;
  kodeKategoryPegawai: any[];
  kodeRangeMasaKerja: any[];
  kodeJabatan: any[];
  kodeGolonganPegawai: any[];
  kodeHubunganKeluarga: any[];
  kodeJenisProduk: any[];
  kodeKelas: any[];
  dataSK: any[];
  page: number;
  rows: number;
  listData: any[];
  bulanPlafonReset: any[];
  datakomponenHarga: any[];
  dataPaket: any[];
  dataProduk: any[];
  dataOperator: any[];
  formAktif: boolean;
  isByPaket: number;
  isAllowOverPlafon: number;
  periode: any;
  selected: any;
  isPeriodeByMonth: number;
  isPeriodeByQuarter: number;
  isPeriodeBySemester: number;
  isPeriodeByTrimester: number;
  isPeriodeByYear: number;
  isProRate: number;
  isAkumulasi: number;
  isCollectivePlafon: number;
  isKlaimEnterToPayroll: number;
  versi: any;
  komponenharga: boolean;
  selectedkategoryPegawai: any[];
  selectedMasaKerja: any[];
  selectedJabatan: any[];
  selectedGolongan: any[];
  selectedRange: any[];
  dataEditPersen: boolean;
  dataEditNominal: boolean;
  dataPersenPlafon: boolean;
  dataEditMaxPlafon: boolean;
  pencarian: any;
  totalRecords: number;
  items: any;
  namaSK: any[];
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  smbrFile:any;



  type: any;
  checkboxkomponenharga : boolean
  checkboxpaket : boolean

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private route: Router,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    //this.page = Configuration.get().page;
    //this.rows = Configuration.get().rows;
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
    this.formAktif = true;
    this.cekKomponenHarga = true;
    this.btnKomponenHarga = true;
    this.cekDataPaket = true;
    this.btnDataPaket = true;
    this.dataEditPersen = true;
    this.dataEditNominal = true;
    this.dataPersenPlafon = true;
    this.dataEditMaxPlafon = true;

    this.form = this.fb.group({
      'namaSuratKeputusan': new FormControl(null, Validators.required),
      'noSK': new FormControl(),
      'noSkIntern': new FormControl(''),
      'tglBerlakuAwal': new FormControl(),
      'tglBerlakuAkhir': new FormControl(),
      'kdKategoryPegawai': new FormControl(null, Validators.required),
      'kdRangeMasaKerja': new FormControl(null, Validators.required),
      'kdJabatan': new FormControl(null, Validators.required),
      'kdHubunganKeluarga': new FormControl(null, Validators.required),
      'statusPaket': new FormControl(),
      'persenPlafon': new FormControl(),
      'maxPlafon': new FormControl(),
      'statusAllowPlafon': new FormControl(),
      'persenAllowOverPlafon': new FormControl(),
      'maxAllowOverPlafon': new FormControl(),
      'periodeBulanan': new FormControl('', Validators.required),
      'periodeTriSemester': new FormControl('', Validators.required),
      'periodeQuarter': new FormControl('', Validators.required),
      'periodeSemester': new FormControl('', Validators.required),
      'periodeTahunan': new FormControl('', Validators.required),
      'kuotaHariByPeriode': new FormControl(),
      'statusProRate': new FormControl(),
      'akumulasi': new FormControl(),
      'kdBulanPlafonReset': new FormControl(),
      'collectivePlafon': new FormControl(),
      'maxHariKlaim': new FormControl(),
      'klaimEnterToPayroll': new FormControl(),
      'kdKelas': new FormControl(),
      'komponenHarga': new FormControl(),
      'kdGolonganPegawai': new FormControl(null, Validators.required),
      'kdJenisProduk': new FormControl(null, Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    })
    this.listDataKomponenHarga = [];
    this.listDataPaket = [];
    this.listDataMapPaket = [];
    this.form.get('tglBerlakuAwal').disable();
    this.form.get('tglBerlakuAkhir').disable();
    this.form.get('persenAllowOverPlafon').disable();
    this.form.get('maxAllowOverPlafon').disable();
    this.bulanPlafonReset = [];
    this.bulanPlafonReset.push(
      { label: 'Pilih Tanggal Bulan Plafon Reset', value: null },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
      { label: '10', value: 10 },
      { label: '11', value: 11 },
      { label: '12', value: 12 },
      { label: '13', value: 13 },
      { label: '14', value: 14 },
      { label: '15', value: 15 },
      { label: '16', value: 16 },
      { label: '17', value: 17 },
      { label: '18', value: 18 },
      { label: '19', value: 19 },
      { label: '20', value: 20 },
      { label: '21', value: 21 },
      { label: '22', value: 22 },
      { label: '23', value: 23 },
      { label: '24', value: 24 },
      { label: '25', value: 25 },
      { label: '26', value: 26 },
      { label: '27', value: 27 },
      { label: '28', value: 28 },
      { label: '29', value: 29 },
      { label: '30', value: 30 },
      { label: '31', value: 31 }
      )
    this.dataOperator = [];
    this.dataOperator.push({ label: '--Pilih Operator Factor Rate--', value: '' });
    this.dataOperator.push({ label: "+", value: '+' });
    this.dataOperator.push({ label: "-", value: '-' });
    this.dataOperator.push({ label: "X", value: 'X' });
    this.dataOperator.push({ label: "/", value: '/' });
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.getData(this.page, this.rows);
    this.get();

    this.getSmbrFile();


    this.type = 'Nominal';
    this.checkboxkomponenharga = false
    this.checkboxpaket = false

    this.valueRadio(this.type)

  }


  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
     this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }

  getKelompokTransaksi() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskreimburse/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }


  getData(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.PegawaiSKFasilitas;
      this.totalRecords = table.totalRow;
    });
  }
  get() {
    // this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/findSKReimburse').subscribe(res => {
    //   this.dataSK = res.result;
    // });


    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KategoryPegawai&select=id.kode,namaKategoryPegawai&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeKategoryPegawai = [];
      //this.kodeKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i] })
      };
      this.selectedkategoryPegawai = this.kodeKategoryPegawai;


    });
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/getRangeMasaKerja').subscribe(res => {
      this.kodeRangeMasaKerja = [];
      //this.kodeRangeMasaKerja.push({ label: '--Pilih Range Masa Kerja--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.kodeRangeMasaKerja.push({ label: res.data[i].namaRange, value: res.data[i] })
      };
      this.selectedRange = this.kodeRangeMasaKerja;
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Jabatan&select=id.kode,namaJabatan&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeJabatan = [];
      //this.kodeJabatan.push({ label: '--Pilih Jabatan --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i] })
      };
      this.selectedJabatan = this.kodeJabatan;

    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=GolonganPegawai&select=id.kode,namaGolonganPegawai&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeGolonganPegawai = [];
      // this.kodeGolonganPegawai.push({ label: '--Pilih Golongan Pegawai --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i] })
      };
      this.selectedGolongan = this.kodeGolonganPegawai;

    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=HubunganKeluarga&select=id.kode,namaHubunganKeluarga&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeHubunganKeluarga = [];
      this.kodeHubunganKeluarga.push({ label: '--Pilih Hubungan Keluarga --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeHubunganKeluarga.push({ label: res.data.data[i].namaHubunganKeluarga, value: res.data.data[i].id_kode })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisProduk&select=id.kode,%20namaJenisProduk&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
      this.kodeJenisProduk = [];
      this.kodeJenisProduk.push({ label: '--Pilih Jenis Produk --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisProduk.push({ label: res.data.data[i].namaJenisProduk, value: res.data.data[i].id_kode })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Kelas&select=id.kode,namaKelas&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeKelas = [];
      this.kodeKelas.push({ label: '--Pilih Kelas --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKelas.push({ label: res.data.data[i].namaKelas, value: res.data.data[i].id_kode })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Komponen&select=id.kode,namaKomponen&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.datakomponenHarga = [];
      this.datakomponenHarga.push({ label: '--Pilih Kelas --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.datakomponenHarga.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i] })
      };
    });
    /*this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/getPaket?page=1&rows=300').subscribe(res => {
      this.dataPaket = [];
      this.dataPaket.push({ label: '--Pilih Paket --', value: '' })
      for (var i = 0; i < res.data.data.data.length; i++) {
        this.dataPaket.push({ label: res.data.data.data[i].namaPaket, value: res.data.data.data[i] })
      };
    });*/
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/getPaket').subscribe(res => {
      this.dataPaket = [];
      this.dataPaket.push({ label: '--Pilih Paket --', value: '' })
      for (var i = 0; i < res.paket.length; i++) {
        this.dataPaket.push({ label: res.paket[i].namaPaket, value: res.paket[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Produk&select=id.kode,namaProduk&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
      this.dataProduk = [];
      this.dataProduk.push({ label: '--Pilih Produk --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.dataProduk.push({ label: res.data.data[i].namaProduk, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskreimburse/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });


  }

  loadPage(event: LazyLoadEvent) {
    this.getData((event.rows + event.first) / event.rows, event.rows);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }
  ambilSK(sk) {
    if (this.form.get('namaSuratKeputusan').value == '' || this.form.get('namaSuratKeputusan').value == null || this.form.get('namaSuratKeputusan').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('noSkIntern').setValue(null);
      this.form.get('tglBerlakuAwal').setValue(null);
      this.form.get('tglBerlakuAkhir').setValue(null);
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskreimburse/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
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
  // filterSk(event) {
  //   this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/findSKReimburse?namaSK=' + event.query).subscribe(res => {
  //     this.dataSK = res.result;
  //   });
  // }
  // pilihSK(event) {
  //   this.form.get('noSK').setValue(event.noSK);
  //   this.form.get('tglBerlakuAwal').setValue(new Date(event.tglBerlakuAwal * 1000));
  //   if (event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
  //     this.form.get('tglBerlakuAkhir').setValue(new Date(event.tglBerlakuAkhir * 1000));
  //   }
  // }
  getkomponenHarga(event) {
    console.log(event)
    if (event) {
      this.cekKomponenHarga = false;
      this.btnKomponenHarga = false;
    } else {
      this.cekKomponenHarga = true;
      this.btnKomponenHarga = true;
      if (this.listDataKomponenHarga.length > 0) {
        return this.listDataKomponenHarga = [];
      }
    }
  }
  
  getStatusAllow(event) {
    if (event) {
      this.form.get('persenAllowOverPlafon').enable();
      this.form.get('maxAllowOverPlafon').enable();
      this.isAllowOverPlafon = 1;
    } else {
      this.form.get('persenAllowOverPlafon').disable();
      this.form.get('maxAllowOverPlafon').disable();
      this.isAllowOverPlafon = 0;
    }
  }
  getPeriode(value) {
    if (value == "bulanan") {
      this.isPeriodeByMonth = 1;
      this.isPeriodeByQuarter = 0;
      this.isPeriodeBySemester = 0;
      this.isPeriodeByTrimester = 0;
      this.isPeriodeByYear = 0;
    } else if (value == "trisemester") {
      this.isPeriodeByMonth = 0;
      this.isPeriodeByQuarter = 0;
      this.isPeriodeBySemester = 0;
      this.isPeriodeByTrimester = 1;
      this.isPeriodeByYear = 0;
    } else if (value == "quarter") {
      this.isPeriodeByMonth = 0;
      this.isPeriodeByQuarter = 1;
      this.isPeriodeBySemester = 0;
      this.isPeriodeByTrimester = 0;
      this.isPeriodeByYear = 0;
    } else if (value == "semester") {
      this.isPeriodeByMonth = 0;
      this.isPeriodeByQuarter = 0;
      this.isPeriodeBySemester = 1;
      this.isPeriodeByTrimester = 0;
      this.isPeriodeByYear = 0;
    } else {
      this.isPeriodeByMonth = 0;
      this.isPeriodeByQuarter = 0;
      this.isPeriodeBySemester = 0;
      this.isPeriodeByTrimester = 0;
      this.isPeriodeByYear = 1;
    }
  }
  getStatusPro(value) {
    if (value) {
      this.isProRate = 1;
    } else {
      this.isProRate = 0;
    }
  }
  getStatusAkumulasi(value) {
    if (value) {
      this.isAkumulasi = 1;
    } else {
      this.isAkumulasi = 0;
    }
  }
  getStatusCollective(value) {
    if (value) {
      this.isCollectivePlafon = 1;
    } else {
      this.isCollectivePlafon = 0;
    }
  }
  getStatusKlaim(value) {
    if (value) {
      this.isKlaimEnterToPayroll = 1;
    } else {
      this.isKlaimEnterToPayroll = 0;
    }
  }
  tambahDataKomponenHarga() {
    let datakomponenHarga = {
      "noSK": null,
      "komponenHarga": { id: '-', namaKomponen: "--Pilih Komponen Harga--" },
      "factorRateMaxTotalPlafon": null,
      "factorRateMaxOverPlafon": null,
      "status": true
    }
    let komponenHarga = [... this.listDataKomponenHarga];
    komponenHarga.push(datakomponenHarga);
    this.listDataKomponenHarga = komponenHarga;
  }
  hapusRowDataKomponenHarga(row) {
    this.listDataKomponenHarga = this.listDataKomponenHarga.filter((val, i) => i != row);
  }
  tambahDataPaket() {
    this.dataEditPersen = true;
    this.dataEditNominal = true;
    this.dataPersenPlafon = true;
    this.dataEditMaxPlafon = true;
    
    let dataPaket = {
      "noSK": null,
      "paket": { id: '-', namaPaket: "--Pilih Paket--" },
      "nominalTanggunganProfile": null,
      "persenTanggunganProfile": null,
      "factorRate": 1,
      "operatorFactorRate": "X",
      "maxPlafonByPeriode": null,
      "persenPlafonByPeriode": null,
      "maxQtyPaketByPeriode": null,
      "status": true
    }
    let paket = [... this.listDataPaket];
    paket.push(dataPaket);
    this.listDataPaket = paket;
  }
  hapusRowDataPaket(row) {
    this.listDataPaket = this.listDataPaket.filter((val, i) => i != row);
  }
  tambahDataMapPaket() {
    let dataMapPaket = {
      "noSK": null,
      "paket": { id: '-', namaPaket: "--Pilih Paket--" },
      "produk": { id: '-', namaProduk: "--Pilih Produk--" },
      "maxQtyProduk": null,
      "status": true
    }
    let mapPaket = [... this.listDataMapPaket];
    mapPaket.push(dataMapPaket);
    this.listDataMapPaket = mapPaket;
  }
  hapusRowDataMapPaket(row) {
    this.listDataMapPaket = this.listDataMapPaket.filter((val, i) => i != row);
  }
  getStatusPaket(value) {
    if (value) {
      this.isByPaket = 1;
      this.form.get('persenPlafon').disable();
      this.form.get('maxPlafon').disable();
    } else {
      this.isByPaket = 0;
      this.form.get('persenPlafon').enable();
      this.form.get('maxPlafon').enable();
      this.form.get('persenPlafon').setValue(null);
      this.form.get('maxPlafon').setValue(null);
    }
  }
  onRowSelect(event) {
    console.log(event.data);
    this.getDataReimburse(event.data.kode.noSK, event.data.kode.kdKategoryPegawai, event.data.kode.kdRangeMasaKerja, event.data.kode.kdJabatan, event.data.kode.kdHubunganKeluarga, event.data.kode.kdGolonganPegawai, event.data.kode.kdJenisProduk);

    /*this.dataSK = [];
    this.dataSK.push({namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: new Date(event.data.tglBerlakuAwal * 1000), tglBerlakuAkhir: new Date(event.data.tglBerlakuAkhir * 1000)});
    this.selectedkategoryPegawai = [];
    this.selectedkategoryPegawai.push({namaKategoryPegawai: event.data.namaKategoryPegawai, id_kode: event.data.kode.kdKategoryPegawai});
    this.selectedMasaKerja = [];
    this.selectedMasaKerja.push({namaRange: event.data.namaRange, id_kode: event.data.kode.kdRangeMasaKerja});
    this.selectedJabatan = [];
    this.selectedJabatan.push({namaJabatan: event.data.namaJabatan, id_kode: event.data.kode.kdJabatan});*/
    if (event.data.isByPaket == 1) {
      this.isByPaket = 1;
      this.getPaket(true);
      this.form.get('persenPlafon').disable();
      this.form.get('maxPlafon').disable();
    } else {
      this.isByPaket = 0;
      this.getPaket(false);
      this.form.get('persenPlafon').enable();
      this.form.get('maxPlafon').enable();
      this.form.get('persenPlafon').setValue(event.data.persenPlafonByPeriode);
      this.form.get('maxPlafon').setValue(event.data.maxPlafonByPeriode);
    }
    if (event.data.isAllowOverPlafon == 1) {
      this.isAllowOverPlafon = 1;
    } else {
      this.isAllowOverPlafon = 0;
    }
    // this.isPeriodeByMonth = event.data.isPeriodeByMonth;
    // this.isPeriodeByTrimester = event.data.isPeriodeByTrimester;
    // this.isPeriodeByQuarter = event.data.isPeriodeByQuarter;
    // this.isPeriodeBySemester = event.data.isPeriodeBySemester;
    // this.isPeriodeByYear = event.data.isPeriodeByYear;
    if (event.data.isPeriodeByMonth == 1) {
      this.periode = "bulanan"
    } else if (event.data.isPeriodeByTrimester == 1) {
      this.periode = "trisemester"
    } else if (event.data.isPeriodeByQuarter == 1) {
      this.periode = "quarter"
    } else if (event.data.isPeriodeBySemester == 1) {
      this.periode = "semester"
    } else if (event.data.isPeriodeByYear == 1) {
      this.periode = "tahunan"
    } else {
      this.periode = "bulanan"
    }
    if (event.data.isProRate == 1) {
      this.isProRate = 1
    } else {
      this.isProRate = 0
    }
    if (event.data.isAkumulasi == 1) {
      this.isAkumulasi = 1;
    } else {
      this.isAkumulasi = 0;
    }
    if (event.data.isCollectivePlafon == 1) {
      this.isCollectivePlafon = 1;
    } else {
      this.isCollectivePlafon = 0;
    }
    if (event.data.isKlaimEnterToPayroll == 1) {
      this.isKlaimEnterToPayroll = 1;
    } else {
      this.isKlaimEnterToPayroll = 0;
    }
    this.dataSK = [];
    this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: new Date(event.data.tglBerlakuAwal * 1000), tglBerlakuAkhir: new Date(event.data.tglBerlakuAkhir * 1000) });
    // this.selectedkategoryPegawai = [];
    // this.selectedkategoryPegawai.push({ namaKategoryPegawai: event.data.namaKategoryPegawai, id_kode: event.data.kode.kdKategoryPegawai });
    // this.selectedMasaKerja = [];
    // this.selectedMasaKerja.push({ namaRange: event.data.namaRange, id_kode: event.data.kode.kdRangeMasaKerja });
    // this.selectedJabatan = [];
    // this.selectedJabatan.push({ namaJabatan: event.data.namaJabatan, id_kode: event.data.kode.kdJabatan });
    this.selectedkategoryPegawai = [{
      label: event.data.namaKategoryPegawai,
      value: { namaKategoryPegawai: event.data.namaKategoryPegawai, id_kode: event.data.kode.kdKategoryPegawai }
    }];
    this.selectedMasaKerja = [{
      label: event.data.namaRange,
      value: { namaRange: event.data.namaRange, kdRange: event.data.kode.kdRangeMasaKerja }
    }];
    this.selectedJabatan = [{
      label: event.data.namaJabatan,
      value: { namaJabatan: event.data.namaJabatan, id_kode: event.data.kode.kdJabatan }
    }];
    this.selectedGolongan = [{
      label: event.data.namaGolonganPegawai,
      value:  { namaGolonganPegawai: event.data.namaGolonganPegawai, id_kode: event.data.kode.kdGolonganPegawai }
    }];
    // let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.get('namaSuratKeputusan').setValue(event.data.kode.noSK);
    this.form.get('noSK').setValue(event.data.kode.noSK);
    this.form.get('noSkIntern').setValue(event.data.noSKIntern);
    this.form.get('tglBerlakuAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
    if(event.data.tglBerlakuAkhir == null){
      this.form.get('tglBerlakuAkhir').setValue(null)
    }
    else {
    this.form.get('tglBerlakuAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));      
    }
    // this.form.get('kdKategoryPegawai').setValue(event.data.kode.kdKategoryPegawai);
    // this.form.get('kdRangeMasaKerja').setValue(event.data.kode.kdRangeMasaKerja);
    // this.form.get('kdGolonganPegawai').setValue(event.data.kode.kdGolonganPegawai);
    this.form.get('kdJenisProduk').setValue(event.data.kode.kdJenisProduk);
    // this.form.get('kdJabatan').setValue(event.data.kode.kdJabatan);
    this.form.get('kdHubunganKeluarga').setValue(event.data.kode.kdHubunganKeluarga);
    this.form.get('statusPaket').setValue(this.isByPaket);

    this.form.get('statusAllowPlafon').setValue(this.isAllowOverPlafon);
    this.form.get('persenAllowOverPlafon').setValue(event.data.persenAllowOverPlafon);
    this.form.get('maxAllowOverPlafon').setValue(event.data.maxAllowOverPlafon);
    this.form.get('periodeBulanan').setValue(this.periode);
    this.form.get('periodeTriSemester').setValue(this.periode);
    this.form.get('periodeQuarter').setValue(this.periode);
    this.form.get('periodeSemester').setValue(this.periode);
    this.form.get('periodeTahunan').setValue(this.periode);
    this.form.get('kuotaHariByPeriode').setValue(event.data.kuotaHariByPeriod);
    this.form.get('statusProRate').setValue(this.isProRate);
    this.form.get('akumulasi').setValue(this.isAkumulasi);
    this.form.get('kdBulanPlafonReset').setValue(event.data.tglBlnPlafonReset);
    this.form.get('collectivePlafon').setValue(this.isCollectivePlafon);
    this.form.get('maxHariKlaim').setValue(event.data.maxHariKlaim);
    this.form.get('klaimEnterToPayroll').setValue(this.isKlaimEnterToPayroll);
    this.form.get('kdKelas').setValue(event.data.kdKelasDiJamin);
    this.form.get('komponenHarga').setValue(this.komponenharga);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.versi = event.data.version;
    this.getPaket(this.form.get('statusPaket').value);
    //this.form.setValue(cloned);
    this.form.get('kdJenisProduk').disable();
    this.form.get('kdHubunganKeluarga').disable();
    this.form.get('kdGolonganPegawai').disable();
    this.form.get('kdJabatan').disable();
    this.form.get('kdRangeMasaKerja').disable();
    this.form.get('kdKategoryPegawai').disable();

    //ed99
    if (event.data.maxTotalLoan == 0) {
      this.type = 'Perkalian';
    } else {
      this.type = 'Nominal';
    }


  }
  clone(cloned: PegawaiSKReimburse): PegawaiSKReimburse {
    let hub = new InisialPegawaiSKReimburse();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPegawaiSKReimburse();
    fixHub = {
      'namaSuratKeputusan': this.dataSK[0],
      'noSK': hub.kode.noSK,
      'tglBerlakuAwal': new Date(hub.tglBerlakuAwal * 1000),
      'tglBerlakuAkhir': new Date(hub.tglBerlakuAkhir * 1000),
      'kdKategoryPegawai': hub.kode.kdKategoryPegawai,
      'kdRangeMasaKerja': hub.kode.kdRangeMasaKerja,
      'kdJabatan': hub.kode.kdJabatan,
      'kdHubunganKeluarga': hub.kode.kdHubunganKeluarga,
      'statusPaket': this.isByPaket,
      'persenPlafon': hub.persenPlafonByPeriode,
      'maxPlafon': hub.maxPlafonByPeriode,
      'statusAllowPlafon': this.isAllowOverPlafon,
      'persenAllowOverPlafon': hub.persenAllowOverPlafon,
      'maxAllowOverPlafon': hub.maxAllowOverPlafon,
      'periodeBulanan': this.isPeriodeByMonth,
      'periodeTriSemester': this.isPeriodeByTrimester,
      'periodeQuarter': this.isPeriodeByQuarter,
      'periodeSemester': this.isPeriodeBySemester,
      'periodeTahunan': this.isPeriodeByYear,
      'kuotaHariByPeriode': hub.kuotaHariByPeriod,
      'statusProRate': this.isProRate,
      'akumulasi': this.isAkumulasi,
      'kdBulanPlafonReset': hub.tglBlnPlafonReset,
      'collectivePlafon': this.isCollectivePlafon,
      'maxHariKlaim': hub.maxHariKlaim,
      'klaimEnterToPayroll': this.isKlaimEnterToPayroll,
      'kdKelas': hub.kdKelasDiJamin,
      "komponenHarga": this.komponenharga,
      'statusEnabled': hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  getDataReimburse(noSK, kdKategoryPegawai, kdRangeMasaKerja, kdJabatan, kdHubunganKeluarga, kdGolonganPegawai, kdJenisProduk) {
    this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/findByKode/' + noSK + '/' + kdKategoryPegawai + '/' + kdRangeMasaKerja + '/' + kdJabatan + '/' + kdHubunganKeluarga + '/' + kdGolonganPegawai + '/' + kdJenisProduk).subscribe(res => {
      console.log(res);

      this.listDataKomponenHarga = [];
      for (var i = 0; i < res.data[0].PegawaiSKReimburseK.length; ++i) {
        let data = {
          noSK: res.data[0].PegawaiSKReimburseK[i].kode.noSK,
          komponenHarga: { namaKomponen: res.data[0].PegawaiSKReimburseK[i].namaKomponen, id_kode: res.data[0].PegawaiSKReimburseK[i].kode.kdKomponenHarga },
          factorRateMaxTotalPlafon: res.data[0].PegawaiSKReimburseK[i].factorRateMaxPlafon,
          factorRateMaxOverPlafon: res.data[0].PegawaiSKReimburseK[i].factorRateMaxOverPlafon,
          status: res.data[0].PegawaiSKReimburseK[i].statusEnabled
        }
        this.listDataKomponenHarga.push(data);
      }
      if (res.data[0].PegawaiSKReimburseK.length != 0) {
        this.cekKomponenHarga = false;
        this.btnKomponenHarga = false;
        // this.komponenharga = true;
      } else {
        this.cekKomponenHarga = true;
        this.btnKomponenHarga = true;
        // this.komponenharga = false;

      }

      console.log(this.komponenharga);
      console.log(this.cekKomponenHarga);
      this.listDataPaket = [];
      for (var i = 0; i < res.data[1].PegawaiSKReimbursePaket.length; ++i) {
        let data = {
          "noSK": res.data[1].PegawaiSKReimbursePaket[i].kode.noSK,
          "paket": { namaPaket: res.data[1].PegawaiSKReimbursePaket[i][19], id_kode: res.data[1].PegawaiSKReimbursePaket[i].kode.kdPaket },
          "nominalTanggunganProfile": res.data[1].PegawaiSKReimbursePaket[i].hargaTProfile,
          "persenTanggunganProfile": res.data[1].PegawaiSKReimbursePaket[i].persenHargaTProfile,
          "factorRate": res.data[1].PegawaiSKReimbursePaket[i].factorRate,
          "operatorFactorRate": res.data[1].PegawaiSKReimbursePaket[i].operatorFactorRate,
          "maxPlafonByPeriode": res.data[1].PegawaiSKReimbursePaket[i].maxPlafonByPeriode,
          "persenPlafonByPeriode": res.data[1].PegawaiSKReimbursePaket[i].persenPlafonUsedByPeriode,
          "maxQtyPaketByPeriode": res.data[1].PegawaiSKReimbursePaket[i].maxQtyPaketByPeriode,
          "status": res.data[1].PegawaiSKReimbursePaket[i].statusEnabled
        }
        this.listDataPaket.push(data);
      }
      if (res.data[1].PegawaiSKReimbursePaket.length == 0) {
        this.cekDataPaket = true;
      } else {
        this.cekDataPaket = false;
      }
      this.listDataMapPaket = [];
      for (var i = 0; i < res.data[2].MapPaketReimburseToProduk.length; ++i) {
        let data = {
          "noSK": res.data[2].MapPaketReimburseToProduk[i].kode.noSK,
          "paket": { namaPaket: res.data[2].MapPaketReimburseToProduk[i].namaPaket, id_kode: res.data[2].MapPaketReimburseToProduk[i].kode.kdPaket },
          "produk": { namaProduk: res.data[2].MapPaketReimburseToProduk[i].namaProduk, id_kode: res.data[2].MapPaketReimburseToProduk[i].kode.kdProduk },
          "maxQtyProduk": res.data[2].MapPaketReimburseToProduk[i].maxQtyProduk,
          "status": res.data[2].MapPaketReimburseToProduk[i].statusEnabled
        }
        this.listDataMapPaket.push(data);
      }

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
    } else if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.simpan();
    }
    // if (this.formAktif == false) {
    //   this.confirmUpdate()
    // } else {
    //   this.simpan();
    // }
  }
  simpan() {
    if (this.form.get('statusAllowPlafon').value == null) {
      this.isAllowOverPlafon = 0;
    }
    //console.log(this.isAllowOverPlafon);
    //console.log(this.form.get('statusAllowPlafon').value);
    if (this.form.get('statusPaket').value == null) {
      this.isByPaket = 0;
    }
    if (this.form.get('statusProRate').value == null) {
      this.isProRate = 0;
    }
    if (this.form.get('akumulasi').value == null) {
      this.isAkumulasi = 0;
    }
    if (this.form.get('collectivePlafon').value == null) {
      this.isCollectivePlafon = 0;
    }
    if (this.form.get('klaimEnterToPayroll').value == null) {
      this.isKlaimEnterToPayroll = 0;
    }
    console.log(this.selectedkategoryPegawai);
    console.log(this.selectedJabatan);
    console.log(this.selectedRange);

    let dataMapPaket = [];
    for (var i = 0; i < this.listDataMapPaket.length; ++i) {
      let data = {
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdKategoryPegawai": "",
        "kdPaket": this.listDataMapPaket[i].paket.kode.kode,
        "kdProduk": this.listDataMapPaket[i].produk.id_kode,
        "kdRangeMasaKerja": 0,
        "maxQtyProduk": this.listDataMapPaket[i].maxQtyProduk,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listDataMapPaket[i].status,
        "kdGolonganPegawai": 0,
        "kdJenisProduk": this.form.get('kdJenisProduk').value
      }
      dataMapPaket.push(data);
    }
    console.log(dataMapPaket);

    let dataPaketReimburse = [];
    for (var i = 0; i < this.listDataPaket.length; ++i) {
      let data = {
        "factorRate": this.listDataPaket[i].factorRate,
        "hargaTProfile": this.listDataPaket[i].nominalTanggunganProfile,
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdKategoryPegawai": "",
        "kdPaket": this.listDataPaket[i].paket.kode.kode,
        "kdRangeMasaKerja": 0,
        "keteranganLainnya": "Paket Reimburse",
        "maxPlafonByPeriode": this.listDataPaket[i].maxPlafonByPeriode,
        "maxQtyPaketByPeriode": this.listDataPaket[i].maxQtyPaketByPeriode,
        "noSK": this.form.get('noSK').value,
        "operatorFactorRate": this.listDataPaket[i].operatorFactorRate,
        "persenHargaTProfile": this.listDataPaket[i].persenTanggunganProfile,
        "persenPlafonUsedByPeriode": this.listDataPaket[i].persenPlafonByPeriode,
        "statusEnabled": this.listDataPaket[i].status,
        "kdGolonganPegawai": 0,
        "noRecTriggerPlafonUsed": "",
        "kdJenisProduk": this.form.get('kdJenisProduk').value
      }
      dataPaketReimburse.push(data);
    }

    let dataMapKomponen = [];
    for (var i = 0; i < this.listDataKomponenHarga.length; ++i) {
      let data = {
        "factorRateMaxOverPlafon": this.listDataKomponenHarga[i].factorRateMaxTotalPlafon,
        "factorRateMaxPlafon": this.listDataKomponenHarga[i].factorRateMaxOverPlafon,
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdKategoryPegawai": "",
        "kdKomponenHarga": this.listDataKomponenHarga[i].komponenHarga.id_kode,
        "kdRangeMasaKerja": 0,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listDataKomponenHarga[i].status,
        "kdGolonganPegawai": 0,
        "kdJenisProduk": this.form.get('kdJenisProduk').value

      }
      dataMapKomponen.push(data);
    }
    
    let golongan = [];
    let range = [];
    let jabatan = [];
    let kategori = [];
    for (let i = 0; i < this.selectedRange.length; i++) {
      range.push({
        "kode": this.selectedRange[i].value.kdRange,
      })
    }
    for (let i = 0; i < this.selectedGolongan.length; i++) {
      golongan.push({
        "kode": this.selectedGolongan[i].value.id_kode,
      })
    }
    for (let i = 0; i < this.selectedJabatan.length; i++) {
      jabatan.push({
        "kode": this.selectedJabatan[i].value.id_kode,
      })
    }
    for (let i = 0; i < this.selectedkategoryPegawai.length; i++) {
      kategori.push({
        "kode": this.selectedkategoryPegawai[i].value.id_kode,
      })
    }

    let dataSimpan = {
      "kdGolonganPegawai": golongan,
      "kdKategoryPegawai": kategori,
      "kdJabatan": jabatan,
      "kdRangeMasaKerja": range,

      "mapPaketReimburseToProdukDto": dataMapPaket,

      "pegawaiSKReimburse": {
        "isAkumulasi": this.isAkumulasi,
        "isAllowOverPlafon": this.isAllowOverPlafon,
        "isByPaket": this.isByPaket,
        "isCollectivePlafon": this.isCollectivePlafon,
        "isKlaimEnterToPayroll": this.isKlaimEnterToPayroll,
        "isPeriodeByMonth": this.isPeriodeByMonth,
        "isPeriodeByQuarter": this.isPeriodeByQuarter,
        "isPeriodeBySemester": this.isPeriodeBySemester,
        "isPeriodeByTrimester": this.isPeriodeByTrimester,
        "isPeriodeByYear": this.isPeriodeByYear,
        "isProRate": this.isProRate,
        "kdGolonganPegawai": 0,
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdJenisProduk": this.form.get('kdJenisProduk').value,
        "kdKategoryPegawai": "",
        "kdKelasDiJamin": this.form.get('kdKelas').value,
        "kdRangeMasaKerja": 0,
        "keteranganLainnya": "Paket Reimburse",
        "kuotaHariByPeriod": this.form.get('kuotaHariByPeriode').value,
        "maxAllowOverPlafon": this.form.get('maxAllowOverPlafon').value,
        "maxHariKlaim": this.form.get('maxHariKlaim').value,
        "maxPlafonByPeriode": this.form.get('maxPlafon').value,
        "noSK": this.form.get('noSK').value,
        "persenAllowOverPlafon": this.form.get('persenAllowOverPlafon').value,
        "persenPlafonByPeriode": this.form.get('persenPlafon').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "noRecTriggerAkumulasi": "",
        "tglBlnPlafonReset": this.form.get('kdBulanPlafonReset').value

      },

      "pegawaiSKReimburseK": dataMapKomponen,
      "pegawaiSKReimbursePaket": dataPaketReimburse
    }


    console.log(dataSimpan);
    this.httpService.post(Configuration.get().dataMaster + '/pegawaiskreimburse/save', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.reset();
    });
    /*if(this.selectedkategoryPegawai.length == this.selectedJabatan.length || this.selectedkategoryPegawai.length == this.selectedMasaKerja.length 
      &&  this.selectedJabatan.length == this.selectedMasaKerja.length || this.selectedJabatan.length == this.selectedkategoryPegawai.length 
      && this.selectedMasaKerja.length == this.selectedkategoryPegawai.length || this.selectedMasaKerja.length == this.selectedJabatan.length) {
      
    } else {
      this.alertService.warn('Peringatan', 'Jumlah data kategori pegawai jabatan dan masa kerja harus sama');
    }*/




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
    if (this.form.get('statusAllowPlafon').value == null) {
      this.isAllowOverPlafon = 0;
    }
    //console.log(this.isAllowOverPlafon);
    //console.log(this.form.get('statusAllowPlafon').value);
    if (this.form.get('statusPaket').value == null) {
      this.isByPaket = 0;
    }
    if (this.form.get('statusProRate').value == null) {
      this.isProRate = 0;
    }
    if (this.form.get('akumulasi').value == null) {
      this.isAkumulasi = 0;
    }
    if (this.form.get('collectivePlafon').value == null) {
      this.isCollectivePlafon = 0;
    }
    if (this.form.get('klaimEnterToPayroll').value == null) {
      this.isKlaimEnterToPayroll = 0;
    }
    console.log(this.selectedkategoryPegawai);
    console.log(this.selectedJabatan);
    console.log(this.selectedRange);

    let dataMapPaket = [];
    for (var i = 0; i < this.listDataMapPaket.length; ++i) {
      let data = {
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdKategoryPegawai": "",
        "kdPaket": this.listDataMapPaket[i].paket.id_kode,
        "kdProduk": this.listDataMapPaket[i].produk.id_kode,
        "kdRangeMasaKerja": 0,
        "maxQtyProduk": this.listDataMapPaket[i].maxQtyProduk,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listDataMapPaket[i].status,
        "kdGolonganPegawai": 0,
        "kdJenisProduk": this.form.get('kdJenisProduk').value
      }
      dataMapPaket.push(data);
    }
    console.log(dataMapPaket);

    let dataPaketReimburse = [];
    for (var i = 0; i < this.listDataPaket.length; ++i) {
      let data = {
        "factorRate": this.listDataPaket[i].factorRate,
        "hargaTProfile": this.listDataPaket[i].nominalTanggunganProfile,
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdKategoryPegawai": "",
        "kdPaket": this.listDataPaket[i].paket.id_kode,
        "kdRangeMasaKerja": 0,
        "keteranganLainnya": "Paket Reimburse",
        "maxPlafonByPeriode": this.listDataPaket[i].maxPlafonByPeriode,
        "maxQtyPaketByPeriode": this.listDataPaket[i].maxQtyPaketByPeriode,
        "noSK": this.form.get('noSK').value,
        "operatorFactorRate": this.listDataPaket[i].operatorFactorRate,
        "persenHargaTProfile": this.listDataPaket[i].persenTanggunganProfile,
        "persenPlafonUsedByPeriode": this.listDataPaket[i].persenPlafonByPeriode,
        "statusEnabled": this.listDataPaket[i].status,
        "kdGolonganPegawai": 0,
        "noRecTriggerPlafonUsed": "",
        "kdJenisProduk": this.form.get('kdJenisProduk').value
      }
      dataPaketReimburse.push(data);
    }

    let dataMapKomponen = [];
    for (var i = 0; i < this.listDataKomponenHarga.length; ++i) {
      let data = {
        "factorRateMaxOverPlafon": this.listDataKomponenHarga[i].factorRateMaxTotalPlafon,
        "factorRateMaxPlafon": this.listDataKomponenHarga[i].factorRateMaxOverPlafon,
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdKategoryPegawai": "",
        "kdKomponenHarga": this.listDataKomponenHarga[i].komponenHarga.id_kode,
        "kdRangeMasaKerja": 0,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.listDataKomponenHarga[i].status,
        "kdGolonganPegawai": 0,
        "kdJenisProduk": this.form.get('kdJenisProduk').value

      }
      dataMapKomponen.push(data);
    }
    
    let golongan = [];
    let range = [];
    let jabatan = [];
    let kategori = [];
    for (let i = 0; i < this.selectedRange.length; i++) {
      range.push({
        "kode": this.selectedRange[i].value.kdRange,
      })
    }
    for (let i = 0; i < this.selectedGolongan.length; i++) {
      golongan.push({
        "kode": this.selectedGolongan[i].value.id_kode,
      })
    }
    for (let i = 0; i < this.selectedJabatan.length; i++) {
      jabatan.push({
        "kode": this.selectedJabatan[i].value.id_kode,
      })
    }
    for (let i = 0; i < this.selectedkategoryPegawai.length; i++) {
      kategori.push({
        "kode": this.selectedkategoryPegawai[i].value.id_kode,
      })
    }

    let dataSimpan = {
      "kdGolonganPegawai": golongan,
      "kdKategoryPegawai": kategori,
      "kdJabatan": jabatan,
      "kdRangeMasaKerja": range,

      "mapPaketReimburseToProdukDto": dataMapPaket,

      "pegawaiSKReimburse": {
        "isAkumulasi": this.isAkumulasi,
        "isAllowOverPlafon": this.isAllowOverPlafon,
        "isByPaket": this.isByPaket,
        "isCollectivePlafon": this.isCollectivePlafon,
        "isKlaimEnterToPayroll": this.isKlaimEnterToPayroll,
        "isPeriodeByMonth": this.isPeriodeByMonth,
        "isPeriodeByQuarter": this.isPeriodeByQuarter,
        "isPeriodeBySemester": this.isPeriodeBySemester,
        "isPeriodeByTrimester": this.isPeriodeByTrimester,
        "isPeriodeByYear": this.isPeriodeByYear,
        "isProRate": this.isProRate,
        "kdGolonganPegawai": 0,
        "kdHubunganKeluarga": this.form.get('kdHubunganKeluarga').value,
        "kdJabatan": "",
        "kdJenisProduk": this.form.get('kdJenisProduk').value,
        "kdKategoryPegawai": "",
        "kdKelasDiJamin": this.form.get('kdKelas').value,
        "kdRangeMasaKerja": 0,
        "keteranganLainnya": "Paket Reimburse",
        "kuotaHariByPeriod": this.form.get('kuotaHariByPeriode').value,
        "maxAllowOverPlafon": this.form.get('maxAllowOverPlafon').value,
        "maxHariKlaim": this.form.get('maxHariKlaim').value,
        "maxPlafonByPeriode": this.form.get('maxPlafon').value,
        "noSK": this.form.get('noSK').value,
        "persenAllowOverPlafon": this.form.get('persenAllowOverPlafon').value,
        "persenPlafonByPeriode": this.form.get('persenPlafon').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "noRecTriggerAkumulasi": "",
        "tglBlnPlafonReset": this.form.get('kdBulanPlafonReset').value

      },

      "pegawaiSKReimburseK": dataMapKomponen,
      "pegawaiSKReimbursePaket": dataPaketReimburse
    }


    console.log(dataSimpan);
    this.httpService.update(Configuration.get().dataMaster + '/pegawaiskreimburse/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }
  reset() {
    this.form.get('persenPlafon').enable();
    this.form.get('maxPlafon').enable();
    this.form.get('kdJenisProduk').enable();
    this.form.get('kdHubunganKeluarga').enable();
    this.form.get('kdGolonganPegawai').enable();
    this.form.get('kdJabatan').enable();
    this.form.get('kdRangeMasaKerja').enable();
    this.form.get('kdKategoryPegawai').enable();
    this.selectedkategoryPegawai = [];
    this.selectedMasaKerja = [];
    this.selectedJabatan = [];
    this.form.reset();
    this.ngOnInit();


  }

  getPersenPlafon(value) {
    if (value !== null) {
      this.form.get('maxPlafon').disable();
    } else {
      this.form.get('maxPlafon').enable();
    }
  }
  getMaxPlafon(value) {
    if (value !== null) {
      this.form.get('persenPlafon').disable();
    } else {
      this.form.get('persenPlafon').enable();
    }
  }
  getNominalTanggungan(value) {
    if (value !== null) {
      this.dataEditPersen = false;
    } else {
      this.dataEditPersen = true;
    }
  }
  getPersenTanggungan(value) {
    if (value !== null) {
      this.dataEditNominal = false;
    } else {
      this.dataEditNominal = true;
    }
  }
  getMaxPlafonPeriode(value) {
    if (value !== null) {
      this.dataPersenPlafon = false;
    } else {
      this.dataPersenPlafon = true;
    }
  }
  getPersenPlafonPeriode(value) {
    if (value !== null) {
      this.dataEditMaxPlafon = false;
    } else {
      this.dataEditMaxPlafon = true;
    }
  }
  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Reimburse');
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
  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  hapus() {
    // let noSK = this.form.get('noSK').value;
    // let kdKategoryPegawai = this.form.get('kdKategoryPegawai').value;
    // let kdRangeMasaKerja = this.form.get('kdRangeMasaKerja').value;
    // let kdJabatan = this.form.get('kdJabatan').value;
    // let kdHubunganKeluarga = this.form.get('kdHubunganKeluarga').value;
    // if (noSK == null || noSK == "") {
    //   this.alertService.warn('Peringatan', 'No SK Tidak Ada');
    // } else {
      let item = [...this.listData];
      let deleteItem = item[this.findSelectedIndex()];
      this.httpService.delete(Configuration.get().dataMaster + '/pegawaiskreimburse/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdRangeMasaKerja + '/' + deleteItem.kode.kdJabatan + '/' + deleteItem.kode.kdHubunganKeluarga + '/' + deleteItem.kode.kdGolonganPegawai + '/' + deleteItem.kode.kdJenisProduk).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.reset();
      });
    }


    setHarga(value) {
      if (value != null) {
        return parseInt(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
    }
    cari() {
      this.httpService.get(Configuration.get().dataMaster + '/pegawaiskreimburse/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&noSK=' + this.pencarian).subscribe(table => {
        this.listData = table.PegawaiSKFasilitas;
        this.totalRecords = table.totalRow;
      });
    }
    downloadExcel() {

    }

    downloadPdf() {
      let cetak = Configuration.get().report + '/pegawaiSKReimburse/laporanPegawaiSKReimburse.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
      window.open(cetak);
    }

    cetak() {
      this.laporan = true;
      this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKReimburse/laporanPegawaiSKReimburse.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' +'&gambarLogo=' + this.smbrFile + this.kdprof + '&download=false', 'frmPegawaiSkReimburse_laporanCetak');

    }
    tutupLaporan() {
      this.laporan = false;
    }

    getPaket(event) {
      this.checkboxpaket = event;

      if (event == true) {
        this.cekDataPaket = false;
        this.btnDataPaket = false;
        this.isByPaket = 1;
        this.form.get('persenPlafon').disable();
        this.form.get('maxPlafon').disable();
        //
        if (this.type == "Nominal"){
          this.checkboxkomponenharga = true
          this.form.get('komponenHarga').setValue(false);
          this.getkomponenHarga(false)
        }
        else {
          this.checkboxkomponenharga = true;
          this.form.get('komponenHarga').setValue(true)
          // this.form.get('komponenHarga').disable()
          this.getkomponenHarga(true)
          this.alertService.warn('Peringatan','Komponen Harga Wajib Diisi')
          //tambah warning wajib komponen harga
          this.dataEditMaxPlafon = false        
        }
        //
      } else {
        this.cekDataPaket = true;
        this.btnDataPaket = true;
        this.isByPaket = 0;
        this.form.get('persenPlafon').enable();
        this.form.get('maxPlafon').enable();
        this.form.get('persenPlafon').setValue(null);
        this.form.get('maxPlafon').setValue(null);
        if (this.listDataPaket.length > 0) {
          return this.listDataPaket = [];
        }
        if (this.listDataMapPaket.length > 0) {
          return this.listDataMapPaket = [];
        }
        if (this.type == "Nominal"){
          this.checkboxkomponenharga = true;
          this.form.get('komponenHarga').setValue(false);
          this.getkomponenHarga(false)
        }
        else {
          this.checkboxkomponenharga = true
          this.form.get('komponenHarga').setValue(true);
          // this.form.get('komponenHarga').disable()
          this.getkomponenHarga(true)
          //tambah warning wajib komponen harga
          this.alertService.warn('Peringatan','Komponen Harga Wajib Diisi')
          this.form.get('persenPlafon').disable();
          this.form.get('maxPlafon').disable();
        }
      }
    }

    valueRadio(value) {
      this.type = value;
      if (value == "Nominal"){
        this.checkboxkomponenharga = true
        this.form.get('komponenHarga').setValue(false);
        this.getkomponenHarga(false)
        if (this.checkboxpaket == true){
          this.form.get('persenPlafon').disable();
          this.form.get('maxPlafon').disable();
        }
        else if (this.checkboxpaket == false){
          this.form.get('persenPlafon').enable();
          this.form.get('maxPlafon').enable();

        }
      }
      else if (value == "Perkalian"){
        this.checkboxkomponenharga = true;
        this.form.get('komponenHarga').setValue(true);
          // this.form.get('komponenHarga').disable()
        this.getkomponenHarga(true)
        //tambah warning wajib komponen harga
          this.alertService.warn('Peringatan','Komponen Harga Wajib Diisi')
          
        if (this.checkboxpaket == true){
          this.form.get('persenPlafon').disable();
          this.form.get('maxPlafon').disable();  
          this.dataEditMaxPlafon = false        
        }
        else if (this.checkboxpaket == false){          
          this.form.get('persenPlafon').disable();
          this.form.get('maxPlafon').disable();
        }
      }
    }



  }
  class InisialPegawaiSKReimburse implements PegawaiSKReimburse {

    constructor(
      public namaSuratKeputusan?,
      public noSK?,
      public tglBerlakuAwal?,
      public tglBerlakuAkhir?,
      public kdKategoryPegawai?,
      public kdRangeMasaKerja?,
      public kdJabatan?,
      public kdGolonganPegawai?,
      public kdHubunganKeluarga?,
      public kdJenisProduk?,
      public statusPaket?,
      public persenPlafon?,
      public maxPlafon?,
      public statusAllowPlafon?,
      public persenAllowOverPlafon?,
      public maxAllowOverPlafon?,
      public periodeBulanan?,
      public periodeTriSemester?,
      public periodeQuarter?,
      public periodeSemester?,
      public periodeTahunan?,
      public kuotaHariByPeriode?,
      public statusProRate?,
      public akumulasi?,
      public kdBulanPlafonReset?,
      public collectivePlafon?,
      public maxHariKlaim?,
      public klaimEnterToPayroll?,
      public kdKelas?,
      public statusEnabled?,
      public persenPlafonByPeriode?,
      public kode?,
      public maxPlafonByPeriode?,
      public kuotaHariByPeriod?,
      public version?,
      public tglBlnPlafonReset?,
      public kdKelasDiJamin?,
      public komponenHarga?

      ) { }

  }