import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../../global/service/HttpClient';
import { Configuration} from '../../../../global';
import { Paginator } from 'primeng/primeng';

@Component({
	selector: 'app-kontak-pegawai',
	templateUrl: './kontak-pegawai.component.html'
})

export class WidgetKontakPegawaiComponent implements OnInit, OnDestroy {

	paginatorKontak: Paginator;

	// data kontak pegawai
	dataKontakPegawai: any[];
	filterKontakPegawai: string = '';
	totalRecordsKontak: any;

	constructor(private httpService: HttpClient){

	}

	ngOnInit(){
		this.dataKontakPegawai = [];
		this.getDataKontakPegawai(this.filterKontakPegawai, Configuration.get().page, Configuration.get().rows);
	}

	paginateKontak(event) {
		console.log(event);
		this.getDataKontakPegawai(this.filterKontakPegawai, event.page+1, event.rows);
	}


	searchDataKontak(search, $event) {
		this.getDataKontakPegawai(search, Configuration.get().page, Configuration.get().rows);
		this.paginatorKontak.changePageToFirst($event);
	}


	getDataKontakPegawai(name, page, row) {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findPegawaiContact?page='+ page +'&rows='+ row +'&dir=namaLengkap&sort=asc&namaLengkap=' + name).subscribe(table => {
			this.dataKontakPegawai = table.data.pegawai;
			this.totalRecordsKontak = table.data.totalRow;
			if(table.data.pegawai[table.data.pegawai.length-1]) {
				for(let counter = 0; counter < table.data.pegawai.length; counter++) {
					this.dataKontakPegawai[counter].photoDiri = table.data.pegawai[counter].photoDiri == null || table.data.pegawai[counter].photoDiri == "" ? '../../../assets/layout/images/profile-image.png' : Configuration.get().resourceFile + "/image/show/" + table.data.pegawai[counter].photoDiri;
					this.dataKontakPegawai[counter].mobilePhone1 = table.data.pegawai[counter].mobilePhone1 == null || table.data.pegawai[counter].mobilePhone1 == "" ? '-' : this.dataKontakPegawai[counter].mobilePhone1;
					this.dataKontakPegawai[counter].alamatEmail = table.data.pegawai[counter].alamatEmail == null || table.data.pegawai[counter].alamatEmail == "" ? '-' : this.dataKontakPegawai[counter].alamatEmail;
					this.dataKontakPegawai[counter].jabatan = table.data.pegawai[counter].jabatan == null || table.data.pegawai[counter].jabatan == "" ? '-' : this.dataKontakPegawai[counter].jabatan;
					this.dataKontakPegawai[counter].departemen = table.data.pegawai[counter].departemen == null || table.data.pegawai[counter].departemen == "" ? '-' : this.dataKontakPegawai[counter].departemen;
				}
			}
			if(table.data.pegawai.length == 0) {
				if(document.getElementById('paginationKontak') != null) {
					document.getElementById('paginationKontak').style.visibility = 'hidden';
				}
			} else {
				if(document.getElementById('paginationKontak') != null) {
					document.getElementById('paginationKontak').style.visibility = 'visible';
				}
			}
			//this.ref.detectChanges();
        });
	}


	ngOnDestroy(){

	}
}	


