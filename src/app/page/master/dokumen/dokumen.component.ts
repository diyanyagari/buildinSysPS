import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Dokumen } from './dokumen.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-dokumen',
    templateUrl: './dokumen.component.html',
    styleUrls: ['./dokumen.component.scss'],
    providers: [ConfirmationService]
})
export class DokumenComponent implements OnInit {
    selected: Dokumen;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    jenisDokumen: Dokumen[];
    lokasiDokumen: Dokumen[];
    kategoriDokumen: Dokumen[];
    dokumenHead: Dokumen[];
    ruangan: Dokumen[];
    pegawaiPembuat: Dokumen[];
    status: Dokumen[];
    departemen: Dokumen[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    resFile: string;
    namaFile: string;
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des' ];
    laporan: boolean = false;
    codes: any[];
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
        this.get(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'noDokumen': new FormControl(''),
            'namaDokumen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'deskripsiDokumen': new FormControl(''),
            'tglDokumen': new FormControl(''),
            'kdJenisDokumen': new FormControl('', Validators.required),
            'kdKategoryDokumen': new FormControl('', Validators.required),
            'kdLokasi': new FormControl(''),
            'pathFile': new FormControl(''),
            'qtyLampiran': new FormControl(''),
            'kdDokumenHead': new FormControl(null),
            'kdRuangan': new FormControl('', Validators.required),
            // 'kdPegawaiPembuat': new FormControl(''),
            'isDokumenInOutInt': new FormControl(''),
            'retensiDokumenTahun': new FormControl(''),
            'kdStatus': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required)
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?page=1&rows=10&dir=namaStatus&sort=desc').subscribe(res => {
            this.status = [];
            this.status.push({ label: '--Pilih Status--', value: '' })
            for (var i = 0; i < res.Status.length; i++) {
                this.status.push({ label: res.Status[i].namaStatus, value: res.Status[i].kode.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Departemen&select=namaDepartemen,id').subscribe(res => {
            this.departemen = [];
            this.departemen.push({ label: '--Pilih Departemen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.departemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisDokumen&select=namaJenisDokumen,id').subscribe(res => {
            this.jenisDokumen = [];
            this.jenisDokumen.push({ label: '--Pilih Jenis Dokumen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.jenisDokumen.push({ label: res.data.data[i].namaJenisDokumen, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryDokumen&select=namaKategoryDokumen,id').subscribe(res => {
            this.kategoriDokumen = [];
            this.kategoriDokumen.push({ label: '--Pilih Kategori Dokumen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kategoriDokumen.push({ label: res.data.data[i].namaKategoryDokumen, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Lokasi&select=namaLokasi,id').subscribe(res => {
            this.lokasiDokumen = [];
            this.lokasiDokumen.push({ label: '--Pilih Lokasi Dokumen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.lokasiDokumen.push({ label: res.data.data[i].namaLokasi, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Dokumen&select=namaDokumen,id').subscribe(res => {
            this.dokumenHead = [];
            this.dokumenHead.push({ label: '--Pilih Data Parent Dokumen--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.dokumenHead.push({ label: res.data.data[i].namaDokumen, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.authGuard.getUserDto().kdLokasi).subscribe(res => {
            this.ruangan = [];
            this.ruangan.push({ label: '--Pilih Unit Kerja--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.ruangan.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id_kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pegawai&select=namaLengkap,id').subscribe(res => {
            this.pegawaiPembuat = [];
            this.pegawaiPembuat.push({ label: '--Pilih Pegawai--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.pegawaiPembuat.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id.kode })
            };
        });
        this.getSmbrFile();

    }
    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    timeStampToDate(timestamp){
        let d = new Date(timestamp*1000);
        // let f = new SimpleDateFormat("dd/MM/yyyy");
        // let formatteddate = f.format(d);
        let monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
        // let formatteddate = d.getDay() + ' ' + monthname[d.getMonth()] + ' ' + d.getFullYear();
        let formatteddate = d;
        return formatteddate;
    }

    getDate(date){
        let dd = new Date(date * 1000);

        let d =  dd.getDate();
        let m = dd.getMonth();
        let y = dd.getFullYear();

        return ((d < 10) ? ('0'+d) : d) + ' ' + this.month[m]  + ' ' + y;  
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=1&rows=10&dir=namaDokumen&sort=desc').subscribe(table => {
            this.listData = table.Dokumen;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                      // if (this.listData[i].statusEnabled == true){
                        this.codes.push({

                            kode: this.listData[i].kode.kode,
                            namaDokumenHead: this.listData[i].namaDokumenHead,
                            noDokumen: this.listData[i].noDokumen,
                            namaDokumen: this.listData[i].namaDokumen,
                            deskripsiDokumen: this.listData[i].deskripsiDokumen,
                            tglDokumen: this.getDate(this.listData[i].tglDokumen),
                            namaJenisDokumen: this.listData[i].namaJenisDokumen,
                            namaKategoryDokumen: this.listData[i].namaKategoryDokumen,
                            namaLokasi: this.listData[i].namaLokasi,
                            pathFile: this.listData[i].pathFile,
                            qtyLampiran: this.listData[i].qtyLampiran,
                            namaRuangan: this.listData[i].namaRuangan,
                            isDokumenInOutInt: this.listData[i].isDokumenInOutInt,
                            retensiDokumenTahun: this.listData[i].retensiDokumenTahun,
                            namaStatus: this.listData[i].namaStatus,
                            reportDisplay: this.listData[i].reportDisplay,
                            kodeExternal: this.listData[i].kodeExternal,
                            namaExternal: this.listData[i].namaExternal,
                            statusEnabled: this.listData[i].statusEnabled

                        })
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'Dokumen');
});
    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/dokumen/laporanDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
        // var col = ["Kode", "Parent", "Nomor", "Nama ", "Deskripsi ", " Tanggal", "Jenis", "Kategori",
        // "Lokasi", "Path File", "Quantity Lampiran", "Unit Kerja", "Dokumen Keluar Masuk", "Retensi Dokumen", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=1&rows=10&dir=namaDokumen&sort=desc').subscribe(table => {
        //     this.listData = table.Dokumen;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         if (this.listData[i].statusEnabled == true){
        //             // let tglDokumen = 
        //             this.codes.push({

        //                 kode: this.listData[i].kode.kode,
        //                 namaDokumenHead: this.listData[i].namaDokumenHead,
        //                 noDokumen: this.listData[i].noDokumen,
        //                 namaDokumen: this.listData[i].namaDokumen,
        //                 deskripsiDokumen: this.listData[i].deskripsiDokumen,
        //                 tglDokumen:  this.getDate(this.listData[i].tglDokumen),
        //                 namaJenisDokumen: this.listData[i].namaJenisDokumen,
        //                 namaKategoryDokumen: this.listData[i].namaKategoryDokumen,
        //                 namaLokasi: this.listData[i].namaLokasi,
        //                 pathFile: this.listData[i].pathFile,
        //                 qtyLampiran: this.listData[i].qtyLampiran,
        //                 namaRuangan: this.listData[i].namaRuangan,
        //                 isDokumenInOutInt: this.listData[i].isDokumenInOutInt,
        //                 retensiDokumenTahun: this.listData[i].retensiDokumenTahun,
        //                 namaStatus: this.listData[i].namaStatus,
        //                 reportDisplay: this.listData[i].reportDisplay,
        //                 kodeExternal: this.listData[i].kodeExternal,
        //                 namaExternal: this.listData[i].namaExternal,
        //                 statusEnabled: this.listData[i].statusEnabled


        //             })
        //         }
        //     }
        //     this.fileService.exportAsPdfFile("Master Dokumen", col, this.codes, "Dokumen");
        // });

    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.Dokumen;
            this.totalRecords = table.totalRow;
        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDokumen&sort=desc&namaDokumen=' + this.pencarian).subscribe(table => {
            this.listData = table.Dokumen;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Dokumen');
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

    urlUpload() {
        return Configuration.get().resourceFile + '/file/upload?noProfile=false';
    }

    fileUpload(event) {
        this.resFile = event.xhr.response;
        this.namaFile = this.resFile.toString();
        this.form.controls["pathFile"].setValue(this.namaFile);
    }

    addHeader(event) {
        this.httpService.beforeUploadFile(event);
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
        let tglDokumen = this.setTimeStamp(this.form.get('tglDokumen').value)

        let formSubmit = this.form.value;
        formSubmit.tglDokumen = tglDokumen;
        this.httpService.update(Configuration.get().dataMasterNew + '/dokumen/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let tglDokumen = this.setTimeStamp(this.form.get('tglDokumen').value)

            let formSubmit = this.form.value;
            formSubmit.tglDokumen = tglDokumen;

            this.httpService.post(Configuration.get().dataMasterNew + '/dokumen/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

    }
    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
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
    clone(cloned: Dokumen): Dokumen {
        let hub = new InisialDokumen();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialDokumen();
        if (hub.tglDokumen == null || hub.tglDokumen==0){
            fixHub = {
                "kode": hub.kode.kode,
                "deskripsiDokumen": hub.deskripsiDokumen,
                "reportDisplay": hub.reportDisplay,
                "isDokumenInOutInt": hub.isDokumenInOutInt,
                "kdDokumenHead": hub.kdDokumenHead,
                "kdJenisDokumen": hub.kdJenisDokumen,
                "kdKategoryDokumen": hub.kdKategoryDokumen,
                "kdLokasi": hub.kdLokasi,
            // "kdPegawaiPembuat": hub.kdPegawaiPembuat,
            "kdRuangan": hub.kdRuangan,
            "kdStatus": hub.kdStatus,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaDokumen": hub.namaDokumen,
            "noDokumen": hub.noDokumen,
            "pathFile": hub.pathFile,
            "qtyLampiran": hub.qtyLampiran,
            "retensiDokumenTahun": hub.retensiDokumenTahun,
            "statusEnabled": hub.statusEnabled,
            "tglDokumen": null,

        }
        this.versi = hub.version;
        return fixHub;
    } else{
        fixHub = {
            "kode": hub.kode.kode,
            "deskripsiDokumen": hub.deskripsiDokumen,
            "reportDisplay": hub.reportDisplay,
            "isDokumenInOutInt": hub.isDokumenInOutInt,
            "kdDokumenHead": hub.kdDokumenHead,
            "kdJenisDokumen": hub.kdJenisDokumen,
            "kdKategoryDokumen": hub.kdKategoryDokumen,
            "kdLokasi": hub.kdLokasi,
            // "kdPegawaiPembuat": hub.kdPegawaiPembuat,
            "kdRuangan": hub.kdRuangan,
            "kdStatus": hub.kdStatus,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaDokumen": hub.namaDokumen,
            "noDokumen": hub.noDokumen,
            "pathFile": hub.pathFile,
            "qtyLampiran": hub.qtyLampiran,
            "retensiDokumenTahun": hub.retensiDokumenTahun,
            "statusEnabled": hub.statusEnabled,
            "tglDokumen": new Date(hub.tglDokumen* 1000),

        }
        this.versi = hub.version;
        return fixHub;
    }
}
hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/dokumen/del/' + deleteItem.kode.kode).subscribe(response => {
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

cetak(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/dokumen/laporanDokumen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmDokumen_laporanCetak');
}

tutupLaporan() {
    this.laporan = false;
}


}

class InisialDokumen implements Dokumen {

    constructor(
        public noRec?,
        public kdDepartemen?,
        public dokumen?,
        public deskripsiDokumen?,
        public isDokumenInOutInt?,
        public kdDokumenHead?,
        public kdJenisDokumen?,
        public kdKategoryDokumen?,
        public kdLokasi?,
        public kdPegawaiPembuat?,
        public kdRuangan?,
        public kdStatus?,
        public id?,
        public kode?,
        public namaDokumen?,
        public kodeExternal?,
        public namaExternal?,
        public dokumenHead?,
        public namaJudulDokumen?,
        public noDokumen?,
        public pathFile?,
        public pegawaiPembuat?,
        public qtyLampiran?,
        public reportDisplay?,
        public retensiDokumenTahun?,
        public statusEnabled?,
        public tglDokumen?,
        public version?
        ) { }

}