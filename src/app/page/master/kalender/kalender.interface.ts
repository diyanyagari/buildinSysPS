import {EventEmitter} from '@angular/core';

export interface Kalender {
tanggal?: string;//
namaHari?: string;//
namaBulan?: string;//
hariKeDlmMinggu?: number;//
hariKeDlmBulan?: number;//
hariKeDlmTahun?: number;//
mingguKeDlmTahun?: number;//
bulanKeDlmTahun?: number;//
tahunKalender?: number;//
tahunFiscal?: number;
bulanFiscal?: string;
triwulanKeDlmTahun?: number;
semesterKeDlmTahun?: number;

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