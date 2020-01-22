import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { DaftarMonitoringDatabasePegawaiComponent } from './daftar-monitoring-database-pegawai/daftar-monitoring-database-pegawai.component';
import { DataPegawaiComponent } from './data-pegawai/data-pegawai.component';


@NgModule({
   declarations: [DaftarMonitoringDatabasePegawaiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DaftarMonitoringDatabasePegawaiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule],
})
export class DaftarMonitoringDatabasePegawaiModule { }

@NgModule({
   declarations: [DataPegawaiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DataPegawaiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DataPegawaiModule { }


