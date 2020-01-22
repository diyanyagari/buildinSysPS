import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { Configuration ,AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-notif-messaging',
	templateUrl: './notif-messaging.component.html',
	styleUrls: ['./notif-messaging.component.scss'],
	providers: [ConfirmationService]
})
export class NotifMessagingComponent implements OnInit {
	item : any;
	selected: any;
	listData: any[];
	dataDummy:{};
	kodeMessagingHead: any[];
	kodeObjekModulAplikasi: any[];
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
				'kdObjekModulAplikasi' : new FormControl(null),
				'keteranganLainnya' : new FormControl(null),
				'kode' : new FormControl(null),
				'namaMessaging' : new FormControl(null,Validators.required),
				'qtyHariBefore' : new FormControl(null),
				'qtyHariFreq' : new FormControl(null),
				'qtyMessaging' : new FormControl(null),
				'statusEnabled' : new FormControl(true),
			});

			this.getDD();
			this.getDataGrid(this.page,this.rows,this.pencarian);
		}

		downloadExcel(){

		}

		downloadPdf(){

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
			this.httpService.get(Configuration.get().dataMasterNew+'/objekmodulaplikasi/findAll?page=1&rows=10000&dir=namaObjekModulAplikasi&sort=desc').subscribe(res => {
				this.listObjekModulAplikasi = [];
				this.listObjekModulAplikasi.push({label:'--Pilih Objek Modul Aplikasi--', value:null})
				for(var i=0;i<res.ObjekModulAplikasi.length;i++) {
					this.listObjekModulAplikasi.push({label:res.ObjekModulAplikasi[i].namaObjekModulAplikasi, value:res.ObjekModulAplikasi[i].kode})
				};
			});
		}

		getDataGrid(page: number, rows: number, cari:string) {
			this.httpService.get(Configuration.get().dataMasterNew+'/NotifMessaging/findAll?page='+page+'&rows='+rows+'&dir=namaMessaging&sort=desc&namaMessaging='+cari).subscribe(table => {
				this.listData = table.NotifMessaging;
				this.totalRecords = table.totalRow;
			});   
		}

		cari() {
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
			this.httpService.update(Configuration.get().dataMasterNew+'/NotifMessaging/update/'+this.versi, this.form.value).subscribe(response =>{
				this.alertService.success('Berhasil','Data Diperbarui');
				this.ngOnInit();
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
				this.httpService.post(Configuration.get().dataMasterNew+'/NotifMessaging/save', this.form.value).subscribe(response =>{
					this.alertService.success('Berhasil','Data Disimpan');
					this.reset();
				});  
			}
		}

		reset(){
			this.ngOnInit();
		}

		onRowSelect(event) {
			let cloned = this.clone(event.data);
			this.formAktif = false;
			this.form.setValue(cloned);
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
			}
			this.versi = cloned.version
			return fixHub;
		}

		hapus() {
			let item = [...this.listData]; 
			let deleteItem = item[this.findSelectedIndex()];
			this.httpService.delete(Configuration.get().dataMasterNew+'/NotifMessaging/del/'+this.form.get('kode').value).subscribe(response => {
				this.alertService.success('Berhasil','Data Dihapus');
				this.ngOnInit();
			});
		}

		findSelectedIndex(): number {
			return this.listData.indexOf(this.selected);
		}

		onDestroy(){

		}  

	}

	