import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
// import { profilestrukturgajibymkgp } from './profile-struktur-gaji-by-mkgp.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-profile-struktur-gaji-by-mkgp',
	templateUrl: './profile-struktur-gaji-by-mkgp.component.html',
	styleUrls: ['./profile-struktur-gaji-by-mkgp.component.scss'],
	providers: [ConfirmationService]
})
export class ProfileStrukturGajiByMkgpComponent implements OnInit {
	form: FormGroup;
	tanggalAwal: any;
	tanggalAkhir: any;
	listHarga: any[];
	listRange: any[];
	listGolonganPegawai: any[];
	listKategoryPegawai: any[];
	listKomponen: any[];
	listPangkat: any[];
	listKeteranganAlasan: any[];
	listOperatorFactorRate: any[];
	listMetodePembayaran: any[];
	listKomponenTake: any[];
	listData: any[];
	selectedGolongan: any[];
	selectedKategori: any[];
	selectedRange: any[];
	selectedPangkat: any[];
	selectedKeteranganAlasan: any[];
	formAktif: boolean;
	formAktifPensiun: boolean;
	formAktifTHR: boolean;
	formAktifBonus: boolean;
	selected: any;
	versi: any;
	namaSK: any[];
	totalRecords: number;
	page: number;
	rows: number;
	pencarian: string = '';
	selectedKomponen: any[];
	items: any;
	dataSK: any[];
	// cekKomponenHargaTake: boolean;
	btnKomponenHargaTake: boolean;
	btKomponen: any;
	dataEditHarga: boolean;
	dataEditPersen: boolean;
	// ceklisKomponen: boolean;
	kdKategoriPegawai: any
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	codes: any[];
	smbrFile:any;

	kdKategoriPegawaiPensiun: any
	kdKategoriPegawaiTHR: any
	kdKategoriPegawaiBonus: any
	itemsPensiun: any;
	itemsBonus: any;
	itemsTHR: any;

	formPensiun: FormGroup;
	formTHR: FormGroup;
	formBonus: FormGroup;

	pencarianPensiun: string = '';
	pencarianTHR: string = '';
	pencarianBonus: string = '';

	listKeteranganAlasanPensiun: any[];
	listKeteranganAlasanTHR: any[];
	listKeteranganAlasanBonus: any[];

	selectedGolonganPensiun: any[];
	selectedGolonganTHR: any[];
	selectedGolonganBonus: any[];

	selectedRangeTHR: any[];
	selectedRangePensiun: any[];
	selectedRangeBonus: any[];

	selectedPangkatPensiun: any[];
	selectedPangkatBonus: any[];
	selectedPangkatTHR: any[];

	selectedKeteranganAlasanPensiun: any[];
	selectedKeteranganAlasanTHR: any[];
	selectedKeteranganAlasanBonus: any[];

	selectedPensiun: any;
	selectedTHR: any;
	selectedBonus: any;

	listHargaPensiun : any
	listHargaBonus : any
	listHargaTHR : any
	dataEditHargaPensiun: boolean
	dataEditHargaTHR: boolean
	dataEditHargaBonus: boolean
	dataEditPersenPensiun: boolean
	dataEditPersenBonus: boolean
	dataEditPersenTHR: boolean

	listDataPensiun: any[];
	totalRecordsPensiun: number;
	listDataBonus: any[];
	totalRecordsBonus: number;
	listDataTHR: any[];
	totalRecordsTHR: number;

	tambahOnOff:boolean;
	tambahOnOffTHR:boolean;
	tambahOnOffPensiun:boolean;
	tambahOnOffBonus:boolean;


	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) { }

	ngOnInit() {
		this.tambahOnOff = false;
		this.tambahOnOffTHR = false;
		this.tambahOnOffPensiun = false;
		this.tambahOnOffBonus = false;
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

		this.itemsPensiun = [
		{
			label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
				this.downloadPdfPensiun();
			}
		},
		{
			label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
				this.downloadExcelPensiun();
			}
		},

		];

		this.itemsBonus = [
		{
			label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
				this.downloadPdfBonus();
			}
		},
		{
			label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
				this.downloadExcelBonus();
			}
		},

		];

		this.itemsTHR = [
		{
			label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
				this.downloadPdfTHR();
			}
		},
		{
			label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
				this.downloadExcelTHR();
			}
		},

		];

		this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian);
		this.getDataGridPensiun(Configuration.get().page, Configuration.get().rows, this.pencarianPensiun);
		this.getDataGridTHR(Configuration.get().page, Configuration.get().rows, this.pencarianTHR);
		this.getDataGridBonus(Configuration.get().page, Configuration.get().rows, this.pencarianBonus);
		this.get();
		this.formAktif = true;
		this.formAktifPensiun = true;
		this.formAktifBonus = true;
		this.formAktifTHR = true;
		this.kdKategoriPegawai = null;
		this.kdKategoriPegawaiPensiun = null;
		this.kdKategoriPegawaiTHR = null;
		this.kdKategoriPegawaiBonus = null;

		// this.ceklisKomponen = false;
		this.listHarga = [];
		this.listHargaPensiun = [];
		this.listHargaBonus = [];
		this.listHargaTHR = [];

		this.dataEditHarga = true;
		this.dataEditHargaPensiun = true;
		this.dataEditHargaTHR = true;
		this.dataEditHargaBonus = true;
		this.dataEditPersen = true;
		this.dataEditPersenPensiun = true;
		this.dataEditPersenBonus = true;
		this.dataEditPersenTHR = true;
		// this.cekKomponenHargaTake = true;
		// this.btnKomponenHargaTake = true;
		this.form = this.fb.group({
			'noSk': new FormControl(''),
			'namaSk': new FormControl('', Validators.required),
			'tanggalAwal': new FormControl({ value: '', disabled: true }),
			'tanggalAkhir': new FormControl({ value: '', disabled: true }),
			'kdGolonganPegawai': new FormControl('', Validators.required),
			'kdKategoryPegawai': new FormControl('', Validators.required),
			'kdKomponenHarga': new FormControl('', Validators.required),
			'kdKomponenHargaTake': new FormControl(''),
			// 'kdRange': new FormControl('', Validators.required),
			'kdRange': new FormControl(null),
			'kdPangkat': new FormControl('', Validators.required),
			// 'kdKeteranganAlasan': new FormControl('', Validators.required),
			'kdKeteranganAlasan': new FormControl(null),
			'hargaSatuanPersen': new FormControl(''),
			'hargaSatuan': new FormControl(''),
			'factorRate': new FormControl(''),
			'factorRateDivide': new FormControl(''),
			'totalPoin': new FormControl(''),
			// 'btKomponen': new FormControl(''),
			'kdOperatorFactorRate': new FormControl(''),
			'statusEnabled': new FormControl(''),
		});

		this.formPensiun = this.fb.group({
			'noSk': new FormControl(''),
			'namaSk': new FormControl('', Validators.required),
			'tanggalAwal': new FormControl({ value: '', disabled: true }),
			'tanggalAkhir': new FormControl({ value: '', disabled: true }),
			'kdGolonganPegawai': new FormControl('', Validators.required),
			'kdKategoryPegawai': new FormControl('', Validators.required),
			'kdKomponenHarga': new FormControl('', Validators.required),
			'kdKomponenHargaTake': new FormControl(''),
			// 'kdRange': new FormControl('', Validators.required),
			'kdRange': new FormControl(null),
			'kdPangkat': new FormControl('', Validators.required),
			// 'kdKeteranganAlasan': new FormControl('', Validators.required),
			'kdKeteranganAlasan': new FormControl(null),
			'hargaSatuanPersen': new FormControl(''),
			'hargaSatuan': new FormControl(''),
			'factorRate': new FormControl(''),
			'factorRateDivide': new FormControl(''),
			'totalPoin': new FormControl(''),
			// 'btKomponen': new FormControl(''),
			'kdOperatorFactorRate': new FormControl(''),
			'statusEnabled': new FormControl(''),
		});
		this.formBonus = this.fb.group({
			'noSk': new FormControl(''),
			'namaSk': new FormControl('', Validators.required),
			'tanggalAwal': new FormControl({ value: '', disabled: true }),
			'tanggalAkhir': new FormControl({ value: '', disabled: true }),
			'kdGolonganPegawai': new FormControl('', Validators.required),
			'kdKategoryPegawai': new FormControl('', Validators.required),
			'kdKomponenHarga': new FormControl('', Validators.required),
			'kdKomponenHargaTake': new FormControl(''),
			// 'kdRange': new FormControl('', Validators.required),
			'kdRange': new FormControl(null),
			'kdPangkat': new FormControl('', Validators.required),
			// 'kdKeteranganAlasan': new FormControl('', Validators.required),
			'kdKeteranganAlasan': new FormControl(null),
			'hargaSatuanPersen': new FormControl(''),
			'hargaSatuan': new FormControl(''),
			'factorRate': new FormControl(''),
			'factorRateDivide': new FormControl(''),
			'totalPoin': new FormControl(''),
			// 'btKomponen': new FormControl(''),
			'kdOperatorFactorRate': new FormControl(''),
			'statusEnabled': new FormControl(''),
		});
		this.formTHR = this.fb.group({
			'noSk': new FormControl(''),
			'namaSk': new FormControl('', Validators.required),
			'tanggalAwal': new FormControl({ value: '', disabled: true }),
			'tanggalAkhir': new FormControl({ value: '', disabled: true }),
			'kdGolonganPegawai': new FormControl('', Validators.required),
			'kdKategoryPegawai': new FormControl('', Validators.required),
			'kdKomponenHarga': new FormControl('', Validators.required),
			'kdKomponenHargaTake': new FormControl(''),
			// 'kdRange': new FormControl('', Validators.required),
			'kdRange': new FormControl(null),
			'kdPangkat': new FormControl('', Validators.required),
			// 'kdKeteranganAlasan': new FormControl('', Validators.required),
			'kdKeteranganAlasan': new FormControl(null),
			'hargaSatuanPersen': new FormControl(''),
			'hargaSatuan': new FormControl(''),
			'factorRate': new FormControl(''),
			'factorRateDivide': new FormControl(''),
			'totalPoin': new FormControl(''),
			// 'btKomponen': new FormControl(''),
			'kdOperatorFactorRate': new FormControl(''),
			'statusEnabled': new FormControl(''),
		});


		this.form.get('kdOperatorFactorRate').setValue("x");
		this.formPensiun.get('kdOperatorFactorRate').setValue("x");
		this.formBonus.get('kdOperatorFactorRate').setValue("x");
		this.formTHR.get('kdOperatorFactorRate').setValue("x");
		this.form.get('factorRate').setValue("1");
		this.formPensiun.get('factorRate').setValue("1");
		this.formBonus.get('factorRate').setValue("1");
		this.formTHR.get('factorRate').setValue("1");
		this.getSmbrFile();

	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}
	// list komponen take

	tambahKomponen() {

		// if (this.listHarga.length == 0) {
			let dataTemp = {
				"range": {
					"namaRange": "--Pilih--",
					"id_kode": null
				},
				"keteranganAlasan" : {
					"namaKeteranganAlasan": "--Pilih--",
					"kdKeteranganAlasan": null
				},

				"dataHarga": {
					"namaKomponen": "--Pilih--",
					"kdKomponen": null,
				},
				"hargaSatuan": null,
				"persenHargaSatuan": null,
				"factorRate": 1,
				"dataRate": {
					"operatorFactorRate": "x",
					"kode": "x",
				},
				"factorRateDivide": "",
				"totalPoin": "",
				"statusAktif": true,
				"noSK": null,

			}
			let listHarga = [...this.listHarga];
			listHarga.push(dataTemp);
			this.listHarga = listHarga;
		// } else {
		// 	let last = this.listHarga.length - 1;
		// 	if (this.listHarga[last].dataHarga.kode == null ||
		// 		this.listHarga[last].dataHarga.namaKomponen == '') {
		// 		this.alertService.warn('Peringatan', 'Pilih Komponen Harga Take')
		// 	} else {
		// 		for (let i = 0; i < this.listKomponenTake.length; i++) {
		// 			if (this.listKomponenTake[i].value.kode == this.listHarga[last].dataHarga.kode) {
		// 				this.listKomponenTake.splice(i, 1);
		// 			}
		// 		}
		// 		let dataTemp = {
		// 			"dataHarga": {
		// 				"namaKomponen": "--Pilih--",
		// 				// "kode": null,
		// 			},
		// 			"hargaSatuan": null,
		// 			"persenHargaSatuan": null,
		// 			"factorRate": 1,
		// 			"dataRate": {
		// 				"operatorFactorRate": "x",
		// 				"kode": "x",
		// 			},
		// 			"factorRateDivide": "",
		// 			///
		// 			"totalPoin": "",
		// 			///
		// 			"statusAktif": true,
		// 			"noSK": null,
		// 		}
		// 		let listHarga = [...this.listHarga];
		// 		listHarga.push(dataTemp);
		// 		this.listHarga = listHarga;
		// }

		// }

	}

	tambahKomponenTHR() {
		let dataTemp = {
			"range": {
				"namaRange": "--Pilih--",
				"id_kode": null
			},
			"keteranganAlasan" : {
				"namaKeteranganAlasan": "--Pilih--",
				"kdKeteranganAlasan": null
			},

			"dataHarga": {
				"namaKomponen": "--Pilih--",
				"kdKomponen": null,
			},
			"hargaSatuan": null,
			"persenHargaSatuan": null,
			"factorRate": 1,
			"dataRate": {
				"operatorFactorRate": "x",
				"kode": "x",
			},
			"factorRateDivide": "",
			"totalPoin": "",
			"statusAktif": true,
			"noSK": null,

		}
		let listHarga = [...this.listHargaTHR];
		listHarga.push(dataTemp);
		this.listHargaTHR = listHarga;
	}
	tambahKomponenPensiun() {
		let dataTemp = {
			"range": {
				"namaRange": "--Pilih--",
				"id_kode": null
			},
			"keteranganAlasan" : {
				"namaKeteranganAlasan": "--Pilih--",
				"kdKeteranganAlasan": null
			},

			"dataHarga": {
				"namaKomponen": "--Pilih--",
				"kdKomponen": null,
			},
			"hargaSatuan": null,
			"persenHargaSatuan": null,
			"factorRate": 1,
			"dataRate": {
				"operatorFactorRate": "x",
				"kode": "x",
			},
			"factorRateDivide": "",
			"totalPoin": "",
			"statusAktif": true,
			"noSK": null,

		}
		let listHarga = [...this.listHargaPensiun];
		listHarga.push(dataTemp);
		this.listHargaPensiun = listHarga;
	}
	tambahKomponenBonus() {
		let dataTemp = {
			"range": {
				"namaRange": "--Pilih--",
				"id_kode": null
			},
			"keteranganAlasan" : {
				"namaKeteranganAlasan": "--Pilih--",
				"kdKeteranganAlasan": null
			},

			"dataHarga": {
				"namaKomponen": "--Pilih--",
				"kdKomponen": null,
			},
			"hargaSatuan": null,
			"persenHargaSatuan": null,
			"factorRate": 1,
			"dataRate": {
				"operatorFactorRate": "x",
				"kode": "x",
			},
			"factorRateDivide": "",
			"totalPoin": "",
			"statusAktif": true,
			"noSK": null,

		}
		let listHarga = [...this.listHargaBonus];
		listHarga.push(dataTemp);
		this.listHargaBonus = listHarga;
	}

	hapusRow(row) {
		let listHarga = [...this.listHarga];
		listHarga.splice(row, 1);
		this.listHarga = listHarga;
	}

	hapusRowPensiun(row) {
		let listHarga = [...this.listHargaPensiun];
		listHarga.splice(row, 1);
		this.listHargaPensiun = listHarga;
	}
	hapusRowTHR(row) {
		let listHarga = [...this.listHargaTHR];
		listHarga.splice(row, 1);
		this.listHargaTHR = listHarga;
	}
	hapusRowBonus(row) {
		let listHarga = [...this.listHargaBonus];
		listHarga.splice(row, 1);
		this.listHargaBonus = listHarga;
	}

	// getKomponenHargaTake(event) {
	// 	if (event) {
	// 		this.cekKomponenHargaTake = false;
	// 		this.btnKomponenHargaTake = false;
	// 	} else {
	// 		this.cekKomponenHargaTake = true;
	// 		this.btnKomponenHargaTake = true;
	// 		if (this.listHarga.length > 0) {
	// 			return this.listHarga = [];
	// 		}
	// 	}
	// }

	getKomponen(dataPeg) {
		// console.log(dataPeg);

		// /profilestrukturgajibymkgp/findByKodeV2/nosk/kdkat/kdgol/kdpang/kdkomhar

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKodeV2/' + dataPeg.data.noSK + '/' + dataPeg.data.kdKategoryPegawai + '/' + dataPeg.data.kdGolonganPegawai + '/' + dataPeg.data.kdPangkat + '/' + dataPeg.data.kdKomponenHarga).subscribe(table => {
		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKode/' + dataPeg.data.kode.noSK + '/' + dataPeg.data.kode.kdKategoryPegawai + '/' + dataPeg.data.kode.kdRangeMasaKerja + '/' + dataPeg.data.kode.kdGolonganPegawai + '/' + dataPeg.data.kode.kdPangkat + '/' + dataPeg.data.kode.kdKomponenHarga + '/' + dataPeg.data.kode.kdKeteranganAlasan).subscribe(table => {
			let komponen = table.ProfileStrukturGajiByGPMKP;
			this.listHarga = [];

			let dataFix
			for (let i = 0; i < komponen.length; i++) {
				dataFix = {
					"range": {
						"namaRange": komponen[i].namaRange,
						"id_kode": komponen[i].kode.kdRangeMasaKerja
					},
					"keteranganAlasan" : {
						"namaKeteranganAlasan": komponen[i].namaKeteranganAlasan,
						"kdKeteranganAlasan": komponen[i].kode.kdKeteranganAlasan
					},
					"dataHarga": {
						"namaKomponen": komponen[i].namaKomponenHargaTake,
						"kdKomponen": komponen[i].kode.kdKomponenHargaTake,
					},
					"hargaSatuan": komponen[i].hargaSatuan,
					"persenHargaSatuan": komponen[i].persenHargaSatuan,
					"factorRate": komponen[i].factorRate,
					"dataRate": {
						"operatorFactorRate": komponen[i].operatorFactorRate,
						"kode": komponen[i].operatorFactorRate,
					},
					"factorRateDivide": komponen[i].factorRateDivide,
					"totalPoin": komponen[i].totalPoin,
					"statusAktif": komponen[i].statusEnabled,
					"noSK": komponen[i].kode.noSK,

				}
				this.listHarga.push(dataFix);
			}
			// console.log(komponen);
			// let dataFix
			// for (let i = 0; i < komponen.length; i++) {
			// 	dataFix = {
			// 		dataHarga: {
			// 			id_kode: komponen[i].kode.kdKomponenHargaTake,
			// 			namaKomponen: komponen[i].namaKomponen,
			// 			// kdKomponenHargaTake: komponen[i].kode.kdKomponenHargaTake,
			// 			// noSK: komponen[i].kode.noSK,
			// 		},
			// 		hargaSatuan: komponen[i].hargaSatuan,
			// 		persenHargaSatuan: komponen[i].persenHargaSatuan,
			// 		factorRate: komponen[i].factorRate,
			// 		dataRate: {
			// 			operatorFactorRate: komponen[i].operatorFactorRate,
			// 			kdOperatorFactorRate: komponen[i].operatorFactorRate,
			// 			kode: komponen[i].operatorFactorRate,
			// 		},
			// 		factorRateDivide: komponen[i].factorRateDivide,
			// 		statusAktif: komponen[i].statusEnabled,
			// 		noSK: komponen[i].kode.noSK,

			// 	}
			// 	this.listHarga.push(dataFix);
			// }
			// if (komponen.length) {
			// this.cekKomponenHargaTake = false;
			// this.btnKomponenHargaTake = false;
			// this.ceklisKomponen = false;
			// } else {
			// this.cekKomponenHargaTake = true;
			// this.btnKomponenHargaTake = true;
			// this.ceklisKomponen = true;
			// }
			// console.log(this.listHarga);
		});
	}
	//end

	getKomponenTHR(dataPeg) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKodeV2/' + dataPeg.data.noSK + '/' + dataPeg.data.kdKategoryPegawai + '/' + dataPeg.data.kdGolonganPegawai + '/' + dataPeg.data.kdPangkat + '/' + dataPeg.data.kdKomponenHarga).subscribe(table => {
		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKode/' + dataPeg.data.kode.noSK + '/' + dataPeg.data.kode.kdKategoryPegawai + '/' + dataPeg.data.kode.kdRangeMasaKerja + '/' + dataPeg.data.kode.kdGolonganPegawai + '/' + dataPeg.data.kode.kdPangkat + '/' + dataPeg.data.kode.kdKomponenHarga + '/' + dataPeg.data.kode.kdKeteranganAlasan).subscribe(table => {
			let komponen = table.ProfileStrukturGajiByGPMKP;
			this.listHargaTHR = [];

			let dataFix
			for (let i = 0; i < komponen.length; i++) {
				dataFix = {
					"range": {
						"namaRange": komponen[i].namaRange,
						"id_kode": komponen[i].kode.kdRangeMasaKerja
					},
					"keteranganAlasan" : {
						"namaKeteranganAlasan": komponen[i].namaKeteranganAlasan,
						"kdKeteranganAlasan": komponen[i].kode.kdKeteranganAlasan
					},

					"dataHarga": {
						"namaKomponen": komponen[i].namaKomponenHargaTake,
						"kdKomponen": komponen[i].kode.kdKomponenHargaTake,
					},
					"hargaSatuan": komponen[i].hargaSatuan,
					"persenHargaSatuan": komponen[i].persenHargaSatuan,
					"factorRate": komponen[i].factorRate,
					"dataRate": {
						"operatorFactorRate": komponen[i].operatorFactorRate,
						"kode": komponen[i].operatorFactorRate,
					},
					"factorRateDivide": komponen[i].factorRateDivide,
					"totalPoin": komponen[i].totalPoin,
					"statusAktif": komponen[i].statusEnabled,
					"noSK": komponen[i].kode.noSK,

				}
				this.listHargaTHR.push(dataFix);
			}
		});
	}
	getKomponenPensiun(dataPeg) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKodeV2/' + dataPeg.data.noSK + '/' + dataPeg.data.kdKategoryPegawai + '/' + dataPeg.data.kdGolonganPegawai + '/' + dataPeg.data.kdPangkat + '/' + dataPeg.data.kdKomponenHarga).subscribe(table => {
		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKode/' + dataPeg.data.kode.noSK + '/' + dataPeg.data.kode.kdKategoryPegawai + '/' + dataPeg.data.kode.kdRangeMasaKerja + '/' + dataPeg.data.kode.kdGolonganPegawai + '/' + dataPeg.data.kode.kdPangkat + '/' + dataPeg.data.kode.kdKomponenHarga + '/' + dataPeg.data.kode.kdKeteranganAlasan).subscribe(table => {
			let komponen = table.ProfileStrukturGajiByGPMKP;
			this.listHargaPensiun = [];

			let dataFix
			for (let i = 0; i < komponen.length; i++) {
				dataFix = {
					"range": {
						"namaRange": komponen[i].namaRange,
						"id_kode": komponen[i].kode.kdRangeMasaKerja
					},
					"keteranganAlasan" : {
						"namaKeteranganAlasan": komponen[i].namaKeteranganAlasan,
						"kdKeteranganAlasan": komponen[i].kode.kdKeteranganAlasan
					},

					"dataHarga": {
						"namaKomponen": komponen[i].namaKomponenHargaTake,
						"kdKomponen": komponen[i].kode.kdKomponenHargaTake,
					},
					"hargaSatuan": komponen[i].hargaSatuan,
					"persenHargaSatuan": komponen[i].persenHargaSatuan,
					"factorRate": komponen[i].factorRate,
					"dataRate": {
						"operatorFactorRate": komponen[i].operatorFactorRate,
						"kode": komponen[i].operatorFactorRate,
					},
					"factorRateDivide": komponen[i].factorRateDivide,
					"totalPoin": komponen[i].totalPoin,
					"statusAktif": komponen[i].statusEnabled,
					"noSK": komponen[i].kode.noSK,

				}
				this.listHargaPensiun.push(dataFix);
			}
		});
	}
	getKomponenBonus(dataPeg) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKodeV2/' + dataPeg.data.noSK + '/' + dataPeg.data.kdKategoryPegawai + '/' + dataPeg.data.kdGolonganPegawai + '/' + dataPeg.data.kdPangkat + '/' + dataPeg.data.kdKomponenHarga).subscribe(table => {
		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findByKode/' + dataPeg.data.kode.noSK + '/' + dataPeg.data.kode.kdKategoryPegawai + '/' + dataPeg.data.kode.kdRangeMasaKerja + '/' + dataPeg.data.kode.kdGolonganPegawai + '/' + dataPeg.data.kode.kdPangkat + '/' + dataPeg.data.kode.kdKomponenHarga + '/' + dataPeg.data.kode.kdKeteranganAlasan).subscribe(table => {
			let komponen = table.ProfileStrukturGajiByGPMKP;
			this.listHargaBonus = [];

			let dataFix
			for (let i = 0; i < komponen.length; i++) {
				dataFix = {
					"range": {
						"namaRange": komponen[i].namaRange,
						"id_kode": komponen[i].kode.kdRangeMasaKerja
					},
					"keteranganAlasan" : {
						"namaKeteranganAlasan": komponen[i].namaKeteranganAlasan,
						"kdKeteranganAlasan": komponen[i].kode.kdKeteranganAlasan
					},

					"dataHarga": {
						"namaKomponen": komponen[i].namaKomponenHargaTake,
						"kdKomponen": komponen[i].kode.kdKomponenHargaTake,
					},
					"hargaSatuan": komponen[i].hargaSatuan,
					"persenHargaSatuan": komponen[i].persenHargaSatuan,
					"factorRate": komponen[i].factorRate,
					"dataRate": {
						"operatorFactorRate": komponen[i].operatorFactorRate,
						"kode": komponen[i].operatorFactorRate,
					},
					"factorRateDivide": komponen[i].factorRateDivide,
					"totalPoin": komponen[i].totalPoin,
					"statusAktif": komponen[i].statusEnabled,
					"noSK": komponen[i].kode.noSK,

				}
				this.listHargaBonus.push(dataFix);
			}
		});
	}

	cari() { 

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPPHK?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=komponen.namaKomponen&sort=desc&namaKomponen=' + this.pencarian).subscribe(table => {
			this.listData = table.ProfileStrukturGajiByGPMKP;
		});
	}

	cariPensiun() { 

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPPensiun?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=komponen.namaKomponen&sort=desc&namaKomponen=' + this.pencarian).subscribe(table => {
			this.listDataPensiun = table.ProfileStrukturGajiByGPMKP;
		});
	}
	cariBonus() {

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPBonus?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=komponen.namaKomponen&sort=desc&namaKomponen=' + this.pencarian).subscribe(table => {
			this.listDataBonus = table.ProfileStrukturGajiByGPMKP;
		});
	}
	cariTHR() { 

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPTHR?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=komponen.namaKomponen&sort=desc&namaKomponen=' + this.pencarian).subscribe(table => {
			this.listDataTHR = table.ProfileStrukturGajiByGPMKP;
		});
	}

	get() {
		// this.getPage(Configuration.get().page, Configuration.get().rows);
		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getRangeMasaKerja').subscribe(res => {
		// 	this.listRange = [];
		// 	// this.listRange.push({ label: '--Pilih Range Masa Kerja Pegawai--', value: '' });
		// 	for (var i = 0; i < res.data.length; i++) {
		// 		this.listRange.push({ label: res.data[i].namaRange, value: res.data[i].id.kode })
		// 	};
		// 	this.selectedRange = this.listRange;
		// },
		// 	error => {
		// 		this.listRange = [];
		// 		this.listRange.push({ label: '-- ' + error + ' --', value: '' })
		// 	});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=id.kode,%20namaRange&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listRange = [];
			this.listRange.push({ label: '--Pilih Range Masa Kerja Pegawai--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				// this.listRange.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id_kode })
				this.listRange.push({ label: res.data.data[i].namaRange, value: res.data.data[i] })
			};
			this.selectedRange = this.listRange;
			this.selectedRangePensiun = this.listRange;
			this.selectedRangeBonus = this.listRange;
			this.selectedRangeTHR = this.listRange;
		},
		error => {
			this.listRange = [];
			this.listRange.push({ label: '-- ' + error + ' --', value: '' })
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=id.kode,%20namaKategoryPegawai').subscribe(res => {
			this.listKategoryPegawai = [];
			this.listKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode })
			};

		},
		error => {
			this.listKategoryPegawai = [];
			this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getGolonganPegawai').subscribe(res => {
			this.listGolonganPegawai = [];
			// this.listGolonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' });
			for (var i = 0; i < res.data.length; i++) {
				this.listGolonganPegawai.push({ label: res.data[i].namaGolonganPegawai, value: res.data[i].kode })
			};
			this.selectedGolongan = this.listGolonganPegawai;
			this.selectedGolonganPensiun = this.listGolonganPegawai;
			this.selectedGolonganBonus = this.listGolonganPegawai;
			this.selectedGolonganTHR = this.listGolonganPegawai;
		},
		error => {
			this.listGolonganPegawai = [];
			this.listGolonganPegawai.push({ label: '-- ' + error + ' --', value: '' })
		});

		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getKomponenGaji').subscribe(res => {
		// 	this.listKomponen = [];
		// 	this.listKomponen.push({ label: '--Pilih Komponen Harga--', value: '' });
		// 	for (var i = 0; i < res.data.length; i++) {
		// 		this.listKomponen.push({ label: res.data[i].namaKomponen, value: res.data[i].kode })
		// 	};
		// },
		// 	error => {
		// 		this.listKomponen = [];
		// 		this.listKomponen.push({ label: '-- ' + error + ' --', value: '' })
		// 	});

		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=id.kode,namaPangkat').subscribe(res => {
			this.listPangkat = [];
			// this.listPangkat.push({ label: '--Pilih Pangkat--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				this.listPangkat.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i].id_kode })
			};
			this.selectedPangkat = this.listPangkat;
			this.selectedPangkatPensiun = this.listPangkat;
			this.selectedPangkatBonus = this.listPangkat;
			this.selectedPangkatTHR = this.listPangkat;
		},
		error => {
			this.listPangkat = [];
			this.listPangkat.push({ label: '-- ' + error + ' --', value: '' })
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getKetAlasanMKGPPHK').subscribe(res => {
			this.listKeteranganAlasan = [];
			this.listKeteranganAlasan.push({label: "--Pilih Keterangan Alasan--", value: ''})
			for (var i = 0; i < res.data.length; i++) {
				// this.listKeteranganAlasan.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i].kdKeteranganAlasan })
				this.listKeteranganAlasan.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i] })
			};
			this.selectedKeteranganAlasan = this.listKeteranganAlasan;
		},
		error => {
			this.listKeteranganAlasan = [];
			this.listKeteranganAlasan.push({ label: '-- ' + error + ' --', value: '' })
		});


		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getKetAlasanMKGPBonus').subscribe(res => {
			this.listKeteranganAlasanBonus = [];
			this.listKeteranganAlasanBonus.push({label: "--Pilih Keterangan Alasan--", value: ''})
			for (var i = 0; i < res.data.length; i++) {
				// this.listKeteranganAlasanBonus.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i].kdKeteranganAlasan })
				this.listKeteranganAlasanBonus.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i]})
			};
			this.selectedKeteranganAlasanBonus = this.listKeteranganAlasanBonus;
		},
		error => {
			this.listKeteranganAlasanBonus = [];
			this.listKeteranganAlasanBonus.push({ label: '-- ' + error + ' --', value: '' })
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getKetAlasanMKGPTHR').subscribe(res => {
			this.listKeteranganAlasanTHR = [];
			this.listKeteranganAlasanTHR.push({label: "--Pilih Keterangan Alasan--", value: ''})
			for (var i = 0; i < res.data.length; i++) {
				// this.listKeteranganAlasanTHR.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i].kdKeteranganAlasan })
				this.listKeteranganAlasanTHR.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i] })
			};
			this.selectedKeteranganAlasanTHR = this.listKeteranganAlasanTHR;
		},
		error => {
			this.listKeteranganAlasanTHR = [];
			this.listKeteranganAlasanTHR.push({ label: '-- ' + error + ' --', value: '' })
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getKetAlasanMKGPPensiun').subscribe(res => {
			this.listKeteranganAlasanPensiun = [];
			this.listKeteranganAlasanPensiun.push({label: "--Pilih Keterangan Alasan--", value: ''})
			for (var i = 0; i < res.data.length; i++) {
				// this.listKeteranganAlasanPensiun.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i].kdKeteranganAlasan })
				this.listKeteranganAlasanPensiun.push({ label: res.data[i].namaKeteranganAlasan, value: res.data[i] })
			};
			this.selectedKeteranganAlasanPensiun = this.listKeteranganAlasanPensiun;
		},
		error => {
			this.listKeteranganAlasanPensiun = [];
			this.listKeteranganAlasanPensiun.push({ label: '-- ' + error + ' --', value: '' })
		});





		// this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getKomponenGaji').subscribe(res => {
		// 	this.listKomponenTake = [];
		// 	// this.listKomponenTake.push({ label: '--Pilih Komponen Take--', value: '' });
		// 	for (var i = 0; i < res.data.length; i++) {
		// 		this.listKomponenTake.push({ label: res.data[i].namaKomponen, value: res.data[i] })
		// 	};
		// },
		// 	error => {
		// 		this.listKomponenTake = [];
		// 		this.listKomponenTake.push({ label: '-- ' + error + ' --', value: '' })
		// 	});

		this.listOperatorFactorRate = [];
		this.listOperatorFactorRate.push({ label: '--Pilih Operator--', value: '' })
		this.listOperatorFactorRate.push({ label: "+", value: { "kode": "+" } })
		this.listOperatorFactorRate.push({ label: "-", value: { "kode": "-" } })
		this.listOperatorFactorRate.push({ label: "x", value: { "kode": "x" } })
		this.listOperatorFactorRate.push({ label: "/", value: { "kode": "/" } })

		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getSK').subscribe(res => {
			this.namaSK = [];
			this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
			for (var i = 0; i < res.SK.length; i++) {
				this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
			};
		});
	}


	valuechangeGetKomponen(kdKategoriPegawai) {
		// console.log(kdKategoriPegawai)
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpayrollbystatus/getKomponen/' + kdKategoriPegawai).subscribe(res => {
			this.listKomponen = [];
			this.listKomponenTake = [];
			this.listKomponen.push({ label: '--Pilih Komponen--', value: '' })
			this.listKomponenTake.push({ label: '--Pilih Komponen Take--', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listKomponen.push({ label: res.data[i].namaKomponen, value: res.data[i].kdKomponen })
				this.listKomponenTake.push({ label: res.data[i].namaKomponen, value: res.data[i] })
			};
		},
		error => {
			this.listKomponenTake = [];
			this.listKomponenTake.push({ label: '-- ' + error + ' --', value: '' })
			this.listKomponen = [];
			this.listKomponen.push({ label: '-- ' + error + ' --', value: '' })
		});

	}

	getDataGrid(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPPHK?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listData = table.ProfileStrukturGajiByGPMKP;
			this.totalRecords = table.totalRow;
		});
	}
	getDataGridPensiun(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPPensiun?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listDataPensiun = table.ProfileStrukturGajiByGPMKP;
			this.totalRecordsPensiun = table.totalRow;
		});
	}
	getDataGridTHR(page: number, rows: number, search: any) { 
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPTHR?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listDataTHR = table.ProfileStrukturGajiByGPMKP;
			this.totalRecordsTHR = table.totalRow;
		});
	}
	getDataGridBonus(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/findAllByKdMKGPBonus?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listDataBonus = table.ProfileStrukturGajiByGPMKP;
			this.totalRecordsBonus = table.totalRow;
		});
	}

	ambilSK(sk) {
		if (this.form.get('namaSk').value == '' || this.form.get('namaSk').value == null || this.form.get('namaSk').value == undefined) {
			this.form.get('noSk').setValue(null);
			this.form.get('tanggalAwal').setValue(null);
			this.form.get('tanggalAkhir').setValue(null);

		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getSK?noSK=' + sk.value).subscribe(table => {
				let detailSK = table.SK;
				console.log(detailSK);
				this.form.get('noSk').setValue(detailSK[0].noSK);
				this.form.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
				if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
					this.form.get('tanggalAkhir').setValue(null);
				} else {
					this.form.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

				}
			});
		}
	}

	ambilSKPensiun(sk) {
		if (this.formPensiun.get('namaSk').value == '' || this.formPensiun.get('namaSk').value == null || this.formPensiun.get('namaSk').value == undefined) {
			this.formPensiun.get('noSk').setValue(null);
			this.formPensiun.get('tanggalAwal').setValue(null);
			this.formPensiun.get('tanggalAkhir').setValue(null);

		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getSK?noSK=' + sk.value).subscribe(table => {
				let detailSK = table.SK;
				console.log(detailSK);
				this.formPensiun.get('noSk').setValue(detailSK[0].noSK);
				this.formPensiun.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
				if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
					this.formPensiun.get('tanggalAkhir').setValue(null);
				} else {
					this.formPensiun.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

				}
			});
		}
	}
	ambilSKTHR(sk) {
		if (this.formTHR.get('namaSk').value == '' || this.formTHR.get('namaSk').value == null || this.formTHR.get('namaSk').value == undefined) {
			this.formTHR.get('noSk').setValue(null);
			this.formTHR.get('tanggalAwal').setValue(null);
			this.formTHR.get('tanggalAkhir').setValue(null);

		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getSK?noSK=' + sk.value).subscribe(table => {
				let detailSK = table.SK;
				console.log(detailSK);
				this.formTHR.get('noSk').setValue(detailSK[0].noSK);
				this.formTHR.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
				if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
					this.formTHR.get('tanggalAkhir').setValue(null);
				} else {
					this.formTHR.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

				}
			});
		}
	}
	ambilSKBonus(sk) {
		if (this.formBonus.get('namaSk').value == '' || this.formBonus.get('namaSk').value == null || this.formBonus.get('namaSk').value == undefined) {
			this.formBonus.get('noSk').setValue(null);
			this.formBonus.get('tanggalAwal').setValue(null);
			this.formBonus.get('tanggalAkhir').setValue(null);

		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/getSK?noSK=' + sk.value).subscribe(table => {
				let detailSK = table.SK;
				console.log(detailSK);
				this.formBonus.get('noSk').setValue(detailSK[0].noSK);
				this.formBonus.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
				if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
					this.formBonus.get('tanggalAkhir').setValue(null);
				} else {
					this.formBonus.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

				}
			});
		}
	}

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	loadPagePensiun(event: LazyLoadEvent) {
		this.getDataGridPensiun((event.rows + event.first) / event.rows, event.rows, this.pencarianPensiun)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	loadPageBonus(event: LazyLoadEvent) {
		this.getDataGridBonus((event.rows + event.first) / event.rows, event.rows, this.pencarianBonus)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	loadPageTHR(event: LazyLoadEvent) {
		this.getDataGridTHR((event.rows + event.first) / event.rows, event.rows, this.pencarianTHR)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	getPersen(row) {
		let data = [... this.listHarga];
		if (data[row].persenHargaSatuan != null) {
			this.dataEditHarga = true;
		}
	}

	getHarga(row) {
		let akunBank = [... this.listHarga];
		if (akunBank[row].hargaSatuan != null) {
			this.dataEditPersen = true;
		}
	}

	setHarga(value) {
		if (value != null) {
			return parseInt(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		}
	}

	confirmDelete() {
		let noSk = this.form.get('noSk').value;
		if (noSk == null || noSk == undefined || noSk == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Profile Struktur Gaji by MKGP');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapus();
				}
			});
		}
	}

	confirmDeletePensiun() {
		let noSk = this.formPensiun.get('noSk').value;
		if (noSk == null || noSk == undefined || noSk == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Profile Struktur Gaji by MKGP');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusPensiun();
				}
			});
		}
	}
	confirmDeleteBonus() {
		let noSk = this.formBonus.get('noSk').value;
		if (noSk == null || noSk == undefined || noSk == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Profile Struktur Gaji by MKGP');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusBonus();
				}
			});
		}
	}
	confirmDeleteTHR() {
		let noSk = this.formTHR.get('noSk').value;
		if (noSk == null || noSk == undefined || noSk == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Profile Struktur Gaji by MKGP');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusTHR();
				}
			});
		}
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

	onSubmitPensiun() {
		if (this.formPensiun.invalid) {
			this.validateAllFormFields(this.formPensiun);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanPensiun();
		}
	}
	onSubmitTHR() {
		if (this.formTHR.invalid) {
			this.validateAllFormFields(this.formTHR);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanTHR();
		}
	}
	onSubmitBonus() {
		if (this.formBonus.invalid) {
			this.validateAllFormFields(this.formBonus);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanBonus();
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

	confirmUpdatePensiun() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updatePensiun();
			}
		});
	}
	confirmUpdateBonus() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updateBonus();
			}
		});
	}
	confirmUpdateTHR() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updateTHR();
			}
		});
	}

	setTimeStamp(date) {
		let dataTimeStamp = (new Date(date).getTime() / 1000);
		return dataTimeStamp;
	}

	update() {
		let dataKomponen = [];
		for (let i = 0; i < this.listHarga.length; i++) {
			dataKomponen.push({
				"factorRate": this.listHarga[i].factorRate,
				"kdKomponenHargaTake": this.listHarga[i].dataHarga.kdKomponen,
				"operatorFactorRate": this.listHarga[i].dataRate.kode,
				"hargaSatuan": this.listHarga[i].hargaSatuan,
				"persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
				"factorRateDivide": this.listHarga[i].factorRateDivide,
				"totalPoin": this.listHarga[i].totalPoin,
				"statusEnabled": this.listHarga[i].statusAktif,


				"kdKeteranganAlasan": this.listHarga[i].keteranganAlasan.kdKeteranganAlasan,
				"kdRangeMasaKerja": this.listHarga[i].range.id_kode

			})
		}
		let golongan = [];
		// let kategoriPegawai = [];
		let range = [];
		let pangkat = [];
		// let keteranganalasan = [];
		// for (let i = 0; i < this.selectedKeteranganAlasan.length; i++) {
		// 	keteranganalasan.push({
		// 		"kode": this.selectedKeteranganAlasan[i].value,
		// 	})
		// }
		// // for (let i = 0; i < this.selectedKategori.length; i++) {
		// // 	kategoriPegawai.push({
		// // 		"kode": this.selectedKategori[i].value,
		// // 	})
		// // }
		// for (let i = 0; i < this.selectedRange.length; i++) {
		// 	range.push({
		// 		"kode": this.selectedRange[i].value,
		// 	})
		// }
		for (let i = 0; i < this.selectedGolongan.length; i++) {
			golongan.push({
				"kode": this.selectedGolongan[i].value,
			})
		}
		for (let i = 0; i < this.selectedPangkat.length; i++) {
			pangkat.push({
				"kode": this.selectedPangkat[i].value,
			})
		}
		let dataTemp = [{
			"kode": parseInt(this.form.get('kdKategoryPegawai').value)
		}]


		let dataSimpan = {
			"komponen": dataKomponen,
			"noSK": this.form.get('noSk').value,
			"kdGolonganPegawai": golongan,
			"kdKategoryPegawai": dataTemp,
			"kdPangkat": pangkat,
			// "kdKeteranganAlasan": keteranganalasan,
			// "kdRangeMasaKerja": range,
			"kdKomponenHarga": this.form.get('kdKomponenHarga').value,
			"statusEnabled": true
			//this.form.get('statusEnabled').value
		}

		if (dataSimpan.statusEnabled == false){
			let item = [...this.listData];
			let deleteItem = item[this.findSelectedIndex()];
			this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGrid(this.page, this.rows, this.pencarian);
			});
			this.reset();
		}
		else {
			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGrid(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}

		// console.log(dataSimpan);
		// let dataKomponen = [];
		// console.log(this.listHarga);
		// for (let i = 0; i < this.listHarga.length; i++) {
		// 	dataKomponen.push({
		// 		"factorRate": this.listHarga[i].factorRate,
		// 		"factorRateDivide": this.listHarga[i].factorRateDivide,
		// 		"kdKomponenHargaTake": this.listHarga[i].dataHarga.id_kode,
		// 		"operatorFactorRate": this.listHarga[i].dataRate.kode,
		// 		"hargaSatuan": this.listHarga[i].hargaSatuan,
		// 		"persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
		// 		"statusEnabled": this.listHarga[i].statusAktif,

		// 	})
		// }
		// let dataSimpan = {
		// 	"komponen": dataKomponen,
		// 	"noSK": this.form.get('noSk').value,
		// 	"kdGolonganPegawai": this.selectedGolongan[0].value,
		// 	"kdKategoryPegawai": this.selectedPangkat[0].value,
		// 	"kdPangkat": this.selectedPangkat[0].value,
		// 	"kdRangeMasaKerja": this.selectedRange[0].value,
		// 	"kdKomponenHarga": this.form.get('kdKomponenHarga').value,
		// 	"statusEnabled": this.form.get('statusEnabled').value
		// }
		
	}

	updatePensiun() {
		let dataKomponen = [];
		for (let i = 0; i < this.listHargaPensiun.length; i++) {
			dataKomponen.push({
				"factorRate": this.listHargaPensiun[i].factorRate,
				"kdKomponenHargaTake": this.listHargaPensiun[i].dataHarga.kdKomponen,
				"operatorFactorRate": this.listHargaPensiun[i].dataRate.kode,
				"hargaSatuan": this.listHargaPensiun[i].hargaSatuan,
				"persenHargaSatuan": this.listHargaPensiun[i].persenHargaSatuan,
				"factorRateDivide": this.listHargaPensiun[i].factorRateDivide,
				"totalPoin": this.listHargaPensiun[i].totalPoin,
				"statusEnabled": this.listHargaPensiun[i].statusAktif,


				"kdKeteranganAlasan": this.listHargaPensiun[i].keteranganAlasan.kdKeteranganAlasan,
				"kdRangeMasaKerja": this.listHargaPensiun[i].range.id_kode
			})
		}
		let golongan = [];
		let range = [];
		let pangkat = [];
		// let keteranganalasan = [];
		// for (let i = 0; i < this.selectedKeteranganAlasanPensiun.length; i++) {
		// 	keteranganalasan.push({
		// 		"kode": this.selectedKeteranganAlasanPensiun[i].value,
		// 	})
		// }
		// for (let i = 0; i < this.selectedRangePensiun.length; i++) {
		// 	range.push({
		// 		"kode": this.selectedRangePensiun[i].value,
		// 	})
		// }
		for (let i = 0; i < this.selectedGolonganPensiun.length; i++) {
			golongan.push({
				"kode": this.selectedGolonganPensiun[i].value,
			})
		}
		for (let i = 0; i < this.selectedPangkatPensiun.length; i++) {
			pangkat.push({
				"kode": this.selectedPangkatPensiun[i].value,
			})
		}
		let dataTemp = [{
			"kode": parseInt(this.formPensiun.get('kdKategoryPegawai').value)
		}]
		let dataSimpan = {
			"komponen": dataKomponen,
			"noSK": this.formPensiun.get('noSk').value,
			"kdGolonganPegawai": golongan,
			"kdKategoryPegawai": dataTemp,
			"kdPangkat": pangkat,
			// "kdKeteranganAlasan": keteranganalasan,
			// "kdRangeMasaKerja": range,
			"kdKomponenHarga": this.formPensiun.get('kdKomponenHarga').value,
			"statusEnabled": true
			//this.formPensiun.get('statusEnabled').value
		}

		if (dataSimpan.statusEnabled == false){
			let item = [...this.listDataPensiun];
			let deleteItem = item[this.findSelectedIndexPensiun()];
			this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai+ '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGridPensiun(this.page, this.rows, this.pencarianPensiun);
			});
			this.reset();
		}
		else{
			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGridPensiun(this.page, this.rows, this.pencarianPensiun);
				this.reset();
			});
		}
	}
	updateTHR() {
		let dataKomponen = [];
		for (let i = 0; i < this.listHargaTHR.length; i++) {
			dataKomponen.push({
				"factorRate": this.listHargaTHR[i].factorRate,
				"kdKomponenHargaTake": this.listHargaTHR[i].dataHarga.kdKomponen,
				"operatorFactorRate": this.listHargaTHR[i].dataRate.kode,
				"hargaSatuan": this.listHargaTHR[i].hargaSatuan,
				"persenHargaSatuan": this.listHargaTHR[i].persenHargaSatuan,
				"factorRateDivide": this.listHargaTHR[i].factorRateDivide,
				"totalPoin": this.listHargaTHR[i].totalPoin,
				"statusEnabled": this.listHargaTHR[i].statusAktif,


				"kdKeteranganAlasan": this.listHargaTHR[i].keteranganAlasan.kdKeteranganAlasan,
				"kdRangeMasaKerja": this.listHargaTHR[i].range.id_kode
			})
		}
		let golongan = [];
		let range = [];
		let pangkat = [];
		// let keteranganalasan = [];
		// for (let i = 0; i < this.selectedKeteranganAlasanTHR.length; i++) {
		// 	keteranganalasan.push({
		// 		"kode": this.selectedKeteranganAlasanTHR[i].value,
		// 	})
		// }
		// for (let i = 0; i < this.selectedRangeTHR.length; i++) {
		// 	range.push({
		// 		"kode": this.selectedRangeTHR[i].value,
		// 	})
		// }
		for (let i = 0; i < this.selectedGolonganTHR.length; i++) {
			golongan.push({
				"kode": this.selectedGolonganTHR[i].value,
			})
		}
		for (let i = 0; i < this.selectedPangkatTHR.length; i++) {
			pangkat.push({
				"kode": this.selectedPangkatTHR[i].value,
			})
		}
		let dataTemp = [{
			"kode": parseInt(this.formTHR.get('kdKategoryPegawai').value)
		}]
		let dataSimpan = {
			"komponen": dataKomponen,
			"noSK": this.formTHR.get('noSk').value,
			"kdGolonganPegawai": golongan,
			"kdKategoryPegawai": dataTemp,
			"kdPangkat": pangkat,
			// "kdKeteranganAlasan": keteranganalasan,
			// "kdRangeMasaKerja": range,
			"kdKomponenHarga": this.formTHR.get('kdKomponenHarga').value,
			"statusEnabled": true
			//this.formTHR.get('statusEnabled').value
		}

		if (dataSimpan.statusEnabled == false){
			let item = [...this.listDataTHR];
			let deleteItem = item[this.findSelectedIndexTHR()];
			this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGridTHR(this.page, this.rows, this.pencarianTHR);
			});
			this.reset();
		}
		else {
			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGridTHR(this.page, this.rows, this.pencarianTHR);
				this.reset();
			});
		}
	}
	updateBonus() {
		let dataKomponen = [];
		for (let i = 0; i < this.listHargaBonus.length; i++) {
			dataKomponen.push({
				"factorRate": this.listHargaBonus[i].factorRate,
				"kdKomponenHargaTake": this.listHargaBonus[i].dataHarga.kdKomponen,
				"operatorFactorRate": this.listHargaBonus[i].dataRate.kode,
				"hargaSatuan": this.listHargaBonus[i].hargaSatuan,
				"persenHargaSatuan": this.listHargaBonus[i].persenHargaSatuan,
				"factorRateDivide": this.listHargaBonus[i].factorRateDivide,
				"totalPoin": this.listHargaBonus[i].totalPoin,
				"statusEnabled": this.listHargaBonus[i].statusAktif,


				"kdKeteranganAlasan": this.listHargaBonus[i].keteranganAlasan.kdKeteranganAlasan,
				"kdRangeMasaKerja": this.listHargaBonus[i].range.id_kode
			})
		}
		let golongan = [];
		let range = [];
		let pangkat = [];
		// let keteranganalasan = [];
		// for (let i = 0; i < this.selectedKeteranganAlasanBonus.length; i++) {
		// 	keteranganalasan.push({
		// 		"kode": this.selectedKeteranganAlasanBonus[i].value,
		// 	})
		// }
		// for (let i = 0; i < this.selectedRangeBonus.length; i++) {
		// 	range.push({
		// 		"kode": this.selectedRangeBonus[i].value,
		// 	})
		// }
		for (let i = 0; i < this.selectedGolonganBonus.length; i++) {
			golongan.push({
				"kode": this.selectedGolonganBonus[i].value,
			})
		}
		for (let i = 0; i < this.selectedPangkatBonus.length; i++) {
			pangkat.push({
				"kode": this.selectedPangkatBonus[i].value,
			})
		}
		let dataTemp = [{
			"kode": parseInt(this.formBonus.get('kdKategoryPegawai').value)
		}]
		let dataSimpan = {
			"komponen": dataKomponen,
			"noSK": this.formBonus.get('noSk').value,
			"kdGolonganPegawai": golongan,
			"kdKategoryPegawai": dataTemp,
			"kdPangkat": pangkat,
			// "kdKeteranganAlasan": keteranganalasan,
			// "kdRangeMasaKerja": range,
			"kdKomponenHarga": this.formBonus.get('kdKomponenHarga').value,
			"statusEnabled": true
			//this.formBonus.get('statusEnabled').value
		}

		if (dataSimpan.statusEnabled == false){
			let item = [...this.listDataBonus];
			let deleteItem = item[this.findSelectedIndexBonus()];
			this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai+ '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGridBonus(this.page, this.rows, this.pencarianBonus);
			});
			this.reset();
		}
		else{
			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.getDataGridBonus(this.page, this.rows, this.pencarianBonus);
				this.reset();
			});
		}
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else if (this.listHarga.length == 0 || this.listHarga.length == null) {
			this.alertService.warn('Peringatan', 'Data Komponen Harga Take Tidak Boleh Kosong')
		} else {
			let dataKomponen = [];
			for (let i = 0; i < this.listHarga.length; i++) {
				dataKomponen.push({
					"factorRate": this.listHarga[i].factorRate,
					"kdKomponenHargaTake": this.listHarga[i].dataHarga.kdKomponen,
					"operatorFactorRate": this.listHarga[i].dataRate.kode,
					"hargaSatuan": this.listHarga[i].hargaSatuan,
					"persenHargaSatuan": this.listHarga[i].persenHargaSatuan,
					"statusEnabled": this.listHarga[i].statusAktif,
					///
					"factorRateDivide": this.listHarga[i].factorRateDivide,
					"totalPoin": this.listHarga[i].totalPoin,
					///
					"kdKeteranganAlasan": this.listHarga[i].keteranganAlasan.kdKeteranganAlasan,
					"kdRangeMasaKerja": this.listHarga[i].range.id_kode
				})
			}
			let golongan = [];
			// let kategoriPegawai = [];
			let range = [];
			let pangkat = [];
			// let keteranganalasan = [];
			// for (let i = 0; i < this.selectedKeteranganAlasan.length; i++) {
			// 	keteranganalasan.push({
			// 		"kode": this.selectedKeteranganAlasan[i].value,
			// 	})
			// }
			// for (let i = 0; i < this.selectedKategori.length; i++) {
			// 	kategoriPegawai.push({
			// 		"kode": this.selectedKategori[i].value,
			// 	})
			// }
			// for (let i = 0; i < this.selectedRange.length; i++) {
			// 	range.push({
			// 		"kode": this.selectedRange[i].value,
			// 	})
			// }
			for (let i = 0; i < this.selectedGolongan.length; i++) {
				golongan.push({
					"kode": this.selectedGolongan[i].value,
				})
			}
			for (let i = 0; i < this.selectedPangkat.length; i++) {
				pangkat.push({
					"kode": this.selectedPangkat[i].value,
				})
			}
			let dataTemp = [{
				"kode": parseInt(this.form.get('kdKategoryPegawai').value)
			}]


			let dataSimpan = {
				"komponen": dataKomponen,
				"noSK": this.form.get('noSk').value,
				"kdGolonganPegawai": golongan,
				"kdKategoryPegawai": dataTemp,
				"kdPangkat": pangkat,
				// "kdKeteranganAlasan": keteranganalasan,
				// "kdRangeMasaKerja": range,
				"kdKomponenHarga": this.form.get('kdKomponenHarga').value,
				"statusEnabled": true
				//this.form.get('statusEnabled').value
			}

			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.getDataGrid(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}

	}

	simpanPensiun() {
		if (this.formAktifPensiun == false) {
			this.confirmUpdatePensiun()
		} else if (this.listHargaPensiun.length == 0 || this.listHargaPensiun.length == null) {
			this.alertService.warn('Peringatan', 'Data Komponen Harga Take Tidak Boleh Kosong')
		} else {
			let dataKomponen = [];
			for (let i = 0; i < this.listHargaPensiun.length; i++) {
				dataKomponen.push({
					"factorRate": this.listHargaPensiun[i].factorRate,
					"kdKomponenHargaTake": this.listHargaPensiun[i].dataHarga.kdKomponen,
					"operatorFactorRate": this.listHargaPensiun[i].dataRate.kode,
					"hargaSatuan": this.listHargaPensiun[i].hargaSatuan,
					"persenHargaSatuan": this.listHargaPensiun[i].persenHargaSatuan,
					"statusEnabled": this.listHargaPensiun[i].statusAktif,
					///
					"factorRateDivide": this.listHargaPensiun[i].factorRateDivide,
					"totalPoin": this.listHargaPensiun[i].totalPoin,
					///
					"kdKeteranganAlasan": this.listHargaPensiun[i].keteranganAlasan.kdKeteranganAlasan,
					"kdRangeMasaKerja": this.listHargaPensiun[i].range.id_kode

				})
			}
			let golongan = [];
			let range = [];
			let pangkat = [];
			// let keteranganalasan = [];
			// for (let i = 0; i < this.selectedKeteranganAlasanPensiun.length; i++) {
			// 	keteranganalasan.push({
			// 		"kode": this.selectedKeteranganAlasanPensiun[i].value,
			// 	})
			// }
			// for (let i = 0; i < this.selectedRangePensiun.length; i++) {
			// 	range.push({
			// 		"kode": this.selectedRangePensiun[i].value,
			// 	})
			// }
			for (let i = 0; i < this.selectedGolonganPensiun.length; i++) {
				golongan.push({
					"kode": this.selectedGolonganPensiun[i].value,
				})
			}
			for (let i = 0; i < this.selectedPangkatPensiun.length; i++) {
				pangkat.push({
					"kode": this.selectedPangkatPensiun[i].value,
				})
			}
			let dataTemp = [{
				"kode": parseInt(this.formPensiun.get('kdKategoryPegawai').value)
			}]


			let dataSimpan = {
				"komponen": dataKomponen,
				"noSK": this.formPensiun.get('noSk').value,
				"kdGolonganPegawai": golongan,
				"kdKategoryPegawai": dataTemp,
				"kdPangkat": pangkat,
				// "kdKeteranganAlasan": keteranganalasan,
				// "kdRangeMasaKerja": range,
				"kdKomponenHarga": this.formPensiun.get('kdKomponenHarga').value,
				"statusEnabled": true
				//this.formPensiun.get('statusEnabled').value
			}

			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.getDataGridPensiun(this.page, this.rows, this.pencarianPensiun);
				this.reset();
			});
		}

	}
	simpanTHR() {
		if (this.formAktifTHR == false) {
			this.confirmUpdateTHR()
		} else if (this.listHargaTHR.length == 0 || this.listHargaTHR.length == null) {
			this.alertService.warn('Peringatan', 'Data Komponen Harga Take Tidak Boleh Kosong')
		} else {
			let dataKomponen = [];
			for (let i = 0; i < this.listHargaTHR.length; i++) {
				dataKomponen.push({
					"factorRate": this.listHargaTHR[i].factorRate,
					"kdKomponenHargaTake": this.listHargaTHR[i].dataHarga.kdKomponen,
					"operatorFactorRate": this.listHargaTHR[i].dataRate.kode,
					"hargaSatuan": this.listHargaTHR[i].hargaSatuan,
					"persenHargaSatuan": this.listHargaTHR[i].persenHargaSatuan,
					"statusEnabled": this.listHargaTHR[i].statusAktif,
					///
					"factorRateDivide": this.listHargaTHR[i].factorRateDivide,
					"totalPoin": this.listHargaTHR[i].totalPoin,
					///
					"kdKeteranganAlasan": this.listHargaTHR[i].keteranganAlasan.kdKeteranganAlasan,
					"kdRangeMasaKerja": this.listHargaTHR[i].range.id_kode

				})
			}
			let golongan = [];
			let range = [];
			let pangkat = [];
			// let keteranganalasan = [];
			// for (let i = 0; i < this.selectedKeteranganAlasanTHR.length; i++) {
			// 	keteranganalasan.push({
			// 		"kode": this.selectedKeteranganAlasanTHR[i].value,
			// 	})
			// }
			// for (let i = 0; i < this.selectedRangeTHR.length; i++) {
			// 	range.push({
			// 		"kode": this.selectedRangeTHR[i].value,
			// 	})
			// }
			for (let i = 0; i < this.selectedGolonganTHR.length; i++) {
				golongan.push({
					"kode": this.selectedGolonganTHR[i].value,
				})
			}
			for (let i = 0; i < this.selectedPangkatTHR.length; i++) {
				pangkat.push({
					"kode": this.selectedPangkatTHR[i].value,
				})
			}
			let dataTemp = [{
				"kode": parseInt(this.formTHR.get('kdKategoryPegawai').value)
			}]


			let dataSimpan = {
				"komponen": dataKomponen,
				"noSK": this.formTHR.get('noSk').value,
				"kdGolonganPegawai": golongan,
				"kdKategoryPegawai": dataTemp,
				"kdPangkat": pangkat,
				// "kdKeteranganAlasan": keteranganalasan,
				// "kdRangeMasaKerja": range,
				"kdKomponenHarga": this.formTHR.get('kdKomponenHarga').value,
				"statusEnabled": true
				//this.formTHR.get('statusEnabled').value
			}

			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.getDataGridTHR(this.page, this.rows, this.pencarianTHR);
				this.reset();
			});
		}

	}
	simpanBonus() {
		if (this.formAktifBonus == false) {
			this.confirmUpdateBonus()
		} else if (this.listHargaBonus.length == 0 || this.listHargaBonus.length == null) {
			this.alertService.warn('Peringatan', 'Data Komponen Harga Take Tidak Boleh Kosong')
		} else {
			let dataKomponen = [];
			for (let i = 0; i < this.listHargaBonus.length; i++) {
				dataKomponen.push({
					"factorRate": this.listHargaBonus[i].factorRate,
					"kdKomponenHargaTake": this.listHargaBonus[i].dataHarga.kdKomponen,
					"operatorFactorRate": this.listHargaBonus[i].dataRate.kode,
					"hargaSatuan": this.listHargaBonus[i].hargaSatuan,
					"persenHargaSatuan": this.listHargaBonus[i].persenHargaSatuan,
					"statusEnabled": this.listHargaBonus[i].statusAktif,
					///
					"factorRateDivide": this.listHargaBonus[i].factorRateDivide,
					"totalPoin": this.listHargaBonus[i].totalPoin,
					///
					"kdKeteranganAlasan": this.listHargaBonus[i].keteranganAlasan.kdKeteranganAlasan,
					"kdRangeMasaKerja": this.listHargaBonus[i].range.id_kode

				})
			}
			let golongan = [];
			let range = [];
			let pangkat = [];
			// let keteranganalasan = [];
			// for (let i = 0; i < this.selectedKeteranganAlasanBonus.length; i++) {
			// 	keteranganalasan.push({
			// 		"kode": this.selectedKeteranganAlasanBonus[i].value,
			// 	})
			// }
			// for (let i = 0; i < this.selectedRangeBonus.length; i++) {
			// 	range.push({
			// 		"kode": this.selectedRangeBonus[i].value,
			// 	})
			// }
			for (let i = 0; i < this.selectedGolonganBonus.length; i++) {
				golongan.push({
					"kode": this.selectedGolonganBonus[i].value,
				})
			}
			for (let i = 0; i < this.selectedPangkatBonus.length; i++) {
				pangkat.push({
					"kode": this.selectedPangkatBonus[i].value,
				})
			}
			let dataTemp = [{
				"kode": parseInt(this.formBonus.get('kdKategoryPegawai').value)
			}]


			let dataSimpan = {
				"komponen": dataKomponen,
				"noSK": this.formBonus.get('noSk').value,
				"kdGolonganPegawai": golongan,
				"kdKategoryPegawai": dataTemp,
				"kdPangkat": pangkat,
				// "kdKeteranganAlasan": keteranganalasan,
				// "kdRangeMasaKerja": range,
				"kdKomponenHarga": this.formBonus.get('kdKomponenHarga').value,
				"statusEnabled": true
				//this.formBonus.get('statusEnabled').value
			}

			this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/save?', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.getDataGridBonus(this.page, this.rows, this.pencarianBonus);
				this.reset();
			});
		}

	}

	reset() {
		this.form.get('namaSk').enable();
		this.form.get('kdKomponenHarga').enable();
		this.form.get('kdPangkat').enable();
		this.form.get('kdKeteranganAlasan').enable();
		this.form.get('kdKategoryPegawai').enable();
		this.form.get('kdRange').enable();
		this.form.get('kdGolonganPegawai').enable();
		this.form.get('statusEnabled').enable();

		this.formPensiun.get('namaSk').enable();
		this.formPensiun.get('kdKomponenHarga').enable();
		this.formPensiun.get('kdPangkat').enable();
		this.formPensiun.get('kdKeteranganAlasan').enable();
		this.formPensiun.get('kdKategoryPegawai').enable();
		this.formPensiun.get('kdRange').enable();
		this.formPensiun.get('kdGolonganPegawai').enable();
		this.formPensiun.get('statusEnabled').enable();

		this.formBonus.get('namaSk').enable();
		this.formBonus.get('kdKomponenHarga').enable();
		this.formBonus.get('kdPangkat').enable();
		this.formBonus.get('kdKeteranganAlasan').enable();
		this.formBonus.get('kdKategoryPegawai').enable();
		this.formBonus.get('kdRange').enable();
		this.formBonus.get('kdGolonganPegawai').enable();
		this.formBonus.get('statusEnabled').enable();

		this.formTHR.get('namaSk').enable();
		this.formTHR.get('kdKomponenHarga').enable();
		this.formTHR.get('kdPangkat').enable();
		this.formTHR.get('kdKeteranganAlasan').enable();
		this.formTHR.get('kdKategoryPegawai').enable();
		this.formTHR.get('kdRange').enable();
		this.formTHR.get('kdGolonganPegawai').enable();
		this.formTHR.get('statusEnabled').enable();

		// this.ceklisKomponen =false;
		this.formAktif = true;
		this.formAktifPensiun = true;
		this.formAktifBonus = true;
		this.formAktifTHR = true;
		this.ngOnInit();
	}

	onRowSelect(event) {
		this.dataSK = [];
		this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
		// let cloned = this.clone(event.data);
		this.formAktif = false;
		// this.form.setValue(cloned);
		this.form.get('namaSk').disable();
		this.form.get('kdKomponenHarga').disable();
		this.form.get('kdKategoryPegawai').disable();
		// this.form.get('kdRange').disable();
		this.form.get('kdGolonganPegawai').disable();
		//this.form.get('statusEnabled').disable();
		this.tambahOnOff = true;
		this.form.get('kdPangkat').disable();
		// this.form.get('kdKeteranganAlasan').disable();
		this.form.get('kdKomponenHargaTake').disable();
		this.getKomponen(event);
		// this.selectedKategori = [{
		// 	label: event.data.namaKategoryPegawai,
		// 	value: event.data.kode.kdKategoryPegawai
		// }];
		// this.selectedRange = [{
		// 	label: event.data.namaRange,
		// 	value: event.data.kode.kdRangeMasaKerja
		// }];
		this.selectedGolongan = [{
			label: event.data.namaGolonganPegawai,
			value: event.data.kdGolonganPegawai
		}];
		this.selectedPangkat = [{
			label: event.data.namaPangkat,
			value: event.data.kdPangkat
		}];
		// this.selectedKeteranganAlasan = [{
		// 	label: event.data.namaKeteranganAlasan,
		// 	value: event.data.kode.kdKeteranganAlasan
		// }];
		// if (this.listHarga.length == 0) {
		//     this.btKomponen = false
		//   } else {
		//     this.form.get('btKomponen').setValue(true);
		//     this.btKomponen = true;
		//     this.form.get('btKomponen').disable();
		//   }

		this.form.get('kdKomponenHarga').setValue(event.data.kdKomponenHarga);
		this.form.get('namaSk').setValue(event.data.noSK);
		this.form.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
		this.form.get('noSk').setValue(event.data.noSK);
		// this.form.get('btKomponen').setValue(this.btKomponen);
		// this.form.get('kdStatusPegawai').setValue(event.data.kode.kdStatusPegawai);
		this.form.get('statusEnabled').setValue(event.data.statusEnabled);

		if (event.data.tglBerlakuAkhir == null) {
			this.form.get('tanggalAkhir').setValue(null)
		} else {
			this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

		}
		this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
	}

	onRowSelectPensiun(event) {
		this.dataSK = [];
		this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
		this.formAktifPensiun = false;
		this.formPensiun.get('namaSk').disable();
		this.formPensiun.get('kdKomponenHarga').disable();
		this.formPensiun.get('kdKategoryPegawai').disable();
		// this.formPensiun.get('kdRange').disable();
		this.formPensiun.get('kdGolonganPegawai').disable();
		//this.formPensiun.get('statusEnabled').disable();
		this.tambahOnOffPensiun = true;
		this.formPensiun.get('kdPangkat').disable();
		// this.formPensiun.get('kdKeteranganAlasan').disable();
		this.formPensiun.get('kdKomponenHargaTake').disable();
		this.getKomponenPensiun(event);
		// this.selectedRangePensiun = [{
		// 	label: event.data.namaRange,
		// 	value: event.data.kode.kdRangeMasaKerja
		// }];
		this.selectedGolonganPensiun = [{
			label: event.data.namaGolonganPegawai,
			value: event.data.kdGolonganPegawai
		}];
		this.selectedPangkatPensiun = [{
			label: event.data.namaPangkat,
			value: event.data.kdPangkat
		}];
		// this.selectedKeteranganAlasanPensiun = [{
		// 	label: event.data.namaKeteranganAlasan,
		// 	value: event.data.kode.kdKeteranganAlasan
		// }];

		this.formPensiun.get('kdKomponenHarga').setValue(event.data.kdKomponenHarga);
		this.formPensiun.get('namaSk').setValue(event.data.noSK);
		this.formPensiun.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
		this.formPensiun.get('noSk').setValue(event.data.noSK);
		this.formPensiun.get('statusEnabled').setValue(event.data.statusEnabled);

		if (event.data.tglBerlakuAkhir == null) {
			this.formPensiun.get('tanggalAkhir').setValue(null)
		} else {
			this.formPensiun.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

		}
		this.formPensiun.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
	}
	onRowSelectTHR(event) {
		this.dataSK = [];
		this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
		this.formAktifTHR = false;
		this.formTHR.get('namaSk').disable();
		this.formTHR.get('kdKomponenHarga').disable();
		this.formTHR.get('kdKategoryPegawai').disable();
		// this.formTHR.get('kdRange').disable();
		this.formTHR.get('kdGolonganPegawai').disable();
		//this.formTHR.get('statusEnabled').disable();
		this.tambahOnOffTHR = false;
		this.formTHR.get('kdPangkat').disable();
		// this.formTHR.get('kdKeteranganAlasan').disable();
		this.formTHR.get('kdKomponenHargaTake').disable();
		this.getKomponenTHR(event);
		// this.selectedRangeTHR = [{
		// 	label: event.data.namaRange,
		// 	value: event.data.kode.kdRangeMasaKerja
		// }];
		this.selectedGolonganTHR = [{
			label: event.data.namaGolonganPegawai,
			value: event.data.kdGolonganPegawai
		}];
		this.selectedPangkatTHR = [{
			label: event.data.namaPangkat,
			value: event.data.kdPangkat
		}];
		// this.selectedKeteranganAlasanTHR = [{
		// 	label: event.data.namaKeteranganAlasan,
		// 	value: event.data.kode.kdKeteranganAlasan
		// }];

		this.formTHR.get('kdKomponenHarga').setValue(event.data.kdKomponenHarga);
		this.formTHR.get('namaSk').setValue(event.data.noSK);
		this.formTHR.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
		this.formTHR.get('noSk').setValue(event.data.noSK);
		this.formTHR.get('statusEnabled').setValue(event.data.statusEnabled);

		if (event.data.tglBerlakuAkhir == null) {
			this.formTHR.get('tanggalAkhir').setValue(null)
		} else {
			this.formTHR.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

		}
		this.formTHR.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
	}
	onRowSelectBonus(event) {
		this.dataSK = [];
		this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
		this.formAktifBonus = false;
		this.formBonus.get('namaSk').disable();
		this.formBonus.get('kdKomponenHarga').disable();
		this.formBonus.get('kdKategoryPegawai').disable();
		// this.formBonus.get('kdRange').disable();
		this.formBonus.get('kdGolonganPegawai').disable();
		//this.formBonus.get('statusEnabled').disable();
		this.tambahOnOffBonus = true;
		this.formBonus.get('kdPangkat').disable();
		// this.formBonus.get('kdKeteranganAlasan').disable();
		this.formBonus.get('kdKomponenHargaTake').disable();
		this.getKomponenBonus(event);
		// this.selectedRangeBonus = [{
		// 	label: event.data.namaRange,
		// 	value: event.data.kode.kdRangeMasaKerja
		// }];
		this.selectedGolonganBonus = [{
			label: event.data.namaGolonganPegawai,
			value: event.data.kdGolonganPegawai
		}];
		this.selectedPangkatBonus = [{
			label: event.data.namaPangkat,
			value: event.data.kdPangkat
		}];
		// this.selectedKeteranganAlasanBonus = [{
		// 	label: event.data.namaKeteranganAlasan,
		// 	value: event.data.kode.kdKeteranganAlasan
		// }];

		this.formBonus.get('kdKomponenHarga').setValue(event.data.kdKomponenHarga);
		this.formBonus.get('namaSk').setValue(event.data.noSK);
		this.formBonus.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
		this.formBonus.get('noSk').setValue(event.data.noSK);
		this.formBonus.get('statusEnabled').setValue(event.data.statusEnabled);

		if (event.data.tglBerlakuAkhir == null) {
			this.formBonus.get('tanggalAkhir').setValue(null)
		} else {
			this.formBonus.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

		}
		this.formBonus.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
	}


	// clone(cloned: any){

	//   cloned = {
	//         "noSK": cloned.noSK,
	//         "namaSK": this.dataSK[0],
	//         "tglBerlakuAwal": new Date (cloned.tglBerlakuAwal * 1000),
	//         "tglBerlakuAkhir": new Date (cloned.tglBerlakuAkhir * 1000),
	//         "nilaiScorePassed": cloned.nilaiScorePassed,
	//         "kdJabatan": cloned.kdJabatan,
	//         "kdRangeNilaiScorePassed": cloned.kdRangeNilaiScorePassed,
	//         "kdProdukRS": cloned.kdProdukRS,
	//         "kdLevelTingkat": cloned.kdLevelTingkat,
	//         "kdJenisPegawai": cloned.kdJenisPegawai,
	//         "keteranganLainnya": cloned.keteranganLainnya,
	//         // "reportDisplay": hub.reportDisplay,
	//         // "kodeExternal": clonedExternal,
	//         // "namaExternal": hub.namaExternal,
	//         "statusEnabled": cloned.statusEnabled
	//     }
	//     this.versi = cloned.version;
	//     return cloned;
	// }

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.getDataGrid(this.page, this.rows, this.pencarian);
		});
		this.reset();
	}

	hapusPensiun() {
		let item = [...this.listDataPensiun];
		let deleteItem = item[this.findSelectedIndexPensiun()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.getDataGridPensiun(this.page, this.rows, this.pencarianPensiun);
		});
		this.reset();
	}
	hapusTHR() {
		let item = [...this.listDataTHR];
		let deleteItem = item[this.findSelectedIndexTHR()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.getDataGridTHR(this.page, this.rows, this.pencarianTHR);
		});
		this.reset();
	}
	hapusBonus() {
		let item = [...this.listDataBonus];
		let deleteItem = item[this.findSelectedIndexBonus()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkgp/del/' + deleteItem.noSK + '/' + deleteItem.kdKategoryPegawai+ '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdPangkat + '/' + deleteItem.kdKomponenHarga).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.getDataGridBonus(this.page, this.rows, this.pencarianBonus);
		});
		this.reset();
	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}

	findSelectedIndexPensiun(): number {
		return this.listDataPensiun.indexOf(this.selectedPensiun);
	}
	findSelectedIndexBonus(): number {
		return this.listDataBonus.indexOf(this.selectedBonus);
	}
	findSelectedIndexTHR(): number {
		return this.listDataTHR.indexOf(this.selectedTHR);
	}
	onDestroy() {

	}

	downloadExcel() {

	}

	downloadExcelPensiun() {

	}

	downloadExcelBonus() {

	}

	downloadExcelTHR() {

	}

	downloadPdf() {
		let cetak = Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
		window.open(cetak);
	}

	downloadPdfPensiun() {
		// let cetak = Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
		// window.open(cetak);
	}
	downloadPdfBonus() {
		// let cetak = Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
		// window.open(cetak);
	}
	downloadPdfTHR() {
		// let cetak = Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
		// window.open(cetak);
	}

	cetak() {
		this.laporan = true;
		this.print.showEmbedPDFReport(Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmProfileStrukturGajiByMkgp_laporanCetak');

	}

	cetakPensiun() {
		// this.laporan = true;
		// this.print.showEmbedPDFReport(Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmProfileStrukturGajiByMkgp_laporanCetak');

	}
	cetakTHR() {
		// this.laporan = true;
		// this.print.showEmbedPDFReport(Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmProfileStrukturGajiByMkgp_laporanCetak');

	}
	cetakBonus() {
		// this.laporan = true;
		// this.print.showEmbedPDFReport(Configuration.get().report + '/profileStrukturGajiByMKGP/laporanProfileStrukturGajiByMKGP.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmProfileStrukturGajiByMkgp_laporanCetak');

	}
	tutupLaporan() {
		this.laporan = false;
	}

}

// class Inisialprofilestrukturgajibygpmkp implements profilestrukturgajibymkgp {

// 	constructor(
// 		public namaSuratKeputusan?,
// 		public namaSK?,
// 		public kdRangeNilaiScorePassed?,
// 		public tglBerlakuAwal?,
// 		public kode?,
// 		public tglBerlakuAkhir?,
// 		public nilaiScoredPassed?,
// 		public reportDisplay?,
// 		public kodeExternal?,
// 		public namaExternal?,
// 		public statusEnabled?,
// 		public version?,
// 		public kdJabatan?,
// 		public kdRange?,
// 		public kdProdukRS?,
// 		public kdLevelTingkat?,
// 		public keteranganLainnya?,
// 		public kdJenisPegawai?,
// 		public noSK?,
// 		public nilaiScorePassed?,

// 	) { }

// }