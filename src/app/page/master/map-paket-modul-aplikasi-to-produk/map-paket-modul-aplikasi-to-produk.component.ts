import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { Router } from "@angular/router";
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, TreeModule, TreeNode, AccordionModule, TreeTableModule, SharedModule, Dropdown } from 'primeng/primeng';

@Component({
	selector: 'app-map-paket-modul-aplikasi-to-produk',
	templateUrl: './map-paket-modul-aplikasi-to-produk.component.html',
	styleUrls: ['./map-paket-modul-aplikasi-to-produk.component.scss'],
	providers: [ConfirmationService],
	encapsulation: ViewEncapsulation.None
})
export class MapPaketModulAplikasiToProdukComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	listData = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	listNamaSK;
	listNamaSK2;
	kdprof: any;
	kddept: any;
	noskinternal;
	tglAwal;
	tglAkhir;
	paket;
	mdlAplikasi;
	version;
	edisi;
	kelompokKlien;
	selectedMenu: any = [];
	selectedMenuBefore: any = [];
	listmap;
	versionTree: TreeNode[];
	minmin;
	openDropdownKey: boolean;
	selectedVersion: any;
	listVersion: any[];

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		private route: Router,
		private confirmationService: ConfirmationService) {
	}

	ngAfterViewInit() {
		var x = document.getElementsByClassName("ui-inputtext ui-corner-all") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < x.length; i++) {
			x[i].style.height = '25px';
		}

		var styleButton = document.getElementsByClassName("ui-clickable") as HTMLCollectionOf<HTMLElement>;
		for (var i = 0; i < styleButton.length; i++) {
			styleButton[i].style.paddingTop = '2px';
		}
	}

	ngOnInit() {
		this.listVersion = [];
		this.openDropdownKey = false;
		this.selectedMenu = [];
		if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		this.form = this.fb.group({
			'kdProfile': new FormControl(''),
			'kdPaket': new FormControl('', Validators.required),
			'kdModulAplikasi': new FormControl('', Validators.required),
			'kdVersion': new FormControl('', Validators.required),
			'kdEdisi': new FormControl('', Validators.required),
			'kdKelompokKlien': new FormControl('', Validators.required),
			'noSK': new FormControl('', Validators.required),
			'kdProduk': new FormControl(''),
			'qtyProdukMin': new FormControl(''),
			'qtyProdukMax': new FormControl(''),
			'statusAktif': new FormControl(''),
		});
		this.getNamaSK();
		this.getPaket();
		this.getModulAplikasi();
		this.getVersion();
		this.getEdisi();
		this.getKelompokKlien();
	}

	getAllMap(page: number, rows: number, pencarian, kdPaket, kdModulAplikasi, kdVersion, kdEdisi, kdKelompokKlien, noSK) {
		page = page - 1;
		pencarian = this.pencarian;
		if ((pencarian == undefined) || (pencarian == '')) {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Produk/GetAllProdukByMapPaketModulAplikasiToProduk?kdProfile=' + this.kdprof + '&kdPaket=' + kdPaket + '&kdModulAplikasi=' + kdModulAplikasi + '&kdVersion=' + kdVersion + '&kdEdisi=' + kdEdisi + '&kdKelompokKlien=' + kdKelompokKlien + '&noSk=' + noSK + '&PageIndex=' + page + '&PageSize=' + rows).subscribe(res => {
				this.listData = res.items;
				this.totalRecords = res.totalCount;
			});
		} else {
			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Produk/GetAllProdukByMapPaketModulAplikasiToProduk?kdProfile=' + this.kdprof + '&kdPaket=' + kdPaket + '&kdModulAplikasi=' + kdModulAplikasi + '&kdVersion=' + kdVersion + '&kdEdisi=' + kdEdisi + '&kdKelompokKlien=' + kdKelompokKlien + '&noSk=' + noSK + '&PageIndex=' + page + '&PageSize=' + rows + '&keyword=' + pencarian).subscribe(res => {
				this.listData = res.items;
				this.totalRecords = res.totalCount;
			});
		}
	}

	globalFilter(value) {
		this.getAllMap(this.page, this.rows, '', this.form.get('kdPaket').value, this.form.get('kdModulAplikasi').value, this.form.get('kdVersion').value, this.form.get('kdEdisi').value, this.form.get('kdKelompokKlien').value, this.noskinternal)
	}

	loadPage(event: LazyLoadEvent) {
		// this.getProduk((event.rows + event.first) / event.rows, event.rows, this.pencarian);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
		if (this.noskinternal != undefined) {
			this.getAllMap((event.rows + event.first) / event.rows, event.rows, '', this.form.get('kdPaket').value, this.form.get('kdModulAplikasi').value, this.form.get('kdVersion').value, this.form.get('kdEdisi').value, this.form.get('kdKelompokKlien').value, this.noskinternal)
			this.mapFilter(1);
		}
	}

	getNamaSK() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/v1/SuratKeputusan/GetAllSuratKeputusan?kdProfile=' + this.kdprof).subscribe(res => {
			this.listNamaSK = [];
			this.listNamaSK.push({ label: '--Pilih Nama SK--', value: '' })
			for (var i = 0; i < res.length; i++) {
				this.listNamaSK.push({ label: res[i].namaSk, value: res[i].nomorSk })
			};
			this.listNamaSK2 = res;
		});
	}

	getPaket() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/Paket').subscribe(res => {
			this.paket = [];
			this.paket.push({ label: '--Pilih Paket--', value: '' })
			for (var i = 0; i < res.length; i++) {
				this.paket.push({ label: res[i].namaPaket, value: res[i].kdPaket })
			};
		});
	}

	getModulAplikasi() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/ModulAplikasi').subscribe(res => {
			this.mdlAplikasi = [];
			this.mdlAplikasi.push({ label: '--Pilih Modul Aplikasi--', value: '' })
			for (var i = 0; i < res.length; i++) {
				this.mdlAplikasi.push({ label: res[i].modulAplikasi, value: res[i].kdModulAplikasi })
			};
		});
	}

	getVersion() {
		// this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/Version').subscribe(res => {
		// 	this.version = [];
		// 	this.version.push({ label: '--Pilih Versi--', value: '' })
		// 	for (var i = 0; i < res.length; i++) {
		// 		this.version.push({ label: res[i].namaVersion, value: res[i].kdVersion })
		// 	};
		// });


		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/Version/WithChild').subscribe(res => {
			// this.version = [];
			// this.version.push({ label: '--Pilih Versi--', value: '' })
			for (var i = 0; i < res.length; i++) {
				this.listVersion[i] = {
					"label": res[i].namaVersion,
					"kode": res[i].kdVersion,
					"children": []
				}
				let child = [];
				for (let j = 0; j < res[i].childs.length; j++) {
					child[j] = {
						"label": res[i].childs[j].namaVersion,
						"kode": res[i].childs[j].kdVersion,
					}
					this.listVersion[i].children.push(child[j]);
				}
			};
			// console.log(this.listVersion)
		});
	}

	getEdisi() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/Edisi').subscribe(res => {
			this.edisi = [];
			this.edisi.push({ label: '--Pilih Edisi--', value: '' })
			for (var i = 0; i < res.length; i++) {
				this.edisi.push({ label: res[i].namaEdisi, value: res[i].kdEdisi })
			};
		});
	}

	getKelompokKlien() {
		this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/admin/KelompokKlien').subscribe(res => {
			this.kelompokKlien = [];
			this.kelompokKlien.push({ label: '--Pilih Kelompok Klien--', value: '' })
			for (var i = 0; i < res.length; i++) {
				this.kelompokKlien.push({ label: res[i].namaKelompokKlien, value: res[i].kdKelompokKlien })
			};
		});
	}

	ambilSK(sk) {
		for (let i = 0; i < this.listNamaSK2.length; i++) {
			if (sk.value == this.listNamaSK2[i].nomorSk) {
				if (this.listNamaSK2[i].tglAwal != null) {
					this.tglAwal = new Date(this.listNamaSK2[i].tglAwal);
				} else {
					this.tglAwal = null;
				}

				if (this.listNamaSK2[i].tglAkhir != null) {
					this.tglAkhir = new Date(this.listNamaSK2[i].tglAkhir);
				} else {
					this.tglAkhir = null;
				}
				this.noskinternal = this.listNamaSK2[i].nomorSk;
				this.form.get('noSK').setValue(this.listNamaSK2[i].nomorSk)
			}
		}
	}

	onSubmit() {
		if (this.form.invalid) {
			this.validateAllFormFields(this.form);
			this.alertService.warn("Peringatan", "Data Tidak Sesuai")
		} else {
			this.simpan();
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
		// let mapPaketModulAplikasiToProduk = this.listData;
		let mapPaketModulAplikasiToProduk = [];
		for (let i = 0; i < this.selectedMenu.length; i++) {
			let dataTemp = {
				"kdProfile": this.kdprof,
				"kdPaket": this.form.get('kdPaket').value,
				"kdModulAplikasi": this.form.get('kdModulAplikasi').value,
				"kdVersion": this.form.get('kdVersion').value,
				"kdEdisi": this.form.get('kdEdisi').value,
				"kdKelompokKlien": this.form.get('kdKelompokKlien').value,
				"noSK": this.noskinternal,
				//============================================================
				"kdProduk": this.selectedMenu[i].kdProduk,
				"qtyProdukMin": this.selectedMenu[i].mapPaketToProdukOutput.qtyMin,
				"qtyProdukMax": this.selectedMenu[i].mapPaketToProdukOutput.qtyMax,
				// "qtyProdukMin": 1,
				// "qtyProdukMax": 1,
				// "statusAktif": 1,
				"statusAktif": 1,
			}
			mapPaketModulAplikasiToProduk.push(dataTemp);
		}

		if(this.selectedMenu.length == 0){
			let dataTemp = {
				"kdProfile": this.kdprof,
				"kdPaket": this.form.get('kdPaket').value,
				"kdModulAplikasi": this.form.get('kdModulAplikasi').value,
				"kdVersion": this.form.get('kdVersion').value,
				"kdEdisi": this.form.get('kdEdisi').value,
				"kdKelompokKlien": this.form.get('kdKelompokKlien').value,
				"noSK": this.noskinternal,
				//============================================================
				"kdProduk": "",
				"qtyProdukMin": 0,
				"qtyProdukMax": 0,
				// "qtyProdukMin": 1,
				// "qtyProdukMax": 1,
				// "statusAktif": 1,
				"statusAktif": "0",
			}
			mapPaketModulAplikasiToProduk.push(dataTemp);
		}

		// for (let i = 0; i < this.selectedMenuBefore.length; i++) {
		// 	this.selectedMenuBefore[i].mapPaketToProdukOutput.
		// }
		console.log(mapPaketModulAplikasiToProduk)
		this.httpService.post(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/MapPaketModulAplikasiToProduk', mapPaketModulAplikasiToProduk).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Disimpan');
			this.reset();
		});
	}

	mapFilter(event) {
		if (this.form.invalid) {

		} else {
			this.getAllMap(this.page, this.rows, '', this.form.get('kdPaket').value, this.form.get('kdModulAplikasi').value, this.form.get('kdVersion').value, this.form.get('kdEdisi').value, this.form.get('kdKelompokKlien').value, this.noskinternal)

			this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Produk/GetAllProdukByMapPaketModulAplikasiToProduk?kdProfile=' + this.kdprof + '&kdPaket=' + this.form.get('kdPaket').value + '&kdModulAplikasi=' + this.form.get('kdModulAplikasi').value + '&kdVersion=' + this.form.get('kdVersion').value + '&kdEdisi=' + this.form.get('kdEdisi').value + '&kdKelompokKlien=' + this.form.get('kdKelompokKlien').value + '&noSk=' + this.noskinternal + '&PageIndex=' + 0 + '&PageSize=' + 10).subscribe(res => {
				this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Produk/GetAllProdukByMapPaketModulAplikasiToProduk?kdProfile=' + this.kdprof + '&kdPaket=' + this.form.get('kdPaket').value + '&kdModulAplikasi=' + this.form.get('kdModulAplikasi').value + '&kdVersion=' + this.form.get('kdVersion').value + '&kdEdisi=' + this.form.get('kdEdisi').value + '&kdKelompokKlien=' + this.form.get('kdKelompokKlien').value + '&noSk=' + this.noskinternal + '&PageIndex=0&PageSize=' + res.totalCount).subscribe(response => {
					for (let i = 0; i < response.items.length; i++) {
						if (response.items[i].mapPaketToProdukOutput.checked == 1) {
							this.selectedMenu.push(response.items[i])
							this.selectedMenuBefore.push(response.items[i])
						}
					}
				});
			});

			// this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Produk/GetAllProdukByMapPaketModulAplikasiToProduk?kdProfile=' + this.kdprof + '&kdPaket=' + this.form.get('kdPaket').value + '&kdModulAplikasi=' + this.form.get('kdModulAplikasi').value + '&kdVersion=' + this.form.get('kdVersion').value + '&kdEdisi=' + this.form.get('kdEdisi').value + '&kdKelompokKlien=' + this.form.get('kdKelompokKlien').value + '&noSk=' + this.noskinternal + '&PageIndex=' + 0 + '&PageSize=' + this.page).subscribe(res => {
			// 	this.httpService.get(Configuration.get().dataHr2Mod2 + '/api/bottis/v1/Produk/GetAllProdukByMapPaketModulAplikasiToProduk?kdProfile=' + this.kdprof + '&kdPaket=' + this.form.get('kdPaket').value + '&kdModulAplikasi=' + this.form.get('kdModulAplikasi').value + '&kdVersion=' + this.form.get('kdVersion').value + '&kdEdisi=' + this.form.get('kdEdisi').value + '&kdKelompokKlien=' + this.form.get('kdKelompokKlien').value + '&noSk=' + this.noskinternal + '&PageIndex=0&PageSize=' + res.totalCount).subscribe(response => {
			// 		let mapKelompok = [];
			// 		for (let i = 0; i < response.items.length; i++) {
			// 			let data = {
			// 				"details": response.items[i].details,
			// 				"mapPaketToProdukOutput": {
			// 					'checked': response.items[i].mapPaketToProdukOutput.checked,
			// 					'qtyMax': response.items[i].mapPaketToProdukOutput.qtyMax,
			// 					'qtyMin': response.items[i].mapPaketToProdukOutput.qtyMin,
			// 				},
			// 				"namaProduk": response.items[i].namaProduk
			// 			}
			// 			mapKelompok.push(data);
			// 		}
			// 		let selected = mapKelompok.map(val => val.mapPaketToProdukOutput.checked);
			// 		this.selectedMenu = this.listData.filter(val => selected.indexOf(val.mapPaketToProdukOutput.checked) != 1);
			// 	});
			// });
		}
	}

	reset() {
		this.listData = []
		this.pencarian = ''
		this.tglAwal = '';
		this.tglAkhir = '';
		this.noskinternal = '';
		this.selectedVersion = '-- Pilih Version --';
		this.ngOnInit();
	}

	openDropdown() {
		if (this.openDropdownKey) {
			document.getElementById("dropdownTree").style.display = "none";
			this.openDropdownKey = false;
		} else {
			document.getElementById("dropdownTree").style.display = "block";
			this.openDropdownKey = true;
		}
	}

	nodeSelect(event) {

		this.selectedVersion = event.node.label;
		// console.log(this.selectedVersion)
		this.form.get('kdVersion').setValue(event.node.kode)
		console.log(this.form.get('kdVersion').value)
		// this.selectKdVersion = event.node.kode;
		// this.getList();
		this.mapFilter(event.node.kode)
		document.getElementById("dropdownTree").style.display = "none";
		this.openDropdownKey = false;

		//this.openDropdown();
	}
}