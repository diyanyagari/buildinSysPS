
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, AlertService, InfoService, Configuration, AuthGuard, SettingsService} from '../../../global';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-pencarian',
    templateUrl: './pencarian.component.html',
  })
export class PencarianComponent implements OnInit,OnDestroy {

    constructor(private route: ActivatedRoute,
                private settingsService:SettingsService){

    }

    cari : string
    sub : any;
    muncul = true
    ketemu = true

    label : string[]
    qcari : string = ''
    peringatan : boolean = false

    ngOnInit() {
        this.sub = this.route
        .queryParams
        .subscribe(params => {           
            this.cari = '';
            this.label = []
            this.qcari = params['cari'] || null;            
            this.ketemu  = true
        
            if ( this.qcari.trim().length < 4){
                this.muncul = false
                this.peringatan = true
                return
             } else {
                this.muncul = true
                this.peringatan = false
             }
            setTimeout(()=>{
                let hasilcari = this.qcari//localStorage.getItem('hasilcari');
                this.ketemu  = false
                let menu = this.settingsService.getCurrentMenu();
                if (hasilcari != undefined && hasilcari != null){
                    this.cari = this.extractMenu(hasilcari, menu)
                }
                this.muncul = false
            },3000)  
        });
    }

    extractMenu(hasilcari : string, menu:any[]){
        let cari = ''
        for (let i=0; i<menu.length; i++) {
            let anak = (menu[i].items == undefined || menu[i].items == null || menu[i].items.length == 0)
            let belum = !this.label.includes(menu[i].label)
            let pos = menu[i].label.toLowerCase().indexOf(hasilcari.toLowerCase())
            if (belum && pos> -1){
                this.ketemu = true
                let nmMenu = menu[i].label
                this.label.push(nmMenu)
                let nnMenu = nmMenu.substr(pos, hasilcari.length)
                let label = (anak)?'link menu ':'induk menu '
                cari += '<li> Ditemukan ' + label + '<strong>' + nmMenu.split(nnMenu).join('<span class="kuning">' + nnMenu + '</span>') + '</strong>'
                if (!anak){
                    cari += ' dan memiliki anak menu sebagai berikut:<ul>'
                    cari += this.labelMenu(hasilcari, menu[i].items)
                    cari += '</ul>'
                } else {
                    cari += ' dan bisa diakses lewat <a class="wajib" href="#' +  menu[i].routerLink[0] + '">link</a> ini.' 
                }
                cari += '</li>'
            }

            if (!anak){
                cari += this.extractMenu(hasilcari, menu[i].items)
            }

        }

        return cari
    }
    
    labelMenu(nnMenu : string, menu:any[]){
        let cari = ''
        for (let i=0; i<menu.length; i++) {
            let anak = (menu[i].items == undefined || menu[i].items == null || menu[i].items.length == 0)
            let label = (anak)?'Akses ke link menu ':'Induk menu '
            let nmMenu = menu[i].label
            this.label.push(nmMenu)
            cari += '<li> '  + label + '<strong>' + nmMenu.split(nnMenu).join('<span class="kuning">' + nnMenu + '</span>') + '</strong>'
            if (!anak){
                cari += ' ini juga memiliki anak menu sebagai berikut:<ul>'
                cari += this.labelMenu(nnMenu, menu[i].items)
                cari += '</ul>'
            } else {
                cari += ' bisa diakses lewat <a class="wajib" href="#' +  menu[i].routerLink[0] + '">link</a> ini.' 
            }
            cari += '</li>'
        }   
        return cari 
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }

}    


