import { Component, OnInit } from '@angular/core';
import { StrukturNomorDetail } from './struktur-nomor-detail.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-struktur-nomor-detail',
  templateUrl: './struktur-nomor-detail.component.html',
  styleUrls: ['./struktur-nomor-detail.component.scss'],
  providers: [ConfirmationService]
})
export class StrukturNomorDetailComponent implements OnInit {
  selected: StrukturNomorDetail;
  listData: any[];
  dataDummy: {};
  items: any;
  page: number;
  rows: number;
  listStruktur: StrukturNomorDetail[];
  listLevel: StrukturNomorDetail[];

  pencarian: string;
  versi: any;
  report: any;
  toReport: any;
  formAktif: boolean;
  form: FormGroup;
  totalRecords: number;


  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService) {

  }
  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdStrukturNomor': new FormControl(''),
      'kdLevelTingkat': new FormControl('', Validators.required),
      'qtyDigitKode': new FormControl('', Validators.required),
      'kodeUrutAwal': new FormControl('', Validators.required),
      'kodeUrutAkhir': new FormControl('', Validators.required),
      'formatKode': new FormControl('', Validators.required),
      'keteranganLainnya': new FormControl(''),
      'isAutoIncrement': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),


    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=StrukturNomor&select=namaStrukturNomor,id').subscribe(res => {
      this.listStruktur = [];
      this.listStruktur.push({ label: '--Pilih Struktur Nomor--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listStruktur.push({ label: res.data.data[i].namaStrukturNomor, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listLevel = [];
      this.listLevel.push({ label: '--Pilih Level Tingkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listLevel.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    });

  }
  valuechange(newValue) {
    //	this.toReport = newValue;
    this.report = newValue;
  }
  cari(page, rows) {
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomordetail/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=strukturNomor.namaStrukturNomor&sort=desc&namaStrukturNomor=' + this.pencarian).subscribe(table => {
      this.listData = table.StrukturNomorDetail;

    });
  }
  get(page: number, rows: number, seacrh: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomordetail/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.StrukturNomorDetail;
      this.totalRecords = table.totalRow;
    });


  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  confirmDelete() {
    let kdStrukturNomor = this.form.get('kdStrukturNomor').value;
    if (kdStrukturNomor == null || kdStrukturNomor == undefined || kdStrukturNomor == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Struktur Nomor Detail');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/strukturnomordetail/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
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
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/strukturnomordetail/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
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
  clone(cloned: StrukturNomorDetail): StrukturNomorDetail {
    let hub = new InisialStrukturNomorDetail();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialStrukturNomorDetail();
    fixHub = {

      "kdStrukturNomor": hub.kode.kdStrukturNomor,
      "kdLevelTingkat": hub.kode.kdLevelTingkat,
      "kodeUrutAkhir": hub.kodeUrutAkhir,
      "kodeUrutAwal": hub.kodeUrutAwal,
      "isAutoIncrement": hub.isAutoIncrement,
      "qtyDigitKode": hub.qtyDigitKode,
      "formatKode": hub.formatKode,
      "keteranganLainnya": hub.keteranganLainnya,
      "statusEnabled": hub.statusEnabled

    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/strukturnomordetail/del/' + deleteItem.kode.kdStrukturNomor + '/' + deleteItem.kode.kdLevelTingkat).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialStrukturNomorDetail implements StrukturNomorDetail {

  constructor(
    public id?,
    public kode?,
    public kdStrukturNomor?,
    public kdLevelTingkat?,
    public kodeUrutAkhir?,
    public kodeUrutAwal?,
    public isAutoIncrement?,
    public qtyDigitKode?,
    public formatKode?,
    public keteranganLainnya?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public Version?





  ) { }

}



