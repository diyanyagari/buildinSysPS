import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { SuperUserState, SuperUserInfo, HandleDialog } from  './super-user.interface';

@Injectable()
export class SuperUserService {

	  private subject = new Subject<SuperUserState>();
    private infoSubject = new Subject<SuperUserInfo>();
    private handleDialog = new Subject<HandleDialog>();
    message: any;
  	method : any;
  	url : string;
  	data : any;
    info : string;
    obThis : any;
    callBack : (ob : any, res : any) => any;

  	setMethod(method : any){
  		this.method = method;
  	}
    setMessage(message:any) {
      this.message = message;
    }
  	setData(data : any){
  		this.data = data;
  	}

    setCallBack(callBack : (ob : any, res : any) => any = null){
      this.callBack = callBack;
    }

  	setUrl(url : string){
  		this.url = url;
  	}

    setObThis(obThis : any){

    }

    setInfo(str:string){
      this.info = str;
      this.infoSubject.next(<SuperUserInfo>{info : this.info, error : true});
    }
    showHandle(){
      this.handleDialog.next(<HandleDialog>{show: true, message: this.message,method : this.method, data : this.data, url : this.url, callBack : this.callBack, obThis : this.obThis});
    }
    hideDialog(){
      this.handleDialog.next(<HandleDialog>{show: false, message: this.message,method : this.method, data : this.data, url : this.url, callBack : this.callBack, obThis : this.obThis});
    }
	  show() {
        this.subject.next(<SuperUserState>{show: true, method : this.method, data : this.data, url : this.url, callBack : this.callBack, obThis : this.obThis});
    }

    hide() {
        this.subject.next(<SuperUserState>{show: false, method : this.method, data : this.data, url : this.url, callBack : this.callBack, obThis : this.obThis});
    }

	  getSupervisorShow(): Observable<SuperUserState> {
		  return this.subject.asObservable();
    }

    getDialogShow(): Observable<HandleDialog> {
      return this.handleDialog.asObservable();
    }

    getSupervisorInfo(): Observable<SuperUserInfo> {
      return this.infoSubject.asObservable();
    }

}