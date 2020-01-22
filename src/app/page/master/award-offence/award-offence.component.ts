import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { AwardOffence } from './award-offence.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';


@Component({
  selector: 'app-award-offence',
  templateUrl: './award-offence.component.html',
  styleUrls: ['./award-offence.component.scss'],
  providers: [ConfirmationService]
})
export class AwardOffenceComponent implements OnInit {
  item: AwardOffence = new InisialAwardOffence();;
  selected: AwardOffence;
  listData: AwardOffence[];
  dataDummy: {};
  kodePenghargaanPelanggaranHead: AwardOffence[];
  kdAsalPenghargaanPelanggaran: AwardOffence[];
  kodeDepartemen: AwardOffence[];
  versi: any;
  formAktif: boolean;
  pencarian: string = '';
  form: FormGroup;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  nomorUrut: number;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
  kdprof: any;
  kddept: any;
  codes:any[];
  items:any;
  laporan: boolean = false;
  itemsChild: any;
  kdHead: any;
  smbrFile: any;


  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
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

    if(this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.getKomponen();
    this.formAktif = true;
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'namaAwardOffence': new FormControl('', Validators.required),
      'kdAwardOffenceHead': new FormControl(null),
      'kdAsalAwardOffence': new FormControl('', Validators.required),
      'noUrut': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      'reportDisplay':new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true, Validators.required)
    });
    this.form.get('noUrut').disable();
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/awardoffence/findAll?page=1&rows=300&dir=namaAwardOffence&sort=desc').subscribe(table => {
        this.listTab = table.AwardOffence;
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
  onTabChange(event) {
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.kdHead = data;
      this.form.get('kdAwardOffenceHead').setValue(data);
    } else {
      data = '';
      this.form.get('kdAwardOffenceHead').setValue(null);
    }
    this.pencarian = '';
    this.getPage(this.page,this.rows,this.pencarian, data);
    this.valuechange('');
    this.formAktif = true;
    this.form.get('noUrut').disable();
  }
  

  getPage(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/awardoffence/findAll?page='+page+'&rows='+rows+'&dir=namaAwardOffence&sort=desc&namaAwardOffence='+search+'&kdAwardOffenceHead='+head).subscribe(table => {
      this.listData = table.AwardOffence;
      this.totalRecords = table.totalRow;
      this.form.get('noUrut').setValue(this.totalRecords+1);
    });
  }
  
  cari() {
    let data = this.form.get('kdAwardOffenceHead').value;
    if (data == null) {
      this.getPage(this.page,this.rows,this.pencarian, '');
    } else {
      this.getPage(this.page,this.rows,this.pencarian, data);
    }
    
  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdAwardOffenceHead').value;
    if (data == null) {
      this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }
  getKomponen() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=AwardOffence&select=namaAwardOffence,id').subscribe(res => {
      this.kodePenghargaanPelanggaranHead = [];
      this.kodePenghargaanPelanggaranHead.push({ label: '--Pilih Data Parent Penghargaan Pelanggaran--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodePenghargaanPelanggaranHead.push({ label: res.data.data[i].namaAwardOffence, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Asal&select=namaAsal,id').subscribe(res => {
      this.kdAsalPenghargaanPelanggaran = [];
      this.kdAsalPenghargaanPelanggaran.push({ label: '--Pilih Asal Penghargaan Pelanggaran--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kdAsalPenghargaanPelanggaran.push({ label: res.data.data[i].namaAsal, value: res.data.data[i].id.kode })
      };
    });

    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
      this.kodeDepartemen = [];
      this.kodeDepartemen.push({ label: '--Pilih Departemen--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
      };
    });
  }



  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
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
      this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Penghargaan Pelanggaran');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/awardoffence/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });

  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.form.get('noUrut').enable();
      this.httpService.post(Configuration.get().dataMasterNew + '/awardoffence/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.reset();
      });
    }
  }

  reset() {
    this.form.get('noUrut').disable();
    this.formAktif = true;
    this.form.reset();
    this.ngOnInit();
  }
  onRowSelect(event) {
    this.formAktif = false;
    this.form.setValue(this.clone(event.data));
    this.form.get('noUrut').enable();
  }
  clone(cloned: AwardOffence): AwardOffence {
    let hub = new InisialAwardOffence();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialAwardOffence();
    fixHub = {
      "kode": hub.kode.kode,
      "namaAwardOffence": hub.namaAwardOffence,
      "kdAwardOffenceHead": hub.kdAwardOffenceHead,
      "kdAsalAwardOffence": hub.kdAsalAwardOffence,
      "noUrut": hub.noUrut,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/awardoffence/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
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

  getSmbrFile(){
    this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
        this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
    });
}

  downloadPdf(){
   
    let b = Configuration.get().report + '/awardOffence/laporanAwardOffence.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(b);
  }
  tutupLaporan() {
    this.laporan = false;
}

  cetak() {
    this.laporan = true;
    let pathFile;
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
            this.print.showEmbedPDFReport(Configuration.get().report + '/awardOffence/laporanAwardOffence.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmAwardOffence_laporanCetak');
        });
        // this.laporan = true;
        // let b = Configuration.get().report + '/awardOffence/laporanAwardOffence.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
      }

    cetakChild(){
        this.laporan = true;
        let pathFile;
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
          this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
          this.print.showEmbedPDFReport(Configuration.get().report + '/awardOffenceChild/laporanAwardOffenceChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdAwardOffenceHead='+ this.kdHead +'&download=false', 'frmAwardOffence_laporanCetak');
        });
    }
    
    downloadPdfChild(){
       
        let b = Configuration.get().report + '/awardOffenceChild/laporanAwardOffenceChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdAwardOffenceHead='+ this.kdHead +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
    } 










    }

    class InisialAwardOffence implements AwardOffence {

      constructor(
        public id?,
        public kdProfile?,
        public kode?,
        public kdAwardOffenceHead?,
        public namaAwardOffence?,
        public kdAsalAwardOffence?,
        public kdDepartemen?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public noRec?,
        public reportDisplay?,
        public version?,
        public noUrut?,
        public awardOffence?,

        ) { }

    }




