import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPasienComponent } from './monitoring-pasien.component';

describe('MonitoringPasienComponent', () => {
  let component: MonitoringPasienComponent;
  let fixture: ComponentFixture<MonitoringPasienComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringPasienComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringPasienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
