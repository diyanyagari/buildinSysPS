import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { jsonpFactory } from '@angular/http/src/http_module';

@Component({
	selector: 'app-visi-misi-perusahaan',
	templateUrl: './visi-misi-perusahaan.component.html',
	styleUrls: ['./visi-misi-perusahaan.component.scss'],
	providers: [ConfirmationService]
})

export class VisiMisiPerusahaanComponent implements OnInit {
	ProfileHistoriVisiMisi: any;
	formAktif: boolean;
	form: FormGroup;

	kdMisi: any = [];
	noHistori: any;
	keteranganLainnya: any;
	statusEnabled: any;
	noRec: any;

	// kode: any;

	kdProfile: any;
	kdDepartemen: any;

	listData: any = [];

	pencarian: string = '';
	dataSimpan: any;

	page: number;
	totalRecords: number;
	totalRecords2: number;
	rows: number;
	versi: 0;

	tanggalAwal: any;
	tanggalAkhir: any;
	tanggalTransaksi: any;
	listDataVisiMisi: any[];
	selectedVisiMisi: any[];
	cariPeriodeAwal: any;
	cariPeriodeAkhir: any;
	cariTglAwal: any;
	cariTglAkhir: any;
	statusAktif: any;
	kodeMisi: any;
	selected: any[];
	aktifTgl: boolean;
	disUpdateOnOff: boolean;
	checklistDisable: boolean;
	viMi: boolean;


	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService) { }

	ngOnInit() {
		this.disUpdateOnOff = false;
		this.checklistDisable = false;
		this.viMi = this.disUpdateOnOff;
		this.aktifTgl = false;
		this.noHistori = "";
		this.statusAktif = false;
		this.selectedVisiMisi = [];
		this.selected = [];
		this.cariTglAwal = "";
		this.cariTglAkhir = "";
		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalTransaksi = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);

		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		// let data = {
		// 	"kdMisi": 0,
		// 	"noHistori": "string",
		// 	"keteranganLainnya": "string",
		// 	"statusEnabled": true,
		// 	"noRec": "string",
		// 	// "kode": 0,
		// 	"version": 0,
		// }
		this.formAktif = true;
		// 		this.form = this.fb.group({
		// 			'kdMisi': new FormControl(null,Validators.required),
		// 			'noHistori': new FormControl(null,Validators.required),
		// // 'kdDepartemen': new FormControl(''),
		// 			'keteranganLainnya': new FormControl(null),
		// 			'statusEnabled': new FormControl(null,Validators.required),
		// 			'noRec': new FormControl(null),
		// 			// 'kode': new FormControl(null)
		// 		});

		// 		let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
		// 		let tanggalAwal = this.setTimeStamp(this.tanggalAwal);
		// 		let tanggalTransaksi = this.setTimeStamp(this.tanggalTransaksi);
		this.getDataVisiMisi(this.page, this.rows);
		this.getDataGrid(this.page, this.rows);
		this.getKdMisi();
	}

	getDataVisiMisi(page: number, rows: number) {
		let dataTampung = [];
		this.httpService.get(Configuration.get().dataMasterNew + '/misi/findAllEnabled?page=' + page + '&rows=' + rows + '&dir=namaMisi&sort=desc').subscribe(table => {
			for (var i = 0; i < table.Misi.length; i++) {
				let dataList = {
					"kode": table.Misi[i].kode.kode,
					"namaVisi": table.Misi[i].namaVisi,
					"namaMisi": table.Misi[i].namaMisi
				}
				dataTampung.push(dataList);

			}
			this.listDataVisiMisi = dataTampung;

			//ini untuk isi ceklist ke atas
			//this.selectedVisiMisi = dataTampung;
			//this.listDataVisiMisi = table.Misi;
			this.totalRecords = table.totalRow;

		});
	}

	getDataGrid(page: number, rows: number) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorivisimisi/findPeriodGroup?page=' + page + '&rows=' + rows + '&dir=strukHistori.tglAwal&sort=desc').subscribe(table => {
			this.listData = table.ProfileHistoriVisiMisi;
			this.totalRecords2 = table.totalRow;
		});
		// this.httpService.get(Configuration.get().dataBSC + '/profilehistorivisimisi/findAll?page='+page+'&rows='+rows+'&dir=keteranganLainnya&sort=desc&keteranganLainnya='+cari).subscribe(table => {
		// 	this.listData = table.ProfileHistoriVisiMisi;
		// 	this.totalRecords2 = table.totalRow;
		// });
	}

	// cari() {
	// 	this.getDataGrid(this.page,this.rows,this.pencarian)
	// } 

	// tglAwalPeriode(event){
	// 	this.cariTglAwal = this.setTimeStamp(event);
	// }

	// tglAkhirPeriode(event){
	// 	this.cariTglAkhir = this.setTimeStamp(event);
	// }

	cariPeriode() {
		if (this.cariTglAkhir == "" || this.cariTglAkhir == null || this.cariTglAwal == "" || this.cariTglAwal == null) {
			this.alertService.warn("Peringatan", "Harap Pilih Tanggal Cari Periode Awal dan Cari Periode Akhir")
		} else {
			let perAwal = this.setTimeStamp(this.cariTglAwal);
			let perAkhir = this.setTimeStamp(this.cariTglAkhir);
			this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorivisimisi/findPeriodGroup?page=' + this.page + '&rows=' + this.rows + '&dir=strukHistori.tglAwal&sort=desc&startDate=' + perAwal + '&endDate=' + perAkhir).subscribe(table => {
				this.listData = table.ProfileHistoriVisiMisi;
				this.totalRecords2 = table.totalRow;
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

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	loadPageVisiMisi(event: LazyLoadEvent) {
		this.getDataVisiMisi((event.rows + event.first) / event.rows, event.rows);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	clone(cloned: any) {
		let fixHub = {
			"kdMisi": cloned.kdMisi,
			"noHistori": cloned.noHistori,
			"keteranganLainnya": cloned.keteranganLainnya,
			"statusEnabled": cloned.statusEnabled,
			"noRec": cloned.noRec,
			// "kode": cloned.kode.kode
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		this.disUpdateOnOff = true;
		this.viMi = this.disUpdateOnOff;
		let dataSelect;
		let dataListSelect = [];
		let dataTampung = [];
		for (let i = 0; i < event.data.visiMisi.length; i++) {
			let dataListMisi = {
				"kode": event.data.visiMisi[i].kdMisi,
				"namaVisi": event.data.visiMisi[i].namaVisi,
				"namaMisi": event.data.visiMisi[i].namaMisi
			}
			dataTampung.push(dataListMisi)
		}


		this.selectedVisiMisi = dataTampung
		this.aktifTgl = true;
		this.formAktif = false;
		console.log(event.data);
		this.tanggalAwal = new Date(event.data.tglAwal * 1000);
		this.tanggalAkhir = new Date(event.data.tglAkhir * 1000);
		this.tanggalTransaksi = new Date(event.data.tglHistori * 1000);
		this.statusAktif = event.data.statusEnabled;
		if (event.data.statusEnabled == false) {
			this.checklistDisable = false;
		} else {
			this.checklistDisable = true;
		}
		this.noHistori = event.data.noHistori;
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
		let versi = 0;
		let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
		let tanggalAwal = this.setTimeStamp(this.tanggalAwal);
		let tanggalTransaksi = this.setTimeStamp(this.tanggalTransaksi);
		let profileHistoriVisiMisi = [];
		let statusAk = this.statusAktif;
		this.selectedVisiMisi.forEach(function (dataVM) {
			let dataPilih = {
				// "kdDepartemen": "",
				"kdMisi": dataVM.kode,
				"keteranganLainnya": "",
				"noHistori": "",
				//"noRec": "",
				// "statusEnabled": statusAk,
				// "tglAkhir": parseInt(tanggalAkhir),
				// "tglAwal": parseInt(tanggalAwal),
				// "tglHistori": 0,
				"version": 0
			}

			profileHistoriVisiMisi.push(dataPilih);
		})
		let dataUpdate = {
			"noHistori": this.noHistori,
			"profileHistoriVisiMisi": profileHistoriVisiMisi,
			"statusEnabled": statusAk,
			"tglAkhir": parseInt(tanggalAkhir),
			"tglAwal": parseInt(tanggalAwal),
			"tglHistori": parseInt(tanggalTransaksi)

		}
		if (this.selectedVisiMisi.length == 0) {
			this.alertService.warn("Peringatan", "Harap Pilih Visi Misi");
		} else {
			this.httpService.update(Configuration.get().dataMasterNew + '/profilehistorivisimisi/update/' + versi + '/', dataUpdate).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.ngOnInit();
			});
		}

	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate();
		} else {
			if (this.selectedVisiMisi.length == 0) {
				this.alertService.warn("Peringatan", "Data Belum Lengkap untuk Disimpan");
			}
			else if (this.statusAktif == false) {
				this.alertService.warn("Peringatan", "Pilih Aktif Belum Terceklist");
			}
			else {
				let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
				let tanggalAwal = this.setTimeStamp(this.tanggalAwal);
				let tanggalTransaksi = this.setTimeStamp(this.tanggalTransaksi);
				let profileHistoriVisiMisi = [];
				let statusAk = this.statusAktif;
				this.selectedVisiMisi.forEach(function (dataVM) {
					let dataPilih = {
						// "kdDepartemen": "",
						"kdMisi": dataVM.kode,
						"keteranganLainnya": "",
						"noHistori": "",
						//"noRec": "",
						// "statusEnabled": statusAk,
						// "tglAkhir": parseInt(tanggalAkhir),
						// "tglAwal": parseInt(tanggalAwal),
						// "tglHistori": 0,
						"version": 0
					}

					profileHistoriVisiMisi.push(dataPilih);
				})
				let dataSimpan = {
					// "noHistori": this.noHistori,
					"profileHistoriVisiMisi": profileHistoriVisiMisi,
					"statusEnabled": statusAk,
					"tglAkhir": parseInt(tanggalAkhir),
					"tglAwal": parseInt(tanggalAwal),
					"tglHistori": parseInt(tanggalTransaksi)
				}
				console.log(JSON.stringify(dataSimpan));
				this.httpService.post(Configuration.get().dataMasterNew + '/profilehistorivisimisi/save', dataSimpan).subscribe(response => {
					this.alertService.success('Berhasil', 'Data Disimpan');
					this.ngOnInit();
				});
			}



		}

	}

	getKdMisi() {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Misi&select=namaMisi,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdMisi = [];
			this.kdMisi.push({ label: '--Pilih Parent Misi--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kdMisi.push({ label: res.data.data[i].namaMisi, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.kdMisi = [];
				this.kdMisi.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	onDestroy() {

	}

	reset() {
		this.ngOnInit();
	}


	confirmDelete() {
		let kode = this.noHistori;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Visi Misi Yang Akan Di Hapus');
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

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilehistorivisimisi/del/' + this.noHistori).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.ngOnInit();
		});
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

}



