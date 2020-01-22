import { SharedModule }  from '../../shared.module';
import { GridsterModule } from '../../lib';

//import { NgDraggableWidgetModule } from 'ngx-draggable-widget';
//import { DragulaModule } from 'ng2-dragula';
//import { AngularDraggableModule } from 'angular2-draggable';

import {
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule, 
  MatSidenavModule
} from '@angular/material';

export const DashboardModImport = [
  GridsterModule,
//  NgDraggableWidgetModule,
//  AngularDraggableModule,
//  DragulaModule,
  MatIconModule, 
  MatButtonModule, 
  MatSelectModule, 
  MatInputModule, 
  MatTooltipModule, 
  MatCheckboxModule, 
  MatSidenavModule, 
  SharedModule
];
export { PencarianComponent } from './pencarian/pencarian.component'
export { MainDashboard } from './main/main-dashboard.component';
export { WidgetJumlahPegawaiComponent } from './widgets/jumlah-pegawai/jumlah-pegawai.component';
export { WidgetAkumulasiCutiComponent } from './widgets/akumulasi-cuti/akumulasi-cuti.component';
export { WidgetKontakPegawaiComponent } from './widgets/kontak-pegawai/kontak-pegawai.component';
export { WidgetGajiPegawaiComponent } from './widgets/gaji-pegawai/gaji-pegawai.component';
export { WidgetAsetRuanganComponent } from './widgets/aset-ruangan/aset-ruangan.component';
export { WidgetPengajuanComponent } from './widgets/pengajuan/pengajuan.component';
export { WidgetPersentasiAbsensiComponent } from './widgets/persentasi-absensi/persentasi-absensi.component';
export { WidgetPersentasiJabatanComponent } from './widgets/persentasi-jabatan/persentasi-jabatan.component';
export { WidgetSisaPinjamanPegawaiComponent } from './widgets/sisa-pinjaman-pegawai/sisa-pinjaman-pegawai.component';
export { WidgetPersentasiPengajuanComponent } from './widgets/persentasi-pengajuan/persentasi-pengajuan.component';
export { WidgetPersentasiAsetComponent } from './widgets/persentasi-aset/persentasi-aset.component';
export { WidgetPegawaiUsiaPensiunComponent } from './widgets/pegawai-usia-pensiun/pegawai-usia-pensiun.component';
export { WidgetPegawaiHabisKontrakComponent } from './widgets/pegawai-habis-kontrak/pegawai-habis-kontrak.component';
export { WidgetPegawaiUlangTahunComponent } from './widgets/pegawai-ulang-tahun/pegawai-ulang-tahun.component';
export { WidgetPersentasiPegawaiPensiunComponent } from './widgets/persentasi-pegawai-pensiun/persentasi-pegawai-pensiun.component';
export { WidgetPersentasiPegawaiResignComponent } from './widgets/persentasi-pegawai-resign/persentasi-pegawai-resign.component';
export { WidgetPersentasiStrukturKolegaComponent } from './widgets/persentasi-struktur-kolega/persentasi-struktur-kolega.component';
export { WidgetPersentasiJumlahPegawaiComponent } from './widgets/persentasi-jumlah-pegawai/persentasi-jumlah-pegawai.component';