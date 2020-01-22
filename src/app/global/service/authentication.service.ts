import { Inject, forwardRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Configuration } from '../config'; 
import { UserDto } from '../dto/iUserDto'; 
import { AuthGuard } from './auth.guard.service';
import { NotificationService } from './notification.service'; 
import { MessageService } from './message.service'; 
import { AlertService } from '../component/alert/alert.service'; 
import { InfoService } from '../component/info/info.service'; 

import 'rxjs/add/operator/map'
 
@Injectable()
export class Authentication {

    authDto : any;
    superDto : any;

    constructor(private http: Http, 
        private router: Router,
        @Inject(forwardRef(() => AuthGuard)) private authGuard : AuthGuard,
        @Inject(forwardRef(() => InfoService)) private info : InfoService,
        @Inject(forwardRef(() => AlertService)) private alert : AlertService) { }

    delete_cookie(name: string){
        var today = new Date();
        var expr = new Date(today.getTime() + (-1 * 24 * 60 * 60 * 1000));
        document.cookie = name + '=;expires=' + (expr.toUTCString());
    }

    private createUserDto(user : any) : UserDto {
        let userDTO :  UserDto;

        let ikdProfile = user.data.kdProfile;
        let ikdModulAplikasi = user.data.kdModulAplikasi;
        let ikdRuangan = user.data.kdRuangan;
        let ikdLokasi = user.data.kdLokasi;
        
        userDTO = {
            id : user.data.namaUser,
            token : user[Configuration.get().headerToken],
            waktuLogin : Date.now(),

            encrypted : user.data.encrypted,
            namaUser : user.data.namaUser,
            kdUser : user.data.kdUser,
            
            idProfile : ikdProfile,
            kdProfile : ikdProfile,
            profile: user.data.profile,
            profiles: user.data.profiles,    

            idModulAplikasi : ikdModulAplikasi,
            kdModulAplikasi : ikdModulAplikasi,            
            modulAplikasi: user.data.modulAplikasi,
            modulAplikasis: user.data.modulAplikasis,   

            idLokasi : ikdLokasi,
            kdLokasi : ikdLokasi,
            lokasi: user.data.lokasi,
            lokasis: user.data.lokasis,       

            idRuangan : ikdRuangan,
            kdRuangan : ikdRuangan,
            ruangan: user.data.ruangan,
            ruangans: user.data.ruangans,     
            
            kdBahasa: user.data.kdBahasa,
            kdVersion: user.data.kdVersion,  

            idPegawai : user.data.kdPegawai,
            kdPegawai : user.data.kdPegawai,
            pegawai: user.data.pegawai,

            idDepartemen : user.data.kdDepartemen,
            kdDepartemen : user.data.kdDepartemen,
            departemen: user.data.departemen,

            idKelompokUser : user.data.kdKelompokUser,  
            kdKelompokUser : user.data.kdKelompokUser,
            kelompokUser : user.data.kelompokUser,                 

            noCM : user.data.noCM,
            pasien : user.data.pasien,

            namaPerusahaan: ''
        };
        return userDTO;
    }
 
    login(id: string, password: string) {
        window.localStorage.clear();

        this.delete_cookie('authorization');
        this.delete_cookie('statusCode');
        this.delete_cookie('io'); 
        
        if (!Date.now) {
          Date.now = function now() {
            return new Date().getTime();
          };
        }

        return this.http.post(Configuration.get().authLogin+'/auth/sign-in/login', 
            {   namaUser: id.trim(), kataSandi: password.trim() })
        .map((response: Response) => {
            let user = response.json();
            this.authDto = user;
            if (user) {
                let userDTO = this.createUserDto(user);
                //localStorage.setItem('user.data', JSON.stringify(userDTO));
                return userDTO;
            }
            return user;
        });
    }

    logProfile(authDto : any){
        return this.http.post(Configuration.get().authLogin+'/auth/sign-in/set-profile', authDto)
        .map((response: Response) => {
            let user = response.json();
            this.authDto = user;
            if (user) {
                let userDTO = this.createUserDto(user);
                //localStorage.setItem('user.data', JSON.stringify(userDTO));
                return userDTO;
            }
            return user;
        });
    }

    logModulApp(authDto : any){
        return this.http.post(Configuration.get().authLogin+'/auth/sign-in/set-modul-aplikasi', authDto)
        .map((response: Response) => {
            let user = response.json();
            this.authDto = user;
            if (user) {
                let userDTO = this.createUserDto(user);
                //localStorage.setItem('user.data', JSON.stringify(userDTO));
                return userDTO;
            }
            return user;
        });
    }

    logLokasi(authDto : any){
        return this.http.post(Configuration.get().authLogin+'/auth/sign-in/set-lokasi', authDto)
        .map((response: Response) => {
            let user = response.json();
            this.authDto = user;
            if (user) {
                let userDTO = this.createUserDto(user);
                //localStorage.setItem('user.data', JSON.stringify(userDTO));
                return userDTO;
            }
            return user;
        });
    }

    logRuangan(authDto : any){
        return this.http.post(Configuration.get().authLogin+'/auth/sign-in/set-ruangan', authDto)
        .map((response: Response) => {
            let user = response.json();
            this.authDto = user;
            if (user) {
                let userDTO = this.createUserDto(user);
                //localStorage.setItem('user.data', JSON.stringify(userDTO));
                return userDTO;
            }
            return user;
        });
    }


    loginSuperUser(sid: string, password: string, id: string){
        return this.http.post(Configuration.get().authLogin+'/auth/sign-in/login', 
            {namaUser: id.trim(), kataSandi : 'byPass', suNamaUser: sid.trim(), suKataSandi: password.trim() })
            .map((response: Response) => {
                let user = response.json();
                if (user && user[Configuration.get().headerToken]) {
                   let userDTO = this.createUserDto(user);
                   return userDTO;
                }    
                return user;   
            });   
    }
 
    logout() {
        // Ini hanya sementara 
        localStorage.removeItem('langKdModulAplikasi');
        localStorage.removeItem('user.data');
        this.authGuard.setUserDto(null);
        this.authGuard.isLogin();
        this.router.navigate(['login']);
        //this.alert.success('Logout', 'Berhasil logout');
    }
}