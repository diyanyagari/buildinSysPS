import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Pendidikan } from './pendidikan.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
    selector: 'app-pendidikan',
    templateUrl: './pendidikan.component.html',
    styleUrls: ['./pendidikan.component.scss'],
    providers: [ConfirmationService]
})
export class PendidikanComponent implements OnInit {
    item: Pendidikan = new InisialPendidikan();;
    selected: Pendidikan;
    listData: any[];
    dataDummy: {};
    items: any;
    page: number;
    rows: number;
    listPendidikan: Pendidikan[];
    pencarian: string;
    versi: any;
    report: any;
    toReport: any;
    formAktif: boolean;
    form: FormGroup;
    totalRecords: number;

    codes:any[];
    listData2:any[];
    kdprof:any;
    kddept:any;
    laporan: boolean = false;
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
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.get(this.page, this.rows, '');
        this.getParentPendidikan();
        this.form = this.fb.group({

            'namaPendidikan': new FormControl('', Validators.required),
            'kode': new FormControl(''),
            'kdPendidikanHead': new FormControl(null),
            'kodeExternal': new FormControl(''),
            'namaExternal': new FormControl(''),
            'noUrut': new FormControl(null),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(true, Validators.required),
        });
        // this.form.get('noUrut').disable();
        this.getSmbrFile();

    }
    getSmbrFile(){
      this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
         this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
     });
  }

  downloadExcel() {
    this.httpService.get(Configuration.get().dataMasterNew + '/pendidikan/findAll?').subscribe(table => {
     this.listData2 = table.Pendidikan;
     this.codes = [];

     for (let i = 0; i<this.listData2.length; i++){
        this.codes.push({
          kode: this.listData2[i].kode.kode,
          namaPendidikanHead: this.listData2[i].namaPendidikanHead,
          namaPendidikan: this.listData2[i].namaPendidikan,
          noUrut: this.listData2[i].noUrut,
          reportDisplay: this.listData2[i].reportDisplay,
          kodeExternal: this.listData2[i].kodeExternal,
          namaExternal: this.listData2[i].namaExternal,
          statusEnabled: this.listData2[i].statusEnabled
      })
    }

    this.fileService.exportAsExcelFile(this.codes, 'Pendidikan');

});

}
valuechange(newValue) {
        //	this.toReport = newValue;
        this.report = newValue;
    }

    downloadPdf() {

        let cetak = Configuration.get().report + '/pendidikan/laporanPendidikan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        window.open(cetak);

        // var col = ["Kode", "Parent", "Nama ", "Nomor Urut", "Tampilan Laporan", "Kode External", "Nama External", "Status Aktif"];
        // this.httpService.get(Configuration.get().dataMasterNew + '/pendidikan/findAll?').subscribe(table => {
        //     this.listData2 = table.Pendidikan;
        //     this.codes = [];

        //     for (let i = 0; i<this.listData2.length; i++){
        //         this.codes.push({
        //           kode: this.listData2[i].kode.kode,
        //           namaPendidikanHead: this.listData2[i].namaPendidikanHead,
        //           namaPendidikan: this.listData2[i].namaPendidikan,
        //           noUrut: this.listData2[i].noUrut,
        //           reportDisplay: this.listData2[i].reportDisplay,
        //           kodeExternal: this.listData2[i].kodeExternal,
        //           namaExternal: this.listData2[i].namaExternal,
        //           statusEnabled: this.listData2[i].statusEnabled
        //       })
        //     }

        //     this.fileService.exportAsPdfFile("Master Pendidikan", col, this.codes, "Pendidikan");

        // });

    }
    cari(page, rows) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pendidikan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=noUrut&sort=asc&namaPendidikan=' + this.pencarian).subscribe(table => {
            this.listData = table.Pendidikan;

        });
    }
    getParentPendidikan() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pendidikan&select=namaPendidikan,id').subscribe(
            res => {
                this.listPendidikan = [];
                this.listPendidikan.push({ label: '--Pilih Data Parent Pendidikan--', value: null })
                for (var i = 0; i < res.data.data.length; i++) {
                    this.listPendidikan.push({ label: res.data.data[i].namaPendidikan, value: res.data.data[i].id.kode })
                };
            }, error => {
                this.listPendidikan = [];
                this.listPendidikan.push({label:'-- '+ error +' --', value:''})
            }
            );
    }
    get(page: number, rows: number, seacrh: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/pendidikan/findAll?page=' + page + '&rows=' + rows + '&dir=noUrut&sort=asc').subscribe(table => {
            this.listData = table.Pendidikan;
            this.totalRecords = table.totalRow;
            this.setNoUrut(this.totalRecords);
        });
    }
    setNoUrut(totalRecords: number){
        let totalData = [];
        if (totalRecords <1){
            this.form.get('noUrut').setValue(1)
        }
        else{
            this.httpService.get(Configuration.get().dataMasterNew + '/pendidikan/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc').subscribe(table => {
                totalData = table.Pendidikan;
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
    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian)
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Pendidikan');
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
        let statusEnabled = this.form.get('statusEnabled').value;
        let noUrut = this.form.get('noUrut').value;
        if (noUrut == 0 && statusEnabled == true){
            this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
        }
        else if (noUrut != 0 && statusEnabled == false){
            this.form.get('noUrut').setValue(0)
            this.httpService.update(Configuration.get().dataMasterNew + '/pendidikan/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
                this.get(this.page, this.rows, this.pencarian);
                this.reset();
            });
        }
        else {
            this.httpService.update(Configuration.get().dataMasterNew + '/pendidikan/update/' + this.versi, this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
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
        } else {
            // let noUrut = this.totalRecords + 1;
            // this.form.get('noUrut').enable();
            // this.form.get('noUrut').setValue(noUrut);
            this.httpService.post(Configuration.get().dataMasterNew + '/pendidikan/save?', this.form.value).subscribe(response => {
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
        this.form.get('noUrut').enable();
    }
    clone(cloned: Pendidikan): Pendidikan {
        let hub = new InisialPendidikan();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialPendidikan();
        fixHub = {

            "kode": hub.kode.kode,
            "kdPendidikanHead": hub.kdPendidikanHead,
            "namaPendidikan": hub.namaPendidikan,
            "noUrut": hub.noUrut,
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
        this.httpService.delete(Configuration.get().dataMasterNew + '/pendidikan/del/' + deleteItem.kode.kode).subscribe(response => {
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
    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/pendidikan/laporanPendidikan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPendidikan_laporanCetak');

        // let cetak = Configuration.get().report + '/pendidikan/laporanPendidikan.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(cetak);
    }
}

class InisialPendidikan implements Pendidikan {

    constructor(
        public id?,
        public kode?,
        public NoUrut?,
        public noUrut?,
        public namaPendidikan?,
        public kodePendidikan?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
        public Version?,
        public kdPendidikanHead?,

        ) { }

}