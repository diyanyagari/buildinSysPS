import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarMonitoringPengajuanKpiPegawaiComponent } from './daftar-monitoring-pengajuan-kpi-pegawai.component';

describe('DaftarMonitoringPengajuanKpiPegawaiComponent', () => {
  let component: DaftarMonitoringPengajuanKpiPegawaiComponent;
  let fixture: ComponentFixture<DaftarMonitoringPengajuanKpiPegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarMonitoringPengajuanKpiPegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarMonitoringPengajuanKpiPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
