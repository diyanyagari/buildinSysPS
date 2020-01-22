import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-program',
	templateUrl: './program.component.html',
	styleUrls: ['./program.component.scss'],
	providers: [ConfirmationService]
})
export class ProgramComponent implements OnInit {

	program: any;
	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	listParentProgram: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	listPegawaiKepala: any = [];
	listAlamat: any = [];
	listPendidikan: any = [];

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
				label: 'Excel', icon: 'fa-file-excel-o', command: () => {
					// this.downloadExel();
				}
			}];

		let data = {
			"kdDepartemen": "string",
			"kdPegawaiKepala": "string",
			"kdProgramHead": 0,
			"kode": 0,
			"kdAlamat": 0,
			"kdPendidikan": 0,
			"kodeExternal": "string",
			"namaExternal": "string",
			"namaProgram": "string",
			"noSKBerdiri": "string",
			"reportDisplay": "string",
			"statusEnabled": true,
			"tglBerdiri": 0
		}
		this.formAktif = true;
		this.form = this.fb.group({
			'kdAlamat': new FormControl(null),
			'kdPendidikan': new FormControl(null),
			'kdProgramHead': new FormControl(null),
			'kdPegawaiKepala': new FormControl(null),
			'namaProgram': new FormControl(null, Validators.required),
			'tglBerdiri': new FormControl(''),
			'noSKBerdiri': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getProgramHead();
		this.getPegawaiKepala();
		this.getAlamat();
		this.getPendidikan();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/program/findAll?page=' + page + '&rows=' + rows + '&dir=namaProgram&sort=desc&namaProgram' + cari).subscribe(table => {
			this.listData = table.Program;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/program/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaProgram&sort=desc&namaProgram=' + this.pencarian).subscribe(table => {
			this.listData = table.Program;
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
			"kdAlamat": cloned.kdAlamat,
			"kdPendidikan": cloned.kdPendidikan,
			"kdProgramHead": cloned.kdProgramHead,
			"kdPegawaiKepala": cloned.kdPegawaiKepala,
			"namaProgram": cloned.namaProgram,
			"tglBerdiri": new Date(cloned.tglBerdiri * 1000),
			"noSKBerdiri": cloned.noSKBerdiri,
			"statusEnabled": cloned.statusEnabled,
			"reportDisplay": cloned.reportDisplay,
			"kodeExternal": cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"kode": cloned.kode.kode
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
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
			let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

			let formSubmit = this.form.value;
			formSubmit.tglBerdiri = tglBerdiri;
			// console.log(this.form.value)
			this.httpService.post(Configuration.get().dataMasterNew + '/program/save', this.form.value).subscribe(response => {
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
		let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

		let formSubmit = this.form.value;
		formSubmit.tglBerdiri = tglBerdiri;
		this.httpService.update(Configuration.get().dataMasterNew + '/program/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/program/del/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Program');
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

	getProgramHead() {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Program&select=id.kode,namaProgram&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listParentProgram = [];
			this.listParentProgram.push({ label: '--Pilih Data Parent Program--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.listParentProgram.push({ label: res.data.data[i].namaProgram, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.listParentProgram = [];
				this.listParentProgram.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	getPegawaiKepala() {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Pegawai&select=namaLengkap,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listPegawaiKepala = [];
			this.listPegawaiKepala.push({ label: '--Pilih Pegawai Kepala--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.listPegawaiKepala.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.listPegawaiKepala = [];
				this.listPegawaiKepala.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	getAlamat() {
		this.httpService.get(Configuration.get().dataMaster + '/alamat/getAlamatProfile').subscribe(res => {
			this.listAlamat = [];
			this.listAlamat.push({ label: '--Pilih Alamat--', value: '' })
			for (var i = 0; i < res.alamat.length; i++) {
				this.listAlamat.push({ label: res.alamat[i].alamatLengkap, value: res.alamat[i].kode })
			};
		},
			error => {
				this.listAlamat = [];
				this.listAlamat.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	getPendidikan() {
		this.httpService.get(Configuration.get().dataMaster + '/pendidikan/findPendidikan').subscribe(res => {
			this.listPendidikan = [];
			this.listPendidikan.push({ label: '--Pilih Pendidikan--', value: '' })
			for (var i = 0; i < res.Pendidikan.length; i++) {
				this.listPendidikan.push({ label: res.Pendidikan[i].namaPendidikan, value: res.Pendidikan[i].kode })
			};
		},
			error => {
				this.listPendidikan = [];
				this.listPendidikan.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaProgram').value)
	}

}


