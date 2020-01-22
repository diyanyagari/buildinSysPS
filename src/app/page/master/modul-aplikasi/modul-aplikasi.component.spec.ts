import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulAplikasiComponent } from './modul-aplikasi.component';

describe('ModulAplikasiComponent', () => {
  let component: ModulAplikasiComponent;
  let fixture: ComponentFixture<ModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
