import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { SettingDataFixed } from './settingdatafixed.interface';;
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-settingdatafixed',
	templateUrl: './settingdatafixed.component.html',
	styleUrls: ['./settingdatafixed.component.scss'],
	providers: [ConfirmationService]
})
export class SettingDataFixedComponent implements OnInit {
	selected: SettingDataFixed;
	listData: any[];
	versi: any;
	fieldKeyTableRelasi: SettingDataFixed[];
	kodefieldReportDisplayTableRelasi: SettingDataFixed[];
	typeField: SettingDataFixed[];
	selectRecord: SettingDataFixed[];
	tableRelasi: SettingDataFixed[];
	fieldReportDisplayTableRelasi: SettingDataFixed[];
	form: FormGroup;
	report: any;
	toReport: any;
	formAktif: boolean;
	page: number;
	rows: number;
	totalRecords: number;
	pencarian: string = '';
	inputTeks: boolean;
	inputDatabase: boolean;
	type: any;
	namaTable: any;
	idKode: any;
	dataKode: any;
	namaKode: any;
	namaDisplay: any;
	tableName: any;
	namaDisplay2: any;
	dataTipe: any;
	keyTableRelasi: any;
	tipeDatabase: boolean;
	fieldKey: any[];
	dataFieldKey: any[];
	dataFilter: any[];
	dataRow: any = {};
	keyRelasi: any;
	dataFilterRow: any[];
	items: any;
	codes: any[];
	listData2: any[];
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	smbrFile:any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
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
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.type = 'teks';
		this.formAktif = true;
		this.get(this.page, this.rows);
		this.form = this.fb.group({
			'keteranganFungsi': new FormControl(''),
			'namaField': new FormControl('', Validators.required),
			'typeField': new FormControl('', Validators.required),
			'typeData': new FormControl(''),
			'tabelRelasi': new FormControl(''),
			'fieldKeyTabelRelasi': new FormControl(''),
			'fieldReportDisplayTabelRelasi': new FormControl(''),
			'nilaiField': new FormControl(''),
			'nilaiFieldDrop': new FormControl(''),
			'statusEnabled': new FormControl(true)
		});
		this.form.get('typeData').setValue('teks');
		this.getTypeData(this.form.get('typeData').value);
		this.getData();
		if(this.form.get('typeData').value == 'teks') {
			this.form.get('tabelRelasi').disable();
			this.form.get('fieldKeyTabelRelasi').disable();
			this.form.get('fieldReportDisplayTabelRelasi').disable();
			this.inputTeks = true;
			this.inputDatabase = false;
		}
		this.typeField = [];
		this.typeField.push(
			{label: 'varchar', value: 'varchar'},
			{label: 'integer', value: 'Integer'},
			{label: 'char', value: 'char'},
			{label: 'BigDecimal', value: 'BigDecimal'},
			{label: 'String', value: 'String'}
			);
		/*this.listData = [
			{
				namaField: {namaField: 'nama'},
				typeData: 'teks',
				tabelRelasi: null
			}

			]*/
			this.getSmbrFile();
		}

		getSmbrFile(){
			this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
				this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
			});
		}

		valuechange(newValue) {
			this.toReport = newValue;
			this.report = newValue;
		}
		getTypeData(value) {
			if(value == 'database') {
				this.tableRelasi = [];
				this.fieldKeyTableRelasi = [];
				this.fieldReportDisplayTableRelasi = [];
				this.selectRecord = [];
				this.getData();
				this.form.get('tabelRelasi').setValue(null);
				this.form.get('tabelRelasi').enable();
				this.form.get('fieldKeyTabelRelasi').enable();
				this.form.get('fieldReportDisplayTabelRelasi').enable();
				this.inputDatabase = true;
				this.inputTeks = false;
				this.form.get('typeData').setValue(value);
			} else {
				this.tableRelasi = [];
				this.fieldKeyTableRelasi = [];
				this.fieldReportDisplayTableRelasi = [];
				this.selectRecord = [];
				this.form.get('tabelRelasi').disable();
				this.form.get('fieldKeyTabelRelasi').disable();
				this.form.get('fieldReportDisplayTabelRelasi').disable();
				this.inputDatabase = false;
				this.inputTeks = true;
			}
		}
		getTypeDataRow(value) {
			if(value == 'database') {
				this.tableRelasi = [];
				this.fieldKeyTableRelasi = [];
				this.fieldReportDisplayTableRelasi = [];
				this.selectRecord = [];
				this.getData();
				this.form.get('tabelRelasi').enable();
				this.form.get('fieldKeyTabelRelasi').enable();
				this.form.get('fieldReportDisplayTabelRelasi').enable();
				this.inputDatabase = true;
				this.inputTeks = false;
				this.form.get('typeData').setValue(value);
			} else {
				this.tableRelasi = [];
				this.fieldKeyTableRelasi = [];
				this.fieldReportDisplayTableRelasi = [];
				this.selectRecord = [];
				this.form.get('tabelRelasi').disable();
				this.form.get('fieldKeyTabelRelasi').disable();
				this.form.get('fieldReportDisplayTabelRelasi').disable();
				this.inputDatabase = false;
				this.inputTeks = true;
			}
		}
		downloadExcel() {
			this.httpService.get(Configuration.get().dataMasterNew + '/settingdatafixed/findAll?').subscribe(table => {
				this.listData2 = table.SettingDataFixed;
				this.codes = [];

				for (let i = 0; i < this.listData2.length; i++) {
					this.codes.push({

						prefix: this.listData2[i].namaField.namaField,
						tabelRelasi: this.listData2[i].tabelRelasi,
						fieldKeyTabelRelasi: this.listData2[i].fieldKeyTabelRelasi,
						fieldReportDisplayTabelRelasi: this.listData2[i].fieldReportDisplayTabelRelasi,
						typeField: this.listData2[i].typeField,
						nilaiField: this.listData2[i].nilaiField,
						keteranganFungsi: this.listData2[i].keteranganFungsi,
						statusEnabled: this.listData2[i].statusEnabled,

					})

				}
				this.fileService.exportAsExcelFile(this.codes, 'Setting Data Fixed');
			});

		}

		downloadPdf() {
			let cetak = Configuration.get().report + '/settingDataFixed/laporanSettingDataFixed.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
        	window.open(cetak);
			// var col = ["Prefix", "Tabel Relasi", "Key Tabel Relasi", "Report Display Tabel Relasi", "Tipe Field", "Nilai Field", "Keterangan Fungsi", "Status Aktif"];
			// this.httpService.get(Configuration.get().dataMasterNew + '/settingdatafixed/findAll?').subscribe(table => {
			// 	this.listData2 = table.SettingDataFixed;
			// 	this.codes = [];

			// 	for (let i = 0; i < this.listData2.length; i++) {
			// 		this.codes.push({

			// 			prefix: this.listData2[i].namaField.namaField,
			// 			tabelRelasi: this.listData2[i].tabelRelasi,
			// 			fieldKeyTabelRelasi: this.listData2[i].fieldKeyTabelRelasi,
			// 			fieldReportDisplayTabelRelasi: this.listData2[i].fieldReportDisplayTabelRelasi,
			// 			typeField: this.listData2[i].typeField,
			// 			nilaiField: this.listData2[i].nilaiField,
			// 			keteranganFungsi: this.listData2[i].keteranganFungsi,
			// 			statusEnabled: this.listData2[i].statusEnabled,

			// 		})

			// 	}
			// 	this.fileService.exportAsPdfFile("Master Setting Data Fixed", col, this.codes, "Setting Data Fixed");

			// });

		}
		getData() {
			this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findTabel').subscribe(
				table => {
					this.tableRelasi = [];
					this.tableRelasi.push({label: '--Pilih Table Relasi--', value: null});
					for (var i = 0; i < table.Tabel.length; ++i) {
						this.tableRelasi.push({label: table.Tabel[i].namatabel, value: table.Tabel[i].namatabel});
					}
				});
		}
		get(page: number, rows: number) {
			this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findAll?page='+page+'&rows='+rows+'&dir=id.namaField&sort=desc').subscribe(
				table => {
				//console.log(table.SettingDataFixed);
				this.listData = [];
				this.totalRecords = table.totalRow;
				for (var i = 0; i < table.SettingDataFixed.length; ++i) {
					let data = {
						"prefix": table.SettingDataFixed[i].namaField.namaField,
						"tabelRelasi": table.SettingDataFixed[i].tabelRelasi,
						"fieldKeyTabelRelasi": table.SettingDataFixed[i].fieldKeyTabelRelasi,
						"fieldReportDisplayTabelRelasi": table.SettingDataFixed[i].fieldReportDisplayTabelRelasi,
						"typeField": table.SettingDataFixed[i].typeField,
						"nilaiField": table.SettingDataFixed[i].nilaiField,
						"keteranganFungsi": table.SettingDataFixed[i].keteranganFungsi,
						"statusEnabled": table.SettingDataFixed[i].statusEnabled,
						"version":table.SettingDataFixed[i].version
					}
					this.listData.push(data);
				}
				
				
				

			});
		}
		cari() {
			this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findAll?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=id.namaField&sort=desc&namaField=' + this.pencarian).subscribe(table => {
			//this.listData = table.SettingDataFixed;
			this.listData = [];
			this.totalRecords = table.totalRow;
			for (var i = 0; i < table.SettingDataFixed.length; ++i) {
				let data = {
					"prefix": table.SettingDataFixed[i].namaField.namaField,
					"tabelRelasi": table.SettingDataFixed[i].tabelRelasi,
					"fieldKeyTabelRelasi": table.SettingDataFixed[i].fieldKeyTabelRelasi,
					"fieldReportDisplayTabelRelasi": table.SettingDataFixed[i].fieldReportDisplayTabelRelasi,
					"typeField": table.SettingDataFixed[i].typeField,
					"nilaiField": table.SettingDataFixed[i].nilaiField,
					"keteranganFungsi": table.SettingDataFixed[i].keteranganFungsi,
					"statusEnabled": table.SettingDataFixed[i].statusEnabled,
					"version":table.SettingDataFixed[i].version
				}
				this.listData.push(data);
			}


		});
		}
		getValueTable(value) {
			this.tableName = value;
			if(value !== null) {
				this.form.get('fieldKeyTabelRelasi').setValue(null);
				this.form.get('fieldReportDisplayTabelRelasi').setValue(null);
				this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findPKFieldByTabel/' + value).subscribe(
					table => {
						this.fieldKeyTableRelasi = [];
						this.fieldKeyTableRelasi.push({label: '--Pilih Field Key Table Relasi', value: null});
						for (var i = 0; i < table.Field.length; ++i) {
							this.fieldKeyTableRelasi.push({label: table.Field[i].namaField, value: table.Field[i].namaField});
						}
						this.form.get('fieldKeyTabelRelasi').setValue(this.fieldKeyTableRelasi[1].value);
					});

			}
		}
		getValueTableRelasi(tableRelasi, fieldKey, dataRow) {
			this.dataFilter = [];
			this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findPKFieldByTabel/' + tableRelasi).subscribe(
				table => {

					for (var j = 0; j < fieldKey.length; ++j) {
						let keyField = fieldKey[j].namaField;
						if(keyField == "" || keyField == null) {
							this.fieldKeyTableRelasi = [];
							this.fieldKeyTableRelasi.push({label: '--Pilih Field Key Table Relasi', value: null});
							for (var i = 0; i < table.Field.length; ++i) {
								this.fieldKeyTableRelasi.push({label: table.Field[i].namaField, value: table.Field[i].namaField});
							}
							this.dataFilter = this.fieldKeyTableRelasi;
							//dataRow.fieldKeyTabelRelasi = this.fieldKeyTableRelasi[0].value;
						} else {
							this.dataFilter = table.Field.filter(val => val.namaField == keyField);
						}
						
					}
					if(this.dataFilter.length == 0) {
						this.type = 'teks';
						this.getTypeDataRow(this.type);
						let cloned = this.clone(dataRow);
						this.inputDatabase = false;
						this.inputTeks = true;
						this.formAktif = false;
						this.form.setValue(cloned); 
					} else {
						this.type = 'database';
						this.getTypeDataRow(this.type);
						if(dataRow.fieldKeyTabelRelasi !== null && dataRow.fieldReportDisplayTabelRelasi == null || dataRow.fieldKeyTabelRelasi !== null && dataRow.fieldReportDisplayTabelRelasi == "") {
							this.getValueKey(dataRow.fieldKeyTabelRelasi);
						} else if(dataRow.fieldKeyTabelRelasi == null && dataRow.fieldReportDisplayTabelRelasi !== null || dataRow.fieldKeyTabelRelasi == "" && dataRow.fieldReportDisplayTabelRelasi !== null) {
							this.getReportDisplay(dataRow.fieldReportDisplayTabelRelasi);
						} else {
							this.getValueRecord(dataRow.tabelRelasi, dataRow.fieldKeyTabelRelasi, dataRow.fieldReportDisplayTabelRelasi);
						}
						let cloned = this.cloneDatabase(dataRow);
						this.inputDatabase = true;
						this.inputTeks = false;
						this.formAktif = false;

						
						this.form.setValue(cloned); 
						
					}
				}
				);
		}
		getValueKey(value) {
			if(value !== null) {
				let table = this.form.get('tabelRelasi').value;
				this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findOneDataBy?tabelName='+table+'&field1=' + value).subscribe(
					table => {
						this.selectRecord = [];
						this.selectRecord.push({label: '--Pilih Value--', value: null});
						for (var i = 0; i < table.data.length; ++i) {
							this.selectRecord.push({label: table.data[i].display, value: table.data[i].id});
						}
					}
					);
			}


		}
		getPrimaryKey(value) {
			if(value !== null) {
				this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findFieldByTabel/' + this.form.get('tabelRelasi').value).subscribe(
					table => {
						this.fieldReportDisplayTableRelasi = [];
						this.fieldReportDisplayTableRelasi.push({label: '--Pilih Field Report Display Table Relasi--', value: null});
						for (var i = 0; i < table.Field.length; ++i) {
							this.fieldReportDisplayTableRelasi.push({label: table.Field[i].namaField, value: table.Field[i].namaField});
						}
						for (var i = 0; i < this.fieldReportDisplayTableRelasi.length; ++i) {
							if(this.fieldReportDisplayTableRelasi[i].value == table.index) {
								this.form.get('fieldReportDisplayTabelRelasi').setValue(this.fieldReportDisplayTableRelasi[i].value);
							}
						}

					});
			}

		}

		getNamaValue(value: string) {
			return value.charAt(0).toLowerCase();
		}
		getReportDisplay(value) {
			console.log(value);
			if(value !== null) {
				this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findDataBy?tabelName='+this.form.get('tabelRelasi').value+'&field1='+this.form.get('fieldKeyTabelRelasi').value+'&field2=' + value).subscribe(
					table => {
						this.selectRecord = [];
						this.selectRecord.push({label: '--Pilih Value--', value: null});
						for (var i = 0; i < table.data.length; ++i) {
							this.selectRecord.push({label: table.data[i].display, value: table.data[i].id});
						}
						console.log(this.selectRecord);
					}
					);


			/*let table = this.form.get('tabelRelasi').value;
			
			if(this.form.get('fieldKeyTabelRelasi').value == "" || this.form.get('fieldKeyTabelRelasi').value == null) {
				this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findOneDataBy?tabelName='+table+'&field1=' + value).subscribe(
					table => {

						this.selectRecord = [];
						this.selectRecord.push({label: '--Pilih Value--', value: null});
						for (var i = 0; i < table.data.length; ++i) {
							this.selectRecord.push({label: table.data[i].display, value: table.data[i].id});
						}
						console.log(this.selectRecord);
					}
				);

			} else {
				this.keyRelasi = this.form.get('fieldKeyTabelRelasi').value;
				
			}*/
			
		}
		
		
		
	}
	getValueRecord(tabelRelasi, fieldKeyTabelRelasi, fieldReportDisplayTabelRelasi) {
		this.httpService.get(Configuration.get().dataMaster + '/settingdatafixed/findDataBy?tabelName='+tabelRelasi+'&field1='+fieldKeyTabelRelasi+'&field2=' + fieldReportDisplayTabelRelasi).subscribe(
			table => {

				this.selectRecord = [];
				this.selectRecord.push({label: '--Pilih Value--', value: null});
				for (var i = 0; i < table.data.length; ++i) {
					this.selectRecord.push({label: table.data[i].display, value: table.data[i].id});
				}
				console.log(this.selectRecord)
			}
			);
	}

	
	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
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
				this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
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
			},
			reject: () => {
				this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
			}
		});
	}
	update() {
		if(this.form.get('typeData').value == 'teks') {
			this.form.get('tabelRelasi').setValue(null);
			this.form.get('fieldKeyTabelRelasi').setValue(null);
			this.form.get('fieldReportDisplayTabelRelasi').setValue(null);
			this.form.get('tabelRelasi').enable();
			this.form.get('fieldKeyTabelRelasi').enable();
			this.form.get('fieldReportDisplayTabelRelasi').enable();
		}
		if(this.type == 'teks') {
			let dataSimpan = {
				"fieldKeyTabelRelasi": null,
				"fieldReportDisplayTabelRelasi": null,
				"keteranganFungsi": this.form.get('keteranganFungsi').value,
				"namaField": this.form.get('namaField').value,
				"nilaiField": this.form.get('nilaiField').value,
				"statusEnabled": this.form.get('statusEnabled').value,
				"tabelRelasi": null,
				"typeField": this.form.get('typeField').value,
				"version": this.versi
			}
			this.httpService.update(Configuration.get().dataMaster + '/settingdatafixed/update/' + this.versi, dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.reset();
			});
		} else {
			console.log(this.form.get('nilaiFieldDrop').value);
			let dataSimpan = {
				"fieldKeyTabelRelasi": this.form.get('fieldKeyTabelRelasi').value,
				"fieldReportDisplayTabelRelasi": this.form.get('fieldReportDisplayTabelRelasi').value,
				"keteranganFungsi": this.form.get('keteranganFungsi').value,
				"namaField": this.form.get('namaField').value,
				"nilaiField": this.form.get('nilaiFieldDrop').value,
				"statusEnabled": this.form.get('statusEnabled').value,
				"tabelRelasi": this.form.get('tabelRelasi').value,
				"typeField": this.form.get('typeField').value,
				"version": this.versi
			}
			this.httpService.update(Configuration.get().dataMaster + '/settingdatafixed/update/' + this.versi, dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.reset();
			});
		}
		
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			if(this.form.get('typeData').value == 'teks') {
				this.form.get('tabelRelasi').setValue(null);
				this.form.get('fieldKeyTabelRelasi').setValue(null);
				this.form.get('fieldReportDisplayTabelRelasi').setValue(null);
				this.form.get('tabelRelasi').enable();
				this.form.get('fieldKeyTabelRelasi').enable();
				this.form.get('fieldReportDisplayTabelRelasi').enable();
			}
			if(this.type == 'teks') {
				let dataSimpan = {
					"fieldKeyTabelRelasi": null,
					"fieldReportDisplayTabelRelasi": null,
					"keteranganFungsi": this.form.get('keteranganFungsi').value,
					"namaField": this.form.get('namaField').value,
					"nilaiField": this.form.get('nilaiField').value,
					"statusEnabled": this.form.get('statusEnabled').value,
					"tabelRelasi": null,
					"typeField": this.form.get('typeField').value,
					"version": 0
				}
				this.httpService.post(Configuration.get().dataMaster + '/settingdatafixed/save?', dataSimpan).subscribe(response => {
					this.alertService.success('Berhasil', 'Data Disimpan');
					this.reset();
				});
			} else {
				console.log(this.form.get('nilaiFieldDrop').value);
				let dataSimpan = {
					"fieldKeyTabelRelasi": this.form.get('fieldKeyTabelRelasi').value,
					"fieldReportDisplayTabelRelasi": this.form.get('fieldReportDisplayTabelRelasi').value,
					"keteranganFungsi": this.form.get('keteranganFungsi').value,
					"namaField": this.form.get('namaField').value,
					"nilaiField": this.form.get('nilaiFieldDrop').value,
					"statusEnabled": this.form.get('statusEnabled').value,
					"tabelRelasi": this.form.get('tabelRelasi').value,
					"typeField": this.form.get('typeField').value,
					"version": 0
				}
				this.httpService.post(Configuration.get().dataMaster + '/settingdatafixed/save?', dataSimpan).subscribe(response => {
					this.alertService.success('Berhasil', 'Data Disimpan');
					this.reset();
				});
			}
			
		}

	}

	reset() {
		this.form.reset();
		this.tableRelasi = [];
		this.fieldKeyTableRelasi = [];
		this.fieldReportDisplayTableRelasi = [];
		this.selectRecord = [];
		this.listData = [];
		this.pencarian = null;
		this.formAktif = true;
		this.getTypeData('teks');
		this.ngOnInit();
	}
	onRowSelect(event) {
		this.dataRow = event.data;
		console.log(event.data);
		this.getData();
		
		if(event.data.tabelRelasi == null || event.data.tabelRelasi == "" || event.data.fieldKeyTabelRelasi == "" || event.data.fieldKeyTabelRelasi == null) {
			this.type = 'teks';
			this.getTypeDataRow(this.type);
			let cloned = this.clone(event.data);
			this.formAktif = false;
			this.form.setValue(cloned);
		} else {
			this.dataFieldKey = [];
			this.dataFieldKey.push({namaField: event.data.fieldKeyTabelRelasi});
			this.dataFilterRow = this.tableRelasi.filter(val => val.value == event.data.tabelRelasi);
			if(this.dataFilterRow.length == 0) {
				this.type = 'teks';
				this.getTypeDataRow(this.type);
				let cloned = this.clone(event.data);
				this.formAktif = false;
				this.form.setValue(cloned);
			} else {
				this.getValueTableRelasi(event.data.tabelRelasi, this.dataFieldKey, this.dataRow);
			}
		}
		
	}
	clone(cloned: SettingDataFixed): SettingDataFixed {
		let hub = new InisialSettingDataFixed();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialSettingDataFixed();
		fixHub = {
			"keteranganFungsi": hub.keteranganFungsi,
			"namaField": hub.prefix,
			"typeData": this.type,
			"typeField": hub.typeField,
			"tabelRelasi": null,
			"fieldKeyTabelRelasi": null,
			"fieldReportDisplayTabelRelasi": null,
			"nilaiField": hub.nilaiField,
			"nilaiFieldDrop": null,
			"statusEnabled": hub.statusEnabled
		}
		this.versi = hub.version;
		return fixHub;
	}
	cloneDatabase(cloned: SettingDataFixed): SettingDataFixed {
		let hub = new InisialSettingDataFixed();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialSettingDataFixed();
		fixHub = {
			"keteranganFungsi": hub.keteranganFungsi,
			"namaField": hub.prefix,
			"typeData": this.type,
			"typeField": hub.typeField,
			"tabelRelasi": hub.tabelRelasi,
			"fieldKeyTabelRelasi": hub.fieldKeyTabelRelasi,
			"fieldReportDisplayTabelRelasi": hub.fieldReportDisplayTabelRelasi,
			"nilaiField": null,
			"nilaiFieldDrop": hub.nilaiField,
			"statusEnabled": hub.statusEnabled
		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMaster + '/settingdatafixed/del/' + deleteItem.prefix).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});


	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}
	tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/settingDataFixed/laporanSettingDataFixed.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmSettingDataFixed_laporanCetak');

	}
}

class InisialSettingDataFixed implements SettingDataFixed {

	constructor(
		public propinsi?,
		public typeData?,
		public keteranganFungsi?,
		public kode?,
		public namaField?,
		public kodeTypeField?,
		public kodeTableRelasi?,
		public kodefieldReportDisplayTableRelasi?,
		public kodefieldKeyTableRelasi?,
		public kodeSelectRecord?,
		public nilaiField?,
		public kdNegara?,

		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public typeField?,
		public tabelRelasi?,
		public fieldKeyTabelRelasi?,
		public fieldReportDisplayTabelRelasi?,
		public prefix?,
		public nilaiFieldDrop?


		) { }

}
