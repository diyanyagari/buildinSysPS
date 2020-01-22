import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { ModulUser } from './modul-user.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-modul-user',
  templateUrl: './modul-user.component.html',
  styleUrls: ['./modul-user.component.scss'],
  providers: [ConfirmationService]
})
export class ModulUserComponent implements OnInit {
  listData1: any[];
  listData2: any[];
  listData3: any[];
  listData4: any[];
  selected: ModulUser;
  form: FormGroup;
  kodeKelompok: ModulUser[];
  kodeModul: ModulUser[];
  kodeDepartemen: ModulUser[];
  kodeKelompokUser: ModulUser[];
  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  formModulToObjek: FormGroup;
  formKelompokUserToObjek: FormGroup;
  formDepartemenToObjek: FormGroup;
  formKelompokTransaksiToRuangan: FormGroup;

  version: any;
  cekLampiranDokumen: boolean = false;
  hasilCek1: boolean = false;
  hasilCek2: boolean = false;
  hasilCek3: boolean = false;
  hasilCek4: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  pilihantab1: any = [];
  pilihantab2: any = [];
  pilihantab3: any = [];
  pilihantab4: any = [];
  pilihSemua1: boolean;
   pilihSemua2: boolean;
    pilihSemua3: boolean;
     pilihSemua4: boolean;
  kdModulAplikasi: any;
  kdKelompokUser: any;
  kdDepartemen: any;
  kdKelompokTransaksi: any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef
  ) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;

  }
  ngAfterViewInit() {
    this.hasilCek1 = true;
    this.hasilCek2 = true;
    this.hasilCek3 = true;
    this.hasilCek4 = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawahTab1(this.kdModulAplikasi);
    this.clearPanelBawahTab2(this.kdKelompokUser);
    this.clearPanelBawahTab3(this.kdDepartemen);
    this.clearPanelBawahTab4(this.kdKelompokTransaksi);
  }

  ngOnInit() {
    this.version = "1";
    this.getTab1(this.page, this.rows, '');
    this.getTab2(this.page, this.rows, '');
    this.getTab3(this.page, this.rows, '');
    this.getTab4(this.page, this.rows, '');

    this.formModulToObjek = this.fb.group({
      'kdModulAplikasi': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.formKelompokUserToObjek = this.fb.group({
      'kdKelompokUser': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.formDepartemenToObjek = this.fb.group({
      'kdDepartemen': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.formKelompokTransaksiToRuangan = this.fb.group({
      'kdKelompokTransaksi': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAll?' + '&select=namaModulAplikasi').subscribe(res => {
      this.kodeModul = [];
      this.kodeModul.push({ label: '--Pilih Modul Aplikasi--', value: '' })
      for (var i = 0; i < res.ModulAplikasi.length; i++) {
        this.kodeModul.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokuser/findAll?' + '&select=namaKelompokUser').subscribe(res => {
      this.kodeKelompokUser = [];
      this.kodeKelompokUser.push({ label: '--Pilih Kelompok User--', value: '' })
      for (var i = 0; i < res.KelompokUser.length; i++) {
        this.kodeKelompokUser.push({ label: res.KelompokUser[i].namaKelompokUser, value: res.KelompokUser[i].kode.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
      this.kodeDepartemen = [];
      this.kodeDepartemen.push({ label: '--Pilih Departemen--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?' + '&select=namaKelompokTransaksi').subscribe(res => {
      this.kodeKelompok = [];
      this.kodeKelompok.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
      for (var i = 0; i < res.KelompokTransaksi.length; i++) {
        this.kodeKelompok.push({ label: res.KelompokTransaksi[i].namaKelompokTransaksi, value: res.KelompokTransaksi[i].kode })
      };
    });

  }

  getTab1(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/objekmodulaplikasi/findAll?page=1&rows=10&dir=namaObjekModulAplikasi&sort=desc').subscribe(res => {
      this.listData1 = res.ObjekModulAplikasi;
    });
  }

  getTab2(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/objekmodulaplikasi/findAll?page=1&rows=10&dir=namaObjekModulAplikasi&sort=desc').subscribe(res => {
      this.listData2 = res.ObjekModulAplikasi;
    });
  }

  getTab3(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/objekmodulaplikasi/findAll?page=1&rows=10&dir=namaObjekModulAplikasi&sort=desc').subscribe(res => {
      this.listData3 = res.ObjekModulAplikasi;
    });
  }

  getTab4(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode.kode').subscribe(res => {
      this.listData4 = res.data.data;
    });
  }

  clearPanelBawahTab1(kdModulAplikasi) {
    if (kdModulAplikasi == '' || kdModulAplikasi == null) {
      this.hasilCek1 = true;
      this.pilihantab1 = [];

    } else {
      this.hasilCek1 = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findByKode?' + 'kdModulAplikasi=' + kdModulAplikasi).subscribe(res => {
        this.pilihantab1 = [];
        for (let i = 0; i < res.MapObjekModulToModulAplikasi.length; i++) {
          this.pilihantab1.push(String(res.MapObjekModulToModulAplikasi[i].kode.kdObjekModulAplikasi))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }
  }

  clearPanelBawahTab2(kdKelompokUser) {
    if (kdKelompokUser == '' || kdKelompokUser == null) {
      this.hasilCek2 = true;
      this.pilihantab2 = [];

    } else {
      this.hasilCek2 = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/findByKode/' + kdKelompokUser).subscribe(res => {
        this.pilihantab2 = [];
        for (let i = 0; i < res.MapObjekModulToKelompokUser.length; i++) {
          this.pilihantab2.push(String(res.MapObjekModulToKelompokUser[i].kode.kdObjekModulAplikasi))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }
  }

  clearPanelBawahTab3(kdDepartemen) {
    if (kdDepartemen == '' || kdDepartemen == null) {
      this.hasilCek3 = true;
      this.pilihantab3 = [];

    } else {
      this.hasilCek3 = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultodepartemen/findByKode/' + kdDepartemen).subscribe(res => {
        this.pilihantab3 = [];
        for (let i = 0; i < res.MapObjekModulToDepartemen.length; i++) {
          this.pilihantab3.push(String(res.MapObjekModulToDepartemen[i].kode.kdObjekModulAplikasi))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }
  }

  clearPanelBawahTab4(kdKelompokTransaksi) {
    if (kdKelompokTransaksi == '' || kdKelompokTransaksi == null) {
      this.hasilCek4 = true;
      this.pilihantab4 = [];

    } else {
      this.hasilCek4 = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/findByKode/' + kdKelompokTransaksi).subscribe(res => {
        this.pilihantab4 = [];
        for (let i = 0; i < res.MapKelompokTransaksiToRuangan.length; i++) {
          this.pilihantab4.push(String(res.MapKelompokTransaksiToRuangan[i].kode.kdRuangan))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }
  }

  selectAll1() {
    if (this.pilihSemua1 == true) {
      this.pilihantab1 = []
      let dataTemp = []
      this.listData1.forEach(function (data) {
        dataTemp.push(String(data.kdObjekModulAplikasi));
      })
      this.pilihantab1 = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihantab1 = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }

  selectAll2() {
    if (this.pilihSemua2 == true) {
      this.pilihantab2 = []
      let dataTemp = []
      this.listData2.forEach(function (data) {
        dataTemp.push(String(data.id_kode));
      })
      this.pilihantab2 = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihantab2 = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }


  selectAll3() {
    if (this.pilihSemua3 == true) {
      this.pilihantab3 = []
      let dataTemp = []
      this.listData3.forEach(function (data) {
        dataTemp.push(String(data.kdObjekModulAplikasi));
      })
      this.pilihantab3 = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihantab3 = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }

  selectAll4() {
    if (this.pilihSemua4 == true) {
      this.pilihantab4 = []
      let dataTemp = []
      this.listData4.forEach(function (data) {
        dataTemp.push(String(data.id_kode));
      })
      this.pilihantab4 = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihantab4 = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }


  onChange() {
    // console.log(JSON.stringify(this.pilihantab1))

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

  onSubmitModulToObjek() {
    if (this.formModulToObjek.invalid) {
      this.validateAllFormFields(this.formModulToObjek);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanModulToObjek();
    }
  }

  onSubmitKelompokUserToObjek() {
    if (this.formKelompokUserToObjek.invalid) {
      this.validateAllFormFields(this.formKelompokUserToObjek);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanKelompokUserToObjek();
    }
  }

  onSubmitDepartemenToObjek() {
    if (this.formDepartemenToObjek.invalid) {
      this.validateAllFormFields(this.formDepartemenToObjek);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanDepartemenToObjek();
    }
  }

  onSubmitKelompokTransaksiToRuangan() {
    if (this.formKelompokTransaksiToRuangan.invalid) {
      this.validateAllFormFields(this.formKelompokTransaksiToRuangan);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanKelompokTransaksiToRuangan();
    }
  }

  simpanModulToObjek() {
    let mapObjekModulToModulAplikasi = []
    for (let i = 0; i < this.pilihantab1.length; i++) {
      let dataTemp = {
        "kdObjekModulAplikasi": this.pilihantab1[i],
        "kdModulAplikasi": this.formModulToObjek.get('kdModulAplikasi').value,
        "statusEnabled": true
      }
      mapObjekModulToModulAplikasi.push(dataTemp);
    }
    let dataSimpan = {
      "mapObjekModulToModulAplikasi": mapObjekModulToModulAplikasi
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');

    });
  }

  simpanKelompokUserToObjek() {
    let mapObjekModulToKelompokUser = []
    for (let i = 0; i < this.pilihantab2.length; i++) {
      let dataTemp = {
        "kdObjekModulAplikasi": this.pilihantab2[i],
        "kdKelompokUser": this.formKelompokUserToObjek.get('kdKelompokUser').value,
        "statusEnabled": true
      }
      mapObjekModulToKelompokUser.push(dataTemp);
    }
    let dataSimpan = {
      "mapObjekModulToKelompokUser": mapObjekModulToKelompokUser
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');

    });
  }

  simpanDepartemenToObjek() {
    let mapObjekModulToDepartemen = []
    for (let i = 0; i < this.pilihantab3.length; i++) {
      let dataTemp = {
        "kdObjekModulAplikasi": this.pilihantab3[i],
        "kdDepartemen": this.formDepartemenToObjek.get('kdDepartemen').value,
        "statusEnabled": true
      }
      mapObjekModulToDepartemen.push(dataTemp);
    }
    let dataSimpan = {
      "mapObjekModulToDepartemen": mapObjekModulToDepartemen
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapobjekmodultodepartemen/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');

    });
  }

  simpanKelompokTransaksiToRuangan() {
    let mapKelompokTransaksiToRuangan = []
    for (let i = 0; i < this.pilihantab4.length; i++) {
      let dataTemp = {
        "kdRuangan": this.pilihantab4[i],
        "kdKelompokTransaksi": this.formKelompokTransaksiToRuangan.get('kdKelompokTransaksi').value,
        "statusEnabled": true
      }
      mapKelompokTransaksiToRuangan.push(dataTemp);
    }
    let dataSimpan = {
      "mapKelompokTransaksiToRuangan": mapKelompokTransaksiToRuangan
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');

    });
  }






}

