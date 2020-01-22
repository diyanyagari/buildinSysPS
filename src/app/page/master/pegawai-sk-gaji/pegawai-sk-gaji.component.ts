import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkGaji } from './pegawai-sk-gaji.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-pegawai-sk-gaji',
  templateUrl: './pegawai-sk-gaji.component.html',
  styleUrls: ['./pegawai-sk-gaji.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkGajiComponent implements OnInit {
  item: PegawaiSkGaji = new InisialPegawaiSkGaji();;
  selected: PegawaiSkGaji;
  listData: PegawaiSkGaji[];
  dataDummy: {};
  kodePegawai: PegawaiSkGaji[];
  kodeKomponenHarga: PegawaiSkGaji[];
  kodeOperatorRate: PegawaiSkGaji[];
  kodeMetodePembayaran: PegawaiSkGaji[];
  kodeMataUang: PegawaiSkGaji[];
  versi: any;
  formAktif: boolean;
  pencarian: string;
  form: FormGroup;
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.formAktif = true;
    this.get();
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'kdPegawai': new FormControl('', Validators.required),
      'kdKomponenHarga': new FormControl('', Validators.required),
      'hargaSatuan': new FormControl('', Validators.required),
      'persenHargaSatuan': new FormControl('', Validators.required),
      'kdKondisiProduk': new FormControl('', Validators.required),
      'kdOperatorRate': new FormControl('', Validators.required),
      'faktorRate': new FormControl('', Validators.required),
      'keterangan': new FormControl('', Validators.required),
      'noRec': new FormControl('', Validators.required),
      'qtyProduk': new FormControl('', Validators.required),
      'status1': new FormControl('', Validators.required),
      'status2': new FormControl('', Validators.required),
      'status3': new FormControl('', Validators.required),
      'status4': new FormControl('', Validators.required),
      'kdMetodePembayaran': new FormControl('', Validators.required),
      'kdMataUang': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true)

      //  "statusEnabled": this.item.statusEnabled
    });
  }

  get() {
    this.httpService.get(Configuration.get().dataMasterNew + '/modulAplikasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaModulAplikasi&sort=desc').subscribe(table => {
      this.listData = table.data.modulAplikasi;
    });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeKomponenHarga = [];
    //   this.kodeKomponenHarga.push({ label: '--Silahkan Pilih Komponen Harga--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeKomponenHarga.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeOperatorRate = [];
    //   this.kodeOperatorRate.push({ label: '--Silahkan Pilih Operator Faktor Rate--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeOperatorRate.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeMetodePembayaran = [];
    //   this.kodeMetodePembayaran.push({ label: '--Silahkan Pilih metode Pembayaran--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeMetodePembayaran.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeMataUang = [];
    //   this.kodeMataUang.push({ label: '--Silahkan Pilih Kondisi Mata Uang--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeMataUang.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/modulAplikasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
      this.listData = table.data.modulAplikasi;
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
  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }

  confirmDelete() {
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
    this.httpService.update(Configuration.get().dataMasterNew + '/modulAplikasi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      this.get();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/modulAplikasi/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
        this.get();
      });
    }
    this.reset();



  }

  reset() {
    this.formAktif = true;
    this.form.reset();
  }
  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    console.log(this.form.value);
  }
  clone(cloned: PegawaiSkGaji): PegawaiSkGaji {
    let hub = new InisialPegawaiSkGaji();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPegawaiSkGaji();
    fixHub = {

      "kode": hub.id.kode,
      "kdPegawai": hub.kdPegawai,
      "kdKomponenHarga": hub.kdKomponenHarga,
      "hargaSatuan": hub.hargaSatuan,
      "persenHargaSatuan": hub.persenHargaSatuan,
      "qtyProduk": hub.qtyProduk,
      "version": hub.version,
      "kdOperatorRate": hub.kdOperatorRate,
      "Keterangan": hub.Keterangan,
      "noRec": hub.noRec,
      "status1": hub.status1,
      "kdMetodePembayaran": hub.kdMetodePembayaran,
      "kdMataUang": hub.kdMataUang,

      //   "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/modulAplikasi/del/' + deleteItem.id.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialPegawaiSkGaji implements PegawaiSkGaji {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public kdPegawai?,
    public kdKomponenHarga?,
    public hargaSatuan?,
    public persenHargaSatuan?,
    public qtyProduk?,
    public kdOperatorRate?,
    public Keterangan?,
    public statusEnabled?,
    public noRec?,
    public status1?,
    public kdMetodePembayaran?,
    public kdMataUang?,
    public version?
  ) { }

}

