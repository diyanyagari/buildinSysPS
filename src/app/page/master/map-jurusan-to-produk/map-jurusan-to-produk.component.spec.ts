import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapJurusanToProdukComponent } from './map-jurusan-to-produk.component';

describe('MapJurusanToProdukComponent', () => {
  let component: MapJurusanToProdukComponent;
  let fixture: ComponentFixture<MapJurusanToProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapJurusanToProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapJurusanToProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
