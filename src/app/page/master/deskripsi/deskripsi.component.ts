import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Deskripsi } from './deskripsi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-deskripsi',
    templateUrl: './deskripsi.component.html',
    styleUrls: ['./deskripsi.component.scss'],
    providers: [ConfirmationService]
})
export class DeskripsiComponent implements OnInit {
    kdJenisDeskripsi: any[];
    kdKategoryDeskripsi: any[];
    selected: Deskripsi;
    listData: Deskripsi[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
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
            },

        ];
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaDeskripsi': new FormControl('', Validators.required),
            'kdJenisDeskripsi': new FormControl('', Validators.required),
            'detailDeskripsi': new FormControl(''),
            'kdKategoryDeskripsi': new FormControl(''),
            'noUrut': new FormControl(''),

            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.form.get('noUrut').disable();
        this.getSmbrFile();
    }
    downloadExcel() {
        // this.httpService.get(Configuration.get().dataMasterNew + '/deskripsi/findAll?page=' + page + '&rows=' + rows + '&sort=kode.kode,namaDeskripsi,detailDeskripsi,namaJenisDeskripsi,namaKategoryDeskripsi,noUrut,statusEnabled').subscribe(table => {
        //     this.listData = table.Deskripsi;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         this.codes.push({

        //             kode: this.listData[i].kode.kode,
        //             namaDeskripsi: this.listData[i].namaDeskripsi,
        //             detailDeskripsi: this.listData[i].detailDeskripsi,
        //             namaJenisDeskripsi: this.listData[i].namaJenisDeskripsi,
        //             namaKategoryDeskripsi: this.listData[i].namaKategoryDeskripsi,
        //             noUrut: this.listData[i].noUrut,
        //             statusEnabled: this.listData[i].statusEnabled,

        //         })

        //         debugger;
        //     }
        //     this.fileService.exportAsExcelFile(this.codes, 'Deskripsi');
        // });

    }
    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    downloadPdf() {
        let cetak = Configuration.get().report + '/deskripsi/laporanDeskripsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
        // var title= "Master Deskprisi";
        // var col = ["No", "Nama Deskripsi", "Detail Deskripsi", "Jenis Deskripsi", "Kategori Deskripsi", "Nomor Urut", "Status Enabled"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/deskripsi/findAll?page=' + page + '&rows=' + rows + '&sort=kode.kode,namaDeskripsi,detailDeskripsi,namaJenisDeskripsi,namaKategoryDeskripsi,noUrut,statusEnabled').subscribe(table => {
        //     this.listData = table.Deskripsi;


        //     this.codes = [];


        //     for (let i = 0; i < this.listData.length; i++) {
        //         this.codes.push({

        //             kode: this.listData[i].kode.kode,
        //             namaDeskripsi: this.listData[i].namaDeskripsi,
        //             detailDeskripsi: this.listData[i].detailDeskripsi,
        //             namaJenisDeskripsi: this.listData[i].namaJenisDeskripsi,
        //             namaKategoryDeskripsi: this.listData[i].namaKategoryDeskripsi,
        //             noUrut: this.listData[i].noUrut,
        //             statusEnabled: this.listData[i].statusEnabled,

        //         })

        //         debugger;
        //     }
        //     this.fileService.exportAsPdfFile(title, col, this.codes, "Deskripsi");

        // });

    }
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/deskripsi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.Deskripsi;
            this.totalRecords = table.totalRow;
        });


        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisDeskripsi&select=namaJenisDeskripsi,id').subscribe(res => {
            this.kdJenisDeskripsi = [];
            this.kdJenisDeskripsi.push({ label: '--Pilih Jenis Deskripsi--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdJenisDeskripsi.push({ label: res.data.data[i].namaJenisDeskripsi, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryDeskripsi&select=namaKategoryDeskripsi,id').subscribe(res => {
            this.kdKategoryDeskripsi = [];
            this.kdKategoryDeskripsi.push({ label: '--Pilih Kategory Deskripsi--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdKategoryDeskripsi.push({ label: res.data.data[i].namaKategoryDeskripsi, value: res.data.data[i].id.kode })
            };
        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/deskripsi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDeskripsi&sort=desc&namaDeskripsi=' + this.pencarian).subscribe(table => {
            this.listData = table.Deskripsi;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Deskripsi');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/deskripsi/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let noUrut = this.totalRecords + 1;
            this.form.get('noUrut').enable();
            this.form.get('noUrut').setValue(noUrut);
            this.httpService.post(Configuration.get().dataMasterNew + '/deskripsi/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

    }

    reset() {
        this.form.get('noUrut').disable();
        this.formAktif = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        this.form.get('noUrut').enable();
    }

    clone(cloned: Deskripsi): Deskripsi {
        let hub = new InisialDeskripsi();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialDeskripsi();
        fixHub = {
            'kode': hub.kode.kode,
            'namaDeskripsi': hub.namaDeskripsi,
            'kdJenisDeskripsi': hub.kdJenisDeskripsi,
            'kdKategoryDeskripsi': hub.kdKategoryDeskripsi,
            'detailDeskripsi': hub.detailDeskripsi,
            'noUrut': hub.noUrut,
            'reportDisplay': hub.reportDisplay,
            'namaExternal': hub.namaExternal,
            'kodeExternal': hub.kodeExternal,
            'statusEnabled': hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/deskripsi/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
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
        this.print.showEmbedPDFReport(Configuration.get().report + '/deskripsi/laporanDeskripsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmDeskripsi_laporanCetak');

        // let cetak = Configuration.get().report + '/deskripsi/laporanDeskripsi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
      }
}

class InisialDeskripsi implements Deskripsi {

    constructor(
        public detailDeskripsi?,
        public noUrut?,
        public kdKategoryDeskripsi?,
        public namaDeskripsi?,
        public kdJenisDeskripsi?,
        public kdJenisProduk?,

        public kode?,
        public id?,
        public kdProfile?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
    ) { }

}
