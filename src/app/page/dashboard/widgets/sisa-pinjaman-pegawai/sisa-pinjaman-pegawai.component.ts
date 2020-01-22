import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
//import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-sisa-pinjaman-pegawai',
	templateUrl: './sisa-pinjaman-pegawai.component.html'
})

export class WidgetSisaPinjamanPegawaiComponent implements OnInit, OnDestroy {

	SisaPinjamanPegawai: any;
	tampilanPersentasiSisaPinjamanPegawai: any;
	listTampilan: any[];
	constructor(private httpService: HttpClient,
		private ref: ChangeDetectorRef){

	}

	ngOnInit(){
		this.listTampilan = [
		{label:'Tabel', value:1},
		{label:'Bar', value:2},
		{label:'Line', value:3},
		{label:'Polar Area', value:4}
		];
		
	}
	getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	getDataSisaPinjamanPegawai(tipeChart) {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findAllPegawaiPensiun').subscribe(table => {
			// this.dataJumlahPegawai = table.data.jumlahPegawaiFilter;
			if(table.data.jumlahPegawaiFilter[table.data.jumlahPegawaiFilter.length-1]) {
				let temp_label = [];
				let temp_data = [];
				let temp_color = []
				for(let counter = 0; counter < table.data.jumlahPegawaiFilter.length; counter++) {
					temp_label.push(table.data.jumlahPegawaiFilter[counter].nama == null || table.data.jumlahPegawaiFilter[counter].nama == '' ? 'Tidak Diketahui' : table.data.jumlahPegawaiFilter[counter].nama);
					temp_data.push(table.data.jumlahPegawaiFilter[counter].jumlah);
					temp_color.push(this.getRandomColor());
				}

				temp_color = Configuration.warnaChart;

				if(tipeChart == 2) {
					this.SisaPinjamanPegawai = {
						labels: temp_label,
						datasets: [
						{
							label: 'Jumlah Pegawai',
							backgroundColor: temp_color,
							borderColor: temp_color,
							data: temp_data
						}
						]    
					};
				} else {
					if(tipeChart == 3) {
						this.SisaPinjamanPegawai = {
							labels: temp_label,
							datasets: [
							{
								label: 'Jumlah Pegawai',
								data: temp_data,
								fill: false,
								borderColor: temp_color
							}
							]    
						};
					} else {
						if(tipeChart == 4) {
							this.SisaPinjamanPegawai = {
								labels: temp_label,
								datasets: [
								{
									data: temp_data,
									backgroundColor: temp_color,
									hoverBackgroundColor: temp_color
								}
								]    
							};
						} else {
							this.SisaPinjamanPegawai = [];
							this.SisaPinjamanPegawai = table.data;
						}
						
					}
				}
			}
			//this.ref.detectChanges();
		});
	}

ngOnDestroy(){

}
}	