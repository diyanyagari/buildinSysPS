import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { UnitLaporan } from './unit-laporan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-unit-laporan',
  templateUrl: './unit-laporan.component.html',
  styleUrls: ['./unit-laporan.component.scss'],
  providers: [ConfirmationService]
})
export class UnitLaporanComponent implements OnInit {
  // item: UnitLaporan = new InisialUnitLaporan();;
  item: any;
  // selected: UnitLaporan;
  selected: any;
  listData: any[];
  dataDummy: {};
  kodeKelompokProduk: any[];
  kodeUnitLaporanHead: any[];
  listLevelTingkat: any[];
  formAktif: boolean;
  versi: any;
  page: number;
  rows: number;
  form: FormGroup;
  totalRecords: number;
  display: any;
  display2: any;
  pencarian: string = '';
  groupByX: any;
  groupByY: any;
  groupByZ: any;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
  kdprof:any;
  kddept:any;
  items: any;
  codes: any[];
  laporan: boolean = false;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


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
        label: 'Exel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExcel();
        }
      }];
    
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

    let data = {
      "deskripsiUnitLaporan": "string",
      "groupByX": "string",
      "groupByY": "string",
      "groupByZ": "string",
      "indicatorIconHigh": "string",
      "indicatorIconHighest": "string",
      "indicatorIconLow": "string",
      "indicatorIconLowest": "string",
      "indicatorIconNormal": "string",
      "kdDepartemen": "string",
      "kdKelompokProduk": 0,
      "kdLevelTingkat": 0,
      "kdUnitLaporanHead": 0,
      "keteranganLainnya": "string",
      "kode": 0,
      "kodeExternal": "string",
      "namaExternal": "string",
      "namaUnitLaporan": "string",
      "noRec": "string",
      "noUrut": 0,
      "queryLinkKeData": "string",
      "reportDisplay": "string",
      "statusEnabled": true,
      "version": 0
    }

    this.formAktif = true;
    this.form = this.fb.group({
      'namaUnitLaporan': new FormControl('', Validators.required),
      'groupByX' : new FormControl(''),
      'groupByY' : new FormControl(''),
      'groupByZ' : new FormControl(''),
      'kode': new FormControl(''),
      'kdLevelTingkat': new FormControl(null),
      'kdUnitLaporanHead': new FormControl(null),
      'kdKelompokProduk': new FormControl(null),
      'noUrut': new FormControl(null),
      'statusEnabled': new FormControl(true, Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl('')
    });
    this.form.get('noUrut').disable();

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokProduk&select=namaKelompokProduk,id').subscribe(res => {
      this.kodeKelompokProduk = [];
      this.kodeKelompokProduk.push({ label: '--Pilih Kelompok Produksi--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKelompokProduk.push({ label: res.data.data[i].namaKelompokProduk, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
      this.listLevelTingkat = [];
      this.listLevelTingkat.push({ label: '--Pilih Level Tingkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listLevelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
      };
    });
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/unitlaporan/findAll?page=1&rows=300&dir=namaUnitLaporan&sort=desc').subscribe(table => {
        this.listTab = table.UnitLaporan;
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
  }
  onTabChange(event) {
    this.formAktif = true;
    this.form = this.fb.group({
      'namaUnitLaporan': new FormControl('', Validators.required),
      'groupByX' : new FormControl(''),
      'groupByY' : new FormControl(''),
      'groupByZ' : new FormControl(''),
      'kode': new FormControl(''),
      'kdLevelTingkat': new FormControl(null),
      'kdUnitLaporanHead': new FormControl(null),
      'kdKelompokProduk': new FormControl(null),
      'noUrut': new FormControl(null),
      'statusEnabled': new FormControl(true, Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl('')
    });
    this.form.get('noUrut').disable();
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.form.get('kdUnitLaporanHead').setValue(data);
    } else {
      data = '';
      this.form.get('kdUnitLaporanHead').setValue(null);
    }
    this.pencarian = '';
    this.get(this.page,this.rows,this.pencarian, data);
    this.valuechange('');
  }
  get(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/unitlaporan/findAll?page='+page+'&rows='+rows+'&dir=namaUnitLaporan&sort=desc&namaUnitLaporan='+search+'&kdUnitLaporanHead='+head).subscribe(table => {
      this.listData = table.UnitLaporan;
      this.totalRecords = table.totalRow;
      this.form.get('noUrut').setValue(this.totalRecords+1);
    });
  }

  cari() {
    let data = this.form.get('kdUnitLaporanHead').value;
    if (data == null) {
      this.get(this.page,this.rows,this.pencarian, '');
    } else {
      this.get(this.page,this.rows,this.pencarian, data);
    }
  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdUnitLaporanHead').value;
    if (data == null) {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Unit laporan');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/unitlaporan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.form.get('noUrut').enable();
      this.httpService.post(Configuration.get().dataMasterNew + '/unitlaporan/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.reset();
      });
    }

  }

  reset() {
    this.formAktif = true;
    this.form.get('noUrut').disable();
    this.ngOnInit();
  }
  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    this.form.get('noUrut').enable();
  }
  clone(cloned: any) {
    let fixHub = {
      "kode": cloned.kode.kode,
      "kdKelompokProduk": cloned.kdKelompokProduk,
      "namaUnitLaporan": cloned.namaUnitLaporan,
      "kdLevelTingkat": cloned.kdLevelTingkat,
      "kdUnitLaporanHead": cloned.kdUnitLaporanHead,
      "noUrut": cloned.noUrut,
      "reportDisplay": cloned.reportDisplay,
      "kodeExternal": cloned.kodeExternal,
      "namaExternal": cloned.namaExternal,
      "statusEnabled": cloned.statusEnabled,
      "groupByX" : cloned.groupByX,
      "groupByY" : cloned.groupByY,
      "groupByZ" : cloned.groupByZ
    }
    this.versi = cloned.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/unitlaporan/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  setReportDisplay() {
    this.form.get('reportDisplay').setValue(this.form.get('namaUnitLaporan').value)
  }

  downloadExcel(){

  }

  downloadPdf(){
    let cetak = Configuration.get().report + '/unitLaporan/laporanUnitLaporan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
    window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/unitLaporan/laporanUnitLaporan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmUnitLaporan_laporanCetak');

    // let cetak = Configuration.get().report + '/unitLaporan/laporanUnitLaporan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }

}

class InisialUnitLaporan implements UnitLaporan {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public kdKelompokProduk?,
    public kdUnitLaporanHead?,
    public namaUnitLaporan?,
    public noUrut?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public kdLevelTingkat?,
    public version?
    ) { }

}	 
