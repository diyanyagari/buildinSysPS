import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-mekanisme-interaksi-produk',
	templateUrl: './mekanisme-interaksi-produk.component.html',
	styleUrls: ['./mekanisme-interaksi-produk.component.scss'],
	providers: [ConfirmationService]
})
export class MekanismeInteraksiProdukComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	listNegara: any = [];
	listKelompokproduk: any = [];
	listGenKelompokProduk: any = [];
	listMerkProduk: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
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
			'namaMekanismeInteraksi': new FormControl(null, Validators.required),
			'kdGeneralKP': new FormControl(null, Validators.required),
			'kdGeneralKelompokProduk': new FormControl(null),
			'kdNegara': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getGenKelompokProduk();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/mekanismeinteraksiproduk/findAll?page=' + page + '&rows=' + rows + '&dir=namaMekanismeInteraksi&sort=desc&namaMekanismeInteraksi' + cari).subscribe(table => {
			this.listData = table.MekanismeInteraksiProduk;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/mekanismeinteraksiproduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaMekanismeInteraksi&sort=desc&namaMekanismeInteraksi=' + this.pencarian).subscribe(table => {
			this.listData = table.MekanismeInteraksiProduk;
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
			"namaMekanismeInteraksi": cloned.data.namaMekanismeInteraksi,
			"kdGeneralKP": {
				"kdNegara": cloned.data.generalKelompokProduk.id.kdNegara,
				"kode": cloned.data.generalKelompokProduk.id.kode
			},
			"kdGeneralKelompokProduk": cloned.data.kdGKelompokProduk,
			"kdNegara": cloned.data.kdNegara,
			"reportDisplay": cloned.data.reportDisplay,
			"namaExternal": cloned.data.namaExternal,
			"kodeExternal": cloned.data.kodeExternal,
			"statusEnabled": cloned.data.statusEnabled,
			"kode": cloned.data.kode
		}
		console.log(fixHub);
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		// console.log(event)
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
			let mekanismeIP = {
				"kdGKelompokProduk": formSubmit.kdGeneralKelompokProduk = formSubmit.kdGeneralKP.kode,
				"kdNegara": formSubmit.kdNegara = formSubmit.kdGeneralKP.kdNegara,
				"kode": this.form.get('kode').value,
				"kodeExternal": this.form.get('kodeExternal').value,
				"namaExternal": this.form.get('namaExternal').value,
				"namaMekanismeInteraksi": this.form.get('namaMekanismeInteraksi').value,
				"reportDisplay": this.form.get('reportDisplay').value,
				"statusEnabled": this.form.get('statusEnabled').value
			}
			// console.log(JSON.stringify(mekanismeIP));
			this.httpService.post(Configuration.get().dataMasterNew + '/mekanismeinteraksiproduk/save', mekanismeIP).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
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
		let mekanismeIP = {
			"kdGKelompokProduk": formSubmit.kdGeneralKelompokProduk = formSubmit.kdGeneralKP.kode,
			"kdNegara": formSubmit.kdNegara = formSubmit.kdGeneralKP.kdNegara,
			"kode": this.form.get('kode').value.kode,
			"kodeExternal": this.form.get('kodeExternal').value,
			"namaExternal": this.form.get('namaExternal').value,
			"namaMekanismeInteraksi": this.form.get('namaMekanismeInteraksi').value,
			"reportDisplay": this.form.get('reportDisplay').value,
			"statusEnabled": this.form.get('statusEnabled').value
		}
		this.httpService.update(Configuration.get().dataMasterNew + '/mekanismeinteraksiproduk/update', mekanismeIP).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/mekanismeinteraksiproduk/del/' + this.form.get('kode').value.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Mekanisme Interaksi');
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

	getGenKelompokProduk() {
		this.httpService.get(Configuration.get().dataMasterNew + '/generalkelompokproduk/findAllDataV2').subscribe(res => {
			this.listGenKelompokProduk = [];
			this.listGenKelompokProduk.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listGenKelompokProduk.push({
					label: res.data[i].generalKelompokProduk, value: {
						"kdNegara": res.data[i].kode.kdNegara,
						"kode": res.data[i].kode.kode
					}
				})
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
		this.form.get('reportDisplay').setValue(this.form.get('namaMekanismeInteraksi').value)
	}

}


