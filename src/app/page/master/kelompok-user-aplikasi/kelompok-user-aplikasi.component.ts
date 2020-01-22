import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokUserAplikasi } from './kelompok-user-aplikasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService,AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-kelompok-user-aplikasi',
  templateUrl: './kelompok-user-aplikasi.component.html',
  styleUrls: ['./kelompok-user-aplikasi.component.scss'],
  providers: [ConfirmationService]
})
export class KelompokUserAplikasiComponent implements OnInit {
    item:KelompokUserAplikasi = new InisialKelompokUserAplikasi ();
    selected: KelompokUserAplikasi;
    listData: any[];
    codes:KelompokUserAplikasi[];
	  departemen:KelompokUserAplikasi[];    
    dataDummy: {};
    formAktif: boolean;
    kodeGolonganPegawai: KelompokUserAplikasi[];
    ruangan: KelompokUserAplikasi[];
    versi: any;
    form: FormGroup;
    items: any;
    value: any;    
  	kode:any;
	  id:any;
    page: number;
  	id_kode:any;
    rows: number;
    totalRecords: number;
  	report: any;
  	toReport: any;
    pencarian: string = '';
    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService) {
        this.page = Configuration.get().page;
        this.rows = Configuration.get().rows;
    }


    ngOnInit() {
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
            /*{label: 'Angular.io', icon: 'fa-link', url: 'http://angular.io'},
            {label: 'Theming', icon: 'fa-paint-brush', routerLink: ['/theming']}*/
        ];
        this.formAktif = true;
        this.getPage(this.page, this.rows, '');
        this.versi = null;
        this.form = this.fb.group({
            'profile': new FormControl(null),
            'kelompokUser': new FormControl('', Validators.required),
            'kelompokUserHead': new FormControl('', Validators.required),
            'departement': new FormControl('', Validators.required),
            'reportDisplay': new FormControl('', Validators.required),
            'statusEnabled': new FormControl(false)
        });

    }
	
	valuechange(newValue) {
	//	this.toReport = newValue;
		this.report = newValue;
	}
	
    downloadExcel() {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
           this.listData = table.data.data;  
			this.codes = []; 
		   
          for (let i=0; i<this.listData.length;i++)
            { 
		      this.codes.push({
				  
				kode :this.listData[i].id_kode,
                namaAgama :this.listData[i].namaAgama,
                kodeExternal:this.listData[i].kodeExternal,
                namaExternal:this.listData[i].namaExternal,				
				 	  
			  })
             
             debugger;
            }
            this.fileService.exportAsExcelFile(this.codes, 'Agama');
        });

    }

    downloadPdf() {
		  var col = ["Kode", "Nama Agama","Kode External","Nama External"];
		  this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Agama&select=id.kode,namaAgama,kodeExternal,namaExternal').subscribe(table => {
          this.listData = table.data.data;
		 
		
		  this.codes = []; 
		   
          for (let i=0; i<this.listData.length;i++)
            { 
		      this.codes.push({
				  
				code :this.listData[i].id_kode,
                nama :this.listData[i].namaAgama,
                kodeEx:this.listData[i].kodeExternal,
                namaEx:this.listData[i].namaExternal,				
				 	  
			  })
             
             debugger;
            }
			this.fileService.exportAsPdfFile("Master Agama", col,this.codes, "Agama");
          debugger;
          console.log(JSON.stringify(this.codes));
        });
		
		
       

    }
    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic-page?table=Agama&select=*&page=' + page + '&rows=' + rows).subscribe(table => {
            this.listData = table.data.data;
            this.totalRecords = table.data.totalRow;
			
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id').subscribe(res => {
          this.departemen = [];
          this.departemen.push({ label: '--Pilih Departement--', value: '' })
          for (var i = 0; i < res.data.data.length; i++) {
            this.departemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id.kode })
          };
        });
    }
    
    cari() {

        this.getPage(this.page, this.rows, this.pencarian);
    }
    loadPage(event: LazyLoadEvent) {
        this.getPage((event.first == undefined ? this.page : event.first), (event.rows == undefined ? this.page : event.rows), this.pencarian);
    }
    confirmDelete() {
        this.confirmationService.confirm({
            message: 'Apakah data akan di hapus?',
            header: 'Konfirmasi Hapus',
            icon: 'fa fa-trash',
            accept: () => {
                this.hapus();
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
        this.httpService.update(Configuration.get().dataMasterNew + '/agama/update/' + this.versi, this.form.value).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate()
        } else {
            this.httpService.post(Configuration.get().dataMasterNew + '/agama/save?', this.form.value).subscribe(response => {
                this.alertService.success('Berhasil', 'Data Disimpan');
                // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
                this.getPage(this.page, this.rows, this.pencarian);
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
        console.log(this.form.value);
    }
    clone(cloned: KelompokUserAplikasi): KelompokUserAplikasi {
        let hub = new InisialKelompokUserAplikasi();
        for (let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialKelompokUserAplikasi();
        fixHub = {
            "kode": hub.id.kode,
            "namaAgama": hub.namaAgama,
            "reportDisplay": hub.reportDisplay,
            "kodeExternal": hub.kodeExternal,
            "namaExternal": hub.namaExternal,
            "statusEnabled": true
        }
        this.versi = hub.version;
        return fixHub;
    }
    hapus() {
        let item = [...this.listData];
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew + '/KelompokUserAplikasi/del/' + deleteItem.id.kode).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.getPage(this.page, this.rows, this.pencarian);
        });
        this.reset();
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy() {

    }
}

class InisialKelompokUserAplikasi implements KelompokUserAplikasi {

    constructor(
        public agama?,
        public id?,
        public kdProfile?,
        public kode?,
        public kdAgama?,
        public namaAgama?,
        public reportDisplay?,
        public kodeExternal?,
        public namaExternal?,
        public statusEnabled?,
        public version?,
		public id_kode?,
		public code?,
		public nama?,
		public kodeEx?,
		public namaEx?
		
    ) { }

}