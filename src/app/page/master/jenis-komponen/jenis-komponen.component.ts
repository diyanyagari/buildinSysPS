import { ViewChild, Inject, forwardRef, Component, OnInit } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { JenisKomponen, SelectedItem } from './jenis-komponen.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, FileService, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-jenis-komponen',
    templateUrl: './jenis-komponen.component.html',
    styleUrls: ['./jenis-komponen.component.scss'],
    providers: [ConfirmationService]
})
export class JenisKomponenComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    selected: JenisKomponen;
    listJenisKomponen: SelectedItem[];
    listJenisKomponenHead: any = [];
    listData: JenisKomponen[];
    versi: any;
    form: FormGroup;
    formAktif: boolean;
    pencarian: string;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    codes: any[];
    kdprof: any;
    kddept: any;
    laporan: boolean = false;


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
        this.formAktif = true;
        this.pencarian = '';
        this.get(this.page, this.rows, this.pencarian);
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaJenisKomponen': new FormControl('', Validators.required),
            'noUrut': new FormControl(''),
            'kdJenisKomponenHead': new FormControl(null),
            'reportDisplay': new FormControl('', Validators.required),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required)
        });
        this.items = [
            {
                label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                    this.downloadPdf();
                }
            },
            {
                label: 'Excel', icon: 'fa-file-excel-o', command: () => {
                    this.downloadExcel();
                }
            }];

            this.getJenisKomponenHead();
    }
    downloadExcel() {

    }
    downloadPdf() {
        let cetak = Configuration.get().report + '/jenisKomponen/laporanJenisKomponen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=true';
        window.open(cetak);
    }
    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisKomponen/laporanJenisKomponen.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&download=false', 'frmJenisKomponen_laporanCetak');

        // let cetak = Configuration.get().report + '/jenisKomponen/laporanJenisKomponen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
    }
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAllV2?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisKomponen&sort=desc&namaJenisKomponen=' + this.pencarian).subscribe(table => {
            this.listData = table.JenisKomponen;
            this.totalRecords = table.totalRow;
        });
    }
    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAllV2?page='+page+'&rows='+rows+'&dir=namaJenisKomponen&sort=desc').subscribe(table => {
            this.listData = table.JenisKomponen;           
            this.totalRecords = table.totalRow;
        });
        // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisKomponen&select=namaJenisKomponen,id').subscribe(res => {
        //     this.listJenisKomponen = [];
        //     this.listJenisKomponen.push({ label: '--Pilih Data Parent Jenis Komponen--', value: null })
        //     for (var i = 0; i < res.data.data.length; i++) {
        //         this.listJenisKomponen.push({ label: res.data.data[i].namaJenisKomponen, value: res.data.data[i].id.kode })
        //     };

        // });

    }
    getJenisKomponenHead() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jeniskomponen/findAll').subscribe(res => {
            this.listJenisKomponenHead = [];
            this.listJenisKomponenHead.push({ label: '-- Pilih --', value: '' })
            for (var i = 0; i < res.JenisKomponen.length; i++) {
                this.listJenisKomponenHead.push({ label: res.JenisKomponen[i].namaJenisKomponen, value: res.JenisKomponen[i].kode.kode })
            };
        })
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Komponen');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/jeniskomponen/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            // console.log(JSON.stringify(this.form.value));
            this.httpService.post(Configuration.get().dataMasterNew + '/jeniskomponen/save?', this.form.value).subscribe(response => {
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
        if (this.form.invalid) {
            this.validateAllFormFields(this.form);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpan();
        }
    }
    reset() {
        this.dataTableComponent.reset();
        this.ngOnInit();
    }
    onRowSelect(event) {
        this.formAktif = false;
        let cloned = this.clone(event.data);
        this.form.setValue(cloned);
    }
    clone(cloned: JenisKomponen): JenisKomponen {
        let hub = new InisialJenisKomponen();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialJenisKomponen();
        fixHub = {
            "kode": hub.kode.kode,
            "namaJenisKomponen": hub.namaJenisKomponen,
            "reportDisplay": hub.reportDisplay,
            "noUrut": hub.noUrut,
            "kdJenisKomponenHead": hub.kdJenisKomponenHead,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/jeniskomponen/del/' + deleteItem.kode.kode).subscribe(response => {
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });

    }
    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    setReportDisplay() {
        this.form.get('reportDisplay').setValue(this.form.get('namaJenisKomponen').value)
    }
    clearFilter(da:any){
        da.filterValue = '';
    }
}

class InisialJenisKomponen implements JenisKomponen {

    constructor(
        public kode?,
        public namaJenisKomponen?,
        public reportDisplay?,
        public noUrut?,
        public kdJenisKomponenHead?,
        // public kdDepartemen?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id?
    ) { }

}