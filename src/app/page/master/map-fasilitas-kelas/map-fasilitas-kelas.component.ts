import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import {  MapFasilitasKelas } from './map-fasilitas-kelas.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-fasilitas-kelas',
  templateUrl: './map-fasilitas-kelas.component.html',
  styleUrls: ['./map-fasilitas-kelas.component.scss'],
  providers: [ConfirmationService] 
})
export class MapFasilitasKelasComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  kodeFasilitas: MapFasilitasKelas[];
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
  kdFasilitas: any;
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
    this.clearPanelBawah(this.kdFasilitas);

  }

  ngOnInit() {
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdFasilitas': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    // this.myForm = this.fb.group({
    //   mapfasilitastokelasDto: this.fb.array([]),
    // });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Fasilitas&select=namaFasilitas,id').subscribe(res => {
      this.kodeFasilitas = [];
      this.kodeFasilitas.push({ label: '--Pilih Fasilitas--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeFasilitas.push({ label: res.data.data[i].namaFasilitas, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kelas&select=namaKelas,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }


  clearPanelBawah(kdFasilitas) {
    // console.log(kdJenisPegawai);

    if (kdFasilitas == '' || kdFasilitas == null) {
      this.hasilCek = true;
      this.pilihan = [];
 

    } else {
      this.hasilCek = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapfasilitastokelas/findByKode/' + kdFasilitas).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapFasilitasToKelas.length; i++) {
          this.pilihan.push(String(res.MapFasilitasToKelas[i].kdKelas))

        }

      });

    }
  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listData.forEach(function (data) {
        dataTemp.push(data.id_kode);
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
  //   const kdJabatanArray = <FormArray>this.form.controls.mapfasilitastokelasDto;

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

  //   const kdJabatanArray = <FormArray>this.myForm.controls.mapfasilitastokelasDto;

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
    let mapFasilitasToKelas = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdKelas": this.pilihan[i],
        "kdFasilitas": this.form.get('kdFasilitas').value,
        "statusEnabled": true
      }
      mapFasilitasToKelas.push(dataTemp);
    }
    let dataSimpan = {
      "mapFasilitasToKelas": mapFasilitasToKelas
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/mapfasilitastokelas/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
    });
  }
}





