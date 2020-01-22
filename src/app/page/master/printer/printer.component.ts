import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Printer } from './printer.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { PrinterService } from '../../../global/service/printer.service'

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss'],
  providers: [ConfirmationService]
})
export class PrinterComponent implements OnInit {

  selected: Printer;
  listData: any[];
  dataDummy: {};
  kodeStatusPerkawinan: Printer[];
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
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  smbrFile: any;
  listPrinter: any = [];
  version: any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private authGuard: AuthGuard,
    private printerService: PrinterService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

  ngOnInit() {
    console.log(this.printerService.getAllPrinter);
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    this.printerService.getAllPrinter(this.getPrinterList, this)
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

    this.form = this.fb.group({


      // 'namaExternal': new FormControl(''),
      // 'kodeExternal': new FormControl(''),
      // "kdDepartemen": new FormControl(''),
      // "noRec": new FormControl(''),
      "printerDefault": new FormControl(''),
      "printerSizeCard": new FormControl(''),
      "printerSizeFull1": new FormControl(''),
      "printerSizeFull2": new FormControl(''),
      "printerSizeHalf1": new FormControl(''),
      "printerSizeHalf2": new FormControl(''),
      "printerSizePer161": new FormControl(''),
      "printerSizePer162": new FormControl(''),
      "printerSizePer321": new FormControl(''),
      "printerSizePer322": new FormControl(''),
      "printerSizePer41": new FormControl(''),
      "printerSizePer42": new FormControl(''),
      "printerSizePer641": new FormControl(''),
      "printerSizePer642": new FormControl(''),
      "printerSizePer81": new FormControl(''),
      "printerSizePer82": new FormControl(''),
      // "version": new FormControl('')
      // "statusEnabled": new FormControl('', Validators.required),

    });

    this.getSmbrFile();
    // this.getPrinterList();
    this.getPrevList();
  }


  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getPrinterList(ob: PrinterComponent, data: any) {
    ob.listPrinter = [];
    ob.listPrinter.push({ label: '--Pilih Printer--', value: '' })
    for (let i = 0; i < data.length; i++) {
      ob.listPrinter.push({ label: data[i], value: data[i] })
    }
  }

  getPrevList() {
    this.httpService.get(Configuration.get().dataMasterNew + '/printer/findByKdProfile').subscribe(table => {
      this.listData = table.Printer;
      this.version = table.Printer.version;
      // this.getPrinterList();
      if (table.Printer != null) {
        console.log(table.Printer.version)
        let dataTemp = {
          // 'kdDepartemen': table.Printer.kdDepartemen,
          // 'noRec': table.Printer.noRec,
          'printerSizeFull1': table.Printer.printerSizeFull1,
          'printerSizePer162': table.Printer.printerSizePer162,
          'printerSizePer161': table.Printer.printerSizePer161,
          'printerSizePer42': table.Printer.printerSizePer42,
          'printerSizeFull2': table.Printer.printerSizeFull2,
          'printerSizePer82': table.Printer.printerSizePer82,
          'printerSizePer41': table.Printer.printerSizePer41,
          'printerSizePer81': table.Printer.printerSizePer81,
          'printerSizeHalf1': table.Printer.printerSizeHalf1,
          'printerSizePer642': table.Printer.printerSizePer642,
          'printerSizePer322': table.Printer.printerSizePer322,
          'printerSizePer641': table.Printer.printerSizePer641,
          'printerSizePer321': table.Printer.printerSizePer321,
          'printerDefault': table.Printer.printerDefault,
          'printerSizeCard': table.Printer.printerSizeCard,
          'printerSizeHalf2': table.Printer.printerSizeHalf2,
          // 'statusEnabled': table.Printer.statusEnabled,
          // 'version': table.Printer.version
        }
        this.form.setValue(dataTemp);
        this.totalRecords = table.totalRow;
      } else {
        // this.getPrinterList();
      }
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/printer/findAll?page=' + page + '&rows=' + rows + '&dir=namaPropinsi&sort=desc').subscribe(table => {
      this.listData = table.printer;
      this.totalRecords = table.totalRow;

    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/printer/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPropinsi&sort=desc&namaPropinsi=' + this.pencarian).subscribe(table => {
      this.listData = table.printer;
    });
  }

  loadPage(event: LazyLoadEvent) {
    // this.get((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=PenghasilanTidakKenaPajak&select=*').subscribe(table => {
      this.listData = table.data.data;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
      this.kodeStatusPerkawinan = [];
      this.kodeStatusPerkawinan.push({ label: '--Pilih Status Perkawinan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeStatusPerkawinan.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
      };
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
    this.httpService.update(Configuration.get().dataMasterNew + '/printer/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    // if (this.formAktif == false) {
    //   this.confirmUpdate()
    // } else {
    //   let formSubmit = this.form.value;
    //   formSubmit.statusEnabled = true;
    //   console.log(this.form.value);
    //   this.httpService.post(Configuration.get().dataMasterNew + '/printer/save?', this.form.value).subscribe(response => {
    //     this.alertService.success('Berhasil', 'Data Disimpan');
    //     // this.get(this.page, this.rows, this.pencarian);
    //     this.reset();
    //   });
    // }

    if (this.form.value == null) {
      let formSubmit = this.form.value;
      formSubmit.statusEnabled = true;
      console.log(this.form.value);
      this.httpService.post(Configuration.get().dataMasterNew + '/printer/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    } else {
      let formSubmit = this.form.value;
      formSubmit.statusEnabled = true;
      console.log(this.form.value);
      this.httpService.update(Configuration.get().dataMasterNew + '/printer/update/' + this.version, this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);
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

  clone(cloned: Printer): Printer {
    let hub = new InisialPrinter();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPrinter();
    fixHub = {
      //"kdProfile": hub.id.kdProfile,
      "kode": hub.id.kode,
      "statusPTKP": hub.statusPTKP,
      "deskripsi": hub.deskripsi,
      "kdStatusPerkawinan": hub.kdStatusPerkawinan,
      "qtyAnak": hub.qtyAnak,
      "totalHargaPTKP": hub.totalHargaPTKP,
      "version": hub.version,
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/printer/del/' + deleteItem.id.kode).subscribe(response => {
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

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/printer/laporanPrinter.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/printer/laporanPrinter.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmPrinter_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }


}

class InisialPrinter implements Printer {

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
    public version?
  ) { }

}	 
