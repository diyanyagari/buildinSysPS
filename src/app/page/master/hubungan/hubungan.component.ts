import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Hubungan } from './hubungan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
  selector: 'app-hubungan',
  templateUrl: './hubungan.component.html',
  styleUrls: ['./hubungan.component.scss'],
  providers: [ConfirmationService]

})
export class HubunganComponent implements OnInit {

    parentHubungan: any[];
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
    report: any;
    toReport: any;
    listTab: any[];
    index: number = 0;
    tabIndex: number = 0;
    items:any;
    listData2:any[];
    codes:any[];
    laporan: boolean = false;
    kdprof: any;
    kddept: any;
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
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }

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

        // this.itemsChild = [
        //     {
        //         label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
        //             this.downloadPdfChild();
        //         }
        //     },
        //     {
        //         label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
        //             this.downloadExcelChild();
        //         }
        //     },
        //     ];
        
        this.formAktif = true;
        this.form = this.fb.group({
            'kode': new FormControl(''),
            'namaHubungan': new FormControl('', Validators.required),
            'kdHubunganHead': new FormControl(null),
            'noUrut': new FormControl(''),
            'reportDisplay': new FormControl('', Validators.required),
            'namaExternal': new FormControl(''),
            'kodeExternal': new FormControl(''),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        //edit100com
        // this.form.get('noUrut').disable();

        // if (this.index == 0){
        //     this.httpService.get(Configuration.get().dataMasterNew + '/hubungan/findAll?page=1&rows=300&dir=namaHubungan&sort=desc').subscribe(table => {
        //         this.listTab = table.Hubungan;
        //         let i = this.listTab.length
        //         while (i--) {
        //             if (this.listTab[i].statusEnabled == false) { 
        //                 this.listTab.splice(i, 1);
        //             } 
        //         }
        //     });
        // };
        // let dataIndex = {
        //     "index": this.index
        // }
        // this.onTabChange(dataIndex);
        this.pencarian=''
        this.get(this.page,this.rows,this.pencarian);

        //hubungan Head
        this.httpService.get(Configuration.get().dataMasterNew + '/hubungan/findAllHubunganHead').subscribe(table => {
			this.parentHubungan = [];
            this.parentHubungan.push({ label: '-- Pilih --', value: null });
            this.parentHubungan.push({label:'default', value: null});
			for (var i = 0; i < table.hubunganHead.length; i++) {
				this.parentHubungan.push(
					{
						label: table.hubunganHead[i].namaHubungan,
						value: table.hubunganHead[i].kode.kode,
					}
				)
			}
        });
        
        this.getSmbrFile();

    }

    getSmbrFile(){
      this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
       this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
   });
  }


    // onTabChange(event) {
    //     let data;
    //     this.index = event.index;
    //     if (event.index > 0){
    //         let index = event.index-1;
    //         data = this.listTab[index].kode.kode;
    //         this.kdHead = data;
    //         this.form.get('kdHubunganHead').setValue(data);
    //     } else {
    //         data = '';
    //         this.form.get('kdHubunganHead').setValue(null);
    //     }
    //     this.pencarian = '';
    //     this.get(this.page,this.rows,this.pencarian, data);
    //     this.valuechange('');
    //     this.formAktif = true;
    //     this.form.get('noUrut').disable();
    // }
    valuechange(newValue) {
        this.toReport = newValue;
        this.report = newValue;
    }

    get(page: number, rows: number, search: any) {
    // get(page: number, rows: number, search: any, head: any) {
     this.httpService.get(Configuration.get().dataMasterNew + '/hubungan/findAllHubungan?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaHubungan='+search).subscribe(table => {

        // this.httpService.get(Configuration.get().dataMasterNew + '/hubungan/findAll?page='+page+'&rows='+rows+'&dir=namaHubungan&sort=desc&namaHubungan='+search+'&kdHubunganHead='+head).subscribe(table => {
            this.listData = table.Hubungan;
            this.totalRecords = table.totalRow;
            //edit100com
            // this.form.get('noUrut').setValue(this.totalRecords+1);
            //edit99
            this.setNoUrut(this.totalRecords)   
        });
 }

   //edit99
   setNoUrut(totalRecords: number){
    let totalData = [];
    if (totalRecords <1){
        this.form.get('noUrut').setValue(1)
    }
    else{
        this.httpService.get(Configuration.get().dataMasterNew + '/hubungan/findAllHubungan?rows='+totalRecords+'&dir=noUrut&sort=asc').subscribe(table => {
            totalData = table.Hubungan;
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
        // let data = this.form.get('kdHubunganHead').value;
        // if (data == null) {
            this.get(this.page,this.rows,this.pencarian);
            // this.get(this.page,this.rows,this.pencarian, '');
        // } else {
            // this.get(this.page,this.rows,this.pencarian, data);
        // }

    }

    loadPage(event: LazyLoadEvent) {
        // let data = this.form.get('kdHubunganHead').value;
        // if (data == null) {
            this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
            // this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
        // } else {
            // this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
        // }
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Hubungan');
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

        //edit99        
        let statusEnabled = this.form.get('statusEnabled').value;
        let noUrut = this.form.get('noUrut').value;
        if (noUrut == 0 && statusEnabled == true){
            this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
        }
        else if (noUrut != 0 && statusEnabled == false){
            this.form.get('noUrut').setValue(0)
            this.httpService.update(Configuration.get().dataMasterNew + '/hubungan/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
        else {
            this.httpService.update(Configuration.get().dataMasterNew + '/hubungan/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }

        // this.httpService.update(Configuration.get().dataMasterNew + '/hubungan/update/' + this.versi, this.form.value).subscribe(response => {
        //     this.alertService.success('Berhasil', 'Data Diperbarui');
        //     this.reset();
        // });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.form.get('noUrut').enable();
            this.httpService.post(Configuration.get().dataMasterNew + '/hubungan/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.reset();
            });
        }

    }

    reset() {
        //edit100com
        // this.form.get('noUrut').disable();
        this.formAktif = true;
        this.ngOnInit();
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        //edit100com
        // this.form.get('noUrut').enable();
    }

    clone(cloned: Hubungan): Hubungan {
        let hub = new InisialHubungan();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialHubungan();
        fixHub = {
            'kode': hub.kode.kode,
            'namaHubungan': hub.namaHubungan,
            'kdHubunganHead': hub.kdHubunganHead,
            'noUrut': hub.noUrut,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/hubungan/del/' + deleteItem.kode.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
        
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }

    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/hubungan/findAll?').subscribe(table => {
            this.listData2 = table.Hubungan;
            this.codes = [];

            for (let i = 0; i < this.listData2.length; i++) {
                this.codes.push({

                    kode: this.listData2[i].kode.kode,
                    namaHubungan: this.listData2[i].namaHubungan,
                    noUrut: this.listData2[i].noUrut,
                    reportDisplay: this.listData2[i].reportDisplay,
                    kodeExternal: this.listData2[i].kodeExternal,
                    namaExternal: this.listData2[i].namaExternal,
                    statusEnabled: this.listData2[i].statusEnabled,

                })

            }
            this.fileService.exportAsExcelFile(this.codes, 'Hubungan');
        });

    }
    
    
    downloadPdf(){
        let b = Configuration.get().report + '/hubungan/laporanHubungan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

        window.open(b);
    }
    tutupLaporan() {
        this.laporan = false;
    }

    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/hubungan/laporanHubungan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmHubungan_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/hubungan/laporanHubungan.pdf?kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
    }

    cetakChild(){
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/hubunganChild/laporanHubunganChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdHubunganHead='+ this.kdHead +'&download=false', 'frmHubungan_laporanCetak');
    }
    
    downloadPdfChild(){
        let b = Configuration.get().report + '/hubunganChild/laporanHubunganChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdHubunganHead='+ this.kdHead +'&download=true';
        window.open(b);
    }
    
    downloadExcelChild(){

    }









}

class InisialHubungan implements Hubungan {

    constructor(

        public noUrut?,
        public kdHubunganHead?,
        public namaHubungan?,

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

