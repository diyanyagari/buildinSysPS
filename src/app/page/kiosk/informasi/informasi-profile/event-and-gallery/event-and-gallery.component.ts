import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	AfterViewInit
} from "@angular/core";
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
declare var jquery: any;
declare var $: any;

@Component({
	selector: "app-event-and-gallery",
	templateUrl: "./event-and-gallery.component.html",
	styleUrls: [
		"../../../kiosk-global.scss",
		"./event-and-gallery.component.scss"
	],
	providers: [ConfirmationService]
})
export class EventAndGalleryComponent implements OnInit, AfterViewInit {
	inWrap: any;
	data: any[];
	
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService,
	) { }
	speed: number; //transition speed - fade
	autoswitch: boolean; //auto slider options
	autoswitch_speed: number; //auto slider speed
	ngAfterViewInit() { }
	ngOnInit() {
		this.data = [];
		this.speed = 500;
		this.autoswitch = false;
		this.autoswitch_speed = 5000;
		this.hideMenu();
		this.dataEvent();

		// $(".slide").first().addClass("active");
		// $(".slide").hide();
		// $(".active").show();
		if (this.autoswitch) {
			setInterval(this.nextSlide, this.autoswitch_speed);
		}
		$("#next").on("click", this.nextSlide);
		$("#prev").on("click", this.prevSlide);

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

	dataEvent() {
		this.httpService.get(Configuration.get().klinik1Java + '/EventGalleryController/getEventGallery').subscribe(res => {
			// this.data = res;
			let dataTemp: any[];
			dataTemp = [];
			res.forEach(item => {
				let datas = {
					deskripsiEvent: item.deskripsiEvent,
					keteranganLainnya: null,
					// kode: item.kode,
					kdEvent: item.kode.kdEvent,
					kdProfile: item.kode.kdProfile,
					noHistori: item.noHistori,
					namaEvent: item.namaEvent,
					noRec: item.noRec,
					pathFileFolderEvent: `${Configuration.get().resourceReport}/image/show/${item.pathFileFolderEvent}?noProfile=true`,
					statusEnabled: item.statusEnabled,
				}
				dataTemp.push(datas)
			});
			this.data = dataTemp;
			console.log(dataTemp);
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
