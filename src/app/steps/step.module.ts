import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StepsModule, ButtonModule } from 'primeng/primeng';

import { ProsesRegistrasiPegawaiComponent } from './proses-registrasi-pegawai/proses-registrasi-pegawai.component';
import { ProsesPenggajianComponent } from './proses-penggajian/proses-penggajian.component';

@NgModule({ 
	declarations : [ ProsesRegistrasiPegawaiComponent ],
	imports: [ CommonModule, StepsModule, ButtonModule, TranslateModule ],
	exports: [ ProsesRegistrasiPegawaiComponent ]
})
export class ProsesRegistrasiPegawaiModule {}


@NgModule({ 
	declarations : [ ProsesPenggajianComponent ],
	imports: [ CommonModule, StepsModule, ButtonModule, TranslateModule ],
	exports: [ ProsesPenggajianComponent ]
})
export class ProsesPenggajianModule {}


