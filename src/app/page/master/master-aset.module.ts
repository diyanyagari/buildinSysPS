import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { JenisAsetComponent } from './jenis-aset/jenis-aset.component';
import { KategoriAsetComponent } from './kategori-aset/kategori-aset.component';
import { kelompokasetComponent } from './kelompok-aset/kelompok-aset.component';
import { MetodeDeliveryComponent } from './metode-delivery/metode-delivery.component';
import { SatuanStandarComponent } from './satuan-standar/satuan-standar.component';
import { TransmisiComponent } from './transmisi/transmisi.component';
import { RegistrasiAsetComponent } from './registrasiaset/registrasiaset.component';
import { AlatComponent } from './alat/alat.component';
import { PrinterComponent } from './printer/printer.component';
import { PaketComponent } from './paket/paket.component';
import { JenisTransaksiComponent } from './jenis-transaksi/jenis-transaksi.component';

import { MasterAsetFasilitasComponent } from './master-aset-fasilitas/master-aset-fasilitas.component';
import { PegawaiSkFasilitasNewComponent } from './pegawai-sk-fasilitas-new/pegawai-sk-fasilitas-new.component';


@NgModule({
   declarations : [SatuanStandarComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SatuanStandarComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SatuanStandarModule {}

@NgModule({
   declarations : [JenisAsetComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisAsetComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisAsetModule {}

@NgModule({
   declarations : [KategoriAsetComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KategoriAsetComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KategoriAsetModule {}

@NgModule({
   declarations : [kelompokasetComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: kelompokasetComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class kelompokasetModule {}

@NgModule({
   declarations : [MetodeDeliveryComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MetodeDeliveryComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MetodeDeliveryModule {}

@NgModule({
   declarations : [TransmisiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: TransmisiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class TransmisiModule {}

@NgModule({
   declarations : [RegistrasiAsetComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: RegistrasiAsetComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class RegistrasiAsetModule {}

@NgModule({
   declarations : [AlatComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: AlatComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class AlatModule {}

@NgModule({
   declarations : [PrinterComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PrinterComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PrinterModule {}

@NgModule({
   declarations : [PaketComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PaketComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PaketModule {}

@NgModule({
   declarations : [JenisTransaksiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisTransaksiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisTransaksiModule {}

@NgModule({
   declarations : [MasterAsetFasilitasComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MasterAsetFasilitasComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MasterAsetFasilitasModule {}

@NgModule({
   declarations : [PegawaiSkFasilitasNewComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: PegawaiSkFasilitasNewComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class PegawaiSkFasilitasNewModule {}




