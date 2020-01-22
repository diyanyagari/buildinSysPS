import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapJenispetugasJenispegawai } from './map-jenispetugas-jenispegawai.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-jenispetugas-jenispegawai',
  templateUrl: './map-jenispetugas-jenispegawai.component.html',
  styleUrls: ['./map-jenispetugas-jenispegawai.component.scss'],
  providers: [ConfirmationService]
})
export class MapJenispetugasJenispegawaiComponent implements OnInit {
  listData: any[];
  selected: MapJenispetugasJenispegawai;
  form: FormGroup;
  kodeJenisPetugas: MapJenispetugasJenispegawai[];

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
  kdJenisPetugasPe: any;
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
    this.clearPanelBawah(this.kdJenisPetugasPe);


  }

  ngOnInit() {

    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdJenisPetugasPe': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),

    });




    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPetugasPelaksana&select=jenisPetugasPe,id').subscribe(res => {
      this.kodeJenisPetugas = [];
      this.kodeJenisPetugas.push({ label: '--Pilih Jenis Petugas--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisPetugas.push({ label: res.data.data[i].jenisPetugasPe, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPegawai&select=namaJenisPegawai,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }

  clearPanelBawah(kdJenisPetugasPe) {

    if (kdJenisPetugasPe == '' || kdJenisPetugasPe == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapJenisPetugasPToJenisPegawai/findByKode/' + kdJenisPetugasPe).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapJenisPetugasPToJenisPegawai.length; i++) {
          this.pilihan.push(String(res.mapJenisPetugasPToJenisPegawai[i].kdJenisPegawai))
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


  // onChange(label: string, isChecked: boolean, value: number) {
  //   const pangkatFormArray = <FormArray>this.myForm.controls.mapJabatanToPangkat;

  //   if (isChecked) {
  //     pangkatFormArray.push(new FormControl({
  //       "kdPangkat": label, "kdJabatan": this.form.get('kdJabatan').value,
  //       "statusEnabled": this.form.get('statusEnabled').value
  //     }));
  //   } else {
  //     let index = pangkatFormArray.controls.findIndex(x => x.value == value)
  //     pangkatFormArray.removeAt(index);
  //   }
  // }
  // toggleSelect = function (event, label: string) {

  //   this.pilihSemua = event.target.checked;

  //   this.kodePangkat.forEach(function (item) {
  //     item.selected = event.target.checked;


  //   });

  // }
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
    let mapJenisPetugasPToJenisPegawai = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdJenisPegawai": this.pilihan[i],
        "kdJenisPetugasPe": this.form.get('kdJenisPetugasPe').value,
        "statusEnabled": true
      }
      mapJenisPetugasPToJenisPegawai.push(dataTemp);
    }
    let dataSimpan = {
      "mapJenisPetugasPToJenisPegawai": mapJenisPetugasPToJenisPegawai
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapJenisPetugasPToJenisPegawai/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
      this.pilihSemua = false;
    });
  }


}



