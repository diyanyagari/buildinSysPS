import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    HttpClient
} from '../../../global/service/HttpClient';
import {
    Observable
} from 'rxjs/Rx';
import {
    MapObjekModulToKelompokUser,
    SelectedItem
} from './map-objek-modul-to-kelompok-user.interface';
import {
    Validators,
    FormControl,
    FormGroup,
    FormBuilder
} from '@angular/forms';
import {
    LazyLoadEvent,
    ConfirmDialogModule,
    ConfirmationService,
    TreeTableModule,
    TreeNode
} from 'primeng/primeng';
import {
    AlertService,
    InfoService,
    Configuration
} from '../../../global';

@Component({
    selector: 'app-map-objek-modul-to-kelompok-user',
    templateUrl: './map-objek-modul-to-kelompok-user.component.html',
    styleUrls: ['./map-objek-modul-to-kelompok-user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService]
})
export class MapObjekModulToKelompokUserComponent implements OnInit {

    listData: any[];
    listDataHakAkses: any[];
    selectedFiles: TreeNode[];
    label: string;
    listObjek: any[];
    listKelompok: any[];
    form: FormGroup;
    items: any;
    page: number;
    rows: number;
    totalRecordsKlp: number;
    totalRecordsObjek: number;
    formAktif: boolean;
    pilihan: any = [];
    pilihanCetak: any = [];
    pilihanTampil: any = [];
    pilihanHapus: any = [];
    pilihanSimpan: any = [];
    pilihanUbah: any = [];
    pilihSemua: boolean;
    selectedAll: any;
    kdKelompokUser: any;
    cetak: any;
    tampil: any;
    ubah: any;
    simpan: any;
    hapus: any;
    kode: any;
    selectedKelompokUser: any;
    selectedObjekModul: any;
    dataTempObj: any;
    dataTempKlp: any;
    dataObjek: any[]

    versi: number;

    listDataTesting: any[]

    isExpand: boolean

    listDropdownModulAplikasi: any[];
    listDropdownVersion: any[];

    selectedVersion: any;
	openDropdownKey: boolean;
	selectedFilesVersion: TreeNode[];
    selectKdVersion: any;
    listVersion:any[];



    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {


    }


    ngOnInit() {
        this.openDropdownKey = false;
		this.listVersion = [];
		this.selectedVersion = null;
        this.selectKdVersion = '';
        
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }

        this.formAktif = true;
        this.get(this.page, this.rows);
        this.form = this.fb.group({
            'kdModulAplikasi': new FormControl(null, Validators.required),
            //'kdVersion': new FormControl(null, Validators.required),
            // 'kdObjekModulAplikasi': new FormControl('', Validators.required),
            // 'kdKelompokUser': new FormControl('', Validators.required),
            // 'tampil': new FormControl(''),
            // 'cetak': new FormControl(''),
            // 'hapus': new FormControl(''),
            // 'simpan': new FormControl(''),
            // 'ubah': new FormControl(''),
            // 'pilihSemua': new FormControl(''),
            // 'namaExternal': new FormControl(''),
            // 'kodeExternal': new FormControl(''),
        });
        this.versi = 1;


        // this.listDataTesting = [
        // {
        //     //parent
        //     "kdModulAplikasi": "E2",
        //     "ubah": 1,
        //     "namaObjekModulAplikasi": "Dashboard",
        //     "kdObjekModulAplikasi": "000001",
        //     "bcetak": true,
        //     "cek": true,
        //     "btampil": true,
        //     "bubah": true,
        //     "tampil": 1,
        //     "statusEnabled": true,
        //     "bhapus": true,
        //     "hapus": 1,
        //     "bsimpan": true,
        //     "nama": "Human Resources",
        //     "kode": "000001",
        //     "simpan": 1,
        //     "cetak": 1,
        //     "kdKelompokUser": 10,
        //     "isParent": true,
        //     "children": [
        //     {
        //         //anak
        //         "kdModulAplikasi": "E2",
        //         "ubah": 1,
        //         "namaObjekModulAplikasi": "Struktur Organisasi",
        //         "kdObjekModulAplikasi": "000002",
        //         "bcetak": true,
        //         "cek": true,
        //         "btampil": true,
        //         "bubah": true,
        //         "tampil": 1,
        //         "statusEnabled": true,
        //         "bhapus": true,
        //         "hapus": 1,
        //         "bsimpan": true,
        //         "nama": "Human Resources",
        //         "kode": "000002",
        //         "simpan": 1,
        //         "cetak": 1,
        //         "kdKelompokUser": 10,
        //         "isParent": true,
        //         "children": [
        //         {
        //             //cucu
        //             "kdModulAplikasi": "E2",
        //             "ubah": 0,
        //             "namaObjekModulAplikasi": "Karyawan",
        //             "kdObjekModulAplikasi": "000003",
        //             "bcetak": false,
        //             "cek": false,
        //             "btampil": false,
        //             "bubah": false,
        //             "tampil": 0,
        //             "statusEnabled": true,
        //             "bhapus": false,
        //             "hapus": 0,
        //             "bsimpan": false,
        //             "nama": "Human Resources",
        //             "kode": "000003",
        //             "simpan": 0,
        //             "cetak": 0,
        //             "kdKelompokUser": 10,
        //             "isParent": true,
        //             "children": [
        //             {
        //                 //empat
        //                 "kdModulAplikasi": "E2",
        //                 "ubah": 0,
        //                 "namaObjekModulAplikasi": "Pemberian Fasilitas Kerja",
        //                 "kdObjekModulAplikasi": "000005",
        //                 "bcetak": false,
        //                 "cek": false,
        //                 "btampil": false,
        //                 "bubah": false,
        //                 "tampil": 0,
        //                 "statusEnabled": true,
        //                 "bhapus": false,
        //                 "hapus": 0,
        //                 "bsimpan": false,
        //                 "nama": "Human Resources",
        //                 "kode": "000005",
        //                 "simpan": 0,
        //                 "cetak": 0,
        //                 "kdKelompokUser": 10,
        //                 "isParent": true,
        //                 "children": [
        //                 {
        //                     //lima
        //                     "kdModulAplikasi": "E2",
        //                     "ubah": 0,
        //                     "namaObjekModulAplikasi": "Penghargaan Pegawai",
        //                     "kdObjekModulAplikasi": "000010",
        //                     "bcetak": false,
        //                     "cek": false,
        //                     "btampil": false,
        //                     "bubah": false,
        //                     "tampil": 0,
        //                     "statusEnabled": true,
        //                     "bhapus": false,
        //                     "hapus": 0,
        //                     "bsimpan": false,
        //                     "nama": "Human Resources",
        //                     "kode": "000010",
        //                     "simpan": 0,
        //                     "cetak": 0,
        //                     "kdKelompokUser": 10,
        //                     "isParent": false,
        //                     "children": []
        //                 },
        //                 {
        //                     "kdModulAplikasi": "E2",
        //                     "ubah": 0,
        //                     "namaObjekModulAplikasi": "Daftar Terima Pengajuan Pelanggaran",
        //                     "kdObjekModulAplikasi": "000017",
        //                     "bcetak": false,
        //                     "cek": false,
        //                     "btampil": false,
        //                     "bubah": false,
        //                     "tampil": 0,
        //                     "statusEnabled": true,
        //                     "bhapus": false,
        //                     "hapus": 0,
        //                     "bsimpan": false,
        //                     "nama": "Human Resources",
        //                     "kode": "000017",
        //                     "simpan": 0,
        //                     "cetak": 0,
        //                     "kdKelompokUser": 10,
        //                     "isParent": false,
        //                     "children": []
        //                 },
        //                 ]
        //             },
        //             ]
        //         },
        //         ]
        //     },

        this.listDataTesting = []
        this.isExpand = true
        this.getDropdown();
    }

    get(page: number, rows: number) {

        //listkelompokuser
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompokuser/findAll?page=' + page + '&rows=' + rows).subscribe(res => {

            let dataUser = [];
            for (var i = 0; i < res.KelompokUser.length; i++) {
                if (res.KelompokUser[i].kode.kode == 1) {
                    continue;
                }
                let data = {
                    "nomorUrut": i + 1,
                    "namaKelompokUser": res.KelompokUser[i].namaKelompokUser,
                    "kdKelompokUser": res.KelompokUser[i].kode.kode,
                }
                dataUser.push(data);
            };

            this.listKelompok = dataUser;
            this.totalRecordsKlp = res.totalRow;

        });

        this.listData = [];
        this.listDataTesting = []


        
    }

    getDropdown(){
        //ambil dropdown isian
        // this.listDropdownVersion = [];

        // this.httpService.get(Configuration.get().dataMasterNew + '/version/findAll?page=1&rows=1000&dir=namaVersion&sort=desc').subscribe(res => {
		// 	this.listDropdownVersion = [];
		// 	this.listDropdownVersion.push({ label: '--Pilih--', value: null })
		// 	for (let i = 0; i < res.Version.length; i++) {
		// 		this.listDropdownVersion.push({ label: res.Version[i].namaVersion, value: res.Version[i].kode })
		// 	};
        // });
        
        this.httpService.get(Configuration.get().dataMasterNew + '/version/getVersion').subscribe(res => {
			this.listVersion = [];
			for(let i = 0; i < res.length; i++){
				this.listVersion[i] = {
					"label": res[i].namaVersion,
					"kode": res[i].kode,
					"children":[]
				}
				let child = [];
				for(let j = 0; j < res[i].child.length; j++){
					child[j] = {
						"label": res[i].child[j].namaVersion,
            			"kode": res[i].child[j].kode,
					}
					this.listVersion[i].children.push(child[j]);
				}
			}
			
		});
       

        this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultomodulaplikasi/findAllListMA').subscribe(res => {
			this.listDropdownModulAplikasi = [];
			this.listDropdownModulAplikasi.push({ label: '--Pilih Modul Aplikasi--', value: null })
			for (let i = 0; i < res.ModulAplikasi.length; i++) {
				this.listDropdownModulAplikasi.push({ label: res.ModulAplikasi[i].namaModulAplikasi, value: res.ModulAplikasi[i].kode })
			};
		});
    }

    pilihObjekModul(event) {

        let kdModulAplikasi = this.form.get('kdModulAplikasi').value;
        // let kdVersion = this.form.get('kdVersion').value;
        let kdVersion = this.selectKdVersion;
        //this.clear();
        this.kdKelompokUser = event.data.kdKelompokUser;
        

        //panggilsemua
        // this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/findMapObjMod/'+this.kdKelompokUser).subscribe(res => {
        //     this.listData = res.data;             
        // });


        // this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/findMapObjModTree/' + this.kdKelompokUser).subscribe(res => {
        //     this.listDataTesting = res.data;
        // });
        if(kdModulAplikasi == null || kdVersion == ''){
            this.alertService.warn('Perhatian', 'Harap Pilih Modul Aplikasi dan Version Terlebih Dahulu')
        }else{
            this.httpService.get(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/findMapObjModTree/' + this.kdKelompokUser +'/'+ kdModulAplikasi +'/'+ kdVersion).subscribe(res => {
                this.listDataTesting = res.data;
            });
        }
       

        //kdModulAplikasiHead == null artinya bisa jadi isParent, atau engga isParent.... isParent diliat dari children.length !== 0 berarti isParent true
    }


    //funcprimitifku
    changeCheckbox2(event, ri, ii) {
        let d;
        if (event) {
            d = 1;
        } else {
            d = 0;
        }

        if (ii === 0) {
            this.listDataTesting[ri].cetak = d;
        } else if (ii === 1) {
            this.listDataTesting[ri].tampil = d;
        } else if (ii === 2) {
            this.listDataTesting[ri].simpan = d;
        } else if (ii === 3) {
            this.listDataTesting[ri].ubah = d;
        } else if (ii === 4) {
            this.listDataTesting[ri].hapus = d;
        }
    }
    //funcprimitifku
    changeCheckboxAnak(event, ri, ii, riAnak) {
        let d;
        if (event) {
            d = 1;
        } else {
            d = 0;
        }

        if (ii === 0) {
            this.listDataTesting[ri].children[riAnak].cetak = d;
        } else if (ii === 1) {
            this.listDataTesting[ri].children[riAnak].tampil = d;
        } else if (ii === 2) {
            this.listDataTesting[ri].children[riAnak].simpan = d;
        } else if (ii === 3) {
            this.listDataTesting[ri].children[riAnak].ubah = d;
        } else if (ii === 4) {
            this.listDataTesting[ri].children[riAnak].hapus = d;
        }
    }
    //funcprimitifku
    changeCheckboxCucu(event, ri, ii, riAnak, riCucu) {
        let d;
        if (event) {
            d = 1;
        } else {
            d = 0;
        }

        if (ii === 0) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].cetak = d;
        } else if (ii === 1) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].tampil = d;
        } else if (ii === 2) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].simpan = d;
        } else if (ii === 3) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].ubah = d;
        } else if (ii === 4) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].hapus = d;
        }
    }

    //funcprimitifku
    changeCheckboxEmpat(event, ri, ii, riAnak, riCucu, riEmpat) {
        let d;
        if (event) {
            d = 1;
        } else {
            d = 0;
        }

        if (ii === 0) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].cetak = d;
        } else if (ii === 1) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].tampil = d;
        } else if (ii === 2) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].simpan = d;
        } else if (ii === 3) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].ubah = d;
        } else if (ii === 4) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].hapus = d;
        }
    }

    //funcprimitifku
    changeCheckboxLima(event, ri, ii, riAnak, riCucu, riEmpat, riLima) {
        let d;
        if (event) {
            d = 1;
        } else {
            d = 0;
        }

        if (ii === 0) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].cetak = d;
        } else if (ii === 1) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].tampil = d;
        } else if (ii === 2) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].simpan = d;
        } else if (ii === 3) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].ubah = d;
        } else if (ii === 4) {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].hapus = d;
        }
    }
    //funcprimitifku
    changeAll2(event, ri) {
        if (event == true) {

            this.listDataTesting[ri].simpan = 1;
            this.listDataTesting[ri].cetak = 1;
            this.listDataTesting[ri].hapus = 1;
            this.listDataTesting[ri].ubah = 1;
            this.listDataTesting[ri].tampil = 1;

            this.listDataTesting[ri].bsimpan = true;
            this.listDataTesting[ri].bcetak = true;
            this.listDataTesting[ri].bhapus = true;
            this.listDataTesting[ri].bubah = true;
            this.listDataTesting[ri].btampil = true;

        } else {
            this.listDataTesting[ri].simpan = 0;
            this.listDataTesting[ri].cetak = 0;
            this.listDataTesting[ri].hapus = 0;
            this.listDataTesting[ri].ubah = 0;
            this.listDataTesting[ri].tampil = 0;

            this.listDataTesting[ri].bsimpan = false;
            this.listDataTesting[ri].bcetak = false;
            this.listDataTesting[ri].bhapus = false;
            this.listDataTesting[ri].bubah = false;
            this.listDataTesting[ri].btampil = false;

        }
    }
    //funcprimitifku
    changeAllAnak(event, ri, riAnak) {
        if (event == true) {

            this.listDataTesting[ri].children[riAnak].simpan = 1;
            this.listDataTesting[ri].children[riAnak].cetak = 1;
            this.listDataTesting[ri].children[riAnak].hapus = 1;
            this.listDataTesting[ri].children[riAnak].ubah = 1;
            this.listDataTesting[ri].children[riAnak].tampil = 1;

            this.listDataTesting[ri].children[riAnak].bsimpan = true;
            this.listDataTesting[ri].children[riAnak].bcetak = true;
            this.listDataTesting[ri].children[riAnak].bhapus = true;
            this.listDataTesting[ri].children[riAnak].bubah = true;
            this.listDataTesting[ri].children[riAnak].btampil = true;

        } else {
            this.listDataTesting[ri].children[riAnak].simpan = 0;
            this.listDataTesting[ri].children[riAnak].cetak = 0;
            this.listDataTesting[ri].children[riAnak].hapus = 0;
            this.listDataTesting[ri].children[riAnak].ubah = 0;
            this.listDataTesting[ri].children[riAnak].tampil = 0;

            this.listDataTesting[ri].children[riAnak].bsimpan = false;
            this.listDataTesting[ri].children[riAnak].bcetak = false;
            this.listDataTesting[ri].children[riAnak].bhapus = false;
            this.listDataTesting[ri].children[riAnak].bubah = false;
            this.listDataTesting[ri].children[riAnak].btampil = false;

        }
    }

    //funcprimitifku
    changeAllCucu(event, ri, riAnak, riCucu) {
        if (event == true) {

            this.listDataTesting[ri].children[riAnak].children[riCucu].simpan = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].cetak = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].hapus = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].ubah = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].tampil = 1;

            this.listDataTesting[ri].children[riAnak].children[riCucu].bsimpan = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].bcetak = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].bhapus = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].bubah = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].btampil = true;

        } else {
            this.listDataTesting[ri].children[riAnak].children[riCucu].simpan = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].cetak = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].hapus = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].ubah = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].tampil = 0;

            this.listDataTesting[ri].children[riAnak].children[riCucu].bsimpan = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].bcetak = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].bhapus = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].bubah = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].btampil = false;

        }
    }

    //funcprimitifku
    changeAllEmpat(event, ri, riAnak, riCucu, riEmpat) {
        if (event == true) {

            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].simpan = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].cetak = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].hapus = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].ubah = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].tampil = 1;

            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bsimpan = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bcetak = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bhapus = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bubah = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].btampil = true;

        } else {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].simpan = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].cetak = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].hapus = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].ubah = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].tampil = 0;

            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bsimpan = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bcetak = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bhapus = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].bubah = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].btampil = false;

        }
    }

    //funcprimitifku
    changeAllLima(event, ri, riAnak, riCucu, riEmpat, riLima) {
        if (event == true) {

            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].simpan = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].cetak = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].hapus = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].ubah = 1;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].tampil = 1;

            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bsimpan = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bcetak = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bhapus = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bubah = true;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].btampil = true;

        } else {
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].simpan = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].cetak = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].hapus = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].ubah = 0;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].tampil = 0;

            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bsimpan = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bcetak = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bhapus = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].bubah = false;
            this.listDataTesting[ri].children[riAnak].children[riCucu].children[riEmpat].children[riLima].btampil = false;

        }
    }

    changeAll(event, ri) {

        if (event == true) {

            this.listData[ri].simpan = 1;
            this.listData[ri].cetak = 1;
            this.listData[ri].hapus = 1;
            this.listData[ri].ubah = 1;
            this.listData[ri].tampil = 1;

            this.listData[ri].bsimpan = true;
            this.listData[ri].bcetak = true;
            this.listData[ri].bhapus = true;
            this.listData[ri].bubah = true;
            this.listData[ri].btampil = true;

        } else {
            this.listData[ri].simpan = 0;
            this.listData[ri].cetak = 0;
            this.listData[ri].hapus = 0;
            this.listData[ri].ubah = 0;
            this.listData[ri].tampil = 0;

            this.listData[ri].bsimpan = false;
            this.listData[ri].bcetak = false;
            this.listData[ri].bhapus = false;
            this.listData[ri].bubah = false;
            this.listData[ri].btampil = false;

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

    loadPage(event: LazyLoadEvent) {
        this.get((event.rows + event.first) / event.rows, event.rows);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    onSubmit() {
        if (this.form.invalid) {
            this.validateAllFormFields(this.form);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai")
        } else {
            this.simpanMap();
        }
    }

    simpanMap() {


        let dataSimpanMap = {
            "mapObjekModulToKelompokUser": this.listData
        }
        this.httpService.update(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/update', dataSimpanMap).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.reset();
        });

    }

    //funcprimitifku
    simpanMap2() {

        if(this.selectKdVersion == ''){
			this.alertService.warn('Perhatian','Harap Pilih Version Terlebih Dahulu');
		}else{

        let entry = []
        let enParent;
        let enAnak
        let enCucu
        let enEmpat
        let enLima
        for (let i = 0; i < this.listDataTesting.length; i++) {
            enParent = {
                "cetak": this.listDataTesting[i].cetak,
                "hapus": this.listDataTesting[i].hapus,
                "kdKelompokUser": this.listDataTesting[i].kdKelompokUser,
                "kdObjekModulAplikasi": this.listDataTesting[i].kdObjekModulAplikasi,
                "kdModulAplikasi": this.listDataTesting[i].kdModulAplikasi,
                "simpan": this.listDataTesting[i].simpan,
                "statusEnabled": this.listDataTesting[i].statusEnabled,
                "tampil": this.listDataTesting[i].tampil,
                "ubah": this.listDataTesting[i].ubah,
                // "kdVersion": this.form.get('kdVersion').value
                "kdVersion": this.selectKdVersion
                
            }
            entry.push(enParent)
            for (let j = 0; j < this.listDataTesting[i].children.length; j++) {
                enAnak = {
                    "cetak": this.listDataTesting[i].children[j].cetak,
                    "hapus": this.listDataTesting[i].children[j].hapus,
                    "kdKelompokUser": this.listDataTesting[i].children[j].kdKelompokUser,
                    "kdObjekModulAplikasi": this.listDataTesting[i].children[j].kdObjekModulAplikasi,
                    "kdModulAplikasi": this.listDataTesting[i].children[j].kdModulAplikasi,
                    "simpan": this.listDataTesting[i].children[j].simpan,
                    "statusEnabled": this.listDataTesting[i].children[j].statusEnabled,
                    "tampil": this.listDataTesting[i].children[j].tampil,
                    "ubah": this.listDataTesting[i].children[j].ubah,
                    "kdVersion": this.selectKdVersion
                }
                entry.push(enAnak)
                for (let k = 0; k < this.listDataTesting[i].children[j].children.length; k++) {
                    enCucu = {
                        "cetak": this.listDataTesting[i].children[j].children[k].cetak,
                        "hapus": this.listDataTesting[i].children[j].children[k].hapus,
                        "kdKelompokUser": this.listDataTesting[i].children[j].children[k].kdKelompokUser,
                        "kdObjekModulAplikasi": this.listDataTesting[i].children[j].children[k].kdObjekModulAplikasi,
                        "kdModulAplikasi": this.listDataTesting[i].children[j].children[k].kdModulAplikasi,
                        "simpan": this.listDataTesting[i].children[j].children[k].simpan,
                        "statusEnabled": this.listDataTesting[i].children[j].children[k].statusEnabled,
                        "tampil": this.listDataTesting[i].children[j].children[k].tampil,
                        "ubah": this.listDataTesting[i].children[j].children[k].ubah,
                        "kdVersion": this.selectKdVersion
                    }
                    entry.push(enCucu)
                    for (let l = 0; l < this.listDataTesting[i].children[j].children[k].length; l++) {
                        enEmpat = {
                            "cetak": this.listDataTesting[i].children[j].children[k].children[l].cetak,
                            "hapus": this.listDataTesting[i].children[j].children[k].children[l].hapus,
                            "kdKelompokUser": this.listDataTesting[i].children[j].children[k].children[l].kdKelompokUser,
                            "kdObjekModulAplikasi": this.listDataTesting[i].children[j].children[k].children[l].kdObjekModulAplikasi,
                            "kdModulAplikasi": this.listDataTesting[i].children[j].children[k].children[l].kdModulAplikasi,
                            "simpan": this.listDataTesting[i].children[j].children[k].children[l].simpan,
                            "statusEnabled": this.listDataTesting[i].children[j].children[k].children[l].statusEnabled,
                            "tampil": this.listDataTesting[i].children[j].children[k].children[l].tampil,
                            "ubah": this.listDataTesting[i].children[j].children[k].children[l].ubah,
                            "kdVersion": this.selectKdVersion
                        }
                        entry.push(enEmpat)
                        for (let m = 0; m < this.listDataTesting[i].children[j].children[k].children[l].children.length; m++) {
                            enLima = {
                                "cetak": this.listDataTesting[i].children[j].children[k].children[l].children[m].cetak,
                                "hapus": this.listDataTesting[i].children[j].children[k].children[l].children[m].hapus,
                                "kdKelompokUser": this.listDataTesting[i].children[j].children[k].children[l].children[m].kdKelompokUser,
                                "kdObjekModulAplikasi": this.listDataTesting[i].children[j].children[k].children[l].children[m].kdObjekModulAplikasi,
                                "kdModulAplikasi": this.listDataTesting[i].children[j].children[k].children[l].children[m].kdModulAplikasi,
                                "simpan": this.listDataTesting[i].children[j].children[k].children[l].children[m].simpan,
                                "statusEnabled": this.listDataTesting[i].children[j].children[k].children[l].children[m].statusEnabled,
                                "tampil": this.listDataTesting[i].children[j].children[k].children[l].children[m].tampil,
                                "ubah": this.listDataTesting[i].children[j].children[k].children[l].children[m].ubah,
                                "kdVersion": this.selectKdVersion
                            }
                            entry.push(enLima)
                        }
                    }
                }
            }

            
        }


        let dataSimpanMap = {
            "mapObjekModulToKelompokUser": entry
        }

        console.log(dataSimpanMap)
        this.httpService.update(Configuration.get().dataMasterNew + '/mapobjekmodultokelompokuser/update', dataSimpanMap).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.reset();
        });

        }
    }

    reset() {
        this.listKelompok = [];
        this.listData = [];
        this.selectedKelompokUser = [];
        this.selectedObjekModul = [];
        this.ngOnInit();
    }

    clear() {
        // this.listData = [];
        // this.selectedObjekModul = [];
        this.ngOnInit();
    }


    selectAll(event) {
        if (event == true) {
            for (let i = 0; i < this.listData.length; i++) {
                this.listData[i].cek == true
            }
        } else {
            for (let i = 0; i < this.listData.length; i++) {
                this.listData[i].cek == false
            }
        }
    }

    onChange() {
        console.log(JSON.stringify(this.pilihan))
    }

    onDestroy() {

    }

    //funcprimitifku
    isParentChecked(event, data, index) {
        //console.log(data)
        //status enabled = true then tampil is 1
        let d = 0;
        if (event) {
            d = 1;
        }
        data.tampil = d;
        if (event == true) {
            // if (data.isParent == true){
            if (data.children.length !== 0) {
                //anak
                for (let i = 0; i < data.children.length; i++) {
                    data.children[i].statusEnabled = true;
                    data.children[i].tampil = 1;

                    // if (data.children[i].isParent == true){
                    if (data.children[i].children.length !== 0) {
                        //cucu
                        for (let j = 0; j < data.children[i].children.length; j++) {
                            data.children[i].children[j].statusEnabled = true;
                            data.children[i].children[j].tampil = 1;
                            // if (data.children[i].children[j].isParent == true){
                            if (data.children[i].children[j].children.length !== 0) {
                                //lv4
                                for (let k = 0; k < data.children[i].children[j].children.length; k++) {
                                    data.children[i].children[j].children[k].statusEnabled = true;
                                    data.children[i].children[j].children[k].tampil = 1;
                                    // if (data.children[i].children[j].children[k].isParent == true){
                                    if (data.children[i].children[j].children[k].children.length !== 0) {
                                        //lv5
                                        for (let l = 0; l < data.children[i].children[j].children[k].children.length; l++) {
                                            data.children[i].children[j].children[k].children[l].statusEnabled = true;
                                            data.children[i].children[j].children[k].children[l].tampil = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // if (data.isParent == true){
            if (data.children.length !== 0) {
                //anak
                for (let i = 0; i < data.children.length; i++) {
                    data.children[i].statusEnabled = false
                    data.children[i].tampil = 0;
                    data.children[i].cetak = 0;
                    data.children[i].hapus = 0;
                    data.children[i].simpan = 0;
                    data.children[i].ubah = 0;
                    // if (data.children[i].isParent == true){
                    if (data.children[i].children.length !== 0) {
                        //cucu
                        for (let j = 0; j < data.children[i].children.length; j++) {
                            data.children[i].children[j].statusEnabled = false
                            data.children[i].children[j].tampil = 0;
                            data.children[i].children[j].cetak = 0;
                            data.children[i].children[j].hapus = 0;
                            data.children[i].children[j].simpan = 0;
                            data.children[i].children[j].ubah = 0;
                            // if (data.children[i].children[j].isParent == true){
                            if (data.children[i].children[j].children.length !== 0) {
                                //lv4
                                for (let k = 0; k < data.children[i].children[j].children.length; k++) {
                                    data.children[i].children[j].children[k].statusEnabled = false
                                    data.children[i].children[j].children[k].tampil = 0;
                                    data.children[i].children[j].children[k].cetak = 0;
                                    data.children[i].children[j].children[k].hapus = 0;
                                    data.children[i].children[j].children[k].simpan = 0;
                                    data.children[i].children[j].children[k].ubah = 0;
                                    // if (data.children[i].children[j].children[k].isParent == true){
                                    if (data.children[i].children[j].children[k].children.length !== 0) {
                                        //lv5
                                        for (let l = 0; l < data.children[i].children[j].children[k].children.length; l++) {
                                            data.children[i].children[j].children[k].children[l].statusEnabled = false;
                                            data.children[i].children[j].children[k].children[l].tampil = 0;
                                            data.children[i].children[j].children[k].children[l].cetak = 0;
                                            data.children[i].children[j].children[k].children[l].hapus = 0;
                                            data.children[i].children[j].children[k].children[l].simpan = 0;
                                            data.children[i].children[j].children[k].children[l].ubah = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    expand(i) {
        var exist = false
        if (this.listDataTesting[i].kdObjekModulAplikasiHead == null) {
            exist = false
        } else if (this.listDataTesting[i].kdObjekModulAplikasiHead !== null) {
            // this.isExpand = true
            exist = true
        } else {
            this.isExpand = true
        }
    }

    toggleCoba(rowData: any, dtEn: any) {
        dtEn.toggleRow(rowData);
    }

    openDropdown(){
		if (this.openDropdownKey) {
			document.getElementById("dropdownTree").style.display = "none";
			this.openDropdownKey = false;
		  } else {
			document.getElementById("dropdownTree").style.display = "block";
			this.openDropdownKey = true;
		  }
    }
    
    nodeSelect(event){

		this.selectedVersion = event.node.label;
        this.selectKdVersion = event.node.kode;
        document.getElementById("dropdownTree").style.display = "none";
        this.openDropdownKey = false;
		
	}

 
}

class InisialMapObjekModulToKelompokUser implements MapObjekModulToKelompokUser {

    constructor(
        public alamatURLFormMapObjelModulAplikasiToKelompokUser ? ,
        public fungsi ? ,
        public kdMapObjelModulAplikasiToKelompokUserHead ? ,
        public keterangan ? ,
        public kode ? ,
        public kodeExternal ? ,
        public namaExternal ? ,
        public namaMapObjelModulAplikasiToKelompokUser ? ,
        public objekModulAplikasiNoUrut ? ,
        public reportDisplay ? ,
        public statusEnabled ? ,
        public version ? ,
        public id ?
    ) {}

}