import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Produk, SelectedItem, KelompokProduk, JenisProduk, DetailJenisProduk } from './produk-komponen.interface';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, SelectItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
	selector: 'app-produk-komponen',
	templateUrl: './produk-komponen.component.html',
	styleUrls: ['./produk-komponen.component.scss'],
	providers: [ConfirmationService]
})

export class ProdukKomponenComponent implements OnInit {

	kdDetailJenisProduk: any[];
	kdSatuanStandar: any[];
	kdSatuanKecil: any[];
	kdGolonganProduk: any[];
	kdDetailGolonganProduk: any[];
	kdKategoryProduk: any[];
	kdStatusProduk: any[];
	kdBentukProduk: any[];
	kdGProduk: any[];
	kdProdusenProduk: any[];
	kdTypeProduk: any[];
	kdBahanProduk: any[];
	kdWarnaProduk: any[];
	kdUnitLaporan: any[];
	kdJenisPeriksa: any[];
	kdFungsiProduk: any[];
	kdLevelTingkat: any[];
	kdAccount: any[];
	selected: Produk;
	listData: Produk[];
	pencarian: string;
	dataDummy: {};
	formAktif: boolean;
	versi: any;
	form: FormGroup;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	kdJenisTransaksi: any[];
	selectedKelompok: KelompokProduk;
	listDataKelompok: KelompokProduk[];
	pencarianKelompok: string;
	dataDummyKelompok: {};
	formAktifKelompok: boolean;
	versiKelompok: any;
	formKelompok: FormGroup;
	items: any;
	pageKelompok: number;
	rowsKelompok: number;
	totalRecordsKelompok: number;
	reportKelompok: any;
	toReportKelompok: any;
	cekIsHavingStok: any;
	isHavingStok: boolean;
	isStock: number;
	isPrice: number;
	cekIsHavingPrice: any;
	isHavingPrice: boolean;
	listJenisProduk: any[];
	kdKelompokProduk: any[];
	kdAccountJenisProduk: any[];
	selectedJenisProduk: JenisProduk;
	listDataJenisProduk: JenisProduk[];
	pencarianJenis: string;
	dataDummyJenisProduk: {};
	formAktifJenisProduk: boolean;
	versiJenisProduk: any;
	formJenisProduk: FormGroup;
	reportJenisProduk: any;
	toReportJenisProduk: any;
	itemsJenisProduk: any;
	pageJenisProduk: number;
	rowsJenisProduk: number;
	totalRecordsJenisProduk: number;
	kdJenisProduk: any[];
	kdAccountDetailJenisProduk: any[];
	selectedDetailJenisProduk: DetailJenisProduk;
	listDataDetailJenisProduk: DetailJenisProduk[];
	pencarianDetailJenis: string;
	dataDummyDetailJenisProduk: {};
	formAktifDetailJenisProduk: boolean;
	versiDetailJenisProduk: any;
	formDetailJenisProduk: FormGroup;
	itemsDetailJenisProduk: any;
	pageDetailJenisProduk: number;
	rowsDetailJenisProduk: number;
	totalRecordsDetailJenisProduk: number;
	reportDetailJenisProduk: any;
	toReportDetailJenisProduk: any;
	toReportDetail: any;
	reportDetail: any;
	tglDaftar: any;
	val: string = '1';
	listTab: any[];
	index: number = 0;
	tabIndex: number = 0;
	listTabDetail: any[];
	indexDetail: number = 0;
	tabIndexDetail: number = 0;
	formKomponen: FormGroup;
	kdprof: any;
	kddept: any;
	listKomponen: any;
	cekIsTaxed: any;
	cekIsPayroll: any;
	isKomponen: any;
	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard) {

		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
	}

	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		this.formAktif = true;
		this.listDataJenisProduk = [];

		//untuk form grandchild
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.tglDaftar = new Date();
		this.tglDaftar.setHours(0, 0, 0, 0);
		let tglDaftar = this.setTimeStamp(this.tglDaftar);
		this.form = this.fb.group({
			'kode': new FormControl(''),
			'namaProduk': new FormControl('', Validators.required),
			'qtyTerkecil': new FormControl(0),
			'qtyJualTerkecil': new FormControl(0),
			'kdDetailJenisProduk': new FormControl(null, Validators.required),
			'nilaiNormal': new FormControl(1, Validators.required),
			'tglDaftar': new FormControl(new Date(), Validators.required),
			'deskripsiProduk': new FormControl(''),
			'kdSatuanStandar': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'noUrut': new FormControl('', Validators.required),
			'kdJenisKomponen': new FormControl('', Validators.required),
			'factorRate': new FormControl(1),
			'operatorFactorRate': new FormControl('X'),
			'statusEnabled': new FormControl(true, Validators.required),

		});
		this.formKomponen = this.fb.group({
			'kode': new FormControl(''),
			'namaKomponen': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'noUrut': new FormControl('', Validators.required),
			'kdJenisKomponen': new FormControl('', Validators.required),
			'nilaiMin': new FormControl(''),
			'nilaiNormal': new FormControl(''),
			'nilaiMax': new FormControl(''),
			'kdProduk': new FormControl(null),
			'kdKelompokEvaluasi': new FormControl(''),
			'kdSatuanHasil': new FormControl(''),
			'kdTypeDataObjek': new FormControl(''),
			'factorRate': new FormControl(1),
			'operatorFactorRate': new FormControl('X'),
			'isTaxed': new FormControl(false),
			'isPayroll': new FormControl(false),
			'kodeExternal': new FormControl(''),
			'namaExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
		});
		this.get();

		//untuk form parent
		if (this.pageJenisProduk == undefined || this.rowsJenisProduk == undefined) {
			this.pageJenisProduk = Configuration.get().page;
			this.rowsJenisProduk = Configuration.get().rows;
		}
		this.formJenisProduk = this.fb.group({
			'kode': new FormControl(''),
			'namaJenisProduk': new FormControl('', Validators.required),
			'kdJenisProdukHead': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
		});

		//untuk form child
		if (this.pageDetailJenisProduk == undefined || this.rowsDetailJenisProduk == undefined) {
			this.pageDetailJenisProduk = Configuration.get().page;
			this.rowsDetailJenisProduk = Configuration.get().rows;
		}
		this.formDetailJenisProduk = this.fb.group({
			'kode': new FormControl(''),
			'namaDetailJenisProduk': new FormControl('', Validators.required),
			'kdJenisProduk': new FormControl(null),
			'persenHargaCito': new FormControl(0),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
		});

		//untuk tab parent ke child
		let dataIndex = {
			"index": this.index
		}

		//untuk tab child ke grandchild
		let dataIndexDetail = {
			"index": this.indexDetail
		}

		//manggil tab panel parent
		if (this.index == 0) {
			this.httpService.get(Configuration.get().dataMasterNew + '/jenisproduk/findAll?page=1&rows=300&dir=namaJenisProduk&sort=desc').subscribe(table => {
				this.listTab = table.JenisProduk;
				let i = this.listTab.length
				while (i--) {
					if (this.listTab[i].statusEnabled == false) {
						this.listTab.splice(i, 1);
					}
				}
			});
		}
		else if (this.indexDetail == 0) {
			this.onTabChange(dataIndex);
		}
		else {
			this.onTabDetailChange(dataIndexDetail);
		}

		//manggil grid ketiganya
		this.getJenis(this.pageJenisProduk, this.rowsJenisProduk, '');
		//harusnya ada parameter search sama head
		this.getDetailJenis(this.pageDetailJenisProduk, this.rowsDetailJenisProduk, '', '');
		this.getProduk(this.page, this.rows, '', '');

	}

	onTabChange(event) {
		//lagi masuk ke form DetailJenisProduk

		//com ink
		// this.formJenisProduk = this.fb.group({
		// 	'kode': new FormControl(''),
		// 	'namaJenisProduk': new FormControl('', Validators.required),
		// 	'kdJenisProdukHead': new FormControl(null),
		// 	'reportDisplay': new FormControl('', Validators.required),
		// 	'namaExternal': new FormControl(''),
		// 	'kodeExternal': new FormControl(''),
		// 	'statusEnabled': new FormControl(true, Validators.required),
		// });

		this.formDetailJenisProduk = this.fb.group({
			'kode': new FormControl(''),
			'namaDetailJenisProduk': new FormControl('', Validators.required),
			'kdJenisProduk': new FormControl(null),
			'persenHargaCito': new FormControl(0),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
		});

		this.formAktif = true;
		let data;
		this.index = event.index;
		if (event.index > 0) {
			let index = event.index - 1;
			data = this.listTab[index].kode.kode;
			this.formDetailJenisProduk.get('kdJenisProduk').setValue(data);
			this.form.get('kdDetailJenisProduk').setValue(null);
			this.pencarianDetailJenis = '';
			this.getDetailJenis(this.pageDetailJenisProduk, 300, this.pencarianDetailJenis, data);
		}
		else {
			this.pencarianJenis = '';
			this.formDetailJenisProduk.get('kdJenisProduk').setValue(null);
			this.form.get('kdDetailJenisProduk').setValue(null);
			this.getJenis(this.pageJenisProduk, 300, this.pencarianJenis)
		}
		this.valuechangeJenisProduk('');
		this.valuechangeDetailJenisProduk('');
	}

	onTabDetailChange(event) {
		//lagi masuk ke form Produk
		this.isKomponen = false;
		this.get();

		this.form = this.fb.group({
			'kode': new FormControl(''),
			'namaProduk': new FormControl('', Validators.required),
			'qtyTerkecil': new FormControl(0),
			'qtyJualTerkecil': new FormControl(0),
			'kdDetailJenisProduk': new FormControl(null, Validators.required),
			'nilaiNormal': new FormControl(1, Validators.required),
			'tglDaftar': new FormControl(new Date(), Validators.required),
			'deskripsiProduk': new FormControl(''),
			'kdSatuanStandar': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'noUrut': new FormControl('', Validators.required),
			'kdJenisKomponen': new FormControl('', Validators.required),
			'factorRate': new FormControl(1),
			'operatorFactorRate': new FormControl('X'),
			'statusEnabled': new FormControl(true, Validators.required),

		});
		//com ink
		// this.formDetailJenisProduk = this.fb.group({
		// 	'kode': new FormControl(''),
		// 	'namaDetailJenisProduk': new FormControl('', Validators.required),
		// 	'kdJenisProduk': new FormControl(null),
		// 	'persenHargaCito': new FormControl(0),
		// 	'reportDisplay': new FormControl('', Validators.required),
		// 	'namaExternal': new FormControl(''),
		// 	'kodeExternal': new FormControl(''),
		// 	'statusEnabled': new FormControl(true, Validators.required),
		// });

		let data;
		this.formAktif = true;
		this.indexDetail = event.index;
		if (event.index > 0) {
			let index = event.index - 1;
			data = this.listTabDetail[index].kode.kode;
			this.form.get('kdDetailJenisProduk').setValue(data);
			this.pencarian = '';
			this.getProduk(this.page, 300, this.pencarian, data);
		}
		else {
			this.pencarianDetailJenis = '';
			this.form.get('kdDetailJenisProduk').setValue(null);
			let index = this.index - 1;
			data = this.listTab[index].kode.kode;
			this.formDetailJenisProduk.get('kdJenisProduk').setValue(data);
			this.getDetailJenis(this.page, 300, this.pencarianDetailJenis, data);
		}

		this.valuechange('');
		this.valuechangeDetailJenisProduk('');
	}

	//get dd
	get() {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanStandar&select=namaSatuanStandar,id').subscribe(res => {
			this.kdSatuanStandar = [];
			this.kdSatuanStandar.push({ label: '--Pilih Satuan Standar--', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kdSatuanStandar.push({ label: res.data.data[i].namaSatuanStandar, value: res.data.data[i].id.kode })
			};
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisKomponen&select=namaJenisKomponen,id').subscribe(res => {
			this.listKomponen = [];
			this.listKomponen.push({ label: '--Pilih Jenis Komponen--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.listKomponen.push({ label: res.data.data[i].namaJenisKomponen, value: res.data.data[i].id.kode })
			};
		});
	}

	//////////////////////////get grid////////////////////////////////////
	getJenis(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisproduk/findAll?page=' + page + '&rows=' + 300 + '&dir=namaJenisProduk&sort=desc&namaJenisProduk=' + search).subscribe(table => {
			this.listDataJenisProduk = table.JenisProduk;
			this.totalRecordsJenisProduk = table.totalRow;

		});
	}

	//get grid child sekaligus panel child ke grandchild
	getDetailJenis(page: number, rows: number, search: any, head: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/detailProduk/findAll?page=' + page + '&rows=' + 300 + '&dirnamaDetailJenisProduk&sort=desc&namaDetailJenisProduk=' + search + '&kdJenisProduk=' + head).subscribe(table => {
			this.listDataDetailJenisProduk = table.DetailJenisProduk;
			this.totalRecordsDetailJenisProduk = table.totalRow;

			this.listTabDetail = table.DetailJenisProduk;
			let i = this.listTabDetail.length
			while (i--) {
				if (this.listTabDetail[i].statusEnabled == false) {
					this.listTabDetail.splice(i, 1);
				}
			}
		});
	}

	getProduk(page: number, rows: number, search: any, head: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/produk/findAll?page=' + page + '&rows=' + 300 + '&dir=namaProduk&sort=desc&namaProduk=' + search + '&kdDetailJenisProduk=' + head).subscribe(table => {
			this.listData = table.Produk;
			this.totalRecords = table.totalRow;
		});
	}


	/////////////////////////////////////////////////////////////////////

	/////////////////////submit - simpan - reset/////////////////////////

	//grandchild
	onSubmit() {
		// if (this.form.invalid) {
		// 	this.validateAllFormFields(this.form);

		// 	this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		// } else {
		this.simpan();
		// }
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			// let tglDaftar = this.setTimeStamp(this.form.get('tglDaftar').value);
			let simpanData = {
				"deskripsiProduk": this.form.get('deskripsiProduk').value,
				"factorRate": this.form.get('factorRate').value,
				"isPayroll": this.cekIsPayroll,
				// "isProdukIntern": 0,
				"isSaveWithKomponen": this.isKomponen,
				"isTaxed": this.cekIsTaxed,
				// "kdAccount": 0,
				// "kdBahanProduk": 0,
				// "kdBarcode": "string",
				// "kdBentukProduk": 0,
				// "kdDepartemen": "string",
				// "kdDetailGolonganProduk": 0,
				"kdDetailJenisProduk": this.form.get('kdDetailJenisProduk').value,
				// "kdFungsiProduk": 0,
				// "kdGProduk": "string",
				// "kdGolonganProduk": 0,
				"kdJenisKomponen": this.form.get('kdJenisKomponen').value,
				// "kdJenisPeriksa": 0,
				// "kdKategoryProduk": 0,
				// "kdLevelTingkat": 0,
				// "kdProdukIntern": "string",
				// "kdProdusenProduk": 0,
				// "kdSatuanKecil": 0,
				"kdSatuanStandar": this.form.get('kdSatuanStandar').value,
				// "kdSifatProduk": 0,
				// "kdStatusProduk": 0,
				// "kdTypeProduk": 0,
				// "kdUnitLaporan": 0,
				// "kdWarnaProduk": 0,
				// "kekuatan": "string",
				"kode": this.form.get('kode').value,
				"kodeExternal": this.form.get('kodeExternal').value,
				"namaExternal": this.form.get('namaExternal').value,
				"namaProduk": this.form.get('namaProduk').value,
				"nilaiNormal": this.form.get('nilaiNormal').value,
				// "noRec": "string",
				"noUrut": this.form.get('noUrut').value,
				"qtyJualTerkecil": this.form.get('qtyJualTerkecil').value,
				// "qtySKS": 0,
				"qtyTerkecil": this.form.get('qtyTerkecil').value,
				"reportDisplay": this.form.get('reportDisplay').value,
				// "retensiMaxHari": 0,
				"statusEnabled": this.form.get('statusEnabled').value,
				"tglDaftar": this.setTimeStamp(this.form.get('tglDaftar').value),
				// "tglProduksi": 0,
				// "version": 0
			};
			simpanData
			// let formSubmit = this.form.value;
			// formSubmit.tglDaftar = tglDaftar;
			this.httpService.post(Configuration.get().dataMasterNew + '/produk/saveProdukWithKomponen?', simpanData).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.reset();
			});
		}
	}

	reset() {
		this.formAktif = true;
		//kalau mau balik lg ke parent
		// this.ngOnInit();
		//kalau mau balik lg di form grandchild
		this.ngOnInitProduk();
	}

	ngOnInitProduk() {
		this.get();

		this.form = this.fb.group({
			'kode': new FormControl(''),
			'namaProduk': new FormControl('', Validators.required),
			'qtyTerkecil': new FormControl(0),
			'qtyJualTerkecil': new FormControl(0),
			'kdDetailJenisProduk': new FormControl(null, Validators.required),
			'nilaiNormal': new FormControl(1, Validators.required),
			'tglDaftar': new FormControl(new Date(), Validators.required),
			'deskripsiProduk': new FormControl(''),
			'kdSatuanStandar': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
		});

		//com ink
		// this.formDetailJenisProduk = this.fb.group({
		// 	'kode': new FormControl(''),
		// 	'namaDetailJenisProduk': new FormControl('', Validators.required),
		// 	'kdJenisProduk': new FormControl(null),
		// 	'persenHargaCito': new FormControl(0),
		// 	'reportDisplay': new FormControl('', Validators.required),
		// 	'namaExternal': new FormControl(''),
		// 	'kodeExternal': new FormControl(''),
		// 	'statusEnabled': new FormControl(true, Validators.required),
		// });

		let data;
		// this.formAktif = true;
		// this.indexDetail = event.index;
		// if (event.index > 0){
		let index = this.indexDetail - 1;
		data = this.listTabDetail[index].kode.kode;
		this.form.get('kdDetailJenisProduk').setValue(data);
		this.pencarian = '';
		this.getProduk(this.page, 300, this.pencarian, data);
		// }
		// else {
		// this.pencarianDetailJenis = '';
		// this.form.get('kdDetailJenisProduk').setValue(null);
		// let index = this.index-1;
		// data = this.listTab[index].kode.kode;
		// this.formDetailJenisProduk.get('kdJenisProduk').setValue(data);
		// this.getDetailJenis(this.page,300,this.pencarianDetailJenis, data);
		// }

		this.valuechange('');
		this.valuechangeDetailJenisProduk('');
	}

	update() {
		let tglDaftar = this.setTimeStamp(this.form.get('tglDaftar').value)

		let formSubmit = this.form.value;
		formSubmit.tglDaftar = tglDaftar;
		this.httpService.update(Configuration.get().dataMasterNew + '/produk/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			//this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
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

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		// this.form.setValue(cloned);
	}
	clone(cloned: Produk): Produk {
		let hub = new InisialProduk();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialProduk();
		if (hub.tglDaftar == null || hub.tglDaftar == 0) {
			fixHub = {
				'kode': hub.kode.kode,
				'namaProduk': hub.namaProduk,
				'deskripsiProduk': hub.deskripsiProduk,
				'qtyTerkecil': hub.qtyTerkecil,
				'qtyJualTerkecil': hub.qtyJualTerkecil,
				'kdDetailJenisProduk': hub.kdDetailJenisProduk,
				'nilaiNormal': hub.nilaiNormal,
				'kdSatuanStandar': hub.kdSatuanStandar,
				'tglDaftar': null,
				'reportDisplay': hub.reportDisplay,
				'namaExternal': hub.namaExternal,
				'kodeExternal': hub.kodeExternal,
				'statusEnabled': hub.statusEnabled
			}
			this.versi = hub.version;
			return fixHub;
		} else {
			fixHub = {
				'kode': hub.kode.kode,
				'namaProduk': hub.namaProduk,
				'deskripsiProduk': hub.deskripsiProduk,
				'qtyTerkecil': hub.qtyTerkecil,
				'qtyJualTerkecil': hub.qtyJualTerkecil,
				'kdDetailJenisProduk': hub.kdDetailJenisProduk,
				'nilaiNormal': hub.nilaiNormal,
				'kdSatuanStandar': hub.kdSatuanStandar,
				'tglDaftar': new Date(hub.tglDaftar * 1000),
				'reportDisplay': hub.reportDisplay,
				'namaExternal': hub.namaExternal,
				'kodeExternal': hub.kodeExternal,
				'statusEnabled': hub.statusEnabled
			}
			this.versi = hub.version;
			return fixHub;
		}
	}
	hapus() {
		let kode = this.form.get('kode').value;
		this.httpService.delete(Configuration.get().dataMasterNew + '/produk/del/' + kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});
	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}

	//parent
	onSubmitJenisProduk() {
		if (this.formJenisProduk.invalid) {
			this.validateAllFormFieldsJenisProduk(this.formJenisProduk);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanJenisProduk();
		}
	}

	simpanJenisProduk() {
		if (this.formAktif == false) {
			this.confirmUpdateJenisProduk()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/jenisproduk/save?', this.formJenisProduk.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.resetJenisProduk();
			});
		}

	}

	resetJenisProduk() {
		this.formAktif = true;
		this.ngOnInit();
	}

	updateJenisProduk() {
		this.httpService.update(Configuration.get().dataMasterNew + '/jenisproduk/update/' + this.versiJenisProduk, this.formJenisProduk.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.resetJenisProduk();
		});
	}

	confirmUpdateJenisProduk() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updateJenisProduk();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}

	onRowSelectJenisProduk(event) {
		let cloned = this.cloneJenisProduk(event.data);
		this.formAktif = false;
		this.formJenisProduk.setValue(cloned);
		console.log(this.formJenisProduk.value);
	}
	cloneJenisProduk(cloned: JenisProduk): JenisProduk {
		let hub = new InisialJenisProduk();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialJenisProduk();
		fixHub = {
			'kode': hub.kode.kode,
			'namaJenisProduk': hub.namaJenisProduk,
			'kdJenisProdukHead': hub.kdJenisProdukHead,
			'reportDisplay': hub.reportDisplay,
			'namaExternal': hub.namaExternal,
			'kodeExternal': hub.kodeExternal,
			'statusEnabled': hub.statusEnabled
		}
		this.versiJenisProduk = hub.version;
		return fixHub;
	}
	hapusJenisProduk() {
		let kode = this.formJenisProduk.get('kode').value;
		this.httpService.delete(Configuration.get().dataMasterNew + '/jenisproduk/del/' + kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.resetJenisProduk();
		});

	}

	findSelectedIndexJenisProduk(): number {
		return this.listDataJenisProduk.indexOf(this.selectedJenisProduk);
	}
	onDestroyJenisProduk() {

	}

	confirmDeleteJenisProduk() {
		let kode = this.formJenisProduk.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Produk');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusJenisProduk();
				},
				reject: () => {
					this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
				}
			});
		}
	}
	validateAllFormFieldsJenisProduk(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFieldsJenisProduk(control);
			}
		});
	}

	//child
	onSubmitDetailJenisProduk() {
		if (this.formDetailJenisProduk.invalid) {
			this.validateAllFormFieldsDetailJenisProduk(this.formDetailJenisProduk);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpanDetailJenisProduk();
		}
	}

	simpanDetailJenisProduk() {
		if (this.formAktif == false) {
			this.confirmUpdateDetailJenisProduk()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/detailProduk/save?', this.formDetailJenisProduk.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.resetDetailJenisProduk();
			});
		}

	}

	resetDetailJenisProduk() {
		this.formAktif = true;
		this.ngOnInitDetailJenisProduk();
	}

	ngOnInitDetailJenisProduk() {

		this.formDetailJenisProduk = this.fb.group({
			'kode': new FormControl(''),
			'namaDetailJenisProduk': new FormControl('', Validators.required),
			'kdJenisProduk': new FormControl(null),
			'persenHargaCito': new FormControl(0),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
		});

		// this.formAktif = true;
		let data;
		// this.index = event.index;
		// if (event.index >0){
		let index = this.index - 1;
		data = this.listTab[index].kode.kode;
		this.formDetailJenisProduk.get('kdJenisProduk').setValue(data);
		this.form.get('kdDetailJenisProduk').setValue(null);
		this.pencarianDetailJenis = '';
		this.getDetailJenis(this.pageDetailJenisProduk, 300, this.pencarianDetailJenis, data);
		// }
		// else {
		// this.pencarianJenis ='';
		// this.formDetailJenisProduk.get('kdJenisProduk').setValue(null);
		// this.form.get('kdDetailJenisProduk').setValue(null);
		// this.getJenis(this.pageJenisProduk,300,this.pencarianJenis)
		// }
		this.valuechangeJenisProduk('');
		this.valuechangeDetailJenisProduk('');

	}

	updateDetailJenisProduk() {
		this.httpService.update(Configuration.get().dataMasterNew + '/detailProduk/update/' + this.versiDetailJenisProduk, this.formDetailJenisProduk.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.resetDetailJenisProduk();
		});
	}

	confirmUpdateDetailJenisProduk() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.updateDetailJenisProduk();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}

	onRowSelectDetailJenisProduk(event) {
		let cloned = this.cloneDetailJenisProduk(event.data);
		this.formAktif = false;
		this.formDetailJenisProduk.setValue(cloned);
	}

	cloneDetailJenisProduk(cloned: DetailJenisProduk): DetailJenisProduk {
		let hub = new InisialDetailJenisProduk();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialDetailJenisProduk();
		fixHub = {
			'kode': hub.kode.kode,
			'namaDetailJenisProduk': hub.namaDetailJenisProduk,
			'kdJenisProduk': hub.kdJenisProduk,
			'persenHargaCito': hub.persenHargaCito,
			'reportDisplay': hub.reportDisplay,
			'namaExternal': hub.namaExternal,
			'kodeExternal': hub.kodeExternal,
			'statusEnabled': hub.statusEnabled
		}
		this.versiDetailJenisProduk = hub.version;
		return fixHub;
	}
	hapusDetailJenisProduk() {
		let kode = this.formDetailJenisProduk.get('kode').value;
		this.httpService.delete(Configuration.get().dataMasterNew + '/detailProduk/del/' + kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.resetDetailJenisProduk();

		});

	}

	findSelectedIndexDetailJenisProduk(): number {
		return this.listDataDetailJenisProduk.indexOf(this.selectedDetailJenisProduk);
	}
	onDestroyDetailJenisProduk() {

	}

	confirmDeleteDetailJenisProduk() {
		let kode = this.formDetailJenisProduk.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Detail Jenis Produk');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapusDetailJenisProduk();
				},
				reject: () => {
					this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
				}
			});
		}
	}

	validateAllFormFieldsDetailJenisProduk(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFieldsDetailJenisProduk(control);
			}
		});
	}






	////////////////////////////////////////////////////////////////////

	cari() {
		let data = this.form.get('kdDetailJenisProduk').value;
		this.getProduk(this.page, this.rows, this.pencarian, data);
	}
	loadPage(event: LazyLoadEvent) {
		let data = this.form.get('kdDetailJenisProduk').value;
		this.getProduk((event.rows + event.first) / event.rows, event.rows, this.pencarianDetailJenis, data);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	cariDetailJenis() {
		let data = this.formDetailJenisProduk.get('kdJenisProduk').value;
		this.getDetailJenis(this.page, this.rows, this.pencarianDetailJenis, data);
	}
	cariJenis() {
		this.getJenis(this.page, this.rows, this.pencarianJenis);
	}

	loadPageDetailJenis(event: LazyLoadEvent) {
		let data = this.formDetailJenisProduk.get('kdJenisProduk').value;
		this.getDetailJenis((event.rows + event.first) / event.rows, event.rows, this.pencarianDetailJenis, data);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	loadPageJenis(event: LazyLoadEvent) {
		this.getJenis((event.rows + event.first) / event.rows, event.rows, this.pencarianJenis);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Produk');
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

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}
	valuechangeDetail(newValue) {
		this.toReportDetail = newValue;
		this.reportDetail = newValue;
	}
	valuechangeJenisProduk(newValue) {
		this.report = newValue;
	}
	valuechangeDetailJenisProduk(newValue) {
		this.toReportDetailJenisProduk = newValue;
		this.reportDetailJenisProduk = newValue;
	}
	changeConvert(event) {
		if (event == true) {
			this.cekIsHavingStok = 1
			this.cekIsHavingPrice = 1
		} else {
			this.cekIsHavingStok = 0
			this.cekIsHavingPrice = 0
		}

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

	downloadPdf() {
		let b = Configuration.get().report + '/jenisProduk/laporanJenisProduk.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=true';

		window.open(b);
	}

	cetakJenisProduk() {
		// this.laporan = true;
		let b = Configuration.get().report + '/jenisProduk/laporanJenisProduk.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=false';

		window.open(b);
	}

	komponen(k) {
		console.log(k)
	}


	changeConvertTaxed(event) {
		if (event == true) {
			this.cekIsTaxed = 1

		} else {
			this.cekIsTaxed = 0

		}

	}
	changeConvertPayroll(event) {
		if (event == true) {
			this.cekIsPayroll = 1

		} else {
			this.cekIsPayroll = 0

		}

	}

}




class InisialProduk implements Produk {

	constructor(
		public namaProduk?,
		public deskripsiProduk?,
		public qtyTerkecil?,
		public qtyJualTerkecil?,
		public kdDetailJenisProduk?,
		public nilaiNormal?,
		public kdSatuanStandar?,
		public kekuatan?,
		public kdSatuanKecil?,
		public kdGolonganProduk?,
		public kdDetailGolonganProduk?,
		public kdKategoryProduk?,
		public kdStatusProduk?,
		public kdBentukProduk?,
		public kdGProduk?,
		public kdProdusenProduk?,
		public kdTypeProduk?,
		public kdBahanProduk?,
		public kdWarnaProduk?,
		public tglProduksi?,
		public kdUnitLaporan?,
		public kdJenisPeriksa?,
		public kdFungsiProduk?,
		public kdLevelTingkat?,
		public kdAccount?,
		public kdBarcode?,
		public isProdukIntern?,
		public qtySKS?,
		public tglDaftar?,
		public kode?,
		public id?,
		public kdProfile?,
		public version?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
	) { }

}

class InisialKelompokProduk implements KelompokProduk {

	constructor(
		public namaKelompokProduk?,
		public kdJenisTransaksi?,
		public isHavingStok?,
		public isHavingPrice?,
		public kode?,
		public id?,
		public kdProfile?,
		public version?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
	) { }

}


class InisialJenisProduk implements JenisProduk {

	constructor(
		public namaJenisProduk?,
		public kdKelompokProduk?,
		public kdAccount?,
		public kdJenisProdukHead?,
		public kode?,
		public id?,
		public kdProfile?,
		public version?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
	) { }

}

class InisialDetailJenisProduk implements DetailJenisProduk {

	constructor(
		public kdJenisProduk?,
		public persenHargaCito?,
		public kdAccount?,
		public namaDetailJenisProduk?,
		public isRegistrasiAset?,
		public kode?,
		public id?,
		public kdProfile?,
		public version?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
	) { }

}