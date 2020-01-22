import { Scope } from '@angular/core/src/profile/wtf_impl';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
//import { DataPegawai, PegawaiDokumen } from './data-pegawai.interface';
import { Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, SelectItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
import { MenuItem, FileUploadModule} from 'primeng/primeng';
import { Http, HttpModule }    from '@angular/http';
import { Router } from "@angular/router";
@Component({
  selector: 'app-profile-p',
  templateUrl: './profile-perusahaan.component.html',
  styleUrls: ['./profile-perusahaan.component.css'],
  providers: [ConfirmationService],
})
export class ProfilePerusahaan implements OnInit {

	constructor(
	    private http : HttpClient, 
	    private httpService: HttpClient,
	    private alertService : AlertService,
	    private InfoService: InfoService,
	    private translate: TranslateService,
	    private confirmationService: ConfirmationService,
	    private fb: FormBuilder,
	    private fileService: FileService,
	    private route: Router) {
    
    
  }

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

    proses : boolean = false;

  	statusText : string;

  	kdJenisProfile : any[]; 
  	kdJenisKelamin : any[]; 
	form: FormGroup;
	foto:any;
	smbrFoto: string;
	namaFoto : string = null;

  	resFile: string;
  	namaFile : string;

  	loading : boolean = false;

  	berhasil : boolean = false;

    sJenisIndustri : string = ""; 
	sNamaPerusahaan : string = ""; 
	sHostname : string = "";                          
	sUsername : string = "";

  ngOnInit() {
    this.init();		
  }


  init(){
    this.loading  = false;
    this.proses  = false;
    this.berhasil  = false;


    this.statusText = "Proses Pembuatan Perusahaan";

    this.form = this.fb.group({
            'kdJenisProfile': new FormControl(null, Validators.required),
            'fileExcelProfile': new FormControl(null, Validators.required),
            'fileExcelMaster': new FormControl(null, Validators.required),
            'fileExcelPegawai': new FormControl(null, Validators.required),
        });

    this.httpService.get(Configuration.get().resourceFile + '/wizard/jenis-profile').subscribe(res => {
      this.kdJenisProfile = [];
      this.kdJenisProfile.push({ label: '-- Pilih --', value: null });

      for (var i = 0; i < res.data.length; i++) {
        this.kdJenisProfile.push({ label: res.data[i].namaJenisProfile, value: res.data[i] })
      }

    }); 

  }	

  urlUpload(){
    return Configuration.get().resourceFile + '/file/upload';
  }

  fileUploadProfile(event){
  	this.resFile = event.xhr.response;
    this.namaFile = this.resFile.toString();
    this.form.controls["fileExcelProfile"].setValue(this.namaFile);
  }

  fileUploadMaster(event){
  	this.resFile = event.xhr.response;
    this.namaFile = this.resFile.toString();
    this.form.controls["fileExcelMaster"].setValue(this.namaFile);
  }

  fileUploadPegawai(event){
  	this.resFile = event.xhr.response;
    this.namaFile = this.resFile.toString();
    this.form.controls["fileExcelPegawai"].setValue(this.namaFile);
  }

  validateAllFormFields(formGroup: FormGroup) {         
      Object.keys(formGroup.controls).forEach(field => {  
          const control = formGroup.get(field);             
          if (control instanceof FormControl) {             
              control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {      
              this.validateAllFormFields(control);           
          }
      });
  }

  addHeader(event){
    this.httpService.beforeUploadFile(event);
  }

  setTimeStamp (date){
  	let dataTimeStamp = (new Date(date).getTime()/1000);
   	return dataTimeStamp;
  }

  simpan() {
  	this.statusText = "Proses Pembuatan Perusahaan....";

  	let formVal = this.form.value;
  	this.sJenisIndustri = formVal.kdJenisProfile.namaJenisProfile;

  	formVal.kdJenisProfile = formVal.kdJenisProfile.kdJenisProfile;

  	this.proses = true;
    this.loading = true;               

    this.httpService.post(Configuration.get().resourceFile + '/wizard/data-awal', formVal).subscribe(response => {
        this.alertService.success('Simpan', 'Data Disimpan');
        this.statusText = "Proses Berhasil.";
        this.loading = false;
        this.berhasil  = true;
    }, error => {
        this.loading = false;
        this.statusText = "Proses Gagal.";
    });

  }	

  kembali(){
    this.berhasil  = false;
    this.proses = false;
  }

  onSubmit() {
      if (this.form.invalid) {
          this.validateAllFormFields(this.form);
          this.alertService.warn("Peringatan","Data belum lengkap, harap lengkapi")
      } else {
           this.simpan();
      }
  }


}