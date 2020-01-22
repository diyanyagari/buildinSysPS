import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftKerjaComponent } from './shift-kerja.component';

describe('ShiftKerjaComponent', () => {
  let component: ShiftKerjaComponent;
  let fixture: ComponentFixture<ShiftKerjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftKerjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftKerjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
