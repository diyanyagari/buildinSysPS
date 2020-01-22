import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { SelectItem, MenuItem, TreeNode } from 'primeng/primeng';
import { SatuanKerja } from './satuan-kerja.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-satuan-kerja',
  templateUrl: './satuan-kerja.component.html',
  styleUrls: ['./satuan-kerja.component.scss'],
  providers: [ConfirmationService]
})
export class SatuanKerjaComponent implements OnInit {
  selected: SatuanKerja;
  listData: any[];
  versi: any;
  pimpinan: SatuanKerja[];
  satuanKerja: SatuanKerja[];
  form: FormGroup;
  report: any;
  toReport: any;
  formAktif: boolean;
  page: number;
  rows: number;
  totalRecords: number;
  pencarian: string = '';

  codes: any[];
  listData2: any[];
  items: any;
  laporan: boolean = false;
  kdprof: any;
  kddept: any;

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
   this.formAktif = true;
   this.get(this.page, this.rows, '');
   this.form = this.fb.group({
    'namaSatuanKerja': new FormControl('', Validators.required),
    'kode': new FormControl(''),
    'noSatuanKerja': new FormControl(''),
    'kdPimpinan': new FormControl(''),
    'kdSatuanKerjaHead': new FormControl(''),
    'statusEnabled': new FormControl('', Validators.required),
    'reportDisplay': new FormControl('', Validators.required),
    'namaExternal': new FormControl(''),
    'kodeExternal': new FormControl(''),

  });


   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pegawai&select=namaLengkap,id').subscribe(res => {
    this.pimpinan = [];
    this.pimpinan.push({ label: '--Pilih Pimpinan--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.pimpinan.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id.kode })
    };
  });

   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=SatuanKerja&select=namaSatuanKerja,id').subscribe(res => {
    this.satuanKerja = [];
    this.satuanKerja.push({ label: '--Pilih Jenis Satuan Kerja--', value: '' })
    for (var i = 0; i < res.data.data.length; i++) {
      this.satuanKerja.push({ label: res.data.data[i].namaSatuanKerja, value: res.data.data[i].id.kode })
    };
  });

 }

 cari() {

  this.httpService.get(Configuration.get().dataMasterNew + '/satuankerja/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaSatuanKerja&sort=desc&namaSatuanKerja=' + this.pencarian).subscribe(table => {
    this.listData = table.SatuanKerja;
  });
}

loadPage(event: LazyLoadEvent) {
    // this.get((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/satuankerja/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.SatuanKerja;
      this.totalRecords = table.totalRow;
    });
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Satuan Kerja');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/satuankerja/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/satuankerja/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
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
  clone(cloned: SatuanKerja): SatuanKerja {
    let hub = new InisialSatuanKerja();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialSatuanKerja();
    fixHub = {

      "kode": hub.kode.kode,
      "namaSatuanKerja": hub.namaSatuanKerja,
      "noSatuanKerja": hub.noSatuanKerja,
      "kdPimpinan": hub.kdPimpinan,
      "kdSatuanKerjaHead": hub.kdSatuanKerjaHead,
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/satuankerja/del/' + deleteItem.kode.kode).subscribe(response => {
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
    this.httpService.get(Configuration.get().dataMasterNew + '/satuankerja/findAll?').subscribe(table => {
     this.listData2 = table.SatuanKerja;
     this.codes = [];

     for (let i = 0; i < this.listData2.length; i++) {
      this.codes.push({

        kode: this.listData2[i].kode.kode,
        namaSatuanKerja: this.listData2[i].namaSatuanKerja,
        noSatuanKerja: this.listData2[i].noSatuanKerja,
        pimpinan: this.listData2[i].pimpinan,
        jenisSatuanKerja: this.listData2[i].jenisSatuanKerja,
        reportDisplay: this.listData2[i].reportDisplay,
        kodeExternal: this.listData2[i].kodeExternal,
        namaExternal: this.listData2[i].namaExternal,
        statusEnabled: this.listData2[i].statusEnabled,

      })

    }
    this.fileService.exportAsExcelFile(this.codes, 'Satuan Kerja');
  });

  }

  // downloadPdf() {
  //   var col = ["Kode", "Nama", "Nomor", "Pimpinan", "Jenis", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
  //   this.httpService.get(Configuration.get().dataMasterNew + '/satuankerja/findAll?').subscribe(table => {
  //     this.listData2 = table.SatuanKerja;
  //     this.codes = [];

  //     for (let i = 0; i < this.listData2.length; i++) {
  //       this.codes.push({

  //         kode: this.listData2[i].kode.kode,
  //         namaSatuanKerja: this.listData2[i].namaSatuanKerja,
  //         noSatuanKerja: this.listData2[i].noSatuanKerja,
  //         pimpinan: this.listData2[i].pimpinan,
  //         jenisSatuanKerja: this.listData2[i].jenisSatuanKerja,
  //         reportDisplay: this.listData2[i].reportDisplay,
  //         kodeExternal: this.listData2[i].kodeExternal,
  //         namaExternal: this.listData2[i].namaExternal,
  //         statusEnabled: this.listData2[i].statusEnabled,

  //       })

  //     }
  //     this.fileService.exportAsPdfFile("Master Satuan Kerja", col, this.codes, "Satuan Kerja");

  //   });
  // }

  downloadPdf(){
    let b = Configuration.get().report + '/satuanKerja/laporanSatuanKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';

    window.open(b);
  }
  tutupLaporan() {
    this.laporan = false;
}

  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/satuanKerja/laporanSatuanKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmSatuanKerja_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/satuanKerja/laporanSatuanKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
      }
    }

    class InisialSatuanKerja implements SatuanKerja {

      constructor(
        public id?,
        public kdProfile?,
        public kode?,
        public namaSatuanKerja?,
        public noSatuanKerja?,
        public kdPimpinan?,
        public jenisSatuanKerja?,
        public dataPimpinan?,
        public kdSatuanKerjaHead?,
        public kodeExternal?,
        public reportDisplay?,
        public namaExternal?,
        public statusEnabled?,
        public version?





        ) { }

    }	 