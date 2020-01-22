export const routeKiosk = [
    {
        path: '',
        loadChildren: './page/kiosk/kiosk.module#KioskModule',
    },

    // page Informasi
    { path: 'informasi', loadChildren: './page/kiosk/kiosk.module#InformasiModule' },
    { path: 'informasi/profile', loadChildren: './page/kiosk/kiosk.module#InfomasiProfileModule' },
    { path: 'informasi/profile/visi-misi', loadChildren: './page/kiosk/kiosk.module#VisiMisiModule' },
    { path: 'informasi/profile/tujuan', loadChildren: './page/kiosk/kiosk.module#TujuanModule' },
    { path: 'informasi/profile/sejarah', loadChildren: './page/kiosk/kiosk.module#SejarahModule' },
    { path: 'informasi/profile/direksi', loadChildren: './page/kiosk/kiosk.module#DireksiModule' },
    { path: 'informasi/profile/slogan', loadChildren: './page/kiosk/kiosk.module#SloganModule' },
    { path: 'informasi/profile/strukur-oraganisasi', loadChildren: './page/kiosk/kiosk.module#StrukturOrganisasiModule' },
    { path: 'informasi/profile/award', loadChildren: './page/kiosk/kiosk.module#PrestasiOrAwardModule' },
    { path: 'informasi/profile/contact-address', loadChildren: './page/kiosk/kiosk.module#ContactAddressModule' },
    { path: 'informasi/profile/rekanan', loadChildren: './page/kiosk/kiosk.module#RekananOrPartnerModule' },
    { path: 'informasi/profile/event', loadChildren: './page/kiosk/kiosk.module#EventAndGalleryModule' },

    // page kamar perawatan    
    { path: 'informasi/kamar-perawatan', loadChildren: './page/kiosk/kiosk.module#KamarPerawatanModule' },
    { path: 'informasi/ketersediaan-kamar', loadChildren: './page/kiosk/kiosk.module#KetersediaanKamarModule' },


    //page promosi dan kegiatan
    { path: 'informasi/promosi-kegiatan', loadChildren: './page/kiosk/kiosk.module#PromosiDanKegiatanModule' },

    { path: 'informasi/promosi-kegiatan/terbaru', loadChildren: './page/kiosk/kiosk.module#TerbaruModule' },
    { path: 'informasi/promosi-kegiatan/terbaru/:noRec', loadChildren: './page/kiosk/kiosk.module#TerbaruDetailModule', router: "kiosk-router" },
    { path: 'informasi/promosi-kegiatan/berita', loadChildren: './page/kiosk/kiosk.module#BeritaModule', router: "kiosk-router" },
    { path: 'informasi/promosi-kegiatan/promosi', loadChildren: './page/kiosk/kiosk.module#PromosiModule', router: "kiosk-router" },
    { path: 'informasi/promosi-kegiatan/penyuluhan', loadChildren: './page/kiosk/kiosk.module#PenyuluhanModule', router: "kiosk-router" },
    { path: 'informasi/promosi-kegiatan/pendidikan-dan-pelatihan', loadChildren: './page/kiosk/kiosk.module#PendidikanDanPelatihanModule', router: "kiosk-router" },


    // page pelayanan
    { path: 'informasi/pelayanan', loadChildren: './page/kiosk/kiosk.module#PelayananModule' },
    { path: 'informasi/pelayanan/prosedur-pelayanan', loadChildren: './page/kiosk/kiosk.module#ProsedurPelayananModule' },
    { path: 'informasi/pelayanan/fasilitas-layanan', loadChildren: './page/kiosk/kiosk.module#FasilitasPelayananModule' },
    { path: 'informasi/pelayanan/tarif-pelayanan', loadChildren: './page/kiosk/kiosk.module#TarifPelayananModule' },
    { path: 'informasi/pelayanan/jadwal-pelayanan', loadChildren: './page/kiosk/kiosk.module#JadwalPelayananModule' },
    { path: 'informasi/pelayanan/jadwal-dokter', loadChildren: './page/kiosk/kiosk.module#JadwalDokterModule' },



    // page pusat bantuan
    { path: 'informasi/pusat-bantuan', loadChildren: './page/kiosk/kiosk.module#PusatBantuanModule', router: "kiosk-router" },
    { path: 'informasi/faq', loadChildren: './page/kiosk/kiosk.module#FaqModule', router: "kiosk-router" },
    { path: 'informasi/survey-kepuasan', loadChildren: './page/kiosk/kiosk.module#SurveyKepuasanModule', router: "kiosk-router" },
    { path: 'informasi/pengaduan', loadChildren: './page/kiosk/kiosk.module#PengaduanModule', router: "kiosk-router" },
    { path: 'informasi/kritik-dan-saran', loadChildren: './page/kiosk/kiosk.module#KritikDanSaranModule', router: "kiosk-router" },

    //antrian
    { path: 'antrian', loadChildren: './page/kiosk/kiosk.module#AntrianModule', router: "kiosk-router" },
    { path: 'antrian/jenis-pasien', loadChildren: './page/kiosk/kiosk.module#JenisPasienModule', router: "kiosk-router" },
    { path: 'antrian/jenis-pasien-baru', loadChildren: './page/kiosk/kiosk.module#JenisPasienBaruModule', router: "kiosk-router"},
    { path: 'antrian/poli-rawat-jalan', loadChildren: './page/kiosk/kiosk.module#PoliRawatJalanModule', router: "kiosk-router"},
    { path: 'antrian/pilih-dokter', loadChildren: './page/kiosk/kiosk.module#PilihDokterModule', router: "kiosk-router"},
    { path: 'antrian/jenis-pasien-lama', loadChildren: './page/kiosk/kiosk.module#JenisPasienLamaModule', router: "kiosk-router"},

];
