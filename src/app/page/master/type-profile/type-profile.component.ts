import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { TypeProfile } from './type-profile.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';


@Component({
  selector: 'app-type-profile',
  templateUrl: './type-profile.component.html',
  styleUrls: ['./type-profile.component.scss'],
  providers: [ConfirmationService]
})
export class TypeProfileComponent implements OnInit {
  selected: TypeProfile;
  listData: any[];
  form: FormGroup;
  listkodeTypeProfileHead: TypeProfile[];
  report: any;
  toReport: any;
  formAktif: boolean;
  page: number;
  rows: number;
  totalRecords: number;
  pencarian: string = '';
  versi: any;

  constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) { }


  ngOnInit() {
    if (this.page == undefined || this.rows == undefined) {
      this.page = Configuration.get().page;
      this.rows = Configuration.get().rows;
    }
    this.formAktif = true;
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'namaTypeProfile': new FormControl('', Validators.required),
      'kode': new FormControl(''),
      'kdTypeProfileHead': new FormControl(null),
      'statusEnabled': new FormControl('', Validators.required),
      'reportDisplay': new FormControl('', Validators.required),
      'namaExternal': new FormControl(''),
      'kodeExternal': new FormControl(''),

    });
     this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=TypeProfile&select=namaTypeProfile,id').subscribe(res => {
      this.listkodeTypeProfileHead = [];
      this.listkodeTypeProfileHead.push({ label: '--Pilih Data Parent Type Profile--', value: null })
      for (var i = 0; i < res.data.data.length; i++) {
        this.listkodeTypeProfileHead.push({ label: res.data.data[i].namaTypeProfile, value: res.data.data[i].id.kode })
      };
    });
  }

  valuechange(newValue) {
    this.toReport = newValue;
    this.report = newValue;
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/typeprofile/findAll?page=' + page + '&rows=' + rows).subscribe(table => {
      this.listData = table.TypeProfile;
      this.totalRecords = table.totalRow;

    });
  }

  cari() {
    this.httpService.get(Configuration.get().dataMasterNew + '/typeprofile/findAll?page=1&rows=10&dir=namaTypeProfile&sort=desc&namaTypeProfile=' + this.pencarian).subscribe(table => {
      this.listData = table.TypeProfile;
    });
  }

  loadPage(event: LazyLoadEvent) {
    this.get((event.rows + event.first) / event.rows, event.rows, this.pencarian);
    this.page = (event.rows + event.first) / event.rows;
    this.rows = event.rows;
    // this.setPageRow((event.rows + event.first) / event.rows, event.rows);
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
    let kode = this.form.get('kode').value;
    if (kode == null || kode == undefined || kode == "") {
      this.alertService.warn('Peringatan', 'Pilih Daftar Master Type Profile');
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
    this.httpService.update(Configuration.get().dataMasterNew + '/typeprofile/update/' + this.versi, this.form.value).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Diperbarui');
      this.get(this.page, this.rows, this.pencarian);
      this.reset();
    });
  }
  simpan() {
    if (this.formAktif == false) {
      this.confirmUpdate()
    } else {
      this.httpService.post(Configuration.get().dataMasterNew + '/typeprofile/save?', this.form.value).subscribe(response => {
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
    let cloned = this.clone(event.data);
    this.formAktif = false;
    this.form.setValue(cloned);

  }
  clone(cloned: TypeProfile): TypeProfile {
    let hub = new InisialTypeProfile();
    for (let prop in cloned) {
      hub[prop] = cloned[prop];
    }
    let fixHub = new InisialTypeProfile();
    fixHub = {
      "kode": hub.kode.kode,
      "namaTypeProfile": hub.namaTypeProfile,
      "kdTypeProfileHead": hub.kdTypeProfileHead,
      "kodeExternal": hub.kodeExternal,
      "namaExternal": hub.namaExternal,
      "reportDisplay": hub.reportDisplay,
      "statusEnabled": hub.statusEnabled,
    }
    this.versi = hub.version;
    return fixHub;
  }
  hapus() {
    let item = [...this.listData];
    let deleteItem = item[this.findSelectedIndex()];
    this.httpService.delete(Configuration.get().dataMasterNew + '/typeprofile/del/' + deleteItem.kode.kode).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Dihapus');
      this.get(this.page, this.rows, this.pencarian);
    });
    this.reset();

  }

  findSelectedIndex(): number {
    return this.listData.indexOf(this.selected);
  }
  onDestroy() {

  }
}

class InisialTypeProfile implements TypeProfile {

  constructor(
    public id?,
    public kdTypeProfileHead?,
    public kode?,
    public namaTypeProfile?,
    public reportDisplay?,
    public kodeExternal?,
    public namaExternal?,
    public statusEnabled?,
    public version?


  ) { }

}