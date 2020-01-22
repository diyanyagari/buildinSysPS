    import { Inject, forwardRef, Component, OnInit } from '@angular/core';
    import { HttpClient } from '../../../global/service/HttpClient';
    import { Observable } from 'rxjs/Rx';
    import { HargaNettoDiscPasienPulang } from './harganettodiscpasienpulang.interface';
    import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
    import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
    import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
    import { Router } from "@angular/router";
    @Component({
    selector: 'app-harganettodiscpasienpulang',
    templateUrl: 'harganettodiscpasienpulang.component.html',
    styleUrls: ['harganettodiscpasienpulang.component.scss'],
    providers: [ConfirmationService]
    })
    export class HargaNettoDiscPasienPulangComponent implements OnInit {
    
      item: HargaNettoDiscPasienPulang = new InisialHargaNettoDiscPasienPulang();
      selected: HargaNettoDiscPasienPulang;
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
      namaSK: any[];
      dropdownproduk : any[];
      dropdownkomponenHarga : any[];
      dropdownrange: any[];
      constructor(
        private alertService: AlertService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,   
        private route: Router,
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
       'namaSuratKeputusan': new FormControl(null, Validators.required), 
       'noSkIntern': new FormControl(''),
       'tglBerlakuAwal': new FormControl(),
       'tglBerlakuAkhir': new FormControl(),
       'kdProduk': new FormControl('',Validators.required),
       'kdKomponenHarga': new FormControl('',Validators.required),
       'kdRange': new FormControl('',Validators.required),
       'noSK': new FormControl('',Validators.required),
       'persenDiscount': new FormControl('',Validators.required),
       'hargaDiscount': new FormControl(null),
       'statusEnabled': new FormControl('',Validators.required),
        });   
        this.form.get('tglBerlakuAwal').disable();
        this.form.get('tglBerlakuAkhir').disable();
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
        this.gets();                       
                                                                                                                                                                                                                                                                                                                  
     }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                         
      getSmbrFile(){                                                                                                                                                                                                                                                                                                                                     
    		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {                                                                                                                                                                                                                                       
    			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';                                                                                                                                                                                                                       
    		});                                                                                                                                                                                                                                                                                                                                         
    	}                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                         
      gets(){
          this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/findSK').subscribe(res => {
            this.namaSK = [];
            this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
            for (var i = 0; i < res.SK.length; i++) {
              this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
            };
          });     
          //produk
         this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getProduk').subscribe(res => {
            this.dropdownproduk = [];
            this.dropdownproduk.push({ label: '--Pilih--', value: '' })
            for (var i = 0; i < res.produk.length; i++) {
              this.dropdownproduk.push({ label: res.produk[i].namaProduk, value: res.produk[i].kode })
            };
          });   
         //komponenharga
         this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getKomponenHarga').subscribe(res => {
            this.dropdownkomponenHarga = [];
            this.dropdownkomponenHarga.push({ label: '--Pilih--', value: '' })
            for (var i = 0; i < res.komponen.length; i++) {
              this.dropdownkomponenHarga.push({ label: res.komponen[i].namaKomponen, value: res.komponen[i].kode })
            };
          });   
         //range
           this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getRange').subscribe(res => {
            this.dropdownrange = [];
            this.dropdownrange.push({ label: '--Pilih--', value: '' })
            for (var i = 0; i < res.range.length; i++) {
              this.dropdownrange.push({ label: res.range[i].namaRange, value: res.range[i].id.kode })
            };
          });   
      }

      get(page: number, rows: number, search: any) {                                                                                                                                                                                                                                                                                        
        this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/findAll?page=' + page + '&rows=' + rows + '&dir=produk.namaProduk&sort=desc&namaProduk='+ search).subscribe(table => {                                                                                                      
          this.listData = table.HargaNettoDiscPasienPulang;                                                                                                                                                                                                                                                                                                   
          this.totalRecords = table.totalRow;                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                         
        });                                                                                                                                                                                                                                                                                                                                              
      }                                                                                                                                                                                                                                                                                                                                                  
      loadPage(event: LazyLoadEvent) {                                                                                                                                                                                                                                                                                                                   
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);                                                                                                                                                                                                                                                
        this.page = (event.rows + event.first) / event.rows;                                                                                                                                                                                                                                                                                             
        this.rows = event.rows;                                                                                                                                                                                                                                                                                                                          
      }     
                                                                                                                                                                                                                                                                                                                                                         
      getKelompokTransaksi() {
        this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getKelompokTransaksi').subscribe(table => {
          let dataKelompokTransaksi = table.KelompokTransaksi;
          localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
          this.route.navigate(['/master-sk/surat-keputusan']);
        });
      }
                                                                                                                                                                                                                                                                                                                                            
      cari() {                                                                                                                                                                                                                                                                                                                                           
        this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=produk.namaProduk&sort=desc&namaProduk=' + this.pencarian).subscribe(table => {                                                     
         this.listData = table.HargaNettoDiscPasienPulang;                                                                                                                                                                                                                                                                                                    
        });                                                                                                                                                                                                                                                                                                                                              
      }      
       ambilSK(sk) {
        if (this.form.get('namaSuratKeputusan').value == '' || this.form.get('namaSuratKeputusan').value == null || this.form.get('namaSuratKeputusan').value == undefined) {
          this.form.get('noSK').setValue(null);
          this.form.get('noSkIntern').setValue(null);
          this.form.get('tglBerlakuAwal').setValue(null);
          this.form.get('tglBerlakuAkhir').setValue(null);
        } else {
          this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getSK?noSK=' + sk.value).subscribe(table => {
            let detailSK = table.SK;
            console.log(detailSK);
            this.form.get('noSK').setValue(detailSK[0].noSK);
            this.form.get('noSkIntern').setValue(detailSK[0].noSKIntern);
            this.form.get('tglBerlakuAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
            if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
              this.form.get('tglBerlakuAkhir').setValue(null);

            } else {
              this.form.get('tglBerlakuAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

            }
          });
        }
      }                                                                                                                                                                                                                                                                                                                                             
      downloadExel() {                                                                                                                                                                                                                                                                                                                                   
        this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/findAll?page='+this.page+'&rows='+this.rows+'&dir=produk.namaProduk&sort=desc').subscribe(table => {                                                                                                                                       
          this.listData = table.HargaNettoDiscPasienPulang;                                                                                                                                                                                                                                                                                                   
          this.codes = [];                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                         
          for (let i = 0; i < this.listData.length; i++) {                                                                                                                                                                                                                                                                                               
              this.codes.push({                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                         
                kode: this.listData[i].kode.kode,                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                         
              })                                                                                                                                                                                                                                                                                                                                         
         }                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                         
          this.fileService.exportAsExcelFile(this.codes, 'hargaNettoDiscPasienPulang');                                                                                                                                                                                                                                                          
        });                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                         
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      downloadPdf() {                                                                                                                                                                                                                                                                                                                                    
        let cetak = Configuration.get().report + '/hargaNettoDiscPasienPulang/laporanHargaNettoDiscPasienPulang.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';                                                                                                                            
        window.open(cetak);                                                                                                                                                                                                                                                                                                                              
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      confirmDelete() {                                                                                                                                                                                                                                                                                                                               
         let v1 = this.form.get('namaSuratKeputusan').value;       
         let v2 = this.form.get('kdProduk').value;       
         let v3 = this.form.get('kdKomponenHarga').value;  
         let v4 = this.form.get('kdRange').value;                                                                                                                                                                                                                                                                                                     
        if (v1 == null || v1 == undefined || v1 == ""
          || v2 == null || v2 == undefined || v2 == ""
          || v3 == null || v3 == undefined || v3 == ""
          || v4 == null || v4 == undefined || v4 == "") {                                                                                                                                                                                                                                                                                           
          this.alertService.warn('Peringatan', 'Pilih Daftar Master HargaNettoDiscPasienPulang');                                                                                                                                                                                                                                                             
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/del/'+ deleteItem.kode.kdProduk+'/'+ deleteItem.kode.kdKomponenHarga+'/'+ deleteItem.kode.kdRange+'/'+ deleteItem.kode.noSK).subscribe(response => {                                                                                                                                                                                           
          this.alertService.success('Berhasil', 'Data Dihapus');                                                                                                                                                                                                                                                                                         
          this.reset();                                                                                                                                                                                                                                                                                                                                  
        });                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                         
     }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
      findSelectedIndex(): number {                                                                                                                                                                                                                                                                                                                      
        return this.listData.indexOf(this.selected);                                                                                                                                                                                                                                                                                                     
      }                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                         
     reset() {          
       this.form.get('namaSuratKeputusan').enable();       
       this.form.get('kdProduk').enable();       
       this.form.get('kdKomponenHarga').enable();       
       this.form.get('kdRange').enable();                                                                                                                                                                                                                                                                                                                                    
       this.ngOnInit();                                                                                                                                                                                                                                                                                                                                       
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
      
       this.form.get('namaSuratKeputusan').enable();       
       this.form.get('kdProduk').enable();       
       this.form.get('kdKomponenHarga').enable();       
       this.form.get('kdRange').enable();                                                                                                                                                                                                                                                                                                                                     
        this.httpService.update(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/update', this.form.value).subscribe(response => {                                                                                                                                                                                              
          this.alertService.success('Berhasil', 'Data Diperbarui');                                                                                                                                                                                                                                                                                     
          // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
          this.reset();                                                                                                                                                                                                                                                                                                                                 
        });                                                                                                                                                                                                                                                                                                                                             
      }                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                        
      simpan() {                                                                                                                                                                                                                                                                                                                                        
        if (this.formAktif == false) {                                                                                                                                                                                                                                                                                                                  
          this.confirmUpdate()                                                                                                                                                                                                                                                                                                                          
        } else {                                                                                                                                                                                                                                                                                                                                        
          this.httpService.post(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/save', this.form.value).subscribe(response => {                                                                                                                                                                                                
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
         this.form.get('namaSuratKeputusan').disable();       
         this.form.get('kdProduk').disable();       
         this.form.get('kdKomponenHarga').disable();       
         this.form.get('kdRange').disable();        

         this.form.get('kdProduk').setValue(event.data.kdProduk);
         this.form.get('kdKomponenHarga').setValue(event.data.kdKomponenHarga);
         this.form.get('kdRange').setValue(event.data.kdRange);
         this.form.get('noSK').setValue(event.data.noSK);
         this.form.get('namaSuratKeputusan').setValue(event.data.noSK);            
         this.form.get('persenDiscount').setValue(event.data.persenDiscount);    
         this.form.get('hargaDiscount').setValue(event.data.hargaDiscount);    
         this.form.get('statusEnabled').setValue(event.data.statusEnabled);
         this.ambilSK(this.form.get('namaSuratKeputusan'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                        
      cetak() {                                                                                                                                                                                                                                                                                                                                         
        this.laporan = true;                                                                                                                                                                                                                                                                                                                            
        this.print.showEmbedPDFReport(Configuration.get().report + '/hargaNettoDiscPasienPulang/laporanHargaNettoDiscPasienPulang.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmHargaNettoDiscPasienPulang(_laporanCetak');                                                                               
    }                                                                                                                                                                                                                                                                                                                                                   
    tutupLaporan() {                                                                                                                                                                                                                                                                                                                                    
      this.laporan = false;                                                                                                                                                                                                                                                                                                                             
    }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                        
    }                                                                                                                                                                                                                                                                                                                                                   
    class InisialHargaNettoDiscPasienPulang implements HargaNettoDiscPasienPulang {                                                                                                                                                                                                                                                                               
      constructor(                                                                                                                                                                                                                                                                                                                                       
         public kdProduk?,   
         public kdKomponenHarga?,   
         public kdRange?,   
         public noSK?,   
         public persenDiscount?,   
         public hargaDiscount?,   
         public statusEnabled?,   
        )                                                                                                                                                                                                                                                                                                                                               
      { }                                                                                                                                                                                                                                                                                                                                               
    }                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                            

