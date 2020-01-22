import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulAplikasiLanguageComponent } from './modul-aplikasi-language.component';

describe('ModulAplikasiLanguageComponent', () => {
  let component: ModulAplikasiLanguageComponent;
  let fixture: ComponentFixture<ModulAplikasiLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulAplikasiLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulAplikasiLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
