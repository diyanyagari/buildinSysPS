import {EventEmitter} from '@angular/core';

export interface KondisiProduk {
	namaKondisiProduk?: string;
	// kdDepartemen?: string;

	kode?: any;
	id?: any;
	kdProfile?: string;
	version?: string;
	reportDisplay?: string;
	kodeExternal?: string;
	namaExternal?: string;
	statusEnabled?: boolean;
	noRec?: string;
}