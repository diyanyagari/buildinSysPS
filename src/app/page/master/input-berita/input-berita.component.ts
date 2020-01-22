import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-input-berita',
	templateUrl: './input-berita.component.html',
	styleUrls: ['./input-berita.component.scss'],
	providers: [ConfirmationService]
})
export class InputBeritaComponent implements OnInit {

	formAktif: boolean;
	jenisDokumenParam: boolean;
	namaDokumenParam: boolean;
	buttonCariParam: boolean;
	form: FormGroup;
	formPencarian: FormGroup;
	items: MenuItem[];
	jenisDokumen: any = [];
	namaDokumen: any = [];
	noHistori: any;
	listData: any = [];
	listDataBefore: any = [];
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
		private confirmationService: ConfirmationService) {
	}

	ngAfterViewInit() {
		// var x = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
		document.getElementById("buttonCari").style.height = "3.5vh";
		document.getElementById("buttonReset").style.height = "3.5vh";
		var browseStyle = document.getElementsByClassName("ui-button-text ui-clickable") as HTMLCollectionOf<HTMLElement>;
		// for (var i = 0; i < x.length; i++) {
		// 	x[i].style.height = '3.3vh';
		// }
		for (var i = 0; i < browseStyle.length; i++) {
			browseStyle[i].style.marginTop = '-0.7vh';
		}
	}

	ngOnInit() {
		this.jenisDokumenParam = true;
		this.namaDokumenParam = true;
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		// var element = document.getElementById("calendar1");
		// element.classList.add("gg");
		// console.log(element);
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
			'kdDokumen': new FormControl(null, Validators.required),
			'kdJenisDokumen': new FormControl(null, Validators.required),
			'tglAwal': new FormControl(new Date()),
			'tglAkhir': new FormControl(new Date())
		});
		this.formPencarian = this.fb.group({
			'tglAwal': new FormControl(new Date()),
			'tglAkhir': new FormControl(new Date())
		});
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getJenisDokumen();
		this.getNamaDokumen();
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorinews/findAll?page=' + page + '&rows=' + rows + '&dir=dokumen.namaJudulDokumen&sort=desc&namaDokumen' + cari).subscribe(table => {
			this.listData = table.ProfileHistoriNews;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		if (this.buttonCariParam) {
			let tglAwal = Math.floor(this.setTimeStamp(this.formPencarian.get('tglAwal').value))
			let tglAkhir = Math.floor(this.setTimeStamp(this.formPencarian.get('tglAkhir').value))
			this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorinews/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=dokumen.namaJudulDokumen&sort=desc&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&namaDokumen=' + this.pencarian).subscribe(table => {
				this.listData = table.ProfileHistoriNews;
			});
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorinews/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=dokumen.namaJudulDokumen&sort=desc&namaDokumen=' + this.pencarian).subscribe(table => {
				this.listData = table.ProfileHistoriNews;
			});
		}
	}

	buttonCari() {
		this.buttonCariParam = true;
		let tglAwal = Math.floor(this.setTimeStamp(this.formPencarian.get('tglAwal').value))
		let tglAkhir = Math.floor(this.setTimeStamp(this.formPencarian.get('tglAkhir').value))
		this.httpService.get(Configuration.get().dataMasterNew + '/profilehistorinews/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=dokumen.namaJudulDokumen&sort=desc&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir).subscribe(table => {
			this.listData = table.ProfileHistoriNews;
		});
	}

	resetCari() {
		let cari: string;
		this.buttonCariParam = false;
		this.pencarian = '';
		this.ngOnInit();
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
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		// this.setPageRow((event.rows + event.first) / event.rows, event.rows);
	}

	clone(cloned: any) {
		let fixHub = {
			"kdJenisDokumen": cloned.data.namaJenisDokumen,
			"kdDokumen": cloned.data.kode.kdDokumen,
			"tglAwal": new Date(cloned.data.tglAwal * 1000),
			"tglAkhir": new Date(cloned.data.tglAkhir * 1000)
		}
		this.noHistori = cloned.data.kode.noHistori;
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		this.jenisDokumenParam = false;
		this.namaDokumenParam = false;
		let cloned = this.clone(event);
		console.log(event);
		this.formAktif = false;
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAllData').subscribe(res => {
			for (var i = 0; i < res.JenisDokumen.length; i++) {
				if (res.JenisDokumen[i].namaJenisDokumen == cloned.kdJenisDokumen) {
					cloned.kdJenisDokumen = res.JenisDokumen[i].kdJenisDokumen
				}
			};
			this.form.setValue(cloned);
		})
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
			let tglAwal = Math.floor(this.setTimeStamp(this.form.get('tglAwal').value))
			let tglAkhir = Math.floor(this.setTimeStamp(this.form.get('tglAkhir').value))

			let formSubmit = this.form.value;
			formSubmit.tglAwal = tglAwal;
			formSubmit.tglAkhir = tglAkhir;
			formSubmit.statusEnabled = true;
			this.httpService.post(Configuration.get().dataMasterNew + '/profilehistorinews/save', formSubmit).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				this.reset();
			})
			// console.log(JSON.stringify(this.form.value))
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
		let tglAwal = Math.floor(this.setTimeStamp(this.form.get('tglAwal').value))
		let tglAkhir = Math.floor(this.setTimeStamp(this.form.get('tglAkhir').value))

		let formSubmit = this.form.value;
		formSubmit.tglAwal = tglAwal;
		formSubmit.tglAkhir = tglAkhir;
		formSubmit.statusEnabled = true;
		let dataSimpan = {
			"kdDokumen": this.form.get('kdDokumen').value,
			"noHistori": this.noHistori,
			"statusEnabled": true,
			"tglAkhir": tglAkhir,
			"tglAwal": tglAwal
		}
		this.httpService.update(Configuration.get().dataMasterNew + '/profilehistorinews/update', dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/profilehistorinews/del/' + this.form.get('kdDokumen').value + '/' + this.noHistori).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
	}

	confirmDelete() {
		this.confirmationService.confirm({
			message: 'Apakah Data Akan Dihapus?',
			header: 'Konfirmasi Hapus',
			icon: 'fa fa-trash',
			accept: () => {
				this.hapus();
			}
		});
	}

	getJenisDokumen() {
		this.httpService.get(Configuration.get().dataMasterNew + '/jenisdokumen/findAllData').subscribe(res => {
			this.jenisDokumen = [];
			this.jenisDokumen.push({ label: '-- Silahkan Pilih Jenis Kegiatan --', value: '' })
			for (var i = 0; i < res.JenisDokumen.length; i++) {
				this.jenisDokumen.push({ label: res.JenisDokumen[i].namaJenisDokumen, value: res.JenisDokumen[i].kdJenisDokumen })
			};
		})
	}

	getNamaDokumen() {
		this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAllData').subscribe(res => {
			this.namaDokumen = [];
			this.namaDokumen.push({ label: '-- Silahkan Pilih Dokumen --', value: '' })
			for (var i = 0; i < res.data.length; i++) {
				this.namaDokumen.push({ label: res.data[i].namaJudulDokumen, value: res.data[i].kode.kode })
			};
		})
	}

	onChange(event) {
		if (event.value == '') {
			this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findAllData').subscribe(res => {
				this.namaDokumen = [];
				this.namaDokumen.push({ label: '-- Silahkan Pilih Dokumen --', value: '' })
				for (var i = 0; i < res.data.length; i++) {
					this.namaDokumen.push({ label: res.data[i].namaJudulDokumen, value: res.data[i].kode.kode })
				};
			})
		} else {
			this.httpService.get(Configuration.get().dataMasterNew + '/dokumen/findByJenis/' + event.value).subscribe(res => {
				this.namaDokumen = [];
				this.namaDokumen.push({ label: '-- Silahkan Pilih Dokumen --', value: '' })
				for (var i = 0; i < res.dokumen.length; i++) {
					this.namaDokumen.push({ label: res.dokumen[i].namaJudulDokumen, value: res.dokumen[i].kdDokumen })
				};
			})
		}
	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}
}