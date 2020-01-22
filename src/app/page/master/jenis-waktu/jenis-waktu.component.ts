import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService,  InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
import { CalendarModule} from 'primeng/primeng';

@Component({
	selector: 'app-jenis-waktu',
	templateUrl: './jenis-waktu.component.html',
	styleUrls: ['./jenis-waktu.component.scss'],
	providers: [ConfirmationService]
})
export class JenisWaktuComponent implements OnInit {
	JenisWaktu: any;
	formAktif: boolean;
	form: FormGroup;

	namaJenisWaktu: any;
	reportDisplay: any;
	noUrut: any;
	jamAwal : any=[];
	jamAkhir : any=[];
	kdJenisWaktuHead: any=[];
	kdKelompokProduk: any=[];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;

	kdProfile: any;
	kdJenisWaktu: any;
	kdDepartemen: any;

	listData: any=[];

	pencarian: string = '';
	dataSimpan: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi:number;
	listTab: any[];
	index: number = 0;
	tabIndex: number = 0;

	items:any;
	listData2:any[];
	codes:any[];

	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	itemsChild: any;
	kdHead: any;
	smbrFile:any;
	

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
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

		let data = {
			"namaJenisWaktu": "string",
			"reportDisplay": "string",
			"noUrut": "string",
			"jamAwal": "string",
			"jamAkhir": "string",
			"kdJenisWaktuHead": "string",
			"kdKelompokProduk": "string",
			"kodeExternal": "string",
			"namaExternal": "string",
			"statusEnabled": true,
			"noRec": "string",
			"kode": 0,
			"kdDepartemen": "string",
		}

		this.jamAwal = [
		{label: '0', value: 0},	{label: '1', value: 1}, {label: '2', value: 2},
		{label: '3', value: 3}, {label: '4', value: 4},	{label: '5', value: 5},
		{label: '6', value: 6}, {label: '7', value: 7}, {label: '8', value: 8},
		{label: '9', value: 9}, {label: '10', value: 10}, {label: '11', value: 11},
		{label: '12', value: 12}, {label: '13', value: 13}, {label: '14', value: 14},
		{label: '15', value: 15}, {label: '16', value: 16}, {label: '17', value: 17},
		{label: '18', value: 18}, {label: '19', value: 19}, {label: '20', value: 20},
		{label: '21', value: 21}, {label: '22', value: 22}, {label:'23', value: 23}];
		this.jamAkhir = [
		{label: '0', value: 0},	{label: '1', value: 1}, {label: '2', value: 2},
		{label: '3', value: 3}, {label: '4', value: 4},	{label: '5', value: 5},
		{label: '6', value: 6}, {label: '7', value: 7}, {label: '8', value: 8},
		{label: '9', value: 9}, {label: '10', value: 10}, {label: '11', value: 11},
		{label: '12', value: 12}, {label: '13', value: 13}, {label: '14', value: 14},
		{label: '15', value: 15}, {label: '16', value: 16}, {label: '17', value: 17},
		{label: '18', value: 18}, {label: '19', value: 19}, {label: '20', value: 20},
		{label: '21', value: 21}, {label: '22', value: 22}, {label:'23', value: 23}];

		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			'namaJenisWaktu': new FormControl(null,Validators.required),
			'reportDisplay': new FormControl(null,Validators.required),
			'noUrut':new FormControl(null,Validators.required),
			'jamAwal': new FormControl(null,Validators.required),
			'jamAkhir': new FormControl(null,Validators.required),
			'kdJenisWaktuHead': new FormControl(null),
			'kdKelompokProduk': new FormControl(null),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(true,Validators.required),
			'noRec': new FormControl(null),
			'kdDepartemen': new FormControl(null),
			'kode': new FormControl(null)
		});
		this.getKdJenisWaktuHead();
		this.getKdKelompokProduk();
		this.form.get('noUrut').disable();
		if (this.index == 0){
			this.httpService.get(Configuration.get().dataMasterNew + '/jeniswaktu/findAll?page=1&rows=300&dir=namaJenisWaktu&sort=desc').subscribe(table => {
				this.listTab = table.JenisWaktu;
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
			'namaJenisWaktu': new FormControl(null,Validators.required),
			'reportDisplay': new FormControl(null,Validators.required),
			'noUrut':new FormControl(null,Validators.required),
			'jamAwal': new FormControl(null,Validators.required),
			'jamAkhir': new FormControl(null,Validators.required),
			'kdJenisWaktuHead': new FormControl(null),
			'kdKelompokProduk': new FormControl(null),
			'kodeExternal': new FormControl(null),
			'namaExternal': new FormControl(null),
			'statusEnabled': new FormControl(true,Validators.required),
			'noRec': new FormControl(null),
			'kdDepartemen': new FormControl(null),
			'kode': new FormControl(null)
		});
		this.form.get('noUrut').disable();
		let data;
		this.index = event.index;
		if (event.index > 0){
			let index = event.index-1;
			data = this.listTab[index].kode.kode;
			this.kdHead = data;
			this.form.get('kdJenisWaktuHead').setValue(data);
		} else {
			data = '';
			this.form.get('kdJenisWaktuHead').setValue(null);
		}
		this.pencarian = '';
		this.get(this.page,this.rows,this.pencarian, data);
		this.formAktif = true;
	}
	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}
	}

	getKdJenisWaktuHead() {
		this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=JenisWaktu&select=namaJenisWaktu,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdJenisWaktuHead = [];
			this.kdJenisWaktuHead.push({label:'--Pilih Parent Jenis Waktu--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdJenisWaktuHead.push({label:res.data.data[i].namaJenisWaktu, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdJenisWaktuHead = [];
			this.kdJenisWaktuHead.push({label:'-- '+ error +' --', value:''})
		});

	}

	getKdKelompokProduk() {
		this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=KelompokProduk&select=namaKelompokProduk,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdKelompokProduk = [];
			this.kdKelompokProduk.push({label:'--Pilih Kelompok Produk--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdKelompokProduk.push({label:res.data.data[i].namaKelompokProduk, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdKelompokProduk = [];
			this.kdKelompokProduk.push({label:'-- '+ error +' --', value:''})
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

	get(page: number, rows: number, search: any, head: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/jeniswaktu/findAll?page='+page+'&rows='+rows+'&dir=namaJenisWaktu&sort=desc&namaJenisWaktu='+search+'&kdJenisWaktuHead='+head).subscribe(table => {
			this.listData = table.JenisWaktu;
			this.totalRecords = table.totalRow;
			this.form.get('noUrut').setValue(this.totalRecords+1);
		});
	}

	cari() {
		let data = this.form.get('kdJenisWaktuHead').value;
		if (data == null) {
			this.get(this.page,this.rows,this.pencarian, '');
		} else {
			this.get(this.page,this.rows,this.pencarian, data);
		}

	}

	loadPage(event: LazyLoadEvent) {
		let data = this.form.get('kdJenisWaktuHead').value;
		if (data == null) {
			this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, '');
		} else {
			this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian, data);
		}
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	clone(cloned: any){
		let fixHub = {
			"namaJenisWaktu": cloned.namaJenisWaktu,
			"kdDepartemen": cloned.kdDepartemen,
			"reportDisplay": cloned.reportDisplay,
			"noUrut": cloned.noUrut,
			"jamAwal": cloned.jamAwal,
			"jamAkhir": cloned.jamAkhir,
			"kdJenisWaktuHead": cloned.kdJenisWaktuHead,
			"kdKelompokProduk": cloned.kdKelompokProduk,
			"kodeExternal": cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"statusEnabled": cloned.statusEnabled,
			"noRec": cloned.noRec,
			"kode": cloned.kode.kode,
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);
		this.form.get('noUrut').enable();
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
		this.httpService.update(Configuration.get().dataMasterNew + '/jeniswaktu/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.ngOnInit();
		});
	}

	simpan() {

		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.form.get('noUrut').enable();
			this.httpService.post(Configuration.get().dataMasterNew + '/jeniswaktu/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.ngOnInit();
			});
		}

	}

	onDestroy() {

	}

	reset(){
		this.form.get('noUrut').disable();
		this.ngOnInit();
	}   

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/jeniswaktu/del/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.ngOnInit();
		});
	}


	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Jenis Waktu');
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
		this.form.get('reportDisplay').setValue(this.form.get('namaJenisWaktu').value)
	}


	downloadExcel() {
		this.httpService.get(Configuration.get().dataMasterNew + '/jeniswaktu/findAll?').subscribe(table => {
			this.listData2 = table.JenisWaktu;
			this.codes = [];

			for (let i = 0; i < this.listData2.length; i++) {
				this.codes.push({

					kode: this.listData2[i].kode.kode,
					namaJenisWaktuHead: this.listData2[i].namaJenisWaktuHead,
					namaJenisWaktu: this.listData2[i].namaJenisWaktu,
					noUrut: this.listData2[i].noUrut,
					jamAwal: this.listData2[i].jamAwal,
					jamAkhir: this.listData2[i].jamAkhir,
					reportDisplay: this.listData2[i].reportDisplay,
					kodeExternal: this.listData2[i].kodeExternal,
					namaExternal: this.listData2[i].namaExternal,
					statusEnabled: this.listData2[i].statusEnabled,

				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'JenisWaktu');
		});

	}
	
	
	downloadPdf(){
		let b = Configuration.get().report + '/jenisWaktu/laporanJenisWaktu.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';

		window.open(b);
	}

	cetak() {
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/jenisWaktu/laporanJenisWaktu.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmJenisWaktu_laporanCetak');

        // this.laporan = true;
        // let b = Configuration.get().report + '/jenisWaktu/laporanJenisWaktu.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';

        // window.open(b);
	}

	
cetakChild(){
    this.laporan = true;
    this.print.showEmbedPDFReport(Configuration.get().report + '/jenisWaktuChild/laporanJenisWaktuChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisWaktuHead='+ this.kdHead +'&download=false', 'frmJenisWaktu_laporanCetak');
}

downloadPdfChild(){
    let b = Configuration.get().report + '/jenisWaktuChild/laporanJenisWaktuChild.pdf?kdDepartemen='+ this.kddept +'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&kdJenisWaktuHead='+ this.kdHead +'&download=true';
    window.open(b);
}

downloadExcelChild(){

}





}

