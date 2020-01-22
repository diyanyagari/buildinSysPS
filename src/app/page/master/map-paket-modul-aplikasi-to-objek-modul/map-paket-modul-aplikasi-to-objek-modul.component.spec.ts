import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPaketModulAplikasiToObjekModulComponent } from './map-paket-modul-aplikasi-to-objek-modul.component';

describe('MapPaketModulAplikasiToObjekModulComponent', () => {
  let component: MapPaketModulAplikasiToObjekModulComponent;
  let fixture: ComponentFixture<MapPaketModulAplikasiToObjekModulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapPaketModulAplikasiToObjekModulComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPaketModulAplikasiToObjekModulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
