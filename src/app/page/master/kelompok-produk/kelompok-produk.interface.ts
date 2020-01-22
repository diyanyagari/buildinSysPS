import {EventEmitter} from '@angular/core';

export interface KelompokProduk {
	namaKelompokProduk?: string;
	kdJenisTransaksi?: number;
	// kdDepartemen?: string;
	isHavingStok?: number;
	isHavingPrice?: number;

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