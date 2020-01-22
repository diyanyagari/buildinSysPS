import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapKelompoktransaksiJenisdokumen } from './map-kelompoktransaksi-jenisdokumen.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-kelompoktransaksi-jenisdokumen',
  templateUrl: './map-kelompoktransaksi-jenisdokumen.component.html',
  styleUrls: ['./map-kelompoktransaksi-jenisdokumen.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompoktransaksiJenisdokumenComponent implements OnInit {
 listData: any[];
  selected: MapKelompoktransaksiJenisdokumen;
  form: FormGroup;
  kodeKelompok: MapKelompoktransaksiJenisdokumen[];
  kodePosting: MapKelompoktransaksiJenisdokumen[];
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
  pilihan: any = [];
  pilihSemua: boolean;
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
    this.hasilCek = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdKelompokTransaksi);
  }

  ngOnInit() {
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdKelompokTransaksi': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page=1&rows=200&dir=namaKelompokTransaksi&sort=desc').subscribe(res => {
      this.kodeKelompok = [];
      this.kodeKelompok.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
      for (var i = 0; i < res.KelompokTransaksi.length; i++) {
        this.kodeKelompok.push({ label: res.KelompokTransaksi[i].namaKelompokTransaksi, value: res.KelompokTransaksi[i].kdKelompokTransaksi })
      };
    });
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisDokumen&select=namaJenisDokumen,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }
  clearPanelBawah(kdKelompokTransaksi) {
    if (kdKelompokTransaksi == '' || kdKelompokTransaksi == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokTransaksiToJD/findByKode/' + kdKelompokTransaksi).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapKelompokTransaksiToJD.length; i++) {
          this.pilihan.push(String(res.mapKelompokTransaksiToJD[i].kdJenisDokumen))
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
    let mapKelompokTransaksiToJD = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdJenisDokumen": this.pilihan[i],
        "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
        "statusEnabled": true
      }
      mapKelompokTransaksiToJD.push(dataTemp);
    }
    let dataSimpan = {
      "mapKelompokTransaksiToJD": mapKelompokTransaksiToJD
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapKelompokTransaksiToJD/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;

    });
  }

}

