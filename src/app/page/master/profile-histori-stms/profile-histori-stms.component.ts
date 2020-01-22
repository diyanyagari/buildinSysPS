import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmationService } from 'primeng/primeng';
import { AlertService, Configuration, RowNumberService } from '../../../global';


@Component({
  selector: 'app-profile-histori-stms',
  templateUrl: './profile-histori-stms.component.html',
  styleUrls: ['./profile-histori-stms.component.scss'],
  providers: [ConfirmationService]

})
export class ProfileHistoriStmsComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  formAktif: boolean;
  versi: any;
  listData: any[];
  totalRecords: any;
  page: number;
  rows: number;
  pencarianSlogan: any;
  tanggalAwal: any;
  tanggalAkhir: any;
  buttonAktif: boolean;
  constructor(private fb: FormBuilder,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private rowNumberService: RowNumberService
  ) { }

  ngAfterViewInit() {


    var calenderSetBackground1 = document.getElementsByClassName('ui-datepicker-trigger ui-calendar-button ng-tns-c10-12 ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < calenderSetBackground1.length; i++) {
      calenderSetBackground1[i].style.background = 'white';
    }
    var calenderSetBackground2 = document.getElementsByClassName('ui-datepicker-trigger ui-calendar-button ng-tns-c10-13 ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < calenderSetBackground2.length; i++) {
      calenderSetBackground2[i].style.background = 'white';
    }
  }

  ngOnInit() {
    this.formAktif = true;
    this.buttonAktif = true;
    this.pencarianSlogan = null;
    this.tanggalAwal = null;
    this.tanggalAkhir = null;
    this.form = this.fb.group({
      'sloganProfile': new FormControl(null),
      'statusEnabled': new FormControl(null),
      'noHistori': new FormControl(null),
      'keteranganLainnya': new FormControl(null),
      'mottoProfile': new FormControl(null, Validators.required),
      'noRec': new FormControl(null),
      'semboyanProfile': new FormControl(null, Validators.required),
      'taglineProfile': new FormControl(null),
      'version': new FormControl(null),
      'tglAwal': new FormControl(null),
      'tglAkhir': new FormControl(null),
      'messageToKlien': new FormControl(null),
    });

    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }



  }

  loadPage(event: LazyLoadEvent) {
    let tglAwal = null;
    let tglAkhir = null;
    let slogan = null;
    this.getPage((event.rows + event.first) / event.rows, event.rows, slogan, tglAwal, tglAkhir);
  }
  getPage(page: number, rows: number, slogan: any, tglAwal: any, tglAkhir: any) {
    let param = '';
    if (slogan != null) {
      if (param != '') {
        param += '&slogan=' + slogan;
      } else {
        param = '&slogan=' + slogan;
      }
    }
    if (tglAwal != null) {
      if (param != '') {
        param += '&periodeAwal=' + this.setTimeStamp(tglAwal)
      } else {
        param = '&periodeAwal=' + this.setTimeStamp(tglAwal)
      }
    }
    if (tglAkhir != null) {
      if (param != '') {
        param += '&periodeAkhir=' + this.setTimeStamp(tglAkhir)
      } else {
        param = '&periodeAkhir=' + this.setTimeStamp(tglAkhir)
      }
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/profilehistoristms/findAll?page=' + page + '&rows=' + rows + '&dir=sloganProfile&sort=desc' + param).subscribe(table => {
      this.totalRecords = table.totalRow;
      this.listData = this.rowNumberService.addRowNumber(page, rows, table.ProfileHistoriSTMS)
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
      this.alertService.warn("Peringatan", "Data Tidak Sesuai");
    } else {
      this.simpan();
    }
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let data = {
        "keteranganLainnya": this.form.get('keteranganLainnya').value,
        "messageToKlien": this.form.get('messageToKlien').value,
        "mottoProfile": this.form.get('mottoProfile').value,
        "semboyanProfile": this.form.get('semboyanProfile').value,
        "sloganProfile": this.form.get('sloganProfile').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "taglineProfile": this.form.get('taglineProfile').value,
        "tglAkhir": this.setTimeStamp(this.form.get('tglAkhir').value),
        "tglAwal": this.setTimeStamp(this.form.get('tglAwal').value)
      }
      this.httpService.post(Configuration.get().dataMasterNew + '/profilehistoristms/save?', data).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
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
    this.buttonAktif = true;
    this.getPage(this.page, this.rows, this.pencarianSlogan, this.tanggalAwal, this.tanggalAkhir);
    this.ngOnInit();
  }

  confirmUpdate() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      icon: 'fa fa-edit',
      accept: () => {
        this.update();
      }
    });
  }

  update() {
    let data = {
      "keteranganLainnya": this.form.get('keteranganLainnya').value,
      "messageToKlien": this.form.get('messageToKlien').value,
      "mottoProfile": this.form.get('mottoProfile').value,
      "noHistori": this.form.get('noHistori').value,
      "semboyanProfile": this.form.get('semboyanProfile').value,
      "sloganProfile": this.form.get('sloganProfile').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "taglineProfile": this.form.get('taglineProfile').value,
      "tglAkhir": this.setTimeStamp(this.form.get('tglAkhir').value),
      "tglAwal": this.setTimeStamp(this.form.get('tglAwal').value)
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/profilehistoristms/update/', data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  cari() {
    this.getPage(this.page, this.rows, this.pencarianSlogan, this.tanggalAwal, this.tanggalAkhir);
  }

  onRowSelect(event) {
    this.formAktif = false;
    this.buttonAktif = false;
    this.form.get('keteranganLainnya').setValue(event.data.keteranganLainnya);
    this.form.get('mottoProfile').setValue(event.data.mottoProfile);
    this.form.get('semboyanProfile').setValue(event.data.semboyanProfile);
    this.form.get('sloganProfile').setValue(event.data.sloganProfile);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('taglineProfile').setValue(event.data.taglineProfile);
    if (event.data.tglAkhir != null && event.data.tglAkhir != 0) {
      this.form.get('tglAkhir').setValue(new Date(event.data.tglAkhir * 1000));
    } else {
      this.form.get('tglAkhir').setValue(null);
    }

    if (event.data.tglAwal != null && event.data.tglAwal != 0) {
      this.form.get('tglAwal').setValue(new Date(event.data.tglAwal * 1000));
    } else {
      this.form.get('tglAwal').setValue(null);
    }
    this.form.get('noHistori').setValue(event.data.noHistori);
    this.form.get('messageToKlien').setValue(event.data.messageToKlien);
    this.versi = event.data.versi;
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Apakah data akan di hapus?',
      header: 'Konfirmasi Hapus',
      icon: 'fa fa-trash',
      accept: () => {
        this.hapus();
      }
    });
  }

  hapus() {
    this.httpService.delete(Configuration.get().dataMasterNew + '/profilehistoristms/del/' + this.form.get('noHistori').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });
  }
}
