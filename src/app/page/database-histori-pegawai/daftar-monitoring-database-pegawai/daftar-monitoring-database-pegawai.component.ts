import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FormGroup } from '@angular/forms';
import { LazyLoadEvent, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService, RowNumberService  } from '../../../global';
import { Router } from "@angular/router";

@Component({
	selector: 'app-daftar-monitoring-database-pegawai',
	templateUrl: './daftar-monitoring-database-pegawai.component.html',
	styleUrls: ['./daftar-monitoring-database-pegawai.component.scss'],
	providers: [ConfirmationService],
})
export class DaftarMonitoringDatabasePegawaiComponent implements OnInit {

	item: any = {};
	selected: any;
	listData: any[];

	pencarian: string = '';
	dataDummy: {};
	formAktif: boolean;
	versi: any;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	kdPegawai: any;
	tHeight: string;
	fitHeigt: any;
	btnDisable: boolean;
	foto: any;
	pilih: any;

	tglbatalMasuk: any;
	alasanBatalMasuk: any;


	listStatusPegawaiGrid: any[];
	kdStatusPegawaiAktif: any;
	currentFilterStatusPegawai: any;

	tnNyOv: string;
	namaOv: string;
	nikIOv: string;
	jnskOv: string;
	deptOv: String;
	tglMOv: Date;
	jbtOv: string;
	kdprof: any;
	kddept: any;
	kdPgw: any;
	smbrFile: any;
	photoDiri: any;

	alasanBatal: string = '';

	allowBatalMasuk: boolean = true;

	batalBergabung: boolean;

	tinggi = '350px';

	sortF: any
	sortO: any

	currentRows: number
	currentPage: number

	statusPegawaiGrid: any

	shows: any
	kdJenisDokumenKTP:any

	constructor(private route: Router,
		private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private authGuard: AuthGuard,
		private print: ReportService,
		private rowNumberService: RowNumberService) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
		this.btnDisable = true;
	}

	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		this.items = [
		{
			label: 'Cetak semua', command: () => {
				this.cetakSemua3();
			}
		},
		{
			label: 'Cetak pilih', command: () => {
				this.cetakPilih();
			}
		},
		{
			label: 'Cetak excel', command: () => {
				this.exportToXLSX();
			}
		},
		];
		this.foto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
		this.pencarian = '';
		this.versi = null;

		// this.sortF = 'namaLengkap'
		// this.sortO = 'asc'
		this.rows = 15
		this.page = 1

		this.shows = 0


		this.tinggi = (window.innerHeight - 320) + "px";

		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findStatusPegawaiAktif').subscribe(table => {
			this.kdStatusPegawaiAktif = table.data.pegawai.kode
			this.listStatusPegawaiGrid = []
			this.listStatusPegawaiGrid.push({label:'-- Pilih --', value: null})
			this.listStatusPegawaiGrid.push({label:'Aktif',value: this.kdStatusPegawaiAktif})
			this.listStatusPegawaiGrid.push({label:'Tidak Aktif',value: true})
			this.listStatusPegawaiGrid.push({label:'Semua',value: false})

			this.statusPegawaiGrid = this.kdStatusPegawaiAktif
			this.currentFilterStatusPegawai = this.kdStatusPegawaiAktif

			this.getDataGridAktif(Configuration.get().page, this.rows,this.pencarian,'namaLengkap','asc',table.data.pegawai.kode)
			// this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?page=' + Configuration.get().page + '&rows=' + this.rows + '&dir=' + 'namaLengkap' + '&sort=' + 'asc' + '&kdStatusPegawai='+table.data.pegawai.kode+'&findTidakAktif='+false+'&namaLengkap=' + this.pencarian).subscribe(res => {
			// this.listData = res.data.pegawai;
			// this.totalRecords = res.data.totalRow;
		// });

	});

		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findJenisDokumenKTP').subscribe(res => {
			this.kdJenisDokumenKTP = res.data.jenisDokumen.kode;
		});



		// this.getDataGrid(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap', 'asc');
	}

	filterStatusPegawai(event){
		this.currentFilterStatusPegawai = event.value
		if (event.value == false){
			//findTidakAktif = false
			this.getDataGrid(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap', 'asc', false);
		}
		else if (event.value == true){
			// findTidakAktif = true
			this.getDataGrid(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap', 'asc', true);
		}
		else if (event.value == this.kdStatusPegawaiAktif || event.value == null){
			this.getDataGridAktif(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap','asc',this.kdStatusPegawaiAktif)			
		}
		else{
			// findTidakAktif = false
			this.getDataGridAktif(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap','asc',this.kdStatusPegawaiAktif)
		}
	}
	pilihPegawai(event, pegawai: any, overlaypanel: any) {
		this.pilih = pegawai;
		overlaypanel.toggle(event);
		if (pegawai.photoDiri == null) {
			this.foto = Configuration.get().resourceFile + "/image/show/profile1213123.png";

			this.tnNyOv = pegawai.titlePegawai;
			this.namaOv = pegawai.namaLengkap;
			this.nikIOv = (pegawai.nIKIntern == '' || pegawai.nIKIntern === undefined || pegawai.nIKIntern === null) ? "-" : pegawai.nIKIntern;
			this.jnskOv = pegawai.jenisKelamin;
			this.deptOv = pegawai.namaDepartemen;
			this.tglMOv = new Date(pegawai.tglMasuk);
			this.jbtOv = pegawai.jabatan;

		} else {

			this.foto = Configuration.get().resourceFile + "/image/show/" + pegawai.photoDiri;

			this.tnNyOv = pegawai.titlePegawai;
			this.namaOv = pegawai.namaLengkap;
			this.nikIOv = (pegawai.nIKIntern == '' || pegawai.nIKIntern === undefined || pegawai.nIKIntern === null) ? "-" : pegawai.nIKIntern;
			this.jnskOv = pegawai.jenisKelamin;
			this.deptOv = pegawai.namaDepartemen;
			this.tglMOv = new Date(pegawai.tglMasuk);
			this.jbtOv = pegawai.jabatan;
		}

	}
	getDataGrid(page: number, rows: number, cari: string, dir: string, sort: string, findTidakAktif: boolean) {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?page=' + page + '&rows=' + rows + '&dir=' + dir + '&sort=' + sort + '&findTidakAktif='+findTidakAktif+'&namaLengkap=' + cari).subscribe(table => {
			//this.listData = table.data.pegawai;
			this.listData = this.rowNumberService.addRowNumber(page, rows, table.data.pegawai);
			this.totalRecords = table.data.totalRow;

			let shows
			if (rows == this.totalRecords){
				shows = rows
			}
			else if( this.totalRecords > rows){
				shows = this.listData.length
			}
			else if( this.totalRecords < rows){
				shows = this.totalRecords
			}
			else {
				shows = this.totalRecords
			}
			this.shows = shows
		});
	}
	getDataGridAktif(page: number, rows: number, cari: string, dir: string, sort: string, kdStatusPegawaiAktif: any){
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?page=' + page + '&rows=' + rows + '&dir=' + dir + '&sort=' + sort + '&kdStatusPegawai='+kdStatusPegawaiAktif+'&findTidakAktif='+false+'&namaLengkap=' + cari).subscribe(table => {
			
			//this.listData = table.data.pegawai;
			this.listData = this.rowNumberService.addRowNumber(page, rows, table.data.pegawai);
			this.totalRecords = table.data.totalRow;

			let shows
			if (rows == this.totalRecords){
				shows = rows
			}
			else if( this.totalRecords > rows){
				shows = this.listData.length
			}
			else if( this.totalRecords < rows){
				shows = this.totalRecords
			}
			else {
				shows = this.totalRecords
			}
			this.shows = shows
		});
	}
	loadDatabaseLazy(event: LazyLoadEvent) {
		// if ((event.first == 0 && this.currentPage !=1)){
		// this.getDataGrid(this.currentPage, this.currentRows, this.pencarian, this.sortF)
		// }
		// else if ((this.currentPage !== (event.rows + event.first) / event.rows) || ((event.rows + event.first) / event.rows == 1) ){
			let sort='asc';
			let sortField=event.sortField;
			if (event.sortOrder == -1) {
				sort = 'desc';
			}
			if (event.sortField == undefined) {
				sortField = 'namaLengkap';
			}

			if (this.kdStatusPegawaiAktif == undefined){
				this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian, sortField, sort, false);
			}
			else if (this.currentFilterStatusPegawai == this.kdStatusPegawaiAktif || this.currentFilterStatusPegawai == null) {
				this.getDataGridAktif((event.rows + event.first) / event.rows, event.rows, this.pencarian, sortField, sort, this.kdStatusPegawaiAktif);
			}
			else {
				this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian, sortField, sort, this.currentFilterStatusPegawai);
			}

			this.currentPage = (event.rows + event.first) / event.rows
			this.currentRows = event.rows
			this.rows = this.currentRows
		// }

		// else {
		// this.getDataGrid(this.currentPage,this.currentRows, this.pencarian, this.sortF)
		// }
	}
	cari() {
		if (this.currentFilterStatusPegawai == undefined || this.currentFilterStatusPegawai == this.kdStatusPegawaiAktif){
			this.getDataGridAktif(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap', this.sortO, this.kdStatusPegawaiAktif)
		}
		// else if (this.currentFilterStatusPegawai == this.kdStatusPegawaiAktif){
		// 	this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows+ '&dir=' + 'namaLengkap' + '&sort=' + this.sortO + '&kdStatusPegawai='+this.kdStatusPegawaiAktif+'&findTidakAktif='+false+'&namaLengkap=' + this.pencarian).subscribe(table => {
		// 		this.listData = table.data.pegawai;
		// 		this.totalRecords = table.data.totalRow;
		// 	});
		// }
		else{
			this.getDataGrid(Configuration.get().page, this.rows, this.pencarian, 'namaLengkap', this.sortO, this.currentFilterStatusPegawai)

		}
	}
	tambahPegawai() {
		localStorage.setItem('proses-registrasi-pegawai', String(0));
		let namaLogin = this.authGuard.getNamaLogin();
		localStorage.removeItem('data-pegawai:' + namaLogin);
		localStorage.setItem('status-step' + namaLogin, 'true');
		this.route.navigate(['data-pegawai']);
	}

	ubahPegawai() {
		localStorage.setItem('proses-registrasi-pegawai', String(0));
		let namaLogin = this.authGuard.getNamaLogin();
		localStorage.setItem('status-step' + namaLogin, 'false');
		this.route.navigate(['data-pegawai']);
	}
	periksaPegawai() {
		this.route.navigate(['pemeriksaan-pegawai']);
	}
	hapusPegawai() {
		localStorage.setItem('proses-registrasi-pegawai', String(0));
		let namaLogin = this.authGuard.getNamaLogin();
		localStorage.removeItem('data-pegawai:' + namaLogin);
		localStorage.setItem('status-step' + namaLogin, 'true');
		this.route.navigate(['pegawai-histori-meninggal']);
	}

	cetakPegawai() {

	}
	pegawaiMeninggal() {

	}
	dataToUpdate: any;

	onRowSelect(event) {

		// this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/check-bank-Acccount?kdPegawai=' + event.data.kdPegawai + '&namaPegawai=' + event.data.namaLengkap).subscribe(() => {
		// });



		this.kdPgw = event.data.kdPegawai;
		this.tglbatalMasuk = event.data.tglbatalMasuk;
		this.alasanBatalMasuk = event.data.alasanBatalMasuk;
		this.photoDiri = event.data.photoDiri;
		this.dataToUpdate = event.data;
		this.btnDisable = false;
		let namaLogin = this.authGuard.getNamaLogin();
		localStorage.setItem('data-pegawai:' + namaLogin, JSON.stringify(this.dataToUpdate));

		this.allowBatalMasuk = (!(event.data.tglMasuk > (new Date().getTime() / 1000))) || this.btnDisable;
	}

	confirmDelete() {
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


	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/del/' + deleteItem.kdPegawai).subscribe(() => {
			this.alertService.success('Berhasil', 'Data Dihapus');
		});
	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}

	deleteFromStorage(path: string) {
		localStorage.removeItem(path + ":pegawai");
	}

	saveToStorage(path: string) {
		localStorage.setItem(path + ":pegawai", JSON.stringify(this.httpService.serviceData));
	}
	// cetak() {
	//     this.print.showEmbedPDFReport(Configuration.get().report + '/daftarMonitoringDatabasePegawai/laporanDaftarMonitoringDatabasePegawai.pdf?kdProfile=' + this.kdprof + '&download=false', 'Daftar Monitoring Database Pegawai');
	// }

	gunakanCetak() {
		this.InfoService.info('Informasi', 'Gunakan tombol panah yang disebelahnya tombol cetak.');
	}

	

	tampilBatalGabung() {

		let alasan = '';

		if (this.alasanBatalMasuk === undefined || this.alasanBatalMasuk === null || this.alasanBatalMasuk == '') {
			alasan = 'tanpa alasan';
		} else {
			alasan = 'karena ' + this.alasanBatalMasuk;
		}

		if (this.tglbatalMasuk === undefined || this.tglbatalMasuk === null) {
			this.alertService.warn('Peringatan', 'Pegawai ini sudah pernah dibatalkan bergabungnya ' + alasan);
		} else {
			this.batalBergabung = true;
		}
	}

	batalGabung() {
		if (this.kdPgw == null || this.kdPgw == undefined || this.kdPgw == "") {
			this.alertService.warn('Peringatan', 'Harap pilih salah satu data pegawai terlebih dahulu');
		} else {
			let batalJoin = {
				kode: this.kdPgw,
				kdKeteranganAlasan: null,
				alasan: this.alasanBatal
			};

			this.httpService.update(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/batalMasukPerusahaan', batalJoin).subscribe(() => {
				this.alasanBatal = '';
			});
		}
	}

	cetakPilih() {
		if (this.kdPgw == null || this.kdPgw == undefined || this.kdPgw == "") {
			this.alertService.warn('Peringatan', 'Harap pilih salah satu data pegawai terlebih dahulu');
		} else {

			// this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			//photo = Configuration.get().resourceFile + '/image/show/' + this.photoDiri + '?noProfile=true';
			this.print.showEmbedPDFReport(Configuration.get().report + '/cVPegawai/laporanCVPegawai.pdf?kdProfile=' + this.kdprof + '&photoDiri=' + this.photoDiri + '&kdPegawai=' + this.kdPgw + '&download=false', 'frmDaftarMonitoringDatabasePegawai_laporanCetak');
			// });
		}
	}

	exportToXLSX() {
		let kdProfile = this.authGuard.getUserDto().kdProfile;
		let kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
		let kdJenisDokumenKTP = this.kdJenisDokumenKTP;
		let query
		if (this.currentFilterStatusPegawai == this.kdStatusPegawaiAktif){
			//filter pegawai aktif
			query = "and status.kdStatus = "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
		}
		else if (this.currentFilterStatusPegawai == true){
			//filter pegawai tidak aktif
			query = "and status.kdStatus != "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
		}
		else if (this.currentFilterStatusPegawai == false){
			//filter semua pegawai
			query = "order by status.NamaStatus, pegawai.NamaLengkap Asc"
		}
		else {
			query = "and status.kdStatus = "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
		}

		let data = {
			"namaFile": "daftar-monitoring-database-pegawai-report-excel",
			"extFile": ".xlsx",
			"excelOneSheet": true,
			"download": true,
			"kdDepartemen": kdDepartemen,
			"kdProfile": kdProfile,
			"outDepartemen": true,
			"outProfile": true,
			"paramImgKey": [
			],
			"paramImgValue": [
			],
			"paramKey": [
			"kdProfile", "query", "kdJenisDokumenKTP"
			],
			"paramValue": [
			kdProfile, query, kdJenisDokumenKTP
			]
		}

		this.httpService.genericReport(Configuration.get().report + '/generic/report/daftar-monitoring-database-pegawai-report-excel.xlsx', data).subscribe(res => {

		});
		//		this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-struktur-organisasi-report.xlsx', 'Struktur Organisasi', data);
	}

	cetakSemua() {

		if (this.listData.length == 0) {
			this.alertService.warn('Peringatan', 'Belum ada data pegawai yang dipilih untuk di cetak');
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
				this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
				this.print.showEmbedPDFReport(Configuration.get().report + '/daftarMonitoringDatabasePegawai/laporanDaftarMonitoringDatabasePegawai.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmDaftarMonitoringDatabasePegawai_laporanCetak');
			});
		}
	}

	cetakSemua2() {

		if (this.listData.length == 0) {
			this.alertService.warn('Peringatan', 'Belum ada data pegawai yang dipilih untuk di cetak');
		} else {

			let kdProfile = this.authGuard.getUserDto().kdProfile;
			let kdJenisDokumenKTP = this.kdJenisDokumenKTP
			let query
			if (this.currentFilterStatusPegawai == this.kdStatusPegawaiAktif){
				//filter pegawai aktif
				query = "and status.kdStatus = "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
			}
			else if (this.currentFilterStatusPegawai == true){
				//filter pegawai tidak aktif
				query = "and status.kdStatus != "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
			}
			else if (this.currentFilterStatusPegawai == false){
				//filter semua pegawai
				query = "order by status.NamaStatus, pegawai.NamaLengkap Asc"
			}
			else {
				query = "and status.kdStatus = "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
			}	

			this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
				this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
				this.print.showEmbedPDFReport(Configuration.get().report + '/daftarMonitoringDatabasePegawai/laporanDaftarMonitoringDatabasePegawai.pdf?kdProfile='+kdProfile+'&query='+query+'&kdJenisDokumenKTP='+kdJenisDokumenKTP+'&download=false', 'frmDaftarMonitoringDatabasePegawai_laporanCetak');
			});
		}
	}

	cetakSemua3() {
		let kdProfile = this.authGuard.getUserDto().kdProfile;
		let kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
		let kdJenisDokumenKTP = this.kdJenisDokumenKTP;
		let query
		if (this.currentFilterStatusPegawai == this.kdStatusPegawaiAktif){
			//filter pegawai aktif
			query = "and status.kdStatus = "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
		}
		else if (this.currentFilterStatusPegawai == true){
			//filter pegawai tidak aktif
			query = "and status.kdStatus != "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
		}
		else if (this.currentFilterStatusPegawai == false){
			//filter semua pegawai
			query = "order by status.NamaStatus, pegawai.NamaLengkap Asc"
		}
		else {
			query = "and status.kdStatus = "+this.kdStatusPegawaiAktif+ " order by pegawai.NamaLengkap Asc"
		}

		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';	
			let data = {
				"namaFile": "daftar-monitoring-database-pegawai-report-pdf",
				"extFile": ".pdf",
				"excelOneSheet": true,
				"download": false,
				"kdDepartemen": kdDepartemen,
				"kdProfile": kdProfile,
				"outDepartemen": true,
				"outProfile": true,
				"paramImgKey": [ 
				],
				"paramImgValue": [ 
				],
				"paramKey": [
				"kdProfile", "query", "kdJenisDokumenKTP"
				],
				"paramValue": [
				kdProfile, query, kdJenisDokumenKTP
				]
			}		
			this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/daftar-monitoring-database-pegawai-report-pdf.pdf', 'frmDaftarMonitoringDatabasePegawai_laporanCetak', data);	
		});

		// this.httpService.genericReport(Configuration.get().report + '/generic/report/daftar-monitoring-database-pegawai-report-pdf.pdf', data).subscribe(res => {

		// });

	}



	// changeSort(event) {
	// 	if (!event.order) {
	// 		this.sortF = 'namaLengkap';
	// 	} else {
	// 		this.sortF = event.field;
	// 	}
	// }

	// test(event) {

	// }

}