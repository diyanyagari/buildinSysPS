import { Component, OnInit, AfterViewInit, AfterContentInit, ViewEncapsulation, ContentChild, ElementRef, ViewChild, ViewChildren, Renderer2, QueryList, Directive } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { LazyLoadEvent, Message, ConfirmDialogModule, ConfirmationService, TreeModule, TreeNode, TreeDragDropService, DragDropModule, Draggable, Droppable, OrganizationChart, MenuItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { zip } from 'rxjs/observable/zip';
import * as $ from 'jquery';
// import { OnlyNumber } from '../../master/login-user/onlynumber.directive';

@Component({
	selector: 'app-bsc',
	templateUrl: './bsc.component.html',
	styleUrls: ['./bsc.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [TreeDragDropService, ConfirmationService]
})
export class BscComponent implements OnInit, AfterViewInit {

	//@ViewChild("elDo",{read:ElementRef}) elDo: ElementRef; 

	page: number;
	rows: number;
	listDataStrategy: any[];
	perspective: any;
	strategyAll: any;
	tanggalAwal: any;
	tanggalAkhir: any;
	listPerspective: any[];
	Departemen: any[];
	kdDepartemen: any;
	tesTree: TreeNode[];
	departemenTree: TreeNode[];
	departemenTreeN: any[];
	departemenTreeTampung: any[];
	kdDepartemenHead: any;
	formAktif: boolean;
	selectedFile: any;
	formAktifLain: any;
	popUpStrategyMaster: boolean;
	form: FormGroup;
	totalRecords: number;
	kdStrategyHead: any = [];
	noHistoriCari: any;
	kdDepartemenLogin: any;
	onOffUpdate: boolean;
	onOffSimpan: boolean;
	keyUpdate: any;
	listPeriodeHead: any[];
	kodeHeadPeriode: any;
	listPeriode: any[];
	selected: any;
	periodeSelected: any;
	tglAwalPer: any;
	tglAkhirPer: any;
	Visi: any;
	namaPeriode: any;
	reportDisplay: any;
	kdPeriode: any;

	// variable untuk insert KPI
	popUpKPI = false;
	itemPath: MenuItem[];
	listKPI: any[];
	dataInputKPI: any[];

	selectedStrategy: any;
	selectedPerspective: any;
	selectedHeadDepartment: any;

	idStrategy: any;
	selectedIdPerspective: any;
	noHistories: any;
	listDdlAsalData: any[];
	dataProfileKPIbynoHistori: any[];
	dataKPI: any;
	tipeDataObject: any;
	// baru 
	isDisableButtonSimpanKPI: boolean;
	listDdlPeriodeData: any[];
	tempIdPerspective: any;
	kdHead:any;
	reportD:any;
	dataKpiPerusahaan:any[];
	disKPISimpan:boolean;


	constructor(private httpService: HttpClient,
		private alertService: AlertService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
		private confirmationService: ConfirmationService,
		private element: ElementRef,
		private renderer: Renderer2) { }

	ngOnInit() {
		//this.disKPISimpan = false;
		this.tglAwalPer = "";
		this.tglAkhirPer ="";
		this.selected ="";
		this.perspective = [];
		this.isDisableButtonSimpanKPI = true;
		this.kdPeriode = '';
		this.namaPeriode = '';
		this.reportDisplay = '';
		this.dataInputKPI = [];
		this.kodeHeadPeriode = '';
		this.listPeriode = [];
		this.kdDepartemenLogin = this.authGuard.getUserDto().kdDepartemen;
		this.formAktifLain = '';
		this.selectedFile = '';
		this.formAktif = true;
		this.departemenTree = [];
		this.departemenTreeN = [];
		this.kdDepartemen = '';
		this.kdDepartemenHead = '';
		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
		this.popUpStrategyMaster = false;
		this.noHistoriCari = '';
		this.onOffUpdate = true;
		this.onOffSimpan = true;
		this.keyUpdate = '';
		this.selected = '';
		console.log(this.tipeDataObject);


		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.form = this.fb.group({
			'namaStrategy': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl(null, Validators.required),
			'kdStrategyHead': new FormControl(null),
			'noUrut': new FormControl(null),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null, Validators.required),
			'noRec': new FormControl(null),
			'kode': new FormControl(null),
		});
		this.form.get('noUrut').disable();

		this.getStrategy();
		//this.getPerspectiveAll();
		this.getDepartemenTree();

		this.getKdStrategyHead();
		this.getDataGrid(this.page, this.rows, '');

		this.getPeriodeHead(this.page, this.rows, '');

		// function service untuk KPI
		this.getKPI();
		this.getAsalData();
		this.getPeriodeData();
		// this.getProfileKPIbynoHistory();

	}

	/* 
		function untuk get id perspective, id strategy untuk save dan nama perspective, nama strategy untuk breadcrump
	*/
	klikStrategy(e: HTMLElement) {
		let parentEl = e.parentElement;
		let parentEl2 = parentEl.parentElement;
		let parentEl3 = parentEl2.parentElement;
		let parentEl4txt = parentEl3.parentElement.innerText;
		let dataTempArr = parentEl4txt.split('\n');
		this.selectedPerspective = dataTempArr[0];

		this.selectedStrategy = e.innerText;
		this.idStrategy = '';
		let namaClass = e.className;
		let idS;
		var lengthListDataStrategy = this.listDataStrategy.length;
		var lengthPerspective = this.perspective.length;
		var valueClassElement = 'ngx-dnd-content';
		// untuk find id strategy 
		for (let ind = 0; ind < lengthListDataStrategy; ind++) {
			if (this.listDataStrategy[ind].namaStrategy === this.selectedStrategy) {
				// untuk get id strategy
				idS = this.listDataStrategy[ind].kode.kode
				this.idStrategy = idS
				// break;
			}
		}
		for (let i = 0; i < lengthPerspective; i++) {
			if(this.perspective[i].label == this.selectedPerspective) {
				this.selectedIdPerspective = this.perspective[i].kodePerspective;
			}
		}
		// untuk find data perspective dan id perspective
		// for (let i = 0; i < lengthPerspective; i++) {
		// 	// let iii = lengthPerspective - 1;
		// 	for (let ii = 0; ii < this.perspective[i].children.length; ii++) {
		// 		// jika selected strategy match
		// 		if (this.perspective[i].children[ii].label == this.selectedStrategy &&
		// 			this.perspective[i].children[ii].kodeStrategy == this.idStrategy) {
		// 			let dataTempIdPerspective = this.perspective[i].kodePerspective;
		// 			let dataTempNamaPerspective = this.perspective[i].label;

		// 			this.selectedPerspective = dataTempNamaPerspective;
		// 			this.selectedIdPerspective = dataTempIdPerspective;

		// 			break;
		// 		}
		// 	}
		// 	if (this.selectedIdPerspective == this.perspective[i].kodePerspective && this.selectedPerspective === this.perspective[i].label) {
		// 		break;
		// 	}
		// }
		if (this.selectedIdPerspective == undefined ||
			(this.selectedIdPerspective == undefined && this.idStrategy == undefined) ||
			this.idStrategy == undefined) {
			this.popUpKPI = false;
		} else {
			this.getProfileKPIbynoHistory();
			if (namaClass.toString() === valueClassElement && idS != undefined) {
				this.popUpKPI = true;
			} else if (namaClass.toString() === valueClassElement && idS == undefined) {
				this.popUpKPI = false;
			}
		}

		if (this.selectedFile.label == "" ||
			this.selectedFile.label == undefined ||
			this.selectedFile.label == null) {
			// jika tree department null / tidak di select. masuk kondisi ini
			this.itemPath = [
				{ label: this.selectedPerspective }, // nama perspective
				{ label: this.selectedStrategy } // nama strategi
			];
		} else {
			this.itemPath = [
				{ label: this.selectedFile.label }, // nama departmen
				{ label: this.selectedPerspective }, // nama perspective
				{ label: this.selectedStrategy } // nama strategi
			];
		}
	}
	// get tipe data objek base onselected dropdown
	getTipeDataObject(data: any) {
		this.tipeDataObject = data;
	}
	// validasi only number
	isNumber(evt) {
		evt = (evt) ? evt : window.event;
		// /^[-0-9]{0,9}([,.][0-9]{0,9})?$/
		let regex = new RegExp ('^[-0-9]{0,9}([,.][0-9]{0,9})?$');
		// console.log()
		var charCode = (evt.which) ? evt.which : evt.keyCode;

		if (this.tipeDataObject == undefined || this.tipeDataObject == null) {
			// this.alertService.warn('Peringatan', 'Anda belum memilih KPI');
			// return false;
		} else if (this.tipeDataObject.kpi.namaTypeDataObjek === 'Integer') {
			// kondisi hanya menerima input number
			// if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			// 	return false;
			// }

			// kondisi hanya menerima input keyboard number, minus, koma, dan titik
			if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 188 || charCode > 190)) {
				return false;
			}
		}
		return true;
	}
	isNumber2(evt) {
		evt = (evt) ? evt : window.event;
		let regex = /^[-0-9]{0,9}([,.][0-9]{0,9})?$/ // ga kepake
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 188 || charCode > 188)) {
			return false;
		}
		return true;
	}
	getKPI() {
		let tipeData: any[];
		let selectedTipe: any;
		this.httpService.get(Configuration.get().dataBSC + '/kpi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKPI&sort=desc').subscribe(res => {
			this.listKPI = [];
			this.dataKPI = res.KPI;
			var dataLength = res.KPI.length;
			this.listKPI.push({ label: '-- Pilih Nama KPI --', value: '' })
			for (var i = 0; i < dataLength; i++) {
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

	getPeriodeData() {
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapkpi/findPeriodeDataKPI').subscribe(ddl => {
			let temp = ddl;
			let lengthData = ddl.data.length;
			this.listDdlPeriodeData = [];
			this.listDdlPeriodeData.push({ label: '-- Pilih Periode --', value: '' });
			for (let i = 0; i < lengthData; i++) {
				this.listDdlPeriodeData.push({ label: ddl.data[i].namaPeriode, value: ddl.data[i] });
			}
		}, error => {
			this.listDdlPeriodeData = [];
			this.listDdlPeriodeData.push({ label: '--' + error + '--', value: '' });
		});
	}
	getAsalData() {
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
	getProfileKPIbynoHistory() {
		let dataMap = [];
		let dataTemp = [];
		//let dataKpiPerusahaan = [];
		if (this.kdDepartemen == '') {
			if (this.noHistories != undefined) {
				if (this.idStrategy != '') {

					this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapkpi/findByKode/' + this.noHistories + '/' + this.selectedIdPerspective + '/' + this.idStrategy).subscribe(table => {
						dataTemp = table.ProfileHistoriStrategyMapKPI;
						console.log(dataTemp);
						for (let i = 0; i < dataTemp.length; i++) {
							let dataTemporary = {
								'nomor': '',
								'kpi': {
									'namaKPI': dataTemp[i].namaKPI,
									'kode': dataTemp[i].kdKPI,
									'kdMetodeHitungActual': dataTemp[i].kdMetodeHitungActual,
									'namaSatuanHasil': dataTemp[i].namaSatuanHasil,
									'namaTypeDataObjek': dataTemp[i].namaTypeDataObject,
									'namaMetodeHitung': dataTemp[i].namaMetodeHitung,
								},
								'asal': {
									"namaAsal": dataTemp[i].namaAsalData,
									"kdAsal": dataTemp[i].kdAsalData
								},
								'bobot': dataTemp[i].bobotKPI,
								'satuan': dataTemp[i].namaSatuanHasil,
								'tipe': dataTemp[i].namaTypeDataObject,
								'target': dataTemp[i].targetKPIMin,
								'periode': {
									'namaPeriode': dataTemp[i].namaPeriodeData,
									'kode': {
										'kode': dataTemp[i].kdPeriodeData
									}
								},
								'perhitungan': dataTemp[i].namaMetodeHitung
							};
							dataMap.push(dataTemporary);
						}
						let data = [...dataTemp];
						data = dataMap
						this.dataInputKPI = data;
					});
					this.dataKpiPerusahaan = this.dataInputKPI;
				}
			}
		} else if (this.kdDepartemen != '') {
			if (this.noHistories != undefined) {
				if (this.idStrategy != '') {
					this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKode/' + this.noHistories + '/' + this.selectedIdPerspective + '/' + this.idStrategy + '/' + this.kdDepartemen).subscribe(res => {
						dataTemp = res.ProfileHistoriStrategyMapDKPI;
						if (dataTemp.length == 0) {
							console.log('masuk sini, data masih kosong')
							this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByParentDepartement/' + this.noHistories + '/' + this.selectedIdPerspective + '/' + this.idStrategy + '/' + this.kdDepartemen).subscribe(res => {
								dataTemp = res.strategyMapKPIParentDepartemen;
								// if(dataTemp.length == 0){
								// 	this.alertService.warn('Perhatian','Harap Isi KPI Perusahaan Terlebih Dahulu');
								// 	this.disKPISimpan = true;
								// }else{
								// 	this.disKPISimpan = false;
								// }

								for (let i = 0; i < dataTemp.length; i++) {
									let dataTemporary = {
										'nomor': '',
										'kpi': {
											'namaKPI': dataTemp[i].namaKPI,
											'kode': dataTemp[i].kdKPI,
											'kdMetodeHitungActual': dataTemp[i].kdMetodeHitungActual,
											'namaSatuanHasil': dataTemp[i].namaSatuanHasil,
											'namaTypeDataObjek': dataTemp[i].namaTypeDataObject,
											'namaMetodeHitung': dataTemp[i].namaMetodeHitung,
										},
										'asal': {
											"namaAsal": dataTemp[i].namaAsalData,
											"kdAsal": dataTemp[i].kdAsalData
										},
										'bobot': dataTemp[i].bobotKPI,
										'satuan': dataTemp[i].namaSatuanHasil,
										'tipe': dataTemp[i].namaTypeDataObject,
										'target': dataTemp[i].targetKPIMin,
										'periode': {
											'namaPeriode': dataTemp[i].namaPeriodeData,
											'kode': {
												'kode': dataTemp[i].kdPeriodeData
											}
										},
										'perhitungan': dataTemp[i].namaMetodeHitung
									};
									dataMap.push(dataTemporary);
								}
								let data = [...dataTemp];
								data = dataMap
								this.dataInputKPI = data;
							});
						} else {
							console.log('masuk sini, datanya udah ada');
							//this.disKPISimpan = false;
							for (let i = 0; i < dataTemp.length; i++) {
								let dataTemporary = {
									'nomor': '',
									'kpi': {
										'namaKPI': dataTemp[i].namaKPI,
										'kode': dataTemp[i].kdKPI,
										'kdMetodeHitungActual': dataTemp[i].kdMetodeHitungActual,
										'namaSatuanHasil': dataTemp[i].namaSatuanHasil,
										'namaTypeDataObjek': dataTemp[i].namaTypeDataObject,
										'namaMetodeHitung': dataTemp[i].namaMetodeHitung,
									},
									'asal': {
										"namaAsal": dataTemp[i].namaAsalData,
										"kdAsal": dataTemp[i].kdAsalData
									},
									'bobot': dataTemp[i].bobotKPI,
									'satuan': dataTemp[i].namaSatuanHasil,
									'tipe': dataTemp[i].namaTypeDataObject,
									'target': dataTemp[i].targetKPIMin,
									'periode': {
										'namaPeriode': dataTemp[i].namaPeriodeData,
										'kode': {
											'kode':dataTemp[i].kdPeriodeData
										}
									},
									'perhitungan': dataTemp[i].namaMetodeHitung
								};
								dataMap.push(dataTemporary);
							}
							let data = [...dataTemp];
							data = dataMap
							this.dataInputKPI = data;
						}
					});
				}
			}
		}
	}
	batalInputKPI() {
		this.dataInputKPI = [];
		this.selectedIdPerspective = null;
		this.idStrategy = null;
		//this.disKPISimpan = false;
		this.popUpKPI = false;
	}
	simpanInputKPI() {
		if (this.kdDepartemen == '') {
			let tampungStrategy = [];
			if (this.dataInputKPI.length == 0) {
				this.alertService.warn('Peringatan', 'Tidak Ada Data Untuk Di Simpan');
			} else {
				for (let i = 0; i < this.dataInputKPI.length; i++) {
					// let dataStrategy;
					// if(this.dataInputKPI[i].periode.kode == undefined){
					let dataStrategy =
					{
						"bobotKPI": parseInt(this.dataInputKPI[i].bobot),
						"kdAsalData": this.dataInputKPI[i].asal.kdAsal,
						"kdKPI": this.dataInputKPI[i].kpi.kode,
						'kdPeriodeData': this.dataInputKPI[i].periode.kode.kode,
						"kdMetodeHitungActual": this.dataInputKPI[i].kpi.kdMetodeHitungActual,
						"keteranganLainnya": "string",
						"noRec": "string",
						"statusEnabled": true,
						"targetKPIMin": this.dataInputKPI[i].target
					}
					// }
					tampungStrategy.push(dataStrategy);
				}

				let dataSave = {
					"kdPerspective": this.selectedIdPerspective,
					"kdStrategy": this.idStrategy,
					"noHistori": this.noHistories,
					"profileHistoriStrategyMapKPI": tampungStrategy,
					"version": 0
				}
	
				this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapkpi/save', dataSave).subscribe(res => {
					this.alertService.success('Simpan', 'Berhasil Menyimpan Data KPI');
					this.doneSaveKPI();
				});

			}
			
		} else {
			let tampungStrategy = [];
			if (this.dataInputKPI.length == 0) {
				this.alertService.warn('Peringatan', 'Tidak Ada Data Untuk Di Simpan');
			} else {
				for (let i = 0; i < this.dataInputKPI.length; i++) {
					let dataStrategy =
					{
						"bobotKPI": parseInt(this.dataInputKPI[i].bobot),
						"kdAsalData": this.dataInputKPI[i].asal.kdAsal,
						"kdKPI": this.dataInputKPI[i].kpi.kode,
						"kdMetodeHitungActual": this.dataInputKPI[i].kpi.kdMetodeHitungActual,
						'kdPeriodeData': this.dataInputKPI[i].periode.kode.kode,
						"keteranganLainnya": "string",
						"noRec": "string",
						"statusEnabled": true,
						"targetKPIMin": this.dataInputKPI[i].target
					}
					tampungStrategy.push(dataStrategy);
				}

				let dataSave = {
					"kdDepartemen": this.kdDepartemen,
					"kdPerspective": this.selectedIdPerspective,
					"kdStrategy": this.idStrategy,
					"noHistori": this.noHistories,
					"profileHistoriStrategyMapDKPI": tampungStrategy,
					"version": 0
				}
	
				this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/save', dataSave).subscribe(res => {
					this.alertService.success('Simpan', 'Berhasil Menyimpan Data KPI');
					this.doneSaveKPI();
				});


			}
			
		}

	}
	doneSaveKPI() {
		this.popUpKPI = false;
		this.selectedStrategy = "";
	}
	hapusKpi(row) {
		this.isDisableButtonSimpanKPI = true;
		let dataInputKPI = [...this.dataInputKPI];
		dataInputKPI.splice(row, 1);
		this.dataInputKPI = dataInputKPI;
	}
	tambahKPI() {
		this.isDisableButtonSimpanKPI = false;
		this.tipeDataObject = null;
		if (this.dataInputKPI.length == 0) {
			let dataTemp = {
				"nomor": null,
				"kpi": {
					"namaKPI": "-- Pilih Nama KPI --",
					"id_kode": null,
				},
				"asal": {
					"namaAsal": '-- Pilih Asal Data --',
					"kdAsal": null
				},
				"bobot": 'Input Bobot KPI',
				'satuan': null,
				'tipe': null,
				"target": 'Input Target KPI',
				'periode': {
					'namaPeriode': '-- Pilih Periode --',
					'kode': {
						'kode': null
					}
				},
				'perhitungan': null

			}
			let dataInputKPI = [...this.dataInputKPI];
			dataInputKPI.push(dataTemp);
			this.dataInputKPI = dataInputKPI;
		} else {
			let last = this.dataInputKPI.length - 1;
			
			if (this.dataInputKPI[last].kpi.kode == null || this.dataInputKPI[last].bobot == null || this.dataInputKPI[last].target == null) {
				this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
			} else {
				let dataTemp = {
					"nomor": null,
					"kpi": {
						"namaKPI": "-- Pilih Nama KPI --",
						"id_kode": null,
					},
					"asal": {
						"namaAsal": '-- Pilih Asal Data --',
						"kdAsal": null
					},
					"bobot": 'Input Bobot KPI',
					'satuan': null,
					'tipe': null,
					"target": 'Input Target KPI',
					'periode': {
						'namaPeriode': '-- Pilih Periode --',
						'kode': {
							'kode': null
						}
					},
					'perhitungan': null

				}
				let dataInputKPI = [...this.dataInputKPI];
				dataInputKPI.push(dataTemp);
				this.dataInputKPI = dataInputKPI;
			}
		}
	}
	ngAfterViewInit() {
		// setTimeout(()=>
		// {

		//   $(document).ready(function(){
		//     //alert($(".ngx .ngx-dnd-container").children().length);
		//     // alert($(".ngx .ngx-dnd-container").html());
		//     $(".ngx .ngx-dnd-container :first-child").each(function(){
		//       this[0].style.setProperty('background-color','yellow','important');
		//     });
		//   });

		// },0);


		// let finathis.tesTreement.children[0].children[0];
		// let tes = this.elDo.nativeElement.querySelector('.ngx-dnd-container .ngx-dnd-item');
		// this.renderer.addClass(financial,'tes');
		//let tes = this.elDo.nativeElement;
		// let container = tes.getElementsByTagName('ngx-dnd-container');
		//let tes2 = document.getElementsByClassName('.overdrive-perspective');
		// let tes2 = this.renderer.selectRootElement('.overdrive-perspective .ngx-dnd-container');
		//console.log(container);
		//console.log(tes);

	}

	getDepartemenTree() {
		let departemenIA = [];
		let departemenIAF = [];
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Departemen&select=id.kode,namaDepartemen,kdDepartemenHead,version,kdPegawaiKepala,statusEnabled,kodeExternal,namaExternal,reportDisplay,isProfitCostCenter').subscribe(table => {
			let dataTampungTree = table.data.data;
			for (let i = 0; i < dataTampungTree.length; i++) {
				departemenIA[i] = {
					"label": dataTampungTree[i].namaDepartemen,
					// "data": dataTampungTree[i],
					"kdDepartemenHead": dataTampungTree[i].kdDepartemenHead,
					"id_kode": dataTampungTree[i].id_kode,
					"children": []
				}

				// this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Departemen&select=id.kode,namaDepartemen,kdDepartemenHead,version,kdPegawaiKepala,statusEnabled,kodeExternal,namaExternal,reportDisplay,isProfitCostCenter&criteria=kdDepartemenHead&values='+ departemenIA[i].data.id_kode).subscribe(table2 => {
				//   let listAnak = [];
				//   let dataC = table2.data.data;
				//   for(let j=0; j<dataC.length; j++){
				//     listAnak[j] = {
				//       "label":dataC[j].namaDepartemen,
				//       "data":dataC[j],
				//       "children":[]
				//     }

				//     departemenIA[i].children.push(listAnak[j]);
				//   } 
				// });

				// let departemenTree = [...this.departemenTreeN];
				// departemenTree.push(departemenIA[i]);
				// this.departemenTreeN = departemenTree;
			}
			// console.log(this.departemenTreeN);
			// this.departemenTree = this.departemenTreeN;
			// this.departemenTreeTampung = this.departemenTreeN

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

	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}

	}

	getPerspectiveAll() {
		this.perspective = [];
		let tampungTahan;
		let tampungFinal = [];
		let PerspectiveAll = [];
		this.httpService.get(Configuration.get().dataBSC + '/perspective/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaPerspective&sort=desc').subscribe(table => {
			PerspectiveAll = table.Perspective;

			for (let y = 0; y < PerspectiveAll.length; y++) {
				this.tempIdPerspective = table.Perspective[y].kode.kode;

				tampungTahan = {
					"label": PerspectiveAll[y].namaPerspective,
					"kodePerspective": PerspectiveAll[y].kode.kode,
					"children": []
				}
				tampungFinal.push(tampungTahan);
			}
			this.perspective = tampungFinal;
			
		});

	}

	getStrategy() {
		let strategy = [];
		let tampungStrategy;
		this.httpService.get(Configuration.get().dataBSC + '/strategy/findAll?page=' + this.page + '&rows=100&dir=namaStrategy&sort=desc').subscribe(table => {
			this.listDataStrategy = table.Strategy;

			for (let y = 0; y < this.listDataStrategy.length; y++) {
				tampungStrategy = {
					"label": this.listDataStrategy[y].namaStrategy,
					"kodeStrategy": this.listDataStrategy[y].kode.kode
				}
				strategy.push(tampungStrategy);
			}
			this.strategyAll = strategy;

		});


	}


	simpanM() {
		
		// let awal = this.setTimeStamp(this.tanggalAwal);
		// let akhir = this.setTimeStamp(this.tanggalAkhir);
		let tampungStrategy = [];
		let dataStrategy;
		let kdS;
		let dataSimpan;
		let dataSimpanD;


		if (this.kdDepartemen == '') {

			for (let i = 0; i < this.perspective.length; i++) {

				for (let y = 0; y < this.perspective[i].children.length; y++) {

					if (this.perspective[i].children[y].kodeStrategy == undefined) {
						kdS = 0;
					} else {
						kdS = this.perspective[i].children[y].kodeStrategy;
					}

					dataStrategy = {
						"kdDepartemen": "string",
						"kdPerspective": this.perspective[i].kodePerspective,
						"kdStrategy": kdS,
						"noHistori": 'string',
						"noRec": "string",
						"statusEnabled": true,
						"version": 0
					}

					tampungStrategy.push(dataStrategy);

				}

			}

			dataSimpan = {
				"kdDepartemen": "string",
				"kdKelompokTransaksi": 0,
				"kode": this.kdPeriode,
				"namaPeriode": this.namaPeriode,
				"profileHistoriStrategyMap": tampungStrategy,
				"reportDisplay": this.reportD,
				"statusEnabled": true,
				"tglAkhir": this.tglAkhirPer,
				"tglAwal": this.tglAwalPer
			}
			let lanjutSimpan;
			for(let z=0; z<this.perspective.length; z++){
				if(this.perspective[z].children.length == 0){
					//this.alertService.warn('Perhatian','Data Strategy Di Perspective Tidak Boleh Kosong');
					lanjutSimpan = false;
					break;
				}
			}

			if (dataSimpan.profileHistoriStrategyMap.length == undefined || dataSimpan.profileHistoriStrategyMap.length == 0) {
				this.alertService.warn('Peringatan', 'Tidak Ada Data Untuk Di Simpan');
			}else{
				if(lanjutSimpan != false){
					//alert('siap simpan');
					this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymap/save', dataSimpan).subscribe(response => {
						this.alertService.success('Simpan', 'Data Disimpan');
						this.onOffSimpan = true;
						this.onOffUpdate = false;
						//this.ngOnInit();
					});
				}else{
					this.alertService.warn('Perhatian','Data Strategy Di Perspective Tidak Boleh Kosong');
				}
			}



		} else {
			for (let i = 0; i < this.perspective.length; i++) {

				for (let y = 0; y < this.perspective[i].children.length; y++) {

					if (this.perspective[i].children[y].kodeStrategy == undefined) {
						kdS = 0;
					} else {
						kdS = this.perspective[i].children[y].kodeStrategy;
					}

					dataStrategy = {
						"kdDepartemen": "string",
						"kdDepartemenD": this.kdDepartemen,
						"kdPerspective": 0,
						"kdPerspectiveD": this.perspective[i].kodePerspective,
						"kdStrategy": 0,
						"kdStrategyD": kdS,
						"noHistori": this.noHistoriCari,
						"noRec": "string",
						"statusEnabled": true,
						"version": 0
					}

					tampungStrategy.push(dataStrategy);

				}


			}

			dataSimpanD = {
				"profileHistoriStrategyMapD": tampungStrategy,
				"tglAkhir": this.tglAkhirPer,
				"tglAwal": this.tglAwalPer
			}

			let lanjutSimpan2;
			for(let x=0; x<this.perspective.length; x++){
				if(this.perspective[x].children.length == 0){
					lanjutSimpan2 = false;
					break;
				}
			}

			if (dataSimpanD.profileHistoriStrategyMapD.length == undefined || dataSimpanD.profileHistoriStrategyMapD.length == 0) {
				this.alertService.warn('Peringatan', 'Tidak Ada Data Untuk Di Simpan');
			}else{
				if(lanjutSimpan2 != false){
					//alert('siap simpan departemen');
					this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapd/save', dataSimpanD).subscribe(response => {
						this.alertService.success('Simpan', 'Data Disimpan');
						this.onOffSimpan = true;
						this.onOffUpdate = false;
						//this.ngOnInit();
					});
				}else{
					this.alertService.warn('Perhatian','Data Strategy Di Perspective Tidak Boleh Kosong');
				}
			}

		}


	}



	refreshData() {
		this.ngOnInit();
	}

	cariPeriode() {
		// this.kdDepartemen ='';
		// this.selectedFile='';
		this.keyUpdate = '';
		this.listPerspective = [];
		let dataTampungFinal = [];
		let dataAnak;

		if (this.kdDepartemen == '') {

			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findByPeriodV2/{startDate}/{endDate}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspective&sort=asc&startDate=' + this.tglAwalPer + '&endDate=' + this.tglAkhirPer).subscribe(table => {
				let dataMap = table.ProfileHistoriStrategyMap;
				if (dataMap.length == 0) {
					this.noHistoriCari = '';
				} else {
					this.noHistoriCari = dataMap[0].noHistori;
				}

				this.keyUpdate = 'dariperusahaan';
				if (dataMap.length != 0 && this.kdDepartemen == '') {
					this.onOffUpdate = false;
					this.onOffSimpan = true;
				} else if (dataMap.length == 0 && this.kdDepartemen == '') {
					this.onOffUpdate = true;
					this.onOffSimpan = false;
				}

				for (var z = 0; z < dataMap.length; z++) {
					dataTampungFinal[z] = {
						"label": dataMap[z].namaPerspective,
						"kodePerspective": dataMap[z].kdPerspective,
						"children": []
					}
					for (var u = 0; u < dataMap[z].strategies.length; u++) {
						dataAnak = {
							"label": dataMap[z].strategies[u].namaStrategy,
							"kodeStrategy": dataMap[z].strategies[u].kdStrategy,
							"kodePerspective": dataMap[z].strategies[u].kdPerspective
						}
						dataTampungFinal[z].children.push(dataAnak)
					}

					let listPerspective = [...this.listPerspective];
					listPerspective.push(dataTampungFinal[z]);
					this.listPerspective = listPerspective;

				}

				this.perspective = this.listPerspective;


			});

		} else {


			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapd/findByPeriodV2/{startDate}/{endDate}/{kdDepartemenD}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspectiveD&sort=asc&startDate=' + this.tglAwalPer + '&endDate=' + this.tglAkhirPer + '&kdDepartemenD=' + this.kdDepartemen).subscribe(table => {
				let dataMap = table.ProfileHistoriStrategyMap;
				if (dataMap.length == 0) {
					this.noHistoriCari = '';
					//this.perusahaanStrategyPerspectiveMapping();
				} else {
					this.noHistoriCari = dataMap[0].noHistori;
				}

				this.keyUpdate = 'daridepartemen';
				if (dataMap.length != 0 && this.kdDepartemen != '') {
					this.onOffUpdate = false;
					this.onOffSimpan = true;
				} else if (dataMap.length == 0 && this.kdDepartemen == '') {
					this.onOffUpdate = true;
					this.onOffSimpan = false;
				}

				for (var z = 0; z < dataMap.length; z++) {
					dataTampungFinal[z] = {
						"label": dataMap[z].namaPerspectiveD,
						"kodePerspective": dataMap[z].kdPerspectiveD,
						"children": []
					}
					for (var u = 0; u < dataMap[z].strategies.length; u++) {
						dataAnak = {
							"label": dataMap[z].strategies[u].namaStrategy,
							"kodeStrategy": dataMap[z].strategies[u].kdStrategyD,
							"kodePerspective": dataMap[z].strategies[u].kdPerspectiveD
						}
						dataTampungFinal[z].children.push(dataAnak)
					}

					let listPerspective = [...this.listPerspective];
					listPerspective.push(dataTampungFinal[z]);
					this.listPerspective = listPerspective;

				}

				this.perspective = this.listPerspective;

			});

		}

	}

	perusahaanStrategyPerspectiveMapping() {
		this.keyUpdate = '';
		this.listPerspective = [];

		let dataTampungFinal = [];
		let dataAnak;
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findByPeriodV2/{startDate}/{endDate}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspective&sort=asc&startDate=' + this.tglAwalPer + '&endDate=' + this.tglAkhirPer).subscribe(table => {
			let dataMap = table.ProfileHistoriStrategyMap;
			if (dataMap.length == 0) {
				this.noHistoriCari = '';
			} else {
				this.noHistoriCari = dataMap[0].noHistori;
			}

			this.keyUpdate = 'dariperusahaan';
			if (dataMap.length != 0 && this.kdDepartemen == '') {
				this.onOffUpdate = false;
				this.onOffSimpan = true;
			} else if (dataMap.length == 0 && this.kdDepartemen == '') {
				this.onOffUpdate = true;
				this.onOffSimpan = false;
			}

			for (var z = 0; z < dataMap.length; z++) {
				dataTampungFinal[z] = {
					"label": dataMap[z].namaPerspective,
					"kodePerspective": dataMap[z].kdPerspective,
					"children": []
				}
				for (var u = 0; u < dataMap[z].strategies.length; u++) {
					dataAnak = {
						"label": dataMap[z].strategies[u].namaStrategy,
						"kodeStrategy": dataMap[z].strategies[u].kdStrategy,
						"kodePerspective": dataMap[z].strategies[u].kdPerspective
					}
					dataTampungFinal[z].children.push(dataAnak)
				}

				let listPerspective = [...this.listPerspective];
				listPerspective.push(dataTampungFinal[z]);
				this.listPerspective = listPerspective;

			}

			this.perspective = this.listPerspective;


		});


	}

	onDrop(event) {

		let data = event;
		let dataArray;
		let dataArray2;
		let tampungPembeda;
		let tampungPembeda2;
		let kdStg = data.value.kodeStrategy;
		let kdPer = data.value.kodePerspective;

		//kalo dia strategy baru input belum pernah disimpan strategynya
		if(data.value.kodePerspective == undefined){
			
			for(let i=0; i<this.perspective.length; i++){
				if(this.perspective[i].kodePerspective == undefined){
					dataArray2 = this.perspective[i];
					this.perspective.splice(i,1);
					break;
				}
			}
			//cek kalo strategy yg baru nambah itu paling akhir/si perspective nya nyisa satu lagi dari strategy yang baru
			// for(let z=0; z<this.perspective.length; z++){
			// 	if(this.perspective[z].children.length == 0 ){
			// 		this.alertService.warn('Perhatian','Data Perspective tidak boleh kosong');
			// 		this.perspective[z].children.push(dataArray2);
			// 		tampungPembeda2 = 1;
			// 		break;
			// 	}
			// }
			
		//kalo dia strategy sudah pernah disimpan dan pasti memiliki kdPerspective
		
		}else if(data.value.kodePerspective != undefined){
			
			for(let x=0; x<this.perspective.length; x++){
				//kalo strategy ga punya induk perspective kesini
				if(this.perspective[x].children == undefined){
					dataArray = this.perspective[x];
					this.perspective.splice(x,1);
					break;
				}
				
			}

			for(let y=0; y<this.perspective.length; y++){
				//cek lagi kalo yang perspective anaknya ga punya
				if(this.perspective[y].children.length == 0){
					this.alertService.warn('Perhatian','Data Perspective tidak boleh kosong');
					this.perspective[y].children.push(dataArray);
					tampungPembeda = 1;
					break;
				}
			}

			for(let v=0; v<this.perspective.length; v++){
				if(this.perspective[v].children.length > 0 && this.kdDepartemen == '' && tampungPembeda == undefined){
					//alert('dihapus strategy perusahaan');
					this.getDeleteStrategy(this.noHistoriCari, kdPer, kdStg);
					break;
				}else if(this.perspective[v].children.length > 0 && this.kdDepartemen != '' && tampungPembeda == undefined){
					//alert('dihapus strategy departemen');
					this.getDeleteStrategyD(this.noHistoriCari, kdPer, kdStg);
					break;
				}
			}
			
		}

		//dicoment dulu
		// for (var y = 0; y < this.perspective.length; y++) {
		// 	if (this.perspective[y].kodeStrategy) {
		// 		let kdStg = this.perspective[y].kodeStrategy;
		// 		let kdPer = this.perspective[y].kodePerspective;
		// 		if(kdStg != undefined && kdPer != undefined ){
		// 			dataArray = this.perspective[y];
		// 		}
		// 		this.perspective.splice(y, 1);
				
		// 		if(this.perspective[y].children.length == 0){
		// 			this.alertService.warn('Perhatian','Data Strategi tidak boleh kosong');
		// 			this.perspective[y].children.push(dataArray);
		// 		}else if(this.perspective[y].children.length != 0){
		// 			if (this.kdDepartemen == '' && kdPer != undefined) {
		// 				alert('dihapus strategy perusahaan');
		// 			   //this.getDeleteStrategy(this.noHistoriCari, kdPer, kdStg);
		// 		   } else if (this.kdDepartemen != '' && kdPer != undefined) {
		// 				alert('dihapus strategy departemen');
		// 			   //this.getDeleteStrategyD(this.noHistoriCari, kdPer, kdStg);
		// 		   }
		// 		}
		// 	}
		// }

	}

	getDeleteStrategy(histori, kdP, kdS) {
		this.httpService.delete(Configuration.get().dataBSC + '/profilehistoristrategymap/del/' + histori + '/' + kdP + '/' + kdS).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
		});
	}

	getDeleteStrategyD(historiD, kdPe, kdST) {
		this.httpService.delete(Configuration.get().dataBSC + '/profilehistoristrategymapd/del/' + historiD + '/' + kdPe + '/' + kdST).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
		});
	}

	nodeSelect(event) {
		
		//console.log(this.selectedFile);
		this.onOffUpdate = true;
		this.onOffSimpan = true;
		this.kdDepartemen = event.node.id_kode;
		this.kdDepartemenHead = event.node.kdDepartemenHead;
		this.keyUpdate = '';
		this.listPerspective = [];
		let dataTampungFinal = [];
		let dataAnak;

		if (this.tglAwalPer == "" || this.tglAkhirPer == "" || this.selected == "") {
			this.alertService.warn('Peringatan', 'Harap Pilih Periode Terlebih Dahulu');
		} else {

			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapd/findByPeriodV2/{startDate}/{endDate}/{kdDepartemenD}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspectiveD&sort=asc&startDate=' + this.tglAwalPer + '&endDate=' + this.tglAkhirPer + '&kdDepartemenD=' + this.kdDepartemen).subscribe(table => {
				let dataMapD = table.ProfileHistoriStrategyMap;

				if (dataMapD.length == 0) {
					this.onOffUpdate = true;
					this.onOffSimpan = false;
					// this.noHistoriCari = '';
					this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findByPeriodV2/{startDate}/{endDate}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspective&sort=asc&startDate=' + this.tglAwalPer + '&endDate=' + this.tglAkhirPer).subscribe(table => {
						let dataMap = table.ProfileHistoriStrategyMap;

						for (var z = 0; z < dataMap.length; z++) {
							dataTampungFinal[z] = {
								"label": dataMap[z].namaPerspective,
								"kodePerspective": dataMap[z].kdPerspective,
								"children": []
							}
							for (var u = 0; u < dataMap[z].strategies.length; u++) {
								dataAnak = {
									"label": dataMap[z].strategies[u].namaStrategy,
									"kodeStrategy": dataMap[z].strategies[u].kdStrategy,
									"kodePerspective": dataMap[z].strategies[u].kdPerspective
								}
								dataTampungFinal[z].children.push(dataAnak)
							}

							let listPerspective = [...this.listPerspective];
							listPerspective.push(dataTampungFinal[z]);
							this.listPerspective = listPerspective;

						}

						this.perspective = this.listPerspective;


					});

				} else if (dataMapD.length != 0) {
					this.onOffUpdate = false;
					this.onOffSimpan = true;
					this.noHistoriCari = dataMapD[0].noHistori;
					for (var z = 0; z < dataMapD.length; z++) {
						dataTampungFinal[z] = {
							"label": dataMapD[z].namaPerspectiveD,
							"kodePerspective": dataMapD[z].kdPerspectiveD,
							"children": []
						}
						for (var u = 0; u < dataMapD[z].strategies.length; u++) {
							dataAnak = {
								"label": dataMapD[z].strategies[u].namaStrategy,
								"kodeStrategy": dataMapD[z].strategies[u].kdStrategyD,
								"kodePerspective": dataMapD[z].strategies[u].kdPerspectiveD
							}
							dataTampungFinal[z].children.push(dataAnak)
						}

						let listPerspective = [...this.listPerspective];
						listPerspective.push(dataTampungFinal[z]);
						this.listPerspective = listPerspective;

					}

					this.perspective = this.listPerspective;

				}



			});

		}






		//  if(this.keyUpdate == 'dariperusahaan'){
		//     this.onOffSimpan = false;
		//     this.onOffUpdate = true;
		//  }else if(this.keyUpdate == 'daridepartemen'){
		//     this.onOffSimpan = true;
		//     this.onOffUpdate = false;
		//  }
		//ada service untuk get lagi disini

	}

	nodeUnselect(event) {
		// this.kdDepartemen ='';
		// this.selectedFile='';
	}

	confirmUpdate() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.update();
			}
		});
	}

	update() {
		// let awal = this.setTimeStamp(this.tanggalAwal);
		// let akhir = this.setTimeStamp(this.tanggalAkhir);
		let tampungStrategy = [];
		let dataStrategy;
		let kdS;
		let dataSimpanUpdate;
		let dataSimpanUpdateD;

		if (this.kdDepartemen == '') {

			for (let i = 0; i < this.perspective.length; i++) {

				for (let y = 0; y < this.perspective[i].children.length; y++) {

					if (this.perspective[i].children[y].kodeStrategy == undefined) {
						kdS = 0;
					} else {
						kdS = this.perspective[i].children[y].kodeStrategy;
					}

					dataStrategy = {
						"kdDepartemen": this.kdDepartemenLogin,
						"kdPerspective": this.perspective[i].kodePerspective,
						"kdStrategy": kdS,
						"noHistori": this.noHistoriCari,
						"noRec": "string",
						"statusEnabled": true,
						"version": 0
					}

					tampungStrategy.push(dataStrategy);

				}

			}

			dataSimpanUpdate = {
				"profileHistoriStrategyMap": tampungStrategy,
				"tglAkhir": 0,
				"tglAwal": 0
			}

			console.log(dataSimpanUpdate);
			let lanjut;
			for(let y=0; y<this.perspective.length; y++){
				if(this.perspective[y].children.length == 0){
					//this.alertService.warn('Perhatian','Data Strategy Di Perspective Tidak Boleh Kosong');
					lanjut = false;
					break;
				}
			}
			if(lanjut!=false){
				//alert('siap update perusahaan');
				this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymap/saveTambahan', dataSimpanUpdate).subscribe(response => {
					this.alertService.success('Berhasil', 'Data Diperbarui');
					//this.ngOnInit();
				});
			}else{
				this.alertService.warn('Perhatian','Data Strategy Di Perspective Tidak Boleh Kosong');
			}
			


		} else {
			for (let i = 0; i < this.perspective.length; i++) {

				for (let y = 0; y < this.perspective[i].children.length; y++) {

					if (this.perspective[i].children[y].kodeStrategy == undefined) {
						kdS = 0;
					} else {
						kdS = this.perspective[i].children[y].kodeStrategy;
					}

					dataStrategy = {
						"kdDepartemen": this.kdDepartemenLogin,
						"kdDepartemenD": this.kdDepartemen,
						"kdPerspective": 0,
						"kdPerspectiveD": this.perspective[i].kodePerspective,
						"kdStrategy": 0,
						"kdStrategyD": kdS,
						"noHistori": this.noHistoriCari,
						"noRec": "string",
						"statusEnabled": true,
						"version": 0
					}

					tampungStrategy.push(dataStrategy);

				}


			}

			dataSimpanUpdateD = {
				"profileHistoriStrategyMapD": tampungStrategy,
				"tglAkhir": 0,
				"tglAwal": 0
			}

			let lanjut;
			for(let u=0; u<this.perspective.length; u++){
				if(this.perspective[u].children.length == 0){
					lanjut = false;
					break;
				}
			}

			if(lanjut!=false){
				//alert('siap update departemen');
				this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapd/saveTambahan', dataSimpanUpdateD).subscribe(response => {
					this.alertService.success('Berhasil', 'Data Diperbarui');
					//this.ngOnInit();
				});
			}else{
				this.alertService.warn('Perhatian','Data Strategy Di Perspective Tidak Boleh Kosong');
			}


		}

		// alert('tes sukses');
	}

	getTglAwal() {
		this.selectedFile = '';
	}

	getTglAkhir() {
		this.selectedFile = '';
	}

	tambahStrategyMaster() {
		this.popUpStrategyMaster = true;
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

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn("Kesalahan", "Data Tidak Sesuai")
		} else {
			this.simpanStrategy();
		}
	}

	simpanStrategy() {
		// if (this.formAktif == false) {
		//   this.confirmUpdate()
		// } else {
		let noUrut = this.totalRecords + 1;
		//this.form.get('noUrut').enable();
		this.form.get('noUrut').setValue(noUrut);
		this.httpService.post(Configuration.get().dataBSC + '/strategy/save', this.form.value).subscribe(response => {
			this.alertService.success('Simpan', 'Data Disimpan');
			this.getStrategy();
			this.popUpStrategyMaster = false;
			this.batal();
		});
		//}

	}

	batal() {
		this.form = this.fb.group({

			'namaStrategy': new FormControl(null, Validators.required),
			'reportDisplay': new FormControl(null, Validators.required),
			'kdStrategyHead': new FormControl(null),
			'noUrut': new FormControl(null),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(null, Validators.required),
			'noRec': new FormControl(null),
			'kode': new FormControl(null),
		});
		this.form.get('noUrut').disable();
		this.getDataGrid(this.page, this.rows, '');
		this.getKdStrategyHead();
	}

	close() {
		this.form.get('noUrut').disable();
		this.batal();
	}

	getKdStrategyHead() {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Strategy&select=namaStrategy,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdStrategyHead = [];
			this.kdStrategyHead.push({ label: '--Pilih Parent Strategy--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.kdStrategyHead.push({ label: res.data.data[i].namaStrategy, value: res.data.data[i].id_kode })
			};
		},
			error => {
				this.kdStrategyHead = [];
				this.kdStrategyHead.push({ label: '-- ' + error + ' --', value: '' })
			});

	}

	getDataGrid(page: number, rows: number, cari: string) {
		this.httpService.get(Configuration.get().dataBSC + '/strategy/findAll?page=' + page + '&rows=' + rows + '&dir=namaStrategy&sort=desc&namaStrategy=' + cari).subscribe(table => {
			// this.listData = table.Strategy;
			this.totalRecords = table.totalRow;
		});
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaStrategy').value)
	}

	updateM() {
		this.confirmUpdate();
	}

	getPeriodeHead(page: number, rows: number, search: any) {

		//ambil periode head
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByKomponen').subscribe(res => {
			this.listPeriodeHead = [];
			this.listPeriodeHead.push({ label: '-- Pilih Periode --', value: null })
			for (var i = 0; i < res.data.listPeriode.length; i++) {
				this.listPeriodeHead.push({ label: res.data.listPeriode[i].namaPeriode, value: res.data.listPeriode[i].kdPeriode })
			};
		});

	}

	getKode(event) {
		this.tglAwalPer = "";
		this.tglAkhirPer = "";
		this.selected = "";
		this.listPeriode = [];
		this.selectedFile = "";
		this.kdDepartemen = "";
		this.periodeSelected = event.value;
		if(this.periodeSelected != null){
			//this.getPerspectiveAll();
			this.ambilPeriodeAnak(this.periodeSelected);
		}else if(this.periodeSelected == null){
			this.perspective = [];
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

	pilihPeriode(event) {
		this.kdDepartemen = '';
		this.noHistoriCari = '';
		this.selectedFile = '';
		let tglAwalPeriode = event.data.tglAwalPeriode;
		let tglAkhirPeriode = event.data.tglAkhirPeriode;
		this.tglAwalPer = tglAwalPeriode;
		this.tglAkhirPer = tglAkhirPeriode;
		this.kdPeriode = event.data.kode.kode.kode;
		this.kdHead = event.data.kdPeriodeHead;
		this.namaPeriode = event.data.namaPeriode;
		this.reportD = event.data.reportDisplay;
		this.listPerspective = [];
		let dataTampungFinal = [];
		let dataAnak;
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findByPeriodV2/{startDate}/{endDate}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspective&sort=asc&startDate=' + this.tglAwalPer + '&endDate=' + this.tglAkhirPer).subscribe(table => {
			let dataMap = table.ProfileHistoriStrategyMap;
			for(let x=0; x<dataMap.length; x++){
				if(dataMap[x].noHistori == undefined || dataMap[x].noHistori == null){
					this.noHistories = undefined;
				}else{
					this.noHistories = table.ProfileHistoriStrategyMap[0].noHistori;
				}
			}

			if (dataMap.length == 0) {
				this.getPerspectiveAll();
				this.noHistoriCari = '';
				this.onOffSimpan = false;
				this.onOffUpdate = true;
			} else if (dataMap.length != 0) {
				this.onOffSimpan = true;
				this.onOffUpdate = false;
				this.noHistoriCari = dataMap[0].noHistori;
				for (var z = 0; z < dataMap.length; z++) {
					dataTampungFinal[z] = {
						"label": dataMap[z].namaPerspective,
						"kodePerspective": dataMap[z].kdPerspective,
						"children": []
					}
					for (var u = 0; u < dataMap[z].strategies.length; u++) {
						dataAnak = {
							"label": dataMap[z].strategies[u].namaStrategy,
							"kodeStrategy": dataMap[z].strategies[u].kdStrategy,
							"kodePerspective": dataMap[z].strategies[u].kdPerspective
						}
						dataTampungFinal[z].children.push(dataAnak)
					}

					let listPerspective = [...this.listPerspective];
					listPerspective.push(dataTampungFinal[z]);
					this.listPerspective = listPerspective;

				}

				this.perspective = this.listPerspective;
			}



		})

	}

	// getVisi(tglAwal,tglAkhir){
	//   this.httpService.get( Configuration.get().dataBSC + '/profilehistorivisimisi/findByPeriod/{startDate}/{endDate}?page=' + this.page + '&rows=' + this.rows + '&dir=keteranganLainnya&sort=asc&startDate=' + tglAwal + '&endDate=' + tglAkhir).subscribe(table => {
	//     let dataTampung = table.ProfileHistoriVisiMisi;
	//     if(dataTampung.length == 0){
	//       this.Visi = '';
	//     }else{
	//       this.Visi = dataTampung[0].namaVisi;
	//     }
	//   })
	// }


}
