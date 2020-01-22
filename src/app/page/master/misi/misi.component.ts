import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService,  InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-misi',
	templateUrl: './misi.component.html',
	styleUrls: ['./misi.component.scss'],
	providers: [ConfirmationService]
})
export class MisiComponent implements OnInit {
	Misi: any;
	formAktif: boolean;
	form: FormGroup;

	kdMisiHead: any=[];
	noUrut: any;
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaMisi: any;
	reportDisplay: any;
	kdVisi: any=[];

    kode: any; 
    
    kdProfile: any;
    kdMisi: any;
    kdDepartemen: any;

    listData: any=[];

    pencarian: string = '';
    dataSimpan: any;

    page: number;
    totalRecords: number;
    rows: number;
    versi:number;

    items: any;
    listData2: any[];
	codes: any[];
	kdprof:any;
	kddept:any;
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
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		
        this.items = [
        {label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
            this.downloadPdf();}
        },
        {label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
            this.downloadExcel();}
        },

        ];
        if (this.page == undefined || this.rows == undefined) {
           this.page = Configuration.get().page;
           this.rows = Configuration.get().rows;}
           let data = {
               'kdMisiHead': 0,
               'noUrut': 0,
               'kodeExternal' :"string" ,
               'namaExternal' : "string",
               'statusEnabled' : true,
               'noRec' : "string",
               'namaMisi': 0,
               'reportDisplay': "string",
               'kdVisi': 0,
               'kode': 0
			// 'kdDepartemen': ,

		}
		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			'kdMisiHead': new FormControl(null),
			'noUrut': new FormControl(null),
			// 'kdDepartemen': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null, Validators.required),
			'noRec': new FormControl(null),
			'namaMisi': new FormControl(null,Validators.required),
			'reportDisplay': new FormControl(null,Validators.required),
			'kdVisi': new FormControl(null,Validators.required),
			// 'kdProfile': new FormControl(''),
			'kode': new FormControl(null),
		});
        this.form.get('noUrut').disable();

        this.getDataGrid(this.page,this.rows,this.pencarian)
        this.getKdMisiHead();
		this.getKdVisi();
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
		this.httpService.get(Configuration.get().dataBSC + '/misi/findAll?page='+page+'&rows='+rows+'&dir=namaMisi&sort=desc&namaMisi='+cari).subscribe(table => {
			this.listData = table.Misi;
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
    		"kdMisiHead": cloned.kdMisiHead,
    		"noUrut": cloned.noUrut,
    		"kodeExternal": cloned.kodeExternal,
    		"namaExternal": cloned.namaExternal,
    		"statusEnabled": cloned.statusEnabled,
    		"noRec": cloned.noRec,
    		"namaMisi": cloned.namaMisi,
    		"reportDisplay": cloned.reportDisplay,
    		"kdVisi" : cloned.kdVisi,
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
    	this.httpService.update(Configuration.get().dataBSC + '/misi/update/' + this.versi, this.form.value).subscribe(response => {
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
            this.httpService.post(Configuration.get().dataBSC + '/misi/save', this.form.value).subscribe(response => {
               this.alertService.success('Berhasil', 'Data Disimpan');
               this.ngOnInit();
           });
        }

    }

    getKdMisiHead() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Misi&select=namaMisi,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdMisiHead = [];
    		this.kdMisiHead.push({label:'--Pilih Data Parent Misi--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdMisiHead.push({label:res.data.data[i].namaMisi, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdMisiHead = [];
    		this.kdMisiHead.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
        this.form.get('noUrut').disable();
        this.ngOnInit();
    }  

    cekKdMisiHead(event) {
    	if (event == true) {
    		this.form.get('kdMisiHead').enable()
    	}
    	else {
    		this.form.get('kdMisiHead').disable()
    		this.form.get('kdMisiHead').setValue('')
    	}
    }

    hapus() {
    	this.httpService.delete(Configuration.get().dataBSC + '/misi/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Misi');
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


    getKdVisi() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Visi&select=namaVisi,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdVisi = [];
    		this.kdVisi.push({label:'--Pilih Visi--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdVisi.push({label:res.data.data[i].namaVisi, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdVisi = [];
    		this.kdVisi.push({label:'-- '+ error +' --', value:''})
    	});

    }


    setReportDisplay() {
    	this.form.get('reportDisplay').setValue(this.form.get('namaMisi').value)
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/misi/findAll?').subscribe(table => {
           this.listData2 = table.Misi;
           this.codes = [];

           for (let i = 0; i<this.listData2.length; i++){
            this.codes.push({
              kode: this.listData2[i].kode.kode,
              namaMisiHead: this.listData2[i].namaMisiHead,
              namaVisi: this.listData2[i].namaVisi,
              namaMisi: this.listData2[i].namaMisi,
              noUrut: this.listData2[i].noUrut,
              reportDisplay: this.listData2[i].reportDisplay,
              kodeExternal: this.listData2[i].kodeExternal,
              namaExternal: this.listData2[i].namaExternal,
              statusEnabled: this.listData2[i].statusEnabled
          })
        }
        this.fileService.exportAsExcelFile(this.codes, 'Misi');
    });

    }

    downloadPdf() {
		let cetak = Configuration.get().report + '/misi/laporanMisi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
		window.open(cetak);
    //     var col = ["Kode", "Parent", "Visi", "Nama Misi", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    //     this.httpService.get(Configuration.get().dataMasterNew + '/misi/findAll?').subscribe(table => {
    //       this.listData2 = table.Misi;
    //       this.codes = [];

    //       for (let i = 0; i<this.listData2.length; i++){
    //         this.codes.push({
    //           kode: this.listData2[i].kode.kode,
    //           namaMisiHead: this.listData2[i].namaMisiHead,
    //           namaVisi: this.listData2[i].namaVisi,
    //           namaMisi: this.listData2[i].namaMisi,
    //           noUrut: this.listData2[i].noUrut,
    //           reportDisplay: this.listData2[i].reportDisplay,
    //           kodeExternal: this.listData2[i].kodeExternal,
    //           namaExternal: this.listData2[i].namaExternal,
    //           statusEnabled: this.listData2[i].statusEnabled
    //       })
    //     }
    //     this.fileService.exportAsPdfFile("Master Misi", col, this.codes, "Misi");

    // });

	}
	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/misi/laporanMisi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMisi_laporanCetak');

		// let cetak = Configuration.get().report + '/misi/laporanMisi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
		// window.open(cetak);
	  }
	  tutupLaporan() {
        this.laporan = false;
    }


}

