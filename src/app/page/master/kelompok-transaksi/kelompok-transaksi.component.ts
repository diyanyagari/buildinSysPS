import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokTransaksi } from './kelompok-transaksi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-kelompok-transaksi',
	templateUrl: './kelompok-transaksi.component.html',
	styleUrls: ['./kelompok-transaksi.component.scss'],
	providers: [ConfirmationService]
})
export class KelompokTransaksiComponent implements OnInit {
	selected: any;
	listData: any[];
	dataDummy: {};
	pencarian: string;
	versi: any;
	formAktif: boolean;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	isCostInOut: number;
	isCost: boolean;
	listStrukturNomor: any[];
	Detail: any[];

	codes: any[];

	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	smbrFile:any;

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
		this.form = this.fb.group({
			'kdKelompokTransaksi': new FormControl(null),
			'namaKelompokTransaksi': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
		});

		
		this.form.get('namaKelompokTransaksi').enable();
		this.form.get('reportDisplay').enable();
		
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=StrukturNomor&select=namaStrukturNomor,%20id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listStrukturNomor = [];
			this.listStrukturNomor.push({ label: '--Pilih Struktur Nomor--', value: null})
			for (var i = 0; i < res.data.data.length; i++) {
				this.listStrukturNomor.push({ label: res.data.data[i].namaStrukturNomor, value: res.data.data[i].id_kode })
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

	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKelompokTransaksi&sort=desc').subscribe(table => {
			this.listData = table.KelompokTransaksi;
			this.codes = [];

			for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
        	this.codes.push({

        		// kode: this.listData[i].kode.kode,
        		namaKelompokTransaksi: this.listData[i].namaKelompokTransaksi,
        		reportDisplay: this.listData[i].reportDisplay,
        		kodeExternal: this.listData[i].kodeExternal,
        		namaExternal: this.listData[i].namaExternal,
        		statusEnabled: this.listData[i].statusEnabled

        	})
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'KelompokTransaksi');
});

	}

// 	downloadPdf() {
// 		var col = ["Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
// 		this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?').subscribe(table => {
// 			this.listData = table.KelompokTransaksi;
// 			this.codes = [];

// 			for (let i = 0; i < this.listData.length; i++) {
//         // if (this.listData[i].statusEnabled == true){
//         	this.codes.push({

//         		// kode: this.listData[i].kode.kode,
//         		namaKelompokTransaksi: this.listData[i].namaKelompokTransaksi,
//         		reportDisplay: this.listData[i].reportDisplay,
//         		kodeExternal: this.listData[i].kodeExternal,
//         		namaExternal: this.listData[i].namaExternal,
//         		statusEnabled: this.listData[i].statusEnabled

//         	})
//         // }
//     }
//     this.fileService.exportAsPdfFile("Master Kelompok Transaksi ", col, this.codes, "KelompokTransaksi");

// });

// 	}

downloadPdf(){
	let b = Configuration.get().report + '/kelompokTransaksi/laporanKelompokTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

	window.open(b);
}

cetak() {
	this.laporan = true;
	this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokTransaksi/laporanKelompokTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelompokTransaksi_laporanCetak');
        // let b = Configuration.get().report + '/kelompokTransaksi/laporanKelompokTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
    	this.laporan = false;
    }

    get(page: number, rows: number, search: any) { 
    	this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page=' + page + '&rows=' + rows+'&dir=kdKelompokTransaksi&sort=asc').subscribe(table => {
    		this.listData = table.KelompokTransaksi;
    		this.totalRecords = table.totalRow;
    	});
    }

    cari() {
    	this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokTransaksi&sort=desc&namaKelompokTransaksi=' + this.pencarian).subscribe(table => {
    		this.listData = table.KelompokTransaksi;
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
		let kdKelompokTransaksi = this.form.get('kdKelompokTransaksi').value;
		if (kdKelompokTransaksi == null || kdKelompokTransaksi == undefined || kdKelompokTransaksi == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Transaksi');
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
		// if(this.form.get('isCostInOut').value == null || this.form.get('isCostInOut').value == undefined || this.form.get('isCostInOut').value == false) {
		// 	this.isCostInOut = 0;
		// } else {
		// 	this.isCostInOut = 1;
		// }
		// let formSubmit = this.form.value;
		// formSubmit.isCostInOut = this.isCostInOut;
		
		let dataSimpan = {
			"kdKelompokTransaksi" : this.form.get('kdKelompokTransaksi').value,
			"namaKelompokTransaksi": this.form.get('namaKelompokTransaksi').value,
			"kodeExternal": this.form.get('kodeExternal').value,
			"namaExternal":this.form.get('namaExternal').value,
			"reportDisplay": this.form.get('reportDisplay').value,
			"statusEnabled": this.form.get('statusEnabled').value,			
		}

		this.httpService.update(Configuration.get().dataMasterNew + '/kelompoktransaksi/update/' + this.versi, dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			// if(this.form.get('isCostInOut').value == null || this.form.get('isCostInOut').value == undefined || this.form.get('isCostInOut').value == false) {
			// 	this.isCostInOut = 0;
			// } else {
			// 	this.isCostInOut = 1;
			// }
			// let formSubmit = this.form.value;
			// formSubmit.isCostInOut = this.isCostInOut;
			
			let dataSimpan = {
				"kdKelompokTransaksi" : this.form.get('kdKelompokTransaksi').value,
				"namaKelompokTransaksi": this.form.get('namaKelompokTransaksi').value,
				"kodeExternal": this.form.get('kodeExternal').value,
				"namaExternal":this.form.get('namaExternal').value,
				"reportDisplay": this.form.get('reportDisplay').value,
				"statusEnabled": this.form.get('statusEnabled').value,			
			}

			this.httpService.post(Configuration.get().dataMasterNew + '/kelompoktransaksi/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.get(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}

	}

	reset() {
		this.formAktif = true;
		this.form.get('namaKelompokTransaksi').enable();
		this.form.get('reportDisplay').enable();
		this.ngOnInit();
	}

	onRowSelect(event) {
		// if (event.data.isCostInOut == 1) {
		// 	this.isCost = true;
		// 	this.isCostInOut = 1;
		// } else {
		// 	this.isCost = false;
		// 	this.isCostInOut = 0;
		// }
		let cloned = this.clone(event.data);
		// this.form.get('namaKelompokTransaksi').disable();
		this.formAktif = false;
		this.form.setValue(cloned);
		this.form.get('namaKelompokTransaksi').disable();
		this.form.get('reportDisplay').disable();
	}

	clone(hub: any) {
		let	fixHub = {

			'kdKelompokTransaksi': hub.kdKelompokTransaksi, 
			'namaKelompokTransaksi': hub.namaKelompokTransaksi,
			'reportDisplay': hub.reportDisplay, 
			'namaExternal': hub.namaExternal,
			'kodeExternal': hub.kodeExternal, 
			'statusEnabled': hub.statusEnabled,
		}
		this.versi = hub.version;
		return fixHub;
	}

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/kelompoktransaksi/del/' + deleteItem.kdKelompokTransaksi).subscribe(response => {
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

class InisialKelompokTransaksi implements KelompokTransaksi {

	constructor(
		public isCostInOut?,
		public isRealSK?,
		public kdProfile?,
		public kdKelompokTransaksi?,
		public namaKelompokTransaksi?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
		) { }

}