import { Component, OnInit, OnDestroy, Inject, forwardRef } from '@angular/core';
import { HttpClient, UserDto, Authentication, AuthGuard, AlertService, InfoService, SuperUserService, SuperUserState } from '../../../global';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-handle-dialog',
	templateUrl: './handle-dialog.component.html',
	styleUrls: ['./handle-dialog.component.scss'],
	providers: [ConfirmationService]
})
export class HandleDialogComponent implements OnInit, OnDestroy {
	private state: Subscription;
	private stateInfo: Subscription;

	show : boolean = false;    
	error : boolean = false;
	model: any = {};
	loading: boolean = false;
	callBack : (ob : any, res : any) => any;
	obThis : any;
	message: any;
	method : any;
	url : string;
	data : any;
	info : string;
	display:boolean;
	constructor(private http : HttpClient, 
		private route: ActivatedRoute,
		private router: Router,
		private authentication: Authentication,
		private authGuard: AuthGuard,
		private superUserService: SuperUserService) {

	}
	
	ngOnDestroy() {
		this.state.unsubscribe();
		this.stateInfo.unsubscribe();
	}
	ngOnInit() {
		this.state = this.superUserService.getDialogShow().subscribe(state => {
            this.display = state.show;
            this.message = state.message;
            this.data = state.data;
            this.url = state.url;
            this.method = state.method;
            this.obThis = state.obThis;
            this.callBack = state.callBack;
        });

		this.stateInfo = this.superUserService.getSupervisorInfo().subscribe(stateInfo => {
			this.info = stateInfo.info;
			this.error = true;
		});
	}
	confirmHandle(message:string,method:string,url:string,data:any) {
		this.message = message;
		this.method = method;
		this.url = url;
		this.data = data;
		this.display = true
	}
	next() {
		this.data.okey = true
		if (this.method == 2) {
			this.http.post(this.url, this.data).subscribe(response => {
				this.display = false;
				this.data.okey = false
			});
		} else if (this.method == 3) {
			this.http.update(this.url, this.data).subscribe(response => {
				this.display = false;
				this.data.okey = false
			});
		}
	}
}
