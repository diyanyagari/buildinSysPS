import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-fasilitas-bed',
  templateUrl: 'fasilitas-bed.component.html',
  styleUrls: ['fasilitas-bed.component.scss'],
  providers: [ConfirmationService]
})
export class FasilitasBedComponent implements OnInit {
  item: any[];
  selected: any;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  formAktif: boolean;
  items: MenuItem[];
  pencarian: string;
  report: any;
  toReport: any;
  totalRecords: number;
  page: number;
  rows: number;
  codes: any[];
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  dropdownRuangan: any;
  dropdownKamar: any;
  dropdownFasilitasDetail: any;
  dropdownKelasKamar: any;
  dropdownBed: any;
  dropdownStatusBed: any;
  listFasilitasDetail: any[];

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
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian);
    this.form = this.fb.group({
      'kdRuangan': new FormControl(null,Validators.required),
      'kdKamar': new FormControl('', Validators.required),
      'kdFasilitasDetail': new FormControl('', Validators.required),
      'kdKelasKamar': new FormControl(null, Validators.required),
      'kdBed': new FormControl(null, Validators.required),
      'kdStatusBed': new FormControl(null, Validators.required),
      'statusEnabled': new FormControl(true, Validators.required)
    });
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Excel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExel();
        }
      }
    ];
    this.getDropdown();
    
  }
  //get data dropdown
  getDropdown() {    
    console.log('tes')
    this.dropdownKelasKamar = [];
    this.dropdownKelasKamar.push({ label: '--Pilih Dulu Ruangan--', value: '' })
    this.dropdownKamar = [];
    this.dropdownKamar.push({ label: '--Pilih Dulu Ruangan dan Kelas--', value: '' })
    this.dropdownBed = [];
    this.dropdownBed.push({ label: '--Pilih Dulu No/Nama kamar--', value: '' })
    this.dropdownFasilitasDetail = [];
    this.dropdownFasilitasDetail.push({ label: '--Pilih Dulu No/Nama kamar--', value: '' })
    //Dropdown Ruangan
    this.httpService.get(Configuration.get().dataMaster + '/fasilitasdetail/getRuangan').subscribe(res => {
      this.dropdownRuangan = [];
      this.dropdownRuangan.push({ label: '--Pilih Ruangan--', value: '' })
      for (var i = 0; i < res.Ruangan.length; i++) {
        this.dropdownRuangan.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kdRuangan })
      };
    });    
    //Dropdown Status Bed
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetailtt/findStatusBed').subscribe(res => {
      this.dropdownStatusBed = [];
      this.dropdownStatusBed.push({ label: '--Pilih Status Bed--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.dropdownStatusBed.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].kode })
      };
    });
  }
  //Dropdown Kelas Kamar
  getKelasByRuangan(kdRuangan,callback){
    this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantokelas/findByKdRuangan/'+kdRuangan).subscribe(res => {
      this.dropdownKelasKamar = [];
      this.dropdownKelasKamar.push({ label: '--Pilih Kelas--', value: '' })
      for (var i = 0; i < res.MapRuanganToKelas.length; i++) {
        this.dropdownKelasKamar.push({ label: res.MapRuanganToKelas[i].namaKelas, value: res.MapRuanganToKelas[i].kode.kdKelas })
        if(callback == res.MapRuanganToKelas[i].kode.kdKelas){
          this.form.get('kdKelasKamar').setValue(res.MapRuanganToKelas[i].kode.kdKelas);
        }
      };
    });
   }
  //get dropdown fasilitas detail berdasarkan kdRuangan dan kdKelas
  getFasilitasDetail(kdRuangan,kdKelas, callback){
    //Dropdown Fasilitas Detail
    if(kdRuangan != null && kdKelas != null){
      this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetailtt/getFasilitasDetail/'+kdRuangan+'/'+kdKelas).subscribe(res => {
        this.listFasilitasDetail = res.data;
        this.dropdownKamar = [];
        this.dropdownKamar.push({ label: '--Pilih No/Nama kamar--', value: '' })
        this.dropdownBed = [];
        this.dropdownBed.push({ label: '--Pilih Dulu No/Nama kamar--', value: '' })
        this.dropdownFasilitasDetail = [];
        this.dropdownFasilitasDetail.push({ label: '--Pilih Dulu No/Nama kamar--', value: '' })
        for (var i = 0; i < res.data.length; i++) {
          this.dropdownKamar.push({label: res.data[i].naNoFasilitasDetail, value: res.data[i].kode.kode});
          if(callback != ''){
            if(callback.kdKamar == res.data[i].kode.kode){
              this.form.get('kdKamar').setValue(res.data[i].kode.kode);
            }
            this.dropdownBed = [];
            this.dropdownFasilitasDetail = [];
            for (var i = 0; i < this.listFasilitasDetail.length; i++) {
              if(this.listFasilitasDetail[i].kode.kode == callback.kdFasilitasDetail){
                this.dropdownFasilitasDetail.push({label: this.listFasilitasDetail[i].deskripsiFasilitasDetail, value: this.listFasilitasDetail[i].kode.kode})
                for (var x = 1; x <= this.listFasilitasDetail[i].qtyBed; x++) {
                  if(x < 10){
                    this.dropdownBed.push({label: '0' + x.toString(), value:'0' + x.toString()});
                  }else{
                     this.dropdownBed.push({label: x.toString(), value: x.toString()});
                  }
                }
                for (var a = 0; a < this.dropdownBed.length; a++) {
                  if(callback.kdBed == this.dropdownBed[a].value){
                    this.form.get('kdBed').setValue(this.dropdownBed[a].value);
                  }
                }
                for (var b = 0; b < this.dropdownFasilitasDetail.length; b++) {
                  if(callback.kdFasilitasDetail == this.dropdownFasilitasDetail[b].value){
                    this.form.get('kdFasilitasDetail').setValue(this.dropdownFasilitasDetail[b].value)
                  }
                }
              }
            }
          }
        };
      });
    }else{
       this.alertService.warn('Peringatan', 'Pilih Dulu Ruangan dan Kelas !!');
    }
  }
  setFasilitasDetail(id){
    this.dropdownBed = [];
    this.dropdownBed.push({ label: '--Pilih No Bed--', value: '' })
    this.dropdownFasilitasDetail = [];
    this.dropdownFasilitasDetail.push({ label: '--Pilih Fasilitas Detail--', value: '' })
    for (var i = 0; i < this.listFasilitasDetail.length; i++) {
      if(this.listFasilitasDetail[i].kode.kode == id){
        this.dropdownFasilitasDetail.push({label: this.listFasilitasDetail[i].deskripsiFasilitasDetail, value: this.listFasilitasDetail[i].kode.kode})
        for (var x = 1; x <= this.listFasilitasDetail[i].qtyBed; x++) {
          if(x < 10){
            this.dropdownBed.push({label: '0' + x.toString(), value:'0' + x.toString()});
          }else{
             this.dropdownBed.push({label: x.toString(), value: x.toString()});
          }
        }
      }
    }
  }
  //get data grid fasiltas detail
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetailtt/findAll?page=' + page + '&rows=' + rows + '&dir=ruangan.namaRuangan&sort=desc&namaRuangan=' + search).subscribe(table => {
      for (var i = 0; i < table.FasilitasDetailTT.length; i++) {
        if(table.FasilitasDetailTT[i].kode.noBed < 10){
          table.FasilitasDetailTT[i].kode.noBed = '0' + table.FasilitasDetailTT[i].kode.noBed.toString();
        }else{
          table.FasilitasDetailTT[i].kode.noBed = table.FasilitasDetailTT[i].kode.noBed.toString();
        }
      }
      this.listData = table.FasilitasDetailTT;
      this.totalRecords = table.totalRow;
    });
  }
  //event lazyload event datatable / grid
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  //pencarian data grid fasilitas detail berdasarkan nama fasilitas detail
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetailtt/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=ruangan.namaRuangan&sort=desc&namaRuangan=' + this.pencarian).subscribe(table => {
      this.listData = table.FasilitasDetailTT;
      this.totalRecords = table.totalRow;
    });
  }
  //mengisi value report display/tampilan laporan berdasarkan inputan nama fasilitas detail
  valuechange(newValue) {
    this.report = newValue;
  }
  //find index selected
  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  //event reset form/tombol batal
  reset() {
    this.ngOnInit();
  }
  //fungsi validasi form
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
  //fungsi validasi submit
  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }
  //fungsi simpan data
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let data = Object.assign({},this.form.value);
      let dataJson = {
        'kdFasilitasDetail': data.kdKamar,
        'noBed': data.kdBed,
        'kdStatusBed': data.kdStatusBed
      }
      this.httpService.post(Configuration.get().dataMasterNew + '/fasilitasdetailtt/save', dataJson).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                          
        this.reset();
      });
    }
  }
  //validasi event update/ubah data
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
  //fungsi update/ubah data 
  update() {
    let data = Object.assign({},this.form.value);
    let dataJson = {
      'kdFasilitasDetail': data.kdKamar,
      'noBed': data.kdBed,
      'kdStatusBed': data.kdStatusBed,
      'statusEnabled': data.statusEnabled
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/fasilitasdetailtt/update', dataJson).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }
  //validasi event delete/hapus data
  confirmDelete() {
    if (this.formAktif == true) {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Fasilitas');
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
  //fungsi delete/hapus data
  hapus() {
    let data = Object.assign({},this.form.value);
    let dataJson = {
      'kdFasilitasDetail': data.kdKamar,
      'noBed': data.kdBed
    }
    this.httpService.delete(Configuration.get().dataMasterNew + '/fasilitasdetailtt/del/' + dataJson.kdFasilitasDetail + '/' + dataJson.noBed).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });
  }
  //fungsi selected / pilih data di grid   
  onRowSelect(event) {
    this.formAktif = false;
    let cloned = this.clone(event.data);
    this.form.setValue(cloned);
    this.setDropdown(cloned);
  }
  //inisialisasi data selected
  clone(cloned: any) {
    let fixhub = {
      "kdRuangan": cloned.kdRuangan,
      "kdKamar": cloned.kode.kdFasilitasDetail,
      "kdFasilitasDetail": cloned.kode.kdFasilitasDetail,
      "kdKelasKamar": cloned.kdKelas,
      "kdBed": cloned.kode.noBed,
      "kdStatusBed": cloned.kdStatusBed,
      "statusEnabled": cloned.statusEnabled
    }
    return fixhub;
  }
  setDropdown(val){
    this.getKelasByRuangan(val.kdRuangan, val.kdKelasKamar)
    this.getFasilitasDetail(val.kdRuangan, val.kdKelasKamar, val)
  }
  //event export excel
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetailtt/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=ruangan.namaRuangan&sort=desc').subscribe(table => {
      this.listData = table.Fasilitas;
      this.codes = [];
      for (let i = 0; i < this.listData.length; i++) {
        this.codes.push({
          kode: this.listData[i].kode.kode,
        })
      }
      this.fileService.exportAsExcelFile(this.codes, 'fasilitas');
    });
  }
  //event export pdf
  downloadPdf() {
    // let cetak = Configuration.get().report + '/fasilitas/laporanFasilitas.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    // window.open(cetak);
  }
  //fungsi tombol cetak
  cetak() {
    // this.laporan = true;
    // this.print.showEmbedPDFReport(Configuration.get().report + '/fasilitas/laporanFasilitas.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmFasilitas(_laporanCetak');
  }
  //fungsi menutup form laporan
  tutupLaporan() {
    this.laporan = false;
  }
  clearFilter(da:any,db:any,dc:any,dd:any,de:any,df:any){
    da.filterValue = '';
    db.filterValue = '';
    dc.filterValue = '';
    dd.filterValue = '';
    de.filterValue = '';
    df.filterValue = '';
  }
} 