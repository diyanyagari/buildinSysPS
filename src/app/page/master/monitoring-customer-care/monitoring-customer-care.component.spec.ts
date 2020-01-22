import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringCustomerCareComponent } from './monitoring-customer-care.component';

describe('MonitoringCustomerCareComponent', () => {
  let component: MonitoringCustomerCareComponent;
  let fixture: ComponentFixture<MonitoringCustomerCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringCustomerCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringCustomerCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
