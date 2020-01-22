import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import {isNull} from 'util';
@Component({
  selector: 'app-ruangan-unit-kerja',
  templateUrl: './ruangan-unit-kerja.component.html',
  styleUrls: ['./ruangan-unit-kerja.component.scss'],
  providers: [ConfirmationService]
})
export class RuanganUnitKerjaComponent implements OnInit {

  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  pencarian: string;
  selected: any;
  listData: any[];
  kdprof:any;
  kddept:any;
  DetailLokasiKerjaData:any[];
  PegawaiKepala:any[];
  jenisAlamat:any[];
  listDepartemen:any[];

  constructor(
    private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService
  ) { }

  ngOnInit() {
    this.pencarian = '';
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.getDataGrid(this.page, this.rows, this.pencarian);
    this.versi = null;
    this.form = this.fb.group({

      'kode': new FormControl(null),
      'kdRuanganHead': new FormControl('', Validators.required),
      'namaRuangan': new FormControl('', Validators.required),
      'lokasiRuangan': new FormControl(''),
      'noRuangan': new FormControl(''),
      'kdPegawaiKepala': new FormControl(null),
      'kdAlamat': new FormControl(''),
      'nomorCounter': new FormControl(''),
      'prefixNomorAntrian': new FormControl(''),
      'jamBuka': new FormControl(''),
      'jamTutup': new FormControl(''),
      'jumlahPasienMax': new FormControl(''),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
      'kdDepartemen': new FormControl('', Validators.required),
      'statusRuangan': new FormControl(false)
    
    });
    this.getDataDropDown();

  }

  getDataGrid(page: number, rows: number, search: any){
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAll?page=' + page + '&rows=' + rows + '&dir=namaRuangan&sort=desc&namaRuangan='+search).subscribe(table => {
      this.listData = table.Ruangan;
      this.totalRecords = table.totalRow;
    });
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

  cari() {
    this.getDataGrid(this.page, this.rows, this.pencarian);
    // this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaRuangan&sort=desc&namaRuangan=' + this.pencarian).subscribe(table => {
    //   this.listData = table.Ruangan;
    // });
  }

  loadPage(event: LazyLoadEvent) {
    this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		// this.page = (event.rows + event.first) / event.rows;
		// this.rows = event.rows;
   
  }

  getDataDropDown(){
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/getHead').subscribe(res => {
      this.DetailLokasiKerjaData = [];
      this.DetailLokasiKerjaData.push({ label: '--Pilih Detail Ruangan--', value: null })
      for (var i = 0; i < res.Ruangan.length; i++) {
        this.DetailLokasiKerjaData.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kdRuangan })
      };
    }, error => {
			this.DetailLokasiKerjaData = [];
			this.DetailLokasiKerjaData.push({ label: '--' + error + '--', value: '' });
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
      this.PegawaiKepala = [];
      this.PegawaiKepala.push({ label: '--Pilih Pegawai Kepala--', value: null })
      for (var i = 0; i < res.Data.length; i++) {
        this.PegawaiKepala.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
      };
    }, error => {
			this.PegawaiKepala = [];
			this.PegawaiKepala.push({ label: '--' + error + '--', value: '' });
      
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/getDropDownAlamat').subscribe(res => {
      this.jenisAlamat = [];
      this.jenisAlamat.push({ label: '--Pilih Alamat--', value: '' })
      for (var i = 0; i < res.Alamat.length; i++) {
          this.jenisAlamat.push({ label: res.Alamat[i].alamat, value: res.Alamat[i].kode })
      };
    }, error => {
			this.jenisAlamat = [];
			this.jenisAlamat.push({ label: '--' + error + '--', value: '' });
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/departemen/findAllData').subscribe(res => {
      this.listDepartemen = [];
      this.listDepartemen.push({ label: '--Pilih Departemen--', value: null })
          for (var i = 0; i < res.Departemen.length; i++) {
            this.listDepartemen.push({ label: res.Departemen[i].namaDepartemen, value: res.Departemen[i].kode.kode })
          };
      },error => {
        this.listDepartemen = [];
        this.listDepartemen.push({ label: '--' + error + '--', value: '' });
    });

    // this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Departemen&select=namaDepartemen,id.kode').subscribe(res => {
    //   this.kdDepartemen = [];
    //   this.kdDepartemen.push({ label: '-- Pilih --', value: null })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kdDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id_kode })
    //   };
    // });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {

      let fixHub = {
        "kode": this.form.get('kode').value,
        "kdRuanganHead": this.form.get('kdRuanganHead').value,
        "namaRuangan": this.form.get('namaRuangan').value,
        "lokasiRuangan": this.form.get('lokasiRuangan').value,
        "noRuangan": this.form.get('noRuangan').value,
        "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
        "kdAlamat": this.form.get('kdAlamat').value,
        "noCounter": parseInt(this.form.get('nomorCounter').value),
        "prefixNoAntrian": this.form.get('prefixNomorAntrian').value,
        "jamBuka": this.form.get('jamBuka').value,
        "jamTutup": this.form.get('jamTutup').value,
        "qtyPasienMax": parseInt(this.form.get('jumlahPasienMax').value),
        "statusEnabled": this.form.get('statusEnabled').value,
        "kodeExternal": this.form.get('kodeExternal').value,
        "namaExternal": this.form.get('namaExternal').value,
        "reportDisplay": this.form.get('reportDisplay').value,
        "kdDepartemen": this.form.get('kdDepartemen').value,
        "isAntrianByRuangan": this.form.get('statusRuangan').value
        
      }
      this.httpService.post(Configuration.get().dataMasterNew + '/ruangan/save?', fixHub).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.getDataGrid(this.page, this.rows, this.pencarian);
        this.reset();
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

    let fixHub = {
      "kode": this.form.get('kode').value,
      "kdRuanganHead": this.form.get('kdRuanganHead').value,
      "namaRuangan": this.form.get('namaRuangan').value,
      "lokasiRuangan": this.form.get('lokasiRuangan').value,
      "noRuangan": this.form.get('noRuangan').value,
      "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
      "kdAlamat": this.form.get('kdAlamat').value,
      "noCounter": parseInt(this.form.get('nomorCounter').value),
      "prefixNoAntrian": this.form.get('prefixNomorAntrian').value,
      "jamBuka": this.form.get('jamBuka').value,
      "jamTutup": this.form.get('jamTutup').value,
      "qtyPasienMax": parseInt(this.form.get('jumlahPasienMax').value),
      "statusEnabled": this.form.get('statusEnabled').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "kdDepartemen": this.form.get('kdDepartemen').value,
      "isAntrianByRuangan": this.form.get('statusRuangan').value
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/ruangan/update/' + this.versi, fixHub).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getDataGrid(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event){
    let isAnR;
    if(isNull(event.data.isAntrianByRuangan) == true){
      isAnR = false;
    }else{
      isAnR = event.data.isAntrianByRuangan;
    }
    this.formAktif = false;
    this.versi = event.data.version;
    this.form.get('kode').setValue(event.data.kode.kode);
    this.form.get('kdRuanganHead').setValue(event.data.kdRuanganHead);
    this.form.get('namaRuangan').setValue(event.data.namaRuangan);
    this.form.get('lokasiRuangan').setValue(event.data.lokasiRuangan);
    this.form.get('noRuangan').setValue(event.data.noRuangan);
    this.form.get('kdPegawaiKepala').setValue(event.data.kdPegawaiKepala);
    this.form.get('kdAlamat').setValue(event.data.kdAlamat);
    this.form.get('nomorCounter').setValue(event.data.noCounter);
    this.form.get('prefixNomorAntrian').setValue(event.data.prefixNoAntrian);
    this.form.get('jamBuka').setValue(event.data.jamBuka);
    this.form.get('jamTutup').setValue(event.data.jamTutup);
    this.form.get('jumlahPasienMax').setValue(event.data.qtyPasienMax);
    this.form.get('namaExternal').setValue(event.data.namaExternal);
    this.form.get('kodeExternal').setValue(event.data.kodeExternal);
    this.form.get('reportDisplay').setValue(event.data.reportDisplay);
    this.form.get('kdRuanganHead').setValue(event.data.kdRuanganHead);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('kdDepartemen').setValue(event.data.kdDepartemen);
    this.form.get('statusRuangan').setValue(isAnR);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Unit Kerja');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/ruangan/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.getDataGrid(this.page, this.rows, this.pencarian);
    });
    this.reset();


  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }




}
