import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit, ChangeDetectorRef  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, Authentication, AuthGuard, AlertService, InfoService, Configuration, ReportService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ViewChildren,ElementRef,ViewChild } from '@angular/core';
import 'rxjs/add/operator/timeout';

@Injectable()
@Component({
  selector: 'app-viewer-pelayanan',
  templateUrl: './viewer-pelayanan.component.html',
  styleUrls: ['./viewer-pelayanan.component.scss']
})
export class ViewerPelayananComponent implements OnInit, OnDestroy, AfterViewInit {
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
  dataPanggil:any;
  ruanganAktif:any;


  @ViewChildren('cmp') videoplayer: any;
  @ViewChildren('audioDingDong') audioPlayer: any;
  @ViewChildren('klikSuara') klikSuara: ElementRef;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  constructor(
    private authGuard: AuthGuard,
    private httpService: HttpClient,
    private rowNumberService: RowNumberService,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService,
  ) { 
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

    this.pingViewer = setInterval(() => {

      this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/setStatusAntrianOnline').subscribe(table => {
      });

      // if (this.statusKonek) {
      //   this.socket.emit('klinik.viewer.pelayanan.monitoring.ping.'+this.authGuard.getUserDto().kdProfile, this.statusKonek);
      // } else {
      //   clearInterval(this.pingViewer);
      // }
      if (this.Loket.length != 0) {
        this.setWidthGridLoket();
      }
    }, 3000);
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
    this.socket.emit('klinik.viewer.pelayanan.monitoring.ping.'+this.authGuard.getUserDto().kdProfile, this.statusKonek);
    // this.socket.dis();
     this.clear();
  }

  ngOnInit() {
     //pertama kali
     this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/setStatusAntrianOnline').subscribe(table => {
    });

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

    this.getServices(tanggalAwal, tanggalAkhir);
    this.getPage(this.page, this.rows, '', '', '', this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    this.socket.on('klinik.viewer.pelayanan.client.'+this.authGuard.getUserDto().kdProfile, (data:any,ob:any)=>{this.responSocketPanggilNext(data,ob);}, this);
    this.socket.emit('kdProfile', this.authGuard.getUserDto().kdProfile);
    this.socket.on('klinik.monitoring.pelayanan.registrasi.batal.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketBatalService, this);
    //ini yang dari monitoring registrasi ke viewer antrian
    //this.socket.on('klinik.viewer.pelayanan.status.loket.'+this.authGuard.getUserDto().kdProfile, this.responSocketCekStatusLoket, this);
    //ini yang dari klinik.viewer.counter.server dapetin jumlah yang masuk / angka yang masuk
    this.getRuanganAktif();
    
    this.socket.on('klinik.viewer.pelayanan.counter.client.'+this.authGuard.getUserDto().kdProfile, this.responSocketCekCounterAntrian, this);

  }



  dingDongPlay(){
    let x = <HTMLAudioElement>  document.getElementById("myAudio");
    x.play();
  }

  triggerFalseKlikDingDong(){
    let elementD: HTMLElement = document.getElementById('suaraDingDong') as HTMLElement;
    elementD.click();
  }


  responSocketPanggilNext(data: any, ob: any) {
    //ob dari backend
    //data dari form ini 
    if (data.statusKonek) {
      this.dataPanggil = [];
      //data antrian masuk yang dari backend harusnya berisi ruangan yang membawahi ns1 misal ada ruangan apa aja , bentuk array
      console.log('Antrian Masuk : ' + ob);
      //index ini untuk dapetin data mana yang mau masuk ke antrian sesuai kdRuangan yang masuk
      let index = data.Loket.map(function (e) { return e.value.kdRuangan; }).indexOf(ob.kdRuanganTujuan);
   
      
      //yang ini jadinya ambill semua ruangan yang all
      this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/mapRuanganLoginToRuanganPelayananAll').subscribe(response => {
        data.listViewerAntrian = [];
        let dataRes = response;
        for(let x=0; x<dataRes.length;x++){
          //nantinya ada loopingan lagi cek si array kdRuangan yang banyak
          if(dataRes[x].kdRuanganPelayanan == ob.kdRuanganTujuan){
            data.listViewerAntrian = ob.antrianRegistrasiPelayananTake5;
            if (index != -1) {
              //ini loket mana yang mau dimasukin sesuai indexnya
              data.Loket[index].value.noAntrian = ob.noAntrianNow;
            }

            this.dataPanggil = ob;
            this.triggerFalseClick();
          }
        }

      });

    }
  }

  triggerFalseClick(){
    let element: HTMLElement = document.getElementById('suaraAuto') as HTMLElement;
    element.click();
  }

  SpechAuto(dataEvent: any){
  
    let data = this.dataPanggil;
    this.triggerFalseKlikDingDong();


    document.getElementById(data.kdRuanganTujuan + 'div').classList.add('blinkingDivBorder');
    document.getElementById(data.kdRuanganTujuan + 'loket').classList.add('blinking');
    document.getElementById(data.kdRuanganTujuan + 'noantrian').classList.add('blinking');
    setTimeout(() => {
      let res = "Nomor......Antrian......" + data.noAntrianNow.split("").toString().replace(/,/g, '......').replace(/0/g, 'Kosong') + "......Ke......" + data.namaRuanganTujuan.split(" ").toString().replace(/,/g, '......');
      
      this.textToSpech(res);
    }, 1000);
    setTimeout(() => {
      document.getElementById(data.kdRuanganTujuan + 'div').classList.remove('blinkingDivBorder');
      document.getElementById(data.kdRuanganTujuan + 'loket').classList.remove('blinking');
      document.getElementById(data.kdRuanganTujuan + 'noantrian').classList.remove('blinking');
    }, 5000);
    
  }

  pangilTextToSpeech(data) {

    document.getElementById(data.kdRuangan + 'div').classList.add('blinkingDivBorder');
    document.getElementById(data.kdRuangan + 'loket').classList.add('blinking');
    document.getElementById(data.kdRuangan + 'noantrian').classList.add('blinking');
    setTimeout(() => {
      let res = "Nomor......Antrian......" + data.noAntrianNow.split("").toString().replace(/,/g, '......').replace(/0/g, 'Kosong') + "......Ke......" + data.namaRuanganTujuan.split(" ").toString().replace(/,/g, '......');
      this.textToSpech(res);
    }, 1000);
    setTimeout(() => {
      document.getElementById(data.kdRuangan + 'div').classList.remove('blinkingDivBorder');
      document.getElementById(data.kdRuangan + 'loket').classList.remove('blinking');
      document.getElementById(data.kdRuangan + 'noantrian').classList.remove('blinking');
    }, 5000);

  }

  textToSpech(text) {
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'id-ID';
    window.speechSynthesis.speak(ut);
  }

  responSocketBatalService(ob: ViewerPelayananComponent, data: any) {
    console.log('Batal : ' + data);
    if (data !== '') {
      let index = ob.listViewerAntrian.map(function (e) { return e.kdAntrian; }).indexOf(data.kdAntrian);
      if (index != -1) {
        ob.listViewerAntrian[index].statusAntrian = data.namaStatus;
      }
    }

  }




  getRuanganAktif(){

    this.ruanganAktif = setInterval(() => {
    this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/getRuanganAktif').subscribe(table => {
      if(table.length != 0){
        for(let y=0; y < table.length; y++){
          for(let x=0; x < this.Loket.length; x++){
         
            if(table[y].kdRuanganPelayanan == this.Loket[x].value.kdRuangan){
               this.Loket[x].value.statusLoket = table[y].statusLoket;
            }
          }
        }
      }
    });
  },3000);

  }

  unik = 0;
  // responSocketCekStatusLoket(ob: ViewerPelayananComponent, data: any) {
  //   console.log('Status Loket : ' + data.kdRuangan + ' ' + data.status);

  //   if (data !== '') {
  //     let index = ob.Loket.map(function (e) { return e.value.kdRuangan; }).indexOf(data.kdRuangan);
  //     if (index != -1) {
  //       if (data.unik == undefined || data.unik == null){
  //         return;
  //       }

  //       if (data.unik == 0){
  //         ob.unik = 0
  //       }

  //       if (ob.unik <= data.unik){
  //         ob.unik = data.unik
  //         ob.Loket[index].value.statusLoket = data.status;
  //       }
  //     }

  //   }
    
  // }

  responSocketCekCounterAntrian(ob: ViewerPelayananComponent, data: any) {
    if (ob.statusKonek) {
      console.log('Conter Masuk : ' + data);
      ob.counter = data.counter
    }
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
    if (filterStatus.length == 4) {
      widthLoketGrid = '25%';
    }
    if (filterStatus.length > 4) {
      widthLoketGrid = '10%';
    }
    for (let i = 0; i < loketGrid.length; i++) {
      loketGrid[i].style.width = widthLoketGrid;
    }
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

}

}


clear() {
  clearInterval(this.nextnext);
  clearInterval(this.pingViewer);
  clearInterval(this.ruanganAktif);
  //this.socket.con();
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

setTimeStamp(date) {
  if (date == null || date == undefined || date == '') {
    let dataTimeStamp = (new Date().getTime() / 1000);
    return dataTimeStamp.toFixed(0);
  } else {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp.toFixed(0);
  }
}

getServices(tglAwal, tglAkhir) {
  //viewer
  //getLoketAtauRuangan
  this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/mapRuanganLoginToRuanganPelayananAll').subscribe(table => {
    this.Loket = [];
    for (var i = 0; i < table.length; i++) {
      this.Loket.push({ label: table[i].namaRuanganPelayanan, value: { kdRuangan: table[i].kdRuanganPelayanan, noAntrian: null, statusLoket: false } })
    };
  });

  this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
    this.smbrFileLogo = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
  });

  //getTagline
  this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/getProfileHistoriStms').subscribe(table => {
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

  //getCounter
  this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/getCounter').subscribe(table => {
    this.counter = table.counter;
  });


}

getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any) {
  this.httpService.get(Configuration.get().klinik1Java + '/viewerRawatJalanController/getAntrianRegistrasiPelayananListTake5?periodeAwal=' + tglAwal + '&periodeAkhir=' + tglAkhir).subscribe(table => {
    this.listViewerAntrian = [];
    // this.listViewerAntrian = [
    //   {
    //     "namaRuangan": "Poli Umum",
    //     "pasien": [
    //       {
    //         "namaJenisKelamin": "Perempuan",
    //         "kdAntrian": 358,
    //         "statusAntrian": "Panggilan Ke   11",
    //         "tglAntrian": 1574306064,
    //         "tglPelayananAwal": 1574306064,
    //         "tglPelayananAkhir": 1574306064,
    //         "noAntrian": "UMM-02-0031",
    //         "namaKelompokKlien": "Umum",
    //         "noUrutPanggilan": 3,
    //         "namaRuanganTujuan": "Poli Umum",
    //         "tglLahir": 616266000,
    //         "kdStatusAntrian": 70,
    //         "alamatLengkap": "Jalan Gagak Dalam II No. 274/144C RT 008/001,Desa/Kel Karangmulya,Kecamatan Bojongmangu,Kab.Bekasi,Jawa Barat,17356",
    //         "panggilanKe": 11,
    //         "noRetur": "-",
    //         "noCM": "RM-11-0032",
    //         "kodeExternalJenisKelamin": "P",
    //         "namaDokter": "Julia  Roberts",
    //         "noRegistrasi": "1911200019",
    //         "kdRuanganTujuan": "006",
    //         "namaPasien": "Angelina Jolie"
    //       },
    //       {
    //         "namaJenisKelamin": "Perempuan",
    //         "kdAntrian": 359,
    //         "statusAntrian": "Belum Dipanggil",
    //         "tglAntrian": 1574306064,
    //         "tglPelayananAwal": 1574306064,
    //         "tglPelayananAkhir": 1574306064,
    //         "noAntrian": "UMM-0032",
    //         "namaKelompokKlien": "Umum",
    //         "noUrutPanggilan": 4,
    //         "namaRuanganTujuan": "Poli Umum",
    //         "tglLahir": 616266000,
    //         "kdStatusAntrian": 79,
    //         "alamatLengkap": "Jalan Gagak Dalam II No. 274/144C RT 008/001,Desa/Kel Karangmulya,Kecamatan Bojongmangu,Kab.Bekasi,Jawa Barat,17356",
    //         "panggilanKe": 6,
    //         "noRetur": "-",
    //         "noCM": "RM-11-0032",
    //         "kodeExternalJenisKelamin": "P",
    //         "namaDokter": "-",
    //         "noRegistrasi": "1911200020",
    //         "kdRuanganTujuan": "006",
    //         "namaPasien": "Angelina Jolie"
    //       }
    //     ]
    //   },
    //   {
    //     "namaRuangan": "Poli Gigi",
    //     "pasien": [
    //       {
    //         "namaJenisKelamin": "Perempuan",
    //         "kdAntrian": 362,
    //         "statusAntrian": "Panggilan Ke   8",
    //         "tglAntrian": 1574306064,
    //         "tglPelayananAwal": 1574306064,
    //         "tglPelayananAkhir": 1574306064,
    //         "noAntrian": "GG-0031",
    //         "namaKelompokKlien": "Umum",
    //         "noUrutPanggilan": 7,
    //         "namaRuanganTujuan": "Poli Gigi",
    //         "tglLahir": 709923600,
    //         "kdStatusAntrian": 70,
    //         "alamatLengkap": "Jalan jalan jalan ABCDEFGHIJKLMNOPQRTSTUVW RT 001/001,Desa/Kel Air Kuang,Kecamatan Jebus,Kab.Bangka Barat,Bangka Belitung,33362",
    //         "panggilanKe": 8,
    //         "noRetur": "-",
    //         "noCM": "RM-11-0033",
    //         "kodeExternalJenisKelamin": "P",
    //         "namaDokter": "-",
    //         "noRegistrasi": "1911200023",
    //         "kdRuanganTujuan": "008",
    //         "namaPasien": "Barbie Kumalasari"
    //       },
    //       {
    //         "namaJenisKelamin": "Perempuan",
    //         "kdAntrian": 363,
    //         "statusAntrian": "Panggilan Ke   6",
    //         "tglAntrian": 1574306064,
    //         "tglPelayananAwal": 1574306064,
    //         "tglPelayananAkhir": 1574306064,
    //         "noAntrian": "GG-02-0032",
    //         "namaKelompokKlien": "Umum",
    //         "noUrutPanggilan": 8,
    //         "namaRuanganTujuan": "Poli Gigi",
    //         "tglLahir": 709923600,
    //         "kdStatusAntrian": 70,
    //         "alamatLengkap": "Jalan jalan jalan ABCDEFGHIJKLMNOPQRTSTUVW RT 001/001,Desa/Kel Air Kuang,Kecamatan Jebus,Kab.Bangka Barat,Bangka Belitung,33362",
    //         "panggilanKe": 6,
    //         "noRetur": "-",
    //         "noCM": "RM-11-0033",
    //         "kodeExternalJenisKelamin": "P",
    //         "namaDokter": "Cantika",
    //         "noRegistrasi": "1911200024",
    //         "kdRuanganTujuan": "008",
    //         "namaPasien": "Barbie Kumalasari"
    //       }
    //     ]
    //   },
    //   {
    //     "namaRuangan": "Poli Syaraf",
    //     "pasien": [
    //       {
    //         "namaJenisKelamin": "Perempuan",
    //         "kdAntrian": 365,
    //         "statusAntrian": "Belum Dipanggil",
    //         "tglAntrian": 1574306064,
    //         "tglPelayananAwal": 1574306064,
    //         "tglPelayananAkhir": 1574306064,
    //         "noAntrian": "SYF-02-0092",
    //         "namaKelompokKlien": "Umum",
    //         "noUrutPanggilan": 10,
    //         "namaRuanganTujuan": "Poli Syaraf",
    //         "tglLahir": 616266000,
    //         "kdStatusAntrian": 79,
    //         "alamatLengkap": "Jalan Gagak Dalam II No. 274/144C RT 008/001,Desa/Kel Karangmulya,Kecamatan Bojongmangu,Kab.Bekasi,Jawa Barat,17356",
    //         "panggilanKe": 1,
    //         "noRetur": "-",
    //         "noCM": "RM-11-0032",
    //         "kodeExternalJenisKelamin": "P",
    //         "namaDokter": "Steven Rogers",
    //         "noRegistrasi": "1911200026",
    //         "kdRuanganTujuan": "101",
    //         "namaPasien": "Angelina Jolie"
    //       },
    //       {
    //         "namaJenisKelamin": "Perempuan",
    //         "kdAntrian": 366,
    //         "statusAntrian": "Belum Dipanggil",
    //         "tglAntrian": 1574306064,
    //         "tglPelayananAwal": 1574306064,
    //         "tglPelayananAkhir": 1574306064,
    //         "noAntrian": "SYF-01-0038",
    //         "namaKelompokKlien": "Umum",
    //         "noUrutPanggilan": 11,
    //         "namaRuanganTujuan": "Poli Syaraf",
    //         "tglLahir": 616266000,
    //         "kdStatusAntrian": 79,
    //         "alamatLengkap": "Jalan Gagak Dalam II No. 274/144C RT 008/001,Desa/Kel Karangmulya,Kecamatan Bojongmangu,Kab.Bekasi,Jawa Barat,17356",
    //         "panggilanKe": 3,
    //         "noRetur": "-",
    //         "noCM": "RM-11-0032",
    //         "kodeExternalJenisKelamin": "P",
    //         "namaDokter": "dr. Ahmad",
    //         "noRegistrasi": "1911200027",
    //         "kdRuanganTujuan": "101",
    //         "namaPasien": "Angelina Jolie"
    //       }
    //     ]
    //   }
    // ]

    //this.listViewerAntrian = this.rowNumberService.addRowNumber(page, rows, table);
  });
}





}
