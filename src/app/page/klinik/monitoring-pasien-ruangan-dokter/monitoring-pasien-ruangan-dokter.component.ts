import { Component, OnInit, Inject, forwardRef, Injectable, OnDestroy, AfterViewInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, Authentication, AuthGuard, CalculatorAgeService, AlertService, InfoService, Configuration, ReportService, PrinterService, RowNumberService } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../global/service/socket.service';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/timeout'
import { ChangeDetectorRef } from '@angular/core';
import { JS2JPrint } from '../../../global/print/js2jprint/js2jprint';

@Injectable()
@Component({
  selector: 'app-monitoring-pasien-ruangan-dokter',
  templateUrl: './monitoring-pasien-ruangan-dokter.component.html',
  styleUrls: ['./monitoring-pasien-ruangan-dokter.component.scss'],
  host: { '(window:keydown)': 'doSomething($event)' }
})
export class MonitoringPasienRuanganDokterComponent implements AfterViewInit, OnInit, OnDestroy {
  page: number;
  rows: number;
  filter: string;
  sortBy: any;
  typeSort: any;
  sortF: any;
  sortO: any;
  totalRecords: any;
  listMonitoring: any[];
  items: any;
  blockedPanel: boolean;
  totalRow: any;
  totalRows: any;
  hotkey: any;
  hotkeyLabel: any;
  profile: any;
  kdDepartemen: any;
  buttonAktif: boolean;
  widthScreen: any;

  noRegFilter:any;
  namaPasienFilter:any;
  namaPasienLFilter:any;
  noCMFilter: any;
  jenisKelaminFilter: any[];
  umurFilter: any;
  kelasFilter: any[];
  kasusPenyakitFilter: any[];
  dokterFilter: any[];
  jenisPasienFilter: any[];
  tglLahirFilter:any;
  kamarFilter:any[];
  bedFilter:any[];

  kondisiPasienFilter:any[];
  statusKeluarFilter:any[];
  alamatLengkapFilter:any;
  statusPasienFilter:any[];
  statusPasienFilterMulti:any;
  kondisiPasienFilterMulti:any;
  statusKeluarFilterMulti:any;
  bedFilterMulti:any;
  jenisKelaminFilterMulti: any;
  //umurFilterMulti: any;
  kelasFilterMulti: any;
  kamarFilterMulti:any;
  kasusPenyakitFilterMulti: any;
  dokterFilterMulti: any;
  jenisPasienFilterMulti: any;
  tglLahirFilterMulti:any;
  tglLahirTitle: any;

  tanggalAwal: any;
  tanggalAkhir: any;
  rangeTahun: any;
  pencarian:string;

  listKondisiPasien:any[];
  listStatusKeluar:any[];
  listStatusPasien:any[];
  listBed:any[];
  listKamar:any[];
  listJenisKelamin: any[];
  listKelas: any[];
  listKasusPenyakit: any[];
  listDokter: any[];
  listJenisPasien: any[];

  constructor(
    private authGuard: AuthGuard,
    private httpService: HttpClient,
    private alertService: AlertService,
    private calculatorAge: CalculatorAgeService,
    private rowNumberService: RowNumberService,
    @Inject(forwardRef(() => SocketService)) private socket: SocketService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService,
    private printer: PrinterService,

  ) {
    this.widthScreen = screen.width - 799 - 120 + 'px';

    var bodyEdit = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodyEdit.length; i++) {
      bodyEdit[i].style.overflow = 'hidden';
    }

   }

  ngOnInit() {
    this.profile = this.authGuard.getUserDto();
    this.rangeTahun = (new Date().getFullYear() - 150) + ':' + (new Date().getFullYear());
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = 50;
    }

    this.tanggalAwal = new Date();
    this.tanggalAkhir = new Date();
    this.tanggalAwal.setHours(0, 0, 0, 0);
    // this.tanggalAkhir.setHours(23, 59, 0, 0);
    let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
    let tanggalAwal = this.setTimeStamp(this.tanggalAwal);

    this.hotkey = '';
    this.pencarian = '';
    this.filter = '';
    this.buttonAktif = false;
    this.blockedPanel = false;
    this.sortBy ='registrasiPelayanan.noRegistrasi';
    this.typeSort = 'asc';
    this.items = [];

    this.noRegFilter = '';
    this.namaPasienFilter ='';
    this.namaPasienLFilter='';
    this.noCMFilter = '';
    this.tglLahirFilter = '';
    this.alamatLengkapFilter = '';

    this.listMonitoring = [];
    this.jenisKelaminFilter = [];
    this.umurFilter = {
      th: '',
      bl: '',
      hr: ''
    }
    this.kondisiPasienFilter = [];
    this.statusKeluarFilter = [];
    this.statusPasienFilter = [];
    this.bedFilter = [];
    this.kamarFilter = [];
    this.kelasFilter = [];
    this.kasusPenyakitFilter = [];
    this.dokterFilter = [];
    this.jenisPasienFilter = [];

    this.kondisiPasienFilterMulti = "";
    this.tglLahirFilterMulti = "";
    this.statusKeluarFilterMulti = "";
    this.statusPasienFilterMulti = "";
    this.bedFilterMulti = "";
    this.kamarFilterMulti = "";
    this.jenisPasienFilterMulti = "";
    this.jenisKelaminFilterMulti = "";
    this.kelasFilterMulti = "";
    this.kasusPenyakitFilterMulti = "";
    this.jenisKelaminFilterMulti = "";
    this.dokterFilterMulti="";

    this.getService(tanggalAwal,tanggalAkhir);


  }

  ngAfterViewInit() {
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

    var divMenuSplit = document.getElementsByClassName('ui-menu ui-menu-dynamic ui-widget ui-widget-content ui-corner-all ui-helper-clearfix ui-shadow ng-trigger ng-trigger-overlayState') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < divMenuSplit.length; i++) {
      divMenuSplit[i].style.width = '255px';
      divMenuSplit[i].style.fontSize = '12px';
      divMenuSplit[i].style.left = '-240px';
    }

    var menuList = document.getElementsByClassName('ui-menuitem-link ui-corner-all') as HTMLCollectionOf<HTMLElement>;
    console.log(menuList)
    for (let i = 0; i < menuList.length; i++) {
      menuList[i].style.width = '250px';
    }

    var footerPage = document.getElementsByClassName('ui-paginator-bottom ui-paginator ui-widget ui-widget-header ui-unselectable-text') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < footerPage.length; i++) {
      footerPage[i].style.marginTop = '15px';
    }

  }

  ngOnDestroy(){
    var bodyEdit = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodyEdit.length; i++) {
      bodyEdit[i].style.overflow = null;
    }
  }
  
  getPage(page: number, rows: number, search: any, sortBy: any, typeSort: any, tglAwal: any, tglAkhir: any){
    let cariPeriode = '';
    if (tglAwal && tglAkhir) {
      cariPeriode = '&tglAwalHari=' + this.setTimeStamp(tglAwal) + '&tglAkhirHari=' + this.setTimeStamp(tglAkhir)
    }
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/monitoringPasienRuangan?page=' + page + '&rows=' + rows + '&dir=' + sortBy + '&sort=' + typeSort + search + cariPeriode).subscribe(table => {
      this.listMonitoring = [];
      let list = [];
      for (let i = 0; i < table.listPasien.length; i++) {
        
        let potongAlamat;
        let alamatStr = table.listPasien[i].alamatLengkap;
        let alamatJum = table.listPasien[i].alamatLengkap;
        alamatJum = alamatJum.length;
        if(alamatJum > 86){
          potongAlamat = alamatStr.substring(0,86);
          potongAlamat = potongAlamat + '...';
        }else{
          potongAlamat = table.listPasien[i].alamatLengkap;
        }

        let dateLahir = new Date(table.listPasien[i].tglLahir * 1000);
        let age;
        age = this.calculatorAge.getUmurByDate(dateLahir.getDate(), dateLahir.getMonth(), dateLahir.getFullYear());

        list[i] = {
          
          "tglMasuk": table.listPasien[i].tglMasuk,
          "noRegistrasi":table.listPasien[i].noRegistrasi,
          "noCM": table.listPasien[i].noCMKontak,
          "namaLengkap": table.listPasien[i].namaLengkap,
          "kodeExternalJenisKelamin": table.listPasien[i].kodeExternal,
          "umurTh": age.years,
          "umurBln": age.months,
          "umurHr": age.days,
          "kelas":table.listPasien[i].namaKelas,
          "kasusPenyakit":table.listPasien[i].namaKasusPenyakit,
          "dokter":table.listPasien[i].namaDokter,
          "jenisPasien":table.listPasien[i].namaKelompokKlien,
          "kdDokter":table.listPasien[i].kdDokter,
          "kdJenisKelamin":table.listPasien[i].kdJenisKelamin,
          "kdKasusPenyakit":table.listPasien[i].kdKasusPenyakit,
          "kdKelas":table.listPasien[i].kdKelas,
          "kdKelompokKlien":table.listPasien[i].kdKelompokKlien,
          "tglLahir":table.listPasien[i].tglLahir,
          "statusPasien":table.listPasien[i].statusPasien,
          "alamatLengkap": potongAlamat,
          "tooltipAlamat": table.listPasien[i].alamatLengkap,

        }

      }
      this.alertService.success('Berhasil', 'Data Berhasil Ditampilkan');
      this.totalRecords = table.totalRow;
      this.totalRow = table.listPasien.length;
      this.listMonitoring = this.rowNumberService.addRowNumber(page, rows, list);

    })
  }

  getService(tglAwal,tglAkhir){
     //JenisKelamin
     this.httpService.get(Configuration.get().dataMaster + '/service/list-generic-negara/?table=JenisKelamin&select=namaJenisKelamin,id.kode').subscribe(res => {
      this.listJenisKelamin = [];
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisKelamin.push({ label: res.data.data[i].namaJenisKelamin, value: res.data.data[i] })
      };
    });

    //kelas
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/getKelasByTglAwalTglAkhir?periodeAwal='+tglAwal+'&periodeAkhir='+tglAkhir).subscribe(res => {
      this.listKelas = [];
      for (var i = 0; i < res.kelas.length; i++) {
        this.listKelas.push({ label: res.kelas[i].namaKelas, value: res.kelas[i] })
      };
    });

    //kasusPenyakit
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/getKasusPenyakitByTglAwalTglAkhir?periodeAwal='+tglAwal+'&periodeAkhir='+tglAkhir).subscribe(res => {
      this.listKasusPenyakit = [];
      for (var i = 0; i < res.kelas.length; i++) {
        this.listKasusPenyakit.push({ label: res.kelas[i].namaKasusPenyakit, value: res.kelas[i] })
      };
    });

    //dokter
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/getDokterByTglAwalTglAkhir?periodeAwal='+tglAwal+'&periodeAkhir='+ tglAkhir).subscribe(res => {
      this.listDokter = [];
      for (var i = 0; i < res.dokter.length; i++) {
        this.listDokter.push({ label: res.dokter[i].namaLengkap, value: res.dokter[i] })
      };
    });

    //jenis pasien
    this.httpService.get(Configuration.get().klinik1Java + '/masukRuangan/getKelompokKlienByTglAwalTglAkhir?periodeAwal='+tglAwal+'&periodeAkhir='+tglAkhir).subscribe(res => {
      this.listJenisPasien = [];
      for (var i = 0; i < res.kelas.length; i++) {
        this.listJenisPasien.push({ label: res.kelas[i].namaKelompokKlien, value: res.kelas[i] })
      };
    });

    //statusPasien
    this.listStatusPasien = [];
    this.listStatusPasien.push({ label: 'Baru', value: { id: 0, status: 'Baru' } });
    this.listStatusPasien.push({ label: 'Lama', value: { id: 1, status: 'Lama' } });


  }


  clearPencarian(){

  }

  cari(){
    this.getService(this.setTimeStamp(this.tanggalAwal), this.setTimeStamp(this.tanggalAkhir));
    this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
  }

  setTglPencarian(event, from){
    if (from == 'awal') {
      this.tanggalAwal = new Date(event);
      this.tanggalAwal.setHours(0, 0, 0, 0);
    } else {
      this.tanggalAkhir = new Date(event);
      this.tanggalAkhir.setHours(23, 59, 0, 0);
    }
  }

  sortingData(event){

    if(!event.order){
      this.sortBy = 'registrasiPelayanan.noRegistrasi';
      this.typeSort ='asc';
    }else{

      this.sortBy = event.field;
      if (event.field == 'noRegistrasi') {
        this.sortBy = 'registrasiPelayanan.noRegistrasi';
      }

      if (event.field == 'noCM') {
        this.sortBy = 'registrasiPelayanan.noCMKontak';
      }

      if (event.field == 'namaLengkap') {
        this.sortBy = 'pasien.namaLengkap';
      }

      if (event.field == 'kodeExternalJenisKelamin') {
        this.sortBy = 'jenisKelamin.namaJenisKelamin';
      }

      if (event.field == 'kelas') {
        this.sortBy = 'kelas.namaKelas';
      }

      if (event.field == 'kasusPenyakit') {
        this.sortBy = 'kasusPenyakit.namaKasusPenyakit';
      }

      if (event.field == 'dokter') {
        this.sortBy = 'dokter.namaLengkap';
      }

      if (event.field == 'jenisPasien') {
        this.sortBy = 'kelompokKlien.namaKelompokKlien';
      }

      if (event.field == 'umurTh') {
        this.sortBy = 'pasien.tglLahir';
      }

      if (event.order == 1) {
        this.typeSort = 'asc';
      } else {
        this.typeSort = 'desc';
      }

      if (event.field == 'tglLahir') {
        this.sortBy = 'pasien.tglLahir';
      }

      // if (event.field == 'noKamar') {
      //   this.sortBy = 'pasien.tglLahir';
      // }

      // if (event.field == 'noBed') {
      //   this.sortBy = 'pasien.tglLahir';
      // }

      if (event.field == 'statusPasien') {
        this.sortBy = 'registrasiPelayanan.statusKlien';
      }

      if (event.field == 'alamatLengkap') {
        this.sortBy = 'alamat.alamatLengkap';
      }

      // if (event.field == 'statusKeluar') {
      //   this.sortBy = 'pasien.tglLahir';
      // }

      // if (event.field == 'kondisiPasien') {
      //   this.sortBy = 'pasien.tglLahir';
      // }

      // if (event.field != 'number') {
      //   this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
      // }

    }

  }

  loadPage(event: LazyLoadEvent){
    this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
  }

  onRowSelect(){

  }

  filterData(event, fromField){

    if (fromField == 'noReg') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&namaPasien=' +this.namaPasienLFilter+'&noRegistrasi='+ event +'&noCm=' +this.noCMFilter+ this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti; 
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'noCm') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + event +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'namaPasien') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + event + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
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
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'tglLahir') {
      let tglLahir = '';
      if(this.tglLahirFilter !== null && this.tglLahirFilter !== ""){
        tglLahir = this.setTimeStamp(event);
      }
      // let time = new Date(event);
      // let dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      // var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      // let bulanAwal = monthNames[time.getMonth()];
      // let tanggalAwal = time.getDate() + " " + bulanAwal + " " + time.getFullYear();
      // this.tglLahirFilterMulti = '&tglLahirAwal=' + this.setTimeStamp(time.setHours(0, 0, 0, 0)) + '&tglLahirAkhir=' + this.setTimeStamp(time.setHours(23, 59, 0, 0));
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
  
    }

    if (fromField == 'umur') {
      let tglAwalN;
      let tglAkhirN;
      let date = new Date();
      let hariIni:any;
      hariIni = this.setTimeStamp(date);
      //1 jam berama detik
      const detikN = 3600;
      // hari dalam setahun
      const hariN = 365;
      // satu hari berapa jam
      const jamN = 24;

      //ini yang diketikin di search
      let tahun = parseInt(this.umurFilter.th) + 1;

      let satuTahun = detikN * hariN * jamN;
      if(isNaN(tahun) != true){
        let hasilInput = tahun * satuTahun;

        tglAwalN = hariIni - hasilInput;
  
        tglAkhirN = tglAwalN + satuTahun; 
      }else{
        tglAwalN = "";
        tglAkhirN = "";
      }
  
        if (this.umurFilter.th == '' ) {
          this.tglLahirFilterMulti = '';
        }
        this.tglLahirFilterMulti = '&tglLahirAwal=' + tglAwalN + '&tglLahirAkhir=' + tglAkhirN;
        this.pencarian = '&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
        this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    

    }

    if (fromField == 'kl') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.kelasFilterMulti = "";
      if (this.kelasFilter.length > 0) {
        for (let i = 0; i < this.kelasFilter.length; i++) {
          this.kelasFilterMulti += "&kdKelas[]=" + this.kelasFilter[i].value.kdKelas
        }
      }
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'kamar') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.kamarFilterMulti = "";
      if (this.kamarFilter.length > 0) {
        for (let i = 0; i < this.kamarFilter.length; i++) {
          this.kamarFilterMulti += "&kdKelas[]=" + this.kelasFilter[i].value.kdKelas
        }
      }
     // this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
     // this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'bed') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.bedFilterMulti = "";
      if (this.bedFilter.length > 0) {
        for (let i = 0; i < this.bedFilter.length; i++) {
          this.bedFilterMulti += "&kdKelas[]=" + this.bedFilter[i].value.kdKelas
        }
      }
      //this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      //this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
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
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'alamatLengkap') {
      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }
      this.pencarian = '&alamat=' + event +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'statusKeluar') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.statusKeluarFilterMulti = "";
      if (this.statusKeluarFilter.length > 0) {
        for (let i = 0; i < this.statusKeluarFilter.length; i++) {
          this.statusKeluarFilterMulti += "&kdKelas[]=" + this.statusKeluarFilter[i].value.kdKelas
        }
      }
     // this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
     // this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'kondisi') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.kondisiPasienFilterMulti = "";
      if (this.kondisiPasienFilter.length > 0) {
        for (let i = 0; i < this.kondisiPasienFilter.length; i++) {
          this.kondisiPasienFilterMulti += "&kdKelas[]=" + this.kondisiPasienFilter[i].value.kdKelas
        }
      }
     // this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
     // this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'ksp') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.kasusPenyakitFilterMulti = "";
      if (this.kasusPenyakitFilter.length > 0) {
        for (let i = 0; i < this.kasusPenyakitFilter.length; i++) {
          this.kasusPenyakitFilterMulti += "&kdKasusPenyakit[]=" + this.kasusPenyakitFilter[i].value.kdKasusPenyakit
        }
      }
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'dr') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.dokterFilterMulti = "";
      if (this.dokterFilter.length > 0) {
        for (let i = 0; i < this.dokterFilter.length; i++) {
          this.dokterFilterMulti += "&kdDokter[]=" + this.dokterFilter[i].value.kdPegawai
        }
      }
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti + this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }

    if (fromField == 'jpa') {

      let tglLahir = '';
      if (this.tglLahirFilter) {
        tglLahir = this.setTimeStamp(this.tglLahirFilter);
      }

      this.jenisPasienFilterMulti = "";
      if (this.jenisPasienFilter.length > 0) {
        for (let i = 0; i < this.jenisPasienFilter.length; i++) {
          this.jenisPasienFilterMulti += "&kdKelompokKlien[]=" + this.jenisPasienFilter[i].value.kdKelompokKlien
        }
      }
      this.pencarian = '&alamat=' + this.alamatLengkapFilter +this.statusPasienFilterMulti +'&tglLahir=' + tglLahir +'&noRegistrasi='+this.noRegFilter+'&noCm=' + this.noCMFilter +'&namaPasien=' + this.namaPasienLFilter + this.jenisKelaminFilterMulti + this.tglLahirFilterMulti +  this.kelasFilterMulti + this.kasusPenyakitFilterMulti + this.dokterFilterMulti + this.jenisPasienFilterMulti;  
      this.getPage(this.page, this.rows, this.pencarian, this.sortBy, this.typeSort, this.tanggalAwal, this.tanggalAkhir);
    }





  }

  detailPasien(){

  }

  batalPeriksa(){

  }

  pelayananPasien(){

  }

  keluarKamar(){

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

  doSomething(event) {
    
  }

}
