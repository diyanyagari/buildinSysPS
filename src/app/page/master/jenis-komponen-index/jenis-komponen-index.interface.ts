import {EventEmitter} from '@angular/core';

export interface JenisKomponenIndex {
	kode?:any;
	namaKomponen?:string;
	reportDisplay?:number;
	noUrut?:string;
	kdJenisKomponenHead?:string;
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
