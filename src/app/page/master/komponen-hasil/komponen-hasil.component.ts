import { ViewChild, Component, OnInit } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'app-komponen-hasil',
    templateUrl: './komponen-hasil.component.html',
    styleUrls: ['./komponen-hasil.component.scss'],
    providers: [ConfirmationService]
})
export class KomponenHasilComponent implements OnInit {
    @ViewChild(DataTable) dataTableComponent: DataTable;
    KomponenHasil: any;
    formAktif: boolean;
    form: FormGroup;
    items: any[];

    // kdProfile: any;
    // kdKomponenHasil: any;
    namaKomponenHasil: any;
    reportDisplay: any;
    kdLevelTingkat: any=[];
    noUrut: any;
    kdDepartemen: any;
    kodeExternal: any;
    namaExternal: any;
    statusEnabled: any;
    noRec: any;

    listData: any=[];

    pencarian: string = '';
    dataSimpan: any;

    page: number;
    totalRecords: number;
    rows: number;
    versi:number;
    listKomponenHasilHead: any[]

    constructor(private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private httpService: HttpClient,
        private alertService: AlertService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.items = [
        {
            label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
            }
        },
        {
            label: 'Excel', icon: 'fa-file-excel-o', command: () => {
            }
        }];

        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;
        this.listData = [];
        this.formAktif = true;
        this.pencarian = '';
        this.form = this.fb.group({
            // 'kdKomponenHasil': new FormControl('',Validators.required),
            'namaKomponenHasil': new FormControl(null,Validators.required),
            'reportDisplay': new FormControl(null,Validators.required),
            'kdLevelTingkat': new FormControl(null),
            'noUrut': new FormControl(null),
            // 'kdDepartemen': new FormControl(''),
            'kodeExternal': new FormControl(null),
            'namaExternal': new FormControl(null),
            'statusEnabled': new FormControl(null, Validators.required),
            'noRec': new FormControl(null),
            // 'kdProfile': new FormControl(''),
            'kode': new FormControl(0),
            'kdkomponenhasilhead': new FormControl(null)
        });
        
        this.getDataGrid(this.page,this.rows,this.pencarian)
        this.getKdLevelTingkat();

        this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=KomponenHasil&select=namaKomponenHasil%2Cid.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
            this.listKomponenHasilHead = [];
            this.listKomponenHasilHead.push({label:'--Pilih Data Parent Komponen Hasil--', value:''})
            for(var i=0;i<res.data.data.length;i++) {
                this.listKomponenHasilHead.push({label:res.data.data[i].namaKomponenHasil, value:res.data.data[i].id_kode})
            };
        },
        error => {
            this.listKomponenHasilHead = [];
            this.listKomponenHasilHead.push({label:'-- '+ error +' --', value:''})
        });
        
    }

    // onSubmit() {
    //     this.simpan();
    // }

    getDataGrid(page: number, rows: number, cari:string) { 
        this.httpService.get(Configuration.get().dataMasterNew + '/komponenhasil/findAll?page='+page+'&rows='+rows+'&dir=noUrut&sort=asc&namaKomponenHasil='+cari).subscribe(table => {
            this.listData = table.KomponenHasil;
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
            this.httpService.get(Configuration.get().dataMasterNew + '/komponenhasil/findAll?rows='+totalRecords+'&dir=noUrut&sort=asc').subscribe(table => {
                totalData = table.KomponenHasil;
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
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;
        this.getDataGrid(this.page,this.rows,this.pencarian)
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

    loadPage(event: LazyLoadEvent) {
        this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    clone(cloned: any){
        let fixHub = {
            // "kdKomponenHasil": cloned.kdKomponenHasil,
            "namaKomponenHasil": cloned.namaKomponenHasil,
            "reportDisplay": cloned.reportDisplay,
            "kdLevelTingkat": cloned.kdLevelTingkat,
            "noUrut":cloned.noUrut,
            // "kdDepartemen": cloned.kdDepartemen,
            "kodeExternal": cloned.kodeExternal,
            "namaExternal": cloned.namaExternal,
            "statusEnabled" : cloned.statusEnabled,
            "noRec": cloned.noRec,
            "kode": cloned.kode.kode,
            "kdkomponenhasilhead": cloned.kdkomponenhasilhead
        }
        this.versi = cloned.version;
        return fixHub;
    }

    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.formAktif = false;
        this.form.setValue(cloned);
        // this.form.get('noUrut').enable();
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
            }
        });
    }

    update() {
        let statusEnabled = this.form.get('statusEnabled').value;
        let noUrut = this.form.get('noUrut').value;

        if (noUrut == 0 && statusEnabled == true){
            this.alertService.warn('Peringatan', 'Nomor Urut Data Aktif Tidak Boleh 0')
        }
        else if ( noUrut!=0 && statusEnabled == false){
            this.form.get('noUrut').setValue(0);
            let dataSimpan = {                
                "kdDepartemen": "",
                "kdLevelTingkat": this.form.get('kdLevelTingkat').value ,
                "kdkomponenhasilhead": this.form.get('kdkomponenhasilhead').value,
                "kode": this.form.get('kode').value ,
                "kodeExternal": this.form.get('kodeExternal').value ,
                "namaExternal": this.form.get('namaExternal').value ,
                "namaKomponenHasil": this.form.get('namaKomponenHasil').value,
                "noRec": "",
                "noUrut": 0,
                "reportDisplay": this.form.get('reportDisplay').value,
                "statusEnabled": this.form.get('statusEnabled').value ,
                "version": 0                  
        }
            this.httpService.update(Configuration.get().dataMasterNew+ '/komponenhasil/update/'+this.versi, dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil','Data Diperbarui');
                this.getDataGrid(this.page,this.rows,this.pencarian)
                this.reset();
            });
        }
        else {
            let dataSimpan = {                
                "kdDepartemen": "",
                "kdLevelTingkat": this.form.get('kdLevelTingkat').value ,
                "kdkomponenhasilhead": this.form.get('kdkomponenhasilhead').value,
                "kode": this.form.get('kode').value ,
                "kodeExternal": this.form.get('kodeExternal').value ,
                "namaExternal": this.form.get('namaExternal').value ,
                "namaKomponenHasil": this.form.get('namaKomponenHasil').value,
                "noRec": "",
                "noUrut": this.form.get('noUrut').value,
                "reportDisplay": this.form.get('reportDisplay').value,
                "statusEnabled": this.form.get('statusEnabled').value ,
                "version": 0                  
        }
            this.httpService.update(Configuration.get().dataMasterNew+ '/komponenhasil/update/'+this.versi,dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil','Data Diperbarui');
                this.getDataGrid(this.page,this.rows,this.pencarian)
                this.reset();
            });
        }
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            let dataSimpan = {                
                    "kdDepartemen": "",
                    "kdLevelTingkat": this.form.get('kdLevelTingkat').value ,
                    "kdkomponenhasilhead": this.form.get('kdkomponenhasilhead').value,
                    "kode": this.form.get('kode').value ,
                    "kodeExternal": this.form.get('kodeExternal').value ,
                    "namaExternal": this.form.get('namaExternal').value ,
                    "namaKomponenHasil": this.form.get('namaKomponenHasil').value,
                    "noRec": "",
                    "noUrut": this.form.get('noUrut').value,
                    "reportDisplay": this.form.get('reportDisplay').value,
                    "statusEnabled": this.form.get('statusEnabled').value ,
                    "version": 0                  
            }
            this.httpService.post(Configuration.get().dataMasterNew + '/komponenhasil/save', dataSimpan).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                this.getDataGrid(this.page,this.rows,this.pencarian)
                this.reset();
            });
        }

    }



    getKdLevelTingkat() {
        this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=LevelTingkat&select=namaLevelTingkat,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
            this.kdLevelTingkat = [];
            this.kdLevelTingkat.push({label:'--Pilih Level Tingkat--', value:''})
            for(var i=0;i<res.data.data.length;i++) {
                this.kdLevelTingkat.push({label:res.data.data[i].namaLevelTingkat, value:res.data.data[i].id_kode})
            };
        },
        error => {
            this.kdLevelTingkat = [];
            this.kdLevelTingkat.push({label:'-- '+ error +' --', value:''})
        });

    }

    onDestroy() {

    }

    reset(){
        this.formAktif = true;
        // this.form.get('noUrut').disable();
        this.dataTableComponent.reset();
        this.ngOnInit();
    }  

    hapus() {
        this.httpService.delete(Configuration.get().dataMasterNew + '/komponenhasil/del/' + this.form.get('kode').value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.ngOnInit();
        });
    }


    confirmDelete() {
        let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Komponen Hasil');
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

    setReportDisplay() {
        this.form.get('reportDisplay').setValue(this.form.get('namaKomponenHasil').value)
    }

    clearFilter(da:any,db:any){
        da.filterValue = '';
        db.filterValue = '';
    }
}