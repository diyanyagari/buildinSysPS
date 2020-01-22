import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, FileUploadModule } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';


@Component({
	selector: 'app-surat-keputusan',
	templateUrl: './surat-keputusan.component.html',
	styleUrls: ['./surat-keputusan.component.scss'],
	providers: [ConfirmationService]
})
export class SuratKeputusanComponent implements OnInit, OnDestroy {
	form: FormGroup;
	daftarHistoriUmk: any = [];
	totalRecords: number;
	listJenisKeputusan: any = [];
	listKelompokTransaksi: any = [];
	pencarian: string = '';
	selected: any = [];
	noHistori: any;
	formAktif: boolean;
	minDate: Date = new Date();
	namaFile: string = '';
	fileName: any;
	listPegawai: any = [];
	pegawai: any = [];

	version: any;
	masterSK: any;
	kelompokTransaksi: any = '';
	tanggalAkhir: any;
	page: number;
	rows: number;
	res: any = [];
	dataBtn: any;
	KelompokTransaksi: any = [];
	kode: any;
	noSKInt: any;
	cekForm: boolean = false;
	valueKelompok: any;
	kunci: boolean;

	disableSimpan: boolean;

	skInternLastCek: boolean;
	kodeTransaksi: any;
	skInternLast: any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard) { }

	ngOnDestroy() {
		localStorage.removeItem('kelompokTransaksi');
	}

	ngOnInit() {
		this.kunci = false;
		let today = new Date();
		let month = today.getMonth();
		let year = today.getFullYear();
		this.minDate = new Date();
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
		this.formAktif = false;
		today.setHours(0, 0, 0, 0);
		let namaRuangan = this.authGuard.getUserDto().ruangan.namaRuangan;
		this.form = this.fb.group({
			'noSk': new FormControl(null),
			'namaSk': new FormControl(null, Validators.required),
			'kdJenisKeputusan': new FormControl(null, Validators.required),
			'tanggalAwalBerlakuSK': new FormControl(today, Validators.required),
			'tanggalAkhirBerlakuSk': new FormControl(),
			'noSKIntern': new FormControl(null),
			'otomatis': new FormControl(true),
			'kdKelompokTransaksi': new FormControl(null, Validators.required),
			'namaDokumen': new FormControl({ value: '', disabled: true }),
			'pegawai': new FormControl(null, Validators.required),
			'ruangan': new FormControl(namaRuangan),

			// 'skInternLast': new FormControl('')

		});
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.getTransaksi();
		this.getDataGrid(this.page, this.rows, this.pencarian, this.kode);
		this.form.get('noSKIntern').disable();
		// this.form.get('ruangan').disable();
		this.skInternLastCek = false;

		this.disableSimpan = false;

	}

	getNoSKIntern(event) {
		let kodeTransaksi = event.value
		this.kodeTransaksi = event.value;
		this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAllKelompokTransaksi?kdKelompokTransaksi=' + kodeTransaksi).subscribe(res => {
			for (var i = 0; i < res.data.kelompokTransaksi.length; i++) {
				if (res.data.kelompokTransaksi[i].isRealSK == 1) {
					this.valueKelompok = 1;
				} else {
					this.valueKelompok = 0;
				}

			};
		});

	}

	getNoSKInternRowSelect(kdKelompokTransaksi) {
		this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAllKelompokTransaksi?kdKelompokTransaksi=' + kdKelompokTransaksi).subscribe(res => {
			for (var i = 0; i < res.data.kelompokTransaksi.length; i++) {
				if (res.data.kelompokTransaksi[i].isRealSK == 1) {
					this.valueKelompok = 1;
					this.form.get('otomatis').setValue(true)
				} else {
					this.valueKelompok = 0;
				}

			};
		});

	}


	getTransaksi() {
		let data = JSON.parse(localStorage.getItem('kelompokTransaksi'));
		// console.log(data);
		if (data == null || data == undefined) {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAllKelompokTransaksi').subscribe(res => {
				this.listKelompokTransaksi = [];
				this.listKelompokTransaksi.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
				for (var i = 0; i < res.data.kelompokTransaksi.length; i++) {
					this.listKelompokTransaksi.push({ label: res.data.kelompokTransaksi[i].namaKelompokTransaksi, value: res.data.kelompokTransaksi[i].kdKelompokTransaksi })

				};
			});

		} else {
			let listKdKelompokTransaksi = []
			for (var i = 0; i < data.length; i++) {
				listKdKelompokTransaksi.push(data[i].kdKelompokTransaksi)
			};
			this.kode = listKdKelompokTransaksi;
			this.listKelompokTransaksi = [];
			if (data.length == 1) {
				this.listKelompokTransaksi.push({ label: data[0].namaKelompokTransaksi, value: data[0].kdKelompokTransaksi })
				this.form.get('kdKelompokTransaksi').setValue(this.listKelompokTransaksi[0].value)
				// this.form.get('kdKelompokTransaksi').disable();
			} else {
				this.listKelompokTransaksi.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
				for (var i = 0; i < data.length; i++) {
					this.listKelompokTransaksi.push({ label: data[i].namaKelompokTransaksi, value: data[i].kdKelompokTransaksi })

				};


			}
		}
	}


	getDataGrid(page: number, rows: number, cari: string, kode: any) {
		// console.log(this.kode)
		if (this.kode == null || this.kode == undefined) {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAll?page=' + page + '&rows=' + rows + '&dir=namaSK&sort=desc&namaSk=' + cari + '&kdKelompokTransaksi=').subscribe(table => {
				this.daftarHistoriUmk = table.data.sk;
				this.totalRecords = table.data.totalRow;
			});
		} else {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAll?page=' + page + '&rows=' + rows + '&dir=namaSK&sort=desc&namaSk=' + cari + '&kdKelompokTransaksi=' + this.kode).subscribe(table => {
				this.daftarHistoriUmk = table.data.sk;
				this.totalRecords = table.data.totalRow;
			});
		}


		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisKeputusan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.listJenisKeputusan = [];
			this.listJenisKeputusan.push({ label: '--Pilih Jenis Keputusan--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.listJenisKeputusan.push({ label: res.data.data[i].namaJenisKeputusan, value: res.data.data[i].id.kode })
			};
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
			this.pegawai = [];
			this.pegawai.push({ label: '--Pilih Pegawai--', value: '' })
			for (var i = 0; i < res.Data.length; i++) {
				this.pegawai.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
			};
		});
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Pegawai&select=id.kode,namaLengkap&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.listPegawai = [];
			this.listPegawai = res.data.d;
		});
	}


	changeOtomatis(event) {

		if (event == true) {
			this.form.get('noSKIntern').disable();
			this.skInternLastCek = false;
		} else {
			this.skInternLastCek = true;
			let kdKelompokTransaksi = this.kodeTransaksi;
			let noSKInternLast;
			this.httpService.get(Configuration.get().dataMasterNew+ '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi='+kdKelompokTransaksi).subscribe(res => {
				noSKInternLast = res.noSKIntern;
				this.skInternLast  = noSKInternLast;
				// this.form.get('skInternLast').setValue(noSKInternLast);
			});
			this.form.get('noSKIntern').enable();
		}
	}

	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload';
	}

	fileUpload(event) {
		this.namaFile = event.xhr.response;
		this.alertService.success('Berhasil', 'File Berhasil di Unggah')
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}

	setMinDate(event) {
		let month = event.getMonth();
		let year = event.getFullYear();
		this.minDate = event;
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
		this.form.get('tanggalAkhirBerlakuSk').setValue('');
	}

	setNamaDokumen() {
		this.form.get('namaDokumen').setValue(this.form.get('namaSk').value);
	}

	onRowSelect(event) {
		this.kunci = false;
		this.form.enable();
		console.log(event.data.noSKIntern);
		this.formAktif = true;
		this.disableSimpan = false;
		this.form.get('tanggalAwalBerlakuSK').setValue(new Date(event.data.tglBerlakuAwal * 1000));
		this.form.get('tanggalAwalBerlakuSK').disable();
		this.setMinDate(this.form.get('tanggalAwalBerlakuSK').value);
		if (event.data.tglBerlakuAkhir == null) {
			this.form.get('tanggalAkhirBerlakuSk').setValue(null);
		} else {
			this.form.get('tanggalAkhirBerlakuSk').setValue(new Date(event.data.tglBerlakuAkhir * 1000));
		}

		this.form.get('noSk').setValue(event.data.noSk);
		this.form.get('namaSk').setValue(event.data.namaSk);
		this.form.get('noSKIntern').setValue(event.data.noSKIntern);
		this.form.get('kdJenisKeputusan').setValue(event.data.kdJenisKeputusan);
		this.getNoSKInternRowSelect(event.data.kdKelompokTransaksi)
		this.form.get('kdKelompokTransaksi').setValue(event.data.kdKelompokTransaksi);
		this.form.get('namaDokumen').setValue(event.data.namaJudulDokumen);
		this.form.get('pegawai').setValue(event.data.kdPegawai);
		this.version = event.data.version;

		this.kodeTransaksi = event.data.kdKelompokTransaksi;

		if (event.data.noSKIntern == null || event.data.noSKIntern == "" || event.data.noSKIntern == undefined){
			this.form.get('noSKIntern').enable();
		}
		else{
			this.form.get('noSKIntern').disable();
		}
		// this.form.get('ruangan').disable();

	}

	filterPegawai(event) {
		this.httpService.get(Configuration.get().dataMaster + '/pegawai/findPegawaiTake10?namaLengkap=' + event.query).subscribe(res => {
			this.listPegawai = res.data.pegawai;
		});
	}

	setJamAwal() {
		let tanggal = new Date().setHours(0, 0, 0, 0);
		this.form.get('tanggalAwalBerlakuSK').setValue(tanggal);
	}

	setJamAkhir() {
		let tanggal = new Date(this.form.get('tanggalAkhirBerlakuSk').value);
		this.form.get('tanggalAwalBerlakuSK').setValue(tanggal.setHours(23, 59, 0, 0))
	}

	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}
	}

	loadPage(event: LazyLoadEvent) {
		let pencarian = '';
		let kelompokTransaksi = ''
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, pencarian, kelompokTransaksi);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	cariGridKelompokTransaksi(page: number, rows: number, kelompokTransaksi: string) {
		if (this.kelompokTransaksi == null || this.kelompokTransaksi == undefined) {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAll?page=' + this.page + '&rows=' + this.rows).subscribe(table => {
				this.daftarHistoriUmk = table.data.sk;
				this.totalRecords = table.data.totalRow;
			});
		} else {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/findAll?page=' + this.page + '&rows=' + this.rows + '&kdKelompokTransaksi=' + this.kelompokTransaksi).subscribe(table => {
				this.daftarHistoriUmk = table.data.sk;
				this.totalRecords = table.data.totalRow;
			});
		}
	}

	cari() {
		this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian, this.kode)

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

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpan();
		}
	}

	confirmUpdate() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.update();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}

	update() {
		if (this.form.get('tanggalAkhirBerlakuSk').value == "" || this.form.get('tanggalAkhirBerlakuSk').value == undefined) {
			this.tanggalAkhir = null;
		} else {
			this.tanggalAkhir = this.setTimeStamp(this.form.get('tanggalAkhirBerlakuSk').value);
		}
		this.form.get('tanggalAwalBerlakuSK').enable();
		let tglAwal = this.setTimeStamp(this.form.get('tanggalAwalBerlakuSK').value);
		//let tglAkhir = this.setTimeStamp(this.form.get('tanggalAkhirBerlakuSk').value);
		let dataSimpan = {
			"kdJenisKeputusan": this.form.get('kdJenisKeputusan').value,
			"kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
			"keteranganLainnya": "",
			"namaSK": this.form.get('namaSk').value,
			"noSK": this.form.get('noSk').value,
			"noSKIntern": this.form.get('noSKIntern').value,
			"pathFile": this.namaFile,
			"tglBerlakuAkhir": this.tanggalAkhir,
			"tglBerlakuAwal": tglAwal,
			"kdPegawai": this.form.get('pegawai').value,
			"version": this.version
		}
		this.httpService.post(Configuration.get().dataMaster + '/suratKeputusan/save', dataSimpan).subscribe(response => {
			this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian, this.kelompokTransaksi);
			this.alertService.success('Berhasil', 'Data Diperbarui');

			setTimeout(() => {
				//this.reset();
				this.newResetRule();
			}, 1000);
		});


		this.disableSimpan = true;
		this.reset();
	}


	simpan() {
		if (this.formAktif == true) {
			this.confirmUpdate()
		} else {
			if (this.form.get('noSk').value == null || this.form.get('noSk').value == undefined) {
				this.form.get('noSk').setValue(null);
			}
			if (this.form.get('noSKIntern').value == "" || this.form.get('noSKIntern').value == undefined) {
				this.noSKInt = 0;
			} else {
				this.noSKInt = this.form.get('noSKIntern').value;
			}
			if (this.form.get('tanggalAkhirBerlakuSk').value == "" || this.form.get('tanggalAkhirBerlakuSk').value == undefined) {
				this.tanggalAkhir = null;
			} else {
				this.tanggalAkhir = this.setTimeStamp(this.form.get('tanggalAkhirBerlakuSk').value);
			}
			let tglAwal = this.setTimeStamp(this.form.get('tanggalAwalBerlakuSK').value);
			//let tglAkhir = this.setTimeStamp(this.form.get('tanggalAkhirBerlakuSk').value);

			let dataSimpan;
			if (this.noSKInt == 0) {
				dataSimpan = {
					"kdJenisKeputusan": this.form.get('kdJenisKeputusan').value,
					"kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
					"keteranganLainnya": "",
					"namaSK": this.form.get('namaSk').value,
					"noSK": this.form.get('noSk').value,
					"noSKIntern": null,
					"pathFile": this.namaFile,
					"tglBerlakuAkhir": this.tanggalAkhir,
					"tglBerlakuAwal": tglAwal,
					"kdPegawai": this.form.get('pegawai').value,
					// "version": null
				}
			}
			else {

				let dataSimpan = {
					"kdJenisKeputusan": this.form.get('kdJenisKeputusan').value,
					"kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
					"keteranganLainnya": "",
					"namaSK": this.form.get('namaSk').value,
					"noSK": this.form.get('noSk').value,
					"noSKIntern": this.noSKInt.toString(),
					"pathFile": this.namaFile,
					"tglBerlakuAkhir": this.tanggalAkhir,
					"tglBerlakuAwal": tglAwal,
					"kdPegawai": this.form.get('pegawai').value,
					// "version": null
				}
			}
			this.httpService.post(Configuration.get().dataMaster + '/suratKeputusan/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				// this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian, this.kelompokTransaksi);
				this.form.get('noSk').setValue(response.data.noSk);
				this.form.get('noSKIntern').setValue(response.data.noSkIntern);
				setTimeout(() => {
					//this.reset();
					this.newResetRule();
				}, 1000);
			});
		}

		this.disableSimpan = true;
	}

	reset() {
		this.form.enable();
		this.disableSimpan = false;
		this.formAktif = true;
		this.valueKelompok = 0;
		this.form.get('tanggalAwalBerlakuSK').enable();
		this.namaFile = '';
		this.ngOnInit();
		this.kunci = false;
	}

	newResetRule(){
		this.form.get('namaSk').markAsUntouched();
		this.form.get('kdJenisKeputusan').markAsUntouched();
		this.form.get('tanggalAwalBerlakuSK').markAsUntouched();
		this.form.get('kdKelompokTransaksi').markAsUntouched();
		this.form.get('pegawai').markAsUntouched();
		this.kunci = true;
		// this.form.clearValidators();
		this.form.disable();

	}

}