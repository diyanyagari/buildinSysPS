import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PenghasilanTidakKenaPajak } from './penghasilan-tidak-kena-pajak.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-penghasilan-tidak-kena-pajak',
  templateUrl: './penghasilan-tidak-kena-pajak.component.html',
  styleUrls: ['./penghasilan-tidak-kena-pajak.component.scss'],
  providers: [ConfirmationService]
})
export class PenghasilanTidakKenaPajakComponent implements OnInit {
  item: PenghasilanTidakKenaPajak = new InisialPenghasilanTidakKenaPajak();;
  selected: PenghasilanTidakKenaPajak;
  listData: any[];
  listDetail: any[];
  dataDummy: {};
  kodeStatusPerkawinan: PenghasilanTidakKenaPajak[];
  versi: any;
  form: FormGroup;
  formAktif: boolean;
  pencarian: string;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  operatorFactorRate: any[];
  komponenHarga: any[];
  SK: any[];

  codes:any[];
  listData2:any[];
  kdprof:any;
  kddept:any;
  laporan: boolean = false;
  smbrFile:any;
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


  ngOnInit() {
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
   
    this.items = [
    {label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
      this.downloadPdf();}
    },
    {label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
      this.downloadExcel();}
    },

    ];
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.listDetail = [];    
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'statusPTKP': new FormControl(null, Validators.required),
      'kode': new FormControl(null),
      'qtyAnak': new FormControl(null),
      'kdStatusPerkawinan': new FormControl(null),
      'deskripsi': new FormControl(null),
      'statusEnabled': new FormControl(null, Validators.required),
      'totalHargaPTKP': new FormControl(null, Validators.required),
      'reportDisplay': new FormControl(null, Validators.required),
      'namaExternal': new FormControl(null),
      'kodeExternal': new FormControl(null),

    });
    this.httpService.get(Configuration.get().dataMasterNew + '/status/status-perkawinan').subscribe(res => {
      this.kodeStatusPerkawinan = [];
      this.kodeStatusPerkawinan.push({ label: '--Pilih Status Perkawinan--', value: null })
      for (var i = 0; i < res.data.length; i++) {
        this.kodeStatusPerkawinan.push({ label: res.data[i].namaStatus, value: res.data[i].kode })
      };
    }, error => {
      this.kodeStatusPerkawinan = [];
      this.kodeStatusPerkawinan.push({label:'-- '+ error +' --', value:''})
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/getKomponen?page=1&rows=300').subscribe(res => {
      this.komponenHarga = [];
      this.komponenHarga.push({ label: '--Pilih Komponen Harga--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.komponenHarga.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/getSK').subscribe(res => {
      this.SK = [];
      this.SK.push({ label: '--Pilih SK--', value: null })
      for (var i = 0; i < res.SK.length; i++) {
        this.SK.push({ label: res.SK[i].namaSK, value: res.SK[i] })
      };
    });
    this.operatorFactorRate = [];
    this.operatorFactorRate.push({label:'--Pilih Operator--', value:null})
    this.operatorFactorRate.push({label:"+", value:"+"})
    this.operatorFactorRate.push({label:"-", value:"-"})
    this.operatorFactorRate.push({label:"X", value:"X"})
    this.operatorFactorRate.push({label:"/", value:"/"})


  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.PenghasilanTidakKenaPajak;
      this.totalRecords = table.totalRow;

    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=statusPTKP&sort=desc&statusPTKP=' + this.pencarian).subscribe(table => {
      this.listData = table.PenghasilanTidakKenaPajak;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, '')
    // this.get((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
    this.get((event.rows+event.first)/event.rows,event.rows,this.pencarian);
  }
  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
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

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Penghasilan Tidak Kena Pajak');
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
    let dataSimpan;
    let dataKomponen=[];
    for (let i = 0; i < this.listDetail.length; i++) {
      dataKomponen.push({
        "factorRate": this.listDetail[i].factorRate,
        "hargaSatuan": this.listDetail[i].hargaSatuan,
        "hargaSatuanMax": this.listDetail[i].hargaSatuanMax,
        "kdDepartemen": null,
        "kdKomponenHarga": this.listDetail[i].komponenHarga.id_kode,
        "kdPTKP": null,
        "noRec": null,
        "noSK": this.listDetail[i].sk.noSK,
        "operatorFactorRate": this.listDetail[i].operatorFactorRate.value,
        "persenHargaSatuan": this.listDetail[i].persenHargaSatuan,
        "statusEnabled": this.listDetail[i].statusAktif,
        "version": 1,
      })
    }      
    dataSimpan = {
      "deskripsi": this.form.get('deskripsi').value,
      "kdDepartemen": null,
      "kdStatusPerkawinan": this.form.get('kdStatusPerkawinan').value,
      "kode": this.form.get('kode').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "noRec": null,
      "qtyAnak": this.form.get('qtyAnak').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "statusPTKP": this.form.get('statusPTKP').value,
      "totalHargaPTKP": this.form.get('totalHargaPTKP').value,
      "version": 1,
      "penghasilanTidakKenaPajakDetailDto": dataKomponen
    }          
    console.log(dataSimpan);
    this.httpService.update(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/update/' + this.versi, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let dataSimpan;
      let dataKomponen=[];
      for (let i = 0; i < this.listDetail.length; i++) {
        dataKomponen.push({
          "factorRate": this.listDetail[i].factorRate,
          "hargaSatuan": this.listDetail[i].hargaSatuan,
          "hargaSatuanMax": this.listDetail[i].hargaSatuanMax,
          "kdDepartemen": null,
          "kdKomponenHarga": this.listDetail[i].komponenHarga.id_kode,
          "kdPTKP": null,
          "noRec": null,
          "noSK": this.listDetail[i].sk.noSK,
          "operatorFactorRate": this.listDetail[i].operatorFactorRate.value,
          "persenHargaSatuan": this.listDetail[i].persenHargaSatuan,
          "statusEnabled": this.listDetail[i].statusAktif,
          "version": 1
        })
      }      
      dataSimpan = {
        "deskripsi": this.form.get('deskripsi').value,
        "kdDepartemen": null,
        "kdStatusPerkawinan": this.form.get('kdStatusPerkawinan').value,
        "kode": this.form.get('kode').value,
        "kodeExternal": this.form.get('kodeExternal').value,
        "namaExternal": this.form.get('namaExternal').value,
        "noRec": null,
        "qtyAnak": this.form.get('qtyAnak').value,
        "reportDisplay": this.form.get('reportDisplay').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "statusPTKP": this.form.get('statusPTKP').value,
        "totalHargaPTKP": this.form.get('totalHargaPTKP').value,
        "version": 1,
        "penghasilanTidakKenaPajakDetailDto": dataKomponen
      }          
      console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }
  }
  tambahKomponen() {
    let dataTemp = {
      "komponenHarga":{
        "namaKomponen": "--Pilih Komponen Harga--",
      },
      "sk":{
        "namaSK": "--Pilih SK--",
      },
      "hargaSatuan": null,
      "hargaSatuanMax": null,      
      "persenHargaSatuan": null, 
      "factorRate": 1,      
      "operatorFactorRate": {
        "value": "X",          
      },            
      "statusAktif": true, 
      "noSK":null,
    }
    let listDetail = [...this.listDetail];
    listDetail.push(dataTemp);
    this.listDetail = listDetail;
  }
  hapusRow(row) {
    let listDetail = [...this.listDetail];
    listDetail.splice(row, 1);
    this.listDetail = listDetail;
  }
  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }
  getKomponen(dataPTKP){
    console.log(dataPTKP);
    this.httpService.get(Configuration.get().dataMasterNew+'/penghasilantidakkenapajak/findByKode/'+dataPTKP.data.kode.kode).subscribe(table => {
      let komponen = table.PenghasilanTidakKenaPajakDetail;

    // this.listDetail = komponen;
    this.listDetail = [];      
    console.log(komponen);
    let dataFix
    for (let i = 0; i < komponen.length; i++){
      dataFix = 
      {
        "komponenHarga":{
          "namaKomponen": komponen[i].namaKomponenHarga,
          "komponenHarga": komponen[i].kdKomponenHarga,     
          "id_kode": komponen[i].kdKomponenHarga,                    
        },
        "sk":{
          "namaSK": komponen[i].namaSK,
          "sk": komponen[i].noSK,   
          "noSK": komponen[i].noSK,                    
        },
        "hargaSatuan": komponen[i].hargaSatuan,
        "hargaSatuanMax": komponen[i].hargaSatuanMax,      
        "persenHargaSatuan": komponen[i].persenHargaSatuan, 
        "factorRate": komponen[i].factorRate,      
        "operatorFactorRate": {
          "value": komponen[i].operatorFactorRate, 
          "operatorFactorRate": komponen[i].operatorFactorRate,                    
        },            
        "statusAktif": komponen[i].statusEnabled, 
        "noSK":komponen[i].noSK,
      }
      this.listDetail.push(dataFix);      
    }
    console.log(this.listDetail);
  });
  }
  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    this.getKomponen(event);            
  }

  clone(cloned: PenghasilanTidakKenaPajak): PenghasilanTidakKenaPajak {
    let hub = new InisialPenghasilanTidakKenaPajak();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPenghasilanTidakKenaPajak();
    fixHub = {
      "statusPTKP": hub.statusPTKP,
      "deskripsi": hub.deskripsi,
      "kdStatusPerkawinan": hub.kdStatusPerkawinan,
      "qtyAnak": hub.qtyAnak,
      "kode": hub.kode.kode,
      "totalHargaPTKP": hub.totalHargaPTKP,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);

    });
    this.reset();

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  downloadExcel() {
  //   this.httpService.get(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/findAll?').subscribe(table => {
  //    this.listData2 = table.PenghasilanTidakKenaPajak;
  //    this.codes = [];

  //    for (let i = 0; i<this.listData2.length; i++){
  //     this.codes.push({
  //       kode: this.listData2[i].kode.kode,
  //       statusPTKP: this.listData2[i].statusPTKP,
  //       deskripsi: this.listData2[i].deskripsi,
  //       namaStatusPerkawinan: this.listData2[i].namaStatusPerkawinan,
  //       qtyAnak: this.listData2[i].qtyAnak,
  //       totalHargaPTKP: this.listData2[i].totalHargaPTKP,
  //       reportDisplay: this.listData2[i].reportDisplay,
  //       kodeExternal: this.listData2[i].kodeExternal,
  //       namaExternal: this.listData2[i].namaExternal,
  //       statusEnabled: this.listData2[i].statusEnabled
  //     })
  //   }
  //   this.fileService.exportAsExcelFile(this.codes, 'Penghasilan Tidak Kena Pajak');
  // });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/penghasilanTidakKenaPajak/laporanPenghasilanTidakKenaPajak.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Status PTKP", "Deskripsi", "Status Perkawinan", "Jumlah Anak", "Total Harga PTKP", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/penghasilantidakkenapajak/findAll?').subscribe(table => {
    //   this.listData2 = table.PenghasilanTidakKenaPajak;
    //   this.codes = [];
    //   // debugger;
    //   for (let i = 0; i<this.listData2.length; i++){
    //     this.codes.push({
    //       kode: this.listData2[i].kode.kode,
    //       statusPTKP: this.listData2[i].statusPTKP,
    //       deskripsi: this.listData2[i].deskripsi,
    //       namaStatusPerkawinan: this.listData2[i].namaStatusPerkawinan,
    //       qtyAnak: this.listData2[i].qtyAnak,
    //       totalHargaPTKP: this.listData2[i].totalHargaPTKP,
    //       reportDisplay: this.listData2[i].reportDisplay,
    //       kodeExternal: this.listData2[i].kodeExternal,
    //       namaExternal: this.listData2[i].namaExternal,
    //       statusEnabled: this.listData2[i].statusEnabled
    //     })
    //   }
    //   this.fileService.exportAsPdfFile("Master Penghasilan Tidak Kena Pajak", col, this.codes, "Penghasilan Tidak Kena Pajak");

    // });

  }
  tutupLaporan() {
    this.laporan = false;
}
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/penghasilanTidakKenaPajak/laporanPenghasilanTidakKenaPajak.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPenghasilanTidakKenaPajak_laporanCetak');

    // let cetak = Configuration.get().report + '/penghasilanTidakKenaPajak/laporanPenghasilanTidakKenaPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
}

class InisialPenghasilanTidakKenaPajak implements PenghasilanTidakKenaPajak {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public kdStatusPerkawinan?,
    public qtyAnak?,
    public statusPTKP?,
    public totalHargaPTKP?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public deskripsi?,
    public version?,
    public PenghasilanTidakKenaPajak?,
    ) { }

}	 