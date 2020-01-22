import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFakultasProgramJurusanComponent } from './map-fakultas-program-jurusan.component';

describe('MapFasilitasRuanganComponent', () => {
  let component: MapFakultasProgramJurusanComponent;
  let fixture: ComponentFixture<MapFakultasProgramJurusanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFakultasProgramJurusanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFakultasProgramJurusanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
