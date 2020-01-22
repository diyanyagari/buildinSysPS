import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
  selector: 'app-map-ruangan-login-to-ruangan-pelayanan',
  templateUrl: './map-ruangan-login-to-ruangan-pelayanan.component.html',
  styleUrls: ['./map-ruangan-login-to-ruangan-pelayanan.component.scss'],
  providers: [ConfirmationService]
})
export class MapRuanganLoginToRuanganPelayananComponent implements OnInit,AfterViewInit {
  form: FormGroup;
  totalRecords: number;
  page: number;
  rows: number;
  kdRuanganUnit:any[];
  pencarian: string;
  version: any;
  kdUnitKerja:any;
  hasilCek: boolean = false;
  listDataRuangan:any[];
  FilterListDataRuangan: any[];
  pilihSemuaRuangan:boolean;
  pilihanRuangan:any = []; 

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) { 
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngOnInit() {
    this.version = "1";
    this.pencarian = '';
    this.form = this.fb.group({
      'kdUnitKerja': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });
    this.getData(this.page,this.rows,this.pencarian);
    //ambil dropdown ruangan
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Ruangan&select=*').subscribe(res => {
			this.kdRuanganUnit = [];
			this.kdRuanganUnit.push({ label: '-- Pilih--', value: '' });
			for (let i = 0; i < res.data.data.length; i++) {
				this.kdRuanganUnit.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id.kode })
			};
		}, error => {
			this.kdRuanganUnit = [];
			this.kdRuanganUnit.push({ label: '--' + error + '--', value: '' });
		});
  }

  ngAfterViewInit(){
    this.hasilCek = true;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdUnitKerja);
  }

  getData(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapRuanganLoginToRuanganP/findAllRuanganPelayanan').subscribe(res => {
      this.listDataRuangan = res.RuanganPelayanan;
      this.FilterListDataRuangan = res.RuanganPelayanan;
    });
  }

  clearPanelBawah(kdUnitKerja) {
    if (kdUnitKerja == '' || kdUnitKerja == null) {
      this.hasilCek = true;
      this.pilihanRuangan = [];
      this.pilihSemuaRuangan = false;

    } else {
      this.hasilCek = false;
      this.pilihSemuaRuangan = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapRuanganLoginToRuanganP/findByKdRuangan/' + kdUnitKerja).subscribe(res => {
        this.pilihanRuangan = [];
        for (let i = 0; i < res.MapRuanganLoginToRuanganP.length; i++) {
          this.pilihanRuangan.push(String(res.MapRuanganLoginToRuanganP[i].kdRuanganPelayanan));
        }
      });
    }
  }

  selectAllRuangan(){
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
    let kdRuanganPelayanan = [];
    for (let i = 0; i < this.pilihanRuangan.length; i++) {
      let dataTemp = {
        "kode": this.pilihanRuangan[i]
      }
      kdRuanganPelayanan.push(dataTemp);
    }
    let dataSimpan = {
      "kdRuanganLogin": this.kdUnitKerja, kdRuanganPelayanan
    }
    // console.log(JSON.stringify(dataSimpan, null, 4));
    this.httpService.update(Configuration.get().dataMasterNew + '/mapRuanganLoginToRuanganP/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemuaRuangan = false;
      this.reset();
    });
  }

  reset(){
    this.kdUnitKerja = null;
    this.ngAfterViewInit();
    this.ngOnInit();
    this.listDataRuangan = [];
  }



}
