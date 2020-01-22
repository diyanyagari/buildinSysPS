// import { Component, OnInit } from '@angular/core';
// import {HttpClient} from '../../../global/service/HttpClient';
// import { Observable } from 'rxjs/Rx';
// import { KondisiProduk } from './kondisi-produk.interface';
// import { Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
// import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
// import { AlertService,  InfoService, Configuration } from '../../../global';
// @Component({
//     selector: 'app-kondisi-produk',
//     templateUrl: './kondisi-produk.component.html',
//     styleUrls: ['./kondisi-produk.component.scss'],
//     providers: [ConfirmationService]
// })
// export class KondisiProdukComponent implements OnInit {

//     // kdDepartemen: any[];
//     selected: KondisiProduk[];
//     listData: KondisiProduk[];
//     pencarian:string;
//     dataDummy: {};
//     formAktif:boolean;
//     versi: any;
//     form: FormGroup;
//     constructor(private alertService : AlertService,
//     	private InfoService: InfoService,
//     	private httpService: HttpClient,
//     	private confirmationService: ConfirmationService,
//     	private fb: FormBuilder) { }


//     ngOnInit() {
//         this.formAktif = true;
//         this.get();
//         this.form = this.fb.group({
//             'kode': new FormControl(null),
//             'namaKondisiProduk': new FormControl('', Validators.required),
//             // 'kdDepartemen': new FormControl('', Validators.required),

//             'reportDisplay': new FormControl('', Validators.required),
//             'namaExternal': new FormControl(''),
//             'kodeExternal': new FormControl(''),
//             'statusEnabled': new FormControl(true)
//         });
//     }
//     get() {
//     	this.httpService.get(Configuration.get().dataMasterNew+'/kondisiproduk/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKondisiProduk&sort=desc').subscribe(table => {
//             this.listData = table.data.KondisiProduk;
//         });
//         // this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
//         //     this.kdDepartemen = [];
//         //     // this.kodeGolonganPegawai.push({label:'--Silahkan Pilih Golongan Pegawai--', value:''})
//         //     for(var i=0;i<res.data.data.length;i++) {
//         //         this.kdDepartemen.push({label:res.data.data[i].namaDepartemen, value:res.data.data[i].id.kode})
//         //     };
//         // });
//     }

//     cari(){
//     	this.httpService.get(Configuration.get().dataMasterNew+'/kondisiproduk/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKondisiProduk&sort=desc&namaKondisiProduk='+this.pencarian).subscribe(table => {
//             this.listData = table.data.KondisiProduk;
//         });
//     }
//     confirmDelete() {
//         this.confirmationService.confirm({
//             message: 'Apakah data akan di hapus?',
//             header: 'Konfirmasi Hapus',
//             icon: 'fa fa-trash',
//             accept: () => {
//                 this.hapus();
//             },
//             reject: () => {
//                 this.alertService.warn('Peringatan','Data Tidak Dihapus');
//             }
//         });
//     }
//     validateAllFormFields(formGroup: FormGroup) {         
//         Object.keys(formGroup.controls).forEach(field => {  
//             const control = formGroup.get(field);             
//             if (control instanceof FormControl) {             
//                 control.markAsTouched({ onlySelf: true });
//             } else if (control instanceof FormGroup) {      
//                 this.validateAllFormFields(control);           
//             }
//         });
//     }
//     onSubmit() {
//         if (this.form.invalid) {
//             this.validateAllFormFields(this.form);
//             this.alertService.warn("Peringatan","Data Tidak Sesuai")
//         } else {
//             this.simpan();
//         }
//     }
//     confirmUpdate() {
//         this.confirmationService.confirm({
//             message: 'Apakah data akan diperbaharui?',
//             header: 'Konfirmasi Pembaharuan',
//             accept: () => {
//                 this.update();
//             },
//             reject: () => {
//                 this.alertService.warn('Peringatan','Data Tidak Diperbaharui');
//             }
//         });
//     }
//     update() {
//         this.httpService.update(Configuration.get().dataMasterNew+'/kondisiproduk/update'+this.versi, this.form.value).subscribe(response =>{
//             this.alertService.success('Berhasil','Data Diperbarui');
//             // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
//             this.get();
//             this.reset();
//         });  
//     }
//     simpan() {
//         if (this.formAktif == false) {
//             this.confirmUpdate()
//         } else {
//             this.httpService.post(Configuration.get().dataMasterNew+'/kondisiproduk/save', this.form.value).subscribe(response =>{
//                 this.alertService.success('Berhasil','Data Disimpan');
//                 // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
//                 this.get();
//                 this.reset();
//             });  
//         }

//     }

//     reset(){
//         this.formAktif = true;
//         this.ngOnInit();
//     }
//     onRowSelect(event) {
//         let cloned = this.clone(event.data);
//         this.formAktif = false;
//         this.form.setValue(cloned);
//         console.log(this.form.value);
//     }
//     clone(cloned: KondisiProduk): KondisiProduk {
//         let hub = new InisialKondisiProduk();
//         for(let prop in cloned) {
//             hub[prop] = cloned[prop];
//         }
//         let fixHub = new InisialKondisiProduk();
//         fixHub = {
//             'kode': hub.id.kode,
//             'namaKondisiProduk': hub.namaKondisiProduk,
//             // 'kdDepartemen': hub.kdDepartemen,
//             'reportDisplay': hub.reportDisplay,
//             'namaExternal': hub.namaExternal,
//             'kodeExternal': hub.kodeExternal,
//             'statusEnabled': hub.statusEnabled
//         }
//         this.versi = hub.version;
//         return fixHub;
//     }
//     hapus() {
//         let item = [...this.listData]; 
//         let deleteItem = item[this.findSelectedIndex()];
//         this.httpService.delete(Configuration.get().dataMasterNew+'/kondisiproduk/del'+deleteItem.id.kode).subscribe(response => {
//             this.alertService.success('Berhasil','Data Dihapus');
//             this.get();
//         });

//     }    

//     findSelectedIndex(): number {
//         return this.listData.indexOf(this.selected);
//     }

//     onDestroy(){

//     }

//     setReportDisplay() {
//         this.form.get('reportDisplay').setValue(this.form.get('namaKondisiProduk').value)
//     }
// }

// class InisialKondisiProduk implements KondisiProduk {

//     constructor(
//         public namaKondisiProduk?,
// 		// public kdDepartemen?,

// 		public kode?,
// 		public id?,
// 		public kdProfile?,
// 		public version?,
// 		public reportDisplay?,
// 		public kodeExternal?,
// 		public namaExternal?,
// 		public statusEnabled?,
//         ) {}

// }



import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'app-kondisi-produk',
    templateUrl: './kondisi-produk.component.html',
    styleUrls: ['./kondisi-produk.component.scss'],
    providers: [ConfirmationService]
})
export class KondisiProdukComponent implements OnInit {
    KondisiProduk: any;
    formAktif: boolean;
    form: FormGroup;

    // kdProfile: any;
    // kdKondisiProduk: any;
    namaKondisiProduk: any;
    reportDisplay: any;
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
    codes:any[];
    items:any;
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
            // 'kdKondisiProduk': 0,
            'namaKondisiProduk': "string",
            'reportDisplay': "string",
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
            // 'kdKondisiProduk': new FormControl('',Validators.required),
            'namaKondisiProduk': new FormControl(null,Validators.required),
            'reportDisplay': new FormControl(null,Validators.required),
            // 'kdDepartemen': new FormControl(''),
            'kodeExternal': new FormControl(null),
            'namaExternal': new FormControl(null),
            'statusEnabled': new FormControl(null, Validators.required),
            'noRec': new FormControl(null),
            // 'kdProfile': new FormControl(''),
            'kode': new FormControl(null),
        });

        this.getDataGrid(this.page,this.rows,this.pencarian);
        this.getSmbrFile();
        
    }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}
    // onSubmit() {
    //     this.simpan();
    // }

    getDataGrid(page: number, rows: number, cari:string) { 
        this.httpService.get(Configuration.get().dataMasterNew + '/kondisiproduk/findAll?page='+page+'&rows='+rows+'&dir=namaKondisiProduk&sort=desc&namaKondisiProduk='+cari).subscribe(table => {
            this.listData = table.KondisiProduk;
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
            // "kdKondisiProduk": cloned.kdKondisiProduk,
            "namaKondisiProduk": cloned.namaKondisiProduk,
            "reportDisplay": cloned.reportDisplay,
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
        this.httpService.update(Configuration.get().dataMasterNew + '/kondisiproduk/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.ngOnInit();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/kondisiproduk/save', this.form.value).subscribe(response => {
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/kondisiproduk/del/' + this.form.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.ngOnInit();
        });
    }


    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kondisi Produk');
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
        this.form.get('reportDisplay').setValue(this.form.get('namaKondisiProduk').value)
    }

    downloadPdf(){
        let b = Configuration.get().report + '/kondisiProduk/laporanKondisiProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kondisiproduk/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKondisiProduk&sort=desc').subscribe(table => {
            this.listData = table.KondisiProduk;
            this.codes = [];
    
            for (let i = 0; i < this.listData.length; i++) {
                this.codes.push({
    
                    kode: this.listData[i].kode.kode,
                    namaKondisiProduk: this.listData[i].namaKondisiProduk,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,
                    statusEnabled: this.listData[i].statusEnabled,
                    reportDisplay: this.listData[i].reportDisplay
    
                })

                }
                this.fileService.exportAsExcelFile(this.codes, 'KondisiProduk');
            });
    
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kondisiProduk/laporanKondisiProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKondisiProduk_laporanCetak');
        // let b = Configuration.get().report + '/kondisiProduk/laporanKondisiProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }
    tutupLaporan() {
        this.laporan = false;
    }

}


