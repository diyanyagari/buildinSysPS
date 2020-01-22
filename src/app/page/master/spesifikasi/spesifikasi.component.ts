import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { SelectItem, MenuItem, TreeNode } from 'primeng/primeng';
import { Spesifikasi } from './spesifikasi.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-spesifikasi',
  templateUrl: './spesifikasi.component.html',
  styleUrls: ['./spesifikasi.component.scss'],
  providers: [ConfirmationService]
})
export class SpesifikasiComponent implements OnInit {
  selected: Spesifikasi;
  listData: any[];
  form: FormGroup;
  listKodeSpesifikasiHead: Spesifikasi[];
  listTypeDataObjek: Spesifikasi[];
  listSatuanHasil: Spesifikasi[];
  display: any;
  display2: any;
  formAktif: boolean;
  page: number;
  rows: number;
  pencarian: string;
  versi: any;
  report: any;
  toReport: any;
  totalRecords: number;
  codes:any[];
  listData2:any[];
  items: any;
  listTab: any[];
  index: number = 0;
  tabIndex: number = 0;
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
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.form = this.fb.group({
      'namaSpesifikasi': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'nilaiSpesifikasiNormal': new FormControl(''),
      'nilaiSpesifikasiMin': new FormControl(''),
      'nilaiSpesifikasiMax': new FormControl(''),
      'kdSatuanHasil': new FormControl(''),
      'kdTypeDataObjek': new FormControl(''),
      'kdSpesifikasiHead': new FormControl(null),
      'noUrut': new FormControl(''),
      'statusEnabled': new FormControl(true, Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),

    });
    this.form.get('noUrut').disable();
    this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAll?page=1&rows=10&dir=namaTypeDataObjek&sort=desc').subscribe(res => {            
      this.listTypeDataObjek = [];
      this.listTypeDataObjek.push({ label: '--Pilih Type Data Objek--', value: '' })
      for (var i = 0; i < res.TypeDataObjek.length; i++) {
        this.listTypeDataObjek.push({ label: res.TypeDataObjek[i].namaTypeDataObjek, value: res.TypeDataObjek[i].kode })
      };
    });
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanHasil&select=namaSatuanHasil,id').subscribe(res => {
      this.listSatuanHasil = [];
      this.listSatuanHasil.push({ label: '--Pilih Satuan Hasil--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listSatuanHasil.push({ label: res.data.data[i].namaSatuanHasil, value: res.data.data[i].id.kode })
      };
    });
    if (this.index == 0){
      this.httpService.get(Configuration.get().dataMasterNew + '/spesifikasi/findAll?page=1&rows=300&dir=namaSpesifikasi&sort=desc').subscribe(table => {
        this.listTab = table.Spesifikasi;
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
    this.form = this.fb.group({
      'namaSpesifikasi': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'nilaiSpesifikasiNormal': new FormControl(''),
      'nilaiSpesifikasiMin': new FormControl(''),
      'nilaiSpesifikasiMax': new FormControl(''),
      'kdSatuanHasil': new FormControl(''),
      'kdTypeDataObjek': new FormControl(''),
      'kdSpesifikasiHead': new FormControl(null),
      'noUrut': new FormControl(''),
      'statusEnabled': new FormControl(true, Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),

    });
    let data;
    this.index = event.index;
    if (event.index > 0){
      let index = event.index-1;
      data = this.listTab[index].kode.kode;
      this.form.get('kdSpesifikasiHead').setValue(data);
    } else {
      data = '';
      this.form.get('kdSpesifikasiHead').setValue(null);
    }
    this.pencarian = '';
    this.get(this.page,this.rows,this.pencarian, data);
    this.form.get('noUrut').disable();
    this.valuechange('');
    this.formAktif = true;
  }
  downloadExcel() {
    // this.httpService.get(Configuration.get().dataMasterNew + '/spesifikasi/findAll?').subscribe(table => {
    //   this.listData2 = table.Spesifikasi;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData2.length; i++) {
    //     this.codes.push({

    //       kode: this.listData2[i].kode.kode,
    //       namaSpesifikasiHead: this.listData2[i].namaSpesifikasiHead,
    //       namaSpesifikasi: this.listData2[i].namaSpesifikasi,
    //       noUrut: this.listData2[i].noUrut,
    //       nilaiSpesifikasiMin: this.listData2[i].nilaiSpesifikasiMin,
    //       nilaiSpesifikasiNormal: this.listData2[i].nilaiSpesifikasiNormal,
    //       nilaiSpesifikasiMax: this.listData2[i].nilaiSpesifikasiMax,
    //       namaSatuanHasil: this.listData2[i].namaSatuanHasil,
    //       namaTypeDataObjek: this.listData2[i].namaTypeDataObjek,
    //       reportDisplay: this.listData2[i].reportDisplay,
    //       kodeExternal: this.listData2[i].kodeExternal,
    //       namaExternal: this.listData2[i].namaExternal,
    //       statusEnabled: this.listData2[i].statusEnabled,

    //     })

    //   }
    //   this.fileService.exportAsExcelFile(this.codes, 'Spesifikasi');
    // });

  }



  downloadPdf() {
    let cetak = Configuration.get().report + '/spesifikasi/laporanSpesifikasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    window.open(cetak);
    // var col = ["Kode", "Parent", "Nama", "Nomor Urut", "Nilai Spesifikasi Min", "Nilai Spesifikasi Normal", "Nilai Spesifikasi Max", "Satuan Hasil", "Type Data Objek", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    // this.httpService.get(Configuration.get().dataMasterNew + '/spesifikasi/findAll?').subscribe(table => {
    //   this.listData2 = table.Spesifikasi;
    //   this.codes = [];

    //   for (let i = 0; i < this.listData2.length; i++) {
    //     this.codes.push({

    //       kode: this.listData2[i].kode.kode,
    //       namaSpesifikasiHead: this.listData2[i].namaSpesifikasiHead,
    //       namaSpesifikasi: this.listData2[i].namaSpesifikasi,
    //       noUrut: this.listData2[i].noUrut,
    //       nilaiSpesifikasiMin: this.listData2[i].nilaiSpesifikasiMin,
    //       nilaiSpesifikasiNormal: this.listData2[i].nilaiSpesifikasiNormal,
    //       nilaiSpesifikasiMax: this.listData2[i].nilaiSpesifikasiMax,
    //       namaSatuanHasil: this.listData2[i].namaSatuanHasil,
    //       namaTypeDataObjek: this.listData2[i].namaTypeDataObjek,
    //       reportDisplay: this.listData2[i].reportDisplay,
    //       kodeExternal: this.listData2[i].kodeExternal,
    //       namaExternal: this.listData2[i].namaExternal,
    //       statusEnabled: this.listData2[i].statusEnabled,

    //     })

    //   }
    //   this.fileService.exportAsPdfFile("Master Spesifikasi", col, this.codes, "Spesifikasi");

    // });
  }

  valuechange(newValue) {
    //	this.toReport = newValue;
    this.display2 = newValue;
  }

  get(page: number, rows: number, search: any, head: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/spesifikasi/findAll?page='+page+'&rows='+rows+'&dir=namaSpesifikasi&sort=desc&namaSpesifikasi='+search+'&kdSpesifikasiHead='+head).subscribe(table => {
      this.listData = table.Spesifikasi;
      this.totalRecords = table.totalRow;
      this.form.get('noUrut').setValue(this.totalRecords+1);
    });
  }

  cari() {
    let data = this.form.get('kdSpesifikasiHead').value;
    if (data == null) {
      this.get(this.page,this.rows,this.pencarian, '');
    } else {
      this.get(this.page,this.rows,this.pencarian, data);
    }

  }

  loadPage(event: LazyLoadEvent) {
    let data = this.form.get('kdSpesifikasiHead').value;
    if (data == null) {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
    } else {
      this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
    }
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Spesifikasi');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/spesifikasi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.reset();
    });
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
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.form.get('noUrut').enable();
      this.httpService.post(Configuration.get().dataMasterNew + '/spesifikasi/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.reset();
      });
    }

  }

  reset() {
    this.formAktif = true;
    this.form.get('noUrut').disable();
    this.ngOnInit();
  }
  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    this.form.get('noUrut').enable();
  }
  clone(cloned: Spesifikasi): Spesifikasi {
    let hub = new InisialSpesifikasi();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialSpesifikasi();
    fixHub = {

      "kode": hub.kode.kode,
      "namaSpesifikasi": hub.namaSpesifikasi,
      "nilaiSpesifikasiNormal": hub.nilaiSpesifikasiNormal,
      "nilaiSpesifikasiMax": hub.nilaiSpesifikasiMax,
      "nilaiSpesifikasiMin": hub.nilaiSpesifikasiMin,
      "kdSpesifikasiHead": hub.kdSpesifikasiHead,
      "kdSatuanHasil": hub.kdSatuanHasil,
      "kdTypeDataObjek": hub.kdTypeDataObjek,
      "noUrut": hub.noUrut,
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
    this.httpService.delete(Configuration.get().dataMasterNew + '/spesifikasi/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
  tutupLaporan() {
    this.laporan = false;
}
  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/spesifikasi/laporanSpesifikasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmSpesifikasi_laporanCetak');

    // let cetak = Configuration.get().report + '/spesifikasi/laporanSpesifikasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
    // window.open(cetak);
  }
}

class InisialSpesifikasi implements Spesifikasi {

  constructor(
    public id?,
    public kode?,
    public kdSpesifikasiHead?,
    public noUrut?,
    public namaSpesifikasi?,
    public nilaiSpesifikasi?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?,
    public nilaiSpesifikasiNormal?,
    public nilaiSpesifikasiMin?,
    public nilaiSpesifikasiMax?,
    public kdSatuanHasil?,
    public kdTypeDataObjek?,


    ) { }

}