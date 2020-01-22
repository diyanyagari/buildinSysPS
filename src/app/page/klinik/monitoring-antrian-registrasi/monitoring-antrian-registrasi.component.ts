import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';
import { DropdownModule, SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, UserDto, Authentication, AuthGuard, SettingsService, AlertService, InfoService, Configuration, ReportService, SettingInfo, NotificationService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/timeout'
import { TimeoutError } from 'rxjs';

import { ChangeDetectorRef } from '@angular/core';
import { isNull } from 'util';
@Injectable()
@Component({
  selector: 'app-monitoring-antrian-registrasi',
  templateUrl: './monitoring-antrian-registrasi.component.html',
  styleUrls: ['./monitoring-antrian-registrasi.component.scss']
})
export class MonitoringAntrianRegistrasiComponent implements AfterViewInit, OnInit, OnDestroy {
  listMonitoring: any[];
  totalRecords: any;

  page: number;
  rows: number;
  pencarian: string;
  filter: string;
  sortBy: any;
  typeSort: any;
  sortF: any;
  sortO: any;
  namaPasienFilter: any;
  noCMFilter: any;
  noAntrianFilter: any;
  kelompokPasienFilter: any[];
  statusAntrianFilter: any[];
  statusPasienFilter: any[];
  namaDokterFilter: any[];
  namaRuanganTujuanFilter: any[];
  jenisKelaminFilter: any[];
  alamatLengkapFilter: any;
  noUrutFilter: any;
  tglLahirFilter: any;
  listKelompokPasien: any[];
  listStatusAntrian: any[];
  listRuanganTujuan: any[];
  listStatusPasien: any[];
  listDokter: any[];
  listJenisKelamin: any[];
  batalDialog: boolean;
  formBatal: FormGroup;
  formAktifAntrian: FormGroup;
  gambarLogoProfile: any;
  statusAntrianFilterMulti: any;
  kelompokPasienFilterMulti: any;
  namaRuanganTujuanFilterMulti: any;
  jenisKelaminFilterMulti: any;
  statusPasienFilterMulti: any;
  namaDokterFilterMulti: any;
  antrianNext: any;
  antrianSekarang: any;
  tanggalAwal: any;
  public tanggalAkhir: any;
  statusViewerAktif: any;
  widthScreen: any;
  statusLoket: boolean;
  statusLoketPing: any;
  buttonAktif: boolean;
  kdAntrianNow: any;
  kdAntrianNowSendiri: any;
  rule: any;
  contPanggilUlang: any;
  contPanggilUlangMenit: any;
  buttonAktifPanggilUlang: boolean;
  contPanggilUlangMenitCek: boolean;
  timer: any;
  antrianAktifDialog: boolean;
  buttonAktifPanggilRow: boolean;
  kdStatusDefault: any[];
  kdDepartemen: any;
  kdRuanganLogin: any;
  kdProfile:any;
  statusOnlineViewer:any;
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authentication: Authentication,
    private authGuard: AuthGuard,
    private alert: AlertService,
    private info: InfoService,
    private httpService: HttpClient,

    private fb: FormBuilder,

    private alertService: AlertService,

    private changeDetectorRef: ChangeDetectorRef,
    private rowNumberService: RowNumberService,
    private routes: Router,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    // setInterval(() => {
    //   this.tanggalAkhir = new Date();
    // }, 1);
    this.widthScreen = screen.width - 790 - 131 + 'px';

  }

  ngAfterViewInit() {

    //disini gitu interval status aktifnya pakai dari backend nilainya
    //this.statusViewerAktif = ;
    //this.statusLoket = this.statusOnlineViewer;

    let uiGrowl = document.getElementsByClassName('ui-growl ui-widget') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiGrowl.length; i++) {
      uiGrowl[i].style.marginTop = '-40px';
    }
    let labelMultiSelect = document.getElementsByClassName('ui-multiselect-label ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < labelMultiSelect.length; i++) {
      labelMultiSelect[i].innerHTML = 'Cari';
      labelMultiSelect[i].innerText = 'Cari';
    }

    let titleMultiSelect = document.getElementsByClassName('ui-multiselect-label-container') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < titleMultiSelect.length; i++) {
      titleMultiSelect[i].title = 'Pilih';
      titleMultiSelect[i].title = 'Pilih';
    }

    var refactorInpusSwitch = document.getElementsByClassName('ui-inputswitch ui-widget ui-widget-content ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorInpusSwitch.length; i++) {
      refactorInpusSwitch[i].style.cssFloat = 'right';
    }


  }
  ngOnDestroy() {
    let uiGrowl = document.getElementsByClassName('ui-growl ui-widget') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiGrowl.length; i++) {
      uiGrowl[i].style.marginTop = '0px';
    }
    this.socket.emit('klinik.monitoring.status.loket.' + this.kdProfile, {
      kdRuangan: this.kdRuanganLogin,
      status: false,
      unik:0
    });

    //if(this.statusLoket == false){
      this.socket.dis();
      this.clear();
    //}
  }

  identitas = 0;

  ngOnInit() {

    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = 50;
    }

    this.identitas = new Date().getTime();

    this.kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
    this.kdProfile = this.authGuard.getUserDto().kdProfile;
    this.kdRuanganLogin = this.authGuard.getUserDto().kdRuangan;
    this.kdStatusDefault = [];
    this.contPanggilUlang = 1;
    this.contPanggilUlangMenit = null;
    this.contPanggilUlangMenitCek = false;
    //this.statusViewerAktif = false;
    this.statusLoket = false;
    this.buttonAktif = true;
    this.buttonAktifPanggilUlang = true;
    this.buttonAktifPanggilRow = false;

   // this.cekStatusLoket();
    this.cekLoadLoket();
    this.antrianNext = {
      "kdAntrian": null,
      "noUrutPanggilan": null
    };
    this.antrianSekarang = {
      "noUrutPanggilanNow": null,
      "noUrutPanggilanNext": null,
      "kdAntrianNow": null,
      "noAntrianNow": null,
      "kdAntrianNext": null,
      "noAntrianNext": null
    }
    this.batalDialog = false;
    this.antrianAktifDialog = false;
    this.listMonitoring = [];
    this.namaPasienFilter = '';
    this.noCMFilter = '';
    this.noAntrianFilter = '';
    this.kelompokPasienFilter = [];
    this.statusAntrianFilter = [];
    this.statusPasienFilter = [];
    this.namaDokterFilter = [];
    this.namaRuanganTujuanFilter = [];
    this.jenisKelaminFilter = [];
    this.alamatLengkapFilter = "";
    this.tglLahirFilter = "";
    this.pencarian = '';
    this.filter = '';
    this.sortBy = 'noUrutPanggilan';
    this.typeSort = 'asc';
    this.statusAntrianFilterMulti = "";
    this.kelompokPasienFilterMulti = "";
    this.namaRuanganTujuanFilterMulti = "";
    this.namaDokterFilterMulti = "";
    this.statusPasienFilterMulti = "";
    this.jenisKelaminFilterMulti = "";
    this.sortF = "";
    this.sortO = "";
    this.tanggalAwal = new Date();
    this.tanggalAkhir = new Date();
    this.tanggalAwal.setHours(0, 0, 0, 0);
    // this.tanggalAkhir.setHours(23, 59, 0, 0);
    let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
    let tanggalAwal = this.setTimeStamp(this.tanggalAwal);

    this.formBatal = this.fb.group({
      'kdAntrian': new FormControl('', Validators.required),
      'noUrut': new FormControl(''),
      'keterangan': new FormControl(''),
    });

    this.formAktifAntrian = this.fb.group({
      'kdAntrianNow': new FormControl('', Validators.required),
      'kdAntrianChanged': new FormControl('', Validators.required),
      'noAntrian': new FormControl(''),
      'noAntrianNext': new FormControl(''),
      'noAntrianNow': new FormControl(''),
      'noUrut': new FormControl(''),
      'qtyPanggilan': new FormControl('', Validators.required),
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.gambarLogoProfile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });

    this.getService(tanggalAwal, tanggalAkhir);
    //this.socket.emit('kdDepartemen', this.authGuard.getUserDto().kdDepartemen);
    this.socket.emit('kdProfile', this.authGuard.getUserDto().kdProfile);
    this.socket.emit('klinik.monitoring.antrian.registrasi.batal.server.'+this.authGuard.getUserDto().kdProfile, '');

    this.socket.on('klinik.monitoring.antrian.registrasi.batal.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketBatalService, this);
    this.socket.on('klinik.viewer.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketPanggilNext, this);


    //yang ini dapet dari emit viewer antrian ke monitoring untuk koneksi
    //yang ini ganti dari yang mas adi aja
    // this.socket.on('klinik.monitor.ping.'+this.authGuard.getUserDto().kdProfile, this.responSocketPingViewer, this);
    //dari get backend nantinya

    


    //ini kayanya dapet dari emit kiosk form
    this.socket.on('klinik.kiosk.antrian.registrasi.save.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketInputKiosK, this);

    //ini untuk selesainya registrasi pasien baru setelah diproses
    this.socket.on('klinik.monitoring.antrian.registrasi.selesai.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketSelesaiService, this);
  }

  getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any) {
    if (search == null || search == '' || search.indexOf('&kdStatus[]') == -1) {
      for (let i = 0; i < this.kdStatusDefault.length; i++) {
        search += "&kdStatus[]=" + this.kdStatusDefault[i];

      }
    }
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findAntrianRegistrasiMasuk?page=' + page + '&rows=' + rows + '&dir=' + sortBy + '&sort=' + typeSort + search + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir).subscribe(table => {
      this.listMonitoring = [];
      this.statusOnlineViewer = table.statusOnline;
      let list = [];
      for (let i = 0; i < table.antrianRegistrasiMasukList.length; i++) {
        if (table.antrianRegistrasiMasukList[i].noRetur == '-') {
          let potongAlamat;
          let alamatStr = table.antrianRegistrasiMasukList[i].alamatLengkap;
          let alamatJum = table.antrianRegistrasiMasukList[i].alamatLengkap;
          alamatJum = alamatJum.length;
          if(alamatJum > 86){
            potongAlamat = alamatStr.substring(0,86);
            potongAlamat = potongAlamat + '...';
          }else{
            potongAlamat = table.antrianRegistrasiMasukList[i].alamatLengkap;
          }

          let tglLahir = table.antrianRegistrasiMasukList[i].tglLahir;
          if( isNull(tglLahir) == true){
            tglLahir = '-';
          }else{
            tglLahir = table.antrianRegistrasiMasukList[i].tglLahir;
          }
          list[i] = {
            kdAntrian: table.antrianRegistrasiMasukList[i].kdAntrian,
            namaDokter: table.antrianRegistrasiMasukList[i].namaDokter,
            namaKelompokKlien: table.antrianRegistrasiMasukList[i].namaKelompokKlien,
            namaPasien: table.antrianRegistrasiMasukList[i].namaPasien,
            namaRuanganTujuan: table.antrianRegistrasiMasukList[i].namaRuanganTujuan,
            noAntrian: table.antrianRegistrasiMasukList[i].noAntrian,
            noCM: table.antrianRegistrasiMasukList[i].noCM,
            noRetur: table.antrianRegistrasiMasukList[i].noRetur,
            statusPasien: table.antrianRegistrasiMasukList[i].statusPasien,
            statusAntrian: table.antrianRegistrasiMasukList[i].statusAntrian,
            alamatLengkap: potongAlamat,
            tooltipAlamat: table.antrianRegistrasiMasukList[i].alamatLengkap,
            kodeExternalJenisKelamin: table.antrianRegistrasiMasukList[i].kodeExternalJenisKelamin,
            tglLahir: tglLahir,
            noUrutPanggilan: table.antrianRegistrasiMasukList[i].noUrutPanggilan,
            tglPelayananAwal: table.antrianRegistrasiMasukList[i].tglPelayananAwal,
            noUrutPanggilanSort: parseInt(table.antrianRegistrasiMasukList[i].kdAntrian + '' + table.antrianRegistrasiMasukList[i].noUrutPanggilan),
            style: ""
          }
        } else {
          let potongAlamat;
          let alamatStr = table.antrianRegistrasiMasukList[i].alamatLengkap;
          let alamatJum = table.antrianRegistrasiMasukList[i].alamatLengkap;
          alamatJum = alamatJum.length;
          if(alamatJum > 86){
            potongAlamat = alamatStr.substring(0,86);
            potongAlamat = potongAlamat + '...';
          }else{
            potongAlamat = table.antrianRegistrasiMasukList[i].alamatLengkap;
          }

          let tglLahir = table.antrianRegistrasiMasukList[i].tglLahir;
          if( isNull(tglLahir) == true){
            tglLahir = '-';
          }else{
            tglLahir = table.antrianRegistrasiMasukList[i].tglLahir;
          }
          list[i] = {
            kdAntrian: table.antrianRegistrasiMasukList[i].kdAntrian,
            namaDokter: table.antrianRegistrasiMasukList[i].namaDokter,
            namaKelompokKlien: table.antrianRegistrasiMasukList[i].namaKelompokKlien,
            namaPasien: table.antrianRegistrasiMasukList[i].namaPasien,
            namaRuanganTujuan: table.antrianRegistrasiMasukList[i].namaRuanganTujuan,
            noAntrian: table.antrianRegistrasiMasukList[i].noAntrian,
            noCM: table.antrianRegistrasiMasukList[i].noCM,
            noRetur: table.antrianRegistrasiMasukList[i].noRetur,
            statusPasien: table.antrianRegistrasiMasukList[i].statusPasien,
            statusAntrian: table.antrianRegistrasiMasukList[i].statusAntrian,
            alamatLengkap: potongAlamat,
            tooltipAlamat: table.antrianRegistrasiMasukList[i].alamatLengkap,
            kodeExternalJenisKelamin: table.antrianRegistrasiMasukList[i].kodeExternalJenisKelamin,
            tglLahir: tglLahir,
            noUrutPanggilan: table.antrianRegistrasiMasukList[i].noUrutPanggilan,
            tglPelayananAwal: table.antrianRegistrasiMasukList[i].tglPelayananAwal,
            noUrutPanggilanSort: parseInt(table.antrianRegistrasiMasukList[i].kdAntrian + '' + table.antrianRegistrasiMasukList[i].noUrutPanggilan),
            style: "'background':'darkgrey'",
          }
        }

      }
      this.alertService.success('Berhasil', 'Data Berhasil Ditampilkan');
      this.totalRecords = table.totalRow;
      this.listMonitoring = this.rowNumberService.addRowNumber(page, rows, list);

    });
    this.httpService.post(Configuration.get().klinik1Java + '/viewerController/getNomorPanggilanMin?', {
      "tglAkhir": this.setTimeStamp(this.tanggalAkhir),
      "tglAwal": this.setTimeStamp(this.tanggalAwal)
    }).subscribe(response => {
      this.antrianNext = response;
      this.antrianSekarang.noAntrianNow = response.noUrutPanggilanNowPrefix;
      this.antrianSekarang.kdAntrianNow = response.kdAntrianNow;
      this.antrianSekarang.noUrutPanggilanNow = response.noUrutPanggilanNow;
    });
    //this.buttonAktifPanggilRow = true;

  }
  loadPage(event: LazyLoadEvent) {
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findKdStatusAntrianDefault').toPromise().
      then(response => {
        this.kdStatusDefault = response.kdStatusAntrian;
        return true;
      }).then(response => {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
        return true;
      }).catch(res => {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
      });
  }
  getService(tglAwal, tglAkhir) {
    //jenisPasien
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findKdKelompokKlien').subscribe(table => {
      this.listKelompokPasien = [];
      for (var i = 0; i < table.kdStatusAntrian.length; i++) {
        this.listKelompokPasien.push({ label: table.kdStatusAntrian[i].namaKelompokKlien, value: table.kdStatusAntrian[i] })
      };
    });

    //statusAntrian
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/getStatusAntrianByTglAwalTglAkhir?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listStatusAntrian = [];
      for (var i = 0; i < table.status.length; i++) {
        this.listStatusAntrian.push({ label: table.status[i].status, value: table.status[i] })
      };
    });

    //ruanganTujuan
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/getRuanganTujuanByTglAwalTglAkhir?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listRuanganTujuan = [];
      for (var i = 0; i < table.status.length; i++) {
        this.listRuanganTujuan.push({ label: table.status[i].namaRuanganTujuan, value: table.status[i] })
      };
    });

    //dokter
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/getDokterByTglAwalTglAkhir?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listDokter = [];
      for (var i = 0; i < table.status.length; i++) {
        this.listDokter.push({ label: table.status[i].namaLengkap, value: table.status[i] })
      };
    });

    //statusPasien
    this.listStatusPasien = [];
    this.listStatusPasien.push({ label: 'Baru', value: { id: 1, status: 'Baru' } });
    this.listStatusPasien.push({ label: 'Lama', value: { id: 2, status: 'Lama' } });

    //JenisKelamin
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=JenisKelamin&select=namaJenisKelamin,id.kode').subscribe(res => {
      this.listJenisKelamin = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i] })
      };
    });

  
    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getStrukturNomorByKdKelompokTransaksi').subscribe(table => {
      this.rule = table.data;
        //ruleAntrian ini di block dulu
    //   if (this.statusLoket) {
    //     if (this.rule.isPanggilanByPass == 1) {
    //       this.buttonAktifPanggilRow = true;
    //     }
    //}
    });

    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findKdStatusAntrianDefault').subscribe(table => {
      this.kdStatusDefault = table.kdStatusAntrian;
    });


  }

  //buat dapetin data yang batal /dibatalin di antrian dari socket juga
  responSocketBatalService(ob: MonitoringAntrianRegistrasiComponent, data: any) {
    console.log('Batal : ' + data);
    if (data !== '') {
      let index = ob.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrian);
      if (index != -1) {
        ob.listMonitoring[index].statusAntrian = data.namaStatus;
        ob.listMonitoring[index].noRetur = data.noRetur;
        ob.listMonitoring[index].style = "'background':'darkgrey'";
      }
      ob.tanggalAkhir = new Date();

      let batal = [];
      let proses = [];
      for (let i = 0; i < ob.listMonitoring.length; i++) {
        if (ob.listMonitoring[i].statusAntrian == 'Batal') {
          batal.push(ob.listMonitoring[i]);
        } else {
          proses.push(ob.listMonitoring[i]);
        }
      }
      ob.listMonitoring = [];
      for (let j = 0; j < proses.length; j++) {
        ob.listMonitoring.push(proses[j]);
      }
      for (let j = 0; j < batal.length; j++) {
        ob.listMonitoring.push(batal[j]);
      }
      ob.getSelected;
    }

  }

  responSocketSelesaiService(ob: MonitoringAntrianRegistrasiComponent, data: any){

    console.log('Proses Done : ' + data);
    if (data !== '') {
      let index = ob.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrian);
      if (index != -1) {
        let listMonitoring = [...ob.listMonitoring];
      // listMonitoring.push(list);
     
        listMonitoring.splice(index,1);
        ob.listMonitoring = listMonitoring;
        // ob.listMonitoring[index].statusAntrian = data.namaStatus;
        // ob.listMonitoring[index].noRetur = data.noRetur;
        // ob.listMonitoring[index].style = "'background':'darkgrey'";
      }
      // ob.tanggalAkhir = new Date();

      // let batal = [];
      // let proses = [];
      // for (let i = 0; i < ob.listMonitoring.length; i++) {
      //   if (ob.listMonitoring[i].statusAntrian == 'Batal') {
      //     batal.push(ob.listMonitoring[i]);
      //   } else {
      //     proses.push(ob.listMonitoring[i]);
      //   }
      // }
      // ob.listMonitoring = [];
      // for (let j = 0; j < proses.length; j++) {
      //   ob.listMonitoring.push(proses[j]);
      // }
      // for (let j = 0; j < batal.length; j++) {
      //   ob.listMonitoring.push(batal[j]);
      // }
      // ob.getSelected;
    }

  }


  //buat dapetin status viewer nyala ga ,dari viewer-antriannya
  responSocketPingViewer(ob: MonitoringAntrianRegistrasiComponent, data: any) {
    console.log('ada ping dari viewer : ' + data);
    ob.statusViewerAktif = data;
  }

  responSocketInputKiosK(ob: MonitoringAntrianRegistrasiComponent, data: any) {
    console.log('ada Data Masuk dari Kiosk : ' + data);
    let kdRuanganL = ob.kdRuanganLogin;
    let penandaLanjutKiosk = false;
    if (data !== '') {
      for(let i=0; i < data.kdRuanganBroadcast.length; i++){
        if(kdRuanganL == data.kdRuanganBroadcast[i]){
          penandaLanjutKiosk = true;          
        }
      }
      if(penandaLanjutKiosk == true){
        let list = {
          kdAntrian: data.kdAntrian,
          namaDokter: data.namaDokter,
          namaKelompokKlien: data.namaKelompokKlien,
          namaPasien: data.namaPasien,
          namaRuanganTujuan: data.namaRuanganTujuan,
          noAntrian: data.noAntrian,
          noCM: data.noCM,
          noRetur: data.noRetur,
          statusPasien: data.statusPasien,
          statusAntrian: data.statusAntrian,
          alamatLengkap: data.alamatLengkap,
          kodeExternalJenisKelamin: data.kodeExternalJenisKelamin,
          tglLahir: data.tglLahir,
          tglPelayananAwal: data.tglPelayananAwal,
          noUrutPanggilan: data.noUrutPanggilan,
          noUrutPanggilanSort: parseInt(data.kdAntrian + '' + data.noUrutPanggilan),
          style: ""
        }
        let listMonitoring = [...ob.listMonitoring];
        listMonitoring.push(list);
        ob.listMonitoring = listMonitoring;
      }

    }
  }

  //buat dapetin no antrian dari socket nya
  responSocketPanggilNext(ob: MonitoringAntrianRegistrasiComponent, data: any) {


    console.log('Next : ' + data);
    let penandaLanjut = false;
    let kdRuanganL = ob.kdRuanganLogin;
    if (data !== '') {
      for(let i=0; i < data.kdRuanganBroadcast.length; i++){
        if(kdRuanganL == data.kdRuanganBroadcast[i]){
          penandaLanjut = true;          
        }
      }
      if(penandaLanjut == true){
        if (data.noAntrianNext != undefined) {
          ob.antrianNext.noUrutPanggilan = data.noAntrianNext;
          ob.antrianNext.kdAntrian = data.kdAntrianNext;
        }
        //buat cari index dari data listMonitoring yang di map baru cek no antriannya,berdasarkan data dari socket noAntrianNow
        let indexNow = ob.listMonitoring.map(function (e) { return e.noAntrian; }).indexOf(data.noAntrianNow);
        let indexBefore = ob.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrianBefore);
        //tidak sama dengan -1 artinya datanya ada atau indexnya ada
        if (indexBefore != -1) {
          //disini dapetin infonya buat di lempar ke grid lagi
          ob.listMonitoring[indexBefore].statusAntrian = data.namaStatusAntrianBefore;
          ob.listMonitoring[indexBefore].noUrutPanggilan = data.noUrutPanggilanAntrianBefore;
          ob.listMonitoring[indexBefore].noUrutPanggilanSort = parseInt(data.kdAntrianBefore + '' + data.noUrutPanggilanAntrianBefore);
        }
        if (indexNow != -1) {
          ob.listMonitoring[indexNow].statusAntrian = data.namaStatusSedangDipanggil;
        }
        ob.sortingDataByNoUrut();
      }
      
    }
    ob.kdAntrianNow = data.kdAntrianNow;
  }

  responSocketClientAdd(ob: MonitoringAntrianRegistrasiComponent, data: string) {
    let listMonitoring = [...ob.listMonitoring];
    listMonitoring.push(data);
    ob.listMonitoring = listMonitoring;
  }

  responSocketRemove(ob: MonitoringAntrianRegistrasiComponent, data: string) {
  }

  sortingData(event) {
    if (!event.order) {
      this.sortBy = 'concat_native(antrianRegistrasiMasuk.prefixNoAntrian,antrianRegistrasiMasuk.noAntrian)';
      this.typeSort = 'asc';
    } else {
      this.sortBy = event.field;

      if (event.field == 'namaPasien') {
        this.sortBy = 'pasien.namaLengkap';
      }
      if (event.field == 'namaKelompokPasien') {
        this.sortBy = 'kelompokPasien.namaKelompokPasien';
      }
      if (event.field == 'noCM') {
        this.sortBy = 'pasien.id.noCM';
      }
      if (event.field == 'statusPasien') {
        this.sortBy = 'statusPasien.namaStatus';
      }
      if (event.field == 'namaDokter') {
        this.sortBy = 'dokterOrder.namaLengkap';
      }
      if (event.field == 'namaRuanganTujuan') {
        this.sortBy = 'ruanganTujuan.namaRuangan';
      }
      if (event.field == 'noAntrian') {
        this.sortBy = 'concat_native(antrianRegistrasiMasuk.prefixNoAntrian,antrianRegistrasiMasuk.noAntrian)';
      }
      if (event.order == 1) {
        this.typeSort = 'asc';
      } else {
        this.typeSort = 'desc';
      }
    }
    if (event.field != 'number') {
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }
  }


  filterData(event, fromField) {
    if (fromField == 'namaPasien') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.pencarian = '&namaPasien=' + event + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'noCm') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.pencarian = '&noCm=' + event + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'noAntrian') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.pencarian = '&noAntrian=' + event + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'kelompokPasien') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.kelompokPasienFilterMulti = "";
      if (this.kelompokPasienFilter.length > 0) {
        for (let i = 0; i < this.kelompokPasienFilter.length; i++) {
          this.kelompokPasienFilterMulti += "&kdKelompokKlien[]=" + this.kelompokPasienFilter[i].value.kode.kode
        }
      }
      this.pencarian = this.kelompokPasienFilterMulti + '&noAntrian=' + this.noAntrianFilter + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'statusAntrian') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.statusAntrianFilterMulti = "";
      if (this.statusAntrianFilter.length > 0) {
        for (let i = 0; i < this.statusAntrianFilter.length; i++) {
          this.statusAntrianFilterMulti += "&kdStatus[]=" + this.statusAntrianFilter[i].value.kdStatus
        }
      }
      this.pencarian = this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'ruanganTujuan') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.namaRuanganTujuanFilterMulti = "";
      if (this.namaRuanganTujuanFilter.length > 0) {
        for (let i = 0; i < this.namaRuanganTujuanFilter.length; i++) {
          this.namaRuanganTujuanFilterMulti += "&kdRuanganTujuan[]=" + this.namaRuanganTujuanFilter[i].value.kdRuanganTujuan
        }
      }
      this.pencarian = this.namaRuanganTujuanFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.statusAntrianFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'namaDokter') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.namaDokterFilterMulti = "";
      if (this.namaDokterFilter.length > 0) {
        for (let i = 0; i < this.namaDokterFilter.length; i++) {
          this.namaDokterFilterMulti += "&kdPegawai[]=" + this.namaDokterFilter[i].value.kdPegawai
        }
      }
      this.pencarian = this.namaDokterFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusAntrianFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'statusPasien') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.statusPasienFilterMulti = "";
      if (this.statusPasienFilter.length > 0) {
        for (let i = 0; i < this.statusPasienFilter.length; i++) {
          this.statusPasienFilterMulti += "&kdStatusPasien[]=" + this.statusPasienFilter[i].value.id
        }
      }
      this.pencarian = this.statusPasienFilterMulti + this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'alamatLengkap') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.pencarian = '&alamat=' + event + '&noCm=' + this.noCMFilter + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'tglLahir') {
      let tglLahir = '';
      if(this.tglLahirFilter !== null && this.tglLahirFilter !== ""){
        tglLahir = this.setTimeStamp(event);
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&noCm=' + this.noCMFilter + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'jk') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.jenisKelaminFilterMulti = "";
      if (this.jenisKelaminFilter.length > 0) {
        for (let i = 0; i < this.jenisKelaminFilter.length; i++) {
          this.jenisKelaminFilterMulti += "&kdJenisKelamin[]=" + this.jenisKelaminFilter[i].value.id_kode
        }
      }
      this.pencarian = this.jenisKelaminFilterMulti + this.statusPasienFilterMulti + this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

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

  cetak() {
    let kdProfile = this.authGuard.getUserDto().kdProfile;
    let kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
    let tanggalAwal = new Date(this.tanggalAwal);
    let tanggalAkhir = new Date(this.tanggalAkhir);
    tanggalAwal.setHours(0, 0, 0, 0);
    let tglAkhir = this.setTimeStamp(tanggalAkhir);
    let tglAwal = this.setTimeStamp(tanggalAwal);
    let sortBy = '';

    if (this.sortBy == 'concat_native(antrianRegistrasiMasuk.prefixNoAntrian,antrianRegistrasiMasuk.noAntrian)') {
      sortBy = 'antrianRegistrasiMasuk.NoAntrian';
    }

    if (this.sortBy == 'pasien.id.noCM') {
      sortBy = 'pasien.NoCM';
    }

    if (this.sortBy == 'pasien.namaLengkap') {
      sortBy = 'pasien.NamaLengkap';
    }

    if (this.sortBy == 'statusPasien.namaStatus') {
      sortBy = 'status.NamaStatus';
    }

    if (this.sortBy == 'kelompokPasien.namaKelompokPasien') {
      sortBy = 'kelompokPasien.KelompokPasien';
    }

    if (this.sortBy == 'dokterOrder.namaLengkap') {
      sortBy = 'dokterOrder.NamaLengkap';
    }

    if (this.sortBy == 'ruanganTujuan.namaRuangan') {
      sortBy = 'ruanganTujuan.NamaRuangan';
    }



    let orderBy = '';
    if (sortBy != '') {
      orderBy = " Order By " + sortBy + ' ' + this.typeSort;
    }


    let jenisPasien = '';
    for (let i = 0; i < this.kelompokPasienFilter.length; i++) {
      if (i < this.kelompokPasienFilter.length - 1) {
        jenisPasien += this.kelompokPasienFilter[i].value.namaKelompokPasien + ",";
      }
      if (i == this.kelompokPasienFilter.length - 1) {
        jenisPasien += this.kelompokPasienFilter[i].value.namaKelompokPasien;
      }
    }

    let ruanganTujuan = '';
    for (let i = 0; i < this.namaRuanganTujuanFilter.length; i++) {
      if (i < this.namaRuanganTujuanFilter.length - 1) {
        ruanganTujuan += this.namaRuanganTujuanFilter[i].value.namaRuanganTujuan + ",";
      }
      if (i == this.namaRuanganTujuanFilter.length - 1) {
        ruanganTujuan += this.namaRuanganTujuanFilter[i].value.namaRuanganTujuan;
      }
    }

    let namaDokter = '';
    for (let i = 0; i < this.namaDokterFilter.length; i++) {
      if (i < this.namaDokterFilter.length - 1) {
        namaDokter += this.namaDokterFilter[i].value.namaLengkap + ",";
      }
      if (i == this.namaDokterFilter.length - 1) {
        namaDokter += this.namaDokterFilter[i].value.namaLengkap;
      }
    }

    let statusAntrian = '';
    for (let i = 0; i < this.statusAntrianFilter.length; i++) {
      if (i < this.statusAntrianFilter.length - 1) {
        statusAntrian += this.statusAntrianFilter[i].value.status + ",";
      }
      if (i == this.statusAntrianFilter.length - 1) {
        statusAntrian += this.statusAntrianFilter[i].value.status;
      }
    }

    this.pencarian = '';

    let queryAnd = '';


    if (this.listMonitoring.length == 1) {
      queryAnd += " and concat(antrianRegistrasiMasuk.prefixNoAntrian,antrianRegistrasiMasuk.noAntrian) like '%" + this.listMonitoring[0].noAntrian + "%' "
    }

    if (this.noAntrianFilter != "") {
      queryAnd += " and concat(antrianRegistrasiMasuk.prefixNoAntrian,antrianRegistrasiMasuk.noAntrian) like '%" + this.noAntrianFilter + "%' "
    }

    if (this.noCMFilter != "") {
      queryAnd += " and pasien.noCM like '%" + this.noCMFilter + "%' "
    }

    if (this.namaPasienFilter != "") {
      queryAnd += " and pasien.namaLengkap like '%" + this.namaPasienFilter + "%' "
    }

    if (this.jenisKelaminFilter.length > 0) {
      let kdJenisKelamin = ''
      for (let i = 0; i < this.jenisKelaminFilter.length; i++) {
        if (i < this.jenisKelaminFilter.length - 1) {
          kdJenisKelamin += "'" + this.jenisKelaminFilter[i].value.id_kode + "'" + ",";
        }
        if (i == this.jenisKelaminFilter.length - 1) {
          kdJenisKelamin += "'" + this.jenisKelaminFilter[i].value.id_kode + "'";
        }
      }
      queryAnd += "and pasien.kdJenisKelamin in (" + kdJenisKelamin + ") ";
    }

    if (this.tglLahirFilter != "") {
      let tglLahirAwal = this.tglLahirFilter.setHours(0, 0, 0, 0);
      let tglLahirAkhir = this.tglLahirFilter.setHours(23, 59, 0, 0);
      queryAnd += " and pasien.TglLahir BETWEEN " + this.setTimeStamp(tglLahirAwal) + " AND " + this.setTimeStamp(tglLahirAkhir);
    }

    if (this.statusAntrianFilter.length > 0) {
      let kdStatus = ''
      for (let i = 0; i < this.statusAntrianFilter.length; i++) {
        if (i < this.statusAntrianFilter.length - 1) {
          kdStatus += this.statusAntrianFilter[i].value.kdStatus + ",";
        }
        if (i == this.statusAntrianFilter.length - 1) {
          kdStatus += this.statusAntrianFilter[i].value.kdStatus;
        }
      }
      queryAnd += "and status.kdStatus in (" + kdStatus + ") ";
    }

    if (this.kelompokPasienFilter.length > 0) {
      let kelompokPasien = ''
      for (let i = 0; i < this.kelompokPasienFilter.length; i++) {
        if (i < this.kelompokPasienFilter.length - 1) {
          kelompokPasien += this.kelompokPasienFilter[i].value.id_kode + ",";
        }
        if (i == this.kelompokPasienFilter.length - 1) {
          kelompokPasien += this.kelompokPasienFilter[i].value.id_kode;
        }
      }
      queryAnd += "and kelompokPasien.kdKelompokPasien in (" + kelompokPasien + ") ";
    }

    if (this.namaRuanganTujuanFilter.length > 0) {
      let kdRuangan = ''
      for (let i = 0; i < this.namaRuanganTujuanFilter.length; i++) {
        if (i < this.namaRuanganTujuanFilter.length - 1) {
          kdRuangan += "'" + this.namaRuanganTujuanFilter[i].value.kdRuanganTujuan + "'" + ",";
        }
        if (i == this.namaRuanganTujuanFilter.length - 1) {
          kdRuangan += "'" + this.namaRuanganTujuanFilter[i].value.kdRuanganTujuan + "'";
        }
      }
      queryAnd += "and antrianRegistrasiMasuk.KdRuanganTujuan in (" + kdRuangan + ") ";
    }

    if (this.namaDokterFilter.length > 0) {
      let kdDokter = ''
      for (let i = 0; i < this.namaDokterFilter.length; i++) {
        if (i < this.namaDokterFilter.length - 1) {
          kdDokter += "'" + this.namaDokterFilter[i].value.kdPegawai + "'" + ",";
        }
        if (i == this.namaDokterFilter.length - 1) {
          kdDokter += "'" + this.namaDokterFilter[i].value.kdPegawai + "'";
        }
      }
      queryAnd += "and dokterOrder.kdPegawai in (" + kdDokter + ") ";
    }

    if (this.statusPasienFilter.length > 0) {
      let status = '';
      let statusPasien = '';
      for (let i = 0; i < this.statusPasienFilter.length; i++) {
        if (this.statusPasienFilter[i].value.id == 1) {
          statusPasien = 'is NULL';
        } else {
          statusPasien = 'is NOT NULL';
        }
        if (i < this.statusPasienFilter.length - 1) {
          status += "antrianRegistrasiMasuk.NoCM " + statusPasien + " OR ";
        }
        if (i == this.statusPasienFilter.length - 1) {
          status += "antrianRegistrasiMasuk.NoCM " + statusPasien + "";
        }
      }
      queryAnd += "AND (" + status + " )";
    }

    if (this.alamatLengkapFilter != "") {
      queryAnd += " and (alamatPasien.AlamatLengkap like '%" + this.alamatLengkapFilter + "%' OR alamatAntrianRegistrasiMasuk.AlamatLengkap like '%" + this.alamatLengkapFilter + "%' )"
    }

    let data = {
      "download": false,
      "kdDepartemen": kdDepartemen,
      "kdProfile": kdProfile,
      "namaFile": "string",
      "outDepartemen": true,
      "outProfile": true,
      "paramKey": [
        "kdProfile",
        "namaPasien",
        "noAntrian",
        "jenisPasien",
        "noCm",
        "ruanganTujuan",
        "namaDokter",
        "namaStatus",
        "queryOrderBy",
        "queryAnd",
        "tglAwal",
        "tglAkhir",
        "gambarLogo"
      ],
      "paramValue": [
        kdProfile,
        this.namaPasienFilter,
        this.noAntrianFilter,
        jenisPasien,
        this.noCMFilter,
        ruanganTujuan,
        namaDokter,
        statusAntrian,
        orderBy,
        queryAnd,
        tglAwal,
        tglAkhir,
        this.gambarLogoProfile
      ]
    }

    this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-monitoring-antrian-registrasi-report.pdf', 'Laporan Monitoring Antrian Registrasi', data);
  }

  batal(data) {
    this.formBatal.get('kdAntrian').setValue(data.kdAntrian);
    this.formBatal.get('noUrut').setValue(data.noAntrian);
    this.batalDialog = true;
  }

  submitBatal() {
    let data = {
      "kdAntrian": this.formBatal.get('kdAntrian').value,
      "keterangan": this.formBatal.get('keterangan').value
    }
    this.httpService.post(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/batal?', data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dibatalkan');
      this.batalDialog = false;
    });
  }

  getSelected(rowData) {
    return rowData.style ? 'batal-bg' : '';
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

  clearPencarian() {
    this.ngOnInit();
  }

  cari() {
    this.getService(this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir))
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
  }

  panggilNext() {
    this.kdAntrianNowSendiri = null;
    if (this.antrianSekarang.kdAntrianNow != undefined) {
      this.kdAntrianNowSendiri = this.antrianSekarang.kdAntrianNow;
    }
    // if (this.statusViewerAktif) {
      this.httpService.post(Configuration.get().klinik1Java + '/viewerController/panggilAntrian?', {
        "tglAkhir": this.setTimeStamp(this.tanggalAkhir),
        "tglAwal": this.setTimeStamp(this.tanggalAwal),
        "kdAntrianBefore": this.antrianSekarang.kdAntrianNow
      }).subscribe(response => {
        this.antrianSekarang = response;
        this.contPanggilUlang = 1;
        if (this.rule.durasiPanggilanMenit != null) {
          this.contPanggilUlangMenitCek = false;
          clearTimeout(this.contPanggilUlangMenit);
          this.timerCount();
          this.contPanggilUlangMenit = setTimeout(() => {
            this.contPanggilUlangMenitCek = true;
            this.buttonAktifPanggilUlang = true;

            this.alertService.warn('Peringatan', 'Sudah Melebihi Menit Maksimal Panggil Ulang');
          }, (this.rule.durasiPanggilanMenit * 1000) * 60);
        }
        this.alertService.success('Berhasil', 'Data Berhasil Dipanggil');
        this.batalDialog = false;
      });
    // } else {
    //   this.alertService.warn('Peringatan', 'Cek Koneksi Viewer Antrian');
    // }

  }

  panggilUlang() {
    // if (this.statusViewerAktif) {
      if (this.contPanggilUlang < this.rule.qtyPanggilan || this.rule.qtyPanggilan == null) {
        let data = {
          "kdAntrian": this.antrianSekarang.kdAntrianNow,
          "noUrutAntrian": this.antrianSekarang.noAntrianNow,
          "noUrutPanggilan": this.antrianSekarang.noUrutPanggilanNow,
          "tglAkhir": this.setTimeStamp(this.tanggalAkhir),
          "tglAwal": this.setTimeStamp(this.tanggalAwal)
        }
        this.httpService.post(Configuration.get().klinik1Java + '/viewerController/panggilAntrianUlang?', data).subscribe(response => {
          this.contPanggilUlang += 1;
          if (this.contPanggilUlang == this.rule.qtyPanggilan && this.rule.qtyPanggilan != null) {
            this.buttonAktifPanggilUlang = true;
            this.alertService.warn('Peringatan', 'Sudah Melebihi Batas Maksimal Panggil Ulang');
          }
          this.alertService.success('Berhasil', 'Data Berhasil Dipanggil');
          this.batalDialog = false;
        });
      } else {
        this.buttonAktifPanggilUlang = true;
        this.alertService.warn('Peringatan', 'Sudah Melebihi Batas Maksimal Panggil Ulang');
      }


    // } else {
    //   this.alertService.warn('Peringatan', 'Cek Koneksi Viewer Antrian');
    // }

  }
  panggilRow(event) {
    let kdAntrianBefore = null;
    if (this.antrianSekarang.kdAntrianNow != undefined) {
      kdAntrianBefore = this.antrianSekarang.kdAntrianNow;
    }
    //if (this.statusViewerAktif) {

      let data = {
        "kdAntrian": event.kdAntrian,
        "tglAkhir": this.setTimeStamp(this.tanggalAkhir),
        "tglAwal": this.setTimeStamp(this.tanggalAwal),
        "kdAntrianBefore": kdAntrianBefore
      }
      this.httpService.post(Configuration.get().klinik1Java + '/viewerController/panggilAntrianPerRow?', data).subscribe(response => {
        this.antrianSekarang = response;
        this.alertService.success('Berhasil', 'Data Berhasil Dipanggil');
        this.batalDialog = false;
      });
    //}
    //  else {
    //   this.alertService.warn('Peringatan', 'Cek Koneksi Viewer Antrian');
    // }
  }

  register(event) {
    if (event.noCM != null && event.noCM != '' && event.noCM != '-') {
      localStorage.setItem('dataPelayananProses', JSON.stringify(event));
      this.routes.navigate(['registrasi-pelayanan']);
      //this.alertService.success('Registrasi Pelayanan', event.noCM);
    } else {
      localStorage.setItem('kdAntrianProses', JSON.stringify(event.kdAntrian));
      localStorage.setItem('nomorAntrianProses', JSON.stringify(event.noAntrian));
      this.routes.navigate(['registrasi-pasien-baru']);
    }
  }


  handleChange(e){
    let statusLoketE = e.checked;
    //this.statusLoket = statusLoketE;
    // this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findAntrianRegistrasiMasuk?page=' + this.page + '&rows=' + this.rows + '&dir=' + '' + '&sort=' + '' + '' + '&tglAwal=' + this.setTimeStamp(this.tanggalAwal) + '&tglAkhir=' + this.setTimeStamp(this.tanggalAkhir)).subscribe(table => {
    //   this.statusOnlineViewer = table.statusOnline;
    //   this.statusLoket = this.statusOnlineViewer;
      
      if (this.statusLoket) {
        //ini yang ON
        this.httpService.get(Configuration.get().klinik1Java + '/viewerController/setStatusMonitoringOnline').toPromise()
        .then(r=>{
          return r;
        }).catch(error=> {
          console.log(error);
          this.statusLoket = false;
          //disabled button
          this.buttonAktif = true;
          this.buttonAktifPanggilRow = true;
          this.buttonAktifPanggilUlang = true;
        });
        
    
          this.buttonAktif = false;
          if (this.contPanggilUlang > 1 || this.contPanggilUlangMenitCek == true) {
            if ((this.contPanggilUlang >= this.rule.qtyPanggilan && this.rule.qtyPanggilan != null) || (this.contPanggilUlangMenitCek == true)) {
              this.buttonAktifPanggilUlang = true;
            } else {
              this.buttonAktifPanggilUlang = false;
            }
          } else {
            this.buttonAktifPanggilUlang = false;
          }

          //diblok dulu
          // if (this.rule.isPanggilanByPass == 1) {
          //   this.buttonAktifPanggilRow = false;
          // } else {
          //   this.buttonAktifPanggilRow = true;
          // }

          this.buttonAktifPanggilRow = false;
        
        

      } else {
        //alertnya jadi di frontend
        //this.alert.warn('Perhatian','Cek Koneksi Viewer Terlebih Dahulu');

         //ini yang OFF
         this.httpService.get(Configuration.get().klinik1Java + '/viewerController/setStatusMonitoringOffline').subscribe(table => {
        });

        this.buttonAktif = true;
        this.buttonAktifPanggilRow = true;
        this.buttonAktifPanggilUlang = true;

      }
    // });
  }

  cekLoadLoket(){
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findAntrianRegistrasiMasuk?page=' + this.page + '&rows=' + this.rows + '&dir=' + '' + '&sort=' + '' + '' + '&tglAwal=' + this.setTimeStamp(this.tanggalAwal) + '&tglAkhir=' + this.setTimeStamp(this.tanggalAkhir)).subscribe(table => {
      this.statusOnlineViewer = table.statusOnline;
      this.statusLoket = this.statusOnlineViewer;
      

      if(this.statusLoket){
        this.buttonAktif = false;
          if (this.contPanggilUlang > 1 || this.contPanggilUlangMenitCek == true) {
            if ((this.contPanggilUlang >= this.rule.qtyPanggilan && this.rule.qtyPanggilan != null) || (this.contPanggilUlangMenitCek == true)) {
              this.buttonAktifPanggilUlang = true;
            } else {
              this.buttonAktifPanggilUlang = false;
            }
          } else {
            this.buttonAktifPanggilUlang = false;
          }

          //ini di blok dulu
          // if (this.rule.isPanggilanByPass == 1) {
          //   this.buttonAktifPanggilRow = false;
          // } else {
          //   this.buttonAktifPanggilRow = true;
          // }
          this.buttonAktifPanggilRow = false;
      }
       
    });
  }

  cekStatusLoket() {
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/findAntrianRegistrasiMasuk?page=' + this.page + '&rows=' + this.rows + '&dir=' + '' + '&sort=' + '' + '' + '&tglAwal=' + this.setTimeStamp(this.tanggalAwal) + '&tglAkhir=' + this.setTimeStamp(this.tanggalAkhir)).subscribe(table => {
      this.statusOnlineViewer = table.statusOnline;
      this.statusLoket = this.statusOnlineViewer;
      // this.statusLoketPing = setInterval(() => {
      // this.statusLoketPing = setTimeout(()=> {
      
      if (this.statusLoket) {
        //ini yang ON
        this.httpService.get(Configuration.get().klinik1Java + '/viewerController/setStatusMonitoringOnline').toPromise()
        .then(r=>{
          return r;
        }).catch(error=> {
          console.log(error);
          this.statusLoket = false;
        });
        //subscribe(res => {
          // let respon = res.statusCode
			    // if (respon == 501){
          //   this.statusLoket = false;
          // }
        // });


        // this.socket.emit('klinik.monitoring.status.loket.'+this.authGuard.getUserDto().kdProfile, {
        //   kdRuangan: this.authGuard.getUserDto().kdRuangan,
        //   status: this.statusLoket,
        //   unik:this.identitas
        // });
        
        this.buttonAktif = false;
        // this.buttonAktifPanggilRow = false;
        if (this.contPanggilUlang > 1 || this.contPanggilUlangMenitCek == true) {
          if ((this.contPanggilUlang >= this.rule.qtyPanggilan && this.rule.qtyPanggilan != null) || (this.contPanggilUlangMenitCek == true)) {
            this.buttonAktifPanggilUlang = true;
          } else {
            this.buttonAktifPanggilUlang = false;
          }
        } else {
          this.buttonAktifPanggilUlang = false;
        }
        if (this.rule.isPanggilanByPass == 1) {
          this.buttonAktifPanggilRow = false;
        } else {
          this.buttonAktifPanggilRow = true;
        }


      } else {
         //ini yang OFF
         this.httpService.get(Configuration.get().klinik1Java + '/viewerController/setStatusMonitoringOffline').subscribe(table => {
        });


        //nanti disni yang buat off

        // this.socket.emit('klinik.monitoring.status.loket.'+this.authGuard.getUserDto().kdProfile, {
        //   kdRuangan: this.authGuard.getUserDto().kdRuangan,
        //   status: this.statusLoket,
        //   unik:this.identitas
        // });
        this.buttonAktif = true;
        this.buttonAktifPanggilRow = true;
        this.buttonAktifPanggilUlang = true;

      }
    // },2000);
    // }, 3000);

  });
  }
  clear() {
    clearInterval(this.statusLoketPing);
    //clearTimeout(this.statusLoketPing)
    this.socket.con();
  }
  timerCount() {
    var countDownDate = new Date().setMinutes(new Date().getMinutes() + this.rule.durasiPanggilanMenit);
    var x = setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.timer = minutes + "m " + seconds + "s ";
      if (distance < 0) {
        clearInterval(x);
        this.timer = 0 + "m " + 0 + "s ";
      }
    }, 1000);
  }
  manualAktif(data) {
    if (this.antrianSekarang.kdAntrianNow != undefined && this.antrianSekarang.kdAntrianNow != null && this.antrianSekarang.kdAntrianNow != '') {
      this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/getProsesUlangManual?kdAntrianNow=' + this.antrianSekarang.kdAntrianNow + '&qtyPanggilan=' + this.rule.qtyNomorPastRecall + '&periodeAwal=' + this.setTimeStamp(this.tanggalAwal) + '&periodeAkhir=' + this.setTimeStamp(this.tanggalAkhir)).subscribe(table => {
        this.formAktifAntrian.get('noAntrianNext').setValue(table.noAntrianAfter);
        this.formAktifAntrian.get('noAntrianNow').setValue(this.antrianSekarang.noAntrianNow);
        this.formAktifAntrian.get('noAntrianNow').disable();
        this.formAktifAntrian.get('noAntrianNext').disable();
      });
      this.formAktifAntrian.get('kdAntrianNow').setValue(data.kdAntrian);
      this.formAktifAntrian.get('kdAntrianChanged').setValue(data.kdAntrian);
      this.formAktifAntrian.get('noAntrian').setValue(data.noAntrian);
      this.formAktifAntrian.get('noUrut').setValue(data.noUrutPanggilan);
      this.formAktifAntrian.get('qtyPanggilan').setValue(this.rule.qtyNomorPastRecall);
      this.antrianAktifDialog = true;
    } else {
      this.alertService.warn('Peringatan', 'Belum Ada Data Antrian Yang Dipanggil');
    }

  }

  submitAktif() {
    let kdAntrianNow = null;
    if (this.antrianSekarang.kdAntrianNow != undefined) {
      kdAntrianNow = this.antrianSekarang.kdAntrianNow;
      let data = {
        "kdAntrianChanged": this.formAktifAntrian.get('kdAntrianChanged').value,
        "kdAntrianNow": kdAntrianNow,
        "qtyPanggilan": this.formAktifAntrian.get('qtyPanggilan').value
      }
      this.httpService.post(Configuration.get().klinik1Java + '/monitoringAntrianRegistrasiController/prosesUlangManual?', data).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diaktifkan');
        this.antrianAktifDialog = false;
      });
    }
  }

  sortingDataByNoUrut() {
    this.listMonitoring.sort(function (a, b) { return a.noUrutPanggilan - b.noUrutPanggilan || b.kdAntrian - a.kdAntrian });
    // this.listMonitoring.sort((a, b) => (a.noUrutPanggilan > b.noUrutPanggilan) ? 1 : ((b.noUrutPanggilanSort > a.noUrutPanggilanSort) ? -1 : 0));
    let listMonitoring = [...this.listMonitoring];
    this.listMonitoring = listMonitoring;
  }


}
