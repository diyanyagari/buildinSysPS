import { Component, OnInit, OnDestroy } from "@angular/core";
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
} from "../../../global";
import { Router, NavigationExtras } from '@angular/router';

@Component({
	selector: "app-antrian",
	templateUrl: "./antrian.component.html",
	styleUrls: ["../kiosk-global.scss", "./antrian.component.scss"],
	providers: [ConfirmationService]
})
export class AntrianComponent implements OnInit, OnDestroy {
	listData: any[];
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService,
		private router: Router
	) { }

	ngOnInit() {
		let hostUrl = window.location.hash.replace("/", ",").split(",");
		let kiosk = hostUrl[1].split("/");
		this.hideMenu();
		this.getService();
	}

	hideMenu() {
		var refactorLayout = document.getElementsByClassName(
			"layout-content"
		) as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorLayout.length; i++) {
			refactorLayout[i].style.marginLeft = "0px";
			refactorLayout[i].style.padding = "0px 0px 0px 0px";
		}

		document.getElementById("app-topbar").style.visibility = "hidden";
		document.getElementById("app-sidebar").style.visibility = "hidden";
		document.getElementById("app-footer").style.visibility = "hidden";
		document.getElementById("pembatas").style.height = "0px";
	}

	ngOnDestroy() {
		var bodySetBackground = document.getElementsByClassName(
			"main-body"
		) as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < bodySetBackground.length; i++) {
			bodySetBackground[i].style.backgroundColor = "#ecf0f5";
			bodySetBackground[i].style.backgroundImage = null;
		}
		var refactorLayout = document.getElementsByClassName(
			"layout-content"
		) as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorLayout.length; i++) {
			refactorLayout[i].style.marginLeft = "60px";
			refactorLayout[i].style.padding = "60px 10px 0 10px";
		}
		document.getElementById("app-topbar").style.visibility = "visible";
		document.getElementById("app-sidebar").style.visibility = "visible";
		document.getElementById("app-footer").style.visibility = "visible";
		document.getElementById("pembatas").style.height = "45px";
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

	getService() {
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findKontakRekananPenjamin').subscribe(table => {
			this.listData = [];
			this.listData = table;
			let data = [];
			for (let i = 0; i < table.length; i++) {
				let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
				if (table[i].gambarLogo !== null) {
					path = Configuration.get().resourceFile + '/image/show/' + table[i].gambarLogo;
				}
				data[i] = {
					"gambarIcon": path,
					"namaLengkap": table[i].namaKelompokKlien,
					"kode": table[i].kode
				}
				
			}
			this.listData=data;
			console.log(this.listData);
		});
	}

	clickAntrian(data) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "nama": data.namaLengkap,
                "noKontak": data.kode.kode
            }
        };
        this.router.navigate(["kiosk/antrian/jenis-pasien"], navigationExtras);
    }
}
