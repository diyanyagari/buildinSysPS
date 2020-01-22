import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
//import { DiklatJurusan } from './diklat-jurusan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
    selector: 'app-diklat-jurusan',
    templateUrl: './diklat-jurusan.component.html',
    styleUrls: ['./diklat-jurusan.component.scss'],
    providers: [ConfirmationService]
})
export class DiklatJurusanComponent implements OnInit {

    kodeDiklatJurusan: any[];
    kodeStatusAkreditasi: any[];
    selected: any;
    listData: any[];
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
    dataValidForm: boolean;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService) {

    }

    ngOnInit() {
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'kdDiklatJurusanHead': new FormControl(''),
            'qtySKSMin': new FormControl('', Validators.required),
            'tglBerdiri': new FormControl(''),
            'namaDiklatJurusan': new FormControl('', Validators.required),
            'kdStatusAkeditasiLast': new FormControl(''),
            'noSKBerdiri': new FormControl(''),
            'tglAkreditasiLast': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.dataValidForm = true;
        if(this.form.get('namaDiklatJurusan').value == "") {
            this.dataValidForm = true;
        }
    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
        if(newValue == "") {
           this.dataValidForm = false;
        } else {
            this.dataValidForm = true;
        }
    }

    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/diklatJurusan/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.diklatJurusan;
            this.totalRecords = table.totalRow;
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/status/findAll?page=1&rows=10&dir=namaStatus&sort=desc&kdStatusHead=12').subscribe(res => {
            this.kodeStatusAkreditasi = [];
            this.kodeStatusAkreditasi.push({ label: '--Pilih Status Akreditasi--', value: '' })
            for (var i = 0; i < res.Status.length; i++) {
                this.kodeStatusAkreditasi.push({ label: res.Status[i].namaStatus, value: res.Status[i].kode.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DiklatJurusan&select=namaDiklatJurusan,id').subscribe(res => {
            this.kodeDiklatJurusan = [];
            this.kodeDiklatJurusan.push({ label: '--Pilih Data Parent Diklat Jurusan--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeDiklatJurusan.push({ label: res.data.data[i].namaDiklatJurusan, value: res.data.data[i].id.kode })
            };
        });


    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/diklatJurusan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDiklatJurusan&sort=desc&namaDiklatJurusan=' + this.pencarian).subscribe(table => {
            this.listData = table.diklatJurusan;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Diklat Jurusan');
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

    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }


    update() {
        let tglAkreditasiLast = this.setTimeStamp(this.form.get('tglAkreditasiLast').value)
        let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

        let formSubmit = this.form.value;
        formSubmit.tglAkreditasiLast = tglAkreditasiLast;
        formSubmit.tglBerdiri = tglBerdiri;
        this.httpService.update(Configuration.get().dataMasterNew + '/diklatJurusan/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let tglAkreditasiLast = this.setTimeStamp(this.form.get('tglAkreditasiLast').value)
            let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

            let formSubmit = this.form.value;
            formSubmit.tglAkreditasiLast = tglAkreditasiLast;
            formSubmit.tglBerdiri = tglBerdiri;
            this.httpService.post(Configuration.get().dataMasterNew + '/diklatJurusan/save?', this.form.value).subscribe(response => {
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
        console.log(event.data);
        this.formAktif = false;
        this.form.get('kode').setValue(event.data.kode.kode);
        this.form.get('kdDiklatJurusanHead').setValue(event.data.kdDiklatJurusanHead);
        this.form.get('qtySKSMin').setValue(event.data.qtySKSMin);
        this.form.get('noSKBerdiri').setValue(event.data.noSKBerdiri);
        this.form.get('namaDiklatJurusan').setValue(event.data.namaDiklatJurusan);
        this.form.get('kdStatusAkeditasiLast').setValue(event.data.kdStatusAkeditasiLast);
        if(event.data.tglBerdiri == null || event.data.tglBerdiri == 0) {
            this.form.get('tglBerdiri').setValue('');
        } else {
            this.form.get('tglBerdiri').setValue(new Date(event.data.tglBerdiri * 1000));
        }
        if(event.data.tglAkreditasiLast == null || event.data.tglAkreditasiLast == 0) {
            this.form.get('tglAkreditasiLast').setValue('');
        } else {
            this.form.get('tglAkreditasiLast').setValue(new Date(event.data.tglAkreditasiLast * 1000));
        }
        this.form.get('reportDisplay').setValue(event.data.reportDisplay);
        this.form.get('namaExternal').setValue(event.data.namaExternal);
        this.form.get('kodeExternal').setValue(event.data.kodeExternal);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        this.versi = event.data.version;
        //let cloned = this.clone(event.data);
        //this.formAktif = false;
        //this.form.setValue(cloned);


    }

    /*clone(cloned: DiklatJurusan): DiklatJurusan {
        let hub = new InisialDiklatJurusan();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialDiklatJurusan();
        if (hub.tglBerdiri == null || hub.tglBerdiri == 0 && hub.tglAkreditasiLast == null || hub.tglAkreditasiLast == 0) {
            fixHub = {

                'kode': hub.kode.kode,
                'kdDiklatJurusanHead': hub.kdDiklatJurusanHead,
                'qtySKSMin': hub.qtySKSMin,
                'noSKBerdiri': hub.noSKBerdiri,
                'namaDiklatJurusan': hub.namaDiklatJurusan,
                'tglBerdiri': null,
                'kdStatusAkeditasiLast': hub.kdStatusAkeditasiLast,
                'tglAkreditasiLast': null,

                'reportDisplay': hub.reportDisplay,
                'namaExternal': hub.namaExternal,
                'kodeExternal': hub.kodeExternal,
                'statusEnabled': hub.statusEnabled
            }
            this.versi = hub.version;
            return fixHub;
        }

        else if (hub.tglAkreditasiLast == null || hub.tglAkreditasiLast == 0) {
            fixHub = {

                'kode': hub.kode.kode,
                'kdDiklatJurusanHead': hub.kdDiklatJurusanHead,
                'qtySKSMin': hub.qtySKSMin,
                'noSKBerdiri': hub.noSKBerdiri,
                'namaDiklatJurusan': hub.namaDiklatJurusan,
                'tglBerdiri': new Date(hub.tglBerdiri * 1000),
                'kdStatusAkeditasiLast': hub.kdStatusAkeditasiLast,
                'tglAkreditasiLast': null,

                'reportDisplay': hub.reportDisplay,
                'namaExternal': hub.namaExternal,
                'kodeExternal': hub.kodeExternal,
                'statusEnabled': hub.statusEnabled
            }
            this.versi = hub.version;
            return fixHub;
        }
        else if (hub.tglBerdiri == null || hub.tglBerdiri == 0 ) {
            fixHub = {
                'kode': hub.kode.kode,
                'kdDiklatJurusanHead': hub.kdDiklatJurusanHead,
                'qtySKSMin': hub.qtySKSMin,
                'noSKBerdiri': hub.noSKBerdiri,
                'namaDiklatJurusan': hub.namaDiklatJurusan,
                'tglBerdiri': null,
                'kdStatusAkeditasiLast': hub.kdStatusAkeditasiLast,
                'tglAkreditasiLast': new Date(hub.tglAkreditasiLast * 1000),

                'reportDisplay': hub.reportDisplay,
                'namaExternal': hub.namaExternal,
                'kodeExternal': hub.kodeExternal,
                'statusEnabled': hub.statusEnabled
            }
            this.versi = hub.version;
            return fixHub;
        } else  {

            fixHub = {

                'kode': hub.kode.kode,
                'kdDiklatJurusanHead': hub.kdDiklatJurusanHead,
                'qtySKSMin': hub.qtySKSMin,
                'noSKBerdiri': hub.noSKBerdiri,
                'namaDiklatJurusan': hub.namaDiklatJurusan,
                'tglBerdiri': new Date(hub.tglBerdiri * 1000),
                'kdStatusAkeditasiLast': hub.kdStatusAkeditasiLast,
                'tglAkreditasiLast': new Date(hub.tglAkreditasiLast * 1000),

                'reportDisplay': hub.reportDisplay,
                'namaExternal': hub.namaExternal,
                'kodeExternal': hub.kodeExternal,
                'statusEnabled': hub.statusEnabled
            }
            this.versi = hub.version;
            return fixHub;
        }

    }*/

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/diklatJurusan/del/' + deleteItem.kode.kode).subscribe(response => {
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

/*class InisialDiklatJurusan implements DiklatJurusan {

    constructor(
        public kdDiklatJurusanHead?,
        public qtySKSMin?,
        public tglBerdiri?,
        public kdStatusAkeditasiLast?,
        public tglAkreditasiLast?,

        public kode?,
        public namaDiklatJurusan?,
        public noSKBerdiri?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
    ) { }

}*/