import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import {MasterPegawaiSkHitungPajak} from './master-pegawai-sk-hitung-pajak.interface';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration ,AlertService, InfoService, FileService, AuthGuard, ReportService  } from '../../../global';

@Component({
  selector: 'app-master-pegawai-sk-hitung-pajak',
  templateUrl: './master-pegawai-sk-hitung-pajak.component.html',
  styleUrls: ['./master-pegawai-sk-hitung-pajak.component.scss'],
  providers: [ConfirmationService]
})
export class MasterPegawaiSkHitungPajakComponent implements OnInit {
  selected: MasterPegawaiSkHitungPajak;
  listData: any[];
  listKomponenGaji: any[];
  versi: any;
  form :FormGroup;
  formAktif: boolean;
  items: MenuItem[];
  pencarian: string;
  report: any;
  objekPajak: any;
  range: any;
  kategoriPegawai: any;
  golonganPegawai: any;
  metodeHitung: any;
  page: number;
  rows: number;
  totalRecords: any;  
  namaSK: SelectItem[];
  rekananPenjamin: SelectItem[];
  komponenHarga: SelectItem[];
  operatorFactorRate: SelectItem[]; 
  caraBayar: SelectItem[]; 
  komponenEffect: SelectItem[];
  dataSK: any[];  
  laporan: boolean = false;
	kdprof: any;
  kddept: any;
  codes:any[];      
  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    

  ngOnInit() {
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;

    this.listKomponenGaji = [];      
    this.formAktif = true;
    this.get(this.page, this.rows);
    if(this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.form = this.fb.group({
      'namaSK': new FormControl('', Validators.required),
      'noSK': new FormControl(''),
      'tglBerlakuSkDari': new FormControl('', Validators.required),
      'tglBerlakuSkSampai': new FormControl('', Validators.required),
      'kategoriPegawai': new FormControl('', Validators.required),
      'objekPajak': new FormControl('', Validators.required),
      'range': new FormControl('', Validators.required),
      'golonganPegawai': new FormControl('', Validators.required),  

    });
    this.items = [
    {label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
      this.downloadPdf();
    }
  },
    {label: 'Exel', icon: 'fa-file-excel-o', command: () => { 
      this.downloadExel();
    }
  },
];
  }
  get(page: number, rows: number){
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskpajak/findAll?page='+page+'&rows='+rows+'&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.PegawaiSKPajak;
      this.totalRecords = table.totalRow; 
      
    });
  this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskpajak/getSK').subscribe(res => {
    // this.namaSK = [];
    // this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
    // for (var i = 0; i < res.SK.length; i++) {
    //   this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
    // }
    this.dataSK = res.SK;
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=ObjekPajak&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.objekPajak = [];
    this.objekPajak.push({ label: '--Pilih Objek Pajak--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.objekPajak.push({ label: res.data.data[i].namaObjekPajak, value: res.data.data[i].id.kode })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.range = [];
    this.range.push({ label: '--Pilih Range--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.range.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id.kode })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.kategoriPegawai = [];
    this.kategoriPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.golonganPegawai = [];
    this.golonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.golonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Komponen&select=*&page=1&rows=300&criteria=kdJenisKomponen&values=6&condition=and&profile=y').subscribe(res => {
    this.komponenHarga = [];
    this.komponenHarga.push({ label: '--Pilih Komponen Harga--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.komponenHarga.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i] })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MetodePerhitungan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.metodeHitung = [];
    this.metodeHitung.push({ label: '--Pilih Metode Hitung--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.metodeHitung.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i] })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MetodePembayaran&select=id.kode,%20namaMetodePembayaran&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.caraBayar = [];
    this.caraBayar.push({ label: '--Pilih Cara Bayar--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.caraBayar.push({ label: res.data.data[i].namaMetodePembayaran, value: res.data.data[i] })
    };
  });
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=CaraBayar&page=1&rows=300&condition=and&profile=y').subscribe(res => {
    this.komponenEffect = [];
    this.komponenEffect.push({ label: '--Pilih Komponen Effect--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.komponenEffect.push({ label: res.data.data[i].namaMetodePembayaran, value: res.data.data[i] })
    };
  });
  this.operatorFactorRate = [];
  this.operatorFactorRate.push({label:'--Silahkan Pilih Operator--', value:''})
  this.operatorFactorRate.push({label:"+", value:{"kode":"+"}})
  this.operatorFactorRate.push({label:"-", value:{"kode":"-"}})
  this.operatorFactorRate.push({label:"x", value:{"kode":"x"}})
  this.operatorFactorRate.push({label:"/", value:{"kode":"/"}})   
  }
  ambilSK(sk){
    if (this.form.get('namaSK').value == null || this.form.get('namaSK').value == undefined){
    }else{    
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskpajak/getSK?noSK='+sk.value).subscribe(table => {
      let detailSK = table.SK;
      console.log(detailSK); 
      this.form.get('noSK').setValue(detailSK[0].noSK);
      this.form.get('tglBerlakuSkDari').setValue(new Date(detailSK[0].tglBerlakuAwal*1000));
      this.form.get('tglBerlakuSkSampai').setValue(new Date(detailSK[0].tglBerlakuAkhir*1000));        
    });
    }
  }
  filterSk(event) {
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskpajak/getSK?noSK='+event.query).subscribe(res => {
        this.dataSK = res.SK;
    });
  }
  pilihSK(event) {
    //this.form.get('namaSK').setValue(event.namaSK);
    this.form.get('noSK').setValue(event.noSK);
    this.form.get('tglBerlakuSkDari').setValue(new Date(event.tglBerlakuAwal * 1000));
    if(event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
      this.form.get('tglBerlakuSkSampai').setValue(new Date(event.tglBerlakuAkhir * 1000));
    }
  }
  cari(){
    this.httpService.get(Configuration.get().dataMasterNew+'/MasterPegawaiSkHitungPajak/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaMasterPegawaiSkHitungPajak&sort=desc&namaMasterPegawaiSkHitungPajak`='+this.pencarian).subscribe(table => {
      this.listData = table.MasterPegawaiSkHitungPajak;
    });
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkHitungPajak&select=id.kode,namaMasterPegawaiSkHitungPajak').subscribe(table => {
      this.fileService.exportAsExcelFile(table.data.data, 'MasterPegawaiSkHitungPajak');
    });

  }

  downloadPdf() {
  
    // var col = ["Kode", "Nama MasterPegawaiSkHitungPajak"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkHitungPajak&select=id.kode,namaMasterPegawaiSkHitungPajak').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master MasterPegawaiSkHitungPajak", col, table.data.data, "MasterPegawaiSkHitungPajak");

    // });

  }
  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
        this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Hitung Pajak');
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
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  hapus() {
    let item = [...this.listData]; 
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew+'/MasterPegawaiSkHitungPajak/del/'+deleteItem.id.kode).subscribe(response => {
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
    console.log(this.listKomponenGaji);
    
    for (let i = 0; i < this.listKomponenGaji.length; i++) {
      let prorate
      if (this.listKomponenGaji[i].isProRate==true){prorate=1}else{prorate=0}
      dataKomponen.push({
        "factorRate": this.listKomponenGaji[i].factorRate,
        "hargaSatuan": this.listKomponenGaji[i].hargaSatuan,
        "hargaSatuanPinalty": this.listKomponenGaji[i].hargaSatuanPinalty,
        "isProRate": prorate,
        "kdGolonganPegawai": this.form.get('golonganPegawai').value,
        "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
        // "kdKomponenEffect": this.listKomponenGaji[i].komponenEffect.id.kode,
        "kdKomponenEffect": 1,          
        "kdKomponenHarga": this.listKomponenGaji[i].dataGaji.id.kode,
        "kdMetodeHitung": this.listKomponenGaji[i].metodeHitung.id.kode,
        "kdMetodePembayaran": this.listKomponenGaji[i].metodePembayaran.id_kode,
        "kdObjekPajak": this.form.get('objekPajak').value,
        "kdRange": this.form.get('range').value,
        "keteranganLainnya": this.listKomponenGaji[i].keteranganLainnya,
        "noRec": "",
        "noSK": this.form.get('noSK').value,
        "operatorFactorRate": this.listKomponenGaji[i].operatorFactorRate.kode,
        "persenHargaSatuan": this.listKomponenGaji[i].persenHargaSatuan,
        "persenHargaSatuanPinalty": this.listKomponenGaji[i].persenHargaSatuanPenalty,
        "rumusPerhitungan": this.listKomponenGaji[i].rumusPerhitungan,
        "statusEnabled": this.listKomponenGaji[i].statusAktif,
        "version": 1
      })
    }     
    console.log(dataKomponen);

    this.httpService.update(Configuration.get().dataMasterNew+'/pegawaiskpajak/update/1', dataKomponen).subscribe(response =>{
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
      for (let i = 0; i < this.listKomponenGaji.length; i++) {
        let prorate
        if (this.listKomponenGaji[i].isProRate==true){prorate=1}else{prorate=0}
        dataKomponen.push({
          "factorRate": this.listKomponenGaji[i].factorRate,
          "hargaSatuan": this.listKomponenGaji[i].hargaSatuan,
          "hargaSatuanPinalty": this.listKomponenGaji[i].hargaSatuanPinalty,
          "isProRate": prorate,
          "kdGolonganPegawai": this.form.get('golonganPegawai').value,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          // "kdKomponenEffect": this.listKomponenGaji[i].komponenEffect.id.kode,
          "kdKomponenEffect": 1,          
          "kdKomponenHarga": this.listKomponenGaji[i].dataGaji.id.kode,
          "kdMetodeHitung": this.listKomponenGaji[i].metodeHitung.id.kode,
          "kdMetodePembayaran": this.listKomponenGaji[i].metodePembayaran.id_kode,
          "kdObjekPajak": this.form.get('objekPajak').value,
          "kdRange": this.form.get('range').value,
          "keteranganLainnya": this.listKomponenGaji[i].keteranganLainnya,
          "noRec": "",
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listKomponenGaji[i].operatorFactorRate.kode,
          "persenHargaSatuan": this.listKomponenGaji[i].persenHargaSatuan,
          "persenHargaSatuanPinalty": this.listKomponenGaji[i].persenHargaSatuanPenalty,
          "rumusPerhitungan": this.listKomponenGaji[i].rumusPerhitungan,
          "statusEnabled": this.listKomponenGaji[i].statusAktif,
          "version": 1
        })
      }     
      console.log(dataKomponen);
      this.httpService.post(Configuration.get().dataMasterNew+'/pegawaiskpajak/save', dataKomponen).subscribe(response =>{
      this.alertService.success('Berhasil','Data Disimpan');
      this.reset();
      });  
    }

}
setTimeStamp (date){
  let dataTimeStamp = (new Date(date).getTime()/1000);
  return dataTimeStamp;
}
tambahKomponen() {
      let dataTemp = {
            "dataGaji": {
              "namaKomponen": "--Pilih--",
              "kdKomponenHarga": '',
              },
            "persenHargaSatuan": "",
            "hargaSatuan": "",
            "factorRate": "1",
            "operatorFactorRate": {
              "kode": "x",
              "kdOperatorFactorRate": 'x',
              },
            "persenHargaSatuanPenalty": "",
            "hargaSatuanPinalty": "",
            "metodeHitung": {
              "namaMetodeHitung": "--Pilih--",
              "kdRumusPerhitungan": '',
              },
            "isProRate": false,
            "rumusPerhitungan": "",
            "metodePembayaran": {
              "namaMetodePembayaran": "--Pilih--",
              "kdMetodePembayaran": '',
              },
            "komponenEffect": {
              "namaKomponenEffect": "--Pilih--",
              "kdKomponenEffect": '',
              },            
            "keteranganLainnya": "",
            "statusAktif": true,
            "noSK":null,
            
      }
      let listKomponenGaji = [...this.listKomponenGaji];
      listKomponenGaji.push(dataTemp);
      this.listKomponenGaji = listKomponenGaji;
  }
  hapusRow(row) {
    let listKomponenGaji = [...this.listKomponenGaji];
    listKomponenGaji.splice(row, 1);
    this.listKomponenGaji = listKomponenGaji;
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
    this.httpService.get(Configuration.get().dataMasterNew+'/pegawaiskpajak/findByKode/'+dataPeg.data.noSK+'/'+dataPeg.data.kdObjekPajak+'/'+dataPeg.data.kdRange+'/'+dataPeg.data.kdKategoryPegawai+'/'+dataPeg.data.kdGolonganPegawai+'').subscribe(table => {
    let komponen = table.PegawaiSKPajak;
     
    // this.listKomponenGaji = komponen;
    this.listKomponenGaji = [];      
    console.log(komponen);
    let dataFix
    for (let i = 0; i < komponen.length; i++){
    dataFix = 
      {
        "dataGaji": {
          "id": {"kode":komponen[i].kdKomponenHarga},                            
          "namaKomponen": komponen[i].namaKomponen,
          "kdKomponen": komponen[i].kdKomponenHarga,
          "noSK": komponen[i].kode.noSK,                              
          },
        "persenHargaSatuan": komponen[i].persenHargaSatuan,
        "hargaSatuan": komponen[i].hargaSatuan,
        "factorRate": komponen[i].factorRate,
        "operatorFactorRate": {
          "kode": komponen[i].operatorFactorRate,
          "kdOperatorFactorRate": komponen[i].operatorFactorRate,
          },
        "persenHargaSatuanPenalty": komponen[i].persenHargaSatuanPinalty,
        "hargaSatuanPinalty": komponen[i].hargaSatuanPinalty,
        "metodeHitung": {
          "id": {"kode":komponen[i].kdMetodeHitung},                                      
          "namaMetodeHitung": komponen[i].namaMetodeHitung,
          "kdRumusPerhitungan": komponen[i].kdMetodeHitung,
          "noSK": komponen[i].kode.noSK,                              
          },
        "isProRate": komponen[i].isProRate,
        "rumusPerhitungan": komponen[i].rumusPerhitungan,
        "metodePembayaran": {
          "id": {"kode":komponen[i].kdMetodePembayaran},                                                
          "namaMetodePembayaran": komponen[i].namaMetodePembayaran,
          "kdMetodePembayaran": komponen[i].kdMetodePembayaran,
          "namaCaraBayar": komponen[i].namaMetodePembayaran,
          "noSK": komponen[i].kode.noSK,                              
          },
        "keteranganLainnya": komponen[i].keteranganLainnya,
        "statusAktif": komponen[i].statusEnabled,
        "noSK": komponen[i].kode.noSK,          
        
    }
    this.listKomponenGaji.push(dataFix);      
    }
    console.log(this.listKomponenGaji);
    });
  }
  onRowSelect(event) {
    this.formAktif = false;
    let cloned = this.clone(event.data);
    this.form.setValue(cloned);
    console.log(event);
    this.getKomponen(event);        
  }
  clone(cloned: MasterPegawaiSkHitungPajak): MasterPegawaiSkHitungPajak {
    let hub = new InisialMasterPegawaiSkHitungPajak();
    for(let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMasterPegawaiSkHitungPajak();
    fixHub = {
      "namaSK": hub.noSK,
      "noSK": hub.noSK,
      "tglBerlakuSkDari": new Date(hub.tglBerlakuAwal*1000),
      "tglBerlakuSkSampai": new Date(hub.tglBerlakuAkhir*1000),
      "kategoriPegawai": hub.kdKategoryPegawai,
      "objekPajak": hub.kdObjekPajak,
      "range": hub.kdRange,
      "golonganPegawai": hub.kdGolonganPegawai,
      
    }
    this.versi = hub.version;
    return fixHub;
  }

  Cetak(){
    // console.log('tes');
    // this.laporan = true;
    // this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKHitungPayroll/laporanPegawaiSKHitungPayroll.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmPegawaiSkHitungPayroll_laporanCetak');

}
tutupLaporan() {
    this.laporan = false;
}



}
class InisialMasterPegawaiSkHitungPajak implements MasterPegawaiSkHitungPajak {
  constructor(
    public namaSK?,
    public noSK?,
    public tglBerlakuSkDari?,
    public tglBerlakuAwal?,
    public tglBerlakuSkSampai?,
    public tglBerlakuAkhir?,
    public kategoriPegawai?,
    public kdKategoryPegawai?,
    public objekPajak?,
    public kdObjekPajak?,
    public range?,
    public kdRange?,
    public golonganPegawai?,
    public kdGolonganPegawai?,
    public kdMetodePembayaran?,
    public caraBayar?,    
    public version?,
    )
  {}
}

