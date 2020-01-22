import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent } from './daftar-monitoring-pengajuan-realisasi-kpi-pegawai.component';

describe('DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent', () => {
  let component: DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent;
  let fixture: ComponentFixture<DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarMonitoringPengajuanRealisasiKpiPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
