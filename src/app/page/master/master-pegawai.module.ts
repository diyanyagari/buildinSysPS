import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { TitlePegawaiComponent } from './title-pegawai/title-pegawai.component';
import { JenisPegawaiComponent } from './jenispegawai/jenispegawai.component';
import { JabatanComponent } from './jabatan/jabatan.component';
import { PangkatComponent } from './pangkat/pangkat.component'
import { GolonganPegawaiFormComponent } from './golonganPegawai-form/golonganPegawai-form.component';
import { MapGolonganpegawaiPangkatComponent } from './map-golonganpegawai-pangkat/map-golonganpegawai-pangkat.component';
import { KategoriPegawaiComponent } from './kategori-pegawai/kategori-pegawai.component';
import { TypePegawaiComponent } from './type-pegawai/type-pegawai.component';
import { PekerjaanComponent } from './pekerjaan/pekerjaan.component';
import { HubunganComponent } from './hubungan/hubungan.component';
import { MapJabatanPangkatComponent } from './map-jabatan-pangkat/map-jabatan-pangkat.component';
import { MapKelompokUserJabatanComponent } from './map-kelompok-user-jabatan/map-kelompok-user-jabatan.component';
import { MapKelompokUserGolonganPegawaiComponent } from './map-kelompok-user-golonganpegawai/map-kelompok-user-golonganpegawai.component';

@NgModule({
   declarations : [TitlePegawaiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: TitlePegawaiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class TitlePegawaiModule {}

@NgModule({
   declarations : [JenisPegawaiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisPegawaiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisPegawaiModule {}

@NgModule({
   declarations : [JabatanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JabatanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JabatanModule {}

@NgModule({
   declarations : [PangkatComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PangkatComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PangkatModule {}

@NgModule({
   declarations : [GolonganPegawaiFormComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: GolonganPegawaiFormComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class GolonganPegawaiFormModule {}

@NgModule({
   declarations : [MapGolonganpegawaiPangkatComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapGolonganpegawaiPangkatComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapGolonganpegawaiPangkatModule {}

@NgModule({
   declarations : [KategoriPegawaiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KategoriPegawaiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KategoriPegawaiModule {}

@NgModule({
   declarations : [TypePegawaiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: TypePegawaiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class TypePegawaiModule {}

@NgModule({
   declarations : [PekerjaanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PekerjaanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PekerjaanModule {}

@NgModule({
   declarations : [HubunganComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HubunganComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HubunganModule {}

@NgModule({
   declarations : [MapJabatanPangkatComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapJabatanPangkatComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapJabatanPangkatModule {}

@NgModule({
    declarations : [MapKelompokUserJabatanComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompokUserJabatanComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class MapKelompokUserJabatanModule {}

 @NgModule({
    declarations : [MapKelompokUserGolonganPegawaiComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompokUserGolonganPegawaiComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class MapKelompokUserGolonganPegawaiModule {}
