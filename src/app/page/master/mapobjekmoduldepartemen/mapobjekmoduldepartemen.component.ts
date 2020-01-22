import { Component, OnInit } from '@angular/core';
import {TreeModule,SelectItem,MenuItem,TreeNode} from 'primeng/primeng';
import {Contoh} from './dto/contoh-form.dto';
import {FormControl,FormGroup} from '@angular/forms';
import {NodeService} from './dto/nodeservice';


@Component({
	//selector: 'app-harilibur-form',
	templateUrl: './mapobjekmoduldepartemen.component.html',
	//styleUrls: ['./contoh-form.component.scss']
})
export class MapObjekModulDepartemenComponent implements OnInit {
	
	userform :FormGroup;
	filesTree: TreeNode[];
	constructor(private nodeService: NodeService) { }

	ngOnInit() {
		const form  = new FormGroup({
			'kodeHariLibur': new FormControl(''),
			'namaHariLibur': new FormControl(''),
			'reportDisplay': new FormControl(''),
			'kodeExternal' : new FormControl(''),
			'namaExternal' : new FormControl('')
		});
		 this.nodeService.getFiles().then(files => this.filesTree = files);
		
		 
		
		
		
	}
	onSubmit(){
		debugger;
		window.alert(JSON.stringify(this.userform));

	}

}
