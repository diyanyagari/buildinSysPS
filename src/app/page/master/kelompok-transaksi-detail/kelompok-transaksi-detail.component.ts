import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
	selector: 'app-kelompok-transaksi-detail',
	templateUrl: './kelompok-transaksi-detail.component.html',
	styleUrls: ['./kelompok-transaksi-detail.component.scss'],
	providers: [ConfirmationService]
})
export class KelompokTransaksiDetailComponent implements OnInit {
	selected: any;
	listData: any[];
	dataDummy: {};
	pencarian: string;
	versi: any;
	formAktif: boolean;
	form: FormGroup;
	items: any;
	page: number;
	rows: number;
	totalRecords: number;
	report: any;
	toReport: any;
	isCostInOut: number;
	isCost: boolean;
	listStrukturNomor: any[];
	Detail: any[];

	codes: any[];

	kdprof: any;
	kddept: any;
	laporan: boolean = false;

	listKelompokTransaksi: any[];
	selectedKelompokTransaksi: any[];
	hasilCek: any;
	smbrFile:any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService,
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
			'kdKelompokTransaksi': new FormControl('', Validators.required),
			'reportDisplay': new FormControl(''),
			'namaExternal': new FormControl(''),
			'kodeExternal': new FormControl(''),
			'statusEnabled': new FormControl('', Validators.required),
			'kdStrukturNomor': new FormControl(null),
			'isRealSK': new FormControl(0),
			'isCostInOut': new FormControl(null),
			'qtyHariMinPostingBefore': new FormControl(null),
			'qtyJamMaxPostingBefore': new FormControl(null),
			'qtyHariActiveAfterSK': new FormControl(null),
			'qtyHariMinNewPosting': new FormControl(null),
			'qtyHariMaxPostingExpired': new FormControl(null),
			'qtyJamMaxPostingExpired': new FormControl(null),
			'cekBoxBlok': new FormControl(null)
		});


		this.selectedKelompokTransaksi = [];
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=StrukturNomor&select=namaStrukturNomor,%20id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listStrukturNomor = [];
			this.listStrukturNomor.push({ label: '--Pilih Struktur Nomor--', value: null})
			for (var i = 0; i < res.data.data.length; i++) {
				this.listStrukturNomor.push({ label: res.data.data[i].namaStrukturNomor, value: res.data.data[i].id_kode })
			};
		});

		this.httpService.get(Configuration.get().dataMaster + '/kelompoktransaksidetail/findKelTransaksi').subscribe(res => {
			this.listKelompokTransaksi = [];
			// this.listKelompokTransaksi.push({ label: '--Pilih Kelompok Transaksi--', value: null})
			for (var i = 0; i < res.data.length; i++) {
				this.listKelompokTransaksi.push({ label: res.data[i].namaKelompokTransaksi, value: res.data[i].kdKelompokTransaksi })
			};
		});
		this.hasilCek = true;

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
		let cetak = Configuration.get().report + '/kelompokTransaksiDetail/laporanKelompokTransaksiDetail.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
   		window.open(cetak);
	}

	cetak() {
		this.laporan = true;
		this.print.showEmbedPDFReport(Configuration.get().report + '/kelompokTransaksiDetail/laporanKelompokTransaksiDetail.pdf?kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmKelompokTransaksiDetail_laporanCetak');
        // let b = Configuration.get().report + '/kelompokTransaksi/laporanKelompokTransaksi.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&download=false';
        // window.open(b);
    }

    tutupLaporan() {
    	this.laporan = false;
    }

    get(page: number, rows: number, search: any) { 
    	this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksidetail/findAll?page=' + page + '&rows=' + rows+'&dir=kelompokTransaksi.namaKelompokTransaksi&sort=desc').subscribe(table => {
    		// this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page=' + page + '&rows=' + rows+'&dir=namaKelompokTransaksi&sort=desc').subscribe(table => {
    			this.listData = table.KelompokTransaksiDetail;
    			// this.listData = table.kelompokTransaksi;
    			this.totalRecords = table.totalRow;
    		});
    	}

    	cari() {
    		this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksidetail/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=kelompokTransaksi.namaKelompokTransaksi&sort=desc&namaKelompokTransaksi=' + this.pencarian).subscribe(table => {
    			this.listData = table.KelompokTransaksiDetail;
    		});
    	}

    	loadPage(event: LazyLoadEvent) {
    		this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    		this.page = (event.rows + event.first) / event.rows;
    		this.rows = event.rows;
    	}


    	confirmDelete() {
    		let kdKelompokTransaksi = this.form.get('kdKelompokTransaksi').value;
    		if (kdKelompokTransaksi == null || kdKelompokTransaksi == undefined || kdKelompokTransaksi == "") {
    			this.alertService.warn('Peringatan', 'Pilih Daftar Master Kelompok Transaksi');
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
		// if(this.form.get('isCostInOut').value == null || this.form.get('isCostInOut').value == undefined || this.form.get('isCostInOut').value == false) {
		// 	this.isCostInOut = 0;
		// } else {
		// 	this.isCostInOut = 1;
		// }
		// let formSubmit = this.form.value;
		// formSubmit.isCostInOut = this.isCostInOut;
		let isRealSK;
		if (this.form.get('isRealSK').value == true){
			isRealSK = 1;
			if (this.form.get('kdStrukturNomor').value == null){
				this.alertService.warn('Peringatan','Isi Struktur Nomor')
			}
		}
		else {
			isRealSK = 0;
		}

		let kdKelompokTransaksi = this.form.get('kdKelompokTransaksi').value[0];

		let dataSimpan = {
			"kdKelompokTransaksi" : [{kode: kdKelompokTransaksi}],
			"kodeExternal": this.form.get('kodeExternal').value,
			"namaExternal":this.form.get('namaExternal').value,
			"reportDisplay": this.form.get('reportDisplay').value,
			"statusEnabled": this.form.get('statusEnabled').value,

			"kdStrukturNomor": this.form.get('kdStrukturNomor').value,
			"isRealSK": isRealSK,
			"isCostInOut": this.form.get('isCostInOut').value,
			"qtyHariMinPostingBefore": this.form.get('qtyHariMinPostingBefore').value,
			"qtyJamMaxPostingBefore": this.form.get('qtyJamMaxPostingBefore').value,
			"qtyHariActiveAfterSK": this.form.get('qtyHariActiveAfterSK').value,
			"qtyHariMinNewPosting": this.form.get('qtyHariMinNewPosting').value,
			"qtyHariMaxPostingExpired": this.form.get('qtyHariMaxPostingExpired').value,
			"qtyJamMaxPostingExpired": this.form.get('qtyJamMaxPostingExpired').value,
		}

		this.httpService.post(Configuration.get().dataMasterNew + '/kelompoktransaksidetail/save', dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.get(this.page, this.rows, this.pencarian);
			this.reset();
		});
	}

	simpan() {
		if (this.formAktif == false) {
			this.confirmUpdate()
		} else {
			// if(this.form.get('isCostInOut').value == null || this.form.get('isCostInOut').value == undefined || this.form.get('isCostInOut').value == false) {
			// 	this.isCostInOut = 0;
			// } else {
			// 	this.isCostInOut = 1;
			// }
			// let formSubmit = this.form.value;
			// formSubmit.isCostInOut = this.isCostInOut;
			let isRealSK;
			if (this.form.get('isRealSK').value == true){
				isRealSK = 1;
				if (this.form.get('kdStrukturNomor').value == null){
					this.alertService.warn('Peringatan','Isi Struktur Nomor')
				}
			}
			else {
				isRealSK = 0;
			}

			let kdKelompokTransaksi = [];


			for (let i = 0; i < this.selectedKelompokTransaksi.length; i++) {
				kdKelompokTransaksi.push({
					"kode": this.selectedKelompokTransaksi[i],
				})
			}

			let dataSimpan = {
				"kdKelompokTransaksi" : kdKelompokTransaksi,
				"kodeExternal": this.form.get('kodeExternal').value,
				"namaExternal":this.form.get('namaExternal').value,
				"reportDisplay": this.form.get('reportDisplay').value,
				"statusEnabled": this.form.get('statusEnabled').value,

				"kdStrukturNomor": this.form.get('kdStrukturNomor').value,
				"isRealSK": isRealSK,
				"isCostInOut": this.form.get('isCostInOut').value,
				"qtyHariMinPostingBefore": this.form.get('qtyHariMinPostingBefore').value,
				"qtyJamMaxPostingBefore": this.form.get('qtyJamMaxPostingBefore').value,
				"qtyHariActiveAfterSK": this.form.get('qtyHariActiveAfterSK').value,
				"qtyHariMinNewPosting": this.form.get('qtyHariMinNewPosting').value,
				"qtyHariMaxPostingExpired": this.form.get('qtyHariMaxPostingExpired').value,
				"qtyJamMaxPostingExpired": this.form.get('qtyJamMaxPostingExpired').value,
			}

			this.httpService.post(Configuration.get().dataMasterNew + '/kelompoktransaksidetail/save', dataSimpan).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				this.get(this.page, this.rows, this.pencarian);
				this.reset();
			});
		}

	}

	reset() {
		// this.form.get('namaKelompokTransaksi').enable();
		this.hasilCek = true;
		this.formAktif = true;
		this.form.get('kdKelompokTransaksi').enable();
		this.form.get('isCostInOut').setValue(null);
		this.ngOnInit();
	}

	onRowSelect(event) {
		this.hasilCek = false;
		// if (event.data.isCostInOut == 1) {
		// 	this.isCost = true;
		// 	this.isCostInOut = 1;
		// } else {
		// 	this.isCost = false;
		// 	this.isCostInOut = 0;
		// }
		// let cloned = this.clone(event.data);
		this.formAktif = false;

		/*this.selectedKelompokTransaksi = [{
			label: event.data.namaKelompokTransaksi,
			value: event.data.kdKelompokTransaksi
		}];*/

		let isRealSK;
		if (event.data.isRealSK == 1){
			isRealSK = true;
		}
		else {
			isRealSK = false;
		}

		this.form.get('kdKelompokTransaksi').setValue([event.data.kdKelompokTransaksi]);
		this.form.get('statusEnabled').setValue(event.data.statusEnabled);
		this.form.get('isRealSK').setValue(isRealSK);
		this.form.get('kdStrukturNomor').setValue(event.data.kdStrukturNomor);
		this.form.get('isCostInOut').setValue(event.data.isCostInOut);
		this.form.get('qtyHariMinPostingBefore').setValue(event.data.qtyHariMinPostingBefore);
		this.form.get('qtyJamMaxPostingBefore').setValue(event.data.qtyJamMaxPostingBefore);
		this.form.get('qtyHariActiveAfterSK').setValue(event.data.qtyHariActiveAfterSK);
		this.form.get('qtyHariMinNewPosting').setValue(event.data.qtyHariMinNewPosting);
		this.form.get('qtyHariMaxPostingExpired').setValue(event.data.qtyHariMaxPostingExpired);
		this.form.get('qtyJamMaxPostingExpired').setValue(event.data.qtyJamMaxPostingExpired);

		this.form.get('kdKelompokTransaksi').disable();
	}

	clone(hub: any) {
		let	fixHub = {

			'kdKelompokTransaksi': hub.kdKelompokTransaksi, 
			'reportDisplay': hub.reportDisplay, 
			'namaExternal': hub.namaExternal,
			'kodeExternal': hub.kodeExternal, 
			'statusEnabled': hub.statusEnabled,
			'kdStrukturNomor': hub.kdStrukturNomor, 
			'isRealSK': hub.isRealSK, 
			'isCostInOut': hub.isCostInOut, 
			'qtyHariMinPostingBefore': hub.qtyHariMinPostingBefore, 
			'qtyJamMaxPostingBefore': hub.qtyJamMaxPostingBefore, 
			'qtyHariActiveAfterSK': hub.qtyHariActiveAfterSK, 
			'qtyHariMinNewPosting': hub.qtyHariMinNewPosting, 
			'qtyHariMaxPostingExpired': hub.qtyHariMaxPostingExpired, 
			'qtyJamMaxPostingExpired': hub.qtyJamMaxPostingExpired,
		}
		this.versi = hub.version;
		return fixHub;
	}

	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/kelompoktransaksidetail/del/' + deleteItem.kdKelompokTransaksi).subscribe(response => {
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

	bukaTutup(event){
		if(event == true){
			this.hasilCek = false;
		}else{
			this.hasilCek = true;
		}
	}






}

