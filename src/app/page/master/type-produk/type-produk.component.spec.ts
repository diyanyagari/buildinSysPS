import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProdukComponent } from './type-produk.component';

describe('TypeProdukComponent', () => {
  let component: TypeProdukComponent;
  let fixture: ComponentFixture<TypeProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
