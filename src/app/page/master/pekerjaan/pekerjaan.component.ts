import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Pekerjaan } from './pekerjaan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, HttpClient, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-pekerjaan',
  templateUrl: './pekerjaan.component.html',
  styleUrls: ['./pekerjaan.component.scss'],
  providers: [ConfirmationService]
})
export class PekerjaanComponent implements OnInit {
  selected: Pekerjaan;
  listData: Pekerjaan[];
  formAktif: boolean;
  pencarian: string;
  departemen: Pekerjaan[];
  kodePekerjaan: Pekerjaan[];
  versi: any;
  form: FormGroup;

  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  inputPencarian: any;
  codes: any[];
  report: any;
  toReport: any;
  listData2:any[];
  kdprof:any;
  kddept:any;
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
    
    this.formAktif = true;
    this.inputPencarian = null;
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
    this.getPage(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaPekerjaan': new FormControl('', Validators.required),
      'kdPekerjaanHead': new FormControl(null),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pekerjaan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(
      res => {
        this.kodePekerjaan = [];
        this.kodePekerjaan.push({ label: '--Pilih Data Parent Pekerjaan--', value: null })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kodePekerjaan.push({ label: res.data.data[i].namaPekerjaan, value: res.data.data[i].id.kode })
        };
      }, error => {
        this.kodePekerjaan = [];
        this.kodePekerjaan.push({label:'-- '+ error +' --', value:''})
      }
      );

      this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  

  valuechange(newValue) {
      //	this.toReport = newValue;
      this.report = newValue;
    }

    downloadExcel() {
      this.httpService.get(Configuration.get().dataMasterNew + '/pekerjaan/findAll?').subscribe(table => {
        this.listData2 = table.Pekerjaan;
        this.codes = [];

        for (let i = 0; i<this.listData2.length; i++){
          this.codes.push({
            kode: this.listData2[i].kode.kode,
            namaPekerjaanHead: this.listData2[i].namaPekerjaanHead,
            namaPekerjaan: this.listData2[i].namaPekerjaan,
            reportDisplay: this.listData2[i].reportDisplay,
            kodeExternal: this.listData2[i].kodeExternal,
            namaExternal: this.listData2[i].namaExternal,
            statusEnabled: this.listData2[i].statusEnabled
          })
        }
        this.fileService.exportAsExcelFile(this.codes, 'Pekerjaan');
      });

    }

    downloadPdf() {
      let cetak = Configuration.get().report + '/pekerjaan/laporanPekerjaan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
      window.open(cetak);
      // var col = ["Kode", "Parent", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
      // this.httpService.get(Configuration.get().dataMasterNew + '/pekerjaan/findAll?').subscribe(table => {
      //   this.listData2 = table.Pekerjaan;
      //   this.codes = [];

      //   for (let i = 0; i<this.listData2.length; i++){
      //     this.codes.push({
      //       kode: this.listData2[i].kode.kode,
      //       namaPekerjaanHead: this.listData2[i].namaPekerjaanHead,
      //       namaPekerjaan: this.listData2[i].namaPekerjaan,
      //       reportDisplay: this.listData2[i].reportDisplay,
      //       kodeExternal: this.listData2[i].kodeExternal,
      //       namaExternal: this.listData2[i].namaExternal,
      //       statusEnabled: this.listData2[i].statusEnabled
      //     })
      //   }
      //   this.fileService.exportAsPdfFile("Master Pekerjaan", col, this.codes, "Pekerjaan");

      // });

    }
    getPage(page: number, rows: number, search: any) {
      this.httpService.get(Configuration.get().dataMasterNew + '/pekerjaan/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
        this.listData = table.Pekerjaan;
        this.totalRecords = table.totalRow;

      });
    }

    cari() {
      this.httpService.get(Configuration.get().dataMasterNew + '/pekerjaan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPekerjaan&sort=desc&namaPekerjaan=' + this.pencarian).subscribe(table => {
        this.listData = table.Pekerjaan;
      });
    }
    loadPage(event: LazyLoadEvent) {
      this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pekerjaan');
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
      }
    });
  }
  update() {
    this.httpService.update(Configuration.get().dataMasterNew + '/pekerjaan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/pekerjaan/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.getPage(this.page, this.rows, this.pencarian);
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
  clone(cloned: Pekerjaan): Pekerjaan {
    let hub = new InisialPekerjaan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPekerjaan();
    fixHub = {

      "kdPekerjaanHead": hub.kdPekerjaanHead,
      "kode": hub.kode.kode,
      "namaPekerjaan": hub.namaPekerjaan,
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/pekerjaan/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.getPage(this.page, this.rows, this.pencarian);
    });
    this.reset();
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
    this.print.showEmbedPDFReport(Configuration.get().report + '/pekerjaan/laporanPekerjaan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPekerjaan_laporanCetak');

    // let cetak = Configuration.get().report + '/pekerjaan/laporanPekerjaan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
}

class InisialPekerjaan implements Pekerjaan {

  constructor(
   public pekerjaan?,
   public kdPekerjaanHead?,
   public kdDepartemen?,
   public kode?,
   public kodeExternal?,
   public namaPekerjaan?,
   public namaExternal?,
   public reportDisplay?,
   public statusEnabled?,
   public version?,
   public id?

   ) { }


}
