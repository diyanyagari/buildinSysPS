import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PemilikProfile } from './pemilik-profile.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-pemilik-profile',
  templateUrl: './pemilik-profile.component.html',
  styleUrls: ['./pemilik-profile.component.scss'],
  providers: [ConfirmationService]
})
export class PemilikProfileComponent implements OnInit {
  item: PemilikProfile = new InisialPemilikProfile();;
  selected: PemilikProfile;
  listData: PemilikProfile[];
  dataDummy: {};
  kodeKelompokPemilik: PemilikProfile[];
  versi: any;
  form: FormGroup;
  display: any;
  display2: any;
  formAktif: boolean;
  page: number;
  rows: number;
  totalRecords: number;
  pencarian: string = '';

  codes:any[];
  listData2:any[];
  items: any;
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
    @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


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
  if(this.page == undefined || this.rows == undefined) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  this.formAktif = true;
  this.get(this.page, this.rows, '');
  this.form = this.fb.group({
    'namaPemilikProfile': new FormControl('', Validators.required),
    'kode': new FormControl(''),
    'kdKelompokPemilik': new FormControl('', Validators.required),
    'statusEnabled': new FormControl('', Validators.required),
    'reportDisplay': new FormControl('', Validators.required),
    'persenKepemilikan': new FormControl(''),
    'namaExternal': new FormControl(''),
    'kodeExternal': new FormControl(''),

  });

  this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KelompokPemilikProfile&select=kelompokPemilik,id').subscribe(
    res => {
      this.kodeKelompokPemilik = [];
      this.kodeKelompokPemilik.push({ label: '--Pilih Kelompok Pemilik--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKelompokPemilik.push({ label: res.data.data[i].kelompokPemilik, value: res.data.data[i].id.kode })
      };
    }, error => {
      this.kodeKelompokPemilik = [];
      this.kodeKelompokPemilik.push({label:'-- '+ error +' --', value:''})
    }
    );

    this.getSmbrFile();
}

getSmbrFile(){
  this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
    this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
  });
}


cari() {

  this.httpService.get(Configuration.get().dataMasterNew + '/pemilikprofile/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPemilikProfile&sort=desc&namaPemilikProfile=' + this.pencarian).subscribe(table => {
    this.listData = table.PemilikProfile;
  });
}

loadPage(event: LazyLoadEvent) {
  this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
  this.page = (event.rows + event.first) / event.rows;
  this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
      }

    // setPageRow(page, rows) {
    //     if(page == undefined || rows == undefined) {
    //         this.page = Configuration.get().page;
    //         this.rows = Configuration.get().rows;
    //     } else {
    //         this.page = page;
    //         this.rows = rows;
    //     }
    // }


    get(page: number, rows: number, search: any) {
      this.httpService.get(Configuration.get().dataMasterNew + '/pemilikprofile/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
        this.listData = table.PemilikProfile;
        this.totalRecords = table.totalRow;
      });
    }

    valuechange(newvalue) {
      this.display = newvalue;
      this.display2 = newvalue;
    }

    onSubmit() {
      if (this.form.invalid) {
        this.validateAllFormFields(this.form);
        this.alertService.warn("Peringatan", "Data Tidak Sesuai")
      } else {
        this.simpan();
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

    confirmDelete() {
    	let kode = this.form.get('kode').value;
      if (kode == null || kode == undefined || kode == "") {
        this.alertService.warn('Peringatan', 'Pilih Daftar Master Pemilik Profile');
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
      this.httpService.update(Configuration.get().dataMasterNew + '/pemilikprofile/update/' + this.versi, this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Diperbarui');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

    simpan() {
      if (this.formAktif == false) {
        this.confirmUpdate()
      } else {
        this.httpService.post(Configuration.get().dataMasterNew + '/pemilikprofile/save?', this.form.value).subscribe(response => {
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
    clone(cloned: PemilikProfile): PemilikProfile {
      let hub = new InisialPemilikProfile();
      for (let prop in cloned) {
        hub[prop] = cloned[prop];
      }
      let fixHub = new InisialPemilikProfile();
      fixHub = {
      //"kdProfile": hub.id.kdProfile,
      "kode": hub.kode.kode,
      "namaPemilikProfile": hub.namaPemilikProfile,
      "kdKelompokPemilik": hub.kdKelompokPemilik,
      "persenKepemilikan": hub.persenKepemilikan,
      "reportDisplay": hub.reportDisplay,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/pemilikprofile/del/' + deleteItem.kode.kode).subscribe(response => {
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

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pemilikprofile/findAll?').subscribe(table => {
     this.listData2 = table.PemilikProfile;
     this.codes = [];

     for (let i = 0; i<this.listData2.length; i++){
      this.codes.push({
        kode: this.listData2[i].kode.kode,
        namaPemilikProfile: this.listData2[i].namaPemilikProfile,
        kelompokPemilik: this.listData2[i].kelompokPemilik,
        persenKepemilikan: this.listData2[i].persenKepemilikan,
        reportDisplay: this.listData2[i].reportDisplay,
        kodeExternal: this.listData2[i].kodeExternal,
        namaExternal: this.listData2[i].namaExternal,
        statusEnabled: this.listData2[i].statusEnabled
      })
    }
    this.fileService.exportAsExcelFile(this.codes, 'PemilikProfile');
  });

  }

  downloadPdf() {
    let cetak = Configuration.get().report + '/pemilikProfile/laporanPemilikProfile.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Nama", "Kelompok Pemilik", "Persen Kepemilikan", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/pemilikprofile/findAll?').subscribe(table => {
    //   this.listData2 = table.PemilikProfile;
    //   this.codes = [];

    //   for (let i = 0; i<this.listData2.length; i++){
    //     this.codes.push({
    //       kode: this.listData2[i].kode.kode,
    //       namaPemilikProfile: this.listData2[i].namaPemilikProfile,
    //       kelompokPemilik: this.listData2[i].kelompokPemilik,
    //       persenKepemilikan: this.listData2[i].persenKepemilikan,
    //       reportDisplay: this.listData2[i].reportDisplay,
    //       kodeExternal: this.listData2[i].kodeExternal,
    //       namaExternal: this.listData2[i].namaExternal,
    //       statusEnabled: this.listData2[i].statusEnabled
    //     })
    //   }
    //   this.fileService.exportAsPdfFile("Master Pemilik Profile", col, this.codes, "PemilikProfile");

    // });

  }
  tutupLaporan() {
    this.laporan = false;
}
  cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pemilikProfile/laporanPemilikProfile.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPemilikProfile_laporanCetak');

    // let cetak = Configuration.get().report + '/pemilikProfile/laporanPemilikProfile.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }




}

class InisialPemilikProfile implements PemilikProfile {

  constructor(
    public persenKepemilikan?,
    public kdProfile?,
    public kode?,
    public kdKelompokPemilik?,
    public namaPemilikProfile?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?
    ) { }

}	 