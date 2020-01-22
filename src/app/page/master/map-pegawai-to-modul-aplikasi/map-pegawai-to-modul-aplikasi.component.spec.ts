import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPegawaiToModulAplikasiComponent } from './map-pegawai-to-modul-aplikasi.component';

describe('MapPegawaiToModulAplikasiComponent', () => {
  let component: MapPegawaiToModulAplikasiComponent;
  let fixture: ComponentFixture<MapPegawaiToModulAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPegawaiToModulAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPegawaiToModulAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
