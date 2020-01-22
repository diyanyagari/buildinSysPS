import { ViewChild, Inject, forwardRef, Component, OnInit } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Komponen, SelectedItem } from './komponen.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-komponen',
    templateUrl: './komponen.component.html',
    styleUrls: ['./komponen.component.scss'],
    providers: [ConfirmationService]
})
export class KomponenComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    selected: Komponen;
    listJenisKomponen: Komponen[];
    listProduk: Komponen[];
    listKelompokEvaluasi: Komponen[];
    listJabatan: Komponen[];
    listDataKomponen: Komponen[];
    listDataJenisKomponen: Komponen[];
    listTypeDataObjek: Komponen[];
    listSatuanHasil: Komponen[];
    listOperatorFactorRate: Komponen[];
    listParentJenisKomponen: Komponen[];
    listKomponen: Komponen[];
    versi: any;
    formKomponen: FormGroup;
    formJenisKomponen: FormGroup;
    formKomponenAktif: boolean;
    formJenisKomponenAktif: boolean;
    pencarianJenisKomponen: string;
    pencarian: string;
    items: MenuItem[];
    page: number;
    rows: number;
    pageJenisKomponen: number;
    rowsJenisKomponen: number;
    totalRecords: number;
    totalRecordsJenisKomponen: number;
    toReportJenisKomponen: any;
    reportJenisKomponen: any;
    toReportKomponen: any;
    reportKomponen: any;
    cekIsTaxed: any;
    isTaxed: boolean;
    cekIsPayroll: any;
    isPayroll: boolean;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    kdJenisKomponen: any;
    kdprof:any;
    kddept:any;
    items2:any[];
    codes: any[];
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
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;

        if (this.pageJenisKomponen == undefined || this.rowsJenisKomponen == undefined) {
            this.pageJenisKomponen = Configuration.get().page;
            this.rowsJenisKomponen = Configuration.get().rows;
        }
        this.formKomponenAktif = true;
        this.formKomponen = this.fb.group({
            'kode': new FormControl(''),
            'namaKomponen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdJenisKomponen': new FormControl(null, Validators.required),
            'nilaiMin': new FormControl(''),
            'nilaiNormal': new FormControl(''),
            'nilaiMax': new FormControl(''),
            'kdProduk': new FormControl(null),
            'kdKelompokEvaluasi': new FormControl(null),
            'kdSatuanHasil': new FormControl(null),
            'kdTypeDataObjek': new FormControl(null),
            'factorRate': new FormControl(1),
            'operatorFactorRate': new FormControl('X'),
            'isTaxed': new FormControl(false),
            'isPayroll': new FormControl(false),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required),
        });

        this.formJenisKomponenAktif = true;
        this.getJenisKomponen(this.pageJenisKomponen, this.rowsJenisKomponen, '');
        this.formJenisKomponen = this.fb.group({
            'kode': new FormControl(''),
            'namaJenisKomponen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('',  Validators.required),
            'kdJenisKomponenHead': new FormControl(null),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required),

        });
        // this.formJenisKomponen.get('noUrut').disable();
        // this.formKomponen.get('noUrut').disable();
        this.getDataKomponen();
        if (this.index == 0){
            this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAll?page=1&rows=300&dir=namaJenisKomponen&sort=desc').subscribe(table => {
                this.listTab = table.JenisKomponen;
                let i = this.listTab.length
                while (i--) {
                    if (this.listTab[i].statusEnabled == false) { 
                        this.listTab.splice(i, 1);
                    } 
                }
            });
        };
        let dataIndex = {
            "index": this.index
        }
        this.onTabChange(dataIndex);

        this.items = [
        {
            label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                this.downloadPdf();
            }
        },
        {
            label: 'Excel', icon: 'fa-file-excel-o', command: () => {
                this.downloadExel();
            }
        }];

        this.items2 = [
        {
            label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                this.downloadPdfInduk();
            }
        },
        {
            label: 'Excel', icon: 'fa-file-excel-o', command: () => {
                this.downloadExcelInduk();
            }
        }];

        this.getSmbrFile();

    }
    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}
    onTabChange(event) {
        this.formKomponenAktif = true;
        this.formJenisKomponenAktif = true;
        this.formJenisKomponen = this.fb.group({
            'kode': new FormControl(''),
            'namaJenisKomponen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('',  Validators.required),
            'kdJenisKomponenHead': new FormControl(null),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required),

        });
        this.formKomponen = this.fb.group({
            'kode': new FormControl(''),
            'namaKomponen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdJenisKomponen': new FormControl('', Validators.required),
            'nilaiMin': new FormControl(''),
            'nilaiNormal': new FormControl(''),
            'nilaiMax': new FormControl(''),
            'kdProduk': new FormControl(null),
            'kdKelompokEvaluasi': new FormControl(''),
            'kdSatuanHasil': new FormControl(''),
            'kdTypeDataObjek': new FormControl(''),
            'factorRate': new FormControl(1),
            'operatorFactorRate': new FormControl('X'),
            'isTaxed': new FormControl(false),
            'isPayroll': new FormControl(false),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        // this.formJenisKomponen.get('noUrut').disable();
        // this.formKomponen.get('noUrut').disable();
        let data;
        this.index = event.index;
        if (event.index > 0){
            let index = event.index-1;
            data = this.listTab[index].kode.kode;
            console.log(data);
            this.kdJenisKomponen = data;
            this.formKomponen.get('kdJenisKomponen').setValue(data);
            this.pencarian = '';
            this.getKomponen(this.page,this.rows,this.pencarian, data);
        } else {
            this.pencarianJenisKomponen = '';
            this.kdJenisKomponen = null;
            this.formKomponen.get('kdJenisKomponen').setValue(null);
            this.getJenisKomponen(this.page,this.rows,this.pencarianJenisKomponen);
        }
    }
    downloadExel() {


    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/komponen/laporanKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisKomponen='+ this.kdJenisKomponen+'&download=true';
        window.open(cetak);
    }

    downloadPdfInduk(){
        let cetak = Configuration.get().report + '/jenisKomponen/laporanJenisKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    downloadExcelInduk(){

    }

    cetakJenisKomponen(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisKomponen/laporanJenisKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisKomponen='+ this.kdJenisKomponen+'&download=false', 'frmJenisKomponen_laporanCetak');
                    // let cetak = Configuration.get().report + '/jenisKomponen/laporanJenisKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
                    // window.open(cetak);
                }
                
                cetakKomponen(){
                    this.laporan = true;
                    this.print.showEmbedPDFReport(Configuration.get().report + '/komponen/laporanKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisKomponen='+ this.kdJenisKomponen+'&download=false', 'frmKomponen_laporanCetak');
                    // let cetak = Configuration.get().report + '/komponen/laporanKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&kdJenisKomponen='+ this.kdJenisKomponen+'&download=false';
                    // window.open(cetak);
                }
                
                tutupLaporan() {
                    this.laporan = false;
                }
                
                valuechangeJenisKomponen(newValue) {
                    this.toReportJenisKomponen = newValue;
                    this.reportJenisKomponen = newValue;
                }
                
                valuechangeKomponen(newValue) {
                    this.toReportKomponen = newValue;
                    this.reportKomponen = newValue;
                }
                
                changeConvertTaxed(event) {
                    if (event == true) {
                        this.cekIsTaxed = 1
                        
                    } else {
                        this.cekIsTaxed = 0
                        
                    }
                    
                }
                changeConvertPayroll(event) {
                    if (event == true) {
                        this.cekIsPayroll = 1
                        
                    } else {
                        this.cekIsPayroll = 0
                        
                    }
                    
                }
                
                getKomponen(page: number, rows: number, search: any, head: any) {
                    this.httpService.get(Configuration.get().dataMasterNew + '/komponen/findAll?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaKomponen='+search+'&kdJenisKomponen='+head).subscribe(table => {
                        this.listDataKomponen = table.Komponen;
                        this.totalRecords = table.totalRow;
                        this.setNoUrut(this.totalRecords,head)
                    });
                }

                setNoUrut(totalRecords: number,head:any){
                    let totalData = [];
                    if (totalRecords <1){
                        this.formKomponen.get('noUrut').setValue(1)
                    }
                    else{
                        this.httpService.get(Configuration.get().dataMasterNew + '/komponen/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc&kdJenisKomponen='+head).subscribe(table => {
                            totalData = table.Komponen;
                            let ind = totalData.length - 1;     
                            if (ind == -1){
                                this.formKomponen.get('noUrut').setValue(1)
                            }
                            else {
                                let noLast = totalData[ind].noUrut + 1;
                                this.formKomponen.get('noUrut').setValue(noLast);
                            }
                        });
                    }
                }

                getJenisKomponen(page: number, rows: number, search: any) {
                    this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAllV2?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaJenisKomponen='+search).subscribe(table => {
                        this.listDataJenisKomponen = table.JenisKomponen;
                        this.totalRecordsJenisKomponen = table.totalRow;
                        this.setNoUrutJenisKomponen(this.totalRecordsJenisKomponen)
                    });
                }

                setNoUrutJenisKomponen(totalRecords: number){
                    let totalData = [];
                    if (totalRecords <1){
                        this.formJenisKomponen.get('noUrut').setValue(1)
                    }
                    else{
                        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc').subscribe(table => {
                            totalData = table.JenisKomponen;
                            let ind = totalData.length - 1;     
                            if (ind == -1){
                                this.formJenisKomponen.get('noUrut').setValue(1)
                            }
                            else {
                                let noLast = totalData[ind].noUrut + 1;
                                this.formJenisKomponen.get('noUrut').setValue(noLast);
                            }
                        });
                    }
                }


                cariKomponen() {
                    this.page = Configuration.get().page;
                    this.rows = Configuration.get().rows;
                    let data = this.formKomponen.get('kdJenisKomponen').value;
                    this.getKomponen(this.page,this.rows,this.pencarian, data);
                }
                cariJenisKomponen() {
                    this.page = Configuration.get().page;
                    this.rows = Configuration.get().rows;
                    this.getJenisKomponen(this.page,this.rows,this.pencarianJenisKomponen);
                }
                
                loadPageKomponen(event: LazyLoadEvent) {
                    let data = this.formKomponen.get('kdJenisKomponen').value;
                    this.getKomponen((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
                    this.page = (event.rows + event.first) / event.rows;
                    this.rows = event.rows;
                }
                loadPageJenisKomponen(event: LazyLoadEvent) {
                    this.getJenisKomponen((event.rows + event.first) / event.rows, event.rows, this.pencarianJenisKomponen);
                    this.page = (event.rows + event.first) / event.rows;
                    this.rows = event.rows;
                }
                getDataKomponen() {
                    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisKomponen&select=namaJenisKomponen,id').subscribe(res => {
                        this.listJenisKomponen = [];
                        this.listJenisKomponen.push({ label: '--Pilih Data Parent Jenis Komponen--', value: '' })
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.listJenisKomponen.push({ label: res.data.data[i].namaJenisKomponen, value: res.data.data[i].id.kode })
                        };
                    });
                    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisKomponen&select=namaJenisKomponen,id').subscribe(res => {
                        this.listKomponen = [];
                        this.listKomponen.push({ label: '--Pilih Jenis Komponen--', value: '' })
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.listKomponen.push({ label: res.data.data[i].namaJenisKomponen, value: res.data.data[i].id.kode })
                        };
                    });
                    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Produk&select=namaProduk,id').subscribe(res => {
                        this.listProduk = [];
                        this.listProduk.push({ label: '--Pilih Produk--', value: '' })
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.listProduk.push({ label: res.data.data[i].namaProduk, value: res.data.data[i].id.kode })
                        };
                    });
                    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokEvaluasi&select=namaKelompokEvaluasi,id').subscribe(res => {
                        this.listKelompokEvaluasi = [];
                        this.listKelompokEvaluasi.push({ label: '--Pilih Kelompok Evaluasi--', value: '' })
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.listKelompokEvaluasi.push({ label: res.data.data[i].namaKelompokEvaluasi, value: res.data.data[i].id.kode })
                        };
                    });
                    this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAllCombo').subscribe(res => {            
                        this.listTypeDataObjek = [];
                        this.listTypeDataObjek.push({ label: '--Pilih Type Data Objek--', value: '' })
                        for (var i = 0; i < res.data.length; i++) {
                            this.listTypeDataObjek.push({ label: res.data[i].namaTypeDataObjek, value: res.data[i].kode })
                        };
                    });
                    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=SatuanHasil&select=namaSatuanHasil,id').subscribe(res => {
                        this.listSatuanHasil = [];
                        this.listSatuanHasil.push({ label: '--Pilih Satuan Hasil--', value: '' })
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.listSatuanHasil.push({ label: res.data.data[i].namaSatuanHasil, value: res.data.data[i].id.kode })
                        };
                    });
                    this.listOperatorFactorRate = [];
                    this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: '' });
                    this.listOperatorFactorRate.push({ label: "+", value: '+' });
                    this.listOperatorFactorRate.push({ label: "-", value: '-' });
                    this.listOperatorFactorRate.push({ label: "X", value: 'X' });
                    this.listOperatorFactorRate.push({ label: "/", value: '/' });
                }
                confirmDeleteJenisKomponen() {
                    let kode = this.formJenisKomponen.get('kode').value;
                    if (kode == null || kode == undefined || kode == "") {
                        this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Komponen');
                    } else {
                        this.confirmationService.confirm({
                            message: 'Apakah data akan di hapus?',
                            header: 'Konfirmasi Hapus',
                            icon: 'fa fa-trash',
                            accept: () => {
                                this.hapusJenisKomponen();
                            },
                            reject: () => {
                                this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                            }
                        });
                    }
                }
                
                confirmDeleteKomponen() {
                    let kode = this.formKomponen.get('kode').value;
                    if (kode == null || kode == undefined || kode == "") {
                        this.alertService.warn('Peringatan', 'Pilih Daftar Master Komponen');
                    } else {
                        this.confirmationService.confirm({
                            message: 'Apakah data akan di hapus?',
                            header: 'Konfirmasi Hapus',
                            icon: 'fa fa-trash',
                            accept: () => {
                                this.hapusKomponen();
                            },
                            reject: () => {
                                this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
                            }
                        });
                    }
                }
                
                confirmUpdateJenisKomponen() {
                    this.confirmationService.confirm({
                        message: 'Apakah data akan diperbaharui?',
                        header: 'Konfirmasi Pembaharuan',
                        accept: () => {
                            this.updateJenisKomponen();
                        },
                        reject: () => {
                            this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
                        }
                    });
                }
                
                confirmUpdateKomponen() {
                    this.confirmationService.confirm({
                        message: 'Apakah data akan diperbaharui?',
                        header: 'Konfirmasi Pembaharuan',
                        accept: () => {
                            this.updateKomponen();
                        },
                        reject: () => {
                            this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
                        }
                    });
                }
                
                updateJenisKomponen() {

                    let statusEnabled = this.formJenisKomponen.get('statusEnabled').value;
                    let noUrut = this.formJenisKomponen.get('noUrut').value;
                    
                    if (noUrut == 0 && statusEnabled == true){
                        this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
                    }
                    else if (noUrut != 0 && statusEnabled == false){
                        this.formJenisKomponen.get('noUrut').setValue(0)
                        this.httpService.update(Configuration.get().dataMasterNew + '/jeniskomponen/update/' + this.versi, this.formJenisKomponen.value).subscribe(response => {
                            this.alertService.success('Berhasil', 'Data Diperbarui');
                            this.resetJenisKomponen();
                        });
                    }
                    else {

                        this.httpService.update(Configuration.get().dataMasterNew + '/jeniskomponen/update/' + this.versi, this.formJenisKomponen.value).subscribe(response => {
                            this.alertService.success('Berhasil', 'Data Diperbarui');
                            this.resetJenisKomponen();
                        });
                    }
                }
                
                updateKomponen() {

                    let statusEnabled = this.formKomponen.get('statusEnabled').value;
                    let noUrut = this.formKomponen.get('noUrut').value;
                    
                    if (noUrut == 0 && statusEnabled == true){
                        this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
                    }
                    else if (noUrut != 0 && statusEnabled == false){
                        let fixHub = {                        
                            "kode": this.formKomponen.get('kode').value,
                            "namaKomponen": this.formKomponen.get('namaKomponen').value,
                            "noUrut": 0,
                            "kdJenisKomponen": this.formKomponen.get('kdJenisKomponen').value,
                            "nilaiMin": this.formKomponen.get('nilaiMin').value,
                            "nilaiNormal": this.formKomponen.get('nilaiNormal').value,
                            "nilaiMax": this.formKomponen.get('nilaiMax').value,
                            "kdProduk": this.formKomponen.get('kdProduk').value,
                            "kdKelompokEvaluasi": this.formKomponen.get('kdKelompokEvaluasi').value,
                            "kdSatuanHasil": this.formKomponen.get('kdSatuanHasil').value,
                            "kdTypeDataObjek": this.formKomponen.get('kdTypeDataObjek').value,
                            "statusEnabled": this.formKomponen.get('statusEnabled').value,
                            "factorRate": this.formKomponen.get('factorRate').value,
                            "operatorFactorRate": this.formKomponen.get('operatorFactorRate').value,
                            "kodeExternal": this.formKomponen.get('kodeExternal').value,
                            "namaExternal": this.formKomponen.get('namaExternal').value,
                            "reportDisplay": this.formKomponen.get('reportDisplay').value,
                            "isPayroll": this.cekIsPayroll,
                            "isTaxed": this.cekIsTaxed,                                                       
                        }
                        this.httpService.update(Configuration.get().dataMasterNew + '/komponen/update/' + this.versi, fixHub).subscribe(response => {
                            this.alertService.success('Berhasil', 'Data Diperbarui');
                            this.resetKomponen();
                        });
                    }
                    else {
                        let fixHub = {

                            "kode": this.formKomponen.get('kode').value,
                            "namaKomponen": this.formKomponen.get('namaKomponen').value,
                            "noUrut": this.formKomponen.get('noUrut').value,
                            "kdJenisKomponen": this.formKomponen.get('kdJenisKomponen').value,
                            "nilaiMin": this.formKomponen.get('nilaiMin').value,
                            "nilaiNormal": this.formKomponen.get('nilaiNormal').value,
                            "nilaiMax": this.formKomponen.get('nilaiMax').value,
                            "kdProduk": this.formKomponen.get('kdProduk').value,
                            "kdKelompokEvaluasi": this.formKomponen.get('kdKelompokEvaluasi').value,
                            "kdSatuanHasil": this.formKomponen.get('kdSatuanHasil').value,
                            "kdTypeDataObjek": this.formKomponen.get('kdTypeDataObjek').value,
                            "statusEnabled": this.formKomponen.get('statusEnabled').value,
                            "factorRate": this.formKomponen.get('factorRate').value,
                            "operatorFactorRate": this.formKomponen.get('operatorFactorRate').value,
                            "kodeExternal": this.formKomponen.get('kodeExternal').value,
                            "namaExternal": this.formKomponen.get('namaExternal').value,
                            "reportDisplay": this.formKomponen.get('reportDisplay').value,
                            "isPayroll": this.cekIsPayroll,
                            "isTaxed": this.cekIsTaxed,
                            
                            
                        }
                        
                        this.httpService.update(Configuration.get().dataMasterNew + '/komponen/update/' + this.versi, fixHub).subscribe(response => {
                            this.alertService.success('Berhasil', 'Data Diperbarui');
                            this.resetKomponen();
                        });
                    }
                }
                
                simpanJenisKomponen() {
                    if (this.formJenisKomponenAktif == false) {
                        this.confirmUpdateJenisKomponen()
                    }
                    // else if ( this.formJenisKomponen.get('noUrut').value > this.totalRecordsJenisKomponen + 1) {
                    //     let nomorUrut = this.totalRecordsJenisKomponen + 1
                    //     this.alertService.warn("Peringatan", "Nomor Urut Tidak Boleh Lebih Dari " + nomorUrut )
                    // }
                    else {
                        // this.formJenisKomponen.get('noUrut').enable();
                        this.httpService.post(Configuration.get().dataMasterNew + '/jeniskomponen/save?', this.formJenisKomponen.value).subscribe(response => {
                            this.alertService.success('Berhasil', 'Data Disimpan');
                            this.resetJenisKomponen();
                        });
                    }
                    
                }
                
                simpanKomponen() {
                    if (this.formKomponenAktif == false) {
                        this.confirmUpdateKomponen()
                    }
                    // else if ( this.formKomponen.get('noUrut').value > this.totalRecords + 1) {
                    //     let nomorUrut = this.totalRecords + 1
                    //     this.alertService.warn("Peringatan", "Nomor Urut Tidak Boleh Lebih Dari " + nomorUrut )
                        
                    // }
                     else {
                        let pajak : number = 0;
                        let gaji : number = 0;
                        if (this.formKomponen.get('isTaxed').value != false) {
                            pajak = 1
                        }
                        if (this.formKomponen.get('isPayroll').value != false) {
                            gaji = 1
                        }
                        // let formKomponenSubmit = this.formKomponen.value;
                        // formKomponenSubmit.isTaxed = pajak;
                        // formKomponenSubmit.isPayroll = gaji;

                        let formKomponenSubmit = {
                            "factorRate": this.formKomponen.get('factorRate').value,
                            "isPayroll": gaji,
                            "isTaxed": pajak,
                            "kdAlat": null,
                            "kdDepartemen": null,
                            "kdJabatan": null,
                            "kdJenisKajian": null,
                            "kdJenisKomponen": this.formKomponen.get('kdJenisKomponen').value,
                            "kdKelompokEvaluasi": this.formKomponen.get('kdKelompokEvaluasi').value,
                            "kdPendidikan": null,
                            "kdProduk": this.formKomponen.get('kdProduk').value,
                            "kdSatuanHasil": this.formKomponen.get('kdSatuanHasil').value,
                            "kdTypeDataObjek": this.formKomponen.get('kdTypeDataObjek').value,
                            "keteranganLainnya": "",
                            "kode": this.formKomponen.get('kode').value,
                            "kodeExternal": this.formKomponen.get('kodeExternal').value,
                            "mapKdKomponenAlatToPeriksa": null,
                            "mapKdKomponenHargaToIndex": null,
                            "mapKdKomponenScoreToKlinis": null,
                            "memoDeskripsiKomponen": "",
                            "namaExternal": this.formKomponen.get('namaExternal').value,
                            "namaKomponen": this.formKomponen.get('namaKomponen').value,
                            "nilaiMax": this.formKomponen.get('nilaiMax').value,
                            "nilaiMin": this.formKomponen.get('nilaiMin').value,
                            "nilaiNormal": this.formKomponen.get('nilaiNormal').value,
                            "noRec": "",
                            "noUrut": this.formKomponen.get('noUrut').value,
                            "noUrutProduk": null,
                            "operatorFactorRate": this.formKomponen.get('operatorFactorRate').value,
                            "reportDisplay": this.formKomponen.get('reportDisplay').value,
                            "statusEnabled": this.formKomponen.get('statusEnabled').value,
                            "version": null
                        }


                        // this.formKomponen.get('noUrut').enable();

                        this.httpService.post(Configuration.get().dataMasterNew + '/komponen/save', formKomponenSubmit).subscribe(response => {
                            this.alertService.success('Berhasil', 'Data Disimpan');
                            this.resetKomponen();
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

                onSubmitJenisKomponen() {
                    if (this.formJenisKomponen.invalid) {
                        this.validateAllFormFields(this.formJenisKomponen);
                        this.alertService.warn("Peringatan", "Data Tidak Sesuai")
                    } else {
                        this.simpanJenisKomponen();
                    }
                }

                onSubmitKomponen() {
                    if (this.formKomponen.invalid) {
                        this.validateAllFormFields(this.formKomponen);
                        this.alertService.warn("Peringatan", "Data Tidak Sesuai")
                    } else {
                        this.simpanKomponen();
                    }
                }

                resetKomponen() {
                    // this.formKomponen.get('noUrut').disable();
                    this.dataTableComponent.reset();
                    this.formKomponenAktif = true;
                    this.ngOnInit();

                }
                resetJenisKomponen() {
                    // this.formJenisKomponen.get('noUrut').disable();
                    this.dataTableComponent.reset();
                    this.formJenisKomponenAktif = true;
                    this.ngOnInit();
                }

                onRowSelectJenisKomponen(event) {
                    this.formJenisKomponenAktif = false;
                    let cloned = this.cloneJenisKomponen(event.data);
                    this.formJenisKomponen.setValue(cloned);
                    // this.formJenisKomponen.get('noUrut').enable();
                }

                cloneJenisKomponen(cloned: any) {
                    let  fixHub = {
                        "kode": cloned.kode.kode,
                        "namaJenisKomponen": cloned.namaJenisKomponen,
                        "reportDisplay": cloned.reportDisplay,
                        "noUrut": cloned.noUrut,
                        "kdJenisKomponenHead": cloned.kdJenisKomponenHead,
                        "kodeExternal": cloned.kodeExternal,
                        "namaExternal": cloned.namaExternal,
                        "statusEnabled": cloned.statusEnabled
                    }
                    this.versi = cloned.version;
                    return fixHub;
                }

                onRowSelectKomponen(event) {
                    this.formKomponenAktif = false;
                    if (event.data.isTaxed == 1) {
                        this.isTaxed = true;
                        this.cekIsTaxed = 1;
                    } else {
                        this.isTaxed = false;
                        this.cekIsTaxed = 0;
                    }
                    if (event.data.isPayroll == 1) {
                        this.isPayroll = true;
                        this.cekIsPayroll = 1;
                    } else {
                        this.isPayroll = false;
                        this.cekIsPayroll = 0;
                    }

                    this.formKomponen.get('kode').setValue(event.data.kode.kode),
                    this.formKomponen.get('namaKomponen').setValue(event.data.namaKomponen),
                    this.formKomponen.get('noUrut').setValue(event.data.noUrut),
                    // this.formKomponen.get('noUrut').enable();
                    this.formKomponen.get('kdJenisKomponen').setValue(event.data.kdJenisKomponen),
                    this.formKomponen.get('nilaiMin').setValue(event.data.nilaiMin),
                    this.formKomponen.get('nilaiNormal').setValue(event.data.nilaiNormal),
                    this.formKomponen.get('nilaiMax').setValue(event.data.nilaiMax),
                    this.formKomponen.get('kdProduk').setValue(event.data.kdProduk),
                    this.formKomponen.get('kdKelompokEvaluasi').setValue(event.data.kdKelompokEvaluasi),
                    this.formKomponen.get('kdSatuanHasil').setValue(event.data.kdSatuanHasil),
                    this.formKomponen.get('kdTypeDataObjek').setValue(event.data.kdTypeDataObjek),
                    this.formKomponen.get('factorRate').setValue(event.data.factorRate),
                    this.formKomponen.get('operatorFactorRate').setValue(event.data.operatorFactorRate),
                    this.formKomponen.get('namaExternal').setValue(event.data.namaExternal),
                    this.formKomponen.get('kodeExternal').setValue(event.data.kodeExternal),
                    this.formKomponen.get('reportDisplay').setValue(event.data.reportDisplay),
                    this.formKomponen.get('isTaxed').setValue(this.isTaxed),
                    this.formKomponen.get('isPayroll').setValue(this.isPayroll),
                    this.formKomponen.get('statusEnabled').setValue(event.data.statusEnabled),
                    this.versi = event.data.version;
                }

                hapusKomponen() {
                    let item = [...this.listDataKomponen];
                    let deleteItem = item[this.findSelectedIndexKomponen()];
                    this.httpService.delete(Configuration.get().dataMasterNew + '/komponen/del/' + deleteItem.kode.kode).subscribe(response => {
                        this.alertService.success('Berhasil', 'Data Dihapus');
                        this.resetKomponen();
                    });
                }

                hapusJenisKomponen() {
                    let item = [...this.listDataJenisKomponen];
                    let deleteItem = item[this.findSelectedIndexJenisKomponen()];
                    this.httpService.delete(Configuration.get().dataMasterNew + '/jeniskomponen/del/' + deleteItem.kode.kode).subscribe(response => {
                        this.alertService.success('Berhasil', 'Data Dihapus');
                        this.resetJenisKomponen();
                    });

                }

                findSelectedIndexJenisKomponen(): number {
                    return this.listDataJenisKomponen.indexOf(this.selected);
                }

                findSelectedIndexKomponen(): number {
                    return this.listDataKomponen.indexOf(this.selected);
                }

                onDestroy() {

                }

                clearFilter(da:any){
                    da.filterValue = '';
                }

                clearFilterKomponen(db:any,dc:any,dd:any){
                    db.filterValue = '';
                    dc.filterValue = '';
                    dd.filterValue = '';
                }
            }

            class InisialKomponen implements Komponen {

                constructor(
                    public kode?,
                    public namaKomponen?,
                    public reportDisplay?,
                    public noUrut?,
                    public kdJenisKomponen?,
                    public nilaiMin?,
                    public nilaiNormal?,
                    public nilaiMax?,
                    public kdProduk?,
                    public kdKelompokEvaluasi?,
                    public kdJabatan?,

                    public kodeExternal?,
                    public namaExternal?,
                    public statusEnabled?,
                    public version?,
                    public id?,

                    public namaJenisKomponen?,
                    public kdJenisKomponenHead?,
                    ) { }

            }

