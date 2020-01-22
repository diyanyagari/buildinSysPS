import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-daftar-monitoring-pengajuan-kpi-pegawai',
  templateUrl: './daftar-monitoring-pengajuan-kpi-pegawai.component.html',
	styleUrls: ['./daftar-monitoring-pengajuan-kpi-pegawai.component.scss'],
	providers: [ConfirmationService]
})
export class DaftarMonitoringPengajuanKpiPegawaiComponent implements OnInit {

  	page:number;
  	rows:number;
  	totalRecords: number;
  	listPeriodeHead:any[];
  	kodeHeadPeriode:any;
  	listPeriode:any[];
  	selectedPeriode:any;
  	listMonitoringPengajuanKpiPegawai:any[];
  	selectedMPK:any;
  	buttonAktif:boolean;
  	dialogDetailNoVerifikasi: boolean;
  	dialogDetailKpi:boolean;
	dialogKeputusan:boolean;
	formKeputusan: any;
	dataNoVerifikasi: any[];
	approved: any;
	totalApprove: any;
	tanggalAwal: any;
	tanggalAkhir: any;
	listKeputusan:any[];
	formSk: any;
	minDate: any;
	minDateAwal: any;
	listDataBsc: any[];
	selectedDataBsc: any[];
	provide:any;
	KeteranganAlasanDisetujui:any;
	kdkeputusanKeteranganAlasan:any;
	checkboxAktifCek: boolean;
	cekOtomatis:boolean;
	buttonAktifCek: boolean;
	buttonAktifSkTersedia: boolean;
	dataDetailKPI:any[];
	items:any;
	userData:any;
	noPosting:any;
	kdJenisKeputusan: any;
	generatesk: any;
	expired: any;
	tglExpired: any;
	noSk: any;
	listJenisKeputusan: any[];
	listMetodePerhitungan: any[];
	
	
  constructor(
    private httpService: HttpClient,
		private alertService: AlertService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
		@Inject(forwardRef(() => ReportService)) private print: ReportService
  ) { }

  ngOnInit() {
    //this.dialogDetailNoVerifikasi = true;
		//this.dialogDetailKpi = true;
		//this.dialogKeputusan = true;

		this.items = [
			{
				label: 'Cetak semua', command: () => {
					//this.cetakSemua();
				}
			},
			{
				label: 'Cetak pilih', command: () => {
					//this.cetakPilih();
				}
			},
		];

    if (this.page == undefined || this.rows == undefined) {
			this.page = Configuration.get().page;
			this.rows = Configuration.get().rows;
		}
		this.selectedDataBsc = [];
		this.expired = false;
		this.buttonAktifSkTersedia = false;
		this.buttonAktifCek = true;
		this.checkboxAktifCek = true;
		this.provide = false;
		this.buttonAktif = true;
		this.cekOtomatis = true;
		let today = new Date();
		today.setDate(today.getDate());
		let month = today.getMonth();
		let year = today.getFullYear();
		this.minDate = new Date();
		this.minDate.setDate(this.minDate.getDate());
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
		this.minDateAwal = new Date();
		this.minDateAwal.setDate(this.minDateAwal.getDate());
		this.minDateAwal.setMonth(month);
		this.minDateAwal.setFullYear(year);

		this.formKeputusan = this.fb.group({
			'noPengajuan': new FormControl({ value: '', disabled: true }),
			'namaPegawai': new FormControl({ value: '', disabled: true }),
			'nik': new FormControl({ value: '', disabled: true }),
			'jenisKelamin': new FormControl({ value: '', disabled: true }),
			'jenisPegawai': new FormControl({ value: '', disabled: true }),
			'jabatan': new FormControl({ value: '', disabled: true }),
			'unitKerja': new FormControl({ value: '', disabled: true }),
			'tanggalVerifikasi': new FormControl(new Date(), Validators.required),
			'metodePerhitungan': new FormControl(null,Validators.required),
			'keputusan': new FormControl('', Validators.required),
			'catatan': new FormControl(null)
		});

		this.formSk = this.fb.group({
			'noSk': new FormControl({ value: '', disabled: true }),
			'namaSk': new FormControl({ value: '', disabled: true }),
			'jenisKeputusan': new FormControl({ value: '', disabled: false }, Validators.required),
			'periodeAwalSk': new FormControl(today, Validators.required),
			'periodeAkhirSk': new FormControl(today, Validators.required),
			'noSkTerakhir': new FormControl({ value: '', disabled: true }),
			'noSkSekarang': new FormControl({ value: null, disabled: true }),
			'cekOtomatis': new FormControl(true),
		});

	this.getPeriodeHead(this.page,this.rows);
	

	//ambil data list jenis keputusan di buat sk
	this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisKeputusan&select=namaJenisKeputusan,id.kode,isGenerateSK&page=1&rows=1000&condition=and&profile=y').subscribe(table => {
		this.listJenisKeputusan = [];
		this.listJenisKeputusan.push({ label: '--Pilih Jenis Keputusan--', value: '' })
		for (var i = 0; i < table.data.data.length; i++) {
			this.listJenisKeputusan.push({ label: table.data.data[i].namaJenisKeputusan, value: { kode: table.data.data[i].id_kode, isGenerateSK: table.data.data[i].isGenerateSK } })
		};
	});

	//ambil list keputusan yang di dialog keputusan dropdownnya
	this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findKeteranganAlasanApproval').subscribe(table => {
		this.listKeputusan = [];
		this.listKeputusan.push({ label: '--Pilih Keputusan--', value: '' })
		for (var i = 0; i < table.data.ketaranganAlasan.length; i++) {
			this.listKeputusan.push({ label: table.data.ketaranganAlasan[i].namaKeteranganAlasan, value: table.data.ketaranganAlasan[i].kdKeteranganAlasan })
		};
	});

	this.httpService.get(Configuration.get().dataMaster + "/keteranganalasan/findKeteranganAlasanDisetujui").subscribe(result => {
		this.KeteranganAlasanDisetujui = result.kode.kode;
	});

	//ambil list metode perhitungan
	this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findkdMetodeHitungActualKPI').subscribe(table => {
		this.listMetodePerhitungan = [];
		this.listMetodePerhitungan.push({ label: '--Pilih Metode Perhitungan Actual--', value: '' })
		for (var i = 0; i < table.data.length; i++) {
			this.listMetodePerhitungan.push({ label: table.data[i].namaMetodeHitung, value: table.data[i].kode.kode })
		};
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

  getGridKeputusan(){

	this.httpService.get(Configuration.get().dataBSC + '/pegawaipostingkpi/findByKdProfileAndNoPosting/' + this.noPosting).subscribe(table => {
		this.listDataBsc = table.PegawaiPostingKPI;
	});

  }


  getPeriodeHead(page: number, rows: number) {

		//ambil periode head
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByKomponen').subscribe(res => {
			this.listPeriodeHead = [];
			this.listPeriodeHead.push({ label: '-- Pilih Periode --', value: null })
			for (var i = 0; i < res.data.listPeriode.length; i++) {
				this.listPeriodeHead.push({ label: res.data.listPeriode[i].namaPeriode, value: res.data.listPeriode[i].kdPeriode })
			};
		});

  }
  
  getKode(event){
		this.listPeriode = [];
		let periodeKePilih = event.value;
		if(periodeKePilih != null){
			this.ambilPeriodeAnak(periodeKePilih);
		}else if(periodeKePilih == null){
			this.listMonitoringPengajuanKpiPegawai = [];
		}
    
  }

  ambilPeriodeAnak(kdPeriode) {
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymap/findPeriodeByHead?kdPeriode=' + kdPeriode).subscribe(res => {
			let data = [];
			for (var i = 0; i < res.data.periodeHead.length; i++) {
				data[i] = {
					"nomorUrut": i + 1,
					"noHistori": res.data.periodeHead[i].noHistori,
					"qtyTahun": res.data.periodeHead[i].qtyTahun,
					"tglCutOffAkhir": res.data.periodeHead[i].tglCutOffAkhir,
					"tglAwalPeriode": res.data.periodeHead[i].tglAwalPeriode,
					"tglAkhirPeriode": res.data.periodeHead[i].tglAkhirPeriode,
					"tahun": res.data.periodeHead[i].tahun,
					"namaPeriodeHead": res.data.periodeHead[i].namaPeriodeHead,
					"tglHistori": res.data.periodeHead[i].tglHistori,
					"namaPeriode": res.data.periodeHead[i].namaPeriode,
					"kdDepartemen": res.data.periodeHead[i].kdDepartemen,
					"version": res.data.periodeHead[i].version,
					"noRec": res.data.periodeHead[i].noRec,
					"statusEnabled": res.data.periodeHead[i].statusEnabled,
					"namaExternal": res.data.periodeHead[i].namaExternal,
					"kdPeriodeHead": res.data.periodeHead[i].kdPeriodeHead,
					"tglCutOffAwal": res.data.periodeHead[i].tglCutOffAwal,
					"namaDepartemen": res.data.periodeHead[i].namaDepartemen,
					"qtyMinggu": res.data.periodeHead[i].qtyMinggu,
					"kode": {
						"kdProfile": res.data.periodeHead[i].kdProfile,
						"kode": res.data.periodeHead[i].kode
					},
					"reportDisplay": res.data.periodeHead[i].reportDisplay,
					"qtyBulan": res.data.periodeHead[i].qtyBulan,
					"qtyHari": res.data.periodeHead[i].qtyHari,
					"kodeExternal": res.data.periodeHead[i].kodeExternal,
					"bulan": res.data.periodeHead[i].bulan,
					"kdKelompokTransaksi": res.data.periodeHead[i].kdKelompokTransaksi
				}
			};
			this.listPeriode = data;
		});
  }
  
  pilihPeriode(event){
	this.selectedMPK = "";
	this.buttonAktif = true;
    let tglAwalPeriode = event.data.tglAwalPeriode;
		let tglAkhirPeriode = event.data.tglAkhirPeriode;
		//ambil data monitoring dari periode tahun yang dipilih
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findAllByApproval?page='+this.page+'&rows='+this.rows+'&dir=noPosting&sort=desc&periodeAwal='+tglAwalPeriode+'&periodeAhir='+tglAkhirPeriode).subscribe(table => {
			this.listMonitoringPengajuanKpiPegawai = table.data.data;
			this.totalRecords = table.data.totalRow;
		});
	}
	
	detailKpiPegawai(noPosting:any){
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findByKdProfileAndNoPostingForDetail/' + noPosting).subscribe(table => {
			this.dataDetailKPI = table.PegawaiPostingKPI;
		});
		this.dialogDetailKpi = true;
	}

	detailNoVerifikasi(noPosting:any){
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findVerifikasiByNoPlanning?noPlanning=' + noPosting).subscribe(table => {
			this.dataNoVerifikasi = table.data.data;
			this.approved = table.data.approved;
			this.totalApprove = table.data.totalApprove;
		});
		this.dialogDetailNoVerifikasi = true;
	}

	loadPage(event: LazyLoadEvent) {
		// let awal = this.setTimeStamp(this.tanggalAwal);
		// let akhir = this.setTimeStamp(this.tanggalAkhir);
		// this.getDataGrid((event.rows + event.first) / event.rows, event.rows, awal, akhir);
	}

	setTimeStamp(date) {
		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}

	}

	isGenerateSK(event) {
		let gen = event.value.isGenerateSK;
		this.generatesk = gen;

		if (gen == 1) {
			this.checkboxAktifCek = false;
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Bsc_kpi).subscribe(table => {
				this.formSk.get('noSkTerakhir').setValue(table.noSKIntern);
			});
		}
		else {
			this.checkboxAktifCek = true;
			this.formSk.get('cekOtomatis').setValue(true);
			this.formSk.get('noSkTerakhir').setValue('');
			this.formSk.get('noSkSekarang').disable();
			this.formSk.get('noSkSekarang').setValue(null);
		}
	}


	selectKeputusanKeteranganAlasan(event){
		if (event.value == this.KeteranganAlasanDisetujui) {
			this.httpService.get(Configuration.get().dataMaster + "/jeniskeputusan/findJenisKeputusanDisetujui").subscribe(result => {
				this.kdJenisKeputusan = result.kode.kode;
				this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisKeputusan&select=id.kode,namaJenisKeputusan,isGenerateSK&page=1&rows=1000&criteria=id.kode&values=' + this.kdJenisKeputusan + '&condition=and&profile=y').subscribe(table => {
					this.formSk.get('jenisKeputusan').setValue({ id_kode: table.data.data[0].id_kode, namaJenisKeputusan: table.data.data[0].namaJenisKeputusan, isGenerateSK: table.data.data[0].isGenerateSK });
					this.generatesk = table.data.data[0].isGenerateSK;
					if (table.data.data[0].isGenerateSK == 1) {
						this.formSk.get('cekOtomatis').enable();
						this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Bsc_kpi).subscribe(table => {
							this.formSk.get('noSkTerakhir').setValue(table.noSKIntern);
						});
					} else if (table.data.data[0].isGenerateSK == 0) {
						this.checkboxAktifCek = true;
						this.formSk.get('cekOtomatis').setValue(true);

						this.formSk.get('noSkSekarang').disable();
						this.formSk.get('cekOtomatis').disable();
						this.formSk.get('noSkTerakhir').disable();
						this.formSk.get('noSkSekarang').setValue('');
						this.formSk.get('noSkTerakhir').setValue('');
					}
				});
			});

		} else {
			this.httpService.get(Configuration.get().dataHr1Mod2 + '/pengajuanPinjaman/findJenisKeputusanTidakDisetujui').subscribe(result => {
				this.kdJenisKeputusan = result.data.kode.kode;
				this.httpService.get(Configuration.get().dataMaster + '/service/list-generic?table=JenisKeputusan&select=id.kode,namaJenisKeputusan,isGenerateSK&page=1&rows=1000&criteria=id.kode&values=' + this.kdJenisKeputusan + '&condition=and&profile=y').subscribe(table => {
					this.formSk.get('jenisKeputusan').setValue({ id_kode: table.data.data[0].id_kode, namaJenisKeputusan: table.data.data[0].namaJenisKeputusan, isGenerateSK: table.data.data[0].isGenerateSK });
					this.generatesk = table.data.data[0].isGenerateSK;
					if (table.data.data[0].isGenerateSK == 1) {
						this.formSk.get('cekOtomatis').enable();
						this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/getNoSKIntern?kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Bsc_kpi).subscribe(table => {
							this.formSk.get('noSkTerakhir').setValue(table.noSKIntern);
						});
					} else if (table.data.data[0].isGenerateSK == 0) {
						this.checkboxAktifCek = true;
						this.formSk.get('cekOtomatis').setValue(true);
						this.formSk.get('noSkSekarang').disable();
						this.formSk.get('cekOtomatis').disable();
						this.formSk.get('noSkTerakhir').disable();
						this.formSk.get('periodeAwalSk').disable();
						this.formSk.get('periodeAkhirSk').disable();
						this.formSk.get('noSkSekarang').setValue('');
						this.formSk.get('noSkTerakhir').setValue('');
					}
				});
			});
		}

	}

	otomatis(event){
		if (event == true) {
			this.buttonAktifCek = true;
			this.formSk.get('noSkSekarang').setValue(null);
			this.formSk.get('noSkSekarang').disable();
			this.buttonAktifSkTersedia = false;
		} else {
			this.buttonAktifCek = false;
			this.buttonAktifSkTersedia = true;
			this.formSk.get('noSkSekarang').setValue(this.formSk.get('noSkTerakhir').value);
			this.formSk.get('noSkSekarang').enable();
		}
	}

	changeValue(event){
		this.buttonAktifSkTersedia = true;
	}

	cekNoSk(){
		let hasilCek = false;
		let noSkSekarang = this.formSk.get('noSkSekarang').value;
		if (noSkSekarang == null || noSkSekarang == "" || noSkSekarang == undefined) {
			this.buttonAktifSkTersedia = true;
		} else {
			this.httpService.get(Configuration.get().dataMaster + '/suratKeputusan/checkNoSKIntern?noSKIntern=' + noSkSekarang + '&kdKelompokTransaksi=' + Configuration.kodeKelompokTransaksi().Bsc_kpi).subscribe(res => {
				hasilCek = res.status;
				this.buttonAktifSkTersedia = false;
				if (hasilCek == true) {
					this.alertService.success("Berhasil", "No SK Bisa Digunakan");
					this.buttonAktifSkTersedia = false;
				} else {
					this.alertService.warn("Peringatan", "No SK Sudah Digunakan");
					this.buttonAktifSkTersedia = true;
				}
			});
		}
	}

	setMinDate(event){
		let month = event.getMonth();
		let year = event.getFullYear();
		this.minDate = event;
		this.minDate.setMonth(month);
		this.minDate.setFullYear(year);
		this.formSk.get('periodeAkhirSk').setValue('');
	}

	keputusan(){
		this.getGridKeputusan();
		this.checkboxAktifCek = true;
		let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
		if (this.noSk != null && this.noSk != "-") {
			this.alertService.warn('Peringatan', 'Pengajuan Sudah Memiliki SK');
		} else if (this.expired == true) {
			this.alertService.warn('Peringatan', 'SK Approval Sudah Tidak Berlaku, Tanggal Akhir Berlaku SK : ' + new Date(this.tglExpired * 1000).getDate() + ' ' + month[new Date(this.tglExpired * 1000).getMonth()] + ' ' + new Date(this.tglExpired * 1000).getFullYear());
		} else if (this.approved == 0 && this.totalApprove == 0) {
			this.alertService.warn('Peringatan', 'Surat Keputusan Approval Tidak Ditemukan');
		} else {

			this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findVerifikasiByNoPlanning?noPlanning=' + this.noPosting).subscribe(table => {
				this.dataNoVerifikasi = table.data.data;
				this.approved = table.data.approved;
				this.totalApprove = table.data.totalApprove;
			});
			// this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/generateNoSK').subscribe(table => {
			// 	this.formSk.get('noSk').setValue(table.data.noSk);
			// 	this.formSk.get('namaSk').setValue(table.data.namaSk);
			// });
			
			this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findPegawaiByKdPegawai?kdPegawai=' + this.authGuard.getUserDto().idPegawai).subscribe(table => {
				this.formKeputusan.get('noPengajuan').setValue(this.noPosting);
				this.formKeputusan.get('namaPegawai').setValue(table.data.namaLengkap);
				this.formKeputusan.get('nik').setValue(table.data.nik);
				this.formKeputusan.get('jenisKelamin').setValue(table.data.jenisKelamin);
				this.formKeputusan.get('jenisPegawai').setValue(table.data.jenisPegawai);
				this.formKeputusan.get('jabatan').setValue(table.data.namaJabatan);
				this.formKeputusan.get('unitKerja').setValue(table.data.namaRuangan);
			});
			this.dialogKeputusan = true;

		}
		
	}

	reset(){
		this.formKeputusan.get('catatan').enable();
		this.formKeputusan.get('keputusan').enable();
		this.formKeputusan.get('catatan').enable();
		this.formKeputusan.get('tanggalVerifikasi').enable();
		this.formSk.get('periodeAwalSk').enable();
		this.formSk.get('periodeAkhirSk').enable();
		this.formSk.get('noSkSekarang').enable();
		this.formSk.get('cekOtomatis').enable();
		this.formSk.get('jenisKeputusan').enable();
		this.provide=false;
		this.dialogKeputusan = false;
		this.listMonitoringPengajuanKpiPegawai = [];
		this.selectedPeriode = [];
		this.ngOnInit();
	}

	onSubmit(){
		if (this.provide == false) {
			if (this.formKeputusan.invalid) {
				this.validateAllFormFields(this.formKeputusan);
				this.alertService.warn("Peringatan", "Data Tidak Sesuai")
			} else if(this.selectedDataBsc.length == 0){
				this.alertService.warn("Peringatan","Data Belum Dipilih")
			} 
			else{
				this.simpanKeputusan();
			}
		} else {
			if (this.formKeputusan.invalid) {
				this.validateAllFormFields(this.formKeputusan);
				this.alertService.warn("Peringatan", "Data Tidak Sesuai")
			} else if (this.formSk.invalid) {
				this.validateAllFormFields(this.formSk);
				this.alertService.warn("Peringatan", "Data Tidak Sesuai")
			} else if(this.selectedDataBsc.length == 0){
				this.alertService.warn("Peringatan","Data Belum Dipilih")
			}  else {
				this.simpanKeputusan();
			}
		}
	}

	simpanKeputusan(){
		let dataTempCek = [];
		let kdMetodeActual;
		let bobotK;
		let bobotKPSK;
		let kdKPISk;
		let tanggalVerif = this.setTimeStamp(this.formKeputusan.get('tanggalVerifikasi').value);
		let tanggalBerlakuAwal = this.setTimeStamp(this.formSk.get('periodeAwalSk').value);
		let tanggalBerlakuAkhir = this.setTimeStamp(this.formSk.get('periodeAkhirSk').value);
		let noSkIntern = this.formSk.get('noSkSekarang').value;
		

		if (this.provide == true) {

		for(let x=0; x<this.selectedDataBsc.length; x++){
			kdMetodeActual = this.selectedDataBsc[x].kdMetodeHitungActual;
			bobotK = this.selectedDataBsc[x].bobotKPI;
			bobotKPSK = this.selectedDataBsc[x].bobotKPI;
			kdKPISk = this.selectedDataBsc[x].kdKPI;
			let tempCek = {
				"bobotKPI": this.selectedDataBsc[x].bobotKPI,
				"bobotKPISK": this.selectedDataBsc[x].bobotKPI,
				"kdDepartemenD": this.selectedDataBsc[x].kdDepartemenD,
				"kdKPI": this.selectedDataBsc[x].kdKPI,
				"kdKPISK": this.selectedDataBsc[x].kdKPI,
				"kdMetodeHitungActual": this.selectedDataBsc[x].kdMetodeHitungActual,
				"kdMetodeHitungActualSK": this.formKeputusan.get('metodePerhitungan').value,
				"kdPegawai": this.selectedDataBsc[x].kdPegawai,
				"kdPeriodeDataSK": this.selectedDataBsc[x].kdPeriodeDataSK,
				"kdPerspectiveD": this.selectedDataBsc[x].kdPerspectiveD,
				"kdStrategyD": this.selectedDataBsc[x].kdStrategyD,
				"keteranganLainnya": this.selectedDataBsc[x].keteranganLainnya,
				"noHistori": this.selectedDataBsc[x].noHistori,
				"noHistoriActual": this.selectedDataBsc[x].noHistoriActual,
				"noPosting": this.selectedDataBsc[x].noPosting,
				"noRec": this.selectedDataBsc[x].noRec,
				"noRetur": this.selectedDataBsc[x].noRetur,
				"noSK": this.selectedDataBsc[x].noSK,
				"noVerifikasi": this.selectedDataBsc[x].noVerifikasi,
				"noVerifikasiActual": this.selectedDataBsc[x].noVerifikasiActual,
				"statusEnabled": this.selectedDataBsc[x].statusEnabled,
				"targetKPI": this.selectedDataBsc[x].targetKPI,
				"targetKPIMaxSK": this.selectedDataBsc[x].targetKPIMaxSK,
				"targetKPIMinSK": this.selectedDataBsc[x].targetKPIMinSK,
				"tglAkhir": this.selectedDataBsc[x].tglAkhir,
				"tglAwal": this.selectedDataBsc[x].tglAwal,
				"tglPosting": this.selectedDataBsc[x].totalActualKPI,
				"totalActualKPI": this.selectedDataBsc[x].totalActualKPI,
				"totalScoreKPI": this.selectedDataBsc[x].totalScoreKPI,
				"version": this.selectedDataBsc[x].version
			}
			dataTempCek.push(tempCek);
		}

		// let dataSimpanGrid = 
		// 	{
		// 		"pegawaiPostingKPIDto":dataTempCek
		// 	}

		// this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi/update', dataSimpanGrid).subscribe(response => {
		// });

		//console.log(this.selectedDataBsc);

			let formSubmit = {
				//"bobotKPISK":bobotKPSK,
				"catatan": this.formKeputusan.get('catatan').value,
				"isGenerateSK": this.generatesk,
				"kdJenisKeputusan": this.formSk.get('jenisKeputusan').value.id_kode,
				//"kdKPISK":kdKPISk,
				"kdKeteranganAlasan": this.formKeputusan.get('keputusan').value,
				"kdMetodeHitungActual": kdMetodeActual,
				//"kdMetodeHitungActualSK": this.formKeputusan.get('metodePerhitungan').value,
				"keterangan": this.formKeputusan.get('catatan').value,
				"noPosting": this.noPosting,
				"noRetur":"string",
				"noSkIntern": noSkIntern,
				"noVerifikasi":"string",
				"pegawaiPostingKPIDto": dataTempCek,
				"periodeAhir": tanggalBerlakuAkhir,
				"periodeAwal": tanggalBerlakuAwal,
				// "tglAkhir":0,
				// "tglAwal":0,
				// "tglPosting":0,
				"tglVerifikasi": tanggalVerif,
				
			}
			console.log(formSubmit);
			this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi/verifikasiV2', formSubmit).subscribe(response => {
				if (noSkIntern == null) {
					this.buttonAktifSkTersedia = true;
					this.formKeputusan.get('catatan').disable();
					this.formKeputusan.get('keputusan').disable();
					this.formKeputusan.get('catatan').disable();
					this.formKeputusan.get('tanggalVerifikasi').disable();
					this.formSk.get('periodeAwalSk').disable();
					this.formSk.get('periodeAkhirSk').disable();
					this.formSk.get('noSkSekarang').disable();
					this.formSk.get('cekOtomatis').disable();
					this.formSk.get('jenisKeputusan').disable();
					this.alertService.success('Berhasil', 'Keputusan Disimpan');
					this.formSk.get('noSkSekarang').setValue(response.data.noSk);
				} else {
					this.alertService.success('Berhasil', 'Keputusan Disimpan');
					this.dialogKeputusan = false;
					this.ngOnInit();
				}
			});
		} else {

			let formSubmit = {
				"catatan": this.formKeputusan.get('catatan').value,
				"kdKeteranganAlasan": this.formKeputusan.get('keputusan').value,
				// "kdMetodeHitungActual": 0,
				"kdMetodeHitungActualSK": 0,
				"noPosting": this.noPosting,
				"tglVerifikasi": tanggalVerif,
				"kdJenisKeputusan": null,
				"keterangan": null,
				"periodeAhir": null,
				"periodeAwal": null,
			}
			this.httpService.post(Configuration.get().dataBSC + '/pengajuan-kpi/verifikasiV2', formSubmit).subscribe(response => {
				this.alertService.success('Berhasil', 'Keputusan Disimpan');
				this.dialogKeputusan = false;
				this.ngOnInit();
			});
		}
	}

	onRowSelect(event){
		this.provide = false;
		this.buttonAktif = false;
		this.noSk = event.data.noSK;
		this.noPosting = event.data.noPosting;
		this.expired = event.data.expired;
		this.tglExpired = event.data.tglExpired;
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/checkHavingProvideSk?noPosting=' + this.noPosting).subscribe(res => {
			this.provide = res.data.isHavingProvideSk;
		});
		this.httpService.get(Configuration.get().dataBSC + '/pengajuan-kpi/findVerifikasiByNoPlanning?noPlanning=' + this.noPosting).subscribe(table => {
			this.dataNoVerifikasi = table.data.data;
			this.approved = table.data.approved;
			this.totalApprove = table.data.totalApprove;
		});
	}

	tutupPopUp(){
		this.reset()
	}







}
