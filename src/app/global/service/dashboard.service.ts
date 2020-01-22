import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
 
@Injectable()
export class DashboardService {
    private subject = new Subject<any>();
    private dataArray = new Subject<any>();
    sendObject(message: any) {
        this.subject.next(message);
    }
 
    clearObject() {
        this.subject.next();
    }
 
    getObject(): Observable<any> {
        return this.subject.asObservable();
    }
	sendData(data: any) {
		this.dataArray.next(data)
	}
	clearData() {
		this.dataArray.next();
    }
 
	getData(): Observable<any> {
        return this.dataArray.asObservable();
    }

	// NEW 
	// untuk sidebar widget
	private sideBarDashboard = new BehaviorSubject([]);
	currentDashboard = this.sideBarDashboard.asObservable();

	// untuk temp data yg di drop
	private temp_drop = new BehaviorSubject({});
	currenDrop = this.temp_drop.asObservable();

	// ketika remove widget lalu sinkron dengan sidebar
	sendDataBaru(data: any) {
		this.sideBarDashboard.next(data);
	}

	// ketika drop widget lalu sinkron dengan sidebar
	dropWidget(data: any) {
		this.temp_drop.next(data);
	}
	// END
}