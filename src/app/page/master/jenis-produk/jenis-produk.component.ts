import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisProduk } from './jenis-produk.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-jenis-produk',
    templateUrl: './jenis-produk.component.html',
    styleUrls: ['./jenis-produk.component.scss'],
    providers: [ConfirmationService]
})
export class JenisProdukComponent implements OnInit {

    listJenisProduk: any[];
    kdKelompokProduk: any[];
    kdAccount: any[];
    selected: JenisProduk;
    listData: JenisProduk[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    report: any;
    toReport: any;
    page: number;
    rows: number;
    totalRecords: number;

    items: any[];
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
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


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
            'kode': new FormControl(''),
            'namaJenisProduk': new FormControl('', Validators.required),
            // 'kdKelompokProduk': new FormControl('', Validators.required),
            // 'kdAccount': new FormControl(''),
            'kdJenisProdukHead': new FormControl(null),

            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });

        this.items = [
        {
          label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
            this.downloadPdf();
        }    },
        {
          label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
            this.downloadExcel();
        }    },

        ];
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
    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisproduk/findAll?page=' + page + '&rows=' + rows + '&dir=namaJenisProduk&sort=desc').subscribe(table => {
            this.listData = table.JenisProduk;
            this.totalRecords = table.totalRow;
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokProduk&select=namaKelompokProduk,id').subscribe(res => {
            this.kdKelompokProduk = [];
            this.kdKelompokProduk.push({ label: '--Pilih Kelompok Produk--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdKelompokProduk.push({ label: res.data.data[i].namaKelompokProduk, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ChartOfAccount&select=namaAccount,id').subscribe(res => {
            this.kdAccount = [];
            this.kdAccount.push({ label: '--Pilih Akun--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdAccount.push({ label: res.data.data[i].namaAccount, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisProduk&select=namaJenisProduk,id').subscribe(res => {
            this.listJenisProduk = [];
            this.listJenisProduk.push({ label: '--Pilih Data Parent Jenis Produk--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listJenisProduk.push({ label: res.data.data[i].namaJenisProduk, value: res.data.data[i].id.kode })
            };
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian)
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisproduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisProduk&sort=desc&namaJenisProduk=' + this.pencarian).subscribe(table => {
            this.listData = table.JenisProduk;
        });
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Produk');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/jenisproduk/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/jenisproduk/save?', this.form.value).subscribe(response => {
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
        console.log(this.form.value);
    }
    clone(cloned: JenisProduk): JenisProduk {
        let hub = new InisialJenisProduk();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialJenisProduk();
        fixHub = {
            'kode': hub.kode.kode,
            'namaJenisProduk': hub.namaJenisProduk,
            // 'kdKelompokProduk': hub.kdKelompokProduk,
            // 'kdAccount': hub.kdAccount,
            'kdJenisProdukHead': hub.kdJenisProdukHead,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/jenisproduk/del/' + deleteItem.kode.kode).subscribe(response => {
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

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenisproduk/findAll?').subscribe(table => {
          this.listData = table.JenisProduk;
          this.codes = [];

          for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
          this.codes.push({

            kode: this.listData[i].kode.kode,
            namaJenisProduk: this.listData[i].namaJenisProduk,
            reportDisplay: this.listData[i].reportDisplay,
            kodeExternal: this.listData[i].kodeExternal,
            namaExternal: this.listData[i].namaExternal,
            statusEnabled: this.listData[i].statusEnabled

        })
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'JenisProduk');
});

    }

    downloadPdf(){
        let b = Configuration.get().report + '/jenisProduk/laporanJenisProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisProduk/laporanJenisProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisProduk_laporanCetak');

        // let b = Configuration.get().report + '/jenisProduk/laporanJenisProduk.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialJenisProduk implements JenisProduk {

    constructor(
        public namaJenisProduk?,
        public kdKelompokProduk?,
        public kdAccount?,
        public kdJenisProdukHead?,
        // public kdDepartemen?,

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