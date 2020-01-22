import { Inject, forwardRef, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Configuration }  from '../config';
import { NotifInfo } from './notification.interface'; 


import * as io from 'socket.io-client';

// class CallBackWrapper {

// 	private iCallBack : (ob : any, res : string) => any = null;

// 	constructor(callBack : (ob : any, res : string) => any = null, private ob : any){
// 		this.iCallBack = callBack;
// 	}	

// 	callBackOn(data){
// 		console.log('data  asli ' + data);
// 		this.iCallBack(this.ob, data);
// 	}
// }

@Injectable()
export class SocketService {

	socket: any;
	//wrapper : CallBackWrapper[]; 

	callBack : (ob : any, res : string) => any = null

	constructor(){
		this.socket = io(Configuration.get().socketIO,{reconnection:true});
		console.log('socket connect');
	}

	

	on(stat, callBack : (ob : any, res : string) => any = null, ob : any){
		//this.wrapper[ob] = new CallBackWrapper(callBack, ob);
		this.callBack = callBack;
		this.socket.on(stat, function(data){
			console.log('data  asli ' + data);
			callBack(ob, data);
		});
	}

	emit(info, message){
		this.socket.emit(info, message);
	}

	dis(){
		this.socket.disconnect();
	}

	con(){
		this.socket = io(Configuration.get().socketIO);
	}

}	

