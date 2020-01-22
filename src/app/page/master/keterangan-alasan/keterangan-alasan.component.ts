import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KeteranganAlasan, SelectedItem } from './keterangan-alasan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-keterangan-alasan',
    templateUrl: './keterangan-alasan.component.html',
    styleUrls: ['./keterangan-alasan.component.scss'],
    providers: [ConfirmationService]
})
export class KeteranganAlasanComponent implements OnInit {
    selected: KeteranganAlasan;
    listKeteranganAlasan: SelectedItem[];
    // listDepartemen: SelectedItem[];
    listData: KeteranganAlasan[];
    versi: any;
    form: FormGroup;
    formAktif: boolean;
    pencarian: string;
    items: MenuItem[];
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    codes:any[];
    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    itemsChild: any;
    kdHead:any;
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

        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.pencarian = '';
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaKeteranganAlasan': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'noUrut': new FormControl('', Validators.required),
            'kdKeteranganAlasanHead': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl(true)
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
        this.form.get('noUrut').disable();
        if (this.index == 0){
            this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAll?page=1&rows=300&dir=namaKeteranganAlasan&sort=desc').subscribe(table => {
                this.listTab = table.KeteranganAlasan;
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
        let data;
        this.index = event.index;
        if (event.index > 0){
            let index = event.index-1;
            data = this.listTab[index].kode.kode;
            this.kdHead = data;
            this.form.get('kdKeteranganAlasanHead').setValue(data);
        } else {
            data = '';
            this.form.get('kdKeteranganAlasanHead').setValue(null);
        }
        this.pencarian = '';
        this.get(this.page,this.rows,this.pencarian, data);
        this.valuechange('');
    }
    downloadExel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaKeteranganAlasan&sort=desc').subscribe(table => {
            this.listData = table.KeteranganAlasan;
            this.codes = [];
    
            for (let i = 0; i < this.listData.length; i++) {
                this.codes.push({
    
                    kode: this.listData[i].kode.kode,
                    namaKeteranganAlasan: this.listData[i].namaKeteranganAlasan,
                    noUrut: this.listData[i].noUrut,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,
                    statusEnabled: this.listData[i].statusEnabled,
                    reportDisplay: this.listData[i].reportDisplay
    
                })
    
                    // debugger;
                }
                this.fileService.exportAsExcelFile(this.codes, 'KeteranganAlasan');
            });
        // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KeteranganAlasan&select=id.kode,namaKeteranganAlasan').subscribe(table => {
        //     this.fileService.exportAsExcelFile(table.data.data, 'KeteranganAlasan');
        // });

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/keteranganAlasan/laporanKeteranganAlasan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
        // var col = ["Kode", "Nama KeteranganAlasan"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KeteranganAlasan&select=id.kode,namaKeteranganAlasan').subscribe(table => {
        //     this.fileService.exportAsPdfFile("Master KeteranganAlasan", col, table.data.data, "KeteranganAlasan");

        // });

    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    get(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/keteranganalasan/findAll?page='+page+'&rows='+rows+'&dir=namaKeteranganAlasan&sort=desc&namaKeteranganAlasan='+search+'&kdKeteranganAlasanHead='+head).subscribe(table => {
            this.listData = table.KeteranganAlasan;
            this.totalRecords = table.totalRow;
            this.form.get('noUrut').setValue(this.totalRecords+1);
        });
    }

    cari() {
        let data = this.form.get('kdKeteranganAlasanHead').value;
        if (data == null) {
            this.get(this.page,this.rows,this.pencarian, '');
        } else {
            this.get(this.page,this.rows,this.pencarian, data);
        }

    }

    loadPage(event: LazyLoadEvent) {
        let data = this.form.get('kdKeteranganAlasanHead').value;
        if (data == null) {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
        } else {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
        }
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Keterangan Alasan');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/keteranganalasan/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.form.get('noUrut').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/keteranganalasan/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
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
        this.formAktif = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.get('noUrut').enable();
        this.form.setValue(cloned);
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
            this.reset();
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/keteranganAlasan/laporanKeteranganAlasan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKeteranganAlasan_laporanCetak');

        // let cetak = Configuration.get().report + '/keteranganAlasan/laporanKeteranganAlasan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
      }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/keteranganAlasanChild/laporanKeteranganAlasanChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdKeteranganAlasanHead='+ this.kdHead +'&download=false', 'frmKeteranganAlasan_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/keteranganAlasanChild/laporanKeteranganAlasanChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdKeteranganAlasanHead='+ this.kdHead +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
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