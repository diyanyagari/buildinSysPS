import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BahanProdukComponent } from './bahan-produk.component';

describe('BahanProdukComponent', () => {
  let component: BahanProdukComponent;
  let fixture: ComponentFixture<BahanProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BahanProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BahanProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
