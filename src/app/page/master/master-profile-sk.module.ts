import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';
import { ProfileSKAsuransiComponent } from './profile-sk-asuransi/profile-sk-asuransi.component';
import { ProfileSkKomponenGajiComponent } from './profile-sk-komponen-gaji/profile-sk-komponen-gaji.component';
import { ProfileSkHargaPoinComponent } from './profile-sk-harga-poin/profile-sk-harga-poin.component';


@NgModule({
   declarations : [ProfileSkHargaPoinComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileSkHargaPoinComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileSkHargaPoinModule {}

@NgModule({
   declarations : [ProfileSkKomponenGajiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileSkKomponenGajiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileSkKomponenGajiModule {}

@NgModule({
   declarations : [ProfileSKAsuransiComponent],
   imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'',component: ProfileSKAsuransiComponent} ]), SharedModule.forRoot()],
   exports: [ RouterModule ]
})
export class ProfileSKAsuransiModule {}
