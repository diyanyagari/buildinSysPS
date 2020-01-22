import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPaketMedicalToProdukComponent } from './map-paket-medical-to-produk.component';

describe('MapPaketMedicalToProdukComponent', () => {
  let component: MapPaketMedicalToProdukComponent;
  let fixture: ComponentFixture<MapPaketMedicalToProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPaketMedicalToProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPaketMedicalToProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
