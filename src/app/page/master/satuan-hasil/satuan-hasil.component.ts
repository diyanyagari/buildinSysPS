import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { SatuanHasil } from './satuan-hasil.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
@Component({
	selector: 'app-satuan-hasil',
	templateUrl: './satuan-hasil.component.html',
	styleUrls: ['./satuan-hasil.component.scss'],
	providers: [ConfirmationService]
})
export class SatuanHasilComponent implements OnInit {
	item: SatuanHasil = new InisialSatuanHasil();;
	selected: SatuanHasil;
	listData: any[];
	dataDummy: {};
	kodeSatuanHasilHead: SatuanHasil[];
	versi: any;
	form: FormGroup;
	page: number;
	rows: number;
	totalRecords: number;
	pencarian: string;
	formAktif: boolean;
	display: any;
	display2: any;
	listTab: any[];
	index: number = 0;
	tabIndex: number = 0;
	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	items:any;
	listData2:any[];
	codes:any[];
	itemsChild: any;
    kdAsalHead:any;
	smbrFile:any;


	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
		private fileService: FileService,
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
		this.itemsChild = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					this.downloadPdfChild();
				}
			},
			{
				label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
					this.downloadExcelChild();
				}
			},
			];



		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.formAktif = true;
		this.form = this.fb.group({
			'kdSatuanHasilHead': new FormControl(null),
			'kode': new FormControl(''),
			'namaSatuanHasil': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(true, Validators.required),

		});
		if (this.index == 0){
			this.httpService.get(Configuration.get().dataMasterNew + '/satuanhasil/findAll?page=1&rows=300&dir=namaSatuanHasil&sort=desc').subscribe(table => {
				this.listTab = table.SatuanHasil;
				let i = this.listTab.length
				while (i--) {
					if (this.listTab[i].statusEnabled == false) { 
						this.listTab.splice(i, 1);
					} 
				}
			});
		};
		let dataIndex = {
			"index": this.index
		}
		this.onTabChange(dataIndex);
		this.getSmbrFile();
	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	onTabChange(event) {
		let data;
		this.index = event.index;
		if (event.index > 0){
			let index = event.index-1;
			data = this.listTab[index].kode.kode;
			this.kdAsalHead = data;
			this.form.get('kdSatuanHasilHead').setValue(data);
		} else {
			data = '';
			this.form.get('kdSatuanHasilHead').setValue(null);
		}
		this.pencarian = '';
		this.get(this.page,this.rows,this.pencarian, data);
		this.valuechange('');
		this.formAktif = true;
	}
	get(page: number, rows: number, search: any, head: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/satuanhasil/findAll?page='+page+'&rows='+rows+'&dir=namaSatuanHasil&sort=desc&namaSatuanHasil='+search+'&kdSatuanHasilHead='+head).subscribe(table => {
			this.listData = table.SatuanHasil;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		let data = this.form.get('kdSatuanHasilHead').value;
		if (data == null) {
			this.get(this.page,this.rows,this.pencarian, '');
		} else {
			this.get(this.page,this.rows,this.pencarian, data);
		}

	}

	loadPage(event: LazyLoadEvent) {
		let data = this.form.get('kdSatuanHasilHead').value;
		if (data == null) {
			this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
		} else {
			this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
		}
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	valuechange(newvalue) {
		this.display = newvalue;
		this.display2 = newvalue;
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
	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Satuan Hasil');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/satuanhasil/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/satuanhasil/save?', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
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

	clone(cloned: SatuanHasil): SatuanHasil {
		let hub = new InisialSatuanHasil();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialSatuanHasil();

		fixHub = {
			
			"kdSatuanHasilHead": hub.kdSatuanHasilHead,
			"kode": hub.kode.kode,
			"kodeExternal": hub.kodeExternal,
			"namaExternal": hub.namaExternal,
			"namaSatuanHasil": hub.namaSatuanHasil,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,

		}
		this.versi = hub.version;
		return fixHub;
	}

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/satuanhasil/del/' + deleteItem.kode.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});
	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}

	downloadPdf(){
		let b = Configuration.get().report + '/satuanHasil/laporanSatuanHasil.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

		window.open(b);
	}

	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/satuanHasil/laporanSatuanHasil.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmSatuanHasil_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/satuanHasil/laporanSatuanHasil.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}
	
	tutupLaporan() {
        this.laporan = false;
    }

    downloadExcel() {
    // 	this.httpService.get(Configuration.get().dataMasterNew + '/satuanhasil/findAll?').subscribe(table => {
    // 		this.listData2 = table.SatuanHasil;
    // 		this.codes = [];

    // 		for (let i = 0; i < this.listData2.length; i++) {
    // 			this.codes.push({

    // 				kode: this.listData2[i].kode.kode,
    // 				namaSatuanHasilHead: this.listData2[i].namaSatuanHasilHead,
    // 				namaSatuanHasil: this.listData2[i].namaSatuanHasil,
    // 				noUrut: this.listData2[i].noUrut,
    // 				reportDisplay: this.listData2[i].reportDisplay,
    // 				kodeExternal: this.listData2[i].kodeExternal,
    // 				namaExternal: this.listData2[i].namaExternal,
    // 				statusEnabled: this.listData2[i].statusEnabled,

    // 			})

    // 		}
    // 		this.fileService.exportAsExcelFile(this.codes, 'SatuanHasil');
    // 	});

	}
	
	cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/satuanHasilChild/laporanSatuanHasilChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdSatuanHasilHead='+ this.kdAsalHead +'&download=false', 'frmSatuanHasil_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/satuanHasilChild/laporanSatuanHasilChild.pdf?kdProfile='+this.kdprof+'&kdSatuanHasilHead='+ this.kdAsalHead +'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
    }




}

class InisialSatuanHasil implements SatuanHasil {

	constructor(

		public kdSatuanHasilHead?,
		public kode?,
		public namaSatuanHasil?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public alamatLengkap?,
		) { }

}
