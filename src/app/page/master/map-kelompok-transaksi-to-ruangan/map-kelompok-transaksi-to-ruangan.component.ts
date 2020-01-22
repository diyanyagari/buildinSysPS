import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-kelompok-transaksi-to-ruangan',
  templateUrl: './map-kelompok-transaksi-to-ruangan.component.html',
  styleUrls: ['./map-kelompok-transaksi-to-ruangan.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompokTransaksiToRuanganComponent implements OnInit {
  totalRecords: number;
  page: number;
  rows: number;
  listData:any[];
  selected:any;
  form: FormGroup;
  kodeKelompok:any[];
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  version: any;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  kdKelompokTransaksi: any = '';
  selectedSatuan: any;
  pilihSemua: boolean;

  constructor(
    private alertService: AlertService,
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

  ngOnInit() {
    this.hasilCek = true;
    this.version = "1";
    this.getData(this.page, this.rows, '');
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
    }, error => {
      	this.kodeKelompok = [];
      	this.kodeKelompok.push({ label: '--' + error + '--', value: '' });
    });

  }

  getData(page: number, rows: number, search: any) {

  //   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KeteranganAlasan&select=namaKeteranganAlasan,id.kode').subscribe(res => {
  //   this.listData = [];
  //   let data = [...this.listData];
  //   for (let i = 0; i < res.data.data.length; i++) {
  //     let tempData = {
  //       "id_kode": res.data.data[i].id_kode,
  //       "namaKeteranganAlasan": res.data.data[i].namaKeteranganAlasan,
  //       "isAllowNextStep": false
  //     }
  //     data.push(tempData);
  //   }
  //   this.listData = data;
  // });

  }

  clearPanelBawah(kdKelompokTransaksi) {

    // if (kdKelompokTransaksi == '' || kdKelompokTransaksi == null || kdKelompokTransaksi == undefined) {
    //   this.getData(this.page, this.rows, '');
    //   this.hasilCek = true;
    //   this.selectedSatuan = [];
    //     this.pilihSemua = false;
          

    //     } else {
    //       this.listData = [];
    //       this.selectedSatuan = [];
    //       this.getData(this.page, this.rows, '');

    //       //sekarang state nya
    //       //this.listData = data,
    //       //struktur listData itu id_kode, namaKeteranganAlasan, sama isAllowNextStep false terus
          
    //       this.hasilCek = false;   
    //       this.pilihSemua = false;
          
    //       this.httpService.get(Configuration.get().dataMasterNew + '/MapKelompokTransaksiToKA/findByKode/' + kdKelompokTransaksi).subscribe(res => {

    //         //manggil findByKode, struktur kelompok transaksi to KA itu isAllowNextStep dalam bentuk 1 0, namaKetaranganAlasan, id_kode ada
    //         let mapKelompok = [];
    //         for (var i = 0; i < res.mapKelompokTransaksiToKA.length; i++) {
    //           if(res.mapKelompokTransaksiToKA[i].isAllowNextStep == 1) {
    //             let data = {
    //               "id_kode": res.mapKelompokTransaksiToKA[i].kdKeteranganAlasan,
    //               "namaKeteranganAlasan": res.mapKelompokTransaksiToKA[i].namaKeteranganAlasan,
    //               "isAllowNextStep": true
    //             }  
    //             mapKelompok.push(data);
    //           } else {
    //             let data = {
    //               "id_kode": res.mapKelompokTransaksiToKA[i].kdKeteranganAlasan,
    //               "namaKeteranganAlasan": res.mapKelompokTransaksiToKA[i].namaKeteranganAlasan,
    //               "isAllowNextStep": false
    //             }  
    //             mapKelompok.push(data);
    //           }
              
    //         }


    //         let selected = mapKelompok.map(val => val.id_kode);
    //         this.selectedSatuan = this.listData.filter(val => selected.indexOf(val.id_kode) != -1);

    //         for (var i = 0; i < mapKelompok.length; ++i) {
    //           for (var j = 0; j < this.selectedSatuan.length; ++j) {
    //             if(mapKelompok[i].id_kode == this.selectedSatuan[j].id_kode) {
    //               this.selectedSatuan[j].isAllowNextStep = mapKelompok[i].isAllowNextStep;
    //             }
    //           }
    //         }
    //         for (var i = 0; i < this.listData.length; ++i) {
    //           for (var j = 0; j < this.selectedSatuan.length; ++j) {
    //             if(this.listData[i].id_kode == this.selectedSatuan[j].id_kode) {
    //               this.listData[i].isAllowNextStep = this.selectedSatuan[j].isAllowNextStep;
    //             }
    //           }
    //         }

    //         });

    //       console.log(this.listData)
    //     }
        
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

        // let mapKelompokTransaksiToKA = []
        // for (let i = 0; i < this.selectedSatuan.length; i++) {

        //   let dataTemp = {
        //     "kdKeteranganAlasan": this.selectedSatuan[i].id_kode,
        //     "isAllowNextStep": this.changeConvert(this.selectedSatuan[i].isAllowNextStep),
        //     "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
        //     "statusEnabled": true
        //   }
    
        //   mapKelompokTransaksiToKA.push(dataTemp);
        // }
        // let dataSimpan = {
        //   "mapKelompokTransaksiToKA": mapKelompokTransaksiToKA
        // }
        // console.log(mapKelompokTransaksiToKA);
    
    
        // this.httpService.update(Configuration.get().dataMasterNew + '/MapKelompokTransaksiToKA/update/' + this.version, dataSimpan).subscribe(response => {
        //   this.alertService.success('Berhasil', 'Data Disimpan');
        //   this.pilihSemua = false;
    
        // });
        // this.ngOnInit();
      }


      selectionData(event) {
        console.log(event);
    
      }
      rowSelect(event) {
        console.log(event);
        console.log(this.selectedSatuan);
      }

      

}
