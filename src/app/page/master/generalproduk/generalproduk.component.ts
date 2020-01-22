    import { Inject, forwardRef, Component, OnInit } from '@angular/core';
    import { HttpClient } from '../../../global/service/HttpClient';
    import { Observable } from 'rxjs/Rx';
    import { GeneralProduk } from './generalproduk.interface';
    import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
    import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
    import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
    @Component({
    selector: 'app-generalproduk',
    templateUrl: 'generalproduk.component.html',
    styleUrls: ['generalproduk.component.scss'],
    providers: [ConfirmationService]
    })
    export class GeneralProdukComponent implements OnInit {
    
      item: GeneralProduk = new InisialGeneralProduk();
      selected: GeneralProduk;
      listData: any[];
      dataDummy: {};
      versi: any;
      form: FormGroup;
      formAktif: boolean
      items: MenuItem[];
      pencarian: string;
      report: any;
      toReport: any;
      totalRecords: number;
      page: number;
      rows: number;
      codes: any[];
      kdprof:any;
      kddept:any;
      laporan: boolean = false;
      smbrFile:any; 
      namaFoto: any;
      foto: any;
      smbrFoto: string;
      dropdownnegara:any;
      dropdownnegara2:any;
      dropdowngJenisProduk:any;
      valJenishead:any;
      kdNegaraTableChoose:any="";
    
      constructor(
        private alertService: AlertService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {
      }
      ngOnInit() {
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;
        if (this.page == undefined || this.rows == undefined) {
          this.page = Configuration.get().page;
          this.rows = Configuration.get().rows;
        }
        this.pencarian = ''; 
        this.formAktif = true;
        this.get(this.page, this.rows, this.pencarian);
        this.form = this.fb.group({
       'kode': new FormControl(null), 
       'namaGeneralProduk': new FormControl('',Validators.required),
       'reportDisplay': new FormControl('',Validators.required),
       'descNamaStrukturKimia': new FormControl(null),
       'descRumusBangun': new FormControl(null),
       'descFisikokimia': new FormControl(null),
       'descKeteranganLainnya': new FormControl(null),
       'golongan': new FormControl(null),
       'indikasi': new FormControl(null),
       'p3OffLabel': new FormControl(null),
       'dosisCPFrekLP': new FormControl(null),
       'farmakologi': new FormControl(null),
       'stabilitasPenyimpanan': new FormControl(null),
       'kontraIndikasi': new FormControl(null),
       'peringatanPerhatian': new FormControl(null),
       'reaksiObatTdkDikehendaki': new FormControl(null),
       'interaksiDgnMakanan': new FormControl(null),
       'monitoringPasien': new FormControl(null),
       'bentukKekuatan': new FormControl(null),
       'daftarPustaka': new FormControl(null),
       'kdGeneralJenisProduk': new FormControl('',Validators.required),
       'kdNegara': new FormControl('',Validators.required),
       'keteranganLainnya': new FormControl(null),
       'kodeExternal': new FormControl(null),
       'namaExternal': new FormControl(null),
       'statusEnabled': new FormControl('',Validators.required),
        });
        this.items = [																																																																																	
        {                                                                                                                                                                                                                                                                                                                                                
          label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {                                                                                                                                                                                                                                                                                          
            this.downloadPdf();                                                                                                                                                                                                                                                                                                                          
          }                                                                                                                                                                                                                                                                                                                                              
        },                                                                                                                                                                                                                                                                                                                                               
        {                                                                                                                                                                                                                                                                                                                                                
          label: 'Exel', icon: 'fa-file-excel-o', command: () => {                                                                                                                                                                                                                                                                                       
            this.downloadExel();                                                                                                                                                                                                                                                                                                                         
          }                                                                                                                                                                                                                                                                                                                                              
        }];                                                                                                                                                                                                                                                                                                                                              
        this.getSmbrFile();  
        this.getNegara();                                                                                                                                                                                                                                                                                                                            
     }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                         
     getNegara() {
        this.dropdownnegara = [];
        this.dropdownnegara2 =[];
        this.dropdownnegara.push({ label: '--Pilih Negara--', value: '' })        
        this.dropdownnegara2.push({ label: '-- Semua --', value: '' })
        this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
            for (var i = 0; i < res.Negara.length; i++) {
                this.dropdownnegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
                this.dropdownnegara2.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })                
            };
        });
      }         

      getDataByNegara(event){
        if(event.value!="" && event.value!=undefined){
           this.getDataNegara2(event.value);
        }
      }     

      getDataNegara2(kdnegara) {    
        this.dropdowngJenisProduk =[];
        this.dropdowngJenisProduk.push({ label: '--Pilih--', value: '' });  
      
          this.httpService.get(Configuration.get().dataMaster + '/generaljenisproduk/findAllData?kdNegara='+kdnegara).subscribe(res => {
            for (var i = 0; i < res.data.length; i++) {
                this.dropdowngJenisProduk.push({ label: res.data[i].generalJenisProduk, value: res.data[i].kode.kode })            
            };

              this.form.get("kdGeneralJenisProduk").setValue(this.valJenishead);  
              this.valJenishead='';
          }); 

       }                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                         
      getSmbrFile(){                                                                                                                                                                                                                                                                                                                                     
    		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {                                                                                                                                                                                                                                       
    			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';                                                                                                                                                                                                                       
    		});                                                                                                                                                                                                                                                                                                                                         
    	}        
        addHeader(event) {
            this.httpService.beforeUploadFile(event);
        }
        urlUpload() {
            return Configuration.get().resourceFile + '/file/upload?noProfile=false';
        }

        fileUpload(event) {
            this.namaFoto = event.xhr.response;
            this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.namaFoto;
        }                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                         
      get(page: number, rows: number, search: any) {                                                                                                                                                                                                                                                                                        
        this.httpService.get(Configuration.get().dataMasterNew + '/generalproduk/findAll?page=' + page + '&rows=' + rows + '&dir=namaGeneralProduk&sort=desc&namaGeneralProduk='+ search+ '&kdNegara='+ this.kdNegaraTableChoose).subscribe(table => {                                                                                                      
          this.listData = table.GeneralProduk;                                                                                                                                                                                                                                                                                                   
          this.totalRecords = table.totalRow;                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                         
        });                                                                                                                                                                                                                                                                                                                                              
      }                                                                                                                                                                                                                                                                                                                                                  
      loadPage(event: LazyLoadEvent) {                                                                                                                                                                                                                                                                                                                   
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);                                                                                                                                                                                                                                                
        this.page = (event.rows + event.first) / event.rows;                                                                                                                                                                                                                                                                                             
        this.rows = event.rows;                                                                                                                                                                                                                                                                                                                          
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                         
      cari() {                                                                                                                                                                                                                                                                                                                                           
        this.httpService.get(Configuration.get().dataMasterNew + '/generalproduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaGeneralProduk&sort=desc&namaGeneralProduk=' + this.pencarian+ '&kdNegara='+ this.kdNegaraTableChoose).subscribe(table => {                                                     
         this.listData = table.GeneralProduk;                                                                                                                                                                                                                                                                                                    
        });                                                                                                                                                                                                                                                                                                                                              
      }                                                                                                                                                                                                                                                                                                                                                  
      valuechange(newValue) {                                                                                                                                                                                                                                                                                                                            
        this.report = newValue;                                                                                                                                                                                                                                                                                                                          
      }       
       filterdata(event){
        this.kdNegaraTableChoose = event.value;
          this.httpService.get(Configuration.get().dataMasterNew + '/generalproduk/findAll?page=' + this.page 
            + '&rows=' + this.rows 
            + '&dir=namaGeneralProduk&sort=desc&kdNegara='+ this.kdNegaraTableChoose).subscribe(table => {                                                                                                      
          this.listData = table.GeneralProduk;                                                                                                                                                                                                                                                                                                   
          this.totalRecords = table.totalRow;                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                         
        });    
      }                                                                                                                                                                                                                                                                                                                                               
      downloadExel() {                                                                                                                                                                                                                                                                                                                                   
        this.httpService.get(Configuration.get().dataMasterNew + '/generalproduk/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaGeneralProduk&sort=desc').subscribe(table => {                                                                                                                                       
          this.listData = table.GeneralProduk;                                                                                                                                                                                                                                                                                                   
          this.codes = [];                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                         
          for (let i = 0; i < this.listData.length; i++) {                                                                                                                                                                                                                                                                                               
              this.codes.push({                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                         
                kode: this.listData[i].kode.kode,                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                         
              })                                                                                                                                                                                                                                                                                                                                         
         }                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                         
          this.fileService.exportAsExcelFile(this.codes, 'generalProduk');                                                                                                                                                                                                                                                          
        });                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                         
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      downloadPdf() {                                                                                                                                                                                                                                                                                                                                    
        let cetak = Configuration.get().report + '/generalProduk/laporanGeneralProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';                                                                                                                            
        window.open(cetak);                                                                                                                                                                                                                                                                                                                              
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      confirmDelete() {                                                                                                                                                                                                                                                                                                                                  
        let kode = this.form.get('kode').value;                                                                                                                                                                                                                                                                                                          
        if (kode == null || kode == undefined || kode == "") {                                                                                                                                                                                                                                                                                           
          this.alertService.warn('Peringatan', 'Pilih Daftar Master GeneralProduk');                                                                                                                                                                                                                                                             
        } else {                                                                                                                                                                                                                                                                                                                                         
          this.confirmationService.confirm({                                                                                                                                                                                                                                                                                                             
            message: 'Apakah data akan di hapus?',                                                                                                                                                                                                                                                                                                       
            header: 'Konfirmasi Hapus',                                                                                                                                                                                                                                                                                                                  
            icon: 'fa fa-trash',                                                                                                                                                                                                                                                                                                                         
           accept: () => {                                                                                                                                                                                                                                                                                                                               
             this.hapus();                                                                                                                                                                                                                                                                                                                               
            },                                                                                                                                                                                                                                                                                                                                           
            reject: () => {                                                                                                                                                                                                                                                                                                                              
              this.alertService.warn('Peringatan', 'Data Tidak Dihapus');                                                                                                                                                                                                                                                                                
            }                                                                                                                                                                                                                                                                                                                                            
          });                                                                                                                                                                                                                                                                                                                                            
        }                                                                                                                                                                                                                                                                                                                                                
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      hapus() {                                                                                                                                                                                                                                                                                                                                          
       let item = [...this.listData];                                                                                                                                                                                                                                                                                                                    
        let deleteItem = item[this.findSelectedIndex()];                                                                                                                                                                                                                                                                                                 
        this.httpService.delete(Configuration.get().dataMasterNew + '/generalproduk/del/' + deleteItem.kode.kode +'/' + deleteItem.kdNegara ).subscribe(response => {                                                                                                                                                                                           
          this.alertService.success('Berhasil', 'Data Dihapus');                                                                                                                                                                                                                                                                                         
          this.reset();                                                                                                                                                                                                                                                                                                                                  
        });                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                         
     }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      findSelectedIndex(): number {                                                                                                                                                                                                                                                                                                                      
        return this.listData.indexOf(this.selected);                                                                                                                                                                                                                                                                                                     
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
     reset() {                                                                                                                                                                                                                                                                                                                                          
       this.ngOnInit();
       this.smbrFoto = "";                                                                                                                                                                                                                                                                                                                              
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      confirmUpdate() {                                                                                                                                                                                                                                                                                                                                  
       this.confirmationService.confirm({                                                                                                                                                                                                                                                                                                                
          message: 'Apakah data akan diperbaharui?',                                                                                                                                                                                                                                                                                                     
         header: 'Konfirmasi Pembaharuan',                                                                                                                                                                                                                                                                                                              
          accept: () => {                                                                                                                                                                                                                                                                                                                               
            this.update();                                                                                                                                                                                                                                                                                                                              
          },                                                                                                                                                                                                                                                                                                                                            
          reject: () => {                                                                                                                                                                                                                                                                                                                               
            this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');                                                                                                                                                                                                                                                                            
          }                                                                                                                                                                                                                                                                                                                                             
        });                                                                                                                                                                                                                                                                                                                                             
      }                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                        
      update() {                                                                                                                                                                                                                                                                                                                                        
        this.httpService.update(Configuration.get().dataMasterNew + '/generalproduk/update', this.form.value).subscribe(response => {                                                                                                                                                                                              
          this.alertService.success('Berhasil', 'Data Diperbarui');                                                                                                                                                                                                                                                                                     
          // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
          this.reset();                                                                                                                                                                                                                                                                                                                                 
        });                                                                                                                                                                                                                                                                                                                                             
      }                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                        
      simpan() {                                                                                                                                                                                                                                                                                                                                        
        if (this.formAktif == false) {                                                                                                                                                                                                                                                                                                                  
          this.confirmUpdate()                                                                                                                                                                                                                                                                                                                          
        } else {                                                                                                                                                                                                                                                                                                                                        
          this.httpService.post(Configuration.get().dataMasterNew + '/generalproduk/save', this.form.value).subscribe(response => {                                                                                                                                                                                                
            this.alertService.success('Berhasil', 'Data Disimpan');                                                                                                                                                                                                                                                                                     
            // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                          
            this.reset();                                                                                                                                                                                                                                                                                                                               
          });                                                                                                                                                                                                                                                                                                                                           
        }                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                        
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
      onRowSelect(event) {                                                                                                                                                                                                                                                                                                                              
        this.formAktif = false;         
        let cloned = this.clone(event.data);   
        this.getDataNegara2(cloned.kdNegara);     
        this.form.setValue(cloned);                                                                                                                                                                                                                                                                                                                     
      }                                                                                                                                                                                                                                                                                                                                                 
      clone(cloned: GeneralProduk): GeneralProduk {                                                                                                                                                                                                                                                                                                                       
        let hub = new InisialGeneralProduk();                                                                                                                                                                                                                                                                                                   
        for (let prop in cloned) {                                                                                                                                                                                                                                                                                                                      
          hub[prop] = cloned[prop];                                                                                                                                                                                                                                                                                                                     
        }                                                                                                                                                                                                                                                                                                                                               
        let fixHub = new InisialGeneralProduk();              
        this.valJenishead= hub.kdGeneralJenisProduk;      
        this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + hub.descRumusBangun                                                                                                                                                                                                                                                                                         
        fixHub = {                                                                                                                                                                                                                                                                                                                                      
         "kode": hub.kode.kode,    
         "namaGeneralProduk": hub.namaGeneralProduk,   
         "reportDisplay": hub.reportDisplay,   
         "descNamaStrukturKimia": hub.descNamaStrukturKimia,   
         "descRumusBangun": hub.descRumusBangun,   
         "descFisikokimia": hub.descFisikokimia,   
         "descKeteranganLainnya": hub.descKeteranganLainnya,   
         "golongan": hub.golongan,   
         "indikasi": hub.indikasi,   
         "p3OffLabel": hub.p3OffLabel,   
         "dosisCPFrekLP": hub.dosisCPFrekLP,   
         "farmakologi": hub.farmakologi,   
         "stabilitasPenyimpanan": hub.stabilitasPenyimpanan,   
         "kontraIndikasi": hub.kontraIndikasi,   
         "peringatanPerhatian": hub.peringatanPerhatian,   
         "reaksiObatTdkDikehendaki": hub.reaksiObatTdkDikehendaki,   
         "interaksiDgnMakanan": hub.interaksiDgnMakanan,   
         "monitoringPasien": hub.monitoringPasien,   
         "bentukKekuatan": hub.bentukKekuatan,   
         "daftarPustaka": hub.daftarPustaka,   
         "kdGeneralJenisProduk": hub.kdGeneralJenisProduk,   
         "kdNegara": hub.kdNegara,   
         "keteranganLainnya": hub.keteranganLainnya,   
         "kodeExternal": hub.kodeExternal,   
         "namaExternal": hub.namaExternal,   
         "statusEnabled": hub.statusEnabled,   
        }                                                                                                                                                                                                                                                                                                                                               
        return fixHub;                                                                                                                                                                                                                                                                                                                                  
      }                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                        
      cetak() {                                                                                                                                                                                                                                                                                                                                         
        this.laporan = true;                                                                                                                                                                                                                                                                                                                            
        this.print.showEmbedPDFReport(Configuration.get().report + '/generalProduk/laporanGeneralProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmGeneralProduk(_laporanCetak');                                                                               
    }                                                                                                                                                                                                                                                                                                                                                   
    tutupLaporan() {                                                                                                                                                                                                                                                                                                                                    
      this.laporan = false;                                                                                                                                                                                                                                                                                                                             
    }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                        
    }                                                                                                                                                                                                                                                                                                                                                   
    class InisialGeneralProduk implements GeneralProduk {                                                                                                                                                                                                                                                                               
      constructor(                                                                                                                                                                                                                                                                                                                                      
        public kode?,          
         public namaGeneralProduk?,   
         public reportDisplay?,   
         public descNamaStrukturKimia?,   
         public descRumusBangun?,   
         public descFisikokimia?,   
         public descKeteranganLainnya?,   
         public golongan?,   
         public indikasi?,   
         public p3OffLabel?,   
         public dosisCPFrekLP?,   
         public farmakologi?,   
         public stabilitasPenyimpanan?,   
         public kontraIndikasi?,   
         public peringatanPerhatian?,   
         public reaksiObatTdkDikehendaki?,   
         public interaksiDgnMakanan?,   
         public monitoringPasien?,   
         public bentukKekuatan?,   
         public daftarPustaka?,   
         public kdGeneralJenisProduk?,   
         public kdNegara?,   
         public keteranganLainnya?,   
         public kodeExternal?,   
         public namaExternal?,   
         public statusEnabled?,   
        )                                                                                                                                                                                                                                                                                                                                               
      { }                                                                                                                                                                                                                                                                                                                                               
    }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                            

