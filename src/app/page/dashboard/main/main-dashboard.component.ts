import { ChangeDetectionStrategy, OnDestroy,  Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../global';
import { Observable } from 'rxjs/Rx';
import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'underscore';

declare var google: any;
import {
  GridsterComponentInterface,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from '../../../lib';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-dashboard',
	templateUrl: './main-dashboard.component.html',
	styleUrls: ['./main-dashboard.component.scss'],
//	changeDetection: ChangeDetectionStrategy.OnPush,
//	encapsulation: ViewEncapsulation.None,
  	providers: [ConfirmationService]
})

export class MainDashboard implements OnInit,OnDestroy {
	options: GridsterConfig;
	dashboard: Array<GridsterItem>;
	//dashboardTemp : Array<GridsterItem>;
	remove: boolean;
	keyStorage : string;
	availableDashboard: any[];
	dashboardFromServer: any;
	dashboardDefault: any[];

	bknAwal : boolean;

	muncul : boolean;

	cities: SelectItem[];

	cars: any[];

	chartData: any;

	events: any[];

	selectedCity: any;
	optionsMap: any;
	overlays: any[];
	infoWindow: any;
	dataPengajuan: any;
	dataPegawaiAbsen: any[];
	dataPerjalanan: any[];
//	totalPegawai: any;
	totalAset: any;
	totalgaji: any;
	totalGajiRuangan: any;
	dataPegawai: any[];
	dataAbsensi: any;
	jabatan: any[];
	absensi: any[];
	dataJabatan: any;
	pengajuan: any[];
	aset: any[];
	dataAset: any;
	pengajuanBaru: any;
	listTampilan:any[];
	tampilanPersentasiAbsensi: any;
	tampilanPersentasiJabatan: any;
	dataDonutJabatan: any;
	dataLineJabatan:any;
	dataLinePengajuan:any;
	tampilanPersentasiPengajuan:any;
	dataDonutPengajuan:any;
	dataBarAset:any;
	dataLineAset:any;
	tampilanPersentasiAset: any;
	draggedDashboard: any;
	itemPush: any[];
	// subscription: Subscription;

	// sisa pinjaman section
	SisaPinjamanPegawai: any;
	tampilanPersentasiSisaPinjamanPegawai: any;

	// listem drop widget
	DropWidget: any;

	// dynamic height container gridster to prevent scroll
	heightContainerGridster: number;

	// data pegawai usia pensiun
	dataPegawaiUsiaPensiun1: any[];
	dataPegawaiUsiaPensiunHeader1: any;
	dataPegawaiUsiaPensiun2: any[];
	dataPegawaiUsiaPensiunHeader2: any;
	totalRecordsPegawaiUsiaPensiun: any;

	// data kontak pegawai
//	dataKontakPegawai: any[];
//	filterKontakPegawai: string = '';
//	totalRecordsKontak: any;

	// data habis kontrak
	dataHabisKontrak: any[];
	filterHabisKontrak: string = '';
	totalRecordsHabisKontrak: any;

	// data ulang tahun bulan ini
	dataUlangTahunBulanIni: any[];
	totalRecordsUlangTahun: any;

	// pegawai pensiun section
	tampilanPersentasiPegawaiPensiun: any;
	dataPegawaiPensiun: any[];

	// pegawai resign section
	tampilanPersentasiPegawaiResign: any;
	dataPegawaiResign: any[];

	// data kolega
	dataKolega: any[];

	// data cuti
	//dataCuti: any[];

	// reset pagination to first or 1
//	@ViewChild('paginatorKontak') paginatorKontak: Paginator;
//	@ViewChild('paginatorHabisKontrak') paginatorHabisKontrak: Paginator;
//	@ViewChild('paginatorPegawaiUsiaPensiun') paginatorPegawaiUsiaPensiun: Paginator;

	// filter jumlah pegawai
	filter_jumlah_pegawai: any[];
	filterJumlahPegawai: any;
	dataJumlahPegawai: any;
	filter_tipe_chart_jumlah_pegawai: any[];
	filterTipeChartJumlahPegawai: any;

 // imgLoading : string = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH'
 //                          +'/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAAC'
 //                          + 'wAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkY'
 //                          + 'DAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRV'
 //                          + 'saqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMl'
 //                          + 'FYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAA' 
 //                          + 'ABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI'
 //                          + '5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8'
 //                          + 'pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4'
 //                          + 'CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi6'
 //                          + '3P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAA'
 //                          + 'ALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1Yh'
 //                          + 'iCnlsRkAAAOwAAAAAAAAAAAA==';

	constructor(private httpService: HttpClient,
		private authGuard: AuthGuard,
		protected translateService: TranslateService,
		private dashboardService : DashboardService,
		private confirmationService: ConfirmationService,
		private alertService: AlertService,
	private ref:ChangeDetectorRef
)
		{this.dashboardService.currenDrop.subscribe(widget => this.DropWidget = widget);}

	static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
		console.info('eventStop', item, itemComponent, event);
	}

	itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
		console.info('itemChanged', item, itemComponent);
		console.log(document.getElementById(itemComponent.item.content));
		localStorage.setItem(this.keyStorage,JSON.stringify(this.dashboard));

		if(document.getElementById(itemComponent.item.content)) {
			// resize item gridsster and parent gridster hardcode number get from manual testing on ghani's template
			// let fixSizeKontak = 117;
			// if(window.screen.width >= 1920) {
			// 	fixSizeKontak = 117; // asalnya 118;
			// } else {
			// 	fixSizeKontak = 117; //asalna 118, walaupun ga ada beda nya, jangan dulu di hapus ini, ada yg ngaruh soalnya
			// }
			if(itemComponent.item.content == 'ulangTahun') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-110 + "px";
			}
			if(itemComponent.item.content == 'kontakPegawai') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-117 + "px";
			}
			if(itemComponent.item.content == 'habisKontrak') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-113 + "px"; // asalna 78
			}
			if(itemComponent.item.content == 'dataSisaPinjamanPegawai' || itemComponent.item.content == 'dataAbsensi' || itemComponent.item.content == 'dataJabatan' || itemComponent.item.content == 'dataPengajuan' || itemComponent.item.content == 'dataAset' || itemComponent.item.content == 'dataPensiun') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-76 + "px";
			}
			if(itemComponent.item.content == 'dataKolega' || itemComponent.item.content == 'cutiPegawai') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-71 + "px";
			}
			if(itemComponent.item.content == 'dataJumlahPegawai') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-76 + "px";
			}
			if(itemComponent.item.content == 'pegawaiUsiaPensiun') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-71 + "px";
			}
			this.heightContainerGridster = 120 + (itemComponent.gridster.rows * this.options.fixedRowHeight);
			document.getElementById("container-gridster").style.height = this.heightContainerGridster + "px";
			// end
		}
	}

	itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
		console.info('itemResized', item, itemComponent);
		localStorage.setItem(this.keyStorage,JSON.stringify(this.dashboard));
	}

	itemInit(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
		console.info('itemInitialized', item, itemComponent);
		console.log(document.getElementById(itemComponent.item.content));
		if(document.getElementById(itemComponent.item.content)) {
			// resize item gridsster and parent gridster hardcode number get from manual testing on ghani's template
			// let fixSizeKontak = 117;
			// if(window.screen.width >= 1920) {
			// 	fixSizeKontak = 117; // asalnya 118;
			// } else {
			// 	fixSizeKontak = 117; //asalna 118, walaupun ga ada beda nya, jangan dulu di hapus ini, ada yg ngaruh soalnya
			// }
			if(itemComponent.item.content == 'ulangTahun') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-110 + "px";
			}
			if(itemComponent.item.content == 'kontakPegawai') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-117 + "px"; // asalna 78
			}
			if(itemComponent.item.content == 'habisKontrak') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-113 + "px"; // asalna 78
			}
			if(itemComponent.item.content == 'dataSisaPinjamanPegawai' || itemComponent.item.content == 'dataAbsensi' || itemComponent.item.content == 'dataJabatan' || itemComponent.item.content == 'dataPengajuan' || itemComponent.item.content == 'dataAset' || itemComponent.item.content == 'dataPensiun') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-76 + "px";
			}
			if(itemComponent.item.content == 'dataKolega' || itemComponent.item.content == 'cutiPegawai') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-71 + "px";
			}
			if(itemComponent.item.content == 'dataJumlahPegawai') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-76 + "px";
			}
			if(itemComponent.item.content == 'pegawaiUsiaPensiun') {
				document.getElementById(itemComponent.item.content).style.height = itemComponent.height-71 + "px";
			}

			this.heightContainerGridster = 120 + (itemComponent.gridster.rows * this.options.fixedRowHeight);
			document.getElementById("container-gridster").style.height = this.heightContainerGridster + "px";
			// end
		}
	}

	itemRemoved(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
		console.info('itemRemoved', item, itemComponent);
		localStorage.setItem(this.keyStorage,JSON.stringify(this.dashboard));
		this.checkSizeGridsterFirstInit(this.dashboard);
	}

	static gridInit(grid: GridsterComponentInterface) {
		console.info('gridInit', grid);
	}

	static gridDestroy(grid: GridsterComponentInterface) {
		console.info('gridDestroy', grid);
	}

	emptyCellDrop(event: MouseEvent, item: GridsterItem) {
		console.info('empty cell click', event, item);
		this.DropWidget.posisi.x = item.x;
		this.DropWidget.posisi.y = item.y;
		this.dashboard.push(this.DropWidget.posisi);
		this.itemPush.splice(this.findIndex(this.DropWidget), 1);
		this.dashboardService.sendDataBaru(this.itemPush);
	}

    drop(event) {
        if(this.draggedDashboard) {
            let draggedCarIndex = this.findIndex(this.draggedDashboard);
            this.dashboard = [...this.dashboard, this.draggedDashboard.posisi];
            this.itemPush = this.itemPush.filter((val,i) => i!=draggedCarIndex);
            this.dashboardService.sendData(this.itemPush)
        }
    }
    findIndex(dashboard: any) {
        let index = -1;
        for(let i = 0; i < this.itemPush.length; i++) {
            if(dashboard.namaDashboard === this.itemPush[i].namaDashboard) {
                index = i;
                break;
            }
        }
        return index;
    }
    findObjek(dashboard: any) {
        let objek;
        for(let i = 0; i < this.availableDashboard.length; i++) {
            if(dashboard.content === this.availableDashboard[i].posisi.content) {
                objek = this.availableDashboard[i];
                break;
            }
        }
        return objek;
	}
	
    ngOnDestroy() {
		// this.subscription.unsubscribe();
    }
	cekIsShow(dashboard: any[], getData: any[]) {
	  	for(let i = 0; i < dashboard.length; i++) {
	  		for (let j = 0; j < getData.length; j ++) {
	  			if (dashboard[i].content === getData[j].posisi.content) {
	  				getData.splice(j, 1);
	  			}
	  		}
	    }
	    return getData;
	}

	// searchDataKontak(search, $event) {
	// 	this.getDataKontakPegawai(search, Configuration.get().page, Configuration.get().rows);
	// 	this.paginatorKontak.changePageToFirst($event);
	// }

	// getDataKontakPegawai(name, page, row) {
	// 	this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawaiContact?page='+ page +'&rows='+ row +'&dir=namaLengkap&sort=asc&namaLengkap=' + name).subscribe(table => {
	// 		this.dataKontakPegawai = table.data.pegawai;
	// 		this.totalRecordsKontak = table.data.totalRow;
	// 		if(table.data.pegawai[table.data.pegawai.length-1]) {
	// 			for(let counter = 0; counter < table.data.pegawai.length; counter++) {
	// 				this.dataKontakPegawai[counter].photoDiri = table.data.pegawai[counter].photoDiri == null || table.data.pegawai[counter].photoDiri == "" ? '../../../assets/layout/images/profile-image.png' : Configuration.get().resourceFile + "/image/show/" + table.data.pegawai[counter].photoDiri;
	// 				this.dataKontakPegawai[counter].mobilePhone1 = table.data.pegawai[counter].mobilePhone1 == null || table.data.pegawai[counter].mobilePhone1 == "" ? '-' : this.dataKontakPegawai[counter].mobilePhone1;
	// 				this.dataKontakPegawai[counter].alamatEmail = table.data.pegawai[counter].alamatEmail == null || table.data.pegawai[counter].alamatEmail == "" ? '-' : this.dataKontakPegawai[counter].alamatEmail;
	// 			}
	// 		}
	// 		if(table.data.pegawai.length == 0) {
	// 			if(document.getElementById('paginationKontak') != null) {
	// 				document.getElementById('paginationKontak').style.visibility = 'hidden';
	// 			}
	// 		} else {
	// 			if(document.getElementById('paginationKontak') != null) {
	// 				document.getElementById('paginationKontak').style.visibility = 'visible';
	// 			}
	// 		}
	// 		this.ref.detectChanges();
 //        });
	// }

	

	// getDataCuti() {
	// 	this.httpService.get(Configuration.get().dataHr2Mod3 + '/pengajuan-cuti/dashboard-jumlah-cuti').subscribe(table => {
	// 		this.dataCuti = table.data;
	// 		this.ref.detectChanges();
 //        });
	// }

	

	

	simpanDashboard() {
		console.log('simpan dashboard bray');
		this.confirmationService.confirm({
            message: 'Simpan permanent layout dashboard ke storage User Account?',
            accept: () => {
				console.log('create');
				this.httpService.post(Configuration.get().authLogin + '/dashboard/simpan-dashboard', JSON.stringify(this.dashboard)).subscribe(response => {
					this.alertService.success('Berhasil','Dashboard berhasil disimpan ke storage');
				}, error => {
					this.alertService.warn('Peringatan','Dashboard gagal disimpan ke storage');
				});
            }
        });
	}

	factoryDashboard() {
		console.log('factory setting');
		this.confirmationService.confirm({
            message: 'Reset layout dashboard ke factory setting?',
            accept: () => {
            	//this.muncul = false;
				console.log('reset');
				this.dashboard = JSON.parse(localStorage.getItem('defaultDashboard'));
				let dashboard = [...this.dashboard];
				let availableDashboard = [...this.availableDashboard];
				this.itemPush = this.cekIsShow(dashboard, availableDashboard);
				this.dashboardService.sendDataBaru(this.itemPush);
				this.checkSizeGridsterFirstInit(this.dashboard);
				this.alertService.success('Berhasil','Dashboard berhasil di reset ke factory setting, silahkan tunggu proses rendering');
				//this.muncul = true;
            }
        });
	}

	resetDashboard() {
		console.log('reset setting');
		this.confirmationService.confirm({
            message: 'Reset layout dashboard dari storage User Account?',
            accept: () => {
            	//this.muncul = false;
				this.httpService.get(Configuration.get().authLogin + '/dashboard/ambil-dashboard').subscribe(res => {
					if(res.data !== undefined && res.data !== null && res.data != "") {
						this.dashboard = JSON.parse(res.data);
						//localStorage.setItem(this.keyStorage, JSON.stringify(this.dashboard));
						let dashboard = [...this.dashboard];
						let availableDashboard = [...this.availableDashboard];
						this.itemPush = this.cekIsShow(dashboard, availableDashboard);
						this.dashboardService.sendDataBaru(this.itemPush);
						this.checkSizeGridsterFirstInit(this.dashboard);
						this.alertService.success('Berhasil','Dashboard berhasil di reset dari storage User Account, silahkan tunggu proses rendering');
					} else {
						this.alertService.warn('Peringatan','Layout dashboard belum pernah disimpan');
					}
					//this.muncul = true;
				},  error => {
					this.alertService.warn('Peringatan','Loading layout dari storage gagal');
					//this.muncul = true;
				});
        	}
        });    	

		
	}

	// paginateKontak(event) {
	// 	console.log(event);
	// 	this.getDataKontakPegawai(this.filterKontakPegawai, event.page+1, event.rows);
 //        //event.first = Index of the first record
 //        //event.rows = Number of rows to display in new page
 //        //event.page = Index of the new page
 //        //event.pageCount = Total number of pages
	// }
	
	
	checkSizeGridsterFirstInit(data) {
		let temp = 0;
		let temp_last_rows = 0;
		for(let counter = 0; counter < data.length; counter++) {
			if(data[counter].y > temp) {
				temp = data[counter].y;
				temp_last_rows = data[counter].rows;
			}
		}
		this.heightContainerGridster = 120 + ((temp + temp_last_rows) * this.options.fixedRowHeight);
		document.getElementById("container-gridster").style.height = this.heightContainerGridster + "px";
		console.log(this.heightContainerGridster);
	}

	

	

	getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	

	removeItem($event, item) {
		$event.preventDefault();
		$event.stopPropagation();
		this.dashboard.splice(this.dashboard.indexOf(item), 1);
		this.itemPush.push(this.findObjek(item));
		// this.dashboardService.sendData(this.itemPush);
		this.dashboardService.sendDataBaru(this.itemPush);
	}

	addItem() {
		this.dashboard.push({});
	}

	destroy() {
		this.remove = !this.remove;
	}

	ngOnInit() {
		this.bknAwal = false;
		this.muncul = true;
		this.keyStorage = 'dashboard' + this.authGuard.getUserDto().kdUser;

		let dashboard = this.dashboard = JSON.parse(localStorage.getItem(this.keyStorage));

		if(dashboard !== undefined && dashboard !== null && dashboard != "") {
			//this.muncul = true;
			this.initDahsboard(dashboard);
		} else {	
			//this.muncul = false;
			this.initDahsboard(null);

			this.httpService.get(Configuration.get().authLogin + '/dashboard/ambil-dashboard').subscribe(res => {
				if(res.data !== undefined && res.data !== null && res.data != "") {
					this.dashboard = JSON.parse(res.data);
					//localStorage.setItem(this.keyStorage, JSON.stringify(this.dashboard));
					let dashboard = [...this.dashboard];
					let availableDashboard = [...this.availableDashboard];
					this.itemPush = this.cekIsShow(dashboard, availableDashboard);
					this.dashboardService.sendDataBaru(this.itemPush);
					this.checkSizeGridsterFirstInit(this.dashboard);
					if (this.bknAwal){
						this.bknAwal = true;
						this.alertService.success('Berhasil','Loading layout dari storage server berhasil, silahkan tunggu proses rendering');
					}
				}
				//this.muncul = true;
			},  error => {
				this.bknAwal = true;
				this.alertService.warn('Peringatan','Loading layout dari storage gagal');
				//this.muncul = true;
			});
			
		}
	}	


	initDahsboard(paramdashboard : any){

		// this.dataKontakPegawai = [];
		this.dataHabisKontrak = [];
		this.dataPegawaiUsiaPensiun1 = [];
		this.dataPegawaiUsiaPensiun2 = [];
		this.dataUlangTahunBulanIni = [];
		this.dataPegawaiResign = [];
		this.itemPush = [];
		// this.subscription = this.dashboardService.getObject().subscribe(ob => { this.draggedDashboard = ob; });
		
		this.tampilanPersentasiSisaPinjamanPegawai = 1;
		// this.getDataSisaPinjamanPegawai(this.tampilanPersentasiSisaPinjamanPegawai);
		//this.getDataCuti();
		
		this.filterJumlahPegawai = 1; // default tampilan filter by jabatan
		this.filterTipeChartJumlahPegawai = 'pie'; // default tampilan filter chart by jabatan
		

		// check resolution
		if(window.screen.width >= 1920) {
			this.availableDashboard = [
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Pegawai',
					'deskripsi':'Summary pegawai',
					'posisi': {cols: 3, rows: 1, content: 'pegawai', hasContent: true}
				},
	
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Gaji Pegawai',
					'deskripsi':'Summary pengeluaran biaya gaji pegawai',
					'posisi': {cols: 3, rows: 1, content: 'gaji', hasContent: true}
				},
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Asset',
					'deskripsi':'Summary asset perusahaan',
					'posisi': {cols: 3, rows: 1, content: 'aset', hasContent: true}
				},
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Pengajuan',
					'deskripsi':'Summary pengajuan yang belum diproses',
					'posisi': {cols: 3, rows: 1, content: 'pengajuan', hasContent: true}
				},
	
				{
					'icon':'fa fa-table',
					'namaDashboard':'Absensi Pegawai',
					'deskripsi':'Data absensi pegawai',
					'posisi': {cols: 5, rows: 2, content: 'dataAbsensi', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Jabatan',
					'deskripsi':'Data jabatan',
					'posisi': {cols: 5, rows: 2, content: 'dataJabatan', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pengajuan',
					'deskripsi':'Data pengajuan',
					'posisi': {cols: 5, rows: 2, content: 'dataPengajuan', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Aset',
					'deskripsi':'Data aset perusahaan',
					'posisi': {cols: 5, rows: 2, content: 'dataAset', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Kontak Pegawai',
					'deskripsi':'Data kontak pegawai',
					'posisi': {cols: 3, rows: 4, minItemCols: 3, minItemRows:3, content: 'kontakPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Ulang Tahun Pegawai',
					'deskripsi':'Data ulang tahun pegawai di bulan ini',
					'posisi': {cols: 4, rows: 4, minItemCols: 3, minItemRows:3, content: 'ulangTahun', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pegawai Pensiun',
					'deskripsi':'Data pegawai pensiun',
					'posisi': {cols: 5, rows: 2, content: 'dataPensiun', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pegawai Resign',
					'deskripsi':'Data pegawai resign',
					'posisi': {cols: 5, rows: 2, content: 'dataResign', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Kolega',
					'deskripsi':'Data kolega',
					'posisi': {cols: 2, rows: 2, minItemCols: 2, minItemRows:2, content: 'dataKolega', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Jumlah Pegawai',
					'deskripsi':'Data jumlah pegawai',
					'posisi': {cols: 5, rows: 3, content: 'dataJumlahPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Pegawai Habis Kontrak',
					'deskripsi':'Data pegawai habis kontrak',
					'posisi': {cols: 3, rows: 4, minItemCols: 3, minItemRows:3, content: 'habisKontrak', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Akumulasi Cuti',
					'deskripsi':'Data akumulasi cuti',
					'posisi': {cols: 2, rows: 1, minItemCols: 2, minItemRows:1, content: 'cutiPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Sisa Pinjaman Pegawai',
					'deskripsi':'Data sisa pinjaman pegawai',
					'posisi': {cols: 5, rows: 2, content: 'dataSisaPinjamanPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pegawai Mencapai Batas Usia Pensiun',
					'deskripsi':'Data pegawai mencapai batas usia pensiun',
					'posisi': {cols: 3, rows: 2, minItemCols: 3, minItemRows:2, content: 'pegawaiUsiaPensiun', hasContent: true}
				}
			];
			this.dashboard = [
				{cols: 3, rows: 1, y: 0, x: 0, resizeEnabled: false, content: 'pegawai'},
				{cols: 3, rows: 1, y: 0, x: 3, resizeEnabled: false, content: 'gaji'},
				{cols: 3, rows: 1, y: 0, x: 6, resizeEnabled: false, content: 'aset'},
				{cols: 3, rows: 1, y: 0, x: 9, resizeEnabled: false, content: 'pengajuan'},
				{cols: 5, rows: 2, y: 1, x: 0, content: 'dataJabatan', hasContent: true},
				{cols: 3, rows: 4, y: 1, x: 5, minItemCols: 3, minItemRows:3, content: 'kontakPegawai', hasContent: true},
				{cols: 4, rows: 4, y: 1, x: 8, minItemCols: 3, minItemRows:3, content: 'ulangTahun', hasContent: true},
				{cols: 5, rows: 2, y: 3, x: 0, content: 'dataPengajuan', hasContent: true},
				{cols: 5, rows: 3, y: 5, x: 0, content: 'dataJumlahPegawai', hasContent: true},
				{cols: 5, rows: 3, y: 5, x: 5, content: 'dataAset', hasContent: true},
				{cols: 2, rows: 3, y: 5, x: 10, content: 'dataKolega', minItemCols: 2, minItemRows:2, hasContent: true}
				// HIDE DULU AH BIAR MUNCUL DI WIDGET
				// {cols: 5, rows: 2, y: 5, x: 5, content: 'dataAbsensi', hasContent: true},
				// {cols: 5, rows: 2, y: 7, x: 0, content: 'dataPensiun', hasContent: true},
				// {cols: 5, rows: 2, y: 7, x: 5, content: 'dataResign', hasContent: true}
				// END
			];

		} else {
			this.availableDashboard = [
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Pegawai',
					'deskripsi':'Summary pegawai',
					'posisi': {cols: 3, rows: 1, resizeEnabled: false, content: 'pegawai', hasContent: true}
				},
	
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Gaji Pegawai',
					'deskripsi':'Summary pengeluaran biaya gaji pegawai',
					'posisi': {cols: 3, rows: 1, resizeEnabled: false, content: 'gaji', hasContent: true}
				},
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Asset',
					'deskripsi':'Summary asset perusahaan',
					'posisi': {cols: 3, rows: 1, resizeEnabled: false, content: 'aset', hasContent: true}
				},
				{
					'icon':'fa fa-gear',
					'namaDashboard':'Summary Pengajuan',
					'deskripsi':'Summary pengajuan yang belum diproses',
					'posisi': {cols: 3, rows: 1, resizeEnabled: false, content: 'pengajuan', hasContent: true}
				},
	
				{
					'icon':'fa fa-table',
					'namaDashboard':'Absensi Pegawai',
					'deskripsi':'Data absensi pegawai',
					'posisi': {cols: 5, rows: 2, content: 'dataAbsensi', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Jabatan',
					'deskripsi':'Data jabatan',
					'posisi': {cols: 5, rows: 2, content: 'dataJabatan', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pengajuan',
					'deskripsi':'Data pengajuan',
					'posisi': {cols: 5, rows: 2, content: 'dataPengajuan', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Aset',
					'deskripsi':'Data aset perusahaan',
					'posisi': {cols: 5, rows: 2, content: 'dataAset', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Kontak Pegawai',
					'deskripsi':'Data kontak pegawai',
					'posisi': {cols: 4, rows: 4, minItemCols: 4, minItemRows:2, content: 'kontakPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Ulang Tahun Pegawai',
					'deskripsi':'Data ulang tahun pegawai di bulan ini',
					'posisi': {cols: 5, rows: 3, minItemCols: 3, minItemRows:3, content: 'ulangTahun', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pegawai Pensiun',
					'deskripsi':'Data pegawai pensiun',
					'posisi': {cols: 5, rows: 2, content: 'dataPensiun', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pegawai Resign',
					'deskripsi':'Data pegawai resign',
					'posisi': {cols: 5, rows: 2, content: 'dataResign', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Kolega',
					'deskripsi':'Data kolega',
					'posisi': {cols: 3, rows: 2, minItemCols: 3, minItemRows:2, content: 'dataKolega', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Jumlah Pegawai',
					'deskripsi':'Data jumlah pegawai',
					'posisi': {cols: 5, rows: 2, minItemCols: 5, minItemRows:2, content: 'dataJumlahPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Pegawai Habis Kontrak',
					'deskripsi':'Data pegawai habis kontrak',
					'posisi': {cols: 4, rows: 4, minItemCols: 4, minItemRows:2, content: 'habisKontrak', hasContent: true}
				},
				{
					'icon':'fa fa-th-list',
					'namaDashboard':'Akumulasi Cuti',
					'deskripsi':'Data akumulasi cuti',
					'posisi': {cols: 3, rows: 1, minItemCols: 3, minItemRows:1, content: 'cutiPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Sisa Pinjaman Pegawai',
					'deskripsi':'Data sisa pinjaman pegawai',
					'posisi': {cols: 5, rows: 2, content: 'dataSisaPinjamanPegawai', hasContent: true}
				},
				{
					'icon':'fa fa-table',
					'namaDashboard':'Pegawai Mencapai Batas Usia Pensiun',
					'deskripsi':'Data pegawai mencapai batas usia pensiun',
					'posisi': {cols: 4, rows: 2, minItemCols: 4, minItemRows:2, content: 'pegawaiUsiaPensiun', hasContent: true}
				}
			];
			this.dashboard = 
			[
				{"cols":3,"rows":1,"y":0,"x":0,"resizeEnabled":false,"content":"pegawai"},
				{"cols":3,"rows":1,"y":0,"x":3,"resizeEnabled":false,"content":"pengajuan"},
				{"cols":5,"rows":2,"y":3,"x":0,"content":"dataJabatan","hasContent":true},
				{"cols":4,"rows":4,"y":1,"x":5,"minItemCols":4,"minItemRows":2,"content":"kontakPegawai","hasContent":true},
				{"cols":5,"rows":2,"y":1,"x":0,"minItemCols":5,"minItemRows":2,"content":"dataJumlahPegawai","hasContent":true},
				{"cols":3,"rows":1,"minItemCols":3,"minItemRows":1,"content":"cutiPegawai","hasContent":true,"x":6,"y":0}
			];

			 /*[
				{cols: 3, rows: 1, y: 0, x: 0, resizeEnabled: false, content: 'pegawai'},
				{cols: 3, rows: 1, y: 0, x: 3, resizeEnabled: false, content: 'gaji'},
				{cols: 3, rows: 1, y: 0, x: 6, resizeEnabled: false, content: 'aset'},
				{cols: 3, rows: 1, y: 0, x: 9, resizeEnabled: false, content: 'pengajuan'},
				{cols: 5, rows: 2, y: 1, x: 0, content: 'dataJabatan', hasContent: true},
				{cols: 4, rows: 4, y: 1, x: 5, minItemCols: 4, minItemRows:2, content: 'kontakPegawai', hasContent: true},
				{cols: 3, rows: 2, y: 1, x: 9, content: 'dataKolega', minItemCols: 3, minItemRows:2, hasContent: true},
				{cols: 5, rows: 2, y: 3, x: 0, content: 'dataPengajuan', hasContent: true},
				{cols: 5, rows: 2, y: 5, x: 0, minItemCols: 5, minItemRows:2, content: 'dataJumlahPegawai', hasContent: true},
				{cols: 5, rows: 2, y: 5, x: 5, content: 'dataAset', hasContent: true},
			];*/


		}

		localStorage.setItem('defaultDashboard', JSON.stringify(this.dashboard));

		if (paramdashboard !== undefined && paramdashboard !== null){
			this.dashboard = paramdashboard;
		}

		
		let dashboard = [...this.dashboard];
		let availableDashboard = [...this.availableDashboard];
		this.itemPush = this.cekIsShow(dashboard, availableDashboard);
		this.dashboardService.sendDataBaru(this.itemPush);
		this.options = {
			gridType: 'verticalFixed',
			compactType: 'none',
			initCallback: MainDashboard.gridInit,
			destroyCallback: MainDashboard.gridDestroy,
			itemChangeCallback: this.itemChange.bind(this),
			itemResizeCallback: this.itemResize.bind(this),
			itemInitCallback: this.itemInit.bind(this),
			itemRemovedCallback: this.itemRemoved.bind(this),
			margin: 10,
			outerMargin: true,
			outerMarginTop: null,
			outerMarginRight: null,
			outerMarginBottom: null,
			outerMarginLeft: null,
			mobileBreakpoint: 640,
			minCols: 1,
			maxCols: 12,
			minRows: 1,
			maxRows: 100,
			maxItemCols: 100,
			minItemCols: 1,
			maxItemRows: 100,
			minItemRows: 1,
			maxItemArea: 2500,
			minItemArea: 1,
			defaultItemCols: 1,
			defaultItemRows: 1,
			fixedColWidth: 105,
			fixedRowHeight: 170,
			keepFixedHeightInMobile: false,
			keepFixedWidthInMobile: false,
			scrollSensitivity: 10,
			scrollSpeed: 20,
			enableEmptyCellClick: false,
			enableEmptyCellContextMenu: false,
			enableEmptyCellDrop: true,
			enableEmptyCellDrag: false,
			// emptyCellClickCallback: this.emptyCellClick.bind(this),
			// emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
			emptyCellDropCallback: this.emptyCellDrop.bind(this),
			// emptyCellDragCallback: this.emptyCellClick.bind(this),
			emptyCellDragMaxCols: 50,
			emptyCellDragMaxRows: 50,
			ignoreMarginInRow: false,
			draggable: {
				delayStart: 0,
				enabled: true,
				ignoreContentClass: 'cicing-content',
				ignoreContent: false,
				dragHandleClass: 'drag-handler',
				stop: MainDashboard.eventStop
			},
			resizable: {
				delayStart: 0,
				enabled: true,
				stop: MainDashboard.eventStop,
				handles: {
				s: true,
				e: true,
				n: true,
				w: true,
				se: true,
				ne: true,
				sw: true,
				nw: true
				}
			},
			swap: true,
			pushItems: false,
			disablePushOnDrag: false,
			disablePushOnResize: false,
			pushDirections: {north: true, east: true, south: true, west: true},
			pushResizeItems: false,
			displayGrid: 'onDrag&Resize',
			disableWindowResize: false,
			disableWarnings: false,
			scrollToNewItems: false
		};
		this.checkSizeGridsterFirstInit(this.dashboard);
		this.listTampilan = [
			{label:'Tabel', value:1},
			{label:'Bar', value:2},
			{label:'Line', value:3},
			{label:'Polar Area', value:4}
		];
		
		this.tampilanPersentasiAbsensi = 1;
		this.tampilanPersentasiJabatan = 1;
		this.tampilanPersentasiPengajuan = 1;
		this.tampilanPersentasiAset = 1;
		this.tampilanPersentasiPegawaiPensiun = 1;
		this.tampilanPersentasiPegawaiResign = 1;
		// this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findJumlahPegawai').subscribe(res => {
		// 	this.totalPegawai = res.data.totalPegawai;
		// },
		// error => {
		// 	this.totalPegawai = 0;
		// });

		// this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findJumlahJabatan').subscribe(res => {
		// 	this.jabatan = res.data.jabatanTotal;
		// 	let no = 1
		// 	let labels = []
		// 	this.jabatan.forEach(function (data) {
		// 		data.no = no++
		// 	})
		// 	let dataGrafik = []
		// 	for (let i=0;i<this.jabatan.length;i++) {
		// 		labels.push(this.jabatan[i].namaJabatan)
		// 		dataGrafik.push(this.jabatan[i].totalPegawai)
		// 	}
		// 	this.dataLineJabatan = {
		// 		labels: labels,
		// 		datasets: [
		// 		{
		// 			label: 'Jumlah Pegawai',
		// 			data: dataGrafik,
		// 			fill: false,
		// 			borderColor: '#009bf4'
		// 		}]
		// 	}
		// 	this.dataDonutJabatan = {
		// 		labels: labels,
		// 		datasets: [
		// 		{
		// 			label: 'Jumlah Pegawai',
		// 			backgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900"
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900"
		// 			],
		// 			data: dataGrafik
		// 		}]
		// 	}
		// 	this.dataJabatan = {
		// 		labels: labels,
		// 		datasets: [
		// 		{
		// 			label: 'Jumlah Pegawai',
		// 			backgroundColor: '#009bf4',
		// 			borderColor: '#009bf4',
		// 			data: dataGrafik
		// 		}]
		// 	};
		// 	this.ref.detectChanges();
		// });

		// this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiAset/findTotalAset').subscribe(res => {
		// 	this.totalAset = 0;
		// 	let total = 0
		// 	res.data.totalAset.forEach(function (data) {
		// 		total = total + data.totalAset
		// 	})
		// 	this.totalAset = total;
		// 	this.aset = res.data.totalAset;
		// 	let no = 1
		// 	let label = [];
		// 	let dataTotal = []
		// 	this.aset.forEach(function (data) {
		// 		data.no = no++
		// 		if (data.namaKelompokAset == null){
		// 			label.push("Lainnya")
		// 		} else {
		// 			label.push(data.namaKelompokAset)
		// 		}

		// 		dataTotal.push(data.totalAset)
		// 	})
		// 	this.dataAset = {
		// 		labels: label,
		// 		datasets: [
		// 		{
		// 			data: dataTotal,
		// 			backgroundColor: [
		// 			"#06d69e",
		// 			"#06b6d6",
		// 			"#06d659"
		// 			],
		// 			hoverBackgroundColor: [
		// 			"#06d69e",
		// 			"#06b6d6",
		// 			"#06d659"
		// 			]
		// 		}] 
		// 	}
		// 	this.dataBarAset = {
		// 		labels: label,
		// 		datasets: [
		// 		{
		// 			label: 'Jumlah Aset',
		// 			backgroundColor: '#009bf4',
		// 			borderColor: '#009bf4',
		// 			data: dataTotal
		// 		}]
		// 	};
		// 	this.dataLineAset = {
		// 		labels: label,
		// 		datasets: [
		// 		{
		// 			label: 'Jumlah Aset',
		// 			data: dataTotal,
		// 			fill: false,
		// 			borderColor: '#009bf4'
		// 		}]
		// 	}
		// 	this.ref.detectChanges();
		// },
		// error => {
		// 	this.totalAset = 0;
		// });

		// this.httpService.get(Configuration.get().dataHr2Mod3 + '/perhitungan-gaji/findTotalGaji').subscribe(res => {
		// 	this.totalgaji = res.data.total == null ? 0 : res.data.total;
		// 	this.totalGajiRuangan = res.data.ruangan;
		// 	this.ref.detectChanges();
		// },
		// error => {
		// 	this.totalgaji = 0;
		// });
		
		this.optionsMap = {
			center: {lat: -6.896181, lng: 107.637755},
			zoom: 17
		};

		// this.httpService.get(Configuration.get().dataHr1Mod2 + '/pegawaiStatusController/findSemuaStatus').subscribe(res => {
		// 	let array = [];
		// 	array.push({
		// 		'nama':res.data[0].nama,
		// 		'pengajuan' : 0,
		// 		'proses' : 0,
		// 		'setuju' : 0,
		// 		'tdkSetuju' : 0,
		// 		'batal' : 0,
		// 		'total' : 0
		// 	});

		// 	if (res.data[0].noRetur !== null){
		// 		array[0].batal++;
		// 	} else if (res.data[0].kdJenisKeputusan !== null){
		// 		if (res.data[0].kdJenisKeputusan == 1){
		// 			array[0].setuju++;    
		// 		} else {
		// 			array[0].tdkSetuju++;
		// 		}
		// 	} else if (res.data[0].noVerifikasi !== null){
		// 		array[0].proses++;
		// 	} else {
		// 		array[0].pengajuan++;
		// 	}
		// 	array[0].total++;

		// 	for (let i =1;i<res.data.length;i++){
		// 		let j;
		// 		for (j=0; j<array.length; j++){                
		// 			if (array[j].nama === res.data[i].nama){

		// 				if (res.data[i].noRetur !== null){
		// 					array[j].batal++;
		// 				} else if (res.data[i].kdJenisKeputusan !== null){
		// 					if (res.data[i].kdJenisKeputusan == 1){
		// 						array[j].setuju++;    
		// 					} else {
		// 						array[j].tdkSetuju++;
		// 					}
		// 				} else if (res.data[i].noVerifikasi !== null){
		// 					array[j].proses++;
		// 				} else {
		// 					array[j].pengajuan++;
		// 				}

		// 				array[j].total++;

		// 				break;
		// 			}
		// 		}

		// 		if (j == array.length){                    
		// 			array.push({
		// 				'nama':res.data[i].nama,
		// 				'pengajuan' : 0,
		// 				'proses' : 0,
		// 				'setuju' : 0,
		// 				'tdkSetuju' : 0,
		// 				'batal' : 0,
		// 				'total' : 0
		// 			});

		// 			if (res.data[i].noRetur !== null){
		// 				array[j].batal++;
		// 			} else if (res.data[i].kdJenisKeputusan !== null){
		// 				if (res.data[i].kdJenisKeputusan == 1){
		// 					array[j].setuju++;    
		// 				} else {
		// 					array[j].tdkSetuju++;
		// 				}
		// 			} else if (res.data[i].noVerifikasi !== null){
		// 				array[j].proses++;
		// 			} else {
		// 				array[j].pengajuan++;
		// 			}
		// 			array[j].total++;
		// 		}
		// 	}

		// 	// console.log(array);
		// 	this.pengajuanBaru = 0
		// 	this.pengajuan = array;
		// 	let labels = []
		// 	let pengajuan = []
		// 	let proses = []
		// 	let setuju = []
		// 	let tdkSetuju = []
		// 	let batal = []
		// 	array.forEach(function (data) {
		// 		if (data.nama == "stpinjaman") {
		// 			labels.push("Pinjaman")
		// 		} else if (data.nama == "stholdpinjaman") {
		// 			labels.push("Perubahan Pinjaman")
		// 		} else if (data.nama == "streimburse") {
		// 			labels.push("Reimburs")
		// 		} else if (data.nama == "stperubahanjadwalkerja") {
		// 			labels.push("Perubahan Jadwal Kerja")
		// 		} else if (data.nama == "stperjalanandinas") {
		// 			labels.push("Perjalanan Dinas")
		// 		} else if (data.nama == "stlembur") {
		// 			labels.push("Lembur")
		// 		} else if (data.nama == "stcuti") {
		// 			labels.push("Cuti")
		// 		} else if (data.nama == "stresign") {
		// 			labels.push("Resign")
		// 		} else if (data.nama == "stphk") {
		// 			labels.push("PHK")
		// 		} else if (data.nama == "stmutasi") {
		// 			labels.push("Mutasi")
		// 		} else if (data.nama == "staward") {
		// 			labels.push("Penghargaan")
		// 		} else if (data.nama == "stsanksi") {
		// 			labels.push("Pelanggaran")
		// 		}
		// 		pengajuan.push(data.pengajuan)
		// 		proses.push(data.proses)
		// 		setuju.push(data.setuju)
		// 		tdkSetuju.push(data.tdkSetuju)
		// 		batal.push(data.batal)
		// 	});
		// 	for (let i=0;i<pengajuan.length;i++){
		// 		this.pengajuanBaru = this.pengajuanBaru + pengajuan[i];
		// 	}
		// 	this.dataPengajuan = {
		// 		labels: labels,
		// 		datasets: [
		// 			{
		// 				label: 'Pengajuan',
		// 				backgroundColor: '#42A5F5',
		// 				borderColor: '#1E88E5',
		// 				data: pengajuan
		// 			},
		// 			{
		// 				label: 'Proses',
		// 				backgroundColor: '#06d6cb',
		// 				borderColor: '#06d6cb',
		// 				data: proses
		// 			},
		// 			{
		// 				label: 'Disetujui',
		// 				backgroundColor: '#06d60c',
		// 				borderColor: '#06d60c',
		// 				data: setuju
		// 			},
		// 			{
		// 				label: 'Tidak Disetejui',
		// 				backgroundColor: '#d60606',
		// 				borderColor: '#d60606',
		// 				data: tdkSetuju
		// 			},
		// 			{
		// 				label: 'Dibatalkan',
		// 				backgroundColor: '#d69706',
		// 				borderColor: '#d69706',
		// 				data: batal
		// 			}
		// 		]
		// 	};

		// 	this.dataLinePengajuan = {
		// 		labels: labels,
		// 		datasets: [
		// 			{
		// 				label: 'Pengajuan',
		// 				data: pengajuan,
		// 				fill: false,
		// 				borderColor: '#42A5F5'
		// 			},
		// 			{
		// 				label: 'Proses',
		// 				data: proses,
		// 				fill: false,
		// 				borderColor: '#06d6cb'
		// 			},
		// 			{
		// 				label: 'Disetujui',
		// 				data: setuju,
		// 				fill: false,
		// 				borderColor: '#06d60c'
		// 			},
		// 			{
		// 				label: 'Tidak Disetejui',
		// 				data: tdkSetuju,
		// 				fill: false,
		// 				borderColor: '#d60606'
		// 			},
		// 			{
		// 				label: 'Dibatalkan',
		// 				data: batal,
		// 				fill: false,
		// 				borderColor: '#d69706'
		// 			}
		// 		]
		// 	}
		// 	this.dataDonutPengajuan = {
		// 		labels: labels,
		// 		datasets: [
		// 		{
		// 			data: pengajuan,
		// 			backgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			]
		// 		},
		// 		{
		// 			data: proses,
		// 			backgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			]
		// 		},
		// 		{
		// 			data: setuju,
		// 			backgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			]
		// 		},
		// 		{
		// 			data: tdkSetuju,
		// 			backgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			]
		// 		},
		// 		{
		// 			data: batal,
		// 			backgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			],
		// 			hoverBackgroundColor: [
		// 				"#FF6384",
		// 				"#36A2EB",
		// 				"#FFCE56",
		// 				"#db238e",
		// 				"#8c22e2",
		// 				"#24c8e5",
		// 				"#c6a317",
		// 				"#c63f17",
		// 				"#aa002d",
		// 				"#13a900",
		// 				"#ffd038"
		// 			]
		// 		}]
		// 	}
		// 	this.ref.detectChanges();
		// });

		// this.httpService.get(Configuration.get().dataHr2Mod3 + '/rekapitulasiAbsensi/monitoringAbsensiPegawaiByStatus').subscribe(res => {
		// 	this.absensi = res.data.totalStatus;
		// 	let no = 1
		// 	let labels = []
		// 	this.absensi.forEach(function (data) {
		// 		data.no = no++
		// 	})
		// 	let dataGrafik = []
		// 	for (let i=0;i<this.absensi.length;i++) {
		// 		labels.push(this.absensi[i].namaStatus)
		// 		dataGrafik.push(this.absensi[i].totalStatus)
		// 	}
		// 	this.dataAbsensi = {
		// 		labels: labels,
		// 		datasets: [
		// 		{
		// 			data: dataGrafik,
		// 			backgroundColor: [
		// 			"#22b201",
		// 			"#00e0c9",
		// 			"#e05d00",
		// 			"#c6001d"
		// 			],
		// 			hoverBackgroundColor: [
		// 			"#22b201",
		// 			"#00e0c9",
		// 			"#e05d00",
		// 			"#c6001d"
		// 			]
		// 		}]    
		// 	};
		// 	this.ref.detectChanges();
		// });
	}
}	
