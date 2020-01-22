import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokShiftKerja } from './kelompok-shift-kerja.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-kelompok-shift-kerja',
  templateUrl: './kelompok-shift-kerja.component.html',
  styleUrls: ['./kelompok-shift-kerja.component.scss'],
  providers: [ConfirmationService]

})
export class KelompokShiftKerjaComponent implements OnInit {
  selected: KelompokShiftKerja;
  listData: any[];
  dataDummy: {};
  versi: any;
  form: FormGroup;
  formAktif: boolean
  items: MenuItem[];
  pencarian: string;
  report: any;
  // listDepartemen: SelectItem[];
  listOperatorFactorRate: SelectItem[];
  page: number;
  rows: number;
  codes: any[];
  kdprof: any;
  kddept: any;
  laporan: boolean = false;
  smbrFile:any;

  constructor(
    private alertService: AlertService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService
    ) { }

  ngOnInit() {

    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
   
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(null),
      'namaKelompokShiftKerja': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'factorRate': new FormControl(1, Validators.required),
      'operatorFactorRate': new FormControl('X', Validators.required),
      'kodeExternal': new FormControl(''),
      'namaExternal': new FormControl(''),
      // 'kdDepartemen': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
      'qtyHariKerja':new FormControl(null)

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

    this.getSmbrFile();
  }

getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokshiftkerja/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.KelompokShiftKerja;
    });

    this.listOperatorFactorRate = [];
    this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: '' });
    this.listOperatorFactorRate.push({ label: "+", value: '+' });
    this.listOperatorFactorRate.push({ label: "-", value: '-' });
    this.listOperatorFactorRate.push({ label: "X", value: 'X' });
    this.listOperatorFactorRate.push({ label: "/", value: '/' });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokshiftkerja/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokShiftKerja&sort=desc&namaKelompokShiftKerja`=' + this.pencarian).subscribe(table => {
      this.listData = table.KelompokShiftKerja;
    });
  }


  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  downloadExel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/kelompokshiftkerja/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKelompokShiftKerja&sort=desc').subscribe(table => {
      this.listData = table.KelompokShiftKerja;
      this.codes = [];

      for (let i = 0; i < this.listData.length; i++) {
          this.codes.push({

              kode: this.listData[i].kode.kode,
              namaKelompokShiftKerja: this.listData[i].namaKelompokShiftKerja,
              kodeExternal: this.listData[i].kodeExternal,
              namaExternal: this.listData[i].namaExternal,
              statusEnabled: this.listData[i].statusEnabled,
              reportDisplay: this.listData[i].reportDisplay

          })

          }
          this.fileService.exportAsExcelFile(this.codes, 'KelompokShiftKerja');
      })

  }

  // downloadPdf() {
  //   var col = ["Kode", "Nama KelompokShiftKerja"];
  //   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KelompokShiftKerja&select=id.kode,namaKelompokShiftKerja').subscribe(table => {
  //     this.fileService.exportAsPdfFile("Master KelompokShiftKerja", col, table.data.data, "KelompokShiftKerja");

  //   });

  // }

  downloadPdf(){
    let b = Configuration.get().report + '/kelompokShiftKerja/laporanKelompokShiftKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
  }

  cetak() {
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokShiftKerja/laporanKelompokShiftKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelompokShiftKerja_laporanCetak');
        // let b = Configuration.get().report + '/kelompokShiftKerja/laporanKelompokShiftKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
      }
      tutupLaporan() {
        this.laporan = false;
    }
      confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
          this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Shift Kerja');
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokshiftkerja/del/' + deleteItem.kode.kode).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Dihapus');
          this.get(this.page, this.rows, this.pencarian);
        });
        this.reset();
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
        this.httpService.update(Configuration.get().dataMasterNew + '/kelompokshiftkerja/update/' + this.versi, this.form.value).subscribe(response => {
          this.alertService.success('Berhasil', 'Data Diperbarui');
          this.get(this.page, this.rows, this.pencarian);
          this.reset();
        });
      }


      simpan() {
        if (this.formAktif == false) {
          this.confirmUpdate()
        } else {
          this.httpService.post(Configuration.get().dataMasterNew + '/kelompokshiftkerja/save', this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.get(this.page, this.rows, this.pencarian);
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
      valuechange(newvalue) {
        this.report = newvalue;
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
      clone(cloned: KelompokShiftKerja): KelompokShiftKerja {
        let hub = new InisialKelompokShiftKerja();
        for (let prop in cloned) {
          hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKelompokShiftKerja();
        fixHub = {
          "kode": hub.kode.kode,
          "namaKelompokShiftKerja": hub.namaKelompokShiftKerja,
          "reportDisplay": hub.reportDisplay,
          "factorRate": hub.factorRate,
          "operatorFactorRate": hub.operatorFactorRate,
          "kodeExternal": hub.kodeExternal,
          "namaExternal": hub.namaExternal,
      // "kdDepartemen": hub.kdDepartemen,
      "statusEnabled": hub.statusEnabled,
      "qtyHariKerja": hub.qtyHariKerja
    }
    this.versi = hub.version;
    return fixHub;
  }


}
class InisialKelompokShiftKerja implements KelompokShiftKerja {
  constructor(
    public kode?,
    public namaKelompokShiftKerja?,
    public reportDisplay?,
    public factorRate?,
    public operatorFactorRate?,
    public kodeExternal?,
    public namaExternal?,
    public kdDepartemen?,
    public statusEnabled?,
    public id?,
    public version?,
    public qtyHariKerja?,
    public qtyHariKerjaFloat?
    ) { }
}
