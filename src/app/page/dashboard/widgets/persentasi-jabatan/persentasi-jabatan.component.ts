import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
//import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-persentasi-jabatan',
	templateUrl: './persentasi-jabatan.component.html'
})

export class WidgetPersentasiJabatanComponent implements OnInit, OnDestroy {

	dataLineJabatan: any;
	dataDonutJabatan: any;
	dataJabatan: any;
	jabatan: any[];
	tampilanPersentasiJabatan: any;
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
		this.tampilanPersentasiJabatan = 1;
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findJumlahJabatan').subscribe(res => {
			this.jabatan = res.data.jabatanTotal;
			let no = 1
			let labels = []
			this.jabatan.forEach(function (data) {
				data.no = no++
			})
			let dataGrafik = []
			for (let i=0;i<this.jabatan.length;i++) {
				labels.push(this.jabatan[i].namaJabatan)
				dataGrafik.push(this.jabatan[i].totalPegawai)
			}
			this.dataLineJabatan = {
				labels: labels,
				datasets: [
				{
					label: 'Jumlah Pegawai',
					data: dataGrafik,
					fill: false,
					borderColor: '#009bf4'
				}]
			}
			this.dataDonutJabatan = {
				labels: labels,
				datasets: [
				{
					label: 'Jumlah Pegawai',
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#db238e",
						"#8c22e2",
						"#24c8e5",
						"#c6a317",
						"#c63f17",
						"#aa002d",
						"#13a900"
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#db238e",
						"#8c22e2",
						"#24c8e5",
						"#c6a317",
						"#c63f17",
						"#aa002d",
						"#13a900"
					],
					data: dataGrafik
				}]
			}
			this.dataJabatan = {
				labels: labels,
				datasets: [
				{
					label: 'Jumlah Pegawai',
					backgroundColor: '#009bf4',
					borderColor: '#009bf4',
					data: dataGrafik
				}]
			};
			//this.ref.detectChanges();
		});
}

ngOnDestroy(){

}
}	