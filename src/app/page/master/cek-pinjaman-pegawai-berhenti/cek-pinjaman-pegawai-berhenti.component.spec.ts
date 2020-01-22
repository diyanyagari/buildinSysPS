import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CekPinjamanPegawaiBerhentiComponent } from './cek-pinjaman-pegawai-berhenti.component';

describe('CekPinjamanPegawaiBerhentiComponent', () => {
  let component: CekPinjamanPegawaiBerhentiComponent;
  let fixture: ComponentFixture<CekPinjamanPegawaiBerhentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CekPinjamanPegawaiBerhentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CekPinjamanPegawaiBerhentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
