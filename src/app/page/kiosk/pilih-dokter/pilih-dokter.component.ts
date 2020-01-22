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
	selector: "app-pilih-dokter",
	templateUrl: "./pilih-dokter.component.html",
	styleUrls: ["../kiosk-global.scss", "./pilih-dokter.component.scss"],
	providers: [ConfirmationService]
})
export class PilihDokterComponent implements OnInit, OnDestroy, AfterViewInit {
	jenisAsalPasien: any;
	listData: any[];
	buttonAktif: boolean = true;
	pilihDokter: any = null;
	profile: any;
	shortcutCetakAntrian = 'cetakAntrianKiosK';
	hotKey: any = null;
	jamPilihAwal:any;
	jamPilihAkhir:any;
	dat:any;
	indexKlik:any;
	jamKalender:any;

	rangeTahun: any;
	minDate: any;
	kdPegawaiPilihK:any;
	listDataJamPop:any[];
	dataJamPop:any;
	dariPopUp:any;
	tglPilih:any;
	indexPilih:any;
	tglPelayananPilih:any;
	pilihDialog: boolean;
	isRuangan:any;
	noAntrian:any;
	selectedJam:any;
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
		@Inject(forwardRef(() => ReportService)) private print: ReportService,
		private printer: PrinterService,
		private router: Router,
		private authGuard: AuthGuard,

	) {
		this.routes.queryParams.subscribe(params => {
			this.jenisAsalPasien = params;
		});

	}

	ngAfterViewInit(){
		this.isRuangan = this.jenisAsalPasien.isAntrianByRuangan;
	}

	ngOnInit() {
		this.tglKunjungan = this.jenisAsalPasien.tglPelayanan;
		console.log(this.jenisAsalPasien);
		this.tglPelayananPilih = new Date();
		this.rangeTahun = (new Date().getFullYear()) + ':' + (new Date().getFullYear() + 20)
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
		this.buttonAktif = true;
		this.profile = this.authGuard.getUserDto();
		let hostUrl = window.location.hash.replace("/", ",").split(",");
		let kiosk = hostUrl[1].split("/");
		this.hideMenu();
		this.getService();

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

		// this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/findDokterByRuangan?kdRuangan=' + this.jenisAsalPasien.kdRuanganTujuan).subscribe(table => {
		// 	this.listData = [];
		// 	this.listData = table;
		// 	let data = [];
		// 	for (let i = 0; i < table.length; i++) {
		// 		let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
		// 		if (table[i].gambarIcon !== null) {
		// 			path = Configuration.get().resourceFile + '/image/show/' + table[i].pegawai.photoDiri;
		// 		}
		// 		data[i] = {
		// 			"gambarIcon": path,
		// 			"namaLengkap": table[i].pegawai.namaLengkap,
		// 			"kdPegawai": table[i].pegawai.id.kode
		// 		}

		// 	}
		// 	this.listData = data;

		// });

		//service baru get dokter disini
		this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findDokterByKdRuangan?kdRuangan=' + this.jenisAsalPasien.kdRuanganTujuan + '&tanggal=' + this.jenisAsalPasien.tglPelayanan).subscribe(table => {
			this.listData = [];
			this.listData = table;
			let data = [];
			let tglPelFix = new Date(this.jenisAsalPasien.tglPelayananDate);
			for (let i = 0; i < table.length; i++) {
				let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
				let dataJam = [];

				// this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdDokter='+table[i].kdPegawai+'&kdRuangan='+this.jenisAsalPasien.kdRuanganTujuan+'&tglRegistrasi='+this.jenisAsalPasien.tglPelayanan).subscribe(res => {
					if (table[i].gambarIcon !== null) {
						path = Configuration.get().resourceFile + '/image/show/' + table[i].photoDiri;
					}

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


				// });
				

				data[i] = {
					"gambarIcon": path,
					"namaLengkap": table[i].namaPegawai,
					"kdPegawai": table[i].kdPegawai,
					"jamAwal": table[i].jamAwal,
					"jamAkhir": table[i].jamAkhir,
					"counter": table[i].jadwal.counter,
					"qtyPasienMax": table[i].jadwal.qtyPasienMax,
					"jamBuka": table[i].jamBuka,
					"jamTutup": table[i].jamTutup,
					"arrayJam":dataJam,
					"tglSekarang": tglPelFix
				}

			}
			this.listData = data;
			//console.log(this.listData);

		});

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

		//tidak pilih jam
		if(this.jenisAsalPasien.isAntrianByRuangan == "true"){
			this.noAntrian = this.jenisAsalPasien.noAntrian;
			this.jamPilihAwal = this.jenisAsalPasien.jamPilihAwal;
			this.jamPilihAkhir = this.jenisAsalPasien.jamPilihAkhir;
		//yg ini pilih jam
		}else if(this.jenisAsalPasien.isAntrianByRuangan == "false"){
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
				// this.jamPilihAwal = this.listData[this.indexKlik].arrayJam[0].value.jmAwal;
				// this.jamPilihAkhir = this.listData[this.indexKlik].arrayJam[0].value.jmAkhir;
				//this.noAntrian = this.listData[this.indexKlik].arrayJam[0].value.noAntrian;
			}
		}

		let tglPel;
		if(this.tglPilih != undefined ){
			tglPel = parseInt(this.tglPilih);
		}else if(this.tglPilih == undefined){
			tglPel = parseInt(this.jenisAsalPasien.tglPelayanan);
		}

		let dataCetak = {
			"alamatLengkap": this.jenisAsalPasien.alamatLengkap,
			"kdDesaKelurahan": parseInt(this.jenisAsalPasien.kdDesaKelurahan),
			"kdDokterOrder": this.pilihDokter,
			"kdJenisAlamat": parseInt(this.jenisAsalPasien.kdJenisAlamat),
			"kdJenisKelamin": parseInt(this.jenisAsalPasien.kdJenisKelamin),
			"kdKecamatan": parseInt(this.jenisAsalPasien.kdKecamatan),
			"kdKelompokKlien": parseInt(this.jenisAsalPasien.noKontak),
			"kdKotaKabupaten": parseInt(this.jenisAsalPasien.kdKotaKabupaten),
			"kdNegara": parseInt(this.jenisAsalPasien.kdNegara),
			"kdPropinsi": parseInt(this.jenisAsalPasien.kdPropinsi),
			"kdRuanganTujuan": this.jenisAsalPasien.kdRuanganTujuan,
			"kdStatusPasien": parseInt(this.jenisAsalPasien.statusPasien),
			"kodePos": this.jenisAsalPasien.kodePos,
			"namaPasien": this.jenisAsalPasien.namaPasien,
			"noAntrian": parseInt(this.noAntrian),
			"noCM": this.jenisAsalPasien.noCM,
			"noIdentitas": this.jenisAsalPasien.noIdentitas,
			"rtrw": this.jenisAsalPasien.rtrw,
			"tempatLahir": this.jenisAsalPasien.tempatLahir,
			"tglLahir": this.jenisAsalPasien.tglLahir,
			"tglPelayananAwal": tglPel,
			"tglPerkiraanPelayananAkhir": parseInt(this.jamPilihAkhir),
			"tglPerkiraanPelayananAwal": parseInt(this.jamPilihAwal),
			
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

		//console.log(dataCetak);
	}

	clickDokter(data, index) {
		this.indexKlik = index;
		this.buttonAktif = false;
		this.pilihDokter = data.kdPegawai;
		for (let i = 0; i < this.listData.length; i++) {
			if (index == i) {
				document.getElementById('dok-' + i).style.background = 'rgba(0, 0, 0, 0.2)';
			} else {
				document.getElementById('dok-' + i).style.background = '';
			}
		}

		if(data.arrayJam.length == 0){
			this.buttonAktif = true;
			this.alertService.warn('Perhatian','Jadwal Tidak Tersedia');
		}else{
			this.buttonAktif = false;
		}
		//console.log(data)
	}

	cetak(antrian) {
		let namaKomputerSesion = sessionStorage.getItem('namaKomputer');

		this.httpService.get(Configuration.get().klinik1Java + '/printerAction/getPrinterName?host=' + namaKomputerSesion + '&shoutcart=' + encodeURIComponent(this.hotKey)).subscribe(table => {
			//console.log(table)
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
				"kdRuanganTujuan": this.jenisAsalPasien.kdRuanganTujuan,
				"namaPasien": this.jenisAsalPasien.namaPasien,
				"noCM": this.jenisAsalPasien.noCM,
				"noIdentitas": this.jenisAsalPasien.noIdentitas,
				"tempatLahir": this.jenisAsalPasien.tempatLahir,
				"tglLahir": this.jenisAsalPasien.tglLahir,
				"tglPelayanan": this.jenisAsalPasien.tglPelayanan,
				"kdJenisAlamat": this.jenisAsalPasien.kdJenisAlamat,
				"kdJenisKelamin": this.jenisAsalPasien.kdJenisKelamin,
				"kdNegara": this.jenisAsalPasien.kdNegara,
				"kdDesaKelurahan": this.jenisAsalPasien.kdDesaKelurahan,
				"kdKecamatan": this.jenisAsalPasien.kdKecamatan,
				"kdKotaKabupaten": this.jenisAsalPasien.kdKotaKabupaten,
				"kdPropinsi": this.jenisAsalPasien.kdPropinsi,
				"kodePos": this.jenisAsalPasien.kodePos,
				"rtrw": this.jenisAsalPasien.rtrw,
				"tglPelayananDate": this.jenisAsalPasien.tglPelayananDate
			}
		};
		this.router.navigate(["kiosk/antrian/poli-rawat-jalan"], navigationExtras);
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

	pilihJam(event){
		//console.log(this.jamKalender);
		this.jamPilihAwal = '';
		this.jamPilihAkhir = '';
		this.jamPilihAwal = event.value.jmAwal;
		this.jamPilihAkhir = event.value.jmAkhir;
		this.noAntrian = event.value.noAntrian;
	}

	popUpPilihKalender(kdPegawai,indexP){
		this.tglPelayananPilih = new Date();
		this.indexPilih = indexP;
		this.pilihDialog = true;
		this.kdPegawaiPilihK = kdPegawai;
		this.listDataJamPop = [];
	}

	pilihTanggal2(event,dataIsi,index){
		let tglPilih = this.setTimeStamp(event);
		this.tglKunjungan = tglPilih;
		this.tglPilih = tglPilih;
		let dataJamP = [];
		this.dataJamPop = [];
		this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdDokter='+dataIsi.kdPegawai+'&kdRuangan='+parseInt(this.jenisAsalPasien.kdRuanganTujuan)+'&tglRegistrasi='+tglPilih).subscribe(res => {
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

			dataIsi.arrayJam = dataJamP;
			dataIsi.counter = res.counter;
			dataIsi.qtyPasienMax = res.qtyPasienMax;

			if(dataIsi.arrayJam.length == 0){
				this.alertService.warn("Perhatian","Jadwal Sudah Tidak Tersedia");
				this.buttonAktif = true;
			}

			document.getElementById('dok-' + index).style.background = '';
			//console.log(dataJamP);
			//this.listDataJamPop = dataJamP;
		});
	}

	pilihTanggal(event){
		let tglPilih = this.setTimeStamp(event);
		this.tglPilih = tglPilih;

				let dataJamP = [];
				this.dataJamPop = [];
				this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdDokter='+this.kdPegawaiPilihK+'&kdRuangan='+this.jenisAsalPasien.kdRuanganTujuan+'&tglRegistrasi='+tglPilih).subscribe(res => {
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
											jmAkhir:res.listJadwal[z].jamAkhir
										}
									}
								);
					}
					this.listDataJamPop = dataJamP;
				});
	}

	pilihJamPopUp(event){
		this.dariPopUp = 1;
		
		this.jamPilihAwal = '';
		this.jamPilihAkhir = '';
		this.jamPilihAwal = event.value.jmAwal;
		this.jamPilihAkhir = event.value.jmAkhir;
		this.noAntrian = event.value.noAntrian;
		//disini replace listData nya
		this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findDokterByKdRuangan?kdRuangan='+this.jenisAsalPasien.kdRuanganTujuan + '&tanggal=' + this.jenisAsalPasien.tglPelayanan).subscribe(table => {

			let dataTemp = [...this.listData];

			for (let i = 0; i < table.length; i++) {
				let path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
				let counter;
				let qtyM;
				let dataJam = [];

				this.httpService.get(Configuration.get().klinik1Java + '/kiosKController/listTglPelayanan?kdDokter='+table[i].kdPegawai+'&kdRuangan='+this.jenisAsalPasien.kdRuanganTujuan+'&tglRegistrasi='+this.tglPilih).subscribe(res => {
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

					if(table[i].kdPegawai == this.kdPegawaiPilihK){
						dataTemp[this.indexPilih].counter = counter;
						dataTemp[this.indexPilih].qtyPasienMax = qtyM;
						dataTemp[this.indexPilih].arrayJam = dataJam;
						//dataTemp[this.indexPilih].arrayJam[0] = this.dataJamPop.jmAwal;
					}

				});


			}
			//console.log(dataTemp);
			this.listData = dataTemp;
			setTimeout(()=>{
				this.pilihDialog = false;
			},1000)
			//this.pilihDialog = false;
		});


	}



}