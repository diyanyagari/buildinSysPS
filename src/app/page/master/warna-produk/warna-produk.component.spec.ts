import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnaProdukComponent } from './warna-produk.component';

describe('WarnaProdukComponent', () => {
  let component: WarnaProdukComponent;
  let fixture: ComponentFixture<WarnaProdukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarnaProdukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnaProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
