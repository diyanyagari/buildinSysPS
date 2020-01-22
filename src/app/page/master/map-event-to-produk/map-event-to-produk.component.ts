import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapEventToProduk } from './map-event-to-produk.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-event-to-produk',
  templateUrl: './map-event-to-produk.component.html',
  styleUrls: ['./map-event-to-produk.component.scss'],
  providers: [ConfirmationService]
})
export class MapEventToProdukComponent implements OnInit {
  listData: any[];
  FilterListData: any[];
  selected: MapEventToProduk;
  form: FormGroup;
  kodeEvent: MapEventToProduk[];

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
  kdEvent: any;
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
    this.clearPanelBawah(this.kdEvent);


  }

  ngOnInit() {

    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdEvent': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),

    });




    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Event&select=namaEvent,id').subscribe(res => {
      this.kodeEvent = [];
      this.kodeEvent.push({ label: '--Pilih Event--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeEvent.push({ label: res.data.data[i].namaEvent, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id.kode').subscribe(res => {
      this.listData = res.data.data;
      this.FilterListData = res.data.data;
    });
  }

  applyFilter(filterValue: string) {
    this.listData = this.FilterListData.filter(
      res => res.namaProduk.toLowerCase().includes(filterValue.toLowerCase()));
  }

  clearPanelBawah(kdEvent) {

    if (kdEvent == '' || kdEvent == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapeventtoproduk/findByKode/' + kdEvent).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapEventToProduk.length; i++) {
          this.pilihan.push(String(res.MapEventToProduk[i].kdProduk))
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
    let mapEventToProduk = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdProduk": this.pilihan[i],
        "kdEvent": this.form.get('kdEvent').value,
        "statusEnabled": true
      }
      mapEventToProduk.push(dataTemp);
    }
    let dataSimpan = {
      "mapEventToProduk": mapEventToProduk
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapeventtoproduk/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
      // this.get(this.page, this.rows, this.pencarian);
    });
  }


}


