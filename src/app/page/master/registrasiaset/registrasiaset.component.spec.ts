import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajuanPinjamanComponent } from './pengajuanpinjaman.component';

describe('PengajuanPinjamanComponent', () => {
  let component: PengajuanPinjamanComponent;
  let fixture: ComponentFixture<PengajuanPinjamanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengajuanPinjamanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengajuanPinjamanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
