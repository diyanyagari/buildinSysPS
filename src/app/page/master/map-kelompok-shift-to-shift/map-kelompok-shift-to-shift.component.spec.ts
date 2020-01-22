import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompokShiftToShiftComponent } from './map-kelompok-shift-to-shift.component';

describe('MapKelompokShiftToShiftComponent', () => {
  let component: MapKelompokShiftToShiftComponent;
  let fixture: ComponentFixture<MapKelompokShiftToShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompokShiftToShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompokShiftToShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
