import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ProfileHistoryEvent } from './profilehistory-event.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-profilehistory-event',
  templateUrl: 'profilehistory-event.component.html',
  styleUrls: ['profilehistory-event.component.scss'],
  providers: [ConfirmationService]
})
export class ProfileHistoryEventComponent implements OnInit {

  item: ProfileHistoryEvent = new InisialProfileHistoryEvent();
  selected: ProfileHistoryEvent;
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
  dropdownEvent: any;
  namaFoto1: any;
  smbrFoto1: any;

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
    this.pencarian = '';
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'kdEvent': new FormControl('', Validators.required),
      'deskripsiEvent': new FormControl(null),
      'pathFileFolderEvent': new FormControl(null),
      'statusEnabled': new FormControl('', Validators.required),
      'tglAwal': new FormControl(new Date()),
      'tglAkhir': new FormControl(new Date()),
      'noHistori': new FormControl()
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

  getDrop() {

    this.httpService.get(Configuration.get().dataMaster + '/event/findAll?page=1&rows=1000000').subscribe(res => {
      //console.log(res);
      this.dropdownEvent = [];
      this.dropdownEvent.push({ label: '--Pilih Event--', value: '' })
      for (var i = 0; i < res.Event.length; i++) {
        this.dropdownEvent.push({ label: res.Event[i].namaEvent, value: res.Event[i].kode.kode })
      };
    });

  }


  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorievent/findAll?page=' + page + '&rows=' + rows + '&dir=event.namaEvent&sort=desc&namaEvent=' + search).subscribe(table => {
      this.listData = table.ProfileHistoriEvent;
      //console.log(table);
      //console.log(this.listData);                                                                                                                                                                                                                                                                                                   
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorievent/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=event.namaEvent&sort=desc&namaEvent=' + this.pencarian).subscribe(table => {
      this.listData = table.ProfileHistoriEvent;
    });
  }
  valuechange(newValue) {
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorievent/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaFasilitas&sort=desc').subscribe(table => {
      this.listData = table.ProfileHistoriEvent;
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/profilehistorievent/del/' + deleteItem.kode.noHistori + '/' + deleteItem.kode.kdEvent).subscribe(response => {
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
  }

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
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
    let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglAwal').value))
    let tglAkhir = Math.round(this.setTimeStamp(this.form.get('tglAkhir').value))

    const obj = new InisialProfileHistoryEvent()
    obj.kdEvent = this.form.value.kdEvent,
      obj.deskripsiEvent = this.form.value.deskripsiEvent,
      obj.statusEnabled = this.form.value.statusEnabled,
      obj.pathFileFolderEvent = this.form.value.pathFileFolderEvent,
      obj.tglAwal = tglAwal,
      obj.tglAkhir = tglAkhir,
      obj.noHistori = this.form.value.noHistori


    let dataSimpan = {
      "kdEvent": obj.kdEvent,
      "deskripsiEvent": obj.deskripsiEvent,
      "statusEnabled": obj.statusEnabled,
      "pathFileFolderEvent": obj.pathFileFolderEvent,
      "noHistori": obj.noHistori,
      "tglAwal": obj.tglAwal,
      "tglAkhir": obj.tglAkhir,
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/profilehistorievent/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }

  simpan() {
    let tglAwal = Math.round(this.setTimeStamp(this.form.get('tglAwal').value))
    let tglAkhir = Math.round(this.setTimeStamp(this.form.get('tglAkhir').value))

    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      const obj = new InisialProfileHistoryEvent()
      obj.kdEvent = this.form.value.kdEvent,
        obj.deskripsiEvent = this.form.value.deskripsiEvent,
        obj.statusEnabled = this.form.value.statusEnabled,
        obj.pathFileFolderEvent = this.form.value.pathFileFolderEvent,
        obj.tglAwal = tglAwal,
        obj.tglAkhir = tglAkhir

      let dataSimpan = {
        "kdEvent": obj.kdEvent,
        "deskripsiEvent": obj.deskripsiEvent,
        "statusEnabled": obj.statusEnabled,
        "pathFileFolderEvent": obj.pathFileFolderEvent,
        "tglAwal": obj.tglAwal,
        "tglAkhir": obj.tglAkhir
      }

      this.httpService.post(Configuration.get().dataMasterNew + '/profilehistorievent/save', dataSimpan).subscribe(response => {
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
    //console.log(cloned);                                                                                                                                                                                                                                                                                                            
    this.form.setValue(cloned);

  }
  clone(cloned) {
    let hub = new InisialProfileHistoryEvent();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialProfileHistoryEvent();
    this.smbrFoto1 = Configuration.get().resourceFile + '/image/show/' + hub.pathFileFolderEvent
    fixHub = {
      "kode": hub.kode,
      "kdEvent": hub.kode.kdEvent,
      //"namaEvent":hub.namaEvent,
      "deskripsiEvent": hub.deskripsiEvent,
      "statusEnabled": hub.statusEnabled,
      "pathFileFolderEvent": hub.pathFileFolderEvent,
      "noHistori": hub.kode.noHistori,
      "tglAwal": new Date(hub.tglAwal * 1000),
      "tglAkhir": new Date(hub.tglAkhir * 1000)
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
class InisialProfileHistoryEvent implements ProfileHistoryEvent {
  constructor(
    public kode?,
    public statusEnabled?,
    public kdEvent?,
    public namaEvent?,
    public noHistori?,
    public deskripsiEvent?,
    public pathFileFolderEvent?,
    public tglAwal?,
    public tglAkhir?
  ) { }
}


