import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmationService } from 'primeng/primeng';
import { AlertService, Configuration, RowNumberService } from '../../../global';
import { PrinterService } from '../../../global/service/printer.service'


@Component({
  selector: 'app-map-komputer-to-printer',
  templateUrl: './map-komputer-to-printer.component.html',
  styleUrls: ['./map-komputer-to-printer.component.scss'],
  providers: [ConfirmationService]

})
export class MapKomputerToPrinterComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  formAktif: boolean;
  versi: any;
  listData: any[];
  totalRecords: any;
  page: number;
  rows: number;
  pencarian: any;
  tanggalAwal: any;
  tanggalAkhir: any;
  buttonAktif: boolean;
  listPrinterAction: any[];
  namaKomputerSesion:any;
  listPrinter: any = [];

  constructor(private fb: FormBuilder,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private rowNumberService: RowNumberService,
    private printerService: PrinterService,
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
    this.namaKomputerSesion = sessionStorage.getItem('namaKomputer');
    this.printerService.getAllPrinter(this.getPrinterList, this)

    this.formAktif = true;
    this.buttonAktif = true;
    this.pencarian = null;
    this.tanggalAwal = null;
    this.tanggalAkhir = null;
    this.listPrinterAction = [];
    this.form = this.fb.group({
      'host': new FormControl(this.namaKomputerSesion, Validators.required),
      'statusEnabled': new FormControl(null),
      'namaPrinter': new FormControl(null, Validators.required),
      'keterangan': new FormControl(null),
      'printerAction': new FormControl(null, Validators.required),
      'shoutcart': new FormControl(null, Validators.required),
    });

    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;

      this.httpService.get(Configuration.get().klinik1Java + '/printerAction/listPrinterAction').subscribe(res => {
        this.listPrinterAction.push({ label: '-- Pilih Aksi Printer --', value: null })
        for (var i = 0; i < res.length; i++) {
          this.listPrinterAction.push({ label: res[i].label, value: res[i].value })
        };
      });

    }
  }

  getPrinterList(ob: MapKomputerToPrinterComponent, data: any) {
    ob.listPrinter = [];
    ob.listPrinter.push({ label: '--Pilih Printer--', value: '' })
    for (let i = 0; i < data.length; i++) {
      ob.listPrinter.push({ label: data[i], value: data[i] })
    }
  }

  loadPage(event: LazyLoadEvent) {
    let search = null;
    this.getPage((event.rows + event.first) / event.rows, event.rows, search);
  }
  getPage(page: number, rows: number, search: any) {
    let param = search;
    this.httpService.get(Configuration.get().klinik1Java + '/mapHostToPrinter/findAll?page=' + page + '&rows=' + rows + '&dir=id.host&sort=asc&namaMapHostToPrinter=' + this.namaKomputerSesion).subscribe(table => {
      this.totalRecords = table.totalRow;
      this.listData = this.rowNumberService.addRowNumber(page, rows, table.MapHostToPrinter)
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
        "shoutcart": this.form.get('shoutcart').value,
        "printerAction": this.form.get('printerAction').value,
        "namaPrinter": this.form.get('namaPrinter').value,
        "keterangan": this.form.get('keterangan').value,
        "host": this.form.get('host').value,
        "statusEnabled": this.form.get('statusEnabled').value,
      }
      this.httpService.post(Configuration.get().klinik1Java + '/mapHostToPrinter/save?', data).subscribe(response => {
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
    this.getPage(this.page, this.rows, this.pencarian);
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
      "shoutcart": this.form.get('shoutcart').value,
      "printerAction": this.form.get('printerAction').value,
      "namaPrinter": this.form.get('namaPrinter').value,
      "keterangan": this.form.get('keterangan').value,
      "host": this.form.get('host').value,
      "statusEnabled": this.form.get('statusEnabled').value,
    }
    this.httpService.update(Configuration.get().klinik1Java + '/mapHostToPrinter/update/', data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  cari() {
    this.getPage(this.page, this.rows, this.pencarian);
  }

  onRowSelect(event) {
    this.formAktif = false;
    this.buttonAktif = false;
    this.form.get('printerAction').setValue(event.data.printerAction);
    this.form.get('namaPrinter').setValue(event.data.namaPrinter);
    this.form.get('host').setValue(event.data.kode.host);
    this.form.get('keterangan').setValue(event.data.keterangan);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('shoutcart').setValue(event.data.kode.shoutcart);
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
    this.httpService.delete(Configuration.get().klinik1Java + '/mapHostToPrinter/del/' + this.form.get('host').value + '/' + this.form.get('shoutcart').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });
  }
}
