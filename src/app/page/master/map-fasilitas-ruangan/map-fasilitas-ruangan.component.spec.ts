import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFasilitasRuanganComponent } from './map-fasilitas-ruangan.component';

describe('MapFasilitasRuanganComponent', () => {
  let component: MapFasilitasRuanganComponent;
  let fixture: ComponentFixture<MapFasilitasRuanganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFasilitasRuanganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFasilitasRuanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
