import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDiklatjurusanProdukComponent } from './map-diklatjurusan-produk.component';

describe('MapDiklatjurusanProdukComponent', () => {
  let component: MapDiklatjurusanProdukComponent;
  let fixture: ComponentFixture<MapDiklatjurusanProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDiklatjurusanProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDiklatjurusanProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
