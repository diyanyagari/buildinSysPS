import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-master-type',
	templateUrl: './master-type.component.html',
	styleUrls: ['./master-type.component.scss'],
	providers: [ConfirmationService]
})
export class MasterTypeComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	listNegara: any = [];
	listKelompokproduk: any = [];
	listGenKelompokProduk: any = [];
	listMerkProduk: any = [];
	listTypeHead: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	namaProgram: any;
	reportDisplay: any;
	kode: any;
	listData: any = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		private confirmationService: ConfirmationService) { }


	ngOnInit() {
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}

		this.items = [
			{
				label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
					// this.downloadPdf();
				}
			},
			{
				label: 'Exel', icon: 'fa-file-excel-o', command: () => {
					// this.downloadExel();
				}
			}];

		this.formAktif = true;
		this.form = this.fb.group({
			'kdNegara': new FormControl(null, Validators.required),
			'kdTypeHead': new FormControl(null),
			'namaType': new FormControl(null, Validators.required),
			'kdKelompokProduk': new FormControl(null),
			'kdGKelompokProduk': new FormControl(null),
			'kdMerkProduk': new FormControl(null),
			'reportDisplay': new FormControl('', Validators.required),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(null),
			'statusEnabled': new FormControl('', Validators.required),
			'kode': new FormControl(null),
			'kdProfile': this.authGuard.getUserDto().kdProfile
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getNegara();
		this.getKelompokProduk();
		this.getGenKelompokProduk();
		this.getMerkProduk();
		this.getTypeHead();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/type/findAll?page=' + page + '&rows=' + rows + '&dir=namaType&sort=desc&namaType' + cari).subscribe(table => {
			this.listData = table.Type;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/type/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaType&sort=desc&namaType=' + this.pencarian).subscribe(table => {
			this.listData = table.Type;
		});
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

	clone(cloned: any) {
		let fixHub = {
			"kdNegara": cloned.data.kode.kdNegara,
			"kdTypeHead": cloned.data.kdTypeHead,
			"namaType": cloned.data.namaType,
			"kdKelompokProduk": cloned.data.kdKelompokProduk,
			"kdGKelompokProduk": cloned.data.kdGKelompokProduk,
			"kdMerkProduk": cloned.data.kdMerkProduk,
			"reportDisplay": cloned.data.reportDisplay,
			"namaExternal": cloned.data.namaExternal,
			"kodeExternal": cloned.data.kodeExternal,
			"statusEnabled": cloned.data.statusEnabled,
			"kode": cloned.data.kode.kode,
			"kdProfile": this.authGuard.getUserDto().kdProfile
		}
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		console.log(event);
		let cloned = this.clone(event);
		this.formAktif = false;
		this.form.setValue(cloned);
		this.getTypeHead();
		this.getGenKelompokProduk();
		this.getMerkProduk();
	}

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		}
		else {
			this.simpan();
		}
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		}
		else {
			// console.log(JSON.stringify(this.form.value))
			this.httpService.post(Configuration.get().dataMasterNew + '/type/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.reset();
			})
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
		this.httpService.update(Configuration.get().dataMasterNew + '/type/update', this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/type/del/' + this.form.get('kdNegara').value + '/' + this.form.get('kode').value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		let kode = this.form.get('kode').value;
		if (kode == null || kode == undefined || kode == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Type');
		}
		else {
			this.confirmationService.confirm({
				message: 'Apakah Data Akan Dihapus?',
				header: 'Konfirmasi Hapus',
				icon: 'fa fa-trash',
				accept: () => {
					this.hapus();
				}
			});
		}
	}

	getNegara() {
		this.httpService.get(Configuration.get().dataMasterNew + '/negara/findAllNegara').subscribe(res => {
			this.listNegara = [];
			this.listNegara.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.Negara.length; i++) {
				this.listNegara.push({ label: res.Negara[i].namaNegara, value: res.Negara[i].kode })
			};
		})
	}

	getTypeHead() {
		if (this.form.get('kdNegara').value == null) {
			this.listTypeHead = [];
			this.listTypeHead.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/type/findByKdNegara/' + this.form.get('kdNegara').value).subscribe(res => {
				this.listTypeHead = [];
				this.listTypeHead.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < res.data.length; i++) {
					this.listTypeHead.push({ label: res.data[i].namaType, value: res.data[i].kode.kode })
				};
			})
		}
	}

	getKelompokProduk() {
		this.httpService.get(Configuration.get().dataMasterNew + '/kelompokproduk/findAllData').subscribe(res => {
			this.listKelompokproduk = [];
			this.listKelompokproduk.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.listKelompokproduk.push({ label: res.data[i].namaKelompokProduk, value: res.data[i].kode.kode })
			};
		})
	}

	getGenKelompokProduk() {
		if (this.form.get('kdNegara').value == null) {
			this.listGenKelompokProduk = [];
			this.listGenKelompokProduk.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/generalkelompokproduk/findAllDataByNegaraProfile?kdNegara=' + this.form.get('kdNegara').value).subscribe(res => {
				this.listGenKelompokProduk = [];
				this.listGenKelompokProduk.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < res.data.length; i++) {
					this.listGenKelompokProduk.push({ label: res.data[i].generalKelompokProduk, value: res.data[i].kode.kode })
				};
			})
		}
	}

	getMerkProduk() {
		if (this.form.get('kdNegara').value == null) {
			this.listMerkProduk = [];
			this.listMerkProduk.push({ label: '-- Pilih --', value: '' })
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/merkproduk/findAllMerkProduk?kdNegara=' + this.form.get('kdNegara').value).subscribe(res => {
				this.listMerkProduk = [];
				this.listMerkProduk.push({ label: '-- Pilih --', value: '' })
				for (var i = 0; i < res.MerkProduk.length; i++) {
					this.listMerkProduk.push({ label: res.MerkProduk[i].namaMerkProduk, value: res.MerkProduk[i].kode.kode })
				};
			})
		}
	}

	onChange(event) {
		this.getMerkProduk();
		this.getTypeHead();
		this.getGenKelompokProduk();
	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaType').value)
	}

}


