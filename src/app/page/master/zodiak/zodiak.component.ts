import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Zodiak } from './zodiak.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-zodiak',
    templateUrl: './zodiak.component.html',
    styleUrls: ['./zodiak.component.scss'],
    providers: [ConfirmationService]
})
export class ZodiakComponent implements OnInit {
    selected: Zodiak;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    FilterNegara: string;
    listNegara: Zodiak[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;

    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    codes:any[];
    listData2:any[];
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
        this.selected = null;
        this.FilterNegara = '';
        this.pencarian = '';
        this.formAktif = true;
        this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
        this.versi = null;
        this.form = this.fb.group({
            'jamLahirAwal': new FormControl(''),
            'noUrut': new FormControl('', Validators.required),
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaZodiak': new FormControl('', Validators.required),
            'jamLahirAkhir': new FormControl(''),
            'kdNegara': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.listNegara = [];
        this.listNegara.push({ label: '--Pilih Negara--', value: '' })
        this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
            for (var i = 0; i < res.Negara.length; i++) {
                this.listNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
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
    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/zodiak/findAll?').subscribe(table => {
            this.listData2 = table.Zodiak;
            this.codes = [];

            for (let i = 0; i<this.listData2.length; i++){
                this.codes.push({
                  kode: this.listData2[i].kode.kode,
                  namaZodiak: this.listData2[i].namaZodiak,
                  noUrut: this.listData2[i].noUrut,
                  jamLahirAwal: this.listData2[i].jamLahirAwal,
                  jamLahirAkhir: this.listData2[i].jamLahirAkhir,
                  namaNegara: this.listData2[i].namaNegara,
                  reportDisplay: this.listData2[i].reportDisplay,
                  kodeExternal: this.listData2[i].kodeExternal,
                  namaExternal: this.listData2[i].namaExternal,
                  statusEnabled: this.listData2[i].statusEnabled
              })
            }
            this.fileService.exportAsExcelFile(this.codes, 'Shio');
        });

    }

    downloadPdf(){
        let b = Configuration.get().report + '/shio/laporanShio.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }
    tutupLaporan() {
        this.laporan = false;
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/shio/laporanShio.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmShio_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/shio/laporanShio.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }

    // downloadPdf() {
    //     var col = ["Kode", "Nama", "Nomor Urut", "Jam Lahir Awal", "Jam Lahir Akhir", "Negara", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
    //     this.httpService.get(Configuration.get().dataMasterNew + '/zodiak/findAll?').subscribe(table => {
    //         this.listData2 = table.Zodiak;
    //         this.codes = [];

    //         for (let i = 0; i<this.listData2.length; i++){
    //             this.codes.push({
    //               kode: this.listData2[i].kode.kode,
    //               namaZodiak: this.listData2[i].namaZodiak,
    //               noUrut: this.listData2[i].noUrut,
    //               jamLahirAwal: this.listData2[i].jamLahirAwal,
    //               jamLahirAkhir: this.listData2[i].jamLahirAkhir,
    //               namaNegara: this.listData2[i].namaNegara,
    //               reportDisplay: this.listData2[i].reportDisplay,
    //               kodeExternal: this.listData2[i].kodeExternal,
    //               namaExternal: this.listData2[i].namaExternal,
    //               statusEnabled: this.listData2[i].statusEnabled
    //           })
    //         }
    //         this.fileService.exportAsPdfFile("Master Shio", col, this.codes, "Shio");

    //     });

    // }

    get(page: number, rows: number, search: any, filter: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/zodiak/findAll?page=' + page + '&rows=' + rows + '&dir=namaZodiak&sort=desc&namaZodiak='+ search +'&kdNegara='+filter).subscribe(table => {
            this.listData = table.Zodiak;
            this.totalRecords = table.totalRow;

        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/zodiak/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaZodiak&sort=desc&namaZodiak=' + this.pencarian +'&kdNegara='+this.FilterNegara).subscribe(table => {
            this.listData = table.Zodiak;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Shio');
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
        // let jamLahirAwal = this.setTimeStamp(this.form.get('jamLahirAwal').value)
        // let jamLahirAkhir = this.setTimeStamp(this.form.get('jamLahirAkhir').value)

        // let formSubmit = this.form.value;
        // formSubmit.jamLahirAwal = jamLahirAwal;
        // formSubmit.jamLahirAkhir = jamLahirAkhir;
        this.httpService.update(Configuration.get().dataMasterNew + '/zodiak/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            // let jamLahirAwal = this.setTimeStamp(this.form.get('jamLahirAwal').value)
            // let jamLahirAkhir = this.setTimeStamp(this.form.get('jamLahirAkhir').value)

            // let formSubmit = this.form.value;
            // formSubmit.jamLahirAwal = jamLahirAwal;
            // formSubmit.jamLahirAkhir = jamLahirAkhir;
            this.httpService.post(Configuration.get().dataMasterNew + '/zodiak/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
                // this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

    }
    setTimeStamp(date) {
        if (date == null || date == undefined || date == '') {
            let dataTimeStamp = (new Date().getTime() / 1000);
            return dataTimeStamp.toFixed(0);
        } else {
            let dataTimeStamp = (new Date(date).getTime() / 1000);
            return dataTimeStamp.toFixed(0);
        }
    }

//     setTimeStamp(date) {
//     let dataTimeStamp = (new Date(date).getTime() / 1000);
//     return dataTimeStamp;
//   }

reset() {
    this.formAktif = true;
    this.ngOnInit();
}
onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

}
clone(cloned: Zodiak): Zodiak {
    let hub = new InisialZodiak();
    for (let prop in cloned) {
        hub[prop] = cloned[prop];
    }
    let fixHub = new InisialZodiak();
    fixHub = {
        "kode": hub.kode.kode,
        "namaZodiak": hub.namaZodiak,
        "noUrut": hub.noUrut,
            // "jamLahirAwal": new Date(hub.jamLahirAwal * 1000),
            // "jamLahirAkhir": new Date(hub.jamLahirAkhir * 1000),
            "jamLahirAwal": hub.jamLahirAwal,
            "jamLahirAkhir": hub.jamLahirAkhir,
            "kdNegara": hub.kode.kdNegara,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/zodiak/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
            // this.get(this.page, this.rows, this.pencarian);
        });


    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialZodiak implements Zodiak {

    constructor(
        public namaZodiak?,
        public id?,
        public noUrut?,
        public kode?,
        public kdPangkat?,
        public namaPangkat?,
        public jamLahirAwal?,
        public jamLahirAkhir?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public kdNegara?,
        public version?

        ) { }

}
