import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { MonitoringAntrianRegistrasiComponent } from './monitoring-antrian-registrasi/monitoring-antrian-registrasi.component';
import { ViewerAntrianComponent } from './viewer-antrian/viewer-antrian.component';
import { RegistrasiPasienBaruComponent } from './registrasi-pasien-baru/registrasi-pasien-baru.component';
import { MonitoringPasienComponent } from './monitoring-pasien/monitoring-pasien.component';
import { RegistrasiAsuransiComponent } from './registrasi-asuransi/registrasi-asuransi.component';
import { MonitoringRegistrasiAsuransiComponent } from './monitoring-registrasi-asuransi/monitoring-registrasi-asuransi.component';
import { RegistrasiPelayananComponent } from './registrasi-pelayanan/registrasi-pelayanan.component';
import { MonitoringPasienDiPeriksaComponent } from './monitoring-pasien-diperiksa/monitoring-pasien-diperiksa.component';
import { ViewerPelayananComponent } from './viewer-pelayanan/viewer-pelayanan.component';
import { MasukRuanganComponent } from './masuk-ruangan/masuk-ruangan.component';
import { MonitoringPasienRuanganDokterComponent } from './monitoring-pasien-ruangan-dokter/monitoring-pasien-ruangan-dokter.component';

@NgModule({
   declarations: [MonitoringAntrianRegistrasiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringAntrianRegistrasiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule],
})
export class MonitoringAntrianRegistrasiModule { }

@NgModule({
   declarations: [ViewerAntrianComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ViewerAntrianComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ViewerAntrianModule { }

@NgModule({
   declarations: [ViewerPelayananComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ViewerPelayananComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ViewerPelayananModule { }

@NgModule({
   declarations: [RegistrasiPasienBaruComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: RegistrasiPasienBaruComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class RegistrasiPasienBaruModule { }

@NgModule({
   declarations: [MonitoringPasienComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringPasienComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringPasienModule { }

@NgModule({
   declarations: [RegistrasiAsuransiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: RegistrasiAsuransiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class RegistrasiAsuransiModule { }

@NgModule({
   declarations: [MonitoringRegistrasiAsuransiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringRegistrasiAsuransiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringRegistrasiAsuransiModule { }

@NgModule({
   declarations: [RegistrasiPelayananComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: RegistrasiPelayananComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class RegistrasiPelayananModule { }

@NgModule({
   declarations: [MonitoringPasienDiPeriksaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringPasienDiPeriksaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringPasienDiPeriksaModule { }

@NgModule({
   declarations: [MasukRuanganComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasukRuanganComponent }]), SharedModule.forRoot()],
   exports: [RouterModule],
})
export class MasukRuanganModule { }

@NgModule({
   declarations: [MonitoringPasienRuanganDokterComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringPasienRuanganDokterComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringPasienRuanganDokterModule { }
