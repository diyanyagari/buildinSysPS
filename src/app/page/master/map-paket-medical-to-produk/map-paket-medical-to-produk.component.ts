import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MapPaketMedicalToProduk } from './map-paket-medical-to-produk.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService,AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-paket-medical-to-produk',
  templateUrl: './map-paket-medical-to-produk.component.html',
  styleUrls: ['./map-paket-medical-to-produk.component.scss'],
	providers: [ConfirmationService]
})
export class MapPaketMedicalToProdukComponent implements OnInit {
  item:MapPaketMedicalToProduk = new InisialMapPaketMedicalToProduk ();
  selected: MapPaketMedicalToProduk;
  listData: any[];
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  kode:any;
  id:any;
  codes: MapPaketMedicalToProduk[];
  value:any;   
  page: number;
  id_kode:any;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  pencarian: string = '';
  kategoriPegawai: MapPaketMedicalToProduk[];  
  masaKerja: MapPaketMedicalToProduk[];  
  jabatan: MapPaketMedicalToProduk[];  
  hubunganKeluarga: MapPaketMedicalToProduk[];  
  namaPaket: MapPaketMedicalToProduk[];    
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
          'noSk': new FormControl('', Validators.required),
          'namaSk': new FormControl('', Validators.required),                    
          'tglAwal': new FormControl('', Validators.required),
          'tglAkhir': new FormControl('', Validators.required),
          'kategoriPegawai': new FormControl('', Validators.required),
          'masaKerja': new FormControl('', Validators.required),
          'jabatan': new FormControl('', Validators.required),          
          'hubunganKeluarga':  new FormControl('', Validators.required),
          'namaPaket':  new FormControl('', Validators.required),          
      });

  }

valuechange(newValue) {
//	this.toReport = newValue;
  this.report = newValue;
}

  downloadExcel() {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Paket&select=id.kode,namaPaket,kodeExternal,namaExternal').subscribe(table => {
         this.listData = table.data.data;  
    this.codes = []; 
     
        for (let i=0; i<this.listData.length;i++)
          { 
        this.codes.push({
        
      kode :this.listData[i].id_kode,
              kodeExternal:this.listData[i].kodeExternal,
              namaExternal:this.listData[i].namaExternal,				
           
      })
           
           debugger;
          }
          this.fileService.exportAsExcelFile(this.codes, 'Paket');
      });

  }

  downloadPdf() {
    var col = ["Kode", "Nama Paket","Kode External","Nama External"];
    this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Paket&select=id.kode,namaPaket,kodeExternal,namaExternal').subscribe(table => {
        this.listData = table.data.data;
   
  
    this.codes = []; 
     
        for (let i=0; i<this.listData.length;i++)
          { 
        this.codes.push({
        
      code :this.listData[i].id_kode,
              nama :this.listData[i].namaPaket,
              kodeEx:this.listData[i].kodeExternal,
              namaEx:this.listData[i].namaExternal,				
           
      })
           
           debugger;
          }
    this.fileService.exportAsPdfFile("Master Paket", col,this.codes, "Paket");
        debugger;
        console.log(JSON.stringify(this.codes));
      });
  
  
     

  }
  
  getPage(page: number, rows: number, search: any) {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-page?table=Paket&select=*&page=' + page + '&rows=' + rows).subscribe(table => {
          this.listData = table.data.data;
          this.totalRecords = table.data.totalRow;
    
      });
      
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryPegawai&select=namaKategoryPegawai,id').subscribe(res => {
        this.kategoriPegawai = [];
        this.kategoriPegawai.push({ label: '--Silahkan Pilih Kategori Pegawai--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
        };
      });
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
        this.masaKerja = [];
        this.masaKerja.push({ label: '--Silahkan Pilih Masa Kerja--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.masaKerja.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
        };
      });
      
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Jabatan&select=namaJabatan,id').subscribe(res => {
        this.jabatan = [];
        this.jabatan.push({ label: '--Silahkan Pilih Jabatan--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.jabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
        };
      });

      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
        this.hubunganKeluarga = [];
        this.hubunganKeluarga.push({ label: '--Silahkan Pilih Hubungan Keluarga--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.hubunganKeluarga.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
        };
      });

      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
        this.namaPaket = [];
        this.namaPaket.push({ label: '--Silahkan Pilih Nama Paket--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.namaPaket.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
        };
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
      this.httpService.update(Configuration.get().dataMasterNew + '/Paket/update/' + this.versi, this.form.value).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Diperbarui');
          this.getPage(this.page, this.rows, this.pencarian);
          this.reset();
      });
  }

  simpan() {
      if (this.formAktif == false) {
          this.confirmUpdate()
      } else {
          this.httpService.post(Configuration.get().dataMasterNew + '/Paket/save?', this.form.value).subscribe(response => {
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
  clone(cloned: MapPaketMedicalToProduk): MapPaketMedicalToProduk {
      let hub = new InisialMapPaketMedicalToProduk();
      for (let prop in cloned) {
          hub[prop] = cloned[prop];
      }
      let fixHub = new InisialMapPaketMedicalToProduk();
      fixHub = {
          "kode": hub.id.kode,
          "namaPaket": hub.namaPaket,
          "reportDisplay": hub.reportDisplay,
          "kodeExternal": hub.kodeExternal,
          "namaExternal": hub.namaExternal,
          "statusEnabled": true
      }
      this.versi = hub.version;
      return fixHub;
  }
  hapus() {
      let item = [...this.listData];
      let deleteItem = item[this.findSelectedIndex()];
      this.httpService.delete(Configuration.get().dataMasterNew + '/Paket/del/' + deleteItem.id.kode).subscribe(response => {
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

class InisialMapPaketMedicalToProduk implements MapPaketMedicalToProduk {

  constructor(
      public Paket?,
      public id?,
      public kdProfile?,
      public kode?,
      public kdPaket?,
      public namaPaket?,
      public reportDisplay?,
      public kodeExternal?,
      public namaExternal?,
      public statusEnabled?,
      public version?,
  public id_kode?,
  public code?,
  public nama?,
  public kodeEx?,
  public namaEx?
  
  ) { }

}