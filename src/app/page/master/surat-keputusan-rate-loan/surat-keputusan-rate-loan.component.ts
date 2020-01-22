import { Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/primeng';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { SuratKeputusanRateLoan } from './surat-keputusan-rate-loan.interface';
import { Validators, FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService } from '../../../global';


@Component({
  selector: 'app-surat-keputusan-rate-loan',
  templateUrl: './surat-keputusan-rate-loan.component.html',
  styleUrls: ['./surat-keputusan-rate-loan.component.scss'],
  providers: [ConfirmationService]
})
export class SuratKeputusanRateLoanComponent implements OnInit {

  item: SuratKeputusanRateLoan = new InisialSuratKeputusanRateLoan();;
  selected: SuratKeputusanRateLoan;
  listData: SuratKeputusanRateLoan[];
  listKomponenGaji: any[];
  komponenGajiData: any;
  komponenGaji: any;
  kodeKategoryPegawai: SuratKeputusanRateLoan[];
  kodeRangeMasaKerja: SuratKeputusanRateLoan[];
  kodeRangePinjaman: SuratKeputusanRateLoan[];
  kodeProdukLoan: SuratKeputusanRateLoan[];
  kodeCaraBayar: SuratKeputusanRateLoan[];
  kodeJenisBunga: SuratKeputusanRateLoan[];
  kodeJenisSukuBunga: SuratKeputusanRateLoan[];
  kodeRange: SuratKeputusanRateLoan[];
  kodeRangeWaktu: SuratKeputusanRateLoan[];
  kodeKomponenGaji: SuratKeputusanRateLoan[];
  kodeMetodePembayaran: SuratKeputusanRateLoan[];
  kodeMetodeHitungBunga: SuratKeputusanRateLoan[];
  kodeOperatorFactorRate: SuratKeputusanRateLoan[];
  datakomponenBiaya: SuratKeputusanRateLoan[];
  jenisDokumen: SuratKeputusanRateLoan[];
  kategoryDokumen: SuratKeputusanRateLoan[];


  pencarian: string = '';
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  form2: FormGroup;  
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  resFile: string;
  namaFile: string;
  maxQtyCicilan: number;
  komponenBiaya: any;
  cekKomponenBiaya: boolean;
  btnKomponenBiaya: boolean;
  listDataKomponenBiaya: any[];
  biayaLainnya: any;
  cekBiayaLainnya: any;
  btnBiayaLainnya: any;
  listDataBiayaLainnya: any[];
  dokumen: any;
  cekDokumen: any;
  btnDokumen: any;
  listDataDokumen: any[];
  tipePinjaman: SuratKeputusanRateLoan[];
  dataSK: any[];
  statusAdded: SuratKeputusanRateLoan[];
  tipeBiayaLainnya: any[];
  statusKomponen: any;
  statusBiaya: any;
  statusDokumen: any;


  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngOnInit() {
  // this.versi = null;
  this.listKomponenGaji = [];
  this.formAktif = true;
  this.get(this.page, this.rows, '');
  this.form = this.fb.group({
    'noSK': new FormControl(''),
    'noSKInternal': new FormControl(''),
    'namaSuratKeputusan': new FormControl(),
    'tglBerlakuAwal': new FormControl(''),
    'tglBerlakuAkhir': new FormControl(''),
    'kdRange': new FormControl('', Validators.required),
    'kdRangeWaktu': new FormControl('', Validators.required),
    'persenSukuBunga': new FormControl('', Validators.required),
    'factorRate': new FormControl(''),
    'operatorFactorRate': new FormControl(''),
    'rumusPerhitungan': new FormControl(''),
    'keteranganLainnya': new FormControl(),
    'statusEnabled': new FormControl()
  });
  this.form.get('tglBerlakuAwal').disable();
  this.form.get('tglBerlakuAkhir').disable();
}
dis(){
  this.form2 = this.fb.group({
    'kdKomponenGaji': new FormControl({ value: '', disabled: true }),
    'komponenGaji': new FormControl(false, Validators.required),
    'factorRateMaxTotalLoanKomponenGaji': new FormControl({ value: '', disabled: true }),
    'factorRateMaxTotalCicilanKomponenGaji': new FormControl({ value: '', disabled: true }),
  });
}
filterSk(event) {
  this.httpService.get(Configuration.get().dataMaster+'/suratKeputusanRateLoan/findSKRateLoan?namaSK='+event.query).subscribe(res => {
    this.dataSK = res.result;
  });
}
pilihSK(event) {
    //this.form.get('namaSK').setValue(event.namaSK);
    this.form.get('noSK').setValue(event.noSK);
    this.form.get('noSKInternal').setValue(event.noSKIntern);
    this.form.get('tglBerlakuAwal').setValue(new Date(event.tglBerlakuAwal * 1000));
    if(event.tglBerlakuAkhir != null) {
      this.form.get('tglBerlakuAkhir').setValue(new Date(event.tglBerlakuAkhir * 1000));
    }
    else {
      this.form.get('tglBerlakuAkhir').setValue(null)
    }
  }
  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMaster+'/suratKeputusanRateLoan/findSKRateLoan?namaSK=').subscribe(res => {
      this.dataSK = res.result;
    });
    this.httpService.get(Configuration.get().dataMaster + '/suratKeputusanRateLoan/findAll?page='+page+'&rows='+rows+'&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.suratKeputusanRateLoan;
    });

    //dropdown

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KategoryPegawai&select=id.kode,%20namaKategoryPegawai&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      console.log(res.data.data);
      this.kodeKategoryPegawai = [];
      this.kodeKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode })
      };

    });
    this.httpService.get(Configuration.get().dataMaster +'/service/list-generic?table=Range&select=id.kode,%20namaRange&page=1&rows=300&criteria=kdJenisRange&values=4&condition=and&profile=y').subscribe(
      result => {
        this.kodeRangePinjaman = []
        for (var i = 0; i < result.data.data.length; i++) {
          this.kodeRangePinjaman.push({ label: result.data.data[i].namaRange, value: result.data.data[i].id_kode })
        };
      }
      )

    //Configuration.get().dataMaster + '/service/list-generic?table=Range&select=id.kode,%20namaRange&page=1&rows=300&criteria=kdJenisRange&values=5&condition=and&profile=y'

    this.httpService.get(Configuration.get().dataMaster + '/suratKeputusanRateLoan/findRangeWaktuPinjaman').subscribe(res => {
      this.kodeRangeMasaKerja = [];
//      this.kodeRangeMasaKerja.push({ label: '-- Pilih --', value: null })
for (var i = 0; i < res.data.length; i++) {
  this.kodeRangeMasaKerja.push({ label: res.data[i].namaRange, value: res.data[i].id.kode })
};
});

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=CaraBayar&select=id.kode,%20namaCaraBayar&page=1&rows=300&criteria=id.kode&values=7&condition=and&profile=y').subscribe(res => {
      this.kodeCaraBayar = [];
      //this.kodeCaraBayar.push({ label: '--Pilih Cara Bayar--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeCaraBayar.push({ label: res.data.data[i].namaCaraBayar, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisBunga&select=id.kode,%20namaJenisBunga&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeJenisBunga = [];
      this.kodeJenisBunga.push({ label: '--Pilih Jenis Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisBunga.push({ label: res.data.data[i].namaJenisBunga, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisSukuBunga&select=id.kode,%20namaJenisSukuBunga&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeJenisSukuBunga = [];
      this.kodeJenisSukuBunga.push({ label: '--Pilih Jenis Suku Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisSukuBunga.push({ label: res.data.data[i].namaJenisSukuBunga, value: res.data.data[i].id_kode })
      };
    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=MetodePembayaran&select=id.kode,%20namaMetodePembayaran&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeMetodePembayaran = [];
      this.kodeMetodePembayaran.push({ label: '--Pilih Metode Pembayaran--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeMetodePembayaran.push({ label: res.data.data[i].namaMetodePembayaran, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=MetodePerhitungan&select=id.kode,%20namaMetodeHitung&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kodeMetodeHitungBunga = [];
      this.kodeMetodeHitungBunga.push({ label: '--Pilih Metode Hitung Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeMetodeHitungBunga.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id_kode })
      };

    });
    /*this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Type&select=id.kode,%20namaType&page=1&rows=300&profile=1').subscribe(res => {
      this.tipePinjaman = [];
      this.tipePinjaman.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.tipePinjaman.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id_kode })
      };

    });*/
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Komponen&select=id.kode,%20namaKomponen&page=1&rows=300&criteria=kdJenisKomponen&values=6&condition=and&profile=y').subscribe(res => {
      this.datakomponenBiaya = [];
      this.datakomponenBiaya.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.datakomponenBiaya.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i] })
      };

    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=KategoryDokumen&select=id.kode,%20namaKategoryDokumen&page=1&rows=300&criteria=id.kode&values=2&condition=and&profile=y').subscribe(res => {
      this.kategoryDokumen = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.kategoryDokumen.push({ label: res.data.data[i].namaKategoryDokumen, value: res.data.data[i] })
      };
      console.log(this.kategoryDokumen);

    });
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisDokumen&select=id.kode,%20namaJenisDokumen&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jenisDokumen = [];
      this.jenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jenisDokumen.push({ label: res.data.data[i].namaJenisDokumen, value: res.data.data[i] })
      };

    });

    /*this.httpService.get(Configuration.get().dataMaster + '/masterLoan/findProduk?kdJenisProduk=4').subscribe(res => {
      this.tipePinjaman = [];
      this.tipePinjaman.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.result.length; i++) {
        this.tipePinjaman.push({ label: res.result[i].namaProduk, value: res.result[i].kode })
      };
      this.tipeBiayaLainnya = [];
      this.tipeBiayaLainnya.push({ label: '--Pilih Tipe Pinjaman--', value: '' })
      for (var i = 0; i < res.result.length; i++) {
        this.tipeBiayaLainnya.push({ label: res.result[i].namaProduk, value: res.result[i] })
      };
      //console.log(this.tipePinjaman);

    });*/

    this.kodeOperatorFactorRate = [];
    this.kodeOperatorFactorRate.push({ label: '--Pilih Operator Factor Rate--', value: '' });
    this.kodeOperatorFactorRate.push({ label: "+", value: '+' });
    this.kodeOperatorFactorRate.push({ label: "-", value: '-' });
    this.kodeOperatorFactorRate.push({ label: "X", value: 'X' });
    this.kodeOperatorFactorRate.push({ label: "/", value: '/' });

  }

  cari() {
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/SuratKeputusanRateLoan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&produkLoan=' + this.pencarian).subscribe(table => {
      this.listData = table.data.result;
    });
  }
  kdKomponen(kode){
    console.log(kode);
  }
  ConvertToInt(val) {
    return parseInt(val);
  }
  changeKomponenGaji(event) {
    if (event == true) {
      this.form2.get('kdKomponenGaji').enable();
      this.form2.get('factorRateMaxTotalCicilanKomponenGaji').enable();
      this.form2.get('factorRateMaxTotalLoanKomponenGaji').enable();

    } else {

      this.form2.get('kdKomponenGaji').disable();
      this.form2.get('factorRateMaxTotalCicilanKomponenGaji').disable();
      this.form2.get('factorRateMaxTotalLoanKomponenGaji').disable();
      this.form2.get('kdKomponenGaji').setValue('');
      this.form2.get('factorRateMaxTotalCicilanKomponenGaji').setValue('');
      this.form2.get('factorRateMaxTotalLoanKomponenGaji').setValue('');


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

  onSubmitKomponen() {
    if (this.form2.invalid) {
      this.validateAllFormFields(this.form2);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.addSementara();
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
    let dataSimpan = {
      "factorRate": this.form.get('factorRate').value,
      "kdRange": this.form.get('kdRange').value,
      "kdRangeWaktu": this.form.get('kdRangeWaktu').value,
      "keteranganLainnya": this.form.get('keteranganLainnya').value,
      "noSK": this.form.get('noSK').value,
      "operatorFactorRate": this.form.get('operatorFactorRate').value,
      "persenSukuBunga": this.form.get('persenSukuBunga').value,
      "rumusPerhitungan": this.form.get('rumusPerhitungan').value,
      "statusEnabled": this.form.get('statusEnabled').value
    }
    this.httpService.update(Configuration.get().dataMaster + '/suratKeputusanRateLoan/update', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      //this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  addSementara(){
    let listKomponenGaji = [...this.listKomponenGaji];
    this.komponenGaji = {
      "kdKomponenGaji": this.form2.get('kdKomponenGaji').value.kode,
      "namaKomponenGaji": this.form2.get('kdKomponenGaji').value.namaKomponen,      
      "factorRateMaxTotalLoanKomponenGaji": this.form2.get('factorRateMaxTotalLoanKomponenGaji').value,
      "factorRateMaxTotalCicilanKomponenGaji": this.form2.get('factorRateMaxTotalCicilanKomponenGaji').value,      
    }
    listKomponenGaji.push(this.komponenGaji);
    this.listKomponenGaji = listKomponenGaji;
    console.log(this.listKomponenGaji);
  }
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let dataSimpan = {
        "factorRate": this.form.get('factorRate').value,
        "kdRange": this.form.get('kdRange').value,
        "kdRangeWaktu": this.form.get('kdRangeWaktu').value,
        "keteranganLainnya": this.form.get('keteranganLainnya').value,
        "noSK": this.form.get('noSK').value,
        "operatorFactorRate": this.form.get('operatorFactorRate').value,
        "persenSukuBunga": this.form.get('persenSukuBunga').value,
        "rumusPerhitungan": this.form.get('rumusPerhitungan').value,
        "statusEnabled": this.form.get('statusEnabled').value
      }
      this.httpService.post(Configuration.get().dataMaster + '/suratKeputusanRateLoan/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
        //this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }
  getKomponenGaji(){

  }
  onRowSelect(event) {
    this.dataSK = [];
    this.dataSK.push({namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir});
    let cloned = this.clone(event.data);
    let clonednoSK = cloned.noSK;

    this.form.get('noSK').setValue(event.data.noSK)
    this.form.get('noSKInternal').setValue(event.data.noSKIntern)
    this.form.get('namaSuratKeputusan').setValue(this.dataSK[0])
    let tglawal = new Date(event.data.tglBerlakuAwal*1000)
    let tglakhir = new Date(event.data.tglBerlakuAkhir*1000)
    this.form.get('tglBerlakuAwal').setValue(tglawal)
    if (event.data.tglBerlakuAkhir == null){
      this.form.get('tglBerlakuAkhir').setValue(null)
    }
    else{
    this.form.get('tglBerlakuAkhir').setValue(tglakhir)      
    }
    this.form.get('kdRange').setValue(event.data.kdRange)
    this.form.get('kdRangeWaktu').setValue(event.data.kdRangeWaktu)
    this.form.get('persenSukuBunga').setValue(event.data.persenSukuBunga)
    this.form.get('factorRate').setValue(event.data.factorRate)
    this.form.get('operatorFactorRate').setValue(event.data.operatorFactorRate)
    this.form.get('rumusPerhitungan').setValue(event.data.rumusPerhitungan)
    this.form.get('keteranganLainnya').setValue(event.data.keteranganLainnya)
    this.form.get('statusEnabled').setValue(event.data.statusEnabled)

    // console.log(clonednoSK);
    this.formAktif = false;
    // this.form.setValue(cloned);
    
  }

  clone(cloned: SuratKeputusanRateLoan): SuratKeputusanRateLoan {
    let hub = new InisialSuratKeputusanRateLoan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialSuratKeputusanRateLoan();
    fixHub = {
      "noSK": hub.noSK,
      "noSKInternal": hub.noSKIntern,
      "namaSuratKeputusan": this.dataSK[0],
      "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
      "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
      "kdRange": hub.kdRange,
      "kdRangeWaktu": hub.kdRangeWaktu,
      "persenSukuBunga": hub.persenSukuBunga,
      "factorRate": hub.factorRate,
      "operatorFactorRate": hub.operatorFactorRate,
      "rumusPerhitungan": hub.rumusPerhitungan,
      "keteranganLainnya": hub.keteranganLainnya,
      // "kdKomponenGaji": hub.kdKomponenGaji,

      // "factorRateMaxTotalCicilanKomponenGaji": hub.factorRateMaxTotalCicilanKomponenGaji,
      // "factorRateMaxTotalLoanKomponenGaji": hub.factorRateMaxTotalLoanKomponenGaji,
      // "komponenGaji": hub.komponenGaji,
      "statusEnabled": hub.statusEnabled,




    }
    //this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataHr1Mod1 + '/SuratKeputusanRateLoan/del/' + deleteItem.noSK).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

}
class InisialSuratKeputusanRateLoan implements SuratKeputusanRateLoan {

  constructor(
    public noSK?,
    public namaSK?,
    public noSKInternal?,
    public noSKIntern?,
    public tglBerlakuAwal?,
    public tglBerlakuAkhir?,
    public kdRangeMasaKerja?,
    public kdProdukLoan?,
    public maxTotalLoan?,

    public factorRateMaxTotalLoan?,
    public maxTotalCicilan?,
    public factorRateMaxTotalCicilan?,
    public kdJenisBunga?,
    public kdCaraBayar?,
    public kdJenisSukuBunga?,
    public kdMetodeHitungBunga?,
    public kdMetodePembayaran?,
    public maxQtyCicilan?,
    public kdRange?,
    public kdRangeWaktu?,
    public persenSukuBunga?,
    public factorRate?,
    public operatorFactorRate?,
    public rumusPerhitungan?,

    public kdKomponenGaji?,
    public factorRateMaxTotalCicilanKomponenGaji?,
    public factorRateMaxTotalLoanKomponenGaji?,
    public komponenGaji?,
    public statusEnabled?,
    public kdKategoryPegawai?,
    public kdMetodeBayar?,
    public kdMetodeHitung?,
    public version?,
    public keteranganLainnya?,
    public namaSuratKeputusan?


    ) { }

}