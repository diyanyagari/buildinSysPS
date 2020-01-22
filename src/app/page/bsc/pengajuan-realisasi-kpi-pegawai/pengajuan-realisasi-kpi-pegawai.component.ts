import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';


@Component({
  selector: 'app-pengajuan-realisasi-kpi-pegawai',
  templateUrl: './pengajuan-realisasi-kpi-pegawai.component.html',
  styleUrls: ['./pengajuan-realisasi-kpi-pegawai.component.scss'],
  providers: [ConfirmationService]
})
export class PengajuanRealisasiKpiPegawaiComponent implements OnInit {

  listPeriodeHead:any[];
  kodeHeadPeriode:any;
  listPeriode:any[];
  selectedPeriode:any;
  periodeSelected:any;
  listPeriodeData:any[];
  page:number;
  rows:number;
  tanggalPosting:any;
  minDate: any;
  maxDate: any;
  statusED: boolean;
  metodePerAcText: any;
  perspektifText: any;
  strategiText: any;
  kpiText: any;
  listDataRealisasi:any[];
  selectedPRK:any;
  totalRecords: number;
  dialogDetailKpi:boolean;
  selectedDataBsc:any;
  tanggalAwal:any;
  tanggalAkhir:any;
  type: any;
  minDateAwal: any;
  listDataPeriode: any[];
  kdPegawaiLog:any;
  kdRuanganAsalLog:any;
  listBulan:any[];
  dTambah:boolean;
  hilangR:boolean;
  dColumnB:boolean;
  dColumnT:boolean;
  totalNi: any;
  noSK:any;
  kdKPI:any;
  bobotKPI:any;
  bobotKPISK: any;
  kdDepartemenD: any;
  kdKPISK: any;
  kdMetodeHitungActual: any;
  kdMetodeHitungActualSK: any;
  kdPeriodeDataSK: any;
  kdPerspectiveD: any;
  kdStrategyD: any;
  keteranganLainnya: any;
  noHistori: any;
  noHistoriActual: any;
  noPosting: any;
  noRec: any;
  noRetur: any;
  noVerifikasi: any;
  noVerifikasiActual: any;
  targetKPI: any;
  targetKPIMaxSK: any;
  targetKPIMinSK: any;
  tglPosting: any;
  totalScoreKPI: any;
  tglAwalR:any;
  tglAkhirR:any;
  dialogRealisasi:boolean;
  minDateP: any;
  maxDateP: any;
  tglAwalPeriode: any;
  tglAkhirPeriode: any;
  hilangB:boolean;
  dataTypeOpt:any;
  inputNilaiBulan:any;
  
  
  constructor(
    private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private authGuard: AuthGuard	
  ) { }

  ngOnInit() {
    
    this.hilangB = false;
    this.dialogRealisasi = false;
    this.totalNi = 0;
    this.dColumnB = false;
    this.dColumnT = false;
    this.hilangR = true;
    this.dTambah = true;
    this.listBulan = [];
    this.listDataPeriode = [];
    this.metodePerAcText = "-";
    this.perspektifText = "-";
    this.strategiText = "-";
    this.kpiText = "-";
    this.kdPegawaiLog = this.authGuard.getUserDto().kdPegawai;
    this.kdRuanganAsalLog = this.authGuard.getUserDto().kdRuangan;
    this.tanggalAwal = "";
    this.tanggalAkhir = "";
    this.type = "InputDetail";
    this.tanggalPosting = "";
    this.listDataRealisasi = [];
    this.selectedDataBsc = "";
    this.statusED = true;
		this.minDate = new Date();
    this.maxDate = new Date();
    this.minDateP = new Date();
		this.maxDateP = new Date();
    if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
   		}
		this.kodeHeadPeriode = '';
		this.listPeriode = [];
		this.selectedPeriode = "";
    this.getPeriodeHead();
    this.getTypePilih(this.type);
  }

  getPeriodeHead() {

		//ambil periode head
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByKomponen').subscribe(res => {
		  this.listPeriodeHead = [];
		  this.listPeriodeHead.push({ label: '--Pilih Periode--', value: '' })
		  for (var i = 0; i < res.data.listPeriode.length; i++) {
			this.listPeriodeHead.push({ label: res.data.listPeriode[i].namaPeriode, value: res.data.listPeriode[i].kdPeriode })
		  };
    }, error => {
			this.listPeriodeHead = [];
			this.listPeriodeHead.push({ label: '-- ' + error + ' --', value: '' });
		});
	  
	  }


  getKode(event) {
    this.listPeriode = [];
    this.tanggalPosting = "";
    this.statusED = true;
		this.periodeSelected = event.value;
		this.ambilPeriodeAnak(this.periodeSelected);
	  }
	  
	  ambilPeriodeAnak(kdPeriode){
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByHead?kdPeriode=' + kdPeriode).subscribe(res => {
		  let data = [];
		  for (var i = 0; i < res.data.periodeHead.length; i++) {
			data[i] = {
			  "nomorUrut": i + 1,
			  "noHistori": res.data.periodeHead[i].noHistori,
			  "qtyTahun": res.data.periodeHead[i].qtyTahun,
			  "tglCutOffAkhir": res.data.periodeHead[i].tglCutOffAkhir,
			  "tglAwalPeriode": res.data.periodeHead[i].tglAwalPeriode,
			  "tglAkhirPeriode": res.data.periodeHead[i].tglAkhirPeriode,
			  "tahun": res.data.periodeHead[i].tahun,
			  "namaPeriodeHead": res.data.periodeHead[i].namaPeriodeHead,
			  "tglHistori": res.data.periodeHead[i].tglHistori,
			  "namaPeriode": res.data.periodeHead[i].namaPeriode,
			  "kdDepartemen": res.data.periodeHead[i].kdDepartemen,
			  "version": res.data.periodeHead[i].version,
			  "noRec": res.data.periodeHead[i].noRec,
			  "statusEnabled": res.data.periodeHead[i].statusEnabled,
			  "namaExternal": res.data.periodeHead[i].namaExternal,
			  "kdPeriodeHead": res.data.periodeHead[i].kdPeriodeHead,
			  "tglCutOffAwal": res.data.periodeHead[i].tglCutOffAwal,
			  "namaDepartemen": res.data.periodeHead[i].namaDepartemen,
			  "qtyMinggu": res.data.periodeHead[i].qtyMinggu,
			  "kode": {
				"kdProfile": res.data.periodeHead[i].kdProfile,
				"kode": res.data.periodeHead[i].kode
			  },
			  "reportDisplay": res.data.periodeHead[i].reportDisplay,
			  "qtyBulan": res.data.periodeHead[i].qtyBulan,
			  "qtyHari": res.data.periodeHead[i].qtyHari,
			  "kodeExternal": res.data.periodeHead[i].kodeExternal,
			  "bulan": res.data.periodeHead[i].bulan,
			  "kdKelompokTransaksi": res.data.periodeHead[i].kdKelompokTransaksi
			}
		  };
		  this.listPeriode = data;
		});  
    }
    
    pilihPeriode(event){
      this.selectedPRK = "";
      let tglAwalPeriode = event.data.tglAwalPeriode;
      let tglAkhirPeriode = event.data.tglAkhirPeriode;

      this.tglAwalPeriode = new Date(tglAwalPeriode*1000);
      this.tglAkhirPeriode = new Date(tglAkhirPeriode*1000);

      this.tanggalAwal = new Date(tglAwalPeriode*1000);
      this.tanggalAkhir = new Date(tglAkhirPeriode*1000);

      this.httpService.get(Configuration.get().dataBSC + '/pegawaipostingkpi/findByKdProfileAndKdPegawaiKPIActual/{startDate}/{endDate}/{kdPegawai}?id.kdPegawai='+this.kdPegawaiLog+'&startDate='+tglAwalPeriode+'&endDate='+tglAkhirPeriode).subscribe(table => {
        this.listDataRealisasi = table.PegawaiPostingKPI;
      });

      this.tanggalPosting = new Date(event.data.tglAwalPeriode * 1000);
      let tglAkhirPer = new Date(event.data.tglAkhirPeriode * 1000);
      this.minDate = this.tanggalPosting;
      this.maxDate = tglAkhirPer;

      this.minDateP = this.tanggalPosting;
      this.maxDateP = tglAkhirPer;

      this.statusED = false;

    }

    pilihDataRealisasi(event){
      //ini untuk tglPosting
      this.tanggalPosting = this.tglAwalPeriode;
      this.minDateP = this.tanggalPosting;
      this.maxDateP = this.tglAkhirPeriode;

      //ini untuk tglPeriodeInput Data Realisasi
      this.tanggalAwal = this.tglAwalPeriode;
      this.tanggalAkhir = this.tglAkhirPeriode;
      this.minDate = this.tanggalPosting;
      this.maxDate = this.tglAkhirPeriode;
      
      this.bobotKPI=event.data.bobotKPI;
      this.bobotKPISK=event.data.bobotKPISK;
      this.kdDepartemenD=event.data.kdDepartemenD;
      this.kdKPISK=event.data.kdKPISK;
      this.kdMetodeHitungActual=event.data.kdMetodeHitungActual;
      this.kdMetodeHitungActualSK=event.data.kdMetodeHitungActualSK;
      this.kdPeriodeDataSK=event.data.kdPeriodeDataSK;
      this.kdPerspectiveD=event.data.kdPerspectiveD;
      this.kdStrategyD=event.data.kdStrategyD;
      this.keteranganLainnya=event.data.keteranganLainnya;
      this.noHistori=event.data.noHistori;
      this.noHistoriActual=event.data.noHistoriActual;
      this.noPosting=event.data.noPosting;
      this.noRec=event.data.noRec;
      this.noRetur=event.data.noRetur;
      this.tglAwalR=event.data.tglAwal;
      this.tglAkhirR=event.data.tglAkhir;
      this.noVerifikasi=event.data.noVerifikasi;
      this.noVerifikasiActual=event.data.noVerifikasiActual;
      this.targetKPI=event.data.targetKPI;
      this.targetKPIMaxSK=event.data.targetKPIMaxSK;
      this.targetKPIMinSK=event.data.targetKPIMinSK;
      this.tglPosting=event.data.tglPosting;
      this.totalScoreKPI=event.data.totalScoreKPI;
      this.noSK = event.data.noSK;
      this.kdKPI = event.data.kdKPI;
      this.metodePerAcText = event.data.namaMetodeHitungSK;
      this.perspektifText = event.data.namaPerspectiveD;
      this.strategiText = event.data.namaStrategyD;
      this.kpiText = event.data.namaKPI;
      this.statusED = false;
      this.dialogRealisasi = true;
    }

    getTypePilih(value){
      this.listDataPeriode = [];
      this.listBulan = [];
      this.hilangR = true;
      let dataValue = value;
      this.dataTypeOpt = value;
      if(dataValue == 'InputDetail'){
        this.dColumnT = true;
        this.dColumnB = false;
        // this.hilangB = false;
        // this.hilangR = true;
      }else{
        this.dColumnB = true;
        this.dColumnT = false;
        // this.hilangB = true;
        // this.hilangR = true;
      }

    }

    reset(){
      this.selectedDataBsc = "";
      this.tanggalAwal = "";
      this.tanggalAkhir = "";
      this.tanggalPosting = "";
      this.type = "InputDetail";
      this.listBulan = [];
      this.listDataPeriode = [];
      this.hilangR = true;
      this.dialogRealisasi = false;
      //this.ngOnInit();
    }

    tampil(){

     // if(this.listBulan.length == 0 ){
       
  
        if(this.tanggalAwal == "" || this.listDataPeriode.length != 0){
          this.alertService.warn("Perhatian","Data Input Sudah Disediakan");
        }else{
          let dataTemp = [];
          let dataTempBaru = [];
          let tglAwalRealisasi = this.tanggalAwal;
          let tglAkhirRealisasi = this.tanggalAkhir;
          let bulanAwal = tglAwalRealisasi.getMonth();
          let bulanAkhir = tglAkhirRealisasi.getMonth();
          let tahun = tglAwalRealisasi.getFullYear();
          let namaBulan = [ "Jan"+tahun, "Feb"+tahun, "Mar"+tahun, "Apr"+tahun, "May"+tahun, "Jun"+tahun,
          "Jul"+tahun, "Aug"+tahun, "Sep"+tahun, "Oct"+tahun, "Nov"+tahun, "Dec"+tahun ];
        
          let dataT = {
            "totalR":0
          }
          let listDataPeriode = [...this.listDataPeriode];
          listDataPeriode.push(dataT);
          this.listDataPeriode = listDataPeriode;
          
        
  
        let arrayBulan;
        for(let x = bulanAwal; x <= bulanAkhir; x++ ){
          arrayBulan = {
            "namaB": namaBulan[x]
          }
          dataTemp.push(arrayBulan);
        }
        // console.log(dataTemp);
        
        this.listBulan = dataTemp;
        // for(let y=0; y<this.listBulan.length; y++){
        //   let arrayTampung = {
        //     "namaBulan":this.listBulan[y].namaB,
        //     "total":0
        //   }
        //   dataTempBaru.push(arrayTampung);
        // }
        //this.listDataPeriode = dataTempBaru;
        //console.log(this.listBulan);

        if(this.dataTypeOpt == 'InputDetail'){
          this.hilangB = false;
          this.hilangR = true;
        }else{
          this.hilangB = true;
          this.hilangR = false;
        }

        //this.dTambah = false;
        //this.hilangR = false;
  
        }

     // }

     
    }

    // tambahInput(){

    //   if(this.listDataPeriode.length == 0){
    //     let dataT = {
    //       "totalR":0
    //     }
    //     let listDataPeriode = [...this.listDataPeriode];
    //     listDataPeriode.push(dataT);
    //     this.listDataPeriode = listDataPeriode;
    //   }else{
    //     let last = this.listDataPeriode.length - 1;
    //     // if(this.listDataPeriode[last] == null || this.listDataPeriode[last] == 0){
    //     //   this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
    //     //}else{
    //       let dataT = {
    //         "totalR":0
    //       }
    //       let listDataPeriode = [...this.listDataPeriode];
    //       listDataPeriode.push(dataT);
    //       this.listDataPeriode = listDataPeriode;
    //     //}
    //   }

    // }

    hapusKpiRealisasi(row){
      let listDataPeriode = [...this.listDataPeriode];
      listDataPeriode.splice(row,1);
      this.listDataPeriode = listDataPeriode;
    }

    tampungTotal(isiData,index){
      // for(let i=0; i<this.listDataPeriode.length; i++){
        
      // }
      // let nilaiR = Number(isiData);
      // // this.totalNi = this.totalNi + nilaiR;
      // let tampung = nilaiR;
      // this.listDataPeriode[index].totalR = nilaiR;

    }

    simpan(){

      
      if(this.listDataPeriode.length == 0){
        this.alertService.warn("Perhatian","Tidak Ada Data Untuk Di Simpan");
      }else{

        let tampungObjek = Object.keys(this.listDataPeriode[0]).map(e => this.listDataPeriode[0][e]);
        let tampungN = [];
        let tampungT = [];
        let totalInput = 0;

          if(this.type == 'InputDetail'){

            //cari totalInputDetail jika akumulasi
            for(let z=1; z<tampungObjek.length; z++){
              // if(this.metodePerAcText = 'Akumulasi'){
                totalInput = totalInput + parseInt(tampungObjek[z]);  
              //}
            }
            console.log(totalInput);

            for(let i=0; i<tampungObjek.length; i++){

              if(tampungObjek[i] != 0){
                let nilaiD = tampungObjek[i];
                let dataPegawaiPosting = {
                  "actualKPI": Number(nilaiD),
                  "actualKPIODT": Number(nilaiD),
                  "kdKPI": this.kdKPI,
                  "kdPegawai": this.kdPegawaiLog,
                  "noPosting": "string",
                  "noRec": "string",
                  "noRetur": "string",
                  "noSK": this.noSK,
                  "noVerifikasi": "string",
                  "statusEnabled": true
                }
                tampungN.push(dataPegawaiPosting);
              }
              
              
            }
            //console.log(tampungN);
            let simpanDetail = {
              "tglPosting": this.setTimeStamp(this.tanggalPosting),
              "tglAkhir":this.setTimeStamp(this.tanggalAkhir),
              "tglAwal":this.setTimeStamp(this.tanggalAwal),
              "pegawaiPostingKPIActualDto":tampungN,
              "totalActualKPI":totalInput,
              "noPostingPegawaiPostingKPI": this.noPosting
            } 
            console.log(simpanDetail);
           this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi-actual/save', simpanDetail).subscribe(table => {
              this.alertService.success('Simpan','Data Berhasil Di Simpan');
              this.selectedDataBsc = "";
              this.tanggalAwal = "";
              this.tanggalAkhir = "";
              this.tanggalPosting = "";
              this.type = "InputDetail";
              this.listBulan = [];
              this.listDataPeriode = [];
              this.hilangR = true;
              this.dialogRealisasi = false;


              // this.metodePerAcText = "-";
              // this.perspektifText = "-";
              // this.strategiText = "-";
              // this.kpiText = "-";
              // this.selectedDataBsc = "";
              // this.listDataPeriode = [];
              // this.listBulan = [];
              // this.statusED = true;
              // this.dColumnT = true;
              // this.hilangR = true;
              // this.tanggalAwal = "";
              // this.tanggalAkhir = "";
              // this.tanggalPosting = "";
              // this.type = "InputDetail";
              //this.ngOnInit();

           });
          }else if(this.type == 'InputTotal'){

            for(let i=0; i<tampungObjek.length; i++){

             // if(tampungObjek[i] == 0){
                let nilaiT = tampungObjek[i];
                let dataPegawaiPosting = {
                  "bobotKPI": this.bobotKPI,
                  "bobotKPISK": this.bobotKPISK,
                  "kdDepartemenD": this.kdDepartemenD,
                  "kdKPI": this.kdKPI,
                  "kdKPISK": this.kdKPISK,
                  "kdMetodeHitungActual": this.kdMetodeHitungActual,
                  "kdMetodeHitungActualSK": this.kdMetodeHitungActualSK,
                  "kdPegawai": this.kdPegawaiLog,
                  "kdPeriodeDataSK": this.kdPeriodeDataSK,
                  "kdPerspectiveD": this.kdPerspectiveD,
                  "kdStrategyD": this.kdStrategyD,
                  "keteranganLainnya": this.keteranganLainnya,
                  "noHistori": this.noHistori,
                  "noHistoriActual": this.noHistoriActual,
                  "noPosting": this.noPosting,
                  "noRec": this.noRec,
                  "noRetur": this.noRetur,
                  "noSK": this.noSK,
                  "noVerifikasi": this.noVerifikasi,
                  "noVerifikasiActual": 'string',
                  "statusEnabled": true,
                  "targetKPI": this.targetKPI,
                  "targetKPIMaxSK": this.targetKPIMaxSK,
                  "targetKPIMinSK": this.targetKPIMinSK,
                  "tglAkhir": this.tglAkhirR,
                  "tglAwal": this.tglAwalR,
                  "tglPosting": this.setTimeStamp(this.tanggalPosting),
                  "totalActualKPI": nilaiT,
                  "totalScoreKPI": this.totalScoreKPI,
                  "version": 1
                }
                tampungT.push(dataPegawaiPosting);
             // }
              
              
            }
            //console.log(tampungN);
            let simpanTotal = {
              "pegawaiPostingKPIDto":tampungT
            } 
            
            console.log(simpanTotal);
            this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi-actual/update', simpanTotal).subscribe(table => {
              this.alertService.success('Simpan','Data Berhasil Di Simpan');
              this.selectedDataBsc = "";
              this.tanggalAwal = "";
              this.tanggalAkhir = "";
              this.tanggalPosting = "";
              this.type = "InputDetail";
              this.listBulan = [];
              this.listDataPeriode = [];
              this.hilangR = true;
              this.dialogRealisasi = false;

              // this.metodePerAcText = "-";
              // this.perspektifText = "-";
              // this.strategiText = "-";
              // this.kpiText = "-";
              // this.selectedDataBsc = "";
              // this.listDataPeriode = [];
              // this.listBulan = [];
              // this.statusED = true;
              // this.dColumnT = true;
              // this.hilangR = true;
              // this.tanggalAwal = "";
              // this.tanggalAkhir = "";
              // this.tanggalPosting = "";
              // this.type = "InputDetail";
              //this.ngOnInit();

            });

          }

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

    gantiTanggalPosting(tanggalPosting){
      let tPosting = tanggalPosting;
      this.tanggalAwal = tPosting;
      this.minDate = tPosting; 
      // this.tanggalAkhir
      
    }

    gantiPilihanAwal(event){
      this.listDataPeriode = [];
      this.listBulan = [];
    }

    gantiPilihanAkhir(event){
      this.listDataPeriode = [];
      this.listBulan = [];
    }

    onDialogHide(){
      this.reset();
    }



}
