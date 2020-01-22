import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';

import { DropdownModule, SelectItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, UserDto, Authentication, AuthGuard, SettingsService, AlertService, InfoService, Configuration, LangToFlag, SettingInfo } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/timeout'
import { TimeoutError } from 'rxjs';
//sementara
import { SocketService } from '../../../global/service/socket.service';
import { OsService } from '../../../global/service/os.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  state: SettingInfo;

  perusahaan: string;
  modul: string;
  unitKerja: string;
  namalokasi: string;

  model: any = {};
  loading: boolean = false;
  returnUrl: string;

  profile: SelectItem[];
  profileA = [];
  profileTerpilih: any;

  modApp: SelectItem[];
  modAppA = [];
  modAppImg = [];
  modAppTerpilih: any;

  showModul: boolean = false;

  lokasi: SelectItem[];
  lokasiA = [];
  lokasiTerpilih: any;

  ruangan: SelectItem[];
  ruanganA = [];
  ruanganTerpilih: any;

  bahasa: SelectItem[];
  bahasaTerpilih: string = 'id';

  pilProfile: boolean = false;
  pilModApp: boolean = false;
  pilLokasi: boolean = false;
  pilRuangan: boolean = false;

  pilAll: boolean = false;
  pilLanjut: boolean = false;

  urlRes: string;

  oData: any;
  satuModulData:any;

  sudahLogin: boolean;

  koneksi: string = 'Server sibuk, tidak dapat melayani permintaan, silahkan ulangi.';
  userPassPil: string = 'Login gagal, nama pengguna atau kata sandi salah.';

  imgLoading: string = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH'
    + '/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAAC'
    + 'wAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkY'
    + 'DAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRV'
    + 'saqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMl'
    + 'FYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAA'
    + 'ABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI'
    + '5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8'
    + 'pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4'
    + 'CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi6'
    + '3P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAA'
    + 'ALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1Yh'
    + 'iCnlsRkAAAOwAAAAAAAAAAAA==';

  namaKomputer: any = null;
  pilihNamaKomputer: boolean = false;
  namaKomputerSesion: any;

  versionLang: any;
  listVersion: any[];


  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authentication: Authentication,
    private authGuard: AuthGuard,
    private alert: AlertService,
    private info: InfoService,
    private httpService: HttpClient,
    private osService: OsService,
    private settingsService: SettingsService,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService) {

    this.bahasa = [];
    this.bahasa.push({ label: 'Bahasa Indonesia', value: 'id' });
    this.bahasa.push({ label: 'English', value: 'en' });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.urlRes = Configuration.get().resourceFile + '/image/show/';
  }

  ngOnDestroy() {

  }

  ngOnInit() {
    this.satuModulData='';
    this.pilAll = false;
    this.sudahLogin = false;
    this.pilihNamaKomputer = false;
    if (this.authGuard.isLogin()) {
      this.keHalamanUtama();
      // this.sudahLogin = true;
    }
    this.namaKomputerSesion = sessionStorage.getItem('namaKomputer');
    if (this.namaKomputerSesion) {
      this.namaKomputer = this.namaKomputerSesion;
    }
  }
  responGetHostName(ob: LoginComponent, data: any) {
    sessionStorage.setItem('namaKomputer', data);
  }
  keHalamanUtama() {



    //keperluanViewerAntrianKlinik
   


    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getKdModulAplikasiViewerRegistrasi').subscribe(res => {
      this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/getKdModulAplikasiViewerPelayanan').subscribe(resPelayanan => {
        this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/getKdModulAplikasiKiosK').subscribe(resKiosk => {
            let idModul;
            if(this.satuModulData != ''){
              idModul = this.satuModulData.idModulAplikasi;
            }else if(this.satuModulData == ''){
              idModul = this.oData.idModulAplikasi
            }

            let antrian;
            let pelayanan;
            let kiosk;
            
            if(res == undefined){
              antrian = null;
            }else{
              antrian = res.kdModulAplikasi;
            }

            if(resPelayanan == undefined){
              pelayanan = null;
            }else{
              pelayanan = resPelayanan.kdModulAplikasi;
            }

            if(resKiosk == undefined){
              kiosk = null;
            }else{
              kiosk = resKiosk.kdModulAplikasi;
            }

            if (antrian == idModul ) {
              this.setVersionLang();
              this.router.navigate(['viewer-antrian']);
            }
            else if(pelayanan == idModul ){
              this.setVersionLang();
              this.router.navigate(['viewer-pelayanan']);
            }
             else if (kiosk == idModul) {
              this.setVersionLang();
              this.router.navigate(['kiosk']);
            } 
            else {
              this.router.navigate(['']);
              this.setVersionLang();
            }
          },
            error => {
              this.router.navigate(['']);
              // setTimeout(() => {
              //   location.reload();
              // }, 500);
         });
        },
        error => {
          this.router.navigate(['']);
        });
      },
      error => {
        this.router.navigate(['']);
      });
  }

  classBahasa(lang: string) {
    return "flag-icon flag-icon-" + LangToFlag.flags[lang];
  }

  pilihBahasa() {
    this.translate.use(this.bahasaTerpilih.toString());
    Configuration.lang = this.bahasaTerpilih.toString();
  }

  succes() {
    this.authGuard.checkLogin();

    this.httpService.get(Configuration.get().authLogin + '/menu/dinamic').subscribe(res => {
      this.authGuard.isLogin();
      this.settingsService.setCurrentMenu(res.data.menuUtama);
      this.settingsService.setCurrentURL(res.data.listUrl);
      this.settingsService.setCurrentLabel(res.data.namaObjek);
      this.info.hide();
      //        this.pilAll = false;
      this.pulih();
    },
      error => {
        localStorage.clear();
        //        localStorage.removeItem('user.mneu');
        this.authGuard.setUserDto(null);
        this.authGuard.isLogin();

        this.alert.warn("Warning", "Failed loading menu, please try login again");

        //this.pilAll = false;
        //this.pulih();
      });


  }

  pulih() {
    this.state = {
      profile: this.profile,
      profileA: this.profileA,
      profileTerpilih: this.profileTerpilih,

      modApp: this.modApp,
      modAppA: this.modAppA,
      modAppTerpilih: this.modAppTerpilih,

      lokasi: this.lokasi,
      lokasiA: this.lokasiA,
      lokasiTerpilih: this.lokasiTerpilih,

      ruangan: this.ruangan,
      ruanganA: this.ruanganA,
      ruanganTerpilih: this.ruanganTerpilih
    };
    this.settingsService.setSettingInfo(this.state);
    //        this.appMenu.loadMenu(this.settingsService.getCurrentMenu());
    this.keHalamanUtama();
  }

  kembali() {
    this.pilAll = false;
  }

  buildProfiles(data: any) {
    this.profile = [];
    for (let i = 0; i < data.length; i++) {
      this.profile.push({ label: data[i].namaLengkap, value: data[i].kdProfile });
    }
    this.profileTerpilih = data[0].kdProfile;
  }

  ///////////////

  pilihModApp() {

    let data = this.modAppImg;
    this.modAppImg = [];
    let selectCls: string;

    for (let i = 0; i < data.length; i++) {

      if (data[i].kdModulAplikasi == this.modAppTerpilih) {
        selectCls = "borderMod";
      } else if (i == 0 && (this.modAppTerpilih == undefined || this.modAppTerpilih == null)) {
        selectCls = "borderMod";
      } else {
        selectCls = "borderNone";
      }

      this.modAppImg[i] = {
        modulAplikasi: data[i].modulAplikasi,
        modulIconImage: data[i].modulIconImage,
        kdModulAplikasi: data[i].kdModulAplikasi,
        classBorder: selectCls
      };
    }
  }

  buildModApps(data: any) {
    this.modApp = [];
    this.modAppImg = [];

    let selectCls: string;

    for (let i = 0; i < data.length; i++) {
      this.modApp.push({ label: data[i].modulAplikasi, value: data[i].kdModulAplikasi });

      if (data[i].kdModulAplikasi == this.modAppTerpilih) {
        selectCls = "borderMod";
      } else if (i == 0 && (this.modAppTerpilih == undefined || this.modAppTerpilih == null)) {
        selectCls = "borderMod";
      } else {
        selectCls = "borderNone";
      }

      this.modAppImg[i] = {
        modulAplikasi: data[i].modulAplikasi,
        kdModulAplikasi: data[i].kdModulAplikasi,
        modulIconImage: this.urlRes + data[i].modulIconImage,
        classBorder: selectCls
      };
    }
    this.modAppTerpilih = data[0].kdModulAplikasi;
  }


  ///////////////

  buildLokasis(data: any) {
    this.lokasi = [];
    for (let i = 0; i < data.length; i++) {
      this.lokasi.push({ label: data[i].namaRuangan, value: data[i].kdRuangan });
    }
    this.lokasiTerpilih = data[0].kdRuangan;
  }

  ///////////////

  buildRuangans(data: any) {
    this.ruangan = [];
    for (let i = 0; i < data.length; i++) {
      this.ruangan.push({ label: data[i].namaRuangan, value: data[i].kdRuangan });
    }
    this.ruanganTerpilih = data[0].kdRuangan;
  }

  ////////////////

  trackByFn(index, item) {
    return index;
  }

  masuk() {
    if (this.pilLanjut) {
      this.authGuard.setUserDto(this.oData);

      this.perusahaan = this.oData.profile.namaLengkap;

      this.profileA = this.oData.profiles;
      this.modAppA = this.oData.modulAplikasis;
      this.lokasiA = this.oData.lokasis;
      this.ruanganA = this.oData.ruangans;

      this.profileTerpilih = this.profileA[0].kdProfile;
      this.modAppTerpilih = this.modAppA[0].kdModulAplikasi;
      this.lokasiTerpilih = this.lokasiA[0].kdRuangan;
      this.ruanganTerpilih = this.ruanganA[0].kdRuangan;



      this.succes();

    }
  }

  checkData(data: any) {


    this.pilProfile = false;
    this.pilModApp = false;
    this.pilLokasi = false;
    this.pilRuangan = false;

    this.loading = false;
    if (data.token != undefined && data.token != null && !this.pilAll) {

      this.pilProfile = true;
      this.pilModApp = true;
      this.pilLokasi = true;
      this.pilRuangan = true;
      this.showModul = false;


      this.authGuard.setUserDto(data);

      this.perusahaan = data.profile.namaLengkap;

      this.profileA = data.profiles;
      this.modAppA = data.modulAplikasis;
      this.lokasiA = data.lokasis;
      this.ruanganA = data.ruangans;

      this.modAppTerpilih = this.modAppA[0].kdModulAplikasi;
      this.profileTerpilih = this.profileA[0].kdProfile;
      this.lokasiTerpilih = this.lokasiA[0].kdRuangan;
      this.ruanganTerpilih = this.ruanganA[0].kdRuangan;
      this.satuModulData = data; 

      this.succes();
    } else if (data != undefined && data != null) {
      this.pilAll = true;
      this.oData = data;
      //this.authGuard.setUserDto(data);
      this.profileA = this.oData.profiles;

      if (this.profileA.length > 1 && (this.oData.idProfile == null)) {
        this.pilProfile = true;
        this.profileTerpilih = this.profileA[0].kdProfile;
        this.buildProfiles(this.profileA);
      } else {

        this.pilProfile = false;

        if (this.oData.profile === undefined || this.oData.profile === null) {
          for (let i = 0; i < this.oData.profiles.length; i++) {
            if (this.oData.profiles[i].kdProfile == this.oData.idProfile) {
              this.oData.profile = this.oData.profiles[i];
            }
          }
        }

        this.perusahaan = this.oData.profile.namaLengkap;
        this.modAppA = this.oData.modulAplikasis;
        if (this.modAppA.length > 1 && (this.oData.idModulAplikasi == null)) {
          this.pilModApp = true;
          this.modAppTerpilih = this.modAppA[0].kdModulAplikasi;
          this.buildModApps(this.modAppA);
        } else {

          this.pilModApp = false;

          if (this.oData.modulAplikasi === undefined || this.oData.modulAplikasi === null) {
            for (let i = 0; i < this.oData.modulAplikasis.length; i++) {
              if (this.oData.modulAplikasis[i].kdModulAplikasi == this.oData.idModulAplikasi) {
                this.oData.modulAplikasi = this.oData.modulAplikasis[i];
              }
            }
          }
          this.modul = this.oData.modulAplikasi.modulAplikasi;
          this.lokasiA = this.oData.lokasis;

          this.showModul = this.oData.modulAplikasis.length > 1;

          if (this.lokasiA.length > 1 && (this.oData.idLokasi == null)) {
            this.pilLokasi = true;
            this.lokasiTerpilih = this.lokasiA[0].kdRuangan;
            this.buildLokasis(this.lokasiA);
          } else {

            this.pilLokasi = false;

            if (this.oData.lokasi === undefined || this.oData.lokasi === null) {
              for (let i = 0; i < this.oData.lokasis.length; i++) {
                if (this.oData.lokasis[i].kdRuangan == this.oData.idLokasi) {
                  this.oData.lokasi = this.oData.lokasis[i];
                }
              }
            }

            this.namalokasi = this.oData.lokasi.namaRuangan;
            this.ruanganA = this.oData.ruangans;
            if (this.ruanganA.length > 1 && (this.oData.idRuangan == null)) {
              this.pilRuangan = true;
              this.ruanganTerpilih = this.ruanganA[0].kdRuangan;
              this.buildRuangans(this.ruanganA);
            } else {
              this.unitKerja = this.oData.ruangan.namaRuangan;
              this.pilRuangan = false;
              this.pilLanjut = true;
            }
          }
        }
      }
    } else {
      this.alert.warn("Peringatan", this.userPassPil);
    }
  }

  keyboardLogin(event, f: any) {

    if (this.loading || !f.form.valid) {
      return;
    }

    if (event.keyCode == 13) {
      this.loginUser();
    }
  }

  loginUser() {
    this.info.hide();
    console.log("loginUser");

    this.authGuard.setUserDto(null);
    this.loading = true;
    this.authentication
      .login(this.model.username, this.model.password)
      .timeout(5000)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.loading = false;
          if (error.name == 'TimeoutError') {
            this.alert.warn("Peringatan", this.koneksi);
          } else {
            let errorMessage = JSON.parse(error._body)
            let errorText = '';
            if (errorMessage.statusCode == "501" || errorMessage.statusCode == 501) {
              for (let i = 0; i < errorMessage.errors.length; i++) {
                errorText += errorMessage.errors[i].error;
              }
              this.alert.warn("Peringatan", errorText);
            } else {
              this.alert.warn("Peringatan", this.koneksi);
            }
          }
        }
      );
  }

  selectProfile() {
    this.info.hide();
    console.log("selectProfile");

    this.oData.idProfile = this.profileTerpilih * 1;
    this.oData.kdProfile = this.profileTerpilih * 1;

    this.oData.idModulAplikasi = null;
    this.oData.kdModulAplikasi = null;

    this.oData.idLokasi = null;
    this.oData.kdLokasi = null;

    this.oData.idRuangan = null;
    this.oData.kdRuangan = null;

    this.loading = true;

    this.authentication
      .logProfile(this.oData)
      .timeout(8000)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.loading = false;
          if (error.name == 'TimeoutError') {
            this.alert.warn("Peringatan", this.koneksi);
          } else {
            let errorMessage = JSON.parse(error._body)
            let errorText = '';
            if (errorMessage.statusCode == "501" || errorMessage.statusCode == 501) {
              for (let i = 0; i < errorMessage.errors.length; i++) {
                errorText += errorMessage.errors[i].error;
              }
              this.alert.warn("Peringatan", errorText);
            } else {
              this.alert.warn("Peringatan", this.koneksi);
            }
          }
        }
      );
  }

  selectModApp() {
    this.info.hide();
    console.log("selectModApp");

    this.oData.idModulAplikasi = this.modAppTerpilih;
    this.oData.kdModulAplikasi = this.modAppTerpilih;

    this.oData.idLokasi = null;
    this.oData.kdLokasi = null;
    this.loading = true;

    this.authentication
      .logModulApp(this.oData)
      .timeout(5000)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.loading = false;
          if (error.name == 'TimeoutError') {
            this.alert.warn("Peringatan", this.koneksi);
          } else {
            let errorMessage = JSON.parse(error._body)
            let errorText = '';
            if (errorMessage.statusCode == "501" || errorMessage.statusCode == 501) {
              for (let i = 0; i < errorMessage.errors.length; i++) {
                errorText += errorMessage.errors[i].error;
              }
              this.alert.warn("Peringatan", errorText);
            } else {
              this.alert.warn("Peringatan", this.koneksi);
            }
          }
        }
      );
  }

  selectLokasi() {
    this.info.hide();
    console.log("selectLokasi");

    this.oData.idLokasi = this.lokasiTerpilih;
    this.oData.kdLokasi = this.lokasiTerpilih;

    this.oData.idRuangan = null;
    this.oData.kdRuangan = null;

    this.loading = true;

    this.authentication
      .logLokasi(this.oData)
      .timeout(8000)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.loading = false;
          if (error.name == 'TimeoutError') {
            this.alert.warn("Peringatan", this.koneksi);
          } else {
            let errorMessage = JSON.parse(error._body)
            let errorText = '';
            if (errorMessage.statusCode == "501" || errorMessage.statusCode == 501) {
              for (let i = 0; i < errorMessage.errors.length; i++) {
                errorText += errorMessage.errors[i].error;
              }
              this.alert.warn("Peringatan", errorText);
            } else {
              this.alert.warn("Peringatan", this.koneksi);
            }
          }
        }
      );
  }

  selectRuangan() {
    this.info.hide();
    console.log("selectRuangan");

    this.oData.idRuangan = this.ruanganTerpilih;
    this.oData.kdRuangan = this.ruanganTerpilih;
    this.loading = true;

    this.authentication
      .logRuangan(this.oData)
      .timeout(5000)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.loading = false;
          if (error.name == 'TimeoutError') {
            this.alert.warn("Peringatan", this.koneksi);
          } else {
            let errorMessage = JSON.parse(error._body)
            let errorText = '';
            if (errorMessage.statusCode == "501" || errorMessage.statusCode == 501) {
              for (let i = 0; i < errorMessage.errors.length; i++) {
                errorText += errorMessage.errors[i].error;
              }
              this.alert.warn("Peringatan", errorText);
            } else {
              this.alert.warn("Peringatan", this.koneksi);
            }
          }
        }
      );
  }

  selectKomputer() {
    if (this.namaKomputer) {
      sessionStorage.setItem('namaKomputer', this.namaKomputer);
      this.pilihNamaKomputer = true;
    } else {
      this.pilihNamaKomputer = false;
      this.alert.warn("Peringatan", 'Nama Komputer Belum Diisi');
    }
  }

  changeNamaKomputer(event) {
    this.namaKomputerSesion = sessionStorage.getItem('namaKomputer');
    if (this.namaKomputerSesion == this.namaKomputer) {
      this.pilihNamaKomputer = true;
    } else {
      this.pilihNamaKomputer = false;
    }
  }

  setVersionLang() {

    let idModul;
    if(this.satuModulData != ''){
      idModul = this.satuModulData;
    }else if(this.satuModulData == ''){
      idModul = this.oData
    }

    //keperluanLanManager
    let langKdModulAplikasi = {
      "kdModulAplikasi": idModul.kdModulAplikasi,
      "kdVersion": idModul.kdVersion,
      "kdProfile": idModul.kdProfile,
    }
    localStorage.setItem('langKdModulAplikasi', JSON.stringify(langKdModulAplikasi));
    if (idModul.kdBahasa) {
      this.translate.setDefaultLang(idModul.kdBahasa);
      this.translate.use(idModul.kdBahasa);
      this.translate.reloadLang(idModul.kdBahasa);
    } else {
      this.translate.setDefaultLang('1');
      this.translate.use('1');
      this.translate.reloadLang('1');
    }

  }
}
