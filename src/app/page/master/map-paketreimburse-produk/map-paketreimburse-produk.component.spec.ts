import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPaketreimburseProdukComponent } from './map-paketreimburse-produk.component';

describe('MapPaketreimburseProdukComponent', () => {
  let component: MapPaketreimburseProdukComponent;
  let fixture: ComponentFixture<MapPaketreimburseProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPaketreimburseProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPaketreimburseProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
