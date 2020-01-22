import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
// import { FasilitasDetail } from './fasilitas-detail.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-fasilitas-detail',
  templateUrl: 'fasilitas-detail.component.html',
  styleUrls: ['fasilitas-detail.component.scss'],
  providers: [ConfirmationService]
})
export class FasilitasDetailComponent implements OnInit {

  item: any[];
  selected: any;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  formAktif: boolean
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
  dropdownFasilitas: any;
  dropdownRuangan: any;
  dropdownKelas: any;
  dropdownRegisterAset: any;
  listDropdown: boolean = false;

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
      'kode': new FormControl(null),
      'kdFasilitas': new FormControl(null, Validators.required),
      'naNoFasilitasDetail': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'qtyBed': new FormControl(null, Validators.required),
      'deskripsiFasilitasDetail': new FormControl(null, Validators.required),
      'kdRuangan': new FormControl(null),
      'kdKelas': new FormControl(null),
      'noRegisterAset': new FormControl(null),
      'kodeExternal': new FormControl(null),
      'namaExternal': new FormControl(null),
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

  getDropdown() {
    this.dropdownKelas = [];
    this.dropdownKelas.push({ label: '--Pilih Ruangan Dulu--', value: '' })
    //Dropdown Fasilitas
    this.httpService.get(Configuration.get().dataMaster + '/fasilitas/findAllData').subscribe(res => {
      this.dropdownFasilitas = [];
      this.dropdownFasilitas.push({ label: '--Pilih Fasilitas--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownFasilitas.push({ label: res.data[i].namaFasilitas, value: res.data[i].kode.kode })
      };
    });
    //Dropdown Ruangan
    this.httpService.get(Configuration.get().dataMaster + '/ruangan/findByKodeHead/'+ this.authGuard.getUserDto().idLokasi).subscribe(res => {
      this.dropdownRuangan = [];
      this.dropdownRuangan.push({ label: '--Pilih Ruangan--', value: '' })
      for (var i = 0; i < res.Ruangan.length; i++) {
        this.dropdownRuangan.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kdRuangan })
      };
    });
    //Dropdown Kelas
    // this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAllData').subscribe(res => {
    //   this.dropdownKelas = [];
    //   this.dropdownKelas.push({ label: '--Pilih Kelas--', value: '' })
    //   for (var i = 0; i < res.Kelas.length; i++) {
    //     this.dropdownKelas.push({ label: res.Kelas[i].namaKelas, value: res.Kelas[i].kode.kode })
    //   };
    // });
    //Dropdown Register Aset
    this.httpService.get(Configuration.get().dataMasterNew + '/registrasiAset/findAllData').subscribe(res => {
      this.dropdownRegisterAset = [];
      this.dropdownRegisterAset.push({ label: '--Pilih Register Aset--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.dropdownRegisterAset.push({ label: res.data.data[i].noRegistrasiAset + ' - ' + res.data.data[i].namaProduk, value: res.data.data[i].noRegistrasiAset })
      };
    });
    this.listDropdown = true;
  }
  getKelasByRuangan(id,callback){
    this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantokelas/findByKdRuangan/'+id).subscribe(res => {
      this.dropdownKelas = [];
      this.dropdownKelas.push({ label: '--Pilih Kelas--', value: '' })
      for (var i = 0; i < res.MapRuanganToKelas.length; i++) {
        this.dropdownKelas.push({ label: res.MapRuanganToKelas[i].namaKelas, value: res.MapRuanganToKelas[i].kdKelas})
        if(callback == res.MapRuanganToKelas[i].kdKelas){
          this.form.get('kdKelas').setValue(res.MapRuanganToKelas[i].kdKelas);
        }
      };
    });
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetail/findAll?page=' + page + '&rows=' + rows + '&dir=naNoFasilitasDetail&sort=asc&naNoFasilitasDetail=' + search).subscribe(table => {
      this.listData = table.FasilitasDetail;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetail/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=naNoFasilitasDetail&sort=asc&naNoFasilitasDetail=' + this.pencarian).subscribe(table => {
      this.listData = table.FasilitasDetail;
      this.totalRecords = table.totalRow;
    });
  }
  valuechange(newValue) {
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/fasilitasdetail/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=naNoFasilitasDetail&sort=asc').subscribe(table => {
      this.listData = table.FasilitasDetail;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        this.codes.push({

          kode: this.listData[i].kode.kode,

        })
      }

      this.fileService.exportAsExcelFile(this.codes, 'fasilitas');
    });
  }
  downloadPdf() {
    // let cetak = Configuration.get().report + '/fasilitas/laporanFasilitas.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    // window.open(cetak);
  }
  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Fasilitas Detail');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/fasilitasdetail/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
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
    this.httpService.update(Configuration.get().dataMasterNew + '/fasilitasdetail/update', this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/fasilitasdetail/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                          
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
    this.setDropdown(cloned);
  }
  clone(cloned: any) {
    let fixhub = {
      "kode": cloned.kode.kode,
      "naNoFasilitasDetail": cloned.naNoFasilitasDetail,
      "reportDisplay": cloned.reportDisplay,
      "deskripsiFasilitasDetail": cloned.deskripsiFasilitasDetail,     
      "kdFasilitas": cloned.kdFasilitas,
      "kdRuangan": cloned.kdRuangan,
      "kdKelas": cloned.kdKelas,
      "noRegisterAset": cloned.noRegisterAset,
      "qtyBed": cloned.qtyBed,
      "kodeExternal": cloned.kodeExternal,
      "namaExternal": cloned.namaExternal,
      "statusEnabled": cloned.statusEnabled,
    }
    return fixhub;
  }
  setDropdown(obj){
    this.getKelasByRuangan(obj.kdRuangan,obj.kdKelas)
  }
  cetak() {
    // this.laporan = true;
    // this.print.showEmbedPDFReport(Configuration.get().report + '/fasilitas/laporanFasilitas.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmFasilitas(_laporanCetak');
  }
  tutupLaporan() {
    this.laporan = false;
  }
  clearFilter(da: any, db: any, dc: any, dd: any, de: any){
    da.filterValue = '';
    db.filterValue = '';
    dc.filterValue = '';
    dd.filterValue = '';
    de.filterValue = '';
  }
}