import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KecamatanInterface } from './kecamatan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-kecamatan',
    templateUrl: './kecamatan.component.html',
    styleUrls: ['./kecamatan.component.scss'],
    providers: [ConfirmationService]
})
export class KecamatanComponent implements OnInit {
    selected: KecamatanInterface;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    // Negara: KecamatanInterface[];
    Propinsi: KecamatanInterface[];
    Kabupaten: KecamatanInterface[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    kecamatan: any[];
    kecamatan1: KecamatanInterface[];
    kdPropinsi: any;
    codes: any[];
    kdprof: any;
    kddept: any;
    laporan: boolean = false;
    smbrFile: any;
    Negara: any[];
    FilterNegara: string;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


    ngOnInit() {
        this.Propinsi = [];
        this.Propinsi.push({ label: '--Pilih Propinsi--', value: '' })
        this.Kabupaten = [];
        this.Kabupaten.push({ label: '--Pilih Kabupaten--', value: '' })
        this.selected = null;
        this.pencarian = '';
        this.FilterNegara = '';
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
        this.get(this.page, this.rows, this.pencarian, this.FilterNegara);
        this.versi = null;
        this.kdPropinsi = null;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaKecamatan': new FormControl('', Validators.required),
            'kdPropinsi': new FormControl('', Validators.required),
            'kdKotaKabupaten': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl('', Validators.required),
            'kdNegara': new FormControl('', Validators.required)
        });
        this.getNegara();
        this.getSmbrFile();

    }

    getNegara() {
        this.Negara = [];
        this.Negara.push({ label: '--Pilih Negara--', value: '' })
        this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
            for (var i = 0; i < res.Negara.length; i++) {
                this.Negara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
            };
        });
    }

    getPropinsi(kdNegara) {
		// prevent error dropdown dependen
        this.Kabupaten = [];
        this.Kabupaten.push({label:'--Pilih Kota / Kabupaten--', value:''});
        this.form.get('kdKotaKabupaten').reset();

        this.form.get('kdPropinsi').reset();

        // end 
		this.httpService.get(Configuration.get().dataMasterNew + '/propinsi/findAllPropinsi?kdNegara=' + kdNegara).subscribe(res => {
			if(res.Propinsi.length !== 0) {
				this.Propinsi = [];
                this.Propinsi.push({ label: '--Pilih Propinsi--', value: '' })
                for (var i = 0; i < res.Propinsi.length; i++) {
                    this.Propinsi.push({ label: res.Propinsi[i].namaPropinsi, value: res.Propinsi[i].kode.kode })
                };
			} else {
				this.Propinsi = [];
				this.Propinsi.push({label:'--Data Propinsi Kosong--', value:''});
			}
		},
		error => {
			this.Propinsi = [];
			this.Propinsi.push({label:'--Koneksi Error--', value:''})
		});
	}

    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    valuechangekdPropinsi(kdPropinsi, kdNegara) {
        this.form.get('kdKotaKabupaten').reset();
		this.httpService.get(Configuration.get().dataMasterNew + '/kotakabupaten/findAllKotaKabupaten?kdPropinsi=' + kdPropinsi + '&kdNegara=' + kdNegara).subscribe(res => {
			if(res.KotaKabupaten.length !== 0) {
				this.Kabupaten = [];
                this.Kabupaten.push({ label: '--Pilih Kota Kabupaten--', value: '' });
                for (var i = 0; i < res.KotaKabupaten.length; i++) {
                    this.Kabupaten.push({ label: res.KotaKabupaten[i].namaKotaKabupaten, value: res.KotaKabupaten[i].kode.kode })
                };
			} else {
				this.Kabupaten = [];
				this.Kabupaten.push({label:'--Data Kota/Kabupaten Kosong--', value:''});
			}
		},
		error => {
			this.Kabupaten = [];
			this.Kabupaten.push({label:'--Koneksi Error--', value:''})
		});
	}

    valuechange(newValue) {

        this.toReport = newValue;
        this.report = newValue;
    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?').subscribe(table => {
            this.kecamatan = table.Kecamatan
            this.kecamatan1 = [];

            for (let i = 0; i < this.kecamatan.length; i++) {
                this.kecamatan1.push({
                    kode: this.kecamatan[i].kode.kode,
                    namaKecamatan: this.kecamatan[i].namaKecamatan,
                    propinsi: this.kecamatan[i].namaPropinsi,
                    kotaKabupaten: this.kecamatan[i].namaKotaKabupaten,
                    reportDisplay: this.kecamatan[i].reportDisplay,
                    kodeExternal: this.kecamatan[i].kodeExternal,
                    namaExternal: this.kecamatan[i].namaExternal,
                    statusEnabled: this.kecamatan[i].statusEnabled
                });
            }
            this.fileService.exportAsExcelFile(this.kecamatan1, 'Kecamatan');
        });

    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/kecamatan/laporankecamatan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(cetak);
        // var col = ["Kode", "Nama", "Propinsi", "Kota Kabupaten", "Tampilan Laporan", "Kode Eksternal", "Nama Eksternal", "Status Aktif"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?').subscribe(table => {

        //     this.kecamatan = table.Kecamatan
        //     this.kecamatan1 = [];
        //     debugger;
        //     for (let i = 0; i < this.kecamatan.length; i++) {
        //         this.kecamatan1.push({
        //             kode: this.kecamatan[i].kode.kode,
        //             namaKecamatan: this.kecamatan[i].namaKecamatan,
        //             propinsi: this.kecamatan[i].namaPropinsi,
        //             kotaKabupaten: this.kecamatan[i].namaKotaKabupaten,
        //             reportDisplay: this.kecamatan[i].reportDisplay,
        //             kodeExternal: this.kecamatan[i].kodeExternal,
        //             namaExternal: this.kecamatan[i].namaExternal,
        //             statusEnabled: this.kecamatan[i].statusEnabled
        //         });
        //     }

        //     this.fileService.exportAsPdfFile("Master Kecamatan", col, this.kecamatan1, "Kecamatan");
        // });

    }

    get(page: number, rows: number, search: any, filter: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?page=' + page + '&rows=' + rows + '&dir=namaKecamatan&sort=asc' + '&namaKecamatan=' + search + '&kdNegara=' + filter).subscribe(table => {
            this.listData = table.Kecamatan;
            this.totalRecords = table.totalRow;

        });
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kecamatan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaKecamatan&sort=desc&namaKecamatan=' + this.pencarian + '&kdNegara=' + this.FilterNegara).subscribe(table => {
            this.listData = table.Kecamatan;
        });
    }

    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, this.FilterNegara);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
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

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Kecamatan');
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
        this.httpService.update(Configuration.get().dataMasterNew + '/kecamatan/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/kecamatan/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

    }

    reset() {
        this.formAktif = true;
        this.ngOnInit();
    }
    onRowSelect(event) {
        this.getPropinsi(event.data.kode.kdNegara);
        this.valuechangekdPropinsi(event.data.kdPropinsi, event.data.kode.kdNegara);
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);

    }
    clone(cloned: KecamatanInterface): KecamatanInterface {
        let hub = new InisialKecamatanInterface();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKecamatanInterface();
        fixHub = {
            "kdPropinsi": hub.kdPropinsi,
            "kdKotaKabupaten": hub.kdKotaKabupaten,
            "kode": hub.kode.kode,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "namaKecamatan": hub.namaKecamatan,
            "reportDisplay": hub.reportDisplay,
            "statusEnabled": hub.statusEnabled,
            "kdNegara": hub.kode.kdNegara
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/kecamatan/del/' + deleteItem.kode.kode + '/' + this.form.get('kdNegara').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
            // this.get(this.page, this.rows, this.pencarian);
        });
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/kecamatan/laporankecamatan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmKecamatan_laporanCetak');
        // let cetak = Configuration.get().report + '/kecamatan/laporankecamatan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
    }
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialKecamatanInterface implements KecamatanInterface {

    constructor(
        public kdKotaKabupaten?,
        public kecamatan?,
        public id?,
        public kode?,
        public kdPropinsi?,
        public kdkotaKabupaten?,
        public namaKecamatan?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public propinsi?,
        public kotaKabupaten?,
        public kdNegara?
    ) { }

}