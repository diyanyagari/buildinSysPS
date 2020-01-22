import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisKomponenIndex, SelectedItem } from './jenis-komponen-index.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, FileService } from '../../../global';
@Component({
  selector: 'app-jenis-komponen-index',
  templateUrl: './jenis-komponen-index.component.html',
  styleUrls: ['./jenis-komponen-index.component.scss'],
  providers: [ConfirmationService]
})
export class JenisKomponenIndexComponent implements OnInit {
  selected: JenisKomponenIndex;
    listJenisKomponen: SelectedItem[];
    // listDepartemen: SelectedItem[];
    listData: JenisKomponenIndex[];
    versi: any;
    form: FormGroup;
    formAktif: boolean;
    pencarian: string;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService) { }


    ngOnInit() {
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaJenisKomponen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl(''),
            'kdJenisKomponenHead': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('')
        });
        this.items = [
            {
                label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                    this.downloadPdf();
                }
            },
            {
                label: 'Exel', icon: 'fa-file-excel-o', command: () => {
                    this.downloadExel();
                }
            }];
    }
    downloadExel() {


    }

    downloadPdf() {

    }
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisKomponen&sort=desc&namaJenisKomponen`=' + this.pencarian).subscribe(table => {
            this.listData = table.data.jeniskomponen;
        });
    }
    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAll?page=1&rows=10&dir=namaJenisKomponen&sort=desc').subscribe(table => {
            this.listData = table.JenisKomponen;
            this.totalRecords = table.totalRow;
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisKomponen&select=namaJenisKomponen,id').subscribe(res => {
            this.listJenisKomponen = [];
            this.listJenisKomponen.push({ label: '--Silahkan Pilih Jenis Komponen Index--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listJenisKomponen.push({ label: res.data.data[i].namaJenisKomponen, value: res.data.data[i].id.kode })
            };

        });

    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Komponen Index');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/jeniskomponen/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/jeniskomponen/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
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
    reset() {
        this.ngOnInit();
    }
    onRowSelect(event) {
        this.formAktif = false;
        let cloned = this.clone(event.data);
        this.form.setValue(cloned);
    }
    clone(cloned: JenisKomponenIndex): JenisKomponenIndex {
        let hub = new InisialJenisKomponenIndex();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialJenisKomponenIndex();
        fixHub = {
            "kode": hub.kode.kode,
            "namaJenisKomponen": hub.namaJenisKomponen,
            "reportDisplay": hub.reportDisplay,
            "noUrut": hub.noUrut,
            "kdJenisKomponenHead": hub.kdJenisKomponenHead,
         
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/jeniskomponen/del/' + deleteItem.kode.kode).subscribe(response => {
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

class InisialJenisKomponenIndex implements JenisKomponenIndex {

    constructor(
        public kode?,
        public namaJenisKomponen?,
        public reportDisplay?,
        public noUrut?,
        public kdJenisKomponenHead?,
        // public kdDepartemen?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id?
    ) { }

}