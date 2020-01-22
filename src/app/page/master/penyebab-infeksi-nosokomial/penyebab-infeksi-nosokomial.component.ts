import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-penyebab-infeksi-nosokomial',
	templateUrl: './penyebab-infeksi-nosokomial.component.html',
	styleUrls: ['./penyebab-infeksi-nosokomial.component.scss'],
	providers: [ConfirmationService]
})
export class PenyebabInfeksiNosokomialComponent implements OnInit {

	program: any;
	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	pelayananProfileHead: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	listPegawaiKepala: any = [];

	kode: any;

	kdProfile: any;
	kdProgram: any;
	kdDepartemen: any;

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

		let data = {
			"hariBukaDlmMinggu": "string",
			"jamBukaDlmHari": "string",
			"kdPelayananProfileHead": 0,
			"kode": 0,
			"kodeExternal": "string",
			"namaExternal": "string",
			"namaPelayananProfile": "string",
			"qtyBukaDlmMinggu": 0,
			"reportDisplay": "string",
			"statusEnabled": true,
			"kdDepartemen": ""
		}
		this.formAktif = true;
		this.form = this.fb.group({
			// 'kdPelayananProfileHead': new FormControl(null),
			// 'jamBukaDlmHari': new FormControl(''),
			// 'hariBukaDlmMinggu': new FormControl(''),
			// 'namaPelayananProfile': new FormControl('', Validators.required),
			// 'qtyBukaDlmMinggu': new FormControl(null),
			'namaPenyebabIN': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getPelayananProfileHead();
		// this.getPegawaiKepala();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/penyebabinfeksinosokomial/findAll?page=' + page + '&rows=' + rows + '&dir=namaPenyebabIN&sort=desc&namaPenyebabInfeksiNosokomial' + cari).subscribe(table => {
			this.listData = table.PenyebabInfeksiNosokomial;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/penyebabinfeksinosokomial/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPenyebabIN&sort=desc&namaPenyebabInfeksiNosokomial=' + this.pencarian).subscribe(table => {
			this.listData = table.PenyebabInfeksiNosokomial;
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
			"namaPenyebabIN": cloned.data.namaPenyebabIN,
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
			// let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

			// let formSubmit = this.form.value;
			// formSubmit.tglBerdiri = tglBerdiri;
			this.httpService.post(Configuration.get().dataMasterNew + '/penyebabinfeksinosokomial/save', this.form.value).subscribe(response => {
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
		this.httpService.update(Configuration.get().dataMasterNew + '/penyebabinfeksinosokomial/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/penyebabinfeksinosokomial/del/' + this.form.get('kode').value).subscribe(response => {
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

	getPelayananProfileHead() {
		this.httpService.get(Configuration.get().dataMasterNew + '/pelayananprofile/findHead').subscribe(res => {
			this.pelayananProfileHead = [];
			this.pelayananProfileHead.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.pelayananProfileHead.push({ label: res.data[i].namaPelayananProfile, value: res.data[i].kode })
			};
		})
		// },
		// 	error => {
		// 		this.pelayananProfileHead = [];
		// 		this.pelayananProfileHead.push({ label: '-- ' + error + ' --', value: '' })
		// 	});

	}

	// getPegawaiKepala() {
	// 	this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Pegawai&select=namaLengkap,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
	// 		this.listPegawaiKepala = [];
	// 		this.listPegawaiKepala.push({ label: '--Pilih Pegawai Kepala--', value: '' })
	// 		for (var i = 0; i < res.data.data.length; i++) {
	// 			this.listPegawaiKepala.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id_kode })
	// 		};
	// 	},
	// 		error => {
	// 			this.listPegawaiKepala = [];
	// 			this.listPegawaiKepala.push({ label: '-- ' + error + ' --', value: '' })
	// 		});

	// }

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaPenyebabIN').value)
	}

}


