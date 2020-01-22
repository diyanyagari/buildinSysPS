import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { mapFasilitasRuangan } from './map-fasilitas-ruangan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
  selector: 'app-map-fasilitas-ruangan',
  templateUrl: './map-fasilitas-ruangan.component.html',
  styleUrls: ['./map-fasilitas-ruangan.component.scss'],
  providers: [ConfirmationService]
})
export class MapFasilitasRuanganComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  kodeFasilitas: mapFasilitasRuangan[];
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
  FilterListData: any[];
  pilihSemua: boolean;
  kdLokasi:  any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private authGuard: AuthGuard,
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
    this.kdLokasi = this.authGuard.getUserDto().kdLokasi;
    this.version = "1";
    this.pencarian = '';
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kdFasilitas': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Fasilitas&select=namaFasilitas,id').subscribe(res => {
      this.kodeFasilitas = [];
      this.kodeFasilitas.push({ label: '--Pilih Fasilitas--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeFasilitas.push({ label: res.data.data[i].namaFasilitas, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findByKodeHead/' + this.kdLokasi).subscribe(res => {
      this.listData = res.Ruangan;
      this.FilterListData = res.Ruangan;
    });
  }

  clearPanelBawah(kdFasilitas) {
    if (kdFasilitas == '' || kdFasilitas == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapfasilitastoruangan/findByKode/' + kdFasilitas).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.data.length; i++) {
          this.pilihan.push(String(res.data[i].kdRuangan))
        }
      });
    }
  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listData.forEach(function (data) {
        dataTemp.push(String(data.kdRuangan));
      })
      this.pilihan = dataTemp;
    } else {
      this.pilihan = []
    }
  }

  applyFilter(filterValue: string) {
    this.listData = this.FilterListData.filter(
      res => res.namaRuangan.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onChange() {
    console.log(JSON.stringify(this.pilihan));
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
    if (this.pilihan == '') {
      this.httpService.delete(Configuration.get().dataMasterNew + '/mapfasilitastoruangan/del/' + this.kdFasilitas).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.pilihSemua = false;
      });
    } else {
      let mapFasilitasToRuangan = []
      for (let i = 0; i < this.pilihan.length; i++) {
        let dataTemp = {
          "kdRuangan": this.pilihan[i],
          "kdFasilitas": this.form.get('kdFasilitas').value,
          "statusEnabled": true
        }
        mapFasilitasToRuangan.push(dataTemp);
      }
      let dataSimpan = {
        "mapFasilitasToRuangan": mapFasilitasToRuangan
      }
      this.httpService.update(Configuration.get().dataMasterNew + '/mapfasilitastoruangan/update/' + this.version, dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.pilihSemua = false;
      });
    }
  }
}