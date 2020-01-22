import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';

import { ConfirmationService } from "primeng/primeng";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

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
//import moment = require('moment');
import * as moment from 'moment';
@Injectable()
@Component({
	selector: "app-poli-rawat-jalan",
	templateUrl: "./poli-rawat-jalan.component.html",
	styleUrls: ["../kiosk-global.scss", "./poli-rawat-jalan.component.scss"],
	providers: [ConfirmationService]
})
export class PoliRawatJalanComponent implements  AfterViewInit, OnInit, OnDestroy {
	jenisAsalPasien: any;
	listData: any[];
	buttonAktif: boolean = true;
	ruanganPilih: any = null;
	profile: any;
	shortcutCetakAntrian = 'cetakAntrianKiosK';
	hotKey: any = null;
	pilihDialog: boolean;
	jamKalender:any;
	listJam:any;
	jamPilihAwal:any;
	jamPilihAkhir:any;
	i:any;
	dat:any;
	indexKlik:any;
	rangeTahun: any;
	minDate: any;
	kdRuanganPilihK:any;
	listDataJamPop:any[];
	dataJamPop:any;
	dariPopUp:any;
	tglPilih:any;
	indexPilih:any;
	tglPelayananPilih:any;
	noAntrian:any;
	antrianByRuangan:any;
	buttonCetakAktif:boolean;
	selectedJam:any;
	listJamDrop:any;
	habisJadwal:boolean;
	tglKunjungan:any;
	kdStatusSetting:any;
	kdStatusPasienBaru:any;
	constructor(
		private confirmationService: ConfirmationService,
		private httpService: HttpClient,
		private notificationService: NotificationService,
		private auth: Authentication,
		private info: InfoService,
		private routes: ActivatedRoute,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		private router: Router,
		@Inject(forwardRef(() => ReportService)) private print: ReportService,
		private printer: PrinterService,
	) {
		this.routes.queryParams.subscribe(params => {
			this.jenisAsalPasien = params;
		});

	}

	ngAfterViewInit(){

		// var arrayTglPoli = Array.from(document.getElementsByClassName(
		// 	"ui-inputtext ui-widget ui-state-default ui-corner-all"
		// ))
		// arrayTglPoli.map(element => element.classList.add("calender-tglPelayananPilih"))

		// let styleTglPelayananPilih = document.getElementById("tglPelayananPilih");
		// styleTglPelayananPilih.children[0].children[0].classList.add('calender-tglPelayananPilih');
	}

	ngOnInit() {
		this.tglKunjungan = this.jenisAsalPasien.tglPelayanan;
		this.habisJadwal = false;
		//this.tglPelayananPilih = new Date();
		this.rangeTahun = (new Date().getFullYear()) + ':' + (new Date().getFullYear() + 20);
		let today = new Date();
		today.setDate(today.getDate());
		let month = today.getMonth();
		let year = today.getFullYear();
		this.minDate = new Date();
		this.minDate.setDate(this.minDate.getDate());
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
		this.jamPilihAwal = '';
		this.jamPilihAkhir = '';
		this.pilihDialog = false;
		this.buttonAktif = true;
		this.profile = this.authGuard.getUserDto();
		let hostUrl = window.location.hash.replace("/", ",").split(",");
		let kiosk = hostUrl[1].split("/");
		this.hideMenu();
		this.getService();
		this.buttonCetakAktif = true;

	}

	focusTglPelayanan() {
		
		var refactorCalender = document.getElementsByClassName('ui-datepicker') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalender.length; i++) {
			refactorCalender[i].style.width = '49vw';
			refactorCalender[i].style.fontSize = '20px';
		}

		var refactorCalenderTable = document.getElementsByClassName('ui-datepicker-calendar') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < refactorCalenderTable.length; i++) {
			refactorCalenderTable[i].style.fontSize = '15px';
		}

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

		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/settingDataFixedShoutcartCetakAntrianKiosK').subscribe(table => {
			this.hotKey = table.data;
		});

		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/getKdStatusPasienBaru').subscribe(table => {
			this.kdStatusSetting = table.kdStatus;
		});

		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findRuanganRawatJalan?tanggal='+this.jenisAsalPasien.tglPelayanan).subscribe(table => {
			this.listData = [];
			this.listJamDrop = [];
			this.listData = table;
			console.log(this.jenisAsalPasien.tglPelayananDate);
			let tglPelFix = new Date(this.jenisAsalPasien.tglPelayananDate);
			let data = [];
			for (let i = 0; i < table.length; i++) {
				let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
				let dataJam = [];
						if (table[i].gambarIcon !== null) {
							path = Configuration.get().resourceFile + '/image/show/' + table[i].gambarIcon;
						}
				//ini buat ambil data tiap dropdownnya
				// setTimeout(()=>{
					// this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdRuangan='+table[i].kdRuangan+'&tglRegistrasi='+this.jenisAsalPasien.tglPelayanan).subscribe(res => {
					
					
						
					// 	if (table[i].gambarIcon !== null) {
					// 		path = Configuration.get().resourceFile + '/image/show/' + table[i].gambarIcon;
					// 	}
						
						
					// 	let dataJamM = [];
						for (var z = 0; z < table[i].jadwal.listJadwal.length; z++) {
							let jamLong = table[i].jadwal.listJadwal[z].jamAwal;
							let jamA = jamLong * 1000;
							let jamFinal = moment(jamA).format('HH:mm');
								dataJam.push(
									{
										label: jamFinal,
										value: {
											jmAwal:table[i].jadwal.listJadwal[z].jamAwal,
											jmAkhir:table[i].jadwal.listJadwal[z].jamAkhir,
											noAntrian:table[i].jadwal.listJadwal[z].noAntrian
										}
									}
								);
						}
					// 	this.listJamDrop = dataJam;
						//this.jamKalender = dataJam[0];
					// });
				// },1000);

				data[i] = {
					"gambarIcon": path,
					"namaRuangan": table[i].namaRuangan,
					"kdRuangan": table[i].kdRuangan,
					"counter": table[i].jadwal.counter,
					"qtyPasienMax": table[i].jadwal.qtyPasienMax,
					"jamBuka": table[i].jamBuka,
					"jamTutup": table[i].jamTutup,
					"isAntrianByRuangan": table[i].isAntrianByRuangan,
					"arrayJam":dataJam,
					"tglSekarang": tglPelFix
				}

				//this.tglPelayananPilih[i] = new Date();
				

			}
			this.listData = data;
			for(let z=0; this.listData.length; z++){
				if(this.listData[z].arrayJam.length == 0){
					this.alertService.warn('Perhatian','Jadwal Tidak Tersedia');
				}
				break;
			}
			console.log(this.listData);
			//onsole.log(this.jamKalender)
		});
		// var refactorDropdown = document.getElementsByClassName("ui-dropdown ui-dropdown-label") as HTMLCollectionOf<HTMLElement>;
		// for (let i = 0; i < refactorDropdown.length; i++) {
		// 	refactorDropdown[i].style.color = "#f5f7fa";
		// }

		//fungsi pilihTanggal panggil aja untuk set default peratama kali tglnya dari app-calender
		//set selectedJam ngModel 

		//ambil status pasien baru
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/getKdStatusPasienBaru').subscribe(table => {
			this.kdStatusPasienBaru = table.kdStatus;
		});
	
	}

	cetakNoAntrian() {
		let tglLahir = null;
		if (this.jenisAsalPasien.tglLahir) {
			tglLahir = this.jenisAsalPasien.tglLahir
		}
		let tglPelayanan = null;
		if (this.jenisAsalPasien.tglPelayanan) {
			tglPelayanan = this.jenisAsalPasien.tglPelayanan
		}

		//cek dulu dia statusPasien dari yng baru bukan
		//jika user ga pilih dropdown
		if(this.jamPilihAwal == '' && this.jamPilihAkhir == '' && this.jenisAsalPasien.statusPasien != this.kdStatusSetting){
			//pake yang dari data default
			this.jamPilihAwal = this.listData[this.indexKlik].arrayJam[0].value.jmAwal;
			this.jamPilihAkhir = this.listData[this.indexKlik].arrayJam[0].value.jmAkhir;
			this.noAntrian = this.listData[this.indexKlik].arrayJam[0].value.noAntrian;
		}else if(this.jamPilihAwal == '' && this.jamPilihAkhir == '' && this.jenisAsalPasien.statusPasien == this.kdStatusSetting){
			this.jamPilihAwal = this.jenisAsalPasien.jamPilihAwal;
			this.jamPilihAkhir = this.jenisAsalPasien.jamPilihAkhir;
			this.noAntrian = this.jenisAsalPasien.noAntrian;
		}


		let tglPel;
		if(this.tglPilih != undefined ){
			tglPel = parseInt(this.tglPilih);
		}else if(this.tglPilih == undefined){
			tglPel = parseInt(this.jenisAsalPasien.tglPelayanan);
		}

		let dataCetak = {
			"alamatLengkap": this.jenisAsalPasien.alamatLengkap,
			"kdDokterOrder": null,
			"kdKelompokKlien": parseInt(this.jenisAsalPasien.noKontak),
			"kdRuanganTujuan": this.ruanganPilih,
			"kdStatusPasien": parseInt(this.jenisAsalPasien.statusPasien),
			"namaPasien": this.jenisAsalPasien.namaPasien,
			"noCM": this.jenisAsalPasien.noCM,
			"noIdentitas": this.jenisAsalPasien.noIdentitas,
			"tempatLahir": this.jenisAsalPasien.tempatLahir,
			"tglLahir": this.jenisAsalPasien.tglLahir,
			"tglPelayananAwal": tglPel,
			"kdJenisAlamat": parseInt(this.jenisAsalPasien.kdJenisAlamat),
			"kdJenisKelamin": parseInt(this.jenisAsalPasien.kdJenisKelamin),
			"kdNegara": parseInt(this.jenisAsalPasien.kdNegara),
			"kdDesaKelurahan": parseInt(this.jenisAsalPasien.kdDesaKelurahan),
			"kdKecamatan": parseInt(this.jenisAsalPasien.kdKecamatan),
			"kdKotaKabupaten": parseInt(this.jenisAsalPasien.kdKotaKabupaten),
			"kdPropinsi": parseInt(this.jenisAsalPasien.kdPropinsi),
			"kodePos": this.jenisAsalPasien.kodePos,
			"rtrw": this.jenisAsalPasien.rtrw,
			"tglPerkiraanPelayananAkhir": parseInt(this.jamPilihAkhir),
			"tglPerkiraanPelayananAwal": parseInt(this.jamPilihAwal),
			"noAntrian":  parseInt(this.noAntrian)
		}
		let namaKomputerSesion = sessionStorage.getItem('namaKomputer');
		if(namaKomputerSesion == undefined || namaKomputerSesion == null){
			this.alertService.warn('Perhatian','Harap Cek Settingan Untuk Cetak Terlebih Dahulu');
			this.router.navigate(["kiosk/"]);
		}else{
			this.httpService.post(Configuration.get().klinik1Java + '/kiosKController/save?', dataCetak).subscribe(response => {
				this.alertService.success('Berhasil', 'Cetak Nomor Antrian');
				this.cetak(response);
				//sementara ke sini karena hostnamenya ga ada jadi ga ke this.cetak dulu
				//this.router.navigate(["kiosk/"]);
			});
		}

		console.log(dataCetak);
	}

	clickRuangan(data, index) {
		this.indexKlik = index;
		this.buttonAktif = false;
		this.ruanganPilih = data.kdRuangan;
		this.antrianByRuangan = data.isAntrianByRuangan;


		//this.tglPilih = this.tglPelayananPilih;
		for (let i = 0; i < this.listData.length; i++) {
			if (index == i) {
				document.getElementById('ruangan-' + i).style.background = 'rgba(0, 0, 0, 0.2)';
			} else {
				document.getElementById('ruangan-' + i).style.background = '';
			}
		}
		console.log(data)
		let lanjut;

		if(this.kdStatusSetting != this.jenisAsalPasien.statusPasien){
			//true milih di ruangan jamnya
			if(data.isAntrianByRuangan == true ){
				this.buttonCetakAktif = false;
				if(data.arrayJam.length != 0){
					this.buttonAktif = false;
				}else{
					this.buttonAktif = true;
				}
			//pilih didokter jamnya
			}else{
				this.buttonCetakAktif = true;
				if(data.arrayJam.length == 0){
					this.buttonAktif = true;
				}else{
					this.buttonAktif = false;
				}
			}
		}else{
			this.buttonCetakAktif = false;
		}
		

		// if(data.arrayJam.length == 0){
		// 	this.buttonCetakAktif = true;
		// 	this.buttonAktif = true;
		// 	this.alertService.warn('Perhatian','Jadwal Tidak Tersedia');
		// }else{
		// 	this.buttonCetakAktif = false;
		// 	this.buttonAktif = false;
		// }


		// if(data.counter == data.qtyPasienMax){
			//this.getListJam(data.kdRuangan,this.jenisAsalPasien.tglPelayanan,index);
		// }
		
	}

	getListJam(kdRuangan,tglReg,index) {
		let ruanganJam = [];
		this.i;
		// this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdRuangan='+kdRuangan+'&tglRegistrasi='+tglReg).subscribe(res => {
		// 	index = [];
		// 	for (var i = 0; i < res.length; i++) {
		// 		let jamLong = res[i].jamAwal;
		// 		let jamA = jamLong * 1000;
		// 		let jamFinal = moment(jamA).format('HH:mm');
		// 		this.listJam.push(
		// 			{
		// 				label: jamFinal,
		// 				value: res[i].jamAwal
		// 			}
		// 		);
		// 	}
		// })
		
	}

	pilihJam(event,dataIsi,index){
		//console.log(this.jamKalender);
		this.jamPilihAwal = '';
		this.jamPilihAkhir = '';
		this.jamPilihAwal = event.value.jmAwal;
		this.jamPilihAkhir = event.value.jmAkhir;
		this.noAntrian = event.value.noAntrian;

		//dataIsi.counter =
		// if(event.value != ''){
		// 	this.jamPilih = event.value;
		// 	this.buttonAktif = false;
		// }else{
		// 	this.jamPilih = event.value;
		// }
	}

	selanjutnya() {


		let tglLahir = null;
		if (this.jenisAsalPasien.tglLahir) {
			tglLahir = this.jenisAsalPasien.tglLahir;
		}
		let tglPelayanan = null;
		if (this.jenisAsalPasien.tglPelayanan) {
			tglPelayanan = this.jenisAsalPasien.tglPelayanan;
		}

		//jika user ga pilih dropdown
		if(this.jamPilihAwal == '' && this.jamPilihAkhir == '' && this.jenisAsalPasien.statusPasien != '78'){
			//pake yang dari data default
			this.jamPilihAwal = this.listData[this.indexKlik].arrayJam[0].value.jmAwal;
			this.jamPilihAkhir = this.listData[this.indexKlik].arrayJam[0].value.jmAkhir;
			this.noAntrian = this.listData[this.indexKlik].arrayJam[0].value.noAntrian;
		}else if(this.jamPilihAwal == '' && this.jamPilihAkhir == '' && this.jenisAsalPasien.statusPasien == '78'){
			this.jamPilihAwal = this.jenisAsalPasien.jamPilihAwal;
			this.jamPilihAkhir = this.jenisAsalPasien.jamPilihAkhir;
			this.noAntrian = this.jenisAsalPasien.noAntrian;
		}

		let tglPel;
		if(this.tglPilih != undefined ){
			tglPel = parseInt(this.tglPilih);
		}else if(this.tglPilih == undefined){
			tglPel = parseInt(this.jenisAsalPasien.tglPelayanan);
		}

		// if(this.jamPilihAkhir == undefined){
		// 	//pake yang default
		// 	this.jamPilihAkhir = this.listData[this.indexKlik].arrayJam[0].value.jmAkhir;
		// }
		

		let navigationExtras: NavigationExtras = {
			queryParams: {
				"nama": this.jenisAsalPasien.nama,
				"noKontak": this.jenisAsalPasien.noKontak,
				"statusPasien": this.jenisAsalPasien.statusPasien,
				"alamatLengkap": this.jenisAsalPasien.alamatLengkap,
				"kdDokterOrder": null,
				"kdRuanganTujuan": this.ruanganPilih,
				"namaPasien": this.jenisAsalPasien.namaPasien,
				"noCM": this.jenisAsalPasien.noCM,
				"noIdentitas": this.jenisAsalPasien.noIdentitas,
				"tempatLahir": this.jenisAsalPasien.tempatLahir,
				"tglLahir": this.jenisAsalPasien.tglLahir,
				"tglPelayanan": tglPel,
				"kdJenisAlamat": this.jenisAsalPasien.kdJenisAlamat,
				"kdJenisKelamin": this.jenisAsalPasien.kdJenisKelamin,
				"kdNegara": this.jenisAsalPasien.kdNegara,
				"kdDesaKelurahan": this.jenisAsalPasien.kdDesaKelurahan,
				"kdKecamatan": this.jenisAsalPasien.kdKecamatan,
				"kdKotaKabupaten": this.jenisAsalPasien.kdKotaKabupaten,
				"kdPropinsi": this.jenisAsalPasien.kdPropinsi,
				"kodePos": this.jenisAsalPasien.kodePos,
				"rtrw": this.jenisAsalPasien.rtrw,
				"jamPilihAwal":this.jamPilihAwal,
				"jamPilihAkhir":this.jamPilihAkhir,
				"isAntrianByRuangan":this.antrianByRuangan,
				"noAntrian":this.noAntrian,
				"tglPelayananDate": this.jenisAsalPasien.tglPelayananDate
			}
		};
		this.router.navigate(["kiosk/antrian/pilih-dokter"], navigationExtras);
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
				let data;
				if (dataPrint.printerAction == this.shortcutCetakAntrian) {
					if(this.jenisAsalPasien.statusPasien == this.kdStatusPasienBaru){
						data = {
							"download": false,
							"kdDepartemen": this.profile.kdDepartemen,
							"kdProfile": this.profile.idProfile,
							"outDepartemen": true,
							"outProfile": true,
							"namaFile": "Cetak Antrian Registrasi Masuk"+' '+antrian.kdAntrian,
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
					}else{
						data = {
							"download": false,
							"kdDepartemen": this.profile.kdDepartemen,
							"kdProfile": this.profile.idProfile,
							"outDepartemen": true,
							"outProfile": true,
							"namaFile": "Cetak Antrian Pelayanan Masuk"+' '+antrian.kdAntrian,
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
	
	
						this.httpService.genericReport(Configuration.get().report + '/generic/report/cetak-antrian-pelayanan-masuk.pdf', data).subscribe(response => {
	
							this.printer.printData(response, dataPrint.namaPrinter);
							this.router.navigate(["kiosk/"]);
	
						});
					}
					
					
					// this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-antrian-registrasi-masuk.pdf', 'Cetak Antrian', data);
				}
			}
		});
	}

	kembali() {
		let navigationExtras: NavigationExtras = {
			queryParams: {
				"nama": this.jenisAsalPasien.nama,
				"noKontak": this.jenisAsalPasien.noKontak,
				"statusPasien": this.jenisAsalPasien.statusPasien,
				"alamatLengkap": this.jenisAsalPasien.alamatLengkap,
				"kdDokterOrder": null,
				"kdRuanganTujuan": null,
				"namaPasien": this.jenisAsalPasien.namaPasien,
				"noCM": this.jenisAsalPasien.noCM,
				"noIdentitas": this.jenisAsalPasien.noIdentitas,
				"tempatLahir": this.jenisAsalPasien.tempatLahir,
				"tglLahir": this.jenisAsalPasien.tglLahir,
				"tglPelayanan": this.jenisAsalPasien.tglPelayanan,
				"kdJenisAlamat": this.jenisAsalPasien.kdJenisAlamat,
				"kdJenisKelamin": this.jenisAsalPasien.kdJenisKelamin,
				"kdNegara": this.jenisAsalPasien.kdNegara,
			}
		};
		if (this.jenisAsalPasien.noCM) {
			this.router.navigate(["kiosk/antrian/jenis-pasien-lama"], navigationExtras);
		} else {
			this.router.navigate(["kiosk/antrian/jenis-pasien-baru"], navigationExtras);
		}
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

	popUpPilihKalender(kdRuangan,indexP){
		this.tglPelayananPilih = new Date();
		this.indexPilih = indexP;
		this.pilihDialog = true;
		//let kdRuanganPilih = kdRuangan;
		this.kdRuanganPilihK = kdRuangan;
		this.listDataJamPop = [];
	}

	pilihTanggal2(event,dataIsi,index){
		let tglPilih = this.setTimeStamp(event);
		this.tglKunjungan = tglPilih;
		this.tglPilih = tglPilih;
		let dataJamP = [];
		this.dataJamPop = [];
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdRuangan='+dataIsi.kdRuangan+'&tglRegistrasi='+tglPilih).subscribe(res => {
			// dataJamP.push({ label: '--Pilih Jam--', value: { jmAwal: null, jmAkhir: null } });
			for (var z = 0; z < res.listJadwal.length; z++) {
				let jamLong = res.listJadwal[z].jamAwal;
					let jamA = jamLong * 1000;
					let jamFinal = moment(jamA).format('HH:mm');
	
						dataJamP.push(
							{
								label: jamFinal,
								value: {
									jmAwal:res.listJadwal[z].jamAwal,
									jmAkhir:res.listJadwal[z].jamAkhir,
									noAntrian:res.listJadwal[z].noAntrian
								}
							}
						);
			}
			dataIsi.arrayJam = dataJamP;
			dataIsi.counter = res.counter;
			dataIsi.qtyPasienMax = res.qtyPasienMax;

			if(dataIsi.arrayJam.length == 0){
				this.alertService.warn("Perhatian","Jadwal Sudah Tidak Tersedia");
				this.habisJadwal = true;
				this.buttonCetakAktif = true;
				this.buttonAktif = true;
			}else{
				this.habisJadwal = false;
				// this.buttonCetakAktif = false;
				// this.buttonAktif = false;
			}

			//di clear dulu 
			// for (let i = 0; i < this.listData.length; i++) {
				// if (index == dataIsi.length) {
					document.getElementById('ruangan-' + index).style.background = '';
				// } 
			// 	else {
			// 		document.getElementById('ruangan-' + i).style.background = '';
			// 	}
			// }

			// if(this.habisJadwal == true){
			// 	this.buttonCetakAktif = true;
			// 	this.buttonAktif = true;
			// }else{
			// 	this.buttonCetakAktif = false;
			// 	this.buttonAktif = false;
			// }
			//console.log(dataJamP);
			//this.listDataJamPop = dataJamP;
		});

	}

	pilihTanggal(event){
		let tglPilih = this.setTimeStamp(event);
		this.tglPilih = tglPilih;
		// this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findRuanganRawatJalan?tanggal='+tglPilih).subscribe(table => {
		// 	for (let i = 0; i < table.length; i++) {
				let dataJamP = [];
				this.dataJamPop = [];
				//this.listDataJamPop = [];
				this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdRuangan='+this.kdRuanganPilihK+'&tglRegistrasi='+tglPilih).subscribe(res => {
					// dataJamP.push({ label: '--Pilih Jam--', value: { jmAwal: null, jmAkhir: null } });
					for (var z = 0; z < res.listJadwal.length; z++) {
						let jamLong = res.listJadwal[z].jamAwal;
							let jamA = jamLong * 1000;
							let jamFinal = moment(jamA).format('HH:mm');
			
								dataJamP.push(
									{
										label: jamFinal,
										value: {
											jmAwal:res.listJadwal[z].jamAwal,
											jmAkhir:res.listJadwal[z].jamAkhir,
											noAntrian:res.listJadwal[z].noAntrian
										}
									}
								);
					}
					//console.log(dataJamP);
					this.listDataJamPop = dataJamP;
				});
			//}
		// });
	}

	pilihJamPopUp(event){
		this.dariPopUp = 1;
		
		this.jamPilihAwal = '';
		this.jamPilihAkhir = '';
		this.noAntrian = '';
		this.jamPilihAwal = event.value.jmAwal;
		this.jamPilihAkhir = event.value.jmAkhir;
		this.noAntrian = event.value.noAntrian;
		//disini replace listData nya
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findRuanganRawatJalan?tanggal='+this.tglPilih).subscribe(table => {

			let dataTemp = [...this.listData];

			for (let i = 0; i < table.length; i++) {
				let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
				let counter;
				let qtyM;
				let dataJam = [];

				this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdRuangan='+this.kdRuanganPilihK+'&tglRegistrasi='+this.tglPilih).subscribe(res => {
					let	counter = res.counter;
					let	qtyM = res.qtyPasienMax;
					if (table[i].gambarIcon !== null) {
						path = Configuration.get().resourceFile + '/image/show/' + table[i].gambarIcon;
					}
					for (var z = 0; z < res.listJadwal.length; z++) {
						
						let jamLong = res.listJadwal[z].jamAwal;
						let jamA = jamLong * 1000;
						let jamFinal = moment(jamA).format('HH:mm');
							dataJam.push(
								{
									label: jamFinal,
									value: {
										jmAwal:res.listJadwal[z].jamAwal,
										jmAkhir:res.listJadwal[z].jamAkhir,
										noAntrian:res.listJadwal[z].noAntrian
									}
								}
							);
					}

					if(table[i].kdRuangan == this.kdRuanganPilihK){
						dataTemp[this.indexPilih].counter = counter;
						dataTemp[this.indexPilih].qtyPasienMax = qtyM;
						dataTemp[this.indexPilih].arrayJam = dataJam;
						//dataTemp[this.indexPilih].arrayJam[0] = this.dataJamPop.jmAwal;
					}

				});


			}
			console.log(dataTemp);
			this.listData = dataTemp;

			setTimeout(()=>{
				this.pilihDialog = false;
			},1000)
			
			//this.dat[this.indexPilih].arrayJam[0] = this.jamPilihAwal;
		});


	}






}