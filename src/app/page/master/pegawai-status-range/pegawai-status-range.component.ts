import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
	selector: 'app-pegawai-status-range',
	templateUrl: './pegawai-status-range.component.html',
	styleUrls: ['./pegawai-status-range.component.scss'],
	providers: [ConfirmationService]
})
export class PegawaiStatusRangeComponent implements OnInit {
	PegawaiStatusRange: any;
	formAktif: boolean;
	form: FormGroup;

	kdStatus: any=[];
	kdRangeWaktu: any=[];
	persenGaji: any;
    statusEnabled: any;
    noRec: any;

    version: any;

    kode: any;

    kdProfile: any;

    listData: any=[];

    pencarian: string = '';
    dataSimpan: any;

    page: number;
    totalRecords: number;
    rows: number;
    versi:number;

    items: any;

    listData2:any[];
    codes:any[];

    kdprof: any;
    kddept: any;
    laporan: boolean = false;

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
        this.formAktif = true;
        this.form = this.fb.group({
            'kdStatus': new FormControl(null,Validators.required),
            'kdRangeWaktu': new FormControl(null,Validators.required),
            'persenGaji': new FormControl(null,Validators.required),
            'statusEnabled': new FormControl(null,Validators.required),
            // 'kode': new FormControl(null),
            'noRec': new FormControl(''),
            'version': new FormControl(1)
        });
        this.getDataGrid(this.page,this.rows,this.pencarian)
        this.getKdStatus();
        this.getKdRangeWaktu();
    }

    getDataGrid(page: number, rows: number, cari:string) {
     this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiStatusRange/findAll?page='+page+'&rows='+rows+'&dir=persenGaji&sort=desc&persenGaji='+cari).subscribe(table => {
         this.listData = table.persenGaji;
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
    		"kdStatus": cloned.kdStatus,
    		"kdRangeWaktu": cloned.kdRangeWaktu,
    		"persenGaji": cloned.persenGaji,
            "statusEnabled": cloned.statusEnabled,
            // 'kode': cloned.kode.kode,
            "noRec": cloned.noRec,
            "version":cloned.version
        }
        this.versi = cloned.version;
        return fixHub;
    }

    onRowSelect(event) {
    	let cloned = this.clone(event.data);
    	this.formAktif = false;
    	this.form.setValue(cloned);
    }
    
    update() {
    	this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiStatusRange/update/' + this.versi, this.form.value).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Diperbarui');
    		this.ngOnInit();
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
    		this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiStatusRange/save', this.form.value).subscribe(response => {
    			this.alertService.success('Berhasil', 'Data Disimpan');
    			this.ngOnInit();
    		});
    	}

    }

    hapus() {
    	this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiStatusRange/del/' + this.form.get('kdRangeWaktu').value + '/' + this.form.get('kdStatus').value ).subscribe(response => {
    		this.alertService.success('Berhasil', 'Data Dihapus');
    		this.ngOnInit();
    	});
    }


    confirmDelete() {
        let kdStatus = this.form.get('kdStatus').value;
        if (kdStatus == null || kdStatus == undefined || kdStatus == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai Status Range');
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

    getKdStatus() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Status&select=namaStatus,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdStatus = [];
    		this.kdStatus.push({label:'--Pilih Status--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdStatus.push({label:res.data.data[i].namaStatus, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdStatus = [];
    		this.kdStatus.push({label:'-- '+ error +' --', value:''})
    	});

    }

    getKdRangeWaktu() {
    	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Range&select=namaRange,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    		this.kdRangeWaktu = [];
    		this.kdRangeWaktu.push({label:'--Pilih Range Waktu--', value:''})
    		for(var i=0;i<res.data.data.length;i++) {
    			this.kdRangeWaktu.push({label:res.data.data[i].namaRange, value:res.data.data[i].id_kode})
    		};
    	},
    	error => {
    		this.kdRangeWaktu = [];
    		this.kdRangeWaktu.push({label:'-- '+ error +' --', value:''})
    	});

    }

    onDestroy() {

    }

    reset(){
    	this.ngOnInit();
    }  

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiStatusRange/findAll?').subscribe(table => {
            this.listData2 = table.persenGaji;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaStatus: this.listData2[i].namaStatus,
                    namaRange: this.listData2[i].namaRange,
                    persenGaji: this.listData2[i].persenGaji,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'PegawaiStatusRange');
        });

    }
    
    
    downloadPdf(){
        let b = Configuration.get().report + '/pegawaiStatusRange/laporanPegawaiStatusRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';

        window.open(b);
    }
    tutupLaporan() {
        this.laporan = false;
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiStatusRange/laporanPegawaiStatusRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmPegawaiStatusRange_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/pegawaiStatusRange/laporanPegawaiStatusRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }




}


