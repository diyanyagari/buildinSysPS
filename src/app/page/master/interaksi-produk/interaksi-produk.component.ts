import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-interaksi-produk',
	templateUrl: './interaksi-produk.component.html',
	styleUrls: ['./interaksi-produk.component.scss'],
	providers: [ConfirmationService]
})
export class InteraksiProdukComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	listNegara: any = [];
	listMekanismeIP: any = [];
	listTypeInteraksi: any = [];
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
			'namaEfekInteraksi': new FormControl(null, Validators.required),
			'kdMekanismeInteraksi': new FormControl(null, Validators.required),
			'kdTI': new FormControl(null),
			'kdTypeInteraksi': new FormControl(null),
			'keteranganLainnya': new FormControl(null),
			'kdNegara': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getMekanismeInteraksi();
		this.getTypeInteraksi();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/interaksiproduk/findAll?page=' + page + '&rows=' + rows + '&dir=namaEfekInteraksi&sort=desc&namaEfekInteraksi' + cari).subscribe(table => {
			this.listData = table.InteraksiProduk;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/interaksiproduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaEfekInteraksi&sort=desc&namaInteraksiProduk=' + this.pencarian).subscribe(table => {
			this.listData = table.InteraksiProduk;
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
			"namaEfekInteraksi": cloned.data.namaEfekInteraksi,
			"kdMekanismeInteraksi": cloned.data.kdMekanismeInteraksi,
			"kdTI": {
				"kdNegara": cloned.data.kdNegara,
				"kodeTypeInteraksi": cloned.data.kdTypeInteraksi
			},
			"kdTypeInteraksi": cloned.data.kdTypeInteraksi,
			"keteranganLainnya": cloned.data.keteranganLainnya,
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
			let mekanismeIP = {
				"namaEfekInteraksi": this.form.get('namaEfekInteraksi').value,
				"kdMekanismeInteraksi": this.form.get('kdMekanismeInteraksi').value,
				"kdTypeInteraksi": formSubmit.kdTI.kodeTypeInteraksi,
				"keteranganLainnya": "",
				"kdNegara": formSubmit.kdTI.kdNegara,
				"kode": this.form.get('kode').value,
				"kodeExternal": this.form.get('kodeExternal').value,
				"namaExternal": this.form.get('namaExternal').value,
				"reportDisplay": this.form.get('reportDisplay').value,
				"statusEnabled": this.form.get('statusEnabled').value
			}
			console.log(JSON.stringify(mekanismeIP));
			this.httpService.post(Configuration.get().dataMasterNew + '/interaksiproduk/save', mekanismeIP).subscribe(response => {
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
				"namaEfekInteraksi": this.form.get('namaEfekInteraksi').value,
				"kdMekanismeInteraksi": this.form.get('kdMekanismeInteraksi').value,
				"kdTypeInteraksi": formSubmit.kdTI.kodeTypeInteraksi,
				"keteranganLainnya": "",
				"kdNegara": formSubmit.kdTI.kdNegara,
				"kode": this.form.get('kode').value.kode,
				"kodeExternal": this.form.get('kodeExternal').value,
				"namaExternal": this.form.get('namaExternal').value,
				"reportDisplay": this.form.get('reportDisplay').value,
				"statusEnabled": this.form.get('statusEnabled').value
			}
		this.httpService.update(Configuration.get().dataMasterNew + '/interaksiproduk/update', mekanismeIP).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/interaksiproduk/del/' + this.form.get('kode').value.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Interaksi Produk');
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

	// getGenKelompokProduk() {
	// 	this.httpService.get(Configuration.get().dataMasterNew + '/generalkelompokproduk/findAllDataV2').subscribe(res => {
	// 		this.listGenKelompokProduk = [];
	// 		this.listGenKelompokProduk.push({ label: '-- Pilih --', value: '' })
	// 		for (var i = 0; i < res.data.length; i++) {
	// 			this.listGenKelompokProduk.push({
	// 				label: res.data[i].generalKelompokProduk, value: {
	// 					"kdNegara": res.data[i].kode.kdNegara,
	// 					"kode": res.data[i].kode.kode
	// 				}
	// 			})
	// 		};
	// 	})
	// }

	getMekanismeInteraksi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/mekanismeinteraksiproduk/findAllData').subscribe(res => {
			this.listMekanismeIP = [];
			this.listMekanismeIP.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listMekanismeIP.push({ label: res.data[i].namaMekanismeInteraksi, value: res.data[i].kode.kode })
			};
		})
	}

	getTypeInteraksi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/interaksiproduk/getTypeInteraksi').subscribe(res => {
			this.listTypeInteraksi = [];
			this.listTypeInteraksi.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listTypeInteraksi.push({
					label: res.data[i].namaTypeInteraksi, value: {
						"kodeTypeInteraksi": res.data[i].kode.kdTypeInteraksi,
						"kdNegara": res.data[i].kode.kdNegara
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
		this.form.get('reportDisplay').setValue(this.form.get('namaEfekInteraksi').value)
	}

}


