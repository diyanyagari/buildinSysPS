import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserAplikasiComponent } from './login-user-aplikasi.component';

describe('LoginUserAplikasiComponent', () => {
  let component: LoginUserAplikasiComponent;
  let fixture: ComponentFixture<LoginUserAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginUserAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUserAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
