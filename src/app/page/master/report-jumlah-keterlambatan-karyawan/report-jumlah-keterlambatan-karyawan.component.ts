import { Inject, forwardRef, Component, OnInit, ViewEncapsulation,Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, PickListModule, PickList } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService, RowNumberService } from '../../../global';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

// @Pipe({
//   name: 'removeduplicates'
// })

@Component({
  selector: 'app-report-jumlah-keterlambatan-karyawan',
  templateUrl: './report-jumlah-keterlambatan-karyawan.component.html',
  styleUrls: ['./report-jumlah-keterlambatan-karyawan.component.scss'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class ReportJumlahKeterlambatanKaryawanComponent implements OnInit {
  tanggalAwal: any;
  tanggalAkhir: any;
  today:any;
  popPreview:boolean;
  sumberDataStatus:any;
  targetDataStatus:any;
  sumberDataEmployee:any;
  targetDataEmployee:any;
  page:number;
  rows:number;
  periodeAwalText:any;
  periodeAkhirText:any;
  dataStatusReport:any;
  dataStatusTampil:any[];
  dataStatusJumlah:any[];
  indexHt:any;
  tampungFinal:any[];
  result:any=[];
  labelR:any;

  constructor(
    private httpService: HttpClient,
		private alertService: AlertService,
		private authGuard: AuthGuard,
    private confirmationService: ConfirmationService,
    private rowNumberService: RowNumberService,
    @Inject(forwardRef(() => ReportService)) private print: ReportService
  ) { }

  ngOnInit() {


    if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
    }
    this.dataStatusJumlah = [];
    this.dataStatusTampil = [];
    this.dataStatusReport = [];
    this.periodeAwalText = "";
    this.periodeAkhirText = "";
    this.sumberDataStatus = [];
    this.targetDataStatus = [];
    this.sumberDataEmployee = [];
    this.targetDataEmployee = [];
    this.popPreview = false;
    this.today = new Date();
    this.tanggalAwal = new Date(this.today.getFullYear(),this.today.getMonth(),1);
		this.tanggalAkhir = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0, 23, 59, 59);
    this.tanggalAwal.setHours(0, 0, 0, 0);
    this.getStatusAbsen();
    this.getEmployee();
  }

  getStatusAbsen(){
    this.httpService.get(Configuration.get().dataHr2Mod3 + "/rekapitulasi-keterlambatan/getStatusPegawaiAll?").subscribe(result => {
      this.sumberDataStatus = result.data;
    });
  }
  getEmployee(){
    this.httpService.get(Configuration.get().dataHr2Mod3 + "/rekapitulasi-keterlambatan/findAllPegawai?page=1&rows=1000&dir=namaLengkap&sort=desc").subscribe(result => {
      this.sumberDataEmployee = result.DataPegawai;
    });
  }

  gantiTglAwal(data){

  }

  gantiTglAkhir(data){

  }

  batalReset(){
    this.ngOnInit();
  }

  

  lihat(){

     //coba dummy dulu
      //   this.dataStatusReport = [
      //     {
      //       "kdPegawai":"L001",
      //       "namaPegawai":"Rowan",
      //       "namaJabatan":"Programmer",
      //       "namaRuangan":"IT",
      //       "status":[
      //         {
      //           "namaStatus":"Masuk",
      //           "jumlah":31
      //         },
      //         {
      //           "namaStatus":"Tidak Masuk",
      //           "jumlah":2
      //         }
      //       ]
      //     },
      //     {
      //       "kdPegawai":"L002",
      //       "namaPegawai":"Budiman",
      //       "namaJabatan":"Manager",
      //       "namaRuangan":"HRD",
      //       "status":[
      //         {
      //           "namaStatus":"Masuk",
      //           "jumlah":20
      //         },
      //         {
      //           "namaStatus":"Tidak Masuk",
      //           "jumlah":0
      //         }
      //       ]
      //     }
  
      // ]

      // this.dataStatusTampil = [
      //   {
      //     "namaStatus":"Masuk",
      //     "jumlah":31
      //   },
      //   {
      //     "namaStatus":"Tidak Masuk",
      //     "jumlah":2
      //   }
      // ]


      // this.popPreview = true;

    let arrayDataStatus = [];
    let arrayDataEmployee = [];
    let dataFinalGrid = [];
    let dataPush = [];

    if(this.targetDataStatus.length == 0 || this.targetDataEmployee.length == 0){
      this.alertService.warn("Perhatian","Tidak Ada Data Untuk Di Lihat");
    }else{
      this.targetDataStatus.forEach(dataS => {
        arrayDataStatus.push(dataS.kdStatus);
      });
      this.targetDataEmployee.forEach(dataE => {
        arrayDataEmployee.push(dataE.kdpegawai);
      });
  
      arrayDataStatus.toString();
      arrayDataEmployee.toString();
  
      let kdStatus = this.targetDataStatus[0].kdStatus;
      let kdpgw = this.targetDataEmployee[0].kdpegawai;
      let tAwal = this.setTimeStamp(this.tanggalAwal);
      let tAkhir = this.setTimeStamp(this.tanggalAkhir);
      let indexnama;
      let tglAwalFormat = this.toShortFormat(this.tanggalAwal);
      let tglAkhirFormat = this.toShortFormat(this.tanggalAkhir);
      this.labelR = "Dari "+tglAwalFormat+" Sampai "+tglAkhirFormat;
      console.log(this.labelR);
    this.httpService.get(Configuration.get().dataHr2Mod3 + "/rekapitulasi-keterlambatan/findAllByKdPegawaiAndKdStatusPegawai?page="+this.page+"&rows="+this.rows+"&dir=peg.namaLengkap&sort=asc&kdPegawai="+arrayDataEmployee+"&kdStatus="+arrayDataStatus+"&tglAwal="+tAwal+"&tglAkhir="+tAkhir).subscribe(result => {
      
      // this.dataStatusReport = result.absensi;
      this.dataStatusReport =this.rowNumberService.addRowNumber(this.page, this.rows, result.absensi);
     console.log(this.dataStatusReport);
     let tampungSR = [];

      //ini hanya untuk ambil header dinamis saja
      for(let z=0; z<this.dataStatusReport.length; z++){
        for(let y=0; y<this.dataStatusReport[z].status.length; y++){
          indexnama = 1 + y;
        let arrayStatusTampil = {
          "namaStatus": this.dataStatusReport[z].status[y].namaStatus,
          "jumlahStatus": this.dataStatusReport[z].status[y].jumlah
        }
        this.dataStatusTampil.push(arrayStatusTampil);
        }
        break;
      }

      //coba ini 
      // this.tampungFinal = [];
      // for(let z=0; z<this.dataStatusReport.length; z++){
      
      //   for(let y=0; y<this.dataStatusReport[z].status.length; y++){
      
      //   let arrayStatusTam = {
      //     "namaStatus": this.dataStatusReport[z].status[y].namaStatus,
      //     "jumlahStatus": this.dataStatusReport[z].status[y].jumlah
      //   }
      //     tampungSR.push(arrayStatusTam);
      //   }
        
      //   this.tampungFinal[z]=tampungSR;
      //   tampungSR = [];
      // }
      // console.log(this.tampungFinal);


      let tampungJumlah = [];
      let arrayJumlahStatus;
      //ini ambil data isi dinamis jumlah status
      for(let a=0; a<this.dataStatusReport.length; a++){
        this.indexHt = 1 + a;
        
        for(let b=0; b<this.dataStatusReport[a].status.length; b++){
          arrayJumlahStatus = {
            "jumlah":this.dataStatusReport[a].status[b].jumlah
          }
         
        }
        this.dataStatusJumlah.push(arrayJumlahStatus);
        break;
      }
      //console.log(this.dataStatusJumlah);
      // console.log(this.indexHt);
      console.log(this.dataStatusTampil);
      // console.log(this.dataStatusJumlah.splice(0,this.indexHt-1));
        // this.dataStatusJumlah = this.dataStatusJumlah.splice(0,this.indexHt - indexnama );
        // console.log(this.dataStatusJumlah);
    //     // dataFinalGrid = result.absensi;
    //     // for(let key of dataFinalGrid){
    //     //   for(var i in key){
    //     //     if(typeof key[i] == 'number'){
    //     //       let arrayJsonBaru = {
    //     //         "key":i,
    //     //         "isi":key[i]
    //     //         }
    //     //         dataPush.push(arrayJsonBaru);
    //     //     }
         
    //     //   }
    //     // }
        
    //     // Observable.merge(dataPush)
    //     // .distinct((x) => x.key)
    //     // .subscribe(y=>{
    //     //   this.dataStatusTampil.push(y);
    //     // });

    //     // console.log(this.dataStatusTampil);
        
        
       });
       this.popPreview = true;
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
  
  tutupPopUp(){
    this.batalReset();
  }

  exportToPdf() {
    let arrayDataStatusCetak = [];
    let arrayDataEmployeeCetak = [];
    let kdProfile = this.authGuard.getUserDto().kdProfile;
    let tAwal = this.setTimeStamp(this.tanggalAwal);
    let tAkhir = this.setTimeStamp(this.tanggalAkhir);
    this.targetDataStatus.forEach(dataS => {
      arrayDataStatusCetak.push(dataS.kdStatus);
    });
    this.targetDataEmployee.forEach(dataE => {
      arrayDataEmployeeCetak.push(dataE.kdpegawai);
    });

    arrayDataStatusCetak.toString();
    arrayDataEmployeeCetak.toString();

		this.print.showEmbedPDFReport(Configuration.get().report + '/rekapitulasiKeterlambatanReport/laporanRekapitulasiKeterlambatan.pdf?kdProfile='+kdProfile+'&labelPembayaran='+this.labelR+'&tglAwalPeriode='+tAwal+'&tglAkhirPeriode='+tAkhir+'&kdPegawai='+arrayDataEmployeeCetak+'&kdStatusPegawai='+arrayDataStatusCetak+'&outProfile=true&download=false', 'Laporan Jumlah Keterlambatan Karyawan');
	}

	exportToXLSX() {
    let arrayDataStatusCetak = [];
    let arrayDataEmployeeCetak = [];
    let kdProfile = this.authGuard.getUserDto().kdProfile;
    let tAwal = this.setTimeStamp(this.tanggalAwal);
    let tAkhir = this.setTimeStamp(this.tanggalAkhir);
    this.targetDataStatus.forEach(dataS => {
      arrayDataStatusCetak.push(dataS.kdStatus);
    });
    this.targetDataEmployee.forEach(dataE => {
      arrayDataEmployeeCetak.push("'"+dataE.kdpegawai+"'");
    });

    let arrayDS = arrayDataStatusCetak.toString();
    let arrayDE = arrayDataEmployeeCetak.toString();

    let query = 
    " AND strukhisto7_.tglawal BETWEEN "+ tAwal +" AND "+ tAkhir 
    +""+" AND pegawaihis0_.kdpegawai IN ("+arrayDE+") AND pegawaihis0_.kdstatuspegawai IN ("+arrayDS+") "

    // "SELECT pegawaihis0_.kdstatusabsensi,"
    // +"status3_.namastatus,pegawaihis0_.kdpegawai,pegawaihis0_.nohistori,pegawaihis0_.kdstatuspegawai,"
    // +"pegawai4_.namalengkap,jabatan8_.namajabatan,ruangan6_.namaruangan,Format(Dateadd(s, strukhisto7_.tglawal+ Datediff(s, Getutcdate(), Getdate()), '01-01-1970'),'dd-MM-yyyy')AS TglAwal,"
    // +"strukhisto7_.tglawal,strukhisto7_.tglakhir,Format(Dateadd(s, strukhisto7_.tglakhir + Datediff(s, Getutcdate(), Getdate()), '01-01-1970'),'dd-MM-yyyy')AS TglAkhir FROM pegawaihistoriabsensi_t pegawaihis0_ "
    // +""+"LEFT OUTER JOIN profile_m profile1_ ON pegawaihis0_.kdprofile = profile1_.kdprofile "
    // +""+"LEFT OUTER JOIN status_m status2_ ON pegawaihis0_.kdprofile = status2_.kdprofile "
    // +""+"AND pegawaihis0_.kdstatusabsensi = status2_.kdstatus "
    // +""+"LEFT OUTER JOIN status_m status3_ ON pegawaihis0_.kdprofile = status3_.kdprofile "
    // +""+"AND pegawaihis0_.kdstatuspegawai = status3_.kdstatus LEFT OUTER JOIN pegawai_m pegawai4_ "
    // +""+"ON pegawaihis0_.kdprofile = pegawai4_.kdprofile AND pegawaihis0_.kdpegawai = pegawai4_.kdpegawai "
    // +""+"LEFT OUTER JOIN jeniskelamin_m jeniskelam5_ ON pegawai4_.kdjeniskelamin = jeniskelam5_.kdjeniskelamin "
    // +""+"LEFT OUTER JOIN ruangan_m ruangan6_ ON pegawai4_.kdprofile = ruangan6_.kdprofile AND pegawai4_.kdruangankerja = ruangan6_.kdruangan "
    // +""+"LEFT OUTER JOIN jabatan_m jabatan8_ ON pegawai4_.kdprofile = jabatan8_.kdprofile AND pegawai4_.kdjabatan = jabatan8_.kdjabatan "
    // +""+"LEFT OUTER JOIN strukhistori_t strukhisto7_ ON pegawaihis0_.kdprofile = strukhisto7_.kdprofile AND pegawaihis0_.nohistori = strukhisto7_.nohistori "
    // +""+"LEFT OUTER JOIN status_m status9_ ON pegawaihis0_.kdprofile = status9_.kdprofile AND pegawaihis0_.kdstatuspegawai = status9_.kdstatus "
    // +""+"WHERE  profile1_.kdprofile ="+ kdProfile + " AND pegawaihis0_.statusenabled = 1 AND strukhisto7_.tglawal BETWEEN "+ tAwal +" AND "+ tAkhir 
    // +""+" AND pegawaihis0_.kdpegawai IN ("+arrayDE+") AND pegawaihis0_.kdstatuspegawai IN ("+arrayDS+")"
    // +""+" ORDER  BY strukhisto7_.tglawal";

    let data = {
			"namaFile": "rekapitulasi-keterlambatan-status-crosstab-excel",
			"extFile": ".xlsx",
			"excelOneSheet": true,
      "download": true,
      "kdDepartemen":'',
			"kdProfile": kdProfile,
			"outDepartemen": true,
			"outProfile": true,
			"paramImgKey": [
			],
			"paramImgValue": [
			],
			"paramKey": [
        // "kdProfile", "labelLaporan", "kdStatusPegwaiAktif"
        "kdProfile", "query"
			],
			"paramValue": [
        // kdProfile, "Struktur Organisasi", this.kdStatusPegawaiAktif
        kdProfile, query
        //tAwal,tAkhir,arrayDE,arrayDS,"Laporan Jumlah Keterlambatan Karyawan"
			]
    }
    console.log(data);

		this.httpService.genericReport(Configuration.get().report + '/generic/report/rekapitulasi-keterlambatan-status-crosstab-excel.xlsx', data ).subscribe( res => {
		});
  }
  
  removeduplicates(){
    for(let x=0; x<this.dataStatusTampil.length; x++){
      if(this.result.indexOf(x) < 0) {
        this.result.push(x);
      }
    }
    console.log(this.result);
  }

  toShortFormat(tgl){
    let month_names =["Jan","Feb","Mar",
    "Apr","May","Jun",
    "Jul","Aug","Sep",
    "Oct","Nov","Dec"];

    let day = tgl.getDate();
    let month_index = tgl.getMonth();
    let year = tgl.getFullYear();

    return "" + day + " " + month_names[month_index] + " " + year;
  }


}
