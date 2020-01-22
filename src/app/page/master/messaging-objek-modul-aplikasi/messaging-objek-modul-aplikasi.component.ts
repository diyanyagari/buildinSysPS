import { Component, OnInit } from '@angular/core';
import {HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MessagingObjek } from './messaging-objek-modul-aplikasi.interface';
import { Validators,FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Configuration ,AlertService, InfoService } from '../../../global';


@Component({
  selector: 'app-messaging-objek-modul-aplikasi',
  templateUrl: './messaging-objek-modul-aplikasi.component.html',
  styleUrls: ['./messaging-objek-modul-aplikasi.component.scss'],
  providers: [ConfirmationService]
})
export class MessagingObjekModulAplikasiComponent implements OnInit {

  item : MessagingObjek = new InisialMessagingObjek();
  selected: MessagingObjek;
  listData: any[];
  dataDummy:{};
  kodeME:MessagingObjek[];
  kodeMOT: MessagingObjek[];
  kodeOMA: MessagingObjek[];
  kodeRuanganTujuan: MessagingObjek[];
  versi: any;
  formMessaging: FormGroup;
  namaM: string;


  constructor(
    private alertService: AlertService,
  	private httpService: HttpClient,
    private confirmationService: ConfirmationService,
  	private fb: FormBuilder,
  	) { }

  ngOnInit() {

    this.httpService.get(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/findAll?page=1&rows=10').subscribe(table => {
          this.listData = table.data.messagingObjekModulAplikasi;
        });

        this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Messaging&select=*').subscribe(res => {
           debugger;
          this.kodeME = [];
          this.namaM;
          this.kodeME.push({label:'--Silahkan Pilih Kode Messaging--', value:''})
          for(var i=0;i<res.data.data.length;i++) {
            this.kodeME.push({label:res.data.data[i].namaMessaging, value:res.data.data[i].id.kode})
            this.namaM = res.data.data[i].namaMessaging;
          };
        });    

        this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=ModulAplikasi&select=*').subscribe(res => {
          this.kodeMOT = [];
          this.kodeMOT.push({label:'--Silahkan Pilih Kode Model Modul Aplikasi Tujuan--', value:''})
          for(var i=0;i<res.data.data.length;i++) {
            this.kodeMOT.push({label:res.data.data[i].namaModulAplikasi, value:res.data.data[i].id.kode})
          };
        }); 

        this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=ObjekModulAplikasi&select=*').subscribe(res => {
          this.kodeOMA = [];
          this.kodeOMA.push({label:'--Silahkan Kode Objek Modul Aplikasi--', value:''})
          for(var i=0;i<res.data.data.length;i++) {
            this.kodeOMA.push({label:res.data.data[i].namaObjekModulAplikasi, value:res.data.data[i].id.kode})
          };
        });

        this.httpService.get(Configuration.get().dataMasterNew+'/service/list-generic?table=Ruangan&select=*').subscribe(res => {
          this.kodeRuanganTujuan = [];
          this.kodeRuanganTujuan.push({label:'--Silahkan Kode Ruangan Tujuan--', value:''})
          for(var i=0;i<res.data.data.length;i++) {
            this.kodeRuanganTujuan.push({label:res.data.data[i].namaRuangan, value:res.data.data[i].id.kode})
          };
        });

  }

  confirmDelete() {
        this.confirmationService.confirm({
            message: 'Apakah data akan di hapus?',
            header: 'Konfirmasi Hapus',
            icon: 'fa fa-trash',
            accept: () => {
                this.hapus();
            },
            reject: () => {
                this.alertService.warn('Peringatan','Data Tidak Dihapus');
            }
        });
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
      // debugger;
      this.httpService.update(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/update/'+this.versi, this.item).subscribe(response =>{
            this.alertService.success('Berhasil','Data Diperbarui');
            this.httpService.get(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/findAll?page=1&rows=10').subscribe(table => {
            this.listData = table.data.messagingObjekModulAplikasi;
          });
        });  
    }

    simpan() {
       // debugger;

       let checked = this.item.statusEnabled;
       if(this.item.statusEnabled == undefined){
         checked = false;
        }
       
      this.dataDummy = {
      "kdMessaging": this.item.kdMessaging,
      "kdModulAplikasiTujuan": this.item.kdModulAplikasiTujuan,
      "kdObjekModulAplikasiTujuan": this.item.kdObjekModulAplikasiTujuan,
      "kdRuanganTujuan": this.item.kdRuanganTujuan,
      "statusEnabled": checked,
      "kode":0,
      "kodeExternal": "kode",
      "namaExternal": "namaExternal",
      "namaMessaging": "namaMessaging",
      "reportDisplay": "ssss"
    }
    if (this.item.kdMessaging != null || this.item.kdModulAplikasiTujuan != null || this.item.kdObjekModulAplikasiTujuan != null) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/save?', this.dataDummy).subscribe(response =>{
              this.alertService.success('Berhasil','Data Disimpan');
              // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
              this.reset();
              this.httpService.get(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/findAll?page=1&rows=10').subscribe(table => {
              this.listData = table.data.messagingObjekModulAplikasi;
            });
          });  
    }
          
    }

     reset(){
        this.item = {};
    }
    onRowSelect(event) {
        let cloned = this.clone(event.data);
        this.item = cloned;
        console.log(JSON.stringify(this.item));
    }
    clone(cloned: MessagingObjek): MessagingObjek {
        let hub = new InisialMessagingObjek();
        for(let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialMessagingObjek();
        console.log(hub);
        fixHub = {
    
        "kdMessaging": hub.kdMessaging,
        "kdModulAplikasiTujuan": hub.kdModulAplikasiTujuan,
        "kdRuanganTujuan": hub.kdRuanganTujuan,
        "kdObjekModulAplikasiTujuan": hub.kdObjekModulAplikasiTujuan,
        "version": hub.version,
        "statusEnabled": hub.statusEnabled,
        "kodeExternal": hub.kodeExternal,
        "namaExternal": hub.namaExternal,
        "namaMessaging": hub.namaMessaging,
        "reportDisplay": hub.reportDisplay
        }
        this.versi = hub.version;
        return fixHub;
    }

    hapus() {
      // debugger;
        let item = [...this.listData]; 
        let deleteItem = item[this.findSelectedIndex()];
        this.httpService.delete(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/del/'+deleteItem.kdMessaging+'/'+deleteItem.kdObjekModulAplikasiTujuan+'/'+deleteItem.kdModulAplikasiTujuan).subscribe(response => {
            this.alertService.success('Berhasil','Data Dihapus');
            this.httpService.get(Configuration.get().dataMasterNew+'/messagingObjekModulAplikasi/findAll?page=1&rows=10').subscribe(table => {
            this.listData = table.data.messagingObjekModulAplikasi;
          });
        });
        
    }

    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy(){

    }

}

class InisialMessagingObjek implements MessagingObjek {

    constructor(
      public id?,
      public kdProfile?,
      public kode?,
        public kdMessaging?,
        public namaMessaging?,
        public kdModulAplikasiTujuan?,
        public kdObjekModulAplikasiTujuan?, 
        public kdRuanganTujuan?,
        public statusEnabled?,
        public version?,
        public kodeExternal?,
        public namaExternal?,
        public label?,
        public reportDisplay?


    ) {}

}
