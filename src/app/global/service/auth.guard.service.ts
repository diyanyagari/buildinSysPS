import { Inject, Injectable, forwardRef, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { HttpClient } from './HttpClient'; 
import { UserDto } from '../dto/iUserDto'; 
import { NotificationService } from './notification.service'; 
import { SettingsService } from './settings.service'; 
import { AlertService } from '../component/alert/alert.service'; 
 
@Injectable()
export class AuthGuard implements CanActivate, OnInit {

    private subject = new Subject<boolean>();
    private tokenSubject = new Subject<UserDto>();
    private curLogin: boolean;
    private userDto: UserDto;

    constructor(private router: Router, 
        @Inject(forwardRef(() => AlertService)) private alert : AlertService, 
        @Inject(forwardRef(() => NotificationService)) private notificationService : NotificationService,
        @Inject(forwardRef(() => SettingsService)) private settingsService: SettingsService) { 

        this.notificationService.setAuthGuard(this);
        let mana = localStorage.getItem('user.data');
        if (mana !== undefined && mana !== null){
            this.userDto = JSON.parse(mana);
        }
        
    }

    ngOnInit(){
        this.notificationService.setAuthGuard(this);
    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {     
        this.isLogin();
        if (this.curLogin) {
            let urlList = this.settingsService.getCurrentURL();
            let curUrl = state.url
            if (curUrl == '/'){
                return true;
            }
            if (this.getUserDto().kdKelompokUser == 1){
                return true;
            }
            if (urlList[curUrl] == undefined || urlList[curUrl] == null || urlList[curUrl] != 1){
                this.alert.warn('Peringatan', 'Maaf, anda tidak punya hak akses, silahkan hubungi admin')
                return false;
            }
            return true;  
        } else {
            this.router.navigate(['login']/*, { queryParams: { returnUrl: state.url }}*/);
            return false;
        }
     }

     setUserDto(userDto: UserDto){
         this.userDto = userDto;
         if (this.userDto !== undefined || this.userDto !== null ){
             localStorage.setItem('user.data', JSON.stringify(this.userDto));
         }
     }

     getUserDto(){
        if ( this.userDto.kdLokasi == undefined ||  this.userDto.kdLokasi == null) {
            this.userDto.kdLokasi = '001'
        }   
        return this.userDto;
     }

    checkLogin() {
        if (this.userDto != undefined && this.userDto != null){
            this.curLogin = true;

            this.notificationService.notifListperRuangan(this.userDto.ruangan);
            this.notificationService.notifListperJabatan(this.userDto.pegawai);

        } else {
            this.curLogin = false;            
        }
        this.tokenSubject.next(this.userDto);
        return this.curLogin;
    }

    isLogin(){
        this.checkLogin();
        this.subject.next(this.curLogin);
        return this.curLogin;
    }

    getInfoToken (): Observable<UserDto> {
        return this.tokenSubject.asObservable();
    }

    getInfoLogin(): Observable<boolean> {
        return this.subject.asObservable();
    }

    getNamaLogin() : string {
        if (this.userDto.pegawai === undefined || this.userDto.pegawai === null){
           return "";
        } else {    
            return this.userDto.pegawai.namaLengkap;
        }        
    }

    getNamaLokasi() : string {
        if (this.userDto.lokasi === undefined || this.userDto.lokasi === null){
           return "";
        } else {    
            return this.userDto.lokasi.namaRuangan;
        }        
    }

    getNamaPerusahaan() : string {
        if (this.userDto.profile === undefined || this.userDto.profile === null){
           return "";
        } else {    
            return this.userDto.profile.namaLengkap;
        }

    }

    logout(){
        localStorage.clear();
    }

    getImageThumbs() : string {
        if (this.userDto.pegawai === undefined || 
            this.userDto.pegawai === null || 
            this.userDto.pegawai.photoDiri === undefined|| 
            this.userDto.pegawai.photoDiri === null){
            return 'profile1213123.png';
        } else {
            return this.userDto.pegawai.photoDiri;
        }
    }
}