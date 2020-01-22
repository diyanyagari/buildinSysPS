import { Component, OnInit } from '@angular/core';
import { HttpClient} from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { LogUser } from './loguser.interface';
import { Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService,  InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-negara',
  templateUrl: './loguser.component.html',
  styleUrls: ['./loguser.component.scss'],
  providers: [ConfirmationService]
})
export class LogUserComponent implements OnInit {
    item : LogUser = new InisialLogUser();;
    selected: LogUser;
    entities : string;
    kode:any;
    listData: any[];
    listdatadua:any[];
    listdatatiga:any[];
  
    dataDummy: {};
    versi: any;
    formLogUser: FormGroup;
    constructor(private alertService : AlertService,
    	private InfoService: InfoService,
    	private httpService: HttpClient,
    	private confirmationService: ConfirmationService,
    	private fb: FormBuilder) { }


    

      onRowSelect(event) {
     
        let cloned = this.clone(event.data);
        this.item = cloned;
        var a= cloned;
        this.ngOnInit();
        console.log(JSON.stringify(this.item));
    }


    ngOnInit() {

         this.httpService.get(Configuration.get().dataMasterNew+'/logging/findAll?tanggalAwal=01-01-2017&tanggalAkhir=12-12-2017').subscribe(table => {
          debugger;
          this.listdatadua = table.data.modul;
       //   console.log(JSON.stringify(this.listData));
        });

          
          this.httpService.get(Configuration.get().dataMasterNew+'/logging/findByModel?tanggalAwal=01-01-2017&tanggalAkhir=12-12-2017&entity='+this.item.entities).subscribe(table => {
          debugger;
          this.listData = table.data.dataUser.user;
          for (let i=0; i<this.listData.length;i++)
            {
              this.listData[i].entities = this.item.entities;

            }

          console.log(JSON.stringify(this.listData));
        });


        this.httpService.get(Configuration.get().dataMasterNew+'/logging/findDetailLog?tanggalAwal=01-01-2017&tanggalAkhir=12-12-2017&user='+this.item.entities+'&kdpegawai='+this.item.kode).subscribe(table => {
          debugger;
          this.listdatatiga = table.data.detailLog;
       //   console.log(JSON.stringify(this.listData));

        });
        
     debugger;
    } 


     clone(cloned: LogUser): LogUser {
        let hub = new InisialLogUser();
        for(let prop in cloned) {
            hub[prop] = cloned[prop];
        }
        let fixHub = new InisialLogUser();
        fixHub = {
         "kode": hub.kode,
		     "entities": hub.entities
        }
       
        return fixHub;
    }



   
 
   
   

   // reset(){
   //     this.item = {};
   // }
   
   
    
    
    findSelectedIndex(): number {
        return this.listData.indexOf(this.selected);
    }
    onDestroy(){

    }
}

class InisialLogUser implements LogUser {

    constructor(
      public entities?,
      public kode?
    ) {}

}