import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapObjekModulToModulAplikasiComponent } from './map-objek-modul-to-modul-aplikasi.component';

describe('MapObjekModulToModulAplikasiComponent', () => {
  let component: MapObjekModulToModulAplikasiComponent;
  let fixture: ComponentFixture<MapObjekModulToModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapObjekModulToModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapObjekModulToModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
