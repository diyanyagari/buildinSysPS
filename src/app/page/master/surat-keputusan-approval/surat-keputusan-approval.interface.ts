import {EventEmitter} from '@angular/core';

export interface SuratKeputusanApproval {
	noSK?: any;
	kdKelompokTransaksi?: number;
	kdJabatan?: string;
	// kdDepartemen?: string;

	noUrutApproval?: number;
	isCanByPass?: number;
	kdDepartemenDelegasi?: string;
	kdJabataDelegasi?: string;
	isDelegatorActivated?: number;
	isProviderSK?: number;

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