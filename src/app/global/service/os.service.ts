import { Inject, forwardRef, Injectable, OnInit, OnDestroy } from '@angular/core';
import { Http, RequestOptions, Headers, Response, ResponseContentType } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router, ActivatedRoute } from '@angular/router';

import { LoaderService } from '../component/loader/loader.service'; 


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import * as FileSaver from 'file-saver';

@Injectable()
export class OsService implements OnInit, OnDestroy {

  subscription: Subscription;

  infoToken: Subscription;
  loadPerf = new Subject<any>();
  serviceData: any;
  method: any;
  url: string;
  data: any;
  obThis: any;
  errorMessage: any;
  callBack: (ob: any, res: any) => any;
  methodConfirm: any;
  superUserToken: string;
  isSuperUserReq: boolean = false;

  constructor(private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(forwardRef(() => LoaderService)) private loader: LoaderService) { }

  ngOnDestroy() {

  }

  ngOnInit() {
  }


  getHostname(url, callBack: (ob: any, res: any) => any = null, ob: any = null) {
    this.url = url;
    this.obThis = ob;
    this.callBack = callBack;

    let headers = new Headers();

    return this.http.get(url ,{headers: headers})
      .map((res: Response) => {
        if (callBack !== undefined && callBack !== null) {
          callBack(ob, res.json());
        }
        return res.json();
      })
      .catch(error => {
        return this.reject();
      })
      .finally(() => {
        this.hideLoader();
      });
  }

  private reject() {
    return Promise.reject("koneksi terputus");
  }

  hideLoader(): void {
    this.loader.hide();
  }
}