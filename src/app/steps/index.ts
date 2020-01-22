//import * as redirect from './redirect.module';
export { RedirectProsesRegistrasiPegawaiComponent } from './redirect-proses-registrasi-pegawai/redirect-proses-registrasi-pegawai.component'
export { RedirectProsesPenggajianComponent  } from './redirect-proses-penggajian/redirect-proses-penggajian.component'

import * as steps from './step.module';

import * as redirect from './';

export const StepsModule = [
	steps.ProsesRegistrasiPegawaiModule,
	steps.ProsesPenggajianModule,
]; 

export const pageRedirect = [
	redirect.RedirectProsesRegistrasiPegawaiComponent,
	redirect.RedirectProsesPenggajianComponent,
]; 

// export const RedirectModule = [
// 	redirect.RedirectProsesRegistrasiPegawaiModule,
// 	redirect.RedirectProsesPenggajianModule,
// ]; 