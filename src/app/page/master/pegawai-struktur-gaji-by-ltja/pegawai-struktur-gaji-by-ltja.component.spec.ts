import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStrukturGajiByLtjaComponent } from './pegawai-struktur-gaji-by-ltja.component';

describe('PegawaiStrukturGajiByLtjaComponent', () => {
  let component: PegawaiStrukturGajiByLtjaComponent;
  let fixture: ComponentFixture<PegawaiStrukturGajiByLtjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStrukturGajiByLtjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStrukturGajiByLtjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
