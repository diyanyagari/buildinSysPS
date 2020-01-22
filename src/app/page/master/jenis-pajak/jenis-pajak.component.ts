import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { jenisPajak } from './jenis-pajak.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
    selector: 'app-jenis-pajak',
    templateUrl: './jenis-pajak.component.html',
    styleUrls: ['./jenis-pajak.component.scss'],
    providers: [ConfirmationService]
})

export class JenisPajakComponent implements OnInit {
    items: any;
    formAktif: boolean;
    form: FormGroup;
    pencarian: string;
    listData: jenisPajak[];
    selected: any;
    listJenisPajakHead: any[];
    totalRecords: number;
    page: number;
    rows: number;
    versi: any;
    codes: any;
    isCari: any;
    report: any;
    toReport: any;
    kdprof: any;
    kddept: any;
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
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.form = this.fb.group({
            'namaJenisPajak': new FormControl('', Validators.required),
            'kdJenisPajakHead': new FormControl(''),
            'deskripsi': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
            'kode': new FormControl(''),

        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisPajak&select=namaJenisPajak,id').subscribe(res => {
            this.listJenisPajakHead = [];
            this.listJenisPajakHead.push({ label: '--Pilih Data Parent Jenis Pajak--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listJenisPajakHead.push({ label: res.data.data[i].namaJenisPajak, value: res.data.data[i].id.kode })
            };

        });

        this.getSmbrFile();
    }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }
    get(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenispajak/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.JenisPajak;
            this.totalRecords = table.totalRow;
        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/jenispajak/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJenisPajak&sort=desc&namaJenisPajak=' + this.pencarian).subscribe(table => {
            this.listData = table.JenisPajak;
        });
    }

    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Pajak');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/jenispajak/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/jenispajak/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.get(this.page, this.rows, this.pencarian);
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

    clone(cloned: jenisPajak): jenisPajak {
        let hub = new InisialjenisPajak();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialjenisPajak();
        fixHub = {
            'kode': hub.kode.kode,
            'namaJenisPajak': hub.namaJenisPajak,
            'kdJenisPajakHead': hub.kdJenisPajakHead,
            'deskripsi': hub.deskripsi,

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
        this.httpService.delete(Configuration.get().dataMasterNew + '/jenispajak/del/' + deleteItem.kode.kode).subscribe(response => {
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });

    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisPajak/laporanJenisPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisPajak_laporanCetak');
    }

    tutupLaporan() {
        this.laporan = false;
    }

    downloadPdf(){
        let cetak = Configuration.get().report + '/jenisPajak/laporanJenisPajak.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }
    downloadExcel(){
        
    }
}

class InisialjenisPajak implements jenisPajak {

    constructor(
        public namaJenisPajak?,
        public kdJenisOrganisasiHead?,
        public kdJenisPajakHead?,
        public deskripsi?,

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


