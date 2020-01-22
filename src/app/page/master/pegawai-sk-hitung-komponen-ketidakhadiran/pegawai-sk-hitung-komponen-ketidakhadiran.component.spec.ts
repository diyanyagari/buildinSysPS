import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkHitungKomponenKetidakhadiranComponent } from './pegawai-sk-hitung-komponen-ketidakhadiran.component';

describe('PegawaiSkHitungKomponenKetidakhadiranComponent', () => {
  let component: PegawaiSkHitungKomponenKetidakhadiranComponent;
  let fixture: ComponentFixture<PegawaiSkHitungKomponenKetidakhadiranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkHitungKomponenKetidakhadiranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkHitungKomponenKetidakhadiranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
