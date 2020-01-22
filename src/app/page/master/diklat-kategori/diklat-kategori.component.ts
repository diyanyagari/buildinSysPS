import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
//import { DiklatKategori } from './diklat-kategori.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
  selector: 'app-diklat-kategori',
  templateUrl: './diklat-kategori.component.html',
  styleUrls: ['./diklat-kategori.component.scss'],
  providers: [ConfirmationService]
})
export class DiklatKategoriComponent implements OnInit {
  listDiklatKategori: any[];
  kdAccount: any[];
  selected: any;
  listData: any[];
  pencarian: string;
  dataDummy: {};
  formAktif: boolean;
  versi: any;
  form: FormGroup;
  items: any;
  page: number;
  rows: number;
  totalRecords: number;
  report: any;
  toReport: any;
  dataValidForm: boolean;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService) {

  }

  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kode': new FormControl(''),
      'kdDiklatKategoriHead': new FormControl(null),
      'namaDiklatKategori': new FormControl('', Validators.required),
      'tglBerdiri': new FormControl(''),
      'noSKBerdiri': new FormControl(''),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),
      'statusEnabled': new FormControl('', Validators.required),
    });
    this.dataValidForm = true;
    if(this.form.get('namaDiklatKategori').value == "") {
      this.dataValidForm = true;
    }
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
    if(newValue == "") {
           this.dataValidForm = false;
        } else {
            this.dataValidForm = true;
        }
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/diklatkategori/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.DiklatKategori;
      this.totalRecords = table.totalRow;
    });


    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=DiklatKategori&select=namaDiklatKategori,id').subscribe(res => {
      this.listDiklatKategori = [];
      this.listDiklatKategori.push({ label: '--Pilih Data Parent Diklat Kategori--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listDiklatKategori.push({ label: res.data.data[i].namaDiklatKategori, value: res.data.data[i].id.kode })
      };
    });

  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/diklatkategori/findAll?page=' + Configuration.get().page + '&rows=' + Configuration.get().rows + '&dir=namaDiklatKategori&sort=desc&namaDiklatKategori=' + this.pencarian).subscribe(table => {
      this.listData = table.DiklatKategori;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
  }

  confirmDelete() {
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Diklat Kategori');
    } else {
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

  setTimeStamp(date) {
    let dataTimeStamp = (new Date(date).getTime() / 1000);
    return dataTimeStamp;
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
    let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

    let formSubmit = this.form.value;
    formSubmit.tglBerdiri = tglBerdiri;
    this.httpService.update(Configuration.get().dataMasterNew + '/diklatkategori/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }

  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      let tglBerdiri = this.setTimeStamp(this.form.get('tglBerdiri').value)

      let formSubmit = this.form.value;
      formSubmit.tglBerdiri = tglBerdiri;
      this.httpService.post(Configuration.get().dataMasterNew + '/diklatkategori/save?', this.form.value).subscribe(response => {
        this.alertService.success('Berhasil', 'Data Disimpan');
        this.get(this.page, this.rows, this.pencarian);
        this.reset();
      });
    }

  }

  reset() {
    this.formAktif = true;
    this.ngOnInit();
  }

  onRowSelect(event) {
    //let cloned = this.clone(event.data);
    this.formAktif = false;
    //this.form.setValue(cloned);
  }

  /*clone(cloned: any) {
    let hub = new InisialDiklatKategori();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialDiklatKategori();
    if (hub.tglBerdiri == null || hub.tglBerdiri == 0) {
      fixHub = {
        'kode': hub.kode.kode,
        'kdDiklatKategoriHead': hub.kdDiklatKategoriHead,
        'namaDiklatKategori': hub.namaDiklatKategori,
        'tglBerdiri': null,
        'noSKBerdiri': hub.noSKBerdiri,
        'reportDisplay': hub.reportDisplay,
        'namaExternal': hub.namaExternal,
        'kodeExternal': hub.kodeExternal,
        'statusEnabled': hub.statusEnabled
      }
      this.versi = hub.version;
      return fixHub;
    }
    else {
      fixHub = {
        'kode': hub.kode.kode,
        'kdDiklatKategoriHead': hub.kdDiklatKategoriHead,
        'namaDiklatKategori': hub.namaDiklatKategori,
        'tglBerdiri': new Date(hub.tglBerdiri * 1000),
        'noSKBerdiri': hub.noSKBerdiri,
        'reportDisplay': hub.reportDisplay,
        'namaExternal': hub.namaExternal,
        'kodeExternal': hub.kodeExternal,
        'statusEnabled': hub.statusEnabled
      }
      this.versi = hub.version;
      return fixHub;
    }
  }*/

  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/diklatkategori/del/' + deleteItem.kode.kode).subscribe(response => {
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

/*class InisialDiklatKategori implements DiklatKategori {

  constructor(
    public kdDiklatKategoriHead?,
    public tglBerdiri?,
    public kdAccount?,
    public namaDiklatKategori?,
    public noSKBerdiri?,

    public kode?,
    public id?,
    public kdProfile?,
    public version?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
  ) { }

}*/