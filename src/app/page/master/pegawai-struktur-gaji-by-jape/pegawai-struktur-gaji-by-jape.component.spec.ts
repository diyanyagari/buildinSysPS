import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStrukturGajiByJapeComponent } from './pegawai-struktur-gaji-by-jape.component';

describe('PegawaiStrukturGajiByJapeComponent', () => {
  let component: PegawaiStrukturGajiByJapeComponent;
  let fixture: ComponentFixture<PegawaiStrukturGajiByJapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStrukturGajiByJapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStrukturGajiByJapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
