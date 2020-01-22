import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, MenuItem } from 'primeng/primeng';

@Component({
	selector: 'app-sejarah-profile',
	templateUrl: './sejarah-profile.component.html',
	styleUrls: ['./sejarah-profile.component.scss'],
	providers: [ConfirmationService]
})
export class SejarahProfileComponent implements OnInit {

	formAktif: boolean;
	form: FormGroup;
	listData: any = [];
	isiSejarah: string;

	constructor(private fb: FormBuilder,
		private cdRef: ChangeDetectorRef,
		private httpService: HttpClient,
		private alertService: AlertService,
		private confirmationService: ConfirmationService) { }


	ngOnInit() {
		this.formAktif = true;
		this.getDataGrid();
	}

	getDataGrid() {
		this.httpService.get(Configuration.get().dataMasterNew + '/sejarah-profile/getSejarahProfile').subscribe(table => {
			this.listData = table.sejarahProfile;
		});
	}

	onSubmit() {
		this.simpan();
	}

	simpan() {
		let dataSimpan = {
			'sejarahProfile': this.isiSejarah
		}
		console.log(JSON.stringify(dataSimpan));

		this.httpService.post(Configuration.get().dataMasterNew + '/sejarah-profile/save', dataSimpan).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Berhasil Disimpan');
			this.reset();
		})
	}

	edit() {
		this.httpService.get(Configuration.get().dataMasterNew + '/sejarah-profile/getSejarahProfile').subscribe(table => {
			this.isiSejarah = table.sejarahProfile.deskripsiDokumen;
		})
	}

	onDestroy() {

	}

	reset() {
		this.formAktif = true;
		this.isiSejarah = '';
		this.ngOnInit();
	}
}


