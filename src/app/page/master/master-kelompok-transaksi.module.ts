import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { KelompokTransaksiComponent } from './kelompok-transaksi/kelompok-transaksi.component';
import { KelompokTransaksiDetailComponent } from './kelompok-transaksi-detail/kelompok-transaksi-detail.component';
import { MapKelompoktransaksiKeteranganalasanComponent } from './map-kelompoktransaksi-keteranganalasan/map-kelompoktransaksi-keteranganalasan.component';
import { MapKelompoktransaksiPostingComponent } from './map-kelompoktransaksi-posting/map-kelompoktransaksi-posting.component';
import { MapKelompoktransaksiStrukturnomorComponent } from './map-kelompoktransaksi-strukturnomor/map-kelompoktransaksi-strukturnomor.component';
import { MapKelompoktransaksiJenisdokumenComponent } from './map-kelompoktransaksi-jenisdokumen/map-kelompoktransaksi-jenisdokumen.component';
import { MapKelompokStatusToStatusComponent } from './map-kelompok-status-to-status/map-kelompok-status-to-status.component';
import { MapRuanganToKasusPenyakitComponent } from './map-ruangan-to-kasus-penyakit/map-ruangan-to-kasus-penyakit.component';
import { MapKelompokTransaksiToRuanganComponent } from './map-kelompok-transaksi-to-ruangan/map-kelompok-transaksi-to-ruangan.component';
import { MapKelompoktransaksiRuanganComponent } from './map-kelompoktransaksi-ruangan/map-kelompoktransaksi-ruangan.component';
import { MapRuanganLoginToRuanganPelayananComponent } from './map-ruangan-login-to-ruangan-pelayanan/map-ruangan-login-to-ruangan-pelayanan.component';
import { MasterSettingFilterDataRegistrasiComponent } from './master-setting-filter-data-registrasi/master-setting-filter-data-registrasi.component';

@NgModule({
   declarations : [KelompokTransaksiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokTransaksiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelompokTransaksiModule {}

@NgModule({
   declarations : [KelompokTransaksiDetailComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokTransaksiDetailComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelompokTransaksiDetailModule {}

@NgModule({
   declarations : [MapKelompoktransaksiKeteranganalasanComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompoktransaksiKeteranganalasanComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompoktransaksiKeteranganalasanModule {}

@NgModule({
   declarations : [MapKelompoktransaksiPostingComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompoktransaksiPostingComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompoktransaksiPostingModule {}

@NgModule({
   declarations : [MapKelompoktransaksiStrukturnomorComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompoktransaksiStrukturnomorComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompoktransaksiStrukturnomorModule {}

@NgModule({
   declarations : [MapKelompoktransaksiJenisdokumenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompoktransaksiJenisdokumenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompoktransaksiJenisdokumenModule {}

@NgModule({
    declarations : [MapKelompokStatusToStatusComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompokStatusToStatusComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class MapKelompokStatusToStatusModule {}

 @NgModule({
   declarations : [MapRuanganToKasusPenyakitComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapRuanganToKasusPenyakitComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapRuanganToKasusPenyakitModule {}

@NgModule({
   declarations : [MapKelompoktransaksiRuanganComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapKelompoktransaksiRuanganComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapKelompoktransaksiRuanganModule {}

@NgModule({
   declarations : [MapRuanganLoginToRuanganPelayananComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapRuanganLoginToRuanganPelayananComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapRuanganLoginToRuanganPelayananModul {}

@NgModule({
   declarations : [MasterSettingFilterDataRegistrasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MasterSettingFilterDataRegistrasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MasterSettingFilterDataRegistrasiModul {}
