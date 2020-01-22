import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { KategoriDokumen } from './kategori-dokumen.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-kategori-dokumen',
  templateUrl: './kategori-dokumen.component.html',
  styleUrls: ['./kategori-dokumen.component.scss'],
  providers: [ConfirmationService]
})
export class KategoriDokumenComponent implements OnInit {

  selected: KategoriDokumen;
  listData: KategoriDokumen[];
  dataDummy: {};
  versi: any;
  pencarian: string = '';
  formAktif: boolean;
  form: FormGroup;
  laporan: boolean = false;
  items: MenuItem[];
  page: number;
  rows: number;
  totalRecords: number;
  reports: any;
  toReport: any;

  codes: any[];

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
    @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


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
      'namaKategoryDokumen': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
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
    this.httpService.get(Configuration.get().dataMasterNew + '/kategorydokumen/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKategoryDokumen&sort=desc').subscribe(table => {
     this.listData = table.KategoryDokumen;
     this.codes = [];

     for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaKategoryDokumen: this.listData[i].namaKategoryDokumen,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
        // }
      }
      this.fileService.exportAsExcelFile(this.codes, 'kategoryDokumen');
    });

  }

  // downloadPdf() {
  //   var col = ["Kode", "Nama ", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
  //   this.httpService.get(Configuration.get().dataMasterNew + '/kategorydokumen/findAll?').subscribe(table => {
  //     this.listData = table.KategoryDokumen;
  //     this.codes = [];

  //     for (let i = 0; i < this.listData.length; i++) {
  //       // if (this.listData[i].statusEnabled == true){
  //         this.codes.push({

  //           kode: this.listData[i].kode.kode,
  //           namaKategoryDokumen: this.listData[i].namaKategoryDokumen,
  //           reportDisplay: this.listData[i].reportDisplay,
  //           kodeExternal: this.listData[i].kodeExternal,
  //           namaExternal: this.listData[i].namaExternal,
  //           statusEnabled: this.listData[i].statusEnabled

  //         })
  //       // }
  //     }

  //     this.fileService.exportAsPdfFile("Master kategoryDokumen", col, this.codes, "kategoryDokumen");

  //   });

  // }

  downloadPdf(){
    let b = Configuration.get().report + '/kategoryDokumen/laporanKategoryDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kategoryDokumen/laporanKategoryDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKategoriDokumen_laporanCetak');
        // let b = Configuration.get().report + '/kategoryDokumen/laporanKategoryDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
      }

      tutupLaporan() {
        this.laporan = false;
    }


      // 
      

      getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kategorydokumen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
          this.listData = table.KategoryDokumen;
          this.totalRecords = table.totalRow;
        });
      }

      cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kategorydokumen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKategoryDokumen&sort=desc&namaKategoryDokumen=' + this.pencarian).subscribe(table => {
          this.listData = table.KategoryDokumen;
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


  valuechange(newValue) {

    this.toReport = newValue;
    this.reports = newValue;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Kategori Dokumen');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/kategorydokumen/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/kategorydokumen/save?', this.form.value).subscribe(response => {
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

  clone(cloned: KategoriDokumen): KategoriDokumen {
    let hub = new InisialKategoriDokumen();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialKategoriDokumen();
    fixHub = {
      "kode": hub.kode.kode,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "namaKategoryDokumen": hub.namaKategoryDokumen,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/kategorydokumen/del/' + deleteItem.kode.kode).subscribe(response => {
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

class InisialKategoriDokumen implements KategoriDokumen {

  constructor(
    public id?,
    public kategoryDokumen?,
    public kdProfile?,
    public kode?,
    public namaKategoryDokumen?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,

    ) { }

}