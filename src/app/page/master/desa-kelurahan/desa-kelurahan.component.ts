import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { DesaKelurahan } from './desa-kelurahan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-desa-kelurahan',
	templateUrl: './desa-kelurahan.component.html',
	styleUrls: ['./desa-kelurahan.component.scss'],
	providers: [ConfirmationService]
})
export class DesaKelurahanComponent implements OnInit {
	selected: DesaKelurahan;
	listData: any[];
	dataDummy: {};
	formAktif: boolean;
	pencarian: string;
	FilterNegara: string;
	Propinsi: DesaKelurahan[];
	Kabupaten: DesaKelurahan[];
	Kecamatan: DesaKelurahan[];
	versi: any;
	form: FormGroup;
	items: MenuItem[];
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	kdNegara: any;
	kdPropinsi: any;
	kdKotaKabupaten: any;
	kdKecamatan: any;
	dataLoading: boolean;
	codes: any[];
	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	smbrFile: any;
	Negara: any[];

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {

	}


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
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.selected = null;
		this.pencarian = '';
		this.FilterNegara = '';
		this.formAktif = true;
		this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
		this.versi = null;

		this.Propinsi = [];
		this.Propinsi.push({ label: '--Pilih Propinsi--', value: '' });
		this.Kabupaten = [];
		this.Kabupaten.push({ label: '--Pilih Kabupaten--', value: '' });
		this.Kecamatan = [];
		this.Kecamatan.push({ label: '--Pilih Kecamatan--', value: '' });

		this.kdPropinsi = null;
		this.kdKotaKabupaten = null;
		this.kdKecamatan = null;
		this.kdNegara = null;
		this.form = this.fb.group({
			'kode': new FormControl(''),
			'namaDesaKelurahan': new FormControl('', Validators.required),
			'kodePos': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'kdKecamatan': new FormControl('', Validators.required),
			'kdKotaKabupaten': new FormControl('', Validators.required),
			'kdPropinsi': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required),
			'kdNegara': new FormControl('', Validators.required)
		});

		this.getNegara();
		this.getSmbrFile();

	}

	getPropinsi(kdNegara) {
		// prevent error dropdown dependen
		this.Kabupaten = [];
		this.Kabupaten.push({ label: '--Pilih Kota / Kabupaten--', value: '' });
		this.form.get('kdKotaKabupaten').reset();

		this.Kecamatan = [];
		this.Kecamatan.push({ label: '--Pilih Kecamatan--', value: '' });
		this.form.get('kdKecamatan').reset();

		this.form.get('kdPropinsi').reset();

		// end 
		this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + kdNegara).subscribe(res => {
			if (res.Propinsi.length !== 0) {
				this.Propinsi = [];
				this.Propinsi.push({ label: '--Pilih Propinsi--', value: '' })
				for (var i = 0; i < res.Propinsi.length; i++) {
					this.Propinsi.push({ label: res.Propinsi[i].namaPropinsi, value: res.Propinsi[i].kode.kode })
				};
			} else {
				this.Propinsi = [];
				this.Propinsi.push({ label: '--Data Propinsi Kosong--', value: '' });
			}
		},
			error => {
				this.Propinsi = [];
				this.Propinsi.push({ label: '--Koneksi Error--', value: '' })
			});
	}

	getNegara() {
		this.Negara = [];
		this.Negara.push({ label: '--Pilih Negara--', value: '' })
		this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
			for (var i = 0; i < res.Negara.length; i++) {
				this.Negara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		});
	}

	valuechangekdPropinsi(kdPropinsi, kdNegara) {
		this.Kecamatan = [];
		this.Kecamatan.push({ label: '--Pilih Kecamatan--', value: '' });
		this.form.get('kdKecamatan').reset();
		this.form.get('kdKotaKabupaten').reset();
		this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + kdPropinsi + '&kdNegara=' + kdNegara).subscribe(res => {
			if (res.KotaKabupaten.length !== 0) {
				this.Kabupaten = [];
				this.Kabupaten.push({ label: '--Pilih Kota Kabupaten--', value: '' });
				for (var i = 0; i < res.KotaKabupaten.length; i++) {
					this.Kabupaten.push({ label: res.KotaKabupaten[i].namaKotaKabupaten, value: res.KotaKabupaten[i].kode.kode })
				};
			} else {
				this.Kabupaten = [];
				this.Kabupaten.push({ label: '--Data Kota/Kabupaten Kosong--', value: '' });
			}
		},
			error => {
				this.Kabupaten = [];
				this.Kabupaten.push({ label: '--Koneksi Error--', value: '' })
			});
	}

	valuechangekdKotaKabupaten(kdKotaKabupaten, kdNegara) {
		this.form.get('kdKecamatan').reset();
		this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + kdKotaKabupaten + '&kdNegara=' + kdNegara).subscribe(res => {
			if (res.Kecamatan.length !== 0) {
				this.Kecamatan = [];
				this.Kecamatan.push({ label: '--Pilih Kecamatan--', value: '' });
				for (var i = 0; i < res.Kecamatan.length; i++) {
					this.Kecamatan.push({ label: res.Kecamatan[i].namaKecamatan, value: res.Kecamatan[i].kode.kode })
				};
			} else {
				this.Kecamatan = [];
				this.Kecamatan.push({ label: '--Data Kecamatan Kosong--', value: '' });
			}
		},
			error => {
				this.Kecamatan = [];
				this.Kecamatan.push({ label: '--Koneksi Error--', value: '' })
			});
	}

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}
	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=1&rows=10&dir=namaDesaKelurahan&sort=desc').subscribe(table => {
			this.listData = table.DesaKelurahan;
			this.codes = [];

			for (let i = 0; i < this.listData.length; i++) {
				// if (this.listData[i].statusEnabled == true){
				this.codes.push({

					kode: this.listData[i].kode.kode,
					namaDesaKelurahan: this.listData[i].namaDesaKelurahan,
					kodePos: this.listData[i].kodePos,
					namaPropinsi: this.listData[i].namaPropinsi,
					namaKecamatan: this.listData[i].namaKecamatan,
					namaKotaKabupaten: this.listData[i].namaKotaKabupaten,
					reportDisplay: this.listData[i].reportDisplay,
					kodeExternal: this.listData[i].kodeExternal,
					namaExternal: this.listData[i].namaExternal,
					statusEnabled: this.listData[i].statusEnabled

				})
				// }
			}
			this.fileService.exportAsExcelFile(this.codes, 'DesaKelurahan');
		});
	}

	getSmbrFile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
		});
	}

	downloadPdf() {

		let cetak;
		cetak = Configuration.get().report + '/desaKelurahan/laporanDesaKelurahan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
		window.open(cetak);
		// var col = ["Kode", "Nama", "Kode Pos", "Propinsi", "Kecamatan", "Kota Kabupaten", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
		// this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=1&rows=10&dir=namaDesaKelurahan&sort=desc').subscribe(table => {
		// 	this.listData = table.DesaKelurahan;
		// 	this.codes = [];

		// 	for (let i = 0; i < this.listData.length; i++) {
		// 		if (this.listData[i].statusEnabled == true){
		// 			this.codes.push({

		// 				kode: this.listData[i].kode.kode,
		// 				namaDesaKelurahan: this.listData[i].namaDesaKelurahan,
		// 				kodePos: this.listData[i].kodePos,
		// 				namaPropinsi: this.listData[i].namaPropinsi,
		// 				namaKecamatan: this.listData[i].namaKecamatan,
		// 				namaKotaKabupaten: this.listData[i].namaKotaKabupaten,
		// 				reportDisplay: this.listData[i].reportDisplay,
		// 				kodeExternal: this.listData[i].kodeExternal,
		// 				namaExternal: this.listData[i].namaExternal,
		// 				statusEnabled: this.listData[i].statusEnabled

		// 			})
		// 		}
		// 	}
		// 	this.fileService.exportAsPdfFile("Master Desa Kelurahan", col, this.codes, "DesaKelurahan");
		// });

	}

	get(page: number, rows: number, search: any, filter: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=' + page + '&rows=' + rows + '&dir=namaDesaKelurahan&sort=asc&namaDesaKelurahan=' + search + '&kdNegara=' + filter).subscribe(table => {
			this.listData = table.DesaKelurahan;
			this.totalRecords = table.totalRow;
		});
	}
	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDesaKelurahan&sort=asc&namaDesaKelurahan=' + this.pencarian + '&kdNegara=' + this.FilterNegara).subscribe(table => {
			this.listData = table.DesaKelurahan;
		});
	}
	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	//  setPageRow(page, rows) {
	//     if(page == undefined || rows == undefined) {
	//         this.page = Configuration.get().page;
	//         this.rows = Configuration.get().rows;
	//     } else {
	//         this.page = page;
	//         this.rows = rows;
	//     }
	// }
	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Desa Kelurahan');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/desakelurahan/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}
	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/desakelurahan/save?', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				// this.get(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}
	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}
	onRowSelect(event) {
		this.getPropinsi(event.data.kode.kdNegara);
		this.valuechangekdPropinsi(event.data.kdPropinsi, event.data.kode.kdNegara);
		this.valuechangekdKotaKabupaten(event.data.kdKotaKabupaten, event.data.kode.kdNegara);
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);

	}
	clone(cloned: DesaKelurahan): DesaKelurahan {
		let hub = new InisialDesaKelurahan();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialDesaKelurahan();
		fixHub = {
			"kode": hub.kode.kode,
			"namaDesaKelurahan": hub.namaDesaKelurahan,
			"reportDisplay": hub.reportDisplay,
			"kodePos": hub.kodePos,
			"kdKecamatan": hub.kdKecamatan,
			"kdKotaKabupaten": hub.kdKotaKabupaten,
			"kdPropinsi": hub.kdPropinsi,
			"kodeExternal": hub.kodeExternal,
			"namaExternal": hub.namaExternal,
			"statusEnabled": hub.statusEnabled,
			"kdNegara": hub.kode.kdNegara
		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/desakelurahan/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
			// this.get(this.page, this.rows, this.pencarian);

		});
		

	}


	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}

	cetak() {
		this.laporan = true;
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
			this.print.showEmbedPDFReport(Configuration.get().report + '/desaKelurahan/laporanDesaKelurahan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmDesaKelurahan_laporanCetak');
		});
		// let cetak = Configuration.get().report + '/desaKelurahan/laporanDesaKelurahan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
		// window.open(cetak);
	}
	tutupLaporan() {
		this.laporan = false;
	}
}

class InisialDesaKelurahan implements DesaKelurahan {

	constructor(
		public desaKelurahan?,
		public propinsi?,
		public kecamatan?,
		public kotaKabupaten?,
		public kodeDesaKelurahan?,
		public id?,
		public kode?,
		public namaDesaKelurahan?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public kdKecamatan?,
		public kdKotaKabupaten?,
		public kdPropinsi?,
		public kodePos?,
		public kdNegara?
	) { }

}