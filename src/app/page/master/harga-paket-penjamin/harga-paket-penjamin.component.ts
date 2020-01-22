import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-harga-paket-penjamin',
	templateUrl: './harga-paket-penjamin.component.html',
	styleUrls: ['./harga-paket-penjamin.component.scss'],
	providers: [ConfirmationService]
})
export class HargaPaketPenjaminComponent implements OnInit {

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
	listPaket: any = [];
	listKelompokPasien: any = [];
	listGolonganAsuransi: any = [];
	listPenjaminPasien: any = [];
	listKelas: any = [];
	listHubunganPeserta: any = [];
	kode: any;
	listData: any = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	disHargaSatuan: boolean;
	hargaSatuan: boolean;
	disDropdown: boolean;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService) { }


	ngOnInit() {
		this.disDropdown = true;
		this.disHargaSatuan = true;
		this.hargaSatuan = true;
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
			'kdKelompokPasien': new FormControl(null, Validators.required),
			'kdRekananPenjamin': new FormControl(null, Validators.required),
			'kdGolonganAsuransi': new FormControl(null, Validators.required),
			'kdHubunganPeserta': new FormControl(null, Validators.required),
			'kdKelas': new FormControl(null, Validators.required),
			'kdPaket': new FormControl(null, Validators.required),
			'tglBerlakuAwal': new FormControl(new Date(), Validators.required),
			'tglBerlakuAkhir': new FormControl(new Date()),
			'hargaSatuan': new FormControl(null),
			'persenHargaSatuan': new FormControl(null),
			'persenTPenjamindrSelisih': new FormControl(null),
			'persenTProfiledrSelisih': new FormControl(null),
			'factorRate': new FormControl(null, Validators.required),
			'maxTPenjamin': new FormControl(null),
			// 'kode': new FormControl(null),
			'statusEnabled': new FormControl(null)
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getPelayananProfileHead();
		this.getPaket();
		this.getGolonganAsuransi();
		this.getKelompokPasien();
		this.getPenjaminPasien();
		this.getKelas();
		this.getHubunganPeserta();
		this.form.get('factorRate').setValue(1);
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketpenjamin/findAll?page=' + page + '&rows=' + rows + '&dir=kelompokPasien.namaKelompokPasien&sort=desc&namaHargaPaketPenjamin' + cari).subscribe(table => {
			this.listData = table.HargaPaketPenjamin;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketpenjamin/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=kelompokPasien.namaKelompokPasien&sort=desc&namaHargaPaketPenjamin=' + this.pencarian).subscribe(table => {
			this.listData = table.HargaPaketPenjamin;
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
			"kdKelompokPasien": cloned.data.kode.kdKelompokPasien,
			"kdRekananPenjamin": cloned.data.kode.kdRekananPenjamin,
			"kdGolonganAsuransi": cloned.data.kode.kdGolonganAsuransi,
			"kdHubunganPeserta": cloned.data.kode.kdHubunganPeserta,
			"kdKelas": cloned.data.kode.kdKelas,
			"kdPaket": cloned.data.kode.kdPaket,
			"tglBerlakuAwal": new Date(cloned.data.kode.tglBerlakuAwal * 1000),
			"tglBerlakuAkhir": new Date(cloned.data.tglBerlakuAkhir * 1000),
			"hargaSatuan": cloned.data.hargaSatuan,
			"persenHargaSatuan": cloned.data.persenHargaSatuan,
			"persenTPenjamindrSelisih": cloned.data.persenTPenjamindrSelisih,
			"persenTProfiledrSelisih": cloned.data.persenTProfiledrSelisih,
			"factorRate": cloned.data.factorRate,
			"maxTPenjamin": cloned.data.maxTPenjamin,
			"statusEnabled": cloned.data.statusEnabled
		}
		console.log(fixHub);
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		this.disDropdown = false;
		let cloned = this.clone(event);
		console.log(event.data.hargaSatuan)
		if (event.data.hargaSatuan != null) {
			console.log("ISSSIIIII")
			this.hargaSatuan = false
		} else if (event.data.hargaSatuan == null) {
			this.hargaSatuan = true
			console.log("KOSSSOOONGGG")
		}
		if (event.data.persenHargaSatuan != null) {
			console.log("ISSSIIIII")
			this.disHargaSatuan = false
		} else if (event.data.persenHargaSatuan == null) {
			this.disHargaSatuan = true
			console.log("KOSSSOOONGGG")
		}
		console.log(event)
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
			let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglBerlakuAwal').value))
			let tglAkhir = Math.round(this.setTimeStamp(this.form.get('tglBerlakuAkhir').value))

			let formSubmit = this.form.value;
			formSubmit.tglBerlakuAwal = tglAwal;
			formSubmit.tglBerlakuAkhir = tglAkhir;
			formSubmit.statusEnabled = true;
			// console.log(JSON.stringify(this.form.value));
			this.httpService.post(Configuration.get().dataMasterNew + '/hargapaketpenjamin/save', this.form.value).subscribe(response => {
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
		let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglBerlakuAwal').value))
		let tglAkhir = Math.round(this.setTimeStamp(this.form.get('tglBerlakuAkhir').value))

		let formSubmit = this.form.value;
		formSubmit.tglBerlakuAwal = tglAwal;
		formSubmit.tglBerlakuAkhir = tglAkhir;
		formSubmit.statusEnabled = true;
		this.httpService.update(Configuration.get().dataMasterNew + '/hargapaketpenjamin/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglBerlakuAwal').value))
		this.httpService.delete(Configuration.get().dataMasterNew + '/hargapaketpenjamin/del/' +
			this.form.get('kdKelompokPasien').value + '/' +
			this.form.get('kdRekananPenjamin').value + '/' +
			this.form.get('kdGolonganAsuransi').value + '/' +
			this.form.get('kdHubunganPeserta').value + '/' +
			this.form.get('kdPaket').value + '/' +
			this.form.get('kdKelas').value + '/' +
			tglAwal
		).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
		console.log(Configuration.get().dataMasterNew + '/hargapaketpenjamin/del/' +
			this.form.get('kdKelompokPasien').value + '/' +
			this.form.get('kdRekananPenjamin').value + '/' +
			this.form.get('kdGolonganAsuransi').value + '/' +
			this.form.get('kdHubunganPeserta').value + '/' +
			this.form.get('kdPaket').value + '/' +
			this.form.get('kdKelas').value + '/' +
			tglAwal)
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
		// let kode = this.form.get('kode').value;
		// if (kode == null || kode == undefined || kode == "") {
		// 	this.alertService.warn('Peringatan', 'Pilih Daftar Pelayanan Profile');
		// }
		// else {
		// 	this.confirmationService.confirm({
		// 		message: 'Apakah Data Akan Dihapus?',
		// 		header: 'Konfirmasi Hapus',
		// 		icon: 'fa fa-trash',
		// 		accept: () => {
		// 			this.hapus();
		// 		}
		// 	});
		// }
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

	getKelompokPasien() {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketpenjamin/getKelompokPasien').subscribe(res => {
			this.listKelompokPasien = [];
			this.listKelompokPasien.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listKelompokPasien.push({ label: res.data[i].namaKelompokPasien, value: res.data[i].kode.kode })
			};
		})
	}

	getPenjaminPasien() {
		this.httpService.get(Configuration.get().dataMasterNew + '/rekanan/findAllData').subscribe(res => {
			this.listPenjaminPasien = [];
			this.listPenjaminPasien.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.Rekanan.length; i++) {
				this.listPenjaminPasien.push({ label: res.Rekanan[i].namaRekanan, value: res.Rekanan[i].kode.kode })
			};
		})
	}

	getGolonganAsuransi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/golonganasuransi/findAllData').subscribe(res => {
			this.listGolonganAsuransi = [];
			this.listGolonganAsuransi.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.GolonganAsuransi.length; i++) {
				this.listGolonganAsuransi.push({ label: res.GolonganAsuransi[i].namaGolonganAsuransi, value: res.GolonganAsuransi[i].kode.kode })
			};
		})
	}

	getHubunganPeserta() {
		this.httpService.get(Configuration.get().dataMasterNew + '/hubunganpesertaasuransi/findAllData').subscribe(res => {
			console.log(res);
			this.listHubunganPeserta = [];
			this.listHubunganPeserta.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.HubunganPesertaAsuransi.length; i++) {
				this.listHubunganPeserta.push({ label: res.HubunganPesertaAsuransi[i].hubunganPeserta, value: res.HubunganPesertaAsuransi[i].kode.kode })
			};
		})
	}

	getKelas() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAllData').subscribe(res => {
			this.listKelas = [];
			this.listKelas.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.Kelas.length; i++) {
				this.listKelas.push({ label: res.Kelas[i].namaKelas, value: res.Kelas[i].kode.kode })
			};
		})
	}

	getPaket() {
		this.httpService.get(Configuration.get().dataMasterNew + '/paket/findAllData').subscribe(res => {
			this.listPaket = [];
			this.listPaket.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.paket.length; i++) {
				this.listPaket.push({ label: res.paket[i].namaPaket, value: res.paket[i].kode.kode })
			};
		})
	}

	onDestroy() {

	}

	setRupiah(value: number) {
		return value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}

	hrgSatuanChange(event) {
		if (event == null) {
			this.hargaSatuan = true
		} else if (event != null) {
			this.hargaSatuan = false
			this.form.get('persenHargaSatuan').setValue(null)
		}
	}

	persenHrgSatuanChange(event) {
		if (event == null) {
			this.disHargaSatuan = true
		} else if (event != null) {
			this.disHargaSatuan = false
			this.form.get('hargaSatuan').setValue(null)
		}
	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaPelayananProfile').value)
	}

}


