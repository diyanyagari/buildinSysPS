import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAngkaToBulanComponent } from './map-angka-to-bulan.component';

describe('MapAngkaToBulanComponent', () => {
  let component: MapAngkaToBulanComponent;
  let fixture: ComponentFixture<MapAngkaToBulanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAngkaToBulanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAngkaToBulanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
