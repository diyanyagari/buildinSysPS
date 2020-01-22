import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdusenProdukComponent } from './produsen-produk.component';

describe('ProdusenProdukComponent', () => {
  let component: ProdusenProdukComponent;
  let fixture: ComponentFixture<ProdusenProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdusenProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdusenProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
