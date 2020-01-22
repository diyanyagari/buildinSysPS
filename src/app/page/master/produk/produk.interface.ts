import {EventEmitter} from '@angular/core';

export interface Produk {
	namaProduk?: string;//
	// kdDepartemen?: string;//
	deskripsiProduk?: string;
	qtyTerkecil?: number;//
	qtyJualTerkecil?: number;//
	kdDetailJenisProduk?: string;//
	nilaiNormal?: number;//
	kdSatuanStandar?: number;
	kekuatan?: string;
	kdSatuanKecil?: number;
	kdGolonganProduk?: number;
	kdDetailGolonganProduk?: number;
	kdKategoryProduk?: number;
	kdStatusProduk?: number;
	kdBentukProduk?: number;
	kdGProduk?: string;
	kdProdusenProduk?: number;
	kdTypeProduk?: number;
	kdBahanProduk?: number;
	kdWarnaProduk?: number;
	tglProduksi?: number;
	kdUnitLaporan?: number;
	kdJenisPeriksa?: number;
	kdFungsiProduk?: number;
	kdLevelTingkat?: number;
	kdAccount?: number;
	kdBarcode?: string;
	isProdukIntern?: number;
	qtySKS?: number;
	tglDaftar?: number;//

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
export interface SelectedItem {
	label?:string;
	value?:any;
}

export interface KelompokProduk {
	namaKelompokProduk?: string;
	kdJenisTransaksi?: number;
	// kdDepartemen?: string;
	isHavingStok?: number;
	isHavingPrice?: number;

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
export interface JenisProduk {
	namaJenisProduk?: string;//
	kdKelompokProduk?: number;//
	kdAccount?: number;
	kdJenisProduksiHead?: string;
	// kdDepartemen?: string;

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

export interface DetailJenisProduk {
	namaDetailJenisProduk?: string;//
	 kdJenisProduk?: string;//
     persenHargaCito?: number;//
	 kdAccount?: number;    
     isRegistrasiAset?: number;
     // kdDepartemen?: string;

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