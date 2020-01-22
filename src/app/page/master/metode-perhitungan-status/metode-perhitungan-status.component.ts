import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { MetodePerhitunganStatus } from './metode-perhitungan-status.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-metode-perhitungan-status',
  templateUrl: './metode-perhitungan-status.component.html',
  styleUrls: ['./metode-perhitungan-status.component.scss'],
  providers: [ConfirmationService]
})
export class MetodePerhitunganStatusComponent implements OnInit {
  selected: MetodePerhitunganStatus;
  listData: MetodePerhitunganStatus[];
  dataDummy: {};
  versi: any;
  listRangeMasaKerja: MetodePerhitunganStatus[];
  listMetodeHitung: MetodePerhitunganStatus[];
  listStatusPegawai: MetodePerhitunganStatus[];
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

      'kdRangeMasaKerja': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'kdMetodeHitung': new FormControl('', Validators.required),
      'kdStatusPegawai': new FormControl('', Validators.required),
      'totalQtyHariKuotaNow': new FormControl('', Validators.required),
      'totalQtyHariKuotaNext': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),

    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MetodePerhitungan&select=namaMetodeHitung,id').subscribe(res => {
      this.listMetodeHitung = [];
      this.listMetodeHitung.push({ label: '--Pilih Metode Perhitungan-', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listMetodeHitung.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Range&select=namaRange,id').subscribe(res => {
      this.listRangeMasaKerja = [];
      this.listRangeMasaKerja.push({ label: '--Pilih Range Masa Kerja-', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listRangeMasaKerja.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
      this.listStatusPegawai = [];
      this.listStatusPegawai.push({ label: '--Pilih StatusPegawai-', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listStatusPegawai.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
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

    this.httpService.get(Configuration.get().dataMasterNew + '/metodeperhitunganstatus/findAll?page='+this.page+'&rows='+this.rows+'&dir=metodePerhitungan.namaMetodeHitung&sort=desc').subscribe(table => {
      this.listData = table.MetodePerhitunganStatus;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

              kode: this.listData[i].kode.kdProfile,
              namaMetodeHitung: this.listData[i].namaMetodeHitung,
              namaStatusPegawai: this.listData[i].namaStatusPegawai,
              namaRangeMasaKerja: this.listData[i].namaRangeMasaKerja,
              totalQtyHariKuotaNow: this.listData[i].totalQtyHariKuotaNow,
              totalQtyHariKuotaNext: this.listData[i].totalQtyHariKuotaNext,
              statusEnabled: this.listData[i].statusEnabled
              

          })

              // debugger;
          }
          this.fileService.exportAsExcelFile(this.codes, 'MetodePerhitunganStatus');
      });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/metodePerhitunganStatus/laporanMetodePerhitunganStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }

  tutupLaporan() {
    this.laporan = false;
  }


  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/metodePerhitunganStatus/laporanMetodePerhitunganStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMetodePerhitunganStatus_laporanCetak');


    // let cetak = Configuration.get().report + '/metodePerhitunganStatus/laporanMetodePerhitunganStatus.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
    // this.laporan = true;
    // this.report.showEmbedPDFReport(Configuration.get().report + "/MetodePerhitunganStatus/listMetodePerhitunganStatus.pdf?kdDepartemen=1", '#report-pdf-MetodePerhitunganStatus', 400);
  }

  cari() {

    this.httpService.get(Configuration.get().dataMasterNew + '/metodeperhitunganstatus/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=metodePerhitungan.namaMetodeHitung&sort=desc&namaMetodeHitung=' + this.pencarian).subscribe(table => {
      this.listData = table.MetodePerhitunganStatus;
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
    this.httpService.get(Configuration.get().dataMasterNew + '/metodeperhitunganstatus/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.MetodePerhitunganStatus;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Metode Perhitungan Status');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/metodeperhitunganstatus/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/metodeperhitunganstatus/save?', this.form.value).subscribe(response => {
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
  clone(cloned: MetodePerhitunganStatus): MetodePerhitunganStatus {
    let hub = new InisialMetodePerhitunganStatus();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMetodePerhitunganStatus();
    fixHub = {
      "kode": hub.kode,
      "kdMetodeHitung": hub.kode.kdMetodeHitung,
      "kdStatusPegawai": hub.kode.kdStatusPegawai,
       "kdRangeMasaKerja": hub.kode.kdRangeMasaKerja, 
      "statusEnabled": hub.statusEnabled,
      "totalQtyHariKuotaNow": hub.totalQtyHariKuotaNow,
      "totalQtyHariKuotaNext": hub.totalQtyHariKuotaNext,



    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/metodeperhitunganstatus/del/' + deleteItem.kode.kdStatusPegawai +'/' + deleteItem.kode.kdMetodeHitung +'/' + deleteItem.kode.kdRangeMasaKerja ).subscribe(response => {
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

class InisialMetodePerhitunganStatus implements MetodePerhitunganStatus {

  constructor(
    public kdRangeMasaKerja?,
    public totalQtyHariKuotaNext?,
    public kode?,
    public kdStatusPegawai?,
    public kdMetodeHitung?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public totalQtyHariKuotaNow?,
  ) { }

}