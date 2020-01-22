import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
	selector: 'app-map-paket-reimburse-to-produk',
	templateUrl: './map-paket-reimburse-to-produk.component.html',
	styleUrls: ['./map-paket-reimburse-to-produk.component.scss'],
	providers: [ConfirmationService]
})
export class MapPaketReimburseToProdukComponent implements OnInit {
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
	kdGolonganAsuransi: any=[];

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
		this.version = "1";
		this.get(this.page, this.rows, '');
		this.form = this.fb.group({
			'kdGolonganAsuransi': new FormControl('', Validators.required),
			'statusEnabled': new FormControl(true),
		});

		this.getKdGolonganAsuransi();
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


	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Kelas&select=namaKelas,id.kode').subscribe(res => {
			this.listData = res.data.data;
		});
	}

  clearPanelBawah(kdGolonganAsuransi) {
  	if (kdGolonganAsuransi == '' || kdGolonganAsuransi == null) {
  		this.hasilCek = true;
		  this.pilihan = [];
		  this.pilihSemua = false;

  	} else {
		  this.hasilCek = false;
		  this.pilihSemua = false;
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
	this.pilihSemua = false;

});
}

}


