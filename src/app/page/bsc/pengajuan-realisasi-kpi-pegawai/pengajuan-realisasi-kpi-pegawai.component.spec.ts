import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanRealisasiKpiPegawaiComponent } from './pengajuan-realisasi-kpi-pegawai.component';

describe('PengajuanRealisasiKpiPegawaiComponent', () => {
  let component: PengajuanRealisasiKpiPegawaiComponent;
  let fixture: ComponentFixture<PengajuanRealisasiKpiPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengajuanRealisasiKpiPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengajuanRealisasiKpiPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
