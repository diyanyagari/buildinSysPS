// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '../../../global/service/HttpClient';
// import { Observable } from 'rxjs/Rx';
// import { JenisPaket } from './jenis-paket.interface';
// import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
// import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
// import { FileService,AlertService, InfoService, Configuration } from '../../../global';
// @Component({
//   selector: 'app-jenis-paket',
//   templateUrl: './jenis-paket.component.html',
//   styleUrls: ['./jenis-paket.component.scss'],
// 	providers: [ConfirmationService]
// })
// export class JenisPaketComponent implements OnInit {
//   item:JenisPaket = new InisialJenisPaket ();
//   selected: JenisPaket;
//   listData: any[];
//   codes:JenisPaket[];
//   dataDummy: {};
//   formAktif: boolean;
//   kodeGolonganPegawai: JenisPaket[];
//   ruangan: JenisPaket[];
//   versi: any;
//   form: FormGroup;
//   items: any;
//   kode:any;
//   id:any;
//   value:any;   
//   page: number;
//   id_kode:any;
//   rows: number;
//   totalRecords: number;
//   report: any;
//   toReport: any;
//   pencarian: string = '';
//   jenisPaketHead: JenisPaket[];  
//   // kdDepartemen: JenisPaket[];  
//   constructor(private alertService: AlertService,
//       private InfoService: InfoService,
//       private httpService: HttpClient,
//       private confirmationService: ConfirmationService,
//       private fb: FormBuilder,
//       private fileService: FileService) {
//       this.page = Configuration.get().page;
//       this.rows = Configuration.get().rows;
//   }


//   ngOnInit() {
//       this.items = [
//           {
//               label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
//                   this.downloadPdf();
//               }
//           },
//           {
//               label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
//                   this.downloadExcel();
//               }
//           },
//           /*{label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'},
//           {label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming']}*/
//       ];
//       this.formAktif = true;
//       this.getPage(this.page, this.rows, '');
//       this.versi = null;
//       this.form = this.fb.group({
//           'kode': new FormControl(null),
//           'namaJenisPaket': new FormControl(null, Validators.required),          
//           'namaExternal': new FormControl(null),
//           'kodeExternal': new FormControl(null),
//           'jenisPaketHead': new FormControl(null),
//           // 'jenisPaket': new FormControl('', Validators.required),
//           // 'kdDepartemen': new FormControl('', Validators.required),          
//           'reportDisplay': new FormControl(null, Validators.required),
//           'statusEnabled': new FormControl(true)
//       });

//   }

// valuechange(newValue) {
// //	this.toReport = newValue;
//   this.report = newValue;
// }

//   downloadExcel() {
//       this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Paket&select=id.kode,namaJenisPaket,kodeExternal,namaExternal').subscribe(table => {
//          this.listData = table.data.data;  
//     this.codes = []; 
     
//         for (let i=0; i<this.listData.length;i++)
//           { 
//         this.codes.push({
        
//       kode :this.listData[i].id_kode,
//               kodeExternal:this.listData[i].kodeExternal,
//               namaExternal:this.listData[i].namaExternal,				
           
//       })
           
//            debugger;
//           }
//           this.fileService.exportAsExcelFile(this.codes, 'Paket');
//       });

//   }

//   downloadPdf() {
//     var col = ["Kode", "Nama Paket","Kode External","Nama External"];
//     this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Paket&select=id.kode,namaJenisPaket,kodeExternal,namaExternal').subscribe(table => {
//         this.listData = table.data.data;
   
  
//     this.codes = []; 
     
//         for (let i=0; i<this.listData.length;i++)
//           { 
//         this.codes.push({
        
//       code :this.listData[i].id_kode,
//               nama :this.listData[i].namaJenisPaket,
//               kodeEx:this.listData[i].kodeExternal,
//               namaEx:this.listData[i].namaExternal,				
           
//       })
           
//            debugger;
//           }
//     this.fileService.exportAsPdfFile("Master Paket", col,this.codes, "Paket");
//         debugger;
//         console.log(JSON.stringify(this.codes));
//       });
  
  
     

//   }
  
//   getPage(page: number, rows: number, cari: string) {
//       this.httpService.get(Configuration.get().dataMasterNew + '/jenispaket/findAll?page=' + page + '&rows=' +rows+ '&dir=namaJenisPaket&sort=desc&namaJenisPaket='+cari).subscribe(table => {
//           this.listData = table.data.data;
//           this.totalRecords = table.data.totalRow;
    
//       });

//       this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPaket&select=namaJenisPaket,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
//         this.jenisPaketHead = [];
//         this.jenisPaketHead.push({ label: '--Silahkan Pilih Jenis Paket Head--', value: '' })
//         for (var i = 0; i < res.data.data.length; i++) {
//           this.jenisPaketHead.push({ label: res.data.data[i].namaJenisPaket, value: res.data.data[i].id.kode })
//         };
//       });
    
//       // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
//       //   this.kdDepartemen = [];
//       //   this.kdDepartemen.push({ label: '--Silahkan Pilih Departement--', value: '' })
//       //   for (var i = 0; i < res.data.data.length; i++) {
//       //     this.kdDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
//       //   };
//       // });
//   }

//   cari() {

//       this.getPage(this.page, this.rows, this.pencarian);
//   }

//   loadPage(event: LazyLoadEvent) {
//       this.getPage((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
//   }
//   confirmDelete() {
//       this.confirmationService.confirm({
//           message: 'Apakah data akan di hapus?',
//           header: 'Konfirmasi Hapus',
//           icon: 'fa fa-trash',
//           accept: () => {
//               this.hapus();
//           }
//       });
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
//           }
//       });
//   }
//   update() {
//       this.httpService.update(Configuration.get().dataMasterNew + '/jenispaket/update/' + this.versi, this.form.value).subscribe(response => {
//           this.alertService.success('Berhasil', 'Data Diperbarui');
//           this.getPage(this.page, this.rows, this.pencarian);
//           this.reset();
//       });
//   }

//   simpan() {
//       if (this.formAktif == false) {
//           this.confirmUpdate()
//       } else {
//           this.httpService.post(Configuration.get().dataMasterNew + '/jenispaket/save?', this.form.value).subscribe(response => {
//               this.alertService.success('Berhasil', 'Data Disimpan');
//               // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
//               this.getPage(this.page, this.rows, this.pencarian);
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
//       console.log(this.form.value);
//   }
//   clone(cloned: JenisPaket): JenisPaket {
//       let hub = new InisialJenisPaket();
//       for (let prop in cloned) {
//           hub[prop] = cloned[prop];
//       }
//       let fixHub = new InisialJenisPaket();
//       fixHub = {
//           "kode": hub.id.kode,
//           "namaJenisPaket": hub.namaJenisPaket,
//           "reportDisplay": hub.reportDisplay,
//           "kodeExternal": hub.kodeExternal,
//           "namaExternal": hub.namaExternal,
//           "statusEnabled": true
//       }
//       this.versi = hub.version;
//       return fixHub;
//   }
//   hapus() {
//       let item = [...this.listData];
//       let deleteItem = item[this.findSelectedIndex()];
//       this.httpService.delete(Configuration.get().dataMasterNew + '/jenispaket/del/' + deleteItem.id.kode).subscribe(response => {
//           this.alertService.success('Berhasil', 'Data Dihapus');
//           this.getPage(this.page, this.rows, this.pencarian);
//       });
//       this.reset();
//   }

//   findSelectedIndex(): number {
//       return this.listData.indexOf(this.selected);
//   }
//   onDestroy() {

//   }
// }

// class InisialJenisPaket implements JenisPaket {

//   constructor(
//       public JenisPaket?,
//       public id?,
//       public kdProfile?,
//       public kode?,
//       public kdPaket?,
//       public namaJenisPaket?,
//       public reportDisplay?,
//       public kodeExternal?,
//       public namaExternal?,
//       public statusEnabled?,
//       public version?,
//   public id_kode?,
//   public code?,
//   public nama?,
//   public kodeEx?,
//   public namaEx?
  
//   ) { }

// }



import { Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-jenis-paket',
  templateUrl: './jenis-paket.component.html',
  styleUrls: ['./jenis-paket.component.scss'],
  providers: [ConfirmationService]
})
export class JenisPaketComponent implements OnInit {
  JenisPaket: any;
  formAktif: boolean;
  form: FormGroup;

  // kdProfile: any;
  // kdJenisPaket: any;
  namaJenisPaket: any;
  reportDisplay: any;
  kdJenisPaketHead: any=[];
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

  constructor(private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

    let data = {
      // 'kdJenisPaket': 0,
      'namaJenisPaket': "string",
      'reportDisplay': "string",
      'kdJenisPaketHead': 0,
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
      // 'kdJenisPaket': new FormControl('',Validators.required),
      'namaJenisPaket': new FormControl(null,Validators.required),
      'reportDisplay': new FormControl(null,Validators.required),
      'kdJenisPaketHead': new FormControl(null),
      // 'kdDepartemen': new FormControl(''),
      'kodeExternal': new FormControl(null),
      'namaExternal': new FormControl(null),
      'statusEnabled': new FormControl(null, Validators.required),
      'noRec': new FormControl(null),
      // 'kdProfile': new FormControl(''),
      'kode': new FormControl(null),
    });

    this.getDataGrid(this.page,this.rows,this.pencarian)
    this.getKdJenisPaketHead();
    
  }

  // onSubmit() {
  //   this.simpan();
  // }

  getDataGrid(page: number, rows: number, cari:string) { 
    this.httpService.get(Configuration.get().dataMasterNew + '/jenispaket/findAll?page='+page+'&rows='+rows+'&dir=namaJenisPaket&sort=desc&namaJenisPaket='+cari).subscribe(table => {
      this.listData = table.JenisPaket;
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
        // "kdJenisPaket": cloned.kdJenisPaket,
        "namaJenisPaket": cloned.namaJenisPaket,
        "reportDisplay": cloned.reportDisplay,
        "kdJenisPaketHead": cloned.kdJenisPaketHead,
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
      this.httpService.update(Configuration.get().dataMasterNew + '/jenispaket/update/' + this.versi, this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.ngOnInit();
      });
    }

    simpan() {
      if (this.formAktif == false) {
        this.confirmUpdate()
      } else {
        this.httpService.post(Configuration.get().dataMasterNew + '/jenispaket/save', this.form.value).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.ngOnInit();
        });
      }

    }

    getKdJenisPaketHead() {
      this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=JenisPaket&select=namaJenisPaket,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
        this.kdJenisPaketHead = [];
        this.kdJenisPaketHead.push({label:'--Pilih Data Parent Jenis Paket--', value:''})
        for(var i=0;i<res.data.data.length;i++) {
          this.kdJenisPaketHead.push({label:res.data.data[i].namaJenisPaket, value:res.data.data[i].id_kode})
        };
      },
      error => {
        this.kdJenisPaketHead = [];
        this.kdJenisPaketHead.push({label:'-- '+ error +' --', value:''})
      });

    }

    onDestroy() {

    }

    reset(){
      this.ngOnInit();
    }  

    hapus() {
      this.httpService.delete(Configuration.get().dataMasterNew + '/jenispaket/del/' + this.form.get('kode').value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.ngOnInit();
      });
    }


    confirmDelete() {
      let kode = this.form.get('kode').value;
      if (kode == null || kode == undefined || kode == "") {
        this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Paket');
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
      this.form.get('reportDisplay').setValue(this.form.get('namaJenisPaket').value)
    }

}


