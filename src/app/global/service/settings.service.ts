import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { SettingInfo } from  './settings.interface';

@Injectable()
export class SettingsService {

	private state : SettingInfo;
    private menu : any;

    private settings = new Subject<boolean>();
    private allow = new Subject<boolean>();
    
	show() {
        this.settings.next(true);
    }

    getSettingsShow() : Observable<boolean> {
		return this.settings.asObservable();
    }

    //////////////////////////////////////////////


    getCurrentInfo() : SettingInfo {
        if (this.state === undefined || this.state === null){
            let mana = localStorage.getItem('user.state');
            if (mana !== undefined && mana !== null){
                this.state = JSON.parse(mana);
            }    
        }
        return this.state;
    }

    setSettingInfo(stateO : SettingInfo){
        this.state = stateO;
        this.allow.next(this.getAllowBoolean());
        localStorage.setItem('user.state', JSON.stringify(stateO));
    }

    getAllow(){
        this.getCurrentInfo();
        return this.getAllowBoolean();
    }

    getAllowBoolean() : boolean {
        return (
            (this.state !== undefined && this.state !== null) &&
            ((this.state.profileA !== undefined && this.state.profileA !== null && this.state.profileA.length > 1)
                 || 
             (this.state.modAppA !== undefined && this.state.modAppA !== null && this.state.modAppA.length > 1) 
                 || 
             (this.state.ruanganA !== undefined && this.state.ruanganA !== null && this.state.ruanganA.length > 1))
            );
    }

    getAllowSettings() : Observable<boolean>{
        return this.allow.asObservable();
    }



    /////////////////


    getCurrentMenu() {
        let mana = localStorage.getItem('user.menu');
        if (mana !== undefined && mana !== null){
            this.menu = JSON.parse(mana);
        }    

        return this.menu;
    }

    setCurrentMenu(menuO : any){
        localStorage.setItem('user.menu', JSON.stringify(menuO));
    }

    getCurrentURL() {
        let mana = localStorage.getItem('user.url');
        if (mana !== undefined && mana !== null){
            this.menu = JSON.parse(mana);
        }    

        return this.menu;
    }

    setCurrentURL(menuO : any){
        localStorage.setItem('user.url', JSON.stringify(menuO));
    }


    getCurrentLabel() {
        let mana = localStorage.getItem('user.label');
        if (mana !== undefined && mana !== null){
            this.menu = JSON.parse(mana);
        }    

        return this.menu;
    }

    setCurrentLabel(menuO : any){
        localStorage.setItem('user.label', JSON.stringify(menuO));
    }

}	
