import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { PegawaiSkGajiComponent } from './pegawai-sk-gaji/pegawai-sk-gaji.component';
import { PegawaiSkGajiBAComponent } from './pegawai-sk-gaji-ba/pegawai-sk-gaji-ba.component';
import { PegawaiSkGajiBAKComponent } from './pegawai-sk-gaji-bak/pegawai-sk-gaji-bak.component';
import { MasterPegawaiSkHitungPayrollComponent } from './master-pegawai-sk-hitung-payroll/master-pegawai-sk-hitung-payroll.component';
import { PegawaiSkWaktuKerjaComponent } from './pegawai-sk-waktu-kerja/pegawai-sk-waktu-kerja.component';
import { PegawaiSkPayrollByStatusComponent } from './pegawai-sk-payroll-by-status/pegawai-sk-payroll-by-status.component';
import { PegawaiSKLoanComponent } from './pegawaiskloan/pegawaiskloan.component';
import { PegawaiSKReimburseComponent } from './pegawaiskreimburse/pegawaiskreimburse.component';
import { PegawaiSkStatusRevtabComponent } from './pegawai-sk-status-revtab/pegawai-sk-status-revtab.component';
import { MasterPegawaiSkAsuransiComponent } from './master-pegawai-sk-asuransi/master-pegawai-sk-asuransi.component';
import { PegawaiSkPajakComponent } from './pegawai-sk-pajak/pegawai-sk-pajak.component';
import { MasterPegawaiSkFasilitasComponent } from './master-pegawai-sk-fasilitas/master-pegawai-sk-fasilitas.component';
import { PegawaiSkTidakAbsenComponent } from './pegawai-sk-tidak-absen/pegawai-sk-tidak-absen.component';
import { PegawaiSkMedicalComponent } from './pegawai-sk-medical/pegawai-sk-medical.component';
import { PegawaiSkStatusComponent } from './pegawai-sk-status/pegawai-sk-status.component';
import { PegawaiSkStatusPensiunNewComponent } from './pegawai-sk-status-pensiun-new/pegawai-sk-status-pensiun-new.component';
import { PegawaiSkStatusCutiNewComponent } from './pegawai-sk-status-cuti-new/pegawai-sk-status-cuti-new.component';
import { CekPinjamanPegawaiBerhentiComponent } from './cek-pinjaman-pegawai-berhenti/cek-pinjaman-pegawai-berhenti.component';
import { PegawaiSkStatusDinasComponent } from './pegawai-sk-status-dinas/pegawai-sk-status-dinas.component';
import { PegawaiSkHitungKomponenKetidakhadiranComponent } from './pegawai-sk-hitung-komponen-ketidakhadiran/pegawai-sk-hitung-komponen-ketidakhadiran.component';
import { PegawaiSkHitungKomponenKeterlambatanComponent } from './pegawai-sk-hitung-komponen-keterlambatan/pegawai-sk-hitung-komponen-keterlambatan.component';


@NgModule({
   declarations : [PegawaiSkGajiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkGajiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkGajiModule {}

@NgModule({
   declarations : [PegawaiSkGajiBAComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkGajiBAComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkGajiBAModule {}

@NgModule({
   declarations : [PegawaiSkGajiBAKComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkGajiBAKComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkGajiBAKModule {}

@NgModule({
   declarations : [MasterPegawaiSkHitungPayrollComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MasterPegawaiSkHitungPayrollComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MasterPegawaiSkHitungPayrollModule {}

@NgModule({
   declarations : [PegawaiSkWaktuKerjaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkWaktuKerjaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkWaktuKerjaModule {}

@NgModule({
   declarations : [PegawaiSkPayrollByStatusComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkPayrollByStatusComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkPayrollByStatusModule {}

@NgModule({
   declarations : [PegawaiSKLoanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSKLoanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSKLoanModule {}

@NgModule({
   declarations : [PegawaiSKReimburseComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSKReimburseComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSKReimburseModule {}

@NgModule({
   declarations : [PegawaiSkStatusRevtabComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkStatusRevtabComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkStatusRevtabModule {}

@NgModule({
   declarations : [PegawaiSkStatusPensiunNewComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkStatusPensiunNewComponent} ]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PegawaiSkStatusPensiunNewModule {}

@NgModule({
   declarations : [PegawaiSkStatusCutiNewComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkStatusCutiNewComponent} ]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PegawaiSkStatusCutiNewModule {}

@NgModule({
   declarations : [MasterPegawaiSkAsuransiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MasterPegawaiSkAsuransiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MasterPegawaiSkAsuransiModule {}

@NgModule({
   declarations : [PegawaiSkPajakComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkPajakComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkPajakModule {}

@NgModule({
   declarations : [MasterPegawaiSkFasilitasComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MasterPegawaiSkFasilitasComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MasterPegawaiSkFasilitasModule {}

@NgModule({
   declarations : [PegawaiSkTidakAbsenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkTidakAbsenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkTidakAbsenModule {}

@NgModule({
   declarations : [PegawaiSkMedicalComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkMedicalComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkMedicalModule {}

@NgModule({
   declarations : [PegawaiSkStatusComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkStatusComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkStatusModule {}


@NgModule({
   declarations : [CekPinjamanPegawaiBerhentiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: CekPinjamanPegawaiBerhentiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class CekPinjamanPegawaiBerhentiModule {}

@NgModule({
   declarations : [PegawaiSkStatusDinasComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkStatusDinasComponent} ]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PegawaiSkStatusDinasModule {}

@NgModule({
   declarations : [PegawaiSkHitungKomponenKetidakhadiranComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkHitungKomponenKetidakhadiranComponent} ]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PegawaiSkHitungKomponenKetidakhadiranModul {}

@NgModule({
   declarations : [PegawaiSkHitungKomponenKeterlambatanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkHitungKomponenKeterlambatanComponent} ]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PegawaiSkHitungKomponenKeterlambatanModul {}
