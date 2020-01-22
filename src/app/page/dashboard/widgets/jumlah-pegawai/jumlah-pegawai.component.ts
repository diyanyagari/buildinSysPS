import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-jumlah-pegawai',
	templateUrl: './jumlah-pegawai.component.html'
})

export class WidgetJumlahPegawaiComponent implements OnInit, OnDestroy {

	totalPegawai: number;

	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.totalPegawai = 0;
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findJumlahPegawai').subscribe(res => {
			this.totalPegawai = res.data.totalPegawai;
		},
		() => {
				this.totalPegawai = 0;
			});
	}

	ngOnDestroy(){

	}
}	