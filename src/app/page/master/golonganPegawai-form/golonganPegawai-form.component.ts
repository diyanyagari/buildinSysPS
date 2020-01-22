import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { GolonganPegawai } from './golonganPegawai-form.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, Configuration, AlertService, InfoService, AuthGuard, ReportService } from '../../../global';

@Component({
    selector: 'app-golonganPegawai-form',
    templateUrl: './golonganPegawai-form.component.html',
    styleUrls: ['./golonganPegawai-form.component.scss'],
    providers: [ConfirmationService]
})
export class GolonganPegawaiFormComponent implements OnInit {
    selected: GolonganPegawai;
    listData: GolonganPegawai[];
    pencarian: string;
    dataDummy: {};
    formAktif: boolean;
    page: number;
    rows: number;
    versi: any;
    form: FormGroup;
    report: any;
    toReport: any;
    totalRecords: number;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    kdprof:any;
    kddept:any;
    items: MenuItem[];
    codes: GolonganPegawai[];
    laporan: boolean = false;
    itemsChild: any;
    kdHead: any;
    smbrFile:any;
    
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
            
            this.itemsChild = [
                {
                    label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
                        this.downloadPdfChild();
                    }
                },
                {
                    label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
                        this.downloadExcelChild();
                    }
                },
            ];
            if (this.page == undefined || this.rows == undefined) {
                this.page = Configuration.get().page;
                this.rows = Configuration.get().rows;
            }
            this.formAktif = true;
            this.form = this.fb.group({
                'kdGolonganPegawaiHead': new FormControl(null),
                'kode': new FormControl(''),
                'namaExternal': new FormControl(''),
                'kodeExternal': new FormControl(''),
                'namaGolonganPegawai': new FormControl('', Validators.required),
                'noUrut': new FormControl(''),
                'reportDisplay': new FormControl('', Validators.required),
                'statusEnabled': new FormControl(true, Validators.required),
            });
            // this.form.get('noUrut').disable();
            if (this.index == 0){
                this.httpService.get(Configuration.get().dataMasterNew + '/golonganpegawai/findAll?page=1&rows=300&dir=namaGolonganPegawai&sort=desc').subscribe(table => {
                    this.listTab = table.GolonganPegawai;
                    let i = this.listTab.length
                    while (i--) {
                        if (this.listTab[i].statusEnabled == false) { 
                            this.listTab.splice(i, 1);
                        } 
                    }
                });
            };
            
            let dataIndex = {
                "index": this.index
            }
            this.onTabChange(dataIndex);
            this.getSmbrFile();
        }
        getSmbrFile(){
            this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
                this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
            });
        }
        onTabChange(event) {
            this.form = this.fb.group({
                'kdGolonganPegawaiHead': new FormControl(null),
                'kode': new FormControl(''),
                'namaExternal': new FormControl(''),
                'kodeExternal': new FormControl(''),
                'namaGolonganPegawai': new FormControl('', Validators.required),
                'noUrut': new FormControl(''),
                'reportDisplay': new FormControl('', Validators.required),
                'statusEnabled': new FormControl(true, Validators.required),
            });
            // this.form.get('noUrut').disable();
            let data;
            this.index = event.index;
            if (event.index > 0){
                let index = event.index-1;
                data = this.listTab[index].kode.kode;
                this.kdHead = data;
                this.form.get('kdGolonganPegawaiHead').setValue(data);
            } else {
                data = '';
                this.form = this.fb.group({
                    'kdGolonganPegawaiHead': new FormControl(null),
                    'kode': new FormControl(''),
                    'namaExternal': new FormControl(''),
                    'kodeExternal': new FormControl(''),
                    'namaGolonganPegawai': new FormControl('', Validators.required),
                    'noUrut': new FormControl(''),
                    'reportDisplay': new FormControl('', Validators.required),
                    'statusEnabled': new FormControl(true, Validators.required),
                });
                this.form.get('kdGolonganPegawaiHead').setValue(null);
            }
            this.pencarian = '';
            this.get(this.page,this.rows,this.pencarian, data);
            this.valuechange('');
            this.formAktif = true;
        }
        downloadExcel() {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=id.kode,namaGolonganPegawai').subscribe(table => {
                
                this.fileService.exportAsExcelFile(table.data.data, 'Golongan Pegawai');
                
            });
            
        }
        
        valuechange(newValue) {
            this.toReport = newValue;
            this.report = newValue;
        }
        
        
        downloadPdf() {
            let cetak = Configuration.get().report + '/golonganPegawai/laporanGolonganPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
            window.open(cetak);
            // var col = ["Kode", "Nama Golongan Pegawai"];
            // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=GolonganPegawai&select=id.kode,namaGolonganPegawai').subscribe(table => {
            //     this.fileService.exportAsPdfFile("Master Golongan Pegawai", col, table.data.data, "Golongan Pegawai");
            
            // });
            
        }
        get(page: number, rows: number, search: any, head: any) {
            this.httpService.get(Configuration.get().dataMasterNew + '/golonganpegawai/findAll?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaGolonganPegawai='+search+'&kdGolonganPegawaiHead='+head).subscribe(table => {
                this.listData = table.GolonganPegawai;
                this.totalRecords = table.totalRow;
                this.setNoUrut(this.totalRecords,head)
            });
        }

        setNoUrut(totalRecords: number,head:any){
            let totalData = [];
            if (totalRecords <1){
                this.form.get('noUrut').setValue(1)
            }
            else{
                this.httpService.get(Configuration.get().dataMasterNew + '/golonganpegawai/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc&kdGolonganPegawaiHead='+head).subscribe(table => {
                    totalData = table.GolonganPegawai;
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
        
        cari() {
            let data = this.form.get('kdGolonganPegawaiHead').value;
            if (data == null) {
                this.get(this.page,this.rows,this.pencarian, '');
            } else {
                this.get(this.page,this.rows,this.pencarian, data);
            }
            
        }
        
        loadPage(event: LazyLoadEvent) {
            let data = this.form.get('kdGolonganPegawaiHead').value;
            if (data == null) {
                this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
            } else {
                this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
            }
            this.page = (event.rows + event.first) / event.rows;
            this.rows = event.rows;
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
                this.alertService.warn('Peringatan', 'Pilih Daftar Master Golongan Pegawai');
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
            let statusEnabled = this.form.get('statusEnabled').value;
            let noUrut = this.form.get('noUrut').value;
            
            if (noUrut == 0 && statusEnabled == true){
                this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
            }
            else if (noUrut != 0 && statusEnabled == false){
                this.form.get('noUrut').setValue(0)
                this.httpService.update(Configuration.get().dataMasterNew + '/golonganpegawai/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.reset();
                });
            }
            else {
                
                this.httpService.update(Configuration.get().dataMasterNew + '/golonganpegawai/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.reset();
                });
            }
        }
        simpan() {
            if (this.formAktif == false) {
                this.confirmUpdate()
            } 
            // else if ( this.form.get('noUrut').value > this.totalRecords + 1) {
            //     let nomorUrut = this.totalRecords + 1
            //     this.alertService.warn("Peringatan", "Nomor Urut Tidak Boleh Lebih Dari " + nomorUrut )
            // } 
            else {
                // this.form.get('noUrut').enable();
                console.log(this.form.value)
                this.httpService.post(Configuration.get().dataMasterNew + '/golonganpegawai/save?', this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Disimpan');
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
            // this.form.get('noUrut').enable();
        }
        clone(cloned: GolonganPegawai): GolonganPegawai {
            let hub = new InisialGolonganPegawai();
            for (let prop in cloned) {
                hub[prop] = cloned[prop];
            }
            let fixHub = new InisialGolonganPegawai();
            fixHub = {
                "kdGolonganPegawaiHead": hub.kdGolonganPegawaiHead,
                "kode": hub.kode.kode,
                "kodeExternal": hub.kodeExternal,
                "namaExternal": hub.namaExternal,
                "namaGolonganPegawai": hub.namaGolonganPegawai,
                "reportDisplay": hub.reportDisplay,
                "noUrut": hub.noUrut,
                "statusEnabled": hub.statusEnabled
                
            }
            this.versi = hub.version;
            return fixHub;
        }
        hapus() {
            let item = [...this.listData];
            let deleteItem = item[this.findSelectedIndex()];
            this.httpService.delete(Configuration.get().dataMasterNew + '/golonganpegawai/del/' + deleteItem.kode.kode).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Dihapus');
                this.reset();
            });
            
        }
        
        findSelectedIndex(): number {
            return this.listData.indexOf(this.selected);
        }
        onDestroy() {
            
        }
        cetakGolongan(){
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/golonganPegawai/laporanGolonganPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmGolonganPegawai_laporanCetak');
            
            // let cetak = Configuration.get().report + '/golonganPegawai/laporanGolonganPegawai.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
            // window.open(cetak);
        }
        tutupLaporan() {
            this.laporan = false;
        }
        
        cetakChild(){
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/golonganPegawaiChild/laporanGolonganPegawaiChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&gambarLogo=' + this.smbrFile +'&kdGolonganPegawaiHead='+ this.kdHead +'&download=false', 'frmGolonganPegawai_laporanCetak');
        }
        
        downloadPdfChild(){
            let b = Configuration.get().report + '/golonganPegawaiChild/laporanGolonganPegawaiChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdGolonganPegawaiHead='+ this.kdHead +'&download=true';
            window.open(b);
        }
        
        downloadExcelChild(){
            
        }
        
    }
    
    class InisialGolonganPegawai implements GolonganPegawai {
        constructor(
            public id?,
            public kdProfile?,
            public kode?,
            public kodeGolonganPegawai?,
            public namaGolonganPegawai?,
            public reportDisplay?,
            public kodeExternal?,
            public namaExternal?,
            public statusEnabled?,
            public noRec?,
            public label?,
            public version?,
            public Version?,
            public noUrut?,
            public NoUrut?,
            public KodeExternal?,
            public NamaExternal?,
            public kdGolonganPegawaiHead?
        )
        { }
    }
    