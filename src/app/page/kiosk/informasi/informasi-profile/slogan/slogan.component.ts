import { Component, OnInit } from "@angular/core";
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
	selector: "app-slogan",
	templateUrl: "./slogan.component.html",
  styleUrls: ["./slogan.component.scss", "../../../kiosk-global.scss"],
  providers: [ConfirmationService]
})
export class SloganComponent implements OnInit {
	data: any[];
	messageToKlien: any;
	mottoProfile: any;
	semboyanProfile: any;
	sloganProfile: any;
	taglineProfile: any;
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService
	) {}
	ngOnInit() {
		this.messageToKlien = "";
		this.mottoProfile = "";
		this.semboyanProfile = "";
		this.taglineProfile = "";
		this.data = [];
		this.hideMenu();
		this.dataSlogan();
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
			bodySetBackground[i].style.overflow = "hidden";
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

	dataSlogan() {
		this.httpService.get(`${Configuration.get().klinik1Java}/ProfileHistoriSTMS/getProfileHistoriStms`)
			.subscribe(res => {
				// this.data = res;
				let dataTemp = [];
				res.forEach(el => {
					let data = {
						slogan: {
							name: el.sloganProfile.split(':')[0],
							desc: el.sloganProfile.split(':')[1]
						},
						massage: {
							name: el.messageToKlien.split(':')[0],
							desc: el.messageToKlien.split(':')[1],
						},
						motto: {
							name: el.mottoProfile.split(':')[0],
							desc: el.mottoProfile.split(':')[1],
						},
						semboyan: {
							name: el.semboyanProfile.split(':')[0],
							desc: el.semboyanProfile.split(':')[1],
						},
						tagline: {
							name: el.taglineProfile.split(':')[0],
							desc: el.taglineProfile.split(':')[1],
						}
					}
					dataTemp.push(data);
				});
				// console.log(dataTemp);
				this.data = dataTemp;
				// this.sloganProfile = res[0].sloganProfile.split(':')[1];
				// this.messageToKlien = res[0].messageToKlien.split(':')[1];
				// this.mottoProfile = res[0].mottoProfile.split(':')[1];
				// this.semboyanProfile = res[0].semboyanProfile.split(':')[1];
				// this.taglineProfile = res[0].taglineProfile.split(':')[1];
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
			reject: () => {}
		});
	}
}
