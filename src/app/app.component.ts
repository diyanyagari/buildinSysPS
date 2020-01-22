import { Component, AfterViewInit, ElementRef, Renderer, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { MessageService, AuthGuard, Authentication, HttpClient, ReportService, DashboardService, NotificationService, Configuration, SocketService } from './global';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { DialogModule } from 'primeng/primeng';
import { OsService } from './global/service/os.service';

import 'rxjs/add/operator/pairwise';
import { Idle } from 'idlejs/dist';

enum MenuOrientation {
    STATIC,
    OVERLAY
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

    activeTabIndex: number = -1;

    sidebarActive: boolean = false;

    layoutMode: MenuOrientation = MenuOrientation.OVERLAY;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rotateMenuButton: boolean;

    sidebarClick: boolean;

    topbarItemClick: boolean;

    menuButtonClick: boolean;

    activeTopbarItem: any;

    documentClickListener: Function;

    theme: string = 'green';

    message: any;

    subscription: Subscription;

    infoLogin: Subscription;

    infoLaporan: Subscription;

    titleLaporan: Subscription;

    loadPerf: Subscription;

    isLogin: boolean;

    isLaporan: boolean;

    titleLap: string

    performance: boolean;

    valueBar1: any;
    valueBar2: any;
    valueBar3: any;

    pBar1: boolean;
    pBar2: boolean;
    pBar3: boolean;

    titleBar: string;
    availableDashboard: any[];
    draggedDashboard: any;
    dashboard: any[];
    dataArray: Subscription;

    loadingRouteConfig: boolean;

    showWidget: boolean;
    idleOff : any;
    constructor(public renderer: Renderer,
        private translate: TranslateService,
        private auth: Authentication,
        private authGuard: AuthGuard,
        private http: HttpClient,
        private reportService: ReportService,
        private messageService: MessageService,
        private router: Router,
        private dashboardService: DashboardService,
        private osService: OsService,
        private notificationService : NotificationService,
        private socket : SocketService
        
        
        ) {

    }

    ngOnInit() {

        this.isLogin = false;
        this.isLaporan = false;

        this.translate.setDefaultLang('1');
        this.translate.use('1');

        this.infoLogin = this.authGuard.getInfoLogin().subscribe(isLogin => this.isLogin = isLogin);
        this.subscription = this.messageService.getMessage().subscribe(message => { this.message = message; });
        this.infoLaporan = this.reportService.getInfoLaporan().subscribe(isLaporan => { this.isLaporan = isLaporan; });
        this.titleLaporan = this.reportService.getTitleLaporan().subscribe(titleLap => { this.titleLap = titleLap; });

        this.http.setAuthGuard(this.authGuard);

        this.loadPerf = this.http.getloadPerf().subscribe(dataPerf => {
            this.funDataPerf(dataPerf);
        });

        // router event listener (detect any router's changes) for activated widget side bar
        this.router.events.subscribe((event) => {
            this.showWidget = this.router.url == '/' ? true : false;

            if (event instanceof RouteConfigLoadStart) {
                this.loadingRouteConfig = true;
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loadingRouteConfig = false;
            }

        });
        // end

        // let sudah = localStorage.getItem('sw');

        // if (sudah === undefined || sudah  === null) {
        //     if (window.location.href.indexOf('viewer-pelayanan') < 0){
        //         setTimeout(()=>{
        //             if ('serviceWorker' in navigator) {
        //                 navigator.serviceWorker.register('/sw.js').then(register => {
        //                     setTimeout(() => {
        //                         register.pushManager.subscribe({
        //                             userVisibleOnly: true,
        //                             applicationServerKey: this.urlBase64ToUint8Array("BKg-JjiryYZNMJSb2VrmVhchqVMQh048v0uaktugBPmDNMIBVkGk_XJh6804nYr7ih5TQy6ShM4iI9KPeqLw2XM"),
        //                         }).then(subscription => {

        //                             let data = {
        //                                 subscription : subscription,
        //                                 kdPegawai : this.authGuard.getUserDto().kdPegawai,
        //                                 kdProfile : this.authGuard.getUserDto().kdProfile
        //                             }
            
        //                             localStorage.setItem('sw', 'sudah');
        //                             //console.log('kirim saya terdaftar di notif');
        //                             this.socket.emit('notif.desktop',JSON.stringify(data) );
        //                         });
        //                     }, 5000);

        //                 });
        //             }  
        //         }, 15 * 1000);
        //     }
        // }

        // this.sessionTimeOut();



    }

    // urlBase64ToUint8Array(base64String : string) {
    //     const padding = '='.repeat((4 - base64String.length % 4) % 4);
    //     const base64 = (base64String + padding)
    //       .replace(/-/g, '+')
    //       .replace(/_/g, '/');
  
    //     const rawData = window.atob(base64);
    //     const outputArray = new Uint8Array(rawData.length);
  
    //     for (let i = 0; i < rawData.length; ++i) {
    //       outputArray[i] = rawData.charCodeAt(i);
    //     }
    //     return outputArray;
    //   }

    // sessionTimeOut(){
    //     let urlHash = window.location.hash;
    //     console.log('IDLE')     

    //     if (urlHash !== '#/login' && urlHash !== '#/session-timeout'  && urlHash !== '#/wizards' && urlHash !== '#/viewer-pelayanan'
    //         && this.idleOff !== undefined && this.idleOff !== null){
    //         this.notificationService.logout();
    //         this.auth.logout('session-timeout');
    //     } 

    //     this.idleOff = new Idle()
    //         .whenNotInteractive()
    //         .within(Configuration.get().idleTimeOut)
    //         .do(() => this.sessionTimeOut())
    //         .start(); 
    // }   



    // dragStart(event,dashboard) {
    //     //console.log(event, dashboard);
    //     // this.dashboardService.sendObject(dashboard);
    // }
    // dragEnd(event) {
    //     //console.log(event);
    //     // this.dashboardService.sendObject({});
    // }

    funDataPerf(dataPerf: any) {
        // this.performance  = (dataPerf.loading) ? true:false;
        // if (this.performance) {

        //     if (dataPerf.pBar1){
        //         this.pBar1 = true;
        //         this.valueBar1 = dataPerf.pBar1.value;
        //     } else {
        //         this.pBar1 = false;
        //         this.valueBar1 = 0;
        //     }

        //     if (dataPerf.pBar2){
        //         this.pBar2 = true;
        //         this.valueBar2 = dataPerf.pBar2.value;
        //     } else {
        //         this.pBar2 = false;
        //         this.valueBar2 = 0;
        //     }

        //     if (dataPerf.pBar3){
        //         this.pBar3 = true;
        //         this.valueBar3 = dataPerf.pBa3.value;
        //     } else {
        //         this.pBar3 = false;
        //         this.valueBar3 = 0;
        //     }

        // }
    }

    tutupLaporan() {
        this.isLaporan = false;
    }

    ngAfterViewInit() {
        this.dataArray = this.dashboardService.getData().subscribe(ob => { this.availableDashboard = ob; });
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (!this.menuButtonClick && !this.sidebarClick && (this.overlay || !this.isDesktop())) {
                this.sidebarActive = false;
            }

            this.topbarItemClick = false;
            this.sidebarClick = false;
            this.menuButtonClick = false;
        });

        this.osService.getHostname('http://localhost:3000/getHostName').subscribe(table => {
            console.log('testHostName');
            sessionStorage.setItem('namaKomputer', table.data);
        });
    }

    onTabClick(event: Event, index: number) {
        if (this.activeTabIndex === index) {
            this.sidebarActive = !this.sidebarActive;
        }
        else {
            this.activeTabIndex = index;
            this.sidebarActive = true;
        }

        event.preventDefault();
    }

    closeSidebar(event: Event) {
        this.sidebarActive = false;
        event.preventDefault();
    }

    onSidebarClick(event: Event) {
        this.sidebarClick = true;
    }

    onTopbarMenuButtonClick(event: Event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        event.preventDefault();
    }

    onMenuButtonClick(event: Event, index: number) {
        this.menuButtonClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.sidebarActive = !this.sidebarActive;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if (this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        if (this.activeTabIndex < 0) {
            this.activeTabIndex = 0;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event: Event, item) {

        if (item === undefined || item === null) {
            return;
        }

        this.topbarItemClick = true;

        if (this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    onTopbarSearchItemClick(event: Event) {
        this.topbarItemClick = true;

        event.preventDefault();
    }

    get overlay(): boolean {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
        this.infoLogin.unsubscribe();
        this.subscription.unsubscribe();
        this.infoLaporan.unsubscribe();
        this.dataArray.unsubscribe();
    }

}