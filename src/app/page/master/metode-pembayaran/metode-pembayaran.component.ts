import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { MetodePembayaran } from './metode-pembayaran.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem, SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-metode-pembayaran',
  templateUrl: './metode-pembayaran.component.html',
  styleUrls: ['./metode-pembayaran.component.scss'],
  providers: [ConfirmationService]
})
export class MetodePembayaranComponent implements OnInit {
  selected: MetodePembayaran;
  listData: MetodePembayaran[];
  dataDummy: {};
  versi: any;
  listOperatorFactorRate: MetodePembayaran[];
  listMetodeHitung: MetodePembayaran[];
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

  kdprof: any;
  kddept: any;

  codes: any[];
  listData2: any[];
  itemsChild: any;
  kdAsalHead:any;
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
    this.formAktif = true;
    this.versi = null;
    this.form = this.fb.group({
      'kdMetodePembayaranHead': new FormControl(null),
      'namaMetodePembayaran': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'qtyHariSatuSiklus': new FormControl(''),
      'deskripsiMetodePembayaran': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true, Validators.required),

    });
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
    this.itemsChild = [
      {
          label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
              this.downloadPdfChild();
          }
      },
      {
          label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
              this.downloadExcelChild();
          }
      },
      ];
    
    
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/metodepembayaran/findAll?page=1&rows=300&dir=namaMetodePembayaran&sort=desc').subscribe(table => {
        this.listTab = table.MetodePembayaran;
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
    this.getSmbrFile();
  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  onTabChange(event) {
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.form.get('kdMetodePembayaranHead').setValue(data);
    } else {
      data = '';
      this.form.get('kdMetodePembayaranHead').setValue(null);
    }
    this.kdAsalHead = data;
    this.pencarian = '';
    this.getPage(this.page,this.rows,this.pencarian, data);
    this.valuechange('');
    this.formAktif = true;
  }
  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/metodepembayaran/findAll?').subscribe(table => {
      this.listData2 = table.MetodePembayaran;
      this.codes = [];

      for (let i = 0; i < this.listData2.length; i++) {
        this.codes.push({

          kode: this.listData2[i].kode.kode,
          namaMetodePembayaranHead: this.listData2[i].namaMetodePembayaranHead,
          namaMetodePembayaran: this.listData2[i].namaMetodePembayaran,
          deskripsiMetodePembayaran: this.listData2[i].deskripsiMetodePembayaran,
          qtyHariSatuSiklus: this.listData2[i].qtyHariSatuSiklus,
          reportDisplay: this.listData2[i].reportDisplay,
          kodeExternal: this.listData2[i].kodeExternal,
          namaExternal: this.listData2[i].namaExternal,
          statusEnabled: this.listData2[i].statusEnabled,

        })

      }
      this.fileService.exportAsExcelFile(this.codes, 'MetodePembayaran');
    });

  }

  downloadPdf(){
    let b = Configuration.get().report + '/metodePembayaran/laporanMetodePembayaran.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/metodePembayaran/laporanMetodePembayaran.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmMetodePembayaran_laporanCetak');


        // this.laporan = true;
        // let b = Configuration.get().report + '/metodePembayaran/laporanMetodePembayaran.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
      }

      tutupLaporan() {
        this.laporan = false;
      }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/metodePembayaranChild/laporanMetodePembayaranChild.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdMetodePembayaranHead='+ this.kdAsalHead +'&download=false', 'frmMetodePembayaran_LaporanCetak');
    }

    downloadPdfChild(){
        let b = Configuration.get().report + '/metodePembayaranChild/laporanMetodePembayaranChild.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdMetodePembayaranHead='+ this.kdAsalHead +'&download=true';
        window.open(b);
    }

    downloadExcelChild(){

    }


      // cetak() {
      //   this.laporan = true;
      //   this.report.showEmbedPDFReport(Configuration.get().report + "/MetodePembayaran/listMetodePembayaran.pdf?kdDepartemen=1", '#report-pdf-MetodePembayaran', 400);
      // }

      getPage(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/metodepembayaran/findAll?page='+page+'&rows='+rows+'&dir=namaMetodePembayaran&sort=desc&namaMetodePembayaran='+search+'&kdMetodePembayaranHead='+head).subscribe(table => {
          this.listData = table.MetodePembayaran;
          this.totalRecords = table.totalRow;
        });
      }
      cari() {
        let data = this.form.get('kdMetodePembayaranHead').value;
        if (data == null) {
          this.getPage(this.page,this.rows,this.pencarian, '');
        } else {
          this.getPage(this.page,this.rows,this.pencarian, data);
        }

      }

      loadPage(event: LazyLoadEvent) {
        let data = this.form.get('kdMetodePembayaranHead').value;
        if (data == null) {
          this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
        } else {
          this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
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
          this.alertService.warn('Peringatan', 'Pilih Daftar Master Metode Pembayaran');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/metodepembayaran/update/' + this.versi, this.form.value).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Diperbarui');
          this.reset();
        });
      }

      simpan() {
        if (this.formAktif == false) {
          this.confirmUpdate()
        } else {
          this.httpService.post(Configuration.get().dataMasterNew + '/metodepembayaran/save?', this.form.value).subscribe(response => {
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
      clone(cloned: MetodePembayaran): MetodePembayaran {
        let hub = new InisialMetodePembayaran();
        for (let prop in cloned) {
          hub[prop] = cloned[prop];
        }
        let fixHub = new InisialMetodePembayaran();
        fixHub = {
          "kode": hub.kode.kode,
          "kodeExternal": hub.kodeExternal,
          "namaExternal": hub.namaExternal,
          "namaMetodePembayaran": hub.namaMetodePembayaran,
          "kdMetodePembayaranHead": hub.kdMetodePembayaranHead,
          "deskripsiMetodePembayaran": hub.deskripsiMetodePembayaran,
          "qtyHariSatuSiklus": hub.qtyHariSatuSiklus,
          "reportDisplay": hub.reportDisplay,
          "statusEnabled": hub.statusEnabled,

        }
        this.versi = hub.version;
        return fixHub;
      }

      hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/metodepembayaran/del/' + deleteItem.kode.kode).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          this.reset();
        });
      }

      findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
      }
      onDestroy() {

      }
    }

    class InisialMetodePembayaran implements MetodePembayaran {

      constructor(
        public id?,
        public deskripsiMetodePembayaran?,
        public kode?,
        public namaMetodePembayaran?,
        public kdMetodePembayaranHead?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public qtyHariSatuSiklus?,
        ) { }

    }