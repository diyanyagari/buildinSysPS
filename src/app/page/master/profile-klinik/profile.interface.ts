import { EventEmitter } from '@angular/core';

export interface Profile {

  gambarLogo?: string,
  kdAccount?: any,
  kdAlamat?: any,
  kdDepartemen?: string,
  kdJenisProfile?: any,
  kdJenisTarif?: any,
  kdLevelTingkat?: any,
  kdMataUang?: any,
  kdNegara?: any,
  kdPegawaiKepala?: string,
  kdPemilikProfile?: any,
  kdProfileHead?: any,
  kdSatuanKerja?: any,
  kdStatusAkreditasiLast?: any,
  kdStatusSuratIjinLast?: any,
  kdTahapanAkreditasiLast?: any,
  kdTypeProfile?: any,
  kode?: any,
  kodeExternal?: string,
  luasBangunan?: any,
  luasTanah?: any,
  messageToPasien?: string,
  mottoLast?: string,
  namaExternal?: string,
  namaLengkap?: string,
  noPKP?: string,
  noSuratIjinLast?: string,
  npwp?: string,
  reportDisplay?: string,
  semboyanLast?: string,
  signatureByLast?: string,
  sloganLast?: string,
  statusEnabled?: true,
  taglineLast?: string,
  tglAkreditasiLast?: string,
  tglDaftar?: any,
  tglRegistrasi?: string,
  tglSuratIjinExpiredLast?: any,
  tglSuratIjinLast?: any,
  version?: any
  label?: any,
  value?: any,
}
export interface DataSimpan {

  dataAlamatDto?,
  gambarLogo?,
  kdAccount?,
  kdAlamat?,
  kdDepartemen?,
  kdJenisProfile?,
  kdJenisTarif?,
  kdLevelTingkat?,
  kdMataUang?,
  kdNegara?,
  kdPegawaiKepala?,
  kdPemilikProfile?,
  kdProfileHead?,
  kdSatuanKerja?,
  kdStatusAkreditasiLast?,
  kdStatusSuratIjinLast?,
  kdTahapanAkreditasiLast?,
  kdTypeProfile?,
  kode?,
  kodeExternal?,
  luasBangunan?,
  luasTanah?,
  messageToPasien?,
  mottoLast?,
  namaExternal?,
  namaLengkap?,
  noPKP?,
  noSuratIjinLast?,
  npwp?,
  reportDisplay?,
  semboyanLast?,
  signatureByLast?,
  sloganLast?,
  statusEnabled?,
  taglineLast?,
  tglAkreditasiLast?,
  tglDaftar?,
  tglRegistrasi?,
  tglSuratIjinExpiredLast?,
  tglSuratIjinLast?,
  version?,
  nPWP?,
  ambilFoto?,

  alamatLengkap?,
  rtrw?,
  kdPropinsi?,
  kdKotaKabupaten?,
  kdDesaKelurahan?,
  kodePos?,

}