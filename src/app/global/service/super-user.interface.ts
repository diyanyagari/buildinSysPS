export interface SuperUserState {
    show: boolean;
    method : any;
	url : string;
  	data : any;
  	obThis : any;
  	callBack : (ob : any, res : any) => any;
}

export interface SuperUserInfo {
  	info : string;	
  	error : boolean;
}

export interface HandleDialog {
    show: boolean;
    message: any;
    method : any;
	url : string;
  	data : any;
  	obThis : any;
  	callBack : (ob : any, res : any) => any;
}