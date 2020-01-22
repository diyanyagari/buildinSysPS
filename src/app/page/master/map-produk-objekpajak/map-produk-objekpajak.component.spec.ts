import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProdukObjekpajakComponent } from './map-produk-objekpajak.component';

describe('MapProdukObjekpajakComponent', () => {
  let component: MapProdukObjekpajakComponent;
  let fixture: ComponentFixture<MapProdukObjekpajakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProdukObjekpajakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProdukObjekpajakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
