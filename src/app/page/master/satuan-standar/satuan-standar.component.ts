import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { SatuanStandar } from './satuan-standar.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-satuan-standar',
  templateUrl: './satuan-standar.component.html',
  styleUrls: ['./satuan-standar.component.scss'],
  providers: [ConfirmationService]
})
export class SatuanStandarComponent implements OnInit {
selected: SatuanStandar;
  listData: SatuanStandar[];
  dataDummy: {};
  versi: any;
  listKelompokProduk: SatuanStandar[];
  listSatuanStandar: SatuanStandar[];
  pencarian: string = '';
  formAktif: boolean;
  form: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;

  laporan: boolean = false;
  items: MenuItem[];
  display: any;
  display2: any;
  codes:any;
  kdprof:any;
  kddept:any;
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
    
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.getPage(this.page, this.rows, '');
    this.versi = null;
    this.form = this.fb.group({
      'kdSatuanStandarHead': new FormControl(null),
      'namaSatuanStandar': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'kdKelompokProduk': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),

    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanStandar&select=namaSatuanStandar,id').subscribe(res => {
      this.listSatuanStandar = [];
      this.listSatuanStandar.push({ label: '--Pilih Data Parent Satuan Aset--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listSatuanStandar.push({ label: res.data.data[i].namaSatuanStandar, value: res.data.data[i].id.kode })
      };
    });
     this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokProduk&select=namaKelompokProduk,id').subscribe(res => {
      this.listKelompokProduk = [];
      this.listKelompokProduk.push({ label: '--Pilih Kelompok Produk--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKelompokProduk.push({ label: res.data.data[i].namaKelompokProduk, value: res.data.data[i].id.kode })
      };
    });



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


    
    
    this.getSmbrFile();
  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  downloadExcel() {


  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/satuanStandar/laporanSatuanStandar.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }

  tutupLaporan() {
    this.laporan = false;
  }


  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/satuanStandar/laporanSatuanStandar.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmSatuanStandar_laporanCetak');

    // let cetak = Configuration.get().report + '/satuanStandar/laporanSatuanStandar.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
    // this.laporan = true;
    // this.report.showEmbedPDFReport(Configuration.get().report + "/SatuanStandar/listSatuanStandar.pdf?kdDepartemen=1", '#report-pdf-SatuanStandar', 400);
  }

  cari() {

    this.httpService.get(Configuration.get().dataMasterNew + '/satuanstandar/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaSatuanStandar&sort=desc&namaSatuanStandar=' + this.pencarian).subscribe(table => {
      this.listData = table.SatuanStandar;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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


  getPage(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/satuanstandar/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.SatuanStandar;
      this.totalRecords = table.totalRow;
    });
  }

  valuechange(newvalue) {
    this.display = newvalue;
    this.display2 = newvalue;
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


  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Satuan Aset');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/satuanstandar/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getPage(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/satuanstandar/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.getPage(this.page, this.rows, this.pencarian);
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
  clone(cloned: SatuanStandar): SatuanStandar {
    let hub = new InisialSatuanStandar();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialSatuanStandar();
    fixHub = {
      "kode": hub.kode.kode,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "namaSatuanStandar": hub.namaSatuanStandar,
      "kdKelompokProduk": hub.kdKelompokProduk,
      "kdSatuanStandarHead": hub.kdSatuanStandarHead,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/satuanstandar/del/' + deleteItem.kode.kode).subscribe(response => {
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
}

class InisialSatuanStandar implements SatuanStandar {

  constructor(
    public id?,
    public kdKelompokProduk?,
    public kode?,
    public namaSatuanStandar?,
    public kdSatuanStandarHead?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public qtyHariSatuSiklus?,
  ) { }

}