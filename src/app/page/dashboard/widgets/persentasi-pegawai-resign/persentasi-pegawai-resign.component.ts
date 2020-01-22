import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-persentasi-pegawai-resign',
	templateUrl: './persentasi-pegawai-resign.component.html'
})

export class WidgetPersentasiPegawaiResignComponent implements OnInit, OnDestroy {

	listTampilan: any[];
	tampilanPersentasiPegawaiResign: any;
	dataPegawaiResign: any[];
	constructor(private httpService: HttpClient,
		private ref: ChangeDetectorRef){

	}

	ngOnInit(){
		this.tampilanPersentasiPegawaiResign = 1;
		this.listTampilan = [
			{label:'Tabel', value:1},
			{label:'Bar', value:2},
			{label:'Line', value:3},
			{label:'Polar Area', value:4}
		];
		this.getDataPegawaiResign();
	}
	getDataPegawaiResign() {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findAllPegawaiResign').subscribe(table => {
			this.dataPegawaiResign = table.data.data;
        });
	}
	ngOnDestroy(){

	}
}	