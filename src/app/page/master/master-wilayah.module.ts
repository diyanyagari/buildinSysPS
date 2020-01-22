import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { JenisAlamatComponent } from './jenis-alamat/jenis-alamat.component';
import { NegaraComponent } from './negara/negara.component'
import { PropinsiComponent } from './propinsi/propinsi.component';
import { KotakabupatenComponent } from './kotakabupaten/kotakabupaten.component';
import { KecamatanComponent } from './kecamatan/kecamatan.component';
import { DesaKelurahanComponent } from './desa-kelurahan/desa-kelurahan.component';

@NgModule({
   declarations : [JenisAlamatComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisAlamatComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisAlamatModule {}

@NgModule({
   declarations : [NegaraComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: NegaraComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class NegaraModule {}

@NgModule({
   declarations : [PropinsiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PropinsiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PropinsiModule {}

@NgModule({
   declarations : [KotakabupatenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KotakabupatenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KotakabupatenModule {}

@NgModule({
   declarations : [KecamatanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KecamatanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KecamatanModule {}

@NgModule({
   declarations : [DesaKelurahanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: DesaKelurahanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class DesaKelurahanModule {}