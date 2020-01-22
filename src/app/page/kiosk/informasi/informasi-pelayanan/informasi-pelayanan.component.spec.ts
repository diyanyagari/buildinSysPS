import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformasiPelayananComponent } from './informasi-pelayanan.component';

describe('InformasiPelayananComponent', () => {
  let component: InformasiPelayananComponent;
  let fixture: ComponentFixture<InformasiPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformasiPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformasiPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
