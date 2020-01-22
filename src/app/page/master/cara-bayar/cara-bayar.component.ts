import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { CaraBayar } from './cara-bayar.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-cara-bayar',
  templateUrl: './cara-bayar.component.html',
  styleUrls: ['./cara-bayar.component.scss'],
  providers: [ConfirmationService]
})
export class CaraBayarComponent implements OnInit {

  selected: CaraBayar;
  listData: CaraBayar[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  // items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
  kdprof:any;
  kddept:any;
  items: MenuItem[];
  codes: CaraBayar[];
  laporan: boolean = false;
  itemsChild: any;
  kdHead:any;
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
    console.log(this.kdprof);
    console.log(this.kddept);
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaCaraBayar': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kdCaraBayarHead': new FormControl(null),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl(true, Validators.required),
    });
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/carabayar/findAll?page=1&rows=300&dir=namaCaraBayar&sort=desc').subscribe(table => {
        this.listTab = table.CaraBayar;
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


  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  downloadPdf() {

    let cetak = Configuration.get().report + '/caraBayar/laporanCaraBayar.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }

  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/carabayar/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaCaraBayar&sort=desc').subscribe(table => {
      this.listData = table.CaraBayar;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaCaraBayar: this.listData[i].namaCaraBayar,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
      }

      this.fileService.exportAsExcelFile(this.codes, 'CaraBayar');
    });

  }


  onTabChange(event) {
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.kdHead = data;
      this.form.get('kdCaraBayarHead').setValue(data);
    } else {
      data = '';
      this.form.get('kdCaraBayarHead').setValue(null);
    }
    this.pencarian = '';
    this.get(this.page,this.rows,this.pencarian, data);
    this.valuechange('');
    this.formAktif = true;
  }
  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  get(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/carabayar/findAll?page='+page+'&rows='+rows+'&dir=namaCaraBayar&sort=desc&namaCaraBayar='+search+'&kdCarabayarHead='+head).subscribe(table => {
      this.listData = table.CaraBayar;
      this.totalRecords = table.totalRow;
    });
  }
  
  cari() {
    let data = this.form.get('kdCaraBayarHead').value;
    if (data == null) {
      this.get(this.page,this.rows,this.pencarian, '');
    } else {
      this.get(this.page,this.rows,this.pencarian, data);
    }
    
  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdCaraBayarHead').value;
    if (data == null) {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Cara Bayar');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/carabayar/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/carabayar/save?', this.form.value).subscribe(response => {
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

  clone(cloned: CaraBayar): CaraBayar {
    let hub = new InisialCaraBayar();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialCaraBayar();
    fixHub = {
      'kode': hub.kode.kode,
      'namaCaraBayar': hub.namaCaraBayar,
      'kdCaraBayarHead': hub.kdCaraBayarHead,
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/carabayar/del/' + deleteItem.kode.kode).subscribe(response => {
      this.reset();
    });
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  cetak() {
    this.laporan = true;
    let pathFile;
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
            this.print.showEmbedPDFReport(Configuration.get().report + '/caraBayar/laporanCaraBayar.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmCaraBayar_laporanCetak');
        });
    // let cetak = Configuration.get().report + '/caraBayar/laporanCaraBayar.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }

  cetakChild(){
    this.laporan = true;
    let pathFile;
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
        this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        this.print.showEmbedPDFReport(Configuration.get().report + '/caraBayarChild/laporanCaraBayarChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdCaraBayarHead='+ this.kdHead +'&download=false', 'frmCaraBayar_laporanCetak');
    });
  }

downloadPdfChild(){
    let b = Configuration.get().report + '/caraBayarChild/laporanCaraBayarChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdCaraBayarHead='+ this.kdHead +'&download=true';
    window.open(b);
}

downloadExcelChild(){

}





  tutupLaporan() {
    this.laporan = false;
}
}

class InisialCaraBayar implements CaraBayar {

  constructor(

      public namaCaraBayar?,
      // public kdDepartemen?,
      public kode?,
      public id?,
      public kdProfile?,
      public version?,
      public reportDisplay?,
      public kodeExternal?,
      public namaExternal?,
      public statusEnabled?,
      public kdCaraBayarHead?
      ) { }

}