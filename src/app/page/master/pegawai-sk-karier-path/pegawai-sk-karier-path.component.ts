import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkKarierPath } from './pegawai-sk-karier-path.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService  } from '../../../global';

@Component({
  selector: 'app-pegawai-sk-karier-path',
  templateUrl: './pegawai-sk-karier-path.component.html',
  styleUrls: ['./pegawai-sk-karier-path.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkKarierPathComponent implements OnInit {
  selected: PegawaiSkKarierPath;
  listData: any[];
  listKelompokEvaluasi: any[];
  listEvent: any[];
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  jenisPegawai: any[];
  jabatanAwal: any[];
  kategoriPegawai: any[];
  golonganPegawai: any[];
  pangkatAwal: any[];
  golonganPegawaiAwal: any[];
  pangkatBefore: any[];
  pangkatNext: any[];
  golonganPegawaiNext: any[];
  jabatanNext: any[];
  rangeMasaKerja: any[];
  rangeTotalNilaiEvaluasi: any[];
  rangeDurasiEvent: any[];
  produkEvent: any[];
  event: any[];
  kelompokEvaluasi: any[];
  rangeTotalNilaiEvaluasiMin: any[];
  golonganPegawaiBefore: any[];

  page: number;
  rows: number;
  totalRecords: any;
  namaSK: SelectItem[];
  caraBayar: SelectItem[];
  eventEffect: SelectItem[];
  cekKelompokEvaluasi: any;
  btnKelompokEvaluasi: any;
  cekEvent: any;
  btnEvent: any;
  dataSK: any[];
  eventCeklis: any;
  kelompokEvaluasiCeklis: any;
  laporan: boolean = false;
	kdprof: any;
  kddept: any;
  codes:any[];


  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }


  ngOnInit() {
    
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;


    this.listKelompokEvaluasi = [];
    this.listEvent = [];
    this.formAktif = true;
    this.cekEvent = true;
    this.cekKelompokEvaluasi = true;
    this.btnKelompokEvaluasi = true;
    this.btnEvent = true;
    this.get(this.page, this.rows);
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

    this.form = this.fb.group({
      'namaSK': new FormControl(''),
      'noSK': new FormControl(''),
      'tglBerlakuAwal': new FormControl(''),
      'tglBerlakuAkhir': new FormControl(''),
      'kdKategoryPegawai': new FormControl('', Validators.required),
      'kdJenisPegawai': new FormControl('', Validators.required),
      'kdJabatanAwal': new FormControl('', Validators.required),
      'kdPangkatAwal': new FormControl('', Validators.required),
      'kdGolonganPegawaiAwal': new FormControl('', Validators.required),
      'kdGolonganPegawaiBefore': new FormControl(''),
      'kdPangkatBefore': new FormControl(''),
      'kdPangkatNext': new FormControl(''),
      'kdJabatanNext': new FormControl(''),
      'kdRangeMasaKerja': new FormControl(''),
      'hasilEvaluasiMin': new FormControl(''),
      'totalNilaiEvaluasiMin': new FormControl(''),
      'kdRangeTotalNilaiEvaluasiMin': new FormControl(''),
      'kdGolonganPegawaiNext': new FormControl(''),
      'kelompokEvaluasiCeklis': new FormControl(),
      'eventCeklis': new FormControl(),
      'statusEnabled': new FormControl('', Validators.required),

    });
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
  }

  get(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/findAll?page=' + page + '&rows=' + rows + '&dir=suratKeputusan.namaSK&sort=desc').subscribe(table => {
      this.listData = table.PegawaiSKKarirPath;
      this.totalRecords = table.totalRow;

    });

    // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/getSK').subscribe(res => {
    //   this.namaSK = [];
    //   this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
    //   for (var i = 0; i < res.SK.length; i++) {
    //     this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
    //   };
    // });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jenisPegawai = [];
      this.jenisPegawai.push({ label: '--Pilih Jenis Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jenisPegawai.push({ label: res.data.data[i].namaJenisPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jabatanAwal = [];
      this.jabatanAwal.push({ label: '--Pilih Jabatan Awal--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jabatanAwal.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kategoriPegawai = [];
      this.kategoriPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.golonganPegawai = [];
      this.golonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.golonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.golonganPegawaiAwal = [];
      this.golonganPegawaiAwal.push({ label: '--Pilih Golongan Pegawai Awal--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.golonganPegawaiAwal.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.golonganPegawaiBefore = [];
      this.golonganPegawaiBefore.push({ label: '--Pilih Golongan Pegawai Before--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.golonganPegawaiBefore.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.golonganPegawaiNext = [];
      this.golonganPegawaiNext.push({ label: '--Pilih Golongan Pegawai Next--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.golonganPegawaiNext.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=MetodePembayaran&select=id.kode,%20namaMetodePembayaran&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.caraBayar = [];
      this.caraBayar.push({ label: '--Pilih Cara Bayar--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.caraBayar.push({ label: res.data.data[i].namaMetodePembayaran, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jabatanNext = [];
      this.jabatanNext.push({ label: '--Pilih Jabatan Next--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jabatanNext.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
      };
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.pangkatNext = [];
      this.pangkatNext.push({ label: '--Pilih Pangkat Next--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.pangkatNext.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.pangkatAwal = [];
      this.pangkatAwal.push({ label: '--Pilih Pangkat Awal--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.pangkatAwal.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i].id.kode })
      };
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.pangkatBefore = [];
      this.pangkatBefore.push({ label: '--Pilih Pangkat Before--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.pangkatBefore.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&page=1&rows=300&&criteria=kdJenisRange&values=2&condition=and&profile=y').subscribe(res => {
      this.rangeMasaKerja = [];
      this.rangeMasaKerja.push({ label: '--Pilih Masa Kerja--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.rangeMasaKerja.push({ label: res.data.data[i].namaRange, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.rangeTotalNilaiEvaluasiMin = [];
      this.rangeTotalNilaiEvaluasiMin.push({ label: '--Pilih Range Total Nilai Evaluasi Min--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.rangeTotalNilaiEvaluasiMin.push({ label: res.data.data[i].namaRange, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.rangeDurasiEvent = [];
      this.rangeDurasiEvent.push({ label: '--Pilih Range Durasi Event--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.rangeDurasiEvent.push({ label: res.data.data[i].namaRange, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Produk&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.produkEvent = [];
      this.produkEvent.push({ label: '--Pilih Produk Event--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.produkEvent.push({ label: res.data.data[i].namaProduk, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Event&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.event = [];
      this.event.push({ label: '--Pilih Event--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.event.push({ label: res.data.data[i].namaEvent, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KelompokEvaluasi&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kelompokEvaluasi = [];
      this.kelompokEvaluasi.push({ label: '--Pilih Kelompok Evaluasi--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kelompokEvaluasi.push({ label: res.data.data[i].namaKelompokEvaluasi, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Range&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.rangeTotalNilaiEvaluasi = [];
      this.rangeTotalNilaiEvaluasi.push({ label: '--Pilih Range Total Nilai Evaluasi Min--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.rangeTotalNilaiEvaluasi.push({ label: res.data.data[i].namaRange, value: res.data.data[i] })
      };
    });


  }

  filterSk(event) {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/findByNamaSK?namaSK=' + event.query).subscribe(res => {
      this.dataSK = res.PegawaiSKKarirPath;
    });
  }

  pilihSK(event) {
    //this.form.get('namaSK').setValue(event.namaSK);
    this.form.get('noSK').setValue(event.noSK);
    this.form.get('tglBerlakuAwal').setValue(new Date(event.tglBerlakuAwal * 1000));
    if (event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
      this.form.get('tglBerlakuAkhir').setValue(new Date(event.tglBerlakuAkhir * 1000));
    }
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPegawaiSkKarierPath&sort=desc&namaPegawaiSkKarierPath`=' + this.pencarian).subscribe(table => {
      this.listData = table.PegawaiSKKarirPath;
    });
  }

  downloadExel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=PegawaiSkKarierPath&select=id.kode,namaPegawaiSkKarierPath').subscribe(table => {
    //   this.fileService.exportAsExcelFile(table.data.data, 'PegawaiSkKarierPath');
    // });

  }

  downloadPdf() {

    let cetak = Configuration.get().report + '/pegawaiSKKarirPath/laporanPegawaiSKKarirPath.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
        window.open(cetak);
    // var col = ["Kode", "Nama PegawaiSkKarierPath"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=PegawaiSkKarierPath&select=id.kode,namaPegawaiSkKarierPath').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master PegawaiSkKarierPath", col, table.data.data, "PegawaiSkKarierPath");

    // });

  }

  cetak(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKKarirPath/laporanPegawaiSKKarirPath.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmPegawaiSkKarirPath_laporanCetak');

}
tutupLaporan() {
    this.laporan = false;
}

  tambahKelompokEvaluasi() {
    let dataTemp = {
      "kelompok": {
        "namaKelompokEvaluasi": "--Pilih Kelompok Evaluasi--",
        "kdKelompokEvaluasi": " ",
      },

      "hasilEvaluasiMin": "",
      "nilaiHasilEvaluasiMin": "",
      "rangeTotal": {
        "id": "",
        "namaRange": "--Pilih Range Total Nilai Evaluasi Min--",
      },
      "keteranganLainnya": "",
      "statusAktif": "",
      "no": null,

    }
    let listKelompokEvaluasi = [...this.listKelompokEvaluasi];
    listKelompokEvaluasi.push(dataTemp);
    this.listKelompokEvaluasi = listKelompokEvaluasi;
  }

  hapusRow(row) {
    let listKelompokEvaluasi = [...this.listKelompokEvaluasi];
    listKelompokEvaluasi.splice(row, 1);
    this.listKelompokEvaluasi = listKelompokEvaluasi;
  }

  tambahEvent() {
    let dataTemp = {
      "event": {
        "namaEvent": "--Pilih Event--",
        "kdEvent": '',
      },
      "produkEvent": {
        "id": "",
        "namaProduk": "--Pilih Produk Event--",
      },
      "rangeEvent": {
        "id": "",
        "namaRange": "-Pilih Range Durasi Event--",
      },
      "keteranganLainnya": "",
      "statusAktif": "",
      "no": null,

    }
    let listEvent = [...this.listEvent];
    listEvent.push(dataTemp);
    this.listEvent = listEvent;
  }

  hapusRow2(row) {
    let listEvent = [...this.listEvent];
    listEvent.splice(row, 1);
    this.listEvent = listEvent;
  }

  getKelompokEvaluasi(event) {
    if (event) {
      this.cekKelompokEvaluasi = false;
      this.btnKelompokEvaluasi = false;
    } else {
      this.cekKelompokEvaluasi = true;
      this.btnKelompokEvaluasi = true;
      if (this.listKelompokEvaluasi.length > 0) {
        return this.listKelompokEvaluasi = [];
      }
    }
  }

  getEvent(event) {
    if (event) {
      this.cekEvent = false;
      this.btnEvent = false;
    } else {
      this.cekEvent = true;
      this.btnEvent = true;
      if (this.listEvent.length > 0) {
        return this.listEvent = [];
      }
    }
  }

  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Karier Path');
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

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdJenisPegawai + '/' + deleteItem.kode.kdJabatanAwal
      + '/' + deleteItem.kode.kdPangkatAwal + '/' + deleteItem.kode.kdGolonganPegawaiAwal).subscribe(response => {
      },
      error => {
        this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.reset();
      });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.form.get('eventCeklis').enable();
    this.form.get('kelompokEvaluasiCeklis').enable();
    this.formAktif = true;
    this.selected = null;
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
    let dataTempEvaluasi = [];
    let dataTempEvent = [];
    for (let i = 0; i < this.listKelompokEvaluasi.length; i++) {
      dataTempEvaluasi.push({
        "kdKelompokEvaluasi": this.listKelompokEvaluasi[i].kelompok.id.kode,
        "hasilEvaluasiMin": this.listKelompokEvaluasi[i].hasilEvaluasiMin,
        "nilaiHasilEvaluasiMin": this.listKelompokEvaluasi[i].nilaiHasilEvaluasiMin,
        "kdRangeNilaiHasilEvaluasiMin": this.listKelompokEvaluasi[i].rangeTotal.id.kode,
        "keteranganLainnya": this.listKelompokEvaluasi[i].keteranganLainnya,
        "statusEnabled": this.listKelompokEvaluasi[i].statusAktif,

        // "kdGolonganPegawaiAwal": this.form.get('kdGolonganPegawaiAwal').value,
        // "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
        // "kdJabatanAwal": this.form.get('kdJabatanAwal').value,
        // "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
        // "kdPangkatAwal": this.form.get('kdPangkatAwal').value,

      })
    }

    for (let i = 0; i < this.listEvent.length; i++) {
      dataTempEvent.push({
        "kdEvent": this.listEvent[i].event.id.kode,
        "kdProdukEvent": this.listEvent[i].produkEvent.id.kode,
        "kdRangeDurasiEvent": this.listEvent[i].rangeEvent.id.kode,
        "keteranganLainnya": this.listEvent[i].keteranganLainnya,
        "statusEnabled": this.listEvent[i].statusAktif,

        // "kdGolonganPegawaiAwal": this.form.get('kdGolonganPegawaiAwal').value,
        // "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
        // "kdJabatanAwal": this.form.get('kdJabatanAwal').value,
        // "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
        // "kdPangkatAwal": this.form.get('kdPangkatAwal').value,
        // "kdRangeTotalNilaiEvaluasiMin": this.form.get('kdRangeTotalNilaiEvaluasiMin').value,

      })
    }

    let fixHub = {
      "pegawaiSKKarirPathK": dataTempEvaluasi,
      "pegawaiSKKarirPathEvent": dataTempEvent,
      "noSK": this.form.get('noSK').value,
      "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
      "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
      "kdJabatanAwal": this.form.get('kdJabatanAwal').value,
      "kdPangkatAwal": this.form.get('kdPangkatAwal').value,
      "kdGolonganPegawaiAwal": this.form.get('kdGolonganPegawaiAwal').value,
      "kdGolonganPegawaiBefore": this.form.get('kdGolonganPegawaiBefore').value,
      "kdPangkatBefore": this.form.get('kdPangkatBefore').value,
      "kdPangkatNext": this.form.get('kdPangkatNext').value,
      "kdJabatanNext": this.form.get('kdJabatanNext').value,
      "kdRangeMasaKerja": this.form.get('kdRangeMasaKerja').value,
      "hasilEvaluasiMin": this.form.get('hasilEvaluasiMin').value,
      "totalNilaiEvaluasiMin": this.form.get('totalNilaiEvaluasiMin').value,
      "kdRangeTotalNilaiEvaluasiMin": this.form.get('kdRangeTotalNilaiEvaluasiMin').value,
      "kdGolonganPegawaiNext": this.form.get('kdGolonganPegawaiNext').value,
      "statusEnabled": this.form.get('statusEnabled').value,




    }
    console.log(fixHub);

    this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/update/1', fixHub).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let dataTempEvaluasi = [];
      let dataTempEvent = [];
      for (let i = 0; i < this.listKelompokEvaluasi.length; i++) {
        dataTempEvaluasi.push({
          "kdKelompokEvaluasi": this.listKelompokEvaluasi[i].kelompok.id.kode,
          "hasilEvaluasiMin": this.listKelompokEvaluasi[i].hasilEvaluasiMin,
          "nilaiHasilEvaluasiMin": this.listKelompokEvaluasi[i].nilaiHasilEvaluasiMin,
          "kdRangeNilaiHasilEvaluasiMin": this.listKelompokEvaluasi[i].rangeTotal.id.kode,
          "keteranganLainnya": this.listKelompokEvaluasi[i].keteranganLainnya,
          "statusEnabled": this.listKelompokEvaluasi[i].statusAktif,

          // "kdGolonganPegawaiAwal": this.form.get('kdGolonganPegawaiAwal').value,
          // "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
          // "kdJabatanAwal": this.form.get('kdJabatanAwal').value,
          // "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
          // "kdPangkatAwal": this.form.get('kdPangkatAwal').value,

        })
      }

      for (let i = 0; i < this.listEvent.length; i++) {
        dataTempEvent.push({
          "kdEvent": this.listEvent[i].event.id.kode,
          "kdProdukEvent": this.listEvent[i].produkEvent.id.kode,
          "kdRangeDurasiEvent": this.listEvent[i].rangeEvent.id.kode,
          "keteranganLainnya": this.listEvent[i].keteranganLainnya,
          "statusEnabled": this.listEvent[i].statusAktif,

          // "kdGolonganPegawaiAwal": this.form.get('kdGolonganPegawaiAwal').value,
          // "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
          // "kdJabatanAwal": this.form.get('kdJabatanAwal').value,
          // "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
          // "kdPangkatAwal": this.form.get('kdPangkatAwal').value,
          // "kdRangeTotalNilaiEvaluasiMin": this.form.get('kdRangeTotalNilaiEvaluasiMin').value,

        })
      }

      let fixHub = {
        "pegawaiSKKarirPathK": dataTempEvaluasi,
        "pegawaiSKKarirPathEvent": dataTempEvent,
        "noSK": this.form.get('noSK').value,
        "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
        "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
        "kdJabatanAwal": this.form.get('kdJabatanAwal').value,
        "kdPangkatAwal": this.form.get('kdPangkatAwal').value,
        "kdGolonganPegawaiAwal": this.form.get('kdGolonganPegawaiAwal').value,
        "kdGolonganPegawaiBefore": this.form.get('kdGolonganPegawaiBefore').value,
        "kdPangkatBefore": this.form.get('kdPangkatBefore').value,
        "kdPangkatNext": this.form.get('kdPangkatNext').value,
        "kdJabatanNext": this.form.get('kdJabatanNext').value,
        "kdRangeMasaKerja": this.form.get('kdRangeMasaKerja').value,
        "hasilEvaluasiMin": this.form.get('hasilEvaluasiMin').value,
        "totalNilaiEvaluasiMin": this.form.get('totalNilaiEvaluasiMin').value,
        "kdRangeTotalNilaiEvaluasiMin": this.form.get('kdRangeTotalNilaiEvaluasiMin').value,
        "kdGolonganPegawaiNext": this.form.get('kdGolonganPegawaiNext').value,
        "statusEnabled": this.form.get('statusEnabled').value,




      }

      this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/save', fixHub).subscribe(response => {
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


  getKelompok(dataPeg) {
    //console.log(dataPeg);
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/findByKode/' + dataPeg.data.kode.noSK).subscribe(table => {
      this.listKelompokEvaluasi = [];
      for (var i = 0; i < table.PegawaiSKKarirPathK.length; ++i) {
        let data = {
          kelompok: {
            id: { kode: table.PegawaiSKKarirPathK[i].kode.kdKelompokEvaluasi },
            namaKelompokEvaluasi: table.PegawaiSKKarirPathK[i].namaKelompokEvaluasi
          },
          hasilEvaluasiMin: table.PegawaiSKKarirPathK[i].hasilEvaluasiMin,
          nilaiHasilEvaluasiMin: table.PegawaiSKKarirPathK[i].nilaiHasilEvaluasiMin,
          keteranganLainnya: table.PegawaiSKKarirPathK[i].keteranganLainnya,
          rangeTotal: {
            id: { kode: table.PegawaiSKKarirPathK[i].kdRangeNilaiHasilEvaluasiMin },
            namaRange: table.PegawaiSKKarirPathK[i].namaRangeNilaiHasilEvaluasiMin,
            kdRange: table.PegawaiSKKarirPathK[i].kdRangeNilaiHasilEvaluasiMin
          },
          statusAktif: table.PegawaiSKKarirPathK[i].statusEnabled
        }
        this.listKelompokEvaluasi.push(data);
      }
      // console.log(this.listKelompokEvaluasi);
      this.cekKelompokEvaluasi = false;
      this.btnKelompokEvaluasi = false;
      /*let kelompokEvaluasi = table.PegawaiSKKarirPathK;
      this.listKelompokEvaluasi = [];
    
      let dataFix
      for (let i = 0; i < kelompokEvaluasi.length; i++) {
        dataFix =
          {
            "kelompok ": {
              "kode": kelompokEvaluasi[i].kode.kdKelompokEvaluasi ,
              "namaKelompokEvaluasi": kelompokEvaluasi[i].namaKelompokEvaluasi,
              // "kdKelompokEvaluasi": kelompokEvaluasi[i].kode.kdKelompokEvaluasi,
            },
            "hasilEvaluasiMin": kelompokEvaluasi[i].hasilEvaluasiMin,
            "totalNilaiEvaluasiMin": kelompokEvaluasi[i].totalNilaiEvaluasiMin,
            "keteranganLainnya": kelompokEvaluasi[i].keteranganLainnya,
            "rangeTotal": {
              "id": { "kode": kelompokEvaluasi[i].kode.kdRange },
              "kdRange": kelompokEvaluasi[i].kode.kdRange,
              "namaRange": kelompokEvaluasi[i].namaRange,
            },
           
            "statusAktif": kelompokEvaluasi[i].statusEnabled,
            // "noSK": event[i].kode.noSK,

          }
        this.listKelompokEvaluasi.push(dataFix);
       
      }
      this.cekKelompokEvaluasi = false;
      this.btnKelompokEvaluasi = false;*/

    });
  }

  getEventRow(dataPeg) {
    // console.log(dataPeg);
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskkarirpath/findByKode/' + dataPeg.data.kode.noSK).subscribe(table => {
      this.listEvent = [];
      for (var i = 0; i < table.PegawaiSKKarirPathEvents.length; ++i) {
        let data = {
          event: {
            id: { kode: table.PegawaiSKKarirPathEvents[i].kode.kdEvent },
            namaEvent: table.PegawaiSKKarirPathEvents[i].namaEvent,
            kdEvent: table.PegawaiSKKarirPathEvents[i].kode.kdEvent
          },
          keteranganLainnya: table.PegawaiSKKarirPathEvents[i].keteranganLainnya,
          produkEvent: {
            id: { kode: table.PegawaiSKKarirPathEvents[i].kode.kdProdukEvent },
            namaProduk: table.PegawaiSKKarirPathEvents[i].namaProdukEvent,
            kdProdukEvent: table.PegawaiSKKarirPathEvents[i].kode.kdProdukEvent
          },
          rangeEvent: {
            id: { kode: table.PegawaiSKKarirPathEvents[i].kdRangeDurasiEvent },
            namaRange: table.PegawaiSKKarirPathEvents[i].namaRangeDurasiEvent,
            kdRangeDurasiEvent: table.PegawaiSKKarirPathEvents[i].kdRangeDurasiEvent
          },
          statusAktif: table.PegawaiSKKarirPathEvents[i].statusEnabled
        }
        this.listEvent.push(data);
      }
      this.cekEvent = false;
      this.btnEvent = false;


      // let event = table.PegawaiSKKarirPathEvents;
      // this.listEvent = [];

      // let dataFix
      // for (let i = 0; i < event.length; i++) {
      //   dataFix =
      //     {
      //       "event": {
      //         "id": { "kode": event[i].kode.kdEvent },
      //         "namaEvent": event[i].namaEvent,
      //         "kdEvent": event[i].kode.kdEvent,
      //       },
      //       "produkEvent": {
      //         "id": { "kode": event[i].kode.kdProdukEvent },
      //         "namaProdukEvent": event[i].namaProdukEvent,
      //         "kdProdukEvent": event[i].kode.kdProdukEvent,
      //       },
      //       "rangeEvent": {
      //         "id": { "kode": event[i].kode.kdRangeDurasiEvent },
      //         "namaRangeDurasiEvent": event[i].namaRangeDurasiEvent,
      //         "kdRangeDurasiEvent": event[i].kode.kdRangeDurasiEvent,
      //       },
      //       "keteranganLainnya": event[i].keteranganLainnya,
      //       "statusAktif": event[i].statusEnabled,


      //     }
      //   this.listEvent.push(dataFix);

      // }
      // this.cekEvent = false;
      // this.btnEvent = false;

    });
  }

  onRowSelect(event) {
    this.dataSK = [];
    this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
    this.formAktif = false;
    let cloned = this.clone(event.data);
    this.form.setValue(cloned);

    this.getKelompok(event);
    this.getEventRow(event);
  }

  clone(cloned: PegawaiSkKarierPath): PegawaiSkKarierPath {
    let hub = new InisialPegawaiSkKarierPath();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPegawaiSkKarierPath();
    if (this.listEvent.length == 0) {
      this.eventCeklis = false
    } else {
      this.form.get('eventCeklis').setValue(true);
      this.eventCeklis = true;
      this.form.get('eventCeklis').disable();
    }
    // console.log(this.eventCeklis)
    if (this.listKelompokEvaluasi.length == 0) {
      this.kelompokEvaluasiCeklis = false
    } else {
      this.form.get('kelompokEvaluasiCeklis').setValue(true);
      this.kelompokEvaluasiCeklis = true;
      this.form.get('kelompokEvaluasiCeklis').disable();
    }
    // console.log(this.kelompokEvaluasiCeklis)
    fixHub = {
      "namaSK": this.dataSK[0],
      "noSK": hub.noSK,
      "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
      "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
      "kdKategoryPegawai": hub.kode.kdKategoryPegawai,
      "kdJenisPegawai": hub.kode.kdJenisPegawai,
      "kdJabatanAwal": hub.kode.kdJabatanAwal,
      "kdPangkatAwal": hub.kode.kdPangkatAwal,
      "kdGolonganPegawaiAwal": hub.kode.kdGolonganPegawaiAwal,
      "kdGolonganPegawaiBefore": hub.kdGolonganPegawaiBefore,
      "kdPangkatBefore": hub.kdPangkatBefore,
      "kdPangkatNext": hub.kdPangkatNext,
      "kdJabatanNext": hub.kdJabatanNext,
      "kdRangeMasaKerja": hub.kdRangeMasaKerja,
      "hasilEvaluasiMin": hub.hasilEvaluasiMin,
      "totalNilaiEvaluasiMin": hub.totalNilaiEvaluasiMin,
      "kdRangeTotalNilaiEvaluasiMin": hub.kdRangeTotalNilaiEvaluasiMin,
      "kdGolonganPegawaiNext": hub.kdGolonganPegawaiNext,
      "statusEnabled": hub.statusEnabled,
      "kelompokEvaluasiCeklis": this.kelompokEvaluasiCeklis,
      "eventCeklis": this.eventCeklis,

    }
    this.versi = hub.version;
    return fixHub;
  }


}

class InisialPegawaiSkKarierPath implements PegawaiSkKarierPath {
  constructor(
    public namaSK?,
    public noSK?,
    public tglBerlakuSkDari?,
    public tglBerlakuAwal?,
    public tglBerlakuSkSampai?,
    public tglBerlakuAkhir?,
    public kdJenisPegawai?,
    public kdKategoryPegawai?,
    public kdJabatanAwal?,
    public kdPangkatAwal?,
    public kdGolonganPegawaiAwal?,
    public kdGolonganPegawaiBefore?,
    public kdPangkatBefore?,
    public kdPangkatNext?,
    public kdJabatanNext?,
    public kdRangeMasaKerja?,
    public hasilEvaluasiMin?,
    public totalNilaiEvaluasiMin?,
    public kdRangeTotalNilaiEvaluasiMin?,
    public kdGolonganPegawaiNext?,
    public version?,
    public kode?,
    public statusEnabled?,
    public kelompokEvaluasiCeklis?,
    public eventCeklis?,
  ) { }
}


