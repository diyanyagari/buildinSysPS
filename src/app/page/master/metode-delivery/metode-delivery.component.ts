import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { MetodeDelivery } from './metode-delivery.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-metode-delivery',
  templateUrl: './metode-delivery.component.html',
  styleUrls: ['./metode-delivery.component.scss'],
  providers: [ConfirmationService]
})
export class MetodeDeliveryComponent implements OnInit {
 selected: MetodeDelivery;
  listData: MetodeDelivery[];
  dataDummy: {};
  versi: any;
  listDelivery: MetodeDelivery[];
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
  codes:any[];
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

  
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.getPage(this.page, this.rows, '');
    this.versi = null;
    this.form = this.fb.group({
      'kdMetodeDeliveryHead': new FormControl(null),
      'namaMetodeDelivery': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),

    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MetodeDelivery&select=namaMetodeDelivery,id').subscribe(res => {
      this.listDelivery = [];
      this.listDelivery.push({ label: '--Pilih Data Parent Metode Pengiriman--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listDelivery.push({ label: res.data.data[i].namaMetodeDelivery, value: res.data.data[i].id.kode })
      };
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

    this.getSmbrFile();
    
    

  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/metodedelivery/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaMetodeDelivery&sort=desc').subscribe(table => {
      this.listData = table.MetodeDelivery;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

              kode: this.listData[i].kode.kode,
              namaMetodeDelivery: this.listData[i].namaMetodeDelivery,
              kodeExternal: this.listData[i].kodeExternal,
              namaExternal: this.listData[i].namaExternal,
              statusEnabled: this.listData[i].statusEnabled,
              reportDisplay: this.listData[i].reportDisplay

          })
          }
          this.fileService.exportAsExcelFile(this.codes, 'MetodeDelivery');
      });
  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/metodeDelivery/laporanMetodeDelivery.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }

  tutupLaporan() {
    this.laporan = false;
  }


  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/metodeDelivery/laporanMetodeDelivery.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMetodeDelivery_laporanCetak');


    // let cetak = Configuration.get().report + '/metodeDelivery/laporanMetodeDelivery.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
    // this.laporan = true;
    // this.report.showEmbedPDFReport(Configuration.get().report + "/MetodeDelivery/listMetodeDelivery.pdf?kdDepartemen=1", '#report-pdf-MetodeDelivery', 400);
  }

  cari() {

    this.httpService.get(Configuration.get().dataMasterNew + '/metodedelivery/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaMetodeDelivery&sort=desc&namaMetodeDelivery=' + this.pencarian).subscribe(table => {
      this.listData = table.MetodeDelivery;
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


  getPage(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/metodedelivery/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.MetodeDelivery;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Metode Pengiriman');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/metodedelivery/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/metodedelivery/save?', this.form.value).subscribe(response => {
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
  clone(cloned: MetodeDelivery): MetodeDelivery {
    let hub = new InisialMetodeDelivery();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMetodeDelivery();
    fixHub = {
      "kode": hub.kode.kode,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "kdMetodeDeliveryHead": hub.kdMetodeDeliveryHead,
      "namaMetodeDelivery": hub.namaMetodeDelivery,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/metodedelivery/del/' + deleteItem.kode.kode).subscribe(response => {
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
}

class InisialMetodeDelivery implements MetodeDelivery {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public namaMetodeDelivery?,
    public kdMetodeDeliveryHead?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,

  ) { }

}
