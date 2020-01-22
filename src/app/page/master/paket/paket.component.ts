import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Paket } from './paket.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard,ReportService } from '../../../global';

@Component({
    selector: 'app-paket',
    templateUrl: './paket.component.html',
    styleUrls: ['./paket.component.scss'],
    providers: [ConfirmationService]
})

export class PaketComponent implements OnInit {
    item: Paket = new InisialPaket();
    selected: Paket;
    listDataPaket: any[];
    codes: Paket[];
    dataDummy: {};
    formAktif: boolean;
    kodeGolonganPegawai: Paket[];
    ruangan: Paket[];
    versi: any;
    formPaket: FormGroup;
    items: any;
    kode: any;
    id: any;
    value: any;
    page: number;
    id_kode: any;
    rows: number;
    totalRecordsPaket: number;
    report: any;
    reportChild: any;
    toReport: any;
    pencarian: string = '';
    jenisTransaksi: Paket[];
    kdDepartemen: Paket[];
    jenisPaket: Paket[];

    JenisPaket: any;
    formAktifJenisPaket: boolean;
    formJenisPaket: FormGroup;

    namaJenisPaket: any;
    reportDisplay: any;
    kdJenisPaketHead: any = [];
    kdDepartemenJenisPaket: any;
    kodeExternal: any;
    namaExternal: any;
    statusEnabled: any;
    noRec: any;

    listDataJenisPaket: any = [];

    pencarianJenisPaket: string = '';
    dataSimpan: any;

    pageJenisPaket: number;
    totalRecordsJenisPaket: number;
    rowsJenisPaket: number;
    versiJenisPaket: number;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    laporan: boolean = false;
    itemsChild: any;
    kdJenisPaket:any;
    kdprof: any;
    kddept: any;
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        private fileService: FileService,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }
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

    this.itemsChild = [
      {
          label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
              this.downloadPdfChild();
          }
      },
      {
          label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
              this.downloadExcelChild();
          }
      },
      ];

        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        if (this.pageJenisPaket == undefined || this.rowsJenisPaket == undefined) {
            this.pageJenisPaket = Configuration.get().page;
            this.rowsJenisPaket = Configuration.get().rows;
        }
        this.formAktif = true;
        this.formPaket = this.fb.group({
            'kode': new FormControl(null),
            'namaPaket': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'kdJenisTransaksi': new FormControl('', Validators.required),
            'kdJenisPaket': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),


        });
        this.formAktifJenisPaket = true;

        this.formJenisPaket = this.fb.group({
            'namaJenisPaket': new FormControl(null, Validators.required),
            'reportDisplay': new FormControl(null, Validators.required),
            'kdJenisPaketHead': new FormControl(null),
            'kodeExternal': new FormControl(null),
            'namaExternal': new FormControl(null),
            'statusEnabled': new FormControl(true, Validators.required),
            'noRec': new FormControl(null),
            'kode': new FormControl(null),
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisTransaksi&select=id.kode,%20namaJenisTransaksi&page=1&rows=300&condition=and&profile=y').subscribe(res => {
            this.jenisTransaksi = [];
            this.jenisTransaksi.push({ label: '--Pilih Jenis Transaksi--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.jenisTransaksi.push({ label: res.data.data[i].namaJenisTransaksi, value: res.data.data[i].id_kode })
            };
        });
        if (this.index == 0){
            this.httpService.get(Configuration.get().dataMasterNew + '/jenispaket/findAll?page=1&rows=300&dir=namaJenisPaket&sort=desc').subscribe(table => {
                this.listTab = table.JenisPaket;
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
        this.getSmbrFile();

    }
    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}
    onTabChange(event) {
        this.formAktif = true;
        this.formPaket = this.fb.group({
            'kode': new FormControl(null),
            'namaPaket': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'kdJenisTransaksi': new FormControl('', Validators.required),
            'kdJenisPaket': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        this.formAktifJenisPaket = true;
        this.formJenisPaket = this.fb.group({
            'namaJenisPaket': new FormControl(null, Validators.required),
            'reportDisplay': new FormControl(null, Validators.required),
            'kdJenisPaketHead': new FormControl(null),
            'kodeExternal': new FormControl(null),
            'namaExternal': new FormControl(null),
            'statusEnabled': new FormControl(true, Validators.required),
            'noRec': new FormControl(null),
            'kode': new FormControl(null),
        });
        let data;
        this.index = event.index;
        if (event.index > 0){
            let index = event.index-1;
            data = this.listTab[index].kode.kode;
            this.formPaket.get('kdJenisPaket').setValue(data);
            this.kdJenisPaket = data;
            this.pencarian = '';
            this.getPaket(this.page,this.rows,this.pencarian, data);
        } else {
            this.pencarianJenisPaket = '';
            this.formPaket.get('kdJenisPaket').setValue(null);
            this.getJenisPaket(this.page,this.rows,this.pencarianJenisPaket);
        }
        this.valuechange('');
        this.valuechangeJenisPaket('');
    }

    valuechangeJenisPaket(newValue) {
        this.report = newValue;
    }
    valuechange(newValue) {
        this.reportChild = newValue;
    }
    getPaket(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/paket/findAll?page='+page+'&rows='+rows+'&dir=namaPaket&sort=desc&namaPaket='+search+'&kdJenisPaket='+head).subscribe(table => {
            this.listDataPaket = table.Paket;
            this.totalRecordsPaket = table.totalRow;
        });
    }
    getJenisPaket(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenispaket/findAll?page='+page+'&rows='+rows+'&dir=namaJenisPaket&sort=desc&namaJenisPaket='+search).subscribe(table => {
            this.listDataJenisPaket = table.JenisPaket;
            this.totalRecordsJenisPaket = table.totalRow;
        });
    }
    cariPaket() {
        let data = this.formPaket.get('kdJenisPaket').value;
        if (data == null) {
          this.getPaket(this.page, this.rows, this.pencarian, '');
        } else {
          this.getPaket(this.page, this.rows, this.pencarian, data);
        }
    }
    cariJenisPaket() {
        let data = this.formPaket.get('kdJenisPaket').value;
        if (data == null) {
          this.getJenisPaket(this.page, this.rows, this.pencarianJenisPaket);
        } else {
        this.getJenisPaket(this.page,this.rows,this.pencarianJenisPaket);
        }
    }

    loadPagePaket(event: LazyLoadEvent) {
        let data = this.formPaket.get('kdJenisPaket').value;
        this.getPaket((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }
    loadPageJenisPaket(event: LazyLoadEvent) {
        this.getJenisPaket((event.rows + event.first) / event.rows, event.rows, this.pencarianJenisPaket);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDeletePaket() {
        let kode = this.formPaket.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Paket');
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

    onSubmitPaket() {
        if (this.formPaket.invalid) {
            this.validateAllFormFields(this.formPaket);
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
        this.httpService.update(Configuration.get().dataMasterNew + '/paket/update/' + this.versi, this.formPaket.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.resetPaket();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/paket/save?', this.formPaket.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.resetPaket();
            });
        }

    }

    resetPaket() {
        this.formAktif = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.formPaket.setValue(cloned);

    }
    clone(cloned: Paket): Paket {
        let hub = new InisialPaket();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialPaket();
        fixHub = {
            "kode": hub.kode.kode,
            "namaPaket": hub.namaPaket,
            "kdJenisPaket": hub.kdJenisPaket,
            "kdJenisTransaksi": hub.kdJenisTransaksi,
            "reportDisplay": hub.reportDisplay,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "statusEnabled": hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapus() {
        let item = [...this.listDataPaket];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/paket/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.resetPaket();
        });
    }

    findSelectedIndex(): number {
        return this.listDataPaket.indexOf(this.selected);
    }

    onDestroy() {

    }
    cloneJenisPaket(cloned: any) {
        let fixHub = {
            // "kdJenisPaket": cloned.kdJenisPaket,
            "namaJenisPaket": cloned.namaJenisPaket,
            "reportDisplay": cloned.reportDisplay,
            "kdJenisPaketHead": cloned.kdJenisPaketHead,
            // "kdDepartemen": cloned.kdDepartemen,
            "kodeExternal": cloned.kodeExternal,
            "namaExternal": cloned.namaExternal,
            "statusEnabled": cloned.statusEnabled,
            "noRec": cloned.noRec,
            "kode": cloned.kode.kode,
        }
        this.versiJenisPaket = cloned.version;
        return fixHub;
    }

    onRowSelectJenisPaket(event) {
        let cloned = this.cloneJenisPaket(event.data);
        this.formAktifJenisPaket = false;
        this.formJenisPaket.setValue(cloned);
    }

    onSubmitJenisPaket() {
        if (this.formJenisPaket.invalid) {
            this.validateAllFormFields(this.formJenisPaket);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanJenisPaket();
        }
    }

    confirmUpdateJenisPaket() {
        this.confirmationService.confirm({
            message: 'Apakah data akan diperbaharui?',
            header: 'Konfirmasi Pembaharuan',
            accept: () => {
                this.updateJenisPaket();
            }
        });
    }

    updateJenisPaket() {
        this.httpService.update(Configuration.get().dataMasterNew + '/jenispaket/update/' + this.versiJenisPaket, this.formJenisPaket.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.resetJenisPaket();
        });
    }

    simpanJenisPaket() {
        if (this.formAktifJenisPaket == false) {
            this.confirmUpdateJenisPaket();
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/jenispaket/save', this.formJenisPaket.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.resetJenisPaket();
            });
        }

    }
    resetJenisPaket() {
        this.formAktifJenisPaket = true;
        this.ngOnInit();
    }

    hapusJenisPaket() {
        let item = [...this.listDataJenisPaket];
        let deleteItem = item[this.findSelectedIndexJenisPaket()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/jenispaket/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.resetJenisPaket();
        });
    }

    findSelectedIndexJenisPaket(): number {
        return this.listDataJenisPaket.indexOf(this.selected);
    }


    confirmDeleteJenisPaket() {
        let kode = this.formJenisPaket.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Paket');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapusJenisPaket();
                }
            });
        }
    }

    setReportDisplay() {
        this.formJenisPaket.get('reportDisplay').setValue(this.formJenisPaket.get('namaJenisPaket').value)
    }

    downloadExcel() {

      }
    
      downloadPdf() {
        let b = Configuration.get().report + '/paket/laporanPaket.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(b);
      }
    
      cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/paket/laporanPaket.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPaket_laporanCetak');
      }
    
      cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/paketChild/laporanPaketChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisPaket='+ this.kdJenisPaket +'&download=false', 'frmPaket_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/paketChild/laporanPaketChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisPaket='+ this.kdJenisPaket +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
    }






}

class InisialPaket implements Paket {

    constructor(
        public Paket?,
        public id?,
        public kdProfile?,
        public kode?,
        public kdPaket?,
        public namaPaket?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id_kode?,
        public code?,
        public nama?,
        public kodeEx?,
        public namaEx?,
        public kdJenisPaket?,
        public kdJenisTransaksi?
        ) { }

}









