import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringUserBaruComponent } from './monitoring-userbaru.component';

describe('MonitoringUserBaruComponent', () => {
  let component: MonitoringUserBaruComponent;
  let fixture: ComponentFixture<MonitoringUserBaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringUserBaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringUserBaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
