import { Component, OnInit, OnDestroy } from '@angular/core';
import { InfoService, InfoMsg } from  '../../';
import { Message } from 'primeng/primeng';

import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-info',
    template: ' <p-messages id="myDiv" [value]="msgs"></p-messages>'
})

export class InfoComp implements OnInit, OnDestroy {

	message: InfoMsg; 
    messageAll: InfoMsg[];
	msgs: Message[] = [];

    private showSA: Subscription;
    private showS: Subscription;
    private hideS: Subscription;


    constructor(private infoService: InfoService) { }
 
    ngOnInit() {
        this.showSA = this.infoService.getMessageAll().subscribe(messageAll => { this.showInfoAll(messageAll); });
        this.showS = this.infoService.getMessage().subscribe(message => { this.showInfo(message); });
        this.hideS = this.infoService.hidenMessage().subscribe(() => this.hide());
        console.log('ngOnInit info');
    }

    ngOnDestroy() {
        this.showS.unsubscribe();
        this.hideS.unsubscribe();
    }

    showInfoAll(message : InfoMsg[]){
        this.msgs = [];
        for (let i = 0; i < message.length; i++) {
            this.msgs.push({severity: message[i].info, summary:message[i].summary, detail:message[i].detail});
        }    
    }

    showInfo(message : InfoMsg){
    	this.msgs = [];
        this.msgs.push({severity: message.info, summary:message.summary, detail:message.detail});
    }

    hide() {
        this.msgs = [];
    }
}