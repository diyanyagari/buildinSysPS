import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompoktransaksiRuanganComponent } from './map-kelompoktransaksi-ruangan.component';

describe('MapKelompoktransaksiRuanganComponent', () => {
  let component: MapKelompoktransaksiRuanganComponent;
  let fixture: ComponentFixture<MapKelompoktransaksiRuanganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompoktransaksiRuanganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompoktransaksiRuanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
