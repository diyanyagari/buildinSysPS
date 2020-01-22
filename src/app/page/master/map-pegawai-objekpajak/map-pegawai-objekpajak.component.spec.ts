import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPegawaiObjekpajakComponent } from './map-pegawai-objekpajak.component';

describe('MapPegawaiObjekpajakComponent', () => {
  let component: MapPegawaiObjekpajakComponent;
  let fixture: ComponentFixture<MapPegawaiObjekpajakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPegawaiObjekpajakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPegawaiObjekpajakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
