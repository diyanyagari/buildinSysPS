import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-master-title',
	templateUrl: './master-title.component.html',
	styleUrls: ['./master-title.component.scss'],
	providers: [ConfirmationService]
})
export class MasterTitleComponent implements OnInit {

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
	listJenisKelamin: any = [];
	listTitleHead: any = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;

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
				label: 'Excel', icon: 'fa-file-excel-o', command: () => {
					// this.downloadExel();
				}
			}];

		this.formAktif = true;
		this.form = this.fb.group({
			'namaTitle': new FormControl(null, Validators.required),
			'ageMax': new FormControl(null, Validators.required),
			'ageMin': new FormControl(null, Validators.required),
			'kdJenisKelamin': new FormControl(null),
			'kdNegara': new FormControl(null),
			'kdTitleHead': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getJenisKelamin();
		this.getTitleHead();
		// this.getPegawaiKepala();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/title/findAll?page=' + page + '&rows=' + rows + '&dir=namaTitle&sort=desc&namaTitle' + cari).subscribe(table => {
			this.listData = table.Title;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/title/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTitle&sort=desc&namaTitle=' + this.pencarian).subscribe(table => {
			this.listData = table.Title;
		});
	}

	getJenisKelamin() {
		this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJkFromProfile').subscribe(table => {
			this.listJenisKelamin = [];
			this.listJenisKelamin.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.JenisKelamin.length; i++) {
				this.listJenisKelamin.push(
					{
						label: table.JenisKelamin[i].namaJenisKelamin,
						value: {
							'kode': table.JenisKelamin[i].kode.kode,
							'kdNegara': table.JenisKelamin[i].kode.kdNegara,
						}
					}
				)
			}
		})
	}

	getTitleHead() {
		this.httpService.get(Configuration.get().dataMasterNew + '/title/findAllData').subscribe(table => {
			this.listTitleHead = [];
			this.listTitleHead.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.data.length; i++) {
				this.listTitleHead.push(
					{
						label: table.data[i].namaTitle,
						value: table.data[i].kode
					}
				)
			}
		})
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
			"namaTitle": cloned.data.namaTitle,
			"ageMax": cloned.data.ageMax,
			"ageMin": cloned.data.ageMin,
			"kdJenisKelamin": {
				'kode': cloned.data.kdJenisKelamin,
				'kdNegara': cloned.data.kdNegara
			},
			"kdNegara": cloned.data.kdNegara,
			"kdTitleHead": {
				'kode': cloned.data.kdTitleHead,
				'kdProfile': cloned.data.kode.kdProfile,
			},
			"reportDisplay": cloned.data.reportDisplay,
			"namaExternal": cloned.data.namaExternal,
			"kodeExternal": cloned.data.kodeExternal,
			"statusEnabled": cloned.data.statusEnabled,
			"kode": cloned.data.kode.kode
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		console.log(event)
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
			formSubmit.kdNegara = this.form.get('kdJenisKelamin').value.kdNegara;
			formSubmit.kdJenisKelamin = this.form.get('kdJenisKelamin').value.kode;
			if (this.form.get('kdTitleHead').value != null) {
				formSubmit.kdTitleHead = this.form.get('kdTitleHead').value.kode;
			}
			// console.log(this.form.value)
			this.httpService.post(Configuration.get().dataMasterNew + '/title/save', this.form.value).subscribe(response => {
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
		formSubmit.kdNegara = this.form.get('kdJenisKelamin').value.kdNegara;
		formSubmit.kdJenisKelamin = this.form.get('kdJenisKelamin').value.kode;
		if (this.form.get('kdTitleHead').value != null) {
			formSubmit.kdTitleHead = this.form.get('kdTitleHead').value.kode;
		}
		this.httpService.update(Configuration.get().dataMasterNew + '/title/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/title/del/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Title');
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

}


