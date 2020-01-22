import { Inject, forwardRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService,TreeNode } from 'primeng/primeng';
import { FileService, AlertService, InfoService, Configuration, ReportService, AuthGuard } from '../../../global';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-profile-konfigurasi-design',
    templateUrl: './profile-konfigurasi-design.component.html',
    styleUrls: ['./profile-konfigurasi-design.component.scss'],
    providers: [ConfirmationService]
})
export class ProfileKonfigurasiDesignComponent implements OnInit {
    listData: any[];
    dataDummy: {};
    formAktif: boolean;
    versi: any;
    form: FormGroup;
    items: any;
    kode: any;
    id: any;
    page: number;
    id_kode: any; a
    rows: number;
    totalRecords: number;
    report: any;
    toReport: any;
    pencarian: string;
    listDropdownProfile: any[];
    listDropdownModulAplikasi: any[];
    listDropdownVersion: any[];
    listDropdownDesignTheme: any[];
    listDropdownDesignHome: any[];
    listDropdownDesignHomeContent: any[];
    listDropdownBahasa: any[];
    FilterNegara: string;
    dataValidForm: boolean;
    laporan: boolean = false;

    kdprof: any;
    kddept: any;
    headerLaporan: string;
    pathFileRegionalSetting: any;

    selectedVersion: any;
	openDropdownKey: boolean;
	selectedFilesVersion: TreeNode[];
    selectKdVersion: any;
    listVersion:any[];
    treeDrop:any;

    constructor(private alertService: AlertService,
        private InfoService: InfoService,
        private httpService: HttpClient,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private fileService: FileService,
        private authGuard: AuthGuard,
        private translate: TranslateService,
        @Inject(forwardRef(() => ReportService)) private print: ReportService) {

    }


    ngOnInit() {
        this.treeDrop = false;
        this.openDropdownKey = false;
		this.listVersion = [];
		this.selectedVersion = null;
        this.selectKdVersion = '';

        this.pencarian = '';
        this.FilterNegara = '';
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
        if (this.page == undefined || this.rows == undefined) {
            this.page = Configuration.get().page;
            this.rows = Configuration.get().rows;
        }
        this.formAktif = true;
        this.getPage(this.page, this.rows, this.pencarian);
        this.versi = null;
        this.form = this.fb.group({
            'kdProfile': new FormControl('', Validators.required),
            'kdModulAplikasi': new FormControl('', Validators.required),
            //'kdVersion': new FormControl('', Validators.required),
            'kdDesignTheme': new FormControl('', Validators.required),
            'kdDesignHome': new FormControl(''),
            'kdDesignHomeContent': new FormControl(''),
            'kdBahasa': new FormControl(''),
            'statusEnabled': new FormControl('', Validators.required),
            'pathFileRegionalSetting': new FormControl(''),
        });
        this.dataValidForm = true;
        this.getService();

    }

    getService() {
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
       
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findAll?page=1&rows=1000&dir=namaLengkap&sort=desc').subscribe(res => {
            this.listDropdownProfile = [];
            this.listDropdownProfile.push({ label: '--Pilih--', value: null })
            for (var i = 0; i < res.Profile.length; i++) {
              this.listDropdownProfile.push({ label: res.Profile[i].namaLengkap, value: res.Profile[i].kode })
            };
          }, error => {
            this.listDropdownProfile = [];
            this.listDropdownProfile.push({ label: '-- ' + error + ' --', value: '' })
          });

       
        this.httpService.get(Configuration.get().dataMaster + '/profileconfigdesign/designContent').subscribe(res => {
            this.listDropdownDesignHomeContent = [];
            this.listDropdownDesignHomeContent.push({ label: '--Pilih--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listDropdownDesignHomeContent.push({ label: res.data[i].namaDesign, value: res.data[i].kode })
            };
        });

       
        this.httpService.get(Configuration.get().dataMaster + '/profileconfigdesign/designHome').subscribe(res => {
            this.listDropdownDesignHome = [];
            this.listDropdownDesignHome.push({ label: '--Pilih--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listDropdownDesignHome.push({ label: res.data[i].namaDesign, value: res.data[i].kode })
            };
        });

       
        this.httpService.get(Configuration.get().dataMaster + '/profileconfigdesign/designTheme').subscribe(res => {
            this.listDropdownDesignTheme = [];
            this.listDropdownDesignTheme.push({ label: '--Pilih--', value: '' });
            for (var i = 0; i < res.data.length; i++) {
                this.listDropdownDesignTheme.push({ label: res.data[i].namaDesign, value: res.data[i].kode })
            };
        });


        this.httpService.get(Configuration.get().dataMasterNew + '/bahasa/findAllBahasa?kdNegara=' + this.authGuard.getUserDto().profile.kdNegara).subscribe(table => {
			this.listDropdownBahasa = [];
			this.listDropdownBahasa.push({ label: '-- Pilih Bahasa --', value: '' })
			for (var i = 0; i < table.bahasa.length; i++) {
				this.listDropdownBahasa.push({
					label: table.bahasa[i].namaBahasa, value:table.bahasa[i].kode.kode
				})
			};
		});
    }

    valuechange(newValue) {

        if (newValue == "") {
            this.dataValidForm = false;
        } else {
            this.dataValidForm = true;
        }
        this.report = newValue;
    }
    getInput() {

    }

    downloadExcel() {
    }

    getpathFileRegionalSetting() {
        this.httpService.get(Configuration.get().dataMasterNew + '/profile/findProfile').subscribe(table => {
            this.pathFileRegionalSetting = Configuration.get().resourceFile + '/image/show/' + table.profile.gambarLogo + '?noProfile=true';
        });
    }

    downloadPdf() {
    }

    getPage(page: number, rows: number, search: any) {
        this.httpService.get(Configuration.get().dataMasterNew + '/profileconfigdesign/findAll?page=' + page + '&rows=' + rows + '&dir=modulAplikasi.namaModulAplikasi&sort=desc&namaProfileConfigDesign=' + search).subscribe(table => {
            this.listData = table.ProfileConfigDesign;
            this.totalRecords = table.totalRow;

        });
    }

    cari() {
        this.getPage(this.page, this.rows, this.pencarian);
    }
    loadPage(event: LazyLoadEvent) {
        this.getPage((event.rows + event.first) / event.rows, event.rows, this.pencarian);
        this.page = (event.rows + event.first) / event.rows;
        this.rows = event.rows;
    }

    confirmDelete() {
        let kode = this.form.get('kdModulAplikasi').value;
        if (kode == null || kode == undefined || kode == "") {
            this.alertService.warn('Peringatan', 'Pilih Daftar Master Profile Konfigurasi Design');
        } else {
            this.confirmationService.confirm({
                message: 'Apakah data akan di hapus?',
                header: 'Konfirmasi Hapus',
                icon: 'fa fa-trash',
                accept: () => {
                    this.hapus();
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
            this.alertService.warn("Peringatan", "Data Tidak Sesuai");
            this.dataValidForm = false;
        } else {
            this.simpan();
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
        let dataUpdate={
            "kdBahasa": this.form.get('kdBahasa').value,
            "kdDesignHome": this.form.get('kdDesignHome').value,
            "kdDesignHomeContent": this.form.get('kdDesignHomeContent').value,
            "kdDesignTheme": this.form.get('kdDesignTheme').value,
            "kdModulAplikasi": this.form.get('kdModulAplikasi').value,
            "kdProfile": this.form.get('kdProfile').value,
            "kdVersion": this.selectKdVersion,
            "pathFileRegionalSetting": this.form.get('pathFileRegionalSetting').value,
            "statusEnabled": this.form.get('statusEnabled').value
          }
        this.httpService.update(Configuration.get().dataMasterNew + '/profileconfigdesign/update/', dataUpdate).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Diperbarui');
            // this.getPage(this.page, this.rows, this.pencarian);
            this.reset();
        });
    }

    simpan() {
        if (this.formAktif == false) {
            this.confirmUpdate();
        } else {

            if(this.selectKdVersion == ''){
                this.alertService.warn('Perhatian','Harap Pilih Version Terlebih Dahulu');
            }else{
                let dataSimpan = {
                    "kdBahasa": this.form.get('kdBahasa').value,
                    "kdDesignHome": this.form.get('kdDesignHome').value,
                    "kdDesignHomeContent": this.form.get('kdDesignHomeContent').value,
                    "kdDesignTheme": this.form.get('kdDesignTheme').value,
                    "kdModulAplikasi": this.form.get('kdModulAplikasi').value,
                    "kdProfile": this.form.get('kdProfile').value,
                    "kdVersion": this.selectKdVersion,
                    "pathFileRegionalSetting": this.form.get('pathFileRegionalSetting').value,
                    "statusEnabled": this.form.get('statusEnabled').value
                }
                this.httpService.post(Configuration.get().dataMasterNew + '/profileconfigdesign/save?', dataSimpan).subscribe(response => {
                    this.alertService.success('Berhasil', 'Data Disimpan');
                    this.reset();
                });
            }

            
        }

    }

    reset() {
        this.formAktif = true;
        this.form.get('kdProfile').enable();
        this.form.get('kdModulAplikasi').enable();
        //this.form.get('kdVersion').enable();
        this.form.get('kdProfile').setValidators(Validators.required);
        this.form.get('kdModulAplikasi').setValidators(Validators.required);
        //this.form.get('kdVersion').setValidators(Validators.required);
        this.ngOnInit();
    }
    onRowSelect(event) {
        this.formAktif = false;
        this.form.get('kdProfile').setValue(event.data.kode.kdProfile);
        this.form.get('kdModulAplikasi').setValue(event.data.kode.kdModulAplikasi);
        //this.form.get('kdVersion').setValue(event.data.versionSystem.kode);
        this.selectedVersion = event.data.namaVersionSystem
        this.selectKdVersion = event.data.kdVersionSystem;
        //this.selectedFilesVersion = event.data.versionSystem.kode;

        this.form.get('kdDesignTheme').setValue(event.data.kdDesignTheme);
        // let dhome = '';
        // if(event.data.designHome == null){
        //     dhome = event.data.designHome;
        // }
        // if(event.data.designHome != null){
        //     dhome = event.data.designHome.kode;
        // }

        this.form.get('kdDesignHome').setValue(event.data.kdDesignHome);

        // let homeContent = '';

        // if(event.data.designHomeContent == null){
        //     homeContent = event.data.designHomeContent;
        // }
        
        // if(event.data.designHomeContent != null){
        //     homeContent = event.data.designHomeContent.kode;
        // }

        this.form.get('kdDesignHomeContent').setValue(event.data.kdDesignHomeContent);
        this.form.get('kdBahasa').setValue(event.data.kdBahasa);
        this.form.get('statusEnabled').setValue(event.data.statusEnabled);
        this.form.get('pathFileRegionalSetting').setValue(event.data.pathFileRegionalSetting);
        this.form.get('kdProfile').disable();
        this.form.get('kdModulAplikasi').disable();
        //this.form.get('kdVersion').disable();
        this.treeDrop = true;
        this.form.get('kdProfile').setValidators(null);
        this.form.get('kdModulAplikasi').setValidators(null);
        //this.form.get('kdVersion').setValidators(null);
    }

    hapus() {
        let item = [...this.listData];
        this.httpService.delete(Configuration.get().dataMasterNew + '/profileconfigdesign/del/' + this.form.get('kdModulAplikasi').value+'/'+ this.selectKdVersion).subscribe(response => {
            this.alertService.success('Berhasil', 'Data Dihapus');
            this.reset();
        });
    }

    tutupLaporan() {
        this.laporan = false;
    }
    cetak() {
        this.laporan = true;
    }

    urlUpload() {
        return Configuration.get().resourceFile + '/file/upload?noProfile=false';
    }

    imageUpload(event) {
        this.pathFileRegionalSetting = event.xhr.response;
    }

    addHeader(event) {
        this.httpService.beforeUploadFile(event);
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
