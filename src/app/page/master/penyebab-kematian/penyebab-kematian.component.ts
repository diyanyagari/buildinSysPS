import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-penyebab-kematian',
	templateUrl: './penyebab-kematian.component.html',
	styleUrls: ['./penyebab-kematian.component.scss'],
	providers: [ConfirmationService]
})
export class PenyebabKematianComponent implements OnInit {

	selected: any;
	listData: any[];
	dataDummy: {};
	formAktif: boolean;
	pencarian: string;
	versi: any;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;

	codes:any[];

	kdprof: any;
	kddept: any;
	laporan: boolean = false;
	smbrFile:any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {

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
				this.downloadExcel();
			}
		},

		];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.formAktif = true;
		this.get(this.page, this.rows, '');
		this.versi = null;

		this.form = this.fb.group({
			'kode': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'namaPenyebabKematian': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'statusEnabled': new FormControl('', Validators.required),
		});

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

	downloadExcel() {

	}	

	downloadPdf(){
		
	}

	cetak() {

	}

	tutupLaporan() {
		this.laporan = false;
	}


	get(page: number, rows: number, search: any) { 
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/penyebabKematian/findAll?page=' + page + '&rows=' + rows + '&dir=namaPenyebabKematian&sort=desc').subscribe(table => {
			this.listData = table.data.PenyebabKematian;
			this.totalRecords = table.totalRow;

		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataHr1Mod1 + '/penyebabKematian/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaPenyebabKematian&sort=desc&namaPenyebabKematian=' + this.pencarian).subscribe(table => {
			this.listData = table.data.PenyebabKematian;
		});
	}	

	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Penyebab Kematian');
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
		let formSubmit = this.form.value
		formSubmit.kdDepartemen = this.kddept
		this.httpService.update(Configuration.get().dataHr1Mod1 + '/penyebabKematian/update/' + this.versi, formSubmit).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			let formSubmit = this.form.value
			formSubmit.kdDepartemen = this.kddept
			this.httpService.post(Configuration.get().dataHr1Mod1 + '/penyebabKematian/save', formSubmit).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.get(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}
	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);
		console.log(this.form.value);
	}

	clone(hub: any) {
		let fixHub = {
			"kode": hub.kode.kode,
			"kodeExternal": hub.kodeExternal,
			"namaPenyebabKematian": hub.namaPenyebabKematian,
			"namaExternal": hub.namaExternal,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled
		}
		this.versi = hub.version;
		return fixHub;
	}

	hapus() { 
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataHr1Mod1 + '/penyebabKematian/del/' + deleteItem.kode.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.get(this.page, this.rows, this.pencarian);
		});
		this.reset();
	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}

	onDestroy() {

	}
}

