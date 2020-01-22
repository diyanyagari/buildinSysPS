import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardModImport } from './';
import * as wg from './';

@NgModule({ 
	declarations : [ wg.WidgetJumlahPegawaiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetJumlahPegawaiComponent ]
})
export class WidgetJumlahPegawaiModule {}

@NgModule({ 
	declarations : [ wg.WidgetAkumulasiCutiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetAkumulasiCutiComponent ]
})
export class WidgetAkumulasiCutiModule {}

@NgModule({ 
	declarations : [ wg.WidgetKontakPegawaiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetKontakPegawaiComponent ]
})
export class WidgetKontakPegawaiModule {}

@NgModule({ 
	declarations : [ wg.WidgetGajiPegawaiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetGajiPegawaiComponent ]
})
export class WidgetGajiPegawaiModule {}

@NgModule({ 
	declarations : [ wg.WidgetAsetRuanganComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetAsetRuanganComponent ]
})
export class WidgetAsetRuanganModule {}

@NgModule({ 
	declarations : [ wg.WidgetPengajuanComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPengajuanComponent ]
})
export class WidgetPengajuanModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiAbsensiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiAbsensiComponent ]
})
export class WidgetPersentasiAbsensiModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiJabatanComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiJabatanComponent ]
})
export class WidgetPersentasiJabatanModule {}

@NgModule({ 
	declarations : [ wg.WidgetSisaPinjamanPegawaiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetSisaPinjamanPegawaiComponent ]
})
export class WidgetSisaPinjamanPegawaiModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiPengajuanComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiPengajuanComponent ]
})
export class WidgetPersentasiPengajuanModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiAsetComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiAsetComponent ]
})
export class WidgetPersentasiAsetModule {}

@NgModule({ 
	declarations : [ wg.WidgetPegawaiUsiaPensiunComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPegawaiUsiaPensiunComponent ]
})
export class WidgetPegawaiUsiaPensiunModule {}

@NgModule({ 
	declarations : [ wg.WidgetPegawaiHabisKontrakComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPegawaiHabisKontrakComponent ]
})
export class WidgetPegawaiHabisKontrakModule {}

@NgModule({ 
	declarations : [ wg.WidgetPegawaiUlangTahunComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPegawaiUlangTahunComponent ]
})
export class WidgetPegawaiUlangTahunModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiPegawaiPensiunComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiPegawaiPensiunComponent ]
})
export class WidgetPersentasiPegawaiPensiunModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiPegawaiResignComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiPegawaiResignComponent ]
})
export class WidgetPersentasiPegawaiResignModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiStrukturKolegaComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiStrukturKolegaComponent ]
})
export class WidgetPersentasiStrukturKolegaModule {}

@NgModule({ 
	declarations : [ wg.WidgetPersentasiJumlahPegawaiComponent ],
	imports: [ ...DashboardModImport ],
	exports: [ wg.WidgetPersentasiJumlahPegawaiComponent ]
})
export class WidgetPersentasiJumlahPegawaiModule {}
