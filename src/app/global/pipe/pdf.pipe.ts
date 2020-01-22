import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../config';
import { HttpClient } from '../service/HttpClient';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

//@Pipe({name: 'pdfsec'})
export class PDFPipe /*implements PipeTransform*/ {

  // constructor(private http: HttpClient) {}

  // transform(url: string) {
  //       if (url === null || url === undefined ){
  //           return "";
  //       }  

  //       let subject = new Subject<string>()

  //       this.http.getForced(url).subscribe(res => {
  //           var file = new Blob( [res], {type: 'application/pdf'});
  //           var url = window.URL.createObjectURL(file)
  //           subject.next(url)
  //           subject.complete()
  //         });

  //       return subject.asObservable();
  // }

}