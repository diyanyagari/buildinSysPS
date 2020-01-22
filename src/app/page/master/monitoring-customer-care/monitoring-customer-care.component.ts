import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '../../../global/service/HttpClient';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/primeng';
import { FileService, AlertService, Configuration, AuthGuard } from '../../../global';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-monitoring-customer-care',
	templateUrl: './monitoring-customer-care.component.html',
	styleUrls: ['./monitoring-customer-care.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class MonitoringCustomerCareComponent implements OnInit {

	form: FormGroup;
	page: number;
	rows: number;
	codes: any[];
	listData: any[];
	items: MenuItem[];
	totalRecords: number;
	pencarian = '';
	kdprof: any;

	constructor(
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private authGuard: AuthGuard,
		private datePipe: DatePipe,
		private fb: FormBuilder,
		private fileService: FileService
	) { }

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
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.form = this.fb.group({
			'tglAwal': new FormControl(new Date(), Validators.required),
			'tglAkhir': new FormControl(new Date(), Validators.required),
		});
		this.form.get('tglAwal').value.setHours(0,0,0)
		// this.form.get('tglAkhir').value.setHours(23,59,59)
		this.items = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					this.downloadPdf();
				}
			},
			{
				label: 'Excel', icon: 'fa-file-excel-o', command: () => {
					this.downloadExel(this.page, this.rows, this.pencarian);
				}
			}];
		this.cari(this.page, this.rows, '');
	}

	cari(page: number, rows: number, pencarian) {
		pencarian = this.pencarian;
		page = page - 1;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value.setSeconds(0), 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value.setSeconds(59), 'yyyy-MM-dd HH:mm:ss')
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/PelayananKonsumen/Monitoring?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(table => {
			this.listData = table.items;
			console.log(this.listData);
			this.totalRecords = table.totalCount;
		})
	}

	loadPage(event: LazyLoadEvent) {
		this.cari((event.rows + event.first) / event.rows, event.rows, '');
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	reset() {
		this.form.get('tglAwal').setValue(new Date);
		this.form.get('tglAkhir').setValue(new Date);
		this.pencarian = '';
		this.ngOnInit();
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

	downloadExel(page: number, rows: number, pencarian: any) {
		page = page - 1;
		pencarian = this.pencarian;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value, 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value, 'yyyy-MM-dd HH:mm:ss')
		// tglAwal = tglAwal + " 00:00:00"
		// tglAkhir = tglAkhir + " 23:59:59"
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/PelayananKonsumen/Monitoring?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(table => {
			this.listData = table.items;
			this.codes = [];

			for (let i = 0; i < this.listData.length; i++) {
				this.codes.push({
					'Tanggal Pengaduan': this.datePipe.transform(this.listData[i].tglPengaduan, 'yyyy-MM-dd HH:mm'),
					'Nama Lengkap': this.listData[i].namaLengkap,
					'Email': this.listData[i].email,
					'No. Telp': this.listData[i].noTelepon,
					'Modul Aplikasi': this.listData[i].modulAplikasi.modulAplikasi,
					'Versi': this.listData[i].versi.namaVersion,
					'Edisi': this.listData[i].edisi.namaEdisi,
					'Unit Kerja Tujuan Pengaduan': this.listData[i].unitKerja.namaRuangan,
					'Pelayanan': this.listData[i].pelayananYgDipilih.namaProduk,
					'Respon Diinginkan': this.listData[i].respon.namaJenisRespon,
					'Tanggapan Respon': this.listData[i].tanggapan.namaTanggapan,
					'Deskripsi': this.listData[i].deskripsiPengaduan,
				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'Monitoring Customer Care');
		});
	}

	downloadPdf() {
		// let tglAwal = this.form.get('tglAwal').value.setHours(0,0,0)
		// let tglAkhir = this.form.get('tglAkhir').value.setHours(23,59,59)
		// tglAwal = tglAwal.toString().slice(0,tglAwal.toString().length - 3);
		// tglAkhir = tglAkhir.toString().slice(0,tglAkhir.toString().length - 3);
		let tglAwal = this.form.get('tglAwal').value
		let tglAkhir = this.form.get('tglAkhir').value
		tglAwal = tglAwal / 1000.0
		tglAkhir = tglAkhir / 1000.0
		let query = " AND HistoriPelayananCS_T.TglPelayananAwal between "+tglAwal+" and "+tglAkhir+" and NamaLengkap_P like '%"+this.pencarian+"%'"
		let data = {
			"download": true,
			"kdDepartemen": '',
			"kdProfile": this.kdprof,
			"namaFile": "daftar-monitoring-customer",
			"extFile": ".pdf",
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
		this.httpService.genericReport(Configuration.get().report + '/generic/report/daftar-monitoring-customer.pdf', data).subscribe(response => {

		});
	}
}