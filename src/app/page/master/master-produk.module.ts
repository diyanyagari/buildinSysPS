import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { KelompokProdukComponent } from './kelompok-produk/kelompok-produk.component';
import { JenisProdukComponent } from './jenis-produk/jenis-produk.component';
import { DetailJenisProdukComponent } from './detail-jenis-produk/detail-jenis-produk.component';
import { ProdukComponent } from './produk/produk.component';
import { MerkProdukComponent } from './merk-produk/merk-produk.component';
import { TypeProdukComponent } from './type-produk/type-produk.component';
import { KondisiProdukComponent } from './kondisi-produk/kondisi-produk.component';
import { ProdusenProdukComponent } from './produsen-produk/produsen-produk.component';
import { BahanProdukComponent } from './bahan-produk/bahan-produk.component';
import { WarnaProdukComponent } from './warna-produk/warna-produk.component';
import { HargaNettoProdukBykelasComponent } from './harga-netto-produk-bykelas/harga-netto-produk-bykelas.component';
import { MapEventToProdukComponent } from './map-event-to-produk/map-event-to-produk.component';

@NgModule({
   declarations : [KelompokProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KelompokProdukModule {}

@NgModule({
   declarations : [JenisProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisProdukModule {}

@NgModule({
   declarations : [DetailJenisProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: DetailJenisProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class DetailJenisProdukModule {}

@NgModule({
   declarations : [ProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProdukModule {}

@NgModule({
   declarations : [MerkProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MerkProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MerkProdukModule {}

@NgModule({
   declarations : [TypeProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: TypeProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class TypeProdukModule {}

@NgModule({
   declarations : [KondisiProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KondisiProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KondisiProdukModule {}

@NgModule({
   declarations : [ProdusenProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProdusenProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProdusenProdukModule {}

@NgModule({
   declarations : [BahanProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: BahanProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class BahanProdukModule {}

@NgModule({
   declarations : [WarnaProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: WarnaProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class WarnaProdukModule {}

@NgModule({
   declarations : [HargaNettoProdukBykelasComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HargaNettoProdukBykelasComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HargaNettoProdukBykelasModule {}

@NgModule({
   declarations : [MapEventToProdukComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapEventToProdukComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapEventToProdukModule {}
