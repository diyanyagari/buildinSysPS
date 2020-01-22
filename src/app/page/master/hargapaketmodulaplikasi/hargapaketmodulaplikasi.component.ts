import { Inject, forwardRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { HargaPaketModulAplikasi } from './hargapaketmodulaplikasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";
@Component({
  selector: 'app-hargapaketmodulaplikasi',
  templateUrl: 'hargapaketmodulaplikasi.component.html',
  styleUrls: ['hargapaketmodulaplikasi.component.scss'],
  providers: [ConfirmationService]
})
export class HargaPaketModulAplikasiComponent implements OnInit {

  @ViewChild('filterSK') filterSK;
  @ViewChild('filterPaket') filterPaket;
  @ViewChild('filterEdisi') filterEdisi;
  @ViewChild('filterMdlAplikasi') filterMdlAplikasi;
  @ViewChild('filterKelompokKlien') filterKelompokKlien;
  @ViewChild('filterVersion') filterVersion;
  @ViewChild('filterMataUang') filterMataUang;
  @ViewChild('filterOp') filterOp;

  item: HargaPaketModulAplikasi = new InisialHargaPaketModulAplikasi();
  selected: HargaPaketModulAplikasi;
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
  smbrFile: any;
  namaSK: any;
  dropdownpaket: any;
  dropdownmodulAplikasi: any;
  dropdownkelompokKlien: any;
  dropdownedisi: any;
  dropdownversion: any;
  dropdownmataUang: any;
  listOperatorFactorRate: any;
  enMessage: boolean = false;
  factorRate;
  operatorFactorRate;
  diskonHarga = true;
  persenHarga = true;
  hargaSatuan;

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    private route: Router,
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
      'kdPaket': new FormControl('', Validators.required),
      'namaSuratKeputusan': new FormControl(null, Validators.required),
      'kdModulAplikasi': new FormControl('', Validators.required),
      'kdVersion': new FormControl('', Validators.required),
      'kdEdisi': new FormControl('', Validators.required),
      'kdKelompokKlien': new FormControl('', Validators.required),
      'noSK': new FormControl('', Validators.required),
      'hargaNetto': new FormControl('', Validators.required),
      'hargaSatuan': new FormControl('', Validators.required),
      'messageHargaSatuanHide': new FormControl(''),
      'isHargaSatuanHide': new FormControl(null),
      'persenDiscount': new FormControl(null),
      'hargaDiscount': new FormControl(null),
      'factorRate': new FormControl('', Validators.required),
      'operatorFactorRate': new FormControl('', Validators.required),
      'qtyUserMin': new FormControl(null),
      'noSkIntern': new FormControl(null),
      'tglBerlakuAwal': new FormControl(null),
      'tglBerlakuAkhir': new FormControl(null),
      'qtyUserMax': new FormControl(null),
      'qtyProdukMin': new FormControl(null),
      'qtyProdukMax': new FormControl(null),
      'kdMataUang': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.form.get('messageHargaSatuanHide').disable();
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Exel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExel();
        }
      }];

    this.form.get('tglBerlakuAwal').disable();
    this.form.get('tglBerlakuAkhir').disable();
    this.form.get('factorRate').setValue(1);
    this.form.get('operatorFactorRate').setValue('x');
    this.factorRate = 1;
    this.operatorFactorRate = 'x'
    this.getSmbrFile();
    this.gets();
  }
  getKelompokTransaksi() {
    this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }
  gets() {

    this.listOperatorFactorRate = [];
    this.listOperatorFactorRate.push({ label: '--Pilih Operator--', value: '' })
    this.listOperatorFactorRate.push({ label: "+", value: "+" })
    this.listOperatorFactorRate.push({ label: "-", value: "-" })
    this.listOperatorFactorRate.push({ label: "x", value: "x" })
    this.listOperatorFactorRate.push({ label: "/", value: "/" })
    //sk
    this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/findSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });
    //paket
    this.httpService.get(Configuration.get().dataMasterNew + '/paket/findAllData').subscribe(res => {
      this.dropdownpaket = [];
      this.dropdownpaket.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.paket.length; i++) {
        this.dropdownpaket.push({ label: res.paket[i].namaPaket, value: res.paket[i].kode.kode })
      };
    });
    //modul aplikasi
    this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllData').subscribe(res => {
      this.dropdownmodulAplikasi = [];
      this.dropdownmodulAplikasi.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.ModulAplikasi.length; i++) {
        this.dropdownmodulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
      };
    });
    //edisi
    this.httpService.get(Configuration.get().dataMasterNew + '/edisi/findAllData').subscribe(res => {
      this.dropdownedisi = [];
      this.dropdownedisi.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownedisi.push({ label: res.data[i].namaEdisi, value: res.data[i].kode.kode })
      };
    });
    //kelompook klien
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokklien/findAllData').subscribe(res => {
      this.dropdownkelompokKlien = [];
      this.dropdownkelompokKlien.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownkelompokKlien.push({ label: res.data[i].namaKelompokKlien, value: res.data[i].kode.kode })
      };
    });

    //Versi
    this.httpService.get(Configuration.get().dataMasterNew + '/version/findAllData').subscribe(res => {
      this.dropdownversion = [];
      this.dropdownversion.push({ label: '--Pilih--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.dropdownversion.push({ label: res.data[i].namaVersion, value: res.data[i].kode })
      };
    });
    //matauang         
    this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAllMataUang').subscribe(res => {
      this.dropdownmataUang = [];
      this.dropdownmataUang.push({ label: '--Pilih Mata Uang--', value: '' })
      for (var i = 0; i < res.MataUang.length; i++) {
        this.dropdownmataUang.push({ label: res.MataUang[i].namaMataUang, value: res.MataUang[i].kode })
      };
    });

  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }


  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/findAll?page=' + page + '&rows=' + rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi=' + search).subscribe(table => {
      this.listData = table.HargaPaketModulAplikasi;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }


  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
      this.listData = table.HargaPaketModulAplikasi;
    });
  }
  valuechange(newValue) {
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc').subscribe(table => {
      this.listData = table.HargaPaketModulAplikasi;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        this.codes.push({

          kode: this.listData[i].kode.kode,

        })
      }

      this.fileService.exportAsExcelFile(this.codes, 'hargaPaketModulAplikasi');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/hargaPaketModulAplikasi/laporanHargaPaketModulAplikasi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  confirmDelete() {
    let k1 = this.form.get('kdPaket').value;
    let k2 = this.form.get('kdModulAplikasi').value;
    let k3 = this.form.get('kdVersion').value;
    let k4 = this.form.get('kdEdisi').value;
    let k5 = this.form.get('kdKelompokKlien').value;
    let k6 = this.form.get('noSK').value;
    if (k1 == null || k1 == undefined || k1 == "" ||
      k2 == null || k2 == undefined || k2 == "" ||
      k3 == null || k3 == undefined || k3 == "" ||
      k4 == null || k4 == undefined || k4 == "" ||
      k5 == null || k5 == undefined || k5 == "" ||
      k6 == null || k6 == undefined || k6 == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master HargaPaketModulAplikasi');
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/del/' + deleteItem.kdPaket + '/' + deleteItem.kdModulAplikasi + '/' + deleteItem.kdVersion + '/' + deleteItem.kdEdisi + '/' + deleteItem.kdKelompokKlien + '/' + deleteItem.noSK).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.form.get('namaSuratKeputusan').enable();
    this.form.get('kdPaket').enable();
    this.form.get('kdEdisi').enable();
    this.form.get('kdModulAplikasi').enable();
    this.form.get('kdVersion').enable();
    this.form.get('kdKelompokKlien').enable();
    this.form.get('messageHargaSatuanHide').disable();
    this.filterSK.filterValue = '';
    this.filterPaket.filterValue = '';
    this.filterEdisi.filterValue = '';
    this.filterMdlAplikasi.filterValue = '';
    this.filterKelompokKlien.filterValue = '';
    this.filterVersion.filterValue = '';
    this.filterMataUang.filterValue = '';
    this.filterOp.filterValue = '';
    this.ngOnInit();
    // this.factorRate = 1;
    // this.operatorFactorRate = 'x'                                                                                                                                                                                                                                                                                                                                
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
    this.form.get('namaSuratKeputusan').enable();
    this.form.get('kdPaket').enable();
    this.form.get('kdEdisi').enable();
    this.form.get('kdModulAplikasi').enable();
    this.form.get('kdVersion').enable();
    this.form.get('kdKelompokKlien').enable();
    if (this.form.value.isHargaSatuanHide) {
      this.form.value.isHargaSatuanHide = 1;
    } else {
      this.form.value.isHargaSatuanHide = 0;
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/update', this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);                                                                                                                                                                                                                                                                                            
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      if (this.form.value.isHargaSatuanHide) {
        this.form.value.isHargaSatuanHide = 1;
      } else {
        this.form.value.isHargaSatuanHide = 0;
      }
      // console.log(this.form.value)                                                                                                                                                                                                                                                                                                                          
      this.httpService.post(Configuration.get().dataMasterNew + '/hargapaketmodulaplikasi/save', this.form.value).subscribe(response => {
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
  ambilSK(sk) {
    if (this.form.get('namaSuratKeputusan').value == '' || this.form.get('namaSuratKeputusan').value == null || this.form.get('namaSuratKeputusan').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('noSkIntern').setValue(null);
      this.form.get('tglBerlakuAwal').setValue(null);
      this.form.get('tglBerlakuAkhir').setValue(null);
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/harganettodiscpasienpulang/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('noSkIntern').setValue(detailSK[0].noSKIntern);
        this.form.get('tglBerlakuAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.form.get('tglBerlakuAkhir').setValue(null);

        } else {
          this.form.get('tglBerlakuAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

        }
      });
    }
  }
  onRowSelect(event) {
    this.formAktif = false;
    this.form.get('namaSuratKeputusan').disable();
    this.form.get('kdPaket').disable();
    this.form.get('kdEdisi').disable();
    this.form.get('kdModulAplikasi').disable();
    this.form.get('kdVersion').disable();
    this.form.get('kdKelompokKlien').disable();
    // let cloned = this.clone(event.data);                                                                                                                                                                                                                                                                                                            
    // this.form.setValue(cloned);             
    this.form.get('kdPaket').setValue(event.data.kdPaket);
    this.form.get('kdModulAplikasi').setValue(event.data.kdModulAplikasi);
    this.form.get('kdVersion').setValue(event.data.kdVersion);
    this.form.get('kdEdisi').setValue(event.data.kdEdisi);
    this.form.get('kdKelompokKlien').setValue(event.data.kdKelompokKlien);
    this.form.get('noSK').setValue(event.data.noSK);
    this.form.get('hargaNetto').setValue(event.data.hargaNetto);
    this.form.get('hargaSatuan').setValue(event.data.hargaSatuan);
    this.form.get('persenDiscount').setValue(event.data.persenDiscount);
    this.form.get('hargaDiscount').setValue(event.data.hargaDiscount);
    this.form.get('factorRate').setValue(event.data.factorRate);
    this.form.get('operatorFactorRate').setValue(event.data.operatorFactorRate);
    this.form.get('qtyUserMin').setValue(event.data.qtyUserMin);
    this.form.get('qtyUserMax').setValue(event.data.qtyUserMax);
    this.form.get('qtyProdukMin').setValue(event.data.qtyProdukMin);
    this.form.get('qtyProdukMax').setValue(event.data.qtyProdukMax);
    this.form.get('namaSuratKeputusan').setValue(event.data.noSK);
    this.form.get('kdMataUang').setValue(event.data.kdMataUang);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('messageHargaSatuanHide').setValue(event.data.messageHargaSatuanHide);
    this.form.get('isHargaSatuanHide').setValue(event.data.isHargaSatuanHide);
    if (event.data.isHargaSatuanHide == 1) {
      this.form.get('messageHargaSatuanHide').enable();
    } else {
      this.form.get('messageHargaSatuanHide').disable();
    }
    this.ambilSK(this.form.get('namaSuratKeputusan'));
  }
  clone(cloned: HargaPaketModulAplikasi): HargaPaketModulAplikasi {
    let hub = new InisialHargaPaketModulAplikasi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialHargaPaketModulAplikasi();
    fixHub = {
      "kdPaket": hub.kdPaket,
      "kdModulAplikasi": hub.kdModulAplikasi,
      "kdVersion": hub.kdVersion,
      "kdEdisi": hub.kdEdisi,
      "kdKelompokKlien": hub.kdKelompokKlien,
      "noSK": hub.noSK,
      "hargaNetto": hub.hargaNetto,
      "hargaSatuan": hub.hargaSatuan,
      "persenDiscount": hub.persenDiscount,
      "hargaDiscount": hub.hargaDiscount,
      "factorRate": hub.factorRate,
      "operatorFactorRate": hub.operatorFactorRate,
      "qtyUserMin": hub.qtyUserMin,
      "qtyUserMax": hub.qtyUserMax,
      "qtyProdukMin": hub.qtyProdukMin,
      "qtyProdukMax": hub.qtyProdukMax,
      "kdMataUang": hub.kdMataUang,
      "namaSuratKeputusan": hub.noSK,
      "statusEnabled": hub.statusEnabled,
    }
    return fixHub;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/hargaPaketModulAplikasi/laporanHargaPaketModulAplikasi.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmHargaPaketModulAplikasi(_laporanCetak');
  }
  tutupLaporan() {
    this.laporan = false;
  }

  hargasensor() {
    if (this.enMessage) {
      this.form.get('messageHargaSatuanHide').enable();
    } else {
      this.form.value.messageHargaSatuanHide = '';
      this.form.get('messageHargaSatuanHide').disable();
    }
  }

  persenDiscountMinMax() {
    console.log(this.form.get('persenDiscount').value)
    if(this.form.get('persenDiscount').value != null) {
      this.diskonHarga = false;
    } else if (this.form.get('persenDiscount').value == null) {
      this.diskonHarga = true;
    }
  }

  hargaDiscountMinMax() {
    if(this.form.get('hargaDiscount').value != null) {
      this.persenHarga = false;
    } else if (this.form.get('hargaDiscount').value == null) {
      this.persenHarga = true;
    }
  }
}
class InisialHargaPaketModulAplikasi implements HargaPaketModulAplikasi {
  constructor(
    public kdPaket?,
    public kdModulAplikasi?,
    public kdVersion?,
    public kdEdisi?,
    public kdKelompokKlien?,
    public noSK?,
    public hargaNetto?,
    public hargaSatuan?,
    public persenDiscount?,
    public hargaDiscount?,
    public factorRate?,
    public operatorFactorRate?,
    public qtyUserMin?,
    public qtyUserMax?,
    public qtyProdukMin?,
    public qtyProdukMax?,
    public kdMataUang?,
    public statusEnabled?,
    public namaSuratKeputusan?,
  ) { }
}