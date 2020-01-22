import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStrukturGajiByMakapeComponent } from './pegawai-struktur-gaji-by-makape.component';

describe('PegawaiStrukturGajiByMakapeComponent', () => {
  let component: PegawaiStrukturGajiByMakapeComponent;
  let fixture: ComponentFixture<PegawaiStrukturGajiByMakapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStrukturGajiByMakapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStrukturGajiByMakapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
