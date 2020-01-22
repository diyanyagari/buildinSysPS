import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MasterPegawaiSkHitungPayroll } from './master-pegawai-sk-hitung-payroll.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'app-master-pegawai-sk-hitung-payroll',
  templateUrl: './master-pegawai-sk-hitung-payroll.component.html',
  styleUrls: ['./master-pegawai-sk-hitung-payroll.component.scss'],
  providers: [ConfirmationService, DatePipe]

})
export class MasterPegawaiSkHitungPayrollComponent implements OnInit {
  selected: MasterPegawaiSkHitungPayroll;
  listData: any[];
  listHarga: any[];
  kategoriPegawai: any[];
  masaKerja: any[];
  komponenGaji: any[];
  periode: any[];
  caraBayar: any[];
  versi: any;
  form: FormGroup;
  formAktif: boolean;
  cekKomponenHargaTake: boolean;
  btnKomponenHargaTake: boolean;
  items: MenuItem[];
  pencarian: string;
  report: any;
  namaSK: SelectItem[];
  rekananPenjamin: SelectItem[];
  komponenHarga: SelectItem[];
  operatorFactorRate: SelectItem[];
  checked: boolean = true;
  metodeHitung: any;
  page: number;
  rows: number;
  totalRecords: any;
  tglHariRaya: any[];
  prorate: number;
  selectedKategori: any[];
  selectedRange: any[];
  selectedKomponenGaji: any[];
  ProRate: boolean;
  CekProRate: any;
  tglBayar: any[];
  tglBayarMax: any[];
  listGolonganPegawai: any[];
  listPangkat: any[];
  ceklisKomponen: boolean;
  kdKategoriPegawai: any;
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  smbrFile:any;

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private datePipe: DatePipe,
    private route: Router,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService
    ) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngOnInit() {
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    // this.listHarga = [];
    this.formAktif = true;
    // this.ceklisKomponen = false;
    // this.cekKomponenHargaTake = true;
    // this.btnKomponenHargaTake = true;
    this.kdKategoriPegawai = null;
    this.get(this.page, this.rows);
    this.form = this.fb.group({
      'namaSK': new FormControl('', Validators.required),
      'noSK': new FormControl(''),
      'noSKIntern': new FormControl(''),
      'tglBerlakuSkDari': new FormControl('', Validators.required),
      'tglBerlakuSkSampai': new FormControl('', Validators.required),
      'kategoriPegawai': new FormControl('', Validators.required),
      'masaKerja': new FormControl('', Validators.required),
      'komponenGaji': new FormControl('', Validators.required),
      'isProRate': new FormControl(''),
      'qtyHariMinActive': new FormControl(''),
      // 'tglHariRaya': new FormControl(null),
      'kdPeriodeHead': new FormControl('', Validators.required),
      'persenHargaSatuan': new FormControl('', Validators.required),
      'caraBayar': new FormControl('', Validators.required),
      'tglBayar': new FormControl(''),
      'tglBayarMax': new FormControl(''),
      'qtyHariSlipGiven': new FormControl(''),
      'statusAktif': new FormControl('', Validators.required),
    });
    this.form.get('tglBerlakuSkDari').disable();
    this.form.get('tglBerlakuSkSampai').disable();


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

    this.getSmbrFile();

  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  ambilSK(sk) {
    if (this.form.get('namaSK').value == '' || this.form.get('namaSK').value == null || this.form.get('namaSK').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('noSKIntern').setValue(null);
      this.form.get('tglBerlakuSkSampai').setValue(null);
      this.form.get('tglBerlakuSkDari').setValue(null);
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('noSKIntern').setValue(detailSK[0].noSKIntern);
        this.form.get('tglBerlakuSkDari').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.form.get('tglBerlakuSkSampai').setValue(null);

        } else {
          this.form.get('tglBerlakuSkSampai').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

        }
      });
    }
  }
  getKelompokTransaksi() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }
  get(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
      this.listData = table.PegawaiSKHitungPayroll;
      this.totalRecords = table.totalRow;
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    },
    error => {
      this.namaSK = [];
      this.namaSK.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kategoriPegawai = [];
      this.kategoriPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
    },
    error => {
      this.kategoriPegawai = [];
      this.kategoriPegawai.push({ label: '-- ' + error + ' --', value: '' })
    });
    // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getRangeMasaKerja').subscribe(res => {
    //   this.masaKerja = [];
    //   for (var i = 0; i < res.data.length; i++) {
    //     this.masaKerja.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
    //   };
    //   this.selectedRange = this.masaKerja;
    // });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&select=id.kode,%20namaRange&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.masaKerja = [];
			// this.listRange.push({ label: '--Pilih Range Masa Kerja Pegawai--', value: '' });
			for (var i = 0; i < res.data.data.length; i++) {
				this.masaKerja.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id_kode })
			};
			this.selectedRange = this.masaKerja;
		},
			error => {
				this.masaKerja = [];
				this.masaKerja.push({ label: '-- ' + error + ' --', value: '' })
			});


    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getPeriode').subscribe(res => {
      this.periode = [];
      this.periode.push({ label: '--Pilih Periode--', value: '' })
      for (var i = 0; i < res.data.length; i++) {
        this.periode.push({ label: res.data[i].namaPeriode, value: res.data[i].kode })
      };
    },
    error => {
      this.periode = [];
      this.periode.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=CaraBayar&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.caraBayar = [];
      this.caraBayar.push({ label: '--Pilih Cara Bayar--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.caraBayar.push({ label: res.data.data[i].namaCaraBayar, value: res.data.data[i].id.kode })
      };
    },
    error => {
      this.caraBayar = [];
      this.caraBayar.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MetodePerhitungan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.metodeHitung = [];
      this.metodeHitung.push({ label: '--Pilih Komponen Harga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.metodeHitung.push({ label: res.data.data[i].namaMetodeHitung, value: res.data.data[i] })
      };
    },
    error => {
      this.metodeHitung = [];
      this.metodeHitung.push({ label: '-- ' + error + ' --', value: '' })
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getHL').subscribe(res => {
      this.tglHariRaya = [];
      this.tglHariRaya.push({ label: '--Pilih Tanggal Hari Raya--', value: null })
      for (var i = 0; i < res.data.length; i++) {
        let tglMentah = new Date(res.data[i].tanggal * 1000);
        let tglJadi = this.datePipe.transform(tglMentah, 'dd-MMM-y');
        this.tglHariRaya.push({ label: tglJadi + " " + res.data[i].namaHariLibur, value: res.data[i].kdTanggal })
      };
    });

    this.tglBayar = [];
    this.tglBayar.push({ label: '--Pilih Tanggal Bayar--', value: null });
    for (var i = 1; i <= 31; i++) {
      this.tglBayar.push({ label: i, value: i });
    }
    this.tglBayarMax = [];
    this.tglBayarMax.push({ label: '--Pilih Tanggal Bayar Max--', value: null });
    for (var i = 1; i <= 31; i++) {
      this.tglBayarMax.push({ label: i, value: i });
    }
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=GolonganPegawai&select=namaGolonganPegawai,id.kode').subscribe(res => {
      this.listGolonganPegawai = [];
      this.listGolonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i] })
      };
    });
  }
  // valuegolongan(newValue, ri) {
  //   console.log(ri);
  //   if (newValue == undefined || newValue == null) {
  //     return;
  //   } else {
  //     this.httpService.get(Configuration.get().dataHr2Mod3 + '/kebutuhan-pegawai/findPangkatPegawai/' + newValue.id_kode).subscribe(res => {
  //       this.listPangkat = [];
  //       this.listPangkat.push({ label: '--Pilih Pangkat--', value: '' })
  //       for (var i = 0; i < res.data.pangkat.length; i++) {
  //         this.listPangkat.push({ label: res.data.pangkat[i].namaPangkat, value: res.data.pangkat[i] })
  //       };
  //     });
  //   }
  // }

  valuechangeGetKomponen(event) {
    let kdKategoriPegawai = event.value;
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getKomponen/' + kdKategoriPegawai).subscribe(res => {
      this.komponenGaji = [];
      for (var i = 0; i < res.data.length; i++) {
        this.komponenGaji.push({ label: res.data[i].namaKomponen, value: res.data[i].kode });
      };
      this.selectedKomponenGaji = this.komponenGaji;
      
    },
    error => {
      this.komponenGaji = [];
      this.komponenGaji.push({ label: '-- ' + error + ' --', value: '' })
    });
    
  }

  valuechangeGetKomponenRowSelect(kdKategoriPegawai){
   this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/getKomponen/' + kdKategoriPegawai).subscribe(res => {
    this.komponenGaji = [];
    for (var i = 0; i < res.data.length; i++) {
      this.komponenGaji.push({ label: res.data[i].namaKomponen, value: res.data[i].kode });
    };
  },
  error => {
    this.komponenGaji = [];
    this.komponenGaji.push({ label: '-- ' + error + ' --', value: '' })
  });

 }
 cari() {
  this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&namaKategoryPegawai=' + this.pencarian).subscribe(table => {
    this.listData = table.PegawaiSKHitungPayroll;
  });
}
downloadExel() {
  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkHitungPayroll&select=id.kode,namaMasterPegawaiSkHitungPayroll').subscribe(table => {
    this.fileService.exportAsExcelFile(table.data.data, 'MasterPegawaiSkHitungPayroll');
  });

}

downloadPdf() {
  let cetak = Configuration.get().report + '/pegawaiSKHitungPayroll/laporanPegawaiSKHitungPayroll.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
  window.open(cetak);
    // var col = ["Kode", "Nama MasterPegawaiSkHitungPayroll"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MasterPegawaiSkHitungPayroll&select=id.kode,namaMasterPegawaiSkHitungPayroll').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master MasterPegawaiSkHitungPayroll", col, table.data.data, "MasterPegawaiSkHitungPayroll");

    // });

  }
  cetak() {
    console.log('tes');
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKHitungPayroll/laporanPegawaiSKHitungPayroll.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmPegawaiSkHitungPayroll_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }
  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Hitung Payroll');
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
    // this.httpService.delete(Configuration.get().dataMaster + '/pegawaiskpajak/del/' + deleteItem.noSK + '/' + deleteItem.kdObjekPajak + '/' + deleteItem.kdRange + '/' + deleteItem.kdKategoryPegawai + '/' + deleteItem.kdGolonganPegawai).subscribe(response => {
      console.log(deleteItem);
      this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/delAll/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdRangeMasaKerja + '/' + deleteItem.kode.kdKomponenHarga + '/' + deleteItem.kode.kdPeriodeHead).subscribe(response => {
      },
      error => {
        this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.form.get('komponenGaji').enable();
        this.reset();
      });

    }

    findSelectedIndex(): number {
      return this.listData.indexOf(this.selected);
    }

    reset() {
      this.form.get('kategoriPegawai').enable();
      this.form.get('masaKerja').enable();
      this.form.get('komponenGaji').enable();
      this.ceklisKomponen = false;
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
      let dataSimpan;
      if (this.form.get('isProRate').value == null || this.form.get('isProRate').value == undefined || this.form.get('isProRate').value == false) {
        this.prorate = 0;
      } else {
        this.prorate = 1;
      }

      dataSimpan =
      {
        "isProRate": this.prorate,
        "kdCaraBayar": this.form.get('caraBayar').value,
        "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
        "kdKomponenHarga": this.selectedKomponenGaji[0].value,
        "kdPeriodeHead": this.form.get('kdPeriodeHead').value,
        "kdRangeMasaKerja": this.selectedRange[0].value,
        // "kdTanggalHariRaya": this.form.get('tglHariRaya').value,
        "noSK": this.form.get('noSK').value,
        "persenHargaSatuan": this.form.get('persenHargaSatuan').value,
        "qtyHariMinActive": this.form.get('qtyHariMinActive').value,
        "statusEnabled": this.form.get('statusAktif').value,
        "tglBayar": null,
        "tglBayarMax": null,
        "qtyHariSlipGiven": null,

      }

      console.log(dataSimpan);

      this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/update/' + this.versi, dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    }

    simpan() {
      if (this.formAktif == false) {
        this.confirmUpdate()
      } else {
        let dataSimpan;

      // let kategoriPegawai = [];
      let range = [];
      let komponenGaji = [];
      // for (let i = 0; i < this.selectedKategori.length; i++) {
      //   kategoriPegawai.push({
      //     "kode": this.selectedKategori[i].value,
      //   })
      // }
      for (let i = 0; i < this.selectedRange.length; i++) {
        range.push({
          "kode": this.selectedRange[i].value,
        })
      }
      for (let i = 0; i < this.selectedKomponenGaji.length; i++) {
        komponenGaji.push({
          "kode": this.selectedKomponenGaji[i].value,
        })
      }

      if (this.form.get('isProRate').value == null || this.form.get('isProRate').value == undefined || this.form.get('isProRate').value == false) {
        this.prorate = 0;
      } else {
        this.prorate = 1;
      }
      let dataTemp = [{
        "kode": parseInt(this.form.get('kategoriPegawai').value)
      }]

      dataSimpan =
      {
        "isProRate": this.prorate,
        "kdCaraBayar": this.form.get('caraBayar').value,
        "kategoryPegawai": dataTemp,
        "kdKomponenHarga": komponenGaji,
        "kdPeriodeHead": this.form.get('kdPeriodeHead').value,
        "rangeMasaKerja": range,
          // "kdTanggalHariRaya": this.form.get('tglHariRaya').value,
          "noRec": "",
          "noSK": this.form.get('noSK').value,
          "persenHargaSatuan": this.form.get('persenHargaSatuan').value,
          "qtyHariMinActive": this.form.get('qtyHariMinActive').value,
          "qtyHariSlipGiven": null,
          "statusEnabled": this.form.get('statusAktif').value,
          "tglBayar": null,
          "tglBayarMax": null,
        }

        console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskhitungpayroll/saveRev', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });
      }

    }
    setTimeStamp(date) {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp;
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
    valuechange(newvalue) {
      this.report = newvalue;
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

      this.form.get('kategoriPegawai').disable();
      this.form.get('masaKerja').disable();
      this.form.get('komponenGaji').disable();
      // this.selectedKategori = [{
      //   label: event.data.namaKategoryPegawai,
      //   value: event.data.kode.kdKategoryPegawai
      // }];
      this.selectedRange = [{
        label: event.data.masaKerja,
        value: event.data.kode.kdRangeMasaKerja
      }];
      this.form.get('kategoriPegawai').setValue(event.data.kode.kdKategoryPegawai);
      this.valuechangeGetKomponenRowSelect(event.data.kode.kdKategoryPegawai);
      this.selectedKomponenGaji = [{ label: event.data.namaKomponenGaji, value: event.data.kdKomponenGaji }];
      if (event.data.isProRate == 1) {
        this.ProRate = true;
        this.CekProRate = 1;
      } else {
        this.ProRate = false;
        this.CekProRate = 0;
      }
      this.form.get('caraBayar').setValue(event.data.kdCaraBayar);
      this.form.get('namaSK').setValue(event.data.kode.noSK);
      this.form.get('noSK').setValue(event.data.kode.noSK);
      this.form.get('noSKIntern').setValue(event.data.noSKIntern);
      // this.form.get('komponenGaji').setValue(event.data.kdKomponenGaji);
      this.form.get('isProRate').setValue(this.ProRate);
      this.form.get('qtyHariMinActive').setValue(event.data.qtyHariMinActive);
      // this.form.get('tglHariRaya').setValue(event.data.kdTanggalHariRaya);
      ///adanya kdperiodehead
      this.form.get('kdPeriodeHead').setValue(event.data.kode.kdPeriodeHead);
      this.form.get('persenHargaSatuan').setValue(event.data.persenHargaSatuan);
      this.form.get('tglBayar').setValue(event.data.tglBayar);
      this.form.get('tglBayarMax').setValue(event.data.tglBayarMax);
      this.form.get('qtyHariSlipGiven').setValue(event.data.qtyHariSlipGiven);
      this.form.get('statusAktif').setValue(event.data.statusEnabled);
      if (event.data.tglBerlakuAkhir == null) {

      } else {
        this.form.get('tglBerlakuSkSampai').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

      }
      this.form.get('tglBerlakuSkDari').setValue(new Date(event.data.tglBerlakuAwal * 1000));

      this.formAktif = false;

      this.versi = event.data.version;
      console.log(event);

    }


    clone(cloned: MasterPegawaiSkHitungPayroll): MasterPegawaiSkHitungPayroll {
      let hub = new InisialMasterPegawaiSkHitungPayroll();
      for (let prop in cloned) {
        hub[prop] = cloned[prop];
      }
      let fixHub = new InisialMasterPegawaiSkHitungPayroll();
      fixHub = {
        "namaSK": hub.kode.noSK,
        "noSK": hub.kode.noSK,
        "tglBerlakuSkDari": new Date(hub.tglBerlakuAwal * 1000),
        "tglBerlakuSkSampai": new Date(hub.tglBerlakuAkhir * 1000),
        "kategoriPegawai": hub.kode.kdKategoryPegawai,
        "masaKerja": hub.kode.kdRangeMasaKerja,
        "komponenGaji": hub.kdKomponenGaji,
        "isProRate": hub.isProRate,
        "qtyHariMinActive": hub.qtyHariMinActive,
        "tglHariRaya": new Date(hub.tanggalHariRaya * 1000),
        "kdPeriodeHead": hub.kdPeriodeHead,
        "persenHargaSatuan": hub.persenHargaSatuan,
        "caraBayar": hub.kdCaraBayar,
        "tglBayar": new Date(hub.tglBayar * 1000),
        "tglBayarMax": new Date(hub.tglBayarMax * 1000),
        "qtyHariSlipGiven": hub.qtyHariSlipGiven,
        "statusAktif": hub.statusEnabled,
      }
    // this.versi = hub.version;
    return fixHub;
  }


}
class InisialMasterPegawaiSkHitungPayroll implements MasterPegawaiSkHitungPayroll {
  constructor(
    public kode?,
    public namaSK?,
    public noSK?,
    public tglBerlakuSkDari?,
    public tglBerlakuSkSampai?,
    public kategoriPegawai?,
    public masaKerja?,
    public komponenGaji?,
    public isProRate?,
    public qtyHariMinActive?,
    public tglHariRaya?,
    public periode?,
    public persenHargaSatuan?,
    public caraBayar?,
    public tglBayar?,
    public tglBayarMax?,
    public qtyHariSlipGiven?,
    public statusAktif?,
    public statusEnabled?,
    public kdCaraBayar?,
    public kdPeriodeHead?,
    public tanggalHariRaya?,
    public tglBerlakuAkhir?,
    public tglBerlakuAwal?,
    public kdKomponenGaji?,
    ) { }
}

