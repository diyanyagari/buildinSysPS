import { Inject, forwardRef, Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/primeng';


@Component({
	selector: 'app-monitoring-userbaru',
	templateUrl: './monitoring-userbaru.component.html',
	styleUrls: ['./monitoring-userbaru.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class MonitoringUserBaruComponent implements OnInit, AfterViewInit {
	public myEvent: EventEmitter<void>;
	formAktif: boolean;
	form: FormGroup;
	listData: any = [];
	listLayanan: any = [];
	pencarian: string = '';
	page: number;
	pageL: number;
	totalRecords;
	totalRecordsLayanan;
	rows: number;
	rowsL: number;
	codes: any[];
	kdprof: any;
	kddept: any;
	items: MenuItem[];
	noKontak;
	popuptgl = false;
	popuptglnonaktif = false;
	popupPreviewMenu = false;
	date11 = new Date();
	tglAktif;
	tglNonAktif;
	innerWidth;
	innerHeight;
	datamdl;
	listMenu;
	listPosisiStrukturMenu = [];
	listPosisiNoUrutStrukturMenu = [];
	skdProfileUser;
	skdModulAplikasi;
	skdVersion;
	sNamaProfile;
	sMdlAplikasi;
	sVersion;
	popupTambah = false;
	listTambahMenu;
	pencarianTambahMenu;
	listTambahMenuAll;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private fileService: FileService,
		private authGuard: AuthGuard,
		private datePipe: DatePipe,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {
		this.myEvent = new EventEmitter<void>();
	}

	ngAfterViewInit() {
		this.myEvent.emit();
		var x = document.getElementsByClassName('ui-button-text-icon-left') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < x.length; i++) {
			x[i].style.height = '25px';
		}

		var y = document.getElementsByClassName('ui-button-text ui-clickable') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < y.length; i++) {
			y[i].style.paddingTop = '0px';
		}

		var z = document.getElementsByClassName('ui-splitbutton-menubutton ui-button ui-widget ui-state-default ui-corner-right ui-button-icon-only') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < z.length; i++) {
			z[i].style.height = "25px";
		}
	}

	ngOnInit() {
		this.innerWidth = window.innerWidth - 50;
		this.innerHeight = window.innerHeight - 10;
		this.pencarian = '';
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
					this.downloadExcel(this.page, this.rows, this.pencarian);
				}
			},
		];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		if (this.pageL == undefined || this.rowsL == undefined) {
			this.pageL = Configuration.get().page;
			this.rowsL = Configuration.get().rows;
		}
		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			'tglAwal': new FormControl(new Date(), Validators.required),
			'tglAkhir': new FormControl(new Date(), Validators.required),
		});
		this.form.get('tglAwal').value.setHours(0, 0, 0)
		// this.form.get('tglAkhir').value.setHours(23,59,59)
		this.getDataGrid(this.page, this.rows, this.pencarian)
	}
	getDataGrid(page: number, rows: number, pencarian: string) {
		pencarian = this.pencarian;
		page = page - 1;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value.setSeconds(0), 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value.setSeconds(59), 'yyyy-MM-dd HH:mm:ss')

		// tglAwal = tglAwal.slice(0, 4)
		// tglAkhir = tglAkhir.slice(0, 4)
		// tglAwal = tglAwal + "-01-01" + " 00%3A00%3A00"
		// tglAkhir = tglAkhir + "-12-31" + " 23%3A59%3A59"
		if (this.pencarian == "") {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/MonitoringUser?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(table => {
				this.listData = table.items;
				this.totalRecords = table.totalCount;
				for (let i = 0; i < this.listData.length; i++) {
					this.listData[i].foto = Configuration.get().resourceFile + '/image/show/' + this.listData[i].foto;
				}
			});
		} else {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/MonitoringUser?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(table => {
				this.listData = table.items;
				this.totalRecords = table.totalCount;
				for (let i = 0; i < this.listData.length; i++) {
					this.listData[i].foto = Configuration.get().resourceFile + '/image/show/' + this.listData[i].foto;
				}
			});
		}
	}

	getDataLayanan(page: number, rows: number, noKontak) {
		page = page - 1;
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/DetailLayananUserSaas?noKontak=' + noKontak + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(table => {
			this.listLayanan = table.items;
			this.totalRecordsLayanan = table.totalCount;
		});
	}

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	loadPageLayanan(event: LazyLoadEvent) {
		this.getDataLayanan((event.rows + event.first) / event.rows, event.rows, this.noKontak);
		this.pageL = (event.rows + event.first) / event.rows;
		this.rowsL = event.rows;
	}

	onRowSelect(event) {
	}
	reset() {
		this.ngOnInit();
	}

	downloadExcel(page: number, rows: number, pencarian: any) {
		page = page - 1;
		pencarian = this.pencarian;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value.setSeconds(0), 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value.setSeconds(59), 'yyyy-MM-dd HH:mm:ss')
		// tglAwal = tglAwal.slice(0, 4)
		// tglAkhir = tglAkhir.slice(0, 4)
		// tglAwal = tglAwal + "-01-01" + " 00%3A00%3A00"
		// tglAkhir = tglAkhir + "-12-31" + " 23%3A59%3A59"
		if (pencarian == "") {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/MonitoringUserSaas?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(table => {
				let x = table.items;
				this.codes = [];

				for (let i = 0; i < x.length; i++) {
					this.codes.push({
						'Tanggal Daftar': this.datePipe.transform(x[i].tglDaftar, 'yyyy-MM-dd HH:mm'),
						'Nama Lengkap': x[i].namaLengkap,
						'Jenis Kelamin': x[i].jenisKelamin.jenisKelamin,
						'Tanggal Lahir': x[i].tglLahir,
						'Jenis Identitas': x[i].jenisIdentitas.jenisDokumen,
						'No. Identitas': x[i].noIdentitas,
						'Jenis Alamat': x[i].jenisAlamat,
						'Alamat': x[i].alamatLengkap,
						'Negara': x[i].negara,
						'No. Telepon': x[i].noTelepon,
						'Email': x[i].email,
					})
				}
				this.fileService.exportAsExcelFile(this.codes, 'Monitoring User Baru');
			});
		} else {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/MonitoringUserSaas?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(table => {
				let x = table.items;
				this.codes = [];

				for (let i = 0; i < x.length; i++) {
					this.codes.push({
						'Tanggal Daftar': this.datePipe.transform(x[i].tglDaftar, 'yyyy-MM-dd HH:mm'),
						'Nama Lengkap': x[i].namaLengkap,
						'Jenis Kelamin': x[i].jenisKelamin.jenisKelamin,
						'Tanggal Lahir': x[i].tglLahir,
						'Jenis Identitas': x[i].jenisIdentitas.jenisDokumen,
						'No. Identitas': x[i].noIdentitas,
						'Jenis Alamat': x[i].jenisAlamat,
						'Alamat': x[i].alamatLengkap,
						'Negara': x[i].negara,
						'No. Telepon': x[i].noTelepon,
						'Email': x[i].email,
					})
				}
				this.fileService.exportAsExcelFile(this.codes, 'Monitoring User Baru');
			});
		}
	}

	downloadPdf() {
		let tglawal = this.form.get('tglAwal').value
		let tglAkhir = this.form.get('tglAkhir').value
		let x = tglawal.getTime() / 1000.0
		let y = tglAkhir.getTime() / 1000.0
		let query;
		let page = this.page - 1;
		query = " and LoginUser_S.TglDaftar between " + x + " and " + y + " and (Kontak_M.NamaLengkap like '%" + this.pencarian + "%' or LoginUser_S.NamaUserEmail like '%" + this.pencarian + "%') AND LoginUser_S.StatusEnabled = 1 order by LoginUser_S.TglDaftar asc OFFSET " + page + " ROWS FETCH NEXT " + this.rows + " ROWS ONLY"

		// if(this.pencarian != "") {
		// 	query = " and LoginUser_S.TglDaftar between "+ x +" and " + y + " and (Kontak_M.NamaLengkap like '%" + this.pencarian + "%' or LoginUser_S.NamaUserEmail like '%" + this.pencarian + "%')"
		// } else {
		// 	query = " and LoginUser_S.TglDaftar between "+ x +" and " + y + " and (Kontak_M.NamaLengkap)"
		// }

		let data = {
			"download": true,
			"kdDepartemen": '',
			"kdProfile": this.kdprof,
			"extFile": ".pdf",
			"namaFile": "daftar-monitoring-user.pdf",
			"paramImgKey": [
			],
			"paramImgValue": [
			],
			"paramKey": [
				"labelLaporan", "query"
			],
			"paramValue": [
				"Monitoring Customer Care", query
			]
		}
		this.httpService.genericReport(Configuration.get().report + '/generic/report/daftar-monitoring-user.pdf', data).subscribe(response => {

		});
	}
	cetak() {
		let printContents, popupWin;
		printContents = document.getElementById('print-section').innerHTML;
		popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
            <html>
                <head>
                    <title></title>
                    <style>
                        @media print{
                            @page {
                                size: landscape
                            }
                        }
                        th, td {
                            border: 1px solid black;
                            border-collapse: collapse;
                            word-wrap:break-word;
                            max-width:200px;
                        }
                        table {
                            border: 1px solid black;
                            border-collapse: collapse;
                            table-layout: fixed;
                        }
                    </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
             </html>`
		);
		popupWin.document.close();
	}

	expandRow(event, i) {
		this.noKontak = event.data.noKontak
		this.getDataLayanan(this.pageL, this.rowsL, this.noKontak)
	}

	startLayanan(noRegistrasi, noPosting, kdModulAplikasi, kdVersion, kdPaket, namaDomain) {
		this.popuptgl = true;
		// console.log(data)
		let data = {
			'noRegistrasi': noRegistrasi,
			'noPosting': noPosting,
			'kdModulAplikasi': kdModulAplikasi,
			'kdVersion': kdVersion,
			'kdPaket': kdPaket,
			'namaDomain': namaDomain
		}
		this.datamdl = data;
	}

	stopLayanan(noRegistrasi, noPosting, kdModulAplikasi, kdVersion, kdPaket, namaDomain) {
		this.popuptglnonaktif = true;
		let data = {
			'noRegistrasi': noRegistrasi,
			'noPosting': noPosting,
			'kdModulAplikasi': kdModulAplikasi,
			'kdVersion': kdVersion,
			'kdPaket': kdPaket,
			'namaDomain': namaDomain
		}
		this.datamdl = data;
	}

	onChangeAktif() {
		if (this.tglAktif != undefined) {
			let dataSimpan = {
				"noRegistrasi": this.datamdl.noRegistrasi,
				"noPosting": this.datamdl.noPosting,
				"kdModulAplikasi": this.datamdl.kdModulAplikasi,
				"kdVersion": this.datamdl.kdVersion,
				"kdPaket": this.datamdl.kdPaket,
				"namaDomain": this.datamdl.namaDomain,
				"tglStart": this.tglAktif.getFullYear() + "-" + ("0" + (this.tglAktif.getMonth() + 1)).slice(-2) + "-" + this.tglAktif.getDate() + " 00:00:00"
			}
			this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/StartLayananSaas', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.popuptgl = false;
				this.datamdl = "";
				this.getDataLayanan(this.pageL, this.rowsL, this.noKontak)
			})
		} else {
			this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
		}
	}

	onChangeNonAktif() {
		if (this.tglNonAktif != undefined) {
			let dataSimpan = {
				"noRegistrasi": this.datamdl.noRegistrasi,
				"noPosting": this.datamdl.noPosting,
				"kdModulAplikasi": this.datamdl.kdModulAplikasi,
				"kdVersion": this.datamdl.kdVersion,
				"kdPaket": this.datamdl.kdPaket,
				"namaDomain": this.datamdl.namaDomain,
				"tglStop": this.tglNonAktif.getFullYear() + "-" + ("0" + (this.tglNonAktif.getMonth() + 1)).slice(-2) + "-" + this.tglNonAktif.getDate() + " 23:59:59"
			}
			this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/StopLayananSaas', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.popuptglnonaktif = false;
				this.datamdl = "";
				this.getDataLayanan(this.pageL, this.rowsL, this.noKontak)
			})
		} else {
			this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
		}
	}

	toggleCoba(rowData: any, dtEn: any) {
		dtEn.toggleRow(rowData);
	}

	popuplistmenu(kdProfileUser, kdModulAplikasi, kdVersion, profile, mdlAplikasi, version) {
		this.myEvent.emit();
		this.skdModulAplikasi = kdModulAplikasi;
		this.skdProfileUser = kdProfileUser;
		this.skdVersion = kdVersion;
		this.sNamaProfile = profile;
		this.sMdlAplikasi = mdlAplikasi;
		this.sVersion = version;
		this.listPosisiStrukturMenu = [];
        this.listPosisiStrukturMenu.push({ label: '--Pilih--', value: null })
        this.listPosisiStrukturMenu.push({ label: 'Atas', value: 'Atas' })
        this.listPosisiStrukturMenu.push({ label: 'Bawah', value: 'Bawah' })
        this.listPosisiStrukturMenu.push({ label: 'Kiri', value: 'Kiri' })
		this.listPosisiStrukturMenu.push({ label: 'Kanan', value: 'Kanan' })
		
		this.listPosisiNoUrutStrukturMenu = [];
        this.listPosisiNoUrutStrukturMenu.push({ label: '--Pilih--', value: null })
        this.listPosisiNoUrutStrukturMenu.push({ label: 'Rata Kiri', value: 'Rata Kiri' })
        this.listPosisiNoUrutStrukturMenu.push({ label: 'Rata Kanan', value: 'Rata Kanan' })
        this.listPosisiNoUrutStrukturMenu.push({ label: 'Rata Kiri Kanan', value: 'Rata Kiri Kanan' })
		
		
		this.popupPreviewMenu = true;
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/PreviewMenuLayananComplete?kdProfileUser=' + kdProfileUser + '&kdModulAplikasi=' + kdModulAplikasi + '&kdVersion=' + kdVersion).subscribe(table => {
			this.listMenu = table;
		});
	}

	isParentChecked(event, data, index) {
		console.log(this.listMenu)
	}

	updatelistmenu() {
		let dataSimpan = []
		// console.log(this.listMenu)
		for (let i = 0; i < this.listMenu.length; i++) {
			let dataTemp = {
				"kdProfileUser": this.skdProfileUser,
				"kdModulAplikasi": this.skdModulAplikasi,
				"kdVersion": this.skdVersion,
				"kdObjekModulAplikasi": this.listMenu[i].kdObjekModul,
				"noUrut": this.listMenu[i].noUrut,
				"isLoginOtomatis": this.listMenu[i].loginOtomatis,
				"posisiStrukturMenu": this.listMenu[i].posisiStrukturMenu,
				"posisiNoUrutStrukturMenu": this.listMenu[i].posisiNoUrutStrukturMenu,
				"isShowHide": this.listMenu[i].tampilkan,
				"isAktif": this.listMenu[i].statusAktif,
				"isChecked": true
			}
			dataSimpan.push(dataTemp)
			if (this.listMenu[i].childs.length > 0) {
				for (let j = 0; j < this.listMenu[i].childs.length; j++) {
					let dataTemp = {
						"kdProfileUser": this.skdProfileUser,
						"kdModulAplikasi": this.skdModulAplikasi,
						"kdVersion": this.skdVersion,
						"kdObjekModulAplikasi": this.listMenu[i].childs[j].kdObjekModul,
						"noUrut": this.listMenu[i].childs[j].noUrut,
						"isLoginOtomatis": this.listMenu[i].childs[j].loginOtomatis,
						"posisiStrukturMenu": this.listMenu[i].childs[j].posisiStrukturMenu,
						"posisiNoUrutStrukturMenu": this.listMenu[i].childs[j].posisiNoUrutStrukturMenu,
						"isShowHide": this.listMenu[i].childs[j].tampilkan,
						"isAktif": this.listMenu[i].childs[j].statusAktif,
						"isChecked": true
					}
					dataSimpan.push(dataTemp)
					if (this.listMenu[i].childs[j].childs.length > 0) {
						for (let k = 0; k < this.listMenu[i].childs[j].childs.length; k++) {
							let dataTemp = {
								"kdProfileUser": this.skdProfileUser,
								"kdModulAplikasi": this.skdModulAplikasi,
								"kdVersion": this.skdVersion,
								"kdObjekModulAplikasi": this.listMenu[i].childs[j].childs[k].kdObjekModul,
								"noUrut": this.listMenu[i].childs[j].childs[k].noUrut,
								"isLoginOtomatis": this.listMenu[i].childs[j].childs[k].loginOtomatis,
								"posisiStrukturMenu": this.listMenu[i].childs[j].childs[k].posisiStrukturMenu,
								"posisiNoUrutStrukturMenu": this.listMenu[i].childs[j].childs[k].posisiNoUrutStrukturMenu,
								"isShowHide": this.listMenu[i].childs[j].childs[k].tampilkan,
								"isAktif": this.listMenu[i].childs[j].childs[k].statusAktif,
								"isChecked": true
							}
							dataSimpan.push(dataTemp)
							if (this.listMenu[i].childs[j].childs[k].childs.length > 0) {
								for (let l = 0; l < this.listMenu[i].childs[j].childs[k].childs.length; l++) {
									let dataTemp = {
										"kdProfileUser": this.skdProfileUser,
										"kdModulAplikasi": this.skdModulAplikasi,
										"kdVersion": this.skdVersion,
										"kdObjekModulAplikasi": this.listMenu[i].childs[j].childs[k].childs[l].kdObjekModul,
										"noUrut": this.listMenu[i].childs[j].childs[k].childs[l].noUrut,
										"isLoginOtomatis": this.listMenu[i].childs[j].childs[k].childs[l].loginOtomatis,
										"posisiStrukturMenu": this.listMenu[i].childs[j].childs[k].childs[l].posisiStrukturMenu,
										"posisiNoUrutStrukturMenu": this.listMenu[i].childs[j].childs[k].childs[l].posisiNoUrutStrukturMenu,
										"isShowHide": this.listMenu[i].childs[j].childs[k].childs[l].tampilkan,
										"isAktif": this.listMenu[i].childs[j].childs[k].childs[l].statusAktif,
										"isChecked": true
									}
									dataSimpan.push(dataTemp)
								}
							}
						}
					}
				}
			}
		}
		console.log(dataSimpan)
		this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/UbahPreviewMenuLayananMany', dataSimpan).subscribe(table => {
			this.alertService.success("Berhasil", "Data Berhasil Disimpan")
		});
	}

	close1() {
		this.ngAfterViewInit();
		var x = document.getElementsByClassName('ui-button-text-icon-left') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < x.length; i++) {
			x[i].style.height = '25px';
		}

		var y = document.getElementsByClassName('ui-button-text ui-clickable') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < y.length; i++) {
			y[i].style.paddingTop = '0px';
		}

		var z = document.getElementsByClassName('ui-splitbutton-menubutton ui-button ui-widget ui-state-default ui-corner-right ui-button-icon-only') as HTMLCollectionOf<HTMLElement>;
		for (let i = 0; i < z.length; i++) {
			z[i].style.height = "25px";
		}
		this.popupPreviewMenu = false
		this.skdProfileUser = "";
		this.skdModulAplikasi = "";
		this.skdVersion = "";
	}

	onAdd() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/PreviewTambahLayananComplete?kdProfileUser=' + this.skdProfileUser + '&kdModulAplikasi=' + this.skdModulAplikasi + '&kdVersion=' + this.skdVersion).subscribe(table => {
			this.listTambahMenu = table
			this.listTambahMenuAll = table
		});
		this.popupTambah = true;
	}

	cari() {
		if (this.pencarianTambahMenu == "") {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/PreviewTambahLayananComplete?kdProfileUser=' + this.skdProfileUser + '&kdModulAplikasi=' + this.skdModulAplikasi + '&kdVersion=' + this.skdVersion).subscribe(table => {
				this.listTambahMenu = table
			});
		} else {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/PreviewTambahLayananComplete?kdProfileUser=' + this.skdProfileUser + '&kdModulAplikasi=' + this.skdModulAplikasi + '&kdVersion=' + this.skdVersion + '&keyword=' + this.pencarianTambahMenu).subscribe(table => {
				this.listTambahMenu = table
			});
		}
	}

	simpanTambahMenu() {
		console.log(this.listTambahMenu)
		// console.log(this.listTambahMenuAll)

		let dataSimpan = []
		for (let i = 0; i < this.listTambahMenu.length; i++) {
			let dataTemp = {
				"kdProfileUser": this.skdProfileUser,
				"kdModulAplikasi": this.skdModulAplikasi,
				"kdVersion": this.skdVersion,
				"kdObjekModulAplikasi": this.listTambahMenu[i].kdObjekModul,
				"noUrut": this.listTambahMenu[i].noUrut,
				"isLoginOtomatis": this.listTambahMenu[i].loginOtomatis,
				"posisiStrukturMenu": this.listTambahMenu[i].posisiStrukturMenu,
				"posisiNoUrutStrukturMenu": this.listTambahMenu[i].posisiNoUrutStrukturMenu,
				"isShowHide": this.listTambahMenu[i].tampilkan,
				"isAktif": this.listTambahMenu[i].isChecked,
				"isChecked": this.listTambahMenu[i].isChecked
			}
			dataSimpan.push(dataTemp)
			if (this.listTambahMenu[i].childs != null) {
				for (let j = 0; j < this.listTambahMenu[i].childs.length; j++) {
					let dataTemp = {
						"kdProfileUser": this.skdProfileUser,
						"kdModulAplikasi": this.skdModulAplikasi,
						"kdVersion": this.skdVersion,
						"kdObjekModulAplikasi": this.listTambahMenu[i].childs[j].kdObjekModul,
						"noUrut": this.listTambahMenu[i].childs[j].noUrut,
						"isLoginOtomatis": this.listTambahMenu[i].childs[j].loginOtomatis,
						"posisiStrukturMenu": this.listTambahMenu[i].childs[j].posisiStrukturMenu,
						"posisiNoUrutStrukturMenu": this.listTambahMenu[i].childs[j].posisiNoUrutStrukturMenu,
						"isShowHide": this.listTambahMenu[i].childs[j].tampilkan,
						"isAktif": this.listTambahMenu[i].childs[j].isChecked,
						"isChecked": this.listTambahMenu[i].childs[j].isChecked
					}
					dataSimpan.push(dataTemp)
					if (this.listTambahMenu[i].childs[j] != null) {
						for (let k = 0; k < this.listTambahMenu[i].childs[j].childs.length; k++) {
							let dataTemp = {
								"kdProfileUser": this.skdProfileUser,
								"kdModulAplikasi": this.skdModulAplikasi,
								"kdVersion": this.skdVersion,
								"kdObjekModulAplikasi": this.listTambahMenu[i].childs[j].childs[k].kdObjekModul,
								"noUrut": this.listTambahMenu[i].childs[j].childs[k].noUrut,
								"isLoginOtomatis": this.listTambahMenu[i].childs[j].childs[k].loginOtomatis,
								"posisiStrukturMenu": this.listTambahMenu[i].childs[j].childs[k].posisiStrukturMenu,
								"posisiNoUrutStrukturMenu": this.listTambahMenu[i].childs[j].childs[k].posisiNoUrutStrukturMenu,
								"isShowHide": this.listTambahMenu[i].childs[j].childs[k].tampilkan,
								"isAktif": this.listTambahMenu[i].childs[j].childs[k].isChecked,
								"isChecked": this.listTambahMenu[i].childs[j].childs[k].isChecked
							}
							dataSimpan.push(dataTemp)
							if (this.listTambahMenu[i].childs[j].childs[k] != null) {
								for (let l = 0; l < this.listTambahMenu[i].childs[j].childs[k].childs.length; l++) {
									let dataTemp = {
										"kdProfileUser": this.skdProfileUser,
										"kdModulAplikasi": this.skdModulAplikasi,
										"kdVersion": this.skdVersion,
										"kdObjekModulAplikasi": this.listTambahMenu[i].childs[j].childs[k].childs[l].kdObjekModul,
										"noUrut": this.listTambahMenu[i].childs[j].childs[k].childs[l].noUrut,
										"isLoginOtomatis": this.listTambahMenu[i].childs[j].childs[k].childs[l].loginOtomatis,
										"posisiStrukturMenu": this.listTambahMenu[i].childs[j].childs[k].childs[l].posisiStrukturMenu,
										"posisiNoUrutStrukturMenu": this.listTambahMenu[i].childs[j].childs[k].childs[l].posisiNoUrutStrukturMenu,
										"isShowHide": this.listTambahMenu[i].childs[j].childs[k].childs[l].tampilkan,
										"isAktif": this.listTambahMenu[i].childs[j].childs[k].childs[l].isChecked,
										"isChecked": this.listTambahMenu[i].childs[j].childs[k].childs[l].isChecked
									}
									dataSimpan.push(dataTemp)
								}
							}
						}
					}
				}
			}
		}
		// console.log(dataSimpan)
		this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/TambahMenuLayananBanyak', dataSimpan).subscribe(table => {
			this.popuplistmenu(this.skdProfileUser, this.skdModulAplikasi, this.skdVersion, this.sNamaProfile, this.sMdlAplikasi, this.sVersion);
			this.popupTambah = false;
			this.pencarianTambahMenu = "";
			this.alertService.success("Berhasil", "Data Berhasil Disimpan")
		});
	}
}

