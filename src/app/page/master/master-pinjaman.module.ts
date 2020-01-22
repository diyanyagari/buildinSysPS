import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { JenisBungaComponent } from './jenis-bunga/jenis-bunga.component';
import { JenisSukuBungaComponent } from './jenis-suku-bunga/jenis-suku-bunga.component';
import { MetodePerhitunganComponent } from './metode-perhitungan/metode-perhitungan.component';
import { MetodePembayaranComponent } from './metode-pembayaran/metode-pembayaran.component';


@NgModule({
   declarations : [JenisBungaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisBungaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisBungaModule {}

@NgModule({
   declarations : [JenisSukuBungaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisSukuBungaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisSukuBungaModule {}

@NgModule({
   declarations : [MetodePerhitunganComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MetodePerhitunganComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MetodePerhitunganModule {}

@NgModule({
   declarations : [MetodePembayaranComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MetodePembayaranComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MetodePembayaranModule {}
