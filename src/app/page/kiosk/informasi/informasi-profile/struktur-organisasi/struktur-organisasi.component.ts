import { Inject, forwardRef, Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '../../../../../global/service/HttpClient';
import { Validators, FormControl, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuModule, MenuItem, Steps, StepsModule, TreeNode, DragDropModule } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, FileService, ReportService } from '../../../../../global';
import { DatePipe } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { saveAs } from 'file-saver/FileSaver';
import {
	MessageService,	
	SettingsService,
  NotificationService,
  Authentication
} from "../../../../../global";

@Component({
  selector: 'app-struktur-organisasi',
  templateUrl: './struktur-organisasi.component.html',
  styleUrls: ['../../../kiosk-global.scss','./struktur-organisasi.component.scss'],
  providers: [ConfirmationService, DatePipe],
})
export class StrukturOrganisasiComponent implements OnInit {
  form: FormGroup;
	kdProfile: any;
	toinputForm: Date;
	userData: any;
	inputForms: any[];
	forms: FormGroup;
	items: MenuItem[];
	listData: any[];
	listData1: any[];
	listData2: any[];
	listTable: any[];

	data: any[];
	listDepartemen: any[];
	listDepartemenInput: any[];
	listAsalDepartemen: any[];
	dialogInfoDepartemen: boolean;
	versi: any;
	formKeputusan: FormGroup;
	reportDisplay: any;
	kode: any;
	kdPegawaiKepala: any;
	kodeExternal: any;
	namaExternal: any;
	isProfitCostCenter: any;
	listPegawai: any[];
	dragData: any;
	dropData: any;
	data1: any[];
	kdStatusPegawaiAktif: any;
	images: any[];
	dialogPreview: boolean;
	config: any;
	imagesDownload: any;
	widht: any;
	gridClass: string;
	styleGrid: string;
	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private notificationService: NotificationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
		private auth : Authentication,
    private info : InfoService,
		private datePipe: DatePipe,
		private cdRef: ChangeDetectorRef,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {

  }
  
  hideMenu() {
    var refactorLayout = document.getElementsByClassName('layout-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorLayout.length; i++) {
      refactorLayout[i].style.marginLeft = '0px';
      refactorLayout[i].style.padding = '0px 0px 0px 0px';
    }

    document.getElementById("app-topbar").style.visibility = "hidden";
    document.getElementById("app-sidebar").style.visibility = "hidden";
    document.getElementById("app-footer").style.visibility = "hidden";
    document.getElementById("pembatas").style.height = "0px";
  }

  ngOnDestroy() {
    var bodySetBackground = document.getElementsByClassName('main-body') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bodySetBackground.length; i++) {
      bodySetBackground[i].style.backgroundColor = '#ecf0f5';
      bodySetBackground[i].style.backgroundImage = null;
    }
    var refactorLayout = document.getElementsByClassName('layout-content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < refactorLayout.length; i++) {
      refactorLayout[i].style.marginLeft = '60px';
      refactorLayout[i].style.padding = '60px 10px 0 10px';
    }
    document.getElementById("app-topbar").style.visibility = "visible";
    document.getElementById("app-sidebar").style.visibility = "visible";
    document.getElementById("app-footer").style.visibility = "visible";
    document.getElementById("pembatas").style.height = "45px";
  }


	ngOnInit() {
    this.hideMenu();
		this.gridClass = "ui-g-12 ui-md-12 ui-lg-12";
		this.styleGrid = "width:150px";

		var w = window.innerHeight;
		this.widht = window.innerWidth - 200;
		var h = w - 200;
		document.getElementById("dialogPreviewId").style.height = h + "px";
		this.config = {
			btnClass: 'default', // The CSS class(es) that will apply to the buttons
			zoomFactor: 0.1, // The amount that the scale will be increased by
			containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
			wheelZoom: true, // If true, the mouse wheel can be used to zoom in
			allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
			allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
			btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
				zoomIn: 'fa fa-plus',
				zoomOut: 'fa fa-minus',
				rotateClockwise: 'fa fa-repeat',
				rotateCounterClockwise: 'fa fa-undo',
				next: 'fa fa-arrow-right',
				prev: 'fa fa-arrow-left',
				fullscreen: 'fa fa-arrows-alt',
			},
			btnShow: {
				zoomIn: true,
				zoomOut: true,
				rotateClockwise: true,
				rotateCounterClockwise: true,
				next: false,
				prev: false,
				fullscreen: false
			},
			customBtns: [{ name: 'download', icon: 'fa fa-download' }, { name: 'excel', icon: 'fa fa-file-pdf-o' }]
		};
		this.images = [];
		this.listDepartemen = [];
		this.listData = [];
		this.listData2 = [];


		this.form = this.fb.group({
			'namaDepartemen': new FormControl('', Validators.required),
			'kdDepartemenHead': new FormControl(''),
			'statusEnabled': new FormControl(''),
			'reportDisplay': new FormControl(''),
			'kdPegawaiKepala': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaExternal': new FormControl(''),
			'isProfitCostCenter': new FormControl(''),
		});
		this.formKeputusan = this.fb.group({
			'noPengajuan': new FormControl({ value: '', disabled: true }),
			'namaPegawai': new FormControl({ value: '', disabled: true }),
			'nik': new FormControl({ value: '', disabled: true }),
			'jenisKelamin': new FormControl({ value: '', disabled: true }),
			'jenisPegawai': new FormControl({ value: '', disabled: true }),
			'jabatan': new FormControl({ value: '', disabled: true }),
			'unitKerja': new FormControl({ value: '', disabled: true }),
			'tanggalVerifikasi': new FormControl(new Date(), Validators.required),
			'keputusan': new FormControl('', Validators.required),
			'keterangan': new FormControl('', Validators.required)
		});


		function list_to_treeDepartemen(list) {
			let warna = ["ui-organizationchart-node-content level-1", "ui-organizationchart-node-content level-2", "ui-organizationchart-node-content level-3", "ui-organizationchart-node-content level-4", "ui-organizationchart-node-content level-5"];
			let map = {}, node, roots = [], i;
			for (i = 0; i < list.length; i += 1) {
				map[list[i].kdJabatan] = i; // inisialisasi

				list[i].children = [];
				// inisialisasi Children
			}
			for (i = 0; i < list.length; i += 1) {
				node = list[i];
				if (node.kdJabatanHead !== null) {
					// jika kdDepartemenHead Tidak Kosong Push Ke Children
					list[map[node.kdJabatanHead]].children.push(node);
				} else {
					roots.push(node);
				}
			}
			return roots;
		}
		this.httpService.get(Configuration.get().dataMaster + '/registrasiPegawai/findStatusPegawaiAktif').subscribe(pegawaiAktif => {
			this.kdStatusPegawaiAktif = pegawaiAktif.data.kode;
			this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=Jabatan&select=id.kode,namaJabatan,kdJabatanHead, reportDisplay, noUrut,statusEnabled, version').subscribe(table => {
				this.listData1 = table.data.data;
				this.listTable = [];
				for (let i = 0; i < this.listData1.length; i++) {
					this.listTable[i] = {
						// "mobilePhone": this.listData1[i].mobilePhone,
						// "faksimile": this.listData1[i].faksimile,
						// "alamatEmail": this.listData1[i].alamatEmail,
						// "website": this.listData1[i].website,
						// "kdPegawaiKepala": this.listData1[i].kdPegawaiKepala,
						// "kodeExternal": this.listData1[i].kodeExternal,
						// "namaExternal": this.listData1[i].namaExternal,
						"reportDisplay": this.listData1[i].reportDisplay,
						// "isProfitCostCenter": this.listData1[i].isProfitCostCenter,
						"id_kode": this.listData1[i].id_kode,
						"namaDepartemen": this.listData1[i].namaJabatan,
						"statusEnabled": this.listData1[i].statusEnabled,
						"kdDepartemenHead": this.listData1[i].kdJabatanHead,
						"version": this.listData1[i].version,
						"noUrut": this.listData1[i].noUrut,
						"children": [],
						"kdJabatan": null,
						"namaJabatan": null,
						"pegawai": [],
						"jml": null,
						// "totalRows": [],
						"kdJabatanHead": null,
					}

					this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Pegawai&criteria=kdJabatan,kdStatusPegawai&values=' + this.listData1[i].id_kode + ',' + this.kdStatusPegawaiAktif + '&page=1&rows=10000&condition=and&profile=y').subscribe(peg => {
						let listpegawai = [];
						let path;
						this.listTable[i].jml = peg.data.data.length;
						// this.listTable[i].totalRows.push({totalRows:peg.data.totalRow});
						let pegawai = peg.data.data;
						pegawai.sort(function(a, b){
							var nameA=a.namaLengkap.toLowerCase(), nameB=b.namaLengkap.toLowerCase()
							if (nameA < nameB) //sort string ascending
								 return -1 
							if (nameA > nameB)
								return 1
							return 0 //default return value (no sorting)
						})
						for (let k = 0; k < pegawai.length; k++) {
							if (pegawai[k].photoDiri == null) {
								path = Configuration.get().resourceFile + "/image/show/profile1213123.png";
							} else {
								path = Configuration.get().resourceFile + '/image/show/' + pegawai[k].photoDiri;
							}
							listpegawai[k] = {
								"kdJabatan": this.listData1[i].id_kode,
								"kdDepartemen": this.listData1[i].id_kode,
								"namaJabatan": this.listData1[i].namaJabatan,
								"namaPegawai": pegawai[k].namaLengkap,
								"kdPegawai": pegawai[k].id.kode,
								"photoDiri": path,
							}
							// var a = this.listTable[i].children.findIndex(x => x.kdJabatan == res.jabatan[j].kdJabatan);
							this.listTable[i].pegawai.push(listpegawai[k])
						}
					});
					let listDepartemen = [...this.listDepartemen];
					listDepartemen.push(this.listTable[i]);
					this.listDepartemen = listDepartemen;
				}

				this.listAsalDepartemen = [];
				this.listAsalDepartemen.push({ label: '--Pilih Departemen--', value: null })
				for (let i = 0; i < table.data.data.length; i++) {
					this.listAsalDepartemen.push({ label: table.data.data[i].namaDepartemen, value: table.data.data[i].id_kode })
				};
				this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Pegawai&select=namaLengkap,id').subscribe(res => {
					this.listPegawai = [];
					this.listPegawai.push({ label: '--Pilih Pegawai Kepala--', value: '' })
					for (let i = 0; i < res.data.data.length; i++) {
						this.listPegawai.push({ label: res.data.data[i].namaLengkap, value: res.data.data[i].id.kode })
					};
				});

				function list_to_tree(list) {
					let warna = ["ui-organizationchart-node-content level-1", "ui-organizationchart-node-content level-2", "ui-organizationchart-node-content level-3", "ui-organizationchart-node-content level-4", "ui-organizationchart-node-content level-5"];
					let map = {}, node, roots = [], i;
					for (i = 0; i < list.length; i += 1) {
						map[list[i].id_kode] = i; // inisialisasi

						list[i].styleClass = warna[list[i].level - 1];
						if (list[i].level - 1 < 5) {
							list[i].expanded = true;
						} else {
							list[i].expanded = false;
						}
						if (list[i].version == null) {
							list[i].type = 'department';
							list[i].styleClass = 'department-cfo';
						} else {
							list[i].type = 'department';
							list[i].styleClass = 'department-cfo';
						}

						list[i].children = [];
						// inisialisasi Children
					}
					for (i = 0; i < list.length; i += 1) {
						node = list[i];
						if (node.kdDepartemenHead !== null) {
							// jika kdDepartemenHead Tidak Kosong Push Ke Children
							list[map[node.kdDepartemenHead]].children.push(node);
						} else {
							roots.push(node);
						}
					}
					return roots;
				}
				function levelAndSort(data, startingLevel) {
					// indexes
					let indexed = {};        // the original values
					let nodeIndex = {};      // tree nodes
					let i;
					for (i = 0; i < data.length; i++) {
						let id_kode = data[i].id_kode;
						let kdPegawaiKepala = data[i].kdPegawaiKepala;
						let kodeExternal = data[i].kodeExternal;
						let namaExternal = data[i].namaExternal;
						let reportDisplay = data[i].reportDisplay;
						let isProfitCostCenter = data[i].isProfitCostCenter;
						let namaDepartemen = data[i].namaDepartemen;
						let statusEnabled = data[i].statusEnabled;
						let kdDepartemenHead = data[i].kdDepartemenHead;
						let version = data[i].version;
						let kdJabatan = data[i].kdJabatan;
						let kdJabatanHead = data[i].kdJabatanHead;
						let namaJabatan = data[i].namaJabatan;
						let children = data[i].children;
						let node = {
							id_kode: id_kode,
							kdPegawaiKepala: kdPegawaiKepala,
							kodeExternal: kodeExternal,
							namaExternal: namaExternal,
							reportDisplay: reportDisplay,
							isProfitCostCenter: isProfitCostCenter,
							namaDepartemen: namaDepartemen,
							statusEnabled: statusEnabled,
							kdDepartemenHead: kdDepartemenHead,
							version: version,
							level: startingLevel,
							children: children,
							sorted: false,
							namaJabatan: namaJabatan,
							kdJabatan: kdJabatan,
							kdJabatanHead: kdJabatanHead,
						};
						indexed[id_kode] = data[i];
						nodeIndex[id_kode] = node;
					}

					// populate tree
					for (i = 0; i < data.length; i++) {
						let node = nodeIndex[data[i].id_kode];
						let pNode = node;
						let j;
						let nextId = indexed[pNode.id_kode].kdDepartemenHead;
						for (j = 0; nextId in nodeIndex; j++) {
							pNode = nodeIndex[nextId];
							if (j == 0) {
								pNode.children.push(node.id_kode);
							}
							node.level++;
							nextId = indexed[pNode.id_kode].kdDepartemenHead;
						}
					}

					// extract nodes and sort-by-level
					let nodes = [];
					for (let key in nodeIndex) {
						nodes.push(nodeIndex[key]);
					}
					nodes.sort(function (a, b) {
						return a.level - b.level;
					});

					// refine the sort: group-by-siblings
					let retval = [];
					for (i = 0; i < nodes.length; i++) {
						let node = nodes[i];
						let kdDepartemenHead = indexed[node.id_kode].kdDepartemenHead;
						if (kdDepartemenHead in indexed) {
							let pNode = nodeIndex[kdDepartemenHead];
							let j;
							for (j = 0; j < pNode.children.length; j++) {
								let child = nodeIndex[pNode.children[j]];
								if (!child.sorted) {
									indexed[child.id_kode].level = child.level;
									retval.push(indexed[child.id_kode]);
									child.sorted = true;
								}
							}
						}
						else if (!node.sorted) {
							indexed[node.id_kode].level = node.level;
							retval.push(indexed[node.id_kode]);
							node.sorted = true;
						}
					}
					return retval;
				}
				let startingLevel = 1;
				let outputArray = levelAndSort(this.listTable, startingLevel);
				let outputArray1 = levelAndSort(this.listTable, startingLevel);
				this.listData = list_to_tree(outputArray);
				if (this.listData.length >= 1) {
					this.listData2 = [this.listData[1]];
				}
			});
		});


	}
	
	dragStart(dragData) {
		this.dragData = dragData;
	}

	drop(dropData) {
		this.dropData = dropData;
		this.versi = this.dragData.version;

		if (this.dragData.id_kode == this.dropData.id_kode) {

		} else {
			let fixHub = {
				"kode": this.dragData.id_kode,
				"namaJabatan": this.dragData.namaDepartemen,
				"noUrut": this.dragData.noUrut,
				"kdJabatanHead": this.dropData.id_kode,
				"statusEnabled": this.dragData.statusEnabled,
				"reportDisplay": this.dragData.reportDisplay,
			}
			this.httpService.update(Configuration.get().dataMasterNew + '/jabatan/update/' + this.versi, fixHub).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Diperbarui');
				this.listDepartemen = [];
				this.dropData = null;
				this.dragData = null;
				this.ngOnInit();
			});
		}

	}
	setTimeStamp(date) {
		let dataTimeStamp = (new Date(date).getTime() / 1000);
		return dataTimeStamp;
	}
	get() {
		

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
		this.simpan();
	}
	simpan() {

	}
	reset() {
		this.ngOnInit();
	}
	onDestroy() {

	}
	update() {
		let fixHub = {
			"kode": this.kode,
			"namaDepartemen": this.form.get('namaDepartemen').value,
			"kdDepartemenHead": this.form.get('kdDepartemenHead').value,
			"statusEnabled": this.form.get('statusEnabled').value,
			"kdPegawaiKepala": this.form.get('kdPegawaiKepala').value,
			"kodeExternal": this.kodeExternal,
			"namaExternal": this.namaExternal,
			"reportDisplay": this.form.get('namaDepartemen').value,
			"isProfitCostCenter": this.form.get('isProfitCostCenter').value,
		}
		this.httpService.update(Configuration.get().dataMasterNew + '/departemen/update/' + this.versi, fixHub).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.listDepartemen = [];
			this.dialogInfoDepartemen = false;
			this.ngOnInit();
		});
	}
	edit(row) {
		this.versi = this.listDepartemen[row].version;
		let fixHub = {

			"kode": this.listDepartemen[row].kode,
			"namaDepartemen": this.listDepartemen[row].namaDepartemen,
			"kdDepartemenHead": this.listDepartemen[row].kdDepartemenHead,
			"statusEnabled": this.listDepartemen[row].statusEnabled,
			// "mobilePhone": this.listDepartemen[row].mobilePhone,
			// "faksimile": this.listDepartemen[row].faksimile,
			// "alamatEmail": this.listDepartemen[row].alamatEmail,
			// "website": this.listDepartemen[row].website,
			"kdPegawaiKepala": this.listDepartemen[row].kdPegawaiKepala,
			"kodeExternal": this.listDepartemen[row].kodeExternal,
			"namaExternal": this.listDepartemen[row].namaExternal,
			"reportDisplay": this.listDepartemen[row].reportDisplay,
			"isProfitCostCenter": this.listDepartemen[row].isProfitCostCenter,

		}
		this.httpService.update(Configuration.get().dataMasterNew + '/departemen/update/' + this.versi, fixHub).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.listDepartemen = [];
			this.ngOnInit();
		});

	}

	onNodeSelect(event) {
		this.form.get('namaDepartemen').setValue(event.node.namaDepartemen);
		this.form.get('kdDepartemenHead').setValue(event.node.kdDepartemenHead);
		this.form.get('statusEnabled').setValue(event.node.statusEnabled);
		this.form.get('reportDisplay').setValue(event.node.reportDisplay);
		this.form.get('kdPegawaiKepala').setValue(event.node.kdPegawaiKepala);
		this.form.get('kodeExternal').setValue(event.node.kodeExternal);
		this.form.get('namaExternal').setValue(event.node.namaExternal);
		this.form.get('isProfitCostCenter').setValue(event.node.isProfitCostCenter);

		this.reportDisplay = event.node.reportDisplay;
		this.kode = event.node.id_kode;

		this.kdPegawaiKepala = event.node.kdPegawaiKepala;
		this.kodeExternal = event.node.kodeExternal;
		this.namaExternal = event.node.namaExternal;
		this.isProfitCostCenter = event.node.isProfitCostCenter;
		this.versi = event.node.version;

		this.dialogInfoDepartemen = true;
	}
	pilihDepartemenHead(i, ri) {
	}
	snapShot() {
		var u = document.getElementsByName("tdlabelPegawai");
		var v = document.getElementsByName("tdgambarPegawai");
		var w = document.getElementsByName("gambarPegawai");
		var x = document.getElementsByClassName("removedClass") as HTMLCollectionOf<HTMLElement>;
		var y = document.getElementsByName("introtext");
		var z = document.getElementsByName("testtt");
		for (var i = 0; i < u.length; i++) {
			u[i].removeAttribute('style');
			u[i].style.width = "80%";
			u[i].style.verticalAlign = "middle";
		}
		for (var i = 0; i < v.length; i++) {
			v[i].removeAttribute('style');
			v[i].style.width = "20%";
			v[i].style.verticalAlign = "middle";
		}
		for (var i = 0; i < w.length; i++) {
			w[i].style.cssFloat = "left";
		}
		for (var i = 0; i < y.length; i++) {
			y[i].removeAttribute('style');
			y[i].style.width = "500px";
		}
		for (var i = 0; i < x.length; i++) {
			x[i].removeAttribute('style');
		}
		for (var i = 0; i < z.length; i++) {
			z[i].className = "ui-g-12 ui-md-12 ui-lg-4";
		}
		var element = document.getElementById("screenShot");
		html2canvas(element).then((canvas) => {
			this.images = [canvas.toDataURL()];
			this.dialogPreview = true;
			this.imagesDownload = this.dataURItoBlob(canvas.toDataURL());
			for (var i = 0; i < u.length; i++) {
				u[i].removeAttribute('style');
				u[i].style.width = "80%";
				u[i].style.verticalAlign = "middle";
			}
			for (var i = 0; i < v.length; i++) {
				v[i].removeAttribute('style');
				v[i].style.width = "20%";
				v[i].style.verticalAlign = "middle";
			}
			for (var i = 0; i < w.length; i++) {
				w[i].style.cssFloat = "left";
			}
			for (var i = 0; i < x.length; i++) {
				x[i].style.height = "150px";
				x[i].style.overflowY = "scroll";
			}
			for (var i = 0; i < y.length; i++) {
				y[i].removeAttribute('style');
				y[i].style.width = "150px";
			}
			for (var i = 0; i < z.length; i++) {
				z[i].className = "ui-g-12 ui-md-12 ui-lg-12";
			}
			// this.gridClass = "ui-g-12 ui-md-12 ui-lg-12";

		});
	}
	exportToDoc() {
		let kdProfile = this.authGuard.getUserDto().kdProfile;
		let kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
		let data = {
			"download": false,
			"kdDepartemen": kdDepartemen,
			"kdProfile": kdProfile,
			"outDepartemen": true,
			"outProfile": true,
			"paramImgKey": [
			],
			"paramImgValue": [
			],
			"paramKey": [
				"kdProfile", "labelLaporan", "kdStatusPegwaiAktif"
			],
			"paramValue": [
				kdProfile, "Struktur Organisasi", this.kdStatusPegawaiAktif
			]
		}

		this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-struktur-organisasi-report.pdf', 'Struktur Organisasi', data);
	}

	exportToXLSX() {
		let kdProfile = this.authGuard.getUserDto().kdProfile;
		let kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
		let data = {
			"namaFile": "struktur-organisasi-report",
			"extFile": ".xlsx",
			"excelOneSheet": true,
			"download": true,
			"kdDepartemen": kdDepartemen,
			"kdProfile": kdProfile,
			"outDepartemen": true,
			"outProfile": true,
			"paramImgKey": [
			],
			"paramImgValue": [
			],
			"paramKey": [
				"kdProfile", "labelLaporan", "kdStatusPegwaiAktif"
			],
			"paramValue": [
				kdProfile, "Struktur Organisasi", this.kdStatusPegawaiAktif
			]
		}

		this.httpService.genericReport(Configuration.get().report + '/generic/report/cetak-struktur-organisasi-report.xlsx', data).subscribe(res => {

		});
		//		this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-struktur-organisasi-report.xlsx', 'Struktur Organisasi', data);
	}



	handleEvent(event) {
		let kdProfile = this.authGuard.getUserDto().kdProfile;
		let kdDepartemen = this.authGuard.getUserDto().kdDepartemen;
		if (event.name == 'download') {
			saveAs(this.imagesDownload, "Struktur-Organisasi.png");
		} else if (event.name == 'excel') {
			let data = {
				"download": true,
				"kdDepartemen": kdDepartemen,
				"kdProfile": kdProfile,
				"outDepartemen": true,
				"outProfile": true,
				"paramImgKey": [
				],
				"paramImgValue": [
				],
				"paramKey": [
					"kdProfile", "labelLaporan", "kdStatusPegwaiAktif"
				],
				"paramValue": [
					kdProfile, "Struktur Organisasi", this.kdStatusPegawaiAktif
				]
			}
			this.print.showEmbedPDFReport(Configuration.get().report + '/generic/report/cetak-struktur-organisasi-report.pdf', 'Struktur Organisasi', data);
		}
	}
	dataURItoBlob(dataURI) {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		var byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);

		// create a view into the buffer
		var ia = new Uint8Array(ab);

		// set the bytes of the buffer to the correct values
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var blob = new Blob([ab], { type: mimeString });
		return blob;

	}

	logout(event: Event) {
		event.preventDefault();
		// this.auth.logout();
		// window.alert("jgn lupa dibalikin sebelum dipush");
		this.confirmationService.confirm({
			message:
				"<div>Harap simpan pekerjaan sebelum logout.<br/>Yakin akan melanjutkan?</div>",
			header: "Peringatan",
			accept: () => {
				this.httpService
					.get(Configuration.get().authLogin + "/off/sign-out-all")
					.subscribe(
						res => {
							this.notificationService.logout();
							this.auth.logout();
						},
						error => {
							this.info.warn(
								"Peringatan",
								"Logout tidak berhasil, harap coba lagi atau cek koneksi internet anda."
							);
						}
					);
			},
			reject: () => {}
		});
	}

}
