import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganJurusanComponent } from './map-ruangan-jurusan.component';

describe('MapFasilitasRuanganComponent', () => {
  let component: MapRuanganJurusanComponent;
  let fixture: ComponentFixture<MapRuanganJurusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganJurusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganJurusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
