import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, ToggleButtonModule } from 'primeng/primeng';

@Component({
	selector: 'app-histori-tujuan',
	templateUrl: './histori-tujuan.component.html',
	styleUrls: ['./histori-tujuan.component.scss'],
	providers: [ConfirmationService]
})
export class HistoriTujuanComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	formCari: FormGroup;
	items: MenuItem[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	kode: any;
	listData: any = [];
	listStatusUmur: any = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	listTujuan: any[];
	statusTujuan: boolean = true;
	noUrut: any[];
	disNoUrut: boolean = true;
	trashButton: boolean = true;
	noHistori: any;
	cariTglAkhir: any;
	cariTglAwal: any;



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
		this.trashButton = true;
		this.disNoUrut = true;
		this.listTujuan = [];
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
			// 'noHistori': new FormControl(null),
			// 'keteranganLainnya': new FormControl(null),
			// 'noUrut': new FormControl(null),
			// 'tujuanProfile': new FormControl(null),
			// 'statusEnabled': new FormControl(''),
			'tglAkhir': new FormControl(new Date()),
			'tglAwal': new FormControl(new Date())
		});
		this.formCari = this.fb.group({
			'cariTglAwal': new FormControl(new Date()),
			'cariTglAkhir': new FormControl(new Date())
		})
		this.getDataGrid(this.page, this.rows, this.pencarian);
	}

	ngAfterViewInit() {

		var x = document.getElementsByClassName("ui-datatable-header ui-widget-header") as HTMLCollectionOf<HTMLElement>;
		var calender = document.getElementsByClassName("ng-tns-c10-13 ui-inputtext ui-widget ui-state-default ui-corner-all") as HTMLCollectionOf<HTMLElement>;
		var calender2 = document.getElementsByClassName("ng-tns-c10-12 ui-inputtext ui-widget ui-state-default ui-corner-all") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.border = '0px';
		}
		for (var i = 0; i < calender.length; i++) {
			calender[i].style.margin = '0px';
		}
		for (var i = 0; i < calender2.length; i++) {
			calender2[i].style.margin = '0px';
		}
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilehistoritujuan/findAll?page=' + page + '&rows=' + rows + '&dir=id.noHistori&sort=desc&namaProfileHistoriTujuan' + cari).subscribe(table => {
			this.listData = table.ProfileHistoriTujuan;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		if ((this.cariTglAwal == null) || (this.cariTglAkhir == null)) {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilehistoritujuan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noHistori&sort=desc&namaProfileHistoriTujuan=' + this.pencarian).subscribe(table => {
				this.listData = table.ProfileHistoriTujuan;
			});
		} else {
			let tglAwal = Math.floor(this.setTimeStamp(this.cariTglAwal));
			let tglAkhir = Math.floor(this.setTimeStamp(this.cariTglAkhir));
			this.httpService.get(Configuration.get().dataMasterNew + '/profilehistoritujuan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noHistori&sort=desc&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&namaProfileHistoriTujuan=' + this.pencarian).subscribe(table => {
				this.listData = table.ProfileHistoriTujuan;
			});
		}
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
		console.log(cloned)
		let fixHub = {
			"tglAkhir": new Date(cloned.data.tglAkhir * 1000),
			"tglAwal": new Date(cloned.data.tglAwal * 1000),
		}
		let listTujuan = [...this.listTujuan];
		for (let i = 0; i < cloned.data.child.length; i++) {
			let dataTemp = {
				"noUrut": cloned.data.child[i].noUrut,
				"tujuanProfile": cloned.data.child[i].tujuanProfile,
				"keteranganLainnya": cloned.data.child[i].keteranganLainnya,
				"statusEnabled": cloned.data.child[i].statusEnabled
			}
			listTujuan.push(dataTemp);
		}
		this.listTujuan = listTujuan;
		this.noHistori = cloned.data.noHistori;
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		this.disNoUrut = false;
		this.trashButton = false
		this.listTujuan = []
		console.log(event)
		let cloned = this.clone(event);
		this.formAktif = false;
		this.form.setValue(cloned);
		console.log(JSON.stringify(this.form.value));
	}

	onSubmit() {
		if ((this.form.invalid) || (this.listTujuan.length == 0)) {
			this.validateAllFormFields(this.form);
			this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		}
		else {
			let notifTujuan = 0;
			for (let i = 0; i < this.listTujuan.length; i++) {
				if (this.listTujuan[i].tujuanProfile == null) {
					notifTujuan = 1;
				}
			}
			if (notifTujuan == 1) {
				this.alertService.warn('Peringatan', 'Tujuan Harus Diisi')
			} else {
				this.simpan();
			}
		}
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		}
		else {
			for (let i = 0; i < this.listTujuan.length; i++) {
				this.listTujuan[i].noUrut = parseInt(this.listTujuan[i].noUrut)
			}
			let dataSimpan = {
				'profileHistoriTujuan': this.listTujuan,
				'tglAkhir': Math.floor(this.setTimeStamp(this.form.get('tglAkhir').value)),
				'tglAwal': Math.floor(this.setTimeStamp(this.form.get('tglAwal').value))
			}
			// console.log(dataSimpan)
			// console.log(JSON.stringify(dataSimpan));
			// console.log(this.noUrut)

			this.httpService.post(Configuration.get().dataMasterNew + '/profilehistoritujuan/save', dataSimpan).subscribe(response => {
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
		for (let i = 0; i < this.listTujuan.length; i++) {
			this.listTujuan[i].noUrut = parseInt(this.listTujuan[i].noUrut)
		}
		let dataSimpan = {
			'noHistori': this.noHistori,
			'profileHistoriTujuan': this.listTujuan,
			'tglAkhir': Math.floor(this.setTimeStamp(this.form.get('tglAkhir').value)),
			'tglAwal': Math.floor(this.setTimeStamp(this.form.get('tglAwal').value)),
			'statusEnabled': true
		}
		this.httpService.update(Configuration.get().dataMasterNew + '/profilehistoritujuan/update', dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilehistoritujuan/del/' + this.noHistori).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.noHistori;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Histori Tujuan');
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
		this.noHistori = null;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaKelompokUmur').value)
	}

	tambahTujuan() {
		let listTujuan = [...this.listTujuan];
		let dataTemp = {
			"noUrut": null,
			"tujuanProfile": null,
			"keteranganLainnya": null,
			"statusEnabled": true
		}
		// this.statusTujuan = dataTemp.statusEnabled
		listTujuan.push(dataTemp);
		this.listTujuan = listTujuan;
	}

	hapusTujuan(row) {
		let listTujuan = [...this.listTujuan];
		listTujuan.splice(row, 1);
		this.listTujuan = listTujuan;
	}

	toggleTujuan(row, data) {
		let listTujuan = [...this.listTujuan];
		if (data == true) {
			listTujuan[row].status = false;
			listTujuan[row].statusEnabled = true;

			// this.listTujuan[row].statusEnabled = false
		} else if (data == false) {
			listTujuan[row].status = true;
			listTujuan[row].statusEnabled = false;


			// this.listTujuan[row].statusEnabled = true
		}
		this.listTujuan = listTujuan;
	}

	ruleNoUrut(data) {
		let param = 0;
		let indexTujuan;
		var str = data.noUrut;
		var regx = /[^0-9]/g;
		var result = str.replace(regx, '');
		data.noUrut = result;
		for (let i = 0; i < this.listTujuan.length; i++) {
			if (this.listTujuan[i].noUrut == data.noUrut) {
				param = param + 1;
				if (param == 2) {
					indexTujuan = i;
				}
				// this.alertService.warn('Peringatan', 'Nomor Urut ' + data.noUrut + ' Sudah Terdaftar');
			}
		}
		if (param == 2) {
			this.alertService.warn('Peringatan', 'Nomor Urut ' + this.listTujuan[indexTujuan].noUrut + ' Sudah Terdaftar');
			data.noUrut = '';
		}
	}

	cariTgl() {
		this.pencarian = null;
		let tglAwal = Math.floor(this.setTimeStamp(this.cariTglAwal));
		let tglAkhir = Math.floor(this.setTimeStamp(this.cariTglAkhir));
		if ((this.cariTglAwal == null) || (this.cariTglAkhir == null)) {
			this.alertService.warn('Peringatan', 'Tanggal Akhir atau Tanggal Akhir Kosong');
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilehistoritujuan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noHistori&sort=desc&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir).subscribe(table => {
				this.listData = table.ProfileHistoriTujuan;
			});
		}
	}

	resetCari() {
		this.cariTglAwal = null;
		this.cariTglAkhir = null;
		this.pencarian = null;
		this.getDataGrid(this.page, this.rows, this.pencarian);
	}
}


