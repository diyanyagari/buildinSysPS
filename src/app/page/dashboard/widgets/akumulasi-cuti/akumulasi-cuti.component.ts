import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-akumulasi-cuti',
	templateUrl: './akumulasi-cuti.component.html'
})

export class WidgetAkumulasiCutiComponent implements OnInit, OnDestroy {

	dataCuti: any[];

	constructor(private httpService: HttpClient){}

	ngOnInit(){
			
		// this.httpService.get(Configuration.get().dataHr2Mod3 + '/pengajuan-cuti/dashboard-jumlah-cuti').subscribe(table => {
		// 	this.dataCuti = table.data;
		// });
	}

	ngOnDestroy(){

	}
}	