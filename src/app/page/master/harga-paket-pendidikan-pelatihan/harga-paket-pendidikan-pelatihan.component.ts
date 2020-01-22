import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { HargaPaketPendidikanPelatihan } from './harga-paket-pendidikan-pelatihan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-harga-paket-pendidikan-pelatihan',
  templateUrl: './harga-paket-pendidikan-pelatihan.component.html',
  styleUrls: ['./harga-paket-pendidikan-pelatihan.component.scss'],
  providers: [ConfirmationService]
})
export class HargaPaketPendidikanPelatihanComponent implements OnInit {

  listpaket: any[];
  listAsalProduk: any[];
  listAsalPeserta: any[];
  listMataUang: any[];
  listKelas: any[];
  listOperatorFactorRate: any[];
  selected: HargaPaketPendidikanPelatihan;
  listData: HargaPaketPendidikanPelatihan[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  type: any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService) {

  }

  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdPaket': new FormControl('', Validators.required),
      'kdKelas': new FormControl('', Validators.required),
      'kdAsalProduk': new FormControl('', Validators.required),
      'kdAsalPeserta': new FormControl('', Validators.required),
      'tglBerlakuAwal': new FormControl('', Validators.required),
      'tglBerlakuAkhir': new FormControl(''),
      'hargaDiscount': new FormControl(''),
      'hargaNetto': new FormControl('', Validators.required),
      'hargaSatuan': new FormControl(''),
      'persenDiscount': new FormControl(''),
      'factoreRate': new FormControl('', Validators.required),
      'operatorFactorRate': new FormControl('', Validators.required),
      'kdMataUang': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.type = 'persendiskon';
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }
  valueRadio(value) {
    console.log(value);
    this.type = value;
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/hargaPaketPendidikanPelatihan/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.hargaPaketPendidikanPelatihan;
      this.totalRecords = table.totalRow;
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Paket&select=namaPaket,id').subscribe(res => {
      this.listpaket = [];
      this.listpaket.push({ label: '--Pilih Paket--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listpaket.push({ label: res.data.data[i].namaPaket, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Kelas&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.listKelas = [];
      this.listKelas.push({ label: '--Pilih Kelas--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKelas.push({ label: res.data.data[i].namaKelas, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Asal&select=*&page=1&rows=300&criteria=kdAsalHead&values=36&condition=and&profile=y,id').subscribe(res => {
      this.listAsalProduk = [];
      this.listAsalProduk.push({ label: '--Pilih Asal Produk--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listAsalProduk.push({ label: res.data.data[i].namaAsal, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Asal&select=*&page=1&rows=300&criteria=kdAsalHead&values=17&condition=and&profile=y,id').subscribe(res => {
      this.listAsalPeserta = [];
      this.listAsalPeserta.push({ label: '--Pilih Asal Peserta--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listAsalPeserta.push({ label: res.data.data[i].namaAsal, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MataUang&select=namaMataUang,id').subscribe(res => {
      this.listMataUang = [];
      this.listMataUang.push({ label: '--Pilih Mata Uang--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listMataUang.push({ label: res.data.data[i].namaMataUang, value: res.data.data[i].id.kode })
      };
    });
    this.listOperatorFactorRate = [];
    this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: '' });
    this.listOperatorFactorRate.push({ label: "+", value: 'plus' });
    this.listOperatorFactorRate.push({ label: "-", value: 'min' });
    this.listOperatorFactorRate.push({ label: "*", value: 'max' });
    this.listOperatorFactorRate.push({ label: "/", value: 'divide' });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/hargaPaketPendidikanPelatihan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPaket&sort=desc&namaPaket=' + this.pencarian).subscribe(table => {
      this.listData = table.hargaPaketPendidikanPelatihan;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  confirmDelete() {
    let kdPaket = this.form.get('kdPaket').value;
    if (kdPaket == null || kdPaket == undefined || kdPaket == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Detail Jenis Produk');
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
  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }
  update() {
    let tglBerlakuAkhir = this.setTimeStamp(this.form.get('tglBerlakuAkhir').value)
    let tglBerlakuAwal = this.setTimeStamp(this.form.get('tglBerlakuAwal').value)

    let formSubmit = this.form.value;
    formSubmit.tglBerlakuAwal = tglBerlakuAwal;
    formSubmit.tglBerlakuAkhir = tglBerlakuAkhir;
    this.httpService.update(Configuration.get().dataMasterNew + '/hargaPaketPendidikanPelatihan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let tglBerlakuAkhir = this.setTimeStamp(this.form.get('tglBerlakuAkhir').value)
      let tglBerlakuAwal = this.setTimeStamp(this.form.get('tglBerlakuAwal').value)

      let formSubmit = this.form.value;
      formSubmit.tglBerlakuAwal = tglBerlakuAwal;
      formSubmit.tglBerlakuAkhir = tglBerlakuAkhir;
      this.httpService.post(Configuration.get().dataMasterNew + '/hargaPaketPendidikanPelatihan/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
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

  clone(cloned: HargaPaketPendidikanPelatihan): HargaPaketPendidikanPelatihan {
    let hub = new InisialHargaPaketPendidikanPelatihan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialHargaPaketPendidikanPelatihan();
    fixHub = {

      'kdPaket': hub.kdPaket,
      'kdKelas': hub.kdKelas,
      'kdAsalProduk': hub.kdAsalProduk,
      'kdAsalPeserta': hub.kdAsalPeserta,
      'tglBerlakuAwal': new Date(hub.tglBerlakuAwal * 1000),
      'tglBerlakuAkhir': new Date(hub.tglBerlakuAkhir * 1000),
      'hargaDiscount': hub.hargaDiscount,
      'hargaNetto': hub.hargaNetto,
      'hargaSatuan': hub.hargaSatuan,
      'persenDiscount': hub.persenDiscount,
      'factoreRate': hub.factoreRate,
      'operatorFactorRate': hub.operatorFactorRate,
      'kdMataUang': hub.kdMataUang,
      'statusEnabled': hub.statusEnabled


    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/hargaPaketPendidikanPelatihan/del/' + deleteItem.kdPaket).subscribe(response => {
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialHargaPaketPendidikanPelatihan implements HargaPaketPendidikanPelatihan {

  constructor(
    public kdPaket?,
    public kdAsalProduk?,
    public kdAsalPeserta?,
    public tglBerlakuAwal?,
    public kdMataUang?,
    public tglBerlakuAkhir?,
    public hargaDiscount?,
    public hargaNetto?,
    public hargaSatuan?,
    public persenDiscount?,
    public factoreRate?,
    public operatorFactorRate?,
    public kdKelas?,

    public kode?,
    public kdAccount?,
    public kdProfile?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,



  ) { }

}
