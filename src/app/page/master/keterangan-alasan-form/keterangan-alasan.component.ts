import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KeteranganAlasan, SelectedItem } from './keterangan-alasan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, FileService } from '../../../global';
@Component({
    selector: 'app-keterangan-alasan',
    templateUrl: './keterangan-alasan.component.html',
    styleUrls: ['./keterangan-alasan.component.scss'],
    providers: [ConfirmationService]
})
export class KeteranganAlasanFormComponent implements OnInit {
    selected: KeteranganAlasan;
    listKeteranganAlasan: any[];
    listKeteranganAlasanIjin: any[];
    listKeteranganAlasanJadwalKerja: any[];
    listKeteranganAlasanSanksi: any[];
    listKeteranganAlasanDinas: any[];
    listKeteranganAlasanResign: any[];
    listKeteranganAlasanReward: any[];
    listKeteranganAlasanTransisi: any[];
    listKeteranganAlasanPinjaman: any[];
   
    // listDepartemen: SelectedItem[];
    listData: any[];
    listDataIjin: any[];
    listDataDinas: any[];
    listDataJadwalKeja: any[];
    listDataJadwalKerja: any[];
    listDataResign: any[];
    listDataReward: any[];
    listDataSanksi: any[];
    listDataSakit: any[];
    listDataTransisi: any[];
    listDataPinjaman: any[];
    versi: any;
    formCuti: FormGroup;
    formIjin: FormGroup;
    formDinas: FormGroup;
    formJadwalKerja: FormGroup;
    formResign: FormGroup;
    formReward: FormGroup;
    formSanksi: FormGroup;
    formSakit: FormGroup;
    formTransisi: FormGroup;
    formPinjaman: FormGroup;
    formAktif: boolean;
    formAktifIjin: boolean;
    formAktifDinas: boolean;
    formAktifJadwalKerja: boolean;
    formAktifResign: boolean;
    formAktifReward: boolean;
    formAktifSanksi: boolean;
    formAktifSakit: boolean;
    formAktifTransisi: boolean;
    formAktifPinjaman: boolean;
    pencarian: string;
    items: MenuItem[];
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    reportCuti: any;
    toReportCuti: any;
    reportIjin: any;
    toReportIjin: any;
    reportJadwalKerja: any;
    toReportJadwalKerja: any;
    reportResign: any;
    toReportResign: any;
    reportReward: any;
    toReportReward: any;
    reportSanksi: any;
    toReportSanksi: any;
    reportTransisi: any;
    toReportTransisi: any;
    reportPinjaman: any;
    toReportPinjaman: any;
    reportDinas: any;
    toReportDinas: any;
    pencarianIjin: string;
    pencarianDinas: string;
    pencarianJadwalKerja: string;
    pencarianResign: string;
    pencarianReward: string;
    pencarianSanksi: string;
    pencarianPinjaman: string;
    pageIjin: number;
    rowsIjin: number;
    totalRecordsIjin: any;
    totalRecordsDinas: any;
    totalRecordsJadwalKerja: any;
    totalRecordsResign: any;
    totalRecordsReward: any;
    totalRecordsPinjaman: any;
    pageDinas: number;
    rowsDinas: number;
    pageJadwalKerja: number;
    rowsJadwalKerja: number;
    pageResign: number;
    rowsResign: number;
    pageReward: number;
    rowsReward: number;
    pageSakit: number;
    rowsSakit: number;
    pageSanksi: number;
    rowsSanksi: number;
    pageTransisi: number;
    rowsTransisi: number;
    totalRecordsSanksi: number;
    pencarianSakit: string;
    totalRecordsSakit: number;
    totalRecordsTransisi: number;
    pagePinjaman: number;
    rowsPinjaman: number;
    pencarianTransisi: any;
    
    

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
        if (this.pageIjin == undefined || this.rowsIjin == undefined) {
            this.pageIjin = Configuration.get().page;
            this.rowsIjin = Configuration.get().rows;
        }
        if (this.pageDinas == undefined || this.rowsDinas == undefined) {
            this.pageDinas = Configuration.get().page;
            this.rowsDinas = Configuration.get().rows;
        }
        if (this.pageJadwalKerja == undefined || this.rowsJadwalKerja == undefined) {
            this.pageJadwalKerja = Configuration.get().page;
            this.rowsJadwalKerja = Configuration.get().rows;
        }
        if (this.pageResign == undefined || this.rowsResign == undefined) {
            this.pageResign = Configuration.get().page;
            this.rowsResign = Configuration.get().rows;
        }
        if (this.pageReward == undefined || this.rowsReward == undefined) {
            this.pageReward = Configuration.get().page;
            this.rowsReward = Configuration.get().rows;
        }
        if (this.pageSanksi == undefined || this.rowsSanksi == undefined) {
            this.pageSanksi = Configuration.get().page;
            this.rowsSanksi = Configuration.get().rows;
        }
        if (this.pageSakit == undefined || this.rowsSakit == undefined) {
            this.pageSakit = Configuration.get().page;
            this.rowsSakit = Configuration.get().rows;
        }
        if (this.pageTransisi == undefined || this.rowsTransisi == undefined) {
            this.pageTransisi = Configuration.get().page;
            this.rowsTransisi = Configuration.get().rows;
        }
        if (this.pagePinjaman == undefined || this.rowsPinjaman == undefined) {
            this.pagePinjaman = Configuration.get().page;
            this.rowsPinjaman = Configuration.get().rows;
        }
        this.formAktif = true;
        this.formAktifIjin = true;
        this.formAktifDinas = true;
        this.formAktifJadwalKerja = true;
        this.formAktifResign = true;
        this.formAktifReward = true;
        this.formAktifSanksi = true;
        this.formAktifSakit = true;
        this.formAktifTransisi = true;
        this.formAktifPinjaman = true;
        this.get(this.page, this.rows, '');
        this.getCuti(this.page, this.rows, '');
        this.getIjin(this.pageIjin, this.rowsIjin, '');
        this.getDinas(this.pageDinas, this.rowsDinas, '');
        this.getJadwalKerja(this.pageJadwalKerja, this.rowsJadwalKerja, '');
        this.getResign(this.pageResign, this.rowsResign, '');
        this.getSanksi(this.pageSanksi, this.rowsSanksi, '');
        this.getSakit(this.pageSakit, this.rowsSakit, '');
        this.getTransisi(this.pageSakit, this.rowsSakit, '');
        this.getReward(this.pageReward, this.rowsReward, '');
        this.getPinjaman(this.pagePinjaman, this.rowsPinjaman, '');
        this.formCuti = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formCuti.get('noUrut').disable();
        this.formIjin = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formIjin.get('noUrut').disable();
        this.formDinas = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formDinas.get('noUrut').disable();
        this.formJadwalKerja = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formJadwalKerja.get('noUrut').disable();
        this.formResign = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formResign.get('noUrut').disable();
        this.formReward = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formReward.get('noUrut').disable();
        this.formSanksi = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formSanksi.get('noUrut').disable();
        this.formSakit = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formSakit.get('noUrut').disable();
        this.formTransisi = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formTransisi.get('noUrut').disable();
        this.formPinjaman = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
             'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });
        this.formPinjaman.get('noUrut').disable();
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
        this.formCuti.get('kdKeteranganAlasanHead').disable();
        this.formIjin.get('kdKeteranganAlasanHead').disable();
        this.formDinas.get('kdKeteranganAlasanHead').disable();
        this.formJadwalKerja.get('kdKeteranganAlasanHead').disable();
        this.formReward.get('kdKeteranganAlasanHead').disable();
        this.formResign.get('kdKeteranganAlasanHead').disable();
        this.formSanksi.get('kdKeteranganAlasanHead').disable();
        this.formTransisi.get('kdKeteranganAlasanHead').disable();
        this.formSakit.get('kdKeteranganAlasanHead').disable();
        this.formPinjaman.get('kdKeteranganAlasanHead').disable();
       
    }
    downloadExel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KeteranganAlasan&select=id.kode,namaKeteranganAlasan').subscribe(table => {
            this.fileService.exportAsExcelFile(table.data.data, 'KeteranganAlasan');
        });

    }

    downloadPdf() {
        var col = ["Kode", "Nama KeteranganAlasan"];
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KeteranganAlasan&select=id.kode,namaKeteranganAlasan').subscribe(table => {
            this.fileService.exportAsPdfFile("Master KeteranganAlasan", col, table.data.data, "KeteranganAlasan");

        });

    }

    valuechangeCuti(newValue) {
        this.toReportCuti = newValue;
        this.reportCuti = newValue;
    }

    valuechangeIjin(newValue) {
        this.toReportIjin = newValue;
        this.reportIjin = newValue;
    }

    valuechangeJadwalKerja(newValue) {
        this.toReportJadwalKerja = newValue;
        this.reportJadwalKerja = newValue;
    }

    valuechangeResign(newValue) {
        this.toReportResign = newValue;
        this.reportResign = newValue;
    }

    valuechangeReward(newValue) {
        this.toReportReward = newValue;
        this.reportReward = newValue;
    }

    valuechangeSanksi(newValue) {
        this.toReportSanksi = newValue;
        this.reportSanksi = newValue;
    }

    valuechangeTransisi(newValue) {
        this.toReportTransisi = newValue;
        this.reportTransisi = newValue;
    }

    valuechangePinjaman(newValue) {
        this.toReportPinjaman = newValue;
        this.reportPinjaman = newValue;
    }

    valuechangeDinas(newValue) {
        this.toReportDinas = newValue;
        this.reportDinas = newValue;
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=' + this.pencarian).subscribe(table => {
            this.listData = table.KeteranganAlasan;
            this.totalRecords = table.totalRow;
        });
    }
    cariIjin() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianIjin+'&prefix=AlasanIjin').subscribe(table => {
            this.listDataIjin = table.KeteranganAlasan;
            this.totalRecordsIjin = table.totalRow;
        });
    }
    cariDinas() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianDinas+'&prefix=AlasanDinas').subscribe(table => {
            this.listDataDinas = table.KeteranganAlasan;
            this.totalRecordsDinas = table.totalRow;
        });
    }
    cariJadwalKerja() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianJadwalKerja+'&prefix=AlasanPerubahanJadwalKerja').subscribe(table => {
            this.listDataJadwalKerja = table.KeteranganAlasan;
            this.totalRecordsJadwalKerja = table.totalRow;
        });
    }
    cariResign() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianResign+'&prefix=AlasanResign').subscribe(table => {
            this.listDataResign = table.KeteranganAlasan;
            this.totalRecordsResign = table.totalRow;
        });
    }
    cariReward() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianReward+'&prefix=AlasanReward').subscribe(table => {
            this.listDataReward = table.KeteranganAlasan;
            this.totalRecordsReward = table.totalRow;
        });
    }
    cariSanksi() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianSanksi+'&prefix=AlasanSanksi').subscribe(table => {
            this.listDataSanksi = table.KeteranganAlasan;
            this.totalRecordsSanksi = table.totalRow;
        });
    }
    cariSakit() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianSakit+'&prefix=AlasanSakit').subscribe(table => {
            this.listDataSakit = table.KeteranganAlasan;
            this.totalRecordsSakit = table.totalRow;
        });
    }
    cariTransisi() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianTransisi+'&prefix=AlasanTransisi').subscribe(table => {
            this.listDataTransisi = table.KeteranganAlasan;
            this.totalRecordsTransisi = table.totalRow;
        });
    }
    cariPinjaman() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+this.pencarianPinjaman+'&prefix=AlasanTransisi').subscribe(table => {
            this.listDataTransisi = table.KeteranganAlasan;
            this.totalRecordsTransisi = table.totalRow;
        });
    }
    get(page: number, rows: number, search: any) {
          /* this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.KeteranganAlasan;
            this.totalRecords = table.totalRow;
        });*/
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanCuti').subscribe(res => {
            this.listKeteranganAlasan = [];
            this.listKeteranganAlasan.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formCuti.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasan[0].value);
            console.log(this.listKeteranganAlasan[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanIjin').subscribe(res => {
            this.listKeteranganAlasanIjin = [];
            this.listKeteranganAlasanIjin.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formIjin.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanIjin[0].value);
            console.log(this.listKeteranganAlasanIjin[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanPerjalananDinas').subscribe(res => {
            this.listKeteranganAlasanDinas = [];
            this.listKeteranganAlasanDinas.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formDinas.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanDinas[0].value);
            console.log(this.listKeteranganAlasanDinas[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanPerubahanJadwalKerja').subscribe(res => {
            this.listKeteranganAlasanJadwalKerja = [];
            this.listKeteranganAlasanJadwalKerja.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formJadwalKerja.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanJadwalKerja[0].value);
            console.log(this.listKeteranganAlasanJadwalKerja[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanResign').subscribe(res => {
            this.listKeteranganAlasanResign = [];
            this.listKeteranganAlasanResign.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formResign.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanResign[0].value);
            console.log(this.listKeteranganAlasanResign[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanReward').subscribe(res => {
            this.listKeteranganAlasanReward = [];
            this.listKeteranganAlasanReward.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formReward.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanReward[0].value);
            console.log(this.listKeteranganAlasanReward[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanSanksi').subscribe(res => {
            this.listKeteranganAlasanSanksi = [];
            this.listKeteranganAlasanSanksi.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formReward.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanSanksi[0].value);
            console.log(this.listKeteranganAlasanSanksi[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanTransisi').subscribe(res => {
            this.listKeteranganAlasanTransisi = [];
            this.listKeteranganAlasanTransisi.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formReward.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanTransisi[0].value);
            console.log(this.listKeteranganAlasanTransisi[0].value);
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findKeteranganAlasanPengajuanPinjaman').subscribe(res => {
            this.listKeteranganAlasanPinjaman = [];
            this.listKeteranganAlasanPinjaman.push({ label: res.KeteranganAlasan.namaKeteranganAlasan, value: res.KeteranganAlasan.kdKeternaganAlasan });
            this.formReward.get('kdKeteranganAlasanHead').setValue(this.listKeteranganAlasanPinjaman[0].value);
            console.log(this.listKeteranganAlasanPinjaman[0].value);
        });
       
        /*this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KeteranganAlasan&select=namaKeteranganAlasan,id').subscribe(res => {
            this.listKeteranganAlasan = [];
            this.listKeteranganAlasan.push({ label: '--Pilih Keterangan Alasan--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listKeteranganAlasan.push({ label: res.data.data[i].namaKeteranganAlasan, value: res.data.data[i].id.kode })
            };
        });*/

    }
    getCuti(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanCuti').subscribe(table => {
            this.listData = table.KeteranganAlasan;
            this.totalRecords = table.totalRow;
        });
    }
    getIjin(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanIjin').subscribe(table => {
            this.listDataIjin = table.KeteranganAlasan;
            this.totalRecordsIjin = table.totalRow;
        });
    }
    getDinas(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanPerjalananDinas').subscribe(table => {
            this.listDataDinas = table.KeteranganAlasan;
            this.totalRecordsDinas = table.totalRow;
        });
    }
    getJadwalKerja(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanPerubahanJadwalKerja').subscribe(table => {
            this.listDataJadwalKerja = table.KeteranganAlasan;
            this.totalRecordsJadwalKerja = table.totalRow;
        });
    }
    getResign(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanResign').subscribe(table => {
            this.listDataResign = table.KeteranganAlasan;
            this.totalRecordsResign = table.totalRow;
        });
    }
    getReward(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanReward').subscribe(table => {
            this.listDataReward = table.KeteranganAlasan;
            this.totalRecordsReward = table.totalRow;
        });
    }
    getSanksi(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanSanksi').subscribe(table => {
            this.listDataSanksi = table.KeteranganAlasan;
            this.totalRecordsSanksi = table.totalRow;
        });
    }
    getSakit(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanSakit').subscribe(table => {
            this.listDataSakit = table.KeteranganAlasan;
            this.totalRecordsSakit = table.totalRow;
        });
    }
    getTransisi(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanTransisi').subscribe(table => {
            this.listDataTransisi = table.KeteranganAlasan;
            this.totalRecordsTransisi = table.totalRow;
        }
        );
    }
    getPinjaman(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAllByHead?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan=&prefix=AlasanPengajuanPinjaman').subscribe(table => {
            this.listDataPinjaman = table.KeteranganAlasan;
            this.totalRecordsPinjaman = table.totalRow;
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.getCuti((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageIjin(event: LazyLoadEvent) {
        this.getIjin((event.rows + event.first) / event.rows, event.rows, this.pencarianIjin);
        this.pageIjin = (event.rows + event.first) / event.rows;
        this.rowsIjin = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageDinas(event: LazyLoadEvent) {
        this.getDinas((event.rows + event.first) / event.rows, event.rows, this.pencarianDinas);
        this.pageDinas = (event.rows + event.first) / event.rows;
        this.rowsDinas = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageJadwalKerja(event: LazyLoadEvent) {
        this.getJadwalKerja((event.rows + event.first) / event.rows, event.rows, this.pencarianJadwalKerja);
        this.pageJadwalKerja = (event.rows + event.first) / event.rows;
        this.rowsJadwalKerja = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageResign(event: LazyLoadEvent) {
        this.getResign((event.rows + event.first) / event.rows, event.rows, this.pencarianResign);
        this.pageResign = (event.rows + event.first) / event.rows;
        this.rowsResign = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageReward(event: LazyLoadEvent) {
        this.getReward((event.rows + event.first) / event.rows, event.rows, this.pencarianReward);
        this.pageReward = (event.rows + event.first) / event.rows;
        this.rowsReward = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageSanksi(event: LazyLoadEvent) {
        this.getSanksi((event.rows + event.first) / event.rows, event.rows, this.pencarianReward);
        this.pageSanksi = (event.rows + event.first) / event.rows;
        this.rowsSanksi = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageSakit(event: LazyLoadEvent) {
        this.getSakit((event.rows + event.first) / event.rows, event.rows, this.pencarianReward);
        this.pageSakit = (event.rows + event.first) / event.rows;
        this.rowsSakit = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPageTransisi(event: LazyLoadEvent) {
        this.getTransisi((event.rows + event.first) / event.rows, event.rows, this.pencarianReward);
        this.pageTransisi = (event.rows + event.first) / event.rows;
        this.rowsTransisi = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    loadPagePinjaman(event: LazyLoadEvent) {
        this.getTransisi((event.rows + event.first) / event.rows, event.rows, this.pencarianReward);
        this.pagePinjaman = (event.rows + event.first) / event.rows;
        this.rowsPinjaman = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    confirmDelete() {
        let kode = this.formCuti.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Cuti');
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
        this.formCuti.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formCuti.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.formCuti.get('kdKeteranganAlasanHead').enable();
            let noUrut = this.totalRecords + 1;
            this.formCuti.get('noUrut').enable();
            this.formCuti.get('noUrut').setValue(noUrut);
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formCuti.value).subscribe(response => {
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
        if (this.formCuti.invalid) {
            this.validateAllFormFields(this.formCuti);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpan();
        }
    }
    confirmDeleteIjin() {
        let kode = this.formIjin.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Ijin');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusIjin();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateIjin() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateIjin();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateIjin() {
        this.formIjin.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formIjin.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanIjin() {
        if (this.formAktifIjin == false) {
            this.confirmUpdateIjin()
        } else {
            this.formIjin.get('kdKeteranganAlasanHead').enable();
            let noUrut = this.totalRecordsIjin + 1;
            this.formCuti.get('noUrut').enable();
            this.formCuti.get('noUrut').setValue(noUrut);
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formIjin.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitIjin() {
        if (this.formIjin.invalid) {
            this.validateAllFormFields(this.formIjin);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanIjin();
        }
    }
    confirmDeleteDinas() {
        let kode = this.formDinas.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Perjalanan Dinas');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusDinas();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateDinas() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateDinas();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateDinas() {
        this.formDinas.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formDinas.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanDinas() {
        if (this.formAktifDinas == false) {
            this.confirmUpdateDinas()
        } else {
            this.formDinas.get('kdKeteranganAlasanHead').enable();
            let noUrut = this.totalRecordsDinas + 1;
            this.formDinas.get('noUrut').enable();
            this.formDinas.get('noUrut').setValue(noUrut);
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formDinas.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitDinas() {
        if (this.formDinas.invalid) {
            this.validateAllFormFields(this.formDinas);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanDinas();
        }
    }
    confirmDeleteJadwalKerja() {
        let kode = this.formJadwalKerja.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Perubahan Jadwal Dinas');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusJadwalKerja();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateJadwalKerja() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateJadwalKerja();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateJadwalKerja() {
        this.formJadwalKerja.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formJadwalKerja.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanJadwalKerja() {
        if (this.formAktifJadwalKerja == false) {
            this.confirmUpdateJadwalKerja()
        } else {
            let noUrut = this.totalRecordsJadwalKerja + 1;
            this.formJadwalKerja.get('noUrut').enable();
            this.formJadwalKerja.get('noUrut').setValue(noUrut);
            this.formJadwalKerja.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formJadwalKerja.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitJadwalKerja() {
        if (this.formJadwalKerja.invalid) {
            this.validateAllFormFields(this.formJadwalKerja);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanJadwalKerja();
        }
    }
    confirmDeleteResign() {
        let kode = this.formResign.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Resign');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusResign();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateResign() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateResign();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateResign() {
        this.formResign.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formResign.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanResign() {
        if (this.formAktifResign == false) {
            this.confirmUpdateResign();
        } else {
            let noUrut = this.totalRecordsResign + 1;
            this.formResign.get('noUrut').enable();
            this.formResign.get('noUrut').setValue(noUrut);
            this.formResign.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formResign.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitResign() {
        if (this.formResign.invalid) {
            this.validateAllFormFields(this.formResign);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanResign();
        }
    }
    confirmDeleteReward() {
        let kode = this.formReward.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Reward');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusReward();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateReward() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateReward();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateReward() {

        this.formReward.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formReward.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanReward() {
        if (this.formAktifReward == false) {
            this.confirmUpdateReward()
        } else {
            let noUrut = this.totalRecordsReward + 1;
            this.formReward.get('noUrut').enable();
            this.formReward.get('noUrut').setValue(noUrut);
            this.formReward.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formReward.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitReward() {
        if (this.formReward.invalid) {
            this.validateAllFormFields(this.formReward);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanReward();
        }
    }
    confirmDeleteSanksi() {
        let kode = this.formSanksi.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Sanksi');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusSanksi();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateSanksi() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateSanksi();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateSanksi() {
        console.log(this.formSanksi.value);
        this.formSanksi.get('kdKeteranganAlasanHead').enable();
        console.log(this.formSanksi.value);
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formSanksi.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanSanksi() {
        if (this.formAktifSanksi == false) {
            this.confirmUpdateSanksi()
        } else {
            let noUrut = this.totalRecordsSanksi + 1;
            this.formSanksi.get('noUrut').enable();
            this.formSanksi.get('noUrut').setValue(noUrut);
            this.formSanksi.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formSanksi.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitSanksi() {
        if (this.formSanksi.invalid) {
            this.validateAllFormFields(this.formSanksi);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanSanksi();
        }
    }
     confirmDeleteSakit() {
        let kode = this.formSakit.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusSakit();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateSakit() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateSakit();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateSakit() {
        console.log(this.formSakit.value);
        this.formSakit.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formSakit.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanSakit() {
        if (this.formAktifSakit == false) {
            this.confirmUpdateSakit()
        } else {
            let noUrut = this.totalRecordsSakit + 1;
            this.formSakit.get('noUrut').enable();
            this.formSakit.get('noUrut').setValue(noUrut);
            this.formSakit.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formSakit.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitSakit() {
        if (this.formSakit.invalid) {
            this.validateAllFormFields(this.formSakit);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanSakit();
        }
    }
    confirmDeleteTransisi() {
        let kode = this.formTransisi.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Transisi');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusTransisi();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdateTransisi() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateTransisi();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updateTransisi() {
        console.log(this.formTransisi.value);
        this.formTransisi.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formTransisi.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanTransisi() {
        if (this.formAktifTransisi == false) {
            this.confirmUpdateTransisi();
        } else {
            let noUrut = this.totalRecordsTransisi + 1;
            this.formTransisi.get('noUrut').enable();
            this.formTransisi.get('noUrut').setValue(noUrut);
            this.formTransisi.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formTransisi.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitTransisi() {
        if (this.formTransisi.invalid) {
            this.validateAllFormFields(this.formTransisi);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanTransisi();
        }
    }
    confirmDeletePinjaman() {
        let kode = this.formPinjaman.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan Pinjaman');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusPinjaman();
                },
                reject: () => {
                    this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                }
            });
        }
    }
    confirmUpdatePinjaman() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updatePinjaman();
            },
            reject: () => {
                this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
            }
        });
    }
    updatePinjaman() {
        console.log(this.formPinjaman.value);
        this.formPinjaman.get('kdKeteranganAlasanHead').enable();
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.formPinjaman.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpanPinjaman() {
        if (this.formAktifPinjaman == false) {
            this.confirmUpdatePinjaman();
        } else {
            let noUrut = this.totalRecordsPinjaman + 1;
            this.formPinjaman.get('noUrut').enable();
            this.formPinjaman.get('noUrut').setValue(noUrut);
            this.formPinjaman.get('kdKeteranganAlasanHead').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.formPinjaman.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                //this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
    }
    onSubmitPinjaman() {
        if (this.formPinjaman.invalid) {
            this.validateAllFormFields(this.formPinjaman);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanPinjaman();
        }
    }
    reset() {
        this.formAktif = true;
        this.formAktifIjin = true;
        this.formAktifDinas = true;
        this.formAktifResign = true;
        this.formAktifReward = true;
        this.formAktifSanksi = true;
        this.formAktifTransisi = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.formCuti.setValue(cloned);
        this.formCuti.get('noUrut').enable();
    }
    onRowSelectIjin(event) {
        let cloned = this.clone(event.data);
        this.formAktifIjin = false;
        this.formIjin.setValue(cloned);
        this.formIjin.get('noUrut').enable();
    }
    onRowSelectDinas(event) {
        let cloned = this.clone(event.data);
        this.formAktifDinas = false;
        this.formDinas.setValue(cloned);
        this.formDinas.get('noUrut').enable();
    }
    onRowSelectJadwalKerja(event) {
        let cloned = this.clone(event.data);
        this.formAktifJadwalKerja = false;
        this.formJadwalKerja.setValue(cloned);
        this.formJadwalKerja.get('noUrut').enable();
    }
    onRowSelectResign(event) {
        let cloned = this.clone(event.data);
        this.formAktifResign = false;
        this.formResign.setValue(cloned);
        this.formResign.get('noUrut').enable();
    }
    onRowSelectReward(event) {
        let cloned = this.clone(event.data);
        this.formAktifReward = false;
        this.formReward.setValue(cloned);
        this.formReward.get('noUrut').enable();
    }
    onRowSelectSanksi(event) {
        let cloned = this.clone(event.data);
        this.formAktifSanksi = false;
        this.formSanksi.setValue(cloned);
        this.formSanksi.get('noUrut').enable();
    }
    onRowSelectSakit(event) {
        let cloned = this.clone(event.data);
        this.formAktifSakit = false;
        this.formSakit.setValue(cloned);
        this.formSakit.get('noUrut').enable();
    }
    onRowSelectPinjaman(event) {
        let cloned = this.clone(event.data);
        this.formAktifPinjaman = false;
        this.formPinjaman.setValue(cloned);
        this.formPinjaman.get('noUrut').enable();
    }
    onRowSelectTransisi(event) {
        console.log(event.data);
        //let cloned = this.clone(event.data);
        this.formAktifTransisi = false;
        this.formTransisi.get('kode').setValue(event.data.kode.kode);
        this.formTransisi.get('namaKeteranganAlasan').setValue(event.data.namaKeteranganAlasan);
        this.formTransisi.get('reportDisplay').setValue(event.data.reportDisplay);
        this.formTransisi.get('noUrut').setValue(event.data.noUrut);
        this.formTransisi.get('kdKeteranganAlasanHead').setValue(event.data.kdKeteranganAlasanHead);
        this.formTransisi.get('kodeExternal').setValue(event.data.kodeExternal);
        this.formTransisi.get('namaExternal').setValue(event.data.namaExternal);
        this.formTransisi.get('statusEnabled').setValue(event.data.statusEnabled);
        this.formTransisi.get('noUrut').enable();
        this.versi = event.data.version;
        //this.formTransisi.setValue(cloned);
    }
    clone(cloned: KeteranganAlasan): KeteranganAlasan {
        let hub = new InisialKeteranganAlasan();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKeteranganAlasan();
        fixHub = {
            "kode": hub.kode.kode,
            "namaKeteranganAlasan": hub.namaKeteranganAlasan,
            "reportDisplay": hub.reportDisplay,
            "noUrut": hub.noUrut,
            "kdKeteranganAlasanHead": hub.kdKeteranganAlasanHead,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.get(this.page, this.rows, this.pencarian);

        });
        this.reset();

    }
    hapusIjin() {
        let item = [...this.listDataIjin];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formIjin.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusDinas() {
        let item = [...this.listDataDinas];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formDinas.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusJadwalKerja() {
        console.log(this.formJadwalKerja.get('kode').value);
        let item = [...this.listDataJadwalKerja];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formJadwalKerja.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusResign() {
        let item = [...this.listDataResign];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formResign.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusReward() {
        let item = [...this.listDataResign];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formReward.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusSanksi() {
        let item = [...this.listDataSanksi];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formSanksi.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusSakit() {
        let item = [...this.listDataSakit];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formSakit.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusTransisi() {
        let item = [...this.listDataTransisi];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formTransisi.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            //this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
        

    }
    hapusPinjaman() {
        let item = [...this.listDataTransisi];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/keteranganalasan/del/' + this.formPinjaman.get('kode').value).subscribe(response => {
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

}

class InisialKeteranganAlasan implements KeteranganAlasan {

    constructor(
        public kode?,
        public namaKeteranganAlasan?,
        public reportDisplay?,
        public noUrut?,
        public kdKeteranganAlasanHead?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id?
    ) { }

}