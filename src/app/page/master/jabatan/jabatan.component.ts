import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Jabatan } from './jabatan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
    selector: 'app-jabatan',
    templateUrl: './jabatan.component.html',
    styleUrls: ['./jabatan.component.scss'],
    providers: [ConfirmationService]
})
export class JabatanComponent implements OnInit {
    item: Jabatan = new InisialJabatan();;
    selected: Jabatan;
    listData: any[];
    dataDummy: {};
    //   kodeGolonganPegawai: Pangkat[];
    jenisJabatan: Jabatan[];
    pencarian: string;
    versi: any;
    items: any;
    page: number;
    rows: number;
    report: any;
    toReport: any;
    formAktif: boolean;
    form: FormGroup;
    totalRecords: number;
    kdprof: any;
    kddept: any;
    codes: any[];
    laporan: boolean = false;
    smbrFile:any;

    listJabatanHead: any[];
    
    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    }


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
        }

        ];

        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
            'kdJabatanHead': new FormControl(null),
            'namaJabatan': new FormControl('', Validators.required),
            'kode': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'noUrut': new FormControl('', Validators.required),
                // 'levelJabatan': new FormControl('', Validators.required),
                'reportDisplay': new FormControl('', Validators.required),
                'statusEnabled': new FormControl(true, Validators.required),
                
            });
            // this.form.get('noUrut').disable();
            this.getSmbrFile();
            // this.form.get('noUrut').disable();
        }
        getSmbrFile(){
            this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
                this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
            });
        }

        downloadExcel() {
            this.httpService.get(Configuration.get().dataMasterNew + '/jabatan/findAll?page=' + this.page + '&rows=' + this.rows + '&dir=namaJabatan&sort=desc').subscribe(table => {
                this.listData = table.Jabatan;
                this.codes = [];
                
                for (let i = 0; i < this.listData.length; i++) {
                    // if (this.listData[i].statusEnabled == true){
                        this.codes.push({

                            kode: this.listData[i].kode.kode,
                            namaJabatan: this.listData[i].namaJabatan,
                            noUrut: this.listData[i].noUrut,
                            reportDisplay: this.listData[i].reportDisplay,
                            kodeExternal: this.listData[i].kodeExternal,
                            namaExternal: this.listData[i].namaExternal,
                            statusEnabled: this.listData[i].statusEnabled

                        })
                    // }
                }
                this.fileService.exportAsExcelFile(this.codes, 'Jabatan');
                // debugger;
            });
            
        }
        
        valuechange(newValue) {
            //	this.toReport = newValue;
            this.report = newValue;
        }
        
        
        downloadPdf() {

            let cetak = Configuration.get().report + '/jabatan/laporanJabatan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=true';
            window.open(cetak);
            
            //     var col = ["Kode", "Nama", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
            //     this.httpService.get(Configuration.get().dataMasterNew + '/jabatan/findAll?').subscribe(table => {
            //      this.listData = table.Jabatan;
            //      this.codes = [];
            
            //      for (let i = 0; i < this.listData.length; i++) {
            //     // if (this.listData[i].statusEnabled == true){
            //         this.codes.push({

            //             kode: this.listData[i].kode.kode,
            //             namaJabatan: this.listData[i].namaJabatan,
            //             noUrut: this.listData[i].noUrut,
            //             reportDisplay: this.listData[i].reportDisplay,
            //             kodeExternal: this.listData[i].kodeExternal,
            //             namaExternal: this.listData[i].namaExternal,
            //             statusEnabled: this.listData[i].statusEnabled
            
            //         })
            //     // }
            // }
            // this.fileService.exportAsPdfFile("Master Jabatan", col, this.codes, "Jabatan");
            
            // });
            
        }
        cari() {
            this.httpService.get(Configuration.get().dataMasterNew + '/jabatan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaJabatan&sort=desc&namaJabatan=' + this.pencarian).subscribe(table => {
                this.listData = table.Jabatan;
            });
        }
        get(page: number, rows: number, search: any) {
            this.httpService.get(Configuration.get().dataMasterNew + '/jabatan/findAll?page=' + page + '&rows=' + rows + '&dir=noUrut&sort=asc').subscribe(table => {
                this.listData = table.Jabatan;
                this.totalRecords = table.totalRow;
                this.setNoUrut(this.totalRecords)                
            });

            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jabatan&select=namaJabatan,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
                this.listJabatanHead = [];
                this.listJabatanHead.push({ label: '--Pilih Data Parent Jabatan--', value: null })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.listJabatanHead.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id_kode })
                };              
            });                            
        }
        
        setNoUrut(totalRecords: number){
            let totalData = [];
            if (totalRecords <1){
                this.form.get('noUrut').setValue(1)
            }
            else{
                this.httpService.get(Configuration.get().dataMasterNew + '/jabatan/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc').subscribe(table => {
                    totalData = table.Jabatan;
                    let ind = totalData.length - 1;     
                    if (ind == -1){
                        this.form.get('noUrut').setValue(1)
                    }
                    else {
                        let noLast = totalData[ind].noUrut + 1;
                        this.form.get('noUrut').setValue(noLast);
                    }
                });
            }
        }
        
        confirmDelete() {
            let kode = this.form.get('kode').value;
            if (kode == null || kode == undefined || kode == "") {
                this.alertService.warn('Peringatan', 'Pilih Daftar Master Jabatan');
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
        loadPage(event: LazyLoadEvent) {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
            this.page = (event.rows + event.first) / event.rows;
            this.rows = event.rows;
        }
        update() {
            let statusEnabled = this.form.get('statusEnabled').value;
            let noUrut = this.form.get('noUrut').value;
            
            if (noUrut == 0 && statusEnabled == true){
                this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
            }
            else if (noUrut != 0 && statusEnabled == false){
                this.form.get('noUrut').setValue(0)
                this.httpService.update(Configuration.get().dataMasterNew + '/jabatan/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.get(this.page, this.rows, this.pencarian);
                    this.reset();
                });
            }
            else {

                this.httpService.update(Configuration.get().dataMasterNew + '/jabatan/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
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
        simpan() {
            if (this.formAktif == false) {
                this.confirmUpdate()
            }
            //  else if (this.form.get('noUrut').value > this.totalRecords + 1) {
            //     let nomorUrut = this.totalRecords + 1
            //     this.alertService.warn("Peringatan", "Nomor Urut Tidak Boleh Lebih Dari " + nomorUrut )
            // } 
            else {

                // this.form.get('noUrut').enable();
                this.httpService.post(Configuration.get().dataMasterNew + '/jabatan/save', this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Disimpan');
                    this.get(this.page, this.rows, this.pencarian);
                    this.reset();
                });
            }
        }
        
        
        reset() {
            this.formAktif = true;
            // this.form.get('noUrut').disable();
            this.ngOnInit();

        }
        onRowSelect(event) {
            let cloned = this.clone(event.data);
            this.formAktif = false;
            this.form.setValue(cloned);
            // this.form.get('noUrut').enable();
            
        }
        clone(hub: any) {
            let fixHub = {
                "kode": hub.kode.kode,
                "kdJabatanHead": hub.kdJabatanHead,
                "namaJabatan": hub.namaJabatan,
                "noUrut": hub.noUrut,
                // "levelJabatan": hub.levelJabatan,
                "reportDisplay": hub.reportDisplay,
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
            this.httpService.delete(Configuration.get().dataMasterNew + '/jabatan/del/' + deleteItem.kode.kode).subscribe(response => {
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
        cetak() {
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/jabatan/laporanJabatan.pdf?kdDepartemen=' + this.kddept + '&kdProfile=' + this.kdprof +'&gambarLogo=' + this.smbrFile + '&download=false', 'frmJabatan_laporanCetak');
            
            // let b = Configuration.get().report + '/asal/laporanAsal.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
            // let cetak = Configuration.get().report + '/jabatan/laporanJabatan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
            // window.open(cetak);
        }
        tutupLaporan() {
            this.laporan = false;
        }
    }
    
    class InisialJabatan implements Jabatan {

        constructor(
            public id?,
            public kodeJabatan?,
            public kode?,
            public kdPangkat?,
            public namaJabatan?,
            public noUrut?,
            public kodeExternal?,
            public ruang?,
            public reportDisplay?,
            public KodeExternal?,
            public namaExternal?,
            public statusEnabled?,
            public namaGolonganPegawai?,
            public kdPangkatHead?,
            public version?,
            public jenisJabatan?,
            public levelJabatan?,
            
            ) { }
        
    }