import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { KelompokUser } from './kelompok-user.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-kelompok-user',
	templateUrl: './kelompok-user.component.html',
	styleUrls: ['./kelompok-user.component.scss'],
	providers: [ConfirmationService]
})
export class KelompokUserComponent implements OnInit {
	item: KelompokUser = new InisialKelompokUser();;
	selected: KelompokUser;
	listData: any[];
	formAktif: boolean;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	pencarian: string;
	versi: any;
	listKelompok: any;
	kdprof: any;
	laporan: boolean = false;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService ) { }


	ngOnInit() {
		this.kdprof = this.authGuard.getUserDto().kdProfile;
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
		this.form = this.fb.group({
			'kode': new FormControl(''),
			'kdKelompokUserHead': new FormControl(''),
			'namaKelompokUser': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			// 'namaExternal': new FormControl(''),
			// 'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
		});
	}

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}


	downloadExcel() {

	}

	downloadPdf() {
		let cetak = Configuration.get().report + '/kelompokUser/laporanKelompokUser.pdf?kdProfile='+this.kdprof+'&download=true';
    	window.open(cetak);
	}

	cetak(){
		this.laporan = true;
    	this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokUser/laporanKelompokUser.pdf?kdProfile='+this.kdprof+'&download=false', 'frmKelompokUser_laporanCetak');
	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/kelompokuser/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listData = table.KelompokUser;
			this.totalRecords = table.totalRow;
		});

		this.httpService.get(Configuration.get().dataMaster + '/kelompokuser/findKelUser').subscribe(res => {
			this.listKelompok = [];
			this.listKelompok.push({ label: '--Pilih Data Parent Kelompok User--', value: '' })
			for (var i = 0; i < res.KelompokUser.length; i++) {
				this.listKelompok.push({ label: res.KelompokUser[i].namaKelompokUser, value: res.KelompokUser[i].kode.kode })
			};
		},
			error => {
				this.listKelompok = [];
				this.listKelompok.push({ label: '-- ' + error + ' --', value: '' })
			});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kelompokuser/findAll?page=1&rows=1000&dir=namaKelompokUser&sort=desc&namaKelompokUser=' + this.pencarian).subscribe(table => {
			this.listData = table.KelompokUser;
			this.totalRecords = table.totalRow;
		});
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok User');
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

	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
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
		this.httpService.update(Configuration.get().dataMasterNew + '/kelompokuser/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();

		});
	}
	simpan() {

		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/kelompokuser/save?', this.form.value).subscribe(response => {
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

	}

	clone(cloned: KelompokUser): KelompokUser {
		let hub = new InisialKelompokUser();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialKelompokUser();
		fixHub = {
			"kode": hub.kode.kode,
			"kdKelompokUserHead": hub.kdKelompokUserHead,
			// "kodeExternal": hub.kodeExternal,
			// "namaExternal": hub.namaExternal,
			"namaKelompokUser": hub.namaKelompokUser,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,
			"version": hub.version
		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/kelompokuser/del/' + deleteItem.kode.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});

	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}
}

class InisialKelompokUser implements KelompokUser {

	constructor(
		public id?,
		public kdProfile?,
		public kode?,
		public namaKelompokUser?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?,
		public kdKelompokUserHead?,
	) { }

}