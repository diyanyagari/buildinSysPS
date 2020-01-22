import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapKelompokevaluasiJabatan } from './map-kelompokevaluasi-jabatan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-kelompokevaluasi-jabatan',
  templateUrl: './map-kelompokevaluasi-jabatan.component.html',
  styleUrls: ['./map-kelompokevaluasi-jabatan.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompokevaluasiJabatanComponent implements OnInit {
  listData: any[];
  selected: MapKelompokevaluasiJabatan;
  form: FormGroup;
  kodeJabatan: MapKelompokevaluasiJabatan[];
  kelompok: MapKelompokevaluasiJabatan[];
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
  kdKelompokEvaluasi: any;
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
    this.clearPanelBawah(this.kdKelompokEvaluasi);
  }

  ngOnInit() {


    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdKelompokEvaluasi': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokEvaluasi&select=namaKelompokEvaluasi,id').subscribe(res => {
      this.kelompok = [];
      this.kelompok.push({ label: '--Pilih Kelompok Evaluasi--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kelompok.push({ label: res.data.data[i].namaKelompokEvaluasi, value: res.data.data[i].id.kode })
      };
    });
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Jabatan&select=namaJabatan,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }

  clearPanelBawah(kdKelompokEvaluasi) {
    if (kdKelompokEvaluasi == '' || kdKelompokEvaluasi == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokEvaluasiToJabatan/findByKode/' + kdKelompokEvaluasi).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapKelompokEvaluasiToJabatan.length; i++) {
          this.pilihan.push(String(res.mapKelompokEvaluasiToJabatan[i].kdJabatan))
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
    let mapKelompokEvaluasiToJabatan = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdJabatan": this.pilihan[i],
        "kdKelompokEvaluasi": this.form.get('kdKelompokEvaluasi').value,
        "statusEnabled": true
      }
      mapKelompokEvaluasiToJabatan.push(dataTemp);
    }
    let dataSimpan = {
      "mapKelompokEvaluasiToJabatan": mapKelompokEvaluasiToJabatan
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapKelompokEvaluasiToJabatan/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;

    });
  }
}





