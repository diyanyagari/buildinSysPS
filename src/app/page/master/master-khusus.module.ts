import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { MatauangComponent } from './matauang/matauang.component';
import { AwardOffenceComponent } from './award-offence/award-offence.component';
import { CaraBayarComponent } from './cara-bayar/cara-bayar.component';
import { LevelTingkatComponent } from './level-tingkat/level-tingkat.component';
import { PenyebabKematianComponent } from './penyebab-kematian/penyebab-kematian.component';
import { RangeComponent } from './range/range.component';
import { StrukturNomorComponent } from './struktur-nomor/struktur-nomor.component';
import { JenisKeputusanComponent } from './jenis-keputusan/jenis-keputusan.component';
import { KelasComponent } from './kelas/kelas.component';
import { JenisTarifComponent } from './jenis-tarif/jenis-tarif.component';


import { RangeWaktuPinjamanComponent } from './range-waktupinjaman/range-waktupinjaman.component';
import { RangePinjamanComponent } from './range-pinjaman/range-pinjaman.component';
import { RangeMasaKerjaThrComponent } from './range-masakerja-thr/range-masakerja-thr.component';
import { RangeMasaKerjaReimbursComponent } from './range-masakerja-reimburs/range-masakerja-reimburs.component';
import { RangeMasaKerjaPinjamanComponent } from './range-masakerja-pinjaman/range-masakerja-pinjaman.component';
import { RangeMasaKerjaPhkComponent } from './range-masakerja-phk/range-masakerja-phk.component';
import { RangeMasaKerjaPensiunComponent } from './range-masakerja-pensiun/range-masakerja-pensiun.component';
import { RangeMasaKerjaCutiComponent } from './range-masakerja-cuti/range-masakerja-cuti.component';
import { RangeMasaKerjaComponent } from './range-masakerja/range-masakerja.component';
import { RangeKeterlambatanComponent } from './range-keterlambatan/range-keterlambatan.component';
import { RangeMasaKerjaKategoriComponent } from './range-masakerja-kategori/range-masakerja-kategori.component';
import { RangeLiburHariOffLiburNasionalComponent } from './range-liburharioff-liburnasional/range-liburharioff-liburnasional.component';
import { RangeLiburHariKerjaNormalComponent } from './range-liburharikerjanormal/range-liburharikerjanormal.component';
import { ReportJumlahKeterlambatanKaryawanComponent } from './report-jumlah-keterlambatan-karyawan/report-jumlah-keterlambatan-karyawan.component';


@NgModule({
   declarations : [KelasComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelasComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelasModule {}

@NgModule({
   declarations : [JenisKeputusanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisKeputusanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisKeputusanModule {}

@NgModule({
   declarations : [StrukturNomorComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: StrukturNomorComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class StrukturNomorModule {}


@NgModule({
   declarations : [RangeComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeModule {}

@NgModule({
   declarations : [PenyebabKematianComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PenyebabKematianComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PenyebabKematianModule {}

@NgModule({
   declarations : [CaraBayarComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: CaraBayarComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class CaraBayarModule {}

@NgModule({
   declarations : [AwardOffenceComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: AwardOffenceComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class AwardOffenceModule {}

@NgModule({
   declarations : [MatauangComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MatauangComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MatauangModule {}

@NgModule({
   declarations : [LevelTingkatComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: LevelTingkatComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class LevelTingkatModule {}

@NgModule({
   declarations : [JenisTarifComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisTarifComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisTarifModule {}

@NgModule({
   declarations : [RangeWaktuPinjamanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeWaktuPinjamanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeWaktuPinjamanModule {}

@NgModule({
   declarations : [RangePinjamanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangePinjamanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangePinjamanModule {}

@NgModule({
   declarations : [RangeMasaKerjaThrComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaThrComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaThrModule {}

@NgModule({
   declarations : [RangeMasaKerjaReimbursComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaReimbursComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaReimbursModule {}

@NgModule({
   declarations : [RangeMasaKerjaPinjamanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaPinjamanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaPinjamanModule {}


@NgModule({
   declarations : [RangeMasaKerjaPhkComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaPhkComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaPhkModule {}

@NgModule({
   declarations : [RangeMasaKerjaPensiunComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaPensiunComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaPensiunModule {}

@NgModule({
   declarations : [RangeMasaKerjaCutiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaCutiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaCutiModule {}

@NgModule({
   declarations : [RangeMasaKerjaComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaModule {}


@NgModule({
   declarations : [RangeKeterlambatanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeKeterlambatanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeKeterlambatanModule {}

@NgModule({
   declarations : [RangeMasaKerjaKategoriComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeMasaKerjaKategoriComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeMasaKerjaKategoriModule {}

@NgModule({
   declarations : [RangeLiburHariOffLiburNasionalComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeLiburHariOffLiburNasionalComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeLiburHariOffLiburNasionalModule {}

@NgModule({
   declarations : [RangeLiburHariKerjaNormalComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RangeLiburHariKerjaNormalComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RangeLiburHariKerjaNormalModule {}

@NgModule({ 
	declarations : [ReportJumlahKeterlambatanKaryawanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ReportJumlahKeterlambatanKaryawanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})
export class ReportJumlahKeterlambatanKaryawanModule {}

