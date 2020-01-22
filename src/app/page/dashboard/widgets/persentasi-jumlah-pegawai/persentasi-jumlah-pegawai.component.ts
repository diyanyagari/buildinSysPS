import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard, DashboardService} from '../../../../global';
import { Observable } from 'rxjs/Rx';
import { SelectItem, TreeModule, TreeNode, Paginator, ConfirmationService} from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-widget-persentasi-jumlah-pegawai',
	templateUrl: './persentasi-jumlah-pegawai.component.html'
})

export class WidgetPersentasiJumlahPegawaiComponent implements OnInit, OnDestroy {
	
	dataKolega: any[];
	filter_jumlah_pegawai: any[];
	filter_tipe_chart_jumlah_pegawai: any[]
	dataJumlahPegawai:any;
	filterJumlahPegawai:any;
	filterTipeChartJumlahPegawai: any;
	constructor(private httpService: HttpClient,
		private ref: ChangeDetectorRef){

	}

	ngOnInit(){
		this.filterJumlahPegawai = 1; // default tampilan filter by jabatan
		this.filterTipeChartJumlahPegawai = 'pie'; // default tampilan filter chart by jabatan
		this.getDataJumlahPegawai(this.filterJumlahPegawai, this.filterTipeChartJumlahPegawai);
		this.getFilterJumlahPegawai();
		this.getFilterTipeChartJumlahPegawai();
	}
	getFilterJumlahPegawai() {
		this.filter_jumlah_pegawai = [
			{label:'Berdasarkan Jabatan', value:1},
			{label:'Berdasarkan Jenis Kelamin', value:2},
			{label:'Berdasarkan Pendidikan', value:3},
			{label:'Berdasarkan Umur', value:4}
		];
	}

	getFilterTipeChartJumlahPegawai() {
		this.filter_tipe_chart_jumlah_pegawai = [
			{label: 'Pie', value: 'pie'},
			{label: 'Polar Area', value: 'polarArea'},
			{label: 'Line', value: 'line'},
			{label: 'Bar', value: 'bar'}
		]
	}
	getDataJumlahPegawai(filter, filterTipeChartJumlahPegawai) {
		let url;
		if(filter == 1) {
			url = '/registrasiPegawai/findJumlahPegawaiFilterJabatan';
		}
		if(filter == 2) {
			url = '/registrasiPegawai/findJumlahPegawaiFilterJenisKelamin';
		}
		if(filter == 3) {
			url = '/registrasiPegawai/findJumlahPegawaiFilterPendidikan';
		}
		if(filter == 3) {
			url = '/registrasiPegawai/findJumlahPegawaiFilterPendidikan';
		}
		if(filter == 4) {
			url = '/registrasiPegawai/findJumlahPegawaiFilterUmur';
		}
		
		this.httpService.get(Configuration.get().dataHr1Mod1 + url).subscribe(table => {
			// this.dataJumlahPegawai = table.data.jumlahPegawaiFilter;
			if(table.data.jumlahPegawaiFilter[table.data.jumlahPegawaiFilter.length-1]) {
				let temp_label = [];
				let temp_data = [];

				let temp_color = Configuration.warnaChart;

				for(let counter = 0; counter < table.data.jumlahPegawaiFilter.length; counter++) {
					if(filter == 4) {
						let fixUmur = new Date().getFullYear() - table.data.jumlahPegawaiFilter[counter].nama;
						temp_label.push(fixUmur + ' Tahun');
						temp_data.push(table.data.jumlahPegawaiFilter[counter].jumlah);
						temp_color.push(this.getRandomColor());
					} else {
						temp_label.push(table.data.jumlahPegawaiFilter[counter].nama == null || table.data.jumlahPegawaiFilter[counter].nama == '' ? 'Tidak Diketahui' : table.data.jumlahPegawaiFilter[counter].nama);
						temp_data.push(table.data.jumlahPegawaiFilter[counter].jumlah);
						temp_color.push(this.getRandomColor());
					}
				}

				temp_color = Configuration.warnaChart;

				if(filterTipeChartJumlahPegawai == 'bar') {
					this.dataJumlahPegawai = {
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
					if(filterTipeChartJumlahPegawai == 'line') {
						this.dataJumlahPegawai = {
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
						this.dataJumlahPegawai = {
							labels: temp_label,
							datasets: [
								{
									data: temp_data,
									backgroundColor: temp_color,
									hoverBackgroundColor: temp_color
								}
							]    
						};
					}
				}
			}
			//this.ref.detectChanges();
		});
		
	}
	getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	ngOnDestroy(){

	}
}	