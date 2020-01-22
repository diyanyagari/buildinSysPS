import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-jurusan',
	templateUrl: './jurusan.component.html',
	styleUrls: ['./jurusan.component.scss'],
	providers: [ConfirmationService]
})

export class JurusanComponent implements OnInit {

	jurusan: any;
	formAktif: boolean;
	form: FormGroup;

	listParentJurusan: any=[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaJurusan: any;
	reportDisplay: any;
	listPegawaiKepala: any=[];
	listStatusAkreditasiLast: any=[];
	qtySKSMin: any;

	kode: any;

	kdProfile: any;
	kdJurusan: any;
	kdDepartemen: any;

	listData: any=[];

	pencarian: string;

	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	codes:any;
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
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
			"kdJurusanHead": 0,
			"kdPegawaiKepala": "string",
			"kdStatusAkreditasiLast": 0,
			"kode": 0,
			"kodeExternal": "string",
			"namaExternal": "string",
			"namaJurusan": "string",
			"noSKBerdiri": "string",
			"qtySKSMin": 0,
			"reportDisplay": "string",
			"statusEnabled": true,
			"tglAkreditasiLast": 0,
			"tglBerdiri": 0
		}
		this.formAktif = true;
		this.form = this.fb.group({
			'kdJurusanHead' : new FormControl(null),
			'kdPegawaiKepala' : new FormControl(null),
			'kdStatusAkreditasiLast' : new FormControl(null),
			'namaJurusan' : new FormControl(null, Validators.required),
			'tglBerdiri' : new FormControl(''),
			'tglAkreditasiLast' : new FormControl(''),
			'noSKBerdiri' : new FormControl(''),
			'qtySKSMin' : new FormControl(null),
			'reportDisplay' : new FormControl('', Validators.required),
			'namaExternal' : new FormControl(''),
			'kodeExternal' : new FormControl(''),
			'statusEnabled' : new FormControl('',Validators.required),
			'kode': new FormControl(null),
			'kdDepartemen' : new FormControl(null)
		});
		this.getDataGrid(this.page,this.rows,this.pencarian);
		this.getJurusanHead();
		this.getPegawaiKepala();
		this.getStatusAkreditasiLast();

		this.getSmbrFile();
	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	getDataGrid(page: number, rows: number, cari: any){
        // debugger;
        this.httpService.get(Configuration.get().dataMasterNew + '/jurusan/findAll?page='+page+'&rows='+rows+'&dir=namaJurusan&sort=asc'+cari).subscribe(table =>{
        	this.listData = table.Jurusan;
        	this.totalRecords = table.totalRow;
        });
    }

    cari(){
    	this.getDataGrid(this.page,this.rows,this.pencarian)
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
    		"kdJurusanHead": cloned.kdJurusanHead,
    		"kdPegawaiKepala": cloned.kdPegawaiKepala,
    		"kdStatusAkreditasiLast": cloned.kdStatusAkreditasiLast,
    		"namaJurusan": cloned.namaJurusan,
    		"tglBerdiri": new Date(cloned.tglBerdiri * 1000),
    		"tglAkreditasiLast": new Date(cloned.tglAkreditasiLast * 1000),
    		"noSKBerdiri": cloned.noSKBerdiri,
    		"qtySKSMin": cloned.qtySKSMin,
    		"statusEnabled": cloned.statusEnabled,
    		"reportDisplay": cloned.reportDisplay,
    		"kodeExternal": cloned.kodeExternal,
    		"namaExternal" : cloned.namaExternal,
    		"kdDepartemen" : cloned.kdDepartemen,
    		"kode": cloned.kode.kode
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
    	if (this.form.invalid){
    		this.validateAllFormFields(this.form);
    		this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
    	}
    	else {
    		this.simpan();
    	}
    }

    simpan(){
    	if (this.formAktif == false){
    		this.confirmUpdate()
    	}
    	else {
    		let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value);
    		let tglAkreditasiLast = this.setTimeStamp(this.form.get('tglAkreditasiLast').value);

    		let fixHub = {
    			"kdJurusanHead": this.form.get('kdJurusanHead').value,
    			"kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
    			"kdStatusAkreditasiLast": this.form.get('kdStatusAkreditasiLast').value,
    			"kode": this.form.get('kode').value,
    			"kodeExternal": this.form.get('kodeExternal').value,
    			"namaExternal": this.form.get('namaExternal').value,
    			"namaJurusan": this.form.get('namaJurusan').value,
    			"noSKBerdiri": this.form.get('noSKBerdiri').value,
    			"qtySKSMin": this.form.get('qtySKSMin').value,
    			"reportDisplay": this.form.get('reportDisplay').value,
    			"statusEnabled": this.form.get('statusEnabled').value,
    			"tglAkreditasiLast": tglAkreditasiLast,
    			"tglBerdiri": tglBerdiri,
    		}

    		this.httpService.post(Configuration.get().dataMasterNew+ '/jurusan/save', fixHub).subscribe(response => {
    			this.alertService.success('Berhasil','Data Berhasil Disimpan');
    			// this.getDataGrid(this.page,this.rows,this.pencarian);
    			this.reset();
    		})
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
    	let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value);
    	let tglAkreditasiLast = this.setTimeStamp(this.form.get('tglAkreditasiLast').value);

    	let fixHub = {
    			"kdJurusanHead": this.form.get('kdJurusanHead').value,
    			"kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
    			"kdStatusAkreditasiLast": this.form.get('kdStatusAkreditasiLast').value,
    			"kode": this.form.get('kode').value,
    			"kodeExternal": this.form.get('kodeExternal').value,
    			"namaExternal": this.form.get('namaExternal').value,
    			"namaJurusan": this.form.get('namaJurusan').value,
    			"noSKBerdiri": this.form.get('noSKBerdiri').value,
    			"qtySKSMin": this.form.get('qtySKSMin').value,
    			"reportDisplay": this.form.get('reportDisplay').value,
    			"statusEnabled": this.form.get('statusEnabled').value,
    			"tglAkreditasiLast": tglAkreditasiLast,
    			"tglBerdiri": tglBerdiri,
    		}
    	
    	this.httpService.update(Configuration.get().dataMasterNew + '/jurusan/update', fixHub).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.getDataGrid(this.page, this.rows, this.pencarian);
    		this.reset();
    	});
    }

    hapus(){
    	this.httpService.delete(Configuration.get().dataMasterNew + '/jurusan/del/' + this.form.get('kode').value).subscribe(response =>{
    		this.alertService.success('Berhasil','Data Berhasil Dihapus');
    		this.ngOnInit();
    	})
    }

    confirmDelete(){
    	let kode = this.form.get('kode').value;
    	if (kode==null || kode==undefined || kode == ""){
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Jurusan');
    	}
    	else {
    		this.confirmationService.confirm({
    			message: 'Apakah Data Akan Dihapus?',
    			header: 'Konfirmasi Hapus',
    			icon: 'fa fa-trash',
    			accept: () => {
    				this.hapus();
    			}
    		});
    	}
    }

    getJurusanHead(){
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Jurusan&select=id.kode,namaJurusan&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    		this.listParentJurusan = [];
    		this.listParentJurusan.push({label:'--Pilih Data Parent Jurusan--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.listParentJurusan.push({label:res.data.data[i].namaJurusan, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.listParentJurusan = [];
    		this.listParentJurusan.push({label:'-- '+ error +' --', value:''})
    	});

    }

    getPegawaiKepala(){

    	this.httpService.get(Configuration.get().dataMaster+'/masterPegawai/findData').subscribe(res => {
    		this.listPegawaiKepala = [];
    		this.listPegawaiKepala.push({label:'--Pilih Pegawai Kepala--', value: null})
    		for(var i=0;i<res.Data.length;i++) {
    			this.listPegawaiKepala.push({label:res.Data[i].namaLengkap, value:res.Data[i].kdpegawai})
    		};
    	},
    	error => {
    		this.listPegawaiKepala = [];
    		this.listPegawaiKepala.push({label:'-- '+ error +' --', value:''})
    	});

    }

    getStatusAkreditasiLast(){
    	this.httpService.get(Configuration.get().dataMaster+'/jurusan/getAkreditasi').subscribe(res => {
    		this.listStatusAkreditasiLast = [];
    		this.listStatusAkreditasiLast.push({label:'--Pilih Status Akreditasi Terakhir--', value:''})
    		for(var i=0;i<res.data.length;i++) {
    			this.listStatusAkreditasiLast.push({label:res.data[i].namaStatus, value:res.data[i].kode})
    		};
    	},
    	error => {
    		this.listStatusAkreditasiLast = [];
    		this.listStatusAkreditasiLast.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
    	this.formAktif = true;
    	this.ngOnInit();
    }

    setReportDisplay() {
    	this.form.get('reportDisplay').setValue(this.form.get('namaJurusan').value)
	}

	downloadPdf(){
		let cetak = Configuration.get().report + '/jurusan/laporanJurusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
	}

	downloadExcel(){
		
	}



	cetak(){
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jurusan/laporanJurusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJurusan_laporanCetak');
	}

	tutupLaporan() {
        this.laporan = false;
    }

}
