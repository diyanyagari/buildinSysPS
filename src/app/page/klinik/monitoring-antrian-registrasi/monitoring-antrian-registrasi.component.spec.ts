import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringAntrianRegistrasiComponent } from './monitoring-antrian-registrasi.component';

describe('MonitoringAntrianRegistrasiComponent', () => {
  let component: MonitoringAntrianRegistrasiComponent;
  let fixture: ComponentFixture<MonitoringAntrianRegistrasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringAntrianRegistrasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringAntrianRegistrasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
