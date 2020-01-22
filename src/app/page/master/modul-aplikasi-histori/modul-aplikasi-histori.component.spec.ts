import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulAplikasiHistoriComponent } from './modul-aplikasi-histori.component';

describe('ModulAplikasiHistoriComponent', () => {
  let component: ModulAplikasiHistoriComponent;
  let fixture: ComponentFixture<ModulAplikasiHistoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulAplikasiHistoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulAplikasiHistoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
