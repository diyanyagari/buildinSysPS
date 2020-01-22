import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { JenisProfileComponent } from './jenis-profile/jenis-profile.component';
import { KelompokPemilikProfileComponent } from './kelompok-pemilik-profile/kelompok-pemilik-profile.component';
import { PemilikProfileComponent } from './pemilik-profile/pemilik-profile.component';
import { RuanganComponent } from './ruangan/ruangan.component';
import { ProfileComponent } from './profile/profile.component';
import { DepartemenComponent } from './departemen/departemen.component';
import { StrukturOrganisasiComponent } from './struktur-organisasi/struktur-organisasi.component';
import { ProfileStrukturGajiByMkgpComponent } from './profile-struktur-gaji-by-mkgp/profile-struktur-gaji-by-mkgp.component';
import { LokasiKerjaComponent } from './lokasi-kerja/lokasi-kerja.component';
import { SimulasiNomorComponent } from './simulasi-nomor/simulasi-nomor.component';
import { ProfileHistoriStmsComponent } from './profile-histori-stms/profile-histori-stms.component';
import { MapKomputerToPrinterComponent } from './map-komputer-to-printer/map-komputer-to-printer.component';
import { RuanganUnitKerjaComponent } from './ruangan-unit-kerja/ruangan-unit-kerja.component';
import { ProfileKlinikComponent } from './profile-klinik/profile-klinik.component';

@NgModule({
   declarations : [ProfileKlinikComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileKlinikComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileKlinikModule {}

@NgModule({
   declarations : [ProfileStrukturGajiByMkgpComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileStrukturGajiByMkgpComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileStrukturGajiByMkgpModule {}

@NgModule({
   declarations : [JenisProfileComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisProfileComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisProfileModule {}

@NgModule({
   declarations : [ProfileComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileModule {}

@NgModule({
   declarations : [KelompokPemilikProfileComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokPemilikProfileComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelompokPemilikProfileModule {}

@NgModule({
   declarations : [PemilikProfileComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PemilikProfileComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PemilikProfileModule {}

@NgModule({
   declarations : [DepartemenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: DepartemenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class DepartemenModule {}

@NgModule({
   declarations : [RuanganComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RuanganComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RuanganModule {}

@NgModule({
   declarations : [StrukturOrganisasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: StrukturOrganisasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class StrukturOrganisasiModule {}

@NgModule({
    declarations : [LokasiKerjaComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: LokasiKerjaComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class LokasiKerjaModule {}

 @NgModule({
   declarations : [SimulasiNomorComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SimulasiNomorComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SimulasiNomorModule {}

@NgModule({
   declarations : [ProfileHistoriStmsComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileHistoriStmsComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileHistoriStmsModule {}

@NgModule({
   declarations : [MapKomputerToPrinterComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKomputerToPrinterComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKomputerToPrinterModule {}

@NgModule({
   declarations : [RuanganUnitKerjaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RuanganUnitKerjaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RuanganUnitKerjaModule {}