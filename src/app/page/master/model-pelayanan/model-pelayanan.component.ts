import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { ModelPelayanan } from './model-pelayanan.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService  } from '../../../global';
@Component({
  selector: 'app-model-pelayanan',
  templateUrl: './model-pelayanan.component.html',
  styleUrls: ['./model-pelayanan.component.scss'],
  providers: [ConfirmationService]
})
export class ModelPelayananComponent implements OnInit {
  selected: ModelPelayanan;
  listData: ModelPelayanan[];
  dataDummy: {};
  versi: any;
  listModelPelayanan: ModelPelayanan[];
  pencarian: string = '';
  formAktif: boolean;
  form: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;

  laporan: boolean = false;
  items: MenuItem[];
  display: any;
  display2: any;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;

  listData2:any[];
  codes:any[];

  kdprof: any;
  kddept: any;
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

    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }

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
    this.formAktif = true;
    this.versi = null;
    this.form = this.fb.group({
      'kdModelPelayananHead': new FormControl(null),
      'namaModelPelayanan': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'deskripsiDetailModelPelayanan': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true, Validators.required)
    });
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/modelpelayanan/findAll?page=1&rows=300&dir=namaModelPelayanan&sort=desc').subscribe(table => {
        this.listTab = table.ModelPelayanan;
        let i = this.listTab.length
        while (i--) {
          if (this.listTab[i].statusEnabled == false) { 
            this.listTab.splice(i, 1);
          } 
        }
      });
    };
    let dataIndex = {
      "index": this.index
    }
    this.onTabChange(dataIndex);
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
    
    
    this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  
  onTabChange(event) {
    this.form = this.fb.group({
      'kdModelPelayananHead': new FormControl(null),
      'namaModelPelayanan': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'deskripsiDetailModelPelayanan': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true, Validators.required),

    });
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.form.get('kdModelPelayananHead').setValue(data);
    } else {
      data = '';
      this.form.get('kdModelPelayananHead').setValue(null);
    }
    this.pencarian = '';
    this.get(this.page,this.rows,this.pencarian, data);
    this.valuechange('');
    this.formAktif = true;
  }
  

  tutupLaporan() {
    this.laporan = false;
  }


  // cetak() {
  //   this.laporan = true;
  //   this.report.showEmbedPDFReport(Configuration.get().report + "/ModelPelayanan/listModelPelayanan.pdf?kdDepartemen=1", '#report-pdf-ModelPelayanan', 400);
  // }

  get(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/modelpelayanan/findAll?page='+page+'&rows='+rows+'&dir=namaModelPelayanan&sort=desc&namaModelPelayanan='+search+'&kdModelPelayananHead='+head).subscribe(table => {
      this.listData = table.ModelPelayanan;
      this.totalRecords = table.totalRow;
      this.form.get('noUrut').setValue(this.totalRecords+1);
    });
  }

  cari() {
    let data = this.form.get('kdModelPelayananHead').value;
    if (data == null) {
      this.get(this.page,this.rows,this.pencarian, '');
    } else {
      this.get(this.page,this.rows,this.pencarian, data);
    }

  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdModelPelayananHead').value;
    if (data == null) {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  valuechange(newvalue) {
    this.display = newvalue;
    this.display2 = newvalue;
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
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Model Pelayanan');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/modelpelayanan/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/modelpelayanan/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
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
  clone(cloned: ModelPelayanan): ModelPelayanan {
    let hub = new InisialModelPelayanan();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialModelPelayanan();
    fixHub = {
      "kode": hub.kode.kode,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "kdModelPelayananHead": hub.kdModelPelayananHead,
      "namaModelPelayanan": hub.namaModelPelayanan,
      "deskripsiDetailModelPelayanan": hub.deskripsiDetailModelPelayanan,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,

    }
    this.versi = hub.version;
    return fixHub;
  }

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/modelpelayanan/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });
  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }

  downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/modelpelayanan/findAll?').subscribe(table => {
            this.listData2 = table.ModelPelayanan;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaModelPelayananHead: this.listData2[i].namaModelPelayananHead,
                    namaModelPelayanan: this.listData2[i].namaModelPelayanan,
                    deskripsiDetailModelPelayanan: this.listData2[i].deskripsiDetailModelPelayanan,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'metodePelayanan');
        });

    }

    downloadPdf(){
      let b = Configuration.get().report + '/metodePelayanan/laporanMetodePelayanan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }

    cetak() {
      this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/metodePelayanan/laporanMetodePelayanan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMetodePelayanan_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/metodePelayanan/laporanMetodePelayanan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }
}

class InisialModelPelayanan implements ModelPelayanan {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public namaModelPelayanan?,
    public kdModelPelayananHead?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public deskripsiDetailModelPelayanan?,
    ) { }

}