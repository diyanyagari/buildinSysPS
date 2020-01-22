import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SettingsService, InfoService } from '../../global'; 

@Component({
    selector: 'app-redirect-proses-registrasi-pegawai',
    templateUrl: './redirect-proses-registrasi-pegawai.component.html',
})
export class RedirectProsesRegistrasiPegawaiComponent implements OnInit {

    link  = [   
                'registrasi-pegawai',
                'alamat',
                'tab-riwayat',
                'referensi-pegawai',
                'emergency-contact',
                'keahlian-bahasa',
                'upload-dokumen',
                'rekening-bank',
                'registrasi-komponen-gaji',
                'fasilitas-perusahaan',
                'keluarga',
                'data-asuransi',
                
            ]

    constructor(private route: Router, 
                private info : InfoService, 
                private settingsService: SettingsService) { 

    }
    ngOnInit(){
        let urlList = this.settingsService.getCurrentURL();
        for (let i=0; i<this.link.length; i++){
            if (!(urlList['/' + this.link[i]] == undefined || urlList['/' + this.link[i]] == null || urlList['/' + this.link[i]] != 1)){
                localStorage.setItem('proses-registrasi-pegawai',String(i));
                this.route.navigate([this.link[i]]);
                break;
            }
        }
    }
}