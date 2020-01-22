import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStrukturGajiByJaComponent } from './pegawai-struktur-gaji-by-ja.component';

describe('PegawaiStrukturGajiByJaComponent', () => {
  let component: PegawaiStrukturGajiByJaComponent;
  let fixture: ComponentFixture<PegawaiStrukturGajiByJaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStrukturGajiByJaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStrukturGajiByJaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
