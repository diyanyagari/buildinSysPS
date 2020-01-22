import { Inject, forwardRef, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { AuthGuard } from './auth.guard.service';
import { SocketService } from './socket.service';
import { NotifInfo } from './notification.interface'; 

import * as _ from 'underscore';

@Injectable()
export class NotificationService {

	listNotification : any[] = null;
	loadDariNotif : boolean = false;
	menu : any[];

    authGuard : AuthGuard;

	private loadNotif = new Subject<boolean>();

	constructor(@Inject(forwardRef(() => SocketService))  private socket:SocketService){
		
	}

    setAuthGuard(authGuard : AuthGuard){
        this.authGuard = authGuard;
    }

	eventNotification()  : Observable<boolean> {
		return this.loadNotif.asObservable();
	}

	getListNotif(){
		if (this.listNotification === undefined || this.listNotification === null || this.listNotification.length == 0){
			this.listNotification = JSON.parse(window.localStorage.getItem('listNotification'));
		}
		return this.listNotification;
	}


	responSocketBuatNotif(ob : NotificationService, data : string){

        console.log('Dapat notif ini : ' + data);

		var objectData = JSON.parse(data);
        //var objectData = oData.data;

        // var lDataRuangan = this.authGuard.getUserDto().kdRuangan;

        // if (lDataRuangan == undefined || lDataRuangan == null){
        //     return;
        // }   

        // var dataRuangan = dataRuangan = JSON.parse(lDataRuangan);

        // if (dataRuangan == undefined && dataRuangan == null){
        //     return;
        // }    


        var modulAplikasiId = ob.authGuard.getUserDto().kdModulAplikasi;

        if (modulAplikasiId == undefined || modulAplikasiId == null){
            return;
        }


        console.log('isi data : %s', data);

         var listNotif = [];


        for (var i=0; i<objectData.length; i++){

            var dataNotif : NotifInfo = objectData[i].data ;

            var kdProfile = dataNotif.kdProfile;
            
            var dariRuangan = dataNotif.dariRuangan;
            var kdRuanganTujuan = dataNotif.kdRuanganTujuan;
            var kdJabatanTujuan = dataNotif.kdJabatanTujuan;
            var kdModulAplikasiTujuan = dataNotif.kdModulAplikasiTujuan;
            var kdObjekModulAplikasiTujuan = dataNotif.kdObjekModulAplikasiTujuan;
            var titleNotifikasi =dataNotif.titleNotifikasi;
            var pesanNotifikasi = dataNotif.pesanNotifikasi;
            var fromKdPegawai = dataNotif.fromKdPegawai;
            var fromPegawai = dataNotif.fromPegawai;
            var urlForm = dataNotif.urlForm;
            var namaFungsiFrontEnd = dataNotif.namaFungsiFrontEnd;

            //this.menu = ;

            //var adaObjekModul = this.recursiveArray(this.menu, kdObjekModulAplikasiTujuan);  ngecek ke menu dinamic             

            let adaObjekModul: boolean = true; // dihardcoded dulu

            let lanjut = ((ob.authGuard.getUserDto().kdRuangan == kdRuanganTujuan) || 
                         (ob.authGuard.getUserDto().pegawai.kdJabatan == kdJabatanTujuan)) && 
                         (ob.authGuard.getUserDto().kdProfile == kdProfile) &&
                         (modulAplikasiId == kdModulAplikasiTujuan) && 
                         adaObjekModul;

            if (lanjut ) {
                var singleNotif = {
                    "title": titleNotifikasi,
                    "kdProfile" : dataNotif.kdProfile,
                    "description": pesanNotifikasi,
                    "fromKdPegawai" : fromKdPegawai,
                    "fromPegawai" : fromPegawai,
                    "dariUnitKerja" : dariRuangan,
                    "namaFungsiFrontEnd" : namaFungsiFrontEnd, //setTimeout("this." + namaFungsiFrontEnd + "()", 10);
                    "urlForm": urlForm,
                    "date": Date.now()
                };

                listNotif.push(singleNotif);
            }

        }

        if (listNotif.length > 0) {
            var lastNotif = listNotif[listNotif.length-1];

            if (window.location.href.indexOf(lastNotif.urlForm) >= 0){
                //$rootScope.kendoGridUImagic(); // ini untuk refresh otomatis tutup dulu
            }    
        }

        ob.listNotification = listNotif;

        if (listNotif.length <= 0){
            window.localStorage.removeItem('listNotification');
            ob.loadNotif.next(false);
        }else {
            window.localStorage.setItem('listNotification', JSON.stringify(ob.listNotification));    
            ob.loadNotif.next(true);               
        }

        
	}

	notifListperRuangan(ruangan){
		if (ruangan == undefined || ruangan == null || 
            ruangan.kdRuangan == undefined || ruangan.kdRuangan == null){
            return;
        }

        let pattern = ruangan.kdProfile + "_";

        this.socket.on('listNotif.ruangan.' + pattern + ruangan.kdRuangan, this.responSocketBuatNotif, this);
        this.socket.emit('kdRuangan', pattern + ruangan.kdRuangan.toString());
        console.log("connect ke ruangan %s", pattern + ruangan.kdRuangan.toString());
	}

    notifListperJabatan(pegawai){
        if (pegawai == undefined || pegawai == null || 
            pegawai.kdJabatan == undefined || pegawai.kdJabatan == null){
            return;
        }

        let pattern = pegawai.kdProfile + "_";

        this.socket.on('listNotif.jabatan.' + pattern + pegawai.kdJabatan, this.responSocketBuatNotif, this);
        this.socket.emit('kdJabatan', pattern + pegawai.kdJabatan.toString());
        console.log("connect ke jabatan %s", pattern + pegawai.kdJabatan.toString());
    }    

    logout(){
        this.socket.emit('logout', this.authGuard.getUserDto().pegawai);
    }

	hapusNotifListPerRuangan(){
		
	}

	checkNotif(data){
        let pattern = this.authGuard.getUserDto().kdProfile + "_" ;
        let notifnya = {
            data: data,
            type: 1
        };
		var dataKirim  = {
            kdRuangan : pattern + this.authGuard.getUserDto().kdRuangan,
            kdJabatan : pattern + this.authGuard.getUserDto().pegawai.kdJabatan,
            notif : notifnya
        };

        this.listNotification = _.without(this.listNotification, data);
        

        if (this.listNotification.length > 0){
             window.localStorage.setItem('listNotification', JSON.stringify(this.listNotification));
        } else {
            window.localStorage.removeItem('listNotification');
        }

        var msgNotif = JSON.stringify(dataKirim);

        this.socket.emit('deleteNotif', msgNotif);

        if (data.urlForm == undefined || data.urlForm == null){
            return;
        }

        if (window.location.href.indexOf(data.urlForm) < 0){
            window.location.href = data.urlForm;
            this.loadDariNotif = true;
        }
	}

	recursiveArray(arr, kdObjekModulAplikasiTujuan = null){
		var oke = false;

        for (var i=0; i<arr.length; i++){
            console.log('Id %d', arr[i].id);
            if (arr[i].id == kdObjekModulAplikasiTujuan){
                return true;
            }

            if (arr[i].children == undefined){
                continue;
            }
            oke = this.recursiveArray(arr[i].children);
        }

        return oke;
	}

}