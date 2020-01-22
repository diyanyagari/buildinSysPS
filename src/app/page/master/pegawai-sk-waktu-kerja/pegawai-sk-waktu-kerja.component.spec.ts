import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkWaktuKerjaComponent } from './kecamatan.component';

describe('PegawaiSkWaktuKerjaComponent', () => {
  let component: PegawaiSkWaktuKerjaComponent;
  let fixture: ComponentFixture<PegawaiSkWaktuKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkWaktuKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkWaktuKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
