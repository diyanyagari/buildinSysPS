import {EventEmitter} from '@angular/core';

export interface MessagingObjek {
	kdMessaging?: string;
	namaMessaging?: string;
	kdModulAplikasiTujuan?: string;
	namaModulAplikasiTujuan?: string;
	kdObjekModulAplikasiTujuan?: string;
	namaObjekModulAplikasiTujuan?: string;
	kdRuanganTujuan?: string;
	namaRuanganTujuan?: string;
	statusEnabled?: boolean;
	noRec?:string;
	id?:any;
  	kode?:any;
  	version?:any;
  	label?: any;
  	value?: any;
  	kodeExternal?: string;
    namaExternal?: string;
    reportDisplay?: string;
 }
