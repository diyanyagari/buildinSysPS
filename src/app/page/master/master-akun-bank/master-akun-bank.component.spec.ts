import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAkunBank } from './master-akun-bank.component';

describe('MasterAkunBank', () => {
  let component: MasterAkunBank;
  let fixture: ComponentFixture<MasterAkunBank>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MasterAkunBank]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAkunBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
