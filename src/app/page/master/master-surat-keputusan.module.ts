import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { SuratKeputusanComponent } from './surat-keputusan/surat-keputusan.component';
import { SuratKeputusanApprovalComponent } from './surat-keputusan-approval/surat-keputusan-approval.component';
import { SuratKeputusanRateLoanComponent } from './surat-keputusan-rate-loan/surat-keputusan-rate-loan.component';



@NgModule({
   declarations : [SuratKeputusanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SuratKeputusanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SuratKeputusanModule {}

@NgModule({
   declarations : [SuratKeputusanApprovalComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SuratKeputusanApprovalComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SuratKeputusanApprovalModule {}

@NgModule({
   declarations : [SuratKeputusanRateLoanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SuratKeputusanRateLoanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SuratKeputusanRateLoanModule {}
