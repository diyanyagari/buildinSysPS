import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService,  InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-jenis-sertifikat',
	templateUrl: './jenis-sertifikat.component.html',
	styleUrls: ['./jenis-sertifikat.component.scss'],
	providers: [ConfirmationService]
})
export class JenisSertifikatComponent implements OnInit {
	JenisSertifikat: any;
	formAktif: boolean;
	form: FormGroup;

	namaJenisSertifikat: any;
	reportDisplay: any;
	deskripsiSertifikat: any;
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;

	kdProfile: any;
	kdJenisSertifikat: any;
	kdDepartemen: any;

	listData: any=[];

	pencarian: string = '';
	dataSimpan: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi:number;

    kdprof: any;
	kddept: any;
	items: any;
	codes: any[];
	laporan: boolean = false;
	smbrFile:any;

    constructor(private fb: FormBuilder,
      private cdRef: ChangeDetectorRef,
      private httpService: HttpClient,
      private alertService: AlertService,
      private confirmationService: ConfirmationService,
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

        if (this.page == undefined || this.rows == undefined) {
         this.page = Configuration.get().page;
         this.rows = Configuration.get().rows;
     }

     let data = {
         "namaJenisSertifikat": "string",
         "reportDisplay": "string",
         "deskripsiSertifikat": "string",
         "kodeExternal": "string",
         "namaExternal": "string",
         "statusEnabled": true,
         "noRec": "string",
         "kode": 0
     }
     this.listData = [];
     this.formAktif = true;

     this.form = this.fb.group({
         'namaJenisSertifikat': new FormControl(null,Validators.required),
			// 'kdProfile': new FormControl(''),
			'reportDisplay': new FormControl(null,Validators.required),
			'deskripsiSertifikat': new FormControl(null),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null,Validators.required),
			'noRec': new FormControl(null),
			// 'kdJenisSertifikat': new FormControl(''),
			// 'kdDepartemen': new FormControl('',Validators.required),
			'kode': new FormControl(null)
		});

	 this.getDataGrid(this.page,this.rows,this.pencarian);
	 this.getSmbrFile();
	 
 }

 getSmbrFile(){
	this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
	});
}

 getDataGrid(page: number, rows: number, cari:string) {
  this.httpService.get(Configuration.get().dataMasterNew + '/jenissertifikat/findAll?page='+page+'&rows='+rows+'&dir=namaJenisSertifikat&sort=desc&namaJenisSertifikat='+cari).subscribe(table => {
     this.listData = table.JenisSertifikat;
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
    		"namaJenisSertifikat": cloned.namaJenisSertifikat,
    		// "kdDepartemen": cloned.kdDepartemen,
    		"reportDisplay": cloned.reportDisplay,
    		"deskripsiSertifikat": cloned.deskripsiSertifikat,
    		"kodeExternal": cloned.kodeExternal,
    		"namaExternal": cloned.namaExternal,
    		"statusEnabled": cloned.statusEnabled,
    		"noRec": cloned.noRec,
    		// "kdProfile": cloned.kdProfile,
    		// "kdJenisSertifikat": cloned.kdJenisSertifikat,
    		"kode": cloned.kode.kode,
    	}
    	this.versi = cloned.version;
    	return fixHub;
    }

    onRowSelect(event) {
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
    	this.httpService.update(Configuration.get().dataMasterNew + '/jenissertifikat/update/' + this.versi, this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
    	});
    }

    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
    		this.httpService.post(Configuration.get().dataMasterNew + '/jenissertifikat/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }
    
    onDestroy() {

    }

    reset(){
    	this.ngOnInit();
    }   

    hapus() {
    	this.httpService.delete(Configuration.get().dataMasterNew + '/jenissertifikat/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Sertifikat');
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
    	this.form.get('reportDisplay').setValue(this.form.get('namaJenisSertifikat').value)
    }

    downloadPdf(){
        let b = Configuration.get().report + '/jenisSertifikat/laporanJenisSertifikat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
	}
	downloadExcel(){
		this.httpService.get(Configuration.get().dataMasterNew + '/jenissertifikat/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaJenisSertifikat&sort=desc').subscribe(table => {
			this.listData = table.JenisSertifikat;
			this.codes = [];
	
			for (let i = 0; i < this.listData.length; i++) {
				this.codes.push({
	
					kode: this.listData[i].kode.kode,
					namaJenisSertifikat: this.listData[i].namaJenisSertifikat,
					deskripsiSertifikat: this.listData[i].deskripsiSertifikat,
					kodeExternal: this.listData[i].kodeExternal,
					namaExternal: this.listData[i].namaExternal,
					statusEnabled: this.listData[i].statusEnabled,
					reportDisplay: this.listData[i].reportDisplay
	
				})

				}
				this.fileService.exportAsExcelFile(this.codes, 'JenisSertifikat');
			});
	}

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisSertifikat/laporanJenisSertifikat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisSertifikat_laporanCetak');
        // let b = Configuration.get().report + '/jenisSertifikat/laporanJenisSertifikat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}
	tutupLaporan() {
		this.laporan = false;
	}

}

