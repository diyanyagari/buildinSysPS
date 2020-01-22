
import * as pRedirect from './';
import { AuthGuard } from '../global';

export const routeRedirect = [
	{canActivate: [AuthGuard], path:'proses-registrasi-pegawai', component : pRedirect.RedirectProsesRegistrasiPegawaiComponent },
	{canActivate: [AuthGuard], path:'proses-penggajian', component : pRedirect.RedirectProsesPenggajianComponent }
];