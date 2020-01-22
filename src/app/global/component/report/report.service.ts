import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { DialogModule } from 'primeng/primeng';
import { HttpClient } from '../../../global';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { LoaderState } from '../../';
import * as $ from 'jquery';

@Injectable()
export class ReportService {

    private subject = new Subject<any>();
    private subjectMsg = new Subject<any>();

    display:boolean;

    private options:any;
    private myPDF:any;
    private urlPDF:string;

    constructor( @Inject(forwardRef(() => HttpClient)) private http: HttpClient) {}

    getInfoLaporan(): Observable<any> {
        return this.subject.asObservable();
    }

    getTitleLaporan(): Observable<any> {
        return this.subjectMsg.asObservable();
    }

    openLaporan(title : string) {
        this.subject.next(true);
        this.subjectMsg.next(title);
    }
 
    tutupLaporan() {
        this.subject.next(false);
    }

    private embedPDF(urlPDF: string, embed:boolean, height:number){
        var w = $(window).height(); 
        var h = w - height;

//        $("#report-pdf-embed").height();

//        let me = this;

        setTimeout(() => {
            document.getElementById("report-pdf-embed").innerHTML = '<img src="assets/layout/images/buble2.gif" />' 
            this.http.getForced(urlPDF).subscribe(res => {
                document.getElementById("report-pdf-embed").style.height = h + "px";
                var file = new Blob( [res], {type: 'application/pdf'});
                var url = window.URL.createObjectURL(file)
                document.getElementById("report-pdf-embed").innerHTML = '<embed src="' + url + '#zoom=100&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                console.log(document.getElementById("report-pdf-embed").innerHTML);
            });
        }, 500);
    }

    private embedPDFGeneric(urlPDF: string, data, embed:boolean, height:number){
        var w = $(window).height(); 
        var h = w - height;

//        $("#report-pdf-embed").height();

        let me = this;

        setTimeout(function(){
            me.http.genericReport(urlPDF, data).subscribe(res => {
                document.getElementById("report-pdf-embed").style.height = h + "px";
                var file = new Blob( [res], {type: 'application/pdf'});
                var url = window.URL.createObjectURL(file)

                document.getElementById("report-pdf-embed").innerHTML = '<embed src="' + url + '#zoom=100&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';

                // $("#report-pdf").innerHTML = '<iframe src="' + url + '#zoom=100&zoom=100" width="100%" height="100%">'
                //     'Tidak bisa menampilkan PDF <a href="/pdf/sample-3pp.pdf">Download PDF</a>' +
                //     '</iframe>';

                console.log(document.getElementById("report-pdf-embed").innerHTML);

            });
        }, 500);
    }

    private embedPDFGenericXLSX(urlPDF: string, data, embed:boolean, height:number){
        var w = $(window).height(); 
        var h = w - height;

//        $("#report-pdf-embed").height();

        let me = this;

        setTimeout(function(){
            me.http.genericReport(urlPDF, data).subscribe(res => {
                document.getElementById("report-pdf-embed").style.height = h + "px";
                var file = new Blob( [res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var url = window.URL.createObjectURL(file)

                document.getElementById("report-pdf-embed").innerHTML = '<embed src="http://docs.google.com/gview?url=' + url + '&embedded=true#zoom=100&toolbar=1" type="application/vnd.ms-excel" width="100%" height="100%"></embed>';

                // $("#report-pdf").innerHTML = '<iframe src="' + url + '#zoom=100&zoom=100" width="100%" height="100%">'
                //     'Tidak bisa menampilkan PDF <a href="/pdf/sample-3pp.pdf">Download PDF</a>' +
                //     '</iframe>';

                console.log(document.getElementById("report-pdf-embed").innerHTML);

            });
        }, 500);
    }

    showEmbedXLSXReport(urlPDF:string, title:string = 'Report', data: any = 'normal', height:number = 200){
        this.openLaporan(title);
        this.embedPDFGenericXLSX(urlPDF, data, false, height);    
    }     

    showEmbedPDFReport(urlPDF:string, title:string = 'Report', data: any = 'normal', height:number = 200){
        this.openLaporan(title);
        if (data === undefined || data === null || data === 'normal'){
            this.embedPDF(urlPDF, false, height);            
        } else {
            this.embedPDFGeneric(urlPDF, data, false, height);    
        }
    }    
}