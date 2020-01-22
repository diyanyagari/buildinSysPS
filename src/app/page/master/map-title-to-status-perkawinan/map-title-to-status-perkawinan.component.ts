import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

// import { mapFasilitasRuangan } from './map-fasilitas-ruangan.interface';
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';

@Component({
  selector: 'app-map-title-to-status-perkawinan',
  templateUrl: './map-title-to-status-perkawinan.component.html',
  styleUrls: ['./map-title-to-status-perkawinan.component.scss'],
  providers: [ConfirmationService]
})
export class MapTitleToStatusPerkawinanComponent implements OnInit {
  listData: any[];
  selected: any;
  form: FormGroup;
  // kodeFasilitas: mapFasilitasRuangan[];
  dropTitle: any = [];
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
    this.version = "1";
    this.pencarian = '';
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kdTitle': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),
    });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Fasilitas&select=namaFasilitas,id').subscribe(res => {
    //   this.kodeFasilitas = [];
    //   this.kodeFasilitas.push({ label: '--Pilih Fasilitas--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeFasilitas.push({ label: res.data.data[i].namaFasilitas, value: res.data.data[i].id.kode })
    //   };
    // });

    this.httpService.get(Configuration.get().dataMasterNew + '/title/findAllData').subscribe(res => {
      this.dropTitle = [];
      this.dropTitle.push({ label: '--Pilih Title --', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.dropTitle.push({ label: res.data[i].namaTitle, value: res.data[i].kode.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/status/status-perkawinan').subscribe(res => {
      this.listData = res.data;
      this.FilterListData = res.data;
    });
  }

  clearPanelBawah(kdTitle) {
    if (kdTitle == '' || kdTitle == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/maptitletostatusperkawinan/findByKode/' + kdTitle).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapTitleToStatusPerkawinan.length; i++) {
          this.pilihan.push(String(res.MapTitleToStatusPerkawinan[i].kode.kdStatusPerkawinan))
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

  applyFilter(filterValue: string) {
    this.listData = this.FilterListData.filter(
      res => res.namaStatus.toLowerCase().includes(filterValue.toLowerCase()));
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
    let statusPerkawinan = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kode": parseInt(this.pilihan[i])
      }
      statusPerkawinan.push(dataTemp);
    }
    let dataSimpan = {
      "kdTitle": this.form.get('kdTitle').value,
      statusPerkawinan
    }
    console.log(JSON.stringify(dataSimpan));
    this.httpService.post(Configuration.get().dataMasterNew + '/maptitletostatusperkawinan/save', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
      this.reset();
    });
  }

  reset(){
    this.pilihan = [];
    this.hasilCek = true;
    this.ngOnInit();
  }
}