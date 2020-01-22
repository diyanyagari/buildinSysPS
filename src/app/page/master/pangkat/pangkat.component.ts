import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Pangkat } from './pangkat.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-pangkat',
    templateUrl: './pangkat.component.html',
    styleUrls: ['./pangkat.component.scss'],
    providers: [ConfirmationService]
})
export class PangkatComponent implements OnInit {
    selected: Pangkat;
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    pencarian: string;
    kodeGolonganPegawai: Pangkat[];
    versi: any;
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    kdprof:any;
    kddept:any;
    codes: any[];
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
            this.versi = null;
            this.form = this.fb.group({
                'kdPangkatHead': new FormControl(null),
                'noUrut': new FormControl(null),
                'kode': new FormControl(''),
                'namaExternal': new FormControl(''),
                'kodeExternal': new FormControl(''),
                'namaPangkat': new FormControl('', Validators.required),
                'ruang': new FormControl(''),
                'reportDisplay': new FormControl('', Validators.required),
                'statusEnabled': new FormControl(true, Validators.required),
            });
            // this.form.get('noUrut').disable();
            if (this.index == 0){
                this.httpService.get(Configuration.get().dataMasterNew + '/pangkat/findAll?page=1&rows=300&dir=namaPangkat&sort=desc').subscribe(table => {
                    this.listTab = table.Pangkat;
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
                'kdPangkatHead': new FormControl(null),
                'noUrut': new FormControl(null),
                'kode': new FormControl(''),
                'namaExternal': new FormControl(''),
                'kodeExternal': new FormControl(''),
                'namaPangkat': new FormControl('', Validators.required),
                'ruang': new FormControl(''),
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
                this.form.get('kdPangkatHead').setValue(data);
            } else {
                data = '';
                this.form.get('kdPangkatHead').setValue(null);
            }
            this.pencarian = '';
            this.get(this.page,this.rows,this.pencarian, data);
            this.valuechange('');
            this.formAktif = true;
        }
        valuechange(newValue) {
            this.toReport = newValue;
            this.report = newValue;
        }
        downloadExcel() {
            this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=id.kode,namaPangkat').subscribe(table => {
                
                this.fileService.exportAsExcelFile(table.data.data, 'Pangkat');
            });
            
        }
        
        downloadPdf() {
            let cetak = Configuration.get().report + '/pangkat/laporanPangkat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
            window.open(cetak);
            // var col = ["Kode Pangkat", "Nama Pangkat"];
            // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pangkat&select=id.kode,namaPangkat').subscribe(table => {
            //     this.fileService.exportAsPdfFile("Master Pangkat", col, table.data.data, "Pangkat");
            
            // });
            
        }
        
        get(page: number, rows: number, search: any, head: any) {
            this.httpService.get(Configuration.get().dataMasterNew + '/pangkat/findAll?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaPangkat='+search+'&kdPangkatHead='+head).subscribe(table => {
                this.listData = table.Pangkat;
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
                this.httpService.get(Configuration.get().dataMasterNew + '/pangkat/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc&kdPangkatHead='+head).subscribe(table => {
                    totalData = table.Pangkat;
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
            let data = this.form.get('kdPangkatHead').value;
            if (data == null) {
                this.get(this.page,this.rows,this.pencarian, '');
            } else {
                this.get(this.page,this.rows,this.pencarian, data);
            }
            
        }
        
        loadPage(event: LazyLoadEvent) {
            let data = this.form.get('kdPangkatHead').value;
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
                this.alertService.warn('Peringatan', 'Pilih Daftar Master Pangkat');
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
                this.httpService.update(Configuration.get().dataMasterNew + '/pangkat/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.reset();
                });
            }
            else {
                
                this.httpService.update(Configuration.get().dataMasterNew + '/pangkat/update/' + this.versi, this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Diperbarui');
                    this.reset();
                });
            }
            
        }
        
        simpan() {
            if (this.formAktif == false) {
                this.confirmUpdate()
                // }
                // else if ( this.form.get('noUrut').value > this.totalRecords + 1) {
                //     let nomorUrut = this.totalRecords + 1
                //     this.alertService.warn("Peringatan", "Nomor Urut Tidak Boleh Lebih Dari " + nomorUrut )
            } else {
                // this.form.get('noUrut').enable();
                this.httpService.post(Configuration.get().dataMasterNew + '/pangkat/save', this.form.value).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Disimpan');
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
        clone(cloned: Pangkat): Pangkat {
            let hub = new InisialPangkat();
            for (let prop in cloned) {
                hub[prop] = cloned[prop];
            }
            let fixHub = new InisialPangkat();
            fixHub = {
                "kode": hub.kode.kode,
                "namaPangkat": hub.namaPangkat,
                "noUrut": hub.noUrut,
                "ruang": hub.ruang,
                "reportDisplay": hub.reportDisplay,
                "kodeExternal": hub.kodeExternal,
                "namaExternal": hub.namaExternal,
                "kdPangkatHead": hub.kdPangkatHead,
                "statusEnabled": hub.statusEnabled
            }
            this.versi = hub.version;
            return fixHub;
        }
        hapus() {
            let item = [...this.listData];
            let deleteItem = item[this.findSelectedIndex()];
            this.httpService.delete(Configuration.get().dataMasterNew + '/pangkat/del/' + deleteItem.kode.kode).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Dihapus');
                this.reset();
            });
        }
        
        findSelectedIndex(): number {
            return this.listData.indexOf(this.selected);
        }
        onDestroy() {
            
        }
        tutupLaporan() {
            this.laporan = false;
        }
        cetak() {
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/pangkat/laporanPangkat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPangkat_laporanCetak');
            
            // let cetak = Configuration.get().report + '/pangkat/laporanPangkat.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
            // window.open(cetak);
        }
        
        cetakChild(){
            this.laporan = true;
            this.print.showEmbedPDFReport(Configuration.get().report + '/pangkatChild/laporanPangkatChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdPangkatHead='+ this.kdHead +'&download=false', 'frmPangkat_laporanCetak');
        }
        
        downloadPdfChild(){
            let b = Configuration.get().report + '/pangkatChild/laporanPangkatChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdPangkatHead='+ this.kdHead +'&download=true';
            window.open(b);
        }
        
        downloadExcelChild(){
            
        }
        
        
        
    }
    
    class InisialPangkat implements Pangkat {
        
        constructor(
            public pangkat?,
            public id?,
            public kdProfile?,
            public kode?,
            public kdPangkat?,
            public namaPangkat?,
            public noUrut?,
            public kdGolonganPegawai?,
            public ruang?,
            public reportDisplay?,
            public kodeExternal?,
            public namaExternal?,
            public statusEnabled?,
            public namaGolonganPegawai?,
            public kdPangkatHead?,
            public version?
        ) { }
        
    }