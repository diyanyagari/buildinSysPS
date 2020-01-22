import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { JenisDokumenComponent } from './jenisdokumen/jenisdokumen.component';
import { KategoriDokumenComponent } from './kategori-dokumen/kategori-dokumen.component';
import { DokumenComponent } from './dokumen/dokumen.component';

@NgModule({
   declarations : [JenisDokumenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: JenisDokumenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class JenisDokumenModule {}

@NgModule({
   declarations : [KategoriDokumenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KategoriDokumenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class KategoriDokumenModule {}

@NgModule({
   declarations : [DokumenComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: DokumenComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class DokumenModule {}
