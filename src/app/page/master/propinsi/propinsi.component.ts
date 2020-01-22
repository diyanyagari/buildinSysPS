import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Propinsi } from './propinsi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-propinsi',
	templateUrl: './propinsi.component.html',
	styleUrls: ['./propinsi.component.scss'],
	providers: [ConfirmationService]
})
export class PropinsiComponent implements OnInit {
	selected: Propinsi;
	listData: any[];
	dataDummy: {};
	formAktif: boolean;
	pencarian: string;
	Negara: Propinsi[];
	versi: any;
	form: FormGroup;

	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	kdprof: any;
	kddept: any;
	codes: any[];
	listData2: any[];
	laporan: boolean = false;
	smbrFile: any;
	FilterNegara: string;

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
		this.FilterNegara = '';
		this.pencarian = '';
		this.selected = null;
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
		this.formAktif = true;
		this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
		this.versi = null;
		this.form = this.fb.group({

			'kode': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaPropinsi': new FormControl('', Validators.required),
			'kdNegara': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required),
		});
		this.Negara = [];
		this.Negara.push({ label: '--Pilih Negara--', value: '' })
		this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
			for (var i = 0; i < res.Negara.length; i++) {
				this.Negara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		});

	}

	getSmbrFile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
		});
	}

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}
	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaPropinsi&sort=desc').subscribe(table => {
			this.listData = table.Propinsi;
			this.codes = [];

			for (let i = 0; i < this.listData.length; i++) {
				this.codes.push({
					kode: this.listData[i].kode.kode,
					namaPropinsi: this.listData[i].namaPropinsi,
					reportDisplay: this.listData[i].reportDisplay,
					kodeExternal: this.listData[i].kodeExternal,
					namaExternal: this.listData[i].namaExternal,
					statusEnabled: this.listData[i].statusEnabled
				})
			}
			this.fileService.exportAsExcelFile(this.codes, 'Propinsi');
		});

	}

	downloadPdf() {
		let cetak = Configuration.get().report + '/propinsi/laporanPropinsi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
		window.open(cetak);
		// var col = ["Kode ", "Nama ", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
		// this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?').subscribe(table => {
		// 	this.listData2 = table.Propinsi;
		// 	this.codes = [];

		// 	for (let i = 0; i<this.listData2.length; i++){
		// 		this.codes.push({
		// 			kode: this.listData2[i].kode.kode,
		// 			namaPropinsi: this.listData2[i].namaPropinsi,
		// 			reportDisplay: this.listData2[i].reportDisplay,
		// 			kodeExternal: this.listData2[i].kodeExternal,
		// 			namaExternal: this.listData2[i].namaExternal,
		// 			statusEnabled: this.listData2[i].statusEnabled
		// 		})
		// 	}
		// 	this.fileService.exportAsPdfFile("Master Propinsi", col, this.codes, "Propinsi");

		// });

	}
	get(page: number, rows: number, search: any, FilterNegara: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?page=' + page + '&rows=' + rows + '&dir=namaPropinsi&sort=desc&namaPropinsi='+ search +'&kdNegara='+ FilterNegara).subscribe(table => {
			this.listData = table.Propinsi;
			this.totalRecords = table.totalRow;

		});
	}
	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPropinsi&sort=desc&namaPropinsi=' + this.pencarian + '&kdNegara='+ this.FilterNegara).subscribe(table => {
			this.listData = table.Propinsi;
		});
	}
	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Propinsi');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/propinsi/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/propinsi/save?', this.form.value).subscribe(response => {
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
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);

	}
	clone(cloned: Propinsi): Propinsi {
		let hub = new InisialPropinsi();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialPropinsi();
		fixHub = {
			"kode": hub.kode.kode,
			"kodeExternal": hub.kodeExternal,
			"namaExternal": hub.namaExternal,
			"namaPropinsi": hub.namaPropinsi,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,
			"kdNegara": hub.kode.kdNegara,

		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/propinsi/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
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
	tutupLaporan() {
		this.laporan = false;
	}
	cetak() {
		this.laporan = true;
		this.print.showEmbedPDFReport(Configuration.get().report + '/propinsi/laporanPropinsi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmPropinsi_laporanCetak');

		// let cetak = Configuration.get().report + '/propinsi/laporanPropinsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
		// window.open(cetak);
	}
}

class InisialPropinsi implements Propinsi {

	constructor(
		public propinsi?,
		public id?,
		public kdNegara?,
		public kode?,
		public namaPropinsi?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
	) { }

}