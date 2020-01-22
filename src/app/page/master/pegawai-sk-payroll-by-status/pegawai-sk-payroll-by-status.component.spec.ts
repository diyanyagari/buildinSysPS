import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkPayrollByStatusComponent } from './pegawai-sk-payroll-by-status.component';

describe('PegawaiSkPayrollByStatusComponent', () => {
  let component: PegawaiSkPayrollByStatusComponent;
  let fixture: ComponentFixture<PegawaiSkPayrollByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkPayrollByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkPayrollByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
