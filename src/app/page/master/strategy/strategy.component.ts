import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, Message, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-strategy',
	templateUrl: './strategy.component.html',
	styleUrls: ['./strategy.component.scss'],
	providers: [ConfirmationService]
})
export class StrategyComponent implements OnInit {
	Strategy: any;
	formAktif: boolean;
	form: FormGroup;

	// kdProfile: any;
	// kdStrategy: any;
	namaStrategy: any;
	reportDisplay: any;
	kdStrategyHead: any=[];
	noUrut: any;
	kdDepartemen: any;
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;

	listData: any=[];

	pencarian: string = '';
	dataSimpan: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi:number;
	kdprof: any;
	kddept: any;
	codes:any;
	laporan: boolean = false;
	items: any;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
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

		let data = {
			// 'kdStrategy': 0,
			'namaStrategy': "string",
			'reportDisplay': "string",
			'kdStrategyHead': 0,
			'noUrut': 0,
			'kdDepartemen': "string",
			'kodeExternal' :"string" ,
			'namaExternal' : "string",
			'statusEnabled' : true,
			'noRec' : "string",
			'kode': 0,
		}
		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			// 'kdStrategy': new FormControl('',Validators.required),
			'namaStrategy': new FormControl(null,Validators.required),
			'reportDisplay': new FormControl(null,Validators.required),
			'kdStrategyHead': new FormControl(null),
			'noUrut': new FormControl(null),
			// 'kdDepartemen': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null, Validators.required),
			'noRec': new FormControl(null),
			// 'kdProfile': new FormControl(''),
			'kode': new FormControl(null),
		});
        this.form.get('noUrut').disable();

		this.getDataGrid(this.page,this.rows,this.pencarian)
		this.getKdStrategyHead();
		
	}

	// onSubmit() {
	// 	this.simpan();
	// }
	getDataGrid(page: number, rows: number, cari:string) { 
		this.httpService.get(Configuration.get().dataBSC + '/strategy/findAll?page='+page+'&rows='+rows+'&dir=namaStrategy&sort=desc&namaStrategy='+cari).subscribe(table => {
			this.listData = table.Strategy;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.getDataGrid(this.page,this.rows,this.pencarian)
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
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    clone(cloned: any){
    	let fixHub = {
    		// "kdStrategy": cloned.kdStrategy,
    		"namaStrategy": cloned.namaStrategy,
    		"reportDisplay": cloned.reportDisplay,
    		"kdStrategyHead": cloned.kdStrategyHead,
    		"noUrut": cloned.noUrut,
    		// "kdDepartemen": cloned.kdDepartemen,
    		"kodeExternal": cloned.kodeExternal,
    		"namaExternal": cloned.namaExternal,
    		"statusEnabled" : cloned.statusEnabled,
    		"noRec": cloned.noRec,
    		"kode": cloned.kode.kode,
    	}
    	this.versi = cloned.version;
    	return fixHub;
    }

    onRowSelect(event) {
    	let cloned = this.clone(event.data);
    	this.formAktif = false;
    	this.form.setValue(cloned);
        this.form.get('noUrut').enable();
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
    	this.httpService.update(Configuration.get().dataBSC + '/strategy/update/' + this.versi, this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
    	});
    }

    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
            let noUrut = this.totalRecords + 1;
            this.form.get('noUrut').enable();
            this.form.get('noUrut').setValue(noUrut);
    		this.httpService.post(Configuration.get().dataBSC + '/strategy/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }

    getKdStrategyHead() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Strategy&select=namaStrategy,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdStrategyHead = [];
    		this.kdStrategyHead.push({label:'--Pilih Parent Strategy--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdStrategyHead.push({label:res.data.data[i].namaStrategy, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdStrategyHead = [];
    		this.kdStrategyHead.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
        this.form.get('noUrut').disable();
    	this.ngOnInit();
    }  

    hapus() {
    	this.httpService.delete(Configuration.get().dataBSC + '/strategy/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Strategy');
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
    	this.form.get('reportDisplay').setValue(this.form.get('namaStrategy').value)
	}
	tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/strategy/laporanStrategy.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmStrategy_laporanCetak');

	}
	downloadPdf(){
		let cetak = Configuration.get().report + '/strategy/laporanStrategy.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
        window.open(cetak);
	}
	downloadExcel(){

	}

}


