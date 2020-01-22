export const routeKlinik = [
    { path: 'monitoring-antrian-registrasi', loadChildren : './page/klinik/klinik.module#MonitoringAntrianRegistrasiModule' },
    { path: 'viewer-antrian', loadChildren : './page/klinik/klinik.module#ViewerAntrianModule' },
    { path: 'registrasi-pasien-baru', loadChildren : './page/klinik/klinik.module#RegistrasiPasienBaruModule' },
    { path: 'monitoring-pasien', loadChildren : './page/klinik/klinik.module#MonitoringPasienModule' },
    { path: 'registrasi-asuransi', loadChildren : './page/klinik/klinik.module#RegistrasiAsuransiModule' },
    { path: 'monitoring-registrasi-asuransi', loadChildren : './page/klinik/klinik.module#MonitoringRegistrasiAsuransiModule' },
    { path: 'registrasi-pelayanan', loadChildren : './page/klinik/klinik.module#RegistrasiPelayananModule' },
    { path: 'monitoring-pasien-diperiksa', loadChildren : './page/klinik/klinik.module#MonitoringPasienDiPeriksaModule' },
    { path: 'viewer-pelayanan', loadChildren : './page/klinik/klinik.module#ViewerPelayananModule' },
    { path: 'masuk-ruangan', loadChildren : './page/klinik/klinik.module#MasukRuanganModule' },
    { path: 'monitoring-pasien-ruangan-dokter', loadChildren : './page/klinik/klinik.module#MonitoringPasienRuanganDokterModule' },
];