import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPegawaiProdukdiklatComponent } from './map-pegawai-produkdiklat.component';

describe('MapPegawaiProdukdiklatComponent', () => {
  let component: MapPegawaiProdukdiklatComponent;
  let fixture: ComponentFixture<MapPegawaiProdukdiklatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPegawaiProdukdiklatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPegawaiProdukdiklatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
