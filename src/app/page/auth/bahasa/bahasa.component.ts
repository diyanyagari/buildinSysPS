import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, UserDto, Authentication, AuthGuard, FileService, AlertService, InfoService, Configuration } from '../../../global'; 
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';

@Component({
    selector: 'app-bahasa',
    templateUrl: './bahasa.component.html',
    styleUrls: ['./bahasa.component.css'],
    providers: [ConfirmationService]
  })
export class BahasaComponent implements OnInit, OnDestroy {

    imgLoading : string = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH'
                          +'/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAAC'
                          + 'wAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkY'
                          + 'DAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRV'
                          + 'saqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMl'
                          + 'FYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAA' 
                          + 'ABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI'
                          + '5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8'
                          + 'pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4'
                          + 'CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi6'
                          + '3P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAA'
                          + 'ALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1Yh'
                          + 'iCnlsRkAAAOwAAAAAAAAAAAA==';

        constructor(private alertService: AlertService,
            private InfoService: InfoService,
            private httpService: HttpClient,
            private confirmationService: ConfirmationService,
            private fb: FormBuilder,
            private fileService: FileService,
            private authGuard: AuthGuard,
            private translate: TranslateService){
            
        }          
        
        isiLabel : any = {};
        namaLabel : string[] = [];
        dropLabelNormal : string[] = [];
        dropLabelAbnormal : string[] = [];
        isiTableNormal : any = [];
        isiTableAbnormal : any = [];

        ngOnDestroy(){
            
        }

        ngOnInit() {
            this.httpService.get(Configuration.get().authLogin + '/bahasa/negara/' + Configuration.lang).subscribe( res => {
                   this.isiLabel =  res.data.isiLabel;
                   this.namaLabel = res.data.namaLabel;
                }
            );
        }   
        
        sortDropLabel(){
            for (let i=0; i<this.namaLabel.length; i++){
                if (_.find(this.dropLabelNormal, (label:string) => {
                        return (!this.namaLabel[i].startsWith(label) && this.namaLabel[i].startsWith("frm"));
                    })
                ){
                    let lab = this.namaLabel[i].substring(0,this.namaLabel[i].indexOf('_'));    
                    this.dropLabelNormal.push(lab);
                }
            }

            for (let i=0; i<this.namaLabel.length; i++){
                if (!this.namaLabel[i].startsWith("frm")){
                    this.dropLabelAbnormal.push(this.namaLabel[i]);
                }
            }    
        }

        dataIsiLabel(event : any){
            this.isiTableNormal = [];

            for (let i=0; i<this.namaLabel.length; i++){
                if (this.namaLabel[i].startsWith(event)){
                    this.isiTableNormal.id =  this.namaLabel[i];
                    this.isiTableNormal.data = this.isiLabel[this.namaLabel[i]];
                }
            }    
        }
        
}    