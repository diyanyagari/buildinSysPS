export const routeDatabasePegawai = [
    { path: 'daftar-monitoring-database-pegawai', loadChildren : './page/database-histori-pegawai/database-pegawai.module#DaftarMonitoringDatabasePegawaiModule' },
    { path: 'data-pegawai', loadChildren : './page/database-histori-pegawai/database-pegawai.module#DataPegawaiModule' },
];