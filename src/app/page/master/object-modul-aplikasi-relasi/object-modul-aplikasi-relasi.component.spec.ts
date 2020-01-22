import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectModulAplikasiRelasiComponent } from './object-modul-aplikasi-relasi.component';

describe('ObjectModulAplikasiRelasiComponent', () => {
  let component: ObjectModulAplikasiRelasiComponent;
  let fixture: ComponentFixture<ObjectModulAplikasiRelasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectModulAplikasiRelasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectModulAplikasiRelasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
