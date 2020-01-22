import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokAset, SelectedItem } from './kelompok-aset.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-kelompok-aset',
  templateUrl: './kelompok-aset.component.html',
  // styleUrls: ['./kelompok-evaluasi.component.scss'],
  providers: [ConfirmationService]

})
export class kelompokasetComponent implements OnInit {
  selected: KelompokAset;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  MetodePenyusutan: SelectedItem[];
  listAset: SelectedItem[];
  kdAccount: SelectedItem[];
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  kdprof:any;
  kddept:any;
  codes: any[];
  laporan: boolean = false;
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
      'namaKelompokAset': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kdJenisAset': new FormControl('', Validators.required),
      'kdMetodePenyusutan': new FormControl(''),
      'kdAccount': new FormControl(''),
      'persenPenyusutan': new FormControl(''),
      'umurEkonomisThn': new FormControl('', Validators.required),
      'rumusPenyusutan': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),

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

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokaset/findAll?page=' + page + '&rows=' +rows).subscribe(table => {
      this.listData = table.KelompokAset;
      this.totalRecords = table.totalRow;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ChartOfAccount&select=namaAccount,id').subscribe(res => {
			this.kdAccount = [];
			this.kdAccount.push({ label: '--Pilih Kode Akuntansi--', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kdAccount.push({ label: res.data.data[i].namaAccount, value: res.data.data[i].id.kode })
			};
		});
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MetodePenyusutan&select=namaMetodePenyusutan,id').subscribe(res => {
      this.MetodePenyusutan = [];
      this.MetodePenyusutan.push({ label: '--Pilih Metode Penyusutan--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.MetodePenyusutan.push({ label: res.data.data[i].namaMetodePenyusutan, value: res.data.data[i].id.kode })
      }
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisAset&select=namaJenisAset,id').subscribe(res => {
      this.listAset = [];
      this.listAset.push({ label: '--Pilih Jenis Aset--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listAset.push({ label: res.data.data[i].namaJenisAset, value: res.data.data[i].id.kode })
      }
    });

  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokaset/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namakelompokaset&sort=desc&namakelompokaset=' + this.pencarian).subscribe(table => {
      this.listData = table.KelompokAset;
      this.totalRecords = table.totalRow;
    });
  }

  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Komponen&select=id.kode,namaKomponen').subscribe(table => {
      this.fileService.exportAsExcelFile(table.data.data, 'Komponen');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/kelompokAset/laporanKelompokAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Aset');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokaset/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();
  }



  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
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
    this.httpService.update(Configuration.get().dataMasterNew + '/kelompokaset/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/kelompokaset/save', this.form.value).subscribe(response => {
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
  clone(cloned: KelompokAset): KelompokAset {
    let hub = new InisialKelompokAset();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialKelompokAset();
    fixHub = {
      "kode": hub.kode.kode,
      "namaKelompokAset": hub.namaKelompokAset,
      "reportDisplay": hub.reportDisplay,
      "kdJenisAset": hub.kdJenisAset,
      "kdAccount": hub.kdAccount,
      "kdMetodePenyusutan": hub.kdMetodePenyusutan,
      "persenPenyusutan": hub.persenPenyusutan,
      "rumusPenyusutan": hub.rumusPenyusutan,
      "umurEkonomisThn": hub.umurEkonomisThn,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }

  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokAset/laporanKelompokAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelompokAset_laporanCetak');

    // let cetak = Configuration.get().report + '/kelompokAset/laporanKelompokAset.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}


}
class InisialKelompokAset implements KelompokAset {
  constructor(
    public kode?,
    public namaKelompokAset?,
    public reportDisplay?,
    public kdAccount?,
    public kdJenisAset?,
    public kdMetodePenyusutan?,
    public persenPenyusutan?,
    public rumusPenyusutan?,
    public umurEkonomisThn?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public id?,
    public version?
  )
  { }
}
