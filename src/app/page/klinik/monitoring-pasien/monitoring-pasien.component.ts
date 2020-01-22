import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';
import { DropdownModule, SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, UserDto, Authentication, AuthGuard, CalculatorAgeService, AlertService, InfoService, Configuration, ReportService, SettingInfo, PrinterService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/timeout'
import { TimeoutError } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';

//import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { JS2JPrint } from '../../../global/print/js2jprint/js2jprint';



@Injectable()
@Component({
  selector: 'app-monitoring-pasien',
  templateUrl: './monitoring-pasien.component.html',
  styleUrls: ['./monitoring-pasien.component.scss'],
  host: { '(window:keydown)': 'doSomething($event)' }
})
export class MonitoringPasienComponent implements AfterViewInit, OnInit, OnDestroy {
  listMonitoring: any[];
  totalRecords: any;

  page: number;
  rows: number;
  pencarian: string;
  filter: string;
  sortBy: any;
  typeSort: any;
  sortF: any;
  sortO: any;
  namaPasienFilter: any;
  noCMFilter: any;
  noAsuransiFilter: any;
  tempatLahirFilter: any;
  tglLahirFilter: any;
  teleponFilter: any;
  emailFilter: any;
  tglDaftarFilter: any;
  noIdentitasFilter: any;
  alamatLengkapFilter: any;
  namaIbuFilter: any;
  jenisKelaminFilter: any[];
  statusPerkawinanFilter: any[];
  listStatusPerkawinan: any[];
  listJenisKelamin: any[];
  kdRekananFilter: any[];
  pendidikanFilter: any[];
  pekerjaanFilter: any[];
  agamaFilter: any[];
  sukuFilter: any[];
  golonganDarahFilter: any[];
  gambarLogoProfile: any;
  backgroundKartuPasien: any;
  jenisKelaminFilterMulti: any;
  statusPerkawinanFilterMulti: any;
  kdRekananFilterMulti: any;
  pendidikanFilterMulti: any;
  pekerjaanFilterMulti: any;
  agamaFilterMulti: any;
  sukuFilterMulti: any;
  golonganDarahFilterMulti: any;
  tanggalAwal: any;
  public tanggalAkhir: any;
  widthScreen: any;
  buttonAktif: boolean;
  kdDepartemen: any;
  rangeTahun: any;

  tglLahirTitle: any;
  tglLahirFilterMulti: any;
  umurFilter: any;
  totalRow: any;
  totalRows: any;
  hotkey: any;
  hotkeyLabel: any;
  dataPasienPrint: any;
  blockedPanel: boolean;
  items: any;
  listRekanan: any[];
  listPendidikan: any[];
  listPekerjaan: any[];
  listAgama: any[];
  listSuku: any[];
  listGolonganDarah: any[];
  profile: any;
  detailAsuransiDialog: boolean;
  listDetailAsuransi: any[];
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authentication: Authentication,
    private authGuard: AuthGuard,
    private alert: AlertService,
    private info: InfoService,
    private httpService: HttpClient,

    private fb: FormBuilder,

    private alertService: AlertService,
    private calculatorAge: CalculatorAgeService,

    private changeDetectorRef: ChangeDetectorRef,
    private rowNumberService: RowNumberService,
    private routes: Router,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService,
    private printer: PrinterService,
    private printers: JS2JPrint
  ) {
    // setInterval(() => {
    //   this.tanggalAkhir = new Date();
    // }, 1);
    this.widthScreen = screen.width - 900 - 120 + 'px';

    var bodyEdit = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodyEdit.length; i++) {
      bodyEdit[i].style.overflow = 'hidden';
    }
  }
  doSomething(event) {
    const cetakKartuPasien = 'cetakKartuPasien';
    const cetakGelangpasien = 'cetakGelangpasien';
    let namaKomputerSesion = sessionStorage.getItem('namaKomputer');
    this.hotkey = this.hotkey.trim()
    if (this.hotkey == '') {
      this.hotkey = event.key.trim();
    } else {
      this.hotkey += '+' + event.key.trim();
    }
    let hotKey = this.hotkey.replace(/Control/g, "Ctrl");
    this.hotkeyLabel = hotKey;
    if (this.hotkey.indexOf('Control') != -1) {
      this.blockedPanel = true;
      let clear = setTimeout(() => {

        this.blockedPanel = false;
        if (this.dataPasienPrint.noCm != null) {

          this.httpService.get(Configuration.get().klinik1Java + '/printerAction/getPrinterName?host=' + namaKomputerSesion + '&shoutcart=' + encodeURIComponent(hotKey)).subscribe(table => {
            console.log(table)
            if (table) {
              let dataPrint = {
                "kdKomputer": table.host,
                "printerAction": table.printerAction,
                "kdProfile": table.kdProfile,
                "namaPrinter": table.namaPrinter
              }
              if (dataPrint.printerAction == cetakKartuPasien) {
                let data = {
                  "download": false,
                  "kdDepartemen": this.profile.kdDepartemen,
                  "kdProfile": dataPrint.kdProfile,
                  "outDepartemen": true,
                  "outProfile": true,
                  "namaFile": "Test",
                  "extFile": ".pdf",
                  "paramImgKey": [
                  ],
                  "paramImgValue": [
                  ],
                  "paramKey": [
                    "noCm", "kdProfile"
                  ],
                  "paramValue": [
                    this.dataPasienPrint.noCm, dataPrint.kdProfile
                  ]
                }

                this.httpService.genericReport(Configuration.get().report + '/generic/report/cetak-kartu-pasien.pdf', data).subscribe(response => {
                  // debugger;

                  // var data = {};
                  // var file = new Blob([response], { type: 'application/pdf' });
                  // var url = window.URL.createObjectURL(file);
                  // let base64data;
                  // var reader = new FileReader();
                  // reader.readAsDataURL(file);
                  // reader.onloadend = () => {
                  //   base64data = reader.result;
                  //   let spl = base64data.split(',');
                  //   console.log(spl)
                  //   data = {
                  //     type: 'pdf',
                  //     printer: dataPrint.namaPrinter,
                  //     data: spl[1]
                  //   };
                  //   this.printers.print(JSON.stringify(data));

                  // return qz.print(config, data).then(function (data) {
                  //     console.log('Sent to printer:' + JSON.stringify(data));
                  // });
                  // };

                  this.printer.printData(response, dataPrint.namaPrinter);
                });
              } else if (dataPrint.printerAction == cetakGelangpasien) {

              }
            }
          });
        } else {
          this.alertService.warn('Peringatan', 'Data Pasien Belum Dipilih ');
        }
        this.hotkey = '';
        this.hotkeyLabel = '';
      }, 1000);
      return false;
    } else {
      this.hotkey = '';
      this.hotkeyLabel = '';
      return true;
    }


    // return false;
  }

  cetakKartuPasien() {
    const cetakKartuPasien = 'cetakKartuPasien';
    let namaKomputerSesion = sessionStorage.getItem('namaKomputer');
    this.httpService.get(Configuration.get().klinik1Java + '/printerAction/getPrinterName?host=' + namaKomputerSesion + '&shoutcart=' + encodeURIComponent('Ctrl+k')).subscribe(table => {
      console.log(table)
      if (table) {
        let dataPrint = {
          "kdKomputer": table.host,
          "printerAction": table.printerAction,
          "kdProfile": table.kdProfile,
          "namaPrinter": table.namaPrinter
        }
        if (dataPrint.printerAction == cetakKartuPasien) {
          let data = {
            "download": false,
            "kdDepartemen": this.profile.kdDepartemen,
            "kdPrdetailAsuransiDialogofile": dataPrint.kdProfile,
            "outDdetailAsuransiDialogepartemen": true,
            "outPdetailAsuransiDialogrofile": true,
            "namadetailAsuransiDialogFile": "Test",
            "extFile": ".pdf",
            "paramImgKey": [
            ],
            "paramImgValue": [
            ],
            "paramKey": [
              "noCm", "kdProfile"
            ],
            "paramValue": [
              this.dataPasienPrint.noCm, dataPrint.kdProfile
            ]
          }
          this.httpService.genericReport(Configuration.get().report + '/generic/report/cetak-kartu-pasien.pdf', data).subscribe(response => {
            this.printer.printData(response, dataPrint.namaPrinter);
          });
        }
      }
    });
  }

  ngAfterViewInit() {

    let uiGrowl = document.getElementsByClassName('ui-growl ui-widget') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiGrowl.length; i++) {
      uiGrowl[i].style.marginTop = '-40px';
    }
    let labelMultiSelect = document.getElementsByClassName('ui-multiselect-label ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < labelMultiSelect.length; i++) {
      labelMultiSelect[i].innerHTML = 'Cari';
      labelMultiSelect[i].innerText = 'Cari';
    }

    let titleMultiSelect = document.getElementsByClassName('ui-multiselect-label-container') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < titleMultiSelect.length; i++) {
      titleMultiSelect[i].title = 'Pilih';
      titleMultiSelect[i].title = 'Pilih';
    }

    var refactorInpusSwitch = document.getElementsByClassName('ui-inputswitch ui-widget ui-widget-content ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorInpusSwitch.length; i++) {
      refactorInpusSwitch[i].style.cssFloat = 'right';
    }

    var divMenuSplit = document.getElementsByClassName('ui-menu ui-menu-dynamic ui-widget ui-widget-content ui-corner-all ui-helper-clearfix ui-shadow ng-trigger ng-trigger-overlayState') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < divMenuSplit.length; i++) {
      divMenuSplit[i].style.width = '255px';
      divMenuSplit[i].style.fontSize = '12px';
      divMenuSplit[i].style.left = '-240px';
    }

    var menuList = document.getElementsByClassName('ui-menuitem-link ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    console.log(menuList)
    for (let i = 0; i < menuList.length; i++) {
      menuList[i].style.width = '250px';
    }



  }
  ngOnDestroy() {
    var bodyEdit = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodyEdit.length; i++) {
      bodyEdit[i].style.overflow = null;
    }
  }


  ngOnInit() {
    this.detailAsuransiDialog = false;
    this.profile = this.authGuard.getUserDto();

    this.items = [
      {
        label: 'Preview Kartu Pasien Digital', icon: 'fa-print', command: () => {
          this.priviewKartuDigital();
        }
      },
      {
        label: 'Kartu Pasien (Ctrl+K)', icon: 'fa-print', command: () => {
          this.cetakKartuPasien();
        }
      },
      {
        label: 'Riwayat Pemeriksaan Pasien (Ctrl+R)', icon: 'fa-print', command: () => {
          // this.downloadExcel();
        }
      },
      {
        label: 'Daftar Pasien (Ctrl+D)', icon: 'fa-print', command: () => {
          // this.downloadExcel();
        }
      },

    ];
    this.blockedPanel = false;
    this.dataPasienPrint = {
      noCm: null
    }
    this.hotkey = '';
    this.rangeTahun = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear())
    this.buttonAktif = false;

    this.listMonitoring = [];
    this.namaPasienFilter = '';
    this.noCMFilter = '';
    this.noAsuransiFilter = '';
    this.tempatLahirFilter = '';
    this.tglLahirFilter = '';
    this.emailFilter = '';
    this.teleponFilter = '';
    this.tglDaftarFilter = '';
    this.noIdentitasFilter = '';
    this.alamatLengkapFilter = '';
    this.namaIbuFilter = '';
    this.umurFilter = {
      th: '',
      bl: '',
      hr: ''
    }
    this.statusPerkawinanFilter = [];
    this.jenisKelaminFilter = [];
    this.kdRekananFilter = [];
    this.pendidikanFilter = [];
    this.pekerjaanFilter = [];
    this.agamaFilter = [];
    this.sukuFilter = [];
    this.golonganDarahFilter = [];
    this.pencarian = '';
    this.filter = '';
    this.sortBy = 'pasien.id.noCM';
    this.typeSort = 'asc';
    this.statusPerkawinanFilterMulti = "";
    this.jenisKelaminFilterMulti = "";
    this.kdRekananFilterMulti = "";
    this.tglLahirFilterMulti = "";
    this.pendidikanFilterMulti = "";
    this.pekerjaanFilterMulti = "";
    this.agamaFilterMulti = "";
    this.sukuFilterMulti = "";
    this.golonganDarahFilterMulti = "";
    this.sortF = "";
    this.sortO = "";
    // this.tanggalAwal = new Date();
    // this.tanggalAkhir = new Date();
    // this.tanggalAwal.setHours(0, 0, 0, 0);
    // this.tanggalAkhir.setHours(23, 59, 0, 0);
    // this.tanggalAkhir=null;
    // this.tanggalAwal=null;
    let tanggalAkhir = this.tanggalAkhir;
    let tanggalAwal = this.tanggalAwal;


    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = 50;
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.backgroundKartuPasien = Configuration.get().resourceFile + '/image/show/' + table.profile.backgroundKartuPasien + '?noProfile=true';
      this.gambarLogoProfile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });

    this.getService(tanggalAwal, tanggalAkhir);
  }

  getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any) {
    let cariPeriode = '';
    if (tglAwal && tglAkhir) {
      cariPeriode = '&tglDaftarAwal=' + this.setTimeStamp(tglAwal) + '&tglDaftarAkhir=' + this.setTimeStamp(tglAkhir)

    }
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasien/monitoringPasien?page=' + page + '&rows=' + rows + '&dir=' + sortBy + '&sort=' + typeSort + search + cariPeriode).subscribe(table => {
      this.listMonitoring = [];
      let list = [];
      for (let i = 0; i < table.listPasien.length; i++) {
        let dateLahir = new Date(table.listPasien[i].tglLahir * 1000);
        let age;
        age = this.calculatorAge.getUmurByDate(dateLahir.getDate(), dateLahir.getMonth(), dateLahir.getFullYear());

        list[i] = {
          "tglLahir": table.listPasien[i].tglLahir,
          "namaStatus": table.listPasien[i].namaStatus,
          "alamatLengkap": table.listPasien[i].alamatLengkap,
          "mobilePhone1": table.listPasien[i].mobilePhone1,
          "noCM": table.listPasien[i].noCM,
          "noIdentitas": table.listPasien[i].noIdentitas,
          "kodeExternalJenisKelamin": table.listPasien[i].kodeExternalJenisKelamin,
          "tempatLahir": table.listPasien[i].tempatLahir,
          "tglDaftar": table.listPasien[i].tglDaftar,
          "noAsuransi": table.listPasien[i].noAsuransi,
          "alamatEmail": table.listPasien[i].alamatEmail,
          "namaLengkap": table.listPasien[i].namaLengkap,
          "umurTh": age.years,
          "umurBln": age.months,
          "umurHr": age.days,
          namaAgama: table.listPasien[i].namaAgama,
          namaGolonganDarah: table.listPasien[i].namaGolonganDarah,
          namaIbu: table.listPasien[i].namaIbu,
          namaPekerjaan: table.listPasien[i].namaPekerjaan,
          namaPendidikan: table.listPasien[i].namaPendidikan,
          namaRekanan: table.listPasien[i].noKontak,
          namaSuku: table.listPasien[i].namaSuku,
        }
      }
      this.alertService.success('Berhasil', 'Data Berhasil Ditampilkan');
      this.totalRecords = table.totalRow;
      this.totalRow = table.listPasien.length;
      this.listMonitoring = this.rowNumberService.addRowNumber(page, rows, list);

    });

  }
  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.sortBy, this.typeSort, null, null);
  }
  getService(tglAwal, tglAkhir) {

    //JenisKelamin
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=JenisKelamin&select=namaJenisKelamin,id.kode').subscribe(res => {
      this.listJenisKelamin = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i] })
      };
    });

    //statusPerkawinan
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getStatusPerkawinan').subscribe(table => {
      this.listStatusPerkawinan = [];
      // this.listStatusPerkawinan.push({ label: '--Pilih Status Perkawinan--', value: null });
      for (var i = 0; i < table.length; i++) {
        this.listStatusPerkawinan.push({ label: table[i].namaStatus, value: table[i].kdStatus })
      };
    });

    //Rekanan
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getKontakPenjamin').subscribe(res => {
      this.listRekanan = [];
      for (var i = 0; i < res.length; i++) {
        this.listRekanan.push({ label: res[i].namaLengkap, value: res[i].kode.noKontak })
      };
    });

    //pendidikan
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pendidikan&select=namaPendidikan,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listPendidikan = [];
      for (var i = 0; i < table.data.data.length; i++) {
        this.listPendidikan.push({ label: table.data.data[i].namaPendidikan, value: table.data.data[i].id_kode })
      };
    });

    //pekerjaan
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pekerjaan&select=namaPekerjaan,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listPekerjaan = [];
      for (var i = 0; i < table.data.data.length; i++) {
        this.listPekerjaan.push({ label: table.data.data[i].namaPekerjaan, value: table.data.data[i].id_kode })
      };
    });

    //agama
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=Agama&select=namaAgama,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listAgama = [];
      for (var i = 0; i < table.data.data.length; i++) {
        this.listAgama.push({ label: table.data.data[i].namaAgama, value: table.data.data[i].id_kode })
      };
    });

    //suku
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=Suku&select=namaSuku,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listSuku = [];
      for (var i = 0; i < table.data.data.length; i++) {
        this.listSuku.push({ label: table.data.data[i].namaSuku, value: table.data.data[i].id_kode })
      };
    });

    //golonganDarah
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=GolonganDarah&select=namaGolonganDarah,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listGolonganDarah = [];
      for (var i = 0; i < table.data.data.length; i++) {
        this.listGolonganDarah.push({ label: table.data.data[i].namaGolonganDarah, value: table.data.data[i].id_kode })
      };
    });

  }

  sortingData(event) {
    if (!event.order) {
      this.sortBy = 'pasien.id.noCM';
      this.typeSort = 'asc';
    } else {
      this.sortBy = event.field;
      if (event.field == 'namaLengkap') {
        this.sortBy = 'pasien.namaLengkap';
      }
      if (event.field == 'noCM') {
        this.sortBy = 'pasien.id.noCM';
      }
      if (event.field == 'kodeExternalJenisKelamin') {
        this.sortBy = 'jenisKelamin.namaJenisKelamin';
      }
      if (event.field == 'tempatLahir') {
        this.sortBy = 'pasien.tempatLahir';
      }
      if (event.field == 'tglLahir') {
        this.sortBy = 'pasien.tglLahir';
      }
      if (event.field == 'umurTh') {
        this.sortBy = 'pasien.tglLahir';
      }
      if (event.field == 'mobilePhone1') {
        this.sortBy = 'alamat.mobilePhone1';
      }
      if (event.field == 'alamatEmail') {
        this.sortBy = 'alamat.alamatEmail';
      }
      if (event.field == 'alamatLengkap') {
        this.sortBy = 'alamat.alamatLengkap';
      }
      if (event.field == 'namaRekanan') {
        this.sortBy = 'kontak.namaLengkap';
      }
      if (event.order == 1) {
        this.typeSort = 'asc';
      } else {
        this.typeSort = 'desc';
      }
    }
    if (event.field != 'number') {
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }
  }


  filterData(event, fromField) {
    if (fromField == 'namaPasien') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + event + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'noCm') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + event + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'noAsuransi') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + event + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'tlpn') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + event + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'email') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + event + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'noIdentitas') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + event + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'alamatLengkap') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + event + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'tempatLahir') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + event + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'jk') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.jenisKelaminFilterMulti = "";
      if (this.jenisKelaminFilter.length > 0) {
        for (let i = 0; i < this.jenisKelaminFilter.length; i++) {
          this.jenisKelaminFilterMulti += "&kdJenisKelamin[]=" + this.jenisKelaminFilter[i].value.id_kode
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'statusPerkawinan') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.statusPerkawinanFilterMulti = "";
      if (this.statusPerkawinanFilter.length > 0) {
        for (let i = 0; i < this.statusPerkawinanFilter.length; i++) {
          this.statusPerkawinanFilterMulti += "&kdStatusPerkawinan[]=" + this.statusPerkawinanFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaRekanan') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.kdRekananFilterMulti = "";
      if (this.kdRekananFilter.length > 0) {
        for (let i = 0; i < this.kdRekananFilter.length; i++) {
          this.kdRekananFilterMulti += "&noKontak[]=" + this.kdRekananFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaPendidikan') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pendidikanFilterMulti = "";
      if (this.pendidikanFilter.length > 0) {
        for (let i = 0; i < this.pendidikanFilter.length; i++) {
          this.pendidikanFilterMulti += "&kdPendidikan[]=" + this.pendidikanFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }


    if (fromField == 'namaPekerjaan') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pekerjaanFilterMulti = "";
      if (this.pekerjaanFilter.length > 0) {
        for (let i = 0; i < this.pekerjaanFilter.length; i++) {
          this.pekerjaanFilterMulti += "&kdPekerjaan[]=" + this.pekerjaanFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaAgama') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.agamaFilterMulti = "";
      if (this.agamaFilter.length > 0) {
        for (let i = 0; i < this.agamaFilter.length; i++) {
          this.agamaFilterMulti += "&kdAgama[]=" + this.agamaFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaSuku') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.sukuFilterMulti = "";
      if (this.sukuFilter.length > 0) {
        for (let i = 0; i < this.sukuFilter.length; i++) {
          this.sukuFilterMulti += "&kdSuku[]=" + this.sukuFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaGolonganDarah') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.golonganDarahFilterMulti = "";
      if (this.golonganDarahFilter.length > 0) {
        for (let i = 0; i < this.golonganDarahFilter.length; i++) {
          this.golonganDarahFilterMulti += "&kdGolonganDarah[]=" + this.golonganDarahFilter[i].value
        }
      }
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'tglLahir') {

      // let time = event;
      // let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      // var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      // // let hari = dayNames[time.getDay()];
      // let bulanAwal = monthNames[time[0].getMonth()];
      // let tanggalAwal = time[0].getDate() + " " + bulanAwal + " " + time[0].getFullYear();
      // let tanggalAkhir = '';
      // // this.tglLahirFilterMulti='&tglLahirAwal='+this.setTimeStamp(time[0]);
      // if (time[1] != null) {
      //   let bulanAkhir = monthNames[time[1].getMonth()];
      //   tanggalAkhir = ' - ' + time[1].getDate() + " " + bulanAkhir + " " + time[1].getFullYear();
      //   this.tglLahirFilterMulti = '&tglLahirAwal=' + this.setTimeStamp(time[0]) + '&tglLahirAkhir=' + this.setTimeStamp(time[1]);
      // }
      let time = new Date(event);
      let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      let bulanAwal = monthNames[time.getMonth()];
      let tanggalAwal = time.getDate() + " " + bulanAwal + " " + time.getFullYear();
      this.tglLahirFilterMulti = '&tglLahirAwal=' + this.setTimeStamp(time.setHours(0, 0, 0, 0)) + '&tglLahirAkhir=' + this.setTimeStamp(time.setHours(23, 59, 0, 0));
      this.tglLahirTitle = tanggalAwal;
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }


    if (fromField == 'umur') {
      let tglAwalN;
      let tglAkhirN;
      let date = new Date();
      let hariIni:any;
      hariIni = this.setTimeStamp(date);
       //1 jam berama detik
       const detikN = 3600;
       // hari dalam setahun
       const hariN = 365;
       // satu hari berapa jam
       const jamN = 24;

      let tahun = parseInt(this.umurFilter.th) + 1;
      let satuTahun = detikN * hariN * jamN;
      if(isNaN(tahun) != true){
        let hasilInput = tahun * satuTahun;

        tglAwalN = hariIni - hasilInput;
  
        tglAkhirN = tglAwalN + satuTahun; 
      }else{
        tglAwalN = "";
        tglAkhirN = "";
      }
      // let bulan = this.umurFilter.bl;
      // let hari = this.umurFilter.hr;
      // if (tahun == null || tahun == '') {
      //   tahun = 0;
      // }
      // if (bulan == null || bulan == '') {
      //   bulan = 0;
      // }
      // if (hari == null || hari == '') {
      //   hari = 0;
      // }
      // date.setFullYear(date.getFullYear() - tahun);
      // date.setMonth(date.getMonth() - bulan);
      // date.setDate(date.getDate() - hari);
      // console.log(date);

      // let tanggalAwal = date.setHours(0, 0, 0, 0);
      // let tanggalAkhir = date.setHours(23, 59, 0, 0);
      // this.tglLahirFilterMulti = '&tglLahirAwal=' + this.setTimeStamp(tanggalAwal) + '&tglLahirAkhir=' + this.setTimeStamp(tanggalAkhir);

      if (this.umurFilter.th == '' ) {
        this.tglLahirFilterMulti = '';
      }

      // && this.umurFilter.bl == '' && this.umurFilter.hr == ''
      // this.tglLahirTitle = tanggalAwal + tanggalAkhir;
      //this.tglLahirTitle = tglAwalN + tglAkhirN;
      this.tglLahirFilterMulti = '&tglLahirAwal=' + tglAwalN + '&tglLahirAkhir=' + tglAkhirN;
      this.pencarian = '&namaIbu=' + this.namaIbuFilter + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaIbu') {
      let tglLahir = '';
      if (this.tglLahirFilter == null || this.tglLahirFilter == '') {
        this.tglLahirFilterMulti = '';
      }
      this.pencarian = '&namaIbu=' + event + '&tempatLahir=' + this.tempatLahirFilter + '&namaLengkap=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&alamat=' + this.alamatLengkapFilter + '&telepon=' + this.teleponFilter + '&email=' + this.emailFilter + '&noAsuransi=' + this.noAsuransiFilter + '&noIdentitas=' + this.noIdentitasFilter + this.jenisKelaminFilterMulti + this.statusPerkawinanFilterMulti + this.tglLahirFilterMulti + this.kdRekananFilterMulti + this.pendidikanFilterMulti + this.pekerjaanFilterMulti + this.agamaFilterMulti + this.sukuFilterMulti + this.golonganDarahFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

  }

  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }

  }

  periodeOpen() {
    document.getElementById("periodePencarian").style.display = "block";
    document.getElementById("periodePencarianOpen").style.display = "none";
    document.getElementById("periodePencarianClose").style.display = "block";

  }

  periodeClose() {
    document.getElementById("periodePencarian").style.display = "none";
    document.getElementById("periodePencarianOpen").style.display = "block";
    document.getElementById("periodePencarianClose").style.display = "none";

  }

  clearPencarian() {
    this.ngOnInit();
    this.tanggalAwal = null;
    this.tanggalAkhir = null;
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, null, null);
  }

  cari() {
    this.getService(this.tanggalAwal, this.tanggalAkhir)
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
  }

  onRowSelect(event) {
    this.dataPasienPrint.noCm = event.data.noCM;
  }

  setTglPencarian(event, from) {
    if (from == 'awal') {
      this.tanggalAwal = new Date(event);
      this.tanggalAwal.setHours(0, 0, 0, 0);
    } else {
      this.tanggalAkhir = new Date(event);
      this.tanggalAkhir.setHours(23, 59, 0, 0);
    }

  }

  priviewKartuDigital() {
    if (this.dataPasienPrint.noCm != null) {
      let data = {
        "download": false,
        "kdDepartemen": this.profile.kdDepartemen,
        "kdProfile": this.profile.idProfile,
        "outDepartemen": true,
        "outProfile": true,
        "namaFile": "Test",
        "extFile": ".pdf",
        "paramImgKey": [
        ],
        "paramImgValue": [
        ],
        "paramKey": [
          "noCm", "kdProfile", "background-image"
        ],
        "paramValue": [
          this.dataPasienPrint.noCm, this.profile.idProfile, this.backgroundKartuPasien
        ]
      }
      this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-kartu-pasien-viewer.pdf', 'Kartu Pasien Digital', data);

    }

  }

  pilihPegawai(event, pegawai: any, overlaypanel: any) {
    // this.pilih = pegawai;
    overlaypanel.toggle(event);
    // if (pegawai.photoDiri == null) {
    // 	this.foto = Configuration.get().resourceFile + "/image/show/profile1213123.png";

    // 	this.tnNyOv = pegawai.titlePegawai;
    // 	this.namaOv = pegawai.namaLengkap;
    // 	this.nikIOv = (pegawai.nIKIntern == '' || pegawai.nIKIntern === undefined || pegawai.nIKIntern === null) ? "-" : pegawai.nIKIntern;
    // 	this.jnskOv = pegawai.jenisKelamin;
    // 	this.deptOv = pegawai.namaDepartemen;
    // 	this.tglMOv = new Date(pegawai.tglMasuk);
    // 	this.jbtOv = pegawai.jabatan;

    // } else {

    // 	this.foto = Configuration.get().resourceFile + "/image/show/" + pegawai.photoDiri;

    // 	this.tnNyOv = pegawai.titlePegawai;
    // 	this.namaOv = pegawai.namaLengkap;
    // 	this.nikIOv = (pegawai.nIKIntern == '' || pegawai.nIKIntern === undefined || pegawai.nIKIntern === null) ? "-" : pegawai.nIKIntern;
    // 	this.jnskOv = pegawai.jenisKelamin;
    // 	this.deptOv = pegawai.namaDepartemen;
    // 	this.tglMOv = new Date(pegawai.tglMasuk);
    // 	this.jbtOv = pegawai.jabatan;
    // }

  }

  detailAsuransi(data) {
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasien/findByNoCM?noCM='+data.noCM).subscribe(table => {
      this.listDetailAsuransi = [];
      this.listDetailAsuransi = table.data;
      this.detailAsuransiDialog = true;
    });
  }

}

