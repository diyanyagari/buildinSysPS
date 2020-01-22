    import {EventEmitter} from '@angular/core';

    export interface HargaPaketModulAplikasi {
kdProfile?: number;
kdPaket?: number;
kdModulAplikasi?: string;
kdVersion?: number;
kdEdisi?: number;
kdKelompokKlien?: number;
noSK?: string;
hargaNetto?: number;
hargaSatuan?: number;
persenDiscount?: number;
hargaDiscount?: number;
factorRate?: number;
operatorFactorRate?: string;
qtyUserMin?: number;
qtyUserMax?: number;
qtyProdukMin?: number;
qtyProdukMax?: number;
kdMataUang?: number;
statusEnabled?:boolean;
noRec?: string;
kode?:any;
    }

