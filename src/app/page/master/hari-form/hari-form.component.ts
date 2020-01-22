import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Hari } from './hari-form.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-hari-form',
  templateUrl: './hari-form.component.html',
  styleUrls: ['./hari-form.component.scss'],
  providers: [ConfirmationService]

})
export class HariFormComponent implements OnInit {

  item: Hari = new InisialHari();
  selected: Hari;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  toReport: any;
  totalRecords: number;
  page: number;
  rows: number;
  codes: any[];
  kdprof:any;
  kddept:any;
  laporan: boolean = false;
  smbrFile:any;
  Negara: any[];
  FilterNegara: string;

  constructor(
    private alertService: AlertService,
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
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.pencarian = '';
    this.FilterNegara = '';
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaHari': new FormControl('', Validators.required),
      'noUrutHariKe': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'formatAngka': new FormControl(''),
      'formatAngkaRomawi': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
      'kdNegara':  new FormControl('', Validators.required)
    });
    this.items = [
    {
      label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        this.downloadPdf();
      }
    },
    {
      label: 'Exel', icon: 'fa-file-excel-o', command: () => {
        this.downloadExel();
      }
    }];
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
    this.httpService.get(Configuration.get().dataMasterNew + '/hari/findAll?page=' + page + '&rows=' + rows + '&kdNegara=' + filter +'&dir=namaHari&sort=desc&namaHari='+ search).subscribe(table => {
      this.listData = table.Hari;
      this.totalRecords = table.totalRow;

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

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/hari/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaHari&sort=desc&namaHari=' + this.pencarian+'&kdNegara=' + this.FilterNegara).subscribe(table => {
      this.listData = table.Hari;
    });
  }

  valuechange(newValue) {
    //	this.toReport = newValue;
    this.report = newValue;
  }

  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/hari/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaHari&sort=desc').subscribe(table => {
      this.listData = table.Hari;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({
            kode: this.listData[i].kode.kode,
            namaHari: this.listData[i].namaHari,
            noUrutHariKe: this.listData[i].noUrutHariKe,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
      }
      this.fileService.exportAsExcelFile(this.codes, 'Hari');
    });
  }

  downloadPdf() {
    // let cetak = Configuration.get().report + '/hari/laporanHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    // window.open(cetak);
    var col = ["Kode", "Nama",  "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama Eksternal", "Status Aktif"];
    this.httpService.get(Configuration.get().dataMasterNew + '/hari/findAll?').subscribe(table => {
      this.listData = table.Hari;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({
            kode: this.listData[i].kode.kode,
            namaHari: this.listData[i].namaHari,
            noUrutHariKe: this.listData[i].noUrutHariKe,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled
          })
        }
      this.fileService.exportAsPdfFile("Master Hari", col, this.codes, "Hari");
    });
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Hari');
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

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/hari/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
      // this.get(this.page, this.rows, this.pencarian);
    });
    
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.ngOnInit();
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
    this.httpService.update(Configuration.get().dataMasterNew + '/hari/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/hari/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);
        this.reset();
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

  onRowSelect(event) {
    this.formAktif = false;
    let cloned = this.clone(event.data);
    this.form.setValue(cloned);
  }

  clone(cloned: Hari): Hari {
    let hub = new InisialHari();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialHari();
    fixHub = {
      "kode": hub.kode.kode,
      "namaHari": hub.namaHari,
      "noUrutHariKe": hub.noUrutHariKe,
      "reportDisplay": hub.reportDisplay,
      "formatAngka": hub.formatAngka,
      "formatAngkaRomawi": hub.formatAngkaRomawi,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,
      "kdNegara": hub.kode.kdNegara
    }
    this.versi = hub.version;
    return fixHub;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/hari/laporanHari.pdf?gambarLogo=' + this.smbrFile +'&download=true', 'frmHari_laporanCetak');
    // this.print.showEmbedPDFReport(Configuration.get().dataMasterNew + '/hari/findAll?', 'frmHari_laporanCetak'+'&download=false');
    // let cetak = Configuration.get().report + '/hari/laporanHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
}
tutupLaporan() {
  this.laporan = false;
}

}
class InisialHari implements Hari {
  constructor(
    public kode?,
    public namaHari?,
    public noUrutHariKe?,
    public reportDisplay?,
    public kodeExternal?,
    public formatAngka?,
    public formatAngkaRomawi?,
    public namaExternal?,
    public statusEnabled?,
    public id?,
    public version?,
    public kdNegara?
    )
  { }
}
