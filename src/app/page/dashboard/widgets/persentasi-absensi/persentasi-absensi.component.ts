import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-persentasi-absensi',
	templateUrl: './persentasi-absensi.component.html'
})

export class WidgetPersentasiAbsensiComponent implements OnInit, OnDestroy {

	dataAbsensi: any;
	absensi: any[];
	tampilanPersentasiAbsensi: any;
	listTampilan: any[];
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.listTampilan = [
			{label:'Tabel', value:1},
			{label:'Bar', value:2},
			{label:'Line', value:3},
			{label:'Polar Area', value:4}
		];
		this.tampilanPersentasiAbsensi = 1;
		this.httpService.get(Configuration.get().dataHr2Mod3 + '/rekapitulasiAbsensi/monitoringAbsensiPegawaiByStatus').subscribe(res => {
			this.absensi = res.data.totalStatus;
			let no = 1
			let labels = []
			this.absensi.forEach(function (data) {
				data.no = no++
			})
			let dataGrafik = []
			for (let i=0;i<this.absensi.length;i++) {
				labels.push(this.absensi[i].namaStatus)
				dataGrafik.push(this.absensi[i].totalStatus)
			}
			this.dataAbsensi = {
				labels: labels,
				datasets: [
				{
					data: dataGrafik,
					backgroundColor: [
					"#22b201",
					"#00e0c9",
					"#e05d00",
					"#c6001d"
					],
					hoverBackgroundColor: [
					"#22b201",
					"#00e0c9",
					"#e05d00",
					"#c6001d"
					]
				}]    
			};
			//this.ref.detectChanges();
		});
}

ngOnDestroy(){

}
}	