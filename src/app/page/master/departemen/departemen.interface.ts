import {EventEmitter} from '@angular/core';

export interface Departemen {
	kdAsalHead?:number;
	kdDepartemen?:string;
	kodeDepartemen?:number;
	kodeExternal?:string;
	namaAsal?:string;
	namaExternal?:string;
	reportDisplay?:string;
	statusEnabled?:boolean;
	id?:any;
	departemen?:any;
	kode?: any;
	label?:string;
	value?:any;
	id_kode?: any;
	namaDepartemenHead?: any;
	namaDepartemen?: any;
	namaLengkap?: any;
	namaJenisAlamat?: any;
	alamatLengkap?:any;
	rTRW?: any;
	namaNegara?: any;
	namaPropinsi?: any;
	kotaKabupaten?: any;
	kecamatan?: any;
	desaKelurahan?: any;
	kodePos?: any;
}

export interface SelectedItem {
	label?:string;
	value?:any;
}
