import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
// import {TreeModule} from 'primeng/tree';

@Component({
	selector: 'app-fakultas',
	templateUrl: './fakultas.component.html',
	styleUrls: ['./fakultas.component.scss'],
	providers: [ConfirmationService]
})
export class FakultasComponent implements OnInit {
	Fakultas: any;
	formAktif: boolean;
	form: FormGroup;

	listFakultas:any[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaFakultas: any;
	reportDisplay: any;
	listPegawaiKepala: any[];

	kode: any;

	kdProfile: any;
	kdFakultas: any;
	kdDepartemen: any;

	listData: any[];

	pencarian: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	kdprof: any;
	kddept: any;
	codes:any;
	laporan: boolean = false;
	items: any;
	smbrFile:any;

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
			"kdDepartemen": "string",
			"kdPegawaiKepala": "string",
			"kdFakultasHead": 0,
			"kode": 0,
			"kodeExternal": "string",
			"namaExternal": "string",
			"namaFakultas": "string",
			"noSKBerdiri": "string",
			"reportDisplay": "string",
			"statusEnabled": true,
			"tglBerdiri": 0
		}

		this.formAktif = true;
		this.form = this.fb.group({
			'kode': new FormControl(null),
			'kdFakultasHead': new FormControl(null),
			'kdPegawaiKepala': new FormControl(null),
			'namaFakultas': new FormControl('', Validators.required),
			'tglBerdiri': new FormControl(null),
			'noSKBerdiri': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(null, Validators.required),
		});
		this.getPegawaiKepala();
		this.getFakultasHead();
		this.getDataGrid(this.page,this.rows,this.pencarian);
		this.getSmbrFile();
	}
	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	getDataGrid(page: number, rows: number, cari:string) {
		this.httpService.get(Configuration.get().dataMasterNew + '/fakultas/findAll?page='+page+'&rows='+rows+'&dir=namaFakultas&sort=desc'+cari).subscribe(table => {
			this.listData = table.Fakultas;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.getDataGrid(this.page,this.rows,this.pencarian);
	}

	setTimeStamp(date) {
		let dataTimeStamp = (new Date(date).getTime() / 1000);
		return dataTimeStamp;
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
    		"kode": cloned.kode.kode,
    		"namaFakultas": cloned.namaFakultas,
    		"reportDisplay": cloned.reportDisplay,
    		"kodeExternal": cloned.kodeExternal,
    		"namaExternal": cloned.namaExternal,
    		"tglBerdiri": new Date(cloned.tglBerdiri * 1000),
    		"noSKBerdiri": cloned.noSKBerdiri,
    		"kdFakultasHead": cloned.kdFakultasHead,
    		"kdPegawaiKepala": cloned.kdPegawaiKepala,
    		"statusEnabled": cloned.statusEnabled
    	}
    	this.versi = cloned.version;
    	return fixHub;
    }

    onRowSelect(event){
    	let cloned = this.clone(event.data);
    	this.formAktif = false;
    	this.form.setValue(cloned);
    }

    onSubmit() {
    	if (this.form.invalid) {
    		this.validateAllFormFields(this.form);
    		this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    	} else {
    		this.simpan();
    	}
    }

    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {

    		let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

    		let formSubmit = this.form.value;
    		formSubmit.tglBerdiri = tglBerdiri;
    		this.httpService.post(Configuration.get().dataMasterNew + '/fakultas/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
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
    	let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

    	let formSubmit = this.form.value;
    	formSubmit.tglBerdiri = tglBerdiri;
    	this.httpService.update(Configuration.get().dataMasterNew + '/fakultas/update', this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
    	});
    }

    hapus() {
    	this.httpService.delete(Configuration.get().dataMasterNew + '/fakultas/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Fakultas');
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

    getFakultasHead(){
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Fakultas&select=namaFakultas,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    		this.listFakultas = [];
    		this.listFakultas.push({label:'--Pilih Data Parent Fakultas--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.listFakultas.push({label:res.data.data[i].namaFakultas, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.listFakultas = [];
    		this.listFakultas.push({label:'-- '+ error +' --', value:''})
    	});
    }

    getPegawaiKepala() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Pegawai&select=namaLengkap,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    		this.listPegawaiKepala = [];
    		this.listPegawaiKepala.push({label:'--Pilih Pegawai Kepala--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.listPegawaiKepala.push({label:res.data.data[i].namaLengkap, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.listPegawaiKepala = [];
    		this.listPegawaiKepala.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy(){

    }

    reset(){
    	this.formAktif = true;
    	this.ngOnInit();
    }

    setReportDisplay() {
    	this.form.get('reportDisplay').setValue(this.form.get('namaFakultas').value)
    }

	tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/fakultas/laporanFakultas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmFakultas_laporanCetak');

	}
	downloadPdf(){
		let cetak = Configuration.get().report + '/fakultas/laporanFakultas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
	}
	downloadExcel(){

	}

    





    
    



    



    


}

