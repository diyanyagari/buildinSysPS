import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { pegawaiSkPajak } from './pegawai-sk-pajak.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Router} from "@angular/router";

@Component({
	selector: 'app-pegawai-sk-pajak',
	templateUrl: './pegawai-sk-pajak.component.html',
	styleUrls: ['./pegawai-sk-pajak.component.scss'],
	providers: [ConfirmationService]
})

export class PegawaiSkPajakComponent implements OnInit {
	form: FormGroup;
	tanggalAwal: any;
	tanggalAkhir: any;
	listRange: any[];
	listGolonganPegawai: any[];
	listKategoryPegawai: any[];
	listKomponen: any[];
	listObjekPajak: any[];
	listOperatorFactorRate: any[];
	listMetodePembayaran: any[];
	listKomponenEffect: any[];
	listMetodeHitung: any[];
	listData: any[];
	selectedGolongan: any[];
	selectedKategori: any[];
	selectedRange: any[];
	formAktif: boolean;
	selected: any;
	versi: any;
	namaSK: any[];
	ProRate: boolean;
	CekProRate: any;
	totalRecords: number;
	page: number;
	rows: number;
	pencarian: string = '';
	selectedKomponen: any[];
	items: any;
	kdKategoriPegawai: any;
	laporan: boolean = false;
	kdprof: any;
    kddept: any;
	codes:any[];
	smbrFile:any;


	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private route: Router,
		private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;

		this.items = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					this.downloadPdf();
				}
			},
			{
				label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
					this.downloadExcel();
				}
			},

		];
		this.CekProRate = 0;
		this.formAktif = true;
		this.kdKategoriPegawai = null;
		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
		this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian);
		this.get();
		this.form = this.fb.group({
			'noSk': new FormControl(''),

			'noSKIntern': new FormControl(''),

			'namaSk': new FormControl('', Validators.required),
			'tanggalAwal': new FormControl({ value: '', disabled: true }),
			'tanggalAkhir': new FormControl({ value: '', disabled: true }),
			'kdObjekPajak': new FormControl('', Validators.required),
			'kdGolonganPegawai': new FormControl('', Validators.required),
			'kdKategoryPegawai': new FormControl('', Validators.required),
			'kdKomponen': new FormControl('', Validators.required),
			'kdRange': new FormControl('', Validators.required),
			'hargaSatuanPersen': new FormControl('', Validators.required),
			'hargaSatuan': new FormControl(''),
			'factorRate': new FormControl(''),
			'kdOperatorFactorRate': new FormControl('', Validators.required),
			'rumusPerhitungan': new FormControl(''),
			'aktifTanggal': new FormControl(''),
			'proRate': new FormControl(''),
			'persenHargaSatuanPinalty': new FormControl(''),
			'hargaSatuanPinalty': new FormControl(''),
			'kdMetodePembayaran': new FormControl(''),
			'kdMetodeHitung': new FormControl(''),
			'kdKomponenEffect': new FormControl(''),
			'keteranganLainnya': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
		});
		this.form.get('kdOperatorFactorRate').setValue("x");
		this.form.get('factorRate').setValue("1");
		this.getSmbrFile();

	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}


	cari() {

		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&namaObjekPajak=' + this.pencarian).subscribe(table => {
			this.listData = table.PegawaiSKPajak;
			this.totalRecords = table.totalRow;
		});
	}
	get() {
		// this.getPage(Configuration.get().page, Configuration.get().rows);
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Range&select=namaRange,id.kode').subscribe(res => {
			this.listRange = [];
			for (var i = 0; i < res.data.data.length; i++) {
				this.listRange.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id_kode })
			};
			this.selectedRange = this.listRange;
		},
			error => {
				this.listRange = [];
				this.listRange.push({ label: '-- ' + error + ' --', value: '' })
			});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listKategoryPegawai = [];
			this.listKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
			};
			this.selectedKategori = this.listKategoryPegawai;
		},
			error => {
				this.listKategoryPegawai = [];
				this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
			});

		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=id.kode,%20namaGolonganPegawai').subscribe(res => {
			this.listGolonganPegawai = [];
			for (var i = 0; i < res.data.data.length; i++) {
				this.listGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id_kode })
			};
			this.selectedGolongan = this.listGolonganPegawai;
		},
			error => {
				this.listGolonganPegawai = [];
				this.listGolonganPegawai.push({ label: '-- ' + error + ' --', value: '' })
			});

		// this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getKomponen').subscribe(res => {
		// 	this.listKomponen = [];
		// 	// this.listKomponen.push({ label: '--Pilih Komponen--', value: '' });
		// 	for (var i = 0; i < res.data.length; i++) {
		// 		this.listKomponen.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
		// 	};
		// },
		// 	error => {
		// 		this.listKomponen = [];
		// 		this.listKomponen.push({ label: '-- ' + error + ' --', value: '' })
		// 	});

		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=ObjekPajak&select=id.kode,namaObjekPajak').subscribe(res => {
			this.listObjekPajak = [];
			this.listObjekPajak.push({ label: '--Pilih Objek Pajak--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				this.listObjekPajak.push({ label: res.data.data[i].namaObjekPajak, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.listObjekPajak = [];
				this.listObjekPajak.push({ label: '-- ' + error + ' --', value: '' })
			});
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getKomponenEffect').subscribe(res => {
			this.listKomponenEffect = [];
			this.listKomponenEffect.push({ label: '--Pilih Komponen Effect--', value: '' });
			for (var i = 0; i < res.data.length; i++) {
				this.listKomponenEffect.push({ label: res.data[i].namaKomponen, value: res.data[i].kode })
			};
		},
			error => {
				this.listKomponenEffect = [];
				this.listKomponenEffect.push({ label: '-- ' + error + ' --', value: '' })
			});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MetodePerhitungan&select=id.kode,namaMetodeHitung').subscribe(res => {
			this.listMetodeHitung = [];
			this.listMetodeHitung.push({ label: '--Pilih Metode Hitung--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				this.listMetodeHitung.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.listMetodeHitung = [];
				this.listMetodeHitung.push({ label: '-- ' + error + ' --', value: '' })
			});
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getMetodePembayaran').subscribe(res => {
			this.listMetodePembayaran = [];
			this.listMetodePembayaran.push({ label: '--Pilih Metode Pembayaran--', value: '' });
			for (var i = 0; i < res.data.length; i++) {
				this.listMetodePembayaran.push({ label: res.data[i].namaMetodePembayaran, value: res.data[i].kode })
			};
		},
			error => {
				this.listMetodePembayaran = [];
				this.listMetodePembayaran.push({ label: '-- ' + error + ' --', value: '' })
			});
		this.listOperatorFactorRate = [];
		this.listOperatorFactorRate.push({ label: '--Pilih Operator--', value: '' })
		this.listOperatorFactorRate.push({ label: "+", value: "+" })
		this.listOperatorFactorRate.push({ label: "-", value: "-" })
		this.listOperatorFactorRate.push({ label: "x", value: "x" })
		this.listOperatorFactorRate.push({ label: "/", value: "/" })
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getSK').subscribe(res => {
			this.namaSK = [];
			this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
			for (var i = 0; i < res.SK.length; i++) {
				this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
			};
		},
			error => {
				this.namaSK = [];
				this.namaSK.push({ label: '-- ' + error + ' --', value: '' })
			});
	}
	getDataGrid(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
			this.listData = table.PegawaiSKPajak;
			this.totalRecords = table.totalRow;
		});
	}
	changeProRate(event) {
		if (event == true) {
			this.CekProRate = 1;
		} else {
			this.CekProRate = 0;
		}
	}
	valuechangeGetKomponen(kdKategoriPegawai) {
		console.log(kdKategoriPegawai)
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getKomponen/' + kdKategoriPegawai).subscribe(res => {
			this.listKomponen = [];
			this.listKomponen.push({ label: '--Pilih Komponen--', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listKomponen.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
			};
		},
			error => {
				this.listKomponen = [];
				this.listKomponen.push({ label: '-- ' + error + ' --', value: '' })
			});
	}
	ambilSK(sk) {
		if ( this.form.get('namaSk').value == '' || this.form.get('namaSk').value == null || this.form.get('namaSk').value == undefined) {
			this.form.get('noSk').setValue(null);
			this.form.get('noSKIntern').setValue(null);
			this.form.get('tanggalAwal').setValue(null);
			this.form.get('tanggalAkhir').setValue(null);
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getSK?noSK=' + sk.value).subscribe(table => {
				let detailSK = table.SK;
				console.log(detailSK);
				this.form.get('noSk').setValue(detailSK[0].noSK);
				this.form.get('noSKIntern').setValue(detailSK[0].noSKIntern);
				this.form.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
				if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
					this.form.get('tanggalAkhir').setValue(null);
				} else {
					this.form.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
				}
			});
		}
	}
	changeAktif(event) {
		if (event == true) {
			this.form.get('tanggalAkhir').enable();
			this.form.get('tanggalAkhir').setValidators(Validators.required);
		} else {
			this.form.get('tanggalAkhir').clearValidators();
			this.form.get('tanggalAkhir').setValue('');
			this.form.get('tanggalAkhir').disable();
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
		// let awal = this.setTimeStamp(this.tanggalAwal);
		// let akhir = this.setTimeStamp(this.tanggalAkhir);
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	onRowSelect(event) {
		// this.selectedKategori = [{
		// 	label: event.data.namaKategoryPegawai,
		// 	value: event.data.kdKategoryPegawai
		// }];
		this.selectedGolongan = [{
			label: event.data.namaGolonganPegawai,
			value: event.data.kdGolonganPegawai
		}];
		this.selectedRange = [{
			label: event.data.namaRange,
			value: event.data.kdRange
		}];
		// this.selectedKomponen = [{
		// 	label: event.data.namaKomponen,
		// 	value: event.data.kdKomponenHarga
		// }];
		this.formAktif = false;
		let tgl = event.data.tglBerlakuAkhir * 1000;

		if (event.data.isProRate == 1) {
			this.ProRate = true;
			this.CekProRate = 1;
		} else {
			this.ProRate = false;
			this.CekProRate = 0;
		}
		this.form.get('proRate').setValue(this.ProRate);
		this.form.get('kdObjekPajak').setValue(event.data.kdObjekPajak);
		this.form.get('kdKomponen').setValue(event.data.kode.kdKomponenHarga);
		this.form.get('kdKategoryPegawai').setValue(event.data.kode.kdKategoryPegawai);
		this.form.get('hargaSatuanPersen').setValue(event.data.persenHargaSatuan);
		this.form.get('hargaSatuan').setValue(event.data.hargaSatuan);
		this.form.get('hargaSatuanPinalty').setValue(event.data.hargaSatuanPinalty);
		this.form.get('persenHargaSatuanPinalty').setValue(event.data.persenHargaSatuanPinalty);
		this.form.get('kdMetodePembayaran').setValue(event.data.kdMetodePembayaran);
		this.form.get('kdMetodeHitung').setValue(event.data.kdMetodeHitung);
		this.form.get('kdKomponenEffect').setValue(event.data.kdKomponenEffect);
		this.form.get('keteranganLainnya').setValue(event.data.keteranganLainnya);
		this.form.get('statusEnabled').setValue(event.data.statusEnabled);
		this.form.get('rumusPerhitungan').setValue(event.data.rumusPerhitungan);
		this.form.get('kdOperatorFactorRate').setValue(event.data.operatorFactorRate);
		this.form.get('factorRate').setValue(event.data.factorRate);
		this.form.get('namaSk').setValue(event.data.noSK);
		this.form.get('noSk').setValue(event.data.noSK);
		this.form.get('noSKIntern').setValue(event.data.noSKIntern);
		if (event.data.tglBerlakuAkhir == null) {

		} else {
			this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

		}
		this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
		this.form.get('kdRange').disable();
		this.form.get('kdKategoryPegawai').disable();
		this.form.get('kdGolonganPegawai').disable();
		this.form.get('kdKomponen').disable();
		this.versi = event.data.version;
		console.log(event.data.noSK);
		// console.log(this.versi);
	}
	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpan();
		}
	}
	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate();
		} else {
			let golongan = [];
			let kategoriPegawai = [];
			let range = [];
			let komponen = [];
			for (let i = 0; i < this.selectedGolongan.length; i++) {
				golongan.push({
					"kode": this.selectedGolongan[i].value,
				})
			}
			// for (let i = 0; i < this.selectedKategori.length; i++) {
			// 	kategoriPegawai.push({
			// 		"kode": this.selectedKategori[i].value,
			// 	})
			// }
			for (let i = 0; i < this.selectedRange.length; i++) {
				range.push({
					"kode": this.selectedRange[i].value,
				})
			}
			// for (let i = 0; i < this.selectedKomponen.length; i++) {
			// 	komponen.push({
			// 		"kode": this.selectedKomponen[i].value,
			// 	})
			// }
			let dataTempKategori = [{
				"kode" : this.form.get('kdKategoryPegawai').value
			}]
			let dataTempKomponen = [{
				"kode" : this.form.get('kdKomponen').value
			}]
			let fixHub = {

				"factorRate": this.form.get('factorRate').value,
				"golonganPegawai": golongan,
				"hargaSatuan": this.form.get('hargaSatuan').value,
				"hargaSatuanPinalty": this.form.get('hargaSatuanPinalty').value,
				"isProRate": this.CekProRate,
				"kategoriPegawai": dataTempKategori,
				"kdKomponenEffect": this.form.get('kdKomponenEffect').value,
				"kdKomponenHarga": dataTempKomponen,
				"kdMetodeHitung": this.form.get('kdMetodeHitung').value,
				"kdMetodePembayaran": this.form.get('kdMetodePembayaran').value,
				"kdObjekPajak": this.form.get('kdObjekPajak').value,
				"keteranganLainnya": this.form.get('keteranganLainnya').value,
				// "noRec": this.form.get('rumusPerhitungan').value,
				"noSK": this.form.get('noSk').value,
				"operatorFactorRate": this.form.get('kdOperatorFactorRate').value,
				"persenHargaSatuan": this.form.get('hargaSatuanPersen').value,
				"persenHargaSatuanPinalty": this.form.get('persenHargaSatuanPinalty').value,
				"range": range,
				"rumusPerhitungan": this.form.get('rumusPerhitungan').value,
				"statusEnabled": this.form.get('statusEnabled').value,

			}

			console.log(fixHub);
			this.httpService.post(Configuration.get().dataMaster + '/pegawaiskpajak/saveRev', fixHub).subscribe(response => {
			},
				error => {
					this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
				},
				() => {
					this.alertService.success('Berhasil', 'Data Disimpan');

					this.reset();
				});

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
		console.log(this.versi);

		let golongan = [];
		// let kategoriPegawai = [];
		let range = [];
		for (let i = 0; i < this.selectedGolongan.length; i++) {
			golongan.push({
				"kode": this.selectedGolongan[i].value,
			})
		}
		// for (let i = 0; i < this.selectedKategori.length; i++) {
		// 	kategoriPegawai.push({
		// 		"kode": this.selectedKategori[i].value,
		// 	})
		// }
		for (let i = 0; i < this.selectedRange.length; i++) {
			range.push({
				"kode": this.selectedRange[i].value,
			})
		}

		let fixHub = [{

			"factorRate": this.form.get('factorRate').value,
			"kdGolonganPegawai": this.selectedGolongan[0].value,
			"hargaSatuan": this.form.get('hargaSatuan').value,
			"hargaSatuanPinalty": this.form.get('hargaSatuanPinalty').value,
			"isProRate": this.CekProRate,
			"kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
			"kdKomponenEffect": this.form.get('kdKomponenEffect').value,
			"kdKomponenHarga": this.form.get('kdKomponen').value,
			"kdMetodeHitung": this.form.get('kdMetodeHitung').value,
			"kdMetodePembayaran": this.form.get('kdMetodePembayaran').value,
			"kdObjekPajak": this.form.get('kdObjekPajak').value,
			"keteranganLainnya": this.form.get('keteranganLainnya').value,
			// "noRec": this.form.get('rumusPerhitungan').value,
			"noSK": this.form.get('noSk').value,
			"operatorFactorRate": this.form.get('kdOperatorFactorRate').value,
			"persenHargaSatuan": this.form.get('hargaSatuanPersen').value,
			"persenHargaSatuanPinalty": this.form.get('persenHargaSatuanPinalty').value,
			"kdRange": this.selectedRange[0].value,
			"rumusPerhitungan": this.form.get('rumusPerhitungan').value,
			"statusEnabled": this.form.get('statusEnabled').value,

		}]

		console.log(fixHub)

		this.httpService.update(Configuration.get().dataMaster + '/pegawaiskpajak/update/' + this.versi, fixHub).subscribe(response => {
		},
			error => {
				this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
			},
			() => {
				this.alertService.success('Berhasil', 'Data Diperbarui');

				this.reset();
			});
	}
	confirmDelete() {
		let noSK = this.form.get('noSk').value;
		if (noSK == null || noSK == undefined || noSK == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Pajak');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapus();
				},
				reject: () => {
					this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
				}
			});
		}
	}
	hapus() {

		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMaster + '/pegawaiskpajak/del/' + deleteItem.noSK + '/' + deleteItem.kdObjekPajak + '/' + deleteItem.kdRange + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});


	}
	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	reset() {
		this.form.get('kdRange').enable();
		this.form.get('kdKategoryPegawai').enable();
		this.form.get('kdGolonganPegawai').enable();
		this.form.get('kdKomponen').enable();
		this.ngOnInit();
	}
	onDestroy() {

	}
	getKelompokTransaksi(){
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getKelompokTransaksi').subscribe(table => {
			let dataKelompokTransaksi = table.KelompokTransaksi;
			 localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));
			 this.route.navigate(['/master-sk/surat-keputusan']);
        });
	}

	downloadExcel() {

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/pegawaiSKPajak/laporanPegawaiSKPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKPajak/laporanPegawaiSKPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPegawaiSkPajak_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
	
 
}