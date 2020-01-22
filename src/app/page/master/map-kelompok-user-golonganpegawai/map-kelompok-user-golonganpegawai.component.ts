import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

// import { MapKelompokUserGolonganPegawai } from './map-kelompok-user-golonganpegawai.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-map-kelompok-user-golonganpegawai',
  templateUrl: './map-kelompok-user-golonganpegawai.component.html',
  styleUrls: ['./map-kelompok-user-golonganpegawai.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompokUserGolonganPegawaiComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  kodeGolonganPegawai: any[];
  kelompok: any[];
  kodeKategoryPegawai: any[];
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
  kdKategoryPegawai: any;
  kdKelompokUser: any;
  pilihan: any = [];
  pilihSemua: boolean;
  disPilihSemua: boolean;

  listGrid: any[]
  totalGrid: number
  selectedGrid: any
  pencarianGrid: string = ''


  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  ngAfterViewInit() {

    this.hasilCek = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    // this.clearPanelBawah();
  }

  ngOnInit() {


    this.version = "1";
    this.form = this.fb.group({
      'kdKelompokUser': new FormControl('', Validators.required),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    this.form.get('kdKategoryPegawai').disable();
    this.pilihan = [];
    this.kodeKategoryPegawai = [];
    this.kelompok = [];
    //this.form.get('kdKelompokUser').disable();

    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokuser/findAll?page=1&rows=100&dir=namaKelompokUser&sort=desc').subscribe(res => {
      this.kelompok = [];
      this.kelompok.push({ label: '--Pilih Kelompok User--', value: '' })
      for (var i = 0; i < res.KelompokUser.length; i++) {
        this.kelompok.push({ label: res.KelompokUser[i].namaKelompokUser, value: res.KelompokUser[i].kode.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryPegawai&select=namaKategoryPegawai,id').subscribe(res => {
      this.kodeKategoryPegawai = [];
      this.kodeKategoryPegawai.push({ label: '--Pilih Kategory Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.pencarianGrid = ''
    this.getGrid(this.page,this.rows,this.pencarianGrid)
  }
  // changeStatus(event) {
  //   let val = event.value
  //   if (val >= 0) {
  //     this.form.get('kdKategoryPegawai').enable();
  //     this.form.get('kdKategoryPegawai').setValidators(Validators.required);

  //   } else {
  //     this.form.get('kdKategoryPegawai').disable();
  //     this.form.get('kdKategoryPegawai').clearValidators();

  //   }
  // }

  cari() {
    this.getGrid(this.page,this.rows,this.pencarianGrid)
  }

  loadPage(event: LazyLoadEvent) {
    this.getGrid((event.rows + event.first) / event.rows, event.rows, this.pencarianGrid);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

  getGrid(page: number, rows: number, search: any){
    this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokUserToGolonganPegawai/findAllActive?page='+page+'&rows='+rows+'&sort=desc&namaKelompokUser='+search).subscribe(res => {
      this.listGrid = res.mapKelompokUserToGolonganPegawai;
      this.totalGrid = res.totalRow
    });
  }

  fungsiget() {
    // debugger;
    this.clearPanelBawah(this.form.get('kdKelompokUser').value, this.form.get('kdKategoryPegawai').value)
  }
  valuechange(value) {
    // debugger;
    let kdKategoryPegawai = this.form.get('kdKategoryPegawai').value;
    if (value !== null || value !== "") {
      this.form.get('kdKategoryPegawai').enable();
      if (kdKategoryPegawai != null && kdKategoryPegawai != "") {
        this.clearPanelBawah(value, this.form.get('kdKategoryPegawai').value);
      } else {
        console.log('sini');
      }
    } else {
      this.form.get('kdKategoryPegawai').disable();

    }
  }
  clearPanelBawah(kdKelompokUser: any, kdKategoryPegawai: any) {
    // debugger;
    if (kdKelompokUser == '' || kdKelompokUser == null || kdKategoryPegawai == '' || kdKategoryPegawai == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

      this.listData = []
      
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokUserToGolonganPegawai/findMappedList/'+ kdKelompokUser + '/' + kdKategoryPegawai).subscribe(res2 => {
        this.listData = res2.mapKelompokUserToGolonganPegawai;
        let isVacantAllTrue = 0
        for (var i = this.listData.length - 1; i >= 0; i--) {
          if(this.listData[i].isVacant === true){
            isVacantAllTrue = isVacantAllTrue +1
          }
        }
        if (isVacantAllTrue !== 0){
          this.disPilihSemua = false
        }
        else {
          this.disPilihSemua = true;
        }
      });

      this.hasilCek = false
      this.pilihSemua = false

      this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokUserToGolonganPegawai/findByKode/' + kdKelompokUser + '/' + kdKategoryPegawai).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.mapKelompokUserToGolonganPegawai.length; i++) {
          this.pilihan.push(String(res.mapKelompokUserToGolonganPegawai[i].kdGolonganPegawai))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }

  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []

      for (var i = this.listData.length - 1; i >= 0; i--) {
        if (this.listData[i].isVacant == true){
          dataTemp.push(String(this.listData[i].kdGolonganPegawai));
        }
      }

      // this.listData.forEach(function (data) {
      //   dataTemp.push(String(data.id_kode));
      // })

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
    let mapKelompokUserToGolonganPegawai = [];
    if (this.pilihan.length > 0) {
      for (let i = 0; i < this.pilihan.length; i++) {
        let dataTemp = {
          "kdGolonganPegawai": this.pilihan[i],
          "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
          "kdKelompokUser": this.form.get('kdKelompokUser').value,
          "statusEnabled": true
        }
        mapKelompokUserToGolonganPegawai.push(dataTemp);
      }
      let dataSimpan = {
        "mapKelompokUserToGolonganPegawai": mapKelompokUserToGolonganPegawai
      }

      this.httpService.update(Configuration.get().dataMasterNew + '/mapKelompokUserToGolonganPegawai/update/' + this.version, dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.pilihSemua = false;
        this.form.get('kdKategoryPegawai').disable();
        this.hasilCek = true
        this.ngOnInit()

      });
    } else {
      this.httpService.delete(Configuration.get().dataMasterNew + '/mapKelompokUserToGolonganPegawai/delByKdKelompokUserAndKdKategoryPegawai/'+ this.form.get('kdKelompokUser').value +'/'+this.form.get('kdKategoryPegawai').value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.pilihSemua = false;
        this.form.get('kdKategoryPegawai').disable();
        this.hasilCek = true
        this.ngOnInit()
      });
    }

  }
}





