import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { RekananComponent } from './rekanan/rekanan.component';
import { HubunganPesertaAsuransiComponent } from './hubungan-peserta-asuransi/hubungan-peserta-asuransi.component';
import { GolonganAsuransiComponent } from './golongan-asuransi/golongan-asuransi.component';


@NgModule({
   declarations : [RekananComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RekananComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RekananModule {}

@NgModule({
   declarations : [HubunganPesertaAsuransiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HubunganPesertaAsuransiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HubunganPesertaAsuransiModule {}

@NgModule({
   declarations : [GolonganAsuransiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: GolonganAsuransiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class GolonganAsuransiModule {}
