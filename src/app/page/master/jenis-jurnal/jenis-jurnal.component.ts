import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisJurnal } from './jenis-jurnal.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-jenis-jurnal',
  templateUrl: './jenis-jurnal.component.html',
  styleUrls: ['./jenis-jurnal.component.scss'],
  providers: [ConfirmationService]

})
export class JenisJurnalComponent implements OnInit {

  selected: JenisJurnal;
  listData: any[];
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
  FilterJenisJurnal: string;

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
    this.FilterJenisJurnal = '';
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian, this.FilterJenisJurnal);
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaJenisJurnal': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required)
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
    this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}


  get(page: number, rows: number, search: any, filter: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisjurnal/findAll?page=' + page + '&rows=' + rows + '&kdNegara=' + filter +'&dir=namaJenisJurnal&sort=desc&namaJenisJurnal='+ search).subscribe(table => {
      this.listData = table.JenisJurnal;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterJenisJurnal);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisjurnal/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisJurnal&sort=desc&namaJenisJurnal=' + this.pencarian).subscribe(table => {
      this.listData = table.JenisJurnal;
    });
  }
  valuechange(newValue) {
    //	this.toReport = newValue;
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisjurnal/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaJenisJurnal&sort=desc').subscribe(table => {
      this.listData = table.JenisJurnal;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaJenisJurnal: this.listData[i].namaJenisJurnal,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled
          })
      }

      this.fileService.exportAsExcelFile(this.codes, 'Jenis Jurnal');
    });
  }

  downloadPdf() {
    // let cetak = Configuration.get().report + '/hari/laporanHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    // window.open(cetak);
    var col = ["Kode", "Nama Jenis Jurnal",  "Report Display", "Kode External", "Nama Eksternal", "Status Aktif"];
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisjurnal/findAll?').subscribe(table => {
      this.listData = table.JenisJurnal;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaJenisJurnal: this.listData[i].namaJenisJurnal,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled
          })
      }
      this.fileService.exportAsPdfFile("Master Jenis Jrunal", col, this.codes, "Jenis Jurnal");
    });
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Infeksi Nosokomial');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenisjurnal/del/' + deleteItem.kode.kode).subscribe(response => {
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
    this.httpService.update(Configuration.get().dataMasterNew + '/jenisjurnal/update', this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/jenisjurnal/save', this.form.value).subscribe(response => {
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

  clone(cloned: JenisJurnal): JenisJurnal {
    let hub = new InisialJenisJurnal();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialJenisJurnal();
    fixHub = {
      "kode": hub.kode.kode,
      "namaJenisJurnal": hub.namaJenisJurnal,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,
    }
    this.versi = hub.version;
    return fixHub;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/hari/laporanHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmHari_laporanCetak');
  }
  tutupLaporan() {
    this.laporan = false;
  }
}

class InisialJenisJurnal implements JenisJurnal {
  constructor(
    public namaJenisJurnal?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public id?,
    public version?,
    public kode?,
    )
  { }
}