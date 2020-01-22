import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPegawaiSkHitungPayrollComponent } from './master-pegawai-sk-hitung-payroll.component';

describe('MasterPegawaiSkHitungPayrollComponent', () => {
  let component: MasterPegawaiSkHitungPayrollComponent;
  let fixture: ComponentFixture<MasterPegawaiSkHitungPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPegawaiSkHitungPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPegawaiSkHitungPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
