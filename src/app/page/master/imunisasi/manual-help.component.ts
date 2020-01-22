import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-manual-help',
	templateUrl: './manual-help.component.html',
	styleUrls: ['./manual-help.component.scss'],
	providers: [ConfirmationService]
})
export class ManualHelpComponent implements OnInit {

	program: any;
	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	manualHelpHead: any = [];
	manualHelpLink: any = [];
	jenisManualHead: any = [];
	listBahasa: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	listPegawaiKepala: any = [];
	smbrImage: string;
	smbrCover: string;
	namaImage: string = null;
	namaCover: string = null;
	image: any;
	cover: any;
	photoDiri: any;

	kode: any;

	kdProfile: any;
	kdProgram: any;
	kdDepartemen: any;

	listData: any = [];
	listDataBefore: any = [];

	pencarian: string;

	page: number;
	totalRecords: number;
	rows: number;
	versi: number;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		private confirmationService: ConfirmationService) {
		// this.smbrImage = Configuration.get().resourceFile + "/image/show/profile1213123.png";
		// this.smbrCover = Configuration.get().resourceFile + "/image/show/profile1213123.png";
	}


	JenisManual = [
		{ value: 1, label: 'User Manual' },
		{ value: 2, label: 'Video' },
		{ value: 3, label: 'Service Pack' },
		{ value: 4, label: 'Deskripsi' },
		{ value: 5, label: 'Brosur' },
		{ value: 6, label: 'Fitur' },
		{ value: 7, label: 'Spesifikasi' }
	];

	ngOnInit() {
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.items = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					// this.downloadPdf();
				}
			},
			{
				label: 'Exel', icon: 'fa-file-excel-o', command: () => {
					// this.downloadExel();
				}
			}];

		let data = {
			"kdManualHelpHead": "string",
			"deskripsiManualHelp": "string",
			"noManualHelp": "string",
			"tglManualHelp": 0,
			"namaJudulManualHelp": "string",
			"jenisManualHelp": 0,
			"imageFile": "string",
			"imageCover": "string",
			"isiManualHelp": "string",
			"pathFile": "string",
			"imageCoverPathFile": "string",
			"kdBahasa": 0,
			"kdNegara": 0,
			"kdManualHelpLinkTo": 0,
			"qtyPages": 0,
			"keteranganLainnya": "string",
			"kode": 0,
			"reportDisplay": "string",
			"statusEnabled": true
		}
		this.formAktif = true;
		this.form = this.fb.group({
			'kdManualHelpHead': new FormControl('', Validators.required),
			'deskripsiManualHelp': new FormControl(''),
			'noManualHelp': new FormControl(''),
			'tglManualHelp': new FormControl(new Date()),
			'namaJudulManualHelp': new FormControl('', Validators.required),
			'jenisManualHelp': new FormControl(null, Validators.required),
			'imageFile': new FormControl(''),
			'imageCover': new FormControl(''),
			'isiManualHelp': new FormControl(''),
			'pathFile': new FormControl(''),
			'imageCoverPathFile': new FormControl(''),
			'kdBahasa': new FormControl(null),
			'kdNegara': new FormControl(null),
			'kdManualHelpLinkTo': new FormControl(null),
			'qtyPages': new FormControl(null),
			'keteranganLainnya': new FormControl(''),
			'kode': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getBahasa();
		this.getManualHelpHead();
		this.getJenisManualHelp()
		// this.getPegawaiKepala();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		let dataSimpan = [];
		this.httpService.get(Configuration.get().dataMasterNew + '/manualhelp/findAll?page=' + page + '&rows=' + rows + '&dir=namaJudulManualHelp&sort=desc&namaJudulManualHelp' + cari).subscribe(table => {
			this.listDataBefore = table.ManualHelp;
			for (var i = 0; i < this.listDataBefore.length; i++) {
				for (var j = 0; j < this.JenisManual.length; j++) {
					if (this.listDataBefore[i].jenisManualHelp == this.JenisManual[j].value) {
						dataSimpan[i] = {
							"kdManualHelpHead": this.listDataBefore[i].kdManualHelpHead,
							"namaJudulManualHelpHead": this.listDataBefore[i].namaJudulManualHelpHead,
							"noManualHelp": this.listDataBefore[i].noManualHelp,
							"namaJudulManualHelp": this.listDataBefore[i].namaJudulManualHelp,
							"deskripsiManualHelp": this.listDataBefore[i].deskripsiManualHelp,
							"tglManualHelp": this.listDataBefore[i].tglManualHelp,
							"statusEnabled": this.listDataBefore[i].statusEnabled,
							"jenisManualHelp": this.JenisManual[j].label,
							"imageFile": this.listDataBefore[i].imageFile,
							// "imageFile": '<img src="' + Configuration.get().resourceFile + "/image/show/" + this.listDataBefore[j].pathFile + '">',
							"smbrImage": Configuration.get().resourceFile + '/image/show/' + this.listDataBefore[i].imageFile,
							"smbrCover": Configuration.get().resourceFile + '/image/show/' + this.listDataBefore[i].imageCover,
							"pathFile": this.listDataBefore[i].pathFile,
							"imageCover": this.listDataBefore[i].imageCover,
							"imageCoverPathFile": this.listDataBefore[i].imageCoverPathFile,
							"isiManualHelp": this.listDataBefore[i].isiManualHelp,
							"namaBahasa": this.listDataBefore[i].namaBahasa,
							"kdBahasa": this.listDataBefore[i].kdBahasa,
							"kdNegara": this.listDataBefore[i].kdNegara,
							"qtyPages": this.listDataBefore[i].qtyPages,
							"namaManualLinkTo": this.listDataBefore[i].namaManualLinkTo,
							"kdManualHelpLinkTo": this.listDataBefore[i].kdManualHelpLinkTo,
							"keteranganLainnya": this.listDataBefore[i].keteranganLainnya,
							"reportDisplay": this.listDataBefore[i].reportDisplay,
							"kode": this.listDataBefore[i].kode,
						}
					}
				}
			}
			this.listData = dataSimpan;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		let dataSimpan = [];
		this.httpService.get(Configuration.get().dataMasterNew + '/manualhelp/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJudulManualHelp&sort=desc&namaJudulManualHelp=' + this.pencarian).subscribe(table => {
			this.listDataBefore = table.ManualHelp;
			for (var i = 0; i < this.listDataBefore.length; i++) {
				for (var j = 0; j < this.JenisManual.length; j++) {
					if (this.listDataBefore[i].jenisManualHelp == this.JenisManual[j].value) {
						dataSimpan[i] = {
							"kdManualHelpHead": this.listDataBefore[i].kdManualHelpHead,
							"namaJudulManualHelpHead": this.listDataBefore[i].namaJudulManualHelpHead,
							"noManualHelp": this.listDataBefore[i].noManualHelp,
							"namaJudulManualHelp": this.listDataBefore[i].namaJudulManualHelp,
							"deskripsiManualHelp": this.listDataBefore[i].deskripsiManualHelp,
							"tglManualHelp": this.listDataBefore[i].tglManualHelp,
							"statusEnabled": this.listDataBefore[i].statusEnabled,
							"jenisManualHelp": this.JenisManual[j].label,
							"imageFile": this.listDataBefore[i].imageFile,
							// "imageFile": '<img src="' + Configuration.get().resourceFile + "/image/show/" + this.listDataBefore[j].pathFile + '">',
							"smbrImage": Configuration.get().resourceFile + '/image/show/' + this.listDataBefore[i].imageFile,
							"smbrCover": Configuration.get().resourceFile + '/image/show/' + this.listDataBefore[i].imageCover,
							"pathFile": this.listDataBefore[i].pathFile,
							"imageCover": this.listDataBefore[i].imageCover,
							"imageCoverPathFile": this.listDataBefore[i].imageCoverPathFile,
							"isiManualHelp": this.listDataBefore[i].isiManualHelp,
							"namaBahasa": this.listDataBefore[i].namaBahasa,
							"kdBahasa": this.listDataBefore[i].kdBahasa,
							"kdNegara": this.listDataBefore[i].kdNegara,
							"qtyPages": this.listDataBefore[i].qtyPages,
							"namaManualLinkTo": this.listDataBefore[i].namaManualLinkTo,
							"kdManualHelpLinkTo": this.listDataBefore[i].kdManualHelpLinkTo,
							"keteranganLainnya": this.listDataBefore[i].keteranganLainnya,
							"reportDisplay": this.listDataBefore[i].reportDisplay,
							"kode": this.listDataBefore[i].kode,
						}
					}
				}
			}
			this.listData = dataSimpan;
		});
	}

	setTimeStamp(date) {
		let dataTimeStamp = (new Date(date).getTime() / 1000);
		return dataTimeStamp;
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

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	clone(cloned: any) {
		let fixHub = {
			"kdManualHelpHead": cloned.data.kdManualHelpHead,
			// "namaJudulManualHelpHead": cloned.data.namaJudulManualHelpHead,
			"deskripsiManualHelp": cloned.data.deskripsiManualHelp,
			"noManualHelp": cloned.data.noManualHelp,
			"namaJudulManualHelp": cloned.data.namaJudulManualHelp,
			"tglManualHelp": new Date(cloned.data.tglManualHelp * 1000),
			"statusEnabled": cloned.data.statusEnabled,
			"jenisManualHelp": cloned.data.jenisManualHelp,
			"kdBahasa": cloned.data.kdBahasa,
			"kdNegara": cloned.data.kdNegara,
			"kdManualHelpLinkTo": cloned.data.kdManualHelpLinkTo,
			"kode": cloned.data.kode,
			"imageFile": cloned.data.imageFile,
			"pathFile": cloned.data.pathFile,
			"imageCover": cloned.data.imageCover,
			"imageCoverPathFile": cloned.data.imageCoverPathFile,
			"isiManualHelp": cloned.data.isiManualHelp,
			// "namaBahasa": cloned.data.namaBahasa,
			"qtyPages": cloned.data.qtyPages,
			// "namaManualLinkTo": cloned.data.namaManualLinkTo,
			"keteranganLainnya": cloned.data.keteranganLainnya,
			"reportDisplay": cloned.data.reportDisplay,
		}
		this.smbrImage = Configuration.get().resourceFile + '/image/show/' + cloned.data.imageFile;
		this.smbrCover = Configuration.get().resourceFile + '/image/show/' + cloned.data.imageCover;
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		let cloned = this.clone(event);
		this.formAktif = false;
		this.form.setValue(cloned);
	}

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		}
		else {
			this.simpan();
		}
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		}
		else {
			let tglManualHelp = this.setTimeStamp(this.form.get('tglManualHelp').value)

			let formSubmit = this.form.value;
			formSubmit.tglManualHelp = tglManualHelp;
			formSubmit.pathFile = this.namaImage;
			formSubmit.imageCoverPathFile = this.namaCover;
			formSubmit.kdNegara = this.authGuard.getUserDto().pegawai.kdNegara;
			formSubmit.pathFile = this.namaImage;
			formSubmit.imageCoverPathFile = this.namaCover;
			this.httpService.post(Configuration.get().dataMasterNew + '/manualhelp/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.getDataGrid(this.page, this.rows, this.pencarian);
				this.reset();
			})
			// console.log(this.form.value);
		}
	}

	confirmUpdate() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.update();
			}
		});
	}

	update() {
		let tglManualHelp = this.setTimeStamp(this.form.get('tglManualHelp').value)

		let formSubmit = this.form.value;
		formSubmit.tglManualHelp = tglManualHelp;
		for (var i = 0; i < this.JenisManual.length; i++) {
			if (formSubmit.jenisManualHelp == this.JenisManual[i].label) {
				formSubmit.jenisManualHelp = this.JenisManual[i].value;
			}
		}
		this.httpService.update(Configuration.get().dataMasterNew + '/manualhelp/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/manualhelp/del/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Pelayanan Profile');
		}
		else {
			this.confirmationService.confirm({
				message: 'Apakah Data Akan Dihapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapus();
				}
			});
		}
	}

	getManualHelpHead() {
		this.httpService.get(Configuration.get().dataMasterNew + '/manualhelp/findAllData').subscribe(res => {
			this.manualHelpHead = [];
			this.manualHelpHead.push({ label: '-- Pilih Manual Help Head --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.manualHelpHead.push({ label: res.data[i].namaJudulManualHelp, value: res.data[i].kode })
			};
		})
	}

	getManualHelpLink() {
		this.httpService.get(Configuration.get().dataMasterNew + '/manualhelp/findAll').subscribe(res => {
			this.manualHelpLink = [];
			this.manualHelpLink.push({ label: '-- Pilih Manual Help Head --', value: '' })
			for (var i = 0; i < res.ManualHelp.length; i++) {
				this.manualHelpLink.push({ label: res.ManualHelp[i].namaManualLinkTo, value: res.ManualHelp[i].noManualHelp })
			};
		})

	}

	getBahasa() {
		this.httpService.get(Configuration.get().dataMasterNew + '/bahasa/findAllBahasa?kdNegara=' + this.authGuard.getUserDto().pegawai.kdNegara).subscribe(res => {
			this.listBahasa = [];
			this.listBahasa.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.bahasa.length; i++) {
				this.listBahasa.push({ label: res.bahasa[i].namaBahasa, value: res.bahasa[i].kode.kode })
			};
		})
	}

	getJenisManualHelp() {
		this.jenisManualHead = [];
		this.jenisManualHead.push({ label: '-- Pilih --', value: '' })
		for (var i = 0; i < this.JenisManual.length; i++) {
			this.jenisManualHead.push({ label: this.JenisManual[i].label, value: this.JenisManual[i].value })
		}
	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaJudulManualHelp').value)
	}

	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload';
	}

	imageUpload(event) {
		this.namaImage = event.xhr.response;
		this.smbrImage = Configuration.get().resourceFile + '/image/show/' + this.namaImage;
	}

	coverUpload(event) {
		this.namaCover = event.xhr.response;
		this.smbrCover = Configuration.get().resourceFile + '/image/show/' + this.namaCover;
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}

	fileImageUpload(namaBaru) {
		this.image = namaBaru;
		this.smbrImage = Configuration.get().resourceFile + '/image/show/' + this.image;
	}

	fileCoverUpload(namaBaru) {
		this.cover = namaBaru;
		this.smbrCover = Configuration.get().resourceFile + '/image/show/' + this.cover;
	}
}


