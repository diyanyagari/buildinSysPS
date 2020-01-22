import { Component, OnInit, Renderer } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';


@Component({
  selector: 'app-daftar-monitoring-pengajuan-realisasi-kpi-pegawai',
  templateUrl: './daftar-monitoring-pengajuan-realisasi-kpi-pegawai.component.html',
  styleUrls: ['./daftar-monitoring-pengajuan-realisasi-kpi-pegawai.component.scss'],
  providers: [ConfirmationService]
})
export class DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent implements OnInit {

    page:number;
  	rows:number;
  	totalRecords: number;
  	listPeriodeHead:any[];
  	kodeHeadPeriode:any;
  	listPeriode:any[];
    selectedPeriode:any;
	listMonitoringPengajuanRealisasiKpiPegawai:any[];
	//expandedDetail:any[];
	dialogDetailRealisasi:boolean;
	dataDetailKPI:any[];
	dialogDetailKpi:boolean;
	dataNoVerifikasi: any[];
	approved: any;
	totalApprove: any;
	dialogDetailNoVerifikasi: boolean;
	dialogKeputusan:boolean;
	formKeputusan: any;
	listKeputusan:any[];
	kdkeputusanKeteranganAlasan:any;
	provide:any;
	KeteranganAlasanDisetujui:any;
	formSk: any;
	buttonAktifCek: boolean;
	buttonAktifSkTersedia: boolean;
	kdJenisKeputusan: any;
	generatesk: any;
	checkboxAktifCek: boolean;
	cekOtomatis:boolean;
	minDate: any;
	minDateAwal: any;
	listJenisKeputusan: any[];
	listDataBsc: any[];
	expired: any;
	tglExpired: any;
	noSk: any;
	noPosting:any;
	userData:any;
	buttonAktif:boolean;
	listDataKeputusanVerifikasi:any[];
	listMetodePerhitungan:any[];
	selectedDataKeputusanVerifikasi:any;
	expandedDetail: Array<any> = new Array<any>();
	listIndux:any[];
	metodePerAcText:any;
	perspektifText:any;
	strategiText:any;
	kpiText:any;
	periodeRealisasiText:any;
	listDataDetailRealisasi:any[];
	selectedDataRealisasiDetail:any;
	dataTampung:any[];
	kdKPI:any;
	kdPegawai:any;
	totalRealisasi:any;
	noVerif:any;
	periodeRealisasiAkhirText:any;
	dataDetailBulan:any[];
	dataTampungDetail:any[];

  constructor(
    private httpService: HttpClient,
	private alertService: AlertService,
	private confirmationService: ConfirmationService,
	private authGuard: AuthGuard,
	private fb: FormBuilder,
	private renderer: Renderer
  ) { }

  ngOnInit() {
	this.dialogDetailRealisasi = false;
    if (this.page == undefined || this.rows == undefined) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
	}

	let today = new Date();
	today.setDate(today.getDate());
	let month = today.getMonth();
	let year = today.getFullYear();
	this.minDate = new Date();
	this.minDate.setDate(this.minDate.getDate());
	this.minDate.setMonth(month);
	this.minDate.setFullYear(year);
	this.minDateAwal = new Date();
	this.minDateAwal.setDate(this.minDateAwal.getDate());
	this.minDateAwal.setMonth(month);
	this.minDateAwal.setFullYear(year);
	this.buttonAktif = true;
	this.expired = false;
	this.buttonAktifSkTersedia = false;
	this.buttonAktifCek = true;
	this.checkboxAktifCek = true;
	this.provide = false;
	//this.cekOtomatis = true;
	this.listMonitoringPengajuanRealisasiKpiPegawai = [];
	this.dataTampung = [];
	this.dataTampungDetail = [];
	this.listDataDetailRealisasi = [];
	
	this.formKeputusan = this.fb.group({
		'noPengajuan': new FormControl({ value: '', disabled: true }),
		'namaPegawai': new FormControl({ value: '', disabled: true }),
		'nik': new FormControl({ value: '', disabled: true }),
		'jenisKelamin': new FormControl({ value: '', disabled: true }),
		'jenisPegawai': new FormControl({ value: '', disabled: true }),
		'jabatan': new FormControl({ value: '', disabled: true }),
		'unitKerja': new FormControl({ value: '', disabled: true }),
		'tanggalVerifikasi': new FormControl(new Date(), Validators.required),
		//'metodePerhitungan': new FormControl(null,Validators.required),
		'keputusan': new FormControl('', Validators.required),
		'catatan': new FormControl(null)
	});

	this.formSk = this.fb.group({
		'noSk': new FormControl({ value: '', disabled: true }),
		'namaSk': new FormControl({ value: '', disabled: true }),
		'jenisKeputusan': new FormControl({ value: '', disabled: false }, Validators.required),
		'periodeAwalSk': new FormControl(today, Validators.required),
		'periodeAkhirSk': new FormControl(today, Validators.required),
		'noSkTerakhir': new FormControl({ value: '', disabled: true }),
		'noSkSekarang': new FormControl({ value: null, disabled: true }),
		//'cekOtomatis': new FormControl(true),
	});

	this.getPeriodeHead(this.page,this.rows);
	
		//ambil list keputusan yang di dialog keputusan dropdownnya
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findKeteranganAlasanApproval').subscribe(table => {
			this.listKeputusan = [];
			this.listKeputusan.push({ label: '--Pilih Keputusan--', value: '' })
			for (var i = 0; i < table.data.ketaranganAlasan.length; i++) {
				this.listKeputusan.push({ label: table.data.ketaranganAlasan[i].namaKeteranganAlasan, value: table.data.ketaranganAlasan[i].kdKeteranganAlasan })
			};
		});

		this.httpService.get(Configuration.get().dataMaster + "/keteranganalasan/findKeteranganAlasanDisetujui").subscribe(result => {
			this.KeteranganAlasanDisetujui = result.kode.kode;
		});
    
  }

  getPeriodeHead(page: number, rows: number) {

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
			this.listMonitoringPengajuanRealisasiKpiPegawai = [];
		}
    
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

  pilihPeriode(event){
	//this.buttonAktif = true;
    let tglAwalPeriode = event.data.tglAwalPeriode;
	let tglAkhirPeriode = event.data.tglAkhirPeriode;
	this.getDataPeriode(tglAwalPeriode,tglAkhirPeriode);
	//this.getDataDetailPeriode(tglAwalPeriode,tglAkhirPeriode);
  }

  pushPeriode(){
	this.getDataPushPeriode();
	this.expandDetail();
  }

  getDataPeriode(tglAwal,tglAkhir){
	//ambil data monitoring dari periode tahun yang dipilih
	this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findAllByApprovalV2?page='+this.page+'&rows='+this.rows+'&dir=noSk&sort=desc&periodeAwal='+tglAwal+'&periodeAhir='+tglAkhir).subscribe(table => {
		this.dataTampung = table.data.data;
		this.totalRecords = table.data.totalRow;
		//bisa juga panggil disini sekalian ga usah pas di event onRowSelect periode
		this.pushPeriode();
	});

  }

//   getDataDetailPeriode(tglAwal,tglAkhir){
// 	this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findAllByApproval?page='+this.page+'&rows='+this.rows+'&dir=noPosting&sort=desc&periodeAwal='+tglAwal+'&periodeAhir='+tglAkhir).subscribe(table => {
// 		// this.dataTampungDetail = table.data.data;
// 	});
//   }
  

  getDataPushPeriode(){
	let dataTM = {}
	let dataT = [];
	let dataLMT = [];
	let dataAnakT = [];


	for(let i=0; i < this.dataTampung.length; i++){
		for(let x=0; x < this.dataTampung[i].children.length; x++){
			let dataAnak = 
				{
					"expanded": true,
					"periodeRealisasi":"",
					"namaPerspective":this.dataTampung[i].children[x].namaPerspective,
					"namaStrategy":this.dataTampung[i].children[x].namaStrategy,
					"namaKPI":this.dataTampung[i].children[x].namaKPI,
					"kdKPI":this.dataTampung[i].children[x].kdKPI,
					"kdPegawai":this.dataTampung[i].children[x].kdPegawai,
					"bobotKPISK":this.dataTampung[i].children[x].bobotKPISK,
					"satuanHasil":"",
					"tipeDataObjek":"",
					"targetKPI":this.dataTampung[i].children[x].targetKPI,
					"sumberData":this.dataTampung[i].children[x].sumberData,
					"namaPeriode":this.dataTampung[i].children[x].namaPeriode,
					"metodePerhitungan":this.dataTampung[i].children[x].metodePerhitungan,
					"realisasi":this.dataTampung[i].children[x].realisasi,
					"metodePerhitunganSK":this.dataTampung[i].children[x].metodePerhitunganSK,
					"noPosting":this.dataTampung[i].children[x].noPosting,
					"actualKPI":this.dataTampung[i].children[x].actualKPI,
					"noSKd":this.dataTampung[i].children[x].noSK,
					"noVerifikasi":this.dataTampung[i].children[x].noVerifikasi,
					"tglBerlakuAkhir":this.dataTampung[i].children[x].tglBerlakuAkhir,
					"tglBerlakuAwal":this.dataTampung[i].children[x].tglBerlakuAwal,
					"totalApprove":this.dataTampung[i].children[x].totalApprove
				}

				dataAnakT.push(dataAnak);
		}
					
			dataTM = {
				"expanded": true,
				"noPosting":this.dataTampung[i].noPosting,
				"tglPengajuan":this.dataTampung[i].tglPengajuan,
				"namaLengkap":this.dataTampung[i].namaLengkap,
				"nik":this.dataTampung[i].nik,
				"namaJabatan":this.dataTampung[i].namaJabatan,
				"unitKerjaPegawai":this.dataTampung[i].unitKerjaPegawai,
				"totalApprove":this.dataTampung[i].totalApprove,
				"tglBerlakuAwal":this.dataTampung[i].tglBerlakuAwal,
				"tglBerlakuAkhir":this.dataTampung[i].tglBerlakuAkhir,
				"noSK":this.dataTampung[i].noSK,
				"noVerifikasi":this.dataTampung[i].noVerifikasi,
				"detail": dataAnakT
				//"detail": dataT[i].detailInduk
				}
				
		dataLMT.push(dataTM);
		dataAnakT = [];
	}
	//console.log(dataLMT);
	//this.totalRecords = table.data.totalRow;
	this.listMonitoringPengajuanRealisasiKpiPegawai = dataLMT;
	console.log(this.listMonitoringPengajuanRealisasiKpiPegawai);
  }


  pilihDataRealisasi(event){
	
	this.provide = false;
	this.buttonAktif = false;
	this.noSk = event.data.noSKd;
	this.noVerif = event.data.noVerifikasi;
	this.noPosting = event.data.noPosting;
	this.expired = event.data.expired;
	this.tglExpired = event.data.tglExpired;
	this.kdKPI = event.data.detail[0].kdKPI;
	this.kdPegawai = event.data.detail[0].kdPegawai;
	this.totalRealisasi = event.data.detail[0].actualKPI;
	// this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/checkHavingProvideSk?noPosting=' + this.noPosting).subscribe(res => {
	// 	this.provide = res.data.isHavingProvideSk;
	// });
	// this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findVerifikasiByNoPlanning?noPlanning=' + this.noPosting).subscribe(table => {
	// 	this.dataNoVerifikasi = table.data.data;
	// 	this.approved = table.data.approved;
	// 	this.totalApprove = table.data.totalApprove;
	// });

  }

  pilihDataDetail(event){
	this.buttonAktif = false;
	this.noSk = event.data.noSKd;
	this.noVerif = event.data.noVerifikasi;
	this.noPosting = event.data.noPosting;
	this.kdKPI = event.data.kdKPI;
	this.kdPegawai = event.data.kdPegawai;
	this.totalRealisasi = event.data.actualKPI;
  }

  expandDetail() {
	var exists = false;
	this.expandedDetail = [];
	for (let i = 0; i < this.listMonitoringPengajuanRealisasiKpiPegawai.length; i++) {
		this.expandedDetail.forEach(x => {
			if (x.noPosting == this.listMonitoringPengajuanRealisasiKpiPegawai[i].noPosting) exists = true;
		});
		if (!exists || exists) {
			this.expandedDetail.push(this.listMonitoringPengajuanRealisasiKpiPegawai[i]);
		}
	}
	}

	detailRealisasi(data){
		let dataTemp = [];
		let dT = [];
		let dTtotal = [];
		this.dataDetailBulan = [];
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findByKdProfileAndNoPostingForDetail/'+ data.kdKPI + '/' + data.kdPegawai + '/' + data.noSKd).subscribe(table => {
			
			dataTemp = table.PegawaiPostingKPI;
			this.metodePerAcText=table.PegawaiPostingKPI[0].namaMetodeHitung;
			this.perspektifText=table.PegawaiPostingKPI[0].namaPerspective;
			this.strategiText=table.PegawaiPostingKPI[0].namaStrategy;
			this.kpiText=table.PegawaiPostingKPI[0].namaKPI;
			this.periodeRealisasiText=table.PegawaiPostingKPI[0].tglAwal;
			this.periodeRealisasiAkhirText=table.PegawaiPostingKPI[0].tglAkhir;

			let bulanAwal = new Date(this.periodeRealisasiText * 1000).getMonth();
			let bulanAkhir = new Date(this.periodeRealisasiAkhirText * 1000).getMonth();
			let tahun = new Date(this.periodeRealisasiText * 1000).getFullYear();
			let total = 0;
			let month = ["Januari"+ tahun, "Februari"+ tahun, "Maret"+ tahun, "April"+ tahun, "Mei"+ tahun, "Juni"+ tahun, "Juli"+ tahun, "Agustus"+ tahun, "September"+ tahun, "Oktober"+ tahun, "November"+ tahun, "Desember"+ tahun];
		
			//ambil total aja
			for(let i=0; i<dataTemp.length; i++){
				total = total + dataTemp[i].actualKPIODT;
			}
			
			let datArray = {
				"total":total
			}
			dT.push(datArray);
			
			let listDataDetailRealisasi = [...this.listDataDetailRealisasi];
			listDataDetailRealisasi = dT;
			this.listDataDetailRealisasi = listDataDetailRealisasi;
			//console.log(this.listDataDetailRealisasi);


			//ambil range nama bulan
			if(dataTemp.length > 1){
				let y = 0;
				for(let x = bulanAwal; x <= bulanAkhir; x++){
					let dataFArray = {
						"namaBulan":month[x],
						"nilai":dataTemp[y].actualKPIODT
					}
					this.dataDetailBulan.push(dataFArray);
					y = y+1;
				}
				console.log(this.dataDetailBulan);
				//console.log(total)
			}else if(dataTemp.length == 1){
				this.dataDetailBulan = [];
				let dataTotalArray = {
					"total": total
				}
				dTtotal.push(dataTotalArray);
				let listDataDetailRealisasi = [...this.listDataDetailRealisasi];
				listDataDetailRealisasi = dTtotal;
				this.listDataDetailRealisasi = listDataDetailRealisasi;
			}

		});
		this.dialogDetailRealisasi = true;
	}

	onDialogHide() {
		//this.reset()
		this.dialogDetailRealisasi = false;
	}


	detailKpiPegawai(noPosting:any){
		// this.httpService.get(Configuration.get().dataBSC + '/pegawaipostingkpi/findByKdProfileAndNoPosting/' + noPosting).subscribe(table => {
		// 	this.dataDetailKPI = table.PegawaiPostingKPI;
		// });
		// this.dialogDetailKpi = true;
	}

	detailNoVerifikasi(noPosting:any){
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findVerifikasiByNoPlanning?noPlanning=' + noPosting).subscribe(table => {
			this.dataNoVerifikasi = table.data.data;
			this.approved = table.data.approved;
			this.totalApprove = table.data.totalApprove;
		});
		this.dialogDetailNoVerifikasi = true;
	}

	selectKeputusanKeteranganAlasan(event){
		if (event.value == this.KeteranganAlasanDisetujui) {
			this.httpService.get(Configuration.get().dataMaster + "/jeniskeputusan/findJenisKeputusanDisetujui").subscribe(result => {
				this.kdJenisKeputusan = result.kode.kode;
				this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisKeputusan&select=id.kode,namaJenisKeputusan,isGenerateSK&page=1&rows=1000&criteria=id.kode&values=' + this.kdJenisKeputusan + '&condition=and&profile=y').subscribe(table => {
					this.formSk.get('jenisKeputusan').setValue({ id_kode: table.data.data[0].id_kode, namaJenisKeputusan: table.data.data[0].namaJenisKeputusan, isGenerateSK: table.data.data[0].isGenerateSK });
					this.generatesk = table.data.data[0].isGenerateSK;
					if (table.data.data[0].isGenerateSK == 1) {
						//this.formSk.get('cekOtomatis').enable();
						this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Pengajuan_Realisasi_KPI).subscribe(table => {
							this.formSk.get('noSkTerakhir').setValue(table.noSKIntern);
						});
					} else if (table.data.data[0].isGenerateSK == 0) {
						this.checkboxAktifCek = true;
						//this.formSk.get('cekOtomatis').setValue(true);

						this.formSk.get('noSkSekarang').disable();
						//this.formSk.get('cekOtomatis').disable();
						this.formSk.get('noSkTerakhir').disable();
						this.formSk.get('noSkSekarang').setValue('');
						this.formSk.get('noSkTerakhir').setValue('');
					}
				});
			});

		} else {
			this.httpService.get(Configuration.get().dataHr1Mod2 + '/pengajuanPinjaman/findJenisKeputusanTidakDisetujui').subscribe(result => {
				this.kdJenisKeputusan = result.data.kode.kode;
				this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisKeputusan&select=id.kode,namaJenisKeputusan,isGenerateSK&page=1&rows=1000&criteria=id.kode&values=' + this.kdJenisKeputusan + '&condition=and&profile=y').subscribe(table => {
					this.formSk.get('jenisKeputusan').setValue({ id_kode: table.data.data[0].id_kode, namaJenisKeputusan: table.data.data[0].namaJenisKeputusan, isGenerateSK: table.data.data[0].isGenerateSK });
					this.generatesk = table.data.data[0].isGenerateSK;
					if (table.data.data[0].isGenerateSK == 1) {
						//this.formSk.get('cekOtomatis').enable();
						this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Pengajuan_Realisasi_KPI).subscribe(table => {
							this.formSk.get('noSkTerakhir').setValue(table.noSKIntern);
						});
					} else if (table.data.data[0].isGenerateSK == 0) {
						this.checkboxAktifCek = true;
						//this.formSk.get('cekOtomatis').setValue(true);
						this.formSk.get('noSkSekarang').disable();
						//this.formSk.get('cekOtomatis').disable();
						this.formSk.get('noSkTerakhir').disable();
						this.formSk.get('periodeAwalSk').disable();
						this.formSk.get('periodeAkhirSk').disable();
						this.formSk.get('noSkSekarang').setValue('');
						this.formSk.get('noSkTerakhir').setValue('');
					}
				});
			});
		}
	}

	otomatis(event){
		if (event == true) {
			this.buttonAktifCek = true;
			this.formSk.get('noSkSekarang').setValue(null);
			this.formSk.get('noSkSekarang').disable();
			this.buttonAktifSkTersedia = false;
		} else {
			this.buttonAktifCek = false;
			this.buttonAktifSkTersedia = true;
			this.formSk.get('noSkSekarang').setValue(this.formSk.get('noSkTerakhir').value);
			this.formSk.get('noSkSekarang').enable();
		}
	}

	changeValue(event){
		this.buttonAktifSkTersedia = true;
	}

	cekNoSk(){
		let hasilCek = false;
		let noSkSekarang = this.formSk.get('noSkSekarang').value;
		if (noSkSekarang == null || noSkSekarang == "" || noSkSekarang == undefined) {
			this.buttonAktifSkTersedia = true;
		} else {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/checkNoSKIntern?noSKIntern=' + noSkSekarang + '&kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Pengajuan_Realisasi_KPI).subscribe(res => {
				hasilCek = res.status;
				this.buttonAktifSkTersedia = false;
				if (hasilCek == true) {
					this.alertService.success("Berhasil", "No SK Bisa Digunakan");
					this.buttonAktifSkTersedia = false;
				} else {
					this.alertService.warn("Peringatan", "No SK Sudah Digunakan");
					this.buttonAktifSkTersedia = true;
				}
			});
		}
	}

	setMinDate(event){
		let month = event.getMonth();
		let year = event.getFullYear();
		this.minDate = event;
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
		this.formSk.get('periodeAkhirSk').setValue('');
	}

	isGenerateSK(event) {
		let gen = event.value.isGenerateSK;
		this.generatesk = gen;

		if (gen == 1) {
			this.checkboxAktifCek = false;
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Pengajuan_Realisasi_KPI).subscribe(table => {
				this.formSk.get('noSkTerakhir').setValue(table.noSKIntern);
			});
		}
		else {
			this.checkboxAktifCek = true;
			//this.formSk.get('cekOtomatis').setValue(true);
			this.formSk.get('noSkTerakhir').setValue('');
			this.formSk.get('noSkSekarang').disable();
			this.formSk.get('noSkSekarang').setValue(null);
		}
	}

	reset(){
		this.formKeputusan.get('catatan').enable();
		this.formKeputusan.get('keputusan').enable();
		this.formKeputusan.get('catatan').enable();
		this.formKeputusan.get('tanggalVerifikasi').enable();
		this.formSk.get('periodeAwalSk').enable();
		this.formSk.get('periodeAkhirSk').enable();
		this.formSk.get('noSkSekarang').enable();
		//this.formSk.get('cekOtomatis').enable();
		this.formSk.get('jenisKeputusan').enable();
		this.provide=false;
		this.dialogKeputusan = false;
		this.listMonitoringPengajuanRealisasiKpiPegawai = [];
		this.selectedPeriode = [];
		this.ngOnInit();
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

	onSubmit(){
		if (this.provide == false) {
			if (this.formKeputusan.invalid) {
				this.validateAllFormFields(this.formKeputusan);
				this.alertService.warn("Peringatan", "Data Tidak Sesuai")
			}else{
				this.simpanKeputusan();
			}
		} else {
			if (this.formKeputusan.invalid) {
				this.validateAllFormFields(this.formKeputusan);
				this.alertService.warn("Peringatan", "Data Tidak Sesuai")
			} else if (this.formSk.invalid) {
				this.validateAllFormFields(this.formSk);
				this.alertService.warn("Peringatan", "Data Tidak Sesuai")
			}else {
				this.simpanKeputusan();
			}
		}
	}

	simpanKeputusan(){
		let dataTempCek = [];
		let kdMetodeActual;
		let bobotK;
		let bobotKPSK;
		let kdKPISk;
		let tanggalVerif = this.setTimeStamp(this.formKeputusan.get('tanggalVerifikasi').value);
		let tanggalBerlakuAwal = this.setTimeStamp(this.formSk.get('periodeAwalSk').value);
		let tanggalBerlakuAkhir = this.setTimeStamp(this.formSk.get('periodeAkhirSk').value);
		let noSkIntern = this.formSk.get('noSkSekarang').value;
		
		// if(this.provide == true){

			let formSubmit = {

				"catatan": this.formKeputusan.get('catatan').value,
				"isGenerateSK": this.generatesk,
				"kdJenisKeputusan": this.formSk.get('jenisKeputusan').value.id_kode,
				"kdKeteranganAlasan": this.formKeputusan.get('keputusan').value,
				"keterangan": this.formKeputusan.get('catatan').value,
				"noPosting":this.noPosting,
				"noPostingPegawaiPostingKPI":"string",
				"noSkIntern": "string",
				"pegawaiPostingKPIActualDto": [
					{
					  "actualKPI": this.totalRealisasi,
					  "actualKPIODT": 0,
					  "kdKPI": this.kdKPI,
					  "kdPegawai": this.kdPegawai,
					  "noPosting": this.noPosting,
					  "noRec": "string",
					  "noRetur": "string",
					  "noSK": this.noSk,
					  "noVerifikasi": "string",
					  "statusEnabled": true
					}
				  ],
				//"noVerifikasi":"string",
				"periodeAhir": 0,
				"periodeAwal": 0,
				"tglVerifikasi": 0,
				
			}
			console.log(formSubmit);
			this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi-actual/verifikasiV2', formSubmit).subscribe(response => {
				if (noSkIntern == null) {
					this.buttonAktifSkTersedia = true;
					this.formKeputusan.get('catatan').disable();
					this.formKeputusan.get('keputusan').disable();
					this.formKeputusan.get('catatan').disable();
					this.formKeputusan.get('tanggalVerifikasi').disable();
					this.formSk.get('periodeAwalSk').disable();
					this.formSk.get('periodeAkhirSk').disable();
					this.formSk.get('noSkSekarang').disable();
					//this.formSk.get('cekOtomatis').disable();
					this.formSk.get('jenisKeputusan').disable();
					this.alertService.success('Berhasil', 'Keputusan Disimpan');
					this.formSk.get('noSkSekarang').setValue(response.data.noSk);
				} else {
					this.alertService.success('Berhasil', 'Keputusan Disimpan');
					this.dialogKeputusan = false;
					this.ngOnInit();
				}
			});
		// }else{
		// 	let formSubmit = {
		// 		"catatan": this.formKeputusan.get('catatan').value,
		// 		"kdKeteranganAlasan": this.formKeputusan.get('keputusan').value,
		// 		"noPosting": "string",
		// 		"tglVerifikasi": tanggalVerif,
		// 		"kdJenisKeputusan": null,
		// 		"keterangan": null,
		// 		"periodeAhir": null,
		// 		"periodeAwal": null,
		// 	}
			// this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi-actual/verifikasiV3', formSubmit).subscribe(response => {
			// 	this.alertService.success('Berhasil', 'Keputusan Disimpan');
			// 	this.dialogKeputusan = false;
			// 	this.ngOnInit();
			// });
		//}
	
	
	}

	// getGridKeputusan(){

	// 	this.httpService.get(Configuration.get().dataBSC + '/pegawaipostingkpi/findByKdProfileAndNoPosting/' + this.noPosting).subscribe(table => {
	// 		this.listDataBsc = table.PegawaiPostingKPI;
	// 	});
	
	//   }

	keputusan(){
		//this.getGridKeputusan();
		this.checkboxAktifCek = true;
		let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
		// if (this.noSk != null && this.noSk != "-") {
		// 	this.alertService.warn('Peringatan', 'Pengajuan Sudah Memiliki SK');
		// } else 

		if(this.noVerif != null || this.noVerif != undefined){
			this.alertService.warn('Peringatan', 'Pengajuan Sudah Di Verifikasi');
		}
		// else if (this.expired == true) {
		// 	this.alertService.warn('Peringatan', 'SK Approval Sudah Tidak Berlaku, Tanggal Akhir Berlaku SK : ' + new Date(this.tglExpired * 1000).getDate() + ' ' + month[new Date(this.tglExpired * 1000).getMonth()] + ' ' + new Date(this.tglExpired * 1000).getFullYear());
		// } else if (this.approved == 0 && this.totalApprove == 0) {
		// 	this.alertService.warn('Peringatan', 'Surat Keputusan Approval Tidak Ditemukan');
		 else {

			// this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findVerifikasiByNoPlanning?noPlanning=' + this.noPosting).subscribe(table => {
			// 	this.dataNoVerifikasi = table.data.data;
			// 	this.approved = table.data.approved;
			// 	this.totalApprove = table.data.totalApprove;
			// });

			
			this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi-actual/findPegawaiByKdPegawai?kdPegawai=' + this.authGuard.getUserDto().idPegawai).subscribe(table => {
				this.formKeputusan.get('noPengajuan').setValue(this.noPosting);
				this.formKeputusan.get('namaPegawai').setValue(table.data.namaLengkap);
				this.formKeputusan.get('nik').setValue(table.data.nik);
				this.formKeputusan.get('jenisKelamin').setValue(table.data.jenisKelamin);
				this.formKeputusan.get('jenisPegawai').setValue(table.data.jenisPegawai);
				this.formKeputusan.get('jabatan').setValue(table.data.namaJabatan);
				this.formKeputusan.get('unitKerja').setValue(table.data.namaRuangan);
			});
			this.dialogKeputusan = true;

		}
		
	}

	onRowExpand(data : any){
		var d = document.getElementsByClassName('fa fa-fw ui-c ui-row-toggler fa-chevron-circle-down');
        if (d.length > 0) {
            for (var i = 0; i < d.length; i++) {
                this.renderer.setElementStyle(d[i].parentElement.parentElement.parentElement.nextElementSibling,'display','none')
            }
        }
	}

	tutupPopUp(){
		this.reset();
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
