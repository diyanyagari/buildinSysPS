import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapKelompoktransaksiKeteranganalasan } from './map-kelompoktransaksi-keteranganalasan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-kelompoktransaksi-keteranganalasan',
  templateUrl: './map-kelompoktransaksi-keteranganalasan.component.html',
  styleUrls: ['./map-kelompoktransaksi-keteranganalasan.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompoktransaksiKeteranganalasanComponent implements OnInit {
  listData: any[];
  selected: MapKelompoktransaksiKeteranganalasan;
  form: FormGroup;
  kodeKelompok: MapKelompoktransaksiKeteranganalasan[];
  kodePosting: MapKelompoktransaksiKeteranganalasan[];
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
  pilihan2: any = [];
  pilihSemua: boolean;
  kdKelompokTransaksi: any = '';
  selectedSatuan: any;
  cekAllowNextStep: any;
  isAllowNextStep: boolean = false;

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

    //this.cdRef.detectChanges();
    //this.clearPanelBawah(this.kdKelompokTransaksi);
  }

  ngOnInit() {
    //this.listData = [];
    this.hasilCek = true;
    this.cekLampiranDokumen = false;
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
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KeteranganAlasan&select=namaKeteranganAlasan,id.kode').subscribe(res => {
    //  this.listData= res.data.data;
    this.listData = [];
    let data = [...this.listData];
    for (let i = 0; i < res.data.data.length; i++) {
      let tempData = {
        "id_kode": res.data.data[i].id_kode,
        "namaKeteranganAlasan": res.data.data[i].namaKeteranganAlasan,
        "isAllowNextStep": false
      }
      data.push(tempData);
    }
    this.listData = data;
  });
  }


  clearPanelBawah(kdKelompokTransaksi) {

    if (kdKelompokTransaksi == '' || kdKelompokTransaksi == null || kdKelompokTransaksi == undefined) {
      this.get(this.page, this.rows, '');
      this.hasilCek = true;
      this.selectedSatuan = [];
          //this.listData = [];
          this.pilihSemua = false;
          

        } else {
          this.listData = [];
          this.selectedSatuan = [];
          this.get(this.page, this.rows, '');

          //sekarang state nya
          //this.listData = data,
          //struktur listData itu id_kode, namaKeteranganAlasan, sama isAllowNextStep false terus
          
          this.hasilCek = false;   
          this.pilihSemua = false;
          
          //this.listData = [];
          
          this.httpService.get(Configuration.get().dataMasterNew + '/MapKelompokTransaksiToKA/findByKode/' + kdKelompokTransaksi).subscribe(res => {

            //manggil findByKode, struktur kelompok transaksi to KA itu isAllowNextStep dalam bentuk 1 0, namaKetaranganAlasan, id_kode ada


            let mapKelompok = [];
            //this.selectedSatuan = [];
            for (var i = 0; i < res.mapKelompokTransaksiToKA.length; i++) {
              if(res.mapKelompokTransaksiToKA[i].isAllowNextStep == 1) {
                let data = {
                  "id_kode": res.mapKelompokTransaksiToKA[i].kdKeteranganAlasan,
                  "namaKeteranganAlasan": res.mapKelompokTransaksiToKA[i].namaKeteranganAlasan,
                  "isAllowNextStep": true
                }  
                mapKelompok.push(data);
              } else {
                let data = {
                  "id_kode": res.mapKelompokTransaksiToKA[i].kdKeteranganAlasan,
                  "namaKeteranganAlasan": res.mapKelompokTransaksiToKA[i].namaKeteranganAlasan,
                  "isAllowNextStep": false
                }  
                mapKelompok.push(data);
              }
              
            }

            
            

            let selected = mapKelompok.map(val => val.id_kode);
            this.selectedSatuan = this.listData.filter(val => selected.indexOf(val.id_kode) != -1);

            for (var i = 0; i < mapKelompok.length; ++i) {
              for (var j = 0; j < this.selectedSatuan.length; ++j) {
                if(mapKelompok[i].id_kode == this.selectedSatuan[j].id_kode) {
                  this.selectedSatuan[j].isAllowNextStep = mapKelompok[i].isAllowNextStep;
                }
              }
            }
            for (var i = 0; i < this.listData.length; ++i) {
              for (var j = 0; j < this.selectedSatuan.length; ++j) {
                if(this.listData[i].id_kode == this.selectedSatuan[j].id_kode) {
                  this.listData[i].isAllowNextStep = this.selectedSatuan[j].isAllowNextStep;
                }
              }
            }
            

            /*for (var i = 0; i < this.selectedSatuan.length; ++i) {
              this.selectedSatuan[i].isAllowNextStep = true;
            }*/
            /*for (var i = 0; i < this.selectedSatuan.length; ++i) {
              if(this.selectedSatuan[i].isAllowNextStep == 1) {
                this.selectedSatuan[i].isAllowNextStep = true;
              } else {
                this.selectedSatuan[i].isAllowNextStep = false;
              }
            }*/
            /*this.listData = this.listData.filter(val => val.id_kode)
            let pilihan = [...this.listData];
            let selected = [...this.selectedSatuan];
            for (let i = 0; i < res.mapKelompokTransaksiToKA.length; i++) {
              pilihan = pilihan.filter(function (obj) {
                return obj.id_kode !== res.mapKelompokTransaksiToKA[i].kdKeteranganAlasan;
              });
              if (res.mapKelompokTransaksiToKA[i].isAllowNextStep == 1) {
                this.isAllowNextStep = true;
    
              } else {
                this.isAllowNextStep = false;
    
              }
              let tempData = {
                 "id_kode": String(res.mapKelompokTransaksiToKA[i].kdKeteranganAlasan),
                 "namaKeteranganAlasan": String(res.mapKelompokTransaksiToKA[i].namaKeteranganAlasan),
                 "isAllowNextStep": (this.isAllowNextStep),
    
    
              }
              console.log(tempData)
              selected.push(tempData);
              pilihan.push(tempData);
    
              this.selectedSatuan = selected;
              this.listData = pilihan;*/


            });

          console.log(this.listData)

          
        }
        
      }

      selectAll() {
        if (this.pilihSemua == true) {
          this.pilihan = []
          this.pilihan2 = [];
          let dataTemp = []
          this.listData.forEach(function (data) {
            dataTemp.push(String(data.id_kode));
          })
          this.pilihan = dataTemp;
          this.pilihan2 = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihan = []
      this.pilihan2 = [];
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
  selectionData(event) {
    console.log(event);

  }
  rowSelect(event) {
    console.log(event);
    console.log(this.selectedSatuan);
  }
  changeConvert(event) {

    if (event == true) {
      this.cekAllowNextStep = 1
      return 1;

    } else {
      this.cekAllowNextStep = 0
      return 0;

    }


  }

  simpan() {

    let mapKelompokTransaksiToKA = []
    for (let i = 0; i < this.selectedSatuan.length; i++) {
      // debugger;
      // let isAllowNextStep = this.cekAllowNextStep
      // let formSubmit = this.selectedSatuan;
      // formSubmit.isAllowNextStep = this.changeConvert(formSubmit.isAllowNextStep);
      
      let dataTemp = {
        "kdKeteranganAlasan": this.selectedSatuan[i].id_kode,
        "isAllowNextStep": this.changeConvert(this.selectedSatuan[i].isAllowNextStep),
        "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
        "statusEnabled": true
      }

      mapKelompokTransaksiToKA.push(dataTemp);
    }
    let dataSimpan = {
      "mapKelompokTransaksiToKA": mapKelompokTransaksiToKA
    }
    console.log(mapKelompokTransaksiToKA);


    this.httpService.update(Configuration.get().dataMasterNew + '/MapKelompokTransaksiToKA/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;

    });
    this.ngOnInit();
  }

}


