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
	selector: "app-prestasi-or-award",
	templateUrl: "./prestasi-or-award.component.html",
	styleUrls: [
		"./prestasi-or-award.component.scss",
		"../../../kiosk-global.scss"
	],
	providers: [ConfirmationService]
})
export class PrestasiOrAwardComponent implements OnInit {
	inWrap: any;
	speed: number;
	autoswitch: boolean;
	autoswitch_speed: number;
	listAward: any[];
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth : Authentication,
		private info : InfoService,
	) {}

	ngOnInit() {
		this.listAward = [];
		this.speed = 500;
		this.autoswitch = false;
		this.autoswitch_speed = 5000;
		this.hideMenu();
		$(".slide").first().addClass("active");
		$(".slide").hide();
		$(".active").show();
		if (this.autoswitch) {
			setInterval(this.nextSlide, this.autoswitch_speed);
		}
		$("#next").on("click", this.nextSlide);
		$("#prev").on("click", this.prevSlide);
		this.getDataAward()
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

	nextSlide() {
		$(".active").removeClass("active").addClass("oldActive");
		if ($(".oldActive").is(":last-child")) {
			$(".slide").first().addClass("active");
		} else {
			$(".oldActive").next().addClass("active");
		}
		$(".oldActive").removeClass("oldActive");
		$(".slide").fadeOut(this.speed);
		$(".active").fadeIn(this.speed);
	}

	prevSlide() {
		$(".active").removeClass("active").addClass("oldActive");
		if ($(".oldActive").is(":first-child")) {
			$(".slide").last().addClass("active");
		} else {
			$(".oldActive").prev().addClass("active");
		}
		$(".oldActive").removeClass("oldActive");
		$(".slide").fadeOut(this.speed);
		$(".active").fadeIn(this.speed);
	}

	getDataAward() {
		this.httpService.get(`${Configuration.get().klinik1Java}/ProfileHistoriAwardController/getAward`).subscribe(res => {
			this.listAward = res;
			console.log(res);
		})
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
