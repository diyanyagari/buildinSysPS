import {EventEmitter} from '@angular/core';

export interface MapKelompok {
	kode?:number;
	keteranganAlasan?:string;
	reportDisplay?:number;
	noUrut?:string;
	kdKeteranganAlasanHead?:string;
	// kdDepartemen?:string;
	kodeExternal?:string;
	namaExternal?:string;
	statusEnabled?:string;
	id?:any;
	label?: any;
	value?: any;
}

export interface SelectedItem {
	label?:string;
	value?:any;
}
