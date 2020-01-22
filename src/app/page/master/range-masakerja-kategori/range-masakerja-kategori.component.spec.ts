import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasaKerjaKategoriComponent } from './ruangan.component';

describe('RangeMasaKerjaKategoriComponent', () => {
  let component: RangeMasaKerjaKategoriComponent;
  let fixture: ComponentFixture<RangeMasaKerjaKategoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasaKerjaKategoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasaKerjaKategoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
