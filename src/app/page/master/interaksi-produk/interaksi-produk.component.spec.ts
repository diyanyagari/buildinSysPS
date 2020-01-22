import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteraksiProdukComponent } from './interaksi-produk.component';

describe('InteraksiProdukComponent', () => {
  let component: InteraksiProdukComponent;
  let fixture: ComponentFixture<InteraksiProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteraksiProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteraksiProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
