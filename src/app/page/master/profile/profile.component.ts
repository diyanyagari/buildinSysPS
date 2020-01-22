import { Inject, forwardRef, Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Profile, DataSimpan } from './profile.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { TahapanAkreditasiComponent } from '../tahapanakreditasi/tahapanakreditasi.component';
declare var google: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit {
  item: Profile = new InisialProfile();;
  selected: Profile;
  listData: any[];
  listLevelTingkat: Profile[];
  listTahapanAkreditasiTerakhir: Profile[];
  listStatusAkreditasiTerakhir: Profile[];
  listAlamat: Profile[];
  listPegawaiKepala: Profile[];
  listDepartemen: Profile[];
  listKodeAccount: Profile[];
  listJenisProfile: Profile[];
  listPemilikProfile: Profile[];
  listStatusSuratIjin: Profile[];
  listSatuanKerja: Profile[];
  listJenisTarif: Profile[];
  listKodeProfileHead: Profile[];
  listNegara: Profile[];
  listMataUang: Profile[];
  listTypeProfile: Profile[];
  listJenisAlamat: Profile[];
  listPropinsi: any[];
  listKotaKabupaten: Profile[];
  listKecamatan: Profile[];
  listKelurahan: Profile[];
  pencarian: string;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  smbrFoto: string;
  namaFoto: string = null;
  photo: string;
  photoDiri: any;
  photoFiles: any[] = [];
  photoUrl: string;
  foto: any;
  kdNegara: any;
  kdPropinsi: any;
  kdKotaKabupaten: any;
  kdKecamatan: any;
  hostname1: any;
  alamat: any[];
  jenisAlamat: Profile[];
  tglRegistrasi: any;
  listDataDetail: any[];
  listAlamatBaru: any[] = [];
  cekAlamat: boolean;
  btnAlamat: boolean;
  btAlamat: any;
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  smbrFile: any;
  dataEmailTidakTersedia: boolean = false;
  responseEmail: string = "";
  dropdownNegara: Profile[];
  FilterNegara: string;
  listProp: any[];
  listLokasiTujuan = {
    'longitude': -6.1753924,
    'latitude': 106.8271528,
    'lokasi': ''
  };
  showMap = false;
  showAlamatBaru = false;
  showUpdateAlamat = false;
  lokasi: ''
  map: any

  latitude: number;
  longitude: number;
  zoom: number;
  notelepon;

  indexBaris: any;
  lokasiNama: any;
  pilihAlamat;
  jmlAlamatBaru: number = 0;

  @ViewChild("keywordsInput") keywordsInput;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('ogmap') ogmap: AgmMap
  searchElementRef: ElementRef;


  namaFotoBackground: any;
  smbrFotoBackground: any;
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private authGuard: AuthGuard,
    private mapsAPILoader: MapsAPILoader,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
  }


  ngAfterViewInit() {
    console.log(this.ogmap);
    this.ogmap.mapReady.subscribe(map => {
      this.map = map;
      console.log(this.map)
    });
    var x = document.getElementsByClassName("body .ui-radiobutton .ui-radiobutton-box.ui-state-active .ui-radiobutton-icon") as HTMLCollectionOf<HTMLElement>;
    for (var i = 0; i < x.length; i++) {
      x[i].style.marginBottom = '0vh';
    }
  }

  ngOnInit() {
    this.indexBaris = '';
    this.lokasiNama = '';
    this.zoom = 15;
    this.latitude = -6.1753924;
    this.longitude = 106.8271528;

    this.FilterNegara = '';
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

    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = false;
    this.tglRegistrasi = new Date();
    this.tglRegistrasi.setHours(0, 0, 0, 0);
    let tglRegistrasi = this.setTimeStamp(this.tglRegistrasi);
    this.alamat = [];
    this.listDataDetail = [];
    // this.cekAlamat = true;
    this.btnAlamat = false;
    this.get(this.page, this.rows, '');


    //'ambilFoto': new FormControl(''),

    this.form = this.fb.group({
      "kode": new FormControl(''),
      "namaLengkap": new FormControl('', Validators.required),
      "reportDisplay": new FormControl('', Validators.required),
      "tglRegistrasi": new FormControl(''),
      "luasTanah": new FormControl('', Validators.required),
      "luasBangunan": new FormControl('', Validators.required),
      "kdAlamat": new FormControl(''),
      "mottoLast": new FormControl(''),
      "semboyanLast": new FormControl(''),
      "sloganLast": new FormControl(''),
      "taglineLast": new FormControl(''),
      "kdPegawaiKepala": new FormControl(''),
      "gambarLogo": new FormControl(''),
      "npwp": new FormControl(''),
      "noPKP": new FormControl(''),
      "kdJenisProfile": new FormControl('', Validators.required),
      "kdProfileHead": new FormControl(null),
      "kdNegara": new FormControl(''),
      "kdMataUang": new FormControl(''),
      "kodeExternal": new FormControl(''),
      "namaExternal": new FormControl(''),
      "hostname1": new FormControl(''),
      "statusEnabled": new FormControl('', Validators.required),
      'ambilFoto': new FormControl(''),
      'backgroundKartuPasien': new FormControl(''),
    });
    this.getNegara();

    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(res => {
      this.versi = res.profile.version;
      this.form.get('kode').setValue(res.profile.kode);
      this.form.get('namaLengkap').setValue(res.profile.namaLengkap);
      this.form.get('reportDisplay').setValue(res.profile.reportDisplay);
      this.form.get('luasTanah').setValue(res.profile.luasTanah);
      this.form.get('luasBangunan').setValue(res.profile.luasBangunan);
      this.form.get('kdAlamat').setValue(res.profile.kdAlamat);
      this.pilihAlamat = res.profile.kdAlamat;
      this.form.get('mottoLast').setValue(res.profile.mottoLast);
      this.form.get('semboyanLast').setValue(res.profile.semboyanLast);
      this.form.get('sloganLast').setValue(res.profile.sloganLast);
      this.form.get('taglineLast').setValue(res.profile.taglineLast);
      this.form.get('kdPegawaiKepala').setValue(res.profile.kdPegawaiKepala);
      this.form.get('gambarLogo').setValue(res.profile.gambarLogo);
      this.form.get('npwp').setValue(res.profile.nPWP);
      this.form.get('noPKP').setValue(res.profile.noPKP);
      this.form.get('kdJenisProfile').setValue(res.profile.kdJenisProfile);
      this.form.get('kdProfileHead').setValue(res.profile.kdProfileHead);
      this.form.get('kdNegara').setValue(res.profile.kdNegara);
      this.ambilMataUang(res.profile.kdNegara);
      this.form.get('kdMataUang').setValue(res.profile.kdMataUang);
      this.form.get('kodeExternal').setValue(res.profile.kodeExternal);
      this.form.get('namaExternal').setValue(res.profile.namaExternal);
      this.form.get('statusEnabled').setValue(res.profile.statusEnabled);
      this.form.get('hostname1').setValue(res.profile.hostname1);
      this.form.get('backgroundKartuPasien').setValue(res.profile.backgroundKartuPasien);
      if (res.profile.tglRegistrasi != null) {
        this.form.get('tglRegistrasi').setValue(new Date(res.profile.tglRegistrasi * 1000));
      }
      if (res.profile.gambarLogo != null) {
        this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + res.profile.gambarLogo + '?noProfile=false';
      } else {
        this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
      }

      if (res.profile.backgroundKartuPasien != null) {
        this.smbrFotoBackground = Configuration.get().resourceFile + '/image/show/' + res.profile.backgroundKartuPasien + '?noProfile=false';
      } else {
        this.smbrFotoBackground = Configuration.get().resourceFile + "/image/show/profile1213123.png";
      }

      // this.httpService.get(Configuration.get().dataHr2Mod2 + '/profile/Profile/AlamatProfile?kdProfile=' + this.kdprof + '&PageIndex=0&PageSize=10').subscribe(table => {
      //   this.listDataDetail = table.items;


      // for (let i = 0; i < table.Alamat.length; i++) {
      //   let dataFix =
      //   {
      //     jenisAlamat: {
      //       kode: table.Alamat[i].kdJenisAlamat,
      //       namaJenisAlamat: table.Alamat[i].namaJenisAlamat,
      //       kdJenisAlamat: table.Alamat[i].kdJenisAlamat,
      //     },
      //     alamatLengkap: table.Alamat[i].alamatLengkap,
      //     rtrw: table.Alamat[i].rTRW,
      //     negara: {
      //       kode: table.Alamat[i].kdNegara,
      //       namaNegara: table.Alamat[i].namaNegara,
      //       kdNegara: table.Alamat[i].kdNegara,
      //     },
      //     propinsi: {
      //       kode: table.Alamat[i].kdPropinsi,
      //       namaPropinsi: table.Alamat[i].namaPropinsi,
      //       kdPropinsi: table.Alamat[i].kdPropinsi,
      //     },
      //     kota: {
      //       kode: table.Alamat[i].kdKotaKabupaten,
      //       namaKotaKabupaten: table.Alamat[i].namaKotaKabupaten,
      //       kdKotaKabupaten: table.Alamat[i].kdKotaKabupaten,
      //     },
      //     kecamatan: {
      //       kode: table.Alamat[i].kdKecamatan,
      //       namaKecamatan: table.Alamat[i].namaKecamatan,
      //       kdKecamatan: table.Alamat[i].kdKecamatan,
      //     },
      //     kelurahan: {
      //       kode: table.Alamat[i].kdDesaKelurahan,
      //       namaDesaKelurahan: table.Alamat[i].namaDesaKelurahan,
      //       kdDesaKelurahan: table.Alamat[i].kdDesaKelurahan,
      //     },
      //     kodePos: table.Alamat[i].kodePos,
      //     statusAktif: table.Alamat[i].statusEnabled,
      //     kode: table.Alamat[i].kode.kode,
      //     garisLintangLatitude: table.Alamat[i].garisLintangLatitude,
      //     garisBujurLongitude: table.Alamat[i].garisBujurLongitude


      //   }
      //   this.listDataDetail.push(dataFix);
      // }
      // if (table.Alamat.length) {
      //   // this.cekAlamat = false;
      //   this.btnAlamat = false;
      // } else {
      //   // this.cekAlamat = true;
      //   this.btnAlamat = true;
      // }

      // });

      // this.httpService.get(Configuration.get().dataMasterNew + '/profile/getAlamat').subscribe(table => {
      //   this.listDataDetail = [];


      //   for (let i = 0; i < table.Alamat.length; i++) {
      //     let dataFix =
      //     {
      //       jenisAlamat: {
      //         kode: table.Alamat[i].kdJenisAlamat,
      //         namaJenisAlamat: table.Alamat[i].namaJenisAlamat,
      //         kdJenisAlamat: table.Alamat[i].kdJenisAlamat,
      //       },
      //       alamatLengkap: table.Alamat[i].alamatLengkap,
      //       rtrw: table.Alamat[i].rTRW,
      //       negara: {
      //         kode: table.Alamat[i].kdNegara,
      //         namaNegara: table.Alamat[i].namaNegara,
      //         kdNegara: table.Alamat[i].kdNegara,
      //       },
      //       propinsi: {
      //         kode: table.Alamat[i].kdPropinsi,
      //         namaPropinsi: table.Alamat[i].namaPropinsi,
      //         kdPropinsi: table.Alamat[i].kdPropinsi,
      //       },
      //       kota: {
      //         kode: table.Alamat[i].kdKotaKabupaten,
      //         namaKotaKabupaten: table.Alamat[i].namaKotaKabupaten,
      //         kdKotaKabupaten: table.Alamat[i].kdKotaKabupaten,
      //       },
      //       kecamatan: {
      //         kode: table.Alamat[i].kdKecamatan,
      //         namaKecamatan: table.Alamat[i].namaKecamatan,
      //         kdKecamatan: table.Alamat[i].kdKecamatan,
      //       },
      //       kelurahan: {
      //         kode: table.Alamat[i].kdDesaKelurahan,
      //         namaDesaKelurahan: table.Alamat[i].namaDesaKelurahan,
      //         kdDesaKelurahan: table.Alamat[i].kdDesaKelurahan,
      //       },
      //       kodePos: table.Alamat[i].kodePos,
      //       statusAktif: table.Alamat[i].statusEnabled,
      //       kode: table.Alamat[i].kode.kode,
      //       garisLintangLatitude: table.Alamat[i].garisLintangLatitude,
      //       garisBujurLongitude: table.Alamat[i].garisBujurLongitude


      //     }
      //     this.listDataDetail.push(dataFix);
      //   }
      //   // if (table.Alamat.length) {
      //   //   // this.cekAlamat = false;
      //   //   this.btnAlamat = false;
      //   // } else {
      //   //   // this.cekAlamat = true;
      //   //   this.btnAlamat = true;
      //   // }

      // });
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listLevelTingkat = [];
      this.listLevelTingkat.push({ label: '--Pilih Level Tingkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listLevelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listLevelTingkat = [];
      this.listLevelTingkat.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=TahapanAkreditasi&select=namaTahapanAkreditasi,id').subscribe(res => {
      this.listTahapanAkreditasiTerakhir = [];
      this.listTahapanAkreditasiTerakhir.push({ label: '--Pilih Tahapan Akreditasi Terakhir--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listTahapanAkreditasiTerakhir.push({ label: res.data.data[i].namaTahapanAkreditasi, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listTahapanAkreditasiTerakhir = [];
      this.listTahapanAkreditasiTerakhir.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?page=1&rows=10&dir=namaStatus&sort=desc&kdStatusHead=12').subscribe(res => {
      this.listStatusAkreditasiTerakhir = [];
      this.listStatusAkreditasiTerakhir.push({ label: '--Pilih Status Akreditasi Terakhir--', value: '' })
      for (var i = 0; i < res.Status.length; i++) {
        this.listStatusAkreditasiTerakhir.push({ label: res.Status[i].namaStatus, value: res.Status[i].kode.kode })
      };
    }, error => {
      this.listStatusAkreditasiTerakhir = [];
      this.listStatusAkreditasiTerakhir.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Alamat&select=alamatLengkap,id').subscribe(res => {
      this.listAlamat = [];
      this.listAlamat.push({ label: '--Pilih Alamat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listAlamat.push({ label: res.data.data[i].alamatLengkap, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listAlamat = [];
      this.listAlamat.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
      this.listPegawaiKepala = [];
      this.listPegawaiKepala.push({ label: '--Pilih Pegawai Kepala--', value: '' })
      for (var i = 0; i < res.Data.length; i++) {
        this.listPegawaiKepala.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
      };
    }, error => {
      this.listPegawaiKepala = [];
      this.listPegawaiKepala.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ChartOfAccount&select=namaAccount,id').subscribe(res => {
      this.listKodeAccount = [];
      this.listKodeAccount.push({ label: '--Pilih Kode Account--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKodeAccount.push({ label: res.data.data[i].namaAccount, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listKodeAccount = [];
      this.listKodeAccount.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisprofile/findAll?page=1&rows=10&dir=namaJenisProfile&sort=desc').subscribe(res => {
      this.listJenisProfile = [];
      this.listJenisProfile.push({ label: '--Pilih Jenis Profile--', value: '' })
      for (var i = 0; i < res.JenisProfile.length; i++) {
        this.listJenisProfile.push({ label: res.JenisProfile[i].namaJenisProfile, value: res.JenisProfile[i].kdJenisProfile })
      };
    }, error => {
      this.listJenisProfile = [];
      this.listJenisProfile.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokPemilikProfile&select=kelompokPemilik,id').subscribe(res => {
      this.listPemilikProfile = [];
      this.listPemilikProfile.push({ label: '--Pilih Pemilik Profile--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listPemilikProfile.push({ label: res.data.data[i].kelompokPemilik, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listPemilikProfile = [];
      this.listPemilikProfile.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
      this.listStatusSuratIjin = [];
      this.listStatusSuratIjin.push({ label: '--Pilih Status Surat Ijin--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listStatusSuratIjin.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listStatusSuratIjin = [];
      this.listStatusSuratIjin.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listLevelTingkat = [];
      this.listLevelTingkat.push({ label: '--Pilih Level tingkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listLevelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listLevelTingkat = [];
      this.listLevelTingkat.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanKerja&select=namaSatuanKerja,id').subscribe(res => {
      this.listSatuanKerja = [];
      this.listSatuanKerja.push({ label: '--Pilih Satuan Kerja--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listSatuanKerja.push({ label: res.data.data[i].namaSatuanKerja, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listSatuanKerja = [];
      this.listSatuanKerja.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisTarif&select=namaJenisTarif,id').subscribe(res => {
      this.listJenisTarif = [];
      this.listJenisTarif.push({ label: '--Pilih Jenis Tarif--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisTarif.push({ label: res.data.data[i].namaJenisTarif, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.listJenisTarif = [];
      this.listJenisTarif.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findAll?page=1&rows=1000&dir=namaLengkap&sort=desc').subscribe(res => {
      this.listKodeProfileHead = [];
      this.listKodeProfileHead.push({ label: '--Pilih Data Parent Profil--', value: null })
      for (var i = 0; i < res.Profile.length; i++) {
        this.listKodeProfileHead.push({ label: res.Profile[i].namaLengkap, value: res.Profile[i].kode })
      };
    }, error => {
      this.listKodeProfileHead = [];
      this.listKodeProfileHead.push({ label: '-- ' + error + ' --', value: '' })
    });
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MataUang&select=namaMataUang,id').subscribe(res => {
    //   this.listMataUang = [];
    //   this.listMataUang.push({ label: '--Pilih Mata Uang--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.listMataUang.push({ label: res.data.data[i].namaMataUang, value: res.data.data[i].id.kode })
    //   };
    // }, error => {
    //   this.listMataUang = [];
    //   this.listMataUang.push({ label: '-- ' + error + ' --', value: '' })
    // });
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=TypeProfile&select=namaTypeProfile,id').subscribe(res => {
    //   this.listTypeProfile = [];
    //   this.listTypeProfile.push({ label: '--Pilih Type Profile--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.listTypeProfile.push({ label: res.data.data[i].namaTypeProfile, value: res.data.data[i].id.kode })
    //   };
    // }, error => {
    //             this.listTypeProfile = [];
    //             this.listTypeProfile.push({label:'-- '+ error +' --', value:''})
    //           });

    this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(res => {
      this.listNegara = [];
      this.listNegara.push({ label: '--Pilih Negara--', value: '' })
      for (var i = 0; i < res.Negara.length; i++) {
        this.listNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i] })
      };
    }, error => {
      this.listNegara = [];
      this.listNegara.push({ label: '-- ' + error + ' --', value: '' })
    });

    //this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisAlamat&select=namaJenisAlamat,id').subscribe(res => {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/getJenisAlamat').subscribe(res => {
      this.listJenisAlamat = [];
      this.listJenisAlamat.push({ label: '--Pilih Jenis Alamat--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.listJenisAlamat.push({ label: res.data[i].namaJenisAlamat, value: res.data[i] })
      };

    }, error => {
      this.listJenisAlamat = [];
      this.listJenisAlamat.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.getSmbrFile();
    this.getDataListDetail(this.page, this.rows);
  }

  getNegara() {
    this.dropdownNegara = [];
    this.dropdownNegara.push({ label: '--Pilih Negara--', value: '' })
    this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
      for (var i = 0; i < res.Negara.length; i++) {
        this.dropdownNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
      };
    });
  }

  ambilMataUang(event) {
    let kdNegara;
    if (event.value == undefined) {
      kdNegara = event;
    } else {
      kdNegara = event.value;
    }

    this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAllMataUang?kdNegara=' + kdNegara).subscribe(res => {
      this.listMataUang = [];
      this.listMataUang.push({ label: '--Pilih Mata Uang--', value: '' })
      for (var i = 0; i < res.MataUang.length; i++) {
        this.listMataUang.push({ label: res.MataUang[i].namaMataUang, value: res.MataUang[i].kode.kode })
      };
    }, error => {
      this.listMataUang = [];
      this.listMataUang.push({ label: '-- ' + error + ' --', value: '' })
    });
  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }


  getProvinsi(kd, ri) {
    // console.log(kd)
    if (kd == undefined) {

      this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi').subscribe(res => {
        this.listPropinsi = [];
        this.listPropinsi.push({ label: '--Pilih Propinsi--', value: '' })
        for (var i = 0; i < res.Propinsi.length; i++) {
          this.listPropinsi.push({ label: res.Propinsi[i].namaPropinsi, value: res.Propinsi[i] })
        };
      });

    } else {

      this.listAlamatBaru[ri].propinsi.namaPropinsi = "--Pilih--";
      this.listAlamatBaru[ri].listProp = [];
      this.listAlamatBaru[ri].listProp.push({ label: '--Pilih Propinsi--', value: '' });

      this.listAlamatBaru[ri].kotaKabupaten.namaKota = "--Pilih--";
      this.listAlamatBaru[ri].listKot = [];
      this.listAlamatBaru[ri].listKot.push({ label: '--Pilih Kota Kabupaten--', value: '' });

      this.listAlamatBaru[ri].kecamatan.namaKecamatan = "--Pilih--";
      this.listAlamatBaru[ri].listKec = [];
      this.listAlamatBaru[ri].listKec.push({ label: '--Pilih Kecamatan--', value: '' });

      // if (this.listDataDetail[ri].desaKelurahan != null) {
      this.listAlamatBaru[ri].desaKelurahan.namaKelurahan = "--Pilih--";
      this.listAlamatBaru[ri].listKel = [];
      this.listAlamatBaru[ri].listKel.push({ label: '--Pilih Kelurahan--', value: '' });
      // } else {
      //   this.listDataDetail[ri].desaKelurahan = "--Pilih--";
      //   this.listDataDetail[ri].listKel = [];
      //   this.listDataDetail[ri].listKel.push({ label: '--Pilih Kelurahan--', value: '' });
      // }


      this.listAlamatBaru[ri].kodePos = "";

      this.listAlamatBaru[ri].garisLintangLatitude = 0.0
      this.listAlamatBaru[ri].garisBujurLongitude = 0.0

      this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + kd).subscribe(res => {
        this.listAlamatBaru[ri].listProp = [];
        this.listAlamatBaru[ri].listProp.push({ label: '--Pilih Propinsi--', value: '' });
        for (var i = 0; i < res.Propinsi.length; i++) {
          let listProp = [];
          listProp[i] = {
            "kdPropinsi": res.Propinsi[i].kode.kode,
            "namaPropinsi": res.Propinsi[i].namaPropinsi
          }
          this.listAlamatBaru[ri].listProp.push({ label: res.Propinsi[i].namaPropinsi, value: listProp[i] });
        }
      });
    }
  }
  getKota(kd, kdnegara, ri) {

    if (kdnegara.kdNegara == undefined) {
      kdnegara = kdnegara.kode;
    } else {
      kdnegara = kdnegara.kdNegara;
    }

    if (kd != '' || kd != null || kdnegara != '' || kdnegara != null) {

      this.listAlamatBaru[ri].kotaKabupaten.namaKota = "--Pilih--";
      this.listAlamatBaru[ri].listKot = [];
      this.listAlamatBaru[ri].listKot.push({ label: '--Pilih Kota Kabupaten--', value: '' });

      this.listAlamatBaru[ri].kecamatan.namaKecamatan = "--Pilih--";
      this.listAlamatBaru[ri].listKec = [];
      this.listAlamatBaru[ri].listKec.push({ label: '--Pilih Kecamatan--', value: '' });

      this.listAlamatBaru[ri].desaKelurahan.namaKelurahan = "--Pilih--";
      this.listAlamatBaru[ri].listKel = [];
      this.listAlamatBaru[ri].listKel.push({ label: '--Pilih Kelurahan--', value: '' });

      this.listAlamatBaru[ri].kodePos = "";

      this.listAlamatBaru[ri].garisLintangLatitude = 0.0
      this.listAlamatBaru[ri].garisBujurLongitude = 0.0


      this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + kd + '&kdNegara=' + kdnegara).subscribe(res => {
        this.listAlamatBaru[ri].listKot = [];
        this.listAlamatBaru[ri].listKot.push({ label: '--Pilih Kota Kabupaten--', value: '' });
        for (var i = 0; i < res.KotaKabupaten.length; i++) {
          let listKot = [];
          listKot[i] = {
            "kdKotaKabupaten": res.KotaKabupaten[i].kode.kode,
            "namaKota": res.KotaKabupaten[i].namaKotaKabupaten,
          }
          this.listAlamatBaru[ri].listKot.push({ label: res.KotaKabupaten[i].namaKotaKabupaten, value: listKot[i] });
        };
      });

    }

  }


  getKecamatan(kd, kdnegara, ri) {
    if (kdnegara.kdNegara == undefined) {
      kdnegara = kdnegara.kode;
    } else {
      kdnegara = kdnegara.kdNegara;
    }

    if (kd != '' || kd != null || kdnegara != '' || kdnegara != null) {

      this.listAlamatBaru[ri].kecamatan.namaKecamatan = "--Pilih--";
      this.listAlamatBaru[ri].listKec = [];
      this.listAlamatBaru[ri].listKec.push({ label: '--Pilih Kecamatan--', value: '' });

      this.listAlamatBaru[ri].desaKelurahan.namaKelurahan = "--Pilih--";
      this.listAlamatBaru[ri].listKel = [];
      this.listAlamatBaru[ri].listKel.push({ label: '--Pilih Kelurahan--', value: '' });

      this.listAlamatBaru[ri].kodePos = "";

      this.listAlamatBaru[ri].garisLintangLatitude = 0.0
      this.listAlamatBaru[ri].garisBujurLongitude = 0.0


      this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + kd + '&kdNegara=' + kdnegara).subscribe(res => {
        this.listAlamatBaru[ri].listKec = [];
        this.listAlamatBaru[ri].listKec.push({ label: '--Pilih Kecamatan--', value: '' })
        for (var i = 0; i < res.Kecamatan.length; i++) {
          let listKec = [];
          listKec[i] = {
            "kdKecamatan": res.Kecamatan[i].kode.kode,
            "namaKecamatan": res.Kecamatan[i].namaKecamatan,
          }
          this.listAlamatBaru[ri].listKec.push({ label: res.Kecamatan[i].namaKecamatan, value: listKec[i] })
        };
      });
    }
  }


  getKelurahan(kd, kdnegara, ri) {

    if (kdnegara.kdNegara == undefined) {
      kdnegara = kdnegara.kode;
    } else {
      kdnegara = kdnegara.kdNegara;
    }
    if (kd != '' || kd != null || kdnegara != '' || kdnegara != null) {

      this.listAlamatBaru[ri].desaKelurahan.namaKelurahan = "--Pilih--";
      this.listAlamatBaru[ri].listKel = [];
      this.listAlamatBaru[ri].listKel.push({ label: '--Pilih Kelurahan--', value: '' });

      this.listAlamatBaru[ri].kodePos = "";

      this.listAlamatBaru[ri].garisLintangLatitude = 0.0
      this.listAlamatBaru[ri].garisBujurLongitude = 0.0


      this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + kd + '&kdNegara=' + kdnegara).subscribe(res => {
        this.listAlamatBaru[ri].listKel = [];
        this.listAlamatBaru[ri].listKel.push({ label: '--Pilih Kelurahan--', value: '' })
        for (var i = 0; i < res.DesaKelurahan.length; i++) {
          let listKel = [];
          listKel[i] = {
            "kdDesaKelurahan": res.DesaKelurahan[i].kode.kode,
            "namaKelurahan": res.DesaKelurahan[i].namaDesaKelurahan,
          }
          this.listAlamatBaru[ri].listKel.push({ label: res.DesaKelurahan[i].namaDesaKelurahan, value: listKel[i] })
        };
      });
    }
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.Profile;
      this.totalRecords = table.totalRow;

    });
  }

  getDataListDetail(page: number, rows: number) {
    page = page - 1;
    this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/AlamatProfile?kdProfile=' + this.kdprof + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(table => {
      // this.listAlamatBaru = table.items;
      this.listDataDetail = table.items;

      this.totalRecords = table.totalCount;
    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=deskripsi&sort=desc&deskripsi=' + this.pencarian).subscribe(table => {
      this.listData = table.Profile;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getDataListDetail((event.rows + event.first) / event.rows, event.rows);
    // this.get((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  tambahAlamat() {
    this.listAlamatBaru = [];

    // if(this.listDataDetail.length == 0){
    // this.jmlAlamatBaru = this.jmlAlamatBaru + 1;
    let dataTemp = {
      "fixedPhone1": null,
      "website": null,
      "email": null,
      "jenisAlamat": {
        "kdJenisAlamat": null,
        "jenisAlamat": "--Pilih--",
      },
      "alamatLengkap": "",
      "rtrw": "",
      "negara": {
        "kdNegara": null,
        "namaNegara": "--Pilih--",
      },
      "propinsi": {
        "kdPropinsi": null,
        "namaPropinsi": "--Pilih--",
      },
      "kotaKabupaten": {
        "kdKota": null,
        "namaKota": "--Pilih--",
      },
      "kecamatan": {
        "kdKecamatan": null,
        "namaKecamatan": "--Pilih--",
      },
      "desaKelurahan": {
        "kdKelurahan": null,
        "namaKelurahan": "--Pilih--",
      },
      "kodePos": "",
      "statusAktif": true,
      // "kode": null,
      "latitude": 0.0,
      "longitude": 0.0

    }
    // let listAlamatBaru = [...this.listAlamatBaru];
    // listAlamatBaru.push(dataTemp);
    this.notelepon = '';
    this.listAlamatBaru.push(dataTemp);
    console.log(this.listAlamatBaru)
    this.showAlamatBaru = true;
    // }else{
    //   let kdAlamat;
    //   let last = this.listDataDetail.length - 1;
    //   if(this.listDataDetail[last].jenisAlamat.kode != undefined){
    //     kdAlamat = this.listDataDetail[last].jenisAlamat.kode;
    //   }else if(this.listDataDetail[last].jenisAlamat.kode == undefined){
    //     kdAlamat = this.listDataDetail[last].jenisAlamat.id.kode;
    //   }else if(this.listDataDetail[last].jenisAlamat.kdJenisAlamat == null){
    //     kdAlamat = undefined;
    //   }
    //   if(kdAlamat == undefined ){
    //     this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
    //   }else{
    //     // for (let i = 0; i < this.listJenisAlamat.length; i++) {
    //     //   if (this.listJenisAlamat[i].value.kdJenisAlamat == this.listDataDetail[last].jenisAlamat.kdJenisAlamat) {
    //     //       this.listJenisAlamat.splice(i, 1);
    //     //   }
    //     // }

    //     let dataTemp = {
    //       "jenisAlamat": {
    //         "kdJenisAlamat": null,
    //         "namaJenisAlamat": "--Pilih--",
    //       },
    //       "alamatLengkap": "",
    //       "rtrw": "",
    //       "negara": {
    //         "kdNegara": null,
    //         "namaNegara": "--Pilih--",
    //       },
    //       "propinsi": {
    //         "kdPropinsi": null,
    //         "namaPropinsi": "--Pilih--",
    //       },
    //       "kota": {
    //         "kdKotaKabupaten": null,
    //         "namaKotaKabupaten": "--Pilih--",
    //       },
    //       "kecamatan": {
    //         "kdKecamatan": null,
    //         "namaKecamatan": "--Pilih--",
    //       },
    //       "kelurahan": {
    //         "kdKelurahan": null,
    //         "namaDesaKelurahan": "--Pilih--",
    //       },
    //       "kodePos": "",
    //       "statusAktif": true,
    //       "kode": null,

    //     }
    //     let listDataDetail = [...this.listDataDetail];
    //     listDataDetail.push(dataTemp);
    //     this.listDataDetail = listDataDetail;

    //   }
    // }

  }

  hapusRow(data) {
    this.httpService.delete(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/HapusAlamat/' + data.kdAlamat).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Terhapus');
      this.getDataListDetail(this.page, this.rows);
    });
    // this.jmlAlamatBaru = this.jmlAlamatBaru - 1;
    // let listDataDetail = [...this.listDataDetail];
    // listDataDetail.splice(row, 1);
    // this.listDataDetail = listDataDetail;
  }

  // getFAlamat(event) {
  //   if (event) {
  //     this.cekAlamat = false;
  //     this.btnAlamat = false;
  //   } else {
  //     this.cekAlamat = true;
  //     this.btnAlamat = true;
  //     if (this.listDataDetail.length > 0) {
  //       return this.listDataDetail = [];
  //     }
  //   }
  // }
  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }
  urlUpload() {
    return Configuration.get().resourceFile + '/file/upload?noProfile=false';
  }
  fotoUpload(namaBaru) {
    this.foto = namaBaru;
    // console.log(namaBaru);
    //this.photoDiri = this.foto.toString();
    this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.foto;
    // console.log(this.smbrFoto);
  }
  fileUpload(event, from) {
    if (from == 'gambarLogo') {
      this.namaFoto = event.xhr.response;
      this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.namaFoto;
    } else {
      this.namaFotoBackground = event.xhr.response;
      this.smbrFotoBackground = Configuration.get().resourceFile + '/image/show/' + this.namaFotoBackground;
    }

  }



  addHeader(event) {
    this.httpService.beforeUploadFile(event);
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
    if (this.dataEmailTidakTersedia) {
      this.alertService.warn("Peringatan", "Data hostname belum valid, harap diperbaiki")
    } else {
      if (this.form.invalid) {
        this.validateAllFormFields(this.form);
        this.alertService.warn("Peringatan", "Data Tidak Sesuai")
      } else {
        this.simpan();
      }
    }
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Profile');
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
    let dataAlamatDto = {}

    // let dataTemp = {
    //   "alamatLengkap": this.form.get('alamatLengkap').value,
    //   "rtrw": this.form.get('rtrw').value,
    //   "kdNegara": this.form.get('kdNegara').value,
    //   "kdPropinsi": this.form.get('kdPropinsi').value,
    //   "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
    //   "kdKecamatan": this.form.get('kdKecamatan').value,
    //   "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
    //   "kodePos": this.form.get('kodePos').value,
    //   "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
    // }
    console.log(this.listDataDetail);
    let dataTemp = [];
    for (let i = 0; i < this.listDataDetail.length; i++) {
      if (this.listDataDetail[i].kode == undefined || this.listDataDetail[i].kode == null) {
        dataTemp.push({
          "alamatLengkap": this.listDataDetail[i].alamatLengkap,
          "rtrw": this.listDataDetail[i].rtrw,
          "kdNegara": this.listDataDetail[i].negara.kode,
          "kdPropinsi": this.listDataDetail[i].propinsi.kdPropinsi,
          "kdKotaKabupaten": this.listDataDetail[i].kota.kdKotaKabupaten,
          "kdKecamatan": this.listDataDetail[i].kecamatan.kdKecamatan,
          "kdDesaKelurahan": this.listDataDetail[i].kelurahan.kdDesaKelurahan,
          "kodePos": this.listDataDetail[i].kodePos,
          "kdJenisAlamat": this.listDataDetail[i].jenisAlamat.id.kode,
          "statusEnabled": this.listDataDetail[i].statusAktif,
          "garisLintangLatitude": this.listDataDetail[i].garisLintangLatitude,
          "garisBujurLongitude": this.listDataDetail[i].garisBujurLongitude
        })
      } else {
        let kdjenisAl;
        if (this.listDataDetail[i].jenisAlamat.id == undefined && this.listDataDetail[i].jenisAlamat.kode != undefined) {
          kdjenisAl = this.listDataDetail[i].jenisAlamat.kode;
        } else {
          kdjenisAl = this.listDataDetail[i].jenisAlamat.id.kode;
        }
        dataTemp.push({
          "kode": this.listDataDetail[i].kode,
          "alamatLengkap": this.listDataDetail[i].alamatLengkap,
          "rtrw": this.listDataDetail[i].rtrw,
          "kdNegara": this.listDataDetail[i].negara.kode,
          "kdPropinsi": this.listDataDetail[i].propinsi.kdPropinsi,
          "kdKotaKabupaten": this.listDataDetail[i].kota.kdKotaKabupaten,
          "kdKecamatan": this.listDataDetail[i].kecamatan.kdKecamatan,
          "kdDesaKelurahan": this.listDataDetail[i].kelurahan.kdDesaKelurahan,
          "kodePos": this.listDataDetail[i].kodePos,
          "kdJenisAlamat": kdjenisAl,
          "statusEnabled": this.listDataDetail[i].statusAktif,
          "garisLintangLatitude": this.listDataDetail[i].garisLintangLatitude,
          "garisBujurLongitude": this.listDataDetail[i].garisBujurLongitude
        })
      }

    }



    let data = new InisialData();


    data = {
      "backgroundKartuPasien": this.form.get('backgroundKartuPasien').value,
      "dataAlamatDto": dataTemp,
      "namaLengkap": this.form.get('namaLengkap').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "semboyanLast": this.form.get('semboyanLast').value,
      "luasTanah": this.form.get('luasTanah').value,
      "luasBangunan": this.form.get('luasBangunan').value,
      "kdNegara": this.form.get('kdNegara').value,
      // "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
      // "kdTahapanAkreditasiLast": this.form.get('kdTahapanAkreditasiLast').value,
      // "kdStatusAkreditasiLast": this.form.get('kdStatusAkreditasiLast').value,
      // "tglAkreditasiLast": this.setTimeStamp((this.form.get('tglAkreditasiLast').value)),
      "mottoLast": this.form.get('mottoLast').value,
      // "tglSuratIjinExpiredLast": this.setTimeStamp(this.form.get('tglSuratIjinExpiredLast').value),
      // "tglSuratIjinLast": this.setTimeStamp(this.form.get('tglSuratIjinLast').value),
      "tglRegistrasi": this.setTimeStamp(this.form.get('tglRegistrasi').value),
      "sloganLast": this.form.get('sloganLast').value,
      "taglineLast": this.form.get('taglineLast').value,
      "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
      // "messageToPasien": this.form.get('messageToPasien').value,
      // "kdDepartemen": this.form.get('kdDepartemen').value,
      "gambarLogo": this.form.get('gambarLogo').value,
      "npwp": this.form.get('npwp').value,
      "noPKP": this.form.get('noPKP').value,
      // "kdAccount": this.form.get('kdAccount').value,
      "kdJenisProfile": this.form.get('kdJenisProfile').value,
      // "kdPemilikProfile": this.form.get('kdPemilikProfile').value,
      // "noSuratIjinLast": this.form.get('noSuratIjinLast').value,
      // "kdStatusSuratIjinLast": this.form.get('kdStatusSuratIjinLast').value,
      // "signatureByLast": this.form.get('signatureByLast').value,
      // "kdSatuanKerja": this.form.get('kdSatuanKerja').value,
      // "kdJenisTarif": this.form.get('kdJenisTarif').value,
      "kdProfileHead": this.form.get('kdProfileHead').value,
      "kdMataUang": this.form.get('kdMataUang').value,
      // "kdTypeProfile": this.form.get('kdTypeProfile').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "ambilFoto": this.form.get('ambilFoto').value,
      "kode": this.form.get('kode').value,
      "kdAlamat": this.form.get('kdAlamat').value,
      "hostname1": this.form.get('hostname1').value
    }



    // let tglSuratIjinLast = this.setTimeStamp(this.form.get('tglSuratIjinLast').value)
    // let tglSuratIjinExpiredLast = this.setTimeStamp(this.form.get('tglSuratIjinExpiredLast').value)
    // let tglRegistrasi = this.setTimeStamp(this.form.get('tglRegistrasi').value)
    // let tglAkreditasiLast = this.setTimeStamp(this.form.get('tglAkreditasiLast').value)

    // let formSubmit = this.form.value;
    // formSubmit.tglSuratIjinLast = tglSuratIjinLast;
    // formSubmit.tglSuratIjinExpiredLast = tglSuratIjinExpiredLast;
    // formSubmit.tglRegistrasi = tglRegistrasi;
    // formSubmit.tglAkreditasiLast = tglAkreditasiLast;

    //console.log(dataTemp);
    this.httpService.update(Configuration.get().dataMasterNew + '/profile/update/' + this.versi, data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }


  simpan() {
    console.log(this.pilihAlamat)

    let en;
    if (this.form.get('statusEnabled').value == true) {
      en = 1;
    } else {
      en = 0;
    }
    let data;
    data = {
      "kdParent": this.form.get('kdProfileHead').value,
      "namaLengkap": this.form.get('namaLengkap').value,
      "kdJenisProfile": this.form.get('kdJenisProfile').value,
      "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
      "npwp": this.form.get('npwp').value,
      "noPkp": this.form.get('noPKP').value,
      "kdNegara": this.form.get('kdNegara').value,
      "kdMataUang": this.form.get('kdMataUang').value,
      "hostname": this.form.get('hostname1').value,
      "statusAktif": en,
      "image": this.form.get('gambarLogo').value,
      "tglRegisrasi": 0,
      "luasTanah": this.form.get('luasTanah').value,
      "luasBangunan": this.form.get('luasBangunan').value,
      "motto": this.form.get('mottoLast').value,
      "semboyan": this.form.get('semboyanLast').value,
      "slogan": this.form.get('sloganLast').value,
      "tagline": this.form.get('taglineLast').value,
      "tampilanLaporan": this.form.get('reportDisplay').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "kdAlamat": this.pilihAlamat
    }
    this.httpService.update(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/' + this.kdprof, data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');

      // this.get(this.page, this.rows, this.pencarian);
      // this.reset();
    });

    //======BACKUP============//
    // if (this.formAktif == false) {
    //   this.confirmUpdate()
    // } else if (this.listDataDetail.length == 0 || this.listDataDetail.length == null) {
    //   this.alertService.warn('Peringatan', 'Alamat Kosong')
    // } else {

    //   let dataTemp = [];
    //   for (let i = 0; i < this.listDataDetail.length; i++) {
    //     dataTemp.push({
    //       "alamatLengkap": this.listDataDetail[i].alamatLengkap,
    //       "rtrw": this.listDataDetail[i].rtrw,
    //       "kdNegara": this.listDataDetail[i].negara.kode,
    //       "kdPropinsi": this.listDataDetail[i].propinsi.kdPropinsi,
    //       "kdKotaKabupaten": this.listDataDetail[i].kotaKabupaten.kdKotaKabupaten,
    //       "kdKecamatan": this.listDataDetail[i].kecamatan.kdKecamatan,
    //       "kdDesaKelurahan": this.listDataDetail[i].kelurahan.kdDesaKelurahan,
    //       "kodePos": this.listDataDetail[i].kodePos,
    //       "kdJenisAlamat": this.listDataDetail[i].jenisAlamat.id.kode,
    //       "statusEnabled": this.listDataDetail[i].statusAktif,
    //       "garisLintangLatitude": this.listDataDetail[i].garisLintangLatitude,
    //       "garisBujurLongitude": this.listDataDetail[i].garisBujurLongitude

    //     })
    //   }
    //   let data = new InisialData();

    //   data = {
    //     "backgroundKartuPasien": this.form.get('backgroundKartuPasien').value,
    //     "dataAlamatDto": dataTemp,
    //     "namaLengkap": this.form.get('namaLengkap').value,
    //     "reportDisplay": this.form.get('reportDisplay').value,
    //     "semboyanLast": this.form.get('semboyanLast').value,
    //     "luasTanah": this.form.get('luasTanah').value,
    //     "luasBangunan": this.form.get('luasBangunan').value,
    //     "kdNegara": this.form.get('kdNegara').value,
    //     // "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
    //     // "kdTahapanAkreditasiLast": this.form.get('kdTahapanAkreditasiLast').value,
    //     // "kdStatusAkreditasiLast": this.form.get('kdStatusAkreditasiLast').value,
    //     // "tglAkreditasiLast": this.setTimeStamp((this.form.get('tglAkreditasiLast').value)),
    //     "mottoLast": this.form.get('mottoLast').value,
    //     // "tglSuratIjinExpiredLast": this.setTimeStamp(this.form.get('tglSuratIjinExpiredLast').value),
    //     // "tglSuratIjinLast": this.setTimeStamp(this.form.get('tglSuratIjinLast').value),
    //     "tglRegistrasi": this.setTimeStamp(this.form.get('tglRegistrasi').value),
    //     "sloganLast": this.form.get('sloganLast').value,
    //     "taglineLast": this.form.get('taglineLast').value,
    //     "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
    //     // "messageToPasien": this.form.get('messageToPasien').value,
    //     // "kdDepartemen": this.form.get('kdDepartemen').value,
    //     "gambarLogo": this.form.get('gambarLogo').value,
    //     "npwp": this.form.get('npwp').value,
    //     "noPKP": this.form.get('noPKP').value,
    //     // "kdAccount": this.form.get('kdAccount').value,
    //     "kdJenisProfile": this.form.get('kdJenisProfile').value,
    //     // "kdPemilikProfile": this.form.get('kdPemilikProfile').value,
    //     // "noSuratIjinLast": this.form.get('noSuratIjinLast').value,
    //     // "kdStatusSuratIjinLast": this.form.get('kdStatusSuratIjinLast').value,
    //     // "signatureByLast": this.form.get('signatureByLast').value,
    //     // "kdSatuanKerja": this.form.get('kdSatuanKerja').value,
    //     // "kdJenisTarif": this.form.get('kdJenisTarif').value,
    //     "kdProfileHead": this.form.get('kdProfileHead').value,
    //     "kdMataUang": this.form.get('kdMataUang').value,
    //     // "kdTypeProfile": this.form.get('kdTypeProfile').value,
    //     "kodeExternal": this.form.get('kodeExternal').value,
    //     "namaExternal": this.form.get('namaExternal').value,
    //     "statusEnabled": this.form.get('statusEnabled').value,
    //     "ambilFoto": this.form.get('ambilFoto').value,
    //     "kode": this.form.get('kode').value,
    //     "kdAlamat": this.form.get('kdAlamat').value,
    //     "hostname1": this.form.get('hostname1').value,


    //   }

    //   // console.log(dataTemp);

    //   // let tglSuratIjinLast = this.setTimeStamp(this.form.get('tglSuratIjinLast').value)
    //   // let tglSuratIjinExpiredLast = this.setTimeStamp(this.form.get('tglSuratIjinExpiredLast').value)
    //   // let tglRegistrasi = this.setTimeStamp(this.form.get('tglRegistrasi').value)
    //   // let tglAkreditasiLast = this.setTimeStamp(this.form.get('tglAkreditasiLast').value)

    //   // let formSubmit = this.form.value;
    //   // formSubmit.tglSuratIjinLast = tglSuratIjinLast;
    //   // formSubmit.tglSuratIjinExpiredLast = tglSuratIjinExpiredLast;
    //   // formSubmit.tglRegistrasi = tglRegistrasi;
    //   // formSubmit.tglAkreditasiLast = tglAkreditasiLast;

    //   this.httpService.post(Configuration.get().dataMasterNew + '/profile/save?', data).subscribe(response => {
    //     this.alertService.success('Berhasil', 'Data Disimpan');

    //     this.get(this.page, this.rows, this.pencarian);
    //     this.reset();
    //   });
    // }

  }

  simpanAlamat() {
    // let dataTemp2 = [];
    let dataTemp = [];
    for (let i = 0; i < this.listAlamatBaru.length; i++) {
      let en;
      if (this.listAlamatBaru[i].statusAktif) {
        en = 1;
      } else {
        en = 0;
      }
      dataTemp.push({
        "kdJenisAlamat": this.listAlamatBaru[i].jenisAlamat.id.kode,
        "alamatLengkap": this.listAlamatBaru[i].alamatLengkap,
        "rtrw": this.listAlamatBaru[i].rtrw,
        "kdNegara": this.listAlamatBaru[i].negara.kode,
        "kdPropinsi": this.listAlamatBaru[i].propinsi.kdPropinsi,
        "kdKotaKabupaten": this.listAlamatBaru[i].kotaKabupaten.kdKotaKabupaten,
        "kdKecamatan": this.listAlamatBaru[i].kecamatan.kdKecamatan,
        "kdDesaKelurahan": this.listAlamatBaru[i].desaKelurahan.kdDesaKelurahan,
        "kodePos": this.listAlamatBaru[i].kodePos,
        "noTelepon": this.listAlamatBaru[i].fixedPhone1,
        "email": this.listAlamatBaru[i].email,
        "website": this.listAlamatBaru[i].website,
        "statusAktif": en,
        "latitude": this.listAlamatBaru[i].latitude,
        "longitude": this.listAlamatBaru[i].longitude,
      })
    }
    console.log(dataTemp)
    this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/AlamatProfile/SimpanAlamatBaru', dataTemp[0]).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.showAlamatBaru = false;
      this.getDataListDetail(this.page, this.rows);
    });
    // let nn = this.listDataDetail;
    // console.log(this.listDataDetail.length)
    // console.log(nn.slice(this.listDataDetail.length - this.jmlAlamatBaru, this.listDataDetail.length))
    // nn = nn.slice(this.listDataDetail.length - this.jmlAlamatBaru, this.listDataDetail.length)
    // for (let i = 0; i < nn.length; i++) {
    //   let en;
    //   if(nn[i].statusAktif){
    //     en = 1;
    //   } else {
    //     en = 0;
    //   }
    //   dataTemp.push({
    //     "kdJenisAlamat": nn[i].jenisAlamat.id.kode,
    //     "alamatLengkap": nn[i].alamatLengkap,
    //     "rtrw": nn[i].rtrw,
    //     "kdNegara": nn[i].negara.kode,
    //     "kdPropinsi": nn[i].propinsi.kdPropinsi,
    //     "kdKotaKabupaten": nn[i].kotaKabupaten.kdKotaKabupaten,
    //     "kdKecamatan": nn[i].kecamatan.kdKecamatan,
    //     "kdDesaKelurahan": nn[i].desaKelurahan.kdDesaKelurahan,
    //     "kodePos": nn[i].kodePos,
    //     "noTelepon": nn[i].fixedPhone1,
    //     "email": nn[i].alamatEmail,
    //     "website": nn[i].website,
    //     "statusAktif": en,
    //     "latitude": nn[i].latitude,
    //     "longitude": nn[i].longitude,
    //   })
    // }
    // console.log(dataTemp)
    // if (this.jmlAlamatBaru > 1) {
    //   this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/AlamatProfile/SimpanAlamatBaru/Many', dataTemp).subscribe(response => {
    //     this.alertService.success('Berhasil', 'Data Disimpan');
    //     this.get(this.page, this.rows, '');
    //   });
    // } else {
    //   this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/AlamatProfile/SimpanAlamatBaru', dataTemp[0]).subscribe(response => {
    //     this.alertService.success('Berhasil', 'Data Disimpan');
    //     this.get(this.page, this.rows, '');
    //   });
    // }

  }

  getDetail(dataAl) {

    // this.httpService.get(Configuration.get().dataMasterNew + '/profile/findByKode/' + dataAl.data.kode).subscribe(table => {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/getAlamat').subscribe(table => {
      this.listDataDetail = [];


      for (let i = 0; i < table.Alamat.length; i++) {
        let dataFix =
        {
          jenisAlamat: {
            kode: table.Alamat[i].kdJenisAlamat,
            namaJenisAlamat: table.Alamat[i].namaJenisAlamat,
            kdJenisAlamat: table.Alamat[i].kdJenisAlamat,
          },
          alamatLengkap: table.Alamat[i].alamatLengkap,
          rtrw: table.Alamat[i].rTRW,
          negara: {
            kode: table.Alamat[i].kdNegara,
            namaNegara: table.Alamat[i].namaNegara,
            kdNegara: table.Alamat[i].kdNegara,
          },
          propinsi: {
            kode: table.Alamat[i].kdPropinsi,
            namaPropinsi: table.Alamat[i].namaPropinsi,
            kdPropinsi: table.Alamat[i].kdPropinsi,
          },
          kota: {
            kode: table.Alamat[i].kdKotaKabupaten,
            namaKotaKabupaten: table.Alamat[i].namaKotaKabupaten,
            kdKotaKabupaten: table.Alamat[i].kdKotaKabupaten,
          },
          kecamatan: {
            kode: table.Alamat[i].kdKecamatan,
            namaKecamatan: table.Alamat[i].namaKecamatan,
            kdKecamatan: table.Alamat[i].kdKecamatan,
          },
          kelurahan: {
            kode: table.Alamat[i].kdDesaKelurahan,
            namaDesaKelurahan: table.Alamat[i].namaDesaKelurahan,
            kdDesaKelurahan: table.Alamat[i].kdDesaKelurahan,
          },
          kodePos: table.Alamat[i].kodePos,
          statusAktif: table.Alamat[i].statusEnabled,
          kode: table.Alamat[i].kode.kode,
          garisLintangLatitude: 0.0,
          garisBujurLongitude: 0.0


        }
        this.listDataDetail.push(dataFix);
      }
      if (table.Alamat.length) {
        // this.cekAlamat = false;
        this.btnAlamat = false;
      } else {
        // this.cekAlamat = true;
        this.btnAlamat = true;
      }

    });
  }
  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }
  // setTimeStamp(date) {
  //   if (date == null || date == undefined || date == '') {
  //     let dataTimeStamp = (new Date().getTime() / 1000);
  //     return dataTimeStamp.toFixed(0);
  //   } else {
  //     let dataTimeStamp = (new Date(date).getTime() / 1000);
  //     return dataTimeStamp.toFixed(0);
  //   }
  // }


  reset() {
    this.formAktif = true;
    this.ngOnInit();
    // this.smbrFoto = '';
    this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
  }
  onRowSelect(event) {

    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    this.getDetail(event);

  }
  clone(cloned: Profile): Profile {
    let hub = new InisialProfile();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialProfile();
    // if (this.listDataDetail.length == 0) {
    //   this.btAlamat = false
    // } else {
    //   this.form.get('btAlamat').setValue(true);
    //   this.btAlamat = true;
    //   this.form.get('btAlamat').disable();
    // }
    if (hub.tglRegistrasi == null) {
      fixHub = {
        "kode": hub.kode,
        "namaLengkap": hub.namaLengkap,
        "reportDisplay": hub.reportDisplay,
        "tglRegistrasi": null,
        "luasTanah": hub.luasTanah,
        "luasBangunan": hub.luasBangunan,
        // "kdLevelTingkat": hub.kdLevelTingkat,
        // "kdTahapanAkreditasiLast": hub.kdTahapanAkreditasiLast,
        // "kdStatusAkreditasiLast": hub.kdStatusAkreditasiLast,
        // "tglAkreditasiLast": new Date(hub.tglAkreditasiLast * 1000),
        "kdAlamat": hub.kdAlamat,
        // "alamatLengkap": hub.alamatLengkap,
        // "rtrw": hub.rTRW,
        // "kdPropinsi": hub.kdPropinsi,
        // "kdKecamatan": hub.kdKecamatan,
        // "kdKotaKabupaten": hub.kdKotaKabupaten,
        // "kdDesaKelurahan": hub.kdDesaKelurahan,
        // "kodePos": hub.kodePos,
        // "kdJenisAlamat": hub.kdJenisAlamat,

        "mottoLast": hub.mottoLast,
        "semboyanLast": hub.semboyanLast,
        "sloganLast": hub.sloganLast,
        "taglineLast": hub.taglineLast,
        "kdPegawaiKepala": hub.kdPegawaiKepala,
        // "messageToPasien": hub.messageToPasien,
        "gambarLogo": hub.gambarLogo,
        "ambilFoto": hub.gambarLogo,
        // "kdDepartemen": hub.kdDepartemen,
        "npwp": hub.nPWP,
        "noPKP": hub.noPKP,
        // "kdAccount": hub.kdAccount,
        "kdJenisProfile": hub.kdJenisProfile,
        // "kdPemilikProfile": hub.kdPemilikProfile,
        // "noSuratIjinLast": hub.noSuratIjinLast,
        // "tglSuratIjinLast": new Date(hub.tglSuratIjinLast * 1000),
        // "signatureByLast": hub.signatureByLast,
        // "kdStatusSuratIjinLast": hub.kdStatusSuratIjinLast,
        // "tglSuratIjinExpiredLast": new Date(hub.tglSuratIjinExpiredLast * 1000),
        // "kdSatuanKerja": hub.kdSatuanKerja,
        // "kdJenisTarif": hub.kdJenisTarif,
        "kdProfileHead": hub.kdProfileHead,
        "kdNegara": hub.kdNegara,
        "kdMataUang": hub.kdMataUang,
        // "kdTypeProfile": hub.kdTypeProfile,
        "kodeExternal": hub.kodeExternal,
        "namaExternal": hub.namaExternal,
        "statusEnabled": hub.statusEnabled,
        // "btAlamat": this.btAlamat

      }
      this.versi = hub.version;
      return fixHub;
    }
    else {
      fixHub = {
        "kode": hub.kode,
        "namaLengkap": hub.namaLengkap,
        "reportDisplay": hub.reportDisplay,
        "tglRegistrasi": new Date(hub.tglRegistrasi * 1000),
        "luasTanah": hub.luasTanah,
        "luasBangunan": hub.luasBangunan,
        // "kdLevelTingkat": hub.kdLevelTingkat,
        // "kdTahapanAkreditasiLast": hub.kdTahapanAkreditasiLast,
        // "kdStatusAkreditasiLast": hub.kdStatusAkreditasiLast,
        // "tglAkreditasiLast": null,
        "kdAlamat": hub.kdAlamat,
        // "alamatLengkap": hub.alamatLengkap,
        // "rtrw": hub.rTRW,
        // "kdPropinsi": hub.kdPropinsi,
        // "kdKecamatan": hub.kdKecamatan,
        // "kdKotaKabupaten": hub.kdKotaKabupaten,
        // "kdDesaKelurahan": hub.kdDesaKelurahan,
        // "kodePos": hub.kodePos,
        // "kdJenisAlamat": hub.kdJenisAlamat,

        "mottoLast": hub.mottoLast,
        "semboyanLast": hub.semboyanLast,
        "sloganLast": hub.sloganLast,
        "taglineLast": hub.taglineLast,
        "kdPegawaiKepala": hub.kdPegawaiKepala,
        // "messageToPasien": hub.messageToPasien,
        "gambarLogo": hub.gambarLogo,
        "ambilFoto": hub.gambarLogo,
        // "kdDepartemen": hub.kdDepartemen,
        "npwp": hub.nPWP,
        "noPKP": hub.noPKP,
        // "kdAccount": hub.kdAccount,
        "kdJenisProfile": hub.kdJenisProfile,
        // "kdPemilikProfile": hub.kdPemilikProfile,
        // "noSuratIjinLast": hub.noSuratIjinLast,
        // "tglSuratIjinLast": new Date(hub.tglSuratIjinLast * 1000),
        // "signatureByLast": hub.signatureByLast,
        // "kdStatusSuratIjinLast": hub.kdStatusSuratIjinLast,
        // "tglSuratIjinExpiredLast": new Date(hub.tglSuratIjinExpiredLast * 1000),
        // "kdSatuanKerja": hub.kdSatuanKerja,
        // "kdJenisTarif": hub.kdJenisTarif,
        "kdProfileHead": hub.kdProfileHead,
        "kdNegara": hub.kdNegara,
        "kdMataUang": hub.kdMataUang,
        // "kdTypeProfile": hub.kdTypeProfile,
        "kodeExternal": hub.kodeExternal,
        "namaExternal": hub.namaExternal,
        "statusEnabled": hub.statusEnabled,
        // "btAlamat": this.btAlamat
      }
      this.versi = hub.version;
      return fixHub;
    }
  }

  updateRow(data, index) {
    this.listAlamatBaru = []
    let en;
    let negara;
    let propinsi;
    let kabupaten;
    let kecamatan;
    let kelurahan;
    if (data.statusAktif == true) {
      en = 1;
    } else {
      en = 0;
    }
    //NEGARA
    if (data.negara != null) {
      negara = {
        'kdNegara': data.negara.kdNegara,
        'namaNegara': data.negara.namaNegara
      }
    } else {
      negara = {
        'kdNegara': null,
        'namaNegara': null
      }
    }
    //PROPINSI
    if (data.propinsi != null) {
      propinsi = {
        'kdPropinsi': data.propinsi.kdPropinsi,
        'namaPropinsi': data.propinsi.namaPropinsi
      }
    } else {
      propinsi = {
        'kdPropinsi': null,
        'namaPropinsi': null
      }
    }
    //KABUPATEN
    if (data.kotaKabupaten != null) {
      kabupaten = {
        'kdKota': data.kotaKabupaten.kdKota,
        'namaKota': data.kotaKabupaten.namaKota
      }
    } else {
      kabupaten = {
        'kdKota': null,
        'namaKota': null
      }
    }
    //KECAMATAN
    if (data.kecamatan != null) {
      kecamatan = {
        'kdKecamatan': data.kecamatan.kdKecamatan,
        'namaKecamatan': data.kecamatan.namaKecamatan
      }
    } else {
      kecamatan = {
        'kdKecamatan': null,
        'namaKecamatan': null
      }
    }
    //KELURAHAN
    if (data.desaKelurahan != null) {
      kelurahan = {
        'kdKelurahan': data.desaKelurahan.kdKelurahan,
        'namaKelurahan': data.desaKelurahan.namaKelurahan
      }
    } else {
      kelurahan = {
        'kdKelurahan': null,
        'namaKelurahan': null
      }
    }
    this.notelepon = data.fixedPhone1;
    let dataTemp = {
      "kdAlamat": data.kdAlamat,
      "fixedPhone1": data.fixedPhone1,
      "website": data.website,
      "email": data.alamatEmail,
      "jenisAlamat": {
        "kdJenisAlamat": data.jenisAlamat.kdJenisAlamat,
        "jenisAlamat": data.jenisAlamat.jenisAlamat,
      },
      "alamatLengkap": data.alamatLengkap,
      "rtrw": data.rtrw,
      "negara": {
        "kdNegara": negara.kdNegara,
        "namaNegara": negara.namaNegara,
      },
      "propinsi": {
        "kdPropinsi": propinsi.kdPropinsi,
        "namaPropinsi": propinsi.namaPropinsi,
      },
      "kotaKabupaten": {
        "kdKota": kabupaten.kdKota,
        "namaKota": kabupaten.namaKota,
      },
      "kecamatan": {
        "kdKecamatan": kecamatan.kdKecamatan,
        "namaKecamatan": kecamatan.namaKecamatan,
      },
      "desaKelurahan": {
        "kdKelurahan": kelurahan.kdKelurahan,
        "namaKelurahan": kelurahan.namaKelurahan,
      },
      "kodePos": data.kodePos,
      "statusAktif": en,
      // "kode": null,
      "latitude": data.latitude,
      "longitude": data.longitude
    }
    // let listAlamatBaru = [...this.listAlamatBaru];
    // listAlamatBaru.push(dataTemp);
    this.listAlamatBaru.push(dataTemp);

    //get propinsi
    this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + negara.kdNegara).subscribe(res => {
      this.listAlamatBaru[0].listProp = [];
      this.listAlamatBaru[0].listProp.push({ label: '--Pilih Propinsi--', value: '' });
      for (var i = 0; i < res.Propinsi.length; i++) {
        let listProp = [];
        listProp[i] = {
          "kdPropinsi": res.Propinsi[i].kode.kode,
          "namaPropinsi": res.Propinsi[i].namaPropinsi
        }
        this.listAlamatBaru[0].listProp.push({ label: res.Propinsi[i].namaPropinsi, value: listProp[i] });
      }
    });

    //get kabupaten
    this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + propinsi.kdPropinsi + '&kdNegara=' + negara.kdNegara).subscribe(res => {
      this.listAlamatBaru[0].listKot = [];
      this.listAlamatBaru[0].listKot.push({ label: '--Pilih Kota Kabupaten--', value: '' });
      for (var i = 0; i < res.KotaKabupaten.length; i++) {
        let listKot = [];
        listKot[i] = {
          "kdKotaKabupaten": res.KotaKabupaten[i].kode.kode,
          "namaKota": res.KotaKabupaten[i].namaKotaKabupaten,
        }
        this.listAlamatBaru[0].listKot.push({ label: res.KotaKabupaten[i].namaKotaKabupaten, value: listKot[i] });
      };
    });

    //get kecamatan
    this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + kabupaten.kdKota + '&kdNegara=' + negara.kdNegara).subscribe(res => {
      this.listAlamatBaru[0].listKec = [];
      this.listAlamatBaru[0].listKec.push({ label: '--Pilih Kecamatan--', value: '' })
      for (var i = 0; i < res.Kecamatan.length; i++) {
        let listKec = [];
        listKec[i] = {
          "kdKecamatan": res.Kecamatan[i].kode.kode,
          "namaKecamatan": res.Kecamatan[i].namaKecamatan,
        }
        this.listAlamatBaru[0].listKec.push({ label: res.Kecamatan[i].namaKecamatan, value: listKec[i] })
      };
    });

    //get kelurahan
    this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + kecamatan.kdKecamatan + '&kdNegara=' + negara.kdNegara).subscribe(res => {
      this.listAlamatBaru[0].listKel = [];
      this.listAlamatBaru[0].listKel.push({ label: '--Pilih Kelurahan--', value: '' })
      for (var i = 0; i < res.DesaKelurahan.length; i++) {
        let listKel = [];
        listKel[i] = {
          "kdDesaKelurahan": res.DesaKelurahan[i].kode.kode,
          "namaKelurahan": res.DesaKelurahan[i].namaDesaKelurahan,
        }
        this.listAlamatBaru[0].listKel.push({ label: res.DesaKelurahan[i].namaDesaKelurahan, value: listKel[i] })
      };
    });


    this.showUpdateAlamat = true;
  }

  updateAlamat() {
    let dataTemp = [];
    let verif: boolean = false;
    for (let i = 0; i < this.listAlamatBaru.length; i++) {
      let en;
      let kdNegara;
      let kdKotaKabupaten;
      let kdJenisAlmt;
      let kdDesaKelurahan;
      if (this.listAlamatBaru[i].statusAktif) {
        en = 1;
      } else {
        en = 0;
      }
      if (this.listAlamatBaru[i].jenisAlamat.id != undefined) {
        kdJenisAlmt = {
          'kdProfile': this.listAlamatBaru[i].jenisAlamat.id.kdProfile,
          'kode': this.listAlamatBaru[i].jenisAlamat.id.kode
        }
      } else {
        kdJenisAlmt = {
          'kdProfile': '',
          'kode': this.listAlamatBaru[i].jenisAlamat.kdJenisAlamat
        }
      }

      if (this.listAlamatBaru[i].negara.kode != undefined) {
        kdNegara = this.listAlamatBaru[i].negara.kode
      } else {
        kdNegara = this.listAlamatBaru[i].negara.kdNegara
      }

      if (this.listAlamatBaru[i].kotaKabupaten.kdKota != undefined) {
        kdKotaKabupaten = this.listAlamatBaru[i].kotaKabupaten.kdKota
      } else {
        kdKotaKabupaten = this.listAlamatBaru[i].kotaKabupaten.kdKotaKabupaten
      }

      if (this.listAlamatBaru[i].desaKelurahan.kdKelurahan != undefined) {
        kdDesaKelurahan = this.listAlamatBaru[i].desaKelurahan.kdKelurahan
      } else {
        kdDesaKelurahan = this.listAlamatBaru[i].desaKelurahan.kdDesaKelurahan
      }
      dataTemp.push({
        "kdAlamat": this.listAlamatBaru[i].kdAlamat,
        "kdJenisAlamat": kdJenisAlmt.kode,
        "alamatLengkap": this.listAlamatBaru[i].alamatLengkap,
        "rtrw": this.listAlamatBaru[i].rtrw,
        "kdNegara": kdNegara,
        "kdPropinsi": this.listAlamatBaru[i].propinsi.kdPropinsi,
        "kdKotaKabupaten": kdKotaKabupaten,
        "kdKecamatan": this.listAlamatBaru[i].kecamatan.kdKecamatan,
        "kdDesaKelurahan": kdDesaKelurahan,
        "kodePos": this.listAlamatBaru[i].kodePos,
        "noTelepon": this.listAlamatBaru[i].fixedPhone1,
        "email": this.listAlamatBaru[i].email,
        "website": this.listAlamatBaru[i].website,
        "statusAktif": en,
        "latitude": this.listAlamatBaru[i].latitude,
        "longitude": this.listAlamatBaru[i].longitude,
      })
    }
    if ((dataTemp[0].kodePos != null) && (dataTemp[0].kdDesaKelurahan == null)) {
      verif = false;
    } else {
      verif = true
    }

    if (verif) {
      this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Profile/AlamatProfile/SimpanAlamatBaru', dataTemp[0]).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Terupdate');
        this.showUpdateAlamat = false;
        this.getDataListDetail(this.page, this.rows);
      });
    } else {
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    }
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/profile/del/' + deleteItem.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      // this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);

    });
    this.reset();


  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  getKodePos(kd, kdnegara, ri) {
    if (kdnegara.kdNegara == undefined) {
      kdnegara = kdnegara.kode;
    } else {
      kdnegara = kdnegara.kdNegara;
    }

    if (kd != '' || kd != null || kdnegara != '' || kdnegara != null) {
      this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=DesaKelurahan&select=namaDesaKelurahan,id,kodePos&criteria=id.kode,id.kdNegara&values=' + kd + ',' + kdnegara + '&profile=No').subscribe(res => {
        // this.listDataDetail[this.rows + ri].kodePos = res.data.data[0].kodePos;
        this.listAlamatBaru[ri].kodePos = res.data.data[0].kodePos;
        // console.log(ri)
        // console.log(this.listDataDetail)
      });
    }
  }

  downloadExcel() {

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/profile/laporanProfile.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/profile/laporanProfile.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmProfile_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }

  emailFormatCheck(event) {
    let regExpr = /[^a-zA-Z0-9-._@]/;
    let str1 = event.target.value;
    if (str1 != undefined && str1.length > 0) {
      str1 = str1.replace(regExpr, '');
      this.form.get('hostname1').setValue(str1);
      let str2 = str1.split('.');
      if (str2.length >= 2) {
        if (str2[1].length >= 1) {
          this.httpService.get(Configuration.get().dataMaster + '/profile/cekEmail?host=' + str1).subscribe(res => {
            if (res.status == true) {
              this.dataEmailTidakTersedia = false;
              this.responseEmail = "tersedia";
            } else {
              this.dataEmailTidakTersedia = true;
              this.responseEmail = "Hostname telah digunakan";
            }
          });
        } else {
          this.dataEmailTidakTersedia = true;
          this.responseEmail = "Format tidak valid";
        }
      } else {
        this.dataEmailTidakTersedia = true;
        this.responseEmail = "Format tidak valid";
      }
    }
  }


  /////////////////////////////////////////////////////

  placeMarker(event) {
    console.log(event)
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }

  lihatMap(alamat: any, ri) {
    this.indexBaris = ri;
    let data = {
      'longitude': alamat.longitude,
      'latitude': alamat.latitude,
      'lokasi': ''
    }
    this.listLokasiTujuan = data;

    this.showMap = true

    this.longitude = this.listAlamatBaru[ri].longitude
    this.latitude = this.listAlamatBaru[ri].latitude

    if (this.map) {
      const latlng = new google.maps.LatLng(this.latitude, this.longitude)
      this.map.panTo(latlng);
      this.map.setCenter(latlng);
    }

    //tampilkan / masukan alamat yang udah pernah disimpan tadi
    let geocoder = new google.maps.Geocoder;
    let latlng = { lat: this.latitude, lng: this.longitude };
    geocoder.geocode({ 'location': latlng }, function (results) {
      if (this.latitude != undefined || this.longitude != undefined) {
        this.lokasiNama = results[0].formatted_address;
        console.log(results[0].formatted_address);
      }
    })

    this.setAutoComplete(ri)

  }

  setAutoComplete(index) {
    //this.lokasiNama = "";

    let input = <HTMLInputElement>document.getElementById('lokMap');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setTypes([]);
    autocomplete.setComponentRestrictions({ 'country': ['id'] });
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', () => {
      var place = autocomplete.getPlace();
      if (place.geometry === undefined || place.geometry === null) {
        return;
      }
      let eventa = place.formatted_address;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.listLokasiTujuan.latitude = place.geometry.location.lat();
      this.listLokasiTujuan.longitude = place.geometry.location.lng();
      this.listLokasiTujuan.lokasi = place.formatted_address;

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
      }

    });
  }

  hideGoogle() {
    this.showMap = false
    var elems = document.getElementsByClassName('pac-container');
    for (var i = 0; i != elems.length; ++i) {
      let elem = <HTMLElement>elems[i];
      elem.style.display = "none !important"
      elem.style.visibility = "hidden !important"
    }
  }

  loadMapManual() {

    this.listLokasiTujuan.longitude = this.longitude
    this.listLokasiTujuan.latitude = this.latitude
    if (this.map) {
      const latlng = new google.maps.LatLng(this.latitude, this.longitude)
      this.map.panTo(latlng);
      this.map.setCenter(latlng);
    }
  }

  simpanPeta() {
    // console.log(this.latitude)
    // console.log(this.longitude)
    this.listAlamatBaru[this.indexBaris].latitude = this.latitude;
    this.listAlamatBaru[this.indexBaris].longitude = this.longitude;
    this.hideGoogle();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        console.log(position)

        this.listLokasiTujuan.latitude = position.coords.latitude;
        this.listLokasiTujuan.longitude = position.coords.longitude;
        // this.latitude = this.listLokasiTujuan.latitude;
        // this.longitude = this.listLokasiTujuan.longitude;



        // this.listDataDetail[this.indexBaris].garisLintangLatitude = this.latitude;
        // this.listDataDetail[this.indexBaris].garisBujurLongitude = this.longitude;

        this.listAlamatBaru[this.indexBaris].latitude = this.latitude;
        this.listAlamatBaru[this.indexBaris].longitude = this.longitude;


      });
    }
  }

  /////////////////////////////////////////////////////
  noTelp(val) {
    var x = val.currentTarget.value;
		let regExpr = /[^0-9]/;
    // let regExpr = /^([^0-9]*)$/;
    x = x.replace(regExpr, '');
    // val.data.fixedPhone1 = x;
    // this.listAlamatBaru[val.index] = val.data;
    this.listAlamatBaru[0].fixedPhone1 = x;
    this.notelepon = x;
  }
}

class InisialProfile implements Profile {

  constructor(

    public gambarLogo?,
    public noPosting?,
    public kdAccount?,
    public kdAlamat?,
    public kdDepartemen?,
    public kdJenisProfile?,
    public kdJenisTarif?,
    public kdLevelTingkat?,
    public kdMataUang?,
    public kdNegara?,
    public kdPegawaiKepala?,
    public kdPemilikProfile?,
    public kdProfileHead?,
    public kdSatuanKerja?,
    public kdStatusAkreditasiLast?,
    public kdStatusSuratIjinLast?,
    public kdTahapanAkreditasiLast?,
    public kdTypeProfile?,
    public kode?,
    public kodeExternal?,
    public luasBangunan?,
    public luasTanah?,
    public messageToPasien?,
    public mottoLast?,
    public namaExternal?,
    public namaLengkap?,
    public noPKP?,
    public noSuratIjinLast?,
    public npwp?,
    public reportDisplay?,
    public semboyanLast?,
    public signatureByLast?,
    public sloganLast?,
    public statusEnabled?,
    public taglineLast?,
    public tglAkreditasiLast?,
    public tglDaftar?,
    public tglRegistrasi?,
    public tglSuratIjinExpiredLast?,
    public tglSuratIjinLast?,
    public version?,
    public nPWP?,
    public ambilFoto?,
    public kdJenisAlamat?,
    public hostname1?,

    public alamatLengkap?,
    public rtrw?,
    public rTRW?,
    public kdPropinsi?,
    public kdKotaKabupaten?,
    public kdDesaKelurahan?,
    public kdKecamatan?,
    public kodePos?,
    public btAlamat?,
  ) { }

}
class InisialData implements DataSimpan {

  constructor(
    public dataAlamatDto?,
    public gambarLogo?,
    public kdAccount?,
    public kdAlamat?,
    public kdDepartemen?,
    public kdJenisProfile?,
    public kdJenisTarif?,
    public kdLevelTingkat?,
    public kdMataUang?,
    public kdNegara?,
    public kdPegawaiKepala?,
    public kdPemilikProfile?,
    public kdProfileHead?,
    public kdSatuanKerja?,
    public kdStatusAkreditasiLast?,
    public kdStatusSuratIjinLast?,
    public kdTahapanAkreditasiLast?,
    public kdTypeProfile?,
    public kode?,
    public kodeExternal?,
    public luasBangunan?,
    public luasTanah?,
    public messageToPasien?,
    public mottoLast?,
    public namaExternal?,
    public namaLengkap?,
    public noPKP?,
    public noSuratIjinLast?,
    public npwp?,
    public reportDisplay?,
    public semboyanLast?,
    public signatureByLast?,
    public sloganLast?,
    public statusEnabled?,
    public taglineLast?,
    public tglAkreditasiLast?,
    public tglDaftar?,
    public tglRegistrasi?,
    public tglSuratIjinExpiredLast?,
    public tglSuratIjinLast?,
    public version?,
    public nPWP?,
    public ambilFoto?,
    public hostname1?,

    public alamatLengkap?,
    public rtrw?,
    public kdPropinsi?,
    public kdKotaKabupaten?,
    public kdDesaKelurahan?,
    public kodePos?,
    public garisLintangLatitude?,
    public garisBujurLongitude?,
    public backgroundKartuPasien?,

  ) { }


}