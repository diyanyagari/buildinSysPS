import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { MapKelompoktransaksiRuangan } from './map-kelompoktransaksi-ruangan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard  } from '../../../global';
@Component({
  selector: 'app-map-kelompoktransaksi-ruangan',
  templateUrl: './map-kelompoktransaksi-ruangan.component.html',
  styleUrls: ['./map-kelompoktransaksi-ruangan.component.scss'],
   providers: [ConfirmationService]
})
export class MapKelompoktransaksiRuanganComponent implements OnInit {
listData: any[];
  selected: MapKelompoktransaksiRuangan;
  form: FormGroup;
  kodeKelompok: MapKelompoktransaksiRuangan[];
  kodePosting: MapKelompoktransaksiRuangan[];
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
  kdKelompokTransaksi: any;
  selectedSatuan:any;

  
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private authGuard: AuthGuard,
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
    this.clearPanelBawah(this.kdKelompokTransaksi);
  }

  ngOnInit() {
    this.pencarian = '';
    this.hasilCek = true;
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
    this.httpService.get(Configuration.get().dataMaster + '/mapkelompoktransaksitoruangan/findAllRuangan').subscribe(res => {
      this.listData = [];
      let data = [...this.listData];
      for (let i = 0; i < res.data.data.length; i++) {
        let tempData = {
          "kode": res.data.data[i].id_kode,
          "namaRuangan": res.data.data[i].namaRuangan,
          "avgServiceMenit": ''
        }
        data.push(tempData);
      }
      this.listData = data;
    });
  }
  clearPanelBawah(kdKelompokTransaksi) {
    console.log(kdKelompokTransaksi)
    if (kdKelompokTransaksi == '' || kdKelompokTransaksi == null) {
      this.get(this.page, this.rows, '');
      this.hasilCek = true;
      this.selectedSatuan = [];
      //this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.listData = [];
      this.selectedSatuan = [];
      this.get(this.page, this.rows, '');
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/findByKode/' + kdKelompokTransaksi).subscribe(res => {
        // this.pilihan = [];
        //let mapKelompok = res.MapKelompokTransaksiToRuangan;
        //console.log(mapKelompok);
        let mapKelompok = [];
        for (let i = 0; i < res.MapKelompokTransaksiToRuangan.length; i++) {
          // this.pilihan.push(String(res.MapKelompokTransaksiToRuangan[i].kode.kdRuangan))
          let data = {
            "kode": res.MapKelompokTransaksiToRuangan[i].kode.kdRuangan,
            "namaRuangan": res.MapKelompokTransaksiToRuangan[i].namaRuangan,
            "avgServiceMenit": res.MapKelompokTransaksiToRuangan[i].avgServiceMenit
          }
          mapKelompok.push(data);
        }

        let selected = mapKelompok.map(val => val.kode);
        this.selectedSatuan = this.listData.filter(val => selected.indexOf(val.kode) != -1);

        for (var i = 0; i < mapKelompok.length; ++i) {
          for (var j = 0; j < this.selectedSatuan.length; ++j) {
            if(mapKelompok[i].kode == this.selectedSatuan[j].kode) {
              this.selectedSatuan[j].avgServiceMenit = mapKelompok[i].avgServiceMenit;
            }
          }
        }
        for (var i = 0; i < this.listData.length; ++i) {
          for (var j = 0; j < this.selectedSatuan.length; ++j) {
            if(this.listData[i].kode == this.selectedSatuan[j].kode) {
              this.listData[i].avgServiceMenit = this.selectedSatuan[j].avgServiceMenit;
            }
          }
        }
       
      });

    }
  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listData.forEach(function (data) {
        dataTemp.push(String(data.kode));
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
    let dataStatus = false;
    for(let x=0; x < this.selectedSatuan.length; x++){
      if(this.selectedSatuan[x].avgServiceMenit == '' || this.selectedSatuan[x].avgServiceMenit == undefined || this.selectedSatuan[x].avgServiceMenit == null){
        dataStatus = true;
      }
    }
    
    if(dataStatus == true){
      this.alertService.warn('Perhatian','Harap Average Service di Isi Setelah di Ceklis');
    }else{
      let mapKelompokTransaksiToRuangan = []
    for (let i = 0; i < this.selectedSatuan.length; i++) {
      let dataTemp = {
        "avgServiceMenit": this.selectedSatuan[i].avgServiceMenit,
        "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
        "kdRuangan": this.selectedSatuan[i].kode,
        "noRec": "string",
        "statusEnabled": true,
        "version": 0
      }

      mapKelompokTransaksiToRuangan.push(dataTemp);
    }

    // for (let i = 0; i < this.pilihan.length; i++) {
    //   let dataTemp = {
    //     "kdRuangan": this.pilihan[i],
    //     "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
    //     "statusEnabled": true
    //   }
    //   mapKelompokTransaksiToRuangan.push(dataTemp);
    // }
    let dataSimpan = {
      "mapKelompokTransaksiToRuangan": mapKelompokTransaksiToRuangan
    }

    console.log(dataSimpan);


    this.httpService.update(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
    });
    this.ngOnInit();

    }
    
  }

  cari(){
    this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/findAllRuangan?namaRuangan=' + this.pencarian).subscribe(table => {
      //this.listData = table.data.data;
      this.listData = [];
      let data = [...this.listData];
      for (let i = 0; i < table.data.data.length; i++) {
        let tempData = {
          "kode": table.data.data[i].id_kode,
          "namaRuangan": table.data.data[i].namaRuangan,
          "avgServiceMenit": ''
        }
        data.push(tempData);
      }
      this.listData = data;
      // this.clearPanelBawah(this.form.get('kdKelompokTransaksi').value);
      this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/findByKode/' + this.form.get('kdKelompokTransaksi').value).subscribe(res => {
        this.selectedSatuan = [];
        let mapKelompok = [];
        for (let i = 0; i < res.MapKelompokTransaksiToRuangan.length; i++) {
          let data = {
            "kode": res.MapKelompokTransaksiToRuangan[i].kode.kdRuangan,
            "namaRuangan": res.MapKelompokTransaksiToRuangan[i].namaRuangan,
            "avgServiceMenit": res.MapKelompokTransaksiToRuangan[i].avgServiceMenit
          }
          mapKelompok.push(data);
        }

        let selected = mapKelompok.map(val => val.kode);
        this.selectedSatuan = this.listData.filter(val => selected.indexOf(val.kode) != -1);

        for (var i = 0; i < mapKelompok.length; ++i) {
          for (var j = 0; j < this.selectedSatuan.length; ++j) {
            if(mapKelompok[i].kode == this.selectedSatuan[j].kode) {
              this.selectedSatuan[j].avgServiceMenit = mapKelompok[i].avgServiceMenit;
            }
          }
        }
        for (var i = 0; i < this.listData.length; ++i) {
          for (var j = 0; j < this.selectedSatuan.length; ++j) {
            if(this.listData[i].kode == this.selectedSatuan[j].kode) {
              this.listData[i].avgServiceMenit = this.selectedSatuan[j].avgServiceMenit;
            }
          }
        }

      });

    });
  }

  reset(){
    this.ngOnInit();
    this.listData = [];
    
  }

}


