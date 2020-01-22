import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { PegawaiSkGajiBAK } from './pegawai-sk-gaji-bak.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
  selector: 'app-pegawai-sk-gaji-bak',
  templateUrl: './pegawai-sk-gaji-bak.component.html',
  styleUrls: ['./pegawai-sk-gaji-bak.component.scss'],
  providers: [ConfirmationService]
})
export class PegawaiSkGajiBAKComponent implements OnInit {
  item: PegawaiSkGajiBAK = new InisialPegawaiSkGajiBAK();;
  selected: PegawaiSkGajiBAK;
  listData: PegawaiSkGajiBAK[];
  dataDummy: {};
  kodePegawai: PegawaiSkGajiBAK[];
  kodeKomponenHarga: PegawaiSkGajiBAK[];
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
      'kdPegawai': new FormControl('', Validators.required),
      'kdAkunBank': new FormControl('', Validators.required),
      'hargaSatuan': new FormControl('', Validators.required),
      'noRec': new FormControl('', Validators.required),
      'kdKomponenHarga': new FormControl('', Validators.required),
      'persenHargaSatuan': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),

    });
  }

  get() {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryDokumen&select=*').subscribe(table => {
      this.listData = table.data.data;
    });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodePegawai = [];
    //   this.kodePegawai.push({ label: '--Silahkan Pilih Pegawai--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodePegawai.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
    //   };
    // });

    // this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=Status&select=namaStatus,id').subscribe(res => {
    //   this.kodeKomponenHarga = [];
    //   this.kodeKomponenHarga.push({ label: '--Silahkan Pilih Komponen Harga--', value: '' })
    //   for (var i = 0; i < res.data.data.length; i++) {
    //     this.kodeKomponenHarga.push({ label: res.data.data[i].namaStatus, value: res.data.data[i].id.kode })
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
    this.httpService.update(Configuration.get().dataMasterNew + '/PegawaiSkGajiBA/update/' + this.versi, this.item).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      // this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
      this.reset();
      this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KategoryDokumen&select=*').subscribe(table => {
        this.listData = table.data.data;
      });
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
  clone(cloned: PegawaiSkGajiBAK): PegawaiSkGajiBAK {
    let hub = new InisialPegawaiSkGajiBAK();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialPegawaiSkGajiBAK();
    fixHub = {

      "kode": hub.id.kode,
      "pegawai": hub.pegawai,
      "kdAkunBank": hub.kdAkunBank,
      "hargaSatuan": hub.hargaSatuan,
      "kdKomponenHarga": hub.kdKomponenHarga,
      "version": hub.version,
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

class InisialPegawaiSkGajiBAK implements PegawaiSkGajiBAK {

  constructor(
    public id?,
    public kdProfile?,
    public kode?,
    public pegawai?,
    public kdAkunBank?,
    public kdKomponenHarga?,
    public hargaSatuan?,
    public persenHargaSatuan?,
    public statusEnabled?,
    public noRec?,
    public version?
  ) { }

}	 