import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-penyebab-diagnosa',
	templateUrl: './penyebab-diagnosa.component.html',
	styleUrls: ['./penyebab-diagnosa.component.scss'],
	providers: [ConfirmationService]
})
export class PenyebabDiagnosaComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	listDiagnosa: any = [];
	listKelompokDiagnosa: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	kode: any;
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
		private confirmationService: ConfirmationService) { }


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
			'kdKelompokPDiagnosa': new FormControl(null, Validators.required),
			'kdDiagnosa': new FormControl(null, Validators.required),
			'namaPenyebabDiagnosa': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getDiagnosa();
		this.getKelompokDiagnosa();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/penyebabdiagnosa/findAll?page=' + page + '&rows=' + rows + '&dir=namaPenyebabDiagnosa&sort=desc&namaPenyebabDiagnosa' + cari).subscribe(table => {
			this.listData = table.PenyebabDiagnosa;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/penyebabdiagnosa/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPenyebabDiagnosa&sort=desc&namaPenyebabDiagnosa=' + this.pencarian).subscribe(table => {
			this.listData = table.PenyebabDiagnosa;
		});
	}

	getDiagnosa() {
		this.httpService.get(Configuration.get().dataMasterNew + '/diagnosa/findAllData').subscribe(res => {
			this.listDiagnosa = [];
			this.listDiagnosa.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listDiagnosa.push({ label: res.data[i].namaDiagnosa, value: res.data[i].kode.kode })
			};
		})
	}

	getKelompokDiagnosa() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kelompokpenyebabdiagnosa/findAllData').subscribe(res => {
			this.listKelompokDiagnosa = [];
			this.listKelompokDiagnosa.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listKelompokDiagnosa.push({ label: res.data[i].namaKelompokPDiagnosa, value: res.data[i].kode.kode })
			};
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
			"kdKelompokPDiagnosa": cloned.data.kdKelompokPDiagnosa,
			"kdDiagnosa": cloned.data.kdDiagnosa,
			"namaPenyebabDiagnosa": cloned.data.namaPenyebabDiagnosa,
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
			this.httpService.post(Configuration.get().dataMasterNew + '/penyebabdiagnosa/save', this.form.value).subscribe(response => {
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
		this.httpService.update(Configuration.get().dataMasterNew + '/penyebabdiagnosa/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/penyebabdiagnosa/del/' + this.form.get('kode').value).subscribe(response => {
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

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaPenyebabDiagnosa').value)
	}

}


