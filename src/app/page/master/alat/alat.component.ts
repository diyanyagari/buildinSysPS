import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Alat } from './alat.interface';
import { Validators,FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { MenuItem,SplitButtonModule, LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService,Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';
 

@Component({
  selector: 'app-alat-form',
  templateUrl: './alat.component.html',
  styleUrls: ['./alat.component.scss'],
  providers: [ConfirmationService]

})
export class AlatComponent implements OnInit {

  selected: Alat;
  listData: any[];
  dataDummy:{};
  versi: any;
  kode: any;
  id: any;
  page: number;
  id_kode: any;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  pencarian: string;
  form: FormGroup;
  items: any;
  formAktif: boolean;
  kodeSatuanStandar: Alat[];
  kodeAlatHead: Alat[];
  kodeProdukAset: Alat[];
  kdprof:any;
  kddept:any;
  codes: any[];
  laporan: boolean = false;
  smbrFile: any;


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
        this.getPage(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'kdAlatHead': new FormControl(null),
            'kdProdukAset': new FormControl(null),
            'kdSatuanStandar': new FormControl(''),
            'noRegisterAset': new FormControl(''),
            'nomorAlamatAlat': new FormControl(''),
            'kapasitasAlat': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaAlat': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });

    }

    valuechange(newValue) {
        //  this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcel() {
        

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/alat/laporanAlat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
        window.open(cetak);
    }

    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/alat/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.Alat;
            this.totalRecords = table.totalRow;

        });
    
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanStandar&select=namaSatuanStandar,id').subscribe(res => {
        this.kodeSatuanStandar = [];
        this.kodeSatuanStandar.push({ label: '--Pilih Satuan Standar--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kodeSatuanStandar.push({ label: res.data.data[i].namaSatuanStandar, value: res.data.data[i].id.kode })
        };
      });

      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Alat&select=namaAlat,id').subscribe(res => {
        this.kodeAlatHead = [];
        this.kodeAlatHead.push({ label: '--Pilih Data Parent Alat--', value: null})
        for (var i = 0; i < res.data.data.length; i++) {
          this.kodeAlatHead.push({ label: res.data.data[i].namaAlat, value: res.data.data[i].id.kode })
        };
      });

      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id').subscribe(res => {
        this.kodeProdukAset = [];
        this.kodeProdukAset.push({ label: '--Pilih Data Produk Aset--', value: '' })
        for (var i = 0; i < res.data.data.length; i++) {
          this.kodeProdukAset.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
        };
      });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/alat/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaAlat&sort=desc&namaAlat=' + this.pencarian).subscribe(table => {
            this.listData = table.Alat;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Alat');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapus();
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
            }
        });
    }
    update() {
        this.httpService.update(Configuration.get().dataMasterNew + '/alat/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/alat/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getPage(this.page, this.rows, this.pencarian);
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
    clone(cloned: Alat): Alat {
        let hub = new InisialAlat();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialAlat();
        fixHub = {
            "kode": hub.kode.kode,
            "namaAlat": hub.namaAlat,
            "kdAlatHead": hub.kdAlatHead,
            "kdProdukAset": hub.kdProdukAset,
            "kdSatuanStandar": hub.kdSatuanStandar,
            "noRegisterAset": hub.noRegisterAset,
            "nomorAlamatAlat": hub.nomorAlamatAlat,
            "kapasitasAlat": hub.kapasitasAlat,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/alat/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPage(this.page, this.rows, this.pencarian);
        });
        this.reset();
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
        let pathFile
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
            this.print.showEmbedPDFReport(Configuration.get().report + '/alat/laporanAlat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile + '&download=false', 'frmAlat_laporanCetak');
        });



        // let cetak = Configuration.get().report + '/alat/laporanAlat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
      }
}

class InisialAlat implements Alat {

    constructor(
        public namaAlat?,
        public id?,
        public kdAlatHead?,
        public kode?,
        public kdAlat?,
        public kdProdukAset?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public kdSatuanStandar?,
        public noRegisterAset?,
        public nomorAlamatAlat?,
        public kapasitasAlat?,
     

    ) { }

}