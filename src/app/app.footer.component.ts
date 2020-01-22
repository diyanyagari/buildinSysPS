import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AuthGuard } from './global';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-footer',
    template: `
    <!-- <div class="footer clearfix">
    </div> -->
    <!-- start -->
    <!-- edit by uiux 110917 -->
    <!-- fungsi menampilkan help & support bar -->
    <div class="bottom-bar ui-g-12">
        <div class="ui-g-6">
           <div class="footer-links" style="color: #000; margin-left: 0px; font-size: 10px"> 
               <span>{{'Pengguna : ' | translate | splitCharT }} </span>
               <span><strong>{{ namaLogin }}</strong></span>
               <span class="link-divider">|</span>
               <!-- <span class="link-divider">{{'dari' | translate | splitCharT }}</span> -->
               <span><strong>{{ namaPerusahaan }} </strong></span> 
               <span class="link-divider">|</span>
               <span class="link-divider">{{'Kantor : ' | translate | splitCharT }}</span>
               <span><strong>{{ namaLokasi }} </strong></span>
               <span class="link-divider">|</span>
               <span class="link-divider">{{'Unit Kerja : ' | translate | splitCharT }}</span>
               <span><strong>{{ unitKerja }} </strong></span> 
               <span class="link-divider">|</span>
               <span class="link-divider">{{'Hostname : ' | translate | splitCharT }}</span>
               <span><strong>{{ namaKomputerSesion }} </strong></span>  
           </div> 
        </div>
        <div class="ui-g-3">
            <div class="footer-links" style="color: #000; text-align:center; margin-left: 5px;  margin-right: 5px; font-size: 10px">
                <!-- <a href="#" class="first">Terms</a> -->
                <!-- <span class="link-divider">|</span> -->
                <!-- <a href="#">About</a>> -->
                <!-- <span class="link-divider">|</span> -->
                <!-- <a href="#">Privacy</a> -->
                <!-- <span class="link-divider">|</span> -->
                <!-- <a href="#">Contact</a> -->
                <!-- <span class="link-divider">|</span> -->
                <!-- <a href="#">Map</a> -->
                <!-- <span class="link-divider">|</span> -->
                <!-- <span>Copyright PT. Sentral Link Solutions</span> -->
                <!-- <span class="link-divider">|</span> -->
                <span>Copyright PT. Jasamedika Saranatama</span>
            </div>        
        </div>    
        <div class="help-support-wrapper ui-g-3">
            <span class="help-support ui-g-11"><i class="fa fa-question-circle-o"> </i> Help & Support</span>
            <span class="help-support ui-g-1" style="text-align: right;"><i class="fa fa-chevron-up"></i></span>
        </div>a
    </div>
    <!-- fungsi menampilkan help & support bar -->
    <!-- end -->
    `
})
export class AppFooter implements OnInit, OnDestroy {
    constructor(private authGuard : AuthGuard) { }
    
    namaLogin: string = "";
    namaPerusahaan : string = "";
    namaLokasi : string = "";
    unitKerja : string = "";
    namaKomputerSesion: string = "";
    // private nmLS: Subscription;
    // private nmPS: Subscription;

    ngOnDestroy(){
        // debugger;
        // this.nmLS.unsubscribe();
        // this.nmPS.unsubscribe();
    }

    ngOnInit(){
        this.namaLogin = this.authGuard.getNamaLogin();
        this.namaLokasi = this.authGuard.getNamaLokasi();
        this.namaPerusahaan = this.authGuard.getNamaPerusahaan();
        this.unitKerja = this.authGuard.getUserDto().ruangan.namaRuangan;
        this.namaKomputerSesion= sessionStorage.getItem('namaKomputer');

        
        // this.nmLS = this.authGuard.getNamaLogin().subscribe(nama => { this.namaLogin = nama; debugger; });
        // this.nmPS = this.authGuard.getNamaPerusahaan().subscribe(nama => { this.namaPerusahaan = nama;  debugger; });       
    }
}