    import {EventEmitter} from '@angular/core';

    export interface Dokumen {
		kdProfile?: string;
		kdDokumen?: string;
		noDokumen?: string;
		namaJudulDokumen?: string;
		reportDisplay?: string;
		deskripsiDokumen?: string;
		tglDokumen?: string;
		kdJenisDokumen?: string;
		kdKategoryDokumen?: string;
		kdLokasi?: string;
		pathFile?: string;
		qtyLampiran?: string;
		kdDokumenHead?: string;
		dokumenHead?:string;
		kdRuangan?: string;
		kdPegawaiPembuat?: string;
		pegawaiPembuat?: string;
		isDokumenInOutInt?: string;
		retensiDokumenTahun?: string;
		kdStatus?: string;
		kodeExternal?: string;
		namaExternal?: string;
		kdDepartemen?: string;
		statusEnabled?: boolean;
		noRec?: string;
		label?:string;
		value?:string;
		kode?:any;
		id?:any;
		dokumenInOut?:number;
    }

