import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-master-akun-bank',
	templateUrl: './master-akun-bank.component.html',
	styleUrls: ['./master-akun-bank.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class MasterAkunBank implements OnInit {
	formAktif: boolean;
	form: FormGroup;
	listData: any = [];
	pencarian: string = '';
	page: number;
	totalRecords: number;
	rows: number;
	codes: any[];
	items: MenuItem[];
	paramPencarian: boolean;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private fileService: FileService,
		private authGuard: AuthGuard,
		private datePipe: DatePipe,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {
		// this.smbrImage = Configuration.get().resourceFile + "/image/show/profile1213123.png";
	}

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
		this.paramPencarian = false;
		this.pencarian = '';
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
		this.listData = [];
		this.formAktif = true;

		this.form = this.fb.group({
			'kdBank': new FormControl(''),
			'namaBank': new FormControl('', Validators.required),
			'cabang': new FormControl(''),
			'noAkunBank': new FormControl('', Validators.required),
			'namaAkunBank': new FormControl('', Validators.required),
			'noUrutPrimary': new FormControl(0, Validators.required),
			'akunBankUser': new FormControl(false),
			'aktif': new FormControl(false),
		});
		this.getDataGrid(this.page, this.rows, this.pencarian)
	}
	getDataGrid(page: number, rows: number, pencarian: string) {
		page = page - 1;
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount?PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
			this.listData = res.items;
			this.totalRecords = res.totalCount;
		});
	}

	cari(page: number, rows: number, pencarian: string) {
		pencarian = this.pencarian;
		this.paramPencarian = true;
		page = page - 1;
		rows = this.rows;
		if (pencarian != '') {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount?namaBank=' + pencarian + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
				this.listData = res.items;
				this.totalRecords = res.totalCount;
			});
		} else {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount?PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
				this.listData = res.items;
				this.totalRecords = res.totalCount;
			});
		}

	}

	loadPage(event: LazyLoadEvent) {
		if (this.paramPencarian) {
			this.cari((event.rows + event.first) / event.rows, event.rows, this.pencarian);
			this.page = (event.rows + event.first) / event.rows;
			this.rows = event.rows;
		} else {
			this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
			this.page = (event.rows + event.first) / event.rows;
			this.rows = event.rows;
		}
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);
	}

	clone(cloned: any) {
		let fixHub = {
			'kdBank': cloned.kdBank,
			'namaBank': cloned.namaBank,
			'cabang': cloned.cabang,
			'noAkunBank': cloned.noAkunBank,
			'namaAkunBank': cloned.namaAkunBank,
			'noUrutPrimary': cloned.noUrutPrimary,
			'akunBankUser': cloned.akunBankUser,
			'aktif': cloned.aktif,
		}
		return fixHub;
	}

	reset() {
		this.page = 1;
		this.ngOnInit();
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

	update() {
		this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Diperbaruhi');
			this.reset();
		});
	}

	confirmUpdate() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.update();
			}
		});
	}

	confirmDelete() {
		if (this.formAktif) {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Akun Bank');
		} else {
			this.confirmationService.confirm({
				message: 'Apakah data akan di hapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapus();
				}
			});
		}
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount?kdBank=' + this.form.get('kdBank').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.reset();
			});
		}

	}



	downloadExcel(page: number, rows: number, pencarian: any) {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount?PageIndex=0&PageSize=100').subscribe(table => {
			let dataPrint = [];
			for (let i = 0; i < table.items.length; i++) {
				let temp = {
					"namaBank": table.items[i].namaBank,
					"cabang": table.items[i].cabang,
					"noAkunBank": table.items[i].noAkunBank,
					"namaAkunBank": table.items[i].namaAkunBank,
					"noUrutPrimary": table.items[i].noUrutPrimary,
					"akunBankUser": table.items[i].akunBankUser,
					"aktif": table.items[i].aktif
				}
				dataPrint.push(temp);
			}
			this.fileService.exportAsExcelFile(dataPrint, 'Akun Bank');
		});
	}

	downloadPdf() {
		var col = ["Nama Bank", "Cabang Bank", "Nomor Akun Bank", "Nama Akun", "Nomor Urut Primary", "Akun Bank User", "Aktif"];
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/BankAccount?PageIndex=0&PageSize=100').subscribe(table => {
			let dataPrint = [];
			for (let i = 0; i < table.items.length; i++) {
				let cbg;
				if (table.items[i].cabang == null) {
					cbg = '';
				} else {
					cbg = table.items[i].cabang;
				}
				let temp = {
					"namaBank": table.items[i].namaBank,
					"cabang": cbg,
					"noAkunBank": table.items[i].noAkunBank,
					"namaAkunBank": table.items[i].namaAkunBank,
					"noUrutPrimary": table.items[i].noUrutPrimary,
					"akunBankUser": table.items[i].akunBankUser,
					"aktif": table.items[i].aktif
				}
				dataPrint.push(temp);
			}
			this.fileService.exportAsPdfFile("Master Akun Bank", col, dataPrint, "Akun Bank");
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
	}

	numberType(data) {
		let val = data.target.value
		if (val.length > 16) {
			this.form.get('noAkunBank').setValue(val.slice(0, 16))
		}
		if (val[0].search('-') != -1) {
			this.form.get('noAkunBank').setValue('')
		}
	}
}

