import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';

@Component({
	selector: 'app-widget-pegawai-ulang-tahun',
	templateUrl: './pegawai-ulang-tahun.component.html'
})

export class WidgetPegawaiUlangTahunComponent implements OnInit, OnDestroy {

	dataUlangTahunBulanIni: any[];
	totalRecordsUlangTahun: any;
	filterUlangTahun: string = '';
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.getPegawaiUlangTahun(this.filterUlangTahun, Configuration.get().page, Configuration.get().rows);
	}

	paginateUlangTahun(event) {
		console.log(event);
		this.getPegawaiUlangTahun(this.filterUlangTahun, event.page+1, event.rows);
        //event.first = Index of the first record
        //event.rows = Number of rows to display in new page
        //event.page = Index of the new page
        //event.pageCount = Total number of pages
	}

	getPegawaiUlangTahun(name, page, row) {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawaiBerulangtahun?page='+ page +'&rows='+ row +'&dir=namaLengkap&sort=asc&namaLengkap=' + name).subscribe(table => {
			this.dataUlangTahunBulanIni = table.data.pegawai;
			this.totalRecordsUlangTahun = table.data.totalRow;
			if(table.data.pegawai[table.data.pegawai.length-1]) {
				for(let counter = 0; counter < table.data.pegawai.length; counter++) {
					this.dataUlangTahunBulanIni[counter].photoDiri = table.data.pegawai[counter].photoDiri == null || table.data.pegawai[counter].photoDiri == "" ? '../../../assets/layout/images/profile-image.png' : Configuration.get().resourceFile + "/image/show/" + table.data.pegawai[counter].photoDiri;
				}
			}
			if(table.data.pegawai.length == 0) {
				if(document.getElementById('paginationUlangTahun') != null) {
					document.getElementById('paginationUlangTahun').style.visibility = 'hidden';
				}
			} else {
				if(document.getElementById('paginationUlangTahun') != null) {
					document.getElementById('paginationUlangTahun').style.visibility = 'visible';
				}
			}
			//this.ref.detectChanges();
        });
	}

	ngOnDestroy(){

	}
}	