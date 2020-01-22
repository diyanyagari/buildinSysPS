import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Alergi } from './master-jenis-respon.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-master-jenis-respon',
  templateUrl: 'master-jenis-respon.component.html',
  styleUrls: ['master-jenis-respon.component.scss'],
  providers: [ConfirmationService]
})
export class JenisResponComponent implements OnInit {

  // item: Alergi = new InisialAlergi();
  selected: Alergi;
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
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  smbrFile: any;

  constructor(
    private alertService: AlertService,
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
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.pencarian = '';
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kdJenisRespon': new FormControl(null),
      'kdDepartemen': new FormControl(null),
      'jenisRespon': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Exel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExel(this.page, this.rows, this.pencarian);
        }
      }];
    // this.getSmbrFile();                                                                                                                                                                                                                                                                                                                              
  }
  get(page: number, rows: number, search: any) {
    page = page - 1;
    this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/JenisRespon/Paged?PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + search).subscribe(table => {
      this.listData = table.items;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  cari() {
    let page = Configuration.get().page - 1;
    this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/JenisRespon/Paged?PageIndex=' + page + '&PageSize=' + Configuration.get().rows + '&keyword=' + this.pencarian).subscribe(table => {
      this.listData = table.items;
    });
  }
  valuechange(newValue) {
    this.report = newValue;
  }
  downloadExel(page: number, rows: number, search: any) {
    page = page - 1;

    this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/JenisRespon/Paged?PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + search).subscribe(table => {
      this.listData = table.items;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        let stts;
        if(this.listData[i].statusEnabled == 1){
          stts = "Aktif";
        } else {
          stts = "Tidak Aktif";
        }
        this.codes.push({
          'Nama Jenis Respon': this.listData[i].jenisRespon,
          'Report Display': this.listData[i].reportDisplay,
          'Kode External': this.listData[i].kodeExternal,
          'Nama External': this.listData[i].namaExternal,
          'Status Enabled': stts,
        })

      }
      this.fileService.exportAsExcelFile(this.codes, 'Master Jenis Respon');
    });

    // let listData = this.listData;
    // let query
    // query = "order by status.NamaStatus"
    // let data = {
    //   "download": true,
    //   "namaFile": "jenis-respon-report-master",
    //   "extFile": ".xlsx",
    //   "kdDepartemen": this.kddept,
    //   "kdProfile": this.kdprof,
    //   "paramImgKey": [
    //   ],
    //   "paramImgValue": [
    //   ],
    //   "paramKey": [
    //      "kdProfile", "labelLaporan"
    //   ],
    //   "paramValue": [
    //     this.kdprof,"Master Jenis Respon"
    //   ]
    // }
    // this.httpService.genericReport(Configuration.get().report + '/generic/report/jenis-respon-report-master.xlsx', data).subscribe();

  }

  downloadPdf() {
    // let cetak = Configuration.get().report + '/alergi/laporanAlergi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=true';
    // window.open(cetak);

    let data = {
      "download": true,
      "kdDepartemen": '',
      "kdProfile": this.kdprof,
      "extFile": ".pdf",
      "paramImgKey": [
      ],
      "paramImgValue": [
      ],
      "paramKey": [
        "labelLaporan"
      ],
      "paramValue": [
        "Master Jenis Respon"
      ]
    }
    this.httpService.genericReport(Configuration.get().report + '/generic/report/jenis-respon-report-master.pdf', data).subscribe(response => {

    });
  }

  confirmDelete() {
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
    // let kode = this.form.get('kode').value;
    // if (kode == null || kode == undefined || kode == "") {
    //   this.alertService.warn('Peringatan', 'Pilih Daftar Master Alergi');
    // } else {
    //   this.confirmationService.confirm({
    //     message: 'Apakah data akan di hapus?',
    //     header: 'Konfirmasi Hapus',
    //     icon: 'fa fa-trash',
    //     accept: () => {
    //       this.hapus();
    //     },
    //     reject: () => {
    //       this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
    //     }
    //   });
    // }
  }

  hapus() {
    let kdJenis = this.form.get('kdJenisRespon').value;
    this.httpService.delete(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/JenisRespon/' + kdJenis).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
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
    let kdJenis = this.form.get('kdJenisRespon').value;
    let i = this.form.get('statusEnabled').value ? 1 : 0;
    let formSubmit = this.form.value;
    formSubmit.statusEnabled = i;
    this.httpService.update(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/JenisRespon/' + kdJenis, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let formSubmit = this.form.value;
      formSubmit.kdDepartemen = this.kddept
      if(formSubmit.statusEnabled){
        formSubmit.statusEnabled = 1;
      } else if (!formSubmit.statusEnabled) {
        formSubmit.statusEnabled = 0;
      }
      if(formSubmit.kodeExternal == undefined){
        formSubmit.kodeExternal = "";
      }
      if(formSubmit.namaExternal == undefined){
        formSubmit.namaExternal = "";
      }
      console.log(this.form.value)
      this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/JenisRespon', this.form.value).subscribe(response => {
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
    let cloned = this.clone(event.data);
    this.form.setValue(cloned);
  }
  clone(cloned) {
    console.log(cloned)
    let fixHub = {
      "kdJenisRespon": cloned.kdJenisRespon,
      "kdDepartemen": cloned.kdDepartemen,
      "jenisRespon": cloned.jenisRespon,
      "reportDisplay": cloned.reportDisplay,
      "kodeExternal": cloned.kodeExternal,
      "namaExternal": cloned.namaExternal,
      "statusEnabled": cloned.statusEnabled,
    }
    return fixHub;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/jenis-respon-report-master.pdf');
  }
  tutupLaporan() {
    this.laporan = false;
  }


}


