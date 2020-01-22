import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration ,AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { isNumber } from 'util';
import { Router} from "@angular/router";
import { PegawaiSkFasilitasNew } from './pegawai-sk-fasilitas-new.interface';


@Component({
	selector: 'app-pegawai-sk-fasilitas-new',
	templateUrl: './pegawai-sk-fasilitas-new.component.html',
	styleUrls: ['./pegawai-sk-fasilitas-new.component.scss'],
	providers: [ConfirmationService]
})
export class PegawaiSkFasilitasNewComponent implements OnInit {

	selected: any;
	listData: any[];
	listFasilitas: any[];
	versi: any;
	form :FormGroup;
	formAktif: boolean
	items: any[];
	pencarian: string;
	report: any;
	namaSK: any[];
	kategoriPegawai: any[];
	masaKerja: any[];
	jabatan: any[]; 
	namaProduk: any[];    
	kondisiProduk: any[];    
	checked: boolean = true;
	kondisi: any;
	page: number;
	rows: number;
	totalRecords: any;
	dataSK: any[];
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	smbrFile:any;

	pageRegistAset: number
	rowsRegistAset: number
	totalRecordsRegistAset: number
	itemsRegistAset: any[]
	formAktifRegistAset: boolean
	formRegistAset: FormGroup
	smbrFileRegistAset: any
	laporanRegistAset: boolean
	listDataRegistAset: any[]
	kelompokAset: any[]
	namaBarang: any[]
	asalBarang: any[]
	listStatusAset: any[]
	kondisiBarangSaatIni: any[]
	pencarianRegistAset: string = ''
	versiRegistAset: any
	keynoreg: any
	selectedRegistAset: any[]
	dialogRegistrasiAset: boolean
	golonganPegawai: any[]
	
	constructor(private alertService: AlertService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private route: Router, private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
		this.pageRegistAset = Configuration.get().page;
		this.rowsRegistAset = 5;
	}

	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;

		this.listFasilitas = [];      
		this.formAktif = true;
		this.get(this.page, this.rows);
		this.form = this.fb.group({
			'namaSK': new FormControl('', Validators.required),
			'noSK': new FormControl({value:'', disabled: true}),
			'tglBerlakuSkDari': new FormControl({value:'', disabled: true}),
			'tglBerlakuSkSampai': new FormControl({value:'', disabled: true}),
			'kategoriPegawai': new FormControl(null, Validators.required),
			'masaKerja': new FormControl(null),
			'jabatan': new FormControl(null),
			'golonganPegawai': new FormControl(null, Validators.required)
		});

		this.form.get('kategoriPegawai').enable();
		this.form.get('masaKerja').enable();
		this.form.get('jabatan').enable(); 
		this.items = [
		{label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
			this.downloadPdf();
		}},
		{label: 'Exel', icon: 'fa-file-excel-o', command: () => { 
			this.downloadExel();
		}}];

		this.getSmbrFile();


		let ruanganlog = this.authGuard.getUserDto().ruangan.kdRuangan;
		this.pageRegistAset = Configuration.get().page;
		this.rowsRegistAset = 5;
		let today = new Date();
		this.itemsRegistAset = [
		{
			label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
				this.downloadPdfRegistAset();
			}
		},
		{
			label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
				this.downloadExcelRegistAset();
			}
		},

		];

		this.formAktifRegistAset = true;
		this.getRegistAset(this.pageRegistAset, this.rowsRegistAset, '');

		this.formRegistAset = this.fb.group({
			// 'alamatLengkap': new FormControl(''),
			// 'kdJenisAlamat': new FormControl(null),
			// 'kdNegara': new FormControl(null),
			// 'kdPropinsi': new FormControl(null),
			// 'kdKecamatan': new FormControl(null),
			// 'kodePos': new FormControl(''),
			// 'kdKotaKabupaten': new FormControl(null),
			// 'kdDesaKelurahan' : new FormControl(null),
			// 'rtrw': new FormControl(''),

			// 'fungsiKegunaan': new FormControl(''),
			// 'hargaNetto': new FormControl(0),
			// 'hargaPenyusutan': new FormControl(''),
			// 'hargaPertambahan': new FormControl(''),
			// 'hargaSatuanRevaluasi': new FormControl(''),
			// 'kapasitas': new FormControl(''),
			// 'kdAlamat': new FormControl(null),
			'kdAsalProduk': new FormControl(null),
			// 'kdBahanProduk': new FormControl(null),
			// 'kdJenisKonstruksi': new FormControl(null),
			// 'kdKategoryAset': new FormControl(null),
			'kdKelompokAset': new FormControl(null),
			// 'kdKondisiProdukAwal': new FormControl(null),
			'kdKondisiProdukCurrent': new FormControl(null),
			// 'kdPegawaiPemilik': new FormControl(null),
			// 'kdPegawaiPengguna': new FormControl(null),
			'kdProduk': new FormControl(null, Validators.required),
			// 'kdProdusenProduk': new FormControl(null),
			// 'kdProfilePemilik': new FormControl(null),
			// 'kdRekananPemilik': new FormControl(null),
			'kdRuangan': new FormControl(ruanganlog),
			// 'kdRuanganPosisiCurrent': new FormControl(null),
			// 'kdSatuanStandarKapasitas': new FormControl(null),
			'kdStatusAset': new FormControl(null),
			// 'kdTransmisi': new FormControl(null),
			'kdTypeProduk': new FormControl(null),
			// 'kdWarnaProduk': new FormControl(null),
			'keteranganLainnya': new FormControl(''),
			// 'lbLebar': new FormControl(''),
			// 'lbPanjang': new FormControl(''),
			// 'lbTinggi': new FormControl(''),
			// 'ltLebar': new FormControl(''),
			// 'ltPanjang': new FormControl(''),
			// 'luasBangunan': new FormControl(''),
			// 'luasTanah': new FormControl(''),
			// 'masaBerlakuGaransi': new FormControl(''),
			// 'namaLengkapPegawaiPemilik': new FormControl(''),
			// 'namaLengkapPegawaiPengguna': new FormControl(''),
			// 'namaLengkapProfilePemilik': new FormControl(''),
			// 'namaModel': new FormControl(''),
			// 'namaRekananPemilik': new FormControl(''),
			// 'namaRuasJalan': new FormControl(''),
			// 'noClosingLast': new FormControl(''),
			// 'noMesin': new FormControl(''),
			// 'noModel': new FormControl(''),
			// 'noRangka': new FormControl(''),
			'noRegistrasiAset': new FormControl(null),
			// 'noRegisterAsetHead': new FormControl(null),
			'noRegisterAsetInt': new FormControl(''),
			// 'noSerial': new FormControl(''),
			// 'noStrukText': new FormControl(''),
			// 'qtyLantai': new FormControl(''),
			// 'qtyProdukAset': new FormControl(1, Validators.required),
			// 'spesifikasiDetail': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
			'tahunProduksiBangun': new FormControl(null),
			'tglRegisterAset': new FormControl(today, Validators.required),
			// 'tglStrukText': new FormControl(''),
			// 'totalSisaUmurEkonomisTahun': new FormControl(0, Validators.required),
			// 'totalSudahBertambah': new FormControl(''),
			// 'totalSudahMenyusut': new FormControl(''),
			// 'umurEkonomisRevaluasiTahun': new FormControl(''),
			// 'umurTeknisRevaluasiTahun': new FormControl(''),
		});

		this.dialogRegistrasiAset = false

		this.getDataGridRegistAset(this.page,10);
		this.getSmbrFileRegistAset();
	}

	getSmbrFileRegistAset(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFileRegistAset = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	downloadExcelRegistAset() {
		// let cetak = Configuration.get().report + '/hargaNettoProdukByKelas/laporanHargaNettoProdukByKelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
		// window.open(cetak);
    	// this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAll?page='+this.page+'&rows='+this.rows).subscribe(table => {

   		 //   this.fileService.exportAsExcelFile(table.data.data, 'Alamat');
   	 // });

   	}

   	downloadPdfRegistAset() {
   		let cetak = Configuration.get().report + '/registrasiAset/laporanRegistrasiAset.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFileRegistAset +'&download=true';
   		window.open(cetak);
   	}

   	cetakRegistAset(){
   		this.laporan = true;
   		this.print.showEmbedPDFReport(Configuration.get().report + '/registrasiAset/laporanRegistrasiAset.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFileRegistAset +'&download=false', 'frmRegistrasiAset_laporanCetak');

   	}

   	tutupLaporanRegistAset() {
   		this.laporanRegistAset = false;
   	}

   	getDataGridRegistAset(page: number, rows: number) {
   		this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAllV2?page=' + page + '&rows=' + rows + '&dir=produk.namaProduk&sort=asc').subscribe(table => {
   			this.listDataRegistAset = table.data.result;
   			this.totalRecordsRegistAset = table.data.totalRow;
   		});
   	}

   	loadPageRegistAset(event: LazyLoadEvent) {
   		this.getDataGridRegistAset((event.rows+event.first)/event.rows,event.rows);
   	}


   	getRegistAset(page: number, rows: number, search: any) {

    // kelompok aset
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KelompokAset&select=namaKelompokAset,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    	this.kelompokAset = [];
    	this.kelompokAset.push({ label: '--Pilih Kelompok Aset--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.kelompokAset.push({ label: res.data.data[i].namaKelompokAset, value: res.data.data[i].id_kode })
    	};
    });


    // nama barang
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findProduk').subscribe(res => {
    	this.namaBarang = [];
    	this.namaBarang.push({ label: '--Pilih Jenis Aset--', value:null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.namaBarang.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].kode })
    	};
    });

    // asal barang
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAsal').subscribe(res => {
    	this.asalBarang = [];
    	this.asalBarang.push({ label: '--Pilih Asal Barang--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.asalBarang.push({ label: res.data.data[i].namaAsal, value: res.data.data[i].kdAsal })
    	};
    });

    //list status aset
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findStatusAset').subscribe(res => {
    	this.listStatusAset = [];
    	this.listStatusAset.push({ label: '--Pilih Status Kepemilikan--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listStatusAset.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].kode })
    	};
    });

    // kondisi produk saat ini
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KondisiProduk&select=namaKondisiProduk,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    	this.kondisiBarangSaatIni = [];
    	this.kondisiBarangSaatIni.push({ label: '--Pilih Kondisi Barang Saat Ini--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.kondisiBarangSaatIni.push({ label: res.data.data[i].namaKondisiProduk, value: res.data.data[i].id_kode })
    	};
    });
}

cariRegistAset() {
	this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAllV2?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&namaProduk=' + this.pencarianRegistAset).subscribe(table => {
		this.listDataRegistAset = table.data.result;
	});
}

confirmDeleteRegistAset() {
	let noRegistrasiAset = this.formRegistAset.get('noRegistrasiAset').value;
	if (noRegistrasiAset == null || noRegistrasiAset == undefined || noRegistrasiAset == "") {
		this.alertService.warn('Peringatan', 'Pilih Daftar Registrasi Aset');
	} else {

		this.confirmationService.confirm({
			message: 'Apakah Data Akan Dihapus?',
			header: 'Konfirmasi Hapus',
			icon: 'fa fa-trash',
			accept: () => {
				this.hapusRegistAset();
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
			}
		});
	}
}

onSubmitRegistAset() {
	if (this.formRegistAset.invalid) {
		this.validateAllFormFields(this.formRegistAset);
		this.alertService.warn("Peringatan", "Data Tidak Sesuai");
	} else {
		this.simpan3();
	}
}

confirmUpdateRegistAset() {
	this.confirmationService.confirm({
		message: 'Apakah Data Akan diperbaharui?',
		header: 'Konfirmasi Pembaharuan',
		accept: () => {
			this.updateRegistAset();
		},
		reject: () => {
			this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
		}
	});
}

updateRegistAset(){

	let tglRegisterAsetTS = this.setTimeStamp(this.formRegistAset.get('tglRegisterAset').value);
	let data = {
		"kdAsalProduk": this.formRegistAset.get('kdAsalProduk').value,
		"kdKelompokAset": this.formRegistAset.get('kdKelompokAset').value,
		"kdKondisiProdukCurrent": this.formRegistAset.get('kdKondisiProdukCurrent').value,
		"kdProduk": this.formRegistAset.get('kdProduk').value,
		"kdRuangan": this.formRegistAset.get('kdRuangan').value,
		"kdStatusAset": this.formRegistAset.get('kdStatusAset').value,
		"keteranganLainnya": this.formRegistAset.get('keteranganLainnya').value,
		"noRegisterAsetInt": this.formRegistAset.get('noRegisterAsetInt').value,
		"noRegistrasiAset": this.formRegistAset.get('noRegistrasiAset').value,
		"statusEnabled": this.formRegistAset.get('statusEnabled').value,
		"tglRegisterAset": tglRegisterAsetTS,		
		"tahunProduksiBangun": this.formRegistAset.get('tahunProduksiBangun').value
	}


	this.httpService.update(Configuration.get().dataMaster+'/pegawaiskfasilitas/updateRegistrasiAset/'+this.versiRegistAset, data).subscribe(response => {
		this.alertService.success('Berhasil', 'Data Diperbarui');

		this.getRegistAset(this.pageRegistAset, this.rowsRegistAset, '');
		this.resetRegistAset();
	}) 
}


simpan3(){
	if (this.formAktifRegistAset == false){
		this.confirmUpdateRegistAset();
	}
	else {

		let tglRegisterAsetTS = this.setTimeStamp(this.formRegistAset.get('tglRegisterAset').value);
		let data = {
			"kdAsalProduk": this.formRegistAset.get('kdAsalProduk').value,
			"kdKelompokAset": this.formRegistAset.get('kdKelompokAset').value,
			"kdKondisiProdukCurrent": this.formRegistAset.get('kdKondisiProdukCurrent').value,
			"kdProduk": this.formRegistAset.get('kdProduk').value,
			"kdRuangan": this.formRegistAset.get('kdRuangan').value,
			"kdStatusAset": this.formRegistAset.get('kdStatusAset').value,
			"keteranganLainnya": this.formRegistAset.get('keteranganLainnya').value,
			"noRegisterAsetInt": this.formRegistAset.get('noRegisterAsetInt').value,
			"noRegistrasiAset": this.formRegistAset.get('noRegistrasiAset').value,
			"statusEnabled": this.formRegistAset.get('statusEnabled').value,
			"tglRegisterAset": tglRegisterAsetTS,
			"tahunProduksiBangun": this.formRegistAset.get('tahunProduksiBangun').value
		}

		this.httpService.post(Configuration.get().dataMaster+'/pegawaiskfasilitas/saveRegistrasiAset', data).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Disimpan');
			this.getRegistAset(this.pageRegistAset, this.rowsRegistAset, '');
			this.resetRegistAset();
		})
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


resetRegistAset() {
	this.formAktifRegistAset = true;
	let ruanganlog = this.authGuard.getUserDto().ruangan.kdRuangan;
	this.pageRegistAset = Configuration.get().page;
	this.rowsRegistAset = 5;
	let today = new Date();
	this.itemsRegistAset = [
	{
		label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
			this.downloadPdfRegistAset();
		}
	},
	{
		label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
			this.downloadExcelRegistAset();
		}
	},
	];
	this.formAktifRegistAset = true;
	this.getRegistAset(this.pageRegistAset, this.rowsRegistAset, '');
	this.formRegistAset = this.fb.group({
		'kdAsalProduk': new FormControl(null),
		'kdKelompokAset': new FormControl(null),
		'kdKondisiProdukCurrent': new FormControl(null),
		'kdProduk': new FormControl(null, Validators.required),
		'kdRuangan': new FormControl(ruanganlog),
		'kdStatusAset': new FormControl(null),
		'kdTypeProduk': new FormControl(null),
		'keteranganLainnya': new FormControl(''),
		'noRegistrasiAset': new FormControl(null),
		'noRegisterAsetInt': new FormControl(''),
		'statusEnabled': new FormControl(true, Validators.required),
		'tglRegisterAset': new FormControl(today, Validators.required),
		'tahunProduksiBangun' : new FormControl(null)
	});

	this.dialogRegistrasiAset = true
	this.getDataGridRegistAset(this.page,10);
	this.getSmbrFileRegistAset();
}

onRowSelectRegistAset(event) {
	let cloned = this.cloneRegistAset(event.data);
	this.keynoreg = event.data.noRegistrasiAset;
	this.formAktifRegistAset = false;
	this.formRegistAset.setValue(cloned);
	// this.blkpemilik();

}


cloneRegistAset(hub: any) {

	let fixHub = {

		// "fungsiKegunaan": hub.fungsiKegunaan,
		// "hargaNetto": hub.hargaNetto,
		// "hargaPenyusutan": hub.hargaPenyusutan,
		// "hargaPertambahan": hub.hargaPertambahan,
		// "hargaSatuanRevaluasi": hub.hargaSatuanRevaluasi,
		// "kapasitas": hub.kapasitas,
		// "kdAlamat": hub.kdAlamat,
		"kdAsalProduk": hub.kdAsalProduk,
		// "kdBahanProduk": hub.kdBahanProduk,
		// "kdJenisKonstruksi": hub.kdJenisKonstruksi,
		// "kdKategoryAset": hub.kdKategoryAset,
		"kdKelompokAset": hub.kdKelompokAset,
		// "kdKondisiProdukAwal": hub.kdKondisiProdukAwal,
		"kdKondisiProdukCurrent": hub.kdKondisiProdukCurrent,
		// "kdPegawaiPemilik": hub.kdPegawaiPemilik,
		// "kdPegawaiPengguna": hub.kdPegawaiPengguna,
		"kdProduk": hub.kdProduk,
		// "kdProdusenProduk": hub.produsenProdukId,
		// "kdProfilePemilik": hub.kdProfilePemilik,
		// "kdRekananPemilik": hub.kdRekananPemilik,
		"kdRuangan": hub.kdRuangan,
		// "kdRuanganPosisiCurrent": hub.kdRuanganPosisiCurrent,
		// "kdSatuanStandarKapasitas": hub.kdSatuanStandarKapasitas,
		"kdStatusAset": hub.kdStatusAset,
		// "kdTransmisi": hub.kdTransmisi,
		"kdTypeProduk": hub.kdTypeProduk,
		// "kdWarnaProduk": hub.kdWarnaProduk,
		"keteranganLainnya": hub.keteranganLainnya,
		// "lbLebar": hub.lbLebar,
		// "lbPanjang": hub.lbPanjang,
		// "lbTinggi": hub.lbTinggi,
		// "ltLebar": hub.ltLebar,
		// "ltPanjang": hub.ltPanjang,
		// "luasBangunan": hub.luasBangunan,
		// "luasTanah": hub.luasTanah,
		// "masaBerlakuGaransi": new Date(hub.masaBerlakuGaransi*1000),
		// "namaLengkapPegawaiPemilik": hub.namaLengkapPegawaiPemilik,
		// "namaLengkapPegawaiPengguna": hub.namaLengkapPegawaiPengguna,
		// "namaLengkapProfilePemilik": hub.namaLengkapProfilePemilik,
		// "namaModel": hub.namaModel,
		// "namaRekananPemilik": hub.namaRekananPemilik,
		// "namaRuasJalan": hub.namaRuasJalan,
		// "noClosingLast": hub.noClosingLast,
		// "noMesin": hub.noMesin,
		// "noModel": hub.noModel,
		// "noRangka": hub.noRangka,
		"noRegistrasiAset": hub.noRegistrasiAset,
		// "noRegisterAsetHead": hub.noRegisterAsetHead,
		"noRegisterAsetInt": hub.noRegisterAsetInt,
		// "noSerial": hub.noSerial,
		// "noStrukText": hub.noStrukText,
		// "qtyLantai": hub.qtyLantai,
		// "qtyProdukAset": hub.qtyProdukAset,
		// "spesifikasiDetail": hub.spesifikasiDetail,
		"statusEnabled": hub.statusEnabled,
		"tahunProduksiBangun": hub.tahunProduksiBangun,
		"tglRegisterAset": new Date(hub.tglRegisterAset*1000),     
		// "tglStrukText": new Date(hub.tglStrukText*1000), 
		// "totalSisaUmurEkonomisTahun": hub.totalSisaUmurEkonomisTahun,
		// "totalSudahBertambah": hub.totalSudahBertambah,
		// "totalSudahMenyusut": hub.totalSudahMenyusut,
		// "umurEkonomisRevaluasiTahun": hub.umurEkonomisRevaluasiTahun,
		// "umurTeknisRevaluasiTahun": hub.umurTeknisRevaluasiTahun
	}
	this.versiRegistAset =hub.version;
	return fixHub;
}

hapusRegistAset() {
	let item = [...this.listDataRegistAset];
	let deleteItem = item[this.findSelectedIndexRegistAset()];
	this.httpService.delete(Configuration.get().dataMaster + '/registrasiAset/del?kode=' + deleteItem.noRegistrasiAset).subscribe(response => {
		this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
		this.getRegistAset(this.pageRegistAset, this.rowsRegistAset, this.pencarianRegistAset);
	});
	this.resetRegistAset();
}

findSelectedIndexRegistAset(): number {
	return this.listDataRegistAset.indexOf(this.selectedRegistAset);
}

/////////////////

getSmbrFile(){
	this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
	});
}

loadPage(event: LazyLoadEvent) {
	this.get((event.rows + event.first) / event.rows, event.rows)
	this.page = (event.rows + event.first) / event.rows;
	this.rows = event.rows;
}
getKelompokTransaksi(){
	this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getKelompokTransaksi').subscribe(table => {
		let dataKelompokTransaksi = table.KelompokTransaksi;
		localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));	
		this.route.navigate(['master-sk/surat-keputusan']);
	});
}

get(page: number, rows: number){
	this.httpService.get(Configuration.get().dataMaster+'/pegawaiskfasilitas/getSK').subscribe(res => {
		this.dataSK = res.SK;
	}); 
	this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/findAllV2?page='+page+'&rows='+rows+'&dir=id.noSK&sort=desc').subscribe(
		table => {
			this.listData = table.PegawaiSKFasilitas;
			this.totalRecords = table.totalRow;
		});
	this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getSK').subscribe(res => {
		this.namaSK = [];
		this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
		for (var i = 0; i < res.SK.length; i++) {
			this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
		this.kategoriPegawai = [];
		this.kategoriPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
		for (var i = 0; i < res.data.data.length; i++) {
			this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
		this.golonganPegawai = [];
		this.golonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' })
		for (var i = 0; i < res.data.data.length; i++) {
			this.golonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=*&page=1&rows=300&criteria=kdJenisRange&values=2&condition=and&profile=y').subscribe(res => {
		this.masaKerja = [];
		this.masaKerja.push({ label: '--Pilih Masa Kerja--', value: '' })
		for (var i = 0; i < res.data.data.length; i++) {
			this.masaKerja.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id.kode })
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
		this.jabatan = [];
		this.jabatan.push({ label: '--Pilih Jabatan--', value: '' })
		for (var i = 0; i < res.data.data.length; i++) {
			this.jabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/registrasiAset/findProdukRegistrasiAset').subscribe(res => {
		this.namaProduk = [];
		this.namaProduk.push({ label: '--Pilih--', value: '' })
		for (var i = 0; i < res.data.data.length; i++) {
			this.namaProduk.push({ label: res.data.data[i].namaProduk, value: res.data.data[i]})
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KondisiProduk&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
		this.kondisiProduk = [];
		this.kondisiProduk.push({ label: '--Pilih--', value: '' })
		for (var i = 0; i < res.data.data.length; i++) {
			this.kondisiProduk.push({ label: res.data.data[i].namaKondisiProduk, value: res.data.data[i] })
		};
	});
	this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getSK').subscribe(res => {
		this.namaSK = [];
		this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
		for (var i = 0; i < res.SK.length; i++) {
			this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
		};
	});

}
cari(){
	this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/findAllV2?page='+ Configuration.get().page+'&rows='+ Configuration.get().rows+'&dir=id.noSK&sort=desc&namaGolonganPegawai='+this.pencarian).subscribe(table => {
		this.listData = table.PegawaiSKFasilitas;
		this.totalRecords = table.totalRow;
	});
}
downloadExel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkFasilitas&select=id.kode,namaMasterPegawaiSkFasilitas').subscribe(table => {
    //   this.fileService.exportAsExcelFile(table.data.data, 'MasterPegawaiSkFasilitas');
    // });

}

downloadPdf() {
	let cetak = Configuration.get().report + '/pegawaiSKFasilitas/laporanPegawaiSKFasilitas.pdf?kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
	window.open(cetak);
    // var col = ["Kode", "Nama MasterPegawaiSkFasilitas"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkFasilitas&select=id.kode,namaMasterPegawaiSkFasilitas').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master MasterPegawaiSkFasilitas", col, table.data.data, "MasterPegawaiSkFasilitas");

    // });

}

cetak(){
	this.laporan = true;
	this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKFasilitas/laporanPegawaiSKFasilitas.pdf?kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmMasterPegawaiSkFasilitas_laporanCetak');
}

ambilSK(sk) {
	if (this.form.get('namaSK').value == '' || this.form.get('namaSK').value == null || this.form.get('namaSK').value == undefined) {
		this.form.get('noSK').setValue(null);
		this.form.get('tglBerlakuSkDari').setValue(null);
		this.form.get('tglBerlakuSkSampai').setValue(null);

	} else {
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getSK?noSK=' + sk.value).subscribe(table => {
			let detailSK = table.SK;
			console.log(detailSK);
			this.form.get('noSK').setValue(detailSK[0].noSK);
			this.form.get('tglBerlakuSkDari').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
			if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
				this.form.get('tglBerlakuSkSampai').setValue(null);
			} else {
				this.form.get('tglBerlakuSkSampai').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

			}
		});
	}
}
  // filterSk(event) {
  //   this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/getSK?noSK='+event.query).subscribe(res => {
  //       this.dataSK = res.SK;
  //   });
  // }
  // pilihSK(event) {
  //   //this.form.get('namaSK').setValue(event.namaSK);
  //   this.form.get('noSK').setValue(event.noSK);
  //   this.form.get('tglBerlakuSkDari').setValue(new Date(event.tglBerlakuAwal * 1000));
  //   if(event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
  //     this.form.get('tglBerlakuSkSampai').setValue(new Date(event.tglBerlakuAkhir * 1000));
  //   }
  // }
  confirmDelete() {
  	let noSK = this.form.get('noSK').value;
  	if (noSK == null ||noSK == undefined || noSK == "") {
  		this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Fasilitas');
  	} else {
  		this.confirmationService.confirm({
  			message: 'Apakah data akan di hapus?',
  			header: 'Konfirmasi Hapus',
  			icon: 'fa fa-trash',
  			accept: () => {
  				this.hapus();
  			},
  			reject: () => {
  				this.alertService.warn('Peringatan','Data Tidak Dihapus');
  			}
  		});
  	}
  }

  hapus() {
  	let item = [...this.listData]; 
  	let deleteItem = item[this.findSelectedIndex()]; 
  	this.httpService.delete(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/delSKFasilitasV2/'+deleteItem.kode.noSK+'/'+deleteItem.kode.kdKategoryPegawai+'/'+deleteItem.kode.kdGolonganPegawai).subscribe(response => {
  	},
  	error => {
  		this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
  	},
  	() => {
  		this.alertService.success('Berhasil','Data Dihapus');
  		this.reset();
  	});

  } 

  findSelectedIndex(): number {
  	return this.listData.indexOf(this.selected);
  }

  reset(){

  	this.form.get('kategoriPegawai').enable();
  	this.form.get('masaKerja').enable();
  	this.form.get('jabatan').enable(); 

  	this.ngOnInit();
  }

  confirmUpdate() {
  	this.confirmationService.confirm({
  		message: 'Apakah data akan diperbaharui?',
  		header: 'Konfirmasi Pembaharuan',
  		accept: () => {
  			this.update();
  		},
  		reject: () => {
  			this.alertService.warn('Peringatan','Data Tidak Diperbaharui');
  		}
  	});
  }

  update() {
  	let dataSimpan;
  	let dataKomponen=[];
  	for (let i = 0; i < this.listFasilitas.length; i++) {
  		dataKomponen.push({
  			"kdKondisiProduk": this.listFasilitas[i].kondisi.kode,
  			"kdProduk": this.listFasilitas[i].nama.kode,
  			"keteranganLainnya": this.listFasilitas[i].keteranganLainnya,
  			"qtyProduk": this.listFasilitas[i].qtyProduk,
  			"resumeSpesifikasi": this.listFasilitas[i].resumeSpesifikasi,
  			"statusEnabled": this.listFasilitas[i].statusAktif,

  		})
  	}       

  	dataSimpan = {
  		"kdGolonganPegawai": this.form.get('golonganPegawai').value,
  		"kdJabatan": this.form.get('jabatan').value,
  		"kdKategoryPegawai": this.form.get('kategoriPegawai').value,
  		"kdRangeMasaKerja": this.form.get('masaKerja').value,
  		"noSK": this.form.get('noSK').value,
  		"pegawaiSKFasilitasDetailDto": dataKomponen
  	}


  	this.httpService.update(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/update/1', dataSimpan).subscribe(response =>{
  		this.alertService.success('Berhasil','Data Diperbarui');
  		this.reset();
  	});  
  }

  simpan() {
  	if (this.formAktif == false) {
  		this.confirmUpdate()
  	} 
  	else {

  		let dataKomponen=[];
  		for (let i = 0; i < this.listFasilitas.length; i++) {
  			dataKomponen.push({
  				"kdKondisiProduk": this.listFasilitas[i].kondisi.kode,
  				"kdProduk": this.listFasilitas[i].nama.kode,
  				"keteranganLainnya": this.listFasilitas[i].keteranganLainnya,
  				"resumeSpesifikasi": this.listFasilitas[i].resumeSpesifikasi,
  				"statusEnabled": this.listFasilitas[i].statusAktif,
  			})
  		};      

  		let dataSimpan = {
  			"kdGolonganPegawai": this.form.get('golonganPegawai').value,
  			"kdKategoryPegawai": this.form.get('kategoriPegawai').value,
  			"noSK": this.form.get('noSK').value,
  			"pegawaiSKFasilitasDetailByGolonganDto": dataKomponen
  		};	

  		this.httpService.post(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/saveV2', dataSimpan).subscribe(response =>{
  			this.alertService.success('Berhasil','Data Disimpan');
  			this.reset();
  		});  
  	}
  }

  tambahKomponen() {
  // if (this.listFasilitas.length == 0) {
  	let dataTemp = {
  		"nama":{
  			"namaProduk": "--Pilih--",
  		},
  		"qtyProduk": 1,
  		"kondisi":{
  			"namaKondisiProduk": "--Pilih--",
  			"kode": null
  		},
  		"resumeSpesifikasi": " ",
  		"keteranganLainnya": "",
  		"statusAktif": false,
  		"noSK":null,

  	}
  	let listFasilitas = [...this.listFasilitas];
  	listFasilitas.push(dataTemp);
  	this.listFasilitas = listFasilitas;
  // } else {
  //     this.alertService.warn('Peringatan', 'Data Tidak Lengkap')
    // }
}
hapusRow(row) {
	let listFasilitas = [...this.listFasilitas];
	listFasilitas.splice(row, 1);
	this.listFasilitas = listFasilitas;
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
valuechange(newvalue){
	this.report= newvalue;
}
onSubmit() {
	if (this.form.invalid) {
		this.validateAllFormFields(this.form);
		this.alertService.warn("Peringatan","Data Tidak Sesuai")
	} else {
		this.simpan();
	}
}
getKomponen(dataPeg){
	// console.log(dataPeg);  /findByKode?noSK=1&kdKategoryPegawai=2&kdRangeMasaKerja=4&kdJabatan=3&kdGolonganPegawai=5
	this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/findByKode?noSK='+dataPeg.data.noSK+'&kdKategoryPegawai='+dataPeg.data.kdKategoryPegawai+'&kdRangeMasaKerja='+dataPeg.data.kdRangeMasaKerja+'&kdJabatan='+dataPeg.data.kdJabatan+'&kdGolonganPegawai='+dataPeg.data.kdGolonganPegawai).subscribe(table => {
		let komponen = table.PegawaiSKFasilitas;
		this.kondisi=1;
    // this.listFasilitas = komponen;
    this.listFasilitas = [];      
    console.log(komponen);
    let dataFix
    for (let i = 0; i < komponen.length; i++){
    	dataFix = {
    		"nama":{
    			"id": {"kode":komponen[i].kode},          
    			"namaProduk": komponen[i].namaProduk,
    			"kode": komponen[i].kode.kdProduk,    
    			"noSK": komponen[i].kode.noSK,                    
    		},
          // "kondisi": komponen[i].kdKondisiProduk,          
          "qtyProduk": komponen[i].qtyProduk,
          "kondisi":{
          	"id": {"kode":komponen[i].kdKondisiProduk},                      
          	"namaKondisiProduk": komponen[i].namaKondisiProduk,
          	"kode": komponen[i].kdKondisiProduk,
          	"noSK": komponen[i].kode.noSK,                    
          	"id_kode":komponen[i].kdKondisiProduk            
          },
          "resumeSpesifikasi": komponen[i].resumeSpesifikasi,
          "keteranganLainnya": komponen[i].keteranganLainnya,
          "statusAktif": komponen[i].statusEnabled,
          "noSK": komponen[i].kode.noSK,          
      }
      this.listFasilitas.push(dataFix);      
  }
  console.log(this.listFasilitas);
});
}
onRowSelect(event) {
	console.log(event);
	this.formAktif = false;

	this.form.get('namaSK').setValue(event.data.noSK)
	this.form.get('noSK').setValue(event.data.noSK)
	let tglawal = new Date(event.data.tglBerlakuAwal*1000)
	let tglakhir = new Date(event.data.tglBerlakuAkhir*1000)
	this.form.get('tglBerlakuSkDari').setValue(tglawal)
	if (event.data.tglBerlakuAkhir == null){
		this.form.get('tglBerlakuSkSampai').setValue(null)
	}
	else{
		this.form.get('tglBerlakuSkSampai').setValue(tglakhir)
	}

	this.form.get('kategoriPegawai').setValue(event.data.kdKategoryPegawai)
	this.form.get('masaKerja').setValue(event.data.kdRangeMasaKerja)
	this.form.get('jabatan').setValue(event.data.kdJabatan)
	this.form.get('golonganPegawai').setValue(event.data.kdGolonganPegawai)
    // let cloned = this.clone(event.data);
    // this.form.setValue(cloned);
    this.versi = event.data.version
    this.getKomponen(event);   
    this.form.get('kategoriPegawai').disable();
    this.form.get('masaKerja').disable();
    this.form.get('jabatan').disable(); 
}
clone(hub: any) {
	
	let fixHub  = {
		"namaSK": hub.noSK,
		"noSK": hub.noSK,
		"tglBerlakuSkDari": new Date(hub.tglBerlakuAwal*1000),
		"tglBerlakuSkSampai": new Date(hub.tglBerlakuAkhir*1000),
		"kategoriPegawai": hub.kdKategoryPegawai,
		"masaKerja": hub.kdRangeMasaKerja,
		"jabatan": hub.kdJabatan,
	}
	this.versi = hub.version;
	return fixHub;
}


registrasiAset(){
	this.dialogRegistrasiAset = true
}


}
