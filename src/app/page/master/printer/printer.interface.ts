import {EventEmitter} from '@angular/core';

export interface Printer {
	namaProduk?: string;//
	kode?: any;
	id?: any;
	kdProfile?: string;
	version?: string;
	reportDisplay?: string;
	kodeExternal?: string;
	namaExternal?: string;
	statusEnabled?: boolean;
	noRec?: string;
	label?:string;
	value?:any;
}
