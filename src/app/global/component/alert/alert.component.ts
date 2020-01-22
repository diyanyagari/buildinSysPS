import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, AlertMsg } from  '../../';
import { Message } from 'primeng/primeng';

import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-alert',
    template: '<p-growl [value]="msgs" [life]="time" [style]="{\'width\':\'450px\'}"></p-growl>'
})

export class AlertComp implements OnInit, OnDestroy {
	message: AlertMsg;
	msgs: Message[] = [];

    private showS: Subscription;
    private time = 10000;

    constructor(private alertService: AlertService) { }
 
    ngOnInit() {
        this.showS = this.alertService.getMessage().subscribe(message => { 
            this.showAlert(message, message.time);
         });
        console.log('ngOnInit alert');
    }

    ngOnDestroy() {
        this.showS.unsubscribe();
    }

    showAlert(message, time = 10000){
        this.time = time;
    	this.msgs = [];
        this.msgs.push({severity: message.info, summary:message.summary, detail:message.detail});
    }
}