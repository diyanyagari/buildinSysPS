import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SettingsService, InfoService } from '../../global'; 

@Component({
    selector: 'app-redirect-proses-penggajian',
    templateUrl: './redirect-proses-penggajian.component.html',
})
export class RedirectProsesPenggajianComponent implements OnInit {

    link  = [   
                'rekapitulasi-perhitungan-absensi',
                'rekapitulasi-perhitungan-lembur',
                'payroll'
            ]

    constructor(private route: Router, 
                private info : InfoService, 
                private settingsService: SettingsService) { 

    }
    ngOnInit(){
        let urlList = this.settingsService.getCurrentURL();
        for (let i=0; i<this.link.length; i++){
            if (!(urlList['/' + this.link[i]] == undefined || urlList['/' + this.link[i]] == null || urlList['/' + this.link[i]] != 1)){
                localStorage.setItem('proses-penggajian', String(i));
                this.route.navigate([this.link[i]]);
                break;
            }
        }
    }
}