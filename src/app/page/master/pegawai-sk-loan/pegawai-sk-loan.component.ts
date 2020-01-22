import { Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/primeng';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkLoan } from './/pegawai-sk-loan.interface';
import { Validators, FormControl, FormGroup, FormBuilder, } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService } from '../../../global';

@Component({
  selector: 'app-pegawai-sk-loan',
  templateUrl: './pegawai-sk-loan.component.html',
  styleUrls: ['./pegawai-sk-loan.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkLoanComponent implements OnInit {

  item: PegawaiSkLoan = new InisialPegawaiSkLoan();;
  selected: PegawaiSkLoan;
  listData: PegawaiSkLoan[];
  listKomponenGaji: any[];
  komponenGajiData: any;
  komponenGaji: any;
  kodeKategoryPegawai: PegawaiSkLoan[];
  kodeRangeMasaKerja: PegawaiSkLoan[];
  kodeProdukLoan: PegawaiSkLoan[];
  kodeCaraBayar: PegawaiSkLoan[];
  kodeJenisBunga: PegawaiSkLoan[];
  kodeJenisSukuBunga: PegawaiSkLoan[];
  kodeRange: PegawaiSkLoan[];
  kodeRangeWaktu: PegawaiSkLoan[];
  kodeKomponenGaji: PegawaiSkLoan[];
  kodeMetodePembayaran: PegawaiSkLoan[];
  kodeMetodeHitungBunga: PegawaiSkLoan[];
  kodeOperatorFactorRate: PegawaiSkLoan[];

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
      'namaSK': new FormControl('', Validators.required),
      'tglBerlakuAwal': new FormControl('', Validators.required),
      'tglBerlakuAkhir': new FormControl('', Validators.required),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'kdRangeMasaKerja': new FormControl('', Validators.required),
      'kdProdukLoan': new FormControl('', Validators.required),
      'maxTotalLoan': new FormControl('', Validators.required),
      'factorRateMaxTotalLoan': new FormControl(''),
      'maxTotalCicilan': new FormControl('', Validators.required),
      'factorRateMaxTotalCicilan': new FormControl(''),
      'kdCaraBayar': new FormControl('', Validators.required),
      'kdJenisBunga': new FormControl(''),
      'kdJenisSukuBunga': new FormControl(''),
      'kdMetodeHitungBunga': new FormControl(''),
      'kdMetodePembayaran': new FormControl(''),
      'maxQtyCicilan': new FormControl('', Validators.required),
      'kdRange': new FormControl('', Validators.required),
      'kdRangeWaktu': new FormControl('', Validators.required),
      'persenSukuBunga': new FormControl('', Validators.required),
      'factorRate': new FormControl('', Validators.required),
      'operatorFactorRate': new FormControl(''),
      'rumusPerhitungan': new FormControl(''),
      
      'statusEnabled': new FormControl(true)
    });
    this.form2 = this.fb.group({
      'kdKomponenGaji': new FormControl({ value: '', disabled: true }),
      'komponenGaji': new FormControl(false, Validators.required),
      'factorRateMaxTotalLoanKomponenGaji': new FormControl({ value: '', disabled: true }),
      'factorRateMaxTotalCicilanKomponenGaji': new FormControl({ value: '', disabled: true }),
    });
  }
  dis(){
    this.form2 = this.fb.group({
      'kdKomponenGaji': new FormControl({ value: '', disabled: true }),
      'komponenGaji': new FormControl(false, Validators.required),
      'factorRateMaxTotalLoanKomponenGaji': new FormControl({ value: '', disabled: true }),
      'factorRateMaxTotalCicilanKomponenGaji': new FormControl({ value: '', disabled: true }),
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows).subscribe(table => {
      this.listData = table.data.result;
    });

    //dropdown

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryPegawai&select=namaKategoryPegawai,id').subscribe(res => {
      this.kodeKategoryPegawai = [];
      this.kodeKategoryPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };

    });

    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findRangeMasaKerja' + '?kode=2').subscribe(res => {
      this.kodeRangeMasaKerja = [];
      this.kodeRangeMasaKerja.push({ label: '--Pilih Range Masa Kerja--', value: '' })
      for (var i = 0; i < res.data.result.length; i++) {
        this.kodeRangeMasaKerja.push({ label: res.data.result[i].namaRange, value: res.data.result[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findProdukLoan' + '?kode=4').subscribe(res => {
      this.kodeProdukLoan = [];
      this.kodeProdukLoan.push({ label: '--Pilih Produk Loan--', value: '' })
      for (var i = 0; i < res.data.result.length; i++) {
        this.kodeProdukLoan.push({ label: res.data.result[i].namaProduk, value: res.data.result[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=CaraBayar&select=namaCaraBayar,id').subscribe(res => {
      this.kodeCaraBayar = [];
      this.kodeCaraBayar.push({ label: '--Pilih Cara Bayar--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeCaraBayar.push({ label: res.data.data[i].namaCaraBayar, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisBunga&select=namaJenisBunga,id').subscribe(res => {
      this.kodeJenisBunga = [];
      this.kodeJenisBunga.push({ label: '--Pilih Jenis Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisBunga.push({ label: res.data.data[i].namaJenisBunga, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisSukuBunga&select=namaJenisSukuBunga,id').subscribe(res => {
      this.kodeJenisSukuBunga = [];
      this.kodeJenisSukuBunga.push({ label: '--Pilih Jenis Suku Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeJenisSukuBunga.push({ label: res.data.data[i].namaJenisSukuBunga, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findRangePinjaman' + '?kode=4').subscribe(res => {
      this.kodeRange = [];
      this.kodeRange.push({ label: '--Pilih Kota Range Pinjaman--', value: '' })
      for (var i = 0; i < res.data.result.length; i++) {
        this.kodeRange.push({ label: res.data.result[i].namaRange, value: res.data.result[i].kode })
      };
    });


    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findRangeWaktu' + '?kode=5').subscribe(res => {
      this.kodeRangeWaktu = [];
      this.kodeRangeWaktu.push({ label: '--Pilih Range Waktu--', value: '' })
      for (var i = 0; i < res.data.result.length; i++) {
        this.kodeRangeWaktu.push({ label: res.data.result[i].namaRange, value: res.data.result[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findKomponenGaji' + '?kode=6').subscribe(res => {
      this.kodeKomponenGaji = [];
      this.kodeKomponenGaji.push({ label: '--Pilih Komponen Gaji--', value: '' })
      for (var i = 0; i < res.data.result.length; i++) {
        this.kodeKomponenGaji.push({ label: res.data.result[i].namaKomponen, value: res.data.result[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MetodePembayaran&select=namaMetodePembayaran,id').subscribe(res => {
      this.kodeMetodePembayaran = [];
      this.kodeMetodePembayaran.push({ label: '--Pilih Metode Pembayaran--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeMetodePembayaran.push({ label: res.data.data[i].namaMetodePembayaran, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MetodePerhitungan&select=namaMetodeHitung,id').subscribe(res => {
      this.kodeMetodeHitungBunga = [];
      this.kodeMetodeHitungBunga.push({ label: '--Pilih Metode Hitung Bunga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeMetodeHitungBunga.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i].id.kdMetodeHitung })
      };

    });

    this.kodeOperatorFactorRate = [];
    this.kodeOperatorFactorRate.push({ label: '--Pilih Operator Factor Rate--', value: '' });
    this.kodeOperatorFactorRate.push({ label: "+", value: 'tambah' });
    this.kodeOperatorFactorRate.push({ label: "-", value: 'kurang' });
    this.kodeOperatorFactorRate.push({ label: "x", value: 'kali' });
    this.kodeOperatorFactorRate.push({ label: "/", value: 'bagi' });

  }

  cari() {
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&produkLoan=' + this.pencarian).subscribe(table => {
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
    let tglBerlakuAwal = this.setTimeStamp(this.form.get('tglBerlakuAwal').value)
    let tglBerlakuAkhir = this.setTimeStamp(this.form.get('tglBerlakuAkhir').value)
    let factorRate = this.ConvertToInt(this.form.get('factorRate').value)
    let factorRateMaxTotalCicilan = this.ConvertToInt(this.form.get('factorRateMaxTotalCicilan').value)
    let factorRateMaxTotalLoan = this.ConvertToInt(this.form.get('factorRateMaxTotalLoan').value)
    // let factorRateMaxTotalCicilanKomponenGaji = this.ConvertToInt(this.form.get('factorRateMaxTotalCicilanKomponenGaji').value)
    // let factorRateMaxTotalLoanKomponenGaji = this.ConvertToInt(this.form.get('factorRateMaxTotalLoanKomponenGaji').value)
    let maxTotalCicilan = this.ConvertToInt(this.form.get('maxTotalCicilan').value)
    let maxTotalLoan = this.ConvertToInt(this.form.get('maxTotalLoan').value)
    let persenSukuBunga = this.ConvertToInt(this.form.get('persenSukuBunga').value)
    let komponenGaji = this.form2.get('komponenGaji').value
    
    let Gaji = [];    
    for (let i=0;i<this.listKomponenGaji.length;i++){
      let data = {
        "factorRateMaxTotalCicilan": this.listKomponenGaji[i].factorRateMaxTotalCicilanKomponenGaji,
        "factorRateMaxTotalLoan": this.listKomponenGaji[i].factorRateMaxTotalLoanKomponenGaji,
        "kdKomponenHarga": this.listKomponenGaji[i].kdKomponenGaji,
        "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
        "kdProdukLoan": this.form.get('kdProdukLoan').value,
        "kdProfile": null,
        "kdRangeMasaKerja": this.form.get('kdRangeMasaKerja').value,
        "noSK": this.form.get('noSK').value
      }
      Gaji.push(data);
      }
    let formSubmit = this.form.value;
    formSubmit.pegawaiSKLoanDetailDto = Gaji;
    formSubmit.tglBerlakuAwal = tglBerlakuAwal;
    formSubmit.tglBerlakuAkhir = tglBerlakuAkhir;
    formSubmit.komponenGaji = komponenGaji;          
    formSubmit.factorRate = factorRate;
    formSubmit.factorRateMaxTotalCicilan = factorRateMaxTotalCicilan;
    formSubmit.factorRateMaxTotalLoan = factorRateMaxTotalLoan;
    // formSubmit.factorRateMaxTotalCicilanKomponenGaji = factorRateMaxTotalCicilanKomponenGaji;
    formSubmit.maxTotalCicilan = maxTotalCicilan;
    formSubmit.maxTotalLoan = maxTotalLoan;
    // formSubmit.factorRateMaxTotalLoanKomponenGaji = factorRateMaxTotalLoanKomponenGaji;
    formSubmit.persenSukuBunga = persenSukuBunga;
    this.httpService.update(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      this.get(this.page, this.rows, this.pencarian);
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
      let tglBerlakuAwal = this.setTimeStamp(this.form.get('tglBerlakuAwal').value)
      let tglBerlakuAkhir = this.setTimeStamp(this.form.get('tglBerlakuAkhir').value)
      let factorRate = this.ConvertToInt(this.form.get('factorRate').value)
      let factorRateMaxTotalCicilan = this.ConvertToInt(this.form.get('factorRateMaxTotalCicilan').value)
      let factorRateMaxTotalLoan = this.ConvertToInt(this.form.get('factorRateMaxTotalLoan').value)
      // let factorRateMaxTotalCicilanKomponenGaji = this.ConvertToInt(this.form.get('factorRateMaxTotalCicilanKomponenGaji').value)
      // let factorRateMaxTotalLoanKomponenGaji = this.ConvertToInt(this.form.get('factorRateMaxTotalLoanKomponenGaji').value)
      let maxTotalCicilan = this.ConvertToInt(this.form.get('maxTotalCicilan').value)
      let maxTotalLoan = this.ConvertToInt(this.form.get('maxTotalLoan').value)
      let persenSukuBunga = this.ConvertToInt(this.form.get('persenSukuBunga').value)
      let komponenGaji = this.form2.get('komponenGaji').value
      
      let Gaji = [];    
      for (let i=0;i<this.listKomponenGaji.length;i++){
        let data = {
          "factorRateMaxTotalCicilan": this.listKomponenGaji[i].factorRateMaxTotalCicilanKomponenGaji,
          "factorRateMaxTotalLoan": this.listKomponenGaji[i].factorRateMaxTotalLoanKomponenGaji,
          "kdKomponenHarga": this.listKomponenGaji[i].kdKomponenGaji,
          "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
          "kdProdukLoan": this.form.get('kdProdukLoan').value,
          "kdProfile": null,
          "kdRangeMasaKerja": this.form.get('kdRangeMasaKerja').value,
          "noSK": this.form.get('noSK').value
        }
    Gaji.push(data);
    }
      let formSubmit = this.form.value;
      formSubmit.pegawaiSKLoanDetailDto = Gaji;
      formSubmit.tglBerlakuAwal = tglBerlakuAwal;
      formSubmit.komponenGaji = komponenGaji;      
      formSubmit.tglBerlakuAkhir = tglBerlakuAkhir;
      formSubmit.factorRate = factorRate;
      formSubmit.factorRateMaxTotalCicilan = factorRateMaxTotalCicilan;
      formSubmit.factorRateMaxTotalLoan = factorRateMaxTotalLoan;
      formSubmit.maxTotalCicilan = maxTotalCicilan;
      formSubmit.maxTotalLoan = maxTotalLoan;
      formSubmit.persenSukuBunga = persenSukuBunga;

      this.httpService.post(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
        this.get(this.page, this.rows, this.pencarian);
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
    let cloned = this.clone(event.data);
    let clonednoSK = cloned.noSK;    
    console.log(clonednoSK);
    this.formAktif = false;
    this.form.setValue(cloned);
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/findAll?noSk='+clonednoSK).subscribe(table => {
      let listKomponenGaji = table.data.result;
      this.listKomponenGaji = listKomponenGaji[0].pegawaiSKLoanDetail;
      console.log(this.listKomponenGaji);
      this.dis()
    });
  }

  clone(cloned: PegawaiSkLoan): PegawaiSkLoan {
    let hub = new InisialPegawaiSkLoan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPegawaiSkLoan();
    fixHub = {
      "noSK": hub.noSK,
      "namaSK": hub.namaSK,
      "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
      "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
      "kdKategoryPegawai": hub.kdKategoryPegawai,
      "kdRangeMasaKerja": hub.kdRangeMasaKerja,
      "kdProdukLoan": hub.kdProdukLoan,
      "maxTotalLoan": hub.maxTotalLoan,
      "factorRateMaxTotalLoan": hub.factorRateMaxTotalLoan,
      "maxTotalCicilan": hub.maxTotalCicilan,

      "factorRateMaxTotalCicilan": hub.factorRateMaxTotalCicilan,
      "kdCaraBayar": hub.kdCaraBayar,
      "kdJenisBunga": hub.kdJenisBunga,
      "kdJenisSukuBunga": hub.kdJenisSukuBunga,
      "kdMetodeHitungBunga": hub.kdMetodeHitung,
      "kdMetodePembayaran": hub.kdMetodeBayar,
      "maxQtyCicilan": hub.maxQtyCicilan,
      "kdRange": hub.kdRange,
      "kdRangeWaktu": hub.kdRangeWaktu,
      "persenSukuBunga": hub.persenSukuBunga,
      "factorRate": hub.factorRate,
      "operatorFactorRate": hub.operatorFactorRate,
      "rumusPerhitungan": hub.rumusPerhitungan,
      // "kdKomponenGaji": hub.kdKomponenGaji,

      // "factorRateMaxTotalCicilanKomponenGaji": hub.factorRateMaxTotalCicilanKomponenGaji,
      // "factorRateMaxTotalLoanKomponenGaji": hub.factorRateMaxTotalLoanKomponenGaji,
      // "komponenGaji": hub.komponenGaji,
      "statusEnabled": true,




    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataHr1Mod1 + '/pegawaiSKLoan/del/' + deleteItem.noSK).subscribe(response => {
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
class InisialPegawaiSkLoan implements PegawaiSkLoan {

  constructor(
    public noSK?,
    public namaSK?,
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


  ) { }

}