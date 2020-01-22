import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
	selector: 'app-map-jurusan-to-produk',
	templateUrl: './map-jurusan-to-produk.component.html',
	styleUrls: ['./map-jurusan-to-produk.component.scss'],
	providers: [ConfirmationService]
})
export class MapJurusanToProdukComponent implements OnInit {

	listData: any[];
	selected: any;
	form: FormGroup;
	kodeJurusan: any[];
	kodeLevelTingkat: any[]

	totalRecords: number;
	page: number;
	rows: number;
	report: any;
	toReport: any;
	formAktif: boolean;
	items: any;
	pencarian: string;
	versi: any;
	myForm: FormGroup;
	version: any;
	cekLampiranDokumen: boolean = false;
	hasilCek: boolean = false;
	blockedPanel: boolean = false;
	selectedAll: any;
	kdJurusan: any;
	kdLevelTingkat:any;
	pilihan: any = [];
	pilihSemua: boolean;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private cdRef: ChangeDetectorRef) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows; }

		ngAfterViewInit() {
			this.hasilCek = true;
			this.cekLampiranDokumen = false;
			this.cdRef.detectChanges();
		}

		ngOnInit() {
			this.version = "1";
			this.get(this.page, this.rows, '');
			this.form = this.fb.group({
				'kdJurusan': new FormControl('', Validators.required),
				'kdLevelTingkat': new FormControl('', Validators.required),
				'statusEnabled': new FormControl(true),
			});

			this.form.get('kdLevelTingkat').disable();
			this.hasilCek = false;
			this.pilihan=[];
			this.kodeJurusan = [];
			this.kodeLevelTingkat = [];

			this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jurusan&select=namaJurusan,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
				this.kodeJurusan = [];
				this.kodeJurusan.push({ label: '--Pilih Jurusan--', value: '' })
				for (var i = 0; i < res.data.data.length; i++) {
					this.kodeJurusan.push({ label: res.data.data[i].namaJurusan, value: res.data.data[i].id_kode })
				};
			});

			this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=LevelTingkat&select=namaLevelTingkat,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
				this.kodeLevelTingkat = [];
				this.kodeLevelTingkat.push({ label: '--Pilih Level Tingkat--', value: '' })
				for (var i = 0; i < res.data.data.length; i++) {
					this.kodeLevelTingkat.push({ label: res.data.data[i].namaLevelTingkat, value: res.data.data[i].id_kode })
				};
			});
		}

		get(page: number, rows: number, search: any) {
			this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Produk&select=namaProduk,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
				this.listData = res.data.data;
			});
		}

		valuechange(value) {
			if(value !== null || value !== "") {
				this.form.get('kdLevelTingkat').enable();
			} else {
				this.form.get('kdLevelTingkat').disable();
			}
		}

		fungsiget() {
			this.clearPanelBawah(this.form.get('kdJurusan').value, this.form.get('kdLevelTingkat').value);
		}  

		clearPanelBawah(kdJurusan: any, kdLevelTingkat:any ) {

			if (kdJurusan == '' || kdJurusan == null) {
				if (kdLevelTingkat == '' || kdLevelTingkat == null) {
					this.hasilCek = true;
					this.pilihan = [];
					this.pilihSemua = false;
				}
			} else {
				this.hasilCek = false;
				this.pilihSemua = false;
				this.httpService.get(Configuration.get().dataMasterNew + '/mapjurusantoproduk/findByKode/' + kdJurusan +'/'+ kdLevelTingkat).subscribe(res => {
					this.pilihan = [];
					for (let i = 0; i < res.MapJurusanToProduk.length; i++) {
						this.pilihan.push(String(res.MapJurusanToProduk[i].kdProdukD))

					}
				});
			}
		}

		selectAll() {
			if (this.pilihSemua == true) {
				this.pilihan = []
				let dataTemp = []
				this.listData.forEach(function (data) {
					dataTemp.push(String(data.id_kode));
				})
				this.pilihan = dataTemp;
			} else {
				this.pilihan = []
			}
		}

		onChange() {
			console.log(JSON.stringify(this.pilihan))
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

		simpan() {
			let mapJurusanToProduk = []
			for (let i = 0; i < this.pilihan.length; i++) {
				let dataTemp = {
					"kdProdukD": this.pilihan[i],
					"kdJurusan": this.form.get('kdJurusan').value,
					"kdLevelTingkat": this.form.get('kdLevelTingkat').value,
					"statusEnabled": true
				}
				mapJurusanToProduk.push(dataTemp);
			}
			// let dataSimpan = {
			// 	"mapJurusanToProduk": mapJurusanToProduk
			// }

			this.httpService.update(Configuration.get().dataMasterNew + '/mapjurusantoproduk/update', mapJurusanToProduk).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.pilihSemua = false;
			});
			this.ngOnInit();
		}

	}