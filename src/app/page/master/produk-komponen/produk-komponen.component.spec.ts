import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdukKomponenComponent } from './produk-komponen.component';

describe('ProdukKomponenComponent', () => {
  let component: ProdukKomponenComponent;
  let fixture: ComponentFixture<ProdukKomponenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdukKomponenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdukKomponenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
