import { Component, OnInit, OnDestroy, Inject, forwardRef } from '@angular/core';
import { HttpClient, UserDto, Authentication, AuthGuard, AlertService, InfoService, SuperUserService, SuperUserState } from '../../../global'; 
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-super-user',
  templateUrl: './super-user.component.html',
  styleUrls: ['./super-user.component.scss']
})
export class SuperUserComponent implements OnInit, OnDestroy {

    private state: Subscription;
    private stateInfo: Subscription;

    show : boolean = false;    
    error : boolean = false;
	  model: any = {};
    loading: boolean = false;
    callBack : (ob : any, res : any) => any;
    obThis : any;

    method : any;
    url : string;
    data : any;
    info : string;

  	constructor(private http : HttpClient, 
        private route: ActivatedRoute,
        private router: Router,
        private authentication: Authentication,
        private authGuard: AuthGuard,
        private superUserService: SuperUserService) { }

  	ngOnInit() { 
        
        this.info = "Informasi : Harap masukkan user id dan password dengan benar";

        this.state = this.superUserService.getSupervisorShow().subscribe(state => {
            this.show = state.show;
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

        console.log('ngOnInit superuser');     
    }

    ngOnDestroy() {
        this.state.unsubscribe();
        this.stateInfo.unsubscribe();
    }

    batal() {
      this.show = false;
    }

    berhasil(){
      this.info = "Informasi : Harap masukkan user id dan password dengan benar";
      this.error = false;
      this.show = false;
    }

  	loginUser(){
        this.loading = true;
        this.error = false;

        let mana = localStorage.getItem('user.data');
        let userDTO : UserDto = JSON.parse(mana);

        this.authentication
            .loginSuperUser(this.model.username, this.model.password, userDTO.namaUser)
            .subscribe(
                data => {
                    if (data.token != undefined && data.token != null) {
                      
                      switch (this.method) {
                        case 0:
                          this.http.getForced(this.url, this.callBack, this.obThis, true, data.token).subscribe(response =>{
                            this.berhasil();
                          });
                          break;
                        case 1:
                          this.http.get(this.url, this.callBack, this.obThis, true, data.token).subscribe(response =>{
                            this.berhasil();
                          });
                          break;
                        case 2:
                          this.http.post(this.url, this.data, this.callBack, this.obThis, true, data.token).subscribe(response =>{
                            this.berhasil();
                          });
                          break;
                        case 3:
                          this.http.update(this.url, this.data,  this.callBack, this.obThis, true, data.token).subscribe(response =>{
                            this.berhasil();
                          });
                          break;
                        case 4:
                          this.http.delete(this.url, this.callBack, this.obThis, true, data.token).subscribe(response =>{
                            this.berhasil();
                          });
                          break;
                        case 5:
                          this.http.genericReport(this.url, this.data, this.callBack, this.obThis, true, data.token).subscribe(response =>{
                            this.berhasil();
                          });
                          break;
                      }                      
                      this.loading = false;
                    } else {
                      this.info = "Informasi : Harap masukkan user id dan password dengan benar";
                      this.error = true;
                      this.loading = false;
                    }
                },
                error => {
                    this.info = "Informasi : Harap masukkan user id dan password dengan benar";
                    this.error = true;                      
                    this.loading = false;
                }
             );
  	}

}
