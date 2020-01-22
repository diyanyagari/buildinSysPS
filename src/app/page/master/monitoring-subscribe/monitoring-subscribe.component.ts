import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-monitoring-subscribe',
	templateUrl: './monitoring-subscribe.component.html',
	styleUrls: ['./monitoring-subscribe.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class MonitoringSubscribeComponent implements OnInit {
	Misi: any;
	formAktif: boolean;
	form: FormGroup;

	kdMisiHead: any = [];
	noUrut: any;
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaMisi: any;
	reportDisplay: any;
	kdVisi: any = [];

	kode: any;

	kdProfile: any;
	kdMisi: any;
	kdDepartemen: any;

	listData: any = [];

	pencarian: string = '';
	dataSimpan: any;

	page: number;
	totalRecords: number;
	rows: number;
	versi: number;

	items: any;
	listData2: any[];
	codes: any[];
	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	smbrFile: any;
	tanggalAkhir;
	tanggalAwal;

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
					// this.downloadExcel();
					this.downloadExel(this.page, this.rows, this.pencarian);
				}
			},

		];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.form = this.fb.group({
			'tglAwal': new FormControl(new Date()),
			'tglAkhir': new FormControl(new Date())
		});
		this.form.get('tglAwal').value.setHours(0,0,0)
		// this.form.get('tglAkhir').value.setHours(23,59,59)
		this.getDataGrid(this.page, this.rows, this.pencarian)
	}

	getDataGrid(page: number, rows: number, cari: string) {
		page = page - 1;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value.setSeconds(0), 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value.setSeconds(59), 'yyyy-MM-dd HH:mm:ss')
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/MonitoringSubscribe?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + this.pencarian).subscribe(table => {
			this.listData = table.items;
			this.totalRecords = table.totalCount;
		});
	}

	cari() {
		this.getDataGrid(this.page, this.rows, this.pencarian)
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

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	onRowSelect(event) {
	}

	reset() {
		this.form.get('tglAwal').setValue(new Date);
		this.form.get('tglAkhir').setValue(new Date);
		this.pencarian = '';
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaMisi').value)
	}

	downloadExel(page: number, rows: number, pencarian: any) {
		page = page - 1;
		pencarian = this.pencarian;
		// let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value, 'yyyy-MM-dd')
		// let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value, 'yyyy-MM-dd')
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value.setSeconds(0), 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value.setSeconds(59), 'yyyy-MM-dd HH:mm:ss')
		// tglAwal = tglAwal + " 00:00:00"
		// tglAkhir = tglAkhir + " 23:59:59"
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Registrasi/MonitoringSubscribe?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(table => {
			this.listData = table.items;
			this.codes = [];

			for (let i = 0; i < this.listData.length; i++) {
				this.codes.push({
					'Tanggal Subscribe': this.datePipe.transform(this.listData[i].tglSubscribe, 'yyyy-MM-dd HH:mm'),
					'Email': this.listData[i].email,
				})

			}
			this.fileService.exportAsExcelFile(this.codes, 'Monitoring Customer Care');
		});
	}

	downloadPdf() {
		// let tglAwal = this.form.get('tglAwal').value
		// // let tglAkhir = this.form.get('tglAkhir').value/1000 + 86399
		// let tglAkhir = this.form.get('tglAkhir').value
		// tglAwal.setHours(0,0,0,0);
		// tglAkhir.setHours(23,59,59,59);
		let tglAwal = this.form.get('tglAwal').value.setSeconds(0)
		let tglAkhir = this.form.get('tglAkhir').value.setSeconds(59)
		tglAwal = tglAwal/1000;
		tglAkhir = tglAkhir/1000;
		let query = " AND Alamat_M.TglDaftar between "+tglAwal+ " and " + tglAkhir + " order by Alamat_M.TglDaftar asc"
		let data = {
			"download": true,
			"extFile": ".pdf",
			"kdDepartemen": "",
			"kdProfile": this.kdprof,
			"outDepartemen": true,
			"outProfile": true,
			"namaFile": "daftar-monitoring-subscriber2",
			"paramImgKey": [
			  
			],
			"paramImgValue": [
			  
			],
			"paramKey": [
			  "query"
			],
			"paramValue": [
			  query
			]
		  }		  
		this.httpService.genericReport(Configuration.get().report + '/generic/report/daftar-monitoring-subscriber2.pdf', data).subscribe(response => {

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
	tutupLaporan() {
		this.laporan = false;
	}


}

