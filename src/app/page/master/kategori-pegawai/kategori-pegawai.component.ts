import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { KategoriPegawai } from './kategori-pegawai.interface';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-kategori-pegawai',
    templateUrl: './kategori-pegawai.component.html',
    styleUrls: ['./kategori-pegawai.component.scss'],
    providers: [ConfirmationService]
})
export class KategoriPegawaiComponent implements OnInit {
    selected: KategoriPegawai;
    listData: any[];
    pencarian: string;
    items: any;
    codes: any[];
    page: number;
    rows: number;
    dataDummy: {};
    id_kode: any;
    formAktif: boolean;
    versi: any;
    report: any;
    toReport: any;
    form: FormGroup;
    totalRecords: number;

    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    smbrFile:any;

    listRangeKerja: any[];

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
        }

        ];
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({

            'kode': new FormControl(null),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaKategoryPegawai': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),

            'rangeKerja': new FormControl(null),
            'hariMax': new FormControl(null),
            'hariMin': new FormControl(null)

        });
        this.getSmbrFile();
    }

    getSmbrFile(){
      this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
       this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }

  downloadExcel() {

    this.httpService.get(Configuration.get().dataMasterNew + '/kategorypegawai/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKategoryPegawai&sort=desc').subscribe(table => {
        this.listData = table.KategoryPegawai;
        this.codes = [];

        for (let i = 0; i < this.listData.length; i++) {
            this.codes.push({

                kode: this.listData[i].kode.kode,
                namaKategoryPegawai: this.listData[i].namaKategoryPegawai,
                reportDisplay: this.listData[i].reportDisplay,
                kodeExternal: this.listData[i].kodeExternal,
                namaExternal: this.listData[i].namaExternal,
                statusEnabled: this.listData[i].statusEnabled

            })
        }
        this.fileService.exportAsExcelFile(this.codes, 'Kategory Pegawai');

    });
}

valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }


    // downloadPdf() {
    //     var col = ["Kode", "Nama Kategory Pegawai", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    //     this.httpService.get(Configuration.get().dataMasterNew + '/kategorypegawai/findAll?').subscribe(table => {
    //         this.listData = table.KategoryPegawai;
    //         this.codes = [];

    //         for (let i = 0; i < this.listData.length; i++) {
    //             this.codes.push({

    //                 code: this.listData[i].kode.kode,
    //                 nama: this.listData[i].namaKategoryPegawai,
    //                 reportDisplay: this.listData[i].reportDisplay,
    //                 kodeEx: this.listData[i].kodeExternal,
    //                 namaEx: this.listData[i].namaExternal,
    //                 statusEnabled: this.listData[i].statusEnabled

    //             })
    //         }
    //         this.fileService.exportAsPdfFile("Master Kategory Pegawai", col, this.codes, "Kategory Pegawai");


    //     });

    // }

    downloadPdf(){
        let b = Configuration.get().report + '/kategoryPegawai/laporanKategoryPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kategoryPegawai/laporanKategoryPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKategoriPegawai_laporanCetak');
        // let b = Configuration.get().report + '/kategoryPegawai/laporanKategoryPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kategorypegawai/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.KategoryPegawai;
            this.totalRecords = table.totalRow;

        });

        this.httpService.get(Configuration.get().dataMaster+'/kategorypegawai/findByRangeKategoryPegawai/').subscribe(res => {
            this.listRangeKerja = [];
            this.listRangeKerja.push({label:'--Pilih Range Kerja--', value:null})
            for(var i=0;i<res.Range.length;i++) {
                this.listRangeKerja.push({label:res.Range[i].namaRange, value:res.Range[i].kdRange})
            };
        },
        error => {
            this.listRangeKerja = [];
            this.listRangeKerja.push({label:'-- '+ error +' --', value:''})
        });
    }

    getHari(event){
        let data;
        this.httpService.get(Configuration.get().dataMasterNew + '/range/findByKode/' + event.value).subscribe(table => {
            data = table.Range
            this.form.get('hariMin').setValue(data.rangeMin)
            this.form.get('hariMax').setValue(data.rangeMax)

        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kategorypegawai/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKategoryPegawai&sort=desc&namaKategoryPegawai=' + this.pencarian).subscribe(table => {
            this.listData = table.KategoryPegawai;
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


    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kategori Pegawai');
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
        let dataSimpan = {
              // "kdDepartemen": "string",
              // "kdKategoryPegawaiHead": "string",
              // "kdKategoryPegawaiNext": "string",
              "kdRangeMasaKerjaMax": this.form.get('rangeKerja').value,
              // "kdRangeMasaKerjaMin": 0,
              "kode": this.form.get('kode').value,
              "kodeExternal": this.form.get('kodeExternal').value,
              "namaExternal": this.form.get('namaExternal').value,
              "namaKategoryPegawai": this.form.get('namaKategoryPegawai').value,
              // "noRec": "string",
              "noUrut": 0,
              "reportDisplay": this.form.get('reportDisplay').value,
              "statusEnabled": this.form.get('statusEnabled').value,
              "version": this.versi
          }

          this.httpService.update(Configuration.get().dataMasterNew + '/kategorypegawai/update/' + this.versi, dataSimpan).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
      }

      simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {

            let dataSimpan = {
              // "kdDepartemen": "string",
              // "kdKategoryPegawaiHead": "string",
              // "kdKategoryPegawaiNext": "string",
              "kdRangeMasaKerjaMax": this.form.get('rangeKerja').value,
              // "kdRangeMasaKerjaMin": 0,
              "kode": this.form.get('kode').value,
              "kodeExternal": this.form.get('kodeExternal').value,
              "namaExternal": this.form.get('namaExternal').value,
              "namaKategoryPegawai": this.form.get('namaKategoryPegawai').value,
              // "noRec": "string",
              "noUrut": 0,
              "reportDisplay": this.form.get('reportDisplay').value,
              "statusEnabled": this.form.get('statusEnabled').value,
              // "version": 0
          }

          this.httpService.post(Configuration.get().dataMasterNew + '/kategorypegawai/save', dataSimpan).subscribe(response => {
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

clone(hub: any) {
    let fixHub = {

        "kode": hub.kode.kode,
        "kodeExternal": hub.kodeExternal,
        "namaExternal": hub.namaExternal,
        "namaKategoryPegawai": hub.namaKategoryPegawai,
        "reportDisplay": hub.reportDisplay,
        "statusEnabled": hub.statusEnabled,

        "hariMax": hub.rangeMax,
        "hariMin": hub.rangeMin,
        "rangeKerja": hub.kdRangeMasaKerjaMax


    }
    this.versi = hub.version;
    return fixHub;
}

hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/kategorypegawai/del/' + deleteItem.kode.kode).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Dihapus');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
    });

}

findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
}
onDestroy() {

}
}

class InisialKategoriPegawai implements KategoriPegawai {

    constructor(
        public kode?,
        public kodeExternal?,
        public namaExternal?,
        public namaKategoryPegawai?,
        public namaKategoriPegawai?,
        public reportDisplay?,
        public statusEnabled?,
        public version?,
        public id?,
        public kodeKategoriPegawai?,
        public Version?,
        public namaEx?,
        public id_kode?,
        public kodeEx?,
        public code?,
        public nama?
        ) { }

}