import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Kalender } from './kalender.interface';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
    selector: 'app-kalender',
    templateUrl: './kalender.component.html',
    styleUrls: ['./kalender.component.scss'],
    providers: [ConfirmationService]
})
export class KalenderComponent implements OnInit {
    listTahun: any[];
    selected: Kalender[];
    listData: any[];
    totalRecords: number;
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    rows: number;
    formHariLibur: FormGroup;
    displayHari: boolean;
    kodeHariLibur: any[];
    header: any;
    kdTanggal: any;
    page: number;
    listDataLibur: any[];
    events: any[];
    formHariLiburUpdate: FormGroup;
    displayHariUpdate: boolean;
    noRec: any;
    eventsFalse: any[];
    kdHariLiburLama: any;
    listPeriode: any[];
    listPeriodeChild: any[];

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) { }


    ngOnInit() {
        this.kdHariLiburLama = null;
        this.header = {
            left: '',
            center: 'title'
        };
        this.listTahun = [];
        this.listTahun.push({ label: '-Pilih Tahun-', value: '' });
        for (let i = 2014; i <= new Date().getFullYear() + 2; i++) {
            this.listTahun.push({ label: i, value: i });
        };
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;
        this.pencarian = '';
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.get();
        this.getDataGrid(this.page, this.rows, this.pencarian);
        this.formAktif = true;

        this.rows = Configuration.get().rows;
        this.form = this.fb.group({
            'kode': new FormControl(null),
            'tanggal': new FormControl('', Validators.required),
            'namaHari': new FormControl('', Validators.required),
            'namaBulan': new FormControl('', Validators.required),
            'hariKeDlmMinggu': new FormControl('', Validators.required),
            'hariKeDlmBulan': new FormControl('', Validators.required),
            'hariKeDlmTahun': new FormControl('', Validators.required),
            'mingguKeDlmTahun': new FormControl('', Validators.required),
            'bulanKeDlmTahun': new FormControl('', Validators.required),
            'tahunKalender': new FormControl('', Validators.required),
            'tahunFiscal': new FormControl(null),
            'bulanFiscal': new FormControl(null),
            'triwulanKeDlmTahun': new FormControl(null),
            'semesterKeDlmTahun': new FormControl(null),
            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'kdTahun': new FormControl(null),
            'statusEnabled': new FormControl(true)
        });

        this.formHariLibur = this.fb.group({
            'tanggalLibur': new FormControl({ value: '', disabled: true }, Validators.required),
            'kdHariLibur': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
            'kdPeriode': new FormControl(null),
            'kdPeriodeChild': new FormControl(null)
        });
        this.formHariLiburUpdate = this.fb.group({
            'tanggalLibur': new FormControl({ value: '', disabled: true }, Validators.required),
            'kdHariLibur': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
            'kdPeriode': new FormControl(null),
            'kdPeriodeChild': new FormControl(null)
        });
    }
    get() {
        this.getPage(Configuration.get().page, Configuration.get().rows);
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=HariLibur&select=namaHariLibur,id').subscribe(res => {
            this.kodeHariLibur = [];
            this.kodeHariLibur.push({ label: '--Pilih Hari Libur--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.kodeHariLibur.push({ label: res.data.data[i].namaHariLibur, value: res.data.data[i].id.kode })
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

    }
    getDataGrid(page: number, rows: number, cari: string) {
        this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findAll?page=' + page + '&rows=' + rows + '&dir=hariLibur.namaHariLibur&sort=desc&namaHariLibur=' + this.pencarian).subscribe(table => {
            this.listDataLibur = table.MapKalenderToHariLibur;
            this.totalRecords = table.totalRow;
            this.getHariLibur(Configuration.get().page, Configuration.get().rows, this.totalRecords);
        });
    }
    loadPage(event: LazyLoadEvent) {
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    }
    cari() {
        this.getDataGrid(Configuration.get().page, Configuration.get().rows, this.pencarian)
    }
    getHariLibur(page: number, rows: number, totalRecords: any) {
        if (totalRecords === undefined || totalRecords === null || totalRecords === 0) {
            totalRecords = Configuration.get().rows;
        }
        this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findAll?page=1&rows=' + totalRecords).subscribe(table => {
            let data = [];
            let dataFalse = [];
            for (var i = 0; i < table.MapKalenderToHariLibur.length; i++) {
                if (table.MapKalenderToHariLibur[i].statusEnabled == true) {
                    data[i] = {
                        "title": table.MapKalenderToHariLibur[i].namaHariLibur,
                        "start": this.formatDate(table.MapKalenderToHariLibur[i].tanggal * 1000),
                        "statusEnabled": table.MapKalenderToHariLibur[i].statusEnabled,
                        "kdHariLibur": table.MapKalenderToHariLibur[i].kdHariLibur,
                        "kdProfile": table.MapKalenderToHariLibur[i].kdProfile,
                        "tanggal": table.MapKalenderToHariLibur[i].tanggal,
                        "kdTanggal": table.MapKalenderToHariLibur[i].kdTanggal,
                        "version": table.MapKalenderToHariLibur[i].version,
                        "namaHariLibur": table.MapKalenderToHariLibur[i].namaHariLibur,
                        "noRec": table.MapKalenderToHariLibur[i].noRec,
                        "kdPeriode": table.MapKalenderToHariLibur[i].kdPeriodeHead,
                        "kdPeriodeChild": table.MapKalenderToHariLibur[i].kdPeriode

                    }
                } else {
                    data[i] = {
                        "title": "False",
                        "start": this.formatDate(table.MapKalenderToHariLibur[i].tanggal * 1000),
                        "statusEnabled": table.MapKalenderToHariLibur[i].statusEnabled,
                        "kdHariLibur": table.MapKalenderToHariLibur[i].kdHariLibur,
                        "kdProfile": table.MapKalenderToHariLibur[i].kdProfile,
                        "tanggal": table.MapKalenderToHariLibur[i].tanggal,
                        "kdTanggal": table.MapKalenderToHariLibur[i].kdTanggal,
                        "version": table.MapKalenderToHariLibur[i].version,
                        "namaHariLibur": table.MapKalenderToHariLibur[i].namaHariLibur,
                        "noRec": table.MapKalenderToHariLibur[i].noRec,
                        "kdPeriode": table.MapKalenderToHariLibur[i].kdPeriodeHead,
                        "kdPeriodeChild": table.MapKalenderToHariLibur[i].kdPeriode

                    }
                }
            }
            this.events = data.filter(data => data.statusEnabled == true);
            // this.eventsFalse = dataFalse;
        });
    }
    generateTahun() {
        let tahun = this.form.get('kdTahun').value;
        this.httpService.get(Configuration.get().dataMaster + '/kalender/save/' + tahun).subscribe(table => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
        });
        this.ngOnInit();
    }
    getPage(page: number, rows: number) {
        // this.httpService.get(Configuration.get().dataMaster + '/kalender/findAll?page=' + page + '&rows=' + rows + '&dir=tanggal&sort=desc').subscribe(table => {
        //     this.listData = table.data.Kalender;
        //     this.totalRecords = table.data.totalRow;
        // });
    }
    confirmDelete() {
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
        if (this.formHariLibur.invalid) {
            this.validateAllFormFields(this.formHariLibur);
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

    confirmApplyJadwal(kdhr:any, kdtgl:any, tgl:any){
        //validate dulu tanggal backdate ato engga    

        let today = this.formatDate(new Date());        
        let tglParse = Date.parse(today);          
        let tglParse2 = Date.parse(tgl);      
        if(tglParse<tglParse2){
            this.confirmationService.confirm({
                message: 'Terapkan Hari Libur Pada Jadwal Kerja?',
                header: 'Konfirmasi Penerapan Hari Libur Pada Jadwal Kerja (Non Shift)',
                accept: () => {
                    this.applyToJadwal(kdhr,kdtgl);
                },
                reject: () => {
                         this.alertService.warn('Peringatan', 'Hari Libur Tidak diterapkan pada Jadwal Kerja');
                }
            });    
        }
    }

    update() {
        if (this.formHariLiburUpdate.invalid) {
            this.validateAllFormFields(this.formHariLiburUpdate);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            let dataSimpan;
            if (this.kdHariLiburLama == this.formHariLiburUpdate.get('kdHariLibur').value) {
                dataSimpan = {
                    "kdHariLibur": this.formHariLiburUpdate.get('kdHariLibur').value,
                    "kdHariLiburLama": null,
                    "kdTanggal": this.kdTanggal - 1,
                    "kdPeriode": this.formHariLiburUpdate.get('kdPeriodeChild').value,
                    "statusEnabled": this.formHariLiburUpdate.get('statusEnabled').value,
                    "noRec": this.noRec,
                    "version": this.versi
                }
            } else {
                dataSimpan = {
                    "kdHariLibur": this.formHariLiburUpdate.get('kdHariLibur').value,
                    "kdHariLiburLama": this.kdHariLiburLama,
                    "kdTanggal": this.kdTanggal - 1,
                    "kdPeriode": this.formHariLiburUpdate.get('kdPeriodeChild').value,
                    "statusEnabled": this.formHariLiburUpdate.get('statusEnabled').value,
                    "noRec": this.noRec,
                    "version": this.versi
                }
            }


            this.httpService.update(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/update/' + this.versi, dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.confirmApplyJadwal(this.formHariLiburUpdate.get('kdHariLibur').value,this.kdTanggal - 1,this.formHariLiburUpdate.get('tanggalLibur').value);
                this.get();
                this.reset();
            });
        }


    }
    simpan() {

        let dataSimpan = {
            "kdHariLibur": this.formHariLibur.get('kdHariLibur').value,
            "kdTanggal": this.kdTanggal - 1,
            "kdPeriode": this.formHariLibur.get('kdPeriodeChild').value,
            "statusEnabled": true
        }
        this.httpService.post(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/save?', dataSimpan).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.confirmApplyJadwal(this.formHariLibur.get('kdHariLibur').value, this.kdTanggal - 1, this.formHariLibur.get('tanggalLibur').value);
            this.displayHari = false;
            this.reset();
        });
    }

    applyToJadwal(kdhr:any, kdtgl:any) {
        let dataSimpan = {
            "kdHariLibur": kdhr,
            "kdTanggal": kdtgl
        }
        this.httpService.post(Configuration.get().dataHr2Mod3 + '/hari-libur-to-jadwal/apply-jadwal?', dataSimpan).subscribe(response => {
            this.alertService.success('Berhasil', 'Hari Libur di Jadwal Kerja sudah tersimpan');
        });
    }


    reset() {
        this.displayHariUpdate = false;
        this.displayHari = false;
        this.formAktif = true;
        this.ngOnInit();
    }
    onRowSelect(event, fc) {
        this.kdTanggal = event.data.kdTanggal + 1;
        this.versi = event.data.version;
        this.noRec = event.data.noRec;
        this.kdHariLiburLama = event.data.kdHariLibur;
        // console.log(fc);
        this.formHariLiburUpdate.get('tanggalLibur').setValue(new Date(event.data.tanggal * 1000));
        this.formHariLiburUpdate.get('kdHariLibur').setValue(event.data.kdHariLibur);
        this.formHariLiburUpdate.get('statusEnabled').setValue(event.data.statusEnabled);
        this.formHariLiburUpdate.get('kdPeriode').setValue(event.data.kdPeriodeHead);
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Periode&select=namaPeriode,kdPeriodeHead,statusEnabled,id&page=1&rows=1000&criteria=kdPeriodeHead&values='+ event.data.kdPeriodeHead +'&condition=and&profile=y').subscribe(res => {
            this.listPeriodeChild = [];
            this.listPeriodeChild.push({ label: '--Pilih Periode Child--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listPeriodeChild.push({ label: res.data.data[i].namaPeriode, value: res.data.data[i].id.kode })
            };
          });
        this.formHariLiburUpdate.get('kdPeriodeChild').setValue(event.data.kdPeriode);
        let tgl = this.formatDate(event.data.tanggal*1000);
        let tglParse = Date.parse(tgl);        
        fc.gotoDate(tglParse);
        this.displayHariUpdate = true;

    }
    clone(cloned: Kalender): Kalender {
        let hub = new InisialKalender();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKalender();
        fixHub = {
            'tanggal': hub.tanggal,
            'namaHari': hub.namaHari,
            'namaBulan': hub.namaBulan,
            'hariKeDlmMinggu': hub.hariKeDlmMinggu,
            'hariKeDlmBulan': hub.hariKeDlmBulan,
            'hariKeDlmTahun': hub.hariKeDlmTahun,
            'mingguKeDlmTahun': hub.mingguKeDlmTahun,
            'bulanKeDlmTahun': hub.bulanKeDlmTahun,
            'tahunKalender': hub.tahunKalender,
            'tahunFiscal': hub.tahunFiscal,
            'bulanFiscal': hub.bulanFiscal,
            'triwulanKeDlmTahun': hub.triwulanKeDlmTahun,
            'semesterKeDlmTahun': hub.semesterKeDlmTahun,
            'kode': hub.id.kode,
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
        this.httpService.delete(Configuration.get().dataMaster + '/kalender/del/' + deleteItem.id.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.get();
        });

    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
    onClik(event) {
        let tahun = event.date._i / 1000;
        this.formHariLibur.get('tanggalLibur').setValue(new Date(event.date._i));

        this.httpService.get(Configuration.get().dataHr2Mod3 + '/kalender/getKodeByTanggal?tanggal=' + tahun).subscribe(table => {
            this.kdTanggal = table.data.kode;
        });
        this.displayHari = true;
    }
    onClikEvent(e) {
        this.formHariLiburUpdate.get('tanggalLibur').setValue(new Date(e.calEvent.tanggal * 1000));
        this.formHariLiburUpdate.get('kdHariLibur').setValue(e.calEvent.kdHariLibur);
        this.formHariLiburUpdate.get('statusEnabled').setValue(e.calEvent.statusEnabled);
        this.formHariLiburUpdate.get('kdPeriode').setValue(e.calEvent.kdPeriode);
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Periode&select=namaPeriode,kdPeriodeHead,statusEnabled,id&page=1&rows=1000&criteria=kdPeriodeHead&values='+ e.calEvent.kdPeriode +'&condition=and&profile=y').subscribe(res => {
            this.listPeriodeChild = [];
            this.listPeriodeChild.push({ label: '--Pilih Periode Child--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listPeriodeChild.push({ label: res.data.data[i].namaPeriode, value: res.data.data[i].id.kode })
            };
          });
        this.formHariLiburUpdate.get('kdPeriodeChild').setValue(e.calEvent.kdPeriodeChild);
        this.kdTanggal = e.calEvent.kdTanggal + 1;
        this.noRec = e.calEvent.noRec;
        this.versi = e.calEvent.version;
        this.kdHariLiburLama = e.calEvent.kdHariLibur;
        this.displayHariUpdate = true;
        // let tahun = event.date._i / 1000;
        // this.httpService.get(Configuration.get().dataHr2Mod3 + '/kalender/getKodeByTanggal?tanggal=' + tahun).subscribe(table => {
        //     // this.alertService.success('Berhasil', 'Data Diperbarui');
        //     this.kdTanggal = table.data.kode;
        //     let kode = table.data.kode - 1;
        //     this.httpService.get(Configuration.get().dataMasterNew + '/mapkalendertoharilibur/findByKode/' + kode).subscribe(res => {
        //         let data = res.MapKalenderToHariLibur;
        //         this.versi = data.version;
        //         this.noRec = data.noRec;
        //         if (Object.keys(data).length == 0) {
        //             this.formHariLibur.get('tanggalLibur').setValue(new Date(event.date._i));
        //             this.displayHari = true;
        //         } else {
        //             this.formHariLiburUpdate.get('tanggalLibur').setValue(new Date(res.MapKalenderToHariLibur.tanggal * 1000));
        //             this.formHariLiburUpdate.get('kdHariLibur').setValue(res.MapKalenderToHariLibur.kdHariLibur);
        //             this.formHariLiburUpdate.get('statusEnabled').setValue(res.MapKalenderToHariLibur.statusEnabled);
        //             this.displayHariUpdate = true;
        //         }
        //     });

        //     // console.log(table.data.kode);
        // });
    }
    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    eventRender(event, element, view) {
        // console.log(event, element, view);
    }

    nextYear(fc) {
        let tahun = fc.getDate()._i[0] + 1;
        // console.log(tahun);
        this.httpService.get(Configuration.get().dataMaster + '/kalender/save/' + tahun).subscribe(table => {
            this.alertService.success('Berhasil', 'Data Disimpan');
        });
        fc.nextYear();
    }
    prevYear(fc) {
        let tahun = fc.getDate()._i[0] - 1;
        // console.log(tahun);
        this.httpService.get(Configuration.get().dataMaster + '/kalender/save/' + tahun).subscribe(table => {
            this.alertService.success('Berhasil', 'Data Disimpan');
        });
        fc.prevYear();
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    pilihHead(event){
        let kdPeriodeHead = event.value;
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Periode&select=namaPeriode,kdPeriodeHead,statusEnabled,id&page=1&rows=1000&criteria=kdPeriodeHead&values='+ kdPeriodeHead +'&condition=and&profile=y').subscribe(res => {
            this.listPeriodeChild = [];
            this.listPeriodeChild.push({ label: '--Pilih Periode Child--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
            //   if (res.data.data[i].kdPeriodeHead == null && res.data.data[i].statusEnabled == true) {
                this.listPeriodeChild.push({ label: res.data.data[i].namaPeriode, value: res.data.data[i].id.kode })
            //   }
      
            };
          });

    }




}

class InisialKalender implements Kalender {

    constructor(
        public tanggal?,
        public namaHari?,
        public namaBulan?,
        public hariKeDlmMinggu?,
        public hariKeDlmBulan?,
        public hariKeDlmTahun?,
        public mingguKeDlmTahun?,
        public bulanKeDlmTahun?,
        public tahunKalender?,
        public tahunFiscal?,
        public bulanFiscal?,
        public triwulanKeDlmTahun?,
        public semesterKeDlmTahun?,
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