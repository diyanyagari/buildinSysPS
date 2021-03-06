// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '../../../global/service/HttpClient';
// import { Observable } from 'rxjs/Rx';
// import { BahanProduk } from './bahan-produk.interface';
// import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
// import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
// import { FileService, AlertService, InfoService, Configuration } from '../../../global';
// @Component({
//   selector: 'app-bahan-produk',
//   templateUrl: './bahan-produk.component.html',
//   styleUrls: ['./bahan-produk.component.scss'],
//   providers: [ConfirmationService]
// })
// export class BahanProdukComponent implements OnInit {
//   kodeKelompokProduk: any[];
//   selected: BahanProduk;
//   listData: BahanProduk[];
//   pencarian: string;
//   dataDummy: {};
//   formAktif: boolean;
//   versi: any;
//   form: FormGroup;
//   items: any;
//   page: number;
//   rows: number;
//   totalRecords: number;
//   report: any;
//   toReport: any;

//   constructor(private alertService: AlertService,
//       private InfoService: InfoService,
//       private httpService: HttpClient,
//       private confirmationService: ConfirmationService,
//       private fb: FormBuilder,
//       private fileService: FileService) {

//   }

//   ngOnInit() {
//       if (this.page == undefined || this.rows == undefined) {
//           this.page = Configuration.get().page;
//           this.rows = Configuration.get().rows;
//       }
//       this.formAktif = true;
//       this.get(this.page, this.rows, '');
//       this.form = this.fb.group({
//           'kode': new FormControl(''),
//           'namaBahanProduk': new FormControl('', Validators.required),
//           'kodeKelompokProduk': new FormControl(''),
//           'reportDisplay': new FormControl('', Validators.required),
//           'namaExternal': new FormControl(''),
//           'kodeExternal': new FormControl(''),
//           'statusEnabled': new FormControl('', Validators.required),
//       });
//   }

//   valuechange(newValue) {
//       this.toReport = newValue;
//       this.report = newValue;
//   }

//   get(page: number, rows: number, search: any) {
//       this.httpService.get(Configuration.get().dataMasterNew + '/bahanProduk/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
//           this.listData = table.bahanProduk;
//           this.totalRecords = table.totalRow;
//       });


//       this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokProduk&select=namaKelompokProduk,id').subscribe(res => {
//           this.kodeKelompokProduk = [];
//           this.kodeKelompokProduk.push({ label: '--Pilih Kelompok Produk--', value: '' })
//           for (var i = 0; i < res.data.data.length; i++) {
//               this.kodeKelompokProduk.push({ label: res.data.data[i].namaKelompokProduk, value: res.data.data[i].id.kode })
//           };
//       });

//   }

//   cari() {
//       this.httpService.get(Configuration.get().dataMasterNew + '/bahanProduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaBahanProduk&sort=desc&namaBahanProduk=' + this.pencarian).subscribe(table => {
//           this.listData = table.bahanProduk;
//       });
//   }

//   loadPage(event: LazyLoadEvent) {
//       this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
//       this.page = (event.rows + event.first) / event.rows;
//       this.rows = event.rows;
//       // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
//   }

//   confirmDelete() {
//       let kode = this.form.get('kode').value;
//       if (kode == null || kode == undefined || kode == "") {
//           this.alertService.warn('Peringatan', 'Pilih Daftar Master Bahan Produk');
//       } else {
//           this.confirmationService.confirm({
//               message: 'Apakah data akan di hapus?',
//               header: 'Konfirmasi Hapus',
//               icon: 'fa fa-trash',
//               accept: () => {
//                   this.hapus();
//               },
//               reject: () => {
//                   this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
//               }
//           });
//       }
//   }

//   validateAllFormFields(formGroup: FormGroup) {
//       Object.keys(formGroup.controls).forEach(field => {
//           const control = formGroup.get(field);
//           if (control instanceof FormControl) {
//               control.markAsTouched({ onlySelf: true });
//           } else if (control instanceof FormGroup) {
//               this.validateAllFormFields(control);
//           }
//       });
//   }

//   onSubmit() {
//       if (this.form.invalid) {
//           this.validateAllFormFields(this.form);
//           this.alertService.warn("Peringatan", "Data Tidak Sesuai")
//       } else {
//           this.simpan();
//       }
//   }

//   confirmUpdate() {
//       this.confirmationService.confirm({
//           message: 'Apakah data akan diperbaharui?',
//           header: 'Konfirmasi Pembaharuan',
//           accept: () => {
//               this.update();
//           },
//           reject: () => {
//               this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
//           }
//       });
//   }

//   update() {
//       this.httpService.update(Configuration.get().dataMasterNew + '/bahanProduk/update' + this.versi, this.form.value).subscribe(response => {
//           this.alertService.success('Berhasil', 'Data Diperbarui');
//           this.get(this.page, this.rows, this.pencarian);
//           this.reset();
//       });
//   }

//   simpan() {
//       if (this.formAktif == false) {
//           this.confirmUpdate()
//       } else {
//           this.httpService.post(Configuration.get().dataMasterNew + '/bahanProduk/save', this.form.value).subscribe(response => {
//               this.alertService.success('Berhasil', 'Data Disimpan');
//               this.get(this.page, this.rows, this.pencarian);
//               this.reset();
//           });
//       }

//   }

//   reset() {
//       this.formAktif = true;
//       this.ngOnInit();
//   }

//   onRowSelect(event) {
//       let cloned = this.clone(event.data);
//       this.formAktif = false;
//       this.form.setValue(cloned);
//   }

//   clone(cloned: BahanProduk): BahanProduk {
//       let hub = new InisialBahanProduk();
//       for (let prop in cloned) {
//           hub[prop] = cloned[prop];
//       }
//       let fixHub = new InisialBahanProduk();
//       fixHub = {
//           'kode': hub.kode.kode,
//           'namaBahanProduk': hub.namaBahanProduk,
//           'kodeKelompokProduk': hub.kodeKelompokProduk,
//           'reportDisplay': hub.reportDisplay,
//           'namaExternal': hub.namaExternal,
//           'kodeExternal': hub.kodeExternal,
//           'statusEnabled': hub.statusEnabled
//       }
//       this.versi = hub.version;
//       return fixHub;
//   }
//   hapus() {
//       let item = [...this.listData];
//       let deleteItem = item[this.findSelectedIndex()];
//       this.httpService.delete(Configuration.get().dataMasterNew + '/bahanProduk/del/' + deleteItem.kode.kode).subscribe(response => {
//           this.get(this.page, this.rows, this.pencarian);

//       });
//       this.reset();
//   }

//   findSelectedIndex(): number {
//       return this.listData.indexOf(this.selected);
//   }
//   onDestroy() {

//   }
// }

// class InisialBahanProduk implements BahanProduk {

//   constructor(

//       public kodeKelompokProduk?,
//       public namaBahanProduk?,
//       // public kdDepartemen?,

//       public kode?,
//       public id?,
//       public kdProfile?,
//       public version?,
//       public reportDisplay?,
//       public kodeExternal?,
//       public namaExternal?,
//       public statusEnabled?,
//   ) { }

// }




import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-bahan-produk',
  templateUrl: './bahan-produk.component.html',
  styleUrls: ['./bahan-produk.component.scss'],
  providers: [ConfirmationService]
})
export class BahanProdukComponent implements OnInit {
  BahanProduk: any;
  formAktif: boolean;
  form: FormGroup;

  // kdProfile: any;
  // kdBahanProduk: any;
  namaBahanProduk: any;
  reportDisplay: any;
  kdKelompokProduk: any=[];
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

  items:any;
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

    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

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
      // 'kdBahanProduk': 0,
      'namaBahanroduk': "string",
      'reportDisplay': "string",
      'kdKelompokProduk': 0,
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
      // 'kdBahanProduk': new FormControl('',Validators.required),
      'namaBahanProduk': new FormControl('',Validators.required),
      'reportDisplay': new FormControl('',Validators.required),
      'kdKelompokProduk': new FormControl(null),
      // 'kdDepartemen': new FormControl(''),
      'kodeExternal': new FormControl(null),
      'namaExternal': new FormControl(null),
      'statusEnabled': new FormControl('', Validators.required),
      'noRec': new FormControl(null),
      // 'kdProfile': new FormControl(''),
      'kode': new FormControl(null),
    });

    this.getDataGrid(this.page,this.rows,this.pencarian);
    this.getKdKelompokProduk();
    
  }

  // onSubmit() {
  //   this.simpan();
  // }

  getDataGrid(page: number, rows: number, cari:string) { 
    this.httpService.get(Configuration.get().dataMasterNew + '/bahanProduk/findAll?page='+page+'&rows='+rows+'&dir=namaBahanProduk&sort=desc&namaBahanProduk='+cari).subscribe(table => {
      this.listData = table.bahanProduk;
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
        // "kdBahanProduk": cloned.kdBahanProduk,
        "namaBahanProduk": cloned.namaBahanProduk,
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
      this.httpService.update(Configuration.get().dataMasterNew + '/bahanProduk/update/' + this.versi, this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.ngOnInit();
      });
    }

    simpan() {
      if (this.formAktif == false) {
        this.confirmUpdate()
      } else {
        this.httpService.post(Configuration.get().dataMasterNew + '/bahanProduk/save', this.form.value).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.ngOnInit();
        });
      }

    }

    getKdKelompokProduk() {
      this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=KelompokProduk&select=namaKelompokProduk,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
        this.kdKelompokProduk = [];
        this.kdKelompokProduk.push({label:'--Pilih Kelompok Produk--', value:null})
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
      this.httpService.delete(Configuration.get().dataMasterNew + '/bahanProduk/del/' + this.form.get('kode').value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.ngOnInit();
      });
    }


    confirmDelete() {
      let kode = this.form.get('kode').value;
      if (kode == null || kode == undefined || kode == "") {
        this.alertService.warn('Peringatan', 'Pilih Daftar Master Bahan Produk');
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
      this.form.get('reportDisplay').setValue(this.form.get('namaBahanProduk').value)
    }

    downloadExcel() {
      this.httpService.get(Configuration.get().dataMasterNew + '/bahanProduk/findAll?').subscribe(table => {
        this.listData2 = table.bahanProduk;
        this.codes = [];

        for (let i = 0; i < this.listData2.length; i++) {
          this.codes.push({

            kode: this.listData2[i].kode.kode,
            namaKelompokProduk: this.listData2[i].namaKelompokProduk,
            namaBahanroduk: this.listData2[i].namaBahanroduk,
            reportDisplay: this.listData2[i].reportDisplay,
            kodeExternal: this.listData2[i].kodeExternal,
            namaExternal: this.listData2[i].namaExternal,
            statusEnabled: this.listData2[i].statusEnabled,

          })

        }
        this.fileService.exportAsExcelFile(this.codes, 'BahanProduk');
      });

    }


    downloadPdf(){
      let b = Configuration.get().report + '/bahanProduk/laporanBahanProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';

      window.open(b);
    }

    cetak() {
      this.laporan = true;
      this.print.showEmbedPDFReport(Configuration.get().report + '/bahanProduk/laporanBahanProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmBahanProduk_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/bahanProduk/laporanBahanProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
      }
      tutupLaporan() {
        this.laporan = false;
    }

    }


