import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Departemen, SelectedItem } from './departemen.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import * as $ from 'jquery';

@Component({
    selector: 'app-departemen',
    templateUrl: './departemen.component.html',
    styleUrls: ['./departemen.component.scss'],
    providers: [ConfirmationService]
})
export class DepartemenComponent implements OnInit {
    selected: Departemen;
    listData: Departemen[];
    listJenisPerawatan: SelectedItem[];
    listDepartemen: SelectedItem[];
    listPegawai: SelectedItem[];
    jenisAlamat: Departemen[];
    listNegara: Departemen[];
    formAktif: boolean;
    pencarian: string;
    dataDummy: {};
    versi: any;
    form: FormGroup;
    page: number;
    rows: number;
    display: any;
    display2: any;
    cekisProfitCostCenter: any;
    isProfitCostCenter: boolean;
    dataLoading: boolean;
    totalRecords: number;
    kdNegara: any;
    kdPropinsi: any;
    kdKotaKabupaten: any;
    kdKecamatan: any;
    propinsi: Departemen[];
    kotaKabupaten: Departemen[];
    kecamatan: Departemen[];
    kelurahan: Departemen[];
    $:any;
    kdprof: any;
    kddept: any;
    codes: Departemen[];
    items: MenuItem[];
    laporan: boolean = false;
    smbrFile:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,
        private fileService: FileService,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    }


    ngOnInit() {
        this.kdprof = this.authGuard.getUserDto().kdProfile;
        this.kddept = this.authGuard.getUserDto().kdDepartemen;

        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.dataLoading = false;
        this.get(this.page, this.rows, '');
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaDepartemen': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            // 'kdJenisPerawatan': new FormControl(''),
            // 'fixedPhone': new FormControl(''),
            // 'mobilePhone': new FormControl(''),
            // 'faksimile': new FormControl(''),
            // 'alamatEmail': new FormControl('', [Validators.required, Validators.email]),
            // 'website': new FormControl(''),
            'kdAlamat': new FormControl(''),
            // 'alamatLengkap': new FormControl(''),
            // 'rtrw': new FormControl(''),
            // 'kdNegara': new FormControl(''),
            // 'kdPropinsi': new FormControl(''),
            // 'kdKotaKabupaten': new FormControl(''),
            // 'kdKecamatan': new FormControl(''),
            // 'kdDesaKelurahan': new FormControl(''),
            // 'kodePos': new FormControl(''),
            'kdPegawaiKepala': new FormControl(null),
            // 'prefixNoAntrian': new FormControl(''),
            'kdDepartemenHead': new FormControl(null),
            'isProfitCostCenter': new FormControl(''),
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
              label: 'Exel', icon: 'fa-file-excel-o', command: () => {
                this.downloadExel();
              }
            }];

            this.getSmbrFile();


    }

    get(page, rows, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/departemen/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.Departemen;
            this.totalRecords = table.totalRow;


        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=JenisPerawatan&select=namaJenisPerawatan,id').subscribe(res => {
            this.listJenisPerawatan = [];
            this.listJenisPerawatan.push({ label: '--Pilih Jenis Perawatan--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listJenisPerawatan.push({ label: res.data.data[i].namaJenisPerawatan, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/masterPegawai/findData').subscribe(res => {
            this.listPegawai = [];
            this.listPegawai.push({ label: '--Pilih Pegawai Kepala--', value: '' })
            for (var i = 0; i < res.Data.length; i++) {
                this.listPegawai.push({ label: res.Data[i].namaLengkap, value: res.Data[i].kdpegawai })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Departemen&select=namaDepartemen,id').subscribe(res => {
            this.listDepartemen = [];
            this.listDepartemen.push({ label: '--Pilih Data Parent Departemen--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listDepartemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
            };
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/getDropDownAlamat').subscribe(res => {
            this.jenisAlamat = [];
            this.jenisAlamat.push({ label: '--Pilih Alamat--', value: '' })
            for (var i = 0; i < res.Alamat.length; i++) {
                this.jenisAlamat.push({ label: res.Alamat[i].alamat, value: res.Alamat[i].kode })
            };

        });
        this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(res => {
            this.listNegara = [];
            this.listNegara.push({ label: '--Pilih Negara--', value: '' })
            for (var i = 0; i < res.data.data.length; i++) {
                this.listNegara.push({ label: res.data.Negara[i].namaNegara, value: res.data.Negara[i].kode })
            };
        });
    }

    valuechangekdNegara(kdNegara) {
        if (kdNegara == undefined) {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Propinsi&criteria=kdNegara&values=null&condition=and&profile=y').subscribe(res => {
                this.propinsi = [];
                this.propinsi.push({ label: '--Pilih Propinsi--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.propinsi.push({ label: res.data.data[i].namaPropinsi, value: res.data.data[i].id.kode })
                };

            });

        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Propinsi&criteria=kdNegara&values=' + kdNegara + '&condition=and&profile=y').subscribe(res => {
                this.propinsi = [];
                this.propinsi.push({ label: '--Pilih Propinsi--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.propinsi.push({ label: res.data.data[i].namaPropinsi, value: res.data.data[i].id.kode })
                };

            });
        }
    }
    valuechangekdPropinsi(kdPropinsi) {
        if (kdPropinsi == undefined) {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KotaKabupaten&criteria=kdPropinsi&values=null&condition=and&profile=y').subscribe(res => {
                this.kotaKabupaten = [];
                this.kotaKabupaten.push({ label: '--Pilih Kota Kabupaten--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kotaKabupaten.push({ label: res.data.data[i].namaKotaKabupaten, value: res.data.data[i].id.kode })
                };
            });
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KotaKabupaten&criteria=kdPropinsi&values=' + kdPropinsi + '&condition=and&profile=y').subscribe(res => {
                this.kotaKabupaten = [];
                this.kotaKabupaten.push({ label: '--Pilih Kota Kabupaten--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kotaKabupaten.push({ label: res.data.data[i].namaKotaKabupaten, value: res.data.data[i].id.kode })
                };
            });
        }
    }


    valuechangekdKotaKabupaten(kdKotaKabupaten) {
        if (kdKotaKabupaten == undefined) {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kecamatan&criteria=kdKotaKabupaten&values=null&condition=and&profile=y').subscribe(res => {
                this.kecamatan = [];
                this.kecamatan.push({ label: '--Pilih Kecamatan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kecamatan.push({ label: res.data.data[i].namaKecamatan, value: res.data.data[i].id.kode })
                };
            });
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Kecamatan&criteria=kdKotaKabupaten&values=' + kdKotaKabupaten + '&condition=and&profile=y').subscribe(res => {
                this.kecamatan = [];
                this.kecamatan.push({ label: '--Pilih Kecamatan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kecamatan.push({ label: res.data.data[i].namaKecamatan, value: res.data.data[i].id.kode })
                };
            });
        }
    }

    listKodePos : any[];
    valuechangekdKecamatan(kdKecamatan) {
        this.listKodePos = [];
        if (kdKecamatan == undefined) {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DesaKelurahan&criteria=kdKecamatan&values=null&condition=and&profile=y').subscribe(res => {
                this.kelurahan = [];
                this.kelurahan.push({ label: '--Pilih Kelurahan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kelurahan.push({ label: res.data.data[i].namaDesaKelurahan, value: res.data.data[i].id.kode })
                    this.listKodePos[res.data.data[i].id.kode] = res.data.data[i].kodePos 
                };
            });
        } else {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DesaKelurahan&criteria=kdKecamatan&values=' + kdKecamatan + '&condition=and&profile=y').subscribe(res => {
                this.kelurahan = [];
                this.kelurahan.push({ label: '--Pilih Kelurahan--', value: '' })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.kelurahan.push({ label: res.data.data[i].namaDesaKelurahan, value: res.data.data[i].id.kode })
                    this.listKodePos[res.data.data[i].id.kode] = res.data.data[i].kodePos 
                };
            });
        }
    }
    setKodePos(kdDesa) {
        this.form.get('kodePos').setValue(this.listKodePos[kdDesa]);
    }
    cari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/departemen/findAll?' + '&page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDepartemen&sort=desc&namaDepartemen=' + this.pencarian).subscribe(table => {
            this.listData = table.Departemen;
            this.totalRecords = table.totalRow;

        });
    }
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
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
    valuechange(newvalue) {
        this.display = newvalue;
        this.display2 = newvalue;
    }

    changeConvert(event) {
        if (event == true) {
            this.cekisProfitCostCenter = 1
        } else {
            this.cekisProfitCostCenter = 0
        }

    }


    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Departemen');
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
        // let dataTemp = {
        //     "alamatLengkap": this.form.get('alamatLengkap').value,
        //     "rtrw": this.form.get('rtrw').value,
        //     "kdNegara": this.form.get('kdNegara').value,
        //     "kdPropinsi": this.form.get('kdPropinsi').value,
        //     "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
        //     "kdKecamatan": this.form.get('kdKecamatan').value,
        //     "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
        //     "kodePos": this.form.get('kodePos').value,
        //     "kdAlamat": this.form.get('kdAlamat').value,
        // }

        let fixHub = {
            // "dataAlamat": dataTemp,
            "kode": this.form.get('kode').value,
            "namaDepartemen": this.form.get('namaDepartemen').value,
            "kdAlamat": this.form.get('kdAlamat').value,
            // "kdJenisPerawatan": this.form.get('kdJenisPerawatan').value,
            // "fixedPhone": this.form.get('fixedPhone').value,
            // "mobilePhone": this.form.get('mobilePhone').value,
            // "faksimile": this.form.get('faksimile').value,
            // "alamatEmail": this.form.get('alamatEmail').value,
            // "website": this.form.get('website').value,
            "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
            "kdDepartemenHead": this.form.get('kdDepartemenHead').value,
            "statusEnabled": this.form.get('statusEnabled').value,
            "kodeExternal": this.form.get('kodeExternal').value,
            "namaExternal": this.form.get('namaExternal').value,
            "reportDisplay": this.form.get('reportDisplay').value,
            "isProfitCostCenter": this.cekisProfitCostCenter,


        }
        this.httpService.update(Configuration.get().dataMasterNew + '/departemen/update/' + this.versi, fixHub).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.get(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }
    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            // let isProfitCostCenter = this.cekisProfitCostCenter
            // let formSubmit = this.form.value;
            // formSubmit.isProfitCostCenter = isProfitCostCenter;

            // let dataTemp = {
            //     "alamatLengkap": this.form.get('alamatLengkap').value,
            //     "rtrw": this.form.get('rtrw').value,
            //     "kdNegara": this.form.get('kdNegara').value,
            //     "kdPropinsi": this.form.get('kdPropinsi').value,
            //     "kdKotaKabupaten": this.form.get('kdKotaKabupaten').value,
            //     "kdKecamatan": this.form.get('kdKecamatan').value,
            //     "kdDesaKelurahan": this.form.get('kdDesaKelurahan').value,
            //     "kodePos": this.form.get('kodePos').value,
            //     "kdAlamat": this.form.get('kdAlamat').value,
            // }

            let fixHub = {
                // "dataAlamat": dataTemp,
                "kode": this.form.get('kode').value,
                "namaDepartemen": this.form.get('namaDepartemen').value,
                "kdAlamat": this.form.get('kdAlamat').value,
                // "kdJenisPerawatan": this.form.get('kdJenisPerawatan').value,
                // "fixedPhone": this.form.get('fixedPhone').value,
                // "mobilePhone": this.form.get('mobilePhone').value,
                // "faksimile": this.form.get('faksimile').value,
                // "alamatEmail": this.form.get('alamatEmail').value,
                // "website": this.form.get('website').value,
                "kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
                "kdDepartemenHead": this.form.get('kdDepartemenHead').value,
                "statusEnabled": this.form.get('statusEnabled').value,
                "kodeExternal": this.form.get('kodeExternal').value,
                "namaExternal": this.form.get('namaExternal').value,
                "reportDisplay": this.form.get('reportDisplay').value,
                "isProfitCostCenter": this.cekisProfitCostCenter,


            }
            this.httpService.post(Configuration.get().dataMasterNew + '/departemen/save?', fixHub).subscribe(response => {
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
        this.ngOnInit();
    // }
    // firstFunction(data, data2){
    //   let d = $.Deferred();
    //   setTimeout(this.valuechangekdPropinsi(data), 1000);
    //   this.form.get('kdKotaKabupaten').setValue(data2);
    //   return d.promise();
    // }
    // secondFunction(data,data2){
    //   let d = $.Deferred();
    //   setTimeout(this.valuechangekdKotaKabupaten(data), 1000);
    //   this.form.get('kdKecamatan').setValue(data2);
    //   return d.promise();
    // }
    // thirdFunction(data, data2){
    //   let d = $.Deferred();
    //   setTimeout(this.valuechangekdKecamatan(data), 1000);
    //   this.form.get('kdDesaKelurahan').setValue(data2);
    //   return d.promise();
    // }
}
onRowSelect(event) {
        //   let cloned = this.clone(event.data);
        //    this.form.setValue(cloned);
        this.formAktif = false;
        if (event.data.isProfitCostCenter == 1) {
            this.isProfitCostCenter = true;
            this.cekisProfitCostCenter = 1;
        } else {
            this.isProfitCostCenter = false;
            this.cekisProfitCostCenter = 0;
        }

      //  this.form.get('kode').setValue(event.data.kode.kode),
           /*let arrayFunc = [
                this.valuechangekdPropinsi(event.data.kdPropinsi),
                this.valuechangekdKotaKabupaten(event.data.kdKotaKabupaten),
                this.valuechangekdKecamatan(event.data.kdKecamatan)
            ]
            for (let i =0;i<arrayFunc.length;i++){
                arrayFunc.[i];
            }*/
           // this.firstFunction(event.data.kdPropinsi,event.data.kdKotaKabupaten).pipe(this.secondFunction(event.data.kdKotaKabupaten,event.data.kdKecamatan)).pipe(this.thirdFunction(event.data.kdKecamatan,event.data.kdDesaKelurahan));
           this.form.get('kode').setValue(event.data.kode.kode);
           this.form.get('namaDepartemen').setValue(event.data.namaDepartemen),
            // this.form.get('kdJenisPerawatan').setValue(event.data.kdJenisPerawatan),
            // this.form.get('fixedPhone').setValue(event.data.fixedPhone),
            // this.form.get('mobilePhone').setValue(event.data.mobilePhone),
            // this.form.get('faksimile').setValue(event.data.faksimile),
            // this.form.get('alamatEmail').setValue(event.data.alamatEmail),
            // this.form.get('website').setValue(event.data.website),
            this.form.get('kdAlamat').setValue(event.data.kdAlamat),
            // this.form.get('alamatLengkap').setValue(event.data.alamatLengkap),
            // this.form.get('rtrw').setValue(event.data.rTRW),
            // this.form.get('kdNegara').setValue(event.data.kdNegara),
            // this.form.get('kdPropinsi').setValue(event.data.kdPropinsi),
            // this.form.get('kdKecamatan').setValue(event.data.kdKecamatan),
            // this.form.get('kdDesaKelurahan').setValue(event.data.kdDesaKelurahan),
            // this.form.get('kodePos').setValue(event.data.kodePos),

            this.form.get('kdPegawaiKepala').setValue(event.data.kdPegawaiKepala),
            // this.form.get('prefixNoAntrian').setValue(event.data.prefixNoAntrian),
            this.form.get('kdDepartemenHead').setValue(event.data.kdDepartemenHead),
            this.form.get('namaExternal').setValue(event.data.namaExternal),
            this.form.get('kodeExternal').setValue(event.data.kodeExternal),
            this.form.get('reportDisplay').setValue(event.data.reportDisplay),
            this.form.get('isProfitCostCenter').setValue(this.isProfitCostCenter),
            this.form.get('statusEnabled').setValue(event.data.statusEnabled),
            this.versi = event.data.version;
        }
    // clone(cloned: Departemen): Departemen {
    //     let hub = new InisialDepartemen();
    //     for(let prop in cloned) {
    //         hub[prop] = cloned[prop];
    //     }
    //     let fixHub = new InisialDepartemen();
    //     fixHub = {
    // 	  "kode": hub.departemen.id.kode,
    // 	  "namaDepartemen": hub.departemen.namaDepartemen,
    // 	  "reportDisplay": hub.departemen.reportDisplay,
    // 	  "kdJenisPerawatan": hub.departemen.kdJenisPerawatan,
    // 	  "fixedPhone": hub.departemen.fixedPhone,
    // 	  "mobilePhone": hub.departemen.mobilePhone,
    // 	  "faksimile": hub.departemen.faksimile,
    // 	  "alamatEmail": hub.departemen.alamatEmail,
    // 	  "website": hub.departemen.website,
    // 	  "kdPegawaiKepala": hub.departemen.kdPegawaiKepala,
    // 	  "prefixNoAntrian": hub.departemen.prefixNoAntrian,
    // 	  "kdDepartemenHead": hub.departemen.kdDepartemenHead,
    // 	  "isProfitCostCenter": hub.departemen.isProfitCostCenter,
    // 	  "kodeExternal": hub.departemen.kodeExternal,
    // 	  "namaExternal": hub.departemen.namaExternal,
    // 	  "statusEnabled": hub.departemen.statusEnabled
    //     }
    //     this.versi = hub.departemen.version;
    //     return fixHub;
    // }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/departemen/del/' + deleteItem.kode.kode).subscribe(response => {
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

    downloadExel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/departemen/findAll?page='+this.page+'&rows='+this.rows+'&dir=namaDepartemen&sort=desc').subscribe(table => {
          this.listData = table.Departemen;
          this.codes = [];
    
          for (let i = 0; i < this.listData.length; i++) {
              this.codes.push({
    
                kode: this.listData[i].kode.kode,
                namaDepartemenHead: this.listData[i].namaDepartemenHead,
                namaDepartemen: this.listData[i].namaDepartemen,
                kodeExternal: this.listData[i].kodeExternal,
                namaExternal: this.listData[i].namaExternal,
                statusEnabled: this.listData[i].statusEnabled
    
              })
          }
    
          this.fileService.exportAsExcelFile(this.codes, 'CaraBayar');
        });
    
      }

    getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

    downloadPdf(){
        let cetak = Configuration.get().report + '/departemen/laporanDepartemen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);
    }

    cetak() {
        this.laporan = true;
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
            this.print.showEmbedPDFReport(Configuration.get().report + '/departemen/laporanDepartemen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmDepartemen_laporanCetak');
        });
            // let cetak = Configuration.get().report + '/departemen/laporanDepartemen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
    }
    
    tutupLaporan() {
        this.laporan = false;
    }
}

class InisialDepartemen implements Departemen {

    constructor(
        public kode?,
        public kodeDepartemen?,
        public namaDepartemen?,
        public reportDisplay?,
        public kdJenisPerawatan?,
        public fixedPhone?,
        public mobilePhone?,
        public faksimile?,
        public alamatEmail?,
        public website?,
        public kdPegawaiKepala?,
        public prefixNoAntrian?,
        public kdDepartemenHead?,
        public isProfitCostCenter?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public id?,
        public departemen?,
        ) { }

}

