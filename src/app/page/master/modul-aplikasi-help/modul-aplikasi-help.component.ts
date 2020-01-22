import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-modul-aplikasi-help',
	templateUrl: './modul-aplikasi-help.component.html',
	styleUrls: ['./modul-aplikasi-help.component.scss'],
	providers: [ConfirmationService]
})
export class ModulAplikasiHelpComponent implements OnInit {


	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	manualHelpLink: any = [];
	modulAplikasi: any = [];
	modulVersion: any = [];
	objekModulAplikasi: any = [];
	manualHelp: any = [];
	statusEnabled: any;
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
			'kdManualHelp': new FormControl('', Validators.required),
			'kdModulAplikasi': new FormControl('', Validators.required),
			'kdObjekModulAplikasi': new FormControl('', Validators.required),
			'kdVersion': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getModulAplikasi();
		this.getVersion();
		this.getObjekModulAplikasi();
		this.getManualHelp();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasihelp/findAll?page=' + page + '&rows=' + rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi' + cari).subscribe(table => {
			this.listData = table.ModulAplikasiHelp;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		let dataSimpan = [];
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasihelp/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
			this.listData = table.ModulAplikasiHelp;
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
			"kdManualHelp": cloned.data.kode.kdManualHelp,
			"kdModulAplikasi": cloned.data.kode.kdModulAplikasi,
			"kdObjekModulAplikasi": cloned.data.kode.kdObjekModulAplikasi,
			"kdVersion": cloned.data.kode.kdVersion,
			"statusEnabled": cloned.data.statusEnabled,
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
			this.httpService.post(Configuration.get().dataMasterNew + '/modulaplikasihelp/save', this.form.value).subscribe(response => {
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
		this.httpService.update(Configuration.get().dataMasterNew + '/modulaplikasihelp/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/modulaplikasihelp/del/'
			+ this.form.get('kdManualHelp').value
			+ '/'
			+ this.form.get('kdObjekModulAplikasi').value
			+ '/'
			+ this.form.get('kdVersion').value
			+ '/'
			+ this.form.get('kdModulAplikasi').value
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
	}

	getManualHelpLink() {
		this.httpService.get(Configuration.get().dataMasterNew + '/manualhelp/findAll').subscribe(res => {
			this.manualHelpLink = [];
			this.manualHelpLink.push({ label: '-- Silahkan Pilih Manual Help Head --', value: '' })
			for (var i = 0; i < res.ManualHelp.length; i++) {
				this.manualHelpLink.push({ label: res.ManualHelp[i].namaManualLinkTo, value: res.ManualHelp[i].noManualHelp })
			};
		})

	}

	getModulAplikasi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllData').subscribe(res => {
			this.modulAplikasi = [];
			this.modulAplikasi.push({ label: '-- Silahkan Pilih Modul Aplikasi --', value: '' })
			for (var i = 0; i < res.ModulAplikasi.length; i++) {
				this.modulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		})
	}

	getVersion() {
		this.httpService.get(Configuration.get().dataMasterNew + '/version/findAllData').subscribe(res => {
			this.modulVersion = [];
			this.modulVersion.push({ label: '-- Silahkan Pilih Versi --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.modulVersion.push({ label: res.data[i].namaVersion, value: res.data[i].kode })
			};
		})
	}

	getObjekModulAplikasi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/objekmodulaplikasi/findAllItem').subscribe(res => {
			this.objekModulAplikasi = [];
			this.objekModulAplikasi.push({ label: '-- Silahkan Pilih Objek Modul Aplikasi --', value: '' })
			for (var i = 0; i < res.ObjekModulAplikasi.length; i++) {
				this.objekModulAplikasi.push({ label: res.ObjekModulAplikasi[i].namaObjekModulAplikasi, value: res.ObjekModulAplikasi[i].kode })
			};
		})
	}

	getManualHelp() {
		this.httpService.get(Configuration.get().dataMasterNew + '/manualhelp/findAllData').subscribe(res => {
			this.manualHelp = [];
			this.manualHelp.push({ label: '-- Silahkan Pilih Manual Help --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.manualHelp.push({ label: res.data[i].namaJudulManualHelp, value: res.data[i].kode })
			};
		})
	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}
}


