import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { mapRuanganJurusan } from './map-ruangan-jurusan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
@Component({
  selector: 'app-map-ruangan-jurusan',
  templateUrl: './map-ruangan-jurusan.component.html',
  styleUrls: ['./map-ruangan-jurusan.component.scss'],
  providers: [ConfirmationService]
})
export class MapRuanganJurusanComponent implements OnInit {
  listData: any[];
  selected: any = [];
  form: FormGroup;
  kodeRuangan: mapRuanganJurusan[];
  kdLokasi: any;
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
  kdRuangan: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  version: any;
  listData1: any[];
  pilihSemua: boolean;



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
    this.clearPanelBawah(this.kdRuangan);
  }

  ngOnInit() {
    this.selected = [];
    this.kdLokasi = this.authGuard.getUserDto().kdLokasi;
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdRuangan': new FormControl('', Validators.required),
      'kdFakultas': new FormControl(''),
      'kdJurusan': new FormControl(''),
      'kdProgram': new FormControl(''),
      'statusEnabled': new FormControl(true),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findByKodeHead/' + this.kdLokasi).subscribe(res => {
      this.kodeRuangan = [];
      this.kodeRuangan.push({ label: '--Pilih Ruangan--', value: '' })
      for (var i = 0; i < res.Ruangan.length; i++) {
        this.kodeRuangan.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kdRuangan })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    let dataTampung = [];
    this.httpService.get(Configuration.get().dataMaster + '/mapruangantojurusan/findMapFakultasProgramJurusan').subscribe(res => {
      for (let i = 0; i < res.MapRuanganToJurusan.length; i++) {
        let dataList = {
          "kdFakultas": res.MapRuanganToJurusan[i].kdFakultas,
          "namaFakultas": res.MapRuanganToJurusan[i].namaFakultas,
          "kdProgram": res.MapRuanganToJurusan[i].kdProgram,
          "namaProgram": res.MapRuanganToJurusan[i].namaProgram,
          "kdJurusan": res.MapRuanganToJurusan[i].kdJurusan,
          "namaJurusan": res.MapRuanganToJurusan[i].namaJurusan
        }
        dataTampung.push(dataList);
      }
      this.listData = dataTampung;
      // this.listData = res.MapRuanganToJurusan;
    });
  }


  clearPanelBawah(kdRuangan) {
    // console.log(kdJenisPegawai);

    if (kdRuangan == '' || kdRuangan == null) {
      this.hasilCek = true;
    } else {
      let dataTampung = [];
      this.hasilCek = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantojurusan/findByKode/' + kdRuangan).subscribe(res => {
        for (let i = 0; i < res.MapRuanganToJurusan.length; i++) {
          let param = res.MapRuanganToJurusan[i].statusEnabled;
          if (param) {
            let dataStatus = {
              "kdFakultas": res.MapRuanganToJurusan[i].kdFakultas,
              "namaFakultas": res.MapRuanganToJurusan[i].namaFakultas,
              "kdProgram": res.MapRuanganToJurusan[i].kdProgram,
              "namaProgram": res.MapRuanganToJurusan[i].namaProgram,
              "kdJurusan": res.MapRuanganToJurusan[i].kdJurusan,
              "namaJurusan": res.MapRuanganToJurusan[i].namaJurusan
            }
            dataTampung.push(dataStatus);
          }
        }

      });
      this.selected = dataTampung;
      console.log(this.selected);
    }
  }

  onChange() {
    // console.log(JSON.stringify(this.selected));
  }

  onRowSelect(event) {
    console.log(event.data);
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantojurusan/findMapFakultasProgramJurusan?namaJurusan=' + this.pencarian).subscribe(res => {
      this.listData = res.MapRuanganToJurusan;
    })
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
    if (this.selected == '') {
      this.httpService.delete(Configuration.get().dataMasterNew + '/mapruangantojurusan/del/' + this.kdRuangan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
      });
    } else {
      let mapRuanganToJurusan = []
      for (let i = 0; i < this.selected.length; i++) {
        let dataTemp = {
          "kdRuangan": this.kdRuangan,
          "kdFakultas": this.selected[i].kdFakultas,
          "kdJurusan": this.selected[i].kdJurusan,
          "kdProgram": this.selected[i].kdProgram,
          "statusEnabled": true
        }
        mapRuanganToJurusan.push(dataTemp);
      }
      let dataSimpan = {
        "mapRuanganToJurusan": mapRuanganToJurusan
      }
      // console.log(JSON.stringify(dataSimpan));
      this.httpService.update(Configuration.get().dataMasterNew + '/mapruangantojurusan/update/' + this.version, dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
      });
    }
  }
}






