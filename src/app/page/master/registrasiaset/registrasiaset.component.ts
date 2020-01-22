import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/primeng';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { RegistrasiAset } from './registrasiaset.interface';
import { Validators, FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, FileUploadModule } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService,  AuthGuard, ReportService  } from '../../../global';
import { Http, RequestOptions, URLSearchParams, Headers, Response, ResponseContentType} from '@angular/http';


@Component({
	selector: 'app-registrasiaset',
	templateUrl: './registrasiaset.component.html',
	styleUrls: ['./registrasiaset.component.scss'],
	providers: [ConfirmationService]
})
export class RegistrasiAsetComponent implements OnInit {

	item: any;
	selected: any;
	listData: any[];

	kelompokAset: any[];
	kategoriAset: any[];
	ruanganUnitKerja: any[];
	namaBarang: any[];
	asalBarang: any[];
	tipeBarang: any[];
	bahanBarang: any[];
	warnaBarang: any[];
	produsen: any[];
	kondisiAwalBarang: any[];
	kondisiBarangSaatIni: any[];
	noRegistrasiAset: any;

	formAlamat: FormGroup;

	pencarian: string = '';
	formAktif: boolean;
	versi: any;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;

	cekKendaraan: boolean;
	cekBangunan: boolean;
	cekTanah: boolean;
	cekUmum: boolean;

	listDataDokumen: any[];

	cekPnlKendaraan: boolean;
	cekPnlBangunan: boolean;
	cekPnlTanah: boolean;
	cekPnlUmum: boolean;

	kategoryDokumen: any[];
	listKategoryDokumen: any[];
	listDokumenPengajuan: any[];
	smbrFile: any;
	dialogPreviewImage: boolean;
	dialogPreviewDokumen: any;

	listDataStrukturNomor: any[];
	listDokumenCreator: any[];

	KategoryDokumen: any;
	namaKategoryDokumen: any;

	listPegawaiDokCreator: any[];

	listJenisDokumen: any[];
	selectedDokumen: any;

	listRuanganPosisiCurrent: any[];
	listKategoryAset: any[];
	listStatusAset: any[];
	listProfilePemilik: any[];
	listPegawaiPemilik: any[];
	listPegawaiPengguna: any[];
	listRekananPemilik: any[];
	listStrukturNomor: any[];
	listSatuanStandarKapasitas: any[];
	listJenisKonstruksi: any[];
	listTransmisi: any[];

	demo: any;
	dokumenFiles: any[]=[];
	uploadedFiles: any[]=[];
	msgs: any[];
	buttonAktif: boolean;
	dokumenUrl: string;

	keynoreg: any;

	isipegawaibaru: any;

	blkpegawaipemilik: boolean;
	blkrekananpemilik: boolean;
	blkprofilepemilik: boolean;

	pegbaru: boolean;

	listDokumenCreatorBaru : any[];

	dokcreator: any[]
	blkluastanah: boolean;
	blkltpanjang: boolean;
	blkltlebar: boolean;

	report: any;
	toReport: any;

	dok: any[];
	strukturno: any[];

	listAlamat: any[];
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	codes:any[];

	kdStatusPemilikPegawai: any;
	kdStatusPemilikProfile: any;
	kdStatusPemilikRekanan: any;  

	dialogAlamat: boolean;
	tambahAlamat: boolean;

	listJenisAlamat: any[];
	listNegara: any[];
	listPropinsi: any[];
	listKotaKabupaten: any[];
	listKecamatan: any[];
	listDesaKelurahan: any[];

	kodepos: any;
	
	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
	}

	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		let ruanganlog = this.authGuard.getUserDto().ruangan.kdRuangan;

		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
		let today = new Date();
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

		this.formAktif = true;
		this.get(this.page, this.rows, '');
		
		this.form = this.fb.group({
			'alamatLengkap': new FormControl(''),
			'kdJenisAlamat': new FormControl(null),
			'kdNegara': new FormControl(null),
			'kdPropinsi': new FormControl(null),
			'kdKecamatan': new FormControl(null),
			'kodePos': new FormControl(''),
			'kdKotaKabupaten': new FormControl(null),
			'kdDesaKelurahan' : new FormControl(null),
			'rtrw': new FormControl(''),

			'fungsiKegunaan': new FormControl(''),
			'hargaNetto': new FormControl(0),
			'hargaPenyusutan': new FormControl(''),
			'hargaPertambahan': new FormControl(''),
			'hargaSatuanRevaluasi': new FormControl(''),
			'kapasitas': new FormControl(''),
			'kdAlamat': new FormControl(null),
			'kdAsalProduk': new FormControl(null, Validators.required),
			'kdBahanProduk': new FormControl(null),
			'kdJenisKonstruksi': new FormControl(null),
			'kdKategoryAset': new FormControl(null),
			'kdKelompokAset': new FormControl(null, Validators.required),
			'kdKondisiProdukAwal': new FormControl(null),
			'kdKondisiProdukCurrent': new FormControl(null),
			'kdPegawaiPemilik': new FormControl(null),
			'kdPegawaiPengguna': new FormControl(null),
			'kdProduk': new FormControl(null, Validators.required),
			'kdProdusenProduk': new FormControl(null),
			'kdProfilePemilik': new FormControl(null),
			'kdRekananPemilik': new FormControl(null),
			'kdRuangan': new FormControl(ruanganlog, Validators.required),
			'kdRuanganPosisiCurrent': new FormControl(null),
			'kdSatuanStandarKapasitas': new FormControl(null),
			'kdStatusAset': new FormControl(null, Validators.required),
			'kdTransmisi': new FormControl(null),
			'kdTypeProduk': new FormControl(null),
			'kdWarnaProduk': new FormControl(null),
			'keteranganLainnya': new FormControl(''),
			'lbLebar': new FormControl(''),
			'lbPanjang': new FormControl(''),
			'lbTinggi': new FormControl(''),
			'ltLebar': new FormControl(''),
			'ltPanjang': new FormControl(''),
			'luasBangunan': new FormControl(''),
			'luasTanah': new FormControl(''),
			'masaBerlakuGaransi': new FormControl(''),
			'namaLengkapPegawaiPemilik': new FormControl(''),
			'namaLengkapPegawaiPengguna': new FormControl(''),
			'namaLengkapProfilePemilik': new FormControl(''),
			'namaModel': new FormControl(''),
			'namaRekananPemilik': new FormControl(''),
			'namaRuasJalan': new FormControl(''),
			'noClosingLast': new FormControl(''),
			'noMesin': new FormControl(''),
			'noModel': new FormControl(''),
			'noRangka': new FormControl(''),
			'noRegistrasiAset': new FormControl(null),
			'noRegisterAsetHead': new FormControl(null),
			'noRegisterAsetInt': new FormControl(''),
			'noSerial': new FormControl(''),
			'noStrukText': new FormControl(''),
			'qtyLantai': new FormControl(''),
			'qtyProdukAset': new FormControl(1, Validators.required),
			'spesifikasiDetail': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),
			'tahunProduksiBangun': new FormControl(''),
			'tglRegisterAset': new FormControl(today, Validators.required),
			'tglStrukText': new FormControl(''),
			'totalSisaUmurEkonomisTahun': new FormControl(0, Validators.required),
			'totalSudahBertambah': new FormControl(''),
			'totalSudahMenyusut': new FormControl(''),
			'umurEkonomisRevaluasiTahun': new FormControl(''),
			'umurTeknisRevaluasiTahun': new FormControl(''),
		});

		this.form.get('kdProfilePemilik').disable();
		this.form.get('kdPegawaiPemilik').disable();
		this.form.get('kdRekananPemilik').disable();

		this.cekKendaraan = false;
		this.cekBangunan = false;
		this.cekTanah = false;
		this.cekUmum = false;

		this.cekPnlKendaraan = true;
		this.cekPnlBangunan = true;
		this.cekPnlTanah = true;
		this.cekPnlUmum = true;

		this.listDataDokumen = [];
		this.listDokumenPengajuan = [];
		this.listDataStrukturNomor = [];
		this.listDokumenCreator = [];
		this.listDokumenCreatorBaru = [];
		this.getDataGrid(this.page,10);
		this.getSmbrFile();

	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	downloadExcel() {
		let cetak = Configuration.get().report + '/hargaNettoProdukByKelas/laporanHargaNettoProdukByKelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
		window.open(cetak);
    	// this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAll?page='+this.page+'&rows='+this.rows).subscribe(table => {

   		 //   this.fileService.exportAsExcelFile(table.data.data, 'Alamat');
   	 // });

   	}

   	downloadPdf() {
   		let cetak = Configuration.get().report + '/registrasiAset/laporanRegistrasiAset.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
   		window.open(cetak);
   	}

   	cetak(){
   		this.laporan = true;
   		this.print.showEmbedPDFReport(Configuration.get().report + '/registrasiAset/laporanRegistrasiAset.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmRegistrasiAset_laporanCetak');

   	}
   	tutupLaporan() {
   		this.laporan = false;
   	}

   	getDataGrid(page: number, rows: number) {
   		this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAll?page=' + page + '&rows=' + rows + '&dir=noRegistrasiAset&sort=asc').subscribe(table => {
   			this.listData = table.data.result;
   			this.totalRecords = table.data.totalRow;
   		});
   	}

   	loadPage(event: LazyLoadEvent) {
   		this.getDataGrid((event.rows+event.first)/event.rows,event.rows);
   	}

   	get(page: number, rows: number, search: any) {
	//alamat

	//jenis alamat
	this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisAlamat&select=namaJenisAlamat,id.kode').subscribe(res => {
		this.listJenisAlamat = [];
		this.listJenisAlamat.push({ label: '--Pilih Jenis Alamat--', value: null })
		for (var i = 0; i < res.data.data.length; i++) {
			this.listJenisAlamat.push({ label: res.data.data[i].namaJenisAlamat, value: res.data.data[i].id_kode })
		};
	});

    //negara
    	this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
    		this.listNegara = [];
    	    this.listNegara.push({ label: '--Pilih Negara--', value: null })
			for (var i = 0; i < res.Negara.length; i++) {
      			this.listNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		});

    ///

    // kelompok aset
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KelompokAset&select=namaKelompokAset,id.kode').subscribe(res => {
    	this.kelompokAset = [];
    	this.kelompokAset.push({ label: '--Pilih Kelompok Aset--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.kelompokAset.push({ label: res.data.data[i].namaKelompokAset, value: res.data.data[i].id_kode })
    	};
    });

    //list unit kerja
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.authGuard.getUserDto().kdLokasi).subscribe(res => {
    	this.ruanganUnitKerja = [];
    	this.ruanganUnitKerja.push({ label: '--Pilih Unit Kerja-', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.ruanganUnitKerja.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id_kode })
    	};
    });

    //list unit kerja current
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.authGuard.getUserDto().kdLokasi).subscribe(res => {
    	this.listRuanganPosisiCurrent = [];
    	this.listRuanganPosisiCurrent.push({ label: '--Pilih Unit Kerja Current-', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listRuanganPosisiCurrent.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id_kode })
    	};
    });

    //list kategory aset
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KategoryAset&select=namaKategoryAset,id.kode').subscribe(res => {
    	this.listKategoryAset = [];
    	this.listKategoryAset.push({ label: '--Pilih Kategori Aset-', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listKategoryAset.push({ label: res.data.data[i].namaKategoryAset, value: res.data.data[i].id_kode })
    	};
    });

    // nama barang
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findProduk').subscribe(res => {
    	this.namaBarang = [];
    	this.namaBarang.push({ label: '--Pilih Nama Barang--', value:null })
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
    	this.listStatusAset.push({ label: '--Pilih Status Aset--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listStatusAset.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].kode })
    	};
    });

    //list jenis konstruksi
    this.httpService.get(Configuration.get().dataMaster + '/jeniskonstruksi/findAll?').subscribe(res => {
    	this.listJenisKonstruksi = [];
    	this.listJenisKonstruksi.push({ label: '--Pilih Jenis Konstruksi --', value: null})
    	for (var i = 0; i < res.JenisKonstruksi.length; i++) {
    		this.listJenisKonstruksi.push({ label: res.JenisKonstruksi[i].namaJenisKonstruksi, value: res.JenisKonstruksi[i].kode.kode })
    	};
    });

    //list alamat
    // this.httpService.get(Configuration.get().dataMaster + '/alamat/findAll?').subscribe(res => {
    // 	this.listAlamat = [];
    // 	this.listAlamat.push({ label: '--Pilih Alamat --', value: null })
    // 	for (var i = 0; i < res.Alamat.length; i++) {
    // 		this.listAlamat.push({ label: res.Alamat[i].alamatLengkap, value: res.Alamat[i].kode.kode })
    // 	};
    // });

    this.httpService.get(Configuration.get().dataMaster + '/profile/getDropDownAlamat').subscribe(res => {
    	this.listAlamat = [];
    	this.listAlamat.push({ label: '--Pilih Alamat--', value: null })
    	for (var i = 0; i < res.Alamat.length; i++) {
    		this.listAlamat.push({ label: res.Alamat[i].alamat, value: res.Alamat[i].kode })
    	};
    });

    //list transmisi
    this.httpService.get(Configuration.get().dataMaster + '/transmisi/findAll?').subscribe(res => 
{    	this.listTransmisi = [];
    	this.listTransmisi.push({ label: '--Pilih Transmisi --', value: null })
    	for (var i = 0; i < res.Transmisi.length; i++) {
    		this.listTransmisi.push({ label: res.Transmisi[i].namaTransmisi, value: res.Transmisi[i].kode })
    	};
    });

    //list profile pemilik
    this.httpService.get(Configuration.get().dataMaster + '/status/status-milik-profile').subscribe(res => {
    	this.kdStatusPemilikProfile = res.data.kdStatusMilikProfile;
    });

    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findProfile').subscribe(res => {
    	this.listProfilePemilik = [];
    	this.listProfilePemilik.push({ label: '--Pilih Profile Pemilik--', value: null })
    	for (var i = 0; i < res.Data.length; i++) {
    		this.listProfilePemilik.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kode })
    	};
    });

    //list pegawai pemilik
    this.httpService.get(Configuration.get().dataMaster + '/status/status-milik-pribadi').subscribe(res => {
    	this.kdStatusPemilikPegawai = res.data.kdStatusMilikPribadi;
    });

    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findPegawaiAktif').subscribe(res => {
    	this.listPegawaiPemilik = [];
    	this.listPegawaiPemilik.push({ label: '--Pilih Pegawai Pemilik--', value: null })
    	for (var i = 0; i < res.Data.length; i++) {
    		this.listPegawaiPemilik.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
    	};
    });

    //list pegawai pengguna
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findPegawaiAktif').subscribe(res => {
    	this.listPegawaiPengguna = [];
    	this.listPegawaiPengguna.push({ label: '--Pilih Pegawai Pengguna--', value: '' })
    	for (var i = 0; i < res.Data.length; i++) {
    		this.listPegawaiPengguna.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
    	};
    });

    // list Rekanan Pemilik
    this.httpService.get(Configuration.get().dataMaster + '/status/status-milik-rekanan').subscribe(res => {
    	this.kdStatusPemilikRekanan = res.data.kdStatusMilikRekanan;
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Rekanan&select=namaRekanan,id.kode').subscribe(res => {
    	this.listRekananPemilik = [];
    	this.listRekananPemilik.push({ label: '--Pilih Rekanan Pemilik--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listRekananPemilik.push({ label: res.data.data[i].namaRekanan, value: res.data.data[i].id_kode })
    	};
    });

    //tipe barang
    this.httpService.get(Configuration.get().dataMaster + '/typeproduk/findAllType').subscribe(res => {
    	this.tipeBarang = [];
    	this.tipeBarang.push({ label: '--Pilih Merk / Tipe Barang--', value: null })
    	for (var i = 0; i < res.TypeProduk.length; i++) {
    		this.tipeBarang.push({ label: res.TypeProduk[i].namaTypeProduk, value: res.TypeProduk[i].kode })
    		
    	};
    });

    // bahan barang
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=BahanProduk&select=namaBahanProduk,id.kode').subscribe(res => {
    	this.bahanBarang = [];
    	this.bahanBarang.push({ label: '--Pilih Bahan Barang--', value: null})
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.bahanBarang.push({ label: res.data.data[i].namaBahanProduk, value: res.data.data[i].id_kode })
    	};
    });

    // warna produk
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=WarnaProduk&select=namaWarnaProduk,id.kode').subscribe(res => {
    	this.warnaBarang = [];
    	this.warnaBarang.push({ label: '--Pilih Warna Barang--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.warnaBarang.push({ label: res.data.data[i].namaWarnaProduk, value: res.data.data[i].id_kode })
    	};
    });

    // produsen
    this.httpService.get(Configuration.get().dataMaster + '/produsenproduk/findAllProdusen').subscribe(res => {
    	this.produsen = [];
    	this.produsen.push({ label: '--Pilih Produsen--', value: null })
    	for (var i = 0; i < res.ProdusenProduk.length; i++) {
    		this.produsen.push({ label: res.ProdusenProduk[i].namaProdusenProduk, value: res.ProdusenProduk[i].kode })
    	};
    });

    // kondisi produk awal
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KondisiProduk&select=namaKondisiProduk,id.kode').subscribe(res => {
    	this.kondisiAwalBarang = [];
    	this.kondisiAwalBarang.push({ label: '--Pilih Kondisi Awal Barang--', value: null})
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.kondisiAwalBarang.push({ label: res.data.data[i].namaKondisiProduk, value: res.data.data[i].id_kode })
    	};
    });

    // kondisi produk saat ini
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KondisiProduk&select=namaKondisiProduk,id.kode').subscribe(res => {
    	this.kondisiBarangSaatIni = [];
    	this.kondisiBarangSaatIni.push({ label: '--Pilih Kondisi Barang Saat Ini--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.kondisiBarangSaatIni.push({ label: res.data.data[i].namaKondisiProduk, value: res.data.data[i].id_kode })
    	};
    });

    //list satuan standar kapasitas
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findSatuanStandarKapasitas').subscribe(res => {
    	this.listSatuanStandarKapasitas = [];
    	this.listSatuanStandarKapasitas.push({ label: '--Pilih Satuan Standar Kapasitas--', value: null})
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listSatuanStandarKapasitas.push({ label: res.data.data[i].namaSatuanStandar, value: res.data.data[i].KdSatuanStandar })
    	};
    });

    //list struktur nomor
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=StrukturNomor&select=namaStrukturNomor,id.kode').subscribe(res => {
    	this.listStrukturNomor = [];
    	this.listStrukturNomor.push({ label: '--Pilih Struktur Nomor--', value: null})
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listStrukturNomor.push({ label: res.data.data[i].namaStrukturNomor, value: res.data.data[i] })
    	};
    });

    //jenis dokumen ngtemplate
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findJenisDokumen').subscribe(res => {
    	this.listJenisDokumen = [];
    	this.listJenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: null })
    	for (var i = 0; i < res.data.data.length; i++) {
    		this.listJenisDokumen.push({ label: res.data.data[i].namaJenisDokumen, value: res.data.data[i] })
    	};
    },
    error => {
    	this.listJenisDokumen = [];
    	this.listJenisDokumen.push({ label: '-- ' + error + ' --', value: '' })
    });

    //sementara jenis dokumen
    // 

    //pegawai dokcreator ngtemplate
    this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findPegawaiAktif').subscribe(res => {
    	this.listPegawaiDokCreator = [];
    	this.listPegawaiDokCreator.push({ label: '--Pilih Pegawai Pemilik--', value: null});
      //hahaha ngaco ga nih percobaannya
      // this.listPegawaiDokCreator.push({ label: '(input pegawai baru)', value: 'inputpegawaibaru'});
      for (var i = 0; i < res.Data.length; i++) {
      	this.listPegawaiDokCreator.push({ label: res.Data[i].namaLengkap, value: {"namaLengkap": res.Data[i].namaLengkap,
      		"statusInput": 0,
      		"kdPegawai": {
      			"kdpegawai": res.Data[i].kdpegawai,
      			"namaLengkap": res.Data[i].namaLengkap
      		},
      		"statusEnabled": true}})
      };
  });
}

getPropinsi(event){
	let kd = event.value;
	if (kd == null){
		this.listPropinsi = [];
		this.alertService.warn('Peringatan','Pilih Negara');
	}
	else {
		//propinsi 
		 this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + kd).subscribe(res => {
      		this.listPropinsi = [];
			this.listPropinsi.push({ label: '--Pilih Propinsi--', value: null })
			for (var i = 0; i < res.Propinsi.length; i++) { 
				this.listPropinsi.push({ label: res.Propinsi[i].namaPropinsi, value: res.Propinsi[i].kode.kode })
			};
		});
	}
}

getKotaKabupaten(event){
	let kd = event.value;
	if (kd == null){
		this.listKotaKabupaten = [];
		this.alertService.warn('Peringatan','Pilih Provinsi');
	}
	else {
		//kotakabupaten 
		 this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + kd + '&kdNegara=' + this.form.get('kdNegara').value).subscribe(res => {
     	 this.listKotaKabupaten = [];
			this.listKotaKabupaten.push({ label: '--Pilih Kota Kabupaten--', value: null })
			  for (var i = 0; i < res.KotaKabupaten.length; i++) {
               this.listKotaKabupaten.push({ label: res.KotaKabupaten[i].namaKotaKabupaten, value: res.KotaKabupaten[i].kode.kode })
           };
		});
	}
}

getKecamatan(event){
	let kd = event.value;
	if (kd == null){
		this.listKecamatan = [];
		this.alertService.warn('Peringatan','Pilih Kota/Kabupaten');
	}
	else {
    	//kecamatan 
      this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + kd + '&kdNegara=' + this.form.get('kdNegara').value).subscribe(res => {
   		this.listKecamatan = [];
    		this.listKecamatan.push({ label: '--Pilih Kecamatan--', value: null })
    		  for (var i = 0; i < res.Kecamatan.length; i++) {
           this.listKecamatan.push({ label: res.Kecamatan[i].namaKecamatan, value: res.Kecamatan[i].kode.kode })
       };
    	});
    }
}

getDesaKelurahan(event){
	let kd = event.value;
	if (kd == null){
		this.listDesaKelurahan = [];
		this.alertService.warn('Peringatan','Pilih Kecamatan');
	}
	else {
		//desa kelurahan
		this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + kd + '&kdNegara=' + this.form.get('kdNegara').value).subscribe(res => {
  	        this.listDesaKelurahan = [];
			this.listDesaKelurahan.push({ label: '--Pilih Desa Kelurahan--', value: null })
			 for (var i = 0; i < res.DesaKelurahan.length; i++) {
               this.listDesaKelurahan.push({ label: res.DesaKelurahan[i].namaDesaKelurahan, value: res.DesaKelurahan[i].kode.kode })
             };
		});
	}
}

getKodePos(event){
	let kd = event.value;
	if (kd == null) {
		this.alertService.warn('Peringatan','Pilih Desa/Kelurahan');
	} 
	else {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=DesaKelurahan&select=*&page=1&rows=1000&criteria=id.kode&values='+kd+'&condition=and&profile=y').subscribe(res => {
			this.form.get('kodePos').setValue(res.data.data[0].kodePos);
		});
	}
}

cari() {
	this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&namaProduk=' + this.pencarian).subscribe(table => {
		this.listData = table.data.result;
	});
}

confirmDelete() {
	let noRegistrasiAset = this.form.get('noRegistrasiAset').value;
	if (noRegistrasiAset == null || noRegistrasiAset == undefined || noRegistrasiAset == "") {
		this.alertService.warn('Peringatan', 'Pilih Daftar Registrasi Aset');
	} else {

		this.confirmationService.confirm({
			message: 'Apakah Data Akan Dihapus?',
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

onSubmit() {
	if (this.form.invalid) {
		this.validateAllFormFields(this.form);
		this.alertService.warn("Peringatan", "Data Tidak Sesuai");
	} else {
		this.simpan3();
	}
}

confirmUpdate() {
	this.confirmationService.confirm({
		message: 'Apakah Data Akan diperbaharui?',
		header: 'Konfirmasi Pembaharuan',
		accept: () => {
			this.update();
		},
		reject: () => {
			this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
		}
	});
}

update(){
  	//data dokumen
  	let dataDokumen= [];
  	let dokError = []

  	for (let i=0; i<this.listDokumenPengajuan.length; i++){
  		let dataDokCreator = [];

  		let cekkdjenisdok = this.listDokumenPengajuan[i].kdJenisDokumen;
  		let z = this.listDokumenPengajuan[i].dokcreator.length;
  		let y = this.listDokumenPengajuan[i].dokcreatorbaru.length;

  		if (this.listDokumenPengajuan.length != 0 && cekkdjenisdok != null){
  			if (z == 0 && y == 0){
  				this.alertService.warn('Peringatan', 'Isi Pemilik Dokumen');
  				dokError.push(i+1);
  			}
  			else {
  				let tglAwalBerlakuTS = this.setTimeStamp(this.listDokumenPengajuan[i].tglAwalBerlaku);
  				let tglAkhirBerlakuTS = this.setTimeStamp(this.listDokumenPengajuan[i].tglAkhirBerlaku);
  				let tglDokumenTS = this.setTimeStamp(this.listDokumenPengajuan[i].tglDokumen);

  				let kdJenisDokumen = this.listDokumenPengajuan[i].kdJenisDokumen.kdJenisDokumen;
  				let namaDokumen = this.listDokumenPengajuan[i].namaDokumen;

  				let kdDokumen = this.listDokumenPengajuan[i].kdDokumen;

  				for (let j=0; j<this.listDokumenPengajuan[i].dokcreator.length; j++){
  					let kdPegawai = this.listDokumenPengajuan[i].dokcreator[j].pegawaiDokCreator.kdPegawai.kdpegawai;
  					let namaLengkap = this.listDokumenPengajuan[i].dokcreator[j].pegawaiDokCreator.namaLengkap;
  					let statusEnabled = this.listDokumenPengajuan[i].dokcreator[j].pegawaiDokCreator.statusEnabled;
  					dataDokCreator[j] = {
  						"kdDokumen": null,
  						"kdJenisPetugasPe": null,
  						"kdPegawai": kdPegawai,
  						"keteranganLainnya": "",
  						"namaLengkap": namaLengkap,
  						"statusEnabled": statusEnabled
  					}
        		// dataDokCreator.push(dataDokCreator[j]);
        	}

        	let m = this.listDokumenPengajuan[i].dokcreator.length;
        	for (let k=0; k<this.listDokumenPengajuan[i].dokcreatorbaru.length; k++){
        		let namaLengkap = this.listDokumenPengajuan[i].dokcreatorbaru[k].pegawaiDokCreatorBaru;
        		dataDokCreator[m+k]={
        			"kdDokumen": null,
        			"kdJenisPetugasPe": null,
        			"kdPegawai": null,
        			"keteranganLainnya": "",
        			"namaLengkap": namaLengkap,
        			"statusEnabled": true
        		}
        		// dataDokCreator.push(dataDokCreator[m+k]);
        	}
        	dataDokumen.push({
        		"deskripsiDokumen": "",
        		"dokCreator": dataDokCreator,
        		"imageFile": "",
        		"isDokumenInOutInt": null,
        		"isiDokumen": "",
        		"kdDokumen": kdDokumen,
        		"kdJenisDokumen": kdJenisDokumen,
        		"kdJenisSertifikat": null,
        		"kdKategoryDokumen": null,
        		"keteranganLainnya": "",
        		"namaDokumen": namaDokumen,
        		"noHistori": "",
        		"noRegistrasiAset": "",
        		"noVerifikasi": "",
        		"pathFile": this.listDokumenPengajuan[i].pathFile,
        		"qtyLampiran": null,
        		"statusEnabled": this.listDokumenPengajuan[i].statusEnabled,
        		"tglAwalBerlaku": tglAwalBerlakuTS,
        		"tglAkhirBerlaku": tglAkhirBerlakuTS,
        		"tglDokumen": tglDokumenTS,
        	})

        }
    }
    else {

    	this.alertService.warn('Peringatan','Pilih Jenis Dokumen');
    	dokError.push(i+1);
    }	

}
    //data registrasi aset
    let masaBerlakuGaransiTS = this.setTimeStamp(this.form.get('masaBerlakuGaransi').value);
    let tglRegisterAsetTS = this.setTimeStamp(this.form.get('tglRegisterAset').value);
    let tglStrukTextTS = this.setTimeStamp(this.form.get('tglStrukText').value);

    let kdalamat = this.form.get('kdAlamat').value;
    let registAset;

    if(kdalamat == null){
    	registAset = {
    		"dataAlamatDto" : {
    			"alamatEmail": "",
    			"alamatLengkap": this.form.get('alamatLengkap').value,
    			"blackBerry": "",
    			"desaKelurahan": "",
    			"facebook": "",
    			"faksimile1": "",
    			"faksimile2": "",
    			"fixedPhone1": "",
    			"fixedPhone2": "",
    			"garisBujurLongitude": 0,
    			"garisLintangLatitude": 0,
    			"isBillingAddress": 0,
    			"isPrimaryAddress": 0,
    			"isShippingAddress": 0,
    			"kdDepartemen": "",
    			"kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
    			"kdJenisAlamat": this.form.get('kdJenisAlamat').value,
    			"kdKecamatan": this.form.get('kdKecamatan').value,
    			"kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
    			"kdNegara": this.form.get('kdNegara').value,
    			"kdProfile": 0,
    			"kdPropinsi": this.form.get('kdPropinsi').value,
    			"kecamatan": "",
    			"kode": 0,
    			"kodePos": this.form.get('kodePos').value,
    			"kotaKabupaten": "",
    			"line": "",
    			"mobilePhone1": "",
    			"mobilePhone2": "",
    			"namaTempatGedung": "",
    			"rtrw": this.form.get('rtrw').value,
    			"statusEnabled": true,
    			"twitter": "",
    			"website": "",
    			"whatsApp": "",
    			"yahooMessenger": "",
    		},
    		"fungsiKegunaan": this.form.get('fungsiKegunaan').value,
    		"hargaNetto": this.form.get('hargaNetto').value,
    		"hargaPenyusutan": this.form.get('hargaPenyusutan').value,
    		"hargaPertambahan": this.form.get('hargaPertambahan').value,
    		"hargaSatuanRevaluasi": this.form.get('hargaSatuanRevaluasi').value,
    		"kapasitas": this.form.get('kapasitas').value,
    		"kdAlamat": this.form.get('kdAlamat').value,
    		"kdAsalProduk": this.form.get('kdAsalProduk').value,
    		"kdBahanProduk": this.form.get('kdBahanProduk').value,
    		"kdJenisKonstruksi": this.form.get('kdJenisKonstruksi').value,
    		"kdKategoryAset": this.form.get('kdKategoryAset').value,
    		"kdKelompokAset": this.form.get('kdKelompokAset').value,
    		"kdKondisiProdukAwal": this.form.get('kdKondisiProdukAwal').value,
    		"kdKondisiProdukCurrent": this.form.get('kdKondisiProdukCurrent').value,
    		"kdPegawaiPemilik": this.form.get('kdPegawaiPemilik').value,
    		"kdPegawaiPengguna": this.form.get('kdPegawaiPengguna').value,
    		"kdProduk": this.form.get('kdProduk').value,
    		"kdProdusenProduk": this.form.get('kdProdusenProduk').value,
    		"kdProfilePemilik": this.form.get('kdProfilePemilik').value,
    		"kdRekananPemilik": this.form.get('kdRekananPemilik').value,
    		"kdRuangan": this.form.get('kdRuangan').value,
    		"kdRuanganPosisiCurrent": this.form.get('kdRuanganPosisiCurrent').value,
    		"kdSatuanStandarKapasitas": this.form.get('kdSatuanStandarKapasitas').value,
    		"kdStatusAset": this.form.get('kdStatusAset').value,
    		"kdTransmisi": this.form.get('kdTransmisi').value,
    		"kdTypeProduk": this.form.get('kdTypeProduk').value,
    		"kdWarnaProduk": this.form.get('kdWarnaProduk').value,
    		"keteranganLainnya": this.form.get('keteranganLainnya').value,
    		"lbLebar": this.form.get('lbLebar').value,
    		"lbPanjang": this.form.get('lbPanjang').value,
    		"lbTinggi": this.form.get('lbTinggi').value,
    		"ltLebar": this.form.get('ltLebar').value,
    		"ltPanjang": this.form.get('ltPanjang').value,
    		"luasBangunan": this.form.get('luasBangunan').value,
    		"luasTanah": this.form.get('luasTanah').value,
    		"masaBerlakuGaransi": masaBerlakuGaransiTS,
    		"namaLengkapPegawaiPemilik": this.form.get('namaLengkapPegawaiPemilik').value ,
    		"namaLengkapPegawaiPengguna": this.form.get('namaLengkapPegawaiPengguna').value ,
    		"namaLengkapProfilePemilik": this.form.get('namaLengkapProfilePemilik').value ,
    		"namaModel": this.form.get('namaModel').value ,
    		"namaRekananPemilik": this.form.get('namaRekananPemilik').value ,
    		"namaRuasJalan": this.form.get('namaRuasJalan').value ,
    		"noClosingLast": this.form.get('noClosingLast').value ,
    		"noMesin": this.form.get('noMesin').value ,
    		"noModel": this.form.get('noModel').value ,
    		"noRangka": this.form.get('noRangka').value ,
    		"noRegisterAsetHead": this.form.get('noRegisterAsetHead').value ,
    		"noRegisterAsetInt": this.form.get('noRegisterAsetInt').value ,
    		"noRegistrasiAset": this.form.get('noRegistrasiAset').value ,
    		"noSerial": this.form.get('noSerial').value ,
    		"noStrukText": this.form.get('noStrukText').value ,
    		"qtyLantai": this.form.get('qtyLantai').value ,
    		"qtyProdukAset": this.form.get('qtyProdukAset').value ,
    		"spesifikasiDetail": this.form.get('spesifikasiDetail').value ,
    		"statusEnabled": true ,
    		"tahunProduksiBangun": this.form.get('tahunProduksiBangun').value,
    		"tglRegisterAset": tglRegisterAsetTS,
    		"tglStrukText": tglStrukTextTS,
    		"totalSisaUmurEkonomisTahun": this.form.get('totalSisaUmurEkonomisTahun').value ,
    		"totalSudahBertambah": this.form.get('totalSudahBertambah').value ,
    		"totalSudahMenyusut": this.form.get('totalSudahMenyusut').value ,
    		"umurEkonomisRevaluasiTahun": this.form.get('umurEkonomisRevaluasiTahun').value ,
    		"umurTeknisRevaluasiTahun": this.form.get('umurTeknisRevaluasiTahun').value 
    	}
    }
    else {
    	registAset = {
    		"dataAlamatDto" : {
      			// "alamatEmail": "",
      			// "alamatLengkap": this.form.get('alamatLengkap').value,
      			// "blackBerry": "",
      			// "desaKelurahan": "",
      			// "facebook": "",
      			// "faksimile1": "",
      			// "faksimile2": "",
      			// "fixedPhone1": "",
      			// "fixedPhone2": "",
      			// "garisBujurLongitude": 0,
      			// "garisLintangLatitude": 0,
      			// "isBillingAddress": 0,
      			// "isPrimaryAddress": 0,
      			// "isShippingAddress": 0,
      			// "kdDepartemen": "",
      			// "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
      			// "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
      			// "kdKecamatan": this.form.get('kdKecamatan').value,
      			// "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
      			// "kdNegara": this.form.get('kdNegara').value,
      			// "kdProfile": 0,
      			// "kdPropinsi": this.form.get('kdPropinsi').value,
      			// "kecamatan": "",
      			// "kode": 0,
      			// "kodePos": this.form.get('kodePos').value,
      			// "kotaKabupaten": "",
      			// "line": "",
      			// "mobilePhone1": "",
      			// "mobilePhone2": "",
      			// "namaTempatGedung": "",
      			// "rtrw": this.form.get('rtrw').value,
      			// "statusEnabled": true,
      			// "twitter": "",
      			// "website": "",
      			// "whatsApp": "",
      			// "yahooMessenger": "",
      		},
      		"fungsiKegunaan": this.form.get('fungsiKegunaan').value,
      		"hargaNetto": this.form.get('hargaNetto').value,
      		"hargaPenyusutan": this.form.get('hargaPenyusutan').value,
      		"hargaPertambahan": this.form.get('hargaPertambahan').value,
      		"hargaSatuanRevaluasi": this.form.get('hargaSatuanRevaluasi').value,
      		"kapasitas": this.form.get('kapasitas').value,
      		"kdAlamat": this.form.get('kdAlamat').value,
      		"kdAsalProduk": this.form.get('kdAsalProduk').value,
      		"kdBahanProduk": this.form.get('kdBahanProduk').value,
      		"kdJenisKonstruksi": this.form.get('kdJenisKonstruksi').value,
      		"kdKategoryAset": this.form.get('kdKategoryAset').value,
      		"kdKelompokAset": this.form.get('kdKelompokAset').value,
      		"kdKondisiProdukAwal": this.form.get('kdKondisiProdukAwal').value,
      		"kdKondisiProdukCurrent": this.form.get('kdKondisiProdukCurrent').value,
      		"kdPegawaiPemilik": this.form.get('kdPegawaiPemilik').value,
      		"kdPegawaiPengguna": this.form.get('kdPegawaiPengguna').value,
      		"kdProduk": this.form.get('kdProduk').value,
      		"kdProdusenProduk": this.form.get('kdProdusenProduk').value,
      		"kdProfilePemilik": this.form.get('kdProfilePemilik').value,
      		"kdRekananPemilik": this.form.get('kdRekananPemilik').value,
      		"kdRuangan": this.form.get('kdRuangan').value,
      		"kdRuanganPosisiCurrent": this.form.get('kdRuanganPosisiCurrent').value,
      		"kdSatuanStandarKapasitas": this.form.get('kdSatuanStandarKapasitas').value,
      		"kdStatusAset": this.form.get('kdStatusAset').value,
      		"kdTransmisi": this.form.get('kdTransmisi').value,
      		"kdTypeProduk": this.form.get('kdTypeProduk').value,
      		"kdWarnaProduk": this.form.get('kdWarnaProduk').value,
      		"keteranganLainnya": this.form.get('keteranganLainnya').value,
      		"lbLebar": this.form.get('lbLebar').value,
      		"lbPanjang": this.form.get('lbPanjang').value,
      		"lbTinggi": this.form.get('lbTinggi').value,
      		"ltLebar": this.form.get('ltLebar').value,
      		"ltPanjang": this.form.get('ltPanjang').value,
      		"luasBangunan": this.form.get('luasBangunan').value,
      		"luasTanah": this.form.get('luasTanah').value,
      		"masaBerlakuGaransi": masaBerlakuGaransiTS,
      		"namaLengkapPegawaiPemilik": this.form.get('namaLengkapPegawaiPemilik').value ,
      		"namaLengkapPegawaiPengguna": this.form.get('namaLengkapPegawaiPengguna').value ,
      		"namaLengkapProfilePemilik": this.form.get('namaLengkapProfilePemilik').value ,
      		"namaModel": this.form.get('namaModel').value ,
      		"namaRekananPemilik": this.form.get('namaRekananPemilik').value ,
      		"namaRuasJalan": this.form.get('namaRuasJalan').value ,
      		"noClosingLast": this.form.get('noClosingLast').value ,
      		"noMesin": this.form.get('noMesin').value ,
      		"noModel": this.form.get('noModel').value ,
      		"noRangka": this.form.get('noRangka').value ,
      		"noRegisterAsetHead": this.form.get('noRegisterAsetHead').value ,
      		"noRegisterAsetInt": this.form.get('noRegisterAsetInt').value ,
      		"noRegistrasiAset": this.form.get('noRegistrasiAset').value ,
      		"noSerial": this.form.get('noSerial').value ,
      		"noStrukText": this.form.get('noStrukText').value ,
      		"qtyLantai": this.form.get('qtyLantai').value ,
      		"qtyProdukAset": this.form.get('qtyProdukAset').value ,
      		"spesifikasiDetail": this.form.get('spesifikasiDetail').value ,
      		"statusEnabled": true ,
      		"tahunProduksiBangun": this.form.get('tahunProduksiBangun').value,
      		"tglRegisterAset": tglRegisterAsetTS,
      		"tglStrukText": tglStrukTextTS,
      		"totalSisaUmurEkonomisTahun": this.form.get('totalSisaUmurEkonomisTahun').value ,
      		"totalSudahBertambah": this.form.get('totalSudahBertambah').value ,
      		"totalSudahMenyusut": this.form.get('totalSudahMenyusut').value ,
      		"umurEkonomisRevaluasiTahun": this.form.get('umurEkonomisRevaluasiTahun').value ,
      		"umurTeknisRevaluasiTahun": this.form.get('umurTeknisRevaluasiTahun').value 
      	}
      }
    //data struktur nomor
    let dataNomor = [];

    for (let i=0; i<this.listDataStrukturNomor.length; i++){
    	if (this.listDataStrukturNomor.length != 0 && this.listDataStrukturNomor[i].kdStrukturNomor.id_kode == null){
    		this.alertService.warn('Peringatan','Pilih Struktur Nomor')
    	}
    	else {
    		dataNomor.push({
    			"kdStrukturNomor": this.listDataStrukturNomor[i].kdStrukturNomor.id_kode,
    			"kodeNomorExternal": this.listDataStrukturNomor[i].kodeNomorExternal,
    			"namaExternal": "",
    			"noHistori": "",
    			"noRegistrasiAset": "",
    			"statusEnabled": true
    		})
    	}
    }

    ///disatuin
    let data = {
    	"asetHistoriDokumen": dataDokumen,
    	"asetHistoriKodeExternal": dataNomor,
    	"registrasiAset": registAset
    }

    console.log(data);

    if (dokError.length != 0){
    	this.alertService.warn('Peringatan', 'Data Dokumen Belum Lengkap')
    } else {
    	this.httpService.update(Configuration.get().dataMaster+'/registrasiAset/update/'+this.versi, data).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');

    		this.get(this.page, this.rows, '');
    		this.reset();
    	}) 
    }
}

simpan3(){
	if (this.formAktif == false){
		this.confirmUpdate();
	}
	else {
   		//data dokumen
   		let dataDokumen= [];
   		let dokError = []

   		for (let i=0; i<this.listDokumenPengajuan.length; i++){
   			let dataDokCreator = [];

   			let cekkdjenisdok = this.listDokumenPengajuan[i].kdJenisDokumen;
   			let z = this.listDokumenPengajuan[i].dokcreator.length;
   			let y = this.listDokumenPengajuan[i].dokcreatorbaru.length;

   			if (this.listDokumenPengajuan.length != 0 && cekkdjenisdok != null){
   				if (z == 0 && y == 0){
   					this.alertService.warn('Peringatan', 'Isi Pemilik Dokumen');
   					dokError.push(i+1);
   				}
   				else {
   					let tglAwalBerlakuTS = this.setTimeStamp(this.listDokumenPengajuan[i].tglAwalBerlaku);
   					let tglAkhirBerlakuTS = this.setTimeStamp(this.listDokumenPengajuan[i].tglAkhirBerlaku);
   					let tglDokumenTS = this.setTimeStamp(this.listDokumenPengajuan[i].tglDokumen);

   					let kdJenisDokumen = this.listDokumenPengajuan[i].kdJenisDokumen.kdJenisDokumen;
   					let namaDokumen = this.listDokumenPengajuan[i].namaDokumen;

   					for (let j=0; j<this.listDokumenPengajuan[i].dokcreator.length; j++){
   						let kdPegawai = this.listDokumenPengajuan[i].dokcreator[j].pegawaiDokCreator.kdPegawai.kdpegawai;
   						let namaLengkap = this.listDokumenPengajuan[i].dokcreator[j].pegawaiDokCreator.namaLengkap;
   						dataDokCreator[j] = {
   							"kdDokumen": null,
   							"kdJenisPetugasPe": null,
   							"kdPegawai": kdPegawai,
   							"keteranganLainnya": "",
   							"namaLengkap": namaLengkap,
   							"statusEnabled": true
   						}
        			// dataDokCreator.push(dataDokCreator[j]);
        		}

        		let m = this.listDokumenPengajuan[i].dokcreator.length;
        		for (let k=0; k<this.listDokumenPengajuan[i].dokcreatorbaru.length; k++){
        			let namaLengkap = this.listDokumenPengajuan[i].dokcreatorbaru[k].pegawaiDokCreatorBaru;
        			dataDokCreator[m+k]={
        				"kdDokumen": null,
        				"kdJenisPetugasPe": null,
        				"kdPegawai": null,
        				"keteranganLainnya": "",
        				"namaLengkap": namaLengkap,
        				"statusEnabled": true
        			}
   						// dataDokCreator.push(dataDokCreator[m+k]);
   					}

   					dataDokumen.push({
   						"deskripsiDokumen": "",
   						"dokCreator": dataDokCreator,
   						"imageFile": "",
   						"isDokumenInOutInt": null,
   						"isiDokumen": "",
   						"kdDokumen": null,
   						"kdJenisDokumen": kdJenisDokumen,
   						"kdJenisSertifikat": null,
   						"kdKategoryDokumen": null,
   						"keteranganLainnya": "",
   						"namaDokumen": namaDokumen,
   						"noHistori": "",
   						"noRegistrasiAset": "",
   						"noVerifikasi": "",
   						"pathFile": this.listDokumenPengajuan[i].pathFile,
   						"qtyLampiran": null,
   						"statusEnabled": this.listDokumenPengajuan[i].statusEnabled,
   						"tglAwalBerlaku": tglAwalBerlakuTS,
   						"tglAkhirBerlaku": tglAkhirBerlakuTS,
   						"tglDokumen": tglDokumenTS,
   					})
   				}
   			}
   			else {

   				this.alertService.warn('Peringatan','Pilih Jenis Dokumen');
   				dokError.push(i+1);
   			}	


   		}

      //data registrasi aset
      let masaBerlakuGaransiTS = this.setTimeStamp(this.form.get('masaBerlakuGaransi').value);
      let tglRegisterAsetTS = this.setTimeStamp(this.form.get('tglRegisterAset').value);
      let tglStrukTextTS = this.setTimeStamp(this.form.get('tglStrukText').value);

      let kdalamat = this.form.get('kdAlamat').value;
      let registAset;

      if(kdalamat == null){
      	registAset = {
      		"dataAlamatDto" : {
      			"alamatEmail": "",
      			"alamatLengkap": this.form.get('alamatLengkap').value,
      			"blackBerry": "",
      			"desaKelurahan": "",
      			"facebook": "",
      			"faksimile1": "",
      			"faksimile2": "",
      			"fixedPhone1": "",
      			"fixedPhone2": "",
      			"garisBujurLongitude": 0,
      			"garisLintangLatitude": 0,
      			"isBillingAddress": 0,
      			"isPrimaryAddress": 0,
      			"isShippingAddress": 0,
      			"kdDepartemen": "",
      			"kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
      			"kdJenisAlamat": this.form.get('kdJenisAlamat').value,
      			"kdKecamatan": this.form.get('kdKecamatan').value,
      			"kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
      			"kdNegara": this.form.get('kdNegara').value,
      			"kdProfile": 0,
      			"kdPropinsi": this.form.get('kdPropinsi').value,
      			"kecamatan": "",
      			"kode": 0,
      			"kodePos": this.form.get('kodePos').value,
      			"kotaKabupaten": "",
      			"line": "",
      			"mobilePhone1": "",
      			"mobilePhone2": "",
      			"namaTempatGedung": "",
      			"rtrw": this.form.get('rtrw').value,
      			"statusEnabled": true,
      			"twitter": "",
      			"website": "",
      			"whatsApp": "",
      			"yahooMessenger": "",
      		},
      		"fungsiKegunaan": this.form.get('fungsiKegunaan').value,
      		"hargaNetto": this.form.get('hargaNetto').value,
      		"hargaPenyusutan": this.form.get('hargaPenyusutan').value,
      		"hargaPertambahan": this.form.get('hargaPertambahan').value,
      		"hargaSatuanRevaluasi": this.form.get('hargaSatuanRevaluasi').value,
      		"kapasitas": this.form.get('kapasitas').value,
      		"kdAlamat": this.form.get('kdAlamat').value,
      		"kdAsalProduk": this.form.get('kdAsalProduk').value,
      		"kdBahanProduk": this.form.get('kdBahanProduk').value,
      		"kdJenisKonstruksi": this.form.get('kdJenisKonstruksi').value,
      		"kdKategoryAset": this.form.get('kdKategoryAset').value,
      		"kdKelompokAset": this.form.get('kdKelompokAset').value,
      		"kdKondisiProdukAwal": this.form.get('kdKondisiProdukAwal').value,
      		"kdKondisiProdukCurrent": this.form.get('kdKondisiProdukCurrent').value,
      		"kdPegawaiPemilik": this.form.get('kdPegawaiPemilik').value,
      		"kdPegawaiPengguna": this.form.get('kdPegawaiPengguna').value,
      		"kdProduk": this.form.get('kdProduk').value,
      		"kdProdusenProduk": this.form.get('kdProdusenProduk').value,
      		"kdProfilePemilik": this.form.get('kdProfilePemilik').value,
      		"kdRekananPemilik": this.form.get('kdRekananPemilik').value,
      		"kdRuangan": this.form.get('kdRuangan').value,
      		"kdRuanganPosisiCurrent": this.form.get('kdRuanganPosisiCurrent').value,
      		"kdSatuanStandarKapasitas": this.form.get('kdSatuanStandarKapasitas').value,
      		"kdStatusAset": this.form.get('kdStatusAset').value,
      		"kdTransmisi": this.form.get('kdTransmisi').value,
      		"kdTypeProduk": this.form.get('kdTypeProduk').value,
      		"kdWarnaProduk": this.form.get('kdWarnaProduk').value,
      		"keteranganLainnya": this.form.get('keteranganLainnya').value,
      		"lbLebar": this.form.get('lbLebar').value,
      		"lbPanjang": this.form.get('lbPanjang').value,
      		"lbTinggi": this.form.get('lbTinggi').value,
      		"ltLebar": this.form.get('ltLebar').value,
      		"ltPanjang": this.form.get('ltPanjang').value,
      		"luasBangunan": this.form.get('luasBangunan').value,
      		"luasTanah": this.form.get('luasTanah').value,
      		"masaBerlakuGaransi": masaBerlakuGaransiTS,
      		"namaLengkapPegawaiPemilik": this.form.get('namaLengkapPegawaiPemilik').value ,
      		"namaLengkapPegawaiPengguna": this.form.get('namaLengkapPegawaiPengguna').value ,
      		"namaLengkapProfilePemilik": this.form.get('namaLengkapProfilePemilik').value ,
      		"namaModel": this.form.get('namaModel').value ,
      		"namaRekananPemilik": this.form.get('namaRekananPemilik').value ,
      		"namaRuasJalan": this.form.get('namaRuasJalan').value ,
      		"noClosingLast": this.form.get('noClosingLast').value ,
      		"noMesin": this.form.get('noMesin').value ,
      		"noModel": this.form.get('noModel').value ,
      		"noRangka": this.form.get('noRangka').value ,
      		"noRegisterAsetHead": this.form.get('noRegisterAsetHead').value ,
      		"noRegisterAsetInt": this.form.get('noRegisterAsetInt').value ,
      		"noRegistrasiAset": this.form.get('noRegistrasiAset').value ,
      		"noSerial": this.form.get('noSerial').value ,
      		"noStrukText": this.form.get('noStrukText').value ,
      		"qtyLantai": this.form.get('qtyLantai').value ,
      		"qtyProdukAset": this.form.get('qtyProdukAset').value ,
      		"spesifikasiDetail": this.form.get('spesifikasiDetail').value ,
      		"statusEnabled": true ,
      		"tahunProduksiBangun": this.form.get('tahunProduksiBangun').value,
      		"tglRegisterAset": tglRegisterAsetTS,
      		"tglStrukText": tglStrukTextTS,
      		"totalSisaUmurEkonomisTahun": this.form.get('totalSisaUmurEkonomisTahun').value ,
      		"totalSudahBertambah": this.form.get('totalSudahBertambah').value ,
      		"totalSudahMenyusut": this.form.get('totalSudahMenyusut').value ,
      		"umurEkonomisRevaluasiTahun": this.form.get('umurEkonomisRevaluasiTahun').value ,
      		"umurTeknisRevaluasiTahun": this.form.get('umurTeknisRevaluasiTahun').value 
      	}
      }
      else {
      	registAset = {
      		"dataAlamatDto" : {
      			// "alamatEmail": "",
      			// "alamatLengkap": this.form.get('alamatLengkap').value,
      			// "blackBerry": "",
      			// "desaKelurahan": "",
      			// "facebook": "",
      			// "faksimile1": "",
      			// "faksimile2": "",
      			// "fixedPhone1": "",
      			// "fixedPhone2": "",
      			// "garisBujurLongitude": 0,
      			// "garisLintangLatitude": 0,
      			// "isBillingAddress": 0,
      			// "isPrimaryAddress": 0,
      			// "isShippingAddress": 0,
      			// "kdDepartemen": "",
      			// "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
      			// "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
      			// "kdKecamatan": this.form.get('kdKecamatan').value,
      			// "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
      			// "kdNegara": this.form.get('kdNegara').value,
      			// "kdProfile": 0,
      			// "kdPropinsi": this.form.get('kdPropinsi').value,
      			// "kecamatan": "",
      			// "kode": 0,
      			// "kodePos": this.form.get('kodePos').value,
      			// "kotaKabupaten": "",
      			// "line": "",
      			// "mobilePhone1": "",
      			// "mobilePhone2": "",
      			// "namaTempatGedung": "",
      			// "rtrw": this.form.get('rtrw').value,
      			// "statusEnabled": true,
      			// "twitter": "",
      			// "website": "",
      			// "whatsApp": "",
      			// "yahooMessenger": "",
      		},
      		"fungsiKegunaan": this.form.get('fungsiKegunaan').value,
      		"hargaNetto": this.form.get('hargaNetto').value,
      		"hargaPenyusutan": this.form.get('hargaPenyusutan').value,
      		"hargaPertambahan": this.form.get('hargaPertambahan').value,
      		"hargaSatuanRevaluasi": this.form.get('hargaSatuanRevaluasi').value,
      		"kapasitas": this.form.get('kapasitas').value,
      		"kdAlamat": this.form.get('kdAlamat').value,
      		"kdAsalProduk": this.form.get('kdAsalProduk').value,
      		"kdBahanProduk": this.form.get('kdBahanProduk').value,
      		"kdJenisKonstruksi": this.form.get('kdJenisKonstruksi').value,
      		"kdKategoryAset": this.form.get('kdKategoryAset').value,
      		"kdKelompokAset": this.form.get('kdKelompokAset').value,
      		"kdKondisiProdukAwal": this.form.get('kdKondisiProdukAwal').value,
      		"kdKondisiProdukCurrent": this.form.get('kdKondisiProdukCurrent').value,
      		"kdPegawaiPemilik": this.form.get('kdPegawaiPemilik').value,
      		"kdPegawaiPengguna": this.form.get('kdPegawaiPengguna').value,
      		"kdProduk": this.form.get('kdProduk').value,
      		"kdProdusenProduk": this.form.get('kdProdusenProduk').value,
      		"kdProfilePemilik": this.form.get('kdProfilePemilik').value,
      		"kdRekananPemilik": this.form.get('kdRekananPemilik').value,
      		"kdRuangan": this.form.get('kdRuangan').value,
      		"kdRuanganPosisiCurrent": this.form.get('kdRuanganPosisiCurrent').value,
      		"kdSatuanStandarKapasitas": this.form.get('kdSatuanStandarKapasitas').value,
      		"kdStatusAset": this.form.get('kdStatusAset').value,
      		"kdTransmisi": this.form.get('kdTransmisi').value,
      		"kdTypeProduk": this.form.get('kdTypeProduk').value,
      		"kdWarnaProduk": this.form.get('kdWarnaProduk').value,
      		"keteranganLainnya": this.form.get('keteranganLainnya').value,
      		"lbLebar": this.form.get('lbLebar').value,
      		"lbPanjang": this.form.get('lbPanjang').value,
      		"lbTinggi": this.form.get('lbTinggi').value,
      		"ltLebar": this.form.get('ltLebar').value,
      		"ltPanjang": this.form.get('ltPanjang').value,
      		"luasBangunan": this.form.get('luasBangunan').value,
      		"luasTanah": this.form.get('luasTanah').value,
      		"masaBerlakuGaransi": masaBerlakuGaransiTS,
      		"namaLengkapPegawaiPemilik": this.form.get('namaLengkapPegawaiPemilik').value ,
      		"namaLengkapPegawaiPengguna": this.form.get('namaLengkapPegawaiPengguna').value ,
      		"namaLengkapProfilePemilik": this.form.get('namaLengkapProfilePemilik').value ,
      		"namaModel": this.form.get('namaModel').value ,
      		"namaRekananPemilik": this.form.get('namaRekananPemilik').value ,
      		"namaRuasJalan": this.form.get('namaRuasJalan').value ,
      		"noClosingLast": this.form.get('noClosingLast').value ,
      		"noMesin": this.form.get('noMesin').value ,
      		"noModel": this.form.get('noModel').value ,
      		"noRangka": this.form.get('noRangka').value ,
      		"noRegisterAsetHead": this.form.get('noRegisterAsetHead').value ,
      		"noRegisterAsetInt": this.form.get('noRegisterAsetInt').value ,
      		"noRegistrasiAset": this.form.get('noRegistrasiAset').value ,
      		"noSerial": this.form.get('noSerial').value ,
      		"noStrukText": this.form.get('noStrukText').value ,
      		"qtyLantai": this.form.get('qtyLantai').value ,
      		"qtyProdukAset": this.form.get('qtyProdukAset').value ,
      		"spesifikasiDetail": this.form.get('spesifikasiDetail').value ,
      		"statusEnabled": true ,
      		"tahunProduksiBangun": this.form.get('tahunProduksiBangun').value,
      		"tglRegisterAset": tglRegisterAsetTS,
      		"tglStrukText": tglStrukTextTS,
      		"totalSisaUmurEkonomisTahun": this.form.get('totalSisaUmurEkonomisTahun').value ,
      		"totalSudahBertambah": this.form.get('totalSudahBertambah').value ,
      		"totalSudahMenyusut": this.form.get('totalSudahMenyusut').value ,
      		"umurEkonomisRevaluasiTahun": this.form.get('umurEkonomisRevaluasiTahun').value ,
      		"umurTeknisRevaluasiTahun": this.form.get('umurTeknisRevaluasiTahun').value 
      	}
      }

      //data struktur nomor
      let dataNomor = [];

      for (let i=0; i<this.listDataStrukturNomor.length; i++){
      	if (this.listDataStrukturNomor.length != 0 && this.listDataStrukturNomor[i].kdStrukturNomor.id_kode == null){
      		this.alertService.warn('Peringatan','Pilih Struktur Nomor')
      	}
      	else {
      		dataNomor.push({
      			"kdStrukturNomor": this.listDataStrukturNomor[i].kdStrukturNomor.id_kode,
      			"kodeNomorExternal": this.listDataStrukturNomor[i].kodeNomorExternal,
      			"namaExternal": "",
      			"noHistori": "",
      			"noRegistrasiAset": "",
      			"statusEnabled": true
      		})
      	}
      }

      ///disatuin
      let data = {
      	"asetHistoriDokumen": dataDokumen,
      	"asetHistoriKodeExternal": dataNomor,
      	"registrasiAset": registAset
      }

      console.log(data);

      if (dokError.length != 0){
      	this.alertService.warn('Peringatan', 'Data Dokumen Belum Lengkap')
      } else {
      	this.httpService.post(Configuration.get().dataMaster+'/registrasiAset/save', data).subscribe(response => {
      		this.alertService.success('Berhasil', 'Data Disimpan');
      		this.get(this.page, this.rows, '');
      		this.reset();
      	})
      }
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

reset() {
	this.formAktif = true;
	this.ngOnInit();
}

onRowSelect(event) {
	this.tambahAlamat = false;
	let cloned = this.clone(event.data);
	this.keynoreg = event.data.noRegistrasiAset;
	this.formAktif = false;
	this.form.setValue(cloned);
	this.getGridStrukturNomor(event);
	this.getGridDokumen(event);
	this.blkpemilik();

	// let noMesin = this.form.get('noMesin').value;
	// let noRangka = this.form.get('noRangka').value;
	// let kdTransmisi = this.form.get('kdTransmisi').value;
	// if (noMesin != null || noRangka != null || kdTransmisi != null || noMesin != "" || noRangka != "" || kdTransmisi != ""){
	// 	this.cekPnlKendaraan = false
	// }
	// else {
	// 	this.cekPnlKendaraan = true;
	// }

	// let kdAlamat = this.form.get('kdAlamat').value;
	// let namaRuasJalan = this.form.get('namaRuasJalan').value;
	// let fungsiKegunaan = this.form.get('fungsiKegunaan').value;
	// let kdJenisKonstruksi = this.form.get('kdJenisKonstruksi').value;
	// let luasTanah = this.form.get('luasTanah').value;
	// let ltPanjang = this.form.get('ltPanjang').value;
	// let ltLebar = this.form.get('ltLebar').value;
	// let qtyLantai = this.form.get('qtyLantai').value;
	// let luasBangunan = this.form.get('luasBangunan').value;
	// let lbPanjang = this.form.get('lbPanjang').value;
	// let lbLebar = this.form.get('lbLebar').value;
	// let lbTinggi = this.form.get('lbTinggi').value;
	// if (kdAlamat !=null || namaRuasJalan != null || fungsiKegunaan != null || kdJenisKonstruksi != null || luasTanah !=null || ltPanjang != null || ltLebar != null || qtyLantai != null || luasBangunan != null || lbPanjang !=null || lbLebar != null || lbTinggi != null){
	// 	this.cekPnlTanah = false;
	// }
	// else {
	// 	this.cekPnlTanah = true;
	// }
}

getGridStrukturNomor(a){
	this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findByKode?noRegistrasi='+a.data.noRegistrasiAset).subscribe(table => {
		this.strukturno = table.data.asetHistoriKodeExternal;
		let strukturno = this.strukturno;
		this.listDataStrukturNomor = [];
		let dataFix;
		for ( let i=0; i<strukturno.length; i++){
			dataFix = {
				"kodeNomorExternal": strukturno[i].kodeNomorExternal,
				"kdStrukturNomor": {
					"id_kode": strukturno[i].kode.kdStrukturNomor,
					"namaStrukturNomor": strukturno[i].namaStrukturNomor
				}
			}
			this.listDataStrukturNomor.push(dataFix);
		}
	});
}

getGridDokumen(a){
	let noreg = a.data.noRegistrasiAset;
	this.httpService.get(Configuration.get().dataMaster + '/registrasiAset/findByKode?noRegistrasi='+noreg).subscribe(table =>{
		this.dok = table.data.asetHistoriDokumen;
		let dok = this.dok;
		this.listDokumenPengajuan = [];
		let dataFix;
		for ( let i=0; i< dok.length; i++){
			let kode = dok[i].kdJenisDokumen
			dataFix = {
				"namaJudulDokumen": dok[i].namaDokumen,
				"namaDokumen": dok[i].namaDokumen,
				"kdJenisDokumen": {
					"namaJenisDokumen": dok[i].namaJenisDokumen,
					"kdJenisDokumen": kode
				},
				"kdDokumen": dok[i].kdDokumen,
				"kdKategoryDokumen": dok[i].kdKategoryDokumen,
				"tglDokumen": dok[i].tglDokumen*1000,
				"tglAwalBerlaku": dok[i].tglAwalBerlaku*1000,
				"tglAkhirBerlaku": dok[i].tglAkhirBerlaku*1000,
				"pathFile": dok[i].pathFile,
				"reportDisplay": dok[i].reportDisplay,
				"dokcreator": [],
				"dokcreatorbaru": [],
				"statusEnabled": dok[i].statusEnabled
			}

			for (let j=0; j<dok[i].dokCreator.length; j++){
				if (dok[i].dokCreator[j].kdPegawai == null){
					let detailCreatorBaru = {
						"namaLengkap": dok[i].dokCreator[j].namaLengkap
					}
					dataFix.dokcreatorbaru.push(detailCreatorBaru)
				} else {
					let detailCreator = {
						"pegawaiDokCreator": {
							"namaLengkap": dok[i].dokCreator[j].namaLengkap,
							"kdPegawai": {
								"kdpegawai": dok[i].dokCreator[j].kdPegawai,
								"namaLengkap": dok[i].dokCreator[j].namaLengkap
							},
							"statusEnabled": dok[i].dokCreator[j].statusEnabled
						}
					}
					dataFix.dokcreator.push(detailCreator)
				}
			}
			this.listDokumenPengajuan.push(dataFix);   
		}
	});
}


clone(hub: any) {
 
	let fixHub = {

		// "dataAlamatDto" : {
			// "alamatEmail": hub.alamatEmail,
			"alamatLengkap": null,
			// "blackBerry": hub.blackBerry,
			// "desaKelurahan": hub.desaKelurahan,
			// "facebook": hub.facebook,
			// "faksimile1": hub.faksimile1,
			// "faksimile2": hub.faksimile2,
			// "fixedPhone1": hub.fixedPhone1,
			// "fixedPhone2": hub.fixedPhone2,
			// "garisBujurLongitude": hub.garisBujurLongitude,
			// "garisLintangLatitude": hub.garisLintangLatitude,
			// "isBillingAddress": hub.isBillingAddress,
			// "isPrimaryAddress": hub.isPrimaryAddress,
			// "isShippingAddress": hub.isShippingAddress,
			// "kdDepartemen": hub.kdDepartemen,
			"kdDesaKelurahan": null,
			"kdJenisAlamat": null,
			"kdKecamatan": null,
			"kdKotaKabupaten": null,
			"kdNegara": null,
			// "kdProfile": null,
			"kdPropinsi": null,
			// "kecamatan": hub.kecamatan,
			// "kode": hub.kode,
			"kodePos": "",
			// "kotaKabupaten": hub.kotaKabupaten,
			// "line": hub.line,
			// "mobilePhone1": hub.mobilePhone1,
			// "mobilePhone2": hub.mobilePhone2,
			// "namaTempatGedung": hub.namaTempatGedung,
			"rtrw": null,
			// "statusEnabled": hub.statusEnabled,
			// "twitter": hub.twitter,
			// "website": hub.website,
			// "whatsApp": hub.whatsApp,
			// "yahooMessenger": hub.yahooMessenger,
		// },
		"fungsiKegunaan": hub.fungsiKegunaan,
		"hargaNetto": hub.hargaNetto,
		"hargaPenyusutan": hub.hargaPenyusutan,
		"hargaPertambahan": hub.hargaPertambahan,
		"hargaSatuanRevaluasi": hub.hargaSatuanRevaluasi,
		"kapasitas": hub.kapasitas,
		"kdAlamat": hub.kdAlamat,
		"kdAsalProduk": hub.kdAsalProduk,
		"kdBahanProduk": hub.kdBahanProduk,
		"kdJenisKonstruksi": hub.kdJenisKonstruksi,
		"kdKategoryAset": hub.kdKategoryAset,
		"kdKelompokAset": hub.kdKelompokAset,
		"kdKondisiProdukAwal": hub.kdKondisiProdukAwal,
		"kdKondisiProdukCurrent": hub.kdKondisiProdukCurrent,
		"kdPegawaiPemilik": hub.kdPegawaiPemilik,
		"kdPegawaiPengguna": hub.kdPegawaiPengguna,
		"kdProduk": hub.kdProduk,
		"kdProdusenProduk": hub.produsenProdukId,
		"kdProfilePemilik": hub.kdProfilePemilik,
		"kdRekananPemilik": hub.kdRekananPemilik,
		"kdRuangan": hub.kdRuangan,
		"kdRuanganPosisiCurrent": hub.kdRuanganPosisiCurrent,
		"kdSatuanStandarKapasitas": hub.kdSatuanStandarKapasitas,
		"kdStatusAset": hub.kdStatusAset,
		"kdTransmisi": hub.kdTransmisi,
		"kdTypeProduk": hub.typeProdukId,
		"kdWarnaProduk": hub.kdWarnaProduk,
		"keteranganLainnya": hub.keteranganLainnya,
		"lbLebar": hub.lbLebar,
		"lbPanjang": hub.lbPanjang,
		"lbTinggi": hub.lbTinggi,
		"ltLebar": hub.ltLebar,
		"ltPanjang": hub.ltPanjang,
		"luasBangunan": hub.luasBangunan,
		"luasTanah": hub.luasTanah,
		"masaBerlakuGaransi": new Date(hub.masaBerlakuGaransi*1000),
		"namaLengkapPegawaiPemilik": hub.namaLengkapPegawaiPemilik,
		"namaLengkapPegawaiPengguna": hub.namaLengkapPegawaiPengguna,
		"namaLengkapProfilePemilik": hub.namaLengkapProfilePemilik,
		"namaModel": hub.namaModel,
		"namaRekananPemilik": hub.namaRekananPemilik,
		"namaRuasJalan": hub.namaRuasJalan,
		"noClosingLast": hub.noClosingLast,
		"noMesin": hub.noMesin,
		"noModel": hub.noModel,
		"noRangka": hub.noRangka,
		"noRegistrasiAset": hub.noRegistrasiAset,
		"noRegisterAsetHead": hub.noRegisterAsetHead,
		"noRegisterAsetInt": hub.noRegisterAsetInt,
		"noSerial": hub.noSerial,
		"noStrukText": hub.noStrukText,
		"qtyLantai": hub.qtyLantai,
		"qtyProdukAset": hub.qtyProdukAset,
		"spesifikasiDetail": hub.spesifikasiDetail,
		"statusEnabled": true,
		"tahunProduksiBangun": hub.tahunProduksiBangun,
		"tglRegisterAset": new Date(hub.tglRegisterAset*1000),     
		"tglStrukText": new Date(hub.tglStrukText*1000), 
		"totalSisaUmurEkonomisTahun": hub.totalSisaUmurEkonomisTahun,
		"totalSudahBertambah": hub.totalSudahBertambah,
		"totalSudahMenyusut": hub.totalSudahMenyusut,
		"umurEkonomisRevaluasiTahun": hub.umurEkonomisRevaluasiTahun,
		"umurTeknisRevaluasiTahun": hub.umurTeknisRevaluasiTahun
	}
	this.versi =1;
	return fixHub;
}

hapus() {
	let item = [...this.listData];
	let deleteItem = item[this.findSelectedIndex()];
	this.httpService.delete(Configuration.get().dataMaster + '/registrasiAset/del?kode=' + deleteItem.noRegistrasiAset).subscribe(response => {
		this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
		this.get(this.page, this.rows, this.pencarian);
	});
	this.reset();
}

findSelectedIndex(): number {
	return this.listData.indexOf(this.selected);
}

onDestroy() {

}

close() {
	this.dialogPreviewDokumen = false;
	this.dialogPreviewImage = false;
}

      ///////

      tambahDokCreatorBaru(index){
      	this.listDokumenPengajuan[index].dokcreatorbaru;

      	if (this.listDokumenPengajuan[index].dokcreatorbaru.length == 0){
      		let dataTempDC = {
      			"namaLengkap":null,
              /*"pegawaiDokCreatorBaru": {
                
                "namaLengkap": "--Masukkan Pegawai Baru--",
                "kdPegawai": {
                  "kdpegawai": 0,
                  "namaLengkap": null
                }
            }*/
        }
        let listDokumenCreatorBaru = [...this.listDokumenPengajuan[index].dokcreatorbaru];
        listDokumenCreatorBaru.push(dataTempDC);
        this.listDokumenPengajuan[index].dokcreatorbaru = listDokumenCreatorBaru;
    }
    else {
    	let last = this.listDokumenPengajuan[index].dokcreatorbaru.length - 1;
    	if (this.listDokumenPengajuan[index].dokcreatorbaru[last] == null){
    		this.alertService.warn('Peringatan', 'Isi Nama Pegawai');
    	}
    	else{
    		let dataTempDC = {
    			"namaLengkap":null,
                /*"pegawaiDokCreatorBaru": {
                  
                  "namaLengkap": "--Masukkan Pegawai Baru--",
                  "kdPegawai": {
                    "kdpegawai": 0,
                    "namaLengkap": null
                  }
              }*/
          }
          let listDokumenCreatorBaru = [...this.listDokumenPengajuan[index].dokcreatorbaru];
          listDokumenCreatorBaru.push(dataTempDC);
          this.listDokumenPengajuan[index].dokcreatorbaru = listDokumenCreatorBaru;
      }
  }
}


tambahDokCreator(index){
	this.listDokumenPengajuan[index].listPegawaiDokCreator;
	this.listDokumenPengajuan[index].dokcreator;

	if (this.listDokumenPengajuan[index].dokcreator.length == 0){
		let dataTempDC = {
			"pegawaiDokCreator": {
				"namaLengkap": "--Pilih Dok Creator--",
				"statusInput": 0,
				"kdPegawai": {
					"kdpegawai": null,
					"namaLengkap": null
				},
				"statusEnabled": true
			}
		}

		let listDokumenCreator = [...this.listDokumenPengajuan[index].dokcreator];
		listDokumenCreator.push(dataTempDC);
		this.listDokumenPengajuan[index].dokcreator = listDokumenCreator;
	}
	else {
          // let last =  this.listDokumenPengajuan[index].dokcreator.length -1;
          // if (this.listDokumenPengajuan[index].dokcreator[last].pegawaiDokCreator.kdpegawai ==null){
          //   this.alertService.warn('Peringatan', 'Pilih Pegawai')
          // }
          // else{
            //   for (let i=0; i<this.listDokumenPengajuan[index].dokcreator.length; i++){
            //    if (this.listDokumenPengajuan[index].dokcreator[i] == this.listDokumenPengajuan[index].dokcreator[last]){
            //     this.listDokumenPengajuan[index].dokcreator.splice(i,1);
            //   }
            // }
            let dataTempDC = {
            	"pegawaiDokCreator": {
            		"namaLengkap": "--Pilih Dok Creator--",
            		"statusInput": 0,
            		"kdPegawai": {
            			"kdpegawai": null,
            			"namaLengkap": null
            		},
            		"statusEnabled": true
            	}
            }
            let listDokumenCreator = [...this.listDokumenPengajuan[index].dokcreator];
            listDokumenCreator.push(dataTempDC);
            this.listDokumenPengajuan[index].dokcreator = listDokumenCreator
          // }
      }
  }

  tambahDokumen() {
  	if (this.listDokumenPengajuan.length ==0){
  		let dataTemp = {
  			"namaJudulDokumen": "",
  			"noDokumen": null,
  			"kdJenisDokumen": {
  				"namaJenisDokumen": '--Pilih Jenis Dokumen--',
  				"kdJenisDokumen": null
  			},
  			"kdDokumen": null,
  			"kdKategoryDokumen": null,
  			"tglDokumen": null,
  			"tglAwalBerlaku": null,
  			"tglAkhirBerlaku": null,
  			"pathFile": null,
  			"reportDisplay": "",
  			"dokcreator": [],
  			"dokcreatorbaru":[],
  			"statusEnabled": true
  		}
  		let listDokumenPengajuan = [...this.listDokumenPengajuan];
  		listDokumenPengajuan.push(dataTemp);
  		this.listDokumenPengajuan = listDokumenPengajuan;
  	}
  	else {
  		let last = this.listDokumenPengajuan.length -1;
  		if (this.listDokumenPengajuan[last].kdJenisDokumen.kdJenisDokumen == null){
  			this.alertService.warn('Peringatan','Lengkapi Data Dokumen');
  		}
  		else {
  			let dataTemp = {
  				"namaJudulDokumen": "",
  				"noDokumen": null,
  				"kdJenisDokumen": {
  					"namaJenisDokumen": '--Pilih Jenis Dokumen--',
  					"kdJenisDokumen": null
  				},
  				"kdDokumen": null,
  				"kdKategoryDokumen": null,
  				"pathFile": null,
  				"reportDisplay": "",
  				"dokcreator": [],
  				"dokcreatorbaru":[],
  				"statusEnabled": true,
  			}
  			let listDokumenPengajuan = [...this.listDokumenPengajuan];
  			listDokumenPengajuan.push(dataTemp);
  			this.listDokumenPengajuan = listDokumenPengajuan;
  		}
  	}
  }

  tambahStrukturNomor() {
  	if (this.listDataStrukturNomor.length == 0){
  		let dataTemp = {
  			"kodeNomorExternal": '',
  			"kdStrukturNomor": {
  				"id_kode": null,
  				"namaStrukturNomor": '--Pilih Struktur Nomor--'
  			}
  		}

  		let listDataStrukturNomor = [...this.listDataStrukturNomor];
  		listDataStrukturNomor.push(dataTemp);
  		this.listDataStrukturNomor = listDataStrukturNomor;
  	}
  	else {
  		let last = this.listDataStrukturNomor.length -1;
  		if (this.listDataStrukturNomor[last].kdStrukturNomor.id_kode == null){
  			this.alertService.warn('Peringatan','Lengkapi Data Struktur Nomor')
  		}
  		else {
  			let dataTemp = {
  				"kodeNomorExternal": '',
  				"kdStrukturNomor": {
  					"id_kode": null,
  					"namaStrukturNomor": '--Pilih Struktur Nomor--'
  				}
  			}

  			let listDataStrukturNomor = [...this.listDataStrukturNomor];
  			listDataStrukturNomor.push(dataTemp);
  			this.listDataStrukturNomor = listDataStrukturNomor;
  		}
  	}
  }

  hapusDokumen(row) {
  	let listDokumenPengajuan = [...this.listDokumenPengajuan];
  	listDokumenPengajuan.splice(row, 1);
  	this.listDokumenPengajuan = listDokumenPengajuan;
  }

  hapusDokCreator(row, i){
  	this.listDokumenPengajuan[i].dokcreator[row].statusEnabled = false;

  	let listDokumenPengajuan = [...this.listDokumenPengajuan[i].dokcreator];
  	listDokumenPengajuan.splice(row,1);
  	this.listDokumenPengajuan[i].dokcreator = listDokumenPengajuan;
  }

  hapusDokCreatorBaru(row, i){
  	let listDokumenPengajuan = [...this.listDokumenPengajuan[i].dokcreatorbaru];
  	listDokumenPengajuan.splice(row,1);
  	this.listDokumenPengajuan[i].dokcreatorbaru = listDokumenPengajuan;
  }

  hapusStrukturNomor(row){
  	let listDataStrukturNomor = [...this.listDataStrukturNomor];
  	listDataStrukturNomor.splice(row, 1);
  	this.listDataStrukturNomor = listDataStrukturNomor;
  }

  clickReview(pathFile, i) {
  	if (pathFile.search(".pdf") > 0) {
		this.dialogPreviewImage = false;
		this.smbrFile = Configuration.get().resourceFile + '/file/download/' + pathFile + '?download=false';
		this.httpService.getPreview(this.smbrFile,'preview')
		this.dialogPreviewDokumen = true;
  	} else if (pathFile.search(/.jpg/i) > 0 || pathFile.search(/.png/i) > 0 || pathFile.search(/.jpeg/i) > 0) {
		this.dialogPreviewDokumen = false;
		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + pathFile;
  		this.dialogPreviewImage = true;
  	} else {
		this.dialogPreviewImage = false;
		this.dialogPreviewDokumen = false;
		this.smbrFile = Configuration.get().resourceFile + '/file/download/' + pathFile;
  		this.httpService.getFileDownload(this.smbrFile);
  	}
  }

  findSelectedDokumenIndex(): number {
  	return this.listDokumenPengajuan.indexOf(this.selectedDokumen);
  }
  onDokumenUpload(event) {
  	this.demo.dokumen = JSON.parse(event.xhr.response).data.name;
  	this.dokumenUrl = "http://192.168.0.253:9191/image/show/" + this.demo.dokumen;
  	for (let file of event.files) {
  		this.dokumenFiles.push(file);
  	}
  }

  onUpload(event) {
  	for (let file of event.files) {
  		this.uploadedFiles.push(file);
  	}
  	this.msgs = [];
  	this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  urlUpload() {
  	return Configuration.get().resourceFile + '/file/upload';
  }

  fileUpload(event, i) {
  	let listDokumenPengajuan = [... this.listDokumenPengajuan];
  	listDokumenPengajuan[i].pathFile = event.xhr.response;
  	this.listDokumenPengajuan = listDokumenPengajuan;
  }

  addHeader(event) {
  	this.buttonAktif = false;
  	this.httpService.beforeUploadFile(event);
  }

  namadok(index,data){
  	let listDokumenPengajuan = [...this.listDokumenPengajuan];
  	listDokumenPengajuan[index].namaDokumen = data.namaJenisDokumen;
  	this.listDokumenPengajuan = listDokumenPengajuan;
  }

  blckpegawairekanan(event){
  	if (event.value != null){
  		this.blkpegawaipemilik=true;
  		this.blkrekananpemilik=true;
  		this.form.get('kdPegawaiPemilik').setValue(null);
  		this.form.get('kdRekananPemilik').setValue(null);
  	}
  	else {
  		this.blkprofilepemilik=false;
  		this.blkpegawaipemilik=false;
  		this.blkrekananpemilik=false;
  	}
  }

  blkprofilerekanan(event){
  	if (event.value != null){
  		this.blkprofilepemilik = true;
  		this.blkrekananpemilik = true;
  		this.form.get('kdProfilePemilik').setValue(null);
  		this.form.get('kdRekananPemilik').setValue(null);
  	}
  	else {
  		this.blkprofilepemilik=false;
  		this.blkpegawaipemilik=false;
  		this.blkrekananpemilik=false;
  	}
  }

  blkprofilepegawai(event){
  	if (event.value != null){
  		this.blkprofilepemilik = true;
  		this.blkpegawaipemilik = true;
  		this.form.get('kdPegawaiPemilik').setValue(null);
  		this.form.get('kdProfilePemilik').setValue(null);
  	}
  	else {
  		this.blkprofilepemilik=false;
  		this.blkpegawaipemilik=false;
  		this.blkrekananpemilik=false;
  	}
  }

  defaultPegawaiPemilikPengguna(event){
  	let pengguna = event.value;
  	this.form.get('kdPegawaiPengguna').setValue(pengguna);
  }

  statKepemilikan(event){
  	let statuspemilik = event.value

  	if (statuspemilik == this.kdStatusPemilikProfile){
  		this.form.get('kdProfilePemilik').enable();
  		this.form.get('kdPegawaiPengguna').setValue(null);
  		this.form.get('kdPegawaiPemilik').disable();
  		this.form.get('kdPegawaiPemilik').setValue(null);
  		this.form.get('kdRekananPemilik').disable();
  		this.form.get('kdRekananPemilik').setValue(null);
  	}
  	else if (statuspemilik == this.kdStatusPemilikPegawai) {
  		this.form.get('kdPegawaiPemilik').enable();
  		this.form.get('kdProfilePemilik').disable();
  		this.form.get('kdProfilePemilik').setValue(null);
  		this.form.get('kdRekananPemilik').disable();
  		this.form.get('kdRekananPemilik').setValue(null);
  	}
  	else if (statuspemilik == this.kdStatusPemilikRekanan){
  		this.form.get('kdRekananPemilik').enable();
  		this.form.get('kdPegawaiPengguna').setValue(null);
  		this.form.get('kdPegawaiPemilik').disable();
  		this.form.get('kdPegawaiPemilik').setValue(null);
  		this.form.get('kdProfilePemilik').disable();
  		this.form.get('kdProfilePemilik').setValue(null);
  	}
  	else{
  		this.form.get('kdPegawaiPengguna').setValue(null);
  		this.form.get('kdPegawaiPemilik').disable();
  		this.form.get('kdPegawaiPemilik').setValue(null);
  		this.form.get('kdRekananPemilik').disable();
  		this.form.get('kdRekananPemilik').setValue(null);
  		this.form.get('kdProfilePemilik').disable();
  		this.form.get('kdProfilePemilik').setValue(null);
  	}
  }

  blkpemilik(){
  	let profile = this.form.get('kdProfilePemilik').value;
  	let pegawai = this.form.get('kdPegawaiPemilik').value;
  	let rekanan = this.form.get('kdRekananPemilik').value;

  	if (profile != null && pegawai == null && rekanan == null){
  		this.form.get('kdProfilePemilik').enable();
  		this.form.get('kdPegawaiPemilik').disable();
  		this.form.get('kdRekananPemilik').disable();
  	}
  	else if (profile == null && pegawai != null && rekanan == null) {
  		this.form.get('kdPegawaiPemilik').enable();
  		this.form.get('kdProfilePemilik').disable();
  		this.form.get('kdRekananPemilik').disable();
  	}
  	else if (profile == null && pegawai == null && rekanan !=null){
  		this.form.get('kdRekananPemilik').enable();
  		this.form.get('kdPegawaiPemilik').disable();
  		this.form.get('kdProfilePemilik').disable();
  	}
  	else{
  		this.form.get('kdPegawaiPemilik').enable();
  		this.form.get('kdRekananPemilik').enable();
  		this.form.get('kdProfilePemilik').enable();
  	}
  }


  panjang(event){
  	let ltPanjang = this.form.get('ltPanjang').value;
  	let ltLebar = this.form.get('ltLebar').value;
  	if (ltPanjang != null || ltLebar != null ){
  		let luas = ltPanjang * ltLebar;
  		this.form.get('luasTanah').setValue(luas)
  		this.form.get('luasTanah').disable();
  	}
  	else {
  		this.form.get('luasTanah').setValue(null);
  		this.form.get('ltPanjang').setValue(null);
  		this.form.get('ltLebar').setValue(null);
  		this.form.get('luasTanah').enable();
  		this.form.get('ltPanjang').enable();
  		this.form.get('ltLebar').enable();
  	}

  }

  panjangbangunan(event){
  	let lbPanjang = this.form.get('lbPanjang').value;
  	let lbLebar = this.form.get('lbLebar').value;
  	if (lbPanjang != null || lbLebar != null ){
  		let luas = lbPanjang * lbLebar;
  		this.form.get('luasBangunan').setValue(luas)
  		this.form.get('luasBangunan').disable();
  	}
  	else {
  		this.form.get('luasBangunan').setValue(null);
  		this.form.get('lbPanjang').setValue(null);
  		this.form.get('lbLebar').setValue(null);
  		this.form.get('luasBangunan').enable();
  		this.form.get('lbPanjang').enable();
  		this.form.get('lbLebar').enable();
  	}

  }

  luasbangunan(event){
  	let luasbangunan = this.form.get('luasBangunan').value;
  	if (luasbangunan !=null){
  		this.form.get('lbPanjang').setValue(null);
  		this.form.get('lbLebar').setValue(null);
  		this.form.get('lbPanjang').disable();
  		this.form.get('lbLebar').disable();
  	}
  	else {        
  		this.form.get('lbPanjang').enable();
  		this.form.get('lbLebar').enable();
  		this.form.get('luasBangunan').enable();
  	}
  }

  luastanah(event){
  	let luastanah = this.form.get('luasTanah').value;
  	if (luastanah !=null){
  		this.form.get('ltPanjang').setValue(null);
  		this.form.get('ltLebar').setValue(null);
  		this.form.get('ltPanjang').disable();
  		this.form.get('ltLebar').disable();
  	}
  	else {        
  		this.form.get('ltPanjang').enable();
  		this.form.get('ltLebar').enable();
  		this.form.get('luasTanah').enable();
  	}
  }

  clearPanelKendaraan(){
  	if (this.cekKendaraan == true) {
  		this.cekPnlKendaraan = !true;
  		this.cekTanah = !true;
  		this.cekBangunan = !true;
  		this.cekUmum = !true;
  	}

  	this.convertPanel();
  }

  clearPanelTanah(){
  	if (this.cekTanah == true) {
  		this.cekPnlTanah = !true;
  		this.cekKendaraan = !true;
  		this.cekBangunan = !true;
  		this.cekUmum = !true;
  	}

  	this.convertPanel();
  }

  convertPanel(){
  	if (this.cekKendaraan == true){
  		this.cekPnlKendaraan = !true;
  	}
  	else {
  		this.cekPnlKendaraan = true;
  		this.form.get('kdTransmisi').setValue(null);
  		this.form.get('noMesin').setValue('');
  		this.form.get('noRangka').setValue('');
  	}

  	if (this.cekTanah == true){
  		this.cekPnlTanah = !true;

  	}
  	else {
  		this.cekPnlTanah = true;
  		this.form.get('kdAlamat').setValue(null);
  		this.form.get('namaRuasJalan').setValue('');
  		this.form.get('fungsiKegunaan').setValue('');
  		this.form.get('luasTanah').setValue('');
  		this.form.get('ltPanjang').setValue('');
  		this.form.get('ltLebar').setValue('');
  		this.form.get('lbPanjang').setValue('');
  		this.form.get('lbLebar').setValue('');
  		this.form.get('lbTinggi').setValue('');
  	}

  }

  statusEnableDok(ri, isChecked: boolean){
  	if(isChecked){
  		this.listDokumenPengajuan[ri].statusEnabled = true;
  	} else{
  		this.listDokumenPengajuan[ri].statusEnabled = false;
  	}
  }

  popUpAlamat(){
  	this.dialogAlamat = true;
  }

  closeAlamat() {
  	this.dialogAlamat = false;
  }

  clearAlamat(){
  	this.formAlamat = this.fb.group({
  		'alamatLengkap': new FormControl(''),
  		'kdJenisAlamat': new FormControl(null),
  		'kdNegara': new FormControl(null),
  		'kdPropinsi': new FormControl(null),
  		'kecamatan': new FormControl(null),
  		'kodePos': new FormControl(''),
  		'kotaKabupaten': new FormControl(null),
  		'rtrw': new FormControl(''),
  		'statusEnabled': new FormControl(true)
  	});
  }

  validasiAlamat(event){
  	if (event == true){
  		this.form.get('kdAlamat').setValue(null);

  		this.form.get('kdJenisAlamat').setValidators(Validators.required);
  		this.form.get('alamatLengkap').setValidators(Validators.required);
  		this.form.get('rtrw').setValidators(Validators.required);
  		this.form.get('kdNegara').setValidators(Validators.required);
  		this.form.get('kodePos').setValidators(Validators.required);
  		this.form.get('kdPropinsi').setValidators(Validators.required);
  		this.form.get('kdKotaKabupaten').setValidators(Validators.required);
  		this.form.get('kdKecamatan').setValidators(Validators.required);
  		this.form.get('kdDesaKelurahan').setValidators(Validators.required);
  	}
  	else {
  		this.form.get('kdJenisAlamat').clearValidators();
  		this.form.get('alamatLengkap').clearValidators();
  		this.form.get('rtrw').clearValidators();
  		this.form.get('kdNegara').clearValidators();
  		this.form.get('kodePos').clearValidators();
  		this.form.get('kdPropinsi').clearValidators();
  		this.form.get('kdKotaKabupaten').clearValidators();
  		this.form.get('kdKecamatan').clearValidators();
  		this.form.get('kdDesaKelurahan').clearValidators();
  	}
  }

 

}
