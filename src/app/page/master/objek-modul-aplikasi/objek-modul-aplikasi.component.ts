import { Component, OnInit, Inject, forwardRef  } from '@angular/core';
import { HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ChangeDetectorRef,ViewEncapsulation } from '@angular/core';
import { ObjekModulAplikasi, SelectedItem } from './objek-modul-aplikasi.interface';
import { Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule,ConfirmationService, MenuItem, TreeNode} from 'primeng/primeng';
import { AlertService,  InfoService, Configuration, FileService, AuthGuard, ReportService  } from '../../../global';
@Component({
	selector: 'app-objek-modul-aplikasi',
	templateUrl: './objek-modul-aplikasi.component.html',
	styleUrls: ['./objek-modul-aplikasi.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ConfirmationService]
})
export class ObjekModulAplikasiComponent implements OnInit {
	selected: ObjekModulAplikasi[];
	listData: ObjekModulAplikasi[];

	listObjekModulAplikasiHead : any[];
	listKelompokTransaksi : any[];
	listTypeDataObjek : any[];

	formAktif:boolean;
	pencarian:string;
	versi: any;
	form: FormGroup;

	kode: any;

	page: number;
	totalRecords: number;
	rows: number;

	items: any[];
	kdprof:any;
	kddept:any;
	laporan: boolean = false;
	smbrFile:any;

	objekModulTree: TreeNode[];
	selectedObjek: any;

	constructor(private alertService : AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) { }

	ngOnInit() {
		this.objekModulTree = [];
		this.pencarian="";
		this.formAktif = true;
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		this.items = [
		{label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
			this.downloadPdf();}
		},
		{label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
			this.downloadExcel();}
		},
		];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.get();
		// this.getDataGrid(this.page, this.rows, this.pencarian);
		this.form = this.fb.group({
			'kdObjekModulAplikasiHead': new FormControl(null),
			'namaObjekModulAplikasi': new FormControl('', Validators.required),
			'alamatURLFormObjek': new FormControl(''),
			'cthDataObjek' : new FormControl(''),
			'deskripsiObjek': new FormControl(''),
			'fungsiObjek': new FormControl(''),
			'kdKelompokTransaksi' : new FormControl(null),
			'kdTypeDataObjek': new FormControl(null),
			'noUrutObjek': new FormControl(null),
			'lengthObjek': new FormControl(null),
			'precisionObjek': new FormControl(null),
			'isObjekFK': new FormControl(null),
			'isObjekFKPK': new FormControl(null),
			'isObjekNullable': new FormControl(null),
			'isObjekPK': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true),
			'kode': new FormControl(''),
      'isMenu': new FormControl(null)
			// 'noRec': new FormControl(''),
			// 'version': new FormControl('')
		}); 
		this.form.get('noUrutObjek').disable();
		this.getSmbrFile();
	}
	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}	

	downloadExcel(){

	}

	downloadPdf(){
		let cetak = Configuration.get().report + '/objekModulAplikasi/laporanObjekModulAplikasi.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    	window.open(cetak);
	}

	cetak(){
		this.laporan = true;
    	this.print.showEmbedPDFReport(Configuration.get().report + '/objekModulAplikasi/laporanObjekModulAplikasi.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmObjekModulAplikasi_laporanCetak');
	}

	getDataGrid(page: number, rows: number, cari:string) {
		this.httpService.get(Configuration.get().dataMasterNew + '/objekmodulaplikasi/findAll?page='+page+'&rows='+rows+'&dir=namaObjekModulAplikasi&sort=desc&namaObjekModulAplikasi='+cari).subscribe(table => {
			this.listData = table.ObjekModulAplikasi;
			this.totalRecords = table.totalRow;
		});
	}

	get() {
		this.httpService.get(Configuration.get().dataMasterNew+'/objekmodulaplikasi/findAll?page=1&rows=1000&dir=namaObjekModulAplikasi&sort=desc').subscribe(table => {
			this.listData = table.ObjekModulAplikasi;
			this.totalRecords = table.totalRow;
		});

		//dd objek modul aplikasi head
       this.httpService.get(Configuration.get().dataMasterNew+'/objekmodulaplikasi/findAllItem').subscribe(res => {
       	this.listObjekModulAplikasiHead = [];
       	this.listObjekModulAplikasiHead.push({label:'--Pilih Parent Objek Modul Aplikasi--', value:null})
       	for(var i=0;i<res.ObjekModulAplikasi.length;i++) {
       		this.listObjekModulAplikasiHead.push({label:res.ObjekModulAplikasi[i].namaObjekModulAplikasi, value:res.ObjekModulAplikasi[i].kode})
       	};
       });

       //dd objek modul aplikasi head
    //    this.httpService.get(Configuration.get().dataMasterNew+'/objekmodulaplikasi/findHead').subscribe(res => {
    //    	this.listObjekModulAplikasiHead = [];
    //    	this.listObjekModulAplikasiHead.push({label:'--Pilih Parent Objek Modul Aplikasi--', value:null})
    //    	for(var i=0;i<res.ObjekModulAplikasi.length;i++) {
    //    		this.listObjekModulAplikasiHead.push({label:res.ObjekModulAplikasi[i].namaObjekModulAplikasi, value:res.ObjekModulAplikasi[i].kdObjekModulAplikasi})
    //    	};
    //    });

       //dd kelompok transaksi
       this.httpService.get(Configuration.get().dataMasterNew+'/objekmodulaplikasi/findKelompokTransaksi').subscribe(res => {
       	this.listKelompokTransaksi = [];
       	this.listKelompokTransaksi.push({label:'--Pilih Kelompok Transaksi--', value:null})
       	for(var i=0;i<res.KelompokTransaksi.length;i++) {
       		this.listKelompokTransaksi.push({label:res.KelompokTransaksi[i].namaKelompokTransaksi, value:res.KelompokTransaksi[i].kdKelompokTransaksi})
       	};
       });

       //dd type data objek
       this.httpService.get(Configuration.get().dataMasterNew+'/type-data-objek/findAll?').subscribe(res => {
       	this.listTypeDataObjek = [];
       	this.listTypeDataObjek.push({label:'--Pilih Type Data Objek--', value:null})
       	for(var i=0;i<res.TypeDataObjek.length;i++) {
       		this.listTypeDataObjek.push({label:res.TypeDataObjek[i].namaTypeDataObjek, value:res.TypeDataObjek[i].kode})
       	};
       });
   }

   cari() {
   	this.getDataGrid(this.page,this.rows,this.pencarian)
   }

   confirmDelete() {
   	let kode = this.form.get('kode').value;
   	if (kode == null || kode == undefined || kode == "") {
   		this.alertService.warn('Peringatan', 'Pilih Daftar Master Objek Modul Aplikasi');
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

   	this.convertbin();
   	this.httpService.update(Configuration.get().dataMasterNew + '/objekmodulaplikasi/update/' + this.versi, this.form.value).subscribe(response => {
   		this.alertService.success('Berhasil', 'Data Diperbarui');
   		this.reset();
   	});
   }

   convertbin(){
   	let isObjekFK = this.form.get('isObjekFK').value;
   	let isObjekFKPK = this.form.get('isObjekFKPK').value;
   	let isObjekNullable = this.form.get('isObjekNullable').value;
   	let isObjekPK = this.form.get('isObjekPK').value;
    let isMenu = this.form.get('isMenu').value

   	if (isObjekFK == true){
   		this.form.get('isObjekFK').setValue(1);
   	}
   	else{
   		this.form.get('isObjekFK').setValue(0);
   	}

   	if (isObjekFKPK == true){
   		this.form.get('isObjekFKPK').setValue(1);
   	}
   	else{
   		this.form.get('isObjekFKPK').setValue(0);
   	}

   	if (isObjekNullable == true){
   		this.form.get('isObjekNullable').setValue(1);
   	}
   	else{
   		this.form.get('isObjekNullable').setValue(0);
   	}

   	if (isObjekPK == true){
   		this.form.get('isObjekPK').setValue(1);
   	}
   	else{
   		this.form.get('isObjekPK').setValue(0);
   	}

    if (isMenu == true){
      this.form.get('isMenu').setValue(1)
    }
    else {
      this.form.get('isMenu').setValue(0)
    }
   }


   simpan() {
   	if (this.formAktif == false ) {
   		this.confirmUpdate()
   	} else { 
   		let noUrut = this.totalRecords + 1;
   		this.form.get('noUrutObjek').enable();
   		this.form.get('noUrutObjek').setValue(noUrut);

   		this.convertbin();
   		this.httpService.post(Configuration.get().dataMasterNew+'/objekmodulaplikasi/save', this.form.value).subscribe(response =>{
   			this.alertService.success('Berhasil','Data Disimpan');
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
   		this.alertService.warn("Peringatan","Data Tidak Sesuai")
   	} else {
   		this.simpan();
   	}
   }

   reset(){
   	this.form.get('noUrutObjek').disable();
   	this.ngOnInit();
   } 

   onRowSelect(event) {
   	let cloned = this.clone(event.data);
   	this.form.setValue(cloned);

   	let isObjekFK = event.data.isObjekFK;
   	let isObjekFKPK = event.data.isObjekFKPK;
   	let isObjekNullable = event.data.isObjekNullable;
   	let isObjekPK = event.data.isObjekPK;
    let isMenu = event.data.isMenu

   	if (isObjekFK == 1){
   		this.form.get('isObjekFK').setValue(true);
   	}
   	else{
   		this.form.get('isObjekFK').setValue(false);
   	}

   	if (isObjekFKPK == 1){
   		this.form.get('isObjekFKPK').setValue(true);
   	}
   	else{
   		this.form.get('isObjekFKPK').setValue(false);
   	}

   	if (isObjekNullable == 1){
   		this.form.get('isObjekNullable').setValue(true);
   	}
   	else{
   		this.form.get('isObjekNullable').setValue(false);
   	}

   	if (isObjekPK == 1){
   		this.form.get('isObjekPK').setValue(true);
   	}
   	else{
   		this.form.get('isObjekPK').setValue(false);
   	}

    if (isMenu == 1){
      this.form.get('isMenu').setValue(true)
    }
    else {
      this.form.get('isMenu').setValue(false)
    }
   	
   	this.formAktif = false;
   	this.form.get('noUrutObjek').enable();
   }

   clone(cloned: any){
   	let fixHub = {
   		"kdObjekModulAplikasiHead" : cloned.kdObjekModulAplikasiHead,
   		"alamatURLFormObjek" : cloned.alamatURLFormObjek,
   		"cthDataObjek" : cloned.cthDataObjek,
   		"deskripsiObjek" : cloned.deskripsiObjek,
   		"fungsiObjek" : cloned.fungsiObjek,
   		"kdKelompokTransaksi" : cloned.kdKelompokTransaksi,
   		"kdTypeDataObjek" : cloned.kdTypeDataObjek,
   		"noUrutObjek" : cloned.noUrutObjek,
   		"lengthObjek" : cloned.lengthObjek,
   		"precisionObjek" : cloned.precisionObjek,
   		"isObjekFK" : cloned.isObjekFK,
   		"isObjekFKPK" : cloned.isObjekFKPK,
   		"isObjekNullable" : cloned.isObjekNullable,
   		"isObjekPK" : cloned.isObjekPK,
   		"reportDisplay" : cloned.reportDisplay,
   		"statusEnabled" : cloned.statusEnabled,
   		"kode" : cloned.kode,
   		"namaObjekModulAplikasi": cloned.namaObjekModulAplikasi,
      "isMenu": cloned.isMenu
   		// "noRec": cloned.noRec,
   		// "version": ""
   	}
   	this.versi = cloned.version;
   	return fixHub;
   }

   hapus() {
   	this.httpService.delete(Configuration.get().dataMasterNew + '/objekmodulaplikasi/del/' + this.form.get('kode').value).subscribe(response => {
   		this.alertService.success('Berhasil', 'Data Dihapus');
   		this.reset();
   	});
   } 

//    findSelectedIndex(): number {
//    	return this.listData.indexOf(this.selected);
//    }

   loadPage(event: LazyLoadEvent) {
   	this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
   	this.page = (event.rows + event.first) / event.rows;
   	this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    onDestroy(){
    }

    setReportDisplay() {
    	this.form.get('reportDisplay').setValue(this.form.get('namaObjekModulAplikasi').value)
	}
	
	nodeSelect(event){
		let idPilih;
		idPilih = event.node.kode;
		
		this.getTree(idPilih);
		this.form.get('kdObjekModulAplikasiHead').setValue(idPilih);
	}

	getTree(event){
		let kdObjekD = event;
		let kdObjek = event.value;

		if(kdObjek != undefined ){
			kdObjek = event.value;
			console.log(kdObjek);

		let dataTampung = [];
		let dataTampungHead = [];
		this.httpService.get(Configuration.get().dataMasterNew + '/objekmodulaplikasi/objekModulAplikasi/'+ kdObjek).subscribe(table => {
			//this.objekModulTree = table.data;
			
			let tampungData = table;
	
			for(let i=0; i < tampungData.length; i++){
				dataTampung[i] = {
					"label": tampungData[i].namaObjekModulAplikasi,
					"kodeHead": tampungData[i].kdObjekModulAplikasiHead,
					"kode": tampungData[i].kdObjekModulAplikasi,
					"children": []
				}

				//dataTampung.push(dataTampungHead);
			}

			function list_to_tree(list) {

				let map = {}, node, roots = [], k;
				for (k = 0; k < list.length; k += 1) {
					map[list[k].kode] = k; // inisialisasi
					list[k].children = [];
					// inisialisasi Children
				}

				for (k = 0; k < list.length; k += 1) {
					node = list[k];
					if (node.kodeHead !== null) {
						// jika kdObjekModulAplikasiHead Tidak Kosong Push Ke Children
						list[map[node.kodeHead]].children.push(node);
					} else {
						roots.push(node);
					}
				}
				return roots;
			}
			this.objekModulTree = list_to_tree(dataTampung);
			console.log(this.objekModulTree);
		});

		}
		// else{
		// 	kdObjek = event;
		// }
		
	}

}

class InisialObjekModulAplikasi implements ObjekModulAplikasi {

	constructor(
		public alamatURLFormObjekModulAplikasi?,
		public fungsi?,
		public kdObjekModulAplikasiHead?,
		public keterangan?,
		public kode?,
		public kodeExternal?,
		public namaExternal?,
		public namaObjekModulAplikasi?,
		public namaObjekModulAplikasiHead?,
		public objekModulAplikasiNoUrut?,
		public reportDisplay?,
		public statusEnabled?,
		public version?,
		public id?
		) {}

}
