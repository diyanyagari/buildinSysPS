import {EventEmitter} from '@angular/core';

export interface KeteranganAlasan {
	kode?:any;
	keteranganAlasan?:string;
	reportDisplay?:number;
	noUrut?:string;
	kdKeteranganAlasanHead?:string;
	// kdDepartemen?:string;
	kodeExternal?:string;
	namaExternal?:string;
	statusEnabled?:string;
	id?:any;
	namaKeteranganAlasan?:string;
}

export interface SelectedItem {
	label?:string;
	value?:any;
}
