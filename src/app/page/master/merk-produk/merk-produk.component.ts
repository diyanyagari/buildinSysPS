import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-merk-produk',
  templateUrl: './merk-produk.component.html',
  styleUrls: ['./merk-produk.component.scss'],
  providers: [ConfirmationService]
})
export class MerkProdukComponent implements OnInit {
  MerkProduk: any;
  formAktif: boolean;
  form: FormGroup;
  selected: any;

  namaMerkProduk: any;
  reportDisplay: any;
  kodeExternal: any;
  namaExternal: any;
  statusEnabled: any;
  noRec: any;

  kdProfile: any;
  kdMerkProduk: any;
  kdDepartemen: any;

  listData: any = [];

  pencarian: string;
  FilterNegara: string;
  dataSimpan: any;
  dropdownNegara: any[];

  page: number;
  totalRecords: number;
  rows: number;
  versi: number;

  kdprof: any;
  kddept: any;

  items: any;
  listData2: any[];
  codes: any[];
  laporan: boolean = false;
  smbrFile: any;

  constructor(private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private authGuard: AuthGuard,
    private fileService: FileService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

  ngOnInit() {
    this.selected = null;
    this.FilterNegara = '';
    this.pencarian = '';
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
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

    let data = {
      "namaMerkProduk": "string",
      "reportDisplay": "string",
      "kodeExternal": "string",
      "namaExternal": "string",
      "statusEnabled": true,
      "noRec": "string",
      "kode": 0
    }
    this.listData = [];
    this.formAktif = true;

    this.form = this.fb.group({
      'namaMerkProduk': new FormControl(null, Validators.required),
      // 'kdProfile': new FormControl(''),
      'reportDisplay': new FormControl(null, Validators.required),
      'kdNegara': new FormControl(null, Validators.required),
      'kodeExternal': new FormControl(null),
      'namaExternal': new FormControl(null),
      'statusEnabled': new FormControl(null, Validators.required),
      'noRec': new FormControl(null),
      // 'kdMerkProduk': new FormControl(''),
      // 'kdDepartemen': new FormControl('',Validators.required),
      'kode': new FormControl(null)
    });

    this.getDataGrid(this.page, this.rows, this.pencarian, this.FilterNegara);
    this.getSmbrFile();
    this.getNegara();
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

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getDataGrid(page: number, rows: number, cari: string, filter: string) {
    this.httpService.get(Configuration.get().dataMasterNew + '/merkproduk/findAll?page=' + page + '&rows=' + rows + '&dir=namaMerkProduk&sort=desc&namaMerkProduk=' + cari + '&kdNegara=' + filter).subscribe(table => {
      this.listData = table.MerkProduk;
      this.totalRecords = table.totalRow;
    });
  }

  cari() {
    this.getDataGrid(this.page, this.rows, this.pencarian, this.FilterNegara)
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

  loadPage(event: LazyLoadEvent) {
    this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  clone(cloned: any) {
    console.log(cloned);
    let fixHub = {
      "namaMerkProduk": cloned.namaMerkProduk,
      // "kdDepartemen": cloned.kdDepartemen,
      "reportDisplay": cloned.reportDisplay,
      "kodeExternal": cloned.kodeExternal,
      "namaExternal": cloned.namaExternal,
      "statusEnabled": cloned.statusEnabled,
      "noRec": cloned.noRec,
      "kdNegara": cloned.kode.kdNegara,
      // "kdProfile": cloned.kdProfile,
      // "kdMerkProduk": cloned.kdMerkProduk,
      "kode": cloned.kode.kode,
    }
    this.versi = cloned.version;
    return fixHub;
  }

  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
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
    this.httpService.update(Configuration.get().dataMasterNew + '/merkproduk/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.ngOnInit();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/merkproduk/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.ngOnInit();
      });
    }

  }

  onDestroy() {

  }

  reset() {
    this.ngOnInit();
  }

  hapus() {
    this.httpService.delete(Configuration.get().dataMasterNew + '/merkproduk/del/' + this.form.get('kode').value + '/' + this.form.get('kdNegara').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.ngOnInit();
    });
  }


  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Merk Produk');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapus();
        }
      });
    }
  }

  setReportDisplay() {
    this.form.get('reportDisplay').setValue(this.form.get('namaMerkProduk').value)
  }

  downloadPdf() {
    let b = Configuration.get().report + '/merkProduk/laporanMerkProduk.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/merkProduk/laporanMerkProduk.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmMerkProduk_laporanCetak');

    // this.laporan = true;
    // let b = Configuration.get().report + '/merkProduk/laporanMerkProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

    // window.open(b);
  }
  tutupLaporan() {
    this.laporan = false;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/merkproduk/findAll?').subscribe(table => {
      this.listData2 = table.MerkProduk;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        this.codes.push({

          kode: this.listData2[i].kode.kode,
          namaMerkProduk: this.listData2[i].namaMerkProduk,
          reportDisplay: this.listData2[i].reportDisplay,
          kodeExternal: this.listData2[i].kodeExternal,
          namaExternal: this.listData2[i].namaExternal,
          statusEnabled: this.listData2[i].statusEnabled,

        })

      }
      this.fileService.exportAsExcelFile(this.codes, 'MerkProduk');
    });

  }


}

