import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarMonitoringDatabasePegawaiComponent } from './daftar-monitoring-database-pegawai.component';

describe('DaftarMonitoringDatabasePegawaiComponent', () => {
  let component: DaftarMonitoringDatabasePegawaiComponent;
  let fixture: ComponentFixture<DaftarMonitoringDatabasePegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarMonitoringDatabasePegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarMonitoringDatabasePegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
