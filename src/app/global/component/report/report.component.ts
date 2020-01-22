import { Component } from '@angular/core';
import { DialogModule } from 'primeng/primeng';
import { HttpClient } from '../../../global';

@Component({
  selector: 'pdf-report',
  template: '<p-dialog header="Laporan" [(visible)]="display"' + 
  '  width="700" responsive="true" showEffect="fade" [modal]="true"> ' +
     '<div id="report-pdf" style="height: 100px;">Report Here</div>'+
     ' </p-dialog>'
})
export class ReportComp {

  display:boolean;
  
	private options:any;
	private myPDF:any;
	private urlPDF:string;
  private http: HttpClient;

	constructor() { }
}
