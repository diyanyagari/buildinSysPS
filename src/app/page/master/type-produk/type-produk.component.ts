import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-type-produk',
	templateUrl: './type-produk.component.html',
	styleUrls: ['./type-produk.component.scss'],
	providers: [ConfirmationService]
})
export class TypeProdukComponent implements OnInit {
	TypeProduk: any;
	formAktif: boolean;
	form: FormGroup;
	selected: any;

	// kdProfile: any;
	kdTypeProduk: any;
	namatypeProduk: any;
	reportDisplay: any;
	kdMerkProduk: any = [];
	kdKelompokProduk: any = [];
	kdDepartemen: any;
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;

	listData: any = [];

	pencarian: string;
	FilterNegara: string;
	dropdownNegara: any[];

	dataSimpan: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi: number;

	items: any;
	listData2: any[];
	codes: any[];

	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	smbrFile: any;


	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) { }

	ngOnInit() {
		this.selected = null;
		this.FilterNegara = '';
		this.pencarian = '';
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
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

		let data = {
			// 'kdTypeProduk': 0,
			'namaTypeProduk': "string",
			'reportDisplay': "string",
			'kdMerkProduk': 0,
			'kdKelompokProduk': 0,
			// 'kdDepartemen': ,
			'kodeExternal': "string",
			'namaExternal': "string",
			'statusEnabled': true,
			'noRec': 0,
			'kode': 0,
		}
		this.listData = [];
		this.formAktif = true;

		this.kdMerkProduk = [];
		this.kdMerkProduk.push({ label: '--Pilih Merk Produk--', value: null })

		this.form = this.fb.group({
			// 'kdTypeProduk': new FormControl(''),
			'namaTypeProduk': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl(null, Validators.required),
			'kdMerkProduk': new FormControl(null, Validators.required),
			'kdKelompokProduk': new FormControl(null),
			// 'kdDepartemen': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null, Validators.required),
			'kdNegara': new FormControl(null, Validators.required),
			'noRec': new FormControl(null),
			// 'kdProfile': new FormControl(''),
			'kode': new FormControl(null),
		});

		this.getDataGrid(this.page, this.rows, this.pencarian, this.FilterNegara)
		this.getKdKelompokProduk();
		this.getSmbrFile();
		this.getNegara();

	}

	getNegara() {
		this.dropdownNegara = [];
		this.dropdownNegara.push({ label: '--Pilih Negara--', value: '' })
		this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
			for (var i = 0; i < res.Negara.length; i++) {
				this.dropdownNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		});
	}

	getSmbrFile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
		});
	}

	// onSubmit() {
	// 	this.simpan();
	// }
	getDataGrid(page: number, rows: number, cari: string, filter: string) {
		this.httpService.get(Configuration.get().dataMasterNew + '/typeproduk/findAll?page=' + page + '&rows=' + rows + '&dir=namaTypeProduk&sort=desc&namaTypeProduk=' + cari + '&kdNegara=' + filter).subscribe(table => {
			this.listData = table.TypeProduk;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.getDataGrid(this.page, this.rows, this.pencarian, this.FilterNegara);
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
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}


	clone(cloned: any) {
		let fixHub = {
			// "kdTypeProduk": cloned.kdTypeProduk,
			"namaTypeProduk": cloned.namaTypeProduk,
			"reportDisplay": cloned.reportDisplay,
			"kdMerkProduk": cloned.kdMerkProduk,
			"kdKelompokProduk": cloned.kdKelompokProduk,
			// "kdDepartemen": cloned.kdDepartemen,
			"kodeExternal": cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"statusEnabled": cloned.statusEnabled,
			"noRec": cloned.noRec,
			"kode": cloned.kode.kode,
			"kdNegara": cloned.kode.kdNegara
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);
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
			}
		});
	}

	update() {
		this.httpService.update(Configuration.get().dataMasterNew + '/typeproduk/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.ngOnInit();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/typeproduk/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.ngOnInit();
			});
		}

	}



	onDestroy() {

	}

	reset() {
		this.ngOnInit();
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/typeproduk/del/' + this.form.get('kode').value + '/' + this.form.get('kdNegara').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.ngOnInit();
		});
	}


	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Type Produk');
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

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaTypeProduk').value)
	}

	getKdMerkProduk(kdNegara) {
		this.httpService.get(Configuration.get().dataMaster + '/merkproduk/findAllMerkProduk?kdNegara=' + kdNegara).subscribe(res => {
			this.kdMerkProduk = [];
			this.kdMerkProduk.push({ label: '--Pilih Merk Produk --', value: '' })
			for (var i = 0; i < res.MerkProduk.length; i++) {
				this.kdMerkProduk.push({ label: res.MerkProduk[i].namaMerkProduk, value: res.MerkProduk[i].kode.kode })
			};
		},
			error => {
				this.kdMerkProduk = [];
				this.kdMerkProduk.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	getKdKelompokProduk() {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KelompokProduk&select=namaKelompokProduk,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdKelompokProduk = [];
			this.kdKelompokProduk.push({ label: '--Pilih Kelompok Produk--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kdKelompokProduk.push({ label: res.data.data[i].namaKelompokProduk, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.kdKelompokProduk = [];
				this.kdKelompokProduk.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/typeproduk/findAll?').subscribe(table => {
			this.listData2 = table.TypeProduk;
			this.codes = [];

			for (let i = 0; i < this.listData2.length; i++) {
				this.codes.push({

					kode: this.listData2[i].kode.kode,
					namaMerkProduk: this.listData2[i].namaMerkProduk,
					namaKelompokProduk: this.listData2[i].namaKelompokProduk,
					namaTypeProduk: this.listData2[i].namaTypeProduk,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled,

				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'TypeProduk');
		});

	}


	downloadPdf() {
		let b = Configuration.get().report + '/typeProduk/laporanTypeProduk.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

		window.open(b);
	}
	tutupLaporan() {
		this.laporan = false;
	}

	cetak() {
		this.laporan = true;
		this.print.showEmbedPDFReport(Configuration.get().report + '/typeProduk/laporanTypeProduk.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmTypeProduk_laporanCetak');

		// this.laporan = true;
		// let b = Configuration.get().report + '/typeProduk/laporanTypeProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

		// window.open(b);
	}

}

