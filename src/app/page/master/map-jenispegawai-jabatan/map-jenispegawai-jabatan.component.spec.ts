import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapJenispegawaiJabatanComponent } from './map-jenispegawai-jabatan.component';

describe('MapJenispegawaiJabatanComponent', () => {
  let component: MapJenispegawaiJabatanComponent;
  let fixture: ComponentFixture<MapJenispegawaiJabatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapJenispegawaiJabatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapJenispegawaiJabatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
