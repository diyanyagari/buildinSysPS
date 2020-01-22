import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Matauang } from './matauang.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, LazyLoadEvent, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-matauang',
  templateUrl: './matauang.component.html',
  styleUrls: ['./matauang.component.scss'],
  providers: [ConfirmationService]
})
export class MatauangComponent implements OnInit {

  selected: Matauang;
  listData: Matauang[];
  dataDummy: {};
  versi: any;
  pencarian: string = '';
  formAktif: boolean;
  form: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;

  laporan: boolean = false;
  items: MenuItem[];
  display: any;
  display2: any;

  codes: any[];
  listData2: any[];
  dropdownNegara: any[];

  kdprof: any;
  kddept: any;
  smbrFile: any;

  FilterNegara: string;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {

  }


  ngOnInit() {
    this.FilterNegara = '';
    this.pencarian = '';
    this.selected = null;
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.getPage(this.page, this.rows, this.pencarian, this.FilterNegara);
    this.versi = null;
    this.form = this.fb.group({
      'namaMataUang': new FormControl('', Validators.required),
      'currentKursToIDR': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
      'kdNegara': new FormControl('', Validators.required),
      'noRec': new FormControl('')
    });

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



    this.getNegara();
    this.getSmbrFile();
  }
  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getNegara() {
    this.dropdownNegara = [];
    this.dropdownNegara.push({ label: '--Pilih Negara--', value: '' })
    this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
      for (var i = 0; i < res.Negara.length; i++) {
        this.dropdownNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
      };
    });
  }
  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAll?').subscribe(table => {
      this.listData2 = table.MataUang;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        this.codes.push({
          kode: this.listData2[i].kode,
          namaMataUang: this.listData2[i].namaMataUang,
          currentKursToIDR: this.listData2[i].currentKursToIDR,
          reportDisplay: this.listData2[i].reportDisplay,
          kodeExternal: this.listData2[i].kodeExternal,
          namaExternal: this.listData2[i].namaExternal,
          statusEnabled: this.listData2[i].statusEnabled
        })
      }
      this.fileService.exportAsExcelFile(this.codes, 'matauang');
    });

  }

  // downloadPdf() {
  //   var col = ["Kode", "Nama", "Kurs Saat Ini Ke IDR", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
  //   this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAll?').subscribe(table => {
  //     this.listData2 = table.MataUang;
  //     this.codes = [];

  //     for (let i = 0; i<this.listData2.length; i++){
  //       this.codes.push({
  //         kode: this.listData2[i].kode,
  //         namaMataUang: this.listData2[i].namaMataUang,
  //         currentKursToIDR: this.listData2[i].currentKursToIDR,
  //         reportDisplay: this.listData2[i].reportDisplay,
  //         kodeExternal: this.listData2[i].kodeExternal,
  //         namaExternal: this.listData2[i].namaExternal,
  //         statusEnabled: this.listData2[i].statusEnabled
  //       })
  //     }
  //     this.fileService.exportAsPdfFile("Master matauang", col, this.codes, "matauang");

  //   });

  // }

  downloadPdf() {
    let b = Configuration.get().report + '/mataUang/laporanMataUang.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/mataUang/laporanMataUang.pdf?kdDepartemen=' + this.kddept + '&gambarLogo=' + this.smbrFile + '&kdProfile=' + this.kdprof + '&download=false', 'frmMataUang_laporanCetak');
    // this.laporan = true;
    // let b = Configuration.get().report + '/mataUang/laporanMataUang.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

    // window.open(b);
  }


  tutupLaporan() {
    this.laporan = false;
  }


  // cetak() {
  //   this.laporan = true;
  //   this.report.showEmbedPDFReport(Configuration.get().report + "/Matauang/listMatauang.pdf?kdDepartemen=1", '#report-pdf-Matauang', 400);
  // }

  cari() {

    this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaMataUang&sort=desc&namaMataUang=' + this.pencarian + '&kdNegara=' + this.FilterNegara).subscribe(table => {
      this.listData = table.MataUang;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
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


  getPage(page: number, rows: number, search: any, kdNegara: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAll?page=' + page + '&rows=' + rows + '&dir=namaMataUang&sort=desc&namaMataUang=' + this.pencarian + '&kdNegara=' + kdNegara).subscribe(table => {
      this.listData = table.MataUang;
      this.totalRecords = table.totalRow;
    });
  }

  valuechange(newvalue) {
    this.display = newvalue;
    this.display2 = newvalue;
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
    console.log(this.form.value);
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Mata Uang');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/matauang/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/matauang/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.getPage(this.page, this.rows, this.pencarian);
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
  }
  clone(cloned: Matauang): Matauang {
    let hub = new InisialMatauang();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMatauang();
    fixHub = {
      "kode": hub.kode.kode,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "namaMataUang": hub.namaMataUang,
      "currentKursToIDR": hub.currentKursToIDR,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,
      "kdNegara": hub.kode.kdNegara,
      "noRec": hub.noRec
    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/matauang/del/' + this.form.get('kode').value + '/' + this.form.get('kdNegara').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      // this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
   
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialMatauang implements Matauang {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public currentKursToIDR?,
    public namaMataUang?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public mataUang?,
    public kdNegara?,
    public noRec?
  ) { }

}