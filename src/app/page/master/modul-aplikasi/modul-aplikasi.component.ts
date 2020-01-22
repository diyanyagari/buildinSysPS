import { ViewChild, Inject, forwardRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
@Component({
	selector: 'app-modul-aplikasi',
	templateUrl: './modul-aplikasi.component.html',
	styleUrls: ['./modul-aplikasi.component.scss'],
	providers: [ConfirmationService]
})
export class ModulAplikasiComponent implements OnInit {
	@ViewChild(DataTable) dataTableComponent: DataTable;
	dataDummy: {};
	form: FormGroup;
	formAktif: boolean;
	items: any[];
	kddept: any;
	kdprof: any;
	laporan: boolean = false;
	listData: any[];
	listModulAplikasiHead: any[];
	page: number;
	pencarian: string;
	report: any;
	rows: number;
	selected: any[];
	totalRecords: number;
	versi: any;
	resFile: string;
	smbrFile: any;
	smbrIcon: string;
	namaIcon: string;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) { }

	ngAfterViewInit() {
		var x = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left") as HTMLCollectionOf<HTMLElement>;
		var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.height = '3.8vh';
		}
		for (var i = 0; i < browseStyle.length; i++) {
			browseStyle[i].style.marginTop = '-0.5vh';
		}
	}

	ngOnInit() {
		this.pencarian = "";
		this.namaIcon = "";
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
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;		
		this.formAktif = true;
		this.form = this.fb.group({
			'kdModulAplikasiHead': new FormControl(null),
			'kode': new FormControl(null,Validators.required),
			'modulIconImage': new FormControl(null),
			'modulNoUrut': new FormControl(null),
			'namaModulAplikasi': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true)
		});
		this.form.get('kode').enable();
		this.getData();
		this.getDataGrid(this.page, this.rows, '');
		this.getSmbrFile();
	}
	getSmbrFile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
		});
	}

	getData() {
		// this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAll?page='+page+'&rows='+rows).subscribe(table => {
		// 	this.listData = table.ModulAplikasi;
		// 	this.totalRecords = table.totalRow;
		// });

		//listModulAplikasiHead
		this.httpService.get(Configuration.get().dataMaster + '/modulaplikasi/findHead/').subscribe(res => {
			this.listModulAplikasiHead = [];
			this.listModulAplikasiHead.push({ label: '--Pilih Parent Modul Aplikasi--', value: null })
			for (var i = 0; i < res.ModulAplikasi.length; i++) {
				this.listModulAplikasiHead.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		});
	}

	getDataGrid(page: number, rows: number, cari: string) {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAll?page=' + page + '&rows=' + rows + '&dir=namaModulAplikasi&sort=desc&namaModulAplikasi=' + cari).subscribe(table => {
			this.listData = table.ModulAplikasi;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
			this.listData = table.ModulAplikasi;
			this.totalRecords = table.totalRow;
		});
	}
	confirmDelete() {
		let kode = this.form.get('kode').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Modul Aplikasi');
        } else {
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

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.form.get('kode').enable();
			this.httpService.post(Configuration.get().dataMasterNew + '/modulaplikasi/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.form.get('kode').disable();
				this.getDataGrid(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}
	}

	onSubmit() {
		console.log(this.form.value);
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
		this.form.get('kode').enable();
		this.httpService.update(Configuration.get().dataMasterNew + '/modulaplikasi/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.form.get('kode').disable();
			this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	reset() {
		this.formAktif = true;
		this.form.get('kode').enable();
		this.smbrIcon = null;
		this.dataTableComponent.reset();
		this.ngOnInit();
		this.ngAfterSaveInit();
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.get('kode').disable();
		this.form.setValue(cloned);
	}

	clone(cloned: any) {
		let fixHub = {
			"kdModulAplikasiHead": cloned.kdModulAplikasiHead,
			"kode": cloned.kode,
			"modulIconImage": cloned.modulIconImage,
			"modulNoUrut": cloned.modulNoUrut,
			"namaModulAplikasi": cloned.namaModulAplikasi,
			"reportDisplay": cloned.reportDisplay,
			"statusEnabled": cloned.statusEnabled,
		}
		this.smbrIcon = Configuration.get().resourceFile + '/image/show/' + cloned.modulIconImage;
		this.namaIcon = cloned.modulIconImage;
		this.versi = cloned.version;
		return fixHub;
	}

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/modulaplikasi/del/' + deleteItem.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaModulAplikasi').value)
	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	onDestroy() {

	}

	downloadExcel() {

	}

	downloadPdf() {
		let b = Configuration.get().report + '/modulAplikasi/laporanModulAplikasi.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=true';
		window.open(b);
	}

	cetak() {
		this.laporan = true;
		this.print.showEmbedPDFReport(Configuration.get().report + '/modulAplikasi/laporanModulAplikasi.pdf?kdProfile=' + this.kdprof + '&gambarLogo=' + this.smbrFile + '&download=false', 'frmModulAplikasi_laporanCetak');
	}

	tutupLaporan() {
		this.laporan = false;
	}

	urlUpload() {
		return Configuration.get().resourceFile + '/file/upload?noProfile=false';
	}

	iconUpload(event) {
		this.resFile = event.xhr.response;
		this.namaIcon = this.resFile.toString();
    	this.form.controls["modulIconImage"].setValue(this.namaIcon);
		this.smbrIcon = Configuration.get().resourceFile + '/image/show/' + this.namaIcon;
	}

	addHeader(event) {
		this.httpService.beforeUploadFile(event);
	}

	setModulNoUrut(val){
		var str = val.toString()
  		var n = str.length;
  		if(n > 3){
  			var res = str.slice(0, 3);
  			this.form.get('modulNoUrut').setValue(parseInt(res));
  		}
	}

	clearFilter(da:any){
		da.filterValue = '';
	}

	ngAfterSaveInit() {
		var x = document.getElementsByClassName("ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left") as HTMLCollectionOf<HTMLElement>;
		var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.height = '3.8vh';
			x[i].style.backgroundColor = '#3c67b1';
		}
		for (var i = 0; i < browseStyle.length; i++) {
			browseStyle[i].style.marginTop = '-0.5vh';
		}
	}
}

