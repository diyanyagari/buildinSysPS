import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiStrukturGaji } from './pegawai-struktur-gaji.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-pegawai-struktur-gaji',
  templateUrl: './pegawai-struktur-gaji.component.html',
  styleUrls: ['./pegawai-struktur-gaji.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiStrukturGajiComponent implements OnInit {
  item: PegawaiStrukturGaji = new InisialPegawaiStrukturGaji();;
  selected: PegawaiStrukturGaji;
  listData: PegawaiStrukturGaji[];
  dataDummy: {};
  kodePegawai: PegawaiStrukturGaji[];
  kodeKomponenHarga: PegawaiStrukturGaji[];
  kodeOperatorRate: PegawaiStrukturGaji[];
  versi: any;
  formAktif: boolean;
  pencarian: string;
  form: FormGroup;
  listBerdasarkanGologanPegawai: any[];
  listPegawai: any[];
  listDurasi: any[];
  listOperator: any[];
  listBerdasarkanJabatanPegawai: any[];
  listBerdasarkanJabatanDanPendidikanPegawai: any[];
  listBerdasarkanMasaKerjaDanPendidikanPegawai: any[];
  jabatanPegawai: boolean;
  jabatanPendidikanPegawai: boolean;
  masaKerjaPendidikanPegawai: boolean;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.formAktif = true;
    this.form = this.fb.group({
      'noSK': new FormControl(null),
      'tglAwalBerlakuSk': new FormControl('', Validators.required),
      'tglAkhirBerlakuSk': new FormControl({ value: '', disabled: true }, Validators.required),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'kdMasaKerja': new FormControl('', Validators.required),
      'kdKomponenGaji': new FormControl('', Validators.required),
      'namaSK': new FormControl('', Validators.required),
      'AktifTanggal': new FormControl('', Validators.required),
      'isByTanggalMasukKerja': new FormControl('', Validators.required),
      'kdcaraBayar': new FormControl('', Validators.required),
      'hargaSatuan': new FormControl('', Validators.required),
      'qtyHariSlipGiven': new FormControl('', Validators.required),
      'tanggalBayar': new FormControl('', Validators.required),
      'tanggalBayarMax': new FormControl('', Validators.required),
      'tanggalCutOffAwal': new FormControl('', Validators.required),

      'kdGolonganPegawi': new FormControl('', Validators.required),
      'kdDurasi': new FormControl('', Validators.required),
      'factorRate': new FormControl('', Validators.required),
      'operatorFactorRate': new FormControl('', Validators.required),
      'kdJabatanPegawai': new FormControl('', Validators.required),
      'kdJabatanPegawai2': new FormControl('', Validators.required),
      'kdGolonganPegawai': new FormControl('', Validators.required),
      'tanggalCutOffAkhir': new FormControl('', Validators.required),
      'kdPendidikan': new FormControl('', Validators.required),
      'kdPendidikan2': new FormControl('', Validators.required),
      // 'tanggalCutOffAkhir': new FormControl('', Validators.required),


    });
    this.listBerdasarkanGologanPegawai = [];
    this.listBerdasarkanJabatanPegawai = [];
    this.listBerdasarkanJabatanDanPendidikanPegawai = [];
    this.listBerdasarkanMasaKerjaDanPendidikanPegawai = [];
    // this.jabatanPegawai = false;
    // this.clearJabatanPegawai(false);
    this.get();

  }

  get() {
    this.listDurasi = [];
    this.listDurasi.push({ label: '--Pilih Durasi--', value: '' });
    this.listDurasi.push({ label: 'Harian', value: 'Harian' });
    this.listDurasi.push({ label: 'Mingguan', value: 'Mingguan' });
    this.listDurasi.push({ label: 'Bulanan', value: 'Bulanan' });
    this.listDurasi.push({ label: 'Tahunan', value: 'Tahunan' });

    this.listOperator = [];
    this.listOperator.push({ label: '--Pilih Operator Factor Rate--', value: '' });
    this.listOperator.push({ label: '+', value: '+' });
    this.listOperator.push({ label: '-', value: '-' });
    this.listOperator.push({ label: '/', value: '/' });
    this.listOperator.push({ label: 'x', value: 'x' });
  }

  tambahBerdasarkanGologanPegawai() {

    // if (this.listBerdasarkanGologanPegawai.length == 0) {
    let dataTempGolongan = {
      "komponenGaji": {
        "namaKomponenGaji": "--Pilih Komponen Gaji--",
        "kdKomponenGaji": null,
      },
      "hargaSatuan": null,
      "durasi": "--Pilih Durasi--",
      "factorRate": null,
      "operatorFactorRate": "--Pilih Operator Factor Rate--",
    }
    let listBerdasarkanGologanPegawai = [...this.listBerdasarkanGologanPegawai];
    listBerdasarkanGologanPegawai.push(dataTempGolongan);
    this.listBerdasarkanGologanPegawai = listBerdasarkanGologanPegawai;
    // } else {
    //     let last = this.listBerdasarkanGologanPegawai.length - 1;
    //     if (this.listBerdasarkanGologanPegawai[last].produk.kdProduk == null ||
    //         this.listBerdasarkanGologanPegawai[last].kuantitas == null) {
    //         this.alertService.warn('Peringatan', 'Data Tidak Lengkap')
    //     } else {
    //         for (let i = 0; i < this.listPegawai.length; i++) {
    //             if (this.listPegawai[i].value.kdProduk == this.listBerdasarkanGologanPegawai[last].produk.kdProduk) {
    //                 this.listPegawai.splice(i, 1);
    //             }
    //         }
    //         let dataTempAnggaran = {
    //             "produk": {
    //                 "hargaSatuan": null,
    //                 "kdProduk": null,
    //                 "namaProduk": "--Pilih Anggaran--",
    //             },
    //             "kuantitas": null,
    //             "totalHarga": null,
    //         }
    //         let listBerdasarkanGologanPegawai = [...this.listBerdasarkanGologanPegawai];
    //         listBerdasarkanGologanPegawai.push(dataTempAnggaran);
    //         this.listBerdasarkanGologanPegawai = listBerdasarkanGologanPegawai;

    //     }

    // }

    // let dataTempAnggaran = {
    //     "produk": {
    //         "hargaSatuan": "",
    //         "kdProduk": "",
    //         "namaProduk": "--Pilih Asal Anggaran--",
    //     },
    //     "kuantitas": "",
    //     "totalHarga": "",
    // }
    // let listBerdasarkanGologanPegawai = [...this.listBerdasarkanGologanPegawai];
    // listBerdasarkanGologanPegawai.push(dataTempAnggaran);
    // this.listBerdasarkanGologanPegawai = listBerdasarkanGologanPegawai;
  }

  tambahBerdasarkanJabatanPegawai() {

    // if (this.listBerdasarkanJabatanPegawai.length == 0) {
    let dataJabatanPegawai = {
      "komponenGaji": {
        "namaKomponenGaji": "--Pilih Komponen Gaji--",
        "kdKomponenGaji": null,
      },
      "hargaSatuan": null,
      "durasi": "--Pilih Durasi--",
      "factorRate": null,
      "operatorFactorRate": "--Pilih Operator Factor Rate--",
    }
    let listBerdasarkanJabatanPegawai = [...this.listBerdasarkanJabatanPegawai];
    listBerdasarkanJabatanPegawai.push(dataJabatanPegawai);
    this.listBerdasarkanJabatanPegawai = listBerdasarkanJabatanPegawai;
    // } else {
    //     let last = this.listBerdasarkanJabatanPegawai.length - 1;
    //     if (this.listBerdasarkanJabatanPegawai[last].produk.kdProduk == null ||
    //         this.listBerdasarkanJabatanPegawai[last].kuantitas == null) {
    //         this.alertService.warn('Peringatan', 'Data Tidak Lengkap')
    //     } else {
    //         for (let i = 0; i < this.listPegawai.length; i++) {
    //             if (this.listPegawai[i].value.kdProduk == this.listBerdasarkanJabatanPegawai[last].produk.kdProduk) {
    //                 this.listPegawai.splice(i, 1);
    //             }
    //         }
    //         let dataTempAnggaran = {
    //             "produk": {
    //                 "hargaSatuan": null,
    //                 "kdProduk": null,
    //                 "namaProduk": "--Pilih Anggaran--",
    //             },
    //             "kuantitas": null,
    //             "totalHarga": null,
    //         }
    //         let listBerdasarkanJabatanPegawai = [...this.listBerdasarkanJabatanPegawai];
    //         listBerdasarkanJabatanPegawai.push(dataTempAnggaran);
    //         this.listBerdasarkanJabatanPegawai = listBerdasarkanJabatanPegawai;

    //     }

    // }

    // let dataTempAnggaran = {
    //     "produk": {
    //         "hargaSatuan": "",
    //         "kdProduk": "",
    //         "namaProduk": "--Pilih Asal Anggaran--",
    //     },
    //     "kuantitas": "",
    //     "totalHarga": "",
    // }
    // let listBerdasarkanJabatanPegawai = [...this.listBerdasarkanJabatanPegawai];
    // listBerdasarkanJabatanPegawai.push(dataTempAnggaran);
    // this.listBerdasarkanJabatanPegawai = listBerdasarkanJabatanPegawai;
  }

  tambahBerdasarkanJabatanDanPendidikanPegawai() {

    // if (this.listBerdasarkanJabatanDanPendidikanPegawai.length == 0) {
    let dataJabatanPegawai = {
      "komponenGaji": {
        "namaKomponenGaji": "--Pilih Komponen Gaji--",
        "kdKomponenGaji": null,
      },
      "hargaSatuan": null,
      "durasi": "--Pilih Durasi--",
      "factorRate": null,
      "operatorFactorRate": "--Pilih Operator Factor Rate--",
    }
    let listBerdasarkanJabatanDanPendidikanPegawai = [...this.listBerdasarkanJabatanDanPendidikanPegawai];
    listBerdasarkanJabatanDanPendidikanPegawai.push(dataJabatanPegawai);
    this.listBerdasarkanJabatanDanPendidikanPegawai = listBerdasarkanJabatanDanPendidikanPegawai;
    // } else {
    //     let last = this.listBerdasarkanJabatanDanPendidikanPegawai.length - 1;
    //     if (this.listBerdasarkanJabatanDanPendidikanPegawai[last].produk.kdProduk == null ||
    //         this.listBerdasarkanJabatanDanPendidikanPegawai[last].kuantitas == null) {
    //         this.alertService.warn('Peringatan', 'Data Tidak Lengkap')
    //     } else {
    //         for (let i = 0; i < this.listPegawai.length; i++) {
    //             if (this.listPegawai[i].value.kdProduk == this.listBerdasarkanJabatanDanPendidikanPegawai[last].produk.kdProduk) {
    //                 this.listPegawai.splice(i, 1);
    //             }
    //         }
    //         let dataTempAnggaran = {
    //             "produk": {
    //                 "hargaSatuan": null,
    //                 "kdProduk": null,
    //                 "namaProduk": "--Pilih Anggaran--",
    //             },
    //             "kuantitas": null,
    //             "totalHarga": null,
    //         }
    //         let listBerdasarkanJabatanDanPendidikanPegawai = [...this.listBerdasarkanJabatanDanPendidikanPegawai];
    //         listBerdasarkanJabatanDanPendidikanPegawai.push(dataTempAnggaran);
    //         this.listBerdasarkanJabatanDanPendidikanPegawai = listBerdasarkanJabatanDanPendidikanPegawai;

    //     }

    // }

    // let dataTempAnggaran = {
    //     "produk": {
    //         "hargaSatuan": "",
    //         "kdProduk": "",
    //         "namaProduk": "--Pilih Asal Anggaran--",
    //     },
    //     "kuantitas": "",
    //     "totalHarga": "",
    // }
    // let listBerdasarkanJabatanDanPendidikanPegawai = [...this.listBerdasarkanJabatanDanPendidikanPegawai];
    // listBerdasarkanJabatanDanPendidikanPegawai.push(dataTempAnggaran);
    // this.listBerdasarkanJabatanDanPendidikanPegawai = listBerdasarkanJabatanDanPendidikanPegawai;
  }

  tambahBerdasarkanMasaKerjaDanPendidikanPegawai() {

    // if (this.listBerdasarkanMasaKerjaDanPendidikanPegawai.length == 0) {
    let dataJabatanPegawai = {
      "komponenGaji": {
        "namaKomponenGaji": "--Pilih Komponen Gaji--",
        "kdKomponenGaji": null,
      },
      "hargaSatuan": null,
      "durasi": "--Pilih Durasi--",
      "factorRate": null,
      "operatorFactorRate": "--Pilih Operator Factor Rate--",
    }
    let listBerdasarkanMasaKerjaDanPendidikanPegawai = [...this.listBerdasarkanMasaKerjaDanPendidikanPegawai];
    listBerdasarkanMasaKerjaDanPendidikanPegawai.push(dataJabatanPegawai);
    this.listBerdasarkanMasaKerjaDanPendidikanPegawai = listBerdasarkanMasaKerjaDanPendidikanPegawai;
    // } else {
    //     let last = this.listBerdasarkanMasaKerjaDanPendidikanPegawai.length - 1;
    //     if (this.listBerdasarkanMasaKerjaDanPendidikanPegawai[last].produk.kdProduk == null ||
    //         this.listBerdasarkanMasaKerjaDanPendidikanPegawai[last].kuantitas == null) {
    //         this.alertService.warn('Peringatan', 'Data Tidak Lengkap')
    //     } else {
    //         for (let i = 0; i < this.listPegawai.length; i++) {
    //             if (this.listPegawai[i].value.kdProduk == this.listBerdasarkanMasaKerjaDanPendidikanPegawai[last].produk.kdProduk) {
    //                 this.listPegawai.splice(i, 1);
    //             }
    //         }
    //         let dataTempAnggaran = {
    //             "produk": {
    //                 "hargaSatuan": null,
    //                 "kdProduk": null,
    //                 "namaProduk": "--Pilih Anggaran--",
    //             },
    //             "kuantitas": null,
    //             "totalHarga": null,
    //         }
    //         let listBerdasarkanMasaKerjaDanPendidikanPegawai = [...this.listBerdasarkanMasaKerjaDanPendidikanPegawai];
    //         listBerdasarkanMasaKerjaDanPendidikanPegawai.push(dataTempAnggaran);
    //         this.listBerdasarkanMasaKerjaDanPendidikanPegawai = listBerdasarkanMasaKerjaDanPendidikanPegawai;

    //     }

    // }

    // let dataTempAnggaran = {
    //     "produk": {
    //         "hargaSatuan": "",
    //         "kdProduk": "",
    //         "namaProduk": "--Pilih Asal Anggaran--",
    //     },
    //     "kuantitas": "",
    //     "totalHarga": "",
    // }
    // let listBerdasarkanMasaKerjaDanPendidikanPegawai = [...this.listBerdasarkanMasaKerjaDanPendidikanPegawai];
    // listBerdasarkanMasaKerjaDanPendidikanPegawai.push(dataTempAnggaran);
    // this.listBerdasarkanMasaKerjaDanPendidikanPegawai = listBerdasarkanMasaKerjaDanPendidikanPegawai;
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  clearJabatanPegawai(event) {
    if (event == false) {
      this.listBerdasarkanJabatanPegawai = [];
      this.form.get('kdJabatanPegawai').setValue(null);
    }
  }
  clearJabatanPendidikanPegawai(event) {
    if (event == false) {
      this.listBerdasarkanJabatanDanPendidikanPegawai = [];
      this.form.get('kdJabatanPegawai2').setValue(null);
      this.form.get('kdPendidikan').setValue(null);
    }
  }
  clearMasaKerjaPendidikanPegawai(event) {
    if (event == false) {
      this.listBerdasarkanMasaKerjaDanPendidikanPegawai = [];
      this.form.get('kdMasaKerja').setValue(null);
      this.form.get('kdPendidikan2').setValue(null);
    }
  }
  hapusGolonganPegawai(row) {
    let listBerdasarkanGologanPegawai = [...this.listBerdasarkanGologanPegawai];
    listBerdasarkanGologanPegawai.splice(row, 1);
    this.listBerdasarkanGologanPegawai = listBerdasarkanGologanPegawai;
  }
  hapusJabatanPegawai(row) {
    let listBerdasarkanJabatanPegawai = [...this.listBerdasarkanJabatanPegawai];
    listBerdasarkanJabatanPegawai.splice(row, 1);
    this.listBerdasarkanJabatanPegawai = listBerdasarkanJabatanPegawai;
  }
  hapusJabatanPendidikanPegawai(row) {
    let listBerdasarkanJabatanDanPendidikanPegawai = [...this.listBerdasarkanJabatanDanPendidikanPegawai];
    listBerdasarkanJabatanDanPendidikanPegawai.splice(row, 1);
    this.listBerdasarkanJabatanDanPendidikanPegawai = listBerdasarkanJabatanDanPendidikanPegawai;
  }
  hapusMasaKerjaPendidikanPegawai(row) {
    let listBerdasarkanMasaKerjaDanPendidikanPegawai = [...this.listBerdasarkanMasaKerjaDanPendidikanPegawai];
    listBerdasarkanMasaKerjaDanPendidikanPegawai.splice(row, 1);
    this.listBerdasarkanMasaKerjaDanPendidikanPegawai = listBerdasarkanMasaKerjaDanPendidikanPegawai;
  }
  disabledTgl(event) {
		if (event == true) {
            this.form.get('tglAkhirBerlakuSk').enable();
            this.form.get('tglAkhirBerlakuSk').setValidators(Validators.required);
        } else {
            this.form.get('tglAkhirBerlakuSk').clearValidators();
            this.form.get('tglAkhirBerlakuSk').setValue('');
            this.form.get('tglAkhirBerlakuSk').disable();
        }
	}
}

class InisialPegawaiStrukturGaji implements PegawaiStrukturGaji {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public kdGolonganPegawai?,
    public kdKomponenHarga?,
    public hargaSatuan?,
    public kdOperatorRate?,
    public statusEnabled?,
    public noRec?,
    public status1?,
    public version?
  ) { }

}


