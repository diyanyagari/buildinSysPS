import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapJenispegawaiDepartemen } from './map-jenispegawai-departemen.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-jenispegawai-departemen',
  templateUrl: './map-jenispegawai-departemen.component.html',
  styleUrls: ['./map-jenispegawai-departemen.component.scss'],
  providers: [ConfirmationService]
})
export class MapJenispegawaiDepartemenComponent implements OnInit {
  listData: any[];
  selected: MapJenispegawaiDepartemen;
  form: FormGroup;
  kodeJabatan: MapJenispegawaiDepartemen[];
  kodeDepartemen: MapJenispegawaiDepartemen[];
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
  kdJenisPegawai: any;
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
    this.clearPanelBawah(this.kdJenisPegawai);



  }

  ngOnInit() {
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdJenisPegawai': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPegawai&select=namaJenisPegawai,id').subscribe(res => {
      this.kodeJabatan = [];
      this.kodeJabatan.push({ label: '--Pilih Jenis Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJabatan.push({ label: res.data.data[i].namaJenisPegawai, value: res.data.data[i].id.kode })
      };
    });
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id.kode').subscribe(res => {
      this.listData = res.data.data
    });
  }


  clearPanelBawah(kdJenisPegawai) {
    if (kdJenisPegawai == '' || kdJenisPegawai == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapJenisPegawaiToDepartemen/findByKode/' + kdJenisPegawai).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapJenisPegawaiToDepartemen.length; i++) {
          this.pilihan.push(String(res.MapJenisPegawaiToDepartemen[i].kdDepartemen))
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
  //   const departemenFormArray = <FormArray>this.myForm.controls.mapJenisPegawaiToDepartemenDto;

  //   if (isChecked) {
  //     departemenFormArray.push(new FormControl({
  //       "kdDepartemen": label, "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
  //       "statusEnabled": this.form.get('statusEnabled').value
  //     }));
  //   } else {
  //     let index = departemenFormArray.controls.findIndex(x => x.value == value)
  //     departemenFormArray.removeAt(index);
  //   }
  // }

  // toggleSelect = function (event, label: string) {

  //   this.pilihSemua = event.target.checked;

  //   this.kodeDepartemen.forEach(function (item) {
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
    let mapJenisPegawaiToDepartemenDto = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdDepartemen": this.pilihan[i],
        "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
        "statusEnabled": true
      }
      mapJenisPegawaiToDepartemenDto.push(dataTemp);
    }
    let dataSimpan = {
      "mapJenisPegawaiToDepartemenDto": mapJenisPegawaiToDepartemenDto
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapJenisPegawaiToDepartemen/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
    });
  }



}

