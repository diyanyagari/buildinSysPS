import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapDiklatjurusanProduk } from './map-diklatjurusan-produk.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-diklatjurusan-produk',
  templateUrl: './map-diklatjurusan-produk.component.html',
  styleUrls: ['./map-diklatjurusan-produk.component.scss'],
  providers: [ConfirmationService]
})
export class MapDiklatjurusanProdukComponent implements OnInit {
  listData: any[];
  selected: MapDiklatjurusanProduk;
  form: FormGroup;
  kodeDiklatJurusan: MapDiklatjurusanProduk[];
  kodeLevelTingkat: MapDiklatjurusanProduk[]

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
  kdDiklatJurusan: any;
  kdLevelTingkat:any;
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
    // this.clearPanelBawah(.kdDiklatJurusan,this.kdLevelTingkat);


  }

  ngOnInit() {

    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdDiklatJurusan': new FormControl('', Validators.required),
      'kdLevelTingkat': new FormControl('', Validators.required),

      'statusEnabled': new FormControl(true),

    });
    this.form.get('kdLevelTingkat').disable();


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DiklatJurusan&select=namaDiklatJurusan,id').subscribe(res => {
      this.kodeDiklatJurusan = [];
      this.kodeDiklatJurusan.push({ label: '--Pilih Diklat Jurusan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeDiklatJurusan.push({ label: res.data.data[i].namaDiklatJurusan, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.kodeLevelTingkat = [];
      this.kodeLevelTingkat.push({ label: '--Pilih Level Tingkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeLevelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }
  valuechange(value) {
    if(value !== null || value !== "") {
      this.form.get('kdLevelTingkat').enable();
    } else {
      this.form.get('kdLevelTingkat').disable();
    }
  }  
  fungsiget() {
    // this.clearPanelBawah(this.kdDiklatJurusan, this.kdLevelTingkat)
    this.clearPanelBawah(this.form.get('kdDiklatJurusan').value, this.form.get('kdDiklatJurusan').value);
  }
  clearPanelBawah(kdDiklatJurusan: any, kdLevelTingkat:any ) {

    if (kdDiklatJurusan == '' || kdDiklatJurusan == null) {
        if (kdLevelTingkat == '' || kdLevelTingkat == null) {
          this.hasilCek = true;
          this.pilihan = [];
        }
    } else {
      this.hasilCek = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapdiklatjurusantoproduk/findByKode/' + kdDiklatJurusan +'/'+ kdLevelTingkat).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapDiklatJurusanToProduk.length; i++) {
          this.pilihan.push(String(res.MapDiklatJurusanToProduk[i].kdProdukD))
         
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
    let mapDiklatJurusanToProduk = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdProdukD": this.pilihan[i],
        "kdDiklatJurusan": this.form.get('kdDiklatJurusan').value,
        "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
        "statusEnabled": true
      }
      mapDiklatJurusanToProduk.push(dataTemp);
    }
    let dataSimpan = {
      "mapDiklatJurusanToProduk": mapDiklatJurusanToProduk
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapdiklatjurusantoproduk/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
    });
  }


}



