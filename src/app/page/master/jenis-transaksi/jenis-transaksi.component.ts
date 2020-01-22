import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisTransaksi } from './jenis-transaksi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-jenis-transaksi',
  templateUrl: './jenis-transaksi.component.html',
  styleUrls: ['./jenis-transaksi.component.scss'],
  providers: [ConfirmationService]
})
export class JenisTransaksiComponent implements OnInit {
  listProdukCito: any[];
  listProdukRetur: any[];
  listKelasDefault: any[];
  listProdukDeposit: any[];
  listKelompokPelayanan: any[];
  selected: JenisTransaksi;
  listData: JenisTransaksi[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  codes: any[];
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  smbrFile:any;

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
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaJenisTransaksi': new FormControl('', Validators.required),
      'metodeHargaNetto': new FormControl('', Validators.required),
      'metodeStokHargaNetto': new FormControl('', Validators.required),
      'metodeAmbilHargaNetto': new FormControl('', Validators.required),
      'sistemHargaNetto': new FormControl('', Validators.required),
      'jenisPersenCito': new FormControl('', Validators.required),
      'kdProdukCito': new FormControl(null),
      'kdProdukRetur': new FormControl(null),
      'kdKelasDefault': new FormControl(null),
      'kdProdukDeposit': new FormControl(null),
      'tglBerlakuTarif': new FormControl(''),
      'kdKelompokPelayanan': new FormControl(''),
      'sistemDiscount': new FormControl(''),


      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.getSmbrFile();
  }
  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenistransaksi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.JenisTransaksi;
      this.totalRecords = table.totalRow;
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id').subscribe(res => {
      this.listProdukCito = [];
      this.listProdukCito.push({ label: '--Pilih Produk Cito--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listProdukCito.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id').subscribe(res => {
      this.listProdukRetur = [];
      this.listProdukRetur.push({ label: '--Pilih Produk Retur--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listProdukRetur.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
      };
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kelas&select=namaKelas,id').subscribe(res => {
      this.listKelasDefault = [];
      this.listKelasDefault.push({ label: '--Pilih Kelas Default--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKelasDefault.push({ label: res.data.data[i].namaKelas, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id').subscribe(res => {
      this.listProdukDeposit = [];
      this.listProdukDeposit.push({ label: '--Pilih Produk Deposit--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listProdukDeposit.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokPelayanan&select=namaKelompokPelayanan,id').subscribe(res => {
      this.listKelompokPelayanan = [];
      this.listKelompokPelayanan.push({ label: '--Pilih Kelompok Pelayanan--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKelompokPelayanan.push({ label: res.data.data[i].namaKelompokPelayanan, value: res.data.data[i].id.kode })
      };
    });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenistransaksi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisTransaksi&sort=desc&namaJenisTransaksi=' + this.pencarian).subscribe(table => {
      this.listData = table.JenisTransaksi;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Detail Jenis Transaksi');
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

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
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
    let tglBerlakuTarif = this.setTimeStamp(this.form.get('tglBerlakuTarif').value)

    let formSubmit = this.form.value;
    formSubmit.tglBerlakuTarif = tglBerlakuTarif;
    this.httpService.update(Configuration.get().dataMasterNew + '/jenistransaksi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let tglBerlakuTarif = this.setTimeStamp(this.form.get('tglBerlakuTarif').value)

      let formSubmit = this.form.value;
      formSubmit.tglBerlakuTarif = tglBerlakuTarif;
      this.httpService.post(Configuration.get().dataMasterNew + '/jenistransaksi/save?', this.form.value).subscribe(response => {
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

  clone(cloned: JenisTransaksi): JenisTransaksi {
    let hub = new InisialJenisTransaksi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialJenisTransaksi();
    if (hub.tglBerlakuTarif == null || hub.tglBerlakuTarif ==0){
      fixHub = {
        'kode': hub.kode.kode,
        'namaJenisTransaksi': hub.namaJenisTransaksi,
        'metodeHargaNetto': hub.metodeHargaNetto,
        'metodeStokHargaNetto': hub.metodeStokHargaNetto,
        'metodeAmbilHargaNetto': hub.metodeAmbilHargaNetto,
        'sistemHargaNetto': hub.sistemHargaNetto,
        'jenisPersenCito': hub.jenisPersenCito,
        'kdProdukCito': hub.kdProdukCito,
        'kdProdukRetur': hub.kdProdukRetur,
        'kdKelasDefault': hub.kdKelasDefault,
        'tglBerlakuTarif': null,
        'kdProdukDeposit': hub.kdProdukDeposit,
        'kdKelompokPelayanan': hub.kdKelompokPelayanan,
        'sistemDiscount': hub.sistemDiscount,
        'reportDisplay': hub.reportDisplay,
        'namaExternal': hub.namaExternal,
        'kodeExternal': hub.kodeExternal,
        'statusEnabled': hub.statusEnabled
      }
      this.versi = hub.version;
      return fixHub;
    } else {
      fixHub = {
        'kode': hub.kode.kode,
        'namaJenisTransaksi': hub.namaJenisTransaksi,
        'metodeHargaNetto': hub.metodeHargaNetto,
        'metodeStokHargaNetto': hub.metodeStokHargaNetto,
        'metodeAmbilHargaNetto': hub.metodeAmbilHargaNetto,
        'sistemHargaNetto': hub.sistemHargaNetto,
        'jenisPersenCito': hub.jenisPersenCito,
        'kdProdukCito': hub.kdProdukCito,
        'kdProdukRetur': hub.kdProdukRetur,
        'kdKelasDefault': hub.kdKelasDefault,
        'tglBerlakuTarif': new Date(hub.tglBerlakuTarif * 1000),
        'kdProdukDeposit': hub.kdProdukDeposit,
        'kdKelompokPelayanan': hub.kdKelompokPelayanan,
        'sistemDiscount': hub.sistemDiscount,
        'reportDisplay': hub.reportDisplay,
        'namaExternal': hub.namaExternal,
        'kodeExternal': hub.kodeExternal,
        'statusEnabled': hub.statusEnabled
      }
      this.versi = hub.version;
      return fixHub;
    }
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenistransaksi/del/' + deleteItem.kode.kode).subscribe(response => {
      this.get(this.page, this.rows, this.pencarian);

    });
    this.reset();
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  downloadExcel(){
    this.httpService.get(Configuration.get().dataMasterNew + '/jenistransaksi/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaJenisTransaksi&sort=desc').subscribe(table => {
      this.listData = table.JenisTransaksi;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

              kode: this.listData[i].kode.kode,
              namaJenisTransaksi: this.listData[i].namaJenisTransaksi,
              metodeHargaNetto:this.listData[i].metodeHargaNetto,
              metodeStokHargaNetto:this.listData[i].metodeStokHargaNetto,
              metodeAmbilHargaNetto:this.listData[i].metodeAmbilHargaNetto,
              sistemHargaNetto:this.listData[i].sistemHargaNetto,
              jenisPersenCito:this.listData[i].jenisPersenCito,
              namaProdukCito:this.listData[i].namaProdukCito,
              namaProdukRetur:this.listData[i].namaProdukRetur,
              namaKelasDefault:this.listData[i].namaKelasDefault,
              namaProdukDeposit:this.listData[i].namaProdukDeposit,
              tglBerlakuTarif:new Date(this.listData[i].tglBerlakuTarif*1000),
              namaKelompokPelayanan:this.listData[i].namaKelompokPelayanan,
              sistemDiscount:this.listData[i].sistemDiscount,
              kodeExternal: this.listData[i].kodeExternal,
              namaExternal: this.listData[i].namaExternal,
              statusEnabled: this.listData[i].statusEnabled,
              reportDisplay: this.listData[i].reportDisplay

          })

          }
          this.fileService.exportAsExcelFile(this.codes, 'JenisTransaksi');
      });
  }

  downloadPdf(){
    let b = Configuration.get().report + '/jenisTransaksi/laporanJenisTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisTransaksi/laporanJenisTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisTransaksi_laporanCetak');

        // let b = Configuration.get().report + '/jenisTransaksi/laporanJenisTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
      }
      tutupLaporan() {
        this.laporan = false;
    }
    }

    class InisialJenisTransaksi implements JenisTransaksi {

      constructor(
        public namaJenisTransaksi?,
        public metodeHargaNetto?,
        public metodeStokHargaNetto?,
        public metodeAmbilHargaNetto?,
        public sistemHargaNetto?,
        public jenisPersenCito?,
        public tanggalBerlakuTarif?,
        public kdProdukCito?,
        public kdJenisProduk?,
        public kdProdukDeposit?,
        public kdProdukRetur?,
        public kdKelasDefault?,
        public kdKelompokPelayanan?,
        public persenHargaCito?,
        public sistemDiscount?,


        public kode?,
        public id?,
        public tglBerlakuTarif?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        ) { }

    }





