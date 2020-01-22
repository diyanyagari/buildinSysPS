export const routeBsc = [
    { path: 'daftar-monitoring-pengajuan-kpi-pegawai', loadChildren: './page/bsc/page-bsc.module#DaftarMonitoringPengajuanKpiPegawaiModule'},
    { path: 'pengajuan-realisasi-kpi-pegawai', loadChildren: './page/bsc/page-bsc.module#PengajuanRealisasiKpiPegawaiModule'},
    { path: 'daftar-monitoring-pengajuan-realisasi-kpi-pegawai', loadChildren: './page/bsc/page-bsc.module#DaftarMonitoringPengajuanRealisasiKpiPegawaiModule'},
    { path: 'rekapitulasi-skor-akhir-kpi', loadChildren: './page/bsc/page-bsc.module#RekapitulasiSkorAkhirKpiComponentModule'},
];