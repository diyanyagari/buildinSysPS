import {EventEmitter} from '@angular/core';

export interface ObjekModulAplikasi {
	alamatURLFormObjekModulAplikasi?:string;
	fungsi?:string;
	kdObjekModulAplikasiHead?:string;
	keterangan?:string;
	kode?:string;
	kodeExternal?:string;
	namaExternal?:string;
	namaObjekModulAplikasi?:string;
	objekModulAplikasiNoUrut?:number;
	reportDisplay?:string;
	statusEnabled?:boolean;
	version?:number;
	id?:any;
}

export interface SelectedItem {
	label?:string;
	value?:any;
}
