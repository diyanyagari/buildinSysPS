import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ShiftKerjaFormulasi } from './shift-kerja-formulasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration,  AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-shift-kerja-formulasi',
    templateUrl: './shift-kerja-formulasi.component.html',
    styleUrls: ['./shift-kerja-formulasi.component.scss'],
    providers: [ConfirmationService]
})
export class ShiftKerjaFormulasiComponent implements OnInit {
    kdShiftStart: any[];
    kdShiftNextNotAllowed: any[];
    kdDepartemen: any[];
    selected: ShiftKerjaFormulasi;
    listData: ShiftKerjaFormulasi[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    page: number;
    rows: number;
    totalRecords: number;
    kdprof: any;
    kddept: any;
    codes:any[];
    items:any;
    laporan: boolean = false;
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows; }


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
            this.get(this.page, this.rows, this.pencarian);
            this.form = this.fb.group({
                'qtyHariKerjaPerBulan': new FormControl('', Validators.required),
                'qtyHariLiburPerBulan': new FormControl('', Validators.required),
                'qtyHariKerjaToNewShift': new FormControl('', Validators.required),
                'qtyHariKerjaToLibur': new FormControl('', Validators.required),
                'qtyPegawaiPerShift': new FormControl('', Validators.required),
                'kdShiftNextNotAllowed': new FormControl(''),
                'kdDepartemen': new FormControl(''),
                'qtyHariLiburPerSiklus': new FormControl('', Validators.required),
                'kdShiftStart': new FormControl('', Validators.required),
                'statusEnabled': new FormControl('', Validators.required),
            });

            this.getSmbrFile();
        }

        getSmbrFile(){
            this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
                this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
            });
        }


        get(page: number, rows: number, search: any) {
            this.httpService.get(Configuration.get().dataMasterNew + '/shiftkerjaformulasi/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
                this.listData = table.ShiftKerjaFormulasi;
                this.totalRecords = table.totalRow;
            });

            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ShiftKerja&select=namaShift,id').subscribe(res => {
                this.kdShiftStart = [];
                this.kdShiftStart.push({ label: '--Pilih Mulai Peralihan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kdShiftStart.push({ label: res.data.data[i].namaShift, value: res.data.data[i].id.kode })
                };
            });

            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
                this.kdDepartemen = [];
                this.kdDepartemen.push({ label: '--Pilih Departemen--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kdDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
                };
            });

            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ShiftKerja&select=namaShift,id').subscribe(res => {
                this.kdShiftNextNotAllowed = [];
                this.kdShiftNextNotAllowed.push({ label: '--Pilih Peralihan Berikutnya Tidak Diijinkan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kdShiftNextNotAllowed.push({ label: res.data.data[i].namaShift, value: res.data.data[i].id.kode })
                };
            });
        }

        cari() {
            this.httpService.get(Configuration.get().dataMasterNew + '/shiftkerjaformulasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=shiftStart.namaShift&sort=desc&namaShiftStart=' + this.pencarian).subscribe(table => {
                this.listData = table.ShiftKerjaFormulasi;
                this.totalRecords = table.totalRow;
            });
        }
        confirmDelete() {
            let kdShiftStart = this.form.get('kdShiftStart').value;
            if (kdShiftStart == null || kdShiftStart == undefined || kdShiftStart == "") {
                this.alertService.warn('Peringatan', 'Pilih Daftar Master Shift Kerja Formulasi');
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
        loadPage(event: LazyLoadEvent) {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
            this.page = (event.rows + event.first) / event.rows;
            this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
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
        this.httpService.update(Configuration.get().dataMasterNew + '/shiftkerjaformulasi/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/shiftkerjaformulasi/save?', this.form.value).subscribe(response => {
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
    clone(cloned: ShiftKerjaFormulasi): ShiftKerjaFormulasi {
        let hub = new InisialShiftKerjaFormulasi();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialShiftKerjaFormulasi();
        fixHub = {
            'qtyHariKerjaPerBulan': hub.qtyHariKerjaPerBulan,
            'qtyHariLiburPerBulan': hub.qtyHariLiburPerBulan,
            'qtyHariKerjaToNewShift': hub.qtyHariKerjaToNewShift,
            'qtyHariKerjaToLibur': hub.qtyHariKerjaToLibur,
            'qtyPegawaiPerShift': hub.qtyPegawaiPerShift,
            'kdShiftNextNotAllowed': hub.kdShiftNextNotAllowed,
            'qtyHariLiburPerSiklus': hub.qtyHariLiburPerSiklus,
            'kdShiftStart': hub.kdShiftStart,
            'kdDepartemen': hub.kdDepartemen,
            'statusEnabled': hub.statusEnabled
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/shiftkerjaformulasi/del/' + deleteItem.kdShiftStart +'/' + deleteItem.kdDepartemen).subscribe(response => {
            this.get(this.page, this.rows, this.pencarian);

        });
        this.reset();
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    downloadExcel() {

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/shiftKerjaFormulasiFormulasi/laporanShiftKerjaFormulasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/shiftKerjaFormulasiFormulasi/laporanShiftKerjaFormulasi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmShiftKerjaFormulasi_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialShiftKerjaFormulasi implements ShiftKerjaFormulasi {

    constructor(
        public qtyHariKerjaPerBulan?,
        public qtyHariLiburPerBulan?,
        public qtyHariKerjaToNewShift?,
        public qtyHariKerjaToLibur?,
        public qtyPegawaiPerShift?,
        public kdShiftNextNotAllowed?,
        public qtyHariLiburPerSiklus?,
        public kdShiftStart?,

        public kode?,
        public kdDepartemen?,
        public kdProfile?,
        public version?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        ) { }

}