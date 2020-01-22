import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
//import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-persentasi-aset',
	templateUrl: './persentasi-aset.component.html'
})

export class WidgetPersentasiAsetComponent implements OnInit, OnDestroy {

	tampilanPersentasiPengajuan:any;
	listTampilan: any[];
	dataAset: any;
	aset: any[];
	totalAset: any;
	dataBarAset: any;
	dataLineAset:any;
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
		this.tampilanPersentasiPengajuan = 1;
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
		error => {
			this.totalAset = 0;
		});
	}
	

ngOnDestroy(){

}
}	