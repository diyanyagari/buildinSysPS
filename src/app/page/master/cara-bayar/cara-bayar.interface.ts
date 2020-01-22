import { EventEmitter } from '@angular/core';

export interface  CaraBayar{
    kode?: any;
    kdGolonganPegawai?: number;
    hargaSatuan?: string
    kdOperatorRate?: string;
    kdKomponenHarga?: string;
    status1?: string;
    noRec?: string;
    label?: any;
    value?: any;
    namaStatus?: string;
    id?: any;
    awardOffence?: any;
    namaCaraBayar?:string;
    kodeExternal?:string;
    namaExternal?:string;
    statusEnabled?:boolean;
}
