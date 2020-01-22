import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { KioskHomeComponent } from './kiosk-home.component';
import { InformasiComponent } from './informasi/informasi.component';
import { InformasiProfileComponent } from './informasi/informasi-profile/informasi-profile.component';
import { VisiMisiComponent } from './informasi/informasi-profile/visi-misi/visi-misi.component';
import { TujuanComponent } from './informasi/informasi-profile/tujuan/tujuan.component';
import { SejarahComponent } from './informasi/informasi-profile/sejarah/sejarah.component';
import { DireksiComponent } from './informasi/informasi-profile/direksi/direksi.component';
import { SloganComponent } from './informasi/informasi-profile/slogan/slogan.component';
import { StrukturOrganisasiComponent } from './informasi/informasi-profile/struktur-organisasi/struktur-organisasi.component';
import { EventAndGalleryComponent } from './informasi/informasi-profile/event-and-gallery/event-and-gallery.component';
import { RekananOrPartnerComponent } from './informasi/informasi-profile/rekanan-or-partner/rekanan-or-partner.component';
import { PrestasiOrAwardComponent } from './informasi/informasi-profile/prestasi-or-award/prestasi-or-award.component';
import { ContactAddressComponent } from './informasi/informasi-profile/contact-address/contact-address.component';
import { KamarPerawatanComponent } from './informasi/kamar-perawatan/kamar-perawatan.component';
import { KetersediaanKamarComponent } from './informasi/kamar-perawatan/ketersediaan-kamar/ketersediaan-kamar.component';
import { PromosiDanKegiatanComponent } from './informasi/promosi-dan-kegiatan/promosi-dan-kegiatan.component';
import { TerbaruComponent } from './informasi/promosi-dan-kegiatan/terbaru/terbaru.component';
import { BeritaComponent } from './informasi/promosi-dan-kegiatan/berita/berita.component';
import { PromosiComponent } from './informasi/promosi-dan-kegiatan/promosi/promosi.component';
import { PenyuluhanComponent } from './informasi/promosi-dan-kegiatan/penyuluhan/penyuluhan.component';
import { PendidikanDanPelatihanComponent } from './informasi/promosi-dan-kegiatan/pendidikan-dan-pelatihan/pendidikan-dan-pelatihan.component';
import { TerbaruDetailComponent } from './informasi/promosi-dan-kegiatan/terbaru-detail/terbaru-detail.component';

// page Pelayanan
import { InformasiPelayananComponent } from './informasi/informasi-pelayanan/informasi-pelayanan.component';
import { ProsedurPelayananComponent } from './informasi/informasi-pelayanan/prosedur-pelayanan/prosedur-pelayanan.component';
import { FasilitasPelayananComponent } from './informasi/informasi-pelayanan/fasilitas-pelayanan/fasilitas-pelayanan.component';
import { TarifPelayananComponent } from './informasi/informasi-pelayanan/tarif-pelayanan/tarif-pelayanan.component';
import { JadwalPelayananComponent } from './informasi/informasi-pelayanan/jadwal-pelayanan/jadwal-pelayanan.component';
import { JadwalDokterComponent } from './informasi/informasi-pelayanan/jadwal-dokter/jadwal-dokter.component';
import { PusatBantuanComponent } from './informasi/pusat-bantuan/pusat-bantuan.component';
import { FaqComponent } from './informasi/pusat-bantuan/faq/faq.component';
import { SurveyKepuasanComponent } from './informasi/pusat-bantuan/survey-kepuasan/survey-kepuasan.component';
import { PengaduanComponent } from './informasi/pusat-bantuan/pengaduan/pengaduan.component';
import { KritikDanSaranComponent } from './informasi/pusat-bantuan/kritik-dan-saran/kritik-dan-saran.component';


//antrian
import { AntrianComponent } from './antrian/antrian.component';
import { JenisPasienComponent } from './jenis-pasien/jenis-pasien.component';
import { JenisPasienBaruComponent } from './jenis-pasien-baru/jenis-pasien-baru.component';
import { PoliRawatJalanComponent } from './poli-rawat-jalan/poli-rawat-jalan.component';
import { PilihDokterComponent } from './pilih-dokter/pilih-dokter.component';
import { JenisPasienLamaComponent } from './jenis-pasien-lama/jenis-pasien-lama.component';


@NgModule({
	declarations : [KioskHomeComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: KioskHomeComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class KioskModule { }

@NgModule({
	declarations : [InformasiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: InformasiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class InformasiModule { }

@NgModule({
	declarations : [InformasiProfileComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: InformasiProfileComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class InfomasiProfileModule { }

@NgModule({
	declarations : [VisiMisiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: VisiMisiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class VisiMisiModule { }

@NgModule({
	declarations : [TujuanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: TujuanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class TujuanModule { }


@NgModule({
	declarations : [SejarahComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: SejarahComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class SejarahModule { }

@NgModule({
	declarations : [DireksiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: DireksiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class DireksiModule { }

@NgModule({
	declarations : [SloganComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: SloganComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class SloganModule { }

@NgModule({
	declarations : [StrukturOrganisasiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: StrukturOrganisasiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class StrukturOrganisasiModule { }

@NgModule({
	declarations : [EventAndGalleryComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: EventAndGalleryComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class EventAndGalleryModule { }

@NgModule({
	declarations : [RekananOrPartnerComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: RekananOrPartnerComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class RekananOrPartnerModule { }

@NgModule({
	declarations : [PrestasiOrAwardComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PrestasiOrAwardComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PrestasiOrAwardModule { }

@NgModule({
	declarations : [ContactAddressComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: ContactAddressComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class ContactAddressModule { }

@NgModule({
	declarations : [KamarPerawatanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: KamarPerawatanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class KamarPerawatanModule { }

@NgModule({
	declarations : [KetersediaanKamarComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: KetersediaanKamarComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class KetersediaanKamarModule { }

@NgModule({
	declarations : [PromosiDanKegiatanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PromosiDanKegiatanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PromosiDanKegiatanModule { }

@NgModule({
	declarations : [TerbaruComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: TerbaruComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class TerbaruModule { }

@NgModule({
	declarations : [TerbaruDetailComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: TerbaruDetailComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})


export class TerbaruDetailModule { }

@NgModule({
	declarations : [BeritaComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: BeritaComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class BeritaModule { }

@NgModule({
	declarations : [PromosiComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PromosiComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PromosiModule { }

@NgModule({
	declarations : [PenyuluhanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PenyuluhanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PenyuluhanModule { }

@NgModule({
	declarations : [PendidikanDanPelatihanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PendidikanDanPelatihanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PendidikanDanPelatihanModule { }

@NgModule({
	declarations : [InformasiPelayananComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: InformasiPelayananComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PelayananModule { }

@NgModule({
	declarations : [ProsedurPelayananComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: ProsedurPelayananComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class ProsedurPelayananModule { }

@NgModule({
	declarations : [FasilitasPelayananComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: FasilitasPelayananComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class FasilitasPelayananModule { }

@NgModule({
	declarations : [TarifPelayananComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: TarifPelayananComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class TarifPelayananModule { }

@NgModule({
	declarations : [JadwalPelayananComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: JadwalPelayananComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class JadwalPelayananModule { }

@NgModule({
	declarations : [JadwalDokterComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: JadwalDokterComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class JadwalDokterModule { }

@NgModule({
	declarations : [PusatBantuanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PusatBantuanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PusatBantuanModule { }

@NgModule({
	declarations : [FaqComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: FaqComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class FaqModule { }

@NgModule({
	declarations : [SurveyKepuasanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: SurveyKepuasanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class SurveyKepuasanModule { }

@NgModule({
	declarations : [PengaduanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PengaduanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PengaduanModule { }

@NgModule({
	declarations : [KritikDanSaranComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: KritikDanSaranComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class KritikDanSaranModule { }

@NgModule({
	declarations : [AntrianComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: AntrianComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class AntrianModule { }

@NgModule({
	declarations : [JenisPasienComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: JenisPasienComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class JenisPasienModule { }

@NgModule({
	declarations : [JenisPasienBaruComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: JenisPasienBaruComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class JenisPasienBaruModule { }

@NgModule({
	declarations : [PoliRawatJalanComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PoliRawatJalanComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PoliRawatJalanModule { }

@NgModule({
	declarations : [PilihDokterComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: PilihDokterComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class PilihDokterModule { }

@NgModule({
	declarations : [JenisPasienLamaComponent],
	imports: [ RouterModule.forChild([ {canActivate: [AuthGuard], path:'', component: JenisPasienLamaComponent} ]), SharedModule.forRoot()],
	exports: [ RouterModule ]
})

export class JenisPasienLamaModule { }

