import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KualifikasiJurusan } from './kualifikasi-jurusan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
    selector: 'app-kualifikasi-jurusan',
    templateUrl: './kualifikasi-jurusan.component.html',
    styleUrls: ['./kualifikasi-jurusan.component.scss'],
    providers: [ConfirmationService]

})
export class KualifikasiJurusanComponent implements OnInit {
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    pencarian: string;
    Pendidikan: any;
    items: any;
    dataDummy: {};
    report: any;
    toReport: any;
    totalRecords: number;
    page: number;
    rows: number;
    selected: KualifikasiJurusan;
    listData: KualifikasiJurusan[];
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
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaKualifikasiJurusan': new FormControl('', Validators.required),
            'kdPendidikan': new FormControl('', Validators.required),
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
    
    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/KualifikasiJurusan/findAll?').subscribe(table => {
            this.listData = table.KualifikasiJurusan;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i].statusEnabled == true){
                    this.codes.push({

                        kode: this.listData[i].kode,
                        namaKualifikasiJurusan: this.listData[i].namaKualifikasiJurusan,
                        namaPendidikan: this.listData[i].namaPendidikan,
                        reportDisplay: this.listData[i].reportDisplay,
                        kodeExternal: this.listData[i].kodeExternal,
                        namaExternal: this.listData[i].namaExternal,
                        statusEnabled: this.listData[i].statusEnabled

                    })
                }
            }
    this.fileService.exportAsExcelFile(this.codes, 'KualifikasiJurusan');
});
    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/KualifikasiJurusan/laporanKualifikasiJurusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
        // var col = ["Kode", "Nama", "Pendidikan", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/KualifikasiJurusan/findAll?').subscribe(table => {
        //     this.listData = table.KualifikasiJurusan;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         if (this.listData[i].statusEnabled == true){
        //             this.codes.push({

        //                 kode: this.listData[i].kode,
        //                 namaKualifikasiJurusan: this.listData[i].namaKualifikasiJurusan,
        //                 namaPendidikan: this.listData[i].namaPendidikan,
        //                 reportDisplay: this.listData[i].reportDisplay,
        //                 kodeExternal: this.listData[i].kodeExternal,
        //                 namaExternal: this.listData[i].namaExternal,
        //                 statusEnabled: this.listData[i].statusEnabled

        //             })
        //         }
        //     }
        //     this.fileService.exportAsPdfFile("Master Kualifikasi Jurusan", col, this.codes, "KualifikasiJurusan");
        // });

    }
    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/KualifikasiJurusan/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.KualifikasiJurusan;
            this.totalRecords = table.totalRow;
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pendidikan&select=namaPendidikan,id').subscribe(res => {
            this.Pendidikan = [];
            this.Pendidikan.push({ label: '--Pilih Tingkat Pendidikan--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.Pendidikan.push({ label: res.data.data[i].namaPendidikan, value: res.data.data[i].id.kode })

            };
        });

    }

    valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }


    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/KualifikasiJurusan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKualifikasiJurusan&sort=desc&namaKualifikasiJurusan=' + this.pencarian).subscribe(table => {
            this.listData = table.KualifikasiJurusan;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kualifikasi Jurusan');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/KualifikasiJurusan/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/KualifikasiJurusan/save?', this.form.value).subscribe(response => {
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

    clone(cloned: KualifikasiJurusan): KualifikasiJurusan {
        let hub = new InisialKualifikasiJurusan();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKualifikasiJurusan();
        fixHub = {
            "kode": hub.kode,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaKualifikasiJurusan": hub.namaKualifikasiJurusan,
            "kdPendidikan": hub.kdPendidikan,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/KualifikasiJurusan/del/' + deleteItem.kode).subscribe(response => {
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
        this.print.showEmbedPDFReport(Configuration.get().report + '/KualifikasiJurusan/laporanKualifikasiJurusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKualifikasiJurusan_laporanCetak');

        // let cetak = Configuration.get().report + '/KulaifikasiJurusan/laporanKualifikasiJurusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
      }
      tutupLaporan() {
        this.laporan = false;
    }
}

class InisialKualifikasiJurusan implements KualifikasiJurusan {

    constructor(

        public kode?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public version?,
        public statusEnabled?,
        public label?,
        public value?,
        public namaKualifikasiJurusan?,
        public kodeKualifikasiJurusan?,
        public kdPendidikan?,


        ) { }

}



