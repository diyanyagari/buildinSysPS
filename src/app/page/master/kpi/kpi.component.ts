import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-kpi',
	templateUrl: './kpi.component.html',
	styleUrls: ['./kpi.component.scss'],
	providers: [ConfirmationService]
})
export class KpiComponent implements OnInit {
	KPI: any;
	formAktif: boolean;
	form: FormGroup;

	namaKPI: any;
	reportDisplay: any;
	kdKPIHead: any=[];
	noUrut: any;
	kdTypeDataObjek: any=[];
	kdSatuanHasil: any=[];
	kdMetodeHitungScore: any=[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	// kdProfile: any;
	kdKPI: any;
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
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
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
			this.rows = Configuration.get().rows;
		}

		let data = {
			'namaKPI': "string",
			'reportDisplay': "string",
			'kdKPIHead' : 0 ,
			'noUrut' : "string",
			'kdTypeDataObjek' : 0,
			'kdSatuanHasil' : 0,
			'kdMetodeHitungScore' : 0,
			'kodeExternal' : "string",
			'namaExternal' : "string",
			'statusEnabled': true,
			'noRec': "string",
			'kode': 0
			// 'kdDepartemen': ,

		}
		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			'namaKPI': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl(null, Validators.required),
			// 'kdDepartemen': new FormControl(''),
			'kdKPIHead': new FormControl(null),
			'noUrut': new FormControl(null, Validators.required),
			'kdTypeDataObjek': new FormControl(null),
			'kdSatuanHasil': new FormControl(null),
			'kdMetodeHitungScore': new FormControl(null, Validators.required),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(true, Validators.required),
			'noRec': new FormControl(null),
			// 'kdProfile': new FormControl(''),
			'kode': new FormControl(null),
		});
		// this.form.get('noUrut').disable();

		this.getDataGrid(this.page,this.rows,this.pencarian)
		this.getKdKPIHead();
		this.getKdTypeDataObjek();
		this.getKdSatuanHasil();
		this.getKdMetodeHitungScore();
		this.getSmbrFile();
		
	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
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

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaKPI').value)
	}

	onDestroy() {

	}

	reset(){
		// this.form.get('noUrut').disable();
		this.ngOnInit();
	}  




	clone(cloned: any){
		let fixHub = {
			"namaKPI": cloned.namaKPI,
			"reportDisplay": cloned.reportDisplay,
			"kdKPIHead": cloned.kdKPIHead,
			"noUrut": cloned.noUrut,
			"kdTypeDataObjek": cloned.kdTypeDataObjek,
			"kdSatuanHasil": cloned.kdSatuanHasil,
			"kdMetodeHitungScore": cloned.kdMetodeHitungScore,
			"kodeExternal" : cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"statusEnabled" : cloned.statusEnabled,
			"noRec" : cloned.noRec,
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


	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    getDataGrid(page: number, rows: number, cari:string) {
    	this.httpService.get(Configuration.get().dataMasterNew + '/kpi/findAll?page='+page+'&rows='+rows+'&dir=namaKPI&sort=desc&namaKPI='+cari).subscribe(table => {
    		this.listData = table.KPI;
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
            this.httpService.get(Configuration.get().dataMasterNew + '/kpi/findAll?rows='+totalRecords+'&dir=namaKPI&sort=desc').subscribe(table => {
                totalData = table.KPI;
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
    	this.httpService.get(Configuration.get().dataMasterNew + '/kpi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKPI&sort=desc&namaKPI=' + this.pencarian).subscribe(table => {
                this.listData = table.KPI;
            });
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
        let statusEnabled = this.form.get('statusEnabled').value;
            let noUrut = this.form.get('noUrut').value;
            
            if (noUrut == 0 && statusEnabled == true){
                this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
            }
            else if (noUrut != 0 && statusEnabled == false){
                this.form.get('noUrut').setValue(0)
                this.httpService.update(Configuration.get().dataMasterNew + '/kpi/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.ngOnInit();
                });
            }
            else {
    	this.httpService.update(Configuration.get().dataMasterNew + '/kpi/update/' + this.versi, this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
    	});
    }
    }

    simpan() {
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
    		// let noUrut = this.totalRecords + 1;
    		// this.form.get('noUrut').enable();
    		// this.form.get('noUrut').setValue(noUrut);
    		this.httpService.post(Configuration.get().dataMasterNew + '/kpi/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }

    onSubmit() {
    	if (this.form.invalid) {
    		this.validateAllFormFields(this.form);
    		this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    	} else {
    		this.simpan();
    	}
    }


    hapus() {
    	this.httpService.delete(Configuration.get().dataMasterNew + '/kpi/del/' + this.form.get('kode').value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
    	let kode = this.form.get('kode').value;
    	if (kode == null || kode == undefined || kode == "") {
    		this.alertService.warn('Peringatan', 'Pilih Daftar Master Visi');
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

    getKdKPIHead() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=KPI&select=namaKPI,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdKPIHead = [];
    		this.kdKPIHead.push({label:'--Pilih Data Parent KPI--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdKPIHead.push({label:res.data.data[i].namaKPI, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdKPIHead = [];
    		this.kdKPIHead.push({label:'-- '+ error +' --', value:''})
    	});

    }

    getKdTypeDataObjek() {
    	this.httpService.get(Configuration.get().dataMaster+'/type-data-objek/findAll?page=1&rows=10&dir=namaTypeDataObjek&sort=desc').subscribe(res => {
    		this.kdTypeDataObjek = [];
    		this.kdTypeDataObjek.push({label:'--Pilih Type Data Objek--', value:''})
    		for(var i=0;i<res.TypeDataObjek.length;i++) {
    			this.kdTypeDataObjek.push({label:res.TypeDataObjek[i].namaTypeDataObjek, value:res.TypeDataObjek[i].kode})
    		};
    	},
    	error => {
    		this.kdTypeDataObjek = [];
    		this.kdTypeDataObjek.push({label:'-- '+ error +' --', value:''})
    	});

    }

    getKdSatuanHasil() {

		this.httpService.get(Configuration.get().dataBSC+'/kpi/findSatuanHasilMasterKPI').subscribe(res => {
    		this.kdSatuanHasil = [];
    		this.kdSatuanHasil.push({label:'--Pilih Satuan Hasil--', value:''})
    		for(var i=0;i<res.data.length;i++) {
    			this.kdSatuanHasil.push({label:res.data[i].namaSatuanHasil, value:res.data[i].kode.kode})
    		};
    	},
    	error => {
    		this.kdSatuanHasil = [];
    		this.kdSatuanHasil.push({label:'-- '+ error +' --', value:''})
		});
		
    	// this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=SatuanHasil&select=namaSatuanHasil,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    	// 	this.kdSatuanHasil = [];
    	// 	this.kdSatuanHasil.push({label:'--Pilih Satuan Hasil--', value:''})
    	// 	for(var i=0;i<res.data.data.length;i++) {
    	// 		this.kdSatuanHasil.push({label:res.data.data[i].namaSatuanHasil, value:res.data.data[i].id_kode})
    	// 	};
    	// },
    	// error => {
    	// 	this.kdSatuanHasil = [];
    	// 	this.kdSatuanHasil.push({label:'-- '+ error +' --', value:''})
    	// });

    }

    getKdMetodeHitungScore() {

		this.httpService.get(Configuration.get().dataBSC+'/kpi/findMetodePerhituanganMasterKPI').subscribe(res => {
    		this.kdMetodeHitungScore = [];
    		this.kdMetodeHitungScore.push({label:'--Pilih Metode Hitung Score--', value:''})
    		for(var i=0;i<res.data.length;i++) {
    			this.kdMetodeHitungScore.push({label:res.data[i].namaMetodeHitung, value:res.data[i].kode.kode})
    		};
    	},
    	error => {
    		this.kdMetodeHitungScore = [];
    		this.kdMetodeHitungScore.push({label:'-- '+ error +' --', value:''})
    	});

    	// this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=MetodePerhitungan&select=namaMetodeHitung,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    	// 	this.kdMetodeHitungScore = [];
    	// 	this.kdMetodeHitungScore.push({label:'--Pilih Metode Hitung Score--', value:''})
    	// 	for(var i=0;i<res.data.data.length;i++) {
    	// 		this.kdMetodeHitungScore.push({label:res.data.data[i].namaMetodeHitung, value:res.data.data[i].id_kode})
    	// 	};
    	// },
    	// error => {
    	// 	this.kdMetodeHitungScore = [];
    	// 	this.kdMetodeHitungScore.push({label:'-- '+ error +' --', value:''})
    	// });

    }

    downloadExcel() {
    	this.httpService.get(Configuration.get().dataMasterNew + '/kpi/findAll?').subscribe(table => {
    		this.listData2 = table.KPI;
    		this.codes = [];

    		for (let i = 0; i<this.listData2.length; i++){
    			this.codes.push({

    				kode: this.listData2[i].kode.kode,
    				namaKPIHead: this.listData2[i].namaKPIHead,
    				namaTypeDataObjek: this.listData2[i].namaTypeDataObjek,
    				namaSatuanHasil: this.listData2[i].namaSatuanHasil,
    				namaMetodeHitung: this.listData2[i].namaMetodeHitung,
    				namaKPI: this.listData2[i].namaKPI,
    				noUrut: this.listData2[i].noUrut,
    				reportDisplay: this.listData2[i].reportDisplay,
    				kodeExternal: this.listData2[i].kodeExternal,
    				namaExternal: this.listData2[i].namaExternal,
    				statusEnabled: this.listData2[i].statusEnabled
    			})
    		}
    		this.fileService.exportAsExcelFile(this.codes, 'KPI');
    	});

    }

    downloadPdf() {
		let cetak = Configuration.get().report + '/KPI/laporanKPI.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    	// var col = ["Kode", "Parent", "Tipe Data Objek", "Satuan Hasil", "Metode Hitung", "Nama KPI", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    	// this.httpService.get(Configuration.get().dataMasterNew + '/kpi/findAll?').subscribe(table => {
    	// 	this.listData2 = table.KPI;
    	// 	this.codes = [];

    	// 	for (let i = 0; i<this.listData2.length; i++){
    	// 		this.codes.push({

    	// 			kode: this.listData2[i].kode.kode,
    	// 			namaKPIHead: this.listData2[i].namaKPIHead,
    	// 			namaTypeDataObjek: this.listData2[i].namaTypeDataObjek,
    	// 			namaSatuanHasil: this.listData2[i].namaSatuanHasil,
    	// 			namaMetodeHitung: this.listData2[i].namaMetodeHitung,
    	// 			namaKPI: this.listData2[i].namaKPI,
    	// 			noUrut: this.listData2[i].noUrut,
    	// 			reportDisplay: this.listData2[i].reportDisplay,
    	// 			kodeExternal: this.listData2[i].kodeExternal,
    	// 			namaExternal: this.listData2[i].namaExternal,
    	// 			statusEnabled: this.listData2[i].statusEnabled
    	// 		})
    	// 	}
    	// 	this.fileService.exportAsPdfFile("Master KPI", col, this.codes, "KPI");

    	// });

	}

	cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/KPI/laporanKPI.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKPI_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
	
	


}

