import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { PenghasilanTidakKenaPajakComponent } from './penghasilan-tidak-kena-pajak/penghasilan-tidak-kena-pajak.component';
import { PajakComponent } from './pajak/pajak.component';
import { ObjekPajakComponent } from './objek-pajak/objek-pajak.component';
import { JenisPajakComponent } from './jenis-pajak/jenis-pajak.component';


@NgModule({
   declarations : [JenisPajakComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisPajakComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisPajakModule {}

@NgModule({
   declarations : [PajakComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PajakComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PajakModule {}

@NgModule({
   declarations : [PenghasilanTidakKenaPajakComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PenghasilanTidakKenaPajakComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PenghasilanTidakKenaPajakModule {}

@NgModule({
   declarations : [ObjekPajakComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ObjekPajakComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ObjekPajakModule {}