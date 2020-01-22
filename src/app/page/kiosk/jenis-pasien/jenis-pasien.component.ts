import { Component, OnInit, OnDestroy } from "@angular/core";
import { ConfirmationService } from "primeng/primeng";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

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

@Component({
	selector: "app-jenis-pasien",
	templateUrl: "./jenis-pasien.component.html",
	styleUrls: ["../kiosk-global.scss", "./jenis-pasien.component.scss"],
	providers: [ConfirmationService]
})
export class JenisPasienComponent implements OnInit, OnDestroy {
	jenisAsalPasien: any;
	listData: any[];
	kdStatusPasienBaru: any;
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService,
		private routes: ActivatedRoute,
		private router: Router
	) {
		this.routes.queryParams.subscribe(params => {
			this.jenisAsalPasien = params;
			console.log(params)
		});

	}

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
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findJenisPasien').subscribe(table => {
			this.listData = [];
			this.listData = table;
			let data = []
			for (let i = 0; i < table.length; i++) {
				let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
				if (table[i].iconImagePathFile !== null) {
					path = Configuration.get().resourceFile + '/image/show/' + table[i].iconImagePathFile +'?noProfile=false';
				}
				data[i] = {
					"iconImage": path,
					"namaStatus": table[i].namaStatus,
					"kdStatus": table[i].kdStatus
				}
				
			}
			this.listData=data;

			let fr = '';
			for (let i = 0; i < table.length; i++) {
				fr += '1fr'
			}
			var refactorLayout = document.getElementsByClassName("main-content") as HTMLCollectionOf<HTMLBodyElement>;
			for (let i = 0; i < refactorLayout.length; i++) {
				refactorLayout[i].style.display = '';
			}

		});

		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/getKdStatusPasienBaru').subscribe(table => {
			this.kdStatusPasienBaru = table.kdStatus;

		});
	}

	clickJenisPasien(data) {
		let navigationExtras: NavigationExtras = {
			queryParams: {
				"nama": this.jenisAsalPasien.nama,
				"noKontak": this.jenisAsalPasien.noKontak,
				"statusPasien": data.kdStatus,

			}
		};
		if (data.kdStatus == this.kdStatusPasienBaru) {
			this.router.navigate(["kiosk/antrian/jenis-pasien-baru"], navigationExtras);
		} else {
			this.router.navigate(["kiosk/antrian/jenis-pasien-lama"], navigationExtras);

		}

	}
}
