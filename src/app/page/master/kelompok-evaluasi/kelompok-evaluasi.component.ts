import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokEvaluasi, SelectedItem } from './kelompok-evaluasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-kelompok-evaluasi',
  templateUrl: './kelompok-evaluasi.component.html',
  // styleUrls: ['./kelompok-evaluasi.component.scss'],
  providers: [ConfirmationService]

})
export class KelompokEvaluasiComponent implements OnInit {
  selected: KelompokEvaluasi;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  listKelompokEvaluasi: SelectedItem[];
  listPendidikan: SelectedItem[];
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  codes:any;
	laporan: boolean = false;
	kdprof: any;
  kddept: any;
  smbrFile:any;

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService
  ) { }

  ngOnInit() {

        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;
        
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaKelompokEvaluasi': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kdKelompokEvaluasiHead': new FormControl(null),
      'kdPendidikan': new FormControl(null),
      'descPengalaman': new FormControl(''),
      'descPelatihan': new FormControl(''),
      'noUrut': new FormControl(null),
      'keteranganLainnya': new FormControl(''),

      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),

    });
    this.form.get('noUrut').disable();
    
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
  
  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokevaluasi/findAll?page=' + page + '&rows=' +rows + '&dir=namaKelompokEvaluasi&sort=desc').subscribe(table => {
      this.listData = table.KelompokEvaluasi;
      this.totalRecords = table.totalRow;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokEvaluasi&select=namaKelompokEvaluasi,id').subscribe(res => {
      this.listKelompokEvaluasi = [];
      this.listKelompokEvaluasi.push({ label: '--Pilih Data Parent Kelompok Evaluasi--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKelompokEvaluasi.push({ label: res.data.data[i].namaKelompokEvaluasi, value: res.data.data[i].id.kode })
      }

    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pendidikan&select=namaPendidikan,id').subscribe(res => {
      this.listPendidikan = [];
      this.listPendidikan.push({ label: '--Pilih Pendidikan--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listPendidikan.push({ label: res.data.data[i].namaPendidikan, value: res.data.data[i].id.kode })
      }
    });

  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokevaluasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokEvaluasi&sort=desc&namaKelompokEvaluasi=' + this.pencarian).subscribe(table => {
      this.listData = table.KelompokEvaluasi;
    });
  }

  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Komponen&select=id.kode,namaKomponen').subscribe(table => {
      this.fileService.exportAsExcelFile(table.data.data, 'Komponen');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/kelompokEvaluasi/laporanKelompokEvaluasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama Komponen"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Komponen&select=id.kode,namaKomponen').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master Komponen", col, table.data.data, "Komponen");

    // });

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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Evaluasi');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokevaluasi/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();
  }



  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.form.get('noUrut').disable();
    this.formAktif = true;
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
    this.httpService.update(Configuration.get().dataMasterNew + '/kelompokevaluasi/update/' + this.versi, this.form.value).subscribe(response => {
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

      this.httpService.post(Configuration.get().dataMasterNew + '/kelompokevaluasi/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
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
    this.form.get('noUrut').enable();
  }
  clone(cloned: KelompokEvaluasi): KelompokEvaluasi {
    let hub = new InisialKelompokEvaluasi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialKelompokEvaluasi();
    fixHub = {
      "kode": hub.kode.kode,
      "namaKelompokEvaluasi": hub.namaKelompokEvaluasi,
      "reportDisplay": hub.reportDisplay,
      "kdKelompokEvaluasiHead": hub.kdKelompokEvaluasiHead,
      "kdPendidikan": hub.kdPendidikan,
      "descPengalaman": hub.descPengalaman,
      "descPelatihan": hub.descPelatihan,
      "noUrut": hub.noUrut,
      "keteranganLainnya": hub.keteranganLainnya,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }

  cetak(){
		this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokEvaluasi/laporanKelompokEvaluasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelompokEvaluasi_laporanCetak');
	}
	tutupLaporan() {
        this.laporan = false;
    }


}
class InisialKelompokEvaluasi implements KelompokEvaluasi {
  constructor(
    public kode?,
    public namaKelompokEvaluasi?,
    public reportDisplay?,
    public kdKelompokEvaluasiHead?,
    public kdPendidikan?,
    public descPengalaman?,
    public descPelatihan?,
    public noUrut?,
    public keteranganLainnya?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public id?,
    public version?
  )
  { }
}
