import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrasiPasienBaruComponent } from './registrasi-pasien-baru.component';

describe('RegistrasiPasienBaruComponent', () => {
  let component: RegistrasiPasienBaruComponent;
  let fixture: ComponentFixture<RegistrasiPasienBaruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrasiPasienBaruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrasiPasienBaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
