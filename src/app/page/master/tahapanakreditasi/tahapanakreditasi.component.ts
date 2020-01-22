import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import {TahapanAkreditasi} from './tahapanakreditasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-tahapanakreditasi',
	templateUrl: './tahapanakreditasi.component.html',
	styleUrls: ['./tahapanakreditasi.component.scss'],
	providers: [ConfirmationService]
})
export class TahapanAkreditasiComponent implements OnInit {
	selected: TahapanAkreditasi;
	listData: any[];
	form: FormGroup;
	report: any;
	toReport: any;
	formAktif: boolean;
	page: number;
	rows: number;
	totalRecords: number;
	pencarian: string = '';
	versi: any;

	items:any;
	codes:any[];
	listData2:any[];

  kdprof: any;
  kddept: any;
  laporan: boolean = false;

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
 'kode': new FormControl(''),
 'namaTahapanAkreditasi': new FormControl('', Validators.required),
 'reportDisplay': new FormControl('', Validators.required),
 'qtyUnitDiAkreditasi': new FormControl('', Validators.required),
 'kodeExternal' : new FormControl(''),
 'namaExternal' : new FormControl(''),
 'statusEnabled': new FormControl('', Validators.required),

});
}
valuechange(newValue) {
  this.toReport = newValue;
  this.report = newValue;
}

get(page: number, rows: number, search: any) {
  this.httpService.get(Configuration.get().dataMasterNew + '/tahapanakreditasi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
   this.listData = table.TahapanAkreditasi;
   this.totalRecords = table.totalRow;

 });
}

cari() {
  this.httpService.get(Configuration.get().dataMasterNew + '/tahapanakreditasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTahapanAkreditasi&sort=desc&namaTahapanAkreditasi=' + this.pencarian).subscribe(table => {
   this.listData = table.TahapanAkreditasi;
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
  		this.alertService.warn('Peringatan', 'Pilih Daftar Master Tahapan Akreditasi');
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
  	this.httpService.update(Configuration.get().dataMasterNew + '/tahapanakreditasi/update/' + this.versi, this.form.value).subscribe(response => {
  		this.alertService.success('Berhasil', 'Data Diperbarui');
  		this.get(this.page, this.rows, this.pencarian);
  		this.reset();
  	});
  }

  simpan() {
  	if (this.formAktif == false) {
  		this.confirmUpdate()
  	} else {
  		this.httpService.post(Configuration.get().dataMasterNew + '/tahapanakreditasi/save?', this.form.value).subscribe(response => {
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
  clone(cloned: TahapanAkreditasi): TahapanAkreditasi {
  	let hub = new InisialTahapanAkreditasi();
  	for (let prop in cloned) {
  		hub[prop] = cloned[prop];
  	}
  	let fixHub = new InisialTahapanAkreditasi();
  	fixHub = {
  		"kode": hub.kode.kode,
  		"namaTahapanAkreditasi": hub.namaTahapanAkreditasi,
  		"reportDisplay": hub.reportDisplay,
  		"qtyUnitDiAkreditasi": hub.qtyUnitDiAkreditasi,
  		"kodeExternal": hub.kodeExternal,
  		"namaExternal": hub.namaExternal,
  		"statusEnabled": hub.statusEnabled


  	}
  	this.versi = hub.version;
  	return fixHub;
  }
  
  hapus() {
  	let item = [...this.listData];
  	let deleteItem = item[this.findSelectedIndex()];
  	this.httpService.delete(Configuration.get().dataMasterNew + '/tahapanakreditasi/del/' + deleteItem.kode.kode).subscribe(response => {
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
  	this.httpService.get(Configuration.get().dataMasterNew + '/tahapanakreditasi/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaTahapanAkreditasi&sort=desc').subscribe(table => {
  		this.listData2 = table.TahapanAkreditasi;
  		this.codes = [];

  		for (let i = 0; i < this.listData2.length; i++) {
  			this.codes.push({

  				kode: this.listData2[i].kode.kode,
  				namaTahapanAkreditasi: this.listData2[i].namaTahapanAkreditasi,
  				qtyUnitDiAkreditasi: this.listData2[i].qtyUnitDiAkreditasi,
  				reportDisplay: this.listData2[i].reportDisplay,
  				kodeExternal: this.listData2[i].kodeExternal,
  				namaExternal: this.listData2[i].namaExternal,
  				statusEnabled: this.listData2[i].statusEnabled,

  			})

  		}
  		this.fileService.exportAsExcelFile(this.codes, 'TahapanAkreditasi');
  	});

  }
  // downloadPdf() {
  // 	var col = ["Kode", "Nama", "Qty Unit Di Akreditasi", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
  // 	this.httpService.get(Configuration.get().dataMasterNew + '/tahapanakreditasi/findAll?').subscribe(table => {
  // 		this.listData2 = table.TahapanAkreditasi;
  // 		this.codes = [];

  // 		for (let i = 0; i < this.listData2.length; i++) {
  // 			this.codes.push({

  // 				kode: this.listData2[i].kode.kode,
  // 				namaTahapanAkreditasi: this.listData2[i].namaTahapanAkreditasi,
  // 				qtyUnitDiAkreditasi: this.listData2[i].qtyUnitDiAkreditasi,
  // 				reportDisplay: this.listData2[i].reportDisplay,
  // 				kodeExternal: this.listData2[i].kodeExternal,
  // 				namaExternal: this.listData2[i].namaExternal,
  // 				statusEnabled: this.listData2[i].statusEnabled,

  // 			})

  // 		}
  // 		this.fileService.exportAsPdfFile("Master TahapanAkreditasi", col, this.codes, "TahapanAkreditasi");

  // 	});
  // }

  downloadPdf(){
    let b = Configuration.get().report + '/tahapanAkreditasi/laporanTahapanAkreditasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';

    window.open(b);
  }
  tutupLaporan() {
	this.laporan = false;
}

  cetak() {
	this.laporan = true;
	this.print.showEmbedPDFReport(Configuration.get().report + '/tahapanAkreditasi/laporanTahapanAkreditasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmTahapanAkreditasi_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/tahapanAkreditasi/laporanTahapanAkreditasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
      }

    }

    class InisialTahapanAkreditasi implements TahapanAkreditasi {

     constructor(
      public tahapanakreditasi?,
      public id?,
      public kdProfile?,
      public kode?,
      public namaTahapanAkreditasi?,
      public qtyUnitDiAkreditasi?,
      public reportDisplay?,
      public kodeExternal?,
      public namaExternal?,
      public statusEnabled?,
      public version?
      ) { }

   }

