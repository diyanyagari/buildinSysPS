import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { SpesifikasiComponent } from './spesifikasi/spesifikasi.component';
import { PerspectiveComponent } from './perspective/perspective.component';
import { KpiComponent } from './kpi/kpi.component';
import { MonitoringKpiComponent } from './monitoring-kpi/monitoring-kpi.component'; 
import { KpiDepartemenComponent } from './kpi-departemen/kpi-departemen.component';
import { BscComponent } from './bsc/bsc.component';
import { DashboardMonitoringBscComponent } from './dashboard-monitoring-bsc/dashboard-monitoring-bsc.component';
import { ProfileHistoryStrategyMapComponent } from './profile-history-strategy-map/profile-history-strategy-map.component';
import { ProfileHistoryStrategyMapDepartmentComponent } from './profile-history-strategy-map-department/profile-history-strategy-map-department.component';
import { StrategyComponent } from './strategy/strategy.component';
import { ProfileHistoriVisiMisiComponent } from './profile-histori-visi-misi/profile-histori-visi-misi.component';

@NgModule({
    declarations : [ProfileHistoriVisiMisiComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileHistoriVisiMisiComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class ProfileHistoriVisiMisiModule {}

@NgModule({
    declarations : [StrategyComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: StrategyComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class StrategyModule {}

@NgModule({
   declarations : [KpiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KpiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KpiModule {}

@NgModule({
   declarations : [MonitoringKpiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MonitoringKpiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MonitoringKpiModule {}

@NgModule({
   declarations : [KpiDepartemenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KpiDepartemenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KpiDepartemenModule {}

@NgModule({
   declarations : [PerspectiveComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PerspectiveComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PerspectiveModule {}

@NgModule({
   declarations : [SpesifikasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SpesifikasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SpesifikasiModule {}

@NgModule({
   declarations : [BscComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: BscComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class BscModule {}

@NgModule({
   declarations : [DashboardMonitoringBscComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: DashboardMonitoringBscComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class DashboardMonitoringBscModule {}

@NgModule({
   declarations : [DashboardMonitoringBscComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileHistoryStrategyMapComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileHistoryStrategyMapModule {}

@NgModule({
   declarations : [DashboardMonitoringBscComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileHistoryStrategyMapDepartmentComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileHistoryStrategyMapDepartmentModule {}
