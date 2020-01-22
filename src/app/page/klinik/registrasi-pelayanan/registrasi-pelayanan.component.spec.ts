import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrasiPelayananComponent } from './registrasi-pelayanan.component';

describe('RegistrasiPelayananComponent', () => {
  let component: RegistrasiPelayananComponent;
  let fixture: ComponentFixture<RegistrasiPelayananComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrasiPelayananComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrasiPelayananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
