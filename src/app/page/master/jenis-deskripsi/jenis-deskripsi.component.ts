import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisDeskripsi } from './jenis-deskripsi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-jenis-deskripsi',
  templateUrl: './jenis-deskripsi.component.html',
  styleUrls: ['./jenis-deskripsi.component.scss'],
   providers: [ConfirmationService]
})
export class JenisDeskripsiComponent implements OnInit {
  listJenisDeskripsi: any[];
  selected: JenisDeskripsi;
  listData: JenisDeskripsi[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  codes:any[];
  kdprof: any;
  kddept: any;
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
      'namaJenisDeskripsi': new FormControl('', Validators.required),
      'noUrut': new FormControl(''),
      'kdJenisDeskripsiHead': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.form.get('noUrut').disable();

    this.getSmbrFile();

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

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisdeskripsi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.JenisDeskripsi;
      this.totalRecords = table.totalRow;
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisDeskripsi&select=namaJenisDeskripsi,id').subscribe(res => {
      this.listJenisDeskripsi = [];
      this.listJenisDeskripsi.push({ label: '--Pilih Data Parent Jenis Deskripsi--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisDeskripsi.push({ label: res.data.data[i].namaJenisDeskripsi, value: res.data.data[i].id.kode })
      };
    });


  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisdeskripsi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisDeskripsi&sort=desc&namaJenisDeskripsi=' + this.pencarian).subscribe(table => {
      this.listData = table.JenisDeskripsi;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Deskripsi');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/jenisdeskripsi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let noUrut = this.totalRecords + 1
      this.form.get('noUrut').enable();
      this.form.get('noUrut').setValue(noUrut);
      this.httpService.post(Configuration.get().dataMasterNew + '/jenisdeskripsi/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }

  reset() {
    this.form.get('noUrut').disable();
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    this.form.get('noUrut').enable();
  }

  clone(cloned: JenisDeskripsi): JenisDeskripsi {
    let hub = new InisialJenisDeskripsi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialJenisDeskripsi();
    fixHub = {
      'kode': hub.kode.kode,
      'namaJenisDeskripsi': hub.namaJenisDeskripsi,
      'kdJenisDeskripsiHead': hub.kdJenisDeskripsiHead,
      'noUrut': hub.noUrut,
      'reportDisplay': hub.reportDisplay,
      'namaExternal': hub.namaExternal,
      'kodeExternal': hub.kdExternal,
      'statusEnabled': hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenisdeskripsi/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  downloadExcel(){
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisdeskripsi/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaJenisDeskripsi&sort=desc').subscribe(table => {
      this.listData = table.JenisDeskripsi;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaJenisDeskripsiHead: this.listData[i].namaJenisDeskripsiHead,
            namaJenisDeskripsi: this.listData[i].namaJenisDeskripsi,
            noUrut: this.listData[i].noUrut,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
      }

      this.fileService.exportAsExcelFile(this.codes, 'JenisDeskripsi');
    });
  }

  downloadPdf(){
    let cetak = Configuration.get().report + '/jenisDeskripsi/laporanJenisDeskripsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/jenisDeskripsi/laporanJenisDeskripsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisDeskripsi_laporanCetak');

    // let cetak = Configuration.get().report + '/jenisDeskripsi/laporanJenisDeskripsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }


}

class InisialJenisDeskripsi implements JenisDeskripsi {

  constructor(
    public noUrut?,
    public persenHargaCito?,
    public kdJenisDeskripsiHead?,
    public namaJenisDeskripsi?,
    // public kdDepartemen?,
    public kdExternal?,

    public kode?,
    public id?,
    public kdProfile?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
  ) { }

}


