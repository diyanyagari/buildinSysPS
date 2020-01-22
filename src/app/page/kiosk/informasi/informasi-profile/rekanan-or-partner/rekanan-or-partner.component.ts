import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ConfirmationService } from "primeng/primeng";
import {
  HttpClient,
  Configuration,
  MessageService,
  AuthGuard,
  InfoService,
  SettingsService,
  NotificationService,
  Authentication
} from "../../../../../global";
@Component({
  selector: 'app-rekanan-or-partner',
  templateUrl: './rekanan-or-partner.component.html',
  styleUrls: ['./rekanan-or-partner.component.scss', '../../../kiosk-global.scss'],
  providers: [ConfirmationService]
})
export class RekananOrPartnerComponent implements OnInit, OnDestroy, AfterViewInit {
  listRekanan: any[];
  isOne: boolean = false;
  isTwo: boolean = false;
  isThree: boolean = false;
  isFour: boolean = false;
  isMoreThanFour: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private httpService: HttpClient,
    private notificationService: NotificationService,
    private auth: Authentication,
    private info: InfoService,
    private el: ElementRef
  ) { }


  ngOnInit() {
    this.hideMenu();
    this.dataRekanan();
  }

  ngAfterViewInit() {

  }

  hideMenu() {
    var refactorLayout = document.getElementsByClassName('layout-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorLayout.length; i++) {
      refactorLayout[i].style.marginLeft = '0px';
      refactorLayout[i].style.padding = '0px 0px 0px 0px';
    }

    document.getElementById("app-topbar").style.visibility = "hidden";
    document.getElementById("app-sidebar").style.visibility = "hidden";
    document.getElementById("app-footer").style.visibility = "hidden";
    document.getElementById("pembatas").style.height = "0px";
  }

  ngOnDestroy() {
    var bodySetBackground = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodySetBackground.length; i++) {
      bodySetBackground[i].style.backgroundColor = '#ecf0f5';
      bodySetBackground[i].style.backgroundImage = null;
    }
    var refactorLayout = document.getElementsByClassName('layout-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorLayout.length; i++) {
      refactorLayout[i].style.marginLeft = '60px';
      refactorLayout[i].style.padding = '60px 10px 0 10px';
    }
    document.getElementById("app-topbar").style.visibility = "visible";
    document.getElementById("app-sidebar").style.visibility = "visible";
    document.getElementById("app-footer").style.visibility = "visible";
    document.getElementById("pembatas").style.height = "45px";
  }

  dataRekanan() {
    this.httpService.get(`${Configuration.get().klinik1Java}/RekananController/getRekanan`).subscribe(res => {
      // this.listRekanan = res;
      let dataTemp = [];      
      res.forEach(el => {
        let data = {
          alamatLengkap: el.alamatLengkap,
          contactPerson: el.contactPerson,
          faksimile1: el.faksimile1,
          fixedPhone1: el.fixedPhone1,
          gambarLogo: null,
          kdAccount: el.kdAccount,
          kdDepartemen: el.kdDepartemen,
          kdJenisRekanan: el.kdJenisRekanan,
          kdPegawai: el.kdPegawai,
          kdRekanan: el.kdRekanan,
          kode: el.kode,
          kodeExternal: el.kodeExternal,
          mobilePhone1: el.mobilePhone1,
          nPWP: el.nPWP,
          namaDepartemen: el.namaDepartemen,
          namaExternal: el.namaExternal,
          namaRekanan: el.namaRekanan,
          noPKP: el.noPKP,
          noRec: el.noRec,
          reportDisplay: el.reportDisplay,
          statusEnabled: el.statusEnabled,
          tglAkhir: el.tglAkhir,
          tglAwal: el.tglAwal,
          tglDaftar: el.tglDaftar,
        }
        if(el.gambarLogo === null || el.gambarLogo === '') {
          data.gambarLogo = `../../../../../../assets/layout/images/bottis-default.jpg`;
        } else {
          data.gambarLogo = `${Configuration.get().resourceReport}/image/show/${el.gambarLogo}?noProfile=true`;
        }
        dataTemp.push(data);
      });
      this.listRekanan = dataTemp;
      if (this.listRekanan.length == 1) {
        this.isOne = true;
        this.isTwo = false;
        this.isThree = false;
        this.isFour = false;
        this.isMoreThanFour = false;
      } else if (this.listRekanan.length === 2 || this.listRekanan.length === 3) {
        this.isOne = false;
        this.isTwo = true;
        this.isThree = true;
        this.isFour = false;
        this.isMoreThanFour = false;
      }
    });
  }

  logout(event: Event) {
    event.preventDefault();
    // this.auth.logout();
    // window.alert("jgn lupa dibalikin sebelum dipush");
    this.confirmationService.confirm({
      message:
        "<div>Harap simpan pekerjaan sebelum logout.<br/>Yakin akan melanjutkan?</div>",
      header: "Peringatan",
      accept: () => {
        this.httpService
          .get(Configuration.get().authLogin + "/off/sign-out-all")
          .subscribe(
            res => {
              this.notificationService.logout();
              this.auth.logout();
            },
            error => {
              this.info.warn(
                "Peringatan",
                "Logout tidak berhasil, harap coba lagi atau cek koneksi internet anda."
              );
            }
          );
      },
      reject: () => { }
    });
  }
}
