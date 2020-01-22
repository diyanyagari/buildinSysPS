import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringKpiComponent } from './monitoring-kpi.component';

describe('MonitoringKpiComponent', () => {
  let component: MonitoringKpiComponent;
  let fixture: ComponentFixture<MonitoringKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
