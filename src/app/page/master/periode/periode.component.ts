import { Inject, forwardRef, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Periode } from './periode.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-periode',
  templateUrl: './periode.component.html',
  styleUrls: ['./periode.component.scss'],
  providers: [ConfirmationService]
})
export class PeriodeComponent implements OnInit {

  listPeriode: any[];
  listPeriodeHead: any[];
  selected: Periode;
  listData: any[];
  listDataAgama: any[];
  listKelompokTransaksi: Periode[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  formAktifChild: boolean;
  versi: any;
  form: FormGroup;
  formChild: FormGroup;
  formUbah: FormGroup;
  formMap: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  reportChild: any;
  toReportChild: any;
  pilihan: any = [];
  pilihSemua: boolean;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  kdPeriodeHead: any;
  version: any;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
  tglAwal: any;
  tglAkhir: any;
  hari: any;
  bulan: any;
  cutOffAwal: any;
  cutOffAkhir: any;
  tahun: any;
  minggu: any;
  listNew: any[];
  d: any;
  kirim: any;
  periodeTrigger: any;
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  tglPeriodeAkhir: any;
  tglPeriodeAwal: any;
  cekGenerate: any;
  akhir: any;
  awal: any;
  itemsChild: any;
  kdHead:any;
  smbrFile:any;

  buttonubah: boolean
  dialogUbah: boolean

  minDateAwal : any
  maxDateAwal: any
  minDateAkhir : any
  maxDateAkhir : any

  currentRow: any;
  noHistori: any

  itemBefore: any
  formSubmitUbah2: any
  ubahPeriodeBefore: boolean
  tglAwalPeriodeMundur: any;

  itemAfter: any
  formSubmitUbah3: any
  ubahPeriodeAfter: boolean
  tglAkhirPeriodeMundur: any

  kdKelompokTransaksiChild: any

  showNewField:boolean;
  tglBayar: any[];
  tglBayarMax: any[];

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {

  }

  ngOnInit() {
    this.showNewField = true;
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    this.kdKelompokTransaksiChild = null;

    this.items = [
    {
      label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        this.downloadPdf();
      }
    },
    {
      label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
        this.downloadExcel();
      }
    },

    ];

    this.itemsChild = [
    {
      label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        this.downloadPdfChild();
      }
    },
    {
      label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
        this.downloadExcelChild();
      }
    },
    ];

    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.cekGenerate = true;
    this.getAgama(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'kdPeriodeHead': new FormControl(null),
      'kdPeriodeTrigger': new FormControl(''),
      'namaPeriode': new FormControl('', Validators.required),
      'qtyHari': new FormControl(''),
      'qtyMinggu': new FormControl(''),
      'tglAwalPeriode': new FormControl(''),
      'tglAkhirPeriode': new FormControl(''),
      'qtyBulan': new FormControl(''),
      'qtyTahun': new FormControl(''),
      'tglCutOffAwal': new FormControl(''),
      'tglCutOffAkhir': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'generate': new FormControl(false),
      'statusEnabled': new FormControl('', Validators.required),
      'kdKelompokTransaksi': new FormControl('', Validators.required),
      'qtyHariSlipGiven': new FormControl(''),
      'tglBayar': new FormControl(''),
      'tglBayarMax': new FormControl(''),
    });

    this.formMap = this.fb.group({
      'kdPeriodeHead': new FormControl('', Validators.required),
    });

    this.formChild = this.fb.group({
      'kode': new FormControl(''),
      'kdPeriodeHead': new FormControl(null),
      'namaPeriode': new FormControl('', Validators.required),
      'qtyHari': new FormControl(''),
      'qtyMinggu': new FormControl(''),
      'tglAwalPeriode': new FormControl(''),
      'tglAkhirPeriode': new FormControl(''),
      'qtyBulan': new FormControl(''),
      'qtyTahun': new FormControl(''),
      'tglCutOffAwal': new FormControl(''),
      'tglCutOffAkhir': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
      'qtyHariSlipGiven': new FormControl(''),
      'tglBayar': new FormControl(''),
      'tglBayarMax': new FormControl(''),
    });

    this.formUbah = this.fb.group({
      'tglCutOffAwal': new FormControl(''),
      'tglCutOffAkhir': new FormControl(''),
      'tglAwalPeriode': new FormControl({ value: '', disabled: true }),
      'tglAkhirPeriode': new FormControl({ value: '', disabled: true })
    })

    if (this.index == 0) {
      this.httpService.get(Configuration.get().dataMasterNew + '/periode/findAll?page=1&rows=1000&dir=namaPeriode&sort=desc').subscribe(table => {
        this.listTab = table.Periode;
        let i = this.listTab.length
        while (i--) {
          if (this.listTab[i].statusEnabled == false) {
            this.listTab.splice(i, 1);
          }
        }
      });
    };

    let dataIndex = {
      "index": this.index
    }

    this.onTabChange(dataIndex);
    this.getSmbrFile();
    this.buttonubah = true
    this.dialogUbah = false

    // let today = new Date();
    // today.setDate(today.getDate());
    // let month = today.getMonth();
    // let year = today.getFullYear();
    // this.minDateAwal = new Date();
    // this.minDateAwal.setDate(this.minDateAwal.getDate());
    // this.minDateAwal.setMonth(month);
    // this.minDateAwal.setFullYear(year);

    this.minDateAwal = null
    this.maxDateAwal = null
    this.minDateAkhir = null
    this.maxDateAkhir = null
    // 10 hari = 864,000
    this.itemBefore = null
    this.formSubmitUbah2 = null
    this.ubahPeriodeBefore = null
    this.tglAwalPeriodeMundur = null

    this.itemAfter = null
    this.formSubmitUbah3 = null
    this.ubahPeriodeAfter = null
    this.tglAkhirPeriodeMundur = null

    this.tglBayar = [];
    this.tglBayar.push({ label: '--Pilih Tanggal Bayar--', value: null });
    for (var i = 1; i <= 31; i++) {
      this.tglBayar.push({ label: i, value: i });
    }
    this.tglBayarMax = [];
    this.tglBayarMax.push({ label: '--Pilih Tanggal Bayar Max--', value: null });
    for (var i = 1; i <= 31; i++) {
      this.tglBayarMax.push({ label: i, value: i });
    }

  }

  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
     this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  valuechangeChild(newValue) {
    this.toReportChild = newValue;
    this.reportChild = newValue;
  }

  onTabChange(event) {
    let data;
    this.index = event.index;
    if (event.index > 0) {
      let index = event.index - 1;
      data = this.listTab[index].kode.kode;
      this.kdHead = data;
      this.form.get('kdPeriodeHead').setValue(data);
      this.kdKelompokTransaksiChild = null
    } else {
      data = '';
      this.form.get('kdPeriodeHead').setValue(null);
    }
    this.pencarian = '';
    this.get(this.page, this.rows, this.pencarian, data);
    this.formAktif = true;

  }

  changeAwal(d: Date) {
    this.tglAwal = d;
    this.awal = d.getDate();
    this.akhir = this.tglAkhir.getDate();

    if (this.tglAkhir !== null){
      this.hari = ((this.tglAkhir - this.tglAwal) / (1000 * 60 * 60 * 24)) + 1;
      this.bulan = (this.tglAkhir.getFullYear() - this.tglAwal.getFullYear()) * 12 + (this.tglAkhir.getMonth() - this.tglAwal.getMonth());
      this.tahun = (this.tglAkhir.getFullYear() - this.tglAwal.getFullYear());
      this.minggu = (Math.floor(Math.abs(this.tglAkhir - this.tglAwal) / (1000 * 60 * 60 * 24 * 7)));

      this.form.get('qtyHari').setValue(this.hari);
      this.form.get('qtyBulan').setValue(this.bulan);
      this.form.get('qtyMinggu').setValue(this.minggu);
      this.form.get('qtyTahun').setValue(this.tahun);      
    }
    else{
      this.form.get('qtyHari').setValue(null);
      this.form.get('qtyBulan').setValue(null);
      this.form.get('qtyMinggu').setValue(null);
      this.form.get('qtyTahun').setValue(null);  
    }

  }

  changeAkhir(d: Date) {

    this.akhir = d.getDate();
    this.tglAkhir = d;
    this.awal = this.tglAwal.getDate();
    if (this.tglAwal !== null){
      this.hari = ((this.tglAkhir - this.tglAwal) / (1000 * 60 * 60 * 24)) + 1;
      this.bulan = (this.tglAkhir.getFullYear() - this.tglAwal.getFullYear()) * 12 + (this.tglAkhir.getMonth() - this.tglAwal.getMonth());
      this.tahun = (this.tglAkhir.getFullYear() - this.tglAwal.getFullYear());
      this.minggu = (Math.floor(Math.abs(this.tglAkhir - this.tglAwal) / (1000 * 60 * 60 * 24 * 7)));

      this.form.get('qtyHari').setValue(this.hari);
      this.form.get('qtyBulan').setValue(this.bulan);
      this.form.get('qtyMinggu').setValue(this.minggu);
      this.form.get('qtyTahun').setValue(this.tahun);      
    }
    else{
      this.form.get('qtyHari').setValue(null);
      this.form.get('qtyBulan').setValue(null);
      this.form.get('qtyMinggu').setValue(null);
      this.form.get('qtyTahun').setValue(null);  
    }

    
    // this.form.get('tglCutOffAwal').setValue(this.awal);
    // this.form.get('tglCutOffAkhir').setValue(this.akhir);

    // if (this.form.get('tglCutOffAwal').value > this.form.get('tglCutOffAkhir').value) {
    //   this.alertService.warn('Peringatan', 'Tanggal Cut Off Awal Tidak Boleh Lebih Dari Tanggal Cut Off Akhir');
    // }
  }

  get(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/periode/findAll?page=' + page + '&rows=' + rows + '&dir=tglAwalPeriode&sort=asc&namaPeriode=' + search + '&kdhead=' + head).subscribe(table => {
      this.listData = table.Periode;
      this.totalRecords = table.totalRow;

    });


    this.httpService.get(Configuration.get().dataMasterNew + '/periode/findAll?page=1&rows=1000&dir=namaPeriode&sort=desc').subscribe(res => {
      this.listPeriode = [];
      this.listPeriode.push({ label: '--Pilih Periode--', value: null })
      for (var i = 0; i < res.Periode.length; i++) {
        if (res.Periode[i].kdPeriodeHead == null && res.Periode[i].statusEnabled == true) {
          this.listPeriode.push({ label: res.Periode[i].namaPeriode, value: res.Periode[i] })

        }

      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/periode/findAll?page=1&rows=1000&dir=namaPeriode&sort=desc').subscribe(res => {
      this.listPeriodeHead = [];
      this.listPeriodeHead.push({ label: '--Pilih Data Parent Periode--', value: null })
      for (var i = 0; i < res.Periode.length; i++) {

        if (res.Periode[i].kdPeriodeHead == null && res.Periode[i].statusEnabled == true) {
          this.listPeriodeHead.push({ label: res.Periode[i].namaPeriode, value: res.Periode[i].kode.kode })
        }

      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/kelompoktransaksi/findAll?page=1&rows=1000&dir=namaKelompokTransaksi&sort=desc').subscribe(res => {
      this.listKelompokTransaksi = [];
      this.listKelompokTransaksi.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
      for (var i = 0; i < res.KelompokTransaksi.length; i++) {
        this.listKelompokTransaksi.push({ label: res.KelompokTransaksi[i].namaKelompokTransaksi, value: res.KelompokTransaksi[i].kdKelompokTransaksi })
      };
    });

  }

  getFromPeriode(event) {
    console.log(event);
    if (event == null || event == undefined) {
      this.form.get('qtyMinggu').setValue(null);
      this.form.get('qtyTahun').setValue(null);
      this.form.get('qtyBulan').setValue(null);
      this.form.get('qtyHari').setValue(null);
      this.form.get('tglCutOffAwal').setValue(null);
      this.form.get('tglCutOffAkhir').setValue(null);
      this.form.get('tglAwalPeriode').setValue(null);
      this.form.get('tglAkhirPeriode').setValue(null);

    } else {

      if (this.form.get('generate').value == false) {
        this.form.get('qtyMinggu').setValue(null);
        this.form.get('qtyTahun').setValue(null);
        this.form.get('qtyBulan').setValue(null);
        this.form.get('qtyHari').setValue(null);
        this.form.get('tglCutOffAwal').setValue(null);
        this.form.get('tglCutOffAkhir').setValue(null);
        this.form.get('tglAwalPeriode').setValue(null);
        this.form.get('tglAkhirPeriode').setValue(null);

      } else {
        this.httpService.get(Configuration.get().dataMasterNew + '/periode/findAll?page=1&rows=1000&sort=desc&namaPeriode=' + event.namaPeriode).subscribe(res => {
          this.listNew = res.Periode;
          for (var i = 0; i < this.listNew.length; i++) {
            this.form.get('tglAwalPeriode').setValue(new Date(this.listNew[i].tglAwalPeriode * 1000));
            this.form.get('tglAkhirPeriode').setValue(new Date(this.listNew[i].tglAkhirPeriode * 1000));
            this.form.get('tglCutOffAwal').setValue(this.listNew[i].tglCutOffAwal);
            this.form.get('tglCutOffAkhir').setValue(this.listNew[i].tglCutOffAkhir);
            this.form.get('tglAwalPeriode').disable();
            this.form.get('tglAkhirPeriode').disable();
            this.form.get('tglCutOffAwal').disable();
            this.form.get('tglCutOffAkhir').disable();
            this.changeAwal(this.form.get('tglAwalPeriode').value);
            this.changeAkhir(this.form.get('tglAkhirPeriode').value);
          }
        });
      }
    }
  }

  // tab map periode to agama

  clearPanelBawah(kdPeriodeHead) {
    if (kdPeriodeHead == '' || kdPeriodeHead == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapperiodetoagama/findByKode/' + kdPeriodeHead).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapPeriodeToAgama.length; i++) {
          if (res.MapPeriodeToAgama[i].statusEnabled == true)
            this.pilihan.push(String(res.MapPeriodeToAgama[i].kdAgama))
        }
      });


    }
  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listDataAgama.forEach(function (data) {
        dataTemp.push(String(data.id_kode));
      })
      this.pilihan = dataTemp;

    } else {
      this.pilihan = [];

    }

  }

  onChange() {
    console.log(JSON.stringify(this.pilihan))
  }

  getAgama(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara/?table=Agama&select=namaAgama,id.kode').subscribe(res => {
      this.listDataAgama = res.data.data;
    });
  }

  onSubmitMap() {
    if (this.formMap.invalid) {
      this.validateAllFormFields(this.formMap);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanMap();
    }
  }

  simpanMap() {
    let MapPeriodeToAgama = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdAgama": this.pilihan[i],
        "kdPeriodeHead": this.formMap.get('kdPeriodeHead').value,
        "statusEnabled": true
      }
      MapPeriodeToAgama.push(dataTemp);
    }
    let dataSimpan = {
      "mapPeriodeToAgamaList": MapPeriodeToAgama
    }

    this.httpService.post(Configuration.get().dataMasterNew + '/mapperiodetoagama/save', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.pilihSemua = false;
    });
  }

  // end tab

  getGenerate(event) {
    console.log(event)
    if (event == true) {
      this.cekGenerate = false;


    } else {
      this.cekGenerate = true;
      this.form.get('qtyMinggu').setValue(null);
      this.form.get('qtyTahun').setValue(null);
      this.form.get('qtyBulan').setValue(null);
      this.form.get('qtyHari').setValue(null);
      this.form.get('tglCutOffAwal').setValue(null);
      this.form.get('tglCutOffAkhir').setValue(null);
      this.form.get('tglAwalPeriode').setValue(null);
      this.form.get('tglAkhirPeriode').setValue(null);
      this.form.get('tglAwalPeriode').enable();
      this.form.get('tglAkhirPeriode').enable();
      this.form.get('tglCutOffAwal').enable();
      this.form.get('tglCutOffAkhir').enable();
    }
  }

  cari() {
    let data = this.form.get('kdPeriodeHead').value;

    if (data == null) {
      this.get(this.page, this.rows, this.pencarian, '');
    } else {
      this.get(this.page, this.rows, this.pencarian, data);
    }

  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdPeriodeHead').value;
    if (data == null) {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }

    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Periode');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapus();
        },
        reject: () => {
          this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
        }
      });
    }
  }

  confirmDeleteChild() {
    let kode = this.formChild.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Periode');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapus();
        },
        reject: () => {
          this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
        }
      });
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
      this.simpanHead();
    }
  }

  onSubmitChild() {
    if (this.formChild.invalid) {
      this.validateAllFormFields(this.formChild);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }

  confirmUpdate() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      accept: () => {
        this.update();
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }

  confirmUpdateHead() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      accept: () => {
        this.updateHead();
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }

  // update buat form child
  update() {

    let formSubmit = {
      "kdKelompokTransaksi": this.kdKelompokTransaksiChild,
      "kode": this.formChild.get('kode').value,
      "kdPeriodeHead": this.formChild.get('kdPeriodeHead').value,
      "namaPeriode": this.formChild.get('namaPeriode').value,
      "qtyMinggu": this.formChild.get('qtyMinggu').value,
      "qtyTahun": this.formChild.get('qtyTahun').value,
      "qtyBulan": this.formChild.get('qtyBulan').value,
      "qtyHari": this.formChild.get('qtyHari').value,
      "tglAwalPeriode": this.setTimeStamp(this.formChild.get('tglAwalPeriode').value),
      "tglAkhirPeriode": this.setTimeStamp(this.formChild.get('tglAkhirPeriode').value),
      "tglCutOffAwal": this.formChild.get('tglCutOffAkhir').value,
      "tglCutOffAkhir": this.formChild.get('tglCutOffAwal').value,
      "reportDisplay": this.formChild.get('reportDisplay').value,
      "namaExternal": this.formChild.get('namaExternal').value,
      "kodeExternal": this.formChild.get('kodeExternal').value,
      "statusEnabled": this.formChild.get('statusEnabled').value,
      "tglBayar": this.form.get('tglBayar').value,
      "tglBayarMax": this.form.get('tglBayarMax').value,
      "qtyHariSlipGiven": this.form.get('qtyHariSlipGiven').value

    }

    this.httpService.update(Configuration.get().dataMasterNew + '/periode/update/' + this.versi, formSubmit).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian, '');
      this.reset();
    });
  }

  //update kalo generate uncek
  updateNonGenerate() {
    if (this.form.get('kdPeriodeTrigger').value == null) {
      this.periodeTrigger = null;
    } else {
      this.periodeTrigger = this.form.get('kdPeriodeTrigger').value.kode.kode;
    }

    if (this.form.get('tglAwalPeriode').value == null && this.form.get('tglAkhirPeriode').value == null) {
      this.tglPeriodeAwal = 0;
      this.tglPeriodeAkhir = 0;
    } else {
      this.tglPeriodeAwal = this.setTimeStamp(this.form.get('tglAwalPeriode').value);
      this.tglPeriodeAkhir = this.setTimeStamp(this.form.get('tglAkhirPeriode').value);
    }

    let formSubmit = {
      "kode": this.form.get('kode').value,
      "kdPeriodeHead": this.form.get('kdPeriodeHead').value,
      "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
      "kdPeriodeTrigger": this.periodeTrigger,
      "namaPeriode": this.form.get('namaPeriode').value,
      "qtyMinggu": this.form.get('qtyMinggu').value,
      "qtyTahun": this.form.get('qtyTahun').value,
      "qtyBulan": this.form.get('qtyBulan').value,
      "qtyHari": this.form.get('qtyHari').value,
      "tglAwalPeriode": this.tglPeriodeAwal,
      "tglAkhirPeriode": this.tglPeriodeAkhir,
      "tglCutOffAwal": this.form.get('tglCutOffAkhir').value,
      "tglCutOffAkhir": this.form.get('tglCutOffAwal').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "namaExternal": this.form.get('namaExternal').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "tglBayar": this.form.get('tglBayar').value,
      "tglBayarMax": this.form.get('tglBayarMax').value,
      "qtyHariSlipGiven": this.form.get('qtyHariSlipGiven').value

    }

    if(formSubmit.tglBayar == null || formSubmit.tglBayarMax == null || formSubmit.qtyHariSlipGiven == null){
      this.alertService.warn('Perhatian','Data Belum Lengkap, Harap di Isi');
    }else{
      this.httpService.update(Configuration.get().dataMasterNew + '/periode/update/' + this.versi, formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.get(this.page, this.rows, this.pencarian, '');
        this.reset();
      });
    }


  }

  //update kalo generate terceklis
  updateGenerate() {
    if (this.form.get('kdPeriodeTrigger').value == null) {
      this.periodeTrigger = null;
    } else {
      this.periodeTrigger = this.form.get('kdPeriodeTrigger').value.kode.kode;
    }

    if (this.form.get('tglAwalPeriode').value == null && this.form.get('tglAkhirPeriode').value == null) {
      this.tglPeriodeAwal = 0;
      this.tglPeriodeAkhir = 0;
    } else {
      this.tglPeriodeAwal = this.setTimeStamp(this.form.get('tglAwalPeriode').value);
      this.tglPeriodeAkhir = this.setTimeStamp(this.form.get('tglAkhirPeriode').value);
    }

    let formSubmit = {
      "kode": this.form.get('kode').value,
      "kdPeriodeHead": this.form.get('kdPeriodeHead').value,
      "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
      "kdPeriodeTrigger": this.periodeTrigger,
      "namaPeriode": this.form.get('namaPeriode').value,
      // "qtyMinggu": this.form.get('qtyMinggu').value,
      // "qtyTahun": this.form.get('qtyTahun').value,
      // "qtyBulan": this.form.get('qtyBulan').value,
      // "qtyHari": this.form.get('qtyHari').value,
      "tglAwalPeriode": this.tglPeriodeAwal,
      "tglAkhirPeriode": this.tglPeriodeAkhir,
      "tglCutOffAwal": this.form.get('tglCutOffAkhir').value,
      "tglCutOffAkhir": this.form.get('tglCutOffAwal').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "namaExternal": this.form.get('namaExternal').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "tglBayar": this.form.get('tglBayar').value,
      "tglBayarMax": this.form.get('tglBayarMax').value,
      "qtyHariSlipGiven": this.form.get('qtyHariSlipGiven').value

    }
    
    if(formSubmit.tglBayar == null || formSubmit.tglBayarMax == null || formSubmit.qtyHariSlipGiven == null){
      this.alertService.warn('Perhatian','Data Belum Lengkap, Harap di Isi');
    }else{
      this.httpService.post(Configuration.get().dataMasterNew + '/periode/updateGenerated/', formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.get(this.page, this.rows, this.pencarian, '');
        this.reset();
      });
    }


  }

  // update di form head
  updateHead() {
    if (this.form.get('generate').value == false) {
      this.updateNonGenerate();
    } else {
      this.updateGenerate();
    }
  }


  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let tglAwalPeriode = this.setTimeStamp(this.formChild.get('tglAwalPeriode').value)
      let tglAkhirPeriode = this.setTimeStamp(this.formChild.get('tglAkhirPeriode').value)


      let formSubmit = this.formChild.value;
      formSubmit.tglAwalPeriode = tglAwalPeriode;
      formSubmit.tglAkhirPeriode = tglAkhirPeriode;
      this.httpService.post(Configuration.get().dataMasterNew + '/periode/save?', this.formChild.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian, '');
        this.reset();
      });
    }

  }

  simpanHead() {
    if (this.formAktif == false) {
      this.confirmUpdateHead()
    // } else if (this.form.get('tglCutOffAwal').value >= this.form.get('tglCutOffAkhir').value) {
    //   this.alertService.warn('Peringatan', 'Tanggal Cut Off Awal Tidak Boleh Lebih Dari Tanggal Cut Off Akhir');

  } else {

    if (this.form.get('tglCutOffAwal').value == "" && this.form.get('tglCutOffAkhir').value == "") {
      this.cutOffAwal = 0;
      this.cutOffAkhir = 0;
    } else {
      this.cutOffAwal = this.form.get("tglCutOffAwal").value;
      this.cutOffAkhir = this.form.get("tglCutOffAkhir").value;
    }

    if (this.form.get('kdPeriodeTrigger').value == "") {
      this.periodeTrigger = null;
    } else {
      this.periodeTrigger = this.form.get('kdPeriodeTrigger').value.kode.kode;
    }

    if (this.form.get('tglAwalPeriode').value == null && this.form.get('tglAkhirPeriode').value == null) {
      this.tglPeriodeAwal = 0;
      this.tglPeriodeAkhir = 0;
    } else {
      this.tglPeriodeAwal = this.setTimeStamp(this.form.get('tglAwalPeriode').value);
      this.tglPeriodeAkhir = this.setTimeStamp(this.form.get('tglAkhirPeriode').value);
    }


    let formSubmit = {
      "kdPeriodeHead": this.form.get('kdPeriodeHead').value,
      "kdPeriodeTrigger": this.periodeTrigger,
      "namaPeriode": this.form.get('namaPeriode').value,
      "qtyMinggu": this.form.get('qtyMinggu').value,
      "qtyTahun": this.form.get('qtyTahun').value,
      "qtyBulan": this.form.get('qtyBulan').value,
      "qtyHari": this.form.get('qtyHari').value,
      "tglAwalPeriode": this.tglPeriodeAwal,
      "tglAkhirPeriode": this.tglPeriodeAkhir,
      "tglCutOffAwal": this.cutOffAwal,
      "tglCutOffAkhir": this.cutOffAkhir,
      "reportDisplay": this.form.get('reportDisplay').value,
      "namaExternal": this.form.get('namaExternal').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
      "tglBayar": this.form.get('tglBayar').value,
      "tglBayarMax": this.form.get('tglBayarMax').value,
      "qtyHariSlipGiven": this.form.get('qtyHariSlipGiven').value
    }

    if(formSubmit.tglBayar == null || formSubmit.tglBayarMax == null || formSubmit.qtyHariSlipGiven == null){
      this.alertService.warn('Perhatian','Data Belum Lengkap, Harap di Isi');
    }else{
      this.httpService.post(Configuration.get().dataMasterNew + '/periode/saveGenerated?', formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian, '');
        this.reset();
      });
    }


  }

}

reset() {
  this.kdKelompokTransaksiChild = null
  this.formChild.get('namaPeriode').disable();
  this.formChild.get('statusEnabled').disable();

  this.form.get('generate').enable();
  this.form.get('tglAwalPeriode').enable();
  this.form.get('tglAkhirPeriode').enable();
  this.form.get('tglCutOffAwal').enable();
  this.form.get('tglCutOffAkhir').enable();
  this.formAktif = true;
  this.dialogUbah = false;
  this.ngOnInit();

}


onRowSelect(event) {

  this.formAktif = false;
  this.formAktifChild = false;
  let kdKlmpkTrans = event.data.kdKelompokTransaksi;

  if (event.data.kdPeriodeHead == null || event.data.kdPeriodeHead == 0) {

    this.httpService.get(Configuration.get().dataMasterNew + '/periode/getKelompokTransaksiGaji').subscribe(table => {
      let tableKode = table.kdKelompokTransaksi;
      for(let i=0; i<tableKode.length; i++){
        if(kdKlmpkTrans == tableKode[i]){
          this.showNewField = false;
        }
      }
    });

    this.form.get('kode').setValue(event.data.kode.kode);
    this.form.get('kdPeriodeHead').setValue(event.data.kdPeriodeHead);
    this.form.get('kdPeriodeTrigger').setValue(event.data.kdPeriodeTrigger);
    this.form.get('namaPeriode').setValue(event.data.namaPeriode);

    if (event.data.tglAwalPeriode == null || event.data.tglAwalPeriode == 0) {
      this.form.get('tglAwalPeriode').setValue('');
      this.cekGenerate = true;
      this.form.get('generate').setValue(false);
      this.form.get('generate').disable();
      this.form.get('qtyMinggu').setValue(null);
      this.form.get('qtyTahun').setValue(null);
      this.form.get('qtyBulan').setValue(null);
      this.form.get('qtyHari').setValue(null);
      this.form.get('tglCutOffAwal').setValue(null);
      this.form.get('tglCutOffAkhir').setValue(null);
    } else {
      this.form.get('tglAwalPeriode').setValue(new Date(event.data.tglAwalPeriode * 1000));
      this.cekGenerate = false;
      this.form.get('generate').setValue(true);
      this.form.get('generate').disable();
      this.form.get('qtyMinggu').setValue(event.data.qtyMinggu);
      this.form.get('qtyTahun').setValue(event.data.qtyTahun);
      this.form.get('qtyBulan').setValue(event.data.qtyBulan);
      this.form.get('qtyHari').setValue(event.data.qtyHari);
      this.form.get('tglCutOffAwal').setValue(event.data.tglCutOffAwal);
      this.form.get('tglCutOffAkhir').setValue(event.data.tglCutOffAkhir);
    }
    if (event.data.tglAkhirPeriode == null || event.data.tglAkhirPeriode == 0) {
      this.form.get('tglAkhirPeriode').setValue('');
    } else {
      this.form.get('tglAkhirPeriode').setValue(new Date(event.data.tglAkhirPeriode * 1000));
    }
    this.form.get('reportDisplay').setValue(event.data.reportDisplay);
    this.form.get('namaExternal').setValue(event.data.namaExternal);
    this.form.get('kodeExternal').setValue(event.data.kodeExternal);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('kdKelompokTransaksi').setValue(event.data.kdKelompokTransaksi);
    this.form.get('tglBayar').setValue(event.data.tglBayar);
    this.form.get('tglBayarMax').setValue(event.data.tglBayarMax);
    this.form.get('qtyHariSlipGiven').setValue(event.data.qtyHariSlipGiven);
    this.versi = event.data.version;


  } else {
      //tab child
      this.formChild.get('tglBayar').setValue(event.data.tglBayar);
      this.formChild.get('tglBayarMax').setValue(event.data.tglBayarMax);
      this.formChild.get('qtyHariSlipGiven').setValue(event.data.qtyHariSlipGiven);

      this.formChild.get('namaPeriode').enable();
      this.formChild.get('statusEnabled').enable();
      this.formChild.get('qtyBulan').disable();
      this.formChild.get('qtyHari').disable();
      this.formChild.get('qtyMinggu').disable();
      this.formChild.get('qtyTahun').disable();
      this.formChild.get('tglAwalPeriode').disable();
      this.formChild.get('tglAkhirPeriode').disable();
      this.formChild.get('tglCutOffAwal').disable();
      this.formChild.get('tglCutOffAkhir').disable();
      this.formChild.get('reportDisplay').disable();
      this.formChild.get('namaExternal').disable();
      this.formChild.get('kodeExternal').disable();

      this.formChild.get('kode').setValue(event.data.kode.kode);
      this.formChild.get('kdPeriodeHead').setValue(event.data.kdPeriodeHead);
      this.formChild.get('namaPeriode').setValue(event.data.namaPeriode);
      this.formChild.get('qtyMinggu').setValue(event.data.qtyMinggu);
      this.formChild.get('qtyTahun').setValue(event.data.qtyTahun);
      this.formChild.get('qtyBulan').setValue(event.data.qtyBulan);
      if (event.data.tglAwalPeriode == null || event.data.tglAwalPeriode == 0) {
        this.formChild.get('tglAwalPeriode').setValue('');
      } else {
        this.formChild.get('tglAwalPeriode').setValue(new Date(event.data.tglAwalPeriode * 1000));
      }
      if (event.data.tglAkhirPeriode == null || event.data.tglAkhirPeriode == 0) {
        this.formChild.get('tglAkhirPeriode').setValue('');
      } else {
        this.formChild.get('tglAkhirPeriode').setValue(new Date(event.data.tglAkhirPeriode * 1000));
      }
      this.formChild.get('qtyHari').setValue(event.data.qtyHari);
      this.formChild.get('tglCutOffAwal').setValue(event.data.tglCutOffAwal);
      this.formChild.get('tglCutOffAkhir').setValue(event.data.tglCutOffAkhir);
      this.formChild.get('reportDisplay').setValue(event.data.reportDisplay);
      this.formChild.get('namaExternal').setValue(event.data.namaExternal);
      this.formChild.get('kodeExternal').setValue(event.data.kodeExternal);
      this.formChild.get('statusEnabled').setValue(event.data.statusEnabled);
      this.versi = event.data.version;

      this.kdKelompokTransaksiChild = event.data.kdKelompokTransaksi

      // if (event.data.noHistori == null) {

        // asalnya per noHistoriBefore
        if (event.data.isAllowEdit == true) {
          this.buttonubah = false

          this.currentRow = this.findSelectedIndex()

          let mindateawal = new Date((event.data.tglAwalPeriode - 864000) * 1000)
          mindateawal.setDate(mindateawal.getDate());
          let monthaw = mindateawal.getMonth();
          let yearaw = mindateawal.getFullYear();
          this.minDateAwal = mindateawal;
          this.minDateAwal.setDate(this.minDateAwal.getDate());
          this.minDateAwal.setMonth(monthaw);
          this.minDateAwal.setFullYear(yearaw);

          let maxdateawal = new Date((event.data.tglAkhirPeriode) * 1000)
          maxdateawal.setDate(maxdateawal.getDate());
          let month2 = maxdateawal.getMonth();
          let year2 = maxdateawal.getFullYear();
          this.maxDateAwal = maxdateawal;
          this.maxDateAwal.setDate(this.maxDateAwal.getDate());
          this.maxDateAwal.setMonth(month2);
          this.maxDateAwal.setFullYear(year2);

          let mindateakhir = new Date((event.data.tglAwalPeriode) * 1000)
          mindateakhir.setDate(mindateakhir.getDate());
          let month3 = mindateakhir.getMonth();
          let year3 = mindateakhir.getFullYear();
          this.minDateAkhir = mindateakhir;
          this.minDateAkhir.setDate(this.minDateAkhir.getDate());
          this.minDateAkhir.setMonth(month3);
          this.minDateAkhir.setFullYear(year3);

          let maxdateakhir = new Date((event.data.tglAkhirPeriode + 864000) * 1000)
          maxdateakhir.setDate(maxdateakhir.getDate());
          let monthak = maxdateakhir.getMonth();
          let yearak = maxdateakhir.getFullYear();
          this.maxDateAkhir = maxdateakhir;
          this.maxDateAkhir.setDate(this.maxDateAkhir.getDate());
          this.maxDateAkhir.setMonth(monthak);
          this.maxDateAkhir.setFullYear(yearak);

          this.formUbah.get('tglAwalPeriode').setValue(new Date(event.data.tglAwalPeriode * 1000))
          this.formUbah.get('tglAkhirPeriode').setValue(new Date(event.data.tglAkhirPeriode * 1000))

          this.formUbah.get('tglCutOffAwal').setValue(event.data.tglCutOffAwal)
          this.formUbah.get('tglCutOffAkhir').setValue(event.data.tglCutOffAkhir)



          let item = [...this.listData];

          let rowBefore = this.currentRow - 1;    
          if (rowBefore !== -1){
            this.itemBefore = item[rowBefore];
            let noHistoriBefore = this.itemBefore.isAllowEdit
            if (noHistoriBefore == true) {      
              this.formUbah.get('tglAwalPeriode').enable();
              this.tglAwalPeriodeMundur = new Date(event.data.tglAwalPeriode * 1000)
            }
            else {
              this.formUbah.get('tglAwalPeriode').disable();
            }
          }

          let rowAfter = this.currentRow + 1
          if (rowAfter == item.length || rowAfter < item.length){
            this.itemAfter = item[rowAfter];
            let noHistoriAfter = this.itemAfter.isAllowEdit
            if (noHistoriAfter == true) {
              this.formUbah.get('tglAkhirPeriode').enable();
              this.tglAkhirPeriodeMundur = new Date(event.data.tglAkhirPeriode * 1000)
            }
            else {
              this.formUbah.get('tglAkhirPeriode').disable();
            }
          }

        }
        else {
          this.buttonubah = true
        }
      }
    }

    setCutOffAwal(event){
      let cutOffAwal = event.getDate()
      this.formUbah.get('tglCutOffAwal').setValue(cutOffAwal)  
      this.minDateAkhir = event
      this.minDateAkhir.setDate(this.minDateAkhir.getDate())
      this.minDateAkhir.setMonth(this.minDateAkhir.getMonth())
      this.minDateAkhir.setFullYear(this.minDateAkhir.getFullYear())

      let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      let dateAwalBefore = new Date (this.itemBefore.tglAwalPeriode * 1000)
      let bulanawal = month[(dateAwalBefore).getMonth()]
      let periodeakhirBefore = this.setTimeStamp(this.formUbah.get('tglAwalPeriode').value) - 86400
      let dateperiodeakhirBefore = new Date (periodeakhirBefore * 1000)
      let bulanakhir = month[(dateperiodeakhirBefore).getMonth()]

      let namaPeriode = bulanawal + ' ' + (dateAwalBefore).getDate() + ' - ' + bulanakhir + ' ' + (dateperiodeakhirBefore).getDate() + ' ' + (dateperiodeakhirBefore).getFullYear()

    // 24 jam = 86,400

    if (this.setTimeStamp(event) != this.setTimeStamp(this.tglAwalPeriodeMundur)){
      this.formSubmitUbah2 = {
      // "kdDepartemen": "string",
      // "kdKelompokTransaksi": 0,
      "kdPeriodeHead": this.itemBefore.kdPeriodeHead,
      "kode": this.itemBefore.kode.kode,
      // "kodeExternal": "string",
      // "namaExternal": "string",
      "namaPeriode": "",
      // "qtyBulan": 0,
      // "qtyHari": 0,
      // "qtyMinggu": 0,
      // "qtyTahun": 0,
      "reportDisplay": namaPeriode,
      "statusEnabled": true,
      "tglAkhirPeriode": this.setTimeStamp(dateperiodeakhirBefore),
      "tglAwalPeriode": this.itemBefore.tglAwalPeriode,
      "tglCutOffAkhir": dateperiodeakhirBefore.getDate(),
      "tglCutOffAwal": dateAwalBefore.getDate()
    }
    this.ubahPeriodeBefore = true
  }
  else{
    this.ubahPeriodeBefore = false
  }

}

setCutOffAkhir(event) {
  let cutOffAkhir = event.getDate()
  this.formUbah.get('tglCutOffAkhir').setValue(cutOffAkhir)
  this.maxDateAwal = event
  this.maxDateAwal.setDate(this.maxDateAwal.getDate())
  this.maxDateAwal.setMonth(this.maxDateAwal.getMonth())
  this.maxDateAwal.setFullYear(this.maxDateAwal.getFullYear())

  let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  let dateAkhirAfter = new Date (this.itemAfter.tglAkhirPeriode * 1000)
  let bulanakhir = month[(dateAkhirAfter).getMonth()]
  let periodeawalAfter = this.setTimeStamp(this.formUbah.get('tglAkhirPeriode').value) + 86400
  let dateperiodeawalAfter = new Date (periodeawalAfter * 1000)
  let bulanawal = month[(dateperiodeawalAfter).getMonth()]

  let namaPeriode = bulanawal + ' ' + (dateperiodeawalAfter).getDate() + ' - ' + bulanakhir + ' ' + dateAkhirAfter.getDate() + ' ' + dateAkhirAfter.getFullYear()

  if (this.setTimeStamp(event) != this.setTimeStamp(this.tglAkhirPeriodeMundur)) {
    this.formSubmitUbah3 = {
      // "kdDepartemen": "string",
      // "kdKelompokTransaksi": 0,
      "kdPeriodeHead": this.itemAfter.kdPeriodeHead,
      "kode": this.itemAfter.kode.kode,
      // "kodeExternal": "string",
      // "namaExternal": "string",
      "namaPeriode": "",
      // "qtyBulan": 0,
      // "qtyHari": 0,
      // "qtyMinggu": 0,
      // "qtyTahun": 0,
      "reportDisplay": namaPeriode,
      "statusEnabled": true,
      "tglAkhirPeriode": this.itemAfter.tglAkhirPeriode,
      "tglAwalPeriode": this.setTimeStamp(dateperiodeawalAfter),
      "tglCutOffAkhir": dateAkhirAfter.getDate(),
      "tglCutOffAwal": dateperiodeawalAfter.getDate()
    }
    this.ubahPeriodeAfter = true
  }
  else {
    this.ubahPeriodeAfter = false
  }
}


ubahTanggal(){
  this.dialogUbah = true
}


  // {
  //     "kode": this.formChild.get('kode').value,
  //     "kdPeriodeHead": this.formChild.get('kdPeriodeHead').value,
  //     "namaPeriode": this.formChild.get('namaPeriode').value,
  //     "qtyMinggu": this.formChild.get('qtyMinggu').value,
  //     "qtyTahun": this.formChild.get('qtyTahun').value,
  //     "qtyBulan": this.formChild.get('qtyBulan').value,
  //     "qtyHari": this.formChild.get('qtyHari').value,
  //     "tglAwalPeriode": this.setTimeStamp(this.formChild.get('tglAwalPeriode').value),
  //     "tglAkhirPeriode": this.setTimeStamp(this.formChild.get('tglAkhirPeriode').value),
  //     "tglCutOffAwal": this.formChild.get('tglCutOffAkhir').value,
  //     "tglCutOffAkhir": this.formChild.get('tglCutOffAwal').value,
  //     "reportDisplay": this.formChild.get('reportDisplay').value,
  //     "namaExternal": this.formChild.get('namaExternal').value,
  //     "kodeExternal": this.formChild.get('kodeExternal').value,
  //     "statusEnabled": this.formChild.get('statusEnabled').value,

  //   }



  simpanUbah() {
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    let bulanawal = month[(this.formUbah.get('tglAwalPeriode').value).getMonth()]
    let bulanakhir = month[(this.formUbah.get('tglAkhirPeriode').value).getMonth()]

    let namaPeriode = bulanawal + ' ' + (this.formUbah.get('tglAwalPeriode').value).getDate() + ' - ' + bulanakhir + ' ' + (this.formUbah.get('tglAkhirPeriode').value).getDate() + ' ' + (this.formUbah.get('tglAkhirPeriode').value).getFullYear()


    let formSubmitUbah = {
      // "kdDepartemen": "string",
      "kdKelompokTransaksi": this.kdKelompokTransaksiChild,
      "kdPeriodeHead": this.formChild.get('kdPeriodeHead').value,
      "kode": this.formChild.get('kode').value,
      // "kodeExternal": "string",
      // "namaExternal": "string",
      "namaPeriode": "",
      // "qtyBulan": 0,
      // "qtyHari": 0,
      // "qtyMinggu": 0,
      // "qtyTahun": 0,
      "reportDisplay": namaPeriode,
      "statusEnabled": true,
      "tglAkhirPeriode": this.setTimeStamp(this.formUbah.get('tglAkhirPeriode').value),
      "tglAwalPeriode": this.setTimeStamp(this.formUbah.get('tglAwalPeriode').value),
      "tglCutOffAkhir": this.formUbah.get('tglCutOffAkhir').value,
      "tglCutOffAwal": this.formUbah.get('tglCutOffAwal').value
    }

    if (this.ubahPeriodeBefore == true) {
      this.httpService.update(Configuration.get().dataMasterNew + '/periode/update/' + this.versi, this.formSubmitUbah2).subscribe(response => {
      // this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian, '');
      // this.reset();
    });
    }

    if (this.ubahPeriodeAfter == true) {
      this.httpService.update(Configuration.get().dataMasterNew + '/periode/update/' + this.versi, this.formSubmitUbah3).subscribe(response => {
      // this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian, '');
      // this.reset();
    });

    }

    this.httpService.update(Configuration.get().dataMasterNew + '/periode/update/' + this.versi, formSubmitUbah).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian, '');
      this.reset();
    });

  }


  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/periode/del/' + deleteItem.kode.kode).subscribe(response => {
      this.get(this.page, this.rows, this.pencarian, '');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  downloadExcel() {

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/periode/laporanPeriode.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/periode/laporanPeriode.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmPeriode_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }

  cetakChild(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/periodeChild/laporanPeriodeChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdPeriodeHead='+ this.kdHead +'&download=false', 'frmPeriode_laporanCetak');
  }

  downloadPdfChild(){
    let b = Configuration.get().report + '/periodeChild/laporanPeriodeChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdPeriodeHead='+ this.kdHead +'&download=true';
    window.open(b);
  }

  downloadExcelChild(){

  }

  getKdKelompokT(event){
    let kode = event;
    this.httpService.get(Configuration.get().dataMasterNew + '/periode/getKelompokTransaksiGaji').subscribe(table => {
      let tableKode = table.kdKelompokTransaksi;
      for(let i=0; i<tableKode.length; i++){
        if(kode == tableKode[i]){
          this.showNewField = false;
        }
      }
    });
    
  }



}

class InisialPeriode implements Periode {

  constructor(
    public kdPeriodeHead?,
    public namaPeriode?,
    public qtyMinggu?,
    public tglAwalPeriode?,
    public tglAkhirPeriode?,
    public tglBerlakuAkhir?,
    public qtyTahun?,
    public qtyBulan?,
    public tglCutOffAwal?,
    public tglCutOffAkhir?,
    public qtyHari?,
    public operatorFactorRate?,
    public kdKelas?,

    public kode?,
    public kdAccount?,
    public kdProfile?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,



    ) { }

}

