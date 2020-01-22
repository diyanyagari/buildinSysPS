import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskHomeComponent } from './kiosk-home.component';

describe('KioskHomeComponent', () => {
  let component: KioskHomeComponent;
  let fixture: ComponentFixture<KioskHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
