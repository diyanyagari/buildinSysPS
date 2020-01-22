import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Range } from './range.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  providers: [ConfirmationService]
})
export class RangeComponent implements OnInit {
  selected: Range;
  listDataRange: any[];
  listDataJenisRange: any[];
  dataDummy: {};
  formRangeAktif: boolean;
  formJenisRangeAktif: boolean;
  pencarianJenisRange: string;
  pencarianRange: string;
  JenisRange: Range[];
  SatuanStandar: Range[];
  TypeDataObjek: Range[];
  listOperatorFactorRate: Range[];
  versi: any;
  formJenisRange: FormGroup;
  formRange: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecordsRange: number;
  totalRecordsJenisRange: number;
  report: any;
  toReport: any;
  listJenisRange: any[];
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
  toReportJenisRange: any;
  reportJenisRange: any;
  laporan: boolean = false;
  itemsChild: any;
  kdHead:any;
  kdprof: any;
  kddept: any;
  smbrFile:any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private authGuard: AuthGuard,
    private fileService: FileService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
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

    this.formRangeAktif = true;
    this.versi = null;
    this.formRange = this.fb.group({
      'kode': new FormControl(null),
      'namaExternal': new FormControl(null),
      'kodeExternal': new FormControl(null),
      'noUrut': new FormControl(null, Validators.required),
      'kdTypeDataObjek': new FormControl(null),
      'namaRange': new FormControl(null, Validators.required),
      'rangeMin': new FormControl(null, Validators.required),
      'rangeMax': new FormControl(null),
      'kdJenisRange': new FormControl(null, Validators.required),
      'kdSatuanStandar': new FormControl(null),
      'factorRate': new FormControl(1),
      'operatorFactorRate': new FormControl('X'),
      'statusEnabled': new FormControl(true, Validators.required),
    });
    this.formRange.get('noUrut').disable();

    this.formJenisRangeAktif = true;
    this.getJenisRange(this.page, this.rows, '');
    this.formJenisRange = this.fb.group({
      'kode': new FormControl(''),
      'namaJenisRange': new FormControl('', Validators.required),
      'kdJenisRangeHead': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl(true, Validators.required),
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisRange&select=namaJenisRange,id').subscribe(res => {
      this.JenisRange = [];
      this.JenisRange.push({ label: '--Pilih Jenis Range--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.JenisRange.push({ label: res.data.data[i].namaJenisRange, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanStandar&select=namaSatuanStandar,id').subscribe(res => {
      this.SatuanStandar = [];
      this.SatuanStandar.push({ label: '--Pilih Satuan Standar--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.SatuanStandar.push({ label: res.data.data[i].namaSatuanStandar, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAll?page=1&rows=10&dir=namaTypeDataObjek&sort=desc').subscribe(res => {
      this.TypeDataObjek = [];
      this.TypeDataObjek.push({ label: '--Pilih Type Data Objek--', value: null })
      for (var i = 0; i < res.TypeDataObjek.length; i++) {
        this.TypeDataObjek.push({ label: res.TypeDataObjek[i].namaTypeDataObjek, value: res.TypeDataObjek[i].kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisRange&select=namaJenisRange,id').subscribe(res => {
      this.listJenisRange = [];
      this.listJenisRange.push({ label: '--Pilih Data Parent Jenis Range--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisRange.push({ label: res.data.data[i].namaJenisRange, value: res.data.data[i].id.kode })
      };
    });

    this.listOperatorFactorRate = [];
    this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: null });
    this.listOperatorFactorRate.push({ label: "+", value: '+' });
    this.listOperatorFactorRate.push({ label: "-", value: '-' });
    this.listOperatorFactorRate.push({ label: "X", value: 'X' });
    this.listOperatorFactorRate.push({ label: "/", value: '/' });
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/jenisrange/findAll?page=1&rows=300&dir=namaJenisRange&sort=desc').subscribe(table => {
        this.listTab = table.JenisRange;
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
    this.getSmbrFile();

  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}


  onTabChange(event) {
    this.formRange = this.fb.group({
      'kode': new FormControl(null),
      'namaExternal': new FormControl(null),
      'kodeExternal': new FormControl(null),
      'noUrut': new FormControl(null, Validators.required),
      'kdTypeDataObjek': new FormControl(null),
      'namaRange': new FormControl(null, Validators.required),
      'rangeMin': new FormControl(null, Validators.required),
      'rangeMax': new FormControl(null),
      'kdJenisRange': new FormControl(null, Validators.required),
      'kdSatuanStandar': new FormControl(null),
      'factorRate': new FormControl(1),
      'operatorFactorRate': new FormControl('X'),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true, Validators.required),
    });
    this.formJenisRange = this.fb.group({
      'kode': new FormControl(''),
      'namaJenisRange': new FormControl('', Validators.required),
      'kdJenisRangeHead': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl(true, Validators.required),
    });
    this.formRange.get('noUrut').disable();
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.formRange.get('kdJenisRange').setValue(data);
      this.kdHead = data;
      this.pencarianRange = '';
      this.getRange(this.page,this.rows,this.pencarianRange, data);
    } else {
      this.pencarianJenisRange = '';
      this.formRange.get('kdJenisRange').setValue(null);
      this.getJenisRange(this.page,this.rows,this.pencarianJenisRange);
    }
  }
  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }
  valuechangeJenisRange(newValue){
    this.toReportJenisRange = newValue;
    this.reportJenisRange = newValue;
  }

  downloadExcel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=id.kode,namaRange').subscribe(table => {

    //   this.fileService.exportAsExcelFile(table.data.data, 'Range');
    // });

  }

  downloadPdf() {
    let b = Configuration.get().report + '/jenisRange/laporanJenisRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
    window.open(b);
    // var col = ["Kode Range", "Nama Range"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=id.kode,namaRange').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master Range", col, table.data.data, "Range");

    // });

  }

  cetak(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/jenisRange/laporanJenisRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmRange_laporanCetak');
  }

cetakChild(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/range/laporanRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&kdJenisRange='+ this.kdHead +'&gambarLogo=' + this.smbrFile +'&download=false', 'frmRange_laporanCetak');
}

downloadPdfChild(){
    let b = Configuration.get().report + '/range/laporanRange.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisRange='+ this.kdHead +'&download=true';
    window.open(b);
}

downloadExcelChild(){

}

  getRange(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/range/findAll?page='+page+'&rows='+rows+'&dir=namaRange&sort=desc&namaRange='+search+'&kdJenisRange='+head).subscribe(table => {
      this.listDataRange = table.Range;
      this.totalRecordsRange = table.totalRow;
      this.formRange.get('noUrut').setValue(this.totalRecordsRange+1);
    });
  }
  getJenisRange(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisrange/findAll?page='+page+'&rows='+rows+'&dir=namaJenisRange&sort=desc&namaJenisRange='+search).subscribe(table => {
      this.listDataJenisRange = table.JenisRange;
      this.totalRecordsJenisRange = table.totalRow;

    });
  }
  cariRange() {
    let data = this.formRange.get('kdJenisRange').value;
    this.getRange(this.page,this.rows,this.pencarianRange, data);
  }
  cariJenisRange() {
    this.getJenisRange(this.page,this.rows,this.pencarianJenisRange);
  }

  loadPageRange(event: LazyLoadEvent) {
    let data = this.formRange.get('kdJenisRange').value;
    this.getRange((event.rows + event.first) / event.rows, event.rows, this.pencarianRange, data);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }
  loadPageJenisRange(event: LazyLoadEvent) {
    this.getJenisRange((event.rows + event.first) / event.rows, event.rows, this.pencarianJenisRange);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  confirmDeleteRange() {
    let kode = this.formRange.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Range');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapusRange();
        },
        reject: () => {
          this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
        }
      });
    }
  }
  confirmDeleteJenisRange() {
    let kode = this.formJenisRange.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Range');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapusJenisRange();
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
  onSubmitRange() {
    if (this.formRange.invalid) {
      this.validateAllFormFields(this.formRange);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanRange();
    }
  }
  onSubmitJenisRange() {
    if (this.formJenisRange.invalid) {
      this.validateAllFormFields(this.formJenisRange);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpanJenisRange();
    }
  }
  confirmUpdateRange() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      accept: () => {
        this.updateRange();
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }
  confirmUpdateJenisRange() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      accept: () => {
        this.updateJenisRange();
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }
  updateRange() {
      if (this.formRange.get('rangeMax').value === undefined || this.formRange.get('rangeMax').value === null || this.formRange.get('rangeMax').value.trim() == ''){
        this.formRange.get('rangeMax').setValue(null);
      }
    this.httpService.update(Configuration.get().dataMasterNew + '/range/update/' + this.versi, this.formRange.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.resetRange();
    });
  }
  updateJenisRange() {
    this.httpService.update(Configuration.get().dataMasterNew + '/jenisrange/update/' + this.versi, this.formJenisRange.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getJenisRange(this.page, this.rows, this.pencarianJenisRange);
      this.resetJenisRange();
    });
  }

  simpanRange() {
    if (this.formRangeAktif == false) {
      this.confirmUpdateRange()
    } else {
      this.formRange.get('noUrut').enable();
      if (this.formRange.get('rangeMax').value === undefined || this.formRange.get('rangeMax').value === null || this.formRange.get('rangeMax').value.trim() == ''){
        this.formRange.get('rangeMax').setValue(null);
      }
      this.httpService.post(Configuration.get().dataMasterNew + '/range/save?', this.formRange.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');        this.resetRange();
      });
    }

  }
  simpanJenisRange() {
    if (this.formJenisRangeAktif == false) {
      this.confirmUpdateJenisRange()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/jenisrange/save?', this.formJenisRange.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.resetJenisRange();
      });
    }
  }

  resetJenisRange() {
    this.formJenisRangeAktif = true;
    this.ngOnInit();
  }

  onRowSelectJenisRange(event) {
    let cloned = this.cloneJenisRange(event.data);
    this.formJenisRangeAktif = false;
    this.formJenisRange.setValue(cloned);
  }

  cloneJenisRange(cloned: any) {
   
    let fixHub = {
      'kode': cloned.kode.kode,
      'namaJenisRange': cloned.namaJenisRange,
      'kdJenisRangeHead': cloned.kdJenisRangeHead,

      'reportDisplay': cloned.reportDisplay,
      'namaExternal': cloned.namaExternal,
      'kodeExternal': cloned.kodeExternal,
      'statusEnabled': cloned.statusEnabled
    }
    this.versi = cloned.version;
    return fixHub;
  }

  resetRange() {
    this.formRangeAktif = true;
    this.formRange.get('noUrut').disable();
    this.ngOnInit();
  }
  onRowSelectRange(event) {
    let cloned = this.cloneRange(event.data);
    this.formRangeAktif = false;
    this.formRange.setValue(cloned);
    this.formRange.get('noUrut').enable();
  }

  cloneRange(cloned: Range): Range {
    let hub = new InisialRange();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialRange();
    fixHub = {
      "kode": hub.kode.kode,
      "namaRange": hub.namaRange,
      "rangeMin": hub.rangeMin,
      "rangeMax": hub.rangeMax,
      "kdJenisRange": hub.kdJenisRange,
      "kdSatuanStandar": hub.kdSatuanStandar,
      "factorRate": hub.factorRate,
      "operatorFactorRate": hub.operatorFactorRate,
      "noUrut": hub.noUrut,
      "kdTypeDataObjek": hub.kdTypeDataObjek,
       "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }
  hapusRange() {
    let item = [...this.listDataRange];
    let deleteItem = item[this.findSelectedIndexRange()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/range/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
    this.resetRange();
    });


  }
  hapusJenisRange() {
    let item = [...this.listDataJenisRange];
    let deleteItem = item[this.findSelectedIndexJenisRange()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenisrange/del/' + deleteItem.kode.kode).subscribe(response => {
      this.getJenisRange(this.page, this.rows, this.pencarianJenisRange);
      this.resetJenisRange();
    });

  }

  findSelectedIndexRange(): number {
    return this.listDataRange.indexOf(this.selected);
  }

  findSelectedIndexJenisRange(): number {
    return this.listDataJenisRange.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialRange implements Range {

  constructor(
    public kdTypeDataObjek?,
    public id?,
    public rangeMin?,
    public rangeMax?,
    public kdJenisRange?,
    public kdSatuanStandar?,
    public factorRate?,
    public operatorFactorRate?,

    public kode?,
    public kodeExternal?,
    public namaExternal?,
    public namaRange?,
    public noCounter?,
    public noRange?,
    public prefixNoAntrian?,
    public reportDisplay?,
    public statusEnabled?,
    public noUrut?,
    public version?,
    public website?,
  ) { }
}

