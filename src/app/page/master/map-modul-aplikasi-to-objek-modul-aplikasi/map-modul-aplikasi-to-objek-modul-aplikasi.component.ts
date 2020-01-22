import { ViewEncapsulation, Inject, forwardRef, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService,TreeNode } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { SelectItem } from 'primeng/primeng';

@Component({
	selector: 'app-map-modul-aplikasi-to-objek-modul-aplikasi',
	templateUrl: './map-modul-aplikasi-to-objek-modul-aplikasi.component.html',
	styleUrls: ['./map-modul-aplikasi-to-objek-modul-aplikasi.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ConfirmationService]
})
export class MapModulAplikasiToObjekModulAplikasiComponent implements OnInit {
	
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
	listDropdownVersion: any[];
	kodeKelompok:any[];
	listDataBank = [];
	pencarianB:string;

	selectedVersion: any;
	openDropdownKey: boolean;
	selectedFilesVersion: TreeNode[];
    selectKdVersion: any;
    listVersion:any[];


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
		this.openDropdownKey = false;
		this.listVersion = [];
		this.selectedVersion = null;
		this.selectKdVersion = '';
		
		console.log(this.authGuard);
		this.pencarianB = '';
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.versi = 1;
		this.hasilCek = true;

		this.formAktif = true;
		//this.get(this.page, this.rows, '');
		this.form = this.fb.group({
			'kdModulAplikasi': new FormControl('', Validators.required),
			//'kdVersion':new FormControl('', Validators.required),
			'kdKelompokTransaksi':new FormControl()
		});
		
		this.listPilih = [];
		this.listData = [];
		this.listDataBank = [];
		this.getService();
	}

	getService(){
        // this.httpService.get(Configuration.get().dataMasterNew + '/version/findAll?page=1&rows=1000&dir=namaVersion&sort=desc').subscribe(res => {
		// 	this.listDropdownVersion = [];
		// 	this.listDropdownVersion.push({ label: '--Pilih--', value: null })
		// 	for (let i = 0; i < res.Version.length; i++) {
		// 		this.listDropdownVersion.push({ label: res.Version[i].namaVersion, value: res.Version[i].kode })
		// 	};
		// });

		this.httpService.get(Configuration.get().dataMasterNew + '/version/getVersion').subscribe(res => {
			this.listVersion = [];
			for(let i = 0; i < res.length; i++){
				this.listVersion[i] = {
					"label": res[i].namaVersion,
					"kode": res[i].kode,
					"children":[]
				}
				let child = [];
				for(let j = 0; j < res[i].child.length; j++){
					child[j] = {
						"label": res[i].child[j].namaVersion,
            			"kode": res[i].child[j].kode,
					}
					this.listVersion[i].children.push(child[j]);
				}
			}
			
		});

		this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListMA').subscribe(res => {
			this.listModulAplikasi = [];
			this.listModulAplikasi.push({ label: '--Pilih--', value: null })
			for (let i = 0; i < res.ModulAplikasi.length; i++) {
				this.listModulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		});

	this.httpService.get(Configuration.get().dataMasterNew + '/mapmodulaplikasitoobjekmodul/findKdKelompokTransaksi').subscribe(res => {
      this.kodeKelompok = [];
      this.kodeKelompok.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
      for (var i = 0; i < res.length; i++) {
        this.kodeKelompok.push({ label: res[i].namaKelompokTransaksi, value: res[i].kdKelompokTransaksi })
      };
    });
  
	}

	get(page: number, rows: number, search: any) { 
		this.httpService.get(Configuration.get().dataMasterNew + '/mapmodulaplikasitoobjekmodul/findAllListObj').subscribe(res => {
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
			//this.listDataBank = data;
		});		
	}

	clearPanelBawah(event){
		this.selectedVersion = event.node.label;
		this.selectKdVersion = event.node.kode;
		let kdModulAplikasi = this.form.get('kdModulAplikasi').value;
		// let kdVersion = event.value;
		let kdVersion = this.selectKdVersion;
		if (kdModulAplikasi == '' || kdModulAplikasi == null || kdModulAplikasi == undefined){
			this.get(this.page,this.rows, '');
			this.hasilCek = true;
			this.pilihSemua = false;
		}
		else {
			this.listData = [];
			this.listDataBank = [];
			this.hasilCek = false;

			let data = [];
			let mapObjek = [];

			this.httpService.get(Configuration.get().dataMasterNew + '/mapmodulaplikasitoobjekmodul/treeObjekModulAplikasi?kdModulAplikasi=' + kdModulAplikasi +'&kdVersion='+ kdVersion ).subscribe(res => {
				this.listData = res;
				this.listDataBank = res;
            });

			// this.httpService.get(Configuration.get().dataMasterNew + '/mapmodulaplikasitoobjekmodul/findAllListObjByMod?kdModulAplikasi='+ kdModulAplikasi).subscribe(res => {
			// 	for (let i=0; i<res.ObjekModulAplikasi.length; i++){
			// 		let tempData = {
			// 			"kode": res.ObjekModulAplikasi[i].kdObjekModulAplikasi,
			// 			"namaObjekModulAplikasi": res.ObjekModulAplikasi[i].namaObjekModulAplikasi,
			// 			"noUrutObjek": null,
			// 			"statusEnabled": false,
			// 			"statusSelect": false,
			// 			"isCheck": false
			// 		}
			// 		data.push(tempData);
			// 	}

			// 	this.httpService.get(Configuration.get().dataMaster+ '/mapmodulaplikasitoobjekmodul/findByKode/'+ kdModulAplikasi+'/'+kdVersion).subscribe(res =>{

			// 		for (let  j=0; j<res.MapModulAplikasiToObjekModul.length; j++){
			// 				let dataMap = {
			// 					"kode": res.MapModulAplikasiToObjekModul[j].kode.kdObjekModulAplikasi,
			// 					"namaObjekModulAplikasi": res.MapModulAplikasiToObjekModul[j].objekModulAplikasi.namaObjekModulAplikasi,
			// 					"noUrutObjek": res.MapModulAplikasiToObjekModul[j].noUrut,
			// 					"statusEnabled": res.MapModulAplikasiToObjekModul[j].statusEnabled,
			// 					"statusSelect": true,
			// 					"isCheck": true
			// 				}
			// 				mapObjek.push(dataMap);
			// 		}

			// 		let tamp = [];
			// 		for (let p=0; p<data.length; p++){
			// 			for (let q=0; q<mapObjek.length; q++){
			// 				if(data[p].kode == mapObjek[q].kode){
			// 					data[p].statusSelect = mapObjek[q].statusSelect;
			// 					data[p].noUrutObjek = mapObjek[q].noUrutObjek;
			// 					data[p].kode = mapObjek[q].kode;
			// 					data[p].namaObjekModulAplikasi = mapObjek[q].namaObjekModulAplikasi;
			// 					data[p].statusEnabled = mapObjek[q].statusEnabled;
			// 					data[p].isCheck = mapObjek[q].isCheck;
			// 				}
			// 			}
			// 		}
			// 		data = data.concat(tamp);
			// 		this.listData = data;
			// 		//this.listDataBank = data;

			// 	});

			// });
			
			
		}
		document.getElementById("dropdownTree").style.display = "none";
        this.openDropdownKey = false;
	}

	clearPanelBawahKelompokTransaksi(event){
		let kdModulAplikasi = this.form.get('kdModulAplikasi').value;
		let kdVersion = this.selectKdVersion;
		let kdKelompokTransaksi = event.value;

		this.listData = [];
		this.listDataBank = [];
		this.hasilCek = false;

		let data = [];
		let mapObjek = [];

		this.httpService.get(Configuration.get().dataMasterNew + '/mapmodulaplikasitoobjekmodul/treeObjekModulAplikasi?kdModulAplikasi=' + kdModulAplikasi +'&kdVersion='+ kdVersion +'&kdKelompokTransaksi='+ kdKelompokTransaksi ).subscribe(res => {
			this.listData = res;
			this.listDataBank = res;
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
			this.simpanV2();
		}
	}


	simpan() {
		let mapmodulaplikasitoobjekmodul = [];
		let error = 0;

		this.listPilih = [];
		for (let k=0; k<this.listData.length; k++){
			let pilih;
			if(this.listData[k].isCheck == true){
				pilih = {
					"kdModulAplikasi":  null,
					"kdObjekModulAplikasi": this.listData[k].kode,
					"noUrutObjek": this.listData[k].noUrutObjek,
					"statusEnabled": true,
				}
				this.listPilih.push(pilih);
			}else if (this.listData[k].statusEnabled == true) {
				pilih = {
					"kdModulAplikasi":  null,
					"kdObjekModulAplikasi": this.listData[k].kode,
					"noUrutObjek": this.listData[k].noUrutObjek,
					"statusEnabled": false,
				}
				this.listPilih.push(pilih);
			}
		}

		if (this.listPilih.length == 0) {
			let kdModulAplikasi = this.form.get('kdModulAplikasi').value;
			this.httpService.delete(Configuration.get().dataMaster + '/mapmodulaplikasitoobjekmodul/delByModApp/'+kdModulAplikasi+'/'+this.selectKdVersion).subscribe(response => {
				this.alertService.success('Berhasil','Data Berhasil Disimpan');
				this.pilihSemua = false;
			});
			this.ngOnInit();			

		}
		else {
			for (let i=0; i<this.listPilih.length; i++){
				let dataTemp = {

					"kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
					"kdObjekModulAplikasi":  this.listPilih[i].kdObjekModulAplikasi,
					"noUrut": this.listPilih[i].noUrutObjek,
      				"kdVersion": this.selectKdVersion,
      				"statusEnabled": this.listPilih[i].statusEnabled
				}
				if (this.listPilih[i].noUrutObjek === null || this.listPilih[i].noUrutObjek === ''){
					error = error+1;
				}
				mapmodulaplikasitoobjekmodul.push(dataTemp);
			}
		}

		if (error !=0){
			this.alertService.warn('Peringatan','Nomor Urut Objek Harus Diisi')
		}
		else {

			let dataSimpan = {
				"mapModulAplikasiToObjekModulDto" : mapmodulaplikasitoobjekmodul
			}

			this.httpService.update(Configuration.get().dataMaster + '/mapmodulaplikasitoobjekmodul/update/'+this.versi, dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil','Data Berhasil Disimpan');
				this.pilihSemua = false;
			});
			this.ngOnInit();
		}
	}

	cari(){
	}

	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}
	
	isParentChecked(event, data, index) {

		if (event == true) {
            if (data.children.length !== 0) {
                //anak
                for (let i = 0; i < data.children.length; i++) {
                    data.children[i].statusEnabled = true;

                    if (data.children[i].children.length !== 0) {
                        //cucu
                        for (let j = 0; j < data.children[i].children.length; j++) {
                            data.children[i].children[j].statusEnabled = true;
                            
                            if (data.children[i].children[j].children.length !== 0) {
                                //lv4
                                for (let k = 0; k < data.children[i].children[j].children.length; k++) {
                                    data.children[i].children[j].children[k].statusEnabled = true;
                                    if (data.children[i].children[j].children[k].children.length !== 0) {
                                        //lv5
                                        for (let l = 0; l < data.children[i].children[j].children[k].children.length; l++) {
                                            data.children[i].children[j].children[k].children[l].statusEnabled = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
		}else{
			if (data.children.length !== 0) {
                //anak
                for (let i = 0; i < data.children.length; i++) {
                    data.children[i].statusEnabled = false

                    if (data.children[i].children.length !== 0) {
                        //cucu
                        for (let j = 0; j < data.children[i].children.length; j++) {
                            data.children[i].children[j].statusEnabled = false

                            if (data.children[i].children[j].children.length !== 0) {
                                //lv4
                                for (let k = 0; k < data.children[i].children[j].children.length; k++) {
                                    data.children[i].children[j].children[k].statusEnabled = false

                                    if (data.children[i].children[j].children[k].children.length !== 0) {
                                        //lv5
                                        for (let l = 0; l < data.children[i].children[j].children[k].children.length; l++) {
                                            data.children[i].children[j].children[k].children[l].statusEnabled = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }	
		}
		

	}

	toggleCoba(rowData: any, dtEn: any) {
        dtEn.toggleRow(rowData);
	}
	
	globalFilter(filterValue: string) {
		this.listData = []
		for (let i = 0; i < this.listDataBank.length; i++) {
			let parent = this.listDataBank[i].namaObjekModulAplikasi;
			let x = parent.toLowerCase().includes(filterValue.toLowerCase())
			console.log(x)
			if (x) {
				this.listData.push(this.listDataBank[i]);
			}
		}
	}

	simpanV2(){
		if(this.selectKdVersion == ''){
			this.alertService.warn('Perhatian','Harap Pilih Version Terlebih Dahulu');
		}else{
			let entry = []
        let enParent;
        let enAnak
        let enCucu
        let enEmpat
        let enLima
        for (let i = 0; i < this.listData.length; i++) {
            enParent = {
                	"kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
					"kdObjekModulAplikasi":  this.listData[i].kdObjekModulAplikasi,
					"noUrut": 0,
					  // "kdVersion": this.form.get('kdVersion').value,
					  "kdVersion": this.selectKdVersion,
      				"statusEnabled": this.listData[i].statusEnabled
            }
            entry.push(enParent)
            for (let j = 0; j < this.listData[i].children.length; j++) {
                enAnak = {
                    "kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
					"kdObjekModulAplikasi":  this.listData[i].children[j].kdObjekModulAplikasi,
					"noUrut": 0,
					"kdVersion": this.selectKdVersion,
      				"statusEnabled": this.listData[i].children[j].statusEnabled
                }
                entry.push(enAnak)
                for (let k = 0; k < this.listData[i].children[j].children.length; k++) {
                    enCucu = {
                        "kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
						"kdObjekModulAplikasi":  this.listData[i].children[j].children[k].kdObjekModulAplikasi,
						"noUrut": 0,
						"kdVersion": this.selectKdVersion,
      					"statusEnabled": this.listData[i].children[j].children[k].statusEnabled
                    }
                    entry.push(enCucu)
                    for (let l = 0; l < this.listData[i].children[j].children[k].length; l++) {
                        enEmpat = {
							"kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
							"kdObjekModulAplikasi":  this.listData[i].children[j].children[k].children[l].kdObjekModulAplikasi,
							"noUrut": 0,
							"kdVersion": this.selectKdVersion,
							"statusEnabled": this.listData[i].children[j].children[k].children[l].statusEnabled
                        }
                        entry.push(enEmpat)
                        for (let m = 0; m < this.listData[i].children[j].children[k].children[l].children.length; m++) {
                            enLima = {
                                "kdModulAplikasi":  this.form.get('kdModulAplikasi').value,
								"kdObjekModulAplikasi":  this.listData[i].children[j].children[k].children[l].children[m].kdObjekModulAplikasi,
								"noUrut": 0,
								"kdVersion": this.selectKdVersion,
								"statusEnabled": this.listData[i].children[j].children[k].children[l].children[m].statusEnabled
                            }
                            entry.push(enLima)
                        }
                    }
                }
            }
		}
		
		let dataSimpan = {
			"mapModulAplikasiToObjekModulDto" : entry
		}

		console.log(dataSimpan);

		this.httpService.update(Configuration.get().dataMaster + '/mapmodulaplikasitoobjekmodul/update/'+this.versi, dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil','Data Berhasil Disimpan');
		});
		}

		
		//this.ngOnInit();
	}

	openDropdown(){
		if (this.openDropdownKey) {
			document.getElementById("dropdownTree").style.display = "none";
			this.openDropdownKey = false;
		  } else {
			document.getElementById("dropdownTree").style.display = "block";
			this.openDropdownKey = true;
		  }
	}

	nodeSelect(event){

		this.selectedVersion = event.node.label;
		this.selectKdVersion = event.node.kode;
		
	}





}
