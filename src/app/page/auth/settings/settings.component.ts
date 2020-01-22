import { Component, OnInit, OnDestroy, Inject, forwardRef } from '@angular/core';
import { DropdownModule, SelectItem, InplaceModule } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, UserDto, Authentication, AuthGuard, AlertService, InfoService, SettingsService, Configuration, LangToFlag, SettingInfo, NotificationService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AppMenuComponent } from '../../../';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [AppMenuComponent]
})

export class SettingsComponent implements OnInit, OnDestroy {

  state: any;
  private stateInfo: Subscription;

  perusahaan: string;
  modul: string;
  unitKerja: string;

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

  ruangan: SelectItem[];
  ruanganA = [];
  ruanganTerpilih: any;

  pilProfile: boolean = false;
  pilModApp: boolean = false;
  pilRuangan: boolean = false;

  pilAll: boolean = false;
  pilLanjut: boolean = false;

  urlRes: string;

  oData: any;

  koneksi: string = 'Gagal, periksa koneksi jaringan.';
  userPassPil: string = 'Gagal, periksa kembali pilihan anda.';
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
    namaKomputerSesion:any;
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authentication: Authentication,
    private translate: TranslateService,
    private authGuard: AuthGuard,
    private alert: AlertService,
    private appMenu: AppMenuComponent,
    private notificationService: NotificationService,
    private httpService: HttpClient,
    private settingsService: SettingsService) {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    this.urlRes = Configuration.get().resourceFile + '/image/show/';
  }

  ngOnInit() {
    this.namaKomputerSesion= sessionStorage.getItem('namaKomputer');
    this.stateInfo = this.settingsService.getSettingsShow().subscribe(show => {
      this.pilAll = show;

      this.profile = this.settingsService.getCurrentInfo().profile;
      this.profileA = this.settingsService.getCurrentInfo().profileA;
      //this.profileTerpilih = this.settingsService.getCurrentInfo().profileTerpilih;

      this.modApp = this.settingsService.getCurrentInfo().modApp;
      this.modAppA = this.settingsService.getCurrentInfo().modAppA;
      //this.modAppTerpilih = this.settingsService.getCurrentInfo().modAppTerpilih;

      this.ruangan = this.settingsService.getCurrentInfo().ruangan;
      this.ruanganA = this.settingsService.getCurrentInfo().ruanganA;
      //this.ruanganTerpilih = this.settingsService.getCurrentInfo().ruanganTerpilih;

      this.pilProfile = this.profileA.length > 1;
      this.pilModApp = this.modAppA.length > 1;
      this.pilRuangan = this.ruanganA.length > 1;

      this.oData = this.authGuard.getUserDto();

      if (!this.pilProfile) {
        this.perusahaan = this.oData.profile.namaLengkap;
      }

      if (!this.pilModApp) {
        this.modul = this.oData.modulAplikasi.modulAplikasi;
      }

      if (!this.pilRuangan) {
        this.unitKerja = this.oData.ruangan.namaRuangan;
      }

    });
  }

  ngOnDestroy() {
    this.stateInfo.unsubscribe();
  }
  settingPrinter() {
    this.router.navigate(['master-data/map-komputer-to-printer']);
    this.pilAll=false;
  }
  succes() {
    this.authGuard.isLogin();
    this.httpService.get(Configuration.get().authLogin + '/menu/dinamic').subscribe(res => {

      this.appMenu.loadMenu(res.data.menuUtama);
      this.settingsService.setCurrentMenu(res.data.menuUtama);
      this.settingsService.setCurrentURL(res.data.listUrl);
      this.settingsService.setCurrentURL(res.data.namaObjek);

      this.state = {
        profile: this.profile,
        profileA: this.profileA,
        profileTerpilih: this.profileTerpilih,

        modApp: this.modApp,
        modAppA: this.modAppA,
        modAppTerpilih: this.modAppTerpilih,

        ruangan: this.ruangan,
        ruanganA: this.ruanganA,
        ruanganTerpilih: this.ruanganTerpilih
      };
      this.settingsService.setSettingInfo(this.state);
      this.pilAll = false;
      this.router.navigate(['']);
    });
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

  buildRuangans(data: any) {
    this.ruangan = [];
    for (let i = 0; i < data.length; i++) {
      this.ruangan.push({ label: data[i].namaRuangan, value: data[i].kdRuangan });
    }
    this.profileTerpilih = data[0].kdRuangan;
  }

  trackByFn(index, item) {
    return index;
  }

  masuk() {
    if (this.pilLanjut) {

      this.authGuard.setUserDto(this.oData);
      this.perusahaan = this.oData.profile.namaLengkap;
      this.profileA = this.oData.profiles;
      this.modAppA = this.oData.modulAplikasis;
      this.ruanganA = this.oData.ruangans;

      this.profileTerpilih = this.profileA[0].kdProfile;
      this.ruanganTerpilih = this.ruanganA[0].kdRuangan;
      this.modAppTerpilih = this.modAppA[0].kdModulAplikasi;

      this.succes();

    }
  }

  checkData(data: any) {
    this.loading = false;
    // if (data.token != undefined && data.token != null && !this.pilAll) {
    //    this.authGuard.setUserDto(data);
    //    this.perusahaan = data.profile.namaLengkap;
    //    this.profileA = data.profiles;
    //    this.modAppA = data.modulAplikasis;
    //    this.ruanganA = data.ruangans;    

    //    this.profileTerpilih = this.profileA[0].kdProfile;
    //    this.ruanganTerpilih = this.ruanganA[0].kdRuangan;
    //    this.modAppTerpilih = this.modAppA[0].kdModulAplikasi;

    //    this.succes();              
    // } else 

    if (data != undefined && data != null) {
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
          this.ruanganA = this.oData.ruangans;
          if (this.ruanganA.length > 1 && (this.oData.idRuangan == null)) {
            this.pilRuangan = true;
            this.ruanganTerpilih = this.ruanganA[0].kdRuangan;
            this.buildRuangans(this.ruanganA);
          } else {
            this.unitKerja = this.modul = this.oData.ruangan.namaRuangan;
            this.pilRuangan = false;
            this.pilLanjut = true;
          }
        }
      }
    } else {
      this.alert.error('Error', this.userPassPil);
    }
  }

  selectProfile() {
    console.log("selectProfile");

    this.oData.idProfile = this.profileTerpilih * 1;
    this.oData.kdProfile = this.profileTerpilih * 1;

    this.oData.idModulAplikasi = null;
    this.oData.kdModulAplikasi = null;

    this.oData.idRuangan = null;
    this.oData.kdRuangan = null;

    this.loading = true;

    this.authentication
      .logProfile(this.oData)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.alert.error('Error', this.koneksi);
          this.loading = false;
        }
      );
  }

  selectModApp() {
    console.log("selectModApp");

    this.oData.idModulAplikasi = this.modAppTerpilih;
    this.oData.kdModulAplikasi = this.modAppTerpilih;

    this.oData.idRuangan = null;
    this.oData.kdRuangan = null;
    this.loading = true;

    this.authentication
      .logModulApp(this.oData)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.alert.error('Error', this.koneksi);
          this.loading = false;
        }
      );
  }

  selectRuangan() {
    console.log("selectRuangan");

    this.oData.idRuangan = this.ruanganTerpilih;
    this.oData.kdRuangan = this.ruanganTerpilih;
    this.loading = true;

    this.authentication
      .logRuangan(this.oData)
      .subscribe(
        data => {
          this.checkData(data);
        },
        error => {
          this.alert.error('Error', this.koneksi);
          this.loading = false;
        }
      );
  }

}	