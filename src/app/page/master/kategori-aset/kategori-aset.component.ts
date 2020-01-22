import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { KategoriAset } from './kategori-aset.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, ReportService, AuthGuard } from '../../../global';
@Component({
  selector: 'app-kategori-aset',
  templateUrl: './kategori-aset.component.html',
  styleUrls: ['./kategori-aset.component.scss'],
  providers: [ConfirmationService]
})
export class KategoriAsetComponent implements OnInit {
  selected: KategoriAset;
  listData: KategoriAset[];
  versi: any;
  kodekategoryAsetHead: KategoriAset[];
  pencarian: string = '';
  formAktif: boolean;
  form: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;
  items: MenuItem[];
  laporan: boolean = false;
  display: any;
  display2: any;
  kdprof: any;
  kddept: any;
  smbrFile:any;

  report: any

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
      'namaKategoryAset': new FormControl('', Validators.required),
      'kdKategoryAsetHead': new FormControl(''),
      'kode': new FormControl(null),
      // 'kdDepartemen': new FormControl(''),
      // 'noRec': new FormControl(''),
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
      /*{label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'},
      {label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming']}*/
    ];
    this.getSmbrFile();

  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}
  
  downloadExcel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryAset&select=namaKategoryAset').subscribe(table => {

    //   this.fileService.exportAsExcelFile(table.data.data, 'kategoryAset');
    // });
  }

  downloadPdf() {
    let b = Configuration.get().report + '/kategoryAset/laporanKategoryAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(b);
    // var col = ["Kode", "Nama KategoryAset"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryAset&select=id.kode,namaKategoryAset').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master KategoryAset", col, table.data.data, "kategoryAset");
    // });
  }

  tutupLaporan() {
    this.laporan = false;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kategoryAset/laporanKategoryAset.pdf?kdDepartemen='+this.kddept+'kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKategoriAset_laporanCetak');
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kategoryaset/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKategoryAset&sort=desc&namaKategoryAset=' + this.pencarian).subscribe(table => {
      this.listData = table.data.KategoryAset;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  getPage(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kategoryaset/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.KategoryAset;
      this.totalRecords = table.totalRow;

    });

    this.httpService.get(Configuration.get().dataMasterNew + '/kategoryaset/findAll?page=1&rows=1000&dir=namaKategoryAset&sort=desc').subscribe(res => {
      this.kodekategoryAsetHead = [];
      this.kodekategoryAsetHead.push({ label: '--Pilih Data Parent Kategori Aset--', value: '' })
      for (var i = 0; i < res.KategoryAset.length; i++) {
        this.kodekategoryAsetHead.push({ label: res.KategoryAset[i].namaKategoryAset, value: res.KategoryAset[i].kode.kode })
      };
    });
  }

  valuechange(newvalue) {
   this.report = newvalue;
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
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Kategori Aset');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/kategoryaset/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/kategoryaset/save?', this.form.value).subscribe(response => {
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
    console.log(this.form.value);
  }
  clone(cloned: KategoriAset): KategoriAset {
    let hub = new InisialKategoriAset();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialKategoriAset();
    fixHub = {
      "kode": hub.kode.kode,
      "kdKategoryAsetHead": hub.kdKategoryAsetHead,
      "namaKategoryAset": hub.namaKategoryAset,
      // "kdDepartemen": hub.kdDepartemen,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,
      // "noRec": hub.noRec,
    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/kategoryaset/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.getPage(this.page, this.rows, this.pencarian);
    });
    this.reset();
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
}

class InisialKategoriAset implements KategoriAset {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public namaKategoryAset?,
    public kdKategoryAsetHead?,
    public departemen?,
    public kdDepartemen?,
    public statusEnabled?,
    public version?,
    public noRec?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public KategoryAset?,

  ) { }

}