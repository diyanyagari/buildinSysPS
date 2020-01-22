import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

import { ConfirmationService } from "primeng/primeng";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {Calendar} from "primeng/components/calendar/calendar";
import {
	HttpClient,
	Configuration,
	MessageService,
	AuthGuard,
	InfoService,
	SettingsService,
	NotificationService,
	Authentication,
	AlertService,
	ReportService,
	PrinterService
} from "../../../global";
@Injectable()

@Component({
	selector: "app-jenis-pasien-lama",
	// encapsulation: ViewEncapsulation.None,
	templateUrl: "./jenis-pasien-lama.component.html",
	styleUrls: ["../kiosk-global.scss", "./jenis-pasien-lama.component.scss"],
	providers: [ConfirmationService]
})
export class JenisPasienLamaComponent implements AfterViewInit, OnInit, OnDestroy {
	jenisAsalPasien: any = null;
	noRmActive: boolean;
	noIdentitasActive: boolean;
	tglPelayananActive: boolean;
	alamatLengkapActive: boolean;
	namaLengkapActive: boolean;
	tglLahirActive: boolean;
	tempatLahirActive: boolean;
	rtrwActive: boolean;
	kodePosActive: boolean;
	keyboard: Keyboard;
	dataIdentitasDialog: boolean;
	buttonAktif: boolean = true;
	formBatal: FormGroup;
	listJenisAlamat: any[];
	listNegara: any[];
	rangeTahunLahir: any;
	rangeTahun: any;
	profile: any;
	listJenisIdentitas: any[];
	listPropinsi: any[];
	listKotaKabupaten: any[];
	listKecamatan: any[];
	listDesaKelurahan: any[];

	labelKeyboard: any = '';
	placeHolderKeyboard: any = '';
	keyboardText: any = '';
	//cetak
	tglPelayanan: any = "";
	alamatLengkap: any = "";
	namaLengkap: any = "";
	tglLahir: any = "";
	noIdentitas: any = "";
	kdJenisKelamin: any = "";
	tempatLahir: any = "";
	kdJenisAlamat: any = "";
	kdNegara: any = "";
	kdKotaKabupaten: any = "";
	kdPropinsi: any = "";
	kdKecamatan: any = "";
	kdDesaKelurahan: any = "";
	kodePos: any = "";
	rtrw: any = "";
	listCounterPasien: any[];
	minDate: any;
	shortcutCetakAntrian = 'cetakAntrianKiosK';
	hotKey: any = null;
	jenisIdentitas: any = '';
	noRm: any = "";

	@ViewChild('myCalendar') Calendar: Calendar;
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService,
		private routes: ActivatedRoute,
		private fb: FormBuilder,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService,
		private printer: PrinterService,
		private router: Router

	) {
		this.routes.queryParams.subscribe(params => {
			this.jenisAsalPasien = params;
			if (this.jenisAsalPasien.noRm) {
				this.validateNoRM(this.jenisAsalPasien.noRm);
			}
		});

	}

	ngAfterViewInit() {
		this.keyboard = new Keyboard({
			onChange: input => this.onChange(input),
			onKeyPress: button => this.onKeyPress(button)
		});

		let styleRtrw = document.getElementById("inputRTRW");
		styleRtrw.children[0].setAttribute('style', 'width: 100%;height: 5vh !important;font-size: 18px !important;padding: 10px !important;border: 0 !important;')

		let styleNomorKtp = document.getElementById("nomorKtp");
		styleNomorKtp.style.marginTop = "130px";
		styleNomorKtp.style.display = "flex";
		styleNomorKtp.style.margin = "0 auto";
		styleNomorKtp.style.height = "80px";
		styleNomorKtp.style.width = "50%";
		styleNomorKtp.style.fontSize = "30px";
		styleNomorKtp.style.color = "#444444";
		styleNomorKtp.style.border = "5px solid #466179";
		styleNomorKtp.style.background = "white";

		let styleTglPelayanan = document.getElementById("tglPelayanan");
		styleTglPelayanan.style.marginTop = "130px";
		styleTglPelayanan.style.display = "flex";
		styleTglPelayanan.style.margin = "0 auto";
		styleTglPelayanan.style.height = "80px";
		styleTglPelayanan.style.width = "53%";
		styleTglPelayanan.style.fontSize = "30px";
		styleTglPelayanan.style.color = "#444444";
		styleTglPelayanan.style.border = "5px solid #466179";
		styleTglPelayanan.style.background = "white";

		let styleTglPelayanan1 = document.getElementById("tglPelayanan1");
		styleTglPelayanan1.style.fontSize = "30px";
		styleTglPelayanan1.style.color = "#444444";
		styleTglPelayanan1.style.background = "white";

		styleTglPelayanan1.children[0].children[0].classList.add('calender-tglpelayanan');

		let dialogTglPelayanan = document.getElementById("dialogTglPelayanan");
		dialogTglPelayanan.style.marginTop = "130px";
		dialogTglPelayanan.style.display = "table";
		dialogTglPelayanan.style.margin = "0 auto";
		dialogTglPelayanan.style.height = "10px";
		dialogTglPelayanan.style.width = "100%";
		dialogTglPelayanan.style.color = "#444444";
		dialogTglPelayanan.style.border = "3px solid #466179";
		dialogTglPelayanan.style.background = "white";
		dialogTglPelayanan.children[0].children[0].classList.add('dialog-kiosk-data-input');


		let dialogTglLahir = document.getElementById("dialogTglLahir");
		dialogTglLahir.style.marginTop = "130px";
		dialogTglLahir.style.display = "table";
		dialogTglLahir.style.margin = "0 auto";
		dialogTglLahir.style.height = "10px";
		dialogTglLahir.style.width = "100%";
		dialogTglLahir.style.color = "#444444";
		dialogTglLahir.style.border = "3px solid #466179";
		dialogTglLahir.style.background = "white";
		dialogTglLahir.children[0].children[0].classList.add('dialog-kiosk-data-input');

		let dialogAlamat = document.getElementById("dialogAlamat");
		dialogAlamat.style.marginTop = "130px";
		dialogAlamat.style.display = "table";
		dialogAlamat.style.margin = "0 auto";
		dialogAlamat.style.height = "10px";
		dialogAlamat.style.width = "100%";
		dialogAlamat.style.color = "#444444";
		dialogAlamat.style.border = "3px solid #466179";
		dialogAlamat.style.background = "white";

		let styleDialogDataKtp = document.getElementById("dialogDataKtp");
		styleDialogDataKtp.children[0].classList.add('dialog-kiosk-data-ktp');

		for (let i = 0; i < styleDialogDataKtp.children[0].children.length; i++) {
			styleDialogDataKtp.children[0].children[i].classList.add('dialog-kiosk-data-ktp-content');
		}
		styleDialogDataKtp.children[0].children[0].classList.add('dialog-kiosk-data-ktp-header');
		setTimeout(() => {
			this.refactorDropdown('default');
		}, 1000);
	}
	ngOnInit() {
		this.dataIdentitasDialog = false;
		this.profile = this.authGuard.getUserDto();
		this.tglPelayanan = new Date();
		this.rangeTahunLahir = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear())
		this.rangeTahun = (new Date().getFullYear()) + ':' + (new Date().getFullYear() + 20)
		let today = new Date();
		today.setDate(today.getDate());
		let month = today.getMonth();
		let year = today.getFullYear();
		this.minDate = new Date();
		this.minDate.setDate(this.minDate.getDate());
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
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

	onChange = (input: string) => {
		// if (this.noIdentitasActive) {
		// 	this.ktp = input;
		// }
		// if (this.tglPelayananActive) {
		// 	this.tglPelayanan = input;
		// }
		console.log("Input changed", input);
	};

	onKeyPress = (button: string) => {
		console.log("Button pressed", button);

		if (this.noIdentitasActive && button !== "{shift}" && button !== "{lock}" && button !== "{enter}" && button !== "{tab}" && button !== "{space}" && button !== "{bksp}") {
			if (this.noIdentitas.length <= 24) {
				this.noIdentitas += button;
			}
		}

		if (this.alamatLengkapActive && button !== "{shift}" && button !== "{lock}" && button !== "{enter}" && button !== "{tab}" && button !== "{space}" && button !== "{bksp}") {
			this.alamatLengkap += button;
		}

		if (this.namaLengkapActive && button !== "{shift}" && button !== "{lock}" && button !== "{enter}" && button !== "{tab}" && button !== "{space}" && button !== "{bksp}") {
			this.namaLengkap += button;
		}

		if (this.tempatLahirActive && button !== "{shift}" && button !== "{lock}" && button !== "{enter}" && button !== "{tab}" && button !== "{space}" && button !== "{bksp}") {
			this.tempatLahir += button;
		}

		if (this.noRmActive && button !== "{shift}" && button !== "{lock}" && button !== "{enter}" && button !== "{tab}" && button !== "{space}" && button !== "{bksp}") {
			this.noRm += button;
			this.keyboardText += button;
		}

		if (this.noIdentitasActive && button == "{bksp}") {
			let hapus = this.noIdentitas.slice(0, -1);
			this.noIdentitas = hapus;
		}

		if (this.alamatLengkapActive && button == "{bksp}") {
			let hapus = this.alamatLengkap.slice(0, -1);
			this.alamatLengkap = hapus;
		}

		if (this.namaLengkapActive && button == "{bksp}") {
			let hapus = this.namaLengkap.slice(0, -1);
			this.namaLengkap = hapus;
		}

		if (this.tempatLahirActive && button == "{bksp}") {
			let hapus = this.tempatLahir.slice(0, -1);
			this.tempatLahir = hapus;
		}

		if (this.noRmActive && button == "{bksp}") {
			let hapus = this.noRm.slice(0, -1);
			this.noRm = hapus;
			this.keyboardText = hapus;
		}


		if (this.noIdentitasActive && button == "{space}") {
			let space = " ";
			if (this.noIdentitas.length <= 24) {

				this.noIdentitas += space;
			}
		}

		if (this.alamatLengkapActive && button == "{space}") {
			let space = " ";
			this.alamatLengkap += space;
		}

		if (this.namaLengkapActive && button == "{space}") {
			let space = " ";
			this.namaLengkap += space;
		}

		if (this.tempatLahirActive && button == "{space}") {
			let space = " ";
			this.tempatLahir += space;
		}

		if (this.noRmActive && button == "{space}") {
			let space = " ";
			this.noRm += space;
			this.keyboardText += space;
		}

		/**
		 * If you want to handle the shift and caps lock buttons
		 */
		if (button === "{shift}" || button === "{lock}") this.handleShift();
	};

	onInputChange = (event: any) => {
		this.keyboard.setInput(event.target.value);
	};

	handleShift = () => {
		let currentLayout = this.keyboard.options.layoutName;
		let shiftToggle = currentLayout === "default" ? "shift" : "default";

		this.keyboard.setOptions({
			layoutName: shiftToggle
		});
	};

	focusKomponen(from, labelKeyboard, placeHolderKeyboard) {
		this.noIdentitasActive = false;
		this.tglPelayananActive = false;
		this.alamatLengkapActive = false;
		this.namaLengkapActive = false;
		this.tglLahirActive = false;
		this.tempatLahirActive = false;
		this.noRmActive = false;

		this.placeHolderKeyboard = '';
		this.labelKeyboard = '';
		this.keyboardText = '';

		if (from == 'noIdentitas') {
			this.noIdentitasActive = true;
			this.keyboardOpen();
		}

		if (from == 'tglPelayanan') {
			this.tglPelayananActive = true;
			this.keyboardClose();
		}

		if (from == 'alamatLengkap') {
			this.alamatLengkapActive = true;
			this.keyboardOpen();
		}

		if (from == 'namaLengkap') {
			this.namaLengkapActive = true;
			this.keyboardOpen();

		}

		if (from == 'tglLahir') {
			this.tglLahirActive = true;
			this.keyboardClose();

		}

		if (from == 'tempatLahir') {
			this.tempatLahirActive = true;
			this.keyboardOpen();
		}

		if (from == 'noRm') {
			this.noRmActive = true;
			this.placeHolderKeyboard = placeHolderKeyboard;
			this.labelKeyboard = labelKeyboard;
			this.keyboardText = this.noRm;
			this.keyboardOpen();
		}
		// document.getElementById("tglPelayanan").removeAttribute("input");

		// var attr = document.createAttribute('input');
		// attr.value = 'onInputChange($event)';
		// document.getElementById("nomorKtp").setAttributeNode(attr);
	}

	focusOutKomponen(from) {
		if (from == 'noRm') {
			this.noRmActive = true;
			this.validateNoRM(this.noRm);
		}
		// this.noIdentitasActive = false;
	}

	focusTglPelayanan() {
		
		this.keyboardClose();
		// this.Calendar.overlayVisible = true;
		// this.Calendar.overlayVisible = true;
		//this.Calendar.showOverlay(this.Calendar.inputfieldViewChild.nativeElement);
		
		
		var refactorCalender = document.getElementsByClassName('ui-datepicker') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalender.length; i++) {
			refactorCalender[i].style.width = '52vw';
			refactorCalender[i].style.fontSize = '20px';
		}

		var refactorCalenderTable = document.getElementsByClassName('ui-datepicker-calendar') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalenderTable.length; i++) {
			refactorCalenderTable[i].style.fontSize = '15px';
		}

		var refactorCalenderFooter = document.getElementsByClassName('ui-timepicker') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalenderFooter.length; i++) {
			refactorCalenderFooter[i].style.fontSize = '12px';
		}

		

		//this.Calendar.showOverlay();
		
		this.noIdentitasActive = false;
		this.tglPelayananActive = false;
		this.alamatLengkapActive = false;
		this.namaLengkapActive = false;
		this.tglLahirActive = false;
		this.tempatLahirActive = false;
		if (this.noRmActive) {
			this.noRmActive = false;
			this.validateNoRM(this.noRm);
		}
		this.noRmActive = false;

	
	}

	focusOutTglPelayanan() {
		this.noIdentitasActive = false;
		this.tglPelayananActive = false;
		this.alamatLengkapActive = false;
		this.namaLengkapActive = false;
		this.tglLahirActive = false;
		this.tempatLahirActive = false;
		this.noRmActive = false;

		var refactorCalender = document.getElementsByClassName('ui-datepicker') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalender.length; i++) {
			refactorCalender[i].style.width = '';
			refactorCalender[i].style.fontSize = '';
		}

		var refactorCalenderTable = document.getElementsByClassName('ui-datepicker-calendar') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalenderTable.length; i++) {
			refactorCalenderTable[i].style.fontSize = '';
		}
	}

	keyboardOpen() {
		var navKeyboard = document.getElementsByClassName('nav-keyboard') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < navKeyboard.length; i++) {
			navKeyboard[i].style.bottom = '230px';
			navKeyboard[i].style.background = '#808080b3';
		}

		document.getElementById("keyboardOpenId").style.display = 'none';
		document.getElementById("keyboardCloseId").style.display = 'block';
		document.getElementById('labelKeyboard').style.display = "inline-block";
		document.getElementById('placeHolderKeyboard').style.display = "inline-block";
		var simpleKeyboard = document.getElementsByClassName('simple-keyboard') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < simpleKeyboard.length; i++) {
			simpleKeyboard[i].style.display = 'block';
		}
	}

	keyboardClose() {
		this.noIdentitasActive = false;
		this.tglPelayananActive = false;
		this.alamatLengkapActive = false;
		this.namaLengkapActive = false;
		this.tglLahirActive = false;
		this.tempatLahirActive = false;
		if (this.noRmActive) {
			this.noRmActive = false;
			this.validateNoRM(this.noRm);
		}
		this.noRmActive = false;

		document.getElementById("keyboardOpenId").style.display = 'block';
		document.getElementById("keyboardCloseId").style.display = 'none';
		document.getElementById('labelKeyboard').style.display = "none";
		document.getElementById('placeHolderKeyboard').style.display = "none";
		var navKeyboard = document.getElementsByClassName('nav-keyboard') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < navKeyboard.length; i++) {
			navKeyboard[i].style.bottom = '0px';
			navKeyboard[i].style.background = '';
		}

		var simpleKeyboard = document.getElementsByClassName('simple-keyboard') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < simpleKeyboard.length; i++) {
			simpleKeyboard[i].style.display = 'none';
		}
	}

	dataKtp() {
		this.dataIdentitasDialog = true;
		this.refactorDropdown('dataKTP');
		
	}

	cetakNoAntrianDataIdentitas() {
		let tglLahir = null;
		if (this.tglLahir) {
			tglLahir = this.setTimeStamp(this.tglLahir)
		}
		let tglPelayanan = null;
		if (this.tglPelayanan) {
			tglPelayanan = this.setTimeStamp(this.tglPelayanan)
		} else {
			this.alertService.warn('Peringatan', 'Tanggal Pelayanan Wajib Diisi !');
			return false;
		}

		let kdDesaKelurahan = null;
		let kdNegara = null;
		let kdKecamatan = null;
		let kdKotaKabupaten = null;
		let kdPropinsi = null;
		if (this.kdDesaKelurahan.kode) {
			kdDesaKelurahan = this.kdDesaKelurahan.kode;
		}
		if (this.kdNegara.kode) {
			kdNegara = this.kdNegara.kode;
		}
		if (this.kdKecamatan.kode) {
			kdKecamatan = this.kdKecamatan.kode;
		}
		if (this.kdKotaKabupaten.kode) {
			kdKotaKabupaten = this.kdKotaKabupaten.kode;
		}
		if (this.kdPropinsi.kode) {
			kdPropinsi = this.kdPropinsi.kode;
		}
		let dataCetak = {
			"alamatLengkap": this.alamatLengkap,
			"kdDokterOrder": null,
			"kdKelompokKlien": this.jenisAsalPasien.noKontak,
			"kdRuanganTujuan": null,
			"kdStatusPasien": this.jenisAsalPasien.statusPasien,
			"namaPasien": this.namaLengkap,
			"noCM": this.noRm,
			"noIdentitas": this.noIdentitas,
			"tempatLahir": this.tempatLahir,
			"tglLahir": tglLahir,
			"tglPelayananAwal": tglPelayanan,
			"kdJenisAlamat": this.kdJenisAlamat,
			"kdJenisKelamin": this.kdJenisKelamin,
			"kdNegara": kdNegara,
			"kdDesaKelurahan": kdDesaKelurahan,
			"kdKecamatan": kdKecamatan,
			"kdKotaKabupaten": kdKotaKabupaten,
			"kdPropinsi": kdPropinsi,
			"kodePos": this.kodePos,
			"rtrw": this.rtrw,
		}

		this.httpService.post(Configuration.get().klinik1Java + '/kiosKController/save?', dataCetak).subscribe(response => {
			this.alertService.success('Berhasil', 'Cetak Nomor Antrian');
			this.dataIdentitasDialog = false;
			this.cetak(response);
			
		});

		console.log(dataCetak);
	}

	cetakNoAntrian() {
		let tglPelayanan = null;
		if (this.tglPelayanan) {
			tglPelayanan = this.setTimeStamp(this.tglPelayanan)
		} else {
			this.alertService.warn('Peringatan', 'Tanggal Pelayanan Wajib Diisi !');
			return false;
		}
		let tglLahir = null;
		if (this.tglLahir) {
			tglLahir = this.setTimeStamp(this.tglLahir)
		}
		let kdDesaKelurahan = null;
		let kdNegara = null;
		let kdKecamatan = null;
		let kdKotaKabupaten = null;
		let kdPropinsi = null;
		if (this.kdDesaKelurahan.kode) {
			kdDesaKelurahan = this.kdDesaKelurahan.kode;
		}
		if (this.kdNegara.kode) {
			kdNegara = this.kdNegara.kode;
		}
		if (this.kdKecamatan.kode) {
			kdKecamatan = this.kdKecamatan.kode;
		}
		if (this.kdKotaKabupaten.kode) {
			kdKotaKabupaten = this.kdKotaKabupaten.kode;
		}
		if (this.kdPropinsi.kode) {
			kdPropinsi = this.kdPropinsi.kode;
		}
		let dataCetak = {
			"alamatLengkap": this.alamatLengkap,
			"kdDokterOrder": null,
			"kdKelompokKlien": this.jenisAsalPasien.noKontak,
			"kdRuanganTujuan": null,
			"kdStatusPasien": this.jenisAsalPasien.statusPasien,
			"namaPasien": this.namaLengkap,
			"noCM": this.noRm,
			"noIdentitas": this.noIdentitas,
			"tempatLahir": this.tempatLahir,
			"tglLahir": tglLahir,
			"tglPelayananAwal": tglPelayanan,
			"kdJenisAlamat": this.kdJenisAlamat,
			"kdJenisKelamin": this.kdJenisKelamin,
			"kdNegara": kdNegara,
			"kdDesaKelurahan": kdDesaKelurahan,
			"kdKecamatan": kdKecamatan,
			"kdKotaKabupaten": kdKotaKabupaten,
			"kdPropinsi": kdPropinsi,
			"kodePos": this.kodePos,
			"rtrw": this.rtrw,
		}

		this.httpService.post(Configuration.get().klinik1Java + '/kiosKController/save?', dataCetak).subscribe(response => {
			this.alertService.success('Berhasil', 'Cetak Nomor Antrian');
			this.cetak(response);
			this.dataIdentitasDialog = false;
			//sementara di sini bukan di dalam this.cetak
			this.router.navigate(["kiosk/"]);
		});

		console.log(dataCetak);
	}

	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}

	}

	getService() {
		this.getNegara('');
		this.getPropinsi('');
		this.getKotaKabupaten('');
		this.getKecamatan('');
		this.getDesaKelurahan('');

		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/settingDataFixedShoutcartCetakAntrianKiosK').subscribe(table => {
			this.hotKey = table.data;
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisAlamat&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
			this.listJenisAlamat = [];
			this.listJenisAlamat.push({
				label: '--Pilih--', value: null
			});
			for (var i = 0; i < table.data.data.length; i++) {
				this.listJenisAlamat.push({
					label: table.data.data[i].namaJenisAlamat, value: table.data.data[i].id.kode
				})
			};
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?page=1&rows=100&dir=namaNegara&sort=asc').subscribe(table => {
			this.listNegara = [];
			this.listNegara.push({ label: '--Pilih--', value: null });
			for (var i = 0; i < table.Negara.length; i++) {
				this.listNegara.push({ label: table.Negara[i].namaNegara, value: table.Negara[i].kode })
			};
		});

		this.counterPasienByDay(new Date());
	}

	selanjutnya(data) {
		let tglLahir = null;
		if (this.tglLahir) {
			tglLahir = this.setTimeStamp(this.tglLahir)
		}
		let tglPelayanan = null;
		if (this.tglPelayanan) {
			tglPelayanan = this.setTimeStamp(this.tglPelayanan)
		}
		let kdDesaKelurahan = null;
		let kdNegara = null;
		let kdKecamatan = null;
		let kdKotaKabupaten = null;
		let kdPropinsi = null;
		if (this.kdDesaKelurahan.kode) {
			kdDesaKelurahan = this.kdDesaKelurahan.kode;
		}
		if (this.kdNegara.kode) {
			kdNegara = this.kdNegara.kode;
		}
		if (this.kdKecamatan.kode) {
			kdKecamatan = this.kdKecamatan.kode;
		}
		if (this.kdKotaKabupaten.kode) {
			kdKotaKabupaten = this.kdKotaKabupaten.kode;
		}
		if (this.kdPropinsi.kode) {
			kdPropinsi = this.kdPropinsi.kode;
		}
		let navigationExtras: NavigationExtras = {
			queryParams: {
				"kdRuanganTujuan": null,
				"nama": this.jenisAsalPasien.nama,
				"noKontak": this.jenisAsalPasien.noKontak,
				"statusPasien": this.jenisAsalPasien.statusPasien,
				"alamatLengkap": this.alamatLengkap,
				"kdDokterOrder": null,
				"namaPasien": this.namaLengkap,
				"noCM": this.noRm,
				"noIdentitas": this.noIdentitas,
				"tempatLahir": this.tempatLahir,
				"tglLahir": tglLahir,
				"tglPelayanan": tglPelayanan,
				"kdJenisAlamat": this.kdJenisAlamat,
				"kdJenisKelamin": this.kdJenisKelamin,
				"kdNegara": kdNegara,
				"kdDesaKelurahan": kdDesaKelurahan,
				"kdKecamatan": kdKecamatan,
				"kdKotaKabupaten": kdKotaKabupaten,
				"kdPropinsi": kdPropinsi,
				"kodePos": this.kodePos,
				"rtrw": this.rtrw,
				"tglPelayananDate": this.tglPelayanan
			}
		};
		this.router.navigate(["kiosk/antrian/poli-rawat-jalan"], navigationExtras);
	}

	kembali() {
		let navigationExtras: NavigationExtras = {
			queryParams: {
				"nama": this.jenisAsalPasien.nama,
				"noKontak": this.jenisAsalPasien.noKontak,
			}
		};
		this.router.navigate(["kiosk/antrian/jenis-pasien"], navigationExtras);
	}


	cetak(antrian) {
		let namaKomputerSesion = sessionStorage.getItem('namaKomputer');

		this.httpService.get(Configuration.get().klinik1Java + '/printerAction/getPrinterName?host=' + namaKomputerSesion + '&shoutcart=' + encodeURIComponent(this.hotKey)).subscribe(table => {
			console.log(table)
			if (table) {
				let dataPrint = {
					"kdKomputer": table.host,
					"printerAction": table.printerAction,
					"kdProfile": table.kdProfile,
					"namaPrinter": table.namaPrinter
				}
				if (dataPrint.printerAction == this.shortcutCetakAntrian) {
					let data = {
						"download": false,
						"kdDepartemen": this.profile.kdDepartemen,
						"kdProfile": this.profile.idProfile,
						"outDepartemen": true,
						"outProfile": true,
						"namaFile": "Test",
						"extFile": ".pdf",
						"paramImgKey": [
						],
						"paramImgValue": [
						],
						"paramKey": [
							"kdAntrian", "kdProfile", "tglSekarang"
						],
						"paramValue": [
							antrian.kdAntrian, this.profile.idProfile, parseInt(this.setTimeStamp(new Date()))
						]
					}


					this.httpService.genericReport(Configuration.get().report + '/generic/report/cetak-antrian-registrasi-masuk.pdf', data).subscribe(response => {

						this.printer.printData(response, dataPrint.namaPrinter);
						this.router.navigate(["kiosk/"]);
					});
					// this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-antrian-registrasi-masuk.pdf', 'Cetak Antrian', data);
				}
			}
		});
	}

	counterPasienByDay(day) {
		let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/counterPasienByDay?tanggal=' + this.setTimeStamp(day)).subscribe(table => {
			this.listCounterPasien = [];
			this.listCounterPasien = table;

			for (let i = 0; i < table.length; i++) {
				let time = new Date(table[i].tanggal * 1000);
				let hari = dayNames[time.getDay()];
				let bulan = monthNames[time.getMonth()];
				let tanggal = hari + ", " + time.getDate() + " " + bulan;
				this.listCounterPasien[i] = {
					"counter": table[i].counter,
					"long": table[i].tanggal,
					"hari": tanggal
				}
			}


		});
	}

	findCounter(event) {
		this.counterPasienByDay(event);
	}

	validateNoRM(noRM) {
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/validatePasienByNoCM?noCM=' + noRM).subscribe(table => {
			if (table.result == false && this.noRmActive == false) {
				this.alertService.warn('Peringantan', 'Nomor RM Tidak Ditemukan');
				this.buttonAktif = true;
			} else if (table.result == true) {
				this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findByNoCM?noCM=' + noRM).subscribe(table => {
					this.alertService.success('Berhasil', 'Nomor RM  Ditemukan Atas Nama ' + table.namaLengkap);
					this.buttonAktif = false;

					this.alamatLengkap = table.alamatLengkap;
					this.namaLengkap = table.namaLengkap;
					this.tglLahir = new Date(table.tglLahir * 1000);
					this.noIdentitas = table.noIdentitas;
					this.kdJenisKelamin = table.kdJenisKelamin;
					this.tempatLahir = table.namaLengkap;
					this.kdJenisAlamat = table.kdJenisAlamat;
					// this.kdNegara = table.kdNegara;

					let dataAlamat = {
						value: {
							kdKecamatan: table.kdKecamatan,
							kdKotaKabupaten: table.kdKotaKabupaten,
							kdNegara: table.kdNegara,
							kdPropinsi: table.kdPropinsi,
							kode: table.kdDesaKelurahan,
							kodePos: table.kodePos
						}
					}
					if (dataAlamat.value.kdNegara != null) {
						this.changeNegara(dataAlamat, 'propinsi');
						if (dataAlamat.value.kdPropinsi != null) {
							this.changePropinsi(dataAlamat, 'kotaKabupaten');
						}
						if (dataAlamat.value.kdKecamatan != null) {
							this.changeKecamatan(dataAlamat, 'desa');
						}
						if (dataAlamat.value.kdKotaKabupaten != null) {
							this.changeKotaKabupaten(dataAlamat, 'kecamatan');
							this.changeDesaKelurahan({
								value: {
									kdKotaKabupaten: table.kdKotaKabupaten,
									kdNegara: table.kdNegara,
									kdPropinsi: table.kdPropinsi,
									kode: table.kdKecamatan
								}
							}, 'grid');
							this.kdDesaKelurahan = {
								"kdNegara": table.kdNegara,
								"kdPropinsi": table.kdPropinsi,
								"kdKotaKabupaten": table.kdKotaKabupaten,
								"kdKecamatan": table.kdKecamatan,
								"kode": table.kdDesaKelurahan,
								"kodePos": table.kodePos
							};
						}
					}
					this.rtrw = table.rTRW;
					this.kodePos = table.kodePos;
				});
			}
		});
	}

	refactorDropdown(event) {
		var refactorLayoutDropdown = document.getElementsByClassName(
			"ui-dropdown-label ui-inputtext ui-corner-all"
		) as HTMLCollectionOf<HTMLElement>;
		if (event == 'default') {
			refactorLayoutDropdown[refactorLayoutDropdown.length - 1].setAttribute('Style', 'border:0px !important; font-size:5vh;height:10vh;margin-top:1vh');
		} else {
			for (let i = 0; i < refactorLayoutDropdown.length; i++) {
				refactorLayoutDropdown[i].setAttribute('Style', 'border:0px !important; font-size:18px;height:4.9vh');
			}

		}

	}

	//alamatService

	getNegara(namaNegara) {
		let search = '';
		if (namaNegara !== '') {
			search = '&namaNegara=' + namaNegara;
		}
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?page=1&rows=100&dir=namaNegara&sort=asc' + search).subscribe(table => {
			this.listNegara = [];
			this.listNegara.push({ label: '--Pilih Negara--', value: { kode: null, wn: null } });
			for (var i = 0; i < table.Negara.length; i++) {
				this.listNegara.push({ label: table.Negara[i].namaNegara, value: { kode: table.Negara[i].kode, wn: table.Negara[i].namaExternal } })
			};
		});
	}

	getPropinsi(namaPropinsi) {
		let search = ''
		if (namaPropinsi !== '') {
			search = '&namaPropinsi=' + namaPropinsi
		}
		this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?page=1&rows=100&dir=namaPropinsi&sort=asc' + search).subscribe(table => {
			this.listPropinsi = [];
			this.listPropinsi.push({
				label: '--Pilih Propinsi--', value: {
					"kdNegara": null,
					"kode": null
				}
			});
			for (var i = 0; i < table.Propinsi.length; i++) {
				this.listPropinsi.push({
					label: table.Propinsi[i].namaPropinsi, value: {
						"kdNegara": table.Propinsi[i].kode.kdNegara,
						"kode": table.Propinsi[i].kode.kode
					}
				})
			};
		});
	}

	getKotaKabupaten(namaKotaKabupaten) {
		let search = ''
		if (namaKotaKabupaten != '') {
			search = '&namaKotaKabupaten=' + namaKotaKabupaten
		}
		this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?page=1&rows=100&dir=namaKotaKabupaten&sort=asc' + search).subscribe(table => {
			this.listKotaKabupaten = [];
			this.listKotaKabupaten.push({
				label: '--Pilih Kota Kabupaten--', value: {
					"kdNegara": null,
					"kdPropinsi": null,
					"kode": null
				}
			});
			for (var i = 0; i < table.KotaKabupaten.length; i++) {
				this.listKotaKabupaten.push({
					label: table.KotaKabupaten[i].namaKotaKabupaten, value: {
						"kdNegara": table.KotaKabupaten[i].kode.kdNegara,
						"kdPropinsi": table.KotaKabupaten[i].kdPropinsi,
						"kode": table.KotaKabupaten[i].kode.kode
					}
				})
			};
		});
	}

	getKecamatan(namaKecamatan) {
		let search = ''
		if (namaKecamatan != '') {
			search = '&namaKecamatan=' + namaKecamatan
		}
		this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?page=1&rows=100&dir=namaKecamatan&sort=asc' + search).subscribe(table => {
			this.listKecamatan = [];
			this.listKecamatan.push({
				label: '--Pilih Kecamatan--', value: {
					"kdNegara": null,
					"kdPropinsi": null,
					"kdKotaKabupaten": null,
					"kode": null
				}
			});
			for (var i = 0; i < table.Kecamatan.length; i++) {
				this.listKecamatan.push({
					label: table.Kecamatan[i].namaKecamatan, value: {
						"kdNegara": table.Kecamatan[i].kode.kdNegara,
						"kdPropinsi": table.Kecamatan[i].kdPropinsi,
						"kdKotaKabupaten": table.Kecamatan[i].kdKotaKabupaten,
						"kode": table.Kecamatan[i].kode.kode
					}
				})
			};
		});
	}

	getDesaKelurahan(namaDesaKelurahan) {
		let search = ''
		if (namaDesaKelurahan != '') {
			search = '&namaDesaKelurahan=' + namaDesaKelurahan
		}
		this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=1&rows=100&dir=namaDesaKelurahan&sort=asc' + search).subscribe(table => {
			this.listDesaKelurahan = [];
			this.listDesaKelurahan.push({
				label: '--Pilih Kelurahan--', value: {
					"kdNegara": null,
					"kdPropinsi": null,
					"kdKotaKabupaten": null,
					"kdKecamatan": null,
					"kode": null,
					"kodePos": null
				}
			});
			for (var i = 0; i < table.DesaKelurahan.length; i++) {
				this.listDesaKelurahan.push({
					label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
						"kdNegara": table.DesaKelurahan[i].kode.kdNegara,
						"kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
						"kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
						"kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
						"kode": table.DesaKelurahan[i].kode.kode,
						"kodePos": table.DesaKelurahan[i].kodePos,
					}
				})
			};
		});
	}

	onKeyUpFilterNegara(event) {
		this.getNegara(event.target.value.kode);
	}

	onKeyUpFilterPropinsi(event) {
		this.getPropinsi(event.target.value);
	}

	onKeyUpFilterKotaKabupaten(event) {
		this.getKotaKabupaten(event.target.value);
	}

	onKeyUpFilterKecamatan(event) {
		this.getKecamatan(event.target.value);
	}

	onKeyUpFilterDesaKelurahan(event) {
		this.getDesaKelurahan(event.target.value);
	}


	changeNegara(event, from) {
		if (from == 'propinsi') {
			this.httpService.get(Configuration.get().dataMasterNew + '/negara/findByKode/' + event.value.kdNegara).subscribe(table => {
				this.listNegara = [];
				this.listNegara.push({
					label: table.Negara.namaNegara, value: { kode: table.Negara.kode, wn: table.Negara.namaExternal }
				});
				this.kdNegara = { kode: table.Negara.kode, wn: table.Negara.namaExternal };
			});
		} else if (from == 'negara') {
			this.changePropinsi(event, 'negara');
		}
	}

	changePropinsi(event, from) {
		if (from == 'kotaKabupaten') {
			this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findByKode/' + event.value.kdPropinsi + '/' + event.value.kdNegara).subscribe(table => {
				this.listPropinsi = [];
				this.listPropinsi.push({
					label: table.Propinsi.namaPropinsi, value: {
						"kdNegara": table.Propinsi.kode.kdNegara,
						"kode": table.Propinsi.kode.kode
					}
				});
				this.kdPropinsi = {
					"kdNegara": table.Propinsi.kode.kdNegara,
					"kode": table.Propinsi.kode.kode
				};
			});
		} else if (from == 'propinsi') {
			this.getDesaKelurahan('');
			this.getKecamatan('');
			this.changeKotaKabupaten(event, 'propinsi');
			this.changeNegara(event, 'propinsi');
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + event.value.kode).subscribe(table => {
				this.listPropinsi = [];
				this.listPropinsi.push({
					label: '--Pilih Propinsi--', value: {
						"kdNegara": null,
						"kode": null
					}
				});
				for (var i = 0; i < table.Propinsi.length; i++) {
					this.listPropinsi.push({
						label: table.Propinsi[i].namaPropinsi, value: {
							"kdNegara": table.Propinsi[i].kode.kdNegara,
							"kode": table.Propinsi[i].kode.kode
						}
					})
				};
				this.kdPropinsi = {
					"kdNegara": null,
					"kode": null
				};
			});
		}
	}

	changeKotaKabupaten(event, from) {
		if (from == 'kecamatan') {
			this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findByKode/' + event.value.kdKotaKabupaten + '/' + event.value.kdNegara).subscribe(table => {
				this.listKotaKabupaten = [];
				this.listKotaKabupaten.push({
					label: table.KotaKabupaten.namaKotaKabupaten, value: {
						"kdNegara": table.KotaKabupaten.kode.kdNegara,
						"kdPropinsi": table.KotaKabupaten.kdPropinsi,
						"kode": table.KotaKabupaten.kode.kode
					}
				});
				this.kdKotaKabupaten = {
					"kdNegara": table.KotaKabupaten.kode.kdNegara,
					"kdPropinsi": table.KotaKabupaten.kdPropinsi,
					"kode": table.KotaKabupaten.kode.kode
				};
			});
		} else if (from == 'kotaKabupaten') {
			this.getDesaKelurahan('');
			this.changeKecamatan(event, 'kotaKabupaten');
			this.changePropinsi(event, 'kotaKabupaten');
			this.changeNegara(event, 'propinsi');
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
				this.listKotaKabupaten = [];
				this.listKotaKabupaten.push({
					label: '--Pilih Kota Kabupaten--', value: {
						"kdNegara": null,
						"kdPropinsi": null,
						"kode": null
					}
				});
				for (var i = 0; i < table.KotaKabupaten.length; i++) {
					this.listKotaKabupaten.push({
						label: table.KotaKabupaten[i].namaKotaKabupaten, value: {
							"kdNegara": table.KotaKabupaten[i].kode.kdNegara,
							"kdPropinsi": table.KotaKabupaten[i].kdPropinsi,
							"kode": table.KotaKabupaten[i].kode.kode
						}
					})
				};
				this.kdKotaKabupaten = {
					"kdNegara": null,
					"kdPropinsi": null,
					"kode": null
				};
			});
		}
	}

	changeKecamatan(event, from) {
		if (from == 'desa') {
			this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findByKode/' + event.value.kdKecamatan + '/' + event.value.kdNegara).subscribe(table => {
				this.listKecamatan = [];
				this.listKecamatan.push({
					label: table.Kecamatan.namaKecamatan, value: {
						"kdNegara": table.Kecamatan.kode.kdNegara,
						"kdPropinsi": table.Kecamatan.kdPropinsi,
						"kdKotaKabupaten": table.Kecamatan.kdKotaKabupaten,
						"kode": table.Kecamatan.kode.kode
					}
				});
				this.kdKecamatan = {
					"kdNegara": table.Kecamatan.kode.kdNegara,
					"kdPropinsi": table.Kecamatan.kdPropinsi,
					"kdKotaKabupaten": table.Kecamatan.kdKotaKabupaten,
					"kode": table.Kecamatan.kode.kode
				};
			});
		} else if (from == 'kecamatan') {
			this.changeDesaKelurahan(event, 'kecamatan');
			this.changeKotaKabupaten(event, 'kecamatan');
			this.changePropinsi(event, 'kotaKabupaten');
			this.changeNegara(event, 'propinsi');
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
				this.listKecamatan = [];
				this.listKecamatan.push({
					label: '--Pilih Kecamatan--', value: {
						"kdNegara": null,
						"kdPropinsi": null,
						"kdKotaKabupaten": null,
						"kode": null
					}
				});
				for (var i = 0; i < table.Kecamatan.length; i++) {
					this.listKecamatan.push({
						label: table.Kecamatan[i].namaKecamatan, value: {
							"kdNegara": table.Kecamatan[i].kode.kdNegara,
							"kdPropinsi": table.Kecamatan[i].kdPropinsi,
							"kdKotaKabupaten": table.Kecamatan[i].kdKotaKabupaten,
							"kode": table.Kecamatan[i].kode.kode
						}
					})
				};
				this.kdKecamatan = {
					"kdNegara": null,
					"kdPropinsi": null,
					"kdKotaKabupaten": null,
					"kode": null
				};
			});
		}
	}

	changeDesaKelurahan(event, from) {
		if (from == 'desa') {
			this.changeKecamatan(event, 'desa');
			this.changeKotaKabupaten(event, 'kecamatan');
			this.changePropinsi(event, 'kotaKabupaten');
			this.changeNegara(event, 'propinsi');
			this.kodePos = event.value.kodePos;
		} else if (from == 'grid') {
			this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
				this.listDesaKelurahan = [];
				this.listDesaKelurahan.push({
					label: '--Pilih Kelurahan--', value: {
						"kdNegara": null,
						"kdPropinsi": null,
						"kdKotaKabupaten": null,
						"kdKecamatan": null,
						"kode": null,
						"kodePos": null
					}
				});
				for (var i = 0; i < table.DesaKelurahan.length; i++) {
					this.listDesaKelurahan.push({
						label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
							"kdNegara": table.DesaKelurahan[i].kode.kdNegara,
							"kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
							"kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
							"kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
							"kode": table.DesaKelurahan[i].kode.kode,
							"kodePos": table.DesaKelurahan[i].kodePos
						}
					})
				};

			});
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
				this.listDesaKelurahan = [];
				this.listDesaKelurahan.push({
					label: '--Pilih Kelurahan--', value: {
						"kdNegara": null,
						"kdPropinsi": null,
						"kdKotaKabupaten": null,
						"kdKecamatan": null,
						"kode": null,
						"kodePos": null
					}
				});
				for (var i = 0; i < table.DesaKelurahan.length; i++) {
					this.listDesaKelurahan.push({
						label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
							"kdNegara": table.DesaKelurahan[i].kode.kdNegara,
							"kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
							"kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
							"kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
							"kode": table.DesaKelurahan[i].kode.kode,
							"kodePos": table.DesaKelurahan[i].kodePos
						}
					})
				};
				this.kdDesaKelurahan = {
					"kdNegara": null,
					"kdPropinsi": null,
					"kdKotaKabupaten": null,
					"kdKecamatan": null,
					"kode": null,
					"kodePos": null
				};
			});
		}
	}
}