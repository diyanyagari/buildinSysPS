import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Negara } from './negara.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-negara',
	templateUrl: './negara.component.html',
	styleUrls: ['./negara.component.scss'],
	providers: [ConfirmationService]
})
export class NegaraComponent implements OnInit {
	selected: Negara;
	listData: any[];
	dataDummy: {};
	formAktif: boolean;
	pencarian: string;
	versi: any;
	form: FormGroup;


	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;

	listData2: any[];
	listNegaraHead: any = [];
	codes: any[];
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	smbrFile: any;

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
		this.formAktif = true;
		this.pencarian = '';
		this.get(this.page, this.rows, this.pencarian);
		this.versi = null;
		this.form = this.fb.group({
			'kode': new FormControl(''),
			'kodeTelepon': new FormControl(''),
			'kdNegaraHead': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaNegara': new FormControl('', Validators.required),
			//'utc': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required),
		});
		this.getSmbrFile();
		this.getNegaraHead();
	}
	getSmbrFile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
		});
	}
	getNegaraHead() {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(res => {
			this.listNegaraHead = []
			this.listNegaraHead.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.Negara.length; i++) {
				this.listNegaraHead.push(
					{
						label: res.Negara[i].namaNegara,
						value: res.Negara[i].kode
					}
				)
			}
		})
	}
	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}
	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?').subscribe(table => {
			this.listData2 = table.Negara;
			this.codes = [];

			for (let i = 0; i < this.listData2.length; i++) {
				this.codes.push({
					'Kode': this.listData2[i].kode,
					'Nama Negara Head': this.listData2[i].namaNegaraHead,
					'Nama Negara': this.listData2[i].namaNegara,
					'Kode Telepon': this.listData2[i].kodeTelepon,
					'Tampilan Laporan': this.listData2[i].reportDisplay,
					'Kode External': this.listData2[i].kodeExternal,
					'Nama External': this.listData2[i].namaExternal,
					'Status Enabled': this.listData2[i].statusEnabled
				})
			}

			this.fileService.exportAsExcelFile(this.codes, 'Negara');
		});

	}

	downloadPdf() {
		var col = ["Kode", "Nama Negara Head", "Nama Negara", "Kode Telepon", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?').subscribe(table => {
			this.listData2 = table.Negara;
			this.codes = [];
			let NegHead;
			let kdTlp;
			let kdEx;
			for (let i = 0; i < this.listData2.length; i++) {
				if (this.listData2[i].namaNegaraHead == null) {
					NegHead = ''
				} else {
					NegHead = this.listData2[i].namaNegaraHead
				}
				if (this.listData2[i].kodeTelepon == null) {
					kdTlp = ''
				} else {
					kdTlp = this.listData2[i].kodeTelepon
				}
				if (this.listData2[i].kodeExternal == null) {
					kdEx = ''
				} else {
					kdEx = this.listData2[i].kodeExternal
				}
				this.codes.push({
					kode: this.listData2[i].kode,
					namaNegaraHead: NegHead,
					namaNegara: this.listData2[i].namaNegara,
					kodeTelepon: kdTlp,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: kdEx,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled
				})
			}

			this.fileService.exportAsPdfFile("Master Negara", col, this.codes, "Negara");

		});

	}

	// downloadPdf() {
	// 	let b = Configuration.get().report + '/negara/laporanNegara.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

	// 	window.open(b);
	// }

	cetak() {
		this.laporan = true;
		this.print.showEmbedPDFReport(Configuration.get().report + '/negara/laporanNegara.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmNegara_laporanCetak');

		// this.laporan = true;
		// let b = Configuration.get().report + '/negara/laporanNegara.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

		// window.open(b);
	}
	tutupLaporan() {
		this.laporan = false;
	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?page=' + page + '&rows=' + rows + '&dir=namaNegara&sort=desc').subscribe(table => {
			this.listData = table.Negara;
			this.totalRecords = table.totalRow;

		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaNegara&sort=desc&namaNegara=' + this.pencarian).subscribe(table => {
			this.listData = table.Negara;
		});
	}

	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Negara');
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
		// console.log(JSON.stringify(this.form.value));
		// console.log(this.form.get('kodeTelepon').value)
		this.httpService.update(Configuration.get().dataMasterNew + '/negara/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			let formSubmit = this.form.value;
			formSubmit.kodeTelepon = formSubmit.kodeTelepon.toString();
			// console.log(this.form.get('kdNegaraHead').value)
			// console.log(this.form.value)
			// console.log(JSON.stringify(this.form.value));
			this.httpService.post(Configuration.get().dataMasterNew + '/negara/save?', this.form.value).subscribe(response => {
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
		console.log(event)
		let cloned = this.clone(event);
		this.formAktif = false;
		this.form.setValue(cloned);

	}
	clone(cloned: any) {
		// let hub = new InisialNegara();
		// for (let prop in cloned) {
		// 	hub[prop] = cloned[prop];
		// }
		// let fixHub = new InisialNegara();
		let fixHub = {
			"kode": cloned.data.kode,
			"kodeTelepon": cloned.data.kodeTelepon,
			"kdNegaraHead": cloned.data.kdNegaraHead,
			"kodeExternal": cloned.data.kodeExternal,
			"namaExternal": cloned.data.namaExternal,
			"namaNegara": cloned.data.namaNegara,
			"reportDisplay": cloned.data.reportDisplay,
			"statusEnabled": cloned.data.statusEnabled
		}
		this.versi = cloned.data.version;
		return fixHub;
	}

	kdTelepon() {
		var str = this.form.get('kodeTelepon').value;
		var regx = /[^0-9+-]/g;
		var result = str.replace(regx, '');
		this.form.get('kodeTelepon').setValue(result);
		// document.getElementById("demo").innerHTML = result;
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/negara/del/' + this.form.get('kode').value).subscribe(response => {
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
}

class InisialNegara implements Negara {

	constructor(
		public negara?,
		public id?,
		public kdProfile?,
		public kode?,
		public kodeTelepon?,
		public kdNegaraHead?,
		public namaNegara?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
	) { }

}