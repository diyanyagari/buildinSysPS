import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-paketreimburse-produk',
  templateUrl: './map-paketreimburse-produk.component.html',
  styleUrls: ['./map-paketreimburse-produk.component.scss'],
  providers: [ConfirmationService]
})
export class MapPaketreimburseProdukComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  kodePaketReimburse: any[];
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
  kdPaketReimburse: any;
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
    this.clearPanelBawah(this.kdPaketReimburse);


  }

  ngOnInit() {

    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdPaketReimburse': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),

    });




    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Paket&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
      this.kodePaketReimburse = [];
      this.kodePaketReimburse.push({ label: '--Pilih Paket Reimburse--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodePaketReimburse.push({ label: res.data.data[i].namaPaket, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }

  clearPanelBawah(kdPaketReimburse) {

    if (kdPaketReimburse == '' || kdPaketReimburse == null) {
      this.hasilCek = true;
      this.pilihan = [];

    } else {
      this.hasilCek = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mappaketreimbursetoproduk/findByKode/' + kdPaketReimburse).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapPaketReimburseToProduk.length; i++) {
          this.pilihan.push(String(res.mapPaketReimburseToProduk[i].kdProduk))
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
    let mapPaketReimburseToProduk = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdProduk": this.pilihan[i],
        "kdPaketReimburse": this.form.get('kdPaketReimburse').value,
        "statusEnabled": true
      }
      mapPaketReimburseToProduk.push(dataTemp);
    }
    let dataSimpan = {
      "mapPaketReimburseToProduk": mapPaketReimburseToProduk
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mappaketreimbursetoproduk/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
    });
  }


}



