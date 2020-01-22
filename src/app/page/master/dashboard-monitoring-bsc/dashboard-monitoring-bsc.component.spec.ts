import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMonitoringBscComponent } from './dashboard-monitoring-bsc.component';

describe('DashboardMonitoringBscComponent', () => {
  let component: DashboardMonitoringBscComponent;
  let fixture: ComponentFixture<DashboardMonitoringBscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMonitoringBscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMonitoringBscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
