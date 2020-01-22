import { Component, OnInit, OnDestroy } from '@angular/core';
//import { MatProgressBarModule } from '@angular/material';
//import { ProgressBarModule } from 'primeng/primeng'; 
import { Subscription } from 'rxjs/Subscription';

import { LoaderService, LoaderState } from '../../';

// @Component({
//     selector: 'angular-loader',
//     templateUrl: 'loader.component.html',
//     styleUrls: ['loader.component.css']
// })

@Component({
    selector: 'app-loader',
    template: '<div [class.loader-hidden]="!show">'
            + '<div class="loader-overlay" >'
            + '<div>'
            + '<p-progressBar mode="indeterminate" *ngIf="show"></p-progressBar>'
            + '</div>'
            + '</div>'
            + '</div>',

    styles: ['.loader-hidden {'
            + '  visibility:hidden;'
            + '}'
            + '.loader-overlay {'
            + '  position:fixed;'
            + '  width:100%;'
            + '  opacity:1;'
            + '  z-index:10000;'
            + '}']
})

export class LoaderComp implements OnInit, OnDestroy {

    show = false;

    private subscription: Subscription;

    constructor(private loaderService: LoaderService) { }

    ngOnInit() { 
        this.subscription = this.loaderService.getLoaderShow().subscribe(state => {
            this.show = state.show;
        });
        console.log('ngOnInit loader');     
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}