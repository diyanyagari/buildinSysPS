import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Status } from './status.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss'],
	providers: [ConfirmationService]
})
export class StatusComponent implements OnInit, AfterViewInit {
	selected: Status;
	listData: any[];
	dataDummy: {};
	formAktif: boolean;
	pencarian: string;
	Departemen: Status[];
	StatusHead: Status[];
	versi: any;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	formChild: FormGroup;
	listTab: any[];
	tabIndex: number = 0;
	index:number = 0;

	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	codes: any[];
	listData2: any[];
	itemsChild: any;
	kdHead:any;
	smbrFile:string;
    namaFile: string;

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
		this.pencarian = '';
		this.smbrFile = null;
        this.namaFile = null;
		this.versi = null;
		if (this.index == 0){
			this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?page='+this.page+'&rows=1000&dir=namaStatus&sort=desc&namaStatus='+this.pencarian).subscribe(table => {
				this.listTab = table.Status;
				let i = this.listTab.length
				while (i--) {
					if (this.listTab[i].statusEnabled == false) { 
						this.listTab.splice(i, 1);
					} 
				}
			});
		};
		this.form = this.fb.group({
			'kdStatusHead': new FormControl(null),
			'kode': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaStatus': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true, Validators.required)
		});
		let dataIndex = {
			"index": this.index
		}
		this.onTabChange(dataIndex);
		this.getSmbrFile();
	}
	ngAfterViewInit() {
      	var x = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left") as HTMLCollectionOf<HTMLElement>;
      	var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
      	for (var i = 0; i < x.length; i++) {
        	x[i].style.height = '3.8vh';
        	x[i].style.textAlign = 'center';
        	x[i].style.backgroundColor = '#3c67b1';
      	}
      	for (var i = 0; i < browseStyle.length; i++) {
      	  	browseStyle[i].style.marginTop = '-0.5vh';
      	}
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
		this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?').subscribe(table => {
			this.listData2 = table.Status;
			this.codes = [];

			for (let i = 0; i < this.listData2.length; i++) {
				this.codes.push({

					kode: this.listData2[i].kode.kode,
					namaStatusHead: this.listData2[i].namaStatusHead,
					namaStatus: this.listData2[i].namaStatus,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled,

				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'Status');
		});
	}
	onTabChange(event) {
		let data;
		this.form = this.fb.group({
			'kdStatusHead': new FormControl(null),
			'kode': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaStatus': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true, Validators.required)
		});
		this.index = event.index;
		if (event.index > 0){
			let index = event.index-1;
			data = this.listTab[index].kode.kode;
			this.kdHead = data;
			this.form.get('kdStatusHead').setValue(data);
		} else {
			data = '';
			this.form.get('kdStatusHead').setValue(null);
		}
		this.pencarian = '';
		this.get(this.page,this.rows,this.pencarian, data);
		this.valuechange('');
		this.formAktif = true;
		this.ngAfterViewInit();
	}
	// downloadPdf() {
	// 	var col = ["Kode Status", "Nama Status"];
	// 	this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Status&select=id.kode,namaStatus').subscribe(table => {
	// 		this.fileService.exportAsPdfFile("Master Status", col, table.data.data, "Status");

	// 	});

	// }
	downloadPdf(){
		let b = Configuration.get().report + '/status/laporanStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

		window.open(b);
	}
	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/status/laporanStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmStatus_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/status/laporanStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}
	tutupLaporan() {
        this.laporan = false;
	}
	cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/statusChild/laporanStatusChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdStatusHead='+ this.kdHead +'&download=false', 'frmStatus_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/statusChild/laporanStatusChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdStatusHead='+ this.kdHead +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
    }
    get(page: number, rows: number, search: any, head: any) {
    	this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?page='+page+'&rows='+rows+'&dir=namaStatus&sort=desc&namaStatus='+search+'&kdStatusHead='+head).subscribe(table => {
    		for (let i = 0; i < table.Status.length; i++) {
              	table.Status[i].pathImage = Configuration.get().resourceFile + '/image/show/' + table.Status[i].iconImagePathFile
            }
    		this.listData = table.Status;
    		this.totalRecords = table.totalRow;
    	});
    }
    cari() {
    	let data = this.form.get('kdStatusHead').value;
    	if (data == null) {
    		this.get(this.page,this.rows,this.pencarian, '');
    	} else {
    		this.get(this.page,this.rows,this.pencarian, data);
    	}
    }
    loadPage(event: LazyLoadEvent) {
    	let data = this.form.get('kdStatusHead').value;
    	if (data == null) {
    		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    	} else {
    		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    	}
    	this.page = (event.rows + event.first) / event.rows;
    	this.rows = event.rows;
    }
    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Status');
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
    	let data = Object.assign({},this.form.value);
    	data.iconImagePathFile = this.namaFile;
    	this.httpService.update(Configuration.get().dataMasterNew + '/status/update/' + this.versi, data).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.reset();
    	});
    }
    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
    		let data = Object.assign({},this.form.value);
    		data.iconImagePathFile = this.namaFile;
    		this.httpService.post(Configuration.get().dataMasterNew + '/status/save', data).subscribe(response => {
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
    clone(cloned: Status): Status {
    	let hub = new InisialStatus();
    	for (let prop in cloned) {
    		hub[prop] = cloned[prop];
    	}
    	let fixHub = new InisialStatus();
    	fixHub = {
    		"kode": hub.kode.kode,
    		"namaStatus": hub.namaStatus,
    		"reportDisplay": hub.reportDisplay,
    		"kdStatusHead": hub.kdStatusHead,
    		"kodeExternal": hub.kodeExternal,
    		"namaExternal": hub.namaExternal,
    		"statusEnabled": hub.statusEnabled
    	}
    	this.smbrFile = hub.pathImage;
        this.namaFile = hub.iconImagePathFile;
    	this.versi = hub.version;
    	return fixHub;
    }
    hapus() {
    	let item = [...this.listData];
    	let deleteItem = item[this.findSelectedIndex()];
    	this.httpService.delete(Configuration.get().dataMasterNew + '/status/del/' + deleteItem.kode.kode).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.reset();
    	});

    }
    urlUpload() {
      	return Configuration.get().resourceFile + '/file/upload?noProfile=false';
    }
    fileUpload(event) {
      	this.namaFile = event.xhr.response;
      	// this.form.controls["pathFile"].setValue(this.namaFile);
      	this.smbrFile = Configuration.get().resourceFile + '/image/show/' + this.namaFile;
    }
    addHeader(event) {
      	this.httpService.beforeUploadFile(event);
    }           
    findSelectedIndex(): number {
    	return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialStatus implements Status {

	constructor(
		public status?,
		public id?,
		public kode?,
		public namaStatus?,
		public iconImagePathFile?,
        public pathImage?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public kdStatusHead?,
		public kdDepartemen?
		) { }

}