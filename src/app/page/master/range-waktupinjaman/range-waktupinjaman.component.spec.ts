import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeWaktuPinjamanComponent } from './ruangan.component';

describe('RangeWaktuPinjamanComponent', () => {
  let component: RangeWaktuPinjamanComponent;
  let fixture: ComponentFixture<RangeWaktuPinjamanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeWaktuPinjamanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeWaktuPinjamanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
