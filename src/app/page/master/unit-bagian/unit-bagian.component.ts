import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { UnitBagian } from './unit-bagian.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-unit-bagian',
  templateUrl: './unit-bagian.component.html',
  styleUrls: ['./unit-bagian.component.scss'],
  providers: [ConfirmationService]
})
export class UnitBagianComponent implements OnInit {

  selected: UnitBagian;
  listData: UnitBagian[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  laporan: boolean = false;
  codes:any[];
  listData2:any[];

  kdprof: any;
  kddept: any;
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
      'kode': new FormControl(''),
      'namaUnitBagian': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.getSmbrFile()
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
    this.httpService.get(Configuration.get().dataMasterNew + '/unitbagian/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.UnitBagian;
      this.totalRecords = table.totalRow;
    });


  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/unitbagian/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaUnitBagian&sort=desc&namaUnitBagian=' + this.pencarian).subscribe(table => {
      this.listData = table.UnitBagian;
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
        this.alertService.warn('Peringatan', 'Pilih Daftar Master Cara Bayar');
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
      this.httpService.update(Configuration.get().dataMasterNew + '/unitbagian/update/' + this.versi, this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

    simpan() {
      if (this.formAktif == false) {
        this.confirmUpdate()
      } else {
        this.httpService.post(Configuration.get().dataMasterNew + '/unitbagian/save?', this.form.value).subscribe(response => {
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

    clone(cloned: UnitBagian): UnitBagian {
      let hub = new InisialUnitBagian();
      for (let prop in cloned) {
        hub[prop] = cloned[prop];
      }
      let fixHub = new InisialUnitBagian();
      fixHub = {
        'kode': hub.kode.kode,
        'namaUnitBagian': hub.namaUnitBagian,
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
      this.httpService.delete(Configuration.get().dataMasterNew + '/unitbagian/del/' + deleteItem.kode.kode).subscribe(response => {
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
      this.httpService.get(Configuration.get().dataMasterNew + '/unitbagian/findAll?').subscribe(table => {
        this.listData2 = table.UnitBagian;
        this.codes = [];

        for (let i = 0; i < this.listData2.length; i++) {
          this.codes.push({

            kode: this.listData2[i].kode.kode,
            namaUnitBagian: this.listData2[i].namaUnitBagian,
            reportDisplay: this.listData2[i].reportDisplay,
            kodeExternal: this.listData2[i].kodeExternal,
            namaExternal: this.listData2[i].namaExternal,
            statusEnabled: this.listData2[i].statusEnabled,

          })

        }
        this.fileService.exportAsExcelFile(this.codes, 'UnitBagian');
      });

    }

    // downloadPdf() {
    //   var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    //   this.httpService.get(Configuration.get().dataMasterNew + '/unitbagian/findAll?').subscribe(table => {
    //     this.listData2 = table.UnitBagian;
    //     this.codes = [];

    //     for (let i = 0; i < this.listData2.length; i++) {
    //       this.codes.push({

    //         kode: this.listData2[i].kode.kode,
    //         namaUnitBagian: this.listData2[i].namaUnitBagian,
    //         reportDisplay: this.listData2[i].reportDisplay,
    //         kodeExternal: this.listData2[i].kodeExternal,
    //         namaExternal: this.listData2[i].namaExternal,
    //         statusEnabled: this.listData2[i].statusEnabled,

    //       })

    //     }
    //     this.fileService.exportAsPdfFile("Master UnitBagian", col, this.codes, "UnitBagian");

    //   });
    // }

    downloadPdf(){
      let b = Configuration.get().report + '/unitBagian/laporanUnitBagian.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

      window.open(b);
    }

    cetak() {
      this.laporan = true;
      this.print.showEmbedPDFReport(Configuration.get().report + '/unitBagian/laporanUnitBagian.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmUnitBagian_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/unitBagian/laporanUnitBagian.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
      }
      tutupLaporan() {
        this.laporan = false;
    }


    }
   

    class InisialUnitBagian implements UnitBagian {

      constructor(

        public namaUnitBagian?,
      // public kdDepartemen?,

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