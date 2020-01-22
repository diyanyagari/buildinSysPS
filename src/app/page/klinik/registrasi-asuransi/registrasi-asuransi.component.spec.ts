import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrasiAsuransiComponent } from './registrasi-asuransi.component';

describe('RegistrasiAsuransiComponent', () => {
  let component: RegistrasiAsuransiComponent;
  let fixture: ComponentFixture<RegistrasiAsuransiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrasiAsuransiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrasiAsuransiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
