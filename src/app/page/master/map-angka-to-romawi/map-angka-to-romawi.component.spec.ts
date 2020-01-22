import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAngkaToRomawiComponent } from './map-angka-to-romawi.component';

describe('MapAngkaToRomawiComponent', () => {
  let component: MapAngkaToRomawiComponent;
  let fixture: ComponentFixture<MapAngkaToRomawiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAngkaToRomawiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAngkaToRomawiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
