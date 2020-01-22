import { ViewChild, Inject, forwardRef, Component, OnInit, AfterViewInit} from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokKlien } from './kelompokklien.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-kelompokklien',
  templateUrl: 'kelompokklien.component.html',
  styleUrls: ['kelompokklien.component.scss'],
  providers: [ConfirmationService]
})
export class KelompokKlienComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  item: KelompokKlien = new InisialKelompokKlien();
  selected: KelompokKlien;
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
  dropdownkelompokKlienHead: any;
  dropdownjenisTarif: any;
  valuesisIsiSJP: any;
	namaFile: string;
  smbrFileTable:any;
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
    for (var i = 0; i < x.length; i++) {
      x[i].style.height = '3.7vh';
      x[i].style.backgroundColor = '#3c67b1';
    }
    for (var i = 0; i < browseStyle.length; i++) {
      browseStyle[i].style.marginTop = '-0.5vh';
    }
  }

  ngOnInit() {
		this.namaFile = null;
		this.smbrFileTable = null;
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.pencarian = '';
    this.valuesisIsiSJP = 0;
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaKelompokKlien': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kdKelompokKlienHead': new FormControl(null),
      'kdJenisTarif': new FormControl(null),
      'isIsiSJP': new FormControl(false, Validators.required),
      'kodeExternal': new FormControl(null),
      'namaExternal': new FormControl(null),
      'iconImagePathFile': new FormControl(null),
      'statusEnabled': new FormControl(true, Validators.required),
    });
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Excel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExel();
        }
      }
    ];
    this.ngAfterViewInit();
    this.getSmbrFile();
    this.getDrop();
  }
  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }
  getDrop() {
    this.httpService.get(Configuration.get().dataMaster + '/kelompokklien/findAllHead').subscribe(res => {
      this.dropdownkelompokKlienHead = [];
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownkelompokKlienHead.push({ label: res.data[i].namaKelompokKlien, value: res.data[i].kode.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/jenistarif/findAllData').subscribe(res => {
      this.dropdownjenisTarif = [];
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownjenisTarif.push({ label: res.data[i].namaJenisTarif, value: res.data[i].kode.kode })
      };
    });
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokklien/findAll?page=' + page + '&rows=' + rows + '&dir=namaKelompokKlien&sort=desc&namaKelompokKlien=' + search).subscribe(table => {
      for (var i = 0; i < table.KelompokKlien.length; i++) {
          table.KelompokKlien[i].image = Configuration.get().resourceFile + '/image/show/' + table.KelompokKlien[i].iconImagePathFile
      }
      this.listData = table.KelompokKlien;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokklien/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokKlien&sort=desc&namaKelompokKlien=' + this.pencarian).subscribe(table => {
      this.listData = table.KelompokKlien;
      this.totalRecords = table.totalRow;
    });
  }
  valuechange(newValue) {
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokklien/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaKelompokKlien&sort=desc').subscribe(table => {
      this.listData = table.KelompokKlien;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        this.codes.push({

          kode: this.listData[i].kode.kode,

        })
      }

      this.fileService.exportAsExcelFile(this.codes, 'kelompokKlien');
    });
  }
  changeValues(event) {
    if (event == true) {
      this.valuesisIsiSJP = 1;
    } else {
      this.valuesisIsiSJP = 0;
    }
  }
  downloadPdf() {
    let cetak = Configuration.get().report + '/kelompokKlien/laporanKelompokKlien.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }
  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Klien');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokklien/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }
  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  reset() {
    this.dataTableComponent.reset();
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
    let datas = {
      "kode": this.form.get('kode').value,
      "namaKelompokKlien": this.form.get('namaKelompokKlien').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "kdKelompokKlienHead": this.form.get('kdKelompokKlienHead').value,
      "kdJenisTarif": this.form.get('kdJenisTarif').value,
      "isIsiSJP": this.valuesisIsiSJP,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "iconImagePathFile": this.namaFile,
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/kelompokklien/update', datas).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let datas = {
        "kode": null,
        "namaKelompokKlien": this.form.get('namaKelompokKlien').value,
        "reportDisplay": this.form.get('reportDisplay').value,
        "kdKelompokKlienHead": this.form.get('kdKelompokKlienHead').value,
        "kdJenisTarif": this.form.get('kdJenisTarif').value,
        "isIsiSJP": this.valuesisIsiSJP,
        "kodeExternal": this.form.get('kodeExternal').value,
        "namaExternal": this.form.get('namaExternal').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "iconImagePathFile": this.namaFile,
      }
      this.httpService.post(Configuration.get().dataMasterNew + '/kelompokklien/save', datas).subscribe(response => {
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
  clone(cloned: KelompokKlien): KelompokKlien {
    let hub = new InisialKelompokKlien();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialKelompokKlien();
    fixHub = {
      "kode": hub.kode.kode,
      "namaKelompokKlien": hub.namaKelompokKlien,
      "reportDisplay": hub.reportDisplay,
      "kdKelompokKlienHead": hub.kdKelompokKlienHead,
      "kdJenisTarif": hub.kdJenisTarif,
      "isIsiSJP": hub.isIsiSJP,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,
      "iconImagePathFile": hub.iconImagePathFile,
    }
		this.namaFile = hub.iconImagePathFile;
		this.smbrFile =  Configuration.get().resourceFile + '/image/show/' + hub.iconImagePathFile;
    return fixHub;
  }
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokKlien/laporanKelompokKlien.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmKelompokKlien(_laporanCetak');
  }
  tutupLaporan() {
    this.laporan = false;
  }
  urlUpload() {
		return Configuration.get().resourceFile + '/file/upload?noProfile=false';
	}
	fileUpload(event) {
		this.namaFile = event.xhr.response;
		// this.form.controls["pathFile"].setValue(this.namaFile);
		this.smbrFile = Configuration.get().resourceFile + '/image/show/' + this.namaFile;
	}
	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}
  onClear(da:any,db:any){
    da.filterValue = '';
    db.filterValue = '';
  }
}
class InisialKelompokKlien implements KelompokKlien {
  constructor(
    public kode?,
    public namaKelompokKlien?,
    public reportDisplay?,
    public kdKelompokKlienHead?,
    public kdJenisTarif?,
    public isIsiSJP?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public iconImagePathFile?,
  ) { }
}