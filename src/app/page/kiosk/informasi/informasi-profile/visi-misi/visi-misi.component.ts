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
	selector: "app-visi-misi",
	templateUrl: "./visi-misi.component.html",
	styleUrls: ["./visi-misi.component.scss", "../../../kiosk-global.scss"],
	providers: [ConfirmationService]
})
export class VisiMisiComponent implements OnInit {
	listVisi: any[];
	listMisi: any[];
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService
	) {}
	ngOnInit() {
		this.listVisi = [];
		this.listMisi = [];
		this.hideMenu();
		this.getVisi();
		// this.getMisi();
		// this.listVisi = ['Melayani','Menyehatkan'];
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

	getVisi() {
		this.httpService
			.get(
				Configuration.get().klinik1Java +
					"/ProfileHistoriVisiMisi/getVisiMisi"
			)
			.subscribe(res => {
				let dataTempMisi = [];
				let dataTempVisi = [];
				res.forEach(el => {
					dataTempVisi.push(el.namaVisi);
					dataTempMisi.push(el.namaMisi);
				});
				this.listMisi = dataTempMisi;
				this.listVisi = dataTempVisi;
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
