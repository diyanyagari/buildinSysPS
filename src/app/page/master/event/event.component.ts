import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Event } from './event.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss'],
    providers: [ConfirmationService]
})
export class EventComponent implements OnInit {

    // departemen: any[];
    kodeEventHead: any[];
    selected: Event;
    listData: Event[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    dataLoading: boolean;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    kdprof: any;
    kddept: any;
    items: any;
    codes: any[];
    laporan: boolean = false;
    itemsChild: any;
    kdAsalHead:any;
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        private fileService: FileService,
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
        this.formAktif = true;
        if (this.index == 0){
            this.httpService.get(Configuration.get().dataMasterNew + '/event/findAll?page=1&rows=300&dir=namaEvent&sort=desc').subscribe(table => {
                this.listTab = table.Event;
                let i = this.listTab.length
                while (i--) {
                    if (this.listTab[i].statusEnabled == false) { 
                        this.listTab.splice(i, 1);
                    } 
                }
            });
        };
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaEvent': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'kdEventHead': new FormControl(null),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required)
        });
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
            this.form.get('kdEventHead').setValue(data);
        } else {
            data = '';
            this.form.get('kdEventHead').setValue(null);
        }
        this.kdAsalHead = data;
        this.pencarian = '';
        this.get(this.page,this.rows,this.pencarian, data);
        this.valuechange('');
        this.formAktif = true;
    }
    get(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/event/findAll?page='+page+'&rows='+rows+'&dir=namaEvent&sort=desc&namaEvent='+search+'&kdEventHead='+head).subscribe(table => {
            this.listData = table.Event;
            this.totalRecords = table.totalRow;

        });
    }
    cari() {
        let data = this.form.get('kdEventHead').value;
        if (data == null) {
            this.get(this.page,this.rows,this.pencarian, '');
        } else {
            this.get(this.page,this.rows,this.pencarian, data);
        }
        
    }

    loadPage(event: LazyLoadEvent) {
        let data = this.form.get('kdEventHead').value;
        if (data == null) {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
        } else {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
        }
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
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
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Event');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/event/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate();
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/event/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
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
    clone(cloned: Event): Event {
        let hub = new InisialEvent();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialEvent();
        fixHub = {
            'namaEvent': hub.namaEvent,
            'kdEventHead': hub.kdEventHead,
            "kode": hub.kode.kode,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled,
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/event/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }
    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }

    downloadPdf(){
        let b = Configuration.get().report + '/event/laporanEvent.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(b);
    }

    downloadExcel(){
        this.httpService.get(Configuration.get().dataMasterNew + '/event/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaEvent&sort=desc').subscribe(table => {
            this.listData = table.Event;
            this.codes = [];
    
            for (let i = 0; i < this.listData.length; i++) {
                this.codes.push({
    
                    kode: this.listData[i].kode.kode,
                    namaEvent: this.listData[i].namaEvent,
                    kodeExternal: this.listData[i].kodeExternal,
                    namaExternal: this.listData[i].namaExternal,
                    statusEnabled: this.listData[i].statusEnabled,
                    reportDisplay: this.listData[i].reportDisplay
    
                })
    
                    // debugger;
                }
                this.fileService.exportAsExcelFile(this.codes, 'Event');
            });
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/event/laporanEvent.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmEvent_laporanCetak');
      
        // let b = Configuration.get().report + '/event/laporanEvent.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/eventChild/laporanEventChild.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdAsalHead='+ this.kdAsalHead +'&download=false', 'frmEvent_laporanCetak');
    }

    downloadPdfChild(){
        let b = Configuration.get().report + '/eventChild/laporanEventChild.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdAsalHead='+ this.kdAsalHead +'&download=true';
        window.open(b);
    }

    downloadExcelChild(){

    }

    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialEvent implements Event {

    constructor(
        public kode?,
        public id?,
        // public kdDepartemen?,
        public kdProfile?,
        public namaEvent?,
        public kdEventHead?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public noRec?,
        ) { }

}