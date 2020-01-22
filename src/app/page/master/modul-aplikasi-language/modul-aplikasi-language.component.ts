import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, ReportService, AuthGuard } from '../../../global';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-modul-aplikasi-language',
    templateUrl: './modul-aplikasi-language.component.html',
    styleUrls: ['./modul-aplikasi-language.component.scss'],
    providers: [ConfirmationService]
})
export class ModulAplikasiLanguageComponent implements OnInit {
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    items: any;
    kode: any;
    id: any;
    page: number;
    id_kode: any;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    pencarian: string;
    listDropdownModulAplikasi: any[];
    listDropdownVersion: any[];
    listDropdownBahasa: any[];
    dropdownNegara: any[];
    FilterNegara: string;
    dataValidForm: boolean;
    laporan: boolean = false;

    kdprof: any;
    kddept: any;
    headerLaporan: string;
    smbrFile: any;
    pathBahasa: any;
    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        private translate: TranslateService,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    }


    ngOnInit() {
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
        this.getPage(this.page, this.rows, this.pencarian);
        this.versi = null;
        this.form = this.fb.group({
            'kdModulAplikasi': new FormControl('', Validators.required),
            'kdBahasa': new FormControl('', Validators.required),
            'kdVersion': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(false, Validators.required),
            'pathFileBahasa': new FormControl(''),
            'kdNegara': new FormControl('', Validators.required),
        });
        this.dataValidForm = true;
        this.form.get('kdBahasa').disable();
        this.getSmbrFile();
        this.getService();

    }

    getService() {
        this.httpService.get(Configuration.get().dataMasterNew + '/version/findAll?page=1&rows=1000&dir=namaVersion&sort=desc').subscribe(res => {
            this.listDropdownVersion = [];
            this.listDropdownVersion.push({ label: '--Pilih--', value: null })
            for (let i = 0; i < res.Version.length; i++) {
                this.listDropdownVersion.push({ label: res.Version[i].namaVersion, value: res.Version[i].kode })
            };
        });


        this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListMA').subscribe(res => {
            this.listDropdownModulAplikasi = [];
            this.listDropdownModulAplikasi.push({ label: '--Pilih--', value: null })
            for (let i = 0; i < res.ModulAplikasi.length; i++) {
                this.listDropdownModulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
            };
        });


        this.httpService.get(Configuration.get().dataMasterNew + '/bahasa/findAllBahasa?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(table => {
            this.listDropdownBahasa = [];
            this.listDropdownBahasa.push({ label: '-- Pilih --', value: '' })
            for (var i = 0; i < table.bahasa.length; i++) {
                this.listDropdownBahasa.push({
                    label: table.bahasa[i].namaBahasa, value: table.bahasa[i].kode.kode
                })
            };
        });

        this.httpService.get(Configuration.get().dataMaster + '/negara/findAllNegara').subscribe(res => {
            this.dropdownNegara = [];
            this.dropdownNegara.push({ label: '--Pilih--', value: '' })

            for (var i = 0; i < res.Negara.length; i++) {
                this.dropdownNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
            };
        });
    }

    changeNegara(event) {
        console.log(event);
        if (event.value != '' && event.value != null) {
            this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasilanguage/findNegara/' + event.value).subscribe(table => {
                this.form.get('kdBahasa').enable();
                this.listDropdownBahasa = [];
                this.listDropdownBahasa.push({ label: '-- Pilih --', value: '' })
                for (var i = 0; i < table.data.length; i++) {
                    this.listDropdownBahasa.push({
                        label: table.data[i].namaBahasa, value: table.data[i].kdBahasa
                    })
                };
            });
        } else {
            this.form.get('kdBahasa').disable();
        }

    }


    valuechange(newValue) {

        if (newValue == "") {
            this.dataValidForm = false;
        } else {
            this.dataValidForm = true;
        }
        this.report = newValue;
    }
    getInput() {

    }

    downloadExcel() {
    }

    getSmbrFile() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    downloadPdf() {
    }


    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasilanguage/findAll?page=' + page + '&rows=' + rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&modulAplikasi.namaModulAplikasi=' + search).subscribe(table => {
            this.listData = table.ModulAplikasiLanguage;
            this.totalRecords = table.totalRow;

        });
    }

    cari() {
        this.getPage(this.page, this.rows, this.pencarian);

    }
    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        let kode = this.form.get('kdModulAplikasi').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Modul Aplikasi Language');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapus();
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
            this.alertService.warn("Peringatan", "Data Tidak Sesuai");
            this.dataValidForm = false;
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
            }
        });
    }
    update() {
        let dataUpdate = {
            "kdBahasa": this.form.get('kdBahasa').value,
            "kdModulAplikasi": this.form.get('kdModulAplikasi').value,
            "kdNegara": this.form.get('kdNegara').value,
            "kdVersion": this.form.get('kdVersion').value,
            "pathFileBahasa": this.form.get('pathFileBahasa').value,
            "statusEnabled": this.form.get('statusEnabled').value
        }
        this.httpService.update(Configuration.get().dataMasterNew + '/modulaplikasilanguage/update/', dataUpdate).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/modulaplikasilanguage/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.reset();
            });
        }

    }

    reset() {
        this.formAktif = true;
        this.form.get('kdModulAplikasi').enable();
        this.form.get('kdVersion').enable();
        this.form.get('kdBahasa').disable();
        this.form.get('kdNegara').enable();
        this.form.get('kdModulAplikasi').setValidators(Validators.required);
        this.form.get('kdVersion').setValidators(Validators.required);
        this.form.get('kdBahasa').setValidators(Validators.required);
        this.form.get('kdNegara').setValidators(Validators.required);
        this.ngOnInit();

    }
    onRowSelect(event) {
        this.formAktif = false;
        this.form.get('kdModulAplikasi').setValue(event.data.modulAplikasi.kode);
        this.form.get('kdVersion').setValue(event.data.versionSystem.kode);
        this.form.get('kdNegara').setValue(event.data.bahasa.id.kdNegara);
        this.form.get('kdBahasa').setValue(event.data.bahasa.id.kode);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        this.form.get('pathFileBahasa').setValue(event.data.pathFileBahasa);
        this.versi = event.data.version;
        this.form.get('kdModulAplikasi').disable();
        this.form.get('kdVersion').disable();
        this.form.get('kdBahasa').disable();
        this.form.get('kdNegara').disable();
        this.form.get('kdModulAplikasi').setValidators(null);
        this.form.get('kdVersion').setValidators(null);
        this.form.get('kdBahasa').setValidators(null);
        this.form.get('kdNegara').setValidators(null);
    }

    hapus() {
        let item = [...this.listData];
        this.httpService.delete(Configuration.get().dataMasterNew + '/modulaplikasilanguage/del/' + this.form.get('kdModulAplikasi').value + '/' + this.form.get('kdVersion').value + '/' + this.form.get('kdBahasa').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }

    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
    }

    urlUpload() {
        return Configuration.get().resourceFile + '/file/upload?noProfile=false';
    }

    imageUpload(event) {
        this.pathBahasa = event.xhr.response;
    }

    addHeader(event) {
        this.httpService.beforeUploadFile(event);
    }
}
