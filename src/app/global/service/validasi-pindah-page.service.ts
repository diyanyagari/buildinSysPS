import {
    CanActivate,
    ActivatedRouteSnapshot,
    CanDeactivate,
    RouterStateSnapshot
} from '@angular/router';
import { Injectable, Injector, ComponentFactoryResolver } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { Inject, forwardRef } from '@angular/core';


export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | boolean;
}

@Injectable()
export class ValidasiPindahPage implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot){

        let url: string = state.url;
        if (!component) {
            return true;
        }
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
