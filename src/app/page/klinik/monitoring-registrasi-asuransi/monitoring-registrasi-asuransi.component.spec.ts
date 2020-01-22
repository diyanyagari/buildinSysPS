import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringRegistrasiAsuransiComponent } from './monitoring-registrasi-asuransi.component';

describe('MonitoringRegistrasiAsuransiComponent', () => {
  let component: MonitoringRegistrasiAsuransiComponent;
  let fixture: ComponentFixture<MonitoringRegistrasiAsuransiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringRegistrasiAsuransiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringRegistrasiAsuransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
