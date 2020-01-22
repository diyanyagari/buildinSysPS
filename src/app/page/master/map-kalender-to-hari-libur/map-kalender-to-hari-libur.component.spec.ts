import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKalenderToHariLiburComponent } from './map-kalender-to-hari-libur.component';

describe('MapKalenderToHariLiburComponent', () => {
  let component: MapKalenderToHariLiburComponent;
  let fixture: ComponentFixture<MapKalenderToHariLiburComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKalenderToHariLiburComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKalenderToHariLiburComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
