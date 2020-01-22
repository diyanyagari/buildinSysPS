import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { DetailJenisProduk } from './detail-jenis-produk.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
    selector: 'app-detail-jenis-produk',
    templateUrl: './detail-jenis-produk.component.html',
    styleUrls: ['./detail-jenis-produk.component.scss'],
    providers: [ConfirmationService]
})
export class DetailJenisProdukComponent implements OnInit {

    kdJenisProduk: any[];
    kdAccount: any[];
    selected: DetailJenisProduk;
    listData: DetailJenisProduk[];
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
    codes: any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService) {

    }

    ngOnInit() {
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
            'namaDetailJenisProduk': new FormControl('', Validators.required),
            // 'kdJenisProduk': new FormControl('', Validators.required),
            'persenHargaCito': new FormControl(0),
            // 'kdAccount': new FormControl(''),
            // 'isRegistrasiAset': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }
    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
            this.listData = table.data.data;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                /*this.codes.push({

                    kode: this.listData[i].id_kode,
                    namaAgama: this.listData[i].namaAgama,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,

                })*/

                debugger;
            }
            this.fileService.exportAsExcelFile(this.codes, 'Agama');
        });

    }

    downloadPdf() {
        var col = ["Kode", "Nama Agama", "Kode External", "Nama External"];
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
            this.listData = table.data.data;


            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                /*this.codes.push({

                    code: this.listData[i].id_kode,
                    nama: this.listData[i].namaAgama,
                    kodeEx: this.listData[i].kodeExternal,
                    namaEx: this.listData[i].namaExternal,

                })*/

                debugger;
            }
            this.fileService.exportAsPdfFile("Master Agama", col, this.codes, "Agama");

        });

    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/detailProduk/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.DetailJenisProduk;
            this.totalRecords = table.totalRow;
        });


        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisProduk&select=namaJenisProduk,id').subscribe(res => {
            this.kdJenisProduk = [];
            this.kdJenisProduk.push({ label: '--Pilih Jenis Produk--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdJenisProduk.push({ label: res.data.data[i].namaJenisProduk, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ChartOfAccount&select=namaAccount,id').subscribe(res => {
            this.kdAccount = [];
            this.kdAccount.push({ label: '--Pilih Akun--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdAccount.push({ label: res.data.data[i].namaAccount, value: res.data.data[i].id.kode })
            };
        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/detailProduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDetailJenisProduk&sort=desc&namaDetailJenisProduk=' + this.pencarian).subscribe(table => {
            this.listData = table.DetailJenisProduk;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master <br/> Detail Jenis Produk');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/detailProduk/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/detailProduk/save?', this.form.value).subscribe(response => {
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

    clone(cloned: DetailJenisProduk): DetailJenisProduk {
        let hub = new InisialDetailJenisProduk();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialDetailJenisProduk();
        fixHub = {
            'kode': hub.kode.kode,
            'namaDetailJenisProduk': hub.namaDetailJenisProduk,
            // 'kdJenisProduk': hub.kdJenisProduk,
            'persenHargaCito': hub.persenHargaCito,
            // 'kdAccount': hub.kdAccount,
            // 'isRegistrasiAset': hub.isRegistrasiAset,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/detailProduk/del/' + deleteItem.kode.kode).subscribe(response => {
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

class InisialDetailJenisProduk implements DetailJenisProduk {

    constructor(
        public kdJenisProduk?,
        public persenHargaCito?,
        public kdAccount?,
        public namaDetailJenisProduk?,
        // public kdDepartemen?,
        public isRegistrasiAset?,

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