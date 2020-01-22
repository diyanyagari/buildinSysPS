import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSKTahapanRekruitment } from './pegawai-sk-tahapan-rekruitment.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-pegawai-sk-tahapan-rekruitment',
    templateUrl: './pegawai-sk-tahapan-rekruitment.component.html',
    styleUrls: ['./pegawai-sk-tahapan-rekruitment.component.scss'],
    providers: [ConfirmationService]
})
export class PegawaiSKTahapanRekruitmentComponent implements OnInit {
    item: PegawaiSKTahapanRekruitment = new InisialPegawaiSKTahapanRekruitment();
    selected: PegawaiSKTahapanRekruitment;
    listData: any[];
    codes: PegawaiSKTahapanRekruitment[];
    dataDummy: {};
    formAktif: boolean;
    kodeRange: PegawaiSKTahapanRekruitment[];
    kodeJabatan: PegawaiSKTahapanRekruitment[];
    kodeLevelTingkat: PegawaiSKTahapanRekruitment[];
    kodeProduk: PegawaiSKTahapanRekruitment[];
    kodeJenisPegawai: PegawaiSKTahapanRekruitment[];

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
    dataSK: any[];
    laporan: boolean = false;
	kdprof: any;
    kddept: any;


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
        this.getPage(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
            'namaSK': new FormControl('', Validators.required),
            'noSK': new FormControl(''),
            'tglBerlakuAwal': new FormControl(''),
            'tglBerlakuAkhir': new FormControl(''),
            'nilaiScorePassed': new FormControl(''),
            'keteranganLainnya': new FormControl(''),
            'kdLevelTingkat': new FormControl('', Validators.required),
            'kdProdukRS': new FormControl('', Validators.required),
            'kdRangeNilaiScorePassed': new FormControl(''),
            'kdJenisPegawai': new FormControl('', Validators.required),
            'kdJabatan': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Jabatan&select=namaJabatan,id').subscribe(res => {
            this.kodeJabatan = [];
            this.kodeJabatan.push({ label: '--Pilih Jabatan--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeJabatan.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPegawai&select=namaJenisPegawai,id').subscribe(res => {
            this.kodeJenisPegawai = [];
            this.kodeJenisPegawai.push({ label: '--Pilih Posisi--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeJenisPegawai.push({ label: res.data.data[i].namaJenisPegawai, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=LevelTingkat&select=namaLevelTingkat,id').subscribe(res => {
            this.kodeLevelTingkat = [];
            this.kodeLevelTingkat.push({ label: '--Pilih LevelTingkat--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeLevelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/getProduk').subscribe(res => {
            this.kodeProduk = [];
            this.kodeProduk.push({ label: '--Pilih Produk--', value: '' })
            for (var i = 0; i < res.data.length; i++) {
                this.kodeProduk.push({ label: res.data[i].namaProduk, value: res.data[i].kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/getRangeScore').subscribe(res => {
            this.kodeRange = [];
            this.kodeRange.push({ label: '--Pilih Range Nilai Score--', value: '' })
            for (var i = 0; i < res.data.length; i++) {
                this.kodeRange.push({ label: res.data[i].namaRange, value: res.data[i].kdRange })
            };
        });


    }

    valuechange(newValue) {
        //  this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcel() {
      
    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/pegawaiSKTahapanRekrutmen/laporanPegawaiSKTahapanRekrutmen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
        window.open(cetak);
    }

    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.PegawaiSKTahapanRekrutmen;
            this.totalRecords = table.totalRow;

        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=suratKeputusan.namaSK&sort=desc&namaSK=' + this.pencarian).subscribe(table => {
            this.listData = table.PegawaiSKTahapanRekrutmen;
            this.totalRecords = table.totalRow;
        });
    }

    filterSk(event) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/findByNamaSK?namaSK=' + event.query).subscribe(res => {
            this.dataSK = res.PegawaiSKTahapanRekrutmen;
        });
    }
    pilihSK(event) {
        //this.form.get('namaSK').setValue(event.namaSK);
        this.form.get('noSK').setValue(event.noSK);
        this.form.get('tglBerlakuAwal').setValue(new Date(event.tglBerlakuAwal * 1000));
        if (event.tglBerlakuAkhir != 0 || event.tglBerlakuAkhir != null) {
            this.form.get('tglBerlakuAkhir').setValue(new Date(event.tglBerlakuAkhir * 1000));
        }
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
        let noSK = this.form.get('noSK').value;
        if (noSK == null || noSK == undefined || noSK == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai Sk Tahapan Rekruitment');
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
    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }

    update() {
        let dataSimpan = {
            "noSK": this.form.get('noSK').value,
            "nilaiScorePassed": this.form.get('nilaiScorePassed').value,
            "keteranganLainnya": this.form.get('keteranganLainnya').value,
            "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
            "kdRangeNilaiScorePassed": this.form.get('kdRangeNilaiScorePassed').value,
            "kdJabatan": this.form.get('kdJabatan').value,
            "kdProdukRS": this.form.get('kdProdukRS').value,
            "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
            "statusEnabled": this.form.get('statusEnabled').value
        }
        this.httpService.update(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/update/' + this.versi, dataSimpan).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {

            let dataSimpan = {
                "noSK": this.form.get('noSK').value,
                "nilaiScorePassed": this.form.get('nilaiScorePassed').value,
                "keteranganLainnya": this.form.get('keteranganLainnya').value,
                "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
                "kdRangeNilaiScorePassed": this.form.get('kdRangeNilaiScorePassed').value,
                "kdJabatan": this.form.get('kdJabatan').value,
                "kdProdukRS": this.form.get('kdProdukRS').value,
                "kdJenisPegawai": this.form.get('kdJenisPegawai').value,
                "statusEnabled": this.form.get('statusEnabled').value
            }

            this.httpService.post(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/save?', dataSimpan).subscribe(response => {
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
        this.dataSK = [];
        this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
    }
    clone(cloned: PegawaiSKTahapanRekruitment): PegawaiSKTahapanRekruitment {
        let hub = new InisialPegawaiSKTahapanRekruitment();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialPegawaiSKTahapanRekruitment();
        fixHub = {
            "noSK": hub.kode.noSK,
            "namaSK": this.dataSK[0],
            "tglBerlakuAwal": new Date (hub.tglBerlakuAwal * 1000),
            "tglBerlakuAkhir": new Date (hub.tglBerlakuAkhir * 1000),
            "nilaiScorePassed": hub.nilaiScorePassed,
            "kdJabatan": hub.kode.kdJabatan,
            "kdRangeNilaiScorePassed": hub.kdRangeNilaiScorePassed,
            "kdProdukRS": hub.kode.kdProdukRS,
            "kdLevelTingkat": hub.kode.kdLevelTingkat,
            "kdJenisPegawai": hub.kode.kdJenisPegawai,
            "keteranganLainnya": hub.keteranganLainnya,
            // "reportDisplay": hub.reportDisplay,
            // "kodeExternal": hub.kodeExternal,
            // "namaExternal": hub.namaExternal,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaisktahapanrekrutmen/del/' + deleteItem.kode.noSK + '/' + deleteItem.kode.kdJenisPegawai + '/' + deleteItem.kode.kdJabatan + '/' + deleteItem.kode.kdLevelTingkat + '/' + deleteItem.kode.kdProdukRS).subscribe(response => {
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
    

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKTahapanRekrutmen/laporanPegawaiSKTahapanRekrutmen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false', 'frmPegawaiSKTahapanRekrutmen_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialPegawaiSKTahapanRekruitment implements PegawaiSKTahapanRekruitment {

    constructor(
        public namaSuratKeputusan?,
        public namaSK?,
        public kdRangeNilaiScorePassed?,
        public tglBerlakuAwal?,
        public kode?,
        public tglBerlakuAkhir?,
        public nilaiScoredPassed?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public kdJabatan?,
        public kdRange?,
        public kdProdukRS?,
        public kdLevelTingkat?,
        public keteranganLainnya?,
        public kdJenisPegawai?,
        public noSK?,
        public nilaiScorePassed?,

    ) { }

}