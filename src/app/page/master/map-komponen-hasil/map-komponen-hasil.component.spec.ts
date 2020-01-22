import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKomponenHasilComponent } from './map-komponen-hasil.component';

describe('MapKomponenHasilComponent', () => {
  let component: MapKomponenHasilComponent;
  let fixture: ComponentFixture<MapKomponenHasilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKomponenHasilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKomponenHasilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
