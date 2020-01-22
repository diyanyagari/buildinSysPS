import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import {MasterPegawaiSkFasilitas} from './master-pegawai-sk-fasilitas.interface';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration ,AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { isNumber } from 'util';
import { Router} from "@angular/router";

@Component({
  selector: 'app-master-pegawai-sk-fasilitas',
  templateUrl: './master-pegawai-sk-fasilitas.component.html',
  styleUrls: ['./master-pegawai-sk-fasilitas.component.scss'],
  providers: [ConfirmationService]
})
export class MasterPegawaiSkFasilitasComponent implements OnInit {
  selected: MasterPegawaiSkFasilitas;
  listData: any[];
  listFasilitas: any[];
  versi: any;
  form :FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  namaSK: SelectItem[];
  kategoriPegawai: SelectItem[];
  masaKerja: SelectItem[];
  jabatan: SelectItem[]; 
  namaProduk: SelectItem[];    
  kondisiProduk: SelectItem[];    
  checked: boolean = true;
  kondisi: any;
  page: number;
  rows: number;
  totalRecords: any;
  dataSK: any[];
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  smbrFile:any;


  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private route: Router, private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService )
  {  
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngOnInit() {

    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;

    this.listFasilitas = [];      
    this.formAktif = true;
    this.get(this.page, this.rows);
    this.form = this.fb.group({
      'namaSK': new FormControl('', Validators.required),
      'noSK': new FormControl({value:'', disabled: true}),
      'tglBerlakuSkDari': new FormControl({value:'', disabled: true}),
      'tglBerlakuSkSampai': new FormControl({value:'', disabled: true}),
      'kategoriPegawai': new FormControl('', Validators.required),
      'masaKerja': new FormControl('', Validators.required),
      'jabatan': new FormControl('', Validators.required),
    });

    this.form.get('kategoriPegawai').enable();
    this.form.get('masaKerja').enable();
    this.form.get('jabatan').enable(); 
    this.items = [
    {label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
      this.downloadPdf();
    }},
    {label: 'Exel', icon: 'fa-file-excel-o', command: () => { 
      this.downloadExel();
    }}];

    this.getSmbrFile();
  }

  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
     this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }


  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  getKelompokTransaksi(){
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getKelompokTransaksi').subscribe(table => {
     let dataKelompokTransaksi = table.KelompokTransaksi;
     localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));	
     this.route.navigate(['/master-sk/surat-keputusan']);
   });
  }

  get(page: number, rows: number){
    this.httpService.get(Configuration.get().dataMaster+'/pegawaiskfasilitas/getSK').subscribe(res => {
      this.dataSK = res.SK;
    });
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/findAll?page='+page+'&rows='+rows+'&dir=id.noSK&sort=desc').subscribe(
      table => {
        this.listData = table.PegawaiSKFasilitas;
        this.totalRecords = table.totalRow;
      });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kategoriPegawai = [];
      this.kategoriPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=*&page=1&rows=300&criteria=kdJenisRange&values=2&condition=and&profile=y').subscribe(res => {
      this.masaKerja = [];
      this.masaKerja.push({ label: '--Pilih Masa Kerja--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.masaKerja.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jabatan = [];
      this.jabatan.push({ label: '--Pilih Jabatan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getProduk').subscribe(res => {
      this.namaProduk = [];
      this.namaProduk.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.namaProduk.push({ label: res.data[i].namaProduk, value: res.data[i]})
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KondisiProduk&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kondisiProduk = [];
      this.kondisiProduk.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kondisiProduk.push({ label: res.data.data[i].namaKondisiProduk, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });
    
  }
  cari(){
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/findAll?page='+ Configuration.get().page+'&rows='+ Configuration.get().rows+'&dir=id.noSK&sort=desc&namaKategoryPegawai='+this.pencarian).subscribe(table => {
      this.listData = table.PegawaiSKFasilitas;
      this.totalRecords = table.totalRow;
    });
  }
  downloadExel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkFasilitas&select=id.kode,namaMasterPegawaiSkFasilitas').subscribe(table => {
    //   this.fileService.exportAsExcelFile(table.data.data, 'MasterPegawaiSkFasilitas');
    // });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/pegawaiSKFasilitas/laporanPegawaiSKFasilitas.pdf?kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama MasterPegawaiSkFasilitas"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkFasilitas&select=id.kode,namaMasterPegawaiSkFasilitas').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master MasterPegawaiSkFasilitas", col, table.data.data, "MasterPegawaiSkFasilitas");

    // });

  }

  cetak(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKFasilitas/laporanPegawaiSKFasilitas.pdf?kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmMasterPegawaiSkFasilitas_laporanCetak');
  }

  ambilSK(sk) {
    if (this.form.get('namaSK').value == '' || this.form.get('namaSK').value == null || this.form.get('namaSK').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('tglBerlakuSkDari').setValue(null);
      this.form.get('tglBerlakuSkSampai').setValue(null);
      
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskfasilitas/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('tglBerlakuSkDari').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.form.get('tglBerlakuSkSampai').setValue(null);
        } else {
          this.form.get('tglBerlakuSkSampai').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
          
        }
      });
    }
  }
  // filterSk(event) {
  //   this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/getSK?noSK='+event.query).subscribe(res => {
  //       this.dataSK = res.SK;
  //   });
  // }
  // pilihSK(event) {
  //   //this.form.get('namaSK').setValue(event.namaSK);
  //   this.form.get('noSK').setValue(event.noSK);
  //   this.form.get('tglBerlakuSkDari').setValue(new Date(event.tglBerlakuAwal * 1000));
  //   if(event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
  //     this.form.get('tglBerlakuSkSampai').setValue(new Date(event.tglBerlakuAkhir * 1000));
  //   }
  // }
  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null ||noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Fasilitas');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapus();
        },
        reject: () => {
          this.alertService.warn('Peringatan','Data Tidak Dihapus');
        }
      });
    }
  }

  hapus() {
    let item = [...this.listData]; 
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew+'/MasterPegawaiSkFasilitas/del/'+deleteItem.id.kode).subscribe(response => {
    },
    error => {
      this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
    },
    () => {
      this.alertService.success('Berhasil','Data Dihapus');
      this.reset();
    });

  } 

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset(){

    this.form.get('kategoriPegawai').enable();
    this.form.get('masaKerja').enable();
    this.form.get('jabatan').enable(); 
    
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
        this.alertService.warn('Peringatan','Data Tidak Diperbaharui');
      }
    });
  }

  update() {
    let dataSimpan;
    let dataKomponen=[];
    for (let i = 0; i < this.listFasilitas.length; i++) {
      dataKomponen.push({
        "kdKondisiProduk": this.listFasilitas[i].kondisi.id.kode,
        "kdProduk": this.listFasilitas[i].nama.kode,
        "keteranganLainnya": this.listFasilitas[i].keteranganLainnya,
        "qtyProduk": this.listFasilitas[i].qtyProduk,
        "resumeSpesifikasi": this.listFasilitas[i].resumeSpesifikasi,
        "statusEnabled": this.listFasilitas[i].statusAktif,
        
      })
    }       
    dataSimpan = {
      "kdJabatan": this.form.get('jabatan').value,
      "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
      "kdRangeMasaKerja": this.form.get('masaKerja').value,
      "noSK": this.form.get('noSK').value,
      "pegawaiSKFasilitasDetailDto": dataKomponen
    }   
    
    this.httpService.update(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/update/1', dataSimpan).subscribe(response =>{
      this.alertService.success('Berhasil','Data Diperbarui');
      this.reset();
    });  
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {

      let dataSimpan;
      let dataKomponen=[];
      for (let i = 0; i < this.listFasilitas.length; i++) {
        dataKomponen.push({
          "kdKondisiProduk": this.listFasilitas[i].kondisi.id.kode,
          "kdProduk": this.listFasilitas[i].nama.kode,
          "keteranganLainnya": this.listFasilitas[i].keteranganLainnya,
          "qtyProduk": this.listFasilitas[i].qtyProduk,
          "resumeSpesifikasi": this.listFasilitas[i].resumeSpesifikasi,
          "statusEnabled": this.listFasilitas[i].statusAktif,
        })
      }       
      dataSimpan = {
        "kdJabatan": this.form.get('jabatan').value,
        "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
        "kdRangeMasaKerja": this.form.get('masaKerja').value,
        "noSK": this.form.get('noSK').value,
        "pegawaiSKFasilitasDetailDto": dataKomponen
      }   
      
      this.httpService.post(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/save', dataSimpan).subscribe(response =>{
        this.alertService.success('Berhasil','Data Disimpan');
        this.reset();
      });  
    }

  }
  tambahKomponen() {
  // if (this.listFasilitas.length == 0) {
    let dataTemp = {
      "nama":{
        "namaProduk": "--Pilih--",
      },
      "qtyProduk": "",
      "kondisi":{
        "namaKondisiProduk": "--Pilih--",
      },
      "resumeSpesifikasi": "",
      "keteranganLainnya": "",
      "statusAktif": "",
      "noSK":null,

    }
    let listFasilitas = [...this.listFasilitas];
    listFasilitas.push(dataTemp);
    this.listFasilitas = listFasilitas;
  // } else {
  //     this.alertService.warn('Peringatan', 'Data Tidak Lengkap')
    // }
  }
  hapusRow(row) {
    let listFasilitas = [...this.listFasilitas];
    listFasilitas.splice(row, 1);
    this.listFasilitas = listFasilitas;
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
  valuechange(newvalue){
    this.report= newvalue;
  }
  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan","Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }
  getKomponen(dataPeg){
    console.log(dataPeg);
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskfasilitas/findByKode?noSK='+dataPeg.data.noSK+'&kdKategoryPegawai='+dataPeg.data.kdKategoryPegawai+'&kdRangeMasaKerja='+dataPeg.data.kdRangeMasaKerja+'&kdJabatan='+dataPeg.data.kdJabatan+'').subscribe(table => {
      let komponen = table.PegawaiSKFasilitas;
      this.kondisi=1;
    // this.listFasilitas = komponen;
    this.listFasilitas = [];      
    console.log(komponen);
    let dataFix
    for (let i = 0; i < komponen.length; i++){
      dataFix = {
        "nama":{
          "id": {"kode":komponen[i].kode.kdProduk},          
          "namaProduk": komponen[i].namaProduk,
          "kode": komponen[i].kode.kdProduk,    
          "noSK": komponen[i].kode.noSK,                    
        },
          // "kondisi": komponen[i].kdKondisiProduk,          
          "qtyProduk": komponen[i].qtyProduk,
          "kondisi":{
            "id": {"kode":komponen[i].kdKondisiProduk},                      
            "namaKondisiProduk": komponen[i].namaKondisiProduk,
            "kode": komponen[i].kdKondisiProduk,
            "noSK": komponen[i].kode.noSK,                    
            "id_kode":komponen[i].kdKondisiProduk            
          },
          "resumeSpesifikasi": komponen[i].resumeSpesifikasi,
          "keteranganLainnya": komponen[i].keteranganLainnya,
          "statusAktif": komponen[i].statusEnabled,
          "noSK": komponen[i].kode.noSK,          
        }
        this.listFasilitas.push(dataFix);      
      }
      console.log(this.listFasilitas);
    });
  }
  onRowSelect(event) {
    console.log(event);
    this.formAktif = false;

    this.form.get('namaSK').setValue(event.data.noSK)
    this.form.get('noSK').setValue(event.data.noSK)
    let tglawal = new Date(event.data.tglBerlakuAwal*1000)
    let tglakhir = new Date(event.data.tglBerlakuAkhir*1000)
    this.form.get('tglBerlakuSkDari').setValue(tglawal)
    if (event.data.tglBerlakuAkhir == null){
      this.form.get('tglBerlakuSkSampai').setValue(null)
    }
    else{
      this.form.get('tglBerlakuSkSampai').setValue(tglakhir)
    }

    this.form.get('kategoriPegawai').setValue(event.data.kdKategoryPegawai)
    this.form.get('masaKerja').setValue(event.data.kdRangeMasaKerja)
    this.form.get('jabatan').setValue(event.data.kdJabatan)
    // let cloned = this.clone(event.data);
    // this.form.setValue(cloned);
    this.versi = event.data.version
    this.getKomponen(event);   
    this.form.get('kategoriPegawai').disable();
    this.form.get('masaKerja').disable();
    this.form.get('jabatan').disable(); 
  }
  clone(cloned: MasterPegawaiSkFasilitas): MasterPegawaiSkFasilitas {
    let hub = new InisialMasterPegawaiSkFasilitas();
    for(let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMasterPegawaiSkFasilitas();
    fixHub = {
      "namaSK": hub.noSK,
      "noSK": hub.noSK,
      "tglBerlakuSkDari": new Date(hub.tglBerlakuAwal*1000),
      "tglBerlakuSkSampai": new Date(hub.tglBerlakuAkhir*1000),
      "kategoriPegawai": hub.kdKategoryPegawai,
      "masaKerja": hub.kdRangeMasaKerja,
      "jabatan": hub.kdJabatan,
    }
    this.versi = hub.version;
    return fixHub;
  }


}
class InisialMasterPegawaiSkFasilitas implements MasterPegawaiSkFasilitas {
  constructor(
    public namaSK?,
    public kategoriPegawai?,
    public masaKerja?,
    public jabatan?,
    public noSK?,
    public kdKategoryPegawai?,
    public kdRangeMasaKerja?,
    public kdJabatan?,
    public statusEnabled?,
    public tglBerlakuSkDari?,
    public tglBerlakuSkSampai?,
    public tglBerlakuAwal?,    
    public tglBerlakuAkhir?,    
    
    public version?
    )
  {}
}

