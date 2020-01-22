import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KotaKabupaten } from './kotakabupaten.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-kotakabupaten',
  templateUrl: './kotakabupaten.component.html',
  styleUrls: ['./kotakabupaten.component.scss'],
  providers: [ConfirmationService]
})
export class KotakabupatenComponent implements OnInit {
  item: KotaKabupaten = new InisialKotaKabupaten();;
  selected: KotaKabupaten;
  listData: any[];
  dataDummy: {};
  formAktif: boolean;
  pencarian: string;
  Propinsi: KotaKabupaten[];
  Kabupaten: KotaKabupaten[];
  Kecamatan: KotaKabupaten[];
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  kdPropinsi: any;
  codes: any[];
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  smbrFile: any;
  dropdownNegara: any[];
  FilterNegara: string;

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
    this.Propinsi = [];
    this.Propinsi.push({ label: '--Pilih Propinsi--', value: null })

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
    this.pencarian = '';
    this.FilterNegara = '';
    this.selected = null;
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
    this.versi = null;
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaKotaKabupaten': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'kdPropinsi': new FormControl('', Validators.required),
      'kdNegara': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.getNegara();
    this.getSmbrFile();
  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  getNegara() {
    this.dropdownNegara = [];
		this.dropdownNegara.push({ label: '--Pilih Negara--', value: '' })
		this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
			for (var i = 0; i < res.Negara.length; i++) {
				this.dropdownNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		});
  }

  getPropinsi(kdNegara) {
    this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + kdNegara).subscribe(res => {
      this.Propinsi = [];
      if (res.Propinsi.length != 0) {
        this.Propinsi.push({ label: '--Pilih Propinsi--', value: null })
        for (var i = 0; i < res.Propinsi.length; i++) {
          this.Propinsi.push({ label: res.Propinsi[i].namaPropinsi, value: res.Propinsi[i].kode.kode })
        };
      } else {
        this.Propinsi.push({label:'--Data Propinsi Kosong--', value:null})
      }
    });
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?').subscribe(table => {
      this.listData = table.KotaKabupaten;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
        this.codes.push({

          kode: this.listData[i].kode.kode,
          namaKotaKabupaten: this.listData[i].namaKotaKabupaten,
          namaPropinsi: this.listData[i].namaPropinsi,
          reportDisplay: this.listData[i].reportDisplay,
          kodeExternal: this.listData[i].kodeExternal,
          namaExternal: this.listData[i].namaExternal,
          statusEnabled: this.listData[i].statusEnabled

        })
        // }
      }
      this.fileService.exportAsExcelFile(this.codes, 'KotaKabupaten');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/kotaKabupaten/laporanKotaKabupaten.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama", "Propinsi", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?').subscribe(table => {
    //   this.listData = table.KotaKabupaten;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData.length; i++) {
    //     // if (this.listData[i].statusEnabled == true){
    //       this.codes.push({

    //         kode: this.listData[i].kode.kode,
    //         namaKotaKabupaten: this.listData[i].namaKotaKabupaten,
    //         namaPropinsi: this.listData[i].namaPropinsi,
    //         reportDisplay: this.listData[i].reportDisplay,
    //         kodeExternal: this.listData[i].kodeExternal,
    //         namaExternal: this.listData[i].namaExternal,
    //         statusEnabled: this.listData[i].statusEnabled

    //       })
    //     // }
    //   }
    //   this.fileService.exportAsPdfFile("Master Kota Kabupaten", col, this.codes, "KotaKabupaten");

    // });

  }

  get(page: number, rows: number, search: any, filter: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?page=' + page + '&rows=' + rows +'&dir=namaKotaKabupaten&sort=desc&namaKotaKabupaten='+ search +'&kdNegara='+filter).subscribe(table => {
      this.listData = table.KotaKabupaten;
      this.totalRecords = table.totalRow;

    });
  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKotaKabupaten&sort=desc&namaKotaKabupaten=' + this.pencarian + '&kdNegara='+ this.FilterNegara).subscribe(table => {
      this.listData = table.KotaKabupaten;
    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  //  setPageRow(page, rows) {
  //     if(page == undefined || rows == undefined) {
  //         this.page = Configuration.get().page;
  //         this.rows = Configuration.get().rows;
  //     } else {
  //         this.page = page;
  //         this.rows = rows;
  //     }
  // }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Kota Kabupaten');
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

  update() {
    this.httpService.update(Configuration.get().dataMasterNew + '/kotakabupaten/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/kotakabupaten/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

  }

  clone(cloned: KotaKabupaten): KotaKabupaten {
    let hub = new InisialKotaKabupaten();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialKotaKabupaten();
    fixHub = {
      "kode": hub.kode.kode,
      "namaKotaKabupaten": hub.namaKotaKabupaten,
      "reportDisplay": hub.reportDisplay,
      "kdPropinsi": hub.kdPropinsi,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,
      "kdNegara": hub.kode.kdNegara
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/kotakabupaten/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });


  }


  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kotaKabupaten/laporanKotaKabupaten.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmKotaKabupaten_laporanCetak');

    // let cetak = Configuration.get().report + '/kotaKabupaten/laporanKotaKabupaten.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
  }
}

class InisialKotaKabupaten implements KotaKabupaten {

  constructor(
    public kotaKabupaten?,
    public propinsi?,
    public kodeKotaKabupaten?,
    public id?,
    public kode?,
    public namaKotaKabupaten?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public kdPropinsi?,
    public kdNegara?
  ) { }

}