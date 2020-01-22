import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPaketModulAplikasiToProdukComponent } from './map-paket-modul-aplikasi-to-produk.component';

describe('MapPaketModulAplikasiToProdukComponent', () => {
  let component: MapPaketModulAplikasiToProdukComponent;
  let fixture: ComponentFixture<MapPaketModulAplikasiToProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapPaketModulAplikasiToProdukComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPaketModulAplikasiToProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
