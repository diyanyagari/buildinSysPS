import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-modul-aplikasi-histori',
	templateUrl: './modul-aplikasi-histori.component.html',
	styleUrls: ['./modul-aplikasi-histori.component.scss'],
	providers: [ConfirmationService]
})
export class ModulAplikasiHistoriComponent implements OnInit {

	program: any;
	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	modulAplikasiHead: any = [];
	versiAplikasi: any = [];
	manualHelpLink: any = [];
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
	}
	ngAfterViewInit() {
		var x = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left") as HTMLCollectionOf<HTMLElement>;
		var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.height = '3.6vh';
		}
		for (var i = 0; i < browseStyle.length; i++) {
			browseStyle[i].style.marginTop = '-0.5vh';
		}
	}
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
		this.formAktif = true;
		this.form = this.fb.group({
			'kdModulAplikasi': new FormControl(null, Validators.required),
			'kdVersion': new FormControl(null, Validators.required),
			'deskripsiVersion': new FormControl(''),
			'pathFileDeskripsiVersion': new FormControl(''),
			'tglAkhirDeveloped': new FormControl(new Date()),
			'tglAkhirSupported': new FormControl(new Date()),
			'tglAwalDeveloped': new FormControl(new Date()),
			'tglAwalSupported': new FormControl(new Date()),
			'tglReleased': new FormControl(new Date()),
			'versionIconImage': new FormControl(''),
			'keteranganLainnya': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getModulAplikasi();
		this.getVersiAplikasi();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasihistori/findAll?page=' + page + '&rows=' + rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi' + cari).subscribe(table => {
			this.listData = table.ModulAplikasiHistori;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasihistori/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
			this.listData = table.ModulAplikasiHistori;
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
	}

	clone(cloned: any) {
		console.log(cloned);
		let fixHub = {
			"kdModulAplikasi": cloned.data.kode.kdModulAplikasi,
			"kdVersion": cloned.data.kode.kdVersion,
			"deskripsiVersion": cloned.data.deskripsiVersion,
			"pathFileDeskripsiVersion": cloned.data.pathFileDeskripsiVersion,
			"tglAkhirDeveloped": new Date(cloned.data.tglAkhirDeveloped * 1000),
			"tglAkhirSupported": new Date(cloned.data.tglAkhirSupported * 1000),
			"tglAwalDeveloped": new Date(cloned.data.tglAwalDeveloped * 1000),
			"tglAwalSupported": new Date(cloned.data.tglAwalSupported * 1000),
			"tglReleased": new Date(cloned.data.tglReleased * 1000),
			"versionIconImage": cloned.data.versionIconImage,
			"keteranganLainnya": cloned.data.keteranganLainnya,
			"statusEnabled": cloned.data.statusEnabled,
		}
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
			let tglAkhirDeveloped = Math.floor(this.setTimeStamp(this.form.get('tglAkhirDeveloped').value))
			let tglAkhirSupported = Math.floor(this.setTimeStamp(this.form.get('tglAkhirSupported').value))
			let tglAwalDeveloped = Math.floor(this.setTimeStamp(this.form.get('tglAwalDeveloped').value))
			let tglAwalSupported = Math.floor(this.setTimeStamp(this.form.get('tglAwalSupported').value))
			let tglReleased = Math.floor(this.setTimeStamp(this.form.get('tglReleased').value))

			let formSubmit = this.form.value;

			formSubmit.tglAkhirDeveloped = tglAkhirDeveloped;
			formSubmit.tglAkhirSupported = tglAkhirSupported;
			formSubmit.tglAwalDeveloped = tglAwalDeveloped;
			formSubmit.tglAwalSupported = tglAwalSupported;
			formSubmit.tglReleased = tglReleased;

			formSubmit.pathFileDeskripsiVersion = null;
			formSubmit.versionIconImage = this.namaImage;
			this.httpService.post(Configuration.get().dataMasterNew + '/modulaplikasihistori/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.getDataGrid(this.page, this.rows, this.pencarian);
				this.reset();
			})
			console.log(this.form.value);
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
		let tglAkhirDeveloped = this.setTimeStamp(this.form.get('tglAkhirDeveloped').value)
		let tglAkhirSupported = this.setTimeStamp(this.form.get('tglAkhirSupported').value)
		let tglAwalDeveloped = this.setTimeStamp(this.form.get('tglAwalDeveloped').value)
		let tglAwalSupported = this.setTimeStamp(this.form.get('tglAwalSupported').value)
		let tglReleased = this.setTimeStamp(this.form.get('tglReleased').value)

		let formSubmit = this.form.value;

		formSubmit.tglAkhirDeveloped = tglAkhirDeveloped;
		formSubmit.tglAkhirSupported = tglAkhirSupported;
		formSubmit.tglAwalDeveloped = tglAwalDeveloped;
		formSubmit.tglAwalSupported = tglAwalSupported;
		formSubmit.tglReleased = tglReleased;

		formSubmit.pathFileDeskripsiVersion = null;
		formSubmit.versionIconImage = this.namaImage;
		this.httpService.update(Configuration.get().dataMasterNew + '/modulaplikasihistori/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/modulaplikasihistori/del/' + this.form.get('kdModulAplikasi').value + '/' + this.form.get('kdVersion').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		this.confirmationService.confirm({
			message: 'Apakah Data Akan Dihapus?',
			header: 'Konfirmasi Hapus',
			icon: 'fa fa-trash',
			accept: () => {
				this.hapus();
			}
		});
		// let kode = this.form.get('kode').value;
		// if (kode == null || kode == undefined || kode == "") {
		// 	this.alertService.warn('Peringatan', 'Pilih Daftar Pelayanan Profile');
		// }
		// else {
		// 	this.confirmationService.confirm({
		// 		message: 'Apakah Data Akan Dihapus?',
		// 		header: 'Konfirmasi Hapus',
		// 		icon: 'fa fa-trash',
		// 		accept: () => {
		// 			this.hapus();
		// 		}
		// 	});
		// }
	}

	getModulAplikasi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllData').subscribe(res => {
			this.modulAplikasiHead = [];
			this.modulAplikasiHead.push({ label: '-- Silahkan Pilih Modul Aplikasi --', value: '' })
			for (var i = 0; i < res.ModulAplikasi.length; i++) {
				this.modulAplikasiHead.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		})
	}

	getVersiAplikasi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/version/findAllData').subscribe(res => {
			this.versiAplikasi = [];
			this.versiAplikasi.push({ label: '-- Silahkan Pilih Versi --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.versiAplikasi.push({ label: res.data[i].namaVersion, value: res.data[i].kode })
			};
		})
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
		return Configuration.get().resourceFile + '/file/upload?noProfile=false';
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
}


