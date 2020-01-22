import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRuanganToProdukComponent } from './map-ruangan-to-produk.component';

describe('MapRuanganToProdukComponent', () => {
  let component: MapRuanganToProdukComponent;
  let fixture: ComponentFixture<MapRuanganToProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRuanganToProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRuanganToProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
