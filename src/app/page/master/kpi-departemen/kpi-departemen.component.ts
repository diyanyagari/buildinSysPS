import { Component, OnInit } from '@angular/core';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { LazyLoadEvent, Message, ConfirmDialogModule,ConfirmationService, MenuItem, SelectItem } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService } from '../../../global';

@Component({
  selector: 'app-kpi-departemen',
  templateUrl: './kpi-departemen.component.html',
  styleUrls: ['./kpi-departemen.component.scss'],
  providers: [ConfirmationService]
})
export class KpiDepartemenComponent implements OnInit {

  tanggalAwal:any;
	tanggalAkhir:any;
	inputKPIPOP:boolean;
	dataInputKPI:any[];
	listKPI:any[];
	perspektif: MenuItem[];
	listDataPerspektif:any[];
	listStrategis:any[];
	strategis:any[];
	kdPerspektif:any;
	kdStrategis:any;
	listDataKpi:any[];
	bobot:any[];
	satuanHasil:any[];
	target:any[];
	listGridKPI:any[];
	selectedPerspective:any[];
	selectedStrategis:any[];
	noHistorisSt:any;
  tampungStrategis:any[];
  formAktif: boolean;
  kdDepartemen: any;
	Departemen:any[];
	kdDepartemenD:any;

  
  constructor(
    private confirmationService: ConfirmationService,
    private httpService: HttpClient,
    private alertService: AlertService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.listGridKPI = [];
		this.perspektif = [];
		this.strategis = [];
		this.dataInputKPI = [];
		this.kdStrategis = '';
		this.kdPerspektif = '';
		this.kdDepartemen = '';
		this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
    this.inputKPIPOP = false;
    this.formAktif = true;
    this.selectedPerspective = [];
    this.selectedStrategis = [];
    this.getDepartemen();
    this.getKPI();
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
	
	setUpdateKPI(kodeS){
		//ambil data kpi yang tadi di simpan/update
		for(var i=0; i < this.tampungStrategis.length; i++){
			if(this.tampungStrategis[i].value[0] == this.kdStrategis){
				this.noHistorisSt = this.tampungStrategis[i].value[1];
			}
		}
		let dataTampung = [];
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKode/'+this.noHistorisSt+'/'+this.kdPerspektif+'/'+kodeS+'/'+this.kdDepartemen).subscribe(table => {
			this.listGridKPI = table.ProfileHistoriStrategyMapDKPI;
		});
	}


  getDepartemen(){
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Departemen&select=namaDepartemen,id.kode').subscribe(res => {
      this.Departemen = [];
      this.Departemen.push({ label: '-- Pilih --', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.Departemen.push({ label: res.data.data[i].namaDepartemen, value: res.data.data[i].id_kode })
      };
    });
  }

  getKPI() {
    this.httpService.get(Configuration.get().dataBSC +'/kpi/findAll?page='+ Configuration.get().page +'&rows='+ Configuration.get().rows +'&dir=namaKPI&sort=desc').subscribe(res => {
      this.listKPI = [];
      this.listKPI.push({label:'--Pilih Nama KPI--', value:''})
      for(var i=0;i<res.KPI.length;i++) {
        this.listKPI.push({label:res.KPI[i].namaKPI, value:res.KPI[i]})
      };
    },
    error => {
      this.listKPI = [];
      this.listKPI.push({label:'-- '+ error +' --', value:''})
    });

}
  
  valueDepartemen(event){
		console.log(event);
		this.kdDepartemenD = event;
  }

  cariPeriode(){
		this.selectedStrategis = [];
		this.selectedPerspective = [];
    let dataTampungP = [];
		let dataTampungS = [];
    let awal = this.setTimeStamp(this.tanggalAwal);
    let akhir = this.setTimeStamp(this.tanggalAkhir);
    console.log(this.kdDepartemen);
    if(this.kdDepartemen == null || this.kdDepartemen == undefined || this.kdDepartemen == ''){
      this.alertService.warn("Peringatan","Harap Pilih Departemen Terlebih Dahulu");
    }else{

      this.httpService.get( Configuration.get().dataBSC + '/profilehistoristrategymapd/findByPeriodandPerspective/{startDate}/{endDate}/{kdDepartemenD}/{kdPerspectiveD}?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=kdPerspective&sort=desc&startDate=' + awal + '&endDate=' + akhir + '&kdDepartemenD='+ this.kdDepartemen ).subscribe(table => {
        let dataMap = table.ProfileHistoriStrategyMapD;
        for(var z=0;z<dataMap.length;z++){
          let dataItemP = {
              "label": dataMap[z].namaPerspectiveD,
              "value": dataMap[z].kdPerspectiveD
          };
          let dataItemS = {
            "label": dataMap[z].namaStrategyD,
            "value": [
              dataMap[z].kdStrategyD,
              dataMap[z].noHistori,
              dataMap[z].kdPerspectiveD
            ]
          }
          
          dataTampungP.push(dataItemP);
          dataTampungS.push(dataItemS);
        }
  
        for(var y=0;y<dataTampungP.length;y++){
          if(dataTampungP[y].value == dataTampungP[y].value && dataTampungP.length > 1){
            dataTampungP.splice(y, 1)
          }
        }
  
  
      });
  

      this.perspektif = dataTampungP;
      this.strategis = dataTampungS;
      this.tampungStrategis = dataTampungS;

    }

  }

  getTglAwal(){
		this.selectedPerspective = [];
		this.selectedStrategis = [];
		this.perspektif = [];
		this.strategis = [];
		this.listGridKPI = [];
    this.kdDepartemen = '';
  }

  getTglAkhir(){
		this.selectedPerspective = [];
		this.selectedStrategis = [];
		this.perspektif = [];
		this.strategis = [];
		this.listGridKPI = [];
    this.kdDepartemen = '';
  }

  tambahKPI(){
		if(this.dataInputKPI.length == 0){
			let dataTemp = {
				"nomor":null,
				"kpi":{
					"namaKPI":"--Pilih Nama KPI--",
					"id_kode": null,
				},
				"bobot":null,
				"target":null
			}
			let dataInputKPI = [...this.dataInputKPI];
			dataInputKPI.push(dataTemp);
			this.dataInputKPI = dataInputKPI;
		}else{
			let last = this.dataInputKPI.length - 1;
			if(this.dataInputKPI[last].kpi.kode == null || this.dataInputKPI[last].bobot == null || this.dataInputKPI[last].target == null ){
				this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
			}else{

				for (let i = 0; i < this.listKPI.length; i++) {
					if (this.listKPI[i].value.kode == this.dataInputKPI[last].kpi.kode) {
						this.listKPI.splice(i, 1);
					}
				}

				let dataTemp = {
					"nomor":null,
					"kpi":{
						"namaKPI":"--Pilih Nama KPI--",
						"id_kode": null,
					},
					"bobot":null,
					"target":null
				}
				let dataInputKPI = [...this.dataInputKPI];
				dataInputKPI.push(dataTemp);
				this.dataInputKPI = dataInputKPI;
			}
		}
		
  }
  
  hapusKpi(row){
		let dataInputKPI = [...this.dataInputKPI];
		dataInputKPI.splice(row, 1);
		this.dataInputKPI = dataInputKPI;
  }
  
  simpanInputKPI(){
		let awal = this.setTimeStamp(this.tanggalAwal);
		let akhir = this.setTimeStamp(this.tanggalAkhir);
		if (this.formAktif == false) {
			this.confirmUpdate();
		}else{

			if(this.dataInputKPI.length == 0 ){
				this.alertService.warn('Peringatan', 'Tidak Ada Data Untuk Di Simpan');
			}else{

				let tampungKPI = [];
				for(var i=0;i<this.dataInputKPI.length;i++){
					let dataKPI = {
						"bobotKPI": this.dataInputKPI[i].bobot,
						  "kdAsalData": 0,
						  "kdKPI": this.dataInputKPI[i].kpi.kode,
						  "kdMetodeHitungActual": this.dataInputKPI[i].kpi.kdMetodeHitungScore,
						  "kdPeriodeData": 0,
						  "keteranganLainnya": "",
						  "noRec": "",
						  "statusEnabled": this.dataInputKPI[i].kpi.statusEnabled,
						  "targetKPIMax": this.dataInputKPI[i].target,
						  "targetKPIMin": this.dataInputKPI[i].target
					}
	
					tampungKPI.push(dataKPI);
	
				}
	
				let dataSimpan = {
					"kdDepartemen": this.kdDepartemen,
					"kdPerspective": this.kdPerspektif,
					"kdStrategy": this.kdStrategis,
					"noHistori": this.noHistorisSt,
					"profileHistoriStrategyMapDKPI": tampungKPI,
					"tglAkhir": awal,
					"tglAwal": akhir,
					"version": 0
				}
	
				this.httpService.post(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/save', dataSimpan).subscribe(response => {
					this.alertService.success('Berhasil', 'Data Disimpan');
					this.setUpdateKPI(this.kdStrategis);
					//this.ngOnInit();
				});

				//ambil data kpi yang tadi di simpan/update
				// for(var i=0; i < this.tampungStrategis.length; i++){
				// 	if(this.tampungStrategis[i].value[0] == this.kdStrategis){
				// 		this.noHistorisSt = this.tampungStrategis[i].value[1];
				// 	}
				// }
				// let dataTampung = [];
				// this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKode/'+this.noHistorisSt+'/'+this.kdPerspektif+'/'+this.kdStrategis+'/'+this.kdDepartemen).subscribe(table => {
				// 	this.listGridKPI = table.ProfileHistoriStrategyMapDKPI;
				// });

				this.inputKPIPOP = false;

				
			}
			
		} 
		
  }

  refreshData(){
		this.ngOnInit();
	}
  
  confirmUpdate() {
		this.confirmationService.confirm({
			message: 'Apakah data akan diperbaharui?',
			header: 'Konfirmasi Pembaharuan',
			accept: () => {
				this.update();
			}
		});
  }
  
  update(){
		let versi = 0;
		let awal = this.setTimeStamp(this.tanggalAwal);
		let akhir = this.setTimeStamp(this.tanggalAkhir);

		let tampungKPI = [];
			for(var i=0;i<this.dataInputKPI.length;i++){
				let dataKPI = {
					"bobotKPI": this.dataInputKPI[i].bobot,
      				"kdAsalData": 0,
      				"kdKPI": this.dataInputKPI[i].kpi.kode,
      				"kdMetodeHitungActual": this.dataInputKPI[i].kpi.kdMetodeHitungScore,
      				"kdPeriodeData": 0,
      				"keteranganLainnya": "",
      				"noRec": "",
      				"statusEnabled": this.dataInputKPI[i].kpi.statusEnabled,
      				"targetKPIMax": this.dataInputKPI[i].target,
      				"targetKPIMin": this.dataInputKPI[i].target
				}

				tampungKPI.push(dataKPI);

			}

			let dataUpdate = {
				"kdDepartemen": this.kdDepartemen,
				"kdPerspective": this.kdPerspektif,
				"kdStrategy": this.kdStrategis,
				"noHistori": this.noHistorisSt,
				"profileHistoriStrategyMapDKPI": tampungKPI,
				"tglAkhir": awal,
				"tglAwal": akhir,
				"version": 0
			}
	
		this.httpService.update(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/update/' + versi + '/', dataUpdate).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			this.setUpdateKPI(this.kdStrategis);
			//this.ngOnInit();
		});

		//ambil data kpi yang tadi di simpan/update
		// for(var i=0; i < this.tampungStrategis.length; i++){
		// 	if(this.tampungStrategis[i].value[0] == this.kdStrategis){
		// 		this.noHistorisSt = this.tampungStrategis[i].value[1];
		// 	}
		// }
		// let dataTampung = [];
		// this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKode/'+this.noHistorisSt+'/'+this.kdPerspektif+'/'+this.kdStrategis+'/'+this.kdDepartemen).subscribe(table => {
		// 	this.listGridKPI = table.ProfileHistoriStrategyMapDKPI;
		// });

		this.inputKPIPOP = false;




	}
	

  
  //untuk perspektif ke strategis
  getKodePerspektif(event){
		this.selectedStrategis = [];
		this.listGridKPI = [];
		this.kdPerspektif = event.value;
		let dataTampung = [];
		let awal = this.setTimeStamp(this.tanggalAwal);
		let akhir = this.setTimeStamp(this.tanggalAkhir);
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapd/findByPeriodandPerspective/{startDate}/{endDate}/{kdDepartemenD}/{kdPerspectiveD}?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=kdPerspective&sort=desc&startDate='+ awal +'&endDate='+ akhir+ '&kdDepartemenD='+ this.kdDepartemen +'&kdPerspectiveD='+this.kdPerspektif).subscribe(table => {
			let dataPM = table.ProfileHistoriStrategyMapD;
			for(var x=0;x<dataPM.length;x++){
				let dataItem = {
						"label": dataPM[x].namaStrategyD,
						"value": dataPM[x].kdStrategyD
				};
				dataTampung.push(dataItem)
			}
		});
		this.strategis = dataTampung;	
  }
  
  //untuk mau input KPI nya strategis
  getKodeStrategis(event){

		if(this.kdPerspektif == '' || this.kdPerspektif == null || this.kdPerspektif == undefined){
			this.alertService.warn('Peringatan','Harap Pilih Perspektif Terlebih Dahulu');
		}else{
			this.kdStrategis = event.value;
			for(var i=0; i < this.tampungStrategis.length; i++){
				if(this.tampungStrategis[i].value[0] == this.kdStrategis){
					this.noHistorisSt = this.tampungStrategis[i].value[1];
				}
			}
			
			//get dulu data yang punya kpi nya
			let tampungData = []
			this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKode/'+this.noHistorisSt+'/'+this.kdPerspektif+'/'+this.kdStrategis+'/'+this.kdDepartemen).subscribe(table => {
				tampungData = table.ProfileHistoriStrategyMapDKPI;
				
				//cek Sudah ada belum sebelumnya
				if(tampungData.length != 0 ){
					//masukin ke dataInputKPI saat datanya sudah ada
					this.formAktif = false;
					let dataP  = [];
					
					for(var c=0; c<tampungData.length; c++){
						let dataTempUpdate = {
							"nomor":null,
							"kpi":{
								"namaKPI":tampungData[c].namaKPI,
								"kode":tampungData[c].kdKPI,
								"kdMetodeHitungScore":tampungData[c].kdMetodeHitungActual,
								"namaSatuanHasil":tampungData[c].namaSatuanHasil,
								"namaTypeDataObjek":tampungData[c].namaTypeDataObject,
								"namaMetodeHitung":tampungData[c].namaMetodeHitung,
								"statusEnabled":tampungData[c].statusEnabled
							},

							"bobot":tampungData[c].bobotKPI,
							"target":tampungData[c].targetKPIMin

						}
						dataP.push(dataTempUpdate);
					}
					
					let dataInputKPI = [...this.dataInputKPI];
					dataInputKPI = dataP;
					this.dataInputKPI = dataInputKPI;

					this.inputKPIPOP = true;
				}else{
					this.inputKPIPOP = true;	
				}

			});

			
			this.dataInputKPI = [];
		}
  }
  
  //untuk view atau lihat KPI yang telah disimpan
  setKPI(event){
		
		if(this.kdPerspektif == '' || this.kdPerspektif == null || this.kdPerspektif == undefined){
			this.alertService.warn('Peringatan','Harap Pilih Perspektif Terlebih Dahulu');
		}else{
		this.kdStrategis = event.value;
		for(var i=0; i < this.tampungStrategis.length; i++){
			if(this.tampungStrategis[i].value[0] == this.kdStrategis){
				this.noHistorisSt = this.tampungStrategis[i].value[1];
			}
		}
		let dataTampung = [];
		this.httpService.get(Configuration.get().dataBSC + '/profilehistoristrategymapdkpi/findByKode/'+this.noHistorisSt+'/'+this.kdPerspektif+'/'+this.kdStrategis+'/'+this.kdDepartemen).subscribe(table => {
			this.listGridKPI = table.ProfileHistoriStrategyMapDKPI;
		});
		}
		
	}


}
