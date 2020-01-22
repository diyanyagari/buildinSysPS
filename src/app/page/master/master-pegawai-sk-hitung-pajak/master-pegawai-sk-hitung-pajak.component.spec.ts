import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPegawaiSkHitungPajakComponent } from './master-pegawai-sk-hitung-pajak.component';

describe('MasterPegawaiSkHitungPajakComponent', () => {
  let component: MasterPegawaiSkHitungPajakComponent;
  let fixture: ComponentFixture<MasterPegawaiSkHitungPajakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPegawaiSkHitungPajakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPegawaiSkHitungPajakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
