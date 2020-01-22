import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Kelas } from './kelas.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-kelas',
    templateUrl: './kelas.component.html',
    styleUrls: ['./kelas.component.scss'],
    providers: [ConfirmationService]
})
export class KelasComponent implements OnInit {
    kdKelasHead: any;
    selected: Kelas;
    listData: Kelas[];
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
    codes: any[];
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    kdprof:any;
    kddept:any;
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
        this.form = this.fb.group({
            'namaKelas': new FormControl('', Validators.required),
            'noUrut': new FormControl(null),
            'kdKelasHead': new FormControl(null),
            'kode': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        this.form.get('noUrut').disable();
        if (this.index == 0){
            this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAll?page=1&rows=300&dir=namaKelas&sort=desc').subscribe(table => {
                this.listTab = table.Kelas;
                let i = this.listTab.length
                while (i--) {
                    if (this.listTab[i].statusEnabled == false) { 
                        this.listTab.splice(i, 1);
                    } 
                }
            });
        };
        this.form.get('noUrut').disable();
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
            this.form.get('kdKelasHead').setValue(data);
        } else {
            data = '';
            this.form.get('kdKelasHead').setValue(null);
        }
        this.kdHead = data;
        this.pencarian = '';
        this.get(this.page,this.rows,this.pencarian, data);
        this.valuechange('');
        this.formAktif = true;
        this.form.get('noUrut').disable();
    }
    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAll?').subscribe(table => {
            this.listData = table.Kelas;
            this.codes = [];

            for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i].statusEnabled == true){
                    this.codes.push({

                        kode: this.listData[i].kode.kode,
                        namaKelasHead: this.listData[i].namaKelasHead,
                        namaKelas: this.listData[i].namaKelas,
                        noUrut: this.listData[i].noUrut,
                        reportDisplay: this.listData[i].reportDisplay,
                        kodeExternal: this.listData[i].kodeExternal,
                        namaExternal: this.listData[i].namaExternal,
                        statusEnabled: this.listData[i].statusEnabled

                    })
                }
            }
            this.fileService.exportAsExcelFile(this.codes, 'Kelas');
        });

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/kelas/laporankelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
        // var col = ["Kode", "Parent", "Nama ", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAll?').subscribe(table => {
        //     this.listData = table.Kelas;
        //     this.codes = [];

        //     for (let i = 0; i < this.listData.length; i++) {
        //         if (this.listData[i].statusEnabled == true){
        //             this.codes.push({

        //                 kode: this.listData[i].kode.kode,
        //                 namaKelasHead: this.listData[i].namaKelasHead,
        //                 namaKelas: this.listData[i].namaKelas,
        //                 noUrut: this.listData[i].noUrut,
        //                 reportDisplay: this.listData[i].reportDisplay,
        //                 kodeExternal: this.listData[i].kodeExternal,
        //                 namaExternal: this.listData[i].namaExternal,
        //                 statusEnabled: this.listData[i].statusEnabled

        //             })
        //         }
        //     }
        //     this.fileService.exportAsPdfFile("Master Kelas", col, this.codes, "Kelas");

        // });
    }
    get(page: number, rows: number, search: any, head: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelas/findAll?page='+page+'&rows='+rows+'&dir=namaKelas&sort=desc&namaKelas='+search+'&kdKelasHead='+head).subscribe(table => {
            this.listData = table.Kelas;
            this.totalRecords = table.totalRow;
            this.form.get('noUrut').setValue(this.totalRecords+1);
        });
    }

    cari() {
        let data = this.form.get('kdKelasHead').value;
        if (data == null) {
            this.get(this.page,this.rows,this.pencarian, '');
        } else {
            this.get(this.page,this.rows,this.pencarian, data);
        }

    }

    loadPage(event: LazyLoadEvent) {
        let data = this.form.get('kdKelasHead').value;
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
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelas');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/kelas/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.form.get('noUrut').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/kelas/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.reset();
            });
        }

    }

    reset() {
        this.form.get('noUrut').disable();
        this.formAktif = true;
        this.ngOnInit();
        
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        this.form.get('noUrut').enable();

    }

    clone(cloned: Kelas): Kelas {
        let hub = new InisialKelas();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKelas();
        fixHub = {
            'namaKelas': hub.namaKelas,
            'noUrut': hub.noUrut,
            'kdKelasHead': hub.kdKelasHead,
            'kode': hub.kode.kode,
            'reportDisplay': hub.reportDisplay,
            'namaExternal': hub.namaExternal,
            'kodeExternal': hub.kodeExternal,
            'statusEnabled': hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/kelas/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kelas/laporankelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelas_laporanCetak');
        // let cetak = Configuration.get().report + '/kelas/laporankelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
      }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kelasChild/laporanKelasChild.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdKelasHead='+ this.kdHead +'&download=false', 'frmKelas_laporanCetak');
    }

    downloadPdfChild(){
        let b = Configuration.get().report + '/kelasChild/laporanKelasChild.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdKelasHead='+ this.kdHead +'&download=true';
        window.open(b);
    }

    downloadExcelChild(){
        
    }



      tutupLaporan() {
        this.laporan = false;
    }
}

class InisialKelas implements Kelas {

    constructor(
        public namaKelas?,//
        public noUrut?,//
        public kdKelasHead?,
        public namaKelasHead?,

        public kode?,
        public id?,
        public kdProfile?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        ) { }

}