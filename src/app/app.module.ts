import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CustomFormsModule } from 'ng2-validation';

import { AppRoutes } from './app.routes';
import { AppComponent } from './';
import { apps } from './';

//import 'rxjs/add/operator/toPromise';

// Jangan nambah module di sini kecuali dipakai oleh App..
// tambahkan di shared.module.ts
// tambahkan ke export dan importnya

/*translation */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Service
import { primeAppModule } from './';
import { GlobalModule } from './global/global.module';
import { TranslateLoaderService } from './global/service/translate-loader-service';
import { pagesAuth } from './page/auth';
import { pageRedirect } from './steps/';
import * as global from './global';
import { Configuration } from './global';

import { CalendarModule } from 'primeng/primeng';

// import { ConfigurableTranslateHttpLoader } from './global/service/translate-loader';
import { JS2JPrintModule } from './global/print/js2jprint/js2jprint';


// import { HotkeyModule } from 'angular2-hotkeys';
import { HttpClient } from 'selenium-webdriver/http';
const globalServices = [
    global.SocketService,
    global.SuperUserService,
    global.SettingsService,
    global.MessageService,
    global.HttpClient,
    global.AuthGuard,
    global.NotificationService,
    global.AlertService,
    global.InfoService,
    global.Authentication,
    global.FileService,
    global.LoaderService,
    global.ReportService,
    global.DashboardService,
    global.RowNumberService,
    global.ValidasiPindahPage,
    global.PrinterService,
    global.CalculatorAgeService,
    global.OsService
];

@NgModule({
    declarations: [
        ...apps,
        ...pagesAuth,
        ...pageRedirect,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue: 'id-ID' },
        ...globalServices
    ],
    imports: [
        ...primeAppModule,
        CalendarModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutes,
        HttpModule,
        RouterModule,
        CustomFormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderService,
              deps: [Http]
            }
        //   })
        // TranslateModule.forRoot({
        //     loader: {
        //         provide: TranslateLoader,
        //         useFactory: createTranslateLoader,
        //         deps: [Http]
        //     }
        }),
        GlobalModule,
        // HotkeyModule.forRoot(),
        JS2JPrintModule
    ],
    exports: [
        ...primeAppModule,
        FormsModule,
        HttpModule,
        RouterModule,
        CustomFormsModule,
        ReactiveFormsModule,
        GlobalModule,
        TranslateModule],
    bootstrap: [AppComponent]
})
export class AppModule { }

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
    let langKdModulAplikasi = JSON.parse(localStorage.getItem('langKdModulAplikasi'));
    let kdModulAplikasi = null;
    let version = null;
    let kdProfile = null;
    if (langKdModulAplikasi) {
        if (langKdModulAplikasi.kdModulAplikasi) {
            kdModulAplikasi = langKdModulAplikasi.kdModulAplikasi;
        } else {
            kdModulAplikasi = "E2";
        }

        if (langKdModulAplikasi.kdVersion) {
            version = langKdModulAplikasi.kdVersion;
        } else {
            version = "2";
        }
        if (langKdModulAplikasi.kdProfile) {
            kdProfile = langKdModulAplikasi.kdProfile;
        } else {
            kdProfile = "2";
        }

    } else {
        kdModulAplikasi = "E2";
        version = "2";
        kdProfile = "2";
    }

    return new TranslateHttpLoader(http, Configuration.get().authLogin + '/auth/lang/' + kdProfile + '/' + kdModulAplikasi + '/' + version + '/', '.json');
}


//        pRegistrasiPegawai.ProsesRegistrasiPegawaiComponent,
//        ...pagesMaster,
//        ...pagesRegistrasiPegawai,
//        ...pagesOrientasi,
//        ...pagesPhk,
//        ...pagesPersonalAffairs,
//        ...pagesKarir,
//        ...pagesPenggajianPajak,
//        Dashboard,
//        MonitoringHistoryAbsensiComponent,
//        DataAsuransi2Component,
//        OnlyNumber,
//        HandleDialogComponent



        // NgDraggableWidgetModule,
        // AngularDraggableModule,
        // DragulaModule,
        // MatIconModule, 
        // MatButtonModule, 
        // MatSelectModule, 
        // MatInputModule, 
        // MatTooltipModule, 
        // MatCheckboxModule, 
        // MatSidenavModule,
//        GridsterModule,  



//        MatProgressBarModule,


//import { MatProgressBarModule } from '@angular/material';



//Import Mapping Folder Sesuai Menu
//import { pagesMaster } from './page/master';
//import * as pRegistrasiPegawai from './page/database-histori-pegawai';
//import { pagesOrientasi } from './page/orientasi-pegawai';
//import { pagesPhk } from './page/phk';
//import { pagesPersonalAffairs } from './page/personal-affairs';
//import { pagesKarir } from './page/karir';
//import { pagesPenggajianPajak } from './page/penggajian-pajak';
//import { HitungPesangonComponent } from './page/phk/hitung-pesangon/hitung-pesangon.component';

//import { Dashboard } from './page/dashboard/dashboard.component';
//import { MonitoringHistoryAbsensiComponent } from './page/penggajian-pajak/monitoring-history-absensi/monitoring-history-absensi.component';
//import { DataAsuransi2Component } from './page/database-histori-pegawai/data-asuransi2/data-asuransi2.component';
//import { OnlyNumber } from './page/master/login-user/onlynumber.directive';
//import { HandleDialogComponent } from './page/auth/handle-dialog/handle-dialog.component';

// Module Draggable cuman yang dipakai baru ngDragulaModule untuk drag and drop dashboard

// ini url documentasi ng2-dragula https://valor-software.com/ng2-dragula/index.html
// import { NgDraggableWidgetModule } from 'ngx-draggable-widget';
// import { DragulaModule } from 'ng2-dragula';
// import { AngularDraggableModule } from 'angular2-draggable';
// import { GridsterModule } from './lib';


// import {
//   MatIconModule,
//   MatButtonModule,
//   MatSelectModule,
//   MatInputModule,
//   MatTooltipModule,
//   MatCheckboxModule, 
//   MatSidenavModule
// } from '@angular/material';
