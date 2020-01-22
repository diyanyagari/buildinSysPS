import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { LoaderState } from '../../';


@Injectable()
export class LoaderService {

    private loaderSubject = new Subject<LoaderState>();

    count = 0;

    show() {
        this.count++;
        this.loaderSubject.next(<LoaderState>{show: true});
        
    }

    hide() {
        this.count--;
        if (this.count <= 0) {
            this.loaderSubject.next(<LoaderState>{show: false});
        }
        
    }


	getLoaderShow(): Observable<LoaderState> {
		return this.loaderSubject.asObservable();
    }
}