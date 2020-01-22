import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

// import { MapKelompoktransaksiStrukturnomor } from './map-kelompoktransaksi-strukturnomor.interface'; 
import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
	selector: 'app-map-golongan-asuransi-to-kelas',
	templateUrl: './map-golongan-asuransi-to-kelas.component.html',
	styleUrls: ['./map-golongan-asuransi-to-kelas.component.scss'],
	providers: [ConfirmationService]
})
export class MapGolonganAsuransiToKelasComponent implements OnInit {
	listData: any[];
	selected: any;
	form: FormGroup;
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
	hasilCek: boolean = false;
	blockedPanel: boolean = false;
	selectedAll: any;
	pilihan: any = [];
	pilihSemua: boolean;

	kdKelompokPasien: any=[];
	kdRekananPenjamin: any=[];
	kdHubunganPesertaAsuransi: any=[];
	kdGolonganAsuransi: any=[];
	kdKelas: any=[];
	statusEnabled: any;
	noRec: any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private formBuilder: FormBuilder,
		private fileService: FileService,
		private cdRef: ChangeDetectorRef
		) {
		this.page = Configuration.get().page;
		this.rows = Configuration.get().rows;

	}


	ngAfterViewInit() {
		this.hasilCek = true;
		this.cdRef.detectChanges();
		this.clearPanelBawah(this.kdGolonganAsuransi);
	}

	ngOnInit() {
		this.hasilCek = true;
		this.version = "1";
		this.get(this.page, this.rows, '');
		this.form = this.fb.group({
			'kdKelompokPasien': new FormControl('', Validators.required),
			'kdRekananPenjamin': new FormControl('', Validators.required),
			'kdHubunganPesertaAsuransi': new FormControl('', Validators.required),
			'kdGolonganAsuransi': new FormControl('', Validators.required),
			'kdKelas': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true),
		});

		// this.getKdKelompokPasien();
		this.getKdRekananPenjamin();
		this.getKdHubunganPesertaAsuransi();
		this.getKdGolonganAsuransi();
		this.getKdKelas();
	}

	// getKdKelompokPasien() {
	// 	this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=GolonganAsuransi&select=namaGolonganAsuransi,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
	// 		this.kdGolonganAsuransi = [];
	// 		this.kdGolonganAsuransi.push({label:'--Pilih Golongan Asuransi--', value:''})
	// 		for(var i=0;i<res.data.data.length;i++) {
	// 			this.kdGolonganAsuransi.push({label:res.data.data[i].namaGolonganAsuransi, value:res.data.data[i].id_kode})
	// 		};
	// 	},
	// 	error => {
	// 		this.kdGolonganAsuransi = [];
	// 		this.kdGolonganAsuransi.push({label:'-- '+ error +' --', value:''})
	// 	});

	// }

getKdRekananPenjamin() {
		this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Rekanan&select=namaRekanan,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdRekananPenjamin = [];
			this.kdRekananPenjamin.push({label:'--Pilih Rekanan Penjamin--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdRekananPenjamin.push({label:res.data.data[i].namaRekanan, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdRekananPenjamin = [];
			this.kdRekananPenjamin.push({label:'-- '+ error +' --', value:''})
		});

	}

	getKdHubunganPesertaAsuransi() {
		this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=HubunganPesertaAsuransi&select=hubunganPeserta,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdHubunganPesertaAsuransi = [];
			this.kdHubunganPesertaAsuransi.push({label:'--Pilih Hubungan Peserta Asuransi--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdHubunganPesertaAsuransi.push({label:res.data.data[i].hubunganPeserta, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdHubunganPesertaAsuransi = [];
			this.kdHubunganPesertaAsuransi.push({label:'-- '+ error +' --', value:''})
		});

	}


	getKdGolonganAsuransi() {
		this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=GolonganAsuransi&select=namaGolonganAsuransi,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdGolonganAsuransi = [];
			this.kdGolonganAsuransi.push({label:'--Pilih Golongan Asuransi--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdGolonganAsuransi.push({label:res.data.data[i].namaGolonganAsuransi, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdGolonganAsuransi = [];
			this.kdGolonganAsuransi.push({label:'-- '+ error +' --', value:''})
		});

	}

	getKdKelas() {
		this.httpService.get(Configuration.get().dataMaster+'/service/list-generic?table=Kelas&select=namaKelas,id.kode&page=1&rows=300&condition=and&profile=y').subscribe(res => {
			this.kdKelas = [];
			this.kdKelas.push({label:'--Pilih Kelas--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdKelas.push({label:res.data.data[i].namaKelas, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdKelas = [];
			this.kdKelas.push({label:'-- '+ error +' --', value:''})
		});

	}


	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Kelas&select=namaKelas,id.kode').subscribe(res => {
			this.listData = res.data.data;
		});
	}

	clearPanelBawah(kdGolonganAsuransi) {
		if (kdGolonganAsuransi == '' || kdGolonganAsuransi == null) {
			this.hasilCek = true;
			this.pilihan = [];

		} else {
			this.hasilCek = false;
			this.httpService.get(Configuration.get().dataMasterNew + '/mapgolonganasuransitokelas/findByKode/' + kdGolonganAsuransi).subscribe(res => {
				this.pilihan = [];
				for (let i = 0; i < res.MapGolonganAsuransiToKelas.length; i++) {
					this.pilihan.push(String(res.MapGolonganAsuransiToKelas[i].kdKelas))
				}
        // console.log(JSON.stringify(this.pilihan))
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
      // console.log(JSON.stringify(this.pilihan))
  } else {
  	this.pilihan = []
  }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
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
	let mapGolonganAsuransiToKelas = []
	for (let i = 0; i < this.pilihan.length; i++) {
		let dataTemp = {
			"kdKelas": this.pilihan[i],
			"kdGolonganAsuransi": this.form.get('kdGolonganAsuransi').value,
			"statusEnabled": true
		}
		mapGolonganAsuransiToKelas.push(dataTemp);
	}
	let dataSimpan = {
		"mapGolonganAsuransiToKelas": mapGolonganAsuransiToKelas
	}

	this.httpService.update(Configuration.get().dataMasterNew + '/mapgolonganasuransitokelas/update/' + this.version, dataSimpan).subscribe(response => {
		this.alertService.success('Berhasil', 'Data Disimpan');

	});
}

}


