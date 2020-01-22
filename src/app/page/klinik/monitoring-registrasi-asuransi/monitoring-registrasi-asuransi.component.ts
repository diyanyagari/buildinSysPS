import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';
import { DropdownModule, SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, UserDto, Authentication, AuthGuard, SettingsService, AlertService, InfoService, Configuration, ReportService, SettingInfo, PrinterService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/timeout'
import { TimeoutError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { JS2JPrint } from '../../../global/print/js2jprint/js2jprint';



@Injectable()
@Component({
  selector: 'app-monitoring-registrasi-asuransi',
  templateUrl: './monitoring-registrasi-asuransi.component.html',
  styleUrls: ['./monitoring-registrasi-asuransi.component.scss'],
})
export class MonitoringRegistrasiAsuransiComponent implements AfterViewInit, OnInit, OnDestroy {
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
  tglDaftarFilter: any;
  namaPesertaFilter: any;

  alamatLengkapFilter: any;
  jenisKelaminFilter: any[];
  kontakRekananPenjaminFilter: any[];
  namaGolonganAsuransiFilter: any[];
  kontakRekananAsalFilter: any[];
  namaKelasFilter: any[];
  listJenisKelamin: any[];
  kdRekananFilter: any[];
  namaHubunganFilter: any[];
  gambarLogoProfile: any;

  jenisKelaminFilterMulti: any;
  statusPerkawinanFilterMulti: any;
  kdRekananFilterMulti: any;
  tglLahirFilterMulti: any;
  kontakRekananPenjaminFilterMulti: any;
  namaGolonganAsuransiFilterMulti: any;
  namaHubunganFilterMulti: any;
  namaKelasFilterMulti: any;
  kontakRekananAsalFilterMulti: any;

  tanggalAwal: any;
  tglDaftarTitle: any;
  public tanggalAkhir: any;
  widthScreen: any;
  buttonAktif: boolean;
  kdDepartemen: any;
  rangeTahun: any;

  tglLahirTitle: any;
  totalRow: any;
  totalRows: any;
  listRekanan: any[];
  registrasiDialog: boolean;
  form: FormGroup;
  widthScreens: any;
  pasien: boolean;
  pegawaiProfile: boolean;
  listNegara: any[];
  listPropinsi: any[];
  listKotaKabupaten: any[];
  listKecamatan: any[];
  listDesaKelurahan: any[];
  listPegawai: any[];
  listPasien: any[];
  listPerusahaanAsal: any[];
  listKelas: any[];
  listGolonganAsuransi: any[];
  listUnitBagian: any[];
  listHubunganPeserta: any[];
  rangeTahunTglLahir: any;
  listDetailRegistrasiAsuransi: any[];
  buttonAktifSave: boolean;
  iconTambahEdit: any;
  listDetailAsuransi: any[];
  detailAsuransiDialog: boolean;
  expandedDetailListAsuransi: Array<any> = new Array<any>();
  indexExpand: any = null;
  listJenisAlamat: any[];
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
    this.widthScreen = screen.width - 970 - 120 + 'px';
    //this.widthScreens = 900;

    var bodyEdit = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodyEdit.length; i++) {
      bodyEdit[i].style.overflow = 'hidden';
    }

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
    for (let i = 0; i < menuList.length; i++) {
      menuList[i].style.width = '250px';
    }

    var classContentDialog = document.getElementsByClassName('ui-dialog-content ui-widget-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < classContentDialog.length; i++) {
      classContentDialog[i].style.overflowX = 'hidden';
      classContentDialog[i].style.maxHeight = '80vh';
      classContentDialog[i].style.paddingTop = '2vh';
    }
    // document.getElementById("pegawaiCheckbox").style.cssFloat = "right";
    // document.getElementById("pegawaiCheckbox").style.marginRight = "1vw";
    // document.getElementById("pasienCheckbox").style.cssFloat = "right";
    // document.getElementById("pasienCheckbox").style.marginRight = "1vw";
    this.form.get("kdPasien").disable();
    this.form.get("kdPasien").setValue(null);
    this.form.get("kdPegawai").setValue(null);
    this.form.get("kdPegawai").disable();
  }
  ngOnDestroy() {
    var bodyEdit = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodyEdit.length; i++) {
      bodyEdit[i].style.overflow = null;
    }
  }

  ngOnInit() {
    this.registrasiDialog = false;
    this.iconTambahEdit = 'fa-plus';

    this.rangeTahunTglLahir = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear());
    this.rangeTahun = (new Date().getFullYear() - 15) + ':' + (new Date().getFullYear() + 15);
    this.kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
    this.buttonAktif = false;
    this.buttonAktifSave = false;
    let today = new Date();

    this.listMonitoring = [];
    this.namaPesertaFilter = '';
    this.noCMFilter = '';
    this.noAsuransiFilter = '';
    this.tempatLahirFilter = '';
    this.tglLahirFilter = '';
    this.tglDaftarFilter = '';
    this.alamatLengkapFilter = '';
    this.jenisKelaminFilter = [];
    this.kontakRekananPenjaminFilter = [];
    this.namaGolonganAsuransiFilter = [];
    this.kontakRekananAsalFilter = [];;
    this.namaKelasFilter = [];
    this.kdRekananFilter = [];
    this.listDetailRegistrasiAsuransi = [];
    this.namaHubunganFilter = [];
    this.pencarian = '';
    this.filter = '';
    this.sortBy = 'pasien.id.noCM';
    this.typeSort = 'asc';
    this.statusPerkawinanFilterMulti = "";
    this.jenisKelaminFilterMulti = "";
    this.kdRekananFilterMulti = "";
    this.tglLahirFilterMulti = "";
    this.kontakRekananPenjaminFilterMulti = "";
    this.namaGolonganAsuransiFilterMulti = "";
    this.kontakRekananAsalFilterMulti = "";
    this.namaKelasFilterMulti = "";
    this.namaHubunganFilterMulti = "";
    this.sortF = "";
    this.sortO = "";
    let tanggalAkhir = this.tanggalAkhir;
    let tanggalAwal = this.tanggalAwal;
    this.form = this.fb.group({
      "kdPasien": new FormControl(null),
      "kdPegawai": new FormControl(null),
      "nip": new FormControl(null),
      "nik": new FormControl(null),
      "kdPerusahaanAsuransi": new FormControl(null, Validators.required),
      "noAsuransi": new FormControl(null, Validators.required),
      "kdHubunganPeserta": new FormControl(null, Validators.required),
      "namaLengkap": new FormControl(null, Validators.required),
      "tglLahir": new FormControl(null, Validators.required),
      "kdJenisKelamin": new FormControl(null, Validators.required),
      "kdGolonganAsuransi": new FormControl(null),
      "kdKelas": new FormControl(null, Validators.required),
      "kdPerusahaanAsal": new FormControl(null),
      "kdUnitBagian": new FormControl(null),
      // "tglBerlakuAwal": new FormControl(null, Validators.required),
      // "tglBerlakuAkhhir": new FormControl(null),
      "alamatLengkap": new FormControl(null),
      "rtrw": new FormControl(null),
      "kodePos": new FormControl(null),
      "kdNegara": new FormControl(null),
      "kdPropinsi": new FormControl(null),
      "kdKecamatan": new FormControl(null),
      "kdKotaKabupaten": new FormControl(null),
      "kdDesaKelurahan": new FormControl(null),
      "pasien": new FormControl(null),
      "pegawaiProfile": new FormControl(null),
      "namaKecamatan": new FormControl(null),
      "namaKotaKabupaten": new FormControl(null),
      "namaPendidikan": new FormControl(null),
      "tglDaftar": new FormControl(today, Validators.required),
      "kodeExternalJenisKelamin": new FormControl(null),
      "noIdentitas": new FormControl(null),
      "namaPekerjaan": new FormControl(null),
      "alamatEmail": new FormControl(null),
      "namaDesaKelurahan": new FormControl(null),
      "namaGolonganDarah": new FormControl(null),
      "namaPropinsi": new FormControl(null),
      "namaRekanan": new FormControl(null),
      "noCM": new FormControl(null),
      "namaIbu": new FormControl(null),
      "namaStatus": new FormControl(null),
      "mobilePhone1": new FormControl(null),
      "namaSuku": new FormControl(null),
      "namaAgama": new FormControl(null),
      "kdAlamat": new FormControl(null),
      "kdJenisAlamat": new FormControl(null, Validators.required),
    });


    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = 50;
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.gambarLogoProfile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
    this.pasien = false;
    this.pegawaiProfile = false;
    this.cekPegawaiProfile();
    this.changeManual();
    this.getService(tanggalAwal, tanggalAkhir);
  }

  getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any) {
    let cariPeriode = '';
    if (tglAwal && tglAkhir) {
      cariPeriode = '&tglDaftarAwal=' + this.setTimeStamp(tglAwal) + '&tglDaftarAkhir=' + this.setTimeStamp(tglAkhir)

    }
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/monitoringAsuransi?page=' + page + '&rows=' + rows + '&dir=' + sortBy + '&sort=' + typeSort + search + cariPeriode).subscribe(table => {
      this.listMonitoring = [];
      let list = [];
      for (let i = 0; i < table.listAsuransi.length; i++) {
        list[i] = {
          "tglLahir": table.listAsuransi[i].tglLahir,
          "alamatLengkap": table.listAsuransi[i].alamatLengkap,
          "kontakRekananPenjamin": table.listAsuransi[i].kontakRekananPenjamin,
          "noCM": table.listAsuransi[i].noCM,
          "kodeExternalJenisKelamin": table.listAsuransi[i].kodeExternalJenisKelamin,
          "kontakRekananAsal": table.listAsuransi[i].kontakRekananAsal,
          "tglDaftar": table.listAsuransi[i].tglDaftar,
          "namaKelas": table.listAsuransi[i].namaKelas,
          "noAsuransi": table.listAsuransi[i].noAsuransi,
          "namaGolonganAsuransi": table.listAsuransi[i].namaGolonganAsuransi,
          "namaPeserta": table.listAsuransi[i].namaPeserta,
          "isCollectivePlafon": table.listAsuransi[i].isCollectivePlafon,
          "kdDesaKelurahan": table.listAsuransi[i].kdDesaKelurahan,
          "kdKotaKabupaten": table.listAsuransi[i].kdKotaKabupaten,
          "kdNegara": table.listAsuransi[i].kdNegara,
          "kdPropinsi": table.listAsuransi[i].kdPropinsi,
          "kodePos": table.listAsuransi[i].kodePos,
          "namaDesaKelurahan": table.listAsuransi[i].namaDesaKelurahan,
          "namaKotaKabupaten": table.listAsuransi[i].namaKotaKabupaten,
          "namaNegara": table.listAsuransi[i].namaNegara,
          "namaPropinsi": table.listAsuransi[i].namaPropinsi,
          "rTRW": table.listAsuransi[i].rTRW,
          "asuransiBerlaku": table.listAsuransi[i].asuransiBerlaku,
          "namaHubungan": table.listAsuransi[i].namaHubungan,
          "kdGolonganAsuransi": table.listAsuransi[i].kdGolonganAsuransi,
          "kdHubunganPeserta": table.listAsuransi[i].kdHubunganPeserta,
          "kdJenisKelamin": table.listAsuransi[i].kdJenisKelamin,
          "kdKelas": table.listAsuransi[i].kdKelas,
          "noKontakRekananAsal": table.listAsuransi[i].noKontakRekananAsal,
          "noKontakRekananPenjamin": table.listAsuransi[i].noKontakRekananPenjamin,
          "kdAlamat": table.listAsuransi[i].kdAlamat,
          "kdJenisAlamat": table.listAsuransi[i].kdJenisAlamat,
          "kdKecamatan": table.listAsuransi[i].kdKecamatan,
        }
      }
      this.alertService.success('Berhasil', 'Data Berhasil Ditampilkan');
      this.totalRecords = table.totalRow;
      this.totalRow = table.listAsuransi.length;
      this.listMonitoring = this.rowNumberService.addRowNumber(page, rows, list);

    });

  }
  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.sortBy, this.typeSort, null, null);
  }
  getService(tglAwal, tglAkhir) {
    this.getNegara('');
    this.getPropinsi('');
    this.getKotaKabupaten('');
    this.getKecamatan('');
    this.getDesaKelurahan('');


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisAlamat&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listJenisAlamat = [];
      this.listJenisAlamat.push({
        label: '--Pilih--', value: null
      });
      for (var i = 0; i < table.data.data.length; i++) {
        this.listJenisAlamat.push({
          label: table.data.data[i].namaJenisAlamat, value: table.data.data[i].id.kode
        })
      };
    });

    //hubunganPeserta
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/getHubunganPesertaAsuransi').subscribe(res => {
      this.listHubunganPeserta = [];
      this.listHubunganPeserta.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.length; i++) {
        this.listHubunganPeserta.push({ label: res[i].namaHubungan, value: res[i].kode.kode })
      };
    });

    //unitBagian
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=UnitBagian&select=namaUnitBagian,id.kode').subscribe(res => {
      this.listUnitBagian = [];
      this.listUnitBagian.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listUnitBagian.push({ label: res.data.data[i].namaUnitBagian, value: res.data.data[i].id_kode })
      };
    });

    //golonganAsuransi
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=GolonganAsuransi&select=namaGolonganAsuransi,id.kode').subscribe(res => {
      this.listGolonganAsuransi = [];
      this.listGolonganAsuransi.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listGolonganAsuransi.push({ label: res.data.data[i].namaGolonganAsuransi, value: res.data.data[i].id_kode })
      };
    });

    //kelas
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/getKelasDijamin').subscribe(table => {
      this.listKelas = [];
      this.listKelas.push({
        label: '-- Pilih --', value: null
      });
      for (var i = 0; i < table.length; i++) {
        this.listKelas.push({
          label: table[i].namaKelas, value: table[i].kode.kode
        })
      };
    });

    //perushaanAsalPeserta
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/getPerusahaanAsalPeserta').subscribe(table => {
      this.listPerusahaanAsal = [];
      this.listPerusahaanAsal.push({
        label: '-- Pilih --', value: null
      });
      for (var i = 0; i < table.length; i++) {
        this.listPerusahaanAsal.push({
          label: table[i].namaLengkap, value: table[i].kode.noKontak
        })
      };
    });


    //listPasien
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/findAllPasien').subscribe(table => {
      this.listPasien = [];
      this.listPasien.push({
        label: '--Pilih--', value: null
      });
      for (var i = 0; i < table.length; i++) {
        this.listPasien.push({
          label: table[i].noCM + ' - ' + table[i].namaLengkap, value: table[i].noCM
        })
      };
    });

    //listPegawaiProfile
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/findPegawaiAsPasien').subscribe(table => {
      this.listPegawai = [];
      this.listPegawai.push({
        label: '-- Pilih --', value: null
      });
      for (var i = 0; i < table.length; i++) {
        this.listPegawai.push({
          label: table[i].noCM + ' - ' + table[i].namaLengkap, value: table[i].noCM
        })
      };
    });

    //JenisKelamin
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=JenisKelamin&select=namaJenisKelamin,id.kode').subscribe(res => {
      this.listJenisKelamin = [];
      this.listJenisKelamin.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i].id_kode })
      };
    });


    //Rekanan
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getKontakPenjamin').subscribe(res => {
      this.listRekanan = [];
      this.listRekanan.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.length; i++) {
        this.listRekanan.push({ label: res[i].namaLengkap, value: res[i].kode.noKontak })
      };
    });

  }

  getJenisKelamin(data, from) {
    if (from == 'data') {
      if (data.kdJenisKelamin != '' && data.kdJenisKelamin != null) {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=JenisKelamin&select=namaJenisKelamin,id.kode&page=1&rows=1000&criteria=id.kode&values=' + data.kdJenisKelamin + '&condition=and').subscribe(table => {
          this.listJenisKelamin = [];
          for (var i = 0; i < table.data.data.length; i++) {
            this.listJenisKelamin.push({ label: table.data.data[i].namaJenisKelamin, value: table.data.data[i].id_kode })
          };
        });
      } else {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJkFromProfile').subscribe(table => {
          this.listJenisKelamin = [];
          this.listJenisKelamin.push({ label: '-- Pilih --', value: null });
          for (var i = 0; i < table.JenisKelamin.length; i++) {
            this.listJenisKelamin.push({ label: table.JenisKelamin[i].namaJenisKelamin, value: table.JenisKelamin[i].kode.kode })
          };
        });
      }
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJkFromProfile').subscribe(table => {
        this.listJenisKelamin = [];
        this.listJenisKelamin.push({ label: '-- Pilih --', value: null });
        for (var i = 0; i < table.JenisKelamin.length; i++) {
          this.listJenisKelamin.push({ label: table.JenisKelamin[i].namaJenisKelamin, value: table.JenisKelamin[i].kode.kode })
        };
      });
    }
  }

  sortingData(event) {
    if (!event.order) {
      this.sortBy = 'asuransi.tglDaftar';
      this.typeSort = 'asc';
    } else {
      this.sortBy = event.field;
      if (event.field == 'kontakRekananPenjamin') {
        this.sortBy = 'kontakRekananPenjamin.id.noKontak';
      }
      if (event.field == 'noAsuransi') {
        this.sortBy = 'pasien.id.noAsuransi';
      }
      if (event.field == 'noCM') {
        this.sortBy = 'pasien.id.noCM';
      }
      if (event.field == 'namaPeserta') {
        this.sortBy = 'asuransi.namaPeserta';
      }
      if (event.field == 'tglLahir') {
        this.sortBy = 'asuransi.tglLahir';
      }
      if (event.field == 'kodeExternalJenisKelamin') {
        this.sortBy = 'jenisKelamin.namaJenisKelamin';
      }
      if (event.field == 'namaGolonganAsuransi') {
        this.sortBy = 'golonganAsuransi.namaGolonganAsuransi';
      }
      if (event.field == 'namaKelas') {
        this.sortBy = 'kelas.namaKelas';
      }
      if (event.field == 'kontakRekananAsal') {
        this.sortBy = 'kontakRekananAsal.id.noKontak';
      }
      if (event.field == 'alamatLengkap') {
        this.sortBy = 'alamat.alamatLengkap';
      }
      if (event.field == 'namaHubungan') {
        this.sortBy = 'hubungan.namaHubungan';
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
    if (fromField == 'tglLahir') {
      let tglLahir = '';
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      let time = new Date(event);
      let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      let bulanAwal = monthNames[time.getMonth()];
      let tanggalAwal = time.getDate() + " " + bulanAwal + " " + time.getFullYear();
      this.tglLahirFilterMulti = '&tglLahirAwal=' + this.setTimeStamp(time.setHours(0, 0, 0, 0));
      this.tglLahirTitle = tanggalAwal;

      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'tglDaftar') {
      let tglLahir = '';
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      let time = new Date(event);
      let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      let bulanAwal = monthNames[time.getMonth()];
      let tanggalAwal = time.getDate() + " " + bulanAwal + " " + time.getFullYear();
      let tglDaftar = '';
      if (event !== null) {
        tglDaftar = this.setTimeStamp(time.setHours(0, 0, 0, 0));
        this.tglDaftarTitle = tanggalAwal;
      } else {
        tglDaftar = '';
        this.tglDaftarTitle = '';
      }


      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'kontakRekananPenjamin') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.kontakRekananPenjaminFilterMulti = "";
      if (this.kontakRekananPenjaminFilter.length > 0) {
        for (let i = 0; i < this.kontakRekananPenjaminFilter.length; i++) {
          if (this.kontakRekananPenjaminFilter[i].value != null) {
            this.kontakRekananPenjaminFilterMulti += "&noKontakRekananPenjamin[]=" + this.kontakRekananPenjaminFilter[i].value
          }
        }
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'noAsuransi') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }


    if (fromField == 'noCm') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaPeserta') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }

      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'jk') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.jenisKelaminFilterMulti = "";
      if (this.jenisKelaminFilter.length > 0) {
        for (let i = 0; i < this.jenisKelaminFilter.length; i++) {
          if (this.jenisKelaminFilter[i].value != null) {
            this.jenisKelaminFilterMulti += "&kdJenisKelamin[]=" + this.jenisKelaminFilter[i].value
          }
        }
      }

      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaGolonganAsuransi') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.namaGolonganAsuransiFilterMulti = "";
      if (this.namaGolonganAsuransiFilter.length > 0) {
        for (let i = 0; i < this.namaGolonganAsuransiFilter.length; i++) {
          if (this.namaGolonganAsuransiFilter[i].value != null) {
            this.namaGolonganAsuransiFilterMulti += "&kdGolonganAsuransi[]=" + this.namaGolonganAsuransiFilter[i].value
          }
        }
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaKelas') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.namaKelasFilterMulti = "";
      if (this.namaKelasFilter.length > 0) {
        for (let i = 0; i < this.namaKelasFilter.length; i++) {
          if (this.namaKelasFilter[i].value != null) {
            this.namaKelasFilterMulti += "&kdKelas[]=" + this.namaKelasFilter[i].value
          }
        }
      }

      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'kontakRekananAsal') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.kontakRekananAsalFilterMulti = "";
      if (this.kontakRekananAsalFilter.length > 0) {
        for (let i = 0; i < this.kontakRekananAsalFilter.length; i++) {
          if (this.kontakRekananAsalFilter[i].value != null) {
            this.kontakRekananAsalFilterMulti += "&noKontakRekananAsal[]=" + this.kontakRekananAsalFilter[i].value

          }
        }
      }

      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaHubungan') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.namaHubunganFilterMulti = "";
      if (this.namaHubunganFilter.length > 0) {
        for (let i = 0; i < this.namaHubunganFilter.length; i++) {
          if (this.namaHubunganFilter[i].value != null) {
            this.namaHubunganFilterMulti += "&kdHubungan[]=" + this.namaHubunganFilter[i].value

          }
        }
      }

      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.namaHubunganFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }


    if (fromField == 'alamatLengkap') {
      let tglLahir = '';
      let tglDaftar = '';
      if (this.tglDaftarFilter !== null && this.tglDaftarFilter !== "") {
        tglDaftar = this.setTimeStamp(this.tglDaftarFilter.setHours(0, 0, 0, 0));
      }
      if (this.tglLahirFilter !== null && this.tglLahirFilter !== "") {
        tglLahir = this.setTimeStamp(this.tglLahirFilter.setHours(0, 0, 0, 0));
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglDaftar=' + tglDaftar + this.kontakRekananPenjaminFilterMulti + '&noAsuransi=' + this.noAsuransiFilter + '&noCM=' + this.noCMFilter + '&namaPeserta=' + this.namaPesertaFilter + this.jenisKelaminFilterMulti + this.namaGolonganAsuransiFilterMulti + this.namaKelasFilterMulti + this.kontakRekananAsalFilterMulti + '&alamat=' + event + this.namaHubunganFilterMulti;
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

  tglDaftarOpen() {
    document.getElementById("tglDaftarPencarian").style.display = "block";
    document.getElementById("tglDaftarPencarianOpen").style.display = "none";
    document.getElementById("tglDaftarPencarianClose").style.display = "block";

  }

  tglDaftarClose() {
    document.getElementById("tglDaftarPencarian").style.display = "none";
    document.getElementById("tglDaftarPencarianOpen").style.display = "block";
    document.getElementById("tglDaftarPencarianClose").style.display = "none";

  }
  clearPencarian() {
    this.ngOnInit();
    this.iconTambahEdit = 'fa-plus';
    this.tanggalAwal = null;
    this.tanggalAkhir = null;
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, null, null);
  }

  cari() {
    this.getService(this.tanggalAwal, this.tanggalAkhir)
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
  }

  onRowSelect(event) {
    this.listDetailRegistrasiAsuransi = [];
    this.iconTambahEdit = 'fa-edit';
    this.form.get('kdPasien').setValue(event.data.noCM);
    if (event.data.noCM) {
      this.changePeserta({ value: event.data.noCM });
    } else {

      let dataAlamat = {
        value: {
          kdKecamatan: event.data.kdKecamatan,
          kdKotaKabupaten: event.data.kdKotaKabupaten,
          kdNegara: event.data.kdNegara,
          kdPropinsi: event.data.kdPropinsi,
          kode: event.data.kdDesaKelurahan,
          kodePos: event.data.kodePos
        }
      }
      this.changeNegara(dataAlamat, 'propinsi');
      if (event.data.kdPropinsi && event.data.kdNegara) {
        this.changePropinsi(dataAlamat, 'kotaKabupaten');
      }
      if (event.data.kdPropinsi && event.data.kdNegara && event.data.kdKecamatan && event.data.kdKotaKabupaten) {
        this.changeKecamatan(dataAlamat, 'desa');
      }
      if (event.data.kdNegara && event.data.kdKotaKabupaten) {
        this.changeKotaKabupaten(dataAlamat, 'kecamatan');
      }

      if (event.data.kdPropinsi && event.data.kdNegara && event.data.kdKecamatan && event.data.kdKotaKabupaten) {

        this.changeDesaKelurahan({
          value: {
            kdKotaKabupaten: event.data.kdKotaKabupaten,
            kdNegara: event.data.kdNegara,
            kdPropinsi: event.data.kdPropinsi,
            kode: event.data.kdKecamatan
          }
        }, 'noRm');
      }
      this.form.get('kdDesaKelurahan').setValue({
        "kdNegara": event.data.kdNegara,
        "kdPropinsi": event.data.kdPropinsi,
        "kdKotaKabupaten": event.data.kdKotaKabupaten,
        "kdKecamatan": event.data.kdKecamatan,
        "kode": event.data.kdDesaKelurahan,
        "kodePos": event.data.kodePos
      });
      this.form.get('kdDesaKelurahan').setValue({
        "kdNegara": event.data.kdNegara,
        "kdPropinsi": event.data.kdPropinsi,
        "kdKotaKabupaten": event.data.kdKotaKabupaten,
        "kdKecamatan": event.data.kdKecamatan,
        "kode": event.data.kdDesaKelurahan,
        "kodePos": event.data.kodePos
      });
      this.form.get('rtrw').setValue(event.data.rTRW);
      this.form.get('kodePos').setValue(event.data.kodePos);
      this.form.get('alamatLengkap').setValue(event.data.alamatLengkap);
    }
    this.form.get('kdJenisAlamat').setValue(event.data.kdJenisAlamat);
    if (event.data.noCM) {
      this.pasien = true;
      this.changeManual();
    }
    let asuransiBerlaku = event.data.asuransiBerlaku;
    for (var i = 0; i < asuransiBerlaku.length; i++) {
      let isCollectivePlafon = false;
      if (asuransiBerlaku[i].isCollectivePlafon == 1) {
        isCollectivePlafon = true;
      }
      let dataTemp = {
        "tglAkhirBerlakuLast": new Date(asuransiBerlaku[i].tglBerlakuAkhir * 1000),
        "tglAwalBerlakuLast": new Date(asuransiBerlaku[i].id.tglBerlakuAwal * 1000),
        "totalPlafon": asuransiBerlaku[i].totalPlafonTanggungan,
        "totalTerpakai": asuransiBerlaku[i].totalCurrentTerpakai,
        "totalSisaSaldo": asuransiBerlaku[i].totalSaldoTanggungan,
        "isCollectivePlafon": isCollectivePlafon,
        "statusEnabled": asuransiBerlaku[i].statusEnabled,
      }
      let listDetailRegistrasiAsuransi = [...this.listDetailRegistrasiAsuransi];
      listDetailRegistrasiAsuransi.push(dataTemp);
      this.listDetailRegistrasiAsuransi = listDetailRegistrasiAsuransi;
    };

    this.form.get("kdAlamat").setValue(event.data.kdAlamat);
    this.form.get("kdPerusahaanAsuransi").setValue(event.data.noKontakRekananPenjamin);
    this.form.get("noAsuransi").setValue(event.data.noAsuransi);
    this.form.get("kdHubunganPeserta").setValue(event.data.kdHubunganPeserta);
    this.form.get("namaLengkap").setValue(event.data.namaPeserta);
    this.form.get("tglLahir").setValue(new Date(event.data.tglLahir * 1000));
    this.form.get("kdJenisKelamin").setValue(event.data.kdJenisKelamin);
    this.form.get("kdGolonganAsuransi").setValue(event.data.kdGolonganAsuransi);
    this.form.get("kdKelas").setValue(event.data.kdKelas);
    this.form.get("kdPerusahaanAsal").setValue(event.data.noKontakRekananAsal);
    this.form.get("alamatLengkap").setValue(event.data.alamatLengkap);
    this.form.get("tglDaftar").setValue(new Date(event.data.tglDaftar * 1000));
    this.form.get("noCM").setValue(event.data.noCM);
    this.form.get("kdHubunganPeserta").disable();
    console.log(event);
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

  changeManual() {
    if (!this.pasien) {
      this.form.get('kdPasien').disable();
      this.form.get('kdPasien').setValue(null);
      this.form.get('pegawaiProfile').enable();
      this.getJenisKelamin(null, null);
    } else {
      this.form.get('pegawaiProfile').disable();
      this.form.get('kdPegawai').disable();
      this.form.get('kdPegawai').setValue(null);

      this.form.get('kdPasien').enable();
    }
  }

  cekPegawaiProfile() {
    if (!this.pegawaiProfile) {
      this.form.get('kdPegawai').disable();
      this.form.get('kdPegawai').setValue(null);
      this.form.get('pasien').enable();
      this.getJenisKelamin(null, null);
    } else {
      this.form.get('pasien').disable();
      this.form.get('kdPasien').disable();
      this.form.get('kdPasien').setValue(null);

      this.form.get('kdPegawai').enable();
    }
  }

  changePeserta(data) {
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiAsuransi/findPasienByNoCm?noCM=' + data.value).subscribe(table => {

      let dataAlamat = {
        value: {
          kdKecamatan: table.kdKecamatan,
          kdKotaKabupaten: table.kdKotaKabupaten,
          kdNegara: table.kdNegara,
          kdPropinsi: table.kdPropinsi,
          kode: table.kdDesaKelurahan,
          kodePos: table.kodePos
        }
      }
      this.changeNegara(dataAlamat, 'propinsi');
      if (table.kdPropinsi && table.kdNegara) {
        this.changePropinsi(dataAlamat, 'kotaKabupaten');
      }
      if (table.kdPropinsi && table.kdNegara && table.kdKecamatan && table.kdKotaKabupaten) {
        this.changeKecamatan(dataAlamat, 'desa');
      }
      if (table.kdNegara && table.kdKotaKabupaten) {
        this.changeKotaKabupaten(dataAlamat, 'kecamatan');
      }

      if (table.kdPropinsi && table.kdNegara && table.kdKecamatan && table.kdKotaKabupaten) {

        this.changeDesaKelurahan({
          value: {
            kdKotaKabupaten: table.kdKotaKabupaten,
            kdNegara: table.kdNegara,
            kdPropinsi: table.kdPropinsi,
            kode: table.kdKecamatan
          }
        }, 'noRm');
      }
      this.form.get('kdDesaKelurahan').setValue({
        "kdNegara": table.kdNegara,
        "kdPropinsi": table.kdPropinsi,
        "kdKotaKabupaten": table.kdKotaKabupaten,
        "kdKecamatan": table.kdKecamatan,
        "kode": table.kdDesaKelurahan,
        "kodePos": table.kodePos
      });
      this.form.get('kdDesaKelurahan').setValue({
        "kdNegara": table.kdNegara,
        "kdPropinsi": table.kdPropinsi,
        "kdKotaKabupaten": table.kdKotaKabupaten,
        "kdKecamatan": table.kdKecamatan,
        "kode": table.kdDesaKelurahan,
        "kodePos": table.kodePos
      });
      this.form.get('rtrw').setValue(table.rTRW);
      this.form.get('kodePos').setValue(table.kodePos);
      this.form.get('alamatLengkap').setValue(table.alamatLengkap);
      this.form.get('tglLahir').setValue(new Date(table.tglLahir * 1000));
      this.form.get('nip').setValue(table.nIPPNS);
      this.form.get('nik').setValue(table.nIKIntern);
      this.form.get('noAsuransi').setValue(table.noAsuransi);
      this.form.get('namaLengkap').setValue(table.namaLengkap);
      this.form.get('kdJenisKelamin').setValue(table.kdJenisKelamin);

      this.form.get('namaKecamatan').setValue(table.namaKecamatan);
      this.form.get('namaKotaKabupaten').setValue(table.namaKotaKabupaten);
      this.form.get('namaPendidikan').setValue(table.namaPendidikan);
      this.form.get('kodeExternalJenisKelamin').setValue(table.kodeExternalJenisKelamin);
      this.form.get('noIdentitas').setValue(table.noIdentitas);
      this.form.get('namaPekerjaan').setValue(table.namaPekerjaan);
      this.form.get('alamatEmail').setValue(table.alamatEmail);
      this.form.get('namaDesaKelurahan').setValue(table.namaDesaKelurahan);
      this.form.get('namaGolonganDarah').setValue(table.namaGolonganDarah);
      this.form.get('namaPropinsi').setValue(table.namaPropinsi);
      this.form.get('namaRekanan').setValue(table.namaRekanan);
      this.form.get('noCM').setValue(table.noCM);
      this.form.get('namaIbu').setValue(table.namaIbu);
      this.form.get('namaStatus').setValue(table.namaStatus);
      this.form.get('namaSuku').setValue(table.namaSuku);
      this.form.get('mobilePhone1').setValue(table.mobilePhone1);
      this.form.get('namaAgama').setValue(table.namaAgama);

      this.getJenisKelamin({ kdJenisKelamin: table.kdJenisKelamin }, 'data');

      // this.form.get('namaDepan').setValue(table.data.data[0].namaAwal);

    });
  }
  getNegara(namaNegara) {
    let search = '';
    if (namaNegara !== '') {
      search = '&namaNegara=' + namaNegara;
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?page=1&rows=100&dir=namaNegara&sort=asc' + search).subscribe(table => {
      this.listNegara = [];
      this.listNegara.push({ label: '--Pilih Negara--', value: { kode: null, wn: null } });
      for (var i = 0; i < table.Negara.length; i++) {
        this.listNegara.push({ label: table.Negara[i].namaNegara, value: { kode: table.Negara[i].kode, wn: table.Negara[i].namaExternal } })
      };
    });
  }

  getPropinsi(namaPropinsi) {
    let search = ''
    if (namaPropinsi !== '') {
      search = '&namaPropinsi=' + namaPropinsi
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?page=1&rows=100&dir=namaPropinsi&sort=asc' + search).subscribe(table => {
      this.listPropinsi = [];
      this.listPropinsi.push({
        label: '--Pilih Provinsi--', value: {
          "kdNegara": null,
          "kode": null
        }
      });
      for (var i = 0; i < table.Propinsi.length; i++) {
        this.listPropinsi.push({
          label: table.Propinsi[i].namaPropinsi, value: {
            "kdNegara": table.Propinsi[i].kode.kdNegara,
            "kode": table.Propinsi[i].kode.kode
          }
        })
      };
    });
  }

  getKotaKabupaten(namaKotaKabupaten) {
    let search = ''
    if (namaKotaKabupaten != '') {
      search = '&namaKotaKabupaten=' + namaKotaKabupaten
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?page=1&rows=100&dir=namaKotaKabupaten&sort=asc' + search).subscribe(table => {
      this.listKotaKabupaten = [];
      this.listKotaKabupaten.push({
        label: '--Pilih Kota Kabupaten--', value: {
          "kdNegara": null,
          "kdPropinsi": null,
          "kode": null
        }
      });
      for (var i = 0; i < table.KotaKabupaten.length; i++) {
        this.listKotaKabupaten.push({
          label: table.KotaKabupaten[i].namaKotaKabupaten, value: {
            "kdNegara": table.KotaKabupaten[i].kode.kdNegara,
            "kdPropinsi": table.KotaKabupaten[i].kdPropinsi,
            "kode": table.KotaKabupaten[i].kode.kode
          }
        })
      };
    });
  }

  getKecamatan(namaKecamatan) {
    let search = ''
    if (namaKecamatan != '') {
      search = '&namaKecamatan=' + namaKecamatan
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?page=1&rows=100&dir=namaKecamatan&sort=asc' + search).subscribe(table => {
      this.listKecamatan = [];
      this.listKecamatan.push({
        label: '--Pilih Kecamatan--', value: {
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kode": null
        }
      });
      for (var i = 0; i < table.Kecamatan.length; i++) {
        this.listKecamatan.push({
          label: table.Kecamatan[i].namaKecamatan, value: {
            "kdNegara": table.Kecamatan[i].kode.kdNegara,
            "kdPropinsi": table.Kecamatan[i].kdPropinsi,
            "kdKotaKabupaten": table.Kecamatan[i].kdKotaKabupaten,
            "kode": table.Kecamatan[i].kode.kode
          }
        })
      };
    });
  }


  getDesaKelurahan(namaDesaKelurahan) {
    let search = ''
    if (namaDesaKelurahan != '') {
      search = '&namaDesaKelurahan=' + namaDesaKelurahan
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=1&rows=100&dir=namaDesaKelurahan&sort=asc' + search).subscribe(table => {
      this.listDesaKelurahan = [];
      this.listDesaKelurahan.push({
        label: '--Pilih Kelurahan--', value: {
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kdKecamatan": null,
          "kode": null,
          "kodePos": null
        }
      });
      for (var i = 0; i < table.DesaKelurahan.length; i++) {
        this.listDesaKelurahan.push({
          label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
            "kdNegara": table.DesaKelurahan[i].kode.kdNegara,
            "kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
            "kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
            "kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
            "kode": table.DesaKelurahan[i].kode.kode,
            "kodePos": table.DesaKelurahan[i].kodePos,
          }
        })
      };
    });
  }

  onKeyUpFilterNegara(event) {
    this.getNegara(event.target.value.kode);
  }

  onKeyUpFilterPropinsi(event) {
    this.getPropinsi(event.target.value);
  }

  onKeyUpFilterKotaKabupaten(event) {
    this.getKotaKabupaten(event.target.value);
  }

  onKeyUpFilterKecamatan(event) {
    this.getKecamatan(event.target.value);
  }

  onKeyUpFilterDesaKelurahan(event) {
    this.getDesaKelurahan(event.target.value);
  }


  changeNegara(event, from) {
    if (from == 'propinsi') {
      this.httpService.get(Configuration.get().dataMasterNew + '/negara/findByKode/' + event.value.kdNegara).subscribe(table => {
        this.listNegara = [];
        this.listNegara.push({
          label: table.Negara.namaNegara, value: { kode: table.Negara.kode, wn: table.Negara.namaExternal }
        });
        this.form.get('kdNegara').setValue({ kode: table.Negara.kode, wn: table.Negara.namaExternal });
      });
    } else if (from == 'negara') {
      this.changePropinsi(event, 'negara');
    }
  }

  changePropinsi(event, from) {
    if (from == 'kotaKabupaten') {
      this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findByKode/' + event.value.kdPropinsi + '/' + event.value.kdNegara).subscribe(table => {
        this.listPropinsi = [];
        this.listPropinsi.push({
          label: table.Propinsi.namaPropinsi, value: {
            "kdNegara": table.Propinsi.kode.kdNegara,
            "kode": table.Propinsi.kode.kode
          }
        });
        this.form.get('kdPropinsi').setValue({
          "kdNegara": table.Propinsi.kode.kdNegara,
          "kode": table.Propinsi.kode.kode
        });
      });
    } else if (from == 'propinsi') {
      this.getDesaKelurahan('');
      this.getKecamatan('');
      this.changeKotaKabupaten(event, 'propinsi');
      this.changeNegara(event, 'propinsi');
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + event.value.kode).subscribe(table => {
        this.listPropinsi = [];
        this.listPropinsi.push({
          label: '--Pilih Propinsi--', value: {
            "kdNegara": null,
            "kode": null
          }
        });
        for (var i = 0; i < table.Propinsi.length; i++) {
          this.listPropinsi.push({
            label: table.Propinsi[i].namaPropinsi, value: {
              "kdNegara": table.Propinsi[i].kode.kdNegara,
              "kode": table.Propinsi[i].kode.kode
            }
          })
        };
        this.form.get('kdPropinsi').setValue({
          "kdNegara": null,
          "kode": null
        });
      });
    }
  }

  changeKotaKabupaten(event, from) {
    if (from == 'kecamatan') {
      this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findByKode/' + event.value.kdKotaKabupaten + '/' + event.value.kdNegara).subscribe(table => {
        this.listKotaKabupaten = [];
        this.listKotaKabupaten.push({
          label: table.KotaKabupaten.namaKotaKabupaten, value: {
            "kdNegara": table.KotaKabupaten.kode.kdNegara,
            "kdPropinsi": table.KotaKabupaten.kdPropinsi,
            "kode": table.KotaKabupaten.kode.kode
          }
        });
        this.form.get('kdKotaKabupaten').setValue({
          "kdNegara": table.KotaKabupaten.kode.kdNegara,
          "kdPropinsi": table.KotaKabupaten.kdPropinsi,
          "kode": table.KotaKabupaten.kode.kode
        });
      });
    } else if (from == 'kotaKabupaten') {
      this.getDesaKelurahan('');
      this.changeKecamatan(event, 'kotaKabupaten');
      this.changePropinsi(event, 'kotaKabupaten');
      this.changeNegara(event, 'propinsi');
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listKotaKabupaten = [];
        this.listKotaKabupaten.push({
          label: '--Pilih Kota Kabupaten--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kode": null
          }
        });
        for (var i = 0; i < table.KotaKabupaten.length; i++) {
          this.listKotaKabupaten.push({
            label: table.KotaKabupaten[i].namaKotaKabupaten, value: {
              "kdNegara": table.KotaKabupaten[i].kode.kdNegara,
              "kdPropinsi": table.KotaKabupaten[i].kdPropinsi,
              "kode": table.KotaKabupaten[i].kode.kode
            }
          })
        };
        this.form.get('kdKotaKabupaten').setValue({
          "kdNegara": null,
          "kdPropinsi": null,
          "kode": null
        });
      });
    }
  }

  changeKecamatan(event, from) {
    if (from == 'desa') {
      this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findByKode/' + event.value.kdKecamatan + '/' + event.value.kdNegara).subscribe(table => {
        this.listKecamatan = [];
        this.listKecamatan.push({
          label: table.Kecamatan.namaKecamatan, value: {
            "kdNegara": table.Kecamatan.kode.kdNegara,
            "kdPropinsi": table.Kecamatan.kdPropinsi,
            "kdKotaKabupaten": table.Kecamatan.kdKotaKabupaten,
            "kode": table.Kecamatan.kode.kode
          }
        });
        this.form.get('kdKecamatan').setValue({
          "kdNegara": table.Kecamatan.kode.kdNegara,
          "kdPropinsi": table.Kecamatan.kdPropinsi,
          "kdKotaKabupaten": table.Kecamatan.kdKotaKabupaten,
          "kode": table.Kecamatan.kode.kode
        });
      });
    } else if (from == 'kecamatan') {
      this.changeDesaKelurahan(event, 'kecamatan');
      this.changeKotaKabupaten(event, 'kecamatan');
      this.changePropinsi(event, 'kotaKabupaten');
      this.changeNegara(event, 'propinsi');
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listKecamatan = [];
        this.listKecamatan.push({
          label: '--Pilih Kecamatan--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kdKotaKabupaten": null,
            "kode": null
          }
        });
        for (var i = 0; i < table.Kecamatan.length; i++) {
          this.listKecamatan.push({
            label: table.Kecamatan[i].namaKecamatan, value: {
              "kdNegara": table.Kecamatan[i].kode.kdNegara,
              "kdPropinsi": table.Kecamatan[i].kdPropinsi,
              "kdKotaKabupaten": table.Kecamatan[i].kdKotaKabupaten,
              "kode": table.Kecamatan[i].kode.kode
            }
          })
        };
        this.form.get('kdKecamatan').setValue({
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kode": null
        });
      });
    }
  }

  changeDesaKelurahan(event, from) {
    if (from == 'desa') {
      this.changeKecamatan(event, 'desa');
      this.changeKotaKabupaten(event, 'kecamatan');
      this.changePropinsi(event, 'kotaKabupaten');
      this.changeNegara(event, 'propinsi');
      this.form.get('kodePos').setValue(event.value.kodePos);
    } else if (from == 'noRm') {
      this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listDesaKelurahan = [];
        this.listDesaKelurahan.push({
          label: '--Pilih Kelurahan--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kdKotaKabupaten": null,
            "kdKecamatan": null,
            "kode": null,
            "kodePos": null
          }
        });
        for (var i = 0; i < table.DesaKelurahan.length; i++) {
          this.listDesaKelurahan.push({
            label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
              "kdNegara": table.DesaKelurahan[i].kode.kdNegara,
              "kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
              "kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
              "kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
              "kode": table.DesaKelurahan[i].kode.kode,
              "kodePos": table.DesaKelurahan[i].kodePos
            }
          })
        };

      });
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listDesaKelurahan = [];
        this.listDesaKelurahan.push({
          label: '--Pilih Kelurahan--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kdKotaKabupaten": null,
            "kdKecamatan": null,
            "kode": null,
            "kodePos": null
          }
        });
        for (var i = 0; i < table.DesaKelurahan.length; i++) {
          this.listDesaKelurahan.push({
            label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
              "kdNegara": table.DesaKelurahan[i].kode.kdNegara,
              "kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
              "kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
              "kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
              "kode": table.DesaKelurahan[i].kode.kode,
              "kodePos": table.DesaKelurahan[i].kodePos
            }
          })
        };
        this.form.get('kdDesaKelurahan').setValue({
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kdKecamatan": null,
          "kode": null,
          "kodePos": null
        });
      });
    }
  }

  tambahPeserta() {
    this.registrasiDialog = true;
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
      this.alertService.warn("Peringatan", "Data Tidak Sesuai");
    } else {
      this.simpan();
    }
  }
  simpan() {
    let kdPegawai = null;
    if (this.form.get('kdPegawai').value) {
      kdPegawai = this.form.get('kdPegawai').value;
    }

    let asuransiBerlaku = [];

    for (let i = 0; i < this.listDetailRegistrasiAsuransi.length; i++) {
      let isCollectivePlafon = 0;
      let statusEnabled = 0;
      let tglAkhirBerlakuLast = null;
      let tglAwalBerlakuLast = null;

      if (this.listDetailRegistrasiAsuransi[i].statusEnabled == true) {
        statusEnabled = 1;
      }

      if (this.listDetailRegistrasiAsuransi[i].isCollectivePlafon == true) {
        isCollectivePlafon = 1;
      }


      if (this.listDetailRegistrasiAsuransi[i].tglAwalBerlakuLast) {
        tglAwalBerlakuLast = this.setTimeStamp(this.listDetailRegistrasiAsuransi[i].tglAwalBerlakuLast);

      }

      if (this.listDetailRegistrasiAsuransi[i].tglAkhirBerlakuLast) {
        tglAkhirBerlakuLast = this.setTimeStamp(this.listDetailRegistrasiAsuransi[i].tglAkhirBerlakuLast);

      }

      asuransiBerlaku[i] = {
        "isCollectivePlafon": isCollectivePlafon,
        "keteranganLainnya": "",
        "statusEnabled": statusEnabled,
        "tglBerlakuAkhir": tglAkhirBerlakuLast,
        "tglBerlakuAwal": tglAwalBerlakuLast,
        "totalCurrentTerpakai": this.listDetailRegistrasiAsuransi[i].totalTerpakai,
        "totalPlafonTanggungan": this.listDetailRegistrasiAsuransi[i].totalPlafon,
        "totalSaldoTanggungan": this.listDetailRegistrasiAsuransi[i].totalSisaSaldo
      }
    }

    let kdDesaKelurahan = null;
    let kdKecamatan = null;
    let kdKotaKabupaten = null;
    let kdNegara = null;
    let kdPropinsi = null;
    if (this.form.get('kdDesaKelurahan').value.kode) {
      kdDesaKelurahan = this.form.get('kdDesaKelurahan').value.kode;
    }
    if (this.form.get('kdKecamatan').value.kode) {
      kdKecamatan = this.form.get('kdKecamatan').value.kode;
    }
    if (this.form.get('kdKotaKabupaten').value.kode) {
      kdKotaKabupaten = this.form.get('kdKotaKabupaten').value.kode;
    }
    if (this.form.get('kdNegara').value.kode) {
      kdNegara = this.form.get('kdNegara').value.kode;
    }
    if (this.form.get('kdPropinsi').value.kode) {
      kdPropinsi = this.form.get('kdPropinsi').value.kode;
    }

    let penanda = false;
    for(let j=0; j<asuransiBerlaku.length; j++){
      if(asuransiBerlaku[j].tglBerlakuAwal == null || asuransiBerlaku[j].totalPlafonTanggungan == null
        || asuransiBerlaku[j].totalSaldoTanggungan == null || asuransiBerlaku[j].totalCurrentTerpakai == null ){
          penanda = true;
      }
    }

    if(penanda == true){
      this.alertService.warn('Perhatian','Tanggal Berlaku Awal, Total Plafon, Total Terpakai, dan Total Sisa Saldo Wajib Di Isi');
    }else{
      let data = {
        "alamatLengkap": this.form.get('alamatLengkap').value,
        "kdDesaKelurahan": kdDesaKelurahan,
        "kdJenisKelamin": this.form.get('kdJenisKelamin').value,
        "kdKecamatan": kdKecamatan,
        "kdKotaKabupaten": kdKotaKabupaten,
        "kdNegara": kdNegara,
        "kdPropinsi": kdPropinsi,
        "kodePos": this.form.get('kodePos').value,
        "noCM": this.form.get('noCM').value,
        "noIdentitas": this.form.get('noIdentitas').value,
        "tglDaftar": this.setTimeStamp(this.form.get('tglDaftar').value),
        "tglLahir": this.setTimeStamp(this.form.get('tglLahir').value),
        "rtrw": this.form.get('rtrw').value,
        "kdAlamat": this.form.get('kdAlamat').value,
        "kdGolonganAsuransi": this.form.get('kdGolonganAsuransi').value,
        "kdHubunganPeserta": this.form.get('kdHubunganPeserta').value,
        "kdKelasDiJamin": this.form.get('kdKelas').value,
        "kdPegawai": kdPegawai,
        "kdUnitBagianLast": this.form.get('kdUnitBagian').value,
        "namaPeserta": this.form.get('namaLengkap').value,
        "nippns": this.form.get('nip').value,
        "noAsuransi": this.form.get('noAsuransi').value,
        "noAsuransiHead": null,
        "noKontakRekananAsal": this.form.get('kdPerusahaanAsal').value,
        "noKontakRekananPenjamin": this.form.get('kdPerusahaanAsuransi').value,
        "statusEnabled": true,
        "asuransiBerlaku": asuransiBerlaku,
        "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
        // "tglAkhirBerlakuLast": this.setTimeStamp(this.form.get('tglBerlakuAwal').value),
        // "tglMulaiBerlakuLast": this.setTimeStamp(this.form.get('tglBerlakuAkhhir').value),
      }
      console.log(data);
      if (this.iconTambahEdit == 'fa-edit') {
        this.httpService.post(Configuration.get().klinik1Java + '/registrasiAsuransi/update', data).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Diupdate');
          this.buttonAktifSave = true;
        });
      } else {
        this.httpService.post(Configuration.get().klinik1Java + '/registrasiAsuransi/save', data).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.buttonAktifSave = true;
        });
  
      }
      
    }



  }

  clear() {
    // this.ngOnInit();
    this.form.get("kdHubunganPeserta").enable();
    this.form.get("kdPasien").disable();
    this.form.get("kdPasien").setValue(null);
    this.form.get("kdPegawai").setValue(null);
    this.form.get("kdPegawai").disable();
    this.form.get("nip").setValue(null);
    this.form.get("nik").setValue(null);
    this.form.get("kdPerusahaanAsuransi").setValue(null);
    this.form.get("noAsuransi").setValue(null);
    this.form.get("kdHubunganPeserta").setValue(null);
    this.form.get("namaLengkap").setValue(null);
    this.form.get("tglLahir").setValue(null);
    this.form.get("kdJenisKelamin").setValue(null);
    this.form.get("kdGolonganAsuransi").setValue(null);
    this.form.get("kdKelas").setValue(null);
    this.form.get("kdPerusahaanAsal").setValue(null);
    this.form.get("kdUnitBagian").setValue(null);
    // this.form.get("tglBerlakuAwal").setValue(null);
    // this.form.get("tglBerlakuAkhhir").setValue(null);
    this.form.get("alamatLengkap").setValue(null);
    this.form.get("rtrw").setValue(null);
    this.form.get("kodePos").setValue(null);
    this.form.get("kdNegara").setValue(null);
    this.form.get("kdPropinsi").setValue(null);
    this.form.get("kdKecamatan").setValue(null);
    this.form.get("kdKotaKabupaten").setValue(null);
    this.form.get("kdDesaKelurahan").setValue(null);
    this.form.get("pasien").setValue(null);
    this.form.get("pegawaiProfile").setValue(null);
    this.form.get("namaKecamatan").setValue(null);
    this.form.get("namaKotaKabupaten").setValue(null);
    this.form.get("namaPendidikan").setValue(null);
    this.form.get("tglDaftar").setValue(null);
    this.form.get("kodeExternalJenisKelamin").setValue(null);
    this.form.get("noIdentitas").setValue(null);
    this.form.get("namaPekerjaan").setValue(null);
    this.form.get("alamatEmail").setValue(null);
    this.form.get("namaDesaKelurahan").setValue(null);
    this.form.get("namaGolonganDarah").setValue(null);
    this.form.get("namaPropinsi").setValue(null);
    this.form.get("noCM").setValue(null);
    this.form.get("namaIbu").setValue(null);
    this.form.get("namaStatus").setValue(null);
    this.form.get("mobilePhone1").setValue(null);
    this.form.get("namaSuku").setValue(null);
    this.form.get("namaAgama").setValue(null);
    this.clearPencarian();
    this.registrasiDialog = true;
  }

  tambahDataDetailAsuransi() {
    let err = [];
    for (let i = 0; i < this.listDetailRegistrasiAsuransi.length; i++) {
      if (this.listDetailRegistrasiAsuransi[i].tglAwalBerlakuLast == null || this.listDetailRegistrasiAsuransi[i].tglAwalBerlakuLast == '') {
        err.push(this.listDetailRegistrasiAsuransi[i]);
      }
    }
    if (err.length > 0) {
      this.alertService.warn('Peringatan', 'Daftar Detail Registrasi Asuransi Tidak Lengkap, Tanggal Berlaku Awal Wajib Diisi!');
    } else {
      let dataTemp = {
        "tglAkhirBerlakuLast": null,
        "tglAwalBerlakuLast": null,
        "totalPlafon": null,
        "totalTerpakai": null,
        "totalSisaSaldo": null,
        "isCollectivePlafon": false,
        "statusEnabled": true,
      }
      let listDetailRegistrasiAsuransi = [...this.listDetailRegistrasiAsuransi];
      listDetailRegistrasiAsuransi.push(dataTemp);
      this.listDetailRegistrasiAsuransi = listDetailRegistrasiAsuransi;
    }
  }

  hapusDetailAsuransi(row) {
    let listDetailRegistrasiAsuransi = [...this.listDetailRegistrasiAsuransi];
    listDetailRegistrasiAsuransi.splice(row, 1);
    this.listDetailRegistrasiAsuransi = listDetailRegistrasiAsuransi;
  }

  onCloseDialog() {
    this.clear();
  }

  expandDetail(rowData: any, index: any) {
    if (this.indexExpand != null && index == this.indexExpand) {
      this.expandedDetailListAsuransi = [];
      this.indexExpand = null;
    } else {
      this.expandedDetailListAsuransi = [];
      this.expandedDetailListAsuransi.push(this.listMonitoring[index]);
      // dtEn.toggleRow(rowData);
      setTimeout(() => {
        let clas = document.getElementsByClassName('ui-expanded-row-content') as HTMLCollectionOf<HTMLElement>;
        clas[1].children[0].removeChild(clas[1].children[0].childNodes[3]);
        clas[1].style.height = clas[0].offsetHeight + 'px';
      }, 1);
      this.indexExpand = index;
    }
  }

  detailAsuransi(index) {
    this.listDetailAsuransi = [];
    this.listDetailAsuransi = this.listMonitoring[index].asuransiBerlaku;
    this.detailAsuransiDialog = true;
  }

  setHarga(value) {
    if (value != null) {
      return parseInt(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  }

}