import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapGolonganpegawaiPangkat } from './map-golonganpegawai-pangkat.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-golonganpegawai-pangkat',
  templateUrl: './map-golonganpegawai-pangkat.component.html',
  styleUrls: ['./map-golonganpegawai-pangkat.component.scss'],
  providers: [ConfirmationService] 
})
export class MapGolonganpegawaiPangkatComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  kodeGolongan: MapGolonganpegawaiPangkat [] ;
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
  kdGolonganPegawai: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  version: any;
  listData1: any[];
  pilihan: any = [];
  pilihSemua: boolean;



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
    this.clearPanelBawah(this.kdGolonganPegawai);

  }

  ngOnInit() {
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdGolonganPegawai': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    // this.myForm = this.fb.group({
    //   mapgolonganpegawaitopangkatDto: this.fb.array([]),
    // });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=GolonganPegawai&select=namaGolonganPegawai,id').subscribe(res => {
      this.kodeGolongan = [];
      this.kodeGolongan.push({ label: '--Pilih Level Jabatan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeGolongan.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pangkat&select=namaPangkat,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }


  clearPanelBawah(kdGolonganPegawai) {
    // console.log(kdJenisPegawai);

    if (kdGolonganPegawai == '' || kdGolonganPegawai == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;
 

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapgolonganpegawaitopangkat/findByKode/' + kdGolonganPegawai).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapGolonganPegawaiToPangkat.length; i++) {
          this.pilihan.push(String(res.MapGolonganPegawaiToPangkat[i].kdPangkat))

        }

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
    } else {
      this.pilihan = []
    }
  }

  onChange() {
    console.log(JSON.stringify(this.pilihan));
  }


  // onChange(data: number, isChecked: boolean, values: number) {
  //   console.log(JSON.stringify(this.pilihan));
  //   const kdJabatanArray = <FormArray>this.form.controls.mapgolonganpegawaitopangkatDto;

  //   if (isChecked) {
  //     kdJabatanArray.push(new FormControl({
  //       "kdJabatan": data, "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
  //       "statusEnabled": this.form.get('statusEnabled').value
  //     }));

  //   } else {
  //     let index = kdJabatanArray.controls.findIndex(x => x.value == values)
  //     kdJabatanArray.removeAt(index);
  //   }
  // }


  // onChange(label: string, isChecked: boolean, values: number) {

  //   const kdJabatanArray = <FormArray>this.myForm.controls.mapgolonganpegawaitopangkatDto;

  //   if (isChecked) {
  //     kdJabatanArray.push(new FormControl({
  //       "kdJabatan": label, "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
  //       "statusEnabled": this.form.get('statusEnabled').value
  //     }));

  //   } else {
  //     let index = kdJabatanArray.controls.findIndex(x => x.value == values)
  //     kdJabatanArray.removeAt(index);
  //   }
  // }

  // toggleSelect = function (event, label: string) {

  //   this.pilihSemua = event.target.checked;

  //   this.listData.forEach(function (item) {
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
    let mapGolonganPegawaiToPangkat = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdPangkat": this.pilihan[i],
        "kdGolonganPegawai": this.form.get('kdGolonganPegawai').value,
        "statusEnabled": true
      }
      mapGolonganPegawaiToPangkat.push(dataTemp);
    }
    let dataSimpan = {
      "mapGolonganPegawaiToPangkat": mapGolonganPegawaiToPangkat
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/mapgolonganpegawaitopangkat/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
    });
  }
}






