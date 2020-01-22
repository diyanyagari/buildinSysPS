import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { HariLibur } from './harilibur.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-harilibur',
  templateUrl: './harilibur.component.html',
  // styleUrls: ['./harilibur.component.scss'],
  providers: [ConfirmationService]

})
export class HariLiburComponent implements OnInit {
  selected: HariLibur;
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
  smbrFile:any;


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
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaHariLibur': new FormControl('', Validators.required),
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
        this.downloadExel();
      }
    }];

    this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/harilibur/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.HariLibur;
      this.totalRecords = table.totalRow;

    });
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
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/harilibur/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaHariLibur&sort=desc&namaHariLibur=' + this.pencarian).subscribe(table => {
      this.listData = table.HariLibur;
    });
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/harilibur/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaHariLibur&sort=desc').subscribe(table => {
      this.listData = table.HariLibur;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaHariLibur: this.listData[i].namaHariLibur,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
        // }
      }

      this.fileService.exportAsExcelFile(this.codes, 'Hari Libur');
    });

  }

  // downloadPdf() {
  //   var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
  //   this.httpService.get(Configuration.get().dataMasterNew + '/harilibur/findAll?').subscribe(table => {
  //     this.listData = table.HariLibur;
  //     this.codes = [];

  //     for (let i = 0; i < this.listData.length; i++) {
  //       // if (this.listData[i].statusEnabled == true){
  //         this.codes.push({

  //           kode: this.listData[i].kode.kode,
  //           namaHariLibur: this.listData[i].namaHariLibur,
  //           reportDisplay: this.listData[i].reportDisplay,
  //           kodeExternal: this.listData[i].kodeExternal,
  //           namaExternal: this.listData[i].namaExternal,
  //           statusEnabled: this.listData[i].statusEnabled

  //         })
  //       // }
  //     }

  //     this.fileService.exportAsPdfFile("Master Hari Libur", col, this.codes, "Hari Libur");

  //   });

  // }

  downloadPdf(){
    let b = Configuration.get().report + '/hariLibur/laporanHariLibur.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/hariLibur/laporanHariLibur.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmHariLibur_laporanCetak');

        // let b = Configuration.get().report + '/hariLibur/laporanHariLibur.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
      this.laporan = false;
  }

      confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
          this.alertService.warn('Peringatan', 'Pilih Daftar Master Hari Libur');
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

      valuechange(newValue) {
    //	this.toReport = newValue;
    this.report = newValue;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/harilibur/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);

    });
    this.reset();
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
    this.httpService.update(Configuration.get().dataMasterNew + '/harilibur/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/harilibur/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
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
  clone(cloned: HariLibur): HariLibur {
    let hub = new InisialHariLibur();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialHariLibur();
    fixHub = {
      "kode": hub.kode.kode,
      "namaHariLibur": hub.namaHariLibur,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }


}
class InisialHariLibur implements HariLibur {
  constructor(
    public kode?,
    public namaHariLibur?,
    public noUrutHariLiburKe?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public id?,
    public version?
    )
  { }
}
