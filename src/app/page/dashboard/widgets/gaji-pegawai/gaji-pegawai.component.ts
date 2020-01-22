import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-gaji-pegawai',
	templateUrl: './gaji-pegawai.component.html'
})

export class WidgetGajiPegawaiComponent implements OnInit, OnDestroy {

	totalgaji: any;
	totalGajiRuangan: any;
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.totalgaji = 0;
		this.httpService.get(Configuration.get().dataHr2Mod3 + '/perhitungan-gaji/findTotalGaji').subscribe(res => {
			this.totalgaji = res.data.total == null ? 0 : res.data.total;
			this.totalGajiRuangan = res.data.ruangan;
		},
		() => {
				this.totalgaji = 0;
			});
	}

	ngOnDestroy(){

	}
}	