import {EventEmitter} from '@angular/core';

export interface Ruangan {
    kode?:string;
	namaRuangan?:string;
	noRuangan?:string;
	lokasiRuangan?:string;
	departemen?:string;
	kelas?:string;
	modulAplikasi?:string;
	fixedPhone?:string;
	mobilePhone?:string;
	faxsimile?:string;
	pegawaiKepala?:string;
	reportDisplay?:string;
	kodeExternal?:string;
	namaExternal?:string;
}