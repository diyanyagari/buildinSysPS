import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, ReportService, AuthGuard } from '../../../global';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { Klinik1JavaService } from '../../../services-backend/klinik/Klinik1JavaService';

@Component({
    selector: 'app-agama',
    templateUrl: './simulasi-nomor.component.html',
    styleUrls: ['./simulasi-nomor.component.scss'],
    providers: [ConfirmationService]
})
export class SimulasiNomorComponent implements OnInit {
    selected: any;
    listData: any[];
    codes: any[];
    dataDummy: {};
    formAktif: boolean;
    kodeGolonganPegawai: any[];
    ruangan: any[];
    versi: any;
    form: FormGroup;
    items: any;
    kode: any;
    id: any;
    page: number;
    id_kode: any;
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    pencarian: string;
    dropdownNegara: any[];
    FilterNegara: string;
    dataValidForm: boolean;
    laporan: boolean = false;

    kdprof: any;
    kddept: any;
    headerLaporan: string;
    smbrFile: any;
    listKelompokTransaksi: any[];
    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        private translate: TranslateService,
        // private klinik1JavaService: Klinik1JavaService,
    ) {

    }


    ngOnInit() {
        this.form = this.fb.group({
            'kdKelompokTransaksi': new FormControl('', Validators.required),
            'tglGenerate': new FormControl('', Validators.required),
            'totalGenerate': new FormControl('', Validators.required),
            'namaTable': new FormControl('')
        });
        this.get();
    }
    get() {
        this.httpService.get(Configuration.get().dataMasterNew + '/kelompoktransaksi/findAll?page=1&rows=1000&dir=namaKelompokTransaksi&sort=desc').subscribe(res => {
            this.listKelompokTransaksi = [];
            this.listKelompokTransaksi.push({ label: '--Pilih Kelompok Transaksi--', value: '' })
            for (var i = 0; i < res.KelompokTransaksi.length; i++) {
                this.listKelompokTransaksi.push({ label: res.KelompokTransaksi[i].namaKelompokTransaksi, value: res.KelompokTransaksi[i].kdKelompokTransaksi })
            };
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
    setTimeStamp(date) {
        if (date == null || date == undefined || date == '') {
            let dataTimeStamp = (new Date().getTime() / 1000);
            return dataTimeStamp.toFixed(0);
        } else {
            let dataTimeStamp = (new Date(date).getTime() / 1000);
            return dataTimeStamp.toFixed(0);
        }
    }
    onSubmit() {
        if (this.form.invalid) {
            this.validateAllFormFields(this.form);
            this.alertService.warn("Peringatan", "Data Tidak Sesuai");
            this.dataValidForm = false;
        } else {
            this.generate();
        }
    }
    generate() {
        // let dataGenerate = {
        //     "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
        //     "quantity": this.form.get('totalGenerate').value,
        //     "tanggal": this.setTimeStamp(this.form.get('tglGenerate').value)
        // }

        // let resPromise = new Promise((resolve, reject) => {
        //     resolve(dataGenerate);
        // });
        // resPromise.then((res) => {
        //     let data= this.klinik1JavaService.saveGenerateNomor(res);
        //     console.log(data);
        // }).then(res => {

        // });

        let dataGenerate = {
            "kdKelompokTransaksi": this.form.get('kdKelompokTransaksi').value,
            "quantity": this.form.get('totalGenerate').value,
            "tanggal": this.setTimeStamp(this.form.get('tglGenerate').value),
            "namaTabel": this.form.get('namaTable').value
        }
        this.httpService.post(Configuration.get().klinik1Java + '/generateNomor/saveGenerateNomor', dataGenerate).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Disimpan');
            this.listData = [];
            for (let i = 0; i < response.data.length; i++) {
                this.listData.push(response.data[i]);
            }
        });
        
    }

}
