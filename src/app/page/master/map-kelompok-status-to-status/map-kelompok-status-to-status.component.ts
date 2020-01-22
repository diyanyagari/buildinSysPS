import { Component, OnInit} from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-map-kelompok-status-to-status',
  templateUrl: './map-kelompok-status-to-status.component.html',
  styleUrls: ['./map-kelompok-status-to-status.component.scss'],
  providers: [ConfirmationService]
})
export class MapKelompokStatusToStatusComponent implements OnInit {

  versi: any;
  form: FormGroup;
  formAktif: boolean;
  pencarian: string;
  page: number;
  rows: number;
  selected:any;
  listData:any[];
  kodeKelompokStatus:any[];
  kodeStatus:any[];
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  pilihan: any = [];
  pilihSemua: boolean;
  kdStatus:any;
  kdKelompokStatus:any;
  version: any;
  kodeS:any;
  kdKelompokS:any;
  kdS:any;

  constructor(
    private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService
  ) { 
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngAfterViewInit() {
    this.hasilCek = true;
    this.clearPanelBawah(this.kodeS);
  }

  ngOnInit() {
    this.version = "1";
     this.form = this.fb.group({
        'kdKelompokStatus': new FormControl('', Validators.required),
        'kdStatus': new FormControl('', Validators.required),
        'statusEnabled': new FormControl(true),
  
      });

      //ambil kelompok status
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokStatus&select=namaKelompokStatus,id').subscribe(res => {
        this.kodeKelompokStatus = [];
        this.kodeKelompokStatus.push({ label: '--Pilih Kelompok Status--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kodeKelompokStatus.push({ label: res.data.data[i].namaKelompokStatus, value: res.data.data[i].id.kode })
        };
      });

      //ambil kelompok status head
      this.httpService.get(Configuration.get().dataMasterNew + '/status/status-head').subscribe(res => {
        this.kodeStatus = [];
        this.kodeStatus.push({ label: '--Pilih Status--', value: '' })
        for (var i = 0; i < res.Status.length; i++) {
          this.kodeStatus.push({ label: res.Status[i].namaStatus, value: res.Status[i].kode.kode })
        };
      });


  }

  // getData(){
  //   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ShiftKerja&select=namaShift,id.kode').subscribe(res => {
  //     this.listData = res.data.data;
  //   });
  // }

  clearAll(kdKelompok){
    this.kdKelompokS = kdKelompok;
        //ambil kelompok status head
        this.httpService.get(Configuration.get().dataMasterNew + '/status/status-head').subscribe(res => {
          this.kodeStatus = [];
          this.kodeStatus.push({ label: '--Pilih Status--', value: '' })
          for (var i = 0; i < res.Status.length; i++) {
            this.kodeStatus.push({ label: res.Status[i].namaStatus, value: res.Status[i].kode.kode })
          };
        });
        this.kdStatus = "";
        this.hasilCek = true;
        this.pilihan = [];
        this.pilihSemua = false;


  }

  clearPanelBawah(kode){
    this.kdS = kode;
    if (kode == '' || kode == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else if(this.kdKelompokS == undefined){
      this.alertService.warn('Perhatian','Harap Pilih Kelompok Status Terlebih Dahulu');
    }else if(this.kdKelompokS != undefined){
      let kodeKel = this.kdKelompokS;
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/status/status-child/' + kode).subscribe(res => {
        this.listData = res.Status;
      });
      // this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokStatusToStatus/mapKelompokStatusToStatus/' + kode + '/' + kodeKel).subscribe(res => {
      //   this.listData = res.Status;
      // });
      this.getDataSimpan(kode);

    }
  }

  getDataSimpan(kode){
    let kodeKelompok = this.kdKelompokS;
    this.httpService.get(Configuration.get().dataMasterNew + '/mapKelompokStatusToStatus/findByKode/' + kodeKelompok + '/' + kode).subscribe(res => {
      this.pilihan = [];
      for (let i = 0; i < res.map.length; i++) {
        this.pilihan.push(String(res.map[i].kdStatus))
      }
    });
  }

  onChange(){
    console.log(JSON.stringify(this.pilihan))
  }

  selectAll(){
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
    // if(this.kdKelompokS == undefined || this.kdKelompokS == "" || this.kdS == undefined || this.kdS == ''){
    //   this.alertService.warn('Perhatian','Harap Pilih Terlebih Dahulu')
    // }
    let datastatus = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        // "kdKelompokStatus": this.form.get('kdKelompokStatus').value,
        "kode": this.pilihan[i]
      }
      datastatus.push(dataTemp);
    }
    
    let dataSimpan = {
      "kdKelompokStatus":this.form.get('kdKelompokStatus').value,
      "kdStatus": datastatus
    }
    // console.log(dataSimpan);

    this.httpService.post(Configuration.get().dataMasterNew + '/mapKelompokStatusToStatus/save/', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
    });

  }

}
