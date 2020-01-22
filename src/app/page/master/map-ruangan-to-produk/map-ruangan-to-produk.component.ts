import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard  } from '../../../global';

@Component({
	selector: 'app-map-ruangan-to-produk',
	templateUrl: './map-ruangan-to-produk.component.html',
	styleUrls: ['./map-ruangan-to-produk.component.scss'],
	providers: [ConfirmationService]
})
export class MapRuanganToProdukComponent implements OnInit {
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

	kdRuangan: any=[];
	kdProduk: any=[];
	status: any;
	statusEnabled: any;
	noRec: any;

	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private authGuard: AuthGuard,
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
		this.clearPanelBawah(this.kdRuangan);
	}

	ngOnInit() {
		this.version = "1";
		this.get(this.page, this.rows, '');
		this.form = this.fb.group({
			'kdRuangan': new FormControl(null, Validators.required),
			'kdProduk': new FormControl(null),
			'status': new FormControl(1),
			'noRec': new FormControl(null),
			// 'statusEnabled': new FormControl(null),
		});
		this.hasilCek=true;

		this.getKdRuangan();
	}

	getKdRuangan() {
		this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.authGuard.getUserDto().kdLokasi).subscribe(res => {
			this.kdRuangan = [];
			this.kdRuangan.push({label:'--Pilih Ruangan--', value:''})
			for(var i=0;i<res.data.data.length;i++) {
				this.kdRuangan.push({label:res.data.data[i].namaRuangan, value:res.data.data[i].id_kode})
			};
		},
		error => {
			this.kdRuangan = [];
			this.kdRuangan.push({label:'-- '+ error +' --', value:''})
		});

	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Produk&select=namaProduk,id.kode').subscribe(res => {
			this.listData = res.data.data;
		});
	}

  clearPanelBawah(kdRuangan) {
  	if (kdRuangan == '' || kdRuangan == null) {
  		this.hasilCek = true;
		  this.pilihan = [];
		  this.pilihSemua = false;

  	} else {
		  this.hasilCek = false;
		  this.pilihSemua = false;
  		this.httpService.get(Configuration.get().dataMasterNew + '/mapruangantoproduk/findByKode/' + kdRuangan).subscribe(res => {
  			this.pilihan = [];
  			for (let i = 0; i < res.MapRuanganToProduk.length; i++) {
  				this.pilihan.push(String(res.MapRuanganToProduk[i].kdKelas))
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

	if (this.pilihan.length == 0) {
		this.alertService.warn('Peringatan', 'Pilih produk')
	}
	else {
		let mapRuanganToProduk = []
		for (let i = 0; i < this.pilihan.length; i++) {
			let dataTemp = {
				"kdProduk": this.pilihan[i],
				"kdRuangan": this.form.get('kdRuangan').value,
				"statusEnabled": true,
				"status":1
			}
			mapRuanganToProduk.push(dataTemp);
		}
		let dataSimpan = {
			"mapRuanganToProduk": mapRuanganToProduk
		}


		this.httpService.post(Configuration.get().dataMasterNew + '/mapruangantoproduk/save/', dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Disimpan');
			this.pilihSemua = false;
			this.ngOnInit();
		});
	}
}

reset(){
	this.ngOnInit();
}  


}


