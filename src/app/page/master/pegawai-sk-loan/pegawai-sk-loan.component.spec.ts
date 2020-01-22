import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiSkLoanComponent } from './pegawai-sk-loan.component';

describe('PegawaiSkLoanComponent', () => {
  let component: PegawaiSkLoanComponent;
  let fixture: ComponentFixture<PegawaiSkLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PegawaiSkLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegawaiSkLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
