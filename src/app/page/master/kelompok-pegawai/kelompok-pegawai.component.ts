import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokPegawai } from './kelompok-pegawai.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService  } from '../../../global';
@Component({
    selector: 'app-kelompok-pegawai',
    templateUrl: './kelompok-pegawai.component.html',
    styleUrls: ['./kelompok-pegawai.component.scss'],
    providers: [ConfirmationService]
})
export class KelompokPegawaiComponent implements OnInit {
    selected: KelompokPegawai;
    listData: KelompokPegawai[];
    pencarian: string;
    items: any;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    page: number;
    rows: number;
    report: any;
    toReport: any;
    form: FormGroup;
    totalRecords: number;

    codes: any[];

    kdprof: any;
    kddept: any;
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
            'namaKelompokPegawai': new FormControl('', Validators.required),
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
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokpegawai/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKelompokPegawai&sort=desc').subscribe(table => {
            this.listData = table.KelompokPegawai;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
            this.codes.push({

                kode: this.listData[i].kode.kode,
                namaKelompokPegawai: this.listData[i].namaKelompokPegawai,
                reportDisplay: this.listData[i].reportDisplay,
                kodeExternal: this.listData[i].kodeExternal,
                namaExternal: this.listData[i].namaExternal,
                statusEnabled: this.listData[i].statusEnabled

            })
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'Kelompok Pegawai');
});

    }

    valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }


//     downloadPdf() {
//         var col = ["Kode", "Nama", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
//         this.httpService.get(Configuration.get().dataMasterNew + '/kelompokpegawai/findAll?').subscribe(table => {
//             this.listData = table.KelompokPegawai;
//             this.codes = [];

//             for (let i = 0; i < this.listData.length; i++) {
//         // if (this.listData[i].statusEnabled == true){
//             this.codes.push({

//                 kode: this.listData[i].kode.kode,
//                 namaKelompokPegawai: this.listData[i].namaKelompokPegawai,
//                 reportDisplay: this.listData[i].reportDisplay,
//                 kodeExternal: this.listData[i].kodeExternal,
//                 namaExternal: this.listData[i].namaExternal,
//                 statusEnabled: this.listData[i].statusEnabled

//             })
//         // }
//     }
//     this.fileService.exportAsPdfFile("Master Kelompok Pegawai", col,this.codes, "Kelompok Pegawai");

// });

//     }

downloadPdf(){
    let b = Configuration.get().report + '/kelompokPegawai/laporanKelompokPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

    window.open(b);
}

cetak() {
    this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokPegawai/laporanKelompokPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelompokPegawai_laporanCetak');
        // let b = Configuration.get().report + '/kelompokPegawai/laporanKelompokPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokpegawai/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.KelompokPegawai;
            this.totalRecords = table.totalRow;
        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokpegawai/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokPegawai&sort=desc&namaKelompokPegawai=' + this.pencarian).subscribe(table => {
            this.listData = table.KelompokPegawai;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Pegawai');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/kelompokpegawai/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/kelompokpegawai/save?', this.form.value).subscribe(response => {
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

    clone(cloned: KelompokPegawai): KelompokPegawai {
        let hub = new InisialKelompokPegawai();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKelompokPegawai();
        fixHub = {
            "kode": hub.kode.kode,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaKelompokPegawai": hub.namaKelompokPegawai,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokpegawai/del/' + deleteItem.kode.kode).subscribe(response => {
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

class InisialKelompokPegawai implements KelompokPegawai {

    constructor(
        public kdKelompokPegawaiHead?,
        public id?,
        public kdProfile?,
        public kode?,
        public namaKelompokPegawai?,
        public kelompokPegawai?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public ReportDisplay?,
        public kodeKelompokPegawai?,
        public version?
        ) { }

}