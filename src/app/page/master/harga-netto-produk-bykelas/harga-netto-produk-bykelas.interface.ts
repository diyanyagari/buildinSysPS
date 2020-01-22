import {EventEmitter} from '@angular/core';

export interface HargaNettoProdukBykelas {
  	namaDetailJenisProduk?: string;//
	 kdJenisProduk?: string;//
     persenHargaCito?: number;//
	 kdAccount?: number;    
     isRegistrasiAset?: number;
     // kdDepartemen?: string;

	kdPaket?: any;
	id?: any;
	kdProfile?: string;
	version?: string;
	reportDisplay?: string;
	kodeExternal?: string;
	namaExternal?: string;
	statusEnabled?: boolean;
	noRec?: string;
}