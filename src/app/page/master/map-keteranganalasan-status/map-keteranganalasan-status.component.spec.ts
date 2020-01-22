import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKeteranganalasanStatusComponent } from './map-keteranganalasan-status.component';

describe('MapKeteranganalasanStatusComponent', () => {
  let component: MapKeteranganalasanStatusComponent;
  let fixture: ComponentFixture<MapKeteranganalasanStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKeteranganalasanStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKeteranganalasanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
