import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { KategoriGaji } from './kategori-gaji.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-kategori-gaji',
  templateUrl: './kategori-gaji.component.html',
  styleUrls: ['./kategori-gaji.component.scss'],
  providers: [ConfirmationService]
})
export class KategoriGajiComponent implements OnInit {
  item: KategoriGaji = new InisialKategoriGaji();;
  selected: KategoriGaji;
  listData: KategoriGaji[];
  dataDummy: {};
  versi: any;
  kodekategoriGajiHead: KategoriGaji[];
  kodeDepartemen: KategoriGaji[];
  formKategoriGaji: FormGroup;
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
  cekIsAutoRevisiEvaluasi: any;
  isAutoRevisiEvaluasi: boolean;
  codes:any[];
  kdprof:any;
  kddept:any;
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

      'namaKategoryGaji': new FormControl('', Validators.required),
      'kdKategoryGajiHead': new FormControl(null),
      'kode': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      // 'kdDepartemen': new FormControl(''),
      'tglRevisiEvaluasiEfektif': new FormControl('', Validators.required),
      'isAutoRevisiEvaluasi': new FormControl('', Validators.required),
      // 'noRec': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required)
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

  getPage(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kategorygaji/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.KategoryGaji;
      this.totalRecords = table.totalRow;
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/kategorygaji/findAll?page=1&rows=1000&dir=namaKategoryGaji&sort=desc').subscribe(res => {
      this.kodekategoriGajiHead = [];
      this.kodekategoriGajiHead.push({ label: '--Pilih Data Parent Kategori Gaji--', value: null })
      for (var i = 0; i < res.KategoryGaji.length; i++) {
        this.kodekategoriGajiHead.push({ label: res.KategoryGaji[i].namaKategoryGaji, value: res.KategoryGaji[i].kode.kode })
      };
    });
  }


  downloadExcel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryGaji&select=namaKategoryGaji').subscribe(table => {

    //   this.fileService.exportAsExcelFile(table.data.data, 'kategoryGaji');
    // });
  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/kategoryGaji/laporanKategoryGaji.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama Kategori Gaji"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryGaji&select=id.kode,namaKategoryGaji').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master kategoryGaji", col, table.data.data, "kategoryGaji");
    // });
  }

  tutupLaporan() {
    this.laporan = false;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kategoryGaji/laporanKategoryGaji.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKategoriGaji_laporanCetak');

    // let cetak = Configuration.get().report + '/kategoryGaji/laporanKategoryGaji.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
    // this.laporan = true;
    // this.report.showEmbedPDFReport(Configuration.get().report + "/kategorygaji/listKategoryGaji.pdf?kdDepartemen=1", '#report-pdf-KategoryGaji', 400);
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kategorygaji/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKategoryGaji&sort=desc&namaKategoryGaji=' + this.pencarian).subscribe(table => {
      this.listData = table.KategoryGaji;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  changeConvertEvaluasi(event) {
    if (event == true) {
      this.cekIsAutoRevisiEvaluasi = 1

    } else {
      this.cekIsAutoRevisiEvaluasi = 0

    }

  }

  valuechange(newvalue) {
//    this.report = newvalue;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Kategory Gaji');
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
     if(this.form.get('isAutoRevisiEvaluasi').value == null || this.form.get('isAutoRevisiEvaluasi').value == undefined || this.form.get('isAutoRevisiEvaluasi').value == false) {
                this.cekIsAutoRevisiEvaluasi = 0;
            } else {
                this.cekIsAutoRevisiEvaluasi = 1;
            }
      let tglRevisiEvaluasiEfektifTS = this.setTimeStamp(this.form.get('tglRevisiEvaluasiEfektif').value)
      let isAutoRevisiEvaluasi = this.cekIsAutoRevisiEvaluasi
      let formSubmit = this.form.value;
      formSubmit.tglRevisiEvaluasiEfektif = tglRevisiEvaluasiEfektifTS;
      formSubmit.isAutoRevisiEvaluasi = isAutoRevisiEvaluasi;
    let fixHub = {

      "kode": this.form.get('kode').value,
      "namaKategoryGaji": this.form.get('namaKategoryGaji').value,
      "kdKategoryGajiHead": this.form.get('kdKategoryGajiHead').value,
      "tglRevisiEvaluasiEfektif": this.setTimeStamp(this.form.get('tglRevisiEvaluasiEfektif').value),
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "isAutoRevisiEvaluasi": this.cekIsAutoRevisiEvaluasi,
      "statusEnabled": this.form.get('statusEnabled').value

    }
    this.httpService.update(Configuration.get().dataMasterNew + '/kategorygaji/update/' + this.versi, formSubmit).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      this.getPage(this.page, this.rows, '');
      this.reset();

    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      if(this.form.get('isAutoRevisiEvaluasi').value == null || this.form.get('isAutoRevisiEvaluasi').value == undefined || this.form.get('isAutoRevisiEvaluasi').value == false) {
                this.cekIsAutoRevisiEvaluasi = 0;
            } else {
                this.cekIsAutoRevisiEvaluasi = 1;
            }
      let tglRevisiEvaluasiEfektifTS = this.setTimeStamp(this.form.get('tglRevisiEvaluasiEfektif').value)
      let isAutoRevisiEvaluasi = this.cekIsAutoRevisiEvaluasi
      let formSubmit = this.form.value;
      formSubmit.tglRevisiEvaluasiEfektif = tglRevisiEvaluasiEfektifTS;
      formSubmit.isAutoRevisiEvaluasi = isAutoRevisiEvaluasi;

      this.httpService.post(Configuration.get().dataMasterNew + '/kategorygaji/save?', formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
        this.getPage(this.page, this.rows, '');
        this.reset();
      });
    }
  }

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event) {
    // let cloned = this.clone(event.data);
    this.formAktif = false;
    // this.form.setValue(cloned);
    if (event.data.isAutoRevisiEvaluasi == 1) {
      this.isAutoRevisiEvaluasi = true;
      this.cekIsAutoRevisiEvaluasi = 1;
    } else {
      this.isAutoRevisiEvaluasi = false;
      this.cekIsAutoRevisiEvaluasi = 0;
    }

    this.form.get('kode').setValue(event.data.kode.kode),
      this.form.get('namaKategoryGaji').setValue(event.data.namaKategoryGaji),
      this.form.get('kdKategoryGajiHead').setValue(event.data.kdKategoryGajiHead),
      this.form.get('tglRevisiEvaluasiEfektif').setValue(new Date(event.data.tglRevisiEvaluasiEfektif * 1000)),
      this.form.get('namaExternal').setValue(event.data.namaExternal),
      this.form.get('kodeExternal').setValue(event.data.kodeExternal),
      this.form.get('reportDisplay').setValue(event.data.reportDisplay),
      this.form.get('isAutoRevisiEvaluasi').setValue(this.isAutoRevisiEvaluasi),
      this.form.get('statusEnabled').setValue(event.data.statusEnabled),
      this.versi = event.data.version;
  }


  // clone(cloned: KategoriGaji): KategoriGaji {
  //   let hub = new InisialKategoriGaji();
  //   for (let prop in cloned) {
  //     hub[prop] = cloned[prop];
  //   }
  //   let fixHub = new InisialKategoriGaji();
  //   fixHub = {
  //     "kode": hub.kode.kode,
  //     "namaKategoryGaji": hub.namaKategoryGaji,
  //     "kdKategoryGajiHead": hub.kdKategoryGajiHead,
  //     "reportDisplay": hub.reportDisplay,
  //     "kdDepartemen": hub.kdDepartemen,
  //     "kodeExternal": hub.kodeExternal,
  //     "namaExternal": hub.namaExternal,
  //     "isAutoRevisiEvaluasi": hub.isAutoRevisiEvaluasi,
  //     "tglRevisiEvaluasiEfektif": new Date(hub.tglRevisiEvaluasiEfektif * 1000),
  //     "noRec": hub.noRec,
  //     "statusEnabled": hub.statusEnabled,

  //   }
  //   this.versi = hub.version;
  //   return fixHub;
  // }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/kategorygaji/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.getPage(this.page, this.rows, '');
    });
    this.reset();
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {
  }

}

class InisialKategoriGaji implements KategoriGaji {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public kategoryGaji?,
    public namaKategoryGaji?,
    public noUrut?,
    public kdKategoryGajiHead?,
    public kdDepartemen?,
    public statusEnabled?,
    public version?,
    public noRec?,
    public isAutoRevisiEvaluasi?,
    public tglRevisiEvaluasiEfektif?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,

  ) { }

}