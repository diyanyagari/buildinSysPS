import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
// import {TreeModule} from 'primeng/tree';

@Component({
	selector: 'app-transmisi',
	templateUrl: './transmisi.component.html',
	styleUrls: ['./transmisi.component.scss'],
	providers: [ConfirmationService]
})
export class TransmisiComponent implements OnInit {
	Fakultas: any;
	formAktif: boolean;
	form: FormGroup;
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	NamaTransmisi: any;
	reportDisplay: any;
	kode: any;
	listData: any[];
	pencarian: any;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	listTransmisi: any[];
	items:any;
	kdprof:any;
	laporan: boolean = false;
	smbrFile:any;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService,
		private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }

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
		this.form = this.fb.group({
			'kode': new FormControl(null),
			'kdTransmisiHead': new FormControl(null),
			'namaTransmisi': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl(null, Validators.required),
		});
		this.getTransmisiHead();
		this.getDataGrid(this.page, this.rows);
		this.getSmbrFile();
	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	getDataGrid(page: number, rows: number) {
		this.httpService.get(Configuration.get().dataMasterNew + '/transmisi/findAll?page=' + page + '&rows=' + rows + '&dir=namaTransmisi&sort=desc').subscribe(table => {
			this.listData = table.Transmisi;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/transmisi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTransmisi&sort=desc&namaTransmisi=' + this.pencarian).subscribe(table => {
			this.listData = table.Transmisi;
			this.totalRecords = table.totalRow;
		});
	}

	setTimeStamp(date) {
		let dataTimeStamp = (new Date(date).getTime() / 1000);
		return dataTimeStamp;
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
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	clone(cloned: any) {
		let fixHub = {
			"kode": cloned.kode,
			"namaTransmisi": cloned.namaTransmisi,
			"reportDisplay": cloned.reportDisplay,
			"kodeExternal": cloned.kodeExternal,
			"namaExternal": cloned.namaExternal,
			"kdTransmisiHead": cloned.kdTransmisiHead,
			"statusEnabled": cloned.statusEnabled
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.formAktif = false;
		this.form.setValue(cloned);
	}

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpan();
		}
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/transmisi/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.ngOnInit();
			});
		}
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

	update() {
		this.httpService.update(Configuration.get().dataMasterNew + '/transmisi/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.ngOnInit();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/transmisi/del/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.ngOnInit();
		});
	}


	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Transmisi');
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

	getTransmisiHead() {
		this.httpService.get(Configuration.get().dataMasterNew + '/transmisi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTransmisi&sort=desc').subscribe(res => {
			this.listTransmisi = [];
			this.listTransmisi.push({ label: '--Pilih Data Parent Transmisi--', value: '' })
			for (var i = 0; i < res.Transmisi.length; i++) {
				this.listTransmisi.push({ label: res.Transmisi[i].namaTransmisi, value: res.Transmisi[i].kode })
			};
		},
			error => {
				this.listTransmisi = [];
				this.listTransmisi.push({ label: '-- ' + error + ' --', value: '' })
			});
	}


	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaTransmisi').value)
	}

	downloadExcel() {
		// let cetak = Configuration.get().report + '/hargaNettoProdukByKelas/laporanHargaNettoProdukByKelas.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=true';
		// window.open(cetak);
   	}

   	downloadPdf() {
   		let cetak = Configuration.get().report + '/transmisi/laporanTransmisi.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
   		window.open(cetak);
   	}

   	cetak(){
   		this.laporan = true;
   		this.print.showEmbedPDFReport(Configuration.get().report + '/transmisi/laporanTransmisi.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmTransmisi_laporanCetak');

   	}





















}

