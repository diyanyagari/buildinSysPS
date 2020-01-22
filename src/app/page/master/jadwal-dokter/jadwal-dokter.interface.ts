import {EventEmitter} from '@angular/core';

export interface MapObjekModulToKelompokUser {
	cetak?:number;
	hapus?:number;
	kdKelompokUser?:number;
	kodeExternal?:string;
	mapObjekModulToKelompokUserDetailDto?:any;
	kdObjekModulAplikasi?:string;
	namaExternal?:string;
	reportDisplay?:string;
	simpan?:number;
	statusEnabled?:boolean;
	ubah?:number;
	version?:number;
	label?:string;
}

export interface SelectedItem {
	label?:string;
	value?:any;
	data?:any;
}
