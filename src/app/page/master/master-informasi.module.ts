import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { VisiComponent } from './visi/visi.component';
import { MisiComponent } from './misi/misi.component';
import { DeskripsiComponent } from './deskripsi/deskripsi.component';
import { JenisDeskripsiComponent } from './jenis-deskripsi/jenis-deskripsi.component';
import { KategoriDeskripsiComponent } from './kategori-deskripsi/kategori-deskripsi.component';
import { SatuanHasilComponent } from './satuan-hasil/satuan-hasil.component';
import { KomponenComponent } from './komponen/komponen.component';
import { KomponenHasilComponent } from './komponen-hasil/komponen-hasil.component';
import { MapKomponenHasilComponent } from './map-komponen-hasil/map-komponen-hasil.component';
import { AsalComponent } from './asal/asal.component';
import { KeteranganAlasanComponent } from './keterangan-alasan/keterangan-alasan.component';
import { JenisOrganisasiComponent } from './jenis-organisasi/jenis-organisasi.component';
import { StatusComponent } from './status/status.component';


import { KomponenPemeriksaanObjektifComponent } from './komponen-pemeriksaanobjektif/komponen-pemeriksaanobjektif.component';
import { KomponenPemeriksaanLaboratoriumComponent } from './komponen-pemeriksaanlaboratorium/komponen-pemeriksaanlaboratorium.component';
import { KomponenPenilaianKompetensiComponent } from './komponen-penilaiankompetensi/komponen-penilaiankompetensi.component';
import { KomponenGajiComponent } from './komponen-gaji/komponen-gaji.component';
import { KomponenEvaluasiOrientasiComponent } from './komponen-evaluasiorientasi/komponen-evaluasiorientasi.component';
import { KomponenEvaluasiJabatanComponent } from './komponen-evaluasijabatan/komponen-evaluasijabatan.component';

import { KelompokStatusComponent } from './kelompok-status/kelompok-status.component';

import { KomponenMsaComponent } from './komponen-msa/komponen-msa.component';

@NgModule({
   declarations : [StatusComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: StatusComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class StatusModule {}

@NgModule({
   declarations : [KeteranganAlasanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KeteranganAlasanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KeteranganAlasanModule {}

@NgModule({
   declarations : [KomponenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenModule {}

@NgModule({
   declarations : [SatuanHasilComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SatuanHasilComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SatuanHasilModule {}

@NgModule({
   declarations : [KomponenHasilComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenHasilComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenHasilModule {}

@NgModule({
   declarations : [MapKomponenHasilComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKomponenHasilComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKomponenHasilModule {}

@NgModule({
   declarations : [KategoriDeskripsiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KategoriDeskripsiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KategoriDeskripsiModule {}

@NgModule({
   declarations : [JenisDeskripsiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisDeskripsiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisDeskripsiModule {}

@NgModule({
   declarations : [DeskripsiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: DeskripsiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class DeskripsiModule {}

@NgModule({
   declarations : [MisiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MisiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MisiModule {}

@NgModule({
   declarations : [VisiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: VisiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class VisiModule {}

@NgModule({
   declarations : [AsalComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: AsalComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class AsalModule {}

@NgModule({
   declarations : [JenisOrganisasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisOrganisasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisOrganisasiModule {}

@NgModule({
   declarations : [KomponenPemeriksaanObjektifComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenPemeriksaanObjektifComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenPemeriksaanObjektifModule {}

@NgModule({
   declarations : [KomponenPemeriksaanLaboratoriumComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenPemeriksaanLaboratoriumComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenPemeriksaanLaboratoriumModule {}

@NgModule({
   declarations : [KomponenPenilaianKompetensiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenPenilaianKompetensiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenPenilaianKompetensiModule {}

@NgModule({
   declarations : [KomponenGajiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenGajiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenGajiModule {}

@NgModule({
   declarations : [KomponenEvaluasiOrientasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenEvaluasiOrientasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenEvaluasiOrientasiModule {}

@NgModule({
   declarations : [KomponenEvaluasiJabatanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenEvaluasiJabatanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenEvaluasiJabatanModule {}

@NgModule({
    declarations : [KelompokStatusComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokStatusComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class KelompokStatusModule {}
 
 @NgModule({
   declarations : [KomponenMsaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KomponenMsaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KomponenMsaModule {}