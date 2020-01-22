import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStrukturGajiByGolonganComponent } from './pegawai-struktur-gaji-by-golongan.component';

describe('PegawaiStrukturGajiByGolonganComponent', () => {
  let component: PegawaiStrukturGajiByGolonganComponent;
  let fixture: ComponentFixture<PegawaiStrukturGajiByGolonganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStrukturGajiByGolonganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStrukturGajiByGolonganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
