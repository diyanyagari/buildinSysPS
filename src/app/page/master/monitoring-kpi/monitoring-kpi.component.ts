import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { TreeModule,TreeNode,LazyLoadEvent, Message, ConfirmDialogModule,ConfirmationService, MenuItem, SelectItem, PanelModule } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-kpi',
	templateUrl: './monitoring-kpi.component.html',
	styleUrls: ['./monitoring-kpi.component.scss'],
	providers: [ConfirmationService]
})
export class MonitoringKpiComponent implements OnInit {
	periodeTree:TreeNode[];
	departemenTree:TreeNode[];
	selectedPeriodeNode:any;
	selectedDepartemenNode:any;
	page:number;
	rows:number;
	listPeriodeHead:any[];
	kodeHeadPeriode:any;
	listPeriode:any[];
	selectedPeriode:any;
	selectedF:any;
	listFinancial:any[];
	selectedC:any;
	listCustomer:any[];
	selectedB:any;
	listBusiness:any[];
	selectedL:any;
	listLearning:any[];
	selectedPegawai:any;
	listPegawai:any[];
	totalRecordsPeriode:number;
	totalRecordsFinancial:number;
	totalRecordsCustomer:number;
	totalRecordsBusiness:number;
	totalRecordsLearning:number;
	totalRecordsPegawai:number;
	periodeSelected:any;
	nHistori:any;
	kdDep:any;
	kdDepHead:any;
	inputKPIPOP:boolean;
	dataInputKPI:any[];
	listFinancialStrategy:any[];
	listCustomerStrategy:any[];
	listBusinessStrategy:any[];
	listLearningStrategy:any[];
	listKPI:any[];
	listDdlAsalData:any[];
	listStrategi:any[];
	kdPgw:any;
	tglAwal:any;
	tglAkhir:any;
	cekIsi:any;
	listPeriodeData:any[];
	listPerspective:any[];
	tanggalPosting:any;
	todayP: any;
	minDate: any;
	maxDate: any;

	constructor(
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private authGuard: AuthGuard	
	) { }

	ngOnInit() {
		this.todayP = new Date();
		// let today = new Date();
		// this.tanggalPosting = this.todayP;
		this.minDate = new Date();
		this.maxDate = new Date();
		this.inputKPIPOP = false;
		this.dataInputKPI = [];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
   		}
		this.departemenTree = [];
		this.kodeHeadPeriode = '';
		this.listPeriode = [];
		this.selectedPeriode = "";
		this.getDepartemenTree();
		this.getPeriodeHead();
		//this.getPegawai();
		this.getKPI();
		this.getAsalData();
		this.getStrategy();
		this.getPeriodeData();
		this.getPerspective();
	}

	getPeriodeData(){
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapkpi/findPeriodeDataKPI').subscribe(res => {
			this.listPeriodeData = [];
			this.listPeriodeData.push({ label: '--Pilih Periode Data--', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listPeriodeData.push(
					{
						label: res.data[i].namaPeriode,
						value: res.data[i]
					}
				);
			};
		}, error => {
			this.listPeriodeData = [];
			this.listPeriodeData.push({ label: '-- ' + error + ' --', value: '' });
		});
	}

	getStrategy(){
		this.httpService.get(Configuration.get().dataBSC + '/strategy/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaStrategy&sort=desc').subscribe(res => {
			this.listStrategi = [];
			this.listStrategi.push({ label: '--Pilih Strategi--', value: '' })
			for (var i = 0; i < res.Strategy.length; i++) {
				this.listStrategi.push(
					{
						label: res.Strategy[i].namaStrategy,
						value: res.Strategy[i]
					}
				);
			};
		}, error => {
			this.listStrategi = [];
			this.listStrategi.push({ label: '-- ' + error + ' --', value: '' });
		});
	}

	getPerspective(){
		this.httpService.get(Configuration.get().dataBSC + '/perspective/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaPerspective&sort=desc').subscribe(res => {
			this.listPerspective = [];
			this.listPerspective.push({ label: '--Pilih Perspective--', value: '' })
			for (var i = 0; i < res.Perspective.length; i++) {
				this.listPerspective.push(
					{
						label: res.Perspective[i].namaPerspective,
						value: res.Perspective[i]
					}
				);
			};
		}, error => {
			this.listPerspective = [];
			this.listPerspective.push({ label: '-- ' + error + ' --', value: '' });
		});
	}
	
	getAsalData(){
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapkpi/findAsalSumberDataKPI').subscribe(res => {
			this.listDdlAsalData = [];
			this.listDdlAsalData.push({ label: '-- Pilih Asal Data --', value: '' });
			for (let i = 0; i < res.data.length; i++) {
				this.listDdlAsalData.push({ label: res.data[i].namaAsal, value: res.data[i] })
			};
		}, error => {
			this.listDdlAsalData = [];
			this.listDdlAsalData.push({ label: '--' + error + '--', value: '' });
		});
	}
	getKPI() {
		this.httpService.get(Configuration.get().dataBSC + '/kpi/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaKPI&sort=desc').subscribe(res => {
			this.listKPI = [];
			this.listKPI.push({ label: '--Pilih KPI--', value: '' })
			for (var i = 0; i < res.KPI.length; i++) {
				this.listKPI.push(
					{
						label: res.KPI[i].namaKPI,
						value: res.KPI[i]
					}
				);
			};
		}, error => {
			this.listKPI = [];
			this.listKPI.push({ label: '-- ' + error + ' --', value: '' });
		});
	}

	getPegawai(kdDep){
		//ambil pegawai
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapd/findAllPegawaiByDepartemen?page='+this.page+'&rows='+ this.rows+'&dir=namaLengkap&sort=desc'+'&kdDepartemen='+kdDep).subscribe(res => {
			this.listPegawai = res.DataPegawai;
		});
	}

	getPeriodeHead() {

		//ambil periode head
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByKomponen').subscribe(res => {
		  this.listPeriodeHead = [];
		  this.listPeriodeHead.push({ label: '--Pilih Periode--', value: '' })
		  for (var i = 0; i < res.data.listPeriode.length; i++) {
			this.listPeriodeHead.push({ label: res.data.listPeriode[i].namaPeriode, value: res.data.listPeriode[i].kdPeriode })
		  };
		});
	  
	  }

	  getKode(event) {
		this.listFinancial = [];
		this.listCustomer = [];
		this.listBusiness = [];
		this.listLearning = [];
		this.nHistori = undefined;
		this.kdDep = '';
		this.selectedDepartemenNode = '';
		this.listPegawai = [];
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

	getDepartemenTree(){
		let departemenIA=[];
		let departemenIAF=[];
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Departemen&select=id.kode,namaDepartemen,kdDepartemenHead,version,kdPegawaiKepala,statusEnabled,kodeExternal,namaExternal,reportDisplay,isProfitCostCenter').subscribe(table => {
		  let dataTampungTree = table.data.data;
		  for(let i=0; i<dataTampungTree.length;i++){
			departemenIA[i] ={
			  "label": dataTampungTree[i].namaDepartemen,
			  "kdDepartemenHead":dataTampungTree[i].kdDepartemenHead,
			  "id_kode":dataTampungTree[i].id_kode,
			  "children":[]
			}
	
		  }
		 
		  function list_to_tree(list) {
				
					let map = {}, node, roots = [], k;
					for (k = 0; k < list.length; k += 1) {
						map[list[k].id_kode] = k; // inisialisasi
			  list[k].children = [];
			  // inisialisasi Children
			}
	
					for (k = 0; k < list.length; k += 1) {
						node = list[k];
						if (node.kdDepartemenHead !== null) {
							// jika kdDepartemenHead Tidak Kosong Push Ke Children
							list[map[node.kdDepartemenHead]].children.push(node);
						} else {
							roots.push(node);
						}
					}
					return roots;
		  }
		  // console.log(departemenIA);
		  this.departemenTree = list_to_tree(departemenIA);
		  console.log(this.departemenTree);
	
		});
	
	
	  }

	nodeSelectPeriode(event){

	}

	nodeSelectDepartemen(event){
		let dataTamp = event;
		this.kdDep = event.node.id_kode;
		this.kdDepHead = event.node.kdDepartemenHead;
		let dataFinancial = [];
		let dataCustomer = [];
		let dataBussines = [];
		let dataLearning = [];

		if(this.nHistori == undefined ){
      		this.alertService.warn('Peringatan','Harap Pilih Periode Terlebih Dahulu');
    	}else{
			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKodeV2/' + this.nHistori+'/'+ this.kdDep).subscribe(res => {
				let tampungKPI = res.ProfileHistoriStrategyMapDKPI;
				
				for (var i = 0; i < tampungKPI.length; i++) {
	
					if(tampungKPI[i].kdPerspective == 1){
						let dataF = {
							"namaStrategy": tampungKPI[i].namaStrategy,
							"kpi": tampungKPI[i].namaKPI,
							"bobot": tampungKPI[i].bobotKPI,
							"satuanHasil": tampungKPI[i].namaSatuanHasil,
							"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
							"target": tampungKPI[i].targetKPIMin,
							"sumberData": tampungKPI[i].namaAsalData,
							"namaPeriodeData": tampungKPI[i].namaPeriodeData,
							"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
						}
						dataFinancial.push(dataF);
					}else if(tampungKPI[i].kdPerspective == 2){
						let dataC = {
							"namaStrategy": tampungKPI[i].namaStrategy,
							"kpi": tampungKPI[i].namaKPI,
							"bobot": tampungKPI[i].bobotKPI,
							"satuanHasil": tampungKPI[i].namaSatuanHasil,
							"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
							"target": tampungKPI[i].targetKPIMin,
							"sumberData": tampungKPI[i].namaAsalData,
							"namaPeriodeData": tampungKPI[i].namaPeriodeData,
							"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
						}
						dataCustomer.push(dataC);
					}else if(tampungKPI[i].kdPerspective == 3){
						let dataB = {
							"namaStrategy": tampungKPI[i].namaStrategy,
							"kpi": tampungKPI[i].namaKPI,
							"bobot": tampungKPI[i].bobotKPI,
							"satuanHasil": tampungKPI[i].namaSatuanHasil,
							"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
							"target": tampungKPI[i].targetKPIMin,
							"sumberData": tampungKPI[i].namaAsalData,
							"namaPeriodeData": tampungKPI[i].namaPeriodeData,
							"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
						}
						dataBussines.push(dataB);
					}else if(tampungKPI[i].kdPerspective == 4){
						let dataL = {
							"namaStrategy": tampungKPI[i].namaStrategy,
							"kpi": tampungKPI[i].namaKPI,
							"bobot": tampungKPI[i].bobotKPI,
							"satuanHasil": tampungKPI[i].namaSatuanHasil,
							"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
							"target": tampungKPI[i].targetKPIMin,
							"sumberData": tampungKPI[i].namaAsalData,
							"namaPeriodeData": tampungKPI[i].namaPeriodeData,
							"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
						}
						dataLearning.push(dataL);
					}
	
				}
				this.listFinancial = dataFinancial;
				this.listCustomer = dataCustomer;
				this.listBusiness = dataBussines;
				this.listLearning = dataLearning;
			
			});
			this.getPegawai(this.kdDep);
		}
		
	
	}

	pilihPeriode(event){


		this.kdDep = "";
		this.listPegawai = [];
		this.tglAwal = event.data.tglAwalPeriode;
		this.tglAkhir = event.data.tglAkhirPeriode;
		this.selectedDepartemenNode = "";
		let dataTampung = event.data;
		let dataFinancial = [];
		let dataCustomer = [];
		let dataBussines = [];
		let dataLearning = [];
		this.nHistori = event.data.noHistori;
		//let tes = '1808150002';
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapkpi/findByKodeV2/' + this.nHistori).subscribe(res => {
			let tampungKPI = res.ProfileHistoriStrategyMapKPI;
			if(tampungKPI.length != 0){
				this.cekIsi = 1;
			}else{
				this.cekIsi = 0;
			}
			for (var i = 0; i < tampungKPI.length; i++) {

				if(tampungKPI[i].kdPerspective == 1){
					let dataF = {
						"namaStrategy": tampungKPI[i].namaStrategy,
						"kpi": tampungKPI[i].namaKPI,
						"bobot": tampungKPI[i].bobotKPI,
						"satuanHasil": tampungKPI[i].namaSatuanHasil,
						"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
						"target": tampungKPI[i].targetKPIMin,
						"sumberData": tampungKPI[i].namaAsalData,
						"namaPeriodeData": tampungKPI[i].namaPeriodeData,
						"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
					}
					dataFinancial.push(dataF);
				}else if(tampungKPI[i].kdPerspective == 2){
					let dataC = {
						"namaStrategy": tampungKPI[i].namaStrategy,
						"kpi": tampungKPI[i].namaKPI,
						"bobot": tampungKPI[i].bobotKPI,
						"satuanHasil": tampungKPI[i].namaSatuanHasil,
						"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
						"target": tampungKPI[i].targetKPIMin,
						"sumberData": tampungKPI[i].namaAsalData,
						"namaPeriodeData": tampungKPI[i].namaPeriodeData,
						"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
					}
					dataCustomer.push(dataC);
				}else if(tampungKPI[i].kdPerspective == 3){
					let dataB = {
						"namaStrategy": tampungKPI[i].namaStrategy,
						"kpi": tampungKPI[i].namaKPI,
						"bobot": tampungKPI[i].bobotKPI,
						"satuanHasil": tampungKPI[i].namaSatuanHasil,
						"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
						"target": tampungKPI[i].targetKPIMin,
						"sumberData": tampungKPI[i].namaAsalData,
						"namaPeriodeData": tampungKPI[i].namaPeriodeData,
						"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
					}
					dataBussines.push(dataB);
				}else if(tampungKPI[i].kdPerspective == 4){
					let dataL = {
						"namaStrategy": tampungKPI[i].namaStrategy,
						"kpi": tampungKPI[i].namaKPI,
						"bobot": tampungKPI[i].bobotKPI,
						"satuanHasil": tampungKPI[i].namaSatuanHasil,
						"tipeDataObjek": tampungKPI[i].namaTypeDataObject,
						"target": tampungKPI[i].targetKPIMin,
						"sumberData": tampungKPI[i].namaAsalData,
						"namaPeriodeData": tampungKPI[i].namaPeriodeData,
						"metodePerhitungan":tampungKPI[i].namaMetodeHitung,
					}
					dataLearning.push(dataL);
				}

			}
			this.listFinancial = dataFinancial;
			this.listCustomer = dataCustomer;
			this.listBusiness = dataBussines;
			this.listLearning = dataLearning;
		
		});

		
	}

	simpanKPIPegawai(){

		let dataSimpanKPIPegawai;
		let tampungData = [];
		let kdStrategy:any;
		let kdStg:any;
		let kdPer:any;
		let kdActual:any;
		let dataKosong:any;
		console.log(this.dataInputKPI);
		for(let i=0; i < this.dataInputKPI.length; i++){
			if(this.dataInputKPI[i].strategi.kode != null){
			
			kdStrategy = this.dataInputKPI[i].strategi.kode.kode;
			kdPer = this.dataInputKPI[i].perspective.kode.kode;
			kdActual = this.dataInputKPI[i].kdMetodeHitungActual;
			if(kdStrategy != undefined){
				kdStg = this.dataInputKPI[i].strategi.kode.kode;
			}else{
				kdStg = this.dataInputKPI[i].strategi.kode;
			}

			if(kdPer != undefined){
				kdPer = this.dataInputKPI[i].perspective.kode.kode;
			}else{
				kdPer = this.dataInputKPI[i].perspective.kode;
			}

			if(kdActual == null){
				kdActual = this.dataInputKPI[i].kpi.kdMetodeHitungActual;
			}else{
			    kdActual = this.dataInputKPI[i].kdMetodeHitungActual;
			}

			let dat = {
				"bobotKPI": parseInt(this.dataInputKPI[i].bobotKPI),
      			"bobotKPISK": 0,
      			"kdDepartemenD": this.kdDep,
      			"kdKPI": this.dataInputKPI[i].kpi.kode,
      			"kdKPISK": 0,
      			"kdMetodeHitungActual": kdActual,
      			"kdMetodeHitungActualSK": 0,
      			"kdPegawai": this.kdPgw,
      			"kdPeriodeDataSK": 0,
      			"kdPerspectiveD": kdPer,
				"kdStrategyD": kdStg,
      			"keteranganLainnya": "string",
      			"noHistori": this.nHistori,
      			"noHistoriActual": "string",
      			"noPosting": "string",
      			"noRec": "string",
      			"noRetur": null,
      			"noSK": null,
      			"noVerifikasi": null,
      			"noVerifikasiActual": "string",
      			"statusEnabled": true,
      			"targetKPI": parseInt(this.dataInputKPI[i].targetKPIMin),
      			"targetKPIMaxSK": 0,
      			"targetKPIMinSK": 0,  
      			"totalActualKPI": 0,
      			"totalScoreKPI": 0,
      			"version": 0
			}
			tampungData.push(dat);
			}else{
				dataKosong = true;
			}
			
		}

		dataSimpanKPIPegawai = {
			"pegawaiPostingKPIDto":tampungData,
			"tglAkhir": this.tglAkhir,
			"tglAwal": this.tglAwal,
			"tglPosting": this.setTimeStamp(this.tanggalPosting),
		}
		console.log(dataSimpanKPIPegawai);

		if(dataSimpanKPIPegawai.pegawaiPostingKPIDto.length == undefined || dataSimpanKPIPegawai.pegawaiPostingKPIDto.length == 0){
			this.alertService.warn('Peringatan','Tidak Ada Data Untuk Di Simpan');
		  }else if(dataKosong == true){
			this.alertService.warn('Peringatan','Data Yang Ditambah Belum Terisi Dengan Benar');
		  }else{
			//console.log('ok post ke backend');
			this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi/save', dataSimpanKPIPegawai).subscribe(response => {
			  this.alertService.success('Simpan', 'Data Disimpan');
			  this.inputKPIPOP = false;
			  this.dataInputKPI = [];
			});
		  }


	}

	batalKPIPegawai(){
		this.inputKPIPOP = false;
		//this.dataInputKPI = [];
	}

	pilihDataF(event){

	}

	pilihDataC(event){

	}

	pilihDataB(event){

	}

	pilihDataL(event){

	}

	pilihPegawai(event){
		this.kdPgw = event.data.kdpegawai;
		let dataFinal = [];
		let dataTemp = [];
		if(this.nHistori == undefined || this.kdDep == undefined){
			this.alertService.warn('Peringatan','Harap Pilih Periode atau Departemen Terlebih Dahulu')
		}else{

			this.inputKPIPOP = true;
			//ini tanggal dari periode
			this.tanggalPosting = new Date(this.tglAwal * 1000);
			let tglAwalPer = new Date(this.tglAwal * 1000);
			let tglAkhirPer = new Date(this.tglAkhir * 1000);
			// let monthPer = tglAwalPer.getMonth();
			// let yearPer = tglAwalPer.getFullYear();
			// let datePer = tglAwalPer.getDate();
			// let monthPerAk = tglAkhirPer.getMonth();
			// let yearPerAk = tglAkhirPer.getFullYear();

			//ini tanggal hari ini
			// let month = this.todayP.getMonth();
			// let year = this.todayP.getFullYear();
			// let prevDate = datePer;
			// let prevMonth = monthPer;
			// let prevYear = yearPer;
		
			// let nextMonth = monthPerAk;
			// let nextYear = yearPerAk;

			this.minDate = this.tanggalPosting;
			this.maxDate = tglAkhirPer;
			// this.minDate.setDate(prevDate);
			// this.minDate.setMonth(prevMonth);
			// this.minDate.setFullYear(prevYear);
			// this.maxDate.setMonth(nextMonth);
			// this.maxDate.setFullYear(nextYear);
			

			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKodeV2/' + this.nHistori+'/'+ this.kdDep).subscribe(res => {
				dataTemp = res.ProfileHistoriStrategyMapDKPI;
				for(let i=0; i<dataTemp.length; i++){
					let dataTampung = {
						"nomor":null,
						"perspective":{
							"namaPerspective":dataTemp[i].namaPerspective,
							"kode":dataTemp[i].kdPerspective
						},
						"strategi":{
							"namaStrategy":dataTemp[i].namaStrategy,
							"kode":dataTemp[i].kdStrategy
						},
						"kpi":{
							"namaKPI":dataTemp[i].namaKPI,
							"kode":dataTemp[i].kdKPI,
							"namaSatuanHasil":dataTemp[i].namaSatuanHasil,
							"namaTypeDataObjek":dataTemp[i].namaTypeDataObject,
							"namaMetodeHitung":dataTemp[i].namaMetodeHitung
						},
						"bobotKPI":dataTemp[i].bobotKPI,
						"namaSatuanHasil":dataTemp[i].namaSatuanHasil,
						"namaTypeDataObjek":dataTemp[i].namaTypeDataObject,
						"targetKPIMin":dataTemp[i].targetKPIMin,
						"asal":{
							"namaAsal":dataTemp[i].namaAsalData,
							"kdAsal":dataTemp[i].kdAsalData,
						},
						"periodeData":{
							"namaPeriode":dataTemp[i].namaPeriodeData,
							"kode":{
								"kdProfile":null,
								"id_kode":dataTemp[i].kdPeriodeData
							}
						},
						"namaMetodeHitung":dataTemp[i].namaMetodeHitung,
						"kdMetodeHitungActual":dataTemp[i].kdMetodeHitungActual
					};
					dataFinal.push(dataTampung);
				}
				let data = [...dataTemp];
				data = dataFinal;
				this.dataInputKPI = data;
			});

		}

	}

	loadPagePeriode(event: LazyLoadEvent){

	}

	loadPageF(event: LazyLoadEvent){

	}

	loadPageC(event: LazyLoadEvent){

	}

	loadPageB(event: LazyLoadEvent){

	}

	loadPageL(event: LazyLoadEvent){

	}
	loadPageP(event: LazyLoadEvent){

	}

	tambahKPIPegawai(){
		if(this.dataInputKPI.length == 0){
			let dataTemp = {
				"nomor":null,
				"perspective":{
					"namaPerspective":"-Pilih Perspective-",
					"kode":null,
				},
				"strategi":{
					"namaStrategy":"-Pilih Strategi-",
					"kode":null,
				},
				"kpi":{
					"namaKPI":"-Pilih KPI-",
					"kode": null,
				},
				"bobotKPI":null,
				"namaSatuanHasil":null,
				"namaTypeDataObjek":null,
				"targetKPIMin":null,
				"asal":{
					"namaAsal":"-Pilih Asal Data-",
					"kode":null
				},
				"periodeData":{
					"namaPeriode":"-Pilih Periode Data-",
					"kdProfile":null,
					"kode":null
				},
				"namaMetodeHitung":null,
				"kdMetodeHitungActual":null
			}
			let dataInputKPI = [...this.dataInputKPI];
			dataInputKPI.push(dataTemp);
			this.dataInputKPI = dataInputKPI;
		}else{
			let last = this.dataInputKPI.length - 1;
			if( this.dataInputKPI[last].perspective.kode == null
				|| this.dataInputKPI[last].strategi.kode == null
				|| this.dataInputKPI[last].kpi.kode == null 
				|| this.dataInputKPI[last].bobotKPI == null 
				|| this.dataInputKPI[last].bobotKPI == '' 
				|| this.dataInputKPI[last].targetKPIMin == null
				|| this.dataInputKPI[last].targetKPIMin == '' 
				|| this.dataInputKPI[last].asal.kdAsal == null
				|| this.dataInputKPI[last].periodeData.kode == null  ){
				this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
			}else{

				// for (let i = 0; i < this.listKPI.length; i++) {
				// 	if (this.listKPI[i].value.kode == this.dataInputKPI[last].kpi.kode) {
				// 		this.listKPI.splice(i, 1);
				// 	}
				// }

				let dataTemp = {
					"nomor":null,
					"perspective":{
						"namaPerspective":"-Pilih Perspective-",
						"kode":null,
					},
					"strategi":{
						"namaStrategy":"-Pilih Strategi-",
						"kode":null,
					},
					"kpi":{
						"namaKPI":"-Pilih KPI-",
						"kode": null,
					},
					"bobotKPI":null,
					"namaSatuanHasil":null,
					"namaTypeDataObjek":null,
					"targetKPIMin":null,
					"asal":{
						"namaAsal":"-pilih Asal Data-",
						"kode":null
					},
					"periodeData":{
						"namaPeriode":"-Pilih Periode Data-",
						"kdProfile":null,
						"kode":null
					},
					"namaMetodeHitung":null,
					"kdMetodeHitungActual":null
				}
				let dataInputKPI = [...this.dataInputKPI];
				dataInputKPI.push(dataTemp);
				this.dataInputKPI = dataInputKPI;
			}
		}
	}

	hapusKpiPegawai(row){
		let dataInputKPI = [...this.dataInputKPI];
		dataInputKPI.splice(row, 1);
		this.dataInputKPI = dataInputKPI;
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

	
}

