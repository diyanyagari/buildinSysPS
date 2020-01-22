import {EventEmitter} from '@angular/core';
export interface Rekanan {
  
  contactPerson?: string,
  kdAccount?: any,
  kdDepartemen?: string,
  kdJenisRekanan?: any,
  kdPegawai?: any,
  kdRekananHead?: any,
  kode?: any,
  kodeExternal?: string,
  namaExternal?: string,
  namaRekanan?: string,
  noPKP?: string,
  npwp?: string,
  reportDisplay?: string,
  statusEnabled?: true,
  version?: any
  noRec?: string;
  label?: any;
  value?: any;
}

export interface JenisRekanan {
  kode?: any;
  namaJenisRekanan?: string;
  reportDisplay?: string;
  kodeExternal?: string;
  namaExternal?: string;
  statusEnabled?: boolean;
  noRec?: string;

}