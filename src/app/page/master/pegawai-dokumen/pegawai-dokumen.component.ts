import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-pegawai-dokumen',
  templateUrl: './pegawai-dokumen.component.html',
  styleUrls: ['./pegawai-dokumen.component.scss'],
   providers: [ConfirmationService]
})
export class PegawaiDokumenComponent implements OnInit {

	form: FormGroup;


  	constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }

  	ngOnInit() {
		   this.form = this.fb.group({
			'pegawai': new FormControl(''),
			'dokumen': new FormControl(''),
			'reportDisplay': new FormControl(''),
			'keteranganLainnya': new FormControl(''),
			'statusEnabled': new FormControl(''),
			'namaExternal': new FormControl(''),
     		 'kodeExternal': new FormControl(''),
	  });
		
	  }


}
