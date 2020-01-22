import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapModulAplikasiToObjekModulAplikasiComponent } from './map-modul-aplikasi-to-objek-modul-aplikasi.component';

describe('MapModulAplikasiToObjekModulAplikasiComponent', () => {
  let component: MapModulAplikasiToObjekModulAplikasiComponent;
  let fixture: ComponentFixture<MapModulAplikasiToObjekModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapModulAplikasiToObjekModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapModulAplikasiToObjekModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
