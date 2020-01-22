import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { TreeNode, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-rekapitulasi-skor-akhir-kpi',
  templateUrl: './rekapitulasi-skor-akhir-kpi.component.html',
  styleUrls: ['./rekapitulasi-skor-akhir-kpi.component.scss'],
  providers: [ConfirmationService]
})
export class RekapitulasiSkorAkhirKpiComponent implements OnInit {
    page:number;
  	rows:number;
    totalRecords: number;
    listPeriodeHead:any[];
    kodeHeadPeriode:any;
    listPeriode:any[];
    selectedPeriode:any;
    typeFilter:any;
    departemenTree:TreeNode[];
    selectedDepartemenNode:any;
    selectedPegawai:any;
    listPegawai:any[];
    totalRecordsPegawai:number;
    listRekap:any[];
    expandedDetail: Array<any> = new Array<any>();
    dataTypeOpt:any;
    onoffD:boolean;
    onoffP:boolean;
    kdDepartemenT:any;
    kdPegawaiT:any;
    tglAwalP:any;
    tglAkhirP:any;

  constructor(
    private httpService: HttpClient,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private authGuard: AuthGuard,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  
    if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
   	}
    this.typeFilter = "departemen";
    this.kodeHeadPeriode = "";
    this.listPeriode = [];
    this.selectedPeriode  = [];
    this.departemenTree = [];
    this.listRekap = [];
    this.getPeriodeHead();
    this.getDepartemenTree();
    this.getPegawai();
    this.getTypePilih(this.typeFilter);

  }

  getPeriodeHead() {

		//ambil periode head
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByKomponen').subscribe(res => {
			this.listPeriodeHead = [];
			this.listPeriodeHead.push({ label: '-- Pilih Periode --', value: null })
			for (var i = 0; i < res.data.listPeriode.length; i++) {
				this.listPeriodeHead.push({ label: res.data.listPeriode[i].namaPeriode, value: res.data.listPeriode[i].kdPeriode })
			};
		});

  }

  getKode(event){
    this.listPeriode = [];
		let periodeKePilih = event.value;
		if(periodeKePilih != null){
			this.ambilPeriodeAnak(periodeKePilih);
		}else if(periodeKePilih == null){
			this.listRekap = [];
		}
  }

  pilihPeriode(event){
    this.tglAwalP = event.data.tglAwalPeriode;
	  this.tglAkhirP = event.data.tglAkhirPeriode;
  }

  ambilPeriodeAnak(kdPeriode) {
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

  getTypePilih(value){
    this.dataTypeOpt = value;
    if(this.dataTypeOpt == "departemen"){
      this.onoffD = false;
      this.onoffP = true;
      this.selectedPegawai = [];
    }else{
      this.onoffD = true;
      this.onoffP = false;
      this.selectedDepartemenNode = [];
    }
  }

  nodeSelectDepartemen(event){
    this.kdDepartemenT = event.node.id_kode;
    this.getDataPushFilter(this.kdDepartemenT);
    this.expandDetail();
  }

  pilihPegawai(event){
    // this.kdPegawaiT = event.data.kdpegawai;
    // this.getDataPushFilter(this.kdPegawaiT);
    // this.expandDetail();
  }

  getDataPushFilter(kode){
    this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findAllByKdDepartemen?page='+this.page+'&rows='+this.rows+'&dir=noSk&sort=desc&kdDepartemen='+kode+'periodeAwal='+this.tglAwalP+'&periodeAhir='+this.tglAkhirP).subscribe(table => {
      this.listRekap  = table.data.data;
      this.totalRecords = table.data.totalRow;
    });
 
  }

  expandDetail() {
    var exists = false;
    this.expandedDetail = [];
    for (let i = 0; i < this.listRekap.length; i++) {
      this.expandedDetail.forEach(x => {
        if (x.noPosting == this.listRekap[i].noPosting) exists = true;
      });
      if (!exists || exists) {
        this.expandedDetail.push(this.listRekap[i]);
      }
    }
    }

  getDepartemenTree(){

		let departemenIA=[];
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
		  this.departemenTree = list_to_tree(departemenIA);
	
		});
	
	
	  }

    getPegawai(){
      //ambil pegawai
		  this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findAllPegawai?page='+this.page+'&rows='+ this.rows+'&dir=namaLengkap&sort=desc').subscribe(res => {
			  this.listPegawai = res.DataPegawai;
		  });
    }

    onRowExpand(event){

    }

    bersih(){
      this.ngOnInit();
    }

    simpan(){

    }




}
