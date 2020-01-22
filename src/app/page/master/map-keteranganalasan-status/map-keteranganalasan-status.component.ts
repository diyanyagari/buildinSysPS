import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapKeteranganalasanStatus } from './map-keteranganalasan-status.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-keteranganalasan-status',
  templateUrl: './map-keteranganalasan-status.component.html',
  styleUrls: ['./map-keteranganalasan-status.component.scss'],
    providers: [ConfirmationService]
})
export class MapKeteranganalasanStatusComponent implements OnInit {
listData: any[];
  selected: MapKeteranganalasanStatus;
  form: FormGroup;
  kodeKeteranganAlasan: MapKeteranganalasanStatus[];
  kodePosting: MapKeteranganalasanStatus[];
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
  kdKeteranganAlasan: any;

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
    this.clearPanelBawah(this.kdKeteranganAlasan);
  }

  ngOnInit() {
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdKeteranganAlasan': new FormControl('', Validators.required),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAll?page=1&rows=200&dir=namaKeteranganAlasan&sort=desc').subscribe(res => {
      this.kodeKeteranganAlasan = [];
      this.kodeKeteranganAlasan.push({ label: '--Pilih Keterangan Alasan--', value: '' })
      for (var i = 0; i < res.KeteranganAlasan.length; i++) {
        this.kodeKeteranganAlasan.push({ label: res.KeteranganAlasan[i].namaKeteranganAlasan, value: res.KeteranganAlasan[i].kode.kode })
      };
    });
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }
  clearPanelBawah(kdKeteranganAlasan) {
    if (kdKeteranganAlasan == '' || kdKeteranganAlasan == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapketeranganalasantostatus/findByKode/' + kdKeteranganAlasan).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapKeteranganAlasanToStatus.length; i++) {
          this.pilihan.push(String(res.mapKeteranganAlasanToStatus[i].kdStatus))
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
    let mapKeteranganAlasanToStatus = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdStatus": this.pilihan[i],
        "kdKeteranganAlasan": this.form.get('kdKeteranganAlasan').value,
        "statusEnabled": true
      }
      mapKeteranganAlasanToStatus.push(dataTemp);
    }
    let dataSimpan = {
      "mapKeteranganAlasanToStatus": mapKeteranganAlasanToStatus
    }


    this.httpService.update(Configuration.get().dataMasterNew + '/mapketeranganalasantostatus/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;

    });
  }

}
