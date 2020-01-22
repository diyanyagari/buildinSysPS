import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisPetugasPelaksana } from './jenis-petugas-pelaksana.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-jenis-petugas-pelaksana',
  templateUrl: './jenis-petugas-pelaksana.component.html',
  styleUrls: ['./jenis-petugas-pelaksana.component.scss'],
  providers: [ConfirmationService]
})
export class JenisPetugasPelaksanaComponent implements OnInit {
  listKomponenHarga: any[];
  listJenisPetugasPelaksana: any[];
  selected: JenisPetugasPelaksana;
  listData: JenisPetugasPelaksana[];
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
  kdprof:any;
  kddept:any;
  codes: any[];
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
        label: 'Exel', icon: 'fa-file-excel-o', command: () => {
          this.downloadExcel();
        }
      }];
    
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'jenisPetugasPe': new FormControl('', Validators.required),
      'kdJenisPetugasPeHead': new FormControl(''),
      'kdKomponenHarga': new FormControl(''),
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
    this.httpService.get(Configuration.get().dataMasterNew + '/jenispetugaspelaksana/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.JenisPetugasPelaksana;
      this.totalRecords = table.totalRow;
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisPetugasPelaksana&select=*&page=1&rows=300').subscribe(res => {
      this.listJenisPetugasPelaksana = [];
      this.listJenisPetugasPelaksana.push({ label: '--Pilih Data Parent Jenis Petugas Pelaksana--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listJenisPetugasPelaksana.push({ label: res.data.data[i].jenisPetugasPe, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Komponen&select=namaKomponen,id').subscribe(res => {
      this.listKomponenHarga = [];
      this.listKomponenHarga.push({ label: '--Pilih Komponen Harga--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listKomponenHarga.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i].id.kode })
      };
    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenispetugaspelaksana/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=jenisPetugasPe&sort=desc&jenisPetugasPe=' + this.pencarian).subscribe(table => {
      this.listData = table.JenisPetugasPelaksana;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Petugas Pelaksana');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/jenispetugaspelaksana/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/jenispetugaspelaksana/save?', this.form.value).subscribe(response => {
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

  clone(cloned: JenisPetugasPelaksana): JenisPetugasPelaksana {
    let hub = new InisialJenisPetugasPelaksana();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialJenisPetugasPelaksana();
    fixHub = {
      'kode': hub.kode.kode,
      'jenisPetugasPe': hub.jenisPetugasPe,
      'kdJenisPetugasPeHead': hub.kdJenisPetugasPeHead,
      'kdKomponenHarga': hub.kdKomponenHarga,

  
      'reportDisplay': hub.reportDisplay,
      'namaExternal': hub.namaExternal,
      'kodeExternal': hub.kodeExternal,
      'statusEnabled': hub.statusEnabled

  
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenispetugaspelaksana/del/' + deleteItem.kode.kode).subscribe(response => {
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  downloadExcel(){

  }
  downloadPdf(){
    let cetak = Configuration.get().report + '/jenisPetugasPelaksana/laporanJenisPetugasPelaksana.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
  }
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/jenisPetugasPelaksana/laporanJenisPetugasPelaksana.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisPetugasPelaksana_laporanCetak');
    // let cetak = Configuration.get().report + '/jenisPetugasPelaksana/laporanJenisPetugasPelaksana.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}
}

class InisialJenisPetugasPelaksana implements JenisPetugasPelaksana {

  constructor(
    public jenisPetugasPe?,
    public kdJenisPetugasPeHead?,
    public kdKomponenHarga?,


    public kode?,
    public id?,
    public kdProfile?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,

 
  ) { }

}



