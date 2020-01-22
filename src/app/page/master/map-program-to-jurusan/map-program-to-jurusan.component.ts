import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { MapProgramToJurusan } from './map-program-to-jurusan.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
	selector: 'app-map-program-to-jurusan',
	templateUrl: './map-program-to-jurusan.component.html',
	styleUrls: ['./map-program-to-jurusan.component.scss'],
	providers: [ConfirmationService]
})
export class MapProgramToJurusanComponent implements OnInit {
	listData: any[];
	selected: MapProgramToJurusan;
	form: FormGroup;
	kodeProgram: any[];

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
	kdProgram: any;
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
		this.rows = Configuration.get().rows;
	}

	ngAfterViewInit() {
		this.hasilCek = true;
		this.cekLampiranDokumen = false;
		this.cdRef.detectChanges();
		this.clearPanelBawah(this.kdProgram);
	}


	ngOnInit() {
		this.version = "1";
		this.get(this.page,this.rows,'');
		this.form = this.fb.group({
			'kdProgram': new FormControl(null,Validators.required),
			'statusEnabled': new FormControl(true)
		});

		this.hasilCek=false;
		this.kodeProgram=[];
		this.pilihan=[];
		this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic/?table=Program&select=namaProgram,id').subscribe(res => {
			this.kodeProgram=[];
			this.kodeProgram.push({label: '--Pilih Program--', value: ''});
			for (var i=0; i< res.data.data.length; i++){
				this.kodeProgram.push({label: res.data.data[i].namaProgram, value: res.data.data[i].id.kode})
			};
		});
	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Jurusan&select=id.kode,namaJurusan&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listData = res.data.data;
		});
	}

	clearPanelBawah(kdProgram) {
		if (kdProgram == '' || kdProgram == null) {
			this.hasilCek = true;
			this.pilihan = [];
			this.pilihSemua = false;

		} else {
			this.hasilCek = false;
			this.pilihSemua = false;
			this.httpService.get(Configuration.get().dataMasterNew + '/mapprogramtojurusan/findByKode/' + kdProgram).subscribe(res => {
				this.pilihan = [];
				for (let i = 0; i < res.MapProgramToJurusan.length; i++) {
					this.pilihan.push(String(res.MapProgramToJurusan[i].kdJurusan))
				}
			});

		}
	}

	selectAll() {
		if (this.pilihSemua == true) {
			this.pilihan = [];
			let dataTemp = [];
			this.listData.forEach(function (data) {
				dataTemp.push(String(data.id_kode));
			})
			this.pilihan = dataTemp;
		} else {
			this.pilihan = []
		}
	}

	onChange() {
		console.log(JSON.stringify(this.pilihan));
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
			this.alertService.warn('Peringatan', 'Data Tidak Sesuai')
		} else {
			this.simpan();
		}
	}

	simpan() {
		let mapProgramToJurusan = [];
		for (let i = 0; i < this.pilihan.length; i++) {
			let dataTemp = {
				"kdJurusan": this.pilihan[i],
				"kdProgram": this.form.get('kdProgram').value,
				"statusEnabled": true
			}
			mapProgramToJurusan.push(dataTemp);
		}
		// let dataSimpan = {
		// 	"mapProgramToJurusan": mapProgramToJurusan
		// }
		// console.log(dataSimpan);

		this.httpService.update(Configuration.get().dataMasterNew + '/mapprogramtojurusan/update', mapProgramToJurusan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Disimpan');
			this.pilihSemua = false;
		});
		this.ngOnInit();
	}

}

