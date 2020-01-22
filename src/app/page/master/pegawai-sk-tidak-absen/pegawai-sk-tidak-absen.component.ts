import { Inject, forwardRef, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { PegawaiSkTidakAbsen } from './pegawai-sk-tidak-absen.component.interface';

import { SelectItem } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, AuthGuard, ReportService  } from '../../../global';
import { Router} from "@angular/router";

@Component({
  selector: 'app-pegawai-sk-tidak-absen',
  templateUrl: './pegawai-sk-tidak-absen.component.html',
  styleUrls: ['./pegawai-sk-tidak-absen.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkTidakAbsenComponent implements OnInit {
  listData: any[];
  selected: PegawaiSkTidakAbsen;
  form: FormGroup;
  kodeDeskripsi: PegawaiSkTidakAbsen[];

  totalRecords: number;
  page: number;
  rows: number;
  report: any;
  toReport: any;
  formAktif: boolean;
  items: any;
  pencarian: string;
  versi: any;
  myForm: FormGroup;
  version: any;
  cekLampiranDokumen: boolean = false;
  hasilCek: boolean = false;
  blockedPanel: boolean = false;
  selectedAll: any;
  kdDeskripsi: any;
  pilihan: any = [];
  pilihSemua: boolean;
  listUnitKerja: any[];
  selectedUnitkerja: any[];
  namaSK: any[];
  unitKerjaCari: any[];
  selectedRuangan:any[];
  laporan: boolean = false;
	kdprof: any;
  kddept: any;
  codes:any[];
  smbrFile:any;
  
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef,
    private route: Router,
    private authGuard: AuthGuard,
    @Inject(forwardRef(() => ReportService)) private print: ReportService) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  ngAfterViewInit() {
    this.hasilCek = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdDeskripsi);
   

  }

  

  ngOnInit() {
    

    this.kdprof = this.authGuard.getUserDto().kdProfile;
    this.kddept = this.authGuard.getUserDto().kdDepartemen;
    this.items = [
      {
        label: 'Pdf', icon: 'fa-file-pdf-o', command: () => {
          this.downloadPdf();
        }
      },
      {
        label: 'Excel', icon: 'fa-file-excel-o ', command: () => {
          this.downloadExcel();
        }
      },

    ];
    this.pencarian = "";
    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'statusEnabled': new FormControl(true, Validators.required),
      'noSK': new FormControl(null, Validators.required),
      'namaSuratKeputusan': new FormControl(''),
      'tglBerlakuAwal': new FormControl({ value: '', disabled: true }),
      'tglBerlakuAkhir': new FormControl({ value: '', disabled: true }),
      'kdUnitKerja': new FormControl({ value: '', disabled: true }, Validators.required),
    });




    this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/getSK').subscribe(res => {
      this.namaSK = [];
      this.namaSK.push({ label: '--Pilih Nama SK--', value: '' })
      for (var i = 0; i < res.SK.length; i++) {
        this.namaSK.push({ label: res.SK[i].namaSK, value: res.SK[i].noSK })
      };
    });

    this.getSmbrFile();

  }

  getSmbrFile(){
		this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
			this.smbrFile = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';         
		});
  }
  
  getKelompokTransaksi(){
		this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/getKelompokTransaksi').subscribe(table => {
			let dataKelompokTransaksi = table.KelompokTransaksi;
			 localStorage.setItem('kelompokTransaksi',JSON.stringify(dataKelompokTransaksi));	
			 this.route.navigate(['/master-sk/surat-keputusan']);
        });
	}

  get(page: number, rows: number, search: any) {

    this.httpService.get(Configuration.get().dataMaster + '/service/list-generic/?table=Ruangan&select=namaRuangan,id.kode&criteria=kdRuanganHead&values=' + this.authGuard.getUserDto().kdLokasi).subscribe(res => {
      this.listUnitKerja = [];
      // this.listKategoryPegawai.push({ label: '--Pilih Kategory Pegawai--', value: '' });
      for (var i = 0; i < res.data.data.length; i++) {
        this.listUnitKerja.push({ label: res.data.data[i].namaRuangan, value: res.data.data[i].id_kode })
      };
      this.listUnitKerja = this.listUnitKerja;

    },
      error => {
        this.listUnitKerja = [];
        this.listUnitKerja.push({ label: '-- ' + error + ' --', value: '' })
      });
  }

  clearPanelBawah(kdDeskripsi) {

    if (kdDeskripsi == '' || kdDeskripsi == null) {
      this.hasilCek = true;
      this.pilihan = [];

    } else {
      this.hasilCek = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapdeskripsitospesifikasi/findByKode/' + kdDeskripsi).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapDeskripsiToSpesifikasi.length; i++) {
          this.pilihan.push(String(res.MapDeskripsiToSpesifikasi[i].kdSpesifikasi))
        }
        // console.log(JSON.stringify(this.pilihan))
      });

    }
  }

  selectAll() {
    if (this.pilihSemua == true) {
      this.pilihan = []
      let dataTemp = []
      this.listData.forEach(function (data) {
        dataTemp.push(String(data.kdpegawai));
      })
      this.pilihan = dataTemp;
      // console.log(JSON.stringify(this.pilihan))
    } else {
      this.pilihan = []
    }
    // console.log(JSON.stringify(this.pilihan))
    // console.log(JSON.stringify(this.listData))
  }

  onChange() {
    console.log(JSON.stringify(this.pilihan))
  }


  // onChange(label: string, isChecked: boolean, value: number) {
  //   const pangkatFormArray = <FormArray>this.myForm.controls.mapJabatanToPangkat;

  //   if (isChecked) {
  //     pangkatFormArray.push(new FormControl({
  //       "kdPangkat": label, "kdJabatan": this.form.get('kdJabatan').value,
  //       "statusEnabled": this.form.get('statusEnabled').value
  //     }));
  //   } else {
  //     let index = pangkatFormArray.controls.findIndex(x => x.value == value)
  //     pangkatFormArray.removeAt(index);
  //   }
  // }
  // toggleSelect = function (event, label: string) {

  //   this.pilihSemua = event.target.checked;

  //   this.kodePangkat.forEach(function (item) {
  //     item.selected = event.target.checked;


  //   });

  // }
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

  onSubmit() {
    // if (this.form.invalid) {
    //   this.validateAllFormFields(this.form);
    //   this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    // } else {
    this.simpan();
    // }
  }


  simpan() {
    console.log(this.pilihan);
    let mapDeskripsiToSpesifikasi = []
    let pegawai = [];
    for (let i = 0; i < this.pilihan.length; i++) {
      pegawai.push({
        "kode": this.pilihan[i]
      })
    }
    let dataSimpan = {
      "noSK": this.form.get('noSK').value,
      "pegawai": pegawai,
      "ruangan":this.unitKerjaCari,
      "statusEnabled": true
    }
    console.log(dataSimpan);

    this.httpService.post(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/save', dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  changeRuangan(Ruangan) {
    let unitKerja = [];
    for (var i = 0; i < Ruangan.length; i++) {
      unitKerja.push({
        "kode": Ruangan[i].value
      })
    }

    this.unitKerjaCari = unitKerja;
    let cari = {
      "noSK": this.form.get('noSK').value,
      "nama": this.pencarian,
      "ruangan": unitKerja
    };
    if (unitKerja == null){
      this.pilihan = [];
    } else {
    this.httpService.post(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/findPegawaiByUnitKerja', cari).subscribe(response => {
      this.listData = response.data;
      this.pilihan = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].statusEnabled == true) {
          this.pilihan.push(String(response.data[i].kdpegawai))
        }
      }
    },

  
      error => {
        this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Berhasil Dicari');

      });
    }
    

  }

  ambilSK(sk) {
    if (this.form.get('namaSuratKeputusan').value == null || this.form.get('namaSuratKeputusan').value == undefined) {
    } else {
      this.httpService.get(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/getSK?noSK=' + sk.value).subscribe(table => {
        let detailSK = table.SK;
        console.log(detailSK);
        this.form.get('noSK').setValue(detailSK[0].noSK);
        this.form.get('tglBerlakuAwal').setValue(new Date(detailSK[0].tglBerlakuAwal * 1000));

        if (detailSK[0].tglBerlakuAkhir == 0 || detailSK[0].tglBerlakuAkhir == null) {
          console.log('sini');
        }else{
          this.form.get('tglBerlakuAkhir').setValue(new Date(detailSK[0].tglBerlakuAkhir * 1000));
          console.log('sana');
        }
        if (this.form.get('noSK').value != null || this.form.get('noSK').value != "" || this.form.get('noSK').value != undefined) {
          this.form.get('kdUnitKerja').enable();
        } else {
          this.form.get('kdUnitKerja').disable();
        }
      });
    }
  }

  cari() {
    let cari = {
      "noSK": this.form.get('noSK').value,
      "nama": this.pencarian,
      "ruangan": this.unitKerjaCari
    };
    this.httpService.post(Configuration.get().dataMasterNew + '/pegawaisktidakabsen/findPegawaiByUnitKerja', cari).subscribe(response => {
      this.listData = response.data;
      this.pilihan = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].statusEnabled == true) {
          this.pilihan.push(String(response.data[i].kdpegawai))
        }
      }
    },
      error => {
        this.alertService.error('Kesalahan', error + '\n' + 'Periksa koneksi Ke Server');
      },
      () => {
        this.alertService.success('Berhasil', 'Berhasil Dicari');

      });
  }

  reset() {
    this.form.get('kdUnitKerja').disable();
    this.ngOnInit();
    this.changeRuangan(event);
  }

  downloadExcel() {

  }

  downloadPdf() {
      let cetak = Configuration.get().report + '/pegawaiSKTidakAbsen/laporanPegawaiSKTidakAbsen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=true';
      window.open(cetak);
  }

  cetak(){
      this.laporan = true;
      this.print.showEmbedPDFReport(Configuration.get().report + '/pegawaiSKTidakAbsen/laporanPegawaiSKTidakAbsen.pdf?kdDepartemen='+this.kddept+'&kdProfile='+this.kdprof+'&gambarLogo=' + this.smbrFile +'&download=false', 'frmPegawaiSkTidakAbsen_laporanCetak');

  }
  tutupLaporan() {
      this.laporan = false;
  }



}



