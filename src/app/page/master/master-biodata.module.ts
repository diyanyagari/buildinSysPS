import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { AgamaComponent } from './agama/agama.component';
import { SukuComponent } from './suku/suku.component';
import { JenisKelaminComponent } from './jeniskelamin/jeniskelamin.component';
import { GolonganDarahFormComponent } from './golonganDarah-form/golonganDarah-form.component';
import { BahasaComponent } from './bahasa/bahasa.component';
import { ZodiakComponent } from './zodiak/zodiak.component';
import { ZodiakUnsurComponent } from './zodiak-unsur/zodiak-unsur.component';
import { ZodiakUnsurRangeComponent } from './zodiak-unsur-range/zodiak-unsur-range.component';
import { HubunganKeluargaComponent } from './hubungan-keluarga/hubungan-keluarga.component';

@NgModule({
   declarations : [AgamaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: AgamaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class AgamaModule {}

@NgModule({
   declarations : [SukuComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SukuComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SukuModule {}

@NgModule({
   declarations : [JenisKelaminComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisKelaminComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisKelaminModule {}

@NgModule({
   declarations : [GolonganDarahFormComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: GolonganDarahFormComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class GolonganDarahFormModule {}

@NgModule({
   declarations : [BahasaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: BahasaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class BahasaModule {}

@NgModule({
   declarations : [ZodiakComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ZodiakComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ZodiakModule {}

@NgModule({
   declarations : [ZodiakUnsurComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ZodiakUnsurComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ZodiakUnsurModule {}

@NgModule({
   declarations : [ZodiakUnsurRangeComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ZodiakUnsurRangeComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ZodiakUnsurRangeModule {}

@NgModule({
   declarations : [HubunganKeluargaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HubunganKeluargaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HubunganKeluargaModule {}
