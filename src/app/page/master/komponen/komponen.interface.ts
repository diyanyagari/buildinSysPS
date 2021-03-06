import {EventEmitter} from '@angular/core';

export interface Komponen {
	kode?:any;
	namaKomponen?:string;
	reportDisplay?:number;
	noUrut?:string;
	kdJenisKomponen?:string;
	nilaiMin?:string;
	nilaiNormal?:string;
	nilaiMax?:boolean;
	kdProduk?:number;
	kdKelompokEvaluasi?:string;
	kdJabatan?:number;
	// kdDepartemen?:string;
	kodeExternal?:string;
	namaExternal?:string;
	statusEnabled?:string;
	id?:any;
	label?:string;
	value?:any;
}

export interface SelectedItem {
	label?:string;
	value?:any;
}



