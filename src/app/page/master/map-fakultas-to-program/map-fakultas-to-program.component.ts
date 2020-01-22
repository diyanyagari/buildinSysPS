import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
	selector: 'app-map-fakultas-to-program',
	templateUrl: './map-fakultas-to-program.component.html',
	styleUrls: ['./map-fakultas-to-program.component.scss'],
	providers: [ConfirmationService]
})
export class MapFakultasToProgramComponent implements OnInit {

	listData: any[];
	selected: any;
	form: FormGroup;
	kodeFakultas: any[];

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
	kdFakultas: any;
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
		this.clearPanelBawah(this.kdFakultas);
	}

	ngOnInit() {
		this.version = "1";
		this.get(this.page,this.rows,'');
		this.form = this.fb.group({
			'kdFakultas': new FormControl(null,Validators.required),
			'statusEnabled': new FormControl(true)
		});

		this.hasilCek=false;
		this.kodeFakultas=[];
		this.pilihan=[];
		this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Fakultas&select=namaFakultas,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.kodeFakultas=[];
			this.kodeFakultas.push({label: '--Pilih Fakultas--', value: ''});
			for (var i=0; i< res.data.data.length; i++){
				this.kodeFakultas.push({label: res.data.data[i].namaFakultas, value: res.data.data[i].id_kode})
			};
		});
	}

	get(page: number, rows: number, search: any) {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Program&select=namaProgram,id.kode&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
			this.listData = res.data.data;
		});
	}

	clearPanelBawah(kdFakultas) {
		if (kdFakultas == '' || kdFakultas == null) {
			this.hasilCek = true;
			this.pilihan = [];
			this.pilihSemua = false;

		} else {
			this.hasilCek = false;
			this.pilihSemua = false;
			this.httpService.get(Configuration.get().dataMasterNew + '/mapfakultastoprogram/findByKode/' + kdFakultas).subscribe(res => {
				this.pilihan = [];
				for (let i = 0; i < res.MapFakultasToProgram.length; i++) {
					this.pilihan.push(String(res.MapFakultasToProgram[i].kdProgram))
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
		let mapFakultasToProgram = [];
		for (let i = 0; i < this.pilihan.length; i++) {
			let dataTemp = {
				"kdProgram": this.pilihan[i],
				"kdFakultas": this.form.get('kdFakultas').value,
				"statusEnabled": true
			}
			mapFakultasToProgram.push(dataTemp);
		}
		// let dataSimpan = {
		// 	"mapProgramToJurusan": mapProgramToJurusan
		// }
		// console.log(dataSimpan);

		this.httpService.update(Configuration.get().dataMasterNew + '/mapfakultastoprogram/update', mapFakultasToProgram).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Disimpan');
			this.pilihSemua = false;
		});
		this.ngOnInit();
	}

}
