import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-kasus-penyakit',
	templateUrl: './kasus-penyakit.component.html',
	styleUrls: ['./kasus-penyakit.component.scss'],
	providers: [ConfirmationService]
})
export class KasusPenyakitComponent implements OnInit {

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
	listPelayananProfile: any = [];

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
			"kdPelayananProfile": "string",
			"kode": 0,
			"kodeExternal": "string",
			"namaExternal": "string",
			"namaKasusPenyakit": "string",
			"reportDisplay": "string",
			"statusEnabled": true,
		}
		this.formAktif = true;
		this.form = this.fb.group({
			'kdPelayananProfile': new FormControl(null),
			'namaKasusPenyakit': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getProgramHead();
		this.getPelayananProfile();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/kasuspenyakit/findAll?page=' + page + '&rows=' + rows + '&dir=namaKasusPenyakit&sort=desc&namaKasusPenyakit' + cari).subscribe(table => {
			this.listData = table.KasusPenyakit;
			this.totalRecords = table.totalRow;
			// this.httpService.get(Configuration.get().dataMasterNew + '/pelayananprofile/findAllData').subscribe(res => {
			// 	for (var i = 0; i < res.data.length; i++) {
			// 		this.listData.push(res.data[i].namaPelayananProfile)
			// 	};
			// 	this.listData.push(res.data.namaPelayananProfile)
			// })
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kasuspenyakit/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKasusPenyakit&sort=desc&namaKasusPenyakit=' + this.pencarian).subscribe(table => {
			this.listData = table.KasusPenyakit;
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
			"kdPelayananProfile": cloned.kdPelayananProfile,
			"namaKasusPenyakit": cloned.namaKasusPenyakit,
			"statusEnabled": cloned.statusEnabled,
			"reportDisplay": cloned.reportDisplay,
			"kodeExternal": cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"kode": cloned.kode
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
			this.httpService.post(Configuration.get().dataMasterNew + '/kasuspenyakit/save', this.form.value).subscribe(response => {
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
		this.httpService.update(Configuration.get().dataMasterNew + '/kasuspenyakit/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/kasuspenyakit/del/' + this.form.get('kode').value).subscribe(response => {
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

	getPelayananProfile() {
		this.httpService.get(Configuration.get().dataMaster + '/pelayananprofile/findAllData').subscribe(res => {
			this.listPelayananProfile = [];
			this.listPelayananProfile.push({ label: '--Pilih Pelayanan Profile--', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listPelayananProfile.push({ label: res.data[i].namaPelayananProfile, value: res.data[i].kode })
			};
		})
		// error => {
		// 	this.listPelayananProfile = [];
		// 	this.listPelayananProfile.push({ label: '-- ' + error + ' --', value: '' })
		// });

	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaKasusPenyakit').value)
	}

}


