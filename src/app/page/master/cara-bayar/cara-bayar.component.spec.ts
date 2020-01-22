import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaraBayarComponent } from './cara-bayar.component';

describe('CaraBayarComponent', () => {
  let component: CaraBayarComponent;
  let fixture: ComponentFixture<CaraBayarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaraBayarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaraBayarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
