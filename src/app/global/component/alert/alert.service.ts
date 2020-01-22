import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { AlertMsg } from  '../../';
 
@Injectable()
export class AlertService {
    private subject = new Subject<AlertMsg>();
    private keepAfterNavigationChange = false;
 
    private show(info : string, summary: string, detail: string, time = 5000, keepAfterNavigationChange = false){        
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ info: info, summary: summary, detail: detail, time : time });
    }

    info(title: string, message: string, time = 2000, keepAfterNavigationChange = false) {
        this.show('info', title, message, time, keepAfterNavigationChange);
    }

    success(title: string, message: string, time = 3000, keepAfterNavigationChange = false) {
        this.show('success', title, message, time, keepAfterNavigationChange);
    }
 
    warn(title: string, message: string, time = 5000, keepAfterNavigationChange = false) {
        this.show('warn', title, message, time, keepAfterNavigationChange);
    } 

    error(title: string, message: string, time = 3000, keepAfterNavigationChange = false) {
        this.show('error', title, message, time, keepAfterNavigationChange);
    }
 
    getMessage(): Observable<AlertMsg> {
        return this.subject.asObservable();
    }
}