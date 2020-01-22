import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPasienDiPeriksaComponent } from './monitoring-pasien-diperiksa.component';

describe('MonitoringPasienDiPeriksaComponent', () => {
  let component: MonitoringPasienDiPeriksaComponent;
  let fixture: ComponentFixture<MonitoringPasienDiPeriksaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringPasienDiPeriksaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringPasienDiPeriksaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
