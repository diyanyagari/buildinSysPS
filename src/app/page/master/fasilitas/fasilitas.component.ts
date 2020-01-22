import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Fasilitas } from './fasilitas.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-fasilitas',
  templateUrl: 'fasilitas.component.html',
  styleUrls: ['fasilitas.component.scss'],
  providers: [ConfirmationService]
})
export class FasilitasComponent implements OnInit {

  item: Fasilitas = new InisialFasilitas();
  selected: Fasilitas;
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
  dropdownjenisProduk: any;
  dropdownpegawaiPJawab: any;
  dropdownfasilitasHead: any;
  namaFoto1: any;
  smbrFoto1: any;
  namaFoto2: any;
  smbrFoto2: any;
  namaFoto3: any;
  smbrFoto3: any;
  namaFoto4: any;
  smbrFoto4: any;

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
  }

  ngAfterViewInit() {
    var x = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left") as HTMLCollectionOf<HTMLElement>;
    var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
    var path = document.getElementsByClassName("ui-inputtext ui-corner-all ui-state-default ui-widget ng-untouched ng-pristine ng-valid") as HTMLCollectionOf<HTMLElement>;
    var deskripsi = document.getElementById("deskripsiDetailFasilitas");
    var keteranganLain = document.getElementById("keteranganLainnya");
    for (var i = 0; i < x.length; i++) {
      x[i].style.height = '3.8vh';
      x[i].style.textAlign = 'center';
    }
    for (var i = 0; i < browseStyle.length; i++) {
      browseStyle[i].style.marginTop = '-0.5vh';
    }
    for (var i = 0; i < path.length; i++) {
      path[i].style.height = '3.8vh';
    }
    deskripsi.style.height = '11vh';
    keteranganLain.style.height = '11vh';
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
      'kode': new FormControl(null),
      'namaFasilitas': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'deskripsiDetailFasilitas': new FormControl(null),
      'pathFileGambar1': new FormControl(null),
      'pathFileGambar2': new FormControl(null),
      'pathFileGambar3': new FormControl(null),
      'pathFileGambar4': new FormControl(null),
      'fileGambar1': new FormControl(null),
      'fileGambar2': new FormControl(null),
      'fileGambar3': new FormControl(null),
      'fileGambar4': new FormControl(null),
      'kdFasilitasHead': new FormControl(null),
      'kdJenisProduk': new FormControl(null),
      'kdPegawaiPJawab': new FormControl(null),
      'qtyFasilitas': new FormControl(null),
      'keteranganLainnya': new FormControl(null),
      'kodeExternal': new FormControl(null),
      'namaExternal': new FormControl(null),
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
    this.getDrop();
  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }
  addHeader(event) {
    this.httpService.beforeUploadFile(event);
  }
  urlUpload() {
    return Configuration.get().resourceFile + '/file/upload?noProfile=false';
  }

  fileUpload1(event) {
    this.namaFoto1 = event.xhr.response;
    this.smbrFoto1 = Configuration.get().resourceFile + '/image/show/' + this.namaFoto1;
  }
  fileUpload2(event) {
    this.namaFoto2 = event.xhr.response;
    this.smbrFoto2 = Configuration.get().resourceFile + '/image/show/' + this.namaFoto2;
  }
  fileUpload3(event) {
    this.namaFoto3 = event.xhr.response;
    this.smbrFoto3 = Configuration.get().resourceFile + '/image/show/' + this.namaFoto3;
  }
  fileUpload4(event) {
    this.namaFoto4 = event.xhr.response;
    this.smbrFoto4 = Configuration.get().resourceFile + '/image/show/' + this.namaFoto4;
  }


  getDrop() {
    this.httpService.get(Configuration.get().dataMaster + '/jenisproduk/findAllData').subscribe(res => {
      this.dropdownjenisProduk = [];
      this.dropdownjenisProduk.push({ label: '--Pilih Jenis Produk--', value: '' })
      for (var i = 0; i < res.JenisProduk.length; i++) {
        this.dropdownjenisProduk.push({ label: res.JenisProduk[i].namaJenisProduk, value: res.JenisProduk[i].kode.kode })
      };
    });


    this.httpService.get(Configuration.get().dataMaster + '/fasilitas/findAllDataHead').subscribe(res => {
      this.dropdownfasilitasHead = [];
      this.dropdownfasilitasHead.push({ label: '--Pilih Head--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownfasilitasHead.push({ label: res.data[i].namaFasilitas, value: res.data[i].kode.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
      this.dropdownpegawaiPJawab = [];
      this.dropdownpegawaiPJawab.push({ label: '--Pilih Pegawai--', value: '' })
      for (var i = 0; i < res.Data.length; i++) {
        this.dropdownpegawaiPJawab.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
      };
    });

  }


  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitas/findAll?page=' + page + '&rows=' + rows + '&dir=namaFasilitas&sort=desc&namaFasilitas=' + search).subscribe(table => {
      this.listData = table.Fasilitas;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitas/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaFasilitas&sort=desc&namaFasilitas=' + this.pencarian).subscribe(table => {
      this.listData = table.Fasilitas;
    });
  }
  valuechange(newValue) {
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitas/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaFasilitas&sort=desc').subscribe(table => {
      this.listData = table.Fasilitas;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        this.codes.push({

          kode: this.listData[i].kode.kode,

        })
      }

      this.fileService.exportAsExcelFile(this.codes, 'fasilitas');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/fasilitas/laporanFasilitas.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Fasilitas');
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

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/fasilitas/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.ngOnInit();
    this.smbrFoto1 = "";
    this.smbrFoto2 = "";
    this.smbrFoto3 = "";
    this.smbrFoto4 = "";
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
    this.httpService.update(Configuration.get().dataMasterNew + '/fasilitas/update', this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/fasilitas/save', this.form.value).subscribe(response => {
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
  clone(cloned: Fasilitas): Fasilitas {
    let hub = new InisialFasilitas();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialFasilitas();
    this.smbrFoto1 = Configuration.get().resourceFile + '/image/show/' + hub.fileGambar1
    this.smbrFoto2 = Configuration.get().resourceFile + '/image/show/' + hub.fileGambar2
    this.smbrFoto3 = Configuration.get().resourceFile + '/image/show/' + hub.fileGambar3
    this.smbrFoto4 = Configuration.get().resourceFile + '/image/show/' + hub.fileGambar4
    fixHub = {
      "kode": hub.kode.kode,
      "namaFasilitas": hub.namaFasilitas,
      "reportDisplay": hub.reportDisplay,
      "deskripsiDetailFasilitas": hub.deskripsiDetailFasilitas,
      "pathFileGambar1": hub.pathFileGambar1,
      "pathFileGambar2": hub.pathFileGambar2,
      "pathFileGambar3": hub.pathFileGambar3,
      "pathFileGambar4": hub.pathFileGambar4,
      "fileGambar1": hub.fileGambar1,
      "fileGambar2": hub.fileGambar2,
      "fileGambar3": hub.fileGambar3,
      "fileGambar4": hub.fileGambar4,
      "kdFasilitasHead": hub.kdFasilitasHead,
      "kdJenisProduk": hub.kdJenisProduk,
      "kdPegawaiPJawab": hub.kdPegawaiPJawab,
      "qtyFasilitas": hub.qtyFasilitas,
      "keteranganLainnya": hub.keteranganLainnya,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,
    }
    return fixHub;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/fasilitas/laporanFasilitas.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmFasilitas(_laporanCetak');
  }
  tutupLaporan() {
    this.laporan = false;
  }


}
class InisialFasilitas implements Fasilitas {
  constructor(
    public kode?,
    public namaFasilitas?,
    public reportDisplay?,
    public deskripsiDetailFasilitas?,
    public pathFileGambar1?,
    public pathFileGambar2?,
    public pathFileGambar3?,
    public pathFileGambar4?,
    public fileGambar1?,
    public fileGambar2?,
    public fileGambar3?,
    public fileGambar4?,
    public kdFasilitasHead?,
    public kdJenisProduk?,
    public kdPegawaiPJawab?,
    public qtyFasilitas?,
    public keteranganLainnya?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
  ) { }
}


