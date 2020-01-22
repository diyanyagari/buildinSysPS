import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '../../../global/service/HttpClient';
import { ConfirmationService, TreeNode } from 'primeng/primeng';
import { AlertService, Configuration, RowNumberService, CalculatorAgeService, AuthGuard } from '../../../global';
import { Router } from "@angular/router";
//import moment = require('moment');
import * as moment from 'moment';

@Component({
  selector: 'app-masuk-ruangan',
  templateUrl: './masuk-ruangan.component.html',
  styleUrls: ['./masuk-ruangan.component.scss'],
  providers: [ConfirmationService]
})
export class MasukRuanganComponent implements OnInit, AfterViewInit, OnDestroy {
  tglDft:any;
  rangeTahun: any;
  form: FormGroup;
  buttonAktif: boolean;
  listKasusPenyakit:any[];
  listDokter:any[];
  totalRecords: any;
  page: number;
  rows: number;
  dataPelayananMasuk:any;
  kdAntrian:any;
  noAntrian:any;
  noCMPelayanan:any;
  listPenjamin:any[];
  listKelasPelayanan:any[];
  kdAsalRujukanVar:any;
  kdKelompokKlienVar:any;
  kdRuanganTujuanVar:any;
  kdRuanganVar:any;
  dropdownOnOffPenyakit:boolean;
  kdKasusPenyakit:any;
  dropdownOnOffPelayanan:boolean;
  kdPelayanan:any;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private authGuard: AuthGuard,
  ) { }

  ngOnDestroy(){
    localStorage.removeItem('dataPelayananMasuk');
  }

  ngAfterViewInit(){
    if (this.dataPelayananMasuk == null) {
      this.confirmationService.confirm({
        message: 'Data antrian belum dipilih kembali ke Form Sebelumnya',
        header: 'Data Tidak Ditemukan',
        icon: 'fa fa-question-circle',
        accept: () => {
          this.route.navigate(['monitoring-pasien-diperiksa']);
        }
      });
    } else{
      this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findByNoCM?noCM=' + this.noCMPelayanan).subscribe(table => {
        this.form.get('noCM').setValue(table.noCM);
        if (table.tglLahir != null && table.tglLahir != '') {
          this.getBulanTahunHariFromLong(new Date(table.tglLahir * 1000), 'data', 0);
        }
        this.form.get('namaPendidikan').setValue(table.namaPendidikan);
        this.form.get('namaPekerjaan').setValue(table.namaPekerjaan);
        this.form.get('namaLengkap').setValue(table.namaLengkap);
        this.form.get('tglDaftarPelayanan').setValue(new Date(table.tglDaftar*1000));
  
        //slice kabupaten 
        
        let kabupatenStr;
        if(table.namaKotaKabupaten != null){
          kabupatenStr = table.namaKotaKabupaten;
          let strLeng = kabupatenStr.length;
          kabupatenStr = kabupatenStr.slice(4,strLeng);
        }else{
          kabupatenStr = table.namaKotaKabupaten;
        }
        
  
        let alamatGabung = table.alamatLengkap+' RT'+table.rTRW+', Desa/Kel '+table.namaDesaKelurahan+', Kec.'+table.namaKecamatan+', Kota/Kabupaten '+kabupatenStr+', '+table.namaPropinsi+', '+table.kodePos;
        this.form.get('alamatLengkap').setValue(alamatGabung);
        this.form.get('jenisKelamin').setValue(table.kodeExternalJenisKelamin);

        this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findAntrianregistrasiPelayananByKdAntrian?kdAntrian=' + this.kdAntrian).subscribe(resdata => {
          this.form.get('ruangPelayanan').setValue(resdata.namaRuanganTujuan);
          this.form.get('asalRujukan').setValue(resdata.namaAsalRujukan);
          this.form.get('kelompokPasien').setValue(resdata.namaKelompokKlien);

          this.form.get('kdDokter').setValue(resdata.kdDokterOrder);
          
          if(this.listKasusPenyakit.length > 2 ){
            this.form.get('kdKasusPenyakit').setValue(resdata.kdKasusPenyakit);
          }
          if(this.listKelasPelayanan.length > 2 ){
            this.form.get('kelasPelayanan').setValue(resdata.kdKelas);
          }
         

          //buat var 
          this.kdAsalRujukanVar = resdata.kdAsalRujukan;
          this.kdKelompokKlienVar = resdata.kdKelompokKlien;
          this.kdRuanganTujuanVar = resdata.kdRuanganTujuan;
        });
      });


    }
  }

  ngOnInit() {
    this.dataPelayananMasuk = JSON.parse(localStorage.getItem('dataPelayananMasuk'));
    if(this.dataPelayananMasuk != null){
      this.kdAntrian = this.dataPelayananMasuk.kdAntrian;
      this.noAntrian = this.dataPelayananMasuk.noAntrian;
      this.noCMPelayanan = this.dataPelayananMasuk.noCM;
      this.kdRuanganVar = this.dataPelayananMasuk.kdRuanganTujuan;
    }
    this.buttonAktif = false;
    let today = new Date();
    this.tglDft = today;
    this.rangeTahun = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear());
    this.form = this.fb.group({
      "noCM": new FormControl(null),
      "namaLengkap": new FormControl(null),
      "tahun": new FormControl(null),
      "bulan": new FormControl(null),
      "hari": new FormControl(null),
      "jenisKelamin": new FormControl(null),
      "namaPendidikan": new FormControl(null),
      "namaPekerjaan": new FormControl(null),
      "tglDaftarPelayanan": new FormControl(today),
      "alamatLengkap": new FormControl(null),
      "alamatEmail": new FormControl(null),
      "ruangPelayanan": new FormControl(null),
      "asalRujukan": new FormControl(null),
      "kdKasusPenyakit": new FormControl(null, Validators.required),
      "kelasPelayanan": new FormControl(null, Validators.required),
      "kelompokPasien": new FormControl(null),
      "kdDokter": new FormControl(null, Validators.required),
      "kdPenjamin": new FormControl(null),


      // "kdJenisKelamin": new FormControl(null),
      // "kdKecamatan": new FormControl(null),
      // "kdKotaKabupaten": new FormControl(null),
      // "kdNegara": new FormControl(null),
      // "kdPekerjaan": new FormControl(null),
      // "kdPendidikan": new FormControl(null),
      // "kdPropinsi": new FormControl(null),
      // "kdTitle": new FormControl(null),
      // "kdJenisAlamat": new FormControl(null),
      // "mobilePhone1": new FormControl(null),
      // "namaBelakang": new FormControl(null),
      // "namaDepan": new FormControl(null),
      // "namaPanggilan": new FormControl(null),
      // "noIdentitas": new FormControl(null),
      // "tempatLahir": new FormControl(null),
      // "tglLahir": new FormControl(null),
      // "kdStatusPerkawinan": new FormControl(null),
      // "kdPegawaiProfile": new FormControl(null),
      // "jenisIdentitas": new FormControl(null),
      // "wargaNegara": new FormControl(null),
      // "rtrw": new FormControl(null),
      // "kodePos": new FormControl(null),
      // "manual": new FormControl(null),
      // "pegawaiProfile": new FormControl(null),
      // "kdDokter": new FormControl(null),
      // "kdAsalRujukan": new FormControl(null, Validators.required),
      // "kdKelompokPasien": new FormControl(null, Validators.required),
      // "pasienDilayani": new FormControl(0),
      // "alamatLengkapDiTempat": new FormControl(null),
      // "jamRuangan": new FormControl(null),
      // "jamDokter": new FormControl(null)

    });


    this.getServiceData();
    this.form.get('noCM').disable();
    this.form.get('namaLengkap').disable();
    this.form.get('tahun').disable();
    this.form.get('bulan').disable();
    this.form.get('hari').disable();
    this.form.get('jenisKelamin').disable();
    this.form.get('namaPendidikan').disable();
    this.form.get('namaPekerjaan').disable();
    this.form.get('kelompokPasien').disable();
    this.form.get('tglDaftarPelayanan').disable();
    this.form.get('alamatLengkap').disable();
    this.form.get('ruangPelayanan').disable();
    this.form.get('asalRujukan').disable();
    this.form.get('kelompokPasien').disable();

    
  }

  getServiceData(){
    // let today = new Date();
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findKasusPenyakitByKdRuangan?kdRuangan='+ this.kdRuanganVar ).subscribe(res => {
      //cek kalo isiinya satu 
      if(res.length == 1){
        this.dropdownOnOffPenyakit = true;
        this.form.get('kdKasusPenyakit').disable();
        this.form.get('kdKasusPenyakit').setValue(res[0].namaKasusPenyakit);
        this.kdKasusPenyakit = res[0].kode.kdKasusPenyakit;
      }else{
        this.dropdownOnOffPenyakit = false;
      }
      this.listKasusPenyakit = [];
			this.listKasusPenyakit.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listKasusPenyakit.push({ label: res[i].namaKasusPenyakit, value: res[i].kode.kdKasusPenyakit })
			};
		}, error => {
			this.listKasusPenyakit = [];
			this.listKasusPenyakit.push({ label: '-- ' + error + ' --', value: '' })
    });

    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findDokterByKdRuangan?kdRuangan='+ this.kdRuanganVar +'&tanggal='+ this.setTimeStamp(this.tglDft)).subscribe(res => {
			this.listDokter = [];
			this.listDokter.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listDokter.push({ label: res[i].namaLengkap, value: res[i].kdPegawai })
			};
		}, error => {
			this.listDokter = [];
			this.listDokter.push({ label: '-- ' + error + ' --', value: '' })
    });

     this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findPenjaminByNoCM?noCM='+this.noCMPelayanan).subscribe(res => {
			this.listPenjamin = [];
			this.listPenjamin.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.data.length; i++) {
				this.listPenjamin.push({ label: res.data[i].kontakRekananPenjamin.namaLengkap, value: res.data[i].kontakRekananPenjamin.id.noKontak })
			};
		}, error => {
			this.listPenjamin = [];
			this.listPenjamin.push({ label: '-- ' + error + ' --', value: '' })
    });

     this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findKelasByKdRuangan?kdRuangan='+ this.kdRuanganVar ).subscribe(res => {
      //cek kalo isiinya satu 
      if(res.length == 1){
        this.dropdownOnOffPelayanan = true;
        this.form.get('kelasPelayanan').disable();
        this.form.get('kelasPelayanan').setValue(res[0].namaKelas);
        this.kdPelayanan = res[0].kdKelas;
      }else{
        this.dropdownOnOffPelayanan = false;
      }
      this.listKelasPelayanan = [];
			this.listKelasPelayanan.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listKelasPelayanan.push({ label: res[i].namaKelas, value: res[i].kdKelas })
			};
		}, error => {
			this.listKelasPelayanan = [];
			this.listKelasPelayanan.push({ label: '-- ' + error + ' --', value: '' })
    });
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

  onSubmit(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai");
    } else {
      this.simpan();
    }
  }

  simpan(){
    let dataSimpan;
    let kdKelas;
    let kdPenyakit;

    if(this.kdKasusPenyakit == undefined){
      kdPenyakit = this.form.get('kdKasusPenyakit').value;
    }else{
      kdPenyakit = this.kdKasusPenyakit;
    }

    if(this.kdPelayanan == undefined){
      kdKelas = this.form.get('kelasPelayanan').value;
    }else{
      kdKelas = this.kdPelayanan;
    }

    dataSimpan = 
      {
        "kdAntrian": this.kdAntrian,
        "kdAsalRujukan": this.kdAsalRujukanVar,
        "kdDokter": this.form.get('kdDokter').value,
        "kdKasusPenyakit": kdPenyakit,
        "kdKelas": kdKelas,
        "kdKelompokKlien": this.kdKelompokKlienVar,
        "kdRuangan": this.kdRuanganTujuanVar,
        "noCMKontak": this.form.get('noCM').value,
        "noKontakRekananPenjamin": this.form.get('kdPenjamin').value,
        "tglMasuk": this.setTimeStamp(this.tglDft)
      }
      this.httpService.post(Configuration.get().klinik1Java + '/masukRuangan/save?', dataSimpan).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.buttonAktif = true;
      });
    
  }

  lanjutkan(){

  }

  getBulanTahunHariFromLong(long, from, index) {
    this.httpService.get(Configuration.get().klinik1Java + '/registrasiPasienBaru/getUmurByTanggal?tglLahir=' + this.setTimeStamp(long)).subscribe(table => {

        this.form.get('tahun').setValue(table.umur.years);
        this.form.get('bulan').setValue(table.umur.months);
        this.form.get('hari').setValue(table.umur.days);

    });
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

  getDokter(tgl){
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/findDokterByKdRuangan?kdRuangan='+ this.kdRuanganVar +'&tanggal='+ this.setTimeStamp(tgl)).subscribe(res => {
			this.listDokter = [];
			this.listDokter.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.length; i++) {
				this.listDokter.push({ label: res[i].namaLengkap, value: res[i].kdPegawai })
			};
		}, error => {
			this.listDokter = [];
			this.listDokter.push({ label: '-- ' + error + ' --', value: '' })
    });
  }



}
