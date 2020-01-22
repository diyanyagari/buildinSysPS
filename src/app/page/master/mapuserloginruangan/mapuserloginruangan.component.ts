import { Component, OnInit } from '@angular/core';
import {SelectItem,MenuItem,TreeNode} from 'primeng/primeng';
import {Contoh} from './dto/contoh-form.dto';
import {FormControl,FormGroup} from '@angular/forms';

@Component({
	//selector: 'app-harilibur-form',
	templateUrl: './mapuserloginruangan.component.html',
	//styleUrls: ['./contoh-form.component.scss']
})
export class MapUserLoginRuanganComponent implements OnInit {
	
	userform :FormGroup;
	constructor() { }

	ngOnInit() {
		const form  = new FormGroup({
			'kodeHariLibur': new FormControl(''),
			'namaHariLibur': new FormControl(''),
			'reportDisplay': new FormControl(''),
			'kodeExternal' : new FormControl(''),
			'namaExternal' : new FormControl('')
		});
		
		
		
	}
	onSubmit(){
		debugger;
		window.alert(JSON.stringify(this.userform));

	}

}
