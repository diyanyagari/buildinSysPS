import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-aset-ruangan',
	templateUrl: './aset-ruangan.component.html'
})

export class WidgetAsetRuanganComponent implements OnInit, OnDestroy {

	totalAset: any;
	aset: any[];
	dataAset: any;
	dataBarAset:any;
	dataLineAset:any;
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.totalAset = 0;
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiAset/findTotalAset').subscribe(res => {
			this.totalAset = 0;
			let total = 0
			res.data.totalAset.forEach(function (data) {
				total = total + data.totalAset
			})
			this.totalAset = total;
			this.aset = res.data.totalAset;
			let no = 1
			let label = [];
			let dataTotal = []
			this.aset.forEach(function (data) {
				data.no = no++
				if (data.namaKelompokAset == null){
					label.push("Lainnya")
				} else {
					label.push(data.namaKelompokAset)
				}

				dataTotal.push(data.totalAset)
			})
			this.dataAset = {
				labels: label,
				datasets: [
				{
					data: dataTotal,
					backgroundColor: [
					"#06d69e",
					"#06b6d6",
					"#06d659"
					],
					hoverBackgroundColor: [
					"#06d69e",
					"#06b6d6",
					"#06d659"
					]
				}] 
			}
			this.dataBarAset = {
				labels: label,
				datasets: [
				{
					label: 'Jumlah Aset',
					backgroundColor: '#009bf4',
					borderColor: '#009bf4',
					data: dataTotal
				}]
			};
			this.dataLineAset = {
				labels: label,
				datasets: [
				{
					label: 'Jumlah Aset',
					data: dataTotal,
					fill: false,
					borderColor: '#009bf4'
				}]
			}
			//this.ref.detectChanges();
		},
		() => {
				this.totalAset = 0;
			});
	}

	ngOnDestroy(){

	}
}	