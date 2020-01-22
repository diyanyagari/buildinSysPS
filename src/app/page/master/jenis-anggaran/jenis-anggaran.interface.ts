import {EventEmitter} from '@angular/core';

export interface JenisAnggaran {
	namaJenisAnggaran?: string;
	reportDisplay?: string;
	kodeExternal?: string;
	namaExternal?: string;
	keterangan?: string;
	statusEnabled?: boolean;
	id?: any;
	version?: any;
	kode?: number;
}