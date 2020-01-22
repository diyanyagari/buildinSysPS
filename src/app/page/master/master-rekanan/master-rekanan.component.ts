import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-master-rekanan',
	templateUrl: './master-rekanan.component.html',
	styleUrls: ['./master-rekanan.component.scss'],
	providers: [ConfirmationService]
})
export class MasterRekananComponent implements OnInit, AfterViewInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	kode: any;
	listData: any = [];
	listJenisRekanan: any = [];
	listNegara: any = [];
	listPropinsi: any = [];
	listKotaKab: any = [];
	listKecamatan: any = [];
	listDesa: any = [];
	listDesaAll: any = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	namaFile: string;
	smbrFile: string;
	norec: string;

	tanggalAwal: any;
	tanggalAkhir: any;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService) { }

	StatusUmur = [
		{ value: 'T ', label: 'T' },
		{ value: 'B ', label: 'B' },
		{ value: 'H ', label: 'H' }
	];

	ngOnInit() {
		this.smbrFile = null;
		this.namaFile = null;
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
		this.tanggalAkhir.setHours(23, 59, 0, 0);

		this.items = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					// this.downloadPdf();
				}
			},
			{
				label: 'Excel', icon: 'fa-file-excel-o', command: () => {
					// this.downloadExel();
				}
			}];

		this.formAktif = true;
		this.form = this.fb.group({
			'kdJenisKontak': new FormControl(null, Validators.required),
			'kdNegara': new FormControl(null, Validators.required),
			'kdKecamatan': new FormControl(null),
			'rtrw': new FormControl(null),
			'mobilePhone1': new FormControl(null),
			'namaLengkap': new FormControl(null, Validators.required),
			'kdPropinsi': new FormControl(null, Validators.required),
			'kdDesaKelurahan': new FormControl(null),
			'alamatLengkap': new FormControl(null, Validators.required),
			'faksimile1': new FormControl(null),
			'gambarLogo': new FormControl(null),
			'kdKotaKabupaten': new FormControl(null),
			'kodePos': new FormControl(null),
			'alamatEmail': new FormControl(null),
			'fixedPhone1': new FormControl(null),
			'website': new FormControl(null),
			'statusEnabled': new FormControl(null),
			'noRec': new FormControl(null),
			'tglAwal': new FormControl(this.tanggalAwal),
			'tglAkhir': new FormControl(this.tanggalAkhir)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getJenisRekanan();
		this.getNegara();
		this.getPropinsi();
		this.getKotaKab();
		this.getKecamatan();
		this.getDesa();
		
		// this.getTitleHead();
		// this.getPegawaiKepala();

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

	ngAfterViewInit() {
		var x = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left") as HTMLCollectionOf<HTMLElement>;
		var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.height = '3.8vh';
			x[i].style.textAlign = 'center';
		}
		for (var i = 0; i < browseStyle.length; i++) {
			browseStyle[i].style.marginTop = '-0.5vh';
		}
	}
	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/kontak-alamat-rekanan/findAll?page=' + page + '&rows=' + rows + '&dir=kontak.namaLengkap&sort=desc&namaLengkap' + cari).subscribe(table => {
			let dataSimpan = [];
			for (let i = 0; i < table.data.length; i++) {
				let dataTemp = {
					'kdJenisKontak': table.data[i].kdJenisKontak,
					'kdNegara': table.data[i].kdNegara,
					'kdKecamatan': table.data[i].kdKecamatan,
					'rTRW': table.data[i].rTRW,
					'mobilePhone1': table.data[i].mobilePhone1,
					'namaJenisKontak': table.data[i].namaJenisKontak,
					'namaJenisAlamat': table.data[i].namaJenisAlamat,
					'namaPropinsi': table.data[i].namaPropinsi,
					'kotaKabupaten': table.data[i].kotaKabupaten,
					'desaKelurahan': table.data[i].desaKelurahan,
					'namaKotaKabupaten': table.data[i].namaKotaKabupaten,
					'namaKecamatan': table.data[i].namaKecamatan,
					'kdAlamat': table.data[i].kdAlamat,
					'kdJenisAlamat': table.data[i].kdJenisAlamat,
					'kecamatan': table.data[i].kecamatan,
					'kdProfile': table.data[i].kode.kdProfile,
					'noKontak': table.data[i].kode.noKontak,
					'kode': {
						'kdAlamat': table.data[i].kdAlamat,
						'kdProfile': table.data[i].kode.kdProfile,
						'noKontak': table.data[i].kode.noKontak
					},
					'namaDesaKelurahan': table.data[i].namaDesaKelurahan,
					'namaNegara': table.data[i].namaNegara,
					'namaKontak': table.data[i].namaKontak,
					'kdPropinsi': table.data[i].kdPropinsi,
					'kdDesaKelurahan': table.data[i].kdDesaKelurahan,
					'alamatLengkap': table.data[i].alamatLengkap,
					'faksimile1': table.data[i].faksimile1,
					'gambarLogo': table.data[i].gambarLogo,
					'kdKotaKabupaten': table.data[i].kdKotaKabupaten,
					'kodePos': table.data[i].kodePos,
					'alamatEmail': table.data[i].alamatEmail,
					'fixedPhone1': table.data[i].fixedPhone1,
					'website': table.data[i].website,
					'statusEnabled': table.data[i].statusEnabled,
					'noRec': table.data[i].noRec,
					'version': table.data[i].version,
					'pathImage': Configuration.get().resourceFile + '/image/show/' + table.data[i].gambarLogo,
					'tglAwal': table.data[i].tglAwal,
					'tglAkhir': table.data[i].tglAkhir
				}
				dataSimpan.push(dataTemp);
			}
			this.listData = dataSimpan;
			this.totalRecords = table.totalRow;
			console.log(this.listData)
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kontak-alamat-rekanan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=kontak.namaLengkap&sort=desc&namaLengkap=' + this.pencarian).subscribe(table => {
			let dataSimpan = [];
			for (let i = 0; i < table.data.length; i++) {
				let dataTemp = {
					'kdJenisKontak': table.data[i].kdJenisKontak,
					'kdNegara': table.data[i].kdNegara,
					'kdKecamatan': table.data[i].kdKecamatan,
					'rTRW': table.data[i].rTRW,
					'mobilePhone1': table.data[i].mobilePhone1,
					'namaJenisKontak': table.data[i].namaJenisKontak,
					'namaJenisAlamat': table.data[i].namaJenisAlamat,
					'namaPropinsi': table.data[i].namaPropinsi,
					'kotaKabupaten': table.data[i].kotaKabupaten,
					'desaKelurahan': table.data[i].desaKelurahan,
					'namaKotaKabupaten': table.data[i].namaKotaKabupaten,
					'namaKecamatan': table.data[i].namaKecamatan,
					'kdAlamat': table.data[i].kdAlamat,
					'kdJenisAlamat': table.data[i].kdJenisAlamat,
					'kecamatan': table.data[i].kecamatan,
					'kdProfile': table.data[i].kode.kdProfile,
					'noKontak': table.data[i].kode.noKontak,
					'kode': {
						'kdAlamat': table.data[i].kdAlamat,
						'kdProfile': table.data[i].kode.kdProfile,
						'noKontak': table.data[i].kode.noKontak
					},
					'namaDesaKelurahan': table.data[i].namaDesaKelurahan,
					'namaNegara': table.data[i].namaNegara,
					'namaKontak': table.data[i].namaKontak,
					'kdPropinsi': table.data[i].kdPropinsi,
					'kdDesaKelurahan': table.data[i].kdDesaKelurahan,
					'alamatLengkap': table.data[i].alamatLengkap,
					'faksimile1': table.data[i].faksimile1,
					'gambarLogo': table.data[i].gambarLogo,
					'kdKotaKabupaten': table.data[i].kdKotaKabupaten,
					'kodePos': table.data[i].kodePos,
					'alamatEmail': table.data[i].alamatEmail,
					'fixedPhone1': table.data[i].fixedPhone1,
					'website': table.data[i].website,
					'statusEnabled': table.data[i].statusEnabled,
					'noRec': table.data[i].noRec,
					'version': table.data[i].version,
					'pathImage': Configuration.get().resourceFile + '/image/show/' + table.data[i].gambarLogo,
					'tglAwal': table.data[i].tglAwal,
					'tglAkhir': table.data[i].tglAkhir
				}
				dataSimpan.push(dataTemp);
			}
			this.listData = dataSimpan;
			this.totalRecords = table.totalRow;
			// this.listData = table.data;
		});
	}

	getJenisRekanan() {
		this.httpService.get(Configuration.get().dataMasterNew + '/jeniskontak/findAllData').subscribe(table => {
			this.listJenisRekanan = [];
			this.listJenisRekanan.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.data.length; i++) {
				this.listJenisRekanan.push(
					{
						label: table.data[i].namaJenisKontak,
						value: table.data[i].kode.kode,
					}
				)
			}
		})
	}

	getNegara() {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(table => {
			this.listNegara = [];
			this.listNegara.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.Negara.length; i++) {
				this.listNegara.push(
					{
						label: table.Negara[i].namaNegara,
						value: table.Negara[i].kode,
					}
				)
			}
		})
	}


	getPropinsi() {
		let a = document.getElementById('dropdown-propinsi');
		console.log(a);
		if (this.form.get('kdNegara').value == null) {
			this.listPropinsi = [];
			this.listPropinsi.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + this.form.get('kdNegara').value).subscribe(table => {
				this.listPropinsi = [];
				this.listPropinsi.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < table.Propinsi.length; i++) {
					this.listPropinsi.push(
						{
							label: table.Propinsi[i].namaPropinsi,
							value: table.Propinsi[i].kode.kode,
						}
					)
				}
			})
		}
	}

	getKotaKab() {
		if ((this.form.get('kdNegara').value == null) && (this.form.get('kdPropinsi').value == null)) {
			this.listKotaKab = [];
			this.listKotaKab.push({ label: '-- Pilih --', value: '' })
		} else if (this.form.get('kdPropinsi').value == null) {
			this.listKotaKab = [];
			this.listKotaKab.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + this.form.get('kdPropinsi').value + '&kdNegara=' + this.form.get('kdNegara').value).subscribe(table => {
				this.listKotaKab = [];
				this.listKotaKab.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < table.KotaKabupaten.length; i++) {
					this.listKotaKab.push(
						{
							label: table.KotaKabupaten[i].namaKotaKabupaten,
							value: table.KotaKabupaten[i].kode.kode,
						}
					)
				}
			})
		}
	}

	getKecamatan() {
		if ((this.form.get('kdNegara').value == null) && (this.form.get('kdKotaKabupaten').value == null)) {
			this.listKecamatan = [];
			this.listKecamatan.push({ label: '-- Pilih --', value: '' })
		} else if (this.form.get('kdKotaKabupaten').value == null) {
			this.listKecamatan = [];
			this.listKecamatan.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + this.form.get('kdKotaKabupaten').value + '&kdNegara=' + this.form.get('kdNegara').value).subscribe(table => {
				this.listKecamatan = [];
				this.listKecamatan.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < table.Kecamatan.length; i++) {
					this.listKecamatan.push(
						{
							label: table.Kecamatan[i].namaKecamatan,
							value: table.Kecamatan[i].kode.kode,
						}
					)
				}
			})
		}
	}

	getDesa() {
		if ((this.form.get('kdNegara').value == null) && (this.form.get('kdKecamatan').value == null)) {
			this.listDesa = [];
			this.listDesa.push({ label: '-- Pilih --', value: '' })
		} else if (this.form.get('kdKecamatan').value == null) {
			this.listDesa = [];
			this.listDesa.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + this.form.get('kdKecamatan').value + '&kdNegara=' + this.form.get('kdNegara').value).subscribe(table => {
				this.listDesaAll = table.DesaKelurahan;
				this.listDesa = [];
				this.listDesa.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < table.DesaKelurahan.length; i++) {
					this.listDesa.push(
						{
							label: table.DesaKelurahan[i].namaDesaKelurahan,
							value: table.DesaKelurahan[i].kode.kode,
						}
					)
				}
			})
		}
	}
	//hapus filtering dropdown
	clearFilter(da: any, db: any, dc: any, dd: any, de: any, df: any){
		da.filterValue = '';
		db.filterValue = '';
		dc.filterValue = '';
		dd.filterValue = '';
		de.filterValue = '';
		df.filterValue = '';
	}

	negaraChange(dropdown: any) {
		dropdown.filterValue = '';
		this.getPropinsi();
		this.getPropinsi();
		this.getKotaKab();
		this.getKecamatan();
		this.getDesa();
	}

	provChange(dropdown: any) {
		dropdown.filterValue = '';
		this.getKotaKab();
		this.listKecamatan = [];
		this.listKecamatan.push({ label: '-- Pilih --', value: '' })
		this.listDesa = [];
		this.listDesa.push({ label: '-- Pilih --', value: '' })
		// this.getKecamatan();
		// this.getDesa();
	}

	kotaChange(dropdown: any) {
		dropdown.filterValue = '';
		this.getKecamatan();
		// this.getDesa();
		this.listDesa = [];
		this.listDesa.push({ label: '-- Pilih --', value: '' })
	}

	kecChange(dropdown: any) {
		dropdown.filterValue='';
		this.getDesa();
	}

	kelChange(){
		let kdKelurahan = this.form.get('kdDesaKelurahan').value;
		let data = this.listDesaAll;
		for (var i = 0; i < data.length; i++) {
			if(kdKelurahan == data[i].kode.kode){
				this.form.get('kodePos').setValue(data[i].kodePos)
			}
		}
	}

	kodePos() {
		var str = this.form.get('kodePos').value;
		var regx = /[^0-9]/g;
		var result = str.replace(regx, '');
		this.form.get('kodePos').setValue(result);
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
		let tglAwal;
		let tglAkhir;
		if (cloned.data.tglAkhir == null){
			tglAwal = new Date();
			tglAkhir = new Date();
			tglAwal.setHours(0, 0, 0, 0);
			tglAkhir.setHours(23, 59, 0, 0);
		}else{
			tglAwal = new Date(cloned.data.tglAwal * 1000);
			tglAkhir = new Date(cloned.data.tglAkhir * 1000);
		}
		let fixHub = {
			"kdJenisKontak": cloned.data.kdJenisKontak,
			"kdNegara": cloned.data.kdNegara,
			"kdKecamatan": cloned.data.kdKecamatan,
			"rtrw": cloned.data.rTRW,
			"mobilePhone1": cloned.data.mobilePhone1,
			"namaLengkap": cloned.data.namaKontak,
			"kdPropinsi": cloned.data.kdPropinsi,
			"kdDesaKelurahan": cloned.data.kdDesaKelurahan,
			"alamatLengkap": cloned.data.alamatLengkap,
			"faksimile1": cloned.data.faksimile1,
			"gambarLogo": cloned.data.gambarLogo,
			"kdKotaKabupaten": cloned.data.kdKotaKabupaten,
			"kodePos": cloned.data.kodePos,
			"alamatEmail": cloned.data.alamatEmail,
			"fixedPhone1": cloned.data.fixedPhone1,
			"website": cloned.data.website,
			"statusEnabled": cloned.data.statusEnabled,
			"noRec": cloned.data.noRec,
			"tglAkhir": tglAkhir,
			"tglAwal": tglAwal
		}
		this.smbrFile = cloned.data.pathImage;
		this.namaFile = cloned.data.gambarLogo;
		this.versi = cloned.version;
		this.noRec = cloned.noRec;
		return fixHub;
	}

	onRowSelect(event) {
		console.log(event)
		let cloned = this.clone(event);
		this.formAktif = false;
		this.form.setValue(cloned);
		console.log(JSON.stringify(this.form.value));
		this.getPropinsi();
		this.getKotaKab();
		this.getKecamatan();
		this.getDesa();
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
			// formSubmit.kdNegara = this.form.get('kdJenisKelamin').value.kdNegara;
			// formSubmit.kdJenisKelamin = this.form.get('kdJenisKelamin').value.kode;
			// if (this.form.get('kdTitleHead').value != null) {
			// 	formSubmit.kdTitleHead = this.form.get('kdTitleHead').value.kode;
			// }
			formSubmit.statusEnabled = true
			formSubmit.gambarLogo = this.namaFile
			formSubmit.tglAwal = this.setTimeStamp(this.form.get('tglAwal').value);
			formSubmit.tglAkhir = this.setTimeStamp(this.form.get('tglAkhir').value);

			console.log(this.form.value)
			console.log(JSON.stringify(this.form.value));
			this.httpService.post(Configuration.get().dataMasterNew + '/kontak-alamat-rekanan/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				// this.getDataGrid(this.page, this.rows, this.pencarian);
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
		formSubmit.statusEnabled = true;
		formSubmit.gambarLogo = this.namaFile;
		formSubmit.tglAwal = this.setTimeStamp(this.form.get('tglAwal').value);
		formSubmit.tglAkhir = this.setTimeStamp(this.form.get('tglAkhir').value);
		this.versi = 1;
		console.log(JSON.stringify(this.form.value));
		this.httpService.update(Configuration.get().dataMasterNew + '/kontak-alamat-rekanan/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/kontak-alamat-rekanan/del/' + this.form.get('noRec').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let noRec = this.form.get('noRec').value;
		if (noRec == null || noRec == undefined || noRec == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Rekanan / Partners');
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

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaTitle').value)
	}

	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload?noProfile=false';
	}

	fileUpload(event) {
		this.namaFile = event.xhr.response;
		// this.form.controls["pathFile"].setValue(this.namaFile);
		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + this.namaFile;
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}

}


