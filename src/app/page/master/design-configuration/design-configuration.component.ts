import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-design-configuration',
	templateUrl: './design-configuration.component.html',
	styleUrls: ['./design-configuration.component.scss'],
	providers: [ConfirmationService]
})
export class DesignConfigurationComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	modulAplikasi: any = [];
	modulVersi: any = [];
	designTheme: any = [];
	designHome: any = [];
	designHomeContent: any = [];
	statusEnabled: any;
	noRec: any;
	smbrImage: string;
	namaImage: string = null;
	listData: any = [];
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
			x[i].style.height = '3.7vh';
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
			'imageCover': new FormControl(''),
			'imageCoverPathFile': new FormControl(''),
			'kdDesignHome': new FormControl('', Validators.required),
			'kdDesignHomeContent': new FormControl('', Validators.required),
			'kdDesignTheme': new FormControl('', Validators.required),
			'kdModulAplikasi': new FormControl('', Validators.required),
			'kdVersion': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getModulAplikasi();
		this.getVersi();
		this.getDropdown();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/designconfig/findAll?page=' + page + '&rows=' + rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi' + cari).subscribe(table => {
			this.listData = table.DesignConfig;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/designconfig/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
			this.listData = table.DesignConfig;
		});
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
		let fixHub = {
			"imageCover": cloned.data.imageCover,
			"imageCoverPathFile": cloned.data.imageCoverPathFile,
			"kdDesignHome": cloned.data.kode.kdDesignHome,
			"kdDesignHomeContent": cloned.data.kode.kdDesignHomeContent,
			"kdDesignTheme": cloned.data.kode.kdDesignTheme,
			"kdModulAplikasi": cloned.data.kode.kdModulAplikasi,
			"kdVersion": cloned.data.kode.kdVersion,
			"statusEnabled": cloned.data.statusEnabled

		}
		this.smbrImage = Configuration.get().resourceFile + '/image/show/' + cloned.data.imageCover;
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
			let formSubmit = this.form.value;
			formSubmit.imageCover = this.namaImage;
			formSubmit.imageCoverPathFile = this.smbrImage;
			this.httpService.post(Configuration.get().dataMasterNew + '/designconfig/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.getDataGrid(this.page, this.rows, this.pencarian);
				this.reset();
			})
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
		let formSubmit = this.form.value;
		formSubmit.imageCover = this.namaImage;
		formSubmit.imageCoverPathFile = this.smbrImage;
		this.httpService.update(Configuration.get().dataMasterNew + '/designconfig/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/designconfig/del/'
			+ this.form.get('kdModulAplikasi').value
			+ '/'
			+ this.form.get('kdVersion').value
			+ '/'
			+ this.form.get('kdDesignTheme').value
			+ '/'
			+ this.form.get('kdDesignHome').value
			+ '/'
			+ this.form.get('kdDesignHomeContent').value
		).subscribe(response => {
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
			this.modulAplikasi = [];
			this.modulAplikasi.push({ label: '-- Pilih Modul Aplikasi --', value: '' })
			for (var i = 0; i < res.ModulAplikasi.length; i++) {
				this.modulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		})
	}

	getVersi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/version/findAllData').subscribe(res => {
			this.modulVersi = [];
			this.modulVersi.push({ label: '-- Pilih Modul Aplikasi --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.modulVersi.push({ label: res.data[i].namaVersion, value: res.data[i].kode })
			};
		})
	}

	getDropdown() {
		this.httpService.get(Configuration.get().dataMasterNew + '/designconfig/findAllDropDown').subscribe(res => {
			this.designTheme = [];
			this.designHome = [];
			this.designHomeContent = [];

			this.designTheme.push({ label: '-- Pilih Desain Theme --', value: '' })
			this.designHome.push({ label: '-- Pilih Desain Home --', value: '' })
			this.designHomeContent.push({ label: '-- Pilih Desain Home Content --', value: '' })

			for (var i = 0; i < res.theme.length; i++) {
				this.designTheme.push({ label: res.theme[i].namaDesign, value: res.theme[i].kode })
			};

			for (var i = 0; i < res.home.length; i++) {
				this.designHome.push({ label: res.home[i].namaDesign, value: res.home[i].kode })
			};

			for (var i = 0; i < res.homeContent.length; i++) {
				this.designHomeContent.push({ label: res.homeContent[i].namaDesign, value: res.homeContent[i].kode })
			};
		})
	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.smbrImage = null;
		this.ngOnInit();
	}

	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload?noProfile=false';
	}

	imageUpload(event) {
		this.namaImage = event.xhr.response;
		this.smbrImage = Configuration.get().resourceFile + '/image/show/' + this.namaImage;
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}
}


