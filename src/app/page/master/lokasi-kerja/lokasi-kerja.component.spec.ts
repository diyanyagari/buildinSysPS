import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LokasiKerjaComponent } from './lokasi-kerja.component';

describe('LokasiKerjaComponent', () => {
  let component: LokasiKerjaComponent;
  let fixture: ComponentFixture<LokasiKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LokasiKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LokasiKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
