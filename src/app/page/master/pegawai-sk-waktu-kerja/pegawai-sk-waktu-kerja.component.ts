import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkWaktuKerjaInterface } from './pegawai-sk-waktu-kerja.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MultiSelectModule, SelectItem } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Router } from "@angular/router";

@Component({
    selector: 'app-pegawai-sk-waktu-kerja',
    templateUrl: './pegawai-sk-waktu-kerja.component.html',
    styleUrls: ['./pegawai-sk-waktu-kerja.component.scss'],
    providers: [ConfirmationService]
})
export class PegawaiSkWaktuKerjaComponent implements OnInit {
    selected: PegawaiSkWaktuKerjaInterface;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    Negara: PegawaiSkWaktuKerjaInterface[];
    Propinsi: PegawaiSkWaktuKerjaInterface[];
    Kabupaten: PegawaiSkWaktuKerjaInterface[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    kecamatan: any[];
    kecamatan1: PegawaiSkWaktuKerjaInterface[];
    listKategoryPegawai: any[];
    listGolonganPegawai: any[];
    listStatusPegawai: any[];
    listPeriode: any[];
    listDurasi: any[];
    kdProfile: any;
    CekTukarJadwal: any;
    CekHolidayOverAllowToOff: any;
    CekAutoOver: any;
    CekNormalOverAllowToOff: any;
    CekOverAllowAccumulated: any;
    CekOverAllowToLate: any;
    cekRekapByDay: any;
    TukarJadwal: boolean;
    HolidayOverAllowToOff: boolean;
    AutoOver: boolean;
    NormalOverAllowToOff: boolean;
    OverAllowAccumulated: boolean;
    OverAllowToLate: boolean;
    AllowAccumulated: boolean;
    AllowToMinusKuota: boolean;
    isRekapByDay: boolean;
    ProRate: boolean;
    listTanggal: any[];
    selectedGolongan: any[];
    selectedKategori: any[];
    namaSK: any[];
    testCek: any;
    smbrFile:any;
    laporan:any;
    kdprof:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        private route: Router,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;
    }



    ngOnInit() {
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.items = [
        {
            label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                    this.downloadPdf();
                }
            },
            {
                label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                    // this.downloadExcel();
                }
            },

            ];
            this.testCek = true;
            this.kdProfile = this.authGuard.getUserDto().idProfile;
            this.CekTukarJadwal = 0;
            this.CekHolidayOverAllowToOff = 0;
            this.CekAutoOver = 0;
            this.CekOverAllowAccumulated = 0;
            this.CekOverAllowToLate = 0;
            this.CekNormalOverAllowToOff = 0;
            this.cekRekapByDay = 0;
            this.formAktif = true;
            this.versi = null;
            this.form = this.fb.group({

                'noSk': new FormControl(''),
                'noSkIntern': new FormControl(''),
                'namaSk': new FormControl('', Validators.required),
                'tanggalAwal': new FormControl({ value: '', disabled: true }),
                'tanggalAkhir': new FormControl({ value: '', disabled: true }),
                'kdKategoryPegawai': new FormControl('', Validators.required),
                'kdGolonganPegawai': new FormControl('', Validators.required),
                'allowAccumulated': new FormControl(''),
                'allowToMinusKuota': new FormControl(''),
                'allowTukarJadwal': new FormControl(''),
                'autoOver': new FormControl(''),
                'holidayOverAllowToOff': new FormControl(''),
                'normalOverAllowToOff': new FormControl(''),
                'overAllowAccumulated': new FormControl(''),
                'overAllowToLate': new FormControl(''),
                'qtyHariMinPostingTukarJadwal': new FormControl(0),
                'qtyHariOverExpired': new FormControl(0),
                'qtyJamMaxPostingTukarJadwal': new FormControl(0),
                'qtyMenitMaxAllowLate': new FormControl(0),
                'qtyMenitMaxOverAccumulated': new FormControl(0),
                'qtyMenitMinOver': new FormControl(0),
                'qtyMenitMinOverMasuk': new FormControl(0),
                'qtyMenitMinOverPulang': new FormControl(0),
            // 'qtyMenitOffForHolidayOver': new FormControl(''),
            // 'qtyMenitOffForNormalOver': new FormControl(''),

            'qtyMenitMinBeforeCheckout': new FormControl(0),
            'qtyMenitMaxBeforeCheckin': new FormControl(0),

            'qtyMenitMaxOver': new FormControl(0),
            'qtyRangeMasaKerja':new FormControl(null),
            'isRekapByDay': new FormControl(''),
            'tanggalCutOffAwal': new FormControl('', Validators.required),
            'tanggalCutOffAkhir': new FormControl('', Validators.required),
            'AktifTanggal': new FormControl(''),
            'kdPeriode': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
        });


            let Tanggal = [
            { tanggal: "1" }, { tanggal: "2" }, { tanggal: "3" }, { tanggal: "4" }, { tanggal: "5" }, { tanggal: "6" }, { tanggal: "7" }, { tanggal: "8" }, { tanggal: "9" }, { tanggal: "10" },
            { tanggal: "11" }, { tanggal: "12" }, { tanggal: "13" }, { tanggal: "14" }, { tanggal: "15" }, { tanggal: "16" }, { tanggal: "17" }, { tanggal: "18" }, { tanggal: "19" }, { tanggal: "20" },
            { tanggal: "21" }, { tanggal: "22" }, { tanggal: "23" }, { tanggal: "24" }, { tanggal: "25" }, { tanggal: "26" }, { tanggal: "27" }, { tanggal: "28" }, { tanggal: "29" }, { tanggal: "30" }, { tanggal: "31" },
            ];
            this.listTanggal = [];
            this.listTanggal.push({ label: '--Pilih Tanggal--', value: '' });
            for (var i = 0; i < Tanggal.length; i++) {
                this.listTanggal.push({ label: Tanggal[i].tanggal, value: Tanggal[i].tanggal })
            };
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=KategoryPegawai&select=*&criteria=id.kdProfile&values=' + this.kdProfile).subscribe(res => {
                this.listKategoryPegawai = [];
            // this.listKategoryPegawai.push({ label: '--Pilih Kategory Pegawai--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listKategoryPegawai.push({ label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id.kode })
            };
            this.selectedKategori = this.listKategoryPegawai;

        },
        error => {
            this.listKategoryPegawai = [];
            this.listKategoryPegawai.push({ label: '-- ' + error + ' --', value: '' })
        });

            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=*&criteria=id.kdProfile&values=' + this.kdProfile).subscribe(res => {
                this.listGolonganPegawai = [];
            // this.listGolonganPegawai.push({ label: '--Pilih Golongan Pegawai--', value: '' });
            for (var i = 0; i < res.data.data.length; i++) {
                this.listGolonganPegawai.push({ label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id.kode })
            };
            this.selectedGolongan = this.listGolonganPegawai;


        },
        error => {
            this.listGolonganPegawai = [];
            this.listGolonganPegawai.push({ label: '-- ' + error + ' --', value: '' })
        });



        // this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/generateNoSK').subscribe(table => {
        //     console.log(table.data);
        //     this.form.get('noSK').setValue(table.data);
        // });

        this.getDataGrid(Configuration.get().page, Configuration.get().rows);

        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/getSK').subscribe(res => {
            this.namaSK = [];
            this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
            for (var i = 0; i < res.SK.length; i++) {
                this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
            };
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/periode/findAll?page=1&rows=1000&dir=namaPeriode&sort=desc').subscribe(res => {
            this.listPeriode = [];
            this.listPeriode.push({ label: '--Pilih Periode--', value: null })
            for (var i = 0; i < res.Periode.length; i++) {
                if (res.Periode[i].kdPeriodeHead == null && res.Periode[i].statusEnabled == true) {
                    this.listPeriode.push({ label: res.Periode[i].namaPeriode, value: res.Periode[i].kode.kode })
                }
            };
        });

        this.getSmbrFile();
    }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
    }

    cetak(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKWaktuKerja/laporanPegawaiSKWaktuKerja.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPegawaiSKWaktuKerja_laporanCetak');
    }

    downloadPdf() {
        let cetak = Configuration.get().report + '/pegawaiSKWaktuKerja/laporanPegawaiSKWaktuKerja.pdf?kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
        window.open(cetak);
    }


    cari() {
        this.httpService.get(Configuration.get().dataMaster + '/pegawaiskwaktukerja/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&noSK=' + this.pencarian).subscribe(table => {
            this.listData = table.data.data;
            this.totalRecords = table.totalRow;
        });
    }
    getKelompokTransaksi() {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/getKelompokTransaksi').subscribe(table => {
            let dataKelompokTransaksi = table.KelompokTransaksi;
            localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
            this.route.navigate(['/master-sk/surat-keputusan']);
        });
    }

    ambilSK(sk) {
        if (this.form.get('namaSk').value == '' || this.form.get('namaSk').value == null || this.form.get('namaSk').value == undefined) {
            this.form.get('noSk').setValue(null);
            this.form.get('noSkIntern').setValue(null);
            this.form.get('tanggalAwal').setValue(null);
            this.form.get('tanggalAkhir').setValue(null);
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/getSK?noSK=' + sk.value).subscribe(table => {
                let detailSK = table.SK;
                console.log(detailSK);
                this.form.get('noSk').setValue(detailSK[0].noSK);
                this.form.get('noSkIntern').setValue(detailSK[0].noSKIntern);
                this.form.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
                if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined) {
                    this.form.get('tanggalAkhir').setValue(null);
                } else {
                    this.form.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
                }
            });
        }
    }
    getDataGrid(page: number, rows: number) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/findAll?page=' + page + '&rows=' + rows + '&dir=id.noSK&sort=desc').subscribe(table => {
            this.listData = table.data.data;
            this.totalRecords = table.data.totalRow;
        });
    }
    loadPage(event: LazyLoadEvent) {
        // let awal = this.setTimeStamp(this.tanggalAwal);
        // let akhir = this.setTimeStamp(this.tanggalAkhir);
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows)
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }
    onRowSelect(event) {

        this.selectedKategori = [{
            label: event.data.namaKategoryPegawai,
            value: event.data.kdKategoryPegawai
        }]
        this.selectedGolongan = [{
            label: event.data.namaGolonganPegawai,
            value: event.data.kdGolonganPegawai
        }]
        // let cloned = this.clone(event.data);
        this.formAktif = false;
        // this.form.setValue(cloned);
        // let tgl = event.data.tglBerlakuAkhir * 1000;

        if (event.data.isAllowTukarJadwal == 1) {
            this.TukarJadwal = true;
            this.CekTukarJadwal = 1;
        } else {
            this.TukarJadwal = false;
            this.CekTukarJadwal = 0;
        }
        if (event.data.isAutoOver == 1) {
            this.AutoOver = true;
            this.CekAutoOver = 1;
        } else {
            this.AutoOver = false;
            this.CekAutoOver = 0;
        }
        if (event.data.isHolidayOverAllowToOff == 1) {
            this.HolidayOverAllowToOff = true;
            this.CekHolidayOverAllowToOff = 1;
        } else {
            this.HolidayOverAllowToOff = false;
            this.CekHolidayOverAllowToOff = 0;
        }

        if (event.data.isNormalOverAllowToOff == 1) {
            this.NormalOverAllowToOff = true;
            this.CekNormalOverAllowToOff = 1;
        } else {
            this.NormalOverAllowToOff = false;
            this.CekNormalOverAllowToOff = 0;
        }
        if (event.data.isOverAllowAccumulated == 1) {
            this.OverAllowAccumulated = true;
            this.CekOverAllowAccumulated = 1;
        } else {
            this.OverAllowAccumulated = false;
            this.CekOverAllowAccumulated = 0;
        }
        if (event.data.isOverAllowToLate == 1) {
            this.OverAllowToLate = true;
            this.CekOverAllowToLate = 1;
        } else {
            this.OverAllowToLate = false;
            this.CekOverAllowToLate = 0;
        }
        if (event.data.isRekapByDay == 1) {
            this.isRekapByDay = true;
            this.cekRekapByDay = 1;
        } else {
            this.isRekapByDay = false;
            this.cekRekapByDay = 0;
        }
        console.log(event.data);

        this.form.get('allowTukarJadwal').setValue(this.TukarJadwal);
        this.form.get('autoOver').setValue(this.AutoOver);
        this.form.get('holidayOverAllowToOff').setValue(this.HolidayOverAllowToOff);
        this.form.get('normalOverAllowToOff').setValue(this.NormalOverAllowToOff);
        this.form.get('overAllowAccumulated').setValue(this.OverAllowAccumulated);
        this.form.get('overAllowToLate').setValue(this.OverAllowToLate);
        this.form.get('isRekapByDay').setValue(this.isRekapByDay);
        // this.form.get('kdGolonganPegawai').setValue(event.data.kdGolonganPegawai);
        // this.form.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
        this.form.get('namaSk').setValue(event.data.noSK);
        this.form.get('noSk').setValue(event.data.noSK);
        this.form.get('noSkIntern').setValue(event.data.noSKIntern);
        this.form.get('kdPeriode').setValue(event.data.kdPeriode);
        this.form.get('qtyHariMinPostingTukarJadwal').setValue(event.data.qtyHariMinPostingTukarJadwal);
        this.form.get('qtyHariOverExpired').setValue(event.data.qtyHariOverExpired);
        this.form.get('qtyJamMaxPostingTukarJadwal').setValue(event.data.qtyJamMaxPostingTukarJadwal);
        this.form.get('qtyMenitMaxAllowLate').setValue(event.data.qtyMenitMaxAllowLate);
        this.form.get('qtyMenitMaxOver').setValue(event.data.qtyMenitMaxOver);
        this.form.get('qtyMenitMaxOverAccumulated').setValue(event.data.qtyMenitMaxOverAccumulated);
        this.form.get('qtyMenitMinOver').setValue(event.data.qtyMenitMinOver);
        this.form.get('qtyMenitMinOverMasuk').setValue(event.data.qtyMenitMinOverMasuk);
        this.form.get('qtyMenitMinOverPulang').setValue(event.data.qtyMenitMinOverPulang);
        // this.form.get('qtyMenitOffForHolidayOver').setValue(event.data.qtyMenitOffForHolidayOver);
        // this.form.get('qtyMenitOffForNormalOver').setValue(event.data.qtyMenitOffForNormalOver);

        this.form.get('qtyMenitMaxBeforeCheckin').setValue(event.data.qtyMenitMaxBeforeCheckin);
        this.form.get('qtyMenitMinBeforeCheckout').setValue(event.data.qtyMenitMinBeforeCheckout);
        this.form.get('qtyRangeMasaKerja').setValue(event.data.qtyRangeMasaKerja);

        if (event.data.tglBerlakuAkhir == null) {

        } else {
            this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));

        }
        this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
        this.form.get('tanggalCutOffAkhir').setValue(event.data.tglCutOffAkhir);
        this.form.get('tanggalCutOffAwal').setValue(event.data.tglCutOffAwal);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        this.versi = event.data.version;
        this.form.get('kdGolonganPegawai').disable();
        this.form.get('kdKategoryPegawai').disable();
    }

    changeAktif(event) {
        if (event == true) {
            this.form.get('tglAkhirBerlakuSk').enable();
            this.form.get('tglAkhirBerlakuSk').setValidators(Validators.required);
        } else {
            this.form.get('tglAkhirBerlakuSk').clearValidators();
            this.form.get('tglAkhirBerlakuSk').setValue('');
            this.form.get('tglAkhirBerlakuSk').disable();
        }
    }
    changeTukarJadwal(event) {
        if (event == true) {
            this.CekTukarJadwal = 1;
        } else {
            this.CekTukarJadwal = 0;
        }
    }
    changeHolidayOverAllowToOff(event) {
        if (event == true) {
            this.CekHolidayOverAllowToOff = 1;
        } else {
            this.CekHolidayOverAllowToOff = 0;
        }
    }
    changeAutoOver(event) {
        if (event == true) {
            this.CekAutoOver = 1;
        } else {
            this.CekAutoOver = 0;
        }
    }

    changeNormalOverAllowToOff(event) {
        if (event == true) {
            this.CekNormalOverAllowToOff = 1;
        } else {
            this.CekNormalOverAllowToOff = 0;
        }
    }

    changeOverAllowAccumulated(event) {
        if (event == true) {
            this.CekOverAllowAccumulated = 1;
        } else {
            this.CekOverAllowAccumulated = 0;
        }
    }

    changeOverAllowToLate(event) {
        if (event == true) {
            this.CekOverAllowToLate = 1;
        } else {
            this.CekOverAllowToLate = 0;
        }
    }
    changeOverRekapByDay(event) {
        if (event == true) {
            this.cekRekapByDay = 1;
        } else {
            this.cekRekapByDay = 0;
        }
    }

    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    setTimeStamp(date) {
        let dataTimeStamp = (new Date(date).getTime() / 1000);
        return dataTimeStamp;
    }
    get() {

    }
    setDataPegawai(event) {
        this.form.get('nik').setValue(event.value.nik);
        this.form.get('jabatan').setValue(event.value.namaJabatan);
        this.form.get('jenisKelamin').setValue(event.value.jenisKelamin);
        this.form.get('jenisPegawai').setValue(event.value.jenisPegawai);
        this.form.get('unitKerja').setValue(event.value.namaRuangan);
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
            this.confirmUpdate();
        } else {
            let golongan = [];
            let kategoriPegawai = [];
            for (let i = 0; i < this.selectedGolongan.length; i++) {
                golongan.push({
                    "kode": this.selectedGolongan[i].value,
                })
            }
            for (let i = 0; i < this.selectedKategori.length; i++) {
                kategoriPegawai.push({
                    "kode": this.selectedKategori[i].value,
                })
            }
            let fixHub = {

                "isAutoOver": this.CekAutoOver,
                "isHolidayOverAllowToOff": this.CekHolidayOverAllowToOff,
                "isNormalOverAllowToOff": this.CekNormalOverAllowToOff,
                "isOverAllowAccumulated": this.CekOverAllowAccumulated,
                "isOverAllowToLate": this.CekOverAllowToLate,
                "isAllowTukarJadwal": this.CekTukarJadwal,
                "isRekapByDay": this.cekRekapByDay,
                "golongan": golongan,
                "kategoriPegawai": kategoriPegawai,
                // "namaSk": this.form.get('namaSk').value,
                "noSk": this.form.get('noSk').value,
                "kdPeriode": this.form.get('kdPeriode').value,
                "qtyHariMinPostingTukarJadwal": this.form.get('qtyHariMinPostingTukarJadwal').value,
                "qtyHariOverExpired": this.form.get('qtyHariOverExpired').value,
                "qtyJamMaxPostingTukarJadwal": this.form.get('qtyJamMaxPostingTukarJadwal').value,
                "qtyMenitMaxAllowLate": this.form.get('qtyMenitMaxAllowLate').value,
                "qtyMenitMaxOver": this.form.get('qtyMenitMaxOver').value,
                "qtyMenitMaxOverAccumulated": this.form.get('qtyMenitMaxOverAccumulated').value,
                "qtyMenitMinOver": this.form.get('qtyMenitMinOver').value,
                "qtyMenitMinOverMasuk": this.form.get('qtyMenitMinOverMasuk').value,
                "qtyMenitMinOverPulang": this.form.get('qtyMenitMinOverPulang').value,
                // "qtyMenitOffForHolidayOver": this.form.get('qtyMenitOffForHolidayOver').value,
                // "qtyMenitOffForNormalOver": this.form.get('qtyMenitOffForNormalOver').value,

                "qtyMenitMaxBeforeCheckin": this.form.get('qtyMenitMaxBeforeCheckin').value,
                "qtyMenitMinBeforeCheckout": this.form.get('qtyMenitMinBeforeCheckout').value,
                "qtyRangeMasaKerja": this.form.get('qtyRangeMasaKerja').value,

                "tglBerlakuAkhir": this.setTimeStamp(this.form.get('tanggalAkhir').value),
                "tglBerlakuAwal": this.setTimeStamp(this.form.get('tanggalAwal').value),
                "tglCutOffAkhir": this.form.get('tanggalCutOffAkhir').value,
                "tglCutOffAwal": this.form.get('tanggalCutOffAwal').value,
                "statusEnabled": this.form.get('statusEnabled').value,



            }
            console.log(fixHub);

            this.httpService.post(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/saveRev', fixHub).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.reset();
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
        let fixHub = {

            "isAutoOver": this.CekAutoOver,
            "isHolidayOverAllowToOff": this.CekHolidayOverAllowToOff,
            "isNormalOverAllowToOff": this.CekNormalOverAllowToOff,
            "isOverAllowAccumulated": this.CekOverAllowAccumulated,
            "isOverAllowToLate": this.CekOverAllowToLate,
            "isAllowTukarJadwal": this.CekTukarJadwal,
            "isRekapByDay": this.cekRekapByDay,
            "kdGolonganPegawai": this.selectedGolongan[0].value,
            "kdkategoryPegawai": this.selectedKategori[0].value,
            "namaSk": this.form.get('namaSk').value,
            "noSk": this.form.get('noSk').value,
            "kdPeriode": this.form.get('kdPeriode').value,
            "qtyHariMinPostingTukarJadwal": this.form.get('qtyHariMinPostingTukarJadwal').value,
            "qtyHariOverExpired": this.form.get('qtyHariOverExpired').value,
            "qtyJamMaxPostingTukarJadwal": this.form.get('qtyJamMaxPostingTukarJadwal').value,
            "qtyMenitMaxAllowLate": this.form.get('qtyMenitMaxAllowLate').value,
            "qtyMenitMaxOver": this.form.get('qtyMenitMaxOver').value,
            "qtyMenitMaxOverAccumulated": this.form.get('qtyMenitMaxOverAccumulated').value,
            "qtyMenitMinOver": this.form.get('qtyMenitMinOver').value,
            "qtyMenitMinOverMasuk": this.form.get('qtyMenitMinOverMasuk').value,
            "qtyMenitMinOverPulang": this.form.get('qtyMenitMinOverPulang').value,
            // "qtyMenitOffForHolidayOver": this.form.get('qtyMenitOffForHolidayOver').value,
            // "qtyMenitOffForNormalOver": this.form.get('qtyMenitOffForNormalOver').value,

            "qtyMenitMaxBeforeCheckin": this.form.get('qtyMenitMaxBeforeCheckin').value,
            "qtyMenitMinBeforeCheckout": this.form.get('qtyMenitMinBeforeCheckout').value,
            "qtyRangeMasaKerja": this.form.get('qtyRangeMasaKerja').value,

            "tglBerlakuAkhir": this.setTimeStamp(this.form.get('tanggalAkhir').value),
            "tglBerlakuAwal": this.setTimeStamp(this.form.get('tanggalAwal').value),
            "tglCutOffAkhir": this.form.get('tanggalCutOffAkhir').value,
            "tglCutOffAwal": this.form.get('tanggalCutOffAwal').value,
            "statusEnabled": this.form.get('statusEnabled').value,


        }

        this.httpService.update(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/update/' + this.versi, fixHub).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
    }
    confirmDelete() {
        let noSk = this.form.get('noSk').value;
        if (noSk == null || noSk == undefined || noSk == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Waktu Kerja');
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
        console.log(deleteItem);
        this.httpService.delete(Configuration.get().dataMasterNew + '/pegawaiskwaktukerja/del/' + deleteItem.noSK + '/' + deleteItem.kdGolonganPegawai + '/' + deleteItem.kdKategoryPegawai).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });


    }
    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    reset() {
        this.form.get('kdGolonganPegawai').enable();
        this.form.get('kdKategoryPegawai').enable();
        this.ngOnInit();
    }
    onDestroy() {

    }
    showTanggal(t) {
        console.log(t)
    }
}

class InisialPegawaiSkStatusInterface implements PegawaiSkWaktuKerjaInterface {

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
        public kotaKabupaten?
        ) { }

}