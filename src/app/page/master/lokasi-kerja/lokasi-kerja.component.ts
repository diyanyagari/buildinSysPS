import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { lokasiKerja } from './lokasi-kerja.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import {isNull} from 'util';

@Component({
  selector: 'app-lokasi-kerja',
  templateUrl: './lokasi-kerja.component.html',
  styleUrls: ['./lokasi-kerja.component.scss'],
  providers: [ConfirmationService]
})
export class LokasiKerjaComponent implements OnInit {
  page: number;
  rows: number;
  totalRecords: number;
  formAktif: boolean;
  form: FormGroup;
  versi: any;
  PegawaiKepala: any[];
  jenisAlamat: any[];
  listData:any[];
  pencarian: string;
  selected: any;
  report: any;
  toReport: any;
  listDepartemen:any[];

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
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    
    this.formAktif = true;
    this.versi = null;
    this.selected = "";
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaRuangan': new FormControl('', Validators.required),
      'noRuangan': new FormControl(''),
      'lokasiRuangan': new FormControl(''),
      'kdAlamat': new FormControl(''),
      'kdPegawaiKepala': new FormControl(null),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
      'kdRuanganHead': new FormControl(null),
      'kdDepartemen': new FormControl('', Validators.required),
      'statusRuangan': new FormControl(false)
    });

    this.getData(this.page, this.rows, '');

    this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
      this.PegawaiKepala = [];
      this.PegawaiKepala.push({ label: '--Pilih Pegawai Kepala--', value: null })
      for (var i = 0; i < res.Data.length; i++) {
        this.PegawaiKepala.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/getDropDownAlamat').subscribe(res => {
      this.jenisAlamat = [];
      this.jenisAlamat.push({ label: '--Pilih Alamat--', value: '' })
      for (var i = 0; i < res.Alamat.length; i++) {
          this.jenisAlamat.push({ label: res.Alamat[i].alamat, value: res.Alamat[i].kode })
      };
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

  }

  getData(page: number, rows: number, search: any){
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAllHead?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.Ruangan;
      this.totalRecords = table.totalRow;
    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAllHead?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaRuangan&sort=desc&namaRuangan=' + this.pencarian).subscribe(table => {
      this.listData = table.Ruangan;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.getData((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
  }

  onRowSelect(event){
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

  }

  clone(cloned: lokasiKerja): lokasiKerja {
    let hub = new InisialLokasiKerja();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialLokasiKerja();
    let isAnR;
    if(isNull(hub.isAntrianByRuangan) == true){
      isAnR = false;
    }else{
      isAnR = hub.isAntrianByRuangan;
    }
    fixHub = {
      "kode": hub.kode.kode,
      "namaRuangan": hub.namaRuangan,
      "noRuangan": hub.noRuangan,
      "lokasiRuangan": hub.lokasiRuangan,
      "kdPegawaiKepala": hub.kdPegawaiKepala,
      "kdAlamat": hub.kdAlamat,
      "statusEnabled": hub.statusEnabled,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "kdRuanganHead":hub.kdRuanganHead,
      "statusRuangan":isAnR,
      "kdDepartemen":hub.kdDepartemen
    }
    this.versi = hub.version;
    return fixHub;
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
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

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {

      let fixHub = {

        "kode": this.form.get('kode').value,
        "namaRuangan": this.form.get('namaRuangan').value,
        "noRuangan": this.form.get('noRuangan').value,
        "kdAlamat": this.form.get('kdAlamat').value,
        "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
        "lokasiRuangan": this.form.get('lokasiRuangan').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "kodeExternal": this.form.get('kodeExternal').value,
        "namaExternal": this.form.get('namaExternal').value,
        "reportDisplay": this.form.get('reportDisplay').value,
        "kdRuanganHead": this.form.get('kdRuanganHead').value,
        "isAntrianByRuangan": this.form.get('statusRuangan').value,
        "kdDepartemen": this.form.get('kdDepartemen').value
      }

      this.httpService.post(Configuration.get().dataMasterNew + '/ruangan/save?', fixHub).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.getData(this.page, this.rows, this.pencarian);
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
      this.getData(this.page, this.rows, this.pencarian);
    });
    this.reset();
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  update() {

    let fixHub = {

      "kode": this.form.get('kode').value,
      "namaRuangan": this.form.get('namaRuangan').value,
      "noRuangan": this.form.get('noRuangan').value,
      "kdAlamat": this.form.get('kdAlamat').value,
      "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
      "lokasiRuangan": this.form.get('lokasiRuangan').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "kdRuanganHead": this.form.get('kdRuanganHead').value,
      "kdDepartemen": this.form.get('kdDepartemen').value,
      "isAntrianByRuangan": this.form.get('statusRuangan').value

    }

    this.httpService.update(Configuration.get().dataMasterNew + '/ruangan/update/' + this.versi, fixHub).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.getData(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }



 

}

class InisialLokasiKerja implements lokasiKerja {

  constructor(
    public ruangan?,
    public id?,
    public alamatEmail?,
    public faksimile?,
    public fixedPhone?,
    public jamBuka?,
    public jamTutup?,
    public kdDepartemen?,
    public kdKelasHead?,
    public kdModulAplikasi?,
    public kdPegawaiKepala?,
    public kode?,
    public kodeExternal?,
    public lokasiRuangan?,
    public mobilePhone?,
    public namaExternal?,
    public namaRuangan?,
    public noCounter?,
    public noRuangan?,
    public prefixNoAntrian?,
    public reportDisplay?,
    public statusEnabled?,
    public statusRuangan?,
    public isAntrianByRuangan?,
    public statusViewData?,
    public version?,
    public website?,

    public kdAlamat?,
    public alamatLengkap?,
    public rtrw?,
    public rTRW?,
    public kdNegara?,
    public kdPropinsi?,
    public kdKotaKabupaten?,
    public kdKecamatan?,
    public kdDesaKelurahan?,
    public kodePos?,
    public kdRuanganHead?,

  ) { }

}