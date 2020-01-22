import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, Authentication, AuthGuard, AlertService, InfoService, Configuration, ReportService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/timeout';
import { ChangeDetectorRef } from '@angular/core';


@Injectable()
@Component({
  selector: 'app-monitoring-pasien-diperiksa',
  templateUrl: './monitoring-pasien-diperiksa.component.html',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['./monitoring-pasien-diperiksa.component.scss']
})
export class MonitoringPasienDiPeriksaComponent implements AfterViewInit, OnInit,  OnDestroy {
  statusLoket: boolean;
  buttonAktif: boolean;
  tanggalAwal: any;
  tanggalAkhir: any;
  listMonitoring: any[];
  widthScreen: any;
  sortBy: any;
  typeSort: any;
  totalRecords: any;
  page: number;
  rows: number;
  pencarian: string;
  kdDepartemen: any;
  kdRuanganLogin: any;
  buttonAktifPanggilUlang: boolean;
  antrianSekarang: any;
  antrianNext: any;
  noAntrianFilter: any;
  noRegistrasiFilter:any;
  noCMFilter: any;
  namaPasienFilter: any;
  jenisKelaminFilter: any[];
  tglLahirFilter: any;
  tglRegFilter:any;
  tglPelFilter:any;
  listStatusPeriksa: any[];
  statusPeriksaFilter: any[];
  kelompokPasienFilter: any[];
  namaRuanganTujuanFilter: any[];
  namaDokterFilter: any[];
  statusPasienFilter: any[];
  alamatLengkapFilter: any;
  listKelompokPasien: any[];
  listRuanganTujuan: any[];
  listDokter: any[];
  listStatusPasien: any[];
  listJenisKelamin: any[];
  listStatusAntrian: any[];
  statusAntrianFilterMulti: any;
  kelompokPasienFilterMulti: any;
  namaRuanganTujuanFilterMulti: any;
  jenisKelaminFilterMulti: any;
  statusPasienFilterMulti: any;
  namaDokterFilterMulti: any;
  kdStatusDefault: any[];
  batalDialog: boolean;
  formBatal: FormGroup;
  formAktifAntrian: FormGroup;
  antrianAktifDialog: boolean;
  statusLoketPing: any;
  kdProfile:any;
  contPanggilUlang: any;
  contPanggilUlangMenit: any;
  contPanggilUlangMenitCek: boolean;
  statusViewerAktif: any;
  buttonAktifPanggilRow: boolean;
  rule: any;
  filter: string;
  sortF: any;
  sortO: any;
  gambarLogoProfile: any;
  kdAntrianNow: any;
  kdAntrianNowSendiri: any;
  timer: any;
  uiGrid: any;
  sidebar: boolean;
  iconSideBar: any;
  styleSidebar: any;
  statusLoketSide:any[] = [];
  daftarRuanganLogin:any[];
  statusAwal:any[] = [];

  constructor(
    private authGuard: AuthGuard,
    private httpService: HttpClient,
    private fb: FormBuilder,
    private alertService: AlertService,
    private rowNumberService: RowNumberService,
    private routes: Router,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService
  ) { 
    this.widthScreen = screen.width - 962 - 131 + 'px';
  }


  ngOnDestroy(){
    let uiGrowl = document.getElementsByClassName('ui-growl ui-widget') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < uiGrowl.length; i++) {
      uiGrowl[i].style.marginTop = '0px';
    }
    this.socket.emit('klinik.monitoring.pelayanan.status.loket.' + this.kdProfile, {
      kdRuangan: this.kdRuanganLogin,
      status: false,
      unik:0
    });

    this.socket.dis();
    this.clear();
  }

  identitas = 0;

  ngOnInit() {
    this.iconSideBar = "fa fa-angle-right";
    this.sidebar = false;
    this.uiGrid = 12;

    this.identitas = new Date().getTime();

    this.kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
    this.kdProfile = this.authGuard.getUserDto().kdProfile;
    this.kdRuanganLogin = this.authGuard.getUserDto().kdRuangan;
    this.kdStatusDefault = [];
    this.contPanggilUlang = 1;
    this.contPanggilUlangMenit = null;
    this.contPanggilUlangMenitCek = false;
    this.statusViewerAktif = false;
    this.statusLoket = false;
    this.buttonAktif = true;
    this.buttonAktifPanggilUlang = true;
    this.buttonAktifPanggilRow = false;
    this.cekStatusLoket();



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
    this.namaPasienFilter = [];
    this.noCMFilter = '';
    this.noAntrianFilter = '';
    this.kelompokPasienFilter = [];
    this.statusPeriksaFilter = [];
    this.statusPasienFilter = [];
    this.namaDokterFilter = [];
    this.noRegistrasiFilter = '';
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
    this.tglRegFilter ="";
    this.tglPelFilter="";
    this.tanggalAwal = new Date();
    this.tanggalAkhir = new Date();
    this.tanggalAwal.setHours(0, 0, 0, 0);
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


    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = 50;
    }
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.gambarLogoProfile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });

    this.getService(tanggalAwal, tanggalAkhir);
    this.socket.emit('kdProfile', this.authGuard.getUserDto().kdProfile);
    this.socket.emit('klinik.monitoring.pelayanan.registrasi.batal.server.'+this.authGuard.getUserDto().kdProfile, '');

    this.socket.on('klinik.monitoring.pelayanan.registrasi.batal.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketBatalService, this);
    this.socket.on('klinik.viewer.pelayanan.client.'+this.authGuard.getUserDto().kdProfile, (data:any,ob:any)=>{this.responSocketPanggilNext2(data,ob);}, this);
    //this.socket.on('klinik.viewer.pelayanan.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketPanggilNext, this);
    
    
    //yang ini dapet dari emit viewer antrian ke monitoring untuk koneksi
    //this.socket.on('klinik.monitor.pelayanan.ping.'+this.authGuard.getUserDto().kdProfile, this.responSocketPingViewer, this);

    //ini kayanya dapet dari emit kiosk form
    this.socket.on('klinik.kiosk.pelayanan.registrasi.save.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketInputKiosK, this);

    //ini untuk selesainya registrasi pasien baru setelah diproses
    this.socket.on('klinik.monitoring.pelayanan.registrasi.selesai.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketSelesaiService, this);

  }



  ngAfterViewInit(){
    

    var refactorInpusSwitch = document.getElementsByClassName('ui-inputswitch ui-widget ui-widget-content ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorInpusSwitch.length; i++) {
      refactorInpusSwitch[i].style.cssFloat = 'right';
    }

    let labelMultiSelect = document.getElementsByClassName('ui-multiselect-label ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < labelMultiSelect.length; i++) {
      labelMultiSelect[i].innerHTML = 'Cari';
      labelMultiSelect[i].innerText = 'Cari';
    }

    let gridUnfrozen = document.getElementsByClassName('ui-datatable-scrollable-view ui-datatable-unfrozen-view') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < gridUnfrozen.length; i++) {
      gridUnfrozen[i].style.left = '990px';
    }
  }

    //buat dapetin data yang batal /dibatalin di antrian dari socket juga
    responSocketBatalService(ob: MonitoringPasienDiPeriksaComponent, data: any) {
      console.log('Batal : ' + data);
      if (data !== '') {
        let index = ob.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrian);
        if (index != -1) {
          ob.listMonitoring[index].statusPeriksa = data.namaStatus;
          ob.listMonitoring[index].noRetur = data.noRetur;
          ob.listMonitoring[index].style = "'background':'darkgrey'";
        }
        ob.tanggalAkhir = new Date();
  
        let batal = [];
        let proses = [];
        for (let i = 0; i < ob.listMonitoring.length; i++) {
          if (ob.listMonitoring[i].statusPeriksa == 'Batal') {
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

    getSelected(rowData) {
      return rowData.style ? 'batal-bg' : '';
    }

    responSocketPanggilNext2(data: any, ob:any) {
       //data dari form ini 
       //ob dari backend
      
        //console.log('Next : ' + data);
        if (ob !== '') {
          if (ob.noAntrianNext != undefined) {
            data.antrianNext.noUrutPanggilan = ob.noAntrianNext;
            data.antrianNext.kdAntrian = ob.kdAntrianNext;
          }
          //buat cari index dari data listMonitoring yang di map baru cek no antriannya,berdasarkan data dari socket noAntrianNow
          let indexNow = data.listMonitoring.map(function (e) { return e.noAntrian; }).indexOf(ob.noAntrianNow);
          let indexBefore = data.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(ob.kdAntrianBefore);
          //tidak sama dengan -1 artinya datanya ada atau indexnya ada
          if (indexBefore != -1) {
            //disini dapetin infonya buat di lembar ke grid lagi
            data.listMonitoring[indexBefore].statusPeriksa = ob.namaStatusAntrianBefore;
            data.listMonitoring[indexBefore].noUrutPanggilan = ob.noUrutPanggilanAntrianBefore;
            data.listMonitoring[indexBefore].noUrutPanggilanSort = parseInt(ob.kdAntrianBefore + '' + ob.noUrutPanggilanAntrianBefore);
          }
          if (indexNow != -1) {
            data.listMonitoring[indexNow].statusPeriksa = ob.namaStatusSedangDipanggil;
          }
          data.sortingDataByNoUrut();
        }
        data.kdAntrianNow = data.kdAntrianNow;
    }

    //buat dapetin no antrian dari socket nya
  responSocketPanggilNext(ob: MonitoringPasienDiPeriksaComponent, data: any) {


    console.log('Next : ' + data);
    if (data !== '') {
      if (data.noAntrianNext != undefined) {
        ob.antrianNext.noUrutPanggilan = data.noAntrianNext;
        ob.antrianNext.kdAntrian = data.kdAntrianNext;
      }
      //buat cari index dari data listMonitoring yang di map baru cek no antriannya,berdasarkan data dari socket noAntrianNow
      let indexNow = ob.listMonitoring.map(function (e) { return e.noAntrian; }).indexOf(data.noAntrianNow);
      let indexBefore = ob.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrianBefore);
      //tidak sama dengan -1 artinya datanya ada atau indexnya ada
      if (indexBefore != -1) {
        //disini dapetin infonya buat di lembar ke grid lagi
        ob.listMonitoring[indexBefore].statusPeriksa = data.namaStatusAntrianBefore;
        ob.listMonitoring[indexBefore].noUrutPanggilan = data.noUrutPanggilanAntrianBefore;
        ob.listMonitoring[indexBefore].noUrutPanggilanSort = parseInt(data.kdAntrianBefore + '' + data.noUrutPanggilanAntrianBefore);
      }
      if (indexNow != -1) {
        ob.listMonitoring[indexNow].statusPeriksa = data.namaStatusSedangDipanggil;
      }
      ob.sortingDataByNoUrut();
    }
    ob.kdAntrianNow = data.kdAntrianNow;
  }

  sortingDataByNoUrut() {
    this.listMonitoring.sort(function (a, b) { return a.noUrutPanggilan - b.noUrutPanggilan || b.kdAntrian - a.kdAntrian });
    let listMonitoring = [...this.listMonitoring];
    this.listMonitoring = listMonitoring;
  }

    //buat dapetin status viewer nyala ga ,dari viewer-antriannya
    responSocketPingViewer(ob: MonitoringPasienDiPeriksaComponent, data: any) {
      console.log('ada ping dari viewer : ' + data);
      ob.statusViewerAktif = data;
    }

    responSocketInputKiosK(ob: MonitoringPasienDiPeriksaComponent, data: any) {
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
            noRetur: data.noRetur,
            noAntrian: data.noAntrian,
            noRegistrasi: data.noRegistrasi,
            noCM: data.noCM,
            namaPasien: data.namaPasien,
            kodeExternalJenisKelamin: data.kodeExternalJenisKelamin,
            tglLahir: data.tglLahir,
            tglRegistrasi: data.tglAntrian,
            tglPelayanan: data.tglPelayananAwal,
            noAntrianByDokter: data.noAntrianByDokter,
            statusPeriksa: data.statusAntrian,
            namaKelompokKlien: data.namaKelompokKlien,
            namaRuanganTujuan: data.namaRuanganTujuan,
            namaDokter: data.namaDokter,
            statusPasien: data.statusPasien,
            alamatLengkap: data.alamatLengkap,
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

    responSocketSelesaiService(ob: MonitoringPasienDiPeriksaComponent, data: any){

      console.log('Proses Done : ' + data);
      if (data !== '') {
        let index = ob.listMonitoring.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrian);
        if (index != -1) {
          let listMonitoring = [...ob.listMonitoring];
       
          listMonitoring.splice(index,1);
          ob.listMonitoring = listMonitoring;

        }
      }
  
    }

  manualAktif(data){
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

  sortingData(event) {

    if (!event.order) {
      this.sortBy = 'concat_native(antrianRegistrasiRawatJalan.prefixNoAntrian,antrianRegistrasiRawatJalan.noAntrian) by noAntrian';
      this.typeSort = 'asc';
    } else {
      this.sortBy = event.field;
      if(event.field == 'tglRegistrasi'){
        this.sortBy = 'tglAntrian';
      }

      if(event.field == 'tglPelayanan'){
        this.sortBy = 'tglPelayananAwal';
      }
      
      if (event.field == 'namaPasien') {
        this.sortBy = 'pasien.namaLengkap';
      }
      if (event.field == 'namaKelompokPasien') {
        this.sortBy = 'kelompokPasien.namaKelompokPasien';
      }
      if (event.field == 'noCM') {
        this.sortBy = 'pasien.id.noCM';
      }
      if(event.field == 'noRegistrasi'){
        this.sortBy = 'antrianRegistrasiPelayanan.noRegistrasi';
      }
      if (event.field == 'statusPasien') {
        this.sortBy = 'statusPasien.namaStatus';
      }
      //ini yang baru statusPeriksa
      if (event.field == 'statusPeriksa') {
        this.sortBy = 'statusAntrian.id.kode';
      }
      if (event.field == 'namaDokter') {
        this.sortBy = 'dokter.namaLengkap';
      }
      if (event.field == 'namaRuanganTujuan') {
        this.sortBy = 'ruanganTujuan.namaRuangan';
      }
      if (event.field == 'noAntrian') {
        this.sortBy = 'concat_native(antrianRegistrasiPelayanan.prefixNoAntrian,antrianRegistrasiPelayanan.noAntrian)';
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

  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }
  }

  getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any) {
    if (search == null || search == '' || search.indexOf('&kdStatus[]') == -1) {
      for (let i = 0; i < this.kdStatusDefault.length; i++) {
        search += "&kdStatus[]=" + this.kdStatusDefault[i];
      }
    }
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/findAntrianRegistrasiRawatJalan?page=' + page + '&rows=' + rows + '&dir=' + sortBy + '&sort=' + typeSort + search + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir).subscribe(table => {
      this.listMonitoring = [];
      let list = [];
      for (let i = 0; i < table.antrianRegistrasiRawatJalanList.length; i++) {
        if (table.antrianRegistrasiRawatJalanList[i].noRetur == '-') {
          let potongAlamat;
          let alamatStr = table.antrianRegistrasiRawatJalanList[i].alamatLengkap;
          let alamatJum = table.antrianRegistrasiRawatJalanList[i].alamatLengkap;
          alamatJum = alamatJum.length;
          if(alamatJum > 86){
            potongAlamat = alamatStr.substring(0,86);
            potongAlamat = potongAlamat + '...';
          }else{
            potongAlamat = table.antrianRegistrasiRawatJalanList[i].alamatLengkap;
          }
          list[i] = {
            noRegistrasi: table.antrianRegistrasiRawatJalanList[i].noRegistrasi,
            kdRuanganTujuan: table.antrianRegistrasiRawatJalanList[i].kdRuanganTujuan,
            kdAntrian: table.antrianRegistrasiRawatJalanList[i].kdAntrian,
            namaDokter: table.antrianRegistrasiRawatJalanList[i].namaDokter,
            namaKelompokKlien: table.antrianRegistrasiRawatJalanList[i].namaKelompokKlien,
            namaPasien: table.antrianRegistrasiRawatJalanList[i].namaPasien,
            namaRuanganTujuan: table.antrianRegistrasiRawatJalanList[i].namaRuanganTujuan,
            noAntrian: table.antrianRegistrasiRawatJalanList[i].noAntrian,
            noCM: table.antrianRegistrasiRawatJalanList[i].noCM,
            noRetur: table.antrianRegistrasiRawatJalanList[i].noRetur,
            statusPasien: table.antrianRegistrasiRawatJalanList[i].statusPasien,
            statusPeriksa: table.antrianRegistrasiRawatJalanList[i].statusAntrian,
            alamatLengkap: potongAlamat,
            kodeExternalJenisKelamin: table.antrianRegistrasiRawatJalanList[i].kodeExternalJenisKelamin,
            tglLahir: table.antrianRegistrasiRawatJalanList[i].tglLahir,
            tglRegistrasi: table.antrianRegistrasiRawatJalanList[i].tglAntrian,
            tglPelayanan: table.antrianRegistrasiRawatJalanList[i].tglPelayananAwal,
            noAntrianByDokter: table.antrianRegistrasiRawatJalanList[i].noAntrianByDokter,
            noUrutPanggilan: table.antrianRegistrasiRawatJalanList[i].noUrutPanggilan,
            tooltipAlamat: table.antrianRegistrasiRawatJalanList[i].alamatLengkap,
            noUrutPanggilanSort: parseInt(table.antrianRegistrasiRawatJalanList[i].kdAntrian + '' + table.antrianRegistrasiRawatJalanList[i].noUrutPanggilan),
            style: ""
          }
        } else {
          let potongAlamat;
          let alamatStr = table.antrianRegistrasiRawatJalanList[i].alamatLengkap;
          let alamatJum = table.antrianRegistrasiRawatJalanList[i].alamatLengkap;
          alamatJum = alamatJum.length;
          if(alamatJum > 86){
            potongAlamat = alamatStr.substring(0,86);
            potongAlamat = potongAlamat + '...';
          }else{
            potongAlamat = table.antrianRegistrasiRawatJalanList[i].alamatLengkap;
          }
          list[i] = {
            noRegistrasi: table.antrianRegistrasiRawatJalanList[i].noRegistrasi,
            kdRuanganTujuan: table.antrianRegistrasiRawatJalanList[i].kdRuanganTujuan,
            kdAntrian: table.antrianRegistrasiRawatJalanList[i].kdAntrian,
            namaDokter: table.antrianRegistrasiRawatJalanList[i].namaDokter,
            namaKelompokKlien: table.antrianRegistrasiRawatJalanList[i].namaKelompokKlien,
            namaPasien: table.antrianRegistrasiRawatJalanList[i].namaPasien,
            namaRuanganTujuan: table.antrianRegistrasiRawatJalanList[i].namaRuanganTujuan,
            noAntrian: table.antrianRegistrasiRawatJalanList[i].noAntrian,
            noCM: table.antrianRegistrasiRawatJalanList[i].noCM,
            noRetur: table.antrianRegistrasiRawatJalanList[i].noRetur,
            statusPasien: table.antrianRegistrasiRawatJalanList[i].statusPasien,
            statusPeriksa: table.antrianRegistrasiRawatJalanList[i].statusAntrian,
            alamatLengkap: potongAlamat,
            kodeExternalJenisKelamin: table.antrianRegistrasiRawatJalanList[i].kodeExternalJenisKelamin,
            tglLahir: table.antrianRegistrasiRawatJalanList[i].tglLahir,
            tglRegistrasi: table.antrianRegistrasiRawatJalanList[i].tglAntrian,
            tglPelayanan: table.antrianRegistrasiRawatJalanList[i].tglPelayananAwal,
            tooltipAlamat: table.antrianRegistrasiRawatJalanList[i].alamatLengkap,
            noAntrianByDokter: table.antrianRegistrasiRawatJalanList[i].noAntrianByDokter,
            noUrutPanggilan: table.antrianRegistrasiRawatJalanList[i].noUrutPanggilan,
            noUrutPanggilanSort: parseInt(table.antrianRegistrasiRawatJalanList[i].kdAntrian + '' + table.antrianRegistrasiRawatJalanList[i].noUrutPanggilan),
            style: "'background':'darkgrey'",
          }
        }

      }
      this.alertService.success('Berhasil', 'Data Berhasil Ditampilkan');
      this.totalRecords = table.totalRow;
      this.listMonitoring = this.rowNumberService.addRowNumber(page, rows, list);


    });
    this.httpService.post(Configuration.get().klinik1Java + '/viewerRawatJalanController/getNomorPanggilanMin?', {
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
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/findKdStatusAntrianDefault').toPromise().
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
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/findKdKelompokKlien').subscribe(table => {
      this.listKelompokPasien = [];
      for (var i = 0; i < table.length; i++) {
        this.listKelompokPasien.push({ label: table[i].namaKelompokKlien, value: table[i] })
      };
    });

    //JenisKelamin
    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=JenisKelamin&select=namaJenisKelamin,id.kode').subscribe(res => {
      this.listJenisKelamin = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i] })
      };
    });

    //dokter
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/getDokterByTglAwalTglAkhir?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listDokter = [];
      for (var i = 0; i < table.dokter.length; i++) {
        this.listDokter.push({ label: table.dokter[i].namaLengkap, value: table.dokter[i] })
      };
    });

    //ruanganTujuan
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/getRuanganTujuanByTglAwalTglAkhir?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listRuanganTujuan = [];
      for (var i = 0; i < table.ruangan.length; i++) {
        this.listRuanganTujuan.push({ label: table.ruangan[i].namaRuanganTujuan, value: table.ruangan[i] })
      };
    });

    //statusAntrian
    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/getStatusAntrianByTglAwalTglAkhir?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listStatusAntrian = [];
      for (var i = 0; i < table.status.length; i++) {
        this.listStatusAntrian.push({ label: table.status[i].status, value: table.status[i] })
      };
    });

    //ruleAntrian
    this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/getStrukturNomorByKdKelompokTransaksi').subscribe(table => {
      this.rule = table.data;
      //diblock dulu
    //   if (this.statusLoket) {
    //     if (this.rule.isPanggilanByPass == 1) {
    //       this.buttonAktifPanggilRow = true;
    //     }
    //   }
    });

    this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/findKdStatusAntrianDefault').subscribe(table => {
      this.kdStatusDefault = table.kdStatusAntrian;
    });





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
        this.httpService.post(Configuration.get().klinik1Java + '/viewerRawatJalanController/panggilAntrianUlang?', data).subscribe(response => {
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

  panggilNext() {
    this.kdAntrianNowSendiri = null;
    if (this.antrianSekarang.kdAntrianNow != undefined) {
      this.kdAntrianNowSendiri = this.antrianSekarang.kdAntrianNow;
    }
    //if (this.statusViewerAktif) {
      this.httpService.post(Configuration.get().klinik1Java + '/viewerRawatJalanController/panggilAntrian?', {
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

  filterData(event, fromField) {

    if (fromField == 'noAntrian') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&noAntrian=' + event + '&noRegistrasi=' + this.noRegistrasiFilter + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'noRegistrasi') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&noRegistrasi=' + event +'&noAntrian=' + this.noAntrianFilter + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir +'&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'noCm') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&noCm=' + event + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir +'&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }
   
    if (fromField == 'namaPasien') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&namaPasien=' + event + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'jk') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.jenisKelaminFilterMulti = "";
      if (this.jenisKelaminFilter.length > 0) {
        for (let i = 0; i < this.jenisKelaminFilter.length; i++) {
          this.jenisKelaminFilterMulti += "&kdJenisKelamin[]=" + this.jenisKelaminFilter[i].value.id_kode
        }
      }
      this.pencarian = this.jenisKelaminFilterMulti + this.statusPasienFilterMulti + this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir +'&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'tglLahir') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if(this.tglLahirFilter !== null && this.tglLahirFilter !== ""){
        tglLahir = this.setTimeStamp(event);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + '&noCm=' + this.noCMFilter + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'tglRegistrasi') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if(this.tglLahirFilter){
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter !== null && this.tglRegFilter !== "") {
        tglReg = this.setTimeStamp(event);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + '&noCm=' + this.noCMFilter + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'tglPelayanan') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if(this.tglLahirFilter){
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter !== null && this.tglPelFilter !== "") {
        tglPel = this.setTimeStamp(event);
      }
      this.pencarian = '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + '&noCm=' + this.noCMFilter + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'statusPeriksa') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.statusAntrianFilterMulti = "";
      if (this.statusPeriksaFilter.length > 0) {
        for (let i = 0; i < this.statusPeriksaFilter.length; i++) {
          this.statusAntrianFilterMulti += "&kdStatus[]=" + this.statusPeriksaFilter[i].value.kdStatus
        }
      }
      this.pencarian = this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel +this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'kelompokPasien') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.kelompokPasienFilterMulti = "";
      if (this.kelompokPasienFilter.length > 0) {
        for (let i = 0; i < this.kelompokPasienFilter.length; i++) {
          this.kelompokPasienFilterMulti += "&kdKelompokKlien[]=" + this.kelompokPasienFilter[i].value.kode.kode
        }
      }
      this.pencarian = this.kelompokPasienFilterMulti + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'ruanganTujuan') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.namaRuanganTujuanFilterMulti = "";
      if (this.namaRuanganTujuanFilter.length > 0) {
        for (let i = 0; i < this.namaRuanganTujuanFilter.length; i++) {
          this.namaRuanganTujuanFilterMulti += "&kdRuanganTujuan[]=" + this.namaRuanganTujuanFilter[i].value.kdRuanganTujuan
        }
      }
      this.pencarian = this.namaRuanganTujuanFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.statusAntrianFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }
    
    if (fromField == 'namaDokter') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.namaDokterFilterMulti = "";
      if (this.namaDokterFilter.length > 0) {
        for (let i = 0; i < this.namaDokterFilter.length; i++) {
          this.namaDokterFilterMulti += "&kdPegawai[]=" + this.namaDokterFilter[i].value.kdPegawai
        }
      }
      this.pencarian = this.namaDokterFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusAntrianFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    if (fromField == 'statusPasien') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.statusPasienFilterMulti = "";
      if (this.statusPasienFilter.length > 0) {
        for (let i = 0; i < this.statusPasienFilter.length; i++) {
          this.statusPasienFilterMulti += "&kdStatusPasien[]=" + this.statusPasienFilter[i].value.id
        }
      }
      this.pencarian = this.statusPasienFilterMulti + this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }


    if (fromField == 'alamatLengkap') {
      let tglLahir = '';
      let tglReg = '';
      let tglPel ='';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      if (this.tglRegFilter) {
        tglReg = this.setTimeStamp(this.tglRegFilter);
      }
      if (this.tglPelFilter) {
        tglPel = this.setTimeStamp(this.tglPelFilter);
      }
      this.pencarian = '&alamat=' + event + '&noCm=' + this.noCMFilter + '&namaPasien=' + this.namaPasienFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.statusAntrianFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&tglLahir=' + tglLahir + '&tglRegistrasi=' + tglReg + '&tglPelayananAwal=' + tglPel + this.jenisKelaminFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    }

    

    // if (fromField == 'statusAntrian') {
    //   let tglLahir = '';
    // let tglReg = '';
    // let tglPel ='';
    //   if (this.tglLahirFilter) {
    //     tglLahir = this.setTimeStamp(this.tglLahirFilter);
    //   }
    // if (this.tglRegFilter) {
    //   tglReg = this.setTimeStamp(this.tglRegFilter);
    // }
    // if (this.tglPelFilter) {
    //   tglPel = this.setTimeStamp(this.tglPelFilter);
    // }
    //   this.statusAntrianFilterMulti = "";
    //   if (this.statusAntrianFilter.length > 0) {
    //     for (let i = 0; i < this.statusAntrianFilter.length; i++) {
    //       this.statusAntrianFilterMulti += "&kdStatus[]=" + this.statusAntrianFilter[i].value.kdStatus
    //     }
    //   }
    //   this.pencarian = this.statusAntrianFilterMulti + '&namaPasien=' + this.namaPasienFilter + '&noCm=' + this.noCMFilter + '&noAntrian=' + this.noAntrianFilter + '&noRegistrasi=' + this.noRegistrasiFilter + this.kelompokPasienFilterMulti + this.namaDokterFilterMulti + this.namaRuanganTujuanFilterMulti + this.statusPasienFilterMulti + '&alamat=' + this.alamatLengkapFilter + '&tglLahir=' + tglLahir + this.jenisKelaminFilterMulti;
    //   this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    // }


  }

  keMasukRuangan(){

  }

  reset(){
    
  }

  clearPencarian() {
    this.ngOnInit();
  }

  cari() {
    this.getService(this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir))
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
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
    this.httpService.post(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/batal?', data).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dibatalkan');
      this.batalDialog = false;
    });
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
      this.httpService.post(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/getProsesUlangManual?', data).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diaktifkan');
        this.antrianAktifDialog = false;
      });
    }
  }

  clear() {
    //clearInterval(this.statusLoketPing);
    //this.socket.con();
  }


cekStatusLoket() {


//get login ruangan dari yang login pake service backend
this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/mapRuanganLoginToRuanganPelayanan').subscribe(table => {
  this.daftarRuanganLogin = []
  this.daftarRuanganLogin = table;
  this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/findAntrianRegistrasiRawatJalan?page=' + this.page + '&rows=' + this.rows + '&dir=' + '' + '&sort=' + '' + '' + '&tglAwal=' + this.setTimeStamp(this.tanggalAwal) + '&tglAkhir=' + this.setTimeStamp(this.tanggalAkhir)).subscribe(table => {
    this.statusLoket = table.statusOnline;
  
  //this.statusLoketPing = setInterval(() => {
    if (this.statusLoket) {
      
        // let dataRuangan = [];
        // for (var i = 0; i < table.length; i++) {
        //   dataRuangan.push({ 
        //     kdRuangan: table[i].kdRuanganPelayanan,
        //     status: this.statusLoket,
        //     unik:this.identitas
        //   });
        // };
        // this.socket.emit('klinik.monitoring.pelayanan.status.loket.'+this.authGuard.getUserDto().kdProfile,dataRuangan);

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


      // if (this.rule.isPanggilanByPass == 1) {
      //   this.buttonAktifPanggilRow = false;
      // } else {
      //   this.buttonAktifPanggilRow = true;
      // }

        this.buttonAktifPanggilRow = false;


    } 
    //else {
      // let dataRuangan = [];
      //     for (var i = 0; i < table.length; i++) {
      //       dataRuangan.push({ 
      //         kdRuangan: table[i].kdRuanganPelayanan,
      //         status: this.statusLoket,
      //         unik:this.identitas
      //       });
      //     };
      //     this.socket.emit('klinik.monitoring.pelayanan.status.loket.'+this.authGuard.getUserDto().kdProfile,dataRuangan);
          
      // this.buttonAktif = true;
      // this.buttonAktifPanggilRow = true;
      // this.buttonAktifPanggilUlang = true;

    //}
  //}, 3000);
  });
});


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

panggilRow(event) {
  let kdAntrianBefore = null;
  if (this.antrianSekarang.kdAntrianNow != undefined) {
    kdAntrianBefore = this.antrianSekarang.kdAntrianNow;
  }
  //if (this.statusViewerAktif) {
    //berarti dto nya tambah ruangan nya yah
    let data = {
      "kdAntrian": event.kdAntrian,
      "tglAkhir": this.setTimeStamp(this.tanggalAkhir),
      "tglAwal": this.setTimeStamp(this.tanggalAwal),
      "kdAntrianBefore": kdAntrianBefore
    }
    this.httpService.post(Configuration.get().klinik1Java + '/viewerRawatJalanController/panggilAntrianPerRow?', data).subscribe(response => {
      this.antrianSekarang = response;
      this.alertService.success('Berhasil', 'Data Berhasil Dipanggil');
      this.batalDialog = false;
    });

  // } else {
  //   this.alertService.warn('Peringatan', 'Cek Koneksi Viewer Antrian');
  // }
}

masukRuangan(event) {
  localStorage.setItem('dataPelayananMasuk', JSON.stringify(event));
  this.routes.navigate(['masuk-ruangan']);
}

showBar() {
  this.styleSidebar = { 'margin-top': '134px', 'margin-right': '29px', 'height': 'auto', 'max-height':'85%' };
  //this.iconSideBar = "fa fa-angle-left";
  document.getElementById("hide").style.visibility = 'visible';
  this.sidebar = true;
  //this.uiGrid = 11;
}

hideBar() {
  this.styleSidebar = { 'margin-top': '134px', 'margin-right': '29px', 'height': 'auto', 'max-height':'85%' };
  //this.iconSideBar = "fa fa-angle-right";
  document.getElementById("hide").style.visibility = 'hidden';
  this.sidebar = false;
  //this.uiGrid = 12;
}

handleChange(e){
  let statusLoketP = e.checked;
  if(this.statusLoket){

     //ini yang ON
     this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/setStatusMonitoringOnline').toPromise()
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

      // if (this.rule.isPanggilanByPass == 1) {
      //   this.buttonAktifPanggilRow = false;
      // } else {
      //   this.buttonAktifPanggilRow = true;
      // }

      this.buttonAktifPanggilRow = false;
    //panggil side show
    //this.showBar();
  }else{
     //ini yang OFF
     this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/setStatusMonitoringOffline').subscribe(table => {
    });

    this.buttonAktif = true;
    this.buttonAktifPanggilRow = true;
    this.buttonAktifPanggilUlang = true;
    //tutup side show
    //this.hideBar();
  }
}

handleChangeSide(status,index,data){

  let kdRuanganPelayanan = data.kdRuanganPelayanan;
  this.httpService.get(Configuration.get().klinik1Java + '/monitoringAntrianRawatJalanController/updateStatusOflineOnline?kdRuanganPelayanan='+kdRuanganPelayanan).subscribe(table => {
  });
}






}
