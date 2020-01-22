import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { GolonganAsuransi } from './golongan-asuransi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-golongan-asuransi',
  templateUrl: './golongan-asuransi.component.html',
  styleUrls: ['./golongan-asuransi.component.scss'],
  providers: [ConfirmationService]
})
export class GolonganAsuransiComponent implements OnInit {
  item: GolonganAsuransi = new InisialGolonganAsuransi();
  selected: GolonganAsuransi;
  listData: any[];
  dataDummy: {};
  versi: any;
  formGolonganAsuransi: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  form: FormGroup;
  formAktif: boolean;
  pencarian: string;
  report: any;
  toReport: any;

  kdprof: any;
  kddept: any;
  codes: any[];
  laporan: boolean = false;
  smbrFile:any;


  constructor(
    private alertService: AlertService,
    private InfoService: InfoService,
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
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.versi = null;
    this.form = this.fb.group({

      'kode': new FormControl(''),
      'totalPremiBulan': new FormControl(''),
      'totalPremiTahun': new FormControl(''),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaGolonganAsuransi': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required)

    });

  this.getSmbrFile();

  }

  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/golonganasuransi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.GolonganAsuransi;
      this.totalRecords = table.totalRow;
    });
  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/golonganasuransi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaGolonganAsuransi&sort=desc&namaGolonganAsuransi=' + this.pencarian).subscribe(table => {
      this.listData = table.GolonganAsuransi;
    });
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/golonganasuransi/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaGolonganAsuransi&sort=desc').subscribe(table => {
      this.listData = table.GolonganAsuransi;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

              kode: this.listData[i].kode.kode,
              namaGolonganAsuransi: this.listData[i].namaGolonganAsuransi,
              totalPremiBulan: this.listData[i].totalPremiBulan,
              totalPremiTahun: this.listData[i].totalPremiTahun,
              kodeExternal: this.listData[i].kodeExternal,
              namaExternal: this.listData[i].namaExternal,
              statusEnabled: this.listData[i].statusEnabled,
              reportDisplay: this.listData[i].reportDisplay

          })
          }
          this.fileService.exportAsExcelFile(this.codes, 'GolonganAsuransi');
      });

  }

  // downloadPdf() {
  //   var col = ["Kode Bahasa", "Nama Bahasa"];
  //   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Bahasa&select=id.kode,namaBahasa').subscribe(table => {
  //     this.fileService.exportAsPdfFile("Master Bahasa", col, table.data.data, "Bahasa");

  //   });

  // }

  downloadPdf(){
    let b = Configuration.get().report + '/golonganAsuransi/laporanGolonganAsuransi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {

    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/golonganAsuransi/laporanGolonganAsuransi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmGolonganAsuransi_laporanCetak');
        // let b = Configuration.get().report + '/golonganAsuransi/laporanGolonganAsuransi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
      this.laporan = false;
  }

      valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
      }

      loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Golongan Asuransi');
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

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/golonganasuransi/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.formAktif = true;
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
    this.httpService.update(Configuration.get().dataMasterNew + '/golonganasuransi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/golonganasuransi/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();

      });
    }

  }

  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

  }
  clone(cloned: GolonganAsuransi): GolonganAsuransi {
    let hub = new InisialGolonganAsuransi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialGolonganAsuransi();
    fixHub = {
      "kode": hub.kode.kode,
      "namaGolonganAsuransi": hub.namaGolonganAsuransi,
      "totalPremiBulan": hub.totalPremiBulan,
      "totalPremiTahun": hub.totalPremiTahun,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }


}

class InisialGolonganAsuransi implements GolonganAsuransi {
  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public totalPremiBulan?,
    public totalPremiTahun?,
    public namaGolonganAsuransi?,
    public ReportDisplay?,
    public reportDisplay?,
    public KodeExternal?,
    public NamaExternal?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public noRec?,
    public label?,
    public version?
    )
  { }
}
