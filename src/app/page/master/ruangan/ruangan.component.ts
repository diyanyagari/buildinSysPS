import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Ruangan } from './ruangan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-ruangan',
  templateUrl: './ruangan.component.html',
  styleUrls: ['./ruangan.component.scss'],
  providers: [ConfirmationService]
})
export class RuanganComponent implements OnInit {
  selected: Ruangan;
  listData: any[];
  dataDummy: {};
  formAktif: boolean;
  pencarian: string;
  Departemen: Ruangan[];
  Kelas: Ruangan[];
  listNegara: Ruangan[];
  ModulAplikasi: Ruangan[];
  PegawaiKepala: Ruangan[];
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  kdNegara: any;
  kdPropinsi: any;
  kdKotaKabupaten: any;
  kdKecamatan: any;
  propinsi: Ruangan[];
  kotaKabupaten: Ruangan[];
  kecamatan: Ruangan[];
  kelurahan: Ruangan[];
  jenisAlamat: Ruangan[];
  codes:any;
  kdprof:any;
  kddept:any;
  laporan: boolean = false;
  smbrFile:any;
  DetailLokasiKerjaData:any[];
  listDepartemen:any[];

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {

  }


  ngOnInit() {
    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
          this.downloadExcel();
        }
      },

    ];
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.versi = null;
    this.form = this.fb.group({

      'kode': new FormControl(null),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaRuangan': new FormControl('', Validators.required),
      'noRuangan': new FormControl(''),
      'lokasiRuangan': new FormControl(''),
      // 'kdDepartemen': new FormControl('01'),
      // 'kdKelasHead': new FormControl(null),
      //  'kdModulAplikasi': new FormControl(null),
      // 'fixedPhone': new FormControl(''),
      // 'faksimile': new FormControl(''),
      // 'mobilePhone': new FormControl(''),
      'kdAlamat': new FormControl(''),
      // 'alamatLengkap': new FormControl(''),
      // 'rtrw': new FormControl(''),
      // 'kdNegara': new FormControl(''),
      // 'kdPropinsi': new FormControl(''),
      // 'kdKotaKabupaten': new FormControl(''),
      // 'kdKecamatan': new FormControl(''),
      // 'kdDesaKelurahan': new FormControl(''),
      // 'kodePos': new FormControl(''),
      'kdPegawaiKepala': new FormControl(null),
      // 'statusViewData': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
      'kdRuanganHead': new FormControl('', Validators.required),
      'kdDepartemen': new FormControl('', Validators.required),
      'statusRuangan': new FormControl(false)
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAll?page=1&rows=300&dir=namaModulAplikasi&sort=desc').subscribe(res => {
      this.ModulAplikasi = [];
      this.ModulAplikasi.push({ label: '--Pilih Modul Aplikasi--', value: null })
      for (var i = 0; i < res.ModulAplikasi.length; i++) {
        this.ModulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kelas&select=namaKelas,id').subscribe(res => {
      this.Kelas = [];
      this.Kelas.push({ label: '--Pilih Kelas--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.Kelas.push({ label: res.data.data[i].namaKelas, value: res.data.data[i].id.kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
      this.PegawaiKepala = [];
      this.PegawaiKepala.push({ label: '--Pilih Pegawai Kepala--', value: null })
      for (var i = 0; i < res.Data.length; i++) {
        this.PegawaiKepala.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/getDropDownAlamat').subscribe(res => {
      this.jenisAlamat = [];
      this.jenisAlamat.push({ label: '--Pilih Alamat--', value: '' })
      for (var i = 0; i < res.Alamat.length; i++) {
          this.jenisAlamat.push({ label: res.Alamat[i].alamat, value: res.Alamat[i].kode })
      };
    });
 
   // this.httpService.get(Configuration.get().dataMasterNew 
   //+ '/service/list-generic/?table=Negara&select=namaNegara,id').subscribe(
    // this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(
    // res => {
    //   this.listNegara = [];
    //   this.listNegara.push({ label: '--Pilih Negara--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.listNegara.push({ label: res.data.Negara[i].namaNegara, value: res.data.Negara[i].kode })
    //   };
    // });

    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/getHead').subscribe(res => {
      this.DetailLokasiKerjaData = [];
      this.DetailLokasiKerjaData.push({ label: '--Pilih Detail Ruangan--', value: null })
      for (var i = 0; i < res.Ruangan.length; i++) {
        this.DetailLokasiKerjaData.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kdRuangan })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/departemen/findAllData').subscribe(res => {
      this.listDepartemen = [];
      this.listDepartemen.push({ label: '--Pilih Departemen--', value: null })
          for (var i = 0; i < res.Departemen.length; i++) {
            this.listDepartemen.push({ label: res.Departemen[i].namaDepartemen, value: res.Departemen[i].kode.kode })
          };
      },error => {
        this.listDepartemen = [];
        this.listDepartemen.push({ label: '--' + error + '--', value: '' });
    });

    this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  valuechangekdNegara(kdNegara) {
    if (kdNegara == undefined) {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Propinsi&criteria=kdNegara&values=null&condition=and&profile=y').subscribe(res => {
        this.propinsi = [];
        this.propinsi.push({ label: '--Pilih Propinsi--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.propinsi.push({ label: res.data.data[i].namaPropinsi, value: res.data.data[i].id.kode })
        };

      });

    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Propinsi&criteria=kdNegara&values=' + kdNegara + '&condition=and&profile=y').subscribe(res => {
        this.propinsi = [];
        this.propinsi.push({ label: '--Pilih Propinsi--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.propinsi.push({ label: res.data.data[i].namaPropinsi, value: res.data.data[i].id.kode })
        };

      });
    }
  }

  valuechangekdPropinsi(kdPropinsi) {
    if (kdPropinsi == undefined) {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KotaKabupaten&criteria=kdPropinsi&values=null&condition=and&profile=y').subscribe(res => {
        this.kotaKabupaten = [];
        this.kotaKabupaten.push({ label: '--Pilih Kota Kabupaten--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kotaKabupaten.push({ label: res.data.data[i].namaKotaKabupaten, value: res.data.data[i].id.kode })
        };
      });
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KotaKabupaten&criteria=kdPropinsi&values=' + kdPropinsi + '&condition=and&profile=y').subscribe(res => {
        this.kotaKabupaten = [];
        this.kotaKabupaten.push({ label: '--Pilih Kota Kabupaten--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kotaKabupaten.push({ label: res.data.data[i].namaKotaKabupaten, value: res.data.data[i].id.kode })
        };
      });
    }
  }

  valuechangekdKotaKabupaten(kdKotaKabupaten) {
    if (kdKotaKabupaten == undefined) {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kecamatan&criteria=kdKotaKabupaten&values=null&condition=and&profile=y').subscribe(res => {
        this.kecamatan = [];
        this.kecamatan.push({ label: '--Pilih Kecamatan--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kecamatan.push({ label: res.data.data[i].namaKecamatan, value: res.data.data[i].id.kode })
        };
      });
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kecamatan&criteria=kdKotaKabupaten&values=' + kdKotaKabupaten + '&condition=and&profile=y').subscribe(res => {
        this.kecamatan = [];
        this.kecamatan.push({ label: '--Pilih Kecamatan--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kecamatan.push({ label: res.data.data[i].namaKecamatan, value: res.data.data[i].id.kode })
        };
      });
    }
  }

  listKodePos : any[];
    valuechangekdKecamatan(kdKecamatan) {
        this.listKodePos = [];
        if (kdKecamatan == undefined) {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DesaKelurahan&criteria=kdKecamatan&values=null&condition=and&profile=y').subscribe(res => {
                this.kelurahan = [];
                this.kelurahan.push({ label: '--Pilih Kelurahan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kelurahan.push({ label: res.data.data[i].namaDesaKelurahan, value: res.data.data[i].id.kode })
                    this.listKodePos[res.data.data[i].id.kode] = res.data.data[i].kodePos 
                };
            });
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DesaKelurahan&criteria=kdKecamatan&values=' + kdKecamatan + '&condition=and&profile=y').subscribe(res => {
                this.kelurahan = [];
                this.kelurahan.push({ label: '--Pilih Kelurahan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kelurahan.push({ label: res.data.data[i].namaDesaKelurahan, value: res.data.data[i].id.kode })
                    this.listKodePos[res.data.data[i].id.kode] = res.data.data[i].kodePos 
                };
            });
        }
    }
    setKodePos(kdDesa) {
        this.form.get('kodePos').setValue(this.listKodePos[kdDesa]);
    }
  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Ruangan&select=id.kode,namaRuangan').subscribe(table => {

      this.fileService.exportAsExcelFile(table.data.data, 'Ruangan');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/ruangan/laporanRuangan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode Ruangan", "Nama Ruangan"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Ruangan&select=id.kode,namaRuangan').subscribe(table => {
    //   this.fileService.exportAsPdfFile("Master Ruangan", col, table.data.data, "Ruangan");

    // });

  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.Ruangan;
      this.totalRecords = table.totalRow;

    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaRuangan&sort=desc&namaRuangan=' + this.pencarian).subscribe(table => {
      this.listData = table.Ruangan;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
    // this.get((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Unit Kerja');
    } else {
      this.confirmationService.confirm({
        message: 'Apakah data akan di hapus?',
        header: 'Konfirmasi Hapus',
        icon: 'fa fa-trash',
        accept: () => {
          this.hapus();
        },
        reject: () => {
          this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
        }
      });
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }

  confirmUpdate() {
    this.confirmationService.confirm({
      message: 'Apakah data akan diperbaharui?',
      header: 'Konfirmasi Pembaharuan',
      accept: () => {
        this.update();
      },
      reject: () => {
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }

  update() {
    // let dataTemp = {
    //   "alamatLengkap": this.form.get('alamatLengkap').value,
    //   "rtrw": this.form.get('rtrw').value,
    //   "kdNegara": this.form.get('kdNegara').value,
    //   "kdPropinsi": this.form.get('kdPropinsi').value,
    //   "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
    //   "kdKecamatan": this.form.get('kdKecamatan').value,
    //   "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
    //   "kodePos": this.form.get('kodePos').value,
    //   "kdAlamat": this.form.get('kdAlamat').value,
    // }

    let fixHub = {
      // "dataAlamat": dataTemp,
      "kode": this.form.get('kode').value,
      "namaRuangan": this.form.get('namaRuangan').value,
      "noRuangan": this.form.get('noRuangan').value,
      "kdAlamat": this.form.get('kdAlamat').value,
      // "fixedPhone": this.form.get('fixedPhone').value,
      // "mobilePhone": this.form.get('mobilePhone').value,
      // "faksimile": this.form.get('faksimile').value,
      // "alamatEmail": this.form.get('alamatEmail').value,
      // "website": this.form.get('website').value,
      // "kdKelasHead": this.form.get('kdKelasHead').value,
      "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
      "lokasiRuangan": this.form.get('lokasiRuangan').value,
      "statusEnabled": this.form.get('statusEnabled').value,
      "kodeExternal": this.form.get('kodeExternal').value,
      "namaExternal": this.form.get('namaExternal').value,
      "reportDisplay": this.form.get('reportDisplay').value,
      "kdRuanganHead": this.form.get('kdRuanganHead').value,
      "kdDepartemen": this.form.get('kdDepartemen').value,
      "isAntrianByRuangan": this.form.get('statusRuangan').value

    }
    // this.form.value.kdModulAplikasi = 'E2';
    this.httpService.update(Configuration.get().dataMasterNew + '/ruangan/update/' + this.versi, fixHub).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      // let dataTemp = {
      //   "alamatLengkap": this.form.get('alamatLengkap').value,
      //   "rtrw": this.form.get('rtrw').value,
      //   "kdNegara": this.form.get('kdNegara').value,
      //   "kdPropinsi": this.form.get('kdPropinsi').value,
      //   "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
      //   "kdKecamatan": this.form.get('kdKecamatan').value,
      //   "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
      //   "kodePos": this.form.get('kodePos').value,
      //   "kdAlamat": this.form.get('kdAlamat').value,
      // }

      let fixHub = {
        // "dataAlamat": dataTemp,
        "kode": this.form.get('kode').value,
        "namaRuangan": this.form.get('namaRuangan').value,
        "noRuangan": this.form.get('noRuangan').value,
        "kdAlamat": this.form.get('kdAlamat').value,
        // "fixedPhone": this.form.get('fixedPhone').value,
        // "mobilePhone": this.form.get('mobilePhone').value,
        // "faksimile": this.form.get('faksimile').value,
        // "alamatEmail": this.form.get('alamatEmail').value,
        // "website": this.form.get('website').value,
        // "kdKelasHead": this.form.get('kdKelasHead').value,
        "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
        "lokasiRuangan": this.form.get('lokasiRuangan').value,
        "statusEnabled": this.form.get('statusEnabled').value,
        "kodeExternal": this.form.get('kodeExternal').value,
        "namaExternal": this.form.get('namaExternal').value,
        "reportDisplay": this.form.get('reportDisplay').value,
        "kdRuanganHead": this.form.get('kdRuanganHead').value,
        "kdDepartemen": this.form.get('kdDepartemen').value,
        "isAntrianByRuangan": this.form.get('statusRuangan').value

      }
      // this.form.value.kdModulAplikasi = 'E2';
      this.httpService.post(Configuration.get().dataMasterNew + '/ruangan/save?', fixHub).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

  }

  clone(cloned: Ruangan): Ruangan {
    let hub = new InisialRuangan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialRuangan();
    fixHub = {
      "kode": hub.kode.kode,
      "namaRuangan": hub.namaRuangan,
      "noRuangan": hub.noRuangan,
      "lokasiRuangan": hub.lokasiRuangan,
      // "kdDepartemen": hub.kdDepartemen,
      // "kdKelasHead": hub.kdKelasHead,
      // "kdModulAplikasi": 'E2',
      // "fixedPhone": hub.fixedPhone,
      // "mobilePhone": hub.mobilePhone,
      // "faksimile": hub.faksimile
      "kdPegawaiKepala": hub.kdPegawaiKepala,
      "kdAlamat": hub.kdAlamat,
      // "alamatLengkap": hub.alamatLengkap,
      // "rtrw": hub.rTRW,
      // "kdNegara": hub.kdNegara,
      // "kdPropinsi": hub.kdPropinsi,
      // "kdKotaKabupaten": hub.kdKotaKabupaten,
      // "kdKecamatan": hub.kdKecamatan,
      // "kdDesaKelurahan": hub.kdDesaKelurahan,
      // "kodePos": hub.kodePos,
      "statusEnabled": hub.statusEnabled,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      
      "kdRuanganHead":hub.kdRuanganHead,
      "kdDepartemen":hub.kdDepartemen,
      "statusRuangan":hub.isAntrianByRuangan

      // "statusViewData": hub.statusViewData,

    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/ruangan/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();


  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/ruangan/laporanRuangan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmRuangan_laporanCetak');

    // let cetak = Configuration.get().report + '/ruangan/laporanRuangan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}

}

class InisialRuangan implements Ruangan {

  constructor(
    public ruangan?,
    public id?,
    public alamatEmail?,
    public faksimile?,
    public fixedPhone?,
    public jamBuka?,
    public jamTutup?,
    public kdDepartemen?,
    public kdKelasHead?,
    public kdModulAplikasi?,
    public kdPegawaiKepala?,
    public kode?,
    public kodeExternal?,
    public lokasiRuangan?,
    public mobilePhone?,
    public namaExternal?,
    public namaRuangan?,
    public noCounter?,
    public noRuangan?,
    public prefixNoAntrian?,
    public reportDisplay?,
    public statusEnabled?,
    public statusViewData?,
    public version?,
    public website?,

    public kdAlamat?,
    public alamatLengkap?,
    public rtrw?,
    public rTRW?,
    public kdNegara?,
    public kdPropinsi?,
    public kdKotaKabupaten?,
    public kdKecamatan?,
    public kdDesaKelurahan?,
    public kodePos?,
    public kdRuanganHead?,
    public isAntrianByRuangan?,
    public statusRuangan?

  ) { }

}