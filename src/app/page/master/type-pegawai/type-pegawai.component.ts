
import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { TypePegawai } from './typepegawai.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-type-pegawai',
    templateUrl: './type-pegawai.component.html',
    styleUrls: ['./type-pegawai.component.scss'],
    providers: [ConfirmationService]
})
export class TypePegawaiComponent implements OnInit {
    selected: TypePegawai;
    listData: TypePegawai[];
    pencarian: string;
    page: number;
    rows: number;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    items: any;
    report: any;
    toReport: any;
    form: FormGroup;
    totalRecords: number;

    listData2:any[];
    codes:any[];
    laporan: boolean = false;
    kdprof: any;
    kddept: any;

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
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaTypePegawai': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required)
        });
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/typepegawai/findAll?').subscribe(table => {
            this.listData2 = table.TypePegawai;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaTypePegawai: this.listData2[i].namaTypePegawai,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'TypePegawai');

        });

    }

    // downloadPdf() {

    //     var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    //     this.httpService.get(Configuration.get().dataMasterNew + '/typepegawai/findAll?').subscribe(table => {
    //         this.listData2 = table.TypePegawai;
    //         this.codes = [];

    //         for (let i = 0; i < this.listData2.length; i++) {
    //             this.codes.push({

    //                 kode: this.listData2[i].kode.kode,
    //                 namaTypePegawai: this.listData2[i].namaTypePegawai,
    //                 reportDisplay: this.listData2[i].reportDisplay,
    //                 kodeExternal: this.listData2[i].kodeExternal,
    //                 namaExternal: this.listData2[i].namaExternal,
    //                 statusEnabled: this.listData2[i].statusEnabled,

    //             })

    //         }
    //         this.fileService.exportAsPdfFile("Type Pegawai", col, this.codes, "Type Pegawai");

    //     });

    // }

    downloadPdf(){
        let b = Configuration.get().report + '/TypePegawai/laporanTypePegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';

        window.open(b);
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/TypePegawai/laporanTypePegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmTypePegawai_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/TypePegawai/laporanTypePegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }


    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/typepegawai/findAll?page=' + page + '&rows=' + Configuration.get().rows + '&dir=namaTypePegawai&sort=desc').subscribe(table => {
            this.listData = table.TypePegawai;
            this.totalRecords = table.totalRow;
        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/typepegawai/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTypePegawai&sort=desc&namaTypePegawai=' + this.pencarian).subscribe(table => {
            this.listData = table.TypePegawai;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Type Pegawai');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/typepegawai/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();;
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/typepegawai/save?', this.form.value).subscribe(response => {
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
    clone(cloned: TypePegawai): TypePegawai {
        let hub = new InisialTypePegawai();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialTypePegawai();
        fixHub = {
            "kode": hub.kode.kode,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaTypePegawai": hub.namaTypePegawai,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/typepegawai/del/' + deleteItem.kode.kode).subscribe(response => {
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
}

class InisialTypePegawai implements TypePegawai {

    constructor(
        public kode?,
        public kodeExternal?,
        public namaExternal?,
        public namaTypePegawai?,
        public reportDisplay?,
        public statusEnabled?,
        public version?,
        public Version?,
        public id?,
        public kodeTypePegawai?
        ) { }

}
