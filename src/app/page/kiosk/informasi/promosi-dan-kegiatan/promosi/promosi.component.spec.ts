import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromosiComponent } from './promosi.component';

describe('PromosiComponent', () => {
  let component: PromosiComponent;
  let fixture: ComponentFixture<PromosiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromosiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromosiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
