import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-warna-produk',
	templateUrl: './warna-produk.component.html',
	styleUrls: ['./warna-produk.component.scss'],
	providers: [ConfirmationService]
})
export class WarnaProdukComponent implements OnInit {
	WarnaProduk: any;
	formAktif: boolean;
	form: FormGroup;

	// kdProfile: any;
	// kdWarnaProduk: any;
	namaWarnaProduk: any;
	reportDisplay: any;
	kdDepartemen: any;
	kdKelompokProduk: any=[];
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
			// 'kdWarnaProduk': 0,
			'namaWarnaProduk': "string",
			'reportDisplay': "string",
			'kdKelompokProduk': 0,
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
			// 'kdWarnaProduk': new FormControl(''),
			'namaWarnaProduk': new FormControl(null,Validators.required),
			'reportDisplay': new FormControl(null,Validators.required),
			'kdKelompokProduk': new FormControl(null),
			// 'kdDepartemen': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null, Validators.required),
			'noRec': new FormControl(null),
			// 'kdProfile': new FormControl(''),
			'kode': new FormControl(null),
		});

		this.getDataGrid(this.page,this.rows,this.pencarian)
		this.getKdKelompokProduk();
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
		this.httpService.get(Configuration.get().dataMasterNew + '/warnaproduk/findAll?page='+page+'&rows='+rows+'&dir=namaWarnaProduk&sort=desc&namaWarnaProduk='+cari).subscribe(table => {
			this.listData = table.WarnaProduk;
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
    		// "kdWarnaProduk": cloned.kdWarnaProduk,
    		"namaWarnaProduk": cloned.namaWarnaProduk,
    		"reportDisplay": cloned.reportDisplay,
    		"kdKelompokProduk": cloned.kdKelompokProduk,
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
    	this.httpService.update(Configuration.get().dataMasterNew + '/warnaproduk/update/' + this.versi, this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
    	});
    }

    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
    		this.httpService.post(Configuration.get().dataMasterNew + '/warnaproduk/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }

    getKdKelompokProduk() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=KelompokProduk&select=namaKelompokProduk,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdKelompokProduk = [];
    		this.kdKelompokProduk.push({label:'--Pilih Kelompok Produk--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdKelompokProduk.push({label:res.data.data[i].namaKelompokProduk, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdKelompokProduk = [];
    		this.kdKelompokProduk.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
    	this.ngOnInit();
    }  

    hapus() {
    	this.httpService.delete(Configuration.get().dataMasterNew + '/warnaproduk/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Warna Produk');
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
    	this.form.get('reportDisplay').setValue(this.form.get('namaWarnaProduk').value)
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/warnaproduk/findAll?').subscribe(table => {
            this.listData2 = table.WarnaProduk;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaKelompokProduk: this.listData2[i].namaKelompokProduk,
                    namaWarnaProduk: this.listData2[i].namaWarnaProduk,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'WarnaProduk');
        });

    }
    
    
    downloadPdf(){
        let b = Configuration.get().report + '/warnaProduk/laporanWarnaProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
	}
	
	tutupLaporan() {
        this.laporan = false;
    }

    cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/warnaProduk/laporanWarnaProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmWarnaProduk_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/warnaProduk/laporanWarnaProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }

}

