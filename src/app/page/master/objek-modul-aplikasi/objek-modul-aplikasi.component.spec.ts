import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjekModulAplikasiComponent } from './objek-modul-aplikasi.component';

describe('ObjekModulAplikasiComponent', () => {
  let component: ObjekModulAplikasiComponent;
  let fixture: ComponentFixture<ObjekModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjekModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjekModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
