import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmationService, TreeNode } from 'primeng/primeng';
import { AlertService, Configuration, RowNumberService, CalculatorAgeService } from '../../../global';
import { Router } from "@angular/router";
//import moment = require('moment');
import * as moment from 'moment';
@Component({
  selector: 'app-registrasi-pelayanan',
  templateUrl: './registrasi-pelayanan.component.html',
  styleUrls: ['./registrasi-pelayanan.component.scss'],
  providers: [ConfirmationService]

})
export class RegistrasiPelayananComponent implements OnInit, AfterViewInit, OnDestroy {
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
  noAntrian:any;
  dataPelayanan:any;
  noCMPelayanan:any;
  listRuangPelayanan:any[];
  listDokter:any[];
  listAsalRujukan:any[];
  listKelompokPasien:any[];
  statusDitempat:boolean;
  hasilCek: boolean = true;
  popUpCek: boolean = false;
  tglDft:any;
  buttonEdit:boolean;
  disCek:boolean;
  penandaSimpanTampung:boolean;
  listJamRuangan:any[];
  listJamDokter:any[];
  aktifJamRuangan:any;
  aktifJamDokter:any;
  selectedJamRuangan:any;
  selectedJamDokter:any;
  jadwalRuanganAda: any[];
  jadwalDokterAda: any[];
  ruanganIs:any;
  dropNonAktif:boolean;
  dropNonAktifRuangan:boolean;
  constructor(private fb: FormBuilder,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private rowNumberService: RowNumberService,
    private route: Router,
    private calculatorAge: CalculatorAgeService,
  ) { }

  ngOnDestroy() {
    localStorage.removeItem('dataPelayananProses');
    this.statusDitempat = false;
    //this.noAntrian = '';
  }

  ngAfterViewInit() {
    this.statusDitempat = false;
    if (this.dataPelayanan == null) {
      this.confirmationService.confirm({
        message: 'Data antrian belum dipilih kembali ke Form Sebelumnya',
        header: 'Data Tidak Ditemukan',
        icon: 'fa fa-question-circle',
        accept: () => {
          this.route.navigate(['monitoring-antrian-registrasi']);
        }
      });
    } else {

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findByNoCM?noCM=' + this.noCMPelayanan).subscribe(table => {
      this.form.get('noCM').setValue(table.noCM);
      if (table.tglLahir != null && table.tglLahir != '') {
        //this.form.get('tglLahir').setValue(new Date(table.tglLahir * 1000));
        this.getBulanTahunHariFromLong(new Date(table.tglLahir * 1000), 'data', 0);
      }
      this.form.get('namaPendidikan').setValue(table.namaPendidikan);
      this.form.get('namaPekerjaan').setValue(table.namaPekerjaan);
      this.form.get('namaLengkap').setValue(table.namaLengkap);
      this.form.get('tglDaftarPelayanan').setValue(new Date(table.tglDaftar*1000));

      //slice kabupaten 
      let kabupatenStr = table.namaKotaKabupaten;
      // kabupatenStr = kabupatenStr.toLowerCase();
      let strLeng = kabupatenStr.length;
      kabupatenStr = kabupatenStr.slice(4,strLeng);

      let alamatGabung = table.alamatLengkap+' RT'+table.rTRW+', Desa/Kel '+table.namaDesaKelurahan+', Kec.'+table.namaKecamatan+', Kota/Kabupaten '+kabupatenStr+', '+table.namaPropinsi+', '+table.kodePos;
      this.form.get('alamatLengkap').setValue(alamatGabung);
      this.form.get('jenisKelamin').setValue(table.kodeExternalJenisKelamin);
      

      // let dataAlamat = {
      //   value: {
      //     kdKecamatan: table.kdKecamatan,
      //     kdKotaKabupaten: table.kdKotaKabupaten,
      //     kdNegara: table.kdNegara,
      //     kdPropinsi: table.kdPropinsi,
      //     kode: table.kdDesaKelurahan,
      //     kodePos: table.kodePos
      //   }
      // }
      // if (dataAlamat.value.kdNegara != null) {
      //   this.changeNegara(dataAlamat, 'propinsi');
      //   if (dataAlamat.value.kdPropinsi != null) {
      //     this.changePropinsi(dataAlamat, 'kotaKabupaten');
      //   }
      //   if (dataAlamat.value.kdKecamatan != null) {
      //     this.changeKecamatan(dataAlamat, 'desa');
      //   }
      //   if (dataAlamat.value.kdKotaKabupaten != null) {
      //     this.changeKotaKabupaten(dataAlamat, 'kecamatan');
      //     this.changeDesaKelurahan({
      //       value: {
      //         kdKotaKabupaten: table.kdKotaKabupaten,
      //         kdNegara: table.kdNegara,
      //         kdPropinsi: table.kdPropinsi,
      //         kode: table.kdKecamatan
      //       }
      //     }, 'grid');
      //     this.form.get('kdDesaKelurahan').setValue({
      //       "kdNegara": table.kdNegara,
      //       "kdPropinsi": table.kdPropinsi,
      //       "kdKotaKabupaten": table.kdKotaKabupaten,
      //       "kdKecamatan": table.kdKecamatan,
      //       "kode": table.kdDesaKelurahan,
      //       "kodePos": table.kodePos
      //     });
      //   }
      // }


      // this.form.get('kdJenisAlamat').setValue(table.kdJenisAlamat);
      // this.form.get('rtrw').setValue(table.rTRW);
      // this.form.get('kodePos').setValue(table.kodePos);


    });


    
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getPasienByKdAntrian?kdAntrian=' +this.kdAntrian).subscribe(res => {
          //set dropdown ruangan
          this.form.get('kdRuangPelayanan').setValue(res.kdRuanganTujuan);

          this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findDokterByKdRuangan?kdRuangan=' +res.kdRuanganTujuan+ '&tanggal=' + res.tglPelayananAwal).subscribe(data => {
              this.listDokter = [];
              this.listDokter.push({ label: '--Pilih--', value: null })
              for (var i = 0; i < data.length; i++) {
                this.listDokter.push({ label: data[i].namaLengkap, value: data[i].kdPegawai })
              };
            }, error => {
              this.listDokter = [];
              this.listDokter.push({ label: '-- ' + error + ' --', value: '' })
        });

        this.form.get('kdDokter').setValue(res.kdDokterOrder);
        this.form.get('kdKelompokPasien').setValue(res.kdKelompokKlien);
        //this.ruanganIs = res.isAntrianByRuangan;
        if(res.isAntrianByRuangan != null){
          if(res.isAntrianByRuangan == true){
            //res.jadwal.listJadwal;
            let dataJam = [];
            this.listJamRuangan = [];
            for (var z = 0; z < res.jadwal.listJadwal.length; z++) {
              let jamLong = res.jadwal.listJadwal[z].jamAwal;
              let jamA = jamLong * 1000;
              let jamFinal = moment(jamA).format('HH:mm');
                dataJam.push(
                  {
                    label: jamFinal,
                    value: {
                      jmAwal:res.jadwal.listJadwal[z].jamAwal,
                      jmAkhir:res.jadwal.listJadwal[z].jamAkhir,
                      noAntrian:res.jadwal.listJadwal[z].noAntrian
                    }
                  }
                );
                }
                this.listJamRuangan = dataJam;
                this.ruanganIs = true;
                this.dropNonAktif = true;
                this.dropNonAktifRuangan = false;
          }else{
            let dataJam = [];
            this.listJamDokter = [];
            for (var z = 0; z < res.jadwal.listJadwal.length; z++) {
              let jamLong = res.jadwal.listJadwal[z].jamAwal;
              let jamA = jamLong * 1000;
              let jamFinal = moment(jamA).format('HH:mm');
                dataJam.push(
                  {
                    label: jamFinal,
                    value: {
                      jmAwal:res.jadwal.listJadwal[z].jamAwal,
                      jmAkhir:res.jadwal.listJadwal[z].jamAkhir,
                      noAntrian:res.jadwal.listJadwal[z].noAntrian
                    }
                  }
                );
                }
                this.listJamDokter = dataJam;
                this.ruanganIs = false;
                this.dropNonAktif = false;
                this.dropNonAktifRuangan = true;
          }
        }

    });

    
    

  }

  }

  ngOnInit() {
    this.dropNonAktif = false;
    this.dropNonAktifRuangan = false;
    this.statusDitempat = false;
    this.rangeTahun = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear())
    this.openDropdownKey = false;
    this.listWargaNegara = [];
    this.selectedWN = null;
    this.kodeTelepon = '';
    this.dataPelayanan = JSON.parse(localStorage.getItem('dataPelayananProses'));
    if(this.dataPelayanan != null){
      this.kdAntrian = this.dataPelayanan.kdAntrian;
      this.noAntrian = this.dataPelayanan.noAntrian;
      this.noCMPelayanan = this.dataPelayanan.noCM;
    }
    
    this.formAktif = true;
    this.buttonAktif = false;
    this.buttonEdit = true;
    this.disCek = false;
    this.pencarianSlogan = null;
    this.tanggalAwal = null;
    this.tanggalAkhir = null;

    this.listDataKeluarga = [];
    let today = new Date();
    //this.tglDft 
    this.noCmManual = 'kosong';
    this.form = this.fb.group({
      "alamatEmail": new FormControl(null),
      "alamatLengkap": new FormControl(null),
      "kdDesaKelurahan": new FormControl(null),
      "kdJenisDokumen": new FormControl(null),
      "kdJenisKelamin": new FormControl(null),
      //, Validators.required
      "kdKecamatan": new FormControl(null),
      "kdKotaKabupaten": new FormControl(null),
      "kdNegara": new FormControl(null),
      //, Validators.required)
      "kdPekerjaan": new FormControl(null),
      "kdPendidikan": new FormControl(null),
      "kdPropinsi": new FormControl(null),
      "kdTitle": new FormControl(null),
      // Validators.required
      "kdJenisAlamat": new FormControl(null),
      //, Validators.required
      "mobilePhone1": new FormControl(null),
      "namaBelakang": new FormControl(null),
      "namaDepan": new FormControl(null),
      "namaLengkap": new FormControl(null),
      //, Validators.required
      "namaPanggilan": new FormControl(null),
      "noCM": new FormControl(null),
      "noIdentitas": new FormControl(null),
      "tempatLahir": new FormControl(null),
      //"tglDaftar": new FormControl(today),
      "tglLahir": new FormControl(null),
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
      "tglDaftarPelayanan": new FormControl(today),
      "namaPendidikan": new FormControl(null),
      "namaPekerjaan": new FormControl(null),
      "kdRuangPelayanan": new FormControl(null, Validators.required),
      "kdDokter": new FormControl(null),
      "kdAsalRujukan": new FormControl(null, Validators.required),
      "kdKelompokPasien": new FormControl(null, Validators.required),
      "pasienDilayani": new FormControl(0),
      "alamatLengkapDiTempat": new FormControl(null),
      "jenisKelamin": new FormControl(null),
      "jamRuangan": new FormControl(null),
      "jamDokter": new FormControl(null)

      

    });

    this.tglDft = this.form.get('tglDaftarPelayanan').value;
    this.manual = true;
    this.pegawaiProfile = false;


    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

    this.getService();
    this.form.get('noCM').disable();
    this.form.get('kdPegawaiProfile').disable();
    this.form.get('tahun').disable();
    this.form.get('bulan').disable();
    this.form.get('hari').disable();
    this.form.get('namaPendidikan').disable();
    this.form.get('namaPekerjaan').disable();
    this.form.get('namaLengkap').disable();
    this.form.get('tglDaftarPelayanan').disable();
    this.form.get('alamatLengkap').disable();
    this.form.get('jenisKelamin').disable();
    
    
    

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

  getService() {

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/getRuanganByKdDepartemenRawatJalan?tanggal='+this.setTimeStamp(this.tglDft)).subscribe(res => {
			this.listRuangPelayanan = [];
			this.listRuangPelayanan.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listRuangPelayanan.push({ label: res[i].namaRuangan, value: res[i].kdRuangan })
			};
		}, error => {
			this.listRuangPelayanan = [];
			this.listRuangPelayanan.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findAsalRujukan').subscribe(res => {
			this.listAsalRujukan = [];
			this.listAsalRujukan.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listAsalRujukan.push({ label: res[i].namaAsal, value: res[i].kode.kode })
			};
		}, error => {
			this.listAsalRujukan = [];
			this.listAsalRujukan.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findKdJenisKelompokPenjaminPasien').subscribe(res => {
			this.listKelompokPasien = [];
			this.listKelompokPasien.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listKelompokPasien.push({ label: res[i].namaKelompokKlien, value: res[i].kode.kode })
			};
		}, error => {
			this.listKelompokPasien = [];
			this.listKelompokPasien.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.getNegara('');
    this.getPropinsi('');
    this.getKotaKabupaten('');
    this.getKecamatan('');
    this.getDesaKelurahan('');

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
    
    
  }

  getDokter(event){
    this.selectedJamRuangan = [];
    this.form.get('kdDokter').setValue(null);
    let isRuangan;
    let kdRuanganPelayanan = event.value;
    let tglDaftar = this.setTimeStamp(this.tglDft);
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findDokterByKdRuangan?kdRuangan=' +kdRuanganPelayanan+ '&tanggal=' +tglDaftar).subscribe(res => {
			this.listDokter = [];
			this.listDokter.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listDokter.push({ label: res[i].namaLengkap, value: res[i].kdPegawai })
			};
		}, error => {
			this.listDokter = [];
			this.listDokter.push({ label: '-- ' + error + ' --', value: '' })
    });

    //ambil dulu data buat pembanding
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/getRuanganByKdDepartemenRawatJalan?tanggal='+tglDaftar).subscribe(res => {
			for (var i = 0; i < res.length; i++) {
				if(res[i].kdRuangan == kdRuanganPelayanan){
          let dataJam = [];
          this.listJamRuangan = [];
          for (var z = 0; z < res[i].jadwal.listJadwal.length; z++) {
            isRuangan = res[i].isAntrianByRuangan;
            this.ruanganIs = res[i].isAntrianByRuangan;
            let jamLong = res[i].jadwal.listJadwal[z].jamAwal;
            let jamA = jamLong * 1000;
            let jamFinal = moment(jamA).format('HH:mm');
              dataJam.push(
                {
                  label: jamFinal,
                  value: {
                    jmAwal:res[i].jadwal.listJadwal[z].jamAwal,
                    jmAkhir:res[i].jadwal.listJadwal[z].jamAkhir,
                    noAntrian:res[i].jadwal.listJadwal[z].noAntrian
                  }
                }
              );
              }
              this.listJamRuangan = dataJam;
        }
      }
      if(isRuangan == undefined){
        isRuangan = false;
      }
      
      if(isRuangan == true){
        this.listJamDokter = [];
        this.dropNonAktif = true;
        this.dropNonAktifRuangan = false;
      }else if(isRuangan == false){
        this.listJamRuangan = []
        this.dropNonAktif = false;
        this.dropNonAktifRuangan = true;
      }


    });


  }

  getJamDokter(event){
    this.selectedJamDokter = [];
    let kdDok = event.value;
    let tglDaftar = this.setTimeStamp(this.tglDft)
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiRawatJalan/findDokterByKdRuangan?kdRuangan=' +this.form.get('kdRuangPelayanan').value+ '&tanggal=' +tglDaftar).subscribe(res => {
			for (var i = 0; i < res.length; i++) {
        if(res[i].kdPegawai == kdDok){
          let dataJam = [];
          this.listJamDokter = [];
          for (var z = 0; z < res[i].jadwal.listJadwal.length; z++) {
            let jamLong = res[i].jadwal.listJadwal[z].jamAwal;
            let jamA = jamLong * 1000;
            let jamFinal = moment(jamA).format('HH:mm');
              dataJam.push(
                {
                  label: jamFinal,
                  value: {
                    jmAwal:res[i].jadwal.listJadwal[z].jamAwal,
                    jmAkhir:res[i].jadwal.listJadwal[z].jamAkhir,
                    noAntrian:res[i].jadwal.listJadwal[z].noAntrian
                  }
                }
              );
              }
              this.listJamDokter = dataJam;
        }
      };

      if(this.ruanganIs == true){
        this.listJamDokter = [];
      }else if(this.ruanganIs == false){
        this.listJamRuangan = [];
      }
      
    
    });

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
    let dataSimpan;
    if (this.formAktif == false) {
      this.confirmUpdate();
    }else if(this.selectedJamDokter == undefined && this.selectedJamRuangan == undefined && (this.listJamRuangan == undefined && this.listJamDokter == undefined )){
      this.alertService.warn('Perhatian','Jadwal Sudah Habis, Harap Pilih Tanggal Lain');
    }else{
      let booleanCheck = this.form.get('pasienDilayani').value;
        if(booleanCheck == true){
          booleanCheck = 1;
        }else if(booleanCheck == false){
          booleanCheck = 0;
        }

      let tempKdDesKel = this.form.get('kdDesaKelurahan').value;
      if(tempKdDesKel == null){
        tempKdDesKel = null;
      }else{
        tempKdDesKel = this.form.get('kdDesaKelurahan').value.kode; 
      }

      let tempKdKec = this.form.get('kdKecamatan').value;
      if(tempKdKec == null){
        tempKdKec = null;
      }else{
        tempKdKec = this.form.get('kdKecamatan').value.kode; 
      }

      let tempKdKotaKab = this.form.get('kdKotaKabupaten').value;
      if(tempKdKotaKab == null){
        tempKdKotaKab = null;
      }else{
        tempKdKotaKab = this.form.get('kdKotaKabupaten').value.kode; 
      }

      let tempKdNeg = this.form.get('kdNegara').value;
      if(tempKdNeg == null){
        tempKdNeg = null;
      }else{
        tempKdNeg = this.form.get('kdNegara').value.kode; 
      }

      let tempKdProp = this.form.get('kdPropinsi').value;
      if(tempKdProp == null){
        tempKdProp = null;
      }else{
        tempKdProp = this.form.get('kdPropinsi').value.kode; 
      }

      let tglAkhir;
      let tglAwal;
      let noAntrian;

      //untuk ruangan set simpan
      if(this.listJamRuangan != undefined ){
        if(this.selectedJamRuangan == undefined){
          if(this.listJamDokter != undefined){
            if(this.listJamDokter.length == 0 ){
              tglAkhir = this.listJamRuangan[0].value.jmAkhir;
              tglAwal = this.listJamRuangan[0].value.jmAwal;
              noAntrian = this.listJamRuangan[0].value.noAntrian;
            }
          }else{
              tglAkhir = this.listJamRuangan[0].value.jmAkhir;
              tglAwal = this.listJamRuangan[0].value.jmAwal;
              noAntrian = this.listJamRuangan[0].value.noAntrian;
          }

        }else{

          console.log(this.listJamRuangan)
          if(this.listJamRuangan.length != 0){
            tglAkhir = this.listJamRuangan[0].value.jmAkhir;
            tglAwal = this.listJamRuangan[0].value.jmAwal;
            noAntrian = this.listJamRuangan[0].value.noAntrian;
          }
          
        }
      }

      if(this.listJamDokter != undefined){
        //console.log(this.selectedJamDokter)
        if(this.selectedJamDokter == undefined){
          if(this.listJamRuangan != undefined){
            if(this.listJamRuangan.length == 0){
              tglAkhir = this.listJamDokter[0].value.jmAkhir;
              tglAwal = this.listJamDokter[0].value.jmAwal;
              noAntrian = this.listJamDokter[0].value.noAntrian;
            }
          }else{
              tglAkhir = this.listJamDokter[0].value.jmAkhir;
              tglAwal = this.listJamDokter[0].value.jmAwal;
              noAntrian = this.listJamDokter[0].value.noAntrian;
          }
          
        }else{
          if(this.listJamDokter.length != 0){
            tglAkhir = this.listJamDokter[0].value.jmAkhir;
            tglAwal = this.listJamDokter[0].value.jmAwal;
            noAntrian = this.listJamDokter[0].value.noAntrian;
          }
          
        }
        
      } 

      

       dataSimpan = {
          "alamatLengkap": this.form.get('alamatLengkap').value,
          "isOnSiteService": booleanCheck,
          "kdAsalRujukan": this.form.get('kdAsalRujukan').value,
          "kdDesaKelurahan": tempKdDesKel,
          "kdDokter": this.form.get('kdDokter').value,
          "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
          "kdJenisKelompokPenjaminPasien": this.form.get('kdKelompokPasien').value,
          "kdKecamatan": tempKdKec,
          "kdKotaKabupaten": tempKdKotaKab,
          "kdNegara": tempKdNeg,
          "kdPropinsi": tempKdProp,
          "kdRuangan": this.form.get('kdRuangPelayanan').value,
          "kodePos": this.form.get('kodePos').value,
          "noCM": this.form.get('noCM').value,
          "rtrw": this.form.get('rtrw').value,
          "tglRegistrasi": this.setTimeStamp(this.tglDft),
          "kdAntrian": this.kdAntrian,
          "tglPerkiraanPelayananAkhir": tglAkhir,
          "tglPerkiraanPelayananAwal": tglAwal,
          "noAntrian": noAntrian
        }

          console.log(dataSimpan);
         
      this.httpService.post(Configuration.get().klinik1Java + '/registrasiRawatJalan/save?', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.disCek = true;
        this.buttonEdit = true;
        this.buttonAktif = true;
        //this.form.get('noCM').setValue(response.noCM);
        //this.statusDitempat = false;
        //this.popUpCek = false;
        //this.resetPopUp();
      
      });

    } 
    // else if(this.statusDitempat == true ){
    //   //kesini kalo di ceklist pasien dilayaninya
    //   if(this.form.get('kdJenisAlamat').value == null || this.form.get('alamatLengkap').value == null || this.form.get('kdNegara').value == null ){
    //     this.alertService.warn('Perhatian', 'Harap Isi Jenis Alamat, Alamat atau Negara Terlebih Dahulu');
    //   }else{
    //     let booleanCheck2 = this.form.get('pasienDilayani').value;
    //     if(booleanCheck2 == true){
    //       booleanCheck2 = 1;
    //     }else if(booleanCheck2 == false){
    //       booleanCheck2 = 0;
    //     }
    //     dataSimpan = {
    //       "alamatLengkap": this.form.get('alamatLengkap').value,
    //       "isOnSiteService": booleanCheck2,
    //       "kdAsalRujukan": this.form.get('kdAsalRujukan').value,
    //       "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value.kode,
    //       "kdDokter": this.form.get('kdDokter').value,
    //       "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
    //       "kdJenisKelompokPenjaminPasien": this.form.get('kdKelompokPasien').value,
    //       "kdKecamatan": this.form.get('kdKecamatan').value.kode,
    //       "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value.kode,
    //       "kdNegara": this.form.get('kdNegara').value.kode,
    //       //"kdPendidikan": this.form.get('kdPendidikan').value,
    //       "kdPropinsi": this.form.get('kdPropinsi').value.kode,
    //       "kdRuangan": this.form.get('kdRuangPelayanan').value,
    //       "kodePos": this.form.get('kodePos').value,
    //       "noCM": this.form.get('noCM').value,
    //       "rtrw": this.form.get('rtrw').value,
    //       //"tglRegistrasi": this.setTimeStamp(this.form.get('tglDaftar').value)
    //       "tglRegistrasi": this.setTimeStamp(this.tglDft),
    //       "kdAntrian": this.kdAntrian
    //     }




    //     console.log(dataSimpan);
    //   this.httpService.post(Configuration.get().klinik1Java + '/registrasiRawatJalan/save?', dataSimpan).subscribe(response => {
    //     this.alertService.success('Berhasil', 'Data Disimpan');
    //     //this.form.get('noCM').setValue(response.noCM);
    //     this.buttonAktif = true;
    //     this.statusDitempat = false;
    //     //this.popUpCek = false;
    //     this.resetPopUp();
    //   });


    //   }

    //   //kesini kalo pasien dilayani tidak diceklist artinya alamat dll tidak di isi
    // }else {
    //   let penandaKosong = false;
    //   let booleanCheck = this.form.get('pasienDilayani').value;
    //   if(booleanCheck == true){
    //     booleanCheck = 1;
    //   }else if(booleanCheck == false){
    //     booleanCheck = 0;
    //   }
    //   let tempKdDesKel = this.form.get('kdDesaKelurahan').value;
    //   if(tempKdDesKel == null){
    //     tempKdDesKel = null;
    //     penandaKosong = true;
    //   }else{
    //     tempKdDesKel = this.form.get('kdDesaKelurahan').value.kode; 
    //   }

    //   let tempKdKec = this.form.get('kdKecamatan').value;
    //   if(tempKdKec == null){
    //     tempKdKec = null;
    //     penandaKosong = true;
    //   }else{
    //     tempKdKec = this.form.get('kdKecamatan').value.kode; 
    //   }

    //   let tempKdKotaKab = this.form.get('kdKotaKabupaten').value;
    //   if(tempKdKotaKab == null){
    //     tempKdKotaKab = null;
    //     penandaKosong = true;
    //   }else{
    //     tempKdKotaKab = this.form.get('kdKotaKabupaten').value.kode; 
    //   }

    //   let tempKdNeg = this.form.get('kdNegara').value;
    //   if(tempKdNeg == null){
    //     tempKdNeg = null;
    //     penandaKosong = true;
    //   }else{
    //     tempKdNeg = this.form.get('kdNegara').value.kode; 
    //   }

    //   let tempKdProp = this.form.get('kdPropinsi').value;
    //   if(tempKdProp == null){
    //     tempKdProp = null;
    //     penandaKosong = true;
    //   }else{
    //     tempKdProp = this.form.get('kdPropinsi').value.kode; 
    //   }


      
    //   // if(penandaKosong == true){

    //     dataSimpan = {
    //       "alamatLengkap": this.form.get('alamatLengkap').value,
    //       "isOnSiteService": booleanCheck,
    //       "kdAsalRujukan": this.form.get('kdAsalRujukan').value,
    //       "kdDesaKelurahan": tempKdDesKel,
    //       "kdDokter": this.form.get('kdDokter').value,
    //       "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
    //       "kdJenisKelompokPenjaminPasien": this.form.get('kdKelompokPasien').value,
    //       "kdKecamatan": tempKdKec,
    //       "kdKotaKabupaten": tempKdKotaKab,
    //       "kdNegara": tempKdNeg,
    //       //"kdPendidikan": this.form.get('kdPendidikan').value,
    //       "kdPropinsi": tempKdProp,
    //       "kdRuangan": this.form.get('kdRuangPelayanan').value,
    //       "kodePos": this.form.get('kodePos').value,
    //       "noCM": this.form.get('noCM').value,
    //       "rtrw": this.form.get('rtrw').value,
    //       "tglRegistrasi": this.setTimeStamp(this.tglDft),
    //       "kdAntrian": this.kdAntrian
    //     }
    //   // }else{

    //     // dataSimpan = {
    //     //   "alamatLengkap": this.form.get('alamatLengkap').value,
    //     //   "isOnSiteService": booleanCheck,
    //     //   "kdAsalRujukan": this.form.get('kdAsalRujukan').value,
    //     //   "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value.kode,
    //     //   "kdDokter": this.form.get('kdDokter').value,
    //     //   "kdJenisAlamat": this.form.get('kdJenisAlamat').value,
    //     //   "kdJenisKelompokPenjaminPasien": this.form.get('kdKelompokPasien').value,
    //     //   "kdKecamatan": this.form.get('kdKecamatan').value.kode,
    //     //   "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value.kode,
    //     //   "kdNegara": this.form.get('kdNegara').value.kode,
    //     //   //"kdPendidikan": this.form.get('kdPendidikan').value,
    //     //   "kdPropinsi": this.form.get('kdPropinsi').value.kode,
    //     //   "kdRuangan": this.form.get('kdRuangPelayanan').value,
    //     //   "kodePos": this.form.get('kodePos').value,
    //     //   "noCM": this.form.get('noCM').value,
    //     //   "rtrw": this.form.get('rtrw').value,
    //     //   "tglRegistrasi": this.setTimeStamp(this.form.get('tglDaftar').value)
    //     // }
    //  // }
      
      
    //   console.log(dataSimpan);
    //   this.httpService.post(Configuration.get().klinik1Java + '/registrasiRawatJalan/save?', dataSimpan).subscribe(response => {
    //     this.alertService.success('Berhasil', 'Data Disimpan');
    //     //this.form.get('noCM').setValue(response.noCM);
    //     this.buttonAktif = true;
    //     this.statusDitempat = false;
    //   });

    // }

    
  }

  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }

  }

  reset() {
    this.ngOnInit();

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
    
  }

  onRowSelect(event) {
   
  }

  getBulanTahunHariFromLong(long, from, index) {
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getUmurByTanggal?tglLahir=' + this.setTimeStamp(long)).subscribe(table => {
      // if (from == 'table') {
      //   this.listDataKeluarga[index].umur.tahun = table.umur.years;
      //   this.listDataKeluarga[index].umur.bulan = table.umur.months;
      //   this.listDataKeluarga[index].umur.hari = table.umur.days;
      // } else {
        this.form.get('tahun').setValue(table.umur.years);
        this.form.get('bulan').setValue(table.umur.months);
        this.form.get('hari').setValue(table.umur.days);
     // }
    });
  }

  openCek(status){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai");
      this.form.get('pasienDilayani').setValue(false);
    } 
    else {
      
      this.statusDitempat = status;
      if(status == true){
        this.hasilCek = false;
        this.popUpCek = true;
      }else{
        this.hasilCek = true;
        this.popUpCek = false;
        this.getNegara('');
        this.getPropinsi('');
        this.getKotaKabupaten('');
        this.getKecamatan('');
        this.getDesaKelurahan('');
        this.form.get('kdJenisAlamat').setValue(null);
        this.form.get('alamatLengkapDiTempat').setValue('');
        this.form.get('rtrw').setValue('');
        this.form.get('kdNegara').setValue(null);
        this.form.get('kdPropinsi').setValue(null);
        this.form.get('kdKotaKabupaten').setValue(null);
        this.form.get('kdKecamatan').setValue(null);
        this.form.get('kdDesaKelurahan').setValue(null);
        this.form.get('kodePos').setValue('');
        this.buttonEdit = true;
      }
    }
    
  }


  showEdit(){
    console.log('aktif');
    if(this.statusDitempat == true){
      this.popUpCek = true;
    }
  }

  simpanTampung(){
    // if(!this.form.invalid) {
    //   this.validateAllFormFields(this.form);
    //   this.alertService.warn('Perhatian','Harap Isi Data Yang Wajib Diisi');
    if(this.form.get('kdJenisAlamat').value == null || this.form.get('alamatLengkap').value == null || this.form.get('kdNegara').value == null ){
      this.alertService.warn('Perhatian', 'Harap Isi Jenis Alamat, Alamat atau Negara Terlebih Dahulu');
    }else{
      this.alertService.success('Perhatian', 'Data Dilayani Di Rumah/Kantor akan Di simpan');
      this.popUpCek = false;
      this.buttonEdit = false;
      this.form.get('pasienDilayani').setValue(true);
      this.penandaSimpanTampung = true;
    }
    
  }

  resetPopUp(){
      this.getNegara('');
      this.getPropinsi('');
      this.getKotaKabupaten('');
      this.getKecamatan('');
      this.getDesaKelurahan('');
    this.form.get('kdJenisAlamat').setValue(null);
    this.form.get('alamatLengkapDiTempat').setValue('');
    this.form.get('rtrw').setValue('');
    this.form.get('kdNegara').setValue(null);
    this.form.get('kdPropinsi').setValue(null);
    this.form.get('kdKotaKabupaten').setValue(null);
    this.form.get('kdKecamatan').setValue(null);
    this.form.get('kdDesaKelurahan').setValue(null);
    this.form.get('kodePos').setValue('');

    this.form.get('pasienDilayani').setValue(false);
    this.statusDitempat = false;
    this.buttonEdit = true;
    this.popUpCek = false;
    
  }

  tutupPopUp(){
    if(!this.penandaSimpanTampung){
      this.resetPopUp();
    }
    

    // this.form.get('kdJenisAlamat').setValue(null);
    // this.form.get('alamatLengkapDiTempat').setValue('');
    // this.form.get('rtrw').setValue('');
    // this.form.get('kdNegara').setValue(null);
    // this.form.get('kdPropinsi').setValue(null);
    // this.form.get('kdKotaKabupaten').setValue(null);
    // this.form.get('kdKecamatan').setValue(null);
    // this.form.get('kdDesaKelurahan').setValue(null);
    // this.form.get('kodePos').setValue('');
    // this.form.get('pasienDilayani').setValue(false);
    // this.popUpCek = false;
  }

  clearDropdown(datenilai){
    console.log(datenilai)
    this.form.get('kdRuangPelayanan').setValue(null);
    this.listDokter = [];
    this.form.get('kdDokter').setValue('');
  }

  

  

  
 
}
