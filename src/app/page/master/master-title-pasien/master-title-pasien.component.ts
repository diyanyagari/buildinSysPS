import { Component, OnInit, OnChanges } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-master-title-pasien',
	templateUrl: './master-title-pasien.component.html',
	styleUrls: ['./master-title-pasien.component.scss'],
	providers: [ConfirmationService]
})
export class MasterTitlePasienComponent implements OnInit {

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
	listNegara: any = [];
	listSttsPerkawinan: any = [];
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
			'kdTitleHead': new FormControl(null),
			'maxAge': new FormControl(null),
			'minAge': new FormControl(null),
			'kdStatusPerkawinan': new FormControl(null),
			'kdJenisKelamin': new FormControl(null),
			'kdNegara': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getJenisKelamin(null);
		this.getTitlePasienHead();
		this.getListNegara();
		this.getStatusPerkawinan();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/titlePasien/findAll?page=' + page + '&rows=' + rows + '&dir=namaTitle&sort=desc&namaTitlePasien' + cari).subscribe(table => {
			this.listData = table.TitlePasien;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/titlePasien/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTitle&sort=desc&namaTitlePasien=' + this.pencarian).subscribe(table => {
			this.listData = table.TitlePasien;
		});
	}

	getJenisKelamin(kdNegara) {
		if (kdNegara == null) {
			this.listJenisKelamin = [];
			this.listJenisKelamin.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJk?kdNegara=' + kdNegara).subscribe(table => {
				this.listJenisKelamin = [];
				this.listJenisKelamin.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < table.JenisKelamin.length; i++) {
					this.listJenisKelamin.push(
						{
							label: table.JenisKelamin[i].namaJenisKelamin,
							value: table.JenisKelamin[i].kode.kode
						}
					)
				}
			})
		}
	}

	getTitlePasienHead() {
		this.httpService.get(Configuration.get().dataMasterNew + '/titlePasien/findAllData').subscribe(table => {
			this.listTitleHead = [];
			this.listTitleHead.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.data.length; i++) {
				this.listTitleHead.push(
					{
						label: table.data[i].namaTitle,
						value: table.data[i].kode.kode
					}
				)
			}
		})
	}

	getListNegara() {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(table => {
			this.listNegara = [];
			this.listNegara.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.Negara.length; i++) {
				this.listNegara.push(
					{
						label: table.Negara[i].namaNegara,
						value: table.Negara[i].kode
					}
				)
			}
		})
	}

	getStatusPerkawinan() {
		this.httpService.get(Configuration.get().dataMasterNew + '/status/status-perkawinan').subscribe(table => {
			this.listSttsPerkawinan = [];
			this.listSttsPerkawinan.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.data.length; i++) {
				this.listSttsPerkawinan.push(
					{
						label: table.data[i].namaStatus,
						value: table.data[i].kode
					}
				)
			}
		})
	}

	onChange(event) {
		// console.log(event.value)
		this.form.get('kdJenisKelamin').setValue(null)
		this.getJenisKelamin(event.value);
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
			"kdTitleHead": cloned.data.kdTitleHead,
			"maxAge": cloned.data.maxAge,
			"minAge": cloned.data.minAge,
			"kdStatusPerkawinan": cloned.data.kdStatusPerkawinan,
			"kdJenisKelamin": cloned.data.kdJenisKelamin,
			"kdNegara": cloned.data.kdNegara,
			"reportDisplay": cloned.data.reportDisplay,
			"namaExternal": cloned.data.namaExternal,
			"kodeExternal": cloned.data.kodeExternal,
			"statusEnabled": cloned.data.statusEnabled,
			"kode": cloned.data.kode.kode
		}
		this.getJenisKelamin(cloned.data.kdNegara);
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
			console.log(this.form.value)
			console.log(JSON.stringify(this.form.value));
			this.httpService.post(Configuration.get().dataMasterNew + '/titlePasien/save', this.form.value).subscribe(response => {
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
		this.httpService.update(Configuration.get().dataMasterNew + '/titlePasien/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/titlePasien/del/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Title Pasien');
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


