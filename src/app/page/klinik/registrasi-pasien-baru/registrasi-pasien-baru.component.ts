import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmationService, TreeNode } from 'primeng/primeng';
import { AlertService, Configuration, RowNumberService, CalculatorAgeService } from '../../../global';
import { Router } from "@angular/router";
// import { OsService } from '../../../global/service/os.service';

@Component({
  selector: 'app-registrasi-pasien-baru',
  templateUrl: './registrasi-pasien-baru.component.html',
  styleUrls: ['./registrasi-pasien-baru.component.scss'],
  providers: [ConfirmationService]

})
export class RegistrasiPasienBaruComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup;
  formAktif: boolean;
  versi: any;
  listData: any[];
  totalRecords: any;
  page: number;
  rows: number;
  pencarianSlogan: any;
  tanggalAwal: any;
  tanggalAkhir: any;
  buttonAktif: boolean;
  listNegara: any[];
  listPropinsi: any[];
  listKotaKabupaten: any[];
  listKecamatan: any[];
  listDesaKelurahan: any[];
  listTitle: any[];
  listJenisKelamin: any[];
  listPendidikan: any[];
  listPekerjaan: any[];
  listStatusPerkawinan: any[];
  listDataKeluarga: any[];
  listHubunganKeluarga: any[];
  listJenisAlamat: any[];
  listJenisIdentitas: any[];
  listPegawai: any;
  manual: boolean;
  pegawaiProfile: boolean;
  noCmManual: any;
  kdAntrian: any;
  selectedFiles: TreeNode[];
  openDropdownKey: boolean;
  listWargaNegara: any[];
  selectedWN: any;
  kodeTelepon: any;
  rangeTahun: any;
  listJkDefault: any[];
  validMail: boolean;
  noAntrian:any;
  constructor(private fb: FormBuilder,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private rowNumberService: RowNumberService,
    private route: Router,
    private calculatorAge: CalculatorAgeService,
    // private osService: OsService,
  ) { }

  ngOnDestroy() {
    localStorage.removeItem('kdAntrianProses');
    localStorage.removeItem('nomorAntrianProses');
  }

  ngAfterViewInit() {
    var uiFieldset = document.getElementsByClassName('ui-fieldset-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiFieldset.length; i++) {
      uiFieldset[i].style.padding = '5px';
    }

    var uiPanelContent = document.getElementsByClassName('ui-panel-content ui-widget-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiPanelContent.length; i++) {
      uiPanelContent[i].style.padding = '0px';
      uiPanelContent[i].style.height = '8vh';
    }

    var uiConfirmContent = document.getElementsByClassName('ui-dialog ui-confirmdialog ui-widget ui-widget-content ui-corner-all ui-shadow ng-trigger ng-trigger-dialogState') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiConfirmContent.length; i++) {
      uiConfirmContent[i].style.left = '35vw';
      uiConfirmContent[i].style.top = '40vh';
    }

    if (this.kdAntrian == null) {
      this.confirmationService.confirm({
        message: 'Data antrian belum dipilih kembali ke Form Sebelumnya',
        header: 'Data Tidak Ditemukan',
        icon: 'fa fa-question-circle',
        accept: () => {
          this.route.navigate(['monitoring-antrian-registrasi']);
        }
      });
    } else {

      this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getPasienByKdAntrian?kdAntrian=' + this.kdAntrian).subscribe(table => {
        this.form.get('kdJenisKelamin').setValue(table.kdJenisKelamin);
        this.form.get('namaLengkap').setValue(table.namaLengkap);
        this.form.get('noIdentitas').setValue(table.noIdentitas);
        this.form.get('mobilePhone1').setValue(table.mobilePhone1);
        this.form.get('alamatLengkap').setValue(table.alamatLengkap);
        this.form.get('tempatLahir').setValue(table.tempatLahir);
        if (table.tglLahir != null && table.tglLahir != '') {
          this.form.get('tglLahir').setValue(new Date(table.tglLahir * 1000));
          this.getBulanTahunHariFromLong(new Date(table.tglLahir * 1000), 'data', 0);
        }
        let dataAlamat = {
          value: {
            kdKecamatan: table.kdKecamatan,
            kdKotaKabupaten: table.kdKotaKabupaten,
            kdNegara: table.kdNegara,
            kdPropinsi: table.kdPropinsi,
            kode: table.kdDesaKelurahan,
            kodePos: table.kodePos
          }
        }
        if (dataAlamat.value.kdNegara != null) {
          this.changeNegara(dataAlamat, 'propinsi');
          if (dataAlamat.value.kdPropinsi != null) {
            this.changePropinsi(dataAlamat, 'kotaKabupaten');
          }
          if (dataAlamat.value.kdKecamatan != null) {
            this.changeKecamatan(dataAlamat, 'desa');
          }
          if (dataAlamat.value.kdKotaKabupaten != null) {
            this.changeKotaKabupaten(dataAlamat, 'kecamatan');
            this.changeDesaKelurahan({
              value: {
                kdKotaKabupaten: table.kdKotaKabupaten,
                kdNegara: table.kdNegara,
                kdPropinsi: table.kdPropinsi,
                kode: table.kdKecamatan
              }
            }, 'grid');
            this.form.get('kdDesaKelurahan').setValue({
              "kdNegara": table.kdNegara,
              "kdPropinsi": table.kdPropinsi,
              "kdKotaKabupaten": table.kdKotaKabupaten,
              "kdKecamatan": table.kdKecamatan,
              "kode": table.kdDesaKelurahan,
              "kodePos": table.kodePos
            });
          }
        }


        this.form.get('kdJenisAlamat').setValue(table.kdJenisAlamat);
        this.form.get('rtrw').setValue(table.rTRW);
        this.form.get('kodePos').setValue(table.kodePos);
      });
    }

  }

  ngOnInit() {

    this.rangeTahun = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear())
    this.openDropdownKey = false;
    this.listWargaNegara = [];
    this.selectedWN = null;
    this.kodeTelepon = '';
    this.kdAntrian = JSON.parse(localStorage.getItem('kdAntrianProses'));
    this.noAntrian = JSON.parse(localStorage.getItem('kdAntrianProses'));

    this.formAktif = true;
    this.buttonAktif = false;
    this.pencarianSlogan = null;
    this.tanggalAwal = null;
    this.tanggalAkhir = null;

    this.listDataKeluarga = [];
    let today = new Date();
    this.noCmManual = 'kosong';
    this.form = this.fb.group({
      "alamatEmail": new FormControl(null),
      "alamatLengkap": new FormControl(null, Validators.required),
      "kdDesaKelurahan": new FormControl(null),
      "kdJenisDokumen": new FormControl(null),
      "kdJenisKelamin": new FormControl(null, Validators.required),
      "kdKecamatan": new FormControl(null),
      "kdKotaKabupaten": new FormControl(null),
      "kdNegara": new FormControl(null, Validators.required),
      "kdPekerjaan": new FormControl(null, Validators.required),
      "kdPendidikan": new FormControl(null, Validators.required),
      "kdPropinsi": new FormControl(null),
      "kdTitle": new FormControl(null, Validators.required),
      "kdJenisAlamat": new FormControl(null, Validators.required),
      "mobilePhone1": new FormControl(null),
      "namaBelakang": new FormControl(null),
      "namaDepan": new FormControl(null),
      "namaLengkap": new FormControl(null, Validators.required),
      "namaPanggilan": new FormControl(null),
      "noCM": new FormControl(null),
      "noIdentitas": new FormControl(null),
      "tempatLahir": new FormControl(null),
      "tglDaftar": new FormControl(today, Validators.required),
      "tglLahir": new FormControl(null, Validators.required),
      "kdStatusPerkawinan": new FormControl(null),
      "kdPegawaiProfile": new FormControl(null),
      "jenisIdentitas": new FormControl(null),
      "tahun": new FormControl(null),
      "bulan": new FormControl(null),
      "hari": new FormControl(null),
      "wargaNegara": new FormControl(null),
      "rtrw": new FormControl(null),
      "kodePos": new FormControl(null),
      "manual": new FormControl(null),
      "pegawaiProfile": new FormControl(null),

    });
    this.manual = true;
    this.pegawaiProfile = false;
    this.cekPegawaiProfile();
    this.changeManual();


    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

    this.getService();
    this.form.get('noCM').disable();
    this.form.get('kdPegawaiProfile').disable();

  }

  getService() {
    this.getNegara('');
    this.getPropinsi('');
    this.getKotaKabupaten('');
    this.getKecamatan('');
    this.getDesaKelurahan('');
    this.getJenisKelamin('', 'data', '');
    this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(table => {
      this.listPegawai = [];
      this.listPegawai.push({
        label: '--Pilih Pegawai Profile--', value: null
      });
      for (var i = 0; i < table.Data.length; i++) {
        this.listPegawai.push({
          label: table.Data[i].namaLengkap, value: table.Data[i].kdpegawai
        })
      };
    });

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getNegara').subscribe(table => {
      this.listWargaNegara = [];
      for (let i = 0; i < table.length; i++) {
        this.listWargaNegara[i] = {
          "label": table[i].namaExternal,
          "kdNegara": table[i].kdNegara,
          "data": null,
          "children": []
        }
        let child = [];
        for (let j = 0; j < table[i].child.length; j++) {
          child[j] = {
            "label": table[i].child[j].namaNegara,
            "kdNegara": table[i].child[j].kdNegara,
            "data": table[i].child[j].namaNegara,
            "kodeTelepon": table[i].child[j].kodeTelepon,
          }
          this.listWargaNegara[i].children.push(child[j])

        }
        // this.listWargaNegara[i].children = child
      }
    });

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getJenisIdentitas').subscribe(table => {
      this.listJenisIdentitas = [];
      // this.listJenisIdentitas = table;
      this.listJenisIdentitas.push({
        label: '--Pilih Jenis Identitas--', value: null
      });
      for (var i = 0; i < table.length; i++) {
        this.listJenisIdentitas.push({
          label: table[i].namaJenisDokumen, value: table[i].kdJenisDokumen
        })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisAlamat&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listJenisAlamat = [];
      this.listJenisAlamat.push({
        label: '--Pilih--', value: null
      });
      for (var i = 0; i < table.data.data.length; i++) {
        this.listJenisAlamat.push({
          label: table.data.data[i].namaJenisAlamat, value: table.data.data[i].id.kode
        })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=HubunganKeluarga&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listHubunganKeluarga = [];
      this.listHubunganKeluarga.push({
        label: '--Pilih Hubungan Keluarga--', value: null
      });
      for (var i = 0; i < table.data.data.length; i++) {
        this.listHubunganKeluarga.push({
          label: table.data.data[i].namaHubunganKeluarga, value: table.data.data[i].id.kode
        })
      };
    });

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getKdTitile').subscribe(table => {
      this.listTitle = [];
      this.listTitle.push({
        label: '--Pilih Title--', value: {
          "kdProfile": null,
          "kdTitle": null,
          "kdJenisKelamin": null,
        }
      });
      for (var i = 0; i < table.length; i++) {
        this.listTitle.push({
          label: table[i].namaTitle, value: {
            "kdProfile": table[i].kode.kdProfile,
            "kdTitle": table[i].kode.kode,
            "kdJenisKelamin": table[i].kdJenisKelamin,
          }
        })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pendidikan&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listPendidikan = [];
      this.listPendidikan.push({ label: '--Pilih Pendidikan Terakhir Pasien--', value: null });
      for (var i = 0; i < table.data.data.length; i++) {
        this.listPendidikan.push({ label: table.data.data[i].namaPendidikan, value: table.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pekerjaan&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
      this.listPekerjaan = [];
      this.listPekerjaan.push({ label: '--Pilih Pekerjaan Pasien--', value: null });
      for (var i = 0; i < table.data.data.length; i++) {
        this.listPekerjaan.push({ label: table.data.data[i].namaPekerjaan, value: table.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getStatusPerkawinan').subscribe(table => {
      this.listStatusPerkawinan = [];
      this.listStatusPerkawinan.push({ label: '--Pilih--', value: null });
      for (var i = 0; i < table.length; i++) {
        this.listStatusPerkawinan.push({ label: table[i].namaStatus, value: table[i].kdStatus })
      };
    });



  }

  getJenisKelamin(data, from, index) {
    if (from == 'data') {
      if (data.kdJenisKelamin != '' && data.kdJenisKelamin != null) {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=JenisKelamin&select=namaJenisKelamin,id.kode&page=1&rows=1000&criteria=id.kode&values=' + data.kdJenisKelamin + '&condition=and').subscribe(table => {
          this.listJenisKelamin = [];
          for (var i = 0; i < table.data.data.length; i++) {
            this.listJenisKelamin.push({ label: table.data.data[i].namaJenisKelamin, value: table.data.data[i].id_kode })
          };
        });
      } else {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJkFromProfile').subscribe(table => {
          this.listJenisKelamin = [];
          this.listJenisKelamin.push({ label: '--Pilih Jenis Kelamin--', value: null });
          for (var i = 0; i < table.JenisKelamin.length; i++) {
            this.listJenisKelamin.push({ label: table.JenisKelamin[i].namaJenisKelamin, value: table.JenisKelamin[i].kode.kode })
          };
        });
      }
    } else if (from == 'table') {
      if (data.kdJenisKelamin != '' && data.kdJenisKelamin != null) {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-negara?table=JenisKelamin&select=namaJenisKelamin,id.kode&page=1&rows=1000&criteria=id.kode&values=' + data.kdJenisKelamin + '&condition=and').subscribe(table => {
          this.listDataKeluarga[index].listJk = [];
          this.listDataKeluarga[index].listJk.push({ label: '--Pilih Jenis Kelamin--', value: null });
          for (var i = 0; i < table.data.data.length; i++) {
            this.listDataKeluarga[index].listJk.push({ label: table.data.data[i].namaJenisKelamin, value: table.data.data[i].id_kode })
          };
          this.listDataKeluarga[index].kdJenisKelamin = data.kdJenisKelamin;
        });
      } else {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJkFromProfile').subscribe(table => {
          this.listDataKeluarga[index].listJk = [];
          this.listDataKeluarga[index].listJk.push({ label: '--Pilih Jenis Kelamin--', value: null });
          for (var i = 0; i < table.JenisKelamin.length; i++) {
            this.listDataKeluarga[index].listJk.push({ label: table.JenisKelamin[i].namaJenisKelamin, value: table.JenisKelamin[i].kode.kode });
          };
          this.listDataKeluarga[index].kdJenisKelamin = null;
        });
      }
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/jeniskelamin/findAllJkFromProfile').subscribe(table => {
      this.listJkDefault = [];
      this.listJkDefault.push({ label: '--Pilih Jenis Kelamin--', value: null });
      for (var i = 0; i < table.JenisKelamin.length; i++) {
        this.listJkDefault.push({ label: table.JenisKelamin[i].namaJenisKelamin, value: table.JenisKelamin[i].kode.kode });
      };
    });
  }

  loadPage(event: LazyLoadEvent) {
    let tglAwal = null;
    let tglAkhir = null;
    let slogan = null;
  }

  getNegara(namaNegara) {
    let search = '';
    if (namaNegara !== '') {
      search = '&namaNegara=' + namaNegara;
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAll?page=1&rows=100&dir=namaNegara&sort=asc' + search).subscribe(table => {
      this.listNegara = [];
      this.listNegara.push({ label: '--Pilih Negara--', value: { kode: null, wn: null } });
      for (var i = 0; i < table.Negara.length; i++) {
        this.listNegara.push({ label: table.Negara[i].namaNegara, value: { kode: table.Negara[i].kode, wn: table.Negara[i].namaExternal } })
      };
    });
  }

  getPropinsi(namaPropinsi) {
    let search = ''
    if (namaPropinsi !== '') {
      search = '&namaPropinsi=' + namaPropinsi
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAll?page=1&rows=100&dir=namaPropinsi&sort=asc' + search).subscribe(table => {
      this.listPropinsi = [];
      this.listPropinsi.push({
        label: '--Pilih Propinsi--', value: {
          "kdNegara": null,
          "kode": null
        }
      });
      for (var i = 0; i < table.Propinsi.length; i++) {
        this.listPropinsi.push({
          label: table.Propinsi[i].namaPropinsi, value: {
            "kdNegara": table.Propinsi[i].kode.kdNegara,
            "kode": table.Propinsi[i].kode.kode
          }
        })
      };
    });
  }

  getKotaKabupaten(namaKotaKabupaten) {
    let search = ''
    if (namaKotaKabupaten != '') {
      search = '&namaKotaKabupaten=' + namaKotaKabupaten
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAll?page=1&rows=100&dir=namaKotaKabupaten&sort=asc' + search).subscribe(table => {
      this.listKotaKabupaten = [];
      this.listKotaKabupaten.push({
        label: '--Pilih Kota Kabupaten--', value: {
          "kdNegara": null,
          "kdPropinsi": null,
          "kode": null
        }
      });
      for (var i = 0; i < table.KotaKabupaten.length; i++) {
        this.listKotaKabupaten.push({
          label: table.KotaKabupaten[i].namaKotaKabupaten, value: {
            "kdNegara": table.KotaKabupaten[i].kode.kdNegara,
            "kdPropinsi": table.KotaKabupaten[i].kdPropinsi,
            "kode": table.KotaKabupaten[i].kode.kode
          }
        })
      };
    });
  }

  getKecamatan(namaKecamatan) {
    let search = ''
    if (namaKecamatan != '') {
      search = '&namaKecamatan=' + namaKecamatan
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?page=1&rows=100&dir=namaKecamatan&sort=asc' + search).subscribe(table => {
      this.listKecamatan = [];
      this.listKecamatan.push({
        label: '--Pilih Kecamatan--', value: {
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kode": null
        }
      });
      for (var i = 0; i < table.Kecamatan.length; i++) {
        this.listKecamatan.push({
          label: table.Kecamatan[i].namaKecamatan, value: {
            "kdNegara": table.Kecamatan[i].kode.kdNegara,
            "kdPropinsi": table.Kecamatan[i].kdPropinsi,
            "kdKotaKabupaten": table.Kecamatan[i].kdKotaKabupaten,
            "kode": table.Kecamatan[i].kode.kode
          }
        })
      };
    });
  }


  getDesaKelurahan(namaDesaKelurahan) {
    let search = ''
    if (namaDesaKelurahan != '') {
      search = '&namaDesaKelurahan=' + namaDesaKelurahan
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAll?page=1&rows=100&dir=namaDesaKelurahan&sort=asc' + search).subscribe(table => {
      this.listDesaKelurahan = [];
      this.listDesaKelurahan.push({
        label: '--Pilih Kelurahan--', value: {
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kdKecamatan": null,
          "kode": null,
          "kodePos": null
        }
      });
      for (var i = 0; i < table.DesaKelurahan.length; i++) {
        this.listDesaKelurahan.push({
          label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
            "kdNegara": table.DesaKelurahan[i].kode.kdNegara,
            "kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
            "kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
            "kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
            "kode": table.DesaKelurahan[i].kode.kode,
            "kodePos": table.DesaKelurahan[i].kodePos,
          }
        })
      };
    });
  }

  onKeyUpFilterNegara(event) {
    this.getNegara(event.target.value.kode);
  }

  onKeyUpFilterPropinsi(event) {
    this.getPropinsi(event.target.value);
  }

  onKeyUpFilterKotaKabupaten(event) {
    this.getKotaKabupaten(event.target.value);
  }

  onKeyUpFilterKecamatan(event) {
    this.getKecamatan(event.target.value);
  }

  onKeyUpFilterDesaKelurahan(event) {
    this.getDesaKelurahan(event.target.value);
  }


  changeNegara(event, from) {
    if (from == 'propinsi') {
      this.httpService.get(Configuration.get().dataMasterNew + '/negara/findByKode/' + event.value.kdNegara).subscribe(table => {
        this.listNegara = [];
        this.listNegara.push({
          label: table.Negara.namaNegara, value: { kode: table.Negara.kode, wn: table.Negara.namaExternal }
        });
        this.form.get('kdNegara').setValue({ kode: table.Negara.kode, wn: table.Negara.namaExternal });
        this.form.get('wargaNegara').setValue(table.Negara.namaExternal);
      });
    } else if (from == 'negara') {
      this.changePropinsi(event, 'negara');
      this.form.get('wargaNegara').setValue(event.wn);

    }
  }

  changePropinsi(event, from) {
    if (from == 'kotaKabupaten') {
      this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findByKode/' + event.value.kdPropinsi + '/' + event.value.kdNegara).subscribe(table => {
        this.listPropinsi = [];
        this.listPropinsi.push({
          label: table.Propinsi.namaPropinsi, value: {
            "kdNegara": table.Propinsi.kode.kdNegara,
            "kode": table.Propinsi.kode.kode
          }
        });
        this.form.get('kdPropinsi').setValue({
          "kdNegara": table.Propinsi.kode.kdNegara,
          "kode": table.Propinsi.kode.kode
        });
      });
    } else if (from == 'propinsi') {
      this.getDesaKelurahan('');
      this.getKecamatan('');
      this.changeKotaKabupaten(event, 'propinsi');
      this.changeNegara(event, 'propinsi');
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + event.value.kode).subscribe(table => {
        this.listPropinsi = [];
        this.listPropinsi.push({
          label: '--Pilih Propinsi--', value: {
            "kdNegara": null,
            "kode": null
          }
        });
        for (var i = 0; i < table.Propinsi.length; i++) {
          this.listPropinsi.push({
            label: table.Propinsi[i].namaPropinsi, value: {
              "kdNegara": table.Propinsi[i].kode.kdNegara,
              "kode": table.Propinsi[i].kode.kode
            }
          })
        };
        this.form.get('kdPropinsi').setValue({
          "kdNegara": null,
          "kode": null
        });
      });
    }
  }

  changeKotaKabupaten(event, from) {
    if (from == 'kecamatan') {
      this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findByKode/' + event.value.kdKotaKabupaten + '/' + event.value.kdNegara).subscribe(table => {
        this.listKotaKabupaten = [];
        this.listKotaKabupaten.push({
          label: table.KotaKabupaten.namaKotaKabupaten, value: {
            "kdNegara": table.KotaKabupaten.kode.kdNegara,
            "kdPropinsi": table.KotaKabupaten.kdPropinsi,
            "kode": table.KotaKabupaten.kode.kode
          }
        });
        this.form.get('kdKotaKabupaten').setValue({
          "kdNegara": table.KotaKabupaten.kode.kdNegara,
          "kdPropinsi": table.KotaKabupaten.kdPropinsi,
          "kode": table.KotaKabupaten.kode.kode
        });
      });
    } else if (from == 'kotaKabupaten') {
      this.getDesaKelurahan('');
      this.changeKecamatan(event, 'kotaKabupaten');
      this.changePropinsi(event, 'kotaKabupaten');
      this.changeNegara(event, 'propinsi');
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listKotaKabupaten = [];
        this.listKotaKabupaten.push({
          label: '--Pilih Kota Kabupaten--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kode": null
          }
        });
        for (var i = 0; i < table.KotaKabupaten.length; i++) {
          this.listKotaKabupaten.push({
            label: table.KotaKabupaten[i].namaKotaKabupaten, value: {
              "kdNegara": table.KotaKabupaten[i].kode.kdNegara,
              "kdPropinsi": table.KotaKabupaten[i].kdPropinsi,
              "kode": table.KotaKabupaten[i].kode.kode
            }
          })
        };
        this.form.get('kdKotaKabupaten').setValue({
          "kdNegara": null,
          "kdPropinsi": null,
          "kode": null
        });
      });
    }
  }

  changeKecamatan(event, from) {
    if (from == 'desa') {
      this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findByKode/' + event.value.kdKecamatan + '/' + event.value.kdNegara).subscribe(table => {
        this.listKecamatan = [];
        this.listKecamatan.push({
          label: table.Kecamatan.namaKecamatan, value: {
            "kdNegara": table.Kecamatan.kode.kdNegara,
            "kdPropinsi": table.Kecamatan.kdPropinsi,
            "kdKotaKabupaten": table.Kecamatan.kdKotaKabupaten,
            "kode": table.Kecamatan.kode.kode
          }
        });
        this.form.get('kdKecamatan').setValue({
          "kdNegara": table.Kecamatan.kode.kdNegara,
          "kdPropinsi": table.Kecamatan.kdPropinsi,
          "kdKotaKabupaten": table.Kecamatan.kdKotaKabupaten,
          "kode": table.Kecamatan.kode.kode
        });
      });
    } else if (from == 'kecamatan') {
      this.changeDesaKelurahan(event, 'kecamatan');
      this.changeKotaKabupaten(event, 'kecamatan');
      this.changePropinsi(event, 'kotaKabupaten');
      this.changeNegara(event, 'propinsi');
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAllKecamatan?kdKotaKabupaten=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listKecamatan = [];
        this.listKecamatan.push({
          label: '--Pilih Kecamatan--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kdKotaKabupaten": null,
            "kode": null
          }
        });
        for (var i = 0; i < table.Kecamatan.length; i++) {
          this.listKecamatan.push({
            label: table.Kecamatan[i].namaKecamatan, value: {
              "kdNegara": table.Kecamatan[i].kode.kdNegara,
              "kdPropinsi": table.Kecamatan[i].kdPropinsi,
              "kdKotaKabupaten": table.Kecamatan[i].kdKotaKabupaten,
              "kode": table.Kecamatan[i].kode.kode
            }
          })
        };
        this.form.get('kdKecamatan').setValue({
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kode": null
        });
      });
    }
  }

  changeDesaKelurahan(event, from) {
    if (from == 'desa') {
      this.changeKecamatan(event, 'desa');
      this.changeKotaKabupaten(event, 'kecamatan');
      this.changePropinsi(event, 'kotaKabupaten');
      this.changeNegara(event, 'propinsi');
      this.form.get('kodePos').setValue(event.value.kodePos);
    } else if (from == 'grid') {
      this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listDesaKelurahan = [];
        this.listDesaKelurahan.push({
          label: '--Pilih Kelurahan--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kdKotaKabupaten": null,
            "kdKecamatan": null,
            "kode": null,
            "kodePos": null
          }
        });
        for (var i = 0; i < table.DesaKelurahan.length; i++) {
          this.listDesaKelurahan.push({
            label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
              "kdNegara": table.DesaKelurahan[i].kode.kdNegara,
              "kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
              "kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
              "kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
              "kode": table.DesaKelurahan[i].kode.kode,
              "kodePos": table.DesaKelurahan[i].kodePos
            }
          })
        };

      });
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/desakelurahan/findAllDesaKelurahan?kdKecamatan=' + event.value.kode + '&kdNegara=' + event.value.kdNegara).subscribe(table => {
        this.listDesaKelurahan = [];
        this.listDesaKelurahan.push({
          label: '--Pilih Kelurahan--', value: {
            "kdNegara": null,
            "kdPropinsi": null,
            "kdKotaKabupaten": null,
            "kdKecamatan": null,
            "kode": null,
            "kodePos": null
          }
        });
        for (var i = 0; i < table.DesaKelurahan.length; i++) {
          this.listDesaKelurahan.push({
            label: table.DesaKelurahan[i].namaDesaKelurahan, value: {
              "kdNegara": table.DesaKelurahan[i].kode.kdNegara,
              "kdPropinsi": table.DesaKelurahan[i].kdPropinsi,
              "kdKotaKabupaten": table.DesaKelurahan[i].kdKotaKabupaten,
              "kdKecamatan": table.DesaKelurahan[i].kdKecamatan,
              "kode": table.DesaKelurahan[i].kode.kode,
              "kodePos": table.DesaKelurahan[i].kodePos
            }
          })
        };
        this.form.get('kdDesaKelurahan').setValue({
          "kdNegara": null,
          "kdPropinsi": null,
          "kdKotaKabupaten": null,
          "kdKecamatan": null,
          "kode": null,
          "kodePos": null
        });
      });
    }
  }

  getBulanTahunHariFromLong(long, from, index) {
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getUmurByTanggal?tglLahir=' + this.setTimeStamp(long)).subscribe(table => {
      if (from == 'table') {
        this.listDataKeluarga[index].umur.tahun = table.umur.years;
        this.listDataKeluarga[index].umur.bulan = table.umur.months;
        this.listDataKeluarga[index].umur.hari = table.umur.days;
      } else {
        this.form.get('tahun').setValue(table.umur.years);
        this.form.get('bulan').setValue(table.umur.months);
        this.form.get('hari').setValue(table.umur.days);
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
      this.alertService.warn("Peringatan", "Data Tidak Sesuai");
    } else {
      this.simpan();
    }
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {

      let listKeluarga = [];

      for (let i = 0; i < this.listDataKeluarga.length; i++) {
        listKeluarga.push({
          "kdHubunganKeluarga": this.listDataKeluarga[i].kdHubunganKeluarga,
          "namaLengkap": this.listDataKeluarga[i].namaLengkap,
          "kdJenisKelamin": this.listDataKeluarga[i].kdJenisKelamin,
          "kdTitle": this.listDataKeluarga[i].kdTitle.kdTitle,
          "tglLahir": this.setTimeStamp(this.listDataKeluarga[i].tglLahir)
        })

      }
      let data = {
        "alamatEmail": this.form.get('alamatEmail').value,
        "alamatLengkap": this.form.get('alamatLengkap').value,
        "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value.kode,
        "kdJenisDokumen": this.form.get('kdJenisDokumen').value,
        "kdJenisKelamin": this.form.get('kdJenisKelamin').value,
        "kdKecamatan": this.form.get('kdKecamatan').value.kode,
        "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value.kode,
        "kdNegara": this.form.get('kdNegara').value.kode,
        "kdPekerjaan": this.form.get('kdPekerjaan').value,
        "kdPendidikan": this.form.get('kdPendidikan').value,
        "kdPropinsi": this.form.get('kdPropinsi').value.kode,
        "kdStatusPerkawinan": this.form.get('kdStatusPerkawinan').value,
        "kdTitle": this.form.get('kdTitle').value.kdTitle,
        "kodePos": this.form.get('kodePos').value,
        "mobilePhone1": (this.kodeTelepon + this.form.get('mobilePhone1').value).replace(/' '/g, ''),
        "namaBelakang": this.form.get('namaBelakang').value,
        "namaDepan": this.form.get('namaDepan').value,
        "namaLengkap": this.form.get('namaLengkap').value,
        "namaPanggilan": this.form.get('namaPanggilan').value,
        "noCM": this.form.get('noCM').value,
        "noIdentitas": this.form.get('noIdentitas').value,
        "tempatLahir": this.form.get('tempatLahir').value,
        "tglDaftar": this.setTimeStamp(this.form.get('tglDaftar').value),
        "tglLahir": this.setTimeStamp(this.form.get('tglLahir').value),
        "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
        "keluargaPasien": listKeluarga,
        "rtrw": this.form.get('rtrw').value,
        "kdAntrian": this.kdAntrian,
      }

      this.httpService.post(Configuration.get().klinik1Java + '/registrasiPasienBaru/save?', data).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.form.get('noCM').setValue(response.noCM);
        this.buttonAktif = true;
      });
    }
  }

  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      this.form.get('alamatEmail').value
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }

  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
    this.manual = true;
    this.pegawaiProfile = false;
    this.cekPegawaiProfile();
    this.changeManual();

  }

  confirmUpdate() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      icon: 'fa fa-edit',
      accept: () => {
        this.update();
      }
    });
  }

  update() {
    let data = {
      "keteranganLainnya": this.form.get('keteranganLainnya').value,
      "messageToKlien": this.form.get('messageToKlien').value,
      "mottoProfile": this.form.get('mottoProfile').value,
      "noHistori": this.form.get('noHistori').value,
      "semboyanProfile": this.form.get('semboyanProfile').value,
      "sloganProfile": this.form.get('sloganProfile').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "taglineProfile": this.form.get('taglineProfile').value,
      "tglAkhir": this.setTimeStamp(this.form.get('tglAkhir').value),
      "tglAwal": this.setTimeStamp(this.form.get('tglAwal').value)
    }
    this.httpService.update(Configuration.get().dataMasterNew + '/profilehistoristms/update/', data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }


  onRowSelect(event) {
    this.formAktif = false;
    this.form.get('keteranganLainnya').setValue(event.data.keteranganLainnya);
    this.form.get('mottoProfile').setValue(event.data.mottoProfile);
    this.form.get('semboyanProfile').setValue(event.data.semboyanProfile);
    this.form.get('sloganProfile').setValue(event.data.sloganProfile);
    this.form.get('statusEnabled').setValue(event.data.statusEnabled);
    this.form.get('taglineProfile').setValue(event.data.taglineProfile);
    if (event.data.tglAkhir != null && event.data.tglAkhir != 0) {
      this.form.get('tglAkhir').setValue(new Date(event.data.tglAkhir * 1000));
    } else {
      this.form.get('tglAkhir').setValue(null);
    }

    if (event.data.tglAwal != null && event.data.tglAwal != 0) {
      this.form.get('tglAwal').setValue(new Date(event.data.tglAwal * 1000));
    } else {
      this.form.get('tglAwal').setValue(null);
    }
    this.form.get('noHistori').setValue(event.data.noHistori);
    this.form.get('messageToKlien').setValue(event.data.messageToKlien);
    this.versi = event.data.versi;
  }


  tambahKeluarga() {
    let dataTemp = {
      "kdHubunganKeluarga": null,
      "namaLengkap": null,
      "tglLahir": null,
      "kdTitle": {
        "kdProfile": null,
        "kdTitle": null,
        "kdJenisKelamin": null,
      },
      "kdJenisKelamin": null,
      "umur": {
        tahun: null,
        bulan: null,
        hari: null,
      },
      "listJk": this.listJkDefault
    }
    let listDataKeluarga = [...this.listDataKeluarga];
    listDataKeluarga.push(dataTemp);
    this.listDataKeluarga = listDataKeluarga;
  }

  // changeJenisKelaminFromTitleTable(data, index) {
  //   if (data.kdJenisKelamin != null && data.kdJenisKelamin != '') {
  //     this.getJenisKelamin(data.kdJenisKelamin);
  //     this.listDataKeluarga[index].kdJenisKelamin = data.kdJenisKelamin;
  //   } else {
  //     this.getJenisKelamin('');
  //     this.listDataKeluarga[index].kdJenisKelamin = data.kdJenisKelamin;
  //   }
  // }

  changeJenisKelaminFromTitle(event, from, dataTable) {
    if (from == 'data') {
      this.getJenisKelamin(event.value, from, dataTable);
      this.form.get('kdJenisKelamin').setValue(event.value.kdJenisKelamin);
      this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getStatusPerkawinanByKdTitle?kdTitle=' + event.value.kdTitle).subscribe(table => {
        this.listStatusPerkawinan = [];
        this.listStatusPerkawinan.push({ label: '--Pilih Status Perkawinan--', value: null });
        for (var i = 0; i < table.length; i++) {
          this.listStatusPerkawinan.push({ label: table[i].namaStatusPerkawinan, value: table[i].kdStatusPerkawinan })
        };
      });
    } else {
      this.getJenisKelamin(event, from, dataTable);
    }

  }

  hapus(row) {
    let listDataKeluarga = [...this.listDataKeluarga];
    listDataKeluarga.splice(row, 1);
    this.listDataKeluarga = listDataKeluarga;
  }

  changeManual() {
    if (this.manual) {
      this.form.get('noCM').disable();
      this.form.get('noCM').setValue(null);
    } else {
      this.form.get('noCM').enable();
    }
  }

  cekPegawaiProfile() {
    if (!this.pegawaiProfile) {
      this.form.get('kdPegawaiProfile').disable();
      this.form.get('kdPegawaiProfile').setValue(null);
    } else {
      this.form.get('kdPegawaiProfile').enable();
    }
  }

  changePegawaiProfile(data) {
    console.log(data);

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pegawai&select=*&page=1&rows=1000&criteria=id.kode&values=' + data.value + '&condition=and&profile=y').subscribe(table => {
      this.form.get('kdTitle').setValue({
        "kdProfile": table.data.data[0].id.kdProfile,
        "kdTitle": table.data.data[0].kdTitle,
        "kdJenisKelamin": table.data.data[0].kdJenisKelamin,
      });

      this.form.get('namaDepan').setValue(table.data.data[0].namaAwal);
      this.form.get('namaBelakang').setValue(table.data.data[0].namaAkhir);
      this.form.get('namaPanggilan').setValue(table.data.data[0].namaPanggilan);
      this.form.get('namaLengkap').setValue(table.data.data[0].namaLengkap);
      this.form.get('kdJenisKelamin').setValue(table.data.data[0].kdJenisKelamin);
      this.form.get('tempatLahir').setValue(table.data.data[0].tempatLahir);
      this.form.get('tglLahir').setValue(new Date(table.data.data[0].tglLahir * 1000));
      this.getBulanTahunHariFromLong(new Date(table.data.data[0].tglLahir * 1000), 'data', 0);
      this.form.get('kdStatusPerkawinan').setValue(table.data.data[0].kdStatusPerkawinan);
      this.form.get('kdPendidikan').setValue(table.data.data[0].kdPendidikanTerakhir);
    });
  }

  cekNoRmManual(event) {
    if (this.form.get('noCM').value != null && this.form.get('noCM').value != '') {
      this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/validateNoCM?noCM=' + this.form.get('noCM').value).subscribe(table => {
        if (table.isRigistered == false) {
          this.noCmManual = false;
        } else {
          this.noCmManual = true;
        }
      });
    } else {
      this.noCmManual = 'kosong';
    }
  }

  namaChange(event, from) {
    if (from == 'depan') {
      if (this.form.get('namaBelakang').value != null && this.form.get('namaBelakang').value != '') {
        this.form.get('namaLengkap').setValue(this.form.get('namaDepan').value + ' ' + this.form.get('namaBelakang').value)

      } else {
        this.form.get('namaLengkap').setValue(this.form.get('namaDepan').value)

      }
    } else {
      if (this.form.get('namaDepan').value != null && this.form.get('namaDepan').value != '') {

        this.form.get('namaLengkap').setValue(this.form.get('namaDepan').value + ' ' + this.form.get('namaBelakang').value)
      } else {
        this.form.get('namaLengkap').setValue(this.form.get('namaBelakang').value)

      }

    }
  }

  getTglLahir(index, data, from) {
    if (from == 'data') {
      let tahun = this.form.get('tahun').value;
      let bulan = this.form.get('bulan').value;
      let hari = this.form.get('hari').value;
      if (tahun == null || tahun == '') {
        tahun = 0;
        this.form.get('tahun').setValue(tahun);
      }
      if (bulan == null || bulan == '') {
        bulan = 0;
        this.form.get('bulan').setValue(bulan);
      }
      if (hari == null || hari == '') {
        hari = 0;
        this.form.get('hari').setValue(hari);
      }

      let date = this.calculatorAge.getDateByAge(tahun, bulan, hari);
      this.form.get('tglLahir').setValue(date);
    } else {
      console.log(index, data, from);

      // let date = new Date();
      let tahun = this.listDataKeluarga[index].umur.tahun;
      let bulan = this.listDataKeluarga[index].umur.bulan;
      let hari = this.listDataKeluarga[index].umur.hari;
      if (tahun == null || tahun == '') {
        tahun = 0;
        this.listDataKeluarga[index].umur.tahun = tahun;
      }
      if (bulan == null || bulan == '') {
        bulan = 0;
        this.listDataKeluarga[index].umur.bulan = bulan;
      }
      if (hari == null || hari == '') {
        hari = 0;
        this.listDataKeluarga[index].umur.hari = hari;
      }
      // date.setFullYear(date.getFullYear() - parseInt(tahun));
      // if (date.getFullYear() % 4 == 0) {
      //   date.setMonth(date.getMonth() - parseInt(bulan) + 1);
      //   date.setDate(date.getDate() - parseInt(hari) - 1);

      // } else {
      //   date.setMonth(date.getMonth() - parseInt(bulan));
      //   date.setDate(date.getDate() - parseInt(hari));

      // }
      let date = this.calculatorAge.getDateByAge(tahun, bulan, hari);
      this.listDataKeluarga[index].tglLahir = date;
    }
  }

  periodeOpen() {
    document.getElementById("periodePencarian").style.display = "block";
    document.getElementById("periodePencarianOpen").style.display = "none";
    document.getElementById("periodePencarianClose").style.display = "block";

  }

  periodeClose() {
    document.getElementById("periodePencarian").style.display = "none";
    document.getElementById("periodePencarianOpen").style.display = "block";
    document.getElementById("periodePencarianClose").style.display = "none";

  }

  nodeSelect(event) {
    if (event.node.parent != undefined) {
      this.selectedWN = event.node.parent.label + ' (' + event.node.data + ')';
      if (event.node.kodeTelepon) {
        this.kodeTelepon = event.node.kodeTelepon;
      } else {
        this.kodeTelepon = '';
      }
    } else {
      this.selectedWN = event.node.label;
      this.kodeTelepon = '';
    }
    document.getElementById("dropdownTree").style.display = "none";
    this.openDropdownKey = false;
    // console.log(event)
  }

  nodeUnselect(event) {
    console.log(event)
  }

  openDropdown() {
    if (this.openDropdownKey) {
      document.getElementById("dropdownTree").style.display = "none";
      this.openDropdownKey = false;
    } else {
      document.getElementById("dropdownTree").style.display = "block";
      this.openDropdownKey = true;
    }
    console.log('event')
  }

  cetak() {
    // this.osService.getHostname('http://localhost:3000/getHostName').subscribe(table => {
    //   console.log('testHostName');
    // });

  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateMail() {
    var email = this.form.get('alamatEmail').value;

    if (this.validateEmail(email)) {
      console.log('true');
      this.validMail = true;
    } else {
      this.validMail = false;
      console.log('false');
    }
    return false;
  }

  keRegistrasiPelayanan(){
    let dataObject = {
      'noCM' : this.form.get('noCM').value,
      'kdAntrian': this.kdAntrian,
      'noAntrian': this.noAntrian
    }
    localStorage.setItem('dataPelayananProses', JSON.stringify(dataObject));
    this.route.navigate(['registrasi-pelayanan']);
  }

}
