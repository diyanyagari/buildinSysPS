import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { KelompokEvaluasiComponent } from './kelompok-evaluasi/kelompok-evaluasi.component';
import { PendidikanComponent } from './pendidikan/pendidikan.component';
import { FakultasComponent } from './fakultas/fakultas.component';
import { KualifikasiJurusanComponent } from './kualifikasi-jurusan/kualifikasi-jurusan.component';
import { MapKelompokevaluasiJabatanComponent } from './map-kelompokevaluasi-jabatan/map-kelompokevaluasi-jabatan.component';
import { JenisPetugasPelaksanaComponent } from './jenis-petugas-pelaksana/jenis-petugas-pelaksana.component';


@NgModule({
   declarations : [PendidikanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PendidikanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PendidikanModule {}

@NgModule({
   declarations : [FakultasComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: FakultasComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class FakultasModule {}

@NgModule({
   declarations : [KualifikasiJurusanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KualifikasiJurusanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KualifikasiJurusanModule {}

@NgModule({
   declarations : [KelompokEvaluasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokEvaluasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelompokEvaluasiModule {}

@NgModule({
   declarations : [MapKelompokevaluasiJabatanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompokevaluasiJabatanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompokevaluasiJabatanModule {}

@NgModule({
   declarations : [JenisPetugasPelaksanaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisPetugasPelaksanaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisPetugasPelaksanaModule {}

