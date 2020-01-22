import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-surat-keputusan-approval',
    templateUrl: './surat-keputusan-approval.component.html',
    styleUrls: ['./surat-keputusan-approval.component.scss'],
    providers: [ConfirmationService]
})
export class SuratKeputusanApprovalComponent implements OnInit {
    kodeKelompokTransaksi: any[];
    kodeJabatanStruktural: any[];
    kodeDepartemenDelegasi: any[];
    kodeStrukturalDelegasi: any[];
    kodeLevelTingkat: any[];
    kodeDepartemen: any[];
    selected: any;
    listData: any[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    page: number;
    rows: number;
    totalRecords: number;
    dataSK: any[];
    cekAllowNextStep: any;
    CekDelegator: any;
    CekProSK: any;
    CekCanByPas: any;
    isDelegatorActivated: any;
    isCanByPass: any;
    isProviderSK: any;
    noSKOld: any;
    kdKelompokTransaksiOld: any;
    kdJabatanOld: any;
    kdDepartemenOld: any;
    laporan: boolean = false;
    kdprof: any;
    kddept: any;
    codes: any[];
    items: any;
    kdDepartemen: any;

    listInput: any[];
    totalRecordsInput: number;

    listDepartemen: any[];
    listJabatan: any[];
    input: any[];
    listDropDownGrid: any[];
    listJabatanAsal: any[];
    dataJabatanAsal: any[];
    kdDepartemenAsal: any;
    listDropDownGrid2 = [];
    varTemplate: any;
    btnDisabled: any;
    kdJabatanAsalTemp: any;
    selected2: any;
    editDis: any;
    hideTemplate: any;
    listJabatanAsal2: any[];
    selectedHide: any;
    smbrFile: any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

    ngOnInit() {
        this.hideTemplate = false;
        this.editDis = false;
        this.varTemplate = false;
        this.btnDisabled = false;
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
        this.kdDepartemen = null;
        this.get();
        this.getDataGrid(this.page, this.rows, '');
        this.form = this.fb.group({
            'noSK': new FormControl(''),
            'namaSK': new FormControl(),
            'tglBerlakuAwal': new FormControl({ value: '', disabled: true }),
            'tglBerlakuAkhir': new FormControl({ value: '', disabled: true }),
            'kdKelompokTransaksi': new FormControl('', Validators.required),
            'kdDepartemenAsal': new FormControl('', Validators.required),
            'kdDepartemenDelegasi': new FormControl({ value: null, disabled: true }),
            'kdJabatanDelegasi': new FormControl({ value: null, disabled: true }),
            'isDelegatorActivated': new FormControl(false),
            'kdLevelTingkat': new FormControl(null)
            // 'statusEnabled': new FormControl('', Validators.required),

        });

        this.listInput = [];
        this.listJabatanAsal = [];
        this.versi = 0;
        this.listDropDownGrid = [];
        this.kodeJabatanStruktural = [];
        this.getSmbrFile();

    }

    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    changeCekDelegator(event) {

        if (event == true) {
            this.CekDelegator = 1
            this.form.get('kdDepartemenDelegasi').enable();
            this.form.get('kdJabatanDelegasi').enable();
        } else {
            this.CekDelegator = 0
            this.form.get('kdDepartemenDelegasi').disable();
            this.form.get('kdJabatanDelegasi').disable();
            this.form.get('kdDepartemenDelegasi').setValue('');
            this.form.get('kdJabatanDelegasi').setValue('');
        }
    }

    convtoBool(event) {
        if (event == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    convtoBin(event) {
        if (event == true) {
            return 1;
        }
        else {
            return 0;
        }
    }

    changeCanByPass(event) {

        if (event == true) {
            this.CekCanByPas = 1

        } else {
            this.CekCanByPas = 0

        }
    }
    changeProviderSK(event) {

        if (event == true) {
            this.CekProSK = 1

        } else {
            this.CekProSK = 0

        }
    }

    getDataGrid(page: number, rows: number, search: any) {

        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findAll?page=' + page + '&rows=' + rows + '&dir=suratKeputusan.namaSK&sort=desc').subscribe(table => {
            this.listData = table.sk;
            this.totalRecords = table.totalRow;
        });

    }

    get() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page=1&rows=1000&dir=namaKelompokTransaksi&sort=desc').subscribe(res => {
            this.kodeKelompokTransaksi = [];
            this.kodeKelompokTransaksi.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
            for (var i = 0; i < res.KelompokTransaksi.length; i++) {
                this.kodeKelompokTransaksi.push({ label: res.KelompokTransaksi[i].namaKelompokTransaksi, value: res.KelompokTransaksi[i].kdKelompokTransaksi })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
            this.kodeDepartemen = [];
            this.kodeDepartemen.push({ label: '--Pilih Departemen Asal--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
            this.kodeDepartemenDelegasi = [];
            this.kodeDepartemenDelegasi.push({ label: '--Pilih Departemen--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeDepartemenDelegasi.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=namaJabatan,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
            this.kodeStrukturalDelegasi = [];
            this.kodeStrukturalDelegasi.push({ label: '--Pilih Jabatan Delegasi--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeStrukturalDelegasi.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id_kode })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findLevelTingkat').subscribe(res => {
            this.kodeLevelTingkat = [];
            this.kodeLevelTingkat.push({ label: '--Pilih Level Tingkat--', value: null })
            for (var i = 0; i < res.levelTingkat.length; i++) {
                this.kodeLevelTingkat.push({ label: res.levelTingkat[i].namaLevelTingkat, value: res.levelTingkat[i].kode })
            };
        });

        //list input

        //belum ed
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Departemen&select=namaDepartemen,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
            this.listDepartemen = [];
            this.listDepartemen.push({ label: '--Pilih Departemen--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listDepartemen.push({ label: res.data.data[i].namaDepartemen, value: { namaDepartemen: res.data.data[i].namaDepartemen, kdDepartemen: res.data.data[i].id_kode } })
            };
        });
    }

    filterSk(event) {
        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findByNamaSK?namaSK=' + event.query).subscribe(res => {
            this.dataSK = res.suratKeputusanApproval;
        });
    }

    pilihSK(event) {
        this.form.get('noSK').setValue(event.noSK);
        this.form.get('tglBerlakuAwal').setValue(new Date(event.tglBerlakuAwal * 1000));
        if (event.tglBerlakuAkhir == '' || event.tglBerlakuAkhir == null || event.tglBerlakuAkhir == undefined) {
            this.form.get('tglBerlakuAkhir').setValue(null);
        } else {
            this.form.get('tglBerlakuAkhir').setValue(new Date(event.tglBerlakuAkhir * 1000));
        }
    }

    getJabatan(event, indexD) {
        this.listDropDownGrid = [];
        this.kodeJabatanStruktural[indexD] = [];
        this.listInput[indexD].jabatan.namaJabatan = "--Pilih Jabatan Struktural--";
        let kdDepartemen = event.value.kdDepartemen;
        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findJabatanByDepartemen?kdDepartemen=' + kdDepartemen).subscribe(res => {
            this.listDropDownGrid.push({ label: '--Pilih Jabatan Struktural--', value: null });
            for (let j = 0; j < res.jabatan.length; j++) {
                this.listDropDownGrid.push({ label: res.jabatan[j].namaJabatan, value: res.jabatan[j] })
            };

            // this.listDropDownGrid[indexD] = [];
            // this.listDropDownGrid[indexD].push({ label: '--Pilih Jabatan Struktural--', value: null })
            // for (var i = 0; i < res.jabatan.length; i++) {
            //     this.listDropDownGrid[indexD].push({ label: res.jabatan[i].namaJabatan, value: res.jabatan[i]})
            // };
        });
        this.kodeJabatanStruktural[indexD] = this.listDropDownGrid;
    }


    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=suratKeputusan.namaSK&sort=desc&namaSK=' + this.pencarian).subscribe(table => {
            this.listData = table.sk;
            this.totalRecords = table.totalRow;
        });
    }

    loadPage(event: LazyLoadEvent) {
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
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

    tambahInput() {
        if (this.listInput.length == 0) {
            let dataTemp = {
                "noUrutApproval": null,
                "departemen": {
                    "namaDepartemen": '--Pilih Departemen--',
                    "kdDepartemen": null
                },
                "jabatan": {
                    "namaJabatan": '--Pilih Jabatan--',
                    "kdJabatan": null
                },
                "isCanByPass": 0,
                "isProviderSK": 0,
                "statusEnabled": true
            }
            let listInput = [...this.listInput];
            listInput.push(dataTemp);
            this.listInput = listInput;
            let newArray = {
                "data": []
            }
            // this.listDropDownGrid.push(newArray)
        }
        else {
            let last = this.listInput.length - 1;
            if (this.listInput[last].departemen.kdDepartemen == null) {
                this.alertService.warn('Peringatan', 'Lengkapi Departemen');
            }
            else {
                let dataTemp = {
                    "noUrutApproval": null,
                    "departemen": {
                        "namaDepartemen": '--Pilih Departemen--',
                        "kdDepartemen": null
                    },
                    "jabatan": {
                        "namaJabatan": '--Pilih Jabatan--',
                        "kdJabatan": null
                    },
                    "isCanByPass": 0,
                    "isProviderSK": 0,
                    "statusEnabled": true
                }
                let listInput = [...this.listInput];
                listInput.push(dataTemp);
                this.listInput = listInput;
                let newArray = {
                    "data": []
                }
                // this.listDropDownGrid.push(newArray)
            }
        }
    }

    tambahJabatanAsal() {

        if (this.listJabatanAsal.length == 0) {
            let dataTemp = {
                "jabatan": {
                    "namaJabatan": '--Pilih Jabatan Asal--',
                    "kdJabatan": null
                }
            }
            let listJabatanAsal = [...this.listJabatanAsal];
            listJabatanAsal.push(dataTemp);
            this.listJabatanAsal = listJabatanAsal;
        } else {
            let last = this.listJabatanAsal.length - 1;
            if (this.listJabatanAsal[last].jabatan.kdJabatan == null) {
                this.alertService.warn('Peringatan', 'Pilih Jabatan Asal terlebih dahulu');
            }
            else {
                let dataTemp = {
                    "jabatan": {
                        "namaJabatan": '--Pilih Jabatan Asal--',
                        "kdJabatan": null
                    }
                }
                let listJabatanAsal = [...this.listJabatanAsal];
                listJabatanAsal.push(dataTemp);
                this.listJabatanAsal = listJabatanAsal;
            }
        }

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

        if (this.form.get('isDelegatorActivated').value == null || this.form.get('isDelegatorActivated').value == undefined || this.form.get('isDelegatorActivated').value == false) {
            this.CekDelegator = 0
        } else {
            this.CekDelegator = 1
        }

        if (this.listInput.length == 0) {
            this.alertService.warn('Peringatan', 'Isi Data Detail');
        }
        else {
            let listInput = this.listInput;
            let detail = [];
            let error = 0;
            let errorDetail = 0;
            let listBaruJabatanAsal = [];
            let terpilih = this.selectedHide;
            listBaruJabatanAsal.push(terpilih);

            if (listBaruJabatanAsal.length > 1) {
                terpilih = this.selectedHide;
                listBaruJabatanAsal.push(terpilih);
            }

            // let listJabatanAsal = this.listJabatanAsal;
            for (let i = 0; i < listInput.length; i++) {
                for (let x = 0; x < listBaruJabatanAsal.length; x++) {

                    let isCanByPass = this.convtoBin(listInput[i].isCanByPass);
                    let isProviderSK = this.convtoBin(listInput[i].isProviderSK);
                    detail.push({
                        "isCanByPass": isCanByPass,
                        "isProviderSK": isProviderSK,
                        "kdDepartemen": listInput[i].departemen.kdDepartemen,
                        "kdJabatan": listInput[i].jabatan.kdJabatan,
                        "kdJabatanAsal": listBaruJabatanAsal[x].kdJabatan,
                        "noUrutApproval": listInput[i].noUrutApproval,
                        "statusEnabled": listInput[i].statusEnabled
                    })

                    if (listInput[i].departemen.kdDepartemen == null || listInput[i].jabatan.kdJabatan == null || listInput[i].noUrutApproval == null) {
                        error = error + 1;
                    }
                }
            }
            console.log(detail);

            
            var a = detail.findIndex(x => x.isProviderSK == "1");
            if (a < 0) {
                errorDetail = errorDetail + 1;
            }

            let dataSimpan = {
                "detail": detail,
                "isDelegatorActivated": this.CekDelegator,
                "kdDepartemenAsal": this.form.get('kdDepartemenAsal').value,
                "kdDepartemenDelegasi": this.form.get('kdDepartemenDelegasi').value,
                "kdJabatanDelegasi": this.form.get('kdJabatanDelegasi').value,
                "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
                "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
                "noSK": this.form.get('noSK').value,

            }
            console.log(dataSimpan);

            if (error != 0) {
                this.alertService.warn('Peringatan', 'Lengkapi Data Detail');
            }
            if (errorDetail != 0) {
                this.alertService.warn('Peringatan', 'Data Approval Belum Ada Yang Membuat SK');
            }

            else {
                this.httpService.update(Configuration.get().dataMasterNew + '/suratkeputusanapproval/update/' + this.versi, dataSimpan).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.getDataGrid(this.page, this.rows, this.pencarian);
                    this.reset();
                });
            }
        }
    }

    simpan() {

        if (this.formAktif == false) {
            this.confirmUpdate();
        } else {

            if (this.form.get('isDelegatorActivated').value == null || this.form.get('isDelegatorActivated').value == undefined || this.form.get('isDelegatorActivated').value == false) {
                this.CekDelegator = 0
            } else {
                this.CekDelegator = 1
            }

            if (this.listInput.length == 0 || this.listJabatanAsal.length == 0) {
                this.alertService.warn('Peringatan', 'Isi Data Detail');
            }
            else {

                let listInput = this.listInput;
                let detail = [];
                let error = 0;
                let errorDetail = 0;
                let listJabatanAsal = this.listJabatanAsal;


                for (let i = 0; i < listInput.length; i++) {
                    for (let x = 0; x < listJabatanAsal.length; x++) {

                        let isCanByPass = this.convtoBin(listInput[i].isCanByPass);
                        let isProviderSK = this.convtoBin(listInput[i].isProviderSK);
                        detail.push({
                            "isCanByPass": isCanByPass,
                            "isProviderSK": isProviderSK,
                            "kdDepartemen": listInput[i].departemen.kdDepartemen,
                            "kdJabatan": listInput[i].jabatan.kdJabatan,
                            "kdJabatanAsal": listJabatanAsal[x].jabatan.kdJabatan,
                            "noUrutApproval": listInput[i].noUrutApproval,
                            "statusEnabled": listInput[i].statusEnabled
                        });

                        if (listInput[i].departemen.kdDepartemen == null || listInput[i].jabatan.kdJabatan == null || listInput[i].noUrutApproval == null) {
                            error = error + 1;
                        }
                        if (listInput[i].departemen.kdDepartemen == null || listInput[i].jabatan.kdJabatan == null || listInput[i].noUrutApproval == null) {
                            error = error + 1;
                        }
                    }

                }
                console.log(detail)

                var a = detail.findIndex(x => x.isProviderSK == "1");
                if (a < 0) {
                    errorDetail = errorDetail + 1;
                }
                let dataSimpan = {
                    "detail": detail,
                    "isDelegatorActivated": this.CekDelegator,
                    "kdDepartemenAsal": this.form.get('kdDepartemenAsal').value,
                    "kdDepartemenDelegasi": this.form.get('kdDepartemenDelegasi').value,
                    "kdJabatanDelegasi": this.form.get('kdJabatanDelegasi').value,
                    "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
                    "kdLevelTingkat": this.form.get('kdLevelTingkat').value,
                    "noSK": this.form.get('noSK').value,

                }

                console.log(dataSimpan);

                if (error != 0) {
                    this.alertService.warn('Peringatan', 'Lengkapi Data Detail');
                }

                if (errorDetail != 0) {
                    this.alertService.warn('Peringatan', 'Data Approval Belum Ada Yang Membuat SK');
                }

                else {
                    this.httpService.post(Configuration.get().dataMasterNew + '/suratkeputusanapproval/save', dataSimpan).subscribe(response => {
                        this.alertService.success('Berhasil', 'Data Disimpan');
                        this.getDataGrid(this.page, this.rows, this.pencarian);
                        this.reset();
                    });
                }



            }
        }
    }

    confirmDelete() {
        let noSK = this.form.get('noSK').value;
        if (noSK == null || noSK == undefined || noSK == "") {
            this.alertService.warn('Peringatan', 'Pilih Data Surat Keputusan Approval');
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

    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/suratkeputusanapproval/del/' + deleteItem.noSK + '/' + deleteItem.kdKelompokTransaksi + '/' + deleteItem.kdDepartemenAsal).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getDataGrid(this.page, this.rows, this.pencarian);
        });
        this.reset();
        this.noSKOld = "";
        this.kdKelompokTransaksiOld = "";
        this.kdJabatanOld = "";
        this.kdDepartemenOld = "";
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected2);
    }


    hapusRow(row) {
        let listInput = [...this.listInput];
        listInput.splice(row, 1);
        this.listInput = listInput;
    }

    hapusRowJabatan(row) {
        let listJabatanAsal = [...this.listJabatanAsal];
        listJabatanAsal.splice(row, 1);
        this.listJabatanAsal = listJabatanAsal;
    }


    onRowSelect(event) {
        this.hideTemplate = true;
        this.editDis = true;
        this.noSKOld = event.data.noSK;
        this.kdKelompokTransaksiOld = event.data.kdKelompokTransaksi;
        this.kdJabatanOld = event.data.kdJabatan;

        this.dataSK = [];
        this.dataSK.push({ namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir });


        this.formAktif = false;
        if (event.data.isDelegatorActivated == 1) {
            this.isDelegatorActivated = true;
            this.CekDelegator = 1;

        } else {
            this.isDelegatorActivated = false;
            this.CekDelegator = 0;

        }

        this.form.get('kdLevelTingkat').setValue(event.data.kdLevelTingkat)
        this.form.get('noSK').setValue(event.data.noSK),
            this.form.get('kdKelompokTransaksi').setValue(event.data.kdKelompokTransaksi),
            this.form.get('kdDepartemenAsal').setValue(event.data.kdDepartemenAsal),
            this.form.get('namaSK').setValue(this.dataSK[0]),
            this.form.get('tglBerlakuAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
        if (event.data.tglBerlakuAkhir == null) {
            this.form.get('tglBerlakuAkhir').setValue(null)
        } else {
            this.form.get('tglBerlakuAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

        }
        this.form.get('kdDepartemenDelegasi').setValue(event.data.kdDepartemenDelegasi),
            this.form.get('kdJabatanDelegasi').setValue(event.data.kdJabatanDelegasi),
            this.form.get('isDelegatorActivated').setValue(this.isDelegatorActivated),
            // this.form.get('statusEnabled').setValue(event.data.statusEnabled),
            // this.versi = event.data.version;

            //ambil jabatan asal dulu
            this.listDropDownGrid2 = [];
        let kdDepAsal = this.form.get('kdDepartemenAsal').value;
        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findJabatanByDepartemen?kdDepartemen=' + kdDepAsal).subscribe(res => {
            this.listDropDownGrid2.push({ label: '--Pilih Jabatan Asal--', value: null });
            for (let j = 0; j < res.jabatan.length; j++) {
                this.listDropDownGrid2.push({ label: res.jabatan[j].namaJabatan, value: res.jabatan[j] })
            };
        });
        this.dataJabatanAsal = this.listDropDownGrid2;
        this.varTemplate = true;
        this.btnDisabled = true;
        this.selected = [];
        this.listInput = [];
        this.getGridInput(event);


    }

    getGridInput(event) {
        let noSK = event.data.noSK;
        let kdDepartemenAsal = event.data.kdDepartemenAsal;
        let kdKelompokTransaksi = event.data.kdKelompokTransaksi;

        this.httpService.get(Configuration.get().dataMaster + '/suratkeputusanapproval/findByNoSK?noSK=' + noSK + '&kdDepartemenAsal=' + kdDepartemenAsal + '&kdKelompokTransaksi=' + kdKelompokTransaksi).subscribe(table => {
            this.input = table.suratKeputusanApproval;
            // let input = this.input;
            let obj = {};
            // let objIn = {};
            let jabatanAsal = this.input;


            //filter duplicate array berdasarkan kdJabatanAsal keynya untuk grid kanan
            //  for(let z=0; z<input.length; z++){
            //     objIn[input[z]['noUrutApproval']] = input[z];
            // }
            // input = new Array();
            // for(let key2 in objIn){
            //     input.push(objIn[key2]);
            // }


            //filter duplicate array berdasarkan kdJabatanAsal keynya untuk grid kiri
            for (let a = 0; a < jabatanAsal.length; a++) {
                obj[jabatanAsal[a]['kdJabatanAsal']] = jabatanAsal[a];
            }
            jabatanAsal = new Array();
            for (let key in obj) {
                jabatanAsal.push(obj[key]);
            }


            // this.listInput = [];
            this.listJabatanAsal2 = [];
            // let dataTemp;
            let dataTempJ;
            // for ( let i=0; i<input.length; i++){
            //     dataTemp = {
            //         "noUrutApproval": input[i].noUrutApproval,
            //         "departemen": {
            //             "namaDepartemen": input[i].namaDepartemen,
            //             "kdDepartemen": input[i].kdDepartemen
            //         },
            //         "jabatan": {
            //             "namaJabatan": input[i].namaJabatan,
            //             "kdJabatan": input[i].kdJabatan
            //         },
            //         "isCanByPass": this.convtoBool(input[i].isCanByPass),
            //         "isProviderSK": this.convtoBool(input[i].isProviderSK),
            //         "statusEnabled": input[i].statusEnabled
            //     }
            //     this.listInput.push(dataTemp);
            // }

            for (let x = 0; x < jabatanAsal.length; x++) {

                dataTempJ = {
                    // "jabatan": {
                    //     "namaJabatan": jabatanAsal[x].namaJabatanAsal,
                    //     "kdJabatan": jabatanAsal[x].kdJabatanAsal
                    // }
                    "namaJabatan": jabatanAsal[x].namaJabatanAsal,
                    "kdJabatan": jabatanAsal[x].kdJabatanAsal
                }
                this.listJabatanAsal2.push(dataTempJ);

            }


        });
    }

    reset() {
        this.formAktif = true;
        this.noSKOld = "";
        this.kdKelompokTransaksiOld = "";
        this.kdJabatanOld = "";
        this.dataJabatanAsal = [];
        this.ngOnInit();
    }

    onDestroy() {

    }

    downloadExcel() {

    }
    downloadPdf() {
        let cetak = Configuration.get().report + '/suratKeputusanApproval/laporanSuratKeputusanApproval.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(cetak);
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/suratKeputusanApproval/laporanSuratKeputusanApproval.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmSuratKeputusanApproval_laporanCetak');

    }
    tutupLaporan() {
        this.laporan = false;
    }

    getKodeDepertemenAsal(event) {

        this.listDropDownGrid2 = [];
        this.kdDepartemenAsal = event.value;
        this.httpService.get(Configuration.get().dataMasterNew + '/suratkeputusanapproval/findJabatanByDepartemen?kdDepartemen=' + this.kdDepartemenAsal).subscribe(res => {
            this.listDropDownGrid2.push({ label: '--Pilih Jabatan Asal--', value: null });
            for (let j = 0; j < res.jabatan.length; j++) {
                this.listDropDownGrid2.push({ label: res.jabatan[j].namaJabatan, value: res.jabatan[j] })
            };
        });
        this.dataJabatanAsal = this.listDropDownGrid2;


    }

    pilihJabatanAsal(event) {
        // console.log(this.selected);
        // let noSK = this.form.get('noSK').value;
        // let kdDepartemenAsal = this.form.get('kdDepartemenAsal').value;
        // let kdKelompokTransaksi = this.form.get('kdKelompokTransaksi').value;
        // let kdJabatanAsal = event.data.jabatan.kdJabatan;

        // this.httpService.get(Configuration.get().dataMaster + '/suratkeputusanapproval/findByNoSK?noSK='+noSK+'&kdDepartemenAsal='+kdDepartemenAsal+'&kdKelompokTransaksi='+kdKelompokTransaksi).subscribe(table => {
        //     this.input = table.suratKeputusanApproval;
        //     let input = this.input;
        //     this.listInput = [];
        //     let objInput = {};
        //     let dataTemp;
        //     let inputBaru = [];

        // for( let c=0; c<input.length; c++){
        //filter duplicate array berdasarkan kdJabatanAsal keynya untuk grid kanan
        // inputBaru = this.input.filter(
        // inputD => inputD.kdJabatanAsal === kdJabatanAsal )
        // }

        //     for ( let i=0; i<inputBaru.length; i++){

        //         dataTemp = {
        //             "noUrutApproval": inputBaru[i].noUrutApproval,
        //             "departemen": {
        //                 "namaDepartemen": inputBaru[i].namaDepartemen,
        //                 "kdDepartemen": inputBaru[i].kdDepartemen
        //             },
        //             "jabatan": {
        //                 "namaJabatan": inputBaru[i].namaJabatan,
        //                 "kdJabatan": inputBaru[i].kdJabatan
        //             },
        //             "isCanByPass": this.convtoBool(inputBaru[i].isCanByPass),
        //             "isProviderSK": this.convtoBool(inputBaru[i].isProviderSK),
        //             "statusEnabled": inputBaru[i].statusEnabled
        //         }
        //         this.listInput.push(dataTemp);
        //     }

        // });


    }

    onPilihJabatanAsal(event) {
        console.log(this.selected);
        let noSK = this.form.get('noSK').value;
        let kdDepartemenAsal = this.form.get('kdDepartemenAsal').value;
        let kdKelompokTransaksi = this.form.get('kdKelompokTransaksi').value;
        let kdJabatanAsal = event.data.kdJabatan;

        this.httpService.get(Configuration.get().dataMaster + '/suratkeputusanapproval/findByNoSK?noSK=' + noSK + '&kdDepartemenAsal=' + kdDepartemenAsal + '&kdKelompokTransaksi=' + kdKelompokTransaksi).subscribe(table => {
            this.input = table.suratKeputusanApproval;
            let input = this.input;
            this.listInput = [];
            let objInput = {};
            let dataTemp;
            let inputBaru = [];

            // for( let c=0; c<input.length; c++){
            //filter duplicate array berdasarkan kdJabatanAsal keynya untuk grid kanan
            inputBaru = this.input.filter(
                inputD => inputD.kdJabatanAsal === kdJabatanAsal)
            // }

            for (let i = 0; i < inputBaru.length; i++) {

                dataTemp = {
                    "noUrutApproval": inputBaru[i].noUrutApproval,
                    "departemen": {
                        "namaDepartemen": inputBaru[i].namaDepartemen,
                        "kdDepartemen": inputBaru[i].kdDepartemen
                    },
                    "jabatan": {
                        "namaJabatan": inputBaru[i].namaJabatan,
                        "kdJabatan": inputBaru[i].kdJabatan
                    },
                    "isCanByPass": this.convtoBool(inputBaru[i].isCanByPass),
                    "isProviderSK": this.convtoBool(inputBaru[i].isProviderSK),
                    "statusEnabled": inputBaru[i].statusEnabled
                }
                this.listInput.push(dataTemp);
            }

        });
    }







}

