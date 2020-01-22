import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBagianComponent } from './unit-bagian.component';

describe('UnitBagianComponent', () => {
  let component: UnitBagianComponent;
  let fixture: ComponentFixture<UnitBagianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitBagianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitBagianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
