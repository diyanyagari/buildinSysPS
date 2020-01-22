import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { Configuration, AlertService, InfoService, FileService, AuthGuard, ReportService } from '../../../global';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";

@Component({
	selector: 'app-profile-sk-harga-poin',
	templateUrl: './profile-sk-harga-poin.component.html',
	styleUrls: ['./profile-sk-harga-poin.component.scss'],
	providers: [ConfirmationService, DatePipe]
})
export class ProfileSkHargaPoinComponent implements OnInit {

	listNamaSk : any[];
	listPangkat : any[];
	listGolonganPegawai : any[];
	listKategoriPegawai : any[];
	listDataInput : any[];
	listData : any[];
	listMataUang: any[];
	listOperatorFactorRate: any[];

	selectedKomponenHarga: any[];
	totalRecordsInput: number;

	selected: any[];
	totalRecords: number;

	formAktif: boolean;
	page: number;
	rows: number;
	pencarian: string='';

	form: FormGroup;

	items: any[];
	kdprof: any;
	kddept: any;

	tanggalAwal: any;
	tanggalAkhir: any;
	dataSKHargaPoin: any[];
	laporan: boolean = false;

	//grid
	listNamaSKGrid: any[];
	smbrFile:any;

	constructor(
		private alertService: AlertService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
		private datePipe: DatePipe,
		private route: Router,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;
	}

	ngOnInit() {		
		this.kdprof = this.authGuard.getUserDto().kdProfile;
		this.kddept = this.authGuard.getUserDto().kdDepartemen;
		this.formAktif = true;
		this.form = this.fb.group({
			'namaSK' : new FormControl(null, Validators.required),
			'noSK' : new FormControl(null),
			'kdPangkat' : new FormControl(null, Validators.required),
			'kdGolonganPegawai' : new FormControl(null, Validators.required),
			'kdKategoryPegawai' : new FormControl(null, Validators.required),
			'tanggalAwal': new FormControl({value: '', disabled:true}),
			'tanggalAkhir': new FormControl({value: '', disabled:true}),
		});

		this.getDataGrid(this.page, this.rows);
		this.get();

		this.items = [
		{
			label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
				this.downloadPdf();
			}
		},
		{
			label: 'Exel', icon: 'fa-file-excel-o', command: () => {
				this.downloadExel();
			}
		}];

		// this.selectedKomponenHarga = [];
		this.listDataInput = [];
		this.getSmbrFile();

	}

	getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
	}

	downloadPdf(){
		let cetak = Configuration.get().report + '/profileSKHargaPoin/laporanProfileSKHargaPoin.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
    	window.open(cetak);
	}

	downloadExel(){

	}

	cetak(){
		this.laporan = true;
    	this.print.showEmbedPDFReport(Configuration.get().report + '/profileSKHargaPoin/laporanProfileSKHargaPoin.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmProfileSkHargaPoin_laporanCetak');	
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

	getDataGrid(page: number, rows: number){ 
		this.httpService.get(Configuration.get().dataMaster + '/profileskhargapoin/findAll?page='+page+'&rows='+rows+'&dir=id.noSK&sort=desc').subscribe(table => {
			this.listData = table.ProfileSKHargaPoin;
			this.totalRecords = table.totalRow;
		});

		// this.listNamaSKGrid = [];
		// this.httpService.get(Configuration.get().dataMaster+ '/profileskhargapoin/findAll?page='+page+'&rows='+rows).subscribe(res => {
		// 	for (let i=0; i<res.ProfileSKHargaPoin.length; i++){
		// 		this.listNamaSKGrid.push({label: res.ProfileSKHargaPoin[i].namaSK, value: res.ProfileSKHargaPoin[i].noSK})
		// 	};
		// });
	}

	cari() {
		this.httpService.get(Configuration.get().dataMasterNew + '/profileskhargapoin/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=id.noSK&sort=desc&noSK=' + this.pencarian).subscribe(table => {
			this.listData = table.ProfileSKHargaPoin;
			this.totalRecords = table.totalRow;
		});
	}

	get(){
		//namaSK
		this.httpService.get(Configuration.get().dataMaster+ '/profileskhargapoin/getSK').subscribe(res => {
			this.listNamaSk = [];
			this.listNamaSk.push({label: '--Pilih Nama SK--', value: null});
			for (let i=0; i<res.SK.length; i++){
				this.listNamaSk.push({label: res.SK[i].namaSK, value: res.SK[i].noSK})
			};
		});

		//pangkat
		this.httpService.get(Configuration.get().dataMaster+ '/service/list-generic?table=Pangkat&select=namaPangkat,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res =>{
			this.listPangkat=[];
			this.listPangkat.push({label: '--Pilih Pangkat--', value: null});
			for (let i=0; i<res.data.data.length; i++){
				this.listPangkat.push({label: res.data.data[i].namaPangkat, value: res.data.data[i].id_kode})
			};
		});

		//golonganpegawai
		this.httpService.get(Configuration.get().dataMaster+ '/service/list-generic?table=GolonganPegawai&select=namaGolonganPegawai,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res =>{
			this.listGolonganPegawai=[];
			this.listGolonganPegawai.push({label: '--Pilih Golongan Pegawai--', value: null});
			for (let i=0; i<res.data.data.length; i++){
				this.listGolonganPegawai.push({label: res.data.data[i].namaGolonganPegawai, value: res.data.data[i].id_kode})
			};
		});

		//kategoripegawai
		this.httpService.get(Configuration.get().dataMaster+ '/service/list-generic?table=KategoryPegawai&select=namaKategoryPegawai,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res =>{
			this.listKategoriPegawai=[];
			this.listKategoriPegawai.push({label: '--Pilih Kategori Pegawai--', value: null});
			for (let i=0; i<res.data.data.length; i++){
				this.listKategoriPegawai.push({label: res.data.data[i].namaKategoryPegawai, value: res.data.data[i].id_kode})
			};
		});

		//matauang
		this.httpService.get(Configuration.get().dataMaster+ '/service/list-generic?table=MataUang&select=namaMataUang,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res =>{
			this.listMataUang=[];
			this.listMataUang.push({label: '--Pilih Mata Uang--', value: null});
			for (let i=0; i<res.data.data.length; i++){
				this.listMataUang.push({label: res.data.data[i].namaMataUang, value: {kdMataUang: res.data.data[i].id_kode, namaMataUang: res.data.data[i].namaMataUang} })
			};
		});

		//operatorfactorrate
		this.listOperatorFactorRate = [];
		this.listOperatorFactorRate.push({ label: '--Pilih Operator--', value: '' });
		this.listOperatorFactorRate.push({ label: "+", value: { "kode": "+" } });
		this.listOperatorFactorRate.push({ label: "-", value: { "kode": "-" } });
		this.listOperatorFactorRate.push({ label: "x", value: { "kode": "x" } });
		this.listOperatorFactorRate.push({ label: "/", value: { "kode": "/" } });
	}

	ambilSK(event){
		let noSK = event.value;
		if (noSK =='' || noSK == null || noSK==undefined){
			this.form.get('noSK').setValue(null);
			this.form.get('tanggalAkhir').setValue(null);
			this.form.get('tanggalAwal').setValue(null);
		}
		else {
			this.httpService.get(Configuration.get().dataMaster + '/profileskhargapoin/getSK?noSK=' + noSK).subscribe(table => {
				let detailSK = table.SK;
				this.form.get('noSK').setValue(detailSK[0].noSK);
				this.form.get('tanggalAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));
				if (detailSK[0].tglBerlakuAkhir == "" || detailSK[0].tglBerlakuAkhir == null || detailSK[0].tglBerlakuAkhir == undefined){
					this.form.get('tanggalAkhir').setValue(null);
				}
				else {
					this.form.get('tanggalAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
				}
			});
		}
	}

	getKelompokTransaksi(){
		this.httpService.get(Configuration.get().dataMasterNew + 'aSJKHAsAKSJHkashA').subscribe(table => {
			let dataKelompokTransaksi = table.KelompokTransaksi;
			localStorage.setItem('kelompokTransaksi', JSON.stringify(dataKelompokTransaksi));
			this.route.navigate(['/master-sk/surat-keputusan']);
		});
	}

	valueChangeGetKomponen(event){
		let kdKategoryPegawai = event.value;
		this.httpService.get(Configuration.get().dataMaster + '/profileskhargapoin/getKomponen/'+ kdKategoryPegawai).subscribe(res => {
			this.listDataInput = [];
			this.totalRecordsInput = res.data.length;
			let listDataInput = [...this.listDataInput];
			for (let i=0; i<res.data.length; i++){
				let tempData = {
					"isCheck" : true,
					"kdKomponen": res.data[i].kode,
					"namaKomponen" : res.data[i].namaKomponen,
					"qtyPoin" : 1,
					"hargaSatuan" : 0,
					"mataUang" : {
						"kdMataUang": 1,
						"namaMataUang": "--Pilih Mata Uang--"
					},
					"factorRate" : null,
					"operatorFactorRate" : {
						"operatorFactorRate": "x",
						"kode": "x",
					}, 
					"statusAktif" : false,
					// "statusSelect": false
				}
				listDataInput.push(tempData);
			}
			this.listDataInput = listDataInput;
		});
	}

	getKomponen(event){
		let kdKategoryPegawai = event.data.kdKategoryPegawai;
		let noSK = event.data.noSK;
		let kdPangkat = event.data.kdPangkat;
		let kdGolonganPegawai = event.data.kdGolonganPegawai;
		this.httpService.get(Configuration.get().dataMaster + '/profileskhargapoin/findByKode/'+noSK+'/'+kdKategoryPegawai+'/'+kdGolonganPegawai+'/'+kdPangkat).subscribe(res => {
			this.listDataInput = [];
			this.totalRecordsInput = res.ProfileSKHargaPoin.length;
			let dataPanggil = [...this.listDataInput];
			for (let i=0; i<res.ProfileSKHargaPoin.length; i++){
				let tempData = {
					"isCheck" : true,
					"kdKomponen": res.ProfileSKHargaPoin[i].kdKomponenHarga,
					"namaKomponen" : res.ProfileSKHargaPoin[i].namaKomponen,
					"qtyPoin" : res.ProfileSKHargaPoin[i].qtyPoin,
					"hargaSatuan" : res.ProfileSKHargaPoin[i].hargaSatuan,
					"mataUang" : {
						"kdMataUang": res.ProfileSKHargaPoin[i].kdMataUang,
						"namaMataUang": res.ProfileSKHargaPoin[i].namaMataUang
					},
					"factorRate" : res.ProfileSKHargaPoin[i].factorRate,
					"operatorFactorRate" : {
						"operatorFactorRate": res.ProfileSKHargaPoin[i].operatorFactorRate,
						"kode": res.ProfileSKHargaPoin[i].operatorFactorRate,
					}, 
					"statusAktif" : res.ProfileSKHargaPoin[i].statusEnabled,
					// "statusSelect": false
				}
				dataPanggil.push(tempData);
			}
			this.listDataInput = dataPanggil;
		});
	}

	// onRowSelectInput(event){
	// 	let listDataInput = [...this.listDataInput];
	// 	for (let i=0 ;i<listDataInput.length;i++){
	// 		if (listDataInput[i].kdKomponen == event.data.kdKomponen) {
	// 			listDataInput[i].statusSelect = true;
	// 		}
	// 		else {				
	// 		}
	// 	}
	// 	this.listDataInput = listDataInput
	// }

	// onRowUnselectInput(event){
	// 	let listDataInput = [...this.listDataInput];
	// 	for (let i=0 ;i<listDataInput.length;i++){
	// 		if (listDataInput[i].kdKomponen == event.data.kdKomponen) {
	// 			listDataInput[i].statusSelect = false;
	// 		}
	// 	}
	// 	this.listDataInput = listDataInput
	// }

	// changeSelectedData(event, kode){
	// 	let dataTerpilih = [...this.selectedKomponenHarga]
	// 	for (let i=0; i<dataTerpilih.length; i++){
	// 		if (dataTerpilih[i].kode == kode) {
	// 			dataTerpilih[i].statusAktif = event
	// 		}
	// 	}
	// 	this.selectedKomponenHarga = dataTerpilih;
	// }

	// selectAll(event){
	// 	let listDataInput = [...this.listDataInput];
	// 	for (let i=0; i<listDataInput.length; i++){
	// 		if(event.data.kode != null) {
	// 			listDataInput[i].statusSelect = true;
	// 		}
	// 		else {

	// 		}
	// 	}
	// 	this.listDataInput = listDataInput;
	// }

	loadPage(event: LazyLoadEvent) {
		this.getDataGrid((event.rows + event.first) / event.rows, event.rows);
		this.page = (event.rows + event.first) / event.rows;
		this.rows = event.rows;
        // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
    }

    onSubmit() {
    	if (this.form.invalid) {
    		this.validateAllFormFields(this.form);
    		this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    	} else {
    		this.simpan();
    	}
    }

    simpan(){
    	if (this.formAktif == false) {
    		this.confirmUpdate()
    	} else {
    		let detail = [];
		// let selectedKomponenHarga = this.selectedKomponenHarga;
		let error = 0;
		let listDataInput = this.listDataInput;
		for (let i=0; i<listDataInput.length; i++){
			let a = listDataInput[i].mataUang.kdMataUang;
			if (listDataInput[i].statusAktif == true){
				let dataTemp = {
					"factorRate": listDataInput[i].factorRate,
					"hargaSatuan": listDataInput[i].hargaSatuan,
					"kdKomponenHarga": listDataInput[i].kdKomponen,
					"kdMataUang": a,
					"operatorFactorRate": listDataInput[i].operatorFactorRate.operatorFactorRate,
					"qtyPoin": listDataInput[i].qtyPoin,
					"statusEnabled": listDataInput[i].statusAktif
				}

				if (listDataInput[i].qtyPoin == null || listDataInput[i].hargaSatuan == null || a == null || listDataInput[i].factorRate == null || listDataInput[i].operatorFactorRate.operatorFactorRate == null){
					error = error+1;
				}
				detail.push(dataTemp)
			}
		}

		// for (let i=0; i<selectedKomponenHarga.length; i++){
		// 	let dataTemp = {
		// 		// sdkasdlkajsdklajd samain sama json simpan
		// 	}
		// 	if (selectedKomponenHarga[i].qtyPoin == null || selectedKomponenHarga[i].hargaSatuan == null || selectedKomponenHarga[i].kdMataUang == null || selectedKomponenHarga[i].factorRate == null || selectedKomponenHarga[i].operatorFactorRate == null || selectedKomponenHarga[i].statusAktif == null){
		// 		error = error +1;
		// 	}
		// 	profileSkHargaPoin.push(dataTemp);
		// }

		if(error != 0){
			this.alertService.warn('Peringatan', 'Lengkapi Data Komponen Harga');
		}
		else {
			let dataSimpan = {
				"detail" : detail,
				"kdGolonganPegawai" : this.form.get('kdGolonganPegawai').value,
				"kdKategoryPegawai" : this.form.get('kdKategoryPegawai').value,
				"kdPangkat": this.form.get('kdPangkat').value,
				"noSK" : this.form.get('noSK').value
			}

			this.httpService.post(Configuration.get().dataMaster + '/profileskhargapoin/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil','Data Disimpan');
				this.getDataGrid(this.page, this.rows);
				this.reset();
			})
		}
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

update(){
	let detail = [];
		// let selectedKomponenHarga = this.selectedKomponenHarga;
		let error = 0;
		let listDataInput = this.listDataInput;
		for (let i=0; i<listDataInput.length; i++){
			let a = listDataInput[i].mataUang.kdMataUang;
			if (listDataInput[i].statusAktif == true){
				let dataTemp = {
					"factorRate": listDataInput[i].factorRate,
					"hargaSatuan": listDataInput[i].hargaSatuan,
					"kdKomponenHarga": listDataInput[i].kdKomponen,
					"kdMataUang": a,
					"operatorFactorRate": listDataInput[i].operatorFactorRate.kode,
					"qtyPoin": listDataInput[i].qtyPoin,
					"statusEnabled": listDataInput[i].statusAktif
				}

				if (listDataInput[i].qtyPoin == null || listDataInput[i].hargaSatuan == null || a == null || listDataInput[i].factorRate == null || listDataInput[i].operatorFactorRate == null){
					error = error+1;
				}
				detail.push(dataTemp)
			}
		}

		if(error != 0){
			this.alertService.warn('Peringatan', 'Lengkapi Data Komponen Harga');
		}
		else {
			let dataSimpan = {
				"detail" : detail,
				"kdGolonganPegawai" : this.form.get('kdGolonganPegawai').value,
				"kdKategoryPegawai" : this.form.get('kdKategoryPegawai').value,
				"kdPangkat": this.form.get('kdPangkat').value,
				"noSK" : this.form.get('noSK').value
			}

			this.httpService.post(Configuration.get().dataMaster + '/profileskhargapoin/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil','Data Disimpan');
				this.getDataGrid(this.page, this.rows);
				this.reset();
			})
		}
	}

	reset(){
		this.formAktif = true;
		this.form.get('kdKategoryPegawai').enable();
		this.form.get('kdGolonganPegawai').enable();
		this.form.get('kdPangkat').enable();
		this.form.get('namaSK').enable();
		this.ngOnInit();
	}

	onRowSelect(event){
		this.dataSKHargaPoin = [];
		this.dataSKHargaPoin.push({namaSK: event.data.namaSK, noSK: event.data.noSK, tglBerlakuAwal: event.data.tglBerlakuAwal, tglBerlakuAkhir: event.data.tglBerlakuAkhir});
		this.formAktif = false;
		
		this.getKomponen(event);
		this.form.get('kdKategoryPegawai').disable();
		this.form.get('kdGolonganPegawai').disable();
		this.form.get('kdPangkat').disable();
		this.form.get('namaSK').disable();

		this.form.get('kdPangkat').setValue(event.data.kdPangkat);
		this.form.get('kdGolonganPegawai').setValue(event.data.kdGolonganPegawai);
		this.form.get('kdKategoryPegawai').setValue(event.data.kdKategoryPegawai);
		this.form.get('namaSK').setValue(event.data.noSK);
		this.form.get('noSK').setValue(event.data.noSK);


		this.form.get('tanggalAwal').setValue(new Date(event.data.tglBerlakuAwal * 1000));
		if (event.data.tglBerlakuAkhir == null){
			this.form.get('tanggalAkhir').setValue(null)
		}
		else {
			this.form.get('tanggalAkhir').setValue(new Date(event.data.tglBerlakuAkhir * 1000));
		}

	}

	confirmDelete() {
		let namaSK = this.form.get('namaSK').value;
		if (namaSK == null || namaSK == undefined || namaSK == "") {
			this.alertService.warn('Peringatan', 'Pilih Daftar Master Pegawai SK Harga Poin');
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

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/profileskhargapoin/del/'+deleteItem.noSK+'/'+deleteItem.kdKategoryPegawai+'/'+deleteItem.kdGolonganPegawai+'/'+deleteItem.kdPangkat).subscribe(response => {
		},
		error => {
			this.alertService.error('Kesalahan', error + ' Periksa koneksi Ke Server');
		},
		() => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.reset();
		});

	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}

}
