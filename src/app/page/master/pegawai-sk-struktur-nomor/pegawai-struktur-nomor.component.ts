import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiStrukturNomor } from './pegawai-struktur-nomor.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
    selector: 'app-pegawai-struktur-nomor',
    templateUrl: './pegawai-struktur-nomor.component.html',
    styleUrls: ['./pegawai-struktur-nomor.component.scss'],
    providers: [ConfirmationService]
})
export class PegawaiStrukturNomorComponent implements OnInit {
    item: PegawaiStrukturNomor = new InisialPegawaiStrukturNomor();
    selected: PegawaiStrukturNomor;
    listData: any[];
    codes: PegawaiStrukturNomor[];
    dataDummy: {};
    formAktif: boolean;
    kodeGolonganPegawai: PegawaiStrukturNomor[];
    ruangan: PegawaiStrukturNomor[];
    versi: any;
    form: FormGroup;
    items: any;

    kode: any;
    id: any;
    page: number;
    id_kode: any;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    pencarian: string = '';

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
        this.getPage(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
            'namaSuratKeputusan': new FormControl(''),
            'noSK': new FormControl(''),
            'tglBerlakuAwal': new FormControl(''),
            'tglBerlakuAkhir': new FormControl('', Validators.required),
            'kdKategoryPegawai': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });

    }

    valuechange(newValue) {
        //  this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
            this.listData = table.data.data;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                this.codes.push({

                    kode: this.listData[i].id_kode,
                    namaAgama: this.listData[i].namaAgama,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,

                })

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
                this.codes.push({

                    code: this.listData[i].id_kode,
                    nama: this.listData[i].namaAgama,
                    kodeEx: this.listData[i].kodeExternal,
                    namaEx: this.listData[i].namaExternal,

                })

                debugger;
            }
            this.fileService.exportAsPdfFile("Master Agama", col, this.codes, "Agama");

        });

    }
    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/agama/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            //this.listData = table.Agama;
            //this.totalRecords = table.totalRow;

        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/agama/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaAgama&sort=desc&namaAgama=' + this.pencarian).subscribe(table => {
            this.listData = table.Agama;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Agama');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapus();
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
            }
        });
    }
    update() {
        this.httpService.update(Configuration.get().dataMasterNew + '/agama/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/agama/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getPage(this.page, this.rows, this.pencarian);
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
    clone(cloned: PegawaiStrukturNomor): PegawaiStrukturNomor {
        let hub = new InisialPegawaiStrukturNomor();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialPegawaiStrukturNomor();
        fixHub = {
            "kode": hub.kode.kode,
            "namaAgama": hub.namaAgama,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/agama/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPage(this.page, this.rows, this.pencarian);
        });
        this.reset();
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialPegawaiStrukturNomor implements PegawaiStrukturNomor {

    constructor(
        public agama?,
        public id?,
        public kdProfile?,
        public kode?,
        public kdAgama?,
        public namaAgama?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id_kode?,
        public code?,
        public nama?,
        public kodeEx?,
        public namaEx?

    ) { }

}