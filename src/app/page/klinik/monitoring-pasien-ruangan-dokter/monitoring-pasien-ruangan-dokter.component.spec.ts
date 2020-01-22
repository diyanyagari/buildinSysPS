import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPasienRuanganDokterComponent } from './monitoring-pasien-ruangan-dokter.component';

describe('MonitoringPasienRuanganDokterComponent', () => {
  let component: MonitoringPasienRuanganDokterComponent;
  let fixture: ComponentFixture<MonitoringPasienRuanganDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringPasienRuanganDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringPasienRuanganDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
