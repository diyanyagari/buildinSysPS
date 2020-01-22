import { Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-master-blog',
	templateUrl: './master-blog.component.html',
	styleUrls: ['./master-blog.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class BlogComponent implements OnInit {
	formAktif: boolean;
	form: FormGroup;
	formCari: FormGroup;
	listData: any = [];
	pencarian: string = '';
	page: number;
	totalRecords: number;
	rows: number;
	codes: any[];
	kdprof: any;
	kddept: any;
	kdruang: any;
	kduser: any;
	items: MenuItem[];

	dokumen1: any;
	dokumen2: any;
	dokumen3: any;
	namaFile: string;
	namaImage: string;
	isiDokumen: any;
	uploadData: any = "textEditor";
	jenisDokumen = "Blog";
	smbrFile: string;
	smbrImage: string;
	paramPencarian: boolean;
	noPosting;
	kdDokumen;

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
		this.smbrImage = "http://192.168.0.143:9797/image/show/profile1213123.png";
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
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		this.kdruang = this.authGuard.getUserDto().kdRuangan;
		this.kduser = this.authGuard.getUserDto().kdUser;
		this.dokumen1 = false;
		this.dokumen2 = true;
		this.dokumen3 = true;
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
			'judulBlog': new FormControl('', Validators.required),
			'statusAktif': new FormControl(null, Validators.required),
			'tglAwal': new FormControl(new Date()),
			'tglAkhir': new FormControl(new Date()),
			'tampilanLaporan': new FormControl('', Validators.required),
			'kodeExternal': new FormControl(''),
			'namaExternal': new FormControl(''),
			'isi': new FormControl(''),
			'file': new FormControl(''),
			'gambar': new FormControl(''),
			'kdUser': new FormControl(''),
			'kdRuanganLogin': new FormControl(''),
			'imageFile': new FormControl(''),
			'pathFile': new FormControl(''),
		});
		this.formCari = this.fb.group({
			'tglAwal': new FormControl(new Date()),
			'tglAkhir': new FormControl(new Date()),
		});
		this.form.get('statusAktif').setValue(true);
		this.form.get('tglAwal').value.setHours(0, 0, 0)
		// this.form.get('tglAkhir').value.setHours(23, 59, 59)
		this.formCari.get('tglAwal').value.setHours(0, 0, 0)
		// this.formCari.get('tglAkhir').value.setHours(23, 59, 59)
		this.getDataGrid(this.page, this.rows, this.pencarian)
	}
	getDataGrid(page: number, rows: number, pencarian: string) {
		page = page - 1;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value, 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value, 'yyyy-MM-dd HH:mm:ss')
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Blog/MonitoingBlog?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
			this.listData = res.items;
			for (let i = 0; i < this.listData.length; i++) {
				if (this.listData[i].image != null) {
					this.listData[i].image = Configuration.get().resourceFile + "/image/show/" + this.listData[i].image;
				}
			}
			this.totalRecords = res.totalCount;
		});
	}

	cari(page: number, rows: number, pencarian: string) {
		pencarian = this.pencarian;
		this.paramPencarian = true;
		page = page - 1;
		rows = this.rows;
		let tglAwal = this.datePipe.transform(this.formCari.get('tglAwal').value, 'yyyy-MM-dd HH:mm:ss')
		let tglAkhir = this.datePipe.transform(this.formCari.get('tglAkhir').value, 'yyyy-MM-dd HH:mm:ss')
		if (pencarian != '') {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Blog/MonitoingBlog?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&judulBlog=' + pencarian).subscribe(res => {
				this.listData = res.items;
				for (let i = 0; i < this.listData.length; i++) {
					if (this.listData[i].image != null) {
						this.listData[i].image = Configuration.get().resourceFile + "/image/show/" + this.listData[i].image;
					}
				}
				this.totalRecords = res.totalCount;
			});
		} else {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Blog/MonitoingBlog?tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
				this.listData = res.items;
				for (let i = 0; i < this.listData.length; i++) {
					if (this.listData[i].image != null) {
						this.listData[i].image = Configuration.get().resourceFile + "/image/show/" + this.listData[i].image;
					}
				}
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
		let imgFF = null;
		if(cloned.image != null){
			imgFF = cloned.image.split("show/")[1];
		}
		if(cloned.isiBlog != null){
			this.isiDokumen = cloned.isiBlog;
		}
		let fixHub = {
			"judulBlog": cloned.judulBlog,
			"statusAktif": cloned.statusAktif,
			"tglAwal": new Date(cloned.tglAwal),
			"tglAkhir": new Date(cloned.tglAkhir),
			"kodeExternal": cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"tampilanLaporan": cloned.tampilanLaporan,
			"isi": cloned.isiBlog,
			"file": cloned.file,
			"gambar": cloned.image,
			"kdRuanganLogin": this.kdruang,
			"imageFile": imgFF,
			"pathFile": cloned.file,
			'kdUser': this.kduser,
		}
		this.smbrImage = cloned.image;
		this.noPosting = cloned.noPosting;
		this.kdDokumen = cloned.kdDokumen;
		return fixHub;
	}

	reset() {
		this.isiDokumen = '';
		this.kdDokumen = null;
		this.noPosting = null;
		this.namaImage = '';
		this.smbrImage = Configuration.get().resourceFile + "/image/show/profile1213123.png";
		this.ngOnInit();
	}

	resetPencarian() {
		this.paramPencarian = false;
		this.pencarian = '';
		this.formCari = this.fb.group({
			'tglAwal': new FormControl(new Date()),
			'tglAkhir': new FormControl(new Date()),
		});
		this.formCari.get('tglAwal').value.setHours(0, 0, 0)
		this.formCari.get('tglAkhir').value.setHours(23, 59, 59)
		this.cari(this.page, this.rows, this.pencarian)
	}

	setReportDisplay() {
		this.form.get('tampilanLaporan').setValue(this.form.get('judulBlog').value)
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
		// console.log(this.listPemilikDokumenBaru);
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			// console.log(this.form);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpan();
		}
	}

	update() {
		let dataTemp = this.form.value;
		dataTemp.tglAwal = this.datePipe.transform(dataTemp.tglAwal, 'yyyy-MM-dd HH:mm:ss')
		dataTemp.tglAkhir = this.datePipe.transform(dataTemp.tglAkhir, 'yyyy-MM-dd HH:mm:ss')
		dataTemp.isi = this.isiDokumen;
		dataTemp.file = this.namaFile;
		dataTemp.gambar = this.namaImage;
		if (dataTemp.statusAktif == true) {
			dataTemp.statusAktif = "1"
		} else {
			dataTemp.statusAktif = "0"
		}
		let dataSimpan = {
			"judulBlog": dataTemp.judulBlog,
			"statusAktif": dataTemp.statusAktif,
			"tglAwal": dataTemp.tglAwal,
			"tglAkhir": dataTemp.tglAkhir,
			"tampilanLaporan": dataTemp.tampilanLaporan,
			"kodeExternal": dataTemp.kodeExternal,
			"namaExternal": dataTemp.namaExternal,
			"isi": dataTemp.isi,
			"file": dataTemp.file,
			"gambar": dataTemp.gambar,
			"kdUser": this.kduser,
			"kdRuanganLogin": this.kdruang
		}
		console.log(JSON.stringify(dataSimpan))
		this.httpService.update(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Blog?noPosting=' + this.noPosting + '&kdDokumen=' + this.kdDokumen, dataSimpan).subscribe(response => {
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
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Blogs');
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
		this.httpService.delete(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Blog?noPosting=' + this.noPosting + '&kdDokumen=' + this.kdDokumen).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			let dataTemp = this.form.value;
			dataTemp.tglAwal = this.datePipe.transform(dataTemp.tglAwal, 'yyyy-MM-dd HH:mm:ss')
			dataTemp.tglAkhir = this.datePipe.transform(dataTemp.tglAkhir, 'yyyy-MM-dd HH:mm:ss')
			dataTemp.isi = this.isiDokumen;
			dataTemp.file = this.namaFile;
			dataTemp.gambar = this.namaImage;
			if (dataTemp.statusAktif == true) {
				dataTemp.statusAktif = "1"
			} else {
				dataTemp.statusAktif = "0"
			}
			let dataSimpan = {
				"judulBlog": dataTemp.judulBlog,
				"statusAktif": dataTemp.statusAktif,
				"tglAwal": dataTemp.tglAwal,
				"tglAkhir": dataTemp.tglAkhir,
				"tampilanLaporan": dataTemp.tampilanLaporan,
				"kodeExternal": dataTemp.kodeExternal,
				"namaExternal": dataTemp.namaExternal,
				"isi": dataTemp.isi,
				"file": dataTemp.file,
				"gambar": dataTemp.gambar,
				"kdUser": this.kduser,
				"kdRuanganLogin": this.kdruang
			}
			console.log(JSON.stringify(dataSimpan))
			this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Blog', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				// this.get(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}

	}



	downloadExcel(page: number, rows: number, pencarian: any) {
		page = page - 1;
		pencarian = this.pencarian;
		let tglAwal = this.datePipe.transform(this.form.get('tglAwal').value, 'yyyy-MM-dd')
		let tglAkhir = this.datePipe.transform(this.form.get('tglAkhir').value, 'yyyy-MM-dd')
		tglAwal = tglAwal.slice(0, 4)
		tglAkhir = tglAkhir.slice(0, 4)
		tglAwal = tglAwal + "-01-01" + " 00%3A00%3A00"
		tglAkhir = tglAkhir + "-12-31" + " 23%3A59%3A59"
		if (pencarian == "") {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/MonitoringUser?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(table => {
				let x = table.items;
				this.codes = [];

				for (let i = 0; i < x.length; i++) {
					this.codes.push({
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
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Authentication/MonitoringUser?tglAwal=%20' + tglAwal + '&tglAkhir=' + tglAkhir + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(table => {
				let x = table.items;
				this.codes = [];

				for (let i = 0; i < x.length; i++) {
					this.codes.push({
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
		let thnawal = this.datePipe.transform(this.form.get('tglAwal').value, 'yyyy-MM-dd')
		let thnAkhir = this.datePipe.transform(this.form.get('tglAkhir').value, 'yyyy-MM-dd')
		thnawal = thnawal.slice(0, 4)
		thnAkhir = thnAkhir.slice(0, 4)
		let awal = new Date('January 1, ' + thnawal + ' 00:00:00');
		let akhir = new Date('December 31, ' + thnAkhir + ' 23:59:59');
		let x = awal.getTime() / 1000.0
		let y = akhir.getTime() / 1000.0
		let query;
		let page = this.page - 1;
		query = " and LoginUser_S.TglDaftar between " + x + " and " + y + " and (Kontak_M.NamaLengkap like '%" + this.pencarian + "%' or LoginUser_S.NamaUserEmail like '%" + this.pencarian + "%') order by LoginUser_S.TglDaftar desc OFFSET " + page + " ROWS FETCH NEXT " + this.rows + " ROWS ONLY"

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
	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload?noProfile=False';
	}
	fileUpload(event) {
		this.namaFile = event.xhr.response;
		// this.form.controls["pathFile"].setValue(this.namaFile);
		this.smbrFile = Configuration.get().resourceFile + '/file/download/' + this.namaFile;
	}
	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}
	imageUpload(event) {
		this.namaImage = event.xhr.response;
		this.smbrImage = Configuration.get().resourceFile + '/image/show/' + this.namaImage;
	}
	getPilihIsi(value) {
		let dataValue = value;
		// console.log(dataValue);
		if (dataValue == 'textEditor') {
			this.dokumen1 = false;
			this.dokumen2 = true;
			this.dokumen3 = true;
			this.namaImage = null;
			this.namaFile = null;
		} else if (dataValue == 'file') {
			this.dokumen1 = true;
			this.dokumen2 = false;
			this.dokumen3 = true;
			this.isiDokumen = '';
			this.namaImage = null;
		} else if (dataValue == 'gambar') {
			this.dokumen1 = true;
			this.dokumen2 = true;
			this.dokumen3 = false;
			this.isiDokumen = '';
			this.namaFile = null;
		}
	}
}

