import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKelompokTransaksiToRuanganComponent } from './map-kelompok-transaksi-to-ruangan.component';

describe('MapKelompokTransaksiToRuanganComponent', () => {
  let component: MapKelompokTransaksiToRuanganComponent;
  let fixture: ComponentFixture<MapKelompokTransaksiToRuanganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapKelompokTransaksiToRuanganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKelompokTransaksiToRuanganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
