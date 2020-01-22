    import {EventEmitter} from '@angular/core';

    export interface Dokumen {
		kdProfile?: string;
		kdDokumen?: string;
		namaDokumen?: string;
		reportDisplay?: string;
		deskripsiDokumen?: string;
		tglDokumen?: string;
		tglAkhirBerlaku?: string;
		tglAwalBerlaku?: string;
		kdJenisDokumen?: string;
		kdKategoryDokumen?: string;
		kdLokasi?: string;
		namaJudulDokumen?: string;
		// pathFile?: string;
		// qtyLampiran?: string;
		kdDokumenHead?: string;
		// dokumenHead?:string;
		kdRuangan?: "";
		kdPegawaiPembuat?: string;
		pegawaiPembuat?: string;
		// isDokumenInOutInt?: string;
		// retensiDokumenTahun?: string;
		// kdStatus?: string;
		kodeExternal?: string;
		namaExternal?: string;
		kdDepartemen?: string;
		statusEnabled?: boolean;
		// noRec?: string;
		label?:string;
		value?:string;
		kode?:any;
		qtyDokumen?:string;
		isbn?: string;
		// id?:any;
		// dokumenInOut?:number;
    }

