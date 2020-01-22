import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { LoginUserAplikasi } from './login-user-aplikasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService,AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-login-user-aplikasi',
  templateUrl: './login-user-aplikasi.component.html',
  styleUrls: ['./login-user-aplikasi.component.scss'],
  providers: [ConfirmationService]  
})
export class LoginUserAplikasiComponent implements OnInit {
  item:LoginUserAplikasi = new InisialLoginUserAplikasi ();
  selected: LoginUserAplikasi;
  listData: any[];
  codes:LoginUserAplikasi[];
  departemen:LoginUserAplikasi[];    
  dataDummy: {};
  formAktif: boolean;
  kodeGolonganPegawai: LoginUserAplikasi[];
  ruangan: LoginUserAplikasi[];
  versi: any;
  form: FormGroup;
  formDua: FormGroup; 
  formTiga: FormGroup;  
  items: any;
  value: any;    
  kode:any;
  id:any;
  page: number;
  id_kode:any;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  smbrFoto: any;
  pencarian: string = '';
  constructor(private alertService: AlertService,
      private InfoService: InfoService,
      private httpService: HttpClient,
      private confirmationService: ConfirmationService,
      private fb: FormBuilder,
      private fileService: FileService) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
  }


  ngOnInit() {
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
          /*{label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'},
          {label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming']}*/
      ];
      this.formAktif = true;
      this.getPage(this.page, this.rows, '');
      this.versi = null;
      this.form = this.fb.group({
          'namaLengkap': new FormControl(null),
          'noIdentitas': new FormControl(null),
          'jenisKelamin': new FormControl(null),
          'tglLahir': new FormControl(null),
          'photoDiri': new FormControl(null),    
      });
      this.formDua = this.fb.group({
        'noHpEmail': new FormControl('', Validators.required),
        'kataSandi': new FormControl('', Validators.required),
        'ulangiKataSandi': new FormControl('', Validators.required),
        'hintKataSandi': new FormControl('', Validators.required),
        'tglDaftar': new FormControl('', Validators.required),
      });
      this.formTiga = this.fb.group({
        'kelompokUser': new FormControl(null),
      });

  }

fotoDiri(value) {
//	this.toReport = newValue;
  let foto = value;

  this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + foto;
  console.log(this.smbrFoto);
}

  downloadExcel() {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
         this.listData = table.data.data;  
    this.codes = []; 
     
        for (let i=0; i<this.listData.length;i++)
          { 
        this.codes.push({
        
      kode :this.listData[i].id_kode,
              namaAgama :this.listData[i].namaAgama,
              kodeExternal:this.listData[i].kodeExternal,
              namaExternal:this.listData[i].namaExternal,				
           
      })
           
           debugger;
          }
          this.fileService.exportAsExcelFile(this.codes, 'Agama');
      });

  }

  downloadPdf() {
    var col = ["Kode", "Nama Agama","Kode External","Nama External"];
    this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
        this.listData = table.data.data;
   
  
    this.codes = []; 
     
        for (let i=0; i<this.listData.length;i++)
          { 
        this.codes.push({
        
      code :this.listData[i].id_kode,
              nama :this.listData[i].namaAgama,
              kodeEx:this.listData[i].kodeExternal,
              namaEx:this.listData[i].namaExternal,				
           
      })
           
           debugger;
          }
    this.fileService.exportAsPdfFile("Master Agama", col,this.codes, "Agama");
        debugger;
        console.log(JSON.stringify(this.codes));
      });
  
  
     

  }
  getPage(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataHr1Mod1 +'/registrasiPegawai/findPegawai?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaLengkap&sort=asc').subscribe(table => {
      this.listData = table.data.pegawai;
      });
  }
  
  cari() {

      this.getPage(this.page, this.rows, this.pencarian);
  }
  loadPage(event: LazyLoadEvent) {
      this.getPage((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
  }
  confirmDelete() {
      this.confirmationService.confirm({
          message: 'Apakah data akan di hapus?',
          header: 'Konfirmasi Hapus',
          icon: 'fa fa-trash',
          accept: () => {
              this.hapus();
          }
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
      this.httpService.update(Configuration.get().dataMasterNew + '/agama/update/' + this.versi, this.form.value).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Diperbarui');
          this.getPage(this.page, this.rows, this.pencarian);
          this.reset();
      });
  }

  simpan() {
      if (this.formAktif == false) {
          this.confirmUpdate()
      } else {
          this.httpService.post(Configuration.get().dataMasterNew + '/agama/save?', this.form.value).subscribe(response => {
              this.alertService.success('Berhasil', 'Data Disimpan');
              // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
              this.getPage(this.page, this.rows, this.pencarian);
              this.reset();
          });
      }

  }

  reset() {
      this.formAktif = true;
      this.ngOnInit();
  }
  onRowSelect(event) {
      let cloned = this.clone(event.data);
      this.formAktif = false;
      this.form.setValue(cloned);
      console.log(this.form.value);
  }
  clone(cloned: LoginUserAplikasi): LoginUserAplikasi {
      let hub = new InisialLoginUserAplikasi();
      for (let prop in cloned) {
          hub[prop] = cloned[prop];
      }
      let fixHub = new InisialLoginUserAplikasi();
      fixHub = {
          "namaLengkap": hub.namaLengkap,
          "noIdentitas": hub.kdPegawai,
          "jenisKelamin": hub.jenisKelamin,
          "tglLahir": new Date(hub.tglLahir*1000),
          "photoDiri": hub.photoDiri,          
      }
      this.versi = hub.version;
      return fixHub;
  }
  hapus() {
      let item = [...this.listData];
      let deleteItem = item[this.findSelectedIndex()];
      this.httpService.delete(Configuration.get().dataMasterNew + '/LoginUserAplikasi/del/' + deleteItem.id.kode).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          this.getPage(this.page, this.rows, this.pencarian);
      });
      this.reset();
  }

  findSelectedIndex(): number {
      return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialLoginUserAplikasi implements LoginUserAplikasi {

  constructor(
      public namaLengkap?,
      public version?,
      public kdPegawai?,
      public jenisKelamin?,
      public tglLahir?,
      public noIdentitas?,
      public photoDiri?,
  ) { }

}