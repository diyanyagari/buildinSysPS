import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompokevaluasiJabatanComponent } from './map-kelompokevaluasi-jabatan.component';

describe('MapKelompokevaluasiJabatanComponent', () => {
  let component: MapKelompokevaluasiJabatanComponent;
  let fixture: ComponentFixture<MapKelompokevaluasiJabatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompokevaluasiJabatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompokevaluasiJabatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
