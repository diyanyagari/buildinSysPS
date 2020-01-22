import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/primeng';

@Component({
	selector: 'app-preview-menu-user-baru',
	templateUrl: './preview-menu-user-baru.component.html',
	styleUrls: ['./preview-menu-user-baru.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class PreviewMenuUserBaruComponent implements OnInit {
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
	date11 = new Date();
	tglAktif;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private fileService: FileService,
		private authGuard: AuthGuard,
		private datePipe: DatePipe,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) { }

	ngAfterViewInit() {
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

	startLayanan() {
		this.popuptgl = true;
	}

	stopLayanan() {

	}

	previewLayanan() {

	}

	onChangeAktif() {
		console.log(this.tglAktif)
	}
}

