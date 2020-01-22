
export { LoginComponent } from './login/login.component';
export { SettingsComponent } from './settings/settings.component';
export { SuperUserComponent } from './super-user/super-user.component';
//export { ProfilePerusahaan } from './profile-perusahaan/profile-perusahaan.component';
export { StartProfileComponent } from './wizards/start-profile.component';
export { HandleDialogComponent } from './handle-dialog/handle-dialog.component';
export { BahasaComponent } from './bahasa/bahasa.component';


import * as pAuth from './';

export const pagesAuth = [
 	pAuth.LoginComponent,
 	pAuth.StartProfileComponent,
 	pAuth.HandleDialogComponent,
 	pAuth.SettingsComponent,
	pAuth.SuperUserComponent,
	pAuth.BahasaComponent 
];
