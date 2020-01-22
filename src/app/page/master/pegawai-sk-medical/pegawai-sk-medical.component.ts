import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkMedical } from './pegawai-sk-medical.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-pegawai-sk-medical',
  templateUrl: './pegawai-sk-medical.component.html',
  styleUrls: ['./pegawai-sk-medical.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkMedicalComponent implements OnInit {

  selected: PegawaiSkMedical;
  listData: PegawaiSkMedical[];
  dataDummy: {};
  kodekategoriPegawai: PegawaiSkMedical[];
  kodeMasaKerja: PegawaiSkMedical[];
  kodeJabatanStruktural: PegawaiSkMedical[];
  kodeProduk: PegawaiSkMedical[];
  kodekondisiProduk: PegawaiSkMedical[];
  versi: any;
  formAktif: boolean;
  pencarian: string;
  form: FormGroup;
  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.formAktif = true;
    this.get();
    this.form = this.fb.group({
      'kode': new FormControl(null),
    'status': new FormControl(null),
      'nama': new FormControl(null),
      'tanggalAwal': new FormControl(null),
      'tanggalAkhir': new FormControl(null),
      'kdKategoriPegawai': new FormControl('', Validators.required),
      'kdMasaKerja': new FormControl('', Validators.required),
      'kdJabatanStruktural': new FormControl('', Validators.required),
      'persenPlafonPerPeriode': new FormControl(null),   
      'maxPlafonPerPeriode': new FormControl(null),  
      'durasiPeriode': new FormControl(null),            
      'proRate': new FormControl(null),            
      'akumulasi': new FormControl(null),            
      'collectivePlafon': new FormControl(null),            
      'kuotaPerHariPeriode': new FormControl(null),            
      'batasHariUntukMengajukanPermohonan': new FormControl(null),            
      'klaimDisatukanDenganGaji': new FormControl(null), 
      'allowPerPlafon': new FormControl(null),            
      'persenOverPlafon': new FormControl(null),            
      'maxOverPlafon': new FormControl(null),    
      'persenOverPlafonInput': new FormControl(null),            
      'maxOverPlafonInput': new FormControl(null),   
      'namaKomponenHarga': new FormControl(null),            
      'factorRateMaxOverPlafon': new FormControl(null),            
      'factorRateMaxPlafon': new FormControl(null),
      
      'namaPaket': new FormControl(null),            
      'hargaTanggunganProfile': new FormControl(null),            
      'persenTanggunganProfile': new FormControl(null),            
      'factorRate': new FormControl(null),            
      'operatorfactorRate': new FormControl(null),            
      'maxPlafonPerPeriode2': new FormControl(null),            
      'persenPlafonYangDigunakanPerProduk': new FormControl(null),            
      'maxQtyPaketPerPeriode': new FormControl(null),            
      
      
      'statusEnabled': new FormControl(true)
    });
  }
  changePerPlafon(event){
		if (event == true) {
			this.form.get('persenOverPlafon').enable();
			this.form.get('maxOverPlafon').enable();
      this.form.get('persenOverPlafonInput').enable();
			this.form.get('maxOverPlafonInput').enable();
			this.form.get('persenOverPlafon').setValidators(Validators.required);
			this.form.get('maxOverPlafon').setValidators(Validators.required);
      this.form.get('persenOverPlafonInput').setValidators(Validators.required);
			this.form.get('maxOverPlafonInput').setValidators(Validators.required);
      
		} else {
			this.form.get('persenOverPlafon').setValue('');
			this.form.get('maxOverPlafon').setValue('');
      this.form.get('persenOverPlafonInput').setValue('');
      this.form.get('maxOverPlafonInput').setValue('');
      
			this.form.get('persenOverPlafon').disable();
			this.form.get('maxOverPlafon').disable();
      this.form.get('persenOverPlafonInput').disable();
			this.form.get('maxOverPlafonInput').disable();
      
			this.form.get('persenOverPlafon').clearValidators();
			this.form.get('maxOverPlafon').clearValidators();
      this.form.get('persenOverPlafonInput').clearValidators();
			this.form.get('maxOverPlafonInput').clearValidators();
      
		}
  }
  changePersen(event){
		if (event == true) {
      this.form.get('maxOverPlafonInput').setValue('');
			this.form.get('maxOverPlafonInput').disable();
			this.form.get('maxOverPlafonInput').clearValidators();
		} else {
			this.form.get('maxOverPlafonInput').enable();
			this.form.get('maxOverPlafonInput').setValidators(Validators.required);
		}
  }
  
  changeKomponenHarga(event){
		if (event == true) {
			this.form.get('namaKomponenHarga').enable();
      this.form.get('namaKomponenHarga').setValidators(Validators.required);
      this.form.get('factorRateMaxPlafon').enable();
      this.form.get('factorRateMaxPlafon').setValidators(Validators.required);
      this.form.get('factorRateMaxOverPlafon').enable();
			this.form.get('factorRateMaxOverPlafon').setValidators(Validators.required);
		} else {
      this.form.get('namaKomponenHarga').setValue('');
			this.form.get('namaKomponenHarga').disable();
      this.form.get('namaKomponenHarga').clearValidators();
      this.form.get('factorRateMaxPlafon').setValue('');
			this.form.get('factorRateMaxPlafon').disable();
      this.form.get('factorRateMaxPlafon').clearValidators();
      this.form.get('factorRateMaxOverPlafon').setValue('');
			this.form.get('factorRateMaxOverPlafon').disable();
			this.form.get('factorRateMaxOverPlafon').clearValidators();
		}
  }
  changePaket(event){
		if (event == true) {
      this.form.get('namaPaket').enable();
      this.form.get('namaPaket').setValidators(Validators.required);
      this.form.get('factorRate').enable();
      this.form.get('factorRate').setValidators(Validators.required);
      this.form.get('operatorfactorRate').enable();
      this.form.get('operatorfactorRate').setValidators(Validators.required);
      this.form.get('maxPlafonPerPeriode2').enable();
      this.form.get('maxPlafonPerPeriode2').setValidators(Validators.required);
      this.form.get('persenPlafonYangDigunakanPerProduk').enable();
      this.form.get('persenPlafonYangDigunakanPerProduk').setValidators(Validators.required);
      this.form.get('maxQtyPaketPerPeriode').enable();
			this.form.get('maxQtyPaketPerPeriode').setValidators(Validators.required);
		} else {
      this.form.get('namaPaket').setValue('');
			this.form.get('namaPaket').disable();
      this.form.get('namaPaket').clearValidators();
      this.form.get('factorRate').setValue('');
			this.form.get('factorRate').disable();
      this.form.get('factorRate').clearValidators();
      this.form.get('operatorfactorRate').setValue('');
			this.form.get('operatorfactorRate').disable();
      this.form.get('operatorfactorRate').clearValidators();
      this.form.get('maxPlafonPerPeriode2').setValue('');
			this.form.get('maxPlafonPerPeriode2').disable();
      this.form.get('maxPlafonPerPeriode2').clearValidators();
      this.form.get('persenPlafonYangDigunakanPerProduk').setValue('');
			this.form.get('persenPlafonYangDigunakanPerProduk').disable();
      this.form.get('persenPlafonYangDigunakanPerProduk').clearValidators();
      this.form.get('maxQtyPaketPerPeriode').setValue('');
			this.form.get('maxQtyPaketPerPeriode').disable();
			this.form.get('maxQtyPaketPerPeriode').clearValidators();
		}
  }
  get() {
    this.httpService.get(Configuration.get().dataMasterNew + '/modulAplikasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaModulAplikasi&sort=desc').subscribe(table => {
      this.listData = table.data.modulAplikasi;
    });
    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeMasaKerja = [];
    //   this.kodeMasaKerja.push({ label: '--Silahkan Pilih Masa Kerja--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeMasaKerja.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=jabatan&select=namaJabatan,id').subscribe(res => {
    //   this.kodeJabatanStruktural = [];
    //   this.kodeJabatanStruktural.push({ label: '--Silahkan Pilih Jabatan Struktural--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeJabatanStruktural.push({ label: res.data.data[i].namaJabatan, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeProduk = [];
    //   this.kodeProduk.push({ label: '--Silahkan Pilih Produk--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeProduk.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodekondisiProduk = [];
    //   this.kodekondisiProduk.push({ label: '--Silahkan Pilih Kondisi Produk--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodekondisiProduk.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/modulAplikasi/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaModulAplikasi&sort=desc&namaModulAplikasi=' + this.pencarian).subscribe(table => {
      this.listData = table.data.modulAplikasi;
    });
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
  onSubmit() {
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
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
        this.alertService.warn('Peringatan', 'Data Tidak Dihapus');
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
        this.alertService.warn('Peringatan', 'Data Tidak Diperbaharui');
      }
    });
  }
  update() {
    this.httpService.update(Configuration.get().dataMasterNew + '/modulAplikasi/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      this.get();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/modulAplikasi/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
        this.get();
      });
    }
    this.reset();


  }

  reset() {
    this.formAktif = true;
    this.form.reset();
  }
  onRowSelect(event) {
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);
    console.log(this.form.value);
  }
  clone(cloned: PegawaiSkMedical): PegawaiSkMedical {
    let hub = new InisialPegawaiSkMedical();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPegawaiSkMedical();
    fixHub = {

      "kode": hub.id.kode,
      "kdKategoriPegawai": hub.kdKategoriPegawai,
      "kdMasaKerja": hub.kdMasaKerja,
      "kdJabatanStruktural": hub.kdJabatanStruktural,
      "kdProduk": hub.kdProduk,
      "kdKondisiProduk": hub.kdKondisiProduk,
      "version": hub.version,
      "Resume": hub.Resume,
      "Keterangan": hub.Keterangan,
      "noRec": hub.noRec,
      //   "statusEnabled": hub.statusEnabled
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/modulAplikasi/del/' + deleteItem.id.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialPegawaiSkMedical implements PegawaiSkMedical {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public kdKategoriPegawai?,
    public kdMasaKerja?,
    public kdJabatanStruktural?,
    public kdProduk?,
    public kdKondisiProduk?,
    public Resume?,
    public Keterangan?,
    public statusEnabled?,
    public noRec?,
    public version?
  ) { }

}	 