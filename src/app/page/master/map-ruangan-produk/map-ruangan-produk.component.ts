import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-ruangan-produk',
  templateUrl: './map-ruangan-produk.component.html',
  styleUrls: ['./map-ruangan-produk.component.scss'],
  providers: [ConfirmationService]
})
export class MapRuanganProdukComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  kodeRuangan: any[];
  kodeStatus: any[];

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
  // block: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  kdRuangan: any;
  status: any;
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
    // this.block = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdRuangan, this.status);


  }

  ngOnInit() {

    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdRuangan': new FormControl('', Validators.required),
      'status': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),

    });
    this.form.get('status').disable();
  
  
  

  

    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAll?page=1&rows=1000&dir=namaRuangan&sort=desc').subscribe(res => {
      this.kodeRuangan = [];
      this.kodeRuangan.push({ label: '--Pilih Unit Kerja--', value: '' })
      for (var i = 0; i < res.Ruangan.length; i++) {
        this.kodeRuangan.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kode.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?page=1&rows=1000&dir=namaStatus&sort=desc').subscribe(res => {
      this.kodeStatus = [];
      this.kodeStatus.push({ label: '--Pilih Status--', value: '' })
      for (var i = 0; i < res.Status.length; i++) {
        this.kodeStatus.push({ label: res.Status[i].namaStatus, value: res.Status[i].kode.kode })
      };
    });
  }

  // changeStatus(event) {
  //   let val = event.value
  //   if (val >= 0) {
  //     this.form.get('status').enable();
  //     this.form.get('status').setValidators(Validators.required);

  //   } else {
  //     this.form.get('status').disable();
  //     this.form.get('status').clearValidators();

  //   }
  // }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }
  valuechange(value) {
    if(value !== null || value !== "") {
      this.form.get('status').enable();
    } else {
      this.form.get('status').disable();
    }
  }  
  fungsiget() {
    //this.clearPanelBawah(this.kdRuangan, this.status)
    // this.clearPanelBawah(this.kdRuangan, this.status)
    this.clearPanelBawah(this.form.get('kdRuangan').value, this.form.get('status').value);
  }

  clearPanelBawah(kdRuangan: any, status: any) {
console.log(kdRuangan)
console.log(status)
    if (kdRuangan == '' || kdRuangan == null) {
      if (status == '' || status == null) {
      this.hasilCek = true;
      this.pilihan = [];
      // this.block = true;
      }
    } else {
      this.hasilCek = false;
      // this.block = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantoproduk/findByKode/' + kdRuangan+'/'+ status ).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapRuanganToProduk.length; i++) {
          this.pilihan.push(String(res.MapRuanganToProduk[i].kdProduk))
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
    let mapRuanganToProduk = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdProduk": this.pilihan[i],
        "kdRuangan": this.form.get('kdRuangan').value,
        "status": this.form.get('status').value,
        "statusEnabled": true
      }
      mapRuanganToProduk.push(dataTemp);
    }
    let dataSimpan = {
      "mapRuanganToProduk": mapRuanganToProduk
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapruangantoproduk/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
    });
  }


}






