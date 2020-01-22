import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ProfileSkKomponenGaji } from './profile-sk-komponen-gaji.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { isNumber } from 'util';
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile-sk-komponen-gaji',
  templateUrl: './profile-sk-komponen-gaji.component.html',
  styleUrls: ['./profile-sk-komponen-gaji.component.scss'],
  providers: [ConfirmationService]
})
export class ProfileSkKomponenGajiComponent implements OnInit {
  selected: ProfileSkKomponenGaji;
  listData: any[];
  listFasilitas: any[];
  listGP: any[];
  listGPMKP: any[];
  listJEP: any[];
  listJLT: any[];
  listJP: any[];
  listMKRH: any[];
  golonganPegawai: any[];
  pangkat: any[];
  jenisPegawai: any[];
  pendidikan: any[];
  rangeMasaKerja: any[];
  operatorFactorRate: any[];
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  namaSK: SelectItem[];
  kategoriPegawai: SelectItem[];
  tableRelasi: SelectItem[];
  jabatan: SelectItem[];
  fieldKeyTabelRelasi: SelectItem[];
  kondisiProduk: SelectItem[];
  komponenHarga: SelectItem[];
  checked: boolean = true;
  kondisi: any;
  page: number;
  rows: number;
  totalRecords: any;
  table: any;
  strukturG: any;
  levelTingkat: any[];
  rangeHargaGroup: any[];
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  dataEditHarga: boolean;
  dataEditTotal: boolean;
  smbrFile:any;
  listJ: any[];

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private route: Router,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }

  ngOnInit() {
    this.listGP = [];
    this.listGPMKP = [];
    this.listJEP = [];
    this.listJP = [];
    this.listJLT = [];
    this.listMKRH = [];
    this.listJ = [];
    this.table = "";
    this.formAktif = true;
    this.dataEditTotal = true;
		this.dataEditHarga = true;
    this.get(this.page, this.rows);
    this.form = this.fb.group({
      'namaSK': new FormControl('', Validators.required),
      'noSK': new FormControl({ value: '', disabled: true }),
      'noSkIntern': new FormControl(''),
      'tglBerlakuSkDari': new FormControl({ value: '', disabled: true }),
      'tglBerlakuSkSampai': new FormControl({ value: '', disabled: true }),
      'kategoriPegawai': new FormControl('', Validators.required),
      'komponenHarga': new FormControl('', Validators.required),
      'isByStruktur': new FormControl(false, Validators.required),
      'namaTabel': new FormControl({ value: '', disabled: true }),
      'FKCriteriaBy': new FormControl({ value: '', disabled: true }),
      'keteranganLainnya': new FormControl(''),
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

      this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  changeStruktur(event) {
    if (event == true) {
      this.form.get('namaTabel').enable();
      this.form.get('FKCriteriaBy').enable();
    } else {
      this.form.get('namaTabel').disable();
      this.form.get('FKCriteriaBy').disable();
    }
  }
  ambilTable(table) {
    this.table = table;
    console.log(table);
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  getKelompokTransaksi() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/profileskkomponengaji/getKelompokTransaksi').subscribe(table => {
    // 	let dataKelompokTransaksi = table.KelompokTransaksi;
    // 	 localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));	
    this.route.navigate(['/master-sk/surat-keputusan']);
    // });
  }

  get(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataMasterNew + '/profileskkomponengaji/findAll?page=' + page + '&rows=' + rows + '&dir=namaTabelStruktur&sort=desc').subscribe(
      table => {
        this.listData = table.ProfileSKKomponenGaji;
        let hasilfk: any[] = [];
        let fk;
        for (var i = 0; i < this.listData.length; i++) {
          if (this.listData[i].fKCriteriaBy) {
            fk = this.listData[i].fKCriteriaBy;
            fk.replace("[", "");
            fk.replace("]", "");
            fk.replace("\"", "");
            hasilfk = fk;
          }
        }
        console.log(hasilfk)
        // console.log(this.listData);
        this.totalRecords = table.totalRow;
      });
    this.httpService.get(Configuration.get().dataMasterNew + '/profileskkomponengaji/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.kategoriPegawai = [];
      this.kategoriPegawai.push({ label: '--Pilih Kategori Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kategoriPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/profileskkomponengaji/getKomponenHarga').subscribe(res => {
      this.komponenHarga = [];
      this.komponenHarga.push({ label: '--Pilih Komponen --', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.komponenHarga.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i].id_kode })
      };
      console.log(this.komponenHarga);
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=id.kode,namaGolonganPegawai&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.golonganPegawai = [];
      this.golonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.golonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pendidikan&select=id.kode,namaPendidikan&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.pendidikan = [];
      this.pendidikan.push({ label: '--Pilih Pendidikan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.pendidikan.push({ label: res.data.data[i].namaPendidikan, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkrh/getMasaKerja').subscribe(res => {
      this.rangeMasaKerja = [];
      this.rangeMasaKerja.push({ label: '--Pilih Masa Kerja--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.rangeMasaKerja.push({ label: res.data.data[i].namaRange, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=id.kode,namaPangkat&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.pangkat = [];
      this.pangkat.push({ label: '--Pilih Pangkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.pangkat.push({ label: res.data.data[i].namaPangkat, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=id.kode,namaJabatan&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jabatan = [];
      this.jabatan.push({ label: '--Pilih Jabatan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisPegawai&select=id.kode,namaJenisPegawai&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.jenisPegawai = [];
      this.jenisPegawai.push({ label: '--Pilih Jenis Pegawai--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.jenisPegawai.push({ label: res.data.data[i].namaJenisPegawai, value: res.data.data[i] })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=LevelTingkat&select=id.kode,namaLevelTingkat&page=1&rows=300&condition=and&profile=y').subscribe(res => {
      this.levelTingkat = [];
      this.levelTingkat.push({ label: '--Pilih Level Tingkat--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.levelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i] })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkrh/getRangeHarga').subscribe(res => {
      this.rangeHargaGroup = [];
      this.rangeHargaGroup.push({ label: '--Pilih Masa Group--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.rangeHargaGroup.push({ label: res.data.data[i].namaRange, value: res.data.data[i] })
      };
    });

    // this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findTabel').subscribe(
    //   table => {
    //     this.tableRelasi = [];
    //     for (var i = 0; i < table.Tabel.length; ++i) {
    //       this.tableRelasi.push({label: table.Tabel[i].namatabel, value: table.Tabel[i].namatabel});
    //     }
    // });
    this.httpService.get(Configuration.get().dataMaster + '/profileskkomponengaji/getTabel').subscribe(
      table => {
        this.tableRelasi = [];
        for (var i = 0; i < table.Tabel.length; ++i) {
          this.tableRelasi.push({ label: table.Tabel[i].namatabel, value: table.Tabel[i].namatabel });
        }
      });
    this.operatorFactorRate = [];
    this.operatorFactorRate.push({ label: '--Silahkan Pilih Operator--', value: '' })
    this.operatorFactorRate.push({ label: "+", value: { "kode": "+" } })
    this.operatorFactorRate.push({ label: "-", value: { "kode": "-" } })
    this.operatorFactorRate.push({ label: "x", value: { "kode": "x" } })
    this.operatorFactorRate.push({ label: "/", value: { "kode": "/" } })
  }
  getValueTable(value) {
    if (value != null) {
      // this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findPKFieldByTabel/' + value).subscribe(
      //   table => {
      //     this.fieldKeyTabelRelasi = [];
      //     for (var i = 0; i < table.Field.length; ++i) {
      //       this.fieldKeyTabelRelasi.push({label: table.Field[i].namaField, value: table.Field[i].namaField});
      //     }
      // });
      this.httpService.get(Configuration.get().dataMaster + '/profileskkomponengaji/getFK?namaTable=' + value).subscribe(
        table => {
          this.fieldKeyTabelRelasi = [];
          for (var i = 0; i < table.Field.length; ++i) {
            this.fieldKeyTabelRelasi.push({ label: table.Field[i].namaField, value: table.Field[i].namaField });
          }
          let tabelrelasi = [];
          for (var i=0; i<table.Field.length; i++) {
            tabelrelasi.push(table.Field[i].namaField)
          }
          this.form.get('FKCriteriaBy').setValue(tabelrelasi)
        });
      let halo = this.form.get('FKCriteriaBy').value
    }
  }
  cari(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataMasterNew + '/profileskkomponengaji/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=&ir=kategoryPegawai.namaKategoryPegawai&sort=desc&search=' + this.pencarian).subscribe(table => {
      this.listData = table.ProfileSKKomponenGaji;
      this.totalRecords = table.totalRow;
    });
  }
  downloadExel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=ProfileSkKomponenGaji&select=id.kode,namaProfileSkKomponenGaji').subscribe(table => {
    //   this.fileService.exportAsExcelFile(table.data.data, 'ProfileSkKomponenGaji');
    // });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/profileSKKomponenGaji/laporanProfileSKKomponenGaji.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama ProfileSkKomponenGaji"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=ProfileSkKomponenGaji&select=id.kode,namaProfileSkKomponenGaji').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master ProfileSkKomponenGaji", col, table.data.data, "ProfileSkKomponenGaji");

    // });

  }
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/profileSKKomponenGaji/laporanProfileSKKomponenGaji.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmProfileSkKomponenGaji_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }
  ambilSK(sk) {
    if (this.form.get('namaSK').value == '' || this.form.get('namaSK').value == null || this.form.get('namaSK').value == undefined) {
      this.form.get('noSK').setValue(null);
      this.form.get('noSkIntern').setValue(null);
      this.form.get('tglBerlakuSkDari').setValue(null);
      this.form.get('tglBerlakuSkSampai').setValue(null);
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/profileskkomponengaji/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        // console.log(detailSK); 
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('noSkIntern').setValue(detailSK[0].noSKIntern);
        this.form.get('tglBerlakuSkDari').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
        if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
          this.form.get('tglBerlakuSkSampai').setValue(null);

        } else {
          this.form.get('tglBerlakuSkSampai').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));

        }
      });
    }
  }
  confirmDelete() {
    let noSK = this.form.get('noSK').value;
    if (noSK == null || noSK == undefined || noSK == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Komponen Gaji');
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
    console.log(deleteItem);
    this.httpService.delete(Configuration.get().dataMasterNew + '/profileskkomponengaji/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
    },
      error => {
        this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Data');
        //   this.reset();
      });

    if (deleteItem.namaTabelStruktur == "ProfileStrukturGajiByGP_M") {

      this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibygp/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
      },
        error => {
          this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          // this.get(this.page, this.rows);
          //   this.reset();
        });

    } else if (deleteItem.namaTabelStruktur == "ProfileStrukturGajiByGPMKP_M") {

      this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibygpmkp/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
      },
        error => {
          this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          // this.get(this.page, this.rows);
          //   this.reset();
        });

    } else if (deleteItem.namaTabelStruktur == "ProfileStrukturGajiByJeP_M") {

      this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibyjep/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
      },
        error => {
          this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          // this.get(this.page, this.rows);
          //   this.reset();
        });

    } else if (deleteItem.namaTabelStruktur == "ProfileStrukturGajiByJP_M") {

      this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibyjp/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
      },
        error => {
          this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          // this.get(this.page, this.rows);
          // this.reset();
        });
    }
    else if (deleteItem.namaTabelStruktur == "ProfileStrukturGajiByJLT_M") {

      this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibyjlt/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
      },
        error => {
          this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          // this.get(this.page, this.rows);
          // this.reset();
        });
    }
    else if (deleteItem.namaTabelStruktur == "ProfileStrukturGajiByMKRH_M") {

      this.httpService.delete(Configuration.get().dataMasterNew + '/profilestrukturgajibymkrh/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdKategoryPegawai + '/' + deleteItem.kode.kdKomponenHarga).subscribe(response => {
      },
        error => {
          this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          // this.get(this.page, this.rows);
          // this.reset();
        });
    }
    this.get(this.page, this.rows);
    this.reset();

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.form.get('namaTabel').disable();
    this.ngOnInit();
    // this.form.get('kategoriPegawai').enable();
    // this.form.get('komponenHarga').enable();
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
    let profileSKKomponenGaji;
    let struktur;
    if (this.form.get('isByStruktur').value == true) {
      struktur = 1
      let criteria = JSON.stringify(this.form.get('FKCriteriaBy').value);
      profileSKKomponenGaji = {
        "fkcriteriaBy": criteria,
        "isByStruktur": struktur,
        "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
        "kdKomponenHarga": this.form.get('komponenHarga').value,
        "keteranganLainnya": this.form.get('keteranganLainnya').value,
        "namaTabelStruktur": this.form.get('namaTabel').value,
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.form.get('statusEnabled').value,

      }

    } else {
      struktur = 0
      this.form.get('FKCriteriaBy').clearValidators();
      this.form.get('namaTabel').clearValidators();
      this.form.get('isByStruktur').clearValidators();

      profileSKKomponenGaji = {
        "fkcriteriaBy": "",
        "isByStruktur": struktur,
        "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
        "kdKomponenHarga": this.form.get('komponenHarga').value,
        "keteranganLainnya": this.form.get('keteranganLainnya').value,
        "namaTabelStruktur": "",
        "noSK": this.form.get('noSK').value,
        "statusEnabled": this.form.get('statusEnabled').value
      }
      let dataSimpan
      dataSimpan = profileSKKomponenGaji;
      this.httpService.update(Configuration.get().dataMasterNew + '/profileskkomponengaji/update', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    }



    if (this.table == "ProfileStrukturGajiByGP_M") {
      // console.log(this.listGP);
      let profileStrukturGajiByGP = [];
      for (let i = 0; i < this.listGP.length; i++) {
        let group;
        if (this.listGP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByGP.push({
          "factorRate": this.listGP[i].factorRate,
          "factorRateDivide": this.listGP[i].factorRateDivide,
          "hargaSatuan": this.listGP[i].hargaSatuan,
          "isGroupToRangeHarga": group,
          "kdGolonganPegawai": this.listGP[i].golonganPegawai.id_kode,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "kdPangkat": this.listGP[i].pangkat.id_kode,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listGP[i].operatorFactorRate.kode,
          "statusEnabled": this.listGP[i].statusAktif,
          "totalPoin": this.listGP[i].totalPoin
        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByGP };
      // console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibygp/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    } else if (this.table == "ProfileStrukturGajiByGPMKP_M") {
      // console.log(this.listGPMKP);
      let profileStrukturGajiByGPMKPD = [];
      for (let i = 0; i < this.listGPMKP.length; i++) {
        let group;
        if (this.listGPMKP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByGPMKPD.push({
          "factorRate": this.listGPMKP[i].factorRate,
          "factorRateDivide": this.listGPMKP[i].factorRateDivide,
          "hargaSatuan": this.listGPMKP[i].hargaSatuan,
          "isGroupToRangeHarga": group,
          "kdGolonganPegawai": this.listGPMKP[i].golonganPegawai.id_kode,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "kdPendidikan": this.listGPMKP[i].pendidikan.id_kode,
          "kdRangeMasaKerja": this.listGPMKP[i].rangeMasaKerja.id_kode,
          "kdPangkat": this.listGPMKP[i].pangkat.id_kode,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listGPMKP[i].operatorFactorRate.kode,
          "statusEnabled": this.listGPMKP[i].statusAktif,
          "totalPoin": this.listGPMKP[i].totalPoin

        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByGPMKPD };
      // console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibygpmkp/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    } else if (this.table == "ProfileStrukturGajiByJeP_M") {
      // console.log(this.listJEP);
      let profileStrukturGajiByJeP = [];
      for (let i = 0; i < this.listJEP.length; i++) {
        let group;
        if (this.listJEP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByJeP.push({
          "factorRate": this.listJEP[i].factorRate,
          "factorRateDivide": this.listJEP[i].factorRateDivide,
          "hargaSatuan": this.listJEP[i].hargaSatuan,
          "isGroupToRangeHarga": group,
          "kdJenisPegawai": this.listJEP[i].jenisPegawai.id_kode,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listJEP[i].operatorFactorRate.kode,
          "statusEnabled": this.listJEP[i].statusAktif,
          "totalPoin": this.listJEP[i].totalPoin

        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJeP };
      // console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyjep/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    } else if (this.table == "ProfileStrukturGajiByJP_M") {
      // console.log(this.listJP);
      let profileStrukturGajiByJP = [];
      for (let i = 0; i < this.listJP.length; i++) {
        let group;
        if (this.listJP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByJP.push({
          "factorRate": this.listJP[i].factorRate,
          "factorRateDivide": this.listJP[i].factorRateDivide,
          "hargaSatuan": this.listJP[i].hargaSatuan,
          "isGroupToRangeHarga": group,
          "kdJabatan": this.listJP[i].jabatan.id_kode,
          "kdPendidikan": this.listJP[i].pendidikan.id_kode,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listJP[i].operatorFactorRate.kode,
          "statusEnabled": this.listJP[i].statusAktif,
          "totalPoin": this.listJP[i].totalPoin

        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJP };
      // console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyjp/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    }
    //ed99
    else if (this.table == "ProfileStrukturGajiByJ_M") {
      // console.log(this.listJP);
      let profileStrukturGajiByJ = [];
      for (let i = 0; i < this.listJ.length; i++) {
        let group;
        if (this.listJ[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByJ.push({
          "factorRate": this.listJ[i].factorRate,
          "factorRateDivide": this.listJ[i].factorRateDivide,
          "hargaSatuan": this.listJ[i].hargaSatuan,
          "isGroupToRangeHarga": group,
          "kdJabatan": this.listJ[i].jabatan.id_kode,
          // "kdPendidikan": this.listJ[i].pendidikan.id_kode,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listJ[i].operatorFactorRate.kode,
          "statusEnabled": this.listJ[i].statusAktif,
          "totalPoin": this.listJ[i].totalPoin

        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJ };
      // console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyj/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    }
    else if (this.table == "ProfileStrukturGajiByJLT_M") {
      let profileStrukturGajiByJLT = [];
      for (let i = 0; i < this.listJLT.length; i++) {
        let group;
        if (this.listJLT[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByJLT.push({
          "factorRate": this.listJLT[i].factorRate,
          "factorRateDivide": this.listJLT[i].factorRateDivide,
          "hargaSatuan": this.listJLT[i].hargaSatuan,
          "isGroupToRangeHarga": group,
          "kdJabatan": this.listJLT[i].jabatan.id_kode,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "kdLevelTingkat": this.listJLT[i].levelTingkat.id_kode,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listJLT[i].operatorFactorRate.kode,
          "statusEnabled": this.listJLT[i].statusAktif,
          "totalPoin": this.listJLT[i].totalPoin
        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJLT };
      console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyjlt/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });
    }
    else if (this.table == "ProfileStrukturGajiByMKRH_M") {
      let profileStrukturGajiByMKRH = [];
      for (let i = 0; i < this.listMKRH.length; i++) {
        let group;
        if (this.listMKRH[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
        profileStrukturGajiByMKRH.push({
          "factorRate": this.listMKRH[i].factorRate,
          "factorRateDivide": this.listMKRH[i].factorRateDivide,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "kdRangeHargaGroup": this.listMKRH[i].rangeHargaGroup.id_kode,
          "kdRangeMasaKerja": this.listMKRH[i].rangeMasaKerja.id_kode,
          "noSK": this.form.get('noSK').value,
          "operatorFactorRate": this.listMKRH[i].operatorFactorRate.kode,
          "persenHargaSatuan": this.listMKRH[i].persenHargaSatuan,
          "statusEnabled": this.listMKRH[i].statusAktif
        })
      }
      let dataSimpan
      dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByMKRH };
      // console.log(dataSimpan);
      this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkrh/save', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.reset();
      });

    }




  }





  simpan() {

    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let profileSKKomponenGaji;
      let struktur;
      if (this.form.get('isByStruktur').value == true) {
        struktur = 1;
        let criteria = JSON.stringify(this.form.get('FKCriteriaBy').value);
        profileSKKomponenGaji = {
          "fkcriteriaBy": criteria,
          "isByStruktur": struktur,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "keteranganLainnya": this.form.get('keteranganLainnya').value,
          "namaTabelStruktur": this.form.get('namaTabel').value,
          "noSK": this.form.get('noSK').value,
          "statusEnabled": this.form.get('statusEnabled').value
        }
      } else {
        struktur = 0;
        this.form.get('FKCriteriaBy').clearValidators();
        this.form.get('namaTabel').clearValidators();
        this.form.get('isByStruktur').clearValidators();

        profileSKKomponenGaji = {
          "fkcriteriaBy": "",
          "isByStruktur": struktur,
          "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
          "kdKomponenHarga": this.form.get('komponenHarga').value,
          "keteranganLainnya": this.form.get('keteranganLainnya').value,
          "namaTabelStruktur": "",
          "noSK": this.form.get('noSK').value,
          "statusEnabled": this.form.get('statusEnabled').value
        }
        let dataSimpan
        dataSimpan = profileSKKomponenGaji;
        this.httpService.post(Configuration.get().dataMasterNew + '/profileskkomponengaji/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });

      }

      if (this.table == "ProfileStrukturGajiByGP_M") {
        // console.log(this.listGP);
        let profileStrukturGajiByGP = [];
        for (let i = 0; i < this.listGP.length; i++) {
          let group;
          if (this.listGP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByGP.push({
            "factorRate": this.listGP[i].factorRate,
            "factorRateDivide": this.listGP[i].factorRateDivide,
            "hargaSatuan": this.listGP[i].hargaSatuan,
            "isGroupToRangeHarga": group,
            "kdGolonganPegawai": this.listGP[i].golonganPegawai.id_kode,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "kdPangkat": this.listGP[i].pangkat.id_kode,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listGP[i].operatorFactorRate.kode,
            "statusEnabled": this.listGP[i].statusAktif,
            "totalPoin": this.listGP[i].totalPoin
          })
        }
        let dataSimpan
        dataSimpan = profileSKKomponenGaji;
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByGP };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibygp/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });
      }
      else if (this.table == "ProfileStrukturGajiByGPMKP_M") {
        // console.log(this.listGPMKP);
        let profileStrukturGajiByGPMKPD = [];
        for (let i = 0; i < this.listGPMKP.length; i++) {
          let group;
          if (this.listGPMKP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByGPMKPD.push({
            "factorRate": this.listGPMKP[i].factorRate,
            "factorRateDivide": this.listGPMKP[i].factorRateDivide,
            "hargaSatuan": this.listGPMKP[i].hargaSatuan,
            "isGroupToRangeHarga": group,
            "kdGolonganPegawai": this.listGPMKP[i].golonganPegawai.id_kode,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "kdPendidikan": this.listGPMKP[i].pendidikan.id_kode,
            "kdRangeMasaKerja": this.listGPMKP[i].rangeMasaKerja.id_kode,
            "kdPangkat": this.listGPMKP[i].pangkat.id_kode,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listGPMKP[i].operatorFactorRate.kode,
            "statusEnabled": this.listGPMKP[i].statusAktif,
            "totalPoin": this.listGPMKP[i].totalPoin

          })
        }
        let dataSimpan
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByGPMKPD };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibygpmkp/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });
      } else if (this.table == "ProfileStrukturGajiByJeP_M") {
        // console.log(this.listJEP);
        let profileStrukturGajiByJeP = [];
        for (let i = 0; i < this.listJEP.length; i++) {
          let group;
          if (this.listJEP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByJeP.push({
            "factorRate": this.listJEP[i].factorRate,
            "factorRateDivide": this.listJEP[i].factorRateDivide,
            "hargaSatuan": this.listJEP[i].hargaSatuan,
            "isGroupToRangeHarga": group,
            "kdJenisPegawai": this.listJEP[i].jenisPegawai.id_kode,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listJEP[i].operatorFactorRate.kode,
            "statusEnabled": this.listJEP[i].statusAktif,
            "totalPoin": this.listJEP[i].totalPoin
          })
        }
        let dataSimpan
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJeP };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyjep/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });
      } else if (this.table == "ProfileStrukturGajiByJP_M") {
        // console.log(this.listJP);//100
        let profileStrukturGajiByJP = [];
        for (let i = 0; i < this.listJP.length; i++) {
          let group;
          if (this.listJP[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByJP.push({
            "factorRate": this.listJP[i].factorRate,
            "factorRateDivide": this.listJP[i].factorRateDivide,
            "hargaSatuan": this.listJP[i].hargaSatuan,
            "isGroupToRangeHarga": group,
            "kdJabatan": this.listJP[i].jabatan.id_kode,
            "kdPendidikan": this.listJP[i].pendidikan.id_kode,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listJP[i].operatorFactorRate.kode,
            "statusEnabled": this.listJP[i].statusAktif,
            "totalPoin": this.listJP[i].totalPoin
          })
        }
        let dataSimpan
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJP };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyjp/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });
      }
      //ed99
      else if (this.table == "ProfileStrukturGajiByJ_M") {
        // console.log(this.listJP);
        let profileStrukturGajiByJ = [];
        for (let i = 0; i < this.listJ.length; i++) {
          let group;
          if (this.listJ[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByJ.push({
            "factorRate": this.listJ[i].factorRate,
            "factorRateDivide": this.listJ[i].factorRateDivide,
            "hargaSatuan": this.listJ[i].hargaSatuan,
            "isGroupToRangeHarga": group,
            "kdJabatan": this.listJ[i].jabatan.id_kode,
            // "kdPendidikan": this.listJ[i].pendidikan.id_kode,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listJ[i].operatorFactorRate.kode,
            "statusEnabled": this.listJ[i].statusAktif,
            "totalPoin": this.listJ[i].totalPoin
          })
        }
        let dataSimpan
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJ };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyj/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });
      }
      else if (this.table == "ProfileStrukturGajiByJLT_M") {
        let profileStrukturGajiByJLT = [];
        for (let i = 0; i < this.listJLT.length; i++) {
          let group;
          if (this.listJLT[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByJLT.push({
            "factorRate": this.listJLT[i].factorRate,
            "factorRateDivide": this.listJLT[i].factorRateDivide,
            "hargaSatuan": this.listJLT[i].hargaSatuan,
            "isGroupToRangeHarga": group,
            "kdJabatan": this.listJLT[i].jabatan.id_kode,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "kdLevelTingkat": this.listJLT[i].levelTingkat.id_kode,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listJLT[i].operatorFactorRate.kode,
            "statusEnabled": this.listJLT[i].statusAktif,
            "totalPoin": this.listJLT[i].totalPoin
          })
        }
        let dataSimpan
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByJLT };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibyjlt/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });

      }

      else if (this.table == "ProfileStrukturGajiByMKRH_M") {
        let profileStrukturGajiByMKRH = [];
        for (let i = 0; i < this.listMKRH.length; i++) {
          let group;
          if (this.listMKRH[i].isGroupToRangeHarga == true) { group = 1 } else { group = 0 }
          profileStrukturGajiByMKRH.push({
            "factorRate": this.listMKRH[i].factorRate,
            "factorRateDivide": this.listMKRH[i].factorRateDivide,
            "kdKategoryPegawai": this.form.get('kategoriPegawai').value,
            "kdKomponenHarga": this.form.get('komponenHarga').value,
            "kdRangeHargaGroup": this.listMKRH[i].rangeHargaGroup.id_kode,
            "kdRangeMasaKerja": this.listMKRH[i].rangeMasaKerja.id_kode,
            "noSK": this.form.get('noSK').value,
            "operatorFactorRate": this.listMKRH[i].operatorFactorRate.kode,
            "persenHargaSatuan": this.listMKRH[i].persenHargaSatuan,
            "statusEnabled": this.listMKRH[i].statusAktif
          })
        }
        let dataSimpan
        dataSimpan = { profileSKKomponenGaji, profileStrukturGajiByMKRH };
        // console.log(dataSimpan);
        this.httpService.post(Configuration.get().dataMasterNew + '/profilestrukturgajibymkrh/save', dataSimpan).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.reset();
        });

      }



    }

  }
  addGP() {
    let dataTemp = {
      "golonganPegawai": {
        "namaGolonganPegawai": "--Pilih--",
      },
      "pangkat": {
        "namaPangkat": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listGP = [...this.listGP];
    listGP.push(dataTemp);
    this.listGP = listGP;
  }
  addGPMKP() {
    let dataTemp = {
      "golonganPegawai": {
        "namaGolonganPegawai": "--Pilih--",
      },
      "pangkat": {
        "namaPangkat": "--Pilih--",
      },
      "pendidikan": {
        "namaPendidikan": "--Pilih--",
      },
      "rangeMasaKerja": {
        "namaRange": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listGPMKP = [...this.listGPMKP];
    listGPMKP.push(dataTemp);
    this.listGPMKP = listGPMKP;
  }
  addJEP() {
    let dataTemp = {
      "jenisPegawai": {
        "namaJenisPegawai": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listJEP = [...this.listJEP];
    listJEP.push(dataTemp);
    this.listJEP = listJEP;
  }
  addJLT() {
    let dataTemp = {
      "jabatan": {
        "namaJabatan": "--Pilih--",
      },
      "levelTingkat": {
        "namaLevelTingkat": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listJLT = [...this.listJLT];
    listJLT.push(dataTemp);
    this.listJLT = listJLT;
  }
  addJP() {
    let dataTemp = {
      "jabatan": {
        "namaJabatan": "--Pilih--",
      },
      "pendidikan": {
        "namaPendidikan": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listJP = [...this.listJP];
    listJP.push(dataTemp);
    this.listJP = listJP;
  }
  addJ() {
    let dataTemp = {
      "jabatan": {
        "namaJabatan": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listJ = [...this.listJ];
    listJ.push(dataTemp);
    this.listJ = listJ;
  }
  addMKRH() {
    let dataTemp = {
      "rangeMasaKerja": {
        "namaRange": "--Pilih--",
      },
      "rangeHargaGroup": {
        "namaRange": "--Pilih--",
      },
      "totalPoin": null,
      "hargaSatuan": null,
      "factorRate": "1",
      "operatorFactorRate": {
        "kode": "x",
        "kdOperatorFactorRate": 'x',
      },
      "factorRateDivide": "",
      "isGroupToRangeHarga": "",
      "statusAktif": "true",
      "noSK": null,
    }
    let listMKRH = [...this.listMKRH];
    listMKRH.push(dataTemp);
    this.listMKRH = listMKRH;
  }
  hapusGP(row) {
    let listGP = [...this.listGP];
    listGP.splice(row, 1);
    this.listGP = listGP;
  }
  hapusGPMKP(row) {
    let listGPMKP = [...this.listGPMKP];
    listGPMKP.splice(row, 1);
    this.listGPMKP = listGPMKP;
  }
  hapusJEP(row) {
    let listJEP = [...this.listJEP];
    listJEP.splice(row, 1);
    this.listJEP = listJEP;
  }
  hapusJLT(row) {
    let listJLT = [...this.listJLT];
    listJLT.splice(row, 1);
    this.listJLT = listJLT;
  }
  hapusJP(row) {
    let listJP = [...this.listJP];
    listJP.splice(row, 1);
    this.listJP = listJP;
  }
  hapusJ(row) {
    let listJ = [...this.listJ];
    listJ.splice(row, 1);
    this.listJ = listJ;
  }
  hapusMKRH(row) {
    let listMKRH = [...this.listMKRH];
    listMKRH.splice(row, 1);
    this.listMKRH = listMKRH;
  }
  getTotal(row) {
    let data = [... this.listGP];
    if (data[row].totalPoin != null) {
      this.dataEditTotal = true;
    }
  }

  getHarga(row) {
    let data = [... this.listGP];
    if (data[row].hargaSatuan != null) {
      this.dataEditHarga = true;
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
  setHarga(value) {
    if (value != null) {
      return parseInt(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  }

  getKomponen(dataPeg) {
    if (this.table == "ProfileStrukturGajiByGP_M") {

      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibygp/findAll?page=1&rows=10&dir=id.kdGolonganPegawai&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByGP;
        this.listGP = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "golonganPegawai": {
              "id_kode": komponen[i].kode.kdGolonganPegawai,
              "namaGolonganPegawai": komponen[i].namaGolonganPegawai,
              "noSK": komponen[i].kode.noSK,
            },
            "pangkat": {
              "id_kode": komponen[i].kode.kdPangkat,
              "namaPangkat": komponen[i].namaPangkat,
              "noSK": komponen[i].kode.noSK,
            },
            "totalPoin": komponen[i].totalPoin,
            "hargaSatuan": komponen[i].hargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listGP.push(dataFix);
          // console.log(this.listGP);     
        }
      });
    }
    else if (this.table == "ProfileStrukturGajiByGPMKP_M") {
      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibygpmkp/findAll?page=1&rows=10&dir=id.kdGolonganPegawai&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByGPMKP;
        this.listGPMKP = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "golonganPegawai": {
              "id_kode": komponen[i].kode.kdGolonganPegawai,
              "namaGolonganPegawai": komponen[i].namaGolonganPegawai,
              "noSK": komponen[i].kode.noSK,
            },
            "pangkat": {
              "id_kode": komponen[i].kode.kdPangkat,
              "namaPangkat": komponen[i].namaPangkat,
              "noSK": komponen[i].kode.noSK,
            },
            "pendidikan": {
              "id_kode": komponen[i].kode.kdPendidikan,
              "namaPendidikan": komponen[i].namaPendidikan,
              "noSK": komponen[i].kode.noSK,
            },
            "rangeMasaKerja": {
              "id_kode": komponen[i].kode.kdRangeMasaKerja,
              "namaRange": komponen[i].namaRangeMasaKerja,
              "noSK": komponen[i].kode.noSK,
            },
            "totalPoin": komponen[i].totalPoin,
            "hargaSatuan": komponen[i].hargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listGPMKP.push(dataFix);
        }
      });
    }
    else if (this.table == "ProfileStrukturGajiByJeP_M") {
      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibyjep/findAll?page=1&rows=10&dir=jenisPegawai.namaJenisPegawai&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByJeP;
        this.listJEP = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "jenisPegawai": {
              "id_kode": komponen[i].kode.kdJenisPegawai,
              "namaJenisPegawai": komponen[i].namaJenisPegawai,
              "noSK": komponen[i].kode.noSK,
            },
            "totalPoin": komponen[i].totalPoin,
            "hargaSatuan": komponen[i].hargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listJEP.push(dataFix);
        }
      });
    }
    else if (this.table == "ProfileStrukturGajiByJP_M") {
      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibyjp/findAll?page=1&rows=300&dir=jabatan.namaJabatan&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByJP;
        this.listJP = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "jabatan": {
              "id_kode": komponen[i].kode.kdJabatan,
              "namaJabatan": komponen[i].namaJabatan,
              "noSK": komponen[i].kode.noSK,
            },
            "pendidikan": {
              "id_kode": komponen[i].kode.kdPendidikan,
              "namaPendidikan": komponen[i].namaPendidikan,
              "noSK": komponen[i].kode.noSK,
            },
            "totalPoin": komponen[i].totalPoin,
            "hargaSatuan": komponen[i].hargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listJP.push(dataFix);
        }
      });
    }

    else if (this.table == "ProfileStrukturGajiByJ_M") {
      //ed99 
      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibyj/findAll?page=1&rows=300&dir=jabatan.namaJabatan&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByJ;
        this.listJ = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "jabatan": {
              "id_kode": komponen[i].kode.kdJabatan,
              "namaJabatan": komponen[i].namaJabatan,
              "noSK": komponen[i].kode.noSK,
            },
            "totalPoin": komponen[i].totalPoin,
            "hargaSatuan": komponen[i].hargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listJ.push(dataFix);
        }
      });
    }

    else if (this.table == "ProfileStrukturGajiByJLT_M") {
      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibyjlt/findAll?page=1&rows=10&dir=levelTingkat.namaLevelTingkat&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByJLT;
        this.listJLT = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "jabatan": {
              "id_kode": komponen[i].kode.kdJabatan,
              "namaJabatan": komponen[i].namaJabatan,
              "noSK": komponen[i].kode.noSK,
            },
            "levelTingkat": {
              "id_kode": komponen[i].kode.kdLevelTingkat,
              "namaLevelTingkat": komponen[i].namaLevelTingkat,
              "noSK": komponen[i].kode.noSK,
            },
            "totalPoin": komponen[i].totalPoin,
            "hargaSatuan": komponen[i].hargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listJLT.push(dataFix);
        }
      });
    }
    else if (this.table == "ProfileStrukturGajiByMKRH_M") {
      this.httpService.get(Configuration.get().dataMasterNew + '/profilestrukturgajibymkrh/findAll?page=1&rows=10&dir=rangeHargaGroup.namaRange&sort=desc&noSK=' + dataPeg.data.kode.noSK + '&kdKategoryPegawai=' + dataPeg.data.kode.kdKategoryPegawai + '&kdKomponenHarga=' + dataPeg.data.kode.kdKomponenHarga).subscribe(table => {
        let komponen = table.ProfileStrukturGajiByMKRH;
        this.listMKRH = [];
        let dataFix
        for (let i = 0; i < komponen.length; i++) {
          dataFix = {
            "rangeMasaKerja": {
              "id_kode": komponen[i].kode.kdRangeMasaKerja,
              "namaRange": komponen[i].namaRangeMasaKerja,
              "noSK": komponen[i].kode.noSK,
            },
            "rangeHargaGroup": {
              "id_kode": komponen[i].kode.kdRangeHargaGroup,
              "namaRange": komponen[i].namaRangeHargaGroup,
              "noSK": komponen[i].kode.noSK,
            },
            "persenHargaSatuan": komponen[i].persenHargaSatuan,
            "factorRate": komponen[i].factorRate,
            "operatorFactorRate": {
              "kode": komponen[i].operatorFactorRate,
            },
            "factorRateDivide": komponen[i].factorRateDivide,
            // "isGroupToRangeHarga": komponen[i].isGroupToRangeHarga,
            "statusAktif": komponen[i].statusEnabled,
            "noSK": komponen[i].kode.noSK,
          }
          this.listMKRH.push(dataFix);
        }
      });
    }
  }
  onRowSelect(event) {
    // console.log(event);
    this.formAktif = false;
    // this.form.get('kategoriPegawai').disable();
    // this.form.get('komponenHarga').disable();
    if (event.data.isByStruktur == 0) {
      this.form.get('namaSK').setValue(event.data.kode.noSK);
      this.form.get('noSK').setValue(event.data.kode.noSK);
      this.form.get('noSkIntern').setValue(event.data.noSKIntern);
      this.form.get('kategoriPegawai').setValue(event.data.kode.kdKategoryPegawai);
      this.form.get('komponenHarga').setValue(event.data.kode.kdKomponenHarga);
      this.form.get('isByStruktur').setValue(event.data.isByStruktur);
      this.form.get('namaTabel').setValue(event.data.namaTabelStruktur);
      this.form.get('FKCriteriaBy').setValue(event.data.fkCriteriaBy);
      this.form.get('keteranganLainnya').setValue(event.data.keteranganLainnya);
      this.form.get('statusEnabled').setValue(event.data.statusEnabled);
      if (event.data.tglBerlakuAkhir == null) {

      } else {
        this.form.get('tglBerlakuSkSampai').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

      }
      this.form.get('tglBerlakuSkDari').setValue(new Date(event.data.tglBerlakuAwal * 1000));
    } else {
      let cloned = this.clone(event.data);
      this.form.setValue(cloned);
      this.getKomponen(event);
    }
  }

  clone(cloned: ProfileSkKomponenGaji): ProfileSkKomponenGaji {
    let hub = new InisialProfileSkKomponenGaji();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialProfileSkKomponenGaji();
    if (hub.tglBerlakuAkhir == null) {
      fixHub = {
        "namaSK": hub.kode.noSK,
        "noSK": hub.kode.noSK,
        "noSkIntern": hub.noSKIntern,
        "tglBerlakuSkDari": new Date(hub.tglBerlakuAwal * 1000),
        "tglBerlakuSkSampai": null,
        "kategoriPegawai": hub.kode.kdKategoryPegawai,
        "komponenHarga": hub.kode.kdKomponenHarga,
        "isByStruktur": hub.isByStruktur,
        "namaTabel": hub.namaTabelStruktur,
        "FKCriteriaBy": JSON.parse(hub.fKCriteriaBy),
        "keteranganLainnya": hub.keteranganLainnya,
        "statusEnabled": hub.statusEnabled,
      }
      // this.versi = hub.version;
      return fixHub;
    } else {
      fixHub = {
        "namaSK": hub.kode.noSK,
        "noSK": hub.kode.noSK,
        "noSkIntern": hub.noSKIntern,
        "tglBerlakuSkDari": new Date(hub.tglBerlakuAwal * 1000),
        "tglBerlakuSkSampai": new Date(hub.tglBerlakuAkhir * 1000),
        "kategoriPegawai": hub.kode.kdKategoryPegawai,
        "komponenHarga": hub.kode.kdKomponenHarga,
        "isByStruktur": hub.isByStruktur,
        "namaTabel": hub.namaTabelStruktur,
        "FKCriteriaBy": JSON.parse(hub.fKCriteriaBy),
        "keteranganLainnya": hub.keteranganLainnya,
        "statusEnabled": hub.statusEnabled,
      }
      // this.versi = hub.version;
      return fixHub;
    }
  }


}
class InisialProfileSkKomponenGaji implements ProfileSkKomponenGaji {
  constructor(
    public namaSK?,
    public kategoriPegawai?,
    public masaKerja?,
    public jabatan?,
    public noSK?,
    public noSkIntern?,
    public noSKIntern?,
    public kdKategoryPegawai?,
    public kdRangeMasaKerja?,
    public kdJabatan?,
    public statusEnabled?,
    public tglBerlakuSkDari?,
    public tglBerlakuSkSampai?,
    public tglBerlakuAwal?,
    public tglBerlakuAkhir?,
    public komponenHarga?,
    public isByStruktur?,
    public namaTabel?,
    public FKCriteriaBy?,
    public keteranganLainnya?,
    public kode?,
    public namaTabelStruktur?,
    public fKCriteriaBy?,
    public version?
  ) { }
}