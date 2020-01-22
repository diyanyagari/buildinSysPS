import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HargaNettoProdukBykelasComponent } from './harga-netto-produk-bykelas.component';

describe('HargaNettoProdukBykelasComponent', () => {
  let component: HargaNettoProdukBykelasComponent;
  let fixture: ComponentFixture<HargaNettoProdukBykelasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HargaNettoProdukBykelasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HargaNettoProdukBykelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
