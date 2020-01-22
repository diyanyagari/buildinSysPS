import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataPegawai } from './login-userconfigss.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {
	LazyLoadEvent,
	ConfirmDialogModule,
	ConfirmationService,
	TreeTableModule,
	TreeNode,
	SharedModule
} from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, HttpClient, AuthGuard } from '../../../global';

@Component({
	selector: 'app-login-userconfigss',
	templateUrl: './login-userconfigss.component.html',
	styleUrls: ['./login-userconfigss.component.scss'],
	providers: [ConfirmationService]
})
export class LoginUserConfigSSComponent implements OnInit {
	form: FormGroup;
	today: Date;
	smbrFoto: any;
	dataModulAplikasi: TreeNode[];
	dataAplikasi: any[];
	selectedFiles2: TreeNode[];
	selectedFiles3: TreeNode[];
	targetModulAplikasi: any[];
	listProfile: any = [];
	kelompokUser: any[];
	kataSandi: any;
	hintKataSandi: any;
	dataAlamat: any[];
	idModulAplikasi: any = {};
	dataAplikasiModul: any[];
	dataParent: TreeNode[];
	namaModulAplikasi: string;
	kdModulAplikasi: any;
	datParent: any[];
	children: any[];
	dataChild: any[];
	modAp: any[];
	listData: any[];
	totalRecords: any;
	totalRecordDokumens: any;
	page: any;
	rows: any;
	versi: any;
	alamatLengkap: any;
	pencarian: any;
	kdJenisDokumenSearch: any;
	tglAwalSearch: any;
	tglAkhirSearch: any;
	tglSekarang: any;
	formUser: FormGroup;
	formData: FormGroup;
	formPegawai: FormGroup;
	formSlide: FormGroup;
	formSlideAdd: FormGroup;
	formNew: FormGroup;
	formPencarian: FormGroup;
	dataPhoto: any;
	namaPhoto: any;
	kdKelompok: any;
	responseEmail: any;
	responseMobile: any;
	dataTersedia: any;
	dataTidakTersedia: any;
	dataEmailTersedia: any;
	dataEmailTidakTersedia: any;
	btnAktif: any;
	btnUserBaru: any;
	btnEditData: any;
	dataChildn: any;
	modApn: any;
	datAplikasi: any;
	version: any;
	kdUser: any;
	statusEnabled: any;
	selected: any;
	btnSimpanUser: any;
	index: number;
	daAplikasi: any;
	idModul: string;
	tabLoginUser: any;
	idRuangan: any;
	selectedData: any;
	dataAplikasiChild: any;
	dataModulAplikasiChild: any;
	selectModul: any;
	selectDat: any;
	dataPilihModul: any;
	namaUser: any;
	namaMobile: any;
	pilihan: any = [];
	pilihSemua: boolean;
	listDataModul: any[];
	dataUnitKerja: any = [];
	dataMdlAplikasi: any = [];

	listDataLokasi: any[];
	listDataRuangan: any[];
	listSlideShow: any = [];
	listChildSlideShow: any = [];
	listSlideShowRecord: any = [];

	listDataDokumen: any = [];
	listDataDokumenDummy: any = [];
	pilihanRuangan: any = [];
	pilihSemuaRuangan: boolean;
	namaUserEmail: any;
	namaUserMobile: any;
	dataModul: any[];
	selectedModul: any[];
	selectedUnit: any[];
	tempModul: any[];
	kdPgw: any;
	kdModul: any;
	kodeUser: any;
	dropdownJenisDokumen: any;
	kdjenisDokumen: any;
	pencariannamadokumen: any;
	disabled: boolean;
	images = [];
	image: string;
	fileSSImagePathFile = [];
	slide_show: any[];
	slide_show_M: any[];
	dokumen: any = [];
	NoUrut: number;
	selectedDokumen: any;
	JenisDokumen: any;
	isValid: boolean;
	isValid2: boolean;
	isValid3: boolean;
	namaFoto1: any;
	smbrFoto1: any;
	smbrVideo1: any;
	hasilCek: boolean = false;
	blockFromProfile: boolean = false;
	kdProfile: any;
	nmrUrutSlide: any = 1;
	paramThumbnailImage: any;
	paramThumbnailVideo: any;
	switchPagging: boolean = false;

	tanggalBerAwal:any;
	tanggalBerAkhir:any;

	constructor(
		private httpService: HttpClient,
		private fb: FormBuilder,
		private confirmationService: ConfirmationService,
		private route: Router,
		private alertService: AlertService,
		private authGuard: AuthGuard
	) { }
	ngAfterViewInit() {
		this.hasilCek = false;
		this.blockFromProfile = true;
		this.unlockAll(this.kdProfile);
		// console.log(this.kdProfile)
	}
	ngOnInit() {
		this.switchPagging = false;
		this.pencarian = '';
		this.kdJenisDokumenSearch = '';
		this.tglAwalSearch = '';
		this.tglAkhirSearch = '';
		this.paramThumbnailImage = null;
		this.paramThumbnailVideo = null;
		this.blockFromProfile = true;
		this.smbrFoto1 = null;
		this.listDataRuangan = null;
		this.listDataLokasi = null;
		window.scrollTo(0, 0);

		// this.kdUser = null;
		this.index = 0;
		this.slide_show = [];
		this.today = new Date();
		this.tglSekarang = this.today;
		this.btnAktif = true;
		this.btnEditData = true;
		this.btnUserBaru = true;
		this.btnSimpanUser = false;
		this.tabLoginUser = true;
		// let tglBerlakuAkhir = new Date();
		// let tglBerlakuAwal =  new Date();

		this.tanggalBerAwal = new Date();
		this.tanggalBerAwal.setHours(0, 0, 0, 0);

		this.tanggalBerAkhir = new Date();
		this.tanggalBerAkhir.setHours(23, 59, 0, 0);

		//tglBerlakuAwal.setHours(0, 0, 0, 0);
		// let tes = tglBerlakuAkhir;
		console.log(this.setTimeStamp(this.tanggalBerAwal));
		console.log(this.setTimeStamp(this.tanggalBerAkhir));

		this.formNew = this.fb.group({
			'tglBerlakuAkhir': new FormControl(this.tanggalBerAkhir),
			'tglBerlakuAwal': new FormControl(this.tanggalBerAwal),
			'kdRuangan': new FormControl(null),
			'kdProfile': new FormControl(null, Validators.required),
			'kdModulAplikasi': new FormControl(null),
			'durasiLiveDetik': new FormControl(null),
			'fileSSImageVideo': new FormControl(null),
			'fileSSImageVideoPathFile': new FormControl(null),
			'noHistori': new FormControl(null),
			'noPlanning': new FormControl(null),
			'noPosting': new FormControl(null)
		})
		this.formPencarian = this.fb.group({
			'tglAwalPencarian': new FormControl(new Date()),
			'tglAkhirPencarian': new FormControl(new Date())
		})
		this.form = this.fb.group({
			namaLengkap: new FormControl(''),
			tanggalLahir: new FormControl(''),
			namaJenisKelamin: new FormControl(''),
			kdPegawai: new FormControl('')
		});
		this.formUser = this.fb.group({
			tglSekarang: new FormControl(this.today),
			kataSandi: new FormControl('', Validators.required),
			namaUserEmail: new FormControl('', Validators.required),
			namaUserMobile: new FormControl('', Validators.required),
			kdKelompok: new FormControl('', Validators.required),
			hintKataSandi: new FormControl('', Validators.required),
			ulangiKataSandi: new FormControl('', Validators.required)
		});
		this.formPegawai = this.fb.group({
			noID: new FormControl(),
			alamatLengkap: new FormControl('')
		});
		this.formSlide = this.fb.group({
			tglAkhir: new FormControl(new Date()),
			tglAwal: new FormControl(new Date()),
			pencariannamadokumen: new FormControl(),
			kdJenisDokumen: new FormControl(''),
			//NoUrut: new FormControl('', Validators.required),
			pathFileFolderEvent: new FormControl(''),
			noUrutSS: new FormControl('')
		});
		this.formSlideAdd = this.fb.group(
			{
				//NoUrut: new FormControl('', Validators.required)
			}
		);
		//disable Form
		// this.formUser.get('tglSekarang').disable();
		// this.formUser.get('kataSandi').disable();
		// this.formUser.get('namaUserEmail').disable();
		// this.formUser.get('namaUserMobile').disable();
		// this.formUser.get('kdKelompok').disable();
		// this.formUser.get('hintKataSandi').disable();
		// this.formUser.get('ulangiKataSandi').disable();

		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		// this.getData(this.page, this.rows);
		// this.getKelompokUser();
		//this.getDataModul();
		this.getDataModulDanRuangan();
		//this.getDataDokumen(this.page, this.rows);
		// this.getDataDokumen();
		this.getJenisDokumen();
		// this.loadSlide();
		//this.getValidNoUrut();
		//this.getDataModulAplikasi();
		this.form.disable();
		this.dataAplikasi = [];
		this.dataChild = [];
		this.selectedFiles2 = [];
		this.selectedFiles3 = [];
		//this.getNoUrut();
		//this.formSlide.get('NoUrut').disable();
		//this.smbrFoto1 = null;
		this.isValid3 = true;
		// console.log(this.isValid);
		// console.log(this.isValid3);
		//console.log(this.formSlide.get('kdJenisDokumen').value);
		this.getProfile();
		this.getListSlideShow(this.page, this.rows);
		// this.getUnitKerja();
		this.formSlide.get('noUrutSS').setValue(1);
		this.listDataDokumenDummy = [
			{
				'kdDokumen': 1,
				'namaJenisDokumen': 'asdasd',
				'namaDokumen': 'asdasd',
				'fileSSImagePathFile': 'asdasd',
			},
			{
				'kdDokumen': 1,
				'namaJenisDokumen': 'asdasd',
				'namaDokumen': 'asdasd',
				'fileSSImagePathFile': 'asdasd',
			},
			{
				'kdDokumen': 1,
				'namaJenisDokumen': 'asdasd',
				'namaDokumen': 'asdasd',
				'fileSSImagePathFile': 'asdasd',
			},
		]
	}

	// getKelompokUser() {
	// 	this.httpService.get(Configuration.get().dataMaster + '/kelompokuser/findKelUser').subscribe((result) => {
	// 		this.kelompokUser = [];
	// 		for (var i = 0; i < result.KelompokUser.length; ++i) {
	// 			this.kelompokUser.push({
	// 				label: result.KelompokUser[i].namaKelompokUser,
	// 				value: result.KelompokUser[i].kode.kode
	// 			});
	// 		}
	// 	});
	// }

	getProfile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findAllData').subscribe(res => {
			this.listProfile = [];
			this.listProfile.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.Data.length; i++) {
				this.listProfile.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kode })
			};
		})
	}

	getUnitKerja(kdProfile) {
		if (kdProfile == '' || kdProfile == null) {
			this.listDataRuangan = null;
			this.listDataLokasi = null;
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/getAllTree?kdProfile=' + kdProfile).subscribe(res => {
				this.listDataRuangan = res.Ruangan;
				this.listDataLokasi = res.Lokasi;
				// this.listDataLokasi = [];
				// this.listDataLokasi.push({ label: '-- Pilih --', value: '' })
				// for (var i = 0; i < res.Lokasi.length; i++) {
				// 	this.listDataRuangan = result.dataRuangan;
				// 	this.listDataLokasi.push({ label: res.Lokasi[i].namaRuangan, value: res.Lokasi[i].kdRuangan })
				// };
			})
		}
	}

	// getData(page: number, rows: number) {
	// 	this.httpService
	// 		.get(
	// 			Configuration.get().dataMasterNew +
	// 			'/loginuser/findAllPegawaiLoginUser?page=' +
	// 			page +
	// 			'&rows=' +
	// 			rows +
	// 			'&dir=namaLengkap&sort=asc'
	// 		)
	// 		.subscribe((table) => {
	// 			this.listData = table.DataPegawai;
	// 			this.totalRecords = table.totalRow;
	// 		});
	// }

	loadPage(event: LazyLoadEvent) {
		// this.getData((event.rows + event.first) / event.rows, event.rows);
		this.getListSlideShow((event.rows + event.first) / event.rows, event.rows)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	loadPageListSS(event: LazyLoadEvent) {
		let tglAwalCari = Math.floor((this.setTimeStamp(this.formPencarian.get('tglAwalPencarian').value)))
		let tglAkhirCari = Math.floor((this.setTimeStamp(this.formPencarian.get('tglAkhirPencarian').value)))
		if (this.switchPagging) {
			this.cariGridPagging((event.rows + event.first) / event.rows, event.rows, tglAwalCari, tglAkhirCari)
			// this.page = (event.rows + event.first) / event.rows;
			// this.rows = event.rows;
		} else {
			this.getListSlideShow((event.rows + event.first) / event.rows, event.rows)

		}
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;

	}

	loadPageDokumen(event: LazyLoadEvent) {
		//this.getDataDokumen((event.rows + event.first) / event.rows, event.rows);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	reset() {
		this.kdProfile = '';
		this.listDataDokumen = '';
		this.hasilCek = false;
		this.ngOnInit();
	}

	resetPencarian() {
		this.pencarian = '';
		this.kdJenisDokumenSearch = '';
		this.tglAwalSearch = '';
		this.tglAkhirSearch = '';
		this.formSlide.get('tglAwal').setValue(new Date())
		this.formSlide.get('tglAkhir').setValue(new Date())
		this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile='
			+ this.kdProfile
		).subscribe(res => {
			res.data.forEach((data) => {
				data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
			});
			this.listDataDokumen = res.data;
			this.totalRecordDokumens = res.data.length;
		});
	}

	onRowSelect(event) {
		// this.listDataRuangan = [];
		this.selectedUnit = [];
		this.selectedModul = [];
		console.log(event.data);
		this.selectedDokumen = event.data
		this.responseMobile = '';
		this.responseEmail = '';
		this.formUser.reset();
		//this.getDataModul();
		// console.log(dataModulAplikasi);

		// this.getUser(event.data.kdpegawai);
		this.kdPgw = event.data.kdpegawai;
		// this.getUser2(event.data.kdpegawai);
		this.form.get('kdPegawai').setValue(event.data.kdpegawai);
		this.isValid = true;
		this.isValid3 = false;
		console.log(this.isValid3);
		console.log(this.isValid);
		//this.formSlide.get('NoUrut').enable();
	}

	clone(cloned: DataPegawai): DataPegawai {
		let hub = new InisialDataPegawai();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialDataPegawai();
		fixHub = {
			namaLengkap: hub.namaLengkap,
			tanggalLahir: new Date(hub.tglLahir * 1000),
			namaJenisKelamin: hub.namaJenisKelamin,
			kdPegawai: hub.kdPegawai
		};
		return fixHub;
	}

	// getUser(kdPegawai) {
	// 	this.httpService
	// 		.get(Configuration.get().dataMasterNew + '/loginuser/findByKdPegawai/' + kdPegawai)
	// 		.subscribe((result) => {
	// 			// console.log(result);
	// 			if (result.LoginUser['0'].kdUser == null || result.LoginUser['0'].kdUser == '-') {
	// 				this.pilihan = [];
	// 				this.pilihanRuangan = [];
	// 				this.getDataModul();
	// 				this.formUser.get('tglSekarang').setValue(this.tglSekarang);
	// 				this.statusEnabled = result.LoginUser['0'].dataUser.statusEnabled;
	// 				this.version = null;
	// 			} else {
	// 				this.dataPilihModul = this.dataAplikasi;
	// 				this.kdUser = result.LoginUser['0'].kdUser;
	// 				this.statusEnabled = result.LoginUser['0'].dataUser.statusEnabled;

	// 				this.httpService
	// 					.get(Configuration.get().dataMasterNew + '/maploginusertoprofile/findByKode/' + this.kdUser)
	// 					.subscribe((result) => {
	// 						this.pilihan = [];
	// 						for (let i = 0; i < result.dataModulAplikasi.length; i++) {
	// 							this.pilihan.push(String(result.dataModulAplikasi[i].kode));
	// 						}
	// 						this.pilihanRuangan = [];
	// 						for (let i = 0; i < result.dataModulAplikasi.length; i++) {
	// 							this.pilihanRuangan.push(String(result.dataRuangan[i].kdRuangan));
	// 						}
	// 					});
	// 				this.formUser.get('namaUserEmail').setValue(result.LoginUser[0].dataUser.namaUserEmail);
	// 				this.namaUser = result.LoginUser[0].dataUser.namaUserEmail;
	// 				this.namaMobile = result.LoginUser[0].dataUser.namaUserMobile;
	// 				this.formUser.get('namaUserMobile').setValue(result.LoginUser[0].dataUser.namaUserMobile);
	// 				this.formUser.get('kataSandi').setValue('      ');
	// 				this.formUser.get('tglSekarang').setValue(new Date(result.LoginUser[0].dataUser.tglDaftar * 1000));
	// 				this.formUser.get('hintKataSandi').setValue(result.LoginUser[0].dataUser.hintKataSandi);
	// 				this.formUser.get('kdKelompok').setValue(result.LoginUser['0'].kelompokUser.id);
	// 				this.version = result.LoginUser['0'].dataUser.version;
	// 				this.namaUserEmail = result.LoginUser[0].dataUser.namaUserEmail;
	// 				this.namaUserMobile = result.LoginUser[0].dataUser.namaUserMobile;
	// 			}
	// 		});
	// }

	cariDokumen() {
		this.tglAwalSearch = Math.floor(this.setTimeStamp(this.formSlide.get('tglAwal').value));
		this.tglAkhirSearch = Math.floor(this.setTimeStamp(this.formSlide.get('tglAkhir').value));
		// let tglAwal = this.setTimeStamp(this.tglAwalSearch);
		// let tglAkhir = this.setTimeStamp(this.tglAkhirSearch);
		if ((this.kdJenisDokumenSearch == '' || this.kdJenisDokumenSearch == null) && (this.pencarian == '' || this.pencarian == null)) {
			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile='
				+ this.kdProfile
				+ '&tglAwal='
				+ this.tglAwalSearch
				+ '&tglAkhir='
				+ this.tglAkhirSearch
			).subscribe(res => {
				res.data.forEach((data) => {
					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
				});
				this.listDataDokumen = res.data;
				this.totalRecordDokumens = res.data.length;
			});
		} else if (this.kdJenisDokumenSearch == '' || this.kdJenisDokumenSearch == null) {
			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile='
				+ this.kdProfile
				+ '&tglAwal='
				+ this.tglAwalSearch
				+ '&tglAkhir='
				+ this.tglAkhirSearch
				+ '&namaDokumen='
				+ this.pencarian
			).subscribe(res => {
				res.data.forEach((data) => {
					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
				});
				this.listDataDokumen = res.data;
				this.totalRecordDokumens = res.data.length;
			});
		} else if (this.pencarian == '' || this.pencarian == null) {
			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile='
				+ this.kdProfile
				+ '&tglAwal='
				+ this.tglAwalSearch
				+ '&tglAkhir='
				+ this.tglAkhirSearch
				+ '&kdJenisDokumen='
				+ this.kdJenisDokumenSearch
			).subscribe(res => {
				res.data.forEach((data) => {
					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
				});
				this.listDataDokumen = res.data;
				this.totalRecordDokumens = res.data.length;
			});
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile='
				+ this.kdProfile
				+ '&tglAwal='
				+ this.tglAwalSearch
				+ '&tglAkhir='
				+ this.tglAkhirSearch
				+ '&kdJenisDokumen='
				+ this.kdJenisDokumenSearch
				+ '&namaDokumen='
				+ this.pencarian
			).subscribe(res => {
				res.data.forEach((data) => {
					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
				});
				this.listDataDokumen = res.data;
				this.totalRecordDokumens = res.data.length;
			});
		}
	}

	cariDataDokumenKeyup() {
		if (this.tglAwalSearch == '' || this.tglAkhirSearch == '') {
			if (this.kdJenisDokumenSearch == '' || this.kdJenisDokumenSearch == null) {
				this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?&dir=tglHistori&sort=desc&kdProfile=' + this.kdProfile + '&namaDokumen=' + this.pencarian).subscribe(res => {
					res.data.forEach((data) => {
						data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
					});
					this.listDataDokumen = res.data;
					this.totalRecordDokumens = res.data.length;
				});
			} else {
				this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?&dir=tglHistori&sort=desc&kdProfile=' + this.kdProfile + '&kdJenisDokumen=' + this.kdJenisDokumenSearch + '&namaDokumen=' + this.pencarian).subscribe(res => {
					res.data.forEach((data) => {
						data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
					});
					this.listDataDokumen = res.data;
					this.totalRecordDokumens = res.data.length;
				});
			}
		}
	}

	// cariDataDokumenDropdown(kdJenisDok) {
	// 	this.kdJenisDokumenSearch = kdJenisDok
	// 	if (this.tglAwalSearch == '' || this.tglAkhirSearch == '') {
	// 		if (this.pencarian == '' || this.pencarian == null) {
	// 			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile=' + this.kdProfile + '&kdJenisDokumen=' + kdJenisDok).subscribe(res => {
	// 				res.data.forEach((data) => {
	// 					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
	// 				});
	// 				this.listDataDokumen = res.data;
	// 				this.totalRecordDokumens = res.data.length;
	// 			});
	// 		} else {
	// 			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?dir=tglHistori&sort=desc&kdProfile=' + this.kdProfile + '&kdJenisDokumen=' + kdJenisDok + '&namaDokumen=' + this.pencarian).subscribe(res => {
	// 				res.data.forEach((data) => {
	// 					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
	// 				});
	// 				this.listDataDokumen = res.data;
	// 				this.totalRecordDokumens = res.data.length;
	// 			});
	// 		}
	// 	}
	// }

	getDataDokumen(kdProfile) {
		if (kdProfile == '' || kdProfile == null) {
			this.listDataDokumen = [];
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findAllDokumen?&dir=tglHistori&sort=desc&kdProfile=' + kdProfile).subscribe(res => {
				res.data.forEach((data) => {
					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
				});
				this.listDataDokumen = res.data;
				this.totalRecordDokumens = res.data.length;
			});
		}
	}

	getListSlideShow(page: number, rows: number) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findGroup?page=' + page + '&rows=' + rows + '&dir=strukPostingSS.tglAwal&sort=desc').subscribe(res => {
			this.listSlideShow = res.ProfileHistoriEvent;
			this.listSlideShowRecord = res.totalRow;
			this.listSlideShow.forEach((data) => {
				data.slideshow = [];
				this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/getSlideShow?kdProfile=' + data.kdProfile + '&kdModulAplikasi=' + data.kdModulAplikasi + '&noPostingSS=' + data.noPostingSS).subscribe(obj => {
					obj.SlideShow.forEach((result) => {
						if (result.noHistori == null) {
							var formatFile = result.fileSSImageVideoPathFile.slice(result.fileSSImageVideoPathFile.length - 4, result.fileSSImageVideoPathFile.length);
							if (formatFile == '.mp4') {
								result.fileSSImageVideo = 'video'
								result.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/video/show/' + result.fileSSImageVideoPathFile;
							} else {
								result.fileSSImageVideo = 'image'
								result.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/image/show/' + result.fileSSImageVideoPathFile;
							}
						} else {
							var formatFile = result.filePathDokumen.slice(result.filePathDokumen.length - 4, result.filePathDokumen.length);
							if (formatFile == '.mp4') {
								result.fileSSImageVideo = 'video'
								result.filePathDokumen = Configuration.get().resourceFile + '/video/show/' + result.filePathDokumen;
							} else {
								result.fileSSImageVideo = 'image'
								result.filePathDokumen = Configuration.get().resourceFile + '/image/show/' + result.filePathDokumen;
							}
						}
					})
					data.slideshow = obj.SlideShow;
				})
			})
		});
	}

	cariGridPagging(page: number, rows: number, tglAwal: number, tglAkhir: number) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findGroup?page=' + page + '&rows=' + rows + '&dir=strukPostingSS.tglAwal&sort=desc&tglBerlakuAwal='
			+ tglAwal
			+ '&tglBerlakuAkhir='
			+ tglAkhir).subscribe(res => {
				res.ProfileHistoriEvent.forEach((data) => {
					var formatFile = data.fileSSImageVideoPathFile.slice(data.fileSSImageVideoPathFile.length - 4, data.fileSSImageVideoPathFile.length);
					if (formatFile == '.mp4') {
						data.fileSSImageVideo = 'video'
						data.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/video/show/' + data.fileSSImageVideoPathFile;
					} else {
						data.fileSSImageVideo = 'image'
						data.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/image/show/' + data.fileSSImageVideoPathFile;
					}
					// data.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/image/show/' + data.fileSSImageVideoPathFile;
				});
				this.listSlideShow = res.ProfileHistoriEvent;
				this.listSlideShowRecord = res.totalRow;
			});
	}

	cariGrid() {
		let tglAwalCari = Math.floor((this.setTimeStamp(this.formPencarian.get('tglAwalPencarian').value)))
		let tglAkhirCari = Math.floor((this.setTimeStamp(this.formPencarian.get('tglAkhirPencarian').value)))
		this.switchPagging = true;
		this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/findGroup?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=strukPostingSS.tglAwal&sort=desc&tglBerlakuAwal='
			+ tglAwalCari
			+ '&tglBerlakuAkhir='
			+ tglAkhirCari).subscribe(res => {

				this.listSlideShow = res.ProfileHistoriEvent;
				this.listSlideShowRecord = res.totalRow;
				this.listSlideShow.forEach((data) => {
					data.slideshow = [];
					this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigslideshow/getSlideShow?kdProfile=' + data.kdProfile + '&kdModulAplikasi=' + data.kdModulAplikasi + '&noPostingSS=' + data.noPostingSS).subscribe(obj => {
						obj.SlideShow.forEach((result) => {
							if (result.noHistori == null) {
								var formatFile = result.fileSSImageVideoPathFile.slice(result.fileSSImageVideoPathFile.length - 4, result.fileSSImageVideoPathFile.length);
								if (formatFile == '.mp4') {
									result.fileSSImageVideo = 'video'
									result.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/video/show/' + result.fileSSImageVideoPathFile;
								} else {
									result.fileSSImageVideo = 'image'
									result.fileSSImageVideoPathFile = Configuration.get().resourceFile + '/image/show/' + result.fileSSImageVideoPathFile;
								}
							} else {
								var formatFile = result.filePathDokumen.slice(result.filePathDokumen.length - 4, result.filePathDokumen.length);
								if (formatFile == '.mp4') {
									result.fileSSImageVideo = 'video'
									result.filePathDokumen = Configuration.get().resourceFile + '/video/show/' + result.filePathDokumen;
								} else {
									result.fileSSImageVideo = 'image'
									result.filePathDokumen = Configuration.get().resourceFile + '/image/show/' + result.filePathDokumen;
								}
							}
						})
						data.slideshow = obj.SlideShow;
					})
				})
				this.listSlideShow = res.ProfileHistoriEvent;
				this.listSlideShowRecord = res.totalRow;
			});
	}

	resetCariGrid() {
		this.switchPagging = false;
		this.formPencarian.get('tglAwalPencarian').setValue(new Date())
		this.formPencarian.get('tglAkhirPencarian').setValue(new Date())
		this.getListSlideShow(this.page, this.rows)
	}

	unlockAll(kdProfile) {
		// console.log(kdProfile);
		this.getDataDokumen(kdProfile);
		this.getUnitKerja(kdProfile);
		if (kdProfile == '' || kdProfile == null) {
			this.blockFromProfile = true;
		} else {
			this.blockFromProfile = false;
		}
	}

	changejenis(event) {
		console.log(event);
	}

	// getDataModulAplikasi() {
	// 	this.dataModulAplikasi = [
	// 		{
	// 			label: 'EIS / Director Book',
	// 			data: { kdModulAplikasi: '1', namaModulAplikasi: 'EIS / Director Book' },
	// 			children: [
	// 				{
	// 					label: 'Bagian Administrasi Pegawai',
	// 					data: { kdModulAplikasi: '1', kdRuangan: 'E1', namaRuangan: 'Bagian Administrasi Pegawai' }
	// 				}
	// 			]
	// 		},
	// 		{
	// 			label: 'Orientasi Pegawai',
	// 			data: { kdModulAplikasi: '2', namaModulAplikasi: 'Orientasi Pegawai' },
	// 			children: [
	// 				{
	// 					label: 'Bagian Pengembangan SDM',
	// 					data: { kdModulAplikasi: '2', kdRuangan: 'O1', namaRuangan: 'Bagian Pengembangan SDM' }
	// 				}
	// 			]
	// 		}
	// 	];
	// 	return this.dataAplikasi;
	// }
	getDataModul() {
		this.httpService
			.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllWithRuangan/')
			.subscribe((result) => {
				this.listDataModul = result.dataModulAplikasi;
				// this.listDataRuangan = result.dataRuangan;
			});
	}

	getJenisDokumen() {
		this.httpService.get(Configuration.get().dataMaster + '/profileconfigslideshow/getJenisDokumen').subscribe(res => {
			this.dropdownJenisDokumen = [];
			this.dropdownJenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: '' });
			for (var i = 0; i < res.jenisDokumen.length; i++) {
				this.dropdownJenisDokumen.push({
					label: res.jenisDokumen[i].namaJenisDokumen,
					value: res.jenisDokumen[i].kode
				});
			}
		});
	}

	//fungsi baru get modul dan ruangan

	getDataModulDanRuangan() {
		this.httpService.get(Configuration.get().dataMasterNew + '/loginuser/findAllAkses').subscribe((result) => {
			this.listDataModul = result.dataModulAplikasi;
			// this.listDataRuangan = result.dataRuangan;
		});
	}

	pilihJenisDokumen(kdjenisDokumen) {
		this.httpService
			.get(
				Configuration.get().dataMasterNew +
				'/loginuserconfigss/findAllDokumen?&dir=tglHistori&sort=desc&kdJenisDokumen=' +
				this.kdjenisDokumen
			)
			.subscribe((result) => {
				console.log(result);
				result.data.forEach((data) => {
					data.urlImg = Configuration.get().resourceFile + '/image/show/' + data.fileSSImagePathFile;
				});
				this.listDataDokumen = result.data;
			});
	}

	// pilihModulAplikasi() {
	// 	this.dataChild = [];
	// 	if (this.dataAplikasi.length == 0) {
	// 		for (var i = 0; i < this.selectedFiles2.length; ++i) {
	// 			if (this.selectedFiles2[i].parent != undefined) {
	// 				this.dataChild.push({ label: this.selectedFiles2[i].label, data: this.selectedFiles2[i].data });
	// 				this.idModulAplikasi = this.selectedFiles2[i].data.kdModulAplikasi;
	// 				for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
	// 					for (var k = 0; k < this.selectedFiles2[i].parent.children.length; ++k) {
	// 						if (
	// 							this.selectedFiles2[i].parent.children[k].data.kdRuangan.indexOf(
	// 								this.selectedFiles2[i].data.kdRuangan
	// 							) != -1
	// 						) {
	// 							let children = this.dataModulAplikasi[j].children;
	// 							this.dataModulAplikasi[j].children = children.filter(
	// 								(val) => val.data.kdRuangan !== this.selectedFiles2[i].data.kdRuangan
	// 							);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 		let children = this.dataChild.map((val) => val.data.kdModulAplikasi);
	// 		let selected = this.dataModulAplikasi.filter((val) => children.indexOf(val.data.kdModulAplikasi) != -1);
	// 		for (var i = 0; i < selected.length; ++i) {
	// 			this.dataAplikasi.push({ label: selected[i].label, data: selected[i].data, children: [] });
	// 		}

	// 		for (var k = 0; k < this.dataAplikasi.length; ++k) {
	// 			for (var i = 0; i < this.dataChild.length; ++i) {
	// 				if (this.dataChild[i].data.kdModulAplikasi == this.dataAplikasi[k].data.kdModulAplikasi) {
	// 					this.dataAplikasi[k].children.push(this.dataChild[i]);
	// 				}
	// 			}
	// 		}
	// 		for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
	// 			if (this.dataModulAplikasi[j].children.length == 0) {
	// 				this.dataModulAplikasi = this.dataModulAplikasi.filter(
	// 					(val) => val.data.kdModulAplikasi !== this.idModulAplikasi
	// 				);
	// 			}
	// 		}
	// 		this.dataChild = [];
	// 	} else {
	// 		// console.log(this.selectedFiles2);
	// 		for (var i = 0; i < this.selectedFiles2.length; ++i) {
	// 			if (this.selectedFiles2[i].parent != undefined) {
	// 				this.dataChild.push({
	// 					label: this.selectedFiles2[i].label,
	// 					data: {
	// 						kdModulAplikasi: this.selectedFiles2[i].data.kdModulAplikasi,
	// 						kdRuangan: this.selectedFiles2[i].data.kdRuangan,
	// 						namaRuangan: this.selectedFiles2[i].data.namaRuangan
	// 					},
	// 					parent: undefined
	// 				});
	// 				this.idModulAplikasi = this.selectedFiles2[i].data.kdModulAplikasi;
	// 				for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
	// 					for (var k = 0; k < this.selectedFiles2[i].parent.children.length; ++k) {
	// 						if (
	// 							this.selectedFiles2[i].parent.children[k].data.kdRuangan.indexOf(
	// 								this.selectedFiles2[i].data.kdRuangan
	// 							) != -1
	// 						) {
	// 							let children = this.dataModulAplikasi[j].children;
	// 							this.dataModulAplikasi[j].children = children.filter(
	// 								(val) => val.data.kdRuangan !== this.selectedFiles2[i].data.kdRuangan
	// 							);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 		// console.log(this.dataChild);
	// 		for (var k = 0; k < this.dataAplikasi.length; ++k) {
	// 			for (var j = 0; j < this.dataChild.length; ++j) {
	// 				if (this.dataAplikasi[k].data.kdModulAplikasi == this.dataChild[j].data.kdModulAplikasi) {
	// 					this.dataAplikasi[k].children.push(this.dataChild[j]);
	// 				} else {
	// 					let children = this.dataChild.map((val) => val.data.kdModulAplikasi);
	// 					let selected = this.dataModulAplikasi.filter(
	// 						(val) => children.indexOf(val.data.kdModulAplikasi) != -1
	// 					);
	// 					let datAp = this.dataAplikasi.filter((val) => children.indexOf(val.data.kdModulAplikasi) != -1);
	// 					if (datAp.length == 0) {
	// 						for (var l = 0; l < selected.length; ++l) {
	// 							this.dataAplikasi.push({
	// 								label: selected[l].label,
	// 								data: selected[l].data,
	// 								children: []
	// 							});
	// 						}
	// 						if (this.dataChild[j].data.kdModulAplikasi == this.dataAplikasi[k].data.kdModulAplikasi) {
	// 							this.dataAplikasi[k].children.push(this.dataChild[j]);
	// 						}
	// 					} else {
	// 						if (this.dataChild[j].data.kdModulAplikasi == this.dataAplikasi[k].data.kdModulAplikasi) {
	// 							this.dataAplikasi[k].children.push(this.dataChild[j]);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 		//console.log(mod);
	// 		for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
	// 			if (this.dataModulAplikasi[j].children.length == 0) {
	// 				this.dataModulAplikasi = this.dataModulAplikasi.filter(
	// 					(val) => val.data.kdModulAplikasi !== this.idModulAplikasi
	// 				);
	// 			}
	// 		}

	// 		this.dataChild = [];
	// 	}
	// 	this.selectedFiles2 = [];
	// 	this.selectedFiles3 = [];
	// 	this.selectedFiles2 = null;
	// 	this.selectedFiles3 = null;
	// 	this.dataAplikasi.forEach((node) => {
	// 		this.expandRecursive(node, true);
	// 	});
	// 	this.dataChild = [];
	// 	this.dataChild = null;
	// }
	// pilihAplikasi() {
	// 	this.children = [];
	// 	// console.log(this.selectedFiles3);
	// 	for (var i = 0; i < this.selectedFiles3.length; ++i) {
	// 		if (this.selectedFiles3[i].parent != undefined) {
	// 			this.children.push({
	// 				label: this.selectedFiles3[i].label,
	// 				data: {
	// 					kdModulAplikasi: this.selectedFiles3[i].data.kdModulAplikasi,
	// 					kdRuangan: this.selectedFiles3[i].data.kdRuangan,
	// 					namaRuangan: this.selectedFiles3[i].data.namaRuangan
	// 				},
	// 				parent: undefined
	// 			});
	// 			this.idModulAplikasi = this.selectedFiles3[i].data.kdModulAplikasi;
	// 			for (var j = 0; j < this.dataAplikasi.length; ++j) {
	// 				for (var k = 0; k < this.selectedFiles3[i].parent.children.length; ++k) {
	// 					if (
	// 						this.selectedFiles3[i].parent.children[k].data.kdRuangan.indexOf(
	// 							this.selectedFiles3[i].data.kdRuangan
	// 						) != -1
	// 					) {
	// 						let children = this.dataAplikasi[j].children;
	// 						this.dataAplikasi[j].children = children.filter(
	// 							(val) => val.data.kdRuangan !== this.selectedFiles3[i].data.kdRuangan
	// 						);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 	for (var i = 0; i < this.dataModulAplikasi.length; ++i) {
	// 		for (var j = 0; j < this.children.length; ++j) {
	// 			if (this.dataModulAplikasi[i].data.kdModulAplikasi == this.children[j].data.kdModulAplikasi) {
	// 				this.dataModulAplikasi[i].children.push(this.children[j]);
	// 			} else {
	// 				let children = this.children.map((val) => val.data.kdModulAplikasi);
	// 				let selected = this.dataAplikasi.filter((val) => children.indexOf(val.data.kdModulAplikasi) != -1);
	// 				let datAp = this.dataModulAplikasi.filter(
	// 					(val) => children.indexOf(val.data.kdModulAplikasi) != -1
	// 				);
	// 				if (datAp.length == 0) {
	// 					for (var l = 0; l < selected.length; ++l) {
	// 						this.dataModulAplikasi.push({
	// 							label: selected[l].label,
	// 							data: selected[l].data,
	// 							children: []
	// 						});
	// 					}
	// 					if (this.children[j].data.kdModulAplikasi == this.dataModulAplikasi[i].data.kdModulAplikasi) {
	// 						this.dataModulAplikasi[i].children.push(this.children[j]);
	// 					}
	// 				} else {
	// 					if (this.children[j].data.kdModulAplikasi == this.dataModulAplikasi[i].data.kdModulAplikasi) {
	// 						this.dataModulAplikasi[i].children.push(this.children[j]);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 	for (var j = 0; j < this.dataAplikasi.length; ++j) {
	// 		if (this.dataAplikasi[j].children.length == 0) {
	// 			this.dataAplikasi = this.dataAplikasi.filter(
	// 				(val) => val.data.kdModulAplikasi !== this.idModulAplikasi
	// 			);
	// 		}
	// 	}
	// 	this.selectedFiles2 = [];
	// 	this.selectedFiles3 = [];
	// 	this.selectedFiles2 = null;
	// 	this.selectedFiles2 = null;
	// }

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach((field) => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}
	// cekUser() {
	// 	let regx = /[^0-9]/;
	// 	let str = this.formUser.get('namaUserMobile').value;
	// 	str = str.replace(regx, '');
	// 	this.formUser.get('namaUserMobile').setValue(str);
	// 	if (this.formUser.get('namaUserMobile').value == null || this.formUser.get('namaUserMobile').value == '') {
	// 		this.alertService.warn('Peringatan', 'Masukan User');
	// 	} else if (this.namaUserMobile != this.formUser.get('namaUserMobile').value) {
	// 		if (this.formUser.get('namaUserMobile').value.length >= 10) {
	// 			this.httpService
	// 				.get(
	// 					Configuration.get().dataMasterNew +
	// 					'/loginuser/cekMobile?mobile=' +
	// 					this.formUser.get('namaUserMobile').value
	// 				)
	// 				.subscribe((response) => {
	// 					if (response.message == 'Tersedia') {
	// 						//this.alertService.success('Status','User Tersedia');
	// 						this.dataTersedia = true;
	// 						this.dataTidakTersedia = false;
	// 						this.responseMobile = response.message;
	// 					} else if (response.message == 'Tidak Tersedia') {
	// 						//this.alertService.success('Status', 'User Tidak Tersedia');
	// 						this.dataTidakTersedia = true;
	// 						this.dataTersedia = false;
	// 						this.responseMobile = response.message;
	// 					}
	// 				});
	// 		} else {
	// 			this.dataTidakTersedia = true;
	// 			this.dataTersedia = false;
	// 			this.responseMobile = 'Data Tidak Valid';
	// 		}
	// 	} else {
	// 		this.dataEmailTidakTersedia = false;
	// 		this.dataEmailTersedia = false;
	// 	}
	// }
	// cekUserEmail() {
	// 	let regx = /[^a-zA-Z0-9-.@_]/;
	// 	let str = this.formUser.get('namaUserEmail').value;
	// 	str = str.replace(regx, '');
	// 	this.formUser.get('namaUserEmail').setValue(str);
	// 	if (this.formUser.get('namaUserEmail').value == null || this.formUser.get('namaUserEmail').value == '') {
	// 		this.alertService.warn('Peringatan', 'Masukan Email');
	// 	} else if (this.namaUserEmail != this.formUser.get('namaUserEmail').value) {
	// 		let arr1 = str.split('@');
	// 		if (arr1.length >= 2) {
	// 			let arr3 = arr1[1].split('.');
	// 			if (arr3.length >= 2) {
	// 				if (arr3[1].length >= 1) {
	// 					this.httpService
	// 						.get(
	// 							Configuration.get().dataMasterNew +
	// 							'/loginuser/cekEmail?email=' +
	// 							this.formUser.get('namaUserEmail').value
	// 						)
	// 						.subscribe((response) => {
	// 							if (response.message == 'Tersedia') {
	// 								// this.alertService.success('Status', 'Email Tersedia');
	// 								this.dataEmailTersedia = true;
	// 								this.dataEmailTidakTersedia = false;
	// 								this.responseEmail = response.message;
	// 							} else if (response.message == 'Tidak Tersedia') {
	// 								//this.alertService.success('Status', 'Email Tidak Tersedia');
	// 								this.dataEmailTidakTersedia = true;
	// 								this.dataEmailTersedia = false;
	// 								this.responseEmail = response.message;
	// 							}
	// 						});
	// 				}
	// 			} else {
	// 				this.dataEmailTidakTersedia = true;
	// 				this.dataEmailTersedia = false;
	// 				this.responseEmail = 'Format Tidak Valid';
	// 			}
	// 		} else {
	// 			this.dataEmailTidakTersedia = true;
	// 			this.dataEmailTersedia = false;
	// 			this.responseEmail = 'Format Tidak Valid';
	// 		}
	// 	} else {
	// 		this.dataEmailTidakTersedia = false;
	// 		this.dataEmailTersedia = false;
	// 	}
	// }
	// private expandRecursive(node: TreeNode, isExpand: boolean) {
	// 	node.expanded = isExpand;
	// 	if (node.children) {
	// 		node.children.forEach((childNode) => {
	// 			this.expandRecursive(childNode, isExpand);
	// 		});
	// 	}
	// }

	hapusSlide(data) {
		console.log(data.fileSSImagePathFile);
		let index = this.slide_show
			.map(function (e) {
				return e.kode.noUrut;
			})
			.indexOf(data.kode.noUrut);
		if (index != -1) {
			let slide_show = [...this.slide_show];
			slide_show.splice(index, 1);
			this.slide_show = slide_show;
			if (this.slide_show.length == 0) {
				//console.log("Belum Bisa Menambahkan Slide !");
				this.hasilCek = false;
				this.isValid3 = true;
				this.formSlide.get('noUrutSS').setValue(1);
				this.nmrUrutSlide = 1;
			}
		}
	}
	fileUpload1(event) {
		let getVideo = <HTMLVideoElement>document.getElementById("playVideo");
		let getSource = document.getElementById("sourceVideo");
		let formatFile = event.files[0].type;
		formatFile = formatFile.substring(0, 5);
		this.namaFoto1 = event.xhr.response;

		if (formatFile == 'image') {
			this.paramThumbnailVideo = null;
			this.paramThumbnailImage = 1;
			this.smbrFoto1 = Configuration.get().resourceFile + '/image/show/' + this.namaFoto1;

		} else if (formatFile == 'video') {
			this.paramThumbnailImage = null;
			this.paramThumbnailVideo = 1;
			this.smbrFoto1 = Configuration.get().resourceFile + '/video/show/' + this.namaFoto1;
		}
		console.log(this.namaFoto1);

		this.isValid = true;
		this.hasilCek = true;

		// var geturl = vid.id;
		getSource.setAttribute("src", this.namaFoto1);
		getVideo.load()
		getVideo.play()
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}
	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload?noProfile=false';

	}
	tambahSlide() {
		let a = this.formSlide.get('noUrutSS').value
		let kode;
		let Convert;
		let slide_show = [...this.slide_show];
		let paramNoUrut: boolean = true;
		for (let i = 0; i < slide_show.length; i++) {
			console.log(slide_show[i].kode.noUrut);
			if (slide_show[i].kode.noUrut == a) {
				paramNoUrut = false;
			}
		}


		if (this.namaFoto1 == '' || this.namaFoto1 == null) {
			if (paramNoUrut) {
				this.isValid = false;

				// let slide_show = [];
				// console.log(this.selectedDokumen.fileSSImagePathFile);
				// console.log(this.selectedDokumen.namaDokumen);
				//Bikin Tampung
				kode = {
					kdModulAplikasi: null,
					kdProfile: null,
					kdUser: null,
					noUrut: a
				};
				Convert = {
					fileSSImage: null,
					fileSSImagePathFile: this.selectedDokumen.fileSSImagePathFile,
					kode: kode,
					namaModulAplikasi: null,
					noHistori: this.selectedDokumen.noHistori,
					noPlanning: null,
					noPosting: null,
					noRec: null,
					statusEnabled: true,
					tglAkhir: this.selectedDokumen.tglAkhir,
					tglAwal: this.selectedDokumen.tglAwal,
					tglHistori: this.selectedDokumen.tglHistori,
					urlImg: this.selectedDokumen.urlImg,
					version: null,
					format: 'image'
					//unikVar:this.slide_show.length + 1
				};

				slide_show.push(Convert);
				this.slide_show = slide_show;
				// this.formNew.get('fileSSImageVideoPathFile').setValue(Convert.fileSSImagePathFile)
				// this.slide_show.push(Convert);

				this.formSlide.get('noUrutSS').setValue(this.formSlide.get('noUrutSS').value + 1)
				//setTimeout(()=>this.loadSlide(),100);
			} else {
				this.alertService.warn('Peringatan', 'Nomor Urut Telah Tersedia')
			}
		} else {

			console.log('Tambah Manual');
			let slide_show = [...this.slide_show];
			// let slide_show = [];
			//Bikin Tampung
			kode = {
				kdModulAplikasi: null,
				kdProfile: null,
				kdUser: null,
				noUrut: this.nmrUrutSlide
			};
			if (this.paramThumbnailImage != null) {
				Convert = {
					fileSSImage: null,
					fileSSImagePathFile: this.namaFoto1,
					kode: kode,
					namaModulAplikasi: null,
					noHistori: null,
					noPlanning: null,
					noPosting: null,
					noRec: null,
					statusEnabled: true,
					tglAkhir: null,
					tglAwal: null,
					tglHistori: null,
					urlImg: Configuration.get().resourceFile + '/image/show/' + this.namaFoto1,
					version: null,
					format: 'image'
					//unikVar:this.slide_show.length + 1
				};
			} else {
				Convert = {
					fileSSImage: null,
					fileSSImagePathFile: this.namaFoto1,
					kode: kode,
					namaModulAplikasi: null,
					noHistori: null,
					noPlanning: null,
					noPosting: null,
					noRec: null,
					statusEnabled: true,
					tglAkhir: null,
					tglAwal: null,
					tglHistori: null,
					urlImg: Configuration.get().resourceFile + '/video/show/' + this.namaFoto1,
					version: null,
					format: 'video'
					//unikVar:this.slide_show.length + 1
				};
			}
			slide_show.push(Convert);
			this.isValid3 = false;
			this.slide_show = slide_show;
			// this.formNew.get('fileSSImageVideoPathFile').setValue(Convert.fileSSImagePathFile)
			// this.slide_show.push(Convert);
			this.namaFoto1 = null;
			this.smbrFoto1 = null;
			this.paramThumbnailImage = null;
			this.paramThumbnailVideo = null;
		}



		// console.log(this.slide_show);
		this.nmrUrutSlide = this.nmrUrutSlide + 1;
	}

	isParentChecked(event, data, index, child) {
		var c = this.dataUnitKerja.map(function (e) { return e.statusEnabled; }).indexOf(true);
		if (c != -1) {
			for (let i = 0; i < this.listDataRuangan.length; i++) {
				this.listDataRuangan[i].statusEnabled = false;
			}
			this.dataUnitKerja = []
		}
	}

	getChecklistMdlAplikasi(event, data, index) {
		console.log(event)
		if (event == false) {
			this.dataMdlAplikasi.splice(event, 1);
		} else {
			this.dataMdlAplikasi.push(data)
		}
	}

	getChecklistUnitKerja(event, data, index, indexParent) {
		if (event == false) {
			var c = this.dataUnitKerja.map(function (e) { return e.statusEnabled; }).indexOf(true);
			if (c == -1) {
				this.listDataLokasi[indexParent].statusEnabled = false;
			}
			this.dataUnitKerja.splice(event, 1);
		} else {
			this.listDataLokasi[indexParent].statusEnabled = true;
			this.dataUnitKerja.push(data);
		}
	}
	simpanUser() {
		this.nmrUrutSlide = 1;
		this.hasilCek = false;
		// console.log(this.slide_show);
		// console.log(this.dataUnitKerja);
		// console.log(this.dataMdlAplikasi);

		// let tglAwal = Math.floor(this.setTimeStamp(this.formNew.get('tglBerlakuAwal').value))
		// let tglAkhir = Math.floor(this.setTimeStamp(this.formNew.get('tglBerlakuAkhir').value))
		let detik = parseInt(this.formNew.get('durasiLiveDetik').value)
		let dataTemp = {
			'imgDto': this.slide_show.map(res => {
				if (res.noHistori == null) {
					let img = {
						'durasiLiveDetik': detik,
						'fileSSImageVideo': null,
						'fileSSImageVideoPathFile': res.fileSSImagePathFile,
						'noHistori': res.noHistori,
						'noPlanning': null,
						'noPosting': null,
						'noUrut': res.kode.noUrut
					}
					return img
				} else if (res.noHistori != null) {
					let img = {
						'durasiLiveDetik': detik,
						'fileSSImageVideo': null,
						'fileSSImageVideoPathFile': null,
						'noHistori': res.noHistori,
						'noPlanning': null,
						'noPosting': null,
						'noUrut': res.kode.noUrut
					}
					return img
				}
			}),
			'kdModulAplikasi': this.dataMdlAplikasi.map(res => {
				let kdModul = {
					'kode': res.kode
				}
				return kdModul
			}),
			'kdProfile': this.kdProfile,
			'kdRuangan': this.dataUnitKerja.map(res => {
				let kdRuangan = {
					'kode': res.kdRuangan
				}
				return kdRuangan
			}),
			'tglBerlakuAwal': this.setTimeStamp(this.tanggalBerAwal),
			'tglBerlakuAkhir': this.setTimeStamp(this.tanggalBerAkhir)
		}
		console.log(JSON.stringify(this.slide_show));
		if (this.formNew.invalid) {
			this.validateAllFormFields(this.formNew);
			this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		}
		else {
			console.log(dataTemp);
			this.httpService
				.post(Configuration.get().dataMasterNew + '/profileconfigslideshow/save', dataTemp)
				.subscribe(response => {
					this.alertService.success('Berhasil', 'Data Konfigurasi Slideshow Berhasil Disimpan');
					// this.getListSlideShow();
					this.reset()
				});
		}

	}
	confirmUpdate() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.update();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}
	update() {
		// console.log(this.listDataModul);
		// console.log(this.listDataRuangan);
		// console.log(this.pilihan)
		if (
			this.formUser.get('namaUserMobile').value == this.namaMobile &&
			this.formUser.get('namaUserEmail').value == this.namaUser
		) {
			let dataSimpanModul = [];
			for (var i = 0; i < this.listDataModul.length; ++i) {
				for (var j = 0; j < this.listDataRuangan.length; ++j) {
					if (this.listDataRuangan[j].statusEnabled === true) {
						let dataIndukRuangan = {
							kdModulAplikasi: this.listDataModul[i].kode,
							kdRuangan: this.listDataRuangan[j].kdRuangan,
							kdUser: 0,
							noRec: 'string',
							statusEnabled: this.statusEnabled,
							version: 1
						};
						dataSimpanModul.push(dataIndukRuangan);
						for (var k = 0; k < this.listDataRuangan[j].child.length; ++k) {
							if (this.listDataRuangan[j].child[k].statusEnabled === true) {
								let dataAnak = {
									kdModulAplikasi: this.listDataModul[i].kode,
									kdRuangan: this.listDataRuangan[j].child[k].kdRuangan,
									kdUser: 0,
									noRec: 'string',
									statusEnabled: this.statusEnabled,
									version: 1
								};
								dataSimpanModul.push(dataAnak);
							}
						}
					}
				}
			}
			//console.log(dataSimpanModul);

			let dataSimpan = {
				alamatLengkap: this.formPegawai.get('alamatLengkap').value,
				hintKataSandi: this.formUser.get('hintKataSandi').value,
				imageUser: this.namaPhoto,
				namaJenisKelamin: this.form.get('namaJenisKelamin').value,
				kataSandi: this.formUser.get('kataSandi').value,
				kdKelompokUser: this.formUser.get('kdKelompok').value,
				kdPegawai: this.form.get('kdPegawai').value,
				kodeUser: this.kdUser,
				namaLengkap: this.form.get('namaLengkap').value,
				namaUserEmail: this.formUser.get('namaUserEmail').value,
				namaUserMobile: this.formUser.get('namaUserMobile').value,
				noIdentitas: 'string',
				pathFileImageUser: this.namaPhoto,
				statusEnabled: this.statusEnabled,
				tglDaftar: this.setTimeStamp(this.formUser.get('tglSekarang').value),
				tglLahir: this.setTimeStamp(this.form.get('tanggalLahir').value),
				version: this.version,
				noCM: 0,
				mapLoginUserToProfileDto: dataSimpanModul
			};

			if (dataSimpan.mapLoginUserToProfileDto.length == 0) {
				this.alertService.warn('Peringatan', 'Pilih Modul Aplikasi dan Unit Kerja');
			} else {
				this.httpService
					.update(Configuration.get().dataMasterNew + '/loginuser/update/' + this.version, dataSimpan)
					.subscribe((response) => {
						this.alertService.success('Berhasil', 'Data Login User Berhasil Diperbarui');
						this.batalUser();
						this.ngOnInit();
						// this.alertService.warn('Peringatan', 'Silahkan Pilih Modul Aplikasi');
						// this.index = 2;
						//console.log(response);
					});
			}
		} else {
			// this.cekUser();
			// this.cekUserEmail();
			if (this.dataEmailTidakTersedia == true) {
				this.alertService.warn('Peringatan', 'Data User email tidak valid');
			} else if (this.dataTidakTersedia == true) {
				this.alertService.warn('Peringatan', 'Data mobile tidak valid');
			} else {
				let dataSimpanModul = [];
				for (var i = 0; i < this.listDataModul.length; ++i) {
					for (var j = 0; j < this.listDataRuangan.length; ++j) {
						if (this.listDataRuangan[j].statusEnabled === true) {
							let dataIndukRuangan = {
								kdModulAplikasi: this.listDataModul[i].kode,
								kdRuangan: this.listDataRuangan[j].kdRuangan,
								kdUser: 0,
								noRec: 'string',
								statusEnabled: this.statusEnabled,
								version: 1
							};
							dataSimpanModul.push(dataIndukRuangan);
							for (var k = 0; k < this.listDataRuangan[j].child.length; ++k) {
								if (this.listDataRuangan[j].child[k].statusEnabled === true) {
									let dataAnak = {
										kdModulAplikasi: this.listDataModul[i].kode,
										kdRuangan: this.listDataRuangan[j].child[k].kdRuangan,
										kdUser: 0,
										noRec: 'string',
										statusEnabled: this.statusEnabled,
										version: 1
									};
									dataSimpanModul.push(dataAnak);
								}
							}
						}
					}
				}

				let dataSimpan = {
					alamatLengkap: this.formPegawai.get('alamatLengkap').value,
					hintKataSandi: this.formUser.get('hintKataSandi').value,
					imageUser: this.namaPhoto,
					namaJenisKelamin: this.form.get('namaJenisKelamin').value,
					kataSandi: this.formUser.get('kataSandi').value,
					kdKelompokUser: this.formUser.get('kdKelompok').value,
					kdPegawai: this.form.get('kdPegawai').value,
					kodeUser: this.kdUser,
					namaLengkap: this.form.get('namaLengkap').value,
					namaUserEmail: this.formUser.get('namaUserEmail').value,
					namaUserMobile: this.formUser.get('namaUserMobile').value,
					noIdentitas: 'string',
					pathFileImageUser: this.namaPhoto,
					statusEnabled: this.statusEnabled,
					tglDaftar: this.setTimeStamp(this.formUser.get('tglSekarang').value),
					tglLahir: this.setTimeStamp(this.form.get('tanggalLahir').value),
					version: this.version,
					noCM: 0,
					mapLoginUserToProfileDto: dataSimpanModul
				};

				if (dataSimpan.mapLoginUserToProfileDto.length == 0) {
					this.alertService.warn('Peringatan', 'Pilih Modul Aplikasi dan Unit Kerja');
				} else {
					this.httpService
						.update(Configuration.get().dataMasterNew + '/loginuser/update/' + this.version, dataSimpan)
						.subscribe((response) => {
							this.alertService.success('Berhasil', 'Data Login User Berhasil Diperbarui');
							this.batalUser();
							this.ngOnInit();
							// this.alertService.warn('Peringatan', 'Silahkan Pilih Modul Aplikasi');
							// this.index = 2;
							//console.log(response);
						});
				}
			}
		}
	}
	confirmDelete() {
		if (this.kdUser == null) {
			this.alertService.warn('Peringatan', 'Pilih Data Pegawai');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusUser();
				},
				reject: () => {
					this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
				}
			});
		}
	}
	hapusUser() {
		this.httpService
			.delete(Configuration.get().dataMasterNew + '/loginuser/del/' + this.kdUser)
			.subscribe((response) => {
				this.alertService.success('Berhasil', 'Data Login User Berhasil Dihapus');
				this.batalUser();
				this.ngOnInit();
			});
	}
	batalUser() {
		this.selected = null;
		this.listData = [];
		this.pilihan = [];
		this.pilihanRuangan = [];
		this.dataTersedia = false;
		this.dataTidakTersedia = false;
		this.dataEmailTersedia = false;
		this.dataEmailTidakTersedia = false;
		this.index = 0;
		this.formUser.reset();
		this.form.reset();
		this.formPegawai.reset();
		this.namaPhoto = null;
		this.listDataRuangan = [];
		this.selectedUnit = [];
		this.selectedModul = [];
		this.ngOnInit();
	}
	batalUser2() {

	}
	simpan() {
		let dataSimpan = [];
		for (var i = 0; i < this.dataAplikasi.length; ++i) {
			for (var j = 0; j < this.dataAplikasi[i].children.length; ++j) {
				let data = {
					kdModulAplikasi: this.dataAplikasi[i].data.kdModulAplikasi,
					kdRuangan: this.dataAplikasi[i].children[j].data.kdRuangan,
					kdUser: this.kdUser,
					noRec: 'string',
					statusEnabled: true,
					version: 0
				};
				dataSimpan.push(data);
			}
		}
		//console.log(dataSimpan);
		this.httpService
			.post(Configuration.get().dataMasterNew + '/maploginusertoprofile/save', dataSimpan)
			.subscribe((result) => {
				this.alertService.success('Berhasil', 'Data Modul Aplikasi Berhasil Disimpan');
				this.batalUser();
			});
	}
	batalPilih() {
		for (var i = 0; i < this.dataAplikasi.length; ++i) {
			for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
				if (this.dataAplikasi[i].data.kdModulAplikasi == this.dataModulAplikasi[j].data.kdModulAplikasi) {
					for (var k = 0; k < this.dataAplikasi[i].children.length; ++k) {
						this.idRuangan = this.dataAplikasi[i].children[k].data.kdRuangan;
						let childModul = this.dataModulAplikasi[j].children;
						this.dataModulAplikasi[j].children = childModul.filter(
							(val) => val.data.kdRuangan !== this.idRuangan
						);
					}
				} else {
					for (var k = 0; k < this.dataAplikasi[i].children.length; ++k) {
						this.idRuangan = this.dataAplikasi[i].children[k].data.kdRuangan;
						let childModul = this.dataModulAplikasi[j].children;
						this.dataModulAplikasi[j].children = childModul.filter(
							(val) => val.data.kdRuangan !== this.idRuangan
						);
					}
				}
				if (this.dataModulAplikasi[j].children.length == 0) {
					this.dataModulAplikasi = this.dataModulAplikasi.filter(
						(val) => val.data.kdModulAplikasi !== this.dataAplikasi[i].data.kdModulAplikasi
					);
				}
			}
		}
	}
	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = new Date().getTime() / 1000;
			return dataTimeStamp
		} else {
			let dataTimeStamp = new Date(date).getTime() / 1000;
			return dataTimeStamp
		}
	}
	getPassword() {
		if (this.version != null) {
			this.formUser.get('kataSandi').setValue('');
		}
	}
	lostPassword() {
		if (this.formUser.get('kataSandi').value == null || this.formUser.get('kataSandi').value == '') {
			this.formUser.get('kataSandi').setValue('      ');
		}
	}
	userBaru() {
		this.index = 1;
	}
	editDataUser() {
		this.index = 1;
	}
	nodeSelect(event) {
		// this.expandRecursive(event.node, true);
	}
	nodeUnSelect(event) {
		// this.expandRecursive(event.node, false);
		this.selectedFiles2 = [];
		this.selectedFiles2 = null;
	}
	selectAll() {
		if (this.pilihSemua == true) {
			this.pilihan = [];
			let dataTemp = [];
			this.listDataModul.forEach(function (data) {
				dataTemp.push(String(data.kode));
			});
			this.pilihan = dataTemp;
			// console.log(JSON.stringify(this.pilihan))
		} else {
			this.pilihan = [];
		}
		// console.log(JSON.stringify(this.pilihan))
		// console.log(JSON.stringify(this.listData))
	}
	selectAllRuangan() {
		if (this.pilihSemuaRuangan == true) {
			this.pilihanRuangan = [];
			let dataTemp = [];
			this.listDataRuangan.forEach(function (data) {
				dataTemp.push(String(data.kdRuangan));
			});
			this.pilihanRuangan = dataTemp;
			// console.log(JSON.stringify(this.pilihan))
		} else {
			this.pilihanRuangan = [];
		}
		// console.log(JSON.stringify(this.pilihan))
		// console.log(JSON.stringify(this.listData))
	}

	onRowSelectModul(event) {
		//buat refresh unit kerja, trus buat isi ceklist modul aplikasi ini unit kerjanya apa aja
		console.log(event.type);
		if (event.type == 'checkbox') {
			this.selectedUnit = [];
		}
	}

	clickData(event) {
		//disini nanti untuk get / tampilin data dengan kdModulAplikasi ini unit kerjanya apa aja
		console.log(event.originalEvent.type);
		if (event.originalEvent.type == 'click') {
		}
	}

	// getUser2(kdPegawai) {
	// 	this.httpService
	// 		.get(Configuration.get().dataMasterNew + '/loginuser/findByKdPegawai/' + kdPegawai)
	// 		.subscribe((result) => {
	// 			console.log(result.LoginUser[0].kdUser);
	// 			if (result.LoginUser['0'].kdUser == null || result.LoginUser['0'].kdUser == '-') {
	// 				// this.listDataRuangan = [];
	// 				this.selectedModul = [];
	// 				this.selectedUnit = [];
	// 				//this.getDataModul();
	// 				this.getDataModulDanRuangan();
	// 				this.formUser.get('tglSekarang').setValue(this.tglSekarang);
	// 				this.statusEnabled = result.LoginUser['0'].dataUser.statusEnabled;
	// 				this.version = null;
	// 			} else {
	// 				this.dataPilihModul = this.dataAplikasi;
	// 				this.kdUser = result.LoginUser['0'].kdUser;
	// 				this.statusEnabled = result.LoginUser['0'].dataUser.statusEnabled;

	// 				this.httpService
	// 					.get(Configuration.get().dataMasterNew + '/loginuser/findAllAkses?kode=' + this.kdUser)
	// 					.subscribe((result) => {
	// 						this.selectedModul = [];
	// 						this.selectedUnit = [];
	// 						console.log(result.dataModulAplikasi);
	// 						console.log(result.dataRuangan);
	// 						this.listDataModul = result.dataModulAplikasi;
	// 						this.listDataRuangan = result.dataRuangan;
	// 					});

	// 				this.formUser.get('namaUserEmail').setValue(result.LoginUser[0].dataUser.namaUserEmail);
	// 				this.namaUser = result.LoginUser[0].dataUser.namaUserEmail;
	// 				this.namaMobile = result.LoginUser[0].dataUser.namaUserMobile;
	// 				this.formUser.get('namaUserMobile').setValue(result.LoginUser[0].dataUser.namaUserMobile);
	// 				// this.formUser.get('kataSandi').setValue(result.LoginUser[0].dataUser.kataSandi);
	// 				this.formUser.get('kataSandi').setValue('     ');
	// 				this.formUser.get('tglSekarang').setValue(new Date(result.LoginUser[0].dataUser.tglDaftar * 1000));
	// 				this.formUser.get('hintKataSandi').setValue(result.LoginUser[0].dataUser.hintKataSandi);
	// 				this.formUser.get('kdKelompok').setValue(result.LoginUser['0'].kelompokUser.id);
	// 				this.version = result.LoginUser['0'].dataUser.version;
	// 				this.namaUserEmail = result.LoginUser[0].dataUser.namaUserEmail;
	// 				this.namaUserMobile = result.LoginUser[0].dataUser.namaUserMobile;
	// 			}
	// 		});
	// }

	toggleCoba(rowData: any, dtEn: any) {
		dtEn.toggleRow(rowData);
	}

}
/*
class InisialLoginUserConfigSS implements LoginUserConfigSS {
	constructor(
		public noPosting?,
		public statusEnabled?,
		public noHistori?,
		public namaModulAplikasi?,
		public tglAkhir?,
		public kode?,
		public kdUser?,
		public kdProfile?,
		public kdModulAplikasi?,
		public noUrut?,
		public tglAwal?,
		public version?,
		public noRec?,
		public noPlanning?
	) {}
}
*/

class InisialDataPegawai implements DataPegawai {
	constructor(
		public namaLengkap?,
		public tglLahir?,
		public namaJenisKelamin?,
		public kdPegawai?,
		public tanggalLahir?
	) { }
}
