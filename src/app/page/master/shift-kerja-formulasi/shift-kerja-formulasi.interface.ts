import { EventEmitter } from '@angular/core';

export interface ShiftKerjaFormulasi {
	qtyHariKerjaPerBulan?: number;
	qtyHariLiburPerBulan?: number;
	qtyHariKerjaToNewShift?: number;
	qtyHariKerjaToLibur?: number;
	qtyPegawaiPerShift?: number;
	kdShiftNextNotAllowed?: number;
	qtyHariLiburPerSiklus?: number;
	kdShiftStart?: number;
	kdDepartemen?: string;

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