import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapAngkaToHari } from './map-angka-to-hari.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-map-angka-to-hari',
  templateUrl: './map-angka-to-hari.component.html',
  styleUrls: ['./map-angka-to-hari.component.scss'],
  providers: [ConfirmationService]
})
export class MapAngkaToHariComponent implements OnInit {
  listData: MapAngkaToHari[];
  selected: MapAngkaToHari;
  form: FormGroup;

  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;

  listData2: any[];
  codes: any[];
  kdprof:any;
  kddept:any;
  laporan: boolean = false;
  smbrFile:any;

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
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdMapping': new FormControl(''),
      'formatAngka': new FormControl('', Validators.required),
      'formatHari': new FormControl('', Validators.required),
      'noUrut': new FormControl('', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.getSmbrFile();

  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatohari/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.MapAngkaToHari;
      this.totalRecords = table.totalRow;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
    this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatohari/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=formatHari&sort=desc&formatHari=' + this.pencarian).subscribe(table => {
      this.listData = table.MapAngkaToHari;
    });
  }


  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatohari/findAll?').subscribe(table => {
      this.listData2 = table.MapAngkaToHari;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData2[i].kode.kdMapping,
            formatAngka: this.listData2[i].formatAngka,
            formatHari: this.listData2[i].formatHari,
            noUrut: this.listData2[i].noUrut,
            reportDisplay: this.listData2[i].reportDisplay,
            kodeExternal: this.listData2[i].kodeExternal,
            namaExternal: this.listData2[i].namaExternal,
            statusEnabled: this.listData2[i].statusEnabled

          })
        // }
      }
      this.fileService.exportAsExcelFile(this.codes, 'Map Angka To Hari');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/mapAngkaToHari/laporanMapAngkaToHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Format Angka", "Format Hari", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/mapangkatohari/findAll?').subscribe(table => {
    //   this.listData2 = table.MapAngkaToHari;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData2.length; i++) {
    //     // if (this.listData[i].statusEnabled == true){
    //       this.codes.push({

    //         kode: this.listData2[i].kode.kdMapping,
    //         formatAngka: this.listData2[i].formatAngka,
    //         formatHari: this.listData2[i].formatHari,
    //         noUrut: this.listData2[i].noUrut,
    //         reportDisplay: this.listData2[i].reportDisplay,
    //         kodeExternal: this.listData2[i].kodeExternal,
    //         namaExternal: this.listData2[i].namaExternal,
    //         statusEnabled: this.listData2[i].statusEnabled

    //       })
    //     // }
    //   }

    //   this.fileService.exportAsPdfFile("Master Map Angka To Hari", col, this.codes, "Map Angka To Hari");

    // });
  }

  confirmDelete() {
    let kdMapping = this.form.get('kdMapping').value;
    if (kdMapping == null || kdMapping == undefined || kdMapping == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Map Angka To Hari');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/mapangkatohari/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/mapangkatohari/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
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

  clone(cloned: MapAngkaToHari): MapAngkaToHari {
    let hub = new InisialMapAngkaToHari();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMapAngkaToHari();
    fixHub = {
      'formatAngka': hub.formatAngka,
      'formatHari': hub.formatHari,
      'noUrut': hub.noUrut,
      'kdMapping': hub.kode.kdMapping,
      'reportDisplay': hub.reportDisplay,
      'namaExternal': hub.namaExternal,
      'kodeExternal': hub.kodeExternal,
      'statusEnabled': hub.statusEnabled

    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/mapangkatohari/del/' + deleteItem.kode.kdMapping).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/mapAngkaToHari/laporanMapAngkaToHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMapAngkaToHari_laporanCetak');

    // let cetak = Configuration.get().report + '/mapAngkatToHari/laporanMapAngkaToHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}
}

class InisialMapAngkaToHari implements MapAngkaToHari {

  constructor(
    public formatAngka?,
    public formatHari?,
    public noUrut?,
    public kdMapping?,
    public kode?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,



    ) { }

}






