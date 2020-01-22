import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokProduk } from './kelompok-produk.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';
@Component({
    selector: 'app-kelompok-produk',
    templateUrl: './kelompok-produk.component.html',
    styleUrls: ['./kelompok-produk.component.scss'],
    providers: [ConfirmationService]
})
export class KelompokProdukComponent implements OnInit {
    kdJenisTransaksi: any[];
    selected: KelompokProduk;
    listData: KelompokProduk[];
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
    cekIsHavingStok: any;
    isHavingStok: boolean;
    isStock: number;
    isPrice: number;
    cekIsHavingPrice: any;
    isHavingPrice: boolean;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) { }


    ngOnInit() {
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaKelompokProduk': new FormControl('', Validators.required),
            // 'kdJenisTransaksi': new FormControl(''),
            'isHavingPrice': new FormControl(''),
            'isHavingStok': new FormControl(''),

            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
    }
    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokproduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokProduk&sort=desc').subscribe(table => {
            this.listData = table.KelompokProduk;
            this.totalRecords = table.totalRow;
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisTransaksi&select=namaJenisTransaksi,id').subscribe(res => {
            this.kdJenisTransaksi = [];
            this.kdJenisTransaksi.push({ label: '--Pilih Jenis Transaksi--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdJenisTransaksi.push({ label: res.data.data[i].namaJenisTransaksi, value: res.data.data[i].id.kode })
            };
        });
    }
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }
    changeConvert(event) {
        if (event == true) {
            this.cekIsHavingStok = 1
            this.cekIsHavingPrice = 1
        } else {
            this.cekIsHavingStok = 0
            this.cekIsHavingPrice = 0
        }

    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokproduk/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKelompokProduk&sort=desc&namaKelompokProduk=' + this.pencarian).subscribe(table => {
            this.listData = table.KelompokProduk;
        });
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Produk');
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
        if(this.form.get('isHavingStok').value == null || this.form.get('isHavingStok').value == undefined || this.form.get('isHavingStok').value == false) {
               this.isStock = 0;
            } else {
               this.isStock = 1;
            }
            if(this.form.get('isHavingPrice').value == null || this.form.get('isHavingPrice').value == undefined || this.form.get('isHavingPrice').value == false) {
                this.isPrice = 0;
            } else {
                this.isPrice = 1;
            }
        let formSubmit = this.form.value;
            formSubmit.isHavingPrice = this.isPrice;
            formSubmit.isHavingStok = this.isStock;
        this.httpService.update(Configuration.get().dataMasterNew + '/kelompokproduk/update/' + this.versi, formSubmit).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            if(this.form.get('isHavingStok').value == null || this.form.get('isHavingStok').value == undefined || this.form.get('isHavingStok').value == false ) {
               this.isStock = 0;
            } else {
               this.isStock = 1;
            }
            if(this.form.get('isHavingPrice').value == null || this.form.get('isHavingPrice').value == undefined || this.form.get('isHavingPrice').value == false) {
                this.isPrice = 0;
            } else {
                this.isPrice = 1;
            }
            let formSubmit = this.form.value;
            formSubmit.isHavingPrice = this.isPrice;
            formSubmit.isHavingStok = this.isStock;
            this.httpService.post(Configuration.get().dataMasterNew + '/kelompokproduk/save?', formSubmit).subscribe(response => {
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
         //   let cloned = this.clone(event.data);
        //    this.form.setValue(cloned);
        this.formAktif = false;
        if (event.data.isHavingPrice == 1) {
            this.isHavingPrice = true;
            this.cekIsHavingPrice = 1;
        } else {
            this.isHavingPrice = false;
            this.cekIsHavingPrice = 0;
        }
        if (event.data.isHavingStok == 1) {
            this.isHavingStok = true;
            this.cekIsHavingStok = 1;
        } else {
            this.isHavingStok = false;
            this.cekIsHavingStok = 0;
        }

        this.form.get('kode').setValue(event.data.kode.kode),
            this.form.get('namaKelompokProduk').setValue(event.data.namaKelompokProduk),
            this.form.get('namaExternal').setValue(event.data.namaExternal),
            this.form.get('kodeExternal').setValue(event.data.kodeExternal),
            this.form.get('reportDisplay').setValue(event.data.reportDisplay),
            this.form.get('isHavingPrice').setValue(this.isHavingPrice),
            this.form.get('isHavingStok').setValue(this.isHavingStok),
            this.form.get('statusEnabled').setValue(event.data.statusEnabled),
            this.versi = event.data.version;
    }

    /*clone(cloned: KelompokProduk): KelompokProduk {
        let hub = new InisialKelompokProduk();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKelompokProduk();
        fixHub = {
            'kode': hub.kode.kode,
            'namaKelompokProduk': hub.namaKelompokProduk,
            // 'kdJenisTransaksi': hub.kdJenisTransaksi,
            'isHavingStok': hub.isHavingStok,
            'isHavingPrice': hub.isHavingPrice,
     
            'reportDisplay': hub.reportDisplay,
            'namaExternal': hub.namaExternal,
            'kodeExternal': hub.kodeExternal,
            'statusEnabled': hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }*/
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokproduk/del/' + deleteItem.kode.kode).subscribe(response => {
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

class InisialKelompokProduk implements KelompokProduk {

    constructor(
        public namaKelompokProduk?,
        public kdJenisTransaksi?,
        public isHavingStok?,
        public isHavingPrice?,

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