import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { ConfirmationService } from 'primeng/primeng';
import { AlertService, Configuration } from '../../../global';

@Component({
	selector: 'app-profile-history-strategy-map',
	templateUrl: './profile-history-strategy-map.component.html',
	styleUrls: ['./profile-history-strategy-map.component.scss'],
	providers: [ConfirmationService]
})

export class ProfileHistoryStrategyMapComponent implements OnInit {

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

	ngOnInit() {
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.kdDepartemen = '';
		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
		this.getStrategy();
		this.getPerspectiveAll();
		this.getDepartemen();
	}

	constructor(private alertService: AlertService, private httpService: HttpClient) { }

	tesClick(e: HTMLElement) {
		let namaClass = e.className;
		// const el = document.querySelector(namaClass);
		if (namaClass === 'ngx-dnd-content') {
			alert('clicked');
		}
	}
	getDepartemen() {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id.kode').subscribe(res => {
			this.Departemen = [];
			this.Departemen.push({ label: '-- Pilih --', value: null })
			for (var i = 0; i < res.data.data.length; i++) {
				this.Departemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id_kode })
			};
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
				tampungTahan = {
					"label": PerspectiveAll[y].namaPerspective,
					"kodePerspective": PerspectiveAll[y].kode.kode,
					"children": []
				}
				tampungFinal.push(tampungTahan);
			}
			this.perspective = tampungFinal;
			console.log(this.perspective);
		});
	}
	getStrategy() {
		let strategy = [];
		let tampungStrategy;
		this.httpService.get(Configuration.get().dataBSC + '/strategy/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaStrategy&sort=desc').subscribe(table => {
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
		let awal = this.setTimeStamp(this.tanggalAwal);
		let akhir = this.setTimeStamp(this.tanggalAkhir);
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
						"noHistori": "string",
						"noRec": "string",
						"statusEnabled": true,
						"version": 0
					}

					tampungStrategy.push(dataStrategy);

				}

			}

			dataSimpan = {
				"profileHistoriStrategyMap": tampungStrategy,
				"tglAkhir": awal,
				"tglAwal": akhir
			}
			console.log(dataSimpan);

			this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymap/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.ngOnInit();
			});

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
						"noHistori": "string",
						"noRec": "string",
						"statusEnabled": true,
						"version": 0
					}

					tampungStrategy.push(dataStrategy);

				}


			}
			dataSimpanD = {
				"profileHistoriStrategyMapD": tampungStrategy,
				"tglAkhir": awal,
				"tglAwal": akhir
			}
			console.log(dataSimpanD);

			this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapd/save', dataSimpanD).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');

			});
		}
	}

	refreshData() {
		this.ngOnInit();
	}

	cariPeriode() {
		this.listPerspective = [];
		let dataTampungP = [];
		let dataTampungFinal = [];
		let dataTampungAnak = [];
		let dataAnak;
		let awal = this.setTimeStamp(this.tanggalAwal);
		let akhir = this.setTimeStamp(this.tanggalAkhir);
		if (this.kdDepartemen == '') {
			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findByPeriodV2/{startDate}/{endDate}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspective&sort=asc&startDate=' + awal + '&endDate=' + akhir).subscribe(table => {
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

				console.log(this.listPerspective);
				this.perspective = this.listPerspective;

			});
		} else {
			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapd/findByPeriodV2/{startDate}/{endDate}/{kdDepartemenD}?page=' + this.page + '&rows=' + this.rows + '&dir=id.kdPerspectiveD&sort=asc&startDate=' + awal + '&endDate=' + akhir + '&kdDepartemenD=' + this.kdDepartemen).subscribe(table => {
				let dataMap = table.ProfileHistoriStrategyMap;
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

				console.log(this.listPerspective);
				this.perspective = this.listPerspective;

			});

		}


	}

	onDrop(event) {
		let data = event;
		this.perspective;
		for (var y = 0; y < this.perspective.length; y++) {
			if (this.perspective[y].kodeStrategy) {
				this.perspective.splice(y, 1)
			}
		}
	}

	tesEvent(event) {
		let dataE = event;
		if (dataE.toElement == '<div class="ngx-dnd-content">Manage Cost Efficiency</div>') {
			alert('tes');
		}
		console.log(dataE);
	}

}