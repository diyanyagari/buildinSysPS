import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringSubscribeComponent } from './monitoring-subscribe.component';

describe('MonitoringSubscribeComponent', () => {
  let component: MonitoringSubscribeComponent;
  let fixture: ComponentFixture<MonitoringSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
