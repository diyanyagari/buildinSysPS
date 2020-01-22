import { Component, OnInit } from '@angular/core';
import {profilHistoriVisiMisiTujuan} from './dto/profil-histori-visi-misi-tujuan.dto';
import {FormControl,FormGroup} from '@angular/forms';
import {HttpClient} from '../../../global/service/HttpClient';

@Component({
  selector: 'app-profil-histori-visi-misi-tujuan',
  templateUrl: './profil-histori-visi-misi-tujuan.component.html',
  styleUrls: ['./profil-histori-visi-misi-tujuan.component.scss']
})
export class ProfilHistoriVisiMisiTujuanComponent implements OnInit {

	userform :FormGroup;
  	constructor() { 
  	}

  	ngOnInit() {
  		const form  = new FormGroup({
			'nomorHistori': new FormControl(''),
			'nomorUrut': new FormControl(''),
      'visiProfile': new FormControl(''),
      'misiProfile': new FormControl(''),
			'tujuanProfile': new FormControl(''),
			'keteranganLainnya': new FormControl(''),
			'statusEnabled': new FormControl('')
	  });
		
	  }

}
