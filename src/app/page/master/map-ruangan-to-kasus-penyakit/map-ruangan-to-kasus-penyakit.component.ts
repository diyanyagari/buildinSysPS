import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
  selector: 'app-map-ruangan-to-kasus-penyakit',
  templateUrl: './map-ruangan-to-kasus-penyakit.component.html',
  styleUrls: ['./map-ruangan-to-kasus-penyakit.component.scss'],
  providers: [ConfirmationService]

})
export class MapRuanganToKasusPenyakitComponent implements OnInit {
  form: FormGroup;
  totalRecords: number;
  page: number;
  rows: number;
  kdRuanganUnit:any[];
  selected: any;
  listDataPenyakit:any[];
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  blockedPanel: boolean = false;
  selectedAll: any;
  hasilCek: boolean = false;
  version: any;
  FilterListDataPenyakit: any[];
  kdUnitKerja:any;
  pilihanPenyakit:any = []; 
  pilihSemuaPenyakit: boolean;

  constructor(
    private alertService: AlertService,
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
    //this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdUnitKerja);
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

  getData(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantokasuspenyakit/findAllKasusPenyakit').subscribe(res => {
      this.listDataPenyakit = res.KasusPenyakit;
      this.FilterListDataPenyakit = res.KasusPenyakit;
    });
  }

  clearPanelBawah(kdUnitKerja) {
    if (kdUnitKerja == '' || kdUnitKerja == null) {
      this.hasilCek = true;
      this.pilihanPenyakit = [];
      this.pilihSemuaPenyakit = false;

    } else {
      this.hasilCek = false;
      this.pilihSemuaPenyakit = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantokasuspenyakit/findByKdRuangan/' + kdUnitKerja).subscribe(res => {
        this.pilihanPenyakit = [];
        for (let i = 0; i < res.MapRuanganToKasusPenyakit.length; i++) {
          this.pilihanPenyakit.push(String(res.MapRuanganToKasusPenyakit[i].kdKasusPenyakit))
        }
      });
    }
  }

  selectAllPenyakit(){
    if (this.pilihSemuaPenyakit == true) {
      this.pilihanPenyakit = []
      let dataTemp = []
      this.listDataPenyakit.forEach(function (data) {
        dataTemp.push(String(data.kode));
      })
      this.pilihanPenyakit = dataTemp;
    } else {
      this.pilihanPenyakit = []
    }
  }

  filterPenyakit(filterValue: string) {
    this.listDataPenyakit = this.FilterListDataPenyakit.filter(
      res => res.namaKasusPenyakit.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onChange() {
    console.log(JSON.stringify(this.pilihanPenyakit));
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
    let kdKasusPenyakit = [];
    for (let i = 0; i < this.pilihanPenyakit.length; i++) {
      let dataTempPenyakit = {
        "kode": this.pilihanPenyakit[i]
      }
      kdKasusPenyakit.push(dataTempPenyakit);
    }
    let dataSimpan = {
      "kdRuangan": this.kdUnitKerja, kdKasusPenyakit
    }
    // console.log(JSON.stringify(dataSimpan, null, 4));
    this.httpService.update(Configuration.get().dataMasterNew + '/mapruangantokasuspenyakit/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemuaPenyakit = false;
      this.reset();
    });
  }

  reset(){
    this.kdUnitKerja = null;
    this.ngAfterViewInit();
    this.ngOnInit();
    this.listDataPenyakit = [];
  }





}


