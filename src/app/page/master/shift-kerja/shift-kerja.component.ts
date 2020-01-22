import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ShiftKerja } from './shift-kerja.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService  } from '../../../global';
@Component({
    selector: 'app-shift-kerja',
    templateUrl: './shift-kerja.component.html',
    styleUrls: ['./shift-kerja.component.scss'],
    providers: [ConfirmationService]
})
export class ShiftKerjaComponent implements OnInit {
    listOperatorFactorRate: any[];
    kdKomponenIndex: any[];
    selected: ShiftKerja;
    listData: ShiftKerja[];
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
    laporan: boolean = false;
	kdprof: any;
    kddept: any;
    codes:any[];
    items:any;
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
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
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, this.pencarian);
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaShift': new FormControl('', Validators.required),
            'jamMasuk': new FormControl('', Validators.required),
            'jamPulang': new FormControl('', Validators.required),
            'qtyJamKerjaEfektif': new FormControl(''),
            'jamBreakAwal': new FormControl(''),
            'jamBreakAkhir': new FormControl(''),
            'qtyJamBreakEfektif': new FormControl(''),
            'factorRate': new FormControl(1, Validators.required),
            'operatorFactorRate': new FormControl('X', Validators.required),
            'kdKomponenIndex': new FormControl(null),
            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
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
        this.httpService.get(Configuration.get().dataMasterNew + '/shiftkerja/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaShift&sort=desc').subscribe(table => {
            this.listData = table.ShiftKerja;
        });

        this.listOperatorFactorRate = [];
        this.listOperatorFactorRate.push({ label: '--Pilih Operartor Faktor Rate--', value: '' });
        this.listOperatorFactorRate.push({ label: "+", value: '+' });
        this.listOperatorFactorRate.push({ label: "-", value: '-' });
        this.listOperatorFactorRate.push({ label: "X", value: 'X' });
        this.listOperatorFactorRate.push({ label: "/", value: '/' });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Komponen&select=namaKomponen,id').subscribe(res => {
            this.kdKomponenIndex = [];
            this.kdKomponenIndex.push({ label: '--Pilih Komponen--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kdKomponenIndex.push({ label: res.data.data[i].namaKomponen, value: res.data.data[i].id.kode })
            };
        });
    }

    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/shiftkerja/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaShift&sort=desc&namaShift=' + this.pencarian).subscribe(table => {
            this.listData = table.ShiftKerja;
        });
    }
    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Shift Kerja');
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
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }
    // setTimeStamp(date) {
    //     let dataTimeStamp = (new Date(date).getTime() / 1000);
    //     return dataTimeStamp;
    // }
        setTimeStamp(date) {
        if (date == null || date == undefined || date == '') {
            let dataTimeStamp = (new Date().getTime() / 1000);
            return dataTimeStamp.toFixed(0);
        } else {
            let dataTimeStamp = (new Date(date).getTime() / 1000);
            return dataTimeStamp.toFixed(0);
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
        // let jamBreakAkhir = this.setTimeStamp(this.form.get('jamBreakAkhir').value)
        // let jamBreakAwal = this.setTimeStamp(this.form.get('jamBreakAwal').value)
        // let jamMasuk = this.setTimeStamp(this.form.get('jamMasuk').value)
        // let jamPulang = this.setTimeStamp(this.form.get('jamPulang').value)


        // let formSubmit = this.form.value;
        // formSubmit.jamBreakAkhir = jamBreakAkhir;
        // formSubmit.jamBreakAwal = jamBreakAwal;
        // formSubmit.jamMasuk = jamMasuk;
        // formSubmit.jamPulang = jamPulang;
        this.httpService.update(Configuration.get().dataMasterNew + '/shiftkerja/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            // let jamBreakAkhir = this.setTimeStamp(this.form.get('jamBreakAkhir').value)
            // let jamBreakAwal = this.setTimeStamp(this.form.get('jamBreakAwal').value)
            // let jamMasuk = this.setTimeStamp(this.form.get('jamMasuk').value)
            // let jamPulang = this.setTimeStamp(this.form.get('jamPulang').value)


            // let formSubmit = this.form.value;
            // formSubmit.jamBreakAkhir = jamBreakAkhir;
            // formSubmit.jamBreakAwal = jamBreakAwal;
            // formSubmit.jamMasuk = jamMasuk;
            // formSubmit.jamPulang = jamPulang;
            this.httpService.post(Configuration.get().dataMasterNew + '/shiftkerja/save?', this.form.value).subscribe(response => {
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
    clone(cloned: ShiftKerja): ShiftKerja {
        let hub = new InisialShiftKerja();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialShiftKerja();
        fixHub = {
            'namaShift': hub.namaShift,
            // 'jamMasuk': new Date(hub.jamMasuk * 1000),
            // 'jamPulang': new Date(hub.jamPulang * 1000),
            'jamMasuk': hub.jamMasuk,
            'jamPulang': hub.jamPulang,
            'qtyJamKerjaEfektif': hub.qtyJamKerjaEfektif,
            // 'jamBreakAwal': new Date(hub.jamBreakAwal * 1000),
            // 'jamBreakAkhir': new Date(hub.jamBreakAkhir * 1000),
            'jamBreakAwal': hub.jamBreakAwal,
            'jamBreakAkhir': hub.jamBreakAkhir,
            'qtyJamBreakEfektif': hub.qtyJamBreakEfektif,
            'factorRate': hub.factorRate,
            'operatorFactorRate': hub.operatorFactorRate,
            'kdKomponenIndex': hub.kdKomponenIndex,

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
        this.httpService.delete(Configuration.get().dataMasterNew + '/shiftkerja/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
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
        let cetak = Configuration.get().report + '/shiftKerja/laporanShiftKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/shiftKerja/laporanShiftKerja.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmShiftKerja_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialShiftKerja implements ShiftKerja {

    constructor(
        public namaShift?,
        public jamMasuk?,
        public jamPulang?,
        public qtyJamKerjaEfektif?,
        public jamBreakAwal?,
        public jamBreakAkhir?,
        public qtyJamBreakEfektif?,
        public factorRate?,
        public operatorFactorRate?,
        public kdKomponenIndex?,

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