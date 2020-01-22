import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Lokasi } from './lokasi';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';


@Component({
  selector: 'app-lokasi',
  templateUrl: './lokasi.component.html',
  styleUrls: ['./lokasi.component.scss'],
  providers: [ConfirmationService]
})
export class LokasiComponent implements OnInit {
  listData: Lokasi[];
  selected: Lokasi;
  form: FormGroup;
  kodeDepartemen: Lokasi[];
  kodeLokasiHead: Lokasi[];
  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;

  codes:any[];
  listData2: any[];
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
      'kode': new FormControl(''),
      'kdLokasiHead': new FormControl(null),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'namaLokasi': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),

    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Lokasi&select=namaLokasi,id').subscribe(res => {
      this.kodeLokasiHead = [];
      this.kodeLokasiHead.push({ label: '--Pilih Data Parent Lokasi--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeLokasiHead.push({ label: res.data.data[i].namaLokasi, value: res.data.data[i].id.kode })
      };
    });

    this.getSmbrFile();

  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/lokasi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.Lokasi;
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
    this.httpService.get(Configuration.get().dataMasterNew + '/lokasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaLokasi&sort=desc&namaLokasi=' + this.pencarian).subscribe(table => {
      this.listData = table.Lokasi;
    });
  }


  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/lokasi/findAll?').subscribe(table => {
      
      this.listData2 = table.Lokasi;
      this.codes = [];

      for (let i = 0; i<this.listData2.length; i++){
        this.codes.push({
          kode: this.listData2[i].kode,
          namaLokasiHead: this.listData2[i].namaLokasiHead,
          namaLokasi: this.listData2[i].namaLokasi,
          reportDisplay: this.listData2[i].reportDisplay,
          kodeExternal: this.listData2[i].kodeExternal,
          namaExternal: this.listData2[i].namaExternal,
          statusEnabled: this.listData2[i].statusEnabled
        })
      }
      this.fileService.exportAsExcelFile(this.codes, 'Lokasi');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/lokasi/laporanlokasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/lokasi/findAll?').subscribe(table => {

    //   this.listData2 = table.Lokasi;
    //   this.codes = [];

    //   for (let i = 0; i<this.listData2.length; i++){
    //     this.codes.push({
    //       kode: this.listData2[i].kode,
    //       namaLokasiHead: this.listData2[i].namaLokasiHead,
    //       namaLokasi: this.listData2[i].namaLokasi,
    //       reportDisplay: this.listData2[i].reportDisplay,
    //       kodeExternal: this.listData2[i].kodeExternal,
    //       namaExternal: this.listData2[i].namaExternal,
    //       statusEnabled: this.listData2[i].statusEnabled
    //     })
    //   }
    //   this.fileService.exportAsPdfFile("Master Lokasi", col, this.codes, "Lokasi");

    // });
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Lokasi');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/lokasi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/lokasi/save?', this.form.value).subscribe(response => {
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

  clone(cloned: Lokasi): Lokasi {
    let hub = new InisialLokasi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialLokasi();
    fixHub = {
      'namaLokasi': hub.namaLokasi,
      'kdLokasiHead': hub.kdLokasiHead,
      'kode': hub.kode,
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/lokasi/del/' + deleteItem.kode).subscribe(response => {
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
    this.print.showEmbedPDFReport(Configuration.get().report + '/lokasi/laporanlokasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmLokasi_laporanCetak');

    // let cetak = Configuration.get().report + '/lokasi/laporanlokasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}
}

class InisialLokasi implements Lokasi {

  constructor(
    public namaLokasi?,
    public noUrut?,
    public kdDepartemen?,
    public kode?,
    public id?,
    public kdLokasiHead?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    ) { }

}




