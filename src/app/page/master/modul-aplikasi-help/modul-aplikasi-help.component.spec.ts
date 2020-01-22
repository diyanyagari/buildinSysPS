import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulAplikasiHelpComponent } from './modul-aplikasi-help.component';

describe('ModulAplikasiHelpComponent', () => {
  let component: ModulAplikasiHelpComponent;
  let fixture: ComponentFixture<ModulAplikasiHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulAplikasiHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulAplikasiHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
