import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
// import { RangeWaktuPinjamanComponent } from './range-waktupinjaman.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-range-waktupinjaman',
  templateUrl: './range-waktupinjaman.component.html',
  styleUrls: ['./range-waktupinjaman.component.scss'],
  providers: [ConfirmationService]
})
export class RangeWaktuPinjamanComponent implements OnInit {
  selected: any;
  listDataRange: any[];
  listDataJenisRange: any[];
  dataDummy: {};
  formRangeAktif: boolean;
  formJenisRangeAktif: boolean;
  pencarianJenisRange: string;
  pencarianRange: string;
  JenisRange: any[];
  SatuanStandar: any[];
  TypeDataObjek: any[];
  listOperatorFactorRate: any[];
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

  kdSatuanStandarHari: any;
  kdSatuanStandarBulan: any;
  kdSatuanStandarTahun: any;

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
      'reportDisplay': new FormControl(null)
    });
    this.formRange.get('noUrut').disable();
    this.pencarianRange = ''
    this.kdHead = null

    this.httpService.get(Configuration.get().dataMasterNew + '/jenisrange/findKdJenisRangeWaktuPinjaman').subscribe(res => {
      this.kdHead = res.Range.id.kode
      this.formRange.get('kdJenisRange').setValue(this.kdHead)
      this.pencarianRange = ''
      this.getRange(this.page, this.rows, this.pencarianRange, this.kdHead)
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/satuanstandar/findKdSatuanStandarHari').subscribe(res => {
      this.kdSatuanStandarHari = res.Range.id.kode
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/satuanstandar/findKdSatuanStandarBulan').subscribe(res => {
      this.kdSatuanStandarBulan = res.Range.id.kode
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/satuanstandar/findKdSatuanStandarTahun').subscribe(res => {
      this.kdSatuanStandarTahun = res.Range.id.kode
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
    

    this.listOperatorFactorRate = [];
    this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: null });
    this.listOperatorFactorRate.push({ label: "+", value: '+' });
    this.listOperatorFactorRate.push({ label: "-", value: '-' });
    this.listOperatorFactorRate.push({ label: "X", value: 'X' });
    this.listOperatorFactorRate.push({ label: "/", value: '/' });

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
    if ( head !== null){
      this.httpService.get(Configuration.get().dataMasterNew + '/range/findAll?page='+page+'&rows='+rows+'&dir=namaRange&sort=desc&namaRange='+search+'&kdJenisRange='+head).subscribe(table => {
        let data = table.Range
        let dataNew = []

        for (let i = 0; i<data.length; i++){
          let a = this.convertSatuanPasManggilData(data[i])
          dataNew.push(a)
        }

        this.listDataRange = dataNew;
        this.totalRecordsRange = table.totalRow;
        this.formRange.get('noUrut').setValue(this.totalRecordsRange+1);
      });
    }
  }

  cariRange() {
    let data = this.formRange.get('kdJenisRange').value;
    this.getRange(this.page,this.rows,this.pencarianRange, data);
  }

  loadPageRange(event: LazyLoadEvent) {
    let data = this.formRange.get('kdJenisRange').value;
    this.getRange((event.rows + event.first) / event.rows, event.rows, this.pencarianRange, data);
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

  updateRange() {
    if (this.formRange.get('rangeMax').value === undefined || this.formRange.get('rangeMax').value === null){
      this.formRange.get('rangeMax').setValue(null);
    }

    let dataForm = this.formRange.value
    let formSubmit = this.convertSatuanSebelumSimpan(dataForm)

    this.httpService.update(Configuration.get().dataMasterNew + '/range/update/' + this.versi, formSubmit).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.resetRange();
    });
  }


  convertSatuanSebelumSimpan(dataForm: any){
    let rangeMax
    let rangeMin
    let rmax = dataForm.rangeMax

    if (rmax == null){
      rangeMax = null
    }
    else {
      if (dataForm.kdSatuanStandar == this.kdSatuanStandarHari){
        rangeMax = dataForm.rangeMax 
      }
      else if (dataForm.kdSatuanStandar == this.kdSatuanStandarBulan){
        rangeMax = dataForm.rangeMax * 30
      }
      else if (dataForm.kdSatuanStandar == this.kdSatuanStandarTahun){
        rangeMax = dataForm.rangeMax * 365
      }
      else{
        rangeMax = dataForm.rangeMax
      }
    }

    if (dataForm.kdSatuanStandar == this.kdSatuanStandarHari){
      rangeMin = dataForm.rangeMin 
    }
    else if (dataForm.kdSatuanStandar == this.kdSatuanStandarBulan){
      rangeMin = dataForm.rangeMin * 30
    }
    else if (dataForm.kdSatuanStandar == this.kdSatuanStandarTahun){
      rangeMin = dataForm.rangeMin * 365
    }
    else{
      rangeMin = dataForm.rangeMin
    }

    let formSubmit = dataForm
    formSubmit.rangeMax = rangeMax
    formSubmit.rangeMin = rangeMin
    return formSubmit
  }

  convertSatuanPasManggilData(dataRow: any){ 
   let rangeMax
   let rangeMin
   let rmax = dataRow.rangeMax

   if (rmax === null){
    rangeMax = null
  }
  else {
    if (dataRow.kdSatuanStandar == this.kdSatuanStandarHari){
      rangeMax = dataRow.rangeMax 
    }
    else if (dataRow.kdSatuanStandar == this.kdSatuanStandarBulan){
      rangeMax = dataRow.rangeMax / 30
    }
    else if (dataRow.kdSatuanStandar == this.kdSatuanStandarTahun){
      rangeMax = dataRow.rangeMax / 365
    }
    else{
      rangeMax = dataRow.rangeMax
    }
  }

  if (dataRow.kdSatuanStandar == this.kdSatuanStandarHari){
    rangeMin = dataRow.rangeMin 
  }
  else if (dataRow.kdSatuanStandar == this.kdSatuanStandarBulan){
    rangeMin = dataRow.rangeMin / 30
  }
  else if (dataRow.kdSatuanStandar == this.kdSatuanStandarTahun){
    rangeMin = dataRow.rangeMin / 365
  }
  else{
    rangeMin = dataRow.rangeMin
  }

  let dataSelect = dataRow
  dataSelect.rangeMax = rangeMax
  dataSelect.rangeMin = rangeMin
  
  return dataSelect
}

  simpanRange() {
    if (this.formRangeAktif == false) {
      this.confirmUpdateRange()
    } else {
      this.formRange.get('noUrut').enable();
      if (this.formRange.get('rangeMax').value === undefined || this.formRange.get('rangeMax').value === null){
        this.formRange.get('rangeMax').setValue(null);
      }

      let dataForm = this.formRange.value
      let formSubmit = this.convertSatuanSebelumSimpan(dataForm)


      this.httpService.post(Configuration.get().dataMasterNew + '/range/save?', formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');        this.resetRange();
      });
    }

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

  cloneRange(hub: any) {

    let fixHub
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
  

  findSelectedIndexRange(): number {
    return this.listDataRange.indexOf(this.selected);
  }

  
  onDestroy() {

  }
}

