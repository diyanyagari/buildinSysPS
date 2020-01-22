import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MekanismeInteraksiProdukComponent } from './mekanisme-interaksi-produk.component';

describe('MekanismeInteraksiProdukComponent', () => {
  let component: MekanismeInteraksiProdukComponent;
  let fixture: ComponentFixture<MekanismeInteraksiProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MekanismeInteraksiProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MekanismeInteraksiProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
