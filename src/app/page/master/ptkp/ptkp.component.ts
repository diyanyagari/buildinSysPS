import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { ptkp } from './ptkp.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';

@Component({
	selector: 'app-ptkp',
	templateUrl: './ptkp.component.html',
	styleUrls: ['./ptkp.component.scss'],
	providers: [ConfirmationService]
})

export class PtkpComponent implements OnInit {
	form: FormGroup;
	formAktif: boolean;
	pencarian: string;
	listData: ptkp[];
	selected: ptkp;
	totalRecords:number;
	page:number;
	rows:number;
	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private fileService: FileService){}
	ngOnInit(){
		this.formAktif = true;
		this.form = this.fb.group({
			'namaStatusPtkp': new FormControl('', Validators.required),
			'kdStatusPerkawinan': new FormControl('', Validators.required),
			'kdQtyAnak': new FormControl('', Validators.required),
			'totalPtkp': new FormControl('', Validators.required),
			'kdDepartemen': new FormControl('', Validators.required),
			'deskripsi': new FormControl('', Validators.required),
			'kodeExternal': new FormControl(''),
			'namaExternal': new FormControl(''),
			'reportDisplay': new FormControl('', Validators.required)
		});

	}
	reset(){
		this.form.reset();
	}
}

