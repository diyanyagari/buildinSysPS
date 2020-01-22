import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiStrukturGajiComponent } from './pegawai-struktur-gaji.component';

describe('PegawaiStrukturGajiComponent', () => {
  let component: PegawaiStrukturGajiComponent;
  let fixture: ComponentFixture<PegawaiStrukturGajiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiStrukturGajiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiStrukturGajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
