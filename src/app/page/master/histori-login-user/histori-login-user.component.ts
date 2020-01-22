import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, Message } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, UserDto, HttpClient } from '../../../global';

@Component({
  selector: 'app-histori-login-user',
  templateUrl: './histori-login-user.component.html',
  styleUrls: ['./histori-login-user.component.scss']
})
export class HistoriLoginUserComponent implements OnInit {

  tanggalAwal: any;
  tanggalAkhir: any;
  page: number;
  rows: number;
  listData: any[];
  selected: any;
  totalRecords: number;
  pencarianNamaObjek: any;
  pencarianNamaProses: any;
  pencarianDataCRUD: any;
  pencarianNamaUser: any;
  pencarianRuangan: any;
  pencarianNamaModulAplikasi: any;


  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private authGuard: AuthGuard
  ) { }

  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.tanggalAwal = new Date();
    this.tanggalAkhir = new Date();
    this.tanggalAwal.setHours(0, 0, 0, 0);
    this.tanggalAkhir.setHours(23, 59, 0, 0);
    let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
    let tanggalAwal = this.setTimeStamp(this.tanggalAwal);
    this.getDataGrid(this.page, this.rows, tanggalAwal, tanggalAkhir)
  }

  cariGridNamaProses(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any, cariProses: any) {

    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=1&rows=50' + '&tglAwal=' + awal + '&tglAkhir=' + akhir + '&namaProses=' + this.pencarianNamaProses).subscribe(table => {
      this.listData = table.data.log;

    });
  }

  cariGridNamaObjek(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any, cariObjek: any) {

    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=1&rows=50' + '&tglAwal=' + awal + '&tglAkhir=' + akhir + '&namaObjek=' + this.pencarianNamaObjek).subscribe(table => {
      this.listData = table.data.log;

    });

  }

  cariGridNamaDataCRUD(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any, cariNamaDataCRUD: any) {

    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=1&rows=50' + '&tglAwal=' + awal + '&tglAkhir=' + akhir + '&dataCrud=' + this.pencarianDataCRUD).subscribe(table => {
      this.listData = table.data.log;

    });

  }

  cariGridNamaUser(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any, cariNamaUser: any) {

    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=1&rows=50' + '&tglAwal=' + awal + '&tglAkhir=' + akhir + '&namaUser=' + this.pencarianNamaUser).subscribe(table => {
      this.listData = table.data.log;

    });

  }

  cariGridNamaRuangan(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any, cariNamaRuangan: any) {
    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=1&rows=50' + '&tglAwal=' + awal + '&tglAkhir=' + akhir + '&unitKerja=' + this.pencarianRuangan).subscribe(table => {
      this.listData = table.data.log;

    });
  }
  cariGridNamaModul(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any, cariNamaModul: any) {

    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=1&rows=50' + '&tglAwal=' + awal + '&tglAkhir=' + akhir + '&namaModul=' + this.pencarianNamaModulAplikasi).subscribe(table => {
      this.listData = table.data.log;

    });
  }



  loadPage(event: LazyLoadEvent) {
    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.getDataGrid((event.rows + event.first) / event.rows, event.rows, awal, akhir);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  getDataGrid(page: number, rows: number, tanggalAwal: any, tanggalAkhir: any) {
    this.httpService.get(Configuration.get().authLogin + '/logging/findAll?page=' + page + '&rows=50' + '&tglAwal=' + tanggalAwal + '&tglAkhir=' + tanggalAkhir).subscribe(table => {
      this.listData = table.data.log;
      let dataCrud: any[] = [];
      let dc;
      for (var i = 0; i < this.listData.length; i++) {
        if (this.listData[i].detailDataCRUD) {
          dc = this.listData[i].detailDataCRUD;
          dc.replace("[", "");
          dc.replace("]", "");
          dc.replace("\"", "");
          dataCrud = dc;
        }
      }
      console.log(dataCrud)
      this.totalRecords = table.data.log.totalRow;
    });
  }

  cari() {
    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    this.getDataGrid(Configuration.get().page, Configuration.get().rows, awal, akhir)
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
}
