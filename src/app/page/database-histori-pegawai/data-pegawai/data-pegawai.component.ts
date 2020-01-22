import { Scope } from '@angular/core/src/profile/wtf_impl';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, SelectItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { MenuItem, FileUploadModule } from 'primeng/primeng';
import { Http, HttpModule } from '@angular/http';
import { Router } from "@angular/router";
import { OnlyNumber } from '../../../page/master/login-user/onlynumber.directive';


@Component({
  selector: 'app-data-pegawai',
  templateUrl: './data-pegawai.component.html',
  styleUrls: ['./data-pegawai.component.scss'],
  providers: [ConfirmationService],
})
export class DataPegawaiComponent implements OnInit {
  //test
  dataTrue: any;
  tampung_index: any;
  disableCheckbox: boolean = false;

  item: any;
  selected: any;
  listData: any[];
  kdJenisPegawai: any[];
  kdTitle: any[];
  kdJenisKelamin: any[];
  kdPangkat: any[];
  kdKualifikasiJurusan: any[];
  kdJabatan: any[];
  kdEselon: any[];
  kdTypePegawai: any[];
  kdKategoryPegawai: any[];
  kdStatusPegawaiAktif: any;
  statusPegawaiAktif: any;
  kdStatusPegawaiTidakAktif: any;
  statusPegawaiTidakAktif: any;
  kdStatusPegawai: any;
  statusPegawai: any;
  kdDepartemen: any[];
  kdLokasi: any[];
  kdRuanganKerja: any[];
  kdPegawaiHead: any[];
  kdNegara: any[];
  kdStatusPerkawinan: any[];
  kdSuku: any[];
  kdAgama: any[];
  kdGolonganDarah: any[];
  kdPTKP: any[];
  statusRhesus: any[];
  pencarian: string = '';
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  golongan: any;
  toGolongan: any;
  kdGolonganPegawai: any;
  toShio: any;
  shio: any;
  elemen: any;
  zodiak: any;
  zodiakUnsur: any;
  value: any;
  kdZodiak: any;
  kdZodiakUnsur: any;
  unsur: any;
  tgl: any;
  zz: any;
  yy: any;
  check: any;
  foto: any;
  kdPegawai: any;
  namaGolonganPegawai: any;
  totalRecords: number;
  headers: any;
  registrasiPegawai: any;
  registrasiPegawai1: any[];
  namaLengkap: string;

  smbrFoto: string;
  namaFoto: string = null;
  uploadedFiles: any[] = [];
  photo: string;
  photoDiri: any;
  photoFiles: any[] = [];
  photoUrl: string;
  dataPass: any;
  namaDokumen: any;
  smbrDokumen: any;
  ambilId: any;
  ambilLagi: any;
  sekarang: any;
  pathDokumen: any;
  paths: any;
  card: any;
  Data: any
  //  country: any; 
  rowSelectNegara: any;
  path: any;
  nodok: any;
  primary: any;
  statusKawin: any;
  jenisKelamin: any;
  lokasi: any;
  unitKeja: any;
  jabatan: any;
  cekPrimaryAddress: any;
  isPrimaryAddress: boolean = true;
  listPegawaiDokumen: any[];
  listPegawaiDokumens: any[];
  selectedDocument: any[];
  namaLogin: string;
  isPTKP: boolean = true;
  isRuangan: boolean = true;

  today: number = Date.now();
  dokumen: any;
  pegawaiTemp: any;
  kdJenisPegawaiDef: any = '00';
  selectedValue: string;
  cek: any;
  aktifNIK: any;
  tampil: any;
  Pdokumen: any;
  cekLifeT: any;
  onOff: any;
  tampungIndexStatus: any;
  disableCheckbox2: boolean = false;
  dariTambah: boolean;
  smbrFile: any;
  dialogPreviewImage: boolean;
  dialogPreviewDokumen: any;
  batasKetik: any;
  kdJenisDok: any;
  listPanjang: any[];
  listDokumenPegawaiFix: any[];

  jumlahAnak: any;

  tanggalAkhirKontrak: any
  tanggalAwalKontrak: any
  istglMasuk: boolean
  iskdKategoryPegawai: boolean
  diskontrak: boolean

  minDate: any;

  dataNomorDokumen: any

  kdKategoryPegawaiTetap: any

  listJenisPegawai: any[];
  buttonAktif:boolean;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    private route: Router, ) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
    this.smbrFoto = Configuration.get().resourceFile + "/image/show/profile1213123.png";
  }
  demo: any;
  ngOnInit() {
    this.buttonAktif = false;
    this.listJenisPegawai = [];
    this.tampil = true;
    this.cek = false;
    this.selectedValue = 'true';
    this.versi = null;

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    today.setDate(today.getDate());
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);

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

    this.formAktif = true;
    this.versi = null;
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.get(this.page, this.rows);
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'kdTitle': new FormControl(null),
      'namaAwal': new FormControl('', Validators.required),
      'namaTengah': new FormControl(''),
      'namaAkhir': new FormControl(''),
      'kdJenisKelamin': new FormControl(null, Validators.required),
      'tempatLahir': new FormControl(''),
      'tglLahir': new FormControl('', Validators.required),
      'kdZodiak': new FormControl(null),
      'kdZodiakUnsur': new FormControl(null),
      'zodiak': new FormControl(''),
      'zodiakUnsur': new FormControl(''),
      'tglMasuk': new FormControl(null, Validators.required),
      'tglDaftar': new FormControl(null, Validators.required),
      'nikintern': new FormControl(''),
      'nikgroup': new FormControl(''),
      'kdPangkat': new FormControl(null, Validators.required),
      'kdKualifikasiJurusan': new FormControl({ value: null, disabled: true }),
      'kdJabatan': new FormControl(null, Validators.required),
      'kdEselon': new FormControl(null),
      'kdTypePegawai': new FormControl(null, Validators.required),
      'kdKategoryPegawai': new FormControl(null, Validators.required),
      'kdStatusPegawai': new FormControl(null),
      'statusPegawai': new FormControl({ value: '', disabled: true }),
      'kdDepartemen': new FormControl(null, Validators.required),
      'kdLokasi': new FormControl(null, Validators.required),
      'kdRuanganKerja': new FormControl({ value: null, disabled: true }, Validators.required),
      'kdNegara': new FormControl(null, Validators.required),
      'kdStatusPerkawinan': new FormControl(null, Validators.required),
      'kdSuku': new FormControl(null/*, Validators.required*/),
      'kdAgama': new FormControl(null, Validators.required),
      'kdGolonganDarah': new FormControl(null, Validators.required),
      'statusRhesus': new FormControl(''),
      'fingerPrintID': new FormControl(''),
      'tglDaftarFingerPrint': new FormControl(''),
      'photoDiri': new FormControl(''),
      'ambilFoto': new FormControl(''),
      'kdGolonganPegawai': new FormControl(null, Validators.required),
      'npwp': new FormControl(''),
      'kdPegawaiHead': new FormControl(null),
      'kdPTKP': new FormControl(null),

      'tanggalAwalKontrak': new FormControl(null),
      'tanggalAkhirKontrak': new FormControl({ value: null, disabled: true }),
      'kdJenisPegawai': new FormControl(null, Validators.required),

    });
    let data = {
      "kdPegawai": "L0001"
    }
    this.httpService.serviceData = data;
    this.namaLogin = this.authGuard.getNamaLogin();
    let dataPegawai = JSON.parse(localStorage.getItem('data-pegawai:' + this.namaLogin));
    this.jumlahAnak = '-'
    if (dataPegawai != undefined || dataPegawai != null) {
      this.setData()
    }
    this.form.get('kdKategoryPegawai').disable();
    this.istglMasuk = false
    this.iskdKategoryPegawai = false
    this.diskontrak = true

    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findKategoryPegawaiTetap').subscribe(res => {
      this.kdKategoryPegawaiTetap = res.data.pegawai.id.kode
    });


  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows)
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  urlUpload() {
    return Configuration.get().resourceFile + '/file/upload';
  }
  fotoUpload(namaBaru) {
    this.foto = namaBaru;
    this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.foto;
  }
  fileUpload(event) {
    this.namaFoto = event.xhr.response;
    this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.namaFoto;
  }

  dokumenUpload(row, event) {
    this.namaDokumen = event.xhr.response;
    this.pathDokumen = this.namaDokumen.toString();
    this.smbrDokumen = Configuration.get().resourceFile + '/image/show/' + this.namaDokumen;
    this.listPegawaiDokumens = [...this.listPegawaiDokumen];
    this.listPegawaiDokumens[row].pathFile = this.pathDokumen;
  }

  addHeader(event) {
    this.httpService.beforeUploadFile(event);
  }

  resetJabatan(event) {
    this.jabatan = event;
    if (this.jabatan === undefined || this.jabatan === null) {
      this.form.get('kdPegawaiHead').disable();
      return;
    }

    this.form.get('kdPegawaiHead').enable();

    let criteria = '';
    if (this.kdPegawai !== undefined && this.kdPegawai !== null) {
      criteria = '&kdPegawai=' + this.kdPegawai
    }

    this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findMasterPegawaiAtasan?kdJabatan=' + this.jabatan + criteria).subscribe(res => {
      this.kdPegawaiHead = [];
      this.kdPegawaiHead.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdPegawaiHead.push({ label: res.data.data[i].namaLengkap + ' (' + res.data.data[i].namaJabatan + ')', value: res.data.data[i].kode })
      };
    });

  }

  resetPTKPStatusKawin(event) {
    this.statusKawin = event;
    if (this.jenisKelamin === undefined || this.jenisKelamin === null) {
      return;
    }
    this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findMasterPTKP?kdStatusPerkawinan=' + this.statusKawin + "&kdJenisKelamin=" + this.jenisKelamin).subscribe(res => {
      this.kdPTKP = [];
      this.kdPTKP.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdPTKP.push({ label: res.data.data[i].statusPTKP, value: res.data.data[i].id_kode })
      };
      this.isPTKP = (this.kdPTKP === undefined || this.kdPTKP === null || this.kdPTKP.length < 2);
    });
  }

  resetPTKPJenisKelamin(event) {
    this.jenisKelamin = event;
    if (this.statusKawin === undefined || this.statusKawin === null) {
      return;
    }
    this.jenisKelamin = event;
    this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findMasterPTKP?kdStatusPerkawinan=' + this.statusKawin + "&kdJenisKelamin=" + this.jenisKelamin).subscribe(res => {
      this.kdPTKP = [];
      this.kdPTKP.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdPTKP.push({ label: res.data.data[i].statusPTKP, value: res.data.data[i].id_kode })
      };
      this.isPTKP = (this.kdPTKP === undefined || this.kdPTKP === null || this.kdPTKP.length < 2);
    });
  }

  resetLokasi(event) {
    this.lokasi = event;
    if (this.lokasi === undefined || this.lokasi === null) {
      return;
    }
    this.lokasi = event;

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.lokasi).subscribe(res => {
      this.kdRuanganKerja = [];
      this.kdRuanganKerja.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdRuanganKerja.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id_kode })
      };

      this.isRuangan = (this.kdRuanganKerja === undefined || this.kdRuanganKerja === null || this.kdRuanganKerja.length < 2);
    });

  }


  ambilNegara(event) {
    // this.dataTrue = true;
    this.listPegawaiDokumen = [];
    let country = event;
    if (country == null || country == '') {
      //dapat pas awal tambah baru
      this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawai-dokumen/findJenisDokumenByKdNegara?kdNegara=1').subscribe(table => {
        this.listPegawaiDokumen = table.data;
      });

      //dapat pas udah pernah simpan, lagi edit
    } else if (country == this.rowSelectNegara && this.kdPegawai !== null && this.kdPegawai !== undefined) {
      let dataR = [];
      this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawai-dokumen/findDokumenByKdPegawai?kdPegawai=' + this.kdPegawai).subscribe(table => {
        if (table.data.length > 0) {
          for (let i = 0; i < table.data.length; i++) {
            dataR.push({
              "kdDokumen": table.data[i].kdDokumen,
              "kdJenisDokumen": table.data[i].kdJenisDokumen,
              "noDokumen": table.data[i].noDokumen,
              "namaJenisDokumen": table.data[i].namaJenisDokumen,
              "isPrimaryAddress": table.data[i].isPrimaryAddress,
              "tglAkhirBerlaku": table.data[i].tglAkhirBerlaku,
              "pathFile": table.data[i].pathFile,
              "panjang": null
            })
            this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPanjangNoDokumen?kdJenisDokumen=' + table.data[i].kdJenisDokumen).subscribe(res => {
              let panjangisi = Object.assign({}, dataR);
              panjangisi[i].panjang = res.data.panjangNoDokumen
            });
          }
          this.listPegawaiDokumen = dataR;
          for (let i = 0; i < table.data.length; i++) {
            if (this.listPegawaiDokumen[i].tglAkhirBerlaku != 0) {
              this.listPegawaiDokumen[i].tglAkhirBerlaku = new Date(this.listPegawaiDokumen[i].tglAkhirBerlaku * 1000)
            }
          }
          this.listPegawaiDokumen.forEach(function (data) {
            //ini tanpa seumur hidup
            if (data.noDokumen != '-' && data.tglAkhirBerlaku != 0) {
              data.statusLifetime = false
              //ini dengan seumur hidup
            } else if (data.noDokumen != '-' && data.tglAkhirBerlaku == 0) {
              data.statusLifetime = true
              data.tglSeumurHidup = true
              //ini ga di isi semua termasuk seumur hidup
            } else {
              data.statusLifetime = false
            }
          })
          // untuk ambil kembali nilai index disabled enabled checkbox primary
          if (table.data[table.data.length - 1]) {
            for (let i = 0; i < table.data.length; i++) {
              if (table.data[i].isPrimaryAddress == true) {
                this.tampung_index = i;
                this.disableCheckbox = true;
                break;
              }
            }
          }
          //untuk ambil kembali nilai index disabled enabled checkbox di status masa berlaku
          if (table.data[table.data.length - 1]) {
            for (let i = 0; i < table.data.length; i++) {
              if (table.data[i].tglSeumurHidup == true) {
                this.tampungIndexStatus = i;
                this.disableCheckbox2 = true;
                break;
              }
            }
          }
        }
        //////////////////////////////////
        else {
          let DataBaruPanjang = [];
          let dataD = [];
          let dRes;
          let dataR = [];
          let dataC;
          //ini pas mode tambah the real nya
          this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawai-dokumen/findJenisDokumenByKdNegara?kdNegara=' + country).subscribe(table => {

            for (let i = 0; i < table.data.length; i++) {
              dataR.push({
                "kdJenisDokumen": table.data[i].kdJenisDokumen,
                "namaJenisDokumen": table.data[i].namaJenisDokumen,
                "panjang": null
              })
              this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPanjangNoDokumen?kdJenisDokumen=' + table.data[i].kdJenisDokumen).subscribe(res => {
                let panjangisi = Object.assign({}, dataR);
                panjangisi[i].panjang = res.data.panjangNoDokumen
              });
            }

            this.listPegawaiDokumen = dataR;
            console.log(dataR);
            this.listPegawaiDokumen.forEach(function (data) {
              data.statusLifetime = false;
              data.noDokumen = "-";
            })
          });
        }
        /////////////////////////////
        this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawai-dokumen/findJenisDokumenByKdNegara?kdNegara=' + country).subscribe(table => {
          if (this.listPegawaiDokumen.length == 0) {
            this.listPegawaiDokumen = table.data;
          } else {
            for (let i = 0; i < table.data.length; i++) {
              if (this.listPegawaiDokumen[i] === undefined || this.listPegawaiDokumen[i] === null) {
                this.listPegawaiDokumen[i] = table.data[i];
              }
            }
          }
        });

      });

    } else {
      let DataBaruPanjang = [];
      let dataD = [];
      let dRes;
      let dataR = [];
      let dataC;
      //ini pas mode tambah the real nya
      this.httpService.get(Configuration.get().dataHr1Mod1 + '/pegawai-dokumen/findJenisDokumenByKdNegara?kdNegara=' + country).subscribe(table => {

        for (let i = 0; i < table.data.length; i++) {
          dataR.push({
            "kdJenisDokumen": table.data[i].kdJenisDokumen,
            "namaJenisDokumen": table.data[i].namaJenisDokumen,
            "panjang": null
          })
          this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPanjangNoDokumen?kdJenisDokumen=' + table.data[i].kdJenisDokumen).subscribe(res => {
            let panjangisi = Object.assign({}, dataR);
            panjangisi[i].panjang = res.data.panjangNoDokumen
          });
        }

        this.listPegawaiDokumen = dataR;
        console.log(dataR);


        this.listPegawaiDokumen.forEach(function (data) {
          data.statusLifetime = false;
          data.noDokumen = null;
        })
      });
    }
  }

  getId(ambil) {
    this.ambilId = ambil;
  }

  valuegolongan(newValue) {
    if (newValue == undefined || newValue == null) {
      return;
    } else {
      this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findPangkatPegawai/' + newValue).subscribe(res => {
        this.kdPangkat = [];
        this.kdPangkat.push({ label: '-- Pilih --', value: null })
        for (var i = 0; i < res.data.pangkat.length; i++) {
          this.kdPangkat.push({ label: res.data.pangkat[i].namaPangkat, value: res.data.pangkat[i].kdPangkat })
        };
      });
    }
  }

  pilihPangkat(event) {
    // console.log(event.value)
    if (event.value == null) {
      this.form.get('kdGolonganPegawai').setValue(null);
    }
  }

  getTanggalAkhirGabung(event) {
    let kategoripegawai = event.value
    if (kategoripegawai === this.kdKategoryPegawaiTetap) {
      this.form.get('tanggalAkhirKontrak').disable()
    }
    else {
      this.form.get('tanggalAkhirKontrak').enable()
    }
    if (event.value != null) {
      this.iskdKategoryPegawai = true
    }
    else {
      this.iskdKategoryPegawai = false
    }
    let tanggalawalgabung = this.setTimeStamp(this.form.get('tglMasuk').value)

    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/getTglAkhirKontrak/' + kategoripegawai + '/' + tanggalawalgabung).subscribe(res => {
      if (res.data.tanggalAkhir != null) {
        this.tanggalAkhirKontrak = new Date(res.data.tanggalAkhir * 1000)
        this.form.get('tanggalAkhirKontrak').setValue(new Date(res.data.tanggalAkhir * 1000))
      }
      else {
        this.form.get('tanggalAkhirKontrak').setValue(null)
        this.tanggalAkhirKontrak = null

      }

    });
  }

  cekTglMasuk(newValue) {
    if (newValue == undefined || newValue == null) {
      return;
    }

    let tglMasuk = newValue / 1000;
    let skr = new Date().getTime() / 1000;

    let kdStatusLama = this.form.get('kdStatusPegawai').value;

    if (kdStatusLama === undefined || kdStatusLama === null ||
      kdStatusLama == this.kdStatusPegawaiAktif || kdStatusLama == this.kdStatusPegawaiTidakAktif) {
      if (tglMasuk > skr) {
        this.form.get('kdStatusPegawai').setValue(this.kdStatusPegawaiTidakAktif);
        this.form.get('statusPegawai').setValue(this.statusPegawaiTidakAktif);
        this.alertService.warn('Peringatan', 'Status pegawai ini belum aktif, karena belum resmi masuk perusahaan.');
      } else {
        this.form.get('kdStatusPegawai').setValue(this.kdStatusPegawaiAktif);
        this.form.get('statusPegawai').setValue(this.statusPegawaiAktif);
      }
    }

    this.form.get('kdKategoryPegawai').setValue(null)
    this.form.get('kdKategoryPegawai').enable()
    this.form.get('tanggalAkhirKontrak').setValue(null)
    this.form.get('tanggalAwalKontrak').setValue(newValue)
    this.tanggalAwalKontrak = this.form.get('tglMasuk').value
    this.istglMasuk = true

    let month = newValue.getMonth();
    let year = newValue.getFullYear();
    this.minDate = newValue;
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);


  }

  cekTglDaftar(newValue) {
    if (newValue == undefined || newValue == null) {
      return;
    }

    let tgDaftar = newValue / 1000;

    let tglMasukTS = this.setTimeStamp(this.form.get('tglMasuk').value)

    if (tgDaftar > tglMasukTS) {
      this.alertService.warn('Peringatan', 'Tanggal gabung group tidak boleh lebih besar dari tanggal masuk perusahaan');
    }
  }

  valuezodiak(newValue) {
    if (newValue == undefined || newValue == null) {
      return;
    }
    this.tgl = newValue / 1000;
    this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findZodiak/' + this.tgl).subscribe(table => {
      let listData = table.data.zodiak;
      this.zodiak = [];
      for (var i = 0; i < listData.length; i++) {
        this.zodiak.push({ zz: table.data.zodiak[i].namaZodiak, yy: table.data.zodiak[i].namaZodiakUnsur, kzz: table.data.zodiak[i].kdZodiak, kyy: table.data.zodiak[i].kdZodiakUnsur })
        this.kdZodiakUnsur = this.zodiak[i].kyy;
        this.kdZodiak = this.zodiak[i].kzz;
        this.zodiakUnsur = this.zodiak[i].yy;
        this.zodiak = this.zodiak[i].zz;
      };
    });
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Agama&select=id.kode,namaAgama').subscribe(table => {

      this.fileService.exportAsExcelFile(table.data.pegawai, 'DataPegawai');
    });
  }

  downloadPdf() {
    var col = ["Kode Kecamatan", "Nama Kecamatan", "Propinsi", "Kota Kabupaten", "Report Display", "Kode Eksternal", "Nama Eksternal"];
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?').subscribe(table => {

      this.registrasiPegawai = table.data.pegawai
      this.registrasiPegawai1 = [];
      for (let i = 0; i < this.registrasiPegawai.length; i++) {
        this.registrasiPegawai.push({
          kode: this.registrasiPegawai[i].kdPegawai,
        });
      }
      this.fileService.exportAsPdfFile("Master Kecamatan", col, this.registrasiPegawai1, "Kecamatan");
    });
  }

  get(page: number, rows: number) {
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?page=' + page + '&rows=' + rows + '&dir=namaLengkap&sort=asc').subscribe(table => {
      this.listData = table.data.pegawai;
      this.totalRecords = table.data.totalRow;
    });

    //dropdown
    this.statusRhesus = [];
    this.statusRhesus.push({ label: '-- Pilih --', value: null });
    this.statusRhesus.push({ label: "+", value: "+" });
    this.statusRhesus.push({ label: "-", value: "-" });

    // this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findJenisPegawaiTidakPakai').subscribe(res => {
    //   this.kdJenisPegawaiDef = res.data.kode;
    // });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=TitlePegawai&select=namaTitle,id.kode').subscribe(res => {
      this.kdTitle = [];
      this.kdTitle.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdTitle.push({ label: res.data.data[i].namaTitle, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=JenisKelamin&select=namaJenisKelamin,id.kode').subscribe(res => {
      this.kdJenisKelamin = [];
      this.kdJenisKelamin.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=KualifikasiJurusan&select=namaKualifikasiJurusan,id.kode').subscribe(res => {
      this.kdKualifikasiJurusan = [];
      this.kdKualifikasiJurusan.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdKualifikasiJurusan.push({ label: res.data.data[i].namaKualifikasiJurusan, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Jabatan&select=namaJabatan,id.kode').subscribe(res => {
      this.kdJabatan = [];
      this.kdJabatan.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdJabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Eselon&select=namaEselon,id.kode').subscribe(res => {
      this.kdEselon = [];
      this.kdEselon.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdEselon.push({ label: res.data.data[i].namaEselon, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=TypePegawai&select=namaTypePegawai,id.kode').subscribe(res => {
      this.kdTypePegawai = [];
      this.kdTypePegawai.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdTypePegawai.push({ label: res.data.data[i].namaTypePegawai, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=KategoryPegawai&select=namaKategoryPegawai,id.kode').subscribe(res => {
      this.kdKategoryPegawai = [];
      this.kdKategoryPegawai.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode })
      };
    });

    Observable.forkJoin(
      this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findStatusPegawaiAktif'),
      this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findStatusPegawaiTidakAktif')
    ).subscribe(res => {
      this.kdStatusPegawaiAktif = res[0].data.kode;
      this.statusPegawaiAktif = res[0].data.namaStatus;
      this.kdStatusPegawaiTidakAktif = res[1].data.kode;
      this.statusPegawaiTidakAktif = res[1].data.namaStatus;
      this.form.get('statusPegawai').disable();

      let kdStatusPegawaiInside = this.form.get('kdStatusPegawai').value;

      if (
        this.form.get('tglMasuk') === undefined || this.form.get('tglMasuk') === null ||
        this.form.get('tglDaftar') === undefined || this.form.get('tglDaftar') === null ||
        kdStatusPegawaiInside === undefined || kdStatusPegawaiInside === null
      ) {
        this.form.get('tglMasuk').enable();
        this.form.get('tglDaftar').enable();

      } else if (kdStatusPegawaiInside == this.kdStatusPegawaiAktif || kdStatusPegawaiInside == this.kdStatusPegawaiTidakAktif) {
        this.form.get('tglMasuk').enable();
        this.form.get('tglDaftar').enable();
        this.istglMasuk = true
      } else {
        this.form.get('tglMasuk').disable();
        this.form.get('tglDaftar').disable();
      }
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Departemen&select=namaDepartemen,id.kode').subscribe(res => {
      this.kdDepartemen = [];
      this.kdDepartemen.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/ruangan/findLokasiKerja').subscribe(res => {
      this.kdLokasi = [];
      this.kdLokasi.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.length; i++) {
        this.kdLokasi.push({ label: res.data[i].namaRuangan, value: res.data[i].kdRuangan })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
      this.kdNegara = [];
      this.kdNegara.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.Negara.length; i++) {
        this.kdNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/status/status-perkawinan').subscribe(res => {
      this.kdStatusPerkawinan = [];
      this.kdStatusPerkawinan.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.length; i++) {
        this.kdStatusPerkawinan.push({ label: res.data[i].namaStatus, value: res.data[i].kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=Suku&select=namaSuku,id.kode').subscribe(res => {
      this.kdSuku = [];
      this.kdSuku.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdSuku.push({ label: res.data.data[i].namaSuku, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=Agama&select=namaAgama,id.kode').subscribe(res => {
      this.kdAgama = [];
      this.kdAgama.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdAgama.push({ label: res.data.data[i].namaAgama, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=GolonganDarah&select=namaGolonganDarah,id.kode').subscribe(res => {
      this.kdGolonganDarah = [];
      this.kdGolonganDarah.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdGolonganDarah.push({ label: res.data.data[i].namaGolonganDarah, value: res.data.data[i].id_kode })
      };
    });

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=GolonganPegawai&select=namaGolonganPegawai,id.kode').subscribe(res => {
      this.kdGolonganPegawai = [];
      this.kdGolonganPegawai.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id_kode })
      };
    });

    //jenisPegawai
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=JenisPegawai&select=namaJenisPegawai,id').subscribe(res => {
      this.listJenisPegawai = [];
      this.listJenisPegawai.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisPegawai.push({ label: res.data.data[i].namaJenisPegawai, value: res.data.data[i].id.kode })
      };
    });

  }


  cari() {
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawai?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaLengkap&sort=desc&namaLengkap=' + this.pencarian).subscribe(table => {
      this.listData = table.data.pegawai;
    });
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

  unduhan(i, event): boolean {
    return (this.listPegawaiDokumen === undefined ||
      this.listPegawaiDokumen === null ||
      this.listPegawaiDokumen[i] === undefined ||
      this.listPegawaiDokumen[i] === null ||
      this.listPegawaiDokumen.length == 0 ||
      this.listPegawaiDokumen[i].pathFile === undefined ||
      this.listPegawaiDokumen[i].pathFile === null
    );
  }

  download(i, event) {
    if (this.listPegawaiDokumen === undefined ||
      this.listPegawaiDokumen === null ||
      this.listPegawaiDokumen[i] === undefined ||
      this.listPegawaiDokumen[i] === null ||
      this.listPegawaiDokumen.length == 0 ||
      this.listPegawaiDokumen[i].pathFile === undefined ||
      this.listPegawaiDokumen[i].pathFile === null
    ) {
      return;
    }
    this.httpService.getFileDownload(Configuration.get().resourceFile + '/file/download/' + this.listPegawaiDokumen[i].pathFile);
  }

  update() {
    let data = [];
    for (let i = 0; i < this.listPegawaiDokumen.length; i++) {
      let path = this.listPegawaiDokumen[i].pathFile;
      let nodok = this.listPegawaiDokumen[i].noDokumen;
      let primary = this.listPegawaiDokumen[i].isPrimaryAddress;
      // console.log(primary);
      if (path) { this.path = path; } else { this.path = null; }
      if (nodok) { this.nodok = nodok; } else { this.nodok = '-'; }
      if (this.listPegawaiDokumen[i].statusLifetime == false) {
        data.push({
          // "reportDisplay": '-',
          "deskripsiDokumen": null,
          "isPrimaryAddress": primary,
          "kdDokumen": this.listPegawaiDokumen[i].kdDokumen,
          "kdJenisDokumen": this.listPegawaiDokumen[i].kdJenisDokumen,
          "kdKategoryDokumen": 1,
          "kdPegawai": this.kdPegawai,
          // "namaLengkap": this.namaLengkap,
          "keteranganLainnya": null,
          "namaJudulDokumen": this.listPegawaiDokumen[i].namaJenisDokumen,
          "noDokumen": this.nodok,
          "noVerifikasi": null,
          "pathFile": this.path,
          "tglAkhirBerlaku": this.setTimeStamp(this.listPegawaiDokumen[i].tglAkhirBerlaku)
        })
      } else {
        data.push({
          // "reportDisplay": '-',
          "deskripsiDokumen": null,
          "isPrimaryAddress": primary,
          "kdDokumen": this.listPegawaiDokumen[i].kdDokumen,
          "kdJenisDokumen": this.listPegawaiDokumen[i].kdJenisDokumen,
          "kdKategoryDokumen": 1,
          "kdPegawai": this.kdPegawai,
          // "namaLengkap": this.namaLengkap,
          "keteranganLainnya": null,
          "namaJudulDokumen": this.listPegawaiDokumen[i].namaJenisDokumen,
          "noDokumen": this.nodok,
          "noVerifikasi": null,
          "pathFile": this.path,
          "tglAkhirBerlaku": 0
        })
      }
    }
    //untuk validasi dokumen paling atas atau dokumen utama wajib di isi ga boleh di lewat
    let dokumenUtama = 0;
    if (data[0].noDokumen == '' || data[0].noDokumen == '-' || data[0].noDokumen == undefined || data[0].noDokumen == null) {
      dokumenUtama = 1;
    }


    let dataDokumen = { data }
    let tglLahirTS = this.setTimeStamp(this.form.get('tglLahir').value)
    let tglMasukTS = this.setTimeStamp(this.form.get('tglMasuk').value)
    let tglDaftarTS = this.setTimeStamp(this.form.get('tglDaftar').value)
    let tglDaftarFingerPrintTS = this.setTimeStamp(this.form.get('tglDaftarFingerPrint').value)

    let tglMulaiKatpe = this.setTimeStamp(this.form.get('tanggalAwalKontrak').value)
    let tglAkhirKatpe = this.setTimeStamp(this.form.get('tanggalAkhirKontrak').value)
    if (this.form.get('tanggalAkhirKontrak').value == null) {
      tglAkhirKatpe = null;
    }
    // console.log(dataDokumen);      




    let formSubmit = {
      "data": dataDokumen,
      "fingerPrintID": this.form.get('fingerPrintID').value,
      "kdAgama": this.form.get('kdAgama').value,
      "kdDepartemen": this.form.get('kdDepartemen').value,
      "kdEselon": this.form.get('kdEselon').value,
      "kdGolonganDarah": this.form.get('kdGolonganDarah').value,
      "kdGolonganPegawai": this.form.get('kdGolonganPegawai').value,
      "kdJabatan": this.form.get('kdJabatan').value,
      "kdJenisKelamin": this.form.get('kdJenisKelamin').value,
      "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
      "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
      "kdNegaraAsal": this.form.get('kdNegara').value,
      "kdPangkat": this.form.get('kdPangkat').value,
      "kdPegawaiHead": this.form.get('kdPegawaiHead').value,
      "kdProfileBefore": 0,
      "kdPTKP": this.form.get('kdPTKP').value,
      "kdLokasi": this.form.get('kdLokasi').value,
      "kdRuanganKerja": this.form.get('kdRuanganKerja').value,
      "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
      "kdStatusPerkawinan": this.form.get('kdStatusPerkawinan').value,
      "kdSuku": this.form.get('kdSuku').value,
      "kdTitle": this.form.get('kdTitle').value,
      "kdTypePegawai": this.form.get('kdTypePegawai').value,
      "kdZodiak": this.form.get('kdZodiak').value,
      "kdZodiakUnsur": this.form.get('kdZodiakUnsur').value,
      "kode": this.form.get('kode').value,
      "namaAkhir": this.form.get('namaAkhir').value,
      "namaAwal": this.form.get('namaAwal').value,
      "namaKeluarga": "",
      "namaLengkap": "",
      "namaPanggilan": "",
      "namaTengah": this.form.get('namaTengah').value,
      "nikgroup": this.form.get('nikgroup').value,
      "nikintern": this.form.get('nikintern').value,
      "npwp": this.form.get('npwp').value,
      "okey": false,
      "photoDiri": this.form.get('photoDiri').value,
      "statusRhesus": this.form.get('statusRhesus').value,
      "tempatLahir": this.form.get('tempatLahir').value,
      "tglDaftar": tglDaftarTS,
      "tglDaftarFingerPrint": tglDaftarFingerPrintTS,
      "tglLahir": tglLahirTS,
      "tglMasuk": tglMasukTS,
      "tglMulaiKatpe": tglMulaiKatpe,
      "tglAkhirKatpe": tglAkhirKatpe
    }

    // let formSubmit = this.form.value;
    // formSubmit.data = dataDokumen;

    let namaTengah = (formSubmit.namaTengah === undefined || formSubmit.namaTengah === null || formSubmit.namaTengah == '') ? '' : ' ' + formSubmit.namaTengah;
    let namaAkhir = (formSubmit.namaAkhir === undefined || formSubmit.namaAkhir === null || formSubmit.namaAkhir == '') ? '' : ' ' + formSubmit.namaAkhir;

    formSubmit.namaLengkap = formSubmit.namaAwal + namaTengah + namaAkhir;

    // formSubmit.tglMulaiKatpe = tglMulaiKatpe
    // formSubmit.tglLahir = tglLahirTS;
    // formSubmit.tglMasuk = tglMasukTS;
    // formSubmit.tglDaftar = tglDaftarTS;
    // formSubmit.tglDaftarFingerPrint = tglDaftarFingerPrintTS;
    // formSubmit.kdJenisPegawai = this.kdJenisPegawaiDef;

    let arrayAlert = [];
    for (let y = 0; y < this.listPegawaiDokumen.length; y++) {

      let noDoku = this.listPegawaiDokumen[y].noDokumen;
      let panjang = this.listPegawaiDokumen[y].panjang;
      let namaDok = this.listPegawaiDokumen[y].namaJenisDokumen;
      let pathFile = this.listPegawaiDokumen[y].pathFile

      if (pathFile === undefined || pathFile === null) {
        if (y != 0 && (noDoku === undefined || noDoku === null || noDoku.trim() == '')) {
          noDoku = '-'
          this.listPegawaiDokumen[y].noDokumen = '-'
        }
        if (noDoku === undefined || noDoku === null || noDoku.trim() == '' ||
          ((noDoku.length != panjang) && noDoku != '-')) {
          arrayAlert.push(' ' + namaDok + ' isi dengan panjang ' + panjang + ' digit.<br/>');
        }
      } else {
        if (noDoku === undefined || noDoku === null || noDoku.length != panjang) {
          arrayAlert.push(' ' + namaDok + ' yang sudah diupload berkasnya isi dengan panjang ' + panjang + ' digit.<br/>');
        }
      }

      // if(noDoku == null){
      //     noDoku = '-';
      //   }
      // if( (noDoku.length != panjang && noDoku != '-') || ( pathDok != null && noDoku.length != panjang)  ){
      //   arrayAlert.push('<p>'+namaDok+' '+'Isi Dengan Panjang'+' '+panjang+' '+'Digit'+'</p>');        
      // }      

    }

    // let errorLengkapDoku = 0;
    // for (let k=0; k<this.listPegawaiDokumen.length; k++){
    //   let pathFile = this.listPegawaiDokumen[k].pathFile;
    //   let noDoku = this.listPegawaiDokumen[k].noDokumen;
    //   let panjang = this.listPegawaiDokumen[k].panjang


    //   if (pathFile != null && (noDoku === undefined || noDoku === null || noDoku.trim() == '' ||
    //     ((noDoku.length != panjang) && noDoku != '-')){
    //     errorLengkapDoku = errorLengkapDoku +1
    //   }
    // }

    // let kurangLengkapDokumen = 0;
    // for(let p=0; p<this.listPegawaiDokumen.length; p++){
    //   let noDokumenP = this.listPegawaiDokumen[p].noDokumen;
    //   let pathFileP = this.listPegawaiDokumen[p].pathFile;
    //   // let tglSeumurHidupP = this.listPegawaiDokumen[p].tglSeumurHidup;
    //   let tglAkhirBerlakuP = this.listPegawaiDokumen[p].tglAkhirBerlaku;
    //   // let isPrimaryAddressP = this.listPegawaiDokumen[p].isPrimaryAddress;
    //   if(noDokumenP == '' || pathFileP == '' || tglAkhirBerlakuP == '' ){
    //     kurangLengkapDokumen = 1;
    //   }
    // }

    if (formSubmit.npwp.length < 15 && this.form.get('npwp').value != '') {
      this.alertService.warn('Peringatan', 'Harap Isi dengan sesuai, no NPWP 15 Digit');
    } else if (arrayAlert.length != 0) {
      this.alertService.warn('Peringatan', 'Harap isi No Dokumen dengan sesuai :' + arrayAlert)
    }
    /*else if (errorLengkapDoku !=0) {
      this.alertService.warn('Peringatan','Lengkapi Detail Data Dokumen')
    }*/
    // else if(kurangLengkapDokumen = 1){
    //     this.alertService.warn('Peringatan', 'Harap Lengkapi Isi Dokumen Pegawai');
    //   }
    else if (dokumenUtama == 1) {
      this.alertService.warn('Peringatan', 'Wajib Isi Dokumen Utama :' + data[0].namaJudulDokumen);
    }
    else {
      this.httpService.update(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/update/' + this.versi, formSubmit).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
      });
    }
  }

  panggilAlert(dataP) {
    this.alertService.warn('Peringatan', 'Harap Isi No Dokumen ' + dataP.namaJenisDokumen + ' ' + dataP.panjang + ' Digit');
  }


  onGanti(index, data) {
    let indexData = index;
    let isiInput = data.target.value;
    let maxPanjang = data.currentTarget.maxLength;
    if (isiInput == '-' && isiInput == '') {
      isiInput = 0;
    }
    if (isiInput.length < maxPanjang && isiInput != '-') {
      this.alertService.warn('Peringatan', 'Harap Isi No Dokumen ' + this.listPegawaiDokumen[indexData].namaJenisDokumen + ' ' + maxPanjang + ' Digit');
    }
  }

  simpan() {

    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {

      let data = [];
      for (let i = 0; i < this.listPegawaiDokumen.length; i++) {
        let path = this.listPegawaiDokumen[i].pathFile;
        let nodok = this.listPegawaiDokumen[i].noDokumen;
        let primary = this.listPegawaiDokumen[i].isPrimaryAddress;


        if (path) { this.path = path; } else { this.path = null; }
        if (nodok) { this.nodok = nodok; } else { this.nodok = '-'; }
        // if (this.selectedDocument == this.listPegawaiDokumen[i]){this.primary=1;}else{this.primary=0;}        
        if (primary == undefined) {
          primary = false;
        } else {
          primary = primary;
        }


        if (this.listPegawaiDokumen[i].statusLifetime == false) {
          data.push({
            // "reportDisplay": '-',
            "deskripsiDokumen": null,
            "isPrimaryAddress": primary,
            "kdDokumen": this.listPegawaiDokumen[i].kdDokumen,
            "kdJenisDokumen": this.listPegawaiDokumen[i].kdJenisDokumen,
            "kdKategoryDokumen": 1,
            "kdPegawai": null,
            // "namaLengkap": null,
            "keteranganLainnya": null,
            "namaJudulDokumen": this.listPegawaiDokumen[i].namaJenisDokumen,
            "noDokumen": this.nodok,
            "noVerifikasi": null,
            "pathFile": this.path,
            "tglAkhirBerlaku": this.setTimeStamp(this.listPegawaiDokumen[i].tglAkhirBerlaku)
          })
        } else {
          data.push({
            // "reportDisplay": '-',
            "deskripsiDokumen": null,
            "isPrimaryAddress": primary,
            "kdDokumen": this.listPegawaiDokumen[i].kdDokumen,
            "kdJenisDokumen": this.listPegawaiDokumen[i].kdJenisDokumen,
            "kdKategoryDokumen": 1,
            "kdPegawai": null,
            // "namaLengkap": null,
            "keteranganLainnya": null,
            "namaJudulDokumen": this.listPegawaiDokumen[i].namaJenisDokumen,
            "noDokumen": this.nodok,
            "noVerifikasi": null,
            "pathFile": this.path,
            "tglAkhirBerlaku": 0
          })
        }

      }

      //untuk validasi dokumen paling atas atau dokumen utama wajib di isi ga boleh di lewat
      let dokumenUtama = 0;
      if (data[0].noDokumen == '' || data[0].noDokumen == '-' || data[0].noDokumen == undefined || data[0].noDokumen == null) {
        dokumenUtama = 1;
      }

      let dataDokumen = { data }
      let tglLahirTS = this.setTimeStamp(this.form.get('tglLahir').value)
      let tglMasukTS = this.setTimeStamp(this.form.get('tglMasuk').value)
      let tglDaftarTS = this.setTimeStamp(this.form.get('tglDaftar').value)
      let tglDaftarFingerPrintTS = this.setTimeStamp(this.form.get('tglDaftarFingerPrint').value)

      let tglMulaiKatpe = this.setTimeStamp(this.form.get('tanggalAwalKontrak').value)

      let kdStatusLama = this.form.get('kdStatusPegawai').value;

      let skr = new Date().getTime() / 1000;


      if (kdStatusLama === undefined || kdStatusLama === null ||
        kdStatusLama == this.kdStatusPegawaiAktif || kdStatusLama == this.kdStatusPegawaiTidakAktif) {

        if (tglMasukTS > skr) {
          this.form.get('kdStatusPegawai').setValue(this.kdStatusPegawaiTidakAktif);
          this.form.get('statusPegawai').setValue(this.statusPegawaiTidakAktif);
          this.alertService.info('Informasi', 'Status pegawai ini dibuat tidak aktif, karena masuk perusahaan di masa depan.');
        } else {
          this.form.get('kdStatusPegawai').setValue(this.kdStatusPegawaiAktif);
          this.form.get('statusPegawai').setValue(this.statusPegawaiAktif);
        }

      }
      let tglAkhirKatpe = this.setTimeStamp(this.form.get('tanggalAkhirKontrak').value)
      if (this.form.get('tanggalAkhirKontrak').value == null) {
        tglAkhirKatpe = null;
      }
      let formSubmit = {
        "data": dataDokumen,
        "fingerPrintID": this.form.get('fingerPrintID').value,
        "kdAgama": this.form.get('kdAgama').value,
        "kdDepartemen": this.form.get('kdDepartemen').value,
        "kdEselon": this.form.get('kdEselon').value,
        "kdGolonganDarah": this.form.get('kdGolonganDarah').value,
        "kdGolonganPegawai": this.form.get('kdGolonganPegawai').value,
        "kdJabatan": this.form.get('kdJabatan').value,
        "kdJenisKelamin": this.form.get('kdJenisKelamin').value,
        "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
        "kdKategoryPegawai": this.form.get('kdKategoryPegawai').value,
        "kdNegaraAsal": this.form.get('kdNegara').value,
        "kdPangkat": this.form.get('kdPangkat').value,
        "kdPegawaiHead": this.form.get('kdPegawaiHead').value,
        "kdPTKP": this.form.get('kdPTKP').value,
        "kdLokasi": this.form.get('kdLokasi').value,
        "kdRuanganKerja": this.form.get('kdRuanganKerja').value,
        "kdStatusPegawai": this.form.get('kdStatusPegawai').value,
        "kdStatusPerkawinan": this.form.get('kdStatusPerkawinan').value,
        "kdSuku": this.form.get('kdSuku').value,
        "kdTitle": this.form.get('kdTitle').value,
        "kdTypePegawai": this.form.get('kdTypePegawai').value,
        "kdZodiak": this.form.get('kdZodiak').value,
        "kdZodiakUnsur": this.form.get('kdZodiakUnsur').value,
        "kode": this.form.get('kode').value,
        "namaAkhir": this.form.get('namaAkhir').value,
        "namaAwal": this.form.get('namaAwal').value,
        "namaKeluarga": "",
        "namaLengkap": "",
        "namaPanggilan": "",
        "namaTengah": this.form.get('namaTengah').value,
        "nikgroup": this.form.get('nikgroup').value,
        "nikintern": this.form.get('nikintern').value,
        "npwp": this.form.get('npwp').value,
        "okey": false,
        "photoDiri": this.form.get('photoDiri').value,
        "statusRhesus": this.form.get('statusRhesus').value,
        "tempatLahir": this.form.get('tempatLahir').value,
        "tglDaftar": tglDaftarTS,
        "tglDaftarFingerPrint": tglDaftarFingerPrintTS,
        "tglLahir": tglLahirTS,
        "tglMasuk": tglMasukTS,
        "tglMulaiKatpe": tglMulaiKatpe,
        "tglAkhirKatpe":tglAkhirKatpe
      }


      // let formSubmit = this.form.value;
      // formSubmit.data = dataDokumen;

      let namaTengah = (formSubmit.namaTengah === undefined || formSubmit.namaTengah === null || formSubmit.namaTengah == '') ? '' : ' ' + formSubmit.namaTengah;
      let namaAkhir = (formSubmit.namaAkhir === undefined || formSubmit.namaAkhir === null || formSubmit.namaAkhir == '') ? '' : ' ' + formSubmit.namaAkhir;

      formSubmit.namaLengkap = formSubmit.namaAwal + namaTengah + namaAkhir;

      // formSubmit.tglLahir = tglLahirTS;
      // formSubmit.tglMasuk = tglMasukTS;
      // formSubmit.tglDaftar = tglDaftarTS;
      // formSubmit.tglDaftarFingerPrint = tglDaftarFingerPrintTS;
      // formSubmit.kdJenisPegawai = this.kdJenisPegawaiDef;

      let arrayAlert2 = [];
      for (let y = 0; y < this.listPegawaiDokumen.length; y++) {

        let noDoku = this.listPegawaiDokumen[y].noDokumen;
        let panjang = this.listPegawaiDokumen[y].panjang;
        let namaDok = this.listPegawaiDokumen[y].namaJenisDokumen;
        let pathFile = this.listPegawaiDokumen[y].pathFile;

        if (pathFile === undefined || pathFile === null) {
          if (y != 0 && (noDoku === undefined || noDoku === null || noDoku.trim() == '')) {
            noDoku = '-'
            this.listPegawaiDokumen[y].noDokumen = '-'
          }
          if (noDoku === undefined || noDoku === null || noDoku.trim() == '' ||
            ((noDoku.length != panjang) && noDoku != '-')) {
            arrayAlert2.push(' ' + namaDok + ' isi dengan panjang ' + panjang + ' digit.<br/>');
          }
        } else {
          if (noDoku === undefined || noDoku === null || noDoku.length != panjang) {
            arrayAlert2.push(' ' + namaDok + ' yang sudah diupload berkasnya isi dengan panjang ' + panjang + ' digit.<br/>');
          }
        }

        // if(noDoku == null){
        //   noDoku = '';
        // }

        // if(noDoku.length != panjang && noDoku != '' ){
        //   arrayAlert2.push('<p>'+namaDok+' '+'Isi Dengan Panjang'+' '+panjang+' '+'Digit'+'</p>');
        // }
      }

      // let errorLengkapDoku = 0;
      // for (let k=0; k<this.listPegawaiDokumen.length; k++){
      //   let pathFile2 = this.listPegawaiDokumen[k].pathFile;
      //   let noDoku2 = this.listPegawaiDokumen[k].noDokumen;
      //   let panjang2 = this.listPegawaiDokumen[k].panjang
      //   if (pathFile2 != null && (noDoku2.length != panjang2 || noDoku2 == '')){
      //     errorLengkapDoku = errorLengkapDoku +1
      //   }
      // }

      // let kurangLengkapDokumen = 0;
      // for(let p=0; p<this.listPegawaiDokumen.length; p++){
      //   let noDokumenP = this.listPegawaiDokumen[p].noDokumen;
      //   let pathFileP = this.listPegawaiDokumen[p].pathFile;
      //   // let tglSeumurHidupP = this.listPegawaiDokumen[p].tglSeumurHidup;
      //   let tglAkhirBerlakuP = this.listPegawaiDokumen[p].tglAkhirBerlaku;
      //   // let isPrimaryAddressP = this.listPegawaiDokumen[p].isPrimaryAddress;
      //   if(noDokumenP == '' || pathFileP == '' || tglAkhirBerlakuP == '' ){
      //     kurangLengkapDokumen = 1;
      //   }
      // }
      console.log(formSubmit)

      if (formSubmit.npwp.length < 15 && this.form.get('npwp').value != '') {
        this.alertService.warn('Peringatan', 'Harap Isi dengan sesuai, no NPWP 15 Digit');
      } else if (arrayAlert2.length != 0) {
        this.alertService.warn('Peringatan', 'Harap isi No Dokumen dengan sesuai :' + arrayAlert2)
      }
      /*else if (errorLengkapDoku !=0) {
        this.alertService.warn('Peringatan','Lengkapi Detail Data Dokumen')
      }*/
      // else if(kurangLengkapDokumen = 1){
      //   this.alertService.warn('Peringatan', 'Harap Lengkapi Isi Dokumen Pegawai');
      // }
      else if (dokumenUtama == 1) {
        this.alertService.warn('Peringatan', 'Wajib Isi Dokumen Utama :' + data[0].namaJudulDokumen);
      }
      else {
        this.httpService.post(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/save', formSubmit).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Disimpan');
          this.buttonAktif = true;
          let data = response;
          this.getPegawai(data.data.kdPegawai);
        });
      }
    }
  }

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
    this.smbrFoto = "";
    this.pathDokumen = "";
    this.listPegawaiDokumen = [];
  }

  saveToStorage(path: string) {
    localStorage.setItem(path + ":pegawai", JSON.stringify(this.httpService.serviceData));
  }

  setData() {
    let data = JSON.parse(localStorage.getItem('data-pegawai:' + this.namaLogin))
    this.rowSelectNegara = data.kdNegaraAsal;
    this.kdPegawai = data.kdPegawai;


    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findJumlahAnakPegawaiByKode/' + this.kdPegawai).subscribe(res => {
      this.jumlahAnak = res.data.jumlahAnak
    });

    let dataNew;
    let cloned
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findByKode/' + this.kdPegawai).subscribe(res => {
      dataNew = res.data.pegawai;
      cloned = this.clone(dataNew);
      this.statusKawin = dataNew.kdStatusPerkawinan;
      this.jenisKelamin = dataNew.kdJenisKelamin;
      this.formAktif = false;

      if (
        this.form.get('tglMasuk') === undefined || this.form.get('tglMasuk') === null ||
        this.form.get('tglDaftar') === undefined || this.form.get('tglDaftar') === null ||
        cloned.kdStatusPegawai === undefined || cloned.kdStatusPegawai === null
      ) {

        this.form.get('tglMasuk').enable();
        this.form.get('tglDaftar').enable();

      } else if (cloned.kdStatusPegawai == this.kdStatusPegawaiAktif || cloned.kdStatusPegawai == this.kdStatusPegawaiTidakAktif) {
        this.form.get('tglMasuk').enable();
        this.form.get('tglDaftar').enable();
        this.istglMasuk = true
      } else {
        this.form.get('tglMasuk').disable();
        this.form.get('tglDaftar').disable();
      }


      this.form.setValue(cloned);
      if (this.form.get('kdKategoryPegawai').value != null) {
        this.iskdKategoryPegawai = true
      }
      this.valuezodiak(cloned.tglLahir);
      this.ambilNegara(cloned.kdNegara);
      this.resetPTKPStatusKawin(cloned.kdStatusPerkawinan);
      this.resetJabatan(cloned.kdJabatan);
      this.namaLengkap = dataNew.namaLengkap;
      this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + dataNew.photoDiri;

      if (this.form.get('kdKategoryPegawai').value == this.kdKategoryPegawaiTetap) {
        this.form.get('tanggalAkhirKontrak').disable();
        this.form.get('tanggalAkhirKontrak').setValue(null);
      }
      else {
        this.form.get('tanggalAkhirKontrak').enable()
      }


    });
  }

  getPegawai(kdPegawai) {
    this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findByKode/' + kdPegawai).subscribe(res => {
      localStorage.setItem('data-pegawai:' + this.namaLogin, JSON.stringify(res.data.pegawai));
      localStorage.setItem('status-step' + this.namaLogin, 'false');
      this.route.navigate(['alamat']);
    });
  }

  clone(hub: any): any {
    let tanggalakhirkontrak;
    if (hub.tglAkhirKontrak == null || hub.tglAkhirKontrak == "null") {
      tanggalakhirkontrak = null
    }
    else {
      tanggalakhirkontrak = new Date(hub.tglAkhirKontrak * 1000)
    }

    let tanggalawalkontrak;
    if (hub.tglAwalKontrak == null || hub.tglAwalKontrak == "null") {
      tanggalawalkontrak = null
    }
    else {
      tanggalawalkontrak = new Date(hub.tglAwalKontrak * 1000)
    }

    let fixHub = {
      "kode": hub.kdPegawai,
      "kdTitle": hub.kdTitlePegawai,
      "namaAwal": hub.namaAwal,
      "namaTengah": hub.namaTengah,
      "namaAkhir": hub.namaAkhir,
      "kdJenisKelamin": hub.kdJenisKelamin,
      "tempatLahir": hub.tempatLahir,
      "tglLahir": new Date(hub.tglLahir * 1000),
      "kdZodiak": hub.kdZodiak,
      "kdZodiakUnsur": hub.kdZodiakUnsur,
      "zodiak": hub.zodiak,
      "zodiakUnsur": hub.zodiakUnsur,
      "tglMasuk": new Date(hub.tglMasuk * 1000),
      "tglDaftar": new Date(hub.tglDaftar * 1000),
      "nikintern": hub.nIKIntern,
      "nikgroup": hub.nIKGroup,
      "kdGolonganPegawai": hub.kdGolonganPegawai,
      "kdPangkat": hub.kdPangkat,
      "kdKualifikasiJurusan": hub.namaPendidikan,
      "kdJabatan": hub.kdJabatan,
      "kdEselon": hub.kdEselon,
      "kdTypePegawai": hub.kdTipePegawai,
      "kdKategoryPegawai": hub.kdKategoriPegawai,
      "kdStatusPegawai": hub.kdStatusPegawai,
      "statusPegawai": hub.statusPegawai,
      "kdDepartemen": hub.kdDepartemen,
      "kdLokasi": hub.kdLokasi,
      "kdRuanganKerja": hub.kdRuanganKerja,
      "kdNegara": hub.kdNegaraAsal,
      "kdStatusPerkawinan": hub.kdStatusPerkawinan,
      "kdSuku": hub.kdSuku,
      "kdAgama": hub.kdAgama,
      "kdGolonganDarah": hub.kdGolonganDarah,
      "statusRhesus": hub.statusRhesus,
      "fingerPrintID": hub.fingerPrintID,
      "tglDaftarFingerPrint": new Date(hub.tglDaftarFingerPrint * 1000),
      "photoDiri": hub.photoDiri,
      "ambilFoto": hub.photoDiri,
      "npwp": hub.npwp,
      "kdPegawaiHead": hub.kdPegawaiHead,
      "kdPTKP": hub.kdPTKP,
      "tanggalAkhirKontrak": tanggalakhirkontrak,
      "tanggalAwalKontrak": tanggalawalkontrak,
      "kdJenisPegawai": hub.kdJenisPegawai
    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/del/' + deleteItem.kdPegawai).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  cekValidasi(index) {
    // console.log('index: ' + index);
    this.tampung_index = index;
    this.disableCheckbox = !this.disableCheckbox;
    // console.log(this.disableCheckbox);
  }

  aktifnik(event) {
    if (event == true) {
      this.form.get('nikintern').enable();
    } else {
      this.form.get('nikintern').disable();
    }
  }

  aktifGroup(event) {
    if (event == true) {
      this.form.get('nikgroup').enable();
    } else {
      this.form.get('nikgroup').disable();
    }
  }

  cekTampil(ri, isChecked: boolean) {
    this.tampungIndexStatus = ri;
    this.disableCheckbox2 = !this.disableCheckbox2;
    if (isChecked) {
      this.listPegawaiDokumen[ri].statusLifetime = true;
    } else {
      this.listPegawaiDokumen[ri].statusLifetime = false;
    }

  }


  clickReview(pathFile, i) {
    if (pathFile.search(".pdf") > 0) {
      this.dialogPreviewImage = false;
      this.smbrFile = Configuration.get().resourceFile + '/file/download/' + pathFile + '?download=false';
      this.httpService.getPreview(this.smbrFile, 'preview')
      this.dialogPreviewDokumen = true;
    } else if (pathFile.search(/.jpg/i) > 0 || pathFile.search(/.png/i) > 0 || pathFile.search(/.jpeg/i) > 0 || pathFile.search(/.jpeg/i) > 0) {
      this.dialogPreviewDokumen = false;
      this.smbrFile = Configuration.get().resourceFile + '/image/show/' + pathFile;
      this.dialogPreviewImage = true;
    } else {
      this.dialogPreviewDokumen = false;
      this.dialogPreviewImage = false;
      this.smbrFile = Configuration.get().resourceFile + '/file/download/' + pathFile;
      this.httpService.getFileDownload(this.smbrFile);
    }
  }
  close() {
    this.dialogPreviewDokumen = false;
    this.dialogPreviewImage = false;
  }

  cekNPWP() {
    let regx = /[^0-9]/;
    let str = this.form.get('npwp').value;
    str = str.replace(regx, '');
    this.form.get('npwp').setValue(str);
    if (this.form.get('npwp').value == null || this.form.get('npwp').value == "") {
      this.alertService.warn('Peringatan', 'Masukan NPWP');
    }
  }


  cekKTP(index, data) {
    let regx = /[^0-9]/;
    let str = data.target.value;
    let newD = str.replace(regx, '');
    let listPegawaiDokumen = [...this.listPegawaiDokumen]
    listPegawaiDokumen[index].noDokumen = newD
    this.listPegawaiDokumen = listPegawaiDokumen
    data.target.value = newD
    // if (this.dataNomorDokumen[index] == null || this.dataNomorDokumen[index] == ""){
    //   this.alertService.warn('Peringatan', 'Masukan No.KTP');                                      
    // }
  }
}




  // resetUnitKerja(event) {
  //   // this.unitKeja = event;
  //   // if (this.unitKeja === undefined || this.unitKeja === null || this.jabatan === undefined || this.jabatan === null) {
  //   //   this.form.get('kdPegawaiHead').disable();
  //   //   return;
  //   // }

  //   // this.form.get('kdPegawaiHead').enable();

  //   // let criteria = '';
  //   // if (this.kdPegawai !== undefined && this.kdPegawai !== null) {
  //   //   criteria = '&kdPegawai=' + this.kdPegawai
  //   // }

  //   // this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findMasterPegawaiAtasan?kdRuangan=' + this.unitKeja +'&kdJabatan='+ this.jabatan + criteria).subscribe(res => {
  //   //   this.kdPegawaiHead = [];
  //   //   this.kdPegawaiHead.push({ label: '-- Pilih --', value: null })
  //   //   for (var i = 0; i < res.data.data.length; i++) {
  //   //     this.kdPegawaiHead.push({ label: res.data.data[i].namaLengkap + ' (' + res.data.data[i].namaJabatan + ')', value: res.data.data[i].kode })
  //   //   };
  //   // });

  // }