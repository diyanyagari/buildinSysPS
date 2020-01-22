import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { StrukturNomor } from './struktur-nomor.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-struktur-nomor',
  templateUrl: './struktur-nomor.component.html',
  styleUrls: ['./struktur-nomor.component.scss'],
  providers: [ConfirmationService]
})
export class StrukturNomorComponent implements OnInit {
  selected: StrukturNomor;
  listData: any[];
  dataDummy: {};
  items: any;
  page: number;
  rows: number;
  listStrukturNomorHead: StrukturNomor[];
  listKelompokTransaksi: StrukturNomor[];
  listLevel: StrukturNomor[];
  listStatusReset: StrukturNomor[];
  pencarian: string;
  versi: any;
  report: any;
  toReport: any;
  formAktif: boolean;
  form: FormGroup;
  totalRecords: number;
  cekIsAutoIncrement: any;
  isAutoIncrement: boolean;
  cekIsDefault: any;
  isDefault: boolean;
  listDataDetail: any[];
  codes: any[];
  listData2: any[];
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  listFormatKode: any[];
  smbrFile: any;
  listStatusResetFix: any[];
  formatNomor: any;
  qtyDigitNomor: any;
  listTipeDataObjek: any[];
  isQtyNomorPastRecallByPass: any;
  isPanggilanByPass: any;
  isAutoIncrements:boolean;
  isDefaults:boolean;
    isPanggilanByPasss:boolean;
    isQtyNomorPastRecallByPasss:boolean;
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
  }
  ngOnInit() {
    this.isAutoIncrements=false;
    this.isDefaults=false;
    this.isPanggilanByPasss=false;
    this.isQtyNomorPastRecallByPasss=false;
    this.formatNomor = '';
    this.pencarian = "";
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
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
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.cekIsAutoIncrement = 0
    this.cekIsDefault = 0
    this.formAktif = true;
    this.getPage(this.page, this.rows, '');
    this.listDataDetail = [];
    this.form = this.fb.group({
      'namaStrukturNomor': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'deskripsiDetail': new FormControl(''),
      // 'statusResetNomor': new FormControl(''),
      'qtyDigitNomor': new FormControl('', Validators.required),
      'formatNomor': new FormControl(''),
      'kode': new FormControl(''),
      'isDefault': new FormControl(false),
      'isAutoIncrement': new FormControl(false),
      'statusEnabled': new FormControl('', Validators.required),
      'kdTipeDataObjek': new FormControl('', Validators.required),
      'kdStrukturNomorHead': new FormControl(null),
      'keteranganLainnya': new FormControl(''),
      'isQtyNomorPastRecallByPass': new FormControl(null),
      'qtyPanggilan': new FormControl(null),
      'durasiPanggilanMenit': new FormControl(null),
      'qtyNomorPastRecall': new FormControl(null),
      'isPanggilanByPass': new FormControl(null),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=StrukturNomor&select=namaStrukturNomor,id').subscribe(res => {
      this.listStrukturNomorHead = [];
      this.listStrukturNomorHead.push({ label: '--Pilih Data Parent Struktur Nomor--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listStrukturNomorHead.push({ label: res.data.data[i].namaStrukturNomor, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAllCombo').subscribe(res => {
      this.listTipeDataObjek = [];
      this.listTipeDataObjek.push({ label: '--Pilih Data Tipe Data Objek--', value: null })
      for (var i = 0; i < res.data.length; i++) {
        this.listTipeDataObjek.push({ label: res.data[i].namaTypeDataObjek, value: res.data[i].kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findLevelTingkat').subscribe(res => {
      this.listLevel = [];
      for (var i = 0; i < res.levelTingkat.length; i++) {
        this.listLevel.push({ label: res.levelTingkat[i].namaLevelTingkat, value: res.levelTingkat[i].kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findStatusReset').subscribe(res => {
      this.listStatusReset = [];
      this.listStatusResetFix = [];
      this.listStatusReset.push({ label: '--Pilih Status Reset Nomor--', value: '' });
      this.listStatusResetFix.push({ label: '--Pilih Status Reset Nomor--', value: '' });
      for (var i = 0; i < res.statusReset.length; i++) {
        this.listStatusReset.push({ label: res.statusReset[i].nama, value: res.statusReset[i] });
        this.listStatusResetFix.push({ label: res.statusReset[i].nama, value: res.statusReset[i] });
      };
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findFormatKode').subscribe(res => {
      this.listFormatKode = [];
      this.listFormatKode.push({ label: '--Pilih Format Kode--', value: '' })
      for (var i = 0; i < res.formatKode.length; i++) {
        this.listFormatKode.push({ label: res.formatKode[i].nama, value: res.formatKode[i] })
      };
    });
    this.getSmbrFile();
  }
  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  valuechange(newValue) {
    //	this.toReport = newValue;
    this.report = newValue;
  }

  changeConvertAutoIn(event) {
    if (event == true) {
      this.cekIsAutoIncrement = 1
      return 1;
    } else {
      this.cekIsAutoIncrement = 0
      return 0;
    }

  }

  changeConvertDefault(event) {
    if (event == true) {
      this.cekIsDefault = 1
      return 1;
    } else {
      this.cekIsDefault = 0
      return 0;
    }

  }

  changeConvertIsQtyNomorPastRecallByPass(event) {
    if (event == true) {
      this.isQtyNomorPastRecallByPass = 1
      return 1;
    } else {
      this.isQtyNomorPastRecallByPass = 0
      return 0;
    }

  }

  changeConvertIsPanggilanByPass(event) {
    if (event == true) {
      this.isPanggilanByPass = 1
      return 1;
    } else {
      this.isPanggilanByPass = 0
      return 0;
    }

  }


  cari(page, rows) {
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaStrukturNomor&sort=desc&namaStrukturNomor=' + this.pencarian).subscribe(table => {
      this.listData = table.StrukturNomor;

    });
  }

  getPage(page: number, rows: number, seacrh: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.StrukturNomor;
      this.totalRecords = table.totalRow;
    });



  }

  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  tambahDetail() {
    let listDataDetail = [...this.listDataDetail];
    let nomorUrutLevelTignkat = listDataDetail.length;
    if (nomorUrutLevelTignkat >= this.listLevel.length) {
      this.alertService.warn('Peringatan', 'Level Tingkat Sudah Maksimal');
    } else {
      let dataTemp = {
        "levelTingkat": {
          "kode": this.listLevel[nomorUrutLevelTignkat].value,
          "namaLevelTingkat": this.listLevel[nomorUrutLevelTignkat].label,
        },
        "qtyDigitKode": "",
        "kodeUrutAwal": "",
        "kodeUrutAkhir": "",
        "formatKode": {
          "value": "",
          "nama": "--Pilih Format Kode--",
        },
        "status": {
          "value": "",
          "nama": "--Pilih Status Reset Nomor--",
        },
        "kenaikan": false,
        "statusDefault": true,
        "kdStrukturNomor": null,

      }

      listDataDetail.push(dataTemp);
      this.listDataDetail = listDataDetail;
      this.formatNomor = '';
      for (let i = 0; i < this.listDataDetail.length; i++) {
        this.formatNomor = this.formatNomor + this.listDataDetail[i].kodeUrutAwal;
      }
    }

  }

  hapusRow(row) {
    let listDataDetail = [...this.listDataDetail];
    listDataDetail.splice(row, 1);
    for (let i = row; i < listDataDetail.length; i++) {
      listDataDetail[i].levelTingkat.kode = this.listLevel[i].value;
      listDataDetail[i].levelTingkat.namaLevelTingkat = this.listLevel[i].label
    }
    this.listDataDetail = listDataDetail;
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Struktur Nomor');
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

  update() {
    if (this.cekValidasiNoUrut().length == 0 && this.cekDigitKode(null) == true) {
      let dataTemp = [];
      let naik;
      for (let i = 0; i < this.listDataDetail.length; i++) {
        if (this.listDataDetail[i].kenaikan === true) {
          naik = 1;
        } else {
          naik = 0;
        }
        dataTemp.push({

          "formatKode": this.listDataDetail[i].formatKode.value,
          "isAutoIncrement": 1,
          "kdDepartemen": '',
          "kdLevelTingkat": this.listDataDetail[i].levelTingkat.kode,
          "kdStrukturNomor": 0,
          "keteranganLainnya": '',
          "kodeUrutAkhir": this.listDataDetail[i].kodeUrutAkhir,
          "kodeUrutAwal": this.listDataDetail[i].kodeUrutAwal,
          "qtyDigitKode": parseInt(this.listDataDetail[i].qtyDigitKode),
          "statusEnabled": this.listDataDetail[i].statusDefault,
          "statusResetNomor": this.listDataDetail[i].status.value

        })
      }

      let isAutoIncrementAll = this.changeConvertAutoIn(this.form.get('isAutoIncrement').value);
      let isDefaultAll = this.changeConvertDefault(this.form.get('isDefault').value);
      let isQtyNomorPastRecallByPass = this.changeConvertIsQtyNomorPastRecallByPass(this.form.get('isQtyNomorPastRecallByPass').value);
      let isPanggilanByPass = this.changeConvertIsPanggilanByPass(this.form.get('isPanggilanByPass').value);

      let fixHub = {
        "deskripsiDetail": this.form.get('deskripsiDetail').value,
        "formatNomor": this.form.get('formatNomor').value,
        "isAutoIncrement": this.cekIsAutoIncrement,
        "isDefault": this.cekIsDefault,
        "kdDepartemen": '',
        "kdStrukturNomorHead": this.form.get('kdStrukturNomorHead').value,
        "keteranganLainnya": this.form.get('keteranganLainnya').value,
        "kode": this.form.get('kode').value,
        "namaStrukturNomor": this.form.get('namaStrukturNomor').value,
        "qtyDigitNomor": parseInt(this.form.get('qtyDigitNomor').value),
        "reportDisplay": this.form.get('reportDisplay').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "strukturNomorDetail": dataTemp,
        "kdTypeDataObjek": this.form.get('kdTipeDataObjek').value,
        "qtyNomorPastRecall": this.form.get('qtyNomorPastRecall').value,
        "durasiPanggilanMenit": this.form.get('durasiPanggilanMenit').value,
        "qtyPanggilan": this.form.get('qtyPanggilan').value,
        "isQtyNomorPastRecallByPass": this.isQtyNomorPastRecallByPass,
        "isPanggilanByPass": this.isPanggilanByPass,

      }
      this.httpService.update(Configuration.get().dataMasterNew + '/strukturnomor/update/' + this.versi, fixHub).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.getPage(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }
    else {
      if (this.cekDigitKode(null) == true) {
        this.alertService.warn('Peringatan', 'Status Reset Untuk Format Kode No Urut Tidak Boleh Kosong');
      }
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
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else if (this.listDataDetail.length == 0 || this.listDataDetail.length == null) {
      this.alertService.warn('Peringatan', 'Detail Tidak Boleh Kosong')
    } else {
      if (this.cekValidasiNoUrut().length == 0 && this.cekDigitKode(null) == true) {
        let dataTemp = [];
        let naik;
        for (let i = 0; i < this.listDataDetail.length; i++) {
          if (this.listDataDetail[i].kenaikan == true) {
            naik = 1;
          } else {
            naik = 0;
          }
          dataTemp.push({
            "formatKode": this.listDataDetail[i].formatKode.value,
            "isAutoIncrement": naik,
            "kdDepartemen": '',
            "kdLevelTingkat": this.listDataDetail[i].levelTingkat.kode,
            "kdStrukturNomor": 0,
            "keteranganLainnya": '',
            "kodeUrutAkhir": this.listDataDetail[i].kodeUrutAkhir,
            "kodeUrutAwal": this.listDataDetail[i].kodeUrutAwal,
            "qtyDigitKode": parseInt(this.listDataDetail[i].qtyDigitKode),
            "statusEnabled": this.listDataDetail[i].statusDefault,
            "statusResetNomor": this.listDataDetail[i].status.value

          })
        }


        let isAutoIncrementAll = this.changeConvertAutoIn(this.form.get('isAutoIncrement').value);
        let isDefaultAll = this.changeConvertDefault(this.form.get('isDefault').value);
        let isQtyNomorPastRecallByPass = this.changeConvertIsQtyNomorPastRecallByPass(this.form.get('isQtyNomorPastRecallByPass').value);
        let isPanggilanByPass = this.changeConvertIsPanggilanByPass(this.form.get('isPanggilanByPass').value);


        let fixHub = {
          "deskripsiDetail": this.form.get('deskripsiDetail').value,
          "formatNomor": this.form.get('formatNomor').value,
          "isAutoIncrement": this.cekIsAutoIncrement,
          "isDefault": this.cekIsDefault,
          "kdDepartemen": '',
          "kdStrukturNomorHead": this.form.get('kdStrukturNomorHead').value,
          "keteranganLainnya": this.form.get('keteranganLainnya').value,
          "kode": this.form.get('kode').value,
          "namaStrukturNomor": this.form.get('namaStrukturNomor').value,
          "qtyDigitNomor": parseInt(this.form.get('qtyDigitNomor').value),
          "reportDisplay": this.form.get('reportDisplay').value,
          "statusEnabled": this.form.get('statusEnabled').value,
          "strukturNomorDetail": dataTemp,
          "kdTypeDataObjek": this.form.get('kdTipeDataObjek').value,
          "qtyNomorPastRecall": this.form.get('qtyNomorPastRecall').value,
          "durasiPanggilanMenit": this.form.get('durasiPanggilanMenit').value,
          "qtyPanggilan": this.form.get('qtyPanggilan').value,
          "isQtyNomorPastRecallByPass": this.isQtyNomorPastRecallByPass,
          "isPanggilanByPass": this.isPanggilanByPass,


        }
        console.log(fixHub)
        this.httpService.post(Configuration.get().dataMasterNew + '/strukturnomor/save?', fixHub).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.getPage(this.page, this.rows, this.pencarian);
          this.reset();

        });
      } else {
        if (this.cekDigitKode(null) == true) {
          this.alertService.warn('Peringatan', 'Status Reset Untuk Format Kode No Urut Tidak Boleh Kosong');
        }
      }
    }


  }

  getDetail(dataPeg) {

    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findByKode/' + dataPeg.data.kode.kode).subscribe(table => {
      let struktur = table.DetailStrukturNomor;
      this.listDataDetail = [];

      let dataFix
      let nilaiNaik: boolean;
      for (let i = 0; i < struktur.length; i++) {
        if (struktur[i].isAutoIncrement === 1) {
          nilaiNaik = true;
        } else {
          nilaiNaik = false;
        }

        dataFix =
          {
            "levelTingkat": {
              "namaLevelTingkat": struktur[i].namaLevelTingkat,
              "kode": struktur[i].kode.kdLevelTingkat,
            },
            "qtyDigitKode": struktur[i].qtyDigitKode,
            "kodeUrutAwal": struktur[i].kodeUrutAwal,
            "kodeUrutAkhir": struktur[i].kodeUrutAkhir,
            "status": {
              "value": struktur[i].statusResetNomor,
              "nama": struktur[i].statusResetNomor,
            },
            "formatKode": {
              "value": struktur[i].formatKode,
              "nama": struktur[i].formatKode
            },
            "kdStrukturNomor": struktur[i].kode.kdStrukturNomor,
            "statusDefault": struktur[i].statusEnabled,
            "kenaikan": nilaiNaik


          }
        this.listDataDetail.push(dataFix);
      }
      this.cekListFormatKode();
    });
  }
  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event) {
    this.formAktif = false;
    this.formAktif = false;
    this.getDetail(event);
    let isAutoIncrementAll;
    let isDefaultAll;
    let isQtyNomorPastRecallByPass;
    let isPanggilanByPass;
    if (event.data.isAutoIncrement == 1) {
      isAutoIncrementAll = true;
    } else {
      isAutoIncrementAll = false;
    }
    if (event.data.isDefault == 1) {
      isDefaultAll = true;
    } else {
      isDefaultAll = false;
    }
    if (event.data.isQtyNomorPastRecallByPass == 1) {
      isQtyNomorPastRecallByPass = true;
    } else {
      isQtyNomorPastRecallByPass = false;
    }

    if (event.data.isPanggilanByPass == 1) {
      isPanggilanByPass = true;
    } else {
      isPanggilanByPass = false;
    }

    this.form.get('kode').setValue(event.data.kode.kode),
      this.form.get('namaStrukturNomor').setValue(event.data.namaStrukturNomor),
      this.form.get('deskripsiDetail').setValue(event.data.deskripsiDetail),
      this.form.get('qtyDigitNomor').setValue(event.data.qtyDigitNomor),
      // this.form.get('formatNomor').setValue(event.data.formatNomor),
      this.form.get('kdStrukturNomorHead').setValue(event.data.kdStrukturNomorHead),
      this.form.get('reportDisplay').setValue(event.data.reportDisplay),
      this.form.get('isAutoIncrement').setValue(isAutoIncrementAll),
      this.form.get('isDefault').setValue(isDefaultAll),
      this.form.get('statusEnabled').setValue(event.data.statusEnabled),
      this.form.get('kdTipeDataObjek').setValue(event.data.kdTypeDataObjek),
      this.form.get('durasiPanggilanMenit').setValue(event.data.durasiPanggilanMenit),
      this.form.get('qtyNomorPastRecall').setValue(event.data.qtyNomorPastRecall),
      this.form.get('qtyPanggilan').setValue(event.data.qtyPanggilan),
      this.form.get('isQtyNomorPastRecallByPass').setValue(isQtyNomorPastRecallByPass),
      this.form.get('isPanggilanByPass').setValue(isPanggilanByPass),

      this.formatNomor = '';
    for (let i = 0; i < event.data.StrukturNomorDetail.length; i++) {
      this.formatNomor = this.formatNomor + event.data.StrukturNomorDetail[i].kodeUrutAwal;
    }
    this.versi = event.data.version;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/strukturnomor/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.getPage(this.page, this.rows, this.pencarian);
    });
    this.reset();

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/strukturnomor/findAll?').subscribe(table => {
      this.listData2 = table.StrukturNomor;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        this.codes.push({

          kode: this.listData2[i].kode.kode,
          namaStrukturNomorHead: this.listData2[i].namaStrukturNomorHead,
          namaStrukturNomor: this.listData2[i].namaStrukturNomor,
          deskripsiDetail: this.listData2[i].deskripsiDetail,
          qtyDigitNomor: this.listData2[i].qtyDigitNomor,
          formatNomor: this.listData2[i].formatNomor,
          keteranganLainnya: this.listData2[i].keteranganLainnya,
          reportDisplay: this.listData2[i].reportDisplay,
          statusEnabled: this.listData2[i].statusEnabled,

        })

      }
      this.fileService.exportAsExcelFile(this.codes, 'StrukturNomor');
    });

  }

  downloadPdf() {
    let b = Configuration.get().report + '/strukturNomor/laporanStrukturNomor.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';

    window.open(b);
  }
  tutupLaporan() {
    this.laporan = false;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/strukturNomor/laporanStrukturNomor.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmStrukturNomor_laporanCetak');
  }
  cekListFormatKode() {

    this.listStatusResetFix = [];
    //dataPembanding
    let dataDummy = [
      { nama: "mm", value: "M" },
      { nama: "yy", value: "Y" },
      { nama: "dd", value: "D" }
    ];
    let resPromise = new Promise((resolve, reject) => {
      resolve(this.listStatusReset);
    });
    resPromise.then((res) => {
      for (let i = 0; i < this.listStatusReset.length; i++) {
        // cari index listDataDetail yang formatkodenya sama dengan liststatusreset
        let cari = this.listDataDetail.map(function (e) { return e.formatKode.value; }).indexOf(this.listStatusReset[i].value.nama);
        //cari index liststatusreset yang sama dengan data dummy
        let cariPush = dataDummy.map(function (e) { return e.value; }).indexOf(this.listStatusReset[i].value.value);
        //push index 0
        if (i == 0) {
          this.listStatusResetFix.push(this.listStatusReset[i]);
        }

        //push data  list status reset yang sama dengan salah satu format kode dalam detail
        if (cari != -1) {
          this.listStatusResetFix.push(this.listStatusReset[i]);
        }

        //push data yang indexnya bukan 0 dan listSatusResetnya tidak sama dengan datadummy
        if (i != 0) {
          if (cariPush == -1) {
            this.listStatusResetFix.push(this.listStatusReset[i])
          }
        }
      }
      return this.listStatusResetFix;
    }).then((data) => {
      let dataFix = [];
      for (let i = 0; i < this.listDataDetail.length; i++) {
        let cari = data.map(function (e) { return e.value.value; }).indexOf(this.listDataDetail[i].status.value);
        if (this.listDataDetail[i].formatKode.value != 'No Urut') {
          dataFix.push(i);
        }
        if (cari == -1) {
          dataFix.push(i);
        }
      }
      return [data, dataFix];
    }).then((data) => {
      for (let j = 0; j < data[1].length; j++) {
        this.listDataDetail[data[1][j]].status = { nama: " ", value: " " };
      }

      this.listStatusResetFix = data[0];
      return this.listDataDetail;
    });
    return resPromise;

  }

  setInputDetail(type, index, format, event) {
    if (event) {
      if (type == 'kodeUrutAwal') {
        this.formatNomor = '';
        for (let i = 0; i < this.listDataDetail.length; i++) {
          this.formatNomor = this.formatNomor + this.listDataDetail[i].kodeUrutAwal;
        }
      }
    }
    if (format == 'No Urut') {
      if (event) {

        for (let i = 0; i < event.length; i++) {
          let typeData = typeof event[i];
          if (!(/^([0-9])$/.test(event[i]))) {
            if (type == 'kodeUrutAwal') {
              this.alertService.warn('Peringatan', 'Untuk Format Kode No Urut, Kode Urut Awal Harus Number');
              this.listDataDetail[index].kodeUrutAwal = null;
            }
            if (type == 'kodeUrutAkhir') {
              this.alertService.warn('Peringatan', 'Untuk Format Kode No Urut, Kode Urut Akhir Harus Number');
              this.listDataDetail[index].kodeUrutAkhir = null;
            }
          }
        }
      }
    }
  }

  cekValidasiNoUrut() {
    let listError = []
    for (let i = 0; i < this.listDataDetail.length; i++) {
      if (this.listDataDetail[i].formatKode.value == 'No Urut') {
        if (this.listDataDetail[i].status.value == null || this.listDataDetail[i].status.value == " ") {
          listError.push(i);
        }
      }
    }
    let cari = this.listDataDetail.map(function (e) { return e.formatKode.value; }).indexOf("No Urut");
    return listError;
  }

  cekDigitKode(index) {
    let qtyDigitKode = 0;
    for (let i = 0; i < this.listDataDetail.length; i++) {
      qtyDigitKode += parseInt(this.listDataDetail[i].qtyDigitKode);
      if (index != null) {

        if (qtyDigitKode > this.qtyDigitNomor) {
          this.alertService.warn('Peringatan', 'Jumlah Digit Nomor Tidak Boleh Lebih Dari ' + this.qtyDigitNomor + ' Digit');
          this.listDataDetail[index].qtyDigitKode = 0;
        }
      }
    }
    if (index == null) {
      if (qtyDigitKode > this.qtyDigitNomor) {
        this.alertService.warn('Peringatan', 'Jumlah Digit Nomor Tidak Boleh Lebih Dari ' + this.qtyDigitNomor + ' Digit');
        return false;
      } else {
        return true;
      }
    }
  }
  calculateTotal() {
    let total = 0;
    for (let i = 0; i < this.listDataDetail.length; i++) {
      total += parseInt(this.listDataDetail[i].qtyDigitKode);
    }
    return total;
  }

}

class InisialStrukturNomor implements StrukturNomor {

  constructor(
    public id?,
    public kode?,
    public kodeStrukturNomor?,
    public namaStrukturNomor?,
    public deskripsiDetail?,
    public isDefault?,
    public isAutoIncrement?,
    public qtyDigitNomor?,
    public formatNomor?,
    public kdStrukturNomorHead?,
    public keteranganLainnya?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public Version?,
    public kdLevelTingkat?,
    public kodeUrutAkhir?,
    public kodeUrutAwal?,
    public qtyDigitKode?,
    public formatKode?,




  ) { }

}

