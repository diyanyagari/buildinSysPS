import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodeDeliveryComponent } from './metode-delivery.component';

describe('MetodeDeliveryComponent', () => {
  let component: MetodeDeliveryComponent;
  let fixture: ComponentFixture<MetodeDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodeDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodeDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
