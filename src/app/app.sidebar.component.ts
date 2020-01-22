import { Component, Input, OnInit, OnDestroy, EventEmitter, ViewChild, Inject, forwardRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { AppMenuComponent }  from './app.menu.component';
import { DashboardService } from './global/service/dashboard.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-sidebar',
      templateUrl: './app.sidebar.component.html'
})
export class AppSideBarComponent implements OnInit, OnDestroy {
    
    sideBar: any;
    constructor(/*@Inject(forwardRef(() => AppComponent))*/ public app:AppComponent, private dashboard: DashboardService) {}
    subject : Subscription;

   ngOnInit() {
    Promise.resolve(null).then(() => {
      this.subject = this.dashboard.currentDashboard.subscribe(data => this.sideBar = data);
    });
   }

   ngOnDestroy(){
     this.sideBar = [];
     this.subject.unsubscribe();
   }

   dragStart(item) {
    this.dashboard.dropWidget(item);
    }
}