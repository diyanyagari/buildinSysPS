import {EventEmitter} from '@angular/core';

export interface KelompokKlien {
	kdProfile?: number;
	kdKelompokKlien?: number;
	namaKelompokKlien?: string;
	reportDisplay?: string;
	kdKelompokKlienHead?: number;
	kdJenisTarif?: number;
	isIsiSJP?: number;
	kodeExternal?: string;
	namaExternal?: string;
	kdDepartemen?: string;
	statusEnabled?:boolean;
	noRec?: string;
	kode?:any;
	gambarLogo?:any;
}