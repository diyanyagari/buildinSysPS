import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { SelectItem, MenuItem, TreeNode } from 'primeng/primeng';
import { Suku } from './suku.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-suku',
	templateUrl: './suku.component.html',
	styleUrls: ['./suku.component.scss'],
	providers: [ConfirmationService]
})
export class SukuComponent implements OnInit {
	selected: Suku;
	listData: any[];
	form: FormGroup;
	report: any;
	toReport: any;
	formAktif: boolean;
	page: number;
	rows: number;
	totalRecords: number;
	pencarian: string;
	FilterNegara: string;
	dropdownNegara: any[];
	versi: any;

	items: any;
	listData2: any[];
	codes: any[];
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
		this.selected = null;
		this.pencarian = '';
		this.FilterNegara = '';
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
		this.form = this.fb.group({

			'kode': new FormControl(''),
			'namaSuku': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'kodeExternal': new FormControl(''),
			'namaExternal': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
			'kdNegara': new FormControl('', Validators.required)
		});

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

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}


	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}
	get(page: number, rows: number, search: any, filter: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/suku/findAll?page=' + page + '&rows=' + rows + '&dir=namaSuku&sort=desc&namaSuku='+ search +'&kdNegara='+filter).subscribe(table => {
			this.listData = table.Suku;
			this.totalRecords = table.totalRow;

		});
	}
	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/suku/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaSuku&sort=desc&namaSuku=' + this.pencarian +'&kdNegara='+this.FilterNegara).subscribe(table => {
			this.listData = table.Suku;
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
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Suku');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/suku/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/suku/save?', this.form.value).subscribe(response => {
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
	clone(cloned: Suku): Suku {
		let hub = new InisialSuku();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialSuku();
		fixHub = {
			"kode": hub.kode.kode,
			"namaSuku": hub.namaSuku,
			"reportDisplay": hub.reportDisplay,
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
		this.httpService.delete(Configuration.get().dataMasterNew + '/suku/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
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

	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/suku/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaSuku&sort=desc').subscribe(table => {
			this.listData2 = table.Suku;
			this.codes = [];

			for (let i = 0; i < this.listData2.length; i++) {
				this.codes.push({

					kode: this.listData2[i].kode.kode,
					namaSuku: this.listData2[i].namaSuku,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled,

				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'Suku');
		});

	}

	// downloadPdf() {
	// 	var col = ["Kode", "Suku", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
	// 	this.httpService.get(Configuration.get().dataMasterNew + '/suku/findAll?').subscribe(table => {
	// 		this.listData2 = table.Suku;
	// 		this.codes = [];

	// 		for (let i = 0; i < this.listData2.length; i++) {
	// 			this.codes.push({

	// 				kode: this.listData2[i].kode.kode,
	// 				namaSuku: this.listData2[i].namaSuku,
	// 				reportDisplay: this.listData2[i].reportDisplay,
	// 				kodeExternal: this.listData2[i].kodeExternal,
	// 				namaExternal: this.listData2[i].namaExternal,
	// 				statusEnabled: this.listData2[i].statusEnabled,

	// 			})

	// 		}
	// 		this.fileService.exportAsPdfFile("Master Suku", col, this.codes, "Suku");

	// 	});
	// }

	downloadPdf(){
		let b = Configuration.get().report + '/suku/laporanSuku.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

		window.open(b);
	}

	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/suku/laporanSuku.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmSuku_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/suku/laporanSuku.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}
	tutupLaporan() {
        this.laporan = false;
    }

}

class InisialSuku implements Suku {

	constructor(
		public suku?,
		public id?,
		public kdProfile?,
		public kode?,
		public namaSuku?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public kdNegara?
		) { }

}
