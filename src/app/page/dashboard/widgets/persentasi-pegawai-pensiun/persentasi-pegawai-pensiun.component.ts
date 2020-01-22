import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-persentasi-pegawai-pensiun',
	templateUrl: './persentasi-pegawai-pensiun.component.html'
})

export class WidgetPersentasiPegawaiPensiunComponent implements OnInit, OnDestroy {

	listTampilan: any[];
	tampilanPersentasiPegawaiPensiun: any;
	dataPegawaiPensiun: any[];
	constructor(private httpService: HttpClient,
		private ref: ChangeDetectorRef){

	}

	ngOnInit(){
		this.tampilanPersentasiPegawaiPensiun = 1;
		this.listTampilan = [
			{label:'Tabel', value:1},
			{label:'Bar', value:2},
			{label:'Line', value:3},
			{label:'Polar Area', value:4}
		];
		this.getDataPegawaiPensiun();
	}
	getDataPegawaiPensiun() {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findAllPegawaiPensiun').subscribe(table => {
			this.dataPegawaiPensiun = table.data.data;
        });
	}
	ngOnDestroy(){

	}
}	