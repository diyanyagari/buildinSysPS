import { Inject, forwardRef, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { SelectItem } from 'primeng/primeng';

@Component({
	selector: 'app-map-objek-modul-to-modul-aplikasi',
	templateUrl: './map-objek-modul-to-modul-aplikasi.component.html',
	styleUrls: ['./map-objek-modul-to-modul-aplikasi.component.scss'],
	providers: [ConfirmationService]
})
export class MapObjekModulToModulAplikasiComponent implements OnInit {
	
	listModulAplikasi: any[];
	selected: any[];
	listData: any[];
	pencarian: string;
	dataDummy: {};
	formAktif: boolean;
	versi: any;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	Encryipted: any;

	pilihSemua: boolean;
	hasilCek: boolean = false;
	pilihan: any[];
	pilihan2: any[];
	cekPilihObjek: boolean;

	isEncrypted: boolean;

	listPilih : any[];


	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		private formBuilder: FormBuilder,
		private cdRef: ChangeDetectorRef,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {

	}

	ngOnInit() {
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.versi = 1;
		this.hasilCek = true;

		this.formAktif = true;
		this.get(this.page, this.rows, '');
		this.form = this.fb.group({
			'kdModulAplikasi': new FormControl('', Validators.required),
		});
		// this.selected = [];

		//dd list modul aplikasi
		this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListMA').subscribe(res => {
			this.listModulAplikasi = [];
			this.listModulAplikasi.push({ label: '--Pilih Modul Aplikasi--', value: null })
			for (let i = 0; i < res.ModulAplikasi.length; i++) {
				this.listModulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		});
		this.listPilih = [];
	}

	get(page: number, rows: number, search: any) { 
		this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListObj').subscribe(res => {
			this.listData = [];
			let data = [...this.listData];
			for (let i=0; i<res.ObjekModulAplikasi.length; i++){
				let tempData = {
					"kode": res.ObjekModulAplikasi[i].kdObjekModulAplikasi,
					"namaObjekModulAplikasi": res.ObjekModulAplikasi[i].namaObjekModulAplikasi,
					"noUrutObjek": null,
					"isEncrypted": false,
					"statusEnabled": true,
					"statusSelect": false,
					"isCheck": null
				}
				data.push(tempData);
			}
			this.listData = data;
			// this.listData.forEach(function (data) {
			// 	data.statusSelect = false;
			// })
		});		
	}

	clearPanelBawah(event){
		let kdModulAplikasi = event.value;
		if (kdModulAplikasi == '' || kdModulAplikasi == null || kdModulAplikasi == undefined){
			this.get(this.page,this.rows, '');
			this.hasilCek = true;
			// this.selected = [];
			this.pilihSemua = false;
		}
		else {
			this.listData = [];
			// this.selected = [];
			// this.get(this.page, this.rows, '');

			this.hasilCek = false;
			// this.pilihSemua = false;

			let data = [];
			let mapObjek = [];

			this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListObjByMod?kdModulAplikasi='+ kdModulAplikasi).subscribe(res => {
				for (let i=0; i<res.ObjekModulAplikasi.length; i++){
					let tempData = {
						"kode": res.ObjekModulAplikasi[i].kdObjekModulAplikasi,
						"namaObjekModulAplikasi": res.ObjekModulAplikasi[i].namaObjekModulAplikasi,
						"noUrutObjek": null,
						"isEncrypted": false,
						"statusEnabled": true,
						"statusSelect": false,
						"isCheck": false
					}
					data.push(tempData);
				}

				this.httpService.get(Configuration.get().dataMaster+ '/mapobjekmodultomodulaplikasi/findByKode?kdModulAplikasi=' + kdModulAplikasi).subscribe(res =>{

					for (let  j=0; j<res.MapObjekModulToModulAplikasi.length; j++){
						if(res.MapObjekModulToModulAplikasi[j].isEncrypted ==1){
							let dataMap = {
								"kode": res.MapObjekModulToModulAplikasi[j].kode.kdObjekModulAplikasi,
								"namaObjekModulAplikasi": res.MapObjekModulToModulAplikasi[j].namaObjekModulAplikasi,
								"noUrutObjek": res.MapObjekModulToModulAplikasi[j].noUrutObjek,
								"isEncrypted": true,
								"statusEnabled": res.MapObjekModulToModulAplikasi[j].statusEnabled,
								"statusSelect": true,
								"isCheck": true
							}
							mapObjek.push(dataMap);
						}
						else{
							let dataMap = {
								"kode": res.MapObjekModulToModulAplikasi[j].kode.kdObjekModulAplikasi,
								"namaObjekModulAplikasi": res.MapObjekModulToModulAplikasi[j].namaObjekModulAplikasi,
								"noUrutObjek": res.MapObjekModulToModulAplikasi[j].noUrutObjek,
								"isEncrypted": false,
								"statusEnabled": res.MapObjekModulToModulAplikasi[j].statusEnabled,
								"statusSelect": true,
								"isCheck": true
							}
							mapObjek.push(dataMap);
						}
					}

					let tamp = [];
					for (let p=0; p<data.length; p++){
						for (let q=0; q<mapObjek.length; q++){
							if(data[p].kode == mapObjek[q].kode){
								data[p].isEncrypted = mapObjek[q].isEncrypted;
								data[p].statusSelect = mapObjek[q].statusSelect;
								data[p].noUrutObjek = mapObjek[q].noUrutObjek;
								data[p].kode = mapObjek[q].kode;
								data[p].namaObjekModulAplikasi = mapObjek[q].namaObjekModulAplikasi;
								data[p].statusEnabled = mapObjek[q].statusEnabled;
								data[p].isCheck = mapObjek[q].isCheck;
							}
						}
					}
					data = data.concat(tamp);
					this.listData = data;

				});

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

	convEncrypted(event){
		if (event == true){
			return 1;
		}
		else {
			return 0;
		}
	}

	changeSelectedData(event,kode){
		let dataTerpilih = [...this.selected]
		for (let i=0;i<dataTerpilih.length;i++){
			if (dataTerpilih[i].kode == kode) {
				dataTerpilih[i].isEncrypted = event
			}
		}
		this.selected = dataTerpilih;
	}

	changeConvert(event) {
		if (event == true) {
			return 1;
		} else {
			return 0;
		}
	}

	disNoUrut(event,index){
		if (event == true) {
			this.cekPilihObjek = true;
		}
		else {
			this.cekPilihObjek = false;
		}
	}

	selectAll(event){
		let listData = [...this.listData];
		for (let i=0 ;i<listData.length;i++){
			if (event.data.kode !=null) {
				listData[i].statusSelect = true;
			}
			else {
				// listData[i].statusSelect = false;
				// listData[i].noUrutObjek = null;
				// listData[i].isEncrypted = false;
			}
		}
		this.listData = listData
	}

	onRowSelect(event){
		let listData = [...this.listData];
		for (let i=0 ;i<listData.length;i++){
			if (listData[i].kode == event.data.kode) {
				listData[i].statusSelect = true;
			}
			else {				
				// listData[i].statusSelect = false;
				// listData[i].noUrutObjek = null;
				// listData[i].isEncrypted = false;
			}
		}
		this.listData = listData
		console.log(listData)
	}

	onRowUnselect(event){
		let listData = [...this.listData];
		for (let i=0 ;i<listData.length;i++){
			if (listData[i].kode == event.data.kode) {
				listData[i].statusSelect = false;
				listData[i].noUrutObjek = null;
				listData[i].isEncrypted = false;
			}
		}
		this.listData = listData
		console.log(listData)
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
		let mapObjekModulToModulAplikasi = [];
		let error = 0;

		this.listPilih = [];
		for (let k=0; k<this.listData.length; k++){
			let pilih;
			if(this.listData[k].isCheck == true){
				pilih = {
					"isEncrypted": this.listData[k].isEncrypted,
					"kdModulAplikasi":  null,
					"kdObjekModulAplikasi": this.listData[k].kode,
					"noUrutObjek": this.listData[k].noUrutObjek,
					"statusEnabled": true,
				}
				this.listPilih.push(pilih);
			}
		}

		if (this.listPilih.length == 0) {
			// if (this.selected.length == 0){
			// this.alertService.warn('Peringatan','Pilih Minimal Satu Objek Modul Aplikasi')

			let kdModulAplikasi = this.form.get('kdModulAplikasi').value;

			this.httpService.delete(Configuration.get().dataMaster + '/mapobjekmodultomodulaplikasi/delByModApp/'+kdModulAplikasi).subscribe(response => {
				this.alertService.success('Berhasil','Data Berhasil Disimpan');
				this.pilihSemua = false;
			});
			this.ngOnInit();			

		}
		else {
			for (let i=0; i<this.listPilih.length; i++){
			// for (let i=0; i<this.selected.length; i++){
				let dataTemp = {

					"isEncrypted": this.changeConvert(this.listPilih[i].isEncrypted),
					"kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
					"kdObjekModulAplikasi":  this.listPilih[i].kdObjekModulAplikasi,
					"noUrutObjek": this.listPilih[i].noUrutObjek,
					"statusEnabled": true,

					// "isEncrypted": this.changeConvert(this.selected[i].isEncrypted),
					// "kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
					// "kdObjekModulAplikasi":  this.selected[i].kode,
					// "noUrutObjek": this.selected[i].noUrutObjek,
					// "statusEnabled": true,
				}
				if (this.listPilih[i].noUrutObjek === null || this.listPilih[i].noUrutObjek === ''){
				// if (this.selected[i].noUrutObjek == null || this.selected[i].noUrutObjek == ''){
					error = error+1;
				}
				mapObjekModulToModulAplikasi.push(dataTemp);
			}
		}

		if (error !=0){
			this.alertService.warn('Peringatan','Nomor Urut Objek Harus Diisi')
		}
		else {

			let dataSimpan = {
				"mapObjekModulToModulAplikasi" : mapObjekModulToModulAplikasi
			}

			this.httpService.update(Configuration.get().dataMaster + '/mapobjekmodultomodulaplikasi/update/'+this.versi, dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil','Data Berhasil Disimpan');
				this.pilihSemua = false;
			});
			this.ngOnInit();
		}
	}

	cari(){
		// this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListObj?namaObj='+this.pencarian).subscribe(res => {
		// 	this.listData = [];
		// 	let data = [...this.listData];
		// 	for (let i=0; i<res.ObjekModulAplikasi.length; i++){
		// 		let tempData = {
		// 			"kode": res.ObjekModulAplikasi[i].kdObjekModulAplikasi,
		// 			"namaObjekModulAplikasi": res.ObjekModulAplikasi[i].namaObjekModulAplikasi,
		// 			"noUrutObjek": null,
		// 			"isEncrypted": false,
		// 			"statusEnabled": true,
		// 		}
		// 		data.push(tempData);
		// 	}
		// 	this.listData = data;
		// 	this.listData.forEach(function (data) {
		// 		data.statusSelect = false;
		// 	})
		// });		
	}

	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }





}
