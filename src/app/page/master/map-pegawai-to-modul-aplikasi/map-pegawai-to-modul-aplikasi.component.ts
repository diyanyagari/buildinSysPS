import { Component, OnInit } from '@angular/core';
import { HttpClient } from '../../../global/service/HttpClient';
import { Observable } from 'rxjs/Rx';
import { MapPegawaiToModulAplikasi } from './map-pegawai-to-modul-aplikasi.interface';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AlertService, InfoService, Configuration } from '../../../global';

@Component({
	selector: 'app-map-pegawai-to-modul-aplikasi',
	templateUrl: './map-pegawai-to-modul-aplikasi.component.html',
	styleUrls: ['./map-pegawai-to-modul-aplikasi.component.scss'],
	providers: [ConfirmationService]
})
export class MapPegawaiToModulAplikasiComponent implements OnInit {
	item: MapPegawaiToModulAplikasi = new InisialMapPegawaiToModulAplikasi();;
	selected: MapPegawaiToModulAplikasi;
	listData: any[];
	dataDummy: {};
	pencarian;
	versi;
	formMapPegawaiToModulAplikasi: FormGroup;
	constructor(private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder) { }


	ngOnInit() {
		this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MapPegawaiToModulAplikasi&select=*').subscribe(table => {
			this.listData = table.data.data;
		});
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
	tampilPopUp() {
		this.confirmationService.confirm({
			message: 'Contoh Dialog',
			accept: () => {
				//Actual logic to perform a confirmation
			}
		});
	}
	update() {
		this.httpService.update(Configuration.get().dataMasterNew + '/MapPegawaiToModulAplikasi/update/' + this.versi, this.item).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Diperbarui');
			// this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
			this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MapPegawaiToModulAplikasi&select=*').subscribe(table => {
				this.listData = table.data.data;
			});
		});
	}
	simpan() {
		this.dataDummy = {
			"kode": 0,
			"kdTanggal": this.item.kdTanggal,
			"kdHariLibur": this.item.kdHariLibur,
			"kodeExternal": this.item.kodeExternal,
			"namaExternal": this.item.namaExternal,
			"statusEnabled": this.item.statusEnabled
		}
		if (this.item.kode != null || this.item.kode != undefined) {
			this.confirmUpdate()
		} else {
			this.httpService.post(Configuration.get().dataMasterNew + '/MapPegawaiToModulAplikasi/save?', this.dataDummy).subscribe(response => {
				this.alertService.success('Berhasil', 'Data Disimpan');
				// this.InfoService.success('JSON','JSON'+JSON.stringify(this.dataDummy));
				this.reset();
				this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MapPegawaiToModulAplikasi&select=*').subscribe(table => {
					this.listData = table.data.data;
				});
			});
		}

	}

	reset() {
		this.item = {};
	}
	onRowSelect(event) {
		let cloned = this.clone(event.data);
		this.item = cloned;
		console.log(JSON.stringify(this.item));
	}
	clone(cloned: MapPegawaiToModulAplikasi): MapPegawaiToModulAplikasi {
		let hub = new InisialMapPegawaiToModulAplikasi();
		for (let prop in cloned) {
			hub[prop] = cloned[prop];
		}
		let fixHub = new InisialMapPegawaiToModulAplikasi();
		fixHub = {
			"kdHariLibur": hub.version,
			"kdTanggal": hub.version,
			"statusEnabled": hub.statusEnabled,
			"version": hub.version
		}
		this.versi = hub.version;
		return fixHub;
	}
	hapus() {
		let item = [...this.listData];
		let deleteItem = item[this.findSelectedIndex()];
		this.httpService.delete(Configuration.get().dataMasterNew + '/MapPegawaiToModulAplikasi/del/' + deleteItem.id.kode).subscribe(response => {
			this.alertService.success('Berhasil', 'Data Dihapus');
			this.httpService.get(Configuration.get().dataMasterNew + '/service/list-generic/?table=MapPegawaiToModulAplikasi&select=*').subscribe(table => {
				this.listData = table.data.data;
			});
		});

	}

	findSelectedIndex(): number {
		return this.listData.indexOf(this.selected);
	}
	onDestroy() {

	}
}

class InisialMapPegawaiToModulAplikasi implements MapPegawaiToModulAplikasi {

	constructor(
		public id?,
		public kdProfile?,
		public kode?,
		public kdHariLibur?,
		public kdTanggal?,
		public kodeExternal?,
		public namaExternal?,
		public namaHariLibur?,
		public reportDisplay?,
		public statusEnabled?,
		public tanggal?,
		public version?
	) { }

}