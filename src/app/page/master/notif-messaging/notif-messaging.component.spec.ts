import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifMessagingComponent } from './notif-messaging.component';

describe('NotifMessagingComponent', () => {
  let component: NotifMessagingComponent;
  let fixture: ComponentFixture<NotifMessagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifMessagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
