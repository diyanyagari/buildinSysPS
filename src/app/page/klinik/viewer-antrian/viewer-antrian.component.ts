import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit, ChangeDetectorRef, Renderer } from '@angular/core';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, UserDto, Authentication, AuthGuard, SettingsService, AlertService, InfoService, Configuration, ReportService, SettingInfo, NotificationService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import 'rxjs/add/operator/timeout'
import { TimeoutError } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { viewClassName } from '@angular/compiler';

@Injectable()
@Component({
  selector: 'app-viewer-antrian',
  templateUrl: './viewer-antrian.component.html',
  styleUrls: ['./viewer-antrian.component.scss'],
})
export class ViewerAntrianComponent implements OnInit, OnDestroy, AfterViewInit {
  listViewerAntrian: any[];
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
  gambarLogoProfile: any;
  statusAntrianFilterMulti: any;
  kelompokPasienFilterMulti: any;
  namaRuanganTujuanFilterMulti: any;
  jenisKelaminFilterMulti: any;
  statusPasienFilterMulti: any;
  namaDokterFilterMulti: any;
  tanggalAwal: any;
  tanggalAkhir: any;

  cars: any[];
  Loket: any[];

  time: Date;
  public tanggal: any;
  public waktu: any;
  statusKonek: any;
  audio = new Audio();

  pingViewer: any;
  images: any[];
  next: any;
  duration: any;
  nextnext: any;
  widhtImgMax: any;
  smbrFileLogo: any;
  profileInfo: any;
  runningText: any;
  counter: any;
  kdDepartemen: any;
  dataCekRuangan:any[];
  hilang:any;
  dataPanggil:any;
  tempLoket:any[];
  ruanganAktif:any;
  //aud = new Audio ('../../../../assets/layout/sound/Dingdong.wav');

  @ViewChildren('cmp') videoplayer: any;
 // @ViewChildren('audioDingDong') audioPlayer: any;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  @ViewChildren('klikSuara') klikSuara: ElementRef;
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
    private eleRef: ElementRef,
    private renderer: Renderer,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    this.widhtImgMax = (screen.width * (50 / 100)) - 50 + 'px';


    setInterval(() => {
      let time = new Date();
      let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      let hari = dayNames[time.getDay()];
      let bulan = monthNames[time.getMonth()];
      this.tanggal = hari + ", " + time.getDate() + " " + bulan + " " + time.getFullYear();
      this.waktu = ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2);
    }, 1);

    //ini setiap viewer nyala terus kasih status true ke monitoring antrian registrasi
    this.pingViewer = setInterval(() => {
      this.httpService.get(Configuration.get().klinik1Java + '/viewerController/setStatusAntrianOnline').subscribe(table => {
      });
      // if (this.statusKonek) {
      //   this.socket.emit('klinik.viewer.monitoring.ping.'+this.authGuard.getUserDto().kdProfile, this.statusKonek);
      // } else {
      //   clearInterval(this.pingViewer);
      // }
      if (this.Loket.length != 0) {
        this.setWidthGridLoket();
      }
    }, 3000);

    // this.pingViewer = setTimeout(()=>{
    //   if (this.statusKonek) {
    //     this.socket.emit('klinik.viewer.monitoring.ping.'+this.authGuard.getUserDto().kdProfile, this.statusKonek);
    //   } else {
    //     clearTimeout(this.pingViewer);
    //   }
    //   if (this.Loket.length != 0) {
    //     this.setWidthGridLoket();
    //   }
    // },2000);

    var bodySetBackground = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodySetBackground.length; i++) {
      bodySetBackground[i].style.backgroundImage = 'url("../../../../assets/layout/images/klinik/background.jpg")';
    }

  }

  ngAfterViewInit() {
    if (this.Loket.length != 0) {
      this.setWidthGridLoket();
    }

    setTimeout(() => {
      this.onslide(0);
    }, 3000);
    //ini dipake ga yah ??
    //this.socket.on('klinik.viewer.ping', this.responSocketPing, this);
    // const audio: HTMLAudioElement = this.audioPlayer._results[0].nativeElement;
    // audio.currentTime = 0;
    // audio.pause();
    
    // const playPromise = audio.play();
    // if(playPromise !== null || playPromise !== undefined){
    //     try{
    //       audio.play();
    //     }catch(e){
    //       audio.play();
    //       //console.log(e);
    //     }
    // }

    this.triggerFalseKlikDingDong();

  }

  ngOnDestroy() {
    var bodySetBackground = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodySetBackground.length; i++) {
      bodySetBackground[i].style.backgroundColor = '#ecf0f5';
      bodySetBackground[i].style.backgroundImage = null;
    }
    var refactorLayout = document.getElementsByClassName('layout-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorLayout.length; i++) {
      refactorLayout[i].style.marginLeft = '60px';
      refactorLayout[i].style.padding = '60px 10px 0 10px';
    }
    document.getElementById("app-topbar").style.visibility = "visible";
    document.getElementById("app-sidebar").style.visibility = "visible";
    document.getElementById("app-footer").style.visibility = "visible";
    document.getElementById("pembatas").style.height = "45px";
    this.statusKonek = false;
    this.socket.emit('klinik.viewer.monitoring.ping.'+this.authGuard.getUserDto().kdProfile, this.statusKonek);
    this.socket.dis();
    this.clear();
  }

  ngOnInit() {

     //pertama kali
     this.httpService.get(Configuration.get().klinik1Java + '/viewerController/setStatusAntrianOnline').subscribe(table => {
    });


    this.hilang = false;
    this.kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
    this.runningText = {
      "noHistori": ' ',
      "keteranganLainnya": ' ',
      "taglineProfile": [],
      "messageToKlien": [],
      "version": ' ',
      "noRec": ' ',
      "statusEnabled": ' ',
      "sloganProfile": [],
      "tglAkhir": ' ',
      "kode": {
        "kdProfile": ' ',
        "noHistori": ' '
      },
      "semboyanProfile": [],
      "mottoProfile": [],
      "tglAwal": ' '
    };
    this.profileInfo = {
      namaLengkapProfile: this.authGuard.getNamaPerusahaan(),
    };
    this.duration = 1000;
    this.Loket = [];
    this.tempLoket = [];
    this.statusKonek = true;
    this.audio.src = "../../../../assets/layout/sound/Dingdong.wav";
    this.settingLayoutViewer();
    this.slideShow();

    this.tanggalAwal = new Date();
    this.tanggalAkhir = new Date();
    this.tanggalAwal.setHours(0, 0, 0, 0);
    let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
    let tanggalAwal = this.setTimeStamp(this.tanggalAwal);


    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      this.gambarLogoProfile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });

    // this.httpService.get(Configuration.get().klinik1Java + '/viewerController/mapRuanganLoginToRuanganPelayanan').subscribe(response => {
    //   this.dataCekRuangan = response;
    // });


    this.getServices(tanggalAwal, tanggalAkhir);
    this.getPage(this.page, this.rows, '', '', '', this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));

    //dapet data dari socket emit backend, untuk status konek 
    this.socket.on('klinik.viewer.client.'+this.authGuard.getUserDto().kdProfile, (data:any,ob:any)=>{this.responSocketPanggilNext2(data,ob);}, this);
    this.socket.emit('kdProfile', this.authGuard.getUserDto().kdProfile);
    this.socket.on('klinik.monitoring.antrian.registrasi.batal.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketBatalService, this);
    //ini yang dari monitoring registrasi ke viewer antrian
    //this.socket.on('klinik.viewer.status.loket.'+this.authGuard.getUserDto().kdProfile, this.responSocketCekStatusLoket, this);
    this.getRuanganAktif();
   
    //ini yang dari klinik.viewer.counter.server dapetin jumlah yang masuk / angka yang masuk
    this.socket.on('klinik.viewer.counter.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketCekCounterAntrian, this);

  }

  triggerFalseKlikDingDong(){
      let elementD: HTMLElement = document.getElementById('suaraDingDong') as HTMLElement;
      elementD.click();
  }

  dingDongPlay(){
    let x = <HTMLAudioElement>  document.getElementById("myAudio");
    x.play();
    //this.audioPlayerRef.nativeElement.play();
    // let audio = new Audio();
    // const audio: HTMLAudioElement = this.audioPlayer._results[0].nativeElement;
    // audio.src ="../../../../assets/layout/sound/Dingdong.wav";
    // audio.currentTime = 0;
    // audio.pause();
    // audio.load();
    // audio.play()
  }

  getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any) {
    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getAntrianRegistrasiMasukListTake5?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
      this.listViewerAntrian = [];

      this.listViewerAntrian = this.rowNumberService.addRowNumber(page, rows, table);
    });
  }

  getServices(tglAwal, tglAkhir) {
    //viewer
    //getLoketAtauRuangan, saya komen dulu
    // this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getRuanganByKdDepartemen').subscribe(table => {
    //   this.Loket = [];
    //   for (var i = 0; i < table.length; i++) {
    //     this.Loket.push({ label: table[i].namaRuangan, value: { kdRuangan: table[i].kdRuangan, noAntrian: null, statusLoket: false } })
    //   };
    // });

    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/mapRuanganLoginToRuanganPelayanan').subscribe(table => {
      this.Loket = [];
      for (var i = 0; i < table.length; i++) {
        this.Loket.push({ label: table[i].namaRuanganPelayanan, value: { kdRuangan: table[i].kdRuanganPelayanan, noAntrian: null, statusLoket: false } });
        this.tempLoket.push({ label: table[i].namaRuanganPelayanan, value: { kdRuangan: table[i].kdRuanganPelayanan, noAntrian: null, statusLoket: false } });
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
      // this.profileInfo=table;
      this.smbrFileLogo = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
    });

    //getTagline
    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getProfileHistoriStms').subscribe(table => {
      this.runningText.taglineProfile = [];
      this.runningText.messageToKlien = [];
      this.runningText.sloganProfile = [];
      this.runningText.semboyanProfile = [];
      this.runningText.mottoProfile = [];
      for (let i = 0; i < table.length; i++) {
        this.runningText.taglineProfile[i] = table[i].taglineProfile;
        this.runningText.messageToKlien[i] = table[i].messageToKlien;
        this.runningText.sloganProfile[i] = table[i].sloganProfile;
        this.runningText.semboyanProfile[i] = table[i].semboyanProfile;
        this.runningText.mottoProfile[i] = table[i].mottoProfile;
      }
    });

    // let table = [{
    //   "taglineProfile": 'taglineProfile',
    //   "messageToKlien": 'messageToKlien',
    //   "sloganProfile": 'sloganProfile',
    //   "semboyanProfile": 'semboyanProfile',
    //   "mottoProfile": 'mottoProfile',
    // },
    // {
    //   "taglineProfile": 'taglineProfile1',
    //   "messageToKlien": 'messageToKlien1',
    //   "sloganProfile": 'sloganProfile1',
    //   "semboyanProfile": 'semboyanProfile1',
    //   "mottoProfile": 'mottoProfile1',
    // }]
    // for (let i = 0; i < table.length; i++) {
    //   this.runningText.taglineProfile[i] =table[i].taglineProfile;
    //   this.runningText.messageToKlien[i]= table[i].messageToKlien;
    //   this.runningText.sloganProfile[i]= table[i].sloganProfile;
    //   this.runningText.semboyanProfile[i]= table[i].semboyanProfile;
    //   this.runningText.mottoProfile[i]= table[i].mottoProfile;
    // }

    //getCounter dikomen dulu karena ada yang dari soket ke counter
    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getCounter').subscribe(table => {
      this.counter = table.counter;
    });


  }




  responSocketPanggilNext2(data: any, ob: any) {
    //console.log(data.statusKonek);
    //data itu dari form component si viewer, kalo ob dari data backendnya/server socket
    if (data.statusKonek) {
      this.dataPanggil = [];
      console.log('Antrian Masuk : ' + data);
      let index = data.Loket.map(function (e) { return e.value.kdRuangan; }).indexOf(ob.kdRuangan);
   
      data.listViewerAntrian = [];
      this.httpService.get(Configuration.get().klinik1Java + '/viewerController/mapRuanganLoginToRuanganPelayanan').subscribe(response => {
        let dataRes = response;
        for(let x=0; x<dataRes.length;x++){
          if(dataRes[x].kdRuanganPelayanan == ob.kdRuangan){
            data.listViewerAntrian = ob.antrianRegistrasiMasukTake5;
            if (index != -1) {
              data.Loket[index].value.noAntrian = ob.noAntrianNow;
            }

            //data.pangilTextToSpeech(ob);
            this.dataPanggil = ob;
            this.triggerFalseClick();
            // this.SpechAuto(ob);
          }
        }

      });

    }
  }

  triggerFalseClick(){
    let element: HTMLElement = document.getElementById('suaraAuto') as HTMLElement;
    element.click();
    //this.klikSuara.nativeElement.dispatchEvent(event);
  }

  SpechAuto(dataEvent: any){
    console.log('tes');
    let data = this.dataPanggil;
    this.triggerFalseKlikDingDong();
    // const audio: HTMLAudioElement = this.audioPlayer._results[0].nativeElement;
    // audio.currentTime = 0;
    // audio.pause();
    // //audio.play();

    // const playPromise = audio.play();
    // if(playPromise !== null || playPromise !== undefined){
    //     try{
    //       audio.play();
    //     }catch(e){
    //       audio.play();
    //       //console.log(e);
    //     }
    // }


    document.getElementById(data.kdRuangan + 'div').classList.add('blinkingDivBorder');
    document.getElementById(data.kdRuangan + 'loket').classList.add('blinking');
    document.getElementById(data.kdRuangan + 'noantrian').classList.add('blinking');
    setTimeout(() => {
      let res = "Nomor......Antrian......" + data.noAntrianNow.split("").toString().replace(/,/g, '......').replace(/0/g, 'Kosong') + "......Ke......" + data.namaRuangan.split(" ").toString().replace(/,/g, '......');
      
      this.textToSpech(res);
    }, 1000);
    setTimeout(() => {
      document.getElementById(data.kdRuangan + 'div').classList.remove('blinkingDivBorder');
      document.getElementById(data.kdRuangan + 'loket').classList.remove('blinking');
      document.getElementById(data.kdRuangan + 'noantrian').classList.remove('blinking');
    }, 5000);
    
  }

  responSocketPanggilNext(ob: ViewerAntrianComponent, data: any ) {
    if (ob.statusKonek) {
          console.log('Antrian Masuk : ' + data);
          let index = ob.Loket.map(function (e) { return e.value.kdRuangan; }).indexOf(data.kdRuangan);
       
          ob.listViewerAntrian = [];

            // for(let x=0; x<this.dataCekRuangan.length;x++){
            //   if(this.dataCekRuangan[x].kdRuanganPelayanan == data.kdRuangan){
                ob.listViewerAntrian = data.antrianRegistrasiMasukTake5;
                // if (index != -1) {
                //   ob.Loket[index].value.noAntrian = data.noAntrianNow;
                // }
    
                ob.pangilTextToSpeech(data);
                
              // }
            // }

    
        }
  }

  // responSocketPing(ob: ViewerAntrianComponent, data: any) {
  //   console.log('Ada Ping dari monitoring: ' + data);
  //   ob.socket.emit('klinik.viewer.monitoring.ping.'+this.authGuard.getUserDto().kdProfile, ob.statusKonek);
  // }


  //respon ini untuk menampilkan loket yang muncuk ke viewer saat di on kan di monitoring nya

  unik = 0;

  getRuanganAktif(){

   

    this.ruanganAktif = setInterval(() => {
      this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getRuanganAktif').subscribe(table => {
          //  if(table.length != 0){
          //   let index = this.Loket.map(function (e) { return e.value.kdRuangan; }).indexOf(table.kdRuangan);
          //   this.Loket[index].value.statusLoket = table.statusLoket;
          //  }

        //dapetin nilai pertama kali jangan dirubah;
        // this.getDataTetap();

        // const dataTemp = this.tempLoket;
        // this.Loket = dataTemp;
        if(table.length != 0){
          for(let y=0; y < table.length; y++){
            for(let x=0; x < this.Loket.length; x++){
              if(table[y].kdRuanganPelayanan == this.Loket[x].value.kdRuangan){
                 this.Loket[x].value.statusLoket = table[y].statusLoket;
              }
            }
          }
        }
        // else if(table.length == 0){
        //   for(let z=0; z < this.Loket.length; z++){
        //     if(this.Loket[z].value.statusLoket == true){
        //       this.Loket[z].value.statusLoket = false;
        //     }
        //   }
        // }
        
      });

      
    },3000);
  }

  getDataTetap(){
    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/mapRuanganLoginToRuanganPelayanan').subscribe(table => {
      this.tempLoket = [];
      for (var i = 0; i < table.length; i++) {
        this.tempLoket.push({ label: table[i].namaRuanganPelayanan, value: { kdRuangan: table[i].kdRuanganPelayanan, noAntrian: null, statusLoket: false } });
      };
    });
  }

  responSocketCekStatusLoket(ob: ViewerAntrianComponent, data: any) {
    console.log('Status Loket : ' + data.kdRuangan + ' ' + data.status);
    if (data !== '') {
      let index = ob.Loket.map(function (e) { return e.value.kdRuangan; }).indexOf(data.kdRuangan);
      if (index != -1) {

        if (data.unik == undefined || data.unik == null){
          return;
        }

        if (data.unik == 0){
          ob.unik = 0
        }

        if (ob.unik <= data.unik){
          ob.unik = data.unik
          ob.Loket[index].value.statusLoket = data.status;
        }
      }
    }
  }

  responSocketBatalService(ob: ViewerAntrianComponent, data: any) {
    console.log('Batal : ' + data);
    if (data !== '') {
      let index = ob.listViewerAntrian.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrian);
      if (index != -1) {
        ob.listViewerAntrian[index].statusAntrian = data.namaStatus;
      }
    }

  }

  responSocketCekCounterAntrian(ob: ViewerAntrianComponent, data: any) {
    if (ob.statusKonek) {
      console.log('Conter Masuk : ' + data);
      ob.counter = data.counter
    }
  }
  pangilTextToSpeech(data) {
    // const audio: HTMLAudioElement = this.audioPlayer._results[0].nativeElement;
    // audio.currentTime = 0;
    // audio.pause();
    //audio.play();

    // const playPromise = audio.play();
    // if(playPromise !== null || playPromise !== undefined){
    //     try{
    //       audio.play();
    //     }catch(e){
    //       audio.play();
    //       //console.log(e);
    //     }
    // }


    document.getElementById(data.kdRuangan + 'div').classList.add('blinkingDivBorder');
    document.getElementById(data.kdRuangan + 'loket').classList.add('blinking');
    document.getElementById(data.kdRuangan + 'noantrian').classList.add('blinking');
    setTimeout(() => {
      let res = "Nomor......Antrian......" + data.noAntrianNow.split("").toString().replace(/,/g, '......').replace(/0/g, 'Kosong') + "......Ke......" + data.namaRuangan.split(" ").toString().replace(/,/g, '......');
      
      this.textToSpech(res);
    }, 1000);
    setTimeout(() => {
      document.getElementById(data.kdRuangan + 'div').classList.remove('blinkingDivBorder');
      document.getElementById(data.kdRuangan + 'loket').classList.remove('blinking');
      document.getElementById(data.kdRuangan + 'noantrian').classList.remove('blinking');
    }, 5000);
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

  




  textToSpech(text) {
    const ut = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    //array yang bahasa indonesia id-ID ke 11 indexnya
    // ut.voice = voices[10];
    ut.lang = 'id-ID';
    window.speechSynthesis.speak(ut);
  }

  getSelected(rowData) {
    return rowData.style ? 'batal-bg' : '';
  }

  settingLayoutViewer() {
    var refactorLayout = document.getElementsByClassName('layout-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorLayout.length; i++) {
      refactorLayout[i].style.marginLeft = '0px';
      refactorLayout[i].style.padding = '0px 0px 0px 0px';
    }

    document.getElementById("app-topbar").style.visibility = "hidden";
    document.getElementById("app-sidebar").style.visibility = "hidden";
    document.getElementById("app-footer").style.visibility = "hidden";
    document.getElementById("pembatas").style.height = "0px";
  }


  setWidthGridLoket() {
    var loketGrid = document.getElementsByName('loket');
    let widthLoketGrid = '0%';
    let filterStatus = this.Loket.filter(function (el) {
      return el.value.statusLoket == true
    });
    if (filterStatus.length == 1) {
      widthLoketGrid = '100%';
    }
    if (filterStatus.length == 2) {
      widthLoketGrid = '50%';
    }
    if (filterStatus.length == 3) {
      widthLoketGrid = '33.33%';
    }
    if (filterStatus.length >= 4) {
      widthLoketGrid = '25%';
    }
    for (let i = 0; i < loketGrid.length; i++) {
      loketGrid[i].style.width = widthLoketGrid;
    }
  }
  clear() {
    clearInterval(this.nextnext);
    clearInterval(this.pingViewer);
    clearInterval(this.ruanganAktif)
    //clearTimeout(this.pingViewer);
    this.socket.con();
  }
  slideShow() {
    this.httpService.get(Configuration.get().klinik1Java + '/viewerController/getProfileConfigSlideShow').subscribe(table => {
      let data = []

      for (let i = 0; i < table.length; i++) {
        let src = null;
        let fileSearchExt = table[i].fileSSImageVideoPathFile.indexOf('.mp4');
        let type = null;
        if (fileSearchExt != -1) {
          src = Configuration.get().resourceFile + '/video/show/' + table[i].fileSSImageVideoPathFile + '?noProfile=true';
          type = 'video';
        } else {
          src = Configuration.get().resourceFile + '/image/show/' + table[i].fileSSImageVideoPathFile + '?noProfile=true';
          type = 'image';
        }
        data[i] = {
          src: src,
          title: 'Pic' + i,
          type: type,
          duration: table[i].durasiLiveDetik,
          show: 'none',
          indexVidio: null,
          "noPosting": table[i].noPosting,
          "statusEnabled": table[i].statusEnabled,
          "noHistori": table[i].noHistori,
          "fileSSImageVideo": table[i].fileSSImageVideo,
          "fileSSImageVideoPathFile": table[i].fileSSImageVideoPathFile,
          "kode": {
            "kdProfile": table[i].kdProfile,
            "kdModulAplikasi": table[i].kdModulAplikasi,
            "kdRuangan": table[i].kdRuangan,
            "noPostingSS": table[i].noPostingSS,
            "noUrut": table[i].noUrut
          },
          "durasiLiveDetik": table[i].durasiLiveDetik,
          "version": table[i].version,
          "noRec": table[i].noRec,
          "noPlanning": table[i].noPlanning
        }
      }

      let indexImage = 0;
      this.images = [];
      for (let i = 0; i < data.length; i++) {
        this.images[i] = data[i];
        this.images[i].indexImage = i;
        if (data[i].type == 'video') {
          this.images[i].indexVidio = indexImage++;
        }

      }

    });


  }

  onMetadata(e, video, index) {
    this.images[index].duration = video.duration
    console.log('metadata: ', e);
    console.log('duration: ', this.images);
  }
  onslide(index) {
    if (index == undefined || index == null) {
      index = 0;
    }
    this.next = index + 1;
    let before = index - 1;

    var dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    if (this.next == this.images.length) {
      this.next = 0;
    }
    if (before > -1) {
      document.getElementById(this.images[before].title).style.display = 'none';
    }
    if (before == -1) {
      if(this.images.length != 0){
        document.getElementById(this.images[this.images.length - 1].title).style.display = 'none';
      }
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    for (let i = 0; i < dots.length; i++) {
      document.getElementById('' + i + '').style.width = this.widhtImgMax;
    }
    if(this.images.length != 0){
    document.getElementById(this.images[index].title).style.display = 'block';
    dots[index].className += " active";

    if (this.images[index].type == 'video') {
      for (let i = 0; i < this.videoplayer._results.length; i++) {
        const video: HTMLVideoElement = this.videoplayer._results[i].nativeElement;
        if (i == this.images[index].indexVidio) {
          video.play();
          video.muted = true;
        } else {
          video.currentTime = 0;
          video.muted = true;
          video.pause();
        }
      }

    }

    this.duration = this.images[index].duration * 1000;
    if (this.duration == null || this.duration == undefined || this.duration == 0) {
      this.duration = 5 * 1000;
    }
    if (this.nextnext != undefined) {
      clearInterval(this.nextnext);
    }
    this.interval(this.duration);
    }

  }



  interval(duration) {
    this.nextnext = setInterval(() => {
      this.onslide(this.next);
    }, duration);
  }
}
