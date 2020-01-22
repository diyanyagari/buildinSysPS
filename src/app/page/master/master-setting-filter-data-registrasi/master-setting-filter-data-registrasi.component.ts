import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { AlertService, Configuration } from '../../../global';

@Component({
  selector: 'app-master-setting-filter-data-registrasi',
  templateUrl: './master-setting-filter-data-registrasi.component.html',
  styleUrls: ['./master-setting-filter-data-registrasi.component.scss'],
  providers: [ConfirmationService]
})
export class MasterSettingFilterDataRegistrasiComponent implements OnInit {
  formRuanganPelayanan: FormGroup;
  formKelompokTransaksi: FormGroup;
  formRuanganLogin: FormGroup;
  totalRecords: number;
  page: number;
  rows: number;
  //ini tab satu
  kdRuanganUnit:any[];
  pencarianPelayanan: string;
  versionPelayanan: any;
  kdUnitKerja:any;
  hasilCek: boolean = false;
  listDataRuangan:any[];
  FilterListDataRuangan: any[];
  pilihSemuaRuangan:boolean;
  pilihanRuanganPelayanan:any = []; 

  //ini tab dua
  listData: any[];
  selected: any;
  kodeKelompok: any[];
  kodePosting: any[];
  // totalRecords: number;
  // page: number;
  // rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  version: any;
  cekLampiranDokumen: boolean = false;
  hasilCek2: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  pilihan: any = [];
  pilihSemua: boolean;
  kdKelompokTransaksi: any;
  selectedSatuan:any;

  //////////////////////
  kdRuanganUnitKerjaLogin:any[];
  pencarianKlien: string;
  versionKlien: any;
  kdUnitKerjaLogin:any;
  hasilCek3: boolean = false;
  listDataRuanganLogin:any[];
  FilterListDataRuanganLogin: any[];
  pilihSemuaRuanganLogin:boolean;
  pilihanRuanganLogin:any = []; 


  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) { 
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngAfterViewInit(){
    this.hasilCek = true;
    this.hasilCek2 = true;
    this.hasilCek3 = true;
    this.cdRef.detectChanges();
    this.clearPanelBawahPelayanan(this.kdUnitKerja);
    this.clearPanelBawahKelompokTransaksi(this.kdKelompokTransaksi);
    this.clearPanelBawahKlien(this.kdUnitKerjaLogin);
  }

  ngOnInit() {
    this.versionPelayanan = "1";
    this.pencarianPelayanan = '';
    this.formRuanganPelayanan = this.fb.group({
      'kdUnitKerja': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });
    this.getData(this.page,this.rows,this.pencarianPelayanan);
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
    
    ///////////////////////////
    this.pencarian = '';
    this.hasilCek = true;
    this.version = "1";
    this.getDataKelompokTransaksi(this.page, this.rows, '');
    this.formKelompokTransaksi = this.fb.group({
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

    ///////////////////////////////////////////////////
    this.versionKlien = "1";
    this.pencarianKlien = '';
    this.formRuanganLogin = this.fb.group({
      'kdUnitKerjaLogin': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });
    this.getDataLogin(this.page,this.rows,this.pencarianKlien);
    //ambil dropdown ruangan
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Ruangan&select=*').subscribe(res => {
			this.kdRuanganUnitKerjaLogin = [];
			this.kdRuanganUnitKerjaLogin.push({ label: '-- Pilih--', value: '' });
			for (let i = 0; i < res.data.data.length; i++) {
				this.kdRuanganUnitKerjaLogin.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id.kode })
			};
		}, error => {
			this.kdRuanganUnitKerjaLogin = [];
			this.kdRuanganUnitKerjaLogin.push({ label: '--' + error + '--', value: '' });
    });


  }

  onTabChange(event){

  }

  getData(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapRuanganLoginToRuanganP/findAllRuanganPelayanan').subscribe(res => {
      this.listDataRuangan = res.RuanganPelayanan;
      this.FilterListDataRuangan = res.RuanganPelayanan;
    });
  }

  
  clearPanelBawahPelayanan(kdUnitKerja) {
    if (kdUnitKerja == '' || kdUnitKerja == null) {
      this.hasilCek = true;
      this.pilihanRuanganPelayanan = [];
      this.pilihSemuaRuangan = false;

    } else {
      this.hasilCek = false;
      this.pilihSemuaRuangan = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapRuanganLoginToRuanganP/findByKdRuangan/' + kdUnitKerja).subscribe(res => {
        this.pilihanRuanganPelayanan = [];
        for (let i = 0; i < res.MapRuanganLoginToRuanganP.length; i++) {
          this.pilihanRuanganPelayanan.push(String(res.MapRuanganLoginToRuanganP[i].kdRuanganPelayanan));
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
    } else {
      this.pilihan = []
    }
  }

  selectAllRuanganPelayanan(){
    if (this.pilihSemuaRuangan == true) {
      this.pilihanRuanganPelayanan = []
      let dataTemp = []
      this.listDataRuangan.forEach(function (data) {
        dataTemp.push(String(data.kdRuangan));
      })
      this.pilihanRuanganPelayanan = dataTemp;
    } else {
      this.pilihanRuanganPelayanan = []
    }
  }

  filterRuanganPelayanan(filterValue: string) {
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

  onSubmitPelayanan() {
    if (this.formRuanganPelayanan.invalid) {
      this.validateAllFormFields(this.formRuanganPelayanan);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanPelayanan();
    }
  }

  simpanPelayanan() {
    let kdRuanganPelayanan = [];
    for (let i = 0; i < this.pilihanRuanganPelayanan.length; i++) {
      let dataTemp = {
        "kode": this.pilihanRuanganPelayanan[i]
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
      this.resetPelayanan();
    });
  }

  resetPelayanan(){
    this.kdUnitKerja = null;
    this.ngAfterViewInit();
    this.ngOnInit();
    this.listDataRuangan = [];
  }

  //////////////////////////ini untuk tab yang lain////////////////////////////////////////////////

  clearPanelBawahKelompokTransaksi(kdKelompokTransaksi) {
    console.log(kdKelompokTransaksi)
    if (kdKelompokTransaksi == '' || kdKelompokTransaksi == null) {
      this.getDataKelompokTransaksi(this.page, this.rows, '');
      this.hasilCek2 = true;
      this.selectedSatuan = [];
      //this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.listData = [];
      this.selectedSatuan = [];
      this.getDataKelompokTransaksi(this.page, this.rows, '');
      this.hasilCek2 = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/findByKode/' + kdKelompokTransaksi).subscribe(res => {

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

    }
  }

  getDataKelompokTransaksi(page: number, rows: number, search: any) {
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


  onSubmitKelompokTransaksi() {
    if (this.formKelompokTransaksi.invalid) {
      this.validateAllFormFields(this.formKelompokTransaksi);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanKelompokTransaksi();
    }
  }

  onRowSelect(event) {
    let data = event;
  }

  onRowUnselect(event){
    let dataUn = event;
    for(let x=0; x < this.listData.length; x++){
      if(this.listData[x].kode == event.data.kode){
        this.listData[x].avgServiceMenit = '';
      }
    }
  }


  simpanKelompokTransaksi() {
    let dataStatus = false;
    for(let x=0; x < this.selectedSatuan.length; x++){
      if(this.selectedSatuan[x].avgServiceMenit == '' || 
      this.selectedSatuan[x].avgServiceMenit == undefined || 
      this.selectedSatuan[x].avgServiceMenit == null){
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
        "kdKelompokTransaksi": this.formKelompokTransaksi.get('kdKelompokTransaksi').value,
        "kdRuangan": this.selectedSatuan[i].kode,
        "noRec": "string",
        "statusEnabled": true,
        "version": 0
      }

      mapKelompokTransaksiToRuangan.push(dataTemp);
    }

    let dataSimpan = {
      "kdKelompokTransaksi":this.formKelompokTransaksi.get('kdKelompokTransaksi').value,
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
      this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompoktransaksitoruangan/findByKode/' + this.formKelompokTransaksi.get('kdKelompokTransaksi').value).subscribe(res => {
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

  resetKelompokTransaksi(){
    this.kdKelompokTransaksi = null;
    this.ngAfterViewInit();
    this.ngOnInit();
    this.listData = [];
    
  }

  ///////////////////////////////////tab 3 ///////////////////////////////////////////////
  getDataLogin(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapruanganlogintokk/findAllKelompokKlien').subscribe(res => {
      this.listDataRuanganLogin = res.KelompokKlien;
      this.FilterListDataRuanganLogin = res.KelompokKlien;
    });
  }

  clearPanelBawahKlien(kdUnitKerjaLogin) {
    if (kdUnitKerjaLogin == '' || kdUnitKerjaLogin == null) {
      this.hasilCek3 = true;
      this.pilihanRuanganLogin = [];
      this.pilihSemuaRuanganLogin = false;

    } else {
      this.hasilCek3 = false;
      this.pilihanRuanganLogin = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapruanganlogintokk/findByKode/' + kdUnitKerjaLogin).subscribe(res => {
        this.pilihanRuanganLogin = [];
        for (let i = 0; i < res.MapRuanganLoginToKK.length; i++) {
          this.pilihanRuanganLogin.push(String(res.MapRuanganLoginToKK[i].kdKelompokKlien));
        }
      });
    }
  }

  selectAllRuanganLogin() {
    if (this.pilihSemuaRuanganLogin == true) {
      this.pilihanRuanganLogin = []
      let dataTemp = []
      this.listDataRuanganLogin.forEach(function (data) {
        dataTemp.push(String(data.kode.kode));
      })
      this.pilihanRuanganLogin = dataTemp;
    } else {
      this.pilihanRuanganLogin = []
    }
  }

  filterRuanganLogin(filterValue: string) {
    this.listDataRuanganLogin = this.FilterListDataRuanganLogin.filter(
      res => res.namaKelompokKlien.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onSubmitKlien() {
    if (this.formRuanganLogin.invalid) {
      this.validateAllFormFields(this.formRuanganLogin);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanRuanganLogin();
    }
  }

  simpanRuanganLogin() {
    let kdKelompokKlien = [];
    for (let i = 0; i < this.pilihanRuanganLogin.length; i++) {
      let dataTemp = {
        "kode": this.pilihanRuanganLogin[i]
      }
      kdKelompokKlien.push(dataTemp);
    }
    let dataSimpan = {
      "kdRuanganLogin": this.kdUnitKerjaLogin, kdKelompokKlien
    }
    // console.log(JSON.stringify(dataSimpan, null, 4));
    this.httpService.update(Configuration.get().dataMasterNew + '/mapruanganlogintokk/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemuaRuanganLogin = false;
      this.resetLogin();
    });
  }

  resetLogin(){
    this.kdUnitKerjaLogin = null;
    this.ngAfterViewInit();
    this.ngOnInit();
    this.listDataRuanganLogin = [];
  }





}
