import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { HargaNettoProdukBykelas } from './harga-netto-produk-bykelas.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-harga-netto-produk-bykelas',
    templateUrl: './harga-netto-produk-bykelas.component.html',
    styleUrls: ['./harga-netto-produk-bykelas.component.scss'],
    providers: [ConfirmationService]
})
export class HargaNettoProdukBykelasComponent implements OnInit {

    selected: any;
    listData: any[];
    formAktif: boolean;
    kodeProduk: any[];
    kodeKelas: any[];
    kodeAsalProduk: any[];
    kodeMataUang: any[];
    kodeTarif: any[];
    versi: any;
    form: FormGroup;
    items: any;
    kode: any;
    id: any;
    value: any;
    page: number;
    id_kode: any;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    pencarian: string = '';
    laporan: boolean = false;
    kdprof: any;
    kddept: any;
    codes:any[];
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
this.getPage(this.page, this.rows, '');
this.versi = null;
this.form = this.fb.group({
            // 'kode': new FormControl(null),
            'kdProduk': new FormControl('', Validators.required),
            'kdKelas': new FormControl('', Validators.required),
            'kdAsalProduk': new FormControl('', Validators.required),
            'kdJenisTarif': new FormControl('', Validators.required),
            'tglBerlakuAwal': new FormControl('', Validators.required),
            'tglBerlakuAkhir': new FormControl(''),
            'hargaNetto1': new FormControl(0),
            'hargaNetto2': new FormControl(0),
            'persenDiscount': new FormControl(0),
            'hargaDiscount': new FormControl(0),
            'factorRate': new FormControl(1),
            // 'operatorFactorRate': new FormControl('X'),
            'tglKadaluarsaLast': new FormControl(''),
            'qtyCurrentStok': new FormControl(0),
            'kdMataUang': new FormControl('', Validators.required),
            'hargaSatuan': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Produk&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
            this.kodeProduk = [];
            this.kodeProduk.push({ label: '--Pilih Produk--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeProduk.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Kelas&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
            this.kodeKelas = [];
            this.kodeKelas.push({ label: '--Pilih Kelas--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeKelas.push({ label: res.data.data[i].namaKelas, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/hargaNettoProdukByKelas/findAsalProduk').subscribe(res => {
            this.kodeAsalProduk = [];
            this.kodeAsalProduk.push({ label: '--Pilih Asal Produk--', value: '' })
            for (var i = 0; i < res.data.length; i++) {
                this.kodeAsalProduk.push({ label: res.data[i].namaAsal, value: res.data[i].kdAsal })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAllMataUang').subscribe(res => {
            this.kodeMataUang = [];
            this.kodeMataUang.push({ label: '--Pilih Mata Uang--', value: '' })
            for (var i = 0; i < res.MataUang.length; i++) {
                this.kodeMataUang.push({ label: res.MataUang[i].namaMataUang, value: res.MataUang[i].kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisTarif&select=*&page=1&rows=300&condition=and&profile=y').subscribe(res => {
            this.kodeTarif = [];
            this.kodeTarif.push({ label: '--Pilih Jenis Tarif--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeTarif.push({ label: res.data.data[i].namaJenisTarif, value: res.data.data[i].id.kode })
            };
        });

this.form.get('kdProduk').enable();
this.form.get('kdKelas').enable();
this.form.get('kdAsalProduk').enable();
this.form.get('kdJenisTarif').enable();
this.form.get('tglBerlakuAwal').enable();
this.form.get('tglBerlakuAkhir').enable();
this.form.get('kdMataUang').enable(); 

this.getSmbrFile();

}

getSmbrFile(){
  this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
     this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
 });
}

valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcel() {

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/hargaNettoProdukByKelas/laporanHargaNettoProdukByKelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/hargaNettoProdukByKelas/laporanHargaNettoProdukByKelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmHargaNettoProdukByKelas_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }

    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/hargaNettoProdukByKelas/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.HargaNettoProdukByKelas;
            this.totalRecords = table.totalRow;

        });

    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/hargaNettoProdukByKelas/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=produk.namaProduk&sort=desc&namaProduk=' + this.pencarian).subscribe(table => {
            this.listData = table.HargaNettoProdukByKelas;
        });
    }

    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    confirmDelete() {
        let kdProduk = this.form.get('kdProduk').value;
        if (kdProduk == null || kdProduk == undefined || kdProduk == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Harga Netto Produk By Kelas');
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
        let tglBerlakuAkhir = this.setTimeStamp(this.form.get('tglBerlakuAkhir').value)
        let tglBerlakuAwal = this.setTimeStamp(this.form.get('tglBerlakuAwal').value)
        let tglKadaluarsaLast = this.setTimeStamp(this.form.get('tglKadaluarsaLast').value)

        this.form.get('kdProduk').enable();
        this.form.get('kdKelas').enable();
        this.form.get('kdAsalProduk').enable();
        this.form.get('kdJenisTarif').enable();
        this.form.get('tglBerlakuAwal').enable();
        this.form.get('tglBerlakuAkhir').enable();
        this.form.get('kdMataUang').enable();

        let formSubmit = this.form.value;
        formSubmit.tglBerlakuAkhir = tglBerlakuAkhir;
        formSubmit.tglBerlakuAwal = tglBerlakuAwal;
        formSubmit.tglKadaluarsaLast = tglKadaluarsaLast;
        this.httpService.update(Configuration.get().dataMasterNew + '/hargaNettoProdukByKelas/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let tglBerlakuAkhir = this.setTimeStamp(this.form.get('tglBerlakuAkhir').value)
            let tglBerlakuAwal = this.setTimeStamp(this.form.get('tglBerlakuAwal').value)
            let tglKadaluarsaLast = this.setTimeStamp(this.form.get('tglKadaluarsaLast').value)

            this.form.get('kdProduk').enable();
            this.form.get('kdKelas').enable();
            this.form.get('kdAsalProduk').enable();
            this.form.get('kdJenisTarif').enable();
            this.form.get('tglBerlakuAwal').enable();
            this.form.get('tglBerlakuAkhir').enable();
            this.form.get('kdMataUang').enable();


            let formSubmit = this.form.value;
            formSubmit.tglBerlakuAkhir = tglBerlakuAkhir;
            formSubmit.tglBerlakuAwal = tglBerlakuAwal;
            formSubmit.tglKadaluarsaLast = tglKadaluarsaLast;
            this.httpService.post(Configuration.get().dataMasterNew + '/hargaNettoProdukByKelas/save', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getPage(this.page, this.rows, this.pencarian);
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
        this.form.get('kdProduk').enable();
        this.form.get('kdKelas').enable();
        this.form.get('kdAsalProduk').enable();
        this.form.get('kdJenisTarif').enable();
        this.form.get('tglBerlakuAwal').enable();
        this.form.get('tglBerlakuAkhir').enable();
        this.form.get('kdMataUang').enable();
        this.ngOnInit();
    }


    onRowSelect(event) {
        console.log(event.data);
        this.formAktif = false;
        this.form.get('kdProduk').setValue(event.data.kdProduk);
        this.form.get('kdKelas').setValue(event.data.kdKelas);
        this.form.get('kdAsalProduk').setValue(event.data.kdAsalProduk);
        this.form.get('kdJenisTarif').setValue(event.data.kdJenisTarif);
        this.form.get('hargaNetto1').setValue(event.data.hargaNetto1);
        this.form.get('hargaNetto2').setValue(event.data.hargaNetto2);
        if(event.data.tglBerlakuAwal == null || event.data.tglBerlakuAwal == 0) {
            this.form.get('tglBerlakuAwal').setValue('');
        } else {
            this.form.get('tglBerlakuAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
        }
        if(event.data.tglBerlakuAkhir == null || event.data.tglBerlakuAkhir == 0) {
            this.form.get('tglBerlakuAkhir').setValue('');
        } else {
            this.form.get('tglBerlakuAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));
        }
        if(event.data.tglKadaluarsaLast == null || event.data.tglKadaluarsaLast == 0) {
            this.form.get('tglKadaluarsaLast').setValue('');
        } else {
            this.form.get('tglKadaluarsaLast').setValue(new Date(event.data.tglKadaluarsaLast * 1000));
        }
        this.form.get('qtyCurrentStok').setValue(event.data.qtyCurrentStok);
        this.form.get('persenDiscount').setValue(event.data.persenDiscount);
        this.form.get('factorRate').setValue(event.data.factorRate);
        this.form.get('hargaSatuan').setValue(event.data.hargaSatuan);
        this.form.get('kdMataUang').setValue(event.data.idMataUang);
        this.form.get('hargaDiscount').setValue(event.data.hargaDiscount);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        this.versi = event.data.version;

        this.form.get('kdProduk').disable();
        this.form.get('kdKelas').disable();
        this.form.get('kdAsalProduk').disable();
        this.form.get('kdJenisTarif').disable();
        this.form.get('tglBerlakuAwal').disable();
        this.form.get('tglBerlakuAkhir').disable();
        //this.form.get('kdMataUang').disable();



    }

    // clone(cloned: HargaNettoProdukBykelas): HargaNettoProdukBykelas {
    //     let hub = new InisialHargaNettoProdukBykelas();
    //     for (let prop in cloned) {
    //         hub[prop] = cloned[prop];
    //     }
    //     let fixHub = new InisialHargaNettoProdukBykelas();
    //     if (hub.tglBerlakuAwal == null || hub.tglBerlakuAwal == 0) {
    //         fixHub = {

    //             "kdProduk": hub.kdProduk,
    //             "kdKelas": hub.kdKelas,
    //             "kdAsalProduk": hub.kdAsalProduk,
    //             "kdJenisTarif": hub.kdJenisTarif,
    //             "tglBerlakuAwal": null,
    //             "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
    //             "hargaNetto1": hub.hargaNetto1,
    //             "hargaNetto2": hub.hargaNetto2,
    //             "persenDiscount": hub.persenDiscount,
    //             "factorRate": hub.factorRate,
    //             "tglKadaluarsaLast": new Date(hub.tglKadaluarsaLast * 1000),
    //             "qtyCurrentStok": hub.qtyCurrentStok,
    //             "hargaSatuan": hub.hargaSatuan,
    //             "kdMataUang": hub.kdMataUang,
    //             "hargaDiscount": hub.hargaDiscount,
    //             "statusEnabled": hub.statusEnabled
    //         }
    //         this.versi = hub.version;
    //         return fixHub;
    //     } if (hub.tglBerlakuAkhir == null || hub.tglBerlakuAkhir == 0) {
    //         fixHub = {

    //             "kdProduk": hub.kdProduk,
    //             "kdKelas": hub.kdKelas,
    //             "kdAsalProduk": hub.kdAsalProduk,
    //             "kdJenisTarif": hub.kdJenisTarif,
    //             "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
    //             "tglBerlakuAkhir": null,
    //             "hargaNetto1": hub.hargaNetto1,
    //             "hargaNetto2": hub.hargaNetto2,
    //             "persenDiscount": hub.persenDiscount,
    //             "factorRate": hub.factorRate,
    //             "tglKadaluarsaLast": new Date(hub.tglKadaluarsaLast * 1000),
    //             "qtyCurrentStok": hub.qtyCurrentStok,
    //             "hargaSatuan": hub.hargaSatuan,
    //             "kdMataUang": hub.kdMataUang,
    //             "hargaDiscount": hub.hargaDiscount,
    //             "statusEnabled": hub.statusEnabled
    //         }
    //         this.versi = hub.version;
    //         return fixHub;
    //     }
    //     else if (hub.tglKadaluarsaLast == null || hub.tglKadaluarsaLast == 0) {
    //         fixHub = {

    //             "kdProduk": hub.kdProduk,
    //             "kdKelas": hub.kdKelas,
    //             "kdAsalProduk": hub.kdAsalProduk,
    //             "kdJenisTarif": hub.kdJenisTarif,
    //             "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
    //             "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
    //             "hargaNetto1": hub.hargaNetto1,
    //             "hargaNetto2": hub.hargaNetto2,
    //             "persenDiscount": hub.persenDiscount,
    //             "factorRate": hub.factorRate,
    //             "tglKadaluarsaLast": null,
    //             "qtyCurrentStok": hub.qtyCurrentStok,
    //             "hargaSatuan": hub.hargaSatuan,
    //             "kdMataUang": hub.kdMataUang,
    //             "hargaDiscount": hub.hargaDiscount,
    //             "statusEnabled": hub.statusEnabled
    //         }
    //         this.versi = hub.version;
    //         return fixHub;
    //     }
    //     else if (hub.tglBerlakuAkhir == null || hub.tglBerlakuAkhir == 0 && hub.tglBerlakuAwal == null || hub.tglBerlakuAwal == 0 &&
    //         hub.tglKadaluarsaLast == null || hub.tglKadaluarsaLast == 0) {
    //         fixHub = {

    //             "kdProduk": hub.kdProduk,
    //             "kdKelas": hub.kdKelas,
    //             "kdAsalProduk": hub.kdAsalProduk,
    //             "kdJenisTarif": hub.kdJenisTarif,
    //             "tglBerlakuAwal": null,
    //             "tglBerlakuAkhir": null,
    //             "hargaNetto1": hub.hargaNetto1,
    //             "hargaNetto2": hub.hargaNetto2,
    //             "persenDiscount": hub.persenDiscount,
    //             "factorRate": hub.factorRate,
    //             "tglKadaluarsaLast": null,
    //             "qtyCurrentStok": hub.qtyCurrentStok,
    //             "hargaSatuan": hub.hargaSatuan,
    //             "kdMataUang": hub.kdMataUang,
    //             "hargaDiscount": hub.hargaDiscount,
    //             "statusEnabled": hub.statusEnabled
    //         }
    //         this.versi = hub.version;
    //         return fixHub;
    //     } else {
    //         fixHub = {

    //             "kdProduk": hub.kdProduk,
    //             "kdKelas": hub.kdKelas,
    //             "kdAsalProduk": hub.kdAsalProduk,
    //             "kdJenisTarif": hub.kdJenisTarif,
    //             "tglBerlakuAwal": new Date(hub.tglBerlakuAwal * 1000),
    //             "tglBerlakuAkhir": new Date(hub.tglBerlakuAkhir * 1000),
    //             "hargaNetto1": hub.hargaNetto1,
    //             "hargaNetto2": hub.hargaNetto2,
    //             "persenDiscount": hub.persenDiscount,
    //             "factorRate": hub.factorRate,
    //             "tglKadaluarsaLast": new Date(hub.tglKadaluarsaLast * 1000),
    //             "qtyCurrentStok": hub.qtyCurrentStok,
    //             "hargaSatuan": hub.hargaSatuan,
    //             "kdMataUang": hub.kdMataUang,
    //             "hargaDiscount": hub.hargaDiscount,
    //             "statusEnabled": hub.statusEnabled
    //         }
    //         this.versi = hub.version;
    //         return fixHub;
    //     }
    // }

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/hargaNettoProdukByKelas/del/' + deleteItem.kdProduk + '/' + deleteItem.kdKelas + '/' + deleteItem.kdAsalProduk + '/' + deleteItem.kdJenisTarif + '/' + deleteItem.tglBerlakuAwal+ '/' + deleteItem.kdMataUang).subscribe(response => {
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

class InisialHargaNettoProdukBykelas implements HargaNettoProdukBykelas {

    constructor(
        public kdProduk?,
        public id?,
        public kdKelas?,
        public kode?,
        public kdAsalProduk?,
        public kdJenisTarif?,
        public tglBerlakuAwal?,
        public tglBerlakuAkhir?,
        public hargaNetto1?,
        public hargaNetto2?,
        public version?,
        public persenDiscount?,
        public hargaDiscount?,
        public factorRate?,
        public tglKadaluarsaLast?,
        public qtyCurrentStok?,
        public kdMataUang?,
        public hargaSatuan?,
        public statusEnabled?,

        ) { }

}