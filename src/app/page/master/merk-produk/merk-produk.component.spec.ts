import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerkProdukComponent } from './merk-produk.component';

describe('MerkProdukComponent', () => {
  let component: MerkProdukComponent;
  let fixture: ComponentFixture<MerkProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerkProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerkProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
