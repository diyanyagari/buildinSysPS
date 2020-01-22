import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-pengajuan',
	templateUrl: './pengajuan.component.html'
})

export class WidgetPengajuanComponent implements OnInit, OnDestroy {

	pengajuanBaru: any;
	pengajuan: any[];
	dataPengajuan: any;
	dataLinePengajuan: any;
	dataDonutPengajuan: any;
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.httpService.get(Configuration.get().dataHr1Mod2 + '/pegawaiStatusController/findSemuaStatus').subscribe(res => {
			let array = [];
			if(res.data.length != 0){

				array.push({
					'nama':res.data[0].nama,
					'pengajuan' : 0,
					'proses' : 0,
					'setuju' : 0,
					'tdkSetuju' : 0,
					'batal' : 0,
					'total' : 0
				});
	
				if (res.data[0].noRetur !== null){
					array[0].batal++;
				} else if (res.data[0].kdJenisKeputusan !== null){
					if (res.data[0].kdJenisKeputusan == 1){
						array[0].setuju++;    
					} else {
						array[0].tdkSetuju++;
					}
				} else if (res.data[0].noVerifikasi !== null){
					array[0].proses++;
				} else {
					array[0].pengajuan++;
				}
				array[0].total++;
	
				for (let i =1;i<res.data.length;i++){
					let j;
					for (j=0; j<array.length; j++){                
						if (array[j].nama === res.data[i].nama){
	
							if (res.data[i].noRetur !== null){
								array[j].batal++;
							} else if (res.data[i].kdJenisKeputusan !== null){
								if (res.data[i].kdJenisKeputusan == 1){
									array[j].setuju++;    
								} else {
									array[j].tdkSetuju++;
								}
							} else if (res.data[i].noVerifikasi !== null){
								array[j].proses++;
							} else {
								array[j].pengajuan++;
							}
	
							array[j].total++;
	
							break;
						}
					}
	
					if (j == array.length){                    
						array.push({
							'nama':res.data[i].nama,
							'pengajuan' : 0,
							'proses' : 0,
							'setuju' : 0,
							'tdkSetuju' : 0,
							'batal' : 0,
							'total' : 0
						});
	
						if (res.data[i].noRetur !== null){
							array[j].batal++;
						} else if (res.data[i].kdJenisKeputusan !== null){
							if (res.data[i].kdJenisKeputusan == 1){
								array[j].setuju++;    
							} else {
								array[j].tdkSetuju++;
							}
						} else if (res.data[i].noVerifikasi !== null){
							array[j].proses++;
						} else {
							array[j].pengajuan++;
						}
						array[j].total++;
					}
				}

			}


			// console.log(array);
			this.pengajuanBaru = 0
			this.pengajuan = array;
			let labels = []
			let pengajuan = []
			let proses = []
			let setuju = []
			let tdkSetuju = []
			let batal = []
			array.forEach(function (data) {
				if (data.nama == "stpinjaman") {
					labels.push("Pinjaman")
				} else if (data.nama == "stholdpinjaman") {
					labels.push("Perubahan Pinjaman")
				} else if (data.nama == "streimburse") {
					labels.push("Reimburs")
				} else if (data.nama == "stperubahanjadwalkerja") {
					labels.push("Perubahan Jadwal Kerja")
				} else if (data.nama == "stperjalanandinas") {
					labels.push("Perjalanan Dinas")
				} else if (data.nama == "stlembur") {
					labels.push("Lembur")
				} else if (data.nama == "stcuti") {
					labels.push("Cuti")
				} else if (data.nama == "stresign") {
					labels.push("Resign")
				} else if (data.nama == "stphk") {
					labels.push("PHK")
				} else if (data.nama == "stmutasi") {
					labels.push("Mutasi")
				} else if (data.nama == "staward") {
					labels.push("Penghargaan")
				} else if (data.nama == "stsanksi") {
					labels.push("Pelanggaran")
				}
				pengajuan.push(data.pengajuan)
				proses.push(data.proses)
				setuju.push(data.setuju)
				tdkSetuju.push(data.tdkSetuju)
				batal.push(data.batal)
			});
			for (let i=0;i<pengajuan.length;i++){
				this.pengajuanBaru = this.pengajuanBaru + pengajuan[i];
			}
			
			this.dataPengajuan = {
				labels: labels,
				datasets: [
				{
					label: 'Pengajuan',
					backgroundColor: '#42A5F5',
					borderColor: '#1E88E5',
					data: pengajuan
				},
				{
					label: 'Proses',
					backgroundColor: '#06d6cb',
					borderColor: '#06d6cb',
					data: proses
				},
				{
					label: 'Disetujui',
					backgroundColor: '#06d60c',
					borderColor: '#06d60c',
					data: setuju
				},
				{
					label: 'Tidak Disetejui',
					backgroundColor: '#d60606',
					borderColor: '#d60606',
					data: tdkSetuju
				},
				{
					label: 'Dibatalkan',
					backgroundColor: '#d69706',
					borderColor: '#d69706',
					data: batal
				}
				]
			};

			this.dataLinePengajuan = {
				labels: labels,
				datasets: [
				{
					label: 'Pengajuan',
					data: pengajuan,
					fill: false,
					borderColor: '#42A5F5'
				},
				{
					label: 'Proses',
					data: proses,
					fill: false,
					borderColor: '#06d6cb'
				},
				{
					label: 'Disetujui',
					data: setuju,
					fill: false,
					borderColor: '#06d60c'
				},
				{
					label: 'Tidak Disetejui',
					data: tdkSetuju,
					fill: false,
					borderColor: '#d60606'
				},
				{
					label: 'Dibatalkan',
					data: batal,
					fill: false,
					borderColor: '#d69706'
				}
				]
			}
			this.dataDonutPengajuan = {
				labels: labels,
				datasets: [
				{
					data: pengajuan,
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
					"#13a900",
					"#ffd038"
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
					"#13a900",
					"#ffd038"
					]
				},
				{
					data: proses,
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
					"#13a900",
					"#ffd038"
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
					"#13a900",
					"#ffd038"
					]
				},
				{
					data: setuju,
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
					"#13a900",
					"#ffd038"
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
					"#13a900",
					"#ffd038"
					]
				},
				{
					data: tdkSetuju,
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
					"#13a900",
					"#ffd038"
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
					"#13a900",
					"#ffd038"
					]
				},
				{
					data: batal,
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
					"#13a900",
					"#ffd038"
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
					"#13a900",
					"#ffd038"
					]
				}]
			}
			//this.ref.detectChanges();
		});
}

ngOnDestroy(){

}
}	