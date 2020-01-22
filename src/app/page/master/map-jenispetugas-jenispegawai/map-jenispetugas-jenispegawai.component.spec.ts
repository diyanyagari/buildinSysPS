import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapJenispetugasJenispegawaiComponent } from './map-jenispetugas-jenispegawai.component';

describe('MapJenispetugasJenispegawaiComponent', () => {
  let component: MapJenispetugasJenispegawaiComponent;
  let fixture: ComponentFixture<MapJenispetugasJenispegawaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapJenispetugasJenispegawaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapJenispetugasJenispegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
