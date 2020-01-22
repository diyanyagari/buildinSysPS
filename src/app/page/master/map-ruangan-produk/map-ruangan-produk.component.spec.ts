import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganProdukComponent } from './map-ruangan-produk.component';

describe('MapRuanganProdukComponent', () => {
  let component: MapRuanganProdukComponent;
  let fixture: ComponentFixture<MapRuanganProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
