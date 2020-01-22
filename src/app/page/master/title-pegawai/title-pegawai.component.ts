import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { TitlePegawai } from './title-pegawai.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-title-pegawai',
	templateUrl: './title-pegawai.component.html',
	styleUrls: ['./title-pegawai.component.scss'],
	providers: [ConfirmationService]
})
export class TitlePegawaiComponent implements OnInit {
	item: TitlePegawai = new InisialTitlePegawai();;
	selected: TitlePegawai;
	listData: any[];
	dataDummy: {};
	versi: any;
	form: FormGroup;
	formAktif: boolean;
	page: number;
	rows: number;
	totalRecords: number;
	pencarian: string = '';
	report: any;
	toReport: any;

	items: any;
	codes: any[];
	listData2:any[];
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	smbrFile:any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
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
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.formAktif = true;
		this.get(this.page, this.rows, '');
		this.form = this.fb.group({
			'namaTitle': new FormControl('', Validators.required),
			'kode': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),

		});

		this.getSmbrFile();
	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/titlepegawai/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listData = table.TitlePegawai;
			this.totalRecords = table.totalRow;

		});
	}
	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/titlepegawai/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows+'&dir=namaTitle&sort=desc&namaTitlePegawai=' + this.pencarian).subscribe(table => {
			this.listData = table.TitlePegawai;
		});
	}
	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Title Pegawai');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/titlepegawai/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}
	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/titlepegawai/save?', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.get(this.page, this.rows, this.pencarian);
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
	clone(cloned: TitlePegawai): TitlePegawai {
		let hub = new InisialTitlePegawai();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialTitlePegawai();
		fixHub = {
			"kode": hub.kode.kode,
			"kodeExternal": hub.kodeExternal,
			"namaExternal": hub.namaExternal,
			"namaTitle": hub.namaTitle,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,

		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/titlepegawai/del/' + deleteItem.kode.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.get(this.page, this.rows, this.pencarian);
		});
		this.reset();

	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}
	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/titlepegawai/findAll?').subscribe(table => {
			this.listData2 = table.TitlePegawai;
			this.codes = [];

			for (let i = 0; i < this.listData2.length; i++) {
				this.codes.push({

					kode: this.listData2[i].kode.kode,
					namaTitle: this.listData2[i].namaTitle,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled,

				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'TitlePegawai');
		});

	}

	// downloadPdf() {
	// 	var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
	// 	this.httpService.get(Configuration.get().dataMasterNew + '/titlepegawai/findAll?').subscribe(table => {
	// 		this.listData2 = table.TitlePegawai;
	// 		this.codes = [];

	// 		for (let i = 0; i < this.listData2.length; i++) {
	// 			this.codes.push({

	// 				kode: this.listData2[i].kode.kode,
	// 				namaTitle: this.listData2[i].namaTitle,
	// 				reportDisplay: this.listData2[i].reportDisplay,
	// 				kodeExternal: this.listData2[i].kodeExternal,
	// 				namaExternal: this.listData2[i].namaExternal,
	// 				statusEnabled: this.listData2[i].statusEnabled,

	// 			})

	// 		}
	// 		this.fileService.exportAsPdfFile("Master TitlePegawai", col, this.codes, "TitlePegawai");

	// 	});
	// }

	downloadPdf(){
		let b = Configuration.get().report + '/TitelPegawai/laporanTitelPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

		window.open(b);
	}

	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/TitelPegawai/laporanTitelPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmTitlePegawai_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/TitelPegawai/laporanTitelPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}
	tutupLaporan() {
        this.laporan = false;
    }
}

class InisialTitlePegawai implements TitlePegawai {

	constructor(
		public id?,
		public kdProfile?,
		public kode?,
		public namaTitle?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
		) { }

}