import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, TreeModule, TreeNode, AccordionModule, TreeTableModule, SharedModule, Dropdown } from 'primeng/primeng';

@Component({
	selector: 'app-map-paket-modul-aplikasi-to-objek-modul',
	templateUrl: './map-paket-modul-aplikasi-to-objek-modul.component.html',
	styleUrls: ['./map-paket-modul-aplikasi-to-objek-modul.component.scss'],
	providers: [ConfirmationService],
	encapsulation: ViewEncapsulation.None
})
export class MapPaketModulAplikasiToObjekModulComponent implements OnInit {

	program: any;
	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	manualHelpHead: any = [];
	manualHelpLink: any = [];
	listMdlAplikasi: any = [];
	listBahasa: any = [];
	jenisManualHead: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	listData = [];
	listDataBank = [];
	listVersion: any[];
	jsonFile: any;
	pathJson: string;
	kode: any;
	kdBahasa: number;
	kdMdlAplikasi: number;
	pencarian: string;

	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	isImport: boolean;
	first: any = 0;
	disButton: boolean = false;

	jsonToFile: any = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
	selectedMenu: any[];
	buttonAktif: boolean = true;
	konfirmasiDialog: boolean = false;
	listDropdownVersion: any[];
	listDropdownProfile: any[];
	isSuperAdmin: boolean = false;

	dataRegForm = [];
	selectedVersion: any;
	openDropdownKey: boolean;
	selectedFiles: TreeNode[];
	selectKdVersion: any;
	tampungVersionAdmin: any;

	listPaket;
	modulAplikasi;
	edisi;
	kelompokKlien;
	kdprof: any;
	data;



	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		private confirmationService: ConfirmationService) {
		// this.smbrImage = Configuration.get().resourceFile + "/image/show/profile1213123.png";
		// this.smbrCover = Configuration.get().resourceFile + "/image/show/profile1213123.png";
	}

	ngAfterViewInit() {
		var x = document.getElementsByClassName("ui-state-default ui-unselectable-text") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.border = '0px';
		}

		var styleButton = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left ui-state-focus") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < styleButton.length; i++) {
			styleButton[i].style.backgroundColor = '#3c67b1';
		}


	}

	ngOnInit() {
		//this.tampungVersionAdmin = [];
		this.openDropdownKey = false;
		this.listVersion = [];
		this.selectedVersion = null;
		this.selectKdVersion = '';
		this.disButton = false;

		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.form = this.fb.group({
			'kdProfile': new FormControl(null),
			'kdPaket': new FormControl(null, Validators.required),
			'kdModulAplikasi': new FormControl('', Validators.required),
			'kdVersion': new FormControl(null, Validators.required),
			'kdEdisi': new FormControl(null, Validators.required),
			'kdKelompokKlien': new FormControl('', Validators.required),
			'kdObjekModulAplikasi': new FormControl(''),
			'statusAktif': new FormControl(''),
		});
		this.getListBahasa();
		this.getListModulAplikasi();
		this.getService();

		this.getPaket();
		this.getModulAplikasi();
		this.getEdisi();
		this.getKelompokKlien();
		// this.download(JSON.stringify({ "name":"John", "age":30, "city":"New York"}), 'json.txt', 'text/plain');
		// this.getObjek(this.page, this.rows, '')
	}

	getObjek(page: number, rows: number, pencarian: string) {
		page = page - 1;
		if(pencarian == ''){
			this.listData = [];
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/ObjekModulAplikasi/GetAllObjekByMapPaketModulAplikasiToObjekWithoutPage?kdProfile='
			+ this.kdprof
			+ '&kdPaket=' + this.form.get('kdPaket').value
			+ '&kdModulAplikasi=' + this.form.get('kdModulAplikasi').value
			+ '&kdVersion=' + this.form.get('kdVersion').value
			+ '&kdEdisi=' + this.form.get('kdEdisi').value
			+ '&kdKelompokKlien=' + this.form.get('kdKelompokKlien').value).subscribe(res => {


				for (let i = 0; i < res.length; i++) {
					if (res[i].checked == 1) {
						res[i].statusAktif = true
					}
					if (res[i].childs.length != 0) {
						for (let j = 0; j < res[i].childs.length; j++) {
							if (res[i].childs[j].checked == 1) {
								res[i].childs[j].statusAktif = true
							}
							if (res[i].childs[j].childs.length != 0) {
								for (let k = 0; k < res[i].childs[j].childs.length; k++) {
									if (res[i].childs[j].childs[k].checked == 1) {
										res[i].childs[j].childs[k].statusAktif = true
									}
								}
							}
						}
					}
				}
				this.listData = res;
			});
		} else {
			this.listData = [];
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/ObjekModulAplikasi/GetAllObjekByMapPaketModulAplikasiToObjekWithoutPage?kdProfile='
			+ this.kdprof
			+ '&kdPaket=' + this.form.get('kdPaket').value
			+ '&kdModulAplikasi=' + this.form.get('kdModulAplikasi').value
			+ '&kdVersion=' + this.form.get('kdVersion').value
			+ '&kdEdisi=' + this.form.get('kdEdisi').value
			+ '&kdKelompokKlien=' + this.form.get('kdKelompokKlien').value
			+ '&keyword=' + pencarian).subscribe(res => {


				for (let i = 0; i < res.length; i++) {
					if (res[i].checked == 1) {
						res[i].statusAktif = true
					}
					if (res[i].childs.length != 0) {
						for (let j = 0; j < res[i].childs.length; j++) {
							if (res[i].childs[j].checked == 1) {
								res[i].childs[j].statusAktif = true
							}
							if (res[i].childs[j].childs.length != 0) {
								for (let k = 0; k < res[i].childs[j].childs.length; k++) {
									if (res[i].childs[j].childs[k].checked == 1) {
										res[i].childs[j].childs[k].statusAktif = true
									}
								}
							}
						}
					}
				}
				this.listData = res;
			});
		}
	}

	getPaket() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/Paket').subscribe(res => {
			this.listPaket = [];
			this.listPaket.push({ label: '--Pilih--', value: null })
			for (let i = 0; i < res.length; i++) {
				this.listPaket.push({ label: res[i].namaPaket, value: res[i].kdPaket })
			};
		});
	}

	getModulAplikasi() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/ModulAplikasi').subscribe(res => {
			this.modulAplikasi = [];
			this.modulAplikasi.push({ label: '--Pilih--', value: null })
			for (let i = 0; i < res.length; i++) {
				this.modulAplikasi.push({ label: res[i].modulAplikasi, value: res[i].kdModulAplikasi })
			};
		});
	}

	getEdisi() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/Edisi').subscribe(res => {
			this.edisi = [];
			this.edisi.push({ label: '--Pilih--', value: null })
			for (let i = 0; i < res.length; i++) {
				this.edisi.push({ label: res[i].namaEdisi, value: res[i].kdEdisi })
			};
		});
	}

	getKelompokKlien() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/KelompokKlien').subscribe(res => {
			this.kelompokKlien = [];
			this.kelompokKlien.push({ label: '--Pilih--', value: null })
			for (let i = 0; i < res.length; i++) {
				this.kelompokKlien.push({ label: res[i].namaKelompokKlien, value: res[i].kdKelompokKlien })
			};
		});
	}

	getService() {
		//this.listDropdownVersion = [];

		// this.httpService.get(Configuration.get().dataMasterNew + '/version/findAll?page=1&rows=1000&dir=namaVersion&sort=desc').subscribe(res => {
		// 	this.listDropdownVersion = [];
		// 	this.listDropdownVersion.push({ label: '--Pilih--', value: null })
		// 	for (let i = 0; i < res.Version.length; i++) {
		// 		this.listDropdownVersion.push({ label: res.Version[i].namaVersion, value: res.Version[i].kode })
		// 	};
		// });
		let tampungLabelVersion;
		let tampungKodeVersion;

		this.httpService.get(Configuration.get().dataMasterNew + '/version/getVersion').subscribe(res => {
			this.listVersion = [];
			for (let i = 0; i < res.length; i++) {
				this.listVersion[i] = {
					"label": res[i].namaVersion,
					"kode": res[i].kode,
					"children": []
				}
				let child = [];
				for (let j = 0; j < res[i].child.length; j++) {
					child[j] = {
						"label": res[i].child[j].namaVersion,
						"kode": res[i].child[j].kode,
					}
					this.listVersion[i].children.push(child[j]);
				}
			}

			for (let y = 0; y < this.listVersion.length; y++) {
				for (let z = 0; z < this.listVersion[y].children.length; z++) {
					if (this.listVersion[y].children[z].kode == this.authGuard.getUserDto().kdVersion) {
						tampungLabelVersion = this.listVersion[y].children[z].label;
						tampungKodeVersion = this.authGuard.getUserDto().kdVersion;
					}
				}
			}

			let isSuperAdmin = this.authGuard.getUserDto().idKelompokUser;
			console.log(this.authGuard.getUserDto().idProfile)
			console.log(this.authGuard.getUserDto().kdVersion)
			console.log(this.authGuard.getUserDto().kdModulAplikasi)
			if (isSuperAdmin == 1) {
				this.isSuperAdmin = true;
			} else {
				this.form.get("kdProfile").setValue(this.authGuard.getUserDto().idProfile);
				//this.form.get("version").setValue(this.authGuard.getUserDto().kdVersion);
				this.selectedVersion = tampungLabelVersion;
				this.selectKdVersion = tampungKodeVersion;
				//this.selectedVersion = this.authGuard.getUserDto().kdVersion;
				this.form.get("kdModulAplikasi").setValue(this.authGuard.getUserDto().kdModulAplikasi);
				this.form.get("kdProfile").disable();
				//this.form.get("version").disable();
				this.form.get("kdModulAplikasi").disable();
				this.isSuperAdmin = false;
			}
			//this.tampungVersionAdmin = this.listVersion;

		});

		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findAll?page=1&rows=1000&dir=namaLengkap&sort=desc').subscribe(res => {
			this.listDropdownProfile = [];
			this.listDropdownProfile.push({ label: '--Pilih--', value: null })
			for (var i = 0; i < res.Profile.length; i++) {
				this.listDropdownProfile.push({ label: res.Profile[i].namaLengkap, value: res.Profile[i].kode })
			};
		}, error => {
			this.listDropdownProfile = [];
			this.listDropdownProfile.push({ label: '-- ' + error + ' --', value: '' })
		});



	}

	getListBahasa() {
		this.httpService.get(Configuration.get().dataMasterNew + '/bahasa/findAllBahasa?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(table => {
			this.listBahasa = [];
			this.listBahasa.push({ label: '-- Pilih Bahasa --', value: '' })
			for (var i = 0; i < table.bahasa.length; i++) {
				this.listBahasa.push({
					label: table.bahasa[i].namaBahasa, value:
					{
						"nilai": table.bahasa[i].kodeExternal,
						"nama": table.bahasa[i].namaBahasa,
						"kode": table.bahasa[i].kode.kode
					}
				})
			};
		});
	}

	getListModulAplikasi() {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllData').subscribe(table => {
			this.listMdlAplikasi = [];
			this.listMdlAplikasi.push({ label: '-- Pilih Modul Aplikasi --', value: '' })
			for (var i = 0; i < table.ModulAplikasi.length; i++) {
				this.listMdlAplikasi.push({ label: table.ModulAplikasi[i].namaModulAplikasi, value: table.ModulAplikasi[i].kode })
			};
		});
	}

	getListVersion() {
		let kdBhs = this.form.get('kdBahasa').value;
		let kdMdl = this.form.get('kdModulAplikasi').value;
		this.httpService.get(Configuration.get().authLogin + '/language-manager/getVersion/' + kdBhs.kode + '/' + kdMdl).subscribe(table => {
			this.listVersion = [];
			this.listVersion.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < table.data.length; i++) {
				this.listVersion.push({ label: table.data[i].version, value: table.data[i].version })
			};
		});
	}

	getList() {
		// let kdBhs = this.form.get('kdBahasa').value;
		// let kdMdl = this.form.get('kdModulAplikasi').value;
		// let version = this.form.get('version').value;
		// let version = this.selectKdVersion;
		// if ((kdBhs != "") && (kdMdl != "")) {
		// 	this.disButton = true;
		// 	if (this.jsonFile == null) {
		// 		this.isImport = false;
		// 		//ini dari findByKode
		// 		this.manageData(kdBhs.kode);
		// 	} else {
		// 		this.isImport = true;
		// 		//ini dari import awalnya
		// 		this.manageDataJson(this.jsonFile);
		// 		this.jsonFile = null;

		// 	}
		// }
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
		// if (this.form.invalid) {
		// 	this.validateAllFormFields(this.form);
		// 	this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		// }
		// else {
		// 	this.simpan();
		// }
		this.simpan();
	}

	simpan() {
		let entry = [];
		for (let i = 0; i < this.listData.length; i++) {
			// console.log(this.listData)
			if (this.listData[i].statusAktif) {
				let enParent = {
					"kdProfile": this.kdprof,
					"kdPaket": this.form.get('kdPaket').value,
					"kdModulAplikasi": this.form.get('kdModulAplikasi').value.toString(),
					"kdVersion": this.form.get('kdVersion').value,
					"kdEdisi": this.form.get('kdEdisi').value.toString(),
					"kdKelompokKlien": this.form.get('kdKelompokKlien').value.toString(),
					"kdObjekModulAplikasi": this.listData[i].kdObjekModulAplikasi.toString(),
					"statusAktif": this.listData[i].statusAktif === true ? 1 : 0
				}
				entry.push(enParent)
			}
			if (this.listData[i].childs.length > 0) {
				for (let j = 0; j < this.listData[i].childs.length; j++) {
					if (this.listData[i].childs[j].statusAktif) {
						let child1 = {
							"kdProfile": this.kdprof,
							"kdPaket": this.form.get('kdPaket').value,
							"kdModulAplikasi": this.form.get('kdModulAplikasi').value.toString(),
							"kdVersion": this.form.get('kdVersion').value,
							"kdEdisi": this.form.get('kdEdisi').value.toString(),
							"kdKelompokKlien": this.form.get('kdKelompokKlien').value.toString(),
							"kdObjekModulAplikasi": this.listData[i].childs[j].kdObjekModulAplikasi.toString(),
							"statusAktif": this.listData[i].childs[j].statusAktif === true ? 1 : 0
						}
						entry.push(child1)
					}

					if (this.listData[i].childs[j].childs.length > 0) {
						for (let k = 0; k < this.listData[i].childs[j].childs.length; k++) {
							if (this.listData[i].childs[j].childs[k].statusAktif) {
								let child2 = {
									"kdProfile": this.kdprof,
									"kdPaket": this.form.get('kdPaket').value,
									"kdModulAplikasi": this.form.get('kdModulAplikasi').value.toString(),
									"kdVersion": this.form.get('kdVersion').value,
									"kdEdisi": this.form.get('kdEdisi').value.toString(),
									"kdKelompokKlien": this.form.get('kdKelompokKlien').value.toString(),
									"kdObjekModulAplikasi": this.listData[i].childs[j].childs[k].kdObjekModulAplikasi.toString(),
									"statusAktif": this.listData[i].childs[j].childs[k].statusAktif === true ? 1 : 0
								}
								entry.push(child2)
							}
						}
					}
				}
			}
		}
		console.log(entry)

		if (entry.length == 0) {
			// this.validateAllFormFields(this.form);
			// this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
			let enParent = {
				"kdProfile": this.kdprof,
				"kdPaket": this.form.get('kdPaket').value,
				"kdModulAplikasi": this.form.get('kdModulAplikasi').value.toString(),
				"kdVersion": this.form.get('kdVersion').value,
				"kdEdisi": this.form.get('kdEdisi').value.toString(),
				"kdKelompokKlien": this.form.get('kdKelompokKlien').value.toString(),
				"kdObjekModulAplikasi": "",
				"statusAktif": "0"
			}
			entry.push(enParent)
			this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/MapPaketModulAplikasiToObjek', entry).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.reset();
			})
		}
		else {
			this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/MapPaketModulAplikasiToObjek', entry).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.reset();
			})
		}
	}

	reset() {
		// var styleButton = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left ui-state-focus") as HTMLCollectionOf<HTMLElement>;
		// for (var i = 0; i < styleButton.length; i++) {
		// 	styleButton[i].style.backgroundColor = '#3c67b1';
		// }
		this.listData = [];
		this.ngOnInit();
		this.pencarian = '';
	}

	loadPage(event: LazyLoadEvent) {
		// this.first = event.first;
		// console.log(event.first + 1)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		if (this.form.invalid) {

		}
		else {
			this.getObjek(this.page, this.rows, '')
		}
	}

	globalFilter(filterValue: string) {
		// this.listData = []
		// for (let i = 0; i < this.listDataBank.length; i++) {
		// 	let parent = this.listDataBank[i].data.labelHead;
		// 	let x = parent.toLowerCase().includes(filterValue.toLowerCase())
		// 	console.log(x)
		// 	if (x) {
		// 		this.listData.push(this.listDataBank[i]);
		// 	}
		// }
		this.getObjek(this.page, this.rows, filterValue)
	}

	openDropdown() {
		if (this.openDropdownKey) {
			document.getElementById("dropdownTree").style.display = "none";
			this.openDropdownKey = false;
		} else {
			document.getElementById("dropdownTree").style.display = "block";
			this.openDropdownKey = true;
		}
	}

	nodeSelect(event) {
		this.selectedVersion = event.node.label;
		this.selectKdVersion = event.node.kode;
		this.getList();
		this.form.get('kdVersion').setValue(event.node.kode)
		document.getElementById("dropdownTree").style.display = "none";
		this.openDropdownKey = false;
		if (this.form.invalid) {

		}
		else {
			this.getObjek(this.page, this.rows, '')
		}
	}

	getObjekModul() {
		if (this.form.invalid) {

		}
		else {
			this.getObjek(this.page, this.rows, '')
		}
	}

	toggleCoba(rowData: any, dtEn: any) {
		dtEn.toggleRow(rowData);
	}


	isParentChecked(event, data, index) {
		let d = 0;
		if (event) {
			d = 1;
		}
		data.tampil = d;
		if (event == true) {
			// if (data.isParent == true){
			if (data.childs.length !== 0) {
				//anak
				for (let i = 0; i < data.childs.length; i++) {
					data.childs[i].statusAktif = true;
					data.childs[i].tampil = 1;

					// if (data.childs[i].isParent == true){
					if (data.childs[i].childs.length !== 0) {
						//cucu
						for (let j = 0; j < data.childs[i].childs.length; j++) {
							data.childs[i].childs[j].statusAktif = true;
							data.childs[i].childs[j].tampil = 1;
							// if (data.childs[i].childs[j].isParent == true){
							if (data.childs[i].childs[j].childs.length !== 0) {
								//lv4
								for (let k = 0; k < data.childs[i].childs[j].childs.length; k++) {
									data.childs[i].childs[j].childs[k].statusAktif = true;
									data.childs[i].childs[j].childs[k].tampil = 1;
									// if (data.childs[i].childs[j].childs[k].isParent == true){
									if (data.childs[i].childs[j].childs[k].childs.length !== 0) {
										//lv5
										for (let l = 0; l < data.childs[i].childs[j].childs[k].childs.length; l++) {
											data.childs[i].childs[j].childs[k].childs[l].statusAktif = true;
											data.childs[i].childs[j].childs[k].childs[l].tampil = 1;
										}
									}
								}
							}
						}
					}
				}
			}
		} else {
			// if (data.isParent == true){
			if (data.childs.length !== 0) {
				//anak
				for (let i = 0; i < data.childs.length; i++) {
					data.childs[i].statusAktif = false
					data.childs[i].tampil = 0;
					data.childs[i].cetak = 0;
					data.childs[i].hapus = 0;
					data.childs[i].simpan = 0;
					data.childs[i].ubah = 0;
					// if (data.childs[i].isParent == true){
					if (data.childs[i].childs.length !== 0) {
						//cucu
						for (let j = 0; j < data.childs[i].childs.length; j++) {
							data.childs[i].childs[j].statusAktif = false
							data.childs[i].childs[j].tampil = 0;
							data.childs[i].childs[j].cetak = 0;
							data.childs[i].childs[j].hapus = 0;
							data.childs[i].childs[j].simpan = 0;
							data.childs[i].childs[j].ubah = 0;
							// if (data.childs[i].childs[j].isParent == true){
							if (data.childs[i].childs[j].childs.length !== 0) {
								//lv4
								for (let k = 0; k < data.childs[i].childs[j].childs.length; k++) {
									data.childs[i].childs[j].childs[k].statusAktif = false
									data.childs[i].childs[j].childs[k].tampil = 0;
									data.childs[i].childs[j].childs[k].cetak = 0;
									data.childs[i].childs[j].childs[k].hapus = 0;
									data.childs[i].childs[j].childs[k].simpan = 0;
									data.childs[i].childs[j].childs[k].ubah = 0;
									// if (data.childs[i].childs[j].childs[k].isParent == true){
									if (data.childs[i].childs[j].childs[k].childs.length !== 0) {
										//lv5
										for (let l = 0; l < data.childs[i].childs[j].childs[k].childs.length; l++) {
											data.childs[i].childs[j].childs[k].childs[l].statusAktif = false;
											data.childs[i].childs[j].childs[k].childs[l].tampil = 0;
											data.childs[i].childs[j].childs[k].childs[l].cetak = 0;
											data.childs[i].childs[j].childs[k].childs[l].hapus = 0;
											data.childs[i].childs[j].childs[k].childs[l].simpan = 0;
											data.childs[i].childs[j].childs[k].childs[l].ubah = 0;
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
}


