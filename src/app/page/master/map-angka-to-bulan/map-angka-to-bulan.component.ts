import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapAngkaToBulan } from './map-angka-to-bulan.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';


@Component({
  selector: 'app-map-angka-to-bulan',
  templateUrl: './map-angka-to-bulan.component.html',
  styleUrls: ['./map-angka-to-bulan.component.scss'],
  providers: [ConfirmationService]
})
export class MapAngkaToBulanComponent implements OnInit {
  listData: MapAngkaToBulan[];
  selected: MapAngkaToBulan;
  form: FormGroup;

  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  FilterNegara: string;
  versi: any;

  listData2: any[];
  codes: any[];
  kdprof:any;
  kddept:any;
  laporan: boolean = false;
  smbrFile:any;
  Negara: any[];

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
    this.pencarian = '';
    this.FilterNegara = '';
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
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
    this.form = this.fb.group({
      'kdMapping': new FormControl(''),
      'formatAngka': new FormControl('', Validators.required),
      'formatBulan': new FormControl('', Validators.required),
      'noUrut': new FormControl('', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
      // 'kdNegara': new FormControl('', Validators.required)
    });
    this.getNegara();
    this.getSmbrFile();
  }

  getNegara() {
    this.Negara = [];
		this.Negara.push({ label: '--Pilih Negara--', value: '' })
		this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
			for (var i = 0; i < res.Negara.length; i++) {
				this.Negara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		});
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  
  get(page: number, rows: number, search: any, filter: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatobulan/findAll?page=' + page + '&rows=' + rows + '&dir=formatBulan&sort=desc&formatBulan=' + search + '&kdNegara=' + filter).subscribe(table => {
      this.listData = table.MapAngkaToBulan;
      this.totalRecords = table.totalRow;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  // setPageRow(page, rows) {
  //   if (page == undefined || rows == undefined) {
  //     this.page = Configuration.get().page;
  //     this.rows = Configuration.get().rows;
  //   } else {
  //     this.page = page;
  //     this.rows = rows;
  //   }
  // }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatobulan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=formatBulan&sort=desc&formatBulan=' + this.pencarian + '&kdNegara=' + this.FilterNegara).subscribe(table => {
      this.listData = table.MapAngkaToBulan;
    });
  }


  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatobulan/findAll?').subscribe(table => {
      this.listData2 = table.MapAngkaToBulan;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData2[i].kode.kdMapping,
            formatAngka: this.listData2[i].formatAngka,
            formatBulan: this.listData2[i].formatBulan,
            noUrut: this.listData2[i].noUrut,
            reportDisplay: this.listData2[i].reportDisplay,
            kodeExternal: this.listData2[i].kodeExternal,
            namaExternal: this.listData2[i].namaExternal,
            statusEnabled: this.listData2[i].statusEnabled

          })
        // }
      }

      this.fileService.exportAsExcelFile(this.codes, 'Map Angka To Bulan');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/mapAngkaToBulan/laporanMapAngkaToBulan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Format Angka", "Format Bulan", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatobulan/findAll?').subscribe(table => {
    //   this.listData2 = table.MapAngkaToBulan;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData2.length; i++) {
    //     // if (this.listData[i].statusEnabled == true){
    //       this.codes.push({

    //         kode: this.listData2[i].kode.kdMapping,
    //         formatAngka: this.listData2[i].formatAngka,
    //         formatBulan: this.listData2[i].formatBulan,
    //         noUrut: this.listData2[i].noUrut,
    //         reportDisplay: this.listData2[i].reportDisplay,
    //         kodeExternal: this.listData2[i].kodeExternal,
    //         namaExternal: this.listData2[i].namaExternal,
    //         statusEnabled: this.listData2[i].statusEnabled

    //       })
    //     // }
    //   }

    //   this.fileService.exportAsPdfFile("Master Map Angka To Bulan", col, this.codes, "Map Angka To Bulan");

    // });
  }

  confirmDelete() {
    let kdMapping = this.form.get('kdMapping').value;
    if (kdMapping == null || kdMapping == undefined || kdMapping == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Map Angka To Bulan');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/mapangkatobulan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/mapangkatobulan/save?', this.form.value).subscribe(response => {
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

  clone(cloned: MapAngkaToBulan): MapAngkaToBulan {
    let hub = new InisialMapAngkaToBulan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMapAngkaToBulan();
    fixHub = {
      'formatAngka': hub.formatAngka,
      'formatBulan': hub.formatBulan,
      'noUrut': hub.noUrut,
      'kdMapping': hub.kode.kdMapping,
      'reportDisplay': hub.reportDisplay,
      'namaExternal': hub.namaExternal,
      'kodeExternal': hub.kodeExternal,
      'statusEnabled': hub.statusEnabled,
      // "kdNegara": hub.kode.kdNegara
    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/mapangkatobulan/del/' + deleteItem.kode.kdMapping).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
      // this.get(this.page, this.rows, this.pencarian);
    });
   
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/mapAngkaToBulan/laporanMapAngkaToBulan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMapAngkaToBulan_laporanCetak');

    // let cetak = Configuration.get().report + '/mapAngkatToBulan/laporanMapAngkaToBulan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}
}

class InisialMapAngkaToBulan implements MapAngkaToBulan {

  constructor(
    public formatAngka?,
    public formatBulan?,
    public noUrut?,
    public kdMapping?,
    public kode?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    // public kdNegara?


    ) { }

}





