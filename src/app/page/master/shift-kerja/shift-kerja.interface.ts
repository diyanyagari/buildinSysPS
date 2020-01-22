import {EventEmitter} from '@angular/core';

export interface ShiftKerja {
namaShift?: string;//
jamMasuk?: string;//
jamPulang?: string;//
qtyJamKerjaEfektif?: number;
jamBreakAwal?: string;                    
jamBreakAkhir?: string;
qtyJamBreakEfektif?: number;
factorRate?: number;//
operatorFactorRate?: string;//
kdKomponenIndex?: string;

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