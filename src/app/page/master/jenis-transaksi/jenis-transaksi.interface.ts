import {EventEmitter} from '@angular/core';

export interface JenisTransaksi {
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
	namaJenisTransaksi?: string;
	metodeHargaNetto?: string;
	metodeStokHargaNetto?: string;
	metodeAmbilHargaNetto?: string;
	sistemHargaNetto?: string;
	jenisPersenCito?: string;
	namaProdukCito?: string;
	namaProdukRetur?: string;
	namaKelasDefault?: string;
	namaProdukDeposit?: string;
	tglBerlakuTarif?: any;
	namaKelompokPelayanan?: string;
	sistemDiscount?: string;
}