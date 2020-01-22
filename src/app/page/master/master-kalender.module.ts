import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { PeriodeComponent } from './periode/periode.component';
import { KalenderComponent } from './kalender/kalender.component';
import { MapAngkaToBulanComponent } from './map-angka-to-bulan/map-angka-to-bulan.component';
import { HariFormComponent } from './hari-form/hari-form.component';
import { HariLiburComponent } from './harilibur/harilibur.component';
import { JenisWaktuComponent } from './jenis-waktu/jenis-waktu.component';
import { EventComponent } from './event/event.component';
import { BulanComponent } from './bulan/bulan.component';



@NgModule({
   declarations : [JenisWaktuComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisWaktuComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisWaktuModule {}

@NgModule({
   declarations : [PeriodeComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PeriodeComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PeriodeModule {}

@NgModule({
   declarations : [KalenderComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KalenderComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KalenderModule {}

@NgModule({
   declarations : [MapAngkaToBulanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapAngkaToBulanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapAngkaToBulanModule {}

@NgModule({
   declarations : [HariFormComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HariFormComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HariFormModule {}

@NgModule({
   declarations : [HariLiburComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HariLiburComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HariLiburModule {}

@NgModule({
   declarations : [EventComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: EventComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class EventModule {}

@NgModule({
    declarations : [BulanComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: BulanComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class BulanModule {}

