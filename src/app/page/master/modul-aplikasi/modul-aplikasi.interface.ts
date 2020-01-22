import {EventEmitter} from '@angular/core';

export interface ModulAplikasi {
	kode?: any;
	id?: any;
	kdProfile?: string;
	namaModulAplikasi?: string;
	version?: string;
	reportDisplay?: string;
	kodeExternal?: string;
	namaExternal?: string;
	statusEnabled?: boolean;
	noRec?: string;
}