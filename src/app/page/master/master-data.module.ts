import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { AuthGuard } from '../../global';

import { AlergiComponent } from './alergi/alergi.component';
import { AsKepIntervensiComponent } from './askepintervensi/askepintervensi.component';
import { AsKepJenisKajianComponent } from './askepjeniskajian/askepjeniskajian.component';
import { AsKepKategoryKajianComponent } from './askepkategorykajian/askepkategorykajian.component';
import { AsKepKajianComponent } from './askepkajian/askepkajian.component';
import { AsKepRasionalIComponent } from './askeprasionali/askeprasionali.component';
import { AsKepTujuanComponent } from './askeptujuan/askeptujuan.component';
import { BentukComponent } from './bentuk/bentuk.component';
import { CaraLahirBayiComponent } from './caralahirbayi/caralahirbayi.component';
import { CaraMasukComponent } from './caramasuk/caramasuk.component';
import { JenisAccountComponent } from './jenisaccount/jenisaccount.component';
import { KategoryAccountComponent } from './kategoryaccount/kategoryaccount.component';
import { ChartOfAccountComponent } from './chartofaccount/chartofaccount.component';
import { DesignComponent } from './design/design.component';
import { KategoryDiagnosaComponent } from './kategorydiagnosa/kategorydiagnosa.component';
import { DiagnosaComponent } from './diagnosa/diagnosa.component';
import { DiagnosaKeperawatanComponent } from './diagnosakeperawatan/diagnosakeperawatan.component';
import { DiagnosaTindakanComponent } from './diagnosatindakan/diagnosatindakan.component';
import { FreqAskQuestionsComponent } from './freqaskquestions/freqaskquestions.component';
import { EdisiComponent } from './edisi/edisi.component';
import { EselonFormComponent } from './eselon-form/eselon-form.component';
import { DetailGolonganProdukComponent } from './detailgolonganproduk/detailgolonganproduk.component';
import { GeneralKelompokProdukComponent } from './generalkelompokproduk/generalkelompokproduk.component';
import { GeneralJenisProdukComponent } from './generaljenisproduk/generaljenisproduk.component';
import { GeneralProdukComponent } from './generalproduk/generalproduk.component';
import { FungsiComponent } from './fungsi/fungsi.component';
import { GolonganProdukComponent } from './golonganproduk/golonganproduk.component';
import { ImunisasiComponent } from './imunisasi/imunisasi.component';
import { IndikatorAccountComponent } from './indikatoraccount/indikatoraccount.component';
import { HargaNettoDiscPasienPulangComponent } from './harganettodiscpasienpulang/harganettodiscpasienpulang.component';
import { HargaPaketModulAplikasiComponent } from './hargapaketmodulaplikasi/hargapaketmodulaplikasi.component';
import { KelompokKlienComponent } from './kelompokklien/kelompokklien.component';
import { VersionComponent } from './version/version.component';
import { JenisDiagnosaComponent } from './jenis-diagnosa/jenis-diagnosa.component';
import { JenisInfeksiNosokomialComponent } from './jenis-infeksi-nosokomial/jenis-infeksi-nosokomial.component';
import { JenisDietComponent } from './jenis-diet/jenis-diet.component';
import { JenisKartuComponent } from './jeniskartu/jeniskartu.component';
import { JenisKemasanComponent } from './jeniskemasan/jeniskemasan.component';
import { MapFakultasToProgramComponent } from './map-fakultas-to-program/map-fakultas-to-program.component';
import { MapFakultasProgramJurusanComponent } from './map-fakultas-program-jurusan/map-fakultas-program-jurusan.component';
import { JenisAnggaranComponent } from './jenis-anggaran/jenis-anggaran.component';
import { InfeksiNosokomialComponent } from './infeksi-nosokomial/infeksi-nosokomial.component';
import { FasilitasComponent } from './fasilitas/fasilitas.component';
import { MapRuanganJurusanComponent } from './map-ruangan-jurusan/map-ruangan-jurusan.component';
import { ProgramComponent } from './program/program.component';
import { MapFasilitasRuanganComponent } from './map-fasilitas-ruangan/map-fasilitas-ruangan.component';
import { JenisJurnalComponent } from './jenis-jurnal/jenis-jurnal.component';
import { MasterNewDokumenComponent } from './master-new-dokumen/master-new-dokumen.component';
import { KasusPenyakitComponent } from './kasus-penyakit/kasus-penyakit.component';
import { PelayananProfileComponent } from './pelayanan-profile/pelayanan-profile.component';
import { ManualHelpComponent } from './manual-help/manual-help.component';
import { InputBeritaComponent } from './input-berita/input-berita.component';
import { ProfileHistoryEventComponent } from './profilehistory-event/profilehistory-event.component';
import { LoginUserConfigSSComponent } from './login-userconfigss/login-userconfigss.component';
import { MasterTitlePasienComponent } from './master-title-pasien/master-title-pasien.component';
import { KelompokUmurComponent } from './kelompok-umur/kelompok-umur.component';
import { MasterTitleComponent } from './master-title/master-title.component';
import { MapTitleToStatusPerkawinanComponent } from './map-title-to-status-perkawinan/map-title-to-status-perkawinan.component';
import { MasterVisiComponent } from './master-visi/master-visi.component';
import { MasterMisiComponent } from './master-misi/master-misi.component';
import { SejarahProfileComponent } from './sejarah-profile/sejarah-profile.component';
import { HistoriTujuanComponent } from './histori-tujuan/histori-tujuan.component';
import { DesignConfigurationComponent } from './design-configuration/design-configuration.component';
import { ModulAplikasiHelpComponent } from './modul-aplikasi-help/modul-aplikasi-help.component';
import { ModulAplikasiHistoriComponent } from './modul-aplikasi-histori/modul-aplikasi-histori.component';
import { KelompokPenyebabDiagnosaComponent } from './kelompok-penyebab-diagnosa/kelompok-penyebab-diagnosa.component';
import { PenyebabInfeksiNosokomialComponent } from './penyebab-infeksi-nosokomial/penyebab-infeksi-nosokomial.component';
import { PenyebabDiagnosaComponent } from './penyebab-diagnosa/penyebab-diagnosa.component';
import { MekanismeInteraksiProdukComponent } from './mekanisme-interaksi-produk/mekanisme-interaksi-produk.component';
import { MasterTypeComponent } from './master-type/master-type.component';
import { HargaPaketPenjaminComponent } from './harga-paket-penjamin/harga-paket-penjamin.component';
import { HargaPaketPelayananComponent } from './harga-paket-pelayanan/harga-paket-pelayanan.component';
import { JenisKomponenComponent } from './jenis-komponen/jenis-komponen.component';
import { JenisKontakComponent } from './jenis-kontak/jenis-kontak.component';
import { JenisKlaimComponent } from './jenis-klaim/jenis-klaim.component';
import { InteraksiProdukComponent } from './interaksi-produk/interaksi-produk.component';
import { MasterRekananComponent } from './master-rekanan/master-rekanan.component';
import { VisiMisiPerusahaanComponent } from './visi-misi-perusahaan/visi-misi-perusahaan.component';
import { MasterProsedurPelayananComponent } from './master-prosedur-pelayanan/master-prosedur-pelayanan.component';
import { LanguageManagerComponent } from './language-manager/language-manager.component';
import { MapRuanganToKelasComponent } from './map-ruangan-to-kelas/map-ruangan-to-kelas.component';
import { FasilitasDetailComponent } from './fasilitas-detail/fasilitas-detail.component';
import { FasilitasBedComponent } from './fasilitas-bed/fasilitas-bed.component';
import { JadwalDokterComponent } from './jadwal-dokter/jadwal-dokter.component';

import { ModulAplikasiLanguageComponent } from './modul-aplikasi-language/modul-aplikasi-language.component';
import { ProfileKonfigurasiDesignComponent } from './profile-konfigurasi-design/profile-konfigurasi-design.component';
import { JenisResponComponent } from './master-jenis-respon/master-jenis-respon.component';
import { MonitoringCustomerCareComponent } from './monitoring-customer-care/monitoring-customer-care.component';
import { MonitoringUserBaruComponent } from './monitoring-userbaru/monitoring-userbaru.component';
import { MonitoringSubscribeComponent } from './monitoring-subscribe/monitoring-subscribe.component';
import { MapPaketModulAplikasiToObjekModulComponent } from './map-paket-modul-aplikasi-to-objek-modul/map-paket-modul-aplikasi-to-objek-modul.component';
import { BlogComponent } from './master-blog/master-blog.component';
import { MapPaketModulAplikasiToProdukComponent } from './map-paket-modul-aplikasi-to-produk/map-paket-modul-aplikasi-to-produk.component';
import { MasterAkunBank } from './master-akun-bank/master-akun-bank.component';
import { MasterDiskonComponent } from './master-diskon/master-diskon.component';

@NgModule({
   declarations: [LoginUserConfigSSComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: LoginUserConfigSSComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class LoginUserConfigSSModule { }

@NgModule({
   declarations: [ProfileHistoryEventComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ProfileHistoryEventComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ProfileHistoryEventModule { }

@NgModule({
   declarations: [FasilitasComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: FasilitasComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class FasilitasModule { }

@NgModule({
   declarations: [JenisKemasanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisKemasanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisKemasanModule { }
@NgModule({
   declarations: [JenisKartuComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisKartuComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisKartuModule { }
@NgModule({
   declarations: [VersionComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: VersionComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class VersionModule { }

@NgModule({
   declarations: [HargaPaketModulAplikasiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: HargaPaketModulAplikasiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class HargaPaketModulAplikasiModule { }

@NgModule({
   declarations: [IndikatorAccountComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: IndikatorAccountComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class IndikatorAccountModule { }

@NgModule({
   declarations: [HargaNettoDiscPasienPulangComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: HargaNettoDiscPasienPulangComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class HargaNettoDiscPasienPulangModule { }

@NgModule({
   declarations: [ImunisasiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ImunisasiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ImunisasiModule { }

@NgModule({
   declarations: [KelompokKlienComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: KelompokKlienComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class KelompokKlienModule { }

@NgModule({
   declarations: [GolonganProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: GolonganProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class GolonganProdukModule { }
@NgModule({
   declarations: [FungsiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: FungsiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class FungsiModule { }
@NgModule({
   declarations: [GeneralProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: GeneralProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class GeneralProdukModule { }
@NgModule({
   declarations: [GeneralJenisProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: GeneralJenisProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class GeneralJenisProdukModule { }
@NgModule({
   declarations: [GeneralKelompokProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: GeneralKelompokProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class GeneralKelompokProdukModule { }


@NgModule({
   declarations: [DetailGolonganProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DetailGolonganProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DetailGolonganProdukModule { }

@NgModule({
   declarations: [EselonFormComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: EselonFormComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class EselonModule { }

@NgModule({
   declarations: [EdisiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: EdisiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class EdisiModule { }

@NgModule({
   declarations: [AlergiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AlergiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AlergiModule { }

@NgModule({
   declarations: [AsKepIntervensiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AsKepIntervensiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AsKepIntervensiModule { }


@NgModule({
   declarations: [AsKepJenisKajianComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AsKepJenisKajianComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AsKepJenisKajianModule { }

@NgModule({
   declarations: [AsKepKategoryKajianComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AsKepKategoryKajianComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AsKepKategoryKajianModule { }

@NgModule({
   declarations: [AsKepKajianComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AsKepKajianComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AsKepKajianModule { }

@NgModule({
   declarations: [AsKepRasionalIComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AsKepRasionalIComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AsKepRasionalIModule { }

@NgModule({
   declarations: [AsKepTujuanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: AsKepTujuanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class AsKepTujuanModule { }

@NgModule({
   declarations: [BentukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: BentukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class BentukModule { }

@NgModule({
   declarations: [CaraLahirBayiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: CaraLahirBayiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class CaraLahirBayiModule { }

@NgModule({
   declarations: [CaraMasukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: CaraMasukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class CaraMasukModule { }

@NgModule({
   declarations: [JenisAccountComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisAccountComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisAccountModule { }

@NgModule({
   declarations: [KategoryAccountComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: KategoryAccountComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class KategoryAccountModule { }

@NgModule({
   declarations: [ChartOfAccountComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ChartOfAccountComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ChartOfAccountModule { }

@NgModule({
   declarations: [DesignComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DesignComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DesignModule { }

@NgModule({
   declarations: [KategoryDiagnosaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: KategoryDiagnosaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class KategoryDiagnosaModule { }

@NgModule({
   declarations: [MapRuanganJurusanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapRuanganJurusanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapRuanganJurusanModule { }

@NgModule({
   declarations: [DiagnosaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DiagnosaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DiagnosaModule { }

@NgModule({
   declarations: [DiagnosaKeperawatanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DiagnosaKeperawatanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DiagnosaKeperawatanModule { }

@NgModule({
   declarations: [ProgramComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ProgramComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ProgramModule { }

@NgModule({
   declarations: [DiagnosaTindakanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DiagnosaTindakanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DiagnosaTindakanModule { }

@NgModule({
   declarations: [FreqAskQuestionsComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: FreqAskQuestionsComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class FreqAskQuestionsModule { }

@NgModule({
   declarations: [MapFakultasToProgramComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapFakultasToProgramComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapFakultasToProgramModule { }

@NgModule({
   declarations: [JenisAnggaranComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisAnggaranComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisAnggaranModule { }

@NgModule({
   declarations: [InfeksiNosokomialComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: InfeksiNosokomialComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class InfeksiNosokomialModule { }

@NgModule({
   declarations: [MapFasilitasRuanganComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapFasilitasRuanganComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapFasilitasRuanganModule { }

@NgModule({
   declarations: [JenisInfeksiNosokomialComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisInfeksiNosokomialComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisInfeksiNosokomialModule { }

@NgModule({
   declarations: [JenisDiagnosaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisDiagnosaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisDiagnosaModule { }

@NgModule({
   declarations: [JenisDietComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisDietComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisDietModule { }

@NgModule({
   declarations: [JenisJurnalComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisJurnalComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisJurnalModule { }

@NgModule({
   declarations: [MasterNewDokumenComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterNewDokumenComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterNewDokumenModule { }

@NgModule({
   declarations: [MapFakultasProgramJurusanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapFakultasProgramJurusanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapFakultasProgramJurusanModule { }

@NgModule({
   declarations: [KasusPenyakitComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: KasusPenyakitComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class KasusPenyakitModule { }

@NgModule({
   declarations: [PelayananProfileComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: PelayananProfileComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PelayananProfileModule { }

@NgModule({
   declarations: [ManualHelpComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ManualHelpComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ManualHelpModule { }

@NgModule({
   declarations: [InputBeritaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: InputBeritaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class InputBeritaModule { }

@NgModule({
   declarations: [DesignConfigurationComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: DesignConfigurationComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class DesignConfigurationModule { }

@NgModule({
   declarations: [ModulAplikasiHelpComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ModulAplikasiHelpComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ModulAplikasiHelpModule { }

@NgModule({
   declarations: [ModulAplikasiHistoriComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ModulAplikasiHistoriComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ModulAplikasiHistoriModule { }

@NgModule({
   declarations: [KelompokPenyebabDiagnosaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: KelompokPenyebabDiagnosaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class KelompokPenyebabDiagnosaModule { }

@NgModule({
   declarations: [PenyebabInfeksiNosokomialComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: PenyebabInfeksiNosokomialComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PenyebabInfeksiNosokomialModule { }

@NgModule({
   declarations: [PenyebabDiagnosaComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: PenyebabDiagnosaComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class PenyebabDiagnosaModule { }

@NgModule({
   declarations: [MekanismeInteraksiProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MekanismeInteraksiProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MekanismeInteraksiProdukModule { }

@NgModule({
   declarations: [MasterTypeComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterTypeComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterTypeModule { }

@NgModule({
   declarations: [HargaPaketPenjaminComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: HargaPaketPenjaminComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class HargaPaketPenjaminModule { }

@NgModule({
   declarations: [HargaPaketPelayananComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: HargaPaketPelayananComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class HargaPaketPelayananModule { }

@NgModule({
   declarations: [JenisKomponenComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisKomponenComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisKomponenModule { }

@NgModule({
   declarations: [JenisKontakComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisKontakComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisKontakModule { }

@NgModule({
   declarations: [JenisKlaimComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisKlaimComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisKlaimModule { }

@NgModule({
   declarations: [InteraksiProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: InteraksiProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class InteraksiProdukModule { }

@NgModule({
   declarations: [MasterTitlePasienComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterTitlePasienComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterTitlePasienModule { }

@NgModule({
   declarations: [KelompokUmurComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: KelompokUmurComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class KelompokUmurModule { }

@NgModule({
   declarations: [MasterTitleComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterTitleComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterTitleModule { }

@NgModule({
   declarations: [MapTitleToStatusPerkawinanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapTitleToStatusPerkawinanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapTitleToStatusPerkawinanModule { }

@NgModule({
   declarations: [MasterVisiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterVisiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterVisiModule { }

@NgModule({
   declarations: [MasterMisiComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterMisiComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterMisiModule { }

@NgModule({
   declarations: [SejarahProfileComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: SejarahProfileComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class SejarahProfileModule { }

@NgModule({
   declarations: [HistoriTujuanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: HistoriTujuanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class HistoriTujuanModule { }

@NgModule({
   declarations: [MasterRekananComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterRekananComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterRekananModule { }

@NgModule({
   declarations: [VisiMisiPerusahaanComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: VisiMisiPerusahaanComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class VisiMisiPerusahaanModule { }

@NgModule({
   declarations: [MasterProsedurPelayananComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterProsedurPelayananComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterProsedurPelayananModule { }

@NgModule({
   declarations: [LanguageManagerComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: LanguageManagerComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class LanguageManagerModule { }

@NgModule({
   declarations: [MapRuanganToKelasComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapRuanganToKelasComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapRuanganToKelasModule { }

@NgModule({
   declarations: [FasilitasDetailComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: FasilitasDetailComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class FasilitasDetailModule { }

@NgModule({
   declarations: [FasilitasBedComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: FasilitasBedComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class FasilitasBedModule { }

@NgModule({
   declarations: [JadwalDokterComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JadwalDokterComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JadwalDokterModule { }

@NgModule({
   declarations: [ModulAplikasiLanguageComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ModulAplikasiLanguageComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ModulAplikasiLanguageModule { }

@NgModule({
   declarations: [ProfileKonfigurasiDesignComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: ProfileKonfigurasiDesignComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class ProfileKonfigurasiDesignModule { }

@NgModule({
   declarations: [JenisResponComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: JenisResponComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class JenisResponModule { }

@NgModule({
   declarations: [MonitoringCustomerCareComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringCustomerCareComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringCustomerCareModule { }

@NgModule({
   declarations: [MonitoringUserBaruComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringUserBaruComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringUserBaruModule { }

@NgModule({
   declarations: [MonitoringSubscribeComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MonitoringSubscribeComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MonitoringSubscribeModule { }

@NgModule({
   declarations: [MapPaketModulAplikasiToObjekModulComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapPaketModulAplikasiToObjekModulComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapPaketModulAplikasiToObjekModulModule { }

@NgModule({
   declarations: [BlogComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: BlogComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class BlogModule { }

@NgModule({
   declarations: [MapPaketModulAplikasiToProdukComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MapPaketModulAplikasiToProdukComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MapPaketModulAplikasiToProdukModule { }

@NgModule({
   declarations: [MasterAkunBank],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterAkunBank }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterAkunBankModule { }

@NgModule({
   declarations: [MasterDiskonComponent],
   imports: [RouterModule.forChild([{ canActivate: [AuthGuard], path: '', component: MasterDiskonComponent }]), SharedModule.forRoot()],
   exports: [RouterModule]
})
export class MasterDiskonModule { }