import { Component, OnInit, OnDestroy } from '@angular/core';
import { Configuration, HttpClient, InfoService, Authentication, NotificationService } from '../../../../../global';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-tarif-pelayanan',
  templateUrl: './tarif-pelayanan.component.html',
  styleUrls: ['./tarif-pelayanan.component.scss', '../../../kiosk-global.scss'],
  providers: [ConfirmationService]
})
export class TarifPelayananComponent implements OnInit, OnDestroy {
  data: any[];
  constructor(private confirmationService: ConfirmationService,
    private httpService: HttpClient,
    private notificationService: NotificationService,
    private auth: Authentication,
    private info: InfoService) { }

  ngOnInit() {
    this.data = [];
    this.hideMenu();
    this.getDataTarifPelayanan();
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

  getDataTarifPelayanan() {
    this.httpService.get(`${Configuration.get().klinik1Java}/TarifPelayananController/getTarifPelayanan`).subscribe(res => {
      this.data = res.fasilitaslayanan;
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
