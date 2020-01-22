import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPaketReimburseToProdukComponent } from './map-paket-reimburse-to-produk.component';

describe('MapPaketReimburseToProdukComponent', () => {
  let component: MapPaketReimburseToProdukComponent;
  let fixture: ComponentFixture<MapPaketReimburseToProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPaketReimburseToProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPaketReimburseToProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
