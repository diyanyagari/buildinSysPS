import { Inject, forwardRef, Injectable, OnInit, OnDestroy } from '@angular/core';
import { Http, RequestOptions, Headers, Response, ResponseContentType } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';

import { Configuration } from '../config'; 
import { UserDto } from '../dto/iUserDto'; 
import { AuthGuard } from './auth.guard.service';
import { SuperUserState } from './super-user.interface';
import { SuperUserService } from './super-user.service';
import { SocketService } from './socket.service';
import { NotificationService } from './notification.service'; 
import { MessageService } from './message.service'; 
import { AlertService } from '../component/alert/alert.service'; 
import { InfoService } from '../component/info/info.service'; 
import { LoaderService } from '../component/loader/loader.service'; 

// import * as FileSaver from 'file-saver';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

import * as FileSaver from 'file-saver';

@Injectable()
export class HttpClient implements OnInit, OnDestroy {

  subscription: Subscription;

  infoToken : Subscription;
  loadPerf = new Subject<any>();

  userDto : UserDto;
  
  serviceData: any;
  method : any;
  url : string;
  data : any;
  obThis : any;
  errorMessage: any;
  callBack : (ob : any, res : any) => any;
  methodConfirm: any;
  superUserToken : string;
  isSuperUserReq : boolean = false;

  constructor(private http: Http, 
              private router: Router,
              private route: ActivatedRoute,
              //@Inject(forwardRef(() => AuthGuard)) private authGuard : AuthGuard,
              @Inject(forwardRef(() => AlertService)) private alert : AlertService, 
              @Inject(forwardRef(() => InfoService)) private info : InfoService,
              @Inject(forwardRef(() => LoaderService)) private loader : LoaderService,
              @Inject(forwardRef(() => SocketService)) private socket : SocketService,
              @Inject(forwardRef(() => SuperUserService)) private superUser : SuperUserService) {}

  ngOnDestroy() {
    this.infoToken.unsubscribe();
    this.infoToken = null;
    this.subscription.unsubscribe();
    //this.setAuthGuard(this.authGuard);
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe();
  }
  
  navigateURL(){
    this.router.navigate(['login']);
  }

  setAuthGuard(authGuard: AuthGuard){
    if (this.infoToken != undefined && this.infoToken != null) {
      this.infoToken.unsubscribe();
      this.infoToken = null;
    }
    this.infoToken = authGuard.getInfoToken().subscribe(userDto => this.userDto = userDto);
  }

  beforeUploadFile(event){
     if (this.userDto !== undefined && this.userDto !== null){
        event.xhr.setRequestHeader('AlamatUrlForm',  window.location.hash);      
        event.xhr.setRequestHeader('Authorization', this.userDto.token);
        event.xhr.setRequestHeader("x-auth-token", this.userDto.token);
//        event.xhr.setRequestHeader('KdRuangan', this.userDto.idRuangan);   
     }
  }

  showLoader(): void {    
    this.loader.show();
  }

  hideLoader(): void {
    this.loader.hide();
  }

  checkPerformanceLoader(){
    // let obj = {
    //   'loading' : false
    // };
    
    // this.loadPerf.next(obj);

    // this.socket.on(this.userDto.kdProfile + "-" + window.location.hash, this.showNotifPerformance, this);
  }

  showNotifPerformance(ob : HttpClient, data : string){
      // let obj = JSON.parse(data);
      // this.loadPerf.next(obj);      
  }

  getloadPerf() : Observable<any> {
    return this.loadPerf.asObservable();
  }

  createAuthorizationHeader(headers: Headers, customToken : string = null) {

    this.checkPerformanceLoader();

    headers.set('Content-Type','application/json');
    headers.set('Accept', 'application/json');

    console.log("path name " + window.location.hash);

    if (this.userDto !== undefined && this.userDto !== null){
//        headers.set('KdRuangan', this.userDto.idRuangan);   
        headers.set('AlamatUrlForm',  window.location.hash); 
        if (customToken == undefined || customToken == null) {    
          headers.set('Authorization', this.userDto.token);
        } else {
          headers.set('Authorization', customToken);
        }
    }
  }

  createNotificationHeaders(headers: Headers, data?){
    if (data.hKdRuanganTujuan !== undefined && data.hKdruanganTujuan !== null){
      headers.set('KdRuanganT', JSON.stringify(data.hKdruanganTujuan));
    }

    if (data.hPejabat !== undefined && data.hPejabat !== null){
      headers.set('CrJabatanT', JSON.stringify(data.hPejabat));      
    }
  }

  processdHeaders(headers: Headers, customToken : string = null, data?){
    this.createAuthorizationHeader(headers, customToken);

    if (data === undefined || data === null){
      return;
    }

    if (Array.isArray(data)){
      for (let i=1; i<data.length; i++){
         this.createNotificationHeaders(headers, data[i]);
      }
    } else {
       this.createNotificationHeaders(headers, data);
    }
  }

  getFileDownload(url : string, namaFile = null){
      let headers = new Headers();
      if (this.userDto !== undefined && this.userDto !== null){
            headers.set('Authorization', this.userDto.token);  
      }
      
      if (namaFile === null || namaFile === undefined){
          let idx = url.indexOf('/file/download/') + '/file/download/'.length;
          namaFile = url.substring(idx)
      }

      headers.set('Accept', '*/*')

      let options = new RequestOptions({headers: headers});

      return this.http.get(url, {headers: headers, withCredentials: true, responseType: ResponseContentType.Blob}).map((res: Response) => {

      FileSaver.saveAs(res.blob(), namaFile);
     
      return res.blob();   
    }).catch(error => {
        this.handleError(error); 
        return this.reject();
      })
      .finally(() => {
        this.hideLoader();
      }).subscribe();
  }

  getImage(url) { 
      let headers = new Headers();
      if (this.userDto !== undefined && this.userDto !== null){
            headers.set('Authorization', this.userDto.token);  
      }
      let options = new RequestOptions({headers: headers});
      return this.http.get(url, {headers: headers, withCredentials: true, responseType: ResponseContentType.Blob}).map((res: Response) => {
      return res.blob();   
   }).catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
           
  }  

  getPreview(url, id : string, w = null, h = null){

    document.getElementById(id).setAttribute('src', 'assets/layout/images/buble2.gif')
    this.getForced(url).subscribe(res => {
      var file = new Blob( [res], {type: 'application/pdf'})
      var url = window.URL.createObjectURL(file)
      if (w !== null && w !== undefined){
        document.getElementById(id).style.width = w + "px";
      }
      if (h !== null && h !== undefined){
        document.getElementById(id).style.height = h + "px";
      }
      document.getElementById(id).setAttribute('src', url + '#view=FitH&toolbar=1')
    });
  }

  getForced(url, callBack : (ob : any, res : any) => any = null, ob : any = null, auth : boolean = false, tokenSuper : string = null) { 
    this.method = 0;
    this.url = url;
    this.obThis = ob;
    this.isSuperUserReq = auth;
    this.callBack = callBack;
    this.showLoader();

    let headers = new Headers();
    
    if (this.userDto !== undefined && this.userDto !== null){
        if (auth){
          headers.set('Authorization', tokenSuper);
        } else {
          headers.set('Authorization', this.userDto.token);  
        }
              
    }
 //  headers.set('Content-Type','application/pdf');
    headers.set('Accept', 'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,*/*');
 //   let options = new RequestOptions({headers: headers});
    return this.http.get(url, {headers: headers, withCredentials: true, responseType: ResponseContentType.Blob})
    .map((res : Response) => {
      if (callBack !== undefined && callBack !== null){
        callBack(ob, res.blob());
      }
      return res.blob();      
    })
    .catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
  }

  genericReport(url, data, callBack : (ob : any, res : any) => any = null, ob : any = null, auth : boolean = false, tokenSuper : string = null){
    this.method = 5;
    this.url = url;
    this.obThis = ob;
    this.isSuperUserReq = auth;
    this.callBack = callBack;
    this.showLoader();

    let headers = new Headers();
    if (this.userDto !== undefined && this.userDto !== null){
        if (auth){
          headers.set('Authorization', tokenSuper);
        } else {
          headers.set('Authorization', this.userDto.token);  
        }
              
    }
    headers.set('Content-Type','application/json');
    headers.set('Accept', 'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,*/*');
//    let options = new RequestOptions({headers: headers});
    return this.http.post(url, data, {headers: headers, withCredentials: true, responseType: ResponseContentType.Blob}) 
    .map((res : Response) => {
      if (callBack !== undefined && callBack !== null){
        callBack(ob, res.blob());
      }

      if (data.download){
            let namaFile : string = 'downloadReport' + new Date().getTime();
            if (data.namaFile !== undefined && data.namaFile !== null){
              namaFile = data.namaFile;
            } else {
              namaFile = 'downloadReport' + new Date().getTime();
            }

            if (data.extFile !== undefined && data.extFile !== null ){
              namaFile += data.extFile;
            } else {
              namaFile += '.xlsx';
            }

            FileSaver.saveAs(res.blob(), namaFile);
      }

      return res.blob();      
    })
    .catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
  }  

  get(url, callBack : (ob : any, res : any) => any = null, ob : any = null, auth : boolean = false, tokenSuper : string = null) {
    this.method = 1;
    this.url = url;
    this.obThis = ob;
    this.isSuperUserReq = auth;    
    this.callBack = callBack;
    this.showLoader();

    let headers = new Headers();
    this.processdHeaders(headers, tokenSuper);

    let options = new RequestOptions({headers: headers});
    return this.http.get(url, {headers: headers, withCredentials: true})
    .map((res: Response) => {
      if (callBack !== undefined && callBack !== null){
        callBack(ob, res.json());
      }
      return res.json();
    })
    .catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
  }


  post(url, data, callBack : (ob : any, res : any) => any = null, ob : any = null, auth : boolean = false, tokenSuper : string = null) {
    this.method = 2;
    this.url = url;
    this.obThis = ob;
    this.data = data;
    this.isSuperUserReq = auth;
    this.callBack = callBack;
    this.methodConfirm = 'POST';
    this.showLoader();

    let headers = new Headers();
    this.processdHeaders(headers, tokenSuper, data);

    let options = new RequestOptions({headers: headers, withCredentials: true});
    console.log(JSON.stringify(data));
    return this.http.post(url, data, options)
    .map((res: Response) => {
      if (callBack !== undefined && callBack !== null){
        callBack(ob, res.json());
      } else {
        //syamsudin
        // this.alert.success("Tambah", "Data berhasil ditambah.");
      }
      return res.json();
    })
    .catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
  }

  update(url, data, callBack : (ob : any, res : any) => any = null, ob : any = null, auth : boolean = false, tokenSuper : string = null) {
    this.method = 3;
    this.url = url;
    this.obThis = ob;
    this.data = data;
    this.isSuperUserReq = auth;
    this.callBack = callBack;
    this.methodConfirm = 'PUT';
    this.showLoader();

    let headers = new Headers();
    this.processdHeaders(headers, tokenSuper, data);

    let options = new RequestOptions({headers: headers, withCredentials: true});
    console.log(JSON.stringify(data));
    return this.http.put(url, data, options)
    .map((res: Response) => {
      // debugger;
      
      if (callBack !== undefined && callBack !== null){
        callBack(ob, res.json());
      } else {
        this.alert.success("Ubah", "Data berhasil diubah.");
      }
      return res.json();
    })
    .catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
  }



  delete(url, callBack : (ob : any, res : any) => any = null, ob : any = null, auth : boolean = false, tokenSuper : string = null){
    this.method = 4;
    this.url = url;
    this.obThis = ob;
    this.isSuperUserReq = auth;
    this.callBack = callBack;
    this.showLoader();
    this.methodConfirm = 'DEL';
    let headers = new Headers();
    this.processdHeaders(headers, tokenSuper);

    let options = new RequestOptions({headers: headers, withCredentials: true});
    return this.http.delete(url, options)
    .map((res: Response) => {
      if (callBack !== undefined && callBack !== null){
        callBack(ob, res.json());
      } else {
        this.alert.info("Hapus", "Data berhasil dihapus.");
      }
      return res.json();
    })
    .catch(error => {
       this.handleError(error); 
       return this.reject();
    })
    .finally(() => {
      this.hideLoader();
    });
  }


  private reject(){
      return Promise.reject("koneksi terputus");
  }

  private handleError(error: Response | any ) {    

      console.log(error);

      if (error.status == 0) {
        if (this.isSuperUserReq){
          this.superUser.setInfo("Kesalahan : Koneksi ke server terputus, silahkan coba lagi.");
        } else {
          this.alert.error("Kesalahan", "Koneksi ke server terputus, silahkan coba lagi.");
        } 
      } else if (error.status == 500) {
        if (error._body == ""){
          this.errorMessage = {};
          let errorText = 'Error tidak diketahui';
          if (this.isSuperUserReq){
              this.superUser.setInfo("Kesalahan : " + errorText);
          } else {
            this.info.error("Kesalahan", errorText);
            location.href = "#myDiv";                   
          }
        } else {
          this.errorMessage = JSON.parse(error._body)
          let errorText = '';
          if (this.errorMessage.statusCode == "501" || this.errorMessage.statusCode == 501) {
            for (let i=0;i<this.errorMessage.errors.length;i++){
               errorText += this.errorMessage.errors[i].error;
            }
            if (this.isSuperUserReq){
                this.superUser.setInfo("Peringatan : " + errorText);
            } else {
              this.alert.warn("Peringatan", errorText);                   
            }
          } else if (this.errorMessage.statusCode == "502" || this.errorMessage.statusCode == 502) {
            for (let i=0;i<this.errorMessage.errors.length;i++){
               errorText += this.errorMessage.errors[i].error;
            }
            this.superUser.setObThis(this.obThis);
            this.superUser.setMethod(this.method);
            this.superUser.setData(this.data);
            this.superUser.setUrl(this.url);
            this.superUser.setCallBack(this.callBack);
            this.superUser.setMessage(errorText);
            this.superUser.showHandle();

          } else {
            for (let i=0;i<this.errorMessage.errors.length;i++){
               errorText += this.errorMessage.errors[i].error;
            }
            if (this.isSuperUserReq){
                this.superUser.setInfo("Kesalahan : " + errorText);
            } else {
              this.info.error("Kesalahan", errorText);
              window.scrollTo({
                  top: 0,
                  behavior: "smooth"
              });
            }
          } 
        }

      } else if (error.status == 401) {
        if (error.headers.get("RequireSupervisor") == "true"){
          if (this.isSuperUserReq){
            this.superUser.setInfo("Peringatan : Tidak punya hak akses, silahkan hubungi administrator.");
          } else {
            this.superUser.setObThis(this.obThis);
            this.superUser.setMethod(this.method);
            this.superUser.setData(this.data);
            this.superUser.setUrl(this.url);
            this.superUser.setCallBack(this.callBack);
            this.superUser.show();  
          }
        } else {
          this.alert.warn("Peringatan", "Tidak punya hak akses, silahkan coba login ulang atau hubungi administrator.");
        }        
      } else if (error.status == 403) {
        if (this.isSuperUserReq){
          this.superUser.setInfo("Peringatan : Sesi sudah berakhir, silahkan login ulang.");
        }  else {
          this.alert.warn("Peringatan", "Sesi sudah berakhir, silahkan login ulang.");
        }
      } else if (error.status == 404) {
        if (this.isSuperUserReq){
          this.superUser.setInfo("Peringatan : Halaman API tidak ditemukan.");
        }  else {
          this.alert.error("Kesalahan", "Halaman API tidak ditemukan.");
        }
      } else if (error.status == 503 || error.status == 504) {
        if (this.isSuperUserReq){
          this.superUser.setInfo("Peringatan : Server sibuk, tidak dapat melayani permintaan, silahkan ulangi.");
        }  else {
          this.alert.warn("Peringatan", "Server sibuk, tidak dapat melayani permintaan, silahkan ulangi.");          
        }
      } else {
        this.alert.error("Kesalahan", "Kesalahan Komunikasi Server");     
      }
  }  
}
/// LIST ERROR
// 401 Unauthorized
// 403 Forbidden (session expired)
// 404 Page Not Found
// 405 Method (POST, PUT, DELETE)
// 500 Server Error
// 0 Koneksi error
// 200-299 OK



// put(url, endpoint: string, body: any, auth : boolean = false, tokenSuper : string = null) {
  //   this.method = 5;
  //   this.url = url;
  //   this.isSuperUserReq = auth;
  //   this.showLoader();

  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   let options = new RequestOptions({headers: headers});
  //   return this.http.put(url + endpoint, body, options)
  //   .map((res: Response) => {
  //     res.json();
  //     this.alert.info("Informasi", "Dta berhasil diubah.");

  //   })
  //   .catch(error => {
  //      this.handleError(error); 
  //      return this.reject();
  //   })
  //   .finally(() => {
  //     this.hideLoader();
  //   });
  // }

  // get2(url,endpoint: string, params?: any, auth : boolean = false, tokenSuper : string = null) {
  //   this.method = 6;
  //   this.url = url;
  //   this.isSuperUserReq = auth;
  //   this.showLoader();

  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   let options = new RequestOptions({headers: headers, withCredentials: true});
  //   if (params) {
  //     let p = new URLSearchParams();
  //     for (let k in params) {
  //       p.set(k, params[k]);
  //     }
  //     options.search = !options.search && p || options.search;
  //   }
  //   return this.http.get(Configuration.get().apiBackend +url + endpoint,options)
  //   .catch(error => {
  //      this.handleError(error); 
  //      return this.reject();
  //   })
  //   .finally(() => {
  //     this.hideLoader();
  //   });
  // }

  // post2(url,endpoint: string, body: any, auth : boolean = false, tokenSuper : string = null) {
  //   this.method = 7;
  //   this.url = url;
  //   this.isSuperUserReq = auth;
  //   this.showLoader();

  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   let options = new RequestOptions({headers: headers, withCredentials: true});
  //   return this.http.post(Configuration.get().apiBackend +url + endpoint, body, options)
  //   .catch(error => {
  //      this.handleError(error); 
  //      return this.reject();
  //   })
  //   .finally(() => {
  //     this.hideLoader();
  //   });
  // }

  

  // delete2(url,endpoint: string, auth : boolean = false, tokenSuper : string = null) {
  //   this.method = 8;
  //   this.url = url;
  //   this.isSuperUserReq = auth;
  //   this.showLoader();

  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   let options = new RequestOptions({headers: headers});
  //   return this.http.delete(Configuration.get().apiBackend +url + endpoint, options)
  //   .catch(error => {
  //      this.handleError(error); 
  //      return this.reject();
  //   })
  //   .finally(() => {
  //     this.hideLoader();
  //   });
  // }

  // patch(url,endpoint: string, body: any, auth : boolean = false, tokenSuper : string = null) {
  //   this.method = 9;
  //   this.url = url;
  //   this.isSuperUserReq = auth;
  //   this.showLoader();

  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   let options = new RequestOptions({headers: headers});
  //   return this.http.put(Configuration.get().apiBackend +url + endpoint, body, options)
  //   .catch(error => {
  //      this.handleError(error); 
  //      return this.reject();
  //   })
  //   .finally(() => {
  //     this.hideLoader();
  //   });
  // }
