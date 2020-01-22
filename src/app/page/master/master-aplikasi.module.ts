import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { ModulAplikasiComponent } from './modul-aplikasi/modul-aplikasi.component';
import { TypeDataObjectComponent } from './type-data-object/type-data-object.component';
import { ObjekModulAplikasiComponent } from './objek-modul-aplikasi/objek-modul-aplikasi.component';
import { MapObjekModulToKelompokUserComponent } from './map-objek-modul-to-kelompok-user/map-objek-modul-to-kelompok-user.component';
import { MessagingComponent } from './messaging/messaging.component'
import { LoginUserComponent } from './login-user/login-user.component';
import { HistoriLoginUserComponent } from './histori-login-user/histori-login-user.component';
import { MapObjekModulToModulAplikasiComponent } from './map-objek-modul-to-modul-aplikasi/map-objek-modul-to-modul-aplikasi.component';
import { SettingDataFixedComponent } from './settingdatafixed/settingdatafixed.component';
import { KelompokUserComponent } from './kelompok-user/kelompok-user.component';
import { MapModulAplikasiToObjekModulAplikasiComponent } from './map-modul-aplikasi-to-objek-modul-aplikasi/map-modul-aplikasi-to-objek-modul-aplikasi.component';
import { MapBahasaToNegaraComponent } from './map-bahasa-to-negara/map-bahasa-to-negara.component';


@NgModule({
   declarations : [SettingDataFixedComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: SettingDataFixedComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class SettingDataFixedModule {}

@NgModule({
   declarations : [LoginUserComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: LoginUserComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class LoginUserModule {}

@NgModule({
   declarations : [ModulAplikasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ModulAplikasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ModulAplikasiModule {}

@NgModule({
   declarations : [TypeDataObjectComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: TypeDataObjectComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class TypeDataObjectModule {}

@NgModule({
   declarations : [ObjekModulAplikasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ObjekModulAplikasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ObjekModulAplikasiModule {}

@NgModule({
   declarations : [MapObjekModulToKelompokUserComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapObjekModulToKelompokUserComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapObjekModulToKelompokUserModule {}

@NgModule({
   declarations : [MapObjekModulToModulAplikasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapObjekModulToModulAplikasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapObjekModulToModulAplikasiModule {}

@NgModule({
   declarations : [MessagingComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MessagingComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MessagingModule {}

@NgModule({
   declarations : [HistoriLoginUserComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: HistoriLoginUserComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class HistoriLoginUserModule {}

@NgModule({
    declarations : [KelompokUserComponent],
    imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: KelompokUserComponent} ]), SharedModule.forRoot()],
    exports: [ RouterModule ]
 })
 export class KelompokUserModule {}

 @NgModule({
   declarations : [MapModulAplikasiToObjekModulAplikasiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapModulAplikasiToObjekModulAplikasiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapModulAplikasiToObjekModulAplikasiModule {}

@NgModule({
   declarations : [MapBahasaToNegaraComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: MapBahasaToNegaraComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class MapBahasaToNegaraModule {}
