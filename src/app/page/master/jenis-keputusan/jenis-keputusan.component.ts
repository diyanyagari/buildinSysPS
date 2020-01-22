import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisKeputusan } from './jenis-keputusan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-jenis-keputusan',
    templateUrl: './jenis-keputusan.component.html',
    providers: [ConfirmationService]
})
export class JenisKeputusanComponent implements OnInit {
    item: JenisKeputusan = new InisialJenisKeputusan();;
    selected: JenisKeputusan;
    listData: any[];
    kodeJenisKeputusanHead: JenisKeputusan[];
    pencarian: string;
    versi: any;
    items: any;
    page: number;
    rows: number;
    report: any;
    toReport: any;
    formAktif: boolean;
    form: FormGroup;
    totalRecords: number;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;

    kdprof: any;
    kddept: any;

    codes: any[];
    laporan: boolean = false;
    itemsChild: any;
    kdHead: any;
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
        }

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
        this.versi = null;
        this.form = this.fb.group({
            'kdJenisKeputusanHead': new FormControl(null),
            'namaJenisKeputusan': new FormControl('', Validators.required),
            'kode': new FormControl(),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
            'isGenerateSK': new FormControl()

        });

        this.getPage(this.page, this.rows, '');
        // this.get(this.page, this.rows, '', '');
        // if (this.index == 0){
        //     this.httpService.get(Configuration.get().dataMasterNew + '/jeniskeputusan/findAll?page=1&rows=300&dir=namaJenisKeputusan&sort=desc').subscribe(table => {
        //         this.listTab = table.JenisKeputusan;
        //         let i = this.listTab.length
        //         while (i--) {
        //             if (this.listTab[i].statusEnabled == false) { 
        //                 this.listTab.splice(i, 1);
        //             } 
        //         }
        //     });
        // };
        // let dataIndex = {
        //     "index": this.index
        // }
        // this.onTabChange(dataIndex);
        this.getSmbrFile();
    }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    getPage(page:number, rows: number, search: any){
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskeputusan/findAll?page='+page+'&rows='+rows+'&dir=namaJenisKeputusan&sort=desc').subscribe(table => {
            this.listData = table.JenisKeputusan;
            this.totalRecords = table.totalRow;
        });
    }
    // onTabChange(event) {
    //     this.form = this.fb.group({
    //         'kdJenisKeputusanHead': new FormControl(null),
    //         'namaJenisKeputusan': new FormControl('', Validators.required),
    //         'kode': new FormControl(),
    //         'kodeExternal': new FormControl(''),
    //         'namaExternal': new FormControl(''),
    //         'reportDisplay': new FormControl('', Validators.required),
    //         'statusEnabled': new FormControl(true, Validators.required)

    //     });
    //     let data;
    //     this.index = event.index;
    //     if (event.index > 0){
    //         let index = event.index-1;
    //         data = this.listTab[index].kode.kode;
    //         this.kdHead = data;
    //         this.form.get('kdJenisKeputusanHead').setValue(data);
    //     } else {
    //         data = '';
    //         this.form.get('kdJenisKeputusanHead').setValue(null);
    //     }
    //     this.pencarian = '';
    //     this.get(this.page,this.rows,this.pencarian, data);
    //     this.valuechange('');
    //     this.formAktif = true;
    // }
    // downloadExcel() {
    //     this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=id.kode,namaJabatan').subscribe(table => {

    //         this.fileService.exportAsExcelFile(table.data.data, 'Jabatan');
            
    //     });

    // }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskeputusan/findAll?').subscribe(table => {
            this.listData = table.JenisKeputusan;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
        // if (this.listData[i].statusEnabled == true){
            this.codes.push({

                kode: this.listData[i].kode.kode,
                namaJenisKeputusan: this.listData[i].namaJenisKeputusan,
                reportDisplay: this.listData[i].reportDisplay,
                kodeExternal: this.listData[i].kodeExternal,
                namaExternal: this.listData[i].namaExternal,
                statusEnabled: this.listData[i].statusEnabled

            })
        // }
    }
    this.fileService.exportAsExcelFile(this.codes, 'JenisKeputusan');
});

    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    downloadPdf(){
        let b = Configuration.get().report + '/jenisKeputusan/laporanJenisKeputusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisKeputusan/laporanJenisKeputusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisKeputusan_laporanCetak');

        // let b = Configuration.get().report + '/jenisKeputusan/laporanJenisKeputusan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
        this.laporan = false;
    }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisKeputusanChild/laporanJenisKeputusanChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisKeputusanHead='+ this.kdHead +'&download=false', 'frmJenisKeputusan_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/jenisKeputusanChild/laporanJenisKeputusanChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisKeputusanHead='+ this.kdHead +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){
    
    }






    // downloadPdf() {
    //     var col = ["Kode", "Nama Jabatan"];
    //     this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=id.kode,namaJabatan').subscribe(table => {
    //         this.fileService.exportAsPdfFile("Master Jabatan", col, table.data.data, "Jabatan");

    //     });

    // }
    get(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskeputusan/findAll?page='+page+'&rows='+rows+'&dir=namaJenisKeputusan&sort=desc&namaJenisKeputusan='+search+'&kdJenisKeputusanHead='+head).subscribe(table => {
            this.listData = table.JenisKeputusan;
            this.totalRecords = table.totalRow;
        });
    }

    cari() {

        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskeputusan/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaJenisKeputusan&sort=desc&namaJenisKeputusan='+ this.pencarian).subscribe(table => {
            this.listData = table.JenisKeputusan;
            
        });
        // let data = this.form.get('kdJenisKeputusanHead').value;
        // if (data == null) {
        //     this.get(this.page,this.rows,this.pencarian, '');
        // } else {
        //     this.get(this.page,this.rows,this.pencarian, data);
        // }
        

    }

    loadPage(event: LazyLoadEvent) {
        // let data = this.form.get('kdJenisKeputusanHead').value;
        // if (data == null) {
            // this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
        // } else {
        //     this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
        // }
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;

    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Keputusan');
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

    //  setPageRow(page, rows) {
    //     if(page == undefined || rows == undefined) {
    //         this.page = Configuration.get().page;
    //         this.rows = Configuration.get().rows;
    //     } else {
    //         this.page = page;
    //         this.rows = rows;
    //     }
    // }
    update() {
        let nilaifix;
        let nilaiGenerate = this.form.get('isGenerateSK').value;
        if( nilaiGenerate == true){
            nilaifix = 1;
        }else{
            nilaifix = 0;
        }
        let formSubmit = this.form.value;
        formSubmit.isGenerateSK = nilaifix;

        this.httpService.update(Configuration.get().dataMasterNew + '/jeniskeputusan/update/' + this.versi, formSubmit).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
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
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            console.log(this.form.value);
            let nilaifix;
            let nilaiGenerate = this.form.get('isGenerateSK').value;
            if( nilaiGenerate == true){
                nilaifix = 1;
            }else{
                nilaifix = 0;
            }
            let formSubmit = this.form.value;
            formSubmit.isGenerateSK = nilaifix;
            this.httpService.post(Configuration.get().dataMasterNew + '/jeniskeputusan/save?', formSubmit).subscribe(response => {
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
    clone(cloned: JenisKeputusan): JenisKeputusan {
        let hub = new InisialJenisKeputusan();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialJenisKeputusan();
        fixHub = {

            "kode": hub.kode.kode,
            "namaJenisKeputusan": hub.namaJenisKeputusan,
            "kdJenisKeputusanHead": hub.kdJenisKeputusanHead,
            "reportDisplay": hub.reportDisplay,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "statusEnabled": hub.statusEnabled,
            "isGenerateSK": hub.isGenerateSK

        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/jeniskeputusan/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialJenisKeputusan implements JenisKeputusan {

    constructor(
        public id?,
        public kdJenisKeputusanHead?,
        public namaJenisKeputusan?,
        public kode?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public isGenerateSK?

        ) { }

}