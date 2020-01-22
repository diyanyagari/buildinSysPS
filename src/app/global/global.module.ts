import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, MessagesModule, GrowlModule, ProgressBarModule, ConfirmDialogModule, DialogModule } from 'primeng/primeng';
//import { globalComps } from './';
import * as global from './';

const globalComps = [
	global.AlertComp,
	global.InfoComp,
    global.LoaderComp,
    global.ImagePipe,
//    global.PDFPipe,
    global.TrueFalsePipe,
    global.RoundNumPipe,
	global.ReportComp,
	global.AppCalenderComponent,
	global.SplitCharTPipe
];


@NgModule({ 
	declarations :[ ...globalComps ],
	imports : [ CommonModule, SharedModule, MessagesModule, GrowlModule, ProgressBarModule, ConfirmDialogModule, DialogModule ],
	exports : [ ...globalComps]
})

export class GlobalModule {}

