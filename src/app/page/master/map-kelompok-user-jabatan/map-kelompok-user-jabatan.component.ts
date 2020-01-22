import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapKelompokUserJabatan } from './map-kelompok-user-jabatan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-kelompok-user-jabatan',
  templateUrl: './map-kelompok-user-jabatan.component.html',
  styleUrls: ['./map-kelompok-user-jabatan.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompokUserJabatanComponent implements OnInit {
  listData: any[];
  selected: MapKelompokUserJabatan;
  form: FormGroup;
  kodeJabatan: MapKelompokUserJabatan[];
  kelompok: MapKelompokUserJabatan[];
  kodeKategoryPegawai: MapKelompokUserJabatan[];
  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  myForm: FormGroup;
  version: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  kdKategoryPegawai: any;
  kdKelompokUser: any;
  pilihan: any = [];
  pilihSemua: boolean;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  ngAfterViewInit() {

    this.hasilCek = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    // this.clearPanelBawah();
  }

  ngOnInit() {


    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdKelompokUser': new FormControl('', Validators.required),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.form.get('kdKategoryPegawai').disable();
    this.pilihan = [];
    this.kodeKategoryPegawai = [];
    this.kelompok = [];
    //this.form.get('kdKelompokUser').disable();

    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokuser/findAll?page=1&rows=100&dir=namaKelompokUser&sort=desc').subscribe(res => {
      this.kelompok = [];
      this.kelompok.push({ label: '--Pilih Kelompok User--', value: '' })
      for (var i = 0; i < res.KelompokUser.length; i++) {
        this.kelompok.push({ label: res.KelompokUser[i].namaKelompokUser, value: res.KelompokUser[i].kode.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryPegawai&select=namaKategoryPegawai,id').subscribe(res => {
      this.kodeKategoryPegawai = [];
      this.kodeKategoryPegawai.push({ label: '--Pilih Kategory Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
    });

  }
  // changeStatus(event) {
  //   let val = event.value
  //   if (val >= 0) {
  //     this.form.get('kdKategoryPegawai').enable();
  //     this.form.get('kdKategoryPegawai').setValidators(Validators.required);

  //   } else {
  //     this.form.get('kdKategoryPegawai').disable();
  //     this.form.get('kdKategoryPegawai').clearValidators();

  //   }
  // }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Jabatan&select=namaJabatan,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }
  fungsiget() {
    // debugger;
    this.clearPanelBawah(this.form.get('kdKelompokUser').value, this.form.get('kdKategoryPegawai').value)
  }
  valuechange(value) {
    // debugger;
    let kdKategoryPegawai = this.form.get('kdKategoryPegawai').value;
    if (value !== null || value !== "") {
      this.form.get('kdKategoryPegawai').enable();
      if (kdKategoryPegawai != null && kdKategoryPegawai != "") {
        this.clearPanelBawah(value, this.form.get('kdKategoryPegawai').value);
      } else {
        console.log('sini');
      }
    } else {
      this.form.get('kdKategoryPegawai').disable();

    }
  }
  clearPanelBawah(kdKelompokUser: any, kdKategoryPegawai: any) {
    // debugger;
    if (kdKelompokUser == '' || kdKelompokUser == null) {
      if (kdKategoryPegawai == '' || kdKategoryPegawai == null) {
        this.hasilCek = true;
        this.pilihan = [];
        this.pilihSemua = false;
      }
    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokUserToJabatan/findByKode/' + kdKelompokUser + '/' + kdKategoryPegawai).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapKelompokUserToJabatan.length; i++) {
          this.pilihan.push(String(res.mapKelompokUserToJabatan[i].kdJabatan))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }

  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listData.forEach(function (data) {
        dataTemp.push(String(data.id_kode));
      })
      this.pilihan = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihan = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }

  onChange() {
    console.log(JSON.stringify(this.pilihan))
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
    let mapKelompokUserToJabatan = [];
    if (this.pilihan.length > 0) {
      for (let i = 0; i < this.pilihan.length; i++) {
        let dataTemp = {
          "kdJabatan": this.pilihan[i],
          "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
          "kdKelompokUser": this.form.get('kdKelompokUser').value,
          "statusEnabled": true
        }
        mapKelompokUserToJabatan.push(dataTemp);
      }
      let dataSimpan = {
        "mapKelompokUserToJabatan": mapKelompokUserToJabatan
      }

      this.httpService.update(Configuration.get().dataMasterNew + '/mapKelompokUserToJabatan/update/' + this.version, dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.pilihSemua = false;

      });
    } else {
      this.httpService.delete(Configuration.get().dataMasterNew + '/mapKelompokUserToJabatan/delByKdKelompokUserAndKdKategoryPegawai/'+ this.form.get('kdKelompokUser').value +'/'+this.form.get('kdKategoryPegawai').value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.pilihSemua = false;

      });
    }

  }
}





