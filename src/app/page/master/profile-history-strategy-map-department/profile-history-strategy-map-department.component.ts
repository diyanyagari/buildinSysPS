import { Component, OnInit } from '@angular/core';
import { AlertService, Configuration, AuthGuard, InfoComp } from '../../../global';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { HttpClient } from '../../../global/service/HttpClient';

@Component({
	selector: 'app-profile-history-strategy-map-department',
	templateUrl: './profile-history-strategy-map-department.component.html',
	styleUrls: ['./profile-history-strategy-map-department.component.scss'],
	providers: [ConfirmationService]
})
export class ProfileHistoryStrategyMapDepartmentComponent implements OnInit {

	page: number;
	row: number;
	tanggalAwal: any;
	tanggalAkhir: any;
	inputTanggalAwal: any;
	inputTanggalAkhir: any;
	listDepartemen: any[];
	pilihDepartmen: any;
	pilihDepartmenDialog: any;
	selectedNamaStrategy: any;
	cbHeader: any;
	menuStrategyPerspectiveForMenu: SelectItem[];
	dataPerspective: any[];
	selectedPerspectiveForMenu: any;
	selectedPerspectiveForDialog: any;
	cols: any[];
	displayDialogCreate: boolean = false;
	checkedAll: boolean = false;
	dataProfileHistoryStrategyMap: any[];
	dataProfileHistoryStrategyMapForDialog: any[];

	constructor(private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService) { }

	ngOnInit() {
		if (this.page == undefined || this.row == undefined) {
			this.page = Configuration.get().page;
			this.row = Configuration.get().rows;
		}
		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.inputTanggalAwal = new Date();
		this.inputTanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
		this.inputTanggalAwal.setHours(0, 0, 0, 0);
		this.cols = [
			{ field: 'no', header: 'No' },
			{ field: 'nama sasaran strategy', header: 'Nama Sasaran Strategy' }
		]
		let tanggalAkhir = this.setTimeStamp(this.tanggalAkhir);
		let tanggalAwal = this.setTimeStamp(this.tanggalAwal);
		let inputTanggalAkhir = this.setTimeStamp(this.inputTanggalAwal);
		let inputTanggalAwal = this.setTimeStamp(this.inputTanggalAwal);

		//get department
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
			this.listDepartemen = [];
			this.listDepartemen.push({ label: '--Pilih Departemen--', value: '' })
			for (var i = 0; i < res.data.data.length; i++) {
				this.listDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
			};
		}, error => {
			this.listDepartemen = [];
			this.listDepartemen.push({ label: '-- ' + error + ' --', value: '' })
		});
		// method service
		this.getPerspective();
		this.getAllProfileHistoryStrategyMap();
		this.getAllProfileHistoryStrategyMapForDialog();
	}
	getPerspective() {
		let datape = [];
		this.httpService.get(Configuration.get().dataBSC + '/perspective/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPerspective&sort=desc').subscribe(res => {
			// let dataTemporary = [];
			// for (let i = 0; i < res.Perspective.length; i++) {
			// 	if (res.Perspective[i].statusEnabled == true) {
			// 		let dataTemp = {
			// 			"noUrut": res.Perspective[i].noUrut,
			// 			"namaPerspective":  res.Perspective[i].namaPerspective,
			// 			"kdDepartemen": res.Perspective[i].kdDepartemen,
			// 			"version": res.Perspective[i].version,
			// 			"noRec": res.Perspective[i].noRec,
			// 			"statusEnabled": res.Perspective[i].statusEnabled,
			// 			"reportsDisplay": res.Perspective[i].reportsDisplay,
			// 			"namaExternal": res.Perspective[i].namaExternal,
			// 			"namaDepartemen": res.Perspective[i].namaDepartemen,
			// 			"kdPerspectiveHead": res.Perspective[i].kdPerspectiveHead,
			// 			"kode": {
			// 				"kdProfile": res.Perspective[i].kdProfile,
			// 				"kode": res.Perspective[i].kode
			// 			},
			// 			"namaPerspectiveHead": res.Perspective[i].namaPerspectiveHead,
			// 			"kodeExternal": res.Perspective[i].kodeExternal
			// 		}
			// 		dataTemporary.push(dataTemp);
			// 	}
			// }
			this.dataPerspective = res.Perspective;
			this.dataPerspective.forEach(function (datap) {
				let dataItem = {
					"label": datap.namaPerspective,
					"value": datap.kode.kode,
				};
				// console.log('datap:', datap);
				// console.log('datape:', datape);
				datape.push(dataItem);
			});
			this.menuStrategyPerspectiveForMenu = datape;
		});
	}
	cari() {
		let tglAwal = this.setTimeStamp(this.tanggalAwal);
		let tglAkhir = this.setTimeStamp(this.tanggalAkhir);
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findByPeriod/{startDate}/{endDate}/{kdPerspective}?page=' + this.page + '&rows=' + this.row + '&dir=kdPerspective&sort=desc&startDate=' + tglAwal + '&endDate=' + tglAkhir).subscribe(res => {
			let dataTemporary = [];
			// logic untuk memfilter service dengan statusEnbled = true dan menampilkan kedalam html hanya yang berstatus enable true
			for (let i = 0; i < res.ProfileHistoriStrategyMap.length; i++) {
				if (res.ProfileHistoriStrategyMap[i].statusEnabled == true) {
					let dataTemp = {
						"namaStrategy": res.ProfileHistoriStrategyMap[i].namaStrategy,
						"noHistori": res.ProfileHistoriStrategyMap[i].noHistori,
						"kdProfile": res.ProfileHistoriStrategyMap[i].kdProfile,
						"namaPerspective": res.ProfileHistoriStrategyMap[i].namaPerspective,
						"kdDepartemen": res.ProfileHistoriStrategyMap[i].kdDepartemen,
						"version": res.ProfileHistoriStrategyMap[i].version,
						"noRec": res.ProfileHistoriStrategyMap[i].noRec,
						"statusEnabled": res.ProfileHistoriStrategyMap[i].statusEnabled,
						"kdPerspective": res.ProfileHistoriStrategyMap[i].kdPerspective,
						"tglAkhir": res.ProfileHistoriStrategyMap[i].tglAkhir,
						"namaDepartemen": res.ProfileHistoriStrategyMap[i].namaDepartemen,
						"kdStrategy": res.ProfileHistoriStrategyMap[i].kdStrategy,
						"tglAwal": res.ProfileHistoriStrategyMap[i].tglAwal,
					}
					dataTemporary.push(dataTemp);
				}
			}
			this.dataProfileHistoryStrategyMap = dataTemporary;
		});
	}
	getProfileHistoryStrategyMapByPeriod() {
		let tglAwal = this.setTimeStamp(this.tanggalAwal);
		let tglAkhir = this.setTimeStamp(this.tanggalAkhir);

	}
	getAllProfileHistoryStrategyMap() {
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findAll?page=' + this.page + '&rows=' + this.row + '&dir=id.kdPerspective&sort=desc').subscribe(res => {
			let dataTemporary = [];
			// logic untuk memfilter service dengan statusEnbled = true dan menampilkan kedalam html hanya yang berstatus enable true
			for (let i = 0; i < res.ProfileHistoriStrategyMap.length; i++) {
				if (res.ProfileHistoriStrategyMap[i].statusEnabled == true) {
					let dataTemp = {
						"namaStrategy": res.ProfileHistoriStrategyMap[i].namaStrategy,
						"noHistori": res.ProfileHistoriStrategyMap[i].noHistori,
						"kdProfile": res.ProfileHistoriStrategyMap[i].kdProfile,
						"namaPerspective": res.ProfileHistoriStrategyMap[i].namaPerspective,
						"kdDepartemen": res.ProfileHistoriStrategyMap[i].kdDepartemen,
						"version": res.ProfileHistoriStrategyMap[i].version,
						"noRec": res.ProfileHistoriStrategyMap[i].noRec,
						"statusEnabled": res.ProfileHistoriStrategyMap[i].statusEnabled,
						"kdPerspective": res.ProfileHistoriStrategyMap[i].kdPerspective,
						"tglAkhir": res.ProfileHistoriStrategyMap[i].tglAkhir,
						"namaDepartemen": res.ProfileHistoriStrategyMap[i].namaDepartemen,
						"kdStrategy": res.ProfileHistoriStrategyMap[i].kdStrategy,
						"tglAwal": res.ProfileHistoriStrategyMap[i].tglAwal,
					}
					dataTemporary.push(dataTemp);
				}
			}
			this.dataProfileHistoryStrategyMap = dataTemporary;
		});
	}
	getProfileHistoryStrategyMapByPerspective() {
		let kdpersp = this.selectedPerspectiveForMenu;
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findAll?page=' + this.page + '&rows=' + this.row + '&dir=id.kdPerspective&sort=desc&id.kdPerspective=' + kdpersp).subscribe(res => {
			let dataTemporary = [];
			// logic untuk memfilter service dengan statusEnbled = true dan menampilkan kedalam html hanya yang berstatus enable true
			for (let i = 0; i < res.ProfileHistoriStrategyMap.length; i++) {
				if (res.ProfileHistoriStrategyMap[i].statusEnabled == true) {
					let dataTemp = {
						"namaStrategy": res.ProfileHistoriStrategyMap[i].namaStrategy,
						"noHistori": res.ProfileHistoriStrategyMap[i].noHistori,
						"kdProfile": res.ProfileHistoriStrategyMap[i].kdProfile,
						"namaPerspective": res.ProfileHistoriStrategyMap[i].namaPerspective,
						"kdDepartemen": res.ProfileHistoriStrategyMap[i].kdDepartemen,
						"version": res.ProfileHistoriStrategyMap[i].version,
						"noRec": res.ProfileHistoriStrategyMap[i].noRec,
						"statusEnabled": res.ProfileHistoriStrategyMap[i].statusEnabled,
						"kdPerspective": res.ProfileHistoriStrategyMap[i].kdPerspective,
						"tglAkhir": res.ProfileHistoriStrategyMap[i].tglAkhir,
						"namaDepartemen": res.ProfileHistoriStrategyMap[i].namaDepartemen,
						"kdStrategy": res.ProfileHistoriStrategyMap[i].kdStrategy,
						"tglAwal": res.ProfileHistoriStrategyMap[i].tglAwal,
					}
					dataTemporary.push(dataTemp);
				}
			}
			this.dataProfileHistoryStrategyMap = dataTemporary;
		});
	}

	getAllProfileHistoryStrategyMapForDialog() {
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findAll?page=' + this.page + '&rows=' + this.row + '&dir=id.kdPerspective&sort=desc').subscribe(res => {
			let dataTemporary = [];
			// logic untuk memfilter service dengan statusEnbled = true dan menampilkan kedalam html hanya yang berstatus enable true
			for (let i = 0; i < res.ProfileHistoriStrategyMap.length; i++) {
				if (res.ProfileHistoriStrategyMap[i].statusEnabled == true) {
					let dataTemp = {
						"namaStrategy": res.ProfileHistoriStrategyMap[i].namaStrategy,
						"noHistori": res.ProfileHistoriStrategyMap[i].noHistori,
						"kdProfile": res.ProfileHistoriStrategyMap[i].kdProfile,
						"namaPerspective": res.ProfileHistoriStrategyMap[i].namaPerspective,
						"kdDepartemen": res.ProfileHistoriStrategyMap[i].kdDepartemen,
						"version": res.ProfileHistoriStrategyMap[i].version,
						"noRec": res.ProfileHistoriStrategyMap[i].noRec,
						"statusEnabled": res.ProfileHistoriStrategyMap[i].statusEnabled,
						"kdPerspective": res.ProfileHistoriStrategyMap[i].kdPerspective,
						"tglAkhir": res.ProfileHistoriStrategyMap[i].tglAkhir,
						"namaDepartemen": res.ProfileHistoriStrategyMap[i].namaDepartemen,
						"kdStrategy": res.ProfileHistoriStrategyMap[i].kdStrategy,
						"tglAwal": res.ProfileHistoriStrategyMap[i].tglAwal,
					}
					dataTemporary.push(dataTemp);
				}
			}
			this.dataProfileHistoryStrategyMapForDialog = dataTemporary;
		});
	}
	getProfileHistoryStrategyMapByPerspectiveForDialog() {
		let kdpersp = this.selectedPerspectiveForDialog;
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findAll?page=' + this.page + '&rows=' + this.row + '&dir=id.kdPerspective&sort=desc&id.kdPerspective=' + kdpersp).subscribe(res => {
			let dataTemporary = [];
			// logic untuk memfilter service dengan statusEnbled = true dan menampilkan kedalam html hanya yang berstatus enable true
			for (let i = 0; i < res.ProfileHistoriStrategyMap.length; i++) {
				if (res.ProfileHistoriStrategyMap[i].statusEnabled == true) {
					let dataTemp = {
						"namaStrategy": res.ProfileHistoriStrategyMap[i].namaStrategy,
						"noHistori": res.ProfileHistoriStrategyMap[i].noHistori,
						"kdProfile": res.ProfileHistoriStrategyMap[i].kdProfile,
						"namaPerspective": res.ProfileHistoriStrategyMap[i].namaPerspective,
						"kdDepartemen": res.ProfileHistoriStrategyMap[i].kdDepartemen,
						"version": res.ProfileHistoriStrategyMap[i].version,
						"noRec": res.ProfileHistoriStrategyMap[i].noRec,
						"statusEnabled": res.ProfileHistoriStrategyMap[i].statusEnabled,
						"kdPerspective": res.ProfileHistoriStrategyMap[i].kdPerspective,
						"tglAkhir": res.ProfileHistoriStrategyMap[i].tglAkhir,
						"namaDepartemen": res.ProfileHistoriStrategyMap[i].namaDepartemen,
						"kdStrategy": res.ProfileHistoriStrategyMap[i].kdStrategy,
						"tglAwal": res.ProfileHistoriStrategyMap[i].tglAwal,
					}
					dataTemporary.push(dataTemp);
				}
			}
			this.dataProfileHistoryStrategyMapForDialog = dataTemporary;
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
	simpanData() {
		let dataSave = [];
		let dataLength = this.selectedNamaStrategy.length;
		if (this.pilihDepartmenDialog == 0 && this.pilihDepartmenDialog == "" && this.selectedNamaStrategy == 0) {
			this.alertService.warn('Peringatan', 'Silahkan Pilih Strategi dan Departmen');
		}
		if (this.selectedPerspectiveForDialog == 0) {
			this.alertService.warn('Peringatan', 'Silahkan Pilih Nama Perspective');
		} else {
			for (let i = 0; i < dataLength; i++) {
				let dataTempSave = {
					"kdDepartemen": "string",
					"kdDepartemenD": this.pilihDepartmenDialog,
					"kdPerspective": 0,
					"kdPerspectiveD": this.selectedPerspectiveForDialog,
					"kdStrategy": 0,
					"kdStrategyD": this.selectedNamaStrategy[i].kdStrategy,
					"noHistori": "string",
					"noRec": "string",
					"statusEnabled": true,
					"version": "",
				}
				dataSave.push(dataTempSave);
			}
			let dataReal = {
				"profileHistoriStrategyMapD": dataSave,
				"tglAkhir": this.setTimeStamp(this.inputTanggalAkhir),
				"tglAwal": this.setTimeStamp(this.inputTanggalAwal),
			}
			console.log(dataReal);
			this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapd/save', dataReal).subscribe(res => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.ngOnInit();
			});
		}
	}
	showDialog() {
		this.displayDialogCreate = true;
	}
	closeDialog() {
		this.displayDialogCreate = false;
	}
}