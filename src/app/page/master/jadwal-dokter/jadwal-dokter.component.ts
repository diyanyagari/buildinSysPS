import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { AlertService, InfoService, Configuration, AuthGuard } from '../../../global';
//import moment = require('moment');
import * as moment from 'moment';

@Component({
    selector: 'app-jadwal-dokter',
    templateUrl: './jadwal-dokter.component.html',
    styleUrls: ['./jadwal-dokter.component.scss'],
    providers: [ConfirmationService]
})
export class JadwalDokterComponent implements OnInit {
    jamAwal: any;
    jamAkhir: any;
    listData: any[];
    listDataDokter: any[];
    listJadwalDokter: any[];
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    formAktif: boolean;
    pilihan: any = [];    
    selectedAll: any;   
    kode: any;
    user: any;
    versi: number;
    listDataHari: any[];
    listDataTgl: any[];
    listDepartemen: any[];
    listRuangan: any[];
    getDefault: any;
    disJamDefault: boolean;
    block: boolean;
    blockJadwal: boolean;
    pilihanDokter: any[];
    pilihSemua: boolean;

    tanggalAwal: any;
    tanggalAkhir: any;
    listJenisPegawai: any[];
    dataInputJadwal:any[];
    listDokter:any[];
    listHari:any[];
    listRuanganTambah:any[];
    listNoKamar:any[];
    listStatusAbsen:any[];
    listDataJadwalDokter:any[];
    selectedDataDokter:any;
    totalRecords:any;
    pencarian:any;
    buttonAktif:boolean;
    tanggalfilter:any;
    disableInput:boolean;
    penandaSelect:boolean;
    noHis:any;
    penandaGaBoleh:boolean;
    indexHapus:any;
    tampungData:any[];
    indexRowPilih:any;
    totalHapus:any;
    penandaTambah:any;


    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private authGuard: AuthGuard,) {
    }

    ngAfterViewInit() {
        var x = document.getElementsByClassName("ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-shadow ui-datepicker-timeonly ng-trigger ng-trigger-overlayState") as HTMLCollectionOf<HTMLElement>;
        var timeStyle = document.getElementsByClassName("ui-timepicker ui-widget-header ui-corner-all") as HTMLCollectionOf<HTMLElement>;
        for (var i = 0; i < x.length; i++) {
          x[i].style.width = '77px';
        }
        for (var i = 0; i < timeStyle.length; i++) {
          timeStyle[i].style.width = '77px';
        }
    }

    ngOnInit() {
        this.penandaTambah = false;
        this.totalHapus = 0;
        this.indexHapus = null;
        this.tampungData = [];
        this.penandaGaBoleh = false;
        this.noHis = '';
        this.penandaSelect = false;
        this.selectedDataDokter = [];
        this.disableInput = false;
        this.dataInputJadwal = [];
        this.buttonAktif = true;
        this.pencarian = "";
        this.listJenisPegawai = [];
        this.tanggalAwal = new Date();
        this.tanggalAkhir = new Date();
        this.tanggalfilter = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
        
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.getDefault = false;
        this.pilihSemua = false;
        this.disJamDefault = true;
        this.pilihanDokter = [];
        this.listData = [];
        this.listDataDokter = [];
        this.listJadwalDokter = [];
        this.block = true;
        this.blockJadwal = true;
        this.getDepartemen();
        this.getJenisPegawai();

        //this.getRuanganAll();
        this.getHari();
        this.getDropdownBawah();
        this.getGrid(this.page,this.rows, this.pencarian, this.setTimeStamp(this.tanggalfilter));
        this.form = this.fb.group({
            'kdDepartemen': new FormControl(null),
            'kdRuangan': new FormControl(null),
            'kdJenisPegawai': new FormControl(null),
            'kdDokter': new FormControl(null)
        });
        this.versi = 1;
        this.user = this.authGuard.getUserDto();
        console.log('user: ',this.user)       
        this.listJadwalDokter = [];
        this.jamAwal = '';
        this.jamAkhir = '';
        this.listDataTgl = [{'kdJam':1,'nama': 'Jam Awal'},{'kdJam':2,'nama': 'Jam Akhir'}];    
        // this.listDataDokter = [{'id_kode':1,'namaLengkap': 'Miftah'},{'id_kode':2,'namaLengkap': 'Syamsudin'}];       
    }
    
    getGrid(page: number, rows: number, search: any, caritgl: any){
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/getJadwalDokter?page=' + page + '&rows=' + rows + '&dir=pegawai.namaLengkap&sort=desc&nama='+search+'&tgl='+caritgl).subscribe(table => {
            this.listDataJadwalDokter = table.jadwalDokter;
            this.totalRecords = table.totalRow;
        });
    }

    getDropdownBawah(){

        //ambil data hari
        this.httpService.get(Configuration.get().dataMasterNew + '/hari/findAllHari?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(res => {
            this.listHari = [];
            this.listHari.push({ label: '-Pilih-', value: null })
            for (var i = 0; i < res.Hari.length; i++) {
              this.listHari.push({ label: res.Hari[i].namaHari, value: res.Hari[i] })
            };
            }, error => {
                this.listHari = [];
			    this.listHari.push({ label: '-- ' + error + ' --', value: null });
          });

          //ambil data ruangan yang bawah
          this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Ruangan&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
            this.listRuanganTambah = [];
            this.listRuanganTambah.push({ label: '-Pilih-', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
              this.listRuanganTambah.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i] })
            };
            }, error => {
                this.listRuanganTambah = [];
			    this.listRuanganTambah.push({ label: '-- ' + error + ' --', value: null });
          });

        //   //ambil data kamar
        //   this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Kamar&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
        //     this.listNoKamar = [];
        //     this.listNoKamar.push({ label: '-Pilih-', value: null })
        //     for (var i = 0; i < res.data.data.length; i++) {
        //       this.listNoKamar.push({ label: res.data.data[i].namaKamar, value: res.data.data[i] })
        //     };
        //     }, error => {
        //         this.listNoKamar = [];
		// 	    this.listNoKamar.push({ label: '-- ' + error + ' --', value: null });
        //   });

          //ambil data status absen
          this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/getStatusAbsensi').subscribe(res => {
            this.listStatusAbsen = [];
            this.listStatusAbsen.push({ label: '-Pilih-', value: null });
            for (var i = 0; i < res.length; i++) {
              this.listStatusAbsen.push({ label: res[i].namaStatus, value: res[i] })
            };
            }, error => {
                this.listStatusAbsen = [];
			    this.listStatusAbsen.push({ label: '-- ' + error + ' --', value: null });
          });

    } 

   

    getDepartemen() {
        this.listRuangan = [];
        this.listRuangan.push({ label: '--Pilih Departemen Dulu--', value: null })
        this.httpService.get(Configuration.get().dataMasterNew + '/departemen/findAllData').subscribe(res => {
            this.listDepartemen = [];
            if (res.Departemen.length != 0) {
                this.listDepartemen.push({ label: '--Pilih Departemen--', value: null })
                for (var i = 0; i < res.Departemen.length; i++) {
                  this.listDepartemen.push({ label: res.Departemen[i].namaDepartemen, value: res.Departemen[i].kode.kode })
                };
            } else {
                this.listDepartemen.push({label:'--Data Departemen Kosong--', value:null})
            }
        });
    }

    getJenisPegawai(){
        // this.listDokter = [];
        // this.listDokter.push({ label: '--Pilih Departemen Dulu--', value: null })
        this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=JenisPegawai&select=namaJenisPegawai,id').subscribe(res => {
            this.listJenisPegawai = [];
            this.listJenisPegawai.push({ label: '--Pilih Jenis Pegawai--', value: null })
            for (var i = 0; i < res.data.data.length; i++) {
              this.listJenisPegawai.push({ label: res.data.data[i].namaJenisPegawai, value: res.data.data[i].id.kode })
            };
            }, error => {
                this.listJenisPegawai = [];
			    this.listJenisPegawai.push({ label: '-- ' + error + ' --', value: null });
          });

          
    }

    // getRuanganAll(){
    //     this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic?table=Ruangan&select=*&page=1&rows=1000&condition=and&profile=y').subscribe(res => {
    //         this.listRuangan = [];
    //         this.listRuangan.push({ label: '--Pilih Ruangan--', value: null })
    //         for (var i = 0; i < res.data.data.length; i++) {
    //           this.listRuangan.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id.kode })
    //         };
    //         }, error => {
    //             this.listRuangan = [];
	// 		    this.listRuangan.push({ label: '-- ' + error + ' --', value: null });
    //       });
    // }

    getRuangan(kdDepartemen) {
        this.form.get('kdRuangan').setValue(null);
        this.form.get('kdJenisPegawai').setValue(null);
        this.listRuangan = [];
        this.listDokter = [];
        this.httpService.get(Configuration.get().dataMasterNew + '/ruangan/findByKdDepartemen/'+ kdDepartemen).subscribe(res => {
            this.listRuangan = [];
            if (res.Ruangan.length != 0) {
                this.listRuangan.push({ label: '--Pilih Ruangan--', value: null })
                for (var i = 0; i < res.Ruangan.length; i++) {
                  this.listRuangan.push({ label: res.Ruangan[i].namaRuangan, value: res.Ruangan[i].kdRuangan })
                };
            } else {
                this.listRuangan.push({label:'--Data Ruangan Kosong--', value:null})
            }
        });
    }

    clearJenisPegawai(kdRuangan){
        //kalo dari onRowSelect gimana
        this.form.get('kdJenisPegawai').setValue(null);
        this.listDokter = [];
        console.log(kdRuangan);
        //ambil data kamar
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/getFasilitasDetailByKdRuangan?kdRuangan='+kdRuangan).subscribe(res => {
            this.listNoKamar = [];
            this.listNoKamar.push({ label: '-Pilih-', value: null })
            for (var i = 0; i < res.length; i++) {
              this.listNoKamar.push({ label: res[i].naNoFasilitasDetail, value: res[i] })
            };
            }, error => {
                this.listNoKamar = [];
			    this.listNoKamar.push({ label: '-- ' + error + ' --', value: null });
          });

    }

    getPegawaiBawah(kdJenisPgw){
        
        if(this.form.get('kdDepartemen').value == null || this.form.get('kdRuangan').value == null || this.form.get('kdJenisPegawai').value == null ){
            this.alertService.warn('Perhatian', 'Harap Pilih Departemen dan Ruangan Terlebih Dahulu');
            this.form.get('kdJenisPegawai').setValue(null);
          }else{
            //baru ambil ini kalo semua parameter sudah ada
          this.getDataPegawai(this.form.get('kdDepartemen').value,this.form.get('kdRuangan').value,kdJenisPgw);
          }
    }

    getDataPegawai(kdDep,kdRuangan,kdJenisPgw){
        
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/findPegawaiByKdDepartemenAndKdRuanganAndKdJenisPegawai?kdDepartemen='+kdDep+'&kdRuangan='+kdRuangan+'&kdJenisPegawai='+kdJenisPgw).subscribe(res => {
            this.listDokter = [];
            let tempJ = [];
            //di olah dulu disini
            // if(res.length != 0){
            //     for(let x =0; x < res.pegawai.length; x++){
            //     let dataJ = {
            //         'namaLengkap': res.pegawai[x].namaLengkap,
            //         'kode': res.pegawai[x].id.kode
            //     }
            //     tempJ.push(dataJ);
            //     }
            //     this.listDokter.push({ label: '-Pilih-', value: null })
            //     for (var i = 0; i < tempJ.length; i++) {
            //         this.listDokter.push({ label: tempJ[i].namaLengkap, value: tempJ[i] })
            //     };
            // }
            
            
            this.listDokter.push({ label: '--Pilih Dokter--', value: null });
                for (var i = 0; i < res.length; i++) {
                    this.listDokter.push({ label: res[i].namaLengkap, value: res[i].kdPegawai })
                };
            }, error => {
                this.listDokter = [];
			    this.listDokter.push({ label: '-- ' + error + ' --', value: null });
          });

    }



    getJadwalDokter(kdRuangan){
        this.httpService.get(Configuration.get().dataMasterNew + '/registrasiPegawai/findMasterPegawaiAktifByRuangan/' + kdRuangan).subscribe(res => {
            this.listDataDokter = res.data.data;
            this.block = false;
        });
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/findByRuangan/' + kdRuangan).subscribe(res => {
            if(res.data){
                let dataTemp = [];
                for (var i = 0; i < res.data.length; i++) {
                    for (var a = 0; a < res.data[i].jadwal.length; a++) {
                        res.data[i].jadwal[a].kdHari = res.data[i].jadwal[a].kode.kdHari
                        res.data[i].jadwal[a].jamAwal = res.data[i].jadwal[a].kode.jamAwal
                    }
                    res.data[i].id_kode = res.data[i].kdPegawai;
                    res.data[i].jadwal.sort(function(a, b){return a.kdHari - b.kdHari});
                    res.data[i].listHari = res.data[i].jadwal;
                    dataTemp.push(String(res.data[i].kdPegawai));
                }
                this.pilihanDokter = dataTemp;
                this.listJadwalDokter = res.data;
                this.blockJadwal = false;
            }
        });
        if(this.listJadwalDokter.length == this.listDataDokter.length){
            this.pilihSemua = true;
        }else{
            this.pilihSemua = false;
        }
    }
    getHari() {
        this.httpService.get(Configuration.get().dataMasterNew + '/hari/findAllHari?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(res => {
          this.listDataHari = res.Hari;
        });
    }
    getWaktuDefault(){
        if(this.getDefault == true){
            this.disJamDefault = false;
            this.jamAwal = '08:00';
            this.jamAkhir = '16:00';
            if(this.blockJadwal == false){
                this.getJamDefault();
            }
        }else{
            this.disJamDefault = true;
            this.jamAwal = '00:00';
            this.jamAkhir = '00:00';
            if(this.blockJadwal == false){
                this.getJamDefault();
            }
        }        
    }
    getJamDefault(){
        for (var i = 0; i < this.listJadwalDokter.length; i++) {
            for (var a = 0; a < this.listJadwalDokter[i].listHari.length; a++) {
                this.listJadwalDokter[i].listHari[a].jamAwal = this.jamAwal;
                this.listJadwalDokter[i].listHari[a].jamAkhir = this.jamAkhir;
            }       
        }
    }
    convertJam(value){
        if(value.length == undefined){
            var hours = value.getHours();
            var minutes = value.getMinutes();
            if(parseInt(hours)<10){
                hours = "0"+hours;
            }
            if(parseInt(minutes)<10){
                minutes = "0"+minutes;
            }
            var abc = hours+':'+minutes;
            return abc
        }else{
            abc = value
            return abc
        }
    }
    setCheckAll() {
        if (this.pilihSemua == true) {
            this.blockJadwal = false;
            this.pilihanDokter = [];
            let arrDataHari = [];
            let dataTemp = [];
            for (var i = 0; i < this.listDataDokter.length; i++) {
                this.deletejadwalDokter(this.listDataDokter[i],true);
                dataTemp.push(String(this.listDataDokter[i].id_kode));
            //     for (var a = 0; a < this.listDataHari.length; a++) {
            //         let objDataHari = {
            //             "id_kode": this.listDataDokter[i].id_kode,
            //             "kdNegara" : this.listDataHari[a].kode.kdNegara,
            //             "kdHari" : this.listDataHari[a].kode.kode,
            //             "namaHari": this.listDataHari[a].namaHari,
            //             "jamAwal": this.getDefault == true ? this.jamAwal : '',
            //             "jamAkhir": this.getDefault == true ? this.jamAkhir : ''
            //         }
            //         arrDataHari.push(objDataHari)
            //     }
            //     let objDatatemp = {
            //         "id_kode": this.listDataDokter[i].id_kode,
            //         "namaLengkap": this.listDataDokter[i].namaLengkap,
            //         "listHari": arrDataHari
            //     }
            //     this.listJadwalDokter.push(objDatatemp);
            //     arrDataHari = []
            }
            this.pilihanDokter = dataTemp;
        } else {
            this.blockJadwal = true;
            this.pilihanDokter = []
            this.listJadwalDokter = []
        }
    }
    onChangeDokter(data){
       
        let checked;
        for(let p=0; p < this.pilihanDokter.length; p++){
            if(this.pilihanDokter[p] == data.id_kode){
                //di cek apabila sebelumnya belum
                checked = true;
            }else{
                //waktu di uncek apabila sudah pernah dicek
                checked = false;
            }
        }
       
        this.blockJadwal = false;
        let arrDataHari = []
        let objDatatemp = {};
        //disini untuk dapetin perubahan jam kerja yang dari inputan ?
        for (var a = 0; a < this.listDataHari.length; a++) {
            let objDataHari = {
                "id_kode": data.id_kode,
                "kdNegara" : this.listDataHari[a].kode.kdNegara,
                "kdHari" : this.listDataHari[a].kode.kode,
                "namaHari": this.listDataHari[a].namaHari,
                "jamAwal": this.getDefault == true ? this.jamAwal : '',
                "jamAkhir": this.getDefault == true ? this.jamAkhir : ''
            }
            arrDataHari.push(objDataHari)
        }
        objDatatemp = {
            "id_kode": data.id_kode,
            "namaLengkap": data.namaLengkap,
            "listHari": arrDataHari
        }
        this.listJadwalDokter.push(objDatatemp);
        this.deletejadwalDokter(data,checked)
    }
    deletejadwalDokter(data,isCheckAll){
        let dataDup = []
        
        //ini buat apa yah ?
        for (var i = 0; i < this.listJadwalDokter.length; i++) {
            if(this.listJadwalDokter[i].id_kode == data.id_kode){
                let data = {
                   "id": this.listJadwalDokter[i].id_kode
                }
                //disini dapet 2 pasti sih
                dataDup.push(data)
            }
       }   
       if(isCheckAll == true){
           for (var i = 0; i < this.listJadwalDokter.length; i++) {
               if(this.listJadwalDokter[i].id_kode == data.id_kode){
                   this.listJadwalDokter.splice(i, 1)
               }
            }
            
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/findByRuangan/' + this.form.get('kdRuangan').value).subscribe(res => {
            let dataOk = false;
            
            for(let s=0; s < res.data.length; s++){
                if(res.data[s].kdPegawai == data.id_kode){
                    //sudah ada jadwal dia kesini
                    dataOk = true;
                    let dataTemp = [];
                    for (var i = 0; i < res.data.length; i++) {
                        for (var a = 0; a < res.data[i].jadwal.length; a++) {
                            res.data[i].jadwal[a].kdHari = res.data[i].jadwal[a].kode.kdHari
                            res.data[i].jadwal[a].jamAwal = res.data[i].jadwal[a].kode.jamAwal
                        }
                        res.data[i].id_kode = res.data[i].kdPegawai;
                        res.data[i].jadwal.sort(function(a, b){return a.kdHari - b.kdHari});
                        res.data[i].listHari = res.data[i].jadwal;
                        // dataTemp.push(String(res.data[i].kdPegawai));
                    }
    
                    //     this.pilihanDokter = dataTemp
                    dataTemp = res.data;
                    for(let u = 0; u < dataTemp.length; u++){
                        if(data.id_kode == dataTemp[u].kdPegawai){
                            this.listJadwalDokter.push(dataTemp[u]);
                        }
                    }
                    console.log(this.listJadwalDokter);
                    //break;
                //     this.blockJadwal = false;
                // }
    
                }
                //else{
                //     let arrDataHari = [];
                //     for (var i = 0; i < this.listDataDokter.length; i++) {
                //         if(this.listDataDokter[i].id_kode == data.id_kode){
                //             for (var a = 0; a < this.listDataHari.length; a++) {
                //                 let objDataHari = {
                //                     "id_kode": this.listDataDokter[i].id_kode,
                //                     "kdNegara" : this.listDataHari[a].kode.kdNegara,
                //                     "kdHari" : this.listDataHari[a].kode.kode,
                //                     "namaHari": this.listDataHari[a].namaHari,
                //                     "jamAwal": this.getDefault == true ? this.jamAwal : '',
                //                     "jamAkhir": this.getDefault == true ? this.jamAkhir : ''
                //                 }
                //                 arrDataHari.push(objDataHari)
                //             }
                //             let objDatatemp = {
                //                 "id_kode": this.listDataDokter[i].id_kode,
                //                 "namaLengkap": this.listDataDokter[i].namaLengkap,
                //                 "listHari": arrDataHari
                //             }
                //             this.listJadwalDokter.push(objDatatemp);
                //             arrDataHari = []
                //         }
                        
                //     }
                //     //break;
                // }
            }
            //ke sini kalo dokter belum pernah simpan jadwal /belum ada jadwal sebelumnya
            //for(let z=0; z < res.data.length; z++){
                let tampungSementara=[]
                if(dataOk != true){
                    let arrDataHari = [];
                    for (var i = 0; i < this.listDataDokter.length; i++) {
                        if(this.listDataDokter[i].id_kode == data.id_kode){
                            for (var a = 0; a < this.listDataHari.length; a++) {
                                let objDataHari = {
                                    "id_kode": this.listDataDokter[i].id_kode,
                                    "kdNegara" : this.listDataHari[a].kode.kdNegara,
                                    "kdHari" : this.listDataHari[a].kode.kode,
                                    "namaHari": this.listDataHari[a].namaHari,
                                    "jamAwal": this.getDefault == true ? this.jamAwal : '',
                                    "jamAkhir": this.getDefault == true ? this.jamAkhir : ''
                                }
                                arrDataHari.push(objDataHari)
                            }
                            let objDatatemp = {
                                "id_kode": this.listDataDokter[i].id_kode,
                                "namaLengkap": this.listDataDokter[i].namaLengkap,
                                "listHari": arrDataHari
                            }
                            this.listJadwalDokter.push(objDatatemp);
                            arrDataHari = []
                     
                        }
                    }
                    //this.listJadwalDokter = tampungSementara;
                }
            //}
           
            
        });
            
       }else{
           //kayannya disini harus dirubah ga pake dataDup ?? disini buat yang false aja
        //    if(dataDup.length >= 1){
               for (var i = 0; i < this.listJadwalDokter.length; i++) {
                   if(this.listJadwalDokter[i].id_kode == data.id_kode){
                       this.listJadwalDokter.splice(i, 1)
                   }
                }
              //splice lagi buat mastiin
              for (var z = 0; z < this.listJadwalDokter.length; z++) {
                if(this.listJadwalDokter[z].id_kode == data.id_kode){
                    this.listJadwalDokter.splice(z, 1)
                }
             }
             this.listJadwalDokter = this.listJadwalDokter;
             console.log(this.listJadwalDokter);
        //    }
       }
    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({
                    onlySelf: true
                });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
    onSubmit() {
        if (this.form.invalid) {
            this.validateAllFormFields(this.form);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            //this.simpan();
            this.simpanBaru();
        }
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

    update() {

        let penandaValidasi = true;
        if(this.dataInputJadwal.length != 0){
            for(let x=0; x<this.dataInputJadwal.length; x++){
               if(this.dataInputJadwal[x].kamar.kode.kode == null || this.dataInputJadwal[x].qtyPasienMax == null ||
                   this.dataInputJadwal[x].statusAbsen.kode == null ){
                   penandaValidasi = false;
               }
           }
       }
       
       if(this.dataInputJadwal.length == 0){
           this.alertService.warn('Perhatian','Tidak Ada Data Untuk DiSimpan');
       }else if(penandaValidasi == false){
           this.alertService.warn('Peringatan','Data Tidak Lengkap');
       }else if(this.penandaGaBoleh == true){
        this.alertService.warn('Perhatian','Range Jam Sudah Tersedia, Di Hari dan Kamar Yang Sama');
       }
       else if(penandaValidasi == true && this.penandaGaBoleh == false){
        let JadwalDokterDetailDto = [];
        for(let z=0; z<this.dataInputJadwal.length; z++){
            let data = {
                "jamAkhir": this.dataInputJadwal[z].jamAkhir,
                "jamAwal": this.dataInputJadwal[z].jamAwal,
                "kdHari": this.dataInputJadwal[z].hari.kode.kode,
                "kdKamar": this.dataInputJadwal[z].kamar.kode.kode,
                "kdPegawai": this.form.get('kdDokter').value,
                "kdRuangan": this.form.get('kdRuangan').value,
                "kdStatusAbsensi": this.dataInputJadwal[z].statusAbsen.kode,
                "qtyPasienMax": this.dataInputJadwal[z].qtyPasienMax
            }
            JadwalDokterDetailDto.push(data);
        }

         let dataSimpanUpdate = { 
            'jadwalKerjaDokterDetailDto' : JadwalDokterDetailDto,
            'noHistori':this.noHis,
            'tglAkhir':this.setTimeStamp(this.tanggalAkhir),
            'tglAwal': this.setTimeStamp(this.tanggalAwal)
        }

        console.log(dataSimpanUpdate)

        this.httpService.post(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/update', dataSimpanUpdate).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            this.reset();
        });
      }

    }


    simpanBaru(){
        let dataTemp = [];
        let JadwalDokterDetailDto = [];
        let penandaValidasi = true;

        if(this.formAktif == false){
            this.confirmUpdate();
        }else{
            //dapetin nilai validasi dulu
        if(this.dataInputJadwal.length != 0){
            for(let x=0; x<this.dataInputJadwal.length; x++){
               if(this.dataInputJadwal[x].kamar.kode.kode == null || this.dataInputJadwal[x].qtyPasienMax == null ||
                   this.dataInputJadwal[x].statusAbsen.kode == null ){
                   penandaValidasi = false;
               }
           }
       }
      
       
       if(this.dataInputJadwal.length == 0){
           this.alertService.warn('Perhatian','Tidak Ada Data Untuk DiSimpan');
       }else if(penandaValidasi == false){
           this.alertService.warn('Peringatan','Data Tidak Lengkap');
       }else if(this.penandaGaBoleh == true){
        this.alertService.warn('Perhatian','Range Jam Sudah Tersedia, Di Hari dan Kamar Yang Sama');
       }
       else if(penandaValidasi == true && this.penandaGaBoleh == false){
           for(let z=0; z<this.dataInputJadwal.length; z++){
               let data = {
                   "jamAkhir": this.dataInputJadwal[z].jamAkhir,
                   "jamAwal": this.dataInputJadwal[z].jamAwal,
                   "kdHari": this.dataInputJadwal[z].hari.kode.kode,
                   "kdKamar": this.dataInputJadwal[z].kamar.kode.kode,
                   // "kdPegawai": this.dataInputJadwal[z].dokter.kdPegawai,
                   "kdPegawai": this.form.get('kdDokter').value,
                   // "kdRuangan": this.dataInputJadwal[z].ruangan.id.kode,
                   "kdRuangan": this.form.get('kdRuangan').value,
                   "kdStatusAbsensi": this.dataInputJadwal[z].statusAbsen.kode,
                   "qtyPasienMax": this.dataInputJadwal[z].qtyPasienMax
               }
               JadwalDokterDetailDto.push(data);
           }
   
            let dataSimpan = { 
               'jadwalKerjaDokterDetailDto' : JadwalDokterDetailDto,
               'tglAkhir':this.setTimeStamp(this.tanggalAkhir),
               'tglAwal': this.setTimeStamp(this.tanggalAwal)
           }
   
           console.log(dataSimpan)
   
           this.httpService.post(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/saveV2', dataSimpan).subscribe(response => {
               this.alertService.success('Berhasil', 'Data Disimpan');
               this.reset();
           });
        }

        }

    
    }

    simpan() {
        let dataJadwal = []
        for (var i = 0; i < this.listJadwalDokter.length; i++) {
            for (var x = 0; x < this.listJadwalDokter[i].listHari.length; x++) {
                this.listJadwalDokter[i].listHari[x] = {
                    "kdNegara": this.listJadwalDokter[i].listHari[x].kdNegara,
                    "kdHari": this.listJadwalDokter[i].listHari[x].kdHari,
                    "namaHari": this.listJadwalDokter[i].listHari[x].namaHari,
                    "jamAwal": this.convertJam(this.listJadwalDokter[i].listHari[x].jamAwal),
                    "jamAkhir": this.convertJam(this.listJadwalDokter[i].listHari[x].jamAkhir),
                }
            }
            let dataTemp = {
                "kdPegawai": this.listJadwalDokter[i].id_kode,
                "listHari": this.listJadwalDokter[i].listHari
            }
            dataJadwal.push(dataTemp)
        }
        let dataSimpan = {
            "kdRuangan": this.form.get('kdRuangan').value,
            "listPegawai": dataJadwal
        }
        console.log('data: ',dataSimpan)
        this.httpService.post(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/save', dataSimpan).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.reset();
        });

    }
    reset() {      
        this.ngOnInit();
    }
    clear() {
        this.ngOnInit();
    }
    clearFilter(da:any,db:any) {
        da.filterValue = '';
        db.filterValue = '';
    }   
    setJamAwal(){
        this.jamAwal = this.convertJam(this.jamAwal);
        if(this.blockJadwal == false){
            this.getJamDefault();
        }       
    }
    setJamAkhir(){
        this.jamAkhir = this.convertJam(this.jamAkhir);
        if(this.blockJadwal == false){
            this.getJamDefault();
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

    getJadwal(){
        if(this.selectedDataDokter.length !== 0){
            this.dataInputJadwal = [];
            this.buttonAktif = false;
        }else{
            this.dataInputJadwal = [];
        //default isian jadwal selama seminggu
        let tampung = [];
        for(let h=1; h<this.listHari.length; h++){
            let dataTemp = {
                'nomor': null,
                'hari':{
                    'namaHari': this.listHari[h].value.namaHari,
                    'kode': {
                        'kode': this.listHari[h].value.kode.kode
                    }
                },
                // 'ruangan':{
                //     'namaRuangan': '-pilih-',
                //     'id':{
                //         'kode':null
                //     }
                // },
                'kamar':{
                    'naNoFasilitasDetail':'-pilih-',
                    'kode':{
                        'kode':null
                    }
                },
                'jamAwal':'00.00',
                'jamAkhir':'00.00',
                'qtyPasienMax':null,
                'statusAbsen':{
                    'namaStatus':'-pilih-',
                    'kode':null
                },
            }
            tampung.push(dataTemp)
            // let dataInputJadwal = [...this.dataInputJadwal];
			// dataInputJadwal.push(dataTemp);
			// this.dataInputJadwal = dataInputJadwal;
        }
        this.dataInputJadwal = tampung;
        this.buttonAktif = false;
        }
        
    }

    tambahJadwalBaru(){
        this.totalHapus = this.totalHapus - this.totalHapus;
        if(this.dataInputJadwal.length == 0){
            let dataTemp = {
                'nomor': null,
                // 'dokter':{
                //     'namaLengkap': '-pilih-',
                //     'kdPegawai': null
                // },
                'hari':{
                    'namaHari': '-pilih-',
                    'kode': {
                        'kode': null
                    }
                },
                // 'ruangan':{
                //     'namaRuangan': '-pilih-',
                //     'id':{
                //         'kode':null
                //     }
                // },
                'kamar':{
                    'naNoFasilitasDetail':'-pilih-',
                    'kode':{
                        'kode':null
                    }
                },
                'jamAwal':null,
                'jamAkhir':null,
                'qtyPasienMax':null,
                'statusAbsen':{
                    'namaStatus':'-pilih-',
                    'kode':null
                },
            }
            let dataInputJadwal = [...this.dataInputJadwal];
			dataInputJadwal.push(dataTemp);
            this.dataInputJadwal = dataInputJadwal;
            this.penandaTambah = true;
        }else{
            
            let last = this.dataInputJadwal.length - 1;
            if(this.dataInputJadwal[last].hari.kode.kode ==  null
                || this.dataInputJadwal[last].kamar.kode.kode ==  null || this.dataInputJadwal[last].jamAwal == null || this.dataInputJadwal[last].jamAkhir == null  
                || this.dataInputJadwal[last].qtyPasienMax == null || this.dataInputJadwal[last].statusAbsen.kode == null ){
                    this.alertService.warn('Peringatan', 'Data Tidak Lengkap');
            }else{
                let dataTemp = {
                    'nomor': null,
                    // 'dokter':{
                    //     'namaLengkap': '-pilih-',
                    //     'kdPegawai': null
                    // },
                    'hari':{
                        'namaHari': '-pilih-',
                        'kode': {
                            'kode': null
                        }
                    },
                    // 'ruangan':{
                    //     'namaRuangan': '-pilih-',
                    //     'id':{
                    //         'kode':null
                    //     }
                    // },
                    'kamar':{
                        'naNoFasilitasDetail':'-pilih-',
                        'kode':{
                            'kode':null
                        }
                    },
                    'jamAwal':null,
                    'jamAkhir':null,
                    'qtyPasienMax':null,
                    'statusAbsen':{
                        'namaStatus':'-pilih-',
                        'kode':null
                    },
                }
                let dataInputJadwal = [...this.dataInputJadwal];
                dataInputJadwal.push(dataTemp);
                this.dataInputJadwal = dataInputJadwal;
                this.penandaTambah = true;
            }
        }


    }

    

    hapusDataJadwal(row){
        let dataInputJadwal = [...this.dataInputJadwal];
        dataInputJadwal.splice(row, 1);
        this.dataInputJadwal = dataInputJadwal;

        //hapus si tampungan juga
        // let tampung = [...this.tampungData];
        // tampung.splice(row,1);
        // this.tampungData = tampung;
        this.totalHapus = this.totalHapus + 1;
        this.indexHapus = this.dataInputJadwal.length;
    }

    onRowSelect(event){
        this.indexHapus = null;
        this.totalHapus = 0;
        this.formAktif = false;
        this.penandaSelect = true;
        let noHistori = event.data.noHistori;
        this.noHis = event.data.noHistori;
        let kdPegawai = event.data.kdPegawai;
        this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/findJadwalDokterByNoHistori?noHistori='+noHistori+"&kdPegawai="+kdPegawai).subscribe(table => {
                
                //ini untuk head isian yang udah pernah disimpan
                this.tanggalAwal = new Date(table.header.tglAwal*1000);
                this.tanggalAkhir = new Date(table.header.tglAkhir*1000);
                this.form.get('kdDepartemen').setValue(table.header.pegawai.kdDepartemen);
                //panggil ruangan dulu
                this.getRuangan(table.header.pegawai.kdDepartemen);
                //baru di setRuangannya
                this.form.get('kdRuangan').setValue(table.header.pegawai.kdRuangan);

                //ruangan dipilih get kamar bawah nilainya
                this.clearJenisPegawai(table.header.pegawai.kdRuangan);

                this.form.get('kdJenisPegawai').setValue(table.header.pegawai.kdJenisPegawai);
                //panggil dokter dulu
                this.getPegawaiBawah(table.header.pegawai.kdJenisPegawai);
                //set dokternya
                this.form.get('kdDokter').setValue(table.header.pegawai.kdpegawai);

                //ini untuk isian detail jadwal yang pernah disimpan
                this.dataInputJadwal = [];
                let tampung = [];
                for(let h=0; h<table.detail.length; h++){
                    let dataTemp = {
                        'nomor': null,
                        'hari':{
                            'namaHari': table.detail[h].namaHari,
                            'kode': {
                                'kode': table.detail[h].kdHari
                            }
                        },
                        'kamar':{
                            'naNoFasilitasDetail':table.detail[h].namaKamar,
                            'kode':{
                                'kode':table.detail[h].kdKamar
                            }
                        },
                        'jamAwal':table.detail[h].jamAwal,
                        'jamAkhir':table.detail[h].jamAkhir,
                        'qtyPasienMax':table.detail[h].qtyPasienMax,
                        'statusAbsen':{
                            'namaStatus':table.detail[h].namaStatus,
                            'kode':table.detail[h].kdStatusAbsensi
                        },
                    }
                    tampung.push(dataTemp)
                }
                this.dataInputJadwal = tampung;

        });
            this.buttonAktif = false;
            this.disableInput = true;
            this.indexRowPilih = this.dataInputJadwal.length;
    }

    loadPage(event){
        this.getGrid((event.rows + event.first) / event.rows, event.rows,this.pencarian,this.setTimeStamp(this.tanggalfilter));
        // this.getGrid((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        // this.page = (event.rows + event.first) / event.rows;
        // this.rows = event.rows;
    }

    cari(){
        this.getGrid(this.page,this.rows,this.pencarian,this.setTimeStamp(this.tanggalfilter));
        // this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/getJadwalDokter?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=pegawai.namaLengkap&sort=desc&nama=' + this.pencarian ).subscribe(table => {
        //     this.listDataJadwalDokter = table.jadwalDokter;
        // });
    }

    filterTgl(tgl){
        this.getGrid(this.page,this.rows,this.pencarian,this.setTimeStamp(tgl));
        // let tglfix = this.setTimeStamp(tgl);
        // this.httpService.get(Configuration.get().dataMasterNew + '/pegawai-jadwal-kerja-dokter/getJadwalDokter?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=pegawai.namaLengkap&sort=desc&nama=' + this.pencarian + '&tgl=' + tglfix ).subscribe(table => {
        //     this.listDataJadwalDokter = table.jadwalDokter;
        // });
    }

    cekJamKamarHari(dataChange,dataPilih,index){

        let indexFinal = 0;

        // if(this.penandaTambah == true){
        //     indexFinal = index;
        // }else if(this.penandaTambah == false){
            if(this.indexHapus != null){
                if(index == 0){
                    index = this.totalHapus;
                }
                indexFinal = index - this.totalHapus;
            }else if(this.indexHapus == null){
                indexFinal = index;
            }
        // }

        

        console.log(indexFinal);

        let jam,jm;
        //kesini dari trigger jam awal yang lostfocus
        if(dataChange == 'jamAwal'){
            jam = moment(dataPilih.jamAwal,'HH:mm');
            // let tes = Date.parse(jam);
            // console.log(tes);
            // jm = jam.hours();
            jm = Date.parse(jam);
            
        }

        //kesini dari trigger jam akhir yang lostfocus
        if(dataChange == 'jamAkhir'){
            jam = moment(dataPilih.jamAkhir,'HH:mm');
            // jm = jam.hours();
            jm = Date.parse(jam);

        }

        //cari index dulu
        //variabel yang didapet diproses disini
        this.penandaGaBoleh = false;
        if(this.dataInputJadwal.length !== 0){
            for(let x=0; x < this.dataInputJadwal.length; x++){
        
                if(this.dataInputJadwal.length > 1 ){
                    let jamAwalGrid:any;
                    let jamAkhirGrid:any;
                    //ini data dri grid
                    jamAwalGrid = moment(this.dataInputJadwal[x].jamAwal,'HH:mm');
                    jamAkhirGrid = moment(this.dataInputJadwal[x].jamAkhir,'HH:mm');
                    // let jmAwalG = jamAwalGrid.hours();
                    // let jmAkhirG = jamAkhirGrid.hours();
                    let jmAwalG = Date.parse(jamAwalGrid);
                    let jmAkhirG = Date.parse(jamAkhirGrid);
                    //jikat dapet NAN
                    let jA;
                    if(Number.isNaN(jmAwalG) == true){
                        jA = 0;
                    }else{
                        jA = jmAwalG;
                    }

                    let jK;
                    if(Number.isNaN(jmAkhirG) == true){
                        jK = 0;
                    }else{
                        jK = jmAkhirG;
                    }

                   
                    // jm >= jA && jm <= jK && 
                if(indexFinal !== x){
                    if(dataPilih.hari.kode.kode == this.dataInputJadwal[x].hari.kode.kode 
                        && dataPilih.kamar.kode.kode == this.dataInputJadwal[x].kamar.kode.kode 
                        && jm >= jA && jm <= jK ){
                                //console.log('ga boleh');
                                this.penandaGaBoleh = true;
                                break;
                        }
                }
                

                }
                
            }
            //final proses
            if(this.penandaGaBoleh == true){
                this.alertService.warn('Perhatian','Range Jam Sudah Tersedia, Di Hari dan Kamar Yang Sama');
             }
        }
       
       
    }
    
}