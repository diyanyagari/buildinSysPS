import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, TreeModule, TreeNode, AccordionModule, TreeTableModule, SharedModule, Dropdown } from 'primeng/primeng';

@Component({
	selector: 'app-language-manager',
	templateUrl: './language-manager.component.html',
	styleUrls: ['./language-manager.component.scss'],
	providers: [ConfirmationService],
	encapsulation: ViewEncapsulation.None
})
export class LanguageManagerComponent implements OnInit {

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
	tampungVersionAdmin:any;
	


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
		// var collapseIcon = document.getElementsByClassName("ui-tree-toggler fa fa-fw fa-caret-right:before") as HTMLCollectionOf<HTMLElement>;
		// var expandIcon = document.getElementsByClassName("ui-tree-toggler fa fa-fw fa-caret-down") as HTMLCollectionOf<HTMLElement>;
		// for (var i = 0; i < collapseIcon.length; i++) {
		// 	collapseIcon[i].style.content = '\f067';
		// }
		// for (var i = 0; i < expandIcon.length; i++) {
		// 	expandIcon[i].style.content = 'f068';
		// }
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
		this.form = this.fb.group({
			'kdBahasa': new FormControl('', Validators.required),
			'kdModulAplikasi': new FormControl('', Validators.required),
			'kdProfile': new FormControl('', Validators.required),
			//'version': new FormControl(''),
			'versionLama': new FormControl(null),
			'versionBaru': new FormControl(null),
			'namaFormKomponen': new FormControl(''),
			'namaFormDefault': new FormControl(''),
			'namaFormUser': new FormControl(''),
		});
		this.getListBahasa();
		this.getListModulAplikasi();
		this.getService();
		// this.download(JSON.stringify({ "name":"John", "age":30, "city":"New York"}), 'json.txt', 'text/plain');

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

			for(let y=0; y < this.listVersion.length; y++){
				for(let z=0; z < this.listVersion[y].children.length; z++){
					if(this.listVersion[y].children[z].kode == this.authGuard.getUserDto().kdVersion){
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
		let kdBhs = this.form.get('kdBahasa').value;
		let kdMdl = this.form.get('kdModulAplikasi').value;
		// let version = this.form.get('version').value;
		let version = this.selectKdVersion;
		if ((kdBhs != "") && (kdMdl != "")) {
			this.disButton = true;
			if (this.jsonFile == null) {
				this.isImport = false;
				//ini dari findByKode
				this.manageData(kdBhs.kode);
			} else {
				this.isImport = true;
				//ini dari import awalnya
				this.manageDataJson(this.jsonFile);
				this.jsonFile = null;

			}
		}
	}

	manageData(kdBahasa) {
		let data = {
			kdBahasa: kdBahasa,
			kdModulAplikasi: this.form.get('kdModulAplikasi').value,
			kdVersion: this.selectKdVersion,
		}
		this.httpService.post(Configuration.get().authLogin + '/language-manager/findByKode?', data).subscribe(table => {
			this.listData = [];
			// this.totalRecords = table.data.length;
			let data = [];
			for (let i = 0; i < table.data.length; i++) {
				let isi = table.data[i].label;
				//let slice = isi.slice(0, isi.indexOf("_"));
				if (isi.includes("_")) {
					data[i] = isi.slice(0, isi.indexOf("_"));
				} else {
					data[i] = "Lainnya";
				}
			}
			let responseApiLabel = table.data;
			let unikHead = this.removeDuplicates(data);
			// let datas = [];
			for (let i = 0; i < unikHead.length; i++) {
				let child = [];
				if (unikHead[i] == "Lainnya") {
					this.listData[i] = {
						data: {
							namaHead: unikHead[i],
							labelHead: "Lainnya",
							valueOLD: ((unikHead[i].slice(3, unikHead[i].length)).split(/(?=[A-Z])/)).join(' '),
							valueNEW: '',
							status: false
						},
						children: [],
						stringJson: [],
					}
				} else {
					this.listData[i] = {
						data: {
							namaHead: unikHead[i],
							labelHead: ((unikHead[i].slice(3, unikHead[i].length)).split(/(?=[A-Z])/)).join(' '),
							valueOLD: ((unikHead[i].slice(3, unikHead[i].length)).split(/(?=[A-Z])/)).join(' '),
							valueNEW: '',
							status: false
						},
						children: [],
						stringJson: [],
					}
				}
				//yang ini buat childnya
				for (let j = 0; j < responseApiLabel.length; j++) {
					// console.log(responseApiLabel[j])
					if (responseApiLabel[j].label.includes("_")) {
						if (unikHead[i] == responseApiLabel[j].label.slice(0, responseApiLabel[j].label.indexOf("_"))) {
							this.listData[i].children.push(
								{
									"data": {
										namaHead: responseApiLabel[j].label,
										// labelHead: (((responseApiLabel[j].label).slice(responseApiLabel[j].label.indexOf("_") + 1, responseApiLabel[j].label.length)).charAt(0).toUpperCase() + ((responseApiLabel[j].label).slice(responseApiLabel[j].label.indexOf("_") + 1, responseApiLabel[j].label.length)).slice(1)).split(/(?=[A-Z])/).join(' '),
										labelHead: responseApiLabel[j].label,
										valueOLD: responseApiLabel[j].valueDefault,
										valueUser:responseApiLabel[j].value,
										valueNEW: "",
										status: false
									}
								}
							);
							this.listData[i].stringJson.push(
								'"' + responseApiLabel[j].label + '"' + ':' + '"' + responseApiLabel[j].valueDefault + '__' + responseApiLabel[j].value + '"',
							);
						}
					} else if (unikHead[i] == "Lainnya") {
						this.listData[i].children.push(
							{
								"data": {
									namaHead: responseApiLabel[j].label,
									labelHead: responseApiLabel[j].value,
									valueOLD: responseApiLabel[j].valueDefault,
									valueUser:responseApiLabel[j].value,
									valueNEW: "",
									status: false
								}
							}
						);
						this.listData[i].stringJson.push(
							'"' + responseApiLabel[j].label + '"' + ':' + '"' + responseApiLabel[j].valueDefault + '__' + responseApiLabel[j].value + '"',
						);
					}
				}
			}
			let datas = [];
			for (let i = 0; i < this.listData.length; i++) {
				datas[i] = {
					data: this.listData[i].data,
					children: this.listData[i].children,
					stringJson: this.listData[i].stringJson.toString(),
				}

			}
			this.listData = [];
			this.listData = datas;
			this.listDataBank = datas;
			console.log(this.listData);

		});
	}

	//ini yang jsonnya import
	manageDataJson(jsonResponse) {
		let jsonData = JSON.parse(jsonResponse);
		this.listData = [];
		let data = [];
		for (let i = 0; i < jsonData.data.length; i++) {
			let isi = jsonData.data[i].label;
			let slice = isi.slice(0, isi.indexOf("_"));
			if (isi.includes("_")) {
				data[i] = isi.slice(0, isi.indexOf("_"));
			} else {
				data[i] = "Lainnya";
			}
		}
		let responseApiLabel = jsonData.data;
		let unikHead = this.removeDuplicates(data);
		// let datas = [];
		for (let i = 0; i < unikHead.length; i++) {
			let child = [];
			if (unikHead[i] == "Lainnya") {
				this.listData[i] = {
					data: {
						namaHead: unikHead[i],
						labelHead: "Lainnya",
						valueOLD: ((unikHead[i].slice(3, unikHead[i].length)).split(/(?=[A-Z])/)).join(' '),
						valueNEW: '',
						status: true
					},
					children: [],
					stringJson: [],
				}
			} else {
				this.listData[i] = {
					data: {
						namaHead: unikHead[i],
						labelHead: ((unikHead[i].slice(3, unikHead[i].length)).split(/(?=[A-Z])/)).join(' '),
						valueOLD: ((unikHead[i].slice(3, unikHead[i].length)).split(/(?=[A-Z])/)).join(' '),
						valueNEW: '',
						status: true
					},
					children: [],
					stringJson: [],
				}
			}
			for (let j = 0; j < responseApiLabel.length; j++) {
				if (responseApiLabel[j].label.includes("_")) {
					if (unikHead[i] == responseApiLabel[j].label.slice(0, responseApiLabel[j].label.indexOf("_"))) {
						this.listData[i].children.push(
							{
								"data": {
									namaHead: responseApiLabel[j].label,
									// labelHead: (responseApiLabel[j].label).slice(responseApiLabel[j].label.indexOf("_") + 1, responseApiLabel[j].label.length),
									labelHead: responseApiLabel[j].label,
									valueOLD: responseApiLabel[j].valueDefault,
									valueNEW: '',
									valueDefault: responseApiLabel[j].valueDefault,
									valueUser:responseApiLabel[j].value,
									status: true
								}
							}
						);
						this.listData[i].stringJson.push(
							'"' + responseApiLabel[j].label + '"' + ':' + '"' + responseApiLabel[j].valueDefault + '__' + responseApiLabel[j].value + '"',
						);
					}
				} else if (unikHead[i] == "Lainnya") {
					this.listData[i].children.push(
						{
							"data": {
								namaHead: responseApiLabel[j].label,
								labelHead: responseApiLabel[j].value,
								valueOLD: responseApiLabel[j].valueDefault,
								valueNEW: '',
								valueDefault: responseApiLabel[j].valueDefault,
								valueUser:responseApiLabel[j].value,
								status: true
							}
						}
					);
					this.listData[i].stringJson.push(
						'"' + responseApiLabel[j].label + '"' + ':' + '"' + responseApiLabel[j].valueDefault + '__' + responseApiLabel[j].value + '"',
					);
				}
			}
		}
		let datas = [];
		for (let i = 0; i < this.listData.length; i++) {
			datas[i] = {
				data: this.listData[i].data,
				children: this.listData[i].children,
				stringJson: this.listData[i].stringJson.toString(),
			}

		}
		this.listData = [];
		this.listData = datas;
		this.listDataBank = datas;
	}

	// manageDataSimpanGridJson(){
		
	// }

	removeDuplicates(arr) {
		let unique_array = []
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] != undefined) {
				if (unique_array.map(function (e) { return e; }).indexOf(arr[i]) == -1) {
					unique_array.push(arr[i])
				}
			}

		}
		return unique_array
	}

	// **grup dan cari unique key**
	// removeDuplicates(arr) {
	//     let unique_array = []
	//     for (let i = 0; i < arr.length; i++) {
	//         if (arr[i] != undefined) {
	//             if (unique_array.map(function (e) { return e.kode; }).indexOf(arr[i].kode) == -1) {
	//                 unique_array.push(arr[i])
	//             }
	//         }

	//     }
	//     return unique_array
	// }

	/// **split string**
	// function myFunction() {
	// 	var str = "How Are You Doing Today?";
	// 	var res = str.split(/(?=[A-Z])/)
	// 	document.getElementById("demo").innerHTML = res;
	//   }

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

	changeValue(ri, i, data, rowData) {

		this.listData[ri].children[i].data.valueNEW = rowData;
		let dataOld = this.listData[ri].children[i].data.valueOLD;
		let dataNew = this.listData[ri].children[i].data.valueNEW;
		if (this.isImport == false) {
			if (dataNew == dataOld) {
				// this.listData[ri].children[i].data.status = false;
				this.listData[ri].children[i].data.status = true;
			} else if (dataNew == '') {
				this.listData[ri].children[i].data.status = false;
			} else {
				this.listData[ri].children[i].data.status = true;
			}
		}

	}

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		}
		else {
			this.simpan();
		}

	}



	simpan() {
		let dataTemp = [];
		let versionLama = this.form.get('versionLama').value;
		let versionBaru = this.form.get('versionBaru').value;
		if (versionLama == versionBaru) {
			for (let i = 0; i < this.listData.length; i++) {
				for (let j = 0; j < this.listData[i].children.length; j++) {
					if (this.listData[i].children[j].data.status == true) {
						dataTemp.push(this.listData[i].children[j].data)
					}
				}
			}
		} else {
			for (let i = 0; i < this.listData.length; i++) {
				for (let j = 0; j < this.listData[i].children.length; j++) {
					dataTemp.push(this.listData[i].children[j].data)
				}
			}
		}

		let detailDto = [];
		for (let i = 0; i < dataTemp.length; i++) {
			console.log(i)
			let temp;
			let dataValue = null;
			let dataDefault = null;
			let dataValueUser = null;
			if (dataTemp[i].valueNEW != '' && dataTemp[i].valueOLD != '') {
				//kesini untuk yang edit yang ada dari findByKode
				dataValue = dataTemp[i].valueNEW;
				dataValueUser = dataTemp[i].valueNEW;
				dataDefault = dataTemp[i].valueOLD;
			} else if (dataTemp[i].valueNEW == '') {
				// dataValue = dataTemp[i].valueOLD;
				//masuk kesini untuk yang dari import / baru semuanya
				dataValueUser = dataTemp[i].valueUser;
				dataDefault = dataTemp[i].valueOLD;
			}
			temp = {
				'key': dataTemp[i].namaHead,
				'value': dataDefault+'__'+dataValueUser
			}
			detailDto.push(temp);
		}
		let dataSimpan = {
			'kdBahasa': this.form.get('kdBahasa').value.kode,
			'kdModulAplikasi': this.form.get('kdModulAplikasi').value,
			detailDto,
			'lang': this.form.get('kdBahasa').value.nilai,
			// "kdVersion": parseInt(this.form.get('version').value),
			"kdVersion": parseInt(this.selectKdVersion),
			"kdProfile": parseInt(this.form.get('kdProfile').value),
		}
		
		// console.log(dataSimpan)find
		//console.log(JSON.stringify(dataSimpan));
		
		this.httpService.post(Configuration.get().authLogin + '/language-manager/save', dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
			this.reset();
		})
	}

	urlUpload() {
		return Configuration.get().authLogin + '/language-manager/readJSONFile';
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}

	jsonUpload(fileJson) {
		this.jsonFile = fileJson.xhr.response;
		this.getList();
		this.isImport = true;
		// this.pathJson = Configuration.get().authLogin + '/language-manager/readJSONFile/' + this.jsonFile;
	}

	reset() {
		var styleButton = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left ui-state-focus") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < styleButton.length; i++) {
			styleButton[i].style.backgroundColor = '#3c67b1';
		}
		this.ngOnInit();
		this.jsonFile = null;
		this.listData = [];
		this.listDataBank = [];
		this.dataRegForm = [];
		this.pencarian = '';
	}

	clearFilter(dropdown: Dropdown) {
		dropdown.resetFilter();
	}

	loadPage(event: LazyLoadEvent) {
		this.first = event.first;
		console.log(event.first + 1)
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	globalFilter(filterValue: string) {
		this.listData = []
		for (let i = 0; i < this.listDataBank.length; i++) {
			let parent = this.listDataBank[i].data.labelHead;
			let x = parent.toLowerCase().includes(filterValue.toLowerCase())
			console.log(x)
			if (x) {
				this.listData.push(this.listDataBank[i]);
			}
		}
	}

	download(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([content], { type: contentType });
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}

	exportToFile() {
		let data = '';
		let dataFix;
		let namaJsonValue;
		
		for (let i = 0; i < this.selectedMenu.length; i++) {
			// if (i < this.selectedMenu.length && i != this.selectedMenu.length - 1 && i != 0) {
			// 	data += this.selectedMenu[i].stringJson + ',';
			// } else if (i == this.selectedMenu.length - 1) {
			// 	data += this.selectedMenu[i].stringJson;
			// }
			namaJsonValue = this.selectedMenu[i].stringJson;
			
			//namaJsonValue.toString();
			//namaJsonValue.match(/[^,\s]+/g);
			//namaJsonValue.trim().split(/\s*,\s*/);
			data += namaJsonValue + ',';
		}
		//console.log(data);
		dataFix = data.replace(/,\s*$/, "");
		//console.log(dataFix);
		this.selectedMenu = [];
		this.download("{" + dataFix + "}", 'exportLang-' + this.setTimeStamp(new Date()) + '.json', 'text/plain');
	}

	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			this.form.get('alamatEmail').value
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}

	}

	tambahNamaBaru(){

		if (this.dataRegForm.length == 0) {
			let dataTemp = {
				"nomor": null,
				"komponen": null,
				"default":null,
				"user":null
			}
			let dataRegForm = [...this.dataRegForm];
			dataRegForm.push(dataTemp);
			this.dataRegForm = dataRegForm;
		} else {
			let last = this.dataRegForm.length - 1;
			
			if (this.dataRegForm[last].komponen == null || this.dataRegForm[last].default == null || this.dataRegForm[last].user == null ) {
				this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
			} else {
				let dataTemp = {
					"nomor": null,
					"komponen": null,
					"default":null,
					"user":null
				}
				let dataRegForm = [...this.dataRegForm];
				dataRegForm.push(dataTemp);
				this.dataRegForm = dataRegForm;
			}
				
		}
		
	}

	hapusBaru(row){
		let dataRegForm = [...this.dataRegForm];
		dataRegForm.splice(row, 1);
		this.dataRegForm = dataRegForm;
	}

	resetReg(){
		this.dataRegForm = [];
		this.form.get('namaFormKomponen').setValue('');
		this.form.get('namaFormDefault').setValue('');
		this.form.get('namaFormUser').setValue('');
	}

	simpanReg(){

		let tempSimpanJson;
		let detailDto = [];

		let namaFormKomponenHead = this.form.get('namaFormKomponen').value;
		let namaFormDefaultHead = this.form.get('namaFormDefault').value;
		let namaFormUserHead = this.form.get('namaFormUser').value;
		// || namaFormKomponenHead == '' || namaFormDefaultHead == '' || namaFormUserHead == ''
		// if(this.dataRegForm.length == 0 ){
		// 	this.alertService.warn('Perhatian','Tidak Ada Data Untuk DiSimpan');
		// }else{
			
			if(namaFormKomponenHead != '' && namaFormDefaultHead != '' &&  namaFormUserHead != ''){
				detailDto.push({
					'key': namaFormKomponenHead,
					'value': namaFormDefaultHead+'__'+namaFormUserHead 
				})
			}


			for(let j = 0; j < this.dataRegForm.length; j++){
				tempSimpanJson = {
					'key': this.dataRegForm[j].komponen,
					'value': this.dataRegForm[j].default+'__'+this.dataRegForm[j].user 
				}

				detailDto.push(tempSimpanJson);
				// tempSimpanJson.push(
				// 	'"' + this.dataRegForm[j].komponen + '"' + ':' + '"' + this.dataRegForm[j].default + '__' + this.dataRegForm[j].user + '"',
				// );
			}
		
			let dataSimpan = {
				'kdBahasa': this.form.get('kdBahasa').value.kode,
				'kdModulAplikasi': this.form.get('kdModulAplikasi').value,
				detailDto,
				'lang': this.form.get('kdBahasa').value.nilai,
				"kdVersion": parseInt(this.selectKdVersion),
				"kdProfile": parseInt(this.form.get('kdProfile').value),
			}

			console.log(dataSimpan);

			this.httpService.post(Configuration.get().authLogin + '/language-manager/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				//this.reset();
			})

			this.dataRegForm = [];
			this.form.get('namaFormKomponen').setValue('');
			this.form.get('namaFormDefault').setValue('');
			this.form.get('namaFormUser').setValue('');

		//}
	
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
		this.getList();
		document.getElementById("dropdownTree").style.display = "none";
        this.openDropdownKey = false;

        //this.openDropdown();
	}



}


