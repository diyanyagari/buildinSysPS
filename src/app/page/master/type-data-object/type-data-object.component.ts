import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { TypeDataObject } from './type-data-object.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService  } from '../../../global';
@Component({
	selector: 'app-type-data-object',
	templateUrl: './type-data-object.component.html',
	styleUrls: ['./type-data-object.component.scss'],
	providers: [ConfirmationService]
})
export class TypeDataObjectComponent implements OnInit {

	selected: any[];
	listData: any[];
	versi: any;
	form: FormGroup;
	formAktif: boolean;
	page: number;
	rows: number;
	totalRecords: number;
	pencarian: string;
	report: any;
	toReport: any;
	listType: any[];
	kode: any;
	codes:any;
	laporan: boolean = false;
	kdprof: any;
	kddept: any;
	items: any;
	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) { }


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
		this.form = this.fb.group({
			'namaTypeDataObjek': new FormControl('', Validators.required),
			'kdTypeDataObjekHead': new FormControl(null),
			'kode': new FormControl(''),
			'rangeNilaiAwal': new FormControl(''),
			'lengthPrecision': new FormControl(''),
			'rangeNilaiAkhir': new FormControl(''),
			'storageBytesSize': new FormControl(''),
			'databaseVersion': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
			'reportDisplay': new FormControl('', Validators.required),


		});

	}

	valuechange(newValue) {
		this.toReport = newValue;
		this.report = newValue;
	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
			this.listData = table.TypeDataObjek;
			this.totalRecords = table.totalRow;

		});
		this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAllCombo').subscribe(res => {
			this.listType = [];
			this.listType.push({ label: '--Pilih Data Parent Tipe Data Objek--', value: null })
			for (var i = 0; i < res.data.length; i++) {
				this.listType.push({ label: res.data[i].namaTypeDataObjek, value: res.data[i].kode })
			};
		});
	}
	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/type-data-objek/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaTypeDataObjek&sort=desc&namaTypeDataObjek=' + this.pencarian).subscribe(table => {
			this.listData = table.TypeDataObject;
		});
	}
	loadPage(event: LazyLoadEvent) {
		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	confirmDelete() {
		let kode = this.kode;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Tipe Data Objek');
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
		this.httpService.update(Configuration.get().dataMasterNew + '/type-data-objek/update/' + this.versi, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}
	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/type-data-objek/save?', this.form.value).subscribe(response => {
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
		// let cloned = this.clone(event.data);
		// 'namaTypeDataObjek': new FormControl('', Validators.required),
		// 'KdTypeDataObjekHead': new FormControl(''),
		// 'kode': new FormControl(''),
		// 'rangeNilaiAwal': new FormControl(''),
		// 'lengthPrecision': new FormControl(''),
		// 'rangeNilaiAkhir': new FormControl(''),
		// 'storageBytesSize': new FormControl(''),
		// 'databaseVersion': new FormControl(''),
		// 'statusEnabled': new FormControl('', Validators.required),
		// 'reportDisplay': new FormControl('', Validators.required),
		console.log(event.data)
		this.kode = event.data.kode;
		if (event.data.KdTypeDataObjekHead == null) {
			this.form.get('namaTypeDataObjek').setValue(event.data.namaTypeDataObjek);
			this.form.get('rangeNilaiAwal').setValue(event.data.rangeNilaiAwal);
			this.form.get('rangeNilaiAkhir').setValue(event.data.rangeNilaiAkhir);
			this.form.get('lengthPrecision').setValue(event.data.lengthPrecision);
			this.form.get('storageBytesSize').setValue(event.data.storageBytesSize);
			this.form.get('databaseVersion').setValue(event.data.databaseVersion);
			this.form.get('statusEnabled').setValue(event.data.statusEnabled);
			this.form.get('reportDisplay').setValue(event.data.reportDisplay);
			this.form.get('kode').setValue(event.data.kode);
		} else {
			this.form.get('namaTypeDataObjek').setValue(event.data.namaTypeDataObjek);
			this.form.get('kdTypeDataObjekHead').setValue(event.data.kdTypeDataObjekHead);
			this.form.get('rangeNilaiAwal').setValue(event.data.rangeNilaiAwal);
			this.form.get('rangeNilaiAkhir').setValue(event.data.rangeNilaiAkhir);
			this.form.get('lengthPrecision').setValue(event.data.lengthPrecision);
			this.form.get('storageBytesSize').setValue(event.data.storageBytesSize);
			this.form.get('databaseVersion').setValue(event.data.databaseVersion);
			this.form.get('statusEnabled').setValue(event.data.statusEnabled);
			this.form.get('reportDisplay').setValue(event.data.reportDisplay);
			this.form.get('kode').setValue(event.data.kode);
		}
		this.versi = event.data.version;
		this.formAktif = false;
		// this.form.setValue(cloned);
	}
	clone(cloned: TypeDataObject): TypeDataObject {
		let hub = new InisialTypeDataObject();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialTypeDataObject();
		fixHub = {

			"kode": hub.kode,
			"namaTypeDataObjek": hub.namaTypeDataObjek,
			"KdTypeDataObjekHead": hub.KdTypeDataObjekHead,
			"rangeNilaiAwal": hub.rangeNilaiAwal,
			"lengthPrecision": hub.lengthPrecision,
			"rangeNilaiAkhir": hub.rangeNilaiAkhir,
			"storageBytesSize": hub.storageBytesSize,
			"databaseVersion": hub.databaseVersion,
			"reportDisplay": hub.reportDisplay,
			"statusEnabled": hub.statusEnabled,


		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/type-data-objek/del/' + deleteItem.kode).subscribe(response => {
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
	downloadPdf(){
		let cetak = Configuration.get().report + '/typeDataObjek/laporanTypeDataObjek.pdf?download=true';
        window.open(cetak);
	}
	downloadExcel(){

	}
	cetak(){
		this.laporan = true;
        this.print.showEmbedPDFReport(Configuration.get().report + '/typeDataObjek/laporanTypeDataObjek.pdf?download=false', 'frmTypeDataObjek_laporanCetak');
	}
	tutupLaporan() {
        this.laporan = false;
    }
}

class InisialTypeDataObject implements TypeDataObject {

	constructor(
		public id?,
		public KdTypeDataObjekHead?,
		public kode?,
		public namaTypeDataObjek?,
		public rangeNilaiAwal?,
		public rangeNilaiAkhir?,
		public lengthPrecision?,
		public storageBytesSize?,
		public databaseVersion?,
		public reportDisplay?,
		public kodeExternal?,
		public namaExternal?,
		public statusEnabled?,
		public version?
	) { }

}
