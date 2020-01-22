import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkHitungKomponenKeterlambatanComponent } from './pegawai-sk-hitung-komponen-keterlambatan.component';

describe('PegawaiSkHitungKomponenKeterlambatanComponent', () => {
  let component: PegawaiSkHitungKomponenKeterlambatanComponent;
  let fixture: ComponentFixture<PegawaiSkHitungKomponenKeterlambatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkHitungKomponenKeterlambatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkHitungKomponenKeterlambatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
