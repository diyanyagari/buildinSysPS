import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MapKelompok, SelectedItem } from './map-kelompok-shift-to-shift.interface';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration } from '../../../global';
@Component({
    selector: 'app-map-kelompok-shift-to-shift',
    templateUrl: './map-kelompok-shift-to-shift.component.html',
    styleUrls: ['./map-kelompok-shift-to-shift.component.scss'],
    providers: [ConfirmationService]
})
export class MapKelompokShiftToShiftComponent implements OnInit {
    selected: MapKelompok;
    kodeKelompokShift: MapKelompok[];
    listData: any[];

    versi: any;
    form: FormGroup;
    formAktif: boolean;
    pencarian: string;
    page: number;
    rows: number;
    cekLampiranDokumen: boolean = false;
    hasilCek: boolean = false;
    blockedPanel: boolean = false;
    selectedAll: any;
    kdDiklatJurusan: any;
    pilihan: any = [];
    pilihSemua: boolean;
    version: any;
    
     constructor(private alertService: AlertService,
    private InfoService: InfoService,
    private httpService: HttpClient,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef) {
    this.page = Configuration.get().page;
    this.rows = Configuration.get().rows;
  }
  ngAfterViewInit() {
    this.hasilCek = true;
    this.cekLampiranDokumen = false;
    this.cdRef.detectChanges();
    this.clearPanelBawah(this.kdDiklatJurusan);


  }

  ngOnInit() {

    this.version = "1";
    this.get(this.page, this.rows, '');
    this.form = this.fb.group({
      'kdKelompokShift': new FormControl('', Validators.required),
      'statusEnabled': new FormControl(true),

    });




    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=KelompokShiftKerja&select=namaKelompokShiftKerja,id').subscribe(res => {
      this.kodeKelompokShift = [];
      this.kodeKelompokShift.push({ label: '--Pilih Kelompok Shift--', value: '' })
      for (var i = 0; i < res.data.data.length; i++) {
        this.kodeKelompokShift.push({ label: res.data.data[i].namaKelompokShiftKerja, value: res.data.data[i].id.kode })
      };
    });
  }

  get(page: number, rows: number, search: any) {
    this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=ShiftKerja&select=namaShift,id.kode').subscribe(res => {
      this.listData = res.data.data;
    });
  }

  clearPanelBawah(kdDiklatJurusan) {

    if (kdDiklatJurusan == '' || kdDiklatJurusan == null) {
      this.hasilCek = true;
      this.pilihan = [];
      this.pilihSemua = false;

    } else {
      this.hasilCek = false;
      this.pilihSemua = false;
      this.httpService.get(Configuration.get().dataMasterNew + '/mapkelompokshifttoshift/findByKode/' + kdDiklatJurusan).subscribe(res => {
        this.pilihan = [];
        for (let i = 0; i < res.MapKelompokShiftToShift.length; i++) {
          this.pilihan.push(String(res.MapKelompokShiftToShift[i].kdShift))
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
        dataTemp.push(String(data.id_kode));
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
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      this.alertService.warn("Peringatan", "Data Tidak Sesuai")
    } else {
      this.simpan();
    }
  }


  simpan() {
    let mapKelompokShiftToShift = []
    for (let i = 0; i < this.pilihan.length; i++) {
      let dataTemp = {
        "kdShift": this.pilihan[i],
        "kdKelompokShift": this.form.get('kdKelompokShift').value,
        "statusEnabled": true
      }
      mapKelompokShiftToShift.push(dataTemp);
    }
    let dataSimpan = {
      "mapKelompokShiftToShift": mapKelompokShiftToShift
    }

    this.httpService.update(Configuration.get().dataMasterNew + '/mapkelompokshifttoshift/update/' + this.version, dataSimpan).subscribe(response => {
      this.alertService.success('Berhasil', 'Data Disimpan');
      // this.get(this.page, this.rows, this.pencarian);
      this.pilihSemua = false;
    });
  }


}



