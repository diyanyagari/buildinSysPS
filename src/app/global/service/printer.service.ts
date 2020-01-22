import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import * as shajs from 'sha.js';
import * as qz from 'qz-tray';
import * as RSVP from 'rsvp';
import { sha256 } from 'js-sha256';
import { HttpClient } from '../../global/service/HttpClient';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../global';
import { Inject, forwardRef, Component, OnInit } from '@angular/core';

@Injectable()
export class PrinterService {
    statusConnect: boolean;
    constructor(
        private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private fileService: FileService,
        private authGuard: AuthGuard,
        @Inject(forwardRef(() => ReportService)) private print: ReportService,
        @Inject(forwardRef(() => HttpClient)) private http: HttpClient) { }

    errorHandler(error: any): Observable<any> {
        console.log('error handler');
        return Observable.throw(error);
    }


    getAllPrinter(callBack: (ob: any, res: string) => any = null, ob: any) {
        qz.api.setSha256Type(data => sha256(data));
        qz.api.setPromiseType(resolver => new Promise(resolver));
        if (!this.statusConnect) {
            qz.websocket.connect()
                .then(this.statusConnect = true)
                .then(qz.printers.find)
                .then(printer => {
                    callBack(ob, printer);
                })
                .catch(err => console.error(err));
        } else {
            qz.printers.find()
                .then(printer => {
                    callBack(ob, printer);
                })
                .catch(err => console.error(err));
        }

    }

    getPrinterDefault(callBack: (ob: any, res: string) => any = null, ob: any) {
        qz.api.setSha256Type(data => sha256(data));
        qz.api.setPromiseType(resolver => new Promise(resolver));

        qz.websocket.connect()
            .then(qz.printers.getDefault)
            .then(printer => {
                let allPrinter = [];
                for (let i = 0; i < printer.length; i++) {
                    allPrinter[i] = printer[i];
                }
                return allPrinter;
            })
            // .then(qz.websocket.disconnect)
            .catch(err => console.error(err));
    }

    // Get the SPECIFIC connected printer
    getPrinter(printerName: string): Observable<string> {
        return Observable
            .fromPromise(qz.websocket.connect().then(() => qz.printers.find(printerName)))
            .map((printer: string) => printer)
            .catch(this.errorHandler);
    }

    // Print data to chosen printer
    printData(res, namaPrinter) {
        var top = 0.25, right = 0.25, bottom = 0.25, left = 0.25;
        qz.api.setSha256Type(data => sha256(data));
        qz.api.setPromiseType(resolver => new Promise(resolver));
        if (!this.statusConnect) {
            qz.websocket.connect()
                .then(this.statusConnect = true)
                .then(qz.printers.find)
                .then(printer => {
                    var config = qz.configs.create(namaPrinter, {
                        size: { width: 3.36, height: 2.55 }, units: 'in',
                        orientation: 'portrait',
                        margins:0
                        // colorType: 'grayscale', 
                        // interpolation: "nearest-neighbor" 
                    });
                    // config.setPrinter(namaPrinter);
                    this.printa(config, res);
                })
                .catch(err => console.error(err));
        } else {
            var config = qz.configs.create(namaPrinter, {
                size: { width: 3.36, height: 2.55 }, units: 'in',
                orientation: 'portrait',
                margins: 0
                // colorType: 'grayscale', 
                // interpolation: "nearest-neighbor" 
            });
            // config.setPrinter(namaPrinter);
            this.printa(config, res);
        }

    }

    printa(config, res) {
        var data = [];
        var file = new Blob([res], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(file);
        let base64data;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            base64data = reader.result;
            let spl = base64data.split(',');
            console.log(spl)
            data = [{
                type: 'pdf',
                format: 'base64',
                data: spl[1]
            }];
            return qz.print(config, data).catch(function (e) { console.error(e); });
            // return qz.print(config, data).then(function (data) {
            //     console.log('Sent to printer:' + JSON.stringify(data));
            // });
        };

    }

    // Disconnect QZ Tray from the browser
    removePrinter(): void {
        qz.websocket.disconnect();
    }
}