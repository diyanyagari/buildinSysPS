import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Rekanan, JenisRekanan } from './rekanan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-rekanan',
	templateUrl: './rekanan.component.html',
	styleUrls: ['./rekanan.component.scss'],
	providers: [ConfirmationService]
})
export class RekananComponent implements OnInit {
	item: Rekanan = new InisialRekanan();;
	selected: Rekanan;
	listDataRekanan: any[];
	listDataJenisRekanan: any[];
	dataDummy: {};
	JenisRekanan: Rekanan[];
	RekananHead: Rekanan[];
	kdAccount: Rekanan[];
	kodeUnitBagian: Rekanan[];
	versi: any;
	formJenisRekanan: FormGroup;
	formRekanan: FormGroup;
	page: number;
	rows: number;
	totalRecordsJenisRekanan: number;
	totalRecordsRekanan: number;
	pencarianRekanan: string;
	pencarianJenisRekanan: string;
	formAktif: boolean;
	display: any;
	display2: any;
	toReportJenisRekanan: any;
	reportJenisRekanan: any;
	photo: string;
	gambarLogo: any;
	photoFiles: any[] = [];
	photoUrl: string;
	smbrFoto: string;
	namaFoto: string = null;
	foto: any;
	listDataDetail: any[];

	codes: any[];
	codes2: any[];
	listData2: any[];
	listData3: any[];
	items: any;
	itemsJenis: any;
	listTab: any[];
	index: number = 0;
	tabIndex: number = 0;
	month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des' ];
	kdprof:any;
	kddept:any;
	laporan: boolean = false;
	itemsChild: any;
	kdJenisRek: any;
	smbrFile:any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService
		) { this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png"; }


	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		
		this.items = [
		{
			label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
				this.downloadPdf();
			}
		},
		{
			label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
				this.downloadExcel();
			}
		},

		];

		this.itemsChild = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					this.downloadPdfChild();
				}
			},
			{
				label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
					this.downloadExcelChild();
				}
			},
			];

		// this.itemsJenis = [
		// {
		// 	label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
		// 		this.downloadPdfJenis();
		// 	}
		// },
		// {
		// 	label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
		// 		this.downloadExcelJenis();
		// 	}
		// },

		// ];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.formAktif = true;
		this.listDataDetail = [];
		this.formAktif = true;
		this.versi = null;
		this.formJenisRekanan = this.fb.group({
			'kode': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaJenisRekanan': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true, Validators.required),

		});

		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisRekanan&select=namaJenisRekanan,id').subscribe(res => {
			this.JenisRekanan = [];
			this.JenisRekanan.push({ label: '--Pilih Jenis Rekanan--', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.JenisRekanan.push({ label: res.data.data[i].namaJenisRekanan, value: res.data.data[i].id.kode })
			};
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Rekanan&select=namaRekanan,id').subscribe(res => {
			this.RekananHead = [];
			this.RekananHead.push({ label: '--Pilih Data Parent Rekanan--', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.RekananHead.push({ label: res.data.data[i].namaRekanan, value: res.data.data[i].id.kode })
			};
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ChartOfAccount&select=namaAccount,id').subscribe(res => {
			this.kdAccount = [];
			this.kdAccount.push({ label: '--Pilih Kode Akuntansi--', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kdAccount.push({ label: res.data.data[i].namaAccount, value: res.data.data[i].id.kode })
			};
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=UnitBagian&select=namaUnitBagian,id').subscribe(res => {
			this.kodeUnitBagian = [];
			this.kodeUnitBagian.push({ label: '--Pilih Unit Bagian--', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kodeUnitBagian.push({ label: res.data.data[i].namaUnitBagian, value: res.data.data[i] })
			};
		});
		if (this.index == 0){
			this.httpService.get(Configuration.get().dataMasterNew + '/jenisrekanan/findAll?page=1&rows=300&dir=namaJenisRekanan&sort=desc').subscribe(table => {
				this.listTab = table.JenisRekanan;
				let i = this.listTab.length
				while (i--) {
					if (this.listTab[i].statusEnabled == false) { 
						this.listTab.splice(i, 1);
					} 
				}
			});
		};
		let dataIndex = {
			"index": this.index
		}
		this.onTabChange(dataIndex);
		this.getSmbrFile();
	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	onTabChange(event) {
		this.formAktif = true;
		this.formRekanan = this.fb.group({
			'tglDaftar': new FormControl('', Validators.required),
			'contactPerson': new FormControl(''),
			'kdRekananHead': new FormControl(null),
			'kdAccount': new FormControl(null),
			'kdJenisRekanan': new FormControl(null, Validators.required),
			'noPKP': new FormControl(''),
			'kode': new FormControl(''),
			'npwp': new FormControl(''),
			'namaRekanan': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(false, Validators.required),
			'ambilFoto': new FormControl(''),
			"gambarLogo": new FormControl(''),
		});
		this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
		let data;
		this.index = event.index;
		if (event.index > 0){
			let index = event.index-1;
			data = this.listTab[index].kode.kode;
			this.formRekanan.get('kdJenisRekanan').setValue(data);
			this.pencarianRekanan = '';
			this.getRekanan(this.page,this.rows,this.pencarianRekanan, data);
			this.kdJenisRek = data;
		} else {
			this.pencarianJenisRekanan = '';
			this.formRekanan.get('kdJenisRekanan').setValue(null);
			this.getJenisRekanan(this.page,this.rows,this.pencarianJenisRekanan);
		}
		this.valuechangeJenisRekanan('');
		this.valuechange('');
	}

	getRekanan(page: number, rows: number, search: any, head: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/rekanan/findAll?page='+page+'&rows='+rows+'&dir=namaRekanan&sort=desc&namaRekanan='+search+'&kdJenisRekanan='+head).subscribe(table => {
			this.listDataRekanan = table.Rekanan;
			this.totalRecordsRekanan = table.totalRow;
		});
	}
	getJenisRekanan(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisrekanan/findAll?page='+page+'&rows='+rows+'&dir=namaJenisRekanan&sort=desc&namaJenisRekanan='+search).subscribe(table => {
			this.listDataJenisRekanan = table.JenisRekanan;
			this.totalRecordsJenisRekanan = table.totalRow;

		});
	}
	cariRekanan() {
		let data = this.formRekanan.get('kdJenisRekanan').value;
		this.getRekanan(this.page,this.rows,this.pencarianRekanan, data);
	}
	cariJenisRekanan() {
		this.getJenisRekanan(this.page,this.rows,this.pencarianJenisRekanan);
	}

	loadPageRekanan(event: LazyLoadEvent) {
		let data = this.formRekanan.get('kdJenisRekanan').value;
		this.getRekanan((event.rows + event.first) / event.rows, event.rows, this.pencarianRekanan, data);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}
	loadPageJenisRekanan(event: LazyLoadEvent) {
		this.getJenisRekanan((event.rows + event.first) / event.rows, event.rows, this.pencarianJenisRekanan);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	valuechangeJenisRekanan(newvalue) {
		this.toReportJenisRekanan = newvalue;
		this.reportJenisRekanan = newvalue;
	}
	
	valuechange(newvalue) {
		this.display = newvalue;
		this.display2 = newvalue;
	}
	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload';
	}
	fotoUpload(namaBaru) {
		this.foto = namaBaru;
		// console.log(namaBaru);
		//this.photoDiri = this.foto.toString();
		this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.foto;
		// console.log(this.smbrFoto);
	}
	fileUpload(event) {
		//console.log(event.xhr.response);
		this.namaFoto = event.xhr.response;
		//this.photoDiri = this.foto.toString();
		this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.namaFoto;
		//console.log(this.smbrFoto);
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}

	tambahDetail() {
		let dataTemp = {
			"unitBagian": {
				"kdunitBagian": "",
				"namaUnitBagian": "--Pilih Unit Bagian--",
			},
			"fixedPhone": "",
			"mobilePhone": "",
			"faksimile": "",
			"alamatEmail": "",
			"keteranganLainnya": "",

			"no": null,

		}
		let listDataDetail = [...this.listDataDetail];
		listDataDetail.push(dataTemp);
		this.listDataDetail = listDataDetail;
	}
	hapusRow(row) {
		let listDataDetail = [...this.listDataDetail];
		listDataDetail.splice(row, 1);
		this.listDataDetail = listDataDetail;
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	onSubmitRekanan() {
		if (this.formRekanan.invalid) {
			this.validateAllFormFields(this.formRekanan);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanRekanan();
		}
	}
	onSubmitJenisRekanan() {
		if (this.formJenisRekanan.invalid) {
			this.validateAllFormFields(this.formJenisRekanan);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanJenisRekanan();
		}
	}
	confirmDeleteRekanan() {
		let kode = this.formRekanan.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Rekanan');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusRekanan();
				},
				reject: () => {
					this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
				}
			});
		}
	}
	confirmDeleteJenisRekanan() {
		let kode = this.formJenisRekanan.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Jenis Rekanan');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusJenisRekanan();
				},
				reject: () => {
					this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
				}
			});
		}
	}
	confirmUpdateRekanan() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updateRekanan();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}
	confirmUpdateJenisRekanan() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updateJenisRekanan();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}

	updateRekanan() {
		let dataTemp = [];
		for (let i = 0; i < this.listDataDetail.length; i++) {

			if (this.listDataDetail[i].unitBagian === undefined || this.listDataDetail[i].unitBagian === null) {
				this.alertService.warn('Peringatan', 'Unit Bagian harus dipilih');
				return;
			}

			dataTemp.push({
				"kdUnitBagian": this.listDataDetail[i].unitBagian.id.kode,
				"mobilePhone": this.listDataDetail[i].mobilePhone,
				"keteranganLainnya": this.listDataDetail[i].keteranganLainnya,
				"fixedPhone": this.listDataDetail[i].fixedPhone,
				"faksimile": this.listDataDetail[i].faksimile,
				"alamatEmail": this.listDataDetail[i].alamatEmail,

			})
		}

		let fixHub = {
			"rekananDetailDto": dataTemp,
			"kode": this.formRekanan.get('kode').value,
			"kdRekananHead": this.formRekanan.get('kdRekananHead').value,
			"namaRekanan": this.formRekanan.get('namaRekanan').value,
			"kdJenisRekanan": this.formRekanan.get('kdJenisRekanan').value,
			"tglDaftar": this.setTimeStamp(this.formRekanan.get('tglDaftar').value),
			"noPKP": this.formRekanan.get('noPKP').value,
			"npwp": this.formRekanan.get('npwp').value,
			"contactPerson": this.formRekanan.get('contactPerson').value,
			"kdAccount": this.formRekanan.get('kdAccount').value,
			"gambarLogo": this.formRekanan.get('gambarLogo').value,
			"namaExternal": this.formRekanan.get('namaExternal').value,
			"kodeExternal": this.formRekanan.get('kodeExternal').value,
			"statusEnabled": this.formRekanan.get('statusEnabled').value,
			"reportDisplay": this.formRekanan.get('reportDisplay').value,



		}
		this.httpService.update(Configuration.get().dataMasterNew + '/rekanan/update/' + this.versi, fixHub).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.resetRekanan();
		});
	}
	updateJenisRekanan() {
		this.httpService.update(Configuration.get().dataMasterNew + '/jenisrekanan/update/' + this.versi, this.formJenisRekanan.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.resetJenisRekanan();
		});
	}
	simpanRekanan() {
		if (this.formAktif == false) {
			this.confirmUpdateRekanan()
		} /*else if (this.listDataDetail.length == 0 || this.listDataDetail.length == null) {
			this.alertService.warn('Peringatan', 'Detail Kosong')
		}*/ else {
			let dataTemp = [];
			for (let i = 0; i < this.listDataDetail.length; i++) {

				if (this.listDataDetail[i].unitBagian === undefined || this.listDataDetail[i].unitBagian === null) {
					this.alertService.warn('Peringatan', 'Unit Bagian harus dipilih');
					return;
				}

				dataTemp.push({
					"kdUnitBagian": this.listDataDetail[i].unitBagian.id.kode,
					"mobilePhone": this.listDataDetail[i].mobilePhone,
					"keteranganLainnya": this.listDataDetail[i].keteranganLainnya,
					"fixedPhone": this.listDataDetail[i].fixedPhone,
					"faksimile": this.listDataDetail[i].faksimile,
					"alamatEmail" : this.listDataDetail[i].alamatEmail,

				})
			}

			let fixHub = {
				"rekananDetailDto": dataTemp,
				"kode": this.formRekanan.get('kode').value,
				"kdRekananHead": this.formRekanan.get('kdRekananHead').value,
				"namaRekanan": this.formRekanan.get('namaRekanan').value,
				"kdJenisRekanan": this.formRekanan.get('kdJenisRekanan').value,
				"tglDaftar": this.setTimeStamp(this.formRekanan.get('tglDaftar').value),
				"noPKP": this.formRekanan.get('noPKP').value,
				"npwp": this.formRekanan.get('npwp').value,
				"contactPerson": this.formRekanan.get('contactPerson').value,
				"kdAccount": this.formRekanan.get('kdAccount').value,
				"gambarLogo": this.formRekanan.get('gambarLogo').value,
				"namaExternal": this.formRekanan.get('namaExternal').value,
				"kodeExternal": this.formRekanan.get('kodeExternal').value,
				"statusEnabled": this.formRekanan.get('statusEnabled').value,
				"reportDisplay": this.formRekanan.get('reportDisplay').value,



			}


			this.httpService.post(Configuration.get().dataMasterNew + '/rekanan/save?', fixHub).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.resetRekanan();
			});
		}

	}
	simpanJenisRekanan() {
		if (this.formAktif == false) {
			this.confirmUpdateJenisRekanan()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/jenisrekanan/save?', this.formJenisRekanan.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.resetJenisRekanan();
			});
		}

	}

	// setTimeStamp(date) {
	// 	let dataTimeStamp = (new Date(date).getTime() / 1000);
	// 	return dataTimeStamp;
	// }
	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}
	}
	getDetail(dataPeg) {
		let struktur = dataPeg.data.RekananDetail;
		this.listDataDetail = [];

		let dataFix
		for (let i = 0; i < struktur.length; i++) {
			dataFix =
			{
				"unitBagian": {
					"id": { "kode": struktur[i].kdUnitBagian },
					"namaUnitBagian": struktur[i].namaUnitBagian,
					"kdUnitBagian": struktur[i].kdUnitBagian,
				},
				"fixedPhone": struktur[i].fixedPhone,
				"mobilePhone": struktur[i].mobilePhone,
				"faksimile": struktur[i].faksimile,
				"alamatEmail": struktur[i].alamatEmail,
				"keteranganLainnya": struktur[i].keteranganLainnya,
			}
			this.listDataDetail.push(dataFix);
		}
	}
	resetRekanan() {
		this.formAktif = true;
		this.ngOnInit();
		this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
	}
	
	onRowSelectJenisRekanan(event) {
		let cloned = this.cloneJenisRekanan(event.data);
		this.formAktif = false;
		this.formJenisRekanan.setValue(cloned);

	}
	cloneJenisRekanan(cloned: JenisRekanan): JenisRekanan {
		let hub = new InisialJenisRekanan();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialJenisRekanan();
		fixHub = {
			"kode": hub.kode.kode,
			"kodeExternal": hub.kodeExternal,
			"namaExternal": hub.namaExternal,
			"namaJenisRekanan": hub.namaJenisRekanan,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,

		}
		this.versi = hub.version;
		return fixHub;
	}
	resetJenisRekanan() {
		this.formAktif = true;
		this.ngOnInit();
		
	}
	onRowSelectRekanan(event) {
		let cloned = this.cloneRekanan(event.data);
		this.formAktif = false;
		this.formRekanan.setValue(cloned);
		this.getDetail(event);

	}
	cloneRekanan(cloned: Rekanan): Rekanan {
		let hub = new InisialRekanan();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}

		let logo 
		if (hub.gambarLogo == "" || hub.gambarLogo == null){
			logo = "profile1213123.png"
		}
		else{
			logo = hub.gambarLogo
		}
		let fixHub = new InisialRekanan();
		if (hub.tglDaftar == null || hub.tglDaftar == 0) {
			fixHub = {
				"contactPerson": hub.contactPerson,
				"kdAccount": hub.kdAccount,
				"kdJenisRekanan": hub.kdJenisRekanan,
				"kdRekananHead": hub.kdRekananHead,
				"noPKP": hub.noPKP,
				"npwp": hub.nPWP,
				"kode": hub.kode.kode,
				"kodeExternal": hub.kodeExternal,
				"tglDaftar": null,
				"gambarLogo": logo,
				"ambilFoto": logo,
				"namaExternal": hub.namaExternal,
				"namaRekanan": hub.namaRekanan,
				"reportDisplay": hub.reportDisplay,
				"statusEnabled": hub.statusEnabled,


			}
			this.versi = hub.version;
			return fixHub;
		} else {
			fixHub = {
				"contactPerson": hub.contactPerson,
				"kdAccount": hub.kdAccount,
				"kdJenisRekanan": hub.kdJenisRekanan,
				"kdRekananHead": hub.kdRekananHead,
				"noPKP": hub.noPKP,
				"npwp": hub.nPWP,
				"kode": hub.kode.kode,
				"kodeExternal": hub.kodeExternal,
				"tglDaftar": new Date(hub.tglDaftar * 1000),
				"gambarLogo": logo,
				"ambilFoto": logo,
				"namaExternal": hub.namaExternal,
				"namaRekanan": hub.namaRekanan,
				"reportDisplay": hub.reportDisplay,
				"statusEnabled": hub.statusEnabled,


			}
			this.versi = hub.version;
			return fixHub;
		}
	}

	hapusRekanan() {
		let item = [...this.listDataRekanan];
		let deleteItem = item[this.findSelectedIndexRekanan()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/rekanan/del/' + deleteItem.kode.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.resetRekanan();
		});
	}
	hapusJenisRekanan() {
		let item = [...this.listDataJenisRekanan];
		let deleteItem = item[this.findSelectedIndexJenisRekanan()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/jenisrekanan/del/' + deleteItem.kode.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.resetJenisRekanan();
		});

	}

	findSelectedIndexRekanan(): number {
		return this.listDataRekanan.indexOf(this.selected);
	}
	findSelectedIndexJenisRekanan(): number {
		return this.listDataJenisRekanan.indexOf(this.selected);
	}
	onDestroy() {

	}

	getDate(date){
		let dd = new Date(date * 1000);

		let d =  dd.getDate();
		let m = dd.getMonth();
		let y = dd.getFullYear();

		return ((d < 10) ? ('0'+d) : d) + ' ' + this.month[m]  + ' ' + y;  
	}

	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/rekanan/findAll?').subscribe(table => {
			this.listData3 = table.Rekanan;
			this.codes2 = [];

			for (let i = 0; i<this.listData3.length; i++){
				this.codes2.push({
					kode: this.listData3[i].kode.kode,
					namaRekananHead: this.listData3[i].namaRekananHead,
					namaRekanan: this.listData3[i].namaRekanan,
					tglDaftar: this.getDate(this.listData3[i].tglDaftar),
					contactPerson: this.listData3[i].contactPerson,
					noPKP: this.listData3[i].noPKP,
					kodeAccount: this.listData3[i].kodeAccount,
					jenisRekanan: this.listData3[i].jenisRekanan,
					nPWP: this.listData3[i].nPWP,
					reportDisplay: this.listData3[i].reportDisplay,
					kodeExternal: this.listData3[i].kodeExternal,
					namaExternal: this.listData3[i].namaExternal,
					statusEnabled: this.listData3[i].statusEnabled
				})
			}
			this.fileService.exportAsExcelFile(this.codes2, 'Rekanan');
		});

	}

	downloadPdf() {
		let cetak = Configuration.get().report + '/jenisRekanan/laporanJenisRekanan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
		window.open(cetak);
		// var col = ["Kode ", "Parent", "Nama", "Tanggal Akreditasi", "Kontak", "No PKP", "Kode Akuntansi", "Jenis Rekanan", "NPWP", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
		// this.httpService.get(Configuration.get().dataMasterNew + '/rekanan/findAll?').subscribe(table => {
		// 	this.listData3 = table.Rekanan;
		// 	this.codes2 = [];

		// 	for (let i = 0; i<this.listData3.length; i++){
		// 		this.codes2.push({
		// 			kode: this.listData3[i].kode.kode,
		// 			namaRekananHead: this.listData3[i].namaRekananHead,
		// 			namaRekanan: this.listData3[i].namaRekanan,
		// 			tglDaftar: this.getDate(this.listData3[i].tglDaftar),
		// 			contactPerson: this.listData3[i].contactPerson,
		// 			noPKP: this.listData3[i].noPKP,
		// 			kodeAccount: this.listData3[i].kodeAccount,
		// 			jenisRekanan: this.listData3[i].jenisRekanan,
		// 			nPWP: this.listData3[i].nPWP,
		// 			reportDisplay: this.listData3[i].reportDisplay,
		// 			kodeExternal: this.listData3[i].kodeExternal,
		// 			namaExternal: this.listData3[i].namaExternal,
		// 			statusEnabled: this.listData3[i].statusEnabled
		// 		})
		// 	}
		// 	this.fileService.exportAsPdfFile("Master Rekanan", col, this.codes2, "Rekanan");

		// });

	}

	downloadExcelJenis() {
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisrekanan/findAll?').subscribe(table => {
			this.listData2 = table.JenisRekanan;
			this.codes = [];

			for (let i = 0; i<this.listData2.length; i++){
				this.codes.push({
					kode: this.listData2[i].kode.kode,
					namaJenisRekanan: this.listData2[i].namaJenisRekanan,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled
				})
			}
			this.fileService.exportAsExcelFile(this.codes, 'Jenis Rekanan');
		});

	}

	downloadPdfJenis() {
		var col = ["Kode ", "Nama ", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisrekanan/findAll?').subscribe(table => {
			this.listData2 = table.JenisRekanan;
			this.codes = [];

			for (let i = 0; i<this.listData2.length; i++){
				this.codes.push({
					kode: this.listData2[i].kode.kode,
					namaJenisRekanan: this.listData2[i].namaJenisRekanan,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled
				})
			}
			this.fileService.exportAsPdfFile("Master Jenis Rekanan", col, this.codes, "Jenis Rekanan");

		});

	}
	tutupLaporan() {
        this.laporan = false;
    }
	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisRekanan/laporanJenisRekanan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmRekanan_laporanCetak');

		// let cetak = Configuration.get().report + '/jenisRekanan/laporanJenisRekanan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
		// window.open(cetak);
	  }

	cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/rekanan/laporanRekanan.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisRekanan='+this.kdJenisRek+'&download=false', 'frmRekanan_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/rekanan/laporanRekanan.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisRekanan='+this.kdJenisRek+'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
    }



}

class InisialRekanan implements Rekanan {

	constructor(
		public contactPerson?,
		public kdAccount?,
		public npwp?,
		public kdJenisRekanan?,
		public tglDaftar?,
		public kdRekananHead?,
		public noPKP?,
		public nPWP?,
		public FixedPhone?,
		public MobilePhone?,
		public faksimile?,
		public alamatEmail?,
		public website?,
		public kode?,
		public namaRekanan?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public alamatLengkap?,
		public ambilFoto?,
		public gambarLogo?,




		) { }

}
class InisialJenisRekanan implements JenisRekanan {

	constructor(
		public id?,
		public kdProfile?,
		public kode?,
		public namaJenisRekanan?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
		) { }

}