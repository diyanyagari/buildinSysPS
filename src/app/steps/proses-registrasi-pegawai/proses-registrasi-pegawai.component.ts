import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {StepsModule,MenuItem} from 'primeng/primeng';
import { Router} from "@angular/router";
import { SettingsService, AuthGuard } from '../../global';
import * as _ from 'underscore';


@Component({
    selector: 'app-proses-registrasi-pegawai',
    templateUrl: './proses-registrasi-pegawai.component.html',
    styleUrls: ['./proses-registrasi-pegawai.component.scss']
})
export class ProsesRegistrasiPegawaiComponent implements OnInit {
    items: MenuItem[];
    activeIndex: number = 0;
    isNew:boolean;
    namaLogin: string

    constructor(private route: Router,
        private authGuard: AuthGuard,
        private settingsService: SettingsService) { }
    ngOnInit() {
        this.namaLogin = this.authGuard.getNamaLogin();
        this.activeIndex = parseInt(localStorage.getItem('proses-registrasi-pegawai'));
        let dataBaru = localStorage.getItem('status-step'+this.namaLogin)
        if (dataBaru == "true") {
            this.isNew = true
        } else {
            this.isNew = false
        }
        this.items = [
        {
            label: 'Data Pegawai',
            command: (event: any) => {
                this.activeIndex = 0;
                this.route.navigate(['registrasi-pegawai']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Alamat',
            command: (event: any) => {
                this.activeIndex = 1;
                this.route.navigate(['alamat']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Histori',
            command: (event: any) => {
                this.activeIndex = 2;
                this.route.navigate(['tab-riwayat']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Referensi Pegawai',
            command: (event: any) => {
                this.activeIndex = 3;
                this.route.navigate(['referensi-pegawai']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Kontak Darurat',
            command: (event: any) => {
                this.activeIndex = 4;
                this.route.navigate(['emergency-contact']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Keahlian Bahasa',
            command: (event: any) => {
                this.activeIndex = 5;
                this.route.navigate(['keahlian-bahasa']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Dokumen Pelengkap',
            command: (event: any) => {
                this.activeIndex = 6;
                this.route.navigate(['upload-dokumen']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Rekening Bank',
            command: (event: any) => {
                this.activeIndex = 7;
                this.route.navigate(['rekening-bank']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Daftar Komponen Gaji',
            command: (event: any) => {
                this.activeIndex = 8;
                this.route.navigate(['registrasi-komponen-gaji']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Fasilitas Perusahaan',
            command: (event: any) => {
                this.activeIndex = 9;
                this.route.navigate(['fasilitas-perusahaan']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Keluarga',
            command: (event: any) => {
                this.activeIndex = 10;
                this.route.navigate(['keluarga']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        {
            label: 'Data BPJS',
            command: (event: any) => {
                this.activeIndex = 11;
                this.route.navigate(['data-asuransi']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        },
        /*{
            label: 'Data BPJS',
            command: (event: any) => {
                this.activeIndex = 10;
                this.route.navigate(['data-asuransi2']);
                localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
            }
        }*/



        ];

        /// cara filter kotak.
        
        // let listUrl = this.settingsService.getCurrentURL();
        // let listLabel = this.settingsService.getCurrentLabel();
        // let newItems =  [];

        // for (let i=0; i<this.items.length; i++){
        //     let label = this.items[i].label;    
        //     if (listLabel[label] === undefined || listLabel[label] === null){
        //         newItems =  _.without(this.items, this.items[i]);
        //     }

        //     this.items[i].command = function(event: any){
        //         this.activeIndex = i;
        //         this.route.navigate(['fasilitas-perusahaan']);
        //         localStorage.setItem('proses-registrasi-pegawai',String(this.activeIndex));
        //     }

        // }

        // this.items = newItems;

        // cara filter kotak.
    }

}