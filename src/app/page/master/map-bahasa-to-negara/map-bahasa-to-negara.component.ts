import { Inject, forwardRef, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { PegawaiSkTidakAbsen } from './map-bahasa-to-negara.component.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-map-bahasa-to-negara',
  templateUrl: './map-bahasa-to-negara.component.html',
  styleUrls: ['./map-bahasa-to-negara.component.scss'],
  providers: [ConfirmationService]
})
export class MapBahasaToNegaraComponent implements OnInit {
  listData: any[];
  selected: PegawaiSkTidakAbsen;
  form: FormGroup;
  kodeDeskripsi: PegawaiSkTidakAbsen[];

  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  myForm: FormGroup;
  version: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  kdDeskripsi: any;
  pilihan: any = [];
  pilihSemua: boolean;
  listUnitKerja: any[];
  selectedUnitkerja: any[];
  namaSK: any[];
  unitKerjaCari: any[];
  selectedRuangan: any[];
  laporan: boolean = false;
  kdprof: any;
  kddept: any;
  codes: any[];
  smbrFile: any;

  listDropdownBahasa: any[];
  listNegara: any[];
  buttonAktif: boolean = true;
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef,
    private route: Router,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  ngAfterViewInit() {
    this.hasilCek = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdDeskripsi);


  }



  ngOnInit() {


    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
          this.downloadExcel();
        }
      },

    ];
    this.pencarian = "";
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'statusEnabled': new FormControl(true),
      'noSK': new FormControl(null),
      'namaSuratKeputusan': new FormControl(''),
      'kdBahasa': new FormControl({ value: '', disabled: false }, Validators.required),
      'tglBerlakuAkhir': new FormControl({ value: '', disabled: true }),
      'kdUnitKerja': new FormControl({ value: '', disabled: true }),
    });




    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });

    this.getSmbrFile();
    this.getService();

  }

  getService() {
    this.httpService.get(Configuration.get().dataMasterNew + '/bahasa/findAllBahasa?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(table => {
      this.listDropdownBahasa = [];
      this.listDropdownBahasa.push({ label: '-- Pilih --', value: '' })
      for (var i = 0; i < table.bahasa.length; i++) {
        this.listDropdownBahasa.push({
          label: table.bahasa[i].namaBahasa, value: table.bahasa[i].kode.kode
        })
      };
    });

    this.getNegara('');
  }

  getNegara(pencarian) {
    this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara?namaNegara=' + pencarian).subscribe(res => {
      this.listNegara = [];
      this.listNegara = res.Negara;
    });
  }

  getSmbrFile() {
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });
  }

  getKelompokTransaksi() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/getKelompokTransaksi').subscribe(table => {
      let dataKelompokTransaksi = table.KelompokTransaksi;
      localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
      this.route.navigate(['/master-sk/surat-keputusan']);
    });
  }

  get(page: number, rows: number, search: any) {

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.authGuard.getUserDto().kdLokasi).subscribe(res => {
      this.listUnitKerja = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.listUnitKerja.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id_kode })
      };
      this.listUnitKerja = this.listUnitKerja;

    },
      error => {
        this.listUnitKerja = [];
        this.listUnitKerja.push({ label: '-- ' + error + ' --', value: '' })
      });
  }

  clearPanelBawah(kdBahasa) {

    if (kdBahasa !== undefined) {
      if (kdBahasa.value == '' || kdBahasa.value == null || kdBahasa == undefined) {
        this.hasilCek = true;
        this.pilihan = [];
        this.buttonAktif = true;
      } else {
        this.hasilCek = false;
        this.buttonAktif = false;
        this.httpService.get(Configuration.get().dataMasterNew + '/mapbahasatonegara/findByKode/' + kdBahasa.value).subscribe(res => {
          this.pilihan = [];
          for (let i = 0; i < res.mapBahasaToNegara.length; i++) {
            if (res.mapBahasaToNegara[i].statusEnabled) {
              this.pilihan.push(String(res.mapBahasaToNegara[i].kode.kdNegara))
            }
          }
        });

      }
    } else {
      this.hasilCek = true;
      this.buttonAktif = true;

      this.pilihan = [];
    }

  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listNegara.forEach(function (data) {
        dataTemp.push(String(data.kode));
      })
      this.pilihan = dataTemp;
    } else {
      this.pilihan = []
    }
  }

  onChange() {
    console.log(JSON.stringify(this.pilihan))
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
    console.log(this.pilihan);
    let mapDeskripsiToSpesifikasi = []
    let negara = [];
    if (this.pilihan.length == 0) {
      this.alertService.warn("Peringatan", "Data Tidak Sesuai");
      return false;
    }
    for (let i = 0; i < this.pilihan.length; i++) {
      negara.push(
        {
          "kdNegara": this.pilihan[i],
          "kdBahasa": this.form.get('kdBahasa').value,
          "statusEnabled": true
        })
    }

    for (let i = 0; i < this.listNegara.length; i++) {
      let index = this.pilihan.map(function (e) { return e; }).indexOf(String(this.listNegara[i].kode));
      if (index == -1) {
        negara.push(
          {
            "kdNegara": this.listNegara[i].kode,
            "kdBahasa": this.form.get('kdBahasa').value,
            "statusEnabled": false
          })
      }

    }
    let dataSimpan = {
      "mapBahasaToNegara": negara,
    }
    console.log(dataSimpan);

    this.httpService.update(Configuration.get().dataMasterNew + '/mapbahasatonegara/update/1', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      this.reset();
    });
  }

  changeRuangan(Ruangan) {
    let unitKerja = [];
    for (var i = 0; i < Ruangan.length; i++) {
      unitKerja.push({
        "kode": Ruangan[i].value
      })
    }

    this.unitKerjaCari = unitKerja;
    let cari = {
      "noSK": this.form.get('noSK').value,
      "nama": this.pencarian,
      "ruangan": unitKerja
    };
    if (unitKerja == null) {
      this.pilihan = [];
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/findPegawaiByUnitKerja', cari).subscribe(response => {
        this.listData = response.data;
        this.pilihan = [];
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].statusEnabled == true) {
            this.pilihan.push(String(response.data[i].kdpegawai))
          }
        }
      },


        error => {
          this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
        },
        () => {
          this.alertService.success('Berhasil', 'Berhasil Ditampilkan');

        });
    }


  }

  ambilSK(sk) {
    if (this.form.get('namaSuratKeputusan').value == null || this.form.get('namaSuratKeputusan').value == undefined) {
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('tglBerlakuAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));

        if (detailSK[0].tglBerlakuAkhir == 0 || detailSK[0].tglBerlakuAkhir == null) {
          console.log('sini');
        } else {
          this.form.get('tglBerlakuAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
          console.log('sana');
        }
        if (this.form.get('noSK').value != null || this.form.get('noSK').value != "" || this.form.get('noSK').value != undefined) {
          this.form.get('kdUnitKerja').enable();
        } else {
          this.form.get('kdUnitKerja').disable();
        }
      });
    }
  }

  cari() {
    let cari = {
      "noSK": this.form.get('noSK').value,
      "nama": this.pencarian,
      "ruangan": this.unitKerjaCari
    };
    this.httpService.post(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/findPegawaiByUnitKerja', cari).subscribe(response => {
      this.listData = response.data;
      this.pilihan = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].statusEnabled == true) {
          this.pilihan.push(String(response.data[i].kdpegawai))
        }
      }
    },
      error => {
        this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Berhasil Dicari');

      });
  }

  reset() {
    this.buttonAktif = true;
    this.pilihSemua = false;
    this.form.get('kdUnitKerja').disable();
    this.ngOnInit();
    this.changeRuangan(event);
  }

  downloadExcel() {

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/pegawaiSKTidakAbsen/laporanPegawaiSKTidakAbsen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
    window.open(cetak);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKTidakAbsen/laporanPegawaiSKTidakAbsen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmPegawaiSkTidakAbsen_laporanCetak');

  }
  tutupLaporan() {
    this.laporan = false;
  }



}



