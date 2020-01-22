import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompoktransaksiJenisdokumenComponent } from './map-kelompoktransaksi-jenisdokumen.component';

describe('MapKelompoktransaksiJenisdokumenComponent', () => {
  let component: MapKelompoktransaksiJenisdokumenComponent;
  let fixture: ComponentFixture<MapKelompoktransaksiJenisdokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompoktransaksiJenisdokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompoktransaksiJenisdokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
