import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KondisiProdukComponent } from './kondisi-produk.component';

describe('KondisiProdukComponent', () => {
  let component: KondisiProdukComponent;
  let fixture: ComponentFixture<KondisiProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KondisiProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KondisiProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
