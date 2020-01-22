import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataPegawai } from './login-user.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService, TreeTableModule,TreeNode,SharedModule } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, HttpClient } from '../../../global';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  providers: [ConfirmationService]
})


export class LoginUserComponent implements OnInit {

  form: FormGroup;
  today: Date;
  smbrFoto: any;
  dataModulAplikasi: TreeNode[];
  dataAplikasi: any[];
  selectedFiles2: TreeNode[];
  selectedFiles3: TreeNode[];
  targetModulAplikasi: any[];
  kelompokUser:any[];
  kataSandi: any;
  hintKataSandi: any;
  dataAlamat: any[];
  idModulAplikasi: any = {};
  dataAplikasiModul: any[];
  dataParent: TreeNode[];
  namaModulAplikasi: string
  kdModulAplikasi: any;
  datParent: any[];
  children: any[];
  dataChild: any[];
  modAp: any[];
  listData: any[];
  totalRecords: any;
  page: any;
  rows: any;
  versi: any;
  alamatLengkap: any;
  pencarian: any;
  tglSekarang: any;
  formUser: FormGroup;
  formData: FormGroup;
  formPegawai: FormGroup;
  dataPhoto: any;
  namaPhoto: any;
  kdKelompok: any;
  responseEmail: any;
  responseMobile: any;
  dataTersedia: any;
  dataTidakTersedia: any;
  dataEmailTersedia: any;
  dataEmailTidakTersedia: any;
  btnAktif: any;
  btnUserBaru: any;
  btnEditData: any;
  dataChildn: any;
  modApn: any;
  datAplikasi: any;
  version: any;
  kdUser: any;
  statusEnabled: any;
  selected: any;
  btnSimpanUser: any;
  index: number;
  daAplikasi: any;
  idModul: string;
  tabLoginUser: any;
  idRuangan: any;
  selectedData: any;
  dataAplikasiChild: any;
  dataModulAplikasiChild: any;
  selectModul: any;
  selectDat: any;
  dataPilihModul: any;
  namaUser: any;
  namaMobile: any;
  pilihan: any = [];
  pilihSemua: boolean;
  listDataModul: any[];
  listDataRuangan: any[];
  pilihanRuangan: any = [];
  pilihSemuaRuangan: boolean;
  namaUserEmail: any;
  namaUserMobile:any;
  dataModul: any[];
  selectedModul:any[];
  selectedUnit:any[];
  tempModul:any[];
  kdPgw:any;
  kdModul:any;
  kodeUser:any;

  constructor(
    private httpService: HttpClient,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private route: Router,
    private alertService: AlertService
    ) {}

    
  ngOnInit() {
    window.scrollTo(0,0);
    // this.kdUser = null;
    this.index = 0;
    this.today = new Date();
    this.tglSekarang = this.today;
    this.btnAktif = true;
    this.btnEditData = true;
    this.btnUserBaru = true;
    this.btnSimpanUser = false;
    this.tabLoginUser = true;
    this.form = this.fb.group({
      'namaLengkap': new FormControl(''),
      'tanggalLahir': new FormControl(''),
      'namaJenisKelamin': new FormControl(''),
      'kdPegawai': new FormControl('')
    });
    this.formUser = this.fb.group({
      'tglSekarang': new FormControl(this.today),
      'kataSandi': new FormControl('', Validators.required),
      'namaUserEmail': new FormControl('', Validators.required),
      'namaUserMobile': new FormControl('', Validators.required),
      'kdKelompok': new FormControl('', Validators.required),
      'hintKataSandi': new FormControl('', Validators.required)
    });
    this.formPegawai = this.fb.group({
      'noID': new FormControl(),
      'alamatLengkap': new FormControl('')
    })
    this.formUser.get('tglSekarang').disable();
    //this.formData = this.fb.group({})

    if(this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    /*this.listData = [
      {"kdPegawai": "L0001", "namaLengkap": "Tes", "nIKIntern": "000001", "namaJenisKelamin": "Laki - Laki"}
    ];
    this.kelompokUser = [];
    this.kelompokUser.push({label: 'Administrator', value: {id_kode: '1', namaKelompokUser: 'Administrator'}})*/
    this.getData(this.page, this.rows);
    this.getKelompokUser();
    //this.getDataModul();
    this.getDataModulDanRuangan();
    //this.getDataModulAplikasi();
    this.form.disable();
    this.dataAplikasi = [];
    this.dataChild = [];
    this.selectedFiles2 = [];
    this.selectedFiles3 = [];
    // this.dataAplikasi = [
    //     {
    //       label: "EIS / Director Book", 
    //       data: {kdModulAplikasi: '1', namaModulAplikasi: 'EIS / Director Book'}, 
    //       children: [
    //         {
    //           label: "Bagian Administrasi Pegawai", 
    //           data: {kdModulAplikasi: '1', kdRuangan: 'E1', namaRuangan: 'Bagian Administrasi Pegawai'},
    //         }
    //       ]
    //     },
    //     {
    //       label: "Orientasi Pegawai", 
    //       data: {kdModulAplikasi: '2', namaModulAplikasi: 'Orientasi Pegawai'}, 
    //       children: [
    //         {
    //           label: "Bagian Pengembangan SDM", 
    //           data: {kdModulAplikasi: '2', kdRuangan: 'O1', namaRuangan: 'Bagian Pengembangan SDM'},
    //         },
    //         {
    //           label: "Bagian Kesejahteraan Pegawai", 
    //           data: {kdModulAplikasi: '2', kdRuangan: 'O2', namaRuangan: 'Bagian Kesejahteraan Pegawai'},
    //         },
    //         {
    //           label: "Bagian Diklat", 
    //           data: {kdModulAplikasi: '2', kdRuangan: 'O3', namaRuangan: 'Bagian Diklat'},
    //         }
    //       ]
    //     }
    //   ];
    // this.selectedFiles3 = this.dataAplikasi;
  //   this.dataAplikasi = [
  //     {
  //       label: "Orientasi Pegawai", 
  //       data: {kdModulAplikasi: '2', namaModulAplikasi: 'Orientasi Pegawai'}, 
  //       children: [
  //         {
  //           label: "Bagian Pengembangan SDM", 
  //           data: {kdModulAplikasi: '2', kdRuangan: 'O1', namaRuangan: 'Bagian Pengembangan SDM'},
  //         },
  //         {
  //           label: "Bagian Kesejahteraan Pegawai", 
  //           data: {kdModulAplikasi: '2', kdRuangan: 'O2', namaRuangan: 'Bagian Kesejahteraan Pegawai'},
  //         },
  //         {
  //           label: "Bagian Diklat", 
  //           data: {kdModulAplikasi: '2', kdRuangan: 'O3', namaRuangan: 'Bagian Diklat'},
  //         }
  //       ]
  //     }
  //   ];
  // this.selectedFiles2 = [];
  // for(var i = 0; i < this.dataModulAplikasi.length; i++) {
  //   for(var j = 0; j < this.dataAplikasi.length; j++) {
  //     if(this.dataModulAplikasi[i].data.kdModulAplikasi == this.dataAplikasi[j].data.kdModulAplikasi) {
  //       this.selectedFiles2.push({label: this.dataAplikasi[j].data.namaModulAplikasi, data: {kdModulAplikasi: this.dataAplikasi[j].data.kdModulAplikasi, namaModulAplikasi: this.dataAplikasi[j].data.namaModulAplikasi}})
  //     }
  //   }
  // }
  // console.log(this.selectedFiles2);





}


getKelompokUser() {
  this.httpService.get(Configuration.get().dataMaster +'/kelompokuser/findKelUser').subscribe(
    result => {
      this.kelompokUser = [];
      for (var i = 0; i < result.KelompokUser.length; ++i) {
        this.kelompokUser.push({label: result.KelompokUser[i].namaKelompokUser, value: result.KelompokUser[i].kode.kode});
      }
    }
    );
}
getData(page: number, rows: number) {
  this.httpService.get(Configuration.get().dataMasterNew +'/loginuser/findAllPegawaiLoginUser?page='+page+'&rows='+rows+'&dir=namaLengkap&sort=asc').subscribe(table => {
    this.listData = table.DataPegawai;
    this.totalRecords = table.totalRow; 
  });
}
loadPage(event: LazyLoadEvent) {
  this.getData((event.rows + event.first) / event.rows, event.rows)
  this.page = (event.rows + event.first) / event.rows;
  this.rows = event.rows;
}
cari(){
  this.httpService.get(Configuration.get().dataMasterNew + '/loginuser/findAllPegawaiLoginUser?page='+Configuration.get().page+'&rows='+Configuration.get().rows+'&dir=namaLengkap&sort=desc&namaLengkapOrNik='+this.pencarian).subscribe(table => {
    this.listData = table.DataPegawai;
  });
}
onRowSelect(event) {
  this.listDataRuangan = [];
  this.selectedUnit = [];
  this.selectedModul = [];
  console.log(event.data);
  this.responseMobile = '';
  this.responseEmail = '';
  this.formUser.reset();    
    //this.getDataModul();
    // console.log(dataModulAplikasi);

    // this.getUser(event.data.kdpegawai); 
    this.kdPgw = event.data.kdpegawai;
    this.getUser2(event.data.kdpegawai);
    this.form.get('kdPegawai').setValue(event.data.kdpegawai);
  }
  clone(cloned: DataPegawai): DataPegawai {
    let hub = new InisialDataPegawai();
    for(let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialDataPegawai();
    fixHub = {
      "namaLengkap": hub.namaLengkap,
      "tanggalLahir": new Date(hub.tglLahir*1000),
      "namaJenisKelamin": hub.namaJenisKelamin,
      "kdPegawai": hub.kdPegawai
    }
    return fixHub;
  }
  getUser(kdPegawai) {

    this.httpService.get(Configuration.get().dataMasterNew +'/loginuser/findByKdPegawai/' + kdPegawai).subscribe(
      result => {
        // console.log(result);
        if(result.LoginUser["0"].kdUser == null ||  result.LoginUser["0"].kdUser == "-") {
          this.pilihan = [];
          this.pilihanRuangan = [];
          this.getDataModul();
          this.formUser.get('tglSekarang').setValue(this.tglSekarang);
          this.statusEnabled = result.LoginUser["0"].dataUser.statusEnabled;
          this.version = null;
        } else {

          this.dataPilihModul = this.dataAplikasi;
          this.kdUser = result.LoginUser["0"].kdUser;
          this.statusEnabled = result.LoginUser["0"].dataUser.statusEnabled;


          this.httpService.get(Configuration.get().dataMasterNew +'/maploginusertoprofile/findByKode/' + this.kdUser).subscribe(
            result => {
              this.pilihan = [];
              for (let i = 0; i < result.dataModulAplikasi.length; i++) {
                this.pilihan.push(String(result.dataModulAplikasi[i].kode));
              }
              this.pilihanRuangan = [];
              for (let i = 0; i < result.dataModulAplikasi.length; i++) {
                this.pilihanRuangan.push(String(result.dataRuangan[i].kdRuangan));
              }
                
              }
              )
        this.formUser.get('namaUserEmail').setValue(result.LoginUser[0].dataUser.namaUserEmail);
        this.namaUser = result.LoginUser[0].dataUser.namaUserEmail;
        this.namaMobile = result.LoginUser[0].dataUser.namaUserMobile;
        this.formUser.get('namaUserMobile').setValue(result.LoginUser[0].dataUser.namaUserMobile);
        this.formUser.get('kataSandi').setValue('      ');
        this.formUser.get('tglSekarang').setValue(new Date(result.LoginUser[0].dataUser.tglDaftar * 1000));
        this.formUser.get('hintKataSandi').setValue(result.LoginUser[0].dataUser.hintKataSandi);
        this.formUser.get('kdKelompok').setValue(result.LoginUser["0"].kelompokUser.id);
        this.version = result.LoginUser["0"].dataUser.version;
        this.namaUserEmail = result.LoginUser[0].dataUser.namaUserEmail;
        this.namaUserMobile = result.LoginUser[0].dataUser.namaUserMobile;
}
 
        }
        );
}
getDataModulAplikasi() {
  this.dataModulAplikasi = [
  {
    label: "EIS / Director Book", 
    data: {kdModulAplikasi: '1', namaModulAplikasi: 'EIS / Director Book'}, 
    children: [
    {
      label: "Bagian Administrasi Pegawai", 
      data: {kdModulAplikasi: '1', kdRuangan: 'E1', namaRuangan: 'Bagian Administrasi Pegawai'},
    }
    ]
  },
  {
    label: "Orientasi Pegawai", 
    data: {kdModulAplikasi: '2', namaModulAplikasi: 'Orientasi Pegawai'}, 
    children: [
    {
      label: "Bagian Pengembangan SDM", 
      data: {kdModulAplikasi: '2', kdRuangan: 'O1', namaRuangan: 'Bagian Pengembangan SDM'},
    }
    ]
  }
  ];
  return this.dataAplikasi;
}
getDataModul() {
  this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllWithRuangan/').subscribe(
    result => {
      this.listDataModul = result.dataModulAplikasi;
      this.listDataRuangan = result.dataRuangan;
    }
    )

}

//fungsi baru get modul dan ruangan

getDataModulDanRuangan(){
  this.httpService.get(Configuration.get().dataMasterNew + '/loginuser/findAllAkses').subscribe(
    result => {
      this.listDataModul = result.dataModulAplikasi;
      this.listDataRuangan = result.dataRuangan;
    }
    )
}


pilihModulAplikasi() {

  this.dataChild = [];
  if(this.dataAplikasi.length == 0) {
    for (var i = 0; i < this.selectedFiles2.length; ++i) {
      if(this.selectedFiles2[i].parent != undefined) {
        this.dataChild.push({label: this.selectedFiles2[i].label, data: this.selectedFiles2[i].data});
        this.idModulAplikasi = this.selectedFiles2[i].data.kdModulAplikasi;
        for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
          for (var k = 0; k < this.selectedFiles2[i].parent.children.length; ++k) {
            if(this.selectedFiles2[i].parent.children[k].data.kdRuangan.indexOf(this.selectedFiles2[i].data.kdRuangan) != -1) {
              let children = this.dataModulAplikasi[j].children;
              this.dataModulAplikasi[j].children = children.filter(val => val.data.kdRuangan !== this.selectedFiles2[i].data.kdRuangan);
            }
          }
        }
      }
    }
    let children = this.dataChild.map(val => val.data.kdModulAplikasi);
    let selected = this.dataModulAplikasi.filter(val => children.indexOf(val.data.kdModulAplikasi) != -1);
    for (var i = 0; i < selected.length; ++i) {
      this.dataAplikasi.push({label: selected[i].label, data: selected[i].data, children: []});
    }

    for (var k = 0; k < this.dataAplikasi.length; ++k) {
      for (var i = 0; i < this.dataChild.length; ++i) {
        if(this.dataChild[i].data.kdModulAplikasi == this.dataAplikasi[k].data.kdModulAplikasi) {
          this.dataAplikasi[k].children.push(this.dataChild[i]);
        }
      }
    }
    for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
      if(this.dataModulAplikasi[j].children.length == 0) {
        this.dataModulAplikasi = this.dataModulAplikasi.filter(val => val.data.kdModulAplikasi !== this.idModulAplikasi);
      }
    }
    this.dataChild = [];
  } else {
    // console.log(this.selectedFiles2);
    for (var i = 0; i < this.selectedFiles2.length; ++i) {
      if(this.selectedFiles2[i].parent != undefined) {
        this.dataChild.push({
          label: this.selectedFiles2[i].label, 
          data: {
            kdModulAplikasi: this.selectedFiles2[i].data.kdModulAplikasi, 
            kdRuangan: this.selectedFiles2[i].data.kdRuangan,
            namaRuangan: this.selectedFiles2[i].data.namaRuangan
          },
          parent: undefined
        });
        this.idModulAplikasi = this.selectedFiles2[i].data.kdModulAplikasi;
        for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
          for (var k = 0; k < this.selectedFiles2[i].parent.children.length; ++k) {
            if(this.selectedFiles2[i].parent.children[k].data.kdRuangan.indexOf(this.selectedFiles2[i].data.kdRuangan) != -1) {
              let children = this.dataModulAplikasi[j].children;
              this.dataModulAplikasi[j].children = children.filter(val => val.data.kdRuangan !== this.selectedFiles2[i].data.kdRuangan);
            }
          }
        }
      } 
    }
    // console.log(this.dataChild);
    for (var k = 0; k < this.dataAplikasi.length; ++k) {
      for (var j = 0; j < this.dataChild.length; ++j) {
        if(this.dataAplikasi[k].data.kdModulAplikasi == this.dataChild[j].data.kdModulAplikasi) {
          this.dataAplikasi[k].children.push(this.dataChild[j]);
        } else {
          let children = this.dataChild.map(val => val.data.kdModulAplikasi);
          let selected = this.dataModulAplikasi.filter(val => children.indexOf(val.data.kdModulAplikasi) != -1); 
          let datAp = this.dataAplikasi.filter(val => children.indexOf(val.data.kdModulAplikasi) != -1);
          if(datAp.length == 0) {
            for (var l = 0; l < selected.length; ++l) {
              this.dataAplikasi.push({label: selected[l].label, data: selected[l].data, children: []})
            }
            if(this.dataChild[j].data.kdModulAplikasi == this.dataAplikasi[k].data.kdModulAplikasi) {
              this.dataAplikasi[k].children.push(this.dataChild[j]);
            }
          } else {
            if(this.dataChild[j].data.kdModulAplikasi == this.dataAplikasi[k].data.kdModulAplikasi) {
              this.dataAplikasi[k].children.push(this.dataChild[j]);
            }
          }
        }
      }
    }
        //console.log(mod);
        for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
          if(this.dataModulAplikasi[j].children.length == 0) {
            this.dataModulAplikasi = this.dataModulAplikasi.filter(val => val.data.kdModulAplikasi !== this.idModulAplikasi);
          }
        }

        
        this.dataChild = [];
      }
      this.selectedFiles2 = [];
      this.selectedFiles3 = [];
      this.selectedFiles2 = null;
      this.selectedFiles3 = null;
      this.dataAplikasi.forEach(
        node => {
          this.expandRecursive(node, true);
        }
        );
      this.dataChild = [];
      this.dataChild = null
    }
    pilihAplikasi() {
      this.children = [];
      // console.log(this.selectedFiles3);
      for (var i = 0; i < this.selectedFiles3.length; ++i) {
        if(this.selectedFiles3[i].parent != undefined) {
          this.children.push({
            label: this.selectedFiles3[i].label, 
            data: {
              kdModulAplikasi: this.selectedFiles3[i].data.kdModulAplikasi, 
              kdRuangan: this.selectedFiles3[i].data.kdRuangan,
              namaRuangan: this.selectedFiles3[i].data.namaRuangan
            },
            parent: undefined
          });
          this.idModulAplikasi = this.selectedFiles3[i].data.kdModulAplikasi;
          for (var j = 0; j < this.dataAplikasi.length; ++j) {
            for (var k = 0; k < this.selectedFiles3[i].parent.children.length; ++k) {
              if(this.selectedFiles3[i].parent.children[k].data.kdRuangan.indexOf(this.selectedFiles3[i].data.kdRuangan) != -1) {
                let children = this.dataAplikasi[j].children;
                this.dataAplikasi[j].children = children.filter(val => val.data.kdRuangan !== this.selectedFiles3[i].data.kdRuangan);
              }
            }
          }
        }
      }
      for (var i = 0; i < this.dataModulAplikasi.length; ++i) {
        for (var j = 0; j < this.children.length; ++j) {
          if(this.dataModulAplikasi[i].data.kdModulAplikasi == this.children[j].data.kdModulAplikasi) {
            this.dataModulAplikasi[i].children.push(this.children[j]);
          } else {
            let children = this.children.map(val => val.data.kdModulAplikasi);
            let selected = this.dataAplikasi.filter(val => children.indexOf(val.data.kdModulAplikasi) != -1); 
            let datAp = this.dataModulAplikasi.filter(val => children.indexOf(val.data.kdModulAplikasi) != -1);
            if(datAp.length == 0) {
              for (var l = 0; l < selected.length; ++l) {
                this.dataModulAplikasi.push({label: selected[l].label, data: selected[l].data, children: []})
              }
              if(this.children[j].data.kdModulAplikasi == this.dataModulAplikasi[i].data.kdModulAplikasi) {
                this.dataModulAplikasi[i].children.push(this.children[j]);
              }
            } else {
              if(this.children[j].data.kdModulAplikasi == this.dataModulAplikasi[i].data.kdModulAplikasi) {
                this.dataModulAplikasi[i].children.push(this.children[j]);
              }
            }
          }
        }
      }
      for (var j = 0; j < this.dataAplikasi.length; ++j) {
        if(this.dataAplikasi[j].children.length == 0) {
          this.dataAplikasi = this.dataAplikasi.filter(val => val.data.kdModulAplikasi !== this.idModulAplikasi);
        }
      }
      this.selectedFiles2 = [];
      this.selectedFiles3 = [];
      this.selectedFiles2 = null;
      this.selectedFiles2 = null;
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
    cekUser() {
      let regx = /[^0-9]/;    
      let str = this.formUser.get('namaUserMobile').value;
      str =str.replace(regx,'');
      this.formUser.get('namaUserMobile').setValue(str);
      if (this.formUser.get('namaUserMobile').value == null || this.formUser.get('namaUserMobile').value == ""){
        this.alertService.warn('Peringatan', 'Masukan User');                                      
      }else if(this.namaUserMobile != this.formUser.get('namaUserMobile').value){
         if(this.formUser.get('namaUserMobile').value.length >= 10){
        this.httpService.get(Configuration.get().dataMasterNew + '/loginuser/cekMobile?mobile=' + this.formUser.get('namaUserMobile').value).subscribe(
          response =>{
            if(response.message == "Tersedia") {
              //this.alertService.success('Status','User Tersedia');                    
              this.dataTersedia = true;
              this.dataTidakTersedia = false;
              this.responseMobile = response.message;
            } else if (response.message == "Tidak Tersedia"){
              //this.alertService.success('Status', 'User Tidak Tersedia');                                
              this.dataTidakTersedia = true;
              this.dataTersedia = false;
              this.responseMobile = response.message;
            }
          });
      }else{
               this.dataTidakTersedia = true;
               this.dataTersedia = false;
               this.responseMobile = "Data Tidak Valid";
         }
      } else {
        this.dataEmailTidakTersedia = false;
        this.dataEmailTersedia = false;
      }
    }
    cekUserEmail() {
      let regx = /[^a-zA-Z0-9-.@_]/;    
      let str = this.formUser.get('namaUserEmail').value;
      str =str.replace(regx,'');
      this.formUser.get('namaUserEmail').setValue(str);
      if (this.formUser.get('namaUserEmail').value == null || this.formUser.get('namaUserEmail').value == ""){
        this.alertService.warn('Peringatan', 'Masukan Email');                                      
      }else if(this.namaUserEmail != this.formUser.get('namaUserEmail').value){
        let arr1 = str.split('@');
           if(arr1.length >= 2){
               let arr3 = arr1[1].split('.');
              if(arr3.length >= 2 ){
                 if(arr3[1].length >=1){         
                    this.httpService.get(Configuration.get().dataMasterNew + '/loginuser/cekEmail?email='+ this.formUser.get('namaUserEmail').value).subscribe(
                    response =>{
                      if(response.message == "Tersedia") {
                       // this.alertService.success('Status', 'Email Tersedia');                                
                        this.dataEmailTersedia = true;
                        this.dataEmailTidakTersedia = false;
                        this.responseEmail = response.message;
                      } else if (response.message == "Tidak Tersedia"){
                        //this.alertService.success('Status', 'Email Tidak Tersedia');                                            
                        this.dataEmailTidakTersedia = true;
                        this.dataEmailTersedia = false;
                        this.responseEmail = response.message;
                      }
                  });
                }
              } else{                                    
                    this.dataEmailTidakTersedia = true;
                    this.dataEmailTersedia = false;
                    this.responseEmail = "Format Tidak Valid";
              }  
           }else{                                    
                    this.dataEmailTidakTersedia = true;
                    this.dataEmailTersedia = false;
                    this.responseEmail = "Format Tidak Valid";
           }
       
      } else {
        this.dataEmailTidakTersedia = false;
        this.dataEmailTersedia = false;
      }
    }
    private expandRecursive(node:TreeNode, isExpand:boolean){
      node.expanded = isExpand;
      if(node.children){
        node.children.forEach( childNode => {
          this.expandRecursive(childNode, isExpand);
        } );
      }
    }
    simpanUser() {

      // console.log(this.listDataModul);
      // console.log(this.listDataRuangan);

      if(this.version == null) {
        this.cekUser();
        this.cekUserEmail();
        if(this.dataEmailTersedia == false){
          this.alertService.warn("Peringatan","Data User email tidak valid");
        } else if (this.dataTersedia == false) {
          this.alertService.warn("Peringatan","Data mobile tidak valid");
        } else {
          let dataSimpanModul = [];
          for (var i = 0; i < this.listDataModul.length; ++i) {
            for (var j = 0; j < this.listDataRuangan.length; ++j) {
              if(this.listDataRuangan[j].statusEnabled === true){
                  let dataIndukRuangan = {
                    kdModulAplikasi: this.listDataModul[i].kode,
                    kdRuangan: this.listDataRuangan[j].kdRuangan,
                    kdUser: 0,
                    noRec: 'string',
                    statusEnabled: this.listDataModul[i].statusEnabled,
                    version: 1
                  }
                dataSimpanModul.push(dataIndukRuangan);
                for(var k = 0; k < this.listDataRuangan[j].child.length; ++k){
                  if(this.listDataRuangan[j].child[k].statusEnabled === true){
                    let dataAnak = {
                      kdModulAplikasi: this.listDataModul[i].kode,
                      kdRuangan: this.listDataRuangan[j].child[k].kdRuangan,
                      kdUser: 0,
                      noRec: 'string',
                      statusEnabled: this.listDataModul[i].statusEnabled,
                      version: 1
                    }
                    dataSimpanModul.push(dataAnak);
                  }
                }
              }
            }
          }

          let dataSimpan = {
            "alamatLengkap": "-",
            "hintKataSandi": this.formUser.get('hintKataSandi').value,
            "imageUser": this.namaPhoto,
            "namaJenisKelamin": "-",
            "kataSandi": this.formUser.get('kataSandi').value,
            "kdKelompokUser": this.formUser.get('kdKelompok').value,
            "kdPegawai":  this.form.get('kdPegawai').value,
            "kodeUser": 0,
            "namaLengkap": this.form.get('namaLengkap').value,
            "namaUserEmail": this.formUser.get('namaUserEmail').value,
            "namaUserMobile": this.formUser.get('namaUserMobile').value,
            "noIdentitas": "12345678",
            // "noRec": "123",
            "pathFileImageUser": this.namaPhoto,
            "statusEnabled": this.statusEnabled,
            "tglDaftar": parseInt(this.setTimeStamp(this.formUser.get('tglSekarang').value)),
            "tglLahir": parseInt(this.setTimeStamp(this.form.get('tanggalLahir').value)),
            "version": 1,
            "noCM": 0,
            "mapLoginUserToProfileDto": dataSimpanModul,
          }
          console.log(dataSimpan.mapLoginUserToProfileDto);
          if(dataSimpan.mapLoginUserToProfileDto.length == 0) {
            this.alertService.warn('Peringatan','Pilih Modul Aplikasi dan Unit Kerja');
          }else if(dataSimpan.mapLoginUserToProfileDto.length != 0){
           //alert('Data Tidak kosong');

            this.httpService.update(Configuration.get().dataMasterNew + '/loginuser/update/' + 0, dataSimpan).subscribe(
              response =>{
                this.alertService.success('Berhasil','Data Login User Berhasil Disimpan');
                this.batalUser();
                this.ngOnInit();
              });

         }
        }
      } else {
        this.confirmUpdate();
      }
    }
    confirmUpdate() {
      this.confirmationService.confirm({
        message: 'Apakah data akan diperbaharui?',
        header: 'Konfirmasi Pembaharuan',
        accept: () => {
          this.update();
        },
        reject: () => {
          this.alertService.warn('Peringatan','Data Tidak Diperbaharui');
        }
      });
    }
    update() {
      // console.log(this.listDataModul);
      // console.log(this.listDataRuangan);
      // console.log(this.pilihan)
      if(this.formUser.get('namaUserMobile').value == this.namaMobile && this.formUser.get('namaUserEmail').value == this.namaUser) {
        let dataSimpanModul = [];
          for (var i = 0; i < this.listDataModul.length; ++i) {
            for (var j = 0; j < this.listDataRuangan.length; ++j) {
              if(this.listDataRuangan[j].statusEnabled === true){
                  let dataIndukRuangan = {
                    kdModulAplikasi: this.listDataModul[i].kode,
                    kdRuangan: this.listDataRuangan[j].kdRuangan,
                    kdUser: 0,
                    noRec: 'string',
                    statusEnabled: this.listDataModul[i].statusEnabled,
                    version: 1
                  }
                dataSimpanModul.push(dataIndukRuangan);
                for(var k = 0; k < this.listDataRuangan[j].child.length; ++k){
                  if(this.listDataRuangan[j].child[k].statusEnabled === true){
                    let dataAnak = {
                      kdModulAplikasi: this.listDataModul[i].kode,
                      kdRuangan: this.listDataRuangan[j].child[k].kdRuangan,
                      kdUser: 0,
                      noRec: 'string',
                      statusEnabled: this.listDataModul[i].statusEnabled,
                      version: 1
                    }
                    dataSimpanModul.push(dataAnak);
                  }
                }
              }
            }
          }
        //console.log(dataSimpanModul);

      let dataSimpan = {
        "alamatLengkap": this.formPegawai.get('alamatLengkap').value,
        "hintKataSandi": this.formUser.get('hintKataSandi').value,
        "imageUser": this.namaPhoto,
        "namaJenisKelamin": this.form.get('namaJenisKelamin').value,
        "kataSandi": this.formUser.get('kataSandi').value,
        "kdKelompokUser": this.formUser.get('kdKelompok').value,
        "kdPegawai": this.form.get('kdPegawai').value,
        "kodeUser": this.kdUser,
        "namaLengkap": this.form.get('namaLengkap').value,
        "namaUserEmail": this.formUser.get('namaUserEmail').value,
        "namaUserMobile": this.formUser.get('namaUserMobile').value,
        "noIdentitas": "string",
        "pathFileImageUser": this.namaPhoto,
        "statusEnabled": this.statusEnabled,
        "tglDaftar": this.setTimeStamp(this.formUser.get('tglSekarang').value),
        "tglLahir": this.setTimeStamp(this.form.get('tanggalLahir').value),
        "version": this.version,
        "noCM": 0,
        "mapLoginUserToProfileDto":dataSimpanModul,
      }
      
      if(dataSimpan.mapLoginUserToProfileDto.length == 0) {
        this.alertService.warn('Peringatan','Pilih Modul Aplikasi dan Unit Kerja');
      } else {
        this.httpService.update(Configuration.get().dataMasterNew + '/loginuser/update/' + this.version, dataSimpan).subscribe(
          response =>{
            this.alertService.success('Berhasil','Data Login User Berhasil Diperbarui');
            this.batalUser();
            this.ngOnInit();
          // this.alertService.warn('Peringatan', 'Silahkan Pilih Modul Aplikasi');
          // this.index = 2;
          //console.log(response);
        }
        );
      }
    } else {
      this.cekUser();
      this.cekUserEmail();
      if(this.dataEmailTidakTersedia == true){
          this.alertService.warn("Peringatan","Data User email tidak valid");
      } else if (this.dataTidakTersedia == true) {
          this.alertService.warn("Peringatan","Data mobile tidak valid");
      
      } else {
        let dataSimpanModul = [];
          for (var i = 0; i < this.listDataModul.length; ++i) {
            for (var j = 0; j < this.listDataRuangan.length; ++j) {
              if(this.listDataRuangan[j].statusEnabled === true){
                  let dataIndukRuangan = {
                    kdModulAplikasi: this.listDataModul[i].kode,
                    kdRuangan: this.listDataRuangan[j].kdRuangan,
                    kdUser: 0,
                    noRec: 'string',
                    statusEnabled: this.listDataModul[i].statusEnabled,
                    version: 1
                  }
                dataSimpanModul.push(dataIndukRuangan);
                for(var k = 0; k < this.listDataRuangan[j].child.length; ++k){
                  if(this.listDataRuangan[j].child[k].statusEnabled === true){
                    let dataAnak = {
                      kdModulAplikasi: this.listDataModul[i].kode,
                      kdRuangan: this.listDataRuangan[j].child[k].kdRuangan,
                      kdUser: 0,
                      noRec: 'string',
                      statusEnabled: this.listDataModul[i].statusEnabled,
                      version: 1
                    }
                    dataSimpanModul.push(dataAnak);
                  }
                }
              }
            }
          }

        let dataSimpan = {
          "alamatLengkap": this.formPegawai.get('alamatLengkap').value,
          "hintKataSandi": this.formUser.get('hintKataSandi').value,
          "imageUser": this.namaPhoto,
          "namaJenisKelamin": this.form.get('namaJenisKelamin').value,
          "kataSandi": this.formUser.get('kataSandi').value,
          "kdKelompokUser": this.formUser.get('kdKelompok').value,
          "kdPegawai": this.form.get('kdPegawai').value,
          "kodeUser": this.kdUser,
          "namaLengkap": this.form.get('namaLengkap').value,
          "namaUserEmail": this.formUser.get('namaUserEmail').value,
          "namaUserMobile": this.formUser.get('namaUserMobile').value,
          "noIdentitas": "string",
          "pathFileImageUser": this.namaPhoto,
          "statusEnabled": this.statusEnabled,
          "tglDaftar": this.setTimeStamp(this.formUser.get('tglSekarang').value),
          "tglLahir": this.setTimeStamp(this.form.get('tanggalLahir').value),
          "version": this.version,
          "noCM": 0,  
          "mapLoginUserToProfileDto":dataSimpanModul,
        }

        if(dataSimpan.mapLoginUserToProfileDto.length == 0) {
          this.alertService.warn('Peringatan','Pilih Modul Aplikasi dan Unit Kerja');
        } else {
          this.httpService.update(Configuration.get().dataMasterNew + '/loginuser/update/' + this.version, dataSimpan).subscribe(
            response =>{
              this.alertService.success('Berhasil','Data Login User Berhasil Diperbarui');
              this.batalUser();
              this.ngOnInit();
          // this.alertService.warn('Peringatan', 'Silahkan Pilih Modul Aplikasi');
          // this.index = 2;
          //console.log(response);
        }
        );

        }
      }
    }        
      }
      confirmDelete() {
        if(this.kdUser == null) {
          this.alertService.warn("Peringatan","Pilih Data Pegawai")
        } else {
          this.confirmationService.confirm({
            message: 'Apakah data akan di hapus?',
            header: 'Konfirmasi Hapus',
            icon: 'fa fa-trash',
            accept: () => {
              this.hapusUser();
            },
            reject: () => {
              this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
            }
          });
        }
      }
      hapusUser() {
        this.httpService.delete(Configuration.get().dataMasterNew + '/loginuser/del/' + this.kdUser).subscribe(
          response =>{
            this.alertService.success('Berhasil','Data Login User Berhasil Dihapus');
            this.batalUser();
            this.ngOnInit();
          }
          );
      }
      batalUser() {
        this.selected = null;
        this.listData = [];
        this.pilihan = [];
        this.pilihanRuangan = [];
        this.dataTersedia = false;
        this.dataTidakTersedia = false;
        this.dataEmailTersedia = false;
        this.dataEmailTidakTersedia = false;
        this.index = 0;
        this.formUser.reset();
        this.form.reset();
        this.formPegawai.reset();
        this.namaPhoto = null;
        this.listDataRuangan = [];
        this.selectedUnit = [];
        this.selectedModul = [];
        this.ngOnInit();
        
      }
      simpan() {
        let dataSimpan = [];
        for (var i = 0; i < this.dataAplikasi.length; ++i) {
          for (var j = 0; j < this.dataAplikasi[i].children.length; ++j) {
            let data = {
              kdModulAplikasi: this.dataAplikasi[i].data.kdModulAplikasi,
              kdRuangan: this.dataAplikasi[i].children[j].data.kdRuangan,
              kdUser: this.kdUser,
              noRec: 'string',
              statusEnabled: true,
              version: 0
            }
            dataSimpan.push(data);
          }
        }
    //console.log(dataSimpan);
    this.httpService.post(Configuration.get().dataMasterNew + '/maploginusertoprofile/save', dataSimpan).subscribe(
      result => {
        this.alertService.success('Berhasil','Data Modul Aplikasi Berhasil Disimpan');
        this.batalUser();
      }
      )
  }
  batalPilih() {
    for (var i = 0; i < this.dataAplikasi.length; ++i) {
      for (var j = 0; j < this.dataModulAplikasi.length; ++j) {
        if(this.dataAplikasi[i].data.kdModulAplikasi == this.dataModulAplikasi[j].data.kdModulAplikasi) {
          for (var k = 0; k < this.dataAplikasi[i].children.length; ++k) {
            this.idRuangan = this.dataAplikasi[i].children[k].data.kdRuangan;
            let childModul = this.dataModulAplikasi[j].children;
            this.dataModulAplikasi[j].children = childModul.filter(val => val.data.kdRuangan !== this.idRuangan);
          }
        } else {
          for (var k = 0; k < this.dataAplikasi[i].children.length; ++k) {
            this.idRuangan = this.dataAplikasi[i].children[k].data.kdRuangan;
            let childModul = this.dataModulAplikasi[j].children;
            this.dataModulAplikasi[j].children = childModul.filter(val => val.data.kdRuangan !== this.idRuangan);
          }
        }
        if(this.dataModulAplikasi[j].children.length == 0) {
          this.dataModulAplikasi = this.dataModulAplikasi.filter(val => val.data.kdModulAplikasi !== this.dataAplikasi[i].data.kdModulAplikasi)
        }
      }
    }
  }
  setTimeStamp(date) {
    if (date == null || date == undefined || date == '') {
      let dataTimeStamp = (new Date().getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    } else {
      let dataTimeStamp = (new Date(date).getTime() / 1000);
      return dataTimeStamp.toFixed(0);
    }
  }
  getPassword() {
    if(this.version != null) {
      this.formUser.get('kataSandi').setValue('');
    }
  }
  lostPassword() {
    if (this.formUser.get('kataSandi').value == null || this.formUser.get('kataSandi').value == '') {
      this.formUser.get('kataSandi').setValue('      ');
    }
  }
  userBaru() {
    this.index = 1;
  }
  editDataUser() {
    this.index = 1;
  }
  nodeSelect(event) {
    this.expandRecursive(event.node, true)  
  }
  nodeUnSelect(event) {
    this.expandRecursive(event.node, false);
    this.selectedFiles2 = [];
    this.selectedFiles2 = null;
  }
  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listDataModul.forEach(function (data) {
        dataTemp.push(String(data.kode));
      })
      this.pilihan = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihan = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }
  selectAllRuangan() {
    if (this.pilihSemuaRuangan == true) {
      this.pilihanRuangan = []
      let dataTemp = []
      this.listDataRuangan.forEach(function (data) {
        dataTemp.push(String(data.kdRuangan));
      })
      this.pilihanRuangan = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihanRuangan = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }

  onRowSelectModul(event){
    //buat refresh unit kerja, trus buat isi ceklist modul aplikasi ini unit kerjanya apa aja
    console.log(event.type);
    if(event.type == "checkbox"){
      this.selectedUnit = [];
    }
    
    
    // // if(this.kdUser !== null ||  this.kdUser != "-"){
    //   this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllWithRuangan/').subscribe(
    //     result => {
    //       this.listDataRuangan = result.dataRuangan;
    //       //kayanya nanti disini bikin data temp setiap modul
    //     }
    //   )
                
    // }
    
  }

  clickData(event){
    //disini nanti untuk get / tampilin data dengan kdModulAplikasi ini unit kerjanya apa aja
    console.log(event.originalEvent.type);
    if(event.originalEvent.type == 'click'){

    }
    // console.log(event.data.kode);
    // // if(this.kdModul == event.data.kode){
    //   this.getUser2(this.kdPgw);
    //   console.log('tampil unit yang udah disimpan')
    // // }
    
  }

  getUser2(kdPegawai){

    this.httpService.get(Configuration.get().dataMasterNew +'/loginuser/findByKdPegawai/' + kdPegawai).subscribe(
      result => {
        console.log(result.LoginUser[0].kdUser);
        if(result.LoginUser["0"].kdUser == null ||  result.LoginUser["0"].kdUser == "-") {
          // this.listDataRuangan = [];
          this.selectedModul = [];
          this.selectedUnit = [];
          //this.getDataModul();
          this.getDataModulDanRuangan();
          this.formUser.get('tglSekarang').setValue(this.tglSekarang);
          this.statusEnabled = result.LoginUser["0"].dataUser.statusEnabled;
          this.version = null;
        } else {

          this.dataPilihModul = this.dataAplikasi;
          this.kdUser = result.LoginUser["0"].kdUser;
          this.statusEnabled = result.LoginUser["0"].dataUser.statusEnabled;

          this.httpService.get(Configuration.get().dataMasterNew +'/loginuser/findAllAkses?kode=' + this.kdUser).subscribe(
            result => {
              this.selectedModul = [];
              this.selectedUnit=[];
              console.log(result.dataModulAplikasi);
              console.log(result.dataRuangan);
              this.listDataModul = result.dataModulAplikasi;
              this.listDataRuangan = result.dataRuangan;

              // this.httpService.get(Configuration.get().dataMasterNew + '/loginuser/findAllAkses?kode='+ this.kdUser).subscribe(
              //   result => {
              //     this.listDataModul = result.dataModulAplikasi;
              //     this.listDataRuangan = result.dataRuangan;
              //   }
              //   )
              //   this.selectedModul = result.dataModulAplikasi;
              //   this.selectedUnit = result.dataRuangan;
            }
          )


          // this.httpService.get(Configuration.get().dataMasterNew +'/maploginusertoprofile/findByKode/' + this.kdUser).subscribe(
          //   result => {
          //     this.selectedModul = [];
          //     this.selectedUnit=[];
              //masukin dulu semua data yang di dapet
          //     this.httpService.get(Configuration.get().dataMasterNew + '/modulaplikasi/findAllWithRuangan/').subscribe(
          //       result => {
          //         this.listDataModul = result.dataModulAplikasi;
          //         this.listDataRuangan = result.dataRuangan;
          //       }
          //       )
                  // isi yang ada yang waktu simpan pertama dipilih
          //       this.selectedModul = result.dataModulAplikasi;
          //       this.selectedUnit = result.dataRuangan;
          //   }
          // )



      this.formUser.get('namaUserEmail').setValue(result.LoginUser[0].dataUser.namaUserEmail);
      this.namaUser = result.LoginUser[0].dataUser.namaUserEmail;
      this.namaMobile = result.LoginUser[0].dataUser.namaUserMobile;
      this.formUser.get('namaUserMobile').setValue(result.LoginUser[0].dataUser.namaUserMobile);
      // this.formUser.get('kataSandi').setValue(result.LoginUser[0].dataUser.kataSandi);
      this.formUser.get('kataSandi').setValue('     ');
      this.formUser.get('tglSekarang').setValue(new Date(result.LoginUser[0].dataUser.tglDaftar * 1000));
      this.formUser.get('hintKataSandi').setValue(result.LoginUser[0].dataUser.hintKataSandi);
      this.formUser.get('kdKelompok').setValue(result.LoginUser["0"].kelompokUser.id);
      this.version = result.LoginUser["0"].dataUser.version;
      this.namaUserEmail = result.LoginUser[0].dataUser.namaUserEmail;
      this.namaUserMobile = result.LoginUser[0].dataUser.namaUserMobile;
}

}
);

}

toggleCoba(rowData: any, dtEn: any) {
  dtEn.toggleRow(rowData);
}

isParentChecked(event,data,index){

  // if (event == true) {
  //     if (data.child.length !== 0) {
  //         for (let i = 0; i < data.child.length; i++) {
  //             data.child[i].statusEnabled = true;
  //         }
  //     }
  // }else{
  //   if (data.child.length !== 0) {
  //     for (let i = 0; i < data.child.length; i++) {
  //       data.child[i].statusEnabled = false
  //     }
  //   }
  // }

}


}
class InisialDataPegawai implements DataPegawai {
  constructor(
    public namaLengkap?,
    public tglLahir?,
    public namaJenisKelamin?,
    public kdPegawai?,
    public tanggalLahir?
    ) {}

}



