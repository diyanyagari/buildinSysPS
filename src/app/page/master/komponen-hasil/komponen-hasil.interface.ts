import {EventEmitter} from '@angular/core';

export interface KomponenHasil {
	kode?:number;
	namaKomponenHasil?:string;
	reportDisplay?:number;
	noUrut?:string;
	kdKomponen?:string;
	// kdDepartemen?:string;
	kodeExternal?:string;
	namaExternal?:string;
	statusEnabled?:string;
	id?:any;
}

export interface SelectedItem {
	label?:string;
	value?:any;
}
