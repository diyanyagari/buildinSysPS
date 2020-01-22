import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProdukSatuanstndarComponent } from './map-produk-satuanstndar.component';

describe('MapProdukSatuanstndarComponent', () => {
  let component: MapProdukSatuanstndarComponent;
  let fixture: ComponentFixture<MapProdukSatuanstndarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProdukSatuanstndarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProdukSatuanstndarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
