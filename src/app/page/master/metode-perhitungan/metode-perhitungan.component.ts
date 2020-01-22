import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { MetodePerhitungan } from './metode-perhitungan.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-metode-perhitungan',
  templateUrl: './metode-perhitungan.component.html',
  styleUrls: ['./metode-perhitungan.component.scss'],
  providers: [ConfirmationService]
})
export class MetodePerhitunganComponent implements OnInit {
  selected: MetodePerhitungan;
  listData: MetodePerhitungan[];
  listDataChild: MetodePerhitungan[];
  dataDummy: {};
  versi: any;
  listOperatorFactorRate: MetodePerhitungan[];
  listMetodeHitung: MetodePerhitungan[];
  pencarian: string = '';
  pencarianChild: string = '';
  formAktif: boolean;
  formAktifChild: boolean;
  form: FormGroup;
  formChild: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;
  totalRecordsChild: number;

  laporan: boolean = false;
  items: MenuItem[];
  toReport: any;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
  kdprof: any;
  kddept: any;
  codes:any;
  itemsChild: any;
  kdHead: any;
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
    this.versi = null;
    this.form = this.fb.group({
      'kdMetodeHitungHead': new FormControl(null),
      'namaMetodeHitung': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'factorRate': new FormControl(1),
      'operatorFactorRate': new FormControl('X'),
      'deskripsiDetailMetodeHitung': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true, Validators.required),

    });

    if (this.index == 0) {
      this.httpService.get(Configuration.get().dataMasterNew + '/metodeperhitungan/findAll?page=1&rows=300&dir=namaMetodeHitung&sort=desc').subscribe(table => {
        this.listTab = table.MetodePerhitungan;
        let i = this.listTab.length
        while (i--) {
          if (this.listTab[i].statusEnabled == false) {
            this.listTab.splice(i, 1);
          }
        }
      });
    };
    let dataIndex = {
      "index": this.index
    }
    this.onTabChange(dataIndex);
    this.listOperatorFactorRate = [];
    this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: '' });
    this.listOperatorFactorRate.push({ label: "+", value: '+' });
    this.listOperatorFactorRate.push({ label: "-", value: '-' });
    this.listOperatorFactorRate.push({ label: "X", value: 'X' });
    this.listOperatorFactorRate.push({ label: "/", value: '/' });


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

    this.itemsChild = [
      {
          label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
              this.downloadPdfChild();
          }
      },
      {
          label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
              this.downloadExcelChild();
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

  onTabChange(event) {
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.kdHead = data;
      this.form.get('kdMetodeHitungHead').setValue(data);
  } else {
      data = '';
      this.form.get('kdMetodeHitungHead').setValue(null);
  }
  this.pencarian = '';
  this.getPage(this.page,this.rows,this.pencarian, data);
  this.valuechange('');
  this.formAktif = true;
  }
  downloadExcel() {


  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/metodePerhitungan/laporanMetodePerhitungan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }

  tutupLaporan() {
    this.laporan = false;
  }


  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/metodePerhitungan/laporanMetodePerhitungan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMetodePerhitungan_laporanCetak');
//    this.report.showEmbedPDFReport(Configuration.get().report + "/MetodePerhitungan/listMetodePerhitungan.pdf?kdDepartemen=1", '#report-pdf-MetodePerhitungan', 400);
  }

  cetakChild(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/MetodePerhitunganChild/laporanMetodePerhitunganChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdMetodePerhitunganHead='+ this.kdHead +'&download=false', 'frmMetodePerhitungan_laporanCetak');
}

downloadPdfChild(){
    let b = Configuration.get().report + '/MetodePerhitunganChild/laporanMetodePerhitunganChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdMetodePerhitunganHead='+ this.kdHead +'&download=true';
    window.open(b);
}

downloadExcelChild(){

}


  getPage(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/metodeperhitungan/findAll?page=' + page + '&rows=' + rows + '&dir=namaMetodeHitung&sort=desc&namaMetodeHitung=' + search + '&kdMetodeHitungHead=' + head).subscribe(table => {
      this.listData = table.MetodePerhitungan;
      this.totalRecords = table.totalRow;

    });
  }
 
  cari() {
    let data = this.form.get('kdMetodeHitungHead').value;
    if (data == null) {
      this.getPage(this.page, this.rows, this.pencarian, '');
    } else {
      this.getPage(this.page, this.rows, this.pencarian, data);
    }
  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdMetodeHitungHead').value;
    if (data == null) {
      this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

setReportDisplay() {
        this.form.get('reportDisplay').setValue(this.form.get('namaMetodeHitung').value)
    }
  valuechange(newValue) {
    this.toReport = newValue;
    //this.report = newValue;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Metode Perhitungan');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/metodeperhitungan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/metodeperhitungan/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
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
  clone(cloned: MetodePerhitungan): MetodePerhitungan {
    let hub = new InisialMetodePerhitungan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialMetodePerhitungan();
    fixHub = {
      "kode": hub.kode.kode,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "kdMetodeHitungHead": hub.kdMetodeHitungHead,
      "namaMetodeHitung": hub.namaMetodeHitung,
      "factorRate": hub.factorRate,
      "operatorFactorRate": hub.operatorFactorRate,
      "deskripsiDetailMetodeHitung": hub.deskripsiDetailMetodeHitung,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/metodeperhitungan/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialMetodePerhitungan implements MetodePerhitungan {

  constructor(
    public id?,
    public kdMetodeHitungHead?,
    public kode?,
    public namaMetodeHitung?,
    public factorRate?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public operatorFactorRate?,
    public deskripsiDetailMetodeHitung?,
  ) { }

}
