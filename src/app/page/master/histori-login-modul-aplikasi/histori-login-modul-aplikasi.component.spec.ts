import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriLoginModulAplikasiComponent } from './histori-login-modul-aplikasi.component';

describe('HistoriLoginModulAplikasiComponent', () => {
  let component: HistoriLoginModulAplikasiComponent;
  let fixture: ComponentFixture<HistoriLoginModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriLoginModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriLoginModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
