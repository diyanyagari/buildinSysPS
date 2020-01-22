import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { Messaging } from './messaging.interface';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration ,AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-messaging',
	templateUrl: './messaging.component.html',
	styleUrls: ['./messaging.component.scss'],
	providers: [ConfirmationService]
})
export class MessagingComponent implements OnInit {
	item : Messaging = new InisialMessaging();
	selected: Messaging;
	listData: any[];
	dataDummy:{};
	kodeMessagingHead: Messaging[];
	kodeObjekModulAplikasi: Messaging[];
	versi: any;
	formMessaging: FormGroup;

	form: FormGroup;

	page: number;
	totalRecords: number;
	rows: number;
	kdprof:any;
	kddept:any;
	laporan: boolean = false;
	formAktif: boolean;
	listNotifMessagingHead: any[];
	listObjekModulAplikasi: any[];
	pencarian: string = '';

	items: any[];

	listModulAplikasiTujuan: any[];
	listObjekModulAplikasiTujuan: any[];
	listRuanganTujuan: any[];
	listJabatanTujuan: any[];

	listInputDetail: any[];
	totalRecordsInput: number;

	selectedObjekModulAplikasiTujuan: any[];

	listModulAplikasi: any[];
	smbrFile:any;

	constructor(
		private alertService : AlertService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService, 
		private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) 
	{ }

	ngOnInit() {
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
			this.rows = Configuration.get().rows;}

			this.formAktif = true;
			this.form = this.fb.group({
				'deskripsiDetailMessaging' : new FormControl(null),
				'kdNotifMessagingHead' : new FormControl(null),
				'kdObjekModulAplikasi' : new FormControl(null, Validators.required),
				'keteranganLainnya' : new FormControl(null),
				'kode' : new FormControl(null),
				'namaMessaging' : new FormControl(null,Validators.required),
				'qtyHariBefore' : new FormControl(null),
				'qtyHariFreq' : new FormControl(null),
				'qtyMessaging' : new FormControl(null),
				'statusEnabled' : new FormControl(true),

				'kdModulAplikasiTujuan' : new FormControl(null,Validators.required),
				'kdObjekModulAplikasiTujuan' : new FormControl(null,Validators.required),
				'customUrlObjekModul' : new FormControl('/#/'),
				'namaFungsiFrontEnd' : new FormControl(''),

				'kdRuanganTujuan' : new FormControl(null),
				'kdJabatanTujuan' : new FormControl(null),
				'titleNotifikasi' : new FormControl(''),
				'pesanNotifikasi' : new FormControl(''),

				'kdModulAplikasi' : new FormControl(null,Validators.required)

			});

			this.form.get('kdObjekModulAplikasi').disable();
			this.listInputDetail = [];

			this.getDD();
			this.getDataGrid(this.page,this.rows,'');
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
			let cetak = Configuration.get().report + '/messaging/laporanMessaging.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
			window.open(cetak);
		}

		cetak(){
			this.laporan = true;
			this.print.showEmbedPDFReport(Configuration.get().report + '/messaging/laporanMessaging.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'Laporan Messaging');	
		}

		getDD(){
			// kdNotifMessagingHead
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findHead').subscribe(res => {
				this.listNotifMessagingHead = [];
				this.listNotifMessagingHead.push({label:'--Pilih Parent Messaging--', value:null})
				for(var i=0;i<res.NotifMessaging.length;i++) {
					this.listNotifMessagingHead.push({label:res.NotifMessaging[i].namaMessaging, value:res.NotifMessaging[i].kode.kode})
				};
			}); 
			// kdObjekModulAplikasi
			// this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findObjekModulAplikasiTujuan').subscribe(res => {
			// 	this.listObjekModulAplikasi = [];
			// 	this.listObjekModulAplikasi.push({label:'--Pilih Objek Modul Aplikasi--', value:null})
			// 	for(var i=0;i<res.objekModul.length;i++) {
			// 		this.listObjekModulAplikasi.push({label:res.objekModul[i].namaObjekModulAplikasi, value:res.objekModul[i].kdObjekModulAplikasi})
			// 	};
			// });
			// listModulAplikasiTujuan
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findModulAplikasiTujuan').subscribe(res => {
				this.listModulAplikasiTujuan = [];
				this.listModulAplikasiTujuan.push({label:'--Pilih Modul Aplikasi Tujuan--', value:null})
				for(var i=0;i<res.modul.length;i++) {
					this.listModulAplikasiTujuan.push({label:res.modul[i].namaModulAplikasi, value:res.modul[i].kode})
				};
			});

			// listObjekModulAplikasiTujuan
			// this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findObjekModulAplikasiTujuan').subscribe(res => {
			// 	this.listObjekModulAplikasiTujuan = [];
			// 	this.listObjekModulAplikasiTujuan.push({label:'--Pilih Objek Modul Aplikasi Tujuan--', value:null})
			// 	for(var i=0;i<res.objekModul.length;i++) {
			// 		this.listObjekModulAplikasiTujuan.push({label:res.objekModul[i].namaObjekModulAplikasi, value:res.objekModul[i].kdObjekModulAplikasi})
			// 	};
			// });
			// listRuanganTujuan
			this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Ruangan&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
				this.listRuanganTujuan = [];
				this.listRuanganTujuan.push({label:'--Pilih Unit Kerja Tujuan--', value:null})
				for(var i=0;i<res.data.data.length;i++) {
					this.listRuanganTujuan.push({label:res.data.data[i].namaRuangan, value: res.data.data[i].id.kode})
				};
			});
			// listJabatanTujuan
			this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Jabatan&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
				this.listJabatanTujuan = [];
				this.listJabatanTujuan.push({label:'--Pilih Jabatan Tujuan--', value:null})
				for(var i=0;i<res.data.data.length;i++) {
					this.listJabatanTujuan.push({label:res.data.data[i].namaJabatan, value: res.data.data[i].id.kode})
				};
			});
			//listModulAplikasi
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findModulAplikasiTujuan').subscribe(res => {
				this.listModulAplikasi = [];
				this.listModulAplikasi.push({label:'--Pilih Modul Aplikasi--', value:null})
				for(var i=0;i<res.modul.length;i++) {
					this.listModulAplikasi.push({label:res.modul[i].namaModulAplikasi, value:res.modul[i].kode})
				};
			});
		}

		getDataGrid(page: number, rows: number, cari:string) {
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findAll?page='+page+'&rows='+rows).subscribe(table => {
				this.listData = table.NotifMessaging;
				this.totalRecords = table.totalRow;
			});   
		}

		cari() {
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaMessaging&sort=desc&namaMessaging='+this.pencarian).subscribe(table => {
				this.listData = table.NotifMessaging;
				this.totalRecords = table.totalRow;
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

		getObjek(event){
			let kdmodul = event.value;
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findObjekModulAplikasiTujuan/'+kdmodul).subscribe(res => {
				this.listObjekModulAplikasi = [];
				this.listObjekModulAplikasi.push({label:'--Pilih Objek Modul Aplikasi--', value:null})
				for(var i=0;i<res.objekModul.length;i++) {
					this.listObjekModulAplikasi.push({label:res.objekModul[i].namaObjekModulAplikasi, value:res.objekModul[i].kdObjekModulAplikasi})
				};
			});
			this.form.get('kdObjekModulAplikasi').enable();
		}

		getObjekTujuan(event){
			let kdmodul = event.value;
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findObjekModulAplikasiTujuan/'+kdmodul).subscribe(res => {
				this.listObjekModulAplikasiTujuan = [];
				this.listObjekModulAplikasiTujuan.push({label:'--Pilih Objek Modul Aplikasi Tujuan--', value:null})
				for(var i=0;i<res.objekModul.length;i++) {
					this.listObjekModulAplikasiTujuan.push({label:res.objekModul[i].namaObjekModulAplikasi, value:res.objekModul[i].kdObjekModulAplikasi})
				};
			});
		}

		confirmDelete() {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapus();
				},
				reject: () => {
					this.alertService.warn('Peringatan','Data Tidak Dihapus');
				}
			});
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


			let dataSimpan = {
				"deskripsiDetailMessaging": this.form.get('deskripsiDetailMessaging').value,
				"kdNotifMessagingHead": this.form.get('kdNotifMessagingHead').value,
				"kdObjekModulAplikasi": this.form.get('kdObjekModulAplikasi').value,
				"keteranganLainnya": this.form.get('keteranganLainnya').value,
				"kode": this.form.get('kode').value,
				"namaMessaging": this.form.get('namaMessaging').value,
				"kdModulAplikasi" : this.form.get('kdModulAplikasi').value,
				"notifMessagingObjekModulAplikasi": {
					"customURLObjekModul": this.form.get('customUrlObjekModul').value,
					"kdJabatanTujuan": this.form.get('kdJabatanTujuan').value,
					"kdModulAplikasiTujuan": this.form.get('kdModulAplikasiTujuan').value,
					"kdNotifMessaging": this.form.get('kode').value,
					"kdObjekModulAplikasiTujuan": this.form.get('kdObjekModulAplikasiTujuan').value,
					"kdRuanganTujuan": this.form.get('kdRuanganTujuan').value,
					"namaFungsiFrontEnd": this.form.get('namaFungsiFrontEnd').value,
					"pesanNotifikasi": this.form.get('pesanNotifikasi').value,
					"statusEnabled": this.form.get('statusEnabled').value,
					"titleNotifikasi": this.form.get('titleNotifikasi').value
				},
				"qtyHariBefore": this.form.get('qtyHariBefore').value,
				"qtyHariFreq": this.form.get('qtyHariFreq').value,
				"qtyMessaging": this.form.get('qtyMessaging').value,
				"statusEnabled": this.form.get('statusEnabled').value
			}


			this.httpService.update(Configuration.get().dataMasterNew+'/NotifMessaging/update/'+this.versi, dataSimpan).subscribe(response =>{
				this.alertService.success('Berhasil','Data Diperbarui');
				this.getDataGrid(this.page,this.rows,'');
				this.reset();
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
			else {

				let dataSimpan = {
					"deskripsiDetailMessaging": this.form.get('deskripsiDetailMessaging').value,
					"kdNotifMessagingHead": this.form.get('kdNotifMessagingHead').value,
					"kdObjekModulAplikasi": this.form.get('kdObjekModulAplikasi').value,
					"keteranganLainnya": this.form.get('keteranganLainnya').value,
					"kode": this.form.get('kode').value,
					"namaMessaging": this.form.get('namaMessaging').value,
					"kdModulAplikasi" : this.form.get('kdModulAplikasi').value,
					"notifMessagingObjekModulAplikasi": {
						"customURLObjekModul": this.form.get('customUrlObjekModul').value,
						"kdJabatanTujuan": this.form.get('kdJabatanTujuan').value,
						"kdModulAplikasiTujuan": this.form.get('kdModulAplikasiTujuan').value,
						"kdNotifMessaging": this.form.get('kode').value,
						"kdObjekModulAplikasiTujuan": this.form.get('kdObjekModulAplikasiTujuan').value,
						"kdRuanganTujuan": this.form.get('kdRuanganTujuan').value,
						"namaFungsiFrontEnd": this.form.get('namaFungsiFrontEnd').value,
						"pesanNotifikasi": this.form.get('pesanNotifikasi').value,
						"statusEnabled": this.form.get('statusEnabled').value,
						"titleNotifikasi": this.form.get('titleNotifikasi').value
					},
					"qtyHariBefore": this.form.get('qtyHariBefore').value,
					"qtyHariFreq": this.form.get('qtyHariFreq').value,
					"qtyMessaging": this.form.get('qtyMessaging').value,
					"statusEnabled": this.form.get('statusEnabled').value
				}

				this.httpService.post(Configuration.get().dataMasterNew+'/NotifMessaging/save', dataSimpan).subscribe(response =>{
					this.alertService.success('Berhasil','Data Disimpan');
					this.getDataGrid(this.page,this.rows,'');
					this.reset();
				});  
				
			}
		}

		reset(){
			this.form.get('kdModulAplikasiTujuan').enable();
			this.form.get('kdObjekModulAplikasiTujuan').enable();
			this.ngOnInit();
		}

		onRowSelect(event) {
			this.formAktif = false;				

			let kdmodul = event.data.kdModulAplikasi;

			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findObjekModulAplikasiTujuan/'+kdmodul).subscribe(res => {
				this.listObjekModulAplikasi = [];
				this.listObjekModulAplikasi.push({label:'--Pilih Objek Modul Aplikasi--', value:null})
				for(var i=0;i<res.objekModul.length;i++) {
					this.listObjekModulAplikasi.push({label:res.objekModul[i].namaObjekModulAplikasi, value:res.objekModul[i].kdObjekModulAplikasi})
				};
			});

			let kdobjekmodul = event.data.kdObjekModulAplikasi;
			
			this.form.get('deskripsiDetailMessaging').setValue(event.data.deskripsiDetailMessaging);
			this.form.get('kdNotifMessagingHead').setValue(event.data.kdNotifMessagingHead);
			this.form.get('keteranganLainnya').setValue(event.data.keteranganLainnya);
			this.form.get('kode').setValue(event.data.kode.kode);
			this.form.get('namaMessaging').setValue(event.data.namaMessaging);
			this.form.get('qtyHariBefore').setValue(event.data.qtyHariBefore);
			this.form.get('qtyHariFreq').setValue(event.data.qtyHariFreq);
			this.form.get('qtyMessaging').setValue(event.data.qtyMessaging);
			this.form.get('statusEnabled').setValue(event.data.statusEnabled);

			this.form.get('kdModulAplikasi').setValue(kdmodul);
			this.form.get('kdObjekModulAplikasi').setValue(kdobjekmodul);



			this.getDetail(event);		

			this.versi = event.data.version;
			
		}

		clone(cloned: any){
			let fixHub = {
				"kode" : cloned.kode.kode,
				"kdNotifMessagingHead" : cloned.kdNotifMessagingHead,
				"kdObjekModulAplikasi" : cloned.kdObjekModulAplikasi,
				"namaMessaging" : cloned.namaMessaging,
				"deskripsiDetailMessaging" : cloned.deskripsiDetailMessaging,
				"keteranganLainnya" : cloned.keteranganLainnya,
				"qtyHariBefore" : cloned.qtyHariBefore,
				"qtyHariFreq" : cloned.qtyHariFreq,
				"qtyMessaging" : cloned.qtyMessaging,
				"statusEnabled" : cloned.statusEnabled,
				"kdModulAplikasi" : cloned.kdModulAplikasi
			}
			this.versi = cloned.version
			return fixHub;
		}

		hapus() {
			let item = [...this.listData]; 
			let deleteItem = item[this.findSelectedIndex()];
			this.httpService.delete(Configuration.get().dataMasterNew+'/NotifMessaging/del/'+this.form.get('kode').value).subscribe(response => {
				this.alertService.success('Berhasil','Data Dihapus');
				this.getDataGrid(this.page,this.rows,'');
				this.ngOnInit();
			});
		}

		findSelectedIndex(): number {
			return this.listData.indexOf(this.selected);
		}

		onDestroy(){

		}  

		loadPage(event: LazyLoadEvent) {
			this.getDataGrid((event.rows+event.first)/event.rows,event.rows,this.pencarian);
			this.page = (event.rows + event.first)/event.rows;
			this.rows = event.rows;
		}

		hapusRow(ri){
			let listInputDetail = [...this.listInputDetail];
			listInputDetail.splice(ri,1);
			this.listInputDetail = listInputDetail;
		}

		tambahInput(){
			if (this.listInputDetail.length == 0){
				let dataTemp = {
					"ruanganTujuan": {
						"namaRuanganTujuan" : '--Pilih Ruangan Tujuan--',
						"kdRuanganTujuan" : null
					},
					"jabatanTujuan": {
						"namaJabatanTujuan" : '--Pilih Jabatan Tujuan--',
						"kdJabatanTujuan" : null
					} ,
					"titleNotifikasi": "" ,
					"pesanNotifikasi": "",
					"statusEnabled" : true
				}
				let listInputDetail = [...this.listInputDetail];
				listInputDetail.push(dataTemp);
				this.listInputDetail = listInputDetail;
			}
			else {
				let last = this.listInputDetail.length -1;
				if(this.listInputDetail[last].titleNotifikasi == null || this.listInputDetail[last].pesanNotifikasi == null || this.listInputDetail[last].titleNotifikasi == "" || this.listInputDetail[last].pesanNotifikasi == ""){
					this.alertService.warn('Peringatan','Lengkapi Data Detail');
				}
				else {
					let dataTemp = {
						"ruanganTujuan": {
							"namaRuanganTujuan" : '--Pilih Ruangan Tujuan--',
							"kdRuanganTujuan" : null
						},
						"jabatanTujuan": {
							"namaJabatanTujuan" : '--Pilih Jabatan Tujuan--',
							"kdJabatanTujuan" : null
						} ,
						"titleNotifikasi": "" ,
						"pesanNotifikasi": "",
						"statusEnabled" : true
					}
					let listInputDetail = [...this.listInputDetail];
					listInputDetail.push(dataTemp);
					this.listInputDetail = listInputDetail;
				}
			}
		}

		getDetail(event){
			let kdmodultujuan;

			let kode = event.data.kode.kode;
			this.httpService.get(Configuration.get().dataMasterNew + '/NotifMessaging/findByKode/'+kode).subscribe(table =>{
				let dataDetail = table.NotifMessagingObjekModulAplikasi[0];
				this.form.get('kdModulAplikasiTujuan').setValue(dataDetail.kdModulAplikasiTujuan);
				this.form.get('customUrlObjekModul').setValue(dataDetail.customURLObjekModul);
				this.form.get('namaFungsiFrontEnd').setValue(dataDetail.namaFungsiFrontEnd);
				this.form.get('kdRuanganTujuan').setValue(dataDetail.kdRuanganTujuan);
				this.form.get('kdJabatanTujuan').setValue(dataDetail.kdJabatanTujuan);
				this.form.get('titleNotifikasi').setValue(dataDetail.titleNotifikasi);
				this.form.get('pesanNotifikasi').setValue(dataDetail.pesanNotifikasi);


				kdmodultujuan = this.form.get('kdModulAplikasiTujuan').value;
				this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findObjekModulAplikasiTujuan/'+kdmodultujuan).subscribe(res => {
					this.listObjekModulAplikasiTujuan = [];
					this.listObjekModulAplikasiTujuan.push({label:'--Pilih Objek Modul Aplikasi Tujuan--', value:null})
					for(var i=0;i<res.objekModul.length;i++) {
						this.listObjekModulAplikasiTujuan.push({label:res.objekModul[i].namaObjekModulAplikasi, value:res.objekModul[i].kdObjekModulAplikasi})
					};
				});


				this.form.get('kdObjekModulAplikasiTujuan').setValue(dataDetail.kdObjekModulAplikasiTujuan);

				this.form.get('kdModulAplikasiTujuan').disable();
				this.form.get('kdObjekModulAplikasiTujuan').disable();

			});


			

			
		}

		getDataInput(a){
			let kode = a.data.kode.kode;
			this.httpService.get(Configuration.get().dataMasterNew + '/NotifMessaging/findByKode/'+kode).subscribe(table => {
				let namaFungsiFrontEnd;
				let customUrlObjekModul;
				let kdModulAplikasiTujuan;
				let kdObjekModulAplikasiTujuan;
				let dataGridInput = table.NotifMessagingObjekModulAplikasi;
				this.listInputDetail = [];
				let dataFix;
				for(let i=0; i<dataGridInput.length; i++){
					dataFix = {
						"ruanganTujuan": {
							"namaRuanganTujuan" : dataGridInput[i].namaRuangan,
							"kdRuanganTujuan" : dataGridInput[i].kdRuanganTujuan
						},
						"jabatanTujuan": {
							"namaJabatanTujuan" : dataGridInput[i].namaJabatanTujuan,
							"kdJabatanTujuan" : dataGridInput[i].kdJabatanTujuan
						} ,
						"titleNotifikasi": dataGridInput[i].titleNotifikasi ,
						"pesanNotifikasi": dataGridInput[i].pesanNotifikasi,
						"statusEnabled" : dataGridInput[i].statusEnabled
					}
					this.listInputDetail.push(dataFix);
					namaFungsiFrontEnd = dataGridInput[i].namaFungsiFrontEnd;
					customUrlObjekModul = dataGridInput[i].customURLObjekModul;
					kdModulAplikasiTujuan = dataGridInput[i].kdModulAplikasiTujuan;
					kdObjekModulAplikasiTujuan = dataGridInput[i].kdObjekModulAplikasiTujuan;
				}

				this.form.get('kdModulAplikasiTujuan').setValue(kdModulAplikasiTujuan);
				this.form.get('kdObjekModulAplikasiTujuan').setValue(kdObjekModulAplikasiTujuan);
				this.form.get('customUrlObjekModul').setValue(customUrlObjekModul);
				this.form.get('namaFungsiFrontEnd').setValue(namaFungsiFrontEnd);
			})

		}

		
	}

	class InisialMessaging implements Messaging {

		constructor(
			public id?,
			public kdProfile?,
			public kode?,
			public kdMessaging?,
			public namaMessaging?,
			public reportDisplay?,
			public kdMessagingHead?,
			public deskripsiDetailMessaging?,
			public kdObjekModulAplikasi?,
			public keteranganLainnya?,
			public statusEnabled?,
			public version?,
			public kodeExternal?,
			public namaExternal?,
			public label?


			) {}

	}
