import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapProdukSatuanstandar } from './map-produk-satuanstandar.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-produk-satuanstandar',
  templateUrl: './map-produk-satuanstandar.component.html',
  styleUrls: ['./map-produk-satuanstandar.component.scss'],
  providers: [ConfirmationService]
})
export class MapProdukSatuanstandarComponent implements OnInit {
  listData: any[];
  selected: MapProdukSatuanstandar;
  form: FormGroup;
  kodeProduk: MapProdukSatuanstandar[];

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
  kdProduk: any;
  pilihan: any = [];
  qty: any = [];
  pilihSemua: boolean;
  selectedSatuan: any;

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
    this.clearPanelBawah(this.kdProduk);


  }

  ngOnInit() {
    this.selectedSatuan = [];
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdProduk': new FormControl('', Validators.required),
    });

  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanStandar&select=namaSatuanStandar,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id').subscribe(res => {
      this.kodeProduk = [];
      this.kodeProduk.push({ label: '--Pilih Produk--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeProduk.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
      };
    });
  }



  clearPanelBawah(kdProduk) {

    if (kdProduk == '' || kdProduk == null) {
      this.hasilCek = true;
      this.selectedSatuan = [];
      this.listData = [];
      this.get(this.page, this.rows, '');
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapProdukToSatuanStandar/findByKode/' + kdProduk).subscribe(res => {
        console.log(res);
        let mapProduk = [];
        for (var i = 0; i < res.mapProdukToSatuanStandar.length; i++) {

          let data = {
            "id_kode": res.mapProdukToSatuanStandar[i].kdSatuanStandar,
            "namaSatuanStandar": res.mapProdukToSatuanStandar[i].namaSatuanStandar,
            "qtySatuKemasan": res.mapProdukToSatuanStandar[i].qtySatuKemasan
          }
          mapProduk.push(data);
        }
        console.log(mapProduk);
        let selected = mapProduk.map(val => val.id_kode);
        this.selectedSatuan = this.listData.filter(val => selected.indexOf(val.id_kode) != -1);
        for (var i = 0; i < mapProduk.length; ++i) {
          for (var j = 0; j < this.selectedSatuan.length; ++j) {
            if(mapProduk[i].id_kode == this.selectedSatuan[j].id_kode) {
              this.selectedSatuan[j].qtySatuKemasan = mapProduk[i].qtySatuKemasan;
            }
          }
        }
        for (var i = 0; i < this.listData.length; ++i) {
          for (var j = 0; j < mapProduk.length; ++j) {
            if(this.listData[i].id_kode == mapProduk[j].id_kode) {
              this.listData[i].qtySatuKemasan = mapProduk[j].qtySatuKemasan;
            }
          }
        }


        // let pilihan = [...this.listData];
        // let selected = [...this.selectedSatuan];
        // for (let i = 0; i < res.mapProdukToSatuanStandar.length; i++) {
        //   pilihan = pilihan.filter(function (obj) {
        //     return obj.id_kode !== res.mapProdukToSatuanStandar[i].kdSatuanStandar;
        //   });
        //   let tempData = {
        //     "id_kode": String(res.mapProdukToSatuanStandar[i].kdSatuanStandar),
        //     "namaSatuanStandar": String(res.mapProdukToSatuanStandar[i].namaSatuanStandar),
        //     "qtySatuKemasan": String(res.mapProdukToSatuanStandar[i].qtySatuKemasan)
        //   }
        //   selected.push(tempData);
        //   pilihan.push(tempData);

        // this.selectedSatuan = selected;
        // this.listData = pilihan;

      });

    }
    this.selectedSatuan = [];
    this.listData = [];
    this.get(this.page, this.rows, '');
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

  selectionData(event) {
    console.log(event);
  }
  rowSelect(event) {
    console.log(event);
    console.log(this.selectedSatuan);
  }

  simpan() {
    let mapProdukToSatuanStandar = []
    for (let i = 0; i < this.selectedSatuan.length; i++) {

      let dataTemp = {
        "kdSatuanStandar": this.selectedSatuan[i].id_kode,
        "qtySatuKemasan": this.selectedSatuan[i].qtySatuKemasan,
        "kdProduk": this.form.get('kdProduk').value,
        "statusEnabled": true
      }

      mapProdukToSatuanStandar.push(dataTemp);
    }

    let dataSimpan = {
      "mapProdukToSatuanStandar": mapProdukToSatuanStandar
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapProdukToSatuanStandar/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
      this.pilihSemua = false;
    });
  }


}






