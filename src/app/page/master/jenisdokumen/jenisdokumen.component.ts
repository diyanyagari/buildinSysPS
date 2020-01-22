import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisDokumen } from './jenisdokumen.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-jenisdokumen',
	templateUrl: './jenisdokumen.component.html',
	styleUrls: ['./jenisdokumen.component.scss'],
	providers: [ConfirmationService]
})
export class JenisDokumenComponent implements OnInit {
	selected: JenisDokumen;
	listData: any[];
	dataDummy: {};
	formAktif: boolean;
	pencarian: string;
	departemen: JenisDokumen[];
	versi: any;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	codes:any[];
	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	parentDokumen: any[]


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
		this.formAktif = true;
		this.get(this.page, this.rows, '');
		this.versi = null;
		this.form = this.fb.group({

			'kode': new FormControl(''),
			'kdJenisDokumenHead': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaJenisDokumen': new FormControl('', Validators.required),
			'kdDepartemen': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required),
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
			this.departemen = [];
			this.departemen.push({ label: '--Pilih Departemen--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.departemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
			};
		});
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisDokumen&select=namaJenisDokumen,id').subscribe(res => {
			this.parentDokumen = [];
			this.parentDokumen.push({ label: '--Pilih Data Parent Jenis Dokumen--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.parentDokumen.push({ label: res.data.data[i].namaJenisDokumen, value: res.data.data[i].id.kode })
			};
		});
	}

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}

	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?').subscribe(table => {
			this.listData = table.JenisDokumen;
			this.codes = [];

			for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
        	this.codes.push({

        		kode: this.listData[i].kode.kode,
        		namaJenisDokumen: this.listData[i].namaJenisDokumen,
        		reportDisplay: this.listData[i].reportDisplay,
        		kodeExternal: this.listData[i].kodeExternal,
        		namaExternal: this.listData[i].namaExternal,
        		statusEnabled: this.listData[i].statusEnabled

        	})
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'JenisDokumen');
});

	}

// 	downloadPdf() {
// 		var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
// 		this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?').subscribe(table => {
// 			this.listData = table.JenisDokumen;
// 			this.codes = [];

// 			for (let i = 0; i < this.listData.length; i++) {
//         // if (this.listData[i].statusEnabled == true){
//         	this.codes.push({

//         		kode: this.listData[i].kode.kode,
//         		namaJenisDokumen: this.listData[i].namaJenisDokumen,
//         		reportDisplay: this.listData[i].reportDisplay,
//         		kodeExternal: this.listData[i].kodeExternal,
//         		namaExternal: this.listData[i].namaExternal,
//         		statusEnabled: this.listData[i].statusEnabled

//         	})
//         // }
//     }
//     this.fileService.exportAsPdfFile("Master Jenis Dokumen", col, this.codes, "JenisDokumen");

// });

// 	}

downloadPdf(){
	let b = Configuration.get().report + '/jenisDokumen/laporanJenisDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';

	window.open(b);
}

cetak() {
	this.laporan = true;
	this.print.showEmbedPDFReport(Configuration.get().report + '/jenisDokumen/laporanJenisDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmJenisDokumen_laporanCetak');

        // let b = Configuration.get().report + '/jenisDokumen/laporanJenisDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
	}
	tutupLaporan() {
        this.laporan = false;
    }


    get(page: number, rows: number, search: any) {
    	this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
    		this.listData = table.JenisDokumen;
    		this.totalRecords = table.totalRow;

    	});
    }

    cari() {
    	this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisDokumen&sort=desc&namaJenisDokumen=' + this.pencarian).subscribe(table => {
    		this.listData = table.JenisDokumen;
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
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Dokumen');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/jenisdokumen/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/jenisdokumen/save?', this.form.value).subscribe(response => {
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

	clone(cloned: JenisDokumen): JenisDokumen {
		let hub = new InisialJenisDokumen();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialJenisDokumen();
		fixHub = {
			"kode": hub.kode.kode,
			"kdJenisDokumenHead": hub.kdJenisDokumenHead,
			"kodeExternal": hub.kodeExternal,
			"namaExternal": hub.namaExternal,
			"namaJenisDokumen": hub.namaJenisDokumen,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,
			"kdDepartemen": hub.kdDepartemen
		}
		this.versi = hub.version;
		return fixHub;
	}

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/jenisdokumen/del/' + deleteItem.kode.kode).subscribe(response => {
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
}

class InisialJenisDokumen implements JenisDokumen {

	constructor(
		public kode?,
		public jenisDokumen?,
		public kdJenisDokumenHead?,
		public kdDepartemen?,
		public kodeJenisDokumen?,
		public namaJenisDokumen?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
		) { }

}