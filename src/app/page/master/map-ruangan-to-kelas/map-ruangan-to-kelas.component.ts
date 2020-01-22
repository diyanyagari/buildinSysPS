import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
// import { mapRuanganToKelas } from './map-ruangan-to-kelas.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
  selector: 'app-map-ruangan-to-kelas',
  templateUrl: './map-ruangan-to-kelas.component.html',
  styleUrls: ['./map-ruangan-to-kelas.component.scss'],
  providers: [ConfirmationService]
})
export class MapRuanganToKelasComponent implements OnInit {
  listDataRuangan: any[];
  selected: any;
  kdLokasi: any;
  form: FormGroup;
  kodeKelas: any[];
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
  kdKelas: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  version: any;
  listData1: any[];
  pilihanRuangan: any = [];
  FilterListDataRuangan: any[];
  pilihSemuaRuangan: boolean;

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
    this.clearPanelBawah(this.kdKelas);
  }

  ngOnInit() {
    this.version = "1";
    this.pencarian = '';
    this.kdLokasi = this.authGuard.getUserDto().kdLokasi;
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kdKelas': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });
    if(this.kodeKelas == undefined){
      this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAllData').subscribe(res => {
        this.kodeKelas = [];
        this.kodeKelas.push({ label: '--Pilih Kelas--', value: '' })
        for (var i = 0; i < res.Kelas.length; i++) {
          this.kodeKelas.push({ label: res.Kelas[i].namaKelas, value: res.Kelas[i].kode.kode })
        };
      });
    } 
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findByKodeHead/' + this.kdLokasi).subscribe(res => {
      this.listDataRuangan = res.Ruangan;
      this.FilterListDataRuangan = res.Ruangan;
    });

  }

  clearPanelBawah(kdKelas) {
    if (kdKelas == '' || kdKelas == null) {
      this.hasilCek = true;
      this.pilihanRuangan = [];
      this.pilihSemuaRuangan = false;

    } else {
      this.hasilCek = false;
      this.pilihSemuaRuangan = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantokelas/findByKode/' + kdKelas).subscribe(res => {
        this.pilihanRuangan = [];
        for (let i = 0; i < res.MapRuanganToKelas.length; i++) {
          this.pilihanRuangan.push(String(res.MapRuanganToKelas[i].kdRuangan))
        }
      });
    }
  }

  selectAllRuangan() {
    if (this.pilihSemuaRuangan == true) {
      this.pilihanRuangan = []
      let dataTemp = []
      this.listDataRuangan.forEach(function (data) {
        dataTemp.push(String(data.kdRuangan));
      })
      this.pilihanRuangan = dataTemp;
    } else {
      this.pilihanRuangan = []
    }
  }

  filterRuangan(filterValue: string) {
    this.listDataRuangan = this.FilterListDataRuangan.filter(
      res => res.namaRuangan.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onChange() {
    console.log(JSON.stringify(this.pilihanRuangan));
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
    let ruangan = [];
    for (let i = 0; i < this.pilihanRuangan.length; i++) {
      let dataTempRuangan = {
        "kode": this.pilihanRuangan[i]
      }
      ruangan.push(dataTempRuangan);
    }
    let dataSimpan = {
      "kdKelas": this.kdKelas, ruangan
    }
    // console.log(JSON.stringify(dataSimpan, null, 4));
    this.httpService.update(Configuration.get().dataMasterNew + '/mapruangantokelas/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemuaRuangan = false;
      this.reset();
    });
  }
  reset(){
    this.kdKelas = null;
    this.ngAfterViewInit();
    this.ngOnInit();
    this.listDataRuangan = [];
  }
}