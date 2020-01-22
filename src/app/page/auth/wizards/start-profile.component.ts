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
  selector: 'app-start-profile',
  templateUrl: './start-profile.component.html',
  styleUrls: ['./start-profile.component.css'],
  providers: [ConfirmationService],
})
export class StartProfileComponent implements OnInit {

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
    
    this.smbrFoto = Configuration.get().resourceFile + "/image/show/noimage.jpg";
  }
	
  proses : boolean = false;
  back : boolean = false;
  statusText : string;
  kdJenisProfile : any[]; 
  kdJenisKelamin : any[]; 
  kdNegara : any[]; 
	form: FormGroup;
	foto:any;
	smbrFoto: string;
	namaFoto : string = null;
  resFile: string;
  namaFile : string;
  loading : boolean = false;
  berhasil : boolean = false;
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
  sNegara : string = "";  
  sJenisIndustri : string = ""; 
  sNamaPerusahaan : string = ""; 
  sHostname : string = "";                          
  sJabatan : string = "";
  sDepartement : string = "";
  sUnitKerja : string = "";
  sNamaLengkap : string = "";
  sJenisKelamin : string = "";
  sTanggalLahir : Date = new Date();
  sUsername : string = "";
  responseEmail : string ="";
  dataEmailTersedia : boolean = true;
  dataEmailTidakTersedia : boolean = true; 

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
            'namaLengkap': new FormControl(null, Validators.required),
            'hostname1': new FormControl(''),
            'kdNegara': new FormControl(null, Validators.required),
            'gambarLogo': new FormControl(''),
            // 'jabatan': new FormControl('', Validators.required),
            // 'departement': new FormControl('', Validators.required),
            // 'unitKerja': new FormControl('', Validators.required),
            // 'namaUserEmail': new FormControl('', Validators.required),
            // 'namaAwal': new FormControl('', Validators.required),
            // 'namaTengah': new FormControl(''),
            // 'namaAkhir': new FormControl(''),
            // 'kdJenisKelamin': new FormControl(null, Validators.required),
            // 'tglLahir': new FormControl('', Validators.required),
            'fileExcel': new FormControl('', Validators.required),
            //'tglMasuk': new FormControl(null),
            //'tglDaftar': new FormControl(null),
//            'ambilFoto': new FormControl('', Validators.required),            
        });

    this.kdJenisKelamin = [];
    this.kdJenisKelamin.push({ label: '-- Pilih Jenis Kelamin --', value: null })
    this.kdJenisKelamin.push({ label: 'Laki-Laki', value: 1 })
    this.kdJenisKelamin.push({ label: 'Perempuan', value: 2 })
    this.dataEmailTersedia = false;
    this.dataEmailTidakTersedia = false;
    this.responseEmail= "";

    this.httpService.get(Configuration.get().resourceFile + '/wizard/jenis-profile').subscribe(res => {
      this.kdJenisProfile = [];
      this.kdJenisProfile.push({ label: '-- Pilih Jenis Industri --', value: null });

      for (var i = 0; i < res.data.length; i++) {
        this.kdJenisProfile.push({ label: res.data[i].namaJenisProfile, value: res.data[i] })
      }

    }); 

    this.httpService.get(Configuration.get().resourceFile + '/wizard/find-negara').subscribe(res => {
      this.kdNegara = [];
      this.kdNegara.push({ label: '-- Pilih Negara --', value: null });

      for (var i = 0; i < res.data.length; i++) {
        this.kdNegara.push({ label: res.data[i].namaNegara, value: res.data[i] })
      }

    });  
 

  }

  urlUpload(){
    return Configuration.get().resourceFile + '/file/upload?noProfile=false';
  }
  
  fotoUpload(namaBaru){
    this.foto = namaBaru;
    this.form.get('gambarLogo').setValue(this.foto);
    this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.foto + '?noProfile=false';
  }
  
  fileUpload(event){
    this.namaFoto = event.xhr.response;
    this.smbrFoto = Configuration.get().resourceFile + '/image/show/' + this.namaFoto + '?noProfile=false';
  }

  downloadpegawai(){
    window.location.href = Configuration.get().resourceFile + '/file/download/MasterDataDanPegawaiTemplate.xlsx?noProfile=false';
  }

  fileUploadExcel(event){
     this.resFile = event.xhr.response;
     this.namaFile = this.resFile.toString();
     this.form.controls["fileExcel"].setValue(this.namaFile);
  }

  iniKesana(event){
    this.emailFormatCheck(event);
    this.sUsername = 'admin@' + event.target.value;
  }

  emailFormatCheck(event){    
    let regExpr = /[^a-zA-Z0-9-._]/;
     let str1 = event.target.value;
     if(str1 != undefined && str1.length > 0){
      str1 = str1.replace(regExpr,'');
      this.form.get('hostname1').setValue(str1);
      let str2 = str1.split('.');
      if(str2.length >= 2 ){
         if(str2[1].length >=1){
           this.httpService.get(Configuration.get().resourceFile + '/wizard/cekEmail?host=' + str1).subscribe(res => {           
              if(res.status == true){
                this.dataEmailTersedia = true;
                this.dataEmailTidakTersedia = false;
                this.responseEmail= "tersedia";
              }else{
                this.dataEmailTersedia = false;
                this.dataEmailTidakTersedia = true;
                this.responseEmail = "Hostname telah digunakan";
              } 
          });           
         }else{
            this.dataEmailTersedia = false;
            this.dataEmailTidakTersedia = true;
            this.responseEmail = "Format tidak valid";
          }
      } else{
        this.dataEmailTersedia = false;
        this.dataEmailTidakTersedia = true;
        this.responseEmail = "Format tidak valid";
      }
    }
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

        //let tglLahirTS 	= this.setTimeStamp(this.form.get('tglLahir').value)
      	//let tglMasukTS 	= this.setTimeStamp(this.form.get('tglMasuk').value)
      	//let tglDaftarTS = this.setTimeStamp(this.form.get('tglDaftar').value)

        let formVal = this.form.value;

        formVal.namaUserEmail = this.sUsername;
        formVal.namaUserMobile = formVal.namaUserEmail;
        formVal.jenisKelamin = formVal.kdJenisKelamin == 1 ? "Laki-Laki" : "Perempuan";

        this.sJenisIndustri = formVal.kdJenisProfile.namaJenisProfile;
        this.sNegara = formVal.kdNegara.namaNegara;
        this.sNamaPerusahaan = formVal.namaLengkap;
        this.sHostname = formVal.hostname1;

        // this.sJabatan = formVal.jabatan;
        // this.sDepartement = formVal.departement;
        // this.sUnitKerja = formVal.unitKerja;
        // this.sNamaLengkap = formVal.namaAwal;
        // this.sUsername = formVal.namaUserEmail;


        // if (formVal.namaTengah !== undefined && formVal.namaTengah !== null && formVal.namaTengah != ''){
        //   this.sNamaLengkap = this.sNamaLengkap + " " + formVal.namaTengah; 
        // }

        // if (formVal.namaAkhir !== undefined && formVal.namaAkhir !== null && formVal.namaAkhir != ''){
        //   this.sNamaLengkap = this.sNamaLengkap + " " + formVal.namaAkhir; 
        // }  

        // this.sJenisKelamin = formVal.jenisKelamin;
        // let d = formVal.tglLahir.getDate();
        // let m = formVal.tglLahir.getMonth() + 1;
        // let y = formVal.tglLahir.getFullYear();
        
        // this.sTanggalLahir = formVal.tglLahir.toDateString();        

        // formVal.tglLahir = tglLahirTS;
        
        formVal.kdJenisProfile = formVal.kdJenisProfile.kdJenisProfile;
        formVal.kdNegara = formVal.kdNegara.kode;

        //formVal.tglLahir = tglMasukTS;
        //formVal.tglLahir = tglDaftarTS;

       
        this.loading = true;     
        this.proses = true;          

        this.httpService.post(Configuration.get().resourceFile + '/wizard/data-awal', formVal).subscribe(response => {
            this.alertService.success('Simpan', 'Data Disimpan');
            this.statusText = "Proses Berhasil.";
            this.loading = false;
            this.berhasil  = true;
        }, error => {
            this.loading = false;
            this.back = true;
            this.statusText = "Proses Gagal.";
        });
  }	

  kembali(){
    this.berhasil  = false;
    this.proses = false;
  }

  login(){
    this.route.navigate(['login']/*, { queryParams: { returnUrl: state.url }}*/);
  }

  onSubmit() { 
    if(this.dataEmailTidakTersedia){
          this.alertService.warn("Peringatan","Data belum valid, harap diperbaiki")
    }else{
      if (this.form.invalid) {
          this.validateAllFormFields(this.form);
          this.alertService.warn("Peringatan","Data belum lengkap, harap lengkapi")
      } else {
           this.simpan();
      }
    }
  }


}	