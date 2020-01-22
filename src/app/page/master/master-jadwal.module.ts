import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { KelompokShiftKerjaComponent } from './kelompok-shift-kerja/kelompok-shift-kerja.component';
import { ShiftKerjaComponent } from './shift-kerja/shift-kerja.component';
import { MapKelompokShiftToShiftComponent } from './map-kelompok-shift-to-shift/map-kelompok-shift-to-shift.component';
import { ShiftKerjaFormulasiComponent } from './shift-kerja-formulasi/shift-kerja-formulasi.component';



@NgModule({
   declarations : [ShiftKerjaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ShiftKerjaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ShiftKerjaModule {}

@NgModule({
   declarations : [KelompokShiftKerjaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokShiftKerjaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelompokShiftKerjaModule {}

@NgModule({
   declarations : [MapKelompokShiftToShiftComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompokShiftToShiftComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompokShiftToShiftModule {}

@NgModule({
   declarations : [ShiftKerjaFormulasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ShiftKerjaFormulasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ShiftKerjaFormulasiModule {}

