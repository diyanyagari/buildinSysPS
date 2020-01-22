import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';
import { Paginator} from 'primeng/primeng';

@Component({
	selector: 'app-widget-pegawai-habis-kontrak',
	templateUrl: './pegawai-habis-kontrak.component.html'
})

export class WidgetPegawaiHabisKontrakComponent implements OnInit, OnDestroy {

	dataHabisKontrak: any[] = [];
	totalRecordsHabisKontrak: any;
	filterHabisKontrak: string = '';
	paginatorHabisKontrak: Paginator;
	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.getDataHabisKontrak(this.filterHabisKontrak, Configuration.get().page, Configuration.get().rows);
	}
	searchDataHabisKontrak(search, $event) {
		this.getDataHabisKontrak(search, Configuration.get().page, Configuration.get().rows);
		this.paginatorHabisKontrak.changePageToFirst($event);
	}
	paginateHabisKontrak(event) {
		console.log(event);
		this.getDataHabisKontrak(this.filterHabisKontrak, event.page+1, event.rows);
	}
	getDataHabisKontrak(name, page, row) {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/dashboardPegawaiHabisKontrak?page='+ page +'&rows='+ row +'&namaLengkap=' + name).subscribe(table => {
			this.dataHabisKontrak = table.data.pegawai;
			this.totalRecordsHabisKontrak = table.data.totalRow;
			if(table.data.pegawai[table.data.pegawai.length-1]) {
				for(let counter = 0; counter < table.data.pegawai.length; counter++) {
					this.dataHabisKontrak[counter].photoDiri = table.data.pegawai[counter].photoDiri === null || table.data.pegawai[counter].photoDiri == "" ? '../../../assets/layout/images/profile-image.png' : Configuration.get().resourceFile + "/image/show/" + table.data.pegawai[counter].photoDiri;
					this.dataHabisKontrak[counter].namaJabatan = table.data.pegawai[counter].namaJabatan === null || table.data.pegawai[counter].namaJabatan == "" ? '-' : this.dataHabisKontrak[counter].namaJabatan;
					this.dataHabisKontrak[counter].namaDepartemen = table.data.pegawai[counter].namaDepartemen === null || table.data.pegawai[counter].namaDepartemen == "" ? '-' : this.dataHabisKontrak[counter].namaDepartemen;
					this.dataHabisKontrak[counter].tglAkhir = table.data.pegawai[counter].tglAkhir === null ? '-' : this.dataHabisKontrak[counter].tglAkhir;
					let jmlHari = this.dataHabisKontrak[counter].jmlHari;

					if (jmlHari === null){
						this.dataHabisKontrak[counter].jmlHari = '-';
					} else if (jmlHari == 0){
						this.dataHabisKontrak[counter].jmlHari =  'Hari ini';
					} else  if (jmlHari < 0) {
						this.dataHabisKontrak[counter].jmlHari =  'Lewat ' + Math.abs(jmlHari) + ' hari';
					} else {	
						this.dataHabisKontrak[counter].jmlHari = jmlHari + ' hari lagi';
					} 
				}
			}
			if(table.data.pegawai.length == 0) {
				if(document.getElementById('paginationHabisKontrak') != null) {
					document.getElementById('paginationHabisKontrak').style.visibility = 'hidden';
				}
			} else {
				if(document.getElementById('paginationHabisKontrak') != null) {
					document.getElementById('paginationHabisKontrak').style.visibility = 'visible';
				}
			}
			//this.dataHabisKontrak = [];
			//this.ref.detectChanges();
        });
	}
	ngOnDestroy(){

	}
}	