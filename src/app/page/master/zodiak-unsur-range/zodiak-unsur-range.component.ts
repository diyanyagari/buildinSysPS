import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ZodiakUnsurRange } from './zodiak-unsur-range.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-zodiak-unsur-range',
  templateUrl: './zodiak-unsur-range.component.html',
  styleUrls: ['./zodiak-unsur-range.component.scss'],
  providers: [ConfirmationService]
})
export class ZodiakUnsurRangeComponent implements OnInit {
  selected: ZodiakUnsurRange;
  listData: any[];
  dataDummy: {};
  formAktif: boolean;
  pencarian: string;
  FilterNegara: string;
  listZodiak: ZodiakUnsurRange[];
  listZodiakUnsur: ZodiakUnsurRange[];
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  listData2: any[];
  codes: any[];
  month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  smbrFile: any;
  Negara: any[];
  listSifat: any[];


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
    this.selected = null;
    this.pencarian = '';
    this.FilterNegara = '';
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
    this.versi = null;
    this.form = this.fb.group({
      'sifat': new FormControl('', Validators.required),
      'kdNegara': new FormControl('', Validators.required),
      'kdZodiak': new FormControl('', Validators.required),
      'kdZodiakUnsur': new FormControl('', Validators.required),
      'noRec': new FormControl(''),
      'tglAwal': new FormControl('', Validators.required),
      'tglAkhir': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    });

    this.listZodiak = [];
    this.listZodiak.push({ label: '--Pilih Shio--', value: '' })
    this.listZodiakUnsur = [];
    this.listZodiakUnsur.push({ label: '--Pilih Shio Unsur--', value: '' })
    this.listSifat = [];
    this.listSifat = [
      {label:'--Pilih Sifat--',value:''},
      {label:'Yin',value:1},
      {label:'Yang',value:2}
    ];


    this.getNegara();
    this.getSmbrFile();
  }
  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getNegara() {
    this.Negara = [];
    this.Negara.push({ label: '--Pilih Negara--', value: '' })
    this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
      for (var i = 0; i < res.Negara.length; i++) {
        this.Negara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
      };
    });
  }

  getDropdownBasedNegara(kdNegara) {
    this.httpService.get(Configuration.get().dataMasterNew + '/zodiak/findAllZodiak?kdNegara=' + kdNegara).subscribe(res => {
      this.listZodiak = [];
      this.listZodiak.push({ label: '--Pilih Shio--', value: '' })
      for (var i = 0; i < res.Zodiak.length; i++) {
        this.listZodiak.push({ label: res.Zodiak[i].namaZodiak, value: res.Zodiak[i].kode.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/zodiakunsur/findAllZodiakUnsur?kdNegara=' + kdNegara).subscribe(res => {
      this.listZodiakUnsur = [];
      this.listZodiakUnsur.push({ label: '--Pilih Shio Unsur--', value: '' })
      for (var i = 0; i < res.ZodiakUnsur.length; i++) {
        this.listZodiakUnsur.push({ label: res.ZodiakUnsur[i].namaZodiakUnsur, value: res.ZodiakUnsur[i].kode.kode })
      };
    });
  }
  getDate(date) {
    let dd = new Date(date * 1000);

    let d = dd.getDate();
    let m = dd.getMonth();
    let y = dd.getFullYear();

    return ((d < 10) ? ('0' + d) : d) + ' ' + this.month[m] + ' ' + y;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/findAll?').subscribe(table => {
      this.listData2 = table.ZodiakUnsurSifatRange;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        this.codes.push({

          // kode: this.listData2[i].kode.kode,
          namaZodiak: this.listData2[i].namaZodiak,
          namaZodiakUnsur: this.listData2[i].namaZodiakUnsur,
          sifat: this.listData2[i].sifat,
          tglAwal: this.getDate(this.listData2[i].tglAwal),
          tglAkhir: this.getDate(this.listData2[i].tglAkhir),
          statusEnabled: this.listData2[i].statusEnabled,

        })

      }
      this.fileService.exportAsExcelFile(this.codes, 'Shio Unsur Range');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/shioUnsurRange/laporanShioUnsurRange.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);

    // var col = ["Shio", "Shio Unsur", "Sifat", "Tanggal Awal", "Tanggal Akhir", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/findAll?').subscribe(table => {
    //   this.listData2 = table.ZodiakUnsurSifatRange;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData2.length; i++) {
    //     this.codes.push({

    //       // kode: this.listData2[i].kode.kode,
    //       namaZodiak: this.listData2[i].namaZodiak,
    //       namaZodiakUnsur: this.listData2[i].namaZodiakUnsur,
    //       sifat: this.listData2[i].sifat,
    //       tglAwal: this.getDate(this.listData2[i].tglAwal),
    //       tglAkhir: this.getDate(this.listData2[i].tglAkhir),
    //       statusEnabled: this.listData2[i].statusEnabled,

    //     })

    //   }
    //   this.fileService.exportAsPdfFile("Master Shio Unsur Range", col, this.codes, "Shio Unsur Range");

    // });

  }

  get(page: number, rows: number, search: any, filter: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/findAll?page=' + page + '&rows=' + rows +'&dir=zodiak.namaZodiak&sort=asc&namaZodiak='+ search +'&kdNegara='+filter).subscribe(table => {
      this.listData = table.ZodiakUnsurSifatRange;
      this.totalRecords = table.totalRow;

    });
  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=zodiak.namaZodiak&sort=asc&namaZodiak=' + this.pencarian +'&kdNegara='+ this.FilterNegara).subscribe(table => {
      this.listData = table.ZodiakUnsurSifatRange;
    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  //  setPageRow(page, rows) {
  //     if(page == undefined || rows == undefined) {
  //         this.page = Configuration.get().page;
  //         this.rows = Configuration.get().rows;
  //     } else {
  //         this.page = page;
  //         this.rows = rows;
  //     }
  // }
  confirmDelete() {
    let kdZodiak = this.form.get('kdZodiak').value;
    if (kdZodiak == null || kdZodiak == undefined || kdZodiak == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Shio Unsur Range');
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
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }
  update() {
    let tglAwal = this.setTimeStamp(this.form.get('tglAwal').value)
    let tglAkhir = this.setTimeStamp(this.form.get('tglAkhir').value)

    let formSubmit = this.form.value;
    formSubmit.tglAwal = tglAwal;
    formSubmit.tglAkhir = tglAkhir;
    if(formSubmit.sifat == 1){
      formSubmit.sifat = 'Yin';
    }else{
      formSubmit.sifat = 'Yang'
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/update/1', formSubmit).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.form.get('noRec').enable();
      this.confirmUpdate()
    } else {
      this.form.get('noRec').disable();
      let tglAwal = this.setTimeStamp(this.form.get('tglAwal').value)
      let tglAkhir = this.setTimeStamp(this.form.get('tglAkhir').value)

      let formSubmit = this.form.value;
      formSubmit.tglAwal = tglAwal;
      formSubmit.tglAkhir = tglAkhir;
      if(formSubmit.sifat == 1){
        formSubmit.sifat = 'Yin';
      }else{
        formSubmit.sifat = 'Yang'
      }
      this.httpService.post(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/save?', formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }
  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }
  onRowSelect(event) {
    let sifatZ;
    // let cloned = this.clone(event.data);
    this.formAktif = false;
    // this.form.setValue(cloned);
    if(event.data.sifat == 'Yin'){
      sifatZ = 1;
    }else{
      sifatZ = 2;
    }
    this.form.get('sifat').setValue(sifatZ);
    this.form.get('kdZodiak').setValue(event.data.kdZodiak);
    this.form.get('kdZodiakUnsur').setValue(event.data.kdZodiakUnsur);
    this.form.get('tglAwal').setValue(new Date(event.data.tglAwal * 1000));
    this.form.get('tglAkhir').setValue(new Date(event.data.tglAkhir * 1000));
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('kdNegara').setValue(event.data.kdNegara);
    this.form.get('noRec').setValue(event.data.noRec);
    
  }
  // clone(cloned: ZodiakUnsurRange): ZodiakUnsurRange {
  //   let hub = new InisialZodiakUnsurRange();
  //   for (let prop in cloned) {
  //     hub[prop] = cloned[prop];
  //   }
  //   let fixHub = new InisialZodiakUnsurRange();
  //   fixHub = {

  //     "sifat": hub.sifat,
  //     "kdZodiak": hub.kdZodiak,
  //     "kdZodiakUnsur": hub.kdZodiakUnsur,
  //     "tglAwal": new Date(hub.tglAwal * 1000),
  //     "tglAkhir": new Date(hub.tglAkhir * 1000),
  //     "statusEnabled": hub.statusEnabled,
  //     "kdNegara": hub.kdNegara,
  //     "noRec": hub.noRec



  //   }
  //   this.versi = hub.version;
  //   return fixHub;
  // }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/zodiakunsursifatrange/del/' + deleteItem.kdZodiak + '/' + deleteItem.kdZodiakUnsur + '/' + deleteItem.tglAwal + '/' + deleteItem.tglAkhir + '/' + deleteItem.sifat + '/' + this.form.get('kdNegara').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
      // this.get(this.page, this.rows, this.pencarian);
    });


  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  tutupLaporan() {
    this.laporan = false;
  }

  
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/shioUnsurRange/laporanShioUnsurRange.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmZodiakUnsurRange_laporanCetak');

    // let cetak = Configuration.get().report + '/shioUnsurRange/laporanShioUnsurRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }

}

class InisialZodiakUnsurRange implements ZodiakUnsurRange {

  constructor(
    public namaZodiak?,
    public id?,
    public sifat?,
    public kode?,
    public kdZodiak?,
    public kdZodiakUnsur?,
    public tglAwal?,
    public tglAkhir?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public kdNegara?,
    public version?,
    public noRec?

  ) { }

}
