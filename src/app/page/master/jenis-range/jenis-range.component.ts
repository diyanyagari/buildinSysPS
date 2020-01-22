import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisRange } from './jenis-range.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-jenis-range',
  templateUrl: './jenis-range.component.html',
  styleUrls: ['./jenis-range.component.scss'],
  providers: [ConfirmationService]
})
export class JenisRangeComponent implements OnInit {
  listJenisRange: any[];
  selected: JenisRange;
  listData: JenisRange[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;

  kdprof: any;
  kddept: any;

  items: any[];
  codes: any[];
  laporan: boolean = false;
  smbrFile:any;

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

    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaJenisRange': new FormControl('', Validators.required),
      'kdJenisRangeHead': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });

    this.items = [
    {
      label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        this.downloadPdf();
      }    },
      {
        label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
          this.downloadExcel();
        }    },

        ];

        this.getSmbrFile();
      }

      getSmbrFile(){
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
          this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
        });
      }
    

      valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
      }

      get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisrange/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
          this.listData = table.JenisRange;
          this.totalRecords = table.totalRow;
        });


        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisRange&select=namaJenisRange,id').subscribe(res => {
          this.listJenisRange = [];
          this.listJenisRange.push({ label: '--Pilih Data Parent Jenis Range--', value: '' })
          for (var i = 0; i < res.data.data.length; i++) {
            this.listJenisRange.push({ label: res.data.data[i].namaJenisRange, value: res.data.data[i].id.kode })
          };
        });


      }

      cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisrange/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisRange&sort=desc&namaJenisRange=' + this.pencarian).subscribe(table => {
          this.listData = table.JenisRange;
        });
      }

      loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Detail Jenis Produk');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/jenisrange/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/jenisrange/save?', this.form.value).subscribe(response => {
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

  clone(cloned: JenisRange): JenisRange {
    let hub = new InisialJenisRange();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialJenisRange();
    fixHub = {
      'kode': hub.kode.kode,
      'namaJenisRange': hub.namaJenisRange,
      'kdJenisRangeHead': hub.kdJenisRangeHead,

      'reportDisplay': hub.reportDisplay,
      'namaExternal': hub.namaExternal,
      'kodeExternal': hub.kodeExternal,
      'statusEnabled': hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenisrange/del/' + deleteItem.kode.kode).subscribe(response => {
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisrange/findAll?').subscribe(table => {
     this.listData = table.JenisRange;
     this.codes = [];

     for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaJenisRange: this.listData[i].namaJenisRange,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
        // }
      }
      this.fileService.exportAsExcelFile(this.codes, 'JenisRange');
    });

  }

  downloadPdf(){
    let b = Configuration.get().report + '/jenisRange/laporanJenisRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/jenisRange/laporanJenisRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisRange_laporanCetak');

        // let b = Configuration.get().report + '/jenisRange/laporanJenisRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
      }
      tutupLaporan() {
        this.laporan = false;
    }
    }

    class InisialJenisRange implements JenisRange {

      constructor(
        public kdJenisRangeHead?,
        public namaJenisRange?,


        public kode?,
        public id?,
        public kdProfile?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        ) { }

    }



