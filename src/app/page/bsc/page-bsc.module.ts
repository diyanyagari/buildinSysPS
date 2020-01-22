import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule }  from '../../shared.module';
import { AuthGuard } from '../../global';

import * as pBsc from './';


@NgModule({ 
	declarations : [pBsc.DaftarMonitoringPengajuanKpiPegawaiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: pBsc.DaftarMonitoringPengajuanKpiPegawaiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})
export class DaftarMonitoringPengajuanKpiPegawaiModule {}

@NgModule({ 
	declarations : [pBsc.PengajuanRealisasiKpiPegawaiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: pBsc.PengajuanRealisasiKpiPegawaiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})
export class PengajuanRealisasiKpiPegawaiModule {}

@NgModule({ 
	declarations : [pBsc.DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: pBsc.DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})
export class DaftarMonitoringPengajuanRealisasiKpiPegawaiModule {}

@NgModule({ 
	declarations : [pBsc.RekapitulasiSkorAkhirKpiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: pBsc.RekapitulasiSkorAkhirKpiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})
export class RekapitulasiSkorAkhirKpiComponentModule {}