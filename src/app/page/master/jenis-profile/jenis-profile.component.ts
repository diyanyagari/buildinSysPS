import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { JenisProfile } from './jenis-profile.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-jenis-profile',
  templateUrl: './jenis-profile.component.html',
  styleUrls: ['./jenis-profile.component.scss'],
  providers: [ConfirmationService]
})
export class JenisProfileComponent implements OnInit {
  item: JenisProfile = new InisialJenisProfile();;
  selected: JenisProfile;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  pencarian: string;
  formAktif: boolean;
  codes: any[];
  kdprof:any;
  kddept:any;
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
    this.versi = null;
    this.form = this.fb.group({

      'kdJenisProfile': new FormControl(''),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaJenisProfile': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl('', Validators.required),
    });

    this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisprofile/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.JenisProfile;
      this.totalRecords = table.totalRow;
    });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisprofile/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisProfile&sort=desc&namaJenisProfile=' + this.pencarian).subscribe(table => {
      this.listData = table.JenisProfile;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  //  setPageRow(page, rows) {
  //     if(page == undefined || rows == undefined) {
  //         this.page = Configuration.get().page;
  //         this.rows = Configuration.get().rows;
  //     } else {
  //         this.page = page;
  //         this.rows = rows;
  //     }
  // }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/jenisprofile/findAll?page=1&rows=10&dir=namaJenisProfile&sort=desc').subscribe(table => {
      this.listData = table.JenisProfile;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaJenisProfile: this.listData[i].namaJenisProfile,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

          })
        // }
      }
      this.fileService.exportAsExcelFile(this.codes, 'JenisProfile');
    });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/jenisProfile/laporanJenisProfile.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/jenisprofile/findAll?page=1&rows=10&dir=namaJenisProfile&sort=desc').subscribe(table => {
    //   this.listData = table.JenisProfile;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData.length; i++) {
    //     // if (this.listData[i].statusEnabled == true){
    //       this.codes.push({

    //         kode: this.listData[i].kode.kode,
    //         namaJenisProfile: this.listData[i].namaJenisProfile,
    //         reportDisplay: this.listData[i].reportDisplay,
    //         kodeExternal: this.listData[i].kodeExternal,
    //         namaExternal: this.listData[i].namaExternal,
    //         statusEnabled: this.listData[i].statusEnabled

    //       })
    //     // }
    //   }
    //   this.fileService.exportAsPdfFile("Master Jenis Profile", col, this.codes, "JenisProfile");

    // });

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

  confirmDelete() {
    let kdJenisProfile = this.form.get('kdJenisProfile').value;
    if (kdJenisProfile == null || kdJenisProfile == undefined || kdJenisProfile == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Profile');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/jenisprofile/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/jenisprofile/save?', this.form.value).subscribe(response => {
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

  clone(cloned: JenisProfile): JenisProfile {
    let hub = new InisialJenisProfile();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialJenisProfile();
    fixHub = {
      "kdJenisProfile": hub.kdJenisProfile,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "namaJenisProfile": hub.namaJenisProfile,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/jenisprofile/del/' + deleteItem.kdJenisProfile).subscribe(response => {
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
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisProfile/laporanJenisProfile.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisProfile_laporanCetak');
    // let cetak = Configuration.get().report + '/jenisProfile/laporanJenisProfile.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
  tutupLaporan() {
    this.laporan = false;
}
}

class InisialJenisProfile implements JenisProfile {

  constructor(
    public id?,
    public kdJenisProfile?,
    public kode?,
    public namaJenisProfile?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?
    ) { }

}