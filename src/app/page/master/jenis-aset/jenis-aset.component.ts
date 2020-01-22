import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-jenis-aset',
	templateUrl: './jenis-aset.component.html',
	styleUrls: ['./jenis-aset.component.scss'],
	providers: [ConfirmationService]
})
export class JenisAsetComponent implements OnInit {
	JenisAset: any;
	formAktif: boolean;
	form: FormGroup;

	kdJenisAsetHead: any=[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;

	namaJenisAset: any;
	reportDisplay: any;
	kdAccount: any;

	kdProfile: any;
	kdJenisAset: any;
	kdDepartemen: any;

	listData: any=[];

	pencarian: string = '';
	dataSimpan: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi:number;

   items:any;
   listData2:any[];
   codes:any[];

   kdprof: any;
   kddept: any;
   laporan: boolean = false;
   smbrFile:any;

   constructor(private fb: FormBuilder,
      private cdRef: ChangeDetectorRef,
      private httpService: HttpClient,
      private alertService: AlertService,
      private confirmationService: ConfirmationService,
      private fileService: FileService,
	  private authGuard: AuthGuard,
	  @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

   ngOnInit() {
      if (this.page == undefined || this.rows == undefined) {
         this.page = Configuration.get().page;
         this.rows = Configuration.get().rows;
     }

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

    let data = {
     "kdJenisAsetHead": 0,
     "kodeExternal": "string",
     "namaExternal": "string",
     "statusEnabled": true,
     "noRec": "string",
     "namaJenisAset": "string",
     "reportDisplay": "string",
     "kdAccount": "string",
     "kode": 0
 }
 this.listData = [];
 this.formAktif = true;

 this.form = this.fb.group({
     'kdJenisAsetHead': new FormControl(null),
			// 'kdProfile': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null,Validators.required),
			'noRec': new FormControl(null),
			'namaJenisAset': new FormControl(null,Validators.required),
			'reportDisplay': new FormControl(null,Validators.required),
			'kdAccount': new FormControl(null),
			// 'noRec': new FormControl('',Validators.required)
			// 'kdJenisAset': new FormControl(''),
			// 'kdDepartemen': new FormControl('',Validators.required),
			'kode': new FormControl(null)
		});

 this.getDataGrid(this.page,this.rows,this.pencarian)
 this.getKdJenisAsetHead();
 this.getKdAccount();
 this.getSmbrFile();
}

getSmbrFile(){
	this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
	});
}

getDataGrid(page: number, rows: number, cari:string) {
  this.httpService.get(Configuration.get().dataMasterNew + '/jenisaset/findAll?page='+page+'&rows='+rows+'&dir=namaJenisAset&sort=desc&namaJenisAset='+cari).subscribe(table => {
     this.listData = table.JenisAset;
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
    		"kdJenisAsetHead": cloned.kdJenisAsetHead,
    		// "kdDepartemen": cloned.kdDepartemen,
    		"kodeExternal": cloned.kodeExternal,
    		"namaExternal": cloned.namaExternal,
    		"statusEnabled": cloned.statusEnabled,
    		"noRec": cloned.noRec,
    		"namaJenisAset": cloned.namaJenisAset,
    		"reportDisplay": cloned.reportDisplay,
    		"kdAccount": cloned.kdAccount,
    		// "kdProfile": cloned.kdProfile,
    		// "kdJenisAset": cloned.kdJenisAset,
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
    	this.httpService.update(Configuration.get().dataMasterNew + '/jenisaset/update/' + this.versi, this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
    	});
    }

    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
    		this.httpService.post(Configuration.get().dataMasterNew + '/jenisaset/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }
    
    getKdJenisAsetHead() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=JenisAset&select=namaJenisAset,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdJenisAsetHead = [];
    		this.kdJenisAsetHead.push({label:'--Pilih Data Parent Jenis Aset--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdJenisAsetHead.push({label:res.data.data[i].namaJenisAset, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdJenisAsetHead = [];
    		this.kdJenisAsetHead.push({label:'-- '+ error +' --', value:''})
    	});

    }

    getKdAccount() {
      
      this.httpService.get(Configuration.get().dataMaster+'/chartofaccount/findAllData').subscribe(res => {
        this.kdAccount = [];
        this.kdAccount.push({label:'--Pilih Akun--', value:''})
        for(var i=0;i<res.data.length;i++) {
          this.kdAccount.push({label:res.data[i].namaAccount, value:res.data[i].kode.kdAccount})
        };
      },
    	/*this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=ChartOfAccount&select=namaAccount&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdAccount = [];
    		this.kdAccount.push({label:'--Pilih Akun--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdAccount.push({label:res.data.data[i].namaAccount, value:res.data.data[i].namaAccount})
    		};
    	},*/
    	error => {
    		this.kdAccount = [];
    		this.kdAccount.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
    	this.ngOnInit();
    }   

    hapus() {
    	this.httpService.delete(Configuration.get().dataMasterNew + '/jenisaset/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Aset');
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
    	this.form.get('reportDisplay').setValue(this.form.get('namaJenisAset').value)
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisaset/findAll?').subscribe(table => {
            this.listData2 = table.JenisAset;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaJenisAsetHead: this.listData2[i].namaJenisAsetHead,
                    namaJenisAset: this.listData2[i].namaJenisAset,
                    noUrut: this.listData2[i].noUrut,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'JenisAset');
        });

    }
    
    
    downloadPdf(){
        let b = Configuration.get().report + '/jenisAset/laporanJenisAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }

    cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisAset/laporanJenisAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisAset_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/jenisAset/laporanJenisAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}
	tutupLaporan() {
        this.laporan = false;
    }


}

