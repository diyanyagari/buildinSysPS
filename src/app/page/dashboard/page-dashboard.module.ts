import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../global';

import { DashboardModImport } from './';
import * as ds from './';

import * as wgMod from './page-widgets.module';

const WidgetModule = [
	wgMod.WidgetJumlahPegawaiModule,
	wgMod.WidgetAkumulasiCutiModule,
	wgMod.WidgetKontakPegawaiModule,
	wgMod.WidgetGajiPegawaiModule,
	wgMod.WidgetAsetRuanganModule,
	wgMod.WidgetPengajuanModule,
	wgMod.WidgetPersentasiAbsensiModule,
	wgMod.WidgetPersentasiJabatanModule,
	wgMod.WidgetSisaPinjamanPegawaiModule,
	wgMod.WidgetPersentasiPengajuanModule,
	wgMod.WidgetPersentasiAsetModule,
	wgMod.WidgetPegawaiUsiaPensiunModule,
	wgMod.WidgetPegawaiHabisKontrakModule,
	wgMod.WidgetPegawaiUlangTahunModule,
	wgMod.WidgetPersentasiPegawaiPensiunModule,
	wgMod.WidgetPersentasiPegawaiResignModule,
	wgMod.WidgetPersentasiStrukturKolegaModule,
	wgMod.WidgetPersentasiJumlahPegawaiModule
];

@NgModule({ 
	declarations : [ ds.MainDashboard ],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: ds.MainDashboard } ]), ...DashboardModImport, ...WidgetModule ],
	exports: [ RouterModule ]
})
export class MainDashboardModule {}


@NgModule({ 
	declarations : [ ds.PencarianComponent ],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: ds.PencarianComponent } ]), ...DashboardModImport ],
	exports: [ RouterModule ]
})
export class PencarianModule {}