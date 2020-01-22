import { Component, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { Authentication } from './global';
import { Router } from '@angular/router';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { HttpClient, Configuration,  MessageService, AuthGuard, InfoService, SettingsService, NotificationService } from './global'; 
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService],
})
export class AppTopBar implements OnInit, OnDestroy {
    
    menuSettings : Subscription;
    notifEvent : Subscription;

    dataProfile: any;
    infoLogin: any

    kdpeg: any;

    smbrFile:any
    smbrFoto: string;
    listDropdownBahasa:any[];
    
    constructor( /*@Inject(forwardRef(() => AppComponent))*/ public app : AppComponent,
                private route: Router,
                private translate: TranslateService,               
                private httpService: HttpClient,
                private auth : Authentication,
                private authGuard : AuthGuard,
                private settings : SettingsService,
                private info : InfoService,
                private confirmationService : ConfirmationService,
                private notificationService : NotificationService) {}

    namaLogin: string = '';
    namaPerusahaan : string = '';
    imageThumbs : string = 'profile1213123.png';
    lihatSetting : boolean;
    listNotification : any[];
    showNotif : boolean = false;
    jmlNotif = 0;

    ngOnDestroy(){
        this.menuSettings.unsubscribe();
        this.notifEvent.unsubscribe();
    }

    trackByFn(index, item){
      return index;
    }

    carilah(event){
        if (event.target.value == undefined || event.target.value == null || event.target.value == '' || event.target.value.trim() == ''){
            return;
        }
        console.log('hasilcari' + event.target.value);        
//        localStorage.setItem('hasilcari', event.target.value);
        this.route.navigate(['pencarian'], { queryParams: { cari: event.target.value } });
    }

    ngOnInit(){
        this.imageThumbs = Configuration.get().resourceFile + '/image/show/' + this.authGuard.getImageThumbs();
        
        this.lihatSetting = this.settings.getAllow();

        this.menuSettings = this.settings.getAllowSettings().subscribe(show => {            
            this.lihatSetting = show;
            this.namaLogin = this.authGuard.getNamaLogin();
            this.namaPerusahaan = this.authGuard.getNamaPerusahaan();
            this.imageThumbs = Configuration.get().resourceFile + '/image/show/' + this.authGuard.getImageThumbs();
        });    


        this.notifEvent = this.notificationService.eventNotification().subscribe(load => {
            if (load){
                 this.loadNotif();
            } else {
                this.showNotif = false;
            }
        });


        this.kdpeg = this.authGuard.getUserDto().kdPegawai;                
        this.smbrFoto = Configuration.get().resourceFile + '/image/show/noimage.jpg';
        this.dataProfile = { 
            'pegawai' : {
                'namaLengkap': '-',
                'nIKIntern':'-',
                'namaDepartemen':'-',
                'unitKerja': '-',
                'namaJabatan': '-',
                'tglMasuk': '-',
                'masaKerja': '-',
                'photoDiri' : null
            }
        }

        this.httpService.get(Configuration.get().dataHr1Mod1 + '/registrasiPegawai/findProfilePegawaiByKode/'+this.kdpeg).subscribe(table => {
            this.dataProfile = table.data

            if (this.dataProfile == undefined || 
                this.dataProfile == null ||
                this.dataProfile.pegawai === undefined || 
                this.dataProfile.pegawai === null){
                
                this.dataProfile = { 
                    'pegawai' : {
                        'namaLengkap': '-',
                        'nIKIntern':'-',
                        'namaDepartemen':'-',
                        'unitKerja': '-',
                        'namaJabatan': '-',
                        'tglMasuk': '-',
                        'masaKerja': '-',
                        'photoDiri' : null
                    }
               }

            }

            if (this.dataProfile.pegawai.nIKIntern === undefined ||  this.dataProfile.pegawai.nIKIntern === null){
                this.dataProfile.pegawai.nIKIntern = '-';
            }    

            // if (this.dataProfile.pegawai.nIKIntern === undefined ||  this.dataProfile.pegawai.nIKIntern === null){
            //     this.nIKIntern = '-';
            // } else {
            //     this.nIKIntern = this.dataProfile.pegawai.nIKIntern;
            // }

            if (this.dataProfile.pegawai.photoDiri == null || this.dataProfile.pegawai.photoDiri == undefined){                  
                this.smbrFoto = Configuration.get().resourceFile + '/image/show/noimage.jpg';
            } else {
                this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.dataProfile.pegawai.photoDiri
            }   
        });

        this.httpService.get(Configuration.get().dataMasterNew + '/bahasa/findAllBahasa?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(table => {
            this.listDropdownBahasa = [];
            for (var i = 0; i < table.bahasa.length; i++) {
              this.listDropdownBahasa.push({
                label: table.bahasa[i].namaBahasa, value: table.bahasa[i].kode.kode
              })
            };
          });



    }

    checkNotif(event, data){
        event.preventDefault();

        this.notificationService.checkNotif(data);
        this.loadNotif();
    }

    loadNotif(){
        let tNotif = this.notificationService.getListNotif();
        this.listNotification = [];

        if (tNotif === undefined || tNotif === null || tNotif.length < 1) {
            return;
        }

        for (let i=0; i< tNotif.length; i++){
            this.listNotification[i] = tNotif[i];
        }

        this.jmlNotif = this.listNotification.length;
        this.showNotif = this.listNotification.length > 0;
	
	    let notifH = (this.listNotification.length * 142);
	    let bodyH = document.body.clientHeight -   (document.getElementById("tinggiTopBar").scrollHeight + 50);
	    this.notifW = bodyH > notifH?notifH:bodyH; 

    }
	
    notifW = 0;

    showSettings(event: Event){
        event.preventDefault();

        this.confirmationService.confirm({
          message: '<div>Harap simpan pekerjaan sebelum mengubah settings.<br/>Yakin akan melanjutkan?</div>',
          header: 'Peringatan',
          accept: () => {
            this.settings.show();
          },
          reject: () => {}
        });  
        
    }

    fromPegawaiOke(fromPegawai){
        return fromPegawai !== undefined && fromPegawai !== null;
    }

    dariUnitKerjaOke(dariUnitKerja){
        return dariUnitKerja !== undefined && dariUnitKerja !== null;
    }
   
    logout(event: Event){

        event.preventDefault();
        // this.auth.logout();
        // window.alert("jgn lupa dibalikin sebelum dipush");
        this.confirmationService.confirm({
          message: '<div>Harap simpan pekerjaan sebelum logout.<br/>Yakin akan melanjutkan?</div>',
          header: 'Peringatan',
          accept: () => {
            this.httpService.get(Configuration.get().authLogin +'/off/sign-out-all' ).subscribe(res => {
                this.notificationService.logout();
                this.auth.logout();    
            }, error => {
                this.info.warn('Peringatan', 'Logout tidak berhasil, harap coba lagi atau cek koneksi internet anda.');
            });           
          },
          reject: () => {

          }

        });  

    }
    changeLanguage(param:string){
        this.translate.use(param);
        this.translate.setDefaultLang(param);
        event.preventDefault();  
        this.httpService.get(Configuration.get().authLogin + '/auth/change-bahasa/'+param).subscribe(response => {
        }); 
    }

}
