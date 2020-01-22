import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { InfeksiNosokomial } from './infeksi-nosokomial.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-infeksi-nosokomial',
  templateUrl: './infeksi-nosokomial.component.html',
  styleUrls: ['./infeksi-nosokomial.component.scss'],
  providers: [ConfirmationService]

})
export class InfeksiNosokomialComponent implements OnInit {

  item2: InfeksiNosokomial = new InisialInfeksiN();
  selected: InfeksiNosokomial;
  listData: any[];
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  toReport: any;
  totalRecords: number;
  page: number;
  rows: number;
  codes: any[];
  kdprof:any;
  kddept:any;
  laporan: boolean = false;
  smbrFile:any;
  JenisInfeksiN: any[];
  FilterJenisInfeksiN: string;

  constructor(
    private alertService: AlertService,
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
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.pencarian = '';
    this.FilterJenisInfeksiN = '';
    this.formAktif = true;
    this.get(this.page, this.rows, this.pencarian, this.FilterJenisInfeksiN);
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaInfeksiNosokomial': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
      'kdJenisInfeksiNosokomial':  new FormControl('', Validators.required)
    });
    this.items = [
    {
      label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        this.downloadPdf();
      }
    },
    {
      label: 'Exel', icon: 'fa-file-excel-o', command: () => {
        this.downloadExel();
      }
    }];
    this.getJenisInfeksiNosokomial();
    this.getSmbrFile();
  }

  getJenisInfeksiNosokomial() {
    this.JenisInfeksiN = [];
		this.JenisInfeksiN.push({ label: '--Pilih--', value: '' })
		this.httpService.get(Configuration.get().dataMaster + '/jenisinfeksinosokomial/findAll').subscribe(res => {
			for (var i = 0; i < res.JenisInfeksiNosokomial.length; i++) {
				this.JenisInfeksiN.push({ label: res.JenisInfeksiNosokomial[i].namaJenisInfeksiNosokomial, value: res.JenisInfeksiNosokomial[i].kode.kode })
			};
		});
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}


  get(page: number, rows: number, search: any, filter: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/infeksinosokomial/findAll?page=' + page + '&rows=' + rows + '&kdNegara=' + filter +'&dir=namaInfeksiNosokomial&sort=desc&namaInfeksiNosokomial='+ search).subscribe(table => {
      this.listData = table.InfeksiNosokomial;
      this.totalRecords = table.totalRow;

    });
  }
  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterJenisInfeksiN);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/infeksinosokomial/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaInfeksiNosokomial&sort=desc&namaInfeksiNosokomial=' + this.pencarian).subscribe(table => {
      this.listData = table.InfeksiNosokomial;
    });
  }
  valuechange(newValue) {
    //	this.toReport = newValue;
    this.report = newValue;
  }
  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/infeksinosokomial/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaInfeksiNosokomial&sort=desc').subscribe(table => {
      this.listData = table.InfeksiNosokomial;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaInfeksiNosokomial: this.listData[i].namaInfeksiNosokomial,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled,
            kdJenisInfeksiNosokomial: this.listData[i].kdJenisInfeksiNosokomial
          })
      }

      this.fileService.exportAsExcelFile(this.codes, 'Infeksi Nosokomial');
    });
  }

  downloadPdf() {
    // let cetak = Configuration.get().report + '/hari/laporanHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    // window.open(cetak);
    var col = ["Kode", "Nama Infeksi",  "Report Display", "Kode External", "Nama Eksternal", "Status Aktif", "Kode Jenis Infeksi"];
    this.httpService.get(Configuration.get().dataMasterNew + '/infeksinosokomial/findAll?').subscribe(table => {
      this.listData = table.InfeksiNosokomial;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaInfeksiNosokomial: this.listData[i].namaInfeksiNosokomial,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled,
            kdJenisInfeksiNosokomial: this.listData[i].kdJenisInfeksiNosokomial
          })
      }
      this.fileService.exportAsPdfFile("Master Infeksi Nosokomial", col, this.codes, "Nosokomial");
    });
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Infeksi Nosokomial');
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

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/infeksinosokomial/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
      // this.get(this.page, this.rows, this.pencarian);

    });
    
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }

  reset() {
    this.ngOnInit();
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
    this.httpService.update(Configuration.get().dataMasterNew + '/infeksinosokomial/update', this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/infeksinosokomial/save', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.get(this.page, this.rows, this.pencarian);
        this.reset();
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

  onRowSelect(event) {
    this.formAktif = false;
    let cloned = this.clone(event.data);
    this.form.setValue(cloned);
  }

  clone(cloned: InfeksiNosokomial): InfeksiNosokomial {
    let hub = new InisialInfeksiN();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialInfeksiN();
    fixHub = {
      "kode": hub.kode.kode,
      "kdJenisInfeksiNosokomial": hub.kdJenisInfeksiNosokomial,
      "namaInfeksiNosokomial": hub.namaInfeksiNosokomial,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled,
    }
    this.versi = hub.version;
    return fixHub;
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/hari/laporanHari.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmHari_laporanCetak');
  }
  tutupLaporan() {
    this.laporan = false;
  }
}

class InisialInfeksiN implements InfeksiNosokomial {
  constructor(
    public namaInfeksiNosokomial?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public id?,
    public kdJenisInfeksiNosokomial?,
    public version?,
    public kode?,
    )
  { }
}