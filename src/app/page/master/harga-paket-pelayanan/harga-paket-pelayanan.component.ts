import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-harga-paket-pelayanan',
	templateUrl: './harga-paket-pelayanan.component.html',
	styleUrls: ['./harga-paket-pelayanan.component.scss'],
	providers: [ConfirmationService]
})
export class HargaPaketPelayananComponent implements OnInit {
	program: any;
	formAktif: boolean;
	form: FormGroup;
	items: MenuItem[];
	pelayananProfileHead: any = [];
	kodeExternal: any;
	namaExternal: any;
	statusEnabled: any;
	noRec: any;
	namaProgram: any;
	reportDisplay: any;
	listSKAll: any = [];
	listSK: any = [];
	listPaket: any = [];
	listKelas: any = [];
	listOperatorFactorRate: any = [];
	listMataUang: any = [];
	kode: any;
	listData: any = [];
	pencarian: string;
	page: number;
	totalRecords: number;
	rows: number;
	versi: number;
	disHargaSatuan: boolean;
	disHargaNetto: boolean;
	dispersenDiscount: boolean;
	dishargaDiscount: boolean;
	hargaSatuan: boolean;
	disDropdown: boolean;
	dataDropdown: boolean = false;
	noSK: any;
	tglBerlakuAwal: any;
	tglBerlakuAkhir: any;
	noSKInternal: any;
	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private authGuard: AuthGuard,
		private confirmationService: ConfirmationService) { }

	ngOnInit() {
		this.disDropdown = true;
		this.disHargaNetto = true;
		this.disHargaSatuan = true;
		this.dispersenDiscount = true;
		this.dishargaDiscount = true;
		this.hargaSatuan = true;
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
				label: 'Excel', icon: 'fa-file-excel-o', command: () => {
					// this.downloadExel();
				}
			}];

		this.formAktif = true;
		this.form = this.fb.group({
			'noSK': new FormControl(null, Validators.required),
			'kdPaket': new FormControl(null, Validators.required),
			'kdKelas': new FormControl(null, Validators.required),
			'operatorFactorRate': new FormControl(null, Validators.required),
			'kdMataUang': new FormControl(null),
			'kdNegara': new FormControl(null),
			'hargaNetto': new FormControl(null,Validators.required),
			'hargaSatuan': new FormControl(null),
			'persenDiscount': new FormControl(null),
			'hargaDiscount': new FormControl(null),
			'factorRate': new FormControl(null, Validators.required),
			'statusEnabled': new FormControl(true)
		});
		this.pencarian = '';
		this.getDataGrid(this.page, this.rows, this.pencarian);
		this.getProfile();
		this.getSK();
		this.getPaket();
		this.getKelas();
		this.getOperator();
		this.getMataUang();
		this.dataDropdown = true;
		let dataUser = this.authGuard.getUserDto();
		console.log('user : ',dataUser)
		// this.form.get('kdNegara').setValue(this.authGuard.getUserDto());
		this.form.get('factorRate').setValue(1);
		this.form.get('operatorFactorRate').setValue('X');
		this.noSK = null;
		this.tglBerlakuAwal = null;
		this.tglBerlakuAkhir = null;
		this.noSKInternal = null;
	}

	getDataGrid(page: number, rows: number, cari: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/findAll?page=' + page + '&rows=' + rows + '&dir=paket.namaPaket&sort=asc&namaPaket=' + cari).subscribe(table => {
			if(table.HargaPaketPelayanan){
				for (var i = 0; i < table.HargaPaketPelayanan.length; i++) {
					table.HargaPaketPelayanan[i].tglBerlakuAwal = this.changeDateFormat(table.HargaPaketPelayanan[i].tglBerlakuAwal);
					table.HargaPaketPelayanan[i].tglBerlakuAkhir = this.changeDateFormat(table.HargaPaketPelayanan[i].tglBerlakuAkhir);
					table.HargaPaketPelayanan[i].tglBerlakuAwal = table.HargaPaketPelayanan[i].tglBerlakuAwal == '01/01/1970' ? '' : table.HargaPaketPelayanan[i].tglBerlakuAwal;					
					table.HargaPaketPelayanan[i].tglBerlakuAkhir = table.HargaPaketPelayanan[i].tglBerlakuAkhir == '01/01/1970' ? '' : table.HargaPaketPelayanan[i].tglBerlakuAkhir;
					table.HargaPaketPelayanan[i].tglBerlaku = table.HargaPaketPelayanan[i].tglBerlakuAwal + ' - ' + table.HargaPaketPelayanan[i].tglBerlakuAkhir;
					table.HargaPaketPelayanan[i].hargaNetto_n = table.HargaPaketPelayanan[i].hargaNetto == null ? null : this.setRupiah(table.HargaPaketPelayanan[i].hargaNetto);
					table.HargaPaketPelayanan[i].hargaSatuan_n = table.HargaPaketPelayanan[i].hargaSatuan == null ? null : this.setRupiah(table.HargaPaketPelayanan[i].hargaSatuan);
					table.HargaPaketPelayanan[i].hargaDiscount_n = table.HargaPaketPelayanan[i].hargaDiscount == null ? null : this.setRupiah(table.HargaPaketPelayanan[i].hargaDiscount);
				}
			}
			this.listData = table.HargaPaketPelayanan;
			this.totalRecords = table.totalRow;
		});
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=paket.namaPaket&sort=asc&namaPaket=' + this.pencarian).subscribe(table => {
			if(table.HargaPaketPelayanan){
				for (var i = 0; i < table.HargaPaketPelayanan.length; i++) {
					table.HargaPaketPelayanan[i].tglBerlakuAwal = this.changeDateFormat(table.HargaPaketPelayanan[i].tglBerlakuAwal);
					table.HargaPaketPelayanan[i].tglBerlakuAkhir = this.changeDateFormat(table.HargaPaketPelayanan[i].tglBerlakuAkhir);
					table.HargaPaketPelayanan[i].tglBerlakuAwal = table.HargaPaketPelayanan[i].tglBerlakuAwal == '01/01/1970' ? '' : table.HargaPaketPelayanan[i].tglBerlakuAwal;					
					table.HargaPaketPelayanan[i].tglBerlakuAkhir = table.HargaPaketPelayanan[i].tglBerlakuAkhir == '01/01/1970' ? '' : table.HargaPaketPelayanan[i].tglBerlakuAkhir;
					table.HargaPaketPelayanan[i].tglBerlaku = table.HargaPaketPelayanan[i].tglBerlakuAwal + ' - ' + table.HargaPaketPelayanan[i].tglBerlakuAkhir;
					table.HargaPaketPelayanan[i].hargaNetto_n = table.HargaPaketPelayanan[i].hargaNetto == null ? null : this.setRupiah(table.HargaPaketPelayanan[i].hargaNetto);
					table.HargaPaketPelayanan[i].hargaSatuan_n = table.HargaPaketPelayanan[i].hargaSatuan == null ? null : this.setRupiah(table.HargaPaketPelayanan[i].hargaSatuan);
					table.HargaPaketPelayanan[i].hargaDiscount_n = table.HargaPaketPelayanan[i].hargaDiscount == null ? null : this.setRupiah(table.HargaPaketPelayanan[i].hargaDiscount);
				}
			}
			this.listData = table.HargaPaketPelayanan;
			this.totalRecords = table.totalRow;
		});
	}

	setTimeStamp(date) {
		let dataTimeStamp = (new Date(date).getTime() / 1000);
		return dataTimeStamp;
	}

	changeDateFormat(value){
        let data = new Date(value * 1000)
        let tgl = ("0" + data.getDate()).slice(-2)
        let bulan = ("0" + (data.getMonth() + 1)).slice(-2)
        let tahun = data.getFullYear()
        
        var abc = tgl+'/'+bulan+'/'+tahun;
        return abc   
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
	}

	clone(cloned: any) {
		let fixHub = {
			"kdNegara": this.form.get('kdNegara').value,
			"noSK": cloned.data.kode.noSK,
			"kdKelas": cloned.data.kode.kdKelas,
			"kdPaket": cloned.data.kode.kdPaket,
			"hargaNetto": cloned.data.hargaNetto,
			"hargaSatuan": cloned.data.hargaSatuan,
			"persenDiscount": cloned.data.persenDiscount,
			"hargaDiscount": cloned.data.hargaDiscount,
			"factorRate": cloned.data.factorRate,
			"operatorFactorRate": cloned.data.operatorFactorRate,
			"kdMataUang": cloned.data.kdMataUang,
			"statusEnabled": cloned.data.statusEnabled
		}
		console.log(fixHub);
		this.noSK = cloned.data.kode.noSK;
		this.versi = cloned.version;
		return fixHub;
	}

	onRowSelect(event) {
		this.disDropdown = false;
		let cloned = this.clone(event);
		console.log(event.data.hargaSatuan)
		if (event.data.hargaSatuan != null) {
			console.log("ISSSIIIII")
			this.hargaSatuan = false
		} else if (event.data.hargaSatuan == null) {
			this.hargaSatuan = true
			console.log("KOSSSOOONGGG")
		}
		if (event.data.persenHargaSatuan != null) {
			console.log("ISSSIIIII")
			this.disHargaSatuan = false
		} else if (event.data.persenHargaSatuan == null) {
			this.disHargaSatuan = true
			console.log("KOSSSOOONGGG")
		}
		console.log(event)
		this.formAktif = false;
		this.form.setValue(cloned);
		let data = {
			'value': cloned.noSK
		}
		this.getDataSK(data);
		this.persenDiscountChange(cloned.persenDiscount);
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

			let formSubmit = this.form.value;
			formSubmit.statusEnabled = true;
			// console.log(JSON.stringify(this.form.value));
			this.httpService.post(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/save', this.form.value).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
				// this.getDataGrid(this.page, this.rows, this.pencarian);
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
		this.httpService.update(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/update/'+ 1, this.form.value).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.getDataGrid(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	hapus() {
		this.httpService.delete(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/delete/' +
			this.form.get('noSK').value + '/' +
			this.form.get('kdPaket').value + '/' +
			this.form.get('kdKelas').value
		).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Dihapus');
			this.ngOnInit();
		})
		console.log(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/del/' +
			this.form.get('noSK').value + '/' +
			this.form.get('kdPaket').value + '/' +
			this.form.get('kdKelas').value
		)
	}

	confirmDelete() {                                                                                                                                                                                                                                                                                   
        if (this.formAktif == true) {                                                                                                                                                                                                                                                                                           
           this.alertService.warn('Peringatan', 'Pilih Daftar Harga Paket Pelayanan');                                                                                                                                                                                                                                                             
        } else {   
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

	getProfile() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(res => {
			this.form.get('kdNegara').setValue(res.profile.kdNegara);
		})
	}

	getSK() {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/getSK').subscribe(res => {
			this.listSKAll = res.SK;
			this.listSK = [];
			this.listSK.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.SK.length; i++) {
				this.listSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
			};
		})
	}

	getDataSK(val){
		let data = this.listSKAll;
		for (var i = 0; i < data.length; i++) {
			if(val.value == data[i].noSK){
				this.tglBerlakuAwal = data[i].tglBerlakuAwal == null ? '-' : this.changeDateFormat(data[i].tglBerlakuAwal);
				this.tglBerlakuAkhir = data[i].tglBerlakuAkhir == null ? '-' : this.changeDateFormat(data[i].tglBerlakuAkhir);
				this.noSKInternal = data[i].noSKIntern == null ? '-' : data[i].noSKInternal;
				this.form.get('noSK').setValue(data[i].noSK);
			}
		}
	}

	getPaket() {
		this.httpService.get(Configuration.get().dataMasterNew + '/paket/findAllData').subscribe(res => {
			this.listPaket = [];
			this.listPaket.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.paket.length; i++) {
				this.listPaket.push({ label: res.paket[i].namaPaket, value: res.paket[i].kode.kode })
			};
		})
	}

	getKelas() {
		this.httpService.get(Configuration.get().dataMasterNew + '/hargaPaketPelayanan/getKelasPelayanan').subscribe(res => {
			this.listKelas = [];
			this.listKelas.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.kelas.length; i++) {
				this.listKelas.push({ label: res.kelas[i].namaKelas, value: res.kelas[i].kode.kode })
			};
		})
	}

	getMataUang() {
		this.httpService.get(Configuration.get().dataMasterNew + '/matauang/findAllMataUang').subscribe(res => {
			console.log(res);
			this.listMataUang = [];
			this.listMataUang.push({ label: '-- Pilih --', value: '' })
			for (var i = 0; i < res.MataUang.length; i++) {
				this.listMataUang.push({ label: res.MataUang[i].namaMataUang, value: res.MataUang[i].kode.kode })
			};
		})
	}

	getOperator(){
		this.listOperatorFactorRate = [];
        this.listOperatorFactorRate.push({ label: '--Pilih Operator Faktor Rate--', value: '' });
        this.listOperatorFactorRate.push({ label: "+", value: '+' });
        this.listOperatorFactorRate.push({ label: "-", value: '-' });
        this.listOperatorFactorRate.push({ label: "X", value: 'X' });
        this.listOperatorFactorRate.push({ label: "/", value: '/' });
	}
	
	onDestroy() {

	}

	setRupiah(value: number) {
		if(value != null){
			return value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		}
	}

	hrgSatuanChange(event) {
		if (event == null) {
			this.hargaSatuan = true
		} else if (event != null) {
			this.hargaSatuan = false
			this.dispersenDiscount = true
			this.dishargaDiscount = true
			this.form.get('persenDiscount').setValue(null)
			this.form.get('hargaDiscount').setValue(null)
		}
	}

	persenDiscountChange(event) {
		if (event == null) {
			this.dispersenDiscount = true
			this.dishargaDiscount = true
		} else {
			this.dispersenDiscount = true
			this.dishargaDiscount = false
			this.form.get('hargaDiscount').setValue(null)
		}
	}

	hrgDiskonChange(event) {
		if (event == null) {
			this.dispersenDiscount = true
			this.dishargaDiscount = true
		} else {
			this.dispersenDiscount = false
			this.dishargaDiscount = true
			this.form.get('persenDiscount').setValue(null)
		}
	}

	reset() {
		this.formAktif = true;
		this.ngOnInit();
	}

	setReportDisplay() {
		this.form.get('reportDisplay').setValue(this.form.get('namaPelayananProfile').value)
	}
	//hapus filtering dropdown
	clearFilter(da: any, db: any, dc: any, dd: any, de: any){
		da.filterValue = '';
		db.filterValue = '';
		dc.filterValue = '';
		dd.filterValue = '';
		de.filterValue = '';
	}
}