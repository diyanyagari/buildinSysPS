import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-persentasi-struktur-kolega',
	templateUrl: './persentasi-struktur-kolega.component.html'
})

export class WidgetPersentasiStrukturKolegaComponent implements OnInit, OnDestroy {
	
	dataKolega: any[];
	constructor(private httpService: HttpClient,
		private ref: ChangeDetectorRef){

	}

	ngOnInit(){
		this.getDataKolega();
	}
	getDataKolega() {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawaiCollege').subscribe(table => {
			this.dataKolega = table.data.data;
			if(table.data.data[table.data.data.length-1]) {
				this.dataKolega = [];
				this.dataKolega[0] = {
					"label": "My Colleague",
					"expandedIcon": "fa-sitemap",
					"collapsedIcon": "fa-sitemap",
					"expanded": true,
					"children": []
				};
				for(let counter = 0; counter < table.data.data.length; counter++) {
					let temp = {
						"label": table.data.data[counter].namaPegawai,
						"collapsedIcon": "fa-sitemap"
					};
					this.dataKolega[0].children.push(temp);
				}
			}
        });
	}
	ngOnDestroy(){

	}
}	