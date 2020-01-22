import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-perspective',
	templateUrl: './perspective.component.html',
	styleUrls: ['./perspective.component.scss'],
	providers: [ConfirmationService]
})
export class PerspectiveComponent implements OnInit {
	Perspective: any;
	formAktif: boolean;
	form: FormGroup;
	// kdProfile: any;
	// kdPerspective: any;
	namaPerspective: any;
	reportsDisplay: any;
	kdPerspectiveHead: any=[];
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
	kdprof:any;
	kddept:any;
	items: any[];
	codes: any[];
	laporan: boolean = false;
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
			label: 'Exel', icon: 'fa-file-excel-o', command: () => {
				this.downloadExcel();
			}
		}];

		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		let data = {
			// 'kdPerspective': 0,
			'namaPerspective': "string",
			'reportsDisplay': "string",
			'kdPerspectiveHead': 0,
			'noUrut': 0,
			// 'kdDepartemen': ,
			'kodeExternal' :"string" ,
			'namaExternal' : "string",
			'statusEnabled' : true,
			'noRec' : "string",
			'kode': 0,
		}
		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			// 'kdPerspective': new FormControl(''),
			'namaPerspective': new FormControl('',Validators.required),
			'reportsDisplay': new FormControl('',Validators.required),
			'kdPerspectiveHead': new FormControl(null),
			'noUrut': new FormControl(null, Validators.required),
			// 'kdDepartemen': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(true, Validators.required),
			'noRec': new FormControl(null),
			// 'kdProfile': new FormControl(''),
			'kode': new FormControl(null),
		});
        // this.form.get('noUrut').disable();

        this.getDataGrid(this.page,this.rows,this.pencarian)
        this.getKdPerspectiveHead();
        this.getSmbrFile();
    }

    getSmbrFile(){
    	this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
    		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
    	});
    }

	// onSubmit() {
	// 	this.simpan();
	// }

	getDataGrid(page: number, rows: number, cari:string) {
		this.httpService.get(Configuration.get().dataBSC + '/perspective/findAll?page='+page+'&rows='+rows+'&dir=namaPerspective&sort=desc&namaPerspective='+cari).subscribe(table => {
			this.listData = table.Perspective;
			this.totalRecords = table.totalRow;
			this.setNoUrut(this.totalRecords);
		});
	}

	setNoUrut(totalRecords: number){
		let totalData = [];
		if (totalRecords <1){
			this.form.get('noUrut').setValue(1)
		}
		else{
			this.httpService.get(Configuration.get().dataMasterNew + '/perspective/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc').subscribe(table => {
				totalData = table.Perspective;
				let ind = totalData.length - 1;     
				if (ind == -1){
					this.form.get('noUrut').setValue(1)
				}
				else {
					let noLast = totalData[ind].noUrut + 1;
					this.form.get('noUrut').setValue(noLast);
				}
			});
		}
	}
	
	
	
	


	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/perspective/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaPerspective&sort=desc&namaPerspective='+this.pencarian).subscribe(table => {
			this.listData = table.Perspective;
		});
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
    		// "kdPerspective": cloned.kdPerspective,
    		"namaPerspective": cloned.namaPerspective,
    		"reportsDisplay": cloned.reportsDisplay,
    		"kdPerspectiveHead": cloned.kdPerspectiveHead,
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
        // this.form.get('noUrut').enable();
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
    	this.httpService.update(Configuration.get().dataBSC + '/perspective/update/' + this.versi, this.form.value).subscribe(response => {
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
    		this.httpService.post(Configuration.get().dataBSC + '/perspective/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }

    getKdPerspectiveHead() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Perspective&select=namaPerspective,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdPerspectiveHead = [];
    		this.kdPerspectiveHead.push({label:'--Pilih Data Parent Perspective--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdPerspectiveHead.push({label:res.data.data[i].namaPerspective, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdPerspectiveHead = [];
    		this.kdPerspectiveHead.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
    	// this.form.get('noUrut').disable();
    	this.ngOnInit();
    }  

    hapus() {
    	this.httpService.delete(Configuration.get().dataBSC + '/perspective/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Perspective');
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
    	this.form.get('reportsDisplay').setValue(this.form.get('namaPerspective').value)
    }

    downloadExcel(){

    }

    downloadPdf(){
    	let cetak = Configuration.get().report + '/perspective/laporanPerspective.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    	window.open(cetak);
    }
    tutupLaporan() {
    	this.laporan = false;
    }

    cetak() {
    	this.laporan = true;
    	this.print.showEmbedPDFReport(Configuration.get().report + '/perspective/laporanPerspective.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPerspective_laporanCetak');

		// let cetak = Configuration.get().report + '/perspective/laporanPerspective.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
		// window.open(cetak);
	}

}

