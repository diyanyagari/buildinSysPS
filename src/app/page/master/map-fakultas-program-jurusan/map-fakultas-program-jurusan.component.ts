import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { mapFakultasProgramJurusan } from './map-fakultas-program-jurusan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
  selector: 'app-map-fakultas-program-jurusan',
  templateUrl: './map-fakultas-program-jurusan.component.html',
  styleUrls: ['./map-fakultas-program-jurusan.component.scss'],
  providers: [ConfirmationService]
})
export class MapFakultasProgramJurusanComponent implements OnInit {
  listDataProgram: any[];
  listDataJurusan: any[];
  selected: any;
  form: FormGroup;
  kodeFakultas: mapFakultasProgramJurusan[];
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
  kdFakultas: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  version: any;
  listData1: any[];
  pilihanProgram: any = [];
  pilihanJurusan: any = [];
  FilterListDataJurusan: any[];
  FilterListDataProgram: any[];
  pilihSemuaProgram: boolean;
  pilihSemuaJurusan: boolean;

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
    this.clearPanelBawah(this.kdFakultas);
  }

  ngOnInit() {
    this.version = "1";
    this.pencarian = '';
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kdFakultas': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Fakultas&select=namaFakultas,id').subscribe(res => {
      this.kodeFakultas = [];
      this.kodeFakultas.push({ label: '--Pilih Fakultas--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeFakultas.push({ label: res.data.data[i].namaFakultas, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Program&select=namaProgram,id.kode').subscribe(res => {
      this.listDataProgram = res.data.data;
      this.FilterListDataProgram = res.data.data;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Jurusan&select=namaJurusan,id.kode').subscribe(res => {
      this.listDataJurusan = res.data.data;
      this.FilterListDataJurusan = res.data.data;
    });
  }

  clearPanelBawah(kdFakultas) {
    if (kdFakultas == '' || kdFakultas == null) {
      this.hasilCek = true;
      this.pilihanProgram = [];
      this.pilihanJurusan = [];
      this.pilihSemuaProgram = false;
      this.pilihSemuaJurusan = false;

    } else {
      this.hasilCek = false;
      this.pilihSemuaProgram = false;
      this.pilihSemuaJurusan = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapfakultasprogramjurusan/findProgramByKode/' + kdFakultas).subscribe(res => {
        this.pilihanProgram = [];
        for (let i = 0; i < res.MapFakultasProgramJurusan.length; i++) {
          this.pilihanProgram.push(String(res.MapFakultasProgramJurusan[i].kdProgram))
        }
      });
      this.httpService.get(Configuration.get().dataMasterNew + '/mapfakultasprogramjurusan/findJurusanByKode/' + kdFakultas).subscribe(res => {
        this.pilihanJurusan = [];
        for (let i = 0; i < res.MapFakultasProgramJurusan.length; i++) {
          this.pilihanJurusan.push(String(res.MapFakultasProgramJurusan[i].kdJurusan))
        }
      });
    }
  }

  selectAllProgram() {
    if (this.pilihSemuaProgram == true) {
      this.pilihanProgram = []
      let dataTemp = []
      this.listDataProgram.forEach(function (data) {
        dataTemp.push(String(data.id_kode));
      })
      this.pilihanProgram = dataTemp;
    } else {
      this.pilihanProgram = []
    }
  }
  
  selectAllJurusan() {
    if (this.pilihSemuaJurusan == true) {
      this.pilihanJurusan = []
      let dataTemp = []
      this.listDataJurusan.forEach(function (data) {
        dataTemp.push(String(data.id_kode));
      })
      this.pilihanJurusan = dataTemp;
    } else {
      this.pilihanJurusan = []
    }
  }

  filterProgram(filterValue: string) {
    this.listDataProgram = this.FilterListDataProgram.filter(
      res => res.namaProgram.toLowerCase().includes(filterValue.toLowerCase()));
  }

  filterJurusan(filterValue: string) {
    this.listDataJurusan = this.FilterListDataJurusan.filter(
      res => res.namaJurusan.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onChange() {
    console.log(JSON.stringify(this.pilihanProgram));
    console.log(JSON.stringify(this.pilihanJurusan));
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
    let program = [];
    let jurusan = [];
    for (let i = 0; i < this.pilihanProgram.length; i++) {
      let dataTempProgram = {
        "kode": this.pilihanProgram[i]
      }
      program.push(dataTempProgram);
    }
    for (let i = 0; i < this.pilihanJurusan.length; i++) {
      let dataTempJurusan = {
        "kode": this.pilihanJurusan[i]
      }
      jurusan.push(dataTempJurusan);
    }
    let dataSimpan = {
      "kdFakultas": this.kdFakultas, program, jurusan
    }
    // console.log(JSON.stringify(dataSimpan, null, 4));
    this.httpService.update(Configuration.get().dataMasterNew + '/mapfakultasprogramjurusan/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemuaProgram = false;
      this.pilihSemuaJurusan = false;
    });
  }
}