import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-pegawai-usia-pensiun',
	templateUrl: './pegawai-usia-pensiun.component.html'
})

export class WidgetPegawaiUsiaPensiunComponent implements OnInit, OnDestroy {

	dataPegawaiUsiaPensiunHeader1: any;
	dataPegawaiUsiaPensiunHeader2: any;
	dataPegawaiUsiaPensiun1: any;
	dataPegawaiUsiaPensiun2: any;
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.getDataPegawaiUsiaPensiun(Configuration.get().page, Configuration.get().rows);
	}
	getDataPegawaiUsiaPensiun(page, row) {

		this.dataPegawaiUsiaPensiun1 = [];
		this.dataPegawaiUsiaPensiun2 = [];
		this.httpService.get(Configuration.get().dataHr2Mod3 + '/pensiun/dashboardPensiun?page='+ page +'&rows='+ row).subscribe(table => {
			this.dataPegawaiUsiaPensiunHeader1 = table.data['tahun.1'];
			this.dataPegawaiUsiaPensiun1 = table.data['listPegawai.1'];
			this.dataPegawaiUsiaPensiunHeader2 = table.data['tahun.2'];
			this.dataPegawaiUsiaPensiun2 = table.data['listPegawai.2'];

			for(let counter = 0; counter < this.dataPegawaiUsiaPensiun1.length; counter++) {
				this.dataPegawaiUsiaPensiun1[counter].photoDiri = this.dataPegawaiUsiaPensiun1[counter].photoDiri == null || this.dataPegawaiUsiaPensiun1[counter].photoDiri == "" ? '../../../assets/layout/images/profile-image.png' : Configuration.get().resourceFile + "/image/show/" + this.dataPegawaiUsiaPensiun1[counter].photoDiri;
			}

			for(let counter = 0; counter < this.dataPegawaiUsiaPensiun2.length; counter++) {
				this.dataPegawaiUsiaPensiun2[counter].photoDiri = this.dataPegawaiUsiaPensiun2[counter].photoDiri == null || this.dataPegawaiUsiaPensiun2[counter].photoDiri == "" ? '../../../assets/layout/images/profile-image.png' : Configuration.get().resourceFile + "/image/show/" + this.dataPegawaiUsiaPensiun2[counter].photoDiri;
			}
			//this.ref.detectChanges();
        });
	}

ngOnDestroy(){

}
}	