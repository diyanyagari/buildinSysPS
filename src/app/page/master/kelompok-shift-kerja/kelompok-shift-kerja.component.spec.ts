import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelompokShiftKerjaComponent } from './kelompok-shift-kerja.component';

describe('KelompokShiftKerjaComponent', () => {
  let component: KelompokShiftKerjaComponent;
  let fixture: ComponentFixture<KelompokShiftKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelompokShiftKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelompokShiftKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
