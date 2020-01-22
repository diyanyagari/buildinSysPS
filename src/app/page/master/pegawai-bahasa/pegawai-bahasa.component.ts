import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiBahasa } from './pegawai-bahasa.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-pegawai-bahasa',
  templateUrl: './pegawai-bahasa.component.html',
  styleUrls: ['./pegawai-bahasa.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiBahasaComponent implements OnInit {
  selected: PegawaiBahasa;
  listData: any[];
  dataDummy: {};
  formAktif: boolean;
  pencarian: string;
  Negara: PegawaiBahasa[];
  versi: any;
  form: FormGroup;
  listLevelSpeaking: PegawaiBahasa[];
  listWritten: PegawaiBahasa[];
  listListening: PegawaiBahasa[];
  listPegawai: PegawaiBahasa[];
  listBahasa: PegawaiBahasa[];
  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdPegawai': new FormControl(''),
      'kdBahasa': new FormControl(''),
      'tglAwal': new FormControl(''),
      'tglAkhir': new FormControl(''),
      'kdLevelTingkatSpeaking': new FormControl(''),
      'kdLevelTingkatWritten': new FormControl(''),
      'kdLevelTingkatListening': new FormControl(''),
      'noUrutPrimary': new FormControl('', Validators.required),
      'keteranganLainnya': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
      // 'reportDisplay': new FormControl('', Validators.required),
      // 'namaExternal': new FormControl(''),
      // 'kodeExternal': new FormControl(''),

    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pegawai&select=namaLengkap,id').subscribe(res => {
      this.listPegawai = [];
      this.listPegawai.push({ label: '--Pilih Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listPegawai.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Bahasa&select=namaBahasa,id').subscribe(res => {
      this.listBahasa = [];
      this.listBahasa.push({ label: '--Pilih Bahasa--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listBahasa.push({ label: res.data.data[i].namaBahasa, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listLevelSpeaking = [];
      this.listLevelSpeaking.push({ label: '--Pilih Level Speaking--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listLevelSpeaking.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listWritten = [];
      this.listWritten.push({ label: '--Pilih  Level Written--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listWritten.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listListening = [];
      this.listListening.push({ label: '--Pilih Level Listening--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listListening.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    });

  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaibahasa/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.PegawaiBahasa;
      this.totalRecords = table.totalRow;

    });
  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaibahasa/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPropinsi&sort=desc&namaPropinsi=' + this.pencarian).subscribe(table => {
      this.listData = table.PegawaiBahasa;
    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  
  }
  // valuechange(newValue) {
  //   this.toReport = newValue;
  //   this.report = newValue;
  // }

  confirmDelete() {
    let kdPegawai = this.form.get('kdPegawai').value;
    if (kdPegawai == null || kdPegawai == undefined || kdPegawai == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai Bahasa');
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
    let tglAwal = this.setTimeStamp(this.form.get('tglAwal').value)
    let tglAkhir = this.setTimeStamp(this.form.get('tglAkhir').value)

    let formSubmit = this.form.value;
    formSubmit.tglAwal = tglAwal;
    formSubmit.tglAkhir = tglAkhir;
    this.httpService.update(Configuration.get().dataMasterNew + '/pegawaibahasa/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let tglAwal = this.setTimeStamp(this.form.get('tglAwal').value)
      let tglAkhir = this.setTimeStamp(this.form.get('tglAkhir').value)

      let formSubmit = this.form.value;
      formSubmit.tglAwal = tglAwal;
      formSubmit.tglAkhir = tglAkhir;

      this.httpService.post(Configuration.get().dataMasterNew + '/pegawaibahasa/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }
  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }
  }
  reset() {
    this.formAktif = true;
    this.form.reset();
  }
  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

  }
  clone(cloned: PegawaiBahasa): PegawaiBahasa {
    let hub = new InisialPropinsi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPropinsi();
    fixHub = {
      // "kode": hub.kode.kdBahasa,
      "kdPegawai": hub.kode.kdPegawai,
      "kdBahasa": hub.kode.kdBahasa,
      "tglAwal": new Date(hub.tglAwal * 1000),
      "tglAkhir": new Date(hub.tglAkhir * 1000),
      "kdLevelTingkatSpeaking": hub.kdLevelTingkatSpeaking,
      "kdLevelTingkatWritten": hub.kdLevelTingkatWritten,
      "kdLevelTingkatListening": hub.kdLevelTingkatListening,
      "noUrutPrimary": hub.noUrutPrimary,
      "keteranganLainnya": hub.keteranganLainnya,
      // "kodeExternal": hub.kodeExternal,
      // "namaExternal": hub.namaExternal,
      // "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,



    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaibahasa/del/' + deleteItem.kode.kdPegawai+ '/'+ deleteItem.kode.kdBahasa).subscribe(response => {
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

class InisialPropinsi implements PegawaiBahasa {

  constructor(
    public id?,
    public kode?,
    public kdPegawai?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,

    public kdBahasa?,
    public tglAwal?,
    public tglAkhir?,
    public kdLevelTingkatSpeaking?,
    public kdLevelTingkatWritten?,
    public kdLevelTingkatListening?,
    public noUrutPrimary?,
    public keteranganLainnya?,





  ) { }

}