import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftKerjaFormulasiComponent } from './shift-kerja-formulasi.component';

describe('ShiftKerjaFormulasiComponent', () => {
  let component: ShiftKerjaFormulasiComponent;
  let fixture: ComponentFixture<ShiftKerjaFormulasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftKerjaFormulasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftKerjaFormulasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
